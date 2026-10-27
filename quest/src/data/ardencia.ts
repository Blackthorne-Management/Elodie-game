// Cenizal, Ardencia (Chapter 3, The Trial of Blades): the places and conditions of the three side quests built Oct 27
// for the Nov 22 release (the owner, Oct 27; docs/quest/design/SIDE-QUESTS.md Ar-3, Ar-4 and Ar-5, SECRET-ITEMS.md 5):
// The Elders' Feast, The Old Lord's Errand (secret: La Promesa de Benny, the letter) and The Arrows Missed. The maps
// (tools/maps/ardencia.ts) and the scenes (data/dialogue/ardenciaQuests.ts) read them from here, so the staging and
// the maps never disagree.

import type { Condition } from '../engine/conditions.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });
const f = (flag: string): Condition => ({ flag });

/** The day's three required things (Ar-1, Ar-2 and the debate): the morning of the trial, until Azzy says noon. */
export const TRIAL_MORNING: Condition = {
  all: [
    f('side.treasurer.done'),
    f('side.bread.done'),
    { any: [f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] },
    { notFlag: 'story.noon' },
  ],
};

// ---- Ar-3 The Elders' Feast ----------------------------------------------------------------------------------------

/**
 * The feast: the contract board on the Upper Town's plaza, the elders' hall in the Alcázar (its door, where the guard
 * stands, and the table), Elder Ferrán's house on the plaza (its grey door: his strongroom), the hall's salt-tax book
 * in the records room.
 */
export const FEAST = {
  board: at(22, 13),
  /** The elders' hall's door from the hall of audience (two tiles high), where the hired guard stands. */
  hallDoor: at(10, 6),
  /** Where Gianna stands guard, inside the door, and where the servants lay the dishes. */
  guardPost: at(9, 7),
  table: [at(3, 7), at(5, 7), at(7, 7)],
  /** Elder Ferrán (the first of the three seats). */
  ferran: at(3, 5),
  /** His house: the grey door in its front wall (tools/maps/painter.ts addClosedDoors puts it there). */
  ferranDoor: at(5, 4),
  ferranStep: at(5, 5),
  taxBook: at(23, 2),
} as const;

export const FEAST_FLAGS = {
  accepted: 'side.feast.accepted',
  heard: 'side.feast.heard',
  tally: 'item.ferran_tally',
  book: 'clue.salt_tax',
  fear: 'side.feast.fear',
  influence: 'side.feast.influence',
  done: 'side.feast.done',
} as const;

// ---- Ar-4 The Old Lord's Errand (S-ARD: the cloister in two eras) ------------------------------------------------------

/**
 * The chapel cloister under the Alcázar (24 x 16, interior): the stair in from the sitting room (west, on the south
 * walk), the three walks round a garth (south, east, north), Benny's crypt off the north walk, and Benny's own stair
 * from the crypt up to his quiet rooms. Every walk is an Echo zone, so the player can step between the eras anywhere on
 * it. Rael's guards keep three places now; Benny's honor guard kept two others fifty years ago (the night of the march).
 */
export const CHAPEL = {
  w: 24,
  h: 16,
  /** The stair in from the Alcázar (two tiles high, west wall) and where the party arrives. */
  door: at(0, 12),
  gate: at(1, 12),
  /** The walks (x, y, w, h), each an Echo zone. */
  south: { x: 1, y: 12, w: 20, h: 2 },
  east: { x: 19, y: 4, w: 2, h: 8 },
  north: { x: 5, y: 4, w: 14, h: 2 },
  /** The crypt (x 5 to 10, y 1 to 2) and its doorway off the north walk (two tiles: the bolt's housing and the gap). */
  crypt: { x: 5, y: 1, w: 6, h: 2 },
  bolt: at(7, 3),
  doorway: at(8, 3),
  /** The niche at the crypt's east end, where the promise lies. */
  niche: at(10, 1),
  bennyYoung: at(9, 2),
  /** Benny's own stair, in the crypt's west wall, up to his quiet rooms. */
  stair: at(4, 1),
  well: at(10, 9),
} as const;

/** A guard and the strip of walk he looks across (two tiles: the walk's width). */
export interface Watch {
  id: string;
  era: 'present' | 'echo';
  /** Where he stands (an alcove off the walk) and the way he looks. */
  at: P;
  facing: 'up' | 'down' | 'left' | 'right';
  /** The strip he sees (x, y, w, h). */
  strip: { x: number; y: number; w: number; h: number };
}

/**
 * The five watches along the way from the stair to the crypt, in the order the walk meets them: now, then, now, then,
 * now. Each strip is seen in one era only, so the way across is five swaps: into the memory before the well, out before
 * the arch, in before the third, out on the east walk, in before the north arch; the crypt is open in the memory.
 */
export const WATCHES: readonly Watch[] = [
  { id: 'well', era: 'present', at: at(5, 11), facing: 'down', strip: { x: 5, y: 12, w: 1, h: 2 } },
  { id: 'arch', era: 'echo', at: at(10, 14), facing: 'up', strip: { x: 10, y: 12, w: 1, h: 2 } },
  { id: 'third', era: 'present', at: at(15, 11), facing: 'down', strip: { x: 15, y: 12, w: 1, h: 2 } },
  { id: 'east', era: 'echo', at: at(21, 9), facing: 'left', strip: { x: 19, y: 9, w: 2, h: 1 } },
  { id: 'north', era: 'present', at: at(14, 3), facing: 'down', strip: { x: 14, y: 4, w: 1, h: 2 } },
];

/** The guard who keeps a watch (an NPC of his own: Rael's guards now, Benny's honor guard then). */
export const watchGuard = (w: Watch): string => `${w.era === 'present' ? 'chapel_guard' : 'honor_guard'}_${w.id}`;

export const ERRAND = {
  accepted: 'side.old_errand.accepted',
  /** Young Benny has asked Patricio to jam the bolt (the memory; kept, like the floor's tune). */
  asked: 'clue.crypt_bolt',
  anchor: 'anchor.crypt_bolt',
  promise: 'item.benny_promise',
  /** Times seen (1 to 5): Anissa's hints come at 1, 3 and 5 (SECRET-ITEMS.md: the third waits). */
  seen: 'side.old_errand.seen',
  done: 'side.old_errand.done',
} as const;

/** The way across, as Anissa's last hint gives it. */
export const ERRAND_HINTS: readonly string[] = [
  'The guards now and the guards then do not stand in the same places, Gigi.',
  'Where a guard of now is looking, be in the memory. Where a guard of then is looking, be now.',
  'Into the memory before the well. Out before the arch. In before the third guard. Out on the east walk. In before the north arch.',
];

// ---- Ar-5 The Arrows Missed ----------------------------------------------------------------------------------------

/** The strand camp (Chapter 3's end, Chapter 4's first light): two more of Azzy's company by the tents. */
export const CAMP = {
  soldierD: at(4, 6),
  soldierE: at(16, 10),
  /** Where Azzy stands to answer (placed: he walks with the party) and where Gianna finds him. */
  azzy: at(11, 9),
} as const;

/** The five Gianna asks; three saw the shots land wide (a, d, e). */
export const ARROW_SOLDIERS = ['a', 'b', 'c', 'd', 'e'] as const;
