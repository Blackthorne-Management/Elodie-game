// The dialogue box: portrait slot, speaker name tag, typewriter text, optional translation line and
// a choice list. It draws what a DialogueRunner view says; it never decides content.

import Phaser from 'phaser';
import { PORTRAIT_SIZE, UI, textureKeyForPortrait } from '../assets.config.ts';
import { TEXT_SPEEDS, VIEW_HEIGHT, VIEW_WIDTH, type TextSpeed } from '../config.ts';
import { typewriterChars, type DialogueView } from '../engine/dialogue.ts';
import { dialogueExtraPx, textStyle } from './text.ts';

// Tall enough for a PORTRAIT_SIZE portrait with padding.
const BOX_X = 2;
/** The box's height: four lines, one more in Large text (ui/text.ts; the scene restarts on a change). */
const boxH = (): number => 58 + dialogueExtraPx();
const boxY = (): number => VIEW_HEIGHT - boxH() - 2;
const BOX_W = VIEW_WIDTH - 4;
const PAD = 5;
const DEPTH = 5000;


export interface DialogueBoxState {
  speaker: string | null;
  text: string;
  shown: string;
  typing: boolean;
  choices: string[] | null;
  cursor: number;
}

export class DialogueBox {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly box: Phaser.GameObjects.Graphics;
  private readonly nameBg: Phaser.GameObjects.Graphics;
  private readonly nameText: Phaser.GameObjects.Text;
  private readonly portrait: Phaser.GameObjects.Image;
  private readonly body: Phaser.GameObjects.Text;
  private readonly translation: Phaser.GameObjects.Text;
  private readonly more: Phaser.GameObjects.Graphics;
  private readonly choiceBg: Phaser.GameObjects.Graphics;
  private readonly choiceTexts: Phaser.GameObjects.Text[] = [];

  private view: DialogueView = { kind: 'end' };
  private wrapped = '';
  private elapsed = 0;
  private cps: number = TEXT_SPEEDS.normal;
  private cursor = 0;
  private choiceBox = { x: 0, y: 0, w: 0, h: 0 };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.box = scene.add.graphics();
    this.box.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(BOX_X, boxY(), BOX_W, boxH());
    this.box.lineStyle(1, UI.boxBorder, 1).strokeRect(BOX_X + 0.5, boxY() + 0.5, BOX_W - 1, boxH() - 1);
    this.nameBg = scene.add.graphics();
    this.nameText = scene.add.text(0, 0, '', textStyle(UI.accentText));
    this.portrait = scene.add.image(BOX_X + PAD, boxY() + PAD, '__WHITE').setOrigin(0, 0);
    this.body = scene.add.text(0, boxY() + PAD, '', textStyle(UI.text));
    this.translation = scene.add.text(0, 0, '', textStyle(UI.dimText));
    this.more = scene.add.graphics({ x: BOX_X + BOX_W - 10, y: boxY() + boxH() - 8 });
    this.more.fillStyle(0xf2d04b, 1).fillTriangle(0, 0, 6, 0, 3, 4);
    this.choiceBg = scene.add.graphics();
    this.root = scene.add.container(0, 0, [
      this.box,
      this.nameBg,
      this.nameText,
      this.portrait,
      this.body,
      this.translation,
      this.more,
      this.choiceBg,
    ]);
    this.root.setScrollFactor(0).setDepth(DEPTH).setVisible(false);
    scene.tweens.add({ targets: this.more, alpha: 0.2, duration: 400, yoyo: true, repeat: -1 });
  }

  private concealed = false;

  get visible(): boolean {
    return this.root.visible;
  }

  get typing(): boolean {
    return this.shownCount() < this.wrapped.length;
  }

  get choiceCount(): number {
    return this.view.kind === 'choice' ? this.view.choices.length : 0;
  }

  get choiceCursor(): number {
    return this.cursor;
  }

  /** Point at a choice (a tap on it). */
  setCursor(index: number): void {
    if (index < 0 || index >= this.choiceCount) return;
    this.cursor = index;
    this.refresh();
  }

  /** The choice under a point on the screen (game pixels), or null. */
  choiceAt(x: number, y: number): number | null {
    if (this.view.kind !== 'choice' || !this.choiceBg.visible) return null;
    const i = this.choiceTexts.findIndex((t) => y >= t.y - 1 && y < t.y + 10 && x >= this.choiceBox.x && x < this.choiceBox.x + this.choiceBox.w);
    return i >= 0 ? i : null;
  }

  /** Whether a point is on the dialogue box (or its name tag). */
  contains(x: number, y: number): boolean {
    return this.root.visible && x >= BOX_X && x < BOX_X + BOX_W && y >= boxY() - 13 && y < boxY() + boxH();
  }

  show(view: DialogueView, speed: TextSpeed): void {
    this.view = view;
    this.cps = TEXT_SPEEDS[speed];
    this.elapsed = 0;
    this.cursor = 0;
    if (view.kind === 'end') {
      this.hide();
      return;
    }
    this.root.setVisible(true);

    const speaker = view.speaker;
    const hasPortrait = !!speaker?.portrait && this.scene.textures.exists(textureKeyForPortrait(speaker.portrait));
    if (hasPortrait) this.portrait.setTexture(textureKeyForPortrait(speaker!.portrait!)).setDisplaySize(PORTRAIT_SIZE, PORTRAIT_SIZE);
    this.portrait.setVisible(hasPortrait);
    const textX = BOX_X + PAD + (hasPortrait ? PORTRAIT_SIZE + PAD : 0);
    const textW = BOX_X + BOX_W - PAD - textX;

    this.nameBg.clear();
    this.nameText.setText(speaker?.name ?? '').setVisible(!!speaker);
    if (speaker) {
      const w = Math.ceil(this.nameText.width) + 8;
      this.nameText.setPosition(BOX_X + 4, boxY() - 11);
      this.nameBg.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(BOX_X, boxY() - 13, w, 13);
      this.nameBg.lineStyle(1, UI.boxBorder, 1).strokeRect(BOX_X + 0.5, boxY() - 12.5, w - 1, 13);
    }

    this.body.setPosition(textX, boxY() + PAD).setWordWrapWidth(textW, true);
    this.wrapped = this.body.getWrappedText(view.text).join('\n');
    this.body.setText('');
    this.translation.setText(view.translation ? `(${view.translation})` : '').setVisible(false);
    this.translation.setPosition(textX, boxY() + boxH() - PAD - 9).setWordWrapWidth(textW, true);
    this.drawChoices();
    this.refresh();
  }

  /** Hide the box for a moment (under the item showcase) without losing its place; false brings it back. */
  conceal(on: boolean): void {
    if (on) {
      this.concealed = this.root.visible;
      this.root.setVisible(false);
    } else if (this.concealed) {
      this.concealed = false;
      this.root.setVisible(true);
    }
  }

  hide(): void {
    this.concealed = false;
    this.root.setVisible(false);
    this.view = { kind: 'end' };
  }

  /** Reveal the whole line now. */
  finishTyping(): void {
    this.elapsed = Number.POSITIVE_INFINITY;
    this.refresh();
  }

  moveCursor(delta: number): void {
    const n = this.choiceCount;
    if (n === 0) return;
    this.cursor = (this.cursor + delta + n) % n;
    this.refresh();
  }

  /** Called as the line types out: the speaker (null for narration), the text, and the characters before and after. */
  onType: ((speakerId: string | null, text: string, before: number, after: number) => void) | null = null;

  update(deltaMs: number): void {
    if (!this.root.visible) return;
    if (this.typing) {
      const before = this.shownCount();
      this.elapsed += deltaMs;
      this.refresh();
      const after = this.shownCount();
      if (after > before && this.view.kind !== 'end') this.onType?.(this.view.speaker?.id ?? null, this.wrapped, before, after);
    }
  }

  snapshot(): DialogueBoxState | null {
    if (!this.root.visible || this.view.kind === 'end') return null;
    return {
      speaker: this.view.speaker?.name ?? null,
      text: this.view.text,
      shown: this.wrapped.slice(0, this.shownCount()),
      typing: this.typing,
      choices: this.view.kind === 'choice' ? this.view.choices.map((c) => c.text) : null,
      cursor: this.cursor,
    };
  }

  private shownCount(): number {
    return typewriterChars(this.elapsed, this.cps, this.wrapped.length);
  }

  private drawChoices(): void {
    for (const t of this.choiceTexts) t.destroy();
    this.choiceTexts.length = 0;
    this.choiceBg.clear();
    if (this.view.kind !== 'choice') return;
    const texts = this.view.choices.map((c) =>
      this.scene.add.text(0, 0, `  ${c.text}`, textStyle(UI.text)),
    );
    const lineH = 11;
    const w = Math.min(BOX_W, Math.ceil(Math.max(...texts.map((t) => t.width))) + 10);
    const h = texts.length * lineH + 6;
    const x = BOX_X + BOX_W - w;
    const y = boxY() - h - 2;
    this.choiceBox = { x, y, w, h };
    this.choiceBg.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(x, y, w, h);
    this.choiceBg.lineStyle(1, UI.boxBorder, 1).strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    texts.forEach((t, i) => t.setPosition(x + 4, y + 3 + i * lineH));
    this.choiceTexts.push(...texts);
    this.root.add(texts);
  }

  private refresh(): void {
    const count = this.shownCount();
    this.body.setText(this.wrapped.slice(0, count));
    const done = count >= this.wrapped.length;
    this.translation.setVisible(done && this.translation.text.length > 0);
    const isChoice = this.view.kind === 'choice';
    this.more.setVisible(done && !isChoice);
    this.choiceBg.setVisible(done && isChoice);
    this.choiceTexts.forEach((t, i) => {
      t.setVisible(done && isChoice);
      const label = this.view.kind === 'choice' ? this.view.choices[i]!.text : '';
      t.setText(`${i === this.cursor ? '>' : ' '} ${label}`);
      t.setColor(i === this.cursor ? UI.accentText : UI.text);
    });
  }
}
