// The shapes of game content the engine runs (the content itself lives in src/data).

import type { RhythmDef } from './rhythm.ts';
import type { RotorDef } from './rotor.ts';
import type { DebateContext, DebateDef } from './debate.ts';
import type { DialogueScript, Speaker } from './dialogue.ts';
import { evaluate, type Condition } from './conditions.ts';
import type { FlagReader, FlagStore } from './flags.ts';

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
  /**
   * Lines shown after `lines` only while their condition holds (Chapter 12: the Hollow Throne's card names what strained
   * the realm on this save; each house's fate by what became of it).
   */
  more?: readonly { if: Condition; text: string }[];
  /** The game's last card: closing it opens the end credits, then the title (Chapter 12; engine/game.ts closeCard). */
  credits?: boolean;
}

/** A card's lines as this save shows them (its own, then each `more` line whose condition holds). */
export function cardLines(card: CardDef, flags: FlagReader): string[] {
  return [...card.lines, ...(card.more ?? []).filter((m) => evaluate(m.if, flags)).map((m) => m.text)];
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
  /** A screen pushed in a rotor grid (engine/rotor.ts): it turned; every screen faces north; it is pegged and will not. */
  rotorTurned?: string;
  rotorSolved?: string;
  rotorPegged?: string;
}

/** One kind of ambush in a wild section: who jumps out, and how it reads before the fight. */
export interface EncounterGroup {
  id: string;
  /** Relative chance within its table (default 1). */
  weight?: number;
  /** The foes, by name, for the menu's Foes page. */
  foes: readonly string[];
  /** The foes in battle (data/battles.ts ENEMIES ids, at this group's level). An ambush is always a real fight. */
  enemies?: readonly string[];
  /** Their level (the menu's Foes page colours it against the party's). */
  level: number;
  /** The line shown when they appear. */
  intro: string;
  /** The line shown after winning (only a group with no `enemies` uses it: the text stand-in for a fight). */
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
  /** Rhythm locks (engine/rhythm.ts), by id; a dialogue opens one with flag `rhythm.next`. */
  rhythms?: Readonly<Record<string, RhythmDef>>;
  /** Grids of pivoting screens (engine/rotor.ts), by id; a dialogue pushes one with flag `rotor.push`. */
  rotors?: Readonly<Record<string, RotorDef>>;
  /** Influence in a debate's city now, and what Mediate needs (the RPG content knows the pillars). */
  debateContext?: (flags: FlagReader, def: DebateDef) => DebateContext;
  /**
   * Bookkeeping after every conversation, before its fight, card or journey (Chapter 10: the Muster writes the allies'
   * shares and, when a scene asks, names the Crown's buyer; engine/ally.ts musterTick).
   */
  afterDialogue?: (flags: FlagStore) => void;
  /**
   * Fills a line's `{...}` names from the save as it is shown (Chapter 12: the Master of the Chairs reads the realm's three
   * pillars into the register; the Journal's Stability). Unknown names are left as written.
   */
  formatText?: (text: string, flags: FlagReader) => string;
}

export function cardFlag(card: CardDef): string {
  return `card.${card.id}`;
}
