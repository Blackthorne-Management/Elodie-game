// Conditions used by dialogue lines, choices and branches (and later by quests, shops and puzzles).
// Phase 1 checks flags only; pillar thresholds, prices paid and Concord will be stored as flags or
// added as new condition kinds without changing the dialogue format.

import type { FlagReader } from './flags.ts';
import type { FlagValue } from './types.ts';

export type Condition =
  /** True when the flag is set (truthy). */
  | { flag: string }
  /** True when the flag is unset or falsy. */
  | { notFlag: string }
  /** Exact match. */
  | { flag: string; eq: FlagValue }
  /** Numeric comparisons (a missing flag counts as 0). */
  | { flag: string; gte: number }
  | { flag: string; lte: number }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

function truthy(v: FlagValue | undefined): boolean {
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

function num(v: FlagValue | undefined): number {
  return typeof v === 'number' ? v : 0;
}

export function evaluate(cond: Condition | undefined, flags: FlagReader): boolean {
  if (cond === undefined) return true;
  if ('all' in cond) return cond.all.every((c) => evaluate(c, flags));
  if ('any' in cond) return cond.any.some((c) => evaluate(c, flags));
  if ('not' in cond) return !evaluate(cond.not, flags);
  if ('notFlag' in cond) return !truthy(flags.get(cond.notFlag));
  const value = flags.get(cond.flag);
  if ('eq' in cond) return value === cond.eq;
  if ('gte' in cond) return num(value) >= cond.gte;
  if ('lte' in cond) return num(value) <= cond.lte;
  return truthy(value);
}

/** Every flag a condition reads (used by content checks). */
export function flagsIn(cond: Condition | undefined): string[] {
  if (cond === undefined) return [];
  if ('all' in cond) return cond.all.flatMap(flagsIn);
  if ('any' in cond) return cond.any.flatMap(flagsIn);
  if ('not' in cond) return flagsIn(cond.not);
  if ('notFlag' in cond) return [cond.notFlag];
  return [cond.flag];
}
