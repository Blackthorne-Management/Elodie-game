// The battle screen (engine/battle.ts has the rules), a pulled-back side view seen a little from above
// (owner, Oct 15): a painted scene, four fighters on the left facing right in two rows (blades in front,
// mages and archers behind), Anissa behind them all (glowing as her Spark grows), up to four foes on the
// right, and a strip along the bottom with the fighters' bars and the commands. Swap trades the fighter
// whose turn it is for a party member who is waiting. Choose a command, then
// a target (a cursor over a foe or an ally; skills that reach a whole side mark every target at once).
// The fighters never walk: they shiver when they strike or are struck, and the effects (scenes/battleFx.ts)
// play over them, with damage numbers floating up. Winning shows the rewards; losing restarts the fight
// with a Grudge (The Heir Rises). Keys, gamepad, the touch buttons and taps all work.

import { audio } from '../audio/player.ts';
import { BATTLE_MUSIC, VICTORY_MUSIC } from '../audio.config.ts';
import Phaser from 'phaser';
import {
  ANISSA_GLOW,
  BATTLE_ART,
  BATTLE_BACKDROPS,
  BATTLE_HANDS,
  BATTLE_STANCE,
  WEAPON_ART,
  textureKeyForBattle,
  battleStanceName,
  ENEMY_FILE_SCALE,
  ART_FILES,
  UI,
  characterFrame,
  textureKeyForCharacter,
  textureKeyForEnemy,
  textureKeyForWeapon,
} from '../assets.config.ts';
import { SPARK_MAX, SURGE_COST, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK } from '../data/battles.ts';
import { RPG } from '../data/rpg.ts';
import {
  Battle,
  battleEntry,
  battleItems,
  battleParty,
  isMove,
  needsTarget,
  settleBattle,
  skillCost,
  targetsAllies,
  type Action,
  type BattleEvent,
  type TutorialPage,
  type BattleResult,
  type Combatant,
  type StatusId,
  type TargetKind,
} from '../engine/battle.ts';
import { getRuntime } from '../runtime.ts';
import { renderScale, textStyle } from '../ui/text.ts';
import { playFx, type FxKind, type Point } from './battleFx.ts';
import { fileKey } from './textures.ts';

type Menu = 'commands' | 'moves' | 'skills' | 'items' | 'swap' | 'target';

interface Row {
  label: string;
  enabled: boolean;
  /** Shown in the band while the cursor is on it. */
  hint?: string;
  run: () => void;
}

/** A command waiting for its target. */
interface Aim {
  name: string;
  side: 'enemy' | 'ally';
  /** Every living fighter on that side (Arrow Rain, Limyè pou Tout) or random foes (Volley). */
  all: boolean;
  back: Menu;
  action: (target: string | undefined) => Action;
}

export interface BattleSnapshot {
  id: string;
  outcome: 'won' | 'lost' | null;
  actor: string | null;
  menu: Menu;
  rows: string[];
  cursor: number;
  /** The fighters the target cursor is on. */
  targets: string[];
  enemyHp: number;
  hp: number;
  sp: number;
  spark: number;
  message: string;
  busy: boolean;
  done: boolean;
  /** The tutorial page on screen (the boar fight), or null. */
  tutorial: { title: string; page: number; pages: number } | null;
}

/** Short tags for statuses, by the party's bars and under a foe's name. */
const STATUS_TAGS: Readonly<Record<StatusId, { tag: string; good: boolean }>> = {
  inspired: { tag: 'ATK+', good: true },
  weakened: { tag: 'ATK-', good: false },
  marked: { tag: 'MARK', good: false },
  warded: { tag: 'WARD', good: true },
  regen: { tag: 'REGEN', good: true },
  slowed: { tag: 'SLOW', good: false },
  taunting: { tag: 'TAUNT', good: true },
};

const STATUS_NAMES: Readonly<Record<StatusId, string>> = {
  inspired: 'Inspired',
  weakened: 'Weakened',
  marked: 'Marked',
  warded: 'Warded',
  regen: 'Regen',
  slowed: 'Slowed',
  taunting: 'drawing every blow',
};

const VISIBLE_ROWS = 6;

let current: BattleScene | null = null;

function setCurrent(scene: BattleScene | null): void {
  current = scene;
}

/** The battle on screen, for the test hook (null when there is none). */
export function battleSnapshot(): BattleSnapshot | null {
  return current?.snapshot() ?? null;
}

export class BattleScene extends Phaser.Scene {
  private battle!: Battle;
  private battleId = '';
  /** Test hook only: extra fighters (member ids) to fill the field, for screenshots of a full party. */
  private extra: readonly string[] = [];
  private menu: Menu = 'commands';
  private cursor = 0;
  private rows: Row[] = [];
  private aim: Aim | null = null;
  private aimIndex = 0;
  private queue: BattleEvent[] = [];
  private busy = false;
  private message = '';
  /** Anissa's last tip stays up while the player chooses. */
  private sticky = '';
  private done = false;
  private result: BattleResult | null = null;
  private sprites = new Map<string, Phaser.GameObjects.Image>();
  /** The weapon in each fighter's hand (kept on the hand every frame, so it shivers and fades with them). */
  private weapons = new Map<string, { img: Phaser.GameObjects.Image; hand: { dx: number; dy: number; behind?: boolean } }>();
  private anissa: Phaser.GameObjects.Image | null = null;
  private anissaLight: Phaser.GameObjects.Arc | null = null;
  private ui!: Phaser.GameObjects.Container;
  private seed = 1;
  private cursorBob = 0;
  /** Tutorial pages still to show (the first is on screen), and what waits behind them. */
  private tutorial: TutorialPage[] = [];
  private tutorialTotal = 0;
  private afterTutorial: BattleEvent[] = [];

  constructor() {
    super('battle');
  }

  init(data: { battle: string; extra?: readonly string[] }): void {
    this.battleId = data.battle;
    this.extra = data.extra ?? [];
    this.menu = 'commands';
    this.cursor = 0;
    this.aim = null;
    this.queue = [];
    this.busy = false;
    this.done = false;
    this.result = null;
    this.message = '';
    this.sticky = '';
    this.sprites = new Map();
    this.weapons = new Map();
    this.tutorial = [];
    this.tutorialTotal = 0;
    this.afterTutorial = [];
  }

  create(): void {
    setCurrent(this);
    const cam = this.cameras.main;
    cam.setOrigin(0, 0).setZoom(renderScale());
    this.seed = Date.now() >>> 0 || 1;
    const def = BATTLES[this.battleId];
    this.drawBackdrop(def?.backdrop ?? 'cane_road');
    audio.playMusic(BATTLE_MUSIC);
    this.ui = this.add.container(0, 0).setDepth(400);
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onTap(p));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (current === this) setCurrent(null);
    });
    // The target cursor bobs.
    this.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        this.cursorBob = (this.cursorBob + 1) % 2;
        if (this.menu === 'target' && !this.busy) this.redraw();
      },
    });
    this.begin();
  }

  // ---- The fight ----------------------------------------------------------------------------------

  private begin(retryOf?: Battle): void {
    const rt = getRuntime();
    const flags = rt.logic.state.flags;
    const def = BATTLES[this.battleId];
    if (!def) throw new Error(`No battle ${this.battleId}`);
    const party = battleParty(flags, RPG, SKILL_BOOK);
    this.extra.forEach((id, i) => {
      const m = RPG.members.find((x) => x.id === id);
      if (m) party.push({ ...battleEntry(flags, RPG, m, SKILL_BOOK, false), id: `${id}${i}` });
    });
    const enemies = def.enemies.map((id) => ENEMIES[id]!).filter(Boolean);
    const items = battleItems(flags, RPG);
    this.seed = (this.seed * 1103515245 + 12345) >>> 0;
    this.battle = retryOf ? Battle.retry(retryOf, party, enemies, items, this.seed) : new Battle(def, party, enemies, items, { seed: this.seed });
    this.placeFighters();
    // The tutorial comes first (not again after a loss); the fight waits behind it.
    if (!retryOf && def.tutorial) this.openTutorial(def.tutorial.start, this.battle.start());
    else this.play(this.battle.start());
  }

  private openTutorial(pages: readonly TutorialPage[], then: BattleEvent[] = []): void {
    this.tutorial = [...pages];
    this.tutorialTotal = pages.length;
    this.afterTutorial = then;
    this.redraw();
  }

  /** A or a tap turns the page; B skips the rest. */
  private turnTutorial(skip = false): void {
    if (skip) this.tutorial = [];
    else this.tutorial.shift();
    if (this.tutorial.length > 0) {
      this.redraw();
      return;
    }
    const then = this.afterTutorial;
    this.afterTutorial = [];
    if (then.length > 0) this.play(then);
    else this.redraw();
  }

  private act(action: Action): void {
    if (this.busy || this.done) return;
    audio.sfx('confirm');
    this.menu = 'commands';
    this.cursor = 0;
    this.aim = null;
    this.sticky = '';
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
      if (!this.done) this.message = '';
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
        if (e.speaker) this.sticky = this.message;
        return BATTLE_ART.messageMs * (e.speaker ? 1.6 : 1.1);
      case 'use':
        this.say(`${name(e.who)}: ${e.name}!`);
        this.shiver(e.who, 1);
        return 300;
      case 'damage': {
        const from = this.battle.find(e.from);
        if (e.move === 'Attack' || from?.side === 'enemy') this.say(`${name(e.from)}: ${e.move}!${e.surge ? ' (Surge)' : ''}`);
        if (from?.side === 'enemy') this.shiver(e.from, 1);
        const kind = this.fxFor(e, from);
        const lead = kind === 'arrow' ? 260 : 140;
        playFx(this, kind, this.centre(e.to), this.centre(e.from));
        this.time.delayedCall(lead, () => {
          audio.sfx(e.crit ? 'crit' : 'hit');
          const tag = e.affinity === 1 ? ' Weak!' : e.affinity === -1 ? ' Resist' : '';
          this.pop(e.to, `${e.amount}${e.crit ? '!' : ''}${tag}`, e.affinity === 1 ? BATTLE_ART.weak : e.crit ? BATTLE_ART.crit : BATTLE_ART.hit);
          this.shiver(e.to, BATTLE_ART.shakePx);
          this.flash(e.to);
          this.redraw();
        });
        return BATTLE_ART.hitMs + lead;
      }
      case 'miss':
        if (this.battle.find(e.from)?.side === 'enemy' || e.move === 'Attack') this.say(`${name(e.from)}: ${e.move}... it misses.`);
        this.pop(e.to, 'miss', UI.dimText);
        audio.sfx('miss');
        return BATTLE_ART.hitMs;
      case 'heal': {
        const bits = [e.hp ? `+${e.hp}` : '', e.sp ? `+${e.sp} SP` : ''].filter(Boolean).join(' ');
        if (e.source === "Anissa's Light") {
          this.say(`Anissa's light warms ${name(e.to)}. ${bits}`);
          playFx(this, 'light', this.centre(e.to));
        } else {
          if (e.source === 'gear') this.say(`${name(e.to)} recovers. ${bits}`);
          playFx(this, 'heal', this.centre(e.to));
        }
        this.pop(e.to, bits, e.hp ? BATTLE_ART.heal : BATTLE_ART.spText);
        audio.sfx('heal');
        return BATTLE_ART.messageMs * 0.8;
      }
      case 'status': {
        const good = STATUS_TAGS[e.status].good;
        if (e.on) {
          playFx(this, good ? 'buff' : 'debuff', this.centre(e.to));
          this.say(`${name(e.to)} is ${STATUS_NAMES[e.status]}.`);
          return BATTLE_ART.messageMs * 0.8;
        }
        this.say(`${name(e.to)}: ${STATUS_NAMES[e.status]} wears off.`);
        return BATTLE_ART.messageMs * 0.6;
      }
      case 'guard': {
        this.say(`${name(e.who)} guards.`);
        const s = this.sprites.get(e.who);
        if (s) {
          s.setTint(0x9ab8f0);
          this.time.delayedCall(300, () => s.clearTint());
        }
        return BATTLE_ART.messageMs * 0.7;
      }
      case 'revive': {
        const s = this.sprites.get(e.who);
        if (s) {
          s.clearTint();
          if (this.hasStance(s)) s.setFrame('0');
          this.tweens.add({ targets: s, alpha: 1, duration: 300 });
          playFx(this, 'light', this.centre(e.who));
        }
        this.pop(e.who, `+${e.hp}`, BATTLE_ART.heal);
        this.say(`${name(e.who)} rises!`);
        return BATTLE_ART.messageMs * 0.8;
      }
      case 'swap': {
        if (!e.out) {
          // Back on the field after being revived.
          if (!this.sprites.has(e.in)) this.addPartySprite(e.in);
          this.arrange();
          return 300;
        }
        const out = this.sprites.get(e.out);
        if (out) this.tweens.add({ targets: out, alpha: 0, duration: 250, onComplete: () => out.destroy() });
        this.sprites.delete(e.out);
        this.time.delayedCall(260, () => {
          this.addPartySprite(e.in).setAlpha(0);
          this.arrange();
          const img = this.sprites.get(e.in);
          if (img) this.tweens.add({ targets: img, alpha: 1, duration: 250 });
          playFx(this, 'buff', this.centre(e.in));
        });
        this.say(e.forced ? `${name(e.in)} steps in for ${name(e.out)}!` : `${name(e.out)} falls back. ${name(e.in)} steps in!`);
        return BATTLE_ART.messageMs;
      }
      case 'spark':
        return 0;
      case 'surge': {
        const g = this.battle.party.find((p) => p.anissaBond);
        if (this.anissa) {
          playFx(this, 'surge', { x: this.anissa.x, y: this.anissa.y - this.anissa.displayHeight / 2 });
          // Her painted stance has a second pose: the glow bright, eyes shut.
          const a = this.anissa;
          if (this.hasStance(a)) {
            a.setFrame('1');
            this.time.delayedCall(1200, () => a.active && a.setFrame('0'));
          }
        }
        if (g) this.time.delayedCall(200, () => playFx(this, 'surge', this.centre(g.key)));
        this.cameras.main.flash(250, 255, 242, 160);
        audio.sfx('surge');
        return 500;
      }
      case 'down': {
        this.say(`${name(e.who)} falls!`);
        const s = this.sprites.get(e.who);
        const enemy = this.battle.find(e.who)?.side === 'enemy';
        audio.sfx(enemy ? 'enemy_down' : 'ally_down');
        if (s && !enemy && this.hasStance(s)) {
          // A painted fighter kneels (the down pose) instead of fading.
          this.time.delayedCall(250, () => s.setFrame('1'));
        } else {
          if (s) this.tweens.add({ targets: s, alpha: enemy ? 0 : 0.35, duration: 500, delay: 250 });
          if (s && !enemy) s.setTint(0x6a6a7a);
        }
        return BATTLE_ART.messageMs;
      }
      case 'won':
        this.win();
        return 0;
      case 'lost':
        this.lose();
        return 0;
    }
  }

  /** The look of a blow: its element, else the weapon (bow, blade, staff), else a beast's claws. */
  private fxFor(e: Extract<BattleEvent, { kind: 'damage' }>, from: Combatant | undefined): FxKind {
    if (e.element) return e.element;
    if (from?.side === 'enemy') return from.moves[0] && e.move !== from.moves[0].name ? 'impact' : 'claw';
    if (from?.weapon === 'bow') return 'arrow';
    if (from?.weapon === 'blade') return 'slash';
    return 'impact';
  }

  private win(): void {
    const flags = getRuntime().logic.state.flags;
    this.result = settleBattle(flags, RPG, this.battle);
    this.done = true;
    audio.playMusic(VICTORY_MUSIC);
    const items = this.result.items.map((i) => RPG.items[i.id]?.name ?? i.id).join(', ');
    this.say(`Victory!  +${this.result.xp} XP  +${this.result.gold} gold${items ? `  ${items}` : ''}`);
    const after = this.battle.def.tutorial?.after;
    if (after) this.openTutorial(after);
  }

  private lose(): void {
    // The Heir Rises: never a game over; the fight starts again with a Grudge.
    this.queue.push({ kind: 'text', text: 'Gigi! Get up! Please!', speaker: 'Anissa' }, { kind: 'text', text: 'Gianna rises. "Again. For them."' });
    this.time.delayedCall(BATTLE_ART.messageMs * 3.5, () => {
      this.queue = [];
      for (const s of this.sprites.values()) s.destroy();
      this.sprites.clear();
      this.sticky = '';
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

  // ---- Commands and targets -------------------------------------------------------------------------

  private commandRows(): Row[] {
    const b = this.battle;
    const me = b.actor;
    if (!me || me.side !== 'party') return [];
    if (this.menu === 'skills') {
      return [
        ...me.skills
          .filter((s) => !isMove(s))
          .map((s) => {
            const cost = skillCost(s, me);
            const from = s.source ? ` From the ${s.source}.` : '';
            return {
              label: `${s.source ? '*' : ''}${s.name} ${cost}`,
              enabled: b.canUse(me, s),
              hint: `${s.text} (${cost} SP)${from}`,
              run: () => this.aimAt(s.name, s.target, 'skills', (target) => ({ kind: 'skill', skill: s.id, target })),
            };
          }),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    if (this.menu === 'moves') {
      return [
        ...me.skills.filter(isMove).map((s) => {
          const wait = me.cooldowns[s.id] ?? 0;
          const from = s.source ? ` From the ${s.source}.` : '';
          return {
            label: `${s.source ? '*' : ''}${s.name}${wait > 0 ? ` (${wait})` : ''}`,
            enabled: b.canUse(me, s),
            hint: wait > 0 ? `${s.name} is ready again in ${wait} turn${wait > 1 ? 's' : ''}.` : `${s.text}${from}`,
            run: () => this.aimAt(s.name, s.target, 'moves', (target) => ({ kind: 'skill', skill: s.id, target })),
          };
        }),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    if (this.menu === 'items') {
      return [
        ...b.items
          .filter((i) => i.count > 0)
          .map((i) => ({
            label: `${i.name} x${i.count}`,
            enabled: true,
            hint: RPG.items[i.id]?.text,
            run: () => this.aimAt(i.name, 'ally', 'items', (target) => ({ kind: 'item', item: i.id, target: target ?? me.key })),
          })),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    if (this.menu === 'swap') {
      return [
        ...b.bench.map((c) => ({
          label: `${c.name} ${c.hp}`,
          enabled: !c.down,
          hint: c.down ? `${c.name} is down.` : `${c.name} takes ${me.name}'s place. HP ${c.hp}/${c.maxHp}, SP ${c.sp}/${c.maxSp}.`,
          run: () => this.act({ kind: 'swap', with: c.key }),
        })),
        { label: 'Back', enabled: true, run: () => this.openMenu('commands') },
      ];
    }
    const waiting = b.bench.filter((c) => !c.down);
    const hasMoves = me.skills.some(isMove);
    const spSkills = me.skills.filter((s) => !isMove(s)).length;
    const rows: Row[] = [
      {
        label: 'Attack',
        enabled: b.enemies.some((e) => !e.down),
        hint: hasMoves ? 'Your weapon moves. Some need a few turns to ready again.' : me.bash < 100 ? 'A bash with your staff. It will not do much.' : 'Strike one foe with your weapon.',
        run: () => (hasMoves ? this.openMenu('moves') : this.aimAt('Attack', 'enemy', 'commands', (target) => ({ kind: 'attack', target: target! }))),
      },
      { label: 'Skill', enabled: spSkills > 0, hint: spSkills ? 'Spells and skills that cost SP.' : `${me.name} has no SP skills yet.`, run: () => this.openMenu('skills') },
      { label: 'Guard', enabled: true, hint: 'Take half damage until your next turn.', run: () => this.act({ kind: 'guard' }) },
      { label: 'Item', enabled: b.items.some((i) => i.count > 0), hint: 'Food and drink from your bag.', run: () => this.openMenu('items') },
      {
        label: 'Swap',
        enabled: waiting.length > 0,
        hint: waiting.length ? 'Trade places with someone waiting (takes the turn).' : 'Up to four fight at once. No one is waiting to swap in yet.',
        run: () => this.openMenu('swap'),
      },
    ];
    if (b.canSurge()) rows.unshift({ label: 'Surge', enabled: true, hint: "Anissa's light: your next blow or spell hits half again as hard. Free.", run: () => this.act({ kind: 'surge' }) });
    return rows;
  }

  /** Pick a target for a command (or confirm a whole side); the user's own skills go at once. */
  private aimAt(name: string, target: TargetKind, back: Menu, action: Aim['action']): void {
    if (target === 'self') {
      this.act(action(undefined));
      return;
    }
    this.aim = { name, side: targetsAllies(target) ? 'ally' : 'enemy', all: !needsTarget(target), back, action };
    const pool = this.aimPool();
    // Heals start on the most hurt ally; attacks on the first standing foe.
    this.aimIndex = this.aim.side === 'ally' ? pool.indexOf([...pool].sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0]!) : 0;
    this.menu = 'target';
    this.cursor = 0;
    this.redraw();
  }

  private aimPool(): Combatant[] {
    if (!this.aim) return [];
    return (this.aim.side === 'enemy' ? this.battle.enemies : this.battle.fighters).filter((c) => !c.down);
  }

  private aimed(): Combatant[] {
    const pool = this.aimPool();
    if (!this.aim) return [];
    return this.aim.all ? pool : pool.slice(this.aimIndex, this.aimIndex + 1);
  }

  private confirmAim(): void {
    if (!this.aim) return;
    const t = this.aimed()[0];
    this.act(this.aim.action(this.aim.all ? undefined : t?.key));
  }

  private openMenu(menu: Menu): void {
    this.menu = menu;
    this.cursor = 0;
    this.aim = null;
    this.redraw();
  }

  update(): void {
    this.holdWeapons();
    const input = getRuntime().input;
    input.update();
    if (this.tutorial.length > 0) {
      if (input.pressed('confirm')) this.turnTutorial();
      else if (input.pressed('cancel')) this.turnTutorial(true);
      return;
    }
    if (this.done) {
      if (!this.busy && (input.pressed('confirm') || input.pressed('cancel'))) this.finish();
      return;
    }
    if (this.busy) return;
    if (this.menu === 'target' && this.aim) {
      const n = this.aimPool().length;
      if (!this.aim.all && n > 0) {
        if (input.pressed('up') || input.pressed('left')) this.moveAim(-1);
        if (input.pressed('down') || input.pressed('right')) this.moveAim(1);
      }
      if (input.pressed('cancel')) this.openMenu(this.aim.back);
      else if (input.pressed('confirm')) this.confirmAim();
      return;
    }
    const n = this.rows.length;
    if (n === 0) return;
    if (input.pressed('up')) this.moveCursor(-1);
    if (input.pressed('down')) this.moveCursor(1);
    if (input.pressed('left')) this.moveCursor(-3);
    if (input.pressed('right')) this.moveCursor(3);
    if (input.pressed('cancel') && this.menu !== 'commands') this.openMenu('commands');
    else if (input.pressed('confirm')) {
      const row = this.rows[this.cursor];
      if (row?.enabled) row.run();
    }
  }

  private moveCursor(d: number): void {
    const n = this.rows.length;
    this.cursor = (((this.cursor + d) % n) + n) % n;
    audio.sfx('cursor');
    this.redraw();
  }

  private moveAim(d: number): void {
    const n = this.aimPool().length;
    this.aimIndex = (((this.aimIndex + d) % n) + n) % n;
    audio.sfx('cursor');
    this.redraw();
  }

  private onTap(pointer: Phaser.Input.Pointer): void {
    const k = renderScale();
    const x = pointer.x / k;
    const y = pointer.y / k;
    if (this.tutorial.length > 0) {
      this.turnTutorial();
      return;
    }
    if (this.done) {
      return;
    }
    if (this.busy) return;
    if (this.menu === 'target' && this.aim) {
      // Tap a fighter to choose it (a whole-side skill: tap any of them); tap the strip to go back.
      const pool = this.aimPool();
      const hit = pool.findIndex((c) => this.sprites.get(c.key)?.getBounds().contains(x, y));
      if (hit >= 0) {
        this.aimIndex = hit;
        this.confirmAim();
      } else if (y >= BATTLE_ART.stripY) this.openMenu(this.aim.back);
      return;
    }
    const i = this.rows.findIndex((_, r) => this.rowHit(r, x, y));
    if (i < 0) return;
    this.cursor = i;
    const row = this.rows[i]!;
    if (row.enabled) row.run();
    else this.redraw();
  }

  /** The command grid: two columns of three in the strip's right half (a page of six at a time). */
  private rowRect(i: number): { x: number; y: number; w: number; h: number } {
    const slot = i % VISIBLE_ROWS;
    const col = Math.floor(slot / 3);
    return { x: 184 + col * 68, y: BATTLE_ART.stripY + 2 + (slot % 3) * 14.5, w: 66, h: 14 };
  }

  private rowHit(i: number, x: number, y: number): boolean {
    if (Math.floor(i / VISIBLE_ROWS) !== Math.floor(this.cursor / VISIBLE_ROWS)) return false;
    const r = this.rowRect(i);
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  }

  // ---- Drawing ------------------------------------------------------------------------------------

  /** The painted scene: sky, clouds, far hills, trees, the cane, and the road the fight stands on. */
  private drawBackdrop(id: string): void {
    const p = BATTLE_BACKDROPS[id] ?? BATTLE_BACKDROPS.cane_road!;
    const g = this.add.graphics().setDepth(0);
    const W = VIEW_WIDTH;
    const horizon = BATTLE_ART.horizon;
    // Sky in bands, with a dithered seam between each.
    const band = Math.ceil(horizon / p.sky.length);
    p.sky.forEach((c, i) => {
      g.fillStyle(c, 1).fillRect(0, i * band, W, band);
      const next = p.sky[i + 1];
      if (next !== undefined) for (let x = (i % 2) * 2; x < W; x += 4) g.fillStyle(next, 1).fillRect(x, (i + 1) * band - 1, 2, 1);
    });
    // Clouds: clusters of rounded blocks, shaded underneath.
    const cloud = (cx: number, cy: number, w: number) => {
      for (let i = 0; i < 5; i++) {
        const bx = cx + (i - 2) * (w / 5);
        const r = w / 6 + ((i * 7) % 3) * 2 - (i === 0 || i === 4 ? 3 : 0);
        g.fillStyle(p.cloud, 1).fillCircle(Math.round(bx), cy - Math.round(r / 2), Math.round(r));
      }
      g.fillStyle(p.cloudShade, 1).fillRect(Math.round(cx - w / 2), cy, Math.round(w), 3);
    };
    cloud(48, 24, 40);
    cloud(160, 20, 28);
    cloud(266, 27, 46);
    // Far and near hills, stepped like pixel art.
    const ridge = (base: number, amp: number, freq: number, phase: number, color: number) => {
      for (let x = 0; x < W; x += 2) {
        const h = Math.round(amp * (0.55 + 0.45 * Math.sin(x * freq + phase)) + amp * 0.35 * Math.sin(x * freq * 2.7 + phase * 2));
        g.fillStyle(color, 1).fillRect(x, base - h, 2, h + 6);
      }
    };
    ridge(horizon - 2, 14, 0.021, 1.3, p.mountainFar);
    ridge(horizon + 2, 8, 0.034, 4.1, p.mountainNear);
    // The tree line.
    for (let x = 0; x < W; x += 3) {
      const h = 4 + ((x * 13) % 5);
      g.fillStyle(p.treesDark, 1).fillRect(x, horizon + 4 - h, 3, h + 2);
      g.fillStyle(p.trees, 1).fillRect(x, horizon + 4 - h, 2, Math.max(2, h - 2));
    }
    // The cane field.
    g.fillStyle(p.field, 1).fillRect(0, horizon + 4, W, 14);
    for (let x = 1; x < W; x += 3) {
      const h = 9 + ((x * 7) % 6);
      const top = horizon + 18 - h;
      g.fillStyle(p.caneDark, 1).fillRect(x, top, 1, h);
      g.fillStyle(p.cane, 1).fillRect(x, top, 1, Math.round(h * 0.6));
      g.fillStyle(p.cane, 1).fillRect(x + ((x >> 1) % 2 ? 1 : -1), top + 2 + (x % 5), 1, 2);
    }
    // The road: packed earth in rows of cobbles, wider toward the viewer.
    const roadTop = horizon + 16;
    const bottom = BATTLE_ART.stripY;
    g.fillStyle(p.ground, 1).fillRect(0, roadTop, W, bottom - roadTop);
    g.fillStyle(p.groundDark, 1).fillRect(0, roadTop, W, 2);
    let rowH = 3;
    for (let y = roadTop + 3, r = 0; y < bottom; y += rowH, r++) {
      g.fillStyle(p.groundDark, 0.55).fillRect(0, y + rowH - 1, W, 1);
      const brick = 10 + rowH * 2;
      for (let x = (r % 2) * (brick / 2); x < W; x += brick) {
        g.fillStyle(p.groundDark, 0.55).fillRect(Math.round(x), y, 1, rowH - 1);
        g.fillStyle(p.groundLight, 0.5).fillRect(Math.round(x) + 1, y, Math.min(brick - 2, 6), 1);
      }
      rowH = Math.min(9, rowH + 1);
    }
  }

  private placeFighters(): void {
    const b = this.battle;
    b.enemies.forEach((e) => {
      const slot = BATTLE_ART.enemySlots[e.slot % BATTLE_ART.enemySlots.length]!;
      const painted = this.textures.exists(fileKey(ART_FILES.enemy(e.look)));
      const img = this.add
        .image(slot.x, slot.y, textureKeyForEnemy(e.look))
        .setOrigin(0.5, 1)
        .setScale(painted ? ENEMY_FILE_SCALE : BATTLE_ART.enemyScale)
        .setDepth(slot.y);
      this.sprites.set(e.key, img);
    });
    for (const p of b.fighters) this.addPartySprite(p.key);
    this.arrange();
    // Anissa, behind everyone.
    this.anissa?.destroy();
    this.anissaLight?.destroy();
    if (!b.party.some((p) => p.anissaBond)) return;
    const { x, y } = BATTLE_ART.anissa;
    this.anissaLight = this.add.circle(x, y - 12, 13, ANISSA_GLOW.tint, 0.2).setDepth(y - 1);
    this.tweens.add({ targets: this.anissaLight, scale: 1.15, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    this.anissa = this.fighterImage(ANISSA_GLOW.look).setPosition(x, y).setDepth(y);
  }

  private addPartySprite(key: string): Phaser.GameObjects.Image {
    const c = this.battle.find(key)!;
    // A stance painted with this very weapon wins; else the empty-handed stance (or walk sprite) plus the drawn weapon.
    const armed = c.weaponItem ? textureKeyForBattle(battleStanceName(c.look, c.weaponItem)) : '';
    const holding = !!armed && this.textures.exists(armed);
    const img = holding ? this.add.image(0, 0, armed, '0').setOrigin(0.5, 1).setScale(BATTLE_STANCE.scale) : this.fighterImage(c.look);
    this.sprites.set(key, img);
    // The equipped weapon, held at its grip in the front hand.
    const art = c.weaponItem ? WEAPON_ART[c.weaponItem] : undefined;
    if (!holding && c.weaponItem && art && this.textures.exists(textureKeyForWeapon(c.weaponItem))) {
      const w = this.add.image(0, 0, textureKeyForWeapon(c.weaponItem));
      w.setOrigin(art.grip.x / w.width, art.grip.y / w.height).setScale(BATTLE_ART.partyScale);
      this.weapons.get(key)?.img.destroy();
      this.weapons.set(key, { img: w, hand: BATTLE_HANDS.byLook[c.look] ?? (c.weapon ? BATTLE_HANDS.byWeapon[c.weapon] : undefined) ?? BATTLE_HANDS.default });
    }
    return img;
  }

  /** A fighter's picture: their painted battle stance (frame 0; 1 is the down pose), else their walking sprite. */
  private fighterImage(look: string): Phaser.GameObjects.Image {
    const stance = textureKeyForBattle(look);
    if (this.textures.exists(stance)) return this.add.image(0, 0, stance, '0').setOrigin(0.5, 1).setScale(BATTLE_STANCE.scale);
    return this.add.image(0, 0, textureKeyForCharacter(look), characterFrame('right', 0)).setOrigin(0.5, 1).setScale(BATTLE_ART.partyScale);
  }

  private hasStance(img: Phaser.GameObjects.Image): boolean {
    return img.texture.key.startsWith('battle-');
  }

  /** Keep every weapon in its fighter's hand (position, depth, fade, tint); drop it with the fighter. */
  private holdWeapons(): void {
    for (const [key, { img, hand }] of this.weapons) {
      const s = this.sprites.get(key);
      if (!s || !s.active) {
        img.destroy();
        this.weapons.delete(key);
        continue;
      }
      // Hand points are in game pixels from the feet; a weapon in the back hand goes behind the body.
      const down = this.battle.find(key)?.down ?? false;
      img
        .setPosition(s.x + hand.dx, s.y + hand.dy)
        .setDepth(s.depth + (hand.behind ? -0.5 : 0.5))
        .setAlpha(s.alpha)
        .setVisible(s.visible && !down);
      if (s.isTinted) img.setTint(s.tintTopLeft);
      else img.clearTint();
    }
  }

  /** Put the fighters in their rows: blades in front, mages and archers behind; a full row spills over. */
  private arrange(): void {
    const fighters = this.battle.fighters;
    const front = [...BATTLE_ART.partyFront];
    const back = [...BATTLE_ART.partyBack];
    const place = (c: Combatant, spot: { x: number; y: number } | undefined) => {
      const img = this.sprites.get(c.key);
      if (img && spot) img.setPosition(spot.x, spot.y).setDepth(spot.y);
    };
    const order = [...fighters.filter((c) => c.row === 'front'), ...fighters.filter((c) => c.row === 'back')];
    for (const c of order) {
      const own = c.row === 'front' ? front : back;
      const other = c.row === 'front' ? back : front;
      place(c, own.shift() ?? other.shift());
    }
  }

  /** The middle of a fighter's sprite (where effects play). */
  private centre(key: string): Point {
    const s = this.sprites.get(key);
    return s ? { x: s.x, y: s.y - s.displayHeight / 2 } : { x: VIEW_WIDTH / 2, y: 90 };
  }

  private say(text: string): void {
    this.message = text;
  }

  private pop(key: string, text: string, color: string): void {
    const s = this.sprites.get(key);
    if (!s || !text) return;
    const t = this.add.text(s.x, s.y - s.displayHeight - 2, text, textStyle(color, { fontStyle: 'bold', stroke: '#14101a', strokeThickness: 2 })).setOrigin(0.5, 1).setDepth(350);
    this.tweens.add({ targets: t, y: t.y - 14, alpha: 0, delay: 250, duration: BATTLE_ART.popMs, onComplete: () => t.destroy() });
  }

  /** The only movement a fighter makes: a quick shiver in place. */
  private shiver(key: string, px: number): void {
    const s = this.sprites.get(key);
    if (!s) return;
    const x = s.x;
    this.tweens.add({ targets: s, x: x + px, duration: 35, yoyo: true, repeat: 3, onComplete: () => s.setX(x) });
  }

  private flash(key: string): void {
    const s = this.sprites.get(key);
    if (!s) return;
    s.setTintFill(0xffffff);
    this.time.delayedCall(70, () => {
      if (this.battle.find(key)?.down && !this.hasStance(s)) s.setTint(0x6a6a7a);
      else s.clearTint();
    });
  }

  /** The top bar, the message band, names and bars, Anissa's Spark, the strip and the menu. */
  private redraw(): void {
    this.ui.removeAll(true);
    const b = this.battle;
    const g = this.add.graphics();
    this.ui.add(g);
    const text = (x: number, y: number, s: string, color: string = UI.text, extra: Phaser.Types.GameObjects.Text.TextStyle = {}) => {
      const t = this.add.text(x, y, s, textStyle(color, extra));
      this.ui.add(t);
      return t;
    };
    const bar = (x: number, y: number, w: number, value: number, max: number, color: number) => {
      g.fillStyle(0x000000, 0.65).fillRect(x, y, w, 3);
      g.fillStyle(color, 1).fillRect(x, y, Math.round((w * value) / Math.max(1, max)), 3);
    };
    const tags = (x: number, y: number, c: Combatant) => {
      let tx = x;
      for (const st of c.statuses) {
        const info = STATUS_TAGS[st.id];
        const t = text(tx, y, info.tag, info.good ? '#f2d04b' : '#d8a0f0', { fontSize: '6px' });
        tx += Math.ceil(t.width) + 3;
      }
    };

    // Top bar: the place and the turn order.
    g.fillStyle(BATTLE_ART.band, 0.55).fillRect(0, 0, VIEW_WIDTH, 12);
    text(5, 1, b.def.title, UI.accentText);
    if (!this.done) {
      const order = b.upcoming(6).map((c) => c.name.split(' ').pop()!.slice(0, 8));
      const t = text(0, 1, `Next: ${order.join(' > ')}`, UI.dimText);
      t.setX(VIEW_WIDTH - 5 - Math.ceil(t.width));
    }

    this.rows = this.done || this.busy || this.menu === 'target' ? [] : this.commandRows();
    if (this.rows.length > 0) this.cursor = Math.min(this.cursor, this.rows.length - 1);

    // The message band: what is happening, or (while choosing) Anissa's tip or the highlighted command.
    const me = b.actor;
    let band = this.message;
    if (!this.busy && !this.done) {
      const row = this.rows[this.cursor];
      if (this.menu === 'target' && this.aim) {
        const who = this.aim.all ? (this.aim.side === 'enemy' ? 'every foe' : 'the whole party') : (this.aimed()[0]?.name ?? '');
        band = `${this.aim.name}: ${who}?  (A to confirm, B to go back)`;
      } else if (this.menu === 'commands' && this.sticky) band = this.sticky;
      else if (this.menu !== 'commands' && row?.hint) band = row.hint;
      else if (me?.side === 'party') band = `${me.name}'s turn.`;
    }
    if (band) {
      const t = text(VIEW_WIDTH / 2, 16, band, UI.text, { align: 'center', wordWrap: { width: VIEW_WIDTH - 24, useAdvancedWrap: true } }).setOrigin(0.5, 0);
      g.fillStyle(BATTLE_ART.band, BATTLE_ART.bandAlpha).fillRect(6, 14, VIEW_WIDTH - 12, Math.ceil(t.height) + 4);
      this.ui.bringToTop(t);
    }

    // Foes: name, level and HP over each, statuses under the bar.
    for (const e of b.enemies) {
      const s = this.sprites.get(e.key);
      if (!s || e.down) continue;
      const top = s.y - s.displayHeight - 14;
      const label = text(s.x, top, `${e.name}  Lv ${e.level}`, UI.text, { stroke: '#14101a', strokeThickness: 2 }).setOrigin(0.5, 0);
      const w = Math.max(40, Math.min(70, Math.ceil(label.width)));
      bar(Math.round(s.x - w / 2), top + 10, w, e.hp, e.maxHp, e.hp / e.maxHp < 0.35 ? BATTLE_ART.hpLow : BATTLE_ART.hpBar);
      tags(Math.round(s.x - w / 2), top + 14, e);
    }

    // Anissa's light grows with her Spark; ten pips over her head, the first five gold when a Surge is ready.
    if (this.anissa) {
      this.anissaLight?.setFillStyle(ANISSA_GLOW.tint, 0.12 + 0.5 * (b.spark / SPARK_MAX));
      const sx = Math.round(this.anissa.x - (SPARK_MAX * 5) / 2);
      const sy = Math.round(this.anissa.y - this.anissa.displayHeight - 8);
      g.fillStyle(BATTLE_ART.panel, 0.8).fillRect(sx - 4, sy - 11, SPARK_MAX * 5 + 7, 18);
      for (let i = 0; i < SPARK_MAX; i++) g.fillStyle(i < b.spark ? BATTLE_ART.sparkBar : 0x3a3440, 1).fillRect(sx + i * 5, sy, 4, 4);
      const label = b.surgeArmed ? 'Surging' : b.spark >= SURGE_COST ? 'Surge!' : 'Spark';
      text(this.anissa.x, sy - 11, label, b.spark >= SURGE_COST ? UI.accentText : UI.dimText, { fontSize: '7px' }).setOrigin(0.5, 0);
    }

    // The target cursor: a bobbing arrow over each fighter it covers.
    if (this.menu === 'target' && !this.busy) {
      for (const c of this.aimed()) {
        const s = this.sprites.get(c.key);
        if (!s) continue;
        const ax = Math.round(s.x);
        const ay = Math.round(s.y - s.displayHeight - (c.side === 'enemy' ? 22 : 6) - this.cursorBob * 2);
        g.fillStyle(BATTLE_ART.cursor, 1);
        g.fillTriangle(ax - 5, ay - 6, ax + 5, ay - 6, ax, ay);
        g.lineStyle(1, 0x14101a, 1).strokeTriangle(ax - 5, ay - 6, ax + 5, ay - 6, ax, ay);
      }
    }

    // The strip: the party's bars on the left, the commands on the right.
    const Y = BATTLE_ART.stripY;
    g.fillStyle(BATTLE_ART.panel, 1).fillRect(0, Y, VIEW_WIDTH, VIEW_HEIGHT - Y);
    g.lineStyle(1, BATTLE_ART.panelBorder, 1).lineBetween(0, Y + 0.5, VIEW_WIDTH, Y + 0.5);
    g.lineStyle(1, BATTLE_ART.panelBorder, 0.35).lineBetween(178.5, Y + 3, 178.5, VIEW_HEIGHT - 3);
    const shown = b.fighters;
    const n = shown.length;
    const rowH = Math.min(14, Math.floor((VIEW_HEIGHT - Y - 4) / Math.max(1, n)));
    shown.forEach((p, i) => {
      const y = Y + 3 + i * rowH;
      const on = b.actor === p && !this.busy && !this.done;
      const aimed = this.menu === 'target' && this.aimed().includes(p);
      if (on || aimed) g.fillStyle(on ? 0x2e2638 : 0x3a3020, 1).fillRect(2, y - 1, 174, rowH);
      text(6, y, `${on ? '>' : ' '}${p.name}`, on ? UI.accentText : p.down ? UI.dimText : UI.text);
      const low = p.hp / p.maxHp < 0.35;
      bar(54, y + 4, 38, p.hp, p.maxHp, low ? BATTLE_ART.hpLow : BATTLE_ART.hpBar);
      text(95, y, `${p.hp}`, low ? '#e88a7a' : UI.text);
      bar(118, y + 4, 24, p.sp, p.maxSp, BATTLE_ART.spBar);
      text(145, y, `${p.sp}`, BATTLE_ART.spText);
      tags(160, y + 1, p);
    });

    if (this.tutorial.length > 0) {
      this.drawTutorial(text);
      return;
    }
    if (this.done) {
      text(248, Y + 17, 'A or tap: continue', UI.dimText).setOrigin(0.5, 0);
      return;
    }
    if (this.menu === 'target') {
      text(184, Y + 4, this.aim?.name ?? '', UI.accentText);
      text(184, Y + 18, this.aim?.all ? 'A: use on all' : 'Arrows: choose', UI.dimText);
      text(184, Y + 31, 'B: back', UI.dimText);
      return;
    }
    const page = Math.floor(this.cursor / VISIBLE_ROWS);
    this.rows.forEach((row, i) => {
      if (Math.floor(i / VISIBLE_ROWS) !== page) return;
      const r = this.rowRect(i);
      const on = i === this.cursor;
      if (on) {
        g.fillStyle(0x2e2638, 1).fillRect(r.x, r.y, r.w, r.h - 1);
        g.lineStyle(1, BATTLE_ART.cursor, 1).strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 2);
      }
      const surge = row.label === 'Surge';
      text(r.x + 4, r.y + 2, row.label, !row.enabled ? UI.dimText : surge || on ? UI.accentText : UI.text);
    });
    const pages = Math.ceil(this.rows.length / VISIBLE_ROWS);
    if (pages > 1) text(VIEW_WIDTH - 4, VIEW_HEIGHT - 9, `${page + 1}/${pages}`, UI.dimText, { fontSize: '6px' }).setOrigin(1, 0);
  }

  /** The tutorial page: a panel over the fight with its title, text and page count. */
  private drawTutorial(
    text: (x: number, y: number, s: string, color?: string, extra?: Phaser.Types.GameObjects.Text.TextStyle) => Phaser.GameObjects.Text,
  ): void {
    const page = this.tutorial[0]!;
    // Its own layer, over every name and bar already drawn.
    const g = this.add.graphics();
    this.ui.add(g);
    const n = this.tutorialTotal - this.tutorial.length + 1;
    const w = VIEW_WIDTH - 40;
    const x = 20;
    g.fillStyle(0x000000, 0.45).fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    const title = text(x + 8, 0, page.title, UI.accentText);
    const body = text(x + 8, 0, page.text, UI.text, { wordWrap: { width: w - 16, useAdvancedWrap: true }, lineSpacing: 2 });
    const foot = text(x + w - 8, 0, `${this.tutorial.length > 1 ? 'A: next   B: skip' : 'A: done'}   ${n}/${this.tutorialTotal}`, UI.dimText, { fontSize: '7px' });
    const h = 8 + 12 + Math.ceil(body.height) + 6 + 10 + 6;
    const y = Math.max(16, Math.round((BATTLE_ART.stripY - h) / 2) + 6);
    g.fillStyle(BATTLE_ART.panel, 0.96).fillRect(x, y, w, h);
    g.lineStyle(1, BATTLE_ART.cursor, 1).strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    title.setY(y + 6);
    body.setY(y + 20);
    foot.setOrigin(1, 0).setY(y + h - 13);
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
      targets: this.menu === 'target' ? this.aimed().map((c) => c.key) : [],
      enemyHp: b.enemies.reduce((n, e) => n + e.hp, 0),
      hp: me?.hp ?? 0,
      sp: me?.sp ?? 0,
      spark: b.spark,
      message: this.message,
      busy: this.busy,
      done: this.done,
      tutorial: this.tutorial[0] ? { title: this.tutorial[0].title, page: this.tutorialTotal - this.tutorial.length + 1, pages: this.tutorialTotal } : null,
    };
  }

  /** Test hook: play one effect over the first foe (for the effects screenshot). */
  showFx(kind: FxKind, freezeAt?: number): void {
    const foe = this.battle.enemies[0];
    const ally = this.battle.party[0];
    if (!foe || !ally) return;
    const healing = kind === 'heal' || kind === 'buff' || kind === 'surge';
    playFx(this, kind, this.centre(healing ? ally.key : foe.key), this.centre(ally.key), freezeAt);
  }
}

/** Test hook: play an effect in the battle on screen. */
export function battleFx(kind: FxKind, freezeAt?: number): void {
  current?.showFx(kind, freezeAt);
}
