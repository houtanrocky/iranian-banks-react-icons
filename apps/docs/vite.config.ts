import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/iranian-banks-react-icons/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
