// Yucayeque at war (Chapter 11, The War of the Harbor; docs/quest/reviews/2026-10-22-chapter11-outline.md with every fix
// of its second review, 2026-10-22-chapter11-outline-review.md, and the owner's decision of Oct 22: on Strike, Azzy
// stays): where things stand on the nine Chapter 2 maps this chapter reuses, the conditions the maps
// (tools/maps/xaragua.ts) and the scenes (data/dialogue/xaraguaWar.ts) both read, and the companies' table (written
// once: who answers the whistle, who lands, who stands in the camp). The day, the dusk and the night are conditions, not
// flags a scene must remember (the Chapter 6 and 10 reviews' rule).

import type { Condition } from '../engine/conditions.ts';
import type { Company } from '../engine/war.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The war: from the landing on the Canoe Beach (the landing's trigger sets it). */
export const WAR_TEXT = 'story.war_begun';
export const WAR: Condition = { flag: 'story.war_begun' };
/** The day on the hill: landed, until the conch calls the tide. */
export const WAR_DAY_TEXT = 'story.war_begun, !story.tide_called';
/** Dusk: the tide called, until the harbor is taken (both routes set story.harbor_taken: the second review's 3.5). */
export const WAR_DUSK_TEXT = 'story.tide_called, !story.harbor_taken';
/** The war is over (Trust or Strike): the free city's evening, the vendors back, the ambushes quiet. */
export const HARBOR_TAKEN_TEXT = 'story.harbor_taken';
export const HARBOR_TAKEN: Condition = { flag: 'story.harbor_taken' };
/** The war table's layers (the beach, the gardens, the mountain): from the landing until the harbor is taken. */
export const WAR_TABLE_TEXT = 'story.war_begun, !story.harbor_taken';
/** The occupied city's people and banners: Chapter 2's attack until Chapter 11's harbor is taken. */
export const OCCUPIED_TEXT = 'story.crown_attack, !story.harbor_taken';

/** "Until the tide" (the outline section 6): the elders' debate settled, The Ninth Thumbprint and Harbors Lie done. */
export const TIDE_READY: Condition = {
  all: [{ flag: 'debate.xaragua_harbor.settled' }, { flag: 'side.ninth_thumbprint.done' }, { flag: 'side.harbors_lie.done' }],
};
/** What the head runner still waits for, worded from the flags (the gate on the map). */
export const TIDE_PARTS: readonly { flag: string; left: string }[] = [
  { flag: 'debate.xaragua_harbor.settled', left: 'The elders are still at it, by the fire.' },
  { flag: 'side.ninth_thumbprint.done', left: 'The canoes have no powder.' },
  { flag: 'side.harbors_lie.done', left: 'Nobody has counted the ships since dawn.' },
];

/**
 * The companies, in the order they land and answer the whistle (the outline 4.1 and 4.2; the second review's 3.11: a
 * column each, its captain in front and a banner behind). `army` is the army.* flag (a missing or emptied house is a gap
 * in the line), `captain` and `soldier` are looks, `banner` the banner tile its second soldier carries on the sand.
 */
export interface WarCompany extends Company {
  captain: string;
  soldier: string;
  banner: string;
  /** The captain's shout when the whistle asks (one each). */
  shout: string;
  /** Who shouts it (a speaker id). */
  speaker: string;
  /** The placed soldier between scenes (an NPC id: one line each). */
  npc: string;
}
export const COMPANIES: readonly WarCompany[] = [
  { army: 'zetwal', name: 'Zetwal\'s levy', captain: 'zetwal_levy', soldier: 'zetwal_levy', banner: 'banner_zetwal', shout: 'Levy! By the Harbor councillor\'s word: present!', speaker: 'levy', npc: 'war_levy' },
  { army: 'free_brasador', name: 'Free Brasador', captain: 'azzy', soldier: 'free_brasador', banner: 'banner_free_brasador', shout: '¡Firmes! ...Fire.', speaker: 'azzy', npc: 'war_free_brasador' },
  { army: 'skarragol', name: 'The Ironvow', captain: 'horn_rider', soldier: 'horn_rider', banner: 'banner_horsetail', shout: 'The horn sounds twice: the riders loose together.', speaker: '', npc: 'war_ironvow' },
  { army: 'al_doria', name: 'The Dorini marines', captain: 'dorini_marine', soldier: 'dorini_marine', banner: 'banner_dorini', shout: 'Volley, on the guild\'s account!', speaker: 'dorini_marine', npc: 'war_dorini' },
  { army: 'jwaladesh', name: 'The Agnivansh', captain: 'flame_keeper', soldier: 'flame_keeper', banner: 'brass_lamp_post', shout: 'Agni!', speaker: 'flame_keeper', npc: 'war_agnivansh' },
  { army: 'kuroshi', name: 'The Suzumori', captain: 'gate_guard_kq', soldier: 'gate_guard_kq', banner: 'banner_lantern_pole', shout: 'A lantern lifts on a pole, and the Suzumori loose without a word.', speaker: '', npc: 'war_suzumori' },
  { army: 'aldermoor', name: 'Jordyn\'s watch', captain: 'jordyn_free', soldier: 'watch_inside_out', banner: 'banner_violet', shout: 'Watch!', speaker: 'jordyn', npc: 'war_watch' },
];

/**
 * The house the Crown bought at the Muster, and who plays each part of the flank (written once, from this table: the
 * second review's section 7): the captain (Chapter 10's look), his house's two foes and the one that walks in at half
 * his HP, the companion of that house who leads the fight (STORY 6.9), the house's second (the turned route), and the
 * charm the companion takes (the stat boost STORY 6.9 promised).
 */
export interface FlankHouse {
  house: string;
  captainNpc: string;
  captainLook: string;
  boss: string;
  foe: string;
  second: string;
  secondLook: string;
  companion: string;
  charm: string;
}
export const FLANK_HOUSES: readonly FlankHouse[] = [
  { house: 'skarragol', captainNpc: 'flank_hrafn', captainLook: 'hrafn', boss: 'betrayer_skarragol', foe: 'flank_reaver', second: 'lawspeaker_rider', secondLook: 'horn_rider', companion: 'bayarmaa', charm: 'tassel_charm' },
  { house: 'kuroshi', captainNpc: 'flank_retainer', captainLook: 'retainer_neutral', boss: 'betrayer_kuroshi', foe: 'flank_cutpurse', second: 'signal_master', secondLook: 'signal_master', companion: 'haru', charm: 'paper_seal_charm' },
  { house: 'jwaladesh', captainNpc: 'flank_steward', captainLook: 'agnivansh_steward', boss: 'betrayer_jwaladesh', foe: 'flank_enforcer', second: 'junior_priest', secondLook: 'junior_priest', companion: 'vikram', charm: 'wick_ring' },
  { house: 'al_doria', captainNpc: 'flank_admiral', captainLook: 'dorini_admiral', boss: 'betrayer_al_doria', foe: 'flank_raider', second: 'layla_clerk', secondLook: 'dorini_scribe', companion: 'samira', charm: 'clerk_seal_charm' },
];

// ---- The Canoe Beach (xaragua-beach, 36 x 22) ---------------------------------------------------------------------
export const BEACH = {
  landing: at(14, 11),
  /** The fleet at anchor off the sand (row 18), one hull per house that came, the trader first. */
  fleet: [
    { kind: 'trader_hull', at: at(1, 18), army: '' },
    { kind: 'muster_ship_zetwal', at: at(6, 18), army: 'zetwal' },
    { kind: 'muster_ship_ironvow', at: at(11, 18), army: 'skarragol' },
    { kind: 'muster_ship_suzumori', at: at(16, 18), army: 'kuroshi' },
    { kind: 'muster_ship_agnivansh', at: at(21, 18), army: 'jwaladesh' },
    { kind: 'muster_ship_dorini', at: at(26, 18), army: 'al_doria' },
  ],
  /** The companies' columns on the sand (the second review's 3.11: seven columns, two tiles apart, one screen). */
  columns: [5, 7, 9, 11, 13, 15, 17],
  columnRows: [9, 10, 11],
  /** Where the companies come up out of the boats (the water's edge). */
  shore: at(10, 14),
  /** One soldier per company placed along the sand between scenes (row 14). */
  placed: [at(2, 14), at(4, 14), at(6, 14), at(8, 14), at(10, 14), at(12, 14), at(14, 14)],
  /** The resistance comes down the sand from the gardens' road. */
  gardensRoad: at(8, 1),
  /** The gardens' road's foot at the north edge (the hill_road_north trigger stands a row inside it, the arrivals two below). */
  northDoor: { x: 8, y: 0 },
  /** The Crown's field gun on the headland, and its crew below it on the rock's west foot. */
  gun: at(29, 7),
  officer: at(27, 8),
  musketeers: [at(26, 8), at(28, 9)],
  /** The headland's step: a line across the sand the party crosses going east. */
  headlandStep: { x: 24, y: 9, w: 1, h: 6 },
  /** Where the crew goes: down the rock's west foot and off the north edge (the second review's 3.11). */
  crewOut: at(26, 1),
  /** Sails behind us: the line the party crosses coming back west, where the hull grounds and the captain walks up. */
  flankStep: { x: 19, y: 9, w: 1, h: 5 },
  hull: at(0, 15),
  hullLanding: at(2, 14),
  captain: at(15, 11),
  houseFoes: [at(14, 10), at(14, 12)],
  husher: at(13, 11),
  companionStep: at(17, 11),
  /** The resistance by day (the camp leader, the fisher's boy, the healer, the canoe fisher on the sand). */
  campLeader: at(16, 10),
  fisherBoy: at(17, 12),
  healer: at(12, 12),
  canoeFisher: at(9, 12),
} as const;

// ---- The cassava gardens (xaragua-conuco, 32 x 22) ------------------------------------------------------------------
export const CONUCO = {
  /** The gardens' road's end at the east edge (hill_road_south asks; a long walk to the beach, not a door). */
  beachDoor: { x: 31, y: 14 },
  /** The cave mouth (the built door at (6, 17)); the carrier comes out of it and walks off east at a walk. */
  caveMouth: at(6, 16),
  carrierOut: at(30, 15),
  carrierStep: { x: 1, y: 13, w: 30, h: 1 },
  /** The picket on the road, met coming out with the jars (a line across the gardens, and the three placed). */
  picketStep: { x: 1, y: 11, w: 30, h: 1 },
  picket: [at(12, 9), at(14, 9), at(13, 8)],
} as const;

// ---- The Mountain Path (xaragua-mountain, 46 x 28) ------------------------------------------------------------------
export const MOUNTAIN = {
  lookout: at(39, 13),
  lookoutBoy: at(40, 13),
  lookoutStep: { x: 36, y: 12, w: 1, h: 2 },
  salkhi: at(22, 22),
} as const;

// ---- The hill camp (xaragua-camp, 28 x 20) --------------------------------------------------------------------------
export const CAMP = {
  gate: at(13, 17),
  campLeader: at(15, 11),
  fire: at(13, 8),
  elderCharter: at(11, 8),
  elderResist: at(15, 8),
  elderUndecided: at(13, 11),
  /** Yari walks to the fire to mediate. */
  mediator: at(13, 9),
  healer: at(9, 11),
  hamacas: [at(8, 12), at(10, 12)],
  /** The head runner with the conch on the rock at the camp's north end. */
  headRunner: at(16, 6),
  fisherBoy: at(11, 6),
  canoeFisher: at(12, 16),
  lampOilSeller: at(20, 12),
  jordyn: at(15, 17),
  /** One soldier per company along the camp's south edge. */
  companies: [at(16, 18), at(17, 18), at(18, 18), at(19, 18), at(20, 18), at(21, 18), at(22, 18)],
  jars: at(11, 16),
} as const;

// ---- The petroglyph cave (xaragua-cave): the jars at the antechamber's edge ----------------------------------------
export const CAVE = { jars: at(19, 14), door: at(14, 19) } as const;

// ---- The Harbor Village (xaragua-village, 44 x 30): the war's hub by dusk --------------------------------------------
export const VILLAGE = {
  /** The west door in from the gardens (the built door at (0, 15)): the party comes in here at dusk. */
  westDoor: at(1, 15),
  /** The companies' places in the yard ring by dusk. */
  yard: [at(9, 9), at(10, 9), at(12, 9), at(13, 9), at(9, 11), at(11, 11), at(13, 11)],
  jordyn: at(37, 16),
  customsDoor: at(29, 12),
  /** The pier (x 21 to 22, rows 19 to 27) and its head: the Echo zone at the landward boards. */
  pierZone: { x: 21, y: 19, w: 2, h: 2 },
  /** The chain post's capstan on its own pile beside the pier's sea end (the second review's 3.6). */
  capstan: at(23, 26),
  /** The marines who hold the pier's sea end (the Patience's deck guns behind them). */
  pierMarines: [at(21, 23), at(22, 23)],
  /** The Turn's step: the pier, once the chain has run out. */
  turnStep: { x: 21, y: 23, w: 2, h: 1 },
  /** Where Rael (or Hale) stands on the pier, three tiles from Gianna (the ferry's spawn is at (21, 25)). */
  pierEnd: at(21, 26),
  vanguard: [at(22, 26), at(21, 27), at(22, 27)],
  longboat: at(23, 27),
  /** The Patience in the mouth, the chain from her bow along row 27 to the post (the second review's 3.6). */
  patience: at(10, 27),
  chain: { x: 16, y: 27, w: 5, h: 1 },
  /** Ardencia's black and crimson sails, between the Crown's fleet and the pier (the second review's 3.6). */
  ardencia: [at(34, 22), at(35, 24)],
  /** The allied hulls, round the headland once the chain is down. */
  allies: [at(41, 22), at(41, 24), at(41, 26)],
  /** The Echo: Caona on the pier head, Benny at its foot. */
  echoCaona: at(22, 22),
  echoBenny: at(20, 19),
  /** Where Benny and Nancy come up the pier, and the stretcher. */
  pierFoot: at(21, 19),
} as const;

// ---- The Song House (xaragua-song, 22 x 14): the shelter ------------------------------------------------------------
export const SONG = {
  /** The door (13: the actors come in through it) and the tile inside it where the party arrives. */
  door: at(10, 13),
  arrive: at(10, 12),
  hamacas: [at(2, 3), at(2, 6), at(19, 3), at(19, 6)],
  benny: at(11, 11),
  nancy: at(4, 9),
  lamp: at(17, 9),
} as const;

// ---- The Caney of Anaco (xaragua-caney, 36 x 26): the seat ---------------------------------------------------------
export const CANEY = {
  anaco: at(17, 3),
  yari: at(17, 5),
  doors: at(17, 23),
  elders: [at(3, 6), at(7, 6), at(5, 7)],
  captains: [at(15, 8), at(19, 8), at(15, 12), at(19, 12)],
} as const;
