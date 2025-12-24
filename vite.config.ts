import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  base: './',
  plugins: [
    svgLoader({
      defaultImport: 'raw',
    }),
  ],
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
  preview: {
    port: 3001,
  },
});
