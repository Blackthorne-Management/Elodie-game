// The side quests built Oct 27 (src/data/sideQuestsLate.ts): each walked through in the simulator from the route's own
// save at that chapter's end (the route never takes them), paid once, closed when the chapter's ship sails; and the
// main route untouched by them.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BATTLES, ENEMIES, SKILL_BOOK } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, battleParty } from '../src/engine/battle.ts';
import { STABILITY_HOUSES } from '../src/data/claim.ts';
import { stabilityParts } from '../src/engine/stability.ts';
import { skillsAction } from '../tools/battle-sim.ts';
import { SIDE_QUESTS } from '../src/data/sideQuests.ts';
import { LATE_SIDE_QUESTS, LATE_XP } from '../src/data/sideQuestsLate.ts';
import { levelForXp, localPillar, sharedXp } from '../src/engine/rpg.ts';
import { LEVELS, LEVEL_CURVE } from '../src/config.ts';
import { levelCurve } from '../tools/level-curve.ts';
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

/** The flags that close every late quest: each chapter's own end, and Chapter 3's noon, trial and sailing. */
const CLOSING_FLAGS = {
  'story.noon': true,
  'story.trial_fought': true,
  'story.aldoria_arrived': true,
  'story.caravan_dawn': true,
  'act7.complete': true,
  'act8.complete': true,
  'act9.complete': true,
} as const;

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
    // Chapter 3's close at noon, at the trial and when the trader sails for Al-Doria; the rest as their chapters end.
    const flags = new FlagStore({ ...CLOSING_FLAGS });
    for (const q of LATE_SIDE_QUESTS) flags.set(q.accepted && 'flag' in q.accepted ? q.accepted.flag : `side.${q.id}.accepted`, true);
    for (const q of LATE_SIDE_QUESTS) expect(sideQuestStatus(flags, q), q.id).toBe('closed');
    expect(closedNotes(LATE_SIDE_QUESTS, flags)).toHaveLength(LATE_SIDE_QUESTS.length);
  });
});

describe('what they pay keeps the level curve (the levels pass)', () => {
  const report = levelCurve();
  // What a player who does every one of them gains by each chapter's end: the quests' XP, and J-1's three bouts.
  const bouts = ['spice', 'dyer', 'wrestler'].reduce((n, w) => n + BATTLES[`argue_${w}`]!.rewards.xp, 0);
  const xpOf = (id: string) => SIDE_QUESTS.find((q) => q.id === id)!.reward.xp ?? 0;
  const extra: Record<number, number> = {
    // Chapter 1's secret (Z-4, data/sideQuests.ts) counts too: a player who does everything does it.
    1: xpOf('seventh_stone'),
    // Chapter 3: the feast (and its blades, the Fear route's fight) and the old lord's errand; Ar-5 is at the camp,
    // after the chapter's end, so it counts from Chapter 4.
    3: LATE_XP.feast + BATTLES.feast_blades!.rewards.xp + LATE_XP.oldErrand,
    // Chapter 4: the saffron (and its raiders), the uncashed note, the invoice (and the factor's guards).
    4: LATE_XP.arrows + LATE_XP.saffron + BATTLES.saffron_raiders!.rewards.xp + LATE_XP.uncashed + LATE_XP.invoice + BATTLES.factor_guards!.rewards.xp,
    7: LATE_XP.notASpy + LATE_XP.letterFloor,
    8: LATE_XP.argue + LATE_XP.littleLamps + bouts,
    9: LATE_XP.sorry + LATE_XP.patientHour + LATE_XP.tea,
  };
  const carried = (chapter: number) => Object.entries(extra).reduce((n, [c, xp]) => n + (Number(c) <= chapter ? xp : 0), 0);

  it('the route and the line without side quests are what they were (none of them is on the route)', () => {
    expect(report.chapters.map((c) => c.level)).toEqual([4, 8, 11, 14, 15, 17, 19, 21, 24, 25, 28, 30]);
    expect(report.chapters.map((c) => c.levelNoSide)).toEqual([3, 7, 10, 12, 13, 15, 17, 19, 22, 23, 26, 28]);
  });

  it('a player who does every one of them ends each chapter at most one level over its target, and never past the cap', () => {
    for (const c of report.chapters) {
      const level = levelForXp(RPG, c.xp + carried(c.chapter));
      expect(level, `Chapter ${c.chapter}`).toBeLessThanOrEqual(c.target.to + LEVEL_CURVE.slackOver);
      expect(level).toBeLessThanOrEqual(LEVELS.cap);
    }
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

/** Agnipur at dawn, the price paid, the party at the Court, out on the bazaar's head. */
function agnipurDawn(): Sim {
  const sim = simAt('jwaladesh-price');
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  if (sim.logic.map.id === 'jwaladesh-court') sim.run(['goto 17,27']);
  expect(sim.logic.map.id).toBe('jwaladesh-bazaar');
  return sim;
}

describe('J-1 Win Every Argument (Agnipur, at dawn)', () => {
  it('Vikram asks for all three back: one bout, two answers (a wrong one first), and the pillar follows the answers', () => {
    const sim = agnipurDawn();
    const flags = sim.logic.state.flags;
    const q = quest('argue');
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    // The old wrestler on the temple steps: Vikram spars (the first choice), and the bout's scene plays after it.
    sim.run(['goto 27,4', 'up', 'confirm']);
    for (let i = 0; i < 8 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
    sim.run(['confirm', 'skip']);
    expect(sim.battles.at(-1)).toBe('argue_wrestler');
    for (const f of ['side.argue.accepted', 'side.argue.wrestler', 'side.argue.wrestler_spar']) expect(flags.isSet(f), f).toBe(true);
    // The dyer: Gianna answers, wrongly, then rightly.
    sim.run(['goto 6,25', 'up', 'confirm', 'down', 'confirm', 'confirm', 'skip']);
    expect(flags.isSet('side.argue.dyer')).toBe(false);
    sim.run(['up', 'confirm', 'down', 'confirm', 'down', 'confirm', 'skip']);
    expect(flags.isSet('side.argue.dyer')).toBe(true);
    // The spice-seller: the right answer, and the end.
    sim.run(['goto 26,18', 'up', 'confirm', 'down', 'confirm', 'down', 'confirm', 'skip']);
    for (const f of ['side.argue.spice', 'side.argue.done', 'side.argue.influence']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('side.argue.fear')).toBe(false);
    const influence = localPillar(flags, RPG, 'influence', 'jwaladesh');
    const fresh = new FlagStore({ ...flags.snapshot(), 'side.argue.influence': false });
    expect(influence - localPillar(fresh, RPG, 'influence', 'jwaladesh')).toBe(1);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('argue');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.argue);
  });
});

describe('J-1\'s bouts: Vikram alone, at the route\'s level', () => {
  it('a player who uses his kit wins each of the three; they step back at 0 HP (nobody falls)', () => {
    const flags = simAt('jwaladesh-price').logic.state.flags;
    for (const who of ['spice', 'dyer', 'wrestler']) {
      const def = BATTLES[`argue_${who}`]!;
      expect(def.fighters).toEqual(['vikram']);
      expect(ENEMIES[`spar_${who}`]!.withdraws, who).toBeDefined();
      let wins = 0;
      for (let seed = 1; seed <= 20; seed++) {
        const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), battleItems(flags, RPG), { seed });
        b.start();
        for (let t = 0; t < 200 && !b.outcome; t++) b.act(skillsAction(b));
        if (b.outcome === 'won') wins++;
      }
      expect(wins, who).toBeGreaterThanOrEqual(19);
    }
  });
});

describe('J-4 Oil for the Little Lamps (the Unbroken Wick)', () => {
  it('the shrine child asks; the roll call and the pours fifty years ago; the lock balances; her lamp burns; Anissa keeps the wick', () => {
    const sim = agnipurDawn();
    const flags = sim.logic.state.flags;
    const q = quest('little_lamps');
    sim.run(['goto 38,18', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // Down the stair to the quay, into the oil store, and the puzzle's own solution.
    sim.run(['goto 21,29']);
    expect(sim.logic.map.id).toBe('jwaladesh-harbor');
    sim.run(['goto 27,8']);
    sim.run(readJson<string[]>('puzzles/jwaladesh_wick/solution.json'));
    expect(flags.isSet('anchor.reservoir_sealed')).toBe(true);
    sim.run(['down', 'echo', 'skip']);
    expect(sim.logic.era).toBe('present');
    // The balance lock on the back door.
    sim.run(['goto 24,5', 'up', 'confirm', 'skip']);
    for (const f of ['story.lock_balanced', 'item.sealed_reservoir']) expect(flags.isSet(f), f).toBe(true);
    // Back up to the shrine.
    sim.run(['goto 16,0']);
    expect(sim.logic.map.id).toBe('jwaladesh-bazaar');
    sim.run(['goto 38,18', 'up', 'confirm', 'skip']);
    for (const f of ['side.little_lamps.done', 'item.unbroken_wick']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('item.sealed_reservoir')).toBe(false);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('little_lamps');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.littleLamps);
  });
});

/** Press A through a conversation's lines until it offers a choice, then pick the k-th. */
function choose(sim: Sim, k: number): void {
  for (let i = 0; i < 40 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
  expect(sim.logic.view().kind).toBe('choice');
  sim.run([...(k > 0 ? [`down*${k}`] : []), 'confirm']);
}

describe('Al-1 Terribly Sorry (Kingsmere, by day)', () => {
  it('Rosalind in the hall: "never once written to me"; five letters by hand, each reply and each walking off', () => {
    const sim = simAt('aldermoor-day');
    const flags = sim.logic.state.flags;
    settleRewards(flags, RPG, SIDE_QUESTS);
    const q = quest('sorry');
    // Out of St. Agatha's, across the square, into the keep's hall.
    sim.run(['goto 12,17', 'goto 20,5']);
    expect(sim.logic.map.id).toBe('aldermoor-keep');
    sim.run(['goto 26,12', 'right', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    expect(flags.isSet('item.sorry_letters')).toBe(true);
    // The footman in the hall.
    sim.run(['goto 33,10', 'up', 'confirm', 'skip']);
    expect(flags.isSet('side.sorry.footman')).toBe(true);
    expect(sim.logic.npcs().some((n) => n.npc === 'letter_footman')).toBe(false);
    // The square: the sergeant and the constable.
    sim.run(['goto 21,29']);
    expect(sim.logic.map.id).toBe('aldermoor-cross');
    sim.run(['goto 8,26', 'up', 'confirm', 'skip', 'goto 36,9', 'up', 'confirm', 'skip']);
    for (const f of ['side.sorry.sergeant', 'side.sorry.constable']) expect(flags.isSet(f), f).toBe(true);
    // The heath: the highwayman and the goose.
    sim.run(['goto 20,29']);
    expect(sim.logic.map.id).toBe('aldermoor-heath');
    sim.run(['goto 30,11', 'up', 'confirm', 'skip', 'goto 12,16', 'up', 'confirm', 'skip']);
    for (const f of ['side.sorry.bandit', 'side.sorry.goose', 'side.sorry.done']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('item.sorry_letters')).toBe(false);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('sorry');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.sorry);
  });
});

/** Kingsmere at the last dawn: the price paid on the Mere Stair; up the heath road to the square. */
function kingsmereDawn(): Sim {
  const sim = simAt('aldermoor-dawn');
  settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
  expect(sim.logic.map.id).toBe('aldermoor-heath');
  sim.run(['goto 45,13']);
  expect(sim.logic.map.id).toBe('aldermoor-cross');
  return sim;
}

describe('Al-4 The Clock That Waits (the Patient Hour)', () => {
  it('the clockmaker by the keep\'s gate; the tower; 11:10 to a quarter to three before the watchman; Agatha\'s vault', () => {
    const sim = kingsmereDawn();
    const flags = sim.logic.state.flags;
    const q = quest('patient_hour');
    sim.run(['goto 23,8', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    sim.run(['goto 20,5']);
    expect(sim.logic.map.id).toBe('aldermoor-keep');
    sim.run(['goto 36,6']);
    expect(sim.logic.map.id).toBe('aldermoor-clocktower');
    sim.run(readJson<string[]>('puzzles/aldermoor_clock/solution.json'));
    expect(flags.isSet('anchor.clock_stopped')).toBe(true);
    expect(flags.get('clock.tower.face')).toBe('2:45');
    sim.run(['down*2', 'echo', 'skip']);
    expect(sim.logic.era).toBe('present');
    sim.run(['right*2', 'up*3', 'confirm', 'skip']);
    for (const f of ['item.patient_hour', 'side.patient_hour.done']) expect(flags.isSet(f), f).toBe(true);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('patient_hour');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.patientHour);
  });
});

describe('Al-5 Tea With Lady Rosalind', () => {
  it('three cups; the record wins two of them; she will sit for Aldermoor, and the Accord is a little steadier', () => {
    const sim = kingsmereDawn();
    const flags = sim.logic.state.flags;
    sim.run(['goto 24,5']);
    expect(sim.logic.map.id).toBe('aldermoor-townhouse');
    sim.run(['goto 9,5', 'up', 'confirm']);
    // Cup one: Compassion (it only warms it).
    choose(sim, 2);
    // Cups two and three: the record.
    choose(sim, 1);
    choose(sim, 2);
    sim.run(['skip']);
    for (const f of ['side.tea.accepted', 'side.tea.done']) expect(flags.isSet(f), f).toBe(true);
    expect(flags.isSet('side.tea.cup_0')).toBe(false);
    const parts = stabilityParts(flags, STABILITY_HOUSES);
    expect(parts.find((p) => p.id === 'rosalind_tea')?.value).toBe(1);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('tea');
  });

  it('lost (one cup or none), she sends the envoy away for another pot', () => {
    const sim = kingsmereDawn();
    const flags = sim.logic.state.flags;
    sim.run(['goto 24,5', 'goto 9,5', 'up', 'confirm']);
    choose(sim, 0);
    choose(sim, 0);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet('side.tea.done')).toBe(false);
    sim.run(['confirm']);
    choose(sim, 0);
    choose(sim, 1);
    choose(sim, 1);
    choose(sim, 2);
    sim.run(['skip']);
    expect(flags.isSet('side.tea.done')).toBe(true);
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
