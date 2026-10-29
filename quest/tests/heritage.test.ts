// Skin tones by heritage (owner direction, Oct 29; docs/quest/ART-STYLE.md 5): in every land most of the townsfolk
// share its heritage's tones (LAND_SKIN) and a few are immigrants from elsewhere; the Crown and the Quiet Crown come
// from everywhere. And the festival crowds are many different people (owner, Oct 29: "too many duplicate people").

import { describe, expect, it } from 'vitest';
import { HERITAGE, LAND_SKIN, NPC_SPRITES, type Land } from '../src/assets.config.ts';
import { CONTENT } from '../src/data/content.ts';
import { crowdLooks, crowdSpots, nearEnough } from '../src/engine/crowd.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { Rng } from '../src/engine/rng.ts';
import { isOpen } from '../src/engine/world.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
const LANDS: readonly Land[] = ['zetwal', 'xaragua', 'ardencia', 'aldoria', 'seat', 'skarragol', 'kuroshi', 'jwaladesh', 'aldermoor'];
const skip = new Set<string>([...HERITAGE.own, ...HERITAGE.crown, ...HERITAGE.quietCrown]);
const home: Readonly<Record<string, Land>> = HERITAGE.home;
const crownLooks = new Set<string>(HERITAGE.crown);
const skinOf = (look: string) => NPC_SPRITES[look]!.skin;

/** Each land's townsfolk (see HERITAGE): the people on its maps and in its crowds, and its people met abroad. */
function townsfolk(land: Land): string[] {
  const looks = new Set<string>();
  for (const [id, map] of Object.entries(maps)) {
    if (id.split('-')[0] !== land) continue;
    for (const n of map.npcs) looks.add(CONTENT.npcs[n.npc]!.look);
    for (const z of map.crowds) for (const l of z.looks) looks.add(l);
  }
  for (const [look, from] of Object.entries(home)) if (from === land) looks.add(look);
  return [...looks].filter((l) => !skip.has(l) && (home[l] ?? land) === land).sort();
}

/** Light, tan, brown or deep, by how light the colour is: the bands a mixed group must spread over. */
function band(rgb: number): string {
  const lum = 0.299 * ((rgb >> 16) & 255) + 0.587 * ((rgb >> 8) & 255) + 0.114 * (rgb & 255);
  return lum < 95 ? 'deep' : lum < 140 ? 'brown' : lum < 170 ? 'tan' : 'light';
}

/** A mixed group: at least three of the four bands, and no band more than half of it. */
function expectMixed(name: string, looks: readonly string[]): void {
  const counts = new Map<string, number>();
  for (const l of looks) counts.set(band(skinOf(l)), (counts.get(band(skinOf(l))) ?? 0) + 1);
  expect(counts.size, `${name}: ${JSON.stringify([...counts])}`).toBeGreaterThanOrEqual(3);
  for (const [b, n] of counts) expect(n / looks.length, `${name}: too many ${b}`).toBeLessThanOrEqual(0.5);
}

describe('skin tones by land (owner direction, Oct 29)', () => {
  it('every look the rule names exists', () => {
    for (const l of [...skip, ...Object.keys(home)]) expect(NPC_SPRITES[l], l).toBeDefined();
  });

  for (const land of LANDS) {
    if (land === 'seat') continue;
    it(`${land}: most townsfolk share its heritage, and a few are immigrants`, () => {
      const folk = townsfolk(land);
      const local = new Set(LAND_SKIN[land]);
      const immigrants = folk.filter((l) => !local.has(skinOf(l)));
      expect(folk.length, land).toBeGreaterThanOrEqual(10);
      expect(immigrants.length, `${land}: no immigrants`).toBeGreaterThanOrEqual(1);
      expect(immigrants.length / folk.length, `${land} immigrants: ${immigrants.join(', ')}`).toBeLessThanOrEqual(0.25);
    });
  }

  it('Eightgate, the crossroads of the realm, is everyone', () => {
    expectMixed('seat', townsfolk('seat'));
  });

  it('the Crown and the Quiet Crown come from everywhere', () => {
    expectMixed('crown', HERITAGE.crown);
    expectMixed('quiet crown', HERITAGE.quietCrown);
  });

  it('a group on a map is not one face repeated: the Crown on the same map wear more than one tone', () => {
    for (const [id, map] of Object.entries(maps)) {
      const crown = map.npcs.map((n) => CONTENT.npcs[n.npc]!.look).filter((l) => crownLooks.has(l));
      if (crown.length >= 4) expect(new Set(crown.map(skinOf)).size, id).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('the crowds are many different people (owner, Oct 29)', () => {
  const zones = Object.values(maps).flatMap((m) => m.crowds.map((z) => ({ map: m, z })));

  it('every crowd has at least as many looks as people, and the festival twenty-four', () => {
    for (const { z } of zones) expect(new Set(z.looks).size, z.id).toBeGreaterThanOrEqual(z.count);
    const plaza = maps['zetwal-town']!.crowds.find((z) => z.id === 'plaza_festival')!;
    expect(new Set(plaza.looks).size).toBeGreaterThanOrEqual(24);
    // Different people, not one drawing in other colours: hair, headgear, build and what they carry differ.
    const shapes = plaza.looks.map((l) => {
      const c = NPC_SPRITES[l]!;
      return `${c.hairStyle}/${c.headgear ?? '-'}/${c.build ?? 'normal'}/${c.robe ? 'robe' : 'legs'}/${(c.accessories ?? []).join('+')}/${c.beard ? 'beard' : ''}`;
    });
    expect(new Set(shapes).size).toBeGreaterThanOrEqual(20);
  });

  it('nobody stands near someone who looks the same', () => {
    for (const { map, z } of zones) {
      const open = (p: { x: number; y: number }) => isOpen(map, 'present', p, new FlagStore());
      for (let seed = 0; seed < 20; seed++) {
        const rng = new Rng(seed);
        const spots = crowdSpots(z, open, rng);
        const looks = crowdLooks(spots, z.looks, rng);
        for (let i = 0; i < spots.length; i++) {
          for (let j = i + 1; j < spots.length; j++) {
            if (looks[i] === looks[j]) expect(nearEnough(spots[i]!, spots[j]!), `${z.id} seed ${seed}: ${looks[i]}`).toBe(false);
          }
        }
      }
    }
  });

  it('keeps away from the people already there who look the same, and wears every look once before twice', () => {
    const spots = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    for (let seed = 0; seed < 30; seed++) {
      const looks = crowdLooks(spots, ['a', 'b', 'c', 'd'], new Rng(seed), [{ at: { x: 1, y: 1 }, look: 'a' }]);
      expect(looks).not.toContain('a');
      expect(new Set(looks).size).toBe(3);
    }
    expect(crowdLooks(spots, ['a'], new Rng(1))).toEqual(['a', 'a', 'a']); // one look: it has to repeat
  });
});
