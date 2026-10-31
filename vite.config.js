import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import seoPlugin from './scripts/seo-plugin.mjs';

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apertura: resolve(__dirname, 'apertura-nazionale.html'),
        distretto2041: resolve(__dirname, 'distretti/2041.html'),
        distretto2042: resolve(__dirname, 'distretti/2042.html'),
        distretto2050: resolve(__dirname, 'distretti/2050.html'),
        grattavinci: resolve(__dirname, 'gratta-vinci/index.html'),
        shop: resolve(__dirname, 'shop.html')
      }
    }
  }
});
