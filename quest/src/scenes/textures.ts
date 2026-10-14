// Draws every placeholder texture from assets.config.ts at boot, so the quest needs no image files,
// and lets real art files (artFiles.ts) replace them one by one. Everything is drawn on canvases at
// 1 px per pixel; Phaser scales the whole picture.

import Phaser from 'phaser';
import {
  ART_FILES,
  ECHO_DITHER_TEXTURE,
  ECHO_FILTER,
  MARKER_TEXTURES,
  NPC_SPRITES,
  OBJECT_ART,
  PORTRAITS,
  PORTRAIT_SIZE,
  TILESET,
  TILE_ART,
  UI,
  characterFrame,
  textureKeyForCharacter,
  textureKeyForObject,
  textureKeyForPortrait,
  type PlaceholderTile,
} from '../assets.config.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH, TILE_SIZE } from '../config.ts';
import { artFile } from './artFiles.ts';
import { Pix, artPix, characterPix, css } from './pixels.ts';

/** A canvas texture (replacing any texture with that key). */
function canvasTexture(scene: Phaser.Scene, key: string, w: number, h: number): { tex: Phaser.Textures.CanvasTexture; ctx: CanvasRenderingContext2D } {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, w, h)!;
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  return { tex, ctx };
}

/** An art file that the Boot scene loaded, as a drawable image. */
function fileImage(scene: Phaser.Scene, path: string): HTMLImageElement | HTMLCanvasElement | null {
  const key = fileKey(path);
  if (!scene.textures.exists(key)) return null;
  return scene.textures.get(key).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
}

export function fileKey(path: string): string {
  return `file:${path}`;
}

/** Queue every art file present for loading (call from the Boot scene's preload). */
export function preloadArtFiles(scene: Phaser.Scene): void {
  const paths = [
    ...Object.keys(NPC_SPRITES).map(ART_FILES.character),
    ...Object.keys(PORTRAITS).map(ART_FILES.portrait),
    ...TILESET.tiles.map((t) => ART_FILES.tile(t.name)),
    ...Object.keys(OBJECT_ART).map(ART_FILES.object),
  ];
  for (const path of paths) {
    const url = artFile(path);
    if (url) scene.load.image(fileKey(path), url);
  }
}

// ---- Tiles -----------------------------------------------------------------------------------------

function drawPattern(ctx: CanvasRenderingContext2D, ox: number, oy: number, tile: PlaceholderTile): void {
  const s = TILE_SIZE;
  const px = (x: number, y: number, w = 1, h = 1) => ctx.fillRect(ox + x, oy + y, w, h);
  ctx.fillStyle = css(tile.base);
  px(0, 0, s, s);
  ctx.fillStyle = css(tile.accent);
  switch (tile.pattern) {
    case 'flat':
      break;
    case 'dots':
      for (const [x, y] of [[2, 3], [9, 1], [13, 7], [5, 10], [11, 13], [1, 14], [7, 6]] as const) px(x, y);
      if (tile.name === 'flowers') for (const [x, y] of [[4, 4], [10, 9], [6, 12]] as const) px(x, y, 2, 2);
      break;
    case 'grid':
      px(0, 7, s, 1);
      px(0, 15, s, 1);
      px(4, 0, 1, 7);
      px(12, 8, 1, 7);
      break;
    case 'stripes':
      for (let y = 3; y < s; y += 4) px(0, y, s, 1);
      break;
    case 'cross':
      for (let i = 0; i < s; i++) {
        px(i, i);
        px(s - 1 - i, i);
      }
      break;
    case 'border':
      px(0, 0, s, 1);
      px(0, s - 1, s, 1);
      px(0, 0, 1, s);
      px(s - 1, 0, 1, s);
      px(6, 6, 4, 4);
      break;
    case 'blob':
      ctx.beginPath();
      ctx.arc(ox + 8, oy + 7, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = css(tile.base);
      px(7, 12, 2, 4);
      break;
    case 'wave':
      for (const [x, y] of [[2, 4], [9, 8], [4, 12], [11, 2]] as const) px(x, y, 3, 1);
      break;
  }
}

function drawTile(scene: Phaser.Scene, ctx: CanvasRenderingContext2D, ox: number, oy: number, tile: PlaceholderTile): void {
  const file = fileImage(scene, ART_FILES.tile(tile.name));
  if (file) {
    ctx.drawImage(file, 0, 0, TILE_SIZE, TILE_SIZE, ox, oy, TILE_SIZE, TILE_SIZE);
    return;
  }
  const art = TILE_ART[tile.name];
  if (!art) {
    drawPattern(ctx, ox, oy, tile);
    return;
  }
  const under = art.under ? TILESET.tiles.find((t) => t.name === art.under) : undefined;
  if (under) drawTile(scene, ctx, ox, oy, under);
  artPix(art).draw(ctx, ox, oy);
}

function makeTileset(scene: Phaser.Scene): void {
  const cols = TILESET.columns;
  const rows = Math.ceil(TILESET.tiles.length / cols);
  const { tex, ctx } = canvasTexture(scene, TILESET.textureKey, cols * TILE_SIZE, rows * TILE_SIZE);
  for (const tile of TILESET.tiles) {
    const i = tile.gid - 1;
    drawTile(scene, ctx, (i % cols) * TILE_SIZE, Math.floor(i / cols) * TILE_SIZE, tile);
  }
  // One named frame per tile, so puzzle objects can draw a tile by name.
  for (const tile of TILESET.tiles) {
    const i = tile.gid - 1;
    tex.add(tile.name, 0, (i % cols) * TILE_SIZE, Math.floor(i / cols) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  tex.refresh();
}

function makeObjectArt(scene: Phaser.Scene): void {
  for (const [kind, art] of Object.entries(OBJECT_ART)) {
    const file = fileImage(scene, ART_FILES.object(kind));
    const w = file ? file.width : art.rows[0]!.length;
    const h = file ? file.height : art.rows.length;
    const { tex, ctx } = canvasTexture(scene, textureKeyForObject(kind), w, h);
    if (file) ctx.drawImage(file, 0, 0);
    else artPix(art).draw(ctx, 0, 0);
    tex.refresh();
  }
}

/** A 4 x 4 ordered-dither dot pattern for the Echo filter. */
function makeDither(scene: Phaser.Scene): void {
  const { tex, ctx } = canvasTexture(scene, ECHO_DITHER_TEXTURE, 4, 4);
  ctx.fillStyle = css(ECHO_FILTER.ditherColor);
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillRect(2, 2, 1, 1);
  tex.refresh();
}

/** "!" (something new to say) and a four-point sparkle (something to use), 7 x 9 with an outline. */
function makeMarkers(scene: Phaser.Scene): void {
  const talk = new Pix(7, 9).rect(2, 0, 3, 5, UI.markerTalk).rect(2, 6, 3, 2, UI.markerTalk).outline(UI.markerOutline);
  const use = new Pix(7, 9)
    .rect(3, 0, 1, 9, UI.markerUse)
    .rect(0, 4, 7, 1, UI.markerUse)
    .rect(2, 3, 3, 3, UI.markerUse)
    .set(3, 4, 0xffffff)
    .outline(UI.markerOutline);
  for (const [key, pix] of [[MARKER_TEXTURES.talk, talk], [MARKER_TEXTURES.use, use]] as const) {
    const { tex, ctx } = canvasTexture(scene, key, pix.w, pix.h);
    pix.draw(ctx, 0, 0);
    tex.refresh();
  }
}

// ---- Characters ------------------------------------------------------------------------------------

/** The shadow under a character: rows (from 3 above the cell's bottom) and their half widths. */
const SHADOW_ROWS: readonly [number, number][] = [[0, 5], [1, 7], [2, 6]];

/** Every look's walk sheet: 3 columns (standing, step A, step B) x 4 rows (down, left, right, up). */
function makeCharacters(scene: Phaser.Scene): void {
  const rows = ART_FILES.sheetRows;
  for (const [look, def] of Object.entries(NPC_SPRITES)) {
    const key = textureKeyForCharacter(look);
    const file = fileImage(scene, ART_FILES.character(look));
    const cw = file ? Math.floor(file.width / ART_FILES.sheetColumns) : CHARACTER_WIDTH;
    const ch = file ? Math.floor(file.height / rows.length) : CHARACTER_HEIGHT;
    const { tex, ctx } = canvasTexture(scene, key, cw * ART_FILES.sheetColumns, ch * rows.length);
    rows.forEach((facing, r) => {
      for (const step of [0, 1, 2] as const) {
        const ox = step * cw;
        const oy = r * ch;
        // The soft shadow under the feet (the same for real art and placeholders), pixel by pixel.
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        for (const [dy, half] of SHADOW_ROWS) ctx.fillRect(ox + cw / 2 - half, oy + ch - 3 + dy, half * 2, 1);
        if (file) ctx.drawImage(file, ox, oy, cw, ch, ox, oy, cw, ch);
        else characterPix(def, facing, step).draw(ctx, ox, oy);
        tex.add(characterFrame(facing, step), 0, ox, oy, cw, ch);
      }
    });
    tex.refresh();
  }
}

function makePortraits(scene: Phaser.Scene): void {
  const s = PORTRAIT_SIZE;
  for (const [key, def] of Object.entries(PORTRAITS)) {
    const { tex, ctx } = canvasTexture(scene, textureKeyForPortrait(key), s, s);
    const file = fileImage(scene, ART_FILES.portrait(key));
    if (file) {
      ctx.drawImage(file, 0, 0, file.width, file.height, 0, 0, s, s);
    } else {
      ctx.fillStyle = css(def.background);
      ctx.fillRect(0, 0, s, s);
      const scale = Math.floor(s / 16);
      const look = def.look ? NPC_SPRITES[def.look] : undefined;
      if (look) {
        // Head and shoulders of the standing sprite (a 24 x 24 crop from just above the head), enlarged.
        const pix = characterPix(look, 'down');
        const top = (look.build === 'small' ? 8 : look.build === 'tall' ? 3 : 4) - 4;
        const zoom = s / CHARACTER_WIDTH;
        const crop = new Pix(CHARACTER_WIDTH, CHARACTER_WIDTH);
        for (let y = 0; y < CHARACTER_WIDTH; y++) for (let x = 0; x < CHARACTER_WIDTH; x++) {
          const c = pix.get(x, y + top);
          if (c !== undefined) crop.set(x, y, c);
        }
        crop.draw(ctx, 0, 0, zoom);
      } else if (def.art && TILE_ART[def.art]) {
        artPix(TILE_ART[def.art]!).draw(ctx, (s - 16 * scale) / 2, (s - 16 * scale) / 2, scale);
      }
    }
    ctx.strokeStyle = css(0xe8d8b0);
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, s - 1, s - 1);
    tex.refresh();
  }
}

export function makeAllTextures(scene: Phaser.Scene): void {
  makeTileset(scene);
  makeObjectArt(scene);
  makeDither(scene);
  makeMarkers(scene);
  makeCharacters(scene);
  makePortraits(scene);
}
