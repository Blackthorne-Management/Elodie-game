// Choosing houses (rules-decisions 74). The rule is the blind lottery. Players may pick their houses instead only if
// every player agrees; then everyone rolls a die, the highest roll picks first (ties re-roll) and picking goes on
// clockwise (in seat order) from that player.
import type { HouseId } from './types';
import type { Rng } from './rng';
import { rollD6, shuffle } from './rng';

export type HouseChoice = 'lottery' | 'pick';

// One "no" means the lottery.
export const houseChoiceAgreed = (votes: boolean[]) => votes.length > 0 && votes.every(Boolean);

// The order players pick in: roll off for the first pick, then clockwise round the table.
export function pickOrder(seats: number, rng: Rng): { order: number[]; rolls: number[][] } {
  let field = Array.from({ length: seats }, (_, i) => i);
  const rolls: number[][] = [];
  while (field.length > 1) {
    const r = field.map(() => rollD6(rng));
    rolls.push(r);
    const top = Math.max(...r);
    field = field.filter((_, i) => r[i] === top);
  }
  const first = field[0];
  return { order: Array.from({ length: seats }, (_, i) => (first + i) % seats), rolls };
}

// Deal houses to seats: seats with a pick get it; everyone else draws blind from the houses left.
export function dealHouses(all: HouseId[], seats: number, picks: (HouseId | null)[], rng: Rng): HouseId[] {
  const taken = new Set(picks.filter((h): h is HouseId => !!h));
  const pool = shuffle(all.filter(h => !taken.has(h)), rng);
  return Array.from({ length: seats }, (_, i) => picks[i] ?? pool.pop()!);
}
