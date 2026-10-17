import { describe, expect, it } from 'vitest';
import { REALM_MAP } from '../src/data/realmMap.ts';
import { VOYAGES } from '../src/data/voyages.ts';
import { along, seaRoute, thinRoute } from '../src/engine/voyage.ts';

const sea = (x: number, y: number) => REALM_MAP.key[REALM_MAP.rows[y]![x]!] === 'sea';
const near = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

describe('voyages (owner request, Oct 17: sail, do not teleport)', () => {
  it('Pòdlimyè to Yucayeque: all at sea, from off Zetwal round the north of Ardencia to Xaraguá', () => {
    const route = seaRoute(REALM_MAP, VOYAGES.zetwal_xaragua!);
    expect(route.every((p) => sea(p.x, p.y))).toBe(true);
    for (let i = 1; i < route.length; i++) expect(Math.max(Math.abs(route[i]!.x - route[i - 1]!.x), Math.abs(route[i]!.y - route[i - 1]!.y))).toBe(1);
    expect(near(route[0]!, REALM_MAP.capitals.zetwal!)).toBeLessThan(32);
    expect(near(route[route.length - 1]!, REALM_MAP.capitals.xaragua!)).toBeLessThan(14);
    // Around Ardencia: the ship goes north of its northern coast (row 16 on the board).
    expect(Math.min(...route.map((p) => p.y))).toBeLessThan(14);
  });

  it('the thinned line keeps both ends, and `along` walks it from start to end', () => {
    const route = seaRoute(REALM_MAP, VOYAGES.zetwal_xaragua!);
    const line = thinRoute(route);
    expect(line[0]).toEqual(route[0]);
    expect(line[line.length - 1]).toEqual(route[route.length - 1]);
    expect(along(line, 0)).toEqual(line[0]);
    expect(along(line, 1)).toEqual(line[line.length - 1]);
  });
});
