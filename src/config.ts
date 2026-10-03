// Every tunable number lives here. Rules references are to docs/rules-decisions.md.

export const BOARD_SIZE = 18;
export const HAND_SIZE = 3;
export const DIE_SIDES = 6;

// Section 8: win thresholds by player count.
export const THRESHOLDS = {
  small: { maxPlayers: 3, combined: 8, single: 5 },
  normal: { combined: 10, single: 6 },
};

// Tuning items flagged by the rulebook (Section 12).
export const SUDDEN_DEATH_ROUND = 15;
export type FirstStriker = 'claimant' | 'challenger';
export const CHALLENGE_FIRST_STRIKER: FirstStriker = 'claimant';

// Safety cap on blows in one Challenge fight or duel (each blow is at least 1 damage, so real fights end long before).
export const MAX_FIGHT_BLOWS = 60;

// Specter (Section 10).
export const SPECTER_CHOICES = 3;

// Bots
export const BOT_THINK_MS = 450;
