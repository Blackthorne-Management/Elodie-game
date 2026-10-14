// Third-party art and sound used by the quest, shown on the Credits screen (menu) and kept in
// quest/assets/CREDITS.md. CC-BY needs this attribution. Empty for now: every picture is drawn by the
// quest itself (no downloaded assets), and the owner's own art will be listed here as it arrives.

export interface Credit {
  title: string;
  author: string;
  url: string;
  licence: string;
  /** What the quest uses it for. */
  use: string;
}

export const CREDITS: readonly Credit[] = [];

/** Shown on the Credits screen above the list. */
export const CREDITS_INTRO = [
  'Bloodlines: Echoes of Zetwal',
  'Art: placeholder pixel art drawn by the game itself (src/assets.pixels.ts).',
  'No third-party art or sound is used yet.',
];
