// Anissa's hint: a small box at the top of the screen with her name, which does not stop play.

import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { HINT_SHOW_MS, VIEW_WIDTH } from '../config.ts';
import { textStyle } from './text.ts';

const W = VIEW_WIDTH - 8;

export class HintBubble {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly name: Phaser.GameObjects.Text;
  private readonly text: Phaser.GameObjects.Text;
  private timer: Phaser.Time.TimerEvent | null = null;
  lastHint = '';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bg = scene.add.graphics();
    this.name = scene.add.text(8, 6, '', textStyle(UI.accentText));
    this.text = scene.add
      .text(8, 16, '', textStyle(UI.text))
      .setWordWrapWidth(W - 10, true);
    this.root = scene.add.container(0, 0, [this.bg, this.name, this.text]).setScrollFactor(0).setDepth(6500).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  show(speaker: string, hint: string): void {
    this.lastHint = hint;
    this.name.setText(speaker);
    this.text.setText(hint);
    const h = Math.ceil(this.text.height) + 18;
    this.bg.clear();
    this.bg.fillStyle(UI.hintFill, UI.boxAlpha).fillRect(4, 3, W, h);
    this.bg.lineStyle(1, UI.hintBorder, 1).strokeRect(4.5, 3.5, W - 1, h - 1);
    this.root.setVisible(true).setAlpha(1);
    this.timer?.remove();
    this.timer = this.scene.time.delayedCall(HINT_SHOW_MS, () => this.root.setVisible(false));
  }

  hide(): void {
    this.timer?.remove();
    this.root.setVisible(false);
  }
}
