import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/main.jsx',
      name: 'AvatarGuide',
      fileName: 'avatar.bundle',
      formats: ['iife'],   // single self-contained script, no modules
    },
    rollupOptions: {
      // Bundle everything including React — no external deps
      external: [],
    },
    minify: true,
    cssCodeSplit: false,
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
