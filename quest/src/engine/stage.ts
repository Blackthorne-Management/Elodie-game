// Stage directions (owner rule, Oct 17: story moments are shown, not told). A dialogue line can carry cues the
// field scene acts out before the line appears: people walk in through a door, walk or run up to someone, turn
// to face them, and walk off and out of sight; the camera follows whoever the scene is about. Cues run in order;
// one marked `async` starts and the next begins at once (so a group can walk in together), the others finish
// first. The actors are only pictures: what the story changes still lives in the flags, so the simulator and
// saves never see them. Pure TypeScript; scenes/FieldScene.ts performs them, tests/stage.test.ts checks them.

import type { DialogueScript } from './dialogue.ts';
import type { Dir8, Pos } from './types.ts';

/** The player's sprite, for `face` cues (Gianna turns to whoever comes in). */
export const STAGE_PLAYER = 'player';
/** Anissa following Gianna, when she is: she can be directed like anyone (and goes back to following after). */
export const STAGE_FOLLOWER = 'follower';
/** Someone already standing on the map, by NPC id (`npc:canoe_fisher`); they walk home after the scene. */
export const STAGE_NPC = 'npc:';

/** Actors the scene borrows from the map (they are on stage from the start and need no look). */
export function isBorrowed(actor: string): boolean {
  return actor === STAGE_FOLLOWER || actor.startsWith(STAGE_NPC);
}

export type StageCue =
  /** Someone appears where they stand (already there when the scene picks up, e.g. after a fight). */
  | { do: 'place'; actor: string; look?: string; at: Pos; facing?: Dir8 }
  /** Someone comes in at `from` (a doorway, the edge of the map) and walks (or runs) to `to`. */
  | { do: 'enter'; actor: string; look: string; from: Pos; to: Pos; facing?: Dir8; run?: boolean; async?: boolean }
  /** Someone on stage walks to a tile. */
  | { do: 'walk'; actor: string; to: Pos; facing?: Dir8; run?: boolean; async?: boolean }
  /** Someone walks off to a tile (a door) and is gone. */
  | { do: 'exit'; actor: string; to: Pos; run?: boolean; async?: boolean }
  /** Someone (or the player) turns: a way, or towards the player. */
  | { do: 'face'; actor: string; facing: Dir8 | 'player' }
  /** The camera follows an actor (or the player again); it may name someone about to come on stage. */
  | { do: 'look'; actor: string }
  /** A pause. */
  | { do: 'wait'; ms: number }
  /** The map's people and objects take up the story as it stands now (a boat appears, someone is gone). */
  | { do: 'sync' };

/** Every cue in a script, in the order the lines are written (nodes in their written order). */
export function stageCues(script: DialogueScript): StageCue[] {
  return Object.values(script.nodes).flatMap((n) => n.lines.flatMap((l) => l.stage ?? []));
}

/**
 * What is wrong with a script's stage directions: an actor who walks, turns, leaves or is followed before
 * coming on stage (or after leaving), or a look that does not exist. Reads the cues in written order.
 */
export function stageProblems(script: DialogueScript, looks: ReadonlySet<string>, npcs: ReadonlySet<string> = new Set()): string[] {
  const out: string[] = [];
  const on = new Set<string>();
  const cues = stageCues(script);
  for (const c of cues) {
    if (c.do === 'wait' || c.do === 'sync') continue;
    if (c.actor.startsWith(STAGE_NPC) && !npcs.has(c.actor.slice(STAGE_NPC.length))) out.push(`${script.id}: unknown NPC "${c.actor}"`);
    if (isBorrowed(c.actor)) {
      if (c.do === 'enter') out.push(`${script.id}: ${c.actor} is already on the map (walk, not enter)`);
      continue;
    }
    if (c.do === 'place' || c.do === 'enter') {
      if (!c.look || !looks.has(c.look)) out.push(`${script.id}: ${c.actor} has unknown look "${c.look ?? ''}"`);
      on.add(c.actor);
      continue;
    }
    if (c.actor === STAGE_PLAYER && (c.do === 'face' || c.do === 'look')) continue;
    if (c.do === 'look') {
      if (!isBorrowed(c.actor) && !cues.some((x) => (x.do === 'place' || x.do === 'enter') && x.actor === c.actor)) out.push(`${script.id}: the camera follows ${c.actor}, who never comes on stage`);
      continue;
    }
    if (!on.has(c.actor)) out.push(`${script.id}: ${c.do} for ${c.actor}, who is not on stage`);
    if (c.do === 'exit') on.delete(c.actor);
  }
  return out;
}
