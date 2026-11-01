import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// Tipografías servidas localmente (Fontsource, licencia OFL): sin requests a Google Fonts
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/public-sans'
import './estilos/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
