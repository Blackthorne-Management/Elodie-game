// Quest arrows (owner request, Oct 17): where the story wants the player next, and where each accepted side
// quest does. An objective (or a side quest's step) names its goals, a map and a tile, the first whose
// condition holds; the arrow points at the goal on its own map, or else at the door that starts the shortest
// way there through the open doors. Pure TypeScript; scenes/FieldScene.ts draws the arrow and the minimap
// dots, tests/guide.test.ts checks every goal against the scripted route.

import { evaluate, type Condition } from './conditions.ts';
import type { FlagReader } from './flags.ts';
import { currentObjective, type QuestDef } from './quests.ts';
import { sideQuestStatus, type SideQuestDef } from './sideQuests.ts';
import type { GameMap } from './tiledMap.ts';
import type { Pos } from './types.ts';

/** Where an objective (or a step) is done: a map and a tile, while `if` holds. */
export interface Goal {
  if?: Condition;
  map: string;
  at: Pos;
}

/** Where to head now: the goal itself (`final`), or the door out of this map towards it. */
export interface Waypoint {
  map: string;
  at: Pos;
  final: boolean;
}

/** The first goal whose condition holds (none: nothing to point at). */
export function goalFor(goals: readonly Goal[] | undefined, flags: FlagReader): Goal | null {
  return goals?.find((g) => !g.if || evaluate(g.if, flags)) ?? null;
}

/**
 * From a map towards a goal: the goal if it is here, else the door on this map that starts the shortest
 * way (fewest maps) through doors that are open now. Null when no door leads there (a voyage, say).
 */
export function waypoint(maps: Readonly<Record<string, GameMap>>, fromMap: string, goal: Goal, flags: FlagReader): Waypoint | null {
  if (goal.map === fromMap) return { map: fromMap, at: { ...goal.at }, final: true };
  const open = (m: GameMap) => m.doors.filter((d) => d.targetMap !== m.id && maps[d.targetMap] && (!d.if || evaluate(d.if, flags)));
  const start = maps[fromMap];
  if (!start) return null;
  // Breadth first over maps, remembering the first door taken out of the start map.
  const firstDoor = new Map<string, Pos>();
  const queue: string[] = [];
  for (const d of open(start)) {
    if (firstDoor.has(d.targetMap)) continue;
    firstDoor.set(d.targetMap, d.pos);
    queue.push(d.targetMap);
  }
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i]!;
    if (id === goal.map) return { map: fromMap, at: { ...firstDoor.get(id)! }, final: false };
    for (const d of open(maps[id]!)) {
      if (d.targetMap === fromMap || firstDoor.has(d.targetMap)) continue;
      firstDoor.set(d.targetMap, firstDoor.get(id)!);
      queue.push(d.targetMap);
    }
  }
  return null;
}

/** The story's goal now: the current objective of the chapter the Journal shows. */
export function storyGoal(quest: QuestDef | null, flags: FlagReader): Goal | null {
  const objective = quest ? currentObjective(quest, flags) : null;
  return objective ? goalFor(objective.goals, flags) : null;
}

/** Side quests not started yet that the player could start now (`available`): mystery quests. */
export function mysteryQuests(quests: readonly SideQuestDef[], flags: FlagReader): SideQuestDef[] {
  return quests.filter((q) => sideQuestStatus(flags, q) === 'unknown' && (!q.available || evaluate(q.available, flags)));
}

/** Where each mystery quest starts (its giver). */
export function mysteryGoals(quests: readonly SideQuestDef[], flags: FlagReader): { id: string; goal: Goal }[] {
  const out: { id: string; goal: Goal }[] = [];
  for (const q of mysteryQuests(quests, flags)) {
    const goal = goalFor(q.start, flags);
    if (goal) out.push({ id: q.id, goal });
  }
  return out;
}

/** Anissa's nudges towards the mystery quests (after her hints for the story's objective). */
export function sideNudges(quests: readonly SideQuestDef[], flags: FlagReader): string[] {
  return mysteryQuests(quests, flags).flatMap((q) => (q.nudge ? [q.nudge] : []));
}

/** Each accepted, unfinished side quest's goal now (its first step not done yet). */
export function sideGoals(quests: readonly SideQuestDef[], flags: FlagReader): { id: string; goal: Goal }[] {
  const out: { id: string; goal: Goal }[] = [];
  for (const q of quests) {
    if (sideQuestStatus(flags, q) !== 'active') continue;
    const step = q.steps.find((s) => !evaluate(s.done, flags));
    const goal = step ? goalFor(step.goals, flags) : null;
    if (goal) out.push({ id: q.id, goal });
  }
  return out;
}
