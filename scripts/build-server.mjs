// Bundles the game server (src/net/serverCore.ts with the engine, cards, houses and bots) into one ES module,
// public/server/core.js, served by the website. The Supabase Edge Function (supabase/functions/bloodlines) imports it
// from there when it is deployed. Run `npm run build:server`, push, wait for Netlify, then redeploy the function.
import { build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({
  root, configFile: false, logLevel: 'warn', publicDir: false,
  build: {
    lib: { entry: path.join(root, 'src/net/serverEntry.ts'), formats: ['es'], fileName: () => 'core.js' },
    outDir: path.join(root, 'public/server'), emptyOutDir: false, minify: true, target: 'es2022', sourcemap: false,
  },
  define: { __BUILD__: JSON.stringify('server') },
});
console.log('wrote public/server/core.js');
