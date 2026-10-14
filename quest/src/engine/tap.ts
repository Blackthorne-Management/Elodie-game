// Tap to move (touch and mouse): what a tap on a tile asks for. Tapping a person or a thing to use
// walks Gianna to the nearest tile beside it, turns her to face it and uses it; tapping a door walks
// into it; tapping open ground walks there. Paths come from sim.ts findPath (eight directions, no
// corner cutting, never through a door or a trigger on the way). Pure TypeScript, unit tested.

import type { GameLogic } from './game.ts';
import { samePos, stepFrom } from './grid.ts';
import { findPath } from './sim.ts';
import { rectContains } from './tiledMap.ts';
import { DIRS, type Dir, type Dir8, type Pos } from './types.ts';

export interface TapPlan {
  /** Steps to walk, in order. */
  path: Dir8[];
  /** After the walk: face this way and interact (talk, use, read). */
  face: Dir | null;
}

/** Where the tap was aimed: a person or a usable thing on that tile (their tiles), or nothing. */
function targetTiles(logic: GameLogic, tile: Pos): Pos[] | null {
  const npc = logic.npcs().find((n) => samePos(n.pos, tile));
  if (npc) return [npc.pos];
  const obj = logic
    .objects()
    .find((o) => rectContains(o.area, tile) && !o.walkable && (o.dialogue || logic.content.objects?.[o.id]?.inspect));
  if (!obj) return null;
  const out: Pos[] = [];
  for (let y = obj.area.y; y < obj.area.y + obj.area.height; y++) {
    for (let x = obj.area.x; x < obj.area.x + obj.area.width; x++) out.push({ x, y });
  }
  return out;
}

/** Plan a tap on `tile`, or null when there is nothing to do there or no way to get there. */
export function planTap(logic: GameLogic, tile: Pos): TapPlan | null {
  if (logic.mode !== 'field') return null;
  const here = logic.state.player.pos;
  const targets = targetTiles(logic, tile);
  if (targets) {
    // The tile beside the target (straight, so the facing is exact) with the shortest walk.
    let best: TapPlan | null = null;
    for (const t of targets) {
      for (const d of DIRS) {
        const stand = stepFrom(t, d);
        if (targets.some((x) => samePos(x, stand))) continue;
        const face = opposite(d);
        if (samePos(stand, here)) return { path: [], face };
        if (!logic.isOpen(stand)) continue;
        const path = findPath(logic, stand, true);
        if (path && (!best || path.length < best.path.length)) best = { path, face };
      }
    }
    return best;
  }
  if (samePos(tile, here)) return null;
  const path = findPath(logic, tile, true);
  return path ? { path, face: null } : null;
}

function opposite(d: Dir): Dir {
  return d === 'up' ? 'down' : d === 'down' ? 'up' : d === 'left' ? 'right' : 'left';
}
