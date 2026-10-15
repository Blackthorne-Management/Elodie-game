// Short status messages ("Saved", "Echo: not yet") at the top of the screen.

import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { TOAST_MS, VIEW_WIDTH } from '../config.ts';
import { textStyle } from './text.ts';

export class Toast {
  private readonly text: Phaser.GameObjects.Text;
  private readonly scene: Phaser.Scene;
  private timer: Phaser.Time.TimerEvent | null = null;
  lastMessage = '';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.text = scene.add
      .text(VIEW_WIDTH / 2, 4, '', textStyle(UI.text, { backgroundColor: '#14101af0', padding: { x: 4, y: 2 } }))
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(7000)
      .setVisible(false);
  }

  show(message: string): void {
    this.lastMessage = message;
    this.text.setText(message).setVisible(true).setAlpha(1);
    this.timer?.remove();
    this.timer = this.scene.time.delayedCall(TOAST_MS, () => this.text.setVisible(false));
  }
}
