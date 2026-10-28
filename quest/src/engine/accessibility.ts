// Accessibility rules the scenes share (the Nov 18 polish item, done Oct 28; Claude's calls, recorded in the build
// guide Section 9). Pure TypeScript: no Phaser, no DOM.
//
// Colour is never the only cue: a level's band also has a word, an item's rarity a count of pips and its name, a
// status a mark for good or bad. Reduce motion (a System setting, per device) turns off screen shake and full-screen
// flashes and shortens camera glides; and no full-screen flash ever repeats faster than three times a second.

import { RARITIES, type LevelBand, type Rarity } from './rpg.ts';

/** The word shown with a level's colour (grey easy, white even, orange hard, red deadly). */
export const LEVEL_BAND_WORDS: Readonly<Record<LevelBand, string>> = { trivial: 'easy', even: 'even', hard: 'hard', deadly: 'deadly' };

export function levelBandWord(band: LevelBand): string {
  return LEVEL_BAND_WORDS[band];
}

/** A rarity's name, capitalised ("Rare"). */
export function rarityName(rarity: Rarity): string {
  return rarity[0]!.toUpperCase() + rarity.slice(1);
}

/** Pips in an item box's corner, one per step above common (common none, legendary four). */
export function rarityPips(rarity: Rarity): number {
  return RARITIES.indexOf(rarity);
}

/** The shortest time between two full-screen flashes (at most three a second: WCAG 2.3.1). */
export const FLASH_MIN_GAP_MS = 334;

/**
 * Lets a full-screen flash through only when reduce motion is off and the last flash it let through started at
 * least FLASH_MIN_GAP_MS ago. Time comes from the caller (the scene's clock), so tests can drive it.
 */
export class FlashGate {
  private last = -Infinity;

  allow(now: number, reduced: boolean): boolean {
    if (reduced) return false;
    if (now - this.last < FLASH_MIN_GAP_MS) return false;
    this.last = now;
    return true;
  }
}

/** Whether a camera shake plays (never with reduce motion). */
export function shakeAllowed(reduced: boolean): boolean {
  return !reduced;
}

/** The camera's glide toward whoever a scene follows: its time constant in ms (a third as long with reduce motion). */
export const CAMERA_GLIDE_MS = 180;
export const CAMERA_GLIDE_REDUCED_MS = 60;

export function cameraGlideMs(reduced: boolean): number {
  return reduced ? CAMERA_GLIDE_REDUCED_MS : CAMERA_GLIDE_MS;
}

/** How far the camera moves toward its target this frame (0..1), for a frame of `delta` ms. */
export function cameraGlideStep(delta: number, reduced: boolean): number {
  return Math.min(1, delta / cameraGlideMs(reduced));
}
