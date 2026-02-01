import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { CONTINENTS, INITIAL_ZOOM, INITIAL_PITCH, INITIAL_BEARING } from '../components/LocationSelector'
import { LAYERS_CONFIG } from '../components/LayersPanel'
import { DEFAULT_RELIGION_ICONS, getIconUrl } from '../utils/mapStyleConfig'
import { GetServerUrl } from '../lib/mapcore/utils'
import { default as MapCoreViewer, MapCoreHelper, overlayManager } from '../lib/mapcore/mc-api'
import { aViewports, editMode } from '../lib/mapcore/mc-api'
import { McObjectsManagerService } from '../lib/mapcore/mc-objects-manager'
import { flightTracker } from '../dynamic-layers/flightTracker'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_3D_TILES_URL = import.meta.env.VITE_GOOGLE_3D_TILES_URL; //`http://localhost:5173/data/maps/3DTiles/tileset.json`
const WAYBACK_MAPTILES_WMTS_URL = import.meta.env.VITE_WAYBACK_MAPTILES_WMTS_URL;
const WMTS_TILING_SCHEME = import.meta.env.VITE_WMTS_TILING_SCHEME; //"google" or "wayback"
const WAYBACK_MAPTILES_WMTS_LAYERS_LIST = import.meta.env.VITE_WMTS_LAYERS_LIST;

// Move mapInitialized outside component to persist across mounts
let globalMapInitialized = false;

const MapCore = forwardRef(({ currentLocation, viewMode = '3d', isActive = true, onTileLoad, layers = {}, initialCamera = null }, ref) => {
  const [mapCoreInitialized, setMapCoreInitialized] = useState(false)
  const currentViewMode = useRef(viewMode)
  const isActiveRef = useRef(isActive)
  const hasSkippedFirstFlyTo = useRef(false)
  const initialCameraOnMount = useRef(initialCamera)
  const [action, setAction] = useState({ action: '' })
  const counterRef = useRef(1);
  const mapCoreHelper = useRef(null);
  // Convert altitude in meters to zoom level
  const altitudeToZoom = (altitudeInMeters) => {
    return Math.log2(591657550.5 / altitudeInMeters);
  }

  // Convert zoom level to altitude in meters
  const zoomToAltitude = (zoom) => {
    return 591657550.5 / Math.pow(2, zoom)
  }

  // Convert meters per pixel to zoom level (when 1:1 = 0.25 m/pixel)
  const metersPerPixelToZoom = (metersPerPixel) => {
    // Standard web mercator: at zoom 0, ~156,543 m/pixel at equator
    // Each zoom level halves the meters per pixel
    // Find zoom where 0.25 m/pixel occurs: 0.25 = 156543 / 2^zoom
    // 2^zoom = 156543 / 0.25 = 626172
    // zoom = log2(626172) ≈ 19.26

    // Calculate zoom: m/pixel = 156543 / 2^zoom
    // zoom = log2(156543 / m/pixel)
    return Math.log2(156543 / metersPerPixel);
  }

  // Convert zoom to meters per pixel
  const zoomToMetersPerPixel = (zoom) => {
    return 156543 / Math.pow(2, zoom);
  }

  // Convert scale factor (relative to 1:1) to zoom
  // Scale 1 = 0.25 m/pixel (most zoomed in)
  // Scale 2 = 0.5 m/pixel (2x zoom out)
  // Scale 4 = 1.0 m/pixel (4x zoom out)
  const scaleToZoom = (scaleFactor) => {
    // Scale increases = zoom out = more meters per pixel
    // metersPerPixel = 0.15 * scaleFactor
    const metersPerPixel = 0.15 * scaleFactor;
    return metersPerPixelToZoom(metersPerPixel);
  }

  // Convert zoom to scale factor (relative to 1:1 = 0.25 m/pixel)
  // Scale 1 = 0.15 m/pixel (most zoomed in)
  // Scale 2 = 0.3 m/pixel (2x zoom out)
  const zoomToScale = (zoom) => {
    const metersPerPixel = zoomToMetersPerPixel(zoom);
    // scaleFactor = metersPerPixel / 0.15
    return metersPerPixel / 0.15; // Scale factor relative to 1:1
  }

  const setViewportScale = (scale) => {
    if (!mapCoreHelper.current) return
    MapCoreHelper.SetCamera2DViewScale(scale)
  }


  // Expose methods to parent (matching the pattern from other map components)
  useImperativeHandle(ref, () => ({
    flyTo: (continentKey, cityKey) => {
      const continent = CONTINENTS[continentKey]
      if (!continent) return
      const location = continent.locations[cityKey]
      if (!location || !aViewports || aViewports.length === 0) return

      let utmCoords = { x: location.coords[0] * 100000.0, y: location.coords[1] * 100000.0, z: zoomToAltitude(INITIAL_ZOOM) };
      utmCoords = MapCoreHelper.current.convertToUtm(utmCoords);

      // Use MapCore viewport to fly to location
      const viewport = currentViewMode.current === '3d' ?
        aViewports.length > 1 ? aViewports[1]?.viewport : aViewports[0]?.viewport :
        aViewports[0]?.viewport;
      if (viewport) {
        viewport.SetCameraPosition({ x: utmCoords.x, y: utmCoords.y, z: utmCoords.z }, false)
        viewport.SetCameraOrientation(INITIAL_BEARING, viewMode === '3d' ? -90 + INITIAL_PITCH : 0, 0, false)
        MapCoreHelper.current.SetCamera2DViewScale(zoomToScale(INITIAL_ZOOM) - 6);
      }
    },
    getCamera: () => {
      if (!aViewports || aViewports.length === 0) return null
      const viewport = currentViewMode.current === '3d' ?
        aViewports.length > 1 ? aViewports[1]?.viewport : aViewports[0]?.viewport :
        aViewports[0]?.viewport;
      if (!viewport) return null

      if (!MapCoreHelper.current) {
        MapCoreHelper.current = new MapCoreHelper(4326, 3857);
      }

      let pYaw = {};
      let pPitch = {};
      let pRoll = {};

      let position = viewport.GetCameraPosition();
      viewport.GetCameraOrientation(pYaw, pPitch, pRoll)
      position = MapCoreHelper.current.convertToGeo(position);
      return {
        center: [position.x / 100000.0, position.y / 100000.0],
        zoom: currentViewMode.current === '3d' ? altitudeToZoom(position.z) : scaleToZoom(viewport.GetCameraScale()) - 4,
        pitch: currentViewMode.current === '3d' ? 90 + pPitch.Value : 0.0,
        bearing: (pYaw.Value)
      }
    },
    setCamera: (cameraState) => {
      if (!aViewports || aViewports.length === 0 || !cameraState) return

      const viewport = currentViewMode.current === '3d' ?
        aViewports.length > 1 ? aViewports[1]?.viewport : aViewports[0]?.viewport :
        aViewports[0]?.viewport;

      if (!viewport) return

      let position = { x: cameraState.center[0] * 100000.0, y: cameraState.center[1] * 100000.0, z: zoomToAltitude(cameraState.zoom) };
      position = MapCoreHelper.current.convertToUtm(position);

      viewport.SetCameraPosition(position, false)
      MapCoreHelper.current.SetCamera2DViewScale(zoomToScale(cameraState.zoom));
      const pitch = currentViewMode.current === '3d' ? cameraState.pitch : -90;
      viewport.SetCameraOrientation(cameraState.bearing, -90 + pitch, 0, false)
    }
  }), [])
  //#region Helpers
  const onExternalSourceReady = () => {
    console.log('External source ready');

    if (!mapCoreInitialized) return;

    // Create the mapcore helper
    // 4326 is the EPSG code for the geographic coordinate system
    // 3857 is the EPSG code for the UTM (World Geodetic System 1984) coordinate system
    // We use the UTM coordinate system because both the Google 3D Tiles and the WMTS layers are in the UTM coordinate system
    mapCoreHelper.current = new MapCoreHelper(4326, 3857);

    const continent = CONTINENTS[currentLocation.continent];
    if (!continent) return
    const location = continent.locations[currentLocation.city];
    if (!location) return
    isActiveRef.current = true;

    // Convert the default center point to the UTM coordinate system
    let _initialZoom = INITIAL_ZOOM;
    let _initialScale = 0.0;
    if (viewMode === '2d') {
      _initialScale = zoomToScale(INITIAL_ZOOM) - 6;
    }
    const utmCenter = mapCoreHelper.current.convertToUtm(
      {
        x: location.coords[0] * 100000.0,
        y: location.coords[1] * 100000.0,
        z: zoomToAltitude(_initialZoom)
      });

    mapCoreHelper.current.SetInitialScale(_initialScale);
    mapCoreHelper.current.SetInitialLocation(utmCenter);

    // Open the terrain
    setAction({
      action: 'OPEN_TERRAIN',
      mode: viewMode === '3d' ? '3D' : '2D',
      remoteUrl: GOOGLE_3D_TILES_URL,
      remoteToken: GOOGLE_API_KEY,
      remoteBaseUrl: WAYBACK_MAPTILES_WMTS_URL,
      remoteWmtsLayersList: WAYBACK_MAPTILES_WMTS_LAYERS_LIST,
      remoteWmtsTilingScheme: WMTS_TILING_SCHEME,
      remoteType: "MODEL",
      remoteEpsg: 3857,
      count: counterRef.current++
    })
  }
  //#endregion
  //#region UseEffects
  // Initialize MapCore WASM
  useEffect(() => {

    // Check if already initialized globally
    if (globalMapInitialized && window.MapCore) {
      setMapCoreInitialized(true);
      return
    }

    if (globalMapInitialized) return
    globalMapInitialized = true

    let isMounted = true

    const init = async () => {
      try {
        // Load MapCore WASM
        if (!window.MapCore && window.McStartMapCore) {
          console.log('Loading MapCore WASM...')
          await window.McStartMapCore({
            locateFile: (filename, directory) => {
              return `/package/${filename}`
            }
          })
          console.log('MapCore WASM loaded')
        }

        if (!window.MapCore) {
          console.error('MapCore failed to load')
          globalMapInitialized = false; //Reset global map initialized flag
          return
        }
        // Set initialized to true to trigger MapCoreViewer initialization
        setMapCoreInitialized(true)

      } catch (error) {
        console.error('Error initializing MapCore WASM:', error)
      }
    }

    init().then(() => {
      console.log('MapCore WASM initialized')
    }).catch((error) => {
      console.error('Error initializing MapCore WASM:', error)
    })
      .finally(() => {
        console.log('✓ MapCore: WASM initialized, viewer will start')
      });
  }, [])

  // Handle location changes - use MapCoreViewer's canvas/viewport
  useEffect(() => {
    if (!aViewports || aViewports.length === 0) return

    if (initialCameraOnMount.current && !hasSkippedFirstFlyTo.current) {
      hasSkippedFirstFlyTo.current = true
      if (!MapCoreHelper.current) {
        MapCoreHelper.current = new MapCoreHelper(4326, 3857);
      }
      // return
    }

    const continent = CONTINENTS[currentLocation.continent]
    if (!continent) return
    const location = continent.locations[currentLocation.city]
    if (!location) return

    // Use MapCoreViewer's viewport (canvas is managed by MapCoreViewer)
    const viewport = currentViewMode.current === '3d' ?
      aViewports.length > 1 ?
        aViewports[1]?.viewport : aViewports[0]?.viewport : aViewports[0]?.viewport;

    if (viewport) {
      const pitch = currentViewMode.current === '3d' ? INITIAL_PITCH : 0
      let _initialZoom = INITIAL_ZOOM;
      if (viewMode === '2d') {
        _initialZoom = scaleToZoom(INITIAL_ZOOM);
      }
      const utmLocation = mapCoreHelper.current.convertToUtm(
        {
          x: location.coords[0] * 100000.0,
          y: location.coords[1] * 100000.0,
          z: zoomToAltitude(_initialZoom + 4)
        });
      viewport.SetCameraPosition({ x: utmLocation.x, y: utmLocation.y, z: utmLocation.z }, false)
      viewport.SetCameraOrientation(INITIAL_BEARING, -90 + pitch, 0, false)
      if (viewMode === '2d') {
        MapCoreHelper.current.SetCamera2DViewScale(zoomToScale(_initialZoom));
      }
    }
  }, [currentLocation])

  // Handle view mode changes
  useEffect(() => {
    let mode = currentViewMode.current;
    currentViewMode.current = viewMode;
    if (mode !== viewMode && isActiveRef.current) {
      setAction({
        action: 'OPEN_TERRAIN',
        mode: viewMode === '3d' ? '3D' : '2D',
        remoteUrl: GOOGLE_3D_TILES_URL,
        remoteToken: GOOGLE_API_KEY,
        remoteBaseUrl: WAYBACK_MAPTILES_WMTS_URL,
        remoteWmtsTilingScheme: WMTS_TILING_SCHEME,
        remoteWmtsLayersList: WAYBACK_MAPTILES_WMTS_LAYERS_LIST,
        remoteType: "MODEL",
        remoteEpsg: 3857,
        count: counterRef.current++
      })
    }
  }, [viewMode])

  // Handle active state changes
  useEffect(() => {
    isActiveRef.current = isActive
    // if (!isActiveRef.current) {
    //   setAction({ action: 'CLOSE_MAP', count: counterRef.current++ })
    // }
  }, [isActive])

  // Handle layer visibility changes
  useEffect(() => {
    // Wait for overlayManager to be ready before overlays creation or setting overlay visibility
    const checkOverlayManager = setInterval(() => {
      if (overlayManager) {
        clearInterval(checkOverlayManager);

        // Power lines
        if (McObjectsManagerService.powerLinesOverlay) {
          McObjectsManagerService.setOverlayVisibility(McObjectsManagerService.powerLinesOverlay, layers['power-lines']?.visible);
        } else {
          McObjectsManagerService.createPowerLinesOverlay(layers['power-lines']?.visible);
        }

        // Religious buildings
        if (McObjectsManagerService.religiousBuildingsOverlay) {
          McObjectsManagerService.setOverlayVisibility(McObjectsManagerService.religiousBuildingsOverlay, layers['religious-buildings']?.visible);
        } else {
          McObjectsManagerService.createReligiousBuildingsOverlay(layers['religious-buildings']?.visible);
        }

        // Flights
        if (McObjectsManagerService.flightsOverlay) {
          McObjectsManagerService.setOverlayVisibility(McObjectsManagerService.flightsOverlay, layers['flight-tracking']?.visible);
        } else {
          McObjectsManagerService.createFlightsOverlay(layers['flight-tracking']?.visible);
        }
      }
    }, 1000);// Check every second

    return () => {
      clearInterval(checkOverlayManager)
    };
  }, [layers])
  useEffect(() => {
    if (layers['flight-tracking']?.visible) {
      // Update center
      const continent = CONTINENTS[currentLocation.continent]
      if (continent) {
        const location = continent.locations[currentLocation.city]
        if (location) {
          flightTracker.setCenter(location.coords[0], location.coords[1])
        }
      }

      // Subscribe to updates
      const unsubscribe = flightTracker.subscribe((data, paths) => {
        McObjectsManagerService.updateFlightsObjects(data, paths);
      })

      return () => {
        unsubscribe()
      }
    }
  }, [layers['flight-tracking']?.visible, currentLocation])
  //#endregion

  // MapCoreViewer handles all canvas creation, rendering, and mouse events
  // We just render it without any wrapper that might interfere
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'absolute',
      top: 0,
      left: 0
    }}>
      {mapCoreInitialized && (
        <MapCoreViewer
          action={action}
          cursorPos={null}
          crsUnits="Geo"
          availableGroups={null}
          group={GOOGLE_3D_TILES_URL}
          initialized={mapCoreInitialized}
          modelPath={null}
          modelFiles={null}
          availableLayers={null}
          mapStatus={null}
          onSelectedObject={null}
          onHeadingChange={null}
          onExternalSourceReady={() => {
            onExternalSourceReady()
          }}
          onTileLoad={onTileLoad}
        />
      )}
    </div>
  )
})

MapCore.displayName = 'MapCore'

export default MapCore