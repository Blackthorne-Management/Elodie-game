// The Iron Market, west of the plaza: Pòdlimyè's quarter of ironmongers, engravers and letter writers,
// and the Hall of the Accord (owner decision, Oct 15), the seat of the Zetwal state, where envoys are
// received and Elodie makes the laws. The Hall is one large drawing (OBJECT_ART hall_of_accord) on solid
// ground (lawn behind, paving under the porch), its door at the top of the stairs. The Echo is the same yard fifty years ago, the Crown's
// customs yard, the Hall not yet begun.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalMarket(): MapSource {
  const W = 30;
  const H = 24;
  const g = new Grid(W, H, '.');

  // Borders: trees all round; the lane east to the plaza.
  g.rect(0, 0, W, 1, 'T').rect(0, H - 1, W, 1, 'T').rect(0, 0, 1, H, 'T').rect(W - 1, 0, 1, H, 'T');
  g.set(W - 1, 15, 'D');

  // The Hall of the Accord (7 x 6 tiles under its drawing), the door at the top of its stairs.
  g.rect(11, 2, 7, 3, '1').rect(11, 5, 7, 3, '0').set(14, 7, 'D');
  // The square before the Hall, its lanterns and banners.
  g.rect(8, 8, 13, 6, ':');
  g.set(9, 8, 'L').set(19, 8, 'L').set(9, 7, 'N').set(19, 7, 'N').set(18, 8, 'P');

  // The market lane east to the plaza, and the alleys.
  g.rect(8, 14, W - 9, 2, ',');
  g.rect(3, 14, 5, 1, ',').rect(3, 9, 1, 5, ',');
  g.rect(24, 6, 1, 8, ',');

  // The ironworks (north-west) and the engravers' row (north-east), houses to the south.
  g.rect(2, 2, 6, 2, '^').rect(2, 4, 6, 2, '#');
  g.rect(20, 2, 8, 2, '^').rect(20, 4, 8, 1, '#');
  g.rect(2, 18, 6, 2, '^').rect(2, 20, 6, 2, '#');
  g.rect(19, 19, 6, 1, '^').rect(19, 20, 6, 2, '#');

  // Stalls: iron, engraving, ink and paper.
  g.set(5, 11, 'S').set(6, 11, 'S');
  g.set(22, 10, 'S').set(23, 10, 'S');
  g.set(12, 17, 'S').set(13, 17, 'S');
  g.set(25, 9, 'X').set(26, 9, 'X').set(8, 19, 'X').set(26, 17, 'X');

  // Trees and gardens.
  g.rect(14, 19, 3, 1, 'f').rect(2, 7, 3, 1, 'f');
  for (const [x, y] of [[9, 3], [19, 3], [1, 16], [10, 20], [17, 21], [27, 20], [27, 12], [6, 15]] as const) g.set(x, y, 'T');
  g.rect(26, 6, 2, 1, 'B');

  const e = g.map({
    '.': '"',
    ',': ';',
    ':': ';',
    f: '"',
    T: 'Y',
    B: 'Y',
    S: 't',
    L: 'x',
    N: 'x',
    X: 'Z',
    P: ';',
    '0': '|',
    '1': 'Y',
    '#': '%',
    D: 'D',
  });
  // The customs yard: crates where the Hall will stand, a barricade across the square.
  e.rect(12, 7, 5, 1, '&').set(14, 7, 'D');
  e.rect(10, 11, 3, 1, 'x');

  const objects: ObjSpec[] = [
    npc('hall_guard', 13, 8, 'down'),
    npc('engraver', 22, 11, 'down'),
    npc('ironmonger', 5, 12, 'up'),
    npc('letter_writer', 13, 18, 'up'),
    npc('foreign_envoy', 16, 10, 'left'),
    npc('market_kid', 10, 16, 'right'),

    { layer: 'doors', name: 'market_plaza', x: W - 1, y: 15, props: { target: 'town_market', map: 'zetwal-town', exit: 'left' } },
    { layer: 'doors', name: 'market_hall', x: 14, y: 7, props: { target: 'hall_out', map: 'zetwal-hall', exit: 'down' } },
    { layer: 'spawns', name: 'market', x: W - 2, y: 15, props: { facing: 'left', era: 'present' } },

    // The Hall: one drawing over its solid paving (the door stays reachable at the top of the stairs).
    obj('hall_of_accord', 11, 2, { era: 'present', kind: 'hall_of_accord', walkable: true }, 7, 6),
    obj('hall_sign', 18, 8, { dialogue: 'hall_sign', era: 'present' }),
  ];
  return { id: 'zetwal-market', present: g, echo: e, objects };
}
