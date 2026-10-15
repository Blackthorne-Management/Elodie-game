// Battles (engine/battle.ts runs them; scenes/BattleScene.ts draws them): skills by member, the enemies,
// and each scripted fight. Chapter 1 has one (owner decision, Oct 15): on the Cane Road, Gianna and
// Anissa run into a boar, which teaches the commands, Anissa's Spark and Surge, and her light.
// Numbers follow docs/quest/design/COMBAT.md.

import { ANISSA_SP_EVERY, BATTLE_ACTIVE, SPARK_ON_GUARD, SURGE_COST } from '../config.ts';
import type { BattleDef, EnemyDef, SkillDef } from '../engine/battle.ts';
import type { SkillBook } from '../engine/skills.ts';
import { BOOKS } from './books.ts';

// Skills grow (owner decision, Oct 15): mages learn spells by level and from library books, spells rank
// up (II, III) at set levels, and only a few can be equipped (config SPELL_SLOTS); attackers have many
// weapon moves with cooldowns and few SP skills; rare or better gear brings one more, free.

/** The library books of Pòdlimyè (reading five teaches Mend). */
const ZETWAL_BOOKS = BOOKS.filter((b) => b.id.startsWith('zetwal_')).map((b) => b.id);

/** SP skills by member: a mage's spells (equipped into slots), an attacker's few skills. */
export const SKILLS: Readonly<Record<string, readonly SkillDef[]>> = {
  gianna: [
    {
      id: 'sunthread', name: 'Sunthread', sp: 5, kind: 'damage', power: 120, target: 'enemy', element: 'light', text: 'A thread of light at one foe.',
      ranks: [
        { level: 5, power: 140, statuses: ['marked'], text: 'A thread of light at one foe, and it stays marked.' },
        { level: 12, power: 165 },
      ],
    },
    {
      id: 'limye_elodie', name: 'Limyè Elodie', sp: 6, kind: 'heal', power: 150, target: 'ally', element: 'light', text: "Elodie's light heals one ally.",
      ranks: [
        { level: 6, power: 175, cleanse: true, text: "Elodie's light heals one ally and clears what ails them." },
        { level: 14, power: 200 },
      ],
    },
    {
      id: 'benediksyon', name: 'Benediksyon', sp: 4, kind: 'status', power: 0, target: 'ally', statuses: ['inspired'], learn: { level: 2 },
      text: 'A blessing: one ally deals a quarter more damage for 3 turns.',
      ranks: [{ level: 9, statuses: ['warded'], text: 'A blessing: one ally deals a quarter more and takes a quarter less, for 3 turns.' }],
    },
    {
      id: 'mend', name: 'Mend', sp: 5, kind: 'status', power: 0, target: 'ally', statuses: ['regen'],
      learn: { lore: { books: ZETWAL_BOOKS, count: 5, where: 'Pòdlimyè library' } },
      text: 'Learned from the archive: one ally heals a little each turn for 3 turns.',
      ranks: [{ level: 10, statuses: ['warded'] }],
    },
    {
      id: 'limye_pou_tout', name: 'Limyè pou Tout', sp: 10, kind: 'heal', power: 80, target: 'allAllies', element: 'light', learn: { level: 4 },
      text: 'Light for all: heals the whole party a little.',
      ranks: [{ level: 11, power: 100 }],
    },
  ],
  yari: [
    { id: 'trackers_mark', name: "Tracker's Mark", sp: 4, kind: 'status', power: 0, target: 'enemy', statuses: ['marked'], text: 'Marks one foe: it takes a quarter more damage for 3 turns.' },
    { id: 'arrow_rain', name: 'Arrow Rain', sp: 9, kind: 'damage', stat: 'atk', power: 75, target: 'allEnemies', element: 'wind', learn: { level: 6 }, text: 'Arrows on the wind, at every foe.' },
  ],
};

/** Weapon moves by member: no SP, a cooldown in the user's own turns (0: any time). */
export const MOVES: Readonly<Record<string, readonly SkillDef[]>> = {
  yari: [
    { id: 'quick_shot', name: 'Quick Shot', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A fast arrow. Ready every turn.' },
    {
      id: 'aimed_shot', name: 'Aimed Shot', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 160, target: 'enemy', text: 'Draw, breathe, loose: a heavy arrow. Needs 2 turns to ready again.',
      ranks: [{ level: 10, power: 185 }],
    },
    { id: 'pinning_shot', name: 'Pinning Shot', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 80, target: 'enemy', statuses: ['slowed'], learn: { level: 2 }, text: 'Pins a foe: its turns come slower for 3 turns.' },
    { id: 'volley', name: 'Volley', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 60, target: 'randomEnemies', hits: 3, learn: { level: 4 }, text: 'Three arrows at random foes.' },
  ],
  patricio: [
    { id: 'slash', name: 'Slash', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A clean cut. Ready every turn.' },
    { id: 'heavy_blow', name: 'Heavy Blow', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 170, target: 'enemy', text: 'Both hands on the hilt. Needs 2 turns to ready again.' },
    { id: 'sweep', name: 'Sweep', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 70, target: 'allEnemies', text: 'A wide cut at every foe.' },
    { id: 'hold_the_line', name: 'Hold the Line', sp: 0, cooldown: 4, kind: 'status', power: 0, target: 'self', statuses: ['taunting', 'warded'], text: 'Draws every blow to him, and takes them better, for 2 turns.' },
  ],
};

/** Skills that come with rare or better gear (ItemDef.skill), free: they never take a spell slot. */
export const GEAR_SKILLS: Readonly<Record<string, SkillDef>> = {
  lantern_flare: { id: 'lantern_flare', name: 'Ember Flare', sp: 5, kind: 'damage', power: 110, target: 'enemy', element: 'fire', text: 'A flare of embers: fire at one foe.' },
  briar_snare: { id: 'briar_snare', name: 'Briar Snare', sp: 5, kind: 'damage', power: 90, target: 'enemy', element: 'earth', statuses: ['slowed'], text: 'Thorns burst from the ground and hold one foe: it is slowed.' },
  dawn_glaive: { id: 'dawn_glaive', name: 'Dawnlight', sp: 9, kind: 'damage', power: 100, target: 'allEnemies', element: 'light', text: 'Dawn breaks across every foe: light at all of them.' },
  tidewash: { id: 'tidewash', name: 'Tidewash', sp: 5, kind: 'heal', power: 90, target: 'ally', element: 'water', cleanse: true, text: 'A cool wave heals one ally and clears what ails them.' },
  falling_star: { id: 'falling_star', name: 'Falling Star', sp: 9, kind: 'damage', power: 200, target: 'enemy', element: 'light', text: 'A star shard falls on one foe.' },
  archive_ward: { id: 'archive_ward', name: 'Archive Ward', sp: 8, kind: 'status', power: 0, target: 'allAllies', statuses: ['warded'], text: 'The old names stand guard: the whole party takes a quarter less damage for 3 turns.' },
  storm_shot: { id: 'storm_shot', name: 'Storm Shot', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 120, target: 'enemy', element: 'wind', statuses: ['slowed'], text: 'A crackling shot on the wind: the foe is slowed.' },
  spirit_arrow: { id: 'spirit_arrow', name: 'Spirit Arrow', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 110, target: 'enemy', statuses: ['marked'], text: 'An arrow the ancestors guide: the foe is marked.' },
  sunburst_arrow: { id: 'sunburst_arrow', name: 'Sunburst Arrow', sp: 0, cooldown: 4, kind: 'damage', stat: 'atk', power: 90, target: 'allEnemies', element: 'light', text: 'An arrow that bursts like the sun over every foe.' },
  moonlit_shot: { id: 'moonlit_shot', name: 'Moonlit Shot', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 170, target: 'enemy', element: 'water', text: 'A heavy shot like the tide pulled by the moon.' },
  hurricane_volley: { id: 'hurricane_volley', name: 'Hurricane Volley', sp: 0, cooldown: 4, kind: 'damage', stat: 'atk', power: 55, target: 'randomEnemies', hits: 5, element: 'wind', text: 'Five arrows on a storm wind, at random foes.' },
  sun_arrow: { id: 'sun_arrow', name: 'Sun Arrow', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 140, target: 'enemy', element: 'light', text: 'A gold-banded shot that burns with light.' },
  warm_thread: { id: 'warm_thread', name: 'Warm Thread', sp: 3, kind: 'status', power: 0, target: 'ally', statuses: ['regen'], text: 'The stitched sun warms one ally: they heal a little each turn.' },
  say_their_names: {
    id: 'say_their_names', name: 'Say Their Names', sp: 16, kind: 'revive', power: 30, target: 'allAllies', once: true,
    text: 'Once per battle: every fallen ally rises with 30% HP, and Anissa gains Spark.',
  },
};

export const SKILL_BOOK: SkillBook = { skills: SKILLS, moves: MOVES, gear: GEAR_SKILLS };

export const ENEMIES: Readonly<Record<string, EnemyDef>> = {
  // The cane-field boar (kochon mawon): a brute, with a charge it warns about a turn ahead.
  boar: {
    id: 'boar',
    name: 'Cane-field boar',
    look: 'boar',
    level: 3,
    role: 'brute',
    moves: [
      { name: 'Tusk', power: 100 },
      { name: 'Charge', power: 150, every: 3, tell: 'The boar lowers its head and paws at the dirt...' },
    ],
  },
};

export const BATTLES: Readonly<Record<string, BattleDef>> = {
  intro_boar: {
    id: 'intro_boar',
    title: 'The Cane Road',
    backdrop: 'cane_road',
    enemies: ['boar'],
    table: 'wilds',
    group: 'boar',
    rewards: { xp: 40, gold: 12, items: [{ id: 'boar_tusk', n: 1 }] },
    tips: {
      start: "Gigi, your staff won't hurt it much. Your light will. Skill, then Sunthread.",
      spark: 'I can feel it, Gigi. Let me help. Choose Surge.',
      tell: "It's going to charge! Guard, Gigi!",
      lowHp: "You're hurt. Heal yourself, or drink the soup.",
    },
    // The tutorial (owner, Oct 15): how to fight, skills, Anissa, rows and gear. Shown when the boar
    // fight begins (not again after a loss), and a page on the spoils after the win.
    tutorial: {
      start: [
        {
          title: 'How to fight',
          text: 'Fights go in turns; who acts next is shown top right. On your turn, choose a command (bottom right), then a target. Tap them, or use the arrows and A.',
        },
        {
          title: 'Attack and targets',
          text: 'Attack strikes one foe with your weapon. An arrow shows who you are aiming at: arrows move it, A confirms, B goes back. A staff barely hurts. A bladed one does.',
        },
        {
          title: 'Skills and SP',
          text: "Skill opens spells that cost SP (the blue bar). Gianna's Sunthread is a ray of light, far stronger than her staff. Some skills hit every foe, heal, protect, or add a status: ATK+, WARD, MARK.",
        },
        {
          title: 'Weapon moves',
          text: 'Fighters with weapons (Yari\'s bow, later blades) get moves under Attack. Strong moves need time to ready again: the number beside one is the turns left.',
        },
        {
          title: 'Guard and Item',
          text: 'Guard halves the damage you take until your next turn. Use it when a foe warns of a big blow. Item gives food and drink from your bag to anyone: soup heals, akasan restores SP.',
        },
        {
          title: 'Anissa: Spark and Surge',
          text: `Anissa never fights and can never be hit. Each thing Gianna does gives her a Spark (Guard gives ${SPARK_ON_GUARD}). At ${SURGE_COST}, Surge appears: free, and Gianna's next blow or spell hits half again as hard.`,
        },
        {
          title: "Anissa's Light",
          text: `Her gift is always on: every ${ANISSA_SP_EVERY} of Gianna's turns, Anissa's light gives back a fifth of Gianna's SP. The pips over Anissa's head are her Spark.`,
        },
        {
          title: 'Rows and Swap',
          text: `Up to ${BATTLE_ACTIVE} fight at once. Blades stand in front and shield the mages and archers behind from single blows; area attacks hit everyone. Swap trades places with someone waiting; the fallen are replaced at once.`,
        },
        {
          title: 'Gear and spells',
          text: 'Outside a fight, open Menu > Equip and choose someone, then a slot, to change weapon, armor, charm or relic. Rare gear brings its own skill (* in battle). Mages choose which spells to carry under Spells.',
        },
      ],
      after: [
        {
          title: 'Spoils',
          text: 'Wins bring XP, gold, and sometimes gear. New levels raise stats and teach spells. The boar left a tusk on a cord: wear it from Menu > Equip > Gianna > Charm.',
        },
      ],
    },
  },
};
