// The second batch of side quests built Oct 27 (src/data/sideQuestsLate.ts; the owner, Oct 27: every optional side quest
// for the Nov 22 release): each walked through in the simulator from the route's own save at that point (the route never
// takes them), paid once, closed when the story moves past it. The level curve with all of them done is checked with the
// first batch's in tests/sideQuestsLate.test.ts.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RPG } from '../src/data/rpg.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { LATE_XP } from '../src/data/sideQuestsLate.ts';
import { CHAPEL, ERRAND, FEAST_FLAGS, WATCHES } from '../src/data/ardencia.ts';
import { localPillar, sharedXp } from '../src/engine/rpg.ts';
import { settleRewards, sideQuestStatus } from '../src/engine/sideQuests.ts';
import { mysteryQuests } from '../src/engine/guide.ts';
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

/** Press A through a conversation's lines until it offers a choice, then pick the k-th. */
function choose(sim: Sim, k: number): void {
  for (let i = 0; i < 40 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
  expect(sim.logic.view().kind).toBe('choice');
  sim.run([...(k > 0 ? [`down*${k}`] : []), 'confirm']);
}

/** What one quest pays when it is settled (and that it pays only once). */
function paid(flags: FlagStore, id: string): number {
  const xp = sharedXp(flags, RPG);
  expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain(id);
  expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain(id);
  return sharedXp(flags, RPG) - xp;
}

// ---- Chapter 3 ----------------------------------------------------------------------------------------------------

/** The morning of the trial: the day's three things done, Ar-1's night over, the party in the Lower Town. */
function trialMorning(): Sim {
  const sim = simAt('bread-night');
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  expect(sim.logic.map.id).toBe('ardencia-lower');
  sim.run(['goto 31,9']);
  expect(sim.logic.map.id).toBe('ardencia-town');
  return sim;
}

describe('Ar-3 The Elders\' Feast (Cenizal, the morning of the trial)', () => {
  it('opens only on the morning of the trial, from the contract board; the route never takes it', () => {
    const before = simAt('debate').logic.state.flags;
    expect(mysteryQuests([quest('feast')], before)).toEqual([]);
    const flags = trialMorning().logic.state.flags;
    expect(mysteryQuests([quest('feast')], flags).map((q) => q.id)).toEqual(['feast']);
    const end = simAt('chapter3-end').logic.state.flags;
    expect(sideQuestStatus(end, quest('feast'))).toBe('unknown');
    expect(mysteryQuests([quest('feast')], end)).toEqual([]);
  });

  it('the board, the feast (the steward, the servants, Ferrán\'s boast), the hall\'s book and three questions: +2 Influence', () => {
    const sim = trialMorning();
    const flags = sim.logic.state.flags;
    sim.run(['goto 22,14', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('feast'))).toBe('active');
    // Up the plaza into the Alcázar, to the elders' hall door.
    sim.run(['goto 19,7', 'up']);
    expect(sim.logic.map.id).toBe('ardencia-alcazar');
    sim.run(['goto 10,7', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.heard)).toBe(true);
    // Ferrán before the book: he sends the guard back to the door.
    sim.run(['goto 3,6', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.done)).toBe(false);
    // The records room's salt-tax book.
    sim.run(['goto 23,3', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FEAST_FLAGS.book)).toBe(true);
    // Three questions: a wrong answer, then the book twice; lost (one of three), then won on the second pot.
    sim.run(['goto 3,6', 'up', 'confirm']);
    choose(sim, 0);
    choose(sim, 0);
    choose(sim, 1);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet(FEAST_FLAGS.done)).toBe(false);
    sim.run(['up', 'confirm']);
    choose(sim, 0);
    choose(sim, 1);
    choose(sim, 1);
    choose(sim, 2);
    sim.run(['skip']);
    for (const f of [FEAST_FLAGS.done, FEAST_FLAGS.influence]) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet(FEAST_FLAGS.fear)).toBe(false);
    const influence = localPillar(flags, RPG, 'influence', 'ardencia');
    expect(influence - localPillar(new FlagStore({ ...flags.snapshot(), [FEAST_FLAGS.influence]: false }), RPG, 'influence', 'ardencia')).toBe(2);
    expect(paid(flags, 'feast')).toBe(LATE_XP.feast);
  });

  it('or the Fear route: Ferrán\'s blades at his door (the fight), the tally from under his stair, the key in Gianna\'s hand', () => {
    const sim = trialMorning();
    const flags = sim.logic.state.flags;
    sim.run(['goto 22,14', 'up', 'confirm', 'skip', 'goto 19,7', 'up', 'goto 10,7', 'skip', 'goto 16,21']);
    expect(sim.logic.map.id).toBe('ardencia-town');
    sim.run(['goto 5,5', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sim.battles.at(-1)).toBe('feast_blades');
    sim.run(['skip']);
    expect(flags.isSet(FEAST_FLAGS.tally)).toBe(true);
    sim.run(['goto 19,7', 'up', 'goto 3,6', 'up', 'confirm', 'skip']);
    for (const f of [FEAST_FLAGS.done, FEAST_FLAGS.fear]) expect(flags.isSet(f), f).toBe(true);
    const fear = localPillar(flags, RPG, 'fear', 'ardencia');
    expect(fear - localPillar(new FlagStore({ ...flags.snapshot(), [FEAST_FLAGS.fear]: false }), RPG, 'fear', 'ardencia')).toBe(2);
    expect(paid(flags, 'feast')).toBe(LATE_XP.feast);
  });
});

describe('Ar-4 The Old Lord\'s Errand (secret: La Promesa de Benny)', () => {
  it('is never a mystery quest; old Benny offers it after Ar-2, and Zelia unlocks the chapel stair', () => {
    const sim = simAt('old-benny');
    const flags = sim.logic.state.flags;
    expect(mysteryQuests(SIDE_QUESTS, flags).map((q) => q.id)).not.toContain('old_errand');
    expect(sideQuestStatus(flags, quest('old_errand'))).toBe('unknown');
    sim.run(['confirm', 'skip']);
    expect(sideQuestStatus(flags, quest('old_errand'))).toBe('active');
  });

  it('the cloister: seen now or then is back to the stair; the five swaps, young Benny, the bolt, the box, Benny\'s stair', () => {
    const sim = simAt('old-benny');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    sim.run(['confirm', 'skip', 'goto 31,16', 'right']);
    expect(sim.logic.map.id).toBe('ardencia-chapel');
    sim.run(['skip']);
    expect(sim.logic.state.player.pos).toEqual(CHAPEL.gate);
    // Straight along the south walk now: the guard by the well sees (Anissa's first hint), and back to the stair.
    sim.run(['right*4', 'skip']);
    expect(flags.get(ERRAND.seen)).toBe(1);
    expect(sim.logic.state.player.pos).toEqual(CHAPEL.gate);
    // The way across (puzzles/ardencia_cloister).
    sim.run(readJson<string[]>('puzzles/ardencia_cloister/solution.json'));
    for (const f of [ERRAND.asked, ERRAND.anchor, ERRAND.promise]) expect(flags.isSet(f), f).toBe(true);
    // Up Benny's stair into the quiet rooms, and the letter read to him.
    sim.run(['left*6']);
    expect(sim.logic.map.id).toBe('ardencia-alcazar');
    sim.run(['goto 4,15', 'left', 'confirm', 'skip']);
    expect(flags.isSet(ERRAND.done)).toBe(true);
    const influence = localPillar(flags, RPG, 'influence', 'ardencia');
    expect(paid(flags, 'old_errand')).toBe(LATE_XP.oldErrand);
    expect(localPillar(flags, RPG, 'influence', 'ardencia') - influence).toBe(2);
    expect(flags.isSet('item.benny_promise')).toBe(true);
  });

  it('each watch sees in its own era only, and the strips lie where the walk must cross them', () => {
    expect(WATCHES.map((w) => w.era)).toEqual(['present', 'echo', 'present', 'echo', 'present']);
    const map = maps['ardencia-chapel']!;
    for (const w of WATCHES) {
      const t = map.triggers.find((x) => x.id === `seen_${w.id}`)!;
      expect(t.era, w.id).toBe(w.era);
      // The strip spans the whole walk it lies on (no tile of the walk beside it to slip past).
      expect(t.area.width * t.area.height, w.id).toBe(2);
    }
  });
});

describe('Ar-5 The Arrows Missed (the strand camp)', () => {
  it('five of Azzy\'s company; three saw every shot land wide; Azzy will not hear it; +2 Fear', () => {
    const sim = simAt('strand');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    const q = quest('arrows');
    expect(mysteryQuests([q], flags).map((x) => x.id)).toEqual(['arrows']);
    sim.run(['goto 9,6', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    sim.run(['goto 11,8', 'up', 'confirm', 'skip', 'goto 12,6', 'up', 'confirm', 'skip', 'goto 5,6', 'left', 'confirm', 'skip']);
    expect(flags.isSet('side.arrows.done')).toBe(false);
    sim.run(['goto 15,10', 'right', 'confirm', 'skip']);
    for (const f of ['side.arrows.done', 'clue.arrows_missed']) expect(flags.isSet(f), f).toBe(true);
    const fear = localPillar(flags, RPG, 'fear', 'ardencia');
    expect(paid(flags, 'arrows')).toBe(LATE_XP.arrows);
    expect(localPillar(flags, RPG, 'fear', 'ardencia') - fear).toBe(2);
  });

  it('closes when the trader sails', () => {
    const flags = simAt('aldoria').logic.state.flags;
    expect(mysteryQuests([quest('arrows')], flags)).toEqual([]);
    expect(sideQuestStatus(flags, quest('arrows'))).toBe('unknown');
    void readFileSync;
  });
});
