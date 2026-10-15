// Named weapons, "X of Y" (owner decision, Oct 15; data/weapons.ts): three designs per rarity for staffs
// and bows, three suffixes per rarity, every design paired with each suffix of its rarity, and the
// suffix (not the design) deciding what a copy does.

import { describe, expect, it } from 'vitest';
import { GEAR_SKILLS } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { DESIGNS, SUFFIXES, WEAPONS, weaponId } from '../src/data/weapons.ts';

const RARITIES = ['common', 'uncommon', 'rare', 'epic'] as const;

describe('named weapons', () => {
  it('staffs and bows have three designs and three suffixes at every rarity', () => {
    for (const weapon of ['staff', 'bow'] as const) {
      for (const r of RARITIES) {
        expect(DESIGNS.filter((d) => d.weapon === weapon && d.rarity === r).length, `${weapon} ${r} designs`).toBe(3);
        expect(SUFFIXES.filter((s) => s.weapon === weapon && s.rarity === r).length, `${weapon} ${r} suffixes`).toBe(3);
      }
    }
  });

  it('every design comes in each suffix of its rarity, named "X of Y", and all are in the game', () => {
    for (const d of DESIGNS) {
      const mine = WEAPONS.filter((w) => w.art === d.id);
      expect(mine.length, d.id).toBe(SUFFIXES.filter((s) => s.weapon === d.weapon && s.rarity === d.rarity).length);
      for (const w of mine) {
        expect(w.name.startsWith(`${d.name} of `), w.id).toBe(true);
        expect(RPG.items[w.id], w.id).toBe(w);
      }
    }
    expect(new Set(WEAPONS.map((w) => w.id)).size).toBe(WEAPONS.length);
  });

  it('the same design in two versions looks alike but does different things', () => {
    const a = RPG.items[weaponId('sunwood_staff', 'clarity')]!;
    const b = RPG.items[weaponId('sunwood_staff', 'swiftness')]!;
    expect(a.art).toBe(b.art);
    expect(a.stats).not.toEqual(b.stats);
    expect(a.name).toBe('Sunwood Staff of Clarity');
    expect(b.name).toBe('Sunwood Staff of Swiftness');
  });

  it('rare suffixes bring a skill, epic ones a skill and a special; every skill exists', () => {
    for (const s of SUFFIXES) {
      if (s.rarity === 'rare' || s.rarity === 'epic') expect(s.skill, s.id).toBeDefined();
      if (s.rarity === 'epic') expect(s.special, s.id).toBeDefined();
      if (s.skill) expect(GEAR_SKILLS[s.skill], `${s.id}: ${s.skill}`).toBeDefined();
    }
  });

  it('the weapons from before names keep their ids (saves and shops use them)', () => {
    expect(RPG.items.archivist_staff!.name).toBe("Archivist's Staff of the Scribe");
    expect(RPG.items.lantern_staff!.skill).toBe('lantern_flare');
    expect(RPG.items.thorn_staff!.edge).toBe('spike');
    expect(RPG.items.goldband_bow!.name).toBe('Gold-Banded Bow of the Sun');
    expect(weaponId('driftwood_staff', 'focus')).toBe('driftwood_staff_of_focus');
  });
});
