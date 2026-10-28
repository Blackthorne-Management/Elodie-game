// One colour per map tile (its decoration's, a tree or a wall, else its ground's), from the tileset's
// base colours, with doors in gold: the minimap and the menu's city map draw maps this way. A door among light
// tiles (a sandstone wall, a pale path) is drawn dark instead, so it stands out by brightness and not by its hue
// alone, which a colour-blind player may not see (Claude's call, Oct 28).

import { TILESET } from '../assets.config.ts';
import type { GameMap, TiledMap } from '../engine/tiledMap.ts';
import { TILE_LAYERS, findTileLayer } from '../engine/tiledMap.ts';
import type { Era } from '../engine/types.ts';

export const DOOR_COLOUR = '#f2d04b';
/** A door among tiles too light for the gold to stand out: dark wood. */
export const DOOR_COLOUR_ON_LIGHT = '#4a2c14';
/** The least brightness contrast (WCAG ratio) the gold must have with a door's surroundings. */
export const DOOR_MIN_CONTRAST = 1.6;

export function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

function luminance(colour: string): number {
  const c = parseInt(colour.slice(1), 16);
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((c >> 16) & 255) + 0.7152 * channel((c >> 8) & 255) + 0.0722 * channel(c & 255);
}

/** The WCAG contrast ratio of two #rrggbb colours (1 to 21). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** A door's colour among its neighbours' colours: gold, or dark wood where the gold would not stand out. */
export function doorColour(neighbours: readonly string[]): string {
  if (neighbours.length === 0) return DOOR_COLOUR;
  const mean = neighbours.reduce((sum, n) => sum + contrastRatio(DOOR_COLOUR, n), 0) / neighbours.length;
  return mean < DOOR_MIN_CONTRAST ? DOOR_COLOUR_ON_LIGHT : DOOR_COLOUR;
}

/** Each tile's colour as #rrggbb, row by row. */
export function tileColours(map: GameMap, raw: TiledMap, era: Era): string[] {
  const gid = new Map(TILESET.tiles.map((t) => [t.gid, hex(t.base)]));
  const ground = findTileLayer(raw, era === 'present' ? TILE_LAYERS.groundPresent : TILE_LAYERS.groundEcho)?.data ?? [];
  const deco = findTileLayer(raw, era === 'present' ? TILE_LAYERS.decoPresent : TILE_LAYERS.decoEcho)?.data ?? [];
  const out: string[] = [];
  for (let i = 0; i < map.width * map.height; i++) out.push(gid.get(deco[i] ?? 0) ?? gid.get(ground[i] ?? 0) ?? '#000000');
  const doorTiles = new Set<number>();
  for (const d of map.doors) for (const t of d.tiles) doorTiles.add(t.y * map.width + t.x);
  for (const d of map.doors) {
    // The tiles round the door (not other door tiles), from the colours before any door was painted.
    const around: string[] = [];
    for (const t of d.tiles) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const x = t.x + dx;
        const y = t.y + dy;
        if (x < 0 || y < 0 || x >= map.width || y >= map.height || doorTiles.has(y * map.width + x)) continue;
        around.push(out[y * map.width + x]!);
      }
    }
    const colour = doorColour(around);
    for (const t of d.tiles) out[t.y * map.width + t.x] = colour;
  }
  return out;
}
