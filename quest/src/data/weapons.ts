// Weapons as "X of Y" (owner decision, Oct 15): a design (X) is a picture, a level and base stats; a
// suffix (Y) is what that copy does. Three designs per rarity for each weapon type, and three suffixes
// per rarity, so the same design comes in different versions: a Sunwood Staff of Clarity and a Sunwood
// Staff of Swiftness look alike and play differently. Suffix effects grow with rarity: common and
// uncommon add stats, rare brings a skill (free, no spell slot), epic brings a skill and a special.
// Every named weapon is a fixed item, placed by hand in a shop, chest or reward (owner, Oct 15).
//
// A few weapons keep the ids they had before names (archivist_staff and the like): saves and shops
// already use them.

import type { ItemDef, ItemSpecial, Rarity, Stats, WeaponType } from '../engine/rpg.ts';

interface Design {
  id: string;
  name: string;
  weapon: WeaponType;
  rarity: Exclude<Rarity, 'legendary'>;
  level: number;
  price: number;
  stats: Partial<Stats>;
  edge?: 'blade' | 'spike';
  text: string;
}

interface Suffix {
  id: string;
  /** Shown after the design: "of <name>". */
  name: string;
  weapon: WeaponType;
  rarity: Exclude<Rarity, 'legendary'>;
  stats?: Partial<Stats>;
  special?: ItemSpecial;
  /** A skill or weapon move (data/battles.ts GEAR_SKILLS). */
  skill?: string;
  /** What it does, for the item text. */
  text: string;
}

const PRICE_UP: Record<Design['rarity'], number> = { common: 10, uncommon: 40, rare: 120, epic: 300 };

export const DESIGNS: readonly Design[] = [
  // Staffs (mages).
  { id: 'archivist_staff', name: "Archivist's Staff", weapon: 'staff', rarity: 'common', level: 1, price: 80, stats: { mag: 3 }, text: 'A plain staff of temple wood with a brass cap. Every junior archivist gets one.' },
  { id: 'driftwood_staff', name: 'Driftwood Staff', weapon: 'staff', rarity: 'common', level: 1, price: 70, stats: { mag: 2, sp: 3 }, text: 'Sea-bleached driftwood with a white shell tied at the top.' },
  { id: 'caneroot_staff', name: 'Cane-Root Staff', weapon: 'staff', rarity: 'common', level: 2, price: 90, stats: { mag: 3, hp: 4 }, text: 'A thick stalk of sugarcane, its root ball wrapped in a green leaf.' },
  { id: 'sunwood_staff', name: 'Sunwood Staff', weapon: 'staff', rarity: 'uncommon', level: 4, price: 240, stats: { mag: 6, spd: 1 }, text: 'Gold-grained wood with a carved spiral and a small sun at the top.' },
  { id: 'coral_staff', name: 'Coral Staff', weapon: 'staff', rarity: 'uncommon', level: 4, price: 230, stats: { mag: 5, sp: 4 }, text: 'Dark wood crowned with red coral and sea-glass beads.' },
  { id: 'mahogany_staff', name: 'Mahogany Staff', weapon: 'staff', rarity: 'uncommon', level: 5, price: 260, stats: { mag: 6, def: 1 }, text: 'Polished red mahogany with a carved anole climbing to the knob.' },
  { id: 'lantern_staff', name: 'Lantern Staff', weapon: 'staff', rarity: 'rare', level: 8, price: 520, stats: { mag: 9, sp: 6 }, text: 'Black wood bent into a hook, a small brass lantern hanging from it.' },
  { id: 'thorn_staff', name: 'Thornwood Staff', weapon: 'staff', rarity: 'rare', level: 8, price: 480, stats: { mag: 7, atk: 5 }, edge: 'spike', text: 'Thornwood with a head of iron spikes. It hits like a mace.' },
  { id: 'tideglass_staff', name: 'Tide-Glass Staff', weapon: 'staff', rarity: 'rare', level: 9, price: 560, stats: { mag: 9, sp: 8 }, text: 'A silver cage at the top holds a glowing crystal of sea glass.' },
  { id: 'glaive_staff', name: 'Sun-Glaive Staff', weapon: 'staff', rarity: 'epic', level: 12, price: 1400, stats: { mag: 13, atk: 9, sp: 6 }, edge: 'blade', text: 'A temple staff with a curved gold-steel blade, the sun etched on it.' },
  { id: 'starfall_staff', name: 'Starfall Staff', weapon: 'staff', rarity: 'epic', level: 12, price: 1350, stats: { mag: 14, sp: 4 }, text: 'Black iron and silver; a star shard floats in the crescent at its head.' },
  { id: 'archivekey_staff', name: 'Archive-Key Staff', weapon: 'staff', rarity: 'epic', level: 13, price: 1450, stats: { mag: 12, sp: 10 }, text: 'A gold staff shaped like a great key, a small book chained to it.' },
  // Bows (archers).
  { id: 'yaguana_bow', name: 'Yaguana Bow', weapon: 'bow', rarity: 'common', level: 1, price: 90, stats: { atk: 4 }, text: "Yari's own bow: plain wood, the grip wrapped in cord she twisted herself." },
  { id: 'cane_bow', name: 'Cane Bow', weapon: 'bow', rarity: 'common', level: 1, price: 80, stats: { atk: 3, spd: 1 }, text: 'Split green sugarcane bound with brown cord.' },
  { id: 'fisher_bow', name: "Fisher's Bow", weapon: 'bow', rarity: 'common', level: 2, price: 95, stats: { atk: 4, hp: 3 }, text: 'A short grey bow with fishing line coiled on a limb and shells at the grip.' },
  { id: 'ironwood_bow', name: 'Ironwood Bow', weapon: 'bow', rarity: 'uncommon', level: 4, price: 260, stats: { atk: 7, spd: 1 }, text: 'Dark, heavy ironwood with iron tips. It hits like a hammer.' },
  { id: 'mangrove_bow', name: 'Mangrove Bow', weapon: 'bow', rarity: 'uncommon', level: 4, price: 250, stats: { atk: 6, hp: 6 }, text: 'Twisting red mangrove root, still putting out green leaves.' },
  { id: 'bonetipped_bow', name: 'Bone-Tipped Bow', weapon: 'bow', rarity: 'uncommon', level: 5, price: 270, stats: { atk: 6, spd: 2 }, text: 'Honey-coloured wood with carved bone tips and a red cord grip.' },
  { id: 'goldband_bow', name: 'Gold-Banded Bow', weapon: 'bow', rarity: 'rare', level: 8, price: 560, stats: { atk: 10, spd: 2 }, text: "Pale wood bound with gold bands, made for a cacique's guard." },
  { id: 'storm_bow', name: 'Storm Bow', weapon: 'bow', rarity: 'rare', level: 8, price: 540, stats: { atk: 9, spd: 3 }, text: 'Blue-grey wood wrapped in copper wire; sparks crackle along it.' },
  { id: 'cacique_bow', name: "Cacique's Bow", weapon: 'bow', rarity: 'rare', level: 9, price: 580, stats: { atk: 10, def: 2 }, text: 'Dark wood carved with Taíno spirals, gold discs at the tips.' },
  { id: 'sunfeather_bow', name: 'Sunfeather Bow', weapon: 'bow', rarity: 'epic', level: 12, price: 1400, stats: { atk: 14, spd: 2 }, text: 'Gold limbs like long feathers, a small sun glowing at the grip.' },
  { id: 'moonshell_bow', name: 'Moonshell Bow', weapon: 'bow', rarity: 'epic', level: 12, price: 1350, stats: { atk: 13, sp: 6 }, text: 'Limbs of mother-of-pearl with silver tips and a crescent at the grip.' },
  { id: 'hurricane_bow', name: 'Hurricane Bow', weapon: 'bow', rarity: 'epic', level: 13, price: 1450, stats: { atk: 13, spd: 4 }, text: 'Deep blue wood curling into storm spirals at both tips.' },
  // Blades (warriors). More designs come with Patricio's battle art.
  { id: 'cane_machete', name: 'Cane Machete', weapon: 'blade', rarity: 'common', level: 1, price: 70, stats: { atk: 3 }, text: "A cane cutter's blade, iron and wood." },
  { id: 'marshal_cutlass', name: 'Cutlass', weapon: 'blade', rarity: 'common', level: 1, price: 120, stats: { atk: 5 }, text: "The Marshal's cutlass, notched from the war." },
  { id: 'steel_saber', name: 'Steel Saber', weapon: 'blade', rarity: 'uncommon', level: 4, price: 280, stats: { atk: 8 }, text: 'Bright steel with a brass guard, from the harbor forge.' },
];

export const SUFFIXES: readonly Suffix[] = [
  // Staffs.
  { id: 'scribe', name: 'the Scribe', weapon: 'staff', rarity: 'common', stats: { sp: 3 }, text: 'Of the Scribe: +3 SP.' },
  { id: 'focus', name: 'Focus', weapon: 'staff', rarity: 'common', stats: { mag: 1 }, text: 'Of Focus: +1 MAG.' },
  { id: 'breeze', name: 'the Breeze', weapon: 'staff', rarity: 'common', stats: { spd: 1 }, text: 'Of the Breeze: +1 SPD.' },
  { id: 'clarity', name: 'Clarity', weapon: 'staff', rarity: 'uncommon', stats: { sp: 6, mag: 1 }, text: 'Of Clarity: +6 SP, +1 MAG.' },
  { id: 'swiftness', name: 'Swiftness', weapon: 'staff', rarity: 'uncommon', stats: { spd: 2 }, text: 'Of Swiftness: +2 SPD.' },
  { id: 'warding', name: 'Warding', weapon: 'staff', rarity: 'uncommon', stats: { def: 2, hp: 4 }, text: 'Of Warding: +2 DEF, +4 HP.' },
  { id: 'embers', name: 'Embers', weapon: 'staff', rarity: 'rare', skill: 'lantern_flare', text: 'Of Embers: brings Ember Flare (fire at one foe).' },
  { id: 'briars', name: 'Briars', weapon: 'staff', rarity: 'rare', skill: 'briar_snare', text: 'Of Briars: brings Briar Snare (earth; the foe is slowed).' },
  { id: 'tide', name: 'the Tide', weapon: 'staff', rarity: 'rare', skill: 'tidewash', text: 'Of the Tide: brings Tidewash (heals one ally and clears what ails them).' },
  { id: 'dawn', name: 'the Dawn', weapon: 'staff', rarity: 'epic', skill: 'dawn_glaive', special: { kind: 'spRegen', value: 5, text: '+5% SP each turn.' }, text: 'Of the Dawn: brings Dawnlight (light at every foe) and +5% SP each turn.' },
  { id: 'stars', name: 'the Stars', weapon: 'staff', rarity: 'epic', skill: 'falling_star', special: { kind: 'regen', value: 3, text: 'Heals 3% of max HP each turn.' }, text: 'Of the Stars: brings Falling Star (a great light at one foe) and heals 3% each turn.' },
  { id: 'archive', name: 'the Archive', weapon: 'staff', rarity: 'epic', skill: 'archive_ward', special: { kind: 'spRegen', value: 4, text: '+4% SP each turn.' }, text: 'Of the Archive: brings Archive Ward (the whole party is warded) and +4% SP each turn.' },
  // Bows.
  { id: 'hunt', name: 'the Hunt', weapon: 'bow', rarity: 'common', stats: { atk: 1 }, text: 'Of the Hunt: +1 ATK.' },
  { id: 'quickness', name: 'Quickness', weapon: 'bow', rarity: 'common', stats: { spd: 1 }, text: 'Of Quickness: +1 SPD.' },
  { id: 'shore', name: 'the Shore', weapon: 'bow', rarity: 'common', stats: { hp: 4 }, text: 'Of the Shore: +4 HP.' },
  { id: 'force', name: 'Force', weapon: 'bow', rarity: 'uncommon', stats: { atk: 2 }, text: 'Of Force: +2 ATK.' },
  { id: 'swiftness', name: 'Swiftness', weapon: 'bow', rarity: 'uncommon', stats: { spd: 2 }, text: 'Of Swiftness: +2 SPD.' },
  { id: 'precision', name: 'Precision', weapon: 'bow', rarity: 'uncommon', special: { kind: 'crit', value: 5, text: '+5% critical chance.' }, text: 'Of Precision: +5% critical chance.' },
  { id: 'sun', name: 'the Sun', weapon: 'bow', rarity: 'rare', skill: 'sun_arrow', text: 'Of the Sun: brings Sun Arrow (a burning light shot).' },
  { id: 'thunder', name: 'Thunder', weapon: 'bow', rarity: 'rare', skill: 'storm_shot', text: 'Of Thunder: brings Storm Shot (wind; the foe is slowed).' },
  { id: 'cacique', name: 'the Cacique', weapon: 'bow', rarity: 'rare', skill: 'spirit_arrow', text: 'Of the Cacique: brings Spirit Arrow (the foe is marked).' },
  { id: 'dawn', name: 'the Dawn', weapon: 'bow', rarity: 'epic', skill: 'sunburst_arrow', special: { kind: 'crit', value: 8, text: '+8% critical chance.' }, text: 'Of the Dawn: brings Sunburst Arrow (light at every foe) and +8% critical chance.' },
  { id: 'moon', name: 'the Moon', weapon: 'bow', rarity: 'epic', skill: 'moonlit_shot', special: { kind: 'spRegen', value: 5, text: '+5% SP each turn.' }, text: 'Of the Moon: brings Moonlit Shot (a heavy water shot) and +5% SP each turn.' },
  { id: 'hurricane', name: 'the Hurricane', weapon: 'bow', rarity: 'epic', skill: 'hurricane_volley', special: { kind: 'crit', value: 5, text: '+5% critical chance.' }, text: 'Of the Hurricane: brings Hurricane Volley (five arrows on the wind) and +5% critical chance.' },
  // Blades (common and uncommon so far).
  { id: 'edge', name: 'the Edge', weapon: 'blade', rarity: 'common', stats: { atk: 1 }, text: 'Of the Edge: +1 ATK.' },
  { id: 'guard', name: 'the Guard', weapon: 'blade', rarity: 'common', stats: { def: 1 }, text: 'Of the Guard: +1 DEF.' },
  { id: 'march', name: 'the March', weapon: 'blade', rarity: 'common', stats: { hp: 5 }, text: 'Of the March: +5 HP.' },
  { id: 'force', name: 'Force', weapon: 'blade', rarity: 'uncommon', stats: { atk: 2 }, text: 'Of Force: +2 ATK.' },
  { id: 'guarding', name: 'Guarding', weapon: 'blade', rarity: 'uncommon', stats: { def: 2, hp: 4 }, text: 'Of Guarding: +2 DEF, +4 HP.' },
  { id: 'swiftness', name: 'Swiftness', weapon: 'blade', rarity: 'uncommon', stats: { spd: 2 }, text: 'Of Swiftness: +2 SPD.' },
];

/** Weapons that keep the id they had before names: [design, suffix]. */
const LEGACY_IDS: Readonly<Record<string, readonly [string, string]>> = {
  archivist_staff: ['archivist_staff', 'scribe'],
  sunwood_staff: ['sunwood_staff', 'clarity'],
  lantern_staff: ['lantern_staff', 'embers'],
  thorn_staff: ['thorn_staff', 'briars'],
  glaive_staff: ['glaive_staff', 'dawn'],
  yaguana_bow: ['yaguana_bow', 'hunt'],
  ironwood_bow: ['ironwood_bow', 'force'],
  goldband_bow: ['goldband_bow', 'sun'],
  cane_machete: ['cane_machete', 'edge'],
  marshal_cutlass: ['marshal_cutlass', 'guard'],
  steel_saber: ['steel_saber', 'force'],
};

/** The item id of a design with a suffix. */
export function weaponId(design: string, suffix: string): string {
  const legacy = Object.entries(LEGACY_IDS).find(([, [d, s]]) => d === design && s === suffix);
  return legacy ? legacy[0] : `${design}_of_${suffix}`;
}

function addStats(a: Partial<Stats>, b: Partial<Stats> = {}): Partial<Stats> {
  const out: Partial<Stats> = { ...a };
  for (const [k, v] of Object.entries(b) as [keyof Stats, number][]) out[k] = (out[k] ?? 0) + v;
  return out;
}

/** Every named weapon: each design with each suffix of its weapon type and rarity. */
export const WEAPONS: readonly ItemDef[] = DESIGNS.flatMap((d) =>
  SUFFIXES.filter((s) => s.weapon === d.weapon && s.rarity === d.rarity).map(
    (s): ItemDef => ({
      id: weaponId(d.id, s.id),
      name: `${d.name} of ${s.name}`,
      kind: 'gear',
      slot: 'weapon',
      weapon: d.weapon,
      rarity: d.rarity,
      level: d.level,
      price: d.price + PRICE_UP[d.rarity],
      stats: addStats(d.stats, s.stats),
      ...(d.edge ? { edge: d.edge } : {}),
      ...(s.special ? { special: s.special } : {}),
      ...(s.skill ? { skill: s.skill } : {}),
      art: d.id,
      text: `${d.text} ${s.text}`,
    }),
  ),
);
