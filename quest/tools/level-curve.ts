// The level curve (plan review 3.6 and 4.3; COMBAT.md 6): replays the scripted route headlessly, paying what the
// field pays as it goes (fights won, side-quest rewards, debates), and reports where the party ends each chapter,
// with every side quest and without any, against the targets in src/data/chapterLevels.ts. Re-run with every
// chapter: `node --experimental-strip-types tools/level-curve.ts` (tests/levelCurve.test.ts asserts it).
//
// Counted: story steps, books read, puzzles, debates, the route's fights and side-quest rewards. Not counted:
// random ambushes (the route walks past them), so a real player lands a little higher than this.

import { fileURLToPath } from 'node:url';
import { LEVEL_CURVE } from '../src/config.ts';
import { battleDef } from '../src/data/battles.ts';
import { CHAPTER_LEVELS, type ChapterLevels } from '../src/data/chapterLevels.ts';
import { DEBATES } from '../src/data/debates.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { settleDebates } from '../src/engine/debate.ts';
import { addSharedXp, levelForXp, pillarFlag, xp } from '../src/engine/rpg.ts';
import { rewardFlag, settleRewards } from '../src/engine/sideQuests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { newGameSim, readJson } from './sim-setup.ts';

export interface ChapterCurve {
  chapter: number;
  place: string;
  target: { from: number; to: number };
  /** The party's XP and level at the chapter's end, as played (every side quest the route does). */
  xp: number;
  level: number;
  /** Of that XP, what side quests gave (their rewards, their Journal steps and their own fights). */
  sideXp: number;
  /** Without any side quest. */
  xpNoSide: number;
  levelNoSide: number;
  /** Where the XP came from (fights, side quests, and everything else: story, books, puzzles, debates). */
  sources: { battles: number; side: number; other: number };
  /** Levels under the target (negative: over), as played and without side quests. */
  under: number;
  underNoSide: number;
  /** As played: within LEVEL_CURVE's slack of the target; and without side quests, at most skipSideQuestsMaxUnder under. */
  onTarget: boolean;
  skipOk: boolean;
}

export interface CurveReport {
  route: string;
  chapters: ChapterCurve[];
  /** Chapters with a target but no route yet. */
  unplayed: ChapterLevels[];
  /** Side quests the route never finishes, with the XP each would add (reward and Journal step). */
  offRoute: { id: string; xp: number }[];
}

/** Plays `route` from a new game and measures the party at each chapter's end marker. */
export function levelCurve(routeFile = 'routes/zetwal-act1.json', targets: readonly ChapterLevels[] = CHAPTER_LEVELS): CurveReport {
  const route = parseRoute(readJson<string[]>(routeFile));
  const sim = newGameSim();
  const flags = sim.logic.state.flags;
  let battleXp = 0;
  let sideBattleXp = 0;
  let seen = 0;
  const addPillar = (p: 'influence' | 'fear', city: string, n: number) => {
    const f = pillarFlag(p, city);
    const v = flags.get(f);
    flags.set(f, (typeof v === 'number' ? v : 0) + n);
  };
  /** What the field scene pays every frame: finished side quests and debates. */
  const settle = () => {
    settleRewards(flags, RPG, SIDE_QUESTS);
    settleDebates(flags, DEBATES, addPillar, (n) => addSharedXp(flags, n));
    for (; seen < sim.battles.length; seen++) {
      const def = battleDef(sim.battles[seen]!);
      const got = def?.rewards.xp ?? 0;
      battleXp += got;
      if (def?.sideQuest) sideBattleXp += got;
    }
  };
  const byMark = new Map(targets.filter((t) => t.mark).map((t) => [t.mark!, t]));
  const chapters: ChapterCurve[] = [];
  for (const item of route) {
    if (item.kind === 'mark') {
      const t = byMark.get(item.name);
      if (t) {
        settle();
        const total = xp(flags, RPG, 'gianna');
        const sideRewards = SIDE_QUESTS.filter((q) => flags.isSet(rewardFlag(q))).reduce((n, q) => n + (q.reward.xp ?? 0), 0);
        // A finished side quest can also count as a Journal step (XP_RULES), and that goes when it is skipped.
        const sideSteps = RPG.xpRules.reduce((n, r) => n + r.flags.filter((x) => x.startsWith('side.') && flags.isSet(x)).length * r.each, 0);
        const side = sideRewards + sideSteps + sideBattleXp;
        const level = levelForXp(RPG, total);
        const levelNoSide = levelForXp(RPG, total - side);
        const under = t.to - level;
        const underNoSide = t.to - levelNoSide;
        chapters.push({
          chapter: t.chapter,
          place: t.place,
          target: { from: t.from, to: t.to },
          xp: total,
          level,
          sideXp: side,
          xpNoSide: total - side,
          levelNoSide,
          sources: { battles: battleXp - sideBattleXp, side, other: total - battleXp - sideRewards - sideSteps },
          under,
          underNoSide,
          onTarget: under <= LEVEL_CURVE.slackUnder && -under <= LEVEL_CURVE.slackOver,
          skipOk: underNoSide <= LEVEL_CURVE.skipSideQuestsMaxUnder,
        });
      }
    }
    sim.run([item]);
    settle();
  }
  const played = new Set(chapters.map((c) => c.chapter));
  const offRoute = SIDE_QUESTS.filter((q) => !flags.isSet(rewardFlag(q))).map((q) => ({
    id: q.id,
    xp: (q.reward.xp ?? 0) + RPG.xpRules.reduce((n, r) => n + r.flags.filter((x) => x.startsWith(`side.${q.id}.`)).length * r.each, 0),
  }));
  return { route: routeFile, chapters, unplayed: targets.filter((t) => !played.has(t.chapter)), offRoute };
}

/** The report as a table, for the console and for the owner. */
export function curveText(r: CurveReport): string {
  const lines = [`Level curve (${r.route}; random ambushes not counted)`, ''];
  lines.push('Ch  Place                 Target  End level (XP)   No side quests (XP)  Side XP  Fights  Other  Verdict');
  for (const c of r.chapters) {
    const verdict = [c.onTarget ? 'on target' : c.under > 0 ? `${c.under} under` : `${-c.under} over`, c.skipOk ? 'skip ok' : `skip ${c.underNoSide} under`].join(', ');
    lines.push(
      [
        String(c.chapter).padEnd(3),
        c.place.padEnd(21),
        `${c.target.from}-${c.target.to}`.padEnd(7),
        `${c.level} (${c.xp})`.padEnd(16),
        `${c.levelNoSide} (${c.xpNoSide})`.padEnd(20),
        String(c.sideXp).padEnd(8),
        String(c.sources.battles).padEnd(7),
        String(c.sources.other).padEnd(6),
        verdict,
      ].join(' '),
    );
  }
  const last = r.chapters.at(-1);
  if (r.offRoute.length && last) {
    const extra = r.offRoute.reduce((n, q) => n + q.xp, 0);
    lines.push('', `Side quests the route skips: ${r.offRoute.map((q) => `${q.id} (+${q.xp} XP)`).join(', ')}; with them Chapter ${last.chapter} would end at level ${levelForXp(RPG, last.xp + extra)}.`);
  }
  if (r.unplayed.length) lines.push('', `Not on a route yet: ${r.unplayed.map((t) => `${t.chapter} (${t.from}-${t.to})`).join(', ')}`);
  return lines.join('\n');
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) console.log(curveText(levelCurve()));
