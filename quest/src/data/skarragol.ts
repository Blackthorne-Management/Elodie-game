// Ordvik and the Winter Plateau (Chapter 6, The Stolen Standard; docs/quest/reviews/2026-10-21-chapter6-outline.md with
// its second review): where things stand on the six maps (tools/maps/skarragol.ts draws them) and the conditions both
// the maps and the scenes (data/dialogue/skarragol.ts) read, in one place so the staging and the maps never disagree.

import type { Condition } from '../engine/conditions.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The day's three required things done (S-5, S-3 and the debate): dusk on the fair, and the fjord path opens. */
export const HORN_DAY = 'side.grandson.done, side.winter_stores.done, debate.skarragol_oath.settled';
export const HORN_DAY_DONE: Condition = {
  all: [{ flag: 'side.grandson.done' }, { flag: 'side.winter_stores.done' }, { flag: 'debate.skarragol_oath.settled' }],
};
/**
 * Dusk on the fair, the plateau and the quay (a condition, not a flag: whichever of the three finishes last brings
 * the evening, the review's 3.11); it ends at dawn, when the party comes round the fjord's head with the standard.
 */
export const FAIR_DUSK: Condition = { all: [HORN_DAY_DONE, { notFlag: 'story.standard_home' }] };

/**
 * The fjord path opens once the party has set out at dusk (the scene plays at the path once the three are done), or
 * once it is already across (a save on the ice never sticks).
 */
export const FJORD_OPEN = 'story.fjord_set_out|story.fjord_crossed';

export const PLATEAU = {
  w: 46,
  h: 30,
  /** The road in from the Seat (north) and on to the fair (west). */
  spawn: at(8, 1),
  fairExit: at(0, 15),
  herder: at(34, 16),
  foldsGate: at(30, 15),
  store: at(36, 26),
  /** S-3's Echo zone, in front of the store (x, y, w, h). */
  zone: { x: 35, y: 22, w: 3, h: 3 },
  /** The gully mouth (the boulder wall, two tiles high) and the slope boulder in the memory. */
  gully: at(40, 22),
  boulder: at(41, 21),
  stone: at(36, 5),
  oldHerder: at(31, 6),
  salkhi: at(28, 16),
} as const;

export const FAIR = {
  w: 46,
  h: 30,
  eastGate: at(45, 15),
  quayLane: at(10, 0),
  fjordPath: at(42, 0),
  mootDoor: at(22, 9),
  sagaDoor: at(6, 7),
  /** The empty standard pole before the Moot Tent (the first thing the camera finds). */
  pole: at(24, 12),
  envoy: at(34, 8),
  champion: at(36, 8),
  rail: at(8, 20),
  skyRider: at(31, 21),
  witness: at(35, 21),
  crier: at(27, 14),
  surveyor: at(11, 4),
  food: at(12, 20),
  furrier: at(16, 20),
  horseTrader: at(20, 20),
  board: at(28, 13),
  salkhi: at(25, 11),
  dawn: at(42, 3),
} as const;

export const MOOT = {
  w: 36,
  h: 26,
  door: at(17, 25),
  seat: at(17, 1),
  innerPole: at(20, 2),
  torvald: at(17, 3),
  lawspeaker: at(14, 3),
  hrafn: at(21, 5),
  jarl: at(13, 5),
  envoy: at(29, 5),
  chest: at(31, 2),
  bayarmaa: at(16, 9),
  riderA: at(15, 9),
  riderB: at(16, 10),
  hornMaster: at(16, 22),
  grimvald: at(15, 21),
  hides: at(2, 1),
  plunder: at(30, 18),
  /** The row across the aisle where the Moot's scenes play as the party walks up it, near the chieftain. */
  sceneRow: 6,
} as const;

export const QUAY = {
  w: 28,
  h: 14,
  fair: at(10, 13),
  surveyor: at(6, 8),
  jarl: at(19, 8),
  ship: at(20, 2),
  salkhi: at(16, 9),
  spawn: at(20, 6),
} as const;

/**
 * The frozen fjord (SIG-SKA): six Echo zones, the floes solid in both eras (x, y, w, h), from the near shore to the
 * far. Between them each stretch is walkable in exactly one era: ice in the memory (1, 3, 5), floes now (2, 4).
 */
export const FJORD = {
  w: 40,
  h: 34,
  spawn: at(6, 31),
  zones: [
    { x: 5, y: 26, w: 3, h: 2 },
    { x: 5, y: 21, w: 3, h: 2 },
    { x: 16, y: 21, w: 3, h: 2 },
    { x: 16, y: 16, w: 3, h: 2 },
    { x: 27, y: 16, w: 3, h: 2 },
    { x: 27, y: 12, w: 3, h: 2 },
  ],
  /** The far shore's last ice (the crossing done) and the raid's row on the grounded floe (the memory). */
  crossedRow: 14,
  raidRow: 13,
  westGap: at(9, 8),
  eastGap: at(27, 4),
  picket: at(12, 5),
  blackHorse: at(23, 2),
  tentDoor: at(18, 2),
  sarnai: at(26, 11),
  campRow: 3,
} as const;

/** The herd on the far shore: six horses, each with its place before the whistle, after the first, after the second. */
export const HERD: readonly { id: string; a: P; b: P; c: P }[] = [
  { id: 'herd_1', a: at(14, 10), b: at(5, 9), c: at(29, 6) },
  { id: 'herd_2', a: at(16, 9), b: at(6, 10), c: at(30, 6) },
  { id: 'herd_3', a: at(18, 10), b: at(7, 9), c: at(31, 6) },
  { id: 'herd_4', a: at(20, 9), b: at(4, 10), c: at(28, 7) },
  { id: 'herd_5', a: at(22, 10), b: at(5, 11), c: at(29, 7) },
  { id: 'herd_6', a: at(24, 9), b: at(7, 11), c: at(31, 7) },
];

// ---- Built Oct 27 (the owner, Oct 27: the side quests once after the release): S-1, S-2's race and S-4 ------------------

/** The dawn after the price, until the longship sails: the fair is quiet, and Bayarmaa rides with the envoy. */
export const ORDVIK_DAWN: Condition = { all: [{ flag: 'ally.skarragol' }, { notFlag: 'act6.complete' }] };

/**
 * S-1 Salkhi Has Opinions: the three wrongs. The foal outside the folds' rail and its mother inside (the plateau); the
 * rival horse in the trader's corral (the fair); the horse-trader's tack for the saddle that pinches (the fair).
 */
export const OPINIONS = {
  foalOut: at(29, 14),
  foalIn: at(31, 15),
  mother: at(31, 14),
  rival: at(4, 24),
  /** Where Salkhi stands to stare the rival down (outside the corral's rail). */
  rivalRail: at(11, 24),
} as const;

/** S-2's race: the race judge by the corral, the start line, and the course once round the field. */
export const RACE = {
  judge: at(12, 23),
  start: at(13, 26),
  course: [at(28, 27), at(28, 18), at(13, 18), at(13, 26)],
} as const;

/**
 * S-4 The Cairn of Nine Riders (SECRET-ITEMS.md 6, PUZZLES.md S-SKA): the nine cairns round the flat stone on the high
 * ground, numbered clockwise from the north path; the riders' bridle goes under the seventh (where the Mare's eye stands
 * at the third horn, seen from the stone). The Echo zone is the snow round the stone.
 */
export const CAIRNS: readonly P[] = [at(35, 2), at(37, 2), at(39, 3), at(40, 5), at(39, 7), at(37, 8), at(35, 8), at(33, 7), at(33, 3)];
export const CAIRN_ANSWER = 7;
export const SIGHTING = {
  stone: PLATEAU.stone,
  zone: { x: 34, y: 3, w: 5, h: 5 },
  sarnai: at(33, 5),
  rider: at(32, 6),
} as const;
/** Where each cairn is used from (the snow inside the ring, or beside it). */
export const CAIRN_FRONT: readonly P[] = [at(35, 3), at(37, 3), at(38, 3), at(39, 5), at(38, 7), at(37, 7), at(35, 7), at(34, 7), at(34, 3)];
/**
 * The sky in the memory, a step at a time (the Echo's turning sky as a conversation: every wait turns it one step; a horn
 * blows at 4, 8 and 12; the riders ride out after 14). Over which cairn each shape stands: the Mare (nine stars round a
 * bright tenth, her eye), the Ox (seven stars in a yoke) and the Ship (five, a hull and a mast).
 */
export const SKY_STEPS = 15;
export const HORNS: readonly number[] = [4, 8, 12];
const ring = (n: number): number => ((((n - 1) % 9) + 9) % 9) + 1;
export function skyAt(step: number): { mare: number; ox: number; ship: number; between: boolean } {
  const q = Math.floor(step / 4);
  return { mare: ring(4 + q), ox: ring(1 + 3 * q), ship: ring(9 - 2 * q), between: step % 4 !== 0 };
}
