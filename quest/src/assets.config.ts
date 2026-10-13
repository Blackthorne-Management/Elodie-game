// Every visual in the quest is defined here. Phase 1 uses placeholder colours only: the Boot scene
// draws these into textures at start-up, so no image files are needed. When real pixel art arrives,
// swap an entry for an image path and the scenes keep working through the same keys.

/** Pattern drawn on top of a placeholder tile's base colour so tiles read at a glance. */
export type TilePattern = 'flat' | 'dots' | 'grid' | 'stripes' | 'cross' | 'border' | 'blob' | 'wave';

export interface PlaceholderTile {
  /** Tiled tile id + 1 (the gid when the tileset's firstgid is 1). */
  gid: number;
  name: string;
  base: number;
  accent: number;
  pattern: TilePattern;
}

/** The placeholder tileset. Its name must match the tileset `name` inside each .tmj file. */
export const TILESET = {
  name: 'placeholder',
  textureKey: 'tiles-placeholder',
  columns: 8,
  tiles: [
    { gid: 1, name: 'grass', base: 0x4f9a4a, accent: 0x5fae58, pattern: 'dots' },
    { gid: 2, name: 'grass_dark', base: 0x3f8040, accent: 0x4f9a4a, pattern: 'dots' },
    { gid: 3, name: 'path', base: 0xc9a66b, accent: 0xb48f55, pattern: 'dots' },
    { gid: 4, name: 'water', base: 0x3a6fb8, accent: 0x6b9be0, pattern: 'wave' },
    { gid: 5, name: 'tree', base: 0x2a5e2f, accent: 0x1b4020, pattern: 'blob' },
    { gid: 6, name: 'wall', base: 0x9a8a78, accent: 0x6e6152, pattern: 'grid' },
    { gid: 7, name: 'roof', base: 0xa04040, accent: 0x7a2e2e, pattern: 'stripes' },
    { gid: 8, name: 'door', base: 0x6b4426, accent: 0x3e2614, pattern: 'border' },
    { gid: 9, name: 'floor', base: 0xb98d5a, accent: 0x9c7446, pattern: 'stripes' },
    { gid: 10, name: 'flowers', base: 0x4f9a4a, accent: 0xf2d04b, pattern: 'dots' },
    { gid: 11, name: 'stone', base: 0xb8b8c4, accent: 0x8e8e9c, pattern: 'grid' },
    { gid: 12, name: 'sand', base: 0xd8c08a, accent: 0xc4a96e, pattern: 'dots' },
    { gid: 13, name: 'ruin', base: 0x8a7a68, accent: 0x5e5244, pattern: 'cross' },
    { gid: 14, name: 'fence', base: 0x4f9a4a, accent: 0x7a5530, pattern: 'stripes' },
    { gid: 15, name: 'rug', base: 0x8a3050, accent: 0xd8b04a, pattern: 'border' },
    { gid: 16, name: 'solid', base: 0xff00ff, accent: 0x000000, pattern: 'cross' },
    { gid: 17, name: 'grass_old', base: 0x9a8f4a, accent: 0xb0a45a, pattern: 'dots' },
    { gid: 18, name: 'path_old', base: 0xb89a6a, accent: 0x9c8050, pattern: 'dots' },
    { gid: 19, name: 'sign', base: 0x7a5530, accent: 0xe8d8b0, pattern: 'border' },
    { gid: 20, name: 'bush', base: 0x356f35, accent: 0x4f9a4a, pattern: 'blob' },
    { gid: 21, name: 'canopy', base: 0x2a5e2f, accent: 0x3b7a3e, pattern: 'blob' },
    { gid: 22, name: 'shrine', base: 0xe8e0c8, accent: 0xd8a83a, pattern: 'border' },
    { gid: 23, name: 'tent', base: 0xc8b07a, accent: 0x8a6a3a, pattern: 'stripes' },
    { gid: 24, name: 'barrel', base: 0x7a5530, accent: 0x4a3018, pattern: 'grid' },
    // Phase 2: Zetwal.
    { gid: 25, name: 'bridge', base: 0x9c7446, accent: 0x5e4424, pattern: 'stripes' },
    { gid: 26, name: 'rope_broken', base: 0x3a6fb8, accent: 0xc8b07a, pattern: 'cross' },
    { gid: 27, name: 'cliff', base: 0x6e6152, accent: 0x4e4436, pattern: 'grid' },
    { gid: 28, name: 'stall', base: 0xd06a3a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 29, name: 'lantern', base: 0xb8b8c4, accent: 0xf2a03a, pattern: 'blob' },
    { gid: 30, name: 'fountain', base: 0x9ad8ff, accent: 0xb8b8c4, pattern: 'border' },
    { gid: 31, name: 'stage', base: 0xa8783e, accent: 0x7a5530, pattern: 'stripes' },
    { gid: 32, name: 'table', base: 0x7a5530, accent: 0x9c7446, pattern: 'border' },
    { gid: 33, name: 'shelf', base: 0x5e3e22, accent: 0xc8b07a, pattern: 'stripes' },
    { gid: 34, name: 'map_table', base: 0x7a5530, accent: 0xe8d8b0, pattern: 'grid' },
    { gid: 35, name: 'winch', base: 0x6e5a40, accent: 0x2a2a2a, pattern: 'cross' },
    { gid: 36, name: 'winch_rust', base: 0x8a4a2a, accent: 0x5e3418, pattern: 'cross' },
    { gid: 37, name: 'pawl', base: 0x4a4a52, accent: 0xc8c8d0, pattern: 'border' },
    { gid: 38, name: 'monument', base: 0xd8d0c0, accent: 0x8e8e9c, pattern: 'border' },
    { gid: 39, name: 'lamp', base: 0x8a7a68, accent: 0x3a3a3a, pattern: 'blob' },
    { gid: 40, name: 'lamp_lit', base: 0xf2d04b, accent: 0xfff8d0, pattern: 'blob' },
    { gid: 41, name: 'dock', base: 0x9c7446, accent: 0x6b4426, pattern: 'stripes' },
    { gid: 42, name: 'canoe', base: 0x3a6fb8, accent: 0x8a5a2a, pattern: 'blob' },
    { gid: 43, name: 'barricade', base: 0x6b4426, accent: 0x3e2614, pattern: 'cross' },
    { gid: 44, name: 'bed', base: 0xe8e0c8, accent: 0x3b4fa8, pattern: 'border' },
    { gid: 45, name: 'window', base: 0x9a8a78, accent: 0x9ad8ff, pattern: 'border' },
    { gid: 46, name: 'seat', base: 0x7a5530, accent: 0xa04040, pattern: 'grid' },
    { gid: 47, name: 'floor_old', base: 0x9c7a50, accent: 0x7a5a38, pattern: 'stripes' },
    { gid: 48, name: 'wall_old', base: 0x7a6a58, accent: 0x5a4c3e, pattern: 'grid' },
    { gid: 49, name: 'temple_wall', base: 0xe8e0c8, accent: 0xc8b890, pattern: 'grid' },
    { gid: 50, name: 'temple_floor', base: 0xd8d0c0, accent: 0xc0b8a8, pattern: 'grid' },
    { gid: 51, name: 'raised_bridge', base: 0x5e4424, accent: 0x2a2a2a, pattern: 'stripes' },
    { gid: 52, name: 'carriage', base: 0x3a2a4a, accent: 0xd8a83a, pattern: 'border' },
    { gid: 53, name: 'name_stone', base: 0xa8a8b0, accent: 0x6e6e7a, pattern: 'stripes' },
    { gid: 54, name: 'scaffold', base: 0x8a6a3a, accent: 0x5e4424, pattern: 'cross' },
    { gid: 55, name: 'paper', base: 0xe8d8b0, accent: 0x7a5530, pattern: 'border' },
    { gid: 56, name: 'bridge_old', base: 0x6e5a40, accent: 0x3e3020, pattern: 'stripes' },
    { gid: 57, name: 'banner', base: 0x4f9a4a, accent: 0xf2d04b, pattern: 'stripes' },
  ] satisfies PlaceholderTile[],
} as const;

/**
 * A 16 x 24 placeholder character: a body block, a head block, a facing marker, and optional hair or
 * headgear (`hat`) or a hood. An Echo ancestor is a palette and headgear swap of the modern sprite
 * (guide 6.1), which is what ECHO_PLAYER_SPRITE does.
 */
export interface PlaceholderCharacter {
  body: number;
  head: number;
  trim: number;
  hat?: number;
  hood?: boolean;
}

/** Gianna in the present. */
export const PLAYER_SPRITE: PlaceholderCharacter = { body: 0x3b4fa8, head: 0x8a5a3a, trim: 0xf2d04b, hat: 0x1a1414 };
/** Young Patricio, the Echo party (a Warden: red revolutionary coat, cap). */
export const ECHO_PLAYER_SPRITE: PlaceholderCharacter = { body: 0x7a2a26, head: 0x6a3a22, trim: 0xd8a83a, hat: 0x2a2420 };

/** NPC looks, keyed by the `look` field of an NPC in data/npcs.ts (and `anissa` for the follower). */
export const NPC_SPRITES: Record<string, PlaceholderCharacter> = {
  villager: { body: 0x6a8a3a, head: 0x7a4a2a, trim: 0xe0e0e0 },
  keeper: { body: 0xe8e0c8, head: 0x6a3a22, trim: 0xd8a83a },
  fisher: { body: 0x3a7a8a, head: 0x9a6a44, trim: 0xc8b07a },
  anissa: { body: 0xe8a8c0, head: 0x6a3a22, trim: 0xf4ecd8, hat: 0x1a1414 },
  elodie: { body: 0xd8a83a, head: 0x6a3a22, trim: 0xf4ecd8, hat: 0x1a1414 },
  anicette: { body: 0x8a3050, head: 0x5a3020, trim: 0xe8e0c8, hat: 0xe8e0c8 },
  patricio_old: { body: 0x7a2a26, head: 0x5a3a22, trim: 0xd8a83a, hat: 0xd8d8d8 },
  yari: { body: 0x5a7a3a, head: 0x9a6a44, trim: 0xd06a3a, hat: 0x101010 },
  gaze_keeper: { body: 0xf4ecd8, head: 0x5a3a22, trim: 0xd8a83a },
  soup_vendor: { body: 0xd06a3a, head: 0x6a3a22, trim: 0xf2d04b, hat: 0xd06a3a },
  recruiter: { body: 0x2a2a3a, head: 0x2a2a3a, trim: 0x6e6e7a, hood: true },
  town_guard: { body: 0x3a5a8a, head: 0x7a4a2a, trim: 0xc8c8d0, hat: 0x3a5a8a },
  festival_kid: { body: 0xf2d04b, head: 0x6a3a22, trim: 0x3a7a8a },
  elder: { body: 0x7a6a8a, head: 0x5a3a22, trim: 0xe8e0c8, hat: 0xd8d8d8 },
  ferryman: { body: 0x3a7a8a, head: 0x7a4a2a, trim: 0xc8b07a, hat: 0xc8b07a },
  pilgrim: { body: 0xa89c86, head: 0x7a4a2a, trim: 0x6e6152 },
  acolyte: { body: 0xe8e0c8, head: 0x7a4a2a, trim: 0xf2d04b },
  mourner: { body: 0x3a3a4a, head: 0x6a3a22, trim: 0xe8e0c8, hat: 0x3a3a4a },
  echo_soldier: { body: 0x6a5230, head: 0x6a3a22, trim: 0xa04040, hat: 0x5a4428 },
  echo_cook: { body: 0x9c7a50, head: 0x6a3a22, trim: 0xe8d8b0 },
  echo_aide: { body: 0x4a3a2a, head: 0x7a4a2a, trim: 0xd8a83a, hat: 0x4a3a2a },
  echo_messenger: { body: 0x8a6a3a, head: 0x6a3a22, trim: 0xc8b07a },
  echo_builder: { body: 0x8a7a68, head: 0x7a4a2a, trim: 0x5e4424, hat: 0xc8b07a },
};

/** Anissa holding the door while Gianna is in the Echo: a glowing figure (guide 6.1). */
export const ANISSA_GLOW = { look: 'anissa', tint: 0xfff2a0, alpha: 0.85, pulseAlpha: 0.45 } as const;

/** Dialogue portraits (32 x 32), keyed by the `portrait` of a speaker in data/speakers.ts. */
export interface PlaceholderPortrait {
  background: number;
  figure: number;
}

function portraitOf(look: PlaceholderCharacter, background: number): PlaceholderPortrait {
  return { background, figure: look.body };
}

const SKY = 0x2e3a4a;
const SEPIA = 0x4a3a24;

export const PORTRAITS: Record<string, PlaceholderPortrait> = {
  villager: { background: 0x2e4a2a, figure: 0x6a8a3a },
  keeper: { background: 0x4a3a1e, figure: 0xe8e0c8 },
  fisher: { background: 0x1e3a4a, figure: 0x3a7a8a },
  sign: { background: 0x3e2614, figure: 0xe8d8b0 },
  gianna: portraitOf(PLAYER_SPRITE, SKY),
  patricio: portraitOf(ECHO_PLAYER_SPRITE, SEPIA),
  ...Object.fromEntries(
    Object.entries(NPC_SPRITES)
      .filter(([k]) => !['villager', 'keeper', 'fisher'].includes(k))
      .map(([k, look]) => [k, portraitOf(look, k.startsWith('echo_') ? SEPIA : SKY)]),
  ),
  anissa_far: portraitOf(NPC_SPRITES.anissa!, 0x6a5a20),
  temple_porter: portraitOf(NPC_SPRITES.acolyte!, SKY),
  fisher_island: portraitOf(NPC_SPRITES.ferryman!, SKY),
  echo_scout: portraitOf(NPC_SPRITES.echo_soldier!, SEPIA),
  echo_sentry: portraitOf(NPC_SPRITES.echo_soldier!, SEPIA),
  echo_guard: portraitOf(NPC_SPRITES.echo_soldier!, SEPIA),
  echo_drummer: portraitOf(NPC_SPRITES.echo_cook!, SEPIA),
  echo_lampwright: portraitOf(NPC_SPRITES.echo_builder!, SEPIA),
};

export const PORTRAIT_SIZE = 32;

/**
 * The Echo screen filter (guide 6.1): warm sepia, slightly dithered. A sepia colour matrix where the
 * renderer supports it (WebGL), plus a warm wash and an ordered-dither dot pattern drawn over the
 * world everywhere.
 */
export const ECHO_FILTER = {
  sepia: true,
  /** 0..1: how much of the sepia matrix replaces the original colours. */
  sepiaStrength: 0.85,
  wash: 0xc89050,
  washAlpha: 0.16,
  ditherColor: 0x2a1808,
  ditherAlpha: 0.32,
  flash: { duration: 280, r: 255, g: 226, b: 170 },
} as const;

/** Interface colours. */
export const UI = {
  font: 'monospace',
  fontSizePx: 8,
  lineSpacingPx: 2,
  boxFill: 0x14101a,
  boxBorder: 0xe8d8b0,
  boxAlpha: 0.94,
  text: '#f4ecd8',
  dimText: '#a89c86',
  accentText: '#f2d04b',
  echoZone: 0x9ad8ff,
  echoZoneAlpha: 0.28,
  letterbox: '#000000',
  hintFill: 0x2a1e30,
  hintBorder: 0xf2b8d0,
  cardFill: 0x000000,
  cardTitle: '#f2d04b',
  doneText: '#7fbf7a',
} as const;

export function textureKeyForPlayer(facing: string, era: 'present' | 'echo' = 'present'): string {
  return era === 'echo' ? `player-echo-${facing}` : `player-${facing}`;
}

export const ECHO_DITHER_TEXTURE = 'echo-dither';

export function textureKeyForNpc(look: string, facing: string): string {
  return `npc-${look}-${facing}`;
}

export function textureKeyForPortrait(portrait: string): string {
  return `portrait-${portrait}`;
}
