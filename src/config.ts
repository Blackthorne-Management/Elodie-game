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
// Squares on the printed round track (rules-decisions 91): numbered 1 to 18 with no Sudden Death mark, so the board
// stays right for any SUDDEN_DEATH_ROUND from 12 to 18 while playtests settle it. Must be at least SUDDEN_DEATH_ROUND.
export const ROUND_TRACK = 18;
// The table may agree on another Sudden Death round before setup (rules-decisions 93): any from this to ROUND_TRACK.
export const SUDDEN_DEATH_EARLIEST = 12;
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
// Opening truce (rules-decisions 65): no attacks of any kind until this many rounds have finished (0 = off). Without it,
// the first seats move out before anyone else and are the easiest early targets (seat 1 won 10.9% at 8 players).
export const OPENING = { truceRounds: 1 };

// Trade offer (rules-decisions 60): instead of playing a Hand Card, offer another player 1 of your resources
// for 1 of a different kind of theirs; they accept or refuse. One offer per turn. A refused offer still uses
// your action when this is true; set it false to let a refused trader still play a card.
export const TRADE = { offer: true, refusedUsesAction: true };

// Safety cap on blows in one Challenge fight or duel (each blow is at least 1 damage, so real fights end long before).
export const MAX_FIGHT_BLOWS = 60;

// Grito de Guerra markers in the box (rules-decisions 87): Brasador can have at most this many players marked at once;
// with every marker out, Grito de Guerra waits until one is used up.
export const GRITO_MARKERS = 2;

// Specter (Section 10).
export const SPECTER_CHOICES = 5;

// Balance knobs (rulebook values by default). Objects so balance experiments can adjust them.
export const TUNING = {
  tileAlone: 3,          // resources from a tile when you're alone on it
  tileShared: 2,         // ...when someone else is there too
  maxDamage: 99,         // cap on the damage of one attack (99 = no cap)
  // Big tables (rules-decisions 77, 87): from this many players, your Heart Tokens count as at most bigTableHeartCap
  // when you deal damage (basic attacks, Challenge blows, the Sudden Death duel); bonuses still add on top.
  bigTablePlayers: 6,
  bigTableHeartCap: 2,
  // The Throne's sanctuary protects only players eligible to claim (rules-decisions 76). false = everyone (the old rule).
  sanctuaryEligibleOnly: true,
  // You may not end your own move on the Throne unless you are eligible to claim; passing through is fine and a
  // rival's card may still put you there (rules-decisions 87). false = anyone may stop there (the old rule).
  throneEntryEligibleOnly: true,
  // On death: 'onePool' = lose half (rounded down) of one pool you choose (the rulebook);
  // 'allHalfUp' = lose half (rounded up) of every pool (an experiment).
  deathLoss: 'onePool' as 'onePool' | 'allHalfUp',
  // Reckoning bonus (rules-decisions 71): 'eachPillar' = steal 1 of each pillar, taking from their other pools for any
  // they have none of (the rule); 'one' = steal 1 from one pool of your choice (the old rule).
  reckoningSteal: 'eachPillar' as 'one' | 'eachPillar',
  // When the Reckoning bonus is taken: 'before' the death loss (the rule, 71), 'after' it (the old rule), or 'fromLoss'
  // (out of the tokens the dying player loses, which go to the avenger instead of the supply).
  reckoningTiming: 'before' as 'after' | 'before' | 'fromLoss',
  // Whoever plays a card (on their turn or anyone's: a Block, Reaction or Counterspell too) draws back up to 3 as soon
  // as the action it was played in is over (rules-decisions 73). false = only at the end of your own turn.
  refillOnPlay: true,
  specterChoices: SPECTER_CHOICES,
};

// Bots
export const BOT_THINK_MS = 450;
