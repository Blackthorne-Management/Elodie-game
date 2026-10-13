import { describe, expect, it } from 'vitest';
import { evaluate, flagsIn, type Condition } from '../src/engine/conditions.ts';
import { FlagStore } from '../src/engine/flags.ts';

const flags = new FlagStore({ met: true, answer: 'yes', count: 3, off: false });

describe('dialogue conditions', () => {
  it('no condition is always true', () => {
    expect(evaluate(undefined, flags)).toBe(true);
  });

  it('flag and notFlag', () => {
    expect(evaluate({ flag: 'met' }, flags)).toBe(true);
    expect(evaluate({ flag: 'off' }, flags)).toBe(false);
    expect(evaluate({ flag: 'missing' }, flags)).toBe(false);
    expect(evaluate({ notFlag: 'missing' }, flags)).toBe(true);
    expect(evaluate({ notFlag: 'met' }, flags)).toBe(false);
  });

  it('eq, gte and lte', () => {
    expect(evaluate({ flag: 'answer', eq: 'yes' }, flags)).toBe(true);
    expect(evaluate({ flag: 'answer', eq: 'no' }, flags)).toBe(false);
    expect(evaluate({ flag: 'count', gte: 3 }, flags)).toBe(true);
    expect(evaluate({ flag: 'count', gte: 4 }, flags)).toBe(false);
    expect(evaluate({ flag: 'count', lte: 3 }, flags)).toBe(true);
    expect(evaluate({ flag: 'missing', lte: 0 }, flags)).toBe(true);
  });

  it('all, any and not', () => {
    const c: Condition = { all: [{ flag: 'met' }, { any: [{ flag: 'missing' }, { flag: 'count', gte: 2 }] }] };
    expect(evaluate(c, flags)).toBe(true);
    expect(evaluate({ not: c }, flags)).toBe(false);
    expect(evaluate({ any: [] }, flags)).toBe(false);
    expect(evaluate({ all: [] }, flags)).toBe(true);
  });

  it('lists the flags a condition reads', () => {
    expect(flagsIn({ all: [{ flag: 'a' }, { not: { notFlag: 'b' } }, { flag: 'c', gte: 1 }] })).toEqual(['a', 'b', 'c']);
  });
});
