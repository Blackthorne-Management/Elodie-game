// The Hall of the Accord inside (owner decision, Oct 15: "a long large hall to the throne in the middle and
// chambers"; where much of the story's diplomacy and messages happen later). From the entrance hall a long
// gallery of columns and portraits runs north to the Throne of the State on its dais, where the Head of State
// gives audience and makes the laws. Off the gallery: the Council Chamber and the Envoys' Reception Room
// (west), the Chancellor's office, the Seal and Records Room and the Courier Office (east); off the entrance
// hall, the Scribes' Room and the Treasury. The Echo is the same ground fifty years ago, before the Hall
// was built (no way to reach it yet).

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalHall(): MapSource {
  const W = 40;
  const H = 30;
  const g = new Grid(W, H, '(');

  // Outer walls, the front door, windows on the north wall.
  g.rect(0, 0, W, 2, '!').rect(0, 0, 1, H, '!').rect(W - 1, 0, 1, H, '!').rect(0, H - 1, W, 1, '!');
  g.set(19, H - 1, 'D');
  for (const x of [4, 9, 30, 35]) g.set(x, 1, 'v');

  // The throne room across the north: the dais, the Throne of the State, banners of the houses.
  g.rect(16, 2, 8, 3, '{');
  g.set(19, 2, ']');
  g.set(14, 2, '<').set(25, 2, '<').set(16, 2, '<').set(23, 2, '<');
  g.set(14, 5, '*').set(25, 5, '*');

  // The grand gallery: walls either side with portraits, columns, the carpet to the throne.
  g.rect(13, 2, 1, 21, '!').rect(26, 2, 1, 21, '!');
  for (const y of [7, 11, 15, 19]) g.set(13, y, '}').set(26, y, '}');
  g.rect(18, 5, 4, 18, ')');
  g.rect(19, 23, 2, 6, ')');
  for (const y of [7, 10, 13, 16, 19]) g.set(15, y, '[').set(24, y, '[');
  g.set(14, 22, '*').set(25, 22, '*');

  // West: the Council Chamber (benches facing the Speaker's desk) and the Envoys' Reception Room.
  g.rect(1, 2, 12, 1, '!').rect(1, 12, 12, 1, '!');
  g.rect(1, 3, 12, 9, 'o');
  g.rect(5, 4, 4, 1, '$');
  g.rect(2, 7, 4, 1, '+').rect(8, 7, 4, 1, '+').rect(2, 9, 4, 1, '+').rect(8, 9, 4, 1, '+');
  g.set(1, 3, 'h').set(12, 3, 'h');
  g.rect(1, 13, 12, 9, 'u');
  g.rect(4, 16, 4, 2, 'a').set(3, 16, 's').set(3, 17, 's').set(8, 16, 's').set(8, 17, 's');
  g.set(1, 13, '*').set(11, 13, '*').set(1, 21, '*').set(11, 21, '*');
  g.rect(1, 22, 12, 1, '!');

  // East: the Chancellor's office, the Seal and Records Room, the Courier Office.
  g.rect(27, 2, 12, 1, '!').rect(27, 9, 12, 1, '!').rect(27, 16, 12, 1, '!').rect(27, 22, 12, 1, '!');
  g.rect(27, 3, 12, 6, 'o');
  g.rect(31, 4, 3, 1, '$').set(30, 3, 'h').set(35, 3, 'h').set(37, 7, '*');
  g.rect(27, 10, 12, 6, 'o');
  g.rect(28, 10, 3, 1, 'h').rect(34, 10, 3, 1, 'h');
  g.rect(37, 13, 1, 2, '>');
  g.rect(27, 17, 12, 5, 'o');
  g.rect(35, 17, 3, 2, '?').rect(29, 19, 3, 1, '$').set(33, 21, 'm');

  // The entrance hall: guards at the door, the clerk's desk, benches for those who wait.
  g.rect(1, 23, W - 2, 1, '!');
  g.rect(13, 24, 1, 5, '!').rect(26, 24, 1, 5, '!');
  g.rect(22, 25, 2, 1, '$');
  g.rect(15, 27, 2, 1, '/').rect(23, 27, 2, 1, '/');
  g.set(14, 24, '*').set(25, 24, '*');
  // The Scribes' Room (west) and the Treasury (east).
  g.rect(1, 24, 12, 5, 'o');
  g.rect(3, 25, 2, 1, '$').rect(7, 25, 2, 1, '$').rect(3, 27, 2, 1, '$').rect(7, 27, 2, 1, '$').rect(11, 24, 1, 2, 'h');
  g.rect(27, 24, 12, 5, 'o');
  g.rect(33, 24, 5, 1, '>').rect(36, 26, 2, 2, '>');

  // Doorways (openings in the inner walls).
  g.set(13, 9, '(').set(13, 17, '(').set(26, 6, '(').set(26, 13, '(').set(26, 20, '(');
  g.rect(18, 23, 4, 1, '(');
  g.set(13, 26, '(').set(26, 26, '(');
  g.set(6, 12, 'o');

  const e = g.map({
    '(': '"',
    ')': '"',
    '{': '"',
    '[': 'Y',
    ']': 't',
    '!': '%',
    '}': '%',
    o: '"',
    u: '"',
    $: 't',
    '+': 'x',
    '/': 'x',
    '*': 'Y',
    '<': 'x',
    '>': 'Z',
    '?': 'Y',
    h: 'Y',
    a: 't',
    s: 'x',
    m: 't',
    v: '%',
  });

  const objects: ObjSpec[] = [
    // The entrance hall.
    // One tile either side of the double doors (owner report, Oct 16: equal distance).
    npc('hall_guard', 17, 28, 'right'),
    npc('hall_guard_2', 22, 28, 'left'),
    npc('hall_clerk', 21, 25, 'down'),
    npc('hall_page', 21, 14, 'left'),
    npc('hall_steward', 17, 11, 'right'),
    // The throne room: the usher keeps it while the Head of State is away.
    npc('throne_usher', 21, 4, 'down'),
    // The Council Chamber.
    npc('council_speaker', 7, 5, 'down'),
    npc('elder_dove', 3, 8, 'up'),
    npc('elder_hawk', 10, 8, 'up'),
    // The Envoys' Reception Room.
    npc('foreign_envoy', 6, 15, 'down'),
    // The Crown's consul (decision D, Oct 19): in the Envoys' room by day; the night the lamps light he waits in
    // the gallery outside the Chancellor's office, walks in on her signing Gianna's papers, and leaves the Hall.
    npc('crown_consul', 9, 19, 'up', { if: '!story.anissa_woke' }),
    npc('crown_consul_gallery', 24, 6, 'right', { npc: 'crown_consul', if: 'story.anissa_woke, !story.envoy_papers' }),
    // East.
    npc('chancellor', 32, 5, 'down'),
    npc('seal_keeper', 32, 12, 'down'),
    npc('chief_courier', 30, 18, 'down'),
    npc('treasurer', 34, 26, 'up'),
    npc('scribe', 5, 26, 'up'),
    npc('scribe_2', 9, 26, 'up'),

    { layer: 'doors', name: 'hall_out', x: 19, y: H - 1, props: { target: 'square_hall', map: 'zetwal-square', exit: 'up' } },
    { layer: 'spawns', name: 'hall', x: 19, y: H - 2, props: { facing: 'up', era: 'present' } },

    obj('head_seat', 19, 2, { dialogue: 'hall_seat', era: 'present' }),
    obj('hall_law', 28, 10, { dialogue: 'shelf.hall_law', era: 'present' }, 3, 1),
    obj('hall_records', 34, 10, { dialogue: 'shelf.hall_records', era: 'present' }, 3, 1),
    obj('council_desk', 5, 4, { dialogue: 'council_desk', era: 'present' }, 4, 1),
    obj('pigeon_loft', 35, 17, { dialogue: 'pigeon_loft', era: 'present' }, 3, 2),
    obj('courier_map', 33, 21, { dialogue: 'courier_map', era: 'present' }),
    obj('treasury_chests', 33, 24, { dialogue: 'treasury_chests', era: 'present' }, 5, 1),
    obj('portrait_patricio', 13, 7, { dialogue: 'portrait_patricio', era: 'present' }),
    obj('portrait_solange', 26, 7, { dialogue: 'portrait_solange', era: 'present' }),
    obj('portrait_elodie', 13, 19, { dialogue: 'portrait_elodie', era: 'present' }),
    obj('portrait_founders', 26, 19, { dialogue: 'portrait_founders', era: 'present' }),
  ];
  return { id: 'zetwal-hall', present: g, echo: e, objects, interior: true };
}
