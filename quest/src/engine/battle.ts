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
  AMBUSH_XP,
  BATTLE_ACTIVE,
  BOUND_BREAK_CHANCE,
  BOUND_FREE_HP_SHARE,
  HIRE_CAP,
  INTERCEPT_CHANCE,
  RAEL_TRIAL_MAX_ROUNDS,
  ANISSA_SP_EVERY,
  ANISSA_SP_SHARE,
  ARMOR_PLAIN_SHARE,
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
  GRUDGE_MAX_BOSS,
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
  STATUS_IMMUNE,
  BURNING_BOSS_SHARE,
  SWAP_IN_DELAY,
  SURGE_COST,
  VOLLEY,
  SURGE_MULT,
  TURN_DELAY_K,
  TURN_DELAY_OFFSET,
} from '../config.ts';
import { evaluate } from './conditions.ts';
import type { FlagStore, FlagReader } from './flags.ts';
import { encounterFlag } from './encounterFlags.ts';
import { Rng, seedFrom } from './rng.ts';
import { battleSkills, type SkillBook } from './skills.ts';
import { spentFlag, volleysFlag, type Volleys } from './war.ts';
import {
  SLOTS,
  addSharedXp,
  equipped,
  globalPillar,
  gold,
  itemCount,
  level,
  memberRow,
  partyLevel,
  partyMembers,
  removeItem,
  stats,
  xpForLevel,
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
   * The action's own weight on the user's next turn, in place of its kind's (ACTION_WEIGHT): Raider's Charge is 0.5
   * (her delay this turn is halved), The Great Raid 0 (two full turns in a row; Bayarmaa, COMBAT 9.4).
   */
  weight?: number;
  /**
   * Paid in gold instead of SP (Samira's Daftar): `base` plus `perLevel` for each of the user's levels. With
   * `goldRate`, a damage or heal skill does exactly (gold spent x goldRate) points, no stat and no defence,
   * grown by the realm's Wealth (DAFTAR_WEALTH_PER_POINT each, up to DAFTAR_WEALTH_MAX).
   */
  gold?: { base: number; perLevel?: number };
  goldRate?: number;
  /**
   * A heal by share (Tea Break, Edmund, Chapter 9): each target gets this share of its own max HP back, whatever the
   * healer's MAG (a tank's heal). `power` is unused for it.
   */
  healShare?: number;
  /** Damage skills: this much more power for every foe felled so far this battle (Azzy's Reinado de Cenizas). */
  powerPerFell?: number;
  /**
   * Bribe (Samira): the target takes the purse and walks out of the fight (no fall, no fell). Only a foe that can be
   * bought (EnemyDef.bribable) takes it; any other refuses and the gold stays in the purse. A foe hired mid-fight
   * (EnemyMove.hire) was paid first, so the gold comes back.
   */
  bribe?: boolean;
  /** Its statuses land on a boss only this often (0 to 1); on other foes always (Grito de Guerra: 0.5). */
  bossChance?: number;
  /**
   * Kagemimi (Haru, Chapter 7): the target's next move is told, and a foe in disguise is found out: the real one is
   * named and Marked, and the paper ones stop stepping in front of him for the rest of the fight (EnemyDef.disguise).
   */
  reveal?: boolean;
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
  /**
   * Hire Blades (Qasim): instead of striking, this foe (an enemy id, from the battle's reserve) walks in, hired; at
   * most HIRE_CAP hired ones on the field at once (otherwise the normal attack).
   */
  hire?: string;
  /**
   * Sold Secrets (the Paper Fox, Chapter 7; the second review's 3.6): he reads one fighter's file and uses that
   * fighter's strongest damage skill on them, at its power, with his own ATK (Story's damage share applies as to any
   * blow). `power` is the floor when the fighter has nothing stronger.
   */
  mirror?: boolean;
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
  /** A breastplate: a plain Attack does only ARMOR_PLAIN_SHARE of its damage (skills are not slowed). */
  armored?: boolean;
  /** A boss: some skills' statuses land only by a chance (SkillDef.bossChance). */
  boss?: boolean;
  /** ATK times this (a boss's weight behind the blade). */
  atkScale?: number;
  /**
   * MAG times this (a caster boss's weight behind her spells; Chapter 9, the Hushed: the second review's 3.1, a caster
   * boss's spells never scaled with `atkScale`). Omitted: 1 (every boss before Chapter 9).
   */
  magScale?: number;
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
  /** A person who takes a purse (Samira's Bribe); beasts, zealots and bosses refuse. */
  bribable?: boolean;
  /**
   * In disguise (the Paper Fox and his paper decoys, Chapter 7): every foe with a disguise shows as `as` with a letter
   * dealt at random, stands in a shuffled place, and keeps its HP bar hidden, until a reveal (SkillDef.reveal) finds
   * them out; then the one with a `name` (the real one) is named, and the rest go by their own name.
   */
  disguise?: { as: string; name?: string };
  /**
   * Never aims a blow at this party member (by member id), one-target or area (Rael at the Harbor Strike will not strike
   * Gianna: COMBAT 13.3 #3b; the Chapter 11 review's 3.13). With nobody else standing he waits.
   */
  avoid?: string;
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
  /**
   * Lit oil (Seth Dhanraj, Chapter 8; COMBAT 13.3): from this phase on, a fire blow that lands on the boss (his Oil
   * Wall down) sets him Burning, again with every fire blow.
   */
  ignite?: boolean;
  /**
   * These foes (by enemy id), if still standing, step back from the fight as the phase starts, with their own withdraw
   * line (Rael's guards at the Harbor Strike's Broken Army: COMBAT 13.3 #3b, "his guards leave").
   */
  leave?: readonly string[];
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
  /** `xp` is a random ambush's at a party of its own level (`ambush`: settleBattle pays it at the party's level). */
  rewards: { xp: number; gold: number; items?: readonly { id: string; n: number }[] };
  /** A random ambush: its XP follows the party's level (AMBUSH_XP, ambushXp). */
  ambush?: { foes: number };
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
  /**
   * The fight ends when the boss is down (he yields: EnemyDef.withdraws); whoever is still standing with him walks
   * out (Qasim's blades). The Yield step's fallback, as Thorne's fight ends on the win.
   */
  endsWithBoss?: boolean;
  /** A fight that belongs to a side quest (its XP counts as side-quest XP in tools/level-curve.ts). */
  sideQuest?: string;
  /** A chapter's boss: its Grudge climbs to GRUDGE_MAX_BOSS instead of GRUDGE_MAX (grudgeCap). */
  boss?: boolean;
  /**
   * Only these members fight (by id), whoever else is in the party: a duel (Chapter 8, Vikram challenges Gianna alone).
   * Omitted: the party as it stands.
   */
  fighters?: readonly string[];
  /**
   * The armies' volleys open it (Chapter 11, engine/war.ts): the whistle before it set war.volleys.<id>, and the battle
   * scene passes them in (BattleOptions.volleys). A win spends them.
   */
  volleys?: boolean;
  /**
   * Flags a loss writes (engine/gameOver.ts recordLoss): what the fight's own scene set for it and a Game Over must take
   * back (Chapter 11: Rael's place in the four, party.rael, on the flagship; the second review's 3.8).
   */
  onLoss?: Readonly<Record<string, boolean>>;
}

/** The most Grudge a fight can build (review 1, finding 1: a boss lost three times has had the fight). */
export function grudgeCap(def: Pick<BattleDef, 'boss'>): number {
  return def.boss ? GRUDGE_MAX_BOSS : GRUDGE_MAX;
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
  /** A plain Attack does ARMOR_PLAIN_SHARE of its damage. */
  armored: boolean;
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
  bribable: boolean;
  /** Walked in mid-fight, paid by the boss (Hire Blades): a Bribe on them is refunded. */
  hired: boolean;
  /** In disguise and not found out yet (EnemyDef.disguise): the battle screen hides the HP bar. */
  masked: boolean;
  disguise?: { as: string; name?: string };
  /** The foe's own name, under a disguise. */
  trueName?: string;
  /** Never aims a blow at this party member (EnemyDef.avoid). */
  avoid?: string;
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
  /** The armies' volleys before the first turn (engine/war.ts volleysFor; Chapter 11). */
  volleys?: Volleys;
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
    mag: Math.round(line('mag') * role.mag * (def.magScale ?? 1)),
    spd: Math.round(line('spd') * role.spd),
  };
}

/**
 * Gianna's discount: a quarter less, rounded down, at least 1. Agni ki Shakti (Vikram, Chapter 8; PassiveEffect
 * `spLess`): so many SP less, at least 1.
 */
export function skillCost(skill: SkillDef, c: Pick<Combatant, 'anissaBond'> & { passives?: readonly PassiveEffect[] }): number {
  if (skill.sp <= 0) return 0;
  const less = (c.passives ?? []).reduce((n, p) => n + (p.kind === 'spLess' ? p.sp : 0), 0);
  const base = less > 0 ? Math.max(1, skill.sp - less) : skill.sp;
  return c.anissaBond ? Math.max(1, Math.floor(base * (1 - GIANNA_SP_DISCOUNT))) : base;
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
  /**
   * A Surge since the boss's current phase began: an `onSurge` phase answers a Surge made in the phase before it,
   * so a Surge spent early in the fight cannot carry a later phase in at once (Grimvald, Chapter 6; for Rael's first
   * phase it is the same as surgedOnce).
   */
  surgedInPhase = false;
  /** The boss's floor has held (its text shown), and the finale is owed before anyone else moves. */
  floorHeld = false;
  private finalePending = false;
  /** The boss's own turn count when he used his finisher. */
  private finisherAt: number | null = null;
  /** Once-per-battle enemy moves already used ("<key>:<move>"). */
  private readonly usedMoves = new Set<string>();
  private readonly reserve: Readonly<Record<string, EnemyDef>>;
  private readonly enemyHp: number;
  /** A disguise has been found out (SkillDef.reveal): the paper ones go by their own names from now on. */
  revealed = false;
  /** The volleys that open the fight (Chapter 11). */
  private readonly volleys: Volleys;

  constructor(def: BattleDef, party: readonly PartyEntry[], enemies: readonly EnemyDef[], items: readonly BattleItem[], opts: BattleOptions) {
    this.def = def;
    this.rng = new Rng(opts.seed);
    this.grudge = Math.min(grudgeCap(def), opts.grudge ?? 0);
    this.gold = opts.gold ?? 0;
    this.boost = wealthBoost(opts.wealth ?? 0);
    const diff = DIFFICULTY[opts.difficulty ?? 'story'];
    this.enemyDamage = diff.enemyDamage;
    this.enemyHp = diff.enemyHp;
    this.reserve = opts.reserve ?? {};
    this.volleys = opts.volleys ?? { count: 0, names: [] };
    this.items = items.map((i) => ({ ...i }));
    const seen = new Map<string, number>();
    // A duel: only the members it names fight (BattleDef.fighters).
    const roster = def.fighters ? party.filter((p) => def.fighters!.includes(p.id)) : party;
    const members: Combatant[] = roster.map((p, i) => ({
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
      armored: false,
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
      bribable: false,
      hired: false,
      masked: false,
    }));
    const foes: Combatant[] = enemies.map((e, idx) => {
      const n = (seen.get(e.id) ?? 0) + 1;
      seen.set(e.id, n);
      return this.foe(e, n, enemies.filter((x) => x.id === e.id).length > 1, idx);
    });
    this.combatants = [...members, ...foes];
    this.dealDisguises(foes);
    // Opening times: a share of a full delay, from the dice (COMBAT 3).
    for (const c of this.combatants) c.next = Math.round(turnDelay(c.spd) * (0.3 + this.rng.next() * 0.7));
    // Ironvow's Oath: her opening time is the lowest in the party.
    for (const c of members) {
      if (!c.active || !c.passives.some((x) => x.kind === 'opensFirst')) continue;
      const first = Math.min(...members.filter((m) => m.active && m !== c).map((m) => m.next));
      if (Number.isFinite(first) && c.next >= first) c.next = Math.max(0, first - 1);
    }
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
      armored: e.armored ?? false,
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
      bribable: !!e.bribable && !e.boss,
      hired: false,
      masked: !!e.disguise,
      disguise: e.disguise,
      trueName: e.disguise?.name ?? e.name,
      avoid: e.avoid,
    };
  }

  /**
   * Foes in disguise (the Paper Fox and his decoys) take the same name with a letter dealt at random, and shuffle their
   * places, so neither the name nor the place gives the real one away (the second review's 3.6).
   */
  private dealDisguises(foes: Combatant[]): void {
    const masked = foes.filter((f) => f.disguise);
    if (masked.length === 0) return;
    const letters = this.rng.shuffle(masked.map((_, i) => String.fromCharCode(65 + i)));
    const slots = this.rng.shuffle(masked.map((f) => f.slot));
    masked.forEach((f, i) => {
      f.name = `${f.disguise!.as} ${letters[i]}`;
      f.slot = slots[i]!;
    });
  }

  /** The disguised foes' next free letter (a decoy folded in mid-fight). */
  private nextDisguiseLetter(): string {
    const used = new Set(this.enemies.filter((e) => e.disguise).map((e) => e.name.slice(-1)));
    for (let i = 0; i < 26; i++) {
      const l = String.fromCharCode(65 + i);
      if (!used.has(l)) return l;
    }
    return '?';
  }

  /**
   * Kagemimi on a foe: its next move is told; and if it or anyone with it is in disguise, the disguise is found out.
   * The real one is named and Marked; the paper ones lose their protection and go by their own names.
   */
  private revealFrom(me: Combatant, t: Combatant): BattleEvent[] {
    const events: BattleEvent[] = [];
    const next = t.moves.find((m) => !!m.every && (t.phaseTurns + 1) % m.every === 0) ?? t.moves[0];
    if (next && !t.down) events.push({ kind: 'text', text: `${me.name} listens: ${t.name} means to use ${next.name} next.` });
    if (this.revealed || !this.enemies.some((e) => e.masked && !e.down)) return events;
    this.revealed = true;
    for (const e of this.enemies.filter((x) => x.disguise)) {
      e.masked = false;
      if (e.disguise!.name) {
        e.name = e.disguise!.name;
        if (!e.down) events.push(...this.giveStatus(e, 'marked'));
      } else {
        e.name = `${e.trueName ?? e.name} ${e.name.slice(-1)}`;
        e.protects = undefined;
      }
    }
    const real = this.enemies.find((e) => e.disguise?.name && !e.down);
    if (real) events.push({ kind: 'text', text: `${me.name} has heard which one breathes. ${real.name} is found out; the rest are only paper.` });
    return events;
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
    events.push(...this.openingVolleys());
    return [...events, ...this.advance()];
  }

  /**
   * The armies' volleys (Chapter 11; config.ts VOLLEY): each falls on every foe as a blow of VOLLEY.power at the active
   * fighters' mean ATK, DEF counting as against any blow, a boss taking VOLLEY.bossShare; a volley never fells.
   */
  private openingVolleys(): BattleEvent[] {
    const events: BattleEvent[] = [];
    const fighters = this.fighters.filter((f) => !f.down);
    if (this.volleys.count <= 0 || fighters.length === 0) return events;
    const atk = fighters.reduce((n, f) => n + f.atk, 0) / fighters.length;
    for (let i = 0; i < this.volleys.count; i++) {
      events.push({ kind: 'text', text: `${this.volleys.names[i] ?? 'The fleet'}: a volley!` });
      for (const e of this.enemies.filter((x) => !x.down)) {
        const raw = (atk * VOLLEY.power) / 100;
        const blow = Math.max(Math.ceil(raw * MIN_DAMAGE_SHARE), raw - e.def * 0.5) * (e.boss ? VOLLEY.bossShare : 1);
        const amount = Math.min(e.hp - 1, Math.max(1, Math.round(blow)));
        if (amount <= 0) continue;
        e.hp -= amount;
        events.push({ kind: 'damage', from: 'volley', to: e.key, amount, crit: false, surge: false, move: 'Volley', style: 'physical' });
      }
    }
    return events;
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
      this.surgedInPhase = true;
      return [{ kind: 'surge' }, { kind: 'spark', value: this.spark }, { kind: 'text', text: `Anissa's light gathers around ${me.name}.` }, ...this.phaseCheck()];
    }
    const events: BattleEvent[] = [];
    let weight: number = ACTION_WEIGHT.attack;
    const fellsBefore = me.fells;
    if (action.kind === 'attack') {
      const aimed = this.find(action.target);
      if (!aimed || aimed.down || aimed.side !== 'enemy') return [];
      const t = this.shield(aimed, events);
      events.push(...this.hit(me, t, 'Attack', me.bash, 'physical', undefined, true));
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
      weight = skill.weight ?? (skill.heavy ? ACTION_WEIGHT.heavy : isMove(skill) ? ACTION_WEIGHT.attack : ACTION_WEIGHT.skill);
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
    // Rakt Ki Pyaas (Vikram; PassiveEffect `turnOnFell`): a foe felled by this action, and his next turn comes at once.
    if (me.fells > fellsBefore && action.kind !== 'swap' && me.passives.some((p) => p.kind === 'turnOnFell') && this.enemies.some((e) => !e.down)) {
      weight = 0;
      events.push({ kind: 'text', text: `${me.name} does not stop to breathe: he goes again.` });
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
    // Hushed: no skills and no weapon moves (Chapter 9, the second review's 3.1, COMBAT 10's row): Attack, Guard and
    // Item only.
    if (c.statuses.some((st) => STATUS[st.id].noSkills)) return false;
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
    return new Battle(prev.def, party, enemies, items, { seed, grudge: Math.min(grudgeCap(prev.def), prev.grudge + GRUDGE_STEP) });
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
    let burn = 0;
    for (const st of c.statuses) {
      const share = STATUS[st.id].regen;
      if (share > 0) hp += Math.max(1, Math.round(c.maxHp * share));
      // Burning: a share of max HP lost (a boss's capped), never the last HP.
      if (share < 0) burn += Math.max(1, Math.round(c.maxHp * (c.boss ? Math.min(-share, BURNING_BOSS_SHARE) : -share)));
    }
    burn = Math.min(burn, c.hp - 1);
    if (burn > 0) {
      c.hp -= burn;
      events.push({ kind: 'text', text: `${c.name} burns (${burn}).` });
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
    // A foe who will not strike one of them (EnemyDef.avoid) aims only at the rest, and waits when they are all down.
    const targets = this.fighters.filter((p) => !p.down && p.key !== c.avoid);
    if (targets.length === 0) {
      if (c.avoid && this.fighters.some((p) => !p.down)) {
        events.push({ kind: 'text', text: `${c.name} lowers his blade. He will not strike her. He waits.` });
        c.next += turnDelay(spdOf(c), ACTION_WEIGHT.guard);
      }
      return events;
    }
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
    // Hire Blades: a blade walks in, paid by the boss (while fewer than HIRE_CAP hired ones stand).
    if (move.hire) {
      const blade = this.reserve[move.hire];
      const standing = this.enemies.filter((e) => e.hired && !e.down).length;
      if (blade && standing < HIRE_CAP) {
        events.push({ kind: 'use', who: c.key, name: move.name, targets: [] });
        const hired = this.walkIn(move.hire, blade);
        hired.hired = true;
        events.push({ kind: 'enter', who: hired.key });
        const nextHeavy = c.moves.find((m) => ready(m, c.phaseTurns + 1));
        if (nextHeavy?.tell) events.push({ kind: 'text', text: nextHeavy.tell }, ...this.tip('tell', this.def.tips?.tell));
        c.next += turnDelay(spdOf(c), ACTION_WEIGHT.attack);
        return events;
      }
      move = c.moves[0] ?? { name: 'Attack', power: 100 };
    }
    if (move.mirror) {
      // Sold Secrets: one fighter's file, read aloud, and their own best blow turned on them with his ATK.
      const t = this.rng.pick(reachable(targets));
      const best = t.skills.filter((s) => s.kind === 'damage' && !s.gold && s.power > 0).sort((x, y) => y.power - x.power)[0];
      const power = Math.max(move.power, best?.power ?? 0);
      const copied = best && best.power >= move.power ? best.name : move.name;
      events.push({ kind: 'use', who: c.key, name: move.name, targets: [t.key] });
      events.push({ kind: 'text', text: `${c.name} reads from a file with ${t.name}'s name on it: ${copied}.` });
      events.push(...this.strike(c, t, { ...move, name: `${move.name}: ${copied}`, power }));
    } else if (ally) {
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
  /** `plain`: the Attack command (a breastplate stops most of it). */
  private hit(a: Combatant, b: Combatant, move: string, power: number, type: 'physical' | 'magic', element?: Element, plain = false): BattleEvent[] {
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
    // A Surge shatters a wall of gold (the Golden Wall) before the blow lands.
    const walls = surge ? b.statuses.filter((st) => STATUS[st.id].shatter) : [];
    if (walls.length > 0) {
      b.statuses = b.statuses.filter((st) => !STATUS[st.id].shatter);
      for (const st of walls) events.push({ kind: 'status', to: b.key, status: st.id, on: false });
      events.push({ kind: 'text', text: `Anissa's light breaks through. The wall in front of ${b.name} shatters!` });
    }
    if (a.side === 'party') dmg *= 1 + this.grudge;
    if (a.side === 'enemy') dmg *= this.enemyDamage;
    for (const st of a.statuses) dmg *= STATUS[st.id].dealt;
    for (const st of b.statuses) dmg *= STATUS[st.id].taken;
    let affinity: 1 | -1 | undefined;
    // Immune (the Oil Wall: fire does nothing while it stands).
    const immune = !!element && b.statuses.some((st) => STATUS_IMMUNE[st.id]?.includes(element));
    if (immune) {
      events.push({ kind: 'text', text: `The fire runs off the oil around ${b.name}. Nothing burns there.` });
      events.push({ kind: 'damage', from: a.key, to: b.key, amount: 0, crit: false, surge, move, style: type, element, affinity: -1 });
      return events;
    }
    // Lit oil: from a phase that ignites, a fire blow on the boss sets him Burning (BattlePhase.ignite).
    if (element === 'fire' && b.boss && a.side === 'party' && this.def.phases?.slice(0, this.phase).some((p) => p.ignite)) {
      events.push(...this.giveStatus(b, 'burning'));
      events.push({ kind: 'text', text: `The oil at ${b.name}'s feet catches.` });
    }
    if (element && b.weak.includes(element)) {
      affinity = 1;
      dmg *= ELEMENT_WEAK;
    } else if (element && b.resist.includes(element)) {
      affinity = -1;
      dmg *= ELEMENT_RESIST;
    }
    if (plain && b.armored) {
      affinity = -1;
      dmg *= ARMOR_PLAIN_SHARE;
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
      // He yields, and the ones he paid walk out with him.
      if (this.def.endsWithBoss && b.boss) {
        for (const e of this.enemies.filter((x) => !x.down)) {
          e.down = true;
          events.push({ kind: 'withdraw', who: e.key });
        }
      }
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
    // Bribe: the purse changes hands and the foe walks out (a hired one was paid first: the gold comes back).
    if (skill.bribe) {
      for (const t of targets) {
        if (t.down) continue;
        if (!t.bribable) {
          this.goldSpent -= paid;
          events.push({ kind: 'text', text: `${t.name} is not for sale.` });
          continue;
        }
        t.down = true;
        events.push({ kind: 'withdraw', who: t.key }, { kind: 'text', text: `${t.name} takes the purse and walks out of the fight.` });
        if (t.hired) {
          this.goldSpent -= paid;
          events.push({ kind: 'text', text: 'The guild paid him first. Samira collects twice: the purse comes back.' });
        }
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
          const rolled =
            bought ||
            (skill.healShare !== undefined ? Math.max(1, Math.round(t.maxHp * skill.healShare)) : Math.round(((me.mag * skill.power) / 100) * (0.95 + this.rng.next() * 0.1)));
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
    if (skill.reveal) for (const t of targets) if (t.side === 'enemy') events.push(...this.revealFrom(me, t));
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
      const due = (p.below !== undefined && boss.hp <= boss.maxHp * p.below) || (!!p.onSurge && this.surgedInPhase);
      if (!due) break;
      this.phase++;
      this.surgedInPhase = false;
      if (p.moves) {
        boss.moves = p.moves;
        boss.phaseTurns = 0;
      }
      if (p.text) events.push({ kind: 'text', text: p.text, speaker: p.speaker });
      // Guards who step back as the phase starts (Rael's at the Broken Army), each with their own line.
      for (const e of this.enemies.filter((x) => !x.down && !!x.enemyId && (p.leave ?? []).includes(x.enemyId))) {
        e.down = true;
        events.push({ kind: 'withdraw', who: e.key });
        if (e.withdraws) events.push({ kind: 'text', text: e.withdraws.line, speaker: e.withdraws.speaker });
      }
      const ids = (p.enter ?? []).filter((id) => this.reserve[id]);
      if (ids.length && p.enterText) events.push({ kind: 'text', text: p.enterText });
      for (const id of ids) events.push({ kind: 'enter', who: this.walkIn(id, this.reserve[id]!).key });
    }
    return events;
  }

  /** A foe from the reserve walks into the fight (a phase's guards, a hired blade): a free place, half a turn's wait. */
  private walkIn(id: string, e: EnemyDef): Combatant {
    const n = this.enemies.filter((x) => x.enemyId === id).length + 1;
    const slot = [0, 1, 2, 3].find((k) => !this.enemies.some((x) => x.slot === k && !x.down)) ?? this.enemies.length;
    const c = this.foe(e, n, n > 1, slot);
    if (c.disguise) {
      if (this.revealed) {
        // Found out already: a fresh fold is plainly paper.
        c.masked = false;
        c.protects = undefined;
        c.name = `${c.trueName ?? c.name} ${this.nextDisguiseLetter()}`;
      } else c.name = `${c.disguise.as} ${this.nextDisguiseLetter()}`;
    }
    c.next = (this.actor?.next ?? 0) + Math.round(turnDelay(c.spd) * 0.5);
    this.combatants.push(c);
    return c;
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
  const fighters = members.filter((m: MemberDef) => !m.support);
  // A member who leads now (MemberDef.leads) fights right after the first fighter, ahead of the roster's order.
  const leading = fighters.filter((m, i) => i > 0 && !!m.leads && evaluate(m.leads, flags));
  const ordered = leading.length > 0 ? [fighters[0]!, ...leading, ...fighters.slice(1).filter((m) => !leading.includes(m))] : fighters;
  return ordered.map((m) => battleEntry(flags, rpg, m, book, withAnissa));
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

/** What a won ambush of `foes` at `groupLevel` pays a party at `party` level (AMBUSH_XP in config.ts). */
export function ambushXp(rpg: RpgContent, party: number, groupLevel: number, foes: number, rule: typeof AMBUSH_XP = AMBUSH_XP): number {
  const gap = xpForLevel(rpg, party + 1) - xpForLevel(rpg, party);
  const size = Math.min(foes, rule.maxFoes) / rule.sizeOf;
  const relative = clamp(1 + rule.perLevel * (groupLevel - party), rule.min, rule.max);
  return Math.max(1, Math.round(rule.share * gap * size * relative));
}

/** The XP a won battle pays now: its own, or an ambush's at the party's level. */
export function battleXp(flags: FlagReader, rpg: RpgContent, def: Pick<BattleDef, 'rewards' | 'ambush' | 'level'>): number {
  if (!def.ambush) return def.rewards.xp;
  return ambushXp(rpg, partyLevel(flags, rpg, 'present'), def.level ?? 1, def.ambush.foes);
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
  const xpWon = battleXp(flags, rpg, battle.def);
  addSharedXp(flags, xpWon);
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
  // The volleys a won fight opened with are spent (Chapter 11, engine/war.ts); a lost one gives them back.
  if (battle.def.volleys) {
    const asked = flags.get(volleysFlag(battle.def.id));
    const n = Math.max(0, Math.min(VOLLEY.cap, Math.floor(typeof asked === 'number' ? asked : 0)));
    if (n > 0) flags.set(spentFlag(battle.def.id), n);
  }
  return { xp: xpWon, gold: won, spent, items: [...(r.items ?? [])] };
}
