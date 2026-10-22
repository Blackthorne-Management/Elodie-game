// The level curve (tools/level-curve.ts; COMBAT.md 6; plan review 3.6): the scripted route, replayed headlessly, ends
// each chapter on its target level (src/data/chapterLevels.ts, within LEVEL_CURVE's slack), and so does the played
// line (the route's wild steps through the ambush process, seeds 1 to 200: the median, and the 90th percentile at
// most one over); a player who skips every side quest is at most LEVEL_CURVE.skipSideQuestsMaxUnder levels under.
// The levels pass (Claude's call, Oct 22): story steps pay by chapter (XP_PER_OBJECTIVE_BY_CHAPTER), ambushes pay by
// the party's level (AMBUSH_XP), and every chapter built so far is on target on both lines.

import { describe, expect, it } from 'vitest';
import { AMBUSH_XP, LEVEL_CURVE, XP_PER_OBJECTIVE_BY_CHAPTER } from '../src/config.ts';
import { battleDef } from '../src/data/battles.ts';
import { CHAPTER_LEVELS } from '../src/data/chapterLevels.ts';
import { RPG } from '../src/data/rpg.ts';
import { ambushXp, battleXp } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { xpForLevel } from '../src/engine/rpg.ts';
import { curveText, levelCurve } from '../tools/level-curve.ts';

describe('the level curve along the scripted route', () => {
  const report = levelCurve();
  console.log(curveText(report));
  const ch = (n: number) => report.chapters.find((c) => c.chapter === n)!;

  it('measures every chapter the route plays (Chapters 1 to 12: all of them), and lists the rest as unplayed', () => {
    expect(report.chapters.map((c) => c.chapter)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(report.unplayed).toEqual([]);
    expect(report.chapters.length + report.unplayed.length).toBe(CHAPTER_LEVELS.length);
    for (const c of report.chapters) expect(c.xp).toBeGreaterThan(c.xpNoSide);
    // XP only grows from one chapter to the next.
    for (let i = 1; i < report.chapters.length; i++) expect(report.chapters[i]!.xp).toBeGreaterThan(report.chapters[i - 1]!.xp);
  });

  it('every chapter lands on its target level on the route line (within LEVEL_CURVE slack)', () => {
    for (const c of report.chapters) expect(c.onTarget, `Chapter ${c.chapter}: level ${c.level}, target ${c.target.to}`).toBe(true);
  });

  it('every chapter lands on its target on the played line too: the median on target, the 90th percentile and the wanderer at most one over', () => {
    for (const c of report.chapters) {
      expect(c.played.onTarget, `Chapter ${c.chapter}: played median ${c.played.median}, target ${c.target.to}`).toBe(true);
      expect(c.played.p90, `Chapter ${c.chapter}: played p90`).toBeLessThanOrEqual(c.target.to + LEVEL_CURVE.slackOver);
      expect(c.played.wanderP90, `Chapter ${c.chapter}: wanderer p90`).toBeLessThanOrEqual(c.target.to + LEVEL_CURVE.slackOver);
      expect(c.played.medianXp).toBeGreaterThanOrEqual(c.xp - c.routeAmbushXp);
    }
  });

  it('the levels pass, as measured Oct 22: Chapter 1 ends at 4, Chapter 2 at 8, Chapter 3 at 11, Chapter 4 at 14, Chapter 5 at 15, Chapter 6 at 17, Chapter 7 at 19, Chapter 8 at 21, Chapter 9 at 24, Chapter 10 at 25, Chapter 11 at 28, Chapter 12 at 30', () => {
    expect(report.chapters.map((c) => c.level)).toEqual([4, 8, 11, 14, 15, 17, 19, 21, 24, 25, 28, 30]);
    // Chapter 1 was 6 (25 XP a step); Chapter 2 was 10 (its five required side quests, and 80 XP an ambush).
    expect(ch(1).xp).toBeLessThan(xpForLevel(RPG, 5));
    expect(ch(2).xp).toBeLessThan(xpForLevel(RPG, 9));
    // Chapter 6 starts at 15, the bottom of its band (15 to 17).
    expect(ch(5).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 15));
    expect(ch(5).xp).toBeLessThan(xpForLevel(RPG, 16));
  });

  it('Chapter 6 (Skarragol, 15 to 17) ends on 17 on the route and on the played line, and at 15 without side quests', () => {
    const six = ch(6);
    expect(six.level).toBe(17);
    expect(six.played.median).toBe(17);
    expect(six.played.p90).toBeLessThanOrEqual(18);
    expect(six.played.wanderP90).toBeLessThanOrEqual(18);
    expect(six.levelNoSide).toBe(15);
    // Kuroshi's band starts at 17: the party arrives at it, not past it.
    expect(six.xp).toBeLessThan(xpForLevel(RPG, 18));
    expect(six.played.medianXp).toBeLessThan(xpForLevel(RPG, 18));
  });

  it('Chapter 7 (Kuroshi, 17 to 19) ends on 19 on the route and on the played line, and at 17 without side quests', () => {
    const seven = ch(7);
    expect(seven.level).toBe(19);
    expect(seven.played.median).toBe(19);
    expect(seven.played.p90).toBeLessThanOrEqual(20);
    expect(seven.played.wanderP90).toBeLessThanOrEqual(20);
    // A player who skips the side quests (K-2, K-3, the debate's quest and their fights) stays within two levels.
    expect(seven.levelNoSide).toBe(17);
    expect(seven.target.to - seven.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // Jwaladesh's band starts at 19: the party arrives at it, not past it (20 needs 5,559).
    expect(seven.xp).toBeLessThan(xpForLevel(RPG, 20));
    expect(seven.played.medianXp).toBeLessThan(xpForLevel(RPG, 20));
    // Chapter 7 starts where Chapter 6 ended: 17, the bottom of its band.
    expect(ch(6).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 17));
  });

  it('Chapter 8 (Jwaladesh, 19 to 21) ends on 21 on the route and on the played line, and at 19 without side quests', () => {
    const eight = ch(8);
    expect(eight.level).toBe(21);
    expect(eight.played.median).toBe(21);
    expect(eight.played.p90).toBeLessThanOrEqual(22);
    expect(eight.played.wanderP90).toBeLessThanOrEqual(22);
    // A player who skips the side quests (J-2, J-3, the debate's quest and the salt road's fight) stays within two levels.
    expect(eight.levelNoSide).toBe(19);
    expect(eight.target.to - eight.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // Aldermoor's band starts at 21: the party arrives at it, not past it (22 needs 6,524).
    expect(eight.xp).toBeLessThan(xpForLevel(RPG, 22));
    expect(eight.played.medianXp).toBeLessThan(xpForLevel(RPG, 22));
    // Chapter 8 starts where Chapter 7 ended: 19, the bottom of its band.
    expect(ch(7).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 19));
    expect(ch(7).xp).toBeLessThan(xpForLevel(RPG, 20));
  });

  it('Chapter 9 (Aldermoor, 21 to 24) ends on 24 on the route and on the played line, and at 22 without side quests', () => {
    const nine = ch(9);
    expect(nine.level).toBe(24);
    expect(nine.played.median).toBe(24);
    expect(nine.played.p90).toBeLessThanOrEqual(25);
    expect(nine.played.wanderP90).toBeLessThanOrEqual(25);
    // A player who skips what side quests pay (the debate's quest, Al-2's and Al-3's rewards, the chapel's fight) stays
    // within two levels.
    expect(nine.levelNoSide).toBe(22);
    expect(nine.target.to - nine.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // Chapter 10's band starts at 24: the party arrives at it, not past it (25 needs 8,082).
    expect(nine.xp).toBeLessThan(xpForLevel(RPG, 25));
    expect(nine.played.medianXp).toBeLessThan(xpForLevel(RPG, 25));
    // Chapter 9 starts where Chapter 8 ended: 21, the bottom of its band.
    expect(ch(8).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 21));
  });

  it('Chapter 10 (the Muster, 24 to 25) ends on 25 on the route and on the played line, and at 23 without side quests', () => {
    const ten = ch(10);
    expect(ten.level).toBe(25);
    expect(ten.played.median).toBe(25);
    expect(ten.played.p90).toBeLessThanOrEqual(26);
    expect(ten.played.wanderP90).toBeLessThanOrEqual(26);
    // Z-6 and Z-3 are required by the Chancellor's condition, so their XP rides on the Journal's steps and the crew's fight
    // is the story's: the line without side quests (what earlier chapters' optional quests paid) stays within two levels.
    expect(ten.levelNoSide).toBe(23);
    expect(ten.target.to - ten.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // Chapter 11's band starts at 25: the party arrives at it, not past it (26 needs 8,623).
    expect(ten.xp).toBeLessThan(xpForLevel(RPG, 26));
    expect(ten.played.medianXp).toBeLessThan(xpForLevel(RPG, 26));
    // Chapter 10 starts where Chapter 9 ended: 24.
    expect(ch(9).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 24));
    // The Cane Road's return is walked on the route (Z-6 and Z-3), and its table pays by the party's level.
    expect(ten.wildSteps).toBeGreaterThan(40);
  });

  it('Chapter 11 (the War of the Harbor, 25 to 28) ends on 28 on the route and on the played line, and at 26 without side quests', () => {
    const eleven = ch(11);
    expect(eleven.level).toBe(28);
    expect(eleven.played.median).toBe(28);
    expect(eleven.played.p90).toBeLessThanOrEqual(29);
    expect(eleven.played.wanderP90).toBeLessThanOrEqual(29);
    // The story carries the chapter (58 a step and the named fights); the two side quests and the picket pay 40 each.
    expect(eleven.levelNoSide).toBe(26);
    expect(eleven.target.to - eleven.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // Chapter 12's band starts at 28: the party arrives at it, not past it (29 needs 10,338), on both lines.
    expect(eleven.xp).toBeLessThan(xpForLevel(RPG, 29));
    expect(eleven.played.medianXp).toBeLessThan(xpForLevel(RPG, 29));
    // Chapter 11 starts where Chapter 10 ended: 25. The Mountain Path and the gardens are walked four times at war.
    expect(ch(10).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 25));
    expect(eleven.wildSteps).toBeGreaterThan(200);
  });

  it('Chapter 12 (the Claim, 28 to 30) ends on 30, the cap, on the route and on the played line, and at 28 without side quests', () => {
    const twelve = ch(12);
    expect(twelve.level).toBe(30);
    expect(twelve.played.median).toBe(30);
    // The story carries the chapter (XP_PER_OBJECTIVE_BY_CHAPTER row 12, the Regent): its two required side quests pay
    // little (the Chapter 10 rule: what a player cannot skip rides on the Journal's steps), so the line without side quests
    // reaches the band's floor, 28, two under the cap.
    expect(twelve.levelNoSide).toBe(28);
    expect(twelve.target.to - twelve.levelNoSide).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
    // The Regent is met at 29 on the route (30 needs 10,936): the fight is sized for 30 and orange at 28.
    expect(ch(11).xp).toBeGreaterThanOrEqual(xpForLevel(RPG, 28));
    expect(twelve.xp - battleXp(new FlagStore({ 'party.anissa': true }), RPG, battleDef('claim_regent')!) - XP_PER_OBJECTIVE_BY_CHAPTER[11]!).toBeLessThan(xpForLevel(RPG, 30));
    expect(twelve.wildSteps).toBe(0);
  });

  it(`skipping every side quest leaves the party at most ${LEVEL_CURVE.skipSideQuestsMaxUnder} levels under the target`, () => {
    for (const c of report.chapters) {
      expect(c.underNoSide, `Chapter ${c.chapter}: ${c.levelNoSide} without side quests, target ${c.target.to}`).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
      expect(c.skipOk).toBe(true);
    }
  });
});

describe('the ambush rule (AMBUSH_XP: a share of the party\'s next level, by the foes and the level difference)', () => {
  it('pays as the Chapter 8 outline review worked it out', () => {
    expect(AMBUSH_XP.share).toBe(0.12);
    expect(ambushXp(RPG, 15, 15, 3)).toBe(48);
    expect(ambushXp(RPG, 20, 20, 3)).toBe(57);
    expect(ambushXp(RPG, 21, 20, 3)).toBe(44);
    expect(ambushXp(RPG, 23, 21, 2)).toBe(21);
  });

  it('tapers when the party is over the group, and pays more (to a cap) when it is under', () => {
    const at = (party: number) => ambushXp(RPG, party, 6, 2);
    expect(at(8)).toBeLessThan(at(6));
    expect(at(12)).toBeGreaterThan(0); // never nothing
    expect(ambushXp(RPG, 6, 9, 2) / ambushXp(RPG, 6, 6, 2)).toBeCloseTo(AMBUSH_XP.max, 1); // three over: 1.75, capped
    expect(ambushXp(RPG, 6, 6, 6)).toBe(ambushXp(RPG, 6, 6, AMBUSH_XP.maxFoes));
  });

  it('a won ambush pays by the party\'s level when it ends; a scripted fight pays its own', () => {
    const def = battleDef('encounter:mountain_path/crabs')!;
    expect(def.ambush).toEqual({ foes: 2 });
    const flags = new FlagStore({ 'party.anissa': true, 'xp.shared': xpForLevel(RPG, 6) });
    expect(battleXp(flags, RPG, def)).toBe(ambushXp(RPG, 6, def.level!, 2));
    flags.set('xp.shared', xpForLevel(RPG, 4));
    expect(battleXp(flags, RPG, def)).toBe(ambushXp(RPG, 4, def.level!, 2));
    expect(battleXp(flags, RPG, battleDef('thorne_blockade')!)).toBe(220);
  });
});
