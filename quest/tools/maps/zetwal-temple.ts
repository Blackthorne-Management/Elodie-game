// The Temple of Elodie's island: the landing from the Chain Bridge, the temple with the Gaze lamp,
// and the dock. The Echo shows the temple fifty years ago, still under scaffolding.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';

export function zetwalTemple(): MapSource {
  const g = new Grid(30, 20, '.');
  g.rect(0, 0, 30, 1, '~').rect(0, 0, 1, 20, '~').rect(29, 0, 1, 20, '~').rect(0, 18, 30, 2, '~');
  g.rect(1, 1, 28, 1, 'T').rect(1, 1, 1, 17, 'T').rect(28, 1, 1, 17, 'T');
  g.set(1, 9, 'D');
  // The temple and the Gaze lamp.
  g.rect(9, 1, 12, 7, 'Q').rect(10, 2, 10, 5, 'q').rect(14, 7, 2, 1, 'q').rect(14, 3, 2, 1, 'l');
  for (const [x, y] of [[6, 4], [7, 4], [22, 4], [23, 4], [6, 6], [23, 6]] as const) g.set(x, y, 'g');
  // Paths, sand and the dock.
  g.rect(2, 9, 13, 1, ',').rect(14, 8, 2, 8, ',');
  g.rect(9, 15, 12, 3, 'n');
  g.rect(14, 18, 2, 1, 'k').set(16, 18, 'c');
  g.rect(3, 14, 3, 1, 'f').rect(22, 13, 3, 1, 'f');
  for (const [x, y] of [[3, 4], [4, 12], [8, 15], [21, 15], [25, 9], [24, 3], [26, 14], [5, 16], [3, 6]] as const) g.set(x, y, 'T');

  g.set(10, 2, 'D'); // the archive door, in the temple's north-west corner
  const e = g.map({ '.': '"', ',': ';', f: '"', T: 'Y', Q: '|', q: ';', g: 'G', l: 'l' });
  e.rect(14, 3, 2, 1, 'l');
  e.set(11, 2, ';');

  const objects: ObjSpec[] = [
    npc('patricio_old', 13, 3, 'right'),
    npc('acolyte', 17, 5, 'left'),
    npc('temple_porter', 16, 8, 'down'),
    npc('mourner', 19, 3, 'down'),
    npc('fisher_island', 22, 16, 'up'),
    npc('yari', 14, 17, 'up', { if: 'story.anissa_woke' }),
    npc('echo_builder', 6, 11, 'right', { era: 'echo' }),
    npc('echo_lampwright', 13, 3, 'right', { era: 'echo' }),

    { layer: 'doors', name: 'temple_bridge', x: 1, y: 9, props: { target: 'town_temple', map: 'zetwal-town', exit: 'right' } },
    { layer: 'doors', name: 'temple_archive', x: 10, y: 2, props: { target: 'archive_out', map: 'zetwal-archive', exit: 'down' } },
    { layer: 'spawns', name: 'temple_start', x: 3, y: 9, props: { facing: 'right', era: 'present' } },
    trigger('temple_arrive', 2, 9, { dialogue: 'temple_arrive', flag: 'story.temple_arrived', once: true, onEnter: true }),

    { layer: 'echo_zones', name: 'temple_grove', x: 5, y: 12, w: 3, h: 2, props: { if: 'item.sun_locket', onEcho: 'temple_echo_enter' } },

    obj('gaze_lamp', 14, 3, { dialogue: 'gaze_lamp', era: 'present', kind: 'gaze_lamp' }, 2, 1),
    obj('gaze_lamp_lit', 14, 3, { kind: 'gaze_lamp_lit', era: 'present', if: 'story.anissa_woke' }, 2, 1),
    obj('lamp_echo', 14, 3, { dialogue: 'lamp_echo', era: 'echo', kind: 'gaze_lamp' }, 2, 1),
    obj('name_stones', 6, 4, { dialogue: 'name_stones', era: 'present' }, 2, 1),
  ];
  return { id: 'zetwal-temple', present: g, echo: e, objects };
}
