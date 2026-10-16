// The shapes of game content the engine runs (the content itself lives in src/data).

import type { DebateContext, DebateDef } from './debate.ts';
import type { DialogueScript, Speaker } from './dialogue.ts';
import type { FlagReader } from './flags.ts';

export interface NpcDef {
  id: string;
  /** Sprite key in assets.config.ts NPC_SPRITES. */
  look: string;
  /** Dialogue id in data/dialogue.ts. */
  dialogue: string;
  /** Shown on the name label when the player faces them (a name, or a role). */
  name?: string;
  /** A vendor: after their greeting, this shop opens (data/rpg.ts SHOPS). */
  shop?: string;
}

/**
 * What the player learns about a puzzle object (keyed by its id in the maps): the name label shown
 * when facing it, and a one-line description that A shows when the object has no dialogue of its own.
 */
export interface ObjectInfo {
  name: string;
  inspect?: string;
}

/** A full-screen card shown once when its flag is set (e.g. the end of an act). */
export interface CardDef {
  id: string;
  /** Shown after a dialogue ends while this flag is set, once (remembered as `card.<id>`). */
  when: string;
  title: string;
  lines: string[];
}

/** Short system messages (toasts). */
export interface Messages {
  /** Echo pressed outside an Echo Zone. */
  noZone: string;
  /** In a zone whose condition does not hold yet (no Sun Locket, or too early in the story). */
  locked: string;
  /** The tile is not open in the other era (guide 6.1). */
  blocked: string;
  /** Walking into a door inside the memory. */
  doorInEcho: string;
  enterEcho: string;
  leaveEcho: string;
}

/** One kind of ambush in a wild section: who jumps out, and how it reads before the fight. */
export interface EncounterGroup {
  id: string;
  /** Relative chance within its table (default 1). */
  weight?: number;
  /** The foes, by name, for the battle (Phase 3) and the stand-in. */
  foes: readonly string[];
  /** Their level (the menu's Foes page colours it against the party's). */
  level: number;
  /** The line shown when they appear. */
  intro: string;
  /** The line shown after winning (until Phase 3 battles exist, the stand-in ends here). */
  won: string;
  /** The line shown after running away. */
  fled: string;
}

/** The ambushes a wild section can throw at the player (map layer `encounters`, property `table`). */
export interface EncounterTable {
  id: string;
  groups: readonly EncounterGroup[];
}

export interface GameContent {
  npcs: Readonly<Record<string, NpcDef>>;
  dialogue: Readonly<Record<string, DialogueScript>>;
  speakers: Readonly<Record<string, Speaker>>;
  cards: readonly CardDef[];
  messages: Messages;
  /** Names and descriptions of puzzle objects, by object id. */
  objects?: Readonly<Record<string, ObjectInfo>>;
  /** Name labels for doors, by `<map id>/<door id>` or a bare door id ("Limyè house"). */
  doors?: Readonly<Record<string, string>>;
  /** Random encounter tables, by id. */
  encounters?: Readonly<Record<string, EncounterTable>>;
  /** Street debates, by the dialogue id an NPC uses to start one (`debate:<id>`). */
  debates?: Readonly<Record<string, DebateDef>>;
  /** Influence in a debate's city now, and what Mediate needs (the RPG content knows the pillars). */
  debateContext?: (flags: FlagReader, def: DebateDef) => DebateContext;
}

export function cardFlag(card: CardDef): string {
  return `card.${card.id}`;
}
