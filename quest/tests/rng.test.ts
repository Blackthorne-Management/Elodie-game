import { describe, expect, it } from 'vitest';
import { Rng } from '../src/engine/rng.ts';

describe('Rng', () => {
  it('replays the same sequence for the same seed', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    expect(Array.from({ length: 5 }, () => a.next())).toEqual(Array.from({ length: 5 }, () => b.next()));
  });

  it('differs between seeds and stays in [0, 1)', () => {
    const a = new Rng(1);
    const b = new Rng(2);
    expect(a.next()).not.toBe(b.next());
    const r = new Rng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('int is inclusive and pick covers the list', () => {
    const r = new Rng(3);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) seen.add(r.int(1, 3));
    expect([...seen].sort()).toEqual([1, 2, 3]);
    expect(['x']).toContain(r.pick(['x']));
    expect(() => r.pick([])).toThrow();
    expect(() => r.int(2, 1)).toThrow();
  });

  it('can resume from its state', () => {
    const a = new Rng(99);
    a.next();
    const b = new Rng(a.seed);
    expect(b.next()).toBe(a.next());
  });
});
