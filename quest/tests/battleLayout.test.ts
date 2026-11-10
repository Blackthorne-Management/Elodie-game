// The battle screen's readability (Nov 1 playtests): short names, name plates that never overlap at 1 to 6 foes, a
// turn order of whole names, prices and waits that say what they are, and the first-time tips.

import { describe, expect, it } from 'vitest';
import { BATTLE_ART, BATTLE_BACKDROPS, ENEMY_WEAPONS, WEAPON_ART } from '../src/assets.config.ts';
import { VIEW_WIDTH } from '../src/config.ts';
import { BATTLES, ENEMIES, battleDef } from '../src/data/battles.ts';
import { BATTLE_TIPS } from '../src/data/battleTips.ts';
import { BATTLE_TIP_ORDER, costTag, dueTip, overlaps, placePlates, queueFit, shortName, waitTag, type PlateRequest } from '../src/engine/battleLayout.ts';

describe('short names', () => {
  it('keep the word that says who it is, and a duplicate letter after a word', () => {
    expect(shortName('Crown Marine A')).toBe('Marine A');
    expect(shortName('Governor Thorne')).toBe('Thorne');
    expect(shortName('Captain-General Hale')).toBe('Hale');
    expect(shortName("Regent's Sealbearer")).toBe('Sealbearer');
    expect(shortName('Musketeer in a Breastplate')).toBe('Breastplate');
    expect(shortName('Champion of the eastern clans')).toBe('Champion');
    expect(shortName('Crown Musketeer (old uniform) B')).toBe('Musketeer B');
    expect(shortName('Cane-field boar')).toBe('Boar');
    expect(shortName('Gianna')).toBe('Gianna');
  });

  it('never leave a lone letter (it read as a button: "B > A")', () => {
    for (const e of Object.values(ENEMIES)) for (const l of ['', ' A', ' B']) expect(shortName(e.name + l)).toMatch(/^\S{2,}/);
  });
});

describe('name plates', () => {
  // Plates as wide as the longest short name at 7 px ("Lieutenant", "Sealbearer": about 36 px), over walking sprites at
  // the stand-in scale, the first the leader (larger).
  const body = (x: number, y: number, k: number = BATTLE_ART.standInScale) => {
    const w = Math.round(24 * k * 0.66);
    const h = Math.round(32 * k * 0.92);
    return { x: Math.round(x - w / 2), y: y - h, w, h };
  };
  const area = { x: 2, y: BATTLE_ART.plateTop, w: VIEW_WIDTH - 4, h: BATTLE_ART.stripY - 1 - BATTLE_ART.plateTop };

  for (let n = 1; n <= 6; n++) {
    it(`never overlap one another or another foe, with ${n} foe${n > 1 ? 's' : ''}`, () => {
      const reqs: PlateRequest[] = BATTLE_ART.enemySlots.slice(0, n).map((s, i) => ({
        key: `f${i}`,
        body: body(s.x, s.y, i === 0 ? BATTLE_ART.leaderScale : BATTLE_ART.standInScale),
        w: 38,
        h: 11,
      }));
      const out = placePlates(reqs, [], area);
      const placed = [...out.entries()].filter(([, r]) => r);
      for (const [k, r] of placed) {
        for (const [k2, r2] of placed) if (k !== k2) expect(overlaps(r!, r2!), `${k} ${k2}`).toBe(false);
        for (const q of reqs) expect(overlaps(r!, q.body), `${k} on ${q.key}`).toBe(false);
        expect(r!.y).toBeGreaterThanOrEqual(area.y);
        expect(r!.y + r!.h).toBeLessThanOrEqual(area.y + area.h);
      }
      // The four places a fight starts with all have room for a name.
      if (n <= 4) expect(placed.length).toBe(n);
    });
  }

  it('do not move when another foe is targeted (placed in a fixed order)', () => {
    const reqs: PlateRequest[] = BATTLE_ART.enemySlots.slice(0, 4).map((s, i) => ({ key: `f${i}`, body: body(s.x, s.y), w: 40, h: 11 }));
    expect([...placePlates(reqs, [], area)]).toEqual([...placePlates(reqs, [], area)]);
  });
});

describe('the turn order', () => {
  it('shows whole entries only', () => {
    expect(queueFit([30, 30, 30], 100, 2)).toBe(3);
    expect(queueFit([30, 30, 30], 70, 2)).toBe(2);
    expect(queueFit([30, 30, 30], 20, 2)).toBe(0);
  });
});

describe('prices and waits', () => {
  it('say what the number is', () => {
    expect(costTag(3)).toBe('3 SP');
    expect(costTag(0, 40)).toBe('40 g');
    expect(waitTag(2)).toBe('ready in 2');
    expect(waitTag(0)).toBe('');
  });
});

describe('first-time tips', () => {
  it('each has a page, and they come in order, once each', () => {
    for (const id of BATTLE_TIP_ORDER) expect(BATTLE_TIPS[id].text.length).toBeGreaterThan(20);
    const seen = new Set<string>();
    const now = { anissa: true, surge: true, marked: true, swap: true };
    const shown: string[] = [];
    for (let i = 0; i < 6; i++) {
      const id = dueTip(now, (t) => seen.has(t));
      if (!id) break;
      seen.add(id);
      shown.push(id);
    }
    expect(shown).toEqual(['spark', 'surge', 'mark', 'swap']);
  });

  it('only for what is on screen', () => {
    expect(dueTip({ anissa: false, surge: false, marked: false, swap: true }, () => false)).toBe('swap');
    expect(dueTip({ anissa: false, surge: false, marked: false, swap: false }, () => false)).toBeNull();
  });
});

describe('battle scenes', () => {
  it('indoor fights stand indoors (the caney, the sea cave, the customs house)', () => {
    expect(BATTLE_BACKDROPS[battleDef('caney_breach')!.backdrop]!.inside).toBe('caney');
    expect(BATTLE_BACKDROPS[battleDef('thorne_blockade')!.backdrop]!.inside).toBe('cave');
    expect(BATTLE_BACKDROPS[battleDef('customs_thorne')!.backdrop]!.inside).toBe('hall');
  });

  it('every battle names a backdrop that exists', () => {
    for (const def of Object.values(BATTLES)) expect(BATTLE_BACKDROPS[def.backdrop], def.id).toBeDefined();
  });

  it('the musketeers carry a musket the marines do not', () => {
    expect(ENEMY_WEAPONS[ENEMIES.crown_musketeer!.look]).toBeDefined();
    expect(ENEMY_WEAPONS[ENEMIES.crown_marine!.look]).toBeUndefined();
    const art = WEAPON_ART[ENEMY_WEAPONS.crown_musketeer!.weapon]!;
    expect(art.rows[art.grip.y]![art.grip.x]).not.toBe('.');
  });
});
