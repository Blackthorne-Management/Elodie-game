import { describe, expect, it, vi } from 'vitest';
import { FlagStore } from '../src/engine/flags.ts';

describe('FlagStore', () => {
  it('sets, gets and clears values of each type', () => {
    const f = new FlagStore();
    f.set('a', true);
    f.set('n', 3);
    f.set('s', 'yes');
    expect(f.get('a')).toBe(true);
    expect(f.get('n')).toBe(3);
    expect(f.get('s')).toBe('yes');
    expect(f.has('missing')).toBe(false);
    f.clear('a');
    expect(f.has('a')).toBe(false);
  });

  it('treats false, 0 and empty string as unset', () => {
    const f = new FlagStore({ a: false, b: 0, c: '', d: 1, e: 'x', g: true });
    expect(['a', 'b', 'c', 'missing'].map((n) => f.isSet(n))).toEqual([false, false, false, false]);
    expect(['d', 'e', 'g'].map((n) => f.isSet(n))).toEqual([true, true, true]);
  });

  it('adds to numeric flags', () => {
    const f = new FlagStore();
    expect(f.add('count', 2)).toBe(2);
    expect(f.add('count', 3)).toBe(5);
    expect(f.getNumber('count')).toBe(5);
    expect(f.getNumber('missing')).toBe(0);
  });

  it('rejects bad names and non-finite numbers', () => {
    const f = new FlagStore();
    expect(() => f.set('', true)).toThrow();
    expect(() => f.set('x', Number.NaN)).toThrow();
  });

  it('snapshots in sorted order and loads a snapshot (replacing everything)', () => {
    const f = new FlagStore({ z: 1, a: true });
    expect(Object.keys(f.snapshot())).toEqual(['a', 'z']);
    f.load({ b: 'two' });
    expect(f.snapshot()).toEqual({ b: 'two' });
  });

  it('notifies subscribers of changes only', () => {
    const f = new FlagStore();
    const seen = vi.fn();
    const off = f.subscribe(seen);
    f.set('a', true);
    f.set('a', true); // unchanged: no event
    f.apply({ b: 2 });
    f.clear('a');
    off();
    f.set('c', 1);
    expect(seen.mock.calls).toEqual([
      ['a', true],
      ['b', 2],
      ['a', undefined],
    ]);
  });
});
