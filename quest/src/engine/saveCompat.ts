// Saves across fixes (guide 9.1, Claude's call, Nov 13): a save made on one build must load on the next, after
// dialogue edits, renamed or moved maps and items, and redrawn maps. Everything a save holds is the place, the era
// and the flags (party, bag, gear, quests and chapter are all flags), so this module only has to (1) carry renamed
// ids over (data/saveFallbacks.ts), (2) finish a journey the save was waiting on, and (3) stand the party on a tile
// it can walk away from: its own when that still works, else the nearest one that does, else the chapter's safe
// spawn. Unknown ids that are left over are harmless: the engine reads flags through the content, never the reverse.

import { evaluate } from './conditions.ts';
import { FlagStore, type FlagSnapshot } from './flags.ts';
import { doorArrival, inBounds, isWalkable, samePos, stepFrom } from './grid.ts';
import type { SaveData } from './save.ts';
import { rectContains, type GameMap } from './tiledMap.ts';
import { DIRS, type Era, type Pos } from './types.ts';
import { ECHO_FLAG_PREFIX, activeTriggers, checkSwap, isOpen, npcBlocks } from './world.ts';

/** Ids a fix renamed: old id to new id. */
export interface SaveRenames {
  maps?: Readonly<Record<string, string>>;
  items?: Readonly<Record<string, string>>;
  flags?: Readonly<Record<string, string>>;
}

/** Where a chapter can always be picked up: the latest one whose `after` flag is set ('' = from the start). */
export interface SafeSpawn {
  after: string;
  map: string;
  spawn: string;
}

export interface SaveFallbacks {
  renames?: SaveRenames;
  safeSpawns?: readonly SafeSpawn[];
  /** Every item id this build has: gear worn that it no longer has comes off (else its slot would stay stuck). */
  items?: readonly string[];
}

const TRAVEL = 'travel.next';
const VOYAGE = 'voyage.next';
const FIGHT_RETURN = 'fight.return';

/** Carry renamed maps, items and flags over to their new ids, and take off gear this build does not have. */
export function migrateSave(data: SaveData, fb: SaveFallbacks = {}): SaveData {
  const maps = fb.renames?.maps ?? {};
  const items = fb.renames?.items ?? {};
  const flagNames = fb.renames?.flags ?? {};
  const known = fb.items ? new Set(fb.items) : null;
  const mapOf = (id: string) => maps[id] ?? id;
  const itemOf = (id: string) => items[id] ?? id;
  const key = (name: string): string => {
    if (flagNames[name]) return flagNames[name];
    let m = /^(item|shown\.item)\.(.+)$/.exec(name);
    if (m) return `${m[1]}.${itemOf(m[2]!)}`;
    m = /^(visited|seen)\.([^.]+)(.*)$/.exec(name);
    if (m && maps[m[2]!]) return `${m[1]}.${mapOf(m[2]!)}${m[3]}`;
    return name;
  };
  const flags: FlagSnapshot = {};
  for (const [name, value] of Object.entries(data.flags)) {
    const to = key(name);
    if (to !== name && Object.prototype.hasOwnProperty.call(data.flags, to)) continue; // the new id already there wins
    let v = value;
    if (typeof v === 'string') {
      if (name.startsWith('equip.')) {
        v = itemOf(v);
        if (v && known && !known.has(v)) v = '';
      } else if (name === TRAVEL || name === FIGHT_RETURN) {
        const slash = v.lastIndexOf('/');
        if (slash > 0) v = mapOf(v.slice(0, slash)) + v.slice(slash);
      }
    }
    flags[to] = v;
  }
  return { ...data, mapId: mapOf(data.mapId), flags };
}

type Node = { pos: Pos; era: Era };

/**
 * Every (tile, era) the party can reach on this map from a way in or out: its open spawns and the arrival tiles of
 * its open doors, walking open tiles (people step aside, so they never seal a way) and taking the Echo where it
 * holds. Doors are never walked through. A tile outside this set is a pocket the party could not leave.
 */
function reachable(map: GameMap, flags: FlagStore): Map<string, Node> {
  const id = (n: Node) => `${n.era}:${n.pos.x},${n.pos.y}`;
  const isDoor = (p: Pos) => map.doors.some((d) => d.tiles.some((t) => samePos(t, p)));
  const seen = new Map<string, Node>();
  const queue: Node[] = [];
  const push = (n: Node) => {
    if (seen.has(id(n)) || !isOpen(map, n.era, n.pos, flags) || isDoor(n.pos)) return;
    seen.set(id(n), n);
    queue.push(n);
  };
  for (const s of map.spawns) push({ pos: s.pos, era: s.era });
  // A door is a way out while it is open and its tiles can be walked into (a door walled off by a fix is none).
  for (const d of map.doors) {
    if ((!d.if || evaluate(d.if, flags)) && d.tiles.some((t) => isWalkable(map, 'present', t))) push({ pos: doorArrival(d).pos, era: 'present' });
  }
  while (queue.length > 0) {
    const n = queue.shift()!;
    for (const dir of DIRS) push({ pos: stepFrom(n.pos, dir), era: n.era });
    const swap = checkSwap(map, n.era, n.pos, flags);
    if (swap.ok) push({ pos: n.pos, era: swap.to });
  }
  return seen;
}

/** The nearest tile to `from` the party can stand on and leave, preferring the era it was in; null if none. */
export function nearestStandable(map: GameMap, from: Pos, era: Era, flags: FlagStore): Node | null {
  const fires = (n: Node) => activeTriggers(map, n.era, flags).some((t) => !t.onEnter && rectContains(t.area, n.pos) && !(t.once && t.flag && flags.isSet(t.flag)));
  let best: Node | null = null;
  let bestScore = Infinity;
  for (const n of reachable(map, flags).values()) {
    if (npcBlocks(map, n.era, n.pos, flags) || fires(n)) continue;
    const dx = Math.abs(n.pos.x - from.x);
    const dy = Math.abs(n.pos.y - from.y);
    // The save's own era first, then nearest (as the crow flies, then by steps).
    const score = (n.era === era ? 0 : 1e9) + Math.max(dx, dy) * 1000 + (dx + dy);
    if (score < bestScore) {
      best = n;
      bestScore = score;
    }
  }
  return best;
}

/** Whether the party can stand here and leave (the tile is open and joined to a way in or out). */
export function standable(map: GameMap, pos: Pos, era: Era, flags: FlagStore): boolean {
  return inBounds(map, pos) && reachable(map, flags).has(`${era}:${pos.x},${pos.y}`);
}

/** Leave the memory: its own flags go, as on any return to the present. */
function present(data: SaveData): SaveData {
  if (data.era === 'present') return data;
  const flags = Object.fromEntries(Object.entries(data.flags).filter(([k]) => !k.startsWith(ECHO_FLAG_PREFIX)));
  return { ...data, era: 'present', flags };
}

/** The chapter's safe spawn: the latest one reached whose map and spawn this build has. */
export function safeSpawn(data: SaveData, maps: Readonly<Record<string, GameMap>>, fb: SaveFallbacks): SaveData | null {
  const flags = new FlagStore(data.flags);
  for (const s of [...(fb.safeSpawns ?? [])].reverse()) {
    if (s.after && !flags.isSet(s.after)) continue;
    const spawn = maps[s.map]?.spawns.find((p) => p.id === s.spawn);
    if (spawn) return { ...present(data), mapId: s.map, x: spawn.pos.x, y: spawn.pos.y, facing: spawn.facing };
  }
  return null;
}

export type Placed = { data: SaveData; moved: boolean };

/**
 * Where a save goes on this build's maps. A journey the save was waiting on (saved on a chapter's card, closed
 * before the card was) is finished: the party lands where it was going. Then the saved tile, when the party can
 * still stand there and leave; else the nearest tile it can; else, when the map is gone, the chapter's safe spawn.
 * Null only when none of those exists. `moved`: the party is not where the save (or its journey) put it.
 */
export function placeOnMaps(input: SaveData, maps: Readonly<Record<string, GameMap>>, fb: SaveFallbacks = {}): Placed | null {
  let data = migrateSave(input, fb);
  const travel = data.flags[TRAVEL];
  if (typeof travel === 'string' && travel) {
    const flags = { ...data.flags };
    delete flags[TRAVEL];
    delete flags[VOYAGE];
    const [mapId, spawnId] = travel.split('/');
    const spawn = maps[mapId ?? '']?.spawns.find((s) => s.id === spawnId);
    if (!spawn) {
      const safe = safeSpawn({ ...data, flags }, maps, fb);
      return safe ? { data: safe, moved: true } : null;
    }
    data = { ...present({ ...data, flags }), mapId: mapId!, x: spawn.pos.x, y: spawn.pos.y, facing: spawn.facing };
  }
  const map = maps[data.mapId];
  if (!map) {
    const safe = safeSpawn(data, maps, fb);
    return safe ? { data: safe, moved: true } : null;
  }
  const flags = new FlagStore(data.flags);
  // A save whose position could not be read (save.ts: -1, -1) starts from the map's first way in.
  const first = map.spawns[0];
  const at = (data.x < 0 || data.y < 0) && first ? first.pos : { x: data.x, y: data.y };
  if (standable(map, at, data.era, flags)) {
    const same = at.x === data.x && at.y === data.y;
    return same ? { data, moved: false } : { data: { ...data, x: at.x, y: at.y }, moved: true };
  }
  const near = nearestStandable(map, at, data.era, flags);
  if (near) {
    const base = near.era === 'present' ? present(data) : data;
    return { data: { ...base, x: near.pos.x, y: near.pos.y, era: near.era }, moved: true };
  }
  const safe = safeSpawn(data, maps, fb);
  return safe ? { data: safe, moved: true } : null;
}
