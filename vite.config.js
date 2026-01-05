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
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      include: [
        /react\/jsx-runtime/,
        /react\/jsx-dev-runtime/,
        /react\/index\.js/,
        /react-dom/,
        /mapbox-gl/,
        /maplibre-gl/,
        /earcut/,
        /fast-xml-parser/,
        /long/,
        /jszip/,
        /pako/,
        /snappyjs/,
        /pbf/,
        /mersenne-twister/,
        /urijs/,
        /grapheme-splitter/,
        /bitmap-sdf/,
        /lerc/,
        /nosleep\.js/,
        /@deck\.gl/,
        /@loaders\.gl/,
        /node_modules\/(mersenne-twister|urijs|grapheme-splitter|bitmap-sdf|lerc|nosleep\.js|@zip\.js|earcut|fast-xml-parser|long|jszip|pako|snappyjs|pbf|mapbox-gl|maplibre-gl)/
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
            if (id.includes('@deck.gl') || id.includes('@loaders.gl')) {
              return 'deckgl-loaders'
            }
          }
        }
      }
    }
  }
})