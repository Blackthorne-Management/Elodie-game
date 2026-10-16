// The Limyè family house in Zetwal, once Marshal Patricio's: a living room and Grandfather's study.
// The Echo is the same rooms fifty years ago: Patricio's war room on the night before the signing.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';

export function zetwalHouse(): MapSource {
  const g = new Grid(20, 12, 'o');
  g.rect(0, 0, 20, 2, '#').rect(0, 0, 1, 12, '#').rect(19, 0, 1, 12, '#').rect(0, 11, 20, 1, '#');
  g.set(5, 11, 'D').set(6, 1, 'v').set(17, 1, 'v');
  g.rect(10, 2, 1, 9, '#').rect(10, 6, 1, 2, 'o');
  // Living room.
  g.rect(1, 2, 3, 1, 'h').rect(3, 4, 2, 1, 'a').rect(8, 2, 1, 2, 'd').rect(3, 7, 4, 2, 'u');
  // The study.
  g.rect(11, 2, 3, 1, 'h').rect(14, 4, 2, 2, 'm').set(17, 2, 's').rect(12, 8, 6, 2, 'u');

  const e = g.map({ o: 'e', '#': '%', h: 'H', m: 'j', a: 'A', d: 'b', s: 'z', u: 'e' });
  e.rect(1, 8, 1, 2, 'b').rect(6, 4, 2, 1, 'A').rect(17, 9, 1, 2, 'A');

  const objects: ObjSpec[] = [
    npc('anicette', 12, 4, 'right'),
    npc('echo_aide', 12, 4, 'right', { era: 'echo' }),
    npc('echo_messenger', 17, 7, 'left', { era: 'echo' }),
    npc('echo_guard', 7, 8, 'down', { era: 'echo' }),

    { layer: 'doors', name: 'house_front', x: 5, y: 11, props: { target: 'town_house', map: 'zetwal-town', exit: 'up' } },
    { layer: 'spawns', name: 'study', x: 14, y: 9, props: { facing: 'up', era: 'present' } },
    trigger('house_enter', 5, 10, { dialogue: 'house_enter', flag: 'story.house_entered', once: true, onEnter: true, if: 'story.elodie_left' }),

    {
      layer: 'echo_zones',
      name: 'study',
      x: 13,
      y: 6,
      w: 4,
      h: 2,
      props: { if: 'item.sun_locket', onEcho: 'warroom_enter', onReturn: 'warroom_return' },
    },

    obj('map_table', 14, 4, { dialogue: 'map_table_present', era: 'present', kind: 'war_table' }, 2, 2),
    obj('war_map', 14, 4, { dialogue: 'map_table_echo', era: 'echo', kind: 'war_table_echo' }, 2, 2),
    obj('study_shelf', 11, 2, { dialogue: 'study_shelf', era: 'present' }, 3, 1),
    obj('window_seat', 17, 2, { dialogue: 'window_seat', era: 'present', if: '!anchor.night_orders' }),
    obj('loose_board', 17, 2, { dialogue: 'loose_board', era: 'present', kind: 'loose_board', if: 'anchor.night_orders' }),
    obj('floor_cache', 17, 2, { dialogue: 'floor_cache', era: 'echo' }),
    { layer: 'anchors', name: 'night_orders_cache', x: 17, y: 2, props: { object: 'floor_cache', flag: 'anchor.night_orders' } },
  ];
  return { id: 'zetwal-house', present: g, echo: e, objects, interior: true };
}
