// The full-page menu: tabs for Status (the party and their stats), Items (the bag, with its limit),
// Equip (gear for each member), Map (the city's sections and the realm), Journal, and System (save,
// settings, credits). The top always shows gold on hand and the three pillars, here and realm-wide.
// Rules come from engine/rpg.ts; content from data/rpg.ts. The Field scene runs System choices.

import Phaser from 'phaser';
import { UI, textureKeyForPortrait } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { RPG } from '../data/rpg.ts';
import type { FlagStore } from '../engine/flags.ts';
import {
  PILLARS,
  SLOTS,
  STAT_KEYS,
  armies,
  bagContents,
  bagUsed,
  baseStats,
  canWear,
  cityOf,
  equip,
  equipped,
  globalPillar,
  gold,
  level,
  localPillar,
  partyMembers,
  stats,
  unequip,
  visitedFlag,
  type ItemDef,
  type MemberDef,
  type Slot,
} from '../engine/rpg.ts';
import type { Era } from '../engine/types.ts';
import type { InputManager } from '../input/actions.ts';
import type { MenuItem } from './MenuPanel.ts';
import type { PanelLine } from './TextPanel.ts';

export const MENU_TABS = ['Status', 'Items', 'Equip', 'Map', 'Journal', 'System'] as const;
export type MenuTab = (typeof MENU_TABS)[number];

export type MenuRequest = { kind: 'close' } | { kind: 'system'; id: string } | { kind: 'toast'; text: string };

export interface MenuContext {
  flags: FlagStore;
  mapId: string;
  era: Era;
  journal: () => PanelLine[];
  system: () => MenuItem[];
}

const DEPTH = 6000;
const TOP = 38; // content starts under the tabs and the purse
const ROWS = 11; // list rows that fit
const ROW_H = 12;
const PILLAR_NAMES: Record<(typeof PILLARS)[number], string> = { influence: 'Influence', wealth: 'Wealth', fear: 'Fear' };
const STAT_NAMES: Record<(typeof STAT_KEYS)[number], string> = { hp: 'HP', sp: 'SP', atk: 'ATK', def: 'DEF', mag: 'MAG', spd: 'SPD' };
const SLOT_NAMES: Record<Slot, string> = { weapon: 'Weapon', armor: 'Armor', charm: 'Charm' };

type Stage = 'top' | 'who' | 'slot' | 'pick';

export class GameMenu {
  private readonly scene: Phaser.Scene;
  private readonly root: Phaser.GameObjects.Container;
  private readonly content: Phaser.GameObjects.Container;
  private ctx: MenuContext | null = null;
  private tab = 0;
  private cursor = 0;
  /** The list under the cursor, as labels (for the tests' snapshot). */
  private labels: string[] = [];
  private stage: Stage = 'top';
  private member: MemberDef | null = null;
  private slot: Slot | null = null;
  private item: ItemDef | null = null;
  private subCursor = 0;
  private mapView: 'city' | 'realm' = 'city';
  private scroll = 0;
  private journalLines: string[] = [];

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

  get currentTab(): MenuTab {
    return MENU_TABS[this.tab]!;
  }

  open(ctx: MenuContext, tab: MenuTab = 'Status'): void {
    this.ctx = ctx;
    this.tab = MENU_TABS.indexOf(tab);
    this.resetTab();
    this.root.setVisible(true);
    this.draw();
  }

  close(): void {
    this.root.setVisible(false);
    this.ctx = null;
  }

  /** Redraw (labels changed, e.g. the text speed). */
  refresh(): void {
    if (this.visible) this.draw();
  }

  snapshot(): { tab: string; items: string[]; cursor: number; journal: string[] | null } | null {
    if (!this.visible) return null;
    return { tab: this.currentTab, items: [...this.labels], cursor: this.stage === 'top' ? this.cursor : this.subCursor, journal: this.currentTab === 'Journal' ? this.journalLines : null };
  }

  /** Read this frame's presses and act on them. */
  update(input: InputManager): MenuRequest[] {
    const ctx = this.ctx;
    if (!ctx) return [];
    const out: MenuRequest[] = [];
    if (input.pressed('menu')) return [{ kind: 'close' }];
    if (input.pressed('cancel')) {
      if (this.stage === 'top') return [{ kind: 'close' }];
      this.back();
    } else if (this.stage === 'top' && (input.pressed('left') || input.pressed('right'))) {
      this.tab = (this.tab + (input.pressed('left') ? -1 : 1) + MENU_TABS.length) % MENU_TABS.length;
      this.resetTab();
    } else if (input.pressed('up') || input.pressed('down')) {
      this.move(input.pressed('up') ? -1 : 1);
    } else if (input.pressed('confirm')) {
      out.push(...this.confirm(ctx));
    }
    if (this.visible) this.draw();
    return out;
  }

  // ---- Navigation ------------------------------------------------------------------------------

  private resetTab(): void {
    this.cursor = 0;
    this.subCursor = 0;
    this.stage = 'top';
    this.member = null;
    this.slot = null;
    this.item = null;
    this.scroll = 0;
  }

  private back(): void {
    if (this.stage === 'pick') this.stage = 'slot';
    else if (this.stage === 'slot' || this.stage === 'who') this.stage = 'top';
    this.subCursor = 0;
  }

  private move(delta: number): void {
    if (this.currentTab === 'Journal') {
      this.scroll = Math.max(0, Math.min(Math.max(0, this.journalLines.length - ROWS), this.scroll + delta));
      return;
    }
    const n = this.listLength();
    if (n === 0) return;
    if (this.stage === 'top') this.cursor = (this.cursor + delta + n) % n;
    else this.subCursor = (this.subCursor + delta + n) % n;
  }

  private listLength(): number {
    const ctx = this.ctx!;
    switch (this.currentTab) {
      case 'Status':
        return this.party().length;
      case 'Items':
        return this.stage === 'who' ? this.wearers(this.item!).length : this.bag().length;
      case 'Equip':
        if (this.stage === 'slot') return SLOTS.length;
        if (this.stage === 'pick') return this.candidates().length + 1;
        return this.fighters().length;
      case 'System':
        return ctx.system().length;
      default:
        return 0;
    }
  }

  private confirm(ctx: MenuContext): MenuRequest[] {
    switch (this.currentTab) {
      case 'Items': {
        if (this.stage === 'top') {
          const entry = this.bag()[this.cursor];
          if (!entry) return [];
          const [it] = entry;
          if (it.kind === 'gear') {
            if (this.wearers(it).length === 0) return [{ kind: 'toast', text: 'No one here can wear that.' }];
            this.item = it;
            this.stage = 'who';
            this.subCursor = 0;
            return [];
          }
          if (it.kind === 'consumable') return [{ kind: 'toast', text: 'Everyone is well. Keep it for a fight.' }];
          return [{ kind: 'toast', text: it.text }];
        }
        const who = this.wearers(this.item!)[this.subCursor];
        if (!who) return [];
        const r = equip(ctx.flags, RPG, who, this.item!.id);
        this.stage = 'top';
        this.cursor = Math.min(this.cursor, Math.max(0, this.bag().length - 1));
        return [{ kind: 'toast', text: r === 'ok' ? `${who.name} equips the ${this.item!.name}.` : 'That did not work.' }];
      }
      case 'Equip': {
        if (this.stage === 'top') {
          this.member = this.fighters()[this.cursor] ?? null;
          if (!this.member) return [];
          this.stage = 'slot';
          this.subCursor = 0;
          return [];
        }
        if (this.stage === 'slot') {
          this.slot = SLOTS[this.subCursor]!;
          this.stage = 'pick';
          this.subCursor = 0;
          return [];
        }
        const m = this.member!;
        const slot = this.slot!;
        const options = this.candidates();
        if (this.subCursor === options.length) {
          const r = unequip(ctx.flags, RPG, m, slot);
          this.stage = 'slot';
          return [{ kind: 'toast', text: r === 'bag_full' ? 'The bag is full.' : `${SLOT_NAMES[slot]} removed.` }];
        }
        const it = options[this.subCursor]!;
        equip(ctx.flags, RPG, m, it.id);
        this.stage = 'slot';
        return [{ kind: 'toast', text: `${m.name} equips the ${it.name}.` }];
      }
      case 'Map':
        this.mapView = this.mapView === 'city' ? 'realm' : 'city';
        return [];
      case 'System': {
        const item = ctx.system()[this.cursor];
        return item ? [{ kind: 'system', id: item.id }] : [];
      }
      default:
        return [];
    }
  }

  // ---- Data ------------------------------------------------------------------------------------

  private party(): MemberDef[] {
    return partyMembers(this.ctx!.flags, RPG, this.ctx!.era);
  }

  private fighters(): MemberDef[] {
    return this.party().filter((m) => !m.support);
  }

  private bag(): [ItemDef, number][] {
    const all = bagContents(this.ctx!.flags, RPG);
    return [...all.filter(([it]) => it.kind !== 'key'), ...all.filter(([it]) => it.kind === 'key')];
  }

  private wearers(item: ItemDef): MemberDef[] {
    return this.fighters().filter((m) => canWear(item, m));
  }

  private candidates(): ItemDef[] {
    const m = this.member!;
    return this.bag()
      .map(([it]) => it)
      .filter((it) => it.slot === this.slot && canWear(it, m));
  }

  // ---- Drawing ---------------------------------------------------------------------------------

  private text(x: number, y: number, s: string, color: string = UI.text, wrap?: number): Phaser.GameObjects.Text {
    const t = this.scene.add.text(x, y, s, { fontFamily: UI.font, fontSize: `${UI.fontSizePx}px`, color, lineSpacing: UI.lineSpacingPx });
    if (wrap) t.setWordWrapWidth(wrap, true);
    this.content.add(t);
    return t;
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.content.removeAll(true);
    this.labels = [];
    const g = this.scene.add.graphics();
    this.content.add(g);

    // Tabs.
    let x = 6;
    MENU_TABS.forEach((name, i) => {
      const on = i === this.tab;
      const t = this.text(x, 4, name, on ? UI.accentText : UI.dimText);
      if (on) g.fillStyle(0xf2d04b, 1).fillRect(x, 14, Math.ceil(t.width), 1);
      x += Math.ceil(t.width) + 10;
    });
    this.text(VIEW_WIDTH - 54, 4, '< L / R >', UI.dimText);

    // The purse and the pillars: here (this city) and across the realm.
    const keys = Object.keys(ctx.flags.snapshot());
    const here = cityOf(RPG, ctx.mapId)?.city;
    const pill = (p: (typeof PILLARS)[number]) => {
      const local = here ? localPillar(ctx.flags, RPG, p, here.id) : 0;
      return `${PILLAR_NAMES[p]} ${local}/${globalPillar(ctx.flags, RPG, p, keys)}`;
    };
    this.text(6, 18, `Gold ${gold(ctx.flags, RPG)}   Bag ${bagUsed(ctx.flags, RPG)}/${RPG.bagLimit}   Armies ${armies(ctx.flags, keys)}`, UI.accentText);
    this.text(6, 27, `${PILLARS.map(pill).join('  ')}   (${here ? here.name : 'here'}/realm)`, UI.text);
    g.lineStyle(1, UI.boxBorder, 0.5).lineBetween(4, 36.5, VIEW_WIDTH - 4, 36.5);

    switch (this.currentTab) {
      case 'Status':
        this.drawStatus(g);
        break;
      case 'Items':
        this.drawItems();
        break;
      case 'Equip':
        this.drawEquip();
        break;
      case 'Map':
        this.drawMap(g);
        break;
      case 'Journal':
        this.drawJournal();
        break;
      case 'System':
        this.drawList(ctx.system().map((i) => i.label), this.cursor, 8, TOP + 2);
        break;
    }
  }

  /** A list with a cursor (scrolled so the cursor shows); records the labels for the snapshot. */
  private drawList(labels: string[], cursor: number, x: number, y: number, rows = ROWS, active = true): void {
    if (active) this.labels = labels;
    const first = Math.max(0, Math.min(cursor - rows + 1, labels.length - rows));
    labels.slice(first, first + rows).forEach((l, i) => {
      const on = first + i === cursor;
      this.text(x, y + i * ROW_H, `${on && active ? '>' : ' '} ${l}`, on && active ? UI.accentText : UI.text);
    });
    if (labels.length === 0) this.text(x, y, '  (nothing)', UI.dimText);
  }

  private drawStatus(g: Phaser.GameObjects.Graphics): void {
    const ctx = this.ctx!;
    const party = this.party();
    party.forEach((m, i) => {
      const y = TOP + 2 + i * 28;
      const on = i === this.cursor;
      if (on) g.lineStyle(1, 0xf2d04b, 1).strokeRect(5.5, y - 1.5, 96, 27);
      const key = textureKeyForPortrait(m.portrait);
      if (this.scene.textures.exists(key)) this.content.add(this.scene.add.image(8, y + 1, key).setOrigin(0, 0).setDisplaySize(22, 22));
      this.text(34, y + 2, m.name, on ? UI.accentText : UI.text);
      this.text(34, y + 12, m.support ? 'Support' : `Lv ${level(ctx.flags, m.id)}`, UI.dimText);
    });
    this.labels = party.map((m) => m.name);
    const m = party[this.cursor];
    if (!m) return;
    const X = 112;
    this.text(X, TOP + 2, `${m.name}: ${m.role}`, UI.accentText);
    this.text(X, TOP + 12, `House ${m.house}${m.support ? '' : `   Level ${level(ctx.flags, m.id)}`}`, UI.dimText);
    if (m.support) {
      this.text(X, TOP + 28, 'Spark 0/10   Calm 3/3', UI.text);
      this.text(X, TOP + 42, 'Anissa does not fight. She carries the goddess’s light, and Gianna turns her Spark into Surge.', UI.dimText, 196);
      return;
    }
    const s = stats(ctx.flags, RPG, m);
    const b = baseStats(ctx.flags, m);
    STAT_KEYS.forEach((k, i) => {
      const bonus = s[k] - b[k];
      const col = i % 2;
      const row = Math.floor(i / 2);
      this.text(X + col * 100, TOP + 28 + row * 11, `${STAT_NAMES[k].padEnd(4)}${String(s[k]).padStart(3)}${bonus ? ` (+${bonus})` : ''}`, UI.text);
    });
    SLOTS.forEach((slot, i) => {
      const id = equipped(ctx.flags, m, slot);
      this.text(X, TOP + 66 + i * 11, `${SLOT_NAMES[slot].padEnd(7)} ${id ? RPG.items[id]?.name : '-'}`, id ? UI.text : UI.dimText);
    });
  }

  private drawItems(): void {
    const ctx = this.ctx!;
    const bag = this.bag();
    const labels = bag.map(([it, n]) => (it.kind === 'key' ? `${it.name} (key)` : `${it.name}${n > 1 ? ` x${n}` : ''}`));
    this.drawList(labels, this.cursor, 6, TOP + 2, ROWS, this.stage === 'top');
    const entry = bag[this.cursor];
    const X = 150;
    if (entry) {
      const [it] = entry;
      this.text(X, TOP + 2, it.name, UI.accentText);
      this.text(X, TOP + 12, it.text, UI.dimText, VIEW_WIDTH - X - 8);
      const bits: string[] = [];
      if (it.heals) bits.push(`+${it.heals} HP`);
      if (it.restores) bits.push(`+${it.restores} SP`);
      for (const k of STAT_KEYS) if (it.stats?.[k]) bits.push(`${STAT_NAMES[k]} +${it.stats[k]}`);
      if (it.slot) bits.push(SLOT_NAMES[it.slot]);
      if (it.price) bits.push(`worth ${Math.floor(it.price / 2)} gold`);
      this.text(X, TOP + 62, bits.join('  '), UI.text, VIEW_WIDTH - X - 8);
    }
    if (this.stage === 'who' && this.item) {
      this.text(X, TOP + 84, 'Who wears it?', UI.accentText);
      this.drawList(this.wearers(this.item).map((m) => m.name), this.subCursor, X, TOP + 96, 5);
    }
    this.text(6, VIEW_HEIGHT - 12, `A: use or equip   B: back   Bag ${bagUsed(ctx.flags, RPG)}/${RPG.bagLimit}`, UI.dimText);
  }

  private drawEquip(): void {
    const ctx = this.ctx!;
    const fighters = this.fighters();
    this.drawList(fighters.map((m) => m.name), this.cursor, 6, TOP + 2, ROWS, this.stage === 'top');
    const m = this.stage === 'top' ? fighters[this.cursor] : this.member;
    if (!m) return;
    const X = 96;
    const slotLabels = SLOTS.map((slot) => {
      const id = equipped(ctx.flags, m, slot);
      return `${SLOT_NAMES[slot].padEnd(7)} ${id ? RPG.items[id]?.name : '-'}`;
    });
    this.text(X, TOP + 2, `${m.name}'s gear`, UI.accentText);
    this.drawList(slotLabels, this.stage === 'slot' ? this.subCursor : -1, X, TOP + 14, 3, this.stage === 'slot');
    const s = stats(ctx.flags, RPG, m);
    this.text(X, TOP + 52, STAT_KEYS.map((k) => `${STAT_NAMES[k]} ${s[k]}`).join('  '), UI.dimText, VIEW_WIDTH - X - 8);
    if (this.stage === 'pick' && this.slot) {
      const options = this.candidates();
      const labels = [...options.map((it) => `${it.name}  ${STAT_KEYS.filter((k) => it.stats?.[k]).map((k) => `${STAT_NAMES[k]}+${it.stats![k]}`).join(' ')}`), '(Remove)'];
      this.text(X, TOP + 74, `${SLOT_NAMES[this.slot]} from the bag:`, UI.accentText);
      this.drawList(labels, this.subCursor, X, TOP + 86, 5);
    }
  }

  private drawMap(g: Phaser.GameObjects.Graphics): void {
    const ctx = this.ctx!;
    const found = cityOf(RPG, ctx.mapId);
    this.text(6, VIEW_HEIGHT - 12, `A: ${this.mapView === 'city' ? 'the realm' : 'the city'}`, UI.dimText);
    if (this.mapView === 'realm') return this.drawRealm(g, found?.city.id);
    if (!found) {
      this.text(8, TOP + 4, 'No city map for this place.', UI.dimText);
      return;
    }
    const { city, section } = found;
    this.text(8, TOP + 1, `${city.name} (House ${city.house})`, UI.accentText);
    const cols = Math.max(...city.sections.map((s) => s.box.x + s.box.w));
    const rows = Math.max(...city.sections.map((s) => s.box.y + s.box.h));
    const cw = Math.floor((VIEW_WIDTH - 20) / cols);
    const ch = Math.floor((VIEW_HEIGHT - TOP - 30) / rows);
    const ox = 10;
    const oy = TOP + 12;
    const centre = (map: string) => {
      const b = city.sections.find((s) => s.map === map)!.box;
      return { x: ox + (b.x + b.w / 2) * cw, y: oy + (b.y + b.h / 2) * ch };
    };
    g.lineStyle(2, 0xc8a46b, 0.8);
    for (const [a, b] of city.links) {
      const p = centre(a);
      const q = centre(b);
      g.lineBetween(p.x, p.y, q.x, q.y);
    }
    for (const s of city.sections) {
      const seen = ctx.flags.isSet(visitedFlag(s.map));
      const here = s === section;
      const bx = ox + s.box.x * cw + 1;
      const by = oy + s.box.y * ch + 1;
      const bw = s.box.w * cw - 2;
      const bh = s.box.h * ch - 2;
      g.fillStyle(here ? 0x5a4a1e : seen ? 0x2e3a4a : 0x1e1a24, 1).fillRect(bx, by, bw, bh);
      g.lineStyle(1, here ? 0xf2d04b : seen ? 0xe8d8b0 : 0x6e6a78, 1).strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
      this.text(bx + 3, by + 2, seen || here ? s.name : '???', here ? UI.accentText : seen ? UI.text : UI.dimText, bw - 6);
      if (here) this.text(bx + 3, by + bh - 11, 'You are here', UI.accentText);
    }
    this.labels = city.sections.map((s) => s.name);
  }

  private drawRealm(g: Phaser.GameObjects.Graphics, cityId?: string): void {
    this.text(8, TOP + 1, 'The realm', UI.accentText);
    const x0 = 40;
    const y0 = TOP + 8;
    const w = VIEW_WIDTH - 80;
    const h = VIEW_HEIGHT - TOP - 28;
    const at = (p: { x: number; y: number }) => ({ x: x0 + (p.x / 100) * w, y: y0 + (p.y / 100) * h });
    const ring = RPG.realm.filter((p) => p.id !== 'seat');
    const seat = RPG.realm.find((p) => p.id === 'seat');
    g.lineStyle(1, 0xc8a46b, 0.6);
    ring.forEach((p, i) => {
      const a = at(p);
      const b = at(ring[(i + 1) % ring.length]!);
      g.lineBetween(a.x, a.y, b.x, b.y);
      if (seat) {
        const s = at(seat);
        g.lineBetween(a.x, a.y, s.x, s.y);
      }
    });
    for (const p of RPG.realm) {
      const { x, y } = at(p);
      const here = p.id === cityId;
      g.fillStyle(here ? 0xf2d04b : p.id === 'seat' ? 0xfff2a0 : 0xe8d8b0, 1).fillCircle(x, y, here ? 4 : 3);
      const t = this.text(x, y + 4, p.name, here ? UI.accentText : UI.text);
      t.setX(Math.round(x - t.width / 2));
      if (here) {
        const tag = this.text(x, y - 13, 'You', UI.accentText);
        tag.setX(Math.round(x - tag.width / 2));
      }
    }
    this.labels = RPG.realm.map((p) => p.name);
  }

  private drawJournal(): void {
    const ctx = this.ctx!;
    const lines = ctx.journal().filter((l) => !l.text.startsWith('(B to close)'));
    this.journalLines = lines.map((l) => l.text);
    // Wrap long lines into rows, then show the scrolled window.
    const rows: { text: string; color?: string }[] = [];
    const width = Math.floor((VIEW_WIDTH - 16) / 4.8);
    for (const l of lines) {
      const words = l.text.split(' ');
      let cur = '';
      for (const wd of words) {
        if ((cur + ' ' + wd).trim().length > width) {
          rows.push({ text: cur, color: l.color });
          cur = `  ${wd}`;
        } else cur = cur ? `${cur} ${wd}` : wd;
      }
      rows.push({ text: cur, color: l.color });
    }
    this.scroll = Math.min(this.scroll, Math.max(0, rows.length - ROWS));
    rows.slice(this.scroll, this.scroll + ROWS).forEach((r, i) => this.text(8, TOP + 2 + i * ROW_H, r.text, r.color ?? UI.text));
    if (rows.length > ROWS) this.text(VIEW_WIDTH - 60, VIEW_HEIGHT - 12, 'Up/Down: scroll', UI.dimText);
  }
}
