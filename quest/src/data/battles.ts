// Battles (engine/battle.ts runs them; scenes/BattleScene.ts draws them): skills by member, the enemies,
// and each scripted fight. Chapter 1 has one (owner decision, Oct 15): on the Cane Road, Gianna and
// Anissa run into a boar, which teaches the commands, Anissa's Spark and Surge, and her light.
// Numbers follow docs/quest/design/COMBAT.md.

import { ANISSA_SP_EVERY, BATTLE_ACTIVE, ENCOUNTER_GOLD_PER_LEVEL, ENCOUNTER_XP_PER_LEVEL, SPARK_ON_GUARD, SURGE_COST, TRIAL_TURNS_AFTER_FINISHER } from '../config.ts';
import { ENCOUNTERS } from './encounters.ts';
import type { BattleDef, EnemyDef, EnemyMove, SkillDef } from '../engine/battle.ts';
import type { SkillBook } from '../engine/skills.ts';
import { BOOKS } from './books.ts';

// Skills grow (owner decision, Oct 15): mages learn spells by level and from library books, spells rank
// up (II, III) at set levels, and only a few can be equipped (config SPELL_SLOTS); attackers have many
// weapon moves with cooldowns and few SP skills; rare or better gear brings one more, free.

/** The library books of Pòdlimyè (reading five teaches Mend). */
const ZETWAL_BOOKS = BOOKS.filter((b) => b.id.startsWith('zetwal_')).map((b) => b.id);
/** La Biblioteca Vieja's six (reading five teaches Ember Ward; the Alcázar's two shelf books do not count). */
const ARDENCIA_LIBRARY = ['ardencia_brasador_count', 'ardencia_cendre', 'ardencia_oaths', 'ardencia_witness', 'ardencia_iron_trade', 'ardencia_kitchen_maids'];

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
      id: 'ember_ward', name: 'Ember Ward', sp: 7, kind: 'status', power: 0, target: 'ally', statuses: ['warded', 'regen'],
      learn: { lore: { books: ARDENCIA_LIBRARY, count: 5, where: 'La Biblioteca Vieja' } },
      text: 'Learned in Cenizal: a ward of warm ash on one ally. They take a quarter less damage and heal a little, for 3 turns.',
    },
    {
      id: 'limye_pou_tout', name: 'Limyè pou Tout', sp: 10, kind: 'heal', power: 80, target: 'allAllies', element: 'light', learn: { level: 4 },
      text: 'Light for all: heals the whole party a little.',
      ranks: [{ level: 11, power: 100 }],
    },
  ],
  // Azzy (COMBAT 9.3): his skills come from the board's Brasador abilities.
  azzy: [
    {
      id: 'la_marca', name: 'La Marca', sp: 4, kind: 'status', power: 0, target: 'enemy', statuses: ['marked'],
      text: 'He marks one foe for the house: it takes a quarter more damage for 3 turns.',
    },
    {
      id: 'grito_de_guerra', name: 'Grito de Guerra', sp: 7, kind: 'status', power: 0, target: 'enemy', statuses: ['stunned'], bossChance: 0.5,
      text: 'A war cry: one foe loses its next action (a boss only half the time).',
    },
    {
      id: 'reinado_de_cenizas', name: 'Reinado de Cenizas', sp: 12, kind: 'damage', stat: 'atk', power: 120, powerPerFell: 40, target: 'enemy', element: 'fire',
      once: true, heavy: true, text: 'Once per battle: a burning blow, stronger for every foe already felled.',
    },
  ],
  // Samira (COMBAT 9.6; owner approved Oct 20: Daftar spends gold). Each Daftar costs 20 gold plus 10 per level
  // (Claude's call, so it keeps pace with the fights): 10 HP or 10 damage for every 20 gold, and the realm's
  // Wealth adds up to 30%; 60 gold buys Inspired.
  samira: [
    {
      id: 'tonic', name: 'Tonic', sp: 6, kind: 'heal', power: 110, target: 'ally', cleanse: true,
      text: 'A bitter tonic: heals one ally and clears what ails them.',
    },
    {
      id: 'daftar_mend', name: 'Daftar: Remedy', sp: 0, gold: { base: 20, perLevel: 10 }, goldRate: 0.5, kind: 'heal', power: 0, target: 'ally',
      text: 'She pays for the best: one ally heals 10 HP for every 20 gold spent.',
    },
    {
      id: 'daftar_strike', name: 'Daftar: Hired Blade', sp: 0, gold: { base: 20, perLevel: 10 }, goldRate: 0.5, kind: 'damage', power: 0, target: 'enemy',
      text: 'Gold buys a blow no armour stops: 10 damage for every 20 gold spent.',
    },
    {
      id: 'daftar_favour', name: 'Daftar: Patronage', sp: 0, gold: { base: 60 }, kind: 'status', power: 0, target: 'ally', statuses: ['inspired'],
      text: 'A purse for courage: one ally is Inspired for 3 turns (60 gold).',
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
  azzy: [
    { id: 'slash', name: 'Slash', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A clean cut. Ready every turn.' },
    { id: 'heavy_blow', name: 'Heavy Blow', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 170, target: 'enemy', text: 'Both hands on the hilt. Needs 2 turns to ready again.' },
    { id: 'sweep', name: 'Sweep', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 70, target: 'allEnemies', text: 'A wide cut at every foe.' },
  ],
  caona: [
    { id: 'quick_shot', name: 'Quick Shot', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A fast arrow. Ready every turn.' },
    { id: 'pinning_shot', name: 'Pinning Shot', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 80, target: 'enemy', statuses: ['slowed'], text: 'Pins a foe: its turns come slower for 3 turns.' },
    { id: 'scouts_mark', name: "Scout's Mark", sp: 0, cooldown: 3, kind: 'status', power: 0, target: 'enemy', statuses: ['marked'], text: 'She has watched this foe for a week: it takes a quarter more damage for 3 turns.' },
  ],
  // Young Lord Benny of Ardencia in the Echo party (from the end of Chapter 3, once Azzy has joined).
  benny: [
    { id: 'slash', name: 'Slash', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A clean cut. Ready every turn.' },
    { id: 'heavy_blow', name: 'Heavy Blow', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 170, target: 'enemy', text: 'Both hands on the hilt. Needs 2 turns to ready again.' },
    { id: 'brasador_mark', name: 'La Marca', sp: 0, cooldown: 3, kind: 'status', power: 0, target: 'enemy', statuses: ['marked'], text: 'He marks one foe for the house: it takes a quarter more damage for 3 turns.' },
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
    // The first fight teaches (demo review, Oct 17): it lasts about four of Gianna's turns, long enough
    // for its Charge warning, Anissa's Light and, for a player who Guards, a Surge (tools: the boar
    // balance check in tests/battle.test.ts).
    hpScale: 4,
    moves: [
      { name: 'Tusk', power: 100 },
      { name: 'Charge', power: 150, every: 3, tell: 'The boar lowers its head and paws at the dirt...' },
    ],
  },
  // Chapter 2 (COMBAT.md 13.2): the Crown's marines on Yucayeque's pier. Drawn from their townsfolk sprites
  // (facing left) until art drop 2 brings painted enemies.
  crown_marine: {
    id: 'crown_marine',
    name: 'Crown Marine',
    look: 'crown_marine',
    level: 3,
    role: 'skirmisher',
    moves: [{ name: 'Bayonet', power: 110 }],
  },
  // The ambushes (COMBAT.md 13.2; owner rule Oct 17: nothing harmless, every foe can hurt). Levels come from
  // the encounter group. People are drawn from their walking sprites until art drop 2.
  crown_musketeer: {
    id: 'crown_musketeer',
    name: 'Crown Musketeer',
    look: 'crown_musketeer',
    level: 5,
    role: 'caster',
    moves: [
      { name: 'Bayonet jab', power: 90 },
      { name: 'Volley', power: 180, every: 2, tell: 'The musketeer kneels and takes aim...' },
    ],
  },
  road_bandit: {
    id: 'road_bandit',
    name: 'Road Bandit',
    look: 'road_bandit',
    level: 4,
    role: 'skirmisher',
    moves: [
      { name: 'Knife', power: 110 },
      { name: 'Dirty trick', power: 150, every: 3, tell: 'The bandit grins and palms a fistful of sand...' },
    ],
  },
  mangrove_crab: {
    id: 'mangrove_crab',
    name: 'Mangrove Crab',
    look: 'mangrove_crab',
    level: 4,
    role: 'tank',
    moves: [
      { name: 'Pinch', power: 100 },
      { name: 'Crushing claw', power: 160, every: 3, tell: 'The crab raises its great claw, very slowly...' },
    ],
    weak: ['fire', 'light'],
  },
  qc_zealot: {
    id: 'qc_zealot',
    name: 'Quiet Crown Zealot',
    look: 'quiet_crown_m_deep',
    level: 6,
    role: 'caster',
    moves: [
      { name: 'Frighten', power: 70, area: true },
      { name: 'Hush', power: 140, every: 3, tell: 'The zealot raises one finger to his veil. "Hush..."' },
    ],
    resist: ['light'],
  },
  smuggler: {
    id: 'smuggler',
    name: 'Smuggler',
    look: 'smuggler',
    level: 7,
    role: 'brute',
    moves: [
      { name: 'Cudgel', power: 110 },
      { name: 'Crate throw', power: 140, every: 3, tell: 'The smuggler hoists a Crown-stamped crate overhead...' },
    ],
  },
  lookout: {
    id: 'lookout',
    name: 'Lookout',
    look: 'lookout',
    level: 6,
    role: 'skirmisher',
    moves: [{ name: 'Sling', power: 100 }],
  },
  // The night of the attack (Oct 17): the officer leading the marines into the caney.
  marine_lieutenant: {
    id: 'marine_lieutenant',
    name: 'Marine lieutenant',
    look: 'marine_lieutenant',
    level: 6,
    role: 'brute',
    moves: [
      { name: 'Saber', power: 110 },
      { name: 'Hold the doors', power: 160, every: 3, tell: 'The lieutenant raises his saber: "Marines! Present!"' },
    ],
  },
  // Chapter 2's boss (Oct 17): the Governor himself, at the sea mouth of the canoes' cave.
  thorne: {
    id: 'thorne',
    name: 'Governor Thorne',
    look: 'thorne',
    level: 8,
    role: 'tank',
    moves: [
      { name: 'Sword cane', power: 110 },
      { name: 'Pistol shot', power: 190, every: 3, tell: 'Thorne cocks a silver pistol and takes his time aiming...' },
      { name: 'The Charter, read aloud', power: 80, area: true, every: 4, tell: 'Thorne unrolls the Charter: "Clause the seventh..."' },
    ],
    weak: ['light'],
  },
  // ---- Chapter 3, Ardencia (outline section 5; review section 7) ----------------------------------------
  // The Cinder Flats: salamanders in the hot cracks, bats in the lava tubes (drawn: ENEMY_ART), and Brasador
  // halberdiers (drawn from their walking sprites until art drop 2).
  cinder_salamander: {
    id: 'cinder_salamander',
    name: 'Cinder Salamander',
    look: 'cinder_salamander',
    level: 8,
    role: 'caster',
    moves: [
      { name: 'Ember Spit', power: 95, magic: true },
      { name: 'Flare', power: 150, magic: true, every: 3, tell: 'The salamander swells, its back glowing white...' },
    ],
    weak: ['water'],
    resist: ['fire'],
  },
  cave_bat: {
    id: 'cave_bat',
    name: 'Cave Bat',
    look: 'cave_bat',
    level: 8,
    role: 'skirmisher',
    // Screech (COMBAT's Fogged is not built: Claude's call, Oct 21): it leaves the party Weakened instead.
    moves: [
      { name: 'Bite', power: 95 },
      { name: 'Screech', power: 60, area: true, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The bats wheel up into the roof, all at once...' },
    ],
    weak: ['light'],
  },
  brasador_halberdier: {
    id: 'brasador_halberdier',
    name: 'Brasador Halberdier',
    look: 'brasador_halberdier',
    level: 9,
    role: 'tank',
    moves: [
      { name: 'Halberd', power: 105 },
      { name: 'Hook', power: 90, statuses: ['stunned'], chance: 0.5, every: 3, tell: 'The halberdier turns his blade, hook first...' },
    ],
  },
  // The Trial of Blades (the outline 4.2, retuned by its review 3.3 and 7): Rael, Lord of Ardencia, level 13, a
  // tank at 3 times HP and 1.2 ATK, wearing La Promesa de Benny (owner decision 2: its Last Stand is his
  // HP floor). He never targets Anissa (she cannot be hit): his Seize goes for her Spark and Gianna steps in.
  // Phase 1 is his alone; Captain Azriel Rivera and Jaime walk in at phase 2.
  rael: {
    id: 'rael',
    name: 'Rael',
    look: 'rael',
    level: 13,
    role: 'tank',
    boss: true,
    hpScale: 3,
    atkScale: 1.2,
    atkPerBound: 0.1,
    floor: { hp: 1, text: 'La Promesa de Benny glows on his wrist. Rael stands.' },
    moves: [
      { name: 'Sword', power: 110 },
      { name: 'La Marca', power: 90, statuses: ['marked'], every: 2 },
      { name: 'Seize', power: 0, seize: 3, statuses: ['marked'], turns: 2, every: 3, tell: 'He is looking at Anissa, not at you.' },
    ],
  },
  // Captain Azriel Rivera of the royal guard (owner direction, Oct 21): the wall. Most blows meant for Rael go to
  // him; at 0 HP he steps back from the sand.
  rivera: {
    id: 'rivera',
    name: 'Captain Rivera',
    look: 'rivera',
    level: 13,
    role: 'tank',
    protects: 'rael',
    withdraws: { line: 'Stand back, Captain.', speaker: 'Rael' },
    moves: [
      { name: 'Halberd', power: 100 },
      { name: 'Hook', power: 85, statuses: ['stunned'], chance: 0.5, every: 3, tell: 'Rivera turns his halberd, hook first, and watches Yari...' },
    ],
  },
  // Jaime, Rael's advisor and a strong mage: a ward on his lord, and one area spell he takes his time over.
  jaime: {
    id: 'jaime',
    name: 'Jaime',
    look: 'jaime',
    level: 13,
    role: 'caster',
    withdraws: { line: 'Enough, Jaime. Step back.', speaker: 'Rael' },
    moves: [
      { name: 'Ash Bolt', power: 85, magic: true },
      { name: 'Ward of Ash', power: 0, ally: 'rael', statuses: ['warded'], every: 3 },
      { name: 'Ash Storm', power: 100, magic: true, area: true, every: 4, tell: 'Jaime lifts both hands. The air over the sand begins to burn...' },
    ],
  },
  marine_sergeant: {
    id: 'marine_sergeant',
    name: 'Marine sergeant',
    look: 'marine_sergeant',
    level: 4,
    role: 'brute',
    moves: [
      { name: 'Rifle butt', power: 100 },
      { name: 'Fix bayonets', power: 150, every: 3, tell: 'The sergeant barks: "Fix bayonets!" Steel glints...' },
    ],
  },
};

/** Rael's moves once the guards are in (phase 2, Unleashed) and once he is cornered (phase 3). */
const RAEL_UNLEASHED: readonly EnemyMove[] = [
  { name: 'Sword', power: 110 },
  { name: 'Grito de Guerra', power: 60, statuses: ['stunned'], every: 2, tell: 'Rael draws a long breath. The gallery goes quiet...' },
  { name: 'La Marca', power: 90, statuses: ['marked'], every: 3 },
];
const RAEL_CORNERED: readonly EnemyMove[] = [
  { name: 'Sword', power: 115 },
  {
    name: 'Reinado de Cenizas', power: 130, powerPerBound: 40, area: true, every: 2, once: true,
    tell: 'Rael lifts his blade over his head. The sand around him starts to smoke. Guard, everyone!',
  },
];

export const BATTLES: Readonly<Record<string, BattleDef>> = {
  // Chapter 3: the Trial of Blades (meant to be lost: no goddess, no count, no Grudge, no Yield; outline 4.2 and
  // its review). Members are Bound at 0 HP. Rael wins whatever the party does: he ends it at the first of every
  // fighter Bound, La Promesa holding him at 1 HP, three of his turns after Reinado de Cenizas, or the round cap.
  rael_trial: {
    id: 'rael_trial',
    title: 'The Trial of Blades',
    backdrop: 'duel_court',
    enemies: ['rael'],
    table: 'ardencia_story',
    group: 'rael',
    rewards: { xp: 0, gold: 0 },
    meantToLose: { scene: 'rael_after', set: { 'story.trial_fought': true } },
    binds: true,
    phases: [
      {
        below: 0.66,
        onSurge: true,
        speaker: 'Rael',
        text: 'Good.',
        moves: RAEL_UNLEASHED,
        enter: ['rivera', 'jaime'],
        enterText: 'Captain Rivera and Jaime step onto the sand beside their lord.',
      },
      { below: 0.33, speaker: 'Rael', text: 'Again.', moves: RAEL_CORNERED },
    ],
    finale: {
      boss: 'rael',
      line: 'Enough.',
      move: 'Cenizas',
      text: 'Ash rises off the sand in a ring. When it settles, every one of them is on their knees, cords at their wrists.',
      finisher: 'Reinado de Cenizas',
      turnsAfter: TRIAL_TURNS_AFTER_FINISHER,
    },
    tips: {
      start: 'Gigi... he isn\'t angry. That\'s worse.',
      spark: 'Take my light, Gigi. Now.',
      tell: 'Guard, Gigi! Yari!',
      lowHp: 'Heal, Gigi. Please.',
    },
  },
  // Chapter 3: Benny's tunnel (outline beat 8): Azzy's first fight, in the front row. Paid below the ambush rule on
  // purpose (the outline's levels table counts 120 XP).
  tunnel_bats: {
    id: 'tunnel_bats',
    title: "Benny's Tunnel",
    backdrop: 'lava_tube',
    enemies: ['cave_bat', 'cave_bat', 'cave_bat'],
    level: 10,
    table: 'ardencia_story',
    group: 'bats',
    rewards: { xp: 120, gold: 40 },
    tips: {
      start: 'Azzy is in front now, Gigi. They can\'t reach you past him. Let him mark one with La Marca.',
      spark: 'Surge, Gigi!',
      tell: 'They\'re going to scream! Guard!',
      lowHp: 'Heal, Gigi!',
    },
  },
  // Chapter 2: the first fight in Yucayeque, on the pier the ferry lands at.
  pier_marines: {
    id: 'pier_marines',
    title: 'The Pier',
    backdrop: 'yucayeque_pier',
    enemies: ['crown_marine', 'crown_marine', 'marine_sergeant'],
    table: 'xaragua_story',
    group: 'pier',
    rewards: { xp: 60, gold: 30, items: [{ id: 'casabe', n: 2 }] },
    tips: {
      start: 'Three of them, Gigi. Yari will shoot. Your light hits hardest.',
      spark: 'Now, Gigi! Surge!',
      tell: "The sergeant's men are fixing bayonets! Guard!",
      lowHp: "You're hurt. Eat something, or heal.",
    },
  },
  // The Crown attack (Oct 17): marines storm the caney while the elders get out the back.
  caney_breach: {
    id: 'caney_breach',
    title: 'The Caney',
    backdrop: 'yucayeque_night',
    enemies: ['crown_marine', 'crown_musketeer', 'marine_lieutenant'],
    level: 6,
    table: 'xaragua_story',
    group: 'caney',
    rewards: { xp: 120, gold: 50, items: [{ id: 'casabe', n: 1 }] },
    tips: {
      start: 'They are between us and the elders, Gigi! Hold them!',
      spark: 'Surge, Gigi! Now!',
      tell: 'The lieutenant is calling a volley! Guard!',
      lowHp: 'Heal, Gigi, please!',
    },
  },
  // The way out: the sergeant from the pier, with a patrol, on the village trail west.
  village_patrol: {
    id: 'village_patrol',
    title: 'The Harbor at Night',
    backdrop: 'yucayeque_night',
    enemies: ['crown_marine', 'crown_musketeer', 'marine_sergeant'],
    level: 6,
    table: 'xaragua_story',
    group: 'patrol',
    rewards: { xp: 90, gold: 40 },
    tips: {
      start: 'The sergeant again! He never learns.',
      spark: 'Surge!',
      tell: 'Bayonets! Guard!',
      lowHp: "You're hurt, Gigi.",
    },
  },
  // Chapter 2's boss: Thorne and his longboat's crew at the sea mouth (the escape).
  thorne_blockade: {
    id: 'thorne_blockade',
    title: 'Governor Thorne',
    backdrop: 'yucayeque_night',
    enemies: ['thorne', 'crown_marine', 'crown_musketeer'],
    level: 9,
    table: 'xaragua_story',
    group: 'thorne',
    rewards: { xp: 220, gold: 120 },
    tips: {
      start: 'It\'s him, Gigi! The marines first, or Thorne first?',
      spark: 'All my light, Gigi! Surge!',
      tell: 'He\'s aiming! Guard!',
      lowHp: 'Gigi, heal! Please!',
    },
  },
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
    // The tutorial (owner, Oct 15; split after the demo review, Oct 17): three pages before the first turn,
    // each of Anissa's gifts and weapon moves the first time they come up, rows and gear after the win.
    tutorial: {
      start: [
        {
          title: 'How to fight',
          text: 'Fights go in turns; who acts next is shown top right. On your turn, choose a command (bottom right), then a target: an arrow shows who. Tap them, or use the arrows and A; B goes back.',
        },
        {
          title: 'Attack and Skill',
          text: "Attack strikes with your weapon; a staff barely hurts. Skill opens spells that cost SP (the blue bar). Gianna's Sunthread is a ray of light, far stronger than her staff.",
        },
        {
          title: 'Guard and Item',
          text: 'Guard halves the damage you take until your next turn. Use it when a foe warns of a big blow. Item gives food and drink from your bag to anyone: soup heals, akasan restores SP.',
        },
      ],
      moments: {
        moves: [
          {
            title: 'Weapon moves',
            text: 'Fighters with weapons (Yari\'s bow, later blades) get moves under Attack. Strong moves need time to ready again: the number beside one is the turns left.',
          },
        ],
        light: [
          {
            title: "Anissa's Light",
            text: `Her gift is always on: every ${ANISSA_SP_EVERY} of Gianna's turns, Anissa's light gives back a fifth of Gianna's SP. The pips over Anissa's head are her Spark.`,
          },
        ],
        spark: [
          {
            title: 'Anissa: Spark and Surge',
            text: `Anissa never fights and can never be hit. Each thing Gianna does gives her a Spark (Guard gives ${SPARK_ON_GUARD}). At ${SURGE_COST}, Surge appears: free, and Gianna's next blow or spell hits half again as hard.`,
          },
        ],
      },
      after: [
        {
          title: 'Spoils',
          text: 'Wins bring XP, gold, and sometimes gear. New levels raise stats and teach spells. The boar left a tusk on a cord: wear it from Menu > Equip > Gianna > Charm.',
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
    },
  },
};

/** The wild sections' battles: their title and the painted scene behind them. */
const WILDS: Readonly<Record<string, { title: string; backdrop: string }>> = {
  mountain_path: { title: 'The Mountain Path', backdrop: 'mountain_path' },
  cane_road: { title: 'The Cane Road', backdrop: 'cane_road' },
  cinder_flats: { title: 'The Cinder Flats', backdrop: 'cinder_flats' },
  cinder_patrols: { title: 'The Sea Road', backdrop: 'cinder_flats' },
};

/**
 * Any battle by id: a scripted one (BATTLES), or a random ambush, `encounter:<table>/<group>`, built from its
 * encounter group: its enemies at the group's level, paying ENCOUNTER_XP_PER_LEVEL and ENCOUNTER_GOLD_PER_LEVEL
 * per foe and level.
 */
export function battleDef(id: string): BattleDef | undefined {
  const scripted = BATTLES[id];
  if (scripted) return scripted;
  const m = /^encounter:([^/]+)\/(.+)$/.exec(id);
  if (!m) return undefined;
  const [, tableId, groupId] = m;
  const group = ENCOUNTERS[tableId!]?.groups.find((g) => g.id === groupId);
  if (!group?.enemies?.length) return undefined;
  const wild = WILDS[tableId!] ?? { title: 'Ambush', backdrop: 'cane_road' };
  const foes = group.enemies.length;
  return {
    id,
    title: wild.title,
    backdrop: wild.backdrop,
    enemies: group.enemies,
    level: group.level,
    table: tableId!,
    group: groupId!,
    rewards: { xp: ENCOUNTER_XP_PER_LEVEL * group.level * foes, gold: ENCOUNTER_GOLD_PER_LEVEL * group.level * foes },
  };
}
