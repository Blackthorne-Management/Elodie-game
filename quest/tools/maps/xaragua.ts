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

const GRASS = 'ā';
const TRAIL = 'ē';
const SAND = 'ī';
const LAGOON = 'ō';
const ROCK = 'ū';
const FLOWERS = 'ǎ';

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
    npc('canoe_fisher', 18, 20, 'down'),
    npc('weaver', 19, 13, 'down'),
    npc('fisher_boy', 25, 20, 'left'),
    npc('crown_marine', 27, 13, 'down'),
    npc('crown_marine_2', 36, 13, 'left'),
    npc('lamp_oil_seller', 23, 10, 'right'),
    // The debate corner: an elder of the springs and a Gaze pilgrim, arguing across the yard's fire.
    npc('debate_roots_elder', 9, 7, 'right'),
    npc('debate_pilgrim', 13, 7, 'left'),

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
    obj('crown_ship_west', 2, 24, { kind: 'crown_ship', solid: true, era: 'present' }, 5, 3),
    obj('crown_ship_east', 29, 24, { kind: 'crown_ship', solid: true, era: 'present' }, 5, 3),
    obj('crown_ship_far', 36, 26, { kind: 'crown_ship', solid: true, era: 'present' }, 5, 3),
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
  bohio(g, 24, 8);

  put(g, 'í', [[3, 3], [26, 3], [5, 17], [24, 18], [27, 14]]);
  put(g, 'ě', [[2, 15], [26, 6]]);
  put(g, 'ď', [[6, 3], [23, 2], [10, 19], [19, 19]]);
  g.rect(3, 18, 4, 2, FLOWERS);

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('areito_drummer', 12, 11, 'down'),
    npc('dancer', 17, 12, 'left'),
    npc('plaza_elder', 21, 18, 'up'),

    { layer: 'doors', name: 'plaza_village', x: 14, y: H - 1, w: 2, props: { target: 'village_plaza', map: 'xaragua-village', exit: 'up' } },
    { layer: 'doors', name: 'plaza_caney', x: 14, y: 4, props: { target: 'caney_out', map: 'xaragua-caney', exit: 'down' } },
    { layer: 'doors', name: 'plaza_song', x: 3, y: 10, props: { target: 'song_out', map: 'xaragua-song', exit: 'down' } },
    { layer: 'spawns', name: 'plaza', x: 14, y: 19, props: { facing: 'up', era: 'present' } },
    obj('batey_stones', stones[0]![0], stones[0]![1], { dialogue: 'batey_stones', era: 'present' }),
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
  g.set(31, 8, 'ç').set(31, 9, GRASS).set(32, 9, GRASS);

  // The trail from the village, past the market and down to the sand.
  trail(g, [[0, 7], [8, 7], [8, 9], [14, 9], [14, 11]]);

  // The beach market (unique to Yucayeque, owner rule Oct 15): a crescent of thatched stalls round a
  // packed-earth clearing, where fish, salt and cassava bread are traded.
  oval(g, 16, 4, 7, 3, 'ú');
  put(g, 'ş', around(16, 4, 6, 2.6, 7, Math.PI * 1.05, Math.PI * 1.95));
  put(g, 'ş', [[10, 5], [22, 5]]);

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
    npc('salt_seller', 25, 11, 'down'),
    npc('casabe_baker', 13, 3, 'up'),
    npc('carver', 16, 3, 'up'),
    npc('bow_maker', 19, 3, 'up'),
    npc('canoe_maker', 9, 13, 'left'),
    npc('shell_diver', 30, 10, 'up'),

    { layer: 'doors', name: 'beach_village', x: 0, y: 7, h: 2, props: { target: 'village_beach', map: 'xaragua-village', exit: 'right' } },
    { layer: 'spawns', name: 'beach', x: 2, y: 7, props: { facing: 'right', era: 'present' } },
    obj('sea_cave_mouth', 31, 8, { dialogue: 'sea_cave_mouth', era: 'present' }),
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
  g.set(6, 17, 'ç');
  put(g, 'ŕ', [[2, 16], [10, 16]]);

  put(g, 'ě', [[14, 7], [21, 6], [3, 8], [29, 5]]);
  put(g, 'í', [[29, 13], [12, 18]]);
  put(g, 'ď', [[19, 18], [1, 10]]);
  g.rect(17, 18, 3, 2, FLOWERS);

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('cassava_farmer', 20, 4, 'up'),
    npc('cassava_farmer_2', 11, 5, 'right'),
    npc('conuco_kid', 16, 14, 'down'),

    { layer: 'doors', name: 'conuco_village', x: W - 1, y: 9, h: 2, props: { target: 'village_conuco', map: 'xaragua-village', exit: 'left' } },
    { layer: 'doors', name: 'conuco_mountain', x: 6, y: 0, w: 2, props: { target: 'mountain_conuco', map: 'xaragua-mountain', exit: 'down' } },
    { layer: 'spawns', name: 'conuco', x: W - 3, y: 9, props: { facing: 'left', era: 'present' } },
    obj('petroglyph_cave_mouth', 6, 17, { dialogue: 'petroglyph_cave_mouth', era: 'present' }),
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
    { layer: 'encounters', name: 'mountain_forest', x: 1, y: 1, w: W - 2, h: H - 2, props: { table: 'mountain_path', if: 'encounter.xaragua_story.pier.won' } },
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

  const e = g.map(OLD);

  const objects: ObjSpec[] = [
    npc('camp_leader', 15, 11, 'left'),
    npc('camp_scout', 19, 8, 'left'),

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
    npc('caney_guard', 16, 23, 'right'),
    npc('caney_guard_2', 19, 23, 'left'),
    npc('elder_charter', 3, 6, 'right'),
    npc('elder_resist', 7, 6, 'left'),
    npc('elder_undecided', 5, 7, 'up'),
    npc('behique', 30, 5, 'down'),
    // The Governor's liaison waits in the hall, then (once Gianna has seen Anaco) walks into the middle of the
    // elders' circle to read them the Charter (owner report, Oct 17: he must be there for the council).
    npc('crown_liaison', 22, 6, 'left', { if: '!story.anaco_met' }),
    npc('crown_liaison_council', 5, 6, 'up', { npc: 'crown_liaison', if: 'story.anaco_met, !story.council_defied' }),
    npc('anaco', 33, 4, 'down'),
    // Chapter 2: the welcome, and the council scene at the council circle's doorway (after meeting Anaco).
    trigger('caney_enter', 17, 23, { dialogue: 'caney_enter', flag: 'story.caney_entered', once: true, onEnter: true, if: 'encounter.xaragua_story.pier.won' }),
    trigger('xaragua_council', 10, 6, { dialogue: 'xaragua_council', flag: 'story.council_seen', once: true, if: 'story.anaco_met' }),
    npc('head_runner', 5, 20, 'up'),
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
    npc('song_apprentice', 6, 8, 'up'),
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

  // Thorne's office (the boss arena later): the clerks' desks, the Crown's flag, strongboxes, a bench.
  g.rect(3, 3, 4, 1, '$').set(1, 1, '<').set(16, 1, '<');
  g.set(14, 2, '>').set(15, 2, '>');
  g.rect(12, 8, 2, 1, '+');

  const objects: ObjSpec[] = [
    npc('crown_clerk', 5, 2, 'down'),
    // Governor Thorne waits in his office once the council has been defied.
    npc('thorne', 10, 3, 'down', { if: 'story.council_defied' }),
    npc('customs_marine', 12, 5, 'left'),
    { layer: 'doors', name: 'customs_out', x: 8, y: H - 1, props: { target: 'village_customs', map: 'xaragua-village', exit: 'up' } },
    { layer: 'spawns', name: 'customs', x: 8, y: H - 3, props: { facing: 'up', era: 'present' } },
  ];
  return { id: 'xaragua-customs', present: g, echo: g.clone(), objects, interior: true };
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
];
