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
