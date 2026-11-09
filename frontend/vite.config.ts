import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El backend corre en el puerto 8080 y no habilita CORS: en desarrollo el navegador le habla
    // a Vite y Vite reenvía las llamadas a /api
    proxy: { '/api': 'http://localhost:8080' },
  },
})
