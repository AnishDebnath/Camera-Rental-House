import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/auth/' : '/',
  plugins: [react()],
  server: {
    port: 5175,
  },
}));
