// Shared objects the scenes use: parsed maps, the game logic (which holds the game state), input,
// storage and Anissa's hint timer. Created once in main.ts before Phaser starts.

import { SAVE_STORAGE_KEY } from './config.ts';
import type { GameLogic } from './engine/game.ts';
import type { HintTracker } from './engine/hints.ts';
import { writeSave, type StorageLike } from './engine/save.ts';
import { applySave, loadStoredSave, toSaveData } from './engine/state.ts';
import type { GameMap, TiledMap } from './engine/tiledMap.ts';
import type { IntroOpening } from './engine/intro.ts';
import type { InputManager } from './input/actions.ts';

export interface Runtime {
  maps: Record<string, GameMap>;
  rawMaps: Record<string, TiledMap>;
  logic: GameLogic;
  input: InputManager;
  storage: StorageLike | undefined;
  hints: HintTracker;
  /** Where New game starts. */
  start: { map: string; spawn: string };
  /** How the intro opens when the page loads (null: straight into the quest, `?intro=0`). */
  intro: IntroOpening | null;
}

let runtime: Runtime | null = null;

export function setRuntime(r: Runtime): void {
  runtime = r;
}

export function getRuntime(): Runtime {
  if (!runtime) throw new Error('Runtime not initialised');
  return runtime;
}

/** localStorage, or undefined when the browser blocks it. */
export function browserStorage(): StorageLike | undefined {
  try {
    const s = window.localStorage;
    const probe = '__bq_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return undefined;
  }
}

export function saveGame(r: Runtime = getRuntime()): boolean {
  return writeSave(r.storage, SAVE_STORAGE_KEY, toSaveData(r.logic.state, Date.now()));
}

/**
 * Load the stored save into the state: 'none', 'loaded' or 'invalid' (a new game), with what to tell the player
 * (null: nothing) and, for an unreadable save, its text kept on the device (engine/state.ts loadStoredSave).
 */
export function loadStoredGame(r: Runtime): { status: 'none' | 'loaded' | 'invalid'; notice: string | null; kept: string | null } {
  const result = loadStoredSave(r.storage, SAVE_STORAGE_KEY, r.maps);
  if (result.status === 'none') return { status: 'none', notice: null, kept: null };
  if (result.status === 'invalid') return { status: 'invalid', notice: result.notice, kept: result.kept };
  applySave(r.logic.state, result.data);
  r.logic.reset();
  return { status: 'loaded', notice: result.notice, kept: null };
}
