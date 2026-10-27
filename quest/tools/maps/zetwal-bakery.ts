// The harbor bakery (Chapter 1, Z-5 Bread With No Debt; built Oct 27): a small room behind the plaza's south row, the
// back door onto the harbor lane, the oven and the counter west, the store room east past a half wall with its flour
// sacks (a grey thumbprint on every seam). Its Echo is the store room's floor: fifty years ago the house was the
// Revolution's grain store, and the quartermaster gave grain to anyone who asked. No anchor. Places come from
// src/data/bakery.ts.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';
import { BAKERY, Z5 } from '../../src/data/bakery.ts';

export function zetwalBakery(): MapSource {
  const { w: W, h: H } = BAKERY;
  const g = new Grid(W, H, 'o');
  g.rect(0, 0, W, 1, '#').rect(0, 0, 1, H, '#').rect(W - 1, 0, 1, H, '#').rect(0, H - 1, W, 1, '#');
  // The half wall between the front room and the store room; the counter; the back door.
  g.rect(BAKERY.wallX, 1, 1, 3, '#');
  g.rect(1, 3, 2, 1, 'a');
  g.set(BAKERY.door.x, BAKERY.door.y, 'D');
  // Fifty years ago: older floor and walls, no counter (the whole house was the grain store).
  const e = g.map({ o: 'e', '#': '%', a: 'e' });
  const z = BAKERY.zone;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'bakery_out', x: BAKERY.door.x, y: BAKERY.door.y, props: { target: 'town_bakery', map: 'zetwal-town', exit: 'up' } },
    { layer: 'spawns', name: 'bakery', x: BAKERY.spawn.x, y: BAKERY.spawn.y, props: { facing: 'up', era: 'present' } },
    obj('bakery_oven', BAKERY.oven.x, BAKERY.oven.y, { kind: 'bakery_oven', solid: true, era: 'present', dialogue: 'bakery_oven' }, 2, 1),
    obj('flour_sacks', BAKERY.sacks.x, BAKERY.sacks.y, { kind: 'grain_sacks', solid: true, era: 'present', dialogue: 'flour_sacks' }, 4, 1),
    // Before the bread, the baker; after the quest, the same baker with her shop (a shop has no condition).
    npc('baker', BAKERY.baker.x, BAKERY.baker.y, 'down', { if: `!${Z5.done}` }),
    npc('baker_shop', BAKERY.baker.x, BAKERY.baker.y, 'down', { if: Z5.done }),
    // The memory: the grain store, the sacks, the quartermaster.
    obj('grain_store', BAKERY.sacks.x, BAKERY.sacks.y, { kind: 'grain_sacks_old', solid: true, era: 'echo', dialogue: 'grain_store' }, 4, 1),
    obj('grain_store_west', BAKERY.oven.x, BAKERY.oven.y, { kind: 'grain_sacks_old', solid: true, era: 'echo', dialogue: 'grain_store' }, 2, 1),
    npc('echo_quartermaster', BAKERY.quartermaster.x, BAKERY.quartermaster.y, 'left', { era: 'echo' }),
    { layer: 'echo_zones', name: 'store_room', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: `item.sun_locket, ${Z5.accepted}`, onEcho: 'grain_store_enter', onReturn: 'grain_store_return' } },
  ];
  return { id: 'zetwal-bakery', present: g, echo: e, objects, interior: true };
}
