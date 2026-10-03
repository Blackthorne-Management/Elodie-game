import { describe, it, expect } from 'vitest';
import { makeRng, rollD6, shuffle } from '../src/engine/rng';

describe('rng', () => {
  it('replays exactly from the same seed', () => {
    const a = makeRng(5), b = makeRng(5);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
  it('d6 rolls are 1-6 and roughly even', () => {
    const rng = makeRng(1);
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 60_000; i++) counts[rollD6(rng) - 1]++;
    for (const c of counts) expect(c).toBeGreaterThan(9_500);
  });
  it('shuffle keeps every item and leaves the input alone', () => {
    const input = Array.from({ length: 120 }, (_, i) => i);
    const out = shuffle(input, makeRng(3));
    expect([...out].sort((x, y) => x - y)).toEqual(input);
    expect(out).not.toEqual(input);
  });
});
