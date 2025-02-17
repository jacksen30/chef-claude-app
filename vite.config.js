import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/.netlify/functions": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
