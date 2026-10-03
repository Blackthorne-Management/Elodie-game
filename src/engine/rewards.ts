import type { SaveState } from './types';
import { floorInfo } from './floors';
import {
  CRYSTALS_PER_FIRST_BOSS_CLEAR, FLOORS_PER_ACT, REPLAY_SPARKS, SPARKS_BASE, SPARKS_MULT, SPARKS_PER_FLOOR,
} from '../config';

export interface WinSummary { sparks: number; crystals: number; firstClear: boolean; actCleared: boolean }

export function sparksForFloor(floor: number): number {
  return Math.round((SPARKS_BASE + SPARKS_PER_FLOOR * floor) * SPARKS_MULT[floorInfo(floor).kind]);
}

// Pays out a win. A floor above highestFloor is a first clear; anything else is a replay.
export function applyWin(s: SaveState, floor: number): { save: SaveState; summary: WinSummary } {
  const { kind } = floorInfo(floor);
  const firstClear = floor > s.highestFloor;
  const sparks = Math.round(sparksForFloor(floor) * (firstClear ? 1 : REPLAY_SPARKS));
  const bossFirst = kind !== 'normal' && !s.firstClears.includes(floor);
  const crystals = bossFirst ? CRYSTALS_PER_FIRST_BOSS_CLEAR : 0;
  const actCleared = firstClear && floor % FLOORS_PER_ACT === 0;
  return {
    summary: { sparks, crystals, firstClear, actCleared },
    save: {
      ...s,
      highestFloor: Math.max(s.highestFloor, floor),
      actsCleared: s.actsCleared + (actCleared ? 1 : 0),
      currency: { ...s.currency, sparks: s.currency.sparks + sparks },
      stormCrystals: s.stormCrystals + crystals,
      firstClears: bossFirst ? [...s.firstClears, floor] : s.firstClears,
    },
  };
}
