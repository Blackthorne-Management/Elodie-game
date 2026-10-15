// The item showcase (engine/showcase.ts decides when): the popup the first time an important item is
// received. Story and legendary items get the full showcase: the screen dims, the item rises into the
// middle and grows, with turning light rays, a pulsing glow and sparkles, then its banner, name,
// description and abilities (unknown ones as "???"). Quest reward gear gets a small card. A, B or a
// tap closes it (the first press while it is still rising only finishes the animation).

import Phaser from 'phaser';
import { SHOWCASE, UI, textureKeyForItem } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import type { ShowcaseView } from '../engine/showcase.ts';
import type { InputManager } from '../input/actions.ts';
import { textStyle } from './text.ts';

const DEPTH = 6600;
const CX = VIEW_WIDTH / 2;
const ART_Y = 32;
const RAYS = 12;

const TIER_COLOURS = {
  legendary: SHOWCASE.legendaryColor,
  story: SHOWCASE.storyColor,
  reward: SHOWCASE.rewardColor,
} as const;

export class ItemShowcase {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private view: ShowcaseView | null = null;
  private tweens: Phaser.Tweens.Tween[] = [];
  private texts: Phaser.GameObjects.GameObject[] = [];
  private rising = false;
  /** Jumps the rise to its end (a press while it is still rising). */
  private finishRise: (() => void) | null = null;
  private riseTweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.root = scene.add.container(0, 0).setScrollFactor(0).setDepth(DEPTH).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  /** Show an item; `artKey` is its drawing (assets.config.ts itemArtKey). */
  open(view: ShowcaseView, artKey: string): void {
    this.clear();
    this.view = view;
    this.root.setVisible(true);
    if (view.tier === 'reward') this.drawCard(view, artKey);
    else this.drawFull(view, artKey);
  }

  close(): void {
    this.clear();
    this.view = null;
    this.root.setVisible(false);
  }

  /** Returns true when the player closes it. */
  update(input: InputManager): boolean {
    if (!input.pressed('confirm') && !input.pressed('cancel')) return false;
    return this.press();
  }

  /** A tap anywhere: the same as A. */
  tap(): boolean {
    return this.press();
  }

  snapshot(): { id: string; tier: string; banner: string; name: string; abilities: string[]; rising: boolean } | null {
    const v = this.view;
    return v
      ? { id: v.id, tier: v.tier, banner: v.banner, name: v.name, abilities: v.abilities.map((a) => `${a.name}: ${a.text}`), rising: this.rising }
      : null;
  }

  private press(): boolean {
    if (!this.rising) return true;
    for (const t of this.riseTweens) t.remove();
    this.riseTweens = [];
    this.finishRise?.();
    this.rising = false;
    return false;
  }

  /** A tween that is part of the rise (skipped by a press). */
  private rise(config: Phaser.Types.Tweens.TweenBuilderConfig): void {
    this.riseTweens.push(this.tween(config));
  }

  private clear(): void {
    for (const t of this.tweens) t.remove();
    this.tweens = [];
    this.riseTweens = [];
    this.finishRise = null;
    this.texts = [];
    this.root.removeAll(true);
  }

  private tween(config: Phaser.Types.Tweens.TweenBuilderConfig): Phaser.Tweens.Tween {
    const t = this.scene.tweens.add(config);
    this.tweens.push(t);
    return t;
  }

  private text(x: number, y: number, s: string, color: string, width = VIEW_WIDTH - 24, align: 'center' | 'left' = 'center'): Phaser.GameObjects.Text {
    const t = this.scene.add
      .text(x, y, s, textStyle(color, { align, wordWrap: { width, useAdvancedWrap: true } }))
      .setOrigin(align === 'center' ? 0.5 : 0, 0);
    this.root.add(t);
    this.texts.push(t);
    return t;
  }

  private art(key: string, x: number, y: number, px: number): Phaser.GameObjects.Image {
    const img = this.scene.add.image(x, y, textureKeyForItem(key));
    img.setScale(px / Math.max(img.width, img.height));
    this.root.add(img);
    return img;
  }

  /** Story and legendary items: rays, glow, sparkles, the item rising, then the words. */
  private drawFull(view: ShowcaseView, artKey: string): void {
    const dim = this.scene.add.rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT, 0x000000, SHOWCASE.dimAlpha).setOrigin(0);
    this.root.add(dim);

    const rays = this.scene.add.graphics({ x: CX, y: ART_Y });
    rays.fillStyle(SHOWCASE.raysColor, 1);
    for (let i = 0; i < RAYS; i++) {
      const a = (i / RAYS) * Math.PI * 2;
      const w = Math.PI / RAYS / 2.2;
      rays.fillTriangle(0, 0, Math.cos(a - w) * 70, Math.sin(a - w) * 70, Math.cos(a + w) * 70, Math.sin(a + w) * 70);
    }
    rays.setAlpha(0);
    this.root.add(rays);

    const glow = this.scene.add.circle(CX, ART_Y, SHOWCASE.artPx * 0.62, SHOWCASE.glowColor, 0.35).setAlpha(0);
    this.root.add(glow);

    const sparkles: Phaser.GameObjects.Rectangle[] = [];
    for (let i = 0; i < SHOWCASE.sparkleCount; i++) {
      const a = (i / SHOWCASE.sparkleCount) * Math.PI * 2;
      const r = 28 + (i % 3) * 7;
      const s = this.scene.add.rectangle(CX + Math.cos(a) * r, ART_Y + Math.sin(a) * r * 0.8, i % 2 ? 1 : 2, i % 2 ? 1 : 2, 0xfff8e0).setAlpha(0);
      sparkles.push(s);
      this.root.add(s);
    }

    const item = this.art(artKey, CX, ART_Y + 30, SHOWCASE.artPx);
    const full = item.scale;
    item.setScale(0).setAlpha(0);

    // The words, under the item.
    let y = ART_Y + SHOWCASE.artPx / 2 + 6;
    const banner = this.text(CX, y, view.banner.toUpperCase(), TIER_COLOURS[view.tier]);
    y += banner.height + 2;
    const name = this.text(CX, y, view.name, UI.accentText);
    y += name.height + 4;
    const desc = this.text(CX, y, view.text, UI.dimText, VIEW_WIDTH - 24);
    y += desc.height + 4;
    if (view.stats.length > 0) {
      y += this.text(CX, y, view.stats.join('   '), UI.text).height + 4;
    }
    for (const a of view.abilities) {
      const t = this.text(14, y, `${a.name}: ${a.text}`, a.known ? UI.text : UI.dimText, VIEW_WIDTH - 28, 'left');
      y += t.height + 2;
    }
    this.text(VIEW_WIDTH - 6, VIEW_HEIGHT - 11, '(A or tap)', UI.dimText, 80, 'left').setOrigin(1, 0);
    const words = [...this.texts];
    for (const w of words) (w as Phaser.GameObjects.Text).setAlpha(0);

    // The rise: the item grows up into place, then the rays, glow and words come in.
    const raysAlpha = SHOWCASE.raysAlpha * (view.tier === 'legendary' ? 1.4 : 1);
    this.rising = true;
    this.finishRise = () => {
      item.setPosition(CX, ART_Y).setScale(full).setAlpha(1);
      rays.setAlpha(raysAlpha);
      glow.setAlpha(1);
      for (const w of words) (w as Phaser.GameObjects.Text).setAlpha(1);
    };
    this.rise({ targets: item, y: ART_Y, scale: full, alpha: 1, duration: SHOWCASE.riseMs, ease: 'Back.Out' });
    this.rise({ targets: rays, alpha: raysAlpha, duration: SHOWCASE.riseMs, delay: SHOWCASE.riseMs / 2 });
    this.rise({ targets: glow, alpha: 1, duration: SHOWCASE.riseMs, delay: SHOWCASE.riseMs / 2 });
    this.rise({
      targets: words,
      alpha: 1,
      duration: 300,
      delay: SHOWCASE.riseMs,
      onComplete: () => {
        this.rising = false;
      },
    });
    // Ongoing: the rays turn, the glow breathes, the sparkles twinkle (looping tweens; never "completed").
    this.tween({ targets: rays, angle: 360, duration: SHOWCASE.raysTurnMs, repeat: -1 });
    this.tween({ targets: glow, scale: 1.18, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut', delay: SHOWCASE.riseMs });
    sparkles.forEach((s, i) => {
      this.tween({ targets: s, alpha: 1, duration: 380, yoyo: true, repeat: -1, delay: SHOWCASE.riseMs + i * 130, repeatDelay: 500 + (i % 4) * 160 });
    });
  }

  /** Quest reward gear: a small card in the middle of the screen. */
  private drawCard(view: ShowcaseView, artKey: string): void {
    const W = 230;
    const X = CX - W / 2;
    const Y = 44;
    this.root.add(this.scene.add.rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT, 0x000000, SHOWCASE.cardDimAlpha).setOrigin(0));
    const box = this.scene.add.graphics();
    this.root.add(box);
    const item = this.art(artKey, X + 22, Y + 24, SHOWCASE.cardArtPx);
    const TX = X + 42;
    let y = Y + 8;
    y += this.text(TX, y, view.banner.toUpperCase(), TIER_COLOURS.reward, W - 50, 'left').height + 2;
    y += this.text(TX, y, view.name, UI.accentText, W - 50, 'left').height + 3;
    y += this.text(TX, y, view.text, UI.dimText, W - 50, 'left').height + 3;
    if (view.stats.length > 0) y += this.text(TX, y, view.stats.join('  '), UI.text, W - 50, 'left').height + 3;
    y += this.text(CX, y + 2, '(A or tap to continue)', UI.dimText).height + 8;
    box.fillStyle(UI.boxFill, 1).fillRect(X, Y, W, y - Y);
    box.lineStyle(1, UI.boxBorder, 1).strokeRect(X + 0.5, Y + 0.5, W - 1, y - Y - 1);
    const full = item.scale;
    item.setScale(0);
    this.rising = true;
    this.finishRise = () => item.setScale(full);
    this.rise({
      targets: item,
      scale: full,
      duration: SHOWCASE.riseMs * 0.6,
      ease: 'Back.Out',
      onComplete: () => {
        this.rising = false;
      },
    });
  }
}
