import { describe, it, expect } from 'vitest';
import { CARDS, HOUSES } from '../src/data';
import { manhattan } from '../src/engine/board';

describe('the shared deck', () => {
  it('has 126 cards numbered 1-126', () => {
    expect(CARDS).toHaveLength(126);
    CARDS.forEach((c, i) => expect(c.id).toBe(i + 1));
  });
  it('has 71 Hand Cards (6 of them Reactions) and 55 Instants', () => {
    expect(CARDS.filter(c => c.kind === 'hand')).toHaveLength(71);
    expect(CARDS.filter(c => c.category === 'Reaction').map(c => c.id)).toEqual([121, 122, 123, 124, 125, 126]);
    expect(CARDS.filter(c => c.reaction).every(c => c.responseOnly && c.timing)).toBe(true);
    expect(CARDS.filter(c => c.kind === 'instant')).toHaveLength(55);
  });
  it('has 8 Block/Deflect cards and 5 ranged attacks', () => {
    expect(CARDS.filter(c => c.category === 'Block / Deflect')).toHaveLength(8);
    expect(CARDS.filter(c => c.category === 'Ranged / Cursed')).toHaveLength(5);
  });
  it('flags exactly the 10 Elodie cards', () => {
    expect(CARDS.filter(c => c.elodie).map(c => c.id)).toEqual([81, 83, 84, 89, 90, 94, 95, 96, 98, 102]);
  });
  it('bars the 10 HP-loss Instants from Specters', () => {
    expect(CARDS.filter(c => c.noSpecter).map(c => c.id)).toEqual([67, 71, 76, 80, 81, 89, 94, 98, 102, 115]);
  });
  it('uses the approved Elodie\'s Gaze text', () => {
    expect(CARDS[89].text).toBe('Every player reveals their hand to the table.');
  });
});

describe('the houses', () => {
  const houses = Object.values(HOUSES);
  it('has 8 houses with 3 Court, 3 War, 2 Trade tiles', () => {
    expect(houses).toHaveLength(8);
    const count = (t: string) => houses.filter(h => h.tileType === t).length;
    expect([count('court'), count('war'), count('trade')]).toEqual([3, 3, 2]);
  });
  it('places no two same-type tiles next to each other', () => {
    for (const a of houses) for (const b of houses) {
      if (a !== b && a.tileType === b.tileType) expect(manhattan(a.home, b.home)).toBeGreaterThan(1);
    }
  });
  it('uses the evened-out HP (rules-decisions): 3 everywhere except Agnivansh IV 2', () => {
    for (const h of Object.values(HOUSES)) {
      const want = h.id === 'agnivansh' ? [3, 3, 3, 2] : [3, 3, 3, 3];
      expect(h.hp).toEqual(want);
    }
  });
});
