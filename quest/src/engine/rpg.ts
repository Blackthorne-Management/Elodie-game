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
//   level.<member>               a member's level (unset: 1)
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

export const SLOTS = ['weapon', 'armor', 'charm'] as const;
export type Slot = (typeof SLOTS)[number];

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
  /** Members who can wear it (all who have the slot when omitted). */
  users?: readonly string[];
  text: string;
}

export interface MemberDef {
  id: string;
  name: string;
  /** Class and house, shown on the status page. */
  role: string;
  house: string;
  /** Portrait key (assets.config.ts PORTRAITS). */
  portrait: string;
  /** In the party while this holds (always when omitted). */
  joins?: Condition;
  /** Which era they fight in: the present party, or the Echo (Patricio's). */
  era: 'present' | 'echo';
  /** A support member (Anissa) has no stats or gear; the menu shows her Spark and Calm instead. */
  support?: boolean;
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
  box: { x: number; y: number; w: number; h: number };
}

export interface CityDef {
  id: string;
  name: string;
  house: string;
  sections: readonly CitySection[];
  /** Pairs of map ids joined by a door (drawn as lines). */
  links: readonly (readonly [string, string])[];
}

/** A place on the realm map (0..100 both ways). */
export interface RealmPlace {
  id: string;
  name: string;
  house: string;
  x: number;
  y: number;
  /** The city data, when the place has been built. */
  city?: string;
  /** Known to the player (on the map) while this holds (always when omitted). */
  known?: Condition;
}

export interface RpgContent {
  items: Readonly<Record<string, ItemDef>>;
  members: readonly MemberDef[];
  shops: Readonly<Record<string, ShopDef>>;
  cities: Readonly<Record<string, CityDef>>;
  realm: readonly RealmPlace[];
  /** Flags that count toward a pillar in a city (e.g. each lore book read there: +1 Influence). */
  pillarRules: readonly { pillar: Pillar; city: string; flags: readonly string[]; each: number }[];
  startingGold: number;
  bagLimit: number;
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

export function level(flags: FlagReader, member: string): number {
  const v = flags.get(`level.${member}`);
  return typeof v === 'number' && v >= 1 ? v : 1;
}

/** The item a member wears in a slot, or null. */
export function equipped(flags: FlagReader, member: MemberDef, slot: Slot): string | null {
  const v = flags.get(`equip.${member.id}.${slot}`);
  if (typeof v === 'string') return v || null;
  return member.start?.[slot] ?? null;
}

export function baseStats(flags: FlagReader, member: MemberDef): Stats {
  const lv = level(flags, member.id);
  const out = {} as Stats;
  for (const k of STAT_KEYS) out[k] = member.base[k] + member.growth[k] * (lv - 1);
  return out;
}

/** Stats with every worn item's bonus. */
export function stats(flags: FlagReader, rpg: RpgContent, member: MemberDef): Stats {
  const out = baseStats(flags, member);
  for (const slot of SLOTS) {
    const id = equipped(flags, member, slot);
    const bonus = id ? rpg.items[id]?.stats : undefined;
    if (bonus) for (const k of STAT_KEYS) out[k] += bonus[k] ?? 0;
  }
  return out;
}

export function canWear(item: ItemDef, member: MemberDef): boolean {
  return item.kind === 'gear' && !!item.slot && !member.support && (!item.users || item.users.includes(member.id));
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

/** Bag space used: every item but key items (worn gear is not in the bag). */
export function bagUsed(flags: FlagReader, rpg: RpgContent): number {
  return bagContents(flags, rpg).reduce((n, [it, c]) => n + (it.kind === 'key' ? 0 : c), 0);
}

export function bagFree(flags: FlagReader, rpg: RpgContent): number {
  return Math.max(0, rpg.bagLimit - bagUsed(flags, rpg));
}

/** Put items in the bag. Fails (changing nothing) when they do not fit. */
export function addItem(flags: FlagStore, rpg: RpgContent, id: string, n = 1): boolean {
  const item = rpg.items[id];
  if (!item || n < 1) return false;
  if (item.kind !== 'key' && bagFree(flags, rpg) < n) return false;
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
  if (!item || !canWear(item, member)) return 'cannot_wear';
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
