import { defineConfig } from 'vite';

// The quest is a self-contained app. A relative base lets the built files live under any path
// (for example a future /quest route) without changes.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    // Phaser is one large chunk; that is expected.
    chunkSizeWarningLimit: 2000,
  },
  server: { port: 5180 },
  preview: { port: 4180 },
});
