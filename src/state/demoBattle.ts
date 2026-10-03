import type { Battle } from '../engine/battle';
import type { Rng } from '../engine/rng';
import { petCombatant } from '../engine/combatant';
import { MOVES } from '../data/moves';
import { SPECIES, speciesById } from '../data/pets';

// A practice fight for the Battle screen until the Dungeon map (milestone 5) builds real ones.
export function demoBattle(rng: Rng): Battle {
  const unitFor = (speciesId: string, key: string, side: 'player' | 'enemy', level: number) => {
    const sp = speciesById(speciesId);
    const moves = [sp.moves.basic, sp.moves.skill, sp.moves.ultimate].map(id => MOVES[id]);
    return petCombatant(sp, level, 1, 1, { key, side, moves });
  };
  const team = ['puffwhisk', 'raindart', 'glimmit', 'brambit'];
  const enemies = Array.from({ length: 4 }, () => SPECIES[Math.floor(rng() * SPECIES.length)].id);
  return {
    round: 0, grace: 0, log: [],
    units: [
      ...enemies.map((id, i) => unitFor(id, `e${i + 1}`, 'enemy', 4)),
      ...team.map((id, i) => unitFor(id, `p${i + 1}`, 'player', 5)),
    ],
  };
}
