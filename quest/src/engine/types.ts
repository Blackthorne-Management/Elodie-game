// Shared engine types. Pure TypeScript: no Phaser, no DOM.

export type Dir = 'up' | 'down' | 'left' | 'right';
export const DIRS: readonly Dir[] = ['up', 'down', 'left', 'right'];

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
