// Ordvik, the Ironvow's horse-fair capital, and the Winter Plateau, for Chapter 6, The Stolen Standard
// (docs/quest/reviews/2026-10-21-chapter6-outline.md with its second review, built Oct 22). Grey-green grass, slate,
// felt tents, horn and timber, black water and white ice: nothing gold like Pòdlimyè, red like Cenizal or stone like
// Eightgate. Places and the conditions the scenes share come from src/data/skarragol.ts.
//
// Restartable scenes (Chapter 3's rule): every scene that moves the story has a trigger that plays it again until its
// flag is set (the fair in uproar, the Moot, the store's wolves, Sarnai's raid, Grimvald's tent, the horn, the quay).
// The present is the edge of the freeze (the review's 3.4): the fjord is open water with the first floes; fifty years
// ago, in Sarnai's winter, it was ice edge to edge, black and thin in patches.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { FAIR, FJORD, FJORD_OPEN, HERD, MOOT, PLATEAU, QUAY } from '../../src/data/skarragol.ts';

const GRASS = 'ა';
const ROAD = 'ბ';
const SLATE = 'გ';
const SNOW = 'დ';
const FELT = 'ე';
const ROOF = 'ვ';
const CORRAL = 'ზ';
const WATER = 'თ';
const FLOE = 'ი';
const ICE = 'კ';
const THIN = 'ლ';
const SHINGLE = 'მ';
const FLOOR = 'ნ';
const HIDE = 'ო';
const CAIRN = 'პ';
const CLAN_POLE = 'ჟ';
const SLEDGE = 'რ';
const HULL = 'ს';
const HEARTH = 'ტ';
const SACKS = 'უ';
const PAINTED = 'ფ';
const WAGON = 'ქ';
const TENT = 'ღ';
const SEAT = 'ყ';
const TALLY = 'შ';
const FIRE = 'ჩ';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

/** A felt tent: a roof row over felt walls (a grey door goes in the front unless one is given). */
function tent(g: Grid, x: number, y: number, w: number, h: number): void {
  g.rect(x, y, w, 1, ROOF).rect(x, y + 1, w, h - 1, FELT);
}

/** Bayarmaa's grey mare: an NPC placed by flag on the outdoor maps (outline section 9, the review's 3.8). */
function salkhi(name: string, x: number, y: number, facing: string, cond: string): ObjSpec {
  return npc(name, x, y, facing, { if: cond });
}

/**
 * The Winter Plateau (wild, outdoor): the road in from the Seat (north) and on to the fair's east gate (west); the
 * herders' folds (S-3's giver); the winter store under the plateau's edge and the gully the wolves come up (S-3's
 * Echo: one zone, the boulder its anchor); the nine cairns round a flat stone on the snow (placed now and inert: S-4
 * after the release); the ambush layer on the grass from the party's arrival. The road is safe; the herders' track
 * across the grass to the folds is not.
 */
export function skarragolPlateau(): MapSource {
  const { w: W, h: H } = PLATEAU;
  const g = new Grid(W, H, GRASS);
  g.rect(0, 0, W, 1, SLATE).rect(0, H - 1, W, 1, SLATE).rect(0, 0, 1, H, SLATE).rect(W - 1, 0, 1, H, SLATE);
  // The road: down from the Seat's way (north), then west to the fair.
  g.rect(8, 0, 2, 17, ROAD).rect(0, 15, 10, 2, ROAD);
  // The high ground, snow, and the nine cairns round the flat stone.
  g.rect(28, 1, 17, 8, SNOW);
  put(g, CAIRN, [[33, 3], [35, 2], [37, 2], [39, 3], [40, 5], [39, 7], [37, 8], [35, 8], [33, 7]]);
  // The herders' folds: a corral with a gate on the track side and one to the south; a herders' tent inside.
  g.rect(30, 12, 11, 1, CORRAL).rect(30, 19, 11, 1, CORRAL).rect(30, 12, 1, 8, CORRAL).rect(40, 12, 1, 8, CORRAL);
  g.set(30, 15, GRASS).set(35, 19, GRASS);
  g.set(38, 13, TENT);
  // The plateau's edge (south-east): the cliff with the winter store in it, and the gully the wolves come up.
  g.rect(28, 26, 17, 3, SLATE);
  g.rect(41, 20, 4, 2, SLATE).rect(41, 24, 4, 2, SLATE).rect(41, 22, 4, 2, SHINGLE);
  // Fifty years ago (S-3's Echo): Sarnai's cache at the store, the slope above the gully still grass.
  const e = g.clone();
  e.rect(40, 20, 2, 2, GRASS);
  put(e, SACKS, [[34, 25], [38, 25], [33, 24]]);

  const z = PLATEAU.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'plateau_fair', x: 0, y: 15, h: 2, props: { target: 'fair_plateau', map: 'skarragol-fair', exit: 'right' } },
    { layer: 'spawns', name: 'seat_road', x: PLATEAU.spawn.x, y: PLATEAU.spawn.y, props: { facing: 'down', era: 'present' } },
    // Above the store (the gully puzzle's start, puzzles/skarragol_gully).
    { layer: 'spawns', name: 'store', x: PLATEAU.zone.x + 1, y: PLATEAU.zone.y - 1, props: { facing: 'down', era: 'present' } },
    // The winter road ends here (beat 0): the caravan halts where the grass turns grey.
    trigger('plateau_arrive', PLATEAU.spawn.x, PLATEAU.spawn.y, { dialogue: 'plateau_arrive', flag: 'story.skarragol_arrived', once: true, onEnter: true, if: 'act5.complete' }),
    // S-3: the wolves come up the gully to the store (again until they are beaten), then the herder's word.
    trigger('store_wolves', 33, 25, { dialogue: 'store_wolves', if: 'side.winter_stores.accepted, !side.winter_stores.wolves' }, 7, 1),
    npc('oyuun', PLATEAU.herder.x, PLATEAU.herder.y, 'left'),
    // S-4's giver, placed and inert (after the release).
    npc('old_herder', PLATEAU.oldHerder.x, PLATEAU.oldHerder.y, 'right'),
    salkhi('salkhi_plateau', PLATEAU.salkhi.x, PLATEAU.salkhi.y, 'left', 'party.bayarmaa, !act6.complete'),
    obj('seat_road_back', 8, 0, { dialogue: 'seat_road_back', era: 'present', solid: true }, 2, 1),
    obj('winter_store', PLATEAU.store.x, PLATEAU.store.y, { kind: 'store_door', solid: true, era: 'present', dialogue: 'winter_store' }),
    obj('winter_store_echo', PLATEAU.store.x, PLATEAU.store.y, { kind: 'store_door', solid: true, era: 'echo', dialogue: 'winter_store_echo' }),
    // The anchor: a loose boulder on the slope above the gully, fifty years ago; rolled, it shuts the wolves' road.
    obj('slope_boulder', PLATEAU.boulder.x, PLATEAU.boulder.y, { kind: 'boulder', solid: true, era: 'echo', if: '!anchor.wolf_run', dialogue: 'slope_boulder' }),
    obj('gully_boulder_echo', PLATEAU.gully.x, PLATEAU.gully.y, { kind: 'boulder', solid: true, era: 'echo', if: 'anchor.wolf_run' }, 1, 2),
    obj('boulder_wall', PLATEAU.gully.x, PLATEAU.gully.y, { kind: 'boulder_wall', solid: true, era: 'present', if: 'anchor.wolf_run', dialogue: 'boulder_wall' }, 1, 2),
    obj('gully_open', PLATEAU.gully.x + 2, PLATEAU.gully.y, { dialogue: 'gully_open', era: 'present', if: '!anchor.wolf_run' }, 1, 2),
    { layer: 'anchors', name: 'wolf_run', x: PLATEAU.boulder.x, y: PLATEAU.boulder.y, props: { object: 'slope_boulder', flag: 'anchor.wolf_run' } },
    { layer: 'echo_zones', name: 'store_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, side.winter_stores.wolves', onEcho: 'store_echo_enter', onReturn: 'store_echo_return' } },
    npc('cache_rider_a', 33, 23, 'right', { npc: 'sarnai_rider', era: 'echo' }),
    npc('cache_rider_b', 39, 24, 'left', { npc: 'sarnai_rider', era: 'echo' }),
    // S-4 after the release: the flat stone in the ring of cairns.
    obj('sighting_stone', PLATEAU.stone.x, PLATEAU.stone.y, { kind: 'sighting_stone', solid: true, era: 'both', dialogue: 'sighting_stone' }),
    { layer: 'encounters', name: 'plateau_w', x: 1, y: 1, w: 7, h: 14, props: { table: 'winter_plateau', if: 'story.skarragol_arrived' } },
    { layer: 'encounters', name: 'plateau_n', x: 10, y: 1, w: 18, h: 13, props: { table: 'winter_plateau', if: 'story.skarragol_arrived' } },
    { layer: 'encounters', name: 'plateau_track', x: 10, y: 14, w: 19, h: 3, props: { table: 'winter_plateau', if: 'story.skarragol_arrived' } },
    { layer: 'encounters', name: 'plateau_s', x: 1, y: 17, w: 27, h: 11, props: { table: 'winter_plateau', if: 'story.skarragol_arrived' } },
  ];
  return { id: 'skarragol-plateau', present: g, echo: e, objects };
}

/**
 * The Horse-Fair (the hub, outdoor): a ring of corrals; the Moot Tent in the gathering field with the empty standard
 * pole before it; the Saga Tent; the food tent, the furrier and the horse-trader; the contract board; the trading mats
 * and their debate corner; the white tent of Azzy's mother's people (S-5); the quay lane (north), the fjord path
 * (north-east, after the day's three things), the east gate (the plateau). Dusk is a mood (data/skarragol.ts FAIR_DUSK).
 */
export function skarragolFair(): MapSource {
  const { w: W, h: H } = FAIR;
  const g = new Grid(W, H, GRASS);
  g.rect(0, 0, W, 1, CORRAL).rect(0, H - 1, W, 1, CORRAL).rect(0, 0, 1, H, CORRAL).rect(W - 1, 0, 1, H, CORRAL);
  // The lanes: the east gate's, the quay lane, the fjord path, and the way up to the Moot Tent.
  g.rect(2, 15, W - 2, 2, ROAD).rect(10, 0, 2, 15, ROAD).rect(42, 0, 2, 15, ROAD).rect(22, 10, 2, 5, ROAD);
  // The Moot Tent (its door the Moot's), the Saga Tent, the white tent of the steppe's royal household.
  tent(g, 16, 4, 14, 6);
  g.set(22, 9, 'D');
  tent(g, 3, 3, 7, 5);
  g.set(6, 7, 'D');
  tent(g, 32, 3, 6, 4);
  // Stalls: the food tent, the furrier, the horse-trader.
  put(g, TENT, [[12, 19], [16, 19], [20, 19]]);
  // The corral of horses for sale (south-west) and the trading mats (south-east).
  g.rect(2, 22, 9, 1, CORRAL).rect(2, 22, 1, 6, CORRAL).rect(10, 22, 1, 6, CORRAL);
  g.rect(30, 20, 7, 5, 'ö');
  put(g, FIRE, [[38, 24], [6, 13]]);
  put(g, TENT, [[2, 10], [14, 2], [39, 10], [36, 26], [26, 25]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'fair_plateau', x: W - 1, y: 15, h: 2, props: { target: 'plateau_fair', map: 'skarragol-plateau', exit: 'left' } },
    { layer: 'doors', name: 'fair_quay', x: 10, y: 0, w: 2, props: { target: 'quay_fair', map: 'skarragol-quay', exit: 'down' } },
    // The fjord path: until the three are done Bayarmaa says what is left; then, at dusk, she sets out (fjord_gate_wait).
    { layer: 'doors', name: 'fair_fjord', x: 42, y: 0, w: 2, props: { target: 'fjord_fair', map: 'skarragol-fjord', exit: 'down', if: FJORD_OPEN, closed: 'fjord_gate_wait' } },
    { layer: 'doors', name: 'fair_moot', x: FAIR.mootDoor.x, y: FAIR.mootDoor.y, props: { target: 'moot_out', map: 'skarragol-moot', exit: 'down' } },
    { layer: 'doors', name: 'fair_saga', x: FAIR.sagaDoor.x, y: FAIR.sagaDoor.y, props: { target: 'saga_out', map: 'skarragol-saga', exit: 'down' } },
    { layer: 'spawns', name: 'fjord_dawn', x: FAIR.dawn.x, y: FAIR.dawn.y, props: { facing: 'down', era: 'present' } },
    // The fair in uproar (beat 1), as the party comes in from the east gate and crosses the field (again until seen).
    trigger('fair_arrive', 30, 1, { dialogue: 'fair_arrive', if: '!story.fair_seen' }, 1, 28),
    obj('pole_fair', FAIR.pole.x, FAIR.pole.y, { kind: 'standard_pole', solid: true, era: 'present', dialogue: 'pole_fair' }),
    obj('fair_board', FAIR.board.x, FAIR.board.y, { kind: 'sign', solid: true, era: 'present', dialogue: 'fair_board' }),
    obj('white_tent', 34, 6, { dialogue: 'white_tent', era: 'present' }),
    npc('fair_crier', FAIR.crier.x, FAIR.crier.y, 'down', { if: '!story.standard_planted' }),
    npc('crown_surveyor', FAIR.surveyor.x, FAIR.surveyor.y, 'down', { if: '!story.standard_planted' }),
    npc('ordu_envoy', FAIR.envoy.x, FAIR.envoy.y, 'down', { if: '!act6.complete' }),
    npc('ordu_champion', FAIR.champion.x, FAIR.champion.y, 'down', { if: '!act6.complete' }),
    npc('ordvik_food', FAIR.food.x, FAIR.food.y, 'down'),
    npc('ordvik_furrier', FAIR.furrier.x, FAIR.furrier.y, 'down'),
    npc('ordvik_horses', FAIR.horseTrader.x, FAIR.horseTrader.y, 'down'),
    // The debate corner on the trading mats (data/debates.ts skarragol_oath): either one starts it.
    npc('debate_sky_rider', FAIR.skyRider.x, FAIR.skyRider.y, 'right'),
    npc('debate_witness_elder', FAIR.witness.x, FAIR.witness.y, 'left'),
    npc('fair_horse_a', 4, 24, 'right', { npc: 'fair_horse' }),
    npc('fair_horse_b', 7, 25, 'left', { npc: 'fair_horse' }),
    npc('fair_horse_c', 5, 27, 'up', { npc: 'fair_horse' }),
    npc('fair_trader', 33, 23, 'up'),
    salkhi('salkhi_fair', FAIR.salkhi.x, FAIR.salkhi.y, 'down', 'story.fair_seen, !act6.complete'),
  ];
  return { id: 'skarragol-fair', present: g, echo: g.clone(), objects };
}

/**
 * The Great Moot Tent (the seat of government, interior, 36 x 26: the seat paragraph's size): an aisle of clan poles
 * to the chieftain's seat and the inner empty pole (empty, then planted); off the aisle the lawspeaker's tent (the
 * Moot's three books on painted hides), the skalds' and horn-riders' tent, the guest-hostage tent (the Crown's envoy,
 * the Crown's offer in a chest), the plunder store. Everyone who disagrees is here.
 */
export function skarragolMoot(): MapSource {
  const { w: W, h: H } = MOOT;
  const g = new Grid(W, H, HIDE);
  g.rect(1, 1, W - 2, H - 2, FLOOR);
  g.rect(15, 1, 6, 3, '{').rect(17, 4, 2, H - 5, ')');
  g.set(MOOT.seat.x, MOOT.seat.y, SEAT);
  g.set(17, H - 1, 'D');
  for (const y of [6, 9, 12, 15, 18]) put(g, CLAN_POLE, [[14, y], [21, y]]);
  // The side tents, hide walls with a way in from the aisle.
  g.rect(10, 1, 1, 10, HIDE).rect(1, 10, 10, 1, HIDE).set(10, 6, FLOOR);
  g.rect(1, 14, 10, 1, HIDE).rect(10, 14, 1, 10, HIDE).set(10, 19, FLOOR);
  g.rect(25, 1, 1, 10, HIDE).rect(25, 10, 9, 1, HIDE).set(25, 6, FLOOR);
  g.rect(25, 14, 10, 1, HIDE).rect(25, 14, 1, 10, HIDE).set(25, 19, FLOOR);
  g.rect(2, 1, 4, 1, PAINTED);
  put(g, HEARTH, [[5, 18], [30, 7]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'moot_out', x: 17, y: H - 1, props: { target: 'fair_moot', map: 'skarragol-fair', exit: 'up' } },
    { layer: 'spawns', name: 'aisle', x: 17, y: 23, props: { facing: 'up', era: 'present' } },
    // The Moot (beat 2), as the party walks up the aisle (again until Bayarmaa is with them).
    trigger('moot_scene', 1, MOOT.sceneRow, { dialogue: 'moot', if: '!party.bayarmaa' }, W - 2, 1),
    // The horn (beat 8): the standard planted, the price, the token (again until it is planted).
    trigger('horn_scene', 1, MOOT.sceneRow, { dialogue: 'horn', if: 'story.standard_home, !ally.skarragol' }, W - 2, 1),
    obj('inner_pole', MOOT.innerPole.x, MOOT.innerPole.y, { kind: 'standard_pole', solid: true, era: 'present', if: '!story.standard_planted', dialogue: 'inner_pole' }),
    obj('inner_pole_planted', MOOT.innerPole.x, MOOT.innerPole.y, { kind: 'standard_planted', solid: true, era: 'present', if: 'story.standard_planted', dialogue: 'inner_pole_planted' }),
    obj('chieftain_seat', MOOT.seat.x, MOOT.seat.y, { dialogue: 'chieftain_seat', era: 'present' }),
    obj('crown_chest', MOOT.chest.x, MOOT.chest.y, { kind: 'crown_chest', solid: true, era: 'present', dialogue: 'crown_chest' }),
    obj('moot_hides', MOOT.hides.x, MOOT.hides.y, { dialogue: 'shelf.moot_hides', era: 'present' }, 4, 1),
    npc('torvald', MOOT.torvald.x, MOOT.torvald.y, 'down'),
    npc('lawspeaker', MOOT.lawspeaker.x, MOOT.lawspeaker.y, 'down'),
    npc('hrafn', MOOT.hrafn.x, MOOT.hrafn.y, 'left'),
    npc('trading_jarl', MOOT.jarl.x, MOOT.jarl.y, 'right', { if: '!ally.skarragol' }),
    npc('hostage_envoy', MOOT.envoy.x, MOOT.envoy.y, 'down', { if: '!ally.skarragol' }),
    // Bayarmaa, accused, between two horn-riders, until she stands with the party.
    npc('bayarmaa_accused', MOOT.bayarmaa.x, MOOT.bayarmaa.y, 'up', { npc: 'bayarmaa', if: '!party.bayarmaa' }),
    npc('horn_rider_a', MOOT.riderA.x, MOOT.riderA.y, 'up', { npc: 'horn_rider', if: '!party.bayarmaa' }),
    npc('horn_rider_b', MOOT.riderB.x, MOOT.riderB.y, 'up', { npc: 'horn_rider', if: '!party.bayarmaa' }),
    npc('horn_master', MOOT.hornMaster.x, MOOT.hornMaster.y, 'right'),
    npc('plunder_store', MOOT.plunder.x, MOOT.plunder.y, 'left'),
    npc('skald_rider', 4, 20, 'right', { npc: 'horn_rider' }),
    // Grimvald, bound, at the aisle's foot if the party brought him (choice.grimvald_spared).
    npc('grimvald_bound', MOOT.grimvald.x, MOOT.grimvald.y, 'right', { npc: 'grimvald_bound', if: 'choice.grimvald_spared, story.standard_home, !act6.complete' }),
  ];
  return { id: 'skarragol-moot', present: g, echo: g.clone(), objects, interior: true };
}

/** The Saga Tent (the library, interior): hides and tally sticks on the north wall, the skald who keeps them, a hearth. */
export function skarragolSaga(): MapSource {
  const W = 22;
  const H = 16;
  const g = new Grid(W, H, HIDE);
  g.rect(1, 1, W - 2, H - 2, FLOOR);
  g.rect(3, 1, 16, 1, TALLY);
  g.set(10, 8, HEARTH);
  g.set(10, H - 1, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'saga_out', x: 10, y: H - 1, props: { target: 'fair_saga', map: 'skarragol-fair', exit: 'up' } },
    { layer: 'spawns', name: 'saga', x: 10, y: 13, props: { facing: 'up', era: 'present' } },
    obj('saga_hides_a', 3, 1, { dialogue: 'shelf.saga_hides_a', era: 'present' }, 8, 1),
    obj('saga_hides_b', 11, 1, { dialogue: 'shelf.saga_hides_b', era: 'present' }, 8, 1),
    npc('skald', 16, 6, 'left'),
  ];
  return { id: 'skarragol-saga', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Longship Quay (outdoor): eleven hulls drawn up, the Crown's surveyor with his chain (until the standard stands),
 * the trading jarl, and at the pier's end the longship that takes the party south along the coast (Chapter 7).
 */
export function skarragolQuay(): MapSource {
  const { w: W, h: H } = QUAY;
  const g = new Grid(W, H, SHINGLE);
  g.rect(0, 0, W, 7, WATER).rect(0, 0, 1, H, SLATE).rect(W - 1, 0, 1, H, SLATE).rect(0, H - 1, W, 1, SLATE);
  g.rect(1, 7, W - 2, 3, 'k').rect(20, 3, 2, 4, 'k');
  for (const x of [2, 4, 6, 8, 10, 12, 14, 16, 18, 23, 25]) g.rect(x, 5, 1, 2, HULL);
  g.rect(10, H - 1, 2, 1, SHINGLE);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'quay_fair', x: 10, y: H - 1, w: 2, props: { target: 'fair_quay', map: 'skarragol-fair', exit: 'up' } },
    { layer: 'spawns', name: 'quay', x: QUAY.spawn.x, y: QUAY.spawn.y, props: { facing: 'up', era: 'present' } },
    // The longship (beat 9): the chapter's end (again until it sails).
    trigger('quay_end', 20, 4, { dialogue: 'quay_end', if: 'ally.skarragol, !act6.complete' }, 2, 1),
    obj('longship_ready', QUAY.ship.x, QUAY.ship.y, { kind: 'longship', solid: true, era: 'present', dialogue: 'longship_ready' }, 2, 1),
    obj('quay_hulls', 2, 6, { dialogue: 'quay_hulls', era: 'present' }, 17, 1),
    npc('quay_surveyor', QUAY.surveyor.x, QUAY.surveyor.y, 'up', { npc: 'crown_surveyor', if: '!story.standard_planted' }),
    npc('quay_jarl', QUAY.jarl.x, QUAY.jarl.y, 'down', { npc: 'trading_jarl_quay', if: 'ally.skarragol' }),
    salkhi('salkhi_quay', QUAY.salkhi.x, QUAY.salkhi.y, 'up', 'ally.skarragol'),
  ];
  return { id: 'skarragol-quay', present: g, echo: g.clone(), objects };
}

/**
 * The Frozen Fjord and the thief's camp (outdoor; SIG-SKA). The near shore (south); the fjord between, open water with
 * floes now and ice fifty years ago, black and thin in patches; six Echo zones on the floes that were also ice; the
 * far shore (north): the meadow and the herd, the ring of sledges with its two gaps and their lookouts, Grimvald's
 * tent and his black horse. In the memory the same shore is the Crown's supply camp, and Sarnai's riders are in the
 * herd on the ice.
 */
export function skarragolFjord(): MapSource {
  const { w: W, h: H } = FJORD;
  const p = new Grid(W, H, SLATE);
  // The near shore and the far shore's meadow (both eras).
  p.rect(4, 28, 29, 5, SHINGLE).rect(6, H - 1, 2, 1, SHINGLE);
  p.rect(4, 9, 31, 3, GRASS).rect(6, 0, 27, 9, GRASS);
  const e = p.clone();
  // The fjord: water and floes now; ice, thin in patches, then.
  p.rect(4, 12, 29, 16, WATER);
  e.rect(4, 12, 29, 16, THIN);
  for (const z of FJORD.zones) {
    p.rect(z.x, z.y, z.w, z.h, FLOE);
    e.rect(z.x, z.y, z.w, z.h, ICE);
  }
  // Each stretch between zones is walkable in one era only: the ice then (1, 3, 5), the floes now (2, 4).
  e.rect(5, 23, 3, 3, ICE).rect(16, 18, 3, 3, ICE).rect(27, 14, 3, 2, ICE);
  p.rect(8, 21, 8, 2, FLOE).rect(19, 16, 8, 2, FLOE);
  // Dead ends: floes off the first zone and the third; ice off the first stretch and toward the fourth zone.
  p.rect(8, 26, 4, 2, FLOE).rect(19, 21, 3, 2, FLOE);
  e.rect(8, 23, 3, 2, ICE).rect(13, 16, 3, 2, ICE);
  // The thief's camp now: a ring of sledges with a gap at each end, Grimvald's tent, a few more.
  p.rect(6, 8, 27, 1, SLEDGE).set(FJORD.westGap.x, FJORD.westGap.y, GRASS);
  p.rect(6, 4, 27, 1, SLEDGE).set(FJORD.eastGap.x, FJORD.eastGap.y, GRASS);
  tent(p, 15, 0, 7, 3);
  put(p, TENT, [[8, 1], [11, 1], [26, 1], [30, 1]]);
  put(p, FIRE, [[25, 2]]);
  // Fifty years ago: the Crown's supply camp on the same shore, its wagons and sacks.
  put(e, WAGON, [[10, 6], [14, 6], [18, 6], [22, 6], [12, 3], [20, 3], [24, 3]]);
  put(e, SACKS, [[16, 3], [8, 5], [30, 6]]);

  const zone = (name: string, i: number, extra: Record<string, string> = {}): ObjSpec => {
    const z = FJORD.zones[i]!;
    return { layer: 'echo_zones', name, x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket', ...extra } };
  };
  const reached = (name: string, i: number, flag: string): ObjSpec => {
    const z = FJORD.zones[i]!;
    return trigger(name, z.x, z.y, { flag, once: true, era: 'both' }, z.w, z.h);
  };
  const herd: ObjSpec[] = HERD.flatMap((h) => [
    npc(`${h.id}_a`, h.a.x, h.a.y, 'down', { npc: h.id, if: '!story.herd_called' }),
    npc(`${h.id}_b`, h.b.x, h.b.y, 'right', { npc: h.id, if: 'story.herd_called, !story.herd_called_2' }),
    npc(`${h.id}_c`, h.c.x, h.c.y, 'left', { npc: h.id, if: 'story.herd_called_2' }),
  ]);
  const z6 = FJORD.zones[5]!;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'fjord_fair', x: 6, y: H - 1, w: 2, props: { target: 'fair_fjord', map: 'skarragol-fair', exit: 'up' } },
    { layer: 'spawns', name: 'fjord_path', x: FJORD.spawn.x, y: FJORD.spawn.y, props: { facing: 'up', era: 'present' } },
    // The near shore at dusk: Bayarmaa reads the ice, and gives Anissa her fur (beat 4).
    trigger('fjord_arrive', FJORD.spawn.x, FJORD.spawn.y, { dialogue: 'fjord_arrive', flag: 'story.fjord_seen', once: true, onEnter: true, if: 'story.fjord_set_out' }),
    zone('fjord_z1', 0, { onEcho: 'fjord_first_echo' }),
    zone('fjord_z2', 1),
    zone('fjord_z3', 2),
    zone('fjord_z4', 3),
    zone('fjord_z5', 4),
    zone('fjord_z6', 5, { onEcho: 'raid_onecho' }),
    // How far across the party is (the arrow follows: data/quests.ts ACT6 crossing).
    reached('reach_z2', 1, 'story.fjord_z2'),
    reached('reach_z3', 2, 'story.fjord_z3'),
    reached('reach_z4', 3, 'story.fjord_z4'),
    reached('reach_z5', 4, 'story.fjord_z5'),
    trigger('far_ice', z6.x, FJORD.crossedRow, { flag: 'story.fjord_crossed', once: true, era: 'echo' }, z6.w, 1),
    // Sarnai's raid plays as Patricio steps onto the far shore's floe in the memory (the review's 3.2: the crossing
    // ends in the Echo, so a step trigger, not only the zone's onEcho); again until the whistle is learned.
    trigger('raid_step', z6.x, FJORD.raidRow, { dialogue: 'sarnai_raid', era: 'echo', if: '!clue.herd_whistle' }, z6.w, 1),
    // Grimvald's tent (beat 7): he comes out and mounts (again until he is beaten).
    trigger('grimvald_step', 6, FJORD.campRow, { dialogue: 'grimvald_tent', if: 'story.herd_unseen|story.lookouts_beaten, !story.grimvald_beaten' }, 27, 1),
    ...herd,
    npc('lookout_west_gap', FJORD.westGap.x, FJORD.westGap.y, 'down', { npc: 'lookout_west', if: '!story.herd_called, !story.lookouts_beaten' }),
    npc('lookout_west_herd', 8, 10, 'left', { npc: 'lookout_west', if: 'story.herd_called, !story.lookouts_beaten' }),
    npc('lookout_east_gap', FJORD.eastGap.x, FJORD.eastGap.y, 'down', { npc: 'lookout_east', if: '!story.herd_called_2, !story.lookouts_beaten' }),
    npc('lookout_east_herd', 30, 5, 'right', { npc: 'lookout_east', if: 'story.herd_called_2, !story.lookouts_beaten' }),
    npc('grimvald_horse', FJORD.blackHorse.x, FJORD.blackHorse.y, 'down', { if: '!story.grimvald_beaten' }),
    obj('picket_line', FJORD.picket.x, FJORD.picket.y, { kind: 'picket', solid: true, era: 'present', dialogue: 'picket_line' }, 3, 1),
    salkhi('salkhi_shore', 10, 30, 'up', 'party.bayarmaa, !story.standard_home'),
    // Fifty years ago: Sarnai and her grey horse at the edge of the ice, the herd her riders hide in, the sentries.
    npc('sarnai', FJORD.sarnai.x, FJORD.sarnai.y, 'right', { era: 'echo', if: '!echo.raid_ridden' }),
    npc('sarnai_mare', FJORD.sarnai.x - 1, FJORD.sarnai.y, 'right', { era: 'echo', if: '!echo.raid_ridden' }),
    npc('echo_horse_1_ice', 20, 10, 'up', { npc: 'echo_horse_1', era: 'echo', if: '!echo.herd_moved' }),
    npc('echo_horse_1_camp', 13, 7, 'up', { npc: 'echo_horse_1', era: 'echo', if: 'echo.herd_moved' }),
    npc('echo_horse_2_ice', 22, 11, 'up', { npc: 'echo_horse_2', era: 'echo', if: '!echo.herd_moved' }),
    npc('echo_horse_2_camp', 16, 7, 'up', { npc: 'echo_horse_2', era: 'echo', if: 'echo.herd_moved' }),
    npc('echo_horse_3_ice', 23, 9, 'up', { npc: 'echo_horse_3', era: 'echo', if: '!echo.herd_moved' }),
    npc('echo_horse_3_camp', 20, 7, 'up', { npc: 'echo_horse_3', era: 'echo', if: 'echo.herd_moved' }),
    npc('echo_horse_4_ice', 18, 11, 'up', { npc: 'echo_horse_4', era: 'echo', if: '!echo.herd_moved' }),
    npc('echo_horse_4_camp', 24, 7, 'up', { npc: 'echo_horse_4', era: 'echo', if: 'echo.herd_moved' }),
    npc('sentry_a', 12, 8, 'down', { npc: 'crown_sentry', era: 'echo' }),
    npc('sentry_b', 21, 8, 'down', { npc: 'crown_sentry', era: 'echo' }),
    obj('wagons_burning', 14, 6, { kind: 'wagon_burning', solid: true, era: 'echo', if: 'echo.raid_ridden' }, 9, 1),
  ];
  return { id: 'skarragol-fjord', present: p, echo: e, objects };
}

export const SKARRAGOL_SOURCES: readonly (() => MapSource)[] = [skarragolPlateau, skarragolFair, skarragolMoot, skarragolSaga, skarragolQuay, skarragolFjord];
