export type WeatherType = 'gale' | 'rain' | 'sun' | 'frost' | 'bloom';
export type ElementType = WeatherType | 'eclipse' | 'aurora' | 'calm';
export type Role = 'attack' | 'shield' | 'healing' | 'support';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type StatName = 'hp' | 'attack' | 'defense' | 'speed';
export type Stats = Record<StatName, number>;

export type StatusId =
  | 'burn' | 'chill' | 'freeze' | 'root' | 'shield' | 'taunt' | 'dodge'
  | 'regen' | 'atkUp' | 'atkDown' | 'defUp' | 'defDown' | 'spdUp' | 'blind';

export type Target = 'enemy' | 'allEnemies' | 'self' | 'ally' | 'lowestAlly' | 'allAllies';

// Moves are data: a list of effects the engine knows how to run.
export type Effect =
  | { kind: 'damage'; power: number; target: Target; hits?: number }
  | { kind: 'heal'; percent: number; target: Target }
  | { kind: 'status'; status: StatusId; chance: number; turns: number; target: Target }
  | { kind: 'shield'; percent: number; turns: number; target: Target }
  | { kind: 'cleanse'; target: Target }
  | { kind: 'revive'; percent: number };

export interface Move {
  id: string;
  name: string;
  slot: 'basic' | 'skill' | 'ultimate';
  cooldown: number;          // 0, 3 or 5
  effects: Effect[];
}

// A species is the Journal entry: the same for every copy.
export interface Species {
  id: string;                // 'puddlewump'
  names: [string, string, string]; // one name per evolution stage
  type: ElementType;
  role: Role;
  rarity: Rarity;
  baseStats: Stats;          // at level 1, stage 1
  moves: { basic: string; skill: string; ultimate: string }; // move ids
  personality: string;
  favoriteWeather: string;
}

// A pet is one copy the player owns.
export interface Pet {
  uid: string;
  speciesId: string;
  level: number;
  stage: 1 | 2 | 3;
  stars: number;             // 1 to 5
  shards: number;
  items: { charm?: string; cloak?: string; dewdrop?: string; feather?: string }; // item uids
}

export type ItemSlot = 'charm' | 'cloak' | 'dewdrop' | 'feather';

export interface ItemDef {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: Rarity;
  basePercent: number;       // 8, 10, 14 or 18
  effectId?: string;         // special effect, Uncommon and up
}

export interface Item { uid: string; defId: string; level: number; stars: number; }

export interface SaveState {
  version: number;
  pets: Pet[];
  items: Item[];
  team: string[];            // up to 4 pet uids
  highestFloor: number;
  actsCleared: number;
  currency: { eggs: number; sparks: number; eventTokens: number };
  stormCrystals: number;
  pity: { sinceLegendary: number; sinceRare: number; sinceUncommon: number };
  journal: string[];         // species ids ever owned
  firstClears: number[];     // boss floors cleared at least once
  daily: { lastLogin: string; streakDay: number; quests: { id: string; progress: number; claimed: boolean }[] };
  settings: { music: number; sound: number; battleSpeed: 1 | 2; textSize: 'normal' | 'large' };
}
