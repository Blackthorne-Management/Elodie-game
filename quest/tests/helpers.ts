// Small builders for test maps.

import type { TiledMap, TiledObject, TiledLayer } from '../src/engine/tiledMap.ts';

export const LAYER_NAMES = ['ground_present', 'deco_present', 'ground_echo', 'deco_echo', 'above', 'collide_present', 'collide_echo'];

let nextId = 1;

export function obj(name: string, x: number, y: number, props: Record<string, string | boolean> = {}, w = 1, h = 1): TiledObject {
  return {
    id: nextId++,
    name,
    x: x * 16,
    y: y * 16,
    width: w * 16,
    height: h * 16,
    properties: Object.entries(props).map(([n, value]) => ({ name: n, type: typeof value === 'boolean' ? 'bool' : 'string', value })),
  };
}

export interface MapSpec {
  width?: number;
  height?: number;
  /** Rows of '.' (open) and '#' (blocked) for the present collision layer. */
  present?: string[];
  echo?: string[];
  objects?: Partial<Record<'npcs' | 'doors' | 'triggers' | 'spawns' | 'echo_zones' | 'anchors' | 'puzzle_objects' | 'encounters', TiledObject[]>>;
}

function collide(rows: string[] | undefined, w: number, h: number): number[] {
  if (!rows) return Array.from({ length: w * h }, () => 0);
  return rows.join('').split('').map((c) => (c === '#' ? 16 : 0));
}

export function makeMap(spec: MapSpec = {}): TiledMap {
  const width = spec.width ?? spec.present?.[0]?.length ?? 5;
  const height = spec.height ?? spec.present?.length ?? 5;
  const blank = () => Array.from({ length: width * height }, () => 1);
  const tile = (name: string, data: number[]): TiledLayer => ({ type: 'tilelayer', name, width, height, data });
  const objects = spec.objects ?? {};
  return {
    width,
    height,
    tilewidth: 16,
    tileheight: 16,
    infinite: false,
    orientation: 'orthogonal',
    tilesets: [{ firstgid: 1, name: 'placeholder', tilewidth: 16, tileheight: 16, tilecount: 24, columns: 8 }],
    layers: [
      tile('ground_present', blank()),
      tile('deco_present', blank().map(() => 0)),
      tile('ground_echo', blank()),
      tile('deco_echo', blank().map(() => 0)),
      tile('above', blank().map(() => 0)),
      tile('collide_present', collide(spec.present, width, height)),
      tile('collide_echo', collide(spec.echo ?? spec.present, width, height)),
      { type: 'objectgroup', name: 'npcs', objects: objects.npcs ?? [] },
      { type: 'objectgroup', name: 'doors', objects: objects.doors ?? [] },
      { type: 'objectgroup', name: 'triggers', objects: objects.triggers ?? [] },
      { type: 'objectgroup', name: 'spawns', objects: objects.spawns ?? [obj('start', 0, 0)] },
      { type: 'objectgroup', name: 'echo_zones', objects: objects.echo_zones ?? [] },
      { type: 'objectgroup', name: 'anchors', objects: objects.anchors ?? [] },
      { type: 'objectgroup', name: 'puzzle_objects', objects: objects.puzzle_objects ?? [] },
      ...(objects.encounters ? [{ type: 'objectgroup' as const, name: 'encounters', objects: objects.encounters }] : []),
    ],
  };
}
