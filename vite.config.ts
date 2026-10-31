import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Output to build/ so the existing Vercel project settings (CRA preset, output "build") keep working.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
});
