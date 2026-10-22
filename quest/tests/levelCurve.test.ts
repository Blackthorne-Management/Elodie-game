// The level curve (tools/level-curve.ts; COMBAT.md 6; plan review 3.6): the scripted route, replayed headlessly, ends
// each chapter on its target level (src/data/chapterLevels.ts, within LEVEL_CURVE's slack), and so does the played
// line (the route's wild steps through the ambush process, seeds 1 to 200: the median, and the 90th percentile at
// most one over); a player who skips every side quest is at most LEVEL_CURVE.skipSideQuestsMaxUnder levels under.
// The levels pass (Claude's call, Oct 22): story steps pay by chapter (XP_PER_OBJECTIVE_BY_CHAPTER), ambushes pay by
// the party's level (AMBUSH_XP), and every chapter built so far is on target on both lines.

import { describe, expect, it } from 'vitest';
import { AMBUSH_XP, LEVEL_CURVE } from '../src/config.ts';
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

  it('measures every chapter the route plays (Chapters 1 to 6 so far), and lists the rest as unplayed', () => {
    expect(report.chapters.map((c) => c.chapter)).toEqual([1, 2, 3, 4, 5, 6]);
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

  it('the levels pass, as measured Oct 22: Chapter 1 ends at 4, Chapter 2 at 8, Chapter 3 at 11, Chapter 4 at 14, Chapter 5 at 15, Chapter 6 at 17', () => {
    expect(report.chapters.map((c) => c.level)).toEqual([4, 8, 11, 14, 15, 17]);
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
