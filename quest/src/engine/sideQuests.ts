// Side quests (the menu's Quests page, like a Skyrim quest log): accepted by a choice in a
// conversation (which sets the quest's `accepted` flag), followed step by step, and rewarded once
// when done (gold, XP for the party, items, a pillar in a city). Everything is read from flags, so
// saves need nothing new. Pure TypeScript, unit tested.

import type { Goal } from './guide.ts';
import { evaluate, type Condition } from './conditions.ts';
import type { FlagStore, FlagReader } from './flags.ts';
import { addSharedXp, gold, itemCount, pillarFlag, type Pillar, type RpgContent } from './rpg.ts';

export interface SideQuestStep {
  text: string;
  done: Condition;
  /** Where it is done, for the minimap's side-quest dot (engine/guide.ts). */
  goals?: readonly Goal[];
  /** Inside the Echo, these come first (engine/guide.ts goalNow). */
  echoGoals?: readonly Goal[];
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
  /**
   * Before it is accepted it shows as a mystery quest (owner request, Oct 18: players missed the ones they never
   * stumbled on): in the Quests page while `available` holds, with a dot on the minimap at `start` (the giver),
   * and Anissa's `nudge` among her hints.
   */
  available?: Condition;
  /**
   * A secret quest (SECRET-ITEMS.md: the secret items' quests, found and not pointed to): never a mystery quest (no
   * entry, dot or nudge before it is accepted), and never on the gold arrow's way when a story step follows the side
   * quests (it is optional). Once accepted it is in the log and on the minimap like any other.
   */
  secret?: boolean;
  start?: readonly Goal[];
  nudge?: string;
  /**
   * Where the giver stands once the story has moved them (the first whose `if` holds; owner decision, Oct 19:
   * the cane cutter crosses to the name stones after the lamp): a `place` and a `nudge` instead of the usual.
   */
  moved?: readonly { if: Condition; place: string; nudge?: string }[];
  steps: readonly SideQuestStep[];
  /** The steps can be done in any order: the log shows them all at once. */
  parallel?: boolean;
  /** Holds once it is finished (usually the last step's flag). */
  done: Condition;
  /**
   * The story has moved on without it (review 1, Oct 21, finding 5: a quest must never dangle forever): once this
   * holds, an unfinished quest is over. It leaves the arrows and the mystery list, and the Quests page and the
   * Journal show it closed, with `closedText` saying what became of it.
   */
  closed?: Condition;
  closedText?: string;
  reward: SideQuestReward;
}

export type SideQuestStatus = 'unknown' | 'active' | 'done' | 'closed';

function movedNow(q: SideQuestDef, flags: FlagReader) {
  return q.moved?.find((m) => evaluate(m.if, flags));
}

/** Where the quest's giver is now (the log's "Where"). */
export function questPlace(q: SideQuestDef, flags: FlagReader): string {
  return movedNow(q, flags)?.place ?? q.place;
}

/** Anissa's nudge towards the quest now (it follows the giver when the story moves them). */
export function questNudge(q: SideQuestDef, flags: FlagReader): string | undefined {
  return movedNow(q, flags)?.nudge ?? q.nudge;
}

/** Whether the story has closed the quest (finished or not). */
export function questClosed(q: SideQuestDef, flags: FlagReader): boolean {
  return !!q.closed && evaluate(q.closed, flags);
}

/**
 * Where a quest stands: done once finished (that never changes); closed when the story closed it after it was
 * accepted; a quest closed before it was ever accepted stays unknown (and is never offered again).
 */
export function sideQuestStatus(flags: FlagReader, q: SideQuestDef): SideQuestStatus {
  if (evaluate(q.done, flags)) return 'done';
  const accepted = evaluate(q.accepted, flags);
  if (questClosed(q, flags)) return accepted ? 'closed' : 'unknown';
  return accepted ? 'active' : 'unknown';
}

/** The Journal's lines for quests the story closed unfinished ("Owned or Remembered: The fire is out..."). */
export function closedNotes(quests: readonly SideQuestDef[], flags: FlagReader): { id: string; title: string; text: string }[] {
  return quests.filter((q) => sideQuestStatus(flags, q) === 'closed').map((q) => ({ id: q.id, title: q.title, text: q.closedText ?? 'Closed: the story moved on.' }));
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
