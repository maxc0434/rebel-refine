import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 3000,
    watch: {
      usePolling: true, // Crucial pour que les changements soient vus via Docker/WSL2
    },
  },
})