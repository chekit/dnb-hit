import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [svgLoader({
    defaultImport: 'raw'
  })],
  server: {
    port: 3000
  },
  preview: {
    port: 3001
  }
})