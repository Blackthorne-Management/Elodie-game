// The economy check (the schedule's "balance XP and gold", Oct 28; COMBAT.md 6 and 16): replays the scripted route
// headlessly and sets four players side by side at each chapter's end (src/data/chapterLevels.ts):
//
//   main route     the scripted route as it is played (tools/level-curve.ts's route line): the level the chapter's
//                  fights are tuned for, and the gold it has earned (the route itself never buys anything);
//   no side quest  the same without any side quest (level-curve's line; at most LEVEL_CURVE.skipSideQuestsMaxUnder under);
//   completionist  the main route plus every side quest it skips (secret ones too) with its own fights, the stealth
//                  fail-safe fights (the player who is seen fights and still finishes the step), and the gold a story
//                  choice gives away on the route (the purse kept, the strongbox kept);
//   thorough       the completionist who also reads every lore book left on a shelf and mediates every debate the
//                  route only wins or hears (exploration, like level-curve's wanderer).
//
// The rules (the levels pass, COMBAT.md 6; Claude's calls on the measure, Oct 28): the completionist ends each chapter
// at most ECONOMY.completionistMaxOver level over the main route (and over the target), never past the cap; the
// thorough reader at most ECONOMY.thoroughMaxOver. Gold: buying each chapter's kit as it comes (and selling what it
// replaces for half), the main route never runs out; the completionist, buying the same, can never buy at once all the
// gear on sale so far at the chapter's tiers, for as long as the shops still sell a new tier (to the Muster).
//
// A chapter's kit (Claude's call, Oct 28; COMBAT.md 16), for the four who fight (BATTLE_ACTIVE, roster order): through
// Chapter 9, one armour piece a capital, the cheapest at the chapter's tier (no more than a tier under its start, no
// higher than its target: the shops stock the tier above too, shown at half bonus, and those are aspirational) for
// whichever of the four wears the oldest; from the Muster (ECONOMY.fullKitFrom), the tier-24 armour and weapons the late
// fights are checked in (muster.test.ts, war.test.ts, claim.test.ts), for each of the four.
//
// `npm run economy` prints the tables; tests/economy.test.ts asserts them.

import { fileURLToPath } from 'node:url';
import { BATTLE_ACTIVE, DEBATE_REWARDS, ECONOMY, STARTING_GOLD, XP_PER_BOOK } from '../src/config.ts';
import { BATTLES } from '../src/data/battles.ts';
import { BOOKS, loreFlag } from '../src/data/books.ts';
import { CHAPTER_LEVELS } from '../src/data/chapterLevels.ts';
import { DEBATES } from '../src/data/debates.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import type { BattleDef } from '../src/engine/battle.ts';
import { evaluate } from '../src/engine/conditions.ts';
import { debateFlag } from '../src/engine/debate.ts';
import type { FlagStore } from '../src/engine/flags.ts';
import { canWear, equipped, gold, levelForXp, partyMembers, sellPrice, suits, type ItemDef, type MemberDef } from '../src/engine/rpg.ts';
import { questClosed, rewardFlag, settleRewards } from '../src/engine/sideQuests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { levelCurve, type CurveReport } from './level-curve.ts';
import { newGameSim, readJson } from './sim-setup.ts';

/** The shops each chapter's party can buy from (its own capital's; a shop with no chapter fails the test). */
export const CHAPTER_SHOPS: Readonly<Record<number, readonly string[]>> = {
  1: ['zetwal_forge', 'zetwal_charms', 'zetwal_market', 'zetwal_bakery', 'zetwal_produce', 'zetwal_spices', 'zetwal_fish', 'zetwal_cloth'],
  2: ['xaragua_food', 'xaragua_carver', 'xaragua_bows'],
  3: ['ardencia_forge', 'ardencia_rings', 'ardencia_tavern', 'ardencia_camp'],
  4: ['aldoria_tea', 'aldoria_armourer', 'aldoria_amulets'],
  5: ['seat_market', 'seat_outfitter'],
  6: ['ordvik_food', 'ordvik_furrier', 'ordvik_horses', 'plunder_store'],
  7: ['kirinoura_tea', 'kirinoura_paper', 'kirinoura_armourer'],
  8: ['agnipur_milk', 'agnipur_beads', 'agnipur_swords'],
  9: ['kingsmere_pies', 'kingsmere_jeweller', 'kingsmere_outfitter'],
  10: ['zetwal_forge_muster', 'zetwal_charms', 'zetwal_market', 'zetwal_cloth'],
  11: ['xaragua_food_free', 'xaragua_carver_free', 'xaragua_bows_free'],
  12: ['seat_market', 'seat_outfitter'],
};

/**
 * The chapter a completionist finishes each side quest the route skips in (the earliest it can be, so the check is
 * the strictest; the test checks it against when the quest opens and closes on the route). A new optional quest must
 * be added here, or the test fails.
 */
export const OFF_ROUTE_QUESTS: Readonly<Record<string, number>> = {
  seventh_stone: 1,
  no_debt: 1,
  feast: 3,
  old_errand: 3,
  arrows: 3,
  saffron: 4,
  uncashed: 4,
  invoice: 4,
  ribbon: 12,
  salkhi: 6,
  race: 6,
  cairn: 6,
  not_a_spy: 7,
  letter_floor: 7,
  argue: 8,
  little_lamps: 8,
  sorry: 9,
  patient_hour: 9,
  tea: 9,
};

/**
 * Story fights the route does not fight. `extra`: a completionist can have it on top of the route (a stealth's
 * fail-safe: the player who is seen fights it, and still finishes the step), with its chapter; `alternative`: it
 * stands instead of a fight the route fights, or on a branch the route does not take (counted once, by the route).
 */
export const UNFOUGHT: Readonly<Record<string, { extra: number } | 'alternative'>> = {
  camp_lookouts: { extra: 6 },
  stacks_cutpurses: { extra: 7 },
  quay_watch: { extra: 8 },
  ordu_bout: 'alternative',
  harbor_flank_skarragol: 'alternative',
  harbor_flank_kuroshi: 'alternative',
  harbor_flank_jwaladesh: 'alternative',
  harbor_flank_al_doria: 'alternative',
  pier_rael: 'alternative',
  claim_azzy: 'alternative',
};

/** Story choices that pay gold the route gives away (its flag set on the route): a gold-minded player keeps it. */
export const GOLD_CHOICES: readonly { chapter: number; givenAway: string; gold: number; what: string }[] = [
  { chapter: 6, givenAway: 'choice.crown_purse_given', gold: 300, what: "the Crown's purse kept" },
  { chapter: 8, givenAway: 'choice.advances_given', gold: 400, what: "the Seth's strongbox kept" },
];

/** The chapter each city's lore books are first on a shelf (a book with `available` waits for it, on the route). */
const BOOK_CHAPTER: Readonly<Record<string, number>> = {
  zetwal: 1,
  xaragua: 2,
  ardencia: 3,
  aldoria: 4,
  seat: 5,
  skarragol: 6,
  kuroshi: 7,
  jwaladesh: 8,
  aldermoor: 9,
};

export interface KitPiece {
  member: string;
  item: string;
  price: number;
  /** What the piece it replaces sells for. */
  sold: number;
}

export interface ChapterEconomy {
  chapter: number;
  place: string;
  target: { from: number; to: number };
  main: { xp: number; level: number; income: number; purse: number };
  noSide: { level: number };
  completionist: { xp: number; level: number; income: number; purse: number; extraXp: number; extraGold: number };
  /** The completionist who also reads every book left on a shelf and mediates every debate (exploration, like the wanderer). */
  thorough: { xp: number; level: number };
  /** What the chapter's kit costs, piece by piece (bought by both lines, in order). */
  kit: KitPiece[];
  kitCost: number;
  /** Every gear piece the chapter's shops sell, one of each. */
  stockCost: number;
}

export interface EconomyReport {
  chapters: ChapterEconomy[];
  curve: CurveReport;
  /** What the completionist adds, source by source (for the console and the test). */
  extras: { chapter: number; source: string; xp: number; gold: number; thorough?: boolean }[];
  /** Side quests the route skips that OFF_ROUTE_QUESTS does not place; fights the route skips that UNFOUGHT does not class. */
  unplaced: { quests: string[]; fights: string[]; shops: string[]; books: string[] };
  /** For each side quest the route skips: the chapter it first shows (available) and the chapter it is closed by, on the route. */
  windows: Record<string, { opens?: number; closes?: number }>;
}

const isGear = (i: ItemDef | undefined): i is ItemDef => !!i && i.kind === 'gear' && (i.slot === 'weapon' || i.slot === 'armor');

/** The cheapest piece for `slot` the shops sell `m`, between the two levels and over what they wear there. */
function cheapestUpgrade(m: MemberDef, worn: Record<string, number>, stock: readonly ItemDef[], slot: 'weapon' | 'armor', minLevel: number, maxLevel: number): ItemDef | null {
  let best: ItemDef | null = null;
  for (const item of stock) {
    if (!isGear(item) || item.slot !== slot || !canWear(RPG, item, m) || !suits(item, m)) continue;
    const lv = item.level ?? 1;
    if (lv < minLevel || lv > maxLevel || lv <= (worn[`${m.id}.${slot}`] ?? 0)) continue;
    if (!best || item.price < best.price) best = item;
  }
  return best;
}

/** Every gear piece (weapon, armour, charm) on sale in the shops of Chapters 1 to `chapter`, between the levels, one of each. */
function tierStock(chapter: number, minLevel: number, maxLevel: number): number {
  const ids = new Set(Object.entries(CHAPTER_SHOPS).filter(([c]) => Number(c) <= chapter).flatMap(([, shops]) => shops.flatMap((s) => RPG.shops[s]?.stock ?? [])));
  return [...ids].map((id) => RPG.items[id]!).filter((i) => i.kind === 'gear' && (i.level ?? 1) >= minLevel && (i.level ?? 1) <= maxLevel).reduce((n, i) => n + i.price, 0);
}

export function economy(routeFile = 'routes/zetwal-act1.json'): EconomyReport {
  const curve = levelCurve(routeFile);
  const route = parseRoute(readJson<string[]>(routeFile));
  const sim = newGameSim();
  const flags: FlagStore = sim.logic.state.flags;
  const marks = new Map(CHAPTER_LEVELS.filter((t) => t.mark).map((t) => [t.mark!, t]));
  let income = 0;
  let last = gold(flags, RPG);
  const track = () => {
    settleRewards(flags, RPG, SIDE_QUESTS);
    const g = gold(flags, RPG);
    if (g > last) income += g - last;
    last = g;
  };
  let chapter = 1;
  const windows: Record<string, { opens?: number; closes?: number }> = {};
  const atMark: { chapter: number; income: number; party: MemberDef[]; booksOpen: Set<string>; debatesHeard: Set<string> }[] = [];
  for (const item of route) {
    if (item.kind === 'mark' && marks.has(item.name)) {
      track();
      const t = marks.get(item.name)!;
      for (const q of SIDE_QUESTS) if (questClosed(q, flags)) (windows[q.id] ??= {}).closes ??= t.chapter;
      atMark.push({
        chapter: t.chapter,
        income,
        party: partyMembers(flags, RPG, 'present').filter((m) => !m.support),
        booksOpen: new Set(BOOKS.filter((b) => !b.available || evaluate(b.available, flags)).map((b) => b.id)),
        debatesHeard: new Set(DEBATES.filter((d) => flags.isSet(debateFlag(d.id, 'listened'))).map((d) => d.id)),
      });
      chapter = t.chapter + 1;
    }
    for (const cmd of sim.expand(item)) sim.press(cmd);
    track();
    for (const q of SIDE_QUESTS) if (q.available && evaluate(q.available, flags)) (windows[q.id] ??= {}).opens ??= chapter;
  }

  // What the completionist adds, by chapter.
  const extras: EconomyReport['extras'] = [];
  const unplaced: EconomyReport['unplaced'] = { quests: [], fights: [], shops: [], books: [] };
  const fought = new Set(sim.battles);
  for (const q of SIDE_QUESTS) {
    if (flags.isSet(rewardFlag(q))) continue;
    const c = OFF_ROUTE_QUESTS[q.id];
    if (c === undefined) {
      unplaced.quests.push(q.id);
      continue;
    }
    const steps = RPG.xpRules.reduce((n, r) => n + r.flags.filter((f) => f.startsWith(`side.${q.id}.`)).length * r.each, 0);
    extras.push({ chapter: c, source: `side quest ${q.id}`, xp: (q.reward.xp ?? 0) + steps, gold: q.reward.gold ?? 0 });
    for (const b of Object.values(BATTLES) as BattleDef[]) {
      if (b.sideQuest === q.id && !fought.has(b.id)) extras.push({ chapter: c, source: `fight ${b.id}`, xp: b.rewards.xp, gold: b.rewards.gold });
    }
  }
  for (const b of Object.values(BATTLES) as BattleDef[]) {
    if (b.ambush || b.meantToLose || fought.has(b.id) || b.id.startsWith('encounter:')) continue;
    if (b.sideQuest && OFF_ROUTE_QUESTS[b.sideQuest] !== undefined) continue;
    const u = UNFOUGHT[b.id];
    if (u === undefined) unplaced.fights.push(b.id);
    else if (u !== 'alternative') extras.push({ chapter: u.extra, source: `fight ${b.id}`, xp: b.rewards.xp, gold: b.rewards.gold });
  }
  for (const b of BOOKS) {
    if (flags.isSet(loreFlag(b.id))) continue;
    const city = BOOK_CHAPTER[b.id.split('_')[0]!];
    if (city === undefined) {
      unplaced.books.push(b.id);
      continue;
    }
    const open = atMark.find((m) => m.chapter >= city && m.booksOpen.has(b.id))?.chapter ?? city;
    extras.push({ chapter: open, source: `book ${b.id}`, xp: XP_PER_BOOK, gold: 0, thorough: true });
  }
  const bestDebate = Math.max(...Object.values(DEBATE_REWARDS).map((r) => r.xp ?? 0));
  for (const d of DEBATES) {
    const got = Math.max(0, ...(['won', 'mediated', 'provoked'] as const).filter((o) => flags.isSet(debateFlag(d.id, o))).map((o) => DEBATE_REWARDS[o].xp ?? 0));
    if (got >= bestDebate) continue;
    const c = atMark.find((m) => m.debatesHeard.has(d.id))?.chapter ?? CHAPTER_LEVELS.at(-1)!.chapter;
    extras.push({ chapter: c, source: `debate ${d.id} mediated`, xp: bestDebate - got, gold: 0, thorough: true });
  }
  for (const g of GOLD_CHOICES) if (flags.isSet(g.givenAway)) extras.push({ chapter: g.chapter, source: g.what, xp: 0, gold: g.gold });

  // The kit, chapter by chapter, and the purses that buy it.
  const placed = new Set(Object.values(CHAPTER_SHOPS).flat());
  unplaced.shops = Object.keys(RPG.shops).filter((s) => !placed.has(s));
  // What each fighter wears (the item and its level), as the kit replaces it.
  const wornId: Record<string, string | null> = {};
  const worn: Record<string, number> = {};
  let kitSpent = 0;
  const chapters: ChapterEconomy[] = [];
  for (const m of atMark) {
    const t = CHAPTER_LEVELS.find((c) => c.chapter === m.chapter)!;
    const c = curve.chapters.find((x) => x.chapter === m.chapter)!;
    for (const member of m.party) {
      for (const slot of ['weapon', 'armor'] as const) {
        const key = `${member.id}.${slot}`;
        if (key in wornId) continue;
        const id = equipped(flags, member, slot);
        wornId[key] = id;
        worn[key] = id ? (RPG.items[id]?.level ?? 1) : 0;
      }
    }
    const stock = [...new Set((CHAPTER_SHOPS[m.chapter] ?? []).flatMap((s) => RPG.shops[s]?.stock ?? []))].map((id) => RPG.items[id]!).filter(isGear);
    const kit: KitPiece[] = [];
    const four = m.party.slice(0, BATTLE_ACTIVE);
    // A piece bought is worn at once, and the piece it replaces is sold back (half its price).
    const buy = (member: MemberDef, item: ItemDef) => {
      const key = `${member.id}.${item.slot}`;
      const old = wornId[key] ? RPG.items[wornId[key]!] : undefined;
      kit.push({ member: member.id, item: item.id, price: item.price, sold: old?.kind === 'gear' ? sellPrice(old) : 0 });
      wornId[key] = item.id;
      worn[key] = item.level ?? 1;
    };
    if (m.chapter >= ECONOMY.fullKitFrom) {
      // The late fights' gear: every one of the four, armour and weapon, at the chapter's own levels.
      for (const member of four) {
        for (const slot of ['armor', 'weapon'] as const) {
          const item = cheapestUpgrade(member, worn, stock, slot, t.from, t.to);
          if (item) buy(member, item);
        }
      }
    } else {
      // One piece a capital: armour at the chapter's tier for whoever of the four wears the oldest.
      const options = four
        .map((member) => ({ member, item: cheapestUpgrade(member, worn, stock, 'armor', t.from - ECONOMY.tierWidth, t.to) }))
        .filter((o): o is { member: MemberDef; item: ItemDef } => !!o.item);
      options.sort((a, b) => (worn[`${a.member.id}.armor`] ?? 0) - (worn[`${b.member.id}.armor`] ?? 0));
      if (options[0]) buy(options[0].member, options[0].item);
    }
    const kitCost = kit.reduce((n, k) => n + k.price - k.sold, 0);
    kitSpent += kitCost;
    const sofar = extras.filter((e) => e.chapter <= m.chapter);
    const extraXp = sofar.filter((e) => !e.thorough).reduce((n, e) => n + e.xp, 0);
    const extraGold = sofar.reduce((n, e) => n + e.gold, 0);
    const compXp = c.xp + extraXp;
    const thoroughXp = compXp + sofar.filter((e) => e.thorough).reduce((n, e) => n + e.xp, 0);
    chapters.push({
      chapter: m.chapter,
      place: t.place,
      target: { from: t.from, to: t.to },
      main: { xp: c.xp, level: c.level, income: m.income, purse: STARTING_GOLD + m.income - kitSpent },
      noSide: { level: c.levelNoSide },
      completionist: {
        xp: compXp,
        level: levelForXp(RPG, compXp),
        income: m.income + extraGold,
        purse: STARTING_GOLD + m.income + extraGold - kitSpent,
        extraXp,
        extraGold,
      },
      thorough: { xp: thoroughXp, level: levelForXp(RPG, thoroughXp) },
      kit,
      kitCost,
      stockCost: tierStock(m.chapter, t.from - ECONOMY.tierWidth, t.to + ECONOMY.tierWidth),
    });
  }
  return { chapters, curve, extras, unplaced, windows };
}

/** The report as tables, for the console and the design doc. */
export function economyText(r: EconomyReport): string {
  const lines = [
    `Economy: the main route, without side quests, the completionist (at most ${ECONOMY.completionistMaxOver} over the main route) and the`,
    `thorough reader (also every book and the best debate outcome; at most ${ECONOMY.thoroughMaxOver} over). Purses after buying each kit.`,
    '',
    'Ch  Target  Main lvl (XP)  No side  Completionist lvl (XP)  Thorough  Main income  Main purse  Compl. income  Compl. purse  Kit   Stock',
  ];
  for (const c of r.chapters) {
    lines.push(
      [
        String(c.chapter).padEnd(3),
        `${c.target.from}-${c.target.to}`.padEnd(7),
        `${c.main.level} (${c.main.xp})`.padEnd(14),
        String(c.noSide.level).padEnd(8),
        `${c.completionist.level} (${c.completionist.xp})`.padEnd(23),
        String(c.thorough.level).padEnd(9),
        String(c.main.income).padEnd(12),
        String(c.main.purse).padEnd(11),
        String(c.completionist.income).padEnd(14),
        String(c.completionist.purse).padEnd(13),
        String(c.kitCost).padEnd(5),
        String(c.stockCost),
      ].join(' '),
    );
  }
  lines.push('', 'Kits:');
  for (const c of r.chapters) lines.push(`  ${c.chapter}: ${c.kit.map((k) => `${k.member} ${k.item} (${k.price}${k.sold ? `, sells the old for ${k.sold}` : ''})`).join(', ') || 'nothing new at its tier'}`);
  lines.push('', 'What the completionist adds (* the thorough reader only):');
  for (const c of r.chapters) {
    const here = r.extras.filter((e) => e.chapter === c.chapter && (e.xp > 0 || e.gold > 0));
    if (here.length) lines.push(`  ${c.chapter}: ${here.map((e) => `${e.thorough ? '*' : ''}${e.source} (${e.xp} XP${e.gold ? `, ${e.gold} gold` : ''})`).join('; ')}`);
  }
  return lines.join('\n');
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) console.log(economyText(economy()));
