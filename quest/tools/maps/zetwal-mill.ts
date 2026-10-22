// The sugar mill's cellar under the Cane Road (Chapter 10, Z-6 Muskets in the Cane; the Echo puzzle M-ZET-2, difficulty
// 2): a low stone room down the stair from the burned mill, the smugglers' second cache behind an inner door, a lantern,
// and the air shimmering on the floor. Fifty years ago the room was the Revolution's powder store: the powder-master
// barred and pinned the inner door when he went, and the bar is the anchor. Places come from src/data/muster.ts.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj } from './zetwal-town.ts';
import { MILL } from '../../src/data/muster.ts';

const WALL = 'Ω';
const FLOOR = 'Σ';
const FLOOR_OLD = 'Ψ';

export function zetwalMill(): MapSource {
  const { w: W, h: H } = MILL;
  const g = new Grid(W, H, FLOOR);
  g.rect(0, 0, W, 1, WALL).rect(0, 0, 1, H, WALL).rect(W - 1, 0, 1, H, WALL).rect(0, H - 1, W, 1, WALL);
  // The wall between the cellar and the cache, the inner door in it (drawn by its object; solid in both eras).
  g.rect(1, MILL.innerDoor.y, W - 2, 1, WALL);
  g.set(MILL.stair.x, MILL.stair.y, 'D');
  const e = g.map({ [FLOOR]: FLOOR_OLD });
  const z = MILL.zone;
  const d = MILL.innerDoor;
  const objects: ObjSpec[] = [
    { layer: 'doors', name: 'mill_out', x: MILL.stair.x, y: MILL.stair.y, props: { target: 'road_mill', map: 'zetwal-road', exit: 'up' } },
    { layer: 'spawns', name: 'mill_stair', x: MILL.spawn.x, y: MILL.spawn.y, props: { facing: 'up', era: 'present' } },
    // The present: the inner door hangs open on the cache (muskets, stacked), until the bar is down fifty years ago.
    obj('mill_door_open', d.x, d.y, { kind: 'mill_door_open', solid: true, era: 'present', dialogue: 'mill_door_open', if: '!anchor.mill_bar' }, d.w, d.h),
    obj('mill_door_barred', d.x, d.y, { kind: 'mill_door_barred', solid: true, era: 'present', dialogue: 'mill_door_barred', if: 'anchor.mill_bar' }, d.w, d.h),
    obj('musket_crates', MILL.crates.x, MILL.crates.y, { kind: 'musket_crates', solid: true, era: 'present' }),
    obj('cellar_lantern', MILL.lantern.x, MILL.lantern.y, { kind: 'cellar_lantern', solid: true, era: 'present' }),
    // The memory: the powder store, the powder-master, the oak bar with its iron pin (the anchor).
    obj('mill_bar_echo', d.x, d.y, { kind: 'mill_bar_echo', solid: true, era: 'echo', dialogue: 'mill_bar_echo' }, d.w, d.h),
    npc('powder_master', MILL.powderMaster.x, MILL.powderMaster.y, 'right', { era: 'echo' }),
    { layer: 'echo_zones', name: 'cellar_floor', x: z.x, y: z.y, w: z.w, h: z.h, props: { if: 'item.sun_locket, item.smugglers_ledger', onEcho: 'mill_echo_enter', onReturn: 'mill_echo_return' } },
    { layer: 'anchors', name: 'mill_bar_pin', x: d.x, y: d.y, props: { object: 'mill_bar_echo', flag: 'anchor.mill_bar' } },
  ];
  return { id: 'zetwal-mill', present: g, echo: e, objects, interior: true };
}
