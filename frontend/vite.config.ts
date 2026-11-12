import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // El backend no habilita CORS: en desarrollo el navegador le habla a Vite y Vite reenvía las
  // llamadas a /api. Por defecto van al backend local; para usar otro (el desplegado), se define
  // API_PROXY en frontend/.env.local, que Git ignora.
  const backend = loadEnv(mode, import.meta.dirname, 'API_PROXY').API_PROXY ?? 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      // changeOrigin: un backend desplegado se enruta por el nombre de host del pedido
      proxy: { '/api': { target: backend, changeOrigin: true } },
    },
  }
})
