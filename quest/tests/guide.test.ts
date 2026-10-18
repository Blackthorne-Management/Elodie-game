// Quest arrows (engine/guide.ts; owner request, Oct 17): the goals, the way through the doors, and that
// every objective's goal is where the scripted route actually completes it.

import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../src/data/quests.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { goalFor, mysteryGoals, mysteryQuests, sideGoals, sideNudges, storyGoal, waypoint, type Goal } from '../src/engine/guide.ts';
import { currentObjective, questForJournal } from '../src/engine/quests.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const near = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

describe('the way to a goal', () => {
  it('a goal on this map is itself; elsewhere, the first door of the shortest way there', () => {
    const flags = new FlagStore({ 'story.warroom_echo': true, 'story.elodie_left': true });
    const goal: Goal = { map: 'zetwal-town', at: { x: 20, y: 10 } };
    expect(waypoint(maps, 'zetwal-town', goal, flags)).toEqual({ map: 'zetwal-town', at: { x: 20, y: 10 }, final: true });
    const out = waypoint(maps, 'zetwal-house', goal, flags)!;
    expect(out.final).toBe(false);
    const door = maps['zetwal-house']!.doors.find((d) => d.pos.x === out.at.x && d.pos.y === out.at.y);
    expect(door?.targetMap).toBe('zetwal-town');
  });

  it('a closed door is no way through, and the first goal whose condition holds wins', () => {
    const flags = new FlagStore();
    expect(goalFor([{ if: { flag: 'x' }, map: 'a', at: { x: 0, y: 0 } }, { map: 'b', at: { x: 1, y: 1 } }], flags)?.map).toBe('b');
    flags.set('x', true);
    expect(goalFor([{ if: { flag: 'x' }, map: 'a', at: { x: 0, y: 0 } }, { map: 'b', at: { x: 1, y: 1 } }], flags)?.map).toBe('a');
    // Before the war room, the east gate is closed: no way to the Cane Road.
    expect(waypoint(maps, 'zetwal-town', { map: 'zetwal-road', at: { x: 5, y: 12 } }, new FlagStore())).toBeNull();
  });
});

describe('every goal is real', () => {
  const goals = [
    ...CHAPTERS.flatMap((q) => q.objectives.flatMap((o) => (o.goals ?? []).map((g) => ({ who: `${q.id}/${o.id}`, g })))),
    ...SIDE_QUESTS.flatMap((q) => q.steps.flatMap((s, i) => (s.goals ?? []).map((g) => ({ who: `${q.id}#${i}`, g })))),
  ];

  it('every objective and every side-quest step has a goal, on a map that exists, inside it', () => {
    for (const q of CHAPTERS) for (const o of q.objectives) expect(o.goals?.length, `${q.id}/${o.id}`).toBeGreaterThan(0);
    for (const q of SIDE_QUESTS) q.steps.forEach((s, i) => expect(s.goals?.length, `${q.id} step ${i}`).toBeGreaterThan(0));
    for (const { who, g } of goals) {
      const m = maps[g.map];
      expect(m, `${who}: map ${g.map}`).toBeDefined();
      expect(g.at.x >= 0 && g.at.y >= 0 && g.at.x < m!.width && g.at.y < m!.height, `${who}: ${g.at.x},${g.at.y}`).toBe(true);
    }
  });
});

describe('the arrows follow the scripted route (every chapter it plays)', () => {
  const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
  const sim = newGameSim(maps);
  const flags = sim.logic.state.flags;
  const problems: string[] = [];
  let steps = 0;
  for (const item of route) {
    const mapId = sim.logic.state.player.mapId;
    const quest = questForJournal(CHAPTERS, mapId, flags);
    const before = quest ? currentObjective(quest, flags) : null;
    const goal = storyGoal(quest, flags);
    if (before && sim.logic.mode === 'field') {
      steps++;
      if (!goal) problems.push(`${before.id}: no goal holds (on ${mapId})`);
      else if (!waypoint(maps, mapId, goal, flags)) problems.push(`${before.id}: no way from ${mapId} to ${goal.map}`);
    }
    sim.run([item]);
    const after = quest ? currentObjective(quest, flags) : null;
    if (before && goal && after?.id !== before.id) {
      const p = sim.logic.state.player;
      // Done where the goal said (a map change at the end of a scene counts from the map it began on).
      const here = p.mapId === goal.map ? near(p.pos, goal.at) : Infinity;
      if (here > 4 && mapId !== goal.map) problems.push(`${before.id}: done on ${p.mapId} ${p.pos.x},${p.pos.y}, goal ${goal.map} ${goal.at.x},${goal.at.y}`);
      else if (here > 4 && mapId === goal.map && p.mapId === goal.map) problems.push(`${before.id}: done at ${p.pos.x},${p.pos.y}, goal ${goal.at.x},${goal.at.y}`);
    }
  }

  it('at every step there is a goal, and a way to it through the doors', () => {
    expect(steps).toBeGreaterThan(50);
    expect(problems.filter((p) => !p.includes('done'))).toEqual([]);
  });

  it('each objective is done within a few tiles of its goal', () => {
    expect(problems.filter((p) => p.includes('done'))).toEqual([]);
  });

  it('side quests point the way once accepted', () => {
    const f = new FlagStore();
    for (const q of SIDE_QUESTS) {
      expect(sideGoals([q], f), q.id).toEqual([]); // not accepted yet: no step dot
    }
  });
});

// Owner request, Oct 18: a side quest not started yet shows as a mystery quest, with Anissa's nudge and a dot.
describe('side quests not started yet are mystery quests', () => {
  it('each has a giver to point at, a nudge from Anissa and a time it becomes available', () => {
    for (const q of SIDE_QUESTS) {
      expect(q.start?.length, q.id).toBeGreaterThan(0);
      expect(q.nudge, q.id).toBeTruthy();
      expect(q.nudge!.length, q.id).toBeLessThanOrEqual(128);
      expect(q.available, q.id).toBeDefined();
    }
  });

  it('shows once available, with its nudge and its giver; never once accepted', () => {
    const overdue = SIDE_QUESTS.find((q) => q.id === 'overdue')!;
    const f = new FlagStore();
    expect(mysteryQuests([overdue], f)).toEqual([]); // the island is not open yet
    f.set('story.bridge_crossed', true);
    expect(mysteryQuests([overdue], f)).toEqual([overdue]);
    expect(sideNudges([overdue], f)[0]).toContain('temple archive');
    expect(mysteryGoals([overdue], f)[0]?.goal.map).toBe('zetwal-archive');
    f.set('side.overdue.accepted', true);
    expect(mysteryQuests([overdue], f)).toEqual([]);
  });

  it("each giver can be reached through the doors once the quest is available (the archive from the plaza)", () => {
    const f = new FlagStore({ 'story.warroom_echo': true, 'story.elodie_left': true, 'story.bridge_crossed': true, 'anchor.chain_bridge': true });
    for (const { id, goal } of mysteryGoals(SIDE_QUESTS, f)) expect(waypoint(maps, 'zetwal-town', goal, f), id).not.toBeNull();
    expect(mysteryGoals(SIDE_QUESTS, f).map((m) => m.id).sort()).toEqual(['cane_name', 'overdue', 'soup']);
  });
});
