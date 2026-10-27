// Cenizal, the capital of Ardencia (House Brasador), for Chapter 3, The Trial of Blades (the outline's section 3,
// built Oct 21). Red stone, black lava and iron, nothing like Pòdlimyè or Yucayeque: the Cinder Flats and the sea
// road under the walls (the wild section, with the tunnel mouth and the strand road on its west side, reached only
// from Benny's tunnel), the Upper Town with the duel court beside the Alcázar (the hub), the Alcázar inside (the
// hall of audience, the elders' hall, the records room with its Echo, Benny's quiet rooms), the Lower Town, the Old
// Library, the forge fortress (the armory hall, its Echo the night before Benny's march), Benny's tunnel, and the
// Free Brasador camp on the strand.
//
// Restartable scenes (review 3.6 and 3.7): every scene that moves the story has a step trigger that plays it again
// until its flag is set, so a save made in the middle of one never strands the party (the court, the cell, the
// tunnel's far end, the camp).

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { CAMP, CHAPEL, ERRAND, FEAST, FEAST_FLAGS, WATCHES, watchGuard } from '../../src/data/ardencia.ts';

const CINDER = 'γ';
const BLACK_SAND = 'α';
const BASALT = 'β';
const RED_STONE = 'δ';
const RED_WALL = 'ε';
const DUEL_SAND = 'ζ';
const SPRING = 'η';
const IRON = 'θ';
const LAVA = 'ι';
const DITCH = 'κ';
const ROAD = ',';

/** Until noon on the day of the trial (the court gate opens when Azzy says "Noon"). */
const BEFORE_TRIAL = 'story.trial_set, !story.trial_fought';
/** The Lower Town by night (Bread at Night: story.cart_night) and by day. */
const DAY = '!story.cart_night';
const NIGHT = 'story.cart_night';

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

/** A building: a tiled roof over red walls (a grey door goes in the front unless one is given). */
function house(g: Grid, x: number, y: number, w: number, h = 3): void {
  g.rect(x, y, w, 1, '^').rect(x, y + 1, w, h - 1, RED_WALL);
}

/** Walls round an interior's edge. */
function walls(g: Grid): void {
  g.rect(0, 0, g.width, 1, RED_WALL).rect(0, g.height - 1, g.width, 1, RED_WALL);
  g.rect(0, 0, 1, g.height, RED_WALL).rect(g.width - 1, 0, 1, g.height, RED_WALL);
}

/**
 * The Cinder Flats and the sea road (the wild section). East: the black-sand landing where the trader puts in, the
 * road up past the hot springs to the gate of Cenizal, the halberdiers on the gate; the cinder fields either side
 * of the road are wild (the road itself is safe). West, behind a basalt ridge: the mouth of Benny's tunnel under the
 * wall, the strand road where the shots land wide, the bend where Azzy's company joins him, and the way to the camp.
 */
export function ardenciaFlats(): MapSource {
  const W = 40;
  const H = 26;
  const g = new Grid(W, H, CINDER);
  // The sea and the strands, east and west.
  g.rect(0, 24, W, 2, '~');
  g.rect(14, 20, W - 14, 4, BLACK_SAND).rect(0, 21, 13, 3, BLACK_SAND);
  // The city wall above the flats (the gate in it), and the basalt beyond.
  g.rect(0, 0, W, 1, BASALT).rect(0, 1, W, 2, RED_WALL);
  g.rect(24, 0, 2, 3, RED_STONE);
  // The ridge between the sea road and the west strand.
  g.rect(13, 3, 1, 21, BASALT);
  // The road from the landing up to the gate.
  g.rect(31, 4, 2, 18, ROAD).rect(24, 4, 9, 2, ROAD).rect(24, 3, 2, 1, ROAD);
  // Steam, basalt and cinder piles in the fields.
  put(g, SPRING, [[19, 10], [20, 10], [19, 11], [36, 13], [37, 13], [36, 14], [16, 17]]);
  put(g, BASALT, [[17, 14], [27, 8], [35, 7], [22, 16], [28, 18], [38, 9]]);
  put(g, 'ϊ', [[15, 6], [26, 12], [34, 18], [21, 6]]);
  // West: the tunnel mouth under the wall (rubble either side), and the strand road down to the camp.
  g.rect(5, 2, 2, 1, 'D');
  g.rect(5, 3, 2, 17, ROAD).rect(0, 19, 7, 2, ROAD);
  put(g, BASALT, [[2, 7], [10, 9], [9, 15], [2, 13]]);
  put(g, 'ϊ', [[8, 5], [1, 10]]);
  put(g, SPRING, [[10, 12], [11, 12]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'flats_town', x: 24, y: 0, w: 2, props: { target: 'town_flats', map: 'ardencia-town', exit: 'down', if: 'story.azzy_met, !story.ardencia_escaped', closed: 'gate_closed' } },
    { layer: 'doors', name: 'flats_tunnel', x: 5, y: 2, w: 2, props: { target: 'tunnel_out', map: 'ardencia-tunnel', exit: 'down', if: '!story.ardencia_escaped', closed: 'tunnel_mouth_shut' } },
    { layer: 'doors', name: 'flats_camp', x: 0, y: 19, h: 2, props: { target: 'camp_flats', map: 'ardencia-camp', exit: 'right' } },
    // The trader lands the party on the black sand (the voyage's travel.next).
    { layer: 'spawns', name: 'landing', x: 32, y: 21, props: { facing: 'up', era: 'present' } },
    { layer: 'spawns', name: 'tunnel_mouth', x: 5, y: 4, props: { facing: 'down', era: 'present' } },
    trigger('ardencia_landing', 32, 21, { dialogue: 'ardencia_landing', flag: 'story.ardencia_arrived', once: true, onEnter: true, if: '!party.azzy' }),
    // Unrest, shown: a family going down to the strand with a handcart.
    trigger('flats_family', 31, 14, { dialogue: 'flats_family', flag: 'story.family_seen', once: true, if: '!story.ardencia_escaped' }, 2, 1),
    // The gate of Cenizal: the halberdiers read the papers and send for Azzy (again until he has come).
    trigger('gate_arrive', 24, 4, { dialogue: 'gate_arrive', if: '!story.azzy_met' }, 2, 2),
    npc('gate_halberdier', 23, 3, 'down', { if: '!story.ardencia_escaped' }),
    npc('gate_halberdier_2', 26, 3, 'down', { if: '!story.ardencia_escaped' }),
    obj('flats_sign', 33, 19, { dialogue: 'flats_sign', kind: 'sign', solid: true, era: 'present' }),
    // The sea road after the escape: the wall above, the shots, Azzy's company at the bend.
    trigger('sea_road_mouth', 5, 4, { dialogue: 'sea_road_mouth', flag: 'story.sea_road_seen', once: true, onEnter: true, if: 'party.azzy' }),
    trigger('shots_two', 5, 10, { dialogue: 'sea_road_shots', flag: 'story.shots_seen', once: true, if: 'party.azzy' }, 2, 1),
    trigger('patrol_bend', 5, 15, { dialogue: 'patrol_bend', if: 'party.azzy, !story.ardencia_escaped' }, 2, 1),
    { layer: 'encounters', name: 'flats_west_field', x: 14, y: 6, w: 16, h: 14, props: { table: 'cinder_flats', if: '!story.ardencia_escaped' } },
    { layer: 'encounters', name: 'flats_east_field', x: 34, y: 6, w: 5, h: 13, props: { table: 'cinder_flats', if: '!story.ardencia_escaped' } },
    { layer: 'encounters', name: 'strand_fields', x: 7, y: 5, w: 5, h: 13, props: { table: 'cinder_patrols', if: 'story.ardencia_escaped' } },
  ];
  return { id: 'ardencia-flats', present: g, echo: g.clone(), objects };
}

/**
 * The Upper Town (the hub): red-stone streets round a plaza with a dry fountain; the Alcázar at its head, the duel
 * court beside it (the sand ring under a wooden gallery, the court gate where Azzy waits); the Old Library, the
 * smith, the ring-maker and the tavern; the way down to the Lower Town (west) and to the sea road (south); the barred
 * lower arch to the forge fortress (east).
 */
export function ardenciaTown(): MapSource {
  const W = 40;
  const H = 28;
  const g = new Grid(W, H, RED_STONE);
  g.rect(0, 0, W, 1, BASALT).rect(0, 0, 1, H, RED_WALL).rect(W - 1, 0, 1, H, RED_WALL).rect(0, H - 1, W, 1, RED_WALL);
  g.rect(0, 19, 1, 2, RED_STONE).rect(24, H - 1, 2, 1, RED_STONE);
  // The Alcázar.
  g.rect(13, 1, 13, 3, '^').rect(13, 4, 13, 3, RED_WALL).set(19, 6, 'D');
  put(g, 'ψ', [[14, 7], [24, 7]]);
  // The duel court: low walls, the gallery along the top, the sand ring, the Alcázar's side door, the court gate.
  g.rect(29, 4, 9, 11, RED_WALL).rect(30, 5, 7, 1, 'υ').rect(30, 6, 7, 8, DUEL_SAND);
  g.set(31, 4, '@').set(31, 5, DUEL_SAND);
  g.rect(29, 9, 1, 2, RED_STONE);
  // The plaza: the dry fountain, lanterns.
  g.set(19, 13, 'φ');
  put(g, 'χ', [[14, 10], [24, 10], [14, 17], [24, 17]]);
  // The Old Library (west), and houses.
  house(g, 2, 8, 7, 4);
  g.set(5, 11, 'D');
  house(g, 2, 2, 8, 3);
  house(g, 30, 17, 8, 3);
  house(g, 2, 22, 7, 3);
  house(g, 28, 22, 9, 3);
  // The market stalls: smith, ring-maker, tavern.
  put(g, 'τ', [[11, 21], [14, 21], [17, 21]]);
  put(g, 'π', [[19, 22], [20, 22], [10, 22]]);
  // The barred lower arch to the forge fortress, in the east wall.
  g.set(W - 1, 20, RED_WALL);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'town_flats', x: 24, y: H - 1, w: 2, props: { target: 'flats_town', map: 'ardencia-flats', exit: 'up' } },
    { layer: 'doors', name: 'town_lower', x: 0, y: 19, h: 2, props: { target: 'lower_town', map: 'ardencia-lower', exit: 'right' } },
    { layer: 'doors', name: 'town_alcazar', x: 19, y: 6, props: { target: 'alcazar_out', map: 'ardencia-alcazar', exit: 'down' } },
    { layer: 'doors', name: 'town_library', x: 5, y: 11, props: { target: 'library_out', map: 'ardencia-library', exit: 'down' } },
    { layer: 'spawns', name: 'plaza', x: 19, y: 16, props: { facing: 'up', era: 'present' } },
    // Azzy walks them up to the Alcázar steps.
    trigger('town_arrive', 24, 25, { dialogue: 'town_arrive', flag: 'story.town_seen', once: true, onEnter: true, if: 'story.azzy_met, !story.trial_set' }),
    // The court gate: Azzy waits there all day; at noon he walks into the ring.
    npc('azzy_court', 28, 8, 'down', { if: `${BEFORE_TRIAL}, !story.noon` }),
    npc('azzy_ring', 30, 12, 'right', { if: 'story.noon, !story.trial_fought' }),
    obj('court_gate', 29, 9, { kind: 'iron_bars', solid: true, era: 'present', if: '!story.noon', dialogue: 'court_gate' }, 1, 2),
    // Noon: walking into the ring brings Rael (again until the trial is fought: review 3.6).
    trigger('trial_start', 32, 8, { dialogue: 'trial_start', if: 'story.noon, !story.trial_fought' }, 2, 4),
    // A save made during the question replays it on the sand.
    trigger('reveal_resume', 30, 6, { dialogue: 'rael_after', if: 'story.trial_fought, !story.forge_held' }, 7, 8),
    obj('duel_gallery', 30, 5, { dialogue: 'duel_gallery', era: 'present' }, 7, 1),
    obj('dry_fountain', 19, 13, { dialogue: 'dry_fountain', era: 'present' }),
    obj('forge_arch', W - 1, 20, { kind: 'iron_bars', solid: true, era: 'present', dialogue: 'forge_arch' }),
    obj('alcazar_banner', 14, 7, { dialogue: 'alcazar_banner', era: 'present' }),
    npc('ard_smith', 11, 22, 'up'),
    npc('ring_maker', 14, 22, 'up'),
    npc('tavern_cook', 17, 22, 'up'),
    npc('alcazar_guard', 18, 7, 'down'),
    npc('town_courier', 26, 15, 'left'),
    npc('town_gossip', 9, 14, 'right'),
    npc('town_veteran', 22, 19, 'up'),
    npc('town_child', 12, 17, 'down'),
    // Ar-3 The Elders' Feast (built Oct 27): the contract board on the plaza, and Elder Ferrán's grey door (his strongroom).
    obj('feast_board', FEAST.board.x, FEAST.board.y, { kind: 'sign', solid: true, era: 'present', dialogue: 'feast_board' }),
    obj('ferran_door', FEAST.ferranDoor.x, FEAST.ferranDoor.y, { solid: true, era: 'present', dialogue: 'ferran_door' }),
  ];
  return { id: 'ardencia-town', present: g, echo: g.clone(), objects };
}

/**
 * The Alcázar (the seat of government): the long hall of audience to Rael's seat and the Lord's door; the elders'
 * hall (west), the records room (east) with its tapestry and its Echo (Benny's office, the night before the march);
 * Benny's quiet rooms (south-west) behind a guard; a sitting room (south-east) left free for the family to come.
 */
export function ardenciaAlcazar(): MapSource {
  const W = 34;
  const H = 22;
  const g = new Grid(W, H, RED_WALL);
  // The hall of audience, the carpet to the seat, pillars.
  g.rect(11, 2, 11, 19, RED_STONE).rect(16, 4, 1, 17, 'ύ');
  g.set(16, 2, 'ώ').set(19, 1, '@').set(16, H - 1, 'D');
  put(g, '[', [[12, 5], [20, 5], [12, 10], [20, 10], [12, 15], [20, 15]]);
  // The elders' hall (west), its seats along the top.
  g.rect(1, 2, 9, 9, RED_STONE).rect(10, 6, 1, 2, RED_STONE).rect(3, 3, 5, 1, 'ό');
  // The records room (east): shelves on the north wall, the tapestry on the east wall.
  g.rect(23, 2, 9, 9, RED_STONE).rect(22, 6, 1, 2, RED_STONE).rect(24, 2, 7, 1, 'Ϗ');
  g.set(32, 6, 'ν');
  // Benny's quiet rooms (south-west), and the sitting room (south-east).
  g.rect(1, 13, 9, 7, RED_STONE).rect(2, 14, 6, 4, 'u').rect(10, 16, 1, 1, RED_STONE).set(1, 14, 'v');
  g.rect(23, 13, 9, 7, RED_STONE).rect(22, 16, 1, 1, RED_STONE).rect(25, 14, 3, 1, 'ό');
  // Ar-4 (built Oct 27): the chapel stair in the sitting room's east wall, and Benny's own stair behind his chair.
  g.rect(32, 16, 1, 2, 'D').rect(0, 16, 1, 2, 'D');

  // Fifty years ago, the records room was Benny's office: a desk, maps, a chest of papers.
  const e = g.clone();
  e.set(29, 4, 'ϋ').set(30, 4, 'ϋ').set(24, 9, '>');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'alcazar_out', x: 16, y: H - 1, props: { target: 'town_alcazar', map: 'ardencia-town', exit: 'up' } },
    { layer: 'spawns', name: 'hall', x: 16, y: 19, props: { facing: 'up', era: 'present' } },
    // Ar-4 The Old Lord's Errand (secret, built Oct 27): down to the chapel cloister while the errand is open; Benny's own
    // stair opens from the crypt's side once the promise is in hand.
    { layer: 'doors', name: 'alcazar_chapel', x: 32, y: 16, h: 2, props: { target: 'chapel_in', map: 'ardencia-chapel', exit: 'left', if: `${ERRAND.accepted}, !${ERRAND.done}, !story.trial_fought`, closed: 'chapel_stair_shut' } },
    { layer: 'doors', name: 'quiet_stair', x: 0, y: 16, h: 2, props: { target: 'crypt_stair', map: 'ardencia-chapel', exit: 'right', if: ERRAND.promise, closed: 'quiet_stair_shut' } },
    // Ar-3 The Elders' Feast (built Oct 27): standing guard at the elders' hall's door; the salt-tax book in the records room.
    trigger('feast_guard', FEAST.hallDoor.x, FEAST.hallDoor.y, { dialogue: 'feast_guard', if: `${FEAST_FLAGS.accepted}, !${FEAST_FLAGS.heard}` }, 1, 2),
    obj('salt_tax_book', FEAST.taxBook.x, FEAST.taxBook.y, { solid: true, era: 'present', dialogue: 'salt_tax_book' }),
    // The audience (again until it is done: review 3.6).
    trigger('audience', 11, 18, { dialogue: 'audience', if: 'story.azzy_met, !story.trial_set' }, 11, 1),
    npc('zelia_hall', 15, 5, 'down', { npc: 'zelia', if: '!side.treasurer.zelia' }),
    npc('zelia_records', 21, 8, 'right', { npc: 'zelia', if: 'side.treasurer.zelia, !side.treasurer.benny_open' }),
    npc('zelia_benny', 11, 17, 'up', { npc: 'zelia', if: 'side.treasurer.benny_open' }),
    npc('rivera_hall', 20, 2, 'down', { npc: 'rivera', if: BEFORE_TRIAL }),
    npc('treasurer_daughter', 11, 8, 'left', { if: '!side.treasurer.done' }),
    npc('treasurer_daughter_sat', 13, 7, 'down', { npc: 'treasurer_daughter', if: 'side.treasurer.done' }),
    npc('ard_elder_a', 3, 5, 'down'),
    npc('ard_elder_b', 5, 5, 'down'),
    npc('ard_elder_c', 7, 5, 'down'),
    npc('hall_witness', 13, 12, 'right'),
    npc('hall_skeptic', 14, 12, 'left'),
    npc('alcazar_courier', 19, 17, 'up'),
    npc('benny_guard', 11, 16, 'left', { if: '!side.treasurer.benny_open' }),
    npc('benny_guard_aside', 11, 14, 'down', { npc: 'benny_guard', if: 'side.treasurer.benny_open' }),
    npc('benny_old', 3, 15, 'right'),
    npc('nancy', 6, 17, 'up'),
    // The records room: the steward's rope until she lets the party in.
    obj('records_rope', 22, 6, { kind: 'barricade', solid: true, era: 'present', if: '!side.treasurer.zelia', dialogue: 'records_rope' }, 1, 2),
    obj('records_shelf', 27, 2, { dialogue: 'records_shelf', era: 'present' }),
    obj('alcazar_records', 24, 2, { dialogue: 'shelf.alcazar_records', era: 'present' }, 2, 1),
    obj('line_record', 30, 2, { dialogue: 'line_record', era: 'present' }),
    obj('tapestry', 32, 6, { dialogue: 'tapestry', era: 'present' }),
    obj('benny_desk', 29, 4, { dialogue: 'benny_desk', era: 'echo' }, 2, 1),
    obj('rael_seat', 16, 2, { dialogue: 'rael_seat', era: 'present' }),
    obj('lord_door', 19, 1, { dialogue: 'lord_door', era: 'present' }),
    {
      layer: 'echo_zones',
      name: 'records_echo',
      x: 25,
      y: 5,
      w: 4,
      h: 3,
      props: { if: 'side.treasurer.zelia', onEcho: 'records_echo_enter', onReturn: 'records_echo_return' },
    },
    npc('echo_clerk', 30, 6, 'left', { era: 'echo' }),
    npc('benny_office', 24, 8, 'up', { era: 'echo' }),
  ];
  return { id: 'ardencia-alcazar', present: g, echo: e, objects, interior: true };
}

/**
 * The Lower Town: the poor quarter below the walls. The soup line outside Amanda's kitchen (the barrels with the
 * grey thumbprint), the debate corner, the lane the covered cart comes down by night, and the old well where Azzy
 * and the party watch it. By night (story.cart_night) the street empties and the lamps go out.
 */
export function ardenciaLower(): MapSource {
  const W = 32;
  const H = 22;
  const g = new Grid(W, H, CINDER);
  g.rect(0, 0, W, 1, RED_WALL).rect(0, 0, 1, H, RED_WALL).rect(0, H - 1, W, 1, RED_WALL).rect(W - 1, 0, 1, H, RED_WALL);
  g.rect(W - 1, 9, 1, 2, ROAD);
  // Lanes: the street from the Upper Town gate, the lane down from the north.
  g.rect(1, 9, W - 1, 2, ROAD).rect(20, 1, 2, 9, ROAD);
  // Houses, and Amanda's kitchen with its soup line.
  house(g, 2, 2, 6);
  house(g, 10, 2, 7);
  house(g, 24, 2, 6);
  house(g, 2, 14, 7);
  house(g, 24, 14, 6);
  house(g, 12, 15, 6);
  put(g, 'ϋ', [[10, 6], [11, 6]]);
  put(g, 'π', [[14, 5], [15, 5]]);
  // The old well (the corner where Azzy watches the cart), and a bench.
  g.set(18, 4, 'O');
  g.set(22, 12, 'ό');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'lower_town', x: W - 1, y: 9, h: 2, props: { target: 'town_lower', map: 'ardencia-town', exit: 'left' } },
    { layer: 'spawns', name: 'lower', x: 28, y: 9, props: { facing: 'left', era: 'present' } },
    npc('amanda', 12, 6, 'down', { if: DAY }),
    npc('amanda_night', 12, 6, 'down', { npc: 'amanda', if: NIGHT }),
    npc('soup_line_a', 13, 8, 'up', { if: DAY }),
    npc('soup_line_b', 14, 8, 'up', { if: DAY }),
    npc('soup_line_c', 10, 8, 'up', { if: DAY }),
    obj('thumb_barrel', 14, 5, { dialogue: 'thumb_barrel', era: 'present' }, 2, 1),
    obj('lower_well', 18, 4, { dialogue: 'lower_well', era: 'present' }),
    // The debate corner (by day).
    npc('debate_widow', 18, 13, 'right', { if: DAY }),
    npc('debate_knight', 21, 13, 'left', { if: DAY }),
    npc('lower_porter', 6, 11, 'up', { if: DAY }),
    npc('lower_mother', 27, 12, 'up', { if: DAY }),
    // Bread at Night: Azzy waits at the Upper Town gate at dusk; the corner by the well is where they watch.
    npc('azzy_lower', 29, 11, 'left', { if: 'side.bread.thumb, !side.bread.done' }),
    trigger('bread_corner', 17, 5, { dialogue: 'bread_cart', if: 'story.cart_night, !side.bread.done' }, 3, 1),
  ];
  return { id: 'ardencia-lower', present: g, echo: g.clone(), objects };
}

/** La Biblioteca Vieja: the Ash Wars shelves and a librarian. */
export function ardenciaLibrary(): MapSource {
  const W = 18;
  const H = 12;
  const g = new Grid(W, H, RED_STONE);
  walls(g);
  g.set(8, H - 1, 'D');
  g.rect(2, 1, 4, 1, 'Ϗ').rect(7, 1, 4, 1, 'Ϗ').rect(12, 1, 4, 1, 'Ϗ');
  put(g, 'ϋ', [[4, 5], [5, 5], [12, 5], [13, 5]]);
  g.rect(7, 3, 4, 6, 'ύ');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'library_out', x: 8, y: H - 1, props: { target: 'town_library', map: 'ardencia-town', exit: 'up' } },
    { layer: 'spawns', name: 'library', x: 8, y: H - 3, props: { facing: 'up', era: 'present' } },
    obj('ard_shelf_war', 2, 1, { dialogue: 'shelf.ard_shelf_war', era: 'present' }, 4, 1),
    obj('ard_shelf_law', 7, 1, { dialogue: 'shelf.ard_shelf_law', era: 'present' }, 4, 1),
    obj('ard_shelf_trade', 12, 1, { dialogue: 'shelf.ard_shelf_trade', era: 'present' }, 4, 1),
    npc('ard_librarian', 14, 7, 'left'),
  ];
  return { id: 'ardencia-library', present: g, echo: g.clone(), objects, interior: true };
}

/** Where the three lava channels cross the armory hall (x of their left column), A nearest the cell. */
export const FORGE_CHANNELS = { a: 18, b: 13, c: 8 } as const;

/**
 * The forge fortress's armory hall (SIG-ARD): the party's cell behind iron bars on the east side; three lava
 * channels crossing the floor from the forges (north) to the furnace mouths (south), across the middle walkway;
 * the bellows and, behind them, the lever; the blank far wall. In the Echo (Benny's armory the night before the
 * march) the ditches are dry and the gates turn: set right, left, right, the fire runs along the walls and the
 * walkway is clear (anchors); Benny's lever opens the far wall. The Echo zone starts at the bars, so the memory is
 * only reached once Azzy has left the key (review 3.7).
 */
export function ardenciaForge(): MapSource {
  const W = 30;
  const H = 20;
  const g = new Grid(W, H, RED_WALL);
  g.rect(1, 1, 23, 18, IRON);
  // The cell (east), behind the bars.
  g.rect(25, 6, 4, 7, IRON).rect(24, 8, 1, 3, IRON);
  // The yard door the guards and Azzy use (shut to the party).
  g.set(21, 0, '@');
  // The far wall: the hidden door (two tiles, like every door), a tapestry above it.
  g.rect(0, 9, 1, 2, 'D').set(0, 7, 'ν');
  // Racks, barrels, the bellows.
  g.rect(2, 1, 4, 1, 'σ').rect(2, 18, 4, 1, 'ω');
  put(g, 'μ', [[3, 3], [4, 3]]);
  put(g, 'ω', [[22, 16], [22, 2]]);
  const e = g.clone();
  for (const x of Object.values(FORGE_CHANNELS)) {
    g.rect(x, 1, 2, 18, LAVA);
    e.rect(x, 1, 2, 18, DITCH);
  }

  const gate = (k: 'a' | 'b' | 'c'): ObjSpec[] => {
    const x = FORGE_CHANNELS[k];
    return [
      // The gate sits in the channel's east half, where it can be reached from the cell side.
      obj(`forge_gate_${k}`, x + 1, 7, { dialogue: `forge_gate_${k}`, kind: 'forge_gate', solid: true, era: 'echo' }),
      obj(`fused_gate_${k}`, x + 1, 7, { dialogue: `fused_gate_${k}`, kind: 'forge_gate', era: 'present' }),
      obj(`channel_${k}_clear`, x, 8, { kind: 'iron_floor', walkable: true, era: 'present', if: `anchor.forge_gate_${k}` }, 2, 3),
      { layer: 'anchors', name: `forge_gate_${k}_anchor`, x: x + 1, y: 7, props: { object: `forge_gate_${k}`, flag: `anchor.forge_gate_${k}` } },
    ];
  };

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'forge_tunnel', x: 0, y: 9, h: 2, props: { target: 'tunnel_in', map: 'ardencia-tunnel', exit: 'right', if: 'anchor.benny_lever, party.azzy', closed: 'blank_wall' } },
    { layer: 'spawns', name: 'cell', x: 26, y: 9, props: { facing: 'left', era: 'present' } },
    // Arriving in the cell (and again until the key is in Gianna's hand: review 3.6).
    trigger('forge_arrive', 26, 9, { dialogue: 'forge_arrive', flag: 'story.forge_arrived', once: true, onEnter: true, if: '!story.forge_open' }),
    trigger('forge_wait', 25, 6, { dialogue: 'forge_arrive', if: '!story.forge_open' }, 4, 7),
    obj('cell_bars', 24, 8, { kind: 'iron_bars', solid: true, era: 'present', if: '!story.forge_open', dialogue: 'cell_bars' }, 1, 3),
    {
      layer: 'echo_zones',
      name: 'armory',
      x: 20,
      y: 8,
      w: 4,
      h: 3,
      props: { if: 'story.forge_open', onEcho: 'forge_echo_enter', onReturn: 'forge_echo_return' },
    },
    ...gate('a'),
    ...gate('b'),
    ...gate('c'),
    // The lever behind the bellows: rusted into the wall now; in the memory, new.
    obj('benny_lever', 2, 4, { dialogue: 'benny_lever', kind: 'forge_lever', solid: true, era: 'echo' }),
    obj('lever_rusted', 2, 4, { dialogue: 'lever_rusted', kind: 'forge_lever', solid: true, era: 'present' }),
    { layer: 'anchors', name: 'benny_lever_anchor', x: 2, y: 4, props: { object: 'benny_lever', flag: 'anchor.benny_lever' } },
    // The blank wall, and the way it opens once the lever has been pulled fifty years ago.
    obj('wall_shut', 0, 9, { kind: 'red_wall', era: 'present', if: '!anchor.benny_lever', dialogue: 'blank_wall' }, 1, 2),
    obj('wall_open', 0, 9, { kind: 'cave', walkable: true, era: 'present', if: 'anchor.benny_lever' }, 1, 2),
    // The bell, and Azzy coming back for them, after the memory (again until he has joined).
    trigger('bell_resume', 2, 8, { dialogue: 'forge_bell', if: 'anchor.benny_lever, anchor.forge_gate_a, anchor.forge_gate_b, anchor.forge_gate_c, !party.azzy' }, 18, 3),
    obj('weapon_racks', 2, 1, { dialogue: 'weapon_racks', era: 'present' }, 4, 1),
    // Fifty years ago: the forge-master at the channels, young Lord Benny by the bellows.
    npc('echo_forgemaster', 11, 5, 'down', { era: 'echo' }),
    npc('benny_forge', 5, 5, 'right', { era: 'echo' }),
  ];
  return { id: 'ardencia-forge', present: g, echo: e, objects, interior: true };
}

/** Benny's tunnel: a black lava tube under the wall, the bats' narrow, and the barred far end onto the sea road. */
export function ardenciaTunnel(): MapSource {
  const W = 30;
  const H = 10;
  const g = new Grid(W, H, BASALT);
  g.rect(1, 3, 28, 4, CINDER);
  // The narrow.
  g.rect(13, 3, 3, 4, BASALT).rect(13, 5, 3, 1, CINDER);
  // The ends: the forge wall (east) and the mouth onto the sea road (west), rubble either side.
  g.rect(W - 1, 5, 1, 2, 'D');
  g.rect(0, 5, 1, 2, 'D');
  put(g, LAVA, [[6, 6], [7, 6], [22, 3], [23, 3]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'tunnel_in', x: W - 1, y: 5, h: 2, props: { target: 'forge_tunnel', map: 'ardencia-forge', exit: 'left', if: '!story.tunnel_entered', closed: 'tunnel_sealed' } },
    { layer: 'doors', name: 'tunnel_out', x: 0, y: 5, h: 2, props: { target: 'flats_tunnel', map: 'ardencia-flats', exit: 'right' } },
    { layer: 'spawns', name: 'tunnel', x: 27, y: 5, props: { facing: 'left', era: 'present' } },
    trigger('tunnel_enter', 28, 5, { dialogue: 'tunnel_enter', flag: 'story.tunnel_entered', once: true, onEnter: true, if: 'party.azzy' }),
    // The bats at the narrow: the fight, and again after a Game Over until it is won.
    trigger('tunnel_bats', 17, 3, { dialogue: 'tunnel_bats', if: '!encounter.ardencia_story.bats.won' }, 1, 4),
    // The far end, barred from outside, until Amanda lifts the bar (again until she has: review 3.6).
    obj('tunnel_bar', 1, 5, { kind: 'barricade', solid: true, era: 'present', if: '!story.tunnel_unbarred', dialogue: 'tunnel_bar' }, 1, 2),
    trigger('tunnel_end', 4, 3, { dialogue: 'tunnel_end', if: 'encounter.ardencia_story.bats.won, !story.tunnel_unbarred' }, 1, 4),
    obj('lamp_hooks', 20, 3, { dialogue: 'lamp_hooks', era: 'present' }),
  ];
  return { id: 'ardencia-tunnel', present: g, echo: g.clone(), objects, interior: true };
}

/** The Free Brasador camp on the strand: the fire, the soldiers who followed Azzy, the trader's boat. */
export function ardenciaCamp(): MapSource {
  const W = 24;
  const H = 16;
  const g = new Grid(W, H, BLACK_SAND);
  g.rect(0, 0, W, 2, BASALT).rect(0, 0, 1, 12, BASALT).rect(0, 12, W, 4, '~');
  g.rect(W - 1, 0, 1, 12, BASALT).rect(W - 1, 7, 1, 2, ROAD).rect(14, 7, 9, 2, ROAD);
  g.set(10, 6, 'ϑ');
  put(g, 'ϐ', [[5, 3], [14, 3], [9, 3]]);
  g.rect(7, 11, 3, 1, 'k');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'camp_flats', x: W - 1, y: 7, h: 2, props: { target: 'flats_camp', map: 'ardencia-flats', exit: 'left' } },
    { layer: 'spawns', name: 'strand', x: 20, y: 8, props: { facing: 'left', era: 'present' } },
    trigger('camp_arrive', 20, 8, { dialogue: 'camp_arrive', flag: 'story.camp_seen', once: true, onEnter: true, if: 'story.ardencia_escaped, !act3.complete' }),
    trigger('camp_resume', 12, 5, { dialogue: 'camp_arrive', if: 'story.ardencia_escaped, !act3.complete' }, 6, 4),
    obj('camp_fire', 10, 6, { dialogue: 'camp_fire', era: 'present' }),
    obj('trader_boat', 7, 12, { kind: 'dugout', solid: true, era: 'present', dialogue: 'trader_boat' }, 3, 1),
    npc('free_soldier_a', 9, 5, 'down'),
    npc('free_soldier_b', 11, 7, 'up'),
    npc('free_soldier_c', 12, 5, 'left'),
    npc('camp_quartermaster', 17, 5, 'down'),
    npc('camp_trader', 8, 10, 'up'),
    // Ar-5 The Arrows Missed (built Oct 27): two more of Azzy's company, a crossbowman and a musketeer off the wall.
    npc('free_soldier_d', CAMP.soldierD.x, CAMP.soldierD.y, 'right'),
    npc('free_soldier_e', CAMP.soldierE.x, CAMP.soldierE.y, 'left'),
  ];
  return { id: 'ardencia-camp', present: g, echo: g.clone(), objects };
}

/**
 * The chapel cloister under the Alcázar (Ar-4 The Old Lord's Errand, S-ARD; built Oct 27; data/ardencia.ts CHAPEL): the
 * stair in from the sitting room onto the south walk, the east and north walks round a dry garth with its well, the
 * crypt off the north walk (bolted from inside now; open fifty years ago, its bolt loose: the anchor), Benny's own stair
 * up from the crypt to his quiet rooms. Every walk is an Echo zone. Rael's guards stand in three alcoves now and Benny's
 * honor guard in two others then; each looks across the walk (the lamplight or the torchlight on the flags shows where).
 */
export function ardenciaChapel(): MapSource {
  const { w: W, h: H } = CHAPEL;
  const g = new Grid(W, H, RED_WALL);
  for (const walk of [CHAPEL.south, CHAPEL.east, CHAPEL.north]) g.rect(walk.x, walk.y, walk.w, walk.h, RED_STONE);
  // The garth: dry cinder and stones inside a low wall, the old well in its middle.
  g.rect(1, 6, 18, 6, 'ϊ').set(CHAPEL.well.x, CHAPEL.well.y, 'O');
  // The crypt, its doorway (the bolt's housing and the gap), Benny's stair in its west wall, and the stair in.
  g.rect(CHAPEL.crypt.x, CHAPEL.crypt.y, CHAPEL.crypt.w, CHAPEL.crypt.h, RED_STONE);
  g.set(CHAPEL.bolt.x, CHAPEL.bolt.y, RED_STONE).set(CHAPEL.doorway.x, CHAPEL.doorway.y, RED_STONE);
  g.rect(CHAPEL.stair.x, CHAPEL.stair.y, 1, 2, 'D');
  g.rect(CHAPEL.door.x, CHAPEL.door.y, 1, 2, 'D');
  // The guards' alcoves.
  for (const w of WATCHES) g.set(w.at.x, w.at.y, RED_STONE);
  const zone = { if: `item.sun_locket, ${ERRAND.accepted}`, onEcho: 'cloister_echo', onReturn: 'cloister_return' };
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'chapel_in', x: CHAPEL.door.x, y: CHAPEL.door.y, h: 2, props: { target: 'alcazar_chapel', map: 'ardencia-alcazar', exit: 'right' } },
    { layer: 'doors', name: 'crypt_stair', x: CHAPEL.stair.x, y: CHAPEL.stair.y, h: 2, props: { target: 'quiet_stair', map: 'ardencia-alcazar', exit: 'right', if: ERRAND.promise, closed: 'crypt_stair_shut' } },
    { layer: 'spawns', name: 'cloister_gate', x: CHAPEL.gate.x, y: CHAPEL.gate.y, props: { facing: 'right', era: 'present' } },
    // The first time down: the cloister, and Anissa's first word.
    trigger('cloister_arrive', CHAPEL.gate.x, CHAPEL.gate.y, { dialogue: 'cloister_arrive', flag: 'side.old_errand.cloister', once: true, onEnter: true, if: ERRAND.accepted }),
    ...(['south', 'east', 'north'] as const).map((k): ObjSpec => {
      const walk = CHAPEL[k];
      return { layer: 'echo_zones', name: `cloister_${k}`, x: walk.x, y: walk.y, w: walk.w, h: walk.h, props: zone };
    }),
    // The watches: the guard in his alcove, the light on the strip he sees, and being seen there (in his era only).
    ...WATCHES.flatMap((w): ObjSpec[] => [
      npc(watchGuard(w), w.at.x, w.at.y, w.facing, { era: w.era }),
      obj(`watch_${w.id}`, w.strip.x, w.strip.y, { kind: w.era === 'present' ? 'sight_now' : 'sight_then', walkable: true, era: w.era }, w.strip.w, w.strip.h),
      trigger(`seen_${w.id}`, w.strip.x, w.strip.y, { dialogue: `seen_${w.id}`, era: w.era, if: `${ERRAND.accepted}, !${ERRAND.promise}` }, w.strip.w, w.strip.h),
    ]),
    // The crypt door: bolted from inside now; fifty years ago its bolt slides loose in the housing (the anchor), and once
    // Patricio's nail is in it the door has stood a hand open for fifty years.
    obj('crypt_door_bolted', CHAPEL.bolt.x, CHAPEL.bolt.y, { kind: 'crypt_door_bolted', solid: true, era: 'present', if: `!${ERRAND.anchor}`, dialogue: 'crypt_door_bolted' }, 2, 1),
    obj('crypt_door_jammed', CHAPEL.bolt.x, CHAPEL.bolt.y, { kind: 'crypt_door_jammed', solid: true, era: 'present', if: ERRAND.anchor, dialogue: 'crypt_door_jammed' }),
    obj('crypt_bolt', CHAPEL.bolt.x, CHAPEL.bolt.y, { kind: 'crypt_bolt', solid: true, era: 'echo', dialogue: 'crypt_bolt' }),
    { layer: 'anchors', name: 'crypt_bolt_anchor', x: CHAPEL.bolt.x, y: CHAPEL.bolt.y, props: { object: 'crypt_bolt', flag: ERRAND.anchor } },
    // The niche: the iron box now; fifty years ago young Benny kneels by it with his letter.
    obj('promise_niche', CHAPEL.niche.x, CHAPEL.niche.y, { kind: 'promise_niche', solid: true, era: 'present', dialogue: 'promise_niche' }),
    obj('promise_niche_echo', CHAPEL.niche.x, CHAPEL.niche.y, { kind: 'promise_niche', solid: true, era: 'echo', dialogue: 'promise_niche_echo' }),
    npc('benny_crypt', CHAPEL.bennyYoung.x, CHAPEL.bennyYoung.y, 'up', { era: 'echo' }),
    obj('cloister_well', CHAPEL.well.x, CHAPEL.well.y, { era: 'both', dialogue: 'cloister_well' }),
  ];
  return { id: 'ardencia-chapel', present: g, echo: g.clone(), objects, interior: true };
}

export const ARDENCIA_SOURCES: readonly (() => MapSource)[] = [
  ardenciaFlats,
  ardenciaTown,
  ardenciaAlcazar,
  ardenciaLower,
  ardenciaLibrary,
  ardenciaForge,
  ardenciaTunnel,
  ardenciaCamp,
  ardenciaChapel,
];
