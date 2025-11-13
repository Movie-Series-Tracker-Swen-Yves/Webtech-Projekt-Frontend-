// vite.config.ts – einfache Vite-Konfiguration ohne Devtools

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(), // nur das Vue-Plugin
  ],
  server: {
    port: 5173, // optional, nur lokal wichtig
  },
})
