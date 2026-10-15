// The menu's maps: the city drawn from its real maps (engine/cityMap.ts), and the realm traced from the
// board game's map (data/realmMap.ts, made by tools/realm-map.py).

import { describe, expect, it } from 'vitest';
import { REALM_MAP } from '../src/data/realmMap.ts';
import { RPG } from '../src/data/rpg.ts';
import { cityLayout, cityPosition, overlaps } from '../src/engine/cityMap.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();

describe('city map', () => {
  for (const city of Object.values(RPG.cities)) {
    it(`${city.name}: outdoor sections do not overlap, every building has a door outside, every outdoor door pair is joined`, () => {
      const layout = cityLayout(city, maps);
      for (const a of layout.sections) for (const b of layout.sections) if (a !== b) expect(overlaps(a, b), `${a.name} / ${b.name}`).toBe(false);
      expect(layout.sections.length + layout.buildings.length).toBe(city.sections.length);
      for (const b of layout.buildings) {
        const inside = layout.sections.some((s) => b.pos.x >= s.x && b.pos.x < s.x + s.w && b.pos.y >= s.y && b.pos.y < s.y + s.h);
        expect(inside, b.name).toBe(true);
      }
      // Doors between outdoor sections are joined, and close together (a short path or bridge).
      const outdoor = new Set(layout.sections.map((s) => s.map));
      const pairs = layout.sections.flatMap((s) => maps[s.map]!.doors.filter((d) => outdoor.has(d.targetMap)).map(() => 1)).length;
      expect(layout.connectors.length * 2).toBe(pairs);
      for (const c of layout.connectors) expect(Math.hypot(c.to.x - c.from.x, c.to.y - c.from.y)).toBeLessThan(16);
      // It fits the menu's map area at one and a half pixels per tile or more.
      expect(layout.width * 1.5).toBeLessThanOrEqual(200);
      expect(layout.height * 1.5).toBeLessThanOrEqual(114);
    });
  }

  it('places the player on their tile outdoors and on the building indoors', () => {
    const layout = cityLayout(RPG.cities.zetwal!, maps);
    const town = layout.sections.find((s) => s.map === 'zetwal-town')!;
    expect(cityPosition(layout, 'zetwal-town', { x: 3, y: 4 })).toEqual({ x: town.x + 3, y: town.y + 4 });
    const house = layout.buildings.find((b) => b.map === 'zetwal-house')!;
    expect(cityPosition(layout, 'zetwal-house', { x: 9, y: 9 })).toEqual(house.pos);
    // The archive is on the Temple Island, not in the town.
    const temple = layout.sections.find((s) => s.map === 'zetwal-temple')!;
    const archive = layout.buildings.find((b) => b.map === 'zetwal-archive')!;
    expect(archive.pos.x - temple.x).toBeGreaterThanOrEqual(0);
    expect(archive.pos.x - temple.x).toBeLessThan(temple.w);
    // The east gate opens straight onto the Cane Road.
    const road = layout.connectors.find((c) => Math.abs(c.from.x - c.to.x) + Math.abs(c.from.y - c.to.y) <= 1);
    expect(road).toBeDefined();
  });
});

describe('realm map', () => {
  const places = new Set(Object.values(REALM_MAP.key));
  const at = (p: { x: number; y: number }) => REALM_MAP.key[REALM_MAP.rows[p.y]![p.x]!];

  it('is a full grid of known cells', () => {
    expect(REALM_MAP.rows).toHaveLength(REALM_MAP.height);
    for (const r of REALM_MAP.rows) {
      expect(r).toHaveLength(REALM_MAP.width);
      for (const ch of r) expect(REALM_MAP.key[ch], ch).toBeDefined();
    }
  });

  it('has every realm place, with its capital and its name inside its own borders', () => {
    for (const p of RPG.realm) {
      expect(places.has(p.id), p.id).toBe(true);
      expect(at(REALM_MAP.capitals[p.id]!), `${p.id} capital`).toBe(p.id);
      expect(at(REALM_MAP.labels[p.id]!), `${p.id} label`).toBe(p.id);
      expect(REALM_MAP.colours[p.id], p.id).toBeDefined();
    }
  });

  it('is laid out as on the board: Ardencia north, Kuroshi south, Aldermoor west, Al-Doria east, the Seat between', () => {
    const c = REALM_MAP.capitals;
    expect(c.ardencia!.y).toBeLessThan(c.seat!.y);
    expect(c.kuroshi!.y).toBeGreaterThan(c.seat!.y);
    expect(c.aldermoor!.x).toBeLessThan(c.seat!.x);
    expect(c.al_doria!.x).toBeGreaterThan(c.seat!.x);
    expect(c.zetwal!.x).toBeGreaterThan(c.seat!.x);
    expect(c.zetwal!.y).toBeLessThan(c.seat!.y);
    expect(c.xaragua!.x).toBeLessThan(c.seat!.x);
    expect(c.xaragua!.y).toBeLessThan(c.seat!.y);
  });

  it('has neighbours: every country borders at least two others', () => {
    const borders = new Map<string, Set<string>>();
    for (let y = 0; y < REALM_MAP.height - 1; y++) {
      for (let x = 0; x < REALM_MAP.width - 1; x++) {
        const a = at({ x, y })!;
        for (const b of [at({ x: x + 1, y })!, at({ x, y: y + 1 })!]) {
          if (a === b || a === 'sea' || b === 'sea') continue;
          borders.set(a, (borders.get(a) ?? new Set()).add(b));
          borders.set(b, (borders.get(b) ?? new Set()).add(a));
        }
      }
    }
    for (const p of RPG.realm) expect(borders.get(p.id)?.size ?? 0, p.id).toBeGreaterThanOrEqual(2);
  });
});
