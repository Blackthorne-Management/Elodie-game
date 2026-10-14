// The game state the field, dialogue and save modules share. The era is part of state from day one
// (guide 6.1) even though Phase 1 never leaves the present.

import { DEFAULT_TEXT_SPEED, SAVE_VERSION } from '../config.ts';
import { FlagStore } from './flags.ts';
import { findSpawn, spriteFacing } from './grid.ts';
import type { SaveData, SaveSettings } from './save.ts';
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
