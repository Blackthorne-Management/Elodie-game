// Every tunable number lives here so balancing never means hunting through code.

export const TYPE_ADVANTAGE = 1.5;
export const TYPE_DISADVANTAGE = 0.67;

export const RARITY_MULT = { common: 1, uncommon: 1.1, rare: 1.25, legendary: 1.45 } as const;
export const STAGE_MULT = { 1: 1, 2: 1.15, 3: 1.3 } as const;
export const LEVEL_GROWTH = 0.08;   // per level, hp/attack/defense
export const SPEED_GROWTH = 0.02;   // per level, speed grows slowly
export const STAR_GROWTH = 0.03;    // per star above 1

export const BASE_LEVEL_CAP = 30;
export const LEVEL_CAP_PER_ACT = 25;

export const BASE_CRIT_CHANCE = 0.1;
export const CRIT_MULT = 1.5;
export const DAMAGE_VARIANCE = 0.1; // damage rolls 95%-105%
export const DEFENSE_SCALE = 100;   // damage * 100 / (100 + def)

export const STATUS_MULT = {
  atkUp: 1.25, atkDown: 0.75,
  defUp: 1.25, defDown: 0.75,
  spdUp: 1.3, chill: 0.7,
} as const;
export const BURN_PERCENT = 0.05;
export const REGEN_PERCENT = 0.05;
export const BLIND_MISS_CHANCE = 0.2;
export const FREEZE_IMMUNE_TURNS = 2;

export const GRACE_MAX = 100;
export const GRACE_PER_ACTION = 10;

export const AI_HEAL_THRESHOLD = 0.5;

// Enemy scaling by floor kind
export const ELITE_MULT = { hp: 2.5, attack: 1.3 } as const;
export const BOSS_MULT = { hp: 8, attack: 1.5 } as const;

// Battle playback, in ms per log event
export const PLAYBACK_MS = 400;
export const PLAYBACK_MS_FAST = 200;

// The storm rises: long fights deal more damage each round so healer and
// shield stand-offs always end.
export const STORM_START_ROUND = 12;
export const STORM_RAMP_PER_ROUND = 0.2;

// Floors and rewards
export const FLOORS_PER_ACT = 150;
export const FLOORS_PER_REGION = 25;
export const MINI_BOSS_EVERY = 5;
export const FLOORS_PER_ENEMY_LEVEL = 6;
export const SPARKS_BASE = 40;
export const SPARKS_PER_FLOOR = 8;
export const SPARKS_MULT = { normal: 1, miniBoss: 2, regionBoss: 4 } as const;
export const REPLAY_SPARKS = 0.5;       // replaying a cleared floor pays half
export const CRYSTALS_PER_FIRST_BOSS_CLEAR = 1;

// Evolution
export const EVOLVE = {
  2: { level: 15, sparks: 500, crystals: 0 },
  3: { level: 35, sparks: 2000, crystals: 1 },
} as const;

export const STARTING_EGGS = 3;
export const STARTING_LEVEL = 3;
export const STARTING_SPARKS = 200;
