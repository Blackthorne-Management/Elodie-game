// A full-screen panel of text lines: the Journal, and the end-of-act card. Lines can be coloured and
// wrapped; the panel scrolls when they do not fit (up/down).

import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { fillButtons } from '../input/buttonNames.ts';
import { liveButtons, textStyle } from './text.ts';

export interface PanelLine {
  text: string;
  color?: string;
  /** Centered (cards) instead of left-aligned. */
  center?: boolean;
  /** Extra space above this line. */
  gap?: number;
}

const PAD = 8;
const DEPTH = 7100; // above toasts and hints

export class TextPanel {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly body: Phaser.GameObjects.Container;
  private texts: Phaser.GameObjects.Text[] = [];
  private scroll = 0;
  private contentHeight = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bg = scene.add.graphics();
    this.body = scene.add.container(0, 0);
    this.root = scene.add.container(0, 0, [this.bg, this.body]).setScrollFactor(0).setDepth(DEPTH).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  open(given: PanelLine[], style: { fill: number; alpha: number; border: boolean; top?: number }): void {
    // Button names ("{A} to continue") as the player's device names them (input/buttonNames.ts).
    const lines = given.map((l) => ({ ...l, text: fillButtons(l.text) }));
    this.scroll = 0;
    for (const t of this.texts) t.destroy();
    this.bg.clear().fillStyle(style.fill, style.alpha).fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    if (style.border) this.bg.lineStyle(1, UI.boxBorder, 1).strokeRect(2.5, 2.5, VIEW_WIDTH - 5, VIEW_HEIGHT - 5);
    let y = style.top ?? PAD;
    this.texts = lines.map((l, i) => {
      y += l.gap ?? 0;
      const t = this.scene.add
        .text(l.center ? VIEW_WIDTH / 2 : PAD, y, l.text, textStyle(l.color ?? UI.text, { align: l.center ? 'center' : 'left' }))
        .setOrigin(l.center ? 0.5 : 0, 0)
        .setWordWrapWidth(VIEW_WIDTH - PAD * 2, true);
      // A line naming buttons ("({Continue})") follows the device the player switches to while the panel is up.
      liveButtons(t, given[i]!.text);
      y += Math.ceil(t.height) + 2;
      return t;
    });
    this.contentHeight = y;
    this.body.removeAll(false).add(this.texts).setY(0);
    // A card set low (`top`) whose lines run past the bottom rises as far as it needs, up to the top margin, so its last
    // line (the continue line) stays on the screen (the endings, with the Stability line under the title; Nov 7).
    const over = this.contentHeight - (VIEW_HEIGHT - PAD);
    if (style.top !== undefined && over > 0) this.scrollBy(Math.min(over, style.top - PAD));
    this.root.setVisible(true);
  }

  scrollBy(delta: number): void {
    const max = Math.max(0, this.contentHeight - VIEW_HEIGHT + PAD);
    this.scroll = Math.max(0, Math.min(max, this.scroll + delta));
    this.body.setY(-this.scroll);
  }

  close(): void {
    this.root.setVisible(false);
  }

  snapshot(): string[] | null {
    // As shown now (button names follow a device switch).
    return this.root.visible ? this.texts.map((t) => t.text) : null;
  }
}
