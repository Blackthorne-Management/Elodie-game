// Every piece of music and every sound the quest plays, in one place (QUEST-BUILD-GUIDE note 9: replacing
// a track never touches game code). The music is the owner's (generated Oct 16, prompts in
// docs/quest/AUDIO-PROMPTS.md; originals in docs/quest/audio/, 128 kbps game copies in public/audio/music/).
// The sound effects are made by the game itself (src/audio/sfx.ts); a file listed in SFX_FILES replaces one.

import type { Condition } from './engine/conditions.ts';

export interface MusicTrack {
  /** Path under public/ (the page's folder). */
  file: string;
  /** Loops forever (a fanfare plays once). */
  loop: boolean;
  /**
   * Seconds the end of one pass overlaps the start of the next. The generated tracks fade out at their
   * end, so each pass fades into the next instead of dropping to silence.
   */
  overlapS: number;
}

export const MUSIC = {
  festival: { file: 'audio/music/festival.mp3', loop: true, overlapS: 2.5 },
  city: { file: 'audio/music/city.mp3', loop: true, overlapS: 2.5 },
  home: { file: 'audio/music/home.mp3', loop: true, overlapS: 3.5 },
  temple: { file: 'audio/music/temple.mp3', loop: true, overlapS: 2.5 },
  hall: { file: 'audio/music/hall.mp3', loop: true, overlapS: 2.5 },
  echo: { file: 'audio/music/echo.mp3', loop: true, overlapS: 3.5 },
  cane_road: { file: 'audio/music/cane-road.mp3', loop: true, overlapS: 3.5 },
  battle: { file: 'audio/music/battle.mp3', loop: true, overlapS: 2 },
  victory: { file: 'audio/music/victory.mp3', loop: false, overlapS: 0 },
  farewell: { file: 'audio/music/farewell.mp3', loop: true, overlapS: 2.5 },
} as const satisfies Record<string, MusicTrack>;

export type MusicId = keyof typeof MUSIC;

/** The song for each map in the present. */
export const MUSIC_BY_MAP: Readonly<Record<string, MusicId>> = {
  'zetwal-town': 'festival',
  'zetwal-market': 'city',
  'zetwal-harbor': 'city',
  'zetwal-square': 'city',
  'zetwal-heights': 'city',
  'zetwal-house': 'home',
  'zetwal-temple': 'temple',
  'zetwal-archive': 'temple',
  'zetwal-hall': 'hall',
  'zetwal-road': 'cane_road',
};

/** Inside any memory. */
export const ECHO_MUSIC: MusicId = 'echo';
export const BATTLE_MUSIC: MusicId = 'battle';
export const VICTORY_MUSIC: MusicId = 'victory';

/** A song for the length of a conversation (while its condition holds when it starts). */
export interface DialogueMusic {
  dialogue: string;
  if?: Condition;
  music: MusicId;
}

export const DIALOGUE_MUSIC: readonly DialogueMusic[] = [
  // Seeing Mother off at the gate (her speech on the stage keeps the festival playing).
  { dialogue: 'elodie_talk', if: { flag: 'story.heard_speech' }, music: 'farewell' },
];

/** Seconds a song takes to fade out when another takes over (and the new one to fade in). */
export const MUSIC_FADE_S = 0.8;

/** The sound effects (each one made by src/audio/sfx.ts). */
export const SFX_IDS = [
  'cursor',
  'confirm',
  'cancel',
  'door',
  'bump',
  'echo_in',
  'echo_out',
  'item',
  'coins',
  'quest',
  'level_up',
  'save',
  'hit',
  'crit',
  'heal',
  'miss',
  'enemy_down',
  'ally_down',
  'surge',
  'run',
  'tick',
] as const;

export type SfxId = (typeof SFX_IDS)[number];

/** A sound file that replaces a made sound (path under public/). None yet. */
export const SFX_FILES: Partial<Record<SfxId, string>> = {};

/**
 * Wordless voices: each speaker "talks" in short blips at their own pitch (Hz) while their line types out.
 * A speaker not listed gets a pitch from their id (engine/audioPlan.ts voicePitch).
 */
export const VOICE_PITCH: Readonly<Record<string, number>> = {
  gianna: 520,
  anissa: 700,
  anissa_far: 700,
  elodie: 440,
  anicette: 380,
  patricio: 260,
  patricio_old: 230,
  yari: 330,
  solange: 360,
};

/** Default volumes (0 to 1) until the player changes them in the System menu. */
export const DEFAULT_VOLUME = { music: 0.6, sound: 0.8 } as const;
/** The steps the System menu cycles through. */
export const VOLUME_STEPS = [0, 0.25, 0.5, 0.75, 1] as const;
