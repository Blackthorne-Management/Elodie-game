// Battles (engine/battle.ts runs them; scenes/BattleScene.ts draws them): skills by member, the enemies,
// and each scripted fight. Chapter 1 has one (owner decision, Oct 15): on the Cane Road, Gianna and
// Anissa run into a boar, which teaches the commands, Anissa's Spark and Surge, and her light.
// Numbers follow docs/quest/design/COMBAT.md.

import { ANISSA_SP_EVERY, BATTLE_ACTIVE, BRIBE_GOLD_PER_LEVEL, ENCOUNTER_GOLD_PER_LEVEL, SPARK_ON_GUARD, SURGE_COST, TRIAL_TURNS_AFTER_FINISHER } from '../config.ts';
import { ENCOUNTERS } from './encounters.ts';
import { ambushXp, type BattleDef, type EnemyDef, type EnemyMove, type SkillDef } from '../engine/battle.ts';
import { RPG } from './rpg.ts';
import type { SkillBook } from '../engine/skills.ts';
import { BOOKS } from './books.ts';

// Skills grow (owner decision, Oct 15): mages learn spells by level and from library books, spells rank
// up (II, III) at set levels, and only a few can be equipped (config SPELL_SLOTS); attackers have many
// weapon moves with cooldowns and few SP skills; rare or better gear brings one more, free.

/** The library books of Pòdlimyè (reading five teaches Mend). */
const ZETWAL_BOOKS = BOOKS.filter((b) => b.id.startsWith('zetwal_')).map((b) => b.id);
/** The House of Ledgers' six in Bab al-Dhahab (reading five teaches Baraka of the Scale; the Majlis's two do not count). */
const ALDORIA_LEDGERS = ['aldoria_letter_numbers', 'aldoria_eight_gates', 'aldoria_on_contracts', 'aldoria_witness_market', 'aldoria_dorini_promise', 'aldoria_city_water'];
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
      id: 'baraka_scale', name: 'Baraka of the Scale', sp: 8, kind: 'status', power: 0, target: 'ally', statuses: ['warded', 'inspired'],
      learn: { lore: { books: ALDORIA_LEDGERS, count: 5, where: 'the House of Ledgers' } },
      text: 'Learned in Bab al-Dhahab: the scale weighs true for one ally. They take a quarter less and deal a quarter more, for 3 turns.',
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
    // Renamed from "Hired Blade" (Chapter 4 review 3.7: it collided with Qasim's Hire Blades); the id stays for saves.
    {
      id: 'daftar_strike', name: 'Daftar: Debt Collected', sp: 0, gold: { base: 20, perLevel: 10 }, goldRate: 0.5, kind: 'damage', power: 0, target: 'enemy',
      text: 'Gold buys a blow no armour stops: 10 damage for every 20 gold spent.',
    },
    // Bribe (COMBAT 9.6; Chapter 4): a person takes the purse and walks out. A blade Qasim hired mid-fight was paid
    // by the guild first, so the purse comes back.
    {
      id: 'bribe', name: 'Bribe', sp: 0, gold: { base: 0, perLevel: BRIBE_GOLD_PER_LEVEL }, kind: 'status', power: 0, target: 'enemy', bribe: true,
      text: 'A purse for one foe who can be bought: they walk out of the fight. A hired blade was paid already: the gold comes back.',
    },
    {
      id: 'daftar_favour', name: 'Daftar: Patronage', sp: 0, gold: { base: 60 }, kind: 'status', power: 0, target: 'ally', statuses: ['inspired'],
      text: 'A purse for courage: one ally is Inspired for 3 turns (60 gold).',
    },
  ],
  // Bayarmaa (COMBAT 9.4; the outline section 9): Raider's Charge leaves her next turn half as far off (its weight), Hoofbeat
  // is Salkhi's kick (a boss only a quarter of the time), The Great Raid gives her a second turn at once, once a battle.
  bayarmaa: [
    {
      id: 'raiders_charge', name: "Raider's Charge", sp: 5, kind: 'damage', stat: 'atk', power: 130, target: 'enemy', weight: 0.5,
      text: 'She rides straight through one foe, and is ready again in half the time.',
    },
    {
      id: 'hoofbeat', name: 'Hoofbeat', sp: 6, kind: 'damage', stat: 'atk', power: 90, target: 'enemy', statuses: ['stunned'], bossChance: 0.25,
      text: 'Salkhi kicks: one foe loses its next action (a boss only a quarter of the time).',
    },
    {
      id: 'great_raid', name: 'The Great Raid', sp: 16, kind: 'damage', stat: 'atk', power: 150, target: 'enemy', once: true, weight: 0,
      text: 'Once per battle: a raid her grandmother would know. A heavy blow, and her next turn comes at once.',
    },
  ],
  // Haru (COMBAT 9.5; the outline section 9.1 with its review's 3.6): Kagemimi listens (the next move told; a disguise
  // found out: the Paper Fox named, Marked, his paper no longer in the way); Sasayaki Ha's strip of a buff and
  // Ayatsuri's redirect are not built: their fallbacks are Weakened and a Stun (a boss half the time); Paper Smoke's
  // evasion is the built Warded, on the whole party.
  haru: [
    {
      id: 'kagemimi', name: 'Kagemimi', sp: 3, kind: 'status', power: 0, target: 'enemy', statuses: ['marked'], reveal: true,
      text: 'He listens: one foe\'s next move is told, and a foe in disguise is found out and marked.',
    },
    {
      id: 'sasayaki_ha', name: 'Sasayaki Ha', sp: 6, kind: 'damage', stat: 'atk', power: 110, target: 'enemy', statuses: ['weakened'], bossChance: 0.5,
      text: 'The whispering blade: a cut, and the foe hits a quarter softer (a boss half the time).',
    },
    {
      id: 'paper_smoke', name: 'Paper Smoke', sp: 5, kind: 'status', power: 0, target: 'allAllies', statuses: ['warded'],
      text: 'Burning paper and smoke: the whole party takes a quarter less damage for 3 turns.',
    },
    {
      id: 'ayatsuri', name: 'Ayatsuri', sp: 14, kind: 'status', power: 0, target: 'enemy', statuses: ['stunned'], bossChance: 0.5, once: true,
      text: 'Once per battle: the puppeteer\'s word. One foe\'s next action is wasted (a boss half the time).',
    },
  ],
  // Vikram (COMBAT 9.7; the outline section 9.1 with its review's 3.8): Ember Cut is fire and sets Burning (a boss only a
  // third of the time); Ananta Yuddha's free round is the fallback the review named, Inspired on the whole party, once.
  vikram: [
    {
      id: 'ember_cut', name: 'Ember Cut', sp: 4, kind: 'damage', stat: 'atk', power: 130, target: 'enemy', element: 'fire', statuses: ['burning'], bossChance: 0.3,
      text: 'A cut with the blade glowing: fire, and the foe burns (a boss a third of the time).',
    },
    {
      id: 'ananta_yuddha', name: 'Ananta Yuddha', sp: 15, kind: 'status', power: 0, target: 'allAllies', statuses: ['inspired'], once: true,
      text: 'Once per battle: endless war. The whole party hits a quarter harder for 3 turns.',
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
  bayarmaa: [
    { id: 'slash', name: 'Slash', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A sabre cut from the saddle. Ready every turn.' },
    { id: 'heavy_blow', name: 'Heavy Blow', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 170, target: 'enemy', text: 'Both hands on the hilt. Needs 2 turns to ready again.' },
    { id: 'horse_tail_sweep', name: 'Horse-Tail Sweep', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 70, target: 'allEnemies', text: 'She wheels Salkhi through the line: every foe.' },
  ],
  haru: [
    { id: 'quick_cut', name: 'Quick Cut', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A short, fast cut. Ready every turn.' },
    { id: 'twin_cut', name: 'Twin Cut', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 75, target: 'randomEnemies', hits: 2, text: 'Two cuts at foes at random. Needs 2 turns to ready again.' },
    { id: 'throat_cut', name: 'Throat Cut', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 150, target: 'enemy', text: 'One cut, exactly placed. Needs 3 turns to ready again.' },
  ],
  vikram: [
    { id: 'quick_thrust', name: 'Quick Thrust', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: 'A duellist\'s thrust. Ready every turn.' },
    { id: 'flame_lunge', name: 'Flame Lunge', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 160, target: 'enemy', element: 'fire', text: 'A lunge with fire on the blade. Needs 2 turns to ready again.' },
    { id: 'twin_flame', name: 'Twin Flame', sp: 0, cooldown: 3, kind: 'damage', stat: 'atk', power: 80, target: 'randomEnemies', hits: 2, element: 'fire', text: 'Two fiery cuts at foes at random. Needs 3 turns to ready again.' },
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
    bribable: true,
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
    bribable: true,
    name: 'Crown Musketeer',
    look: 'crown_musketeer',
    level: 5,
    role: 'caster',
    moves: [
      { name: 'Bayonet jab', power: 90 },
      { name: 'Volley', power: 180, every: 2, tell: 'The musketeer kneels and takes aim...' },
    ],
  },
  // The patrol's musketeer on the night of the attack (review 1, Oct 21, finding 1): a Crown breastplate. A plain
  // Attack glances off it (engine/battle.ts `armored`); Sunthread and Yari's Aimed Shot do not, so the fight before
  // Thorne is the one that asks for the skills the boar taught.
  breastplate_musketeer: {
    id: 'breastplate_musketeer',
    name: 'Musketeer in a Breastplate',
    look: 'crown_musketeer',
    level: 5,
    role: 'caster',
    moves: [
      { name: 'Bayonet jab', power: 90 },
      { name: 'Volley', power: 180, every: 2, tell: 'The musketeer kneels and takes aim...' },
    ],
    armored: true,
  },
  road_bandit: {
    id: 'road_bandit',
    bribable: true,
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
    bribable: true,
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
    bribable: true,
    name: 'Lookout',
    look: 'lookout',
    level: 6,
    role: 'skirmisher',
    moves: [{ name: 'Sling', power: 100 }],
  },
  // The night of the attack (Oct 17): the officer leading the marines into the caney.
  marine_lieutenant: {
    id: 'marine_lieutenant',
    bribable: true,
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
    // Review 1, finding 1: at full HP and level 9 he was a wall for a party that only attacks, even at the most
    // Grudge (16 wins in 40 at +50%); at the party's level (8) with a little less HP (0.9), Attack alone won 9 in
    // 40 the first time and 37 in 40 at the boss Grudge. The levels pass (Oct 22) brings the party to him a level
    // lower (7): at 7 with his full HP, Attack alone wins 8 in 40 and 36 in 40 at the boss Grudge, and Sunthread
    // every turn still wins every time (tools/battle-sim.ts thorne_blockade seacave).
    hpScale: 1,
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
  // ---- Chapter 4, Al-Doria (the outline section 4 and 5, with its review 3.1 and 3.7) ----------------------------
  // The guild's blades in green, and the caravan road's raiders: a curved blade, and a fistful of sand in the eyes
  // (COMBAT's Fogged is not built: it leaves the fighter Weakened, as the bats' Screech does). They take a purse.
  caravan_raider: {
    id: 'caravan_raider',
    name: 'Caravan Raider',
    look: 'caravan_raider',
    level: 13,
    role: 'skirmisher',
    bribable: true,
    moves: [
      { name: 'Scimitar', power: 115 },
      { name: 'Sand Toss', power: 70, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The raider scoops up a fistful of sand...' },
    ],
  },
  // Guildmaster Qasim (review 3.1): level 14, a brute at 3.5 times HP and 1.1 ATK, the threat in what he buys. Phase 1
  // he hires a blade every third turn (HIRE_CAP on the field at once); at 40% he forecloses: Seize Assets once (every
  // fighter Weakened, telegraphed), then the Golden Wall (damage taken halved, its turns, a Surge shatters it). At 0
  // HP he yields and his blades walk out with him (the Yield step's fallback, as Thorne's fight ends on the win).
  qasim: {
    id: 'qasim',
    name: 'Guildmaster Qasim',
    look: 'qasim',
    level: 14,
    role: 'brute',
    boss: true,
    hpScale: 4,
    atkScale: 1.4,
    withdraws: { line: 'Enough. Enough! Name your fee.', speaker: 'Qasim' },
    moves: [
      { name: 'Cane', power: 120 },
      { name: 'Hire Blades', power: 0, hire: 'caravan_raider', every: 2, tell: 'Qasim rattles a purse at the stair. "Blades! The guild pays double!"' },
    ],
  },
  // Chapter 5 (the outline 7.1 with its second review 3.3): the Crown's own deserters at the Seat's crossroads, in old
  // coats. Nobody falls: each withdraws at 0 HP (there is no floor, so the fight always ends), and when the Sergeant
  // yields his men step back with him. Rally Inspires a man of his (an ally move); no "Order" (no engine for it).
  deserter_sergeant: {
    id: 'deserter_sergeant',
    bribable: true,
    name: 'Deserter Sergeant',
    look: 'deserter_sergeant',
    level: 15,
    role: 'brute',
    boss: true,
    hpScale: 2,
    withdraws: { line: "Enough. Enough. We're hungry, not dead.", speaker: 'Sergeant' },
    moves: [
      { name: 'Bayonet', power: 115 },
      { name: 'Rally', power: 0, ally: 'deserter', statuses: ['inspired'], every: 3, tell: 'The Sergeant barks at his men: "On your feet! Form up!"' },
    ],
  },
  deserter: {
    id: 'deserter',
    bribable: true,
    name: 'Deserter',
    look: 'deserter',
    level: 14,
    role: 'skirmisher',
    withdraws: { line: 'The deserter steps back, bayonet down.' },
    moves: [
      { name: 'Bayonet', power: 105 },
      { name: 'Hungry lunge', power: 150, every: 3, tell: 'A deserter crouches low, eyes on your bags...' },
    ],
  },
  // ---- Chapter 6, Skarragol (the outline section 5 with its review 3.3; COMBAT 13.2 and 13.3) ---------------------
  // The plateau's wolves (COMBAT's Chilled is the built Slowed; Pack Bite has no engine support and is cut: a pack of
  // four at 17 is the pressure instead), the reavers who ride for whoever pays, and the camp's lookout with his horn.
  steppe_wolf: {
    id: 'steppe_wolf',
    name: 'Steppe Wolf',
    look: 'steppe_wolf',
    level: 16,
    role: 'skirmisher',
    moves: [
      { name: 'Bite', power: 100 },
      { name: 'Frost Breath', power: 80, statuses: ['slowed'], chance: 0.5, every: 3, tell: 'The wolf draws a long, cold breath...' },
    ],
  },
  steppe_reaver: {
    id: 'steppe_reaver',
    bribable: true,
    name: 'Steppe Reaver',
    look: 'steppe_reaver',
    level: 16,
    role: 'skirmisher',
    withdraws: { line: 'The reaver wheels her horse and rides for the sledges.' },
    moves: [
      { name: 'Sabre', power: 110 },
      { name: "Raider's Charge", power: 150, every: 3, tell: 'The reaver wheels her horse and lowers the sabre...' },
    ],
  },
  camp_lookout: {
    id: 'camp_lookout',
    bribable: true,
    name: 'Camp lookout',
    look: 'lookout',
    level: 17,
    role: 'skirmisher',
    withdraws: { line: 'The lookout drops his horn and runs for the tents.' },
    moves: [
      { name: 'Sling', power: 100 },
      { name: 'Horn', power: 0, ally: 'steppe_reaver', statuses: ['inspired'], every: 2, tell: 'The lookout puts his horn to his lips...' },
    ],
  },
  // S-5's sparring bout: the eastern clans' champion, in white. A bout, not a fight to the death: she steps back at 0 HP.
  ordu_champion: {
    id: 'ordu_champion',
    name: 'Champion of the eastern clans',
    look: 'ordu_champion',
    level: 17,
    role: 'brute',
    boss: true,
    hpScale: 2.5,
    withdraws: { line: 'Enough. He can sit a horse. I will say so.', speaker: 'Champion' },
    moves: [
      { name: 'Practice sabre', power: 110 },
      { name: 'Ride-by', power: 150, every: 3, tell: 'The champion turns her horse wide for a run at you...' },
    ],
  },
  // Noyan Grimvald, the Crown-paid raider chief (the outline 5 with its review 3.3): level 17, a brute at 5 times HP and
  // 1.3 ATK (the outline's 7 and 1.6 were simmed on a bot that Guards and casts; tools/battle-sim.ts at @herd, 40 runs:
  // Attack alone wins 1 in 40, and 37 in 40 at the boss Grudge, as Thorne; the skills win 40 in 40 with 39% of the
  // party's HP lost; the start tip names the answer). Mounted, then unhorsed (two reavers ride in), then the standard
  // falls from his hand (at a quarter of his HP, or sooner at a Surge in that phase), and at 0 HP he yields: nobody dies.
  grimvald: {
    id: 'grimvald',
    name: 'Noyan Grimvald',
    look: 'grimvald',
    level: 17,
    role: 'brute',
    boss: true,
    hpScale: 5,
    atkScale: 1.3,
    withdraws: { line: 'Enough! The standard is yours. Keep the horse.', speaker: 'Grimvald' },
    moves: [
      { name: 'Lance', power: 120 },
      { name: 'Trample', power: 100, area: true, every: 2, tell: 'Grimvald turns his horse and spurs it straight at the line...' },
    ],
  },
  // ---- Chapter 7, Kuroshi (the outline section 5 with its review 3.6; COMBAT 13.2 and 13.3) -------------------------
  // The marsh's moths and cutpurses (COMBAT's Smoke is a smoke bomb that weakens; Pickpocket has no engine support and
  // is cut), the first Hushers of the game (Hush is the built Hushed now; Steal Voice is cut; Seize goes to Gianna,
  // never to Anissa), and the Paper Fox with his paper decoys.
  lantern_moth: {
    id: 'lantern_moth',
    name: 'Lantern Moth',
    look: 'lantern_moth',
    level: 18,
    role: 'skirmisher',
    hpScale: 0.6,
    weak: ['fire'],
    moves: [
      { name: 'Dust', power: 80 },
      { name: 'Glare', power: 50, area: true, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The moths all turn their wings to the lantern light at once...' },
    ],
  },
  fog_cutpurse: {
    id: 'fog_cutpurse',
    name: 'Fog Cutpurse',
    look: 'fog_cutpurse',
    level: 18,
    role: 'skirmisher',
    bribable: true,
    withdraws: { line: 'The cutpurse is gone into the fog.' },
    moves: [
      { name: 'Knife', power: 100 },
      { name: 'Smoke bomb', power: 60, area: true, statuses: ['weakened'], chance: 0.5, every: 3, tell: 'The cutpurse pulls a paper ball from her sleeve and bites the fuse...' },
    ],
  },
  husher: {
    id: 'husher',
    name: 'Husher',
    look: 'husher',
    level: 18,
    role: 'caster',
    resist: ['light'],
    withdraws: { line: 'The Husher steps back into the fog without a sound.' },
    moves: [
      { name: 'Whisper', power: 90, magic: true },
      { name: 'Hush', power: 60, magic: true, statuses: ['hushed'], every: 3, tell: 'The Husher lifts a finger to the veil. The fog goes quiet...' },
      { name: 'Seize', power: 0, seize: 3, statuses: ['marked'], every: 4, tell: 'The Husher is looking past you, at the back of the line...' },
    ],
  },
  // The Fox's paper decoys: the same mask, the same name ("Paper Fox?" with a letter), a hidden HP bar, and three of
  // four one-target blows meant for him land on paper until Kagemimi finds him out. Torn by any blow that hits them all.
  paper_decoy: {
    id: 'paper_decoy',
    name: 'Paper decoy',
    look: 'paper_fox',
    level: 19,
    role: 'caster',
    hpScale: 0.35,
    weak: ['fire', 'light'],
    protects: 'paper_fox',
    disguise: { as: 'Paper Fox?' },
    moves: [{ name: 'Paper cut', power: 75, magic: true }],
  },
  // The Paper Fox, the broker who sells Kuroshi's files to the Crown (COMBAT 13.3; the outline section 5 with its review
  // 3.6): level 19, a skirmisher boss; phase 2 at 40% (COMBAT's number, recorded); Sold Secrets reads one fighter's file
  // and turns their own best blow on them with his ATK. At 0 HP he withdraws: nobody dies. Scaling: battle-sim at
  // @kirinoura-fox (the outline's Built section).
  paper_fox: {
    id: 'paper_fox',
    name: 'The Paper Fox',
    look: 'paper_fox',
    level: 19,
    role: 'skirmisher',
    boss: true,
    hpScale: 12,
    atkScale: 1.8,
    disguise: { as: 'Paper Fox?', name: 'The Paper Fox' },
    withdraws: { line: 'Enough. Take the files. They were never mine to sell.', speaker: 'The Paper Fox' },
    moves: [
      { name: 'Paper knife', power: 110 },
      { name: 'Fold', power: 0, hire: 'paper_decoy', every: 3, tell: 'The Fox folds a sheet in half, and in half again: another of him is coming.' },
    ],
  },
  // ---- Chapter 8, Jwaladesh (the outline section 5 with its review 3.1; COMBAT 13.2 and 13.3) ----------------------
  // The Seth's Oil Enforcers (Oil Flask is the built Burning now) and the salt pans' ember jackals (COMBAT's Scavenge,
  // a heal on a kill, has no engine support and is cut); Vikram sparring in the duel yard; Seth Dhanraj, the Crown-backed
  // oil hoarder, and the enforcers at his side who step in front of him.
  oil_enforcer: {
    id: 'oil_enforcer',
    name: 'Oil Enforcer',
    look: 'oil_enforcer',
    level: 20,
    role: 'brute',
    bribable: true,
    resist: ['fire'],
    withdraws: { line: 'The enforcer drops his cudgel and goes, flask and all.' },
    moves: [
      { name: 'Cudgel', power: 110 },
      { name: 'Oil Flask', power: 90, statuses: ['burning'], chance: 0.6, every: 3, tell: 'The enforcer uncorks a flask and swings it by the neck...' },
    ],
  },
  store_enforcer: {
    id: 'store_enforcer',
    name: 'Oil Enforcer',
    look: 'oil_enforcer',
    level: 21,
    role: 'brute',
    bribable: true,
    resist: ['fire'],
    protects: 'seth_dhanraj',
    withdraws: { line: 'The enforcer backs out of the store\'s back door.' },
    moves: [
      { name: 'Cudgel', power: 110 },
      { name: 'Oil Flask', power: 90, statuses: ['burning'], chance: 0.6, every: 3, tell: 'The enforcer uncorks a flask and swings it by the neck...' },
    ],
  },
  ember_jackal: {
    id: 'ember_jackal',
    name: 'Ember Jackal',
    look: 'ember_jackal',
    level: 20,
    role: 'skirmisher',
    resist: ['fire'],
    weak: ['water'],
    moves: [
      { name: 'Bite', power: 100 },
      { name: 'Ember Snap', power: 120, every: 3, tell: 'The jackal\'s coat sparks. It crouches...' },
    ],
  },
  // Vikram in the duel yard (the outline 5, its review 3.9): a sparring match, Gianna alone; it ends either way.
  vikram_duel: {
    id: 'vikram_duel',
    name: 'Vikram',
    look: 'vikram',
    level: 20,
    role: 'skirmisher',
    hpScale: 2,
    atkScale: 1.2,
    withdraws: { line: 'Enough... Enough. I need... a moment.', speaker: 'Vikram' },
    moves: [
      { name: 'Quick Thrust', power: 100 },
      { name: 'Ember Cut', power: 130, every: 2, tell: 'Vikram draws a breath he does not have, and the blade glows...' },
    ],
  },
  // Seth Dhanraj (COMBAT 13.3; the outline section 5 with its review 3.1): level 21, a brute boss. The Oil Wall halves
  // what he takes and fire does nothing to it, and a Surge shatters it; at half his HP the price goes up (Price Spike:
  // a blow at everyone, the review's fold of the item delay into the blow), two more enforcers come in, and from then a
  // fire blow lights his oil (BattlePhase.ignite). At 0 HP he withdraws: nobody dies. Scaling: battle-sim at
  // @jwaladesh-store (the outline's Built section).
  seth_dhanraj: {
    id: 'seth_dhanraj',
    name: 'Seth Dhanraj',
    look: 'seth_dhanraj',
    level: 21,
    role: 'brute',
    boss: true,
    hpScale: 5,
    atkScale: 1.4,
    withdraws: { line: 'Enough. The oil is yours. It was always going to be somebody\'s.', speaker: 'Seth Dhanraj' },
    moves: [
      { name: 'Ledger Staff', power: 120 },
      { name: 'Oil Wall', power: 0, ally: 'seth_dhanraj', statuses: ['oiled'], every: 3, tell: 'Dhanraj kicks a jar over. Oil spreads in a ring at his feet; nothing burns there.' },
    ],
  },
  marine_sergeant: {
    id: 'marine_sergeant',
    bribable: true,
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

/** Grimvald unhorsed (phase 2): the axe, and the stolen standard planted to rally his riders. */
const GRIMVALD_UNHORSED: readonly EnemyMove[] = [
  { name: 'Axe', power: 120 },
  {
    name: 'Stolen Standard', power: 0, ally: 'steppe_reaver', statuses: ['inspired'], every: 2,
    tell: 'Grimvald drives the Ironvow standard into the turf. His riders roar.',
  },
];
/** Grimvald with the standard gone from his hand (phase 3): the axe only. */
const GRIMVALD_BROKEN: readonly EnemyMove[] = [{ name: 'Axe', power: 110 }];
/** The Paper Fox's second phase (40%): the knife, Sold Secrets every other turn, a fold now and then. */
const FOX_SECRETS: readonly EnemyMove[] = [
  { name: 'Paper knife', power: 110 },
  { name: 'Sold Secrets', power: 120, mirror: true, every: 2, tell: 'The Fox opens a file with a name on it, and reads...' },
  { name: 'Fold', power: 0, hire: 'paper_decoy', every: 5, tell: 'The Fox folds a sheet in half, and in half again: another of him is coming.' },
];

/** Dhanraj when the price goes up (phase 2, 50%): the staff, Price Spike at everyone, the wall now and then. */
const DHANRAJ_PRICE_SPIKE: readonly EnemyMove[] = [
  { name: 'Ledger Staff', power: 130 },
  { name: 'Price Spike', power: 120, area: true, every: 2, tell: 'Dhanraj opens the ledger. "Everything you carry just got dearer." Guard, everyone!' },
  { name: 'Oil Wall', power: 0, ally: 'seth_dhanraj', statuses: ['oiled'], every: 5, tell: 'Dhanraj kicks another jar over. The oil runs round his feet again.' },
];

/** Qasim once the guild's money is gone (phase 2, Foreclosure): no more hiring; he seizes, then walls himself in gold. */
const QASIM_FORECLOSURE: readonly EnemyMove[] = [
  { name: 'Cane', power: 160 },
  {
    name: 'Seize Assets', power: 230, area: true, statuses: ['weakened'], every: 2, once: true,
    tell: 'Qasim opens the guild ledger at your names. "Seize their assets." Guard, everyone!',
  },
  { name: 'Golden Wall', power: 0, ally: 'qasim', statuses: ['gilded'], every: 3, tell: 'Qasim kicks open a strongbox and stacks the gold in front of him!' },
];

export const BATTLES: Readonly<Record<string, BattleDef>> = {
  // Chapter 8: Seth Dhanraj in the oil store (the outline beat 7, its review 3.1). Game Over applies; the way back in is
  // the store's doorway. Two enforcers at his side step in front of him (protects); two more at half his HP.
  oil_store_dhanraj: {
    id: 'oil_store_dhanraj',
    title: 'Seth Dhanraj',
    backdrop: 'oil_store',
    enemies: ['store_enforcer', 'seth_dhanraj', 'store_enforcer'],
    table: 'jwaladesh_story',
    group: 'dhanraj',
    rewards: { xp: 140, gold: 300 },
    endsWithBoss: true,
    boss: true,
    phases: [
      {
        below: 0.5,
        speaker: 'Seth Dhanraj',
        text: 'Then the price goes up.',
        moves: DHANRAJ_PRICE_SPIKE,
        enter: ['store_enforcer', 'store_enforcer'],
        enterText: 'Two more enforcers come in from the back with flasks.',
        ignite: true,
      },
    ],
    tips: {
      // The one thing that matters, said at the start (review 1, finding 1): the wall breaks to the light, and his oil burns.
      start: 'Fire runs off his oil, Gigi! Surge to break the wall. When it\'s down, Vikram\'s fire will catch.',
      spark: 'Surge, Gigi! The wall!',
      tell: 'The price is going up! Guard!',
      lowHp: 'Heal, Gigi. Please.',
    },
  },
  // Chapter 8: the duel in the yard (the outline beat 2, its review 3.9): Gianna alone, a sparring match that ends either
  // way; no goddess, no Grudge, no XP; the same scene after it, with one line changed.
  duel_yard_vikram: {
    id: 'duel_yard_vikram',
    title: 'The Duel Yard',
    backdrop: 'duel_court',
    enemies: ['vikram_duel'],
    table: 'jwaladesh_story',
    group: 'duel',
    rewards: { xp: 0, gold: 0 },
    meantToLose: { scene: 'vikram_after', set: { 'choice.duel_lost': true } },
    fighters: ['gianna'],
    endsWithBoss: true,
    tips: {
      start: 'He\'s fast, Gigi, and he\'s already tired. Your light. Make him run out of breath.',
      spark: 'Surge, Gigi!',
      tell: 'The blade\'s glowing! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 8, J-3: three Oil Enforcers on the salt road (the carter's jars). Paid flat (data).
  salt_road_enforcers: {
    id: 'salt_road_enforcers',
    title: 'The Salt Road',
    backdrop: 'salt_flats',
    enemies: ['oil_enforcer', 'oil_enforcer', 'oil_enforcer'],
    level: 21,
    table: 'jwaladesh_story',
    group: 'salt_road',
    rewards: { xp: 20, gold: 150 },
    sideQuest: 'anonymous_oil',
    tips: {
      start: 'Three of them, Gigi. Their flasks burn. Samira says a purse works on enforcers.',
      spark: 'Surge, Gigi!',
      tell: 'A flask! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 8: the night watch on the open quay (the sea-wall lane's fail-safe). Paid flat (data).
  quay_watch: {
    id: 'quay_watch',
    title: 'The Night Watch',
    backdrop: 'oil_store',
    enemies: ['oil_enforcer', 'oil_enforcer'],
    level: 21,
    table: 'jwaladesh_story',
    group: 'watch',
    rewards: { xp: 30, gold: 100 },
    tips: {
      start: 'Two of them, Gigi. Quickly, before the store hears.',
      spark: 'Surge, Gigi!',
      tell: 'A flask! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 6: Noyan Grimvald at his tent (the outline beat 7, its review 3.3). Game Over applies; the way back in is
  // the tent's trigger. The phases always come: unhorsed at half, the standard falls at a quarter (a Surge in that
  // phase brings it sooner). Paid 120, below the outline's 150 (its review 3.1), the level curve's number.
  fjord_grimvald: {
    id: 'fjord_grimvald',
    title: 'Noyan Grimvald',
    backdrop: 'frozen_fjord',
    enemies: ['grimvald'],
    table: 'skarragol_story',
    group: 'grimvald',
    rewards: { xp: 120, gold: 300 },
    endsWithBoss: true,
    boss: true,
    phases: [
      {
        below: 0.5,
        speaker: 'Grimvald',
        text: 'Horse! To me!',
        moves: GRIMVALD_UNHORSED,
        enter: ['steppe_reaver', 'steppe_reaver'],
        enterText: 'His horse bolts for the picket line. Two reavers ride in from the sledges.',
      },
      {
        below: 0.25,
        onSurge: true,
        text: 'The Ironvow standard falls from his hand into the grass. Bayarmaa, over it: "That is not yours."',
        moves: GRIMVALD_BROKEN,
      },
    ],
    tips: {
      // The one thing that matters, said at the start (review 1, finding 1): skills, not staffs; Guard on the Trample.
      start: 'Your light, Gigi, and Bayarmaa\'s Charge. Not your staff. When he turns his horse, everyone Guard.',
      spark: 'Surge, Gigi! The standard!',
      tell: 'He is turning the horse! Guard!',
      lowHp: 'Heal, Gigi. Please.',
    },
  },
  // Chapter 6: the camp's lookouts, the herd stealth's fail-safe (the outline beat 6). Paid flat (data).
  camp_lookouts: {
    id: 'camp_lookouts',
    title: "The Thief's Camp",
    backdrop: 'frozen_fjord',
    enemies: ['steppe_reaver', 'steppe_reaver', 'camp_lookout'],
    level: 17,
    table: 'skarragol_story',
    group: 'lookouts',
    rewards: { xp: 40, gold: 150 },
    tips: {
      start: 'The lookout will call them on, Gigi. Him first.',
      spark: 'Surge, Gigi!',
      tell: 'Guard, Gigi!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 6, S-3: the wolves at the winter store. Paid below the ambush rule on purpose (its review 3.1).
  winter_wolves: {
    id: 'winter_wolves',
    title: 'The Winter Store',
    backdrop: 'winter_plateau',
    enemies: ['steppe_wolf', 'steppe_wolf', 'steppe_wolf'],
    level: 16,
    table: 'skarragol_story',
    group: 'wolves',
    rewards: { xp: 40, gold: 120 },
    sideQuest: 'winter_stores',
    tips: {
      start: 'Three of them, Gigi. They come up the gully one at a time. Bayarmaa first.',
      spark: 'Surge, Gigi!',
      tell: 'Cold breath! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 6, S-5: the champion's bout (Azzy's show of strength). A sparring bout: she steps back at 0 HP; the quest pays.
  ordu_bout: {
    id: 'ordu_bout',
    title: 'A Sparring Bout',
    backdrop: 'horse_fair',
    enemies: ['ordu_champion'],
    table: 'skarragol_story',
    group: 'champion',
    rewards: { xp: 0, gold: 0 },
    endsWithBoss: true,
    sideQuest: 'grandson',
    tips: {
      start: "It's a bout, Gigi. Nobody gets hurt past the bout. Azzy wants to win it.",
      spark: 'Surge!',
      tell: 'She is turning wide! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 7: the Paper Fox in the file house (the outline beat 7, its review 3.6). Game Over applies; the way back in
  // is the north stack's trigger. The decoys come first in the list, then he deals the places (EnemyDef.disguise).
  file_house_fox: {
    id: 'file_house_fox',
    title: 'The Paper Fox',
    backdrop: 'file_house',
    enemies: ['paper_decoy', 'paper_fox', 'paper_decoy', 'paper_decoy'],
    table: 'kuroshi_story',
    group: 'fox',
    rewards: { xp: 140, gold: 300 },
    endsWithBoss: true,
    boss: true,
    phases: [
      {
        below: 0.4,
        speaker: 'The Paper Fox',
        text: 'You keep files too. Everyone does.',
        moves: FOX_SECRETS,
      },
    ],
    tips: {
      // The one thing that matters, said at the start (review 1, finding 1): Kagemimi finds him; blows that hit them all tear paper.
      start: 'Haru can hear which one breathes, Gigi. Kagemimi! Then hit the real one. Blows that hit them all tear paper.',
      spark: 'Surge, Gigi! Tear them all!',
      tell: 'He is reading somebody\'s file! Guard!',
      lowHp: 'Heal, Gigi. Please.',
    },
  },
  // Chapter 7, K-2: three Fog Cutpurses in the sealed stacks, seen (the stealth's fail-safe). Paid flat (data).
  stacks_cutpurses: {
    id: 'stacks_cutpurses',
    title: 'The Sealed Stacks',
    backdrop: 'file_house',
    enemies: ['fog_cutpurse', 'fog_cutpurse', 'fog_cutpurse'],
    level: 19,
    table: 'kuroshi_story',
    group: 'cutpurses',
    rewards: { xp: 30, gold: 150 },
    sideQuest: 'spy_ledger',
    tips: {
      start: 'Three of them, Gigi. Samira says a purse works on cutpurses.',
      spark: 'Surge, Gigi!',
      tell: 'Smoke! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 7, K-3: the lantern moths at the lit posts. Paid flat (data).
  marsh_moths: {
    id: 'marsh_moths',
    title: 'The Marsh Posts',
    backdrop: 'fog_marsh',
    enemies: ['lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth'],
    level: 18,
    table: 'kuroshi_story',
    group: 'moths',
    rewards: { xp: 30, gold: 100 },
    sideQuest: 'lanterns',
    tips: {
      start: 'They want the light, Gigi. Hit them all at once.',
      spark: 'Surge, Gigi!',
      tell: 'The glare! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
  // Chapter 4: Guildmaster Qasim in the guild vault (the outline beat 8, its review 3.1). Game Over applies; the way
  // back in is the blade at the stair foot. Samira has joined before it, so it teaches Bribe and her Daftar.
  qasim_vault: {
    id: 'qasim_vault',
    title: "The Guild's Blades",
    backdrop: 'guild_vault',
    enemies: ['qasim', 'caravan_raider', 'caravan_raider'],
    table: 'aldoria_story',
    group: 'qasim',
    rewards: { xp: 200, gold: 200 },
    endsWithBoss: true,
    phases: [{ below: 0.6, speaker: 'Qasim', text: 'Then I foreclose.', moves: QASIM_FORECLOSURE }],
    tips: {
      start: 'Gigi, Samira can Bribe a blade. The ones he hires were paid already: their purse comes back to her.',
      spark: 'Gigi, Surge! The wall!',
      tell: 'Guard, everyone!',
      lowHp: "Samira's Remedy costs gold, Gigi. It heals a lot.",
    },
  },
  // Chapter 5: Deserters' Road (Se-3). Game Over applies; the way back in is the camp itself (its trigger plays again
  // until the fight is won). Paid flat, not by the ambush rule (review 3.5: one or the other, and the level curve).
  deserters_road: {
    id: 'deserters_road',
    title: "Deserters' Road",
    backdrop: 'crossroads',
    // Each at his own level: the Sergeant 15, his men 14.
    enemies: ['deserter_sergeant', 'deserter', 'deserter'],
    table: 'seat_story',
    group: 'deserters',
    rewards: { xp: 60, gold: 120 },
    endsWithBoss: true,
    sideQuest: 'deserters',
    tips: {
      start: "They're hungry, Gigi, not cruel. When the Sergeant gives up, they all will.",
      spark: 'Surge, Gigi!',
      tell: 'They are going for the bags! Guard!',
      lowHp: 'Heal, Gigi.',
    },
  },
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
    level: 5, // 6 until the levels pass (Oct 22): the party comes a level lower (6), and the fight stays as it was
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
    enemies: ['crown_marine', 'breastplate_musketeer', 'marine_sergeant'],
    level: 5, // 6 until the levels pass (Oct 22), for the same reason
    table: 'xaragua_story',
    group: 'patrol',
    rewards: { xp: 90, gold: 40 },
    tips: {
      start: "Plain blows bounce off that breastplate, Gigi! Use your light. Yari, Aimed Shot!",
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
    level: 7, // 8 until the levels pass (Oct 22): the party meets him at 7
    table: 'xaragua_story',
    group: 'thorne',
    rewards: { xp: 220, gold: 120 },
    // The chapter's boss: his Grudge climbs to GRUDGE_MAX_BOSS (review 1, finding 1).
    boss: true,
    tips: {
      // Review 1, finding 1: the one thing that matters, said at the start.
      start: 'He hates the light, Gigi. Sunthread. Yari, the musketeer.',
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
  desert_edge: { title: 'The Desert Edge', backdrop: 'desert_edge' },
  crossroads: { title: 'The Crossroads Fields', backdrop: 'crossroads' },
  winter_plateau: { title: 'The Winter Plateau', backdrop: 'winter_plateau' },
  fog_marsh: { title: 'The Fog Marsh', backdrop: 'fog_marsh' },
  salt_flats: { title: 'The Salt Flats', backdrop: 'salt_flats' },
};

/**
 * Any battle by id: a scripted one (BATTLES), or a random ambush, `encounter:<table>/<group>`, built from its
 * encounter group: its enemies at the group's level, paying ENCOUNTER_GOLD_PER_LEVEL per foe and level, and XP by
 * the party's level (AMBUSH_XP; `rewards.xp` is what a party of the group's own level gets).
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
    rewards: { xp: ambushXp(RPG, group.level, group.level, foes), gold: ENCOUNTER_GOLD_PER_LEVEL * group.level * foes },
    ambush: { foes },
  };
}

/**
 * The foes who can walk into a fight once it has begun, by enemy id: a boss phase's guards (Rivera and Jaime in the
 * Trial of Blades) and the blades a boss hires (Qasim). The battle scene and the simulators build the reserve here.
 */
export function battleReserve(def: Pick<BattleDef, 'enemies' | 'phases'>): Record<string, EnemyDef> {
  const moves = [...def.enemies.flatMap((id) => ENEMIES[id]?.moves ?? []), ...(def.phases ?? []).flatMap((p) => p.moves ?? [])];
  const ids = [...(def.phases ?? []).flatMap((p) => p.enter ?? []), ...moves.flatMap((m) => (m.hire ? [m.hire] : []))];
  return Object.fromEntries(ids.filter((id) => ENEMIES[id]).map((id) => [id, ENEMIES[id]!]));
}
