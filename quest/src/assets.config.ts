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
  ] satisfies PlaceholderTile[],
} as const;

/** A 16 x 24 placeholder character: a body block, a head block and a facing marker. */
export interface PlaceholderCharacter {
  body: number;
  head: number;
  trim: number;
}

export const PLAYER_SPRITE: PlaceholderCharacter = { body: 0x3b4fa8, head: 0x8a5a3a, trim: 0xf2d04b };

/** NPC looks, keyed by the `look` field of an NPC in data/npcs.ts. */
export const NPC_SPRITES: Record<string, PlaceholderCharacter> = {
  villager: { body: 0x6a8a3a, head: 0x7a4a2a, trim: 0xe0e0e0 },
  keeper: { body: 0xe8e0c8, head: 0x6a3a22, trim: 0xd8a83a },
  fisher: { body: 0x3a7a8a, head: 0x9a6a44, trim: 0xc8b07a },
};

/** Dialogue portraits (32 x 32), keyed by the `portrait` of a speaker in data/speakers.ts. */
export interface PlaceholderPortrait {
  background: number;
  figure: number;
}

export const PORTRAITS: Record<string, PlaceholderPortrait> = {
  villager: { background: 0x2e4a2a, figure: 0x6a8a3a },
  keeper: { background: 0x4a3a1e, figure: 0xe8e0c8 },
  fisher: { background: 0x1e3a4a, figure: 0x3a7a8a },
  sign: { background: 0x3e2614, figure: 0xe8d8b0 },
};

export const PORTRAIT_SIZE = 32;

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
} as const;

export function textureKeyForPlayer(facing: string): string {
  return `player-${facing}`;
}

export function textureKeyForNpc(look: string, facing: string): string {
  return `npc-${look}-${facing}`;
}

export function textureKeyForPortrait(portrait: string): string {
  return `portrait-${portrait}`;
}
