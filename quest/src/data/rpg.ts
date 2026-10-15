// The party, the purse and the places: items, party members, shops, the city maps and the realm map
// (engine/rpg.ts runs the rules). Owner decision (Oct 14): gold is what you spend; Influence, Wealth
// and Fear are reputation scores per city and realm-wide; armies are military might.

import { ANISSA_SP_EVERY, ANISSA_SP_SHARE, BAG_LIMIT, LEVELS, STARTING_GOLD, SURGE_COST, XP_PER_BOOK, XP_PER_OBJECTIVE } from '../config.ts';
import { flagsIn } from '../engine/conditions.ts';
import type { CityDef, ItemDef, MemberDef, RealmPlace, RpgContent, ShopDef } from '../engine/rpg.ts';
import { BOOKS, loreFlag } from './books.ts';
import { ACT1 } from './quests.ts';

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
    text: 'The quill Mother Solange wrote the first names with. The nib is worn to a slant by her hand.',
    showcase: 'legendary',
    abilities: [
      { name: 'Say Their Names', text: 'Once per battle, every Bound or fallen ally rises with 30% HP, and Anissa gains Calm and Spark.' },
    ],
  },

  // Zetwal food and drink (guide 8: restorative soup in a clay pot).
  { id: 'soup_pot', name: 'Clay-pot soup', kind: 'consumable', price: 30, heals: 40, healTurns: 3, text: 'Squash soup in a clay pot, still warm. Restores 40 HP, a little at a time.' },
  { id: 'akasan', name: 'Akasan', kind: 'consumable', price: 25, restores: 12, text: 'Sweet cornmeal drink, thick enough to stand a spoon in. Restores 12 SP.' },
  { id: 'mango', name: 'Ripe mango', kind: 'consumable', price: 10, heals: 15, text: 'From the plaza stalls. Restores 15 HP.' },

  // Gear (owner decision, Oct 15): staffs for mages, bows for archers, blades for warriors; anyone may
  // wear any armour, but robes suit mages (magic, SP), leather archers (speed, attack) and heavy armour
  // warriors (defence, HP, slower). Rarity sets the colour behind the picture and how good it is:
  // common and uncommon give stats, rare and epic add a special, legendary are the secret items.
  // Each has a set level (worn below it, half its bonus counts); legendary grow with their wearer.

  // Staffs (mages).
  { id: 'archivist_staff', name: "Archivist's staff", kind: 'gear', slot: 'weapon', weapon: 'staff', level: 1, price: 80, stats: { mag: 3 }, text: 'A plain staff of temple wood. Every junior archivist gets one.' },
  { id: 'sunwood_staff', level: 4, rarity: 'uncommon', name: 'Sunwood staff', kind: 'gear', slot: 'weapon', weapon: 'staff', price: 240, stats: { mag: 6, spd: 1 }, text: 'Gold-grained wood that warms in the hand. Spells come easier.' },
  {
    id: 'lantern_staff', level: 8, rarity: 'rare', name: 'Lantern staff', kind: 'gear', slot: 'weapon', weapon: 'staff', price: 520, stats: { mag: 9, sp: 6 },
    special: { kind: 'spRegen', value: 5, text: 'Its lantern head relights her: +5% SP each turn.' },
    text: 'A staff of black wood crowned with a little brass lantern that never quite goes out.',
  },
  // Bows (archers).
  { id: 'yaguana_bow', name: 'Yaguana bow', kind: 'gear', slot: 'weapon', weapon: 'bow', level: 1, price: 90, stats: { atk: 4 }, text: "Yari's own bow: plain wood, strung with cord she twisted herself." },
  { id: 'ironwood_bow', level: 4, rarity: 'uncommon', name: 'Ironwood bow', kind: 'gear', slot: 'weapon', weapon: 'bow', price: 260, stats: { atk: 7, spd: 1 }, text: 'Dark, heavy ironwood. It hits like a hammer.' },
  {
    id: 'goldband_bow', level: 8, rarity: 'rare', name: 'Gold-banded bow', kind: 'gear', slot: 'weapon', weapon: 'bow', price: 560, stats: { atk: 10, spd: 2 },
    special: { kind: 'crit', value: 8, text: 'Steady in the hand: +8% critical chance.' },
    text: 'Ironwood bound with gold bands at the grip and tips, made for a cacique\'s guard.',
  },
  // Blades (warriors).
  { id: 'cane_machete', name: 'Cane machete', kind: 'gear', slot: 'weapon', weapon: 'blade', level: 1, price: 70, stats: { atk: 3 }, text: "A cane cutter's blade, iron and wood." },
  { id: 'marshal_cutlass', name: 'Cutlass', kind: 'gear', slot: 'weapon', weapon: 'blade', level: 1, price: 120, stats: { atk: 5 }, text: "The Marshal's cutlass, notched from the war." },
  { id: 'steel_saber', level: 4, rarity: 'uncommon', name: 'Steel saber', kind: 'gear', slot: 'weapon', weapon: 'blade', price: 280, stats: { atk: 8 }, text: 'Bright steel with a brass guard, from the harbor forge.' },

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
    // The plaza and harbor in the west; the Temple Island across the water to the north-east (the
    // Chain Bridge); the Cane Road straight out of the east gate.
    sections: [
      { map: 'zetwal-town', name: 'Festival Plaza', at: { x: 0, y: 9 } },
      { map: 'zetwal-temple', name: 'Temple Island', at: { x: 44, y: -4 } },
      { map: 'zetwal-road', name: 'The Cane Road', at: { x: 40, y: 16 } },
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
