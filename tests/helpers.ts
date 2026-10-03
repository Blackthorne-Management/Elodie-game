import { CONTENT } from '../src/data';
import { Game } from '../src/engine/game';
import { Runner } from '../src/engine/runner';
import type { Decision, Flow, GameSetup, HouseId } from '../src/engine/types';
import { makeRng } from '../src/engine/rng';

export function setup(n: number, seed = 1, houses?: HouseId[]): GameSetup {
  return {
    seed,
    firstPlayer: 0,
    seats: Array.from({ length: n }, (_, i) => ({ name: `P${i}`, isBot: true, house: houses?.[i] })),
  };
}

export const newGame = (n: number, houses?: HouseId[], seed = 1) => new Game(setup(n, seed, houses), CONTENT);

// Run a flow to completion, answering each decision with `pick` (default: first option).
export function drive<T>(flow: Flow<T>, pick: (d: Decision) => number = () => 0): T {
  let r = flow.next();
  let guard = 0;
  while (!r.done) {
    if (guard++ > 5000) throw new Error('drive: too many decisions');
    r = flow.next(pick(r.value));
  }
  return r.value;
}

// Answer by option label (first match), falling back to the first option.
export const byLabel = (...labels: string[]) => (d: Decision) => {
  for (const l of labels) {
    const i = d.options.findIndex(o => o.label === l || o.label.startsWith(l));
    if (i >= 0) return i;
  }
  return 0;
};

export function randomGame(n: number, seed: number, onStep?: (r: Runner) => void) {
  const r = new Runner(setup(n, seed), CONTENT);
  const rng = makeRng(seed * 7919);
  let steps = 0;
  while (!r.over) {
    const d = r.pending!;
    // Random choices, but end the turn a third of the time so games keep moving.
    let i = Math.floor(rng() * d.options.length);
    if (d.kind === 'turn') {
      const end = d.options.findIndex(o => (o.value as { type: string }).type === 'end');
      if (end >= 0 && rng() < 0.35) i = end;
    }
    r.answer(i);
    onStep?.(r);
    if (++steps > 200_000) throw new Error('game did not finish');
  }
  return r;
}
