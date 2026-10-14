// Eight-direction movement in the shared game logic (engine/game.ts) and on the real maps, plus what
// the player is shown about the world: name labels, inspect lines, interaction markers and the
// changes an anchor carries back from the Echo.

import { describe, expect, it } from 'vitest';
import { validationContext } from '../src/data/content.ts';
import type { GameContent } from '../src/engine/content.ts';
import type { DialogueScript } from '../src/engine/dialogue.ts';
import { GameLogic, seenFlag, type Effect } from '../src/engine/game.ts';
import { components, isDiagonal, stepFrom } from '../src/engine/grid.ts';
import { validateMap } from '../src/engine/mapValidation.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim, findPath, parseRoute } from '../src/engine/sim.ts';
import { newGame, toSaveData } from '../src/engine/state.ts';
import { parseMap, type GameMap } from '../src/engine/tiledMap.ts';
import { DIRS, DIRS8, ERAS, type Dir8, type Era, type Pos } from '../src/engine/types.ts';
import { isOpen } from '../src/engine/world.ts';
import { PUZZLES, loadMaps, puzzleFiles, puzzleSim } from '../tools/sim-setup.ts';
import { makeMap, obj } from './helpers.ts';

const say = (id: string, text: string, set?: Record<string, boolean>): DialogueScript => ({
  id,
  start: 'a',
  nodes: { a: { lines: [{ text, set }] } },
});

const content: GameContent = {
  npcs: { guard: { id: 'guard', look: 'x', dialogue: 'guard', name: 'Guard' } },
  dialogue: Object.fromEntries(
    [
      say('guard', 'Halt.', { 'met.guard': true }),
      say('step', 'You stepped on it.'),
      {
        id: 'ask',
        start: 'a',
        nodes: {
          a: { lines: [{ text: 'Help?' }], choices: [{ text: 'No.' }, { text: 'Yes.', next: 'b' }] },
          b: { lines: [{ text: 'Thanks.', set: { 'helped': true } }] },
        },
      } satisfies DialogueScript,
    ].map((d) => [d.id, d]),
  ),
  speakers: {},
  cards: [],
  messages: { noZone: 'NO_ZONE', locked: 'LOCKED', blocked: 'BLOCKED', doorInEcho: 'DOOR', enterEcho: 'IN', leaveEcho: 'OUT' },
  objects: { statue: { name: 'Statue', inspect: 'A statue of nobody.' }, well: { name: 'Well' } },
  doors: { 'w/d': 'Cellar' },
};

// 7 x 5:  . . . . . . .
//         . # . D . . .     the door stands free at 3,1
//         . . . . . . G     the guard at 6,2
//         . . . # . T .     a step trigger at 5,3
//         . . . . . . S     the statue at 6,4 (solid, with an inspect line)
function world(): GameMap {
  return parseMap(
    'w',
    makeMap({
      present: ['.......', '.#.....', '.......', '...#...', '.......'],
      objects: {
        spawns: [obj('start', 0, 4)],
        doors: [obj('d', 3, 1, { target: 'd', exit: 'down' })],
        npcs: [obj('g', 6, 2, { npc: 'guard', facing: 'left' })],
        triggers: [obj('t', 5, 3, { dialogue: 'step', flag: 't.seen', once: true })],
        puzzle_objects: [obj('statue', 6, 4, { solid: true, kind: 'shrine' }), obj('well', 0, 0, { dialogue: 'ask' })],
      },
    }),
  );
}

function logic(at: Pos, facing: Dir8 = 'down'): GameLogic {
  const map = world();
  const g = new GameLogic({ w: map }, content, newGame(map, 'start'));
  g.state.player.pos = { ...at };
  g.state.player.facing = facing;
  return g;
}

const kinds = (effects: Effect[]) => effects.map((e) => e.kind);

describe('diagonal steps in the game logic', () => {
  it('steps diagonally and faces that way', () => {
    const g = logic({ x: 4, y: 1 });
    expect(g.tryStep('down-right')).toEqual({ ok: true, to: { x: 5, y: 2 } });
    expect(g.state.player.facing).toBe('down-right');
  });

  it('refuses to cut a corner; held input slides along the wall instead', () => {
    // 2,3 up-right to 3,2: the wall at 3,3 is a straight neighbour.
    const strict = logic({ x: 2, y: 3 });
    expect(strict.tryStep('up-right')).toEqual({ ok: false, reason: 'corner' });
    expect(strict.state.player.facing).toBe('up-right');
    const slide = logic({ x: 2, y: 3 });
    // The horizontal part (3,3) is the wall, so it slides up.
    expect(slide.tryStep('up-right', true)).toEqual({ ok: true, to: { x: 2, y: 2 } });
    expect(slide.state.player.facing).toBe('up');
    // Into the wall itself: slides right along it.
    const along = logic({ x: 2, y: 4 });
    expect(along.tryStep('up-right', true)).toEqual({ ok: true, to: { x: 3, y: 4 } });
    expect(along.state.player.facing).toBe('right');
  });

  it('refuses to slip past a character on a straight neighbour', () => {
    const g = logic({ x: 5, y: 1 });
    // 5,1 to 6,... : down-right lands on the guard; from 6,1 down-left passes beside him.
    expect(g.tryStep('down-right')).toEqual({ ok: false, reason: 'occupied' });
    g.state.player.pos = { x: 6, y: 1 };
    expect(g.tryStep('down-left')).toEqual({ ok: false, reason: 'corner' });
  });

  it('a diagonal step into a door goes through it (when the corner rule allows the step)', () => {
    const g = logic({ x: 2, y: 2 });
    const step = g.tryStep('up-right');
    expect(step).toEqual({ ok: true, to: { x: 3, y: 1 } });
    expect(kinds(g.finishStep({ x: 3, y: 1 }))).toEqual(['map', 'save']);
    expect(g.state.player.pos).toEqual({ x: 3, y: 2 }); // out of the paired door, facing its exit
    expect(g.state.player.facing).toBe('down');
  });

  it('inside the memory a door refuses a diagonal step too', () => {
    const g = logic({ x: 2, y: 2 });
    g.state.player.era = 'echo';
    expect(g.tryStep('up-right')).toEqual({ ok: false, reason: 'door_in_echo' });
  });

  it('a trigger fires when it is reached diagonally', () => {
    const g = logic({ x: 4, y: 2 });
    expect(g.tryStep('down-right')).toEqual({ ok: true, to: { x: 5, y: 3 } });
    expect(kinds(g.finishStep({ x: 5, y: 3 }))).toEqual(['dialogue']);
    expect(g.view()).toMatchObject({ text: 'You stepped on it.' });
    expect(g.state.flags.isSet('t.seen')).toBe(true);
  });

  it('the simulator presses diagonals and slides like the scene', () => {
    const map = world();
    const sim = new Sim(new GameLogic({ w: map }, content, newGame(map, 'start')));
    sim.run(['up-right*2', 'up-right']);
    // 0,4 -> 1,3 -> 2,2; then 3,1 is the door (2,1 and 3,2 open) and it leads back out to 3,2.
    expect(sim.logic.state.player.pos).toEqual({ x: 3, y: 2 });
    expect(parseRoute(['down-left*3'])).toEqual([{ kind: 'press', cmd: 'down-left', count: 3 }]);
    expect(() => parseRoute(['up-up'])).toThrow();
  });
});

describe('facing, talking and looking', () => {
  it('talks to the person on the diagonal tile', () => {
    const g = logic({ x: 5, y: 1 }, 'down-right');
    const effects = g.interact();
    expect(kinds(effects)).toEqual(['talk', 'dialogue']);
    expect(g.view()).toMatchObject({ text: 'Halt.' });
  });

  it('with nothing on the diagonal tile, uses the tile the sprite faces', () => {
    // 5,4 facing up-right: 6,3 is empty, the sprite faces right, at the statue on 6,4.
    const g = logic({ x: 5, y: 4 }, 'up-right');
    expect(kinds(g.interact())).toEqual(['dialogue']);
    expect(g.view()).toMatchObject({ kind: 'line', speaker: null, text: 'A statue of nobody.' });
  });

  it('an object with no dialogue shows its inspect line and is then marked seen', () => {
    const g = logic({ x: 5, y: 4 }, 'right');
    expect(g.markers().map((m) => m.id)).toContain('obj:statue');
    g.interact();
    g.advance();
    expect(g.mode).toBe('field');
    expect(g.state.flags.isSet(seenFlag('w', 'statue'))).toBe(true);
    expect(g.markers().map((m) => m.id)).not.toContain('obj:statue');
  });

  it('names what the player faces: people, objects and doors', () => {
    expect(logic({ x: 5, y: 2 }, 'right').targetAhead()).toMatchObject({ kind: 'npc', name: 'Guard' });
    expect(logic({ x: 5, y: 4 }, 'right').targetAhead()).toMatchObject({ kind: 'object', name: 'Statue' });
    expect(logic({ x: 3, y: 2 }, 'up').targetAhead()).toMatchObject({ kind: 'door', name: 'Cellar' });
    expect(logic({ x: 2, y: 2 }, 'up-right').targetAhead()).toMatchObject({ kind: 'door', name: 'Cellar' });
    expect(logic({ x: 2, y: 2 }, 'down').targetAhead()).toBeNull();
    const echo = logic({ x: 3, y: 2 }, 'up');
    echo.state.player.era = 'echo';
    expect(echo.targetAhead()).toBeNull(); // doors do not work (or show) in the memory
  });

  it('marks people with something new to say until they have said it', () => {
    const g = logic({ x: 5, y: 2 }, 'right');
    expect(g.markers().find((m) => m.id.startsWith('npc:'))).toMatchObject({ kind: 'talk', pos: { x: 6, y: 2 } });
    g.interact();
    g.advance();
    expect(g.markers().some((m) => m.id.startsWith('npc:'))).toBe(false);
  });

  it('counts news down any choice, and objects keep their marker while news is left', () => {
    const g = logic({ x: 1, y: 0 }, 'left');
    expect(g.hasNews('ask')).toBe(true);
    g.interact();
    g.choose(0); // "No."
    expect(g.mode).toBe('field');
    expect(g.state.flags.isSet(seenFlag('w', 'well'))).toBe(true);
    expect(g.markers().map((m) => m.id)).toContain('obj:well'); // "Yes." would still set a flag
    g.interact();
    g.choose(1);
    g.advance();
    expect(g.hasNews('ask')).toBe(false);
    expect(g.markers().map((m) => m.id)).not.toContain('obj:well');
  });

  it('saves keep the sprite facing (codes stay version 2)', () => {
    const g = logic({ x: 2, y: 2 }, 'up-left');
    const decoded = decodeSave(encodeSave(toSaveData(g.state, 0)));
    expect(decoded.ok && decoded.data.facing).toBe('left');
  });
});

describe('the real maps', () => {
  const maps = loadMaps();

  /** Tiles reachable from `start` by straight steps, or also by legal diagonal steps. */
  function reach(map: GameMap, era: Era, start: Pos, diagonal: boolean): Set<string> {
    const open = (p: Pos) => isOpen(map, era, p, { isSet: () => false, get: () => undefined } as never);
    const seen = new Set([`${start.x},${start.y}`]);
    const queue = [start];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      for (const d of diagonal ? DIRS8 : DIRS) {
        const next = stepFrom(cur, d);
        const key = `${next.x},${next.y}`;
        if (seen.has(key) || !open(next)) continue;
        if (isDiagonal(d) && !components(d).every((part) => open(stepFrom(cur, part)))) continue;
        seen.add(key);
        queue.push(next);
      }
    }
    return seen;
  }

  it('diagonal steps never reach a tile straight steps cannot, on any map, in either era', () => {
    for (const map of Object.values(maps)) {
      for (const era of ERAS) {
        const starts = [...map.spawns.map((s) => s.pos), ...map.echoZones.map((z) => ({ x: z.area.x, y: z.area.y }))];
        for (const start of starts) {
          expect([...reach(map, era, start, true)].sort(), `${map.id} ${era} from ${start.x},${start.y}`).toEqual(
            [...reach(map, era, start, false)].sort(),
          );
        }
      }
    }
  });

  it('a diagonal walk is never longer than a straight one, and replays to the goal', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const goal = { x: 26, y: 4 };
    const straight = findPath(puzzleSim(puzzle, maps).logic, goal)!;
    const sim = puzzleSim(puzzle, maps);
    const diagonal = findPath(sim.logic, goal, true)!;
    expect(diagonal.length).toBeLessThan(straight.length);
    expect(diagonal.some(isDiagonal)).toBe(true);
    for (const d of diagonal) sim.press(d);
    expect(sim.logic.state.player.pos).toEqual(goal);
  });

  it('pinning the pawl in the Echo makes the bridge and the pawl glow on the way back', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const solution = puzzleFiles(puzzle.id).solution;
    const sim = puzzleSim(puzzle, maps).run(solution.slice(0, solution.indexOf('echo', solution.indexOf('echo') + 1)));
    expect(sim.logic.era).toBe('echo');
    const back = sim.logic.swap();
    expect(back.find((e) => e.kind === 'changed')).toEqual({ kind: 'changed', objects: ['pawl_pinned', 'chain_bridge'], flags: ['anchor.chain_bridge'] });
  });

  it('a visit that changes nothing carries no glow back', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const sim = puzzleSim(puzzle, maps).run(['up', 'right*3', 'up', 'echo', 'skip', 'confirm', 'skip']);
    expect(sim.logic.swap().some((e) => e.kind === 'changed')).toBe(false);
  });

  it('the validator rules out a diagonal slipping between two triggers that touch at a corner', () => {
    const raw = makeMap({
      present: ['....', '....', '....', '....'],
      objects: {
        triggers: [obj('a', 1, 1, { dialogue: 'x', flag: 'a', once: true }), obj('b', 2, 2, { dialogue: 'x', flag: 'b', once: true })],
      },
    });
    const errors = validateMap('slip', raw, { ...validationContext(), dialogueIds: ['x'] });
    expect(errors.some((e) => e.includes('slips between triggers "a" and "b"'))).toBe(true);
  });
});
