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

  /** Messages waiting their turn; `kept` ones (rewards, level-ups) are never cut short. */
  private waiting: { message: string; kept: boolean }[] = [];
  private keeping = false;

  /** Show a message now, unless a reward is showing or waiting: then it follows them. */
  show(message: string): void {
    this.add(message, false);
  }

  /** Show a message for its full time, after any reward already showing or waiting (rewards, level-ups). */
  queue(message: string): void {
    this.add(message, true);
  }

  private add(message: string, kept: boolean): void {
    if (this.text.visible && (this.keeping || this.waiting.length > 0)) this.waiting.push({ message, kept });
    else this.display(message, kept);
  }

  private display(message: string, kept: boolean): void {
    this.lastMessage = message;
    this.keeping = kept;
    this.text.setText(message).setVisible(true).setAlpha(1);
    this.timer?.remove();
    this.timer = this.scene.time.delayedCall(TOAST_MS, () => {
      const next = this.waiting.shift();
      if (next) this.display(next.message, next.kept);
      else {
        this.keeping = false;
        this.text.setVisible(false);
      }
    });
  }
}
