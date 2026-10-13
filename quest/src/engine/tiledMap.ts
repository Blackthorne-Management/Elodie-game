// The Tiled JSON (.tmj) subset the quest uses, and a parser that turns it into a GameMap the
// engine can query. The validator (mapValidation.ts) reports problems; parseMap assumes a valid map.

import { DIRS, type Dir, type Era, type FlagValue, type Pos } from './types.ts';

export interface TiledProperty {
  name: string;
  type?: string;
  value: FlagValue;
}

export interface TiledObject {
  id: number;
  name: string;
  type?: string;
  class?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties?: TiledProperty[];
}

export interface TiledTileLayer {
  type: 'tilelayer';
  name: string;
  width: number;
  height: number;
  data: number[];
  visible?: boolean;
}

export interface TiledObjectLayer {
  type: 'objectgroup';
  name: string;
  objects: TiledObject[];
}

export type TiledLayer = TiledTileLayer | TiledObjectLayer;

export interface TiledTileset {
  firstgid: number;
  name: string;
  tilewidth: number;
  tileheight: number;
  tilecount?: number;
  columns?: number;
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  infinite?: boolean;
  orientation?: string;
  layers: TiledLayer[];
  tilesets: TiledTileset[];
  properties?: TiledProperty[];
}

/** Layer names every map must have (guide Section 9). */
export const TILE_LAYERS = {
  groundPresent: 'ground_present',
  decoPresent: 'deco_present',
  groundEcho: 'ground_echo',
  decoEcho: 'deco_echo',
  above: 'above',
  collidePresent: 'collide_present',
  collideEcho: 'collide_echo',
} as const;

export const OBJECT_LAYERS = {
  npcs: 'npcs',
  doors: 'doors',
  triggers: 'triggers',
  spawns: 'spawns',
  echoZones: 'echo_zones',
  anchors: 'anchors',
} as const;

export const REQUIRED_TILE_LAYERS: readonly string[] = Object.values(TILE_LAYERS);
export const REQUIRED_OBJECT_LAYERS: readonly string[] = Object.values(OBJECT_LAYERS);

/** The visible tile layers for an era, bottom to top (the shared `above` layer is drawn separately). */
export function visibleLayersFor(era: Era): readonly string[] {
  return era === 'present'
    ? [TILE_LAYERS.groundPresent, TILE_LAYERS.decoPresent]
    : [TILE_LAYERS.groundEcho, TILE_LAYERS.decoEcho];
}

export function collisionLayerFor(era: Era): string {
  return era === 'present' ? TILE_LAYERS.collidePresent : TILE_LAYERS.collideEcho;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NpcPlacement {
  objectId: number;
  /** The NPC definition id in data/npcs.ts. */
  npc: string;
  pos: Pos;
  facing: Dir;
}

export interface Door {
  id: string;
  pos: Pos;
  /** Door id this door leads to. */
  target: string;
  /** Map of the target door; defaults to this map. */
  targetMap: string;
  /** Direction the player steps out when arriving at this door. */
  exit: Dir;
}

export interface Trigger {
  id: string;
  area: Rect;
  /** Dialogue to play when stepped on. */
  dialogue?: string;
  /** Flag set to true when the trigger fires. */
  flag?: string;
  /** Fire only while `flag` is unset. */
  once: boolean;
}

export interface Spawn {
  id: string;
  pos: Pos;
  facing: Dir;
  era: Era;
}

export interface Anchor {
  id: string;
  pos: Pos;
  flag?: string;
}

export interface GameMap {
  id: string;
  width: number;
  height: number;
  tileSize: number;
  collide: Record<Era, readonly number[]>;
  npcs: NpcPlacement[];
  doors: Door[];
  triggers: Trigger[];
  spawns: Spawn[];
  echoZones: Rect[];
  anchors: Anchor[];
}

export function getProp(obj: { properties?: TiledProperty[] }, name: string): FlagValue | undefined {
  return obj.properties?.find((p) => p.name === name)?.value;
}

function stringProp(obj: { properties?: TiledProperty[] }, name: string): string | undefined {
  const v = getProp(obj, name);
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function dirProp(obj: { properties?: TiledProperty[] }, name: string, fallback: Dir): Dir {
  const v = getProp(obj, name);
  return typeof v === 'string' && (DIRS as readonly string[]).includes(v) ? (v as Dir) : fallback;
}

export function findTileLayer(map: TiledMap, name: string): TiledTileLayer | undefined {
  const layer = map.layers.find((l) => l.name === name);
  return layer?.type === 'tilelayer' ? layer : undefined;
}

export function findObjectLayer(map: TiledMap, name: string): TiledObjectLayer | undefined {
  const layer = map.layers.find((l) => l.name === name);
  return layer?.type === 'objectgroup' ? layer : undefined;
}

/** Tile under an object's top-left corner. */
export function objectTile(obj: TiledObject, tileSize: number): Pos {
  return { x: Math.floor(obj.x / tileSize), y: Math.floor(obj.y / tileSize) };
}

/** The tile rectangle an object covers (at least one tile). */
export function objectRect(obj: TiledObject, tileSize: number): Rect {
  const x = Math.floor(obj.x / tileSize);
  const y = Math.floor(obj.y / tileSize);
  const width = Math.max(1, Math.round(obj.width / tileSize));
  const height = Math.max(1, Math.round(obj.height / tileSize));
  return { x, y, width, height };
}

export function rectContains(rect: Rect, pos: Pos): boolean {
  return pos.x >= rect.x && pos.y >= rect.y && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height;
}

export function rectTiles(rect: Rect): Pos[] {
  const out: Pos[] = [];
  for (let y = rect.y; y < rect.y + rect.height; y++) {
    for (let x = rect.x; x < rect.x + rect.width; x++) out.push({ x, y });
  }
  return out;
}

function objects(map: TiledMap, layer: string): TiledObject[] {
  return findObjectLayer(map, layer)?.objects ?? [];
}

export function parseMap(id: string, raw: TiledMap): GameMap {
  const size = raw.tilewidth;
  const collideData = (name: string): readonly number[] =>
    findTileLayer(raw, name)?.data ?? Array.from({ length: raw.width * raw.height }, () => 0);

  return {
    id,
    width: raw.width,
    height: raw.height,
    tileSize: size,
    collide: {
      present: collideData(TILE_LAYERS.collidePresent),
      echo: collideData(TILE_LAYERS.collideEcho),
    },
    npcs: objects(raw, OBJECT_LAYERS.npcs).map((o) => ({
      objectId: o.id,
      npc: stringProp(o, 'npc') ?? o.name,
      pos: objectTile(o, size),
      facing: dirProp(o, 'facing', 'down'),
    })),
    doors: objects(raw, OBJECT_LAYERS.doors).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      target: stringProp(o, 'target') ?? '',
      targetMap: stringProp(o, 'map') ?? id,
      exit: dirProp(o, 'exit', 'down'),
    })),
    triggers: objects(raw, OBJECT_LAYERS.triggers).map((o) => ({
      id: o.name,
      area: objectRect(o, size),
      dialogue: stringProp(o, 'dialogue'),
      flag: stringProp(o, 'flag'),
      once: getProp(o, 'once') === true,
    })),
    spawns: objects(raw, OBJECT_LAYERS.spawns).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      facing: dirProp(o, 'facing', 'down'),
      era: stringProp(o, 'era') === 'echo' ? 'echo' : 'present',
    })),
    echoZones: objects(raw, OBJECT_LAYERS.echoZones).map((o) => objectRect(o, size)),
    anchors: objects(raw, OBJECT_LAYERS.anchors).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      flag: stringProp(o, 'flag'),
    })),
  };
}
