// The Old Harbor, west along the shore from the plaza: the fish market, the customs house, the net
// menders and the ferry landing. Exploration for now (owner decision, Oct 15); more to do here when
// Gianna comes home. The Echo is the harbor fifty years ago, when the Crown's ships sat in it.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalHarbor(): MapSource {
  const W = 36;
  const H = 18;
  const g = new Grid(W, H, '.');

  // Borders: trees north and east (the door east to the plaza's shore), the sea south and west.
  g.rect(0, 0, W, 1, 'T').rect(W - 1, 0, 1, 10, 'T').set(W - 1, 4, 'D');
  g.rect(0, 11, W, H - 11, '~').rect(0, 3, 2, 8, '~');
  g.rect(2, 9, W - 3, 2, 'n');

  // The harbor road from the plaza, down to the piers.
  g.rect(2, 4, W - 3, 1, ',');
  g.rect(18, 5, 2, 4, ',');

  // The fish market: stalls on the paving.
  g.rect(8, 5, 8, 3, ':');
  g.set(9, 6, 'S').set(10, 6, 'S').set(13, 6, 'S').set(14, 6, 'S');

  // The customs house (no way in yet) and its sign; a net shed.
  g.rect(21, 1, 7, 1, '^').rect(21, 2, 7, 1, '#');
  g.set(24, 3, 'P');
  g.rect(3, 1, 4, 1, '^').rect(3, 2, 4, 1, '#');

  // Piers, boats and the ferry landing (the long pier east).
  g.rect(6, 11, 2, 4, 'k').rect(16, 11, 2, 3, 'k').rect(25, 11, 2, 4, 'k').rect(30, 11, 2, 6, 'k');
  g.set(8, 13, 'c').set(15, 12, 'c').set(27, 14, 'c').set(29, 15, 'c').set(4, 13, 'c');

  // Barrels and crates on the quay, trees.
  g.set(4, 8, 'X').set(5, 8, 'X').set(28, 7, 'X').set(33, 8, 'X');
  for (const [x, y] of [[8, 1], [16, 2], [31, 2], [12, 2]] as const) g.set(x, y, 'T');
  g.rect(29, 1, 2, 1, 'B');

  // The path up to the Iron Market, which the city map shows just above the harbour (owner report, Oct 16).
  g.rect(18, 0, 2, 4, ',');

  const e = g.map({ '.': '"', ',': ';', ':': ';', T: 'Y', B: 'Y', S: 't', X: 'Z', P: ';', '#': '%', n: '"', k: ';', D: 'D' });

  const objects: ObjSpec[] = [
    npc('fishwife', 11, 7, 'down'),
    npc('net_mender', 5, 9, 'down'),
    npc('customs_clerk', 23, 3, 'down'),
    npc('harbor_kid', 20, 8, 'left'),
    npc('old_sailor', 17, 13, 'down'),
    npc('ferry_hand', 31, 12, 'up'),

    { layer: 'doors', name: 'harbor_market', x: 18, y: 0, w: 2, props: { target: 'market_harbor', map: 'zetwal-market', exit: 'down' } },
    { layer: 'doors', name: 'harbor_plaza', x: W - 1, y: 4, props: { target: 'town_harbor', map: 'zetwal-town', exit: 'left' } },
    { layer: 'spawns', name: 'harbor', x: W - 2, y: 4, props: { facing: 'left', era: 'present' } },
    obj('customs_sign', 24, 3, { dialogue: 'customs_sign', era: 'present' }),
  ];
  return { id: 'zetwal-harbor', present: g, echo: e, objects };
}
