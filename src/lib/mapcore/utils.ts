/// <reference types="vite/client" />

// Utility functions for MapCore
export const GetServerUrl = (): string => {
  // Return your MapCore server URL
  return import.meta.env.VITE_MAPCORE_SERVER_URL || 'http://localhost:8080'
}

export const GetCapabilitiesUrl = (): string => {
  // Return your MapCore capabilities URL  
  return `${GetServerUrl()}/capabilities`
}