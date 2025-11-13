// vite.config.ts – vereinfachte Config ohne Vue Devtools

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    // WICHTIG:
    // KEINE @vue/devtools oder @vue/devtools-kit Plugins hier einbinden,
    // weil sie beim Build in Node auf localStorage zugreifen würden.
  ],
  // optional, aber häufig nice:
  server: {
    port: 5173,
  },
})
