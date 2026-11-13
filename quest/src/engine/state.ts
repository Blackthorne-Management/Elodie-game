// The game state the field, dialogue and save modules share. The era is part of state from day one
// (guide 6.1) even though Phase 1 never leaves the present.

import { DEFAULT_TEXT_SPEED, SAVE_VERSION } from '../config.ts';
import { FlagStore } from './flags.ts';
import { findSpawn, spriteFacing } from './grid.ts';
import { keepUnreadable, readSave, type SaveData, type SaveSettings, type StorageLike } from './save.ts';
import { placeOnMaps, type SaveFallbacks } from './saveCompat.ts';
import type { GameMap } from './tiledMap.ts';
import type { Dir8, Era, Pos } from './types.ts';
import { isOpen } from './world.ts';

export interface PlayerState {
  mapId: string;
  pos: Pos;
  /** Eight directions while playing; saves keep the sprite facing (one of four), so codes stay version 2. */
  facing: Dir8;
  era: Era;
}

export interface GameState {
  player: PlayerState;
  flags: FlagStore;
  settings: SaveSettings;
}

export function newGame(map: GameMap, spawnId: string): GameState {
  const spawn = findSpawn(map, spawnId) ?? map.spawns[0];
  if (!spawn) throw new Error(`Map ${map.id} has no spawn`);
  return {
    player: { mapId: map.id, pos: { ...spawn.pos }, facing: spawn.facing, era: spawn.era },
    flags: new FlagStore(),
    settings: { textSpeed: DEFAULT_TEXT_SPEED, hints: true },
  };
}

export function toSaveData(state: GameState, savedAt: number): SaveData {
  return {
    version: SAVE_VERSION,
    mapId: state.player.mapId,
    x: state.player.pos.x,
    y: state.player.pos.y,
    facing: spriteFacing(state.player.facing),
    era: state.player.era,
    flags: state.flags.snapshot(),
    settings: { ...state.settings },
    savedAt,
  };
}

/** Apply a save to an existing state (keeps the same FlagStore so listeners stay attached). */
export function applySave(state: GameState, data: SaveData): void {
  state.player = { mapId: data.mapId, pos: { x: data.x, y: data.y }, facing: data.facing, era: data.era };
  state.flags.load(data.flags);
  state.settings = { ...data.settings };
}

/**
 * Whether a save can be placed on the given maps: the map exists and the saved tile is open in the
 * saved era with the saved flags (a lowered bridge counts). A save that fails this falls back to a new
 * game rather than trapping the player in a wall.
 */
export function saveFits(data: SaveData, maps: Readonly<Record<string, GameMap>>): boolean {
  const map = maps[data.mapId];
  return !!map && isOpen(map, data.era, { x: data.x, y: data.y }, new FlagStore(data.flags));
}

/**
 * Where a save goes on these maps (Claude's call, Oct 28: an old save never traps or loses the player; Nov 13: nor
 * does a fix between sittings). Its own tile when the party can still stand there and leave; else the nearest such
 * tile; else, when its map is gone, the chapter's safe spawn; renamed ids carried over and a pending journey finished
 * on the way (engine/saveCompat.ts). Null only when none of those exists. `moved` says it moved.
 */
export function placeSave(data: SaveData, maps: Readonly<Record<string, GameMap>>, fallbacks: SaveFallbacks = {}): { data: SaveData; moved: boolean } | null {
  return placeOnMaps(data, maps, fallbacks);
}

/** What became of the stored save at boot, and what to tell the player (null: nothing to say). */
export type StoredSaveLoad =
  | { status: 'none' }
  | { status: 'loaded'; data: SaveData; notice: string | null }
  | { status: 'invalid'; notice: string; kept: string | null };

/**
 * Read the stored save for these maps. It never throws: storage that throws (a private tab) reads as no save; a
 * save that cannot be read or placed is kept under `<key>.unreadable` (save.ts keepUnreadable) and reported, and
 * the game starts new; a save that loads with defaults or at a moved spot says so.
 */
export function loadStoredSave(
  storage: StorageLike | undefined,
  key: string,
  maps: Readonly<Record<string, GameMap>>,
  fallbacks: SaveFallbacks = {},
): StoredSaveLoad {
  const result = readSave(storage, key);
  if (!result) return { status: 'none' };
  if (!result.ok) {
    return {
      status: 'invalid',
      notice: `Your saved game could not be read. (${result.error}) A new game has started. The old save is kept on this device: copy its code below if you want to send it for help.`,
      kept: keepUnreadable(storage, key),
    };
  }
  const placed = placeSave(result.data, maps, fallbacks);
  if (!placed) {
    return {
      status: 'invalid',
      notice: 'Your saved game is in a place this version of the quest does not have. A new game has started. The old save is kept on this device: copy its code below if you want to send it for help.',
      kept: keepUnreadable(storage, key),
    };
  }
  const notes: string[] = [];
  if (placed.moved) notes.push('This version changed the spot you saved on, so you are at the nearest way in.');
  if (result.defaulted?.length) notes.push(`Some of your save (${result.defaulted.join(', ')}) came from an older version and was reset.`);
  return { status: 'loaded', data: placed.data, notice: notes.length > 0 ? notes.join(' ') : null };
}
