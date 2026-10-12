import { describe, expect, it } from 'vitest';
import { dealHouses, houseChoiceAgreed, pickOrder } from '../src/engine/houseChoice';
import { makeRng } from '../src/engine/rng';
import type { HouseId } from '../src/engine/types';

const ALL: HouseId[] = ['brasador', 'dorini', 'ironvow', 'suzumori', 'vaitama', 'kaysoley', 'agnivansh', 'stillwater'];

describe('choosing houses (rules-decisions 74)', () => {
  it('picking needs every player to agree', () => {
    expect(houseChoiceAgreed([true, true, true, true, true, true, true, true])).toBe(true);
    expect(houseChoiceAgreed([true, true, true, true, true, true, true, false])).toBe(false);
    expect(houseChoiceAgreed([])).toBe(false);
  });
  it('pick order: the highest roll picks first, then clockwise', () => {
    for (let s = 1; s < 50; s++) {
      const { order } = pickOrder(6, makeRng(s));
      expect([...order].sort()).toEqual([0, 1, 2, 3, 4, 5]);
      for (let i = 1; i < 6; i++) expect(order[i]).toBe((order[0] + i) % 6);
    }
  });
  it('picked houses are kept; the rest are drawn blind from what is left', () => {
    const got = dealHouses(ALL, 4, ['dorini', null, null, null], makeRng(3));
    expect(got[0]).toBe('dorini');
    expect(new Set(got).size).toBe(4);
  });
});
