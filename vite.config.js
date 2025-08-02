import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/RepSmasher/',  // ✅ GitHub Pages expects this
  plugins: [react()],
  server: {
    host: true
  },
  preview: {
    host: true,
    allowedHosts: ['.replit.dev']
  }
});
