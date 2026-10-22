// The ally ledger and the Muster (Chapter 10; the outline 7.0 with its second review's 3.5 and 3.11). Each allied house
// has a price (config.ts ALLY_PRICES) and the road chapters wrote what was paid into the city pillars; the Muster reads
// them, shows each house's share in the Journal from the landing on, and at the step into the night names the Crown's
// buyer (the least share, ties by the house's `tie`), opens the exposed route when the buyer is paid enough and the
// evidence is in hand, and pledges every army. Pure TypeScript over the flag store, unit tested (tests/ally.test.ts).
//
// Flags read:
//   story.muster_begun                the Muster has begun (the shares are shown and written from then)
//   debate.<feud>.mediated|joined     a feud at the Muster seated, or argued
//   muster.gift.<house>               gifts of gold laid at a camp (a count)
//   muster.resolve                    a scene asks for the Muster to be resolved (the inspection's last line)
//   muster.turned                     the buyer was exposed and the house turned (the night)
//   clue.buyers_mark, side.muskets.done   the evidence the exposed route needs
// Flags written:
//   muster.share.<house>              the share in whole percent (conditions can read it), muster.short.<house> the
//                                     whole points still owed (the gift choices read it)
//   muster.betrayer, muster.betrayer.<house>, muster.exposed_possible, muster.resolved, army.<group>
//   concord (the one-off bonuses in MUSTER.concord, paid once each: concord.paid.<flag>)

import { ALLY_PRICES, CONCORD_START, MUSTER, type AllyPrice } from '../config.ts';
import type { FlagReader, FlagStore } from './flags.ts';
import { globalPillar, localPillar, PILLARS, type Pillar, type RpgContent } from './rpg.ts';

export interface AllyShare {
  house: string;
  name: string;
  /** What the Muster counts as paid, in the price's currency (one decimal). */
  points: number;
  price: number;
  currency: Pillar;
  /** points / price. */
  share: number;
}

function num(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}

function truthy(v: unknown): boolean {
  return v !== undefined && v !== false && v !== 0 && v !== '';
}

/** A city's pillar with its lore books counted at most MUSTER.bookCap (the books are the pillar rules on `lore.` flags). */
export function cappedPillar(flags: FlagReader, rpg: RpgContent, pillar: Pillar, city: string): number {
  let books = 0;
  let each = 0;
  for (const r of rpg.pillarRules) {
    if (r.pillar !== pillar || r.city !== city) continue;
    for (const f of r.flags) {
      if (!f.startsWith('lore.') || !truthy(flags.get(f))) continue;
      books++;
      each = r.each;
    }
  }
  return localPillar(flags, rpg, pillar, city) - books * each + Math.min(MUSTER.bookCap, books) * each;
}

/** What one house is paid now (ALLY_PRICES). */
export function allyShare(flags: FlagReader, rpg: RpgContent, house: string, keys: readonly string[] = []): AllyShare {
  const def = ALLY_PRICES[house];
  if (!def) throw new Error(`No ally price for ${house}`);
  let points = 0;
  if (def.realm) points = globalPillar(flags, rpg, def.currency, keys);
  else if (def.city) {
    points = cappedPillar(flags, rpg, def.currency, def.city);
    for (const p of PILLARS) if (p !== def.currency) points += MUSTER.otherShare * cappedPillar(flags, rpg, p, def.city);
  }
  if (def.mediationPays && truthy(flags.get(`debate.${def.mediationPays}.mediated`))) points += MUSTER.mediationBonus;
  if (def.gifts) points += num(flags.get(`muster.gift.${house}`));
  points = Math.round(points * 10) / 10;
  return { house, name: def.name, points, price: def.price, currency: def.currency, share: points / def.price };
}

/** Every house's share, in ALLY_PRICES order. */
export function allyLedger(flags: FlagReader, rpg: RpgContent, keys: readonly string[] = []): AllyShare[] {
  return Object.keys(ALLY_PRICES).map((h) => allyShare(flags, rpg, h, keys));
}

/** The Crown's buyer: the least share among the pool houses, ties by `tie` (Dorini first). */
export function leastPaid(flags: FlagReader, rpg: RpgContent, keys: readonly string[] = []): AllyShare {
  const pool = Object.entries(ALLY_PRICES).filter(([, d]) => d.pool);
  const shares = pool.map(([h, d]) => ({ s: allyShare(flags, rpg, h, keys), tie: d.tie ?? 99 }));
  shares.sort((a, b) => a.s.share - b.s.share || a.tie - b.tie);
  return shares[0]!.s;
}

/** The soldiers a house brings for its share (before the night: a buyer's are settled by the night's outcome). */
export function armyFor(flags: FlagReader, def: AllyPrice, share: number): number {
  const paid = def.army * Math.min(1, share);
  const over = def.army * MUSTER.overpayPerPoint * Math.max(0, (share - 1) * def.price);
  const feud = def.feud && truthy(flags.get(`debate.${def.feud}.joined`)) && !truthy(flags.get(`debate.${def.feud}.mediated`)) ? MUSTER.joinedShare : 1;
  return Math.round((paid + over) * feud);
}

/** A house's share is written as whole percent (conditions compare numbers), and the whole points still owed. */
function writeShares(flags: FlagStore, rpg: RpgContent, keys: readonly string[]): void {
  for (const s of allyLedger(flags, rpg, keys)) {
    flags.set(`muster.share.${s.house}`, Math.round(s.share * 100));
    flags.set(`muster.short.${s.house}`, Math.max(0, Math.ceil(s.price - s.points)));
  }
}

/**
 * The step into the night (the outline beat 8, the second review's 3.11): name the buyer, open the exposed route when
 * it is paid at least MUSTER.exposeAt and the buyer's list and the smugglers' ledger are in hand, and pledge the armies
 * (the buyer's at 0 until the night decides: turned, its army at MUSTER.turnedShare; sailed, none).
 */
export function resolveMuster(flags: FlagStore, rpg: RpgContent, keys: readonly string[] = []): AllyShare {
  const buyer = leastPaid(flags, rpg, keys);
  flags.set('muster.betrayer', buyer.house);
  flags.set(`muster.betrayer.${buyer.house}`, true);
  const evidence = truthy(flags.get('clue.buyers_mark')) && truthy(flags.get('side.muskets.done'));
  if (buyer.share >= MUSTER.exposeAt && evidence) flags.set('muster.exposed_possible', true);
  for (const s of allyLedger(flags, rpg, keys)) {
    const def = ALLY_PRICES[s.house]!;
    const soldiers = armyFor(flags, def, s.share);
    if (s.house === buyer.house) {
      flags.set(`army.${s.house}`, 0);
      flags.set('muster.turned_army', Math.round(soldiers * MUSTER.turnedShare));
    } else flags.set(`army.${s.house}`, soldiers);
  }
  flags.set('army.zetwal', MUSTER.levy);
  flags.set('muster.resolved', true);
  return buyer;
}

/**
 * What the Muster does after every conversation (engine/game.ts calls GameContent.afterDialogue): from the landing until
 * the night, the shares are written; the inspection's `muster.resolve` resolves it once; a turned house brings its
 * three quarters; the chapter's one-off Concord bonuses are paid once each.
 */
export function musterTick(flags: FlagStore, rpg: RpgContent): void {
  const keys = Object.keys(flags.snapshot());
  for (const [flag, n] of Object.entries(MUSTER.concord)) {
    if (!truthy(flags.get(flag)) || truthy(flags.get(`concord.paid.${flag}`))) continue;
    flags.set(`concord.paid.${flag}`, true);
    const c = flags.get('concord');
    flags.set('concord', Math.max(0, Math.min(100, (typeof c === 'number' ? c : CONCORD_START) + n)));
  }
  if (!truthy(flags.get('story.muster_begun'))) return;
  if (!truthy(flags.get('muster.resolved'))) {
    writeShares(flags, rpg, keys);
    if (truthy(flags.get('muster.resolve'))) resolveMuster(flags, rpg, keys);
  }
  const buyer = flags.get('muster.betrayer');
  if (truthy(flags.get('muster.turned')) && !truthy(flags.get('muster.turned_paid')) && typeof buyer === 'string') {
    flags.set(`army.${buyer}`, num(flags.get('muster.turned_army')));
    flags.set('muster.turned_paid', true);
  }
}

/** The Journal's lines for the Muster: each house, what is paid of its price, and once pledged, its soldiers. */
export function musterJournal(flags: FlagStore, rpg: RpgContent): string[] {
  const keys = Object.keys(flags.snapshot());
  const names: Record<Pillar, string> = { influence: 'Influence', wealth: 'Wealth', fear: 'Fear' };
  return allyLedger(flags, rpg, keys).map((s) => {
    const soldiers = flags.get(`army.${s.house}`);
    const tail = truthy(flags.get('muster.resolved')) ? ` Soldiers: ${num(soldiers)}.` : '';
    return `${s.name}: ${s.points} of ${names[s.currency]} ${s.price}.${tail}`;
  });
}

/** Every flag the Muster writes from code (musterTick and resolveMuster), for the content checks. */
export function musterFlagsWritten(): string[] {
  const houses = Object.keys(ALLY_PRICES);
  return [
    'muster.betrayer',
    'muster.exposed_possible',
    'muster.resolved',
    'muster.turned_army',
    'muster.turned_paid',
    'army.zetwal',
    'concord',
    ...houses.flatMap((h) => [`muster.share.${h}`, `muster.short.${h}`, `army.${h}`]),
    ...Object.entries(ALLY_PRICES).filter(([, d]) => d.pool).map(([h]) => `muster.betrayer.${h}`),
    ...Object.keys(MUSTER.concord).map((f) => `concord.paid.${f}`),
  ];
}
