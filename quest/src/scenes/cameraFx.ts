// Every screen shake and full-screen flash goes through here (Claude's call, Oct 28): with Reduce motion on
// (ui/reduceMotion.ts) neither plays, and a flash never follows another within a third of a second, whatever asks
// for it (engine/accessibility.ts FlashGate). The sound that goes with an effect is the caller's and always plays.

import type Phaser from 'phaser';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { FlashGate, shakeAllowed } from '../engine/accessibility.ts';
import { reduceMotion } from '../ui/reduceMotion.ts';

/** One gate for the whole game: a flash in one scene counts for the next. */
const gate = new FlashGate();

/** How strong the gentle wash that stands in for a story flash is with Reduce motion (0..1). */
const GENTLE_ALPHA = 0.28;

export function screenFlash(scene: Phaser.Scene, ms: number, r: number, g: number, b: number): void {
  if (gate.allow(performance.now(), reduceMotion())) scene.cameras.main.flash(ms, r, g, b);
}

/**
 * A flash the story needs the player to see (the Sun Locket and Rael's signet glowing): with Reduce motion it is
 * still shown, as a soft wash of the colour that rises and fades once over the same time, never a flash.
 */
export function storyFlash(scene: Phaser.Scene, ms: number, r: number, g: number, b: number): void {
  if (!reduceMotion()) {
    screenFlash(scene, ms, r, g, b);
    return;
  }
  // In the 320 x 180 layout, like every other piece of the picture fixed to the screen.
  const wash = scene.add
    .rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT, (r << 16) | (g << 8) | b, 0)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(100_000);
  scene.tweens.add({ targets: wash, fillAlpha: GENTLE_ALPHA, duration: ms / 2, yoyo: true, ease: 'Sine.easeInOut', onComplete: () => wash.destroy() });
}

export function screenShake(scene: Phaser.Scene, ms: number, intensity: number): void {
  if (shakeAllowed(reduceMotion())) scene.cameras.main.shake(ms, intensity);
}
