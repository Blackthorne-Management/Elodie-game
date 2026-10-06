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
  peeksPerRound?: (level: number) => number;
  reckoningCancels?: (level: number) => number;
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
  culture: string;
  identity: string;
  curve: string;
  lore: string;
  tileType: TileType;
  home: Pos;
  hp: [number, number, number, number];
  passiveName: string;
  passiveText: [string, string];                   // Gen I, Gen III upgrade
  passive: PassiveHooks;
  passiveAbility?: Ability;                        // usable by anyone holding this passive (Suzumori's peek)
  abilities: Ability[];                            // generation abilities, cumulative
  // House rules that are not passives (cannot be copied).
  attackBeforeMove?: (gen: Gen) => boolean;
  halfMoveOnKill?: (gen: Gen) => boolean;
  longWatch?: (gen: Gen) => boolean;
  claimReduction?: (gen: Gen) => number;
  mostFearedDownside?: (gen: Gen) => boolean;
  legacyOnDeath?: boolean;                         // Vai'tama
  legacyDrawTwoAt?: Gen;                           // Vai'tama III
  extraPassiveAt?: Gen;                            // Vai'tama IV
  downsideText?: string;
}

export interface Content {
  houses: Record<HouseId, HouseDef>;
  cards: CardDef[];
}
