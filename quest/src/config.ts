// Every tunable number for the quest lives here. Nothing in this file touches Phaser or the DOM.

/** Logical screen size (Game Boy Advance). The canvas is scaled up by a whole number. */
export const VIEW_WIDTH = 240;
export const VIEW_HEIGHT = 160;

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

/** Gamepad stick dead zone (0..1). */
export const GAMEPAD_DEADZONE = 0.45;

/** Touch overlay button size in CSS pixels (well above the 44 px minimum). */
export const TOUCH_BUTTON_PX = 64;
export const TOUCH_DPAD_PX = 156;

/** Save storage. Bump SAVE_VERSION when the save shape changes. */
export const SAVE_STORAGE_KEY = 'bloodlines-quest.save';
export const SAVE_VERSION = 1;
export const SAVE_CODE_PREFIX = 'BQ';

/** Where a new game starts. */
export const START_MAP_ID = 'test-village';
export const START_SPAWN = 'start';

/** How long a toast message stays on screen. */
export const TOAST_MS = 2200;

/** Largest whole-number zoom we ever use (keeps very large monitors sane). */
export const MAX_ZOOM = 8;
