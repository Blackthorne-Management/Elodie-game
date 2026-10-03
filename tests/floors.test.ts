import { describe, it, expect } from 'vitest';
import { floorInfo, regionStart } from '../src/engine/floors';
import { applyWin, sparksForFloor } from '../src/engine/rewards';
import { canEvolve, levelUp } from '../src/engine/leveling';
import { sparksToLevel } from '../src/engine/stats';
import { newGame } from '../src/state/newGame';
import { buildFloor } from '../src/state/buildFloor';
import { exportCode, importCode } from '../src/state/save';
import { makeRng } from '../src/engine/rng';

describe('floors', () => {
  it('floor 1 is the first normal floor of the gale region', () => {
    expect(floorInfo(1)).toMatchObject({ act: 1, region: 'gale', inRegion: 1, kind: 'normal', endless: false });
  });
  it('every 5th floor is a mini-boss and every 25th a region boss', () => {
    expect(floorInfo(5).kind).toBe('miniBoss');
    expect(floorInfo(20).kind).toBe('miniBoss');
    expect(floorInfo(25).kind).toBe('regionBoss');
    expect(floorInfo(26)).toMatchObject({ region: 'rain', inRegion: 1, kind: 'normal' });
  });
  it('acts are 150 floors and Act 9 is the Endless Storm', () => {
    expect(floorInfo(150)).toMatchObject({ act: 1, region: 'eye', kind: 'regionBoss' });
    expect(floorInfo(151)).toMatchObject({ act: 2, region: 'gale' });
    expect(floorInfo(1201)).toMatchObject({ act: 9, endless: true });
  });
  it('regionStart finds the first floor of the region', () => {
    expect(regionStart(1)).toBe(1);
    expect(regionStart(25)).toBe(1);
    expect(regionStart(26)).toBe(26);
  });
  it('builds the right enemy team per floor kind', () => {
    const s = newGame();
    const rng = makeRng(1);
    const enemies = (f: number) => buildFloor(s, f, rng).units.filter(u => u.side === 'enemy');
    expect(enemies(1)).toHaveLength(4);
    expect(enemies(5)).toHaveLength(3);
    const boss = enemies(25);
    expect(boss).toHaveLength(1);
    expect(boss[0]).toMatchObject({ name: 'Galebeak', actsTwice: true });
    expect(enemies(50)[0].name).toMatch(/^Great /);
    expect(buildFloor(s, 1, rng).units.filter(u => u.side === 'player')).toHaveLength(4);
  });
});

describe('rewards', () => {
  it('a first clear pays full Sparks and raises highestFloor', () => {
    const { save, summary } = applyWin(newGame(), 1);
    expect(save.highestFloor).toBe(1);
    expect(summary).toMatchObject({ firstClear: true, crystals: 0 });
    expect(save.currency.sparks).toBe(newGame().currency.sparks + sparksForFloor(1));
  });
  it('replays pay half', () => {
    const s = { ...newGame(), highestFloor: 10 };
    expect(applyWin(s, 3).summary.sparks).toBe(Math.round(sparksForFloor(3) / 2));
    expect(applyWin(s, 3).save.highestFloor).toBe(10);
  });
  it('bosses give a Storm Crystal only on their first clear', () => {
    const once = applyWin(newGame(), 5).save;
    expect(once.stormCrystals).toBe(1);
    expect(once.firstClears).toEqual([5]);
    expect(applyWin(once, 5).save.stormCrystals).toBe(1);
  });
  it('clearing floor 150 clears an act', () => {
    const s = applyWin({ ...newGame(), highestFloor: 149 }, 150).save;
    expect(s.actsCleared).toBe(1);
  });
});

describe('leveling', () => {
  it('spends Sparks to level up', () => {
    const s0 = newGame();
    const pet = s0.pets[0];
    const cost = sparksToLevel(pet.level + 1);
    const s1 = levelUp({ ...s0, currency: { ...s0.currency, sparks: cost } }, pet.uid);
    expect(s1.pets[0].level).toBe(pet.level + 1);
    expect(s1.currency.sparks).toBe(0);
  });
  it('does nothing without enough Sparks', () => {
    const s0 = { ...newGame(), currency: { eggs: 0, sparks: 10, eventTokens: 0 } };
    expect(levelUp(s0, s0.pets[0].uid)).toBe(s0);
  });
  it('stops at the level cap', () => {
    const s0 = newGame();
    const capped = { ...s0, pets: [{ ...s0.pets[0], level: 30 }], currency: { ...s0.currency, sparks: 1e9 } };
    expect(levelUp(capped, s0.pets[0].uid)).toBe(capped);
  });
  it('evolving to stage 3 needs a Storm Crystal', () => {
    const pet = { ...newGame().pets[0], level: 35, stage: 2 as const };
    expect(canEvolve(pet, 5000, 0)).toBe(false);
    expect(canEvolve(pet, 5000, 1)).toBe(true);
  });
});

describe('save codes', () => {
  it('round-trip a save', () => {
    const s = applyWin(newGame(), 1).save;
    expect(importCode(exportCode(s))).toEqual(s);
  });
  it('reject junk', () => {
    expect(() => importCode('not a code')).toThrow();
    expect(() => importCode(btoa('{"hello":1}'))).toThrow();
  });
});
