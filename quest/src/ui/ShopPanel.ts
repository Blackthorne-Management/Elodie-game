// A shop: full page, Buy and Sell side by side (left / right to switch), the price of each item, gold
// on hand and room in the bag. A buys or sells one; B leaves. Rules: engine/rpg.ts buy and sell.

import { audio } from '../audio/player.ts';
import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { RPG } from '../data/rpg.ts';
import type { FlagStore } from '../engine/flags.ts';
import { STAT_KEYS, bagContents, bagUsed, buy, gold, itemCount, level, partyMembers, sell, sellPrice, type ItemDef, type ShopDef } from '../engine/rpg.ts';
import type { InputManager } from '../input/actions.ts';
import { textStyle } from './text.ts';

const DEPTH = 6100;
const TOP = 40;
const ROW_H = 12;
const ROWS = 9;

export class ShopPanel {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly content: Phaser.GameObjects.Container;
  private shop: ShopDef | null = null;
  private flags: FlagStore | null = null;
  private side: 'buy' | 'sell' = 'buy';
  private cursor = 0;
  private message = '';
  private labels: string[] = [];
  /** The item waiting for "Yes" (every purchase and sale is confirmed first). */
  private pending: ItemDef | null = null;
  private hits: { x: number; y: number; w: number; h: number; run: () => boolean | void }[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const bg = scene.add.graphics();
    bg.fillStyle(UI.boxFill, 1).fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    bg.lineStyle(1, UI.boxBorder, 1).strokeRect(1.5, 1.5, VIEW_WIDTH - 3, VIEW_HEIGHT - 3);
    this.content = scene.add.container(0, 0);
    this.root = scene.add.container(0, 0, [bg, this.content]).setScrollFactor(0).setDepth(DEPTH).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  open(shop: ShopDef, flags: FlagStore): void {
    this.shop = shop;
    this.flags = flags;
    this.side = 'buy';
    this.cursor = 0;
    this.pending = null;
    this.message = 'Bonjou! What will it be?';
    this.root.setVisible(true);
    this.draw();
  }

  close(): void {
    this.root.setVisible(false);
    this.shop = null;
  }

  snapshot(): { shop: string; side: string; items: string[]; cursor: number; message: string; confirming: boolean } | null {
    return this.visible && this.shop
      ? { shop: this.shop.id, side: this.side, items: [...this.labels], cursor: this.cursor, message: this.message, confirming: !!this.pending }
      : null;
  }

  /** Returns true when the player leaves. */
  update(input: InputManager): boolean {
    if (!this.shop || !this.flags) return true;
    if (this.pending) {
      // The confirmation: A says yes, B says no.
      if (input.pressed('confirm')) this.answer(true);
      else if (input.pressed('cancel') || input.pressed('menu')) this.answer(false);
      this.draw();
      return false;
    }
    if (input.pressed('cancel') || input.pressed('menu')) return true;
    if (input.pressed('left') || input.pressed('right')) this.switchSide(this.side === 'buy' ? 'sell' : 'buy');
    const list = this.list();
    if (list.length > 0 && (input.pressed('up') || input.pressed('down'))) {
      this.cursor = (this.cursor + (input.pressed('up') ? -1 : 1) + list.length) % list.length;
    }
    if (input.pressed('confirm')) this.ask(list[this.cursor]);
    this.draw();
    return false;
  }

  /** A tap at a point in game pixels. Returns true when it was on Leave. */
  tap(x: number, y: number): boolean {
    const hit = [...this.hits].reverse().find((h) => x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h);
    const leave = hit?.run() === true;
    if (!leave) this.draw();
    return leave;
  }

  private switchSide(side: 'buy' | 'sell'): void {
    if (side === this.side) return;
    this.side = side;
    this.cursor = 0;
    this.message = side === 'buy' ? 'Have a look.' : 'What are you selling?';
  }

  /** Ask before trading: "Buy X for N gold?" */
  private ask(it: ItemDef | undefined): void {
    if (!it) return;
    const price = this.side === 'buy' ? it.price : sellPrice(it);
    this.pending = it;
    this.message = `${this.side === 'buy' ? 'Buy' : 'Sell'} ${it.name} for ${price} gold?`;
  }

  private answer(yes: boolean): void {
    const it = this.pending;
    this.pending = null;
    if (yes && it) this.trade(it);
    else this.message = 'Take your time.';
  }

  private list(): ItemDef[] {
    if (this.side === 'buy') return this.shop!.stock.map((id) => RPG.items[id]!).filter(Boolean);
    return bagContents(this.flags!, RPG)
      .map(([it]) => it)
      .filter((it) => it.kind !== 'key');
  }

  private trade(it: ItemDef | undefined): void {
    if (!it) return;
    const flags = this.flags!;
    if (this.side === 'buy') {
      const r = buy(flags, RPG, this.shop!, it.id);
      audio.sfx(r === 'ok' ? 'coins' : 'bump');
      this.message =
        r === 'ok' ? `Mèsi! One ${it.name}.` : r === 'no_gold' ? 'Not enough gold.' : r === 'bag_full' ? 'Your bag is full.' : 'Not for sale.';
    } else {
      const r = sell(flags, RPG, it.id);
      audio.sfx(r === 'ok' ? 'coins' : 'bump');
      this.message = r === 'ok' ? `Sold for ${sellPrice(it)} gold.` : 'I cannot take that.';
      this.cursor = Math.min(this.cursor, Math.max(0, this.list().length - 1));
    }
  }

  private text(x: number, y: number, s: string, color: string = UI.text, wrap?: number): Phaser.GameObjects.Text {
    const t = this.scene.add.text(x, y, s, textStyle(color));
    if (wrap) t.setWordWrapWidth(wrap, true);
    this.content.add(t);
    return t;
  }

  private draw(): void {
    const shop = this.shop;
    const flags = this.flags;
    if (!shop || !flags) return;
    this.content.removeAll(true);
    const g = this.scene.add.graphics();
    this.content.add(g);
    this.text(6, 4, shop.name, UI.accentText);
    const buyT = this.text(150, 4, 'Buy', this.side === 'buy' ? UI.accentText : UI.dimText);
    const sellT = this.text(180, 4, 'Sell', this.side === 'sell' ? UI.accentText : UI.dimText);
    const on = this.side === 'buy' ? buyT : sellT;
    g.fillStyle(0xf2d04b, 1).fillRect(on.x, 14, Math.ceil(on.width), 1);
    this.hits = [];
    const hit = (x: number, y: number, w: number, h: number, run: () => boolean | void) => this.hits.push({ x, y, w, h, run });
    if (!this.pending) {
      hit(buyT.x - 6, 0, buyT.width + 12, 16, () => this.switchSide('buy'));
      hit(sellT.x - 6, 0, sellT.width + 12, 16, () => this.switchSide('sell'));
    }
    const leaveT = this.text(VIEW_WIDTH - 40, 4, 'Leave', UI.text);
    hit(leaveT.x - 6, 0, leaveT.width + 12, 16, () => true);
    this.text(6, 18, `Gold ${gold(flags, RPG)}   Bag ${bagUsed(flags, RPG)}/${RPG.bagLimit}`, UI.accentText);
    this.text(6, 27, this.message, UI.text);
    g.lineStyle(1, UI.boxBorder, 0.5).lineBetween(4, 37.5, VIEW_WIDTH - 4, 37.5);

    const list = this.list();
    // Gear above every fighter's level is marked "!" (it would give only part of its bonus).
    const best = Math.max(1, ...partyMembers(flags, RPG, 'present').filter((m) => !m.support).map((m) => level(flags, RPG, m.id)));
    this.labels = list.map((it) => {
      const price = this.side === 'buy' ? it.price : sellPrice(it);
      const have = itemCount(flags, it.id);
      const lv = it.kind === 'gear' ? `  Lv${it.level ?? 1}${(it.level ?? 1) > best ? '!' : ''}` : '';
      return `${it.name.padEnd(20)}${String(price).padStart(4)}g${lv}${have ? `  (have ${have})` : ''}`;
    });
    const first = Math.max(0, Math.min(this.cursor - ROWS + 1, list.length - ROWS));
    this.labels.slice(first, first + ROWS).forEach((l, i) => {
      const sel = first + i === this.cursor;
      this.text(6, TOP + 2 + i * ROW_H, `${sel ? '>' : ' '} ${l}`, sel ? UI.accentText : UI.text);
      // Tap an item to choose it; tap it again to buy or sell (after the confirmation).
      if (!this.pending) {
        hit(4, TOP + 1 + i * ROW_H, VIEW_WIDTH - 8, ROW_H, () => {
          if (this.cursor === first + i) this.ask(list[first + i]);
          else this.cursor = first + i;
        });
      }
    });
    if (this.pending) {
      // The confirmation box: Yes and No, tappable (A and B too).
      const bx = VIEW_WIDTH / 2 - 70;
      const by = 92;
      const box = this.scene.add.graphics();
      this.content.add(box); // above the list
      box.fillStyle(UI.boxFill, 1).fillRect(bx, by, 140, 44);
      box.lineStyle(1, 0xf2d04b, 1).strokeRect(bx + 0.5, by + 0.5, 139, 43);
      this.text(bx + 8, by + 6, this.message, UI.text, 124);
      const yes = this.text(bx + 24, by + 28, '[ Yes ]', UI.accentText);
      const no = this.text(bx + 82, by + 28, '[ No ]', UI.text);
      hit(yes.x - 4, yes.y - 3, yes.width + 8, 14, () => this.answer(true));
      hit(no.x - 4, no.y - 3, no.width + 8, 14, () => this.answer(false));
    }
    if (list.length === 0) this.text(6, TOP + 2, this.side === 'sell' ? '  Nothing to sell.' : '  Sold out.', UI.dimText);
    const it = list[this.cursor];
    if (it) {
      const bits = STAT_KEYS.filter((k) => it.stats?.[k]).map((k) => `${k.toUpperCase()} +${it.stats![k]}`);
      if (it.heals) bits.push(`+${it.heals} HP`);
      if (it.restores) bits.push(`+${it.restores} SP`);
      this.text(6, VIEW_HEIGHT - 34, `${it.text}${bits.length ? `  (${bits.join(', ')})` : ''}`, UI.dimText, VIEW_WIDTH - 12);
    }
    this.text(6, VIEW_HEIGHT - 12, this.pending ? 'A: yes   B: no' : 'Tap or A: choose   B: leave   Lv!: above your level', UI.dimText);
  }
}
