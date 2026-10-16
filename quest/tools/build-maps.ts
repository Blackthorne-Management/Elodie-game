// Writes the Zetwal maps (quest/maps/*.tmj) from the sources in tools/maps. `npm run maps:build`.
// With --check it writes nothing and fails if a file on disk differs (tests/maps.test.ts runs that).
// test-village.tmj is hand-made and not generated.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addClosedDoors, openPassages, toTiled, widenDoors, type MapSource } from './maps/painter.ts';
import { zetwalArchive } from './maps/zetwal-archive.ts';
import { zetwalHall } from './maps/zetwal-hall.ts';
import { zetwalHarbor } from './maps/zetwal-harbor.ts';
import { zetwalHeights } from './maps/zetwal-heights.ts';
import { zetwalHouse } from './maps/zetwal-house.ts';
import { zetwalMarket } from './maps/zetwal-market.ts';
import { zetwalRoad } from './maps/zetwal-road.ts';
import { zetwalSquare } from './maps/zetwal-square.ts';
import { zetwalTemple } from './maps/zetwal-temple.ts';
import { zetwalTown } from './maps/zetwal-town.ts';
import { MAPS_DIR } from './validate-maps.ts';

export const SOURCES: readonly (() => MapSource)[] = [zetwalTown, zetwalHouse, zetwalTemple, zetwalArchive, zetwalHall, zetwalRoad, zetwalMarket, zetwalHarbor, zetwalHeights, zetwalSquare];

/** The generated files, as `[path, text]`. */
export function buildMaps(dir: string = MAPS_DIR): [string, string][] {
  const sources = SOURCES.map((make) => make());
  const interiors = new Set(sources.filter((s) => s.interior).map((s) => s.id));
  return sources.map((src) => {
    widenDoors(src);
    openPassages(src, interiors);
    addClosedDoors(src);
    return [join(dir, `${src.id}.tmj`), formatTmj(toTiled(src))];
  });
}

/** Pretty JSON with each tile layer's data written one map row per line (as Tiled does). */
function formatTmj(map: ReturnType<typeof toTiled>): string {
  const rows: string[] = [];
  const text = JSON.stringify(
    map,
    (key, value: unknown) => {
      if (key === 'data' && Array.isArray(value)) {
        rows.push(
          (value as number[])
            .reduce<string[]>((out, gid, i) => {
              if (i % map.width === 0) out.push('');
              out[out.length - 1] += `${gid},`;
              return out;
            }, [])
            .join('\n')
            .replace(/,$/, ''),
        );
        return `__ROWS_${rows.length - 1}__`;
      }
      return value;
    },
    2,
  );
  return `${text.replace(/"__ROWS_(\d+)__"/g, (_m, i: string) => `[\n${rows[Number(i)]}\n      ]`)}\n`;
}

/** Files on disk that do not match their source. */
export function staleMaps(dir: string = MAPS_DIR): string[] {
  return buildMaps(dir)
    .filter(([path, text]) => {
      try {
        return readFileSync(path, 'utf8') !== text;
      } catch {
        return true;
      }
    })
    .map(([path]) => path);
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  if (process.argv.includes('--check')) {
    const stale = staleMaps();
    if (stale.length > 0) {
      console.error(`Out of date (run npm run maps:build): ${stale.join(', ')}`);
      process.exit(1);
    }
    console.log('Generated maps are up to date.');
  } else {
    for (const [path, text] of buildMaps()) {
      writeFileSync(path, text);
      console.log(`wrote ${path}`);
    }
  }
}
