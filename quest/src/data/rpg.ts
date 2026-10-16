// The party, the purse and the places: items, party members, shops, the city maps and the realm map
// (engine/rpg.ts runs the rules). Owner decision (Oct 14): gold is what you spend; Influence, Wealth
// and Fear are reputation scores per city and realm-wide; armies are military might.

import { ANISSA_SP_EVERY, ANISSA_SP_SHARE, BAG_LIMIT, LEVELS, STARTING_GOLD, SURGE_COST, XP_PER_BOOK, XP_PER_OBJECTIVE } from '../config.ts';
import { flagsIn } from '../engine/conditions.ts';
import type { CityDef, ItemDef, MemberDef, RealmPlace, RpgContent, ShopDef } from '../engine/rpg.ts';
import { BOOKS, loreFlag } from './books.ts';
import { ACT1 } from './quests.ts';
import { WEAPONS } from './weapons.ts';

const zero = { hp: 0, sp: 0, atk: 0, def: 0, mag: 0, spd: 0 };

const ITEM_LIST: ItemDef[] = [
  // Story items.
  {
    id: 'sun_locket',
    name: 'Sun Locket',
    kind: 'key',
    price: 0,
    text: "Grandfather's locket: half of the token he and Lord Benny made. It hums near the past.",
    showcase: 'story',
    abilities: [
      { name: 'Echo', text: 'Where the air shimmers, step into what that place remembers.' },
      {
        name: 'Anchors',
        text: 'What you change in the past can stay changed in the present.',
        known: { any: [{ flag: 'anchor.night_orders' }, { flag: 'anchor.chain_bridge' }] },
      },
      // Revealed in Ardencia (Chapter 3), when Lord Rael's signet glows beside it.
      { name: 'Two halves of a promise', text: 'Near its other half, the Brasador signet, both halves glow.', known: { flag: 'story.signet_glowed' } },
    ],
  },
  // The Envoy's Papers (Chapter 1, the Hall of the Accord).
  {
    id: 'elodie_seal',
    name: "Mother's seal",
    kind: 'key',
    price: 0,
    text: "The Head of State's seal: a heavy brass sun, its rays fresh from the engraver's tools. For the Hall clerk.",
  },
  {
    id: 'draft_papers',
    name: 'Envoy papers (unsigned)',
    kind: 'key',
    price: 0,
    text: "Written and sealed by the Hall clerk. They still need the Chancellor's signature.",
  },
  {
    id: 'envoy_papers',
    name: 'Envoy papers',
    kind: 'key',
    price: 0,
    text: "Gianna Limyè, envoy of Kay Soley to Xaraguá: the Head of State's seal and the Chancellor's hand. Keep them dry.",
  },
  // The secret items (docs/quest/design/SECRET-ITEMS.md, owner approved Oct 14), one per capital: the
  // legendary relics, worn in their own slot (owner decision, Oct 15).
  {
    id: 'solange_quill',
    name: "Solange's Quill",
    // Legendary: worn in the relic slot (one per wearer), growing with its wearer's level.
    kind: 'gear',
    slot: 'relic',
    rarity: 'legendary',
    price: 0,
    stats: { mag: 2, sp: 4 },
    growth: { mag: 0.5, sp: 1 },
    skill: 'say_their_names',
    text: 'The quill Mother Solange wrote the first names with. The nib is worn to a slant by her hand.',
    showcase: 'legendary',
    abilities: [
      { name: 'Say Their Names', text: 'Once per battle, every Bound or fallen ally rises with 30% HP, and Anissa gains Calm and Spark.' },
    ],
  },

  // Zetwal food and drink (guide 8: restorative soup in a clay pot).
  { id: 'soup_pot', name: 'Clay-pot soup', kind: 'consumable', price: 30, heals: 40, healTurns: 3, text: 'Squash soup in a clay pot, still warm. Restores 40 HP, a little at a time.' },
  { id: 'akasan', name: 'Akasan', kind: 'consumable', price: 25, restores: 12, text: 'Sweet cornmeal drink, thick enough to stand a spoon in. Restores 12 SP.' },
  // The Iron Market (Oct 15).
  { id: 'kasav', name: 'Kasav', kind: 'consumable', price: 15, heals: 25, text: 'Cassava bread, flat and crisp, with peanut butter. Restores 25 HP.' },
  { id: 'kann', name: 'Cane juice', kind: 'consumable', price: 12, heals: 12, restores: 4, text: 'Sugarcane pressed while you wait. Restores 12 HP and 4 SP.' },
  { id: 'pikliz', name: 'Pikliz', kind: 'consumable', price: 20, restores: 10, text: 'Pickled cabbage and peppers, hot enough to wake the dead. Restores 10 SP.' },
  // The fish stall in the Iron Market (owner decision, Oct 16).
  { id: 'pwason_fri', name: 'Fried snapper', kind: 'consumable', price: 35, heals: 50, text: 'Pwason fri: snapper fried whole, with pikliz on the side. Restores 50 HP.' },
  { id: 'lanbi_fritters', name: 'Conch fritters', kind: 'consumable', price: 30, restores: 15, text: 'Marinad lanbi: conch fritters, crisp and peppery. Restores 15 SP.' },
  { id: 'spiny_lobster', name: 'Spiny lobster', kind: 'consumable', price: 60, heals: 40, restores: 10, text: 'Grilled this minute, bad attitude and all. Restores 40 HP and 10 SP.' },
  { id: 'mango', name: 'Ripe mango', kind: 'consumable', price: 10, heals: 15, text: 'From the plaza stalls. Restores 15 HP.' },

  // Gear (owner decision, Oct 15): staffs for mages, bows for archers, blades for warriors; anyone may
  // wear any armour, but robes suit mages (magic, SP), leather archers (speed, attack) and heavy armour
  // warriors (defence, HP, slower). Rarity sets the colour behind the picture and how good it is:
  // common and uncommon give stats, rare and epic add a special, legendary are the secret items.
  // Each has a set level (worn below it, half its bonus counts); legendary grow with their wearer.

  // Weapons: every "X of Y" (data/weapons.ts).
  ...WEAPONS,

  // Robes (suit mages).
  { id: 'archivist_robe', name: "Archivist's robe", kind: 'gear', slot: 'armor', armor: 'robe', level: 1, price: 60, stats: { def: 1, sp: 4, mag: 1 }, text: 'Blue with gold trim, ink on both cuffs.' },
  { id: 'temple_robe', level: 4, rarity: 'uncommon', name: 'Temple robe', kind: 'gear', slot: 'armor', armor: 'robe', price: 220, stats: { def: 2, sp: 8, mag: 2 }, text: "White and gold, the robe of the Gaze's keepers. It smells of lamp oil." },
  // Leather (suits archers).
  { id: 'woven_tunic', name: 'Woven tunic', kind: 'gear', slot: 'armor', armor: 'leather', level: 1, price: 60, stats: { def: 2, hp: 4, spd: 1 }, text: 'Green cotton, woven tight on a Xaraguá loom, leather at the shoulders.' },
  { id: 'padded_vest', level: 3, rarity: 'uncommon', name: 'Padded vest', kind: 'gear', slot: 'armor', armor: 'leather', price: 140, stats: { def: 4, hp: 6, spd: 1, atk: 1 }, text: 'Quilted cotton over leather. Light enough to run in.' },
  // Heavy armour (suits warriors).
  { id: 'officer_coat', name: "Officer's coat", kind: 'gear', slot: 'armor', armor: 'heavy', level: 1, price: 150, stats: { def: 5, hp: 10 }, text: 'Red wool and gold buttons over a mail lining, heavy as a promise.' },
  { id: 'iron_cuirass', level: 4, rarity: 'uncommon', name: 'Iron cuirass', kind: 'gear', slot: 'armor', armor: 'heavy', price: 300, stats: { def: 8, hp: 14, spd: -1 }, text: 'Plates over padding. Slows you down; stops what you cannot dodge.' },

  // Charms (anyone).
  { id: 'sea_glass_charm', name: 'Sea-glass charm', kind: 'gear', slot: 'charm', level: 1, price: 70, stats: { spd: 2 }, text: 'Green sea glass on a cord. Light on the neck, quick on the feet.' },
  { id: 'boar_tusk', name: 'Boar-tusk charm', kind: 'gear', slot: 'charm', level: 1, rarity: 'uncommon', price: 60, stats: { atk: 2, hp: 4 }, text: 'A tusk from the cane-field boar, on a cord. A story to tell.' },
  {
    id: 'sun_charm', level: 2, rarity: 'rare', name: 'Sun-stitched charm', kind: 'gear', slot: 'charm', price: 90, stats: { hp: 8, def: 1 },
    special: { kind: 'regen', value: 4, text: 'Heals 4% of max HP each turn in battle.' },
    skill: 'warm_thread',
    text: 'A cloth charm stitched with a sun. In battle it heals a little each turn.', showcase: 'reward',
  },
];

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(ITEM_LIST.map((i) => [i.id, i]));

export const MEMBERS: readonly MemberDef[] = [
  {
    id: 'gianna', name: 'Gianna', role: 'Archivist-Mage', house: 'Kay Soley', portrait: 'gianna', era: 'present', class: 'mage',
    passives: [
      {
        name: "Anissa's Light",
        text: `Every ${ANISSA_SP_EVERY} of Gianna's turns in battle, Anissa's light restores ${Math.round(ANISSA_SP_SHARE * 100)}% of her SP.`,
        known: { flag: 'party.anissa' },
      },
      { name: 'Spark and Surge', text: `Each action gives Anissa a Spark (Guard gives 2). At ${SURGE_COST}, Gianna can Surge: her next blow or spell hits half again as hard.`, known: { flag: 'party.anissa' } },
      { name: 'Archivist\'s thrift', text: 'Her skills cost a quarter less SP.' },
    ],
    base: { hp: 42, sp: 30, atk: 6, def: 6, mag: 14, spd: 9 }, growth: { hp: 5, sp: 4, atk: 1, def: 1, mag: 2, spd: 1 },
    start: { weapon: 'archivist_staff', armor: 'archivist_robe' },
  },
  {
    id: 'anissa', name: 'Anissa', role: 'Surge (support)', house: 'Kay Soley', portrait: 'anissa', era: 'present', support: true,
    joins: { flag: 'party.anissa' }, base: zero, growth: zero,
  },
  {
    id: 'yari', name: 'Yari', role: 'Archer', house: 'Yaguana', portrait: 'yari', era: 'present', class: 'archer',
    passives: [
      { name: 'Voice of the Opía', text: 'When any fighter falls, her next shot hits a fifth harder (up to three times).' },
      { name: 'The hutia', text: 'After a win, a 1 in 8 chance her hutia steals something shiny.' },
    ],
    joins: { flag: 'story.yari_asked' },
    base: { hp: 50, sp: 16, atk: 12, def: 7, mag: 6, spd: 13 }, growth: { hp: 6, sp: 2, atk: 2, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'yaguana_bow', armor: 'woven_tunic' },
  },
  {
    id: 'patricio', name: 'Patricio', role: 'Warden', house: 'Kay Soley', portrait: 'patricio', look: 'patricio_young', era: 'echo', class: 'warrior',
    passives: [{ name: 'Hold the line', text: 'When he Guards, the allies behind him take a fifth less damage too.' }],
    base: { hp: 70, sp: 10, atk: 13, def: 12, mag: 3, spd: 7 }, growth: { hp: 8, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'marshal_cutlass', armor: 'officer_coat' },
  },
];

export const SHOPS: Readonly<Record<string, ShopDef>> = {
  zetwal_forge: { id: 'zetwal_forge', name: 'Harbor forge', city: 'zetwal', stock: ['sunwood_staff', 'ironwood_bow', 'steel_saber', 'padded_vest', 'iron_cuirass', 'temple_robe', 'lantern_staff', 'goldband_bow'] },
  zetwal_charms: { id: 'zetwal_charms', name: 'Charm stand', city: 'zetwal', stock: ['sun_charm', 'sea_glass_charm'] },
  zetwal_market: { id: 'zetwal_market', name: 'Market stand', city: 'zetwal', stock: ['soup_pot', 'akasan', 'mango'] },
  // The Iron Market (Oct 15).
  zetwal_produce: { id: 'zetwal_produce', name: 'Produce row', city: 'zetwal', stock: ['mango', 'kasav', 'kann'] },
  zetwal_spices: { id: 'zetwal_spices', name: 'Spice row', city: 'zetwal', stock: ['pikliz', 'akasan'] },
  zetwal_fish: { id: 'zetwal_fish', name: 'Fish stall', city: 'zetwal', stock: ['pwason_fri', 'lanbi_fritters', 'spiny_lobster'] },
  zetwal_cloth: { id: 'zetwal_cloth', name: 'Cloth row', city: 'zetwal', stock: ['woven_tunic', 'temple_robe'] },
};

/**
 * City maps (engine/cityMap.ts): outdoor sections placed on one grid at `at` (tiles), so the city
 * map shows their real shape; indoor sections appear as buildings at their doors.
 */
export const CITIES: Readonly<Record<string, CityDef>> = {
  zetwal: {
    id: 'zetwal',
    // The capital of the island nation of Zetwal (owner decision, Oct 14): Kreyol "Port of Light", one
    // word the way Port-de-Paix is Pòdepè (pò = port). A fluent speaker checks it (Nov 18).
    name: 'Pòdlimyè',
    house: 'Kay Soley',
    // The plaza in the middle with Accord Square and the Hall of the Accord at its head (owner decision,
    // Oct 15: the seat of the state central); the Iron Market west, the Old Harbor along the shore
    // south-west, Solèy Heights up the hill west of the square (at least five outdoor areas, buildings
    // aside); the Temple Island across the water to the north-east (the Chain
    // Bridge); the Cane Road straight out of the east gate.
    sections: [
      { map: 'zetwal-town', name: 'Festival Plaza', at: { x: 0, y: 9 } },
      { map: 'zetwal-temple', name: 'Temple Island', at: { x: 44, y: -4 } },
      { map: 'zetwal-road', name: 'The Cane Road', at: { x: 40, y: 16 } },
      { map: 'zetwal-market', name: 'The Iron Market', at: { x: -36, y: 4 } },
      { map: 'zetwal-harbor', name: 'The Old Harbor', at: { x: -36, y: 28 } },
      { map: 'zetwal-heights', name: 'Solèy Heights', at: { x: -29, y: -16 } },
      { map: 'zetwal-square', name: 'Accord Square', at: { x: 1, y: -13 } },
      { map: 'zetwal-house', name: 'Limyè house' },
      { map: 'zetwal-hall', name: 'Hall of the Accord' },
      { map: 'zetwal-archive', name: 'Temple Archive' },
    ],
  },
};

/** The realm around Eightgate, as on the board (Ardencia north, then clockwise); shapes in data/realmMap.ts. */
export const REALM: readonly RealmPlace[] = [
  // The realm's neutral city, where every house may come and none may draw steel (so they say). The
  // old seat of the realm stands at its heart; whether Elodie blessed it is argued (data/books.ts).
  { id: 'seat', name: 'Eightgate', house: 'Open to all houses' },
  { id: 'ardencia', name: 'Ardencia', house: 'Brasador' },
  { id: 'zetwal', name: 'Zetwal', house: 'Kay Soley', city: 'zetwal' },
  { id: 'al_doria', name: 'Al-Doria', house: 'Dorini' },
  { id: 'skarragol', name: 'Skarragol', house: 'Ironvow' },
  { id: 'kuroshi', name: 'Kuroshi', house: 'Suzumori' },
  { id: 'jwaladesh', name: 'Jwaladesh', house: 'Agnivansh' },
  { id: 'aldermoor', name: 'Aldermoor', house: 'Stillwater' },
  { id: 'xaragua', name: 'Xaraguá', house: 'Yaguana' },
];

export const RPG: RpgContent = {
  items: ITEMS,
  classWeapons: { mage: ['staff'], archer: ['bow'], warrior: ['blade'] },
  members: MEMBERS,
  shops: SHOPS,
  cities: CITIES,
  realm: REALM,
  // Each lore book read in a city: +1 Influence there (guide 6.3: library lore earns Influence).
  pillarRules: [{ pillar: 'influence', city: 'zetwal', flags: BOOKS.filter((b) => b.id.startsWith('zetwal_')).map((b) => loreFlag(b.id)), each: 1 }],
  startingGold: STARTING_GOLD,
  bagLimit: BAG_LIMIT,
  // Chapter 1 has no fights: XP comes from the story's steps and the books read.
  xpRules: [
    { flags: ACT1.objectives.flatMap((o) => flagsIn(o.done)), each: XP_PER_OBJECTIVE },
    { flags: BOOKS.map((b) => loreFlag(b.id)), each: XP_PER_BOOK },
  ],
  levels: LEVELS,
};
