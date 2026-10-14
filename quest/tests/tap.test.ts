// Tap to move (engine/tap.ts): walking to open ground, up to people and things, into doors; no
// corner cutting; nothing for a wall or an unreachable tile.

import { describe, expect, it } from 'vitest';
import type { GameContent } from '../src/engine/content.ts';
import { GameLogic } from '../src/engine/game.ts';
import { stepFrom } from '../src/engine/grid.ts';
import { newGame } from '../src/engine/state.ts';
import { planTap } from '../src/engine/tap.ts';
import { parseMap } from '../src/engine/tiledMap.ts';
import { makeMap, obj } from './helpers.ts';
import type { Pos } from '../src/engine/types.ts';

const say = (id: string) => ({ id, start: 'a', nodes: { a: { lines: [{ text: id, set: { [`${id}.seen`]: true } }] } } });

const content: GameContent = {
  npcs: { guard: { id: 'guard', look: 'x', dialogue: 'guard' } },
  dialogue: { guard: say('guard'), sign: say('sign') },
  speakers: {},
  cards: [],
  messages: { noZone: '', locked: '', blocked: '', doorInEcho: '', enterEcho: '', leaveEcho: '' },
};

// A 7 x 6 room: a wall block in the middle, a guard at 5,1, a sign (object) at 1,4, a door at 6,5,
// and a walled-off pocket at 0,0.
function logic(): GameLogic {
  const map = parseMap(
    'w',
    makeMap({
      present: ['.#.....', '##.....', '...##..', '...##..', '.#.....', '.......'],
      objects: {
        spawns: [obj('start', 2, 5)],
        npcs: [obj('g', 5, 1, { npc: 'guard' })],
        puzzle_objects: [obj('sign', 1, 4, { dialogue: 'sign' })],
        doors: [obj('d', 6, 5, { target: 'd', exit: 'up' })],
      },
    }),
  );
  return new GameLogic({ w: map }, content, newGame(map, 'start'));
}

function walk(g: GameLogic, path: readonly string[]): Pos {
  let p = g.state.player.pos;
  for (const d of path) p = stepFrom(p, d as never);
  return p;
}

describe('tap to move', () => {
  it('walks to open ground by the shortest path, diagonals allowed', () => {
    const g = logic();
    const plan = planTap(g, { x: 5, y: 3 })!;
    expect(plan.face).toBeNull();
    expect(walk(g, plan.path)).toEqual({ x: 5, y: 3 });
    expect(plan.path.length).toBeLessThanOrEqual(4);
  });

  it('walks up beside a person, then faces them', () => {
    const g = logic();
    const plan = planTap(g, { x: 5, y: 1 })!;
    const end = walk(g, plan.path);
    expect(stepFrom(end, plan.face!)).toEqual({ x: 5, y: 1 });
  });

  it('walks up to a thing to use and faces it; already beside it, just faces it', () => {
    const g = logic();
    const plan = planTap(g, { x: 1, y: 4 })!;
    expect(stepFrom(walk(g, plan.path), plan.face!)).toEqual({ x: 1, y: 4 });
    g.state.player.pos = { x: 1, y: 5 };
    expect(planTap(g, { x: 1, y: 4 })).toEqual({ path: [], face: 'up' });
  });

  it('walks into a door (the door is the goal)', () => {
    const g = logic();
    const plan = planTap(g, { x: 6, y: 5 })!;
    expect(walk(g, plan.path)).toEqual({ x: 6, y: 5 });
  });

  it('does nothing for a wall, a sealed pocket, or the tile underfoot', () => {
    const g = logic();
    expect(planTap(g, { x: 3, y: 2 })).toBeNull();
    expect(planTap(g, { x: 0, y: 0 })).toBeNull();
    expect(planTap(g, { x: 2, y: 5 })).toBeNull();
  });
});
