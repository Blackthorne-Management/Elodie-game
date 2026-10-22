// The rotating screens (engine/rotor.ts; Chapter 7's file house, PUZZLES.md SIG-KUR part 2 with the second review's
// 3.1 fix): a push turns a screen and its neighbours a quarter; the loose screen slips back to rest until it is
// pegged, so the grid can never be solved without the anchor; pegged, it holds north and four pushes solve it; no
// push can strand the player (every pegged state is reachable).

import { describe, expect, it } from 'vitest';
import { FlagStore } from '../src/engine/flags.ts';
import { applyPush, pushRotor, rotorLookCondition, rotorNeighbours, rotorState, type RotorDef } from '../src/engine/rotor.ts';
import { parseConditionText, evaluate } from '../src/engine/conditions.ts';

/** The same shape as the file house's grid (data/kuroshi.ts SCREENS): north, east, east, south solves it, pegged. */
const GRID: RotorDef = { id: 'test', width: 3, height: 3, start: [3, 3, 1, 0, 1, 2, 3, 3, 1], peg: { index: 4, flag: 'anchor.peg', rest: 1 }, solved: 'test.solved' };
const N = 1;
const E = 5;
const S = 7;

describe('the rotor grid', () => {
  it('a push turns the screen and its orthogonal neighbours a quarter clockwise', () => {
    expect(rotorNeighbours(GRID, 0).sort()).toEqual([0, 1, 3]);
    expect(rotorNeighbours(GRID, 4).sort()).toEqual([1, 3, 4, 5, 7]);
    const flags = new FlagStore();
    pushRotor(GRID, flags, 0);
    expect(rotorState(GRID, flags).slice(0, 4)).toEqual([0, 0, 1, 1]);
  });

  it('pegged, north, east, east, south solves it, and the solved flag is set and kept', () => {
    const flags = new FlagStore({ 'anchor.peg': true });
    for (const i of [N, E, E]) expect(pushRotor(GRID, flags, i)).toEqual({ ok: true, solved: false });
    expect(pushRotor(GRID, flags, S)).toEqual({ ok: true, solved: true });
    expect(flags.isSet('test.solved')).toBe(true);
    expect(rotorState(GRID, flags).every((d) => d === 0)).toBe(true);
    // Once open, the lanes stay open: no more pushes.
    expect(pushRotor(GRID, flags, 0)).toEqual({ ok: false, reason: 'solved' });
  });

  it('without the peg the same four pushes leave the lanes shut: the loose screen slips back east every time', () => {
    const flags = new FlagStore();
    for (const i of [N, E, E, S]) expect(pushRotor(GRID, flags, i).ok).toBe(true);
    expect(flags.isSet('test.solved')).toBe(false);
    expect(rotorState(GRID, flags)[4]).toBe(1);
  });

  it('without the peg no sequence of pushes can solve it: the loose screen is never north after a push', () => {
    // Every state the unpegged grid can reach (a breadth-first search over the pushes) has the centre at rest.
    const seen = new Set<string>();
    let frontier = [GRID.start.map((d, i) => (i === 4 ? 1 : d))];
    seen.add(frontier[0]!.join(''));
    for (let depth = 0; depth < 6 && frontier.length; depth++) {
      const next: number[][] = [];
      for (const st of frontier) {
        for (let i = 0; i < 9; i++) {
          const after = applyPush(GRID, st, i, false);
          expect(after[4]).toBe(1);
          const k = after.join('');
          if (!seen.has(k)) {
            seen.add(k);
            next.push(after);
          }
        }
      }
      frontier = next;
    }
    expect(seen.size).toBeGreaterThan(1000);
  });

  it('the pegged screen cannot be pushed, and the eight others reach every state (no push strands the player)', () => {
    const flags = new FlagStore({ 'anchor.peg': true });
    expect(pushRotor(GRID, flags, 4)).toEqual({ ok: false, reason: 'pegged' });
    // Each outer push, as a vector over the eight outer screens, mod 4: the matrix is invertible mod 4 (odd determinant).
    const outer = [0, 1, 2, 3, 5, 6, 7, 8];
    const m = outer.map((p) => outer.map((i) => (rotorNeighbours(GRID, p).includes(i) ? 1 : 0)));
    expect(Math.abs(det(m)) % 2).toBe(1);
  });

  it('each screen shows exactly one look, the start state before the first push', () => {
    for (const flags of [new FlagStore(), (() => { const f = new FlagStore(); pushRotor(GRID, f, 2); return f; })()]) {
      const state = rotorState(GRID, flags);
      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;
        const shown = [0, 1, 2, 3].filter((d) => {
          const c = parseConditionText(rotorLookCondition(GRID, i, d));
          return c.ok && evaluate(c.cond, flags);
        });
        expect(shown, `screen ${i}`).toEqual([state[i]]);
      }
    }
  });
});

/** Integer determinant (Bareiss), exact for small matrices. */
function det(a: number[][]): number {
  const m = a.map((r) => [...r]);
  const n = m.length;
  let sign = 1;
  let prev = 1;
  for (let k = 0; k < n - 1; k++) {
    if (m[k]![k] === 0) {
      const swap = m.findIndex((r, i) => i > k && r[k] !== 0);
      if (swap < 0) return 0;
      [m[k], m[swap]] = [m[swap]!, m[k]!];
      sign = -sign;
    }
    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++) m[i]![j] = (m[i]![j]! * m[k]![k]! - m[i]![k]! * m[k]![j]!) / prev;
    }
    prev = m[k]![k]!;
  }
  return sign * m[n - 1]![n - 1]!;
}
