// Every tunable number for the quest lives here. Nothing in this file touches Phaser or the DOM.

/**
 * Logical screen size: 16:9, so it fills landscape phones and TVs (20 x 11.25 tiles of 16 px). The
 * canvas is scaled up by a whole number where it can be (see MIN_INTEGER_ZOOM).
 */
export const VIEW_WIDTH = 320;
export const VIEW_HEIGHT = 180;

/** Map grid. */
export const TILE_SIZE = 16;

/**
 * Player and NPC sprite cell: 24 x 32, chibi proportions (the head about 40 % of the height). A
 * character stands with the feet on the bottom row of the cell, on the bottom edge of their tile,
 * centred on it (so they overlap the tiles beside and above, drawn in front by depth).
 */
export const CHARACTER_WIDTH = 24;
export const CHARACTER_HEIGHT = 32;

/**
 * Movement speed in tiles per second (16 px tiles): walking and running. The speed is the same in
 * pixels in every direction, so a diagonal step (16 * sqrt 2 px) takes about 1.41 times as long.
 * Walk 4.5 = 72 px/s, run 8 = 128 px/s.
 */
export const WALK_TILES_PER_SECOND = 4.5;
export const RUN_TILES_PER_SECOND = 8;

/**
 * A direction pressed this close (in ms) to the end of a step is kept and taken the moment the step
 * ends, so a quick tap just before arriving is not lost. A held direction needs no buffer: the next
 * step starts exactly where the last one ended, carrying the leftover distance.
 */
export const STEP_BUFFER_MS = 90;

/**
 * The walk cycle, by distance walked (not time): step A, stand, step B, stand, one full cycle per this
 * many pixels (two tiles). It carries on across tiles and only stops when the walker does.
 */
export const WALK_CYCLE_PX = 32;

/**
 * Random encounters in a capital's wild section (map layer `encounters`): the chance per step once the
 * grace steps have passed, and how many steps are always safe after arriving on a map or after a fight.
 * About one fight every 50 steps (the first owner test found one every 25 to 30 far too often).
 */
export const ENCOUNTER_CHANCE_PER_STEP = 0.03;
export const ENCOUNTER_GRACE_STEPS = 18;

/** Gold in Gianna's purse at the start, and how many items the bag holds (key items and worn gear are free). */
export const STARTING_GOLD = 150;
export const BAG_LIMIT = 24;

/**
 * Levelling (engine/rpg.ts). XP to reach level n is round(XP_BASE * (n - 1) ^ XP_EXPONENT): level 2 at
 * 50, 3 at 152, 4 at 290, 5 at 459, 10 at 1683, 30 at about 11,000. Chapter 1 gives about 380 XP
 * (level 3 to 4). Gear worn below its level gives GEAR_UNDERLEVEL_SHARE of its bonus. A foe's level
 * against yours: TRIVIAL or more below is grey, HARD or more above is orange, DEADLY or more is red.
 */
export const LEVELS = {
  cap: 30,
  xpBase: 50,
  xpExponent: 1.6,
  gearUnderlevelShare: 0.5,
  bands: { trivial: 3, hard: 2, deadly: 5 },
} as const;
/** Shared XP: each main-quest step done, and each lore book read. */
export const XP_PER_OBJECTIVE = 25;
export const XP_PER_BOOK = 10;

/** The minimap (src/ui/SideMap.ts): how many tiles it shows across and down (CSS sizes it per layout). */
export const SIDE_MAP = { tilesW: 32, tilesH: 24 } as const;

/** Typewriter speeds in characters per second. `instant` shows the whole line at once. */
export const TEXT_SPEEDS = {
  slow: 20,
  normal: 45,
  fast: 90,
  instant: Number.POSITIVE_INFINITY,
} as const;
export type TextSpeed = keyof typeof TEXT_SPEEDS;
export const TEXT_SPEED_ORDER: readonly TextSpeed[] = ['slow', 'normal', 'fast', 'instant'];
export const DEFAULT_TEXT_SPEED: TextSpeed = 'normal';

/** Gamepad left stick dead zone (0..1, how far the stick must lean before it moves). */
export const GAMEPAD_DEADZONE = 0.45;

/** Touch overlay button size in CSS pixels (well above the 44 px minimum). */
export const TOUCH_BUTTON_PX = 56;

/**
 * The touch D-pad (src/input/touch.ts), in CSS pixels: eight directions (press between two arms for
 * a diagonal). The dead zone is the fraction of its radius in the middle that does nothing.
 */
export const TOUCH_PAD_PX = 132;
export const PAD_DEADZONE = 0.22;

/**
 * Where the controls and the minimap go (engine/scaling.ts screenLayout). On a touch screen held
 * sideways the D-pad takes the left bar and A, B, Echo, Menu and the minimap the right bar; each bar
 * is at least TOUCH_SIDE_PX wide (the picture shrinks a little when the screen's own bars are
 * narrower). Held upright, the controls take a bottom bar of at least TOUCH_STACK_PX and the minimap
 * the top bar. Without touch, the minimap goes in a side bar at least MAP_BAR_PX wide, else on the
 * picture's top-left corner.
 */
export const TOUCH_SIDE_PX = 150;
export const TOUCH_STACK_PX = 176;
export const MAP_BAR_PX = 140;

/** Save storage. Bump SAVE_VERSION when the save shape changes. */
export const SAVE_STORAGE_KEY = 'bloodlines-quest.save';
export const SAVE_VERSION = 2;
export const SAVE_CODE_PREFIX = 'BQ';

/** Where a new game starts. */
export const START_MAP_ID = 'zetwal-town';
export const START_SPAWN = 'start';

/** How long a toast message stays on screen. */
export const TOAST_MS = 2200;

/** Largest whole-number zoom we ever use (keeps very large monitors sane). */
export const MAX_ZOOM = 8;
/** Below this whole-number zoom the picture uses the exact (non-integer) fit instead, so it fills small screens. */
export const MIN_INTEGER_ZOOM = 2;

/**
 * The game is drawn at a whole multiple of 320 x 180 matched to the screen (zoom x device pixel
 * ratio), so text is sharp (ui/text.ts); this caps it (a 4x canvas is 1280 x 720 pixels).
 */
export const RENDER_SCALE_MAX = 4;

/**
 * The animated intro (docs/quest/intro/STORYBOARD.md, "Delivered"): the title is complete and Press A
 * first shows at 87.0 s; the video ends two blink cycles later at 91.0 s, so the title loops 87.0 to 91.0.
 */
export const INTRO_TITLE_LOOP_START_S = 87.0;
export const INTRO_END_S = 91.0;
/** Jump back to the loop start this close to the end (a frame and a half at 24 fps), before the video stops. */
export const INTRO_LOOP_MARGIN_S = 0.06;

/** Anissa's hints (guide 6.2 rule 4): first hint after 3 minutes stuck on one objective, then every 90 s. */
export const HINT_FIRST_MS = 3 * 60 * 1000;
export const HINT_REPEAT_MS = 90 * 1000;
/** How long a hint stays on screen. */
export const HINT_SHOW_MS = 7000;

// ---- Battles (docs/quest/design/COMBAT.md; engine/battle.ts) ----------------------------------------

/** Turn order: after acting, a fighter waits round(TURN_DELAY_K / (SPD + TURN_DELAY_OFFSET)) x the action's weight. */
export const TURN_DELAY_K = 1200;
export const TURN_DELAY_OFFSET = 30;
export const ACTION_WEIGHT = { attack: 1, skill: 1, item: 0.8, guard: 0.6 } as const;
/** Damage variance: x U(1 - v, 1 + v). */
export const DAMAGE_VARIANCE = 0.08;
/** Hit chance (physical): HIT_BASE + (SPD difference) / 2, clamped. Crit: CRIT_BASE + (SPD difference) / 4. */
export const HIT_BASE = 95;
export const HIT_MIN = 75;
export const HIT_MAX = 99;
export const CRIT_BASE = 5;
export const CRIT_MIN = 2;
export const CRIT_MAX = 25;
export const CRIT_MULT = 1.5;
/** A hit always does at least this share of its raw power. */
export const MIN_DAMAGE_SHARE = 0.15;
export const GUARD_MULT = 0.5;
/** Status effects (COMBAT 10): how many of the affected fighter's own turns they last, and what they do. */
export const STATUS = {
  inspired: { turns: 3, dealt: 1.25, taken: 1, regen: 0, spd: 1, taunt: false, bad: false },
  weakened: { turns: 3, dealt: 0.75, taken: 1, regen: 0, spd: 1, taunt: false, bad: true },
  marked: { turns: 3, dealt: 1, taken: 1.25, regen: 0, spd: 1, taunt: false, bad: true },
  /** Ward: damage taken x0.75 (a Chapter 1 proposal; Aldermoor's Ward of Patience is the party-wide one). */
  warded: { turns: 3, dealt: 1, taken: 0.75, regen: 0, spd: 1, taunt: false, bad: false },
  regen: { turns: 3, dealt: 1, taken: 1, regen: 0.08, spd: 1, taunt: false, bad: false },
  /** Slowed (COMBAT's Chilled): SPD x0.7, so turns come later. */
  slowed: { turns: 3, dealt: 1, taken: 1, regen: 0, spd: 0.7, taunt: false, bad: true },
  /** Taunting: foes' one-target attacks go to this fighter first. */
  taunting: { turns: 2, dealt: 1, taken: 1, regen: 0, spd: 1, taunt: true, bad: false },
} as const;
/**
 * Spell slots (owner, Oct 15): a mage equips only this many of the spells she knows (the level at which
 * each count starts). Skills that come with rare or better gear are free: they never take a slot.
 */
export const SPELL_SLOTS: readonly { level: number; slots: number }[] = [
  { level: 1, slots: 4 },
  { level: 10, slots: 5 },
  { level: 20, slots: 6 },
];
/** A mage's Attack with a plain staff: a bash at this power (100 with a bladed or spiked staff). */
export const MAGE_BASH_POWER = 70;
/** Fighters in a battle at once (owner, Oct 15): up to 8 in the party, 4 fight, the rest wait to swap in. */
export const BATTLE_ACTIVE = 4;
/** A fighter who swaps in (or replaces a fallen one) waits this share of a full turn before acting. */
export const SWAP_IN_DELAY = 0.5;
/** Elemental weakness and resistance (COMBAT 5). */
export const ELEMENT_WEAK = 1.5;
export const ELEMENT_RESIST = 0.5;
/** Anissa's Spark: per Gianna action, per Guard; a Surge spends SURGE_COST and multiplies the next hit. */
export const SPARK_ON_ACT = 1;
export const SPARK_ON_GUARD = 2;
export const SPARK_MAX = 10;
export const SURGE_COST = 5;
export const SURGE_MULT = 1.5;
/** Anissa's Light (owner decision, Oct 15): every N of Gianna's turns, Anissa restores this share of her max SP. */
export const ANISSA_SP_EVERY = 3;
export const ANISSA_SP_SHARE = 0.2;
/** Gianna's skills cost this much less SP (rounded down, at least 1). */
export const GIANNA_SP_DISCOUNT = 0.25;
/** The Heir Rises: losing restarts the fight with a Grudge, +GRUDGE_STEP damage each time up to GRUDGE_MAX. */
export const GRUDGE_STEP = 0.1;
export const GRUDGE_MAX = 0.3;
/** Story difficulty (the default): enemies hit softer and have less HP. */
export const DIFFICULTY = { story: { enemyDamage: 0.7, enemyHp: 0.8 } } as const;
/** Enemy stat lines by level: base + per level, then the role's multipliers. */
export const ENEMY_STAT_LINE = { hp: [12, 9], atk: [7, 2.5], def: [4, 1.5], mag: [6, 2.4], spd: [8, 0.8] } as const;
export const ENEMY_ROLE = {
  skirmisher: { hp: 0.8, atk: 1, def: 0.8, mag: 0.6, spd: 1.3, xp: 1 },
  brute: { hp: 1.4, atk: 1.2, def: 1, mag: 0.5, spd: 0.8, xp: 1.25 },
  tank: { hp: 1.5, atk: 0.9, def: 1.5, mag: 0.5, spd: 0.7, xp: 1.25 },
  caster: { hp: 0.8, atk: 0.6, def: 0.7, mag: 1.3, spd: 1, xp: 1 },
} as const;
/** SP back after a battle (a share of max). */
export const SP_AFTER_BATTLE = 0.1;

// ---- Street debates (guide 7.2; engine/debate.ts; owner approved the numbers Oct 16) -----------------

/** Concord, the realm's harmony score (0 to 100), before anything moves it. */
export const CONCORD_START = 50;
/** Rounds won (a strong answer) out of three to win a debate. */
export const DEBATE_ROUNDS_TO_WIN = 2;
/** Influence in the debate's city needed to Mediate. */
export const DEBATE_MEDIATE_INFLUENCE = 5;
/** Influence for listening to a debate the first time. */
export const DEBATE_LISTEN_INFLUENCE = 1;
/** Each outcome's reward, paid once per debate. */
export const DEBATE_REWARDS: Readonly<Record<'won' | 'mediated' | 'provoked', { concord: number; influence?: number; fear?: number; xp?: number }>> = {
  won: { concord: 5, influence: 1, xp: 15 },
  mediated: { concord: 10, influence: 1, xp: 25 },
  provoked: { concord: -5, fear: 1 },
};
