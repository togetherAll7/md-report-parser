import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const hash = Date.now() + Math.floor(Math.random() * 10000)

// https://vitejs.dev/config/
const config = {
  plugins: [vue()],
  build: {
    sourcemap: false, // enable for debugging
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + hash + `.js`,
        chunkFileNames: `[name]` + hash + `.js`,
        assetFileNames: `[name]` + hash + `.[ext]`
      }
    }
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
