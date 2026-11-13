// Draws every placeholder texture from assets.config.ts at boot, so the quest needs no image files,
// and lets real art files (artFiles.ts) replace them one by one. Everything is drawn on canvases at
// 1 px per pixel; Phaser scales the whole picture.

import Phaser from 'phaser';
import {
  ART_FILES,
  ECHO_DITHER_TEXTURE,
  ECHO_SHIMMER,
  ECHO_FILTER,
  ENEMY_ART,
  WEAPON_ART,
  ITEM_ART,
  MARKER_TEXTURES,
  NPC_SPRITES,
  OBJECT_ART,
  PORTRAITS,
  PORTRAIT_SIZE,
  SKIN_TONES,
  TILESET,
  TILE_ART,
  UI,
  characterFrame,
  textureKeyForCharacter,
  textureKeyForEnemy,
  textureKeyForWeapon,
  textureKeyForBattle,
  textureKeyForItem,
  textureKeyForObject,
  textureKeyForPortrait,
  textureKeyForPortraitMood,
  PORTRAIT_MOODS,
  textureKeyForShimmer,
  type PlaceholderPortrait,
  type PlaceholderTile,
  type SkinTone,
} from '../assets.config.ts';
import { recolorSkin } from '../engine/skin.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH, TILE_SIZE } from '../config.ts';
import { artFile, artFiles } from './artFiles.ts';
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
/** A shared sheet recoloured to one skin tone (engine/skin.ts), cached per file and tone. */
function recolored(scene: Phaser.Scene, path: string, tone: SkinTone | undefined): HTMLImageElement | HTMLCanvasElement | null {
  const file = fileImage(scene, path);
  if (!file || !tone) return file;
  const key = `${fileKey(path)}@${tone}`;
  const cached = RECOLORED.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = file.width;
  canvas.height = file.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(file, 0, 0);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  recolorSkin(img.data, SKIN_TONES[tone]);
  ctx.putImageData(img, 0, 0);
  RECOLORED.set(key, canvas);
  return canvas;
}
const RECOLORED = new Map<string, HTMLCanvasElement>();

/** The portrait file a portrait uses: a shared look's own art name (the Quiet Crown), else its key. */
function portraitArt(key: string, def: PlaceholderPortrait): string {
  return (def.look && NPC_SPRITES[def.look]?.art) ?? key;
}

/** Every expression a portrait may show (PORTRAIT_MOODS): its file and texture. */
function moodFiles(): { path: string; key: string; portrait: string }[] {
  return Object.entries(PORTRAIT_MOODS).flatMap(([portrait, moods]) => {
    const def = PORTRAITS[portrait];
    if (!def) return [];
    return moods.map((mood) => ({ path: ART_FILES.portrait(`${portraitArt(portrait, def)}_${mood}`), key: textureKeyForPortraitMood(portrait, mood), portrait }));
  });
}

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
    ...Object.entries(NPC_SPRITES).map(([look, def]) => ART_FILES.character(def.art ?? look)),
    ...Object.entries(PORTRAITS).map(([key, def]) => ART_FILES.portrait(portraitArt(key, def))),
    ...moodFiles().map((m) => m.path),
    ...TILESET.tiles.map((t) => ART_FILES.tile(t.name)),
    ...Object.keys(OBJECT_ART).map(ART_FILES.object),
    ...Object.keys(ITEM_ART).map(ART_FILES.item),
    ...Object.keys(ENEMY_ART).map(ART_FILES.enemy),
    // Any foe's painted art, drawn in code or not (art drop 2: the Crown's soldiers fight as their walking look until
    // their file arrives).
    ...artFiles().filter((path) => path.startsWith('enemies/')),
    ...Object.keys(WEAPON_ART).map(ART_FILES.weapon),
  ];
  for (const path of paths) {
    const url = artFile(path);
    if (url) scene.load.image(fileKey(path), url);
  }
}

/**
 * The battle stances (art/battle/, more than half of the art's bytes) are not waited for at boot: they load behind
 * the field once it is up (loadBattleArtBehind), and a battle that opens before they are all in waits for the rest
 * in its preload (preloadBattleArt). The performance review (docs/quest/reviews/2026-11-13-performance.md): on a slow
 * phone connection the title and the first map come sooner. Every fight shows the same stances as before.
 */
const BATTLE_ART_BEHIND = new Map<string, HTMLImageElement>();

/** Start loading every battle stance file in the background (the Field scene, each time it opens: once is enough). */
export function loadBattleArtBehind(manager: Phaser.Textures.TextureManager): void {
  for (const path of battleFiles()) {
    const url = artFile(path);
    const key = fileKey(path);
    if (!url || BATTLE_ART_BEHIND.has(path) || manager.exists(key)) continue;
    const img = new Image();
    BATTLE_ART_BEHIND.set(path, img);
    img.onload = () => {
      // Taken over by a battle's preload (preloadBattleArt), or loaded there already: nothing to add.
      if (BATTLE_ART_BEHIND.get(path) !== img || manager.exists(key)) return;
      BATTLE_ART_BEHIND.delete(path);
      manager.addImage(key, img);
    };
    img.onerror = () => {
      if (BATTLE_ART_BEHIND.get(path) === img) BATTLE_ART_BEHIND.delete(path);
    };
    img.src = url;
  }
}

/** Queue the battle stance files not loaded yet (call from the Battle scene's preload; usually there are none). */
export function preloadBattleArt(scene: Phaser.Scene): void {
  for (const path of battleFiles()) {
    const url = artFile(path);
    const key = fileKey(path);
    if (!url || scene.textures.exists(key)) continue;
    // The scene's loader takes over a file still loading behind (so it is added once).
    const behind = BATTLE_ART_BEHIND.get(path);
    if (behind) {
      BATTLE_ART_BEHIND.delete(path);
      behind.onload = null;
      behind.onerror = null;
    }
    scene.load.image(key, url);
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

/** Item drawings for the showcase: an art file when there is one, else the placeholder. */
function makeItemArt(scene: Phaser.Scene): void {
  for (const [id, art] of Object.entries(ITEM_ART)) {
    const file = fileImage(scene, ART_FILES.item(id));
    const w = file ? file.width : art.rows[0]!.length;
    const h = file ? file.height : art.rows.length;
    const { tex, ctx } = canvasTexture(scene, textureKeyForItem(id), w, h);
    if (file) ctx.drawImage(file, 0, 0);
    else artPix(art).draw(ctx, 0, 0);
    tex.refresh();
  }
}

/** Enemy drawings for battles: an art file when there is one, else the placeholder. */
function makeEnemyArt(scene: Phaser.Scene): void {
  // A painted foe with no drawing in code (a Crown marine, Thorne): its file alone.
  for (const path of artFiles()) {
    const look = /^enemies\/(.+)\.png$/.exec(path)?.[1];
    if (!look || ENEMY_ART[look]) continue;
    const file = fileImage(scene, path);
    if (!file) continue;
    const { tex, ctx } = canvasTexture(scene, textureKeyForEnemy(look), file.width, file.height);
    ctx.drawImage(file, 0, 0);
    tex.refresh();
  }
  for (const [look, art] of Object.entries(ENEMY_ART)) {
    const file = fileImage(scene, ART_FILES.enemy(look));
    const w = file ? file.width : art.rows[0]!.length;
    const h = file ? file.height : art.rows.length;
    const { tex, ctx } = canvasTexture(scene, textureKeyForEnemy(look), w, h);
    if (file) ctx.drawImage(file, 0, 0);
    else artPix(art).draw(ctx, 0, 0);
    tex.refresh();
  }
}

/** Battle weapons: an art file when there is one, else the drawing. */
function makeWeaponArt(scene: Phaser.Scene): void {
  for (const [id, art] of Object.entries(WEAPON_ART)) {
    const file = fileImage(scene, ART_FILES.weapon(id));
    const w = file ? file.width : art.rows[0]!.length;
    const h = file ? file.height : art.rows.length;
    const { tex, ctx } = canvasTexture(scene, textureKeyForWeapon(id), w, h);
    if (file) ctx.drawImage(file, 0, 0);
    else artPix(art).draw(ctx, 0, 0);
    tex.refresh();
  }
}

/** Every battle stance file present (battle/<look>.png, battle/<look>-<weapon design>.png). */
function battleFiles(): string[] {
  return artFiles().filter((p) => p.startsWith('battle/') && p.endsWith('.png'));
}

/**
 * Battle stances from art files only (no placeholder: without one, the walking sprite stands in). Frames 0 and 1.
 * Each is drawn when a battle first asks for it, once its file is in (the Battle scene's preload sees to that).
 */
function makeBattleStances(scene: Phaser.Scene): void {
  for (const look of battleFiles().map((p) => p.slice('battle/'.length, -'.png'.length))) {
    const key = textureKeyForBattle(look);
    const make = (): void => {
      const file = fileImage(scene, ART_FILES.battle(look));
      // Asked for before its file is in: it waits to be asked again.
      if (!file) {
        LAZY.set(key, make);
        return;
      }
      const w = Math.floor(file.width / 2);
      const { tex, ctx } = canvasTexture(scene, key, w * 2, file.height);
      ctx.drawImage(file, 0, 0);
      tex.add('0', 0, 0, 0, w, file.height);
      tex.add('1', 0, w, 0, w, file.height);
      tex.refresh();
    };
    LAZY.set(key, make);
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

/** The Echo spots' sparkle frames. */
function makeShimmer(scene: Phaser.Scene): void {
  ECHO_SHIMMER.forEach((art, i) => {
    const { tex, ctx } = canvasTexture(scene, textureKeyForShimmer(i), 16, 16);
    artPix(art).draw(ctx, 0, 0);
    tex.refresh();
  });
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

/** A look's walk sheet: 3 columns (standing, step A, step B) x 4 rows (down, left, right, up). */
function makeCharacter(scene: Phaser.Scene, look: string, def: (typeof NPC_SPRITES)[string]): void {
  const rows = ART_FILES.sheetRows;
  const key = textureKeyForCharacter(look);
  const file = recolored(scene, ART_FILES.character(def.art ?? look), def.skinTone);
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

/** An expression, from its art file only: without the file there is no texture and the plain portrait stands in (DialogueBox). */
function makePortraitMood(scene: Phaser.Scene, key: string, path: string, portrait: string): void {
  const s = PORTRAIT_SIZE;
  const look = PORTRAITS[portrait]!.look;
  const file = recolored(scene, path, look ? NPC_SPRITES[look]?.skinTone : undefined);
  if (!file) return;
  const { tex, ctx } = canvasTexture(scene, key, s, s);
  ctx.drawImage(file, 0, 0, file.width, file.height, 0, 0, s, s);
  tex.refresh();
}

function makePortrait(scene: Phaser.Scene, key: string, def: PlaceholderPortrait): void {
  const s = PORTRAIT_SIZE;
  const { tex, ctx } = canvasTexture(scene, textureKeyForPortrait(key), s, s);
  const file = recolored(scene, ART_FILES.portrait(portraitArt(key, def)), def.look ? NPC_SPRITES[def.look]?.skinTone : undefined);
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

// ---- Drawn when first used -------------------------------------------------------------------------

/**
 * The walk sheets and portraits (about 440 looks and 450 portraits) are drawn the first time something asks for
 * them, not all at boot: on a phone with a 4x slower processor, drawing them all held the boot for about 10 s, and
 * the ones a map never shows took about 25 MB of graphics memory (docs/quest/reviews/2026-11-13-performance.md).
 * Each is drawn exactly as before, from the same art.
 */
const LAZY = new Map<string, () => void>();

/** Draw a waiting texture now (any other key: nothing to do). */
function realize(key: unknown): void {
  if (typeof key !== 'string') return;
  const make = LAZY.get(key);
  if (!make) return;
  LAZY.delete(key);
  make();
}

/**
 * Every way into the texture manager by key (exists, get, getFrame) draws a waiting texture first, so every caller
 * (sprites, setTexture, the dialogue box's and the menu's `exists` checks) finds it as if it had been made at boot.
 */
function drawOnFirstUse(manager: Phaser.Textures.TextureManager): void {
  const marked = manager as Phaser.Textures.TextureManager & { drawsOnFirstUse?: boolean };
  if (marked.drawsOnFirstUse) return;
  marked.drawsOnFirstUse = true;
  const exists = manager.exists.bind(manager);
  const get = manager.get.bind(manager);
  const getFrame = manager.getFrame.bind(manager);
  manager.exists = (key: string) => {
    realize(key);
    return exists(key);
  };
  manager.get = ((key?: string | Phaser.Textures.Texture | Phaser.Textures.Frame) => {
    realize(key);
    return get(key as string);
  }) as typeof manager.get;
  manager.getFrame = (key: string, frame?: string | number) => {
    realize(key);
    return getFrame(key, frame);
  };
}

/** The walk sheets, portraits and expressions, each drawn when first asked for. */
function waitToDraw(scene: Phaser.Scene): void {
  for (const [look, def] of Object.entries(NPC_SPRITES)) LAZY.set(textureKeyForCharacter(look), () => makeCharacter(scene, look, def));
  for (const [key, def] of Object.entries(PORTRAITS)) LAZY.set(textureKeyForPortrait(key), () => makePortrait(scene, key, def));
  // An expression has a texture only when its file is there (the files are loaded at boot: preloadArtFiles).
  for (const { path, key, portrait } of moodFiles()) if (fileImage(scene, path)) LAZY.set(key, () => makePortraitMood(scene, key, path, portrait));
  drawOnFirstUse(scene.textures);
}

export function makeAllTextures(scene: Phaser.Scene): void {
  makeTileset(scene);
  makeObjectArt(scene);
  makeItemArt(scene);
  makeEnemyArt(scene);
  makeWeaponArt(scene);
  makeBattleStances(scene);
  makeDither(scene);
  makeShimmer(scene);
  makeMarkers(scene);
  waitToDraw(scene);
}
