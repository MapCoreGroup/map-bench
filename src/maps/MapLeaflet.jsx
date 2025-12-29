import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

import { CONTINENTS, INITIAL_ZOOM } from '../components/LocationSelector'
import { loadMapStyle, getReligionIconUrls, getIconUrl } from '../utils/mapStyleConfig'

const RELIGION_COLORS = {
  jewish: '#3b82f6',
  muslim: '#10b981',
  christian: '#ef4444',
  buddhist: '#f59e0b',
  hindu: '#8b5cf6',
  shinto: '#ec4899',
  default: '#64748b'
}

// Helper for radius interpolation
function getRadiusForZoom(zoom) {
  if (zoom <= 10) return 2; // Smaller at low zoom
  if (zoom >= 18) return 10;
  return 2 + (zoom - 10) * ((10 - 2) / (18 - 10));
}

const MapLeaflet = forwardRef(({ currentLocation, viewMode, isActive, onTileLoad, layers, initialCamera }, ref) => {
  const mapContainer = useRef(null)
  const mapInstance = useRef(null)
  const isMapLoaded = useRef(false)
  
  // Layer references
  const powerLinesLayer = useRef(null)
  const religiousBuildingsLayer = useRef(null)
  
  // State to track initial location to prevent unwanted flyTo on mount
  const initialLocationRef = useRef(currentLocation)
  const initialCameraOnMount = useRef(initialCamera)

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getCamera: () => {
      if (!mapInstance.current) return null
      const center = mapInstance.current.getCenter()
      const zoom = mapInstance.current.getZoom()
      return {
        center: [center.lng, center.lat], // Return [lng, lat]
        zoom: zoom,
        pitch: 0, // Leaflet is 2D
        bearing: 0 // Leaflet is 2D
      }
    },
    flyTo: (continentKey, cityKey) => {
      const continent = CONTINENTS[continentKey]
      if (!continent) return
      const location = continent.locations[cityKey]
      if (!location || !mapInstance.current) return

      // Leaflet uses [lat, lng]
      mapInstance.current.flyTo([location.coords[1], location.coords[0]], INITIAL_ZOOM, {
        duration: 2
      })
    }
  }))

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    // Determine initial view
    let center = [40.7128, -74.0060] // Default NY
    let zoom = 13

    if (initialCamera) {
      center = [initialCamera.center[1], initialCamera.center[0]] // [lat, lng]
      zoom = initialCamera.zoom
    } else if (currentLocation) {
      const continent = CONTINENTS[currentLocation.continent]
      if (continent) {
        const city = continent.locations[currentLocation.city]
        if (city) {
          center = [city.coords[1], city.coords[0]]
        }
      }
    }

    const map = L.map(mapContainer.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    })

    // Add Esri World Imagery (Satellite) tiles
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(map)

    mapInstance.current = map
    isMapLoaded.current = true

    // Trigger tile load callback (simulated)
    if (onTileLoad) {
      map.on('load', () => onTileLoad(1))
      map.on('moveend', () => onTileLoad(1))
    }

    // Load Map Style and Data
    loadMapStyle().then(async (style) => {
      const religionIcons = getReligionIconUrls(style)
      
      // 1. Load Power Lines
      try {
        const powerLinesSource = style.sources['power-lines']
        if (powerLinesSource && powerLinesSource.data) {
          const response = await fetch(powerLinesSource.data)
          const data = await response.json()
          
          powerLinesLayer.current = L.geoJSON(data, {
            style: {
              color: '#ffdc00',
              weight: 4,
              opacity: 0.8
            }
          })
          
          // Initial visibility check
          if (layers && layers['power-lines']?.visible) {
            powerLinesLayer.current.addTo(map)
          }
        }
      } catch (err) {
        console.error('Failed to load power lines:', err)
      }

      // 2. Load Religious Buildings
      try {
        const religiousSource = style.sources['religious-buildings']
        if (religiousSource && religiousSource.data) {
          const response = await fetch(religiousSource.data)
          const data = await response.json()
          
          religiousBuildingsLayer.current = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
              const religion = feature.properties.religion || 'default'
              const color = RELIGION_COLORS[religion] || RELIGION_COLORS.default
              
              // Calculate radius based on initial zoom
              const currentZoom = map.getZoom()
              const radius = getRadiusForZoom(currentZoom)

              return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              })
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name)
              }
            }
          })

          // Initial visibility check
          if (layers && layers['religious-buildings']?.visible) {
            religiousBuildingsLayer.current.addTo(map)
          }
        }
      } catch (err) {
        console.error('Failed to load religious buildings:', err)
      }
    })

    // Update radius on zoom
    const handleZoomEnd = () => {
      if (religiousBuildingsLayer.current) {
        const currentZoom = map.getZoom()
        const newRadius = getRadiusForZoom(currentZoom)
        religiousBuildingsLayer.current.eachLayer(layer => {
          if (layer.setRadius) {
            layer.setRadius(newRadius)
          }
        })
      }
    }

    map.on('zoomend', handleZoomEnd)

    return () => {
      map.off('zoomend', handleZoomEnd)
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  // Handle Location Changes
  useEffect(() => {
    if (!mapInstance.current || !currentLocation) return

    // If we initialized with a specific camera (initialCamera), 
    // we want to avoid flying to the currentLocation on mount.
    // We only fly if the location has actually changed since mount.
    if (initialCameraOnMount.current && currentLocation === initialLocationRef.current) {
      return
    }

    const continent = CONTINENTS[currentLocation.continent]
    if (!continent) return
    const location = continent.locations[currentLocation.city]
    if (!location) return

    mapInstance.current.flyTo([location.coords[1], location.coords[0]], INITIAL_ZOOM, {
      duration: 2
    })
  }, [currentLocation])

  // Handle Layer Visibility
  useEffect(() => {
    if (!mapInstance.current) return
    
    // Power Lines
    if (powerLinesLayer.current) {
      if (layers['power-lines']?.visible) {
        if (!mapInstance.current.hasLayer(powerLinesLayer.current)) {
          powerLinesLayer.current.addTo(mapInstance.current)
        }
      } else {
        if (mapInstance.current.hasLayer(powerLinesLayer.current)) {
          mapInstance.current.removeLayer(powerLinesLayer.current)
        }
      }
    }

    // Religious Buildings
    if (religiousBuildingsLayer.current) {
      if (layers['religious-buildings']?.visible) {
        if (!mapInstance.current.hasLayer(religiousBuildingsLayer.current)) {
          religiousBuildingsLayer.current.addTo(mapInstance.current)
        }
      } else {
        if (mapInstance.current.hasLayer(religiousBuildingsLayer.current)) {
          mapInstance.current.removeLayer(religiousBuildingsLayer.current)
        }
      }
    }
  }, [layers])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%', background: '#000' }} />
})

export default MapLeaflet
