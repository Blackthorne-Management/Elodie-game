// The item showcase: the popup when an important item is received for the first time (the Sun
// Locket, the secret items, side quest gear). Which items get one, in what order, and which of their
// abilities the player knows yet. Pure TypeScript over the flag store; the scene draws it.
//
// Flags used:
//   shown.item.<id>   the item's showcase has been seen (so a reload never repeats it)

import { evaluate } from './conditions.ts';
import type { FlagReader, FlagStore } from './flags.ts';
import { STAT_KEYS, canWear, equipped, itemCount, partyMembers, type ItemDef, type MemberDef, type RpgContent, type ShowcaseTier, type StatKey } from './rpg.ts';

export const UNKNOWN_ABILITY = '???';

export function shownFlag(itemId: string): string {
  return `shown.item.${itemId}`;
}

/** Items held with a showcase not yet seen, in content order. */
export function pendingShowcases(flags: FlagReader, rpg: RpgContent): ItemDef[] {
  return Object.values(rpg.items).filter((it) => it.showcase && itemCount(flags, it.id) > 0 && !flags.get(shownFlag(it.id)));
}

export function markShown(flags: FlagStore, itemId: string): void {
  flags.set(shownFlag(itemId), true);
}

export interface AbilityView {
  name: string;
  /** The ability's text, or UNKNOWN_ABILITY while the story has not explained it. */
  text: string;
  known: boolean;
}

export interface ShowcaseView {
  id: string;
  name: string;
  tier: ShowcaseTier;
  /** The banner over the name. */
  banner: string;
  text: string;
  /** Bonuses while worn, as "DEF +1" etc. (gear only). */
  stats: string[];
  abilities: AbilityView[];
  /** The gear slot it is worn in ("charm"), for the card's "how to wear it" line; none for other items. */
  slot?: string;
  /** Who could wear it now in an empty slot: the card offers to put it on them (wearOffer). */
  wearer?: { id: string; name: string };
}

/**
 * Who a quest reward could go straight onto (the Nov 1 playtest's 17: the Sun-stitched charm sat in the bag, the Charm
 * slot empty): the first member with the party now, in party order, who can wear it and has nothing in that slot.
 * Nobody when everyone who could already wears something there (the menu's Equip is the place to swap).
 */
export function wearOffer(flags: FlagReader, rpg: RpgContent, item: ItemDef): MemberDef | null {
  if (item.kind !== 'gear' || !item.slot || itemCount(flags, item.id) < 1) return null;
  return partyMembers(flags, rpg, 'present').find((m) => canWear(rpg, item, m) && !equipped(flags, m, item.slot!)) ?? null;
}

export const TIER_BANNERS: Readonly<Record<ShowcaseTier, string>> = {
  legendary: 'Legendary item',
  story: 'Key item',
  reward: 'Quest reward',
};

const STAT_LABELS: Readonly<Record<StatKey, string>> = { hp: 'HP', sp: 'SP', atk: 'ATK', def: 'DEF', mag: 'MAG', spd: 'SPD' };

export function abilityViews(flags: FlagReader, item: ItemDef): AbilityView[] {
  return (item.abilities ?? []).map((a) => {
    const known = evaluate(a.known, flags);
    return { name: a.name, text: known ? a.text : UNKNOWN_ABILITY, known };
  });
}

/** What the showcase shows for an item (any item: the menu can replay one without a tier as a key item). */
export function showcaseView(flags: FlagReader, item: ItemDef, rpg?: RpgContent): ShowcaseView {
  const tier = item.showcase ?? 'story';
  const wearer = rpg && tier === 'reward' ? wearOffer(flags, rpg, item) : null;
  return {
    id: item.id,
    name: item.name,
    tier,
    banner: TIER_BANNERS[tier],
    text: item.text,
    stats: STAT_KEYS.filter((k) => item.stats?.[k]).map((k) => `${STAT_LABELS[k]} +${item.stats![k]}`),
    abilities: abilityViews(flags, item),
    ...(item.slot ? { slot: item.slot } : {}),
    ...(wearer ? { wearer: { id: wearer.id, name: wearer.name } } : {}),
  };
}

/** True for items the menu's Items page can show again in full (story and legendary items). */
export function canReplay(item: ItemDef): boolean {
  return item.showcase === 'story' || item.showcase === 'legendary';
}
