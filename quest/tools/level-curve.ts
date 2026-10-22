// The level curve (plan review 3.6 and 4.3; COMBAT.md 6): replays the scripted route headlessly, paying what the
// field pays as it goes (fights won, side-quest rewards, debates), and reports where the party ends each chapter,
// with every side quest and without any, against the targets in src/data/chapterLevels.ts. Re-run with every
// chapter: `node --experimental-strip-types tools/level-curve.ts` (tests/levelCurve.test.ts asserts it).
//
// Counted: story steps, books read, puzzles, debates, the route's fights and side-quest rewards: the route line.
// The played line (the levels pass, Oct 22; Chapter 8 outline review 3.6): the route's wild steps (the tiles it walks
// in an ambush zone, in order, with each zone's table) are replayed through the ambush process (ENCOUNTER_GRACE_STEPS,
// ENCOUNTER_CHANCE_PER_STEP, the table's weights) for seeds 1 to PLAYED_SEEDS, each ambush won and paid by AMBUSH_XP
// at the running party level, in place of the ambushes the route itself met. It reports the median and the 90th
// percentile at each chapter's end, and a "wanderer" (the route plus WANDER_STEPS more wild steps per chapter, in the
// chapter's own ambush zones: exploring for books and chests).

import { fileURLToPath } from 'node:url';
import { ENCOUNTER_CHANCE_PER_STEP, ENCOUNTER_GRACE_STEPS, LEVEL_CURVE } from '../src/config.ts';
import { battleDef } from '../src/data/battles.ts';
import { CONTENT } from '../src/data/content.ts';
import { CHAPTER_LEVELS, type ChapterLevels } from '../src/data/chapterLevels.ts';
import { DEBATES } from '../src/data/debates.ts';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { ambushXp, battleXp } from '../src/engine/battle.ts';
import { settleDebates } from '../src/engine/debate.ts';
import { pickGroup } from '../src/engine/game.ts';
import { Rng } from '../src/engine/rng.ts';
import { addSharedXp, levelForXp, pillarFlag, xp } from '../src/engine/rpg.ts';
import { rewardFlag, settleRewards } from '../src/engine/sideQuests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { newGameSim, readJson } from './sim-setup.ts';

/** Seeds the played line replays (1 to this). */
export const PLAYED_SEEDS = 200;
/** The wanderer's extra wild steps per chapter. */
export const WANDER_STEPS = 150;

/** The played line at a chapter's end, over the seeds. */
export interface PlayedLevels {
  /** Median and 90th-percentile XP and level, the route as walked. */
  medianXp: number;
  median: number;
  p90: number;
  /** Ambushes met in the chapter, on average (the route as walked). */
  ambushes: number;
  /** The wanderer's 90th-percentile level. */
  wanderP90: number;
  /** The median within LEVEL_CURVE's slack of the target. */
  onTarget: boolean;
}

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
  /** Wild steps the route walks in this chapter, and the XP its own ambushes paid. */
  wildSteps: number;
  routeAmbushXp: number;
  played: PlayedLevels;
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
  let fightXp = 0;
  let sideBattleXp = 0;
  /** What the route's own ambushes paid (the played line takes it out and pays its own). */
  let routeAmbushXp = 0;
  const paid: number[] = [];
  const winBattle = sim.onBattle!;
  // What each fight pays, worked out as settleBattle does at that moment (an ambush, at the party's level then).
  sim.onBattle = (id) => {
    const def = battleDef(id)!;
    const got = def.meantToLose ? 0 : battleXp(flags, RPG, def);
    paid.push(got);
    if (def.ambush) routeAmbushXp += got;
    return winBattle(id);
  };
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
      const got = paid[seen] ?? 0;
      fightXp += got;
      if (def?.sideQuest) sideBattleXp += got;
    }
  };
  const total = () => xp(flags, RPG, 'gianna');
  // The wild steps, in order: a step in a zone (its table, and the route's XP then without its own ambushes), a
  // map change (the grace count starts again, engine/game.ts enterMap), a chapter's end.
  type Wild = { kind: 'step'; table: string; base: number } | { kind: 'reset' } | { kind: 'mark'; chapter: number; base: number };
  const wild: Wild[] = [];
  let where = `${sim.logic.state.player.mapId}`;
  const byMark = new Map(targets.filter((t) => t.mark).map((t) => [t.mark!, t]));
  const chapters: ChapterCurve[] = [];
  let wildSteps = 0;
  let ambushAtLastMark = 0;
  for (const item of route) {
    if (item.kind === 'mark') {
      const t = byMark.get(item.name);
      if (t) {
        settle();
        const total = xp(flags, RPG, 'gianna');
        wild.push({ kind: 'mark', chapter: t.chapter, base: total - routeAmbushXp });
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
          sources: { battles: fightXp - sideBattleXp, side, other: total - fightXp - sideRewards - sideSteps },
          under,
          underNoSide,
          onTarget: under <= LEVEL_CURVE.slackUnder && -under <= LEVEL_CURVE.slackOver,
          skipOk: underNoSide <= LEVEL_CURVE.skipSideQuestsMaxUnder,
          wildSteps,
          routeAmbushXp: routeAmbushXp - ambushAtLastMark,
          played: { medianXp: 0, median: 0, p90: 0, ambushes: 0, wanderP90: 0, onTarget: false },
        });
        wildSteps = 0;
        ambushAtLastMark = routeAmbushXp;
      }
    }
    // Press by press (as Sim.run does), noting every step taken in an ambush zone.
    for (const cmd of sim.expand(item)) {
      const before = sim.logic.state.player;
      const from = `${before.mapId}|${before.pos.x},${before.pos.y}`;
      sim.press(cmd);
      const p = sim.logic.state.player;
      if (p.mapId !== where.split('|')[0]) wild.push({ kind: 'reset' });
      where = `${p.mapId}|${p.pos.x},${p.pos.y}`;
      if (where === from || sim.logic.mode !== 'field') continue;
      const zone = sim.logic.encounterZoneAt(p.pos);
      const table = zone && CONTENT.encounters?.[zone.table];
      if (zone && table && table.groups.length > 0) {
        wild.push({ kind: 'step', table: zone.table, base: total() - routeAmbushXp });
        wildSteps++;
      }
    }
    settle();
  }
  playedLine(chapters, wild, targets);
  const played = new Set(chapters.map((c) => c.chapter));
  const offRoute = SIDE_QUESTS.filter((q) => !flags.isSet(rewardFlag(q))).map((q) => ({
    id: q.id,
    xp: (q.reward.xp ?? 0) + RPG.xpRules.reduce((n, r) => n + r.flags.filter((x) => x.startsWith(`side.${q.id}.`)).length * r.each, 0),
  }));
  return { route: routeFile, chapters, unplayed: targets.filter((t) => !played.has(t.chapter)), offRoute };
}

/** The ambush process over the route's wild steps, for one seed: the extra XP at each chapter's end. */
function replayAmbushes(
  events: readonly ({ kind: 'step'; table: string; base: number } | { kind: 'reset' } | { kind: 'mark'; chapter: number; base: number })[],
  seed: number,
  wanderSteps: number,
): Map<number, { xp: number; ambushes: number }> {
  const rng = new Rng(seed);
  const out = new Map<number, { xp: number; ambushes: number }>();
  let count = 0;
  let extra = 0;
  let ambushes = 0;
  /** The chapter's own zones, for the wanderer. */
  let tables: string[] = [];
  const step = (table: string, base: number) => {
    count++;
    if (count <= ENCOUNTER_GRACE_STEPS || rng.next() >= ENCOUNTER_CHANCE_PER_STEP) return;
    count = 0;
    const group = pickGroup(CONTENT.encounters![table]!, rng);
    if (!group.enemies?.length) return;
    extra += ambushXp(RPG, levelForXp(RPG, base + extra), group.level, group.enemies.length);
    ambushes++;
  };
  for (const e of events) {
    if (e.kind === 'reset') count = 0;
    else if (e.kind === 'step') {
      step(e.table, e.base);
      tables.push(e.table);
    } else {
      // The wanderer walks the chapter's zones some more before its end.
      if (wanderSteps > 0 && tables.length > 0) {
        count = 0;
        for (let i = 0; i < wanderSteps; i++) step(tables[i % tables.length]!, e.base);
      }
      out.set(e.chapter, { xp: e.base + extra, ambushes });
      ambushes = 0;
      tables = [];
    }
  }
  return out;
}

/** Fills in each chapter's played line: the route's wild steps through the ambush process, PLAYED_SEEDS times. */
function playedLine(chapters: ChapterCurve[], events: Parameters<typeof replayAmbushes>[0], targets: readonly ChapterLevels[]): void {
  const runs = Array.from({ length: PLAYED_SEEDS }, (_, i) => replayAmbushes(events, i + 1, 0));
  const wander = Array.from({ length: PLAYED_SEEDS }, (_, i) => replayAmbushes(events, i + 1, WANDER_STEPS));
  const at = (xs: number[], q: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))]!;
  for (const c of chapters) {
    const xps = runs.map((r) => r.get(c.chapter)!.xp);
    const medianXp = at(xps, 0.5);
    const median = levelForXp(RPG, medianXp);
    const to = targets.find((t) => t.chapter === c.chapter)!.to;
    c.played = {
      medianXp,
      median,
      p90: levelForXp(RPG, at(xps, 0.9)),
      ambushes: runs.reduce((n, r) => n + r.get(c.chapter)!.ambushes, 0) / runs.length,
      wanderP90: levelForXp(RPG, at(wander.map((r) => r.get(c.chapter)!.xp), 0.9)),
      onTarget: to - median <= LEVEL_CURVE.slackUnder && median - to <= LEVEL_CURVE.slackOver,
    };
  }
}

/** The report as a table, for the console and for the owner. */
export function curveText(r: CurveReport): string {
  const lines = [`Level curve (${r.route}): the route line, then the played line (ambushes on its wild steps, seeds 1 to ${PLAYED_SEEDS})`, ''];
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
  lines.push('', `Ch  Wild steps  Route's ambush XP  Ambushes (mean)  Played median (XP)  Played p90  Wanderer p90  Verdict`);
  for (const c of r.chapters) {
    lines.push(
      [
        String(c.chapter).padEnd(3),
        String(c.wildSteps).padEnd(11),
        String(c.routeAmbushXp).padEnd(18),
        c.played.ambushes.toFixed(1).padEnd(16),
        `${c.played.median} (${c.played.medianXp})`.padEnd(19),
        String(c.played.p90).padEnd(11),
        String(c.played.wanderP90).padEnd(13),
        c.played.onTarget ? 'on target' : c.played.median > c.target.to ? `${c.played.median - c.target.to} over` : `${c.target.to - c.played.median} under`,
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
