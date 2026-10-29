// The battle menus' way back and the acting fighter's mark (owner report, Oct 29; Claude's call, recorded in
// docs/quest/design/COMBAT.md section 1.1). Pure TypeScript: no Phaser, no DOM; the battle scene draws what this
// decides.
//
// Going back: every step into a menu (a command's sub-menu, then its target cursor) leaves a place on a trail, and B
// (or Escape) walks it back one step at a time, to the very row that was chosen: target -> the menu it came from ->
// commands. Choosing an action, or a new turn, clears the trail.
//
// Whose turn: the fighter choosing gets a one-pixel gold outline and stands in a small pool of light at their feet;
// both pulse and the fighter bobs a pixel. With Reduce motion the outline and light are steady and nobody bobs. Only
// a party fighter is marked (Anissa never fights, so she is never one; a foe's turn needs no mark).

import { ACTING_MARK } from '../config.ts';

export type BattleMenu = 'commands' | 'moves' | 'skills' | 'items' | 'swap' | 'target';

/** A menu and the row the cursor was on. */
export interface MenuPlace {
  menu: BattleMenu;
  cursor: number;
}

export class MenuTrail {
  private places: MenuPlace[] = [];

  /** Leave `from` behind on the way into a deeper menu (or the target cursor). */
  enter(from: MenuPlace): void {
    this.places.push({ ...from });
  }

  /** One step back: where to return to, or null at the top (the commands). */
  back(): MenuPlace | null {
    return this.places.pop() ?? null;
  }

  /** An action was chosen, or a new turn began: the next choice starts at the commands. */
  clear(): void {
    this.places = [];
  }

  get depth(): number {
    return this.places.length;
  }
}

/** The buttons that go back in a battle menu: B (cancel) and the menu button (Escape: the battle has no game menu). */
export function battleBackPressed(pressed: (button: 'cancel' | 'menu') => boolean): boolean {
  return pressed('cancel') || pressed('menu');
}

/** The fighter to mark as acting: a party fighter whose turn it is, while the player chooses; else null. */
export function actingFighter(state: {
  actor: { key: string; side: 'party' | 'enemy'; support?: boolean } | null | undefined;
  busy: boolean;
  done: boolean;
  fallen: boolean;
}): string | null {
  const a = state.actor;
  if (!a || a.side !== 'party' || a.support || state.busy || state.done || state.fallen) return null;
  return a.key;
}

/** The pulse, the bob and the light's alpha (config.ts ACTING_MARK). */
export const ACTING_PULSE_MS = ACTING_MARK.pulseMs;
export const ACTING_BOB_MS = ACTING_MARK.bobMs;
export const ACTING_ALPHA_MIN = ACTING_MARK.alphaMin;
export const ACTING_ALPHA_MAX = ACTING_MARK.alphaMax;
export const ACTING_ALPHA_STEADY = ACTING_MARK.alphaSteady;

/**
 * How the mark looks at time `now` (ms): the light's alpha, in four steps like pixel art, and the fighter's bob
 * (0 or -1 px). With Reduce motion: a steady light and no bob.
 */
export function actingMark(now: number, reduced: boolean): { alpha: number; bob: number } {
  if (reduced) return { alpha: ACTING_ALPHA_STEADY, bob: 0 };
  const phase = (((now % ACTING_PULSE_MS) + ACTING_PULSE_MS) % ACTING_PULSE_MS) / ACTING_PULSE_MS;
  const wave = 1 - Math.abs(phase * 2 - 1); // 0 -> 1 -> 0
  const step = Math.round(wave * 3) / 3;
  const alpha = ACTING_ALPHA_MIN + (ACTING_ALPHA_MAX - ACTING_ALPHA_MIN) * step;
  const bob = Math.floor(now / ACTING_BOB_MS) % 2 === 1 ? -1 : 0;
  return { alpha: Math.round(alpha * 1000) / 1000, bob };
}

/** The pool of light's rows under a fighter `width` px wide: [dy from the feet, half-width] each, an oval of pixels. */
export function actingLightRows(width: number): Array<[number, number]> {
  const half = Math.max(8, Math.min(16, Math.round(width * 0.45)));
  return [
    [-2, Math.round(half * 0.55)],
    [-1, Math.round(half * 0.85)],
    [0, half],
    [1, Math.round(half * 0.85)],
    [2, Math.round(half * 0.55)],
  ];
}
