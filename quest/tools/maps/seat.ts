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
import { AFTER_TEXT, BENCH_SPOTS, CH12_TEXT, CLAIM_DAY_TEXT, CONCOURSE, EVE_TEXT, GALLERY_SPOTS, GATE_COMPANIES, HALL, HEARING_TEXT, NIGHT_TEXT, ROOMS, TOKEN_CHAIRS } from '../../src/data/claim.ts';

/** Chapter 12 not begun: the Chapter 5 people who would be wrong in the Claim's city (the outline section 3). */
const CH5_ONLY = '!act11.complete';
/** A house that did not sail to the Crown at the Muster (its people sit at the Claim). */
const keptText = (house: string) => `!muster.betrayed|!muster.betrayer.${house}`;
/** A house that did. */
const betrayedText = (house: string) => `muster.betrayed, muster.betrayer.${house}`;

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
    npc('caravan_master_seat', 22, 7, 'down', { if: CH5_ONLY }),
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
    // Chapter 12: the Hall is shut by night until the bell (the outline beat 0; the review's 3.3).
    { layer: 'doors', name: 'concourse_hall', x: 23, y: 5, w: 2, props: { target: 'hall_out', map: 'seat-hall', exit: 'down', if: '!act11.complete|story.bell_claim', closed: 'hall_shut_night' } },
    { layer: 'doors', name: 'concourse_archive', x: 9, y: 5, props: { target: 'archive_out', map: 'seat-archive', exit: 'down', if: 'story.archive_open', closed: 'archive_chain_closed' } },
    { layer: 'spawns', name: 'iron_gate', x: 44, y: 26, props: { facing: 'right', era: 'present' } },
    // Chapter 12 begins inside the Ardencia Gate (the Chapter 12 outline's beat 0; Chapter 11's card lands the party here).
    { layer: 'spawns', name: 'ardencia_gate', x: 33, y: 1, props: { facing: 'down', era: 'present' } },
    // The first walk up to the Hall behind the herald (shown: the bricked gate, the salute, the roof), as the party
    // comes onto the forecourt from any side; again until seen.
    trigger('concourse_arrive', 16, 9, { dialogue: 'concourse_arrive', if: 'story.herald_met, !story.concourse_seen' }, 16, 1),
    trigger('concourse_arrive_w', 16, 6, { dialogue: 'concourse_arrive', if: 'story.herald_met, !story.concourse_seen' }, 1, 3),
    trigger('concourse_arrive_e', 31, 6, { dialogue: 'concourse_arrive', if: 'story.herald_met, !story.concourse_seen' }, 1, 3),
    // The bell: Coco talks the chain off the Archive's door (again until it is lifted).
    trigger('chain_step', 7, 7, { dialogue: 'archive_chain', if: 'story.disguised, !story.archive_open' }, 6, 2),
    // Out of the Archive with the page: the others meet them on the Hall's steps (again until they have).
    trigger('parley_steps', 17, 6, { dialogue: 'parley_steps', if: 'story.hollis_agreed, !story.party_rejoined' }, 14, 2),
    // After the fitting, Coco walks them to the Iron Gate (again until the chapter ends).
    trigger('iron_gate_step', 43, 24, { dialogue: 'iron_gate', if: 'story.fitting_done, !act5.complete' }, 4, 5),
    obj('gate_xaragua', 14, 0, { kind: 'bricked', solid: true, era: 'present', dialogue: 'gate_xaragua', if: '!story.hearing_called' }, 2, 1),
    // Nine days after the Claim the masons take the bricks out (the Hearing's morning: the island's witnesses walk in).
    obj('gate_xaragua_open', 14, 0, { kind: 'gate_open', solid: true, era: 'present', dialogue: 'gate_xaragua_open', if: 'story.hearing_called' }, 2, 1),
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
    npc('halberdier_a', 32, 1, 'down', { npc: 'seat_halberdier', if: CH5_ONLY }),
    npc('halberdier_b', 35, 1, 'down', { npc: 'seat_halberdier', if: CH5_ONLY }),
    // The debate corner by the fountain (data/debates.ts seat_voices): any of the four starts it.
    npc('debate_gaze', 21, 16, 'right', { npc: 'debate_gaze', if: CH5_ONLY }),
    npc('debate_rider', 25, 16, 'left', { npc: 'debate_rider', if: CH5_ONLY }),
    npc('debate_witness', 21, 18, 'right', { npc: 'debate_witness', if: CH5_ONLY }),
    npc('debate_quiet', 25, 18, 'left', { npc: 'debate_quiet', if: CH5_ONLY }),
    npc('seat_market', 8, 27, 'up'),
    npc('seat_outfitter', 14, 27, 'up'),
    // In the morning Coco waits at the chain with the Keeper's robes (until the chain is lifted).
    npc('coralie_chain', 10, 8, 'up', { npc: 'coralie_seat', if: 'story.disguised, !story.archive_open' }),
    // The pilgrims Se-3 saved, with their deserter escort, at the Iron Gate after the fitting (a callback).
    npc('escort_pilgrim', 42, 28, 'right', { npc: 'pilgrim_escort', if: 'side.deserters.spared, story.fitting_done' }),
    npc('escort_deserter', 43, 29, 'right', { npc: 'deserter_escort', if: 'side.deserters.spared, story.fitting_done' }),
    { layer: 'crowds', name: 'concourse_day', x: 30, y: 20, w: 12, h: 8, props: { count: '5', looks: 'pilgrim,aldoria_trader,clerk,porter', if: SEAT_DAY } },
    ...concourseClaim(),
  ];
  return { id: 'seat-concourse', present: g, echo: g.clone(), objects };
}

/**
 * The Concourse in Chapter 12 (the outline section 3 with its second review's 3.3 and 3.9): the arrival in the Ardencia
 * Gate's arch at dusk (Elodie and the clerk), the companies at their gates, Jordyn at the fountain, the corner's new debate,
 * the Master of the Chairs on the Hall's steps by night with four Sealbearers, and the Hearing's morning nine days later.
 */
function concourseClaim(): ObjSpec[] {
  const C = CONCOURSE;
  const companies: ObjSpec[] = GATE_COMPANIES.flatMap((c) => [
    npc(`gate_${c.army}_captain`, c.captain.at.x, c.captain.at.y, c.captain.facing, { if: `${CH12_TEXT}, army.${c.army}` }),
    npc(`gate_${c.army}_soldier`, c.soldier.at.x, c.soldier.at.y, c.soldier.facing, { if: `${CH12_TEXT}, army.${c.army}` }),
  ]);
  return [
    // The arrival (beat 0): plays on entering at the Ardencia Gate until Elodie has spoken.
    trigger('claim_arrive', C.arrive.x, C.arrive.y, { dialogue: 'claim_arrive', flag: 'story.claim_arrive_seen', once: true, onEnter: true, if: CH12_TEXT }),
    npc('elodie_arch', C.elodie.x, C.elodie.y, 'up', { if: `${CH12_TEXT}, !story.claim_arrived` }),
    npc('arch_clerk', C.clerk.x, C.clerk.y, 'up', { if: `${CH12_TEXT}, !story.claim_arrived` }),
    ...companies,
    npc('claim_jordyn', C.jordyn.x, C.jordyn.y, 'up', { if: EVE_TEXT }),
    // The corner after the Harbor Turn (data/debates.ts seat_claim): any of the three starts it.
    npc('claim_gaze', C.debateGaze.x, C.debateGaze.y, 'right', { if: `${CH12_TEXT}, !story.hearing_called` }),
    npc('claim_follower', C.debateFollower.x, C.debateFollower.y, 'left', { if: `${CH12_TEXT}, !story.hearing_called` }),
    npc('claim_witness', C.debateWitness.x, C.debateWitness.y, 'right', { if: `${CH12_TEXT}, !story.hearing_called` }),
    // The Hall's steps: two Sealbearers by day, four by night; the Master of the Chairs with his lantern after Mother's rooms.
    npc('steps_sealbearer_a', 22, 6, 'down', { if: EVE_TEXT }),
    npc('steps_sealbearer_d', 25, 6, 'down', { if: EVE_TEXT }),
    npc('steps_sealbearer_b', 20, 7, 'down', { if: `${CH12_TEXT}, !story.hearing_called` }),
    npc('steps_sealbearer_c', 27, 7, 'down', { if: `${CH12_TEXT}, !story.hearing_called` }),
    npc('chamberlain_night', C.chamberlain.x, C.chamberlain.y, 'down', { if: NIGHT_TEXT }),
    // Nine days later (the second review's 3.9): the Hearing's witnesses walk in at their gates.
    { layer: 'spawns', name: 'hearing_morning', x: C.hearingMorning.x, y: C.hearingMorning.y, props: { facing: 'up', era: 'present' } },
    trigger('hearing_arrivals', C.hearingMorning.x, C.hearingMorning.y, { dialogue: 'hearing_arrivals', flag: 'story.arrivals_seen', once: true, onEnter: true, if: 'story.hearing_called' }),
  ];
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
    // Chapter 12: nobody leaves the Hall while a Challenge stands (the Assize's shape).
    { layer: 'doors', name: 'hall_out', x: 21, y: H - 1, props: { target: 'concourse_hall', map: 'seat-concourse', exit: 'up', if: '!story.claim_declared|story.claim_won', closed: 'hall_claim_closed' } },
    { layer: 'spawns', name: 'nave', x: 21, y: 29, props: { facing: 'up', era: 'present' } },
    // The Regent's welcome (beat 3), as the party walks up the nave (again until Elodie has spoken).
    trigger('hall_welcome', 1, 14, { dialogue: 'hall_welcome', if: '!story.elodie_hall' }, W - 2, 1),
    // On the way out, the chamberlain steps into their path with Se-5 (once offered).
    trigger('chamberlain_step', 1, 27, { dialogue: 'chamberlain_hook', if: 'story.elodie_hall, !side.seats.offered' }, W - 2, 1),
    // The Parley at the bell (beats 8 and 9), as they come in with the Keeper (again until the terms are refused).
    trigger('parley_step', 1, 28, { dialogue: 'parley', if: 'story.party_rejoined, !story.terms_refused' }, W - 2, 1),
    // The Throne tile on its dais, and the violet rope before it (Chapter 12 takes the rope away).
    obj('throne_tile', 21, 2, { kind: 'throne_sun', solid: true, era: 'present', dialogue: 'throne_tile', if: '!story.claim_begun' }, 2, 2),
    obj('throne_rope', 16, 5, { kind: 'violet_rope', solid: true, era: 'present', if: '!story.claim_begun', dialogue: 'throne_rope' }, 12, 1),
    obj('regent_offices', 17, 1, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'regent_offices' }),
    obj('heralds_stair', 26, 1, { kind: 'door_closed', solid: true, era: 'present', dialogue: 'heralds_stair' }),
    obj('hall_records', 2, 29, { dialogue: 'shelf.hall_records', era: 'present' }, 6, 1),
    // The eighth chair is turned round in Chapter 12 once its oath is cut (chair_xaragua_cut).
    ...CHAIRS.map(([house, x]) => obj(`chair_${house}`, x, 8, { kind: 'council_chair', solid: true, era: 'present', dialogue: `chair_${house}`, ...(house === 'xaragua' ? { if: '!anchor.caona_chair' } : {}) })),
    ...Object.entries(CHAMBERS).map(([house, [x, y]]) =>
      obj(`chamber_${house}`, x, y, { kind: house === 'xaragua' ? 'bricked' : 'door_closed', solid: true, era: 'present', dialogue: `chamber_${house}` }),
    ),
    // The Regent at the Throne's foot, a hand on its arm: there for the welcome, gone up the stair for the day, back
    // when the Parley sits at the bell (and after).
    npc('regent', 23, 3, 'down', { if: `!story.elodie_hall|story.hollis_agreed, ${CH5_ONLY}` }),
    // The rope's Sealbearers: gone with the rope's Regent, back at its posts in the Iron Throne (they serve whoever sits).
    npc('rope_sealbearer_a', 15, 6, 'down', { if: '!story.claim_won|ending.iron' }),
    npc('rope_sealbearer_b', 28, 6, 'down', { if: '!story.claim_won|ending.iron' }),
    // Elodie at Zetwal's chamber door, the clerk at her shoulder: there for the welcome; inside for the day until
    // the petition comes to her door; there again for the Parley.
    npc('elodie_hall', 2, 11, 'right', { if: '!story.elodie_hall|side.seats.accepted, !story.terms_refused' }),
    npc('parley_clerk', 2, 12, 'right', { if: '!story.elodie_hall|side.seats.accepted, !story.terms_refused' }),
    npc('envoy_dorini', 2, 23, 'right', { if: CH5_ONLY }),
    npc('legate', 41, 11, 'left', { if: CH5_ONLY }),
    npc('legate_aide', 41, 12, 'left', { if: CH5_ONLY }),
    npc('envoy_ironvow', 41, 15, 'left', { if: CH5_ONLY }),
    npc('envoy_suzumori', 41, 19, 'left', { if: CH5_ONLY }),
    npc('envoy_agnivansh', 41, 23, 'left', { if: CH5_ONLY }),
    npc('chamberlain', 33, 28, 'left', { if: CH5_ONLY }),
    npc('hall_herald_a', 19, 30, 'up', { npc: 'hall_herald' }),
    npc('hall_herald_b', 24, 30, 'up', { npc: 'hall_herald' }),
    ...hallClaim(),
  ];
  return { id: 'seat-hall', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The Throne Hall in Chapter 12 and the Epilogue (the outline sections 3, 8 and 14 with its second review's 3.3, 3.8, 3.11
 * and 3.12): the tokens on their chairs, the eighth chair turned, the Echo forty-nine years ago south of it, the houses' people
 * at their doors at the bell, the tile open, the Regent, the Hearing's bench and gallery near the nave, the afternoon.
 */
function hallClaim(): ObjSpec[] {
  const X = Object.fromEntries(CHAIRS) as Record<string, number>;
  const tokenKinds: Record<string, string> = { xaragua: 'token_paddle', al_doria: 'token_seal', skarragol: 'token_braid', kuroshi: 'token_crane', jwaladesh: 'token_lamp' };
  const B = HALL.behind;
  const seated = 'story.hall_seated';
  const cluster: ObjSpec[] = HALL.echoCluster.map((p, i) => obj(`echo_chair_${i + 1}`, p.x, p.y, { kind: 'council_chair', solid: true, era: 'echo', dialogue: 'echo_chair_cluster' }));
  return [
    // The bell: the Master of the Chairs sets the tokens (once the Hall is entered at the bell).
    trigger('bell_hall', HALL.nave.x, HALL.nave.y, { dialogue: 'bell_hall', flag: 'story.bell_hall_seen', once: true, onEnter: true, if: 'story.bell_claim' }),
    ...TOKEN_CHAIRS.map((c) => obj(`token_on_${c.house}`, X[c.house]!, 8, { kind: tokenKinds[c.house]!, era: 'present', if: `side.seats.${c.house}_set` })),
    obj('chair_xaragua_cut', X.xaragua!, 8, { kind: 'council_chair_cut', solid: true, era: 'present', dialogue: 'chair_xaragua_cut', if: 'anchor.caona_chair' }),
    obj('petition_on_chair', X.xaragua!, 8, { kind: 'petition_chair', era: 'present', if: 'clue.petition_original' }),
    // The Echo: the eighth chair, forty-nine years ago (south of it: the chair is solid).
    {
      layer: 'echo_zones',
      name: 'eighth_chair_echo',
      x: HALL.echoZone.x,
      y: HALL.echoZone.y,
      w: HALL.echoZone.w,
      h: HALL.echoZone.h,
      props: { if: 'story.chairs_set, !story.claim_declared', onEcho: 'chair_echo', onReturn: 'chair_echo_return' },
    },
    { layer: 'spawns', name: 'eighth_chair', x: HALL.echoZone.x + 1, y: HALL.echoZone.y + 1, props: { facing: 'up', era: 'present' } },
    obj('echo_plan_table', HALL.echoPlanTable.x, HALL.echoPlanTable.y, { kind: 'table', solid: true, era: 'echo', dialogue: 'echo_seating_plan' }),
    obj('echo_petition_desk', HALL.echoPlanTable.x, HALL.echoPlanTable.y, { kind: 'paper', era: 'echo', if: 'echo.petition_received, !echo.petition_filed' }),
    ...cluster,
    obj('echo_chair_xaragua', HALL.echoXaraguaChair.x, HALL.echoXaraguaChair.y, { kind: 'council_chair', solid: true, era: 'echo', dialogue: 'echo_chair_xaragua' }),
    obj('echo_door_bricking', 1, 15, { kind: 'bricked', solid: true, era: 'echo' }),
    { layer: 'anchors', name: 'caona_chair_anchor', x: HALL.echoXaraguaChair.x, y: HALL.echoXaraguaChair.y, props: { object: 'echo_chair_xaragua', flag: 'anchor.caona_chair' } },
    npc('echo_chamberlain_old', HALL.echoChamberlain.x, HALL.echoChamberlain.y, 'left', { era: 'echo' }),
    npc('hall_echo_clerk', HALL.echoClerk.x, HALL.echoClerk.y, 'left', { era: 'echo' }),
    npc('echo_mason', HALL.echoMason.x, HALL.echoMason.y, 'left', { era: 'echo' }),
    npc('caona_hall', HALL.echoCaona.x, HALL.echoCaona.y, 'right', { era: 'echo' }),
    npc('benny_hall', HALL.echoBenny.x, HALL.echoBenny.y, 'right', { era: 'echo' }),
    // The count, the tile, the Challenge (beat 4). The rope comes down on story.claim_begun (the Chapter 5 hook); the tile
    // becomes a step: a second, open tile (the review's 3.8: the built one is solid), and its lower row the claim's trigger.
    obj('throne_tile_open', 21, 2, { kind: 'throne_sun', era: 'present', if: 'story.claim_begun' }, 2, 2),
    trigger('claim_tile', HALL.tile.x, HALL.tile.y, { dialogue: 'claim_declare', if: 'story.claim_begun, !story.regent_beaten' }, 2, 1),
    npc('chamberlain_claim', HALL.chamberlain.x, HALL.chamberlain.y, 'left', { if: CLAIM_DAY_TEXT }),
    npc('elodie_claim', HALL.elodieDoor.x, HALL.elodieDoor.y, 'right', { if: CLAIM_DAY_TEXT }),
    npc('claim_clerk', HALL.clerkDoor.x, HALL.clerkDoor.y, 'right', { if: CLAIM_DAY_TEXT }),
    npc('rosalind_claim', HALL.rosalindDoor.x, HALL.rosalindDoor.y, 'left', { if: CLAIM_DAY_TEXT }),
    npc('layla_claim', HALL.laylaDoor.x, HALL.laylaDoor.y, 'right', { if: `${CLAIM_DAY_TEXT}, ${keptText('al_doria')}` }),
    npc('patricio_claim', HALL.patricio.x, HALL.patricio.y, 'up', { if: CLAIM_DAY_TEXT }),
    npc('jordyn_claim', 30, 7, 'left', { if: `${CLAIM_DAY_TEXT}, !story.regent_arrested` }),
    npc('benny_claim', HALL.bennyDoor.x, HALL.bennyDoor.y, 'right', { if: `${CLAIM_DAY_TEXT}, war.strike` }),
    npc('regent_claim_npc', HALL.regent.x, HALL.regent.y, 'down', { if: 'story.claim_counted, !story.regent_arrested' }),
    npc('hale_claim', HALL.hale.x, HALL.hale.y, 'down', { if: 'story.claim_counted, war.strike, !story.hearing_called' }),
    npc('thorne_claim', HALL.thorne.x, HALL.thorne.y, 'down', { if: 'story.claim_counted, choice.thorne_spared, !story.hearing_called' }),
    npc('azzy_challenge', HALL.foot.x, HALL.foot.y - 1, 'up', { if: 'claim.challenge, !claim.azzy_challenged' }),
    npc('hollis_claim', HALL.hollis.x, HALL.hollis.y, 'left', { if: 'clue.petition_original, !story.hearing_called' }),
    obj('clerk_table', HALL.clerkTable.x, HALL.clerkTable.y, { kind: 'table', solid: true, era: 'present', dialogue: 'claim_register', if: 'clue.petition_original' }),
    obj('refusal_on_table', HALL.clerkTable.x, HALL.clerkTable.y, { kind: 'paper', era: 'present', if: 'story.refusal_laid' }),
    obj('signet_step', HALL.foot.x, HALL.foot.y - 1, { kind: 'signet_step', era: 'present', if: 'story.signet_laid, !story.signet_returned, !story.rael_exiled, !story.rael_taken' }),
    // The Hearing, nine days later (the review's 3.11: the bench and the gallery near the nave, on one screen with the dais).
    { layer: 'spawns', name: 'hearing_step', x: HALL.step.x, y: HALL.step.y, props: { facing: 'down', era: 'present' } },
    trigger('hearing', HALL.step.x, HALL.step.y, { dialogue: 'hearing', flag: 'story.hearing_seen', once: true, onEnter: true, if: 'story.hearing_arrived' }),
    obj('witness_bench', HALL.bench.x, HALL.bench.y, { kind: 'witness_bench', solid: true, era: 'present', if: HEARING_TEXT }, HALL.bench.w, 1),
    npc('rael_hearing', HALL.rael.x, HALL.rael.y, 'up', { if: HEARING_TEXT }),
    npc('jordyn_hearing', HALL.jordynBehind.x, HALL.jordynBehind.y, 'up', { if: HEARING_TEXT }),
    npc('rivera_hearing', HALL.rivera.x, HALL.rivera.y, 'up', { if: HEARING_TEXT }),
    npc('jaime_hearing', HALL.jaime.x, HALL.jaime.y, 'up', { if: HEARING_TEXT }),
    npc('hollis_hearing', HALL.hollis.x, HALL.hollis.y, 'left', { if: HEARING_TEXT }),
    npc('chamberlain_hearing', HALL.chamberlain.x, HALL.chamberlain.y, 'left', { if: HEARING_TEXT }),
    npc('elodie_hearing', B.zetwal.x, B.zetwal.y, 'up', { if: HEARING_TEXT }),
    ...(['treasurer', 'daughter', 'amanda', 'lamp_oil', 'printer', 'benny', 'nancy', 'anicette'] as const).map((w, i) =>
      npc(`${w}_hearing`, BENCH_SPOTS[i]!.x, BENCH_SPOTS[i]!.y, 'up', { if: HEARING_TEXT }),
    ),
    ...(['patricio_gallery', 'sebastian_gallery', 'rahel_gallery', 'patricia_gallery', 'zelia_gallery', 'follower_gallery', 'gallery_pilgrim', 'camp_leader_gallery', 'hearing_clerk'] as const).map((w, i) =>
      npc(w, GALLERY_SPOTS[i]!.x, GALLERY_SPOTS[i]!.y, 'up', { if: HEARING_TEXT }),
    ),
    // The houses' people behind their chairs, from the Hearing to the end (the companions out of the line meanwhile:
    // story.hall_seated in data/rpg.ts). Yari leaves at the Iron Throne's verdict; a betrayed house's companion stands apart.
    npc('yari_hall', B.xaragua.x, B.xaragua.y, 'up', { if: `${seated}, !hearing.execution` }),
    npc('azzy_hall', B.ardencia.x, B.ardencia.y, 'up', { if: seated }),
    npc('samira_hall', HALL.samira.x, HALL.samira.y, 'up', { if: seated }),
    npc('edmund_hall', HALL.edmund.x, HALL.edmund.y, 'up', { if: seated }),
    npc('rosalind_hall', B.aldermoor.x, B.aldermoor.y, 'up', { if: seated }),
    npc('layla_hall', B.al_doria.x, B.al_doria.y, 'up', { if: `${seated}, ${keptText('al_doria')}` }),
    ...(['skarragol', 'kuroshi', 'jwaladesh'] as const).flatMap((h) => {
      const who = { skarragol: 'bayarmaa', kuroshi: 'haru', jwaladesh: 'vikram' }[h];
      return [
        npc(`${who}_hall`, B[h].x, B[h].y, 'up', { if: `${seated}, ${keptText(h)}` }),
        npc(`${who}_hall_apart`, 18, 11, 'up', { npc: `${who}_hall`, if: `${seated}, ${betrayedText(h)}` }),
      ];
    }),
    // That afternoon, and after the end (the save keeps the Hall open).
    { layer: 'spawns', name: 'afternoon', x: HALL.afternoon.x, y: HALL.afternoon.y, props: { facing: 'down', era: 'present' } },
    trigger('ending', HALL.afternoon.x, HALL.afternoon.y, { dialogue: 'ending', flag: 'story.ending_played', once: true, onEnter: true, if: 'hearing.verdict' }),
    npc('elodie_after', B.zetwal.x, B.zetwal.y, 'up', { if: `${AFTER_TEXT}, !hearing.execution` }),
    npc('rael_table', HALL.rael.x + 1, HALL.rael.y, 'up', { if: 'hearing.pardon' }),
    npc('hollis_after_hall', HALL.hollis.x, HALL.hollis.y, 'left', { npc: 'hollis_after', if: AFTER_TEXT }),
    npc('chamberlain_after', HALL.chamberlain.x, HALL.chamberlain.y, 'left', { if: AFTER_TEXT }),
    npc('benny_iron', HALL.doorsInside.x + 1, HALL.doorsInside.y - 1, 'up', { if: 'ending.iron' }),
  ];
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
  // The Crown's wing: Zetwal's envoy's rooms (locked in Chapter 5; Mother's rooms in Chapter 12).
  g.set(24, 6, 'D');
  put(g, BANNER, [[3, 6], [9, 6]]);
  // South of the lane: the drying lines and the embassies' gardens.
  g.rect(3, 12, 7, 1, CLOTH_LINE).rect(16, 12, 8, 1, CLOTH_LINE);
  put(g, LAMP, [[2, 9], [25, 9]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'quarter_concourse', x: 12, y: 0, w: 2, props: { target: 'concourse_quarter', map: 'seat-concourse', exit: 'down' } },
    // Chapter 12: Coco is dressing a wedding in Al-Doria; her door is shut with a note (the outline beat 1).
    { layer: 'doors', name: 'quarter_workshop', x: 18, y: 6, props: { target: 'workshop_out', map: 'seat-workshop', exit: 'down', if: CH5_ONLY, closed: 'coco_note' } },
    { layer: 'doors', name: 'quarter_rooms', x: 24, y: 6, props: { target: 'rooms_out', map: 'seat-rooms', exit: 'down', if: 'story.claim_arrived', closed: 'crown_wing_closed' } },
    { layer: 'spawns', name: 'lane', x: 12, y: 2, props: { facing: 'down', era: 'present' } },
    // Coco comes out of her door to the sisters (again until she has).
    trigger('coco_step', 11, 7, { dialogue: 'coco_welcome', if: 'story.elodie_hall, !story.coco_met' }, 6, 2),
    obj('crown_wing', 24, 6, { dialogue: 'crown_wing', era: 'present' }),
    obj('coco_door_paint', 17, 6, { dialogue: 'coco_door_paint', era: 'present' }),
    obj('drying_cloth', 16, 12, { dialogue: 'drying_cloth', era: 'present' }, 8, 1),
    npc('wing_sealbearer', 25, 7, 'left', { npc: 'sealbearer', if: CH5_ONLY }),
    // Chapter 12: the clerk waits in the lane outside Mother's door, for once (the outline beat 1).
    npc('rooms_clerk', 21, 7, 'right', { if: 'story.claim_arrived, !story.bell_claim' }),
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
    // Se-4 (S-SEA, built Oct 27): the clerk's register on the side table; its minute, sealed, is the anchor, and the
    // register lies on Hollis's desk today once it is.
    obj('clerk_register', 16, 7, { kind: 'paper', solid: true, era: 'echo', dialogue: 'clerk_register' }),
    { layer: 'anchors', name: 'minute_anchor', x: 16, y: 7, props: { object: 'clerk_register', flag: 'anchor.minute_sealed' } },
    obj('ribbon_minute', 21, 9, { kind: 'paper', solid: true, era: 'present', dialogue: 'ribbon_minute', if: 'anchor.minute_sealed' }),
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
    npc('hollis_after', 20, 10, 'left', { npc: 'hollis', if: 'story.terms_refused, !story.bell_claim' }),
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
    { layer: 'encounters', name: 'fields_nw', x: 1, y: 1, w: 20, h: 11, props: { table: 'crossroads', if: `story.seat_arrived, ${CH5_ONLY}` } },
    { layer: 'encounters', name: 'fields_ne', x: 25, y: 1, w: 20, h: 11, props: { table: 'crossroads', if: `story.seat_arrived, ${CH5_ONLY}` } },
    { layer: 'encounters', name: 'fields_sw', x: 1, y: 16, w: 20, h: 11, props: { table: 'crossroads', if: `story.seat_arrived, ${CH5_ONLY}` } },
    { layer: 'encounters', name: 'fields_se', x: 39, y: 16, w: 6, h: 11, props: { table: 'crossroads', if: `story.seat_arrived, ${CH5_ONLY}` } },
    // Chapter 12: the Regent's men and the last veils outside the walls (data/encounters.ts crossroads_war, 28 to 30).
    { layer: 'encounters', name: 'fields_war_nw', x: 1, y: 1, w: 20, h: 11, props: { table: 'crossroads_war', if: CH12_TEXT } },
    { layer: 'encounters', name: 'fields_war_ne', x: 25, y: 1, w: 20, h: 11, props: { table: 'crossroads_war', if: CH12_TEXT } },
    { layer: 'encounters', name: 'fields_war_sw', x: 1, y: 16, w: 20, h: 11, props: { table: 'crossroads_war', if: CH12_TEXT } },
    { layer: 'encounters', name: 'fields_war_se', x: 39, y: 16, w: 6, h: 11, props: { table: 'crossroads_war', if: CH12_TEXT } },
  ];
  return { id: 'seat-fields', present: g, echo: g.clone(), objects };
}

/**
 * Zetwal's rooms at the Seat, Mother's (Chapter 12, new; CAPITALS 5 listed them and Chapter 5 never built them): a desk, the
 * lamp in the window (lit all night once she has spoken), the shelf with Grandmother's Volume One, the window on the
 * Concourse. The clerk waits in the lane outside, for once.
 */
export function seatRooms(): MapSource {
  const W = 14;
  const H = 10;
  const g = new Grid(W, H, WALL);
  g.rect(1, 1, W - 2, H - 2, 'o');
  g.set(ROOMS.elodieDesk.x, ROOMS.elodieDesk.y - 1, '$');
  g.rect(ROOMS.shelf.x, ROOMS.shelf.y, 3, 1, 'h');
  g.set(ROOMS.door.x, ROOMS.door.y, 'D');
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'rooms_out', x: ROOMS.door.x, y: ROOMS.door.y, props: { target: 'quarter_rooms', map: 'seat-quarter', exit: 'up' } },
    { layer: 'spawns', name: 'rooms', x: ROOMS.spawn.x, y: ROOMS.spawn.y, props: { facing: 'up', era: 'present' } },
    // Mother's scene (beat 1): on coming in, until she has spoken.
    trigger('rooms_scene', ROOMS.spawn.x, ROOMS.spawn.y, { dialogue: 'rooms_scene', flag: 'story.rooms_seen', once: true, onEnter: true, if: 'story.claim_arrived' }),
    npc('elodie_rooms', ROOMS.elodieDesk.x, ROOMS.elodieDesk.y, 'down', { if: '!story.bell_claim' }),
    obj('rooms_shelf', ROOMS.shelf.x, ROOMS.shelf.y, { dialogue: 'rooms_shelf', era: 'present' }, 3, 1),
    obj('rooms_lamp', ROOMS.lamp.x, ROOMS.lamp.y, { kind: 'lamp_lit', solid: true, era: 'present', dialogue: 'rooms_lamp', if: 'story.elodie_rooms' }),
    obj('rooms_lamp_cold', ROOMS.lamp.x, ROOMS.lamp.y, { kind: 'lamp', solid: true, era: 'present', dialogue: 'rooms_lamp', if: '!story.elodie_rooms' }),
    obj('rooms_window', 7, 0, { kind: 'window', solid: true, era: 'present', dialogue: 'rooms_window' }),
  ];
  return { id: 'seat-rooms', present: g, echo: g.clone(), objects, interior: true };
}

export const SEAT_SOURCES: readonly (() => MapSource)[] = [seatGateyard, seatConcourse, seatHall, seatQuarter, seatWorkshop, seatArchive, seatFields, seatRooms];
