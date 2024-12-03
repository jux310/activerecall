import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      },
      assetFileNames: (assetInfo) => {
        if (assetInfo.name === 'index.html') {
          return 'index.html';
        }
        return 'assets/[name]-[hash][extname]';
      }
    }
  },
});
