import { describe, it, expect } from 'vitest';
import { typeMultiplier } from '../src/engine/typeChart';
import { petStats, levelCap } from '../src/engine/stats';
import { calcDamage } from '../src/engine/damage';
import { makeRng } from '../src/engine/rng';
import { makeUnit, testSpecies } from './fixtures';

describe('weather wheel', () => {
  it('sun beats frost', () => expect(typeMultiplier('sun', 'frost')).toBe(1.5));
  it('frost is weak to sun', () => expect(typeMultiplier('frost', 'sun')).toBe(0.67));
  it('eclipse beats aurora', () => expect(typeMultiplier('eclipse', 'aurora')).toBe(1.5));
  it('aurora beats eclipse', () => expect(typeMultiplier('aurora', 'eclipse')).toBe(1.5));
  it('calm is neutral', () => expect(typeMultiplier('calm', 'gale')).toBe(1));
  it('the wheel closes: bloom beats gale', () => expect(typeMultiplier('bloom', 'gale')).toBe(1.5));
  it('same type is neutral', () => expect(typeMultiplier('rain', 'rain')).toBe(1));
});

describe('rng', () => {
  it('is repeatable for the same seed', () => {
    const a = makeRng(123), b = makeRng(123);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
  it('stays in [0, 1)', () => {
    const r = makeRng(9);
    for (let i = 0; i < 10_000; i++) { const x = r(); expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1); }
  });
});

describe('stats', () => {
  const sp = testSpecies('gale');
  it('level 1, stage 1, 1 star is the base', () => {
    expect(petStats(sp, 1, 1, 1)).toEqual(sp.baseStats);
  });
  it('higher level, stage and stars all grow stats', () => {
    const base = petStats(sp, 1, 1, 1);
    expect(petStats(sp, 10, 1, 1).hp).toBeGreaterThan(base.hp);
    expect(petStats(sp, 1, 2, 1).attack).toBeGreaterThan(base.attack);
    expect(petStats(sp, 1, 1, 5).defense).toBeGreaterThan(base.defense);
  });
  it('level cap rises 25 per act', () => {
    expect(levelCap(0)).toBe(30);
    expect(levelCap(2)).toBe(80);
  });
});

describe('damage', () => {
  it('is always at least 1', () => {
    const a = makeUnit('a', 'player', 'calm', { attack: 1 });
    const d = makeUnit('d', 'enemy', 'calm', { defense: 10_000 });
    expect(calcDamage(a, d, 0.1, makeRng(1)).amount).toBe(1);
  });
  it('type advantage hits harder than disadvantage', () => {
    const sun = makeUnit('s', 'player', 'sun');
    const frost = makeUnit('f', 'enemy', 'frost');
    const sunHit = calcDamage({ ...sun, critChance: 0 }, frost, 1, makeRng(5)).amount;
    const frostHit = calcDamage({ ...frost, critChance: 0 }, sun, 1, makeRng(5)).amount;
    expect(sunHit).toBeGreaterThan(frostHit * 2);
  });
  it('stays within the variance band', () => {
    const a = { ...makeUnit('a', 'player', 'calm'), critChance: 0 };
    const d = makeUnit('d', 'enemy', 'calm');
    const rng = makeRng(77);
    const expected = 20 * 1 * (100 / 115);
    for (let i = 0; i < 1000; i++) {
      const { amount } = calcDamage(a, d, 1, rng);
      expect(amount).toBeGreaterThanOrEqual(Math.round(expected * 0.95));
      expect(amount).toBeLessThanOrEqual(Math.round(expected * 1.05));
    }
  });
});
