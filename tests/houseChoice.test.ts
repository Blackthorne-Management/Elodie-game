import { describe, expect, it } from 'vitest';
import { dealHouses, houseChoiceAgreed, houseRing, neighbours, pickOrder } from '../src/engine/houseChoice';
import { CONTENT } from '../src/data';
import type { Pos } from '../src/engine/types';
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

describe('two players: Race or Battle (rules-decisions 82)', () => {
  const ring = houseRing(Object.fromEntries(ALL.map(h => [h, CONTENT.houses[h].home])) as Record<HouseId, Pos>);
  it('the ring runs clockwise round the board', () => {
    const i = ring.indexOf('brasador');
    expect([...ring.slice(i), ...ring.slice(0, i)])
      .toEqual(['brasador', 'kaysoley', 'dorini', 'ironvow', 'suzumori', 'agnivansh', 'stillwater', 'vaitama']);
    expect(neighbours(ring, 'brasador')).toEqual(['vaitama', 'kaysoley']);
  });
  it('Battle deals neighbouring houses, by lottery or around a pick', () => {
    for (let s = 1; s < 200; s++) {
      const [a, b] = dealHouses(ALL, 2, [null, null], makeRng(s), ring);
      expect(neighbours(ring, a)).toContain(b);
      const [, c] = dealHouses(ALL, 2, ['suzumori', null], makeRng(s), ring);
      expect(['ironvow', 'agnivansh']).toContain(c);
      const [d] = dealHouses(ALL, 2, [null, 'dorini'], makeRng(s), ring);
      expect(['kaysoley', 'ironvow']).toContain(d);
    }
  });
  it('Battle: the second house always comes from the die, never a pick (rules-decisions 87)', () => {
    const seen = new Set<string>();
    for (let s = 1; s < 200; s++) {
      // A pick for the second seat is ignored: the die decides between the two neighbours.
      const [first, second] = dealHouses(ALL, 2, ['brasador', 'kaysoley'], makeRng(s), ring);
      expect(first).toBe('brasador');
      expect(['vaitama', 'kaysoley']).toContain(second);
      seen.add(second);
    }
    expect(seen.size).toBe(2);                            // both neighbours come up
  });
  it('Race deals as usual: any two houses', () => {
    const pairs = new Set<string>();
    for (let s = 1; s < 200; s++) pairs.add(dealHouses(ALL, 2, [null, null], makeRng(s)).sort().join());
    expect(pairs.size).toBeGreaterThan(20);
  });
});
