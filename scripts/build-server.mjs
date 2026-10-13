// Bundles the game server (src/net/serverCore.ts with the engine, cards, houses and bots) into one script defining
// BloodlinesCore, public/server/core.js, served by the website. The Supabase Edge Function (supabase/functions/bloodlines)
// fetches and loads it when it starts, so a website deploy updates the server's rules too. Run `npm run build:server` and push.
import { build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
await build({
  root, configFile: false, logLevel: 'warn', publicDir: false,
  build: {
    lib: { entry: path.join(root, 'src/net/serverEntry.ts'), formats: ['iife'], name: 'BloodlinesCore', fileName: () => 'core.js' },
    outDir: path.join(root, 'public/server'), emptyOutDir: false, minify: true, target: 'es2022', sourcemap: false,
  },
  define: { __BUILD__: JSON.stringify('server') },
});
console.log('wrote public/server/core.js');
