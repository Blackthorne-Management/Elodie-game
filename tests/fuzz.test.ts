import { inBoard } from '../src/engine/board';
import { describe, it, expect } from 'vitest';
import { randomGame } from './helpers';
import { HAND_SIZE } from '../src/config';
import type { Runner } from '../src/engine/runner';

function invariants(r: Runner) {
  const s = r.state;
  const inHands = s.players.flatMap(p => p.hand);
  const marked = s.effects.map(e => e.cardId).filter((c): c is number => c !== undefined);
  const all = [...s.drawPile, ...s.discard, ...s.removed, ...s.inPlay, ...inHands, ...marked];
  expect(all.length).toBe(120);
  expect(new Set(all).size).toBe(120);
  for (const p of s.players) {
    if (r.pending?.kind !== 'discard') expect(p.hand.length).toBeLessThanOrEqual(HAND_SIZE);
    for (const v of Object.values(p.res)) expect(v).toBeGreaterThanOrEqual(0);
    expect(p.hp).toBeLessThanOrEqual(p.maxHp);
    if (p.pos) expect(inBoard(p.pos)).toBe(true);           // never in the sea or off the board
    if (!p.specter && !s.dying.some(d => d.victim === p.id)) expect(p.hp).toBeGreaterThan(0);
  }
}

describe('random games run to the end with the rules intact', () => {
  for (const n of [2, 3, 4, 6, 8]) {
    it(`${n} players, many seeds`, () => {
      for (let seed = 1; seed <= 25; seed++) {
        const r = randomGame(n, seed * 31 + n, invariants);
        expect(r.state.winner).not.toBeNull();
      }
    }, 120_000);
  }
});
