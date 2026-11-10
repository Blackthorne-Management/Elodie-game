// Keeping what must be read out from under the touch controls on a sideways phone (review Nov 7, finding 5; Nov 10).
// The controls are page elements in the bars beside the picture; where a bar is narrower than a control, the control
// reaches over the picture's edge. The dialogue box, the full pages (the menu, a shop, the Journal) and the battle's
// strip ask here how far they reach and keep clear of it. Without touch controls nothing reaches, and nothing moves.

import type Phaser from 'phaser';
import { PAGE_MIN_SCALE, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { controlReach, pageFit, type Rect } from '../engine/scaling.ts';
import { controlsOverPicture } from '../input/touch.ts';

/** The touch controls over the picture now, in game pixels. */
export function controlsNow(scene: Phaser.Scene): Rect[] {
  return controlsOverPicture(scene.game.canvas, VIEW_WIDTH, VIEW_HEIGHT);
}

/** How far the controls reach in from each side over the rows [y0, y1). */
export function reachOver(scene: Phaser.Scene, y0 = 0, y1 = VIEW_HEIGHT): { left: number; right: number } {
  return controlReach(controlsNow(scene), VIEW_WIDTH, y0, y1);
}

/**
 * A full page drawn in a container at (0, 0) as if it filled the picture: placed and scaled to miss the controls
 * (`fit`), with taps mapped back into the page's own pixels (`toPage`).
 */
export class PageFit {
  x = 0;
  y = 0;
  scale = 1;

  /** Place `root` clear of the controls now on the screen. */
  apply(scene: Phaser.Scene, root: Phaser.GameObjects.Container): void {
    const f = pageFit(controlsNow(scene), VIEW_WIDTH, VIEW_HEIGHT, PAGE_MIN_SCALE);
    this.x = f.x;
    this.y = f.y;
    this.scale = f.scale;
    root.setPosition(f.x, f.y).setScale(f.scale);
  }

  /** A point in the page's own pixels on the screen (game pixels). */
  fromPage(x: number, y: number): { x: number; y: number } {
    return { x: this.x + x * this.scale, y: this.y + y * this.scale };
  }

  /** A point on the screen (game pixels) in the page's own pixels. */
  toPage(x: number, y: number): { x: number; y: number } {
    return { x: (x - this.x) / this.scale, y: (y - this.y) / this.scale };
  }
}
