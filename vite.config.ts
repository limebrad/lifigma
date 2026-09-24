import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite + React + Tailwind CSS v4 (плагин @tailwindcss/vite).
export default defineConfig({
  // базовый путь для GitHub Pages: сайт живёт в подпапке /lifigma/
  base: '/lifigma/',
  plugins: [react(), tailwindcss()],
})