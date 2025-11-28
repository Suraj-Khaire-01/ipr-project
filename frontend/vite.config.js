import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// const backend_url = import.meta.env.VITE_BACKEND_URL;
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: ' https://ipr-project.onrender.com/api',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
