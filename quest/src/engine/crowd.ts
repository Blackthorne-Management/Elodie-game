// Crowds (demo review, Oct 17): the festival's passers-by. Where each one starts and where they stroll
// next, inside their zone (engine/tiledMap.ts CrowdZone). Pure TypeScript with the seeded Rng; the
// field scene draws and moves them. They never block anyone and nobody talks to them.

import type { Rng } from './rng.ts';
import type { CrowdZone } from './tiledMap.ts';
import type { Pos } from './types.ts';

/** The zone's tiles, row by row. */
function zoneTiles(zone: CrowdZone): Pos[] {
  const out: Pos[] = [];
  for (let y = zone.area.y; y < zone.area.y + zone.area.height; y++) {
    for (let x = zone.area.x; x < zone.area.x + zone.area.width; x++) out.push({ x, y });
  }
  return out;
}

/** Where the crowd stands to begin with: `count` different open tiles in the zone (fewer if it is full). */
export function crowdSpots(zone: CrowdZone, open: (p: Pos) => boolean, rng: Rng): Pos[] {
  const tiles = zoneTiles(zone).filter(open);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [tiles[i], tiles[j]] = [tiles[j]!, tiles[i]!];
  }
  return tiles.slice(0, Math.max(0, zone.count));
}

const STEPS: readonly Pos[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/** One stroll step from `at`: a neighbouring open tile in the zone nobody stands on, or null to stay. */
export function crowdStep(zone: CrowdZone, at: Pos, open: (p: Pos) => boolean, taken: (p: Pos) => boolean, rng: Rng): Pos | null {
  const a = zone.area;
  const choices = STEPS.map((d) => ({ x: at.x + d.x, y: at.y + d.y })).filter(
    (p) => p.x >= a.x && p.y >= a.y && p.x < a.x + a.width && p.y < a.y + a.height && open(p) && !taken(p),
  );
  return choices.length > 0 ? rng.pick(choices) : null;
}
