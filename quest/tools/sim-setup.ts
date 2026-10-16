// Builds a headless game (engine/sim.ts) from the maps on disk and the real content. Used by the
// puzzle replayer tests, the whole-act route test and the Playwright smoke test.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT } from '../src/data/content.ts';
import { PUZZLES, type PuzzleDef } from '../src/data/puzzles.ts';
import { BATTLES } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { battleItems, settleBattle, type Battle } from '../src/engine/battle.ts';
import { GameLogic } from '../src/engine/game.ts';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { Sim } from '../src/engine/sim.ts';
import { applySave, newGame, toSaveData } from '../src/engine/state.ts';
import { parseMap, type GameMap } from '../src/engine/tiledMap.ts';
import { readMapFiles } from './validate-maps.ts';

export const QUEST_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const START = { map: 'zetwal-town', spawn: 'start' };

export function loadMaps(): Record<string, GameMap> {
  return Object.fromEntries(Object.entries(readMapFiles()).map(([id, raw]) => [id, parseMap(id, raw)]));
}

/** A new game, as the browser starts one (on-enter scenes run at once, as the field scene does). */
export function newGameSim(maps: Record<string, GameMap> = loadMaps(), map = START.map, spawn = START.spawn): Sim {
  const sim = new Sim(new GameLogic(maps, CONTENT, newGame(maps[map]!, spawn)));
  enter(sim);
  return sim;
}

/**
 * Battles in a headless run end as a won fight would (the route plays the story, not the fight; the
 * smoke test fights it for real in the browser): the rewards and the won flag, through settleBattle.
 */
function winBattles(sim: Sim): void {
  sim.onBattle = (id) => {
    const def = BATTLES[id];
    if (!def) throw new Error(`No battle "${id}"`);
    const flags = sim.logic.state.flags;
    // settleBattle reads only these fields of a finished fight.
    const won = { def, items: battleItems(flags, RPG), outcome: 'won' } as unknown as Battle;
    settleBattle(flags, RPG, won);
  };
}

function enter(sim: Sim): void {
  winBattles(sim);
  const effects = sim.logic.enterMap();
  if (effects.some((e) => e.kind === 'dialogue')) sim.cursor = 0;
}

/**
 * A puzzle from a fresh save: a new game at the puzzle's spawn with the story flags of that point,
 * written to a save code and read back, exactly as a player loading that save would have it.
 */
export function puzzleSim(puzzle: PuzzleDef, maps: Record<string, GameMap> = loadMaps()): Sim {
  const state = newGame(maps[puzzle.map]!, puzzle.spawn);
  state.flags.load(puzzle.flags);
  const decoded = decodeSave(encodeSave(toSaveData(state, 0)));
  if (!decoded.ok) throw new Error(decoded.error);
  const fresh = newGame(maps[puzzle.map]!, puzzle.spawn);
  applySave(fresh, decoded.data);
  const sim = new Sim(new GameLogic(maps, CONTENT, fresh));
  enter(sim);
  return sim;
}

export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(QUEST_ROOT, path), 'utf8')) as T;
}

export function puzzleFiles(id: string): { solution: string[]; cheats: Record<string, string[]> } {
  return {
    solution: readJson<string[]>(`puzzles/${id}/solution.json`),
    cheats: readJson<Record<string, string[]>>(`puzzles/${id}/cheats.json`),
  };
}

export { PUZZLES };
