// A shop: full page, Buy and Sell side by side (left / right to switch), the price of each item, gold
// on hand and room in the bag. A buys or sells one; B leaves. Rules: engine/rpg.ts buy and sell.

import Phaser from 'phaser';
import { UI } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { RPG } from '../data/rpg.ts';
import type { FlagStore } from '../engine/flags.ts';
import { STAT_KEYS, bagContents, bagUsed, buy, gold, itemCount, level, partyMembers, sell, sellPrice, type ItemDef, type ShopDef } from '../engine/rpg.ts';
import type { InputManager } from '../input/actions.ts';

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
    this.message = 'Bonjou! What will it be?';
    this.root.setVisible(true);
    this.draw();
  }

  close(): void {
    this.root.setVisible(false);
    this.shop = null;
  }

  snapshot(): { shop: string; side: string; items: string[]; cursor: number; message: string } | null {
    return this.visible && this.shop ? { shop: this.shop.id, side: this.side, items: [...this.labels], cursor: this.cursor, message: this.message } : null;
  }

  /** Returns true when the player leaves. */
  update(input: InputManager): boolean {
    if (!this.shop || !this.flags) return true;
    if (input.pressed('cancel') || input.pressed('menu')) return true;
    if (input.pressed('left') || input.pressed('right')) {
      this.side = this.side === 'buy' ? 'sell' : 'buy';
      this.cursor = 0;
      this.message = this.side === 'buy' ? 'Have a look.' : 'What are you selling?';
    }
    const list = this.list();
    if (list.length > 0 && (input.pressed('up') || input.pressed('down'))) {
      this.cursor = (this.cursor + (input.pressed('up') ? -1 : 1) + list.length) % list.length;
    }
    if (input.pressed('confirm')) this.trade(list[this.cursor]);
    this.draw();
    return false;
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
      this.message =
        r === 'ok' ? `Mèsi! One ${it.name}.` : r === 'no_gold' ? 'Not enough gold.' : r === 'bag_full' ? 'Your bag is full.' : 'Not for sale.';
    } else {
      const r = sell(flags, RPG, it.id);
      this.message = r === 'ok' ? `Sold for ${sellPrice(it)} gold.` : 'I cannot take that.';
      this.cursor = Math.min(this.cursor, Math.max(0, this.list().length - 1));
    }
  }

  private text(x: number, y: number, s: string, color: string = UI.text, wrap?: number): Phaser.GameObjects.Text {
    const t = this.scene.add.text(x, y, s, { fontFamily: UI.font, fontSize: `${UI.fontSizePx}px`, color, lineSpacing: UI.lineSpacingPx });
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
    this.text(VIEW_WIDTH - 54, 4, '< L / R >', UI.dimText);
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
    });
    if (list.length === 0) this.text(6, TOP + 2, this.side === 'sell' ? '  Nothing to sell.' : '  Sold out.', UI.dimText);
    const it = list[this.cursor];
    if (it) {
      const bits = STAT_KEYS.filter((k) => it.stats?.[k]).map((k) => `${k.toUpperCase()} +${it.stats![k]}`);
      if (it.heals) bits.push(`+${it.heals} HP`);
      if (it.restores) bits.push(`+${it.restores} SP`);
      this.text(6, VIEW_HEIGHT - 34, `${it.text}${bits.length ? `  (${bits.join(', ')})` : ''}`, UI.dimText, VIEW_WIDTH - 12);
    }
    this.text(6, VIEW_HEIGHT - 12, 'A: buy or sell one   B: leave   Lv!: above your level', UI.dimText);
  }
}
