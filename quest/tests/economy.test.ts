// The economy check (tools/economy.ts; COMBAT.md 16, "Balancing XP and gold", Claude's calls, Oct 28): per chapter, the
// main route against a player who does every side quest (secret ones too, with their fights and the stealth fail-safe
// fights) and one who also reads every book and mediates every debate, and the gold each has against the chapter's kit
// and the shops' stock. The rule (the levels pass): the completionist ends each chapter at most one level over the main
// route, and the main route is on the level the chapter's fights are tuned for; the main route can pay for each kit as
// it comes; the completionist can never buy the whole of the gear on sale at once while there is a new tier to sell.

import { describe, expect, it } from 'vitest';
import { BATTLE_ACTIVE, ECONOMY, LEVEL_CURVE, LEVELS } from '../src/config.ts';
import { CHAPTER_LEVELS } from '../src/data/chapterLevels.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { CHAPTER_SHOPS, OFF_ROUTE_QUESTS, UNFOUGHT, economy, economyText } from '../tools/economy.ts';

describe('the economy along the scripted route', () => {
  const report = economy();
  console.log(economyText(report));
  const ch = (n: number) => report.chapters.find((c) => c.chapter === n)!;

  it('measures every chapter, and places every shop, optional quest, unfought fight and book it meets', () => {
    expect(report.chapters.map((c) => c.chapter)).toEqual(CHAPTER_LEVELS.map((c) => c.chapter));
    // A new shop needs a chapter in CHAPTER_SHOPS; a new optional quest a chapter in OFF_ROUTE_QUESTS; a fight the route
    // never fights a class in UNFOUGHT; a book a city the check knows.
    expect(report.unplaced).toEqual({ quests: [], fights: [], shops: [], books: [] });
    for (const shops of Object.values(CHAPTER_SHOPS)) for (const s of shops) expect(RPG.shops[s], s).toBeDefined();
    for (const id of Object.keys(OFF_ROUTE_QUESTS)) expect(SIDE_QUESTS.some((q) => q.id === id), id).toBe(true);
    expect(Object.keys(UNFOUGHT).length).toBeGreaterThan(0);
  });

  it('places each optional quest in a chapter it can be done in: not before it shows, not after it closes', () => {
    for (const [id, chapter] of Object.entries(OFF_ROUTE_QUESTS)) {
      const w = report.windows[id] ?? {};
      if (w.opens !== undefined) expect(chapter, `${id} opens in ${w.opens}`).toBeGreaterThanOrEqual(w.opens);
      if (w.closes !== undefined) expect(chapter, `${id} closes in ${w.closes}`).toBeLessThanOrEqual(w.closes);
    }
  });

  it('the main route ends each chapter on the level its fights are tuned for (the level curve\'s target, within its slack)', () => {
    for (const c of report.chapters) {
      expect(c.target.to - c.main.level, `Chapter ${c.chapter}`).toBeLessThanOrEqual(LEVEL_CURVE.slackUnder);
      expect(c.main.level - c.target.to, `Chapter ${c.chapter}`).toBeLessThanOrEqual(LEVEL_CURVE.slackOver);
    }
  });

  it(`a player who does every side quest ends each chapter at most ${ECONOMY.completionistMaxOver} level over the main route (and over the target), never past the cap`, () => {
    for (const c of report.chapters) {
      expect(c.completionist.level - c.main.level, `Chapter ${c.chapter}: ${c.completionist.level} against ${c.main.level}`).toBeLessThanOrEqual(ECONOMY.completionistMaxOver);
      expect(c.completionist.level - c.target.to, `Chapter ${c.chapter}`).toBeLessThanOrEqual(LEVEL_CURVE.slackOver);
      expect(c.completionist.level).toBeLessThanOrEqual(LEVELS.cap);
      expect(c.completionist.xp).toBeGreaterThanOrEqual(c.main.xp);
    }
  });

  it(`one who also reads every book and mediates every debate ends at most ${ECONOMY.thoroughMaxOver} over the main route`, () => {
    for (const c of report.chapters) {
      expect(c.thorough.level - c.main.level, `Chapter ${c.chapter}: ${c.thorough.level} against ${c.main.level}`).toBeLessThanOrEqual(ECONOMY.thoroughMaxOver);
      expect(c.thorough.xp).toBeGreaterThanOrEqual(c.completionist.xp);
    }
  });

  it('as measured Oct 28: the main route, the completionist and the thorough reader, level by level', () => {
    expect(report.chapters.map((c) => c.main.level)).toEqual([4, 8, 11, 14, 15, 17, 19, 21, 24, 25, 28, 30]);
    expect(report.chapters.map((c) => c.completionist.level)).toEqual([4, 9, 11, 14, 15, 18, 20, 22, 25, 26, 29, 30]);
    expect(report.chapters.map((c) => c.thorough.level)).toEqual([5, 10, 12, 15, 16, 19, 21, 23, 26, 27, 30, 30]);
  });

  it('the main route can pay for every chapter\'s kit as it comes (its purse never runs out)', () => {
    for (const c of report.chapters) expect(c.main.purse, `Chapter ${c.chapter}: kit ${c.kitCost}`).toBeGreaterThanOrEqual(0);
    // Chapter 10 is the tightest: the tier-24 kit for the four, after an armour piece in every capital before it.
    const tightest = report.chapters.reduce((a, b) => (b.main.purse < a.main.purse ? b : a));
    expect(tightest.chapter).toBe(10);
  });

  it('a kit is an armour piece a capital at its tier, and at the Muster the tier-24 gear the late fights are checked in', () => {
    for (const c of report.chapters.filter((x) => x.chapter < ECONOMY.fullKitFrom)) {
      expect(c.kit.length, `Chapter ${c.chapter}`).toBeLessThanOrEqual(1);
      for (const k of c.kit) {
        const item = RPG.items[k.item]!;
        expect(item.slot).toBe('armor');
        expect(item.level ?? 1).toBeLessThanOrEqual(c.target.to);
      }
    }
    // By the Muster's end each of the four who fight wears tier-24 armour, and its warriors a tier-24 blade (muster.test.ts,
    // war.test.ts and claim.test.ts check the late fights in that gear).
    const bought = new Map<string, string>();
    for (const c of report.chapters.filter((x) => x.chapter <= ECONOMY.fullKitFrom)) for (const k of c.kit) bought.set(`${k.member}.${RPG.items[k.item]!.slot}`, k.item);
    const four = RPG.members.filter((m) => m.era === 'present' && !m.support && ['gianna', 'yari', 'azzy', 'samira'].includes(m.id));
    expect(four).toHaveLength(BATTLE_ACTIVE);
    for (const m of four) {
      expect(RPG.items[bought.get(`${m.id}.armor`)!]!.level, m.id).toBeGreaterThanOrEqual(24);
      if (m.class === 'warrior') expect(RPG.items[bought.get(`${m.id}.weapon`)!]!.level, m.id).toBeGreaterThanOrEqual(24);
    }
    expect(ch(ECONOMY.fullKitFrom).kit.length).toBeGreaterThanOrEqual(BATTLE_ACTIVE);
  });

  it('while the shops still sell a new tier (to the Muster), the completionist can never buy all the gear at its tier at once', () => {
    for (const c of report.chapters.filter((x) => x.chapter <= ECONOMY.fullKitFrom)) {
      expect(c.completionist.purse, `Chapter ${c.chapter}: stock ${c.stockCost}`).toBeLessThan(c.stockCost);
      expect(c.completionist.purse).toBeGreaterThanOrEqual(c.main.purse);
    }
  });

  it('Z-6 pays the design\'s 600 gold (it was built at 400 and left the main route 106 short of the Muster\'s kit)', () => {
    expect(SIDE_QUESTS.find((q) => q.id === 'muskets')!.reward.gold).toBe(600);
    expect(ch(10).main.purse).toBeGreaterThanOrEqual(0);
    expect(ch(10).main.purse).toBeLessThan(200);
  });
});
