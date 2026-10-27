// The side quests built Oct 27 (src/data/sideQuestsLate.ts): each walked through in the simulator from the route's own
// save at that chapter's end (the route never takes them), paid once, closed when the chapter's ship sails; and the
// main route untouched by them.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { LATE_SIDE_QUESTS, LATE_XP } from '../src/data/sideQuestsLate.ts';
import { localPillar, sharedXp } from '../src/engine/rpg.ts';
import { closedNotes, settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from '../tools/sim-setup.ts';

const maps = loadMaps();
const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
const quest = (id: string) => SIDE_QUESTS.find((q) => q.id === id)!;

/** The game as the route leaves it at a marker. */
function simAt(mark: string): Sim {
  const sim = newGameSim(maps);
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim;
    sim.run([item]);
  }
  throw new Error(`No mark @${mark}`);
}

describe('the late side quests are optional', () => {
  it('the route never accepts one of them', () => {
    const flags = simAt('chapter9-end').logic.state.flags;
    for (const q of LATE_SIDE_QUESTS) expect(sideQuestStatus(flags, q), q.id).not.toBe('active');
    for (const q of LATE_SIDE_QUESTS) expect(sideQuestStatus(flags, q), q.id).not.toBe('done');
  });

  it('nothing on the routes reads them (no story step, door or scene waits for one)', () => {
    const text = readFileSync(new URL('../src/data/quests.ts', import.meta.url), 'utf8');
    for (const q of LATE_SIDE_QUESTS) expect(text.includes(`side.${q.id}.`), q.id).toBe(false);
  });

  it('each closes when its chapter\'s ship sails, and the Journal says what became of it', () => {
    const flags = new FlagStore({ 'act7.complete': true, 'act8.complete': true, 'act9.complete': true });
    for (const q of LATE_SIDE_QUESTS) flags.set(q.accepted && 'flag' in q.accepted ? q.accepted.flag : `side.${q.id}.accepted`, true);
    for (const q of LATE_SIDE_QUESTS) expect(sideQuestStatus(flags, q), q.id).toBe('closed');
    expect(closedNotes(LATE_SIDE_QUESTS, flags)).toHaveLength(LATE_SIDE_QUESTS.length);
  });
});

describe('K-1 Definitely Not a Spy (Kirinoura, at dawn)', () => {
  it('Yari asks at the tea house screen; Haru shows the screen, the pier and the corridor; it pays once', () => {
    const sim = simAt('kirinoura-petition');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS); // what the route's own quests pay (the field pays it as they finish)
    const q = quest('not_a_spy');
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    // Out of the Hall to the tea house screen (the offer).
    sim.run(['goto 17,25']);
    expect(sim.logic.map.id).toBe('kuroshi-quarter');
    sim.run(['goto 16,18', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // A step along the strip: the screen again.
    sim.run(['left', 'skip']);
    expect(flags.isSet('side.not_a_spy.screen')).toBe(true);
    // Down the stair to the pier, and up it to the puddle.
    sim.run(['goto 12,29']);
    expect(sim.logic.map.id).toBe('kuroshi-pier');
    sim.run(['goto 13,8', 'skip']);
    expect(flags.isSet('side.not_a_spy.pier')).toBe(true);
    // Back up to the Hall's corridor.
    sim.run(['goto 12,0', 'goto 19,0']);
    expect(sim.logic.map.id).toBe('kuroshi-hall');
    sim.run(['goto 17,8', 'skip']);
    for (const f of ['side.not_a_spy.shoes', 'side.not_a_spy.done']) expect(flags.isSet(f), f).toBe(true);
    const xp = sharedXp(flags, RPG);
    const influence = localPillar(flags, RPG, 'influence', 'kuroshi');
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('not_a_spy');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.notASpy);
    expect(localPillar(flags, RPG, 'influence', 'kuroshi') - influence).toBe(1);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('not_a_spy');
  });
});

describe('K-4 The Letter in the Floor (Lady Sayo\'s House, the Nightingale Key)', () => {
  it('the floor-maker lifts the latch; the tune in the memory, the nail, the walk now; the box gives the key', () => {
    const sim = simAt('kirinoura-petition');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    const q = quest('letter_floor');
    sim.run(['goto 17,25']);
    // Shut until the floor-maker opens it.
    const door = sim.logic.map.doors.find((d) => d.id === 'quarter_sayo')!;
    expect(sim.logic.doorOpen(door)).toBe(false);
    sim.run(['goto 12,2', 'left', 'confirm', 'skip']);
    expect(sim.logic.doorOpen(door)).toBe(true);
    expect(sideQuestStatus(flags, q)).toBe('active');
    sim.run(['goto 10,3', 'left']);
    expect(sim.logic.map.id).toBe('kuroshi-sayo-house');
    sim.run(['skip']);
    expect(flags.isSet('story.sayo_house_seen')).toBe(true);
    // The rest of it is the puzzle's own solution (puzzles/kuroshi_floor), then the box.
    sim.run(readJson<string[]>('puzzles/kuroshi_floor/solution.json'));
    expect(flags.isSet('story.sayo_box_open')).toBe(true);
    expect(flags.get('floor.sayo.nail')).toBe('3,2');
    sim.run(['up*4', 'confirm', 'skip']);
    for (const f of ['item.nightingale_key', 'item.sayo_letter', 'side.letter_floor.done']) expect(flags.isSet(f), f).toBe(true);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('letter_floor');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.letterFloor);
  });
});
