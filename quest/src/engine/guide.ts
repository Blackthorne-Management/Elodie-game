// Quest arrows (owner request, Oct 17): where the story wants the player next, and where each accepted side
// quest does. An objective (or a side quest's step) names its goals, a map and a tile, the first whose
// condition holds; the arrow points at the goal on its own map, or else at the door that starts the shortest
// way there through the open doors. Pure TypeScript; scenes/FieldScene.ts draws the arrow and the minimap
// dots, tests/guide.test.ts checks every goal against the scripted route.

import { evaluate, type Condition } from './conditions.ts';
import type { FlagReader } from './flags.ts';
import { currentObjective, type QuestDef } from './quests.ts';
import { questClosed, questNudge, sideQuestStatus, type SideQuestDef } from './sideQuests.ts';
import type { GameMap } from './tiledMap.ts';
import type { Era, Pos } from './types.ts';

/** Where an objective (or a step) is done: a map and a tile, while `if` holds. */
export interface Goal {
  if?: Condition;
  map: string;
  at: Pos;
  /** Set by the guide (never in data) on a goal taken from `echoGoals`: the arrow shows inside the Echo too. */
  echo?: boolean;
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
 * The Echo rule (review 1, Oct 21, finding 2): the arrow must not go quiet at the moment the Echo asks the player
 * to do something. While in the Echo, an objective's (or a side-quest step's) `echoGoals` come first, the first
 * whose condition holds (the person in the memory to talk to, the thing to change, the shimmer back out); with
 * none holding, or in the present, its usual `goals`. A goal taken from `echoGoals` is marked `echo`, which is
 * what lets the field scene draw the arrow inside the memory (any other goal stays hidden there, as before: the
 * memory's doors are shut, so it could only point at the player's feet).
 */
export function goalNow(
  goals: readonly Goal[] | undefined,
  echoGoals: readonly Goal[] | undefined,
  flags: FlagReader,
  era: Era = 'present',
  mapId?: string,
): Goal | null {
  if (era === 'echo') {
    // Doors are shut in a memory: only this map's Echo goals can be walked to.
    const inEcho = goalFor(mapId === undefined ? echoGoals : echoGoals?.filter((g) => g.map === mapId), flags);
    if (inEcho) return { ...inEcho, echo: true };
  }
  return goalFor(goals, flags);
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

/**
 * The story's goal now: the current objective of the chapter the Journal shows. An objective done through the
 * side quests (`followSide`) leads to the next side quest's stop: one in progress first, else one not started.
 * Given the map the player is on (`mapId`), a stop on that map comes first (Chapter 2 side quests, Oct 20: the
 * arrow does what is here before it leads away, so Yucayeque's quests take one climb up the mountain).
 */
export function storyGoal(quest: QuestDef | null, flags: FlagReader, sideQuests: readonly SideQuestDef[] = [], mapId?: string, era: Era = 'present'): Goal | null {
  const objective = quest ? currentObjective(quest, flags) : null;
  if (!objective) return null;
  if (objective.followSide) {
    // The story step that hands the errands out, first (Samira on the Majlis steps).
    const own = goalNow(objective.goals, objective.echoGoals, flags, era, mapId);
    if (own) return own;
    // A secret quest is optional: the arrow never leads to it for a story step.
    const open = sideQuests.filter((q) => !q.secret);
    const stops = [...sideGoals(open, flags, era, mapId), ...mysteryGoals(open, flags)].map((s) => s.goal);
    // In the Echo, the memory's own step first (it is where the player stands).
    return (era === 'echo' ? stops.find((g) => g.echo) : undefined) ?? stops.find((g) => g.map === mapId) ?? stops[0] ?? null;
  }
  return goalNow(objective.goals, objective.echoGoals, flags, era, mapId);
}

/** Side quests not started yet that the player could start now (`available`): mystery quests. A secret one never is. */
export function mysteryQuests(quests: readonly SideQuestDef[], flags: FlagReader): SideQuestDef[] {
  return quests.filter((q) => !q.secret && sideQuestStatus(flags, q) === 'unknown' && !questClosed(q, flags) && (!q.available || evaluate(q.available, flags)));
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
  return mysteryQuests(quests, flags).flatMap((q) => {
    const nudge = questNudge(q, flags);
    return nudge ? [nudge] : [];
  });
}

/** Each accepted, unfinished side quest's goal now (its first step not done yet; in the Echo, its `echoGoals` first). */
export function sideGoals(quests: readonly SideQuestDef[], flags: FlagReader, era: Era = 'present', mapId?: string): { id: string; goal: Goal }[] {
  const out: { id: string; goal: Goal }[] = [];
  for (const q of quests) {
    if (sideQuestStatus(flags, q) !== 'active') continue;
    const step = q.steps.find((s) => !evaluate(s.done, flags));
    const goal = step ? goalNow(step.goals, step.echoGoals, flags, era, mapId) : null;
    if (goal) out.push({ id: q.id, goal });
  }
  return out;
}
