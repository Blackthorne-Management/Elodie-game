// Every tunable number lives here. Rules references are to docs/rules-decisions.md.

export const BOARD_SIZE = 18;
// Squares pawns can't enter: '.' is walkable, '~' is not (row by row, north at the top). null = every square on
// the grid is walkable, water included (the current rule). Moves never leave the grid either way.
export const BOARD: { land: string[] | null } = {
  land: null,
};
export const HAND_SIZE = 3;
export const DIE_SIDES = 6;

// Section 8: win thresholds by player count (changed after playtesting and simulation, see
// rules-decisions.md): a claim needs a combined total AND a minimum in every pillar; the rulebook's
// one-pillar route is off, because nearly every winner was piling into one pillar.
// combined: total needed; minEach: the least you must hold in every pillar for the combined route;
// single: the one-pillar route (null = no such route).
export interface Threshold { combined: number; minEach: number; single: number | null }
export const THRESHOLDS: { small: Threshold & { maxPlayers: number }; normal: Threshold } = {
  small: { maxPlayers: 3, combined: 8, minEach: 1, single: null },
  normal: { combined: 9, minEach: 2, single: null },
};

// Tuning items flagged by the rulebook (Section 12).
export const SUDDEN_DEATH_ROUND = 16;
export type FirstStriker = 'claimant' | 'challenger';
export const CHALLENGE_FIRST_STRIKER: FirstStriker = 'claimant';

// Attacking ends your turn (after your last allowed attack). Ironvow from Gen II may attack before
// moving and still move afterwards.
// The Throne's four squares are a sanctuary: no attacks into or out of them (ranged ones too), and no one standing
// there can be killed; other Heart Token loss stops at 1. Challenge fights for the Throne are the exception.
export const THRONE_SANCTUARY = true;
// A new heir can't be attacked until the end of their first turn (challenge fights excepted).
export const NEWBORN_PROTECTION = true;
export const ATTACK_ENDS_TURN = true;

// Trade offer (rules-decisions 60): instead of playing a Hand Card, offer another player 1 of your resources
// for 1 of a different kind of theirs; they accept or refuse. One offer per turn. A refused offer still uses
// your action when this is true; set it false to let a refused trader still play a card.
export const TRADE = { offer: true, refusedUsesAction: true };

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
