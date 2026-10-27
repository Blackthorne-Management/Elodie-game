// Kingsmere, Aldermoor (Chapter 9, The Regent's Keep; docs/quest/reviews/2026-10-22-chapter9-outline.md with its second
// review's fixes): where things stand on the five maps (tools/maps/aldermoor.ts draws them) and the conditions both the
// maps and the scenes (data/dialogue/aldermoor.ts) read, in one place so the staging and the maps never disagree.

import type { Condition } from '../engine/conditions.ts';
import type { ClockDef } from '../engine/secrets.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The day's required things (Al-3 The Purge List, the debate) and the two people met (Jordyn's offer, Sebastian). */
export const DAY_DONE: Condition = {
  all: [{ flag: 'side.purge_list.done' }, { flag: 'debate.aldermoor_one_hand.settled' }, { flag: 'story.sebastian_met' }, { flag: 'story.jordyn_offer' }],
};
/** The same, as map condition text. */
export const DAY_DONE_TEXT = 'side.purge_list.done, debate.aldermoor_one_hand.settled, story.sebastian_met, story.jordyn_offer';
/**
 * The eve of the Assize (a condition, not a flag: the outline section 6 with the Chapter 6 review's 3.11): the four
 * done and the recital not begun. The lamps are lit on the square and the court walks to St. Agatha's.
 */
export const EVE: Condition = { all: [DAY_DONE, { notFlag: 'story.recital_begun' }] };
export const EVE_TEXT = `${DAY_DONE_TEXT}, !story.recital_begun`;
/** The keep by night: from the Toccata's first chord until the party is caught. */
export const KEEP_NIGHT: Condition = { all: [{ flag: 'story.recital_begun' }, { notFlag: 'story.caught' }] };
/** The last dawn (the rain stops): the Hushed beaten, until the chapter ends. */
export const LAST_DAWN: Condition = { all: [{ flag: 'story.hushed_beaten' }, { notFlag: 'act9.complete' }] };
/** Rain on the outdoor maps, from the landing until the last dawn (a wash, not a layer: the second review's 3.11). */
export const RAIN: Condition = { all: [{ flag: 'story.aldermoor_arrived' }, { notFlag: 'story.hushed_beaten' }] };
/** Everything the archive must give before the party may leave it (the second review's 3.6). */
export const ARCHIVE_DONE_TEXT = 'clue.crown_pact, anchor.thomas_record, side.crown_chronicle.done';
export const ARCHIVE_NOT_DONE_TEXT = '!clue.crown_pact|!anchor.thomas_record|!side.crown_chronicle.done';

/**
 * The archive's cabinets (SIG-ALM part 1): six, one a decade of the Old King's reign; each has a year dial and a seal
 * switch (flags with values, set and read as data). The Accord's year is 23; the mirror is 32; the house the lie is
 * about is Brasador (red).
 */
export const SEALS = ['violet', 'red', 'gold', 'teal', 'green', 'grey'] as const;
export type Seal = (typeof SEALS)[number];
/** The cabinet (1 to 6) that holds a year. */
export const cabinetOf = (year: number): number => Math.floor((year - 1) / 10) + 1;
/** A cabinet's dial and seal flags: the dial is the year within the decade (0 to 9), the seal an index into SEALS. */
export const dialFlag = (n: number): string => `archive.c${n}.year`;
export const sealFlag = (n: number): string => `archive.c${n}.seal`;
/** The pact's drawer: the Accord's year mirrored, under the house the lie is about. */
export const PACT_DRAWER = { year: 32, seal: 'red' as Seal };
export const HONEST_DRAWER = { year: 23, seal: 'red' as Seal };

export const HEATH = {
  w: 46,
  h: 28,
  /** The mere (west edge, columns 0 to 3), the landing at the Mere Stair's foot, the trader's boat. */
  mereTo: 3,
  landing: { x: 4, y: 11, w: 3, h: 6 },
  stair: at(5, 13),
  boat: at(1, 13),
  /** The board the party steps onto to sail home (the column at the water's edge). */
  boardX: 4,
  /** The heath road (rows 13 and 14) east to the Moor Gate. */
  roadRows: [13, 14] as const,
  /** The fishermen's shed, and the Crown notice post at the stair's head. */
  shed: { x: 7, y: 8, w: 4, h: 3 },
  notice: at(8, 12),
  milestone: at(24, 12),
  /** The printing barn north of the road (walls; its yard below), the press, the drying sheets, the printer. */
  barn: { x: 16, y: 3, w: 7, h: 4 },
  barnDoor: at(19, 6),
  yard: { x: 16, y: 7, w: 7, h: 6 },
  press: at(17, 8),
  sheets: at(21, 8),
  printer: at(19, 9),
  apprentices: [at(17, 10), at(21, 10)],
  /** The bog chapel south of the road (a roofless Witness chapel), the causeway to it, the cell inside. */
  chapel: { x: 24, y: 19, w: 7, h: 6 },
  causewayX: 27,
  chapelGap: at(27, 19),
  /** The tile at the causeway's end where the cell's veils turn (the fight). */
  chapelStep: at(27, 18),
  veils: [at(26, 21), at(28, 21)],
  hound: at(27, 23),
  /** The Moor Gate's towers (east edge), its gate, its Sealbearer, the escort's place beside it. */
  gate: at(45, 13),
  gateStrip: 37,
  gateSealbearer: at(40, 12),
  escorts: [at(38, 12), at(38, 15)],
  salkhi: at(6, 16),
  trader: at(4, 11),
} as const;

export const CROSS = {
  w: 42,
  h: 30,
  /** The square of wet flags, and the road south to the Moor Gate. */
  square: { x: 4, y: 6, w: 34, h: 21 },
  south: at(20, 29),
  /** On the square's head: St. Agatha's west door, the close's gate, the keep's gatehouse. */
  cathedral: at(7, 5),
  closeGate: at(13, 5),
  keep: at(20, 5),
  /** The Rolls House on the east side. */
  rolls: at(38, 12),
  /** The stone cross in the middle; the debate corner beside it. */
  cross: at(20, 14),
  hierarch: at(24, 13),
  exile: at(24, 16),
  /** The vendors on the west side (pie shop, jeweller, outfitter), the board, the corners' constables. */
  pieSeller: at(4, 9),
  jeweller: at(4, 15),
  outfitter: at(4, 20),
  board: at(17, 7),
  constables: [at(6, 7), at(35, 7)],
  /** The three warned families' doors (Al-3): the pie shop, the tea shop with the shut door, the sorry constable's. */
  pieDoor: at(3, 11),
  teaDoor: at(32, 5),
  constableDoor: at(38, 22),
  teaShop: at(28, 5),
  /** The press-gang's strip (the party walking up from the Moor Gate) and the court's walk strip (the eve). */
  pressRow: 24,
  pressFrom: 15,
  pressTo: 26,
  courtWalk: { x: 4, y: 8, w: 9, h: 1 },
  salkhi: at(34, 25),
} as const;

export const ROLLS = {
  w: 22,
  h: 14,
  door: at(10, 13),
  keeper: at(16, 6),
} as const;

export const KEEP = {
  w: 40,
  h: 30,
  /** The archive (top left), its iron door into the hall, the cabinets, the gallery desk, the Ash Wars shelf, the panel. */
  archive: { x: 1, y: 1, w: 18, h: 5 },
  archiveDoor: at(10, 6),
  cabinets: [at(2, 1), at(4, 1), at(6, 1), at(8, 1), at(10, 1), at(12, 1)],
  desk: at(14, 1),
  panel: at(17, 1),
  ashShelf: at(17, 2),
  thomas: at(15, 2),
  /** The filing floor (the archive's Echo zone: the first revisiting). */
  zone: { x: 3, y: 3, w: 12, h: 2 },
  archiveIn: at(10, 5),
  /** The postern in the hall's north wall, out to the close (its own map: aldermoor-close). */
  postern: at(30, 6),
  /** The great hall: the Regent's dais, the council, the watch's station, the passage to the yard. */
  hall: { x: 1, y: 7, w: 38, h: 9 },
  dais: at(20, 8),
  regent: at(20, 8),
  almoner: at(20, 7),
  council: [at(27, 9), at(27, 10), at(27, 11), at(27, 12)],
  chamberlain: at(17, 13),
  jordyn: at(23, 15),
  archiveSealbearer: at(10, 7),
  audienceRow: 14,
  /** The night: the Sealbearers at their posts and the strips their lamps reach (the dark row behind the pillars is safe). */
  nightSealbearers: [at(23, 12), at(4, 13)],
  sightlines: [
    { x: 18, y: 8, w: 5, h: 7 },
    { x: 5, y: 8, w: 4, h: 7 },
  ],
  passage: at(20, 16),
  clockDoor: at(36, 6),
  officeDoor: at(3, 6),
  postOffice: at(14, 6),
  /** The courtroom (bottom left): the bench, the clerk's table and the clerk, the oath-block, the dock, the gallery. */
  court: { x: 1, y: 17, w: 15, h: 12 },
  courtDoor: at(13, 16),
  courtDoorWatch: at(13, 17),
  bench: { x: 3, y: 17, w: 7, h: 2 },
  courtRegent: at(6, 17),
  courtSealbearers: [at(4, 18), at(8, 18)],
  table: at(4, 20),
  clerk: at(7, 20),
  oath: at(2, 21),
  witnessAlmoner: at(2, 24),
  courtRosalind: at(12, 19),
  courtMagistrate: at(12, 21),
  courtJordyn: at(10, 23),
  dock: { x: 6, y: 23, w: 3, h: 2 },
  dockSpawn: at(7, 24),
  gallery: [at(3, 26), at(5, 26), at(9, 26), at(11, 26), at(13, 26)],
  /** The yard and the keep's gate to the square. */
  yard: { x: 17, y: 17, w: 9, h: 12 },
  gate: at(21, 29),
  /** The cells (the undercroft, bottom right): one cell behind bars, its bench, the corridor. */
  cell: { x: 29, y: 19, w: 5, h: 5 },
  cellBench: at(30, 19),
  cellSpawn: at(31, 21),
} as const;

/**
 * The close (its own small outdoor map, Claude's call: the hall and the close share no path, so the arrow and the doors
 * must see them apart): wet flagstones between the keep's north wall and St. Agatha's south wall; the bell post; the
 * gate to the square; the vestry door into the church; the postern into the keep's hall.
 */
export const CLOSE = {
  w: 18,
  h: 7,
  gate: at(17, 3),
  vestry: at(9, 0),
  postern: at(9, 6),
  bell: at(4, 2),
  offerStrip: 15,
} as const;

export const CATHEDRAL = {
  w: 26,
  h: 18,
  west: at(12, 17),
  vestry: at(25, 6),
  organ: { x: 9, y: 1, w: 6, h: 3 },
  console: at(11, 4),
  sebastian: at(12, 4),
  oathStone: at(11, 7),
  verger: at(21, 6),
  sceneRow: 14,
} as const;

// ---- Built Oct 27 (the owner, Oct 27: the side quests once after the release): Al-1, Al-4 and Al-5 ----------------------

/** Al-1 Terribly Sorry: the five Edmund has hit, where each takes his letter (by day, or at the last dawn). */
export const LETTERS = {
  sergeant: at(8, 25),
  constable: at(36, 8),
  bandit: at(30, 10),
  goose: at(12, 15),
  footman: at(33, 9),
} as const;
/** Where the five stand while their letter waits: by day, or at the last dawn (never the night, the court or the cells). */
export const LETTERS_OUT_TEXT = 'side.sorry.accepted, !story.recital_begun|story.hushed_beaten, !act9.complete';

/**
 * The clock tower (Al-4, S-ALM; its own small map behind the keep's clock door, Claude's call as for the close): the stair
 * up from the hall, the great clock's face on the north wall with Agatha's vault behind it, the winding key and the
 * escapement beside it, the sill where Thomas left a spare quill fifty years ago, and the Echo zone on the boards.
 */
export const CLOCK_TOWER = {
  w: 12,
  h: 10,
  door: at(6, 9),
  spawn: at(6, 8),
  face: at(5, 1),
  winder: at(5, 2),
  vault: at(7, 1),
  sill: at(9, 3),
  zone: { x: 5, y: 5, w: 3, h: 1 },
} as const;
/** The clockmaker at the last dawn, on the square by the keep's gate. */
export const CLOCKMAKER_DAWN = at(23, 7);

/**
 * The tower clock (SECRET-ITEMS.md 7; engine/secrets.ts). It reads 11:10 when the memory opens and must be stopped on 2:45
 * (215 minutes on); the gears move it 5, 7 or 12 a turn; twelve turns to a spring, ten seconds to rewind; the watchman
 * climbs after ninety. 12 x 12, rewind, 5 x 12 (214), pull the key, one tick, the quill: 28 seconds.
 */
export const TOWER_CLOCK: ClockDef = {
  id: 'tower',
  start: 11 * 60 + 10,
  target: 2 * 60 + 45,
  gears: [5, 7, 12],
  spring: 12,
  rewindSecs: 10,
  watchmanAt: 90,
  anchor: 'anchor.clock_stopped',
};

/** Rosalind's Townhouse (Al-5; 18 x 12): her door on the square's north side, her tea table, Thomas's portrait. */
export const TOWNHOUSE = {
  w: 18,
  h: 12,
  door: at(9, 11),
  spawn: at(9, 10),
  rosalind: at(9, 4),
  table: at(10, 4),
  portrait: at(9, 1),
  maid: at(14, 6),
} as const;
export const TOWNHOUSE_DOOR = at(24, 5);
