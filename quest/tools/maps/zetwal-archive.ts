// The Temple Archive on the temple island, where Gianna works: three shelves of lore books (data/books.ts),
// reading tables and the senior archivist. The Echo is the same room fifty years ago, when Mother
// Solange's rebuilt archive was still the only library on the island.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';

export function zetwalArchive(): MapSource {
  const g = new Grid(22, 14, 'o');
  g.rect(0, 0, 22, 2, '#').rect(0, 0, 1, 14, '#').rect(21, 0, 1, 14, '#').rect(0, 13, 22, 1, '#');
  g.set(10, 13, 'D').set(6, 1, 'v').set(15, 1, 'v');
  // The three reading shelves along the north wall, and the stacks.
  g.rect(1, 2, 3, 1, 'h').rect(9, 2, 3, 1, 'h').rect(17, 2, 3, 1, 'h');
  g.rect(2, 5, 4, 1, 'h').rect(16, 5, 4, 1, 'h').rect(2, 8, 4, 1, 'h').rect(16, 8, 4, 1, 'h');
  // Reading tables on a rug, and Gianna's desk in the corner.
  g.rect(8, 6, 6, 4, 'u').rect(9, 7, 4, 1, 'a');
  g.rect(18, 11, 2, 1, 'a').set(17, 11, 's');

  const e = g.map({ o: 'e', '#': '%', h: 'H', a: 'A', s: 'z', u: 'e' });

  const objects: ObjSpec[] = [
    npc('archivist', 14, 4, 'down'),
    { layer: 'doors', name: 'archive_out', x: 10, y: 13, props: { target: 'temple_archive', map: 'zetwal-temple', exit: 'up' } },
    { layer: 'spawns', name: 'archive', x: 10, y: 11, props: { facing: 'up', era: 'present' } },
    obj('archive_history', 1, 2, { dialogue: 'shelf.archive_history', era: 'present' }, 3, 1),
    obj('archive_faith', 9, 2, { dialogue: 'shelf.archive_faith', era: 'present' }, 3, 1),
    obj('archive_tales', 17, 2, { dialogue: 'shelf.archive_tales', era: 'present' }, 3, 1),
    // Mother Solange's list, open on the reading table (the side quest A Name in the Cane).
    obj('solange_list', 9, 7, { dialogue: 'solange_list', era: 'present' }, 4, 1),
  ];
  return { id: 'zetwal-archive', present: g, echo: e, objects, interior: true };
}
