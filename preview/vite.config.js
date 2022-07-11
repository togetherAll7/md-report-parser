import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

const config = {
  plugins: [vue()],
  build: {
    sourcemap: false, // enable for debugging
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}

export default defineConfig(({ command, mode }) => {
  if (command === 'build') config.base = '/md-report-parser/'
  return config
})
