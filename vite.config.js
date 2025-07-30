import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  preview: {
    host: true,
    // Optionally allow all preview hosts
    // Or add only your exact domain to allowedHosts
    allowedHosts: ['.replit.dev']
  }
});
