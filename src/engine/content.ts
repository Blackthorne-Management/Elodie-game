// The shapes that card and house content (in src/data) must provide. The engine only knows these.
import type { Game } from './game';
import type { Flow, Gen, HouseId, Pillar, PlayerState, Pos, TileType } from './types';

export interface AttackInfo {
  attacker: number;
  target: number;
  kind: 'basic' | 'card' | 'challenge' | 'trial';
  damage: number;            // what would land if not negated
}

// Reaction cards (rules-decisions 61): Hand Cards held and played on another player's turn, at one moment.
export type ReactionKind = 'omen' | 'intercept' | 'interference' | 'embargo' | 'ambush' | 'turnabout';

export interface CardDef {
  id: number;
  name: string;
  kind: 'hand' | 'instant';
  category: string;
  text: string;
  elodie?: boolean;
  flavor?: string;
  aggressive?: boolean;      // counts against Stillwater's Long Watch
  noSpecter?: boolean;       // causes HP loss, so a Specter can't play it
  responseOnly?: boolean;    // Block/Deflect and Counterspell: never played on your own turn
  namesTarget?: boolean;     // the player is named first, then others may Interfere (rules-decisions 79)
  targets?: boolean;         // a Target card (marked ◎): Counterspell and Turnabout can answer it (rules-decisions 84)
  // Block/Deflect: can it answer this attack, and what happens when it does.
  block?: {
    canUse: (g: Game, defender: PlayerState, attack: AttackInfo) => boolean;
    resolve: (g: Game, defender: PlayerState, attack: AttackInfo) => Flow<'negate' | 'survive1'>;
  };
  counterspell?: boolean;
  reaction?: ReactionKind;
  timing?: string;           // reminder printed under the divider, e.g. "Play when a rival rolls to move"
  // Can this Hand Card be played right now (on your own turn)?
  playable?: (g: Game, p: PlayerState) => boolean;
  effect: (g: Game, self: PlayerState, card: CardDef) => Flow;
  // Cards that wait for your next basic attack (Plunder, Vanishing Act): runs once it resolves.
  // damage is 0 if the attack was negated.
  afterAttack?: (g: Game, self: PlayerState, damage: number) => Flow;
}

export interface PassiveHooks {
  tileBonus?: (pillar: Pillar, level: number) => number;
  wealthBonus?: (level: number) => number;          // once per turn, on Wealth from anything but a tile
  moveBonus?: (level: number) => number;
  reach?: (level: number) => number;               // basic attack reach in a straight line
  basicAttackBonus?: (level: number) => number;
  fearOnKill?: (level: number) => number;
  fearOnLanded?: (level: number) => number;
  stepOnLanded?: (level: number) => number;        // free steps after landing an attack
  peeksPerRound?: (level: number) => number;
  reckoningCancels?: (level: number) => number;
  unbroken?: (level: number) => number;            // 1: once per heir, a killing attack while at 2+ Heart Tokens leaves 1
}

export interface Ability {
  id: string;
  name: string;
  text: string;
  gen: Gen;                                        // generation it unlocks at
  limit: 'turn' | 'round' | 'game';
  uses?: (g: Game, p: PlayerState) => number;      // how many per limit window (default 1)
  canUse?: (g: Game, p: PlayerState) => boolean;
  run: (g: Game, p: PlayerState) => Flow;
}

export interface HouseDef {
  id: HouseId;
  name: string;
  homeland: string;
  identity: string;
  curve: string;
  lore: string;
  tileType: TileType;
  home: Pos;
  hp: [number, number, number, number];
  heirs: [string, string, string, string];         // the character of each generation, Gen I to IV (rules-decisions 86)
  passiveName: string;
  passiveText: [string, string];                   // Gen I, Gen III upgrade
  passive: PassiveHooks;
  // The passive as printed on this house's Legacy card, when another house holds it as a Legacy (Yaguana's Ancestor's
  // Voice and Song of Coaybay). Omitted: the Legacy is the Gen I passive above (rules-decisions 87).
  legacyPassive?: { text: string; hooks: PassiveHooks };
  passiveAbility?: Ability;                        // usable by anyone holding this passive (Suzumori's peek)
  abilities: Ability[];                            // generation abilities, cumulative
  // House rules that are not passives (cannot be copied).
  attackBeforeMove?: (gen: Gen) => boolean;
  moveOnKill?: (gen: Gen) => boolean;
  longWatch?: (gen: Gen) => boolean;
  claimReduction?: (gen: Gen) => number;
  mostFearedDownside?: (gen: Gen) => boolean;
  legacyOnDeath?: boolean;                         // Yaguana
  keepsOnDeath?: (gen: Gen) => boolean;            // the dying character loses no pool (Yaguana's Areíto)
  legacyDrawTwoAt?: Gen;                           // Yaguana III (old rule)
  startsWithLegacy?: boolean;                      // Yaguana's Ancestor's Voice: a Legacy from the start (rules-decisions 83)
  legacyUpgradeAt?: Gen;                           // the Legacy works at its upgraded (Gen III) strength from here
  extraPassiveAt?: Gen;                            // Yaguana IV
  downsideText?: string;
}

export interface Content {
  houses: Record<HouseId, HouseDef>;
  cards: CardDef[];
}
