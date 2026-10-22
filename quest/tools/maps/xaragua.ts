// Yucayeque, the capital of Xaraguá (House Yaguana), for Chapter 2 (the maps build, Oct 16). The living
// city before the Crown attacks: the Harbor Village (the hub, with the Crown's customs house and ships at
// anchor), the Areíto Plaza with the cacique's great house (the caney) on its terrace, the Canoe Beach and
// its market, the cassava gardens (conuco) on the hill, the Mountain Path (the wild section) and the hill
// camp above it. Inside: the Caney of Anaco (the seat of government), the Song House (the library) and the
// Crown Customs House. Design: docs/quest/design/CAPITALS.md section 2. The Beach, the gardens and the camp
// are proposals added to reach the owner's five outdoor areas.
//
// Nothing here looks like Pòdlimyè (owner request, Oct 16): its own ground (lush grass, red-earth trails,
// coral sand, a turquoise lagoon, limestone), its own plants (palms, ceibas, ferns, bananas, heliconia),
// round thatched houses in rings round their yards, winding trails and oval clearings instead of streets
// and squares. Only the Crown's customs house is stone, because it does not belong. The Echo is the same
// ground fifty years ago; its scenes come with the story build.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';
import { BEACH, CAMP, CANEY, CAVE, COMPANIES, CONUCO, FLANK_HOUSES, MOUNTAIN, OCCUPIED_TEXT, SONG, VILLAGE, WAR_DAY_TEXT, WAR_TABLE_TEXT, WAR_TEXT } from '../../src/data/war.ts';

const GRASS = 'ā';
const TRAIL = 'ē';
const SAND = 'ī';
const LAGOON = 'ō';
const ROCK = 'ū';
const FLOWERS = 'ǎ';

/**
 * The Crown attack (Chapter 2's midpoint, owner decision Oct 15): from the night the guns fire, the same maps
 * are occupied. Townsfolk keep indoors (PEACE), marines stand at checkpoints and Crown banners go up (WAR).
 */
const PEACE = '!story.crown_attack';
const WAR = 'story.crown_attack';
/** The marines' checkpoints stand from the morning after the attack until the envoy shows her papers. */
const CHECKPOINTS = 'story.refuge, !story.papers_checked';
/** Chapter 2's side quests (Oct 20): their things lie about the free city from the pier fight until the attack. */
const FREE_CITY = 'encounter.xaragua_story.pier.won, !story.crown_attack';

/** A Crown banner raised over the occupied city. */
function crownBanner(name: string, x: number, y: number): ObjSpec {
  return obj(name, x, y, { kind: 'crown_banner', solid: true, era: 'present', if: OCCUPIED_TEXT });
}

/** Fifty years ago the customs house is older stone; the rest of the land is much as it is. */
const OLD = { '#': '%' } as const;

/** A forest edge of ceibas and ferns, mixed so it never looks like a wall. */
function forest(x: number, y: number): string {
  return (x * 5 + y * 3) % 3 === 0 ? 'ď' : 'č';
}

function border(g: Grid, sides: { top?: boolean; bottom?: boolean; left?: number; right?: number }): void {
  const { width: W, height: H } = g;
  if (sides.top !== false) for (let x = 0; x < W; x++) g.set(x, 0, forest(x, 0));
  if (sides.bottom) for (let x = 0; x < W; x++) g.set(x, H - 1, forest(x, H - 1));
  for (let y = 0; y < (sides.left ?? H); y++) g.set(0, y, forest(0, y));
  for (let y = 0; y < (sides.right ?? H); y++) g.set(W - 1, y, forest(W - 1, y));
}

/** A winding trail two tiles wide through the points, in straight runs between them. */
function trail(g: Grid, points: readonly (readonly [number, number])[], ch = TRAIL): void {
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1]!;
    const [bx, by] = points[i]!;
    g.rect(Math.min(ax, bx), Math.min(ay, by), Math.abs(ax - bx) + 2, Math.abs(ay - by) + 2, ch);
  }
}

/** An oval clearing. */
function oval(g: Grid, cx: number, cy: number, rx: number, ry: number, ch: string): void {
  for (let y = 0; y < g.height; y++) {
    for (let x = 0; x < g.width; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) g.set(x, y, ch);
  }
}

/** Tiles round an oval at `n` even angles (rounded), for stone rings, stalls and palisades. */
function around(cx: number, cy: number, rx: number, ry: number, n: number, from = 0, to = Math.PI * 2): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = from + ((to - from) * i) / (to - from >= Math.PI * 2 ? n : n - 1);
    const p: [number, number] = [Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a))];
    if (!out.some(([x, y]) => x === p[0] && y === p[1])) out.push(p);
  }
  return out;
}

/** A round house (bohío): a domed thatch over a cane wall. It gets a grey door like every closed building. */
function bohio(g: Grid, x: number, y: number): void {
  g.set(x + 1, y, 'á').set(x + 2, y, 'á');
  g.rect(x, y + 1, 4, 1, 'á').rect(x, y + 2, 4, 1, 'é');
}

function put(g: Grid, ch: string, at: readonly (readonly [number, number])[]): void {
  for (const [x, y] of at) g.set(x, y, ch);
}

/** The shore: coral sand down to a lagoon, both edges rolling gently. */
function shore(g: Grid, sandFrom: number, waterFrom: number): void {
  for (let x = 0; x < g.width; x++) {
    const sand = sandFrom + Math.round(Math.sin(x * 0.35 + 1));
    const water = waterFrom + Math.round(Math.sin(x * 0.25));
    for (let y = sand; y < g.height; y++) g.set(x, y, y < water ? SAND : LAGOON);
  }
}

export function xaraguaVillage(): MapSource {
  const W = 44;
  const H = 30;
  const g = new Grid(W, H, GRASS);
  border(g, { left: 18, right: 18 });
  shore(g, 18, 22);

  // Trails wind between the house rings: up to the plaza, west to the gardens, east to the beach.
  trail(g, [[21, 0], [21, 6], [24, 6], [24, 12], [21, 12], [21, 19]]);
  trail(g, [[0, 15], [5, 15], [5, 12], [13, 12], [13, 15], [21, 15]]);
  trail(g, [[22, 15], [28, 15], [28, 17], [37, 17], [37, 15], [42, 15]]);

  // The pier where the ferry lands, a canoe jetty, canoes drawn up and afloat.
  g.rect(21, 19, 2, 9, 'k').rect(8, 21, 1, 4, 'k');
  put(g, 'ĉ', [[10, 23], [14, 24], [26, 23]]);
  put(g, 'ć', [[6, 20], [16, 20]]);

  // West: round houses in a ring round their shared yard and cooking fire.
  oval(g, 11.5, 7, 4, 2.5, 'ú');
  g.set(11, 7, 'ğ');
  for (const [x, y] of [[3, 3], [8, 1], [14, 1], [17, 6], [3, 8]] as const) bohio(g, x, y);
  // East: more houses up the slope.
  for (const [x, y] of [[27, 3], [32, 2], [37, 4], [38, 10]] as const) bohio(g, x, y);

  // The Crown Customs House: square stone and red tile among the thatch, flying the Crown's banner.
  g.rect(26, 8, 8, 2, '^').rect(26, 10, 8, 2, '#').set(29, 11, 'D');
  trail(g, [[29, 12], [29, 14]]);
  g.set(34, 11, 'N').set(32, 12, 'ś');

  // Bananas behind the houses, ferns, heliconia, palms on the sand and in the village.
  put(g, 'ě', [[2, 7], [7, 10], [16, 4], [35, 7], [41, 8], [19, 10]]);
  put(g, 'ď', [[10, 10], [26, 13], [40, 13]]);
  g.rect(15, 9, 3, 2, FLOWERS).rect(33, 13, 3, 1, FLOWERS).rect(2, 12, 2, 2, FLOWERS);
  put(g, 'ì', [[2, 20], [12, 19], [30, 19], [38, 20], [41, 19]]);
  put(g, 'í', [[18, 13], [34, 14], [41, 5]]);
  g.set(24, 19, 'ś');

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('canoe_fisher', 18, 20, 'down', { if: PEACE }),
    npc('weaver', 19, 13, 'down', { if: PEACE }),
    npc('fisher_boy', 25, 20, 'left', { if: PEACE }),
    npc('crown_marine', 27, 13, 'down', { if: PEACE }),
    npc('crown_marine_2', 36, 13, 'left', { if: PEACE }),
    npc('lamp_oil_seller', 23, 10, 'right', { if: PEACE }),
    // The debate corner: an elder of the springs and a Gaze pilgrim, arguing across the yard's fire.
    npc('debate_roots_elder', 9, 7, 'right', { if: PEACE }),
    npc('debate_pilgrim', 13, 7, 'left', { if: PEACE }),
    // Cut Nets (Chapter 2 side quest): the net cut on the village shore, by the canoe jetty, until it is taken back.
    obj('net_village', 12, 20, { dialogue: 'cut_net_village', kind: 'net_cut', solid: true, era: 'present', if: `${FREE_CITY}, !side.nets.village` }),
    // Occupied: checkpoints on the trails, the Crown's banners, and (on the night of the attack) the patrol
    // on the trail west (the fight starts on arrival; the sergeant restarts it after a lost fight).
    npc('occ_marine_curfew', 27, 13, 'down', { if: OCCUPIED_TEXT }),
    npc('occ_marine_trail', 36, 13, 'left', { if: OCCUPIED_TEXT }),
    npc('patrol_sergeant', 8, 15, 'up', { if: 'story.anaco_taken, !encounter.xaragua_story.patrol.won' }),
    trigger('attack_village', 21, 1, { dialogue: 'attack_village', flag: 'story.attack_village_seen', once: true, onEnter: true, if: 'story.anaco_taken' }),
    crownBanner('crown_banner_village', 28, 14),
    // The occupied city (second half): checkpoints on the trails north and east, lifted once the envoy has shown
    // her papers; the lamp-oil seller in her doorway; voices behind shutters; the Charter posted.
    obj('checkpoint_north', 21, 3, { dialogue: 'checkpoint', kind: 'barricade', solid: true, era: 'present', if: CHECKPOINTS }, 2, 1),
    npc('checkpoint_marine', 23, 3, 'left', { if: CHECKPOINTS }),
    obj('checkpoint_east', 41, 15, { dialogue: 'checkpoint', kind: 'barricade', solid: true, era: 'present', if: CHECKPOINTS }, 1, 2),
    npc('lamp_oil_shutters', 23, 10, 'right', { if: 'story.refuge, !story.war_begun' }),
    // The marine posted at her shutters (review 1, finding 3: the seller and the guard are one stop). Gone once the
    // envoy has seen the cacique (the runner's message is passed under his nose otherwise).
    npc('occ_marine_shutters', 22, 12, 'up', { if: 'story.refuge, !story.anaco_visited' }),
    // Out of the customs house after the visit: the fisher's boy runs the word to the cave (review 1, finding 3).
    trigger('word_runner', 29, 12, { dialogue: 'word_runner', flag: 'story.word_runner_seen', once: true, onEnter: true, if: 'story.anaco_visited, !story.escape_planned' }),
    obj('shutters_weaver', 18, 8, { dialogue: 'shutters_weaver', era: 'present', if: 'story.refuge, !story.harbor_taken' }),
    obj('shutters_family', 9, 3, { dialogue: 'shutters_family', era: 'present', if: 'story.refuge, !story.harbor_taken' }),
    crownBanner('crown_banner_pier', 20, 18),

    { layer: 'doors', name: 'village_plaza', x: 21, y: 0, w: 2, props: { target: 'plaza_village', map: 'xaragua-plaza', exit: 'down' } },
    { layer: 'doors', name: 'village_beach', x: W - 1, y: 15, h: 2, props: { target: 'beach_village', map: 'xaragua-beach', exit: 'left' } },
    { layer: 'doors', name: 'village_conuco', x: 0, y: 15, h: 2, props: { target: 'conuco_village', map: 'xaragua-conuco', exit: 'right' } },
    { layer: 'doors', name: 'village_customs', x: 29, y: 11, props: { target: 'customs_out', map: 'xaragua-customs', exit: 'down' } },
    // The ferry lands at the end of the pier (Chapter 1 ends with travel.next = xaragua-village/pier).
    { layer: 'spawns', name: 'pier', x: 21, y: 25, props: { facing: 'up', era: 'present' } },
    // Chapter 2 opens: the marines on the pier (they flee once beaten; the fight's aftermath plays at once).
    trigger('xaragua_arrival', 21, 25, { dialogue: 'xaragua_arrival', flag: 'story.xaragua_arrived', once: true, onEnter: true }),
    npc('marine_sergeant', 21, 23, 'down', { if: '!encounter.xaragua_story.pier.won' }),
    npc('pier_marine_a', 22, 22, 'down', { npc: 'pier_marine', if: '!encounter.xaragua_story.pier.won' }),
    npc('pier_marine_b', 21, 21, 'down', { npc: 'pier_marine', if: '!encounter.xaragua_story.pier.won' }),
    obj('xaragua_customs_sign', 32, 12, { dialogue: 'xaragua_customs_sign', era: 'present' }),
    obj('pier_sign', 24, 19, { dialogue: 'pier_sign', era: 'present' }),
    // The Crown's ships at anchor (one drawing each, on the lagoon), in the present only.
    // Chapter 11: on the Strike route the Crown's fleet goes out through the open mouth (story.fleet_escaped).
    obj('crown_ship_west', 2, 24, { kind: 'crown_ship', solid: true, era: 'present', if: '!story.fleet_escaped' }, 5, 3),
    obj('crown_ship_east', 29, 24, { kind: 'crown_ship', solid: true, era: 'present', if: '!story.fleet_escaped' }, 5, 3),
    obj('crown_ship_far', 36, 26, { kind: 'crown_ship', solid: true, era: 'present', if: '!story.fleet_escaped' }, 5, 3),
    ...warVillage(),
  ];
  return { id: 'xaragua-village', present: g, echo: e, objects };
}

export function xaraguaPlaza(): MapSource {
  const W = 30;
  const H = 22;
  const g = new Grid(W, H, GRASS);
  border(g, { bottom: true });

  // The Caney of Anaco at the head of the plaza (the seat of government, owner rule Oct 15): the long
  // great house of the cacique, its terrace of packed earth before it.
  g.rect(8, 1, 14, 3, 'á').set(8, 1, GRASS).set(21, 1, GRASS);
  g.rect(8, 4, 14, 1, 'é').set(14, 4, 'D');
  g.rect(9, 5, 12, 1, 'ú');

  // The areíto's oval dance ground (batey), ringed by carved standing stones; trails in and out.
  trail(g, [[14, 5], [14, 7]]);
  trail(g, [[14, 15], [14, 20]]);
  oval(g, 14.5, 11.5, 7.5, 4.5, 'ú');
  const stones = around(14.5, 11.5, 7.2, 4.3, 12).filter(([x]) => x !== 14 && x !== 15);
  put(g, 'ŗ', stones);

  // The Song House (the library), a great round house west; the record house east.
  g.set(2, 8, 'á').set(3, 8, 'á').set(4, 8, 'á');
  g.rect(1, 9, 5, 1, 'á').rect(1, 10, 5, 1, 'é').set(3, 10, 'D');
  trail(g, [[3, 11], [3, 12], [6, 12]]);
  // The council's record house: shut, until the drum song is tapped on the stones (SIG-XAR part 3).
  bohio(g, 24, 8);
  g.set(25, 10, 'D');

  put(g, 'í', [[3, 3], [26, 3], [5, 17], [24, 18], [27, 14]]);
  put(g, 'ě', [[2, 15], [26, 6]]);
  put(g, 'ď', [[6, 3], [23, 2], [10, 19], [19, 19]]);
  g.rect(3, 18, 4, 2, FLOWERS);

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('areito_drummer', 12, 11, 'down', { if: PEACE }),
    npc('dancer', 17, 12, 'left', { if: PEACE }),
    npc('plaza_elder', 21, 18, 'up', { if: PEACE }),
    // Occupied: a marine on the dance ground, banners either side of the caney's steps.
    npc('occ_marine_plaza', 18, 12, 'left', { if: OCCUPIED_TEXT }),
    crownBanner('crown_banner_batey_west', 12, 6),
    crownBanner('crown_banner_batey_east', 17, 6),
    // The night of the attack: out the back of the caney into a burning plaza.
    { layer: 'spawns', name: 'caney_back', x: 7, y: 6, props: { facing: 'down', era: 'present' } },
    trigger('attack_plaza', 7, 6, { dialogue: 'attack_plaza', flag: 'story.attack_plaza_seen', once: true, onEnter: true, if: 'story.anaco_taken' }),

    { layer: 'doors', name: 'plaza_village', x: 14, y: H - 1, w: 2, props: { target: 'village_plaza', map: 'xaragua-village', exit: 'up' } },
    { layer: 'doors', name: 'plaza_caney', x: 14, y: 4, props: { target: 'caney_out', map: 'xaragua-caney', exit: 'down' } },
    { layer: 'doors', name: 'plaza_song', x: 3, y: 10, props: { target: 'song_out', map: 'xaragua-song', exit: 'down' } },
    {
      layer: 'doors',
      name: 'plaza_record',
      x: 25,
      y: 10,
      props: { target: 'record_out', map: 'xaragua-record', exit: 'down', if: 'story.lock_opened', closed: 'record_house_closed' },
    },
    { layer: 'spawns', name: 'plaza', x: 14, y: 19, props: { facing: 'up', era: 'present' } },
    obj('batey_stones', stones[0]![0], stones[0]![1], { dialogue: 'batey_stones', era: 'present' }),

    // The Echo of the first oath (STORY.md Chapter 2, beat 5): the areíto fifty years ago, on the night
    // Caona, Patricio and Benny swore it. Open once the cave has shown the drum song (its last bar worn).
    {
      layer: 'echo_zones',
      name: 'batey_middle',
      x: 13,
      y: 13,
      w: 4,
      h: 2,
      props: { if: 'item.sun_locket, clue.drum_pattern', onEcho: 'areito_echo_enter', onReturn: 'areito_echo_return' },
    },
    npc('echo_caona', 14, 9, 'down', { npc: 'caona', era: 'echo' }),
    npc('echo_benny', 16, 9, 'down', { npc: 'benny', era: 'echo' }),
    npc('echo_areito_drummer', 10, 11, 'right', { era: 'echo' }),
    npc('echo_areito_drummer_2', 19, 11, 'left', { npc: 'echo_areito_drummer', era: 'echo' }),
    npc('echo_areito_singer', 12, 15, 'up', { era: 'echo' }),
  ];
  return { id: 'xaragua-plaza', present: g, echo: e, objects };
}

export function xaraguaBeach(): MapSource {
  const W = 36;
  const H = 22;
  const g = new Grid(W, H, GRASS);
  border(g, { left: 11, right: 11 });
  g.set(0, 7, GRASS).set(0, 8, GRASS);
  shore(g, 11, 15);

  // The limestone headland east, with the sea cave's mouth (low tide only: a later puzzle).
  oval(g, 31.5, 4.5, 4, 4.5, ROCK);
  g.set(31, 8, 'ĝ').set(31, 9, GRASS).set(32, 9, GRASS);

  // The trail from the village, past the market and down to the sand.
  trail(g, [[0, 7], [8, 7], [8, 9], [14, 9], [14, 11]]);

  // The beach market (unique to Yucayeque, owner rule Oct 15): a crescent of thatched stalls round a
  // packed-earth clearing, where fish, salt and cassava bread are traded.
  oval(g, 16, 4, 7, 3, 'ú');
  const stalls = [...around(16, 4, 6, 2.6, 7, Math.PI * 1.05, Math.PI * 1.95), [10, 5], [22, 5]] as [number, number][];
  put(g, 'ş', stalls);

  // Salt pans on the sand, canoes drawn up and afloat, palms.
  g.rect(23, 12, 5, 2, 'ŝ');
  put(g, 'ć', [[4, 13], [8, 13], [18, 12]]);
  put(g, 'ĉ', [[6, 16], [19, 17], [27, 17]]);
  put(g, 'ì', [[2, 12], [11, 13], [21, 13], [30, 12], [33, 13]]);
  put(g, 'í', [[25, 7], [3, 10], [4, 3]]);
  put(g, 'ď', [[26, 2], [6, 10]]);
  g.rect(24, 9, 3, 1, FLOWERS);

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('salt_seller', 25, 11, 'down', { if: PEACE }),
    npc('casabe_baker', 13, 3, 'up', { if: PEACE }),
    npc('carver', 16, 3, 'up', { if: PEACE }),
    npc('bow_maker', 19, 3, 'up', { if: PEACE }),
    npc('canoe_maker', 9, 13, 'left', { if: PEACE }),
    npc('shell_diver', 30, 10, 'up', { if: PEACE }),
    // Cut Nets (Chapter 2 side quest): two more cut nets, by the drawn-up canoes and at the salt pans.
    obj('net_beach', 6, 13, { dialogue: 'cut_net_beach', kind: 'net_cut', solid: true, era: 'present', if: `${FREE_CITY}, !side.nets.beach` }),
    obj('net_salt', 28, 12, { dialogue: 'cut_net_salt', kind: 'net_cut', solid: true, era: 'present', if: `${FREE_CITY}, !side.nets.salt` }),
    // Occupied: the market burned on the night of the attack, a musketeer on the trail.
    ...stalls.map(([x, y], i) => obj(`burned_stall_${i + 1}`, x, y, { kind: 'stall_burned', solid: true, era: 'present', if: WAR })),
    npc('occ_marine_beach', 13, 8, 'down', { if: `${OCCUPIED_TEXT}, !story.war_begun` }),

    // Chapter 11: the village is the Crown's until dusk (its trails held); the way in opens with the tide.
    { layer: 'doors', name: 'beach_village', x: 0, y: 7, h: 2, props: { target: 'village_beach', map: 'xaragua-village', exit: 'right', if: '!story.war_begun|story.tide_called', closed: 'village_held' } },
    { layer: 'spawns', name: 'beach', x: 2, y: 7, props: { facing: 'right', era: 'present' } },
    // Chapter 11's landing (the fleet off Yucayeque at first light; Chapter 10's voyage ends here).
    { layer: 'spawns', name: 'landing', x: 14, y: 11, props: { facing: 'up', era: 'present' } },
    // The sea cave: closed by the tide, until the night of the lowest tide (the escape, Chapter 2's end).
    {
      layer: 'doors',
      name: 'beach_seacave',
      x: 31,
      y: 8,
      props: { target: 'seacave_out', map: 'xaragua-seacave', exit: 'down', if: 'story.escape_night', closed: 'sea_cave_mouth' },
    },
    ...warBeach(),
  ];
  return { id: 'xaragua-beach', present: g, echo: e, objects };
}

export function xaraguaConuco(): MapSource {
  const W = 32;
  const H = 22;
  const g = new Grid(W, H, GRASS);
  border(g, { bottom: true });

  // The trail from the village climbs to the Mountain Path.
  trail(g, [[30, 9], [16, 9], [16, 7], [9, 7], [9, 4], [6, 4], [6, 0]]);

  // Cassava mounds (conuco) in staggered terraces following the hill.
  g.rect(12, 2, 16, 2, 'ó').rect(13, 5, 15, 1, 'ó');
  g.rect(2, 12, 11, 2, 'ó').rect(15, 12, 13, 2, 'ó').rect(3, 15, 11, 1, 'ó').rect(16, 15, 6, 1, 'ó');
  g.rect(2, 2, 3, 3, 'ó');

  // A pond fed by the hill springs, and the petroglyph cave in a limestone outcrop (the signature
  // puzzle, later): carved stones flank its mouth.
  oval(g, 25, 17.5, 3, 2, LAGOON);
  oval(g, 6, 19.5, 4.5, 2.5, ROCK);
  g.set(6, 17, 'ĝ');
  put(g, 'ŕ', [[2, 16], [10, 16]]);

  put(g, 'ě', [[14, 7], [21, 6], [3, 8], [29, 5]]);
  put(g, 'í', [[29, 13], [12, 18]]);
  put(g, 'ď', [[19, 18], [1, 10]]);
  g.rect(17, 18, 3, 2, FLOWERS);

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('cassava_farmer', 20, 4, 'up', { if: PEACE }),
    npc('cassava_farmer_2', 11, 5, 'right', { if: PEACE }),
    npc('conuco_kid', 16, 14, 'down', { if: PEACE }),
    // The Hutia's Hoard (Chapter 2 side quest, PUZZLES.md M-XAR-1): the hutia's dropped things lead west to the old
    // ceiba, whose hollow is out of reach; fifty years ago it was a sapling with a stake leaning by it (two of
    // Caona's scouts teasing a hutia). Staked in the memory (the anchor), it grew a low fork you can climb.
    obj('glint_pond', 21, 15, { kind: 'glint', era: 'present', if: 'side.hutia.accepted, !side.hutia.tree' }),
    obj('glint_trail', 9, 11, { kind: 'glint', era: 'present', if: 'side.hutia.accepted, !side.hutia.tree' }),
    obj('old_ceiba', 2, 9, { dialogue: 'old_ceiba', kind: 'ceiba', solid: true, era: 'present', if: '!anchor.hutia_stake' }),
    obj('old_ceiba_fork', 2, 9, { dialogue: 'old_ceiba', kind: 'ceiba_fork', solid: true, era: 'present', if: 'anchor.hutia_stake' }),
    {
      layer: 'echo_zones',
      name: 'ceiba_roots',
      x: 2,
      y: 10,
      w: 2,
      h: 2,
      props: { if: 'item.sun_locket, side.hutia.tree', onEcho: 'hutia_echo_enter', onReturn: 'hutia_echo_return' },
    },
    obj('ceiba_sapling', 2, 9, { dialogue: 'ceiba_sapling', kind: 'sapling', solid: true, era: 'echo' }),
    { layer: 'anchors', name: 'hutia_stake', x: 2, y: 9, props: { object: 'ceiba_sapling', flag: 'anchor.hutia_stake' } },
    npc('echo_hutia_scout', 5, 9, 'left', { era: 'echo' }),
    npc('echo_hutia_scout_2', 4, 12, 'up', { era: 'echo' }),
    // The occupied city: the fever-bark tree by the spring pond (the healer asks for its bark for Anaco).
    obj('fever_bark_tree', 29, 18, { dialogue: 'fever_bark_tree', kind: 'ceiba', solid: true, era: 'present' }),

    { layer: 'doors', name: 'conuco_village', x: W - 1, y: 9, h: 2, props: { target: 'village_conuco', map: 'xaragua-village', exit: 'left', if: '!story.war_begun|story.tide_called', closed: 'village_held' } },
    { layer: 'doors', name: 'conuco_mountain', x: 6, y: 0, w: 2, props: { target: 'mountain_conuco', map: 'xaragua-mountain', exit: 'down' } },
    { layer: 'spawns', name: 'conuco', x: W - 3, y: 9, props: { facing: 'left', era: 'present' } },
    // The petroglyph cave (SIG-XAR): dark and flooded; it opens once the lamp-oil seller has lent a lamp.
    {
      layer: 'doors',
      name: 'conuco_cave',
      x: 6,
      y: 17,
      props: { target: 'cave_out', map: 'xaragua-cave', exit: 'up', if: 'item.oil_lamp', closed: 'petroglyph_cave_mouth' },
    },
    ...warConuco(),
  ];
  return { id: 'xaragua-conuco', present: g, echo: e, objects };
}

export function xaraguaMountain(): MapSource {
  const W = 46;
  const H = 28;
  const g = new Grid(W, H, GRASS);
  border(g, { bottom: true });

  // Cloud forest: ceibas, ferns and wild bananas everywhere off the trail, limestone outcrops.
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      if ((x * 7 + y * 3) % 5 === 0) g.set(x, y, 'č');
      else if ((x + y * 2) % 7 === 0) g.set(x, y, 'ď');
      else if ((x * 3 + y * 5) % 17 === 0) g.set(x, y, 'ě');
    }
  }
  oval(g, 7, 22, 3, 2, ROCK);
  oval(g, 36, 5, 4, 3, ROCK);
  oval(g, 41, 21, 2.5, 2, ROCK);

  // Switchbacks up the mountain, and a branch out to a lookout clearing over the sea.
  trail(g, [[20, 26], [20, 22], [30, 22], [30, 17], [14, 17], [14, 12], [26, 12], [26, 7], [10, 7], [10, 0]]);
  trail(g, [[26, 12], [36, 12]]);
  oval(g, 39, 13, 3, 2, TRAIL);
  g.set(16, 19, 'ś');

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('hill_runner', 18, 17, 'left'),

    { layer: 'doors', name: 'mountain_conuco', x: 20, y: H - 1, w: 2, props: { target: 'conuco_mountain', map: 'xaragua-conuco', exit: 'up' } },
    { layer: 'doors', name: 'mountain_camp', x: 10, y: 0, w: 2, props: { target: 'camp_mountain', map: 'xaragua-camp', exit: 'down' } },
    { layer: 'spawns', name: 'mountain', x: 20, y: H - 3, props: { facing: 'up', era: 'present' } },
    obj('mountain_sign', 16, 19, { dialogue: 'mountain_sign', era: 'present' }),
    // The wild section (guide 6.6): ambushes once the pier fight is won.
    { layer: 'encounters', name: 'mountain_forest', x: 1, y: 1, w: W - 2, h: H - 2, props: { table: 'mountain_path', if: 'encounter.xaragua_story.pier.won, !story.crown_attack' } },
    // Chapter 11: the war table on the same ground, from the landing until the harbor is taken.
    { layer: 'encounters', name: 'mountain_war', x: 1, y: 1, w: W - 2, h: H - 2, props: { table: 'harbor_war', if: WAR_TABLE_TEXT } },
    ...warMountain(),
  ];
  return { id: 'xaragua-mountain', present: g, echo: e, objects };
}

export function xaraguaCamp(): MapSource {
  const W = 28;
  const H = 20;
  const g = new Grid(W, H, GRASS);
  border(g, { bottom: true });

  // The hill camp of the resistance (the rebel safehouse): a round palisade, tents, the fire.
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const d = ((x - 13.5) / 10) ** 2 + ((y - 9) / 6.5) ** 2;
      if (d >= 0.82 && d <= 1.18) g.set(x, y, 'ľ');
    }
  }
  trail(g, [[12, 12], [12, H - 2]]);
  oval(g, 13.5, 8.5, 4, 2.5, 'ú');
  g.set(13, 8, 'ğ');
  put(g, 'ţ', [[7, 6], [9, 4], [18, 4], [20, 6], [7, 11], [20, 11]]);
  g.set(17, 10, 'ś');
  put(g, 'č', [[2, 2], [25, 3], [3, 15], [24, 16]]);
  put(g, 'ď', [[1, 9], [26, 10]]);
  // Limestone at the camp's north end, with a strip of ground behind it (Medicine for the Cacique, M-XAR-2): no road
  // will ever go there.
  g.rect(11, 5, 6, 1, ROCK);

  const e = g.map(OLD);
  // Now: the Crown's road crews cut a road straight across the flat ground west of the fire, through the old grove.
  g.rect(5, 9, 6, 2, TRAIL);

  const objects: ObjSpec[] = [
    // Medicine for the Cacique (Chapter 2 side quest): the cut grove's stumps by the road; in the memory, the scouts'
    // healer by the fire and two places to plant (the anchors): the flat, where the road will go, or behind the rocks.
    obj('old_stumps', 6, 7, { dialogue: 'old_stumps', kind: 'stump', solid: true, era: 'present', if: '!anchor.grove_flat' }, 3, 1),
    obj('cut_young_grove', 6, 7, { dialogue: 'old_stumps', kind: 'stump', solid: true, era: 'present', if: 'anchor.grove_flat' }, 3, 1),
    obj('young_grove', 12, 4, { dialogue: 'young_grove', kind: 'grove', solid: true, era: 'present', if: 'anchor.healer_grove' }, 4, 1),
    {
      layer: 'echo_zones',
      name: 'camp_fire',
      x: 12,
      y: 9,
      w: 3,
      h: 2,
      props: { if: 'item.sun_locket, side.medicine.stumps', onEcho: 'grove_echo_enter', onReturn: 'grove_echo_return' },
    },
    npc('echo_scout_healer', 16, 7, 'left', { era: 'echo' }),
    obj('grove_spot_flat', 6, 7, { dialogue: 'grove_spot_flat', kind: 'seed_row', solid: true, era: 'echo' }, 3, 1),
    obj('grove_spot_rocks', 12, 4, { dialogue: 'grove_spot_rocks', kind: 'seed_row', solid: true, era: 'echo' }, 4, 1),
    { layer: 'anchors', name: 'grove_flat', x: 6, y: 7, props: { object: 'grove_spot_flat', flag: 'anchor.grove_flat' } },
    { layer: 'anchors', name: 'healer_grove', x: 12, y: 4, props: { object: 'grove_spot_rocks', flag: 'anchor.healer_grove' } },
    // Since the attack the camp's people shelter in the petroglyph cave.
    npc('camp_leader', 15, 11, 'left', { if: '!story.refuge' }),
    npc('camp_scout', 19, 8, 'left', { if: '!story.refuge' }),
    ...warCamp(),

    { layer: 'doors', name: 'camp_mountain', x: 12, y: H - 1, w: 2, props: { target: 'mountain_camp', map: 'xaragua-mountain', exit: 'up' } },
    { layer: 'spawns', name: 'camp', x: 12, y: H - 3, props: { facing: 'up', era: 'present' } },
    // Every hub's safehouse is marked by the grey ash thumbprint (guide 5.4).
    obj('ash_thumbprint', 17, 10, { dialogue: 'ash_thumbprint', era: 'present' }),
  ];
  return { id: 'xaragua-camp', present: g, echo: e, objects };
}

export function xaraguaCaney(): MapSource {
  const W = 36;
  const H = 26;
  const g = new Grid(W, H, 'ö');
  g.rect(0, 0, W, 1, 'é').rect(0, 0, 1, H, 'é').rect(W - 1, 0, 1, H, 'é').rect(0, H - 1, W, 1, 'é');
  g.set(17, H - 1, 'D');

  // The long hall of carved posts to the cacique's duho, on a woven runner.
  g.rect(16, 3, 4, 21, 'ŭ');
  for (const y of [4, 8, 12, 16, 20]) g.set(14, y, 'ø').set(21, y, 'ø');
  g.set(17, 2, 'ů');

  // West: the elders' council circle; below it, the runners' room and the tribute store.
  g.rect(10, 1, 1, 24, 'é').set(10, 6, 'ö').set(10, 18, 'ö');
  g.rect(1, 12, 9, 1, 'é');
  for (const [x, y] of [[3, 4], [5, 3], [7, 4], [3, 8], [5, 9], [7, 8]] as const) g.set(x, y, 'ŧ');
  for (const [x, y] of [[2, 14], [3, 14], [2, 16], [8, 22], [8, 23]] as const) g.set(x, y, 'ŋ');
  g.rect(5, 14, 3, 1, 'ħ');

  // East: the behique's room where Anaco lies ailing; below it, the guest house for envoys.
  g.rect(25, 1, 1, 24, 'é').set(25, 6, 'ö').set(25, 18, 'ö');
  g.rect(26, 12, 9, 1, 'é');
  g.set(32, 3, 'đ').set(33, 3, 'đ');
  g.set(27, 15, 'đ').set(33, 15, 'đ').set(27, 22, 'đ').set(33, 22, 'đ');

  const objects: ObjSpec[] = [
    // One either side of the double doors (owner rule, Oct 16).
    npc('caney_guard', 16, 23, 'right', { if: PEACE }),
    npc('caney_guard_2', 19, 23, 'left', { if: PEACE }),
    npc('elder_charter', 3, 6, 'right', { if: PEACE }),
    npc('elder_resist', 7, 6, 'left', { if: PEACE }),
    npc('elder_undecided', 5, 7, 'up', { if: PEACE }),
    npc('behique', 30, 5, 'down', { if: PEACE }),
    // The Governor's liaison waits in the hall, then (once Gianna has seen Anaco) walks into the middle of the
    // elders' circle to read them the Charter (owner report, Oct 17: he must be there for the council).
    npc('crown_liaison', 22, 6, 'left', { if: '!story.anaco_met' }),
    npc('crown_liaison_council', 5, 6, 'up', { npc: 'crown_liaison', if: 'story.anaco_met, !story.council_defied' }),
    npc('anaco', 33, 4, 'down', { if: PEACE }),
    // Chapter 2: the welcome, and the council scene at the council circle's doorway (after meeting Anaco).
    trigger('caney_enter', 17, 23, { dialogue: 'caney_enter', flag: 'story.caney_entered', once: true, onEnter: true, if: 'encounter.xaragua_story.pier.won' }),
    trigger('xaragua_council', 10, 6, { dialogue: 'xaragua_council', flag: 'story.council_seen', once: true, if: 'story.anaco_met' }),
    npc('head_runner', 5, 20, 'up', { if: PEACE }),
    // The Crown attack: the elders hear the oath, then the guns. A marine restarts the fight after a lost one;
    // once the caney is taken, a Crown captain sits below the duho and a marine holds the doors.
    trigger('xaragua_proof', 9, 6, { dialogue: 'xaragua_proof', flag: 'story.proof_heard', once: true, if: 'story.oath_found' }),
    npc('caney_breach_marine', 9, 8, 'up', { if: 'story.crown_attack, !encounter.xaragua_story.caney.won' }),
    npc('crown_captain', 17, 3, 'down', { if: 'story.anaco_taken, !story.harbor_taken' }),
    npc('occ_marine_caney', 16, 21, 'right', { if: 'story.anaco_taken, !story.harbor_taken' }),
    ...warCaney(),
    obj('caney_records', 5, 14, { dialogue: 'shelf.caney_records', era: 'present' }, 3, 1),

    { layer: 'doors', name: 'caney_out', x: 17, y: H - 1, props: { target: 'plaza_caney', map: 'xaragua-plaza', exit: 'up' } },
    { layer: 'spawns', name: 'caney', x: 17, y: H - 3, props: { facing: 'up', era: 'present' } },
    obj('duho_seat', 17, 2, { dialogue: 'duho_seat', era: 'present' }),
  ];
  return { id: 'xaragua-caney', present: g, echo: g.clone(), objects, interior: true };
}

export function xaraguaSongHouse(): MapSource {
  const W = 22;
  const H = 14;
  const g = new Grid(W, H, 'ö');
  g.rect(0, 0, W, 1, 'é').rect(0, 0, 1, H, 'é').rect(W - 1, 0, 1, H, 'é').rect(0, H - 1, W, 1, 'é');
  g.set(10, H - 1, 'D');

  // Shelves of accounts set down from the songs.
  g.rect(2, 1, 6, 1, 'ħ').rect(14, 1, 6, 1, 'ħ');
  for (const [x, y] of [[5, 6], [8, 6], [13, 6], [16, 6]] as const) g.set(x, y, 'ŧ');

  const objects: ObjSpec[] = [
    npc('song_keeper', 10, 4, 'down'),
    npc('song_apprentice', 6, 8, 'up', { if: '!story.wounded_sheltered' }),
    ...warSong(),
    // The accounts set down from the songs (data/books.ts).
    obj('song_history', 2, 1, { dialogue: 'shelf.song_history', era: 'present' }, 3, 1),
    obj('song_spirit', 5, 1, { dialogue: 'shelf.song_spirit', era: 'present' }, 3, 1),
    obj('song_accounts', 14, 1, { dialogue: 'shelf.song_accounts', era: 'present' }, 3, 1),
    { layer: 'doors', name: 'song_out', x: 10, y: H - 1, props: { target: 'plaza_song', map: 'xaragua-plaza', exit: 'up' } },
    { layer: 'spawns', name: 'song', x: 10, y: H - 3, props: { facing: 'up', era: 'present' } },
  ];
  return { id: 'xaragua-song', present: g, echo: g.clone(), objects, interior: true };
}

export function xaraguaCustoms(): MapSource {
  const W = 18;
  const H = 12;
  const g = new Grid(W, H, 'o');
  g.rect(0, 0, W, 1, '#').rect(0, 0, 1, H, '#').rect(W - 1, 0, 1, H, '#').rect(0, H - 1, W, 1, '#');
  g.set(8, H - 1, 'D');
  // The cellar stairs, behind the clerks (where the Crown keeps its prisoners).
  g.set(3, 0, 'D');

  // Thorne's office (the boss arena later): the clerks' desks, the Crown's flag, strongboxes, a bench.
  g.rect(3, 3, 4, 1, '$').set(1, 1, '<').set(16, 1, '<');
  g.set(14, 2, '>').set(15, 2, '>');
  g.rect(12, 8, 2, 1, '+');

  const objects: ObjSpec[] = [
    npc('crown_clerk', 5, 2, 'down', { if: '!story.war_begun' }),
    // Governor Thorne waits in his office once the council has been defied (until the war: then his war placement).
    npc('thorne', 10, 3, 'down', { if: 'story.council_defied, !story.war_begun' }),
    npc('customs_marine', 12, 5, 'left', { if: '!story.war_begun' }),
    // Chapter 11, stage two: Thorne at his desk by dusk, a marine and a musketeer in a breastplate beside him (talking
    // to any of them starts it, and again after a lost fight), until he is taken.
    npc('thorne_war', 10, 3, 'down', { if: 'story.village_reached, !story.thorne_taken' }),
    npc('customs_marine_war', 8, 4, 'right', { npc: 'customs_guard_war', if: 'story.village_reached, !story.thorne_taken' }),
    npc('customs_musketeer_war', 12, 4, 'left', { npc: 'customs_guard_war', if: 'story.village_reached, !story.thorne_taken' }),
    { layer: 'doors', name: 'customs_out', x: 8, y: H - 1, props: { target: 'village_customs', map: 'xaragua-village', exit: 'up' } },
    {
      layer: 'doors',
      name: 'customs_cellar',
      x: 3,
      y: 0,
      props: { target: 'cellar_out', map: 'xaragua-cellar', exit: 'down', if: 'story.visit_granted', closed: 'cellar_closed' },
    },
    { layer: 'spawns', name: 'customs', x: 8, y: H - 3, props: { facing: 'up', era: 'present' } },
  ];
  return { id: 'xaragua-customs', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The petroglyph cave (SIG-XAR parts 1 and 2), under the cassava gardens. A spring rises at the back of
 * the carved chamber and leaves by two sluice gates: the upper one to the sea, the lower one to the river
 * gorge. In the present a landslide has buried the upper outlet and the chamber is flooded; fifty years
 * ago it was dry, the upper gate open and the lower one shut for the dry season. Opening the lower gate
 * in the Echo is the anchor: the water has drained that way ever since. The carved wall shows the
 * areíto's drum song, its last bar worn away.
 */
export function xaraguaCave(): MapSource {
  const W = 30;
  const H = 22;
  const g = new Grid(W, H, 'ǔ');

  // The antechamber, with the Echo spot, and the way up to the chamber.
  g.rect(9, 12, 12, 8, 'ǒ').rect(14, 20, 2, 1, 'ǒ').set(14, 21, 'D');
  g.rect(14, 9, 2, 3, 'ǒ');
  // Rocks fallen in the antechamber, then and now.
  put(g, 'ǘ', [[9, 12], [20, 13], [10, 19]]);

  // The chamber: the carved wall along the back, the spring rising in the middle of it.
  g.rect(4, 3, 22, 6, 'ǐ');
  g.rect(5, 2, 8, 1, 'ǖ').rect(17, 2, 8, 1, 'ǖ').rect(13, 2, 4, 1, 'ǐ');
  // The lower sluice (west, to the gorge) and the upper one (east, to the sea), each with its channel.
  g.rect(1, 7, 3, 1, 'ǐ');
  g.rect(26, 5, 3, 1, 'ǐ');

  // Fifty years ago: the chamber dry, the spring and the channels running.
  const e = g.map({});
  e.rect(4, 3, 22, 6, 'ǒ');
  e.rect(5, 2, 8, 1, 'ǔ').rect(17, 2, 8, 1, 'ǔ');
  // Now: the landslide fills the upper outlet.
  g.rect(26, 5, 3, 1, 'ǘ');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'cave_out', x: 14, y: 21, props: { target: 'conuco_cave', map: 'xaragua-conuco', exit: 'up' } },
    { layer: 'spawns', name: 'cave', x: 14, y: 19, props: { facing: 'up', era: 'present' } },
    trigger('cave_enter', 14, 19, { dialogue: 'cave_enter', flag: 'story.cave_entered', once: true, onEnter: true }),
    {
      layer: 'echo_zones',
      name: 'cave_antechamber',
      x: 13,
      y: 14,
      w: 4,
      h: 2,
      props: { if: 'item.sun_locket', onEcho: 'cave_echo_enter', onReturn: 'cave_echo_return' },
    },
    npc('echo_spring_keeper', 18, 5, 'left', { era: 'echo' }),
    // The refuge (the Crown attack): the resistance shelters here, with Yari and Anissa in hiding.
    trigger('cave_refuge', 14, 19, { dialogue: 'cave_refuge', flag: 'story.refuge_seen', once: true, onEnter: true, if: 'story.patrol_beaten' }),
    // (In Chapter 11 the resistance has gone back up to the hill camp: data/war.ts.)
    npc('resistance_leader', 10, 14, 'right', { if: 'story.refuge, !story.war_begun' }),
    npc('yari_hidden', 11, 17, 'up', { if: 'story.refuge, !story.war_begun' }),
    npc('anissa_hidden', 12, 17, 'up', { if: 'story.refuge, !story.war_begun' }),
    npc('refugee_fisher', 18, 14, 'left', { if: 'story.refuge, !story.war_begun' }),
    npc('refugee_elder', 19, 17, 'left', { if: 'story.refuge, !story.war_begun' }),
    npc('refugee_healer', 17, 18, 'up', { if: 'story.refuge, !story.war_begun' }),
    // The Ninth Thumbprint (Chapter 11): the jars at the antechamber's edge, each sealed with the grey thumbprint.
    obj('powder_jars', CAVE.jars.x, CAVE.jars.y, { dialogue: 'thumbprint_jars', kind: 'powder_jars', solid: true, era: 'present', if: 'side.ninth_thumbprint.accepted, !side.ninth_thumbprint.jars' }, 1, 2),

    // The present: black water to the walls, and the buried outlet.
    obj('cave_flood', 14, 8, { dialogue: 'cave_flood', era: 'present', if: '!anchor.cave_sluice' }, 2, 1),
    obj('cave_rubble', 26, 5, { dialogue: 'cave_rubble', era: 'present' }),
    // Drained since the lower gate was left open fifty years ago: the chamber floor, walkable.
    obj('cave_drained', 4, 3, { era: 'present', kind: 'cave_floor', walkable: true, if: 'anchor.cave_sluice' }, 22, 6),
    obj('lower_sluice_old', 3, 7, { dialogue: 'lower_sluice_old', era: 'present', kind: 'sluice_open', if: 'anchor.cave_sluice' }),
    obj('cave_carvings', 5, 2, { dialogue: 'cave_carvings', era: 'present' }, 8, 1),
    obj('cave_carvings_east', 17, 2, { dialogue: 'cave_carvings', era: 'present' }, 8, 1),

    // Fifty years ago: the two gates, and the smooth wall chalked for carving.
    obj('upper_sluice', 26, 5, { dialogue: 'upper_sluice', era: 'echo', kind: 'sluice_open' }),
    obj('lower_sluice', 3, 7, { dialogue: 'lower_sluice', era: 'echo', kind: 'sluice' }),
    obj('cave_chalk', 5, 2, { dialogue: 'cave_chalk', era: 'echo' }, 8, 1),
    { layer: 'anchors', name: 'cave_sluice_gate', x: 3, y: 7, props: { object: 'lower_sluice', flag: 'anchor.cave_sluice' } },
  ];
  return { id: 'xaragua-cave', present: g, echo: e, objects, interior: true };
}

/** The council's record house on the Areíto Plaza, where the first oath's stone is kept. */
export function xaraguaRecord(): MapSource {
  const W = 16;
  const H = 10;
  const g = new Grid(W, H, 'ö');
  g.rect(0, 0, W, 1, 'é').rect(0, 0, 1, H, 'é').rect(W - 1, 0, 1, H, 'é').rect(0, H - 1, W, 1, 'é');
  g.set(7, H - 1, 'D');

  // Baskets of records on the shelves; the oath stone on a woven runner in the middle.
  g.rect(2, 1, 4, 1, 'ħ').rect(10, 1, 4, 1, 'ħ');
  g.rect(7, 3, 2, 4, 'ŭ');
  g.set(7, 2, 'ŗ');
  put(g, 'ŋ', [[1, 5], [14, 5]]);

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'record_out', x: 7, y: H - 1, props: { target: 'plaza_record', map: 'xaragua-plaza', exit: 'up' } },
    { layer: 'spawns', name: 'record', x: 7, y: H - 3, props: { facing: 'up', era: 'present' } },
    obj('oath_stone', 7, 2, { dialogue: 'oath_stone', era: 'present' }),
    obj('record_baskets', 2, 1, { dialogue: 'record_baskets', era: 'present' }, 4, 1),
  ];
  return { id: 'xaragua-record', present: g, echo: g.clone(), objects, interior: true };
}

/**
 * The sea cave under the beach's headland (Chapter 2's end): at the lowest tide a tunnel past tide pools leads
 * to a ledge where the Yaguana hid their canoes from the Crown, and out to the open sea. Thorne's longboat
 * waits at the sea mouth (the boss). The secret S-XAR (the tides, the weir) comes later in this same cave.
 */
export function xaraguaSeaCave(): MapSource {
  const W = 26;
  const H = 14;
  const g = new Grid(W, H, 'ǔ');
  // The tunnel up from the beach, along past the tide pools, and up to the canoe ledge.
  g.rect(3, 9, 3, 4, 'ǒ').set(4, 13, 'D');
  g.rect(3, 7, 13, 2, 'ǒ').set(7, 8, 'ǐ').set(10, 7, 'ǐ');
  g.rect(13, 3, 3, 4, 'ǒ').rect(13, 3, 8, 2, 'ǒ');
  // The inlet below the ledge, and the channel out to the sea on the east.
  g.rect(16, 5, 5, 3, 'ǐ').rect(21, 1, 5, 11, 'ǐ');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'seacave_out', x: 4, y: 13, props: { target: 'beach_seacave', map: 'xaragua-beach', exit: 'up' } },
    { layer: 'spawns', name: 'seacave', x: 4, y: 11, props: { facing: 'up', era: 'present' } },
    trigger('seacave_enter', 4, 11, { dialogue: 'seacave_enter', flag: 'story.seacave_entered', once: true, onEnter: true }),
    obj('escape_canoe', 19, 5, { dialogue: 'escape_canoe', kind: 'dugout', solid: true, era: 'present' }),
    // Thorne in his longboat at the sea mouth, once he springs the trap (he restarts the fight after a loss).
    obj('thorne_longboat', 22, 4, { kind: 'dugout', solid: true, era: 'present', if: 'story.thorne_ambush, !encounter.xaragua_story.thorne.won' }),
    npc('thorne_blockade', 22, 3, 'left', { npc: 'thorne_boat', if: 'story.thorne_ambush, !encounter.xaragua_story.thorne.won' }),
  ];
  return { id: 'xaragua-seacave', present: g, echo: g.clone(), objects, interior: true };
}

/** The customs house cellar, where the Crown holds Cacique Anaco (the occupied city). */
export function xaraguaCellar(): MapSource {
  const W = 14;
  const H = 9;
  const g = new Grid(W, H, 'o');
  g.rect(0, 0, W, 1, '#').rect(0, 0, 1, H, '#').rect(W - 1, 0, 1, H, '#').rect(0, H - 1, W, 1, '#');
  g.set(6, H - 1, 'D');
  // Crates of Crown stores, a bed for the prisoner, a bench for the guard.
  put(g, '>', [[1, 1], [2, 1], [11, 1], [12, 1], [12, 2]]);
  g.set(5, 1, 'd').set(10, 6, '+');

  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'cellar_out', x: 6, y: H - 1, props: { target: 'customs_cellar', map: 'xaragua-customs', exit: 'up' } },
    { layer: 'spawns', name: 'cellar', x: 6, y: H - 3, props: { facing: 'up', era: 'present' } },
    npc('anaco_cell', 6, 2, 'down', { if: '!story.escaped' }),
    npc('cellar_marine', 10, 5, 'left', { if: '!story.war_begun' }),
    // Chapter 11: Anaco on the bed, the irons on its post, until Yari walks down the stairs for him.
    npc('anaco_war', 6, 2, 'down', { npc: 'anaco_cellar', if: 'story.war_begun, !story.anaco_freed' }),
    obj('cellar_irons', 7, 1, { kind: 'irons', solid: true, era: 'present', if: 'story.war_begun' }),
    trigger('war_cellar', 6, 7, { dialogue: 'war_cellar', flag: 'story.cellar_war_entered', once: true, onEnter: true, if: 'story.thorne_taken, !story.anaco_freed' }),
  ];
  return { id: 'xaragua-cellar', present: g, echo: g.clone(), objects, interior: true };
}

// ---- Chapter 11, the War of the Harbor (data/war.ts places it; every placement on story.war_begun or later, so the
// Chapter 2 maps replay unchanged) ------------------------------------------------------------------------------------

/** The house hull a betrayer's flank grounds in (Chapter 10's hulls). */
const HOUSE_HULL: Readonly<Record<string, string>> = {
  skarragol: 'muster_ship_ironvow',
  kuroshi: 'muster_ship_suzumori',
  jwaladesh: 'muster_ship_agnivansh',
  al_doria: 'muster_ship_dorini',
};

/**
 * The Canoe Beach at war: the landing, the fleet off the sand (a gap where a house sailed to the Crown), a soldier of
 * each company on the sand by day, the resistance come down from the gardens, the headland's gun and its crew, the line
 * the party crosses to take it, the flank (the betrayer's hull and captain, or nothing on the turned route), the
 * gardens' road north (open once the gun is taken), and the market's three back once the harbor is Yucayeque's.
 */
function warBeach(): ObjSpec[] {
  const b = BEACH;
  return [
    trigger('war_landing', b.landing.x, b.landing.y, { dialogue: 'war_landing', flag: 'story.war_begun', once: true, onEnter: true, if: 'act10.complete' }),
    ...b.fleet.map((f, i) => obj(`fleet_hull_${i + 1}`, f.at.x, f.at.y, { kind: f.kind, solid: true, era: 'present', if: `story.war_begun, !story.chain_dropped${f.army ? `, army.${f.army}` : ''}` }, 3, 1)),
    ...COMPANIES.map((c, i) => npc(`beach_${c.army}`, b.placed[i]!.x, b.placed[i]!.y, 'up', { npc: c.npc, if: `story.landed, !story.tide_called, army.${c.army}` })),
    // The camp leader and the fisher's boy wait below the gun until it is taken, then go up the gardens' road.
    npc('camp_leader_beach', b.campLeader.x, b.campLeader.y, 'left', { if: 'story.landed, !story.headland_won' }),
    npc('fisher_boy_beach', b.fisherBoy.x, b.fisherBoy.y, 'up', { if: 'story.landed, !story.headland_won' }),
    obj('field_gun', b.gun.x, b.gun.y, { kind: 'field_gun', solid: true, era: 'present', if: 'story.war_begun, !story.headland_won' }, 1, 2),
    obj('field_gun_turned', b.gun.x, b.gun.y, { kind: 'field_gun_turned', solid: true, era: 'present', dialogue: 'field_gun_turned', if: 'story.headland_won' }, 1, 2),
    npc('gun_officer', b.officer.x, b.officer.y, 'left', { if: 'story.war_begun, !story.headland_won' }),
    ...b.musketeers.map((m, i) => npc(`gun_musketeer_${i + 1}`, m.x, m.y, 'left', { npc: i === 0 ? 'gun_musketeer' : 'gun_musketeer_b', if: 'story.war_begun, !story.headland_won' })),
    // The headland: the line across the sand the party crosses going east (again until the gun is taken).
    trigger('headland_step', b.headlandStep.x, b.headlandStep.y, { dialogue: 'headland_battery', if: 'story.landed, !story.headland_won' }, b.headlandStep.w, b.headlandStep.h),
    // Sails behind us: crossing back west after the gun (once; on the betrayed route the captain stays on the sand after).
    trigger('flank_step', b.flankStep.x, b.flankStep.y, { dialogue: 'harbor_flank', flag: 'story.flank_seen', once: true, if: 'story.headland_won, !war.flank_done' }, b.flankStep.w, b.flankStep.h),
    ...FLANK_HOUSES.map((h) => obj(`flank_hull_${h.house}`, b.hull.x, b.hull.y, { kind: HOUSE_HULL[h.house]!, solid: true, era: 'present', if: `muster.betrayed, muster.betrayer.${h.house}, story.flank_seen, !war.flank_done` }, 3, 1)),
    // The captain on the sand once the fight has begun (the way back in after a Game Over), until the flank is done.
    ...FLANK_HOUSES.map((h) => npc(`flank_captain_${h.house}`, b.captain.x, b.captain.y, 'right', { npc: h.captainNpc, if: `muster.betrayed, muster.betrayer.${h.house}, story.flank_fought, !war.flank_done` })),
    // The hill road to the gardens, round behind the village (a long walk, not a door: hill_road_north asks).
    trigger('hill_road_beach', b.northDoor.x, b.northDoor.y + 1, { dialogue: 'hill_road_north', if: 'story.war_begun' }, 2, 1),
    { layer: 'spawns', name: 'hill_road_in', x: b.northDoor.x, y: b.northDoor.y + 3, props: { facing: 'down', era: 'present' } },
    // The harbor is Yucayeque's: the market's three come back to the burned stalls.
    npc('casabe_baker_free', 13, 3, 'down', { npc: 'casabe_baker', if: 'story.harbor_taken' }),
    npc('carver_free', 16, 3, 'down', { npc: 'carver', if: 'story.harbor_taken' }),
    npc('bow_maker_free', 19, 3, 'down', { npc: 'bow_maker', if: 'story.harbor_taken' }),
  ];
}

/** The cassava gardens at war: the road from the beach, the war table, the carrier at the cave mouth, the picket. */
function warConuco(): ObjSpec[] {
  const c = CONUCO;
  return [
    // The hill road down to the beach, round behind the village (hill_road_south asks).
    trigger('hill_road_conuco', c.beachDoor.x - 1, c.beachDoor.y, { dialogue: 'hill_road_south', if: 'story.war_begun' }, 1, 2),
    { layer: 'spawns', name: 'hill_road_in', x: c.beachDoor.x - 3, y: c.beachDoor.y, props: { facing: 'left', era: 'present' } },
    { layer: 'encounters', name: 'conuco_war', x: 1, y: 1, w: 30, h: 15, props: { table: 'harbor_war', if: WAR_TABLE_TEXT } },
    // The Ninth Thumbprint: a man in a black coat comes out of the cave mouth and walks off east at a walk (once).
    trigger('thumbprint_carrier', c.carrierStep.x, c.carrierStep.y, { dialogue: 'thumbprint_carrier', flag: 'story.carrier_seen', once: true, if: 'side.ninth_thumbprint.accepted, !side.ninth_thumbprint.jars' }, c.carrierStep.w, c.carrierStep.h),
    // Coming out with the jars, the Crown's picket on the road (again until it is beaten).
    trigger('thumbprint_picket', c.picketStep.x, c.picketStep.y, { dialogue: 'thumbprint_picket', if: 'side.ninth_thumbprint.jars, !encounter.war_story.picket.won' }, c.picketStep.w, c.picketStep.h),
    ...c.picket.map((p, i) => npc(`war_picket_${i + 1}`, p.x, p.y, 'down', { npc: 'war_picket', if: 'side.ninth_thumbprint.jars, !encounter.war_story.picket.won' })),
  ];
}

/** The Mountain Path at war: the fisher's boy at the lookout (Harbors Lie), and Salkhi on the trail below. */
function warMountain(): ObjSpec[] {
  const m = MOUNTAIN;
  return [
    npc('lookout_boy', m.lookoutBoy.x, m.lookoutBoy.y, 'right', { npc: 'fisher_boy_lookout', if: 'side.harbors_lie.accepted, !side.harbors_lie.counted' }),
    trigger('harbors_lie_view', m.lookoutStep.x, m.lookoutStep.y, { dialogue: 'harbors_lie_count', if: 'side.harbors_lie.accepted, !side.harbors_lie.counted' }, m.lookoutStep.w, m.lookoutStep.h),
    npc('salkhi_war', m.salkhi.x, m.salkhi.y, 'down', { if: WAR_DAY_TEXT }),
  ];
}

/** The hill camp, the resistance's base again: the elders at the fire, the healer's hamacas, the conch, the companies. */
function warCamp(): ObjSpec[] {
  const c = CAMP;
  return [
    trigger('war_camp', c.gate.x, c.gate.y, { dialogue: 'war_camp', flag: 'story.camp_reached', once: true, onEnter: true, if: 'war.flank_done' }),
    npc('camp_leader_war', c.campLeader.x, c.campLeader.y, 'left', { if: WAR_DAY_TEXT }),
    npc('elder_charter_war', c.elderCharter.x, c.elderCharter.y, 'right', { npc: 'debate_elder_charter', if: WAR_DAY_TEXT }),
    npc('elder_resist_war', c.elderResist.x, c.elderResist.y, 'left', { npc: 'debate_elder_resist', if: WAR_DAY_TEXT }),
    npc('elder_undecided_war', c.elderUndecided.x, c.elderUndecided.y, 'up', { if: WAR_DAY_TEXT }),
    npc('healer_war', c.healer.x, c.healer.y, 'down', { if: WAR_DAY_TEXT }),
    ...c.hamacas.map((h, i) => obj(`camp_hamaca_${i + 1}`, h.x, h.y, { kind: 'hamaca', solid: true, era: 'present', if: WAR_TEXT })),
    npc('head_runner_war', c.headRunner.x, c.headRunner.y, 'down', { if: WAR_DAY_TEXT }),
    npc('fisher_boy_war', c.fisherBoy.x, c.fisherBoy.y, 'down', { if: `${WAR_DAY_TEXT}, !side.harbors_lie.accepted|side.harbors_lie.counted` }),
    npc('canoe_fisher_war', c.canoeFisher.x, c.canoeFisher.y, 'up', { if: WAR_DAY_TEXT }),
    npc('lamp_oil_war', c.lampOilSeller.x, c.lampOilSeller.y, 'left', { if: WAR_TEXT }),
    npc('jordyn_war', c.jordyn.x, c.jordyn.y, 'up', { if: WAR_DAY_TEXT }),
    ...COMPANIES.map((co, i) => npc(`camp_${co.army}`, c.companies[i]!.x, c.companies[i]!.y, 'up', { npc: co.npc, if: `story.camp_reached, !story.tide_called, army.${co.army}` })),
    obj('powder_jars_camp', c.jars.x, c.jars.y, { kind: 'powder_jars', solid: true, era: 'present', if: 'side.ninth_thumbprint.done, !story.tide_called' }),
  ];
}

/**
 * The Harbor Village by dusk and night: the arrival from the gardens, the companies in the yard ring, Jordyn's seven on
 * the east trail, the Patience in the mouth with the chain from her bow to the old post's capstan beside the pier's sea
 * end, the marines holding the pier, the pier head's shimmer (Caona's stand, and the capstan's pawl pin in the memory:
 * the anchor), the allied hulls round the headland once the chain is down, Ardencia's sails, Rael's longboat, the
 * Turn's step, the way back into the boss fight, Rael on the pier for the truth, and the struck fleet's white flags.
 */
function warVillage(): ObjSpec[] {
  const v = VILLAGE;
  return [
    trigger('war_village', v.westDoor.x, v.westDoor.y, { dialogue: 'war_village', flag: 'story.village_reached', once: true, onEnter: true, if: 'story.tide_called' }),
    // The pier's landward end (the pier puzzle's fresh-save start, puzzles/xaragua_pier).
    { layer: 'spawns', name: 'pier_head', x: v.pierZone.x, y: v.pierZone.y - 1, props: { facing: 'down', era: 'present' } },
    ...COMPANIES.map((c, i) => npc(`yard_${c.army}`, v.yard[i]!.x, v.yard[i]!.y, 'right', { npc: c.npc, if: `story.village_reached, !story.harbor_taken, army.${c.army}` })),
    npc('jordyn_trail', v.jordyn.x, v.jordyn.y, 'left', { npc: 'jordyn_war', if: `story.village_reached, !story.harbor_taken` }),
    obj('patience', v.patience.x, v.patience.y, { kind: 'patience', solid: true, era: 'present', if: 'story.war_begun, !story.harbor_taken' }, 6, 3),
    obj('mouth_chain', v.chain.x, v.chain.y, { kind: 'harbor_chain', era: 'present', if: 'story.war_begun, !story.chain_dropped' }, v.chain.w, v.chain.h),
    // The old chain post's capstan: rusted with its pin in (before the memory), its pawl's pin hole empty (after), spun.
    obj('chain_capstan_pinned', v.capstan.x, v.capstan.y, { kind: 'capstan_rusted', solid: true, era: 'present', dialogue: 'capstan_present', if: 'story.war_begun, !anchor.chain_post' }),
    obj('chain_capstan_pinless', v.capstan.x, v.capstan.y, { kind: 'capstan_pinless', solid: true, era: 'present', dialogue: 'capstan_present', if: 'anchor.chain_post, !story.chain_dropped' }),
    obj('chain_capstan_spun', v.capstan.x, v.capstan.y, { kind: 'capstan_spun', solid: true, era: 'present', dialogue: 'capstan_present', if: 'story.chain_dropped' }),
    ...v.pierMarines.map((p, i) => npc(`pier_marine_war_${i + 1}`, p.x, p.y, 'up', { npc: i === 0 ? 'pier_guard_war' : 'pier_guard_war_b', if: 'story.village_reached, !story.chain_dropped' })),
    // Caona's stand (the Echo battle) and the chain post (M-XAR-3): the pier head's landward boards fifty years ago.
    {
      layer: 'echo_zones',
      name: 'pier_head',
      x: v.pierZone.x,
      y: v.pierZone.y,
      w: v.pierZone.w,
      h: v.pierZone.h,
      props: { if: 'item.sun_locket, story.anaco_freed', onEcho: 'pier_echo_enter', onReturn: 'pier_echo_return' },
    },
    npc('echo_caona_pier', v.echoCaona.x, v.echoCaona.y, 'down', { era: 'echo', if: 'story.anaco_freed' }),
    npc('echo_benny_pier', v.echoBenny.x, v.echoBenny.y, 'right', { era: 'echo', if: 'story.anaco_freed' }),
    obj('chain_capstan_echo', v.capstan.x, v.capstan.y, { kind: 'capstan', solid: true, era: 'echo', dialogue: 'chain_pin_echo' }),
    { layer: 'anchors', name: 'chain_post', x: v.capstan.x, y: v.capstan.y, props: { object: 'chain_capstan_echo', flag: 'anchor.chain_post' } },
    // Once the chain has run out: the allied hulls come round the headland, and the Turn's step on the pier.
    obj('allied_hull_1', v.allies[0]!.x, v.allies[0]!.y, { kind: 'muster_ship_zetwal', solid: true, era: 'present', if: 'story.chain_dropped' }, 3, 1),
    obj('allied_hull_2', v.allies[1]!.x, v.allies[1]!.y, { kind: 'trader_hull', solid: true, era: 'present', if: 'story.chain_dropped' }, 3, 1),
    obj('allied_hull_3', v.allies[2]!.x, v.allies[2]!.y, { kind: 'muster_ship_ironvow', solid: true, era: 'present', if: 'story.chain_dropped, army.skarragol' }, 3, 1),
    trigger('harbor_turn_step', v.turnStep.x, v.turnStep.y, { dialogue: 'harbor_turn', if: 'story.chain_dropped, !war.turn_made' }, v.turnStep.w, v.turnStep.h),
    obj('ardencia_ship_1', v.ardencia[0]!.x, v.ardencia[0]!.y, { kind: 'ardencia_ship', solid: true, era: 'present', if: 'war.sails_in, !story.fleet_escaped' }, 5, 2),
    obj('ardencia_ship_2', v.ardencia[1]!.x, v.ardencia[1]!.y, { kind: 'ardencia_ship', solid: true, era: 'present', if: 'war.sails_in, !story.fleet_escaped' }, 5, 2),
    obj('rael_longboat', v.longboat.x, v.longboat.y, { kind: 'longboat', solid: true, era: 'present', if: 'war.sails_in, !story.wounded_sheltered' }),
    // The way back into the boss fight after a Game Over (the choice is kept): Hale on Trust, Rael on Strike.
    npc('hale_pier', v.pierEnd.x, v.pierEnd.y, 'up', { if: 'war.trust, !story.harbor_taken' }),
    npc('rael_pier', v.pierEnd.x, v.pierEnd.y, 'up', { if: 'war.strike, !story.harbor_taken' }),
    // After the fight, Rael waits on the pier for her, either route (the truth).
    npc('rael_truth', v.pierEnd.x, v.pierEnd.y, 'up', { if: 'story.harbor_taken, !clue.ash_road_read' }),
    // Trust: the Crown's fleet strikes its colours.
    obj('white_flag_west', 4, 23, { kind: 'white_flag', era: 'present', if: 'story.harbor_won' }),
    obj('white_flag_east', 31, 23, { kind: 'white_flag', era: 'present', if: 'story.harbor_won' }),
    obj('white_flag_far', 38, 25, { kind: 'white_flag', era: 'present', if: 'story.harbor_won' }),
  ];
}

/** The Caney of Anaco at night: the cacique in his duho, the elders in their circle, Jordyn and Joaquin at the sides. */
function warCaney(): ObjSpec[] {
  const c = CANEY;
  return [
    trigger('war_caney', c.doors.x, c.doors.y, { dialogue: 'war_caney', flag: 'story.caney_war_entered', once: true, onEnter: true, if: 'story.wounded_sheltered, !act11.complete' }),
    npc('anaco_duho', c.anaco.x, c.anaco.y, 'down', { npc: 'anaco_free', if: 'story.harbor_taken' }),
    npc('elder_charter_free', c.elders[0]!.x, c.elders[0]!.y, 'right', { if: 'story.harbor_taken' }),
    npc('elder_resist_free', c.elders[1]!.x, c.elders[1]!.y, 'left', { if: 'story.harbor_taken' }),
    npc('elder_undecided_free', c.elders[2]!.x, c.elders[2]!.y, 'up', { if: 'story.harbor_taken' }),
    npc('jordyn_caney', c.captains[0]!.x, c.captains[0]!.y, 'right', { npc: 'jordyn_war', if: 'story.harbor_taken' }),
    npc('joaquin_caney', c.captains[1]!.x, c.captains[1]!.y, 'left', { npc: 'joaquin_war', if: 'story.harbor_taken' }),
  ];
}

/** The Song House as the shelter: the hamacas slung between the posts, old Benny at the door and Nancy among them. */
function warSong(): ObjSpec[] {
  const s = SONG;
  return [
    trigger('war_song', s.arrive.x, s.arrive.y, { dialogue: 'war_song', flag: 'story.song_war_entered', once: true, onEnter: true, if: 'clue.ash_road_read, !story.wounded_sheltered' }),
    ...s.hamacas.map((h, i) => obj(`song_hamaca_${i + 1}`, h.x, h.y, { kind: 'hamaca', solid: true, era: 'present', if: 'story.harbor_taken' }, 1, 2)),
    npc('benny_song', s.benny.x, s.benny.y, 'up', { npc: 'benny_war', if: 'story.wounded_sheltered' }),
    npc('nancy_song', s.nancy.x, s.nancy.y, 'right', { npc: 'nancy_war', if: 'story.wounded_sheltered' }),
  ];
}

export const XARAGUA_SOURCES: readonly (() => MapSource)[] = [
  xaraguaVillage,
  xaraguaPlaza,
  xaraguaBeach,
  xaraguaConuco,
  xaraguaMountain,
  xaraguaCamp,
  xaraguaCaney,
  xaraguaSongHouse,
  xaraguaCustoms,
  xaraguaCave,
  xaraguaRecord,
  xaraguaCellar,
  xaraguaSeaCave,
];
