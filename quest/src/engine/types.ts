// Shared engine types. Pure TypeScript: no Phaser, no DOM.

/** The four sprite facings (and door exits, NPC facings in maps). */
export type Dir = 'up' | 'down' | 'left' | 'right';
export const DIRS: readonly Dir[] = ['up', 'down', 'left', 'right'];

/** The four diagonal steps. */
export type Diagonal = 'up-left' | 'up-right' | 'down-left' | 'down-right';
export const DIAGONALS: readonly Diagonal[] = ['up-left', 'up-right', 'down-left', 'down-right'];

/**
 * A movement direction: the player steps (and faces) in eight directions; sprites show four
 * (grid.ts `spriteFacing`). The order keeps the first four equal to DIRS, so old save codes still read.
 */
export type Dir8 = Dir | Diagonal;
export const DIRS8: readonly Dir8[] = [...DIRS, ...DIAGONALS];

/** The two playable eras. Every map carries a layer set for each (guide 6.1). */
export type Era = 'present' | 'echo';
export const ERAS: readonly Era[] = ['present', 'echo'];

/** Which era a map object belongs to: one of them, or both. */
export type EraScope = Era | 'both';

export interface Pos {
  x: number;
  y: number;
}

export type FlagValue = boolean | number | string;
