import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@vlcn.io/crsqlite-wasm', 'absurd-sql'],
  },
  worker: {
    format: 'es',
  },
});