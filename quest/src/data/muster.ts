// Pòdlimyè at the Muster (Chapter 10, The Muster; docs/quest/reviews/2026-10-22-chapter10-outline.md with its second
// review's fixes): where things stand on the Zetwal maps this chapter reuses and on the one it adds (the mill's cellar),
// and the conditions both the maps (tools/maps/zetwal-*.ts) and the scenes (data/dialogue/zetwalMuster.ts) read, in one
// place so the staging and the maps never disagree. The day, the dusk, the night and the dawn are conditions, not
// flags a scene must remember (the Chapter 6 review's 3.11; the Chapter 10 review's 3.11 partitions them).

import type { Condition } from '../engine/conditions.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The day: from the landing until the council votes. */
export const DAY_TEXT = 'story.muster_begun, !story.council_voted';
export const DAY: Condition = { all: [{ flag: 'story.muster_begun' }, { notFlag: 'story.council_voted' }] };
/** Dusk: the council has voted (the chain went up), until the whistle's inspection is done. */
export const DUSK_TEXT = 'story.council_voted, !story.inspection_done';
export const DUSK: Condition = { all: [{ flag: 'story.council_voted' }, { notFlag: 'story.inspection_done' }] };
/** Night: the inspection done, until the betrayal is seen at the harbor. */
export const NIGHT_TEXT = 'story.inspection_done, !story.betrayal_seen';
export const NIGHT: Condition = { all: [{ flag: 'story.inspection_done' }, { notFlag: 'story.betrayal_seen' }] };
/** Dawn: the betrayal seen, until the fleet sails (the card). */
export const DAWN_TEXT = 'story.betrayal_seen, !act10.complete';
export const DAWN: Condition = { all: [{ flag: 'story.betrayal_seen' }, { notFlag: 'act10.complete' }] };
/** The day and the dusk (the camps on the plaza, before the lines are drawn up or the fires banked). */
export const BEFORE_NIGHT_TEXT = 'story.muster_begun, !story.inspection_done';

/** The three feuds at the Muster (data/debates.ts), each a required mediation (the outline 7.3). */
export const FEUDS = ['zetwal_feud_merchants', 'zetwal_feud_temple', 'zetwal_feud_crown'] as const;
/** "Until the allies are seated" (the outline section 6): the three feuds settled, Z-6 and Z-3 done. */
export const SEATED: Condition = {
  all: [...FEUDS.map((f) => ({ flag: `debate.${f}.settled` })), { flag: 'side.muskets.done' }, { flag: 'side.lonely_cutter.done' }],
};
/** What the Speaker still waits for, worded from the flags (the gate on the map). */
export const SEATED_PARTS: readonly { flag: string; left: string }[] = [
  { flag: 'debate.zetwal_feud_merchants.settled', left: 'The Ironvow and the Dorini are still shouting about a convoy in the Iron Market.' },
  { flag: 'debate.zetwal_feud_temple.settled', left: 'The grey ones and the saffron ones will not stand on one island.' },
  { flag: 'debate.zetwal_feud_crown.settled', left: 'Nobody in Accord Square will sit with Kingsmere\'s people.' },
  { flag: 'side.muskets.done', left: 'There are Crown muskets in the cane, and you are the envoy.' },
  { flag: 'side.lonely_cutter.done', left: 'The cutter\'s boy is still at the mill.' },
];

/**
 * The four road houses the Crown can buy, and who plays each part of the night (written once, from this table: the
 * second review's section 7). `captain` is the house's man (his NPC look and speaker), `second` the house's own
 * second who turns it on the exposed route, `companion` the party member of that house who defies it a second time
 * (STORY 6.9), `ship` the house's hull at the Old Harbor, `look` the company's soldiers.
 */
export interface MusterHouse {
  house: string;
  captain: string;
  captainLook: string;
  second: string;
  secondLook: string;
  companion: string;
  look: string;
  ship: string;
}
export const MUSTER_HOUSES: readonly MusterHouse[] = [
  { house: 'skarragol', captain: 'hrafn', captainLook: 'hrafn', second: 'lawspeaker_rider', secondLook: 'horn_rider', companion: 'bayarmaa', look: 'horn_rider', ship: 'muster_ship_ironvow' },
  { house: 'kuroshi', captain: 'muster_retainer', captainLook: 'retainer_neutral', second: 'signal_master', secondLook: 'signal_master', companion: 'haru', look: 'gate_guard_kq', ship: 'muster_ship_suzumori' },
  { house: 'jwaladesh', captain: 'agnivansh_steward', captainLook: 'agnivansh_steward', second: 'junior_priest', secondLook: 'junior_priest', companion: 'vikram', look: 'flame_keeper', ship: 'muster_ship_agnivansh' },
  { house: 'al_doria', captain: 'dorini_admiral', captainLook: 'dorini_admiral', second: 'layla_clerk', secondLook: 'dorini_scribe', companion: 'samira', look: 'dorini_marine', ship: 'muster_ship_dorini' },
];

// ---- The Old Harbor (zetwal-harbor, 36 x 18) ----------------------------------------------------------------------
export const HARBOR = {
  /** The long pier's landing (the built spawn harbor_return) and the pier's head. */
  landing: at(30, 13),
  pierHead: at(30, 11),
  /** The tide's step at dawn (the pier, above the landing). */
  tide: { x: 30, y: 12, w: 2, h: 1 },
  /** The harbor road (row 4) and the door east to the plaza. */
  roadRow: 4,
  plazaDoor: at(35, 4),
  /** The houses' hulls by day, at the piers (3 x 1 each), and at dawn in a line inside the harbor mouth (row 15). */
  ships: {
    muster_ship_ironvow: at(8, 12),
    muster_ship_suzumori: at(12, 13),
    muster_ship_agnivansh: at(19, 13),
    muster_ship_dorini: at(27, 12),
    muster_ship_zetwal: at(32, 12),
  } as Record<string, P>,
  dawnShips: {
    muster_ship_ironvow: at(2, 15),
    muster_ship_suzumori: at(6, 15),
    muster_ship_agnivansh: at(10, 15),
    muster_ship_dorini: at(14, 15),
    muster_ship_zetwal: at(19, 15),
  } as Record<string, P>,
  /** Jordyn's coaster (from the watch's landing). */
  coaster: at(22, 15),
  /** The harbor chain across the harbor mouth (row 16, from the map's edge to the long pier). */
  chain: { x: 0, y: 16, w: 30, h: 1 },
  /** Under the point, outside the chain (the second review's 3.8): the Crown's launch on the west strip, the consul on the quay. */
  launch: at(0, 6),
  consul: at(2, 6),
  captain: at(3, 6),
  strongbox: at(2, 5),
  satchel: at(3, 7),
  laid: at(4, 6),
  /** The quay's head: where the party stops at night (a line across the road and the quay west of the fish market). */
  quayStrip: { x: 7, y: 3, w: 1, h: 6 },
  /** Where the party stands as the night plays (stage walks for the house's people end beside it). */
  watchFrom: at(8, 4),
  /** The signal fire on Solèy Heights, seen over the trees at the map's top edge. */
  fire: at(31, 0),
  /** People on the quay. */
  patricio: at(29, 10),
  anicette: at(28, 10),
  rahel: at(33, 10),
  patricia: at(34, 10),
  jordyn: at(26, 10),
  joaquin: at(24, 10),
  trader: at(31, 14),
  sailor: at(17, 13),
  kid: at(20, 8),
} as const;

// ---- The Festival Plaza (zetwal-town, 40 x 28): the camp ---------------------------------------------------------
export const PLAZA = {
  /** The harbor lane's foot (the door south-west to the Old Harbor) and the steps north to Accord Square. */
  harborLane: at(8, 22),
  harborDoor: at(0, 23),
  squareSteps: at(18, 1),
  westLane: at(1, 10),
  eastGate: at(38, 19),
  bridgehead: at(29, 10),
  /** Free Brasador by the fountain (black coats, the sashes torn off): Joaquin and the sergeant. */
  joaquin: at(16, 12),
  sergeant: at(19, 12),
  /** The Ironvow at the east gate: the camp's quartermaster (gifts), the horses, Salkhi. */
  ironvowCamp: at(34, 21),
  horses: [at(35, 21), at(36, 21)],
  salkhi: at(32, 21),
  /** The Suzumori under the stage's west end, the Agnivansh at its east end: fourteen tiles apart. */
  suzumoriCamp: at(11, 6),
  suzumoriPole: at(11, 5),
  agnivanshCamp: at(25, 6),
  agnivanshLamp: at(25, 5),
  /** The Dorini on the west lane: the table, the admiral (Rashid by role), the marines. */
  doriniTable: at(6, 9),
  admiral: at(7, 9),
  /** Jordyn's company at the plaza's south-east edge, with nobody near them. */
  jordyn: at(24, 14),
  watch: [at(23, 14), at(25, 14)],
  printer: at(22, 14),
  /** The Marshal's stone (12, 8) and where old Patricio stands by it. */
  stone: at(12, 8),
  patricioStone: at(11, 8),
  /** The stage's foot, where Patricio stands at dusk and the whistle is blown. */
  stageFoot: at(17, 5),
  /** Where the party gathers at the fountain for the inspection (the Echo's crowd is the camp's). */
  fountainEdge: at(17, 9),
  /** The dusk lines, by company (two of each and their captain; the dissidents last and fewest). */
  lines: {
    zetwal: [at(15, 6), at(16, 6), at(19, 6), at(20, 6)],
    free_brasador: [at(14, 8), at(15, 8)],
    skarragol: [at(21, 8), at(22, 8)],
    kuroshi: [at(13, 13), at(14, 13)],
    jwaladesh: [at(21, 13), at(22, 13)],
    al_doria: [at(15, 14), at(16, 14)],
    aldermoor: [at(20, 14)],
  } as Record<string, readonly P[]>,
  /** Each captain's place in the lines at dusk (and where his walk starts at night). */
  captains: { skarragol: at(23, 8), kuroshi: at(12, 13), jwaladesh: at(23, 13), al_doria: at(14, 14) } as Record<string, P>,
  jordynLine: at(19, 14),
  joaquinLine: at(13, 8),
  rahelDusk: at(20, 10),
  patriciaDusk: at(20, 11),
  /** The plaza's paving (the night's first step on it starts the walk). */
  paving: { x: 10, y: 5, w: 16, h: 11 },
} as const;

// ---- Accord Square, the Hall, the Iron Market, the Temple island, the house, the Cane Road ------------------------
export const SQUARE = { printer: at(15, 13), sergeant: at(19, 13), statueFront: at(17, 14) } as const;
export const HALL = {
  speaker: at(7, 5),
  chancellor: at(9, 5),
  doveSeat: at(3, 8),
  hawkSeat: at(10, 8),
  chamberDoor: at(13, 9),
} as const;
export const MARKET = { clerk: at(16, 9), hrafn: at(19, 9), crates: at(15, 8), horse: at(20, 8) } as const;
export const TEMPLE = {
  lamp: at(14, 3),
  patricia: at(13, 3),
  rahel: at(12, 4),
  retainer: at(17, 4),
  steward: at(18, 5),
  /** The lamp's step, where the crane and the brass lamp are set down side by side when the second feud is seated. */
  crane: at(14, 4),
  brassLamp: at(15, 4),
  /** The temple's door (the party comes in here). */
  door: at(14, 7),
} as const;
export const HOUSE = { door: at(5, 10), table: at(3, 4), anicette: at(5, 4), rahelSeat: at(2, 5), accounts: at(4, 4) } as const;
export const ROAD = {
  cutter: at(6, 10),
  crates: at(23, 18),
  /** The cart track's foot at the mangroves, where the crew stands in front of its cache (a line the party walks onto). */
  crewStep: { x: 24, y: 16, w: 2, h: 1 },
  chief: at(24, 18),
  smuggler: at(25, 18),
  lookouts: [at(22, 17), at(27, 17)],
  /** The mill's cellar door (in the burned mill's north wall), and Ti Jak by the cold hearth. */
  millDoor: at(37, 2),
  tiJak: at(34, 3),
  gate: at(1, 12),
} as const;

// ---- The mill's cellar (zetwal-mill, 14 x 10, new): M-ZET-2 -------------------------------------------------------
export const MILL = {
  w: 14,
  h: 10,
  stair: at(7, 9),
  spawn: at(7, 8),
  /** The inner door to the second cache (2 x 1 in the wall row), its bar and pin in the memory. */
  innerDoor: { x: 6, y: 3, w: 2, h: 1 },
  /** The cellar floor that shimmers (the Echo zone; the bar is on its north edge). */
  zone: { x: 4, y: 4, w: 6, h: 2 },
  zoneTile: at(6, 4),
  powderMaster: at(3, 5),
  lantern: at(2, 6),
  crates: at(10, 6),
} as const;
