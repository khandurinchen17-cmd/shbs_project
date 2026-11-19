import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/shbs',
        changeOrigin: true,
      },
      '/uploads': {                    
        target: 'http://localhost/shbs',
        changeOrigin: true,
      }
    }
  }
})