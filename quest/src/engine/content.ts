// The shapes of game content the engine runs (the content itself lives in src/data).

import type { DialogueScript, Speaker } from './dialogue.ts';

export interface NpcDef {
  id: string;
  /** Sprite key in assets.config.ts NPC_SPRITES. */
  look: string;
  /** Dialogue id in data/dialogue.ts. */
  dialogue: string;
  /** Shown on the name label when the player faces them (a name, or a role). */
  name?: string;
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
}

export function cardFlag(card: CardDef): string {
  return `card.${card.id}`;
}
