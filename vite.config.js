import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  base: '/Ejercicios-API-Series/',
  build: { outDir: '../dist', emptyOutDir: true },
})