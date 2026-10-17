// The Tiled JSON (.tmj) subset the quest uses, and a parser that turns it into a GameMap the
// engine can query. The validator (mapValidation.ts) reports problems; parseMap assumes a valid map.

import { parseConditionText, type Condition } from './conditions.ts';
import { DIRS, type Dir, type Era, type EraScope, type FlagValue, type Pos } from './types.ts';

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
  puzzleObjects: 'puzzle_objects',
  encounters: 'encounters',
  crowds: 'crowds',
} as const;

export const REQUIRED_TILE_LAYERS: readonly string[] = Object.values(TILE_LAYERS);
/** Every object layer but `encounters` and `crowds`, which only some maps have. */
export const REQUIRED_OBJECT_LAYERS: readonly string[] = Object.values(OBJECT_LAYERS).filter((l) => l !== OBJECT_LAYERS.encounters && l !== OBJECT_LAYERS.crowds);

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
  /** Era the NPC stands in (default: the present). Echo NPCs can differ from present ones. */
  era: EraScope;
  /** Shown only while this holds (Tiled property `if`, see parseConditionText). */
  if?: Condition;
}

export interface Door {
  id: string;
  /** The door's first tile (arrivals step out from here). */
  pos: Pos;
  /** Every tile of the door (a door can be two tiles wide, so it is easy to walk into). */
  tiles: readonly Pos[];
  /** Door id this door leads to. */
  target: string;
  /** Map of the target door; defaults to this map. */
  targetMap: string;
  /** Direction the player steps out when arriving at this door. */
  exit: Dir;
  /** Open only while this holds (Tiled property `if`); closed, it does not let the player through. */
  if?: Condition;
  /** The dialogue played when the player walks into it while it is closed (Tiled property `closed`). */
  closed?: string;
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
  /** Era the trigger works in (default: the present). */
  era: EraScope;
  /** Fires only while this holds. */
  if?: Condition;
  /** Fires when the player enters the map (new game or a door), wherever they stand, instead of on a step. */
  onEnter: boolean;
}

export interface Spawn {
  id: string;
  pos: Pos;
  facing: Dir;
  era: Era;
}

/**
 * Echo Zone (guide 6.1): shimmering tiles where the Echo swap works. `if` gates it (for example on
 * having the Sun Locket); `onEcho` / `onReturn` are dialogues played after a swap into or out of the
 * memory here (they guard themselves with flags).
 */
export interface EchoZone {
  id: string;
  area: Rect;
  if?: Condition;
  onEcho?: string;
  onReturn?: string;
}

/**
 * Encounter zone (the wild section of a capital: bandits, crooks, cultists): while the player walks
 * here in the present, each step may start a fight from the encounter table `table`
 * (data/encounters.ts). `if` gates it (for example, no ambushes before the story allows).
 */
export interface EncounterZone {
  id: string;
  area: Rect;
  table: string;
  if?: Condition;
}

/**
 * Crowd (demo review, Oct 17: the festival needs its people): `count` passers-by in `looks`, wandering
 * inside the area in the present while `if` holds. Pictures only: nobody to talk to, nothing that
 * blocks the way (engine/crowd.ts picks where they stand and step; scenes/FieldScene.ts draws them).
 */
export interface CrowdZone {
  id: string;
  area: Rect;
  count: number;
  looks: string[];
  if?: Condition;
}

/**
 * Anchor (guide 6.1): marks the one Echo-era puzzle object whose change carries back to the present.
 * Using that object sets `flag` (an `anchor.` flag); present-era objects read it.
 */
export interface Anchor {
  id: string;
  pos: Pos;
  /** Puzzle object id (on this map) that is the anchor. */
  object: string;
  /** The flag the anchor carries into the present. */
  flag: string;
}

/**
 * Puzzle object (guide Section 9, layer `puzzle_objects`): something in one era (or both) that the
 * player can examine or use (its dialogue sets flags), and that can change the ground while active:
 * `walkable` opens its tiles (a lowered bridge), `solid` blocks them.
 */
export interface PuzzleObject {
  id: string;
  /** Tile name drawn over the area while active (assets.config.ts TILESET); none for an invisible object. */
  kind?: string;
  area: Rect;
  era: EraScope;
  if?: Condition;
  solid: boolean;
  walkable: boolean;
  /** Played when the player faces the object and presses confirm. */
  dialogue?: string;
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
  echoZones: EchoZone[];
  anchors: Anchor[];
  objects: PuzzleObject[];
  encounters: EncounterZone[];
  crowds: CrowdZone[];
}

export function getProp(obj: { properties?: TiledProperty[] }, name: string): FlagValue | undefined {
  return obj.properties?.find((p) => p.name === name)?.value;
}

function stringProp(obj: { properties?: TiledProperty[] }, name: string): string | undefined {
  const v = getProp(obj, name);
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function eraScopeProp(obj: { properties?: TiledProperty[] }, fallback: EraScope): EraScope {
  const v = getProp(obj, 'era');
  return v === 'present' || v === 'echo' || v === 'both' ? v : fallback;
}

/** The `if` property as a Condition (undefined when absent or unreadable: the validator reports that). */
function condProp(obj: { properties?: TiledProperty[] }): Condition | undefined {
  const v = getProp(obj, 'if');
  if (typeof v !== 'string') return undefined;
  const parsed = parseConditionText(v);
  return parsed.ok ? parsed.cond : undefined;
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
      era: eraScopeProp(o, 'present'),
      if: condProp(o),
    })),
    doors: objects(raw, OBJECT_LAYERS.doors).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      tiles: rectTiles(objectRect(o, size)),
      target: stringProp(o, 'target') ?? '',
      targetMap: stringProp(o, 'map') ?? id,
      exit: dirProp(o, 'exit', 'down'),
      if: condProp(o),
      closed: stringProp(o, 'closed'),
    })),
    triggers: objects(raw, OBJECT_LAYERS.triggers).map((o) => ({
      id: o.name,
      area: objectRect(o, size),
      dialogue: stringProp(o, 'dialogue'),
      flag: stringProp(o, 'flag'),
      once: getProp(o, 'once') === true,
      era: eraScopeProp(o, 'present'),
      if: condProp(o),
      onEnter: getProp(o, 'onEnter') === true,
    })),
    spawns: objects(raw, OBJECT_LAYERS.spawns).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      facing: dirProp(o, 'facing', 'down'),
      era: stringProp(o, 'era') === 'echo' ? 'echo' : 'present',
    })),
    echoZones: objects(raw, OBJECT_LAYERS.echoZones).map((o) => ({
      id: o.name,
      area: objectRect(o, size),
      if: condProp(o),
      onEcho: stringProp(o, 'onEcho'),
      onReturn: stringProp(o, 'onReturn'),
    })),
    anchors: objects(raw, OBJECT_LAYERS.anchors).map((o) => ({
      id: o.name,
      pos: objectTile(o, size),
      object: stringProp(o, 'object') ?? '',
      flag: stringProp(o, 'flag') ?? '',
    })),
    encounters: objects(raw, OBJECT_LAYERS.encounters).map((o) => ({
      id: o.name,
      area: objectRect(o, size),
      table: stringProp(o, 'table') ?? '',
      if: condProp(o),
    })),
    crowds: objects(raw, OBJECT_LAYERS.crowds).map((o) => ({
      id: o.name,
      area: objectRect(o, size),
      count: Number(stringProp(o, 'count') ?? 0),
      looks: (stringProp(o, 'looks') ?? '').split(',').map((l) => l.trim()).filter(Boolean),
      if: condProp(o),
    })),
    objects: objects(raw, OBJECT_LAYERS.puzzleObjects).map((o) => ({
      id: o.name,
      kind: stringProp(o, 'kind'),
      area: objectRect(o, size),
      era: eraScopeProp(o, 'both'),
      if: condProp(o),
      solid: getProp(o, 'solid') === true,
      walkable: getProp(o, 'walkable') === true,
      dialogue: stringProp(o, 'dialogue'),
    })),
  };
}
