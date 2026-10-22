// Accord Stability (Chapter 12, the Claim and the Hearing; the outline 4.2 as its second review's 3.5 recalibrated it):
// one pure score from what the player did across the whole game, the inputs recorded as flags by the chapters that made
// them (Chapter 11 wrote stability.*; the Muster wrote army.* and muster.*; the Yields wrote choice.*; the Claim and the
// Hearing write claim.* and hearing.*). Every number is a dial in config.ts STABILITY. The score is shown once, after
// the verdict (a realm is not a meter); the ending follows it: Iron on an execution, Just on a pardon with the score at
// STABILITY.just or more, else Hollow. Pure TypeScript; tests/stability.test.ts plays the five canonical saves.

import { STABILITY } from '../config.ts';
import type { FlagReader, FlagStore } from './flags.ts';

/** The houses the score reads (data/claim.ts): the four that could sail to the Crown, and the chairs set by token. */
export interface StabilityHouses {
  flank: readonly string[];
  /** Chairs filled by a token on the night before the Claim (Se-5): a bare one is `seat.bare.<house>`. */
  tokenChairs: readonly string[];
}

export type Ending = 'just' | 'hollow' | 'iron';

/** One input to the score: what it is and what it gives (positive or negative). */
export interface StabilityPart {
  id: string;
  value: number;
}

function set(flags: FlagReader, name: string): boolean {
  const v = flags.get(name);
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

function num(flags: FlagReader, name: string, otherwise = 0): number {
  const v = flags.get(name);
  return typeof v === 'number' ? v : otherwise;
}

/** Every input that counts on this save, in the table's order (zero inputs left out). */
export function stabilityParts(flags: FlagReader, houses: StabilityHouses): StabilityPart[] {
  const S = STABILITY;
  const out: StabilityPart[] = [];
  const add = (id: string, value: number, when = true) => {
    if (when && value !== 0) out.push({ id, value });
  };
  // Allied houses kept: the army sailed with the fleet; a house that turned at the Muster stood instead.
  for (const h of houses.flank) {
    if (num(flags, `army.${h}`) > 0) add(`house.${h}`, S.houseKept);
    else if (set(flags, 'muster.turned') && set(flags, `muster.betrayer.${h}`)) add(`house.${h}`, S.houseTurned);
  }
  // The Unpaid Debt.
  add('xaragua_freed', S.xaraguaFreed, set(flags, 'stability.xaragua_freed'));
  add('elders_agreed', S.eldersAgreed, set(flags, 'stability.elders_agreed'));
  add('xaragua_ally', S.xaraguaAlly, set(flags, 'ally.xaragua'));
  add('seventh_ribbon', S.seventhRibbon, set(flags, 'item.seventh_ribbon'));
  // The Harbor Turn.
  add('harbor_trust', S.harborTrust, set(flags, 'stability.harbor_trust'));
  add('harbor_strike', S.harborStrike, set(flags, 'stability.harbor_strike'));
  add('fleet_struck', S.fleetStruck, set(flags, 'stability.fleet_struck'));
  add('fleet_escaped', S.fleetEscaped, set(flags, 'stability.fleet_escaped'));
  // The Hearing.
  add('pardon', S.pardon, set(flags, 'hearing.pardon'));
  add('exile', S.exile, set(flags, 'hearing.exile'));
  add('execution', S.execution, set(flags, 'hearing.execution'));
  // Concord.
  const concord = num(flags, 'concord', 50);
  add('concord', Math.max(-S.concordMax, Math.min(S.concordMax, Math.round((concord - S.concordFrom) / S.concordPer))));
  // The Claim.
  add('share', S.share, set(flags, 'claim.azzy_share'));
  add('renounce', S.renounce, set(flags, 'claim.azzy_renounced'));
  add('challenge', S.challenge, set(flags, 'claim.azzy_challenged'));
  // The chairs (set on the night before the Claim; a bare one is remembered by house).
  const bare = houses.tokenChairs.filter((h) => set(flags, `seat.bare.${h}`));
  if (set(flags, 'side.seats.done') && bare.length === 0) add('every_chair', S.everyChair);
  for (const h of bare) add(`bare.${h}`, S.bareChair);
  // The Yields.
  for (const y of ['thorne', 'flank', 'hushed']) {
    const kept = y === 'hushed' ? 'tried' : 'spared';
    const broken = y === 'flank' ? 'bound' : 'broken';
    add(`yield.${y}`, S.yieldKept, set(flags, `choice.${y}_${kept}`));
    add(`yield.${y}`, S.yieldBroken, set(flags, `choice.${y}_${broken}`));
  }
  for (const b of ['grimvald', 'fox', 'dhanraj']) add(`spared.${b}`, S.bossSpared, set(flags, `choice.${b}_spared`));
  return out;
}

/** The score, 0 to 100. */
export function stability(flags: FlagReader, houses: StabilityHouses): number {
  const sum = STABILITY.start + stabilityParts(flags, houses).reduce((n, p) => n + p.value, 0);
  return Math.max(0, Math.min(100, sum));
}

/** The ending the verdict and the score give; null before the verdict. */
export function ending(flags: FlagReader, houses: StabilityHouses): Ending | null {
  if (set(flags, 'hearing.execution')) return 'iron';
  if (set(flags, 'hearing.pardon')) return stability(flags, houses) >= STABILITY.just ? 'just' : 'hollow';
  if (set(flags, 'hearing.exile')) return 'hollow';
  return null;
}

/**
 * What strained the realm most (the Hollow card names them, the second review's 3.5): the costliest inputs, worst first,
 * by the ids the card's lines read (`ending.cost.<id>`).
 */
export function costliest(flags: FlagReader, houses: StabilityHouses, n: number = STABILITY.hollowLines): string[] {
  return stabilityParts(flags, houses)
    .filter((p) => p.value < 0)
    .sort((a, b) => a.value - b.value)
    .map((p) => p.id)
    .filter((id, i, all) => all.indexOf(id) === i)
    .slice(0, n);
}

export const STABILITY_SCORE_FLAG = 'stability.score';
export const ENDING_FLAG_PREFIX = 'ending.';

/**
 * After every conversation (data/content.ts afterDialogue): once the verdict is given, the score and the ending are written
 * as flags the ending's scene, its card and the Journal read (once: the ending never changes after it is written).
 */
export function stabilityTick(flags: FlagStore, houses: StabilityHouses): void {
  const end = ending(flags, houses);
  if (!end || flags.isSet(`${ENDING_FLAG_PREFIX}${end}`) || ['just', 'hollow', 'iron'].some((e) => flags.isSet(`${ENDING_FLAG_PREFIX}${e}`))) return;
  flags.set(STABILITY_SCORE_FLAG, stability(flags, houses));
  flags.set(`${ENDING_FLAG_PREFIX}${end}`, true);
  if (end === 'hollow') {
    const costs = costliest(flags, houses);
    for (const id of costs) flags.set(`${ENDING_FLAG_PREFIX}cost.${id}`, true);
    if (costs.length === 0) flags.set(`${ENDING_FLAG_PREFIX}cost.none`, true);
  }
}

/** Every flag stabilityTick can write (the content test's "every flag read is set somewhere"). */
export function stabilityFlagsWritten(houses: StabilityHouses): string[] {
  const costs = [
    'harbor_strike',
    'fleet_escaped',
    'execution',
    'challenge',
    'concord',
    'yield.thorne',
    'yield.flank',
    'yield.hushed',
    'none',
    ...houses.tokenChairs.map((h) => `bare.${h}`),
  ];
  return [STABILITY_SCORE_FLAG, ...(['just', 'hollow', 'iron'] as const).map((e) => `${ENDING_FLAG_PREFIX}${e}`), ...costs.map((c) => `${ENDING_FLAG_PREFIX}cost.${c}`)];
}
