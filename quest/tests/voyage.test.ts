import { describe, expect, it } from 'vitest';
import { REALM_MAP } from '../src/data/realmMap.ts';
import { VOYAGES } from '../src/data/voyages.ts';
import { OBJECT_ART } from '../src/assets.pixels.ts';
import { along, boatCrew, seaRoute, thinRoute } from '../src/engine/voyage.ts';

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

  it('each voyage sails a drawn ship, with a drawn fleet (review Nov 1: the same merchantman every chapter)', () => {
    for (const v of Object.values(VOYAGES)) {
      for (const kind of [v.ship ?? 'zetwal_ship', ...(v.fleet ?? [])]) expect(OBJECT_ART[kind], `${v.id}: ${kind}`).toBeDefined();
    }
    expect(VOYAGES.skarragol_kuroshi!.ship).toBe('voyage_longship');
    expect(VOYAGES.kuroshi_jwaladesh!.ship).toBe('voyage_lantern_trader');
    expect(VOYAGES.zetwal_xaragua_war!.fleet!.length).toBeGreaterThanOrEqual(4);
    // No black sails on the Strike road (its caption: "Nobody's sails are black").
    expect(VOYAGES.xaragua_ardencia_strike!.fleet).not.toContain('voyage_ardencia_ship');
  });

  it('the boat carries whoever walks the map: the companion at the oars, Gianna, Anissa, Azzy', () => {
    expect(boatCrew({ anissa: true, azzy: false, companion: 'yari' })).toEqual(['yari', 'gianna', 'anissa']);
    expect(boatCrew({ anissa: true, azzy: true, companion: 'haru' })).toEqual(['haru', 'gianna', 'anissa', 'azzy']);
    expect(boatCrew({ anissa: false, azzy: false, companion: null })).toEqual(['gianna']);
  });
});
