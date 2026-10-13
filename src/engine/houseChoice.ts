// Choosing houses (rules-decisions 74). The rule is the blind lottery. Players may pick their houses instead only if
// every player agrees; then everyone rolls a die, the highest roll picks first (ties re-roll) and picking goes on
// clockwise (in seat order) from that player.
import type { HouseId, Pos } from './types';
import type { Rng } from './rng';
import { rollD6, shuffle } from './rng';
import { THRONE } from './board';

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

// Two players choose how to play (rules-decisions 82): 'race' = houses as usual, often far apart, a race to the
// Throne; 'battle' = the two houses are neighbours on the board, so the rivals clash early.
export type TwoPlayerMode = 'race' | 'battle';

// The houses in order clockwise round the board, worked out from where their home tiles sit.
export function houseRing(homes: Record<HouseId, Pos>): HouseId[] {
  const cx = THRONE.reduce((t, q) => t + q.x, 0) / THRONE.length;
  const cy = THRONE.reduce((t, q) => t + q.y, 0) / THRONE.length;
  const angle = (q: Pos) => (Math.atan2(q.x - cx, cy - q.y) + 2 * Math.PI) % (2 * Math.PI);
  return (Object.keys(homes) as HouseId[]).sort((a, b) => angle(homes[a]) - angle(homes[b]));
}

// A house's two neighbours on the board: [anticlockwise, clockwise].
export function neighbours(ring: HouseId[], h: HouseId): [HouseId, HouseId] {
  const i = ring.indexOf(h);
  return [ring[(i + ring.length - 1) % ring.length], ring[(i + 1) % ring.length]];
}

// Deal houses to seats: seats with a pick get it; everyone else draws blind from the houses left.
// Battle (2 players, `ring` given): the second house is one of the first's two neighbours; a die picks which
// (1-3 anticlockwise, 4-6 clockwise) unless a player picked it.
export function dealHouses(all: HouseId[], seats: number, picks: (HouseId | null)[], rng: Rng, ring?: HouseId[]): HouseId[] {
  if (ring && seats === 2) {
    const first = picks[0] ?? picks[1] ?? shuffle(all, rng)[0];
    const firstSeat = picks[0] || !picks[1] ? 0 : 1;
    const other = picks[1 - firstSeat] ?? neighbours(ring, first)[rollD6(rng) <= 3 ? 0 : 1];
    return firstSeat === 0 ? [first, other] : [other, first];
  }
  const taken = new Set(picks.filter((h): h is HouseId => !!h));
  const pool = shuffle(all.filter(h => !taken.has(h)), rng);
  return Array.from({ length: seats }, (_, i) => picks[i] ?? pool.pop()!);
}
