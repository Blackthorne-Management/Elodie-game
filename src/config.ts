// Every tunable number lives here. Rules references are to docs/rules-decisions.md.

export const BOARD_SIZE = 18;
export const HAND_SIZE = 3;
export const DIE_SIDES = 6;

// Section 8: win thresholds by player count.
// The single-pillar targets are 2 higher than the rulebook's 5/6 (changed after playtesting): chained
// Instant draws could hand one house a whole pillar in a single turn.
export const THRESHOLDS = {
  small: { maxPlayers: 3, combined: 8, single: 7 },
  normal: { combined: 10, single: 8 },
};

// Tuning items flagged by the rulebook (Section 12).
export const SUDDEN_DEATH_ROUND = 15;
export type FirstStriker = 'claimant' | 'challenger';
export const CHALLENGE_FIRST_STRIKER: FirstStriker = 'claimant';

// Attacking ends your turn (after your last allowed attack). Ironvow from Gen II may attack before
// moving and still move afterwards.
export const ATTACK_ENDS_TURN = true;

// Safety cap on blows in one Challenge fight or duel (each blow is at least 1 damage, so real fights end long before).
export const MAX_FIGHT_BLOWS = 60;

// Specter (Section 10).
export const SPECTER_CHOICES = 5;

// Balance knobs (rulebook values by default). Objects so balance experiments can adjust them.
export const TUNING = {
  tileAlone: 3,          // resources from a tile when you're alone on it
  tileShared: 2,         // ...when someone else is there too
  maxDamage: 99,         // cap on the damage of one attack (99 = no cap)
  specterChoices: SPECTER_CHOICES,
};

// Bots
export const BOT_THINK_MS = 450;
