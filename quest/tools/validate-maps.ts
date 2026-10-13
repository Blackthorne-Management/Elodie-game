// Map validator CLI: `npm run validate:maps`. Loads every quest/maps/*.tmj and checks it with the
// engine's validator (required layers, sizes, Echo Zones walkable in both eras, spawns, door pairs,
// NPC, dialogue and puzzle object ids, anchors). Exits non-zero on any problem. tests/maps.test.ts
// runs the same checks.

import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validationContext } from '../src/data/content.ts';
import { validateMaps } from '../src/engine/mapValidation.ts';
import type { TiledMap } from '../src/engine/tiledMap.ts';

export const MAPS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'maps');

export function readMapFiles(dir: string = MAPS_DIR): Record<string, TiledMap> {
  const out: Record<string, TiledMap> = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.tmj')).sort()) {
    out[basename(file, '.tmj')] = JSON.parse(readFileSync(join(dir, file), 'utf8')) as TiledMap;
  }
  return out;
}

export function runValidation(dir: string = MAPS_DIR): { maps: string[]; errors: string[] } {
  const maps = readMapFiles(dir);
  const errors = validateMaps(maps, validationContext());
  return { maps: Object.keys(maps), errors };
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const { maps, errors } = runValidation();
  if (maps.length === 0) {
    console.error('No .tmj maps found in', MAPS_DIR);
    process.exit(1);
  }
  if (errors.length > 0) {
    console.error(`Map validation failed (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`All ${maps.length} map(s) valid: ${maps.join(', ')}`);
}
