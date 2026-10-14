// The party, the purse and the places: items, party members, shops, the city maps and the realm map
// (engine/rpg.ts runs the rules). Owner decision (Oct 14): gold is what you spend; Influence, Wealth
// and Fear are reputation scores per city and realm-wide; armies are military might.

import { BAG_LIMIT, LEVELS, STARTING_GOLD, XP_PER_BOOK, XP_PER_OBJECTIVE } from '../config.ts';
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
      // Revealed in Ardencia (Chapter 4), when Lord Rael's signet glows beside it.
      { name: 'Two halves of a promise', text: 'Near its other half, the Brasador signet, both halves glow.', known: { flag: 'story.signet_glowed' } },
    ],
  },
  // The secret items (docs/quest/design/SECRET-ITEMS.md, owner approved Oct 14), one per capital.
  {
    id: 'solange_quill',
    name: "Solange's Quill",
    kind: 'key',
    price: 0,
    text: 'The quill Mother Solange wrote the first names with. The nib is worn to a slant by her hand.',
    showcase: 'legendary',
    abilities: [
      { name: 'Say Their Names', text: 'Once per battle, every Bound or fallen ally rises with 30% HP, and Anissa gains Calm and Spark.' },
    ],
  },

  // Zetwal food and drink (guide 8: restorative soup in a clay pot).
  { id: 'soup_pot', name: 'Clay-pot soup', kind: 'consumable', price: 30, heals: 40, text: 'Squash soup in a clay pot, still warm. Restores 40 HP, a little at a time.' },
  { id: 'akasan', name: 'Akasan', kind: 'consumable', price: 25, restores: 12, text: 'Sweet cornmeal drink, thick enough to stand a spoon in. Restores 12 SP.' },
  { id: 'mango', name: 'Ripe mango', kind: 'consumable', price: 10, heals: 15, text: 'From the plaza stalls. Restores 15 HP.' },

  // Weapons.
  { id: 'archivist_staff', name: "Archivist's staff", kind: 'gear', slot: 'weapon', price: 80, stats: { mag: 3 }, users: ['gianna'], text: 'A plain staff of temple wood. Every junior archivist gets one.' },
  { id: 'sunwood_staff', level: 4, name: 'Sunwood staff', kind: 'gear', slot: 'weapon', price: 240, stats: { mag: 6, spd: 1 }, users: ['gianna'], text: 'Gold-grained wood that warms in the hand. Spells come easier.' },
  { id: 'yaguana_bow', name: 'Yaguana bow', kind: 'gear', slot: 'weapon', price: 90, stats: { atk: 4 }, users: ['yari'], text: "Yari's own bow, strung with cord she twisted herself." },
  { id: 'ironwood_bow', level: 4, name: 'Ironwood bow', kind: 'gear', slot: 'weapon', price: 260, stats: { atk: 7, spd: 1 }, users: ['yari'], text: 'Dark, heavy ironwood. It hits like a hammer.' },
  { id: 'marshal_cutlass', name: 'Cutlass', kind: 'gear', slot: 'weapon', price: 120, stats: { atk: 5 }, users: ['patricio'], text: "The Marshal's cutlass, notched from the war." },
  { id: 'cane_machete', name: 'Cane machete', kind: 'gear', slot: 'weapon', price: 70, stats: { atk: 3 }, text: 'A cane cutter\'s blade. Anyone can swing it.' },

  // Armor.
  { id: 'archivist_robe', name: "Archivist's robe", kind: 'gear', slot: 'armor', price: 60, stats: { def: 2, sp: 4 }, users: ['gianna'], text: 'Blue with gold trim, ink on both cuffs.' },
  { id: 'woven_tunic', name: 'Woven tunic', kind: 'gear', slot: 'armor', price: 60, stats: { def: 3, hp: 5 }, users: ['yari'], text: 'Green cotton, woven tight on a Xaraguá loom.' },
  { id: 'officer_coat', level: 1, name: "Officer's coat", kind: 'gear', slot: 'armor', price: 150, stats: { def: 5, hp: 10 }, users: ['patricio'], text: 'Red wool and gold buttons, heavy as a promise.' },
  { id: 'padded_vest', level: 3, name: 'Padded vest', kind: 'gear', slot: 'armor', price: 140, stats: { def: 4, hp: 6 }, text: 'Quilted cotton over leather. Anyone can wear it.' },

  // Charms (guide 8: the sun-stitched cloth charm).
  { id: 'sun_charm', level: 2, name: 'Sun-stitched charm', kind: 'gear', slot: 'charm', price: 90, stats: { hp: 8, def: 1 }, text: 'A cloth charm stitched with a sun. In battle it will heal a little each turn.', showcase: 'reward' },
  { id: 'sea_glass_charm', name: 'Sea-glass charm', kind: 'gear', slot: 'charm', price: 70, stats: { spd: 2 }, text: 'Green sea glass on a cord. Light on the neck, quick on the feet.' },
];

export const ITEMS: Readonly<Record<string, ItemDef>> = Object.fromEntries(ITEM_LIST.map((i) => [i.id, i]));

export const MEMBERS: readonly MemberDef[] = [
  {
    id: 'gianna', name: 'Gianna', role: 'Archivist-Mage', house: 'Kay Soley', portrait: 'gianna', era: 'present',
    base: { hp: 42, sp: 30, atk: 6, def: 6, mag: 14, spd: 9 }, growth: { hp: 5, sp: 4, atk: 1, def: 1, mag: 2, spd: 1 },
    start: { weapon: 'archivist_staff', armor: 'archivist_robe' },
  },
  {
    id: 'anissa', name: 'Anissa', role: 'Surge (support)', house: 'Kay Soley', portrait: 'anissa', era: 'present', support: true,
    joins: { flag: 'party.anissa' }, base: zero, growth: zero,
  },
  {
    id: 'yari', name: 'Yari', role: 'Archer', house: 'Yaguana', portrait: 'yari', era: 'present',
    joins: { flag: 'act1.complete' },
    base: { hp: 50, sp: 16, atk: 12, def: 7, mag: 6, spd: 13 }, growth: { hp: 6, sp: 2, atk: 2, def: 1, mag: 1, spd: 2 },
    start: { weapon: 'yaguana_bow', armor: 'woven_tunic' },
  },
  {
    id: 'patricio', name: 'Patricio', role: 'Warden', house: 'Kay Soley', portrait: 'patricio', era: 'echo',
    base: { hp: 70, sp: 10, atk: 13, def: 12, mag: 3, spd: 7 }, growth: { hp: 8, sp: 1, atk: 2, def: 2, mag: 0, spd: 1 },
    start: { weapon: 'marshal_cutlass', armor: 'officer_coat' },
  },
];

export const SHOPS: Readonly<Record<string, ShopDef>> = {
  zetwal_forge: { id: 'zetwal_forge', name: 'Harbor forge', city: 'zetwal', stock: ['cane_machete', 'sunwood_staff', 'ironwood_bow', 'padded_vest'] },
  zetwal_charms: { id: 'zetwal_charms', name: 'Charm stand', city: 'zetwal', stock: ['sun_charm', 'sea_glass_charm'] },
  zetwal_market: { id: 'zetwal_market', name: 'Market stand', city: 'zetwal', stock: ['soup_pot', 'akasan', 'mango'] },
};

/** City maps: each section a box on a 13 x 8 grid, joined where a door joins them. */
export const CITIES: Readonly<Record<string, CityDef>> = {
  zetwal: {
    id: 'zetwal',
    // The capital of the island nation of Zetwal (owner decision, Oct 14): Kreyol "Port of Light", one
    // word the way Port-de-Paix is Pòdepè (pò = port). A fluent speaker checks it (Nov 18).
    name: 'Pòdlimyè',
    house: 'Kay Soley',
    sections: [
      { map: 'zetwal-house', name: 'Limyè house', box: { x: 0, y: 0, w: 3, h: 2 } },
      { map: 'zetwal-hall', name: 'Hall of the Accord', box: { x: 4, y: 0, w: 3, h: 2 } },
      { map: 'zetwal-town', name: 'Festival Plaza', box: { x: 0, y: 3, w: 7, h: 3 } },
      { map: 'zetwal-temple', name: 'Temple Island', box: { x: 9, y: 0, w: 4, h: 2 } },
      { map: 'zetwal-archive', name: 'Temple Archive', box: { x: 9, y: 3, w: 4, h: 1 } },
      { map: 'zetwal-road', name: 'The Cane Road', box: { x: 9, y: 5, w: 4, h: 2 } },
    ],
    links: [
      ['zetwal-house', 'zetwal-town'],
      ['zetwal-hall', 'zetwal-town'],
      ['zetwal-town', 'zetwal-temple'],
      ['zetwal-temple', 'zetwal-archive'],
      ['zetwal-town', 'zetwal-road'],
    ],
  },
};

/** The realm around Elodie's Seat, as on the board (Ardencia north, then clockwise). */
export const REALM: readonly RealmPlace[] = [
  { id: 'seat', name: "Elodie's Seat", house: 'The Throne', x: 50, y: 50 },
  { id: 'ardencia', name: 'Ardencia', house: 'Brasador', x: 50, y: 12 },
  { id: 'zetwal', name: 'Zetwal', house: 'Kay Soley', x: 80, y: 22, city: 'zetwal' },
  { id: 'al_doria', name: 'Al-Doria', house: 'Dorini', x: 88, y: 50 },
  { id: 'skarragol', name: 'Skarragol', house: 'Ironvow', x: 80, y: 78 },
  { id: 'kuroshi', name: 'Kuroshi', house: 'Suzumori', x: 50, y: 88 },
  { id: 'jwaladesh', name: 'Jwaladesh', house: 'Agnivansh', x: 20, y: 78 },
  { id: 'aldermoor', name: 'Aldermoor', house: 'Stillwater', x: 12, y: 50 },
  { id: 'xaragua', name: 'Xaraguá', house: 'Yaguana', x: 20, y: 22 },
];

export const RPG: RpgContent = {
  items: ITEMS,
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
