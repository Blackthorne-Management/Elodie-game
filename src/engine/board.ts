import type { Dir, Pos } from './types';
import { BOARD_SIZE } from '../config';

export const DIRS: Record<Dir, Pos> = {
  north: { x: 0, y: -1 }, south: { x: 0, y: 1 }, east: { x: 1, y: 0 }, west: { x: -1, y: 0 },
};
export const DIR_NAMES = Object.keys(DIRS) as Dir[];

export const key = (p: Pos) => `${p.x},${p.y}`;
export const samePos = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y;
export const inBoard = (p: Pos) => p.x >= 0 && p.y >= 0 && p.x < BOARD_SIZE && p.y < BOARD_SIZE;
export const step = (p: Pos, d: Dir, n = 1): Pos => ({ x: p.x + DIRS[d].x * n, y: p.y + DIRS[d].y * n });
export const manhattan = (a: Pos, b: Pos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Squares available in a direction before the board edge.
export function roomToEdge(p: Pos, d: Dir): number {
  switch (d) {
    case 'north': return p.y;
    case 'south': return BOARD_SIZE - 1 - p.y;
    case 'west': return p.x;
    case 'east': return BOARD_SIZE - 1 - p.x;
  }
}

// The Throne is the centre 2x2 and counts as one tile.
const mid = BOARD_SIZE / 2;
export const THRONE: Pos[] = [
  { x: mid - 1, y: mid - 1 }, { x: mid, y: mid - 1 }, { x: mid - 1, y: mid }, { x: mid, y: mid },
];
export const onThrone = (p: Pos | null) => !!p && THRONE.some(t => samePos(t, p));
export const throneDistance = (p: Pos) => Math.min(...THRONE.map(t => manhattan(p, t)));

// Adjacent = same square or one of the 4 orthogonal neighbours.
export const adjacent = (a: Pos, b: Pos) => manhattan(a, b) <= 1;

// Straight-line distance 2 along a row or column (Ironvow III reach).
export const inLine = (a: Pos, b: Pos, n: number) =>
  (a.x === b.x && Math.abs(a.y - b.y) <= n) || (a.y === b.y && Math.abs(a.x - b.x) <= n);

export function dirAway(from: Pos, to: Pos): Dir[] {
  const out: Dir[] = [];
  for (const d of DIR_NAMES) {
    const n = step(to, d);
    if (manhattan(from, n) > manhattan(from, to)) out.push(d);
  }
  return out;
}

export function stepToward(from: Pos, to: Pos): Pos[] {
  return DIR_NAMES.map(d => step(from, d)).filter(n => inBoard(n) && manhattan(n, to) < manhattan(from, to));
}

export function squaresWithin(p: Pos, n: number): Pos[] {
  const out: Pos[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) for (let x = 0; x < BOARD_SIZE; x++) {
    const q = { x, y };
    if (manhattan(p, q) <= n && !samePos(p, q)) out.push(q);
  }
  return out;
}

export const label = (p: Pos) => `(${p.x + 1}, ${p.y + 1})`;
