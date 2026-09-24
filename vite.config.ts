import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // базовый путь для GitHub Pages: сайт живёт в подпапке /lifigma/
  base: '/lifigma/',
  plugins: [react()],
});