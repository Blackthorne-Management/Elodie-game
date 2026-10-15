// Third-party art, fonts and sound used by the quest, shown on the Credits screen (menu) and kept in
// quest/assets/CREDITS.md. CC-BY needs this attribution. Every picture so far is drawn by the quest
// itself; the owner's own art will be listed here as it arrives.

export interface Credit {
  title: string;
  author: string;
  url: string;
  licence: string;
  /** What the quest uses it for. */
  use: string;
}

export const CREDITS: readonly Credit[] = [
  {
    title: 'Atkinson Hyperlegible',
    author: 'Braille Institute of America',
    url: 'https://www.brailleinstitute.org/freefont',
    licence: 'SIL Open Font License 1.1',
    use: 'All text in the game',
  },
];

/** Shown on the Credits screen above the list. */
export const CREDITS_INTRO = [
  'Bloodlines: Echoes of Zetwal',
  'Art: placeholder pixel art drawn by the game itself (src/assets.pixels.ts).',
  'No third-party art or sound is used yet. Font below.',
];
