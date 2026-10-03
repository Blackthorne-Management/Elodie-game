import type { Species, Stats } from './types';
import {
  BASE_LEVEL_CAP, LEVEL_CAP_PER_ACT, LEVEL_GROWTH, RARITY_MULT, SPEED_GROWTH, STAGE_MULT, STAR_GROWTH,
} from '../config';

// Turns a species plus level, stage and stars into real numbers.
// Speed grows slowly so turn order stays meaningful.
export function petStats(sp: Species, level: number, stage: 1 | 2 | 3, stars: number): Stats {
  const m = (1 + LEVEL_GROWTH * (level - 1)) * RARITY_MULT[sp.rarity] * STAGE_MULT[stage] * (1 + STAR_GROWTH * (stars - 1));
  return {
    hp: Math.round(sp.baseStats.hp * m),
    attack: Math.round(sp.baseStats.attack * m),
    defense: Math.round(sp.baseStats.defense * m),
    speed: Math.round(sp.baseStats.speed * (1 + SPEED_GROWTH * (level - 1)) * STAGE_MULT[stage]),
  };
}

export const levelCap = (actsCleared: number) => BASE_LEVEL_CAP + LEVEL_CAP_PER_ACT * actsCleared;
export const sparksToLevel = (level: number) => Math.round(20 * Math.pow(level, 1.5));
