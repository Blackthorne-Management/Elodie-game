// People who walk to their new place (engine/walkers.ts): which placements count as a move, and the
// route walked. Mother walks from the festival stage to the east gate (owner report, Oct 16).

import { describe, expect, it } from 'vitest';
import { samePos } from '../src/engine/grid.ts';
import type { NpcPlacement } from '../src/engine/tiledMap.ts';
import type { Pos } from '../src/engine/types.ts';
import { npcMoves, walkRoute } from '../src/engine/walkers.ts';
import { newGameSim } from '../tools/sim-setup.ts';

const at = (objectId: number, npc: string, x: number, y: number): NpcPlacement => ({
  objectId,
  npc,
  pos: { x, y },
  facing: 'down',
  era: 'present',
});

describe('npcMoves', () => {
  it('pairs a placement that went with one of the same person that came', () => {
    const moves = npcMoves([at(1, 'elodie', 17, 4), at(2, 'guard', 3, 3)], [at(9, 'elodie', 36, 20), at(2, 'guard', 3, 3)]);
    expect(moves).toEqual([{ npc: 'elodie', fromId: 1, toId: 9, from: { x: 17, y: 4 }, to: { x: 36, y: 20 } }]);
  });

  it('ignores people who only appear or only leave, and ambiguous pairs', () => {
    expect(npcMoves([at(1, 'a', 1, 1)], [])).toEqual([]);
    expect(npcMoves([], [at(1, 'a', 1, 1)])).toEqual([]);
    expect(npcMoves([at(1, 'a', 1, 1)], [at(2, 'a', 5, 5), at(3, 'a', 6, 6)])).toEqual([]);
    expect(npcMoves([at(1, 'a', 1, 1)], [at(2, 'b', 5, 5)])).toEqual([]);
  });
});

/** Every step of a route is one tile (straight or diagonal) and never cuts a blocked corner. */
function checkSteps(isOpen: (p: Pos) => boolean, from: Pos, tiles: Pos[]): void {
  let cur = from;
  for (const t of tiles) {
    const dx = t.x - cur.x;
    const dy = t.y - cur.y;
    expect(Math.max(Math.abs(dx), Math.abs(dy))).toBe(1);
    if (dx !== 0 && dy !== 0) {
      expect(isOpen({ x: cur.x + dx, y: cur.y })).toBe(true);
      expect(isOpen({ x: cur.x, y: cur.y + dy })).toBe(true);
    }
    cur = t;
  }
}

describe('Mother walks from the stage to the east gate', () => {
  it('has a route across the plaza after her speech', () => {
    const sim = newGameSim();
    const logic = sim.logic;
    expect(logic.map.id).toBe('zetwal-town');
    const before = logic.npcs();
    logic.state.flags.set('story.heard_speech', true);
    const moves = npcMoves(before, logic.npcs());
    const mother = moves.find((m) => m.npc === 'elodie');
    expect(mother).toBeDefined();
    const tiles = walkRoute(logic, mother!.from, mother!.to);
    expect(tiles).not.toBeNull();
    expect(samePos(tiles!.at(-1)!, mother!.to)).toBe(true);
    // Never over a door, and every tile but the gate is open ground.
    for (const t of tiles!.slice(0, -1)) {
      expect(logic.isOpen(t)).toBe(true);
      expect(logic.map.doors.some((d) => samePos(d.pos, t))).toBe(false);
    }
    checkSteps((p) => logic.isOpen(p) || samePos(p, mother!.to), mother!.from, tiles!);
  });
});
