// Eightgate again (Chapter 12, The Claim, and the Epilogue, The Hearing; docs/quest/reviews/2026-10-22-chapter12-epilogue-
// outline.md with every fix of its second review, 2026-10-22-chapter12-epilogue-outline-review.md, its "Decisions after the
// second review" and the owner's two decisions of Oct 22): where things stand on the Chapter 5 maps this chapter reuses and
// on Elodie's rooms, the conditions the maps (tools/maps/seat.ts) and the scenes (data/dialogue/seatClaim.ts) both read,
// and the tables written once: the companies at their gates, the houses' chairs and tokens, the Hearing's witnesses. The
// night, the bell, the Claim, the Hearing and the ending are conditions, not flags a scene must remember (the Chapter 6,
// 10 and 11 reviews' rule).

import type { Condition } from '../engine/conditions.ts';
import type { StabilityHouses } from '../engine/stability.ts';
import { LAYLA } from './dialogue/aldoria.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

// ---- The conditions ----------------------------------------------------------------------------------------------------

/** Chapter 12 has begun (Chapter 11's card closed at the Ardencia Gate). */
export const CH12_TEXT = 'act11.complete';
/** Before the bell: the Hall shut, the Concourse at dusk and by night. */
export const EVE_TEXT = 'act11.complete, !story.bell_claim';
/** The night, after Mother's rooms: the chamberlain's lantern on the Hall's steps. */
export const NIGHT_TEXT = 'story.elodie_rooms, !story.bell_claim';
/** The Hall at the bell, until the Claim stands. */
export const DAWN_TEXT = 'story.bell_claim, !story.claim_won';
/** From the bell until the Hearing is called (the houses' people in the Hall). */
export const CLAIM_DAY_TEXT = 'story.bell_claim, !story.hearing_called';
/** Nine days later: the Hearing's morning and the Hall at noon, until the verdict. */
export const HEARING_TEXT = 'story.hearing_called, !hearing.verdict';
/** The afternoon after the verdict, and the realm after the end. */
export const AFTER_TEXT = 'hearing.verdict';

/** "Until the bell" (the outline section 6): the corner settled, the tokens handed to the Master of the Chairs, Volume One taken. */
export const BELL_READY: Condition = {
  all: [{ flag: 'debate.seat_claim.settled' }, { flag: 'side.seats.handed' }, { flag: 'side.volume_one.accepted' }],
};
/** What the Master of the Chairs still waits for, worded from the flags (the gate on the map). */
export const BELL_PARTS: readonly { flag: string; left: string }[] = [
  { flag: 'debate.seat_claim.settled', left: 'The corner is still at it. A Claim hears the city first.' },
  { flag: 'side.seats.handed', left: 'The chairs are bare, envoy\'s household. A bare chair is a house that was not asked.' },
  { flag: 'side.volume_one.accepted', left: 'Your mother has a book for you, I am told. She asked me to say so. Twice.' },
];

// ---- The houses ----------------------------------------------------------------------------------------------------------

/** The four houses that could sail to the Crown at the Muster (Chapter 10's flank houses). */
export const FLANK: readonly string[] = ['skarragol', 'kuroshi', 'jwaladesh', 'al_doria'];

/** A house that sailed to the Crown at the Muster (its chair is bare at the Claim). Only a flank house can. */
export function betrayed(house: string): Condition {
  if (!FLANK.includes(house)) throw new Error(`${house} cannot be bought at the Muster`);
  return { all: [{ flag: 'muster.betrayed' }, { flag: `muster.betrayer.${house}` }] };
}

/** A house that sits at the Claim: never bought (Xaraguá, which nobody could buy, always sits). */
export function sits(house: string): Condition | undefined {
  return FLANK.includes(house) ? { not: betrayed(house) } : undefined;
}

/**
 * The chairs a token fills (Se-5): the token, who carries it in the party and hands it to the Master of the Chairs on the
 * Hall's steps by night (the second review's 3.3: he keeps the tokens and sets each on its chair the day someone stands
 * on the tile, as he promised in Chapter 5), and their line. Al-Doria's seal comes from Layla at the bell when the Muster
 * gave none (Chapter 10's rule: "at the Claim by Layla if Al-Doria is kept").
 */
export interface TokenChair {
  house: string;
  name: string;
  item: string;
  /** The companion who hands it over (a stage actor of the party). */
  carrier: string;
  line: string;
  /** The answer this house gives the petition at the Claim (from behind its chair). */
  answer: string;
  /** Who answers for the house (a speaker id). */
  speaker: string;
}
export const TOKEN_CHAIRS: readonly TokenChair[] = [
  { house: 'xaragua', name: 'Xaraguá', item: 'token_xaragua', carrier: 'yari', line: 'Mine to carry. Mine to set down, after all.', answer: 'Xaraguá: breach. We were never asked to sign it.', speaker: 'yari' },
  { house: 'al_doria', name: 'Al-Doria', item: 'token_dorini', carrier: 'samira', line: 'Mama paid on time. Of course she did.', answer: LAYLA.claimAnswer, speaker: LAYLA.speaker },
  { house: 'skarragol', name: 'Skarragol', item: 'token_ironvow', carrier: 'bayarmaa', line: 'Grandmother\'s standard has a chair.', answer: 'Skarragol: breach. The Ironvow keep their word, and this was not one.', speaker: 'bayarmaa' },
  { house: 'kuroshi', name: 'Kuroshi', item: 'token_suzumori', carrier: 'haru', line: 'Mother folded this. She folds when she is deciding something.', answer: 'Kuroshi: breach. We counted the pages. There were six.', speaker: 'haru' },
  { house: 'jwaladesh', name: 'Jwaladesh', item: 'token_agnivansh', carrier: 'vikram', line: '...It\'s still lit. Aiyana filled it.', answer: 'Jwaladesh: breach. Under the flame.', speaker: 'vikram' },
];

/** A token chair is set at the bell when its token was handed over and its house did not sail to the Crown. */
export function chairSet(c: TokenChair): Condition {
  const kept = sits(c.house);
  const held: Condition = c.house === 'al_doria' ? kept! : { flag: `item.${c.item}` };
  return kept ? { all: [held, kept] } : held;
}

/** Stability's houses (engine/stability.ts): the four flank houses and the token chairs. */
export const STABILITY_HOUSES: StabilityHouses = {
  flank: FLANK,
  tokenChairs: TOKEN_CHAIRS.map((c) => c.house),
};

/**
 * The companies at their gates on the Concourse (the outline 4.1: no army enters the Hall; a placed pair at each house's
 * gate by army.*, one captain's line each). Positions are inside the ring wall beside each gate.
 */
export interface GateCompany {
  army: string;
  captain: { look: string; at: P; facing: 'up' | 'down' | 'left' | 'right'; line: string; speaker: string; name: string };
  soldier: { look: string; at: P; facing: 'up' | 'down' | 'left' | 'right' };
}
export const GATE_COMPANIES: readonly GateCompany[] = [
  {
    army: 'free_brasador',
    captain: { look: 'joaquin_free', at: at(32, 2), facing: 'down', line: 'Free Brasador holds the north gate. Nobody comes in behind you that the Compact doesn\'t name.', speaker: 'joaquin_muster', name: 'Tío Joaquin' },
    soldier: { look: 'free_brasador', at: at(35, 1), facing: 'down' },
  },
  {
    army: 'zetwal',
    captain: { look: 'zetwal_levy', at: at(43, 1), facing: 'down', line: 'Zetwal\'s levy. The Harbor councillor said stand at our own gate and look like we meant it.', speaker: 'levy', name: 'Zetwal levy' },
    soldier: { look: 'zetwal_levy', at: at(46, 1), facing: 'down' },
  },
  {
    army: 'skarragol',
    captain: { look: 'horn_rider', at: at(46, 25), facing: 'left', line: 'The horses are outside the wall. They do not like walls. Neither do we.', speaker: 'horn_rider', name: 'Horn-rider' },
    soldier: { look: 'horn_rider', at: at(46, 28), facing: 'left' },
  },
  {
    army: 'al_doria',
    captain: { look: 'dorini_marine', at: at(46, 15), facing: 'left', line: 'The Dorini stand by the Gold Gate\'s road. The guild bills the Throne for the standing.', speaker: 'dorini_marine', name: 'Dorini marine' },
    soldier: { look: 'dorini_marine', at: at(46, 18), facing: 'left' },
  },
  {
    army: 'kuroshi',
    captain: { look: 'gate_guard_kq', at: at(30, 32), facing: 'up', line: 'We count who comes in, envoy. Tonight it is mostly you.', speaker: 'gate_guard_kq', name: 'Suzumori guard' },
    soldier: { look: 'gate_guard_kq', at: at(33, 32), facing: 'up' },
  },
  {
    army: 'jwaladesh',
    captain: { look: 'flame_keeper', at: at(7, 32), facing: 'up', line: 'The lamp came with us from the ship. It is lit at the gate tonight.', speaker: 'flame_keeper', name: 'Flame Keeper' },
    soldier: { look: 'flame_keeper', at: at(10, 32), facing: 'up' },
  },
  {
    army: 'aldermoor',
    captain: { look: 'watch_inside_out', at: at(1, 15), facing: 'right', line: 'The captain says the law goes where she goes. Tonight it stands at the Crown\'s own gate.', speaker: 'watch_turned', name: 'The watch' },
    soldier: { look: 'watch_inside_out', at: at(1, 18), facing: 'right' },
  },
];

// ---- The places ----------------------------------------------------------------------------------------------------------

/** The Eight Gates Concourse (48 x 34, Chapter 5's): the Ardencia Gate, the fountain, the Hall's steps, the gates. */
export const CONCOURSE = {
  arrive: at(33, 1),
  /** Elodie in the gate's arch, the Crown's clerk behind her (beat 0). */
  elodie: at(33, 5),
  elodieStop: at(33, 3),
  clerk: at(35, 6),
  quarterLane: at(23, 32),
  /** The Hall's steps by night: the Master of the Chairs with his lantern, four Sealbearers. */
  chamberlain: at(25, 7),
  stepsSealbearers: [at(20, 6), at(21, 7), at(26, 7), at(27, 6)],
  /** Where the companions stand to hand him the tokens, in turn. */
  handOver: at(25, 8),
  /** Jordyn at the fountain's rim (by night). */
  jordyn: at(22, 20),
  /** The corner's debate after the Harbor Turn (the fountain): the Gaze keeper, the Quiet Crown follower, the Witness priest. */
  debateGaze: at(21, 16),
  debateFollower: at(25, 16),
  debateWitness: at(21, 18),
  /** The gates (inside the ring wall). */
  zetwalGate: at(44, 1),
  aldermoorGate: at(1, 16),
  xaraguaGate: at(14, 1),
  ardenciaGate: at(33, 1),
  /** Old Patricio walks in through Zetwal's gate at the bell and stops on the steps. */
  patricioStop: at(24, 9),
  /** The Hearing's morning: the party in front of the Hall, the arrivals from four gates. */
  hearingMorning: at(23, 9),
} as const;

/** Elodie's rooms (seat-rooms, 14 x 10, new): Zetwal's rooms at the Seat. */
export const ROOMS = {
  door: at(7, 9),
  spawn: at(7, 8),
  elodieDesk: at(4, 3),
  elodieMeet: at(6, 6),
  azzyDoor: at(8, 7),
  shelf: at(10, 1),
  lamp: at(2, 2),
} as const;

/** The Throne Hall (44 x 32, Chapter 5's): the dais, the tile, the chairs on row 8, the nave, the bench and the gallery. */
export const HALL = {
  nave: at(21, 29),
  door: at(21, 30),
  /** The Throne tile (21 to 22, 2 to 3): the claim's step trigger is its lower row; the ending's spawn its upper. */
  tile: at(21, 3),
  tileTop: at(21, 2),
  /** The dais's step (the rope's row once it is gone): Gianna at the Hearing. */
  step: at(22, 5),
  foot: at(21, 6),
  /** The Regent on the dais's step beside the tile; down the heralds' stair from (26, 2). */
  regent: at(23, 4),
  stair: at(26, 2),
  /** On Strike Hale stands behind him (yielded on the pier); Thorne on the dais's edge if spared to the Patience. */
  hale: at(25, 3),
  thorne: at(17, 3),
  ropeSealbearers: [at(15, 6), at(28, 6)],
  /** Elodie walks the claimant to the rope's line and no further; Anissa beside her. */
  elodieRope: at(20, 6),
  anissaRope: at(19, 6),
  /** The four who walk up when the Regent calls his seals (the second review's 3.3). */
  fighters: [at(20, 3), at(23, 3), at(20, 4)],
  anissaFoot: at(19, 4),
  /** The houses' doors at the bell (CHAMBERS) and their places behind the chairs (row 9) once they fill. */
  elodieDoor: at(2, 11),
  clerkDoor: at(2, 12),
  rosalindDoor: at(41, 11),
  laylaDoor: at(2, 23),
  bennyDoor: at(2, 19),
  behind: {
    zetwal: at(14, 9),
    xaragua: at(16, 9),
    ardencia: at(18, 9),
    al_doria: at(20, 9),
    aldermoor: at(23, 9),
    skarragol: at(25, 9),
    kuroshi: at(27, 9),
    jwaladesh: at(29, 9),
  },
  edmund: at(24, 9),
  samira: at(19, 10),
  anissaChair: at(13, 9),
  /** The Master of the Chairs at the rope's end with the register; old Patricio near Zetwal's chair. */
  chamberlain: at(26, 7),
  patricio: at(12, 10),
  patricioChair: at(17, 9),
  /** The Echo zone: south of the eighth chair, below the row its people stand on (the review's 3.8: the chair is solid). */
  echoZone: { x: 15, y: 10, w: 3, h: 2 },
  /** Hollis comes in by the Hall's door with the petition and walks the nave (the Hall has one door: 3.8). */
  hollis: at(25, 10),
  /** The clerk's table and its register; Rael kneels at the nave below the dais; Jordyn behind him. */
  clerkTable: at(24, 10),
  rael: at(21, 10),
  jordynBehind: at(21, 11),
  rivera: at(20, 12),
  jaime: at(22, 12),
  bennyBehind: at(21, 13),
  /** The witnesses' bench (x 12 to 15, row 11) and the gallery (x 26 to 31, rows 13 to 15): one screen with the dais. */
  bench: { x: 11, y: 11, w: 4 },
  witnessSpot: at(23, 11),
  gallery: { x: 26, y: 13, w: 6, h: 3 },
  /** The ending's afternoon: Gianna on the tile. */
  afternoon: at(21, 2),
  doorsInside: at(21, 29),
  /** Echo-era (forty-nine years ago): the chamberlain of that day at his plan, the Throne's clerk, the masons at Xaraguá's door. */
  echoPlanTable: at(24, 13),
  echoChamberlain: at(25, 13),
  echoClerk: at(26, 14),
  echoMason: at(2, 16),
  echoCaona: at(3, 14),
  echoBenny: at(4, 14),
  /** The chairs that day: seven in a cluster in the nave, one by the door being bricked (the plan's "eighth"). */
  echoCluster: [at(9, 18), at(10, 18), at(11, 18), at(12, 18), at(9, 20), at(10, 20), at(11, 20)],
  echoXaraguaChair: at(2, 14),
} as const;

/** Where each witness stands on the bench's side before and after speaking (two rows of four). */
export const BENCH_SPOTS: readonly P[] = [at(12, 12), at(13, 12), at(14, 12), at(15, 12), at(12, 13), at(13, 13), at(14, 13), at(15, 13)];
/** The gallery's placed people (the Concourse's own, by the outline 14.1). */
export const GALLERY_SPOTS: readonly P[] = [at(26, 13), at(27, 13), at(28, 13), at(29, 13), at(30, 13), at(27, 14), at(28, 14), at(29, 14), at(30, 14)];
