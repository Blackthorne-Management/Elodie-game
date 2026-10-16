// People who walk from one place to another (owner report, Oct 16: Mother asks to be walked to the east
// gate and should walk there, not appear there). A person's place comes from the map and the flags: when
// a flag change hides one placement of an NPC and shows another placement of the same NPC on the same
// map, the field scene walks the sprite between them along a route from here. The logic already has the
// person at the new place; the walk is only how it looks. Pure TypeScript, tested in tests/walkers.test.ts.

import type { GameLogic } from './game.ts';
import type { NpcPlacement } from './tiledMap.ts';
import { components, isDiagonal, onDoor, samePos, stepFrom } from './grid.ts';
import { DIRS8, type Pos } from './types.ts';

/** An NPC that left one placement and now stands at another. */
export interface NpcMove {
  npc: string;
  fromId: number;
  toId: number;
  from: Pos;
  to: Pos;
}

/**
 * Pair the placements that disappeared with the ones that appeared, by NPC. Only an NPC with exactly one
 * of each is a move (two of the same NPC appearing at once stays ambiguous, so they just appear).
 */
export function npcMoves(before: readonly NpcPlacement[], after: readonly NpcPlacement[]): NpcMove[] {
  const gone = before.filter((b) => !after.some((a) => a.objectId === b.objectId));
  const came = after.filter((a) => !before.some((b) => b.objectId === a.objectId));
  const moves: NpcMove[] = [];
  for (const g of gone) {
    const sameGone = gone.filter((x) => x.npc === g.npc);
    const sameCame = came.filter((x) => x.npc === g.npc);
    if (sameGone.length !== 1 || sameCame.length !== 1) continue;
    const c = sameCame[0]!;
    if (samePos(g.pos, c.pos)) continue;
    moves.push({ npc: g.npc, fromId: g.objectId, toId: c.objectId, from: { ...g.pos }, to: { ...c.pos } });
  }
  return moves;
}

/**
 * The tiles a person walks through from `from` to `to` (not including `from`; the last tile is `to`), in
 * eight directions without cutting corners, never over a door. Other people are walked around when
 * possible and through when not (a crowd should not strand anyone). Null when there is no way at all.
 */
export function walkRoute(logic: GameLogic, from: Pos, to: Pos): Pos[] | null {
  if (samePos(from, to)) return [];
  const others = logic.npcs().filter((n) => !samePos(n.pos, to));
  return route(logic, from, to, (p) => others.some((n) => samePos(n.pos, p))) ?? route(logic, from, to, () => false);
}

function route(logic: GameLogic, from: Pos, to: Pos, crowded: (p: Pos) => boolean): Pos[] | null {
  const map = logic.map;
  const key = (p: Pos) => p.y * map.width + p.x;
  const open = (p: Pos) =>
    samePos(p, to) || (logic.isOpen(p) && !crowded(p) && !map.doors.some((d) => onDoor(d, p)));
  const prev = new Map<number, Pos | null>([[key(from), null]]);
  const queue: Pos[] = [from];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const dir of DIRS8) {
      const next = stepFrom(cur, dir);
      if (next.x < 0 || next.y < 0 || next.x >= map.width || next.y >= map.height) continue;
      if (prev.has(key(next)) || !open(next)) continue;
      if (isDiagonal(dir) && !components(dir).every((part) => open(stepFrom(cur, part)))) continue;
      prev.set(key(next), cur);
      if (samePos(next, to)) {
        const tiles: Pos[] = [];
        for (let at: Pos | null = next; at && !samePos(at, from); at = prev.get(key(at)) ?? null) tiles.push(at);
        return tiles.reverse();
      }
      queue.push(next);
    }
  }
  return null;
}
