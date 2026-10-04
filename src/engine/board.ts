import type { Dir, Pos } from './types';
import { BOARD, BOARD_SIZE } from '../config';

export const DIRS: Record<Dir, Pos> = {
  north: { x: 0, y: -1 }, south: { x: 0, y: 1 }, east: { x: 1, y: 0 }, west: { x: -1, y: 0 },
};
export const DIR_NAMES = Object.keys(DIRS) as Dir[];

export const key = (p: Pos) => `${p.x},${p.y}`;
export const samePos = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y;
// A square a pawn can stand on: on the board and not sea.
export const inBoard = (p: Pos) =>
  p.x >= 0 && p.y >= 0 && p.x < BOARD_SIZE && p.y < BOARD_SIZE && (!BOARD.land || BOARD.land[p.y][p.x] === '.');
export const isSea = (p: Pos) => !inBoard(p) && p.x >= 0 && p.y >= 0 && p.x < BOARD_SIZE && p.y < BOARD_SIZE;
export const step = (p: Pos, d: Dir, n = 1): Pos => ({ x: p.x + DIRS[d].x * n, y: p.y + DIRS[d].y * n });
export const manhattan = (a: Pos, b: Pos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Squares available in a direction before the board edge or the sea.
export function roomToEdge(p: Pos, d: Dir): number {
  let n = 0;
  while (inBoard(step(p, d, n + 1))) n++;
  return n;
}

// Walking distance from p to every square it can reach (around the sea).
export function walkDistances(p: Pos, max = Infinity): Map<string, number> {
  const dist = new Map<string, number>([[key(p), 0]]);
  let frontier = [p];
  for (let d = 1; d <= max && frontier.length; d++) {
    const next: Pos[] = [];
    for (const q of frontier) for (const dir of DIR_NAMES) {
      const n = step(q, dir);
      if (inBoard(n) && !dist.has(key(n))) { dist.set(key(n), d); next.push(n); }
    }
    frontier = next;
  }
  return dist;
}

// A shortest walk from a to b (excluding a), for animating pawns; straight L-shapes when nothing is in the way.
export function walkPath(a: Pos, b: Pos): Pos[] {
  const prev = new Map<string, Pos | null>([[key(a), null]]);
  const queue = [a];
  while (queue.length) {
    const q = queue.shift()!;
    if (samePos(q, b)) break;
    for (const dir of DIR_NAMES) {
      const n = step(q, dir);
      if ((inBoard(n) || samePos(n, b)) && !prev.has(key(n))) { prev.set(key(n), q); queue.push(n); }
    }
  }
  if (!prev.has(key(b))) return [b];
  const out: Pos[] = [];
  for (let q: Pos | null = b; q && !samePos(q, a); q = prev.get(key(q)) ?? null) out.unshift(q);
  return out;
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

// Every square within n steps' walk (around the sea), not counting p itself.
export function squaresWithin(p: Pos, n: number): Pos[] {
  const out: Pos[] = [];
  for (const k of walkDistances(p, n).keys()) {
    const [x, y] = k.split(',').map(Number);
    if (x !== p.x || y !== p.y) out.push({ x, y });
  }
  return out;
}

export const label = (p: Pos) => `(${p.x + 1}, ${p.y + 1})`;
