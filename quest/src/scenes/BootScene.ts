// Boot: load any real art files (quest/art/), draw the textures (placeholders where a file is
// missing), hand the Tiled maps to Phaser's cache, then start the intro (or the field, `?intro=0`).

import Phaser from 'phaser';
import { getRuntime } from '../runtime.ts';
import { makeAllTextures, preloadArtFiles } from './textures.ts';

export function tilemapKey(mapId: string): string {
  return `map-${mapId}`;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload(): void {
    preloadArtFiles(this);
  }

  create(): void {
    makeAllTextures(this);
    for (const [id, raw] of Object.entries(getRuntime().rawMaps)) {
      this.cache.tilemap.add(tilemapKey(id), { format: Phaser.Tilemaps.Formats.TILED_JSON, data: raw });
    }
    const intro = getRuntime().intro;
    if (intro) this.scene.start('intro', { opening: intro });
    else this.scene.start('field');
  }
}
