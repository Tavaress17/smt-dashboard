import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
        '@': path.resolve(__dirname, 'src'),
        //'@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 9000
  }
})
