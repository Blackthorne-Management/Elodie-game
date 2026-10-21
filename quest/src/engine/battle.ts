// Turn-based battles (docs/quest/design/COMBAT.md). Pure TypeScript with a seeded Rng, unit tested; the
// battle scene (scenes/BattleScene.ts) only draws it and asks the player for commands.
//
// What is in so far (the first battle, owner decision Oct 15): a charge-time turn order by speed;
// Attack, Skill, Guard and Item; physical and magic damage with hit, crit and variance; Gianna's
// skills at a quarter less SP; Anissa's Spark (+1 when Gianna acts, +2 when she guards) and Surge
// (spend 5: Gianna's next blow or spell x1.5, a free action); Anissa's Light (every 3 of Gianna's
// turns, 20% of her SP back); gear specials (regen, SP regen, crit); healing over time (the clay-pot
// soup); enemies with a telegraphed heavy move; and the Grudge (each Game Over at a fight helps the next try).
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
// Fighters as data (Oct 20): a member's row, Anissa bond and passive effects come from their MemberDef, so a
// new companion is a data entry. Skills can cost gold instead of SP (Samira's Daftar: an exact amount bought
// with gold, stronger with the realm's Wealth), grow with the foes felled (Azzy's Reinado de Cenizas), and stun
// (a stunned fighter loses their next action; bosses only by a chance). The seed comes from the save
// (battleSeed), so a fight replays exactly and each new try rolls new dice.
// The Trial of Blades (Chapter 3, Oct 21; the outline and its review): in a fight that `binds`, a fighter at 0 HP is
// Bound, not Down (Break Free, or any heal, frees them); a boss can have phases (new moves, guards who walk in, a
// phase that starts on the party's first Surge), an HP floor named once (La Promesa de Benny), and a finale he plays
// himself (every fighter Bound) at the floor, a set number of his turns after his finisher, or a round cap. Enemy
// moves can mark, stun, seize Anissa's Spark (Gianna steps in), ward an ally, or be spells; a guard can take blows
// meant for his lord; a guard at 0 HP withdraws instead of falling.

import {
  ACTION_WEIGHT,
  BATTLE_ACTIVE,
  BOUND_BREAK_CHANCE,
  BOUND_FREE_HP_SHARE,
  INTERCEPT_CHANCE,
  RAEL_TRIAL_MAX_ROUNDS,
  ANISSA_SP_EVERY,
  ANISSA_SP_SHARE,
  CRIT_BASE,
  CRIT_MAX,
  CRIT_MIN,
  CRIT_MULT,
  DAFTAR_WEALTH_MAX,
  DAFTAR_WEALTH_PER_POINT,
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
import { Rng, seedFrom } from './rng.ts';
import { battleSkills, type SkillBook } from './skills.ts';
import {
  SLOTS,
  addSharedXp,
  equipped,
  globalPillar,
  gold,
  itemCount,
  level,
  memberRow,
  partyMembers,
  removeItem,
  stats,
  type ItemSpecial,
  type MemberDef,
  type PassiveEffect,
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
  /** A heavy action (ACTION_WEIGHT.heavy): the user's next turn comes later. */
  heavy?: boolean;
  /**
   * Paid in gold instead of SP (Samira's Daftar): `base` plus `perLevel` for each of the user's levels. With
   * `goldRate`, a damage or heal skill does exactly (gold spent x goldRate) points, no stat and no defence,
   * grown by the realm's Wealth (DAFTAR_WEALTH_PER_POINT each, up to DAFTAR_WEALTH_MAX).
   */
  gold?: { base: number; perLevel?: number };
  goldRate?: number;
  /** Damage skills: this much more power for every foe felled so far this battle (Azzy's Reinado de Cenizas). */
  powerPerFell?: number;
  /** Its statuses land on a boss only this often (0 to 1); on other foes always (Grito de Guerra: 0.5). */
  bossChance?: number;
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
  /** A spell (MAG against a quarter of DEF) rather than a blow. */
  magic?: boolean;
  /** Statuses given to whoever it hits (each lands `chance` of the time; omitted: always). */
  statuses?: readonly StatusId[];
  chance?: number;
  /** How many of the target's own turns its statuses last (omitted: the status's own). */
  turns?: number;
  /** Aimed at an ally foe (by enemy id) instead of the party: its `statuses` go on that ally (Jaime's ward). */
  ally?: string;
  /**
   * Aimed at Anissa, who can never be hit (COMBAT 8, Oct 20): Gianna steps in the way, this much Spark is torn
   * away, and its `statuses` land on Gianna (Seize).
   */
  seize?: number;
  /** This much more power for every party fighter Bound (Reinado de Cenizas). */
  powerPerBound?: number;
  /** Used once per battle. */
  once?: boolean;
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
  /** HP times this (a teaching foe that lasts long enough to show its moves: the boar). */
  hpScale?: number;
  /** A boss: some skills' statuses land only by a chance (SkillDef.bossChance). */
  boss?: boolean;
  /** ATK times this (a boss's weight behind the blade). */
  atkScale?: number;
  /** ATK share added for every party fighter Bound (Rael's Sangre Ardiente). */
  atkPerBound?: number;
  /**
   * HP never drops below `hp` (La Promesa de Benny's Last Stand): every blow that would take it lower stops there;
   * the first time, `text` is shown, and in a fight with a finale the boss ends it at once.
   */
  floor?: { hp: number; text: string };
  /** At 0 HP this foe steps back from the fight instead of falling (Rael's guard), with the boss's line. */
  withdraws?: { line: string; speaker?: string };
  /** One-target blows meant for this foe (by enemy id) go to this one instead, INTERCEPT_CHANCE of the time. */
  protects?: string;
}

/**
 * A boss phase (BattleDef.phases, in order): it starts when the boss's HP falls to `below` of its max, or at the
 * party's first Surge (`onSurge`), whichever comes first. The boss then uses `moves`, and `enter` foes walk in.
 */
export interface BattlePhase {
  below?: number;
  onSurge?: boolean;
  /** What is said as it starts (`speaker`: who says it). */
  text?: string;
  speaker?: string;
  moves?: readonly EnemyMove[];
  enter?: readonly string[];
  /** Shown as they walk in. */
  enterText?: string;
}

/**
 * How the boss ends a fight meant to be lost (the Trial of Blades): at the first of his floor holding, `turnsAfter`
 * of his own turns after `finisher`, or RAEL_TRIAL_MAX_ROUNDS of his turns, he says `line` and uses `move`, which
 * Binds every fighter still standing, with no damage.
 */
export interface BattleFinale {
  /** The boss (an enemy id). */
  boss: string;
  line: string;
  move: string;
  text: string;
  finisher?: string;
  turnsAfter?: number;
  /** His own turns before the backstop ends it (default RAEL_TRIAL_MAX_ROUNDS). */
  maxTurns?: number;
}

export interface BattleDef {
  id: string;
  /** Shown at the top of the battle screen. */
  title: string;
  /** The painted scene behind the fight (assets.config.ts BATTLE_BACKDROPS). */
  backdrop: string;
  enemies: readonly string[];
  /** Every enemy fights at this level (a random ambush uses its group's level); omitted: each enemy's own. */
  level?: number;
  /** The Foes page and the won flag: encounter.<table>.<group>.won (engine/game.ts encounterFlag). */
  table: string;
  group: string;
  rewards: { xp: number; gold: number; items?: readonly { id: string; n: number }[] };
  /** Anissa's tips, by moment (the first battle teaches the commands). */
  tips?: { start?: string; spark?: string; tell?: string; lowHp?: string };
  /**
   * The tutorial (the boar fight): a few pages before the first turn, pages shown the first time a moment
   * comes up in the fight (demo review, Oct 17: teach Surge when Anissa is ready, not before a button is
   * pressed), and pages after a win.
   */
  tutorial?: { start: readonly TutorialPage[]; moments?: Partial<Record<LessonMoment, readonly TutorialPage[]>>; after?: readonly TutorialPage[] };
  /**
   * A fight the story means the party to lose (engine/gameOver.ts): falling never shows the goddess, never
   * counts and gives no Grudge; `scene` (a dialogue) plays instead, after a loss or a win alike, and a win
   * sets no won flag. Never on a random ambush (tests/gameOver.test.ts).
   */
  meantToLose?: { scene: string; set?: Readonly<Record<string, boolean>> };
  /** At 0 HP a fighter is Bound, not Down (Rael's fights only: COMBAT 10). */
  binds?: boolean;
  /** The boss's phases after the first (BattlePhase). */
  phases?: readonly BattlePhase[];
  /** The boss ends the fight himself (BattleFinale). */
  finale?: BattleFinale;
  /** Who fights: the present party (the default) or the Echo party (Patricio's). */
  era?: 'present' | 'echo';
  /** A fight that belongs to a side quest (its XP counts as side-quest XP in tools/level-curve.ts). */
  sideQuest?: string;
}

/**
 * When a tutorial lesson can show: Anissa's Spark is full, a foe warns of a heavy blow, Anissa's Light
 * first gives SP back, or a fighter with weapon moves takes a first turn.
 */
export type LessonMoment = 'spark' | 'tell' | 'light' | 'moves';

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
  /** Passive effects the engine runs (Sangre Ardiente, ...). */
  passives?: readonly PassiveEffect[];
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
  passives: readonly PassiveEffect[];
  /** Foes this fighter has felled this battle. */
  fells: number;
  boss: boolean;
  /** The ENEMIES id of a foe. */
  enemyId?: string;
  /** Bound (BattleDef.binds): out of the fight until freed; still on the bar, and only Break Free on their turn. */
  bound: boolean;
  /** Break Free tries so far. */
  breakTries: number;
  /** Own turns since the current phase began (heavy moves count from it). */
  phaseTurns: number;
  atkPerBound: number;
  floor?: { hp: number; text: string };
  withdraws?: { line: string; speaker?: string };
  protects?: string;
}

export interface ActiveStatus {
  id: StatusId;
  turns: number;
  /** Given during the fighter's own turn: that turn does not count. */
  fresh: boolean;
}

export type BattleEvent =
  | { kind: 'turn'; who: string }
  /** Open the tutorial's pages for this moment (BattleDef.tutorial.moments), once per fight. */
  | { kind: 'lesson'; moment: LessonMoment }
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
  /** At 0 HP in a fight that binds: cords, not a fall. */
  | { kind: 'bound'; who: string }
  /** Broke free, or a heal loosened the cords. */
  | { kind: 'freed'; who: string; hp: number }
  /** A foe at 0 HP steps back from the fight (Rael's guard). */
  | { kind: 'withdraw'; who: string }
  /** A foe walks into the fight (a boss phase's guards). */
  | { kind: 'enter'; who: string }
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
  | { kind: 'surge' }
  /** A Bound fighter's only action. */
  | { kind: 'breakFree' };

export interface BattleOptions {
  seed: number;
  /** The Grudge: +GRUDGE_STEP per earlier Game Over at this fight, up to GRUDGE_MAX (engine/gameOver.ts). */
  grudge?: number;
  difficulty?: keyof typeof DIFFICULTY;
  /** Gold in the purse, for skills paid in gold (what is spent is taken from the save by settleBattle). */
  gold?: number;
  /** The realm's Wealth (it grows what gold buys). */
  wealth?: number;
  /** Foes who can walk in during the fight (a boss phase's `enter`), by enemy id, at their fighting level. */
  reserve?: Readonly<Record<string, EnemyDef>>;
}

/** What a gold skill costs this fighter (0 for SP skills). */
export function goldCost(skill: SkillDef, c: Pick<Combatant, 'level'>): number {
  if (!skill.gold) return 0;
  return skill.gold.base + (skill.gold.perLevel ?? 0) * c.level;
}

/** How much stronger the realm's Wealth makes what gold buys (a share: 0.12 is +12%). */
export function wealthBoost(wealth: number): number {
  return Math.min(DAFTAR_WEALTH_MAX, Math.max(0, wealth) * DAFTAR_WEALTH_PER_POINT);
}

/** An enemy's stats at its level (COMBAT 13.1), before difficulty. */
export function enemyStats(def: EnemyDef): { hp: number; atk: number; def: number; mag: number; spd: number } {
  const role = ENEMY_ROLE[def.role];
  const line = (k: keyof typeof ENEMY_STAT_LINE) => ENEMY_STAT_LINE[k][0] + ENEMY_STAT_LINE[k][1] * def.level;
  return {
    hp: Math.round(line('hp') * role.hp * (def.hpScale ?? 1)),
    atk: Math.round(line('atk') * role.atk * (def.atkScale ?? 1)),
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
  /** Gold spent on skills this battle (settleBattle takes it from the save). */
  goldSpent = 0;
  private readonly gold: number;
  private readonly boost: number;
  private readonly rng: Rng;
  private readonly enemyDamage: number;
  private readonly tipsShown = new Set<string>();
  /** Once-per-battle skills already used. */
  private readonly usedOnce = new Set<string>();
  /** Whose turn it is (after `start`). */
  actor: Combatant | null = null;
  /** Boss phases begun (BattleDef.phases). */
  phase = 0;
  /** The party has Surged at least once (a phase can start on it). */
  surgedOnce = false;
  /** The boss's floor has held (its text shown), and the finale is owed before anyone else moves. */
  floorHeld = false;
  private finalePending = false;
  /** The boss's own turn count when he used his finisher. */
  private finisherAt: number | null = null;
  /** Once-per-battle enemy moves already used ("<key>:<move>"). */
  private readonly usedMoves = new Set<string>();
  private readonly reserve: Readonly<Record<string, EnemyDef>>;
  private readonly enemyHp: number;

  constructor(def: BattleDef, party: readonly PartyEntry[], enemies: readonly EnemyDef[], items: readonly BattleItem[], opts: BattleOptions) {
    this.def = def;
    this.rng = new Rng(opts.seed);
    this.grudge = Math.min(GRUDGE_MAX, opts.grudge ?? 0);
    this.gold = opts.gold ?? 0;
    this.boost = wealthBoost(opts.wealth ?? 0);
    const diff = DIFFICULTY[opts.difficulty ?? 'story'];
    this.enemyDamage = diff.enemyDamage;
    this.enemyHp = diff.enemyHp;
    this.reserve = opts.reserve ?? {};
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
      passives: p.passives ?? [],
      fells: 0,
      boss: false,
      bound: false,
      breakTries: 0,
      phaseTurns: 0,
      atkPerBound: 0,
    }));
    const foes: Combatant[] = enemies.map((e, idx) => {
      const n = (seen.get(e.id) ?? 0) + 1;
      seen.set(e.id, n);
      return this.foe(e, n, enemies.filter((x) => x.id === e.id).length > 1, idx);
    });
    this.combatants = [...members, ...foes];
    // Opening times: a share of a full delay, from the dice (COMBAT 3).
    for (const c of this.combatants) c.next = Math.round(turnDelay(c.spd) * (0.3 + this.rng.next() * 0.7));
  }

  /** A foe as a fighter, at difficulty. */
  private foe(e: EnemyDef, n: number, lettered: boolean, slot: number): Combatant {
    const s = enemyStats(e);
    const hp = Math.max(1, Math.round(s.hp * this.enemyHp));
    return {
      key: `${e.id}#${n}`,
      name: lettered ? `${e.name} ${String.fromCharCode(64 + n)}` : e.name,
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
      slot,
      cooldowns: {},
      bash: 100,
      passives: [],
      fells: 0,
      boss: !!e.boss,
      enemyId: e.id,
      bound: false,
      breakTries: 0,
      phaseTurns: 0,
      atkPerBound: e.atkPerBound ?? 0,
      floor: e.floor,
      withdraws: e.withdraws,
      protects: e.protects,
    };
  }

  /** Party fighters Bound now. */
  get boundCount(): number {
    return this.party.filter((p) => p.bound).length;
  }

  /** The boss of a fight with phases or a finale, while he is in it. */
  get bossFighter(): Combatant | undefined {
    const id = this.def.finale?.boss ?? this.enemies.find((e) => e.boss)?.enemyId;
    return id ? this.enemies.find((e) => e.enemyId === id) : undefined;
  }

  /** Gold left in the purse for gold skills. */
  get purse(): number {
    return this.gold - this.goldSpent;
  }

  /** Foes felled so far this battle. */
  get felled(): number {
    return this.enemies.filter((e) => e.down).length;
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
    const sim = this.combatants.filter((c) => (!c.down || c.bound) && c.active).map((c) => ({ c, t: c.next }));
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
    // Bound: the cords are all there is (Break Free, 50% the first time, sure the second).
    if (me.bound !== (action.kind === 'breakFree')) return [];
    if (action.kind === 'breakFree') {
      me.breakTries++;
      const events: BattleEvent[] = [];
      if (me.breakTries >= 2 || this.rng.next() < BOUND_BREAK_CHANCE) events.push(...this.free(me, Math.max(1, Math.round(me.maxHp * BOUND_FREE_HP_SHARE))));
      else events.push({ kind: 'text', text: `${me.name} strains at the cords. They hold.` });
      me.next += turnDelay(spdOf(me), ACTION_WEIGHT.guard);
      events.push(...this.endTurn(me));
      events.push(...this.check());
      if (!this.outcome) events.push(...this.advance());
      return events;
    }
    if (action.kind === 'surge') {
      if (!this.canSurge()) return [];
      this.spark -= SURGE_COST;
      this.surgeArmed = true;
      this.surgedOnce = true;
      return [{ kind: 'surge' }, { kind: 'spark', value: this.spark }, { kind: 'text', text: `Anissa's light gathers around ${me.name}.` }, ...this.phaseCheck()];
    }
    const events: BattleEvent[] = [];
    let weight: number = ACTION_WEIGHT.attack;
    if (action.kind === 'attack') {
      const aimed = this.find(action.target);
      if (!aimed || aimed.down || aimed.side !== 'enemy') return [];
      const t = this.shield(aimed, events);
      events.push(...this.hit(me, t, 'Attack', me.bash, 'physical'));
    } else if (action.kind === 'skill') {
      const skill = me.skills.find((s) => s.id === action.skill);
      if (!skill) return [];
      let targets = this.targetsOf(me, skill, action.target);
      if (targets.length === 0) return [];
      if (!this.canUse(me, skill)) return [];
      if (skill.target === 'enemy' && skill.kind === 'damage') targets = [this.shield(targets[0]!, events)];
      const cost = skillCost(skill, me);
      me.sp -= cost;
      const paid = goldCost(skill, me);
      this.goldSpent += paid;
      if (skill.cooldown) me.cooldowns[skill.id] = skill.cooldown + 1; // this turn's end counts one off
      if (skill.once) this.usedOnce.add(`${me.key}:${skill.id}`);
      weight = skill.heavy ? ACTION_WEIGHT.heavy : isMove(skill) ? ACTION_WEIGHT.attack : ACTION_WEIGHT.skill;
      events.push(...this.useSkill(me, skill, targets, paid));
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
      if (!item || !t || (t.down && !t.bound) || !t.active || t.side !== 'party') return [];
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
        if (t.bound && hp > 0) {
          t.sp += sp;
          events.push(...this.free(t, hp));
        } else {
          t.hp += hp;
          t.sp += sp;
          events.push({ kind: 'heal', to: t.key, hp, sp, source: item.name });
        }
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
    events.push(...this.phaseCheck());
    // The floor held: the boss ends it before anyone else moves.
    if (this.finalePending) events.push(...this.runFinale());
    events.push(...this.check());
    if (!this.outcome) events.push(...this.advance());
    return events;
  }

  /** Whether a fighter can use a skill now: SP, cooldown, once per battle. */
  canUse(c: Combatant, skill: SkillDef): boolean {
    if (c.sp < skillCost(skill, c)) return false;
    if (goldCost(skill, c) > this.purse) return false;
    if ((c.cooldowns[skill.id] ?? 0) > 0) return false;
    if (skill.once && this.usedOnce.has(`${c.key}:${skill.id}`)) return false;
    if (skill.kind === 'revive' && !this.party.some((p) => p.down)) return false;
    return true;
  }

  /**
   * The next try with one more step of Grudge. The battle screen no longer restarts a lost fight (a loss opens
   * the Game Over screen, and the next try takes its Grudge from the save: engine/gameOver.ts grudgeFor).
   */
  static retry(prev: Battle, party: readonly PartyEntry[], enemies: readonly EnemyDef[], items: readonly BattleItem[], seed: number): Battle {
    return new Battle(prev.def, party, enemies, items, { seed, grudge: Math.min(GRUDGE_MAX, prev.grudge + GRUDGE_STEP) });
  }

  // ---- Inside the battle --------------------------------------------------------------------------

  /** Run turns until a party member must choose (enemies act on their own). */
  private advance(): BattleEvent[] {
    const events: BattleEvent[] = [];
    for (let guard = 0; guard < 50 && !this.outcome; guard++) {
      const living = this.combatants.filter((c) => (!c.down || c.bound) && c.active);
      living.sort((a, b) => a.next - b.next || order(a, b));
      const c = living[0]!;
      this.actor = c;
      c.turns++;
      c.phaseTurns++;
      c.guarding = false;
      // The boss ends a fight meant to be lost on his own turn: after his finisher, or at the round cap.
      if (c.side === 'enemy' && this.finaleDue(c)) {
        events.push({ kind: 'turn', who: c.key }, ...this.runFinale(), ...this.check());
        break;
      }
      events.push({ kind: 'turn', who: c.key }, ...this.beginTurn(c));
      events.push(...this.check());
      if (this.outcome) break;
      // Stunned: the turn is lost (the status goes with it).
      const stun = c.statuses.find((st) => STATUS[st.id].skip);
      if (stun) {
        c.statuses = c.statuses.filter((st) => st !== stun);
        events.push({ kind: 'text', text: `${c.name} is stunned and loses the turn.` }, { kind: 'status', to: c.key, status: stun.id, on: false });
        c.next += turnDelay(spdOf(c), ACTION_WEIGHT.guard);
        events.push(...this.endTurn(c));
        continue;
      }
      if (c.side === 'party') {
        if (c.skills.some(isMove) && !c.bound) events.push(...this.tip('moves', undefined));
        return events;
      }
      events.push(...this.enemyTurn(c));
      events.push(...this.endTurn(c));
      events.push(...this.check());
    }
    return events;
  }

  /** At the start of a turn: healing over time, gear specials, Anissa's Light. */
  private beginTurn(c: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    if (c.bound) return events;
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
      if (source === "Anissa's Light" && sp > 0) events.push(...this.tip('light', undefined));
    }
    return events;
  }

  private enemyTurn(c: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    const targets = this.fighters.filter((p) => !p.down);
    if (targets.length === 0) return events;
    const ready = (m: EnemyMove, turn: number) => !!m.every && turn % m.every === 0 && !(m.once && this.usedMoves.has(`${c.key}:${m.name}`));
    const heavy = c.moves.find((m) => ready(m, c.phaseTurns));
    let move: EnemyMove = heavy ?? c.moves[0] ?? { name: 'Attack', power: 100 };
    if (move.once) this.usedMoves.add(`${c.key}:${move.name}`);
    if (move.name === this.def.finale?.finisher && c.enemyId === this.def.finale.boss) this.finisherAt = c.turns;
    // Support: a ward on an ally foe (when that ally is still in the fight).
    const ally = move.ally ? this.enemies.find((e) => e.enemyId === move.ally && !e.down) : undefined;
    // Seize: Anissa cannot be hit, so Gianna steps in (when she is standing).
    const gianna = move.seize !== undefined ? targets.find((t) => t.anissaBond) : undefined;
    if ((move.ally && !ally) || (move.seize !== undefined && !gianna)) move = c.moves[0] ?? { name: 'Attack', power: 100 };
    if (ally) {
      events.push({ kind: 'use', who: c.key, name: move.name, targets: [ally.key] });
      for (const st of move.statuses ?? []) events.push(...this.giveStatus(ally, st, move.turns));
    } else if (gianna && move.seize !== undefined) {
      events.push({ kind: 'use', who: c.key, name: move.name, targets: [gianna.key] });
      events.push({ kind: 'text', text: `${c.name} reaches for Anissa. ${gianna.name} steps between them.` });
      const torn = Math.min(this.spark, move.seize);
      this.spark -= torn;
      events.push({ kind: 'spark', value: this.spark });
      if (torn > 0) events.push({ kind: 'text', text: `${torn} Spark is torn away.` });
      if (move.power > 0) events.push(...this.strike(c, gianna, move));
      for (const st of move.statuses ?? []) if (!gianna.down) events.push(...this.giveStatus(gianna, st, move.turns));
    } else if (move.area) {
      for (const t of targets) if (!t.down) events.push(...this.strike(c, t, move));
    } else events.push(...this.strike(c, this.rng.pick(reachable(targets)), move));
    // Warn about a heavy move coming next turn.
    const nextHeavy = c.moves.find((m) => ready(m, c.phaseTurns + 1));
    if (nextHeavy?.tell) {
      events.push({ kind: 'text', text: nextHeavy.tell });
      events.push(...this.tip('tell', this.def.tips?.tell));
    }
    c.next += turnDelay(spdOf(c), ACTION_WEIGHT.attack);
    return events;
  }

  /** An enemy move's blow (or spell) on one fighter, and its statuses if it lands. */
  private strike(c: Combatant, t: Combatant, move: EnemyMove): BattleEvent[] {
    const power = move.power + (move.powerPerBound ?? 0) * this.boundCount;
    const events = this.hit(c, t, move.name, power, move.magic ? 'magic' : 'physical');
    const landed = events.some((e) => e.kind === 'damage');
    if (landed && !t.down) {
      for (const st of move.statuses ?? []) {
        if (move.chance === undefined || this.rng.next() < move.chance) events.push(...this.giveStatus(t, st, move.turns));
      }
    }
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
    const stat = type === 'physical' ? a.atk * (1 + this.fellBonus(a) + a.atkPerBound * this.boundCount) : a.mag;
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
    events.push(...this.wound(a, b, Math.max(1, Math.round(dmg)), { crit, surge, move, style: type, element, affinity }));
    return events;
  }

  /** ATK share from felling foes this battle (Sangre Ardiente). */
  private fellBonus(a: Combatant): number {
    let bonus = 0;
    for (const p of a.passives) if (p.kind === 'atkPerFell') bonus += Math.min(p.max, p.share * a.fells);
    return bonus;
  }

  /** `amount` of damage lands on `b`: the damage event, and a fall (the next one waiting steps in). */
  private wound(
    a: Combatant,
    b: Combatant,
    amount: number,
    info: { crit: boolean; surge: boolean; move: string; style: 'physical' | 'magic'; element?: Element; affinity?: 1 | -1 },
  ): BattleEvent[] {
    const events: BattleEvent[] = [];
    // The floor (La Promesa de Benny): every blow that would take him lower stops there.
    if (b.floor && b.hp - amount < b.floor.hp) {
      amount = Math.max(0, b.hp - b.floor.hp);
      b.hp -= amount;
      events.push({ kind: 'damage', from: a.key, to: b.key, amount, ...info });
      if (!this.floorHeld) {
        this.floorHeld = true;
        events.push({ kind: 'text', text: b.floor.text });
        if (this.def.finale) this.finalePending = true;
      }
      return events;
    }
    b.hp = Math.max(0, b.hp - amount);
    events.push({ kind: 'damage', from: a.key, to: b.key, amount, ...info });
    if (b.hp === 0 && b.side === 'party' && this.def.binds) {
      // Bound, not Down: cords, and the fighter stays on the bar.
      b.down = true;
      b.bound = true;
      b.breakTries = 0;
      b.guarding = false;
      b.statuses = [];
      events.push({ kind: 'bound', who: b.key });
      return events;
    }
    if (b.hp === 0 && b.withdraws) {
      b.down = true;
      if (a.side !== b.side) a.fells++;
      events.push({ kind: 'withdraw', who: b.key }, { kind: 'text', text: b.withdraws.line, speaker: b.withdraws.speaker });
      return events;
    }
    if (b.hp === 0) {
      b.down = true;
      if (a.side !== b.side) a.fells++;
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
    // A heal reaches a Bound fighter (it loosens the cords).
    const friends = (me.side === 'party' ? this.fighters : this.enemies).filter((c) => !c.down || (c.bound && skill.kind === 'heal'));
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
  private useSkill(me: Combatant, skill: SkillDef, targets: Combatant[], paid = 0): BattleEvent[] {
    const events: BattleEvent[] = [];
    const type = skill.stat === 'atk' ? 'physical' : 'magic';
    const random = skill.target === 'randomEnemies';
    events.push({ kind: 'use', who: me.key, name: skill.name, skill: skill.id, targets: random ? [] : targets.map((t) => t.key), element: skill.element });
    // A Surge powers the whole skill, not just its first hit.
    const surge = this.surgeArmed && me.anissaBond && skill.kind === 'damage';
    if (skill.kind === 'revive') {
      for (const t of targets.filter((x) => x.down)) {
        t.down = false;
        t.bound = false;
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
    // Bought with gold (Daftar): an exact amount, grown by the realm's Wealth.
    const bought = skill.goldRate !== undefined ? Math.max(1, Math.round(paid * skill.goldRate * (1 + this.boost))) : 0;
    const power = skill.power + (skill.powerPerFell ?? 0) * this.felled;
    const hits = random ? (skill.hits ?? 1) : 1;
    for (let h = 0; h < hits; h++) {
      const pool = random ? [this.rng.pick(targets.filter((t) => !t.down).length ? targets.filter((t) => !t.down) : targets)] : targets;
      for (const t of pool) {
        if (t.bound && skill.kind === 'heal') {
          const rolled = bought || Math.round(((me.mag * skill.power) / 100) * (0.95 + this.rng.next() * 0.1));
          events.push(...this.free(t, Math.min(t.maxHp, rolled)));
          continue;
        }
        if (t.down) continue;
        if (skill.kind === 'damage' && bought) {
          events.push(...this.wound(me, t, bought, { crit: false, surge: false, move: skill.name, style: 'magic', element: skill.element }));
        } else if (skill.kind === 'damage') {
          if (surge) this.surgeArmed = true;
          events.push(...this.hit(me, t, skill.name, power, type, skill.element));
        } else if (skill.kind === 'heal') {
          const rolled = bought || Math.round(((me.mag * skill.power) / 100) * (0.95 + this.rng.next() * 0.1));
          const amount = Math.min(t.maxHp - t.hp, rolled);
          t.hp += amount;
          events.push({ kind: 'heal', to: t.key, hp: amount, sp: 0, source: skill.name });
        }
        if (skill.cleanse && !t.down) {
          for (const st of t.statuses.filter((x) => STATUS[x.id].bad)) events.push({ kind: 'status', to: t.key, status: st.id, on: false });
          t.statuses = t.statuses.filter((x) => !STATUS[x.id].bad);
        }
        if (t.down || !skill.statuses?.length) continue;
        // A boss shrugs some statuses off (Grito de Guerra lands half the time).
        if (t.boss && skill.bossChance !== undefined && this.rng.next() >= skill.bossChance) {
          events.push({ kind: 'text', text: `${t.name} shrugs it off.` });
          continue;
        }
        for (const st of skill.statuses) events.push(...this.giveStatus(t, st));
      }
    }
    if (surge) this.surgeArmed = false;
    return events;
  }

  /** Give (or renew) a status. */
  private giveStatus(t: Combatant, id: StatusId, turns: number = STATUS[id].turns): BattleEvent[] {
    const fresh = this.actor === t;
    const had = t.statuses.find((s) => s.id === id);
    if (had) {
      had.turns = turns;
      had.fresh = fresh;
    } else t.statuses.push({ id, turns, fresh });
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

  /** Loosen a Bound fighter's cords: they stand with `hp`. */
  private free(t: Combatant, hp: number): BattleEvent[] {
    t.bound = false;
    t.down = false;
    t.breakTries = 0;
    t.hp = Math.max(1, Math.min(t.maxHp, hp));
    return [{ kind: 'freed', who: t.key, hp: t.hp }];
  }

  /** A one-target blow at `t`: a guard who shields him steps in front, most of the time. */
  private shield(t: Combatant, events: BattleEvent[]): Combatant {
    if (t.side !== 'enemy' || !t.enemyId) return t;
    const guard = this.enemies.find((e) => e !== t && !e.down && e.active && e.protects === t.enemyId);
    if (!guard || this.rng.next() >= INTERCEPT_CHANCE) return t;
    events.push({ kind: 'text', text: `${guard.name} steps in front of ${t.name}!` });
    return guard;
  }

  /** The boss's next phase, when its moment has come (its HP, or the party's first Surge); guards walk in. */
  private phaseCheck(): BattleEvent[] {
    const events: BattleEvent[] = [];
    const phases = this.def.phases ?? [];
    const boss = this.bossFighter;
    while (boss && !boss.down && this.phase < phases.length) {
      const p = phases[this.phase]!;
      const due = (p.below !== undefined && boss.hp <= boss.maxHp * p.below) || (!!p.onSurge && this.surgedOnce);
      if (!due) break;
      this.phase++;
      if (p.moves) {
        boss.moves = p.moves;
        boss.phaseTurns = 0;
      }
      if (p.text) events.push({ kind: 'text', text: p.text, speaker: p.speaker });
      const ids = (p.enter ?? []).filter((id) => this.reserve[id]);
      if (ids.length && p.enterText) events.push({ kind: 'text', text: p.enterText });
      for (const id of ids) {
        const e = this.reserve[id]!;
        const n = this.enemies.filter((x) => x.enemyId === id).length + 1;
        const slot = [0, 1, 2, 3].find((k) => !this.enemies.some((x) => x.slot === k && !x.down)) ?? this.enemies.length;
        const c = this.foe(e, n, n > 1, slot);
        c.next = (this.actor?.next ?? 0) + Math.round(turnDelay(c.spd) * 0.5);
        this.combatants.push(c);
        events.push({ kind: 'enter', who: c.key });
      }
    }
    return events;
  }

  /** Whether the boss ends the fight on this turn of his: after his finisher, or at the round cap. */
  private finaleDue(c: Combatant): boolean {
    const f = this.def.finale;
    if (!f || c.enemyId !== f.boss) return false;
    if (this.finisherAt !== null && f.turnsAfter !== undefined && c.turns >= this.finisherAt + f.turnsAfter) return true;
    return c.turns > (f.maxTurns ?? RAEL_TRIAL_MAX_ROUNDS);
  }

  /** The boss ends it: his line, then his move, which Binds every fighter still standing (no damage). */
  private runFinale(): BattleEvent[] {
    const f = this.def.finale;
    this.finalePending = false;
    if (!f || this.outcome) return [];
    const boss = this.enemies.find((e) => e.enemyId === f.boss);
    const events: BattleEvent[] = [{ kind: 'text', text: f.line, speaker: boss?.name }];
    events.push({ kind: 'use', who: boss?.key ?? f.boss, name: f.move, targets: this.fighters.filter((p) => !p.down).map((p) => p.key) });
    events.push({ kind: 'text', text: f.text });
    for (const p of this.party) {
      if (p.down) continue;
      p.hp = 0;
      p.down = true;
      p.bound = true;
      p.guarding = false;
      events.push({ kind: 'bound', who: p.key });
    }
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
  /** Anissa's tip for a moment, and the tutorial's lesson for it, the first time it comes up. */
  private tip(moment: string, text: string | undefined): BattleEvent[] {
    const lesson = this.def.tutorial?.moments?.[moment as LessonMoment];
    if ((!text && !lesson) || this.tipsShown.has(moment)) return [];
    this.tipsShown.add(moment);
    const events: BattleEvent[] = [];
    if (text) events.push({ kind: 'text', text, speaker: 'Anissa' });
    if (lesson) events.push({ kind: 'lesson', moment: moment as LessonMoment });
    return events;
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

/**
 * The party as fighters (the present one by default, or the Echo's): their stats with gear, the skills they
 * bring, their gear's specials, and what their MemberDef says (row, Anissa bond, passives). In roster order: the
 * first BATTLE_ACTIVE fight, the rest wait to swap in.
 */
export function battleParty(flags: FlagReader, rpg: RpgContent, book: SkillBook, era: 'present' | 'echo' = 'present'): PartyEntry[] {
  const members = partyMembers(flags, rpg, era);
  const withAnissa = members.some((m) => m.support);
  return members.filter((m: MemberDef) => !m.support).map((m) => battleEntry(flags, rpg, m, book, withAnissa));
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
    anissaBond: !!m.anissaBond && withAnissa,
    row: memberRow(m),
    weapon: weapon?.weapon,
    // A plain staff only bashes; one with a blade or spikes strikes properly.
    bash: weapon?.weapon === 'staff' && !weapon.edge ? MAGE_BASH_POWER : 100,
    weaponItem: weapon?.art ?? weaponId ?? undefined,
    passives: (m.passives ?? []).flatMap((p) => (p.effect ? [p.effect] : [])),
  };
}

/** What a fight's gold skills can draw on: the gold on hand and the realm's Wealth (`keys`: the save's flag names). */
export function battlePurse(flags: FlagReader, rpg: RpgContent, keys: readonly string[]): { gold: number; wealth: number } {
  return { gold: gold(flags, rpg), wealth: globalPillar(flags, rpg, 'wealth', keys) };
}

// ---- The dice ------------------------------------------------------------------------------------------

/** How many times this fight has been started on this save (a random ambush counts by its group). */
export function battleTriesFlag(def: Pick<BattleDef, 'table' | 'group'>): string {
  return `battle.tries.${def.table}.${def.group}`;
}

/**
 * A fight's dice come from the save, not the clock (plan review 3.5): the fight's id and how many times it has been
 * started before. The same save replays the same fight exactly (the browser test, the simulator); each new try, a
 * retry after Game Over included, rolls new dice.
 */
export function battleSeed(flags: FlagReader, def: Pick<BattleDef, 'id' | 'table' | 'group'>): number {
  const v = flags.get(battleTriesFlag(def));
  return seedFrom(`${def.id}#${typeof v === 'number' ? v : 0}`);
}

/** The seed for a fight about to begin, counting the try (the battle scene calls this once per fight). */
export function startBattleSeed(flags: FlagStore, def: Pick<BattleDef, 'id' | 'table' | 'group'>): number {
  const seed = battleSeed(flags, def);
  flags.add(battleTriesFlag(def), 1);
  return seed;
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
  /** Gold won (with Baraka Dorini's share). */
  gold: number;
  /** Gold spent on skills (Daftar), taken from the purse. */
  spent: number;
  items: { id: string; n: number }[];
}

/** The extra share of battle gold the party's passives bring (Baraka Dorini: +10% while Samira is in the party). */
export function battleGoldShare(party: readonly Pick<Combatant, 'passives'>[]): number {
  let share = 0;
  for (const c of party) for (const p of c.passives) if (p.kind === 'battleGold') share += p.share;
  return share;
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
  if (battle.outcome !== 'won') return { xp: 0, gold: 0, spent: 0, items: [] };
  addSharedXp(flags, r.xp);
  // Gold spent on Daftar comes off the purse; the winnings go on, with Baraka Dorini's share.
  const spent = battle.goldSpent;
  const won = Math.round(r.gold * (1 + battleGoldShare(battle.party)));
  flags.set('gold', Math.max(0, gold(flags, rpg) - spent) + won);
  for (const it of r.items ?? []) {
    const def = rpg.items[it.id];
    if (def) flags.set(`item.${it.id}`, itemCount(flags, it.id) + it.n);
  }
  // A fight meant to be lost goes on with its story scene either way; it is never marked won.
  if (!battle.def.meantToLose) flags.set(encounterFlag(battle.def.table, battle.def.group, 'won'), true);
  return { xp: r.xp, gold: won, spent, items: [...(r.items ?? [])] };
}
