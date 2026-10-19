// Game Over with the goddess (docs/quest/intro/GAME-OVER-STORYBOARD.md; design and owner decisions in
// docs/quest/reviews/2026-10-19-game-over-outline.md and its review). When the party falls in a fight that is
// meant to be won, the goddess catches them, says how many times they have fallen and gives back the moment
// before the fight; the player is then free on the map. This module holds the rules: the count and the
// per-fight Grudge (saved in the flags, so per save), her lines by count, what each press does on the screen,
// and the films' clock. Pure TypeScript; scenes/GameOverScene.ts shows it. Tested in tests/gameOver.test.ts.
//
// Where the party stands afterwards (the return tile) is the game logic's (engine/game.ts riseFromFight).

import { GAME_OVER, GRUDGE_MAX, GRUDGE_STEP } from '../config.ts';
import type { BattleDef } from './battle.ts';
import type { FlagReader, FlagStore } from './flags.ts';

/** Game Overs on this save (owner decision, Oct 19: a random fight counts too). */
export const GAME_OVER_COUNT_FLAG = 'gameover.count';

/** Losses at one fight, for its Grudge (cleared by a win). */
export function lossesFlag(def: Pick<BattleDef, 'table' | 'group'>): string {
  return `gameover.${def.table}.${def.group}`;
}

/** A random ambush in the wild (data/battles.ts battleDef: `encounter:<table>/<group>`). */
export function isRandomFight(def: Pick<BattleDef, 'id'>): boolean {
  return def.id.startsWith('encounter:');
}

export function gameOverCount(flags: FlagReader): number {
  const v = flags.get(GAME_OVER_COUNT_FLAG);
  return typeof v === 'number' ? v : 0;
}

export function fightLosses(flags: FlagReader, def: Pick<BattleDef, 'table' | 'group'>): number {
  const v = flags.get(lossesFlag(def));
  return typeof v === 'number' ? v : 0;
}

/**
 * The Grudge a fight starts with: +GRUDGE_STEP per Game Over at it, up to GRUDGE_MAX. Random ambushes give
 * none (owner decision, Oct 19), nor do fights meant to be lost.
 */
export function grudgeFor(flags: FlagReader, def: Pick<BattleDef, 'id' | 'table' | 'group' | 'meantToLose'>): number {
  if (isRandomFight(def) || def.meantToLose) return 0;
  return Math.min(GRUDGE_MAX, Math.round(fightLosses(flags, def) * GRUDGE_STEP * 1000) / 1000);
}

/** What losing a fight leads to. */
export type LossOutcome =
  /** A fight meant to be lost: no goddess, no count, no Grudge; this scene plays. */
  | { kind: 'scripted'; scene: string }
  /** The goddess's screen: the count after this fall (1 is the first meeting), and the Grudge for the next try. */
  | { kind: 'gameOver'; count: number; grudge: number };

/**
 * The party fell. A fight meant to be lost only names its scene. Any other fight adds one to the count and,
 * unless it is a random ambush, one loss at that fight (its Grudge). The caller saves straight after.
 */
export function recordLoss(flags: FlagStore, def: BattleDef): LossOutcome {
  if (def.meantToLose) return { kind: 'scripted', scene: def.meantToLose.scene };
  const count = flags.add(GAME_OVER_COUNT_FLAG, 1);
  if (!isRandomFight(def)) flags.add(lossesFlag(def), 1);
  return { kind: 'gameOver', count, grudge: grudgeFor(flags, def) };
}

/** A won fight forgets its losses (its Grudge starts from nothing again). The count stays. */
export function clearLosses(flags: FlagStore, def: Pick<BattleDef, 'table' | 'group'>): void {
  flags.clear(lossesFlag(def));
}

// ---- Her words -----------------------------------------------------------------------------------

export interface GoddessLine {
  /** The goddess (gold, no name box, no portrait, no voice) or Gianna (her one line at the first meeting). */
  speaker: 'goddess' | 'gianna';
  text: string;
}

/** The lines, as data (data/gameOver.ts). `{n}` is the count. */
export interface GoddessWords {
  firstMeeting: readonly GoddessLine[];
  few: string;
  many: string;
  closing: string;
}

/**
 * What she says after this many falls: the first meeting (she introduces herself) at 1; after that her first
 * line by the count (GAME_OVER.manyFrom changes its wording), then the closing line.
 */
export function goddessLines(count: number, words: GoddessWords): GoddessLine[] {
  if (count <= 1) return words.firstMeeting.map((l) => ({ ...l }));
  const first = (count >= GAME_OVER.manyFrom ? words.many : words.few).replace('{n}', String(count));
  return [
    { speaker: 'goddess', text: first },
    { speaker: 'goddess', text: words.closing },
  ];
}

// ---- The screen ----------------------------------------------------------------------------------

/**
 * `fall`: from the battle into her presence (the first film); `words`: her lines over the breathing loop, one
 * per press; `rise`: the threads draw up and the light flashes; `done`: back to the map.
 */
export type GameOverPhase = 'fall' | 'words' | 'rise' | 'done';

export interface GameOverView {
  phase: GameOverPhase;
  /** The line on screen (in `words`). */
  line: number;
  lines: number;
  /** The line is still typing out (at the player's text speed). */
  typing: boolean;
}

/** A tap anywhere on the screen is `tap`; the Skip button is `cancel`; the Rise button is `confirm`. */
export type GameOverPress = 'confirm' | 'cancel' | 'tap';

export type GameOverAction =
  | { kind: 'none' }
  /** Show the rest of the typing line at once. */
  | { kind: 'finish' }
  | { kind: 'next' }
  /** Straight to the last screen: her last line, the count and Rise (the count is never skipped past). */
  | { kind: 'skip' }
  | { kind: 'rise' };

/** The last screen: the last line is up, with the count and the Rise button under it. */
export function onLastScreen(v: GameOverView): boolean {
  return v.phase === 'words' && v.line >= v.lines - 1;
}

/**
 * What a press does. During the fall: B (Skip) jumps to the last screen; A and taps do nothing (a stray tap
 * never throws the moment away). Reading: A or a tap finishes a typing line, then moves to the next (no line
 * moves on by itself); B jumps to the last screen. On the last screen: A rises (Rise has its own button; a tap
 * elsewhere does nothing, so a tap meant for reading never rises by accident). Rising: nothing.
 */
export function gameOverPress(v: GameOverView, press: GameOverPress): GameOverAction {
  switch (v.phase) {
    case 'fall':
      return press === 'cancel' ? { kind: 'skip' } : { kind: 'none' };
    case 'words': {
      const last = onLastScreen(v);
      if (press === 'cancel') return last && !v.typing ? { kind: 'none' } : { kind: 'skip' };
      if (v.typing) return { kind: 'finish' };
      if (!last) return { kind: 'next' };
      return press === 'confirm' ? { kind: 'rise' } : { kind: 'none' };
    }
    case 'rise':
    case 'done':
      return { kind: 'none' };
  }
}

/** The view after an action (the scene draws it; `rise` hands over to the rise film). */
export function applyGameOverAction(v: GameOverView, a: GameOverAction): GameOverView {
  switch (a.kind) {
    case 'none':
      return v;
    case 'finish':
      return { ...v, typing: false };
    case 'next':
      return { ...v, line: Math.min(v.lines - 1, v.line + 1), typing: true };
    case 'skip':
      return { ...v, phase: 'words', line: Math.max(0, v.lines - 1), typing: false };
    case 'rise':
      return { ...v, phase: 'rise', typing: false };
  }
}

/** The fall has played out: her first line starts typing. */
export function gameOverFallEnded(v: GameOverView): GameOverView {
  return v.phase === 'fall' ? { ...v, phase: 'words', line: 0, typing: true } : v;
}

/** How long the fall and the rise last, with or without motion. */
export function gameOverDurations(reducedMotion: boolean): { fallS: number; riseS: number } {
  return reducedMotion
    ? { fallS: GAME_OVER.reduced.fallS, riseS: GAME_OVER.reduced.riseS }
    : { fallS: GAME_OVER.fallS, riseS: GAME_OVER.riseS };
}

/** The storyboard's shots inside the fall (1 starts on near-black; 5 is the loom and her presence). */
export type FallShot = 'dark' | 'dusk' | 'letters' | 'unravel' | 'loom';

/** Which shot of the fall plays at a time, and how far through it (0 to 1). */
export function fallShotAt(t: number): { shot: FallShot; k: number } {
  const s = GAME_OVER.shots;
  const span = (from: number, to: number) => Math.max(0, Math.min(1, (t - from) / (to - from)));
  if (t < s.dusk) return { shot: 'dark', k: span(0, s.dusk) };
  if (t < s.letters) return { shot: 'dusk', k: span(s.dusk, s.letters) };
  if (t < s.unravel) return { shot: 'letters', k: span(s.letters, s.unravel) };
  if (t < s.loom) return { shot: 'unravel', k: span(s.unravel, s.loom) };
  return { shot: 'loom', k: span(s.loom, GAME_OVER.fallS) };
}

/** The moments sound starts in the fall: the bell with GAME OVER, her music with the loom. */
export const FALL_CUES = { bellS: GAME_OVER.shots.letters, musicS: GAME_OVER.shots.loom } as const;
