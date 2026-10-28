// Accessibility (the Nov 18 polish item, done Oct 28): colour is never the only cue, Reduce motion turns off
// shakes and full-screen flashes and shortens camera glides, and no flash repeats faster than three a second.

import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { TILESET } from '../src/assets.config.ts';
import {
  CAMERA_GLIDE_MS,
  FLASH_MIN_GAP_MS,
  FlashGate,
  cameraGlideMs,
  cameraGlideStep,
  levelBandWord,
  rarityName,
  rarityPips,
  shakeAllowed,
} from '../src/engine/accessibility.ts';
import { RARITIES, levelBand } from '../src/engine/rpg.ts';
import { parseMap } from '../src/engine/tiledMap.ts';
import { DOOR_COLOUR, DOOR_COLOUR_ON_LIGHT, DOOR_MIN_CONTRAST, contrastRatio, doorColour, hex, tileColours } from '../src/ui/tileColours.ts';
import { makeMap, obj } from './helpers.ts';

describe('colour is never the only cue', () => {
  it('every level band has its own word', () => {
    const words = (['trivial', 'even', 'hard', 'deadly'] as const).map(levelBandWord);
    expect(words).toEqual(['easy', 'even', 'hard', 'deadly']);
    expect(levelBandWord(levelBand(RPG, 10, 20))).toBe('deadly');
  });

  it('every rarity has a name and a different number of pips', () => {
    expect(RARITIES.map(rarityName)).toEqual(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);
    expect(RARITIES.map(rarityPips)).toEqual([0, 1, 2, 3, 4]);
  });

  it('a door stands out from what is round it by brightness: gold on dark, dark wood on light', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#123456', '#123456')).toBe(1);
    expect(doorColour([])).toBe(DOOR_COLOUR);
    expect(doorColour(['#3a3440', '#2a2430'])).toBe(DOOR_COLOUR);
    expect(doorColour(['#e0c89a', '#d8d4c8'])).toBe(DOOR_COLOUR_ON_LIGHT);
    // Whichever is chosen, it stands out from light tiles by brightness.
    for (const light of ['#e0c89a', '#d8d4c8', '#ece4d0']) expect(contrastRatio(doorColour([light]), light)).toBeGreaterThanOrEqual(DOOR_MIN_CONTRAST);
  });

  it('the map colours paint a door on a light wall dark and one on a dark wall gold', () => {
    const light = TILESET.tiles.find((t) => t.name === 'sandstone_wall')!;
    const dark = TILESET.tiles.find((t) => t.name === 'stone') ?? TILESET.tiles[0]!;
    const raw = makeMap({
      present: ['.....', '.....', '.....', '.....', '.....'],
      objects: { doors: [obj('a', 0, 2, { target: 'b', exit: 'right' }), obj('b', 4, 2, { target: 'a', exit: 'left' })], spawns: [obj('s', 2, 2)] },
    });
    const ground = raw.layers.find((l) => l.name === 'ground_present') as { data: number[] };
    ground.data = ground.data.map((_, i) => (i % 5 < 2 ? light.gid : dark.gid));
    const map = parseMap('m', raw);
    const colours = tileColours(map, raw, 'present');
    expect(colours[2 * 5 + 0]).toBe(contrastRatio(DOOR_COLOUR, hex(light.base)) < DOOR_MIN_CONTRAST ? DOOR_COLOUR_ON_LIGHT : DOOR_COLOUR);
    expect(colours[2 * 5 + 0]).toBe(DOOR_COLOUR_ON_LIGHT);
    expect(colours[2 * 5 + 4]).toBe(contrastRatio(DOOR_COLOUR, hex(dark.base)) < DOOR_MIN_CONTRAST ? DOOR_COLOUR_ON_LIGHT : DOOR_COLOUR);
    expect(colours[1 * 5 + 0]).toBe(hex(light.base));
  });
});

describe('reduce motion and flashing', () => {
  it('no full-screen flash comes within a third of a second of the last', () => {
    const gate = new FlashGate();
    expect(gate.allow(1000, false)).toBe(true);
    expect(gate.allow(1000 + FLASH_MIN_GAP_MS - 1, false)).toBe(false);
    expect(gate.allow(1000 + FLASH_MIN_GAP_MS, false)).toBe(true);
    // A burst of requests every 50 ms for two seconds lets through at most three a second.
    const burst = new FlashGate();
    let shown = 0;
    for (let t = 0; t < 2000; t += 50) if (burst.allow(t, false)) shown++;
    expect(shown).toBeLessThanOrEqual(6);
    expect(1000 / FLASH_MIN_GAP_MS).toBeLessThanOrEqual(3);
  });

  it('with reduce motion there are no flashes or shakes, and the camera glides in a third of the time', () => {
    const gate = new FlashGate();
    expect(gate.allow(0, true)).toBe(false);
    expect(gate.allow(10_000, true)).toBe(false);
    expect(shakeAllowed(true)).toBe(false);
    expect(shakeAllowed(false)).toBe(true);
    expect(cameraGlideMs(false)).toBe(CAMERA_GLIDE_MS);
    expect(cameraGlideMs(true)).toBeLessThanOrEqual(CAMERA_GLIDE_MS / 3);
    expect(cameraGlideStep(16, true)).toBeGreaterThan(cameraGlideStep(16, false));
    expect(cameraGlideStep(1000, false)).toBe(1);
  });
});
