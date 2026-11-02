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
  /** While a scene plays, rewards and level-ups wait for it to end (setHeld). */
  private held = false;

  /** Show a message now, unless a reward is showing or waiting: then it follows them. */
  show(message: string): void {
    this.add(message, false);
  }

  /** Show a message for its full time, after any reward already showing or waiting (rewards, level-ups). */
  queue(message: string): void {
    this.add(message, true);
  }

  /**
   * Hold rewards and level-ups back while a scene plays (the Nov 1 playtest: "Yari reached level 6!" over Anaco being
   * taken); they are kept, in order, and shown once it ends. Plain notes ("Autosaved") still show.
   */
  setHeld(on: boolean): void {
    if (this.held === on) return;
    this.held = on;
    // Released: what waited shows now, over a plain note ("Autosaved") but never over another reward.
    if (!on && (!this.text.visible || (!this.keeping && this.waiting.some((w) => this.ready(w))))) this.next();
  }

  /** Messages still to show (tests and the snapshot). */
  get pending(): readonly string[] {
    return this.waiting.map((w) => w.message);
  }

  /** Forget everything waiting and hide the toast (the dev jump starts clean). */
  clear(): void {
    this.waiting = [];
    this.keeping = false;
    this.timer?.remove();
    this.timer = null;
    this.text.setVisible(false);
  }

  private ready(w: { kept: boolean }): boolean {
    return !(this.held && w.kept);
  }

  private add(message: string, kept: boolean): void {
    const item = { message, kept };
    const busy = this.text.visible && (this.keeping || this.waiting.some((w) => this.ready(w)));
    if (!busy && this.ready(item)) this.display(message, kept);
    else this.waiting.push(item);
  }

  private next(): void {
    const i = this.waiting.findIndex((w) => this.ready(w));
    if (i < 0) {
      this.keeping = false;
      this.text.setVisible(false);
      return;
    }
    const [w] = this.waiting.splice(i, 1);
    this.display(w!.message, w!.kept);
  }

  private display(message: string, kept: boolean): void {
    this.lastMessage = message;
    this.keeping = kept;
    this.text.setText(message).setVisible(true).setAlpha(1);
    this.timer?.remove();
    this.timer = this.scene.time.delayedCall(TOAST_MS, () => this.next());
  }
}
