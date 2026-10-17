// Map validator (guide Section 9, automated check 1). Pure: it takes parsed Tiled JSON plus the ids the
// content defines and returns readable errors. tools/validate-maps.ts and tests/maps.test.ts run it.

import { TILE_SIZE } from '../config.ts';
import { flagsIn, parseConditionText, type Condition } from './conditions.ts';
import { components, inBounds, isWalkable, onDoor, samePos, stepFrom } from './grid.ts';
import {
  OBJECT_LAYERS,
  REQUIRED_OBJECT_LAYERS,
  REQUIRED_TILE_LAYERS,
  findObjectLayer,
  getProp,
  parseMap,
  rectContains,
  rectTiles,
  type GameMap,
  type TiledMap,
} from './tiledMap.ts';
import { DIAGONALS, ERAS } from './types.ts';
import { inScope } from './world.ts';
import { ANCHOR_FLAG_PREFIX, ECHO_FLAG_PREFIX } from './world.ts';

export interface ValidationContext {
  /** NPC ids defined in data/npcs.ts. */
  npcIds: readonly string[];
  /** Dialogue ids defined in data/dialogue.ts. */
  dialogueIds: readonly string[];
  /** Tile names a puzzle object may draw (assets.config.ts TILESET). Unchecked when absent. */
  objectKinds?: readonly string[];
  /** Flags each dialogue can set (engine/dialogue.ts flagsSetBy). Anchor checks need it. */
  dialogueSets?: Readonly<Record<string, readonly string[]>>;
}

/** Layers whose objects may carry an `if` condition or an `era`. */
const CONDITIONAL_LAYERS = [OBJECT_LAYERS.npcs, OBJECT_LAYERS.triggers, OBJECT_LAYERS.echoZones, OBJECT_LAYERS.puzzleObjects, OBJECT_LAYERS.crowds];

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
    [OBJECT_LAYERS.puzzleObjects, map.objects],
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
    if (map.doors.some((d) => onDoor(d, n.pos))) e(`npc "${n.npc}" stands on a door`);
    if (map.spawns.some((s) => samePos(s.pos, n.pos))) e(`npc "${n.npc}" stands on a spawn`);
  }

  // Triggers reference an existing dialogue; `once` needs a flag to remember it.
  const dialogueIds = new Set(ctx.dialogueIds);
  for (const t of map.triggers) {
    if (t.dialogue && !dialogueIds.has(t.dialogue)) e(`trigger "${t.id}" plays unknown dialogue "${t.dialogue}"`);
    if (!t.dialogue && !t.flag) e(`trigger "${t.id}" does nothing (no dialogue or flag)`);
    if (t.once && !t.flag) e(`trigger "${t.id}" is once-only but has no flag to remember it`);
    if (t.onEnter && !t.once) e(`trigger "${t.id}" runs on entering the map, so it must be once-only`);
  }
  // A door that can be closed says why: its `closed` dialogue exists (and a `closed` needs an `if`).
  for (const d of map.doors) {
    if (d.if && !d.closed) e(`door "${d.id}" can be closed but has no "closed" dialogue`);
    if (d.closed && !d.if) e(`door "${d.id}" has a "closed" dialogue but no "if"`);
    if (d.closed && !dialogueIds.has(d.closed)) e(`door "${d.id}" plays unknown dialogue "${d.closed}"`);
  }

  // `if` conditions parse and `era` values are known.
  for (const layerName of CONDITIONAL_LAYERS) {
    for (const o of findObjectLayer(raw, layerName)?.objects ?? []) {
      const label = `${layerName} object "${o.name || o.id}"`;
      const cond = getProp(o, 'if');
      if (cond !== undefined) {
        if (typeof cond !== 'string') e(`${label} has a non-text "if"`);
        else {
          const parsed = parseConditionText(cond);
          if (!parsed.ok) e(`${label}: ${parsed.error}`);
        }
      }
      const era = getProp(o, 'era');
      if (era !== undefined && era !== 'present' && era !== 'echo' && era !== 'both') e(`${label} has an unknown era "${String(era)}"`);
    }
  }

  // Present-era content never reads the memory's own flags: they are wiped on the way back (guide 6.1).
  const readsEcho = (cond: Condition | undefined) => flagsIn(cond).some((f) => f.startsWith(ECHO_FLAG_PREFIX));
  for (const n of map.npcs) if (n.era === 'present' && readsEcho(n.if)) e(`npc "${n.npc}" is in the present but reads an echo flag`);
  for (const t of map.triggers) if (t.era === 'present' && readsEcho(t.if)) e(`trigger "${t.id}" is in the present but reads an echo flag`);
  for (const o of map.objects) if (o.era === 'present' && readsEcho(o.if)) e(`puzzle object "${o.id}" is in the present but reads an echo flag`);

  // Puzzle objects: a known look, a real dialogue, and not both solid and walkable.
  const kinds = ctx.objectKinds ? new Set(ctx.objectKinds) : null;
  for (const o of map.objects) {
    if (o.kind && kinds && !kinds.has(o.kind)) e(`puzzle object "${o.id}" draws unknown tile "${o.kind}"`);
    if (o.dialogue && !dialogueIds.has(o.dialogue)) e(`puzzle object "${o.id}" plays unknown dialogue "${o.dialogue}"`);
    if (o.solid && o.walkable) e(`puzzle object "${o.id}" is both solid and walkable`);
    if (!o.kind && !o.dialogue && !o.solid && !o.walkable) e(`puzzle object "${o.id}" does nothing`);
  }

  // Echo Zones: every tile is walkable in BOTH eras (guide 6.1), so a swap inside one never fails.
  // Nothing that can stand or appear on a zone tile may break that: no NPC, door or solid object.
  for (const [i, zone] of map.echoZones.entries()) {
    const label = zone.id ? `echo zone "${zone.id}"` : `echo zone ${i + 1}`;
    for (const tile of rectTiles(zone.area)) {
      for (const era of ERAS) {
        if (!isWalkable(map, era, tile)) e(`${label} tile ${tile.x},${tile.y} is not walkable in the ${era}`);
      }
    }
    for (const n of map.npcs) if (rectContains(zone.area, n.pos)) e(`npc "${n.npc}" stands inside ${label}`);
    for (const d of map.doors) if (d.tiles.some((t) => rectContains(zone.area, t))) e(`door "${d.id}" is inside ${label}`);
    for (const o of map.objects) {
      if (o.solid && rectTiles(o.area).some((t) => rectContains(zone.area, t))) e(`solid puzzle object "${o.id}" overlaps ${label}`);
    }
    for (const d of [zone.onEcho, zone.onReturn]) if (d && !dialogueIds.has(d)) e(`${label} plays unknown dialogue "${d}"`);
  }

  // Diagonal steps (grid.ts tryMove) need both straight neighbours open, so they never reach a tile
  // straight steps cannot. The one thing they could still do is slip between two step triggers that
  // touch only at a corner, without landing on either: rule that layout out.
  const stepTriggers = map.triggers.filter((t) => !t.onEnter);
  for (const era of ERAS) {
    const inEra = stepTriggers.filter((t) => inScope(t.era, era));
    if (inEra.length < 2) continue;
    const reported = new Set<string>();
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const from = { x, y };
        if (!isWalkable(map, era, from)) continue;
        for (const d of DIAGONALS) {
          const to = stepFrom(from, d);
          const [a, b] = components(d).map((part) => stepFrom(from, part)) as [typeof from, typeof from];
          if (![to, a, b].every((p) => isWalkable(map, era, p))) continue;
          for (const ta of inEra.filter((t) => rectContains(t.area, a))) {
            for (const tb of inEra.filter((t) => t !== ta && rectContains(t.area, b))) {
              if ([from, to].some((p) => rectContains(ta.area, p) || rectContains(tb.area, p))) continue;
              const key = [ta.id, tb.id].sort().join('|');
              if (reported.has(key)) continue;
              reported.add(key);
              e(`a diagonal step from ${x},${y} (${d}, ${era}) slips between triggers "${ta.id}" and "${tb.id}" without touching either`);
            }
          }
        }
      }
    }
  }

  // Anchors: each names a real Echo-era puzzle object on this map that sets the anchor's flag.
  const sets = ctx.dialogueSets;
  const anchorObjects = new Set<string>();
  for (const a of map.anchors) {
    if (!inBounds(map, a.pos)) e(`anchor "${a.id}" is outside the map`);
    if (!a.flag.startsWith(ANCHOR_FLAG_PREFIX)) e(`anchor "${a.id}" flag "${a.flag}" must start with "${ANCHOR_FLAG_PREFIX}"`);
    const obj = map.objects.find((o) => o.id === a.object);
    if (!obj) {
      e(`anchor "${a.id}" names unknown puzzle object "${a.object}"`);
      continue;
    }
    anchorObjects.add(obj.id);
    if (obj.era !== 'echo') e(`anchor "${a.id}" object "${obj.id}" must be in the echo (it is ${obj.era})`);
    if (!rectContains(obj.area, a.pos)) e(`anchor "${a.id}" does not sit on its object "${obj.id}"`);
    if (sets) {
      if (!obj.dialogue) e(`anchor "${a.id}" object "${obj.id}" has no dialogue to set "${a.flag}"`);
      else if (!(sets[obj.dialogue] ?? []).includes(a.flag)) e(`anchor "${a.id}": dialogue "${obj.dialogue}" never sets "${a.flag}"`);
    }
  }
  // Only anchors carry changes: no other Echo-era object may set an anchor flag.
  if (sets) {
    for (const o of map.objects) {
      if (o.era === 'present' || anchorObjects.has(o.id) || !o.dialogue) continue;
      const bad = (sets[o.dialogue] ?? []).filter((f) => f.startsWith(ANCHOR_FLAG_PREFIX));
      if (bad.length > 0) e(`puzzle object "${o.id}" is not an anchor but its dialogue sets ${bad.join(', ')}`);
    }
  }
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

  // Every anchor flag is read by something in the present, or the anchor carries nothing.
  const presentReads = new Set<string>();
  for (const map of Object.values(parsed)) {
    for (const thing of [...map.npcs, ...map.triggers, ...map.objects]) {
      if (thing.era !== 'echo') for (const f of flagsIn(thing.if)) presentReads.add(f);
    }
  }
  for (const map of Object.values(parsed)) {
    for (const a of map.anchors) {
      if (a.flag && !presentReads.has(a.flag)) errors.push(`${map.id}: anchor "${a.id}" flag "${a.flag}" changes nothing in the present`);
    }
  }

  for (const map of Object.values(parsed)) {
    for (const door of map.doors) {
      const where = `${map.id}: door "${door.id}"`;
      if (door.tiles.some((t) => !isWalkable(map, 'present', t))) errors.push(`${where} is on a blocked tile`);
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
