import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { CONTINENTS, INITIAL_ZOOM, INITIAL_PITCH, INITIAL_BEARING } from '../components/LocationSelector'
import { LAYERS_CONFIG } from '../components/LayersPanel'
import { DEFAULT_RELIGION_ICONS, getIconUrl } from '../utils/mapStyleConfig'
import { GetServerUrl } from '../lib/mapcore/utils'
import { default as MapCoreViewer, MapCoreHelper } from '../lib/mapcore/mc-api'
import { aViewports, editMode } from '../lib/mapcore/mc-api'

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

  // Convert zoom level to 2D mapcore scale
  const zoomToScale = (zoom) => {
    return zoom == 30 ? 1 : zoom < 30 ? (30 - zoom) : 1 / (zoom - 30);
  }

  // Convert 2D mapcore scale to zoom level
  const scaleToZoom = (scale) => {
    return scale == 1 ? 30 : scale > 1 ? (30 - scale) : 30 + 1 / scale;
  }

  const setScale = (scale) => {
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
        MapCoreHelper.current.SetCamera2DViewScale(zoomToScale(INITIAL_ZOOM));
      }
    },
    getCamera: () => {
      if (!aViewports || aViewports.length === 0) return null
      const viewport = currentViewMode.current === '3d' ? 
                aViewports.length > 1 ? aViewports[1]?.viewport : aViewports[0]?.viewport :
                aViewports[0]?.viewport;
      if (!viewport) return null

      let pYaw = {};
      let pPitch = {};
      let pRoll = {};
      
      let position = viewport.GetCameraPosition();
      viewport.GetCameraOrientation(pYaw, pPitch, pRoll)
      position = MapCoreHelper.current.convertToGeo(position);
      return {
        center: [position.x / 100000.0, position.y / 100000.0],
        zoom: altitudeToZoom(position.z), 
        pitch: 90 + pPitch.Value,
        bearing: (90 - pYaw.Value)
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
        if (viewMode === '2d') {
          _initialZoom = scaleToZoom(INITIAL_ZOOM);
        }
        const utmCenter = mapCoreHelper.current.convertToUtm(
          { x: location.coords[0] * 100000.0, 
            y: location.coords[1] * 100000.0, 
            z: zoomToAltitude(_initialZoom) });

        // Set the initial location
        mapCoreHelper.current.SetInitialLocation(utmCenter);

        // Open the terrain
        setAction({ action: 'OPEN_TERRAIN', 
          mode: viewMode === '3d' ? '3D' : '2D', 
          remoteUrl: GOOGLE_3D_TILES_URL,
          remoteToken: GOOGLE_API_KEY,
          remoteBaseUrl: WAYBACK_MAPTILES_WMTS_URL,
          remoteWmtsLayersList: WAYBACK_MAPTILES_WMTS_LAYERS_LIST,
          remoteWmtsTilingScheme: WMTS_TILING_SCHEME,
          remoteType: "MODEL",
          remoteEpsg: 3857,
          count: counterRef.current++ })
  }


  // Initialize MapCore WASM
  useEffect(() => {

    // Check if already initialized globally
    if (globalMapInitialized && window.MapCore) {
      setMapCoreInitialized(true)
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
        { x: location.coords[0] * 100000.0, 
          y: location.coords[1] * 100000.0, 
          z: zoomToAltitude(_initialZoom) });
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
    if (mode !== viewMode) {
      setAction({ action: 'OPEN_TERRAIN', 
        mode: viewMode === '3d' ? '3D' : '2D', 
        remoteUrl: GOOGLE_3D_TILES_URL,
        remoteToken: GOOGLE_API_KEY,
        remoteBaseUrl: WAYBACK_MAPTILES_WMTS_URL,
        remoteWmtsTilingScheme: WMTS_TILING_SCHEME,
        remoteWmtsLayersList: WAYBACK_MAPTILES_WMTS_LAYERS_LIST,
        remoteType: "MODEL",
        remoteEpsg: 3857,
        count: counterRef.current++ })
    }
    // MapCoreViewer handles 2D/3D switching through viewports
    if (isActiveRef.current) {
      // setAction({ action: 'OPEN_TERRAIN', mode: viewMode === '3d' ? '3D' : '2D', count: counterRef.current++ })
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
    if (!aViewports || aViewports.length === 0) return
    // Update layer visibility using MapCore API
    // Implementation depends on your layer management
  }, [layers])

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
)})

MapCore.displayName = 'MapCore'

export default MapCore