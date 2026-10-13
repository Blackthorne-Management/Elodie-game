// Draws every placeholder texture from assets.config.ts at boot, so the quest needs no image files yet.

import Phaser from 'phaser';
import {
  ECHO_DITHER_TEXTURE,
  ECHO_FILTER,
  ECHO_PLAYER_SPRITE,
  NPC_SPRITES,
  PLAYER_SPRITE,
  PORTRAITS,
  PORTRAIT_SIZE,
  TILESET,
  textureKeyForNpc,
  textureKeyForPlayer,
  textureKeyForPortrait,
  type PlaceholderCharacter,
  type PlaceholderTile,
} from '../assets.config.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH, TILE_SIZE } from '../config.ts';
import { DIRS, type Dir } from '../engine/types.ts';

function drawTile(g: Phaser.GameObjects.Graphics, ox: number, oy: number, tile: PlaceholderTile): void {
  const s = TILE_SIZE;
  g.fillStyle(tile.base, 1).fillRect(ox, oy, s, s);
  g.fillStyle(tile.accent, 1);
  switch (tile.pattern) {
    case 'flat':
      break;
    case 'dots':
      for (const [x, y] of [[2, 3], [9, 1], [13, 7], [5, 10], [11, 13], [1, 14], [7, 6]] as const) g.fillRect(ox + x, oy + y, 1, 1);
      if (tile.name === 'flowers') for (const [x, y] of [[4, 4], [10, 9], [6, 12]] as const) g.fillRect(ox + x, oy + y, 2, 2);
      break;
    case 'grid':
      g.fillRect(ox, oy + 7, s, 1).fillRect(ox, oy + 15, s, 1);
      g.fillRect(ox + 4, oy, 1, 7).fillRect(ox + 12, oy + 8, 1, 7);
      break;
    case 'stripes':
      for (let y = 3; y < s; y += 4) g.fillRect(ox, oy + y, s, 1);
      break;
    case 'cross':
      for (let i = 0; i < s; i++) {
        g.fillRect(ox + i, oy + i, 1, 1);
        g.fillRect(ox + s - 1 - i, oy + i, 1, 1);
      }
      break;
    case 'border':
      g.fillRect(ox, oy, s, 1).fillRect(ox, oy + s - 1, s, 1).fillRect(ox, oy, 1, s).fillRect(ox + s - 1, oy, 1, s);
      g.fillRect(ox + 6, oy + 6, 4, 4);
      break;
    case 'blob':
      g.fillCircle(ox + 8, oy + 7, 6);
      g.fillStyle(tile.base, 1).fillRect(ox + 7, oy + 12, 2, 4);
      break;
    case 'wave':
      for (const [x, y] of [[2, 4], [9, 8], [4, 12], [11, 2]] as const) g.fillRect(ox + x, oy + y, 3, 1);
      break;
  }
}

function makeTileset(scene: Phaser.Scene): void {
  const cols = TILESET.columns;
  const rows = Math.ceil(TILESET.tiles.length / cols);
  const g = scene.make.graphics({}, false);
  for (const tile of TILESET.tiles) {
    const i = tile.gid - 1;
    drawTile(g, (i % cols) * TILE_SIZE, Math.floor(i / cols) * TILE_SIZE, tile);
  }
  g.generateTexture(TILESET.textureKey, cols * TILE_SIZE, rows * TILE_SIZE);
  g.destroy();
  // One named frame per tile, so puzzle objects can draw a tile by name.
  const texture = scene.textures.get(TILESET.textureKey);
  for (const tile of TILESET.tiles) {
    const i = tile.gid - 1;
    texture.add(tile.name, 0, (i % cols) * TILE_SIZE, Math.floor(i / cols) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

/** A 4 x 4 ordered-dither dot pattern for the Echo filter. */
function makeDither(scene: Phaser.Scene): void {
  const g = scene.make.graphics({}, false);
  g.fillStyle(ECHO_FILTER.ditherColor, 1);
  for (const [x, y] of [[0, 0], [2, 2]] as const) g.fillRect(x, y, 1, 1);
  g.generateTexture(ECHO_DITHER_TEXTURE, 4, 4);
  g.destroy();
}

function makeCharacter(scene: Phaser.Scene, key: string, look: PlaceholderCharacter, facing: Dir): void {
  const g = scene.make.graphics({}, false);
  const w = CHARACTER_WIDTH;
  const h = CHARACTER_HEIGHT;
  // Shadow, body, belt, head.
  g.fillStyle(0x000000, 0.3).fillEllipse(w / 2, h - 2, 12, 4);
  g.fillStyle(look.body, 1).fillRect(3, 10, 10, 12);
  g.fillStyle(look.trim, 1).fillRect(3, 16, 10, 2);
  g.fillStyle(look.head, 1).fillRect(4, 2, 8, 8);
  // Hair or headgear on top, or a hood over the whole head with only the face showing.
  if (look.hat !== undefined) g.fillStyle(look.hat, 1).fillRect(4, 1, 8, 3);
  if (look.hood) {
    g.fillStyle(look.body, 1).fillRect(3, 1, 10, 9);
    if (facing !== 'up') g.fillStyle(0x0c0c10, 1).fillRect(facing === 'left' ? 4 : facing === 'right' ? 8 : 5, 4, 4, 5);
  }
  // Facing marker: eyes (down), hair (up), one eye on the side (left/right).
  g.fillStyle(0x101010, 1);
  if (facing === 'down') g.fillRect(5, 6, 2, 2).fillRect(9, 6, 2, 2);
  if (facing === 'up') g.fillStyle(look.hat ?? look.trim, 1).fillRect(4, 2, 8, 5);
  if (facing === 'left') g.fillRect(4, 6, 2, 2);
  if (facing === 'right') g.fillRect(10, 6, 2, 2);
  g.lineStyle(1, 0x000000, 0.6).strokeRect(3.5, 10.5, 9, 11);
  g.generateTexture(key, w, h);
  g.destroy();
}

function makePortrait(scene: Phaser.Scene, key: string, bg: number, figure: number): void {
  const s = PORTRAIT_SIZE;
  const g = scene.make.graphics({}, false);
  g.fillStyle(bg, 1).fillRect(0, 0, s, s);
  g.fillStyle(figure, 1).fillCircle(s / 2, 12, 7).fillRect(6, 21, s - 12, s - 21);
  g.lineStyle(1, 0xe8d8b0, 1).strokeRect(0.5, 0.5, s - 1, s - 1);
  g.generateTexture(key, s, s);
  g.destroy();
}

export function makeAllTextures(scene: Phaser.Scene): void {
  makeTileset(scene);
  makeDither(scene);
  for (const facing of DIRS) {
    makeCharacter(scene, textureKeyForPlayer(facing), PLAYER_SPRITE, facing);
    makeCharacter(scene, textureKeyForPlayer(facing, 'echo'), ECHO_PLAYER_SPRITE, facing);
    for (const [look, def] of Object.entries(NPC_SPRITES)) makeCharacter(scene, textureKeyForNpc(look, facing), def, facing);
  }
  for (const [key, p] of Object.entries(PORTRAITS)) makePortrait(scene, textureKeyForPortrait(key), p.background, p.figure);
}
