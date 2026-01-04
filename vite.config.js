import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), cesium()],
  optimizeDeps: {
    exclude: ['cesium'],
    // Cesium has many CommonJS dependencies that need to be pre-bundled and converted to ES modules
    // Add any new CommonJS modules that cause "does not provide an export named 'default'" errors here
    include: [
      'mersenne-twister',
      'urijs',
      'grapheme-splitter',
      'bitmap-sdf',
      'lerc',
      'nosleep.js'
    ],
    esbuildOptions: {
      // Automatically handle CommonJS modules
      plugins: []
    }
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
      // Allow serving files from node_modules for ESRI workers
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
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      include: [
        /mersenne-twister/,
        /urijs/,
        /grapheme-splitter/,
        /bitmap-sdf/,
        /lerc/,
        /nosleep\.js/,
        // Match CommonJS modules that Cesium dependencies might use
        /node_modules\/(mersenne-twister|urijs|grapheme-splitter|bitmap-sdf|lerc|nosleep\.js|@zip\.js)/
      ],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl')) {
              return 'mapbox'
            }
            if (id.includes('@arcgis/core')) {
              return 'arcgis'
            }
            // Keep deck.gl and loaders.gl together to avoid circular dependency issues
            if (id.includes('@deck.gl') || id.includes('@loaders.gl')) {
              return 'deckgl-loaders'
            }
          }
        }
      }
    }
  }
})
