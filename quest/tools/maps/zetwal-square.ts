// Accord Square, up the steps at the head of the plaza (owner decision, Oct 15: the seat of the state in the
// middle of the city, where the story's diplomacy happens). The Hall of the Accord faces south down the
// avenue to the plaza (one large drawing, OBJECT_ART hall_of_accord, on solid ground; its door at the top of
// the stairs), the bronze signers of the Accord in the middle, the guardhouse and the courier post either
// side, and the lane west to Solèy Heights. The Echo is the same ground fifty years ago: the field behind
// the revolutionary camp, the Hall not yet begun.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalSquare(): MapSource {
  const W = 36;
  const H = 22;
  const g = new Grid(W, H, '.');

  // Borders: trees, the lane west to the Heights, the steps south down to the plaza.
  g.rect(0, 0, W, 1, 'T').rect(0, 0, 1, H, 'T').rect(W - 1, 0, 1, H, 'T').rect(0, H - 1, W, 1, 'T');
  g.set(0, 9, 'D').set(17, H - 1, 'D');

  // The Hall of the Accord: 9 x 8 tiles under its drawing (lawn behind the dome, paving under the porch).
  g.rect(13, 1, 9, 4, '1').rect(13, 5, 9, 4, '0').set(17, 8, 'D');

  // The square: paving before the Hall, the avenue south, the lane west.
  g.rect(5, 9, 25, 8, ':');
  g.rect(15, 17, 5, 4, ':');
  g.rect(1, 9, 4, 1, ',');
  // Flagpoles either side of the stairs, lanterns down the avenue, hedges framing the square.
  g.set(16, 9, '-').set(19, 9, '-');
  g.set(15, 18, 'L').set(19, 18, 'L').set(5, 9, 'L').set(29, 9, 'L');
  g.rect(5, 17, 10, 1, 'E').rect(20, 17, 10, 1, 'E');
  g.rect(9, 5, 4, 1, 'E').rect(22, 5, 4, 1, 'E');
  // The statue of the signers in the middle of the square (3 x 2 tiles under its drawing).
  g.rect(16, 12, 3, 2, '0');

  // The guardhouse (west) and the courier post (east).
  g.rect(3, 2, 7, 2, '^').rect(3, 4, 7, 1, '#');
  g.rect(25, 2, 8, 2, '^').rect(25, 4, 8, 1, '#');
  g.set(24, 10, 'P');

  // Gardens and trees.
  g.rect(2, 12, 2, 4, 'f').rect(31, 12, 3, 4, 'f');
  for (const [x, y] of [[2, 7], [33, 7], [3, 18], [32, 18], [11, 2], [24, 2]] as const) g.set(x, y, 'T');

  const e = g.map({
    '.': '"',
    ',': ';',
    ':': ';',
    f: '"',
    T: 'Y',
    L: 'x',
    E: 'Y',
    '-': 'x',
    P: ';',
    '0': '"',
    '1': 'Y',
    '#': '%',
    D: 'D',
  });
  // Fifty years ago: an empty field, a few tents, stakes where the surveyors marked the Hall.
  e.rect(13, 5, 9, 1, 'x').set(17, 5, ';');
  e.set(8, 12, 't').set(27, 13, 't');

  const objects: ObjSpec[] = [
    // A flagpole and a guard either side of the double doors, the same distance out, so the whole path
    // to the doors shows (owner report, Oct 16).
    npc('honor_guard_w', 15, 9, 'down', { npc: 'honor_guard' }),
    npc('honor_guard_e', 20, 9, 'down', { npc: 'honor_guard_2' }),
    npc('gazette_crier', 22, 14, 'left'),
    npc('petitioner', 12, 11, 'up'),
    npc('protester', 26, 15, 'left'),
    npc('courier_rider', 28, 6, 'down'),
    npc('nursemaid', 8, 14, 'right'),

    { layer: 'doors', name: 'square_hall', x: 17, y: 8, props: { target: 'hall_out', map: 'zetwal-hall', exit: 'down' } },
    { layer: 'doors', name: 'square_plaza', x: 17, y: H - 1, props: { target: 'town_square', map: 'zetwal-town', exit: 'up' } },
    { layer: 'doors', name: 'square_heights', x: 0, y: 9, props: { target: 'heights_square', map: 'zetwal-heights', exit: 'right' } },
    { layer: 'spawns', name: 'square', x: 17, y: H - 2, props: { facing: 'up', era: 'present' } },

    // The Hall: one drawing over its solid ground, sorted with the people (behind it, you are hidden by
    // it); only the door at the top of the stairs is open. Never `walkable`: that opens every tile.
    obj('hall_of_accord', 13, 1, { era: 'present', kind: 'hall_of_accord' }, 9, 8),
    obj('accord_statue', 16, 12, { dialogue: 'accord_statue', era: 'present', kind: 'accord_statue' }, 3, 2),
    obj('hall_sign', 24, 10, { dialogue: 'hall_sign', era: 'present' }),
  ];
  return { id: 'zetwal-square', present: g, echo: e, objects };
}
