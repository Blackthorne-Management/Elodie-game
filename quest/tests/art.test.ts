// The placeholder drawings (src/scenes/pixels.ts): every look draws in every facing with the 1 px
// dark outline, walk frames differ from standing, and the cast differ in silhouette.

import { describe, expect, it } from 'vitest';
import { NPC_SPRITES, PALETTE, TILE_ART } from '../src/assets.config.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH } from '../src/config.ts';
import { DIRS } from '../src/engine/types.ts';
import { artPix, characterPix } from '../src/scenes/pixels.ts';

type Pix = ReturnType<typeof characterPix>;

const cells = (p: Pix) => {
  const out: (number | undefined)[] = [];
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) out.push(p.get(x, y));
  return out;
};
const silhouette = (p: Pix) => cells(p).map((c) => (c === undefined ? '.' : '#')).join('');

describe('placeholder characters', () => {
  it('every look draws in four facings, inside a 16 x 24 cell, outlined in the dark outline colour', () => {
    for (const [name, look] of Object.entries(NPC_SPRITES)) {
      for (const facing of DIRS) {
        const p = characterPix(look, facing);
        expect([p.w, p.h]).toEqual([CHARACTER_WIDTH, CHARACTER_HEIGHT]);
        // Every opaque pixel that touches the transparent outside is the outline colour.
        for (let y = 0; y < p.h; y++) {
          for (let x = 0; x < p.w; x++) {
            if (p.get(x, y) === undefined) continue;
            const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
              const nx = x + dx!;
              const ny = y + dy!;
              return nx >= 0 && ny >= 0 && nx < p.w && ny < p.h && p.get(nx, ny) === undefined;
            });
            if (edge) expect(p.get(x, y), `${name} ${facing} ${x},${y}`).toBe(PALETTE.k);
          }
        }
      }
    }
  });

  it('walk frames move the feet', () => {
    for (const [name, look] of Object.entries(NPC_SPRITES)) {
      expect(silhouette(characterPix(look, 'down', 1)), name).not.toBe(silhouette(characterPix(look, 'down', 0)));
    }
  });

  it('the cast have different silhouettes facing the player', () => {
    const cast = ['gianna', 'patricio_young', 'anissa', 'elodie', 'anicette', 'patricio_old', 'yari', 'recruiter'];
    const shapes = cast.map((k) => silhouette(characterPix(NPC_SPRITES[k]!, 'down')));
    expect(new Set(shapes).size).toBe(cast.length);
  });

  it('pixel art turns into pixels of the palette', () => {
    const p = artPix(TILE_ART.winch!);
    expect([p.w, p.h]).toEqual([16, 16]);
    expect(cells(p).filter((c) => c !== undefined).every((c) => Object.values(PALETTE).includes(c!))).toBe(true);
  });
});
