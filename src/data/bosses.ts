import type { Battle } from '../engine/battle';
import type { Combatant } from '../engine/damage';
import type { ElementType, Stats } from '../engine/types';

// A boss is a normal Combatant plus hooks the battle loop calls.
export interface BossDef {
  id: string;                 // 'galebeak'
  name: string;
  region: string;
  type: ElementType;
  speciesStats: Stats;        // before the region-boss multiplier
  moves: string[];            // move ids: basic, skill, ultimate
  onRoundEnd?: (boss: Combatant, b: Battle) => void;   // e.g. Tidemaw's puddles heal it
  actsTwice?: boolean;                                  // Galebeak
}

export const BOSSES: BossDef[] = [
  {
    id: 'galebeak', name: 'Galebeak', region: 'gale', type: 'gale',
    speciesStats: { hp: 95, attack: 15, defense: 15, speed: 22 },
    moves: ['talonSwipe', 'cyclone', 'skyrend'],
    actsTwice: true,
  },
];

// Act twists stack on top of every boss, by Act number
export const ACT_TWISTS: Record<number, string> = {
  2: 'secondPhase',   // at 50% HP: heal to 60% once and gain atkUp
  3: 'startShield',   // starts with a shield worth 20% max HP
  4: 'helpers',       // spawns 2 helpers
  5: 'enrage',        // after round 10: attack x1.5
  6: 'regen',         // permanent regen
  7: 'stealBuff',     // removes one player buff each round
  8: 'rotate',        // uses the twist of Act ((round % 6) + 2)
};
