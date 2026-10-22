// Kirinoura, Kuroshi (Chapter 7, The Fog Files; docs/quest/reviews/2026-10-21-chapter7-outline.md with its second
// review): where things stand on the seven maps (tools/maps/kuroshi.ts draws them) and the conditions both the maps
// and the scenes (data/dialogue/kuroshi.ts) read, in one place so the staging and the maps never disagree.

import type { Condition } from '../engine/conditions.ts';
import type { RotorDef } from '../engine/rotor.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The day's two required things (K-2 The Spy Ledger and the debate on the middle bridge) before the lantern hour. */
export const LANTERN_DAY_DONE: Condition = { all: [{ flag: 'side.spy_ledger.done' }, { flag: 'debate.kuroshi_silence.settled' }] };
/**
 * Dusk on the quarter, the pier and the Hall (a condition, not a flag: whichever of the two finishes last brings the
 * lantern hour, the Chapter 6 review's 3.11 rule); it ends at dawn, when the Fox is beaten (story.quarter_dawn).
 */
export const QUARTER_DUSK: Condition = { all: [LANTERN_DAY_DONE, { notFlag: 'story.quarter_dawn' }] };
/** The Hall's gate opens at the lantern hour (or once Haru has been met: a save in the Hall never sticks). */
export const HALL_OPEN = 'side.spy_ledger.done|story.haru_met, debate.kuroshi_silence.settled|story.haru_met';
/** The night: from the lantern hour until dawn (the maze and the marsh are walked in the dark and the fog). */
export const NIGHT: Condition = { all: [{ flag: 'story.haru_met' }, { notFlag: 'story.quarter_dawn' }] };

export const PIER = {
  w: 28,
  h: 14,
  stair: at(12, 0),
  spawn: at(13, 11),
  puddle: at(13, 7),
  /** The lantern pile Haru steps behind (sighting 1), and the row that plays it. */
  pile: at(16, 6),
  sightRow: 8,
  harbourMaster: at(8, 6),
  launch: at(9, 11),
  ship: at(16, 11),
  salkhi: at(19, 6),
  teaStall: at(21, 3),
} as const;

export const QUARTER = {
  w: 42,
  h: 30,
  /** The stair down to the pier (south edge), the Hall's gate (north edge), the maze's gate, the marsh road. */
  pier: at(12, 29),
  hallGate: at(19, 0),
  mazeGate: at(34, 0),
  marshGate: at(41, 2),
  library: at(5, 10),
  /** The row before the main bridge, where the gate guard stops envoys (and calls the lantern hour). */
  gateRow: 6,
  gateGuard: at(22, 2),
  /** The tea house screen (sighting 2) and the row along the west bank that plays it. */
  screen: at(16, 17),
  screenRow: 18,
  /** The debate corner on the middle bridge (canal M), the speakers on its top row. */
  keeper: at(26, 11),
  whisperer: at(27, 11),
  fisherWoman: at(37, 2),
  fisherBoy: at(38, 2),
  tea: at(31, 8),
  paper: at(35, 8),
  armourer: at(38, 12),
  board: at(23, 8),
  sayoHouse: at(5, 3),
  salkhi: at(33, 16),
  /** Where the Crown's observer crosses: from the east end of the south bank of the north canal, over the main bridge. */
  observerFrom: at(40, 6),
} as const;

export const LIBRARY = {
  w: 22,
  h: 14,
  door: at(10, 13),
  kayla: at(9, 5),
  desk: at(9, 6),
  /** The Echo zone in front of Kayla's desk (x, y, w, h): Sayo's clerk at the same desk, fifty years ago. */
  zone: { x: 8, y: 8, w: 3, h: 1 },
  librarian: at(3, 10),
  elder: at(13, 3),
  /** The sealed stacks: the partition (x 15), its paper seal, the high window over the reading tables. */
  seal: at(15, 10),
  window: at(15, 3),
  /** The cutpurses at work, facing the shelves; the strip in front of them is where they would see you. */
  cutpurses: [at(18, 4), at(18, 6), at(18, 8)],
  sightX: 19,
  sightRows: [2, 9] as const,
  /** The nine glyph shelves on the stacks' east wall (x 20, rows 2 to 10); the ledger's is the last. */
  stackX: 20,
  stackTop: 2,
  ledgerShelf: 8,
} as const;

/** The shelves in the sealed stacks: two glyphs and a row each (the rule: crane for the Crown, pine for the war, the row for the years). */
export const STACK_SHELVES: readonly { glyphs: string; row: number; holds: string }[] = [
  { glyphs: 'a crane and a plum', row: 1, holds: 'Crown tax rolls from before the Revolution.' },
  { glyphs: 'a crane and a pine', row: 1, holds: 'Crown troop counts from the Revolution. Sayo\'s hand, in the margins.' },
  { glyphs: 'a bamboo and a pine', row: 1, holds: 'The houses\' own war rolls from the Revolution. Not the Crown\'s.' },
  { glyphs: 'a crane and a plum', row: 2, holds: 'Crown tariffs from the long peace. Dull, and very thorough.' },
  { glyphs: 'a bamboo and a plum', row: 2, holds: 'Fishing rights from the long peace.' },
  { glyphs: 'a crane and a bamboo', row: 2, holds: 'Crown marriages from the long peace. Somebody has underlined one.' },
  { glyphs: 'a bamboo and a pine', row: 3, holds: 'The houses\' own war rolls from the Ash Wars.' },
  { glyphs: 'a crane and a plum', row: 3, holds: 'Crown tariffs from the Ash Wars years.' },
  { glyphs: 'a crane and a pine', row: 3, holds: 'A thick ledger bound in grey: the Crown\'s war, in the Ash Wars years.' },
];

export const HALL = {
  w: 36,
  h: 26,
  door: at(17, 25),
  kaede: at(17, 1),
  table: at(17, 2),
  /** The row across the corridor where the Hall's scenes play as the party walks up it. */
  sceneRow: 6,
  neutral: at(13, 3),
  war: at(22, 3),
  signalMaster: at(25, 8),
  observer: at(5, 9),
  broker: at(7, 9),
  teaBowl: at(6, 8),
  shoes: at(21, 8),
  records: at(2, 14),
  keeper: at(32, 16),
  order: at(33, 13),
  fileDoor: at(35, 17),
  foxBound: at(16, 10),
  haruScreen: at(22, 6),
} as const;

export const FILEHOUSE = {
  w: 22,
  h: 16,
  front: at(10, 15),
  back: at(0, 13),
  /** Sayo's wall map (west wall) and the Echo zone in front of it. */
  map: at(1, 7),
  zone: { x: 2, y: 7, w: 1, h: 3 },
  sayo: at(3, 5),
  stone: at(10, 2),
  stackRow: 2,
  lanesRow: 3,
  /** The 3 x 3 grid of pivoting screens, row by row (index 4 is the centre, the loose one). */
  screens: [at(6, 6), at(10, 6), at(14, 6), at(6, 9), at(10, 9), at(14, 9), at(6, 12), at(10, 12), at(14, 12)],
} as const;

/**
 * The file house's screens (PUZZLES.md SIG-KUR part 2; engine/rotor.ts). Pegged (the anchor), north, east, east, south
 * opens the lanes; unpegged, the centre slips back east after every push and they never open (the review's 3.1, fix a).
 */
export const SCREENS: RotorDef = {
  id: 'screens',
  width: 3,
  height: 3,
  start: [3, 3, 1, 0, 1, 2, 3, 3, 1],
  peg: { index: 4, flag: 'anchor.screen_peg', rest: 1 },
  solved: 'rotor.screens.solved',
};
/** The pushes that solve it once pegged, by screen index (north, east, east, south). */
export const SCREENS_SOLUTION: readonly number[] = [1, 5, 5, 7];

/** The fog maze: six plazas (centres), each entered from the south; the way on from each, in order. */
export type Turn = 'left' | 'straight' | 'right';
export const MAZE = {
  w: 30,
  h: 30,
  gate: at(14, 29),
  /** The gate yard (x, y, w, h), its Echo zone (Anissa holds the door) and the far gap onto the marsh. */
  yard: { x: 9, y: 26, w: 12, h: 3 },
  zone: { x: 13, y: 27, w: 3, h: 1 },
  gap: at(17, 0),
  plazas: [at(15, 23), at(10, 19), at(10, 13), at(16, 9), at(22, 5), at(17, 2)],
  route: ['left', 'straight', 'right', 'right', 'left', 'straight'] as readonly Turn[],
} as const;

/** The lantern code (Sayo's, PUZZLES.md SIG-KUR part 1): three posts read left to right. */
export const CODE: Readonly<Record<Turn, readonly ('white' | 'red')[]>> = {
  left: ['white', 'white', 'red'],
  straight: ['white', 'white', 'white'],
  right: ['white', 'red', 'red'],
};

export const MARSH = {
  w: 46,
  h: 28,
  maze: at(5, 27),
  quarter: at(0, 14),
  tower: at(45, 14),
  /** The fishers' yard by the huts, the press, the old fisher and the boy. */
  oldFisher: at(16, 14),
  boy: at(18, 13),
  press: at(20, 13),
  /** The six marsh posts: the fork's three (north of the yard) and the bend's three (south of it). */
  posts: [at(21, 12), at(22, 12), at(23, 12), at(21, 16), at(22, 16), at(23, 16)],
  fog: at(26, 14),
  boats: [at(15, 16), at(17, 16)],
  salkhi: at(7, 15),
} as const;
/** The marsh posts lit for "left, then right": the fork two white and a red, the bend one white and two red. */
export const MARSH_CODE: readonly ('white' | 'red')[] = [...CODE.left, ...CODE.right];
