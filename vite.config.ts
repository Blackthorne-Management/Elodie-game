import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';

// Which build this is: Netlify's commit, else the local git commit. Saved games record it so a game is
// only ever replayed on the code it was played on.
function buildId(): string {
  if (process.env.COMMIT_REF) return process.env.COMMIT_REF.slice(0, 7);
  try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'dev'; }
}

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  define: { __BUILD__: JSON.stringify(buildId()) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Throne of Bloodlines',
        short_name: 'Bloodlines',
        description: 'Eight houses. One throne.',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        background_color: '#1b1418',
        theme_color: '#5a1620',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] },
    }),
  ],
});
