// Agnipur, Jwaladesh (Chapter 8, The Dying Flame; docs/quest/reviews/2026-10-22-chapter8-outline.md with its second
// review): where things stand on the six maps (tools/maps/jwaladesh.ts draws them) and the conditions both the maps
// and the scenes (data/dialogue/jwaladesh.ts) read, in one place so the staging and the maps never disagree.

import type { Condition } from '../engine/conditions.ts';
import type { MeasuresDef } from '../engine/secrets.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The day's three required things (J-2 The Lamp Relay, J-3 The Anonymous Oil and the spice row's debate). */
export const DAY_DONE: Condition = {
  all: [{ flag: 'side.lamp_relay.done' }, { flag: 'side.anonymous_oil.done' }, { flag: 'debate.jwaladesh_hesitation.settled' }],
};
/** The same, as map condition text. */
export const DAY_DONE_TEXT = 'side.lamp_relay.done, side.anonymous_oil.done, debate.jwaladesh_hesitation.settled';
/**
 * Night on Agnipur (a condition, not a flag: whichever of the three finishes last brings the night lamp's hour, the
 * second review's 3.10 rule); it ends at dawn, when Seth Dhanraj has been beaten.
 */
export const NIGHT: Condition = { all: [DAY_DONE, { notFlag: 'story.dhanraj_beaten' }] };
/** Dawn at the Court, after the store (the price), until the chapter ends. */
export const DAWN: Condition = { all: [{ flag: 'story.dhanraj_beaten' }, { notFlag: 'act8.complete' }] };

/** The roof mirrors (SIG-JWA part 2): a flag per facing; south is none of them. The way round the tower. */
export type Facing = 'e' | 'n' | 'w' | 's';
export const MIRROR_SOLUTION: readonly Facing[] = ['e', 'n', 'n'];
/** A mirror's facing flag (south has none). */
export const mirrorFlag = (n: number, f: Exclude<Facing, 's'>): string => `mirror.${n}_${f}`;
/** Whether this mirror faces `f`, as condition text. */
export function facingText(n: number, f: Facing): string {
  if (f === 's') return `!${mirrorFlag(n, 'e')}, !${mirrorFlag(n, 'n')}, !${mirrorFlag(n, 'w')}`;
  return mirrorFlag(n, f);
}
/** All three roof mirrors set round the tower: east, north, north. */
export const MIRRORS_RIGHT: Condition = { all: MIRROR_SOLUTION.map((f, i) => ({ flag: mirrorFlag(i + 1, f as Exclude<Facing, 's'>) })) };
/** Both anchors carried back from Arjun's night: the chain lamp lit, the tower mirror bolted. */
export const ANCHORS: Condition = { all: [{ flag: 'anchor.chain_lamp' }, { flag: 'anchor.tower_mirror' }] };

export const HARBOR = {
  w: 34,
  h: 22,
  /** The stair up to the bazaar (north edge), the landing off the Zetwal trader, the trader's hull. */
  stair: at(16, 0),
  landing: at(16, 13),
  ship: at(15, 15),
  /** The row up the quay where the crowd at the stair's head is met (Vikram's first sighting). */
  sightRow: 4,
  /** The chain tower's yard (x, y, w, h: walls on its edge), its gate, the lamp, the capstan, the watchtower's bracket. */
  tower: { x: 1, y: 3, w: 9, h: 8 },
  gate: at(5, 10),
  lamp: at(3, 4),
  capstan: at(6, 4),
  bracket: at(8, 5),
  spareMirror: at(7, 8),
  /** The lamp's platform (the Echo zone, x, y, w, h) and Arjun at the stair head beside it. */
  zone: { x: 3, y: 6, w: 3, h: 1 },
  arjun: at(6, 6),
  /** The row in front of the gate where Aiyana opens it at night. */
  gateRow: 11,
  aiyana: at(9, 11),
  towerEnforcer: at(2, 11),
  /** The great chain across the harbor mouth, the mole, the Crown's hulls in the memory. */
  chainRow: 17,
  chainFrom: 9,
  chainTo: 25,
  mole: { x: 26, y: 14, w: 2, h: 7 },
  /** Dhanraj's oil store (x, y, w, h: its roof on the top row), its doors, the enforcers at them, the factor's launch. */
  store: { x: 23, y: 2, w: 10, h: 8 },
  storeDoors: at(27, 9),
  storeEnforcers: [at(26, 10), at(29, 10)],
  launch: at(30, 15),
  strongbox: at(31, 4),
  balanceLock: at(24, 4),
  /** The sea-wall lane under the north wall (row 1), shut by a stack of jars until the runners' way is known. */
  laneJars: at(12, 1),
  /** The night watch's strip across the open quay (x, rows). */
  watchX: 12,
  watchRows: [3, 13] as const,
  harbourMaster: at(20, 10),
  salkhi: at(22, 12),
  /** Where the party stands as the chapter ends (the trader's gangway). */
  endRow: 12,
} as const;

export const BAZAAR = {
  w: 44,
  h: 30,
  /** The Court's doors (north edge), the harbor stair (south edge), the salt gate (east edge). */
  court: at(21, 0),
  harbor: at(21, 29),
  saltGate: at(43, 14),
  library: at(8, 13),
  /** The relay starts at the stair's head; the runners' hall is on the temple steps' plaza. */
  stairHead: at(21, 27),
  chiefRunner: at(13, 2),
  runners: [at(16, 1), at(17, 1)],
  hallBracket: at(12, 1),
  hearth: at(12, 3),
  /** The runners' hearth (the minor Echo's zone, x, y, w, h). */
  zone: { x: 13, y: 3, w: 3, h: 1 },
  /** The gust strips across the main street (x, y, w): the lamp goes out there. */
  gusts: [at(20, 20), at(20, 8)],
  /** The arch on the west wall lane (the runners' way: left at the dyers, through the arch, along the wall). */
  arch: at(2, 21),
  /** The dyers' roof (Aiyana's), its outside stair from the dyers' lane, its mirror bracket, the ladder up. */
  roof: { x: 10, y: 21, w: 6, h: 2 },
  roofStair: at(12, 23),
  aiyana: at(11, 21),
  dyerMirror: at(10, 21),
  ladder: at(14, 20),
  /** The spice row's debate corner, the shrine child, the vendors, the boards, the Exchange's tower. */
  keeper: at(30, 17),
  pilgrim: at(31, 17),
  shrineChild: at(38, 17),
  shrine: at(39, 16),
  milk: at(13, 16),
  beads: at(16, 16),
  sword: at(34, 13),
  board: at(19, 13),
  priceBoard: at(26, 13),
  tower: { x: 24, y: 7, w: 6, h: 6 },
  /** The bazaar's four rooftop mirrors, turned down (seen from the lanes). */
  downMirrors: [at(9, 7), at(32, 7), at(36, 20)],
  salkhi: at(41, 15),
} as const;

export const ROOFTOPS = {
  w: 30,
  h: 18,
  ladder: at(3, 17),
  /** The three mirrors the player turns, and the rusted fourth bracket where Anissa holds the disc. */
  mirrors: [at(6, 13), at(16, 13), at(16, 7)],
  bracket4: at(16, 1),
  anissaSpot: at(16, 2),
  aiyana: at(17, 1),
  window: at(1, 1),
  /** The Exchange's tower in the old line. */
  tower: { x: 4, y: 4, w: 5, h: 7 },
} as const;

export const LIBRARY = {
  w: 22,
  h: 14,
  door: at(10, 13),
  librarian: at(3, 10),
} as const;

export const COURT = {
  w: 36,
  h: 28,
  door: at(17, 27),
  /** The wick-window, the altar (2 x 2) and its curtain, the ruler's seat. */
  window: at(17, 1),
  altar: at(17, 2),
  meera: at(16, 5),
  keeper: at(20, 5),
  junior: at(15, 9),
  chamberlain: at(19, 8),
  vikram: at(20, 11),
  /** The row across the colonnade where the Court's scenes play as the party walks up it. */
  sceneRow: 14,
  /** The envoys' pavilion: the Crown's factor and his guest. */
  factor: at(6, 9),
  guest: at(8, 9),
  treasuryBook: at(3, 15),
  records: at(25, 6),
  /** The duel yard (x, y, w, h), its centre, and the back gate's kitchen lane. */
  yard: { x: 24, y: 14, w: 10, h: 11 },
  yardCentre: at(28, 19),
  backGate: at(1, 23),
  carter: at(3, 24),
  foxKneel: at(17, 22),
  craneStep: at(19, 4),
} as const;

// ---- Built Oct 27 (the owner, Oct 27: the side quests once after the release): J-1 and J-4 -------------------------------

/**
 * J-4 Oil for the Little Lamps (S-JWA): the oil store's floor fifty years ago (the Echo zone, x, y, w, h), the lamp-maker
 * at his jars, the three jars (10, 7 and 3 measures) and the reservoir that takes one pour and seals. Now the store's
 * back door is the balance lock (HARBOR.balanceLock); the shrine child's dark shrine is on the spice row (BAZAAR.shrine).
 */
export const OIL_STORE = {
  zone: { x: 26, y: 7, w: 3, h: 1 },
  lampMaker: at(27, 5),
  jars: [at(29, 5), at(30, 5), at(31, 5)],
  reservoir: at(25, 5),
  /** Where the roll call is answered: the store's doorway. */
  door: at(27, 8),
} as const;

/** The measures (SECRET-ITEMS.md 4): pour 10, 7 and 3 until the 7 holds five, then the 7 into the reservoir. */
export const WICK_MEASURES: MeasuresDef = { id: 'wick', caps: [10, 7, 3], start: [10, 0, 0], target: 5, anchor: 'anchor.reservoir_sealed' };
/** The eight pours that leave five in the 7 jar (jar indices), then the 7 into the reservoir. */
export const WICK_POURS: readonly (readonly [number, number | 'r'])[] = [
  [0, 1],
  [1, 2],
  [2, 0],
  [1, 2],
  [2, 0],
  [1, 2],
  [0, 1],
  [1, 2],
  [1, 'r'],
];

/** J-1 Win Every Argument: the three who out-argued Vikram while he was out of breath, at dawn. */
export const ARGUERS = {
  spice: at(26, 17),
  dyer: at(6, 24),
  wrestler: at(27, 3),
} as const;

export const FLATS = {
  w: 46,
  h: 28,
  gate: at(0, 13),
  roadRows: [13, 14] as const,
  roadEnd: 41,
  carter: at(41, 12),
  cart: at(42, 13),
  shrine: at(43, 11),
  oilCart: at(20, 20),
  den: at(30, 4),
} as const;
