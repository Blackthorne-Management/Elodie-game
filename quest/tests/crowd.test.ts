// The festival's passers-by (demo review, Oct 17): engine/crowd.ts and the crowd zones on the maps.

import { describe, expect, it } from 'vitest';
import { NPC_SPRITES } from '../src/assets.config.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { crowdSpots, crowdStep } from '../src/engine/crowd.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { Rng } from '../src/engine/rng.ts';
import type { CrowdZone } from '../src/engine/tiledMap.ts';
import { isOpen } from '../src/engine/world.ts';
import type { Pos } from '../src/engine/types.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
const zone: CrowdZone = { id: 'z', area: { x: 2, y: 2, width: 4, height: 3 }, count: 5, looks: ['villager'] };

describe('the crowd stands and strolls inside its zone, never on anyone', () => {
  it('starts on different open tiles in the zone', () => {
    const blocked = (p: Pos) => p.x === 3 && p.y === 3;
    const spots = crowdSpots(zone, (p) => !blocked(p), new Rng(7));
    expect(spots).toHaveLength(5);
    expect(new Set(spots.map((p) => `${p.x},${p.y}`)).size).toBe(5);
    for (const p of spots) {
      expect(p.x >= 2 && p.x < 6 && p.y >= 2 && p.y < 5).toBe(true);
      expect(blocked(p)).toBe(false);
    }
    expect(crowdSpots({ ...zone, count: 50 }, () => true, new Rng(1))).toHaveLength(12); // a full zone holds what fits
  });

  it('steps one tile inside the zone onto a free tile, or stays put', () => {
    for (let seed = 0; seed < 50; seed++) {
      const next = crowdStep(zone, { x: 2, y: 2 }, () => true, (p) => p.x === 3, new Rng(seed));
      expect(next).toEqual({ x: 2, y: 3 }); // left and up leave the zone; right is taken
    }
    expect(crowdStep(zone, { x: 2, y: 2 }, () => false, () => false, new Rng(3))).toBeNull();
  });
});

describe('the crowds on the maps', () => {
  const zones = Object.values(maps).flatMap((m) => m.crowds.map((z) => ({ map: m, z })));

  it('Pòdlimyè has its festival crowd before the lamp, and the temple path its pilgrims', () => {
    const before = new FlagStore();
    const after = new FlagStore();
    after.set('story.anissa_woke', true);
    const count = (map: string, flags: FlagStore) => maps[map]!.crowds.filter((z) => !z.if || evaluate(z.if, flags)).reduce((n, z) => n + z.count, 0);
    expect(count('zetwal-town', before)).toBeGreaterThanOrEqual(15);
    expect(count('zetwal-temple', before)).toBeGreaterThanOrEqual(6);
    expect(count('zetwal-town', after)).toBeLessThan(count('zetwal-town', before));
    expect(count('zetwal-temple', after)).toBe(0);
  });

  it('every crowd wears looks that exist and has room for everyone', () => {
    expect(zones.length).toBeGreaterThan(0);
    for (const { map, z } of zones) {
      expect(z.looks.length, z.id).toBeGreaterThan(0);
      for (const look of z.looks) expect(NPC_SPRITES[look], `${z.id}: ${look}`).toBeDefined();
      const room = crowdSpots({ ...z, count: 1000 }, (p) => isOpen(map, 'present', p, new FlagStore()), new Rng(1)).length;
      expect(room, z.id).toBeGreaterThanOrEqual(z.count * 2);
    }
  });
});
