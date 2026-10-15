// The pause menu: a vertical list with a cursor. Items and their labels come from the Field scene.

import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { VIEW_WIDTH } from '../config.ts';
import { textStyle } from './text.ts';

export interface MenuItem {
  id: string;
  label: string;
}

const LINE_H = 12;
const DEPTH = 6000;

export class MenuPanel {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly bg: Phaser.GameObjects.Graphics;
  private texts: Phaser.GameObjects.Text[] = [];
  private items: MenuItem[] = [];
  private cursorIndex = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bg = scene.add.graphics();
    this.root = scene.add.container(0, 0, [this.bg]).setScrollFactor(0).setDepth(DEPTH).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  get cursor(): number {
    return this.cursorIndex;
  }

  get current(): MenuItem | undefined {
    return this.items[this.cursorIndex];
  }

  open(items: MenuItem[]): void {
    this.cursorIndex = 0;
    this.setItems(items);
    this.root.setVisible(true);
  }

  close(): void {
    this.root.setVisible(false);
  }

  /** Replace the items (labels change, e.g. the text speed) keeping the cursor. */
  setItems(items: MenuItem[]): void {
    this.items = items;
    for (const t of this.texts) t.destroy();
    this.texts = items.map((it) =>
      this.scene.add.text(0, 0, `> ${it.label}`, textStyle(UI.text)),
    );
    const w = Math.ceil(Math.max(...this.texts.map((t) => t.width))) + 10;
    const h = items.length * LINE_H + 8;
    const x = VIEW_WIDTH - w - 4;
    const y = 4;
    this.bg.clear();
    this.bg.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(x, y, w, h);
    this.bg.lineStyle(1, UI.boxBorder, 1).strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    this.texts.forEach((t, i) => t.setPosition(x + 5, y + 5 + i * LINE_H));
    this.root.add(this.texts);
    this.cursorIndex = Math.min(this.cursorIndex, items.length - 1);
    this.refresh();
  }

  moveCursor(delta: number): void {
    const n = this.items.length;
    if (n === 0) return;
    this.cursorIndex = (this.cursorIndex + delta + n) % n;
    this.refresh();
  }

  snapshot(): { items: string[]; cursor: number } | null {
    return this.root.visible ? { items: this.items.map((i) => i.label), cursor: this.cursorIndex } : null;
  }

  private refresh(): void {
    this.texts.forEach((t, i) => {
      const on = i === this.cursorIndex;
      t.setText(`${on ? '>' : ' '} ${this.items[i]!.label}`);
      t.setColor(on ? UI.accentText : UI.text);
    });
  }
}
