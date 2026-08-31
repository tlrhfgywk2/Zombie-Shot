import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Zombie-Shot/',
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
  },
});
