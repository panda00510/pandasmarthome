import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project repo from /<repo>/, so the build needs a
  // matching base. Set BASE_PATH in CI; local dev and `npm run preview` stay
  // at the root.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Inline nothing: keeps licensed photos as separate cacheable files.
    assetsInlineLimit: 2048,
  },
})
