import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), cesium()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  optimizeDeps: {
    exclude: ['cesium'],
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'mersenne-twister',
      'urijs',
      'grapheme-splitter',
      'bitmap-sdf',
      'lerc',
      'nosleep.js'
    ]
  },
  server: {
    host: true,
    assetsInclude: ["**/*.wasm"],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zip.js/zip.js/lib/zip-no-worker.js': path.resolve(__dirname, 'node_modules/@zip.js/zip.js/lib/zip-core.js')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  build: {
    chunkSizeWarningLimit: 14000,
    // Explicitly set target and ensure ES modules
    target: 'esnext',
    minify: 'esbuild',
    commonjsOptions: {
      // Transform ALL CommonJS modules in node_modules, not just specific ones
      include: [/node_modules/],
      transformMixedEsModules: true,
      // Force transformation of all CommonJS require() calls to ES modules
      strictRequires: true,
      // Ensure default export handling
      defaultIsModuleExports: true,
      // Transform dynamic requires
      dynamicRequireTargets: []
    },
    rollupOptions: {
      // Ensure React and React-DOM are not treated as external
      external: [],
      output: {
        // Ensure ES module format (not CommonJS)
        format: 'es',
        // Ensure proper interop for CommonJS modules
        interop: 'auto',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl')) {
              return 'mapbox'
            }
            if (id.includes('@arcgis/core')) {
              return 'arcgis'
            }
            if (id.includes('@deck.gl') || id.includes('@loaders.gl')) {
              return 'deckgl-loaders'
            }
            // Bundle React and React-DOM together to ensure proper transformation
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
          }
        }
      }
    }
  }
})