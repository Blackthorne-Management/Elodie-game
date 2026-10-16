// Solèy Heights, up the hill west of Accord Square: old houses with deep porches, terraced gardens, the
// well, and the lookout over the whole city and the sea. Exploration for now (owner decision, Oct 15);
// more to do here when Gianna comes home. The Echo is the hill fifty years ago, an orchard and a
// sentry post.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalHeights(): MapSource {
  const W = 30;
  const H = 20;
  const g = new Grid(W, H, '.');

  // Borders: trees round the hilltop (the lane east to Accord Square), the cliff edge south.
  g.rect(0, 0, W, 1, 'T').rect(0, 0, 1, H, 'T').rect(W - 1, 0, 1, H, 'T');
  g.rect(1, H - 1, W - 2, 1, 'C');
  g.set(W - 1, 12, 'D');

  // The lane from the square and the paths along the hill.
  g.rect(14, 7, 1, 6, ',').rect(15, 12, W - 16, 1, ',');
  g.rect(3, 7, 24, 1, ',');

  // Old houses (no way in yet).
  g.rect(3, 9, 6, 2, '^').rect(3, 11, 6, 2, '#');
  g.rect(18, 2, 7, 2, '^').rect(18, 4, 7, 2, '#');
  g.rect(4, 2, 5, 2, '^').rect(4, 4, 5, 1, '#');

  // Terraced gardens and the well.
  g.rect(3, 15, 9, 1, 'f').rect(3, 17, 9, 1, 'f').rect(16, 10, 6, 1, 'f').rect(16, 12, 6, 1, 'f');
  g.rect(10, 2, 2, 1, 'f');
  g.set(24, 10, 'O');
  g.rect(16, 15, 1, 3, '=');

  // The lookout over the city: paving at the cliff edge with a railing.
  g.rect(19, 15, 8, 3, ':');
  g.rect(19, 18, 8, 1, '=');
  g.set(26, 15, 'P');

  for (const [x, y] of [[2, 14], [12, 11], [26, 3], [13, 3], [27, 8], [10, 17], [2, 5]] as const) g.set(x, y, 'T');
  g.rect(22, 8, 2, 1, 'B');

  // The path down past the lookout to the Iron Market below (owner report, Oct 16: the city map shows them
  // touching).
  g.rect(17, 12, 2, 8, ',');

  const e = g.map({ '.': '"', ',': ';', ':': ';', f: '"', T: 'Y', B: 'Y', O: 't', P: ';', '#': '%', '=': 'x', D: 'D' });
  // An orchard where the gardens are now, and the sentry post at the lookout.
  for (const [x, y] of [[4, 15], [7, 15], [10, 15], [17, 11], [20, 11]] as const) e.set(x, y, 'Y');
  e.set(22, 16, 't');

  const objects: ObjSpec[] = [
    npc('gardener', 7, 16, 'up'),
    npc('poet', 18, 11, 'right'),
    npc('porch_widow', 21, 6, 'down'),
    npc('lookout_keeper', 24, 16, 'up'),

    { layer: 'doors', name: 'heights_market', x: 17, y: H - 1, w: 2, props: { target: 'market_heights', map: 'zetwal-market', exit: 'up' } },
    { layer: 'doors', name: 'heights_square', x: W - 1, y: 12, props: { target: 'square_heights', map: 'zetwal-square', exit: 'left' } },
    { layer: 'spawns', name: 'heights', x: W - 2, y: 12, props: { facing: 'left', era: 'present' } },
    obj('lookout', 22, 17, { dialogue: 'lookout_view', era: 'present' }, 3, 1),
    obj('heights_well', 24, 10, { dialogue: 'heights_well', era: 'present' }),
    obj('lookout_sign', 26, 15, { dialogue: 'lookout_sign', era: 'present' }),
  ];
  return { id: 'zetwal-heights', present: g, echo: e, objects };
}
