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
  f: { ground: 'flowers', solid: false },
  n: { ground: 'sand', solid: false },
  k: { ground: 'dock', solid: false },
  _: { ground: 'stage', solid: false },
  D: { ground: 'door', solid: false },
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
