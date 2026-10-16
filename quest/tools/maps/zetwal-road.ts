// The Cane Road beyond Zetwal's east gate: the city's wild section. Cane fields on both sides of the
// road, the burned sugar mill, a smugglers' cache and the mangrove shore. Past the first stretch by
// the gate, ambushes come out of the cane (map layer `encounters`, table `cane_road` in
// data/encounters.ts): bandits, smugglers and Quiet Crown zealots, but only when the story brings the
// party back to Zetwal (`story.zetwal_return`); Chapter 1 has no fights. The Echo is the Crown's
// plantation fifty years ago, where the side quest A Name in the Cane finds Rose-Aimée.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { npc, obj, trigger } from './zetwal-town.ts';

export function zetwalRoad(): MapSource {
  const W = 44;
  const H = 26;
  const g = new Grid(W, H, '.');
  // Borders: the city wall (west) with the gate, trees north and south, the mangrove shore south-east.
  g.rect(0, 0, 1, H, '#').set(0, 12, 'D');
  g.rect(0, 0, W, 1, 'T').rect(0, H - 1, W, 1, 'T').rect(W - 1, 0, 1, H, 'T');
  g.rect(34, 18, 9, 7, '~');
  for (const [x, y] of [[33, 18], [33, 20], [35, 17], [38, 17], [41, 17], [33, 23]] as const) g.set(x, y, 'T');

  // The road east, a lane north to the mill and a track south to the smugglers' landing.
  g.rect(1, 12, W - 2, 2, ',');
  g.rect(36, 4, 2, 8, ',');
  g.rect(24, 14, 2, 4, ',');

  // Cane fields either side of the road (walkable: the bandits hide in it).
  g.rect(10, 2, 22, 9, 'i').rect(10, 15, 13, 9, 'i').rect(26, 15, 7, 9, 'i');
  g.rect(39, 2, 4, 9, 'i');

  // The burned sugar mill (north-east), with a broken wall and a cold hearth.
  g.rect(33, 2, 6, 1, '%').rect(33, 2, 1, 2, '%').rect(38, 2, 1, 2, '%').set(35, 3, '&');

  // The smugglers' landing: crates under cane leaves by the water.
  g.set(23, 18, 'X').set(26, 18, 'X').rect(24, 18, 2, 1, 'n').rect(24, 19, 2, 1, 'k');

  // The safe stretch by the gate: a field shrine, flowers, the signpost.
  g.rect(2, 3, 5, 1, 'f').rect(3, 20, 4, 1, 'f').set(4, 11, 'P');
  for (const [x, y] of [[2, 6], [7, 4], [3, 17], [7, 22], [5, 15]] as const) g.set(x, y, 'T');

  const e = g.map({ '.': '"', ',': ';', i: 'I', T: 'Y', f: '"', P: '"', X: 'Z', n: '"', k: ';', '&': '&', D: 'D' });

  const objects: ObjSpec[] = [
    npc('cane_cutter', 6, 10, 'right'),
    npc('road_watcher', 36, 8, 'down'),
    { layer: 'doors', name: 'road_gate', x: 0, y: 12, props: { target: 'town_gate', map: 'zetwal-town', exit: 'right' } },
    { layer: 'spawns', name: 'road', x: 2, y: 12, props: { facing: 'right', era: 'present' } },
    obj('road_sign', 4, 11, { dialogue: 'road_sign', era: 'present' }),
    obj('mill_ruin', 35, 3, { dialogue: 'mill_ruin', era: 'present' }),
    obj('smuggler_crates', 23, 18, { dialogue: 'smuggler_crates', era: 'present' }),
    // The first battle (owner decision, Oct 15): where the road meets the cane, a boar charges out.
    // It fires every time until the boar is beaten (a reload mid-fight brings it back). The line runs the
    // whole height of the map (owner report, Oct 16: walking along the grass missed it).
    trigger('boar_ambush', 9, 1, { dialogue: 'boar_ambush', if: 'party.anissa, !encounter.wilds.boar.won' }, 1, 24),
    // A Name in the Cane: the road fifty years ago, where Rose-Aimée worked by the roses at the gate.
    { layer: 'echo_zones', name: 'cane_roses', x: 2, y: 14, w: 3, h: 2, props: { if: 'item.sun_locket, side.cane_name.stones', onEcho: 'cane_echo_enter' } },
    npc('echo_cane_worker', 2, 16, 'up', { era: 'echo' }),
    // Everything past the safe stretch by the gate is wild, once the story returns to Zetwal (no fights
    // in Chapter 1).
    { layer: 'encounters', name: 'cane_fields', x: 9, y: 1, w: W - 10, h: H - 2, props: { table: 'cane_road', if: 'story.zetwal_return' } },
  ];
  return { id: 'zetwal-road', present: g, echo: e, objects };
}
