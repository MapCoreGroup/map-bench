import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// --- 🔍 DEBUG PROBE START ---
// This runs once when the app loads. Open your browser console (F12) to see it.
console.group('%c 🔍 ENVIRONMENT DIAGNOSTICS ', 'background: #222; color: #bada55; padding: 4px; font-weight: bold;');

// 1. Dump all VITE_ variables found
console.log('All Environment Variables:', import.meta.env);

// 2. Specific check for your Map Server URL
const mapUrl = import.meta.env.VITE_MAPCORE_SERVER_URL;
if (mapUrl) {
  console.log('✅ VITE_MAPCORE_SERVER_URL found:', mapUrl);
} else {
  console.error('❌ VITE_MAPCORE_SERVER_URL is MISSING or UNDEFINED!');
  console.error('   -> App will likely fallback to localhost:8080');
}

console.groupEnd();
// --- 🔍 DEBUG PROBE END ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )



