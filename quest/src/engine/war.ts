// The War of the Harbor's volleys (Chapter 11; COMBAT.md 11; the outline 4.2 with its second review's 3.4). The armies the
// Muster pledged (army.* flags, engine/ally.ts) are a pool of volleys, one for every ARMY_VOLLEY_PER soldiers at sea,
// counted once as the fleet lands. Before each named fight the whistle asks how many (a dialogue choice sets
// war.volleys.<battle id>, at most VOLLEY.cap and at most what is left); the battle opens with that many volleys
// (engine/battle.ts), named by the companies that fire them; a won fight spends them (settleBattle writes
// war.spent.<battle id>), a lost one gives them back. Pure TypeScript over the flag store, unit tested (tests/war.test.ts).
//
// Flags read:  story.war_begun, army.<group>, war.volleys.<battle id>, war.spent.<battle id>
// Flags written: war.volley_pool (once, at the landing), war.volleys_left (after every conversation)

import { ARMY_VOLLEY_PER, VOLLEY } from '../config.ts';
import type { FlagReader, FlagStore } from './flags.ts';
import { armies } from './rpg.ts';

/** A company that answers the whistle: the army flag it stands on (army.<group>) and the name the battle calls it. */
export interface Company {
  army: string;
  name: string;
}

export const VOLLEY_POOL_FLAG = 'war.volley_pool';
export const VOLLEYS_LEFT_FLAG = 'war.volleys_left';
export const volleysFlag = (battle: string) => `war.volleys.${battle}`;
export const spentFlag = (battle: string) => `war.spent.${battle}`;

function num(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}

/** The pool the fleet brought: one volley for every ARMY_VOLLEY_PER soldiers (every army.* flag). */
export function poolFromArmies(flags: FlagReader, keys: readonly string[]): number {
  return Math.floor(armies(flags, keys) / ARMY_VOLLEY_PER);
}

/** Volleys spent in fights won so far. */
export function volleysSpent(flags: FlagReader, keys: readonly string[]): number {
  return keys.filter((k) => k.startsWith('war.spent.')).reduce((n, k) => n + num(flags.get(k)), 0);
}

/** What the pool has left now. */
export function volleysLeft(flags: FlagReader, keys: readonly string[]): number {
  return Math.max(0, num(flags.get(VOLLEY_POOL_FLAG)) - volleysSpent(flags, keys));
}

/**
 * After every conversation (GameContent.afterDialogue): once the fleet has landed, count the pool (once), and write what
 * is left for the whistle's choices to read.
 */
export function warTick(flags: FlagStore): void {
  if (!flags.isSet('story.war_begun')) return;
  const keys = Object.keys(flags.snapshot());
  if (flags.get(VOLLEY_POOL_FLAG) === undefined) flags.set(VOLLEY_POOL_FLAG, poolFromArmies(flags, keys));
  flags.set(VOLLEYS_LEFT_FLAG, volleysLeft(flags, keys));
}

/** The companies with soldiers at sea now, in the order they answer the whistle. */
export function companiesAtSea(flags: FlagReader, companies: readonly Company[]): Company[] {
  return companies.filter((c) => num(flags.get(`army.${c.army}`)) > 0);
}

export interface Volleys {
  count: number;
  /** Who fires each volley, in order (the companies at sea, round again if there are more volleys than companies). */
  names: readonly string[];
}

/** The volleys a fight opens with: what the whistle asked for it (capped), fired by the companies at sea. */
export function volleysFor(flags: FlagReader, battle: { id: string; volleys?: boolean }, companies: readonly Company[]): Volleys {
  if (!battle.volleys) return { count: 0, names: [] };
  const at = companiesAtSea(flags, companies);
  const count = at.length === 0 ? 0 : Math.max(0, Math.min(VOLLEY.cap, Math.floor(num(flags.get(volleysFlag(battle.id))))));
  return { count, names: Array.from({ length: count }, (_, i) => at[i % at.length]!.name) };
}

/** Every flag the war writes from code (warTick and settleBattle), for the content checks. */
export function warFlagsWritten(battles: readonly string[]): string[] {
  return [VOLLEY_POOL_FLAG, VOLLEYS_LEFT_FLAG, ...battles.map(spentFlag)];
}
