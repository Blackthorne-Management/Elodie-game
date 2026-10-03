import type { Battle } from '../engine/battle';
import type { Combatant } from '../engine/damage';
import type { Rng } from '../engine/rng';
import type { SaveState, Species } from '../engine/types';
import { bossCombatant, petCombatant } from '../engine/combatant';
import { floorInfo } from '../engine/floors';
import { MOVES } from '../data/moves';
import { SPECIES, speciesById } from '../data/pets';
import { BOSSES } from '../data/bosses';
import { BOSS_MULT, ELITE_MULT } from '../config';

const movesOf = (sp: Species) => [sp.moves.basic, sp.moves.skill, sp.moves.ultimate].map(id => MOVES[id]);
const pick = <T,>(list: T[], rng: Rng) => list[Math.floor(rng() * list.length)];

export function playerUnits(save: SaveState): Combatant[] {
  return save.team
    .map(uid => save.pets.find(p => p.uid === uid))
    .filter(p => p !== undefined)
    .map((p, i) => {
      const sp = speciesById(p.speciesId);
      return petCombatant(sp, p.level, p.stage, p.stars, { key: `p${i + 1}`, side: 'player', moves: movesOf(sp) });
    });
}

// Builds the enemy team for any floor. With only five species so far, normal floors
// mix the region's type with random others so fights are not four copies of one pet.
export function enemyUnits(floor: number, rng: Rng): Combatant[] {
  const { region, kind, enemyLevel } = floorInfo(floor);
  const native = region === 'eye' ? SPECIES : SPECIES.filter(s => s.type === region);
  const pool = native.length ? native : SPECIES;
  const normal = (i: number, from: Species[]) => {
    const sp = pick(from, rng);
    return petCombatant(sp, enemyLevel, 1, 1, { key: `e${i}`, side: 'enemy', moves: movesOf(sp) });
  };

  if (kind === 'normal') return [normal(1, pool), normal(2, pool), normal(3, SPECIES), normal(4, SPECIES)];

  if (kind === 'miniBoss') {
    const sp = pick(pool, rng);
    const elite = petCombatant(sp, enemyLevel, 1, 1, { key: 'e1', side: 'enemy', moves: movesOf(sp), statMult: ELITE_MULT });
    elite.name = `Elite ${elite.name}`;
    return [normal(2, SPECIES), elite, normal(3, SPECIES)];
  }

  const def = BOSSES.find(b => b.region === region);
  if (def) {
    return [bossCombatant(def, enemyLevel, BOSS_MULT, { key: 'boss', side: 'enemy', moves: def.moves.map(id => MOVES[id]) })];
  }
  // Regions without a boss yet get a giant of their type.
  const sp = pick(pool, rng);
  const giant = petCombatant(sp, enemyLevel, 1, 1, { key: 'boss', side: 'enemy', moves: movesOf(sp), statMult: BOSS_MULT });
  giant.name = `Great ${giant.name}`;
  return [giant];
}

export function buildFloor(save: SaveState, floor: number, rng: Rng): Battle {
  return { round: 0, grace: 0, log: [], units: [...enemyUnits(floor, rng), ...playerUnits(save)] };
}
