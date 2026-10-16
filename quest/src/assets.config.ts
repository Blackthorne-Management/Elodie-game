// Every visual in the quest is defined here. The placeholders are drawn at start-up (src/scenes/
// textures.ts): tiles from colours and patterns or from the pixel drawings in assets.pixels.ts,
// characters from the looks below. Real art replaces them file by file: drop a PNG with the name
// ART_FILES describes into quest/art/ and it is used instead of the placeholder (a missing file
// keeps the placeholder). See docs/quest/ART-STYLE.md for sizes, layout and the palette.

import { ENEMY_ART, ITEM_ART, OBJECT_ART, PALETTE, TILE_ART, WEAPON_ART, type BattleWeaponArt, type ObjectArt, type PixelArt } from './assets.pixels.ts';

export { ENEMY_ART, ITEM_ART, OBJECT_ART, PALETTE, TILE_ART, WEAPON_ART, type BattleWeaponArt, type ObjectArt, type PixelArt };

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
    // Readability pass: story objects get their own tiles (drawn from TILE_ART). Append only: a
    // tile's gid is its place in the .tmj files.
    { gid: 58, name: 'crate', base: 0x9c7446, accent: 0x6b4426, pattern: 'border' },
    { gid: 59, name: 'well', base: 0xb8b8c4, accent: 0x3a6fb8, pattern: 'border' },
    { gid: 60, name: 'pawl_rust', base: 0x8a4a2a, accent: 0x5e3418, pattern: 'border' },
    { gid: 61, name: 'pawl_pinned', base: 0x8a4a2a, accent: 0xc8c8d0, pattern: 'border' },
    { gid: 62, name: 'stone_pile', base: 0xb8b8c4, accent: 0x8e8e9c, pattern: 'grid' },
    { gid: 63, name: 'loose_board', base: 0xb98d5a, accent: 0xe8d8b0, pattern: 'border' },
    // The wild sections: tall cane you can walk through (where ambushes come from), a ruined wall.
    { gid: 64, name: 'cane', base: 0x5e8a2e, accent: 0x9ab84a, pattern: 'stripes' },
    { gid: 65, name: 'cane_old', base: 0x8a8a3a, accent: 0xb0a45a, pattern: 'stripes' },
    // Pòdlimyè grows (Oct 15): the Iron Market, the Hall of the Accord inside, Accord Square.
    { gid: 66, name: 'cobble', base: 0x9c7446, accent: 0xc8a46b, pattern: 'grid' },
    { gid: 67, name: 'marble', base: 0xf4ecd8, accent: 0xd8d0c0, pattern: 'grid' },
    { gid: 68, name: 'carpet', base: 0xb8403a, accent: 0xf2d04b, pattern: 'border' },
    { gid: 69, name: 'dais', base: 0x6b4426, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 70, name: 'hall_wall', base: 0xd8d0c0, accent: 0x6b4426, pattern: 'grid' },
    { gid: 71, name: 'pillar', base: 0xf4ecd8, accent: 0xa8a6b4, pattern: 'border' },
    { gid: 72, name: 'throne', base: 0xf2d04b, accent: 0xb8403a, pattern: 'border' },
    { gid: 73, name: 'portrait', base: 0xd8d0c0, accent: 0x5a3a78, pattern: 'border' },
    { gid: 74, name: 'desk', base: 0x9c7446, accent: 0xf4ecd8, pattern: 'border' },
    { gid: 75, name: 'bench', base: 0x9c7446, accent: 0x6b4426, pattern: 'stripes' },
    { gid: 76, name: 'plant', base: 0x4f9a4a, accent: 0xb86a3a, pattern: 'blob' },
    { gid: 77, name: 'pigeon_loft', base: 0x6b4426, accent: 0xa8a6b4, pattern: 'grid' },
    { gid: 78, name: 'flag', base: 0xb8403a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 79, name: 'chest', base: 0x6b4426, accent: 0xf2d04b, pattern: 'border' },
    { gid: 80, name: 'stall_blue', base: 0x3b4fa8, accent: 0xf4ecd8, pattern: 'stripes' },
    { gid: 81, name: 'stall_green', base: 0x4f9a4a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 82, name: 'stall_yellow', base: 0xf2d04b, accent: 0xb8403a, pattern: 'stripes' },
    { gid: 83, name: 'produce', base: 0xc8a46b, accent: 0xe0782a, pattern: 'dots' },
    { gid: 84, name: 'spice', base: 0xc8a46b, accent: 0xb8403a, pattern: 'dots' },
    { gid: 85, name: 'cloth', base: 0xb8403a, accent: 0x3b4fa8, pattern: 'stripes' },
    { gid: 86, name: 'fish_table', base: 0x9ad8ff, accent: 0xc8c8d0, pattern: 'border' },
    { gid: 87, name: 'goat', base: 0xf4ecd8, accent: 0x1a1420, pattern: 'blob' },
    { gid: 88, name: 'chicken', base: 0xf4ecd8, accent: 0xe0782a, pattern: 'blob' },
    { gid: 89, name: 'lottery', base: 0xf2d04b, accent: 0x4f9a4a, pattern: 'border' },
    { gid: 90, name: 'cart', base: 0x9c7446, accent: 0x6b4426, pattern: 'cross' },
    { gid: 91, name: 'hedge', base: 0x2a5e2f, accent: 0x4f9a4a, pattern: 'blob' },
    { gid: 92, name: 'flagpole', base: 0x3b4fa8, accent: 0xf2d04b, pattern: 'stripes' },
    // A door you cannot open (owner request, Oct 16): grey, on every building with no way in.
    { gid: 93, name: 'door_closed', base: 0x6e6a78, accent: 0x3a3440, pattern: 'border' },
    // Double doors (owner request, Oct 16): left and right leaves, and the top and bottom of a tall door.
    { gid: 94, name: 'door_left', base: 0x6b4426, accent: 0x3e2614, pattern: 'border' },
    { gid: 95, name: 'door_right', base: 0x6b4426, accent: 0x3e2614, pattern: 'border' },
    { gid: 96, name: 'door_top', base: 0x6b4426, accent: 0x3e2614, pattern: 'border' },
    { gid: 97, name: 'door_bottom', base: 0x6b4426, accent: 0x3e2614, pattern: 'border' },
  ] satisfies PlaceholderTile[],
} as const;

/**
 * A 24 x 32 placeholder character (chibi, like the real art), drawn with a 1 px dark outline and
 * three-tone shading in four facings and three walk frames (src/scenes/pixels.ts). The named cast differ in silhouette (build, hair, headgear) and in
 * what they carry, not just in colour, so they read at a glance. An Echo ancestor is a palette and
 * headgear swap of the modern sprite (guide 6.1).
 */
export type HairStyle = 'short' | 'long' | 'curly' | 'bun' | 'puffs' | 'braid' | 'bald' | 'cropped';
export type Headgear = 'cap' | 'bicorne' | 'circlet' | 'headband' | 'hood' | 'cowl' | 'wrap' | 'brimmed' | 'helmet';
export type Accessory = 'satchel' | 'locket' | 'bow' | 'hutia' | 'cane' | 'epaulettes' | 'sash' | 'emblem' | 'apron' | 'drum' | 'staff' | 'veil';

export interface PlaceholderCharacter {
  skin: number;
  hair: number;
  hairStyle: HairStyle;
  /** Coat, dress or robe. */
  outfit: number;
  /** Collar, belt, hem and sash. */
  trim: number;
  /** Trousers and boots (robes hide them). */
  legs?: number;
  /** A long dress or robe down to the ankles. */
  robe?: boolean;
  /** small: a child or Anissa; tall: Elodie. */
  build?: 'normal' | 'small' | 'tall';
  headgear?: Headgear;
  headgearColor?: number;
  beard?: number;
  accessories?: readonly Accessory[];
  /** The art sheet to use (quest/art/characters/<art>.png) when it is not the look's own name. */
  art?: string;
  /** Recolour the art sheet's skin to this tone (engine/skin.ts), so one sheet serves many people. */
  skinTone?: SkinTone;
}

/** Skin tones for people drawn from one shared sheet (each the average skin colour). */
export const SKIN_TONES = {
  light: 0xe0b08c,
  tan: 0xc48c60,
  medium: 0xa06a42,
  brown: 0x7a4a2c,
  deep: 0x5a3622,
} as const;
export type SkinTone = keyof typeof SKIN_TONES;

/**
 * A member of the Quiet Crown (guide 7): a charcoal cowl that shows the face, a bone-white veil over the
 * mouth (they "steal voices"), the small silver crown on the chest. Men are drawn taller and broader,
 * women with a braid down the back. One art sheet per sex (quiet_crown_m, quiet_crown_f), any skin tone.
 */
function quietCrown(sex: 'm' | 'f', tone: SkinTone): PlaceholderCharacter {
  return {
    skin: SKIN_TONES[tone], hair: 0x2a1a14, hairStyle: sex === 'f' ? 'braid' : 'cropped', outfit: 0x34303e, trim: 0xc8c8d0,
    robe: true, build: sex === 'm' ? 'tall' : 'normal', headgear: 'cowl', headgearColor: 0x2a2632,
    accessories: ['veil', 'emblem'], art: `quiet_crown_${sex}`, skinTone: tone,
  };
}
const QUIET_CROWN: Record<string, PlaceholderCharacter> = Object.fromEntries(
  (['m', 'f'] as const).flatMap((sex) => (Object.keys(SKIN_TONES) as SkinTone[]).map((tone) => [`quiet_crown_${sex}_${tone}`, quietCrown(sex, tone)])),
);

const C = PALETTE;
/** Black hair, a shade above the outline colour so the outline still reads around it. */
const HAIR_BLACK = 0x2b2433;
const HAIR_DARK = 0x2a1a14;
const WHITE_HAIR = C.h!;

/**
 * Every character look, keyed by the `look` of an NPC in data/npcs.ts. `gianna` is the player in the
 * present and `patricio_young` the player in the Echo; `anissa` is also the follower.
 */
export const NPC_SPRITES: Record<string, PlaceholderCharacter> = {
  // The cast (guide 5.3 / 5.3a).
  gianna: {
    skin: C.S!, hair: HAIR_DARK, hairStyle: 'curly', outfit: C.U!, trim: C.y!, robe: true,
    accessories: ['satchel', 'locket'],
  },
  patricio_young: {
    skin: C.s!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.R!, trim: C.y!, legs: C.u!,
    headgear: 'bicorne', headgearColor: C.K!, accessories: ['epaulettes', 'sash'],
  },
  anissa: {
    skin: C.S!, hair: HAIR_DARK, hairStyle: 'puffs', outfit: C.P!, trim: C.w!, robe: true, build: 'small',
  },
  elodie: {
    skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: C.y!, trim: C.w!, robe: true, build: 'tall',
    headgear: 'circlet', headgearColor: C.Y!, accessories: ['sash'],
  },
  anicette: {
    skin: C.s!, hair: C.G!, hairStyle: 'short', outfit: C.p!, trim: C.y!, robe: true,
    headgear: 'wrap', headgearColor: C.m!, accessories: ['sash'],
  },
  patricio_old: {
    skin: C.s!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: C.r!, trim: C.y!, legs: C.u!, beard: C.G!,
    accessories: ['epaulettes', 'cane'],
  },
  yari: {
    skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.L!, trim: C.o!, legs: C.B!,
    headgear: 'headband', headgearColor: C.R!, accessories: ['bow', 'hutia'],
  },
  azzy: {
    skin: C.S!, hair: HAIR_DARK, hairStyle: 'curly', outfit: 0x3a2a24, trim: C.R!, legs: C.K!, build: 'tall',
    accessories: ['sash', 'epaulettes'],
  },
  // The Quiet Crown: quiet_crown_<m|f>_<tone>, e.g. quiet_crown_f_deep.
  ...QUIET_CROWN,

  // Zetwal, the present: the Temple Archive, the Hall of the Accord and the Cane Road.
  smith: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bald', outfit: 0x5a4a3e, trim: C.e!, legs: C.K!, beard: HAIR_BLACK, accessories: ['apron'] },
  charm_seller: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'braid', outfit: C.y!, trim: C.R!, robe: true, headgear: 'wrap', headgearColor: C.R!, accessories: ['sash'] },
  grocer: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.L!, trim: C.w!, legs: C.B!, headgear: 'wrap', headgearColor: C.y!, accessories: ['apron'] },
  archivist: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.U!, trim: C.y!, robe: true, accessories: ['satchel'] },
  clerk: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.w!, trim: C.y!, legs: C.K!, accessories: ['sash'] },
  cane_cutter: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0xa89c86, trim: C.o!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N! },

  // Accord Square and the Hall of the Accord inside (owner decision, Oct 15).
  honor_guard: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.u!, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.u!, accessories: ['epaulettes', 'sash'] },
  gazette_crier: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.w!, trim: C.R!, legs: C.B!, headgear: 'cap', headgearColor: C.R!, accessories: ['satchel'] },
  petitioner: { skin: C.s!, hair: C.G!, hairStyle: 'short', outfit: 0xa89c86, trim: C.B!, legs: C.B!, accessories: ['cane'] },
  protester: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.R!, trim: C.w!, legs: C.K!, headgear: 'wrap', headgearColor: C.y! },
  courier_rider: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.B!, trim: C.y!, legs: C.K!, headgear: 'cap', headgearColor: C.U!, accessories: ['satchel'] },
  nursemaid: { skin: C.s!, hair: HAIR_DARK, hairStyle: 'bun', outfit: C.C!, trim: C.w!, legs: C.w!, headgear: 'wrap', headgearColor: C.w!, accessories: ['apron'] },
  hall_page: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.U!, trim: C.y!, legs: C.K!, build: 'small', accessories: ['satchel'] },
  hall_steward: { skin: C.s!, hair: C.G!, hairStyle: 'short', outfit: C.K!, trim: C.y!, legs: C.K!, build: 'tall', accessories: ['sash'] },
  throne_usher: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.r!, trim: C.y!, legs: C.K!, accessories: ['staff', 'sash'] },
  council_speaker: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'short', outfit: C.p!, trim: C.y!, robe: true, beard: WHITE_HAIR, accessories: ['sash'] },
  elder_dove: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.w!, trim: C.c!, robe: true, accessories: ['cane'] },
  elder_hawk: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.u!, trim: C.R!, legs: C.K!, build: 'tall', beard: HAIR_BLACK, accessories: ['epaulettes'] },
  crown_consul: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: 0x2a2a3a, trim: C.I!, legs: C.K!, build: 'tall', headgear: 'bicorne', headgearColor: 0x2a2a3a, accessories: ['sash', 'emblem'] },
  chancellor: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: C.m!, trim: C.y!, robe: true, build: 'tall', accessories: ['sash'] },
  seal_keeper: { skin: C.S!, hair: C.G!, hairStyle: 'bald', outfit: C.U!, trim: C.y!, robe: true, beard: C.G! },
  chief_courier: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'braid', outfit: C.L!, trim: C.y!, legs: C.B!, headgear: 'cap', headgearColor: C.L!, accessories: ['satchel'] },
  treasurer: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.l!, trim: C.y!, legs: C.K!, accessories: ['sash'] },
  scribe: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.w!, trim: C.u!, legs: C.K!, accessories: ['satchel'] },
  // The Iron Market rebuilt.
  produce_seller: { skin: C.s!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.o!, trim: C.L!, legs: C.B!, headgear: 'wrap', headgearColor: C.L!, accessories: ['apron'] },
  spice_seller: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.R!, trim: C.y!, robe: true, headgear: 'wrap', headgearColor: C.o! },
  cloth_merchant: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.P!, trim: C.U!, robe: true, accessories: ['sash'] },
  goat_herder: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0xa89c86, trim: C.B!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N!, accessories: ['staff'] },
  lottery_seller: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'curly', outfit: C.y!, trim: C.L!, legs: C.K!, headgear: 'cap', headgearColor: C.L! },
  porter: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bald', outfit: C.w!, trim: C.B!, legs: C.B!, build: 'tall' },
  pickpocket: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'curly', outfit: 0x8a7a68, trim: C.R!, legs: C.B!, build: 'small' },
  market_shopper: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'bun', outfit: C.U!, trim: C.y!, robe: true, headgear: 'wrap', headgearColor: C.y!, accessories: ['satchel'] },

  // The Iron Market, the Old Harbor and Solèy Heights (owner decision, Oct 15).
  engraver: { skin: C.s!, hair: C.G!, hairStyle: 'short', outfit: 0x5a4a3e, trim: C.y!, legs: C.K!, beard: C.G!, accessories: ['apron'] },
  ironmonger: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.i!, trim: C.e!, legs: C.K!, accessories: ['apron'] },
  letter_writer: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'bun', outfit: C.p!, trim: C.w!, robe: true, accessories: ['satchel'] },
  foreign_envoy: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.m!, trim: C.y!, robe: true, build: 'tall', headgear: 'circlet', headgearColor: C.I!, accessories: ['sash'] },
  market_kid: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'puffs', outfit: C.R!, trim: C.w!, legs: C.B!, build: 'small' },
  fishwife: { skin: C.s!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.c!, trim: C.w!, legs: C.B!, headgear: 'wrap', headgearColor: C.U!, accessories: ['apron'] },
  net_mender: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'cropped', outfit: 0xa89c86, trim: C.c!, legs: C.B!, beard: WHITE_HAIR },
  old_sailor: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: C.u!, trim: C.w!, legs: C.K!, beard: WHITE_HAIR, headgear: 'cap', headgearColor: C.u! },
  gardener: { skin: C.s!, hair: C.G!, hairStyle: 'bun', outfit: C.L!, trim: C.y!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N!, accessories: ['apron'] },
  poet: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'curly', outfit: C.K!, trim: C.R!, legs: C.K!, accessories: ['satchel'] },
  porch_widow: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.K!, trim: C.w!, robe: true, accessories: ['cane'] },
  lookout_keeper: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.B!, trim: C.o!, legs: C.K!, headgear: 'cap', headgearColor: C.R! },

  // Zetwal, the present.
  gaze_keeper: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'short', outfit: C.w!, trim: C.y!, robe: true, accessories: ['staff'] },
  soup_vendor: { skin: C.s!, hair: HAIR_DARK, hairStyle: 'cropped', outfit: C.o!, trim: C.y!, legs: C.B!, headgear: 'wrap', headgearColor: C.o!, accessories: ['apron'] },
  town_guard: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.U!, trim: C.I!, legs: C.u!, headgear: 'helmet', headgearColor: C.I! },
  festival_kid: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.y!, trim: C.c!, legs: C.B!, build: 'small' },
  elder: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x7a6a8a, trim: C.w!, legs: C.K!, accessories: ['cane'] },
  ferryman: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.c!, trim: C.N!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N! },
  pilgrim: { skin: C.T!, hair: C.B!, hairStyle: 'long', outfit: 0xa89c86, trim: C.g!, robe: true, accessories: ['staff'] },
  acolyte: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.w!, trim: C.y!, robe: true },
  mourner: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.K!, trim: C.w!, robe: true, headgear: 'wrap', headgearColor: C.K! },

  // Zetwal, the Echo (fifty years ago).
  echo_soldier: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x6a5230, trim: C.R!, legs: C.b!, headgear: 'cap', headgearColor: 0x5a4428 },
  echo_cook: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'short', outfit: 0x9c7a50, trim: C.w!, legs: C.b!, accessories: ['apron'] },
  echo_aide: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x4a3a2a, trim: C.y!, legs: C.b!, headgear: 'cap', headgearColor: 0x4a3a2a, accessories: ['satchel'] },
  echo_messenger: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'braid', outfit: 0x8a6a3a, trim: C.N!, legs: C.b! },
  echo_builder: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x8a7a68, trim: C.B!, legs: C.b!, headgear: 'brimmed', headgearColor: C.N! },
  echo_drummer: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x6a5230, trim: C.y!, legs: C.b!, headgear: 'cap', headgearColor: C.R!, accessories: ['drum'] },
  echo_cane_worker: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x9a8a70, trim: C.o!, legs: C.b!, headgear: 'wrap', headgearColor: 0xc85a6a },

  // Test village (Phase 1).
  villager: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'short', outfit: 0x6a8a3a, trim: C.w!, legs: C.B! },
  keeper: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'short', outfit: C.w!, trim: C.y!, robe: true },
  fisher: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.c!, trim: C.N!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N! },
};

/** The player's look in each era. */
export const PLAYER_LOOK = 'gianna';
export const ECHO_PLAYER_LOOK = 'patricio_young';

/** Anissa holding the door while Gianna is in the Echo: a glowing figure (guide 6.1). */
export const ANISSA_GLOW = { look: 'anissa', tint: 0xfff2a0, alpha: 0.85, pulseAlpha: 0.45 } as const;

/**
 * Dialogue portraits (PORTRAIT_SIZE square), keyed by the `portrait` of a speaker in data/speakers.ts.
 * A placeholder portrait is the head and shoulders of a character look, enlarged, on a background;
 * `art` names a TILE_ART drawing instead (the sign).
 */
export interface PlaceholderPortrait {
  background: number;
  look?: string;
  art?: string;
}

const SKY = 0x2e3a4a;
const SEPIA = 0x4a3a24;

const portrait = (look: string, background = SKY): PlaceholderPortrait => ({ look, background });

export const PORTRAITS: Record<string, PlaceholderPortrait> = {
  ...Object.fromEntries(Object.keys(NPC_SPRITES).map((k) => [k, portrait(k, k.startsWith('echo_') ? SEPIA : SKY)])),
  sign: { background: 0x3e2614, art: 'sign' },
  book: { background: 0x3e2614, art: 'shelf' },
  villager: portrait('villager', 0x2e4a2a),
  keeper: portrait('keeper', 0x4a3a1e),
  fisher: portrait('fisher', 0x1e3a4a),
  patricio: portrait('patricio_young', SEPIA),
  anissa_far: portrait('anissa', 0x6a5a20),
  temple_porter: portrait('acolyte'),
  fisher_island: portrait('ferryman'),
  echo_scout: portrait('echo_soldier', SEPIA),
  echo_sentry: portrait('echo_soldier', SEPIA),
  echo_guard: portrait('echo_soldier', SEPIA),
  echo_lampwright: portrait('echo_builder', SEPIA),
};

/** Portraits are this many pixels square in the dialogue box (real portraits: 48 x 48 files). */
export const PORTRAIT_SIZE = 48;

/**
 * Real art, file by file (docs/quest/ART-STYLE.md). Put PNGs in quest/art/ under these names; the
 * build picks up whatever is there (src/scenes/artFiles.ts) and each file replaces its placeholder.
 *
 *  characters/<look>.png   walk sheet: 3 columns x 4 rows of equal 24 x 32 cells (a 72 x 128 sheet).
 *                          Rows: down, left, right, up. Columns: standing, step A, step B.
 *  portraits/<portrait>.png  48 x 48 dialogue portrait (the neutral face).
 *  tiles/<tile name>.png   16 x 16 tile, by TILESET name (e.g. tiles/grass.png, tiles/winch.png).
 *  objects/<kind>.png      a large object drawing by OBJECT_ART name (e.g. objects/gaze_lamp_lit.png).
 *  items/<id>.png          an item drawing for the item showcase, by item id (e.g. items/sun_locket.png),
 *                          any size; square, about 32 to 64 px, reads best.
 */
export const ART_FILES = {
  character: (look: string) => `characters/${look}.png`,
  portrait: (key: string) => `portraits/${key}.png`,
  tile: (name: string) => `tiles/${name}.png`,
  object: (kind: string) => `objects/${kind}.png`,
  item: (id: string) => `items/${id}.png`,
  enemy: (look: string) => `enemies/${look}.png`,
  /** A battle stance: two equal cells side by side (stance, down; Anissa: calm, surge), drawn at BATTLE_STANCE.scale. */
  battle: (look: string) => `battle/${look}.png`,
  /** A painted battle weapon (it keeps the grip point of WEAPON_ART). */
  weapon: (id: string) => `weapons/${id}.png`,
  /** Walk sheet layout. */
  sheetColumns: 3,
  sheetRows: ['down', 'left', 'right', 'up'] as const,
} as const;

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

/**
 * The realm map's picture: the board game's painted map (public/art/board.webp, shrunk to 1024 px),
 * shown sharp over the menu's map area by ui/RealmOverlay.ts. `mist` is how dark countries not reached
 * yet are (0..1). Replace the file (same square framing as the board) to change the picture.
 */
export const REALM_ART = {
  image: 'maps/realm.webp',
  mist: 0.72,
} as const;

/** The menu's maps (ui/GameMenu.ts): the city drawn from its tiles, the realm from data/realmMap.ts. */
export const MAP_ART = {
  sea: 0x2b5f7c,
  seaLight: 0x3a7290,
  path: 0xc8a46b,
  /** Places not reached yet are greyed, then darkened by this much. */
  fogDim: 0.78,
  building: 0xf2d04b,
  fogBuilding: 0x6e6a78,
  buildingText: '#1a1420',
  labelStroke: '#14101a',
  labelBack: 0x14101a,
  here: 0xffffff,
  hereRim: 0x1a1420,
} as const;

/**
 * Text sizes (System > Text size, kept per device). Large is a little bigger with tighter line
 * spacing, so a line keeps about the same height and every list still fits; the dialogue box gains a
 * line (`dialogueExtraPx`).
 */
export const TEXT_SIZES = {
  normal: { px: 8, lineSpacing: 2, dialogueExtraPx: 0 },
  large: { px: 9.5, lineSpacing: 1, dialogueExtraPx: 12 },
} as const;

/** Interface colours. */
export const UI = {
  /**
   * Atkinson Hyperlegible (Braille Institute, OFL; bundled, loaded by ui/text.ts before the game
   * starts), drawn at the screen's full resolution. Sizes are in game pixels: TEXT_SIZES below.
   */
  font: "'Atkinson Hyperlegible', system-ui, sans-serif",
  /** Normal text size (TEXT_SIZES.normal); Large is a setting. */
  fontSizePx: 8,
  lineSpacingPx: 2,
  boxFill: 0x14101a,
  boxBorder: 0xe8d8b0,
  boxAlpha: 0.94,
  text: '#f4ecd8',
  dimText: '#a89c86',
  accentText: '#f2d04b',
  echoZone: 0x9ad8ff,
  /** Echo spots glow (owner request, Oct 16: a bit more): the fill pulses between these, with a bright rim. */
  echoZoneAlpha: 0.38,
  echoZonePulseAlpha: 0.6,
  echoZoneRim: 0xd8f2ff,
  echoZoneRimAlpha: 0.75,
  /** A soft added glow around the spot. */
  echoZoneGlowAlpha: 0.22,
  letterbox: '#000000',
  hintFill: 0x2a1e30,
  hintBorder: 0xf2b8d0,
  cardFill: 0x000000,
  cardTitle: '#f2d04b',
  doneText: '#7fbf7a',
  /** The name label over what the player faces. */
  labelFill: 0x14101a,
  labelAlpha: 0.88,
  labelText: '#f4ecd8',
  /** Interaction markers: "!" over a person with something new to say, a sparkle over a thing to use. */
  markerTalk: 0xf2d04b,
  markerUse: 0x9ad8ff,
  markerOutline: 0x1a1420,
  /** The glow on a present-day object changed through the Echo. */
  changedGlow: 0xfff2a0,
} as const;

export const ECHO_DITHER_TEXTURE = 'echo-dither';

/** One texture per character look; its frames are `<facing>-<0..2>` (standing, step A, step B). */
export function textureKeyForCharacter(look: string): string {
  return `char-${look}`;
}

export function characterFrame(facing: string, step: 0 | 1 | 2 = 0): string {
  return `${facing}-${step}`;
}

export function textureKeyForPortrait(portrait: string): string {
  return `portrait-${portrait}`;
}

/** Large object drawings (OBJECT_ART), one texture each. */
export function textureKeyForObject(kind: string): string {
  return `object-${kind}`;
}

/** Pixels between a character's head and the name label over them. */
export const CHARACTER_LABEL_GAP = 2;

/** The interaction marker textures. */
export const MARKER_TEXTURES = { talk: 'marker-talk', use: 'marker-use' } as const;

/** Item drawings (ITEM_ART, or a file in art/items/), one texture each. */
export function textureKeyForItem(artKey: string): string {
  return `item-${artKey}`;
}

/** The drawing an item uses: its own, else the fallback for its kind. */
export function itemArtKey(id: string, kind: 'consumable' | 'gear' | 'key'): string {
  return ITEM_ART[id] ? id : kind === 'gear' ? 'gear' : 'key';
}

/**
 * Rarity colours (owner decision, Oct 15): the box behind an item's picture on the Equip screen, its
 * border, and its name. Common grey, uncommon green, rare blue, epic purple, legendary gold.
 */
export const RARITY_ART = {
  common: { fill: 0x4a4752, border: 0x8a8794, text: '#c8c6d0' },
  uncommon: { fill: 0x24492a, border: 0x5fae58, text: '#8cc860' },
  rare: { fill: 0x1f3460, border: 0x5a8ad8, text: '#9ab8ff' },
  epic: { fill: 0x3e2558, border: 0xa070d8, text: '#c8a0ff' },
  legendary: { fill: 0x5a4210, border: 0xf2d04b, text: '#f2d04b' },
} as const;

/** The item showcase (ui/ItemShowcase.ts): timings in ms, sizes in screen pixels, colours. */
export const SHOWCASE = {
  dimAlpha: 0.9,
  cardDimAlpha: 0.6,
  /** The item drawing's size on screen (it is scaled up to fit this box). */
  artPx: 36,
  cardArtPx: 24,
  riseMs: 520,
  raysColor: 0xfff2a0,
  raysAlpha: 0.22,
  raysTurnMs: 9000,
  glowColor: 0xfff2a0,
  legendaryColor: '#f2d04b',
  storyColor: '#9ad8ff',
  rewardColor: '#7fbf7a',
  sparkleCount: 10,
} as const;

/** Battle weapons (WEAPON_ART, or a file in art/weapons/), one texture each, by item id. */
export function textureKeyForWeapon(id: string): string {
  return `weapon-${id}`;
}

/**
 * Where a fighter's front hand is, from their feet (bottom centre), facing right: the weapon's grip goes
 * there. One default for the stand-in walk sprites; a battle stance can set its own by look.
 */
/**
 * Battle stances (owner, Oct 15; art prompt 9): one empty-handed stance and one down pose per character,
 * drawn at twice the game's pixel density (shown at half size, so phones and computers keep their detail).
 * A look without a stance file uses its walking sprite.
 */
export const BATTLE_STANCE = { looks: ['gianna', 'yari', 'patricio_young', 'anissa'], scale: 0.5 } as const;

/**
 * A stance painted holding a particular weapon (battle/<look>-<item id>.png, owner, Oct 15) is used instead of
 * the empty-handed stance plus the drawn weapon, whenever it exists.
 */
export function battleStanceName(look: string, weaponItem?: string): string {
  return weaponItem ? `${look}-${weaponItem}` : look;
}

/** A painted enemy file is drawn at twice the game's pixel density, like the stances. */
export const ENEMY_FILE_SCALE = 0.5;

export function textureKeyForBattle(look: string): string {
  return `battle-${look}`;
}

export const BATTLE_HANDS: {
  default: { dx: number; dy: number; behind?: boolean };
  /** By weapon type: a staff stands just ahead of the body, a bow is held out in front, a blade at the hip. */
  byWeapon: Readonly<Record<string, { dx: number; dy: number; behind?: boolean }>>;
  /** Painted stances: their closed hand, in game pixels from the feet; `behind`: the back hand (weapon behind the body). */
  byLook: Readonly<Record<string, { dx: number; dy: number; behind?: boolean }>>;
} = {
  default: { dx: 4, dy: -9 },
  byWeapon: { staff: { dx: 8, dy: -9 }, bow: { dx: 10, dy: -12 }, blade: { dx: 4, dy: -9 } },
  byLook: { gianna: { dx: -7, dy: -15 }, yari: { dx: 10, dy: -24 } },
};

/** Enemy drawings (ENEMY_ART, or a file in art/enemies/), one texture each. */
export function textureKeyForEnemy(look: string): string {
  return `enemy-${look}`;
}

/**
 * The battle screen (scenes/BattleScene.ts), a pulled-back side view seen a little from above (owner,
 * Oct 15): four fighters on the left in two rows (the front row nearer the foes), Anissa behind them all,
 * up to four foes on the right, a painted scene behind, and a strip along the bottom for the fighters'
 * bars and the commands. Positions are feet (bottom centre) in game pixels.
 */
export const BATTLE_ART = {
  panel: 0x14101a,
  panelBorder: 0xe8d8b0,
  band: 0x14101a,
  bandAlpha: 0.78,
  hpBar: 0x7fbf7a,
  hpLow: 0xd8584a,
  spBar: 0x5a8ad8,
  sparkBar: 0xfff2a0,
  cursor: 0xf2d04b,
  hit: '#ffffff',
  crit: '#f2d04b',
  heal: '#7fbf7a',
  spText: '#9ab8f0',
  weak: '#ffb070',
  /** The strip along the bottom. */
  stripY: 134,
  /** The front row (fighters with blades) and the back row (mages, archers); a full row spills into the other. */
  partyFront: [
    { x: 124, y: 102 },
    { x: 116, y: 126 },
  ],
  partyBack: [
    { x: 92, y: 94 },
    { x: 60, y: 124 },
  ],
  enemySlots: [
    { x: 212, y: 108 },
    { x: 228, y: 130 },
    { x: 262, y: 98 },
    { x: 278, y: 122 },
  ],
  /** Anissa stands behind everyone (she is never a target). */
  anissa: { x: 24, y: 108 },
  /** The horizon of the painted scene (above eye level: the view is from a little above). */
  horizon: 44,
  partyScale: 1,
  enemyScale: 1,
  /** How long each message stays before the next (ms), and the damage number's float. */
  messageMs: 900,
  hitMs: 520,
  popMs: 750,
  /** The shake on a hit (the sprites never walk; they only shiver). */
  shakePx: 2,
} as const;

/** The painted scene behind each battle (BattleDef.backdrop), drawn in code until painted art arrives. */
export const BATTLE_BACKDROPS: Readonly<Record<string, {
  sky: readonly number[];
  cloud: number;
  cloudShade: number;
  mountainFar: number;
  mountainNear: number;
  trees: number;
  treesDark: number;
  field: number;
  cane: number;
  caneDark: number;
  ground: number;
  groundDark: number;
  groundLight: number;
}>> = {
  // The Cane Road outside Zetwal: a blue morning, far hills, the cane, and the packed-earth road.
  cane_road: {
    sky: [0x3a6fc8, 0x4a82d4, 0x5d95dc, 0x74a8e2, 0x8fbbe8, 0xb2d2ee],
    cloud: 0xf4f6fa,
    cloudShade: 0xc8d4e6,
    mountainFar: 0x7a8cb0,
    mountainNear: 0x55688c,
    trees: 0x2f5a34,
    treesDark: 0x22442a,
    field: 0x4f8a3e,
    cane: 0x8cc860,
    caneDark: 0x5a9a44,
    ground: 0xb08a58,
    groundDark: 0x8a6a40,
    groundLight: 0xc8a46b,
  },
};

/** Battle effects (scenes/battleFx.ts): colours by kind. Only the effects move; the fighters only shiver. */
export const BATTLE_FX = {
  slash: 0xffffff,
  claw: 0xffd8c8,
  impact: 0xfff2a0,
  arrow: 0xe8d8b0,
  heal: 0x8ff0a0,
  healCore: 0xfff8e0,
  buff: 0xf2d04b,
  debuff: 0xc070e0,
  light: 0xfff2a0,
  fire: 0xe0782a,
  fireCore: 0xf2d04b,
  water: 0x5aa8e8,
  waterCore: 0xc8ecff,
  wind: 0xc8f0d0,
  earth: 0x8a6a40,
  earthCore: 0xc8a46b,
  surge: 0xfff2a0,
} as const;

