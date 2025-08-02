import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Set base for GitHub Pages deployment under repository path
  base: '/RepSmasher/',
  plugins: [react()],
  server: {
    host: true
  },
  preview: {
    host: true,
    allowedHosts: ['.replit.dev']
  }
});
