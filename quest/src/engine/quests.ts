// Quests and the Journal (guide 6.6): an act is an ordered list of objectives, each done when its
// condition holds. The current objective is the first one not yet done. Journal notes are clues the
// player has found (rule 1 of every puzzle: solvable from what is in the room or in the Journal).

import { evaluate, type Condition } from './conditions.ts';
import type { FlagReader } from './flags.ts';

export interface Objective {
  id: string;
  title: string;
  /** One or two sentences: where to go and why. */
  detail: string;
  done: Condition;
  /** Anissa's hints, from a gentle nudge to the answer (guide 6.2 rule 4). */
  hints: string[];
}

export interface QuestDef {
  id: string;
  title: string;
  /** Maps the quest belongs to (the Journal and hints are quiet elsewhere). */
  maps: readonly string[];
  objectives: Objective[];
}

export interface JournalNote {
  id: string;
  /** Shown once this flag is set. */
  when: string;
  title: string;
  text: string;
}

export function currentObjective(quest: QuestDef, flags: FlagReader): Objective | null {
  return quest.objectives.find((o) => !evaluate(o.done, flags)) ?? null;
}

export interface JournalEntry {
  title: string;
  detail: string;
  state: 'done' | 'current';
}

/** Done objectives, then the current one. Objectives after the current one stay hidden. */
export function journalEntries(quest: QuestDef, flags: FlagReader): JournalEntry[] {
  const out: JournalEntry[] = [];
  for (const o of quest.objectives) {
    const done = evaluate(o.done, flags);
    out.push({ title: o.title, detail: o.detail, state: done ? 'done' : 'current' });
    if (!done) break;
  }
  return out;
}

export function journalNotes(notes: readonly JournalNote[], flags: FlagReader): JournalNote[] {
  return notes.filter((n) => evaluate({ flag: n.when }, flags));
}
