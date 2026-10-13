// Map validator (guide Section 9, automated check 1). Pure: it takes parsed Tiled JSON plus the ids the
// content defines and returns readable errors. tools/validate-maps.ts and tests/maps.test.ts run it.

import { TILE_SIZE } from '../config.ts';
import { inBounds, isWalkable, samePos, stepFrom } from './grid.ts';
import {
  OBJECT_LAYERS,
  REQUIRED_OBJECT_LAYERS,
  REQUIRED_TILE_LAYERS,
  findObjectLayer,
  parseMap,
  rectTiles,
  type GameMap,
  type TiledMap,
} from './tiledMap.ts';
import { ERAS } from './types.ts';

export interface ValidationContext {
  /** NPC ids defined in data/npcs.ts. */
  npcIds: readonly string[];
  /** Dialogue ids defined in data/dialogue.ts. */
  dialogueIds: readonly string[];
}

function checkStructure(id: string, raw: TiledMap, errors: string[]): boolean {
  const e = (msg: string) => errors.push(`${id}: ${msg}`);
  let ok = true;
  if (!Number.isInteger(raw.width) || !Number.isInteger(raw.height) || raw.width <= 0 || raw.height <= 0) {
    e(`map size ${raw.width} x ${raw.height} is not a positive whole number of tiles`);
    ok = false;
  }
  if (raw.tilewidth !== TILE_SIZE || raw.tileheight !== TILE_SIZE) {
    e(`tiles are ${raw.tilewidth} x ${raw.tileheight}, expected ${TILE_SIZE} x ${TILE_SIZE}`);
  }
  if (raw.infinite) e('infinite maps are not supported');
  if (raw.orientation && raw.orientation !== 'orthogonal') e(`orientation "${raw.orientation}" is not supported`);
  if (!Array.isArray(raw.layers)) {
    e('no layers');
    return false;
  }
  if (!Array.isArray(raw.tilesets) || raw.tilesets.length === 0) e('no tileset');

  const maxGid = Math.max(
    0,
    ...(raw.tilesets ?? []).map((t) => (t.tilecount !== undefined ? t.firstgid + t.tilecount - 1 : Number.POSITIVE_INFINITY)),
  );
  const names = raw.layers.map((l) => l.name);
  for (const name of new Set(names)) {
    if (names.filter((n) => n === name).length > 1) e(`layer "${name}" appears more than once`);
  }
  for (const name of REQUIRED_TILE_LAYERS) {
    const layer = raw.layers.find((l) => l.name === name);
    if (!layer) {
      e(`missing tile layer "${name}"`);
      ok = false;
    } else if (layer.type !== 'tilelayer') {
      e(`layer "${name}" must be a tile layer`);
      ok = false;
    }
  }
  for (const name of REQUIRED_OBJECT_LAYERS) {
    const layer = raw.layers.find((l) => l.name === name);
    if (!layer) {
      e(`missing object layer "${name}"`);
      ok = false;
    } else if (layer.type !== 'objectgroup') {
      e(`layer "${name}" must be an object layer`);
      ok = false;
    }
  }
  for (const layer of raw.layers) {
    if (layer.type !== 'tilelayer') continue;
    if (layer.width !== raw.width || layer.height !== raw.height) {
      e(`layer "${layer.name}" is ${layer.width} x ${layer.height}, map is ${raw.width} x ${raw.height}`);
      ok = false;
    }
    if (!Array.isArray(layer.data) || layer.data.length !== raw.width * raw.height) {
      e(`layer "${layer.name}" has ${layer.data?.length ?? 0} tiles, expected ${raw.width * raw.height}`);
      ok = false;
      continue;
    }
    const bad = layer.data.findIndex((g) => !Number.isInteger(g) || g < 0 || g > maxGid);
    if (bad >= 0) e(`layer "${layer.name}" has an unknown tile ${layer.data[bad]} at index ${bad}`);
  }
  return ok;
}

function checkObjects(id: string, raw: TiledMap, map: GameMap, ctx: ValidationContext, errors: string[]): void {
  const e = (msg: string) => errors.push(`${id}: ${msg}`);
  const tileSize = raw.tilewidth;

  // Every object sits inside the map.
  for (const layerName of REQUIRED_OBJECT_LAYERS) {
    for (const o of findObjectLayer(raw, layerName)?.objects ?? []) {
      const right = o.x + Math.max(o.width, tileSize);
      const bottom = o.y + Math.max(o.height, tileSize);
      if (o.x < 0 || o.y < 0 || right > raw.width * tileSize || bottom > raw.height * tileSize) {
        e(`${layerName} object "${o.name || o.id}" is outside the map`);
      }
    }
  }

  // Ids are present and unique within their layer.
  const named: [string, { id: string }[]][] = [
    [OBJECT_LAYERS.doors, map.doors],
    [OBJECT_LAYERS.triggers, map.triggers],
    [OBJECT_LAYERS.spawns, map.spawns],
    [OBJECT_LAYERS.anchors, map.anchors],
  ];
  for (const [layerName, items] of named) {
    const seen = new Set<string>();
    for (const item of items) {
      if (!item.id) e(`${layerName} has an object with no name (its id)`);
      else if (seen.has(item.id)) e(`${layerName} id "${item.id}" is used twice`);
      seen.add(item.id);
    }
  }

  // Spawns: at least one, on a walkable tile in their era.
  if (map.spawns.length === 0) e('has no spawns');
  for (const s of map.spawns) {
    if (!isWalkable(map, s.era, s.pos)) e(`spawn "${s.id}" at ${s.pos.x},${s.pos.y} is not walkable in the ${s.era}`);
  }

  // NPCs reference a defined NPC, stand in bounds, and do not stand on a door or a spawn.
  const npcIds = new Set(ctx.npcIds);
  for (const n of map.npcs) {
    if (!npcIds.has(n.npc)) e(`npc "${n.npc}" is not defined in data/npcs.ts`);
    if (!inBounds(map, n.pos)) continue;
    if (map.doors.some((d) => samePos(d.pos, n.pos))) e(`npc "${n.npc}" stands on a door`);
    if (map.spawns.some((s) => samePos(s.pos, n.pos))) e(`npc "${n.npc}" stands on a spawn`);
  }

  // Triggers reference an existing dialogue; `once` needs a flag to remember it.
  const dialogueIds = new Set(ctx.dialogueIds);
  for (const t of map.triggers) {
    if (t.dialogue && !dialogueIds.has(t.dialogue)) e(`trigger "${t.id}" plays unknown dialogue "${t.dialogue}"`);
    if (!t.dialogue && !t.flag) e(`trigger "${t.id}" does nothing (no dialogue or flag)`);
    if (t.once && !t.flag) e(`trigger "${t.id}" is once-only but has no flag to remember it`);
  }

  // Echo Zones: every tile is walkable in BOTH eras (guide 6.1), so a swap inside one never fails.
  for (const [i, zone] of map.echoZones.entries()) {
    for (const tile of rectTiles(zone)) {
      for (const era of ERAS) {
        if (!isWalkable(map, era, tile)) e(`echo zone ${i + 1} tile ${tile.x},${tile.y} is not walkable in the ${era}`);
      }
    }
  }

  for (const a of map.anchors) if (!inBounds(map, a.pos)) e(`anchor "${a.id}" is outside the map`);
}

/** Validate one map on its own (door targets on other maps are checked by validateMaps). */
export function validateMap(id: string, raw: TiledMap, ctx: ValidationContext): string[] {
  return validateOne(id, raw, ctx).errors;
}

function validateOne(id: string, raw: TiledMap, ctx: ValidationContext): { errors: string[]; map?: GameMap } {
  const errors: string[] = [];
  if (!checkStructure(id, raw, errors)) return { errors };
  const map = parseMap(id, raw);
  checkObjects(id, raw, map, ctx, errors);
  return { errors, map };
}

/** Validate every map, including door pairs across maps. */
export function validateMaps(maps: Readonly<Record<string, TiledMap>>, ctx: ValidationContext): string[] {
  const errors: string[] = [];
  const parsed: Record<string, GameMap> = {};
  for (const [id, raw] of Object.entries(maps)) {
    const result = validateOne(id, raw, ctx);
    errors.push(...result.errors);
    if (result.map) parsed[id] = result.map;
  }

  for (const map of Object.values(parsed)) {
    for (const door of map.doors) {
      const where = `${map.id}: door "${door.id}"`;
      if (!isWalkable(map, 'present', door.pos)) errors.push(`${where} is on a blocked tile`);
      const arrival = stepFrom(door.pos, door.exit);
      if (!isWalkable(map, 'present', arrival)) {
        errors.push(`${where} lets the player out (${door.exit}) onto a blocked tile ${arrival.x},${arrival.y}`);
      }
      if (!door.target) {
        errors.push(`${where} has no target`);
        continue;
      }
      if (!(door.targetMap in maps)) {
        errors.push(`${where} leads to unknown map "${door.targetMap}"`);
        continue;
      }
      const targetMap = parsed[door.targetMap];
      if (!targetMap) continue; // that map already reported its own errors
      const target = targetMap.doors.find((d) => d.id === door.target);
      if (!target) {
        errors.push(`${where} leads to unknown door "${door.target}" on ${door.targetMap}`);
        continue;
      }
      if (target.target !== door.id || target.targetMap !== map.id) {
        errors.push(`${where} is not paired: "${door.target}" does not lead back to it`);
      }
    }
  }
  return errors;
}
