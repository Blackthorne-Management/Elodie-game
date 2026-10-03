// Test-only units. Real content lives in src/data.
import type { Combatant } from '../src/engine/damage';
import type { ElementType, Move, Species, Stats } from '../src/engine/types';

export const basic: Move = {
  id: 'peck', name: 'Peck', slot: 'basic', cooldown: 0,
  effects: [{ kind: 'damage', power: 1, target: 'enemy' }],
};
export const skill: Move = {
  id: 'gust', name: 'Gust', slot: 'skill', cooldown: 3,
  effects: [{ kind: 'damage', power: 0.8, target: 'allEnemies' }],
};
export const mend: Move = {
  id: 'mend', name: 'Mend', slot: 'skill', cooldown: 3,
  effects: [{ kind: 'heal', percent: 0.3, target: 'lowestAlly' }],
};

export function testSpecies(type: ElementType): Species {
  return {
    id: `test-${type}`, names: ['A', 'B', 'C'], type, role: 'attack', rarity: 'common',
    baseStats: { hp: 100, attack: 20, defense: 15, speed: 15 },
    moves: { basic: 'peck', skill: 'gust', ultimate: 'peck' },
    personality: '', favoriteWeather: '',
  };
}

export function makeUnit(
  key: string, side: 'player' | 'enemy', type: ElementType,
  stats: Partial<Stats> = {}, moves: Move[] = [basic, skill],
): Combatant {
  const s: Stats = { hp: 100, attack: 20, defense: 15, speed: 15, ...stats };
  return {
    key, side, name: key, type, maxHp: s.hp, hp: s.hp, stats: s,
    critChance: 0.1, statuses: [], cooldowns: {}, moves, freezeImmune: 0,
  };
}
