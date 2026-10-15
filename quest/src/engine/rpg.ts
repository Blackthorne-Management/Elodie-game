// The party and the purse: gold, the three pillars (Influence, Wealth, Fear) per city and realm-wide,
// armies, party members and their stats, the bag (with a size limit), equipment, and shops. Pure
// TypeScript over the flag store, so saves need no new format and every rule is unit tested.
//
// Flags used:
//   gold                         gold on hand (unset: STARTING_GOLD)
//   pillar.<pillar>.<city>       a pillar earned in one city (plus what PILLAR_RULES derive)
//   army.<group>                 soldiers pledged by an allied group
//   item.<id>                    how many of an item are in the bag (key items: true)
//   equip.<member>.<slot>        the item a member wears in a slot ('' = nothing; unset = their start gear)
//   xp.<member>                  XP a member earned alone (battles, later); shared XP is derived (XP_RULES)
//   side.<quest>.rewarded        a side quest's reward was paid
//   visited.<map>                the player has been on that map

import type { Condition } from './conditions.ts';
import { evaluate } from './conditions.ts';
import type { FlagReader, FlagStore } from './flags.ts';

// ---- Content shapes ---------------------------------------------------------------------------

export const PILLARS = ['influence', 'wealth', 'fear'] as const;
export type Pillar = (typeof PILLARS)[number];

export const STAT_KEYS = ['hp', 'sp', 'atk', 'def', 'mag', 'spd'] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export type Stats = Record<StatKey, number>;

export const SLOTS = ['weapon', 'armor', 'charm', 'relic'] as const;
export type Slot = (typeof SLOTS)[number];

/** Rarity, low to high (owner decision, Oct 15): the colour behind an item's picture. */
export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const;
export type Rarity = (typeof RARITIES)[number];

/** Who may hold a weapon: staffs are for mages, bows for archers, blades for warriors. */
export type WeaponType = 'staff' | 'bow' | 'blade';
/** Anyone may wear any armour, but each kind suits a class: robes (mages), leather (archers), heavy (warriors). */
export type ArmorType = 'robe' | 'leather' | 'heavy';
export type MemberClass = 'mage' | 'archer' | 'warrior';

/**
 * A special property (rare and above): shown on the item, used in battle (engine/battle.ts).
 * regen: heals `value`% of max HP at the start of the wearer's turn; spRegen: the same for SP;
 * crit: +`value` points of critical chance.
 */
export interface ItemSpecial {
  kind: 'regen' | 'spRegen' | 'crit';
  value: number;
  text: string;
}

/** A member's passive, shown on the Equip screen (and used in battle when it has a battle effect). */
export interface Passive {
  name: string;
  text: string;
  /** Known once this holds (always when omitted); unknown passives are not listed. */
  known?: Condition;
}

export interface ItemDef {
  id: string;
  name: string;
  /** consumable: used up; gear: worn in a slot; key: story items (never sold, never count against the bag). */
  kind: 'consumable' | 'gear' | 'key';
  slot?: Slot;
  /** Shop price in gold (sells for half, rounded down). 0 for key items. */
  price: number;
  /** Bonuses while worn. */
  stats?: Partial<Stats>;
  /** Consumables: HP restored (shown now; used in battles once they exist). */
  heals?: number;
  /** SP restored. */
  restores?: number;
  /** Heals over this many turns in battle instead of at once (the clay-pot soup). */
  healTurns?: number;
  /** Members who can wear it (otherwise the class rules decide). */
  users?: readonly string[];
  /** Gear: rarity (common when omitted). Legendary gear is the secret items, worn in the relic slot. */
  rarity?: Rarity;
  /** Weapons: which kind (who may hold it). */
  weapon?: WeaponType;
  /** Armour: which kind (who it suits). */
  armor?: ArmorType;
  /** Rare and above: a special property. */
  special?: ItemSpecial;
  /** Rare and above: a skill (or weapon move) that comes with it, free (never takes a spell slot). */
  skill?: string;
  /** The picture it uses (a weapon's design; data/weapons.ts), when it is not its own id. */
  art?: string;
  /** Staffs with a blade or spikes: the wielder's Attack is a real blow (not a bash). */
  edge?: 'blade' | 'spike';
  /** Legendary: what each of the wearer's levels above 1 adds (fractions add up; rounded down). */
  growth?: Partial<Stats>;
  /** Gear level: worn below it, the item gives only part of its bonus (GEAR_UNDERLEVEL_SHARE). */
  level?: number;
  text: string;
  /**
   * How the item is presented the first time it is received (engine/showcase.ts): 'story' and
   * 'legendary' get the full showcase, 'reward' a small card. Unset: no popup (shop goods, soup).
   */
  showcase?: ShowcaseTier;
  /** What the item can do, each line hidden ("???") until the story has explained it. */
  abilities?: readonly ItemAbility[];
}

export type ShowcaseTier = 'story' | 'legendary' | 'reward';

export interface ItemAbility {
  name: string;
  text: string;
  /** Known once this holds (always known when unset). */
  known?: Condition;
}

export interface MemberDef {
  id: string;
  name: string;
  /** Class and house, shown on the status page. */
  role: string;
  house: string;
  /** Portrait key (assets.config.ts PORTRAITS). */
  portrait: string;
  /** Walk-sheet look (assets.config.ts NPC_SPRITES), shown large on the Equip screen (default: the portrait key). */
  look?: string;
  /** In the party while this holds (always when omitted). */
  joins?: Condition;
  /** Which era they fight in: the present party, or the Echo (Patricio's). */
  era: 'present' | 'echo';
  /** A support member (Anissa) has no stats or gear; the menu shows her Spark and Calm instead. */
  support?: boolean;
  /** Fighters: their class (which weapons they may hold). */
  class?: MemberClass;
  /** Always-on traits, listed on the Equip screen. */
  passives?: readonly Passive[];
  /** Level 1 stats, and what each level adds. */
  base: Stats;
  growth: Stats;
  /** What they wear when the game starts. */
  start?: Partial<Record<Slot, string>>;
}

export interface ShopDef {
  id: string;
  name: string;
  /** City the shop is in (for prices later, and the journal). */
  city: string;
  stock: readonly string[];
}

/** A section of a city: one map, drawn as a box on the city map (grid units). */
export interface CitySection {
  map: string;
  name: string;
  /**
   * Outdoor sections: where the map's top-left tile sits on the city map (engine/cityMap.ts). Indoor
   * sections leave it out and show as a building at their door.
   */
  at?: { x: number; y: number };
}

export interface CityDef {
  id: string;
  name: string;
  house: string;
  sections: readonly CitySection[];
}

/** A place on the realm map (its shape, capital and label come from data/realmMap.ts). */
export interface RealmPlace {
  id: string;
  name: string;
  house: string;
  /** The city data, when the place has been built. */
  city?: string;
  /** Known to the player (on the map) while this holds (always when omitted). */
  known?: Condition;
}

export interface RpgContent {
  items: Readonly<Record<string, ItemDef>>;
  /** Which weapon kinds each class may hold. */
  classWeapons: Readonly<Record<MemberClass, readonly WeaponType[]>>;
  members: readonly MemberDef[];
  shops: Readonly<Record<string, ShopDef>>;
  cities: Readonly<Record<string, CityDef>>;
  realm: readonly RealmPlace[];
  /** Flags that count toward a pillar in a city (e.g. each lore book read there: +1 Influence). */
  pillarRules: readonly { pillar: Pillar; city: string; flags: readonly string[]; each: number }[];
  startingGold: number;
  bagLimit: number;
  /** XP the whole party shares: each flag set is worth `each` (story objectives, lore read, ...). */
  xpRules: readonly { flags: readonly string[]; each: number }[];
  /** Levelling: XP to reach level n is round(xpBase * (n - 1) ^ xpExponent), up to levelCap. */
  levels: { cap: number; xpBase: number; xpExponent: number; gearUnderlevelShare: number; bands: { trivial: number; hard: number; deadly: number } };
}

// ---- Gold, pillars, armies --------------------------------------------------------------------

export function gold(flags: FlagReader, rpg: RpgContent): number {
  const v = flags.get('gold');
  return typeof v === 'number' ? v : rpg.startingGold;
}

function setGold(flags: FlagStore, rpg: RpgContent, amount: number): void {
  flags.set('gold', Math.max(0, gold(flags, rpg) + amount));
}

export function pillarFlag(pillar: Pillar, city: string): string {
  return `pillar.${pillar}.${city}`;
}

function num(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}

/** A pillar earned in one city: its own flag plus whatever the rules derive (lore read there, ...). */
export function localPillar(flags: FlagReader, rpg: RpgContent, pillar: Pillar, city: string): number {
  let total = num(flags.get(pillarFlag(pillar, city)));
  for (const r of rpg.pillarRules) {
    if (r.pillar !== pillar || r.city !== city) continue;
    for (const f of r.flags) if (truthy(flags.get(f))) total += r.each;
  }
  return total;
}

/** A pillar across the realm: every city's local value added up. */
export function globalPillar(flags: FlagReader, rpg: RpgContent, pillar: Pillar, snapshotKeys: readonly string[]): number {
  const cities = new Set([...Object.keys(rpg.cities), ...rpg.pillarRules.map((r) => r.city)]);
  for (const k of snapshotKeys) {
    const prefix = `pillar.${pillar}.`;
    if (k.startsWith(prefix)) cities.add(k.slice(prefix.length));
  }
  let total = 0;
  for (const c of cities) total += localPillar(flags, rpg, pillar, c);
  return total;
}

/** Military might: every army pledged so far. */
export function armies(flags: FlagReader, snapshotKeys: readonly string[]): number {
  return snapshotKeys.filter((k) => k.startsWith('army.')).reduce((n, k) => n + num(flags.get(k)), 0);
}

function truthy(v: unknown): boolean {
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

// ---- Party and stats --------------------------------------------------------------------------

/** The members with the player now, in the given era. */
export function partyMembers(flags: FlagReader, rpg: RpgContent, era: 'present' | 'echo'): MemberDef[] {
  return rpg.members.filter((m) => m.era === era && (!m.joins || evaluate(m.joins, flags)));
}

// ---- Levels and XP ----------------------------------------------------------------------------

/** XP needed to reach a level (level 1 needs none). */
export function xpForLevel(rpg: RpgContent, lv: number): number {
  const { xpBase, xpExponent } = rpg.levels;
  return lv <= 1 ? 0 : Math.round(xpBase * (lv - 1) ** xpExponent);
}

/** XP the party shares, from the rules (each story flag, book, ... counted once). */
export function sharedXp(flags: FlagReader, rpg: RpgContent): number {
  let total = num(flags.get('xp.shared'));
  for (const r of rpg.xpRules) for (const f of r.flags) if (truthy(flags.get(f))) total += r.each;
  return total;
}

/** A member's XP: what the party shares plus what they earned alone. */
export function xp(flags: FlagReader, rpg: RpgContent, member: string): number {
  return sharedXp(flags, rpg) + num(flags.get(`xp.${member}`));
}

export function levelForXp(rpg: RpgContent, points: number): number {
  let lv = 1;
  while (lv < rpg.levels.cap && points >= xpForLevel(rpg, lv + 1)) lv++;
  return lv;
}

export function level(flags: FlagReader, rpg: RpgContent, member: string): number {
  return levelForXp(rpg, xp(flags, rpg, member));
}

/** The party's level for comparing with foes: the average of its fighters, rounded down. */
export function partyLevel(flags: FlagReader, rpg: RpgContent, era: 'present' | 'echo'): number {
  const fighters = partyMembers(flags, rpg, era).filter((m) => !m.support);
  if (fighters.length === 0) return 1;
  return Math.floor(fighters.reduce((n, m) => n + level(flags, rpg, m.id), 0) / fighters.length);
}

export type LevelBand = 'trivial' | 'even' | 'hard' | 'deadly';

/** How a foe's level compares with yours: grey (trivial), white (even), orange (hard), red (deadly). */
export function levelBand(rpg: RpgContent, yours: number, theirs: number): LevelBand {
  const d = theirs - yours;
  const b = rpg.levels.bands;
  if (d >= b.deadly) return 'deadly';
  if (d >= b.hard) return 'hard';
  if (d <= -b.trivial) return 'trivial';
  return 'even';
}

/** Add XP to the shared pool (side quest rewards, ...). */
export function addSharedXp(flags: FlagStore, amount: number): void {
  flags.set('xp.shared', num(flags.get('xp.shared')) + amount);
}

/** The item a member wears in a slot, or null. */
export function equipped(flags: FlagReader, member: MemberDef, slot: Slot): string | null {
  const v = flags.get(`equip.${member.id}.${slot}`);
  if (typeof v === 'string') return v || null;
  return member.start?.[slot] ?? null;
}

export function baseStats(flags: FlagReader, rpg: RpgContent, member: MemberDef): Stats {
  const lv = level(flags, rpg, member.id);
  const out = {} as Stats;
  for (const k of STAT_KEYS) out[k] = member.base[k] + member.growth[k] * (lv - 1);
  return out;
}

/** Whether a member is below an item's level (it is "too heavy": only part of its bonus counts). */
export function tooHeavy(flags: FlagReader, rpg: RpgContent, member: MemberDef, item: ItemDef): boolean {
  if (item.rarity === 'legendary') return false; // it grows with its wearer
  return (item.level ?? 1) > level(flags, rpg, member.id);
}

export function rarityOf(item: ItemDef): Rarity {
  return item.rarity ?? 'common';
}

/** The item's level as shown: a legendary's is its wearer's (or 1 in the bag), the rest are fixed. */
export function itemLevel(item: ItemDef, wearerLevel?: number): number {
  return item.rarity === 'legendary' ? Math.max(1, wearerLevel ?? 1) : (item.level ?? 1);
}

/** An item's stats at a level: its own, plus a legendary's growth for each level above 1. */
export function itemStatsAt(item: ItemDef, lv: number): Partial<Stats> {
  const out: Partial<Stats> = {};
  for (const k of STAT_KEYS) {
    const v = (item.stats?.[k] ?? 0) + Math.floor((item.growth?.[k] ?? 0) * Math.max(0, lv - 1));
    if (v) out[k] = v;
  }
  return out;
}

/** An item's bonus for this member: in full at or above its level, else GEAR_UNDERLEVEL_SHARE of it (rounded down). */
export function itemBonus(flags: FlagReader, rpg: RpgContent, member: MemberDef, item: ItemDef): Partial<Stats> {
  const heavy = tooHeavy(flags, rpg, member, item);
  const own = itemStatsAt(item, itemLevel(item, level(flags, rpg, member.id)));
  const out: Partial<Stats> = {};
  for (const k of STAT_KEYS) {
    const v = own[k];
    // Too heavy: only part of a bonus counts (a penalty, like heavy armour's speed, counts in full).
    if (v) out[k] = heavy && v > 0 ? Math.floor(v * rpg.levels.gearUnderlevelShare) : v;
  }
  return out;
}

/** Stats with every worn item's bonus. */
export function stats(flags: FlagReader, rpg: RpgContent, member: MemberDef): Stats {
  const out = baseStats(flags, rpg, member);
  for (const slot of SLOTS) {
    const id = equipped(flags, member, slot);
    const item = id ? rpg.items[id] : undefined;
    if (!item) continue;
    const bonus = itemBonus(flags, rpg, member, item);
    for (const k of STAT_KEYS) out[k] += bonus[k] ?? 0;
  }
  return out;
}

/**
 * Whether a member may wear an item: gear, not Anissa, and for weapons the right class (staffs for mages,
 * bows for archers, blades for warriors). Armour, charms and relics fit anyone. `users` narrows it further.
 */
export function canWear(rpg: RpgContent, item: ItemDef, member: MemberDef): boolean {
  if (item.kind !== 'gear' || !item.slot || member.support) return false;
  if (item.users && !item.users.includes(member.id)) return false;
  if (item.slot === 'weapon') return !!item.weapon && !!member.class && rpg.classWeapons[member.class].includes(item.weapon);
  return true;
}

const ARMOR_FOR: Readonly<Record<MemberClass, ArmorType>> = { mage: 'robe', archer: 'leather', warrior: 'heavy' };

/** Whether armour matches a member's class (robes for mages, leather for archers, heavy for warriors). */
export function suits(item: ItemDef, member: MemberDef): boolean {
  if (!item.armor || !member.class) return true;
  return ARMOR_FOR[member.class] === item.armor;
}

/** A member's passives the player knows about. */
export function knownPassives(flags: FlagReader, member: MemberDef): Passive[] {
  return (member.passives ?? []).filter((p) => evaluate(p.known, flags));
}

// ---- The bag ----------------------------------------------------------------------------------

export function itemCount(flags: FlagReader, id: string): number {
  const v = flags.get(`item.${id}`);
  if (typeof v === 'number') return Math.max(0, v);
  return v === true ? 1 : 0;
}

/** Everything in the bag, as [item, count] in content order (key items included). */
export function bagContents(flags: FlagReader, rpg: RpgContent): [ItemDef, number][] {
  return Object.values(rpg.items)
    .map((it) => [it, itemCount(flags, it.id)] as [ItemDef, number])
    .filter(([, n]) => n > 0);
}

/** Items that never take bag space: key items and relics (the secret items). */
export function takesNoSpace(item: ItemDef): boolean {
  return item.kind === 'key' || item.slot === 'relic';
}

/** Bag space used: every item but key items and relics (worn gear is not in the bag). */
export function bagUsed(flags: FlagReader, rpg: RpgContent): number {
  return bagContents(flags, rpg).reduce((n, [it, c]) => n + (takesNoSpace(it) ? 0 : c), 0);
}

export function bagFree(flags: FlagReader, rpg: RpgContent): number {
  return Math.max(0, rpg.bagLimit - bagUsed(flags, rpg));
}

/** Put items in the bag. Fails (changing nothing) when they do not fit. */
export function addItem(flags: FlagStore, rpg: RpgContent, id: string, n = 1): boolean {
  const item = rpg.items[id];
  if (!item || n < 1) return false;
  if (!takesNoSpace(item) && bagFree(flags, rpg) < n) return false;
  flags.set(`item.${id}`, item.kind === 'key' ? true : itemCount(flags, id) + n);
  return true;
}

export function removeItem(flags: FlagStore, id: string, n = 1): boolean {
  const have = itemCount(flags, id);
  if (have < n) return false;
  if (have === n) flags.clear(`item.${id}`);
  else flags.set(`item.${id}`, have - n);
  return true;
}

// ---- Equipment --------------------------------------------------------------------------------

export type EquipResult = 'ok' | 'cannot_wear' | 'not_in_bag' | 'bag_full';

/** Wear an item from the bag; what was worn in that slot goes back into the bag (a swap needs no space). */
export function equip(flags: FlagStore, rpg: RpgContent, member: MemberDef, id: string): EquipResult {
  const item = rpg.items[id];
  if (!item || !canWear(rpg, item, member)) return 'cannot_wear';
  if (itemCount(flags, id) < 1) return 'not_in_bag';
  const slot = item.slot!;
  const old = equipped(flags, member, slot);
  removeItem(flags, id);
  if (old) flags.set(`item.${old}`, itemCount(flags, old) + 1);
  flags.set(`equip.${member.id}.${slot}`, id);
  return 'ok';
}

/** Take off what is worn in a slot (it needs a free place in the bag). */
export function unequip(flags: FlagStore, rpg: RpgContent, member: MemberDef, slot: Slot): EquipResult {
  const old = equipped(flags, member, slot);
  if (!old) return 'ok';
  if (!addItem(flags, rpg, old)) return 'bag_full';
  flags.set(`equip.${member.id}.${slot}`, '');
  return 'ok';
}

// ---- Shops ------------------------------------------------------------------------------------

export type TradeResult = 'ok' | 'no_gold' | 'bag_full' | 'not_for_sale' | 'cannot_sell';

export function sellPrice(item: ItemDef): number {
  return Math.floor(item.price / 2);
}

export function buy(flags: FlagStore, rpg: RpgContent, shop: ShopDef, id: string): TradeResult {
  const item = rpg.items[id];
  if (!item || !shop.stock.includes(id)) return 'not_for_sale';
  if (gold(flags, rpg) < item.price) return 'no_gold';
  if (!addItem(flags, rpg, id)) return 'bag_full';
  setGold(flags, rpg, -item.price);
  return 'ok';
}

/** Sell one from the bag (not key items, not what is worn). */
export function sell(flags: FlagStore, rpg: RpgContent, id: string): TradeResult {
  const item = rpg.items[id];
  if (!item || item.kind === 'key' || item.price <= 0) return 'cannot_sell';
  if (!removeItem(flags, id)) return 'cannot_sell';
  setGold(flags, rpg, sellPrice(item));
  return 'ok';
}

// ---- Places -----------------------------------------------------------------------------------

export function visitedFlag(mapId: string): string {
  return `visited.${mapId}`;
}

/** The city a map belongs to, and its section there. */
export function cityOf(rpg: RpgContent, mapId: string): { city: CityDef; section: CitySection } | null {
  for (const city of Object.values(rpg.cities)) {
    const section = city.sections.find((s) => s.map === mapId);
    if (section) return { city, section };
  }
  return null;
}
