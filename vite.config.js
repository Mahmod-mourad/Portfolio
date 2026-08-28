import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages at https://mahmod-mourad.github.io/Portfolio/
// so every asset path needs the repo name as its base.
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
})

