// Every visual in the quest is defined here. The placeholders are drawn at start-up (src/scenes/
// textures.ts): tiles from colours and patterns or from the pixel drawings in assets.pixels.ts,
// characters from the looks below. Real art replaces them file by file: drop a PNG with the name
// ART_FILES describes into quest/art/ and it is used instead of the placeholder (a missing file
// keeps the placeholder). See docs/quest/ART-STYLE.md for sizes, layout and the palette.

import type { Condition } from './engine/conditions.ts';
import { CHAPTER2_QUESTS_DONE, CHAPTER5_QUESTS_DONE } from './data/sideQuests.ts';
import { FAIR_DUSK } from './data/skarragol.ts';
import { NIGHT, QUARTER_DUSK } from './data/kuroshi.ts';
import { DAWN as AGNIPUR_DAWN, NIGHT as AGNIPUR_NIGHT } from './data/jwaladesh.ts';
import { EVE as KINGSMERE_EVE, KEEP_NIGHT, LAST_DAWN as KINGSMERE_DAWN, RAIN as KINGSMERE_RAIN } from './data/aldermoor.ts';
import { DAWN as MUSTER_DAWN, DUSK as MUSTER_DUSK, NIGHT as MUSTER_NIGHT } from './data/muster.ts';

/** Pòdlimyè's outdoor maps (the Muster's dusk, night and dawn wash over them). */
const MUSTER_OUTDOORS = ['zetwal-town', 'zetwal-harbor', 'zetwal-square', 'zetwal-market', 'zetwal-heights', 'zetwal-road', 'zetwal-temple'];
import { ECHO_SHIMMER, ENEMY_ART, ITEM_ART, OBJECT_ART, PALETTE, TILE_ART, WEAPON_ART, type BattleWeaponArt, type ObjectArt, type PixelArt } from './assets.pixels.ts';

export { ECHO_SHIMMER, ENEMY_ART, ITEM_ART, OBJECT_ART, PALETTE, TILE_ART, WEAPON_ART, type BattleWeaponArt, type ObjectArt, type PixelArt };

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
    // Xaraguá (Chapter 2, Oct 16): round thatched houses (bohío), cassava mounds, the areíto's dance
    // ground, palms, petroglyph rocks, thatched market stalls, salt pans, a cave mouth,
    // and inside the cacique's great house (caney): woven mats, carved posts and the duho seat.
    { gid: 98, name: 'thatch', base: 0xc8a46b, accent: 0x9c7446, pattern: 'stripes' },
    { gid: 99, name: 'cane_wall', base: 0xa8844e, accent: 0x6b4426, pattern: 'stripes' },
    { gid: 100, name: 'palm', base: 0x4f9a4a, accent: 0x6b4426, pattern: 'blob' },
    { gid: 101, name: 'conuco', base: 0x7a5a38, accent: 0x4f9a4a, pattern: 'dots' },
    { gid: 102, name: 'batey', base: 0xd09050, accent: 0xb87840, pattern: 'dots' },
    { gid: 103, name: 'petroglyph', base: 0x8e8e9c, accent: 0x3a3440, pattern: 'cross' },
    { gid: 104, name: 'stall_thatch', base: 0xc8a46b, accent: 0x17a5a5, pattern: 'stripes' },
    { gid: 105, name: 'salt', base: 0xf4ecd8, accent: 0xd8d0c0, pattern: 'grid' },
    { gid: 106, name: 'cave', base: 0x1a1420, accent: 0x3a3440, pattern: 'border' },
    { gid: 107, name: 'firepit', base: 0x6e6a78, accent: 0xe0782a, pattern: 'blob' },
    { gid: 108, name: 'mat', base: 0xd8bf8a, accent: 0xb8955a, pattern: 'dots' },
    { gid: 109, name: 'post', base: 0x6b4426, accent: 0x17a5a5, pattern: 'stripes' },
    { gid: 110, name: 'duho', base: 0x3e2614, accent: 0xf2d04b, pattern: 'border' },
    // Yucayeque's own ground and plants (owner request, Oct 16: it must look nothing like Pòdlimyè):
    // deep tropical grass, red-earth trails, white coral sand, a turquoise lagoon, pale limestone, red
    // heliconia flowers; ceiba trees, ferns and banana plants instead of the round trees and bushes.
    { gid: 111, name: 'lush_grass', base: 0x2e8a4e, accent: 0x46a866, pattern: 'dots' },
    { gid: 112, name: 'red_earth', base: 0xb0603a, accent: 0x8e4a2a, pattern: 'dots' },
    { gid: 113, name: 'coral_sand', base: 0xf2e6c4, accent: 0xdccca0, pattern: 'dots' },
    { gid: 114, name: 'lagoon', base: 0x1fa5a8, accent: 0x7fe0d6, pattern: 'wave' },
    { gid: 115, name: 'limestone', base: 0xd8d4c8, accent: 0xa8a49a, pattern: 'grid' },
    { gid: 116, name: 'heliconia', base: 0x2e8a4e, accent: 0xd8402a, pattern: 'dots' },
    { gid: 117, name: 'ceiba', base: 0x2e8a4e, accent: 0xa8a6b4, pattern: 'blob' },
    { gid: 118, name: 'fern', base: 0x2e8a4e, accent: 0x8cc860, pattern: 'blob' },
    { gid: 119, name: 'banana', base: 0x2e8a4e, accent: 0xf2d04b, pattern: 'blob' },
    // A dugout canoe that sits on whatever is under it (sand or lagoon), and the caney's woven runner.
    { gid: 120, name: 'dugout', base: 0x6b4426, accent: 0x9c7446, pattern: 'blob' },
    { gid: 121, name: 'runner', base: 0x17a5a5, accent: 0xe8e0c8, pattern: 'border' },
    // The petroglyph cave (Oct 17): rock floor and walls, the spring's water, a carved wall, and the two
    // sluice gates (shut: planks across the channel; open: the gate hauled up and water running).
    { gid: 122, name: 'cave_floor', base: 0x5a5260, accent: 0x6e6a78, pattern: 'dots' },
    { gid: 123, name: 'cave_wall', base: 0x2a2430, accent: 0x3a3440, pattern: 'grid' },
    { gid: 124, name: 'cave_water', base: 0x163848, accent: 0x2a6070, pattern: 'wave' },
    { gid: 125, name: 'carving', base: 0x3a3440, accent: 0xd8d0c0, pattern: 'cross' },
    { gid: 126, name: 'sluice', base: 0x6b4426, accent: 0x3e2614, pattern: 'stripes' },
    { gid: 127, name: 'sluice_open', base: 0x163848, accent: 0x9c7446, pattern: 'border' },
    // The occupation (Oct 17): the Crown's banner, and a burned-out market stall.
    { gid: 128, name: 'crown_banner', base: 0xb8403a, accent: 0xf4ecd8, pattern: 'stripes' },
    { gid: 129, name: 'stall_burned', base: 0x3a3440, accent: 0xe0782a, pattern: 'stripes' },
    // Ardencia (Chapter 3, Oct 21): black sand and cinder ground, black basalt, lava, steaming springs, the red
    // stone of Cenizal's streets and walls, the duel court's sand, the forge fortress's iron floor and its dry
    // ditches (fifty years ago), bellows, tapestries and iron bars.
    { gid: 130, name: 'black_sand', base: 0x3a3440, accent: 0x5a5260, pattern: 'dots' },
    { gid: 131, name: 'cinder', base: 0x5a4a50, accent: 0x6e5a5a, pattern: 'dots' },
    { gid: 132, name: 'basalt', base: 0x241e26, accent: 0x3a3238, pattern: 'grid' },
    { gid: 133, name: 'lava', base: 0xd8582a, accent: 0xf2d04b, pattern: 'wave' },
    { gid: 134, name: 'hot_spring', base: 0x5aa8b8, accent: 0xe8f0f0, pattern: 'wave' },
    { gid: 135, name: 'red_stone', base: 0xb0603a, accent: 0x9a4e2e, pattern: 'grid' },
    { gid: 136, name: 'red_wall', base: 0x8a3a2a, accent: 0x6a2a20, pattern: 'grid' },
    { gid: 137, name: 'duel_sand', base: 0xe0c890, accent: 0xc8ac70, pattern: 'dots' },
    { gid: 138, name: 'iron_floor', base: 0x4a4452, accent: 0x5e5866, pattern: 'grid' },
    { gid: 139, name: 'ditch', base: 0x3a3238, accent: 0x6a4a3a, pattern: 'stripes' },
    { gid: 140, name: 'bellows', base: 0x6b4426, accent: 0x3a3440, pattern: 'border' },
    { gid: 141, name: 'tapestry', base: 0x8a3a2a, accent: 0xf2d04b, pattern: 'border' },
    { gid: 142, name: 'iron_bars', base: 0x1a1420, accent: 0xa8a6b4, pattern: 'stripes' },
    { gid: 143, name: 'forge_gate', base: 0x4a4a52, accent: 0xe0782a, pattern: 'cross' },
    { gid: 144, name: 'forge_lever', base: 0x6b4426, accent: 0xc8c8d0, pattern: 'cross' },
    { gid: 145, name: 'gallery', base: 0x5e3e22, accent: 0x8a3a2a, pattern: 'stripes' },
    // Al-Doria (Chapter 4, Oct 21): sandstone streets and walls under green domes, zellige tiles, the desert's dunes,
    // the bazaar's awnings and stalls, the guild vault's stone and iron (the balance, its weights, the sun lock, the
    // chest), the cistern line dry and running, the caravans' camels (placeholders until art drop 2).
    { gid: 146, name: 'sandstone', base: 0xe0c89a, accent: 0xc8ac78, pattern: 'grid' },
    { gid: 147, name: 'sandstone_wall', base: 0xc8a070, accent: 0xa88050, pattern: 'grid' },
    { gid: 148, name: 'dome', base: 0x1e8449, accent: 0x2ea85e, pattern: 'stripes' },
    { gid: 149, name: 'zellige', base: 0x2a8a6a, accent: 0xd8b04a, pattern: 'cross' },
    { gid: 150, name: 'dune', base: 0xe0b878, accent: 0xc89c58, pattern: 'dots' },
    { gid: 151, name: 'arcade', base: 0xd8c08a, accent: 0x8a6a3a, pattern: 'border' },
    { gid: 152, name: 'awning', base: 0x1e8449, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 153, name: 'carpet_stall', base: 0x8a3050, accent: 0xd8b04a, pattern: 'border' },
    { gid: 154, name: 'coin_table', base: 0x6b4426, accent: 0xf2d04b, pattern: 'dots' },
    { gid: 155, name: 'weights_table', base: 0x6b4426, accent: 0x8e8e9c, pattern: 'grid' },
    { gid: 156, name: 'vault_floor', base: 0x6e6152, accent: 0x8a7a68, pattern: 'grid' },
    { gid: 157, name: 'vault_wall', base: 0x3a3238, accent: 0x5a4a50, pattern: 'grid' },
    { gid: 158, name: 'strongbox', base: 0x4a4452, accent: 0xa8a6b4, pattern: 'grid' },
    { gid: 159, name: 'channel_dry', base: 0xb89a6a, accent: 0x9c8050, pattern: 'stripes' },
    { gid: 160, name: 'channel_water', base: 0x3a6fb8, accent: 0x9ad8ff, pattern: 'wave' },
    { gid: 161, name: 'camel', base: 0xc8a46b, accent: 0x8a6a3a, pattern: 'blob' },
    { gid: 162, name: 'crate_sealed', base: 0x9c7446, accent: 0xc0392b, pattern: 'cross' },
    { gid: 163, name: 'ship_hull', base: 0x5e3e22, accent: 0x3a2614, pattern: 'stripes' },
    { gid: 164, name: 'lectern', base: 0x6b4426, accent: 0xe8d8b0, pattern: 'border' },
    { gid: 165, name: 'sluice', base: 0x5e5866, accent: 0xa8a6b4, pattern: 'stripes' },
    { gid: 166, name: 'balance', base: 0x9c7446, accent: 0xf2d04b, pattern: 'cross' },
    { gid: 167, name: 'weight_hook', base: 0x6e5a3a, accent: 0xb8902a, pattern: 'blob' },
    { gid: 168, name: 'weight_hung', base: 0xb8902a, accent: 0xfff2a0, pattern: 'blob' },
    { gid: 169, name: 'balance_door', base: 0x8a6a3a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 170, name: 'sun_lock', base: 0x5e3e22, accent: 0x8a7a68, pattern: 'blob' },
    { gid: 171, name: 'sun_lock_cut', base: 0x5e3e22, accent: 0xf2d04b, pattern: 'blob' },
    { gid: 172, name: 'sealed_chest', base: 0x6b4426, accent: 0xc0392b, pattern: 'border' },
    { gid: 173, name: 'fountain_dry', base: 0xc8b07a, accent: 0x8e8e9c, pattern: 'border' },
    { gid: 174, name: 'old_gate', base: 0x6e4a2a, accent: 0xa8a6b4, pattern: 'cross' },
    { gid: 175, name: 'old_gate_open', base: 0x6e4a2a, accent: 0x3a6fb8, pattern: 'stripes' },
    // Chapter 2's side quests (Oct 20): a cut net left on the sand, a glint of something shiny the hutia dropped,
    // the ceiba as a sapling (the memory) and with its low fork (the present, once staked), the stumps of the cut
    // grove, turned earth for planting (the memory), and the young grove behind the rocks.
    { gid: 176, name: 'net_cut', base: 0xd8bf8a, accent: 0x6b4426, pattern: 'grid' },
    { gid: 177, name: 'glint', base: 0x2e8a4e, accent: 0x9ad8ff, pattern: 'dots' },
    { gid: 178, name: 'sapling', base: 0x2e8a4e, accent: 0x8cc860, pattern: 'cross' },
    { gid: 179, name: 'ceiba_fork', base: 0x2e8a4e, accent: 0x9c7446, pattern: 'cross' },
    { gid: 180, name: 'stump', base: 0x2e8a4e, accent: 0x9c7446, pattern: 'border' },
    { gid: 181, name: 'seed_row', base: 0x7a5a38, accent: 0x8cc860, pattern: 'stripes' },
    { gid: 182, name: 'grove', base: 0x2a5e2f, accent: 0xa8a6b4, pattern: 'blob' },
    // Eightgate (Chapter 5, Oct 22): the Seat's worn grey-brown stone (the realm map's seat colour, #8f8578), its walls and
    // slate roofs, the Throne Hall's violet rope and the board's sun-and-rays Throne tile, the council chairs, the Accord
    // under glass, the seven-drawer cabinet (a drawer, and one with a red thread on its handle), Coco's dress dummies,
    // mirror and curtain, the eight gates (an arch, the Iron Gate, the bricked teal one), an overturned Crown wagon,
    // the Regent's violet banner and the Archive's chain. Pattern placeholders until art drop 2.
    { gid: 183, name: 'seat_stone', base: 0x9a9082, accent: 0x8f8578, pattern: 'grid' },
    { gid: 184, name: 'seat_wall', base: 0x6e665c, accent: 0x8f8578, pattern: 'grid' },
    { gid: 185, name: 'slate_roof', base: 0x4a4a5a, accent: 0x3a3a48, pattern: 'stripes' },
    { gid: 186, name: 'violet_rope', base: 0xc8b8d8, accent: 0x6a5a8a, pattern: 'stripes' },
    { gid: 187, name: 'throne_sun', base: 0xd8b04a, accent: 0xfff2a0, pattern: 'cross' },
    { gid: 188, name: 'council_chair', base: 0x6b4426, accent: 0x8f8578, pattern: 'border' },
    { gid: 189, name: 'glass_case', base: 0x9ad8ff, accent: 0xf4ecd8, pattern: 'border' },
    { gid: 190, name: 'drawer', base: 0x5e3e22, accent: 0xc8a46b, pattern: 'grid' },
    { gid: 191, name: 'drawer_thread', base: 0x5e3e22, accent: 0xb8403a, pattern: 'cross' },
    { gid: 192, name: 'dress_dummy', base: 0xe8a8c0, accent: 0xf2d04b, pattern: 'blob' },
    { gid: 193, name: 'mirror', base: 0xc8c8d0, accent: 0x9ad8ff, pattern: 'border' },
    { gid: 194, name: 'seat_gate', base: 0x4a4a52, accent: 0x8f8578, pattern: 'cross' },
    { gid: 195, name: 'iron_gate', base: 0x3a3440, accent: 0xa8a6b4, pattern: 'stripes' },
    { gid: 196, name: 'bricked', base: 0x8a6a5a, accent: 0x17a5a5, pattern: 'grid' },
    { gid: 197, name: 'wagon_over', base: 0x7a5530, accent: 0x4a3018, pattern: 'stripes' },
    { gid: 198, name: 'violet_banner', base: 0x6a5a8a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 199, name: 'curtain', base: 0x8a3050, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 200, name: 'chain', base: 0x8f8578, accent: 0xa8a6b4, pattern: 'cross' },
    // Ordvik and the Winter Plateau (Chapter 6, Oct 22): grey-green steppe grass, slate, snow on the high ground, felt
    // tents and hide walls, corral rails, the fjord's black water, the present's drifting floes and the memory's ice
    // (white and walkable, or thin and black), shingle, sledges, longships, the standard poles (empty and planted), the
    // gully boulder, the Crown's chest and supply wagons, the cairns. Accent #5d6d7e (CAPITALS 6). Placeholders until art.
    { gid: 201, name: 'steppe_grass', base: 0x8a9a70, accent: 0x6e7e58, pattern: 'dots' },
    { gid: 202, name: 'steppe_road', base: 0xa8987a, accent: 0x8a7a5e, pattern: 'stripes' },
    { gid: 203, name: 'slate', base: 0x5d6d7e, accent: 0x46525e, pattern: 'grid' },
    { gid: 204, name: 'snow', base: 0xe8eef2, accent: 0xc8d4dc, pattern: 'dots' },
    { gid: 205, name: 'felt_wall', base: 0xc8b89a, accent: 0x8a7a5e, pattern: 'stripes' },
    { gid: 206, name: 'tent_roof', base: 0xa89878, accent: 0x6e5e44, pattern: 'stripes' },
    { gid: 207, name: 'corral', base: 0x8a6a44, accent: 0x5e4630, pattern: 'border' },
    { gid: 208, name: 'fjord_water', base: 0x1e2a36, accent: 0x2e4050, pattern: 'wave' },
    { gid: 209, name: 'floe', base: 0xd8e4ec, accent: 0x9ab0c0, pattern: 'blob' },
    { gid: 210, name: 'ice', base: 0xeaf4fa, accent: 0xb8d0e0, pattern: 'cross' },
    { gid: 211, name: 'thin_ice', base: 0x3a4a5a, accent: 0x8aa0b4, pattern: 'blob' },
    { gid: 212, name: 'shingle', base: 0x8e8e86, accent: 0x6e6e66, pattern: 'dots' },
    { gid: 213, name: 'felt_floor', base: 0xb8a07a, accent: 0x9a845e, pattern: 'grid' },
    { gid: 214, name: 'hide_wall', base: 0x7a5a3a, accent: 0xc8a46b, pattern: 'stripes' },
    { gid: 215, name: 'cairn', base: 0x9a9a92, accent: 0x6a6a62, pattern: 'blob' },
    { gid: 216, name: 'sledge', base: 0x6e5236, accent: 0xa8885a, pattern: 'stripes' },
    { gid: 217, name: 'longship', base: 0x5e3e22, accent: 0xc8a46b, pattern: 'border' },
    { gid: 218, name: 'grain_sacks', base: 0xd8c08a, accent: 0x9a845e, pattern: 'blob' },
    { gid: 219, name: 'clan_pole', base: 0x6b4426, accent: 0xe8e0c8, pattern: 'cross' },
    { gid: 220, name: 'painted_hide', base: 0xc8a46b, accent: 0xb8403a, pattern: 'border' },
    { gid: 221, name: 'chieftain_seat', base: 0x6b4426, accent: 0x5d6d7e, pattern: 'border' },
    { gid: 222, name: 'standard_pole', base: 0x6b4426, accent: 0x5d6d7e, pattern: 'stripes' },
    { gid: 223, name: 'standard_planted', base: 0x6b4426, accent: 0xe8e0c8, pattern: 'cross' },
    { gid: 224, name: 'boulder', base: 0x7a7a72, accent: 0x5a5a52, pattern: 'blob' },
    { gid: 225, name: 'boulder_wall', base: 0x6a7a5a, accent: 0x7a7a72, pattern: 'grid' },
    { gid: 226, name: 'crown_chest', base: 0x6a5a8a, accent: 0xd8b04a, pattern: 'border' },
    { gid: 227, name: 'picket', base: 0x8a6a44, accent: 0x5e4630, pattern: 'stripes' },
    { gid: 228, name: 'store_door', base: 0x2a2632, accent: 0x5d6d7e, pattern: 'border' },
    { gid: 229, name: 'supply_wagon', base: 0x7a5530, accent: 0xb8403a, pattern: 'stripes' },
    { gid: 230, name: 'wagon_burning', base: 0xd86a2a, accent: 0xf2d04b, pattern: 'blob' },
    { gid: 231, name: 'sighting_stone', base: 0xa8a6b4, accent: 0x6a6a62, pattern: 'cross' },
    { gid: 232, name: 'felt_tent', base: 0xc8b89a, accent: 0x8a7a5e, pattern: 'border' },
    // Kirinoura, Kuroshi (Chapter 7, Oct 22): black water, grey planks and bridges, white paper screens in dark lacquer
    // frames, violet-grey roofs, tatami, the marsh's reeds and causeways, the fog maze's paper walls and lanes, lantern
    // posts (dark, white, red), the file house's pivoting screens (four facings, the loose one, torn), Sayo's wall map,
    // the floor stone, the paper seal and the order. Accent #7d3c98 (CAPITALS 7). Placeholders until art.
    { gid: 233, name: 'kq_paving', base: 0x8a8690, accent: 0x6e6a78, pattern: 'grid' },
    { gid: 234, name: 'kq_wall', base: 0x3a3644, accent: 0x5a5468, pattern: 'stripes' },
    { gid: 235, name: 'kq_plank', base: 0x8e8a84, accent: 0x6a665e, pattern: 'stripes' },
    { gid: 236, name: 'kq_canal', base: 0x14141c, accent: 0x2a2a38, pattern: 'wave' },
    { gid: 237, name: 'kq_bridge', base: 0x9a9690, accent: 0x5a5468, pattern: 'border' },
    { gid: 238, name: 'lacquer_wall', base: 0x2a1a1e, accent: 0xe8e2d4, pattern: 'border' },
    { gid: 239, name: 'kq_roof', base: 0x5a5468, accent: 0x7d3c98, pattern: 'stripes' },
    { gid: 240, name: 'lacquer_floor', base: 0x5a3a32, accent: 0x3a2422, pattern: 'grid' },
    { gid: 241, name: 'tatami', base: 0xb8b07a, accent: 0x8a8458, pattern: 'grid' },
    { gid: 242, name: 'screen_wall', base: 0xece6d6, accent: 0x2a1a1e, pattern: 'cross' },
    { gid: 243, name: 'reed', base: 0x6e7a5a, accent: 0x4a5640, pattern: 'stripes' },
    { gid: 244, name: 'marsh_water', base: 0x2a3238, accent: 0x3e4a50, pattern: 'wave' },
    { gid: 245, name: 'causeway', base: 0x7a7268, accent: 0x5a544c, pattern: 'dots' },
    { gid: 246, name: 'fog_lane', base: 0xa8aab0, accent: 0x8a8c94, pattern: 'dots' },
    { gid: 247, name: 'paper_wall', base: 0xdcd8cc, accent: 0xb0aca0, pattern: 'grid' },
    { gid: 248, name: 'stone_lantern', base: 0x8a8690, accent: 0xf2d04b, pattern: 'cross' },
    { gid: 249, name: 'tea_stall', base: 0x7d3c98, accent: 0xe8e2d4, pattern: 'stripes' },
    { gid: 250, name: 'torii', base: 0x2a1a1e, accent: 0xb8403a, pattern: 'border' },
    { gid: 251, name: 'writing_table', base: 0x2a1a1e, accent: 0xd8c08a, pattern: 'border' },
    { gid: 252, name: 'lantern_pile', base: 0xe8d8a0, accent: 0xd86a2a, pattern: 'blob' },
    { gid: 253, name: 'post_dark', base: 0x3a3644, accent: 0x5a5468, pattern: 'border' },
    { gid: 254, name: 'post_white', base: 0xfafaf0, accent: 0xf2d04b, pattern: 'blob' },
    { gid: 255, name: 'post_red', base: 0xd8584a, accent: 0xf2d04b, pattern: 'blob' },
    { gid: 256, name: 'screen_n', base: 0xece6d6, accent: 0x7d3c98, pattern: 'stripes' },
    { gid: 257, name: 'screen_e', base: 0xece6d6, accent: 0x5a5468, pattern: 'border' },
    { gid: 258, name: 'screen_s', base: 0xd8d2c2, accent: 0x7d3c98, pattern: 'cross' },
    { gid: 259, name: 'screen_w', base: 0xd8d2c2, accent: 0x5a5468, pattern: 'grid' },
    { gid: 260, name: 'screen_loose', base: 0xece6d6, accent: 0xd86a2a, pattern: 'dots' },
    { gid: 261, name: 'screen_torn', base: 0xb0aca0, accent: 0x6a665e, pattern: 'blob' },
    { gid: 262, name: 'map_wall', base: 0x9a8a6a, accent: 0x6e6050, pattern: 'grid' },
    { gid: 263, name: 'map_wall_pins', base: 0xd8c08a, accent: 0xb8403a, pattern: 'dots' },
    { gid: 264, name: 'floor_stone', base: 0x6e6a78, accent: 0x2a2632, pattern: 'border' },
    { gid: 265, name: 'paper_seal', base: 0xece6d6, accent: 0xb8403a, pattern: 'cross' },
    { gid: 266, name: 'notice', base: 0xe8e2d4, accent: 0x2a1a1e, pattern: 'stripes' },
    { gid: 267, name: 'file_box', base: 0x2a1a1e, accent: 0xd8b04a, pattern: 'border' },
    { gid: 268, name: 'crown_launch', base: 0x6a5a8a, accent: 0xd8b04a, pattern: 'border' },
    { gid: 269, name: 'fishing_boat', base: 0x6b4426, accent: 0xc8a46b, pattern: 'border' },
    { gid: 270, name: 'puddle', base: 0x4a5a6a, accent: 0x8a9aaa, pattern: 'wave' },
    { gid: 271, name: 'type_press', base: 0x5a3a32, accent: 0x14141c, pattern: 'dots' },
    { gid: 272, name: 'fog_bank', base: 0xc8c8cc, accent: 0xa8aab0, pattern: 'blob' },
    { gid: 273, name: 'lanes_shut', base: 0xdcd8cc, accent: 0x7d3c98, pattern: 'stripes' },
    { gid: 274, name: 'tea_bowl', base: 0x5a3a32, accent: 0x7fbf7a, pattern: 'blob' },
    { gid: 275, name: 'crane_paper', base: 0xfafaf0, accent: 0x7d3c98, pattern: 'cross' },
    // Agnipur, Jwaladesh (Chapter 8, Oct 22): white stone and saffron, brass, salt-white ground beyond the walls, the
    // one new brick tower; the harbor's chain, lamp and bracket; the roof mirrors (face-down and four facings) and the
    // beam; the curtain and the altar's three looks; jars, carts and the oil store. Accent #e67e22 (CAPITALS 8).
    { gid: 276, name: 'jw_stone', base: 0xece4d0, accent: 0xd8ccb0, pattern: 'grid' },
    { gid: 277, name: 'jw_wall', base: 0xf4eee0, accent: 0xc8bca0, pattern: 'border' },
    { gid: 278, name: 'jw_dome', base: 0xfaf6ec, accent: 0xe67e22, pattern: 'blob' },
    { gid: 279, name: 'jw_quay', base: 0xe0d8c4, accent: 0xc4b89c, pattern: 'grid' },
    { gid: 280, name: 'jw_sea', base: 0x2a6a8a, accent: 0x4a8aa8, pattern: 'wave' },
    { gid: 281, name: 'jw_mole', base: 0xc8c0aa, accent: 0x9a9280, pattern: 'dots' },
    { gid: 282, name: 'jw_tower', base: 0xa8582a, accent: 0x7a3a1a, pattern: 'grid' },
    { gid: 283, name: 'saffron_floor', base: 0xe8a040, accent: 0xc87a28, pattern: 'grid' },
    { gid: 284, name: 'jw_column', base: 0xf4eee0, accent: 0xd8b04a, pattern: 'stripes' },
    { gid: 285, name: 'jw_roof', base: 0xe0d4b8, accent: 0xc0b090, pattern: 'dots' },
    { gid: 286, name: 'jw_plank', base: 0x9a7a52, accent: 0x6a5236, pattern: 'stripes' },
    { gid: 287, name: 'jw_void', base: 0x6a5a4a, accent: 0x4a3e34, pattern: 'dots' },
    { gid: 288, name: 'jw_road', base: 0xd8c8a0, accent: 0xb8a880, pattern: 'dots' },
    { gid: 289, name: 'scrub', base: 0x9a9a6a, accent: 0x6a6a44, pattern: 'blob' },
    { gid: 290, name: 'jw_stair', base: 0xe0d8c4, accent: 0xa89c80, pattern: 'stripes' },
    { gid: 291, name: 'arch', base: 0xf4eee0, accent: 0xe67e22, pattern: 'border' },
    { gid: 292, name: 'oil_jar', base: 0xb87a3a, accent: 0x5a3a1a, pattern: 'blob' },
    { gid: 293, name: 'store_floor', base: 0x8a7a62, accent: 0x6a5a46, pattern: 'grid' },
    { gid: 294, name: 'store_wall', base: 0x6a5a4a, accent: 0x4a3e34, pattern: 'border' },
    { gid: 295, name: 'dye_vat', base: 0x3a5ab8, accent: 0xe67e22, pattern: 'blob' },
    { gid: 296, name: 'brass_stall', base: 0xd8a840, accent: 0xe67e22, pattern: 'stripes' },
    { gid: 297, name: 'jw_steps', base: 0xf4eee0, accent: 0xe8a040, pattern: 'stripes' },
    { gid: 298, name: 'palm_floor', base: 0xd8c49a, accent: 0xb8a47a, pattern: 'grid' },
    { gid: 299, name: 'jar_cart', base: 0x8a6a42, accent: 0xb87a3a, pattern: 'border' },
    { gid: 300, name: 'tower_floor', base: 0xd0c6ae, accent: 0xa89c80, pattern: 'grid' },
    { gid: 301, name: 'chain_taut', base: 0x3a3a40, accent: 0x8a8a92, pattern: 'cross' },
    { gid: 302, name: 'chain_slack', base: 0x2a6a8a, accent: 0x3a3a40, pattern: 'wave' },
    { gid: 303, name: 'lamp_dark', base: 0x5a4a3a, accent: 0x8a7a5a, pattern: 'border' },
    { gid: 304, name: 'lamp_lit', base: 0xf2d04b, accent: 0xe67e22, pattern: 'blob' },
    { gid: 305, name: 'bracket_empty', base: 0x5a4a3a, accent: 0xa89c80, pattern: 'cross' },
    { gid: 306, name: 'bracket_mirror', base: 0xd8b04a, accent: 0xfafaf0, pattern: 'blob' },
    { gid: 307, name: 'gate_shut', base: 0x6a5a4a, accent: 0xd8b04a, pattern: 'stripes' },
    { gid: 308, name: 'store_doors', base: 0x5a3a1a, accent: 0x8a6a42, pattern: 'stripes' },
    { gid: 309, name: 'mirror_down', base: 0x8a7a5a, accent: 0x5a4a3a, pattern: 'grid' },
    { gid: 310, name: 'mirror_n', base: 0xd8b04a, accent: 0xfafaf0, pattern: 'stripes' },
    { gid: 311, name: 'mirror_e', base: 0xd8b04a, accent: 0xfafaf0, pattern: 'border' },
    { gid: 312, name: 'mirror_s', base: 0xb8903a, accent: 0x8a6a2a, pattern: 'stripes' },
    { gid: 313, name: 'mirror_w', base: 0xb8903a, accent: 0x8a6a2a, pattern: 'border' },
    { gid: 314, name: 'beam_h', base: 0xfff2a0, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 315, name: 'beam_v', base: 0xfff2a0, accent: 0xf2d04b, pattern: 'cross' },
    { gid: 316, name: 'curtain', base: 0xe67e22, accent: 0xd8b04a, pattern: 'stripes' },
    { gid: 317, name: 'altar_thumb', base: 0xd8b04a, accent: 0xf2d04b, pattern: 'dots' },
    { gid: 318, name: 'altar_tall', base: 0xf2d04b, accent: 0xe67e22, pattern: 'blob' },
    { gid: 319, name: 'wick_window', base: 0x8a8a92, accent: 0x6a6a72, pattern: 'grid' },
    { gid: 320, name: 'wick_window_lit', base: 0xfff2a0, accent: 0xf2d04b, pattern: 'grid' },
    { gid: 321, name: 'jar_stack', base: 0xb87a3a, accent: 0x8a5a2a, pattern: 'grid' },
    { gid: 322, name: 'price_board', base: 0xd8b04a, accent: 0x3a2a1a, pattern: 'stripes' },
    { gid: 323, name: 'hearth', base: 0x6a4a3a, accent: 0xe67e22, pattern: 'blob' },
    { gid: 324, name: 'shrine_dark', base: 0xf4eee0, accent: 0x5a4a3a, pattern: 'cross' },
    { gid: 325, name: 'crown_hull', base: 0x6a5a8a, accent: 0x3a3a40, pattern: 'border' },
    { gid: 326, name: 'capstan', base: 0x6a5236, accent: 0x3a3a40, pattern: 'cross' },
    { gid: 327, name: 'balance_lock', base: 0xd8b04a, accent: 0x5a4a3a, pattern: 'cross' },
    { gid: 328, name: 'oil_cart', base: 0x6a5a8a, accent: 0xb87a3a, pattern: 'border' },
    { gid: 329, name: 'jackal_den', base: 0x9a8a6a, accent: 0x5a4a3a, pattern: 'blob' },
    { gid: 330, name: 'salt_shrine', base: 0xf4eee0, accent: 0xe67e22, pattern: 'cross' },
    { gid: 331, name: 'carter_cart', base: 0x8a6a42, accent: 0xd8c8a0, pattern: 'border' },
    { gid: 332, name: 'trader_ship', base: 0xa04040, accent: 0xd8c08a, pattern: 'border' },
    // Kingsmere, Aldermoor (Chapter 9, Oct 22): grey-blue stone and slate under rain, heather and black bog beyond the
    // wall, the mere a flat grey sheet; violet only on the Crown's people and the keep's door. The archive's cabinets,
    // the panel, the postern, the organ, the oath-stone, the dock's rail and the cell's bars. Accent #2e86c1 (CAPITALS 9).
    { gid: 333, name: 'al_wetflag', base: 0x6e7884, accent: 0x5a6470, pattern: 'grid' },
    { gid: 334, name: 'al_wall', base: 0x5a6270, accent: 0x3e4450, pattern: 'border' },
    { gid: 335, name: 'al_slate', base: 0x3a4250, accent: 0x2a3038, pattern: 'stripes' },
    { gid: 336, name: 'heather', base: 0x6a5a7a, accent: 0x8a6a9a, pattern: 'dots' },
    { gid: 337, name: 'bog', base: 0x2a2a24, accent: 0x3a4030, pattern: 'blob' },
    { gid: 338, name: 'mere', base: 0x5a6a78, accent: 0x7a8a96, pattern: 'wave' },
    { gid: 339, name: 'al_road', base: 0x7a7468, accent: 0x5e5a50, pattern: 'dots' },
    { gid: 340, name: 'keep_floor', base: 0x8a8c90, accent: 0x6e7074, pattern: 'grid' },
    { gid: 341, name: 'violet_carpet', base: 0x5a4a7a, accent: 0x7a6a9a, pattern: 'stripes' },
    { gid: 342, name: 'keep_pillar', base: 0x9a9ca2, accent: 0x6a6c72, pattern: 'stripes' },
    { gid: 343, name: 'archive_floor', base: 0x6a5440, accent: 0x4e3c2c, pattern: 'grid' },
    { gid: 344, name: 'pew', base: 0x5a4030, accent: 0x3a2a1e, pattern: 'stripes' },
    { gid: 345, name: 'keep_dais', base: 0x7a6a8a, accent: 0x5a4a6a, pattern: 'grid' },
    { gid: 346, name: 'dock_rail', base: 0x4e3a2a, accent: 0x8a7050, pattern: 'border' },
    { gid: 347, name: 'cell_bars', base: 0x3a3c42, accent: 0x8a8c92, pattern: 'stripes' },
    { gid: 348, name: 'cell_floor', base: 0x5a5a52, accent: 0x44443c, pattern: 'dots' },
    { gid: 349, name: 'nave_floor', base: 0x9a948a, accent: 0x7a746a, pattern: 'grid' },
    { gid: 350, name: 'chapel_floor', base: 0x5a6a4a, accent: 0x44543a, pattern: 'dots' },
    { gid: 351, name: 'al_stall', base: 0x6a4a7a, accent: 0xd8d0c0, pattern: 'stripes' },
    { gid: 352, name: 'al_shelf', base: 0x4e3a2a, accent: 0xc8b090, pattern: 'grid' },
    { gid: 353, name: 'notice_post', base: 0x5a4a3a, accent: 0xf4eee0, pattern: 'border' },
    { gid: 354, name: 'thumbprint_door', base: 0x5a4a3a, accent: 0x9a9a9a, pattern: 'blob' },
    { gid: 355, name: 'hand_press', base: 0x3a3a40, accent: 0x8a7050, pattern: 'cross' },
    { gid: 356, name: 'drying_sheets', base: 0xf4f0e4, accent: 0x3a3a40, pattern: 'stripes' },
    { gid: 357, name: 'milestone_al', base: 0x8a8c90, accent: 0x5a5c60, pattern: 'border' },
    { gid: 358, name: 'cabinet', base: 0x5a3e2a, accent: 0xd8b04a, pattern: 'grid' },
    { gid: 359, name: 'panel_loose', base: 0x6a5440, accent: 0x4e3c2c, pattern: 'stripes' },
    { gid: 360, name: 'panel_open', base: 0x2a2018, accent: 0xf4eee0, pattern: 'border' },
    { gid: 361, name: 'ash_shelf', base: 0x4e3a2a, accent: 0x8a3b2a, pattern: 'grid' },
    { gid: 362, name: 'postern_barred', base: 0x4a3a2a, accent: 0x3a3c42, pattern: 'cross' },
    { gid: 363, name: 'postern_open', base: 0x2a2830, accent: 0x4a3a2a, pattern: 'border' },
    { gid: 364, name: 'archive_door', base: 0x3a3c42, accent: 0x6a5a8a, pattern: 'cross' },
    { gid: 365, name: 'great_organ', base: 0xb8a070, accent: 0x8a7a50, pattern: 'stripes' },
    { gid: 366, name: 'organ_console', base: 0x5a3e2a, accent: 0xd8b04a, pattern: 'border' },
    { gid: 367, name: 'oath_stone', base: 0xc8c4bc, accent: 0x9a968e, pattern: 'blob' },
    { gid: 368, name: 'bell_post', base: 0x5a4a3a, accent: 0xd8b04a, pattern: 'cross' },
    { gid: 369, name: 'court_doors', base: 0x4e3a2a, accent: 0x6a5a8a, pattern: 'stripes' },
    { gid: 370, name: 'evidence_table', base: 0x5a3e2a, accent: 0xf4eee0, pattern: 'border' },
    { gid: 371, name: 'market_cross', base: 0x9a9ca2, accent: 0x6a6c72, pattern: 'cross' },
    { gid: 372, name: 'cell_bench', base: 0x5a4a3a, accent: 0x3a2e24, pattern: 'stripes' },
    { gid: 373, name: 'gallery_desk', base: 0x5a3e2a, accent: 0xf4eee0, pattern: 'grid' },
    { gid: 374, name: 'chapel_lantern', base: 0x3a3a40, accent: 0xf2d04b, pattern: 'blob' },
    // Pòdlimyè at the Muster (Chapter 10, Oct 22): the mill's cellar and the powder store; the houses' hulls (a colour
    // and a flag each), Jordyn's coaster, the Crown's launch, the harbor chain, the signal fire; the camps' banners and the
    // Dorini table; the crane and the brass lamp on one step; the consul's strongbox, the satchel with the closed hand,
    // the evidence laid on the quay; the cellar's inner door, open and barred, and its oak bar in the memory.
    { gid: 375, name: 'cellar_wall', base: 0x4a3e34, accent: 0x2e2620, pattern: 'border' },
    { gid: 376, name: 'cellar_floor', base: 0x6a5a48, accent: 0x54463a, pattern: 'dots' },
    { gid: 377, name: 'cellar_floor_old', base: 0x5e5444, accent: 0x7a6a50, pattern: 'grid' },
    { gid: 378, name: 'muster_ship_ironvow', base: 0x5a5a62, accent: 0x8a7a68, pattern: 'stripes' },
    { gid: 379, name: 'muster_ship_suzumori', base: 0x6e6a78, accent: 0xf2d04b, pattern: 'border' },
    { gid: 380, name: 'muster_ship_agnivansh', base: 0x8a5a3a, accent: 0xd8b04a, pattern: 'cross' },
    { gid: 381, name: 'muster_ship_dorini', base: 0x2e6a4a, accent: 0xd8c08a, pattern: 'border' },
    { gid: 382, name: 'muster_ship_zetwal', base: 0x2a5a8a, accent: 0xf2d04b, pattern: 'stripes' },
    { gid: 383, name: 'jordyn_coaster', base: 0x5a4a3a, accent: 0x8a8690, pattern: 'border' },
    { gid: 384, name: 'crown_launch', base: 0x2a2632, accent: 0x6a5a8a, pattern: 'stripes' },
    { gid: 385, name: 'harbor_chain', base: 0x3a3c42, accent: 0x8a8c92, pattern: 'grid' },
    { gid: 386, name: 'signal_fire', base: 0x8a3b2a, accent: 0xf2a050, pattern: 'blob' },
    { gid: 387, name: 'signal_fire_cold', base: 0x5a4a3a, accent: 0x2a2018, pattern: 'cross' },
    { gid: 388, name: 'banner_horsetail', base: 0x6e6a78, accent: 0x8a6a3a, pattern: 'stripes' },
    { gid: 389, name: 'banner_lantern_pole', base: 0x6e6a78, accent: 0xf4eee0, pattern: 'blob' },
    { gid: 390, name: 'brass_lamp_post', base: 0x8a5a3a, accent: 0xd8b04a, pattern: 'blob' },
    { gid: 391, name: 'dorini_table', base: 0x2e6a4a, accent: 0xf4eee0, pattern: 'border' },
    { gid: 392, name: 'banner_free_brasador', base: 0x1e1a1e, accent: 0xd8d0c0, pattern: 'stripes' },
    { gid: 393, name: 'banner_violet', base: 0x8a8690, accent: 0x5a4a7a, pattern: 'stripes' },
    { gid: 394, name: 'convoy_crates', base: 0x8a6a42, accent: 0x2e6a4a, pattern: 'cross' },
    { gid: 395, name: 'crane_on_step', base: 0xf4eee0, accent: 0x6e6a78, pattern: 'cross' },
    { gid: 396, name: 'lamp_on_step', base: 0xd8b04a, accent: 0xf2a050, pattern: 'blob' },
    { gid: 397, name: 'accounts_on_table', base: 0xf4eee0, accent: 0x8a3b2a, pattern: 'grid' },
    { gid: 398, name: 'consul_strongbox', base: 0x3a2e24, accent: 0xd8b04a, pattern: 'border' },
    { gid: 399, name: 'strongbox_open', base: 0x3a2e24, accent: 0xf2d04b, pattern: 'grid' },
    { gid: 400, name: 'closed_hand_satchel', base: 0x5a4030, accent: 0x9a9a9a, pattern: 'blob' },
    { gid: 401, name: 'laid_evidence', base: 0xf4eee0, accent: 0x3a3a40, pattern: 'stripes' },
    { gid: 402, name: 'mill_door_open', base: 0x2a2018, accent: 0x6a5440, pattern: 'border' },
    { gid: 403, name: 'mill_door_barred', base: 0x5a4030, accent: 0x3a3c42, pattern: 'cross' },
    { gid: 404, name: 'mill_bar_echo', base: 0x6a5440, accent: 0x8a8c92, pattern: 'stripes' },
    { gid: 405, name: 'musket_crates', base: 0x5a4a3a, accent: 0x6a5a8a, pattern: 'cross' },
    { gid: 406, name: 'cellar_lantern', base: 0x3a3a40, accent: 0xf2d04b, pattern: 'blob' },
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
  /**
   * small: a child or Anissa; tall: Elodie. horse and wolf (Chapter 6): four legs, drawn by scenes/pixels.ts
   * drawBeast: `outfit` the coat, `hair` the mane, `trim` the tack (none on a wolf), `skin` the muzzle.
   */
  build?: 'normal' | 'small' | 'tall' | 'horse' | 'wolf';
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
/** Xaraguá's cotton and the Yaguana teal (Chapter 2). */
const COTTON = 0xe8e0c8;
const TEAL = 0x17a5a5;
const HAIR_BLACK = 0x2b2433;
const HAIR_DARK = 0x2a1a14;
const WHITE_HAIR = C.h!;
/** House Dorini's green (Al-Doria, Chapter 4). */
const DORINI_GREEN = 0x1e8449;
/** House Brasador's near-black (Ardencia, Chapter 3). */
const BRASADOR_BLACK = 0x2a2632;
/** Aldermoor's violet and the Regent's grey-violet (Eightgate, Chapter 5). */
const SEAT_VIOLET = 0x6a5a8a;
const SEAT_GREY_VIOLET = 0x5a5468;
/** Ironvow's slate (Ordvik, Chapter 6; CAPITALS.md 6 accent #5d6d7e). */
const IRONVOW_SLATE = 0x5d6d7e;
/** The Suzumori violet (Kirinoura, Chapter 7; CAPITALS.md 7 accent #7d3c98) and two skin tones of the fog city. */
const SUZUMORI_VIOLET = 0x7d3c98;
const KUROSHI_SKIN = 0xd8a880;
const KUROSHI_SKIN_WARM = 0xc8946a;
/** Agnivansh saffron (Agnipur, Chapter 8; CAPITALS.md 8 accent #e67e22), brass, and two skin tones of the city. */
const AGNI_SAFFRON = 0xe67e22;
const AGNI_BRASS = 0xd8b04a;
const AGNI_SKIN = 0xb07850;
const AGNI_SKIN_DEEP = 0x8a5a3a;
/** Kingsmere (Chapter 9; CAPITALS.md 9 accent #2e86c1): oilskin, slate grey, the Regent's violet on his own people. */
const MOOR_OILSKIN = 0x3e4a3a;
const MOOR_GREY = 0x5a6270;
const STILLWATER_GREY = 0x6e7480;

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
  // Samira of the Dorini (Al-Doria, Chapter 4): a placeholder look until her sheet is painted.
  samira: {
    skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: 0x1f6a6a, trim: C.y!, robe: true,
    headgear: 'wrap', headgearColor: C.y!, accessories: ['satchel', 'sash'],
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
  // The festival's passers-by (demo review, Oct 17): the crowd on the plaza and the temple path. Pictures only.
  festival_a: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.y!, trim: C.R!, robe: true, headgear: 'wrap', headgearColor: C.R! },
  festival_b: { skin: C.s!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.c!, trim: C.w!, legs: C.B! },
  festival_c: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: C.p!, trim: C.y!, robe: true },
  festival_d: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.w!, trim: C.o!, legs: C.K!, headgear: 'cap', headgearColor: C.o! },
  festival_e: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'short', outfit: C.U!, trim: C.y!, legs: C.K!, accessories: ['staff'] },
  festival_f: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'curly', outfit: C.L!, trim: C.w!, legs: C.B! },
  festival_g: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'puffs', outfit: C.R!, trim: C.y!, legs: C.B!, build: 'small' },
  festival_h: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.o!, trim: C.c!, robe: true, headgear: 'headband', headgearColor: C.y! },

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
  // Xaraguá (Chapter 2, Oct 16): Yucayeque's people in cotton, annatto red and Yaguana teal; the
  // Crown's marines and clerks in red and navy. Placeholders until art drop 2 (Nov 7).
  canoe_fisher: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: COTTON, trim: TEAL, legs: C.T!, headgear: 'headband', headgearColor: C.R! },
  weaver: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: TEAL, trim: C.w!, robe: true },
  fisher_boy: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: COTTON, trim: C.R!, legs: C.T!, build: 'small' },
  crown_marine: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: C.R!, trim: C.w!, legs: C.w!, headgear: 'cap', headgearColor: C.u!, accessories: ['sash'] },
  salt_seller: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.w!, trim: C.G!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N! },
  casabe_baker: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: COTTON, trim: C.o!, robe: true, accessories: ['apron'] },
  canoe_maker: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.N!, trim: TEAL, legs: C.B!, beard: HAIR_BLACK },
  shell_diver: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: TEAL, trim: C.w!, legs: C.T! },
  areito_drummer: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: COTTON, trim: C.R!, legs: C.T!, accessories: ['drum'] },
  dancer: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: TEAL, trim: C.y!, robe: true },
  plaza_elder: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'long', outfit: COTTON, trim: TEAL, robe: true, accessories: ['cane'] },
  cassava_farmer: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.N!, trim: C.L!, legs: C.B!, headgear: 'brimmed', headgearColor: C.N! },
  conuco_kid: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.L!, trim: C.w!, legs: C.T!, build: 'small' },
  hill_runner: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: TEAL, trim: C.R!, legs: C.T!, headgear: 'headband', headgearColor: C.R! },
  camp_leader: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.l!, trim: C.R!, legs: C.B!, accessories: ['bow'] },
  camp_scout: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: C.L!, trim: C.N!, legs: C.B!, accessories: ['bow'] },
  caney_guard: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.R!, trim: C.y!, legs: C.T!, headgear: 'headband', headgearColor: C.y!, accessories: ['staff'] },
  elder_charter: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'short', outfit: COTTON, trim: C.y!, robe: true, accessories: ['sash'] },
  elder_resist: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'braid', outfit: C.R!, trim: TEAL, robe: true, accessories: ['cane'] },
  elder_undecided: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'long', outfit: C.G!, trim: TEAL, robe: true },
  behique: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.p!, trim: C.w!, robe: true, headgear: 'circlet', headgearColor: C.y! },
  crown_liaison: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: C.R!, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.k!, accessories: ['epaulettes'] },
  head_runner: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: TEAL, trim: C.w!, legs: C.T!, accessories: ['satchel'] },
  song_keeper: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'long', outfit: TEAL, trim: C.y!, robe: true, accessories: ['staff'] },
  song_apprentice: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: COTTON, trim: TEAL, robe: true, build: 'small' },
  carver: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'cropped', outfit: C.N!, trim: C.R!, legs: C.B!, beard: WHITE_HAIR, accessories: ['satchel'] },
  bow_maker: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.l!, trim: TEAL, legs: C.B!, accessories: ['bow'] },
  lamp_oil_seller: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: C.o!, trim: C.k!, robe: true, headgear: 'wrap', headgearColor: C.y! },
  roots_elder: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'long', outfit: C.L!, trim: TEAL, robe: true, accessories: ['staff'] },
  crown_musketeer: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: C.R!, trim: C.w!, legs: C.w!, headgear: 'bicorne', headgearColor: C.u!, accessories: ['sash'] },
  road_bandit: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x5a4a3e, trim: C.R!, legs: C.K!, beard: HAIR_BLACK, headgear: 'wrap', headgearColor: C.R! },
  smuggler: { skin: C.T!, hair: C.B!, hairStyle: 'bald', outfit: 0x3a3440, trim: C.N!, legs: C.B!, beard: C.B!, accessories: ['satchel'] },
  lookout: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.l!, trim: C.N!, legs: C.K!, headgear: 'hood', headgearColor: C.l!, build: 'small' },
  marine_sergeant: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: C.r!, trim: C.y!, legs: C.w!, beard: C.B!, headgear: 'cap', headgearColor: C.u!, accessories: ['sash'] },
  anaco: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'long', outfit: COTTON, trim: C.y!, robe: true, headgear: 'circlet', headgearColor: C.y!, accessories: ['cane'] },
  thorne: { skin: C.T!, hair: C.w!, hairStyle: 'short', outfit: C.u!, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.k!, accessories: ['epaulettes', 'sash'] },
  // The Echo of the first oath (Oct 17): Caona, young Lord Benny of Ardencia, and the areíto fifty years ago.
  caona: {
    skin: C.T!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.L!, trim: C.R!, legs: C.T!,
    headgear: 'headband', headgearColor: C.R!, accessories: ['bow', 'sash'],
  },
  benny_young: {
    skin: C.s!, hair: HAIR_DARK, hairStyle: 'cropped', outfit: C.r!, trim: C.o!, legs: C.K!, build: 'tall',
    accessories: ['epaulettes', 'emblem'],
  },
  echo_yaguana: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: 0x6a7a40, trim: C.R!, legs: C.S!, headgear: 'headband', headgearColor: 0x8a3a2a },
  echo_yaguana_drummer: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x8a7a50, trim: C.R!, legs: C.T!, headgear: 'headband', headgearColor: C.y!, accessories: ['drum'] },
  // The Crown attack (Oct 17): the lieutenant who leads the marines into the caney, and the captain who takes it.
  marine_lieutenant: { skin: C.s!, hair: C.B!, hairStyle: 'cropped', outfit: C.r!, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.u!, accessories: ['sash', 'epaulettes'] },
  crown_captain: { skin: C.T!, hair: C.G!, hairStyle: 'short', outfit: C.u!, trim: C.y!, legs: C.w!, build: 'tall', beard: C.G!, headgear: 'bicorne', headgearColor: C.k!, accessories: ['epaulettes', 'sash'] },
  crown_clerk: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: C.u!, trim: C.w!, legs: C.K!, accessories: ['satchel'] },
  // Ardencia (Chapter 3; drawn placeholders until art drop 2, prompts in docs/quest/ART-PROMPTS.md). Brasador wears
  // near-black and crimson. Rael: tall, grey at the temples, epaulettes and sash, the signet on his hand.
  rael: { skin: C.T!, hair: C.G!, hairStyle: 'short', outfit: BRASADOR_BLACK, trim: C.R!, legs: C.k!, build: 'tall', accessories: ['epaulettes', 'sash', 'emblem'] },
  rivera: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: C.r!, trim: BRASADOR_BLACK, legs: C.K!, build: 'tall', beard: HAIR_BLACK, headgear: 'helmet', headgearColor: C.i!, accessories: ['sash'] },
  jaime: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.r!, trim: C.y!, robe: true, beard: HAIR_BLACK, accessories: ['staff', 'emblem'] },
  brasador_halberdier: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: BRASADOR_BLACK, trim: C.R!, legs: C.K!, headgear: 'helmet', headgearColor: C.i!, accessories: ['staff'] },
  free_brasador: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: BRASADOR_BLACK, trim: C.w!, legs: C.K!, headgear: 'helmet', headgearColor: C.g!, accessories: ['staff'] },
  cresswell: { skin: C.T!, hair: C.N!, hairStyle: 'short', outfit: C.u!, trim: C.w!, legs: C.w!, build: 'tall', headgear: 'bicorne', headgearColor: C.u!, accessories: ['sash', 'emblem'] },
  zelia: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'bun', outfit: BRASADOR_BLACK, trim: C.y!, robe: true, accessories: ['sash'] },
  joaquin: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.r!, trim: C.y!, legs: C.K!, headgear: 'helmet', headgearColor: C.r!, accessories: ['epaulettes'] },
  amanda: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'curly', outfit: C.o!, trim: C.R!, robe: true, headgear: 'wrap', headgearColor: C.R!, accessories: ['apron'] },
  benny_old: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'short', outfit: C.r!, trim: C.o!, legs: C.K!, beard: WHITE_HAIR, accessories: ['cane', 'emblem'] },
  nancy: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.m!, trim: C.y!, robe: true, accessories: ['sash'] },
  ard_elder: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: C.r!, trim: C.y!, robe: true, beard: WHITE_HAIR, accessories: ['cane'] },
  ard_elder_f: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.r!, trim: C.w!, robe: true },
  treasurer_daughter: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: C.g!, trim: C.w!, robe: true },
  oath_knight: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: C.G!, trim: C.R!, legs: C.K!, beard: C.B!, accessories: ['sash'] },
  baker_widow: { skin: C.S!, hair: C.G!, hairStyle: 'bun', outfit: BRASADOR_BLACK, trim: C.w!, robe: true, headgear: 'wrap', headgearColor: C.k!, accessories: ['apron'] },
  echo_clerk: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x8a7a50, trim: C.N!, legs: C.B!, accessories: ['satchel'] },
  echo_forgemaster: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bald', outfit: 0x6a5a40, trim: C.e!, legs: C.B!, beard: HAIR_BLACK, accessories: ['apron'] },
  ard_smith: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: BRASADOR_BLACK, trim: C.e!, legs: C.K!, beard: C.B!, accessories: ['apron'] },
  ard_librarian: { skin: C.T!, hair: C.G!, hairStyle: 'short', outfit: C.r!, trim: C.N!, robe: true, accessories: ['satchel'] },
  ard_villager: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'short', outfit: 0x7a5a48, trim: C.R!, legs: C.K! },
  ard_villager_f: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x8a6a50, trim: C.R!, robe: true },
  // Al-Doria (Chapter 4; drawn placeholders until art drop 2, prompts in docs/quest/ART-PROMPTS.md). The Dorini wear
  // the guild's green and gold. Layla: tall, green and gold, a ledger chain. Qasim: broad, gold rings, a cane.
  layla: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: DORINI_GREEN, trim: C.y!, robe: true, build: 'tall', headgear: 'wrap', headgearColor: C.y!, accessories: ['sash', 'emblem'] },
  qasim: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: DORINI_GREEN, trim: C.y!, legs: C.b!, build: 'tall', beard: HAIR_BLACK, headgear: 'wrap', headgearColor: C.w!, accessories: ['cane', 'sash'] },
  caravan_raider: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0xc8a46b, trim: DORINI_GREEN, legs: C.B!, headgear: 'wrap', headgearColor: 0xd8c08a, accessories: ['sash'] },
  dorini_scribe: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: DORINI_GREEN, trim: C.w!, robe: true, beard: HAIR_BLACK, accessories: ['satchel'] },
  majlis_guard: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: DORINI_GREEN, trim: C.y!, legs: C.K!, headgear: 'helmet', headgearColor: C.y!, accessories: ['staff'] },
  aldoria_trader: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'short', outfit: 0xd8c08a, trim: DORINI_GREEN, legs: C.B!, headgear: 'wrap', headgearColor: C.w!, accessories: ['satchel'] },
  aldoria_trader_f: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'long', outfit: 0xb86a3a, trim: C.y!, robe: true, headgear: 'wrap', headgearColor: 0x1e8449 },
  water_carrier: { skin: C.S!, hair: C.G!, hairStyle: 'bun', outfit: 0x5a7a9a, trim: C.w!, robe: true, headgear: 'wrap', headgearColor: C.w!, accessories: ['apron'] },
  // Coralie, "Tati Coco" (FAMILY.md, owner, Oct 21): Elodie's sister, the designer who dresses royals; flamboyant.
  coralie: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'puffs', outfit: C.P!, trim: C.y!, robe: true, build: 'tall', headgear: 'wrap', headgearColor: C.p!, accessories: ['sash', 'satchel'] },
  echo_yusuf: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x5a6a40, trim: C.N!, robe: true, accessories: ['satchel'] },
  echo_locksmith: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'bald', outfit: 0x6a5a40, trim: C.e!, legs: C.B!, beard: C.G!, accessories: ['apron'] },
  // Eightgate (Chapter 5, Oct 22; drawn placeholders until art drop 2, prompts in docs/quest/ART-PROMPTS.md). The Crown
  // and the Regent's household wear Aldermoor's grey-violet; the envoys their houses' colours. The Regent: thin, grey,
  // a chain of office, no crown. Hollis: old, a grey robe, a key at his belt. The deserters in faded Crown coats.
  regent: { skin: C.s!, hair: C.G!, hairStyle: 'short', outfit: SEAT_GREY_VIOLET, trim: 0xc8b8d8, robe: true, build: 'tall', accessories: ['emblem', 'sash'] },
  sealbearer: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: SEAT_GREY_VIOLET, trim: C.I!, legs: C.K!, headgear: 'helmet', headgearColor: SEAT_VIOLET, accessories: ['emblem', 'staff'] },
  herald: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.y!, legs: C.K!, headgear: 'cap', headgearColor: SEAT_VIOLET, accessories: ['staff', 'sash'] },
  regent_clerk: { skin: C.s!, hair: C.B!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.w!, legs: C.K!, accessories: ['satchel'] },
  chamberlain: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: C.k!, trim: C.y!, robe: true, accessories: ['staff', 'emblem'] },
  legate: { skin: C.s!, hair: C.N!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.y!, legs: C.w!, build: 'tall', headgear: 'bicorne', headgearColor: SEAT_GREY_VIOLET, accessories: ['sash', 'epaulettes'] },
  legate_aide: { skin: C.s!, hair: C.N!, hairStyle: 'curly', outfit: 0x7a7488, trim: C.w!, legs: C.K!, accessories: ['satchel'] },
  envoy_dorini: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: DORINI_GREEN, trim: C.y!, robe: true, beard: HAIR_BLACK, headgear: 'wrap', headgearColor: C.w!, accessories: ['satchel'] },
  envoy_ironvow: { skin: C.T!, hair: 0x8a6a3a, hairStyle: 'braid', outfit: 0x6e6a78, trim: 0xc8a46b, legs: C.b!, build: 'tall', headgear: 'hood', headgearColor: 0x8a7a68, accessories: ['emblem'] },
  envoy_suzumori: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'bun', outfit: C.u!, trim: C.w!, robe: true, accessories: ['sash'] },
  envoy_agnivansh: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0xe0a02a, trim: C.R!, legs: C.B!, headgear: 'wrap', headgearColor: C.o!, accessories: ['sash'] },
  hollis: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: 0x8e8e9c, trim: C.y!, robe: true, beard: WHITE_HAIR, accessories: ['satchel'] },
  pilgrim_bandaged: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'short', outfit: C.w!, trim: C.y!, robe: true, headgear: 'headband', headgearColor: C.w!, accessories: ['staff'] },
  pilgrim_nobody: { skin: C.S!, hair: C.G!, hairStyle: 'short', outfit: 0x7a6a5a, trim: C.N!, legs: C.B! },
  sky_rider: { skin: C.T!, hair: 0x8a6a3a, hairStyle: 'long', outfit: 0x8a7a68, trim: C.c!, legs: C.b!, headgear: 'brimmed', headgearColor: 0x6e6a78 },
  quiet_speaker: { skin: SKIN_TONES.tan, hair: HAIR_DARK, hairStyle: 'cropped', outfit: 0x8e8e9c, trim: C.G!, robe: true },
  deserter_sergeant: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: 0x8a4a40, trim: C.G!, legs: 0xb8b0a0, beard: C.B!, headgear: 'cap', headgearColor: 0x3a3a48, accessories: ['sash'] },
  deserter: { skin: C.S!, hair: C.B!, hairStyle: 'cropped', outfit: 0x8a4a40, trim: C.G!, legs: 0xb8b0a0, headgear: 'cap', headgearColor: 0x3a3a48 },
  echo_throne_clerk: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'short', outfit: SEAT_GREY_VIOLET, trim: C.N!, robe: true, accessories: ['satchel'] },
  echo_crown_envoy: { skin: C.s!, hair: C.N!, hairStyle: 'short', outfit: C.r!, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.k!, accessories: ['sash', 'epaulettes'] },
  echo_thomas: { skin: C.s!, hair: C.N!, hairStyle: 'short', outfit: SEAT_GREY_VIOLET, trim: C.w!, legs: C.K!, build: 'small', accessories: ['satchel'] },
  // Coco's seamstresses (beat 6): a white hood and an apron over grey, for Gianna and Anissa (DISGUISE below).
  gianna_seamstress: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'curly', outfit: 0x8e8e9c, trim: C.w!, robe: true, headgear: 'hood', headgearColor: C.w!, accessories: ['apron', 'locket'] },
  anissa_seamstress: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'puffs', outfit: 0x8e8e9c, trim: C.w!, robe: true, build: 'small', headgear: 'hood', headgearColor: C.w!, accessories: ['apron'] },
  // Ordvik and the Winter Plateau (Chapter 6, Oct 22; drawn placeholders until art, prompts in docs/quest/ART-PROMPTS.md
  // 15). The Ironvow in grey felt and fur, slate-blue at the collar (#5d6d7e); the Crown's hostage-envoy and surveyor in
  // Aldermoor violet; the eastern clans' envoy in white felt with a silver mare. Horses and wolves on four legs.
  bayarmaa: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x7a7a82, trim: IRONVOW_SLATE, legs: C.b!, accessories: ['sash'] },
  torvald: { skin: C.T!, hair: 0xb8a878, hairStyle: 'long', outfit: 0x6b5a44, trim: IRONVOW_SLATE, legs: C.b!, build: 'tall', beard: 0xb8a878, accessories: ['emblem'] },
  lawspeaker: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bald', outfit: 0x8a7a68, trim: IRONVOW_SLATE, robe: true, beard: WHITE_HAIR, accessories: ['staff'] },
  hrafn: { skin: C.T!, hair: 0x2a2a30, hairStyle: 'short', outfit: 0x2a2a30, trim: C.G!, legs: C.b!, beard: 0x2a2a30, accessories: ['sash'] },
  trading_jarl: { skin: C.T!, hair: 0xd8b878, hairStyle: 'braid', outfit: 0x8a6a44, trim: IRONVOW_SLATE, legs: C.b!, accessories: ['satchel'] },
  hostage_envoy: { skin: C.s!, hair: C.N!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.y!, legs: C.w!, accessories: ['satchel', 'sash'] },
  crown_surveyor: { skin: C.s!, hair: C.B!, hairStyle: 'short', outfit: SEAT_GREY_VIOLET, trim: C.w!, legs: C.K!, headgear: 'brimmed', headgearColor: SEAT_GREY_VIOLET, accessories: ['satchel'] },
  horn_master: { skin: C.S!, hair: 0x8a6a3a, hairStyle: 'short', outfit: 0x6e6a78, trim: C.N!, legs: C.b!, headgear: 'cap', headgearColor: 0x8a7a68, beard: 0x8a6a3a, accessories: ['drum'] },
  horn_rider: { skin: C.T!, hair: 0x8a6a3a, hairStyle: 'cropped', outfit: 0x6e6a78, trim: IRONVOW_SLATE, legs: C.b!, headgear: 'cap', headgearColor: 0x8a7a68 },
  grimvald: { skin: C.T!, hair: 0x4a3a2a, hairStyle: 'long', outfit: 0x8a8a8a, trim: C.R!, legs: C.b!, build: 'tall', beard: 0x4a3a2a, headgear: 'hood', headgearColor: 0x6e6a6a, accessories: ['sash'] },
  steppe_reaver: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x6e5a44, trim: C.R!, legs: C.b!, headgear: 'helmet', headgearColor: 0x8a7a68, accessories: ['sash'] },
  ordu_envoy: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.w!, trim: C.I!, robe: true, headgear: 'cap', headgearColor: C.w!, accessories: ['emblem', 'sash'] },
  ordu_champion: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: C.h!, trim: C.I!, legs: C.w!, headgear: 'helmet', headgearColor: C.I!, accessories: ['sash'] },
  oyuun: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x8a7a68, trim: C.R!, legs: C.b!, headgear: 'headband', headgearColor: C.R!, accessories: ['staff'] },
  old_herder: { skin: C.S!, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x6e6a5a, trim: C.N!, robe: true, beard: WHITE_HAIR, accessories: ['staff'] },
  witness_elder: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: C.w!, trim: C.y!, robe: true, accessories: ['satchel'] },
  skald: { skin: C.T!, hair: 0xb8a878, hairStyle: 'long', outfit: 0x5a6a7a, trim: C.N!, robe: true, beard: 0xb8a878, accessories: ['drum'] },
  steppe_vendor: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x8a6a44, trim: C.R!, legs: C.b!, accessories: ['apron'] },
  furrier: { skin: C.T!, hair: 0x8a6a3a, hairStyle: 'short', outfit: 0x6b5a44, trim: C.G!, legs: C.b!, beard: 0x8a6a3a, accessories: ['apron'] },
  fair_crier: { skin: C.T!, hair: 0xd8b878, hairStyle: 'cropped', outfit: 0x6e6a78, trim: C.y!, legs: C.b!, headgear: 'cap', headgearColor: C.R! },
  echo_sarnai: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x7a7a82, trim: IRONVOW_SLATE, legs: C.b!, headgear: 'hood', headgearColor: 0x8a7a68, accessories: ['emblem'] },
  echo_rider: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x6e5a44, trim: IRONVOW_SLATE, legs: C.b!, headgear: 'helmet', headgearColor: 0x8a7a68 },
  echo_crown_sentry: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: C.R!, trim: C.w!, legs: C.w!, headgear: 'cap', headgearColor: C.u!, accessories: ['sash'] },
  horse_grey: { skin: 0xb8b8c0, hair: 0x4a4a52, hairStyle: 'short', outfit: 0xa8a6b4, trim: IRONVOW_SLATE, build: 'horse' },
  horse_bay: { skin: 0x5a3a28, hair: C.b!, hairStyle: 'short', outfit: 0x8a5a34, trim: C.N!, build: 'horse' },
  horse_dun: { skin: 0x8a7a5a, hair: 0x3a3028, hairStyle: 'short', outfit: 0xc8b07a, trim: C.N!, build: 'horse' },
  horse_black: { skin: 0x3a3440, hair: 0x1e1a22, hairStyle: 'short', outfit: 0x2a2632, trim: C.R!, build: 'horse' },
  horse_chestnut: { skin: 0x6a3a22, hair: 0x6a3a22, hairStyle: 'short', outfit: 0xa85a2a, trim: C.N!, build: 'horse' },
  echo_horse: { skin: 0x6a5a48, hair: 0x3a3028, hairStyle: 'short', outfit: 0x9a8a6a, trim: C.N!, build: 'horse' },
  steppe_wolf: { skin: 0x3a3440, hair: 0x6e6a78, hairStyle: 'short', outfit: 0x9a9aa2, trim: 0x9a9aa2, build: 'wolf' },
  // Kirinoura (Chapter 7, Oct 22; drawn placeholders until art, prompts in docs/quest/ART-PROMPTS.md 16). The Suzumori
  // in grey and violet (#7d3c98), clerks in grey with ink on the cuff, the Crown's observer in Aldermoor violet, the
  // fishers in plain indigo; the Echo's Lady Sayo and her agents in the memory's grey.
  haru: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x6e6a78, trim: SUZUMORI_VIOLET, legs: 0x3a3644, accessories: ['sash', 'satchel'] },
  kayla: { skin: KUROSHI_SKIN_WARM, hair: HAIR_BLACK, hairStyle: 'bun', outfit: 0x8a8690, trim: 0x2a2a38, robe: true, accessories: ['satchel'] },
  kaede: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'bun', outfit: 0x5a5468, trim: SUZUMORI_VIOLET, robe: true, accessories: ['sash', 'emblem'] },
  retainer_neutral: { skin: KUROSHI_SKIN, hair: 0x4a4a52, hairStyle: 'short', outfit: 0x6e6a78, trim: C.w!, robe: true, beard: 0x4a4a52, accessories: ['emblem'] },
  retainer_war: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'long', outfit: 0x3a3644, trim: SUZUMORI_VIOLET, legs: 0x2a2632, accessories: ['sash'] },
  signal_master: { skin: KUROSHI_SKIN, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x5a5468, trim: C.y!, robe: true, accessories: ['staff'] },
  keeper_files: { skin: KUROSHI_SKIN, hair: 0x4a4a52, hairStyle: 'bald', outfit: 0x6e6a78, trim: C.N!, robe: true, accessories: ['satchel'] },
  crown_observer: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.y!, legs: C.w!, accessories: ['satchel', 'sash'] },
  observer_clerk: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x8a8690, trim: SEAT_VIOLET, legs: 0x3a3644, accessories: ['satchel'] },
  paper_fox: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x8a8690, trim: C.w!, robe: true, accessories: ['sash', 'veil'] },
  gate_guard_kq: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x3a3644, trim: SUZUMORI_VIOLET, legs: 0x2a2632, headgear: 'helmet', headgearColor: 0x3a3644 },
  harbour_master: { skin: KUROSHI_SKIN, hair: 0x6e6a78, hairStyle: 'short', outfit: 0x2a3a58, trim: C.w!, legs: 0x2a2632, headgear: 'brimmed', headgearColor: 0x5a5468, beard: 0x6e6a78 },
  kq_vendor: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'bun', outfit: SUZUMORI_VIOLET, trim: C.w!, robe: true, accessories: ['apron'] },
  kq_armourer: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x4a4a52, trim: C.R!, legs: 0x2a2632, accessories: ['apron'] },
  kq_librarian: { skin: KUROSHI_SKIN, hair: WHITE_HAIR, hairStyle: 'bun', outfit: 0x6e6a78, trim: C.N!, robe: true, accessories: ['satchel'] },
  suzumori_elder: { skin: KUROSHI_SKIN, hair: WHITE_HAIR, hairStyle: 'bald', outfit: 0x5a5468, trim: C.G!, robe: true, beard: WHITE_HAIR, accessories: ['staff'] },
  kq_fisher_woman: { skin: KUROSHI_SKIN_WARM, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0x2a3a78, trim: C.w!, robe: true, headgear: 'wrap', headgearColor: 0x2a3a78 },
  kq_fisher_boy: { skin: KUROSHI_SKIN_WARM, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x2a3a78, trim: C.N!, legs: 0x3a3644, build: 'small' },
  kq_old_fisher: { skin: KUROSHI_SKIN_WARM, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x2a3a58, trim: C.N!, legs: 0x3a3644, headgear: 'brimmed', headgearColor: C.N!, beard: WHITE_HAIR },
  balance_keeper: { skin: KUROSHI_SKIN, hair: 0x4a4a52, hairStyle: 'long', outfit: C.G!, trim: C.y!, robe: true, accessories: ['satchel'] },
  whisperer: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x4a4650, trim: 0x2a2632, robe: true, headgear: 'hood', headgearColor: 0x4a4650, accessories: ['veil'] },
  lantern_lighter: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x5a5468, trim: C.y!, legs: 0x2a2632, accessories: ['staff'] },
  fog_cutpurse: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x6e6a78, trim: 0x3a3644, legs: 0x2a2632, headgear: 'hood', headgearColor: 0x5a5468 },
  husher: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x3a3644, trim: 0x8a8690, robe: true, headgear: 'cowl', headgearColor: 0x2a2632, accessories: ['veil'] },
  lantern_moth: { skin: 0xe8e2d4, hair: 0xf2d04b, hairStyle: 'puffs', outfit: 0xe8e2d4, trim: 0xf2d04b, build: 'small' },
  echo_sayo: { skin: KUROSHI_SKIN, hair: 0x4a4a52, hairStyle: 'bun', outfit: 0x6e6a78, trim: SUZUMORI_VIOLET, robe: true, accessories: ['satchel', 'emblem'] },
  echo_sayo_clerk: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x8a8690, trim: 0x2a2a38, robe: true, accessories: ['satchel'] },
  echo_agent: { skin: KUROSHI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x6e6a78, trim: 0x3a3644, legs: 0x2a2632, headgear: 'hood', headgearColor: 0x6e6a78 },
  // Agnipur (Chapter 8, Oct 22; drawn placeholders until art, prompts in docs/quest/ART-PROMPTS.md 17). Saffron and
  // white, brass, leather aprons; the Crown's oil-factor in Aldermoor violet; the Echo's Arjun, his riders and runners
  // in the memory's palette.
  vikram: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: AGNI_SAFFRON, trim: AGNI_BRASS, legs: 0xf4eee0, accessories: ['sash'] },
  aiyana: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'bun', outfit: AGNI_SAFFRON, trim: 0x6a4a2a, legs: 0x5a3a1a, headgear: 'headband', headgearColor: 0xf4eee0, accessories: ['apron', 'satchel'] },
  meera: { skin: AGNI_SKIN, hair: 0x4a4a52, hairStyle: 'bun', outfit: 0xf4eee0, trim: AGNI_SAFFRON, robe: true, accessories: ['sash', 'staff'] },
  senior_keeper: { skin: AGNI_SKIN_DEEP, hair: WHITE_HAIR, hairStyle: 'bald', outfit: AGNI_SAFFRON, trim: AGNI_BRASS, robe: true, beard: WHITE_HAIR, accessories: ['veil'] },
  junior_priest: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: AGNI_SAFFRON, trim: 0xf4eee0, robe: true, accessories: ['staff'] },
  chamberlain_jw: { skin: AGNI_SKIN_DEEP, hair: 0x4a4a52, hairStyle: 'short', outfit: 0xf4eee0, trim: AGNI_BRASS, robe: true, beard: 0x4a4a52, accessories: ['emblem'] },
  oil_factor: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.y!, legs: C.w!, accessories: ['satchel'] },
  seth_dhanraj: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0xf4eee0, trim: AGNI_BRASS, robe: true, beard: HAIR_BLACK, headgear: 'wrap', headgearColor: 0xf4eee0, accessories: ['satchel', 'emblem'] },
  echo_arjun: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'long', outfit: 0x9a6a3a, trim: AGNI_BRASS, legs: 0x5a4a3a, build: 'tall', beard: HAIR_BLACK, accessories: ['staff', 'sash'] },
  echo_runner: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0xb8905a, trim: 0x6e5a44, legs: 0x5a4a3a, accessories: ['sash'] },
  echo_agnivansh_rider: { skin: AGNI_SKIN_DEEP, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0x9a6a3a, trim: 0x6e5a44, legs: 0x5a4a3a, headgear: 'helmet', headgearColor: 0x8a7a68, accessories: ['staff'] },
  chief_runner: { skin: AGNI_SKIN_DEEP, hair: WHITE_HAIR, hairStyle: 'bun', outfit: AGNI_SAFFRON, trim: 0xf4eee0, legs: 0x5a3a1a, accessories: ['staff', 'sash'] },
  runner: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: AGNI_SAFFRON, trim: 0xf4eee0, legs: 0xf4eee0, accessories: ['sash'] },
  carter: { skin: AGNI_SKIN_DEEP, hair: 0x4a4a52, hairStyle: 'short', outfit: 0x8a7a5a, trim: 0x5a4a3a, legs: 0x5a4a3a, headgear: 'wrap', headgearColor: 0xd8c8a0 },
  shrine_child: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'braid', outfit: 0xf4eee0, trim: AGNI_SAFFRON, build: 'small' },
  flame_keeper: { skin: AGNI_SKIN_DEEP, hair: HAIR_BLACK, hairStyle: 'long', outfit: AGNI_SAFFRON, trim: 0xb8403a, robe: true, accessories: ['emblem'] },
  lamp_seller: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'short', outfit: 0xd8c8a0, trim: AGNI_BRASS, legs: 0x5a4a3a, headgear: 'cap', headgearColor: AGNI_SAFFRON },
  dyer: { skin: AGNI_SKIN_DEEP, hair: HAIR_BLACK, hairStyle: 'curly', outfit: 0x3a5ab8, trim: AGNI_SAFFRON, legs: 0x3a5ab8, accessories: ['apron'] },
  oil_enforcer: { skin: AGNI_SKIN_DEEP, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0xd8d0c0, trim: 0x6a6a72, legs: 0x4a4a52, build: 'tall', beard: HAIR_BLACK, accessories: ['satchel'] },
  ember_jackal: { skin: 0xc87a3a, hair: 0xe67e22, hairStyle: 'short', outfit: 0xd89a5a, trim: 0xf2d04b, build: 'wolf' },
  jw_vendor: { skin: AGNI_SKIN, hair: HAIR_BLACK, hairStyle: 'bun', outfit: AGNI_SAFFRON, trim: 0xf4eee0, robe: true, accessories: ['apron'] },
  jw_swordsmith: { skin: AGNI_SKIN_DEEP, hair: HAIR_BLACK, hairStyle: 'bald', outfit: 0x4a4a52, trim: AGNI_BRASS, legs: 0x2a2632, beard: HAIR_BLACK, accessories: ['apron'] },
  jw_librarian: { skin: AGNI_SKIN, hair: WHITE_HAIR, hairStyle: 'long', outfit: 0xf4eee0, trim: AGNI_SAFFRON, robe: true, accessories: ['satchel'] },
  jw_harbour_master: { skin: AGNI_SKIN_DEEP, hair: 0x4a4a52, hairStyle: 'short', outfit: 0x2a3a58, trim: AGNI_BRASS, legs: 0x2a2632, headgear: 'wrap', headgearColor: AGNI_SAFFRON, beard: 0x4a4a52 },
  // Kingsmere (Chapter 9, Oct 22; drawn placeholders until art, prompts in docs/quest/ART-PROMPTS.md 18). Grey wool and
  // oilskin under the rain; the Regent's violet on his own people; the Almoner in the road watcher's own look (the second
  // review's 3.2: the recognition is also a picture), and unveiled in the same palette.
  edmund: { skin: C.s!, hair: C.N!, hairStyle: 'curly', outfit: STILLWATER_GREY, trim: C.w!, legs: C.K!, headgear: 'brimmed', headgearColor: 0x3a3440, accessories: ['satchel'] },
  jordyn: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: SEAT_VIOLET, trim: C.y!, legs: C.K!, build: 'tall', accessories: ['epaulettes', 'sash'] },
  sebastian: { skin: C.S!, hair: 0x4a4a52, hairStyle: 'short', outfit: 0x5a2a3a, trim: C.y!, legs: C.K!, build: 'tall', beard: 0x6a6a72, accessories: ['sash'] },
  almoner: { ...QUIET_CROWN.quiet_crown_f_brown!, outfit: 0x5a5a62 },
  almoner_unveiled: { skin: SKIN_TONES.brown, hair: C.G!, hairStyle: 'bun', outfit: 0x5a5a62, trim: 0xc8c8d0, robe: true, accessories: ['emblem'] },
  almswoman: { skin: SKIN_TONES.tan, hair: HAIR_DARK, hairStyle: 'braid', outfit: 0x6a6a72, trim: 0xc8c8d0, robe: true, headgear: 'cowl', headgearColor: 0x5a5a62, accessories: ['veil'] },
  rosalind: { skin: C.T!, hair: C.G!, hairStyle: 'bun', outfit: SEAT_GREY_VIOLET, trim: C.I!, robe: true, accessories: ['emblem'] },
  magistrate_al: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x2a2632, trim: SEAT_VIOLET, robe: true, accessories: ['emblem'] },
  keep_steward: { skin: C.S!, hair: C.B!, hairStyle: 'bald', outfit: SEAT_VIOLET, trim: C.N!, legs: C.K!, beard: C.B!, accessories: ['satchel'] },
  witness_bishop: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0xd8d0c0, trim: 0x2e86c1, robe: true, accessories: ['staff'] },
  assize_clerk: { skin: C.s!, hair: C.B!, hairStyle: 'short', outfit: SEAT_VIOLET, trim: C.w!, legs: C.K!, accessories: ['satchel', 'emblem'] },
  regent_watch: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: SEAT_VIOLET, trim: C.I!, legs: C.K!, headgear: 'cap', headgearColor: SEAT_GREY_VIOLET, accessories: ['staff'] },
  watch_inside_out: { skin: C.S!, hair: C.B!, hairStyle: 'cropped', outfit: 0x8a8690, trim: SEAT_VIOLET, legs: C.K!, headgear: 'cap', headgearColor: 0x8a8690, accessories: ['staff'] },
  echo_old_sealbearer: { skin: C.T!, hair: C.B!, hairStyle: 'cropped', outfit: 0x7a6a5a, trim: C.N!, legs: C.b!, headgear: 'helmet', headgearColor: 0x8a7a68, accessories: ['emblem'] },
  moor_constable: { skin: C.T!, hair: C.B!, hairStyle: 'short', outfit: MOOR_OILSKIN, trim: C.N!, legs: C.K!, headgear: 'brimmed', headgearColor: MOOR_OILSKIN, accessories: ['staff'] },
  bog_hound: { skin: 0x1a1420, hair: 0x2a2632, hairStyle: 'short', outfit: 0x2a2a30, trim: 0x2a2a30, build: 'wolf' },
  crown_officer: { skin: C.s!, hair: C.B!, hairStyle: 'cropped', outfit: SEAT_VIOLET, trim: C.y!, legs: C.w!, headgear: 'bicorne', headgearColor: C.u!, accessories: ['sash', 'epaulettes'] },
  printer: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'short', outfit: 0x4a4a52, trim: 0x1a1420, legs: C.K!, beard: WHITE_HAIR, accessories: ['apron'] },
  apprentice: { skin: C.S!, hair: C.B!, hairStyle: 'cropped', outfit: 0x6a6a72, trim: 0x1a1420, legs: C.K!, accessories: ['apron'] },
  clockmaker: { skin: C.T!, hair: C.G!, hairStyle: 'bald', outfit: 0x5a4030, trim: C.y!, legs: C.K!, beard: C.G!, accessories: ['satchel'] },
  pie_seller: { skin: C.T!, hair: C.B!, hairStyle: 'bun', outfit: 0xd8d0c0, trim: 0x2e86c1, robe: true, accessories: ['apron'] },
  pie_boy: { skin: C.T!, hair: C.N!, hairStyle: 'short', outfit: MOOR_GREY, trim: C.w!, build: 'small' },
  pie_mother: { skin: C.T!, hair: C.B!, hairStyle: 'bun', outfit: 0x8a7a68, trim: C.w!, robe: true, accessories: ['apron'] },
  tea_woman: { skin: C.S!, hair: HAIR_DARK, hairStyle: 'long', outfit: 0x4e5a6a, trim: C.w!, robe: true },
  al_jeweller: { skin: C.T!, hair: C.G!, hairStyle: 'short', outfit: 0x2a2632, trim: C.y!, legs: C.K!, accessories: ['emblem'] },
  al_outfitter: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'curly', outfit: MOOR_OILSKIN, trim: C.N!, legs: C.K!, accessories: ['apron'] },
  qc_hierarch: { skin: SKIN_TONES.light, hair: C.G!, hairStyle: 'short', outfit: 0x6a6a72, trim: 0xc8c8d0, robe: true, accessories: ['sash', 'emblem'] },
  gaze_exile: { skin: C.s!, hair: WHITE_HAIR, hairStyle: 'long', outfit: 0xc8a050, trim: C.w!, robe: true, headgear: 'wrap', headgearColor: 0xd8b860, accessories: ['staff'] },
  rolls_keeper: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: 0x2a2632, trim: 0x2e86c1, robe: true, accessories: ['satchel'] },
  verger: { skin: C.S!, hair: C.G!, hairStyle: 'bald', outfit: 0x2a2632, trim: 0xd8d0c0, robe: true, accessories: ['staff'] },
  // Pòdlimyè at the Muster (Chapter 10, Oct 22; drawn placeholders until art, prompts in docs/quest/ART-PROMPTS.md 19).
  // Rahel: tall, straight, a black shawl and a Brasador brooch (the second review's 3.2: no steppe braid); Patricia: small,
  // white-haired, a cane she does not use; Joaquin without the sash; Jordyn's coat turned inside out; the Dorini admiral
  // (Rashid, by role) in green with a ledger; the Agnivansh steward (Prakash, by role) in saffron; the Zetwal levy; Ti Jak,
  // sixteen, a cutter's blade; the powder-master fifty years ago; the crew's chief, a smuggler with a red cap.
  rahel: { skin: C.T!, hair: C.G!, hairStyle: 'bun', outfit: 0x1e1a1e, trim: 0xb8403a, robe: true, build: 'tall', accessories: ['emblem'] },
  patricia: { skin: C.T!, hair: WHITE_HAIR, hairStyle: 'bun', outfit: 0x5a4a5a, trim: C.w!, robe: true, build: 'small', accessories: ['cane'] },
  joaquin_free: { skin: C.T!, hair: HAIR_DARK, hairStyle: 'short', outfit: BRASADOR_BLACK, trim: C.w!, legs: C.K!, headgear: 'helmet', headgearColor: C.g!, accessories: ['epaulettes'] },
  jordyn_free: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x8a8690, trim: SEAT_VIOLET, legs: C.K!, build: 'tall', accessories: ['epaulettes'] },
  dorini_admiral: { skin: C.T!, hair: HAIR_BLACK, hairStyle: 'braid', outfit: DORINI_GREEN, trim: C.y!, legs: C.K!, beard: HAIR_BLACK, headgear: 'bicorne', headgearColor: DORINI_GREEN, accessories: ['satchel', 'epaulettes'] },
  dorini_marine: { skin: C.S!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: DORINI_GREEN, trim: C.w!, legs: C.K!, headgear: 'cap', headgearColor: DORINI_GREEN, accessories: ['staff'] },
  agnivansh_steward: { skin: AGNI_SKIN, hair: 0x4a4a52, hairStyle: 'short', outfit: AGNI_SAFFRON, trim: AGNI_BRASS, robe: true, beard: 0x4a4a52, accessories: ['emblem', 'satchel'] },
  zetwal_levy: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0x2a5a8a, trim: C.y!, legs: C.K!, headgear: 'cap', headgearColor: 0x2a5a8a, accessories: ['staff'] },
  ti_jak: { skin: C.s!, hair: HAIR_BLACK, hairStyle: 'cropped', outfit: 0xa89c86, trim: C.o!, legs: C.B!, build: 'small', accessories: ['staff'] },
  powder_master: { skin: C.T!, hair: C.G!, hairStyle: 'bald', outfit: 0x6a5230, trim: C.R!, legs: C.b!, beard: C.G!, accessories: ['apron'] },
  crew_chief: { skin: C.T!, hair: C.B!, hairStyle: 'bald', outfit: 0x3a3440, trim: 0xb8403a, legs: C.B!, beard: C.B!, headgear: 'cap', headgearColor: 0xb8403a, accessories: ['satchel'] },
};

/** The player's look in each era. */
export const PLAYER_LOOK = 'gianna';
export const ECHO_PLAYER_LOOK = 'patricio_young';

/**
 * Coco's seamstresses (Chapter 5, beat 6): from the veils in the fitting room until Hollis says "Take off the veil",
 * Gianna and Anissa wear these looks on the map (in the Echo Anissa still glows, in her apron).
 */
export const DISGUISE = { flag: 'story.disguised', player: 'gianna_seamstress', anissa: 'anissa_seamstress' } as const;

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
  caona: portrait('caona', SEPIA),
  benny: portrait('benny_young', SEPIA),
  echo_spring_keeper: portrait('echo_yaguana', SEPIA),
  echo_areito_drummer: portrait('echo_yaguana_drummer', SEPIA),
  echo_areito_singer: portrait('echo_yaguana', SEPIA),
  // Chapter 2's side quests (Oct 20): Caona's scouts in the gardens, and their healer at the hill camp.
  echo_hutia_scout: portrait('echo_yaguana', SEPIA),
  echo_scout_healer: portrait('echo_yaguana', SEPIA),
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
 * A wash of colour over some maps while a condition holds, in the present only: Yucayeque occupied, under
 * curfew and smoke after the Crown attack (Chapter 2, Oct 17). Drawn over the world, under the interface.
 */
export const MAP_MOODS: readonly { maps: readonly string[]; if: Condition; color: number; alpha: number }[] = [
  // Dusk over the free city (Chapter 2 side quests, Oct 20): once every quest is done the sun goes down, the night
  // canoe brings the lamp oil, and the cave, the areíto and the proof all happen in the evening (data/quests.ts dusk).
  {
    maps: ['xaragua-village', 'xaragua-beach', 'xaragua-conuco', 'xaragua-plaza', 'xaragua-mountain', 'xaragua-camp'],
    if: { all: [{ any: [CHAPTER2_QUESTS_DONE, { flag: 'item.oil_lamp' }] }, { notFlag: 'story.crown_attack' }] },
    color: 0x4a2a5a,
    alpha: 0.24,
  },
  {
    maps: ['xaragua-village', 'xaragua-beach', 'xaragua-conuco', 'xaragua-plaza', 'xaragua-mountain'],
    if: { flag: 'story.crown_attack' },
    color: 0x14183a,
    alpha: 0.34,
  },
  // The Lower Town by night (Bread at Night, Chapter 3).
  { maps: ['ardencia-lower'], if: { flag: 'story.cart_night' }, color: 0x101428, alpha: 0.42 },
  // Al-Doria from dusk to the caravan's first light (Chapter 4, review 3.9): the same condition as the guild hall's
  // door (Samira's three things done), not a flag of its own, so a debate settled last still brings the night.
  {
    maps: ['aldoria-bazaar', 'aldoria-desert'],
    if: {
      all: [
        { flag: 'side.appraise.done' },
        { flag: 'side.sweet_water.done' },
        { flag: 'debate.aldoria_bargain.settled' },
        { notFlag: 'story.caravan_dawn' },
      ],
    },
    color: 0x1a1430,
    alpha: 0.38,
  },
  // The Seat at evening (Chapter 5, beat 5's end): the three required quests done, until the bell (the veils).
  {
    maps: ['seat-gateyard', 'seat-concourse', 'seat-quarter', 'seat-fields'],
    if: { all: [CHAPTER5_QUESTS_DONE, { notFlag: 'story.disguised' }, { notFlag: 'story.archive_entered' }] },
    color: 0x2a2048,
    alpha: 0.3,
  },
  // Dusk on the Winter Plateau (Chapter 6): the day's three things done, until the party comes round the fjord's head
  // at dawn with the standard (data/skarragol.ts FAIR_DUSK). The fjord's near shore is at dusk too: they set out then.
  {
    maps: ['skarragol-fair', 'skarragol-plateau', 'skarragol-quay', 'skarragol-fjord'],
    if: FAIR_DUSK,
    color: 0x2a2848,
    alpha: 0.32,
  },
  // Kirinoura (Chapter 7): the lantern hour on the quarter, the pier, the library and the Hall (K-2 and the debate
  // done, until dawn: data/kuroshi.ts QUARTER_DUSK); the night fog in the maze, the marsh and the file house from the
  // lantern hour until dawn (NIGHT); and the fog in the maze and on the marsh by day, after it.
  {
    maps: ['kuroshi-quarter', 'kuroshi-pier', 'kuroshi-library', 'kuroshi-hall'],
    if: QUARTER_DUSK,
    color: 0x2a2848,
    alpha: 0.32,
  },
  {
    maps: ['kuroshi-fogmaze', 'kuroshi-marsh', 'kuroshi-filehouse'],
    if: NIGHT,
    color: 0x3a3c4a,
    alpha: 0.4,
  },
  {
    maps: ['kuroshi-fogmaze', 'kuroshi-marsh'],
    if: { flag: 'story.quarter_dawn' },
    color: 0xa8aab0,
    alpha: 0.28,
  },
  // Agnipur (Chapter 8): night on the harbor, the bazaar, the roofs and the Court from the night lamp's hour until the
  // store is opened (data/jwaladesh.ts NIGHT, a condition: the day's three things done); dawn at the Court after.
  {
    maps: ['jwaladesh-harbor', 'jwaladesh-bazaar', 'jwaladesh-rooftops', 'jwaladesh-court', 'jwaladesh-library'],
    if: AGNIPUR_NIGHT,
    color: 0x1e2448,
    alpha: 0.38,
  },
  {
    maps: ['jwaladesh-court', 'jwaladesh-harbor'],
    if: AGNIPUR_DAWN,
    color: 0xf2a050,
    alpha: 0.14,
  },
  // Kingsmere (Chapter 9): the keep and the church by night from the Toccata's first chord until the party is caught
  // (data/aldermoor.ts KEEP_NIGHT); the eve's lamplit dusk on the square, the close and the church (EVE, a condition);
  // the last dawn on the Heath (LAST_DAWN); and the rain on the outdoor maps until then (RAIN: a wash, not a layer).
  { maps: ['aldermoor-keep', 'aldermoor-cathedral'], if: KEEP_NIGHT, color: 0x141830, alpha: 0.42 },
  { maps: ['aldermoor-cross', 'aldermoor-keep', 'aldermoor-cathedral', 'aldermoor-heath'], if: KINGSMERE_EVE, color: 0x2a2440, alpha: 0.34 },
  { maps: ['aldermoor-heath', 'aldermoor-cross'], if: KINGSMERE_DAWN, color: 0xd8a070, alpha: 0.12 },
  { maps: ['aldermoor-heath', 'aldermoor-cross'], if: KINGSMERE_RAIN, color: 0x5a6a80, alpha: 0.22 },
  // Pòdlimyè at the Muster (Chapter 10; data/muster.ts): the dusk of the inspection (lanterns, orange), the night under the
  // point (deep blue), the dawn of the fleet (warm gold), on the outdoor maps.
  { maps: MUSTER_OUTDOORS, if: MUSTER_NIGHT, color: 0x101830, alpha: 0.45 },
  { maps: MUSTER_OUTDOORS, if: MUSTER_DUSK, color: 0xf2a050, alpha: 0.18 },
  { maps: MUSTER_OUTDOORS, if: MUSTER_DAWN, color: 0xd8a070, alpha: 0.12 },
];

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

/**
 * A picture behind an act's end card (demo review, Oct 17: not three lines on black), by card id
 * (data/cards.ts). Chapter 1 ends over the intro film's last frame, the plaza at dawn.
 */
export const CARD_ART: Readonly<Record<string, string>> = {
  act1_end: 'art/cards/act1-end.webp',
};

/**
 * The Game Over screen (docs/quest/intro/GAME-OVER-STORYBOARD.md): the animator's films and still, by path
 * under quest/art/ (src/scenes/artFiles.ts finds them). Each one replaces its part of the code-drawn
 * placeholder (scenes/gameOverArt.ts) when its file is there; a missing file keeps the placeholder.
 * The bell is in audio.config.ts (GAME_OVER_BELL_FILE); the timings are in config.ts (GAME_OVER).
 *
 *  gameover/gameover-fall.mp4   6 s: from the lost battle into her presence, ending on the held pose.
 *  gameover-loop.mp4            4 s, seamless: her presence, breathing, while the player reads.
 *  gameover-rise.mp4            1.5 s: the threads draw up, the gold flash, ending on solid cream.
 *  gameover-still.png           the held pose, for players whose device asks for less motion.
 */
export const GAME_OVER_ART = {
  fall: 'gameover/gameover-fall.mp4',
  loop: 'gameover/gameover-loop.mp4',
  rise: 'gameover/gameover-rise.mp4',
  still: 'gameover/gameover-still.png',
  /** The placeholder's colours: the intro's palette, with the game's navy for her sky. */
  colors: {
    night: '#1a1420',
    grey: '#3a3440',
    navy: '#2a3a78',
    gold: '#f2d04b',
    paleGold: '#fff2a0',
    cream: '#f4ecd8',
    sky: '#9ad8ff',
    blue: '#3b4fa8',
  },
  /** How many gold threads the placeholder's loom strings, and how many stars light. */
  threads: 20,
  stars: 24,
} as const;

/**
 * Quest arrows (engine/guide.ts; owner requests, Oct 17 and 18): the gold arrow at the screen's edge that points
 * the story's way, the marker over the stop once it is on screen, and the minimap's dots (the story gold, side
 * quests silver, those not started yet too).
 */
export const QUEST_ARROW = {
  /** The story's pointer is gold; a side quest's is silver (owner, Oct 18). */
  fill: 0xf2c14e,
  side: 0xc8d0dc,
  outline: 0x14101a,
  /** How far inside the screen's edge the arrow floats, and the stop counts as on screen (world pixels). */
  edge: 14,
} as const;
export const SIDE_MAP_TARGET = { story: '#f2c14e', side: '#c8d0dc' } as const;

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
  /** The sparkles over a spot: their opacity, how often the two frames swap (ms), and the upward drift (px/s). */
  echoShimmerAlpha: 0.7,
  echoShimmerFrameMs: 320,
  echoShimmerDrift: 6,
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

/** The Echo spots' shimmer frames (ECHO_SHIMMER), one texture each. */
export function textureKeyForShimmer(frame: number): string {
  return `echo-shimmer-${frame}`;
}

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
  /** A foe in disguise (Chapter 7's paper decoys): a grey bar, full, until it is found out. */
  hpMasked: 0x8a8494,
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

// Ardencia (Chapter 3): the Cinder Flats under a hazy sky, black lava and steam; the duel court's sand ring under
// the Alcázar's red walls; Benny's tunnel, a black lava tube with a glow of lava far down it.
const ARDENCIA_BACKDROPS = {
  cinder_flats: {
    sky: [0x8a6a5a, 0x9a7a66, 0xaa8a72, 0xbc9c80, 0xceae90, 0xdcc0a4],
    cloud: 0xe8dccc,
    cloudShade: 0xb8a898,
    mountainFar: 0x5a4a50,
    mountainNear: 0x3a3038,
    trees: 0x2a2430,
    treesDark: 0x1a1420,
    field: 0x3a3440,
    cane: 0x6e6a78,
    caneDark: 0x4a4452,
    ground: 0x3a3238,
    groundDark: 0x241e26,
    groundLight: 0x5a4a50,
  },
  duel_court: {
    sky: [0x6a9ad0, 0x7aa8d8, 0x8cb6de, 0x9ec4e4, 0xb2d2ea, 0xc8e0ee],
    cloud: 0xf4f6fa,
    cloudShade: 0xc8d4e6,
    mountainFar: 0x9a4a3a,
    mountainNear: 0x7a2a26,
    trees: 0x6a2a24,
    treesDark: 0x4a1a18,
    field: 0xb0603a,
    cane: 0xc8784a,
    caneDark: 0x8e4a2a,
    ground: 0xd8c08a,
    groundDark: 0xb8a070,
    groundLight: 0xe8d4a4,
  },
  lava_tube: {
    sky: [0x0c0a10, 0x141018, 0x1a1420, 0x241a24, 0x3a2224, 0x5a2a20],
    cloud: 0x3a3440,
    cloudShade: 0x2a2430,
    mountainFar: 0x1a1420,
    mountainNear: 0x14101a,
    trees: 0x2a2430,
    treesDark: 0x1a1420,
    field: 0x241e26,
    cane: 0xe0782a,
    caneDark: 0x7a2a26,
    ground: 0x2a2430,
    groundDark: 0x1a1420,
    groundLight: 0x4a4452,
  },
} as const;

// Al-Doria (Chapter 4): the Desert Edge's dunes under a white sky; the guild vault, lamplit stone and iron boxes.
const ALDORIA_BACKDROPS = {
  desert_edge: {
    sky: [0xc8d8e8, 0xd4e0ea, 0xe0e6e8, 0xeae8e0, 0xf2e8d4, 0xf6e4c4],
    cloud: 0xfaf6ee,
    cloudShade: 0xe0d8c8,
    mountainFar: 0xc8a070,
    mountainNear: 0xb08a58,
    trees: 0x6a7a40,
    treesDark: 0x4a5a2a,
    field: 0xe0b878,
    cane: 0xd8a868,
    caneDark: 0xb08850,
    ground: 0xe0c89a,
    groundDark: 0xc8ac78,
    groundLight: 0xf0dcb0,
  },
  guild_vault: {
    sky: [0x14101a, 0x1a1420, 0x241e26, 0x3a3238, 0x4a3a2a, 0x6a5a3a],
    cloud: 0x3a3440,
    cloudShade: 0x2a2430,
    mountainFar: 0x3a3238,
    mountainNear: 0x2a2430,
    trees: 0x4a4452,
    treesDark: 0x2a2632,
    field: 0x6e6152,
    cane: 0xb8902a,
    caneDark: 0x6b4426,
    ground: 0x6e6152,
    groundDark: 0x4a4038,
    groundLight: 0x8a7a68,
  },
} as const;

// Eightgate (Chapter 5): the Crossroads Fields, a grey-blue sky over flat grass and the Seat's walls far off.
const SEAT_BACKDROPS = {
  crossroads: {
    sky: [0x6a86a8, 0x7a94b2, 0x8aa2bc, 0x9cb0c6, 0xaebed0, 0xc2ccd8],
    cloud: 0xf0f2f4,
    cloudShade: 0xc8ccd4,
    mountainFar: 0x9a9082,
    mountainNear: 0x8f8578,
    trees: 0x3f6a3a,
    treesDark: 0x2e5030,
    field: 0x6a9a4a,
    cane: 0x8aaa5a,
    caneDark: 0x5a7a3a,
    ground: 0xc9a66b,
    groundDark: 0xa8885a,
    groundLight: 0xd8bc84,
  },
} as const;

// Ordvik (Chapter 6): the Winter Plateau under a grey sky with snow on the rises; the far shore of the fjord at dusk,
// ice-white beyond the meadow; the horse-fair by day.
// Kirinoura (Chapter 7): the Fog Marsh at night, reeds and black water under a grey-violet sky; the file house, lacquer
// and paper by lantern light.
const KUROSHI_BACKDROPS = {
  fog_marsh: {
    sky: [0x2a2a38, 0x3a3a4a, 0x4a4a5a, 0x5a5a6a, 0x6e6e7a, 0x8a8a94],
    cloud: 0xa8aab0,
    cloudShade: 0x8a8c94,
    mountainFar: 0x5a5468,
    mountainNear: 0x3a3644,
    trees: 0x4a5640,
    treesDark: 0x3a4430,
    field: 0x6e7a5a,
    cane: 0x7a8664,
    caneDark: 0x4a5640,
    ground: 0x7a7268,
    groundDark: 0x5a544c,
    groundLight: 0x8e867c,
  },
  file_house: {
    sky: [0x1a1218, 0x2a1a1e, 0x3a2422, 0x4a2e2a, 0x5a3a32, 0x6a4a3e],
    cloud: 0xece6d6,
    cloudShade: 0xb0aca0,
    mountainFar: 0xece6d6,
    mountainNear: 0x2a1a1e,
    trees: 0xd8d2c2,
    treesDark: 0x7d3c98,
    field: 0x5a3a32,
    cane: 0xb8b07a,
    caneDark: 0x8a8458,
    ground: 0x5a3a32,
    groundDark: 0x3a2422,
    groundLight: 0x7a5a4a,
  },
} as const;

// Agnipur (Chapter 8): the Salt Flats under an orange sky; the oil store, jars and lamplight; the duel yard's sand.
const JWALADESH_BACKDROPS = {
  salt_flats: {
    sky: [0xc8603a, 0xd8784a, 0xe8925a, 0xf0aa70, 0xf4c08a, 0xf8d8a8],
    cloud: 0xfaf0dc,
    cloudShade: 0xe8d0b0,
    mountainFar: 0xe0c8a8,
    mountainNear: 0xc8a888,
    trees: 0x9a9a6a,
    treesDark: 0x6a6a44,
    field: 0xf4ecd8,
    cane: 0xe8e0c8,
    caneDark: 0xc8c0aa,
    ground: 0xf4ecd8,
    groundDark: 0xd8d0c0,
    groundLight: 0xfaf6ec,
  },
  oil_store: {
    sky: [0x1a1410, 0x2a1e16, 0x3a2a1e, 0x4a3626, 0x5a422e, 0x6a5038],
    cloud: 0xd8b04a,
    cloudShade: 0xb87a3a,
    mountainFar: 0x6a5a4a,
    mountainNear: 0x4a3e34,
    trees: 0xb87a3a,
    treesDark: 0x5a3a1a,
    field: 0x8a7a62,
    cane: 0xb87a3a,
    caneDark: 0x5a3a1a,
    ground: 0x8a7a62,
    groundDark: 0x6a5a46,
    groundLight: 0xa89a82,
  },
} as const;

// Kingsmere (Chapter 9): the heath under rain, the wet square, the courtroom's dark wood and violet, the bog chapel.
const KINGSMERE_BACKDROPS = {
  moor_heath: {
    sky: [0x4a5260, 0x56606e, 0x626c7a, 0x6e7886, 0x7a8492, 0x86909e],
    cloud: 0x9aa2ae,
    cloudShade: 0x6e7684,
    mountainFar: 0x5a5a6a,
    mountainNear: 0x4a4458,
    trees: 0x6a5a7a,
    treesDark: 0x4a3e5a,
    field: 0x5a4e6a,
    cane: 0x6a5a7a,
    caneDark: 0x2a2a24,
    ground: 0x5a5a4a,
    groundDark: 0x3a3a30,
    groundLight: 0x7a7a68,
  },
  market_cross: {
    sky: [0x3a4250, 0x464e5c, 0x525a68, 0x5e6674, 0x6a7280, 0x767e8c],
    cloud: 0x9aa2ae,
    cloudShade: 0x6e7684,
    mountainFar: 0x5a6270,
    mountainNear: 0x3e4450,
    trees: 0x6a5a8a,
    treesDark: 0x3a3048,
    field: 0x6e7884,
    cane: 0x5a6270,
    caneDark: 0x3e4450,
    ground: 0x6e7884,
    groundDark: 0x5a6470,
    groundLight: 0x8a94a0,
  },
  assize_court: {
    sky: [0x1a1420, 0x24202c, 0x2e2a38, 0x383444, 0x423e50, 0x4c485c],
    cloud: 0x6a5a8a,
    cloudShade: 0x4a3e5a,
    mountainFar: 0x4e3a2a,
    mountainNear: 0x3a2a1e,
    trees: 0x6a5a8a,
    treesDark: 0x3a3048,
    field: 0x8a8c90,
    cane: 0x4e3a2a,
    caneDark: 0x2a2018,
    ground: 0x8a8c90,
    groundDark: 0x6e7074,
    groundLight: 0xa8aab0,
  },
  bog_chapel: {
    sky: [0x2a2a34, 0x34343e, 0x3e3e48, 0x484852, 0x52525c, 0x5c5c66],
    cloud: 0xf2d04b,
    cloudShade: 0x8a7a5a,
    mountainFar: 0x5a6270,
    mountainNear: 0x3e4450,
    trees: 0x3a4030,
    treesDark: 0x2a2a24,
    field: 0x5a6a4a,
    cane: 0x44543a,
    caneDark: 0x2a2a24,
    ground: 0x5a6a4a,
    groundDark: 0x44543a,
    groundLight: 0x6e7e5c,
  },
} as const;

const SKARRAGOL_BACKDROPS = {
  winter_plateau: {
    sky: [0x7a8a9a, 0x8a98a6, 0x9aa6b2, 0xaab4be, 0xbcc4cc, 0xccd2d8],
    cloud: 0xf0f2f4,
    cloudShade: 0xc8ccd4,
    mountainFar: 0xc8d4dc,
    mountainNear: 0x5d6d7e,
    trees: 0x5a6a4a,
    treesDark: 0x46523a,
    field: 0x8a9a70,
    cane: 0x9aaa7a,
    caneDark: 0x6e7e58,
    ground: 0xa8987a,
    groundDark: 0x8a7a5e,
    groundLight: 0xc0b090,
  },
  frozen_fjord: {
    sky: [0x2a3448, 0x3a4458, 0x4a5468, 0x5d6d7e, 0x7a8a9a, 0x9aa6b2],
    cloud: 0xc8d4dc,
    cloudShade: 0x8a98a6,
    mountainFar: 0xd8e4ec,
    mountainNear: 0x46525e,
    trees: 0x3a4a3a,
    treesDark: 0x2a362a,
    field: 0x6e7e58,
    cane: 0x8a9a70,
    caneDark: 0x5a6a4a,
    ground: 0x8e8e86,
    groundDark: 0x6e6e66,
    groundLight: 0xa8a8a0,
  },
  horse_fair: {
    sky: [0x6a86a8, 0x7a94b2, 0x8aa2bc, 0x9cb0c6, 0xaebed0, 0xc2ccd8],
    cloud: 0xf0f2f4,
    cloudShade: 0xc8ccd4,
    mountainFar: 0xc8d4dc,
    mountainNear: 0x5d6d7e,
    trees: 0xc8b89a,
    treesDark: 0xa89878,
    field: 0x8a9a70,
    cane: 0x9aaa7a,
    caneDark: 0x6e7e58,
    ground: 0xa8987a,
    groundDark: 0x8a7a5e,
    groundLight: 0xc0b090,
  },
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
  // The Mountain Path (Chapter 2): cloud forest, mist on the peaks, the red-earth trail.
  mountain_path: {
    sky: [0x7fa8b8, 0x8fb6c4, 0xa2c4ce, 0xb6d2d8, 0xcadede, 0xdce8e6],
    cloud: 0xf2f6f6,
    cloudShade: 0xc8d6d8,
    mountainFar: 0x5a8a78,
    mountainNear: 0x3f7a5a,
    trees: 0x2e8a4e,
    treesDark: 0x1f6a3a,
    field: 0x2e7a46,
    cane: 0x46a866,
    caneDark: 0x2e8a4e,
    ground: 0xb0603a,
    groundDark: 0x8e4a2a,
    groundLight: 0xc8784a,
  },
  // Yucayeque on the night of the attack (Chapter 2): a dark sky lit orange by fires, black hills, smoke.
  yucayeque_night: {
    sky: [0x0c1024, 0x141a34, 0x22203e, 0x3a2a44, 0x6a3a3a, 0xa8502e],
    cloud: 0x5a4a52,
    cloudShade: 0x3a3040,
    mountainFar: 0x1a2030,
    mountainNear: 0x121824,
    trees: 0x14281e,
    treesDark: 0x0c1a14,
    field: 0x1a2a34,
    cane: 0x2a4a44,
    caneDark: 0x1a3430,
    ground: 0x5a3a2a,
    groundDark: 0x3a2418,
    groundLight: 0x7a4a2e,
  },
  // Yucayeque's pier (Chapter 2): green mountains over a turquoise lagoon, the pier's planks underfoot.
  yucayeque_pier: {
    sky: [0x2f86c8, 0x3f98d4, 0x55a8dc, 0x6fbae2, 0x8ccce8, 0xb0deee],
    cloud: 0xf6f8fa,
    cloudShade: 0xcad8e6,
    mountainFar: 0x3f7a5a,
    mountainNear: 0x2e6a48,
    trees: 0x2e8a4e,
    treesDark: 0x1f6a3a,
    field: 0x1fa5a8,
    cane: 0x7fe0d6,
    caneDark: 0x2fb3b0,
    ground: 0x9c7446,
    groundDark: 0x6b4426,
    groundLight: 0xc8a46b,
  },
  ...ARDENCIA_BACKDROPS,
  ...ALDORIA_BACKDROPS,
  ...SEAT_BACKDROPS,
  ...SKARRAGOL_BACKDROPS,
  ...KUROSHI_BACKDROPS,
  ...JWALADESH_BACKDROPS,
  ...KINGSMERE_BACKDROPS,
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

