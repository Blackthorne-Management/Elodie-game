// Skin recolouring (engine/skin.ts): one Quiet Crown sheet, any skin tone.

import { describe, expect, it } from 'vitest';
import { averageSkin, isSkin, recolorSkin } from '../src/engine/skin.ts';
import { NPC_SPRITES, SKIN_TONES } from '../src/assets.config.ts';

const px = (...colors: number[][]) => new Uint8ClampedArray(colors.flatMap(([r, g, b, a = 255]) => [r!, g!, b!, a]));

describe('skin recolouring', () => {
  it('finds skin and leaves the cult colours alone', () => {
    for (const tone of Object.values(SKIN_TONES)) expect(isSkin((tone >> 16) & 255, (tone >> 8) & 255, tone & 255), tone.toString(16)).toBe(true);
    expect(isSkin(0x34, 0x30, 0x3e)).toBe(false); // charcoal robe
    expect(isSkin(0xd8, 0xd0, 0xc0)).toBe(false); // bone veil
    expect(isSkin(208, 191, 171)).toBe(false); // the veil's warm edge (from the real sheet)
    expect(isSkin(188, 160, 147)).toBe(false);
    expect(isSkin(0xc8, 0xc8, 0xd0)).toBe(false); // silver emblem
    expect(isSkin(0x1a, 0x14, 0x20)).toBe(false); // outline
  });

  it('moves the skin average to the chosen tone and keeps the shading steps', () => {
    const data = px([200, 140, 100], [160, 100, 70], [52, 48, 62]);
    recolorSkin(data, SKIN_TONES.deep);
    const avg = averageSkin(data)!;
    const t = SKIN_TONES.deep;
    expect(avg[0]).toBeCloseTo((t >> 16) & 255, -1);
    expect(avg[1]).toBeCloseTo((t >> 8) & 255, -1);
    expect(avg[2]).toBeCloseTo(t & 255, -1);
    expect(data[0]!).toBeGreaterThan(data[4]!); // the highlight stays lighter than the shadow
    expect(Array.from(data.slice(8, 12))).toEqual([52, 48, 62, 255]); // the robe is untouched
  });

  it('ignores transparent pixels and images without skin', () => {
    const data = px([200, 140, 100, 0], [52, 48, 62]);
    const before = [...data];
    recolorSkin(data, SKIN_TONES.light);
    expect([...data]).toEqual(before);
  });

  it('every Quiet Crown member comes in each skin tone, male and female, from one sheet each', () => {
    for (const sex of ['m', 'f']) {
      for (const tone of Object.keys(SKIN_TONES)) {
        const look = NPC_SPRITES[`quiet_crown_${sex}_${tone}`];
        expect(look, `${sex} ${tone}`).toBeDefined();
        expect(look!.art).toBe(`quiet_crown_${sex}`);
        expect(look!.skinTone).toBe(tone);
      }
    }
  });
});
