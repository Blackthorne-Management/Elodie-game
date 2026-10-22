// A grid of pivoting screens (Chapter 7, the file house: PUZZLES.md SIG-KUR part 2, with the second review's 3.1 fix).
// Each screen faces north, east, south or west; pushing one turns it and its four neighbours a quarter clockwise.
// The lanes open when every screen faces north. One screen may be loose: until its anchor flag is set it slips back
// to its resting angle after every push (so the grid can never be solved without the peg); pegged, it holds north and
// no longer turns or can be pushed. A dialogue asks for a push with the flag `rotor.push` = "<rotor id>:<index>";
// engine/game.ts applies it when the conversation ends. State lives in flags only, so saves need nothing new:
// `rotor.<id>.<i>` (0 to 3) for each screen, `rotor.<id>.<i>.<n|e|s|w>` for the one look that shows, `rotor.<id>.moved`
// once the first push is made (before it, the start state's looks show). Pure TypeScript, tested in tests/rotor.test.ts.

import type { FlagReader, FlagStore } from './flags.ts';

/** The flag a dialogue sets to push a screen: "<rotor id>:<index>". */
export const ROTOR_PUSH_FLAG = 'rotor.push';
export const ROTOR_DIRS = ['n', 'e', 's', 'w'] as const;

export interface RotorDef {
  id: string;
  width: number;
  height: number;
  /** Each screen's facing before the first push (0 north, 1 east, 2 south, 3 west), row by row. */
  start: readonly number[];
  /**
   * The loose screen: while `flag` is unset it rests at `rest` after every push (it turns with a push, then slips
   * back); once set (the anchor), it holds north and is fixed.
   */
  peg?: { index: number; flag: string; rest: number };
  /** Set (and kept) when every screen faces north. */
  solved: string;
}

export function rotorFlag(id: string, index: number): string {
  return `rotor.${id}.${index}`;
}

export function rotorLookFlag(id: string, index: number, dir: number): string {
  return `rotor.${id}.${index}.${ROTOR_DIRS[((dir % 4) + 4) % 4]}`;
}

export function rotorMovedFlag(id: string): string {
  return `rotor.${id}.moved`;
}

function pegged(def: RotorDef, flags: FlagReader): boolean {
  const v = def.peg ? flags.get(def.peg.flag) : undefined;
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

/** Every screen's facing now (the start state before the first push; the loose screen at rest, or north once pegged). */
export function rotorState(def: RotorDef, flags: FlagReader): number[] {
  const moved = flags.get(rotorMovedFlag(def.id));
  const state = def.start.map((s, i) => {
    const v = flags.get(rotorFlag(def.id, i));
    return moved && typeof v === 'number' ? v : s;
  });
  if (def.peg) state[def.peg.index] = pegged(def, flags) ? 0 : def.peg.rest;
  return state;
}

/** The screens a push of `index` turns: itself and its orthogonal neighbours. */
export function rotorNeighbours(def: RotorDef, index: number): number[] {
  const x = index % def.width;
  const y = Math.floor(index / def.width);
  const out = [index];
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < def.width && ny < def.height) out.push(ny * def.width + nx);
  }
  return out;
}

/** A push on its own, on a state (no flags): the screens it turns, the pegged one held, the loose one slipping back. */
export function applyPush(def: RotorDef, state: readonly number[], index: number, isPegged: boolean): number[] {
  const next = [...state];
  for (const i of rotorNeighbours(def, index)) {
    if (def.peg && i === def.peg.index && isPegged) continue;
    next[i] = (next[i]! + 1) % 4;
  }
  if (def.peg) next[def.peg.index] = isPegged ? 0 : def.peg.rest;
  return next;
}

export type PushResult = { ok: true; solved: boolean } | { ok: false; reason: 'pegged' | 'solved' | 'bounds' };

/** Push one screen: turn it and its neighbours, write the flags, and mark the grid solved when all face north. */
export function pushRotor(def: RotorDef, flags: FlagStore, index: number): PushResult {
  if (!Number.isInteger(index) || index < 0 || index >= def.width * def.height) return { ok: false, reason: 'bounds' };
  if (flags.isSet(def.solved)) return { ok: false, reason: 'solved' };
  const isPegged = pegged(def, flags);
  if (def.peg && index === def.peg.index && isPegged) return { ok: false, reason: 'pegged' };
  const next = applyPush(def, rotorState(def, flags), index, isPegged);
  writeRotor(def, flags, next);
  const solved = next.every((d) => d === 0);
  if (solved) flags.set(def.solved, true);
  return { ok: true, solved };
}

/** The state as flags: each screen's facing and its one look. */
export function writeRotor(def: RotorDef, flags: FlagStore, state: readonly number[]): void {
  flags.set(rotorMovedFlag(def.id), true);
  state.forEach((d, i) => {
    flags.set(rotorFlag(def.id, i), d);
    for (let k = 0; k < 4; k++) flags.set(rotorLookFlag(def.id, i, k), k === d);
  });
}

/** The look condition text for one screen facing one way (map objects), the start state's look before any push. */
export function rotorLookCondition(def: RotorDef, index: number, dir: number): string {
  const look = rotorLookFlag(def.id, index, dir);
  return def.start[index] === dir ? `${look}|!${rotorMovedFlag(def.id)}` : look;
}
