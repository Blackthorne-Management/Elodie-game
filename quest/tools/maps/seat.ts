// Eightgate, the Seat of the realm, for Chapter 5, The Parley (docs/quest/reviews/2026-10-21-chapter5-outline.md with
// its second review and the owner's decision of Oct 21, built Oct 22). Neutral, ancient, worn grey-brown stone; the
// eight houses' colours only on the gates and the chamber doors; Aldermoor's grey-violet on every Sealbearer.
//
// Built once and reused (outline section 3): every map notes what Chapter 12 and the Hearing change, by flag only.
// The Throne tile and its rope, the council chairs, the Archive's Echo zone and the nave are kept clear for them.
//
// Restartable scenes (Chapter 3's rule): every scene that moves the story has a trigger that plays it again until
// its flag is set (the arch, the welcome, Coco's door, the chain, the Parley, the fitting, the Iron Gate).

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { DRAWER_NUMBERS, DRAWER_X0 } from '../../src/data/seatArchive.ts';
import { npc, obj, trigger } from './zetwal-town.ts';

const STONE = 'ա';
const WALL = 'բ';
const ROOF = 'գ';
const VIOLET = 'դ';
const LAMP = 'ե';
const CLOTH_LINE = 'զ';
const STALL = 'ը';
const BANNER = 'ի';
const TENT = 'լ';
const FIRE = 'խ';
const WAGON = 'ծ';
const DUMMY = 'կ';
const MIRROR = 'հ';
const CRATES = 'ձ';
const GATE = 'ղ';
const CITY_WALL = 'ճ';

/**
 * The Seat's evening (beat 5's end): the three required quests done, the veils not on yet (Chapter 4's dusk rule: a
 * condition, not a flag, so whichever quest finishes last brings the evening). It ends at the bell.
 */
export const SEAT_EVE = 'side.seats.stage1, debate.seat_voices.settled, side.deserters.done, !story.disguised';
/** The Seat by day: the opposite. */
const SEAT_DAY = '!side.seats.stage1|!debate.seat_voices.settled|!side.deserters.done|story.disguised';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

/** A building: a slate roof over stone walls (a grey door goes in the front unless one is given). */
function house(g: Grid, x: number, y: number, w: number, h: number): void {
  g.rect(x, y, w, 1, ROOF).rect(x, y + 1, w, h - 1, WALL);
}

/** A ring of city wall round the map's edge. */
function walls(g: Grid): void {
  g.rect(0, 0, g.width, 1, CITY_WALL).rect(0, g.height - 1, g.width, 1, CITY_WALL);
  g.rect(0, 0, 1, g.height, CITY_WALL).rect(g.width - 1, 0, 1, g.height, CITY_WALL);
}

/**
 * The Gold Gate's caravan yard (outdoor): Al-Doria's gate in the east wall, shut behind the caravan; the caravan
 * drawn up inside it; the Sealbearers' inner arch (west) onto the Eight Gates Concourse; the pilgrims by the south
 * wall (Se-3's hook); the contract board; the road out to the Crossroads Fields (south). Chapter 12: the allied
 * armies' camp is a flag variant outside the gate; the pilgrims are gone.
 */
export function seatGateyard(): MapSource {
  const W = 32;
  const H = 20;
  const g = new Grid(W, H, STONE);
  walls(g);
  // The Gold Gate (east), shut behind the caravan; the inner arch (west); the road out (south).
  g.rect(W - 1, 9, 1, 2, GATE);
  g.rect(0, 9, 1, 2, STONE);
  g.rect(15, H - 1, 2, 1, STONE);
  // The caravan: camels and the Dorini crates; the gate clerk's booth; lanterns.
  put(g, 'ч', [[23, 5], [25, 5], [27, 5]]);
  put(g, CRATES, [[24, 14], [25, 14], [26, 14]]);
  put(g, LAMP, [[2, 2], [29, 2], [2, 17], [29, 17]]);
  put(g, VIOLET, [[0, 7], [0, 12]]);

  const objects: ObjSpec[] = [
    // Past the Sealbearers, once the herald has come for the party.
    { layer: 'doors', name: 'yard_concourse', x: 0, y: 9, h: 2, props: { target: 'concourse_yard', map: 'seat-concourse', exit: 'right', if: 'story.herald_met', closed: 'inner_arch' } },
    // The road out to the fields: the Regent receives the household first.
    { layer: 'doors', name: 'yard_fields', x: 15, y: H - 1, w: 2, props: { target: 'fields_yard', map: 'seat-fields', exit: 'up', if: 'story.elodie_hall', closed: 'yard_road_closed' } },
    { layer: 'spawns', name: 'gold_gate', x: 28, y: 10, props: { facing: 'left', era: 'present' } },
    // The caravan's arrival (Chapter 5 opens here): the caravan master's last line, Samira's tolls, Anissa.
    trigger('seat_arrive', 28, 10, { dialogue: 'seat_arrive', flag: 'story.seat_arrived', once: true, onEnter: true }),
    // At the inner arch: the Sealbearer reads the papers, and the Regent's herald comes for them (again until he has).
    trigger('arch_step', 3, 1, { dialogue: 'herald_arch', if: '!story.herald_met' }, 1, H - 2),
    npc('caravan_master_seat', 22, 7, 'down'),
    npc('seat_gate_clerk', 28, 12, 'left'),
    npc('arch_sealbearer_a', 1, 8, 'right', { npc: 'sealbearer' }),
    npc('arch_sealbearer_b', 1, 11, 'right', { npc: 'sealbearer' }),
    // Se-3's pilgrims, robbed on the road in (the bandaged one gives the quest); gone once they are home safe.
    npc('pilgrim_bandaged', 6, 15, 'up', { if: '!side.deserters.done' }),
    npc('pilgrim_gaze', 8, 16, 'up', { if: '!side.deserters.done' }),
    npc('pilgrim_nobody', 4, 16, 'up', { if: '!side.deserters.done' }),
    npc('pilgrim_thanks', 6, 15, 'up', { if: 'side.deserters.done' }),
    obj('seat_contract_board', 13, 2, { kind: 'sign', solid: true, era: 'present', dialogue: 'seat_contract_board' }),
    obj('gold_gate_shut', W - 1, 9, { dialogue: 'gold_gate_shut', era: 'present' }, 1, 2),
    obj('dorini_crates', 24, 14, { dialogue: 'dorini_crates', era: 'present' }, 3, 1),
  ];
  return { id: 'seat-gateyard', present: g, echo: g.clone(), objects };
}

/**
 * The Eight Gates Concourse (the hub, outdoor): the ring road, the eight gates in their houses' colours (each a
 * door object that says why it is shut; Skarragol's Iron Gate opens at the chapter's end), the fountain and its
 * debate corner, the market and the Envoys' Outfitter, the Throne Hall's forecourt and steps (north), the Archive's
 * sealed door and chain on the Hall's west flank, the lane to the Envoys' Quarter (south), the gate yard (east).
 * Chapter 12: the chain is gone; Marines and Sealbearers hold the ring; the allies' gates fly their banners.
 */
export function seatConcourse(): MapSource {
  const W = 48;
  const H = 34;
  const g = new Grid(W, H, STONE);
  walls(g);
  // The ways out: the gate yard (east), the Envoys' Quarter (south).
  g.rect(W - 1, 16, 1, 2, STONE);
  g.rect(23, H - 1, 2, 1, STONE);
  // The Throne Hall (north) and its door; the Archive on its west flank, its door behind the chain.
  house(g, 17, 1, 14, 5);
  // Its double door (the steps' trigger stands in front of it, so it is drawn wide here, not widened).
  g.set(23, 5, '«').set(24, 5, '»');
  put(g, VIOLET, [[19, 5], [28, 5]]);
  house(g, 4, 1, 10, 5);
  g.set(9, 5, 'D');
  // The eight gates in the ring wall, each on the side its country lies (the realm map: Xaraguá north-west, Ardencia
  // north, Zetwal north-east, Al-Doria east through the gate yard, Skarragol south-east, Kuroshi south, Jwaladesh
  // south-west, Aldermoor west): drawn as arches; their objects say why each is shut.
  for (const [x, y, w, h] of [[14, 0, 2, 1], [33, 0, 2, 1], [44, 0, 2, 1], [0, 16, 1, 2], [8, H - 1, 2, 1], [31, H - 1, 2, 1], [W - 1, 26, 1, 2]] as const) {
    g.rect(x, y, w, h, GATE);
  }
  // The fountain at the centre, lanterns round it; the market and the Outfitter's stall (south-west).
  g.set(23, 17, 'O');
  put(g, LAMP, [[19, 14], [27, 14], [19, 20], [27, 20]]);
  put(g, STALL, [[6, 26], [7, 26], [10, 26], [11, 26], [14, 26], [15, 26]]);
  put(g, BANNER, [[32, 0], [35, 0]]);

  const gate = (name: string, x: number, y: number, kind: string, w = 1, h = 1): ObjSpec => obj(name, x, y, { kind, solid: true, era: 'present', dialogue: name }, w, h);
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'concourse_yard', x: W - 1, y: 16, h: 2, props: { target: 'yard_concourse', map: 'seat-gateyard', exit: 'left' } },
    { layer: 'doors', name: 'concourse_quarter', x: 23, y: H - 1, w: 2, props: { target: 'quarter_concourse', map: 'seat-quarter', exit: 'up' } },
    { layer: 'doors', name: 'concourse_hall', x: 23, y: 5, w: 2, props: { target: 'hall_out', map: 'seat-hall', exit: 'down' } },
    { layer: 'doors', name: 'concourse_archive', x: 9, y: 5, props: { target: 'archive_out', map: 'seat-archive', exit: 'down', if: 'story.archive_open', closed: 'archive_chain_closed' } },
    { layer: 'spawns', name: 'iron_gate', x: 44, y: 26, props: { facing: 'right', era: 'present' } },
    // The first walk up to the Hall behind the herald (shown: the bricked gate, the salute, the roof); again until seen.
    trigger('concourse_arrive', 1, 9, { dialogue: 'concourse_arrive', if: 'story.herald_met, !story.concourse_seen' }, W - 2, 1),
    // The bell: Coco talks the chain off the Archive's door (again until it is lifted).
    trigger('chain_step', 7, 7, { dialogue: 'archive_chain', if: 'story.disguised, !story.archive_open' }, 6, 2),
    // Out of the Archive with the page: the others meet them on the Hall's steps (again until they have).
    trigger('parley_steps', 17, 6, { dialogue: 'parley_steps', if: 'story.hollis_agreed, !story.party_rejoined' }, 14, 2),
    // After the fitting, Coco walks them to the Iron Gate (again until the chapter ends).
    trigger('iron_gate_step', 43, 24, { dialogue: 'iron_gate', if: 'story.fitting_done, !act5.complete' }, 4, 5),
    gate('gate_xaragua', 14, 0, 'bricked', 2, 1),
    gate('gate_ardencia', 33, 0, 'seat_gate', 2, 1),
    gate('gate_zetwal', 44, 0, 'seat_gate', 2, 1),
    gate('gate_aldermoor', 0, 16, 'seat_gate', 1, 2),
    gate('gate_jwaladesh', 8, H - 1, 'seat_gate', 2, 1),
    gate('gate_kuroshi', 31, H - 1, 'seat_gate', 2, 1),
    gate('gate_skarragol', W - 1, 26, 'iron_gate', 1, 2),
    obj('seat_fountain', 23, 17, { dialogue: 'seat_fountain', era: 'present' }),
    // The herald waits on the Hall's steps for the party (beat 2).
    npc('herald_steps', 23, 7, 'down', { npc: 'herald', if: 'story.herald_met, !story.regent_met' }),
    npc('chain_sealbearer_a', 7, 6, 'down', { npc: 'sealbearer', if: '!story.hollis_agreed' }),
    npc('chain_sealbearer_b', 12, 6, 'down', { npc: 'sealbearer', if: '!story.hollis_agreed' }),
    npc('halberdier_a', 32, 1, 'down', { npc: 'seat_halberdier' }),
    npc('halberdier_b', 35, 1, 'down', { npc: 'seat_halberdier' }),
    // The debate corner by the fountain (data/debates.ts seat_voices): any of the four starts it.
    npc('debate_gaze', 21, 16, 'right', { npc: 'debate_gaze' }),
    npc('debate_rider', 25, 16, 'left', { npc: 'debate_rider' }),
    npc('debate_witness', 21, 18, 'right', { npc: 'debate_witness' }),
    npc('debate_quiet', 25, 18, 'left', { npc: 'debate_quiet' }),
    npc('seat_market', 8, 27, 'up'),
    npc('seat_outfitter', 14, 27, 'up'),
    // In the morning Coco waits at the chain with the Keeper's robes (until the chain is lifted).
    npc('coralie_chain', 10, 8, 'up', { npc: 'coralie_seat', if: 'story.disguised, !story.archive_open' }),
    // The pilgrims Se-3 saved, with their deserter escort, at the Iron Gate after the fitting (a callback).
    npc('escort_pilgrim', 42, 28, 'right', { npc: 'pilgrim_escort', if: 'side.deserters.spared, story.fitting_done' }),
    npc('escort_deserter', 43, 29, 'right', { npc: 'deserter_escort', if: 'side.deserters.spared, story.fitting_done' }),
    { layer: 'crowds', name: 'concourse_day', x: 30, y: 20, w: 12, h: 8, props: { count: '5', looks: 'pilgrim,aldoria_trader,clerk,porter', if: SEAT_DAY } },
  ];
  return { id: 'seat-concourse', present: g, echo: g.clone(), objects };
}

/** The council chairs, west to east before the Throne (Se-5; Chapter 12 fills them by token). */
export const CHAIRS = [
  ['zetwal', 14],
  ['xaragua', 16],
  ['ardencia', 18],
  ['al_doria', 20],
  ['aldermoor', 23],
  ['skarragol', 25],
  ['kuroshi', 27],
  ['jwaladesh', 29],
] as const;

/** The embassy chambers' doors (west wall x 1, east wall x 42) and the y of each. */
export const CHAMBERS = {
  zetwal: [1, 11],
  xaragua: [1, 15],
  ardencia: [1, 19],
  al_doria: [1, 23],
  aldermoor: [42, 11],
  skarragol: [42, 15],
  kuroshi: [42, 19],
  jwaladesh: [42, 23],
} as const;

/**
 * The Throne Hall (the seat of government, interior, 44 x 32: the seat paragraph's size): the long nave of banners
 * to the Throne tile on its dais (the board's sun and eight rays; roped off, Sealbearers at the rope), the eight
 * council chairs in a row before it, the eight embassy chambers' doors along the walls with their envoys, the
 * heralds' stair and the Regent's offices behind the Throne, the records room (the Hall's four books) and the
 * chamberlain's desk. Chapter 12: the rope goes (`story.claim_begun`), the Throne tile becomes a step, the chairs fill,
 * the nave is the Regent's arena; the Hearing seats its witnesses on the chairs.
 */
export function seatHall(): MapSource {
  const W = 44;
  const H = 32;
  const g = new Grid(W, H, '!');
  g.rect(1, 1, W - 2, H - 2, '(');
  // The dais and the Throne's carpet down the nave to the door.
  g.rect(16, 1, 12, 4, '{');
  // Screens either side of the dais: the rope is the only way up to the Throne.
  g.rect(15, 1, 1, 5, '!').rect(28, 1, 1, 5, '!');
  g.rect(21, 6, 2, H - 7, ')');
  g.set(21, H - 1, 'D');
  // Pillars down both sides of the nave; banners on the walls.
  for (let y = 6; y <= 26; y += 5) put(g, '[', [[8, y], [35, y]]);
  put(g, '<', [[10, 1], [33, 1]]);
  // The records room's shelves (south-west) and the chamberlain's desk (south-east).
  g.rect(2, 29, 6, 1, 'h');
  g.set(34, 28, '$');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'hall_out', x: 21, y: H - 1, props: { target: 'concourse_hall', map: 'seat-concourse', exit: 'up' } },
    { layer: 'spawns', name: 'nave', x: 21, y: 29, props: { facing: 'up', era: 'present' } },
    // The Regent's welcome (beat 3), as the party walks up the nave (again until Elodie has spoken).
    trigger('hall_welcome', 1, 14, { dialogue: 'hall_welcome', if: '!story.elodie_hall' }, W - 2, 1),
    // On the way out, the chamberlain steps into their path with Se-5 (once offered).
    trigger('chamberlain_step', 1, 27, { dialogue: 'chamberlain_hook', if: 'story.elodie_hall, !side.seats.offered' }, W - 2, 1),
    // The Parley at the bell (beats 8 and 9), as they come in with the Keeper (again until the terms are refused).
    trigger('parley_step', 1, 28, { dialogue: 'parley', if: 'story.party_rejoined, !story.terms_refused' }, W - 2, 1),
    // The Throne tile on its dais, and the violet rope before it (Chapter 12 takes the rope away).
    obj('throne_tile', 21, 2, { kind: 'throne_sun', solid: true, era: 'present', dialogue: 'throne_tile' }, 2, 2),
    obj('throne_rope', 16, 5, { kind: 'violet_rope', solid: true, era: 'present', if: '!story.claim_begun', dialogue: 'throne_rope' }, 12, 1),
    obj('regent_offices', 17, 1, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'regent_offices' }),
    obj('heralds_stair', 26, 1, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'heralds_stair' }),
    obj('hall_records', 2, 29, { dialogue: 'shelf.hall_records', era: 'present' }, 6, 1),
    ...CHAIRS.map(([house, x]) => obj(`chair_${house}`, x, 8, { kind: 'council_chair', solid: true, era: 'present', dialogue: `chair_${house}` })),
    ...Object.entries(CHAMBERS).map(([house, [x, y]]) =>
      obj(`chamber_${house}`, x, y, { kind: house === 'xaragua' ? 'bricked' : 'door_closed', solid: true, era: 'present', dialogue: `chamber_${house}` }),
    ),
    // The Regent at the Throne's foot, a hand on its arm: there for the welcome, gone up the stair for the day, back
    // when the Parley sits at the bell (and after).
    npc('regent', 23, 3, 'down', { if: '!story.elodie_hall|story.hollis_agreed' }),
    npc('rope_sealbearer_a', 15, 6, 'down', { npc: 'sealbearer' }),
    npc('rope_sealbearer_b', 28, 6, 'down', { npc: 'sealbearer' }),
    // Elodie at Zetwal's chamber door, the clerk at her shoulder: there for the welcome; inside for the day until
    // the petition comes to her door; there again for the Parley.
    npc('elodie_hall', 2, 11, 'right', { if: '!story.elodie_hall|side.seats.accepted, !story.terms_refused' }),
    npc('parley_clerk', 2, 12, 'right', { if: '!story.elodie_hall|side.seats.accepted, !story.terms_refused' }),
    npc('envoy_dorini', 2, 23, 'right'),
    npc('legate', 41, 11, 'left'),
    npc('legate_aide', 41, 12, 'left'),
    npc('envoy_ironvow', 41, 15, 'left'),
    npc('envoy_suzumori', 41, 19, 'left'),
    npc('envoy_agnivansh', 41, 23, 'left'),
    npc('chamberlain', 33, 28, 'left'),
    npc('hall_herald_a', 19, 30, 'up', { npc: 'hall_herald' }),
    npc('hall_herald_b', 24, 30, 'up', { npc: 'hall_herald' }),
  ];
  return { id: 'seat-hall', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Envoys' Quarter (outdoor lane): the embassy houses with the houses' colours on their lintels, the Crown's
 * guarded wing (Elodie's rooms: closed in the release, Se-1 after), and Coco's workshop, the one door painted in
 * every colour, bolts of cloth drying on lines across the lane. Chapter 12: Coco's door still opens; the wing's
 * Sealbearer is gone after the Harbor.
 */
export function seatQuarter(): MapSource {
  const W = 28;
  const H = 18;
  const g = new Grid(W, H, STONE);
  walls(g);
  g.rect(12, 0, 2, 1, STONE);
  // North of the lane: an embassy house, Coco's workshop (its painted door), the Crown's guarded wing.
  house(g, 2, 2, 9, 5);
  house(g, 16, 2, 6, 5);
  g.set(18, 6, 'D');
  house(g, 22, 2, 5, 5);
  g.set(24, 6, '@');
  put(g, BANNER, [[3, 6], [9, 6]]);
  // South of the lane: the drying lines and the embassies' gardens.
  g.rect(3, 12, 7, 1, CLOTH_LINE).rect(16, 12, 8, 1, CLOTH_LINE);
  put(g, LAMP, [[2, 9], [25, 9]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'quarter_concourse', x: 12, y: 0, w: 2, props: { target: 'concourse_quarter', map: 'seat-concourse', exit: 'down' } },
    { layer: 'doors', name: 'quarter_workshop', x: 18, y: 6, props: { target: 'workshop_out', map: 'seat-workshop', exit: 'down' } },
    { layer: 'spawns', name: 'lane', x: 12, y: 2, props: { facing: 'down', era: 'present' } },
    // Coco comes out of her door to the sisters (again until she has).
    trigger('coco_step', 11, 7, { dialogue: 'coco_welcome', if: 'story.elodie_hall, !story.coco_met' }, 6, 2),
    obj('crown_wing', 24, 6, { dialogue: 'crown_wing', era: 'present' }),
    obj('coco_door_paint', 17, 6, { dialogue: 'coco_door_paint', era: 'present' }),
    obj('drying_cloth', 16, 12, { dialogue: 'drying_cloth', era: 'present' }, 8, 1),
    npc('wing_sealbearer', 25, 7, 'left', { npc: 'sealbearer' }),
    // Coco in her doorway through the day (what is left), and at evening ("Bed.").
    npc('coralie_door', 20, 8, 'down', { npc: 'coralie_seat', if: 'story.coco_plan, !story.disguised, !story.terms_refused' }),
    npc('embassy_porter', 6, 7, 'down'),
  ];
  return { id: 'seat-quarter', present: g, echo: g.clone(), objects };
}

/**
 * Coco's workshop (interior): the front room (the dummies in eight colours, the beds the party sleeps in, the window
 * on the lane where the Crown's clerk waits) and, behind a curtain, the fitting room (the dais, the mirror): the one
 * room in Eightgate with no Crown pen in it. Chapter 12: Coco dresses Gianna for the Claim here.
 */
export function seatWorkshop(): MapSource {
  const W = 20;
  const H = 12;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, 4, '(').rect(1, 6, W - 2, 5, 'o');
  g.rect(9, 5, 2, 1, '(');
  g.rect(8, 2, 4, 1, '{');
  put(g, MIRROR, [[14, 1]]);
  put(g, DUMMY, [[2, 2], [4, 2], [16, 3], [17, 1], [2, 7], [2, 9], [17, 7], [17, 9]]);
  put(g, 'd', [[13, 9], [15, 9]]);
  g.set(6, 8, 'a');
  g.set(4, H - 1, 'v');
  g.set(10, H - 1, 'D');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'workshop_out', x: 10, y: H - 1, props: { target: 'quarter_workshop', map: 'seat-quarter', exit: 'up' } },
    { layer: 'spawns', name: 'front_room', x: 10, y: 9, props: { facing: 'up', era: 'present' } },
    // Inside for the first time: Coco's plan (beat 4).
    trigger('coco_plan', 10, 10, { dialogue: 'coco_plan', flag: 'story.workshop_seen', once: true, onEnter: true, if: 'story.coco_met' }),
    // The evening: bed; the morning bell, the veils, and the party split (beat 6).
    trigger('bell_morning', 10, 10, { dialogue: 'seamstresses', flag: 'story.bell_morning', once: true, onEnter: true, if: SEAT_EVE }),
    // The fitting: Elodie comes to the front room (once), then the private scene behind the curtain (again until done).
    trigger('fitting_arrive', 10, 10, { dialogue: 'fitting_front', flag: 'story.fitting_arrived', once: true, onEnter: true, if: 'story.terms_refused' }),
    trigger('fitting_step', 1, 4, { dialogue: 'fitting', if: 'story.fitting_arrived, !story.fitting_done' }, W - 2, 1),
    obj('curtain', 9, 5, { kind: 'curtain', solid: true, era: 'present', if: '!story.terms_refused', dialogue: 'curtain' }, 2, 1),
    obj('coco_dummies', 2, 7, { dialogue: 'coco_dummies', era: 'present' }),
    obj('workshop_window', 4, H - 1, { dialogue: 'workshop_window', era: 'present' }),
    npc('coralie_shop', 12, 7, 'down', { npc: 'coralie_seat', if: 'story.coco_plan, !story.disguised, !story.terms_refused' }),
  ];
  return { id: 'seat-workshop', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Throne Archive (the library, interior): shelves to the roof, the Accord under glass on its table at the
 * centre, the seven-drawer cabinet against the north wall (relabelled with house sigils; only the carved numbers
 * are old), the gallery (east), Keeper Hollis on his stool. Its Echo is the whole floor before the table: the
 * sealing of the Accord fifty years ago (SIG-SEA): the drawers numbered 1 to 7 in their old order, the Throne's clerk,
 * the Crown's envoy, young Benny, and a boy clerk in the gallery. The anchor: the seventh ribbon's thread on drawer 4.
 * Chapter 12: the final Echo uses the same zone with another scene; the Ribbon's hearing (S-SEA) sits at Hollis's desk.
 */
export function seatArchive(): MapSource {
  const W = 28;
  const H = 20;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, 'o');
  g.set(13, H - 1, 'D');
  // Shelves to the roof: the north wall either side of the cabinet, and two long cases.
  g.rect(1, 1, 7, 1, 'h').rect(20, 1, 7, 1, 'h');
  g.rect(2, 4, 1, 12, 'h').rect(25, 4, 1, 12, 'h');
  g.rect(5, 13, 4, 1, 'h').rect(19, 13, 4, 1, 'h');
  // Hollis's desk by his stool; the gallery's rail (east).
  g.set(21, 9, '$');
  g.rect(20, 3, 4, 1, 'h');
  // Fifty years ago: older floor, fewer shelves (no long cases), the boy clerk's desk in the gallery.
  const e = g.map({ o: 'e', h: 'H', $: 'A' });
  e.rect(5, 13, 4, 1, 'e').rect(19, 13, 4, 1, 'e').rect(2, 4, 1, 12, 'e');
  e.set(23, 5, 'A');

  const drawers: ObjSpec[] = [];
  DRAWER_NUMBERS.forEach((n, i) => {
    const x = DRAWER_X0 + i;
    // Today: the plate and the carved number; the drawer carved 4 has the faded thread once it was tied.
    drawers.push(obj(`drawer_slot${i + 1}`, x, 1, { kind: 'drawer', solid: true, era: 'present', dialogue: `drawer_slot${i + 1}`, ...(n === 4 ? { if: '!anchor.ribbon_thread' } : {}) }));
    if (n === 4) drawers.push(obj('drawer_four', x, 1, { kind: 'drawer_thread', solid: true, era: 'present', if: 'anchor.ribbon_thread', dialogue: 'drawer_four' }));
    // Fifty years ago: numbers only, 1 to 7 in order.
    drawers.push(obj(`drawer_e${i + 1}`, x, 1, { kind: 'drawer', solid: true, era: 'echo', dialogue: `drawer_e${i + 1}` }));
  });

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'archive_out', x: 13, y: H - 1, props: { target: 'concourse_archive', map: 'seat-concourse', exit: 'up' } },
    { layer: 'spawns', name: 'archive', x: 13, y: 17, props: { facing: 'up', era: 'present' } },
    // In past the chain: Coco fits the Keeper on his stool, and he looks at Gianna's hands (beat 6).
    trigger('archive_enter', 13, 18, { dialogue: 'archive_enter', flag: 'story.archive_entered', once: true, onEnter: true, if: 'story.archive_open' }),
    ...drawers,
    { layer: 'anchors', name: 'ribbon_thread_anchor', x: DRAWER_X0 + 3, y: 1, props: { object: 'drawer_e4', flag: 'anchor.ribbon_thread' } },
    obj('accord_glass', 13, 7, { kind: 'glass_case', solid: true, era: 'present', dialogue: 'accord_glass' }, 2, 1),
    obj('sealing_table', 13, 7, { kind: 'table', solid: true, era: 'echo', dialogue: 'sealing_table' }, 2, 1),
    // S-SEA's hook, placed and inert (after the release): the clerk's register on the side table.
    obj('clerk_register', 16, 7, { kind: 'paper', solid: true, era: 'echo', dialogue: 'clerk_register' }),
    obj('archive_shelves', 20, 1, { dialogue: 'shelf.archive_shelves', era: 'present' }, 7, 1),
    {
      layer: 'echo_zones',
      name: 'sealing_echo',
      x: 10,
      y: 9,
      w: 7,
      h: 3,
      props: { if: 'story.archive_entered', onEcho: 'sealing_enter', onReturn: 'sealing_return' },
    },
    npc('hollis', 20, 10, 'left', { if: '!story.hollis_agreed' }),
    npc('hollis_after', 20, 10, 'left', { npc: 'hollis', if: 'story.terms_refused' }),
    npc('coralie_archive', 21, 11, 'left', { npc: 'coralie_seat', if: 'story.archive_open, !story.hollis_agreed' }),
    // Fifty years ago.
    npc('echo_throne_clerk', 13, 6, 'down', { era: 'echo' }),
    npc('echo_crown_envoy', 16, 8, 'left', { era: 'echo' }),
    npc('benny_seal', 10, 8, 'right', { npc: 'benny_echo', era: 'echo', if: '!echo.benny_left' }),
    npc('echo_thomas', 22, 5, 'left', { era: 'echo' }),
  ];
  return { id: 'seat-archive', present: g, echo: e, objects, interior: true };
}

/**
 * The Crossroads Fields (wild, outdoor): the roads meeting outside the walls, the pilgrims' camp, the deserters'
 * camp at the crossroads (an overturned Crown wagon, a cook fire: Se-3), the grass either side wild from the
 * party's arrival (`crossroads`); the roads themselves are safe. Chapter 12: the same map with the 28 to 30 table.
 */
export function seatFields(): MapSource {
  const W = 46;
  const H = 28;
  const g = new Grid(W, H, '.');
  g.rect(0, 0, W, 1, 'T').rect(0, H - 1, W, 1, 'T').rect(0, 0, 1, H, 'T').rect(W - 1, 0, 1, H, 'T');
  // The road from the Gold Gate's yard (north) to the crossroads, and the roads out east, west and south.
  g.rect(22, 0, 2, 14, ',').rect(1, 13, W - 2, 2, ',').rect(22, 15, 2, H - 16, ',');
  // The deserters' camp: the road spur, the wagon on its side, the cook fire, a tent.
  g.rect(30, 15, 2, 3, ',').rect(29, 18, 9, 5, ';');
  put(g, WAGON, [[33, 19], [34, 19]]);
  put(g, FIRE, [[32, 21]]);
  put(g, TENT, [[36, 21]]);
  // The pilgrims' camp (north-west) and the trees.
  put(g, TENT, [[8, 4], [11, 4]]);
  put(g, FIRE, [[9, 6]]);
  put(g, 'T', [[5, 9], [16, 3], [28, 4], [40, 8], [12, 20], [6, 24], [42, 22], [26, 24]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'fields_yard', x: 22, y: 0, w: 2, props: { target: 'yard_fields', map: 'seat-gateyard', exit: 'down' } },
    { layer: 'spawns', name: 'crossroads', x: 22, y: 2, props: { facing: 'down', era: 'present' } },
    // The deserters' camp: the Sergeant walks out and asks a toll (again until the fight is won).
    trigger('deserters_camp', 29, 16, { dialogue: 'deserters_camp', if: 'side.deserters.accepted, !side.deserters.fought' }, 4, 2),
    npc('deserter_sergeant', 33, 21, 'up', { if: 'side.deserters.accepted, !side.deserters.fought' }),
    npc('deserter_a', 31, 20, 'up', { npc: 'deserter', if: 'side.deserters.accepted, !side.deserters.fought' }),
    npc('deserter_b', 35, 20, 'up', { npc: 'deserter', if: 'side.deserters.accepted, !side.deserters.fought' }),
    obj('crown_wagon', 33, 19, { dialogue: 'crown_wagon', era: 'present' }, 2, 1),
    obj('pilgrim_camp', 8, 4, { dialogue: 'pilgrim_camp', era: 'present' }),
    { layer: 'encounters', name: 'fields_nw', x: 1, y: 1, w: 20, h: 11, props: { table: 'crossroads', if: 'story.seat_arrived' } },
    { layer: 'encounters', name: 'fields_ne', x: 25, y: 1, w: 20, h: 11, props: { table: 'crossroads', if: 'story.seat_arrived' } },
    { layer: 'encounters', name: 'fields_sw', x: 1, y: 16, w: 20, h: 11, props: { table: 'crossroads', if: 'story.seat_arrived' } },
    { layer: 'encounters', name: 'fields_se', x: 39, y: 16, w: 6, h: 11, props: { table: 'crossroads', if: 'story.seat_arrived' } },
  ];
  return { id: 'seat-fields', present: g, echo: g.clone(), objects };
}

export const SEAT_SOURCES: readonly (() => MapSource)[] = [seatGateyard, seatConcourse, seatHall, seatQuarter, seatWorkshop, seatArchive, seatFields];
