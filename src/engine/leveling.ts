import type { Pet, SaveState } from './types';
import { levelCap, sparksToLevel } from './stats';
import { EVOLVE } from '../config';

export function canLevel(p: Pet, actsCleared: number, sparks: number) {
  return p.level < levelCap(actsCleared) && sparks >= sparksToLevel(p.level + 1);
}

export function canEvolve(p: Pet, sparks: number, crystals: number) {
  if (p.stage === 3) return false;
  const need = EVOLVE[(p.stage + 1) as 2 | 3];
  return p.level >= need.level && sparks >= need.sparks && crystals >= need.crystals;
}

const withPet = (s: SaveState, uid: string, fn: (p: Pet) => Pet): SaveState =>
  ({ ...s, pets: s.pets.map(p => (p.uid === uid ? fn(p) : p)) });

export function levelUp(s: SaveState, uid: string): SaveState {
  const pet = s.pets.find(p => p.uid === uid);
  if (!pet || !canLevel(pet, s.actsCleared, s.currency.sparks)) return s;
  const cost = sparksToLevel(pet.level + 1);
  return withPet({ ...s, currency: { ...s.currency, sparks: s.currency.sparks - cost } }, uid, p => ({ ...p, level: p.level + 1 }));
}

export function evolve(s: SaveState, uid: string): SaveState {
  const pet = s.pets.find(p => p.uid === uid);
  if (!pet || !canEvolve(pet, s.currency.sparks, s.stormCrystals)) return s;
  const need = EVOLVE[(pet.stage + 1) as 2 | 3];
  return withPet(
    { ...s, currency: { ...s.currency, sparks: s.currency.sparks - need.sparks }, stormCrystals: s.stormCrystals - need.crystals },
    uid, p => ({ ...p, stage: (p.stage + 1) as 2 | 3 }),
  );
}
