// The battle screen (engine/battle.ts has the rules). Drawn over the paused field at the same render
// scale: the enemy on the left, Gianna on the right with Anissa behind her (glowing as her Spark grows),
// the turn order along the top, and a command panel at the bottom (Attack, Skill, Guard, Item, and
// Surge when Anissa is ready). Events play one at a time with damage numbers; Anissa's tips come as
// lines from her. Winning shows the rewards; losing restarts the fight with a Grudge (The Heir Rises).
// Keys, gamepad, the touch buttons and taps all work.

import Phaser from 'phaser';
import { BATTLE_ART, ANISSA_GLOW, UI, characterFrame, textureKeyForCharacter, textureKeyForEnemy } from '../assets.config.ts';
import { SPARK_MAX, SURGE_COST, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { BATTLES, ENEMIES, SKILLS } from '../data/battles.ts';
import { RPG } from '../data/rpg.ts';
import { Battle, battleItems, battleParty, settleBattle, skillCost, type Action, type BattleEvent, type BattleResult, type Combatant } from '../engine/battle.ts';
import { getRuntime } from '../runtime.ts';
import { renderScale, textStyle } from '../ui/text.ts';

type Menu = 'commands' | 'skills' | 'items';

interface Row {
  label: string;
  enabled: boolean;
  run: () => void;
}

export interface BattleSnapshot {
  id: string;
  outcome: 'won' | 'lost' | null;
  actor: string | null;
  menu: Menu;
  rows: string[];
  cursor: number;
  enemyHp: number;
  hp: number;
  sp: number;
  spark: number;
  message: string;
  busy: boolean;
  done: boolean;
}

let current: BattleScene | null = null;

function setCurrent(scene: BattleScene | null): void {
  current = scene;
}

/** The battle on screen, for the test hook (null when there is none). */
export function battleSnapshot(): BattleSnapshot | null {
  return current?.snapshot() ?? null;
}

const PANEL_Y = 124;

export class BattleScene extends Phaser.Scene {
  private battle!: Battle;
  private battleId = '';
  private menu: Menu = 'commands';
  private cursor = 0;
  private rows: Row[] = [];
  private queue: BattleEvent[] = [];
  private busy = false;
  private message = '';
  private done = false;
  private result: BattleResult | null = null;
  private sprites = new Map<string, Phaser.GameObjects.Image>();
  private anissa: Phaser.GameObjects.Image | null = null;
  private anissaLight: Phaser.GameObjects.Arc | null = null;
  private ui!: Phaser.GameObjects.Container;
  private messageText!: Phaser.GameObjects.Text;
  private seed = 1;

  constructor() {
    super('battle');
  }

  init(data: { battle: string }): void {
    this.battleId = data.battle;
    this.menu = 'commands';
    this.cursor = 0;
    this.queue = [];
    this.busy = false;
    this.done = false;
    this.result = null;
    this.message = '';
    this.sprites = new Map();
  }

  create(): void {
    setCurrent(this);
    const cam = this.cameras.main;
    cam.setOrigin(0, 0).setZoom(renderScale());
    this.seed = (Date.now() >>> 0) || 1;
    this.drawBackdrop();
    this.ui = this.add.container(0, 0).setDepth(100);
    this.messageText = this.add.text(VIEW_WIDTH / 2, PANEL_Y - 16, '', textStyle(UI.text, { align: 'center' })).setOrigin(0.5, 0).setDepth(200);
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onTap(p));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (current === this) setCurrent(null);
    });
    this.begin();
  }

  // ---- The fight ----------------------------------------------------------------------------------

  private begin(retryOf?: Battle): void {
    const rt = getRuntime();
    const flags = rt.logic.state.flags;
    const def = BATTLES[this.battleId];
    if (!def) throw new Error(`No battle ${this.battleId}`);
    const party = battleParty(flags, RPG, SKILLS);
    const enemies = def.enemies.map((id) => ENEMIES[id]!).filter(Boolean);
    const items = battleItems(flags, RPG);
    this.seed = (this.seed * 1103515245 + 12345) >>> 0;
    this.battle = retryOf ? Battle.retry(retryOf, party, enemies, items, this.seed) : new Battle(def, party, enemies, items, { seed: this.seed });
    this.placeFighters();
    this.play(this.battle.start());
  }

  private act(action: Action): void {
    if (this.busy || this.done) return;
    this.menu = 'commands';
    this.cursor = 0;
    this.play(this.battle.act(action));
  }

  /** Show events one by one, then hand control back to the player. */
  private play(events: BattleEvent[]): void {
    this.queue.push(...events);
    if (!this.busy) this.next();
  }

  private next(): void {
    const e = this.queue.shift();
    if (!e) {
      this.busy = false;
      this.redraw();
      return;
    }
    this.busy = true;
    const wait = this.show(e);
    this.redraw();
    this.time.delayedCall(wait, () => this.next());
  }

  /** Draw one event; returns how long to wait before the next. */
  private show(e: BattleEvent): number {
    const name = (key: string) => this.battle.find(key)?.name ?? key;
    switch (e.kind) {
      case 'turn':
        return 0;
      case 'text':
        this.say(e.speaker ? `${e.speaker}: ${e.text}` : e.text);
        return BATTLE_ART.messageMs * (e.speaker ? 1.6 : 1.1);
      case 'damage': {
        this.say(`${name(e.from)}: ${e.move}!${e.surge ? ' (Surge)' : ''}${e.crit ? ' A critical hit!' : ''}`);
        this.pop(e.to, String(e.amount), e.crit ? BATTLE_ART.crit : BATTLE_ART.hit);
        this.flash(e.to);
        return BATTLE_ART.messageMs;
      }
      case 'miss':
        this.say(`${name(e.from)}: ${e.move}... it misses.`);
        this.pop(e.to, 'miss', UI.dimText);
        return BATTLE_ART.messageMs;
      case 'heal': {
        const bits = [e.hp ? `+${e.hp} HP` : '', e.sp ? `+${e.sp} SP` : ''].filter(Boolean).join(' ');
        this.say(e.source === "Anissa's Light" ? `Anissa's light warms Gianna. ${bits}` : `${e.source}: ${name(e.to)} ${bits}`);
        this.pop(e.to, bits, BATTLE_ART.heal);
        return BATTLE_ART.messageMs;
      }
      case 'guard':
        this.say(`${name(e.who)} guards.`);
        return BATTLE_ART.messageMs * 0.7;
      case 'spark':
        return 0;
      case 'surge':
        this.cameras.main.flash(250, 255, 242, 160);
        return 300;
      case 'down':
        this.say(`${name(e.who)} falls!`);
        this.sprites.get(e.who)?.setAlpha(0.3);
        return BATTLE_ART.messageMs;
      case 'won':
        this.win();
        return 0;
      case 'lost':
        this.lose();
        return 0;
    }
  }

  private win(): void {
    const flags = getRuntime().logic.state.flags;
    this.result = settleBattle(flags, RPG, this.battle);
    this.done = true;
    const items = this.result.items.map((i) => RPG.items[i.id]?.name ?? i.id).join(', ');
    this.say(`Victory!  +${this.result.xp} XP  +${this.result.gold} gold${items ? `  ${items}` : ''}`);
  }

  private lose(): void {
    // The Heir Rises: never a game over; the fight starts again with a Grudge.
    this.queue.push({ kind: 'text', text: 'Gigi! Get up! Please!', speaker: 'Anissa' }, { kind: 'text', text: 'Gianna rises. "Again. For them."' });
    this.time.delayedCall(BATTLE_ART.messageMs * 3.5, () => {
      this.queue = [];
      for (const s of this.sprites.values()) s.destroy();
      this.sprites.clear();
      this.begin(this.battle);
    });
  }

  /** Leave: back to the field, which shows the rewards and saves. */
  private finish(): void {
    const field = this.scene.get('field');
    this.scene.stop();
    this.scene.resume('field');
    field.events.emit('battle-done', this.result);
  }

  // ---- Commands -----------------------------------------------------------------------------------

  private commandRows(): Row[] {
    const b = this.battle;
    const me = b.actor;
    if (!me || me.side !== 'party') return [];
    const foe = b.enemies.find((e) => !e.down);
    const ally = b.party.filter((p) => !p.down).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]!;
    if (this.menu === 'skills') {
      return [
        ...me.skills.map((s) => {
          const cost = skillCost(s, me);
          return {
            label: `${s.name}  ${cost} SP`,
            enabled: me.sp >= cost,
            run: () => this.act({ kind: 'skill', skill: s.id, target: s.kind === 'heal' ? ally.key : foe!.key }),
          };
        }),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    if (this.menu === 'items') {
      return [
        ...b.items
          .filter((i) => i.count > 0)
          .map((i) => ({ label: `${i.name} x${i.count}`, enabled: true, run: () => this.act({ kind: 'item', item: i.id, target: ally.key }) })),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    const rows: Row[] = [
      { label: 'Attack', enabled: !!foe, run: () => this.act({ kind: 'attack', target: foe!.key }) },
      { label: 'Skill', enabled: me.skills.length > 0, run: () => this.openMenu('skills') },
      { label: 'Guard', enabled: true, run: () => this.act({ kind: 'guard' }) },
      { label: 'Item', enabled: b.items.some((i) => i.count > 0), run: () => this.openMenu('items') },
    ];
    if (b.canSurge()) rows.unshift({ label: 'Surge', enabled: true, run: () => this.act({ kind: 'surge' }) });
    return rows;
  }

  private openMenu(menu: Menu): void {
    this.menu = menu;
    this.cursor = 0;
    this.redraw();
  }

  update(): void {
    const input = getRuntime().input;
    input.update();
    if (this.done) {
      if (!this.busy && (input.pressed('confirm') || input.pressed('cancel'))) this.finish();
      return;
    }
    if (this.busy) return;
    const n = this.rows.length;
    if (n === 0) return;
    if (input.pressed('up')) this.moveCursor(-1);
    if (input.pressed('down')) this.moveCursor(1);
    if (input.pressed('cancel') && this.menu !== 'commands') this.openMenu('commands');
    else if (input.pressed('confirm')) {
      const row = this.rows[this.cursor];
      if (row?.enabled) row.run();
    }
  }

  private moveCursor(d: number): void {
    const n = this.rows.length;
    this.cursor = (this.cursor + d + n) % n;
    this.redraw();
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    const k = renderScale();
    const x = pointer.x / k;
    const y = pointer.y / k;
    if (this.done) {
      if (!this.busy) this.finish();
      return;
    }
    if (this.busy) return;
    const i = this.rows.findIndex((_, r) => this.rowHit(r, x, y));
    if (i < 0) return;
    this.cursor = i;
    const row = this.rows[i]!;
    if (row.enabled) row.run();
    else this.redraw();
  }

  private rowRect(i: number): { x: number; y: number; w: number; h: number } {
    const col = Math.floor(i / 3);
    return { x: 186 + col * 66, y: PANEL_Y + 6 + (i % 3) * 16, w: 64, h: 15 };
  }

  private rowHit(i: number, x: number, y: number): boolean {
    const r = this.rowRect(i);
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  }

  // ---- Drawing ------------------------------------------------------------------------------------

  private drawBackdrop(): void {
    const g = this.add.graphics();
    g.fillStyle(BATTLE_ART.panel, 1).fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    g.fillStyle(BATTLE_ART.sky, 1).fillRect(0, 0, VIEW_WIDTH, 70);
    g.fillStyle(BATTLE_ART.ground, 1).fillRect(0, 70, VIEW_WIDTH, PANEL_Y - 70);
    g.fillStyle(BATTLE_ART.groundDark, 1).fillRect(0, 70, VIEW_WIDTH, 4);
    // Cane along the back of the road.
    for (let x = 2; x < VIEW_WIDTH; x += 5) {
      const h = 26 + ((x * 7) % 13);
      g.fillStyle(BATTLE_ART.cane, 1).fillRect(x, 70 - h, 2, h);
      g.fillStyle(BATTLE_ART.groundDark, 1).fillRect(x, 70 - h + 8, 2, 1);
    }
  }

  private placeFighters(): void {
    const b = this.battle;
    b.enemies.forEach((e, i) => {
      const img = this.add.image(70 + i * 40, 100, textureKeyForEnemy(e.look)).setOrigin(0.5, 1).setScale(2).setDepth(10);
      this.sprites.set(e.key, img);
    });
    b.party.forEach((p, i) => {
      const img = this.add.image(236 - i * 26, 104, textureKeyForCharacter(p.look), characterFrame('left', 0)).setOrigin(0.5, 1).setScale(2).setDepth(10);
      this.sprites.set(p.key, img);
    });
    // Anissa, behind her sister.
    this.anissa?.destroy();
    this.anissaLight?.destroy();
    this.anissaLight = this.add.circle(284, 82, 16, ANISSA_GLOW.tint, 0.2).setDepth(8);
    this.tweens.add({ targets: this.anissaLight, scale: 1.15, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.anissa = this.add.image(284, 100, textureKeyForCharacter(ANISSA_GLOW.look), characterFrame('left', 0)).setOrigin(0.5, 1).setScale(1.5).setDepth(9);
  }

  private say(text: string): void {
    this.message = text;
    this.messageText.setText(text).setWordWrapWidth(VIEW_WIDTH - 16, true);
  }

  private pop(key: string, text: string, color: string): void {
    const s = this.sprites.get(key);
    if (!s || !text) return;
    const t = this.add.text(s.x, s.y - s.displayHeight - 4, text, textStyle(color, { fontStyle: 'bold' })).setOrigin(0.5, 1).setDepth(300);
    this.tweens.add({ targets: t, y: t.y - 14, alpha: 0, duration: BATTLE_ART.popMs, onComplete: () => t.destroy() });
  }

  private flash(key: string): void {
    const s = this.sprites.get(key);
    if (!s) return;
    this.tweens.add({ targets: s, alpha: 0.35, duration: 70, yoyo: true, repeat: 1 });
  }

  /** The panel, bars, turn order and menu. */
  private redraw(): void {
    this.ui.removeAll(true);
    const b = this.battle;
    const g = this.add.graphics();
    this.ui.add(g);
    const text = (x: number, y: number, s: string, color: string = UI.text) => {
      const t = this.add.text(x, y, s, textStyle(color));
      this.ui.add(t);
      return t;
    };
    const bar = (x: number, y: number, w: number, value: number, max: number, color: number) => {
      g.fillStyle(0x000000, 0.6).fillRect(x, y, w, 3);
      g.fillStyle(color, 1).fillRect(x, y, Math.round((w * value) / Math.max(1, max)), 3);
    };

    // Title and turn order.
    text(6, 3, b.def.title, UI.accentText);
    if (!this.done) {
      const order = b.upcoming(6).map((c) => c.name.split(' ').pop()!.slice(0, 6));
      const t = text(0, 3, `Next: ${order.join(' > ')}`, UI.dimText);
      t.setX(VIEW_WIDTH - 6 - Math.ceil(t.width));
    }

    // Enemies: name and HP over each.
    for (const e of b.enemies) {
      const s = this.sprites.get(e.key);
      if (!s) continue;
      const x = s.x - 30;
      text(x, 34, `${e.name}  Lv ${e.level}`, e.down ? UI.dimText : UI.text);
      bar(x, 45, 60, e.hp, e.maxHp, e.hp / e.maxHp < 0.35 ? BATTLE_ART.hpLow : BATTLE_ART.hpBar);
    }

    // Anissa's light grows as her Spark builds.
    this.anissaLight?.setFillStyle(ANISSA_GLOW.tint, 0.12 + 0.5 * (b.spark / SPARK_MAX));

    // The panel: the party's bars on the left, commands on the right.
    g.fillStyle(BATTLE_ART.panel, 0.96).fillRect(2, PANEL_Y, VIEW_WIDTH - 4, VIEW_HEIGHT - PANEL_Y - 2);
    g.lineStyle(1, BATTLE_ART.panelBorder, 1).strokeRect(2.5, PANEL_Y + 0.5, VIEW_WIDTH - 5, VIEW_HEIGHT - PANEL_Y - 3);
    b.party.forEach((p, i) => {
      const y = PANEL_Y + 5 + i * 26;
      const on = b.actor === p && !this.busy;
      text(8, y, p.name, on ? UI.accentText : p.down ? UI.dimText : UI.text);
      text(60, y, `HP ${p.hp}/${p.maxHp}`, p.hp / p.maxHp < 0.35 ? '#e88a7a' : UI.text);
      bar(60, y + 10, 56, p.hp, p.maxHp, p.hp / p.maxHp < 0.35 ? BATTLE_ART.hpLow : BATTLE_ART.hpBar);
      text(122, y, `SP ${p.sp}`, UI.text);
      bar(122, y + 10, 40, p.sp, p.maxSp, BATTLE_ART.spBar);
    });
    // Anissa's Spark: ten pips, the first five gold when a Surge is ready.
    const sy = PANEL_Y + 34;
    text(8, sy, 'Spark', UI.dimText);
    for (let i = 0; i < SPARK_MAX; i++) {
      const on = i < b.spark;
      g.fillStyle(on ? BATTLE_ART.sparkBar : 0x3a3440, 1).fillRect(40 + i * 7, sy + 3, 5, 5);
    }
    if (b.spark >= SURGE_COST && !b.surgeArmed) text(112, sy, 'Surge ready', UI.accentText);
    if (b.surgeArmed) text(112, sy, 'Surging', UI.accentText);

    // Commands (or the victory note).
    this.rows = this.done || this.busy ? [] : this.commandRows();
    if (this.done) {
      text(186, PANEL_Y + 22, 'A or tap: continue', UI.dimText);
      return;
    }
    if (this.rows.length > 0) this.cursor = Math.min(this.cursor, this.rows.length - 1);
    this.rows.forEach((row, i) => {
      const r = this.rowRect(i);
      const on = i === this.cursor;
      if (on) g.lineStyle(1, 0xf2d04b, 1).strokeRect(r.x - 0.5, r.y - 0.5, r.w, r.h);
      const surge = row.label === 'Surge';
      text(r.x + 4, r.y + 2, row.label, !row.enabled ? UI.dimText : surge ? UI.accentText : on ? UI.accentText : UI.text);
    });
  }

  snapshot(): BattleSnapshot {
    const b = this.battle;
    const me: Combatant | undefined = b.party[0];
    return {
      id: this.battleId,
      outcome: b.outcome,
      actor: b.actor?.key ?? null,
      menu: this.menu,
      rows: this.rows.map((r) => r.label),
      cursor: this.cursor,
      enemyHp: b.enemies.reduce((n, e) => n + e.hp, 0),
      hp: me?.hp ?? 0,
      sp: me?.sp ?? 0,
      spark: b.spark,
      message: this.message,
      busy: this.busy,
      done: this.done,
    };
  }
}
