// Shared objects the scenes use: parsed maps, the game state, input and storage. Created once in
// main.ts before Phaser starts.

import { SAVE_STORAGE_KEY } from './config.ts';
import { readSave, writeSave, type StorageLike } from './engine/save.ts';
import { applySave, saveFits, toSaveData, type GameState } from './engine/state.ts';
import type { GameMap, TiledMap } from './engine/tiledMap.ts';
import type { InputManager } from './input/actions.ts';

export interface Runtime {
  maps: Record<string, GameMap>;
  rawMaps: Record<string, TiledMap>;
  state: GameState;
  input: InputManager;
  storage: StorageLike | undefined;
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
  return writeSave(r.storage, SAVE_STORAGE_KEY, toSaveData(r.state, Date.now()));
}

/** Load the stored save into the state. Returns 'none', 'loaded' or 'invalid'. */
export function loadStoredGame(r: Runtime): 'none' | 'loaded' | 'invalid' {
  const result = readSave(r.storage, SAVE_STORAGE_KEY);
  if (!result) return 'none';
  if (!result.ok || !saveFits(result.data, r.maps)) return 'invalid';
  applySave(r.state, result.data);
  return 'loaded';
}
