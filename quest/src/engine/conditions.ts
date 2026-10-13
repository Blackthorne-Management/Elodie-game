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

/** Flag names: letters, digits, `_`, `-` and `.` (namespaces such as `story.`, `echo.`, `anchor.`). */
const FLAG_NAME = /^[A-Za-z0-9_.-]+$/;

export type ParsedCondition = { ok: true; cond: Condition | undefined } | { ok: false; error: string };

/**
 * The short condition text used in Tiled custom properties (`if`), where a JSON object would be awkward:
 * terms separated by commas must all hold; a term may list alternatives with `|`; `!` negates a flag.
 *   "item.sun_locket"                      the flag is set
 *   "story.met, !story.left"               met and not left
 *   "echo.bridge_down|anchor.bridge"       either one
 * Empty text means "always".
 */
export function parseConditionText(text: string): ParsedCondition {
  const trimmed = text.trim();
  if (trimmed === '') return { ok: true, cond: undefined };
  const all: Condition[] = [];
  for (const term of trimmed.split(',')) {
    const any: Condition[] = [];
    for (const raw of term.split('|')) {
      const atom = raw.trim();
      const negated = atom.startsWith('!');
      const name = negated ? atom.slice(1).trim() : atom;
      if (!FLAG_NAME.test(name)) return { ok: false, error: `bad flag name "${atom}" in condition "${text}"` };
      any.push(negated ? { notFlag: name } : { flag: name });
    }
    all.push(any.length === 1 ? any[0]! : { any });
  }
  return { ok: true, cond: all.length === 1 ? all[0] : { all } };
}
