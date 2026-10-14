// Side quests (the menu's Quests page, like a Skyrim quest log): accepted by a choice in a
// conversation (which sets the quest's `accepted` flag), followed step by step, and rewarded once
// when done (gold, XP for the party, items, a pillar in a city). Everything is read from flags, so
// saves need nothing new. Pure TypeScript, unit tested.

import { evaluate, type Condition } from './conditions.ts';
import type { FlagStore, FlagReader } from './flags.ts';
import { addSharedXp, gold, itemCount, pillarFlag, type Pillar, type RpgContent } from './rpg.ts';

export interface SideQuestStep {
  text: string;
  done: Condition;
}

export interface SideQuestReward {
  gold?: number;
  xp?: number;
  items?: readonly { id: string; n: number }[];
  pillar?: { pillar: Pillar; city: string; amount: number };
}

export interface SideQuestDef {
  id: string;
  title: string;
  /** Who gives it, and where (shown in the log). */
  giver: string;
  place: string;
  /** The level the quest is pitched at (coloured against the party's). */
  level: number;
  summary: string;
  /** Holds once the player has accepted it. */
  accepted: Condition;
  steps: readonly SideQuestStep[];
  /** The steps can be done in any order: the log shows them all at once. */
  parallel?: boolean;
  /** Holds once it is finished (usually the last step's flag). */
  done: Condition;
  reward: SideQuestReward;
}

export type SideQuestStatus = 'unknown' | 'active' | 'done';

export function sideQuestStatus(flags: FlagReader, q: SideQuestDef): SideQuestStatus {
  if (evaluate(q.done, flags)) return 'done';
  return evaluate(q.accepted, flags) ? 'active' : 'unknown';
}

/** The steps the log shows: every finished one, then the current one (later steps stay hidden). */
export function visibleSteps(flags: FlagReader, q: SideQuestDef): { text: string; done: boolean }[] {
  const out: { text: string; done: boolean }[] = [];
  for (const s of q.steps) {
    const done = evaluate(s.done, flags);
    out.push({ text: s.text, done });
    if (!done && !q.parallel) break;
  }
  return out;
}

export function rewardFlag(q: SideQuestDef): string {
  return `side.${q.id}.rewarded`;
}

/** The reward as one line ("+80 gold, +60 XP, Sun-stitched charm"). */
export function rewardText(q: SideQuestDef, rpg: RpgContent): string {
  const r = q.reward;
  const bits: string[] = [];
  if (r.gold) bits.push(`+${r.gold} gold`);
  if (r.xp) bits.push(`+${r.xp} XP`);
  for (const it of r.items ?? []) bits.push(`${rpg.items[it.id]?.name ?? it.id}${it.n > 1 ? ` x${it.n}` : ''}`);
  if (r.pillar) bits.push(`+${r.pillar.amount} ${r.pillar.pillar}`);
  return bits.join(', ');
}

/**
 * Pay the reward of every finished quest not paid yet (once each). Items go in the bag even when it is
 * full (a reward is never lost). Returns the quests paid, for a toast.
 */
export function settleRewards(flags: FlagStore, rpg: RpgContent, quests: readonly SideQuestDef[]): SideQuestDef[] {
  const paid: SideQuestDef[] = [];
  for (const q of quests) {
    if (sideQuestStatus(flags, q) !== 'done' || flags.isSet(rewardFlag(q))) continue;
    const r = q.reward;
    if (r.gold) flags.set('gold', gold(flags, rpg) + r.gold);
    if (r.xp) addSharedXp(flags, r.xp);
    for (const it of r.items ?? []) {
      const def = rpg.items[it.id];
      if (def) flags.set(`item.${it.id}`, def.kind === 'key' ? true : itemCount(flags, it.id) + it.n);
    }
    if (r.pillar) {
      const f = pillarFlag(r.pillar.pillar, r.pillar.city);
      const v = flags.get(f);
      flags.set(f, (typeof v === 'number' ? v : 0) + r.pillar.amount);
    }
    flags.set(rewardFlag(q), true);
    paid.push(q);
  }
  return paid;
}
