import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'https://fastapi-backend-pees.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})