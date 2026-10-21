// The level curve (tools/level-curve.ts; COMBAT.md 6; plan review 3.6): the scripted route, replayed headlessly, ends
// each chapter near its target level (src/data/chapterLevels.ts), and a player who skips every side quest is at
// most LEVEL_CURVE.skipSideQuestsMaxUnder levels under it. The numbers are read from the data, so a change to
// rewards (Chapter 2's are being retuned) only moves the report.

import { describe, expect, it } from 'vitest';
import { LEVEL_CURVE } from '../src/config.ts';
import { CHAPTER_LEVELS } from '../src/data/chapterLevels.ts';
import { curveText, levelCurve } from '../tools/level-curve.ts';

/**
 * Chapters known to miss their target, with why, so the suite stays green while the report says so plainly. When
 * a chapter comes back on target, its entry must go (the last test fails until it does).
 *
 * Chapter 1 ends about three levels over its target of 3: every Journal step pays XP_PER_OBJECTIVE (25), where
 * COMBAT.md 6 has 10 a step in Chapter 1 (20 + 5 x chapter after). At 10 a step it would end at 4. Reported to the
 * owner (Oct 21); not retuned here because the boar and the Chapter 2 starts are balanced on today's numbers.
 */
const KNOWN_OFF_TARGET: Readonly<Record<number, string>> = {
  1: 'over: flat 25 XP per Journal step (COMBAT.md 6 says 10 in Chapter 1)',
};

describe('the level curve along the scripted route', () => {
  const report = levelCurve();
  console.log(curveText(report));

  it('measures every chapter the route plays (Chapters 1 to 3 so far), and lists the rest as unplayed', () => {
    expect(report.chapters.map((c) => c.chapter)).toEqual([1, 2, 3]);
    expect(report.chapters.length + report.unplayed.length).toBe(CHAPTER_LEVELS.length);
    for (const c of report.chapters) expect(c.xp).toBeGreaterThan(c.xpNoSide);
    // XP only grows from one chapter to the next.
    for (let i = 1; i < report.chapters.length; i++) expect(report.chapters[i]!.xp).toBeGreaterThan(report.chapters[i - 1]!.xp);
  });

  it('Chapter 3 (Ardencia) leaves the party at level 11, the outline\'s target, with every side quest on the route', () => {
    const c3 = report.chapters.find((c) => c.chapter === 3)!;
    expect(c3.level).toBe(11);
    expect(c3.levelNoSide).toBeGreaterThanOrEqual(9);
  });

  it('each chapter lands on its target level (within LEVEL_CURVE slack), except the ones known and reported', () => {
    for (const c of report.chapters) {
      if (KNOWN_OFF_TARGET[c.chapter]) continue;
      expect(c.onTarget, `Chapter ${c.chapter}: level ${c.level}, target ${c.target.to}`).toBe(true);
    }
  });

  it(`skipping every side quest leaves the party at most ${LEVEL_CURVE.skipSideQuestsMaxUnder} levels under the target`, () => {
    for (const c of report.chapters) {
      expect(c.underNoSide, `Chapter ${c.chapter}: ${c.levelNoSide} without side quests, target ${c.target.to}`).toBeLessThanOrEqual(LEVEL_CURVE.skipSideQuestsMaxUnder);
      expect(c.skipOk).toBe(true);
    }
  });

  it('the chapters known to be off target are still off (remove an entry once it is fixed)', () => {
    for (const ch of Object.keys(KNOWN_OFF_TARGET).map(Number)) {
      const c = report.chapters.find((x) => x.chapter === ch);
      expect(c, `Chapter ${ch} is not on the route`).toBeDefined();
      expect(c!.onTarget, `Chapter ${ch} is on target now: take it out of KNOWN_OFF_TARGET`).toBe(false);
    }
  });
});
