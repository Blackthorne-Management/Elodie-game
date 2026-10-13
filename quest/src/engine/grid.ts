// Grid movement and collision rules. Pure TypeScript: the Field scene animates what these decide.

import type { Dir, Era, Pos } from './types.ts';
import type { Door, GameMap, Spawn, Trigger } from './tiledMap.ts';
import { rectContains } from './tiledMap.ts';

export const DIR_VECTORS: Record<Dir, Pos> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function opposite(dir: Dir): Dir {
  switch (dir) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
}

export function stepFrom(pos: Pos, dir: Dir): Pos {
  const v = DIR_VECTORS[dir];
  return { x: pos.x + v.x, y: pos.y + v.y };
}

export function samePos(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y;
}

export function inBounds(map: Pick<GameMap, 'width' | 'height'>, pos: Pos): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < map.width && pos.y < map.height;
}

/** A tile is walkable in an era when it is on the map and that era's collision layer is empty there. */
export function isWalkable(map: Pick<GameMap, 'width' | 'height' | 'collide'>, era: Era, pos: Pos): boolean {
  if (!inBounds(map, pos)) return false;
  return (map.collide[era][pos.y * map.width + pos.x] ?? 0) === 0;
}

export function npcAt(map: GameMap, pos: Pos): GameMap['npcs'][number] | undefined {
  return map.npcs.find((n) => samePos(n.pos, pos));
}

export type MoveResult =
  | { moved: true; to: Pos }
  | { moved: false; reason: 'bounds' | 'collision' | 'occupied' };

/**
 * Try to step one tile. `occupied` reports tiles blocked by characters (NPCs today; the party later).
 * The collision layer used is the one for the current era.
 */
export function tryMove(map: GameMap, era: Era, from: Pos, dir: Dir, occupied: (p: Pos) => boolean = () => false): MoveResult {
  const to = stepFrom(from, dir);
  if (!inBounds(map, to)) return { moved: false, reason: 'bounds' };
  if (!isWalkable(map, era, to)) return { moved: false, reason: 'collision' };
  if (occupied(to)) return { moved: false, reason: 'occupied' };
  return { moved: true, to };
}

export function doorAt(map: GameMap, pos: Pos): Door | undefined {
  return map.doors.find((d) => samePos(d.pos, pos));
}

export function triggerAt(map: GameMap, pos: Pos): Trigger | undefined {
  return map.triggers.find((t) => rectContains(t.area, pos));
}

export function findSpawn(map: GameMap, id: string): Spawn | undefined {
  return map.spawns.find((s) => s.id === id);
}

/** Where the player lands when arriving through a door: one step out of it, facing out. */
export function doorArrival(door: Door): { pos: Pos; facing: Dir } {
  return { pos: stepFrom(door.pos, door.exit), facing: door.exit };
}

export function inEchoZone(map: GameMap, pos: Pos): boolean {
  return map.echoZones.some((z) => rectContains(z.area, pos));
}

export function otherEra(era: Era): Era {
  return era === 'present' ? 'echo' : 'present';
}

/**
 * The static Echo swap rule (guide 6.1) on the map's own collision layers: allowed only inside an Echo
 * Zone and only when the same tile is walkable in the other era. The game uses world.ts `checkSwap`,
 * which adds zone conditions, puzzle objects and NPCs on top of this.
 */
export function canSwapEra(map: GameMap, era: Era, pos: Pos): boolean {
  return inEchoZone(map, pos) && isWalkable(map, otherEra(era), pos);
}
