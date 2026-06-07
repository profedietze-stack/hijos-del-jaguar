/// <reference types="vitest" />
import { defineConfig } from 'vite'

import pkg from './package.json'

export default defineConfig({
  test: {
    environment: 'node',   // los módulos del motor son puros (sin DOM)
    globals:     true,
    include:     ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider:  'v8',
      include:   ['src/core/**', 'src/data/**'],
      exclude:   ['src/data/events.ts'],   // solo datos, sin lógica
      reporter:  ['text', 'lcov'],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // En Vercel el app vive en la raíz (/); en dev local usamos /hijos-del-jaguar/
  base: process.env.VERCEL ? '/' : '/hijos-del-jaguar/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'd3-vendor': ['d3', 'topojson-client'],
          'audio-vendor': ['tone'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
