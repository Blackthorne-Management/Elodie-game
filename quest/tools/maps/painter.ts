// A small painter for map sources: each era is a grid of one-character cells (see LEGEND), painted
// with rectangles, then turned into a Tiled .tmj with both eras' ground, deco and collision layers.
// tools/build-maps.ts writes the files; Tiled can open and edit them like any other map.

import { TILESET } from '../../src/assets.config.ts';
import type { TiledLayer, TiledMap, TiledObject } from '../../src/engine/tiledMap.ts';

export interface Cell {
  ground: string;
  deco?: string;
  solid: boolean;
}

/** One character per cell. Present and echo grids share it. */
export const LEGEND: Readonly<Record<string, Cell>> = {
  '.': { ground: 'grass', solid: false },
  '"': { ground: 'grass_old', solid: false },
  ',': { ground: 'path', solid: false },
  ';': { ground: 'path_old', solid: false },
  ':': { ground: 'stone', solid: false },
  // Paving under a large drawing (a puzzle object's OBJECT_ART, e.g. the Hall of the Accord): solid.
  '0': { ground: 'stone', solid: true },
  '1': { ground: 'grass', solid: true },
  // The Iron Market (Oct 15).
  '2': { ground: 'cobble', solid: false },
  '3': { ground: 'cobble', deco: 'stall_blue', solid: true },
  '4': { ground: 'cobble', deco: 'stall_green', solid: true },
  '5': { ground: 'cobble', deco: 'stall_yellow', solid: true },
  '6': { ground: 'produce', solid: true },
  '7': { ground: 'spice', solid: true },
  '8': { ground: 'cobble', deco: 'cloth', solid: true },
  '9': { ground: 'cobble', deco: 'fish_table', solid: true },
  J: { ground: 'path', deco: 'goat', solid: true },
  F: { ground: 'path', deco: 'chicken', solid: true },
  U: { ground: 'cobble', deco: 'lottery', solid: true },
  V: { ground: 'cobble', deco: 'cart', solid: true },
  '`': { ground: 'cobble', deco: 'barrel', solid: true },
  // Accord Square (Oct 15).
  E: { ground: 'hedge', solid: true },
  '-': { ground: 'stone', deco: 'flagpole', solid: true },
  // The Hall of the Accord inside (Oct 15).
  '(': { ground: 'marble', solid: false },
  ')': { ground: 'carpet', solid: false },
  '{': { ground: 'dais', solid: false },
  '[': { ground: 'pillar', solid: true },
  ']': { ground: 'dais', deco: 'throne', solid: true },
  '!': { ground: 'hall_wall', solid: true },
  '}': { ground: 'portrait', solid: true },
  '$': { ground: 'floor', deco: 'desk', solid: true },
  '+': { ground: 'floor', deco: 'bench', solid: true },
  '*': { ground: 'marble', deco: 'plant', solid: true },
  '?': { ground: 'floor', deco: 'pigeon_loft', solid: true },
  '<': { ground: 'marble', deco: 'flag', solid: true },
  '>': { ground: 'floor', deco: 'chest', solid: true },
  '/': { ground: 'marble', deco: 'bench', solid: true },
  f: { ground: 'flowers', solid: false },
  n: { ground: 'sand', solid: false },
  k: { ground: 'dock', solid: false },
  _: { ground: 'stage', solid: false },
  D: { ground: 'door', solid: false },
  // The halves of a double door (widenDoors puts them in place of 'D').
  '«': { ground: 'door_left', solid: false },
  '»': { ground: 'door_right', solid: false },
  '⌈': { ground: 'door_top', solid: false },
  '⌊': { ground: 'door_bottom', solid: false },
  '@': { ground: 'door_closed', solid: true },
  o: { ground: 'floor', solid: false },
  e: { ground: 'floor_old', solid: false },
  u: { ground: 'rug', solid: false },
  q: { ground: 'temple_floor', solid: false },
  '~': { ground: 'water', solid: true },
  T: { ground: 'grass', deco: 'tree', solid: true },
  Y: { ground: 'grass_old', deco: 'tree', solid: true },
  B: { ground: 'grass', deco: 'bush', solid: true },
  '#': { ground: 'wall', solid: true },
  '%': { ground: 'wall_old', solid: true },
  '^': { ground: 'roof', solid: true },
  '=': { ground: 'grass', deco: 'fence', solid: true },
  S: { ground: 'stone', deco: 'stall', solid: true },
  L: { ground: 'stone', deco: 'lantern', solid: true },
  N: { ground: 'stone', deco: 'banner', solid: true },
  O: { ground: 'fountain', solid: true },
  M: { ground: 'stone', deco: 'monument', solid: true },
  w: { ground: 'path_old', deco: 'winch', solid: true },
  W: { ground: 'path', deco: 'winch_rust', solid: true },
  p: { ground: 'path', deco: 'pawl_rust', solid: true },
  y: { ground: 'path_old', deco: 'pawl', solid: true },
  P: { ground: 'path', deco: 'sign', solid: true },
  r: { ground: 'rope_broken', solid: true },
  R: { ground: 'water', deco: 'raised_bridge', solid: true },
  c: { ground: 'water', deco: 'canoe', solid: true },
  C: { ground: 'cliff', solid: true },
  K: { ground: 'path', deco: 'carriage', solid: true },
  x: { ground: 'path_old', deco: 'barricade', solid: true },
  t: { ground: 'grass_old', deco: 'tent', solid: true },
  X: { ground: 'path', deco: 'barrel', solid: true },
  Z: { ground: 'path_old', deco: 'barrel', solid: true },
  h: { ground: 'floor', deco: 'shelf', solid: true },
  H: { ground: 'floor_old', deco: 'shelf', solid: true },
  m: { ground: 'floor', deco: 'map_table', solid: true },
  '&': { ground: 'path_old', deco: 'stone_pile', solid: true },
  j: { ground: 'floor_old', deco: 'map_table', solid: true },
  a: { ground: 'floor', deco: 'table', solid: true },
  A: { ground: 'floor_old', deco: 'table', solid: true },
  d: { ground: 'floor', deco: 'bed', solid: true },
  b: { ground: 'floor_old', deco: 'bed', solid: true },
  v: { ground: 'window', solid: true },
  s: { ground: 'floor', deco: 'seat', solid: true },
  z: { ground: 'floor_old', deco: 'seat', solid: true },
  Q: { ground: 'temple_wall', solid: true },
  l: { ground: 'temple_floor', deco: 'lamp', solid: true },
  g: { ground: 'grass', deco: 'name_stone', solid: true },
  G: { ground: 'grass_old', deco: 'name_stone', solid: true },
  '|': { ground: 'path_old', deco: 'scaffold', solid: true },
  i: { ground: 'cane', solid: false },
  I: { ground: 'cane_old', solid: false },
};

export class Grid {
  readonly width: number;
  readonly height: number;
  private cells: string[][];

  constructor(width: number, height: number, fill: string) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
  }

  set(x: number, y: number, ch: string): this {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) throw new Error(`set ${x},${y} is off the grid`);
    this.cells[y]![x] = ch;
    return this;
  }

  get(x: number, y: number): string {
    return this.cells[y]![x]!;
  }

  rect(x: number, y: number, w: number, h: number, ch: string): this {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, ch);
    return this;
  }

  /** Swap characters everywhere (`{ '.': '"' }` ages the grass). */
  map(subs: Readonly<Record<string, string>>): Grid {
    const g = this.clone();
    g.cells = g.cells.map((row) => row.map((c) => subs[c] ?? c));
    return g;
  }

  clone(): Grid {
    const g = new Grid(this.width, this.height, '.');
    g.cells = this.cells.map((row) => [...row]);
    return g;
  }

  toString(): string {
    return this.cells.map((r) => r.join('')).join('\n');
  }

  layer(pick: (cell: Cell) => number): number[] {
    return this.cells.flatMap((row, y) =>
      row.map((ch, x) => {
        const cell = LEGEND[ch];
        if (!cell) throw new Error(`Unknown map character "${ch}" at ${x},${y}`);
        return pick(cell);
      }),
    );
  }
}

export type LayerName = 'npcs' | 'doors' | 'triggers' | 'spawns' | 'echo_zones' | 'anchors' | 'puzzle_objects' | 'encounters';

export interface ObjSpec {
  layer: LayerName;
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  props?: Record<string, string | boolean>;
}

export interface MapSource {
  id: string;
  present: Grid;
  echo: Grid;
  objects: ObjSpec[];
  /** Inside a building (its way out is a door; between two outdoor areas the way is an open path). */
  interior?: boolean;
}

const OBJECT_LAYER_ORDER: readonly LayerName[] = ['npcs', 'doors', 'triggers', 'spawns', 'echo_zones', 'anchors', 'puzzle_objects', 'encounters'];
const TYPE_FOR: Record<LayerName, string> = {
  npcs: 'npc',
  doors: 'door',
  triggers: 'trigger',
  spawns: 'spawn',
  echo_zones: 'echo_zone',
  anchors: 'anchor',
  puzzle_objects: 'puzzle_object',
  encounters: 'encounter_zone',
};

export function gidOf(name: string): number {
  const tile = TILESET.tiles.find((t) => t.name === name);
  if (!tile) throw new Error(`No tile named ${name}`);
  return tile.gid;
}

const SOLID_GID = gidOf('solid');

/** The Tiled JSON for a map source (Tiled 1.8 format, as written by Tiled itself). */
export function toTiled(src: MapSource): TiledMap & Record<string, unknown> {
  const { width, height } = src.present;
  if (src.echo.width !== width || src.echo.height !== height) throw new Error(`${src.id}: eras differ in size`);
  let layerId = 1;
  let objectId = 1;
  const tile = (name: string, data: number[]) => ({
    id: layerId++,
    name,
    type: 'tilelayer' as const,
    x: 0,
    y: 0,
    width,
    height,
    opacity: 1,
    visible: true,
    data,
  });
  const layers: (TiledLayer & { id: number })[] = [
    tile('ground_present', src.present.layer((c) => gidOf(c.ground))),
    tile('deco_present', src.present.layer((c) => (c.deco ? gidOf(c.deco) : 0))),
    tile('ground_echo', src.echo.layer((c) => gidOf(c.ground))),
    tile('deco_echo', src.echo.layer((c) => (c.deco ? gidOf(c.deco) : 0))),
    tile('above', Array.from({ length: width * height }, () => 0)),
    tile('collide_present', src.present.layer((c) => (c.solid ? SOLID_GID : 0))),
    tile('collide_echo', src.echo.layer((c) => (c.solid ? SOLID_GID : 0))),
  ];
  for (const name of OBJECT_LAYER_ORDER) {
    const objects: TiledObject[] = src.objects
      .filter((o) => o.layer === name)
      .map((o) => ({
        id: objectId++,
        name: o.name,
        type: TYPE_FOR[name],
        x: o.x * 16,
        y: o.y * 16,
        width: (o.w ?? 1) * 16,
        height: (o.h ?? 1) * 16,
        rotation: 0,
        visible: true,
        ...(o.props && Object.keys(o.props).length > 0
          ? {
              properties: Object.entries(o.props)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([n, value]) => ({ name: n, type: typeof value === 'boolean' ? 'bool' : 'string', value })),
            }
          : {}),
      }));
    if (name === 'encounters' && objects.length === 0) continue; // only maps with a wild section have it
    layers.push({ id: layerId++, name, type: 'objectgroup', x: 0, y: 0, opacity: 1, visible: true, draworder: 'topdown', objects } as never);
  }
  const tiled = {
    compressionlevel: -1,
    width,
    height,
    tilewidth: 16,
    tileheight: 16,
    infinite: false,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    type: 'map',
    version: '1.8',
    tiledversion: '1.8.2',
    nextlayerid: layerId,
    nextobjectid: objectId,
    layers,
    tilesets: [
      {
        firstgid: 1,
        name: TILESET.name,
        image: 'placeholder-tiles.png',
        imagewidth: TILESET.columns * 16,
        imageheight: Math.ceil(TILESET.tiles.length / TILESET.columns) * 16,
        tilewidth: 16,
        tileheight: 16,
        tilecount: TILESET.tiles.length,
        columns: TILESET.columns,
        margin: 0,
        spacing: 0,
      },
    ],
  };
  return tiled as TiledMap & Record<string, unknown>;
}

/**
 * Every building with no way in gets a grey door you cannot open (owner request, Oct 16), in the middle
 * of its front wall. A building is a group of wall tiles ('#') with roof ('^') above it; it already has
 * a way in when a door tile ('D') or a door object touches it. Present era only (fifty years ago the
 * buildings are drawn as they were). Interior walls have no roof above them and are left alone.
 */
export function addClosedDoors(src: MapSource): void {
  const g = src.present;
  const doorTiles = new Set(src.objects.filter((o) => o.layer === 'doors').map((o) => `${o.x},${o.y}`));
  const seen = new Set<string>();
  const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < g.width && y < g.height ? g.get(x, y) : '');
  for (let y = 0; y < g.height; y++) {
    for (let x = 0; x < g.width; x++) {
      if (at(x, y) !== '#' || seen.has(`${x},${y}`)) continue;
      // The connected wall tiles of one building.
      const cells: [number, number][] = [];
      const stack: [number, number][] = [[x, y]];
      seen.add(`${x},${y}`);
      while (stack.length > 0) {
        const [cx, cy] = stack.pop()!;
        cells.push([cx, cy]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (at(nx, ny) === '#' && !seen.has(`${nx},${ny}`)) {
            seen.add(`${nx},${ny}`);
            stack.push([nx, ny]);
          }
        }
      }
      if (!cells.some(([cx, cy]) => at(cx, cy - 1) === '^')) continue;
      const hasDoor = cells.some(([cx, cy]) =>
        [[1, 0], [-1, 0], [0, 1], [0, -1], [0, 0]].some(([dx, dy]) => ['D', '@', '«', '»', '⌈', '⌊'].includes(at(cx + dx!, cy + dy!)) || doorTiles.has(`${cx + dx!},${cy + dy!}`)),
      );
      if (hasDoor) continue;
      // The front: the lowest wall row; the door goes in the middle of its longest run.
      const bottom = Math.max(...cells.map(([, cy]) => cy));
      const row = cells.filter(([, cy]) => cy === bottom).map(([cx]) => cx).sort((a, b) => a - b);
      let best: number[] = [];
      let run: number[] = [];
      for (const cx of row) {
        run = run.length > 0 && cx === run[run.length - 1]! + 1 ? [...run, cx] : [cx];
        if (run.length > best.length) best = run;
      }
      if (best.length < 3) continue;
      g.set(best[Math.floor((best.length - 1) / 2)]!, bottom, '@');
    }
  }
}

const DIR_STEP: Readonly<Record<string, readonly [number, number]>> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
/** What a door can widen into: walls, borders and solid ground beside it (never a grey door or water). */
const WIDEN_INTO = new Set(['#', '%', '!', 'T', 'Y', 'B', '0', '1', 'Q']);
/** What the tile in front of the new half may be cleared from (a tree or bush on a border path). */
const CLEARABLE = new Set(['T', 'Y', 'B']);

/**
 * Every usable door becomes two tiles wide (owner request, Oct 16: walking into the wall beside a door
 * was frustrating). The second tile goes beside the door along its wall (left or right of a door you
 * walk up or down through, above or below one at the side of the map), where the wall is and the
 * ground in front is open, or a border tree can be cleared. Both eras get the same shape, so the
 * memory's walls match. A door with no room beside it stays one tile. Returns the doors left narrow.
 */
export function widenDoors(src: MapSource): string[] {
  const g = src.present;
  const e = src.echo;
  const narrow: string[] = [];
  const taken = new Set<string>();
  for (const o of src.objects) {
    // A building drawn as one picture (a large puzzle object) has its door inside its own area.
    if (o.layer === 'puzzle_objects' && (o.w ?? 1) * (o.h ?? 1) >= 6) continue;
    for (let dx = 0; dx < (o.w ?? 1); dx++) for (let dy = 0; dy < (o.h ?? 1); dy++) taken.add(`${o.x + dx},${o.y + dy}`);
  }
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < g.width && y < g.height;
  for (const d of src.objects) {
    if (d.layer !== 'doors' || (d.w ?? 1) > 1 || (d.h ?? 1) > 1) continue;
    const exit = String(d.props?.exit ?? 'down');
    const [ox, oy] = DIR_STEP[exit] ?? [0, 1];
    const sideways: [number, number][] = ox === 0 ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
    let done = false;
    for (const [sx, sy] of sideways) {
      const cx = d.x + sx;
      const cy = d.y + sy;
      const fx = cx + ox;
      const fy = cy + oy;
      if (!inside(cx, cy) || !inside(fx, fy) || taken.has(`${cx},${cy}`) || taken.has(`${fx},${fy}`)) continue;
      // Into the wall beside it, or onto open ground beside it (a gate in a path, a doorway by a floor).
      if (!WIDEN_INTO.has(g.get(cx, cy)) && LEGEND[g.get(cx, cy)]!.solid) continue;
      const front = g.get(fx, fy);
      const frontOpen = !LEGEND[front]!.solid;
      if (!frontOpen && !CLEARABLE.has(front)) continue;
      // A door tile becomes the two halves of one double door; an open gateway just widens.
      const halves = (grid: Grid) => {
        const ch = grid.get(d.x, d.y);
        if (ch !== 'D') {
          grid.set(cx, cy, ch);
          return;
        }
        const firstIsDoor = ox === 0 ? d.x < cx : d.y < cy;
        const [a, b] = ox === 0 ? ['«', '»'] : ['⌈', '⌊'];
        grid.set(d.x, d.y, firstIsDoor ? a : b);
        grid.set(cx, cy, firstIsDoor ? b : a);
      };
      halves(g);
      halves(e);
      if (!frontOpen) {
        g.set(fx, fy, g.get(d.x + ox, d.y + oy));
        e.set(fx, fy, e.get(d.x + ox, d.y + oy));
      }
      taken.add(`${cx},${cy}`);
      if (ox === 0) {
        d.x = Math.min(d.x, cx);
        d.w = 2;
      } else {
        d.y = Math.min(d.y, cy);
        d.h = 2;
      }
      done = true;
      break;
    }
    if (!done) narrow.push(`${src.id}/${d.name}`);
  }
  return narrow;
}

/**
 * Between two outdoor areas there is no door, just the path going on (owner request, Oct 16): every tile
 * of a door that leads from an outdoor map to another outdoor map takes the ground in front of it, in
 * both eras, and that ground carries on to the edge of the map behind it. Doors into and out of buildings (`interior` maps) stay doors. `interiors` lists those maps.
 */
export function openPassages(src: MapSource, interiors: ReadonlySet<string>): void {
  if (src.interior) return;
  for (const d of src.objects) {
    if (d.layer !== 'doors') continue;
    const target = String(d.props?.map ?? src.id);
    if (interiors.has(target)) continue;
    const [ox, oy] = DIR_STEP[String(d.props?.exit ?? 'down')] ?? [0, 1];
    for (let dx = 0; dx < (d.w ?? 1); dx++) {
      for (let dy = 0; dy < (d.h ?? 1); dy++) {
        const x = d.x + dx;
        const y = d.y + dy;
        for (const grid of [src.present, src.echo]) {
          const path = grid.get(x + ox, y + oy);
          grid.set(x, y, path);
          // The path runs on to the edge of the map (owner report, Oct 16: an exit one tile short of the
          // edge, behind a row of trees, looked like a dead end).
          for (let bx = x - ox, by = y - oy; bx >= 0 && by >= 0 && bx < grid.width && by < grid.height; bx -= ox, by -= oy) {
            grid.set(bx, by, path);
          }
        }
      }
    }
  }
}
