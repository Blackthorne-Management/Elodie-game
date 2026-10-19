// Yucayeque's debate as a quest (owner request, Oct 19), like Pòdlimyè's "A Question of Faith": a mystery quest once
// the pier is won, held only while the city is free, finished by arguing all three rounds or mediating.

import { describe, expect, it } from 'vitest';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { mysteryGoals, mysteryQuests, sideGoals, sideNudges, waypoint } from '../src/engine/guide.ts';
import { sideQuestStatus } from '../src/engine/sideQuests.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
const springs = SIDE_QUESTS.find((q) => q.id === 'springs')!;
const ids = (f: FlagStore) => mysteryQuests(SIDE_QUESTS, f).map((q) => q.id);

describe('Owned or Remembered (the debate by the village fire)', () => {
  it('is not offered before the pier fight', () => {
    expect(ids(new FlagStore({}))).not.toContain('springs');
  });

  it('once the pier is won, it is a mystery quest with a nudge, and the arrow can reach the fire', () => {
    const f = new FlagStore({ 'encounter.xaragua_story.pier.won': true });
    expect(ids(f)).toContain('springs');
    expect(sideNudges(SIDE_QUESTS, f)).toContain(springs.nudge);
    const goal = mysteryGoals(SIDE_QUESTS, f).find((m) => m.id === 'springs')!.goal;
    expect(waypoint(maps, 'xaragua-village', goal, f)).not.toBeNull();
  });

  it('the debaters stand by the fire, either side of the quest marker, while the city is free', () => {
    const at = springs.start![0]!.at;
    const here = maps['xaragua-village']!.npcs.filter((n) => n.npc === 'debate_roots_elder' || n.npc === 'debate_pilgrim');
    expect(here).toHaveLength(2);
    for (const n of here) expect(Math.abs(n.pos.x - at.x) + Math.abs(n.pos.y - at.y)).toBeLessThanOrEqual(2);
  });

  it('listening starts it; joining all three rounds (won or lost) or mediating finishes it', () => {
    const f = new FlagStore({ 'encounter.xaragua_story.pier.won': true, 'debate.xaragua_springs.listened': true });
    expect(sideQuestStatus(f, springs)).toBe('active');
    expect(sideGoals(SIDE_QUESTS, f).some((g) => g.id === 'springs')).toBe(true);
    for (const end of ['joined', 'mediated']) {
      const g = new FlagStore({ 'debate.xaragua_springs.listened': true, [`debate.xaragua_springs.${end}`]: true });
      expect(sideQuestStatus(g, springs), end).toBe('done');
    }
  });

  it('is no longer offered once the Crown takes the city (the debate is gone)', () => {
    const f = new FlagStore({ 'encounter.xaragua_story.pier.won': true, 'story.crown_attack': true });
    expect(ids(f)).not.toContain('springs');
  });
});
