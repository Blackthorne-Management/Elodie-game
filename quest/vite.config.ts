import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

/**
 * The maps are bundled as text (`maps/*.tmj?raw`, data/maps.ts). Tiled writes them pretty-printed; this
 * serves the same JSON without the spaces and line breaks, so the bundle is about a third smaller there
 * and an older phone has less text to parse at boot (Claude's call, Oct 28). The parsed maps are identical.
 */
function minifiedMaps(): Plugin {
  return {
    name: 'quest-minified-maps',
    enforce: 'pre',
    load(id) {
      const [file, query] = id.split('?');
      if (!file?.endsWith('.tmj') || query !== 'raw') return null;
      const text = JSON.stringify(JSON.parse(readFileSync(file, 'utf8')));
      return `export default ${JSON.stringify(text)};`;
    },
  };
}

// The quest is a self-contained app. A relative base lets the built files live under any path
// (for example a future /quest route) without changes.
export default defineConfig({
  base: './',
  plugins: [minifiedMaps()],
  build: {
    outDir: 'dist',
    // Phaser is one large chunk; that is expected.
    chunkSizeWarningLimit: 2000,
  },
  server: { port: 5180 },
  preview: { port: 4180 },
});
