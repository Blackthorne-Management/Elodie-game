import type { ElementType, Move, StatusId, Stats } from './types';
import type { Rng } from './rng';
import { typeMultiplier } from './typeChart';
import { CRIT_MULT, DAMAGE_VARIANCE, DEFENSE_SCALE, STATUS_MULT } from '../config';

export interface StatusInstance { id: StatusId; turns: number; value?: number }

// The battle-time pet.
export interface Combatant {
  key: string;                 // unique within the battle
  side: 'player' | 'enemy';
  name: string;
  type: ElementType;
  maxHp: number;
  hp: number;
  stats: Stats;                // already includes items
  critChance: number;          // 0.1 base
  statuses: StatusInstance[];
  cooldowns: Record<string, number>; // move id -> turns left
  moves: Move[];
  freezeImmune: number;        // turns before it can be frozen again
  actsTwice?: boolean;         // Galebeak: takes a second turn each round
}

const has = (c: Combatant, id: StatusId) => c.statuses.some(s => s.id === id);

export function effectiveStat(c: Combatant, stat: 'attack' | 'defense' | 'speed'): number {
  let v = c.stats[stat];
  if (stat === 'attack') { if (has(c, 'atkUp')) v *= STATUS_MULT.atkUp; if (has(c, 'atkDown')) v *= STATUS_MULT.atkDown; }
  if (stat === 'defense') { if (has(c, 'defUp')) v *= STATUS_MULT.defUp; if (has(c, 'defDown')) v *= STATUS_MULT.defDown; }
  if (stat === 'speed') { if (has(c, 'spdUp')) v *= STATUS_MULT.spdUp; if (has(c, 'chill')) v *= STATUS_MULT.chill; }
  return v;
}

export function calcDamage(a: Combatant, d: Combatant, power: number, rng: Rng) {
  const atk = effectiveStat(a, 'attack');
  const def = effectiveStat(d, 'defense');
  const crit = rng() < a.critChance;
  const variance = 1 - DAMAGE_VARIANCE / 2 + rng() * DAMAGE_VARIANCE;
  const raw = atk * power * (DEFENSE_SCALE / (DEFENSE_SCALE + def)) * typeMultiplier(a.type, d.type) * (crit ? CRIT_MULT : 1) * variance;
  return { amount: Math.max(1, Math.round(raw)), crit };
}
