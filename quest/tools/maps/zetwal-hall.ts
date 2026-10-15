// The Hall of the Accord in the Iron Market: the seat of the Zetwal state, where Elodie governs. A council
// table, the public copy of the Sun Accord and the harbor records (data/books.ts), and the clerk.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalHall(): MapSource {
  const g = new Grid(18, 12, 'o');
  g.rect(0, 0, 18, 2, '#').rect(0, 0, 1, 12, '#').rect(17, 0, 1, 12, '#').rect(0, 11, 18, 1, '#');
  g.set(9, 11, 'D').set(5, 1, 'v').set(12, 1, 'v');
  g.rect(1, 2, 3, 1, 'h').rect(14, 2, 3, 1, 'h');
  // The council table with its seats, and the runner to the door.
  g.rect(6, 4, 6, 2, 'a').set(5, 4, 's').set(5, 5, 's').set(12, 4, 's').set(12, 5, 's');
  g.rect(8, 7, 2, 4, 'u');
  // The Head of State's chair at the head of the table, where Elodie hears the council and makes the laws.
  g.set(9, 3, 's');

  const e = g.map({ o: 'e', '#': '%', h: 'H', a: 'A', s: 'z', u: 'e' });

  const objects: ObjSpec[] = [
    npc('hall_clerk', 13, 8, 'left'),
    { layer: 'doors', name: 'hall_out', x: 9, y: 11, props: { target: 'market_hall', map: 'zetwal-market', exit: 'up' } },
    { layer: 'spawns', name: 'hall', x: 9, y: 9, props: { facing: 'up', era: 'present' } },
    obj('head_seat', 9, 3, { dialogue: 'hall_seat', era: 'present' }),
    obj('hall_law', 1, 2, { dialogue: 'shelf.hall_law', era: 'present' }, 3, 1),
    obj('hall_records', 14, 2, { dialogue: 'shelf.hall_records', era: 'present' }, 3, 1),
  ];
  return { id: 'zetwal-hall', present: g, echo: e, objects };
}
