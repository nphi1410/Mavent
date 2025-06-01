import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import App from './App.jsx'

// Import FontAwesome config
import './config/fontawesome'

// Console log để xác minh CSS đã được tải
// console.log('Main script loaded with CSS')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
