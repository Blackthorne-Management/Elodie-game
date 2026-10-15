// Turn-based battles (docs/quest/design/COMBAT.md). Pure TypeScript with a seeded Rng, unit tested; the
// battle scene (scenes/BattleScene.ts) only draws it and asks the player for commands.
//
// What is in so far (the first battle, owner decision Oct 15): a charge-time turn order by speed;
// Attack, Skill, Guard and Item; physical and magic damage with hit, crit and variance; Gianna's
// skills at a quarter less SP; Anissa's Spark (+1 when Gianna acts, +2 when she guards) and Surge
// (spend 5: Gianna's next blow or spell x1.5, a free action); Anissa's Light (every 3 of Gianna's
// turns, 20% of her SP back); gear specials (regen, SP regen, crit); healing over time (the clay-pot
// soup); enemies with a telegraphed heavy move; and The Heir Rises (losing restarts with a Grudge).

import {
  ACTION_WEIGHT,
  ANISSA_SP_EVERY,
  ANISSA_SP_SHARE,
  CRIT_BASE,
  CRIT_MAX,
  CRIT_MIN,
  CRIT_MULT,
  DAMAGE_VARIANCE,
  DIFFICULTY,
  ENEMY_ROLE,
  ENEMY_STAT_LINE,
  GIANNA_SP_DISCOUNT,
  GRUDGE_MAX,
  GRUDGE_STEP,
  GUARD_MULT,
  HIT_BASE,
  HIT_MAX,
  HIT_MIN,
  MIN_DAMAGE_SHARE,
  SPARK_MAX,
  SPARK_ON_ACT,
  SPARK_ON_GUARD,
  SURGE_COST,
  SURGE_MULT,
  TURN_DELAY_K,
  TURN_DELAY_OFFSET,
} from '../config.ts';
import type { FlagStore, FlagReader } from './flags.ts';
import { encounterFlag } from './encounterFlags.ts';
import { Rng } from './rng.ts';
import {
  SLOTS,
  addSharedXp,
  equipped,
  gold,
  itemCount,
  level,
  partyMembers,
  removeItem,
  stats,
  type ItemSpecial,
  type MemberDef,
  type RpgContent,
  type Stats,
} from './rpg.ts';

// ---- Content shapes -----------------------------------------------------------------------------

export type EnemyRole = keyof typeof ENEMY_ROLE;

export interface SkillDef {
  id: string;
  name: string;
  sp: number;
  /** damage: a spell at an enemy (MAG); heal: restores an ally's HP (MAG). */
  kind: 'damage' | 'heal';
  power: number;
  text: string;
}

export interface EnemyMove {
  name: string;
  power: number;
  /** Used every Nth turn of this enemy (and announced on the turn before); omitted: the normal attack. */
  every?: number;
  /** The warning shown the turn before a heavy move. */
  tell?: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  /** Sprite (assets.config.ts ENEMY_ART). */
  look: string;
  level: number;
  role: EnemyRole;
  /** The normal attack first, then any heavy moves. */
  moves: readonly EnemyMove[];
}

export interface BattleDef {
  id: string;
  /** Shown at the top of the battle screen. */
  title: string;
  enemies: readonly string[];
  /** The Foes page and the won flag: encounter.<table>.<group>.won (engine/game.ts encounterFlag). */
  table: string;
  group: string;
  rewards: { xp: number; gold: number; items?: readonly { id: string; n: number }[] };
  /** Anissa's tips, by moment (the first battle teaches the commands). */
  tips?: { start?: string; spark?: string; tell?: string; lowHp?: string };
}

/** What a party member brings into a fight (worked out from the save by the scene). */
export interface PartyEntry {
  id: string;
  name: string;
  look: string;
  level: number;
  stats: Stats;
  skills: readonly SkillDef[];
  specials: readonly ItemSpecial[];
  /** Gianna: skills cost less, she feeds Anissa's Spark, and Anissa's Light reaches her. */
  anissaBond: boolean;
}

export interface BattleItem {
  id: string;
  name: string;
  count: number;
  heals?: number;
  restores?: number;
  /** Heals over this many of the drinker's turns instead of at once. */
  overTurns?: number;
}

// ---- State --------------------------------------------------------------------------------------

export interface Combatant {
  key: string;
  name: string;
  side: 'party' | 'enemy';
  look: string;
  level: number;
  maxHp: number;
  hp: number;
  maxSp: number;
  sp: number;
  atk: number;
  def: number;
  mag: number;
  spd: number;
  /** Charge time until the next turn (lowest goes next). */
  next: number;
  guarding: boolean;
  down: boolean;
  turns: number;
  /** Healing over time: per turn, and turns left. */
  regenHp: number;
  regenTurns: number;
  specials: readonly ItemSpecial[];
  skills: readonly SkillDef[];
  moves: readonly EnemyMove[];
  anissaBond: boolean;
}

export type BattleEvent =
  | { kind: 'turn'; who: string }
  | { kind: 'text'; text: string; speaker?: string }
  | { kind: 'damage'; from: string; to: string; amount: number; crit: boolean; surge: boolean; move: string }
  | { kind: 'miss'; from: string; to: string; move: string }
  | { kind: 'heal'; to: string; hp: number; sp: number; source: string }
  | { kind: 'guard'; who: string }
  | { kind: 'spark'; value: number }
  | { kind: 'surge' }
  | { kind: 'down'; who: string }
  | { kind: 'won' }
  | { kind: 'lost' };

export type Action =
  | { kind: 'attack'; target: string }
  | { kind: 'skill'; skill: string; target: string }
  | { kind: 'guard' }
  | { kind: 'item'; item: string; target: string }
  | { kind: 'surge' };

export interface BattleOptions {
  seed: number;
  /** The Heir Rises: +GRUDGE_STEP per lost attempt, up to GRUDGE_MAX. */
  grudge?: number;
  difficulty?: keyof typeof DIFFICULTY;
}

/** An enemy's stats at its level (COMBAT 13.1), before difficulty. */
export function enemyStats(def: EnemyDef): { hp: number; atk: number; def: number; mag: number; spd: number } {
  const role = ENEMY_ROLE[def.role];
  const line = (k: keyof typeof ENEMY_STAT_LINE) => ENEMY_STAT_LINE[k][0] + ENEMY_STAT_LINE[k][1] * def.level;
  return {
    hp: Math.round(line('hp') * role.hp),
    atk: Math.round(line('atk') * role.atk),
    def: Math.round(line('def') * role.def),
    mag: Math.round(line('mag') * role.mag),
    spd: Math.round(line('spd') * role.spd),
  };
}

/** Gianna's discount: a quarter less, rounded down, at least 1. */
export function skillCost(skill: SkillDef, c: Pick<Combatant, 'anissaBond'>): number {
  return c.anissaBond ? Math.max(1, Math.floor(skill.sp * (1 - GIANNA_SP_DISCOUNT))) : skill.sp;
}

/** Charge time after an action. */
export function turnDelay(spd: number, weight = 1): number {
  return Math.round((TURN_DELAY_K / (spd + TURN_DELAY_OFFSET)) * weight);
}

export class Battle {
  readonly def: BattleDef;
  readonly combatants: Combatant[];
  readonly items: BattleItem[];
  spark = 0;
  /** A Surge is waiting for Gianna's next blow or spell. */
  surgeArmed = false;
  grudge: number;
  outcome: 'won' | 'lost' | null = null;
  private readonly rng: Rng;
  private readonly enemyDamage: number;
  private readonly tipsShown = new Set<string>();
  /** Whose turn it is (after `start`). */
  actor: Combatant | null = null;

  constructor(def: BattleDef, party: readonly PartyEntry[], enemies: readonly EnemyDef[], items: readonly BattleItem[], opts: BattleOptions) {
    this.def = def;
    this.rng = new Rng(opts.seed);
    this.grudge = Math.min(GRUDGE_MAX, opts.grudge ?? 0);
    const diff = DIFFICULTY[opts.difficulty ?? 'story'];
    this.enemyDamage = diff.enemyDamage;
    this.items = items.map((i) => ({ ...i }));
    const seen = new Map<string, number>();
    const members: Combatant[] = party.map((p) => ({
      key: p.id,
      name: p.name,
      side: 'party',
      look: p.look,
      level: p.level,
      maxHp: p.stats.hp,
      hp: p.stats.hp,
      maxSp: p.stats.sp,
      sp: p.stats.sp,
      atk: p.stats.atk,
      def: p.stats.def,
      mag: p.stats.mag,
      spd: p.stats.spd,
      next: 0,
      guarding: false,
      down: false,
      turns: 0,
      regenHp: 0,
      regenTurns: 0,
      specials: p.specials,
      skills: p.skills,
      moves: [],
      anissaBond: p.anissaBond,
    }));
    const foes: Combatant[] = enemies.map((e) => {
      const n = (seen.get(e.id) ?? 0) + 1;
      seen.set(e.id, n);
      const s = enemyStats(e);
      const hp = Math.max(1, Math.round(s.hp * diff.enemyHp));
      return {
        key: `${e.id}#${n}`,
        name: enemies.filter((x) => x.id === e.id).length > 1 ? `${e.name} ${String.fromCharCode(64 + n)}` : e.name,
        side: 'enemy',
        look: e.look,
        level: e.level,
        maxHp: hp,
        hp,
        maxSp: 0,
        sp: 0,
        atk: s.atk,
        def: s.def,
        mag: s.mag,
        spd: s.spd,
        next: 0,
        guarding: false,
        down: false,
        turns: 0,
        regenHp: 0,
        regenTurns: 0,
        specials: [],
        skills: [],
        moves: e.moves,
        anissaBond: false,
      };
    });
    this.combatants = [...members, ...foes];
    // Opening times: a share of a full delay, from the dice (COMBAT 3).
    for (const c of this.combatants) c.next = Math.round(turnDelay(c.spd) * (0.3 + this.rng.next() * 0.7));
  }

  get party(): Combatant[] {
    return this.combatants.filter((c) => c.side === 'party');
  }

  get enemies(): Combatant[] {
    return this.combatants.filter((c) => c.side === 'enemy');
  }

  find(key: string): Combatant | undefined {
    return this.combatants.find((c) => c.key === key);
  }

  /** The next turns in order (for the initiative bar), without changing anything. */
  upcoming(n = 6): Combatant[] {
    const sim = this.combatants.filter((c) => !c.down).map((c) => ({ c, t: c.next }));
    const out: Combatant[] = [];
    for (let i = 0; i < n && sim.length > 0; i++) {
      sim.sort((a, b) => a.t - b.t || order(a.c, b.c));
      const first = sim[0]!;
      out.push(first.c);
      first.t += turnDelay(first.c.spd);
    }
    return out;
  }

  /** Begin the battle: the first turn (and Anissa's opening tip). */
  start(): BattleEvent[] {
    const events: BattleEvent[] = [];
    events.push(...this.tip('start', this.def.tips?.start));
    return [...events, ...this.advance()];
  }

  /** The current party member's commands that can be used now. */
  canSurge(): boolean {
    return !!this.actor?.anissaBond && this.spark >= SURGE_COST && !this.surgeArmed;
  }

  /** A party member acts; then the battle runs on to the next party turn (enemies act in between). */
  act(action: Action): BattleEvent[] {
    const me = this.actor;
    if (!me || me.side !== 'party' || this.outcome) return [];
    if (action.kind === 'surge') {
      if (!this.canSurge()) return [];
      this.spark -= SURGE_COST;
      this.surgeArmed = true;
      return [{ kind: 'surge' }, { kind: 'spark', value: this.spark }, { kind: 'text', text: `Anissa's light gathers around ${me.name}.` }];
    }
    const events: BattleEvent[] = [];
    let weight: number = ACTION_WEIGHT.attack;
    if (action.kind === 'attack') {
      const t = this.find(action.target);
      if (!t || t.down) return [];
      events.push(...this.hit(me, t, 'Attack', 100, 'physical'));
    } else if (action.kind === 'skill') {
      const skill = me.skills.find((s) => s.id === action.skill);
      const t = this.find(action.target);
      if (!skill || !t || t.down) return [];
      const cost = skillCost(skill, me);
      if (me.sp < cost) return [];
      me.sp -= cost;
      weight = ACTION_WEIGHT.skill;
      if (skill.kind === 'damage') events.push(...this.hit(me, t, skill.name, skill.power, 'magic'));
      else {
        const amount = Math.min(t.maxHp - t.hp, Math.round((me.mag * skill.power) / 100 * (0.95 + this.rng.next() * 0.1)));
        t.hp += amount;
        events.push({ kind: 'heal', to: t.key, hp: amount, sp: 0, source: skill.name });
      }
    } else if (action.kind === 'guard') {
      me.guarding = true;
      weight = ACTION_WEIGHT.guard;
      events.push({ kind: 'guard', who: me.key });
    } else if (action.kind === 'item') {
      const item = this.items.find((i) => i.id === action.item && i.count > 0);
      const t = this.find(action.target);
      if (!item || !t || t.down) return [];
      item.count--;
      weight = ACTION_WEIGHT.item;
      if (item.overTurns && item.heals) {
        t.regenHp = Math.ceil(item.heals / item.overTurns);
        t.regenTurns = item.overTurns;
        events.push({ kind: 'text', text: `${t.name} drinks the ${item.name}. Warmth spreads slowly.` });
      } else {
        const hp = Math.min(t.maxHp - t.hp, item.heals ?? 0);
        const sp = Math.min(t.maxSp - t.sp, item.restores ?? 0);
        t.hp += hp;
        t.sp += sp;
        events.push({ kind: 'heal', to: t.key, hp, sp, source: item.name });
      }
    }
    // Anissa's Spark grows when Gianna acts (more when she shields her by guarding).
    if (me.anissaBond) {
      const before = this.spark;
      this.spark = Math.min(SPARK_MAX, this.spark + (action.kind === 'guard' ? SPARK_ON_GUARD : SPARK_ON_ACT));
      if (this.spark !== before) events.push({ kind: 'spark', value: this.spark });
      if (this.spark >= SURGE_COST) events.push(...this.tip('spark', this.def.tips?.spark));
    }
    me.next += turnDelay(me.spd, weight);
    events.push(...this.check());
    if (!this.outcome) events.push(...this.advance());
    return events;
  }

  /** Lost: restart from the first turn with a Grudge (The Heir Rises). */
  static retry(prev: Battle, party: readonly PartyEntry[], enemies: readonly EnemyDef[], items: readonly BattleItem[], seed: number): Battle {
    return new Battle(prev.def, party, enemies, items, { seed, grudge: Math.min(GRUDGE_MAX, prev.grudge + GRUDGE_STEP) });
  }

  // ---- Inside the battle --------------------------------------------------------------------------

  /** Run turns until a party member must choose (enemies act on their own). */
  private advance(): BattleEvent[] {
    const events: BattleEvent[] = [];
    for (let guard = 0; guard < 50 && !this.outcome; guard++) {
      const living = this.combatants.filter((c) => !c.down);
      living.sort((a, b) => a.next - b.next || order(a, b));
      const c = living[0]!;
      this.actor = c;
      c.turns++;
      c.guarding = false;
      events.push({ kind: 'turn', who: c.key }, ...this.beginTurn(c));
      events.push(...this.check());
      if (this.outcome) break;
      if (c.side === 'party') return events;
      events.push(...this.enemyTurn(c));
      events.push(...this.check());
    }
    return events;
  }

  /** At the start of a turn: healing over time, gear specials, Anissa's Light. */
  private beginTurn(c: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    let hp = 0;
    let sp = 0;
    if (c.regenTurns > 0) {
      hp += c.regenHp;
      c.regenTurns--;
    }
    for (const s of c.specials) {
      if (s.kind === 'regen') hp += Math.max(1, Math.round((c.maxHp * s.value) / 100));
      if (s.kind === 'spRegen') sp += Math.max(1, Math.round((c.maxSp * s.value) / 100));
    }
    let source = 'gear';
    if (c.anissaBond && c.turns % ANISSA_SP_EVERY === 0) {
      sp += Math.round(c.maxSp * ANISSA_SP_SHARE);
      source = "Anissa's Light";
    }
    hp = Math.min(c.maxHp - c.hp, hp);
    sp = Math.min(c.maxSp - c.sp, sp);
    if (hp > 0 || sp > 0) {
      c.hp += hp;
      c.sp += sp;
      events.push({ kind: 'heal', to: c.key, hp, sp, source });
    }
    return events;
  }

  private enemyTurn(c: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    const targets = this.party.filter((p) => !p.down);
    if (targets.length === 0) return events;
    const heavy = c.moves.find((m) => m.every && c.turns % m.every === 0);
    const move = heavy ?? c.moves[0] ?? { name: 'Attack', power: 100 };
    const target = this.rng.pick(targets);
    events.push(...this.hit(c, target, move.name, move.power, 'physical'));
    // Warn about a heavy move coming next turn.
    const nextHeavy = c.moves.find((m) => m.every && (c.turns + 1) % m.every === 0);
    if (nextHeavy?.tell) {
      events.push({ kind: 'text', text: nextHeavy.tell });
      events.push(...this.tip('tell', this.def.tips?.tell));
    }
    c.next += turnDelay(c.spd, ACTION_WEIGHT.attack);
    return events;
  }

  /** One blow or spell from `a` to `b` (COMBAT 5). */
  private hit(a: Combatant, b: Combatant, move: string, power: number, type: 'physical' | 'magic'): BattleEvent[] {
    const events: BattleEvent[] = [];
    if (type === 'physical') {
      const hitChance = clamp(HIT_BASE + (a.spd - b.spd) / 2, HIT_MIN, HIT_MAX);
      if (this.rng.next() * 100 >= hitChance) {
        events.push({ kind: 'miss', from: a.key, to: b.key, move });
        return events;
      }
    }
    const stat = type === 'physical' ? a.atk : a.mag;
    const raw = (stat * power) / 100;
    const cut = type === 'physical' ? b.def * 0.5 : b.def * 0.25;
    let dmg = Math.max(Math.ceil(raw * MIN_DAMAGE_SHARE), raw - cut);
    dmg *= 1 - DAMAGE_VARIANCE + this.rng.next() * DAMAGE_VARIANCE * 2;
    let crit = false;
    if (type === 'physical') {
      const bonus = a.specials.filter((s) => s.kind === 'crit').reduce((n, s) => n + s.value, 0);
      const critChance = clamp(CRIT_BASE + (a.spd - b.spd) / 4, CRIT_MIN, CRIT_MAX) + bonus;
      if (this.rng.next() * 100 < critChance) {
        crit = true;
        dmg *= CRIT_MULT;
      }
    }
    const surge = a.side === 'party' && a.anissaBond && this.surgeArmed;
    if (surge) {
      dmg *= SURGE_MULT;
      this.surgeArmed = false;
    }
    if (a.side === 'party') dmg *= 1 + this.grudge;
    if (a.side === 'enemy') dmg *= this.enemyDamage;
    if (b.guarding) dmg *= GUARD_MULT;
    const amount = Math.max(1, Math.round(dmg));
    b.hp = Math.max(0, b.hp - amount);
    events.push({ kind: 'damage', from: a.key, to: b.key, amount, crit, surge, move });
    if (b.hp === 0) {
      b.down = true;
      events.push({ kind: 'down', who: b.key });
    } else if (b.side === 'party' && b.hp <= b.maxHp * 0.35) events.push(...this.tip('lowHp', this.def.tips?.lowHp));
    return events;
  }

  private check(): BattleEvent[] {
    if (this.outcome) return [];
    if (this.enemies.every((e) => e.down)) {
      this.outcome = 'won';
      return [{ kind: 'won' }];
    }
    if (this.party.every((p) => p.down)) {
      this.outcome = 'lost';
      return [{ kind: 'lost' }];
    }
    return [];
  }

  /** Anissa's tip for a moment, the first time it comes (none when the battle has no tip for it). */
  private tip(moment: string, text: string | undefined): BattleEvent[] {
    if (!text || this.tipsShown.has(moment)) return [];
    this.tipsShown.add(moment);
    return [{ kind: 'text', text, speaker: 'Anissa' }];
  }
}

function order(a: Combatant, b: Combatant): number {
  if (a.side !== b.side) return a.side === 'party' ? -1 : 1;
  return b.spd - a.spd;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---- Between the field and the battle ---------------------------------------------------------------

/** The present party as fighters: their stats with gear, their skills and their gear's specials. */
export function battleParty(flags: FlagReader, rpg: RpgContent, skills: Readonly<Record<string, readonly SkillDef[]>>): PartyEntry[] {
  const withAnissa = partyMembers(flags, rpg, 'present').some((m) => m.support);
  return partyMembers(flags, rpg, 'present')
    .filter((m: MemberDef) => !m.support)
    .map((m) => ({
      id: m.id,
      name: m.name,
      look: m.look ?? m.portrait,
      level: level(flags, rpg, m.id),
      stats: stats(flags, rpg, m),
      skills: skills[m.id] ?? [],
      specials: SLOTS.flatMap((slot) => {
        const id = equipped(flags, m, slot);
        const sp = id ? rpg.items[id]?.special : undefined;
        return sp ? [sp] : [];
      }),
      anissaBond: m.class === 'mage' && withAnissa,
    }));
}

/** The bag's consumables, for the Item command. */
export function battleItems(flags: FlagReader, rpg: RpgContent): BattleItem[] {
  return Object.values(rpg.items)
    .filter((it) => it.kind === 'consumable' && itemCount(flags, it.id) > 0)
    .map((it) => ({
      id: it.id,
      name: it.name,
      count: itemCount(flags, it.id),
      heals: it.heals,
      restores: it.restores,
      overTurns: it.healTurns,
    }));
}

export interface BattleResult {
  xp: number;
  gold: number;
  items: { id: string; n: number }[];
}

/**
 * After a won battle: XP to the party, gold, drops (into the bag even when it is full: a reward is never
 * lost), the items used, and the Foes page's won flag. Returns what was gained (for the victory screen).
 */
export function settleBattle(flags: FlagStore, rpg: RpgContent, battle: Battle): BattleResult {
  const r = battle.def.rewards;
  for (const it of battle.items) {
    const used = itemCount(flags, it.id) - it.count;
    if (used > 0) removeItem(flags, it.id, used);
  }
  if (battle.outcome !== 'won') return { xp: 0, gold: 0, items: [] };
  addSharedXp(flags, r.xp);
  flags.set('gold', gold(flags, rpg) + r.gold);
  for (const it of r.items ?? []) {
    const def = rpg.items[it.id];
    if (def) flags.set(`item.${it.id}`, itemCount(flags, it.id) + it.n);
  }
  flags.set(encounterFlag(battle.def.table, battle.def.group, 'won'), true);
  return { xp: r.xp, gold: r.gold, items: [...(r.items ?? [])] };
}
