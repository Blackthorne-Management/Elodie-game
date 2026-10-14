// Every tunable number for the quest lives here. Nothing in this file touches Phaser or the DOM.

/**
 * Logical screen size: 16:9, so it fills landscape phones and TVs (20 x 11.25 tiles of 16 px). The
 * canvas is scaled up by a whole number where it can be (see MIN_INTEGER_ZOOM).
 */
export const VIEW_WIDTH = 320;
export const VIEW_HEIGHT = 180;

/** Map grid. */
export const TILE_SIZE = 16;

/** Player and NPC sprite cell (wider than tall sprites stand on the bottom of their tile). */
export const CHARACTER_WIDTH = 16;
export const CHARACTER_HEIGHT = 24;

/** Milliseconds to cross one tile. */
export const WALK_MS_PER_TILE = 220;
export const RUN_MS_PER_TILE = 120;

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
export const TOUCH_BUTTON_PX = 64;

/**
 * The touch analog stick (src/input/touch.ts): the base ring's diameter in CSS pixels (it shrinks
 * toward the minimum on short screens), and the knob's. The knob travels up to the ring's radius.
 */
export const TOUCH_STICK_PX = 148;
export const TOUCH_STICK_MIN_PX = 120;
export const TOUCH_KNOB_PX = 56;
/** The stick appears under the thumb anywhere in this fraction of the screen width, from the left. */
export const TOUCH_STICK_ZONE = 1 / 3;
/** Dead zone and run threshold, as fractions of the knob's travel. */
export const STICK_DEADZONE = 0.25;
export const STICK_RUN = 0.85;

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

/** Anissa's hints (guide 6.2 rule 4): first hint after 3 minutes stuck on one objective, then every 90 s. */
export const HINT_FIRST_MS = 3 * 60 * 1000;
export const HINT_REPEAT_MS = 90 * 1000;
/** How long a hint stays on screen. */
export const HINT_SHOW_MS = 7000;
