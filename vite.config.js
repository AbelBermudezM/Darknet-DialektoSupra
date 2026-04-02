import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/Darknet-DialektoSupra/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
