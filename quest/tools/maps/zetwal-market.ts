// The Iron Market, west of the plaza (owner decision, Oct 15: "a true market feel"): the city's great market
// under the red iron hall with the clock tower (OBJECT_ART iron_market_hall, after Port-au-Prince's Marché en
// Fer), and around it the rows: produce and spices, cloth, iron goods and the engraver, fish on ice, a pen of
// goats and chickens, the lottery booth and the carts unloading. The engraver keeps the Head of State's seal
// (The Envoy's Papers). The Echo is the same ground fifty years ago: the Crown's customs yard.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalMarket(): MapSource {
  const W = 36;
  const H = 24;
  const g = new Grid(W, H, '2');

  // Shophouses along the north, trees west and south, the lane east to the plaza.
  g.rect(0, 0, W, 1, '^').rect(0, 1, W, 1, '#');
  g.rect(0, 0, 1, H, 'T').rect(0, H - 1, W, 1, 'T').rect(W - 1, 0, 1, H, 'T');
  g.set(W - 1, 15, 'D');
  g.rect(W - 4, 14, 3, 2, ',');

  // The iron hall: 10 x 6 tiles under its drawing, lamps before its gate.
  g.rect(13, 2, 10, 6, '0');
  g.set(12, 8, 'L').set(23, 8, 'L');

  // Produce (west) and spices (east), the first row.
  for (const [i, x] of [2, 3, 4, 5, 6, 7, 8, 9, 10].entries()) g.set(x, 9, i % 3 === 0 ? '5' : '6');
  for (const [i, x] of [25, 26, 27, 28, 29, 30, 31, 32, 33].entries()) g.set(x, 9, i % 3 === 0 ? '3' : '7');
  // Cloth (west) and iron goods with the engraver (east), the second row.
  for (const [i, x] of [2, 3, 4, 5, 6, 7, 8, 9, 10].entries()) g.set(x, 12, i % 3 === 2 ? '3' : '8');
  for (const [i, x] of [25, 26, 27, 28, 29, 30, 31, 32, 33].entries()) g.set(x, 12, i % 4 === 1 ? '`' : '4');
  // Fish on ice (south-east), the goat and chicken pen (south-west).
  g.rect(25, 18, 6, 1, '9').set(31, 18, '3').set(32, 18, '`');
  g.rect(2, 17, 8, 1, '=').rect(2, 21, 8, 1, '=').rect(2, 18, 1, 3, '=').rect(9, 18, 1, 3, '=');
  g.rect(3, 18, 6, 3, ',');
  g.set(4, 19, 'J').set(7, 18, 'J').set(5, 20, 'F').set(8, 20, 'F');
  // The lottery booth, carts and barrels on the loading street (south).
  g.set(14, 19, 'U').set(12, 21, 'V').set(21, 21, 'V').set(27, 21, 'V');
  g.set(13, 21, '`').set(22, 21, '`').set(33, 21, '`').set(2, 15, '`').set(2, 14, '`');
  g.rect(11, 22, 24, 1, ',');
  for (const [x, y] of [[1, 6], [1, 11], [34, 6], [17, 17], [11, 19]] as const) g.set(x, y, 'T');
  g.set(17, 17, 'O');
  // A middle row of mixed stalls around the fountain.
  for (const [i, x] of [12, 13, 14, 15, 19, 20, 21, 22].entries()) g.set(x, 17, '35674853'[i]!);

  // Two ways on, where the city map shows the market touching its neighbours (owner report, Oct 16): a lane
  // north just right of the iron hall, up to Solèy Heights, and a gap in the trees south of the loading
  // street, down to the Old Harbor.
  g.rect(24, 0, 2, 2, '2');
  g.rect(18, 23, 2, 1, ',');

  const e = g.map({
    '2': ';',
    '3': 't',
    '4': 't',
    '5': 't',
    '6': 'Z',
    '7': 'Z',
    '8': 't',
    '9': 't',
    U: 'x',
    V: 'x',
    '`': 'Z',
    L: 'x',
    O: '&',
    ',': ';',
    T: 'Y',
    '=': 'x',
    '0': '|',
    '#': '%',
    D: 'D',
  });

  const objects: ObjSpec[] = [
    // Vendors with shops, and the engraver.
    npc('produce_seller', 6, 10, 'down'),
    npc('spice_seller', 29, 10, 'down'),
    npc('cloth_merchant', 5, 13, 'down'),
    npc('engraver', 28, 13, 'down'),
    // The market's people.
    npc('ironmonger', 32, 13, 'down'),
    npc('fishmonger', 27, 19, 'down'),
    npc('goat_herder', 10, 19, 'left'),
    npc('lottery_seller', 15, 19, 'left'),
    npc('letter_writer', 20, 10, 'down'),
    npc('porter', 24, 20, 'left'),
    npc('pickpocket', 19, 15, 'right'),
    npc('market_kid', 12, 15, 'right'),
    npc('market_shopper', 8, 15, 'up'),

    { layer: 'doors', name: 'market_heights', x: 24, y: 0, w: 2, props: { target: 'heights_market', map: 'zetwal-heights', exit: 'down' } },
    { layer: 'doors', name: 'market_harbor', x: 18, y: H - 1, w: 2, props: { target: 'harbor_market', map: 'zetwal-harbor', exit: 'up' } },
    { layer: 'doors', name: 'market_plaza', x: W - 1, y: 15, props: { target: 'town_market', map: 'zetwal-town', exit: 'left' } },
    { layer: 'spawns', name: 'market', x: W - 2, y: 15, props: { facing: 'left', era: 'present' } },

    obj('iron_market_hall', 13, 2, { dialogue: 'iron_market_hall', era: 'present', kind: 'iron_market_hall' }, 10, 6),
  ];
  return { id: 'zetwal-market', present: g, echo: e, objects };
}
