// Kirinoura, Kuroshi's fog city, for Chapter 7, The Fog Files (docs/quest/reviews/2026-10-21-chapter7-outline.md with
// its second review, built Oct 22). Black water, grey planks and bridges, white paper screens in dark lacquer frames,
// violet-grey roofs, paper lanterns; the fog maze's paper lanes; the marsh's reeds and causeways. Places and the
// conditions the scenes share come from src/data/kuroshi.ts.
//
// Seven maps: the outline's six with the file house its own room (Claude's call, so the quest arrow can find its way
// to it through the marsh's back door before the front is unsealed). Restartable scenes (Chapter 3's rule): every
// scene that moves the story has a trigger that plays it again until its flag is set.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { rotorLookCondition } from '../../src/engine/rotor.ts';
import { CODE, FILEHOUSE, FLOOR_MAKER, HALL, HALL_OPEN, LIBRARY, MARSH, MAZE, NIGHTINGALE, PIER, QUARTER, SAYO_DOOR, SAYO_HOUSE, SCREENS, STACK_SHELVES } from '../../src/data/kuroshi.ts';

const PAVE = 'あ';
const KWALL = 'い';
const PLANK = 'う';
const CANAL = 'え';
const BRIDGE = 'お';
const LWALL = 'か';
const KROOF = 'き';
const LFLOOR = 'く';
const TATAMI = 'け';
const SCREENW = 'こ';
const REED = 'さ';
const MWATER = 'し';
const CAUSE = 'す';
const FOGL = 'せ';
const PAPERW = 'そ';
const STLANT = 'た';
const STALL = 'ち';
const TORII = 'つ';
const KSHELF = 'て';
const DESK = 'と';
const WTABLE = 'な';
const PILE = 'に';
const SHIP = 'ぬ';
const TABLE = 'ね';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

function border(g: Grid, ch: string): void {
  g.rect(0, 0, g.width, 1, ch).rect(0, g.height - 1, g.width, 1, ch).rect(0, 0, 1, g.height, ch).rect(g.width - 1, 0, 1, g.height, ch);
}

/** Bayarmaa's grey mare: an NPC placed by flag on the outdoor maps (not the maze, not the Hall), one per map. */
function salkhi(name: string, x: number, y: number, facing: string): ObjSpec {
  return npc(name, x, y, facing, { if: 'story.kuroshi_arrived, !act7.complete' });
}

/** K-1 Definitely Not a Spy: a place still to be shown, while the quest is open (built Oct 27). */
const K1_PLACE = (place: 'pier' | 'screen' | 'shoes'): string => `side.not_a_spy.accepted, !side.not_a_spy.${place}, !act7.complete`;

/**
 * The Lantern Pier (outdoor): the landing, the Crown observer's launch tied beside it (until the Fox is beaten), the
 * harbour-master's hut, a tea stall, the puddle and the lantern pile (Haru's first sighting), the stair up to the
 * quarter, and the end of the chapter on the pier (the petition made).
 */
export function kuroshiPier(): MapSource {
  const { w: W, h: H } = PIER;
  const g = new Grid(W, H, PLANK);
  border(g, KWALL);
  g.rect(1, 9, W - 2, H - 10, CANAL);
  g.rect(0, 9, 1, H - 9, KWALL).rect(W - 1, 9, 1, H - 9, KWALL);
  g.rect(12, 9, 4, 4, PLANK);
  g.rect(2, 2, 5, 1, KROOF).rect(2, 3, 5, 2, LWALL);
  g.set(PIER.teaStall.x, PIER.teaStall.y, STALL);
  g.set(PIER.pile.x, PIER.pile.y, PILE);
  g.rect(PIER.ship.x, PIER.ship.y, 2, 1, SHIP);
  put(g, STLANT, [[10, 1], [17, 1], [24, 5], [3, 7]]);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'pier_quarter', x: PIER.stair.x, y: PIER.stair.y, props: { target: 'quarter_pier', map: 'kuroshi-quarter', exit: 'down' } },
    { layer: 'spawns', name: 'pier', x: PIER.spawn.x, y: PIER.spawn.y, props: { facing: 'up', era: 'present' } },
    // The landing (beat 0): the mist, the lanterns lit at noon, the Crown's launch already here.
    trigger('pier_arrive', PIER.spawn.x, PIER.spawn.y, { dialogue: 'pier_arrive', flag: 'story.kuroshi_arrived', once: true, onEnter: true, if: 'act6.complete' }),
    // Haru's first sighting, as the party walks up the pier (again until he has been seen).
    trigger('pier_sighting', 12, PIER.sightRow, { dialogue: 'pier_sighting', if: 'story.kuroshi_arrived, !story.haru_seen_1' }, 4, 1),
    // The end of the chapter (beat 10): Haru, Bayarmaa and Salkhi with them (again until it sails).
    trigger('pier_end', 12, 9, { dialogue: 'pier_end', if: 'ally.kuroshi, !act7.complete' }, 4, 2),
    obj('pier_puddle', PIER.puddle.x, PIER.puddle.y, { kind: 'puddle', era: 'present', dialogue: 'pier_puddle' }),
    obj('crown_launch', PIER.launch.x, PIER.launch.y, { kind: 'crown_launch', solid: true, era: 'present', if: '!story.fox_beaten', dialogue: 'crown_launch' }, 2, 1),
    obj('pier_longship', PIER.ship.x, PIER.ship.y, { era: 'present', dialogue: 'pier_longship' }, 2, 1),
    obj('pier_tea', PIER.teaStall.x, PIER.teaStall.y, { era: 'present', dialogue: 'pier_tea' }),
    npc('harbour_master', PIER.harbourMaster.x, PIER.harbourMaster.y, 'down'),
    salkhi('salkhi_pier', PIER.salkhi.x, PIER.salkhi.y, 'left'),
    // K-1 Definitely Not a Spy (built Oct 27): Haru shows Yari how he hid behind the lantern pile (again until shown).
    trigger('spy_pier', 12, PIER.sightRow, { dialogue: 'spy_pier', if: K1_PLACE('pier') }, 4, 1),
  ];
  return { id: 'kuroshi-pier', present: g, echo: g.clone(), objects };
}

/**
 * The Lantern Quarter (the hub, outdoor): three canals and five bridges; the Hall of Screens' gate at the north edge
 * behind the main bridge; the fog maze's gate (north-east, beyond a torii, opens with Haru) and the marsh road (east,
 * shut by the Hall's fog order until the causeway is lit); the Lantern Library (west); the tea house with its sliding
 * screen (Haru's second sighting); the debate corner on the middle bridge; the tea seller, the paper-maker and the
 * armourer on the east bank; the fishers' family at the marsh road; Lady Sayo's House, shut (S-KUR after the release).
 */
export function kuroshiQuarter(): MapSource {
  const { w: W, h: H } = QUARTER;
  const g = new Grid(W, H, PAVE);
  border(g, KWALL);
  g.rect(1, 4, W - 2, 2, CANAL).rect(26, 6, 2, 14, CANAL).rect(1, 20, W - 2, 2, CANAL);
  g.rect(19, 4, 2, 2, BRIDGE).rect(34, 4, 2, 2, BRIDGE).rect(26, 11, 2, 3, BRIDGE).rect(12, 20, 2, 2, BRIDGE).rect(32, 20, 2, 2, BRIDGE);
  // Lady Sayo's House (shut), the Hall's facade either side of its gate, the torii before the maze.
  g.rect(2, 1, 8, 1, KROOF).rect(2, 2, 8, 2, LWALL);
  g.set(SAYO_DOOR.x, SAYO_DOOR.y, 'D');
  g.rect(14, 1, 4, 1, SCREENW).rect(22, 1, 4, 1, SCREENW);
  put(g, TORII, [[33, 1], [36, 1]]);
  // The Lantern Library and the tea house (its sliding screen on the front wall).
  g.rect(2, 7, 7, 1, KROOF).rect(2, 8, 7, 3, LWALL);
  g.set(QUARTER.library.x, QUARTER.library.y, 'D').set(QUARTER.hallGate.x, QUARTER.hallGate.y, 'D');
  g.rect(15, 15, 5, 1, KROOF).rect(15, 16, 5, 2, LWALL);
  // The east bank's stalls, and stone lanterns along the canals.
  put(g, STALL, [[QUARTER.tea.x, QUARTER.tea.y - 1], [QUARTER.paper.x, QUARTER.paper.y - 1], [QUARTER.armourer.x + 1, QUARTER.armourer.y]]);
  put(g, STLANT, [[12, 7], [25, 8], [30, 7], [3, 18], [24, 23], [29, 25], [7, 25], [38, 18]]);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'quarter_pier', x: QUARTER.pier.x, y: QUARTER.pier.y, props: { target: 'pier_quarter', map: 'kuroshi-pier', exit: 'up' } },
    { layer: 'doors', name: 'quarter_hall', x: QUARTER.hallGate.x, y: QUARTER.hallGate.y, props: { target: 'hall_out', map: 'kuroshi-hall', exit: 'down', if: HALL_OPEN, closed: 'hall_gate_wait' } },
    { layer: 'doors', name: 'quarter_library', x: QUARTER.library.x, y: QUARTER.library.y, props: { target: 'library_out', map: 'kuroshi-library', exit: 'down' } },
    { layer: 'doors', name: 'quarter_maze', x: QUARTER.mazeGate.x, y: QUARTER.mazeGate.y, props: { target: 'maze_quarter', map: 'kuroshi-fogmaze', exit: 'down', if: 'party.haru', closed: 'maze_gate_shut' } },
    { layer: 'doors', name: 'quarter_marsh', x: QUARTER.marshGate.x, y: QUARTER.marshGate.y, props: { target: 'marsh_quarter', map: 'kuroshi-marsh', exit: 'left', if: 'story.causeway_lit', closed: 'marsh_gate_shut' } },
    { layer: 'spawns', name: 'quarter', x: 13, y: 27, props: { facing: 'up', era: 'present' } },
    // Up from the pier (beat 1): the Crown's observer crosses the main bridge with a clerk and a file-box, far off.
    trigger('quarter_arrive', 13, 27, { dialogue: 'quarter_arrive', flag: 'story.observer_seen', once: true, onEnter: true, if: 'story.kuroshi_arrived' }),
    // The tea house's screen slides a hand's width as the party passes (Haru's second sighting; again until seen).
    trigger('screen_slides', 1, QUARTER.screenRow, { dialogue: 'screen_slides', if: 'story.observer_seen, !story.haru_seen_2' }, 25, 1),
    // The gate guard stops the envoy before the main bridge; the signal master takes Torvald's letter (again until).
    trigger('hall_gate', 15, QUARTER.gateRow, { dialogue: 'hall_gate', if: '!story.letter_given' }, 10, 1),
    // Dusk: the day's two things done, the guard calls the lantern hour and the lighters walk the bridges (again until).
    trigger('lantern_call', 15, QUARTER.gateRow, { dialogue: 'lantern_call', if: 'story.letter_given, side.spy_ledger.done, debate.kuroshi_silence.settled, !story.lantern_called, !story.haru_met' }, 10, 1),
    npc('gate_guard_kq', QUARTER.gateGuard.x, QUARTER.gateGuard.y, 'down'),
    npc('debate_balance_keeper', QUARTER.keeper.x, QUARTER.keeper.y, 'down'),
    npc('debate_whisperer', QUARTER.whisperer.x, QUARTER.whisperer.y, 'down'),
    npc('kq_fisher_woman', QUARTER.fisherWoman.x, QUARTER.fisherWoman.y, 'down', { if: '!story.boats_home' }),
    npc('kq_fisher_boy', QUARTER.fisherBoy.x, QUARTER.fisherBoy.y, 'down', { if: '!story.boats_home' }),
    npc('kq_tea', QUARTER.tea.x, QUARTER.tea.y, 'down'),
    npc('kq_paper', QUARTER.paper.x, QUARTER.paper.y, 'down'),
    npc('kq_armourer', QUARTER.armourer.x, QUARTER.armourer.y, 'left'),
    salkhi('salkhi_quarter', QUARTER.salkhi.x, QUARTER.salkhi.y, 'down'),
    obj('kq_board', QUARTER.board.x, QUARTER.board.y, { kind: 'sign', solid: true, era: 'present', dialogue: 'kq_board' }),
    obj('teahouse_screen', QUARTER.screen.x, QUARTER.screen.y, { solid: true, era: 'present', dialogue: 'teahouse_screen' }),
    // K-4 The Letter in the Floor (built Oct 27): Lady Sayo's door on the house's east side, opened by the old floor-maker
    // at dawn; K-1's tea house strip (Haru in the gap by the screen again; again until shown).
    { layer: 'doors', name: 'quarter_sayo', x: SAYO_DOOR.x, y: SAYO_DOOR.y, props: { target: 'sayo_out', map: 'kuroshi-sayo-house', exit: 'right', if: 'side.letter_floor.accepted', closed: 'sayo_house_shut' } },
    npc('floor_maker', FLOOR_MAKER.x, FLOOR_MAKER.y, 'left', { if: 'story.quarter_dawn, !act7.complete' }),
    trigger('spy_screen', 13, QUARTER.screenRow, { dialogue: 'spy_screen', if: K1_PLACE('screen') }, 7, 1),
  ];
  return { id: 'kuroshi-quarter', present: g, echo: g.clone(), objects };
}

/**
 * The Lantern Library (interior): three shelves of nine books, Kayla's desk (the Echo in front of it: Sayo's clerk at
 * the same desk, fifty years ago), the librarian, the Suzumori elder (K-5's giver, placed), and behind a partition
 * the sealed stacks (K-2): the paper seal on its door, a high window over the reading tables, nine glyph shelves, and
 * three Fog Cutpurses at work with their backs to the near lane.
 */
export function kuroshiLibrary(): MapSource {
  const { w: W, h: H } = LIBRARY;
  const g = new Grid(W, H, LWALL);
  g.rect(1, 1, W - 2, H - 2, LFLOOR);
  g.rect(15, 1, 1, 12, LWALL);
  g.rect(1, 1, 4, 1, KSHELF).rect(6, 1, 4, 1, KSHELF).rect(11, 1, 4, 1, KSHELF);
  g.rect(LIBRARY.stackX, LIBRARY.stackTop, 1, STACK_SHELVES.length, KSHELF);
  g.set(LIBRARY.desk.x, LIBRARY.desk.y, DESK).set(LIBRARY.desk.x + 1, LIBRARY.desk.y, DESK);
  put(g, TABLE, [[3, 6], [4, 6], [12, 9], [13, 9]]);
  g.set(LIBRARY.door.x, LIBRARY.door.y, 'D');
  const z = LIBRARY.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'library_out', x: LIBRARY.door.x, y: LIBRARY.door.y, props: { target: 'quarter_library', map: 'kuroshi-quarter', exit: 'up' } },
    { layer: 'spawns', name: 'library', x: 10, y: 11, props: { facing: 'up', era: 'present' } },
    // Kayla, bumped into (K-2's start): Azzy stops dead in the aisle (again until they have met).
    trigger('kayla_meet', 1, 9, { dialogue: 'kayla_meet', if: 'story.letter_given, !story.kayla_met' }, 14, 1),
    obj('kur_lib_a', 1, 1, { dialogue: 'shelf.kur_lib_a', era: 'present' }, 4, 1),
    obj('kur_lib_b', 6, 1, { dialogue: 'shelf.kur_lib_b', era: 'present' }, 4, 1),
    obj('kur_lib_c', 11, 1, { dialogue: 'shelf.kur_lib_c', era: 'present' }, 4, 1),
    obj('kayla_desk', LIBRARY.desk.x, LIBRARY.desk.y, { era: 'present', dialogue: 'kayla_desk' }, 2, 1),
    obj('clerk_desk_echo', LIBRARY.desk.x, LIBRARY.desk.y, { era: 'echo', dialogue: 'clerk_desk_echo' }, 2, 1),
    npc('kayla', LIBRARY.kayla.x, LIBRARY.kayla.y, 'down'),
    npc('sayo_clerk', LIBRARY.kayla.x, LIBRARY.kayla.y, 'down', { era: 'echo' }),
    npc('kq_librarian', LIBRARY.librarian.x, LIBRARY.librarian.y, 'right'),
    npc('suzumori_elder', LIBRARY.elder.x, LIBRARY.elder.y, 'up'),
    { layer: 'echo_zones', name: 'desk_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, side.spy_ledger.accepted', onEcho: 'clerk_echo' } },
    // The sealed stacks: the seal on the door, the window a reader could climb, and the shelves.
    obj('stacks_seal', LIBRARY.seal.x, LIBRARY.seal.y, { kind: 'paper_seal', solid: true, era: 'present', dialogue: 'stacks_seal' }),
    obj('stacks_window', LIBRARY.window.x, LIBRARY.window.y, { kind: 'window', walkable: true, era: 'present', if: 'side.spy_ledger.accepted' }),
    ...STACK_SHELVES.map((_, i) => obj(`stack_${i + 1}`, LIBRARY.stackX, LIBRARY.stackTop + i, { solid: true, era: 'present', dialogue: `stack_${i + 1}` })),
    ...LIBRARY.cutpurses.map((c, i) => npc(`stacks_cutpurse_${'abc'[i]}`, c.x, c.y, 'right', { npc: 'stacks_cutpurse', if: 'side.spy_ledger.accepted, !story.stacks_cleared, !side.spy_ledger.done' })),
    // In front of them (their sightline): stepping here is being seen, and the fight (the stealth's fail-safe).
    trigger('stacks_seen', LIBRARY.sightX, LIBRARY.sightRows[0], { dialogue: 'stacks_seen', if: 'side.spy_ledger.accepted, !story.stacks_cleared, !side.spy_ledger.done' }, 1, LIBRARY.sightRows[1] - LIBRARY.sightRows[0] + 1),
  ];
  return { id: 'kuroshi-library', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Hall of Screens (the seat of government, interior, 36 x 26): a corridor of fixed screens to the dais where Kaede
 * Suzumori kneels at a writing table; the two retainers either side of it; the tea room for envoys (the Crown's
 * observer and the broker as his guest, until the lantern hour; then the observer's tea bowl); the records room (the
 * Hall's books); the signal tower stair (the signal master); the passage to the file house, its door sealed with paper
 * and the Neutrality Order pasted beside it, and the keeper of files standing at it.
 */
export function kuroshiHall(): MapSource {
  const { w: W, h: H } = HALL;
  const g = new Grid(W, H, LWALL);
  g.rect(1, 1, W - 2, H - 2, LFLOOR);
  g.rect(12, 1, 12, 4, TATAMI);
  g.set(HALL.table.x, HALL.table.y, WTABLE);
  for (let y = 6; y <= 24; y++) g.set(14, y, SCREENW).set(21, y, SCREENW);
  for (const y of [9, 10, 17, 18]) g.set(14, y, LFLOOR);
  for (const y of [11, 12, 17, 18]) g.set(21, y, LFLOOR);
  g.rect(1, 5, 11, 1, LWALL).rect(24, 5, 11, 1, LWALL);
  g.rect(1, 13, 13, 1, LWALL).rect(22, 14, 13, 1, LWALL);
  g.rect(1, 14, 4, 1, KSHELF);
  put(g, TABLE, [[5, 11], [8, 11], [28, 9], [29, 9]]);
  g.set(HALL.door.x, HALL.door.y, 'D').set(HALL.fileDoor.x, HALL.fileDoor.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'hall_out', x: HALL.door.x, y: HALL.door.y, props: { target: 'quarter_hall', map: 'kuroshi-quarter', exit: 'up' } },
    { layer: 'doors', name: 'hall_filehouse', x: HALL.fileDoor.x, y: HALL.fileDoor.y, props: { target: 'fh_front', map: 'kuroshi-filehouse', exit: 'left', if: 'story.fox_beaten', closed: 'filehouse_sealed' } },
    { layer: 'spawns', name: 'hall', x: 17, y: 23, props: { facing: 'up', era: 'present' } },
    // The lantern hour (beat 3): the letter read, the order, the retainers, Haru (again until he has joined).
    trigger('lantern_hour', 15, HALL.sceneRow, { dialogue: 'lantern_hour', if: '!story.haru_met' }, 6, 1),
    // The petition at dawn (beat 9): the receipts read, the order turned, the price, the crane, Haru leaves (again until).
    trigger('petition', 15, HALL.sceneRow, { dialogue: 'petition', if: 'clue.buyers_mark, !ally.kuroshi' }, 6, 1),
    npc('kaede', HALL.kaede.x, HALL.kaede.y, 'down'),
    npc('retainer_neutral', HALL.neutral.x, HALL.neutral.y, 'right'),
    npc('retainer_war', HALL.war.x, HALL.war.y, 'left'),
    npc('signal_master', HALL.signalMaster.x, HALL.signalMaster.y, 'left', { if: 'story.letter_given' }),
    npc('crown_observer', HALL.observer.x, HALL.observer.y, 'right', { if: '!story.haru_met' }),
    npc('broker', HALL.broker.x, HALL.broker.y, 'left', { if: '!story.haru_met' }),
    npc('keeper_files', HALL.keeper.x, HALL.keeper.y, 'right'),
    // The Fox, kneeling at the corridor's foot, if he was brought to the dais.
    npc('fox_bound', HALL.foxBound.x, HALL.foxBound.y, 'up', { if: 'choice.fox_spared, story.fox_beaten, !act7.complete' }),
    obj('kaede_table', HALL.table.x, HALL.table.y, { era: 'present', dialogue: 'kaede_table' }),
    // Two shoes under a screen's hem (Haru's third sighting, before he steps out).
    obj('haru_shoes', HALL.shoes.x, HALL.shoes.y, { era: 'present', solid: true, if: '!story.haru_met', dialogue: 'haru_shoes' }),
    obj('observer_bowl', HALL.teaBowl.x, HALL.teaBowl.y, { kind: 'tea_bowl', era: 'present', solid: true, if: 'story.fox_beaten', dialogue: 'observer_bowl' }),
    obj('kite_codes', 28, 5, { solid: true, era: 'present', dialogue: 'kite_codes' }),
    obj('kur_hall_order', HALL.order.x, HALL.order.y, { kind: 'notice', solid: true, era: 'present', dialogue: 'shelf.kur_hall_order' }),
    obj('kur_hall_records', 1, 14, { era: 'present', dialogue: 'shelf.kur_hall_records' }, 4, 1),
    // K-1 (built Oct 27): the screen where his shoes showed under the hem (again until shown).
    trigger('spy_shoes', 15, HALL.shoes.y, { dialogue: 'spy_shoes', if: K1_PLACE('shoes') }, 6, 1),
  ];
  return { id: 'kuroshi-hall', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The file house (interior; its own room behind the Hall's sealed door): the north stack of lacquer file-boxes with
 * the floor stone under it; a row of shut lanes; the 3 x 3 grid of pivoting screens (engine/rotor.ts, the loose one in
 * the middle); Sayo's wall map on the west wall (a faded square now, the Echo zone in front of it); the signal tower's
 * back door from the marsh (west) and the front door to the Hall (south, sealed until the Fox is beaten). Fifty years
 * ago it was Sayo's war room: the map whole, the loose screen in the middle of the room.
 */
export function kuroshiFilehouse(): MapSource {
  const { w: W, h: H } = FILEHOUSE;
  const g = new Grid(W, H, LWALL);
  g.rect(1, 1, W - 2, H - 2, LFLOOR);
  g.rect(1, 1, W - 2, 1, KSHELF);
  g.rect(1, 5, 1, 7, LWALL);
  g.set(FILEHOUSE.front.x, FILEHOUSE.front.y, 'D');
  g.set(FILEHOUSE.back.x, FILEHOUSE.back.y, 'D');
  const e = g.clone();
  put(e, TABLE, [[5, 13], [6, 13], [15, 4]]);
  const z = FILEHOUSE.zone;
  const screens: ObjSpec[] = [];
  FILEHOUSE.screens.forEach((p, i) => {
    if (i === SCREENS.peg!.index) {
      // The loose screen: it rests east and slips back after every push; pegged, it holds north.
      screens.push(obj(`screen_${i}_held`, p.x, p.y, { kind: 'screen_n', solid: true, era: 'present', if: 'anchor.screen_peg', dialogue: `screen_push_${i}` }));
      screens.push(obj(`screen_${i}_loose`, p.x, p.y, { kind: 'screen_loose', solid: true, era: 'present', if: '!anchor.screen_peg', dialogue: `screen_push_${i}` }));
      return;
    }
    for (const [d, kind] of ['screen_n', 'screen_e', 'screen_s', 'screen_w'].entries()) {
      screens.push(obj(`screen_${i}_${'nesw'[d]}`, p.x, p.y, { kind, solid: true, era: 'present', if: rotorLookCondition(SCREENS, i, d), dialogue: `screen_push_${i}` }));
    }
  });
  const loose = FILEHOUSE.screens[SCREENS.peg!.index]!;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'fh_front', x: FILEHOUSE.front.x, y: FILEHOUSE.front.y, props: { target: 'hall_filehouse', map: 'kuroshi-hall', exit: 'up', if: 'story.fox_beaten', closed: 'fh_front_shut' } },
    { layer: 'doors', name: 'fh_back', x: FILEHOUSE.back.x, y: FILEHOUSE.back.y, props: { target: 'marsh_tower', map: 'kuroshi-marsh', exit: 'right' } },
    { layer: 'spawns', name: 'filehouse', x: 2, y: 13, props: { facing: 'right', era: 'present' } },
    trigger('filehouse_enter', 2, 13, { dialogue: 'filehouse_enter', flag: 'story.filehouse_entered', once: true, onEnter: true, if: 'story.causeway_lit' }),
    // The north stack (beat 7): the broker at the floor stone, and the Fox (again until he is beaten).
    trigger('fox_scene', 1, FILEHOUSE.stackRow, { dialogue: 'fox_scene', if: 'story.spy_map_read, !story.fox_beaten' }, W - 2, 1),
    obj('lanes_shut', 1, FILEHOUSE.lanesRow, { kind: 'lanes_shut', solid: true, era: 'present', if: '!rotor.screens.solved', dialogue: 'lanes_shut' }, W - 2, 1),
    obj('floor_stone', FILEHOUSE.stone.x, FILEHOUSE.stone.y, { kind: 'floor_stone', era: 'present', if: 'story.spy_map_read', dialogue: 'floor_stone' }),
    obj('north_stack', 1, 1, { era: 'present', dialogue: 'north_stack' }, W - 2, 1),
    ...screens,
    obj('torn_paper_a', 8, 3, { kind: 'screen_torn', era: 'present', if: 'story.fox_beaten, rotor.screens.solved' }),
    obj('torn_paper_b', 13, 2, { kind: 'screen_torn', era: 'present', if: 'story.fox_beaten' }),
    obj('sayo_map', FILEHOUSE.map.x, FILEHOUSE.map.y, { kind: 'map_wall', solid: true, era: 'present', dialogue: 'sayo_map' }, 1, 3),
    obj('sayo_map_echo', FILEHOUSE.map.x, FILEHOUSE.map.y, { kind: 'map_wall_pins', solid: true, era: 'echo', dialogue: 'sayo_map_echo' }, 1, 3),
    // The anchor: the loose screen in Sayo's war room. Patricio sets its peg; the screen stops turning now too.
    obj('loose_screen', loose.x, loose.y, { kind: 'screen_loose', solid: true, era: 'echo', if: '!anchor.screen_peg', dialogue: 'loose_screen' }),
    obj('pegged_screen_echo', loose.x, loose.y, { kind: 'screen_n', solid: true, era: 'echo', if: 'anchor.screen_peg' }),
    { layer: 'anchors', name: 'screen_peg', x: loose.x, y: loose.y, props: { object: 'loose_screen', flag: 'anchor.screen_peg' } },
    { layer: 'echo_zones', name: 'map_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, story.filehouse_entered', onEcho: 'sayo_echo', onReturn: 'sayo_echo_return' } },
    npc('sayo', FILEHOUSE.sayo.x, FILEHOUSE.sayo.y, 'down', { era: 'echo' }),
  ];
  return { id: 'kuroshi-filehouse', present: g, echo: e, objects, interior: true };
}

const MAZE_LANES: readonly (readonly [number, number])[][] = [
  [[13, 23], [12, 23], [11, 23], [10, 23], [10, 22], [10, 21]],
  [[10, 17], [10, 16], [10, 15]],
  [[12, 13], [13, 13], [14, 13], [15, 13], [16, 13], [16, 12], [16, 11]],
  [[18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [22, 8], [22, 7]],
  [[20, 5], [19, 5], [18, 5], [17, 5], [17, 4]],
];
/** The wrong ways out of each plaza (two tiles each; the second is the fog that turns you back). */
const MAZE_DEAD: readonly (readonly [number, number])[][] = [
  [[15, 21], [15, 20], [17, 23], [18, 23]],
  [[8, 19], [7, 19], [12, 19], [13, 19]],
  [[8, 13], [7, 13], [10, 11], [10, 10]],
  [[14, 9], [13, 9], [16, 7], [16, 6]],
  [[22, 3], [22, 2], [24, 5], [25, 5]],
  [[15, 2], [14, 2], [19, 2], [20, 2]],
];

/** The three posts at a plaza, read left to right: over the west way, beside the north way, over the east way. */
export function mazePosts(c: { x: number; y: number }): [number, number][] {
  return [[c.x - 2, c.y - 1], [c.x - 1, c.y - 2], [c.x + 2, c.y - 1]];
}

/**
 * The fog maze (outdoor; SIG-KUR part 1): paper walls and lanes, fog to the edge of the screen (MAP_MOODS); the gate
 * yard where Anissa holds the door (its Echo zone: Sayo's agents light the three patterns on the yard's posts, the
 * code); six plazas, each lit as the party comes in, three posts telling the way on; the wrong ways end in fog that
 * turns the party back to the plaza it left (the review's 3.7); the far gap onto the marsh, which turns back a party
 * that walked it without the code (the review's 3.8).
 */
export function kuroshiFogmaze(): MapSource {
  const { w: W, h: H } = MAZE;
  const g = new Grid(W, H, PAPERW);
  const y = MAZE.yard;
  g.rect(y.x, y.y, y.w, y.h, FOGL);
  for (const c of MAZE.plazas) g.rect(c.x - 1, c.y - 1, 3, 3, FOGL).set(c.x, c.y + 2, FOGL);
  for (const lane of [...MAZE_LANES, ...MAZE_DEAD]) put(g, FOGL, lane);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'maze_quarter', x: MAZE.gate.x, y: MAZE.gate.y, props: { target: 'quarter_maze', map: 'kuroshi-quarter', exit: 'up' } },
    { layer: 'doors', name: 'maze_marsh', x: MAZE.gap.x, y: MAZE.gap.y, props: { target: 'marsh_maze', map: 'kuroshi-marsh', exit: 'down' } },
    { layer: 'spawns', name: 'maze_gate', x: 16, y: 28, props: { facing: 'up', era: 'present' } },
    ...MAZE.plazas.map((c, i) => ({ layer: 'spawns' as const, name: `mj${i + 1}`, x: c.x, y: c.y, props: { facing: 'up', era: 'present' } })),
    trigger('maze_arrive', 14, 28, { dialogue: 'maze_arrive', flag: 'story.maze_seen', once: true, onEnter: true, if: 'party.haru' }),
    { layer: 'echo_zones', name: 'gate_echo', x: MAZE.zone.x, y: MAZE.zone.y, w: MAZE.zone.w, h: MAZE.zone.h, props: { if: 'item.sun_locket, party.haru', onEcho: 'lantern_echo' } },
    // Each plaza's posts light as the party comes in at its south side.
    ...MAZE.plazas.map((c, i) => trigger(`maze_j${i + 1}`, c.x, c.y + 2, { dialogue: `maze_lit_${i + 1}`, flag: `story.maze_j${i + 1}`, once: true })),
    // The wrong ways: the fog closes, and the plaza is behind you again.
    ...MAZE_DEAD.flatMap((d, i) => [d[1]!, d[3]!].map(([x, yy], k) => trigger(`fog_return_${i + 1}${'ab'[k]}`, x, yy, { dialogue: `fog_return_${i + 1}` }))),
    // The far gap: with the code, the maze is walked; without it, Haru turns them back to look (again until).
    trigger('maze_blind', MAZE.gap.x, MAZE.gap.y + 1, { dialogue: 'maze_blind', if: '!clue.lantern_code' }),
    trigger('maze_walked', MAZE.gap.x, MAZE.gap.y + 1, { dialogue: 'maze_walked', flag: 'story.maze_walked', once: true, if: 'clue.lantern_code' }),
  ];
  // The plazas' posts: dark until the party comes in, then lit in the way on's pattern.
  MAZE.plazas.forEach((c, i) => {
    const code = CODE[MAZE.route[i]!];
    mazePosts(c).forEach(([x, yy], k) => {
      objects.push(obj(`post_${i + 1}_${k + 1}_dark`, x, yy, { kind: 'post_dark', solid: true, era: 'present', if: `!story.maze_j${i + 1}`, dialogue: 'post_dark' }));
      objects.push(obj(`post_${i + 1}_${k + 1}_lit`, x, yy, { kind: `post_${code[k]}`, solid: true, era: 'present', if: `story.maze_j${i + 1}`, dialogue: `post_${code[k]}` }));
    });
  });
  // The Echo: three groups of three posts round the gate yard, lit by Sayo's agents (left, straight, right).
  const groups: [string, [number, number][]][] = [
    ['left', [[8, 26], [8, 27], [8, 28]]],
    ['straight', [[11, 25], [12, 25], [13, 25]]],
    ['right', [[21, 26], [21, 27], [21, 28]]],
  ];
  groups.forEach(([turn, posts], gi) => {
    const code = CODE[turn as keyof typeof CODE];
    posts.forEach(([x, yy], k) => {
      objects.push(obj(`echo_post_${gi + 1}_${k + 1}_dark`, x, yy, { kind: 'post_dark', solid: true, era: 'echo', if: `!echo.code_${gi + 1}` }));
      objects.push(obj(`echo_post_${gi + 1}_${k + 1}_lit`, x, yy, { kind: `post_${code[k]}`, solid: true, era: 'echo', if: `echo.code_${gi + 1}`, dialogue: `echo_post_${turn}` }));
    });
  });
  return { id: 'kuroshi-fogmaze', present: g, echo: g.clone(), objects };
}

/**
 * The Fog Marsh (wild, outdoor): the causeway from the maze's gap to the fishers' huts and their yard (the press, the
 * old fisher, the boy); the six marsh posts (M-KUR-2: the fork's three north of the yard, the bend's three south of
 * it); the second causeway east to the signal tower's back door, hidden by a fog bank until the posts are lit right;
 * the reed paths off the causeways (the ambush layer, fog_marsh: the causeway itself is safe); the road home to the
 * quarter (west), shut by the Hall's fog order until the causeway is lit (the review's 3.8).
 */
export function kuroshiMarsh(): MapSource {
  const { w: W, h: H } = MARSH;
  const g = new Grid(W, H, MWATER);
  g.rect(5, 14, 2, 14, CAUSE).rect(7, 14, 6, 2, CAUSE).rect(0, 14, 5, 2, CAUSE);
  g.rect(13, 13, 13, 3, CAUSE);
  g.rect(26, 14, 19, 2, CAUSE).rect(45, 14, 1, 2, 'D');
  g.rect(14, 9, 6, 1, KROOF).rect(14, 10, 6, 3, LWALL);
  g.rect(42, 9, 3, 4, KWALL);
  g.rect(1, 17, 4, 9, REED).rect(7, 17, 6, 9, REED).rect(28, 10, 14, 4, REED);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'marsh_maze', x: MARSH.maze.x, y: MARSH.maze.y, w: 2, props: { target: 'maze_marsh', map: 'kuroshi-fogmaze', exit: 'up' } },
    { layer: 'doors', name: 'marsh_quarter', x: MARSH.quarter.x, y: MARSH.quarter.y, h: 2, props: { target: 'quarter_marsh', map: 'kuroshi-quarter', exit: 'right', if: 'story.causeway_lit', closed: 'marsh_road_shut' } },
    { layer: 'doors', name: 'marsh_tower', x: MARSH.tower.x, y: MARSH.tower.y, h: 2, props: { target: 'fh_back', map: 'kuroshi-filehouse', exit: 'left' } },
    { layer: 'spawns', name: 'marsh', x: 5, y: 25, props: { facing: 'up', era: 'present' } },
    trigger('marsh_arrive', 5, 26, { dialogue: 'marsh_arrive', flag: 'story.marsh_reached', once: true, onEnter: true, if: 'party.haru' }),
    npc('kq_old_fisher', MARSH.oldFisher.x, MARSH.oldFisher.y, 'down'),
    npc('kq_fisher_boy_marsh', MARSH.boy.x, MARSH.boy.y, 'down', { npc: 'kq_fisher_boy' }),
    npc('kq_fisher_woman_marsh', 19, 14, 'down', { npc: 'kq_fisher_woman', if: 'story.boats_home' }),
    salkhi('salkhi_marsh', MARSH.salkhi.x, MARSH.salkhi.y, 'right'),
    obj('marsh_press', MARSH.press.x, MARSH.press.y, { kind: 'type_press', solid: true, era: 'present', dialogue: 'marsh_press' }),
    obj('fog_bank', MARSH.fog.x, MARSH.fog.y, { kind: 'fog_bank', solid: true, era: 'present', if: '!story.causeway_lit', dialogue: 'fog_bank' }, 1, 2),
    ...MARSH.boats.map((b, i) => obj(`boat_home_${i + 1}`, b.x, b.y, { kind: 'fishing_boat', solid: true, era: 'present', if: 'story.boats_home', dialogue: 'boat_home' })),
    { layer: 'encounters', name: 'marsh_w', x: 1, y: 17, w: 4, h: 9, props: { table: 'fog_marsh', if: 'story.kuroshi_arrived' } },
    { layer: 'encounters', name: 'marsh_e', x: 7, y: 17, w: 6, h: 9, props: { table: 'fog_marsh', if: 'story.kuroshi_arrived' } },
    { layer: 'encounters', name: 'marsh_far', x: 28, y: 10, w: 14, h: 4, props: { table: 'fog_marsh', if: 'story.kuroshi_arrived' } },
  ];
  // The six posts: dark, white or red as the player lights them (a flag each), read when the sixth is set.
  MARSH.posts.forEach((p, i) => {
    const n = i + 1;
    objects.push(obj(`marsh_post_${n}_dark`, p.x, p.y, { kind: 'post_dark', solid: true, era: 'present', if: `!marsh.p${n}_white, !marsh.p${n}_red`, dialogue: `marsh_post_${n}` }));
    objects.push(obj(`marsh_post_${n}_white`, p.x, p.y, { kind: 'post_white', solid: true, era: 'present', if: `marsh.p${n}_white`, dialogue: `marsh_post_${n}` }));
    objects.push(obj(`marsh_post_${n}_red`, p.x, p.y, { kind: 'post_red', solid: true, era: 'present', if: `marsh.p${n}_red`, dialogue: `marsh_post_${n}` }));
  });
  return { id: 'kuroshi-marsh', present: g, echo: g.clone(), objects };
}

/**
 * Lady Sayo's House (K-4, S-KUR, built Oct 27; interior, 20 x 14): the entry with its Echo zone, a screen wall, and the
 * listening room: tatami round a floor of pale boards five by five, and beyond it a lacquer box on a low table. Every
 * board sings (data/secrets.ts); fifty years ago Sayo writes at her desk and her man in grey waits by the entry. The floor
 * itself is the memory's anchor object (the nail), and a present object reads it.
 */
export function kuroshiSayoHouse(): MapSource {
  const { w: W, h: H } = SAYO_HOUSE;
  const g = new Grid(W, H, LWALL);
  g.rect(1, 1, W - 2, H - 2, LFLOOR);
  g.rect(1, 1, W - 2, 1, KSHELF);
  g.rect(3, 2, 14, 8, TATAMI);
  const fl = SAYO_HOUSE.floor;
  g.rect(fl.x, fl.y, 5, 5, LFLOOR);
  g.set(SAYO_HOUSE.box.x, SAYO_HOUSE.box.y, WTABLE);
  g.set(SAYO_HOUSE.desk.x, SAYO_HOUSE.desk.y, DESK);
  g.rect(1, 10, 6, 1, SCREENW).rect(13, 10, 6, 1, SCREENW);
  g.set(SAYO_HOUSE.door.x, SAYO_HOUSE.door.y, 'D');
  const z = SAYO_HOUSE.zone;
  const floorArea = [fl.x, fl.y, 5, 5] as const;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'sayo_out', x: SAYO_HOUSE.door.x, y: SAYO_HOUSE.door.y, props: { target: 'quarter_sayo', map: 'kuroshi-quarter', exit: 'up' } },
    { layer: 'spawns', name: 'sayo_house', x: SAYO_HOUSE.spawn.x, y: SAYO_HOUSE.spawn.y, props: { facing: 'up', era: 'present' } },
    // The first time in (Haru with the party): the floor sings under him.
    trigger('sayo_house_arrive', SAYO_HOUSE.spawn.x, SAYO_HOUSE.spawn.y, { dialogue: 'sayo_house_arrive', flag: 'story.sayo_house_seen', once: true, onEnter: true, if: 'party.haru' }),
    obj('sayo_box', SAYO_HOUSE.box.x, SAYO_HOUSE.box.y, { solid: true, era: 'present', dialogue: 'sayo_box' }),
    obj('sayo_floor_nailed', floorArea[0], floorArea[1], { walkable: true, era: 'present', if: NIGHTINGALE.anchor, dialogue: 'sayo_floor_nailed' }, floorArea[2], floorArea[3]),
    // Fifty years ago: Sayo at her desk, her man in grey, the floor (the anchor: the nail).
    obj('sayo_desk_echo', SAYO_HOUSE.desk.x, SAYO_HOUSE.desk.y, { solid: true, era: 'echo', dialogue: 'sayo_desk_echo' }),
    obj('sayo_floor_echo', floorArea[0], floorArea[1], { walkable: true, era: 'echo', dialogue: 'sayo_nail' }, floorArea[2], floorArea[3]),
    { layer: 'anchors', name: 'floor_nail_anchor', x: fl.x + 3, y: fl.y + 2, props: { object: 'sayo_floor_echo', flag: NIGHTINGALE.anchor } },
    { layer: 'echo_zones', name: 'sayo_echo', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, side.letter_floor.accepted', onEcho: 'sayo_house_echo', onReturn: 'sayo_house_echo_return' } },
    npc('sayo_house', SAYO_HOUSE.sayo.x, SAYO_HOUSE.sayo.y, 'right', { era: 'echo' }),
    npc('sayo_informant', SAYO_HOUSE.informant.x, SAYO_HOUSE.informant.y + 1, 'left', { era: 'echo' }),
  ];
  return { id: 'kuroshi-sayo-house', present: g, echo: g.clone(), objects, interior: true };
}

export const KUROSHI_SOURCES: readonly (() => MapSource)[] = [kuroshiPier, kuroshiQuarter, kuroshiLibrary, kuroshiHall, kuroshiFilehouse, kuroshiFogmaze, kuroshiMarsh, kuroshiSayoHouse];
