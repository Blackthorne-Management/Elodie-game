// Grid movement and collision rules. Pure TypeScript: the Field scene animates what these decide.

import { DIRS, type Diagonal, type Dir, type Dir8, type Era, type Pos } from './types.ts';
import type { Door, GameMap, Spawn, Trigger } from './tiledMap.ts';
import { rectContains } from './tiledMap.ts';

export const DIR_VECTORS: Record<Dir8, Pos> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  'up-left': { x: -1, y: -1 },
  'up-right': { x: 1, y: -1 },
  'down-left': { x: -1, y: 1 },
  'down-right': { x: 1, y: 1 },
};

const OPPOSITE: Record<Dir8, Dir8> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
  'up-left': 'down-right',
  'up-right': 'down-left',
  'down-left': 'up-right',
  'down-right': 'up-left',
};

export function opposite(dir: Dir): Dir;
export function opposite(dir: Dir8): Dir8;
export function opposite(dir: Dir8): Dir8 {
  return OPPOSITE[dir];
}

export function isDiagonal(dir: Dir8): dir is Diagonal {
  return !(DIRS as readonly string[]).includes(dir);
}

/** The two orthogonal parts of a diagonal, horizontal first: 'up-right' is ['right', 'up']. */
export function components(dir: Diagonal): [Dir, Dir] {
  const [v, h] = dir.split('-') as [Dir, Dir];
  return [h, v];
}

/** The diagonal (or straight) direction made of a horizontal and a vertical part; null when both are null. */
export function combine(horizontal: 'left' | 'right' | null, vertical: 'up' | 'down' | null): Dir8 | null {
  if (horizontal && vertical) return `${vertical}-${horizontal}`;
  return horizontal ?? vertical;
}

/**
 * The sprite facing for a direction: sprites have four facings, so a diagonal shows its horizontal
 * side (walking up-right faces right). Interaction looks at the diagonal tile first, then this one.
 */
export function spriteFacing(dir: Dir8): Dir {
  return isDiagonal(dir) ? components(dir)[0] : dir;
}

/** The straight facing that looks from `from` toward `to` (an NPC turning to the player). */
export function facingToward(from: Pos, to: Pos): Dir {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return 'down';
  return Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
}

export function stepFrom(pos: Pos, dir: Dir8): Pos {
  const v = DIR_VECTORS[dir];
  return { x: pos.x + v.x, y: pos.y + v.y };
}

/**
 * The tiles the player is facing, nearest rule first: the tile in the facing direction, and for a
 * diagonal facing also the tile the sprite faces (its horizontal side). Talking, using objects and the
 * name label all look here.
 */
export function facingTiles(pos: Pos, facing: Dir8): Pos[] {
  const front = stepFrom(pos, facing);
  return isDiagonal(facing) ? [front, stepFrom(pos, spriteFacing(facing))] : [front];
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
  | { moved: false; reason: 'bounds' | 'collision' | 'occupied' | 'corner' };

/**
 * Try to step one tile, straight or diagonally. `occupied` reports tiles blocked by characters (NPCs
 * today; the party later). The collision layer used is the one for the current era.
 *
 * A diagonal step needs the target tile AND both straight neighbours it passes between to be walkable
 * and unoccupied ('corner' otherwise): no cutting a wall's corner and no squeezing between two blocked
 * tiles. So a diagonal only ever shortens a walk the two straight steps could already make; it never
 * reaches a tile that straight steps cannot.
 */
export function tryMove(map: GameMap, era: Era, from: Pos, dir: Dir8, occupied: (p: Pos) => boolean = () => false): MoveResult {
  const to = stepFrom(from, dir);
  if (!inBounds(map, to)) return { moved: false, reason: 'bounds' };
  if (!isWalkable(map, era, to)) return { moved: false, reason: 'collision' };
  if (occupied(to)) return { moved: false, reason: 'occupied' };
  if (isDiagonal(dir)) {
    for (const part of components(dir)) {
      const side = stepFrom(from, part);
      if (!isWalkable(map, era, side) || occupied(side)) return { moved: false, reason: 'corner' };
    }
  }
  return { moved: true, to };
}

export function doorAt(map: GameMap, pos: Pos): Door | undefined {
  return map.doors.find((d) => onDoor(d, pos));
}

/** Whether a tile is part of a door (doors can be two tiles wide). */
export function onDoor(door: Door, pos: Pos): boolean {
  return door.tiles.some((t) => samePos(t, pos));
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
