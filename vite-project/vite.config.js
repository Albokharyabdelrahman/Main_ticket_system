import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    open: true, // This will automatically open the app in your default browser
    port: 5173, // Optional: Set a specific port
  }
})
