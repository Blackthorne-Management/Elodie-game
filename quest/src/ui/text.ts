// Text everywhere in the quest: one font, one size setting, one style. The game is drawn at a
// multiple of its 320 x 180 layout (the render scale, set at boot from the screen), and every text is
// rendered at that multiple too, so letters are as sharp as the screen allows while the pixel art is
// enlarged in whole steps exactly as before. The font is Atkinson Hyperlegible, made for legibility.
// The text size (Normal or Large) is a setting of this device (localStorage), not of the save.

import type Phaser from 'phaser';
import regularUrl from '@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2?url';
import boldUrl from '@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2?url';
import { TEXT_SIZES, UI } from '../assets.config.ts';

export type TextSize = keyof typeof TEXT_SIZES;

const STORAGE_KEY = 'bq.textSize';
const FAMILY = 'Atkinson Hyperlegible';

let scale = 1;
let size: TextSize = readSize();

function readSize(): TextSize {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'large' ? 'large' : 'normal';
  } catch {
    return 'normal';
  }
}

/** How many screen pixels each game pixel is drawn with (set once at boot). */
export function setRenderScale(s: number): void {
  scale = Math.max(1, Math.round(s));
}

export function renderScale(): number {
  return scale;
}

export function textSize(): TextSize {
  return size;
}

export function setTextSize(next: TextSize): void {
  size = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private mode: the setting lasts until the page closes.
  }
}

/** The text height in game pixels for the current size. */
export function fontPx(): number {
  return TEXT_SIZES[size].px;
}

export function lineSpacing(): number {
  return TEXT_SIZES[size].lineSpacing;
}

/** Extra height the dialogue box takes for the current size. */
export function dialogueExtraPx(): number {
  return TEXT_SIZES[size].dialogueExtraPx;
}

/** A typical character's width in game pixels (for wrapping by character count). */
export function charPx(): number {
  return fontPx() * 0.56;
}

/** The style for a text in `color`, drawn sharp at the render scale. */
export function textStyle(color: string = UI.text, extra: Phaser.Types.GameObjects.Text.TextStyle = {}): Phaser.Types.GameObjects.Text.TextStyle {
  return { fontFamily: UI.font, fontSize: `${fontPx()}px`, color, lineSpacing: lineSpacing(), resolution: scale, ...extra };
}

/** Load the bundled font before any text is measured (gives up after a few seconds: system font). */
export async function loadFonts(timeoutMs = 4000): Promise<void> {
  const faces = [new FontFace(FAMILY, `url(${regularUrl})`, { weight: '400' }), new FontFace(FAMILY, `url(${boldUrl})`, { weight: '700' })];
  const load = Promise.all(
    faces.map(async (f) => {
      document.fonts.add(await f.load());
    }),
  );
  await Promise.race([load, new Promise((r) => setTimeout(r, timeoutMs))]).catch(() => undefined);
}
