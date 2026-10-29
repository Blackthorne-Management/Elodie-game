// The battle menus' way back and the acting fighter's mark (owner report, Oct 29): B steps back one level at a time
// (target -> the menu it came from -> commands), Escape works as B in a fight, and the fighter whose turn it is is
// marked on the field (a pulsing light and a bob; steady and still with Reduce motion), never Anissa or a foe.

import { describe, expect, it } from 'vitest';
import {
  ACTING_ALPHA_MAX,
  ACTING_ALPHA_MIN,
  ACTING_ALPHA_STEADY,
  ACTING_BOB_MS,
  ACTING_PULSE_MS,
  MenuTrail,
  actingFighter,
  actingLightRows,
  actingMark,
  battleBackPressed,
} from '../src/engine/battleMenu.ts';
import { KEYMAP } from '../src/input/keyboard.ts';

describe('B goes back one step at a time', () => {
  it('target -> the sub-menu -> the commands, each to the row that was chosen', () => {
    const trail = new MenuTrail();
    trail.enter({ menu: 'commands', cursor: 1 }); // Skill
    trail.enter({ menu: 'skills', cursor: 2 }); // the third spell, now aiming
    expect(trail.depth).toBe(2);
    expect(trail.back()).toEqual({ menu: 'skills', cursor: 2 });
    expect(trail.back()).toEqual({ menu: 'commands', cursor: 1 });
    expect(trail.back()).toBeNull();
    expect(trail.depth).toBe(0);
  });

  it('a plain Attack goes straight back to the commands', () => {
    const trail = new MenuTrail();
    trail.enter({ menu: 'commands', cursor: 0 });
    expect(trail.back()).toEqual({ menu: 'commands', cursor: 0 });
  });

  it('choosing an action clears the trail, so the next turn starts at the commands', () => {
    const trail = new MenuTrail();
    trail.enter({ menu: 'commands', cursor: 3 });
    trail.enter({ menu: 'items', cursor: 0 });
    trail.clear();
    expect(trail.back()).toBeNull();
  });

  it('a place left on the trail is a copy (moving the cursor later does not change it)', () => {
    const trail = new MenuTrail();
    const here = { menu: 'commands' as const, cursor: 1 };
    trail.enter(here);
    here.cursor = 4;
    expect(trail.back()?.cursor).toBe(1);
  });

  it('cancel and the menu button both go back in a fight', () => {
    const only = (b: string) => (x: string) => x === b;
    expect(battleBackPressed(only('cancel'))).toBe(true);
    expect(battleBackPressed(only('menu'))).toBe(true);
    expect(battleBackPressed(only('confirm'))).toBe(false);
  });

  it('on the keyboard X, Backspace and B are cancel, and Escape is the menu button (back, in a fight)', () => {
    for (const key of ['KeyX', 'Backspace', 'KeyB']) expect(KEYMAP[key]).toContain('cancel');
    expect(KEYMAP.Escape).toContain('menu');
    const viaKey = (code: string) => battleBackPressed((b) => KEYMAP[code]!.includes(b));
    expect(['KeyX', 'Backspace', 'KeyB', 'Escape'].every(viaKey)).toBe(true);
    expect(viaKey('KeyZ')).toBe(false);
  });
});

describe('the acting fighter is marked', () => {
  const gianna = { key: 'gianna', side: 'party' as const };
  const idle = { busy: false, done: false, fallen: false };

  it('the party fighter whose turn it is, while the player chooses', () => {
    expect(actingFighter({ actor: gianna, ...idle })).toBe('gianna');
  });

  it('nobody while the turn plays out, after the fight, or when the party has fallen', () => {
    expect(actingFighter({ actor: gianna, ...idle, busy: true })).toBeNull();
    expect(actingFighter({ actor: gianna, ...idle, done: true })).toBeNull();
    expect(actingFighter({ actor: gianna, ...idle, fallen: true })).toBeNull();
    expect(actingFighter({ actor: null, ...idle })).toBeNull();
  });

  it('never a foe, never a support member (Anissa)', () => {
    expect(actingFighter({ actor: { key: 'boar#1', side: 'enemy' }, ...idle })).toBeNull();
    expect(actingFighter({ actor: { key: 'anissa', side: 'party', support: true }, ...idle })).toBeNull();
  });

  it('pulses and bobs a pixel', () => {
    const alphas = new Set<number>();
    const bobs = new Set<number>();
    for (let t = 0; t < ACTING_PULSE_MS * 2; t += 50) {
      const m = actingMark(t, false);
      alphas.add(m.alpha);
      bobs.add(m.bob);
      expect(m.alpha).toBeGreaterThanOrEqual(ACTING_ALPHA_MIN - 1e-9);
      expect(m.alpha).toBeLessThanOrEqual(ACTING_ALPHA_MAX + 1e-9);
    }
    // Four steps of light, like pixel art; the bob is one pixel up and back.
    expect(alphas.size).toBe(4);
    expect([...bobs].sort()).toEqual([-1, 0]);
    expect(actingMark(0, false).bob).toBe(0);
    expect(actingMark(ACTING_BOB_MS, false).bob).toBe(-1);
  });

  it('with Reduce motion: a steady light and no bob', () => {
    for (let t = 0; t < ACTING_PULSE_MS * 2; t += 37) expect(actingMark(t, true)).toEqual({ alpha: ACTING_ALPHA_STEADY, bob: 0 });
  });

  it('the light is an oval of whole pixels at the feet, sized to the fighter', () => {
    const rows = actingLightRows(30);
    expect(rows.map(([dy]) => dy)).toEqual([-2, -1, 0, 1, 2]);
    const widest = Math.max(...rows.map(([, h]) => h));
    expect(rows.find(([dy]) => dy === 0)![1]).toBe(widest);
    expect(rows.every(([, h]) => Number.isInteger(h) && h > 0)).toBe(true);
    expect(actingLightRows(2)[2]![1]).toBe(8);
    expect(actingLightRows(500)[2]![1]).toBe(16);
  });
});
