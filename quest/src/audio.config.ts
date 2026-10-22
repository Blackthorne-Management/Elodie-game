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
  // Yucayeque, Xaraguá (Chapter 2; the owner's tracks, Oct 16).
  yucayeque: { file: 'audio/music/yucayeque.mp3', loop: true, overlapS: 2.5 },
  areito: { file: 'audio/music/areito.mp3', loop: true, overlapS: 2.5 },
  caney: { file: 'audio/music/caney.mp3', loop: true, overlapS: 3 },
  mountain_path: { file: 'audio/music/mountain-path.mp3', loop: true, overlapS: 3 },
  crown_customs: { file: 'audio/music/crown-customs.mp3', loop: true, overlapS: 2.5 },
  // Ardencia (Chapter 3): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md). Cenizal plays the
  // hall's music, the flats the mountain path's; Rael's low-brass theme slot plays under the trial and the reveal.
  ardencia: { file: 'audio/music/hall.mp3', loop: true, overlapS: 2.5 },
  cinder_flats: { file: 'audio/music/mountain-path.mp3', loop: true, overlapS: 3 },
  rael_theme: { file: 'audio/music/crown-customs.mp3', loop: true, overlapS: 2.5 },
  // Al-Doria (Chapter 4): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md). The bazaar plays the
  // city's market music, the Majlis the hall's, the vault the Echo's, the Desert Edge the cane road's.
  aldoria: { file: 'audio/music/city.mp3', loop: true, overlapS: 2.5 },
  majlis: { file: 'audio/music/hall.mp3', loop: true, overlapS: 2.5 },
  guild_vault: { file: 'audio/music/echo.mp3', loop: true, overlapS: 3.5 },
  desert_edge: { file: 'audio/music/cane-road.mp3', loop: true, overlapS: 3.5 },
  // Eightgate (Chapter 5): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md). The Concourse and the
  // Quarter play the farewell track, the Throne Hall the Crown's march (the Regent), the Archive the Echo's (a clock in
  // the silence, when it comes), the fields the cane road's.
  seat: { file: 'audio/music/farewell.mp3', loop: true, overlapS: 2.5 },
  throne_hall: { file: 'audio/music/crown-customs.mp3', loop: true, overlapS: 2.5 },
  throne_archive: { file: 'audio/music/echo.mp3', loop: true, overlapS: 3.5 },
  crossroads: { file: 'audio/music/cane-road.mp3', loop: true, overlapS: 3.5 },
  // The War of the Harbor (Chapter 11): a slot until the owner's track arrives (docs/quest/AUDIO-PROMPTS.md); the march of
  // the mountain path's drums under the war's day and dusk.
  harbor_war: { file: 'audio/music/mountain-path.mp3', loop: true, overlapS: 3 },
  // The Claim and the Hearing (Chapter 12): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md). The Claim
  // keeps the Hall's march; the Hearing is the game's theme "again, quietly" (the farewell track until the owner's score).
  hearing: { file: 'audio/music/farewell.mp3', loop: true, overlapS: 3 },
} as const satisfies Record<string, MusicTrack>;

export type MusicId = keyof typeof MUSIC;

/** The song for each map in the present. */
export const MUSIC_BY_MAP: Readonly<Record<string, MusicId>> = {
  'zetwal-town': 'festival',
  'zetwal-market': 'city',
  'zetwal-harbor': 'city',
  'zetwal-square': 'city',
  'zetwal-mill': 'city',
  'zetwal-heights': 'city',
  'zetwal-house': 'home',
  'zetwal-temple': 'temple',
  'zetwal-archive': 'temple',
  'zetwal-hall': 'hall',
  'zetwal-road': 'cane_road',
  // Xaraguá (docs/quest/AUDIO-PROMPTS.md, tracks 11 to 15).
  'xaragua-village': 'yucayeque',
  'xaragua-beach': 'yucayeque',
  'xaragua-conuco': 'yucayeque',
  'xaragua-plaza': 'areito',
  'xaragua-caney': 'caney',
  'xaragua-song': 'caney',
  'xaragua-mountain': 'mountain_path',
  'xaragua-camp': 'mountain_path',
  'xaragua-customs': 'crown_customs',
  'xaragua-cave': 'mountain_path',
  'xaragua-record': 'caney',
  'xaragua-cellar': 'crown_customs',
  'xaragua-seacave': 'mountain_path',
  'ardencia-flats': 'cinder_flats',
  'ardencia-town': 'ardencia',
  'ardencia-alcazar': 'ardencia',
  'ardencia-lower': 'ardencia',
  'ardencia-library': 'ardencia',
  'ardencia-forge': 'cinder_flats',
  'ardencia-tunnel': 'cinder_flats',
  'ardencia-camp': 'farewell',
  'aldoria-quay': 'aldoria',
  'aldoria-bazaar': 'aldoria',
  'aldoria-majlis': 'majlis',
  'aldoria-ledgers': 'majlis',
  'aldoria-vault': 'guild_vault',
  'aldoria-desert': 'desert_edge',
  'seat-gateyard': 'seat',
  'seat-concourse': 'seat',
  'seat-quarter': 'seat',
  'seat-workshop': 'home',
  'seat-rooms': 'home',
  'seat-hall': 'throne_hall',
  'seat-archive': 'throne_archive',
  'seat-fields': 'crossroads',
  // Ordvik (Chapter 6): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md): the fair plays the farewell
  // track, the Moot the hall's, the Saga Tent home, the plateau and the quay the cane road's, the fjord the Echo's.
  'skarragol-fair': 'seat',
  'skarragol-moot': 'majlis',
  'skarragol-saga': 'home',
  'skarragol-plateau': 'crossroads',
  'skarragol-quay': 'crossroads',
  'skarragol-fjord': 'throne_archive',
  // Kirinoura (Chapter 7): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md): the quarter and the
  // pier play the farewell track, the Hall the hall's, the library home, the maze, the marsh and the file house the
  // Echo's.
  'kuroshi-quarter': 'seat',
  'kuroshi-pier': 'crossroads',
  'kuroshi-hall': 'majlis',
  'kuroshi-library': 'home',
  'kuroshi-fogmaze': 'throne_archive',
  'kuroshi-marsh': 'throne_archive',
  'kuroshi-filehouse': 'throne_archive',
  // Agnipur (Chapter 8): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md): the bazaar and the quay
  // play the farewell track, the Court the hall's, the library home, the roofs and the flats the crossroads.
  'jwaladesh-harbor': 'crossroads',
  'jwaladesh-bazaar': 'seat',
  'jwaladesh-rooftops': 'crossroads',
  'jwaladesh-library': 'home',
  'jwaladesh-court': 'majlis',
  'jwaladesh-saltflats': 'crossroads',
  // Kingsmere (Chapter 9): slots until the owner's tracks arrive (docs/quest/AUDIO-PROMPTS.md): the square plays the
  // farewell track, the keep and the court the hall's, the church the archive's, the heath and the close the crossroads.
  'aldermoor-heath': 'crossroads',
  'aldermoor-cross': 'seat',
  'aldermoor-rolls': 'home',
  'aldermoor-keep': 'majlis',
  'aldermoor-close': 'crossroads',
  'aldermoor-cathedral': 'throne_archive',
};

/**
 * Yucayeque occupied (Chapter 2, after the Crown attack): the Crown's march over the town, the cave stays quiet. Chapter 11
 * first (the first that holds plays): the war's day and dusk, then the free harbor's own song once it is taken.
 */
export const MUSIC_OVERRIDES: readonly { maps: readonly string[]; if: Condition; music: MusicId }[] = [
  // Chapter 12: the Hearing and the afternoon after it (the theme, quietly), in the Hall and on the Concourse.
  {
    maps: ['seat-hall', 'seat-concourse'],
    if: { flag: 'story.hearing_called' },
    music: 'hearing',
  },
  {
    maps: ['xaragua-village', 'xaragua-beach', 'xaragua-conuco', 'xaragua-plaza', 'xaragua-caney'],
    if: { flag: 'story.harbor_taken' },
    music: 'yucayeque',
  },
  {
    maps: ['xaragua-village', 'xaragua-beach', 'xaragua-conuco', 'xaragua-mountain', 'xaragua-camp'],
    if: { all: [{ flag: 'story.war_begun' }, { notFlag: 'story.harbor_taken' }] },
    music: 'harbor_war',
  },
  {
    maps: ['xaragua-village', 'xaragua-beach', 'xaragua-conuco', 'xaragua-plaza', 'xaragua-caney'],
    if: { flag: 'story.crown_attack' },
    music: 'crown_customs',
  },
];

/** Inside any memory. */
export const ECHO_MUSIC: MusicId = 'echo';
export const BATTLE_MUSIC: MusicId = 'battle';
export const VICTORY_MUSIC: MusicId = 'victory';
/** Under the goddess on the Game Over screen (the Temple's song until she has a track of her own). */
export const GAME_OVER_MUSIC: MusicId = 'temple';
/**
 * The animator's bell for the Game Over screen (shot 3 and the Rise), by path under quest/art/ (like
 * assets.config.ts GAME_OVER_ART). Until the file is there, the made sound `bell` plays.
 */
export const GAME_OVER_BELL_FILE = 'gameover/gameover-bell.wav';

/** A song for the length of a conversation (while its condition holds when it starts). */
export interface DialogueMusic {
  dialogue: string;
  if?: Condition;
  music: MusicId;
}

export const DIALOGUE_MUSIC: readonly DialogueMusic[] = [
  // Seeing Mother off at the gate (her speech on the stage keeps the festival playing).
  { dialogue: 'elodie_talk', if: { flag: 'story.heard_speech' }, music: 'farewell' },
  // Rael's theme under the trial's opening and the winner's question.
  { dialogue: 'trial_start', music: 'rael_theme' },
  { dialogue: 'rael_after', music: 'rael_theme' },
  // The caravan at first light: the farewell, until Al-Doria has its own track.
  { dialogue: 'caravan_dawn', music: 'farewell' },
];

/** The song under an act's end card, by card id (data/cards.ts). */
export const CARD_MUSIC: Readonly<Record<string, MusicId>> = {
  act1_end: 'farewell',
};

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
  'drum',
  // The Game Over screen: the low note as the party falls, and the goddess's soft bell.
  'fall',
  'bell',
  // Chapter 10, the Muster: the Marshal's whistle (two notes, high and low: the Echo and the dusk hear the same), and the
  // harbor chain's capstan, heard from the Hall (an off-screen event: sound and a shake).
  'whistle',
  'ratchet',
  // Chapter 11, the War of the Harbor: a cannon (the headland gun, the Patience's ports: in view's edge or off it), the
  // fleet's volley, the chain running out of the old post's capstan, and the head runner's conch.
  'cannon',
  'volley',
  'chain',
  'conch',
  // Chapter 12: the Hall's bell above the heralds' stair, heard once (an off-screen event at the Iron Throne's verdict).
  'hall_bell',
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
