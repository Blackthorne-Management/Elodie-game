// Guide Section 9, automated check 2: the solution replayer. Every puzzle ships
// puzzles/<id>/solution.json (inputs) and cheats.json (named input lists). From a fresh save at the
// puzzle, the solution must solve it and no cheat may.

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { evaluate } from '../src/engine/conditions.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { PUZZLES, QUEST_ROOT, loadMaps, puzzleFiles, puzzleSim } from '../tools/sim-setup.ts';

const maps = loadMaps();

describe('every puzzle has a solution and cheats on disk', () => {
  it('the puzzles folder and data/puzzles.ts list the same puzzles', () => {
    const dirs = readdirSync(join(QUEST_ROOT, 'puzzles')).sort();
    expect(dirs).toEqual(PUZZLES.map((p) => p.id).sort());
    for (const p of PUZZLES) {
      expect(existsSync(join(QUEST_ROOT, 'puzzles', p.id, 'solution.json'))).toBe(true);
      expect(existsSync(join(QUEST_ROOT, 'puzzles', p.id, 'cheats.json'))).toBe(true);
    }
  });
});

for (const puzzle of PUZZLES) {
  describe(`puzzle ${puzzle.id}: ${puzzle.title}`, () => {
    const { solution, cheats } = puzzleFiles(puzzle.id);

    it('is not already solved at its start', () => {
      expect(evaluate(puzzle.goal, puzzleSim(puzzle, maps).logic.state.flags)).toBe(false);
    });

    it('solution.json holds plain inputs only (no goto, no markers)', () => {
      expect(parseRoute(solution).every((i) => i.kind === 'press')).toBe(true);
      for (const list of Object.values(cheats)) expect(parseRoute(list).every((i) => i.kind === 'press')).toBe(true);
    });

    it('the solution solves it from a fresh save', () => {
      const sim = puzzleSim(puzzle, maps).run(solution);
      expect(evaluate(puzzle.goal, sim.logic.state.flags)).toBe(true);
      expect(sim.logic.mode).toBe('field');
    });

    it('has at least one cheat', () => {
      expect(Object.keys(cheats).length).toBeGreaterThan(0);
    });

    for (const [name, inputs] of Object.entries(cheats)) {
      it(`cannot be solved by: ${name}`, () => {
        const sim = puzzleSim(puzzle, maps).run(inputs);
        expect(evaluate(puzzle.goal, sim.logic.state.flags)).toBe(false);
      });
    }
  });
}

describe('the bridge puzzle teaches the anchor rule', () => {
  it('the bridgehead memory opens only once the night orders have been read (the act stays in order)', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const early = { ...puzzle, flags: { ...puzzle.flags, 'clue.night_orders': false } };
    const sim = puzzleSim(early, maps).run(['up', 'right*3', 'up', 'echo']);
    expect(sim.logic.era).toBe('present');
    expect(sim.log.at(-1)).toBe('Something old stirs here, but it will not open to you yet.');
  });

  it('lowering without pinning shows the bridge creeping back up, and leaves no memory flag behind', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const sim = puzzleSim(puzzle, maps).run(['up', 'right*3', 'up', 'echo', 'skip', 'confirm', 'skip']);
    expect(sim.logic.state.flags.isSet('echo.chain_bridge_down')).toBe(true);
    expect(sim.logic.isOpen({ x: 31, y: 9 })).toBe(true); // down in the memory
    sim.run(['echo']);
    expect(sim.logic.view()).toMatchObject({ text: expect.stringContaining('still stands raised') });
    sim.run(['skip']);
    const flags = Object.keys(sim.logic.state.flags.snapshot());
    expect(flags.filter((f) => f.startsWith('echo.'))).toEqual([]);
    expect(sim.logic.isOpen({ x: 31, y: 9 })).toBe(false);
  });

  it('the pinned bridge also changes the present plaque, winch and pawl', () => {
    const puzzle = PUZZLES.find((p) => p.id === 'zetwal_bridge')!;
    const sim = puzzleSim(puzzle, maps).run(puzzleFiles(puzzle.id).solution);
    sim.run(['left*4', 'up', 'confirm', 'confirm']); // the plaque at 27,8
    expect(sim.logic.view()).toMatchObject({ text: expect.stringContaining('lowered by his own hand') });
    sim.run(['skip', 'right', 'up', 'confirm']); // the winch at 28,8
    expect(sim.logic.view()).toMatchObject({ text: expect.stringContaining('chain run out across the chasm') });
  });
});
