import type { Pet, SaveState } from '../engine/types';
import { CURRENT_VERSION } from './save';
import { STARTING_EGGS, STARTING_LEVEL, STARTING_SPARKS } from '../config';

// First draft: start with the five Commons instead of a starter pick.
const STARTERS = ['puffwhisk', 'raindart', 'glimmit', 'brambit', 'shardling'];

export const newUid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function newGame(): SaveState {
  const pets: Pet[] = STARTERS.map(speciesId => ({
    uid: newUid(speciesId), speciesId, level: STARTING_LEVEL, stage: 1, stars: 1, shards: 0, items: {},
  }));
  return {
    version: CURRENT_VERSION,
    pets,
    items: [],
    team: pets.slice(0, 4).map(p => p.uid),
    highestFloor: 0,
    actsCleared: 0,
    currency: { eggs: STARTING_EGGS, sparks: STARTING_SPARKS, eventTokens: 0 },
    stormCrystals: 0,
    pity: { sinceLegendary: 0, sinceRare: 0, sinceUncommon: 0 },
    journal: [...STARTERS],
    firstClears: [],
    daily: { lastLogin: '', streakDay: 0, quests: [] },
    settings: { music: 0.7, sound: 0.7, battleSpeed: 1, textSize: 'normal' },
  };
}
