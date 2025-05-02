import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'GuessDnBTrack',
      formats: ['iife'],
    },
    rollupOptions: {
      input: 'index.html',
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  base: '/',
});
