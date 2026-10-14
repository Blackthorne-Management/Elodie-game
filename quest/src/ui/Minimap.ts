// The minimap: a small window in the top-left corner showing the tiles around Gianna (one colour per
// tile, from the tileset), doors as gold dots and Gianna as a blinking dot, with the city and section
// name under it. It is drawn once per map and era, then only scrolled.

import Phaser from 'phaser';
import { TILESET, UI } from '../assets.config.ts';
import { MINIMAP } from '../config.ts';
import type { GameMap, TiledMap } from '../engine/tiledMap.ts';
import { TILE_LAYERS, findTileLayer } from '../engine/tiledMap.ts';
import type { Era, Pos } from '../engine/types.ts';

const DEPTH = 4500; // over the world and the Echo filter, under dialogue and menus

/** The colour a tile shows on the minimap: its decoration's (a tree, a wall) or else its ground's. */
function tileColour(ground: number, deco: number): number {
  const byGid = (gid: number) => TILESET.tiles.find((t) => t.gid === gid);
  const d = deco ? byGid(deco) : undefined;
  const g = byGid(ground);
  return (d ?? g)?.base ?? 0x000000;
}

export class Minimap {
  private readonly root: Phaser.GameObjects.Container;
  private readonly image: Phaser.GameObjects.Image;
  private readonly dot: Phaser.GameObjects.Rectangle;
  private readonly frame: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly mapW: number;
  private readonly mapH: number;
  private readonly key: string;

  constructor(scene: Phaser.Scene, map: GameMap, raw: TiledMap, era: Era, place: string) {
    this.mapW = map.width;
    this.mapH = map.height;
    // One pixel per tile, drawn once.
    this.key = `minimap:${map.id}:${era}`;
    if (!scene.textures.exists(this.key)) {
      const tex = scene.textures.createCanvas(this.key, map.width, map.height)!;
      const ctx = tex.getContext();
      const ground = findTileLayer(raw, era === 'present' ? TILE_LAYERS.groundPresent : TILE_LAYERS.groundEcho)?.data ?? [];
      const deco = findTileLayer(raw, era === 'present' ? TILE_LAYERS.decoPresent : TILE_LAYERS.decoEcho)?.data ?? [];
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const i = y * map.width + x;
          ctx.fillStyle = `#${tileColour(ground[i] ?? 0, deco[i] ?? 0).toString(16).padStart(6, '0')}`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.fillStyle = '#f2d04b';
      for (const d of map.doors) ctx.fillRect(d.pos.x, d.pos.y, 1, 1);
      tex.refresh();
    }
    const { x, y, w, h, scale } = MINIMAP;
    this.frame = scene.add.graphics();
    this.frame.fillStyle(UI.boxFill, 0.85).fillRect(x - 2, y - 2, w + 4, h + 4);
    this.frame.lineStyle(1, UI.boxBorder, 0.9).strokeRect(x - 1.5, y - 1.5, w + 3, h + 3);
    this.image = scene.add.image(0, 0, this.key).setOrigin(0, 0).setScale(scale);
    this.dot = scene.add.rectangle(0, 0, scale, scale, 0xffffff).setOrigin(0, 0);
    scene.tweens.add({ targets: this.dot, alpha: 0.2, duration: 450, yoyo: true, repeat: -1 });
    this.label = scene.add
      .text(x - 1, y + h + 3, place, { fontFamily: UI.font, fontSize: `${UI.fontSizePx}px`, color: UI.text })
      .setShadow(1, 1, '#000000', 0, false, true);
    this.root = scene.add.container(0, 0, [this.frame, this.image, this.dot, this.label]).setScrollFactor(0).setDepth(DEPTH);
  }

  /** Centre the window on the player (clamped to the map; a small map sits in the middle). */
  follow(pos: Pos): void {
    const { x, y, w, h, scale } = MINIMAP;
    const tw = w / scale;
    const th = h / scale;
    const cx = this.mapW <= tw ? (this.mapW - tw) / 2 : Math.max(0, Math.min(this.mapW - tw, pos.x - tw / 2 + 0.5));
    const cy = this.mapH <= th ? (this.mapH - th) / 2 : Math.max(0, Math.min(this.mapH - th, pos.y - th / 2 + 0.5));
    const sx = Math.round(cx);
    const sy = Math.round(cy);
    // Show only the window: crop the texture to it (in texture pixels) and place it so the crop lands in the frame.
    const cropX = Math.max(0, sx);
    const cropY = Math.max(0, sy);
    this.image.setCrop(cropX, cropY, Math.min(tw, this.mapW - cropX), Math.min(th, this.mapH - cropY));
    this.image.setPosition(x - sx * scale, y - sy * scale);
    this.dot.setPosition(x + (pos.x - sx) * scale, y + (pos.y - sy) * scale);
  }

  destroy(): void {
    this.root.destroy(true);
  }

  setVisible(on: boolean): void {
    this.root.setVisible(on);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  get place(): string {
    return this.label.text;
  }
}
