export type HouseId =
  | 'brasador' | 'dorini' | 'ironvow' | 'suzumori'
  | 'vaitama' | 'kaysoley' | 'agnivansh' | 'stillwater';

export type Pillar = 'influence' | 'fear' | 'wealth';
export const PILLARS: Pillar[] = ['influence', 'fear', 'wealth'];

export type TileType = 'court' | 'war' | 'trade';
export const TILE_PILLAR: Record<TileType, Pillar> = { court: 'influence', war: 'fear', trade: 'wealth' };

export interface Pos { x: number; y: number }          // 0-indexed, x = column, y = row
export type Dir = 'north' | 'south' | 'east' | 'west';
export type Gen = 1 | 2 | 3 | 4;

export type CardKind = 'hand' | 'instant';

// One player's seat. A seat keeps its id for the whole game.
export interface PlayerState {
  id: number;
  name: string;
  isBot: boolean;
  house: HouseId;
  gen: Gen;
  hp: number;
  maxHp: number;
  pos: Pos | null;               // null once a Specter
  specter: boolean;
  res: Record<Pillar, number>;
  hand: number[];                // card ids
  grudges: number[];             // seat ids this family holds a Grudge against
  kills: number;
  reckonings: number;
  handCardsPlayed: number;
  visited: string[];             // squares ended on this life (Hidden Path)
  lastScoredTile: string | null; // the last tile this character scored from (the next score must be elsewhere)
  legacy: HouseId | null;        // Vai'tama Legacy
  extraPassive: HouseId | null;  // Vai'tama IV
  pendingExtraPassive: boolean;  // Vai'tama IV waiting for a house to become a Specter
  used: Record<string, number>;  // ability use counters (per game, per turn, per round keys)
  mark: number | null;           // Brasador's La Marca target
  extraTurn: boolean;            // Ironvow IV pending second turn
}

// Ongoing effects with an expiry. All are plain data so state stays serialisable.
export type Expiry =
  | { at: 'turnStart'; player: number }   // expires when this player's next turn starts
  | { at: 'turnEnd'; player: number }     // expires at the end of this player's current or next turn
  | { at: 'roundEnd'; round: number }
  | { at: 'consumed' };                    // removed by the rule that uses it

export type EffectKind =
  | 'noInfluenceGain' | 'noAttack' | 'sabotage' | 'confusion' | 'forcedMarch' | 'hex'
  | 'dreadBanner' | 'markedForDeath' | 'truce' | 'ceasefire' | 'shieldWall' | 'noFearGain'
  | 'redirect' | 'mask' | 'handPublic';

export interface Effect {
  id: number;
  kind: EffectKind;
  owner: number;            // whose effect it is (the affected player, or the protected one)
  by?: number;              // who caused it
  other?: number;           // second party (truces)
  square?: string;          // Shield Wall
  house?: HouseId;          // Ancestor's Mask copy
  level?: number;
  cardId?: number;          // a "marked" card waiting to be discarded
  armed: boolean;           // false = waiting for the owner's next turn to begin ("next turn" effects)
  expiry: Expiry;
}

export interface LogEvent {
  seq: number;
  round: number;
  text: string;
  kind: string;             // for UI animation: 'move' | 'damage' | 'gain' | 'card' | 'death' | ...
  player?: number;
  target?: number;
  amount?: number;
  cards?: number[];
  visibleTo?: number[];     // hidden-information events (hand reveals); undefined = everyone
}

export interface TurnState {
  player: number;
  moved: boolean;
  attacks: number;
  attacksAllowed: number;
  actions: number;          // your one action per turn: an attack or a Hand Card
  actionsAllowed: number;
  rollBonus: number;
  aggressive: boolean;
  damageDealt: number;
  scoredTile: string | null;
  stopDrawing: boolean;
  extraTurn: boolean;
  vanishingAct: boolean;
  onHit: number[];          // cards waiting to pay out when this turn's attack lands (Plunder)
}

export interface GameConfig {
  suddenDeathRound: number;
  challengeFirstStriker: 'claimant' | 'challenger';
}

export interface SeatSetup { name: string; isBot: boolean; house?: HouseId }

export interface GameSetup {
  seed: number;
  seats: SeatSetup[];       // 2-8
  firstPlayer?: number;     // seat id; random when omitted
  config?: Partial<GameConfig>;
}

export interface GameState {
  setup: GameSetup;
  config: GameConfig;
  players: PlayerState[];
  order: number[];          // seat ids in turn order, starting with the first player
  round: number;
  turnNo: number;           // increments every turn, for once-per-turn limits
  turn: TurnState | null;
  drawPile: number[];       // last element = top
  discard: number[];        // last element = top (most recent)
  removed: number[];        // Specter cards, gone for good
  inPlay: number[];         // cards currently resolving
  dying: { victim: number; killer: number | null }[];  // deaths waiting to be resolved, in order
  effects: Effect[];
  log: LogEvent[];
  seq: number;
  lastKill: { killer: number; victim: number } | null;
  housesLost: HouseId[];    // houses that have lost at least one character
  lastInfluenceGain: number | null;
  winner: number | null;
  endReason: string | null;
}

// --- Decisions: the engine pauses on one of these until the named player answers with an option index.

export type DecisionKind =
  | 'turn' | 'move' | 'player' | 'card' | 'block' | 'counterspell' | 'pool' | 'direction'
  | 'square' | 'legacy' | 'challenge' | 'confirm' | 'specter' | 'discard';

export interface Option<V = unknown> { label: string; value: V }

export interface Decision<V = unknown> {
  player: number;
  kind: DecisionKind;
  prompt: string;
  options: Option<V>[];
  context?: Record<string, unknown>;   // extra info for bots and UI (e.g. the attack being blocked)
}

export type Flow<T = void> = Generator<Decision, T, number>;
