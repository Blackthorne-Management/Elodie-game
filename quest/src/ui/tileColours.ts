// One colour per map tile (its decoration's, a tree or a wall, else its ground's), from the tileset's
// base colours, with doors in gold: the minimap and the menu's city map draw maps this way.

import { TILESET } from '../assets.config.ts';
import type { GameMap, TiledMap } from '../engine/tiledMap.ts';
import { TILE_LAYERS, findTileLayer } from '../engine/tiledMap.ts';
import type { Era } from '../engine/types.ts';

export function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

/** Each tile's colour as #rrggbb, row by row. */
export function tileColours(map: GameMap, raw: TiledMap, era: Era): string[] {
  const gid = new Map(TILESET.tiles.map((t) => [t.gid, hex(t.base)]));
  const ground = findTileLayer(raw, era === 'present' ? TILE_LAYERS.groundPresent : TILE_LAYERS.groundEcho)?.data ?? [];
  const deco = findTileLayer(raw, era === 'present' ? TILE_LAYERS.decoPresent : TILE_LAYERS.decoEcho)?.data ?? [];
  const out: string[] = [];
  for (let i = 0; i < map.width * map.height; i++) out.push(gid.get(deco[i] ?? 0) ?? gid.get(ground[i] ?? 0) ?? '#000000');
  for (const d of map.doors) for (const t of d.tiles) out[t.y * map.width + t.x] = '#f2d04b';
  return out;
}
