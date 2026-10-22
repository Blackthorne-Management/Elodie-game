// Agnipur, Jwaladesh's city of the flame, for Chapter 8, The Dying Flame (docs/quest/reviews/2026-10-22-chapter8-outline.md
// with its second review, built Oct 22). White stone and saffron, brass everywhere, salt-white ground beyond the walls,
// the one new brick tower in a city of old white domes. Places and the conditions the scenes share come from
// src/data/jwaladesh.ts.
//
// Six maps: the Harbor Chain (the landing, the chain tower and its lamp, the oil store), the Lamp Bazaar (the hub),
// the Roofs (the four mirrors), the Palm-Leaf Library, the Court of the Flame (with the duel yard) and the Salt Flats.
// Restartable scenes (Chapter 3's rule): every scene that moves the story has a trigger that plays it again until its
// flag is set.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { BAZAAR, COURT, DAY_DONE_TEXT, FLATS, HARBOR, LIBRARY, MIRROR_SOLUTION, ROOFTOPS, facingText } from '../../src/data/jwaladesh.ts';

const STONE = 'क';
const WALL = 'ख';
const DOME = 'ग';
const QUAY = 'घ';
const SEA = 'च';
const MOLE = 'छ';
const TOWER = 'ज';
const SAFFRON = 'झ';
const COLUMN = 'ट';
const ROOF = 'ठ';
const PLANK = 'ड';
const VOID = 'ढ';
const ROAD = 'त';
const SCRUB = 'थ';
const STAIR = 'द';
const ARCH = 'ध';
const JAR = 'न';
const SFLOOR = 'प';
const SWALL = 'फ';
const VAT = 'ब';
const STALL = 'भ';
const STEPS = 'म';
const PFLOOR = 'य';
const PSHELF = 'र';
const CART = 'ल';
const ROPE = 'व';
const TFLOOR = 'स';
const AWNING = 'ह';
const SAND = 'ζ';
const SALT = 'ŝ';
const DAIS = '{';

/** The night: the day's three things done, until the store is opened at dawn (data/jwaladesh.ts NIGHT). */
const NIGHT_TEXT = `${DAY_DONE_TEXT}, !story.dhanraj_beaten`;
/** The day: any of the three still to do (the watch on the store and the tower, Aiyana on her roof). */
const DAY_TEXT = '!side.lamp_relay.done|!side.anonymous_oil.done|!debate.jwaladesh_hesitation.settled';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

function frame(g: Grid, x: number, y: number, w: number, h: number, ch: string): void {
  g.rect(x, y, w, 1, ch).rect(x, y + h - 1, w, 1, ch).rect(x, y, 1, h, ch).rect(x + w - 1, y, 1, h, ch);
}

/** Bayarmaa's grey mare: on the quay and in the bazaar (not the roofs, not the Court, not the salt). */
function salkhi(name: string, x: number, y: number, facing: string): ObjSpec {
  return npc(name, x, y, facing, { if: 'story.jwaladesh_arrived, !act8.complete' });
}

/**
 * The Harbor Chain (outdoor): a white stone quay; the great chain across the harbor mouth from the chain tower's yard
 * to the far mole; the chain lamp on the tower, dark, and the old watchtower's bare bracket beside it (the Echo zone is
 * the lamp's platform: Arjun's charge); Dhanraj's oil store along the east with its doors chained and two Oil Enforcers
 * at them; the Crown's oil-factor's launch at the store's steps; the jar-carts and the sea-wall lane behind them; the
 * night watch on the open quay; the stair up to the bazaar.
 */
export function jwaladeshHarbor(): MapSource {
  const { w: W, h: H } = HARBOR;
  const g = new Grid(W, H, QUAY);
  g.rect(0, 0, W, 1, WALL).rect(0, 0, 1, 14, WALL).rect(W - 1, 0, 1, 14, WALL);
  g.rect(0, 14, W, H - 14, SEA);
  const m = HARBOR.mole;
  g.rect(m.x, m.y, m.w, m.h, MOLE);
  // The chain tower's yard: walls on its edge, the gate in the south wall, the platforms inside.
  const t = HARBOR.tower;
  frame(g, t.x, t.y, t.w, t.h, WALL);
  g.rect(t.x + 1, t.y + 1, t.w - 2, t.h - 2, TFLOOR);
  g.set(HARBOR.gate.x, HARBOR.gate.y, TFLOOR);
  put(g, PLANK, [[6, 5], [7, 5], [7, 6]]);
  // The oil store: a long warehouse, jars along its walls, the doorway in its south wall.
  const s = HARBOR.store;
  g.rect(s.x, s.y, s.w, 1, DOME);
  frame(g, s.x, s.y + 1, s.w, s.h - 1, SWALL);
  g.rect(s.x + 1, s.y + 2, s.w - 2, s.h - 3, SFLOOR);
  g.rect(s.x + 1, s.y + 2, s.w - 2, 1, JAR);
  put(g, JAR, [[s.x + 1, s.y + 5], [s.x + 1, s.y + 6], [s.x + s.w - 2, s.y + 6]]);
  g.set(HARBOR.storeDoors.x, HARBOR.storeDoors.y, SFLOOR).set(HARBOR.storeDoors.x + 1, HARBOR.storeDoors.y, SFLOOR);
  // The jar-carts that make the sea-wall lane under the north wall; the milk stall's awning.
  g.rect(12, 2, 4, 1, CART);
  put(g, AWNING, [[18, 6], [19, 6]]);
  const e = g.clone();
  const z = HARBOR.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'harbor_bazaar', x: HARBOR.stair.x, y: HARBOR.stair.y, props: { target: 'bazaar_harbor', map: 'jwaladesh-bazaar', exit: 'down' } },
    { layer: 'spawns', name: 'landing', x: HARBOR.landing.x, y: HARBOR.landing.y, props: { facing: 'up', era: 'present' } },
    // The landing (beat 0): the dead lamp, the chained store, the cart turned back.
    trigger('harbor_arrive', HARBOR.landing.x, HARBOR.landing.y, { dialogue: 'harbor_arrive', flag: 'story.jwaladesh_arrived', once: true, onEnter: true, if: 'act7.complete' }),
    // Vikram's first sighting, at the crowd on the stair's head (again until he has been seen).
    trigger('stair_sighting', 13, HARBOR.sightRow, { dialogue: 'stair_sighting', if: 'story.jwaladesh_arrived, !story.vikram_seen' }, 7, 1),
    // The night lamp's hour (beat 4): Aiyana unlocks the chain tower (again until it is open).
    trigger('tower_open', HARBOR.tower.x + 2, HARBOR.gateRow, { dialogue: 'tower_open', if: `${DAY_DONE_TEXT}, !story.tower_open` }, 6, 1),
    // The night watch on the open quay (the sea-wall lane's fail-safe; again until it is beaten).
    trigger('quay_watch', HARBOR.watchX, HARBOR.watchRows[0], { dialogue: 'quay_watch', if: `${NIGHT_TEXT}, !story.tower_open, !encounter.jwaladesh_story.watch.won` }, 1, HARBOR.watchRows[1] - HARBOR.watchRows[0] + 1),
    // Seth Dhanraj in his store (beat 7; again until he is beaten).
    trigger('store_boss', HARBOR.storeDoors.x, HARBOR.storeDoors.y, { dialogue: 'store_boss', if: 'story.flame_seen, !story.dhanraj_beaten' }, 2, 1),
    // The end of the chapter (beat 9): the trader's gangway (again until it sails).
    trigger('jw_quay_end', 14, HARBOR.endRow, { dialogue: 'jw_quay_end', if: 'ally.jwaladesh, !act8.complete' }, 5, 1),
    obj('trader_ship', HARBOR.ship.x, HARBOR.ship.y, { kind: 'trader_ship', solid: true, era: 'present', dialogue: 'trader_ship' }, 3, 1),
    obj('harbor_chain', HARBOR.chainFrom, HARBOR.chainRow, { kind: 'chain_taut', solid: true, era: 'present', dialogue: 'harbor_chain' }, HARBOR.chainTo - HARBOR.chainFrom + 1, 1),
    obj('tower_gate', HARBOR.gate.x, HARBOR.gate.y, { kind: 'gate_shut', solid: true, era: 'present', if: '!story.tower_open', dialogue: 'tower_gate' }),
    obj('chain_lamp', HARBOR.lamp.x, HARBOR.lamp.y, { kind: 'lamp_dark', solid: true, era: 'present', if: '!anchor.chain_lamp', dialogue: 'chain_lamp' }),
    obj('chain_lamp_lit', HARBOR.lamp.x, HARBOR.lamp.y, { kind: 'lamp_lit', solid: true, era: 'present', if: 'anchor.chain_lamp', dialogue: 'chain_lamp' }),
    obj('capstan', HARBOR.capstan.x, HARBOR.capstan.y, { kind: 'capstan', solid: true, era: 'both', dialogue: 'capstan' }),
    obj('tower_bracket', HARBOR.bracket.x, HARBOR.bracket.y, { kind: 'bracket_empty', solid: true, era: 'present', if: '!anchor.tower_mirror', dialogue: 'tower_bracket' }),
    obj('tower_bracket_mirror', HARBOR.bracket.x, HARBOR.bracket.y, { kind: 'bracket_mirror', solid: true, era: 'present', if: 'anchor.tower_mirror', dialogue: 'tower_bracket' }),
    obj('store_doors', HARBOR.storeDoors.x, HARBOR.storeDoors.y, { kind: 'store_doors', solid: true, era: 'present', if: '!story.flame_seen', dialogue: 'store_doors' }, 2, 1),
    obj('strongbox', HARBOR.strongbox.x, HARBOR.strongbox.y, { kind: 'strongbox', solid: true, era: 'present', dialogue: 'strongbox' }),
    obj('balance_lock', HARBOR.balanceLock.x, HARBOR.balanceLock.y, { kind: 'balance_lock', solid: true, era: 'present', dialogue: 'balance_lock' }),
    obj('factor_launch', HARBOR.launch.x, HARBOR.launch.y, { kind: 'crown_launch', solid: true, era: 'present', if: '!story.flame_seen', dialogue: 'factor_launch' }, 2, 1),
    obj('lane_jars', HARBOR.laneJars.x, HARBOR.laneJars.y, { kind: 'jar_stack', solid: true, era: 'present', if: '!clue.relay_route', dialogue: 'lane_jars' }),
    npc('store_enforcer_a', HARBOR.storeEnforcers[0]!.x, HARBOR.storeEnforcers[0]!.y, 'down', { if: DAY_TEXT }),
    npc('store_enforcer_b', HARBOR.storeEnforcers[1]!.x, HARBOR.storeEnforcers[1]!.y, 'down', { if: DAY_TEXT }),
    npc('tower_enforcer', HARBOR.towerEnforcer.x, HARBOR.towerEnforcer.y, 'right', { if: DAY_TEXT }),
    npc('aiyana_harbor', HARBOR.aiyana.x, HARBOR.aiyana.y, 'left', { npc: 'aiyana', if: `${DAY_DONE_TEXT}, !story.tower_open` }),
    npc('aiyana_quay', HARBOR.gate.x + 1, HARBOR.gateRow, 'down', { npc: 'aiyana', if: 'ally.jwaladesh, !act8.complete' }),
    npc('jw_harbour_master', HARBOR.harbourMaster.x, HARBOR.harbourMaster.y, 'down'),
    salkhi('salkhi_harbor', HARBOR.salkhi.x, HARBOR.salkhi.y, 'left'),
    // Fifty years ago (the Echo): the same chain, the Crown's hulls beyond it, Arjun at the stair head, a spare mirror.
    obj('echo_chain', HARBOR.chainFrom, HARBOR.chainRow, { kind: 'chain_taut', solid: true, era: 'echo', if: '!echo.chain_dropped', dialogue: 'echo_chain' }, HARBOR.chainTo - HARBOR.chainFrom + 1, 1),
    obj('echo_chain_slack', HARBOR.chainFrom, HARBOR.chainRow, { kind: 'chain_slack', solid: true, era: 'echo', if: 'echo.chain_dropped', dialogue: 'echo_chain' }, HARBOR.chainTo - HARBOR.chainFrom + 1, 1),
    obj('crown_hull_a', 12, 19, { kind: 'crown_hull', solid: true, era: 'echo', dialogue: 'crown_hull' }, 3, 1),
    obj('crown_hull_b', 19, 20, { kind: 'crown_hull', solid: true, era: 'echo', dialogue: 'crown_hull' }, 3, 1),
    obj('arjun_lamp', HARBOR.lamp.x, HARBOR.lamp.y, { kind: 'lamp_dark', solid: true, era: 'echo', if: '!anchor.chain_lamp', dialogue: 'arjun_lamp' }),
    obj('arjun_lamp_lit', HARBOR.lamp.x, HARBOR.lamp.y, { kind: 'lamp_lit', solid: true, era: 'echo', if: 'anchor.chain_lamp', dialogue: 'arjun_lamp_lit' }),
    obj('arjun_bracket', HARBOR.bracket.x, HARBOR.bracket.y, { kind: 'bracket_empty', solid: true, era: 'echo', if: '!anchor.tower_mirror', dialogue: 'arjun_bracket' }),
    obj('arjun_bracket_mirror', HARBOR.bracket.x, HARBOR.bracket.y, { kind: 'bracket_mirror', solid: true, era: 'echo', if: 'anchor.tower_mirror', dialogue: 'arjun_bracket_mirror' }),
    obj('spare_mirror', HARBOR.spareMirror.x, HARBOR.spareMirror.y, { kind: 'bracket_mirror', solid: true, era: 'echo', if: '!echo.spare_mirror, !anchor.tower_mirror', dialogue: 'spare_mirror' }),
    { layer: 'anchors', name: 'chain_lamp_anchor', x: HARBOR.lamp.x, y: HARBOR.lamp.y, props: { object: 'arjun_lamp', flag: 'anchor.chain_lamp' } },
    { layer: 'anchors', name: 'tower_mirror_anchor', x: HARBOR.bracket.x, y: HARBOR.bracket.y, props: { object: 'arjun_bracket', flag: 'anchor.tower_mirror' } },
    { layer: 'echo_zones', name: 'lamp_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, story.tower_open', onEcho: 'arjun_echo', onReturn: 'arjun_echo_return' } },
    npc('arjun', HARBOR.arjun.x, HARBOR.arjun.y, 'left', { era: 'echo' }),
  ];
  return { id: 'jwaladesh-harbor', present: g, echo: e, objects };
}

/**
 * The Lamp Bazaar (the hub, outdoor): the lamp lanes, brass and no oil; the temple steps' plaza at its head with the
 * Court's doors and the runners' hall (the minor Echo at their hearth); the main street down to the harbor stair, with
 * the wind off the sea on it (the relay's gust strips); the runners' way: left at the dyers, through the arch, along
 * the west wall; the dyers' roof where Aiyana is met, and its ladder up to the roofs; the Palm-Leaf Library; the
 * central lane east to the salt gate; the spice row with its debate corner and the shrine child; the Exchange's new
 * brick tower and its price-board.
 */
export function jwaladeshBazaar(): MapSource {
  const { w: W, h: H } = BAZAAR;
  const g = new Grid(W, H, WALL);
  // The plaza at the temple steps, the top lane, the west wall lane, the dyers' lane, the main street, the stair head.
  g.rect(12, 1, 19, 5, STONE).rect(18, 1, 7, 1, STEPS);
  g.rect(2, 4, 10, 2, STONE);
  g.rect(2, 4, 2, 22, STONE);
  g.rect(4, 24, 16, 2, STONE);
  g.rect(20, 1, 3, 28, STONE);
  g.rect(17, 26, 9, 3, STONE);
  // The central lane (west lane to the salt gate) and the spice row.
  g.rect(2, 14, 41, 2, STONE);
  g.rect(23, 17, 20, 2, STONE);
  g.rect(BAZAAR.arch.x, BAZAAR.arch.y, 2, 1, ARCH);
  // The dyers' vats below their lane; the dyers' roof and its outside stair.
  g.rect(6, 26, 10, 1, VAT);
  g.rect(BAZAAR.roof.x, BAZAAR.roof.y, BAZAAR.roof.w, BAZAAR.roof.h, ROOF);
  g.set(BAZAAR.roofStair.x, BAZAAR.roofStair.y, STAIR);
  // Old white domes over the blocks; the Exchange's new brick tower in the middle of them.
  put(g, DOME, [[6, 1], [8, 2], [27, 21], [32, 24], [36, 9], [40, 4], [15, 11], [6, 19], [34, 26], [12, 18]]);
  const t = BAZAAR.tower;
  g.rect(t.x, t.y, t.w, t.h, TOWER);
  // The library (its roof on the top row), the vendors' niches, their stalls.
  g.rect(5, 8, 7, 1, DOME);
  g.set(BAZAAR.library.x, BAZAAR.library.y, 'D');
  for (const n of [BAZAAR.milk, BAZAAR.beads, BAZAAR.sword]) g.set(n.x, n.y, STONE);
  put(g, STALL, [[12, 16], [14, 16], [17, 16], [33, 13], [35, 13]]);
  g.set(BAZAAR.court.x, BAZAAR.court.y, 'D');
  g.set(BAZAAR.ladder.x, BAZAAR.ladder.y, 'D');
  // Fifty years ago there was no tower: old domes stood there.
  const e = g.clone();
  e.rect(t.x, t.y, t.w, t.h, DOME);
  const z = BAZAAR.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'bazaar_harbor', x: BAZAAR.harbor.x, y: BAZAAR.harbor.y, props: { target: 'harbor_bazaar', map: 'jwaladesh-harbor', exit: 'up', if: '!item.relay_lamp', closed: 'relay_not_that_way' } },
    { layer: 'doors', name: 'bazaar_court', x: BAZAAR.court.x, y: BAZAAR.court.y, props: { target: 'court_out', map: 'jwaladesh-court', exit: 'down', if: 'story.aiyana_met, !item.relay_lamp', closed: 'court_doors_wait' } },
    { layer: 'doors', name: 'bazaar_library', x: BAZAAR.library.x, y: BAZAAR.library.y, props: { target: 'library_out', map: 'jwaladesh-library', exit: 'down', if: '!item.relay_lamp', closed: 'relay_not_that_way' } },
    { layer: 'doors', name: 'bazaar_flats', x: BAZAAR.saltGate.x, y: BAZAAR.saltGate.y, props: { target: 'flats_bazaar', map: 'jwaladesh-saltflats', exit: 'left', if: '!item.relay_lamp', closed: 'relay_not_that_way' } },
    { layer: 'doors', name: 'bazaar_roofs', x: BAZAAR.ladder.x, y: BAZAAR.ladder.y, props: { target: 'roofs_ladder', map: 'jwaladesh-rooftops', exit: 'down', if: 'anchor.chain_lamp, anchor.tower_mirror', closed: 'roof_ladder_wait' } },
    { layer: 'spawns', name: 'bazaar', x: 21, y: 26, props: { facing: 'up', era: 'present' } },
    { layer: 'spawns', name: 'stair_head', x: BAZAAR.stairHead.x, y: BAZAAR.stairHead.y, props: { facing: 'up', era: 'present' } },
    trigger('bazaar_arrive', 21, 26, { dialogue: 'bazaar_arrive', flag: 'story.bazaar_seen', once: true, onEnter: true, if: 'story.vikram_seen' }),
    // Aiyana on the dyers' roof (beat 1): from the roof's stair (again until they have met).
    trigger('aiyana_meet', BAZAAR.roof.x, BAZAAR.roof.y + 1, { dialogue: 'aiyana_meet', if: 'story.jwaladesh_arrived, !story.aiyana_met' }, BAZAAR.roof.w, 1),
    // The wind off the sea on the main street: with the relay lamp in hand it goes out (J-2, M-JWA-1's present half).
    ...BAZAAR.gusts.map((p, i) => trigger(`gust_${i + 1}`, p.x, p.y, { dialogue: 'relay_gust', if: 'item.relay_lamp' }, 3, 1)),
    // Aiyana on her roof all day; at the night lamp's hour she is at the chain tower.
    npc('aiyana', BAZAAR.aiyana.x, BAZAAR.aiyana.y, 'down', { if: DAY_TEXT }),
    npc('chief_runner', BAZAAR.chiefRunner.x, BAZAAR.chiefRunner.y, 'down'),
    ...BAZAAR.runners.map((r, i) => npc(`runner_${'ab'[i]}`, r.x, r.y, 'down', { npc: 'runner', if: '!story.dhanraj_beaten' })),
    npc('debate_flame_keeper', BAZAAR.keeper.x, BAZAAR.keeper.y, 'down'),
    npc('debate_gaze_pilgrim', BAZAAR.pilgrim.x, BAZAAR.pilgrim.y, 'down'),
    npc('shrine_child', BAZAAR.shrineChild.x, BAZAAR.shrineChild.y, 'down'),
    npc('jw_milk', BAZAAR.milk.x, BAZAAR.milk.y, 'up'),
    npc('jw_beads', BAZAAR.beads.x, BAZAAR.beads.y, 'up'),
    npc('jw_swordsmith', BAZAAR.sword.x, BAZAAR.sword.y, 'down'),
    salkhi('salkhi_bazaar', BAZAAR.salkhi.x, BAZAAR.salkhi.y, 'left'),
    obj('jw_board', BAZAAR.board.x, BAZAAR.board.y, { kind: 'sign', solid: true, era: 'present', dialogue: 'jw_board' }),
    obj('price_board', BAZAAR.priceBoard.x, BAZAAR.priceBoard.y, { kind: 'price_board', solid: true, era: 'present', dialogue: 'price_board' }),
    obj('dark_shrine', BAZAAR.shrine.x, BAZAAR.shrine.y, { kind: 'shrine_dark', solid: true, era: 'present', dialogue: 'dark_shrine' }),
    obj('dyer_mirror', BAZAAR.dyerMirror.x, BAZAAR.dyerMirror.y, { kind: 'mirror_down', solid: true, era: 'present', dialogue: 'dyer_mirror' }),
    ...BAZAAR.downMirrors.map((p, i) => obj(`down_mirror_${i + 1}`, p.x, p.y, { kind: 'mirror_down', solid: true, era: 'present', dialogue: 'down_mirror' })),
    obj('runners_hearth', BAZAAR.hearth.x, BAZAAR.hearth.y, { kind: 'hearth', solid: true, era: 'both', dialogue: 'runners_hearth' }),
    obj('hall_bracket', BAZAAR.hallBracket.x, BAZAAR.hallBracket.y, { kind: 'lamp_dark', solid: true, era: 'present', if: '!side.lamp_relay.done', dialogue: 'hall_bracket' }),
    obj('hall_bracket_lit', BAZAAR.hallBracket.x, BAZAAR.hallBracket.y, { kind: 'lamp_lit', solid: true, era: 'present', if: 'side.lamp_relay.done', dialogue: 'hall_bracket' }),
    obj('exchange_tower', BAZAAR.tower.x, BAZAAR.tower.y, { era: 'present', dialogue: 'exchange_tower' }, BAZAAR.tower.w, BAZAAR.tower.h),
    { layer: 'echo_zones', name: 'hearth_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, side.lamp_relay.accepted', onEcho: 'runners_echo' } },
    // Arjun's runners' hearth, fifty years ago.
    npc('echo_runner', BAZAAR.chiefRunner.x, BAZAAR.chiefRunner.y, 'down', { era: 'echo' }),
  ];
  return { id: 'jwaladesh-bazaar', present: g, echo: e, objects };
}

/**
 * The Roofs (the city's flat roofs, reached by the dyers' ladder; drawn as their own map, an interior so the ladder
 * stays a ladder): four roofs joined by plank bridges over the street; three bronze mirrors the player turns (Aiyana
 * unbolts their "cleaning" locks); the rusted fourth bracket where Anissa holds the last mirror; the Exchange's tower in
 * the old line; the temple's wick-window at the far end; the beam, drawn only when the whole route is right.
 */
export function jwaladeshRooftops(): MapSource {
  const { w: W, h: H } = ROOFTOPS;
  const g = new Grid(W, H, VOID);
  g.rect(2, 12, 8, 5, ROOF).rect(10, 13, 3, 1, PLANK).rect(13, 11, 6, 5, ROOF);
  g.rect(17, 9, 1, 2, PLANK).rect(13, 5, 6, 4, ROOF).rect(15, 3, 1, 2, PLANK).rect(2, 1, 17, 2, ROOF);
  const t = ROOFTOPS.tower;
  g.rect(t.x, t.y, t.w, t.h, TOWER);
  g.set(ROOFTOPS.ladder.x, ROOFTOPS.ladder.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'roofs_ladder', x: ROOFTOPS.ladder.x, y: ROOFTOPS.ladder.y, props: { target: 'bazaar_roofs', map: 'jwaladesh-bazaar', exit: 'up' } },
    { layer: 'spawns', name: 'roofs', x: ROOFTOPS.ladder.x, y: ROOFTOPS.ladder.y - 1, props: { facing: 'up', era: 'present' } },
    trigger('roofs_arrive', ROOFTOPS.ladder.x, ROOFTOPS.ladder.y - 1, { dialogue: 'roofs_arrive', flag: 'story.rooftops_entered', once: true, onEnter: true, if: 'anchor.tower_mirror' }),
    // The last bracket: with the three set round the tower, Aiyana's disc and Anissa (again until the beam is through).
    trigger('disc_again', 10, 2, { dialogue: 'disc_again', if: `${MIRROR_SOLUTION.map((f, i) => facingText(i + 1, f)).join(', ')}, anchor.chain_lamp, anchor.tower_mirror, !story.beam_at_temple` }, 5, 1),
    npc('aiyana_roof', ROOFTOPS.aiyana.x, ROOFTOPS.aiyana.y, 'left', { npc: 'aiyana', if: '!story.beam_at_temple' }),
    obj('bracket_4', ROOFTOPS.bracket4.x, ROOFTOPS.bracket4.y, { kind: 'bracket_empty', solid: true, era: 'present', dialogue: 'bracket_4' }),
    obj('wick_window', ROOFTOPS.window.x, ROOFTOPS.window.y, { kind: 'wick_window', solid: true, era: 'present', if: '!story.beam_at_temple', dialogue: 'roof_window' }, 1, 2),
    obj('wick_window_lit', ROOFTOPS.window.x, ROOFTOPS.window.y, { kind: 'wick_window_lit', solid: true, era: 'present', if: 'story.beam_at_temple', dialogue: 'roof_window' }, 1, 2),
    obj('roof_tower', t.x, t.y, { era: 'present', dialogue: 'roof_tower' }, t.w, t.h),
    // The beam: the light from the harbor arriving at the first mirror (once the tower mirror is bolted); against the
    // tower's brick when the first mirror sends it the old way; the whole way round once Anissa turns the last.
    obj('beam_in', 6, 14, { kind: 'beam_v', era: 'present', if: 'anchor.chain_lamp, anchor.tower_mirror' }, 1, 3),
    obj('beam_brick', 6, 11, { kind: 'beam_v', era: 'present', if: `anchor.chain_lamp, anchor.tower_mirror, ${facingText(1, 'n')}` }, 1, 2),
    obj('beam_1', 7, 13, { kind: 'beam_h', era: 'present', if: 'story.beam_at_temple' }, 9, 1),
    obj('beam_2', 16, 8, { kind: 'beam_v', era: 'present', if: 'story.beam_at_temple' }, 1, 5),
    obj('beam_3', 16, 3, { kind: 'beam_v', era: 'present', if: 'story.beam_at_temple' }, 1, 4),
    obj('beam_4', 2, 2, { kind: 'beam_h', era: 'present', if: 'story.beam_at_temple' }, 14, 1),
  ];
  // The three mirrors: face-down until Aiyana unbolts them, then the way each one faces (a flag each; south is none).
  ROOFTOPS.mirrors.forEach((p, i) => {
    const n = i + 1;
    objects.push(obj(`mirror_${n}_down`, p.x, p.y, { kind: 'mirror_down', solid: true, era: 'present', if: '!story.rooftops_entered', dialogue: `roof_mirror_${n}` }));
    for (const f of ['n', 'e', 's', 'w'] as const) {
      objects.push(obj(`mirror_${n}_${f}`, p.x, p.y, { kind: `mirror_${f}`, solid: true, era: 'present', if: `story.rooftops_entered, ${facingText(n, f)}`, dialogue: `roof_mirror_${n}` }));
    }
  });
  return { id: 'jwaladesh-rooftops', present: g, echo: g.clone(), objects, interior: true };
}

/** The Palm-Leaf Library (interior): nine books in bundles on three low shelves, the librarian. */
export function jwaladeshLibrary(): MapSource {
  const { w: W, h: H } = LIBRARY;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, PFLOOR);
  g.rect(1, 1, 4, 1, PSHELF).rect(7, 1, 4, 1, PSHELF).rect(13, 1, 4, 1, PSHELF);
  put(g, PSHELF, [[18, 5], [18, 6], [18, 7]]);
  g.set(LIBRARY.door.x, LIBRARY.door.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'library_out', x: LIBRARY.door.x, y: LIBRARY.door.y, props: { target: 'bazaar_library', map: 'jwaladesh-bazaar', exit: 'up' } },
    { layer: 'spawns', name: 'library', x: 10, y: 11, props: { facing: 'up', era: 'present' } },
    obj('jwa_lib_a', 1, 1, { dialogue: 'shelf.jwa_lib_a', era: 'present' }, 4, 1),
    obj('jwa_lib_b', 7, 1, { dialogue: 'shelf.jwa_lib_b', era: 'present' }, 4, 1),
    obj('jwa_lib_c', 13, 1, { dialogue: 'shelf.jwa_lib_c', era: 'present' }, 4, 1),
    npc('jw_librarian', LIBRARY.librarian.x, LIBRARY.librarian.y, 'right'),
  ];
  return { id: 'jwaladesh-library', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Court of the Flame (the seat of government, interior, 36 x 28): a colonnade to the flame altar under its
 * wick-window (curtained in saffron silk; a thumb's flame in the beam; a tall flame on oil at dawn); the ruler's seat;
 * the priests; the envoys' pavilion (the Crown's oil-factor and Seth Dhanraj as his guest, until the duel); the
 * treasury and its blank book; the records room; the duel yard (a sanded square with a rope round it, its east pocket);
 * the back gate's kitchen lane (J-3's delivery).
 */
export function jwaladeshCourt(): MapSource {
  const { w: W, h: H } = COURT;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, SAFFRON);
  g.rect(14, 1, 8, 5, DAIS);
  for (let y = 7; y <= 25; y += 2) g.set(14, y, COLUMN).set(21, y, COLUMN);
  // The pavilion, the treasury and the records room: rooms off the colonnade with gaps for doors.
  g.rect(1, 6, 12, 1, WALL).rect(12, 6, 1, 8, WALL).set(12, 10, SAFFRON);
  g.rect(1, 14, 12, 1, WALL).rect(12, 14, 1, 8, WALL).set(12, 17, SAFFRON);
  g.rect(1, 21, 12, 1, WALL);
  g.rect(23, 5, 12, 1, WALL).rect(23, 5, 1, 7, WALL).rect(23, 11, 12, 1, WALL).set(23, 8, SAFFRON);
  put(g, PSHELF, [[3, 15], [4, 15]]);
  // The duel yard: sand, roped round, its gate to the colonnade.
  const y = COURT.yard;
  g.rect(y.x, y.y, y.w, y.h, SAND);
  g.rect(y.x, y.y, y.w, 1, ROPE).rect(y.x, y.y + y.h - 1, y.w, 1, ROPE);
  g.set(COURT.door.x, COURT.door.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'court_out', x: COURT.door.x, y: COURT.door.y, props: { target: 'bazaar_court', map: 'jwaladesh-bazaar', exit: 'up' } },
    { layer: 'spawns', name: 'court', x: 17, y: 25, props: { facing: 'up', era: 'present' } },
    // The Court at noon (beat 2): the crane refused, the one word, the offer, Vikram's challenge, the duel (again until).
    trigger('court_hearing', 15, COURT.sceneRow, { dialogue: 'court_hearing', if: 'story.aiyana_met, !story.vikram_challenged' }, 6, 1),
    // The duel again, if it was left before it ended (a save between the challenge and the yard).
    trigger('duel_again', y.x + 1, y.y + 5, { dialogue: 'duel_again', if: 'story.vikram_challenged, !story.court_heard' }, y.w - 2, 1),
    trigger('duel_again_col', 15, COURT.sceneRow, { dialogue: 'duel_again', if: 'story.vikram_challenged, !story.court_heard' }, 6, 1),
    // The flame at night (beat 6): the beam on the curtain, the city at the doors, the curtain torn (again until).
    trigger('flame_scene', 15, COURT.sceneRow, { dialogue: 'flame_scene', if: 'story.beam_at_temple, !story.flame_seen' }, 6, 1),
    // The price at dawn (beat 8; again until the alliance is made).
    trigger('price_scene', 15, COURT.sceneRow, { dialogue: 'price_scene', if: 'story.dhanraj_beaten, !ally.jwaladesh' }, 6, 1),
    obj('wick_window', COURT.window.x, COURT.window.y, { kind: 'wick_window', solid: true, era: 'present', if: '!story.beam_at_temple', dialogue: 'court_window' }, 2, 1),
    obj('wick_window_lit', COURT.window.x, COURT.window.y, { kind: 'wick_window_lit', solid: true, era: 'present', if: 'story.beam_at_temple', dialogue: 'court_window' }, 2, 1),
    obj('altar_curtain', COURT.altar.x, COURT.altar.y, { kind: 'curtain', solid: true, era: 'present', if: '!story.flame_seen', dialogue: 'court_altar' }, 2, 2),
    obj('altar_thumb', COURT.altar.x, COURT.altar.y, { kind: 'altar_thumb', solid: true, era: 'present', if: 'story.flame_seen, !story.dhanraj_beaten', dialogue: 'court_altar' }, 2, 2),
    obj('altar_tall', COURT.altar.x, COURT.altar.y, { kind: 'altar_tall', solid: true, era: 'present', if: 'story.dhanraj_beaten', dialogue: 'court_altar' }, 2, 2),
    obj('crane_step', COURT.craneStep.x, COURT.craneStep.y, { kind: 'crane_paper', solid: true, era: 'present', if: 'story.crane_refused, !story.flame_seen', dialogue: 'crane_step' }),
    obj('crane_altar', COURT.altar.x + 2, COURT.altar.y, { kind: 'crane_paper', solid: true, era: 'present', if: 'story.flame_seen, !ally.jwaladesh', dialogue: 'crane_altar' }),
    obj('jwa_treasury', COURT.treasuryBook.x, COURT.treasuryBook.y, { era: 'present', dialogue: 'shelf.jwa_treasury' }, 2, 1),
    obj('jwa_court_records', COURT.records.x, COURT.records.y, { kind: 'shelf', solid: true, era: 'present', dialogue: 'shelf.jwa_court_records' }, 3, 1),
    obj('back_gate', COURT.backGate.x, COURT.backGate.y, { kind: 'gate_shut', solid: true, era: 'present', dialogue: 'back_gate' }),
    npc('meera', COURT.meera.x, COURT.meera.y, 'down'),
    npc('senior_keeper', COURT.keeper.x, COURT.keeper.y, 'down'),
    npc('junior_priest', COURT.junior.x, COURT.junior.y, 'right'),
    npc('jw_chamberlain', COURT.chamberlain.x, COURT.chamberlain.y, 'left'),
    npc('vikram_column', COURT.vikram.x, COURT.vikram.y, 'left', { npc: 'vikram_npc', if: '!story.vikram_challenged' }),
    npc('oil_factor', COURT.factor.x, COURT.factor.y, 'right', { if: '!story.court_heard' }),
    npc('dhanraj_guest', COURT.guest.x, COURT.guest.y, 'left', { npc: 'dhanraj_guest', if: '!story.court_heard' }),
    npc('carter_gate', COURT.carter.x, COURT.carter.y, 'left', { if: 'story.salt_road_cleared, !side.anonymous_oil.done' }),
    npc('dhanraj_kneeling', COURT.foxKneel.x, COURT.foxKneel.y, 'up', { npc: 'dhanraj_kneeling', if: 'choice.dhanraj_spared, story.dhanraj_beaten, !act8.complete' }),
  ];
  return { id: 'jwaladesh-court', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Salt Flats (wild, outdoor): the caravan road east from the salt gate to the salt-road shrine, where J-3's carter
 * waits; the white pans and the scrub off the road (the ambush layer, salt_flats: the road itself is safe); a Crown
 * oil-cart heading for the coast; the jackals' den.
 */
export function jwaladeshSaltflats(): MapSource {
  const { w: W, h: H } = FLATS;
  const g = new Grid(W, H, SALT);
  g.rect(0, FLATS.roadRows[0], FLATS.roadEnd + 1, 2, ROAD);
  put(g, SCRUB, [[5, 4], [11, 8], [17, 3], [24, 7], [33, 9], [38, 3], [7, 19], [14, 23], [26, 18], [31, 24], [37, 20], [43, 6], [44, 22], [2, 25]]);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'flats_bazaar', x: FLATS.gate.x, y: FLATS.gate.y, props: { target: 'bazaar_flats', map: 'jwaladesh-bazaar', exit: 'right' } },
    { layer: 'spawns', name: 'flats', x: 2, y: 13, props: { facing: 'right', era: 'present' } },
    trigger('flats_arrive', 1, 13, { dialogue: 'flats_arrive', flag: 'story.flats_seen', once: true, onEnter: true, if: 'story.jwaladesh_arrived' }),
    npc('carter', FLATS.carter.x, FLATS.carter.y, 'down', { if: '!story.salt_road_cleared' }),
    obj('carter_cart', FLATS.cart.x, FLATS.cart.y, { kind: 'carter_cart', solid: true, era: 'present', if: '!story.salt_road_cleared', dialogue: 'carter_cart' }),
    obj('salt_shrine', FLATS.shrine.x, FLATS.shrine.y, { kind: 'salt_shrine', solid: true, era: 'present', dialogue: 'salt_shrine' }, 2, 2),
    obj('crown_oil_cart', FLATS.oilCart.x, FLATS.oilCart.y, { kind: 'oil_cart', solid: true, era: 'present', dialogue: 'crown_oil_cart' }, 2, 1),
    obj('jackal_den', FLATS.den.x, FLATS.den.y, { kind: 'jackal_den', solid: true, era: 'present', dialogue: 'jackal_den' }, 2, 2),
    { layer: 'encounters', name: 'pans_north', x: 1, y: 1, w: 40, h: 10, props: { table: 'salt_flats', if: 'story.jwaladesh_arrived' } },
    { layer: 'encounters', name: 'pans_south', x: 1, y: 17, w: 40, h: 10, props: { table: 'salt_flats', if: 'story.jwaladesh_arrived' } },
  ];
  return { id: 'jwaladesh-saltflats', present: g, echo: g.clone(), objects };
}

export const JWALADESH_SOURCES: readonly (() => MapSource)[] = [jwaladeshHarbor, jwaladeshBazaar, jwaladeshRooftops, jwaladeshLibrary, jwaladeshCourt, jwaladeshSaltflats];
