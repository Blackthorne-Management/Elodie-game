// The full-page menu: tabs for Status (the party and their stats), Items (the bag, with its limit),
// Equip (gear for each member), Map (the city's sections and the realm), Journal, and System (save,
// settings, credits). The top always shows gold on hand and the three pillars, here and realm-wide.
// Rules come from engine/rpg.ts; content from data/rpg.ts. The Field scene runs System choices.

import Phaser from 'phaser';
import { MAP_ART, UI, textureKeyForPortrait } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { ENCOUNTERS } from '../data/encounters.ts';
import { REALM_MAP } from '../data/realmMap.ts';
import { RPG } from '../data/rpg.ts';
import { SIDE_QUESTS } from '../data/sideQuests.ts';
import { encounterFlag } from '../engine/game.ts';
import { rewardText, sideQuestStatus, visibleSteps, type SideQuestDef } from '../engine/sideQuests.ts';
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
  levelBand,
  partyLevel,
  tooHeavy,
  xp,
  xpForLevel,
  localPillar,
  partyMembers,
  stats,
  unequip,
  visitedFlag,
  type CityDef,
  type CitySection,
  type ItemDef,
  type MemberDef,
  type Slot,
} from '../engine/rpg.ts';
import { cityLayout, cityPosition } from '../engine/cityMap.ts';
import { canReplay } from '../engine/showcase.ts';
import type { GameMap, TiledMap } from '../engine/tiledMap.ts';
import type { Era, Pos } from '../engine/types.ts';
import type { InputManager } from '../input/actions.ts';
import type { MenuItem } from './MenuPanel.ts';
import type { PanelLine } from './TextPanel.ts';
import { tileColours } from './tileColours.ts';

export const MENU_TABS = ['Status', 'Items', 'Equip', 'Quests', 'Map', 'Foes', 'System'] as const;
export type MenuTab = (typeof MENU_TABS)[number];

export type MenuRequest = { kind: 'close' } | { kind: 'system'; id: string } | { kind: 'toast'; text: string } | { kind: 'showcase'; id: string };

export interface MenuContext {
  flags: FlagStore;
  mapId: string;
  era: Era;
  journal: () => PanelLine[];
  system: () => MenuItem[];
  /** Every map (the city map is drawn from them), and a map's Tiled data (its tiles). */
  maps: Readonly<Record<string, GameMap>>;
  rawMap: (id: string) => TiledMap | undefined;
  /** The player's tile on the current map. */
  pos: Pos;
}

const CITY_TEXTURE = 'menu-city-map';
const REALM_TEXTURE = 'menu-realm-map';

/** Darken a colour (k < 1). */
function shade(c: number, k: number): number {
  return (Math.round(((c >> 16) & 255) * k) << 16) | (Math.round(((c >> 8) & 255) * k) << 8) | Math.round((c & 255) * k);
}

/** A place not reached yet: greyed and darkened. */
function fog(c: number): number {
  const grey = Math.round((((c >> 16) & 255) + ((c >> 8) & 255) + (c & 255)) / 3);
  const mix = (v: number) => Math.round((v * 0.5 + grey * 0.5) * MAP_ART.fogDim);
  return (mix((c >> 16) & 255) << 16) | (mix((c >> 8) & 255) << 8) | mix(c & 255);
}

/** The tiles on a straight line between two tiles (both ends included). */
function line(a: Pos, b: Pos): Pos[] {
  const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y), 1);
  const out: Pos[] = [];
  for (let i = 0; i <= n; i++) out.push({ x: Math.round(a.x + ((b.x - a.x) * i) / n), y: Math.round(a.y + ((b.y - a.y) * i) / n) });
  return out;
}

const DEPTH = 6000;
const TOP = 38; // content starts under the tabs and the purse
const ROWS = 11; // list rows that fit
const ROW_H = 12;
const PILLAR_NAMES: Record<(typeof PILLARS)[number], string> = { influence: 'Influence', wealth: 'Wealth', fear: 'Fear' };
const STAT_NAMES: Record<(typeof STAT_KEYS)[number], string> = { hp: 'HP', sp: 'SP', atk: 'ATK', def: 'DEF', mag: 'MAG', spd: 'SPD' };
const SLOT_NAMES: Record<Slot, string> = { weapon: 'Weapon', armor: 'Armor', charm: 'Charm' };

type Stage = 'top' | 'who' | 'slot' | 'pick' | 'read';

/** Colours for a level against the party's: grey, white, orange, red. */
const BAND_COLOURS = { trivial: '#8e8e9c', even: '#f4ecd8', hard: '#f0a040', deadly: '#e05050' } as const;

type QuestEntry = { kind: 'main' } | { kind: 'side'; q: SideQuestDef };

/** A tappable area (game pixels) and what a tap there does. */
interface Hit {
  x: number;
  y: number;
  w: number;
  h: number;
  run: () => MenuRequest[];
}

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
  /** Tappable areas of the current page (rebuilt on every draw). */
  private hits: Hit[] = [];
  /** The map page's blinking "you are here" (stopped on every redraw). */
  private blink: Phaser.Tweens.Tween | null = null;

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
    this.blink?.remove();
    this.blink = null;
    this.root.setVisible(false);
    this.ctx = null;
  }

  /** Redraw (labels changed, e.g. the text speed). */
  refresh(): void {
    if (this.visible) this.draw();
  }

  snapshot(): { tab: string; items: string[]; cursor: number; journal: string[] | null } | null {
    if (!this.visible) return null;
    return { tab: this.currentTab, items: [...this.labels], cursor: this.stage === 'top' ? this.cursor : this.subCursor, journal: this.currentTab === 'Quests' ? this.journalLines : null };
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

  /**
   * A tap (or click) at a point in game pixels: tabs switch, a row is selected (tapping the selected
   * row again acts on it, like A), the X closes and Back goes up a step.
   */
  tap(x: number, y: number): MenuRequest[] {
    const ctx = this.ctx;
    if (!ctx) return [];
    const hit = [...this.hits].reverse().find((h) => x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h);
    if (!hit) return [];
    const out = hit.run();
    if (this.visible) this.draw();
    return out;
  }

  private hit(x: number, y: number, w: number, h: number, run: () => MenuRequest[] | void): void {
    this.hits.push({ x, y, w, h, run: () => run() ?? [] });
  }

  /** A tap on a row of the main list: select it, or act on it when it is already selected. */
  private tapTop(i: number): MenuRequest[] {
    if (this.stage !== 'top') {
      this.stage = 'top';
      this.cursor = i;
      return [];
    }
    if (this.cursor === i) return this.confirm(this.ctx!);
    this.cursor = i;
    return [];
  }

  /** A tap on a row of a sub-list (who wears it, a slot, an item for a slot). */
  private tapSub(i: number): MenuRequest[] {
    if (this.subCursor === i) return this.confirm(this.ctx!);
    this.subCursor = i;
    return [];
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
    else if (this.stage === 'slot' || this.stage === 'who' || this.stage === 'read') this.stage = 'top';
    this.scroll = 0;
    this.subCursor = 0;
  }

  private move(delta: number): void {
    if (this.stage === 'read') {
      this.scroll = Math.max(0, this.scroll + delta); // clamped when drawn
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
      case 'Quests':
        return this.questEntries().length;
      case 'Foes':
        return this.foes().length;
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
          // Story and legendary items: show the item again, with every ability learned so far.
          if (canReplay(it)) return [{ kind: 'showcase', id: it.id }];
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
      case 'Quests':
        // A: read the whole entry (up / down scroll it; B goes back to the list).
        if (this.stage === 'top') {
          this.stage = 'read';
          this.scroll = 0;
        }
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
    this.blink?.remove();
    this.blink = null;
    this.content.removeAll(true);
    this.labels = [];
    this.hits = [];
    const g = this.scene.add.graphics();
    this.content.add(g);

    // Tabs (tap one to open it), and the X that closes the menu.
    let x = 6;
    MENU_TABS.forEach((name, i) => {
      const on = i === this.tab;
      const t = this.text(x, 4, name, on ? UI.accentText : UI.dimText);
      if (on) g.fillStyle(0xf2d04b, 1).fillRect(x, 14, Math.ceil(t.width), 1);
      this.hit(x - 4, 0, Math.ceil(t.width) + 8, 16, () => {
        this.tab = i;
        this.resetTab();
      });
      x += Math.ceil(t.width) + 8;
    });
    this.text(VIEW_WIDTH - 12, 4, 'X', UI.text);
    this.hit(VIEW_WIDTH - 20, 0, 20, 16, () => [{ kind: 'close' }]);
    if (this.stage !== 'top') {
      this.text(VIEW_WIDTH - 40, VIEW_HEIGHT - 12, '< Back', UI.accentText);
      this.hit(VIEW_WIDTH - 46, VIEW_HEIGHT - 16, 46, 16, () => this.back());
    }

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
      case 'Quests':
        this.drawQuests();
        break;
      case 'Foes':
        this.drawFoes();
        break;
      case 'System':
        this.drawList(ctx.system().map((i) => i.label), this.cursor, 8, TOP + 2);
        break;
    }
  }

  /** A list with a cursor (scrolled so the cursor shows); records the labels for the snapshot. */
  /**
   * A list with a cursor (scrolled so the cursor shows); records the labels for the snapshot. Rows are
   * tappable: `onTap` (default: the main list's select-then-act); arrows scroll a list too long to show.
   */
  private drawList(labels: string[], cursor: number, x: number, y: number, rows = ROWS, active = true, onTap?: (i: number) => MenuRequest[]): void {
    if (active) this.labels = labels;
    const first = Math.max(0, Math.min(cursor - rows + 1, labels.length - rows));
    const tap = onTap ?? ((i: number) => this.tapTop(i));
    labels.slice(first, first + rows).forEach((l, i) => {
      const on = first + i === cursor;
      const t = this.text(x, y + i * ROW_H, `${on && active ? '>' : ' '} ${l}`, on && active ? UI.accentText : UI.text);
      this.hit(x - 2, y + i * ROW_H - 1, Math.max(60, Math.ceil(t.width) + 6), ROW_H, () => tap(first + i));
    });
    if (labels.length === 0) this.text(x, y, '  (nothing)', UI.dimText);
    if (labels.length > rows && active) {
      const ax = x + Math.max(...labels.map((l) => l.length)) * 4.8 + 14;
      this.text(ax, y, '▲', UI.accentText);
      this.text(ax, y + (rows - 1) * ROW_H, '▼', UI.accentText);
      this.hit(ax - 4, y - 2, 16, 16, () => this.move(-1));
      this.hit(ax - 4, y + (rows - 1) * ROW_H - 2, 16, 16, () => this.move(1));
    }
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
      this.text(34, y + 12, m.support ? 'Support' : `Lv ${level(ctx.flags, RPG, m.id)}`, UI.dimText);
      this.hit(5, y - 2, 98, 28, () => {
        this.cursor = i;
      });
    });
    this.labels = party.map((m) => m.name);
    const m = party[this.cursor];
    if (!m) return;
    const X = 112;
    this.text(X, TOP + 2, `${m.name}: ${m.role}`, UI.accentText);
    const lv = level(ctx.flags, RPG, m.id);
    const next = lv < RPG.levels.cap ? `   XP ${xp(ctx.flags, RPG, m.id)}/${xpForLevel(RPG, lv + 1)}` : '   Max level';
    this.text(X, TOP + 12, `House ${m.house}${m.support ? '' : `   Level ${lv}${next}`}`, UI.dimText);
    if (m.support) {
      this.text(X, TOP + 28, 'Spark 0/10   Calm 3/3', UI.text);
      this.text(X, TOP + 42, 'Anissa does not fight. She carries the goddess’s light, and Gianna turns her Spark into Surge.', UI.dimText, 196);
      return;
    }
    const s = stats(ctx.flags, RPG, m);
    const b = baseStats(ctx.flags, RPG, m);
    STAT_KEYS.forEach((k, i) => {
      const bonus = s[k] - b[k];
      const col = i % 2;
      const row = Math.floor(i / 2);
      this.text(X + col * 100, TOP + 28 + row * 11, `${STAT_NAMES[k].padEnd(4)}${String(s[k]).padStart(3)}${bonus ? ` (+${bonus})` : ''}`, UI.text);
    });
    SLOTS.forEach((slot, i) => {
      const id = equipped(ctx.flags, m, slot);
      const it = id ? RPG.items[id] : undefined;
      const heavy = it ? tooHeavy(ctx.flags, RPG, m, it) : false;
      this.text(X, TOP + 66 + i * 11, `${SLOT_NAMES[slot].padEnd(7)} ${it ? it.name : '-'}${heavy ? ' (too heavy)' : ''}`, heavy ? BAND_COLOURS.hard : it ? UI.text : UI.dimText);
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
      if (it.slot) bits.push(`${SLOT_NAMES[it.slot]} Lv ${it.level ?? 1}`);
      if (it.price) bits.push(`worth ${Math.floor(it.price / 2)} gold`);
      this.text(X, TOP + 62, bits.join('  '), UI.text, VIEW_WIDTH - X - 8);
    }
    if (this.stage === 'who' && this.item) {
      this.text(X, TOP + 84, 'Who wears it?', UI.accentText);
      this.drawList(this.wearers(this.item).map((m) => m.name), this.subCursor, X, TOP + 96, 5, true, (i) => this.tapSub(i));
    }
    this.text(6, VIEW_HEIGHT - 12, `A: use, equip or view   B: back   Bag ${bagUsed(ctx.flags, RPG)}/${RPG.bagLimit}`, UI.dimText);
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
    // Tapping a slot opens it straight away (from the member list too).
    this.drawList(slotLabels, this.stage === 'slot' ? this.subCursor : -1, X, TOP + 14, 3, this.stage === 'slot', (i) => {
      if (this.stage === 'slot' && this.subCursor === i) return this.confirm(this.ctx!);
      this.member = m;
      this.stage = 'slot';
      this.subCursor = i;
      return this.confirm(this.ctx!);
    });
    const s = stats(ctx.flags, RPG, m);
    this.text(X, TOP + 52, STAT_KEYS.map((k) => `${STAT_NAMES[k]} ${s[k]}`).join('  '), UI.dimText, VIEW_WIDTH - X - 8);
    if (this.stage === 'pick' && this.slot) {
      const options = this.candidates();
      const labels = [
        ...options.map((it) => {
          const heavy = tooHeavy(ctx.flags, RPG, m, it);
          const bonus = STAT_KEYS.filter((k) => it.stats?.[k]).map((k) => `${STAT_NAMES[k]}+${it.stats![k]}`).join(' ');
          return `${it.name} Lv${it.level ?? 1}${heavy ? ' (heavy: half)' : ''}  ${bonus}`;
        }),
        '(Remove)',
      ];
      this.text(X, TOP + 74, `${SLOT_NAMES[this.slot]} from the bag:`, UI.accentText);
      this.drawList(labels, this.subCursor, X, TOP + 86, 5, true, (i) => this.tapSub(i));
    }
  }

  private drawMap(g: Phaser.GameObjects.Graphics): void {
    const ctx = this.ctx!;
    const found = cityOf(RPG, ctx.mapId);
    this.text(6, VIEW_HEIGHT - 12, `A or tap: ${this.mapView === 'city' ? 'the realm' : 'the city'}`, UI.dimText);
    this.hit(0, TOP, VIEW_WIDTH - 50, VIEW_HEIGHT - TOP, () => {
      this.mapView = this.mapView === 'city' ? 'realm' : 'city';
    });
    if (this.mapView === 'realm') return this.drawRealm(g, found?.city.id);
    if (!found) {
      this.text(8, TOP + 4, 'No city map for this place.', UI.dimText);
      return;
    }
    this.drawCity(g, found.city, found.section);
  }

  /** A blinking "you are here" marker (a square of `size` px with a dark rim). */
  private marker(x: number, y: number, size: number): void {
    const m = this.scene.add.rectangle(x, y, size, size, MAP_ART.here).setStrokeStyle(1, MAP_ART.hereRim);
    this.content.add(m);
    this.blink = this.scene.tweens.add({ targets: m, alpha: 0.15, duration: 420, yoyo: true, repeat: -1 });
  }

  /** A canvas texture drawn pixel by pixel (replacing any older one with the key). */
  private pixels(key: string, w: number, h: number, paint: (img: ImageData) => void): void {
    if (this.scene.textures.exists(key)) this.scene.textures.remove(key);
    const tex = this.scene.textures.createCanvas(key, w, h)!;
    const c = tex.getContext();
    const img = c.createImageData(w, h);
    paint(img);
    c.putImageData(img, 0, 0);
    tex.refresh();
  }

  /** The city: its outdoor sections drawn from their real tiles, buildings at their doors, paths between. */
  private drawCity(g: Phaser.GameObjects.Graphics, city: CityDef, section: CitySection): void {
    const ctx = this.ctx!;
    this.text(8, TOP + 1, `${city.name} (House ${city.house})`, UI.accentText);
    const layout = cityLayout(city, ctx.maps);
    const seen = (map: string) => map === section.map || ctx.flags.isSet(visitedFlag(map));
    const W = layout.width;
    this.pixels(CITY_TEXTURE, W, layout.height, (img) => {
      const put = (x: number, y: number, c: number) => {
        if (x < 0 || y < 0 || x >= W || y >= layout.height) return;
        const i = (y * W + x) * 4;
        img.data[i] = (c >> 16) & 255;
        img.data[i + 1] = (c >> 8) & 255;
        img.data[i + 2] = c & 255;
        img.data[i + 3] = 255;
      };
      for (let y = 0; y < layout.height; y++) for (let x = 0; x < W; x++) put(x, y, (x + y * 3) % 11 ? MAP_ART.sea : MAP_ART.seaLight);
      for (const c of layout.connectors) for (const p of line(c.from, c.to)) put(p.x, p.y, MAP_ART.path);
      for (const s of layout.sections) {
        const raw = ctx.rawMap(s.map);
        const map = ctx.maps[s.map];
        if (!raw || !map) continue;
        const colours = tileColours(map, raw, 'present');
        const known = seen(s.map);
        for (let y = 0; y < s.h; y++) {
          for (let x = 0; x < s.w; x++) {
            const c = parseInt(colours[y * s.w + x]!.slice(1), 16);
            put(s.x + x, s.y + y, known ? c : fog(c));
          }
        }
      }
    });
    // Scale to fit (whole pixels), on the left; the legend on the right.
    const areaW = 200;
    const areaH = VIEW_HEIGHT - TOP - 28;
    const k = Math.max(1, Math.floor(Math.min(areaW / W, areaH / layout.height)));
    const ox = 6 + Math.floor((areaW - W * k) / 2);
    const oy = TOP + 13;
    this.content.add(this.scene.add.image(ox, oy, CITY_TEXTURE).setOrigin(0).setScale(k));
    g.lineStyle(1, UI.boxBorder, 0.7).strokeRect(ox - 1.5, oy - 1.5, W * k + 3, layout.height * k + 3);

    // Section names on the map; buildings as numbered markers.
    for (const s of layout.sections) {
      const known = seen(s.map);
      const t = this.text(0, 0, known ? s.name : '???', known ? UI.text : UI.dimText).setStroke(MAP_ART.labelStroke, 3);
      t.setPosition(Math.round(ox + (s.x + s.w / 2) * k - t.width / 2), Math.round(oy + (s.y + s.h / 2) * k - t.height / 2));
    }
    const LX = ox + W * k + 10;
    let ly = TOP + 13;
    layout.buildings.forEach((b, i) => {
      const known = seen(b.map);
      const bx = ox + b.pos.x * k + k / 2;
      const by = oy + b.pos.y * k + k / 2;
      g.fillStyle(MAP_ART.labelBack, 1).fillRect(bx - 4, by - 9, 9, 9);
      g.fillStyle(known ? MAP_ART.building : MAP_ART.fogBuilding, 1).fillRect(bx - 3, by - 8, 7, 7);
      const n = this.text(0, 0, String(i + 1), MAP_ART.buildingText);
      n.setPosition(Math.round(bx - n.width / 2 + 0.5), Math.round(by - 9));
      ly += this.text(LX, ly, `${i + 1} ${known ? b.name : '???'}`, known ? UI.text : UI.dimText, VIEW_WIDTH - LX - 6).height + 3;
    });
    ly += 6;
    this.text(LX, ly, 'You are here:', UI.accentText);
    this.text(LX, ly + 10, section.name, UI.text, VIEW_WIDTH - LX - 6);
    const here = cityPosition(layout, ctx.mapId, ctx.pos);
    if (here) this.marker(ox + here.x * k + k / 2, oy + here.y * k + k / 2, Math.max(3, k + 1));
    this.labels = city.sections.map((s) => s.name);
  }

  /** The realm, shaped like the board game's map (data/realmMap.ts). */
  private drawRealm(g: Phaser.GameObjects.Graphics, cityId?: string): void {
    const ctx = this.ctx!;
    const M = REALM_MAP;
    const placeAt = (x: number, y: number): string => (x < 0 || y < 0 || x >= M.width || y >= M.height ? 'sea' : M.key[M.rows[y]![x]!]!);
    const current = RPG.realm.find((p) => p.city && p.city === cityId)?.id;
    const visited = (id: string) =>
      id === current || (RPG.realm.find((p) => p.id === id)?.city ? (RPG.cities[RPG.realm.find((p) => p.id === id)!.city!]?.sections ?? []).some((s) => ctx.flags.isSet(visitedFlag(s.map))) : false);
    const known = new Map(RPG.realm.map((p) => [p.id, visited(p.id)]));
    this.pixels(REALM_TEXTURE, M.width, M.height, (img) => {
      for (let y = 0; y < M.height; y++) {
        for (let x = 0; x < M.width; x++) {
          const id = placeAt(x, y);
          let c: number;
          if (id === 'sea') {
            const coast = ['sea', placeAt(x + 1, y), placeAt(x - 1, y), placeAt(x, y + 1), placeAt(x, y - 1)].some((n) => n !== 'sea');
            c = coast ? MAP_ART.foam : (x * 7 + y * 3) % 23 === 0 ? MAP_ART.seaLight : M.colours.sea!;
          } else {
            c = M.colours[id]!;
            const n = [placeAt(x + 1, y), placeAt(x - 1, y), placeAt(x, y + 1), placeAt(x, y - 1)];
            if (n.some((o) => o === 'sea')) c = shade(c, 0.62);
            else if (n.some((o) => o !== id)) c = shade(c, 0.45);
            if (!known.get(id)) c = fog(c);
          }
          const i = (y * M.width + x) * 4;
          img.data[i] = (c >> 16) & 255;
          img.data[i + 1] = (c >> 8) & 255;
          img.data[i + 2] = c & 255;
          img.data[i + 3] = 255;
        }
      }
    });
    const ox = 6;
    const oy = TOP + 1;
    this.content.add(this.scene.add.image(ox, oy, REALM_TEXTURE).setOrigin(0));

    // Capitals, the Throne, and each country's name.
    for (const [id, p] of Object.entries(M.capitals)) {
      if (id === 'seat') {
        g.fillStyle(MAP_ART.throneRing, 1).fillCircle(ox + p.x + 0.5, oy + p.y + 0.5, 5);
        g.fillStyle(MAP_ART.throne, 1).fillCircle(ox + p.x + 0.5, oy + p.y + 0.5, 4);
      } else {
        g.fillStyle(MAP_ART.labelBack, 1).fillRect(ox + p.x - 1, oy + p.y - 1, 3, 3);
        g.fillStyle(MAP_ART.capital, 1).fillRect(ox + p.x, oy + p.y, 1, 1);
      }
    }
    for (const place of RPG.realm) {
      if (place.id === 'seat') continue;
      const at = M.labels[place.id]!;
      const t = this.text(0, 0, place.name, known.get(place.id) ? UI.text : UI.dimText).setStroke(MAP_ART.labelStroke, 3);
      t.setPosition(Math.round(ox + at.x - t.width / 2), Math.round(oy + at.y - t.height - 2));
    }
    // The legend: every place and its house; the one you are in, marked.
    const LX = ox + M.width + 8;
    this.text(LX, TOP + 1, 'The realm', UI.accentText);
    RPG.realm.forEach((place, i) => {
      const y = TOP + 14 + i * 12;
      const here = place.id === current;
      g.fillStyle(MAP_ART.labelBack, 1).fillRect(LX, y + 1, 8, 8);
      g.fillStyle(M.colours[place.id] ?? 0xffffff, 1).fillRect(LX + 1, y + 2, 6, 6);
      this.text(LX + 12, y, `${place.name} · ${place.house}${here ? '  (here)' : ''}`, here ? UI.accentText : known.get(place.id) ? UI.text : UI.dimText);
    });
    const cap = current ? M.capitals[current] : undefined;
    if (cap) this.marker(ox + cap.x + 0.5, oy + cap.y + 0.5, 5);
    this.labels = RPG.realm.map((p) => p.name);
  }

  // ---- Quests and foes -----------------------------------------------------------------------

  /** The main quest, then side quests in progress, then finished ones. */
  private questEntries(): QuestEntry[] {
    const flags = this.ctx!.flags;
    const active = SIDE_QUESTS.filter((q) => sideQuestStatus(flags, q) === 'active');
    const done = SIDE_QUESTS.filter((q) => sideQuestStatus(flags, q) === 'done');
    return [{ kind: 'main' }, ...active.map((q) => ({ kind: 'side' as const, q })), ...done.map((q) => ({ kind: 'side' as const, q }))];
  }

  private questLines(e: QuestEntry): PanelLine[] {
    const ctx = this.ctx!;
    if (e.kind === 'main') return ctx.journal();
    const q = e.q;
    const done = sideQuestStatus(ctx.flags, q) === 'done';
    const band = levelBand(RPG, partyLevel(ctx.flags, RPG, ctx.era), q.level);
    const lines: PanelLine[] = [
      { text: q.title, color: UI.accentText },
      { text: `${q.giver}, ${q.place}`, color: UI.dimText },
      { text: `Level ${q.level}`, color: BAND_COLOURS[band] },
      { text: q.summary, gap: 4 },
    ];
    for (const s of visibleSteps(ctx.flags, q)) lines.push({ text: `${s.done ? '[x]' : '[ ]'} ${s.text}`, color: s.done ? UI.doneText : UI.text });
    lines.push({ text: `Reward: ${rewardText(q, RPG)}`, color: done ? UI.doneText : UI.dimText, gap: 4 });
    return lines;
  }

  /** Wrap panel lines into rows of at most `chars` characters. */
  private wrap(lines: PanelLine[], chars: number): { text: string; color?: string }[] {
    const rows: { text: string; color?: string }[] = [];
    for (const l of lines) {
      let cur = '';
      for (const wd of l.text.split(' ')) {
        if (cur && `${cur} ${wd}`.length > chars) {
          rows.push({ text: cur, color: l.color });
          cur = `  ${wd}`;
        } else cur = cur ? `${cur} ${wd}` : wd;
      }
      rows.push({ text: cur, color: l.color });
    }
    return rows;
  }

  private drawQuests(): void {
    const entries = this.questEntries();
    const flags = this.ctx!.flags;
    const labels = entries.map((e) => (e.kind === 'main' ? 'Main: Chapter 1' : `${sideQuestStatus(flags, e.q) === 'done' ? '[x] ' : ''}${e.q.title}`));
    this.drawList(labels, this.cursor, 6, TOP + 2, ROWS, this.stage === 'top');
    if (SIDE_QUESTS.every((q) => sideQuestStatus(flags, q) === 'unknown')) this.text(6, TOP + 2 + 2 * ROW_H, '  No side quests yet.', UI.dimText);
    const e = entries[this.cursor] ?? entries[0]!;
    const lines = this.questLines(e).filter((l) => !l.text.startsWith('(B to close)'));
    this.journalLines = lines.map((l) => l.text);
    const X = 112;
    const rows = this.wrap(lines, Math.floor((VIEW_WIDTH - X - 6) / 4.8));
    const fit = ROWS + 1;
    this.scroll = Math.min(this.scroll, Math.max(0, rows.length - fit));
    rows.slice(this.scroll, this.scroll + fit).forEach((r, i) => this.text(X, TOP + 2 + i * ROW_H, r.text, r.color ?? UI.text));
    // Tap the entry to read it; while reading, tap its top or bottom half to scroll.
    const half = (fit * ROW_H) / 2;
    this.hit(X - 4, TOP, VIEW_WIDTH - X, half, () => {
      if (this.stage !== 'read') this.stage = 'read';
      else this.move(-3);
    });
    this.hit(X - 4, TOP + half, VIEW_WIDTH - X, half, () => {
      if (this.stage !== 'read') this.stage = 'read';
      else this.move(3);
    });
    const hint = this.stage === 'read' ? 'Up/Down or tap: scroll' : 'A or tap: read';
    this.text(6, VIEW_HEIGHT - 12, hint, UI.dimText);
  }

  /** Every group of foes met (won or fled), with its level against the party's. */
  private foes(): { name: string; level: number; place: string; won: boolean }[] {
    const flags = this.ctx!.flags;
    const out: { name: string; level: number; place: string; won: boolean }[] = [];
    for (const t of Object.values(ENCOUNTERS)) {
      for (const g of t.groups) {
        const won = flags.isSet(encounterFlag(t.id, g.id, 'won'));
        if (!won && !flags.isSet(encounterFlag(t.id, g.id, 'fled'))) continue;
        const counts = new Map<string, number>();
        for (const f of g.foes) counts.set(f, (counts.get(f) ?? 0) + 1);
        out.push({ name: [...counts].map(([n, c]) => (c > 1 ? `${n} x${c}` : n)).join(', '), level: g.level, place: t.id.replace(/_/g, ' '), won });
      }
    }
    return out;
  }

  private drawFoes(): void {
    const ctx = this.ctx!;
    const foes = this.foes();
    const yours = partyLevel(ctx.flags, RPG, ctx.era);
    this.text(6, TOP + 2, `Your party: level ${yours}.  Grey easy, white even, orange hard, red deadly.`, UI.dimText, VIEW_WIDTH - 12);
    this.labels = foes.map((f) => f.name);
    if (foes.length === 0) {
      this.text(6, TOP + 26, 'No foes met yet. (Chapter 1 is peaceful.)', UI.dimText);
      return;
    }
    const first = Math.max(0, Math.min(this.cursor - 8, foes.length - 9));
    foes.slice(first, first + 9).forEach((f, i) => {
      const on = first + i === this.cursor;
      const colour = BAND_COLOURS[levelBand(RPG, yours, f.level)];
      this.text(6, TOP + 26 + i * ROW_H, `${on ? '>' : ' '} Lv ${String(f.level).padStart(2)}  ${f.name}`, on ? UI.accentText : colour);
      this.hit(4, TOP + 25 + i * ROW_H, VIEW_WIDTH - 8, ROW_H, () => {
        this.cursor = first + i;
      });
      this.text(VIEW_WIDTH - 90, TOP + 26 + i * ROW_H, f.won ? 'beaten' : 'escaped', UI.dimText);
    });
  }
}
