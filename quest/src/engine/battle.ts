// Turn-based battles (docs/quest/design/COMBAT.md). Pure TypeScript with a seeded Rng, unit tested; the
// battle scene (scenes/BattleScene.ts) only draws it and asks the player for commands.
//
// What is in so far (the first battle, owner decision Oct 15): a charge-time turn order by speed;
// Attack, Skill, Guard and Item; physical and magic damage with hit, crit and variance; Gianna's
// skills at a quarter less SP; Anissa's Spark (+1 when Gianna acts, +2 when she guards) and Surge
// (spend 5: Gianna's next blow or spell x1.5, a free action); Anissa's Light (every 3 of Gianna's
// turns, 20% of her SP back); gear specials (regen, SP regen, crit); healing over time (the clay-pot
// soup); enemies with a telegraphed heavy move; and The Heir Rises (losing restarts with a Grudge).
// Added with the side-view battle screen (owner, Oct 15): every skill names its targets (one foe, every
// foe, random foes, one ally, every ally, or the user), skills can carry an element and a status, and
// the statuses Inspired, Weakened, Marked, Warded and Regen (COMBAT 10) change damage and healing.
// Four fight at once (owner, Oct 15): the rest of the party waits, Swap trades the fighter whose turn it
// is for one who is waiting, and a fallen fighter is replaced by the next one waiting. Fighters with
// blades stand in the front row; a foe's one-target attack reaches the back row (mages, archers) only
// once no one is standing in the front row. Area attacks reach everyone. Anissa is never a target.
// Skills grow (owner, Oct 15; engine/skills.ts picks what each member brings): weapon moves have
// cooldowns instead of SP, ranks add power and effects, gear can bring a skill, and a mage's Attack with a
// plain staff is only a bash.

import {
  ACTION_WEIGHT,
  BATTLE_ACTIVE,
  ANISSA_SP_EVERY,
  ANISSA_SP_SHARE,
  CRIT_BASE,
  CRIT_MAX,
  CRIT_MIN,
  CRIT_MULT,
  DAMAGE_VARIANCE,
  DIFFICULTY,
  ELEMENT_RESIST,
  ELEMENT_WEAK,
  ENEMY_ROLE,
  ENEMY_STAT_LINE,
  GIANNA_SP_DISCOUNT,
  GRUDGE_MAX,
  GRUDGE_STEP,
  GUARD_MULT,
  MAGE_BASH_POWER,
  HIT_BASE,
  HIT_MAX,
  HIT_MIN,
  MIN_DAMAGE_SHARE,
  SPARK_MAX,
  SPARK_ON_ACT,
  SPARK_ON_GUARD,
  STATUS,
  SWAP_IN_DELAY,
  SURGE_COST,
  SURGE_MULT,
  TURN_DELAY_K,
  TURN_DELAY_OFFSET,
} from '../config.ts';
import type { FlagStore, FlagReader } from './flags.ts';
import { encounterFlag } from './encounterFlags.ts';
import { Rng } from './rng.ts';
import { battleSkills, type SkillBook } from './skills.ts';
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

export type Element = 'light' | 'fire' | 'water' | 'wind' | 'earth';
export type StatusId = keyof typeof STATUS;
/** Who a skill reaches: one foe, every foe, `hits` foes at random, one ally, every ally, or the user. */
export type TargetKind = 'enemy' | 'allEnemies' | 'randomEnemies' | 'ally' | 'allAllies' | 'self';

export interface SkillRank {
  /** The member's level at which this rank is reached. */
  level: number;
  power?: number;
  /** Statuses added at this rank. */
  statuses?: readonly StatusId[];
  cleanse?: boolean;
  /** The skill's description from this rank on. */
  text?: string;
}

export interface SkillDef {
  id: string;
  name: string;
  /** SP cost; 0 for weapon moves (they have a cooldown instead). */
  sp: number;
  /**
   * damage: hurts (MAG for spells, ATK for weapon skills); heal: restores HP (MAG); status: only applies
   * its statuses; revive: every fallen ally rises with `power` percent of their HP (and Anissa's Spark grows).
   */
  kind: 'damage' | 'heal' | 'status' | 'revive';
  /** The stat behind it: 'mag' (a spell, the default) or 'atk' (a weapon skill, which can miss and crit). */
  stat?: 'atk' | 'mag';
  power: number;
  target: TargetKind;
  /** randomEnemies: how many hits. */
  hits?: number;
  element?: Element;
  /** Given to every target (buffs on allies, debuffs on foes). */
  statuses?: readonly StatusId[];
  /** Also clears the target's bad statuses. */
  cleanse?: boolean;
  /** A weapon move: usable again only after this many of the user's own turns. */
  cooldown?: number;
  /** Usable once per battle. */
  once?: boolean;
  /** How it is learned (omitted: known from the start). */
  learn?: { level?: number; lore?: { books: readonly string[]; count: number; where: string } };
  ranks?: readonly SkillRank[];
  /** Filled in by engine/skills.ts: the rank reached (1 = I), and the item a gear skill comes from. */
  rank?: number;
  source?: string;
  text: string;
}

/** Whether a skill is a weapon move (shown under Attack) rather than an SP skill. */
export function isMove(s: SkillDef): boolean {
  return s.cooldown !== undefined;
}

/** Whether a skill is aimed at the party's own side. */
export function targetsAllies(t: TargetKind): boolean {
  return t === 'ally' || t === 'allAllies' || t === 'self';
}

/** Whether a skill needs one target picked (the rest reach a whole side, random foes or the user). */
export function needsTarget(t: TargetKind): boolean {
  return t === 'enemy' || t === 'ally';
}

export interface EnemyMove {
  name: string;
  power: number;
  /** Used every Nth turn of this enemy (and announced on the turn before); omitted: the normal attack. */
  every?: number;
  /** The warning shown the turn before a heavy move. */
  tell?: string;
  /** Hits every fighter in the party (front and back rows alike). */
  area?: boolean;
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
  weak?: readonly Element[];
  resist?: readonly Element[];
}

export interface BattleDef {
  id: string;
  /** Shown at the top of the battle screen. */
  title: string;
  /** The painted scene behind the fight (assets.config.ts BATTLE_BACKDROPS). */
  backdrop: string;
  enemies: readonly string[];
  /** The Foes page and the won flag: encounter.<table>.<group>.won (engine/game.ts encounterFlag). */
  table: string;
  group: string;
  rewards: { xp: number; gold: number; items?: readonly { id: string; n: number }[] };
  /** Anissa's tips, by moment (the first battle teaches the commands). */
  tips?: { start?: string; spark?: string; tell?: string; lowHp?: string };
  /** The tutorial (the boar fight): pages before the first turn, and after a win. */
  tutorial?: { start: readonly TutorialPage[]; after?: readonly TutorialPage[] };
}

/** One page of the battle tutorial. */
export interface TutorialPage {
  title: string;
  text: string;
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
  /** The weapon type in hand (staff, bow, blade), for the look of the Attack. */
  weapon?: string;
  /** Front: fighters with blades, who shield the back row (mages and archers). */
  row?: 'front' | 'back';
  /** The power of their plain Attack (100; a mage's staff bash is less unless the staff has an edge). */
  bash?: number;
  /** The weapon item in hand (drawn in their hand on the battle screen). */
  weaponItem?: string;
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
  weapon?: string;
  weak: readonly Element[];
  resist: readonly Element[];
  statuses: ActiveStatus[];
  /** Fighting now (the first four of the party, and every foe); false: waiting to swap in. */
  active: boolean;
  row: 'front' | 'back';
  /** The place on the field (0 to 3), kept by whoever swaps in. */
  slot: number;
  /** Weapon moves still recovering: own turns left. */
  cooldowns: Record<string, number>;
  /** Their plain Attack's power. */
  bash: number;
  weaponItem?: string;
}

export interface ActiveStatus {
  id: StatusId;
  turns: number;
  /** Given during the fighter's own turn: that turn does not count. */
  fresh: boolean;
}

export type BattleEvent =
  | { kind: 'turn'; who: string }
  | { kind: 'text'; text: string; speaker?: string }
  /** A skill or item is used (before its hits, heals or statuses). */
  | { kind: 'use'; who: string; name: string; skill?: string; item?: string; targets: string[]; element?: Element }
  | {
      kind: 'damage';
      from: string;
      to: string;
      amount: number;
      crit: boolean;
      surge: boolean;
      move: string;
      style: 'physical' | 'magic';
      element?: Element;
      /** 1: weak to it; -1: resists it. */
      affinity?: 1 | -1;
    }
  | { kind: 'miss'; from: string; to: string; move: string }
  | { kind: 'heal'; to: string; hp: number; sp: number; source: string }
  | { kind: 'status'; to: string; status: StatusId; on: boolean }
  /** `out` leaves the field and `in` takes their place (forced: `out` had fallen). */
  | { kind: 'swap'; out: string; in: string; forced: boolean }
  | { kind: 'revive'; who: string; hp: number }
  | { kind: 'guard'; who: string }
  | { kind: 'spark'; value: number }
  | { kind: 'surge' }
  | { kind: 'down'; who: string }
  | { kind: 'won' }
  | { kind: 'lost' };

export type Action =
  | { kind: 'attack'; target: string }
  /** `target` for one-target skills (a foe or an ally); ignored by the rest. */
  | { kind: 'skill'; skill: string; target?: string }
  | { kind: 'guard' }
  | { kind: 'item'; item: string; target: string }
  /** Trade places with a party member who is waiting (takes the turn). */
  | { kind: 'swap'; with: string }
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
  if (skill.sp <= 0) return 0;
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
  /** Once-per-battle skills already used. */
  private readonly usedOnce = new Set<string>();
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
    const members: Combatant[] = party.map((p, i) => ({
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
      weapon: p.weapon,
      weak: [],
      resist: [],
      statuses: [],
      active: i < BATTLE_ACTIVE,
      row: p.row ?? 'back',
      slot: i,
      cooldowns: {},
      bash: p.bash ?? 100,
      weaponItem: p.weaponItem,
    }));
    const foes: Combatant[] = enemies.map((e, idx) => {
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
        weak: e.weak ?? [],
        resist: e.resist ?? [],
        statuses: [],
        active: true,
        row: 'front',
        slot: idx,
        cooldowns: {},
        bash: 100,
      };
    });
    this.combatants = [...members, ...foes];
    // Opening times: a share of a full delay, from the dice (COMBAT 3).
    for (const c of this.combatants) c.next = Math.round(turnDelay(c.spd) * (0.3 + this.rng.next() * 0.7));
  }

  /** Everyone in the party, fighting or waiting. */
  get party(): Combatant[] {
    return this.combatants.filter((c) => c.side === 'party');
  }

  /** The party members fighting now, by place. */
  get fighters(): Combatant[] {
    return this.party.filter((c) => c.active).sort((a, b) => a.slot - b.slot);
  }

  /** The party members waiting to swap in. */
  get bench(): Combatant[] {
    return this.party.filter((c) => !c.active);
  }

  get enemies(): Combatant[] {
    return this.combatants.filter((c) => c.side === 'enemy');
  }

  find(key: string): Combatant | undefined {
    return this.combatants.find((c) => c.key === key);
  }

  /** The next turns in order (for the initiative bar), without changing anything. */
  upcoming(n = 6): Combatant[] {
    const sim = this.combatants.filter((c) => !c.down && c.active).map((c) => ({ c, t: c.next }));
    const out: Combatant[] = [];
    for (let i = 0; i < n && sim.length > 0; i++) {
      sim.sort((a, b) => a.t - b.t || order(a.c, b.c));
      const first = sim[0]!;
      out.push(first.c);
      first.t += turnDelay(spdOf(first.c));
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
      if (!t || t.down || t.side !== 'enemy') return [];
      events.push(...this.hit(me, t, 'Attack', me.bash, 'physical'));
    } else if (action.kind === 'skill') {
      const skill = me.skills.find((s) => s.id === action.skill);
      if (!skill) return [];
      const targets = this.targetsOf(me, skill, action.target);
      if (targets.length === 0) return [];
      if (!this.canUse(me, skill)) return [];
      const cost = skillCost(skill, me);
      me.sp -= cost;
      if (skill.cooldown) me.cooldowns[skill.id] = skill.cooldown + 1; // this turn's end counts one off
      if (skill.once) this.usedOnce.add(`${me.key}:${skill.id}`);
      weight = isMove(skill) ? ACTION_WEIGHT.attack : ACTION_WEIGHT.skill;
      events.push(...this.useSkill(me, skill, targets));
    } else if (action.kind === 'guard') {
      me.guarding = true;
      weight = ACTION_WEIGHT.guard;
      events.push({ kind: 'guard', who: me.key });
    } else if (action.kind === 'swap') {
      const them = this.bench.find((c) => c.key === action.with && !c.down);
      if (!them) return [];
      events.push(...this.swapIn(me, them, false));
    } else if (action.kind === 'item') {
      const item = this.items.find((i) => i.id === action.item && i.count > 0);
      const t = this.find(action.target);
      if (!item || !t || t.down || !t.active || t.side !== 'party') return [];
      item.count--;
      weight = ACTION_WEIGHT.item;
      events.push({ kind: 'use', who: me.key, name: item.name, item: item.id, targets: [t.key] });
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
    me.next += turnDelay(spdOf(me), weight);
    events.push(...this.endTurn(me));
    events.push(...this.check());
    if (!this.outcome) events.push(...this.advance());
    return events;
  }

  /** Whether a fighter can use a skill now: SP, cooldown, once per battle. */
  canUse(c: Combatant, skill: SkillDef): boolean {
    if (c.sp < skillCost(skill, c)) return false;
    if ((c.cooldowns[skill.id] ?? 0) > 0) return false;
    if (skill.once && this.usedOnce.has(`${c.key}:${skill.id}`)) return false;
    if (skill.kind === 'revive' && !this.party.some((p) => p.down)) return false;
    return true;
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
      const living = this.combatants.filter((c) => !c.down && c.active);
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
      events.push(...this.endTurn(c));
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
    for (const st of c.statuses) {
      const share = STATUS[st.id].regen;
      if (share > 0) hp += Math.max(1, Math.round(c.maxHp * share));
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
    const targets = this.fighters.filter((p) => !p.down);
    if (targets.length === 0) return events;
    const heavy = c.moves.find((m) => m.every && c.turns % m.every === 0);
    const move: EnemyMove = heavy ?? c.moves[0] ?? { name: 'Attack', power: 100 };
    if (move.area) {
      for (const t of targets) if (!t.down) events.push(...this.hit(c, t, move.name, move.power, 'physical'));
    } else events.push(...this.hit(c, this.rng.pick(reachable(targets)), move.name, move.power, 'physical'));
    // Warn about a heavy move coming next turn.
    const nextHeavy = c.moves.find((m) => m.every && (c.turns + 1) % m.every === 0);
    if (nextHeavy?.tell) {
      events.push({ kind: 'text', text: nextHeavy.tell });
      events.push(...this.tip('tell', this.def.tips?.tell));
    }
    c.next += turnDelay(spdOf(c), ACTION_WEIGHT.attack);
    return events;
  }

  /** One blow or spell from `a` to `b` (COMBAT 5). */
  private hit(a: Combatant, b: Combatant, move: string, power: number, type: 'physical' | 'magic', element?: Element): BattleEvent[] {
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
    for (const st of a.statuses) dmg *= STATUS[st.id].dealt;
    for (const st of b.statuses) dmg *= STATUS[st.id].taken;
    let affinity: 1 | -1 | undefined;
    if (element && b.weak.includes(element)) {
      affinity = 1;
      dmg *= ELEMENT_WEAK;
    } else if (element && b.resist.includes(element)) {
      affinity = -1;
      dmg *= ELEMENT_RESIST;
    }
    if (b.guarding) dmg *= GUARD_MULT;
    const amount = Math.max(1, Math.round(dmg));
    b.hp = Math.max(0, b.hp - amount);
    events.push({ kind: 'damage', from: a.key, to: b.key, amount, crit, surge, move, style: type, element, affinity });
    if (b.hp === 0) {
      b.down = true;
      events.push({ kind: 'down', who: b.key });
      // The next one waiting takes a fallen fighter's place.
      const next = b.side === 'party' && b.active ? this.bench.find((c) => !c.down) : undefined;
      if (next) events.push(...this.swapIn(b, next, true));
    } else if (b.side === 'party' && b.hp <= b.maxHp * 0.35) events.push(...this.tip('lowHp', this.def.tips?.lowHp));
    return events;
  }

  /** `out` leaves the field (fallen, or by choice) and `them` takes the same place. */
  private swapIn(out: Combatant, them: Combatant, forced: boolean): BattleEvent[] {
    out.active = false;
    them.active = true;
    them.guarding = false;
    const slot = out.slot;
    out.slot = them.slot;
    them.slot = slot;
    // They step in now and act after a short wait.
    const now = this.actor?.next ?? 0;
    them.next = Math.max(them.next, now) + Math.round(turnDelay(spdOf(them)) * SWAP_IN_DELAY);
    return [{ kind: 'swap', out: out.key, in: them.key, forced }];
  }

  /** Who a skill reaches, living fighters only (random foes are picked as the hits land). */
  private targetsOf(me: Combatant, skill: SkillDef, target: string | undefined): Combatant[] {
    const foes = (me.side === 'party' ? this.enemies : this.fighters).filter((c) => !c.down);
    const friends = (me.side === 'party' ? this.fighters : this.enemies).filter((c) => !c.down);
    switch (skill.target) {
      case 'enemy': {
        const t = foes.find((c) => c.key === target) ?? (target === undefined ? foes[0] : undefined);
        return t ? [t] : [];
      }
      case 'ally': {
        const t = friends.find((c) => c.key === target) ?? (target === undefined ? me : undefined);
        return t ? [t] : [];
      }
      case 'allEnemies':
      case 'randomEnemies':
        return foes;
      case 'allAllies':
        return skill.kind === 'revive' ? (me.side === 'party' ? this.party : this.enemies) : friends;
      case 'self':
        return [me];
    }
  }

  /** A skill's effect on its targets: hits, heals and statuses. */
  private useSkill(me: Combatant, skill: SkillDef, targets: Combatant[]): BattleEvent[] {
    const events: BattleEvent[] = [];
    const type = skill.stat === 'atk' ? 'physical' : 'magic';
    const random = skill.target === 'randomEnemies';
    events.push({ kind: 'use', who: me.key, name: skill.name, skill: skill.id, targets: random ? [] : targets.map((t) => t.key), element: skill.element });
    // A Surge powers the whole skill, not just its first hit.
    const surge = this.surgeArmed && me.anissaBond && skill.kind === 'damage';
    if (skill.kind === 'revive') {
      for (const t of targets.filter((x) => x.down)) {
        t.down = false;
        t.hp = Math.max(1, Math.round((t.maxHp * skill.power) / 100));
        events.push({ kind: 'revive', who: t.key, hp: t.hp });
        // Back on the field if there is room; otherwise they wait to swap in.
        if (!t.active && this.fighters.length < BATTLE_ACTIVE) {
          t.active = true;
          t.slot = [0, 1, 2, 3].find((n) => !this.fighters.some((f) => f !== t && f.slot === n)) ?? t.slot;
          t.next = (this.actor?.next ?? 0) + Math.round(turnDelay(spdOf(t)) * SWAP_IN_DELAY);
          events.push({ kind: 'swap', out: '', in: t.key, forced: true });
        }
      }
      if (me.anissaBond) {
        this.spark = Math.min(SPARK_MAX, this.spark + 3);
        events.push({ kind: 'spark', value: this.spark });
      }
      return events;
    }
    const hits = random ? (skill.hits ?? 1) : 1;
    for (let h = 0; h < hits; h++) {
      const pool = random ? [this.rng.pick(targets.filter((t) => !t.down).length ? targets.filter((t) => !t.down) : targets)] : targets;
      for (const t of pool) {
        if (t.down) continue;
        if (skill.kind === 'damage') {
          if (surge) this.surgeArmed = true;
          events.push(...this.hit(me, t, skill.name, skill.power, type, skill.element));
        } else if (skill.kind === 'heal') {
          const amount = Math.min(t.maxHp - t.hp, Math.round(((me.mag * skill.power) / 100) * (0.95 + this.rng.next() * 0.1)));
          t.hp += amount;
          events.push({ kind: 'heal', to: t.key, hp: amount, sp: 0, source: skill.name });
        }
        if (skill.cleanse && !t.down) {
          for (const st of t.statuses.filter((x) => STATUS[x.id].bad)) events.push({ kind: 'status', to: t.key, status: st.id, on: false });
          t.statuses = t.statuses.filter((x) => !STATUS[x.id].bad);
        }
        if (!t.down) for (const st of skill.statuses ?? []) events.push(...this.giveStatus(t, st));
      }
    }
    if (surge) this.surgeArmed = false;
    return events;
  }

  /** Give (or renew) a status. */
  private giveStatus(t: Combatant, id: StatusId): BattleEvent[] {
    const fresh = this.actor === t;
    const had = t.statuses.find((s) => s.id === id);
    if (had) {
      had.turns = STATUS[id].turns;
      had.fresh = fresh;
    } else t.statuses.push({ id, turns: STATUS[id].turns, fresh });
    return [{ kind: 'status', to: t.key, status: id, on: true }];
  }

  /** At the end of a fighter's own turn, their statuses count down. */
  private endTurn(c: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    for (const st of c.statuses) {
      if (st.fresh) st.fresh = false;
      else st.turns--;
    }
    for (const id of Object.keys(c.cooldowns)) c.cooldowns[id] = Math.max(0, c.cooldowns[id]! - 1);
    for (const st of c.statuses.filter((x) => x.turns <= 0)) events.push({ kind: 'status', to: c.key, status: st.id, on: false });
    c.statuses = c.statuses.filter((x) => x.turns > 0);
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

/** A foe's one-target attack: the front row while anyone stands in it, else anyone. */
export function reachable(targets: readonly Combatant[]): Combatant[] {
  const taunting = targets.filter((t) => !t.down && t.statuses.some((s) => STATUS[s.id].taunt));
  if (taunting.length > 0) return taunting;
  const front = targets.filter((t) => t.row === 'front' && !t.down);
  return front.length > 0 ? front : [...targets];
}

/** Speed with statuses (Slowed). */
export function spdOf(c: Combatant): number {
  return c.statuses.reduce((v, s) => v * STATUS[s.id].spd, c.spd);
}

function order(a: Combatant, b: Combatant): number {
  if (a.side !== b.side) return a.side === 'party' ? -1 : 1;
  return b.spd - a.spd;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---- Between the field and the battle ---------------------------------------------------------------

/** The present party as fighters: their stats with gear, the skills they bring, and their gear's specials. */
export function battleParty(flags: FlagReader, rpg: RpgContent, book: SkillBook): PartyEntry[] {
  const withAnissa = partyMembers(flags, rpg, 'present').some((m) => m.support);
  return partyMembers(flags, rpg, 'present')
    .filter((m: MemberDef) => !m.support)
    .map((m) => battleEntry(flags, rpg, m, book, withAnissa));
}

/** One member as a fighter. */
export function battleEntry(flags: FlagReader, rpg: RpgContent, m: MemberDef, book: SkillBook, withAnissa: boolean): PartyEntry {
  const weaponId = equipped(flags, m, 'weapon');
  const weapon = weaponId ? rpg.items[weaponId] : undefined;
  const lv = level(flags, rpg, m.id);
  return {
    id: m.id,
    name: m.name,
    look: m.look ?? m.portrait,
    level: lv,
    stats: stats(flags, rpg, m),
    skills: battleSkills(flags, rpg, book, m, lv),
    specials: SLOTS.flatMap((slot) => {
      const id = equipped(flags, m, slot);
      const sp = id ? rpg.items[id]?.special : undefined;
      return sp ? [sp] : [];
    }),
    anissaBond: m.class === 'mage' && withAnissa,
    row: m.class === 'warrior' ? 'front' : 'back',
    weapon: weapon?.weapon,
    // A plain staff only bashes; one with a blade or spikes strikes properly.
    bash: weapon?.weapon === 'staff' && !weapon.edge ? MAGE_BASH_POWER : 100,
    weaponItem: weapon?.art ?? weaponId ?? undefined,
  };
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
