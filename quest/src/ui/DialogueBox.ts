// The dialogue box: portrait slot, speaker name tag, typewriter text, optional translation line and
// a choice list. It draws what a DialogueRunner view says; it never decides content.

import Phaser from 'phaser';
import { PORTRAIT_SIZE, UI, textureKeyForPortrait, textureKeyForPortraitMood } from '../assets.config.ts';
import { TEXT_SPEEDS, VIEW_HEIGHT, VIEW_WIDTH, type TextSpeed } from '../config.ts';
import { typewriterChars, type DialogueView } from '../engine/dialogue.ts';
import { fillButtons } from '../input/buttonNames.ts';
import { reachOver } from './clearOfControls.ts';
import { dialogueExtraPx, textStyle } from './text.ts';

// Tall enough for a PORTRAIT_SIZE portrait with padding.
const BOX_X = 2;
/** The box's least height: four lines, one more in Large text (ui/text.ts; the scene restarts on a change). */
const boxH = (): number => 58 + dialogueExtraPx();
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
  /**
   * Where the box is now. Full width at the bottom; on a sideways phone it is narrowed to miss the touch controls where
   * they reach over the picture's corners, and taller when the line then needs more rows (review Nov 7, finding 5;
   * Nov 10).
   */
  private rect = { x: BOX_X, y: VIEW_HEIGHT - boxH() - 2, w: BOX_W, h: boxH() };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.box = scene.add.graphics();
    this.nameBg = scene.add.graphics();
    this.nameText = scene.add.text(0, 0, '', textStyle(UI.accentText));
    this.portrait = scene.add.image(0, 0, '__WHITE').setOrigin(0, 0);
    this.body = scene.add.text(0, 0, '', textStyle(UI.text));
    this.translation = scene.add.text(0, 0, '', textStyle(UI.dimText));
    this.more = scene.add.graphics();
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

  /** The middle of a choice's row on the screen (game pixels), or null (the tests tap there). */
  choicePoint(index: number): { x: number; y: number } | null {
    const t = this.choiceTexts[index];
    return t && this.choiceBg.visible ? { x: this.choiceBox.x + this.choiceBox.w / 2, y: t.y + 5 } : null;
  }

  /** The choice under a point on the screen (game pixels), or null. */
  choiceAt(x: number, y: number): number | null {
    if (this.view.kind !== 'choice' || !this.choiceBg.visible) return null;
    const i = this.choiceTexts.findIndex((t) => y >= t.y - 1 && y < t.y + 10 && x >= this.choiceBox.x && x < this.choiceBox.x + this.choiceBox.w);
    return i >= 0 ? i : null;
  }

  /** The top of the box with its name tag (screen y, game pixels): nobody in the scene stands under it. */
  get top(): number {
    return this.rect.y - 13;
  }

  /** Whether a point is on the dialogue box (or its name tag). */
  contains(x: number, y: number): boolean {
    const r = this.rect;
    return this.root.visible && x >= r.x && x < r.x + r.w && y >= r.y - 13 && y < r.y + r.h;
  }

  show(shown: DialogueView, speed: TextSpeed): void {
    // Button names in a line ("{A} to talk") as the player's device names them (input/buttonNames.ts).
    const view: DialogueView =
      shown.kind === 'end'
        ? shown
        : shown.kind === 'choice'
          ? { ...shown, text: fillButtons(shown.text), choices: shown.choices.map((c) => ({ ...c, text: fillButtons(c.text) })) }
          : { ...shown, text: fillButtons(shown.text) };
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
    // The line's expression when its picture exists, else the plain portrait.
    const mood = hasPortrait && view.mood ? textureKeyForPortraitMood(speaker!.portrait!, view.mood) : '';
    const face = mood && this.scene.textures.exists(mood) ? mood : textureKeyForPortrait(speaker?.portrait ?? '');
    if (hasPortrait) this.portrait.setTexture(face).setDisplaySize(PORTRAIT_SIZE, PORTRAIT_SIZE);
    this.portrait.setVisible(hasPortrait);
    this.translation.setText(view.translation ? `(${view.translation})` : '').setVisible(false);
    this.layout(view.text, hasPortrait);
    const r = this.rect;
    const textX = r.x + PAD + (hasPortrait ? PORTRAIT_SIZE + PAD : 0);

    this.box.clear();
    this.box.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(r.x, r.y, r.w, r.h);
    this.box.lineStyle(1, UI.boxBorder, 1).strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    this.portrait.setPosition(r.x + PAD, r.y + PAD);
    this.more.setPosition(r.x + r.w - 10, r.y + r.h - 8);

    this.nameBg.clear();
    this.nameText.setText(speaker?.name ?? '').setVisible(!!speaker);
    if (speaker) {
      const w = Math.ceil(this.nameText.width) + 8;
      this.nameText.setPosition(r.x + 4, r.y - 11);
      this.nameBg.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(r.x, r.y - 13, w, 13);
      this.nameBg.lineStyle(1, UI.boxBorder, 1).strokeRect(r.x + 0.5, r.y - 12.5, w - 1, 13);
    }

    this.body.setPosition(textX, r.y + PAD);
    this.body.setText('');
    this.translation.setPosition(textX, r.y + r.h - PAD - 9);
    this.drawChoices();
    this.refresh();
  }

  /**
   * Fit the box to the touch controls on the screen now (ui/clearOfControls.ts): between what reaches in from the left
   * and the right over its rows, and tall enough for the line wrapped to that width. Sets `rect` and `wrapped`.
   */
  private layout(text: string, hasPortrait: boolean): void {
    let h = boxH();
    for (let pass = 0; pass < 3; pass++) {
      const y = VIEW_HEIGHT - h - 2;
      const reach = reachOver(this.scene, y - 13, VIEW_HEIGHT);
      const x = reach.left > 0 ? Math.max(BOX_X, reach.left + 1) : BOX_X;
      const end = reach.right > 0 ? Math.min(BOX_X + BOX_W, VIEW_WIDTH - reach.right - 1) : BOX_X + BOX_W;
      const w = end - x;
      const textW = w - PAD * 2 - (hasPortrait ? PORTRAIT_SIZE + PAD : 0);
      this.body.setWordWrapWidth(textW, true);
      this.translation.setWordWrapWidth(textW, true);
      this.wrapped = this.body.getWrappedText(text).join('\n');
      this.body.setText(this.wrapped);
      const translationH = this.translation.text ? Math.ceil(this.translation.height) + 1 : 0;
      const need = Math.max(boxH(), Math.ceil(this.body.height) + translationH + PAD * 2 + 4);
      this.rect = { x, y, w, h };
      if (need <= h) return;
      h = need;
    }
    this.rect = { ...this.rect, y: VIEW_HEIGHT - h - 2, h };
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
    const h = texts.length * lineH + 6;
    const y = this.rect.y - h - 2;
    // At the box's right end, clear of the controls over its own rows too.
    const reach = reachOver(this.scene, y, y + h);
    const end = Math.min(this.rect.x + this.rect.w, reach.right > 0 ? VIEW_WIDTH - reach.right - 1 : VIEW_WIDTH);
    const w = Math.min(end, Math.ceil(Math.max(...texts.map((t) => t.width))) + 10);
    const x = end - w;
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
