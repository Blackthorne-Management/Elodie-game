import type { Combatant } from './damage';
import type { Move, Species, Stats } from './types';
import { petStats } from './stats';
import { BASE_CRIT_CHANCE } from '../config';

interface UnitOpts {
  key: string;
  side: 'player' | 'enemy';
  moves: Move[];               // resolved by the caller from src/data
}

// Builds the battle-time unit for a pet. `statMult` scales hp/attack for elites and bosses.
export function petCombatant(
  sp: Species, level: number, stage: 1 | 2 | 3, stars: number,
  opts: UnitOpts & { statMult?: { hp: number; attack: number } },
): Combatant {
  const s = petStats(sp, level, stage, stars);
  return unit(sp.names[stage - 1], sp.type, scale(s, opts.statMult), opts);
}

// Bosses use the same level growth as pets, then the boss multiplier.
export function bossCombatant(
  boss: { name: string; type: Species['type']; speciesStats: Stats; actsTwice?: boolean },
  level: number,
  mult: { hp: number; attack: number },
  opts: UnitOpts,
): Combatant {
  const asSpecies: Species = {
    id: boss.name, names: [boss.name, boss.name, boss.name], type: boss.type, role: 'attack',
    rarity: 'common', baseStats: boss.speciesStats, moves: { basic: '', skill: '', ultimate: '' },
    personality: '', favoriteWeather: '',
  };
  const c = unit(boss.name, boss.type, scale(petStats(asSpecies, level, 1, 1), mult), opts);
  if (boss.actsTwice) c.actsTwice = true;
  return c;
}

function scale(s: Stats, mult?: { hp: number; attack: number }): Stats {
  if (!mult) return s;
  return { ...s, hp: Math.round(s.hp * mult.hp), attack: Math.round(s.attack * mult.attack) };
}

function unit(name: string, type: Species['type'], stats: Stats, opts: UnitOpts): Combatant {
  return {
    key: opts.key, side: opts.side, name, type,
    maxHp: stats.hp, hp: stats.hp, stats,
    critChance: BASE_CRIT_CHANCE, statuses: [], cooldowns: {},
    moves: opts.moves, freezeImmune: 0,
  };
}
