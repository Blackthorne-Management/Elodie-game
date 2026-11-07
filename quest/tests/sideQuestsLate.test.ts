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
import { evaluate } from '../src/engine/conditions.ts';
import { Sim, parseRoute } from '../src/engine/sim.ts';
import { ASHES } from '../src/data/kuroshi.ts';
import { CARAVAN } from '../src/data/jwaladesh.ts';
import { FLEET } from '../src/data/skarragol.ts';
import { RACE_FLAGS } from '../src/data/dialogue/skarragolQuests.ts';
import { gold, standingFlag } from '../src/engine/rpg.ts';
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
  'act6.complete': true,
  'act7.complete': true,
  'act8.complete': true,
  'act9.complete': true,
  'story.bell_claim': true,
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
    // Chapter 1's secret (Z-4) and the bakery (Z-5, data/sideQuests.ts) count too: a player who does everything does them.
    1: xpOf('seventh_stone') + xpOf('no_debt'),
    // Chapter 3: the feast (and its blades, the Fear route's fight) and the old lord's errand; Ar-5 is at the camp,
    // after the chapter's end, so it counts from Chapter 4.
    3: LATE_XP.feast + BATTLES.feast_blades!.rewards.xp + LATE_XP.oldErrand,
    // Chapter 4: the saffron (and its raiders), the uncashed note, the invoice (and the factor's guards).
    4: LATE_XP.arrows + LATE_XP.saffron + BATTLES.saffron_raiders!.rewards.xp + LATE_XP.uncashed + LATE_XP.invoice + BATTLES.factor_guards!.rewards.xp,
    // Chapter 6: Salkhi's opinions, the race, the cairn and S-2's chiefs (built Nov 4; no fights of their own).
    6: LATE_XP.salkhi + LATE_XP.race + LATE_XP.cairn + LATE_XP.fleet,
    7: LATE_XP.notASpy + LATE_XP.letterFloor,
    // K-5 (built Nov 4) is accepted in Chapter 7 and paid in Chapter 8, when the letter is delivered.
    // J-5 (built Nov 4) and its two fights on the salt road.
    8: LATE_XP.argue + LATE_XP.littleLamps + bouts + LATE_XP.ashes + LATE_XP.jackals + BATTLES.caravan_jackals!.rewards.xp + BATTLES.caravan_toll!.rewards.xp,
    9: LATE_XP.sorry + LATE_XP.patientHour + LATE_XP.tea,
    // Se-4 is won in Chapter 12 (before the bell): it needs Chapter 9's record.
    12: LATE_XP.ribbon,
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

describe('K-5 Ashes of the Temple (the Suzumori elder, Kayla\'s desk fifty years ago, Meera\'s Court)', () => {
  /** Kirinoura at dawn, out of the Hall and into the Lantern Library. */
  function library(): Sim {
    const sim = simAt('kirinoura-petition');
    settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
    sim.run(['goto 17,25', 'goto 5,10']);
    expect(sim.logic.map.id).toBe('kuroshi-library');
    return sim;
  }

  it('the elder shows her Crown paper; the memory at Kayla\'s desk shows the forger\'s seal; she writes her letter', () => {
    const sim = library();
    const flags = sim.logic.state.flags;
    const q = quest('ashes');
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    sim.run(['goto 13,4', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // Asked again before the memory, she only points at the desk.
    sim.run(['confirm', 'skip']);
    expect(flags.isSet(ASHES.letter)).toBe(false);
    // Kayla's desk, fifty years ago: the agent brings the dispatch in, Patricio sees the nick.
    sim.run(['goto 9,8', 'echo', 'skip']);
    expect(sim.logic.era).toBe('echo');
    expect(flags.isSet(ASHES.seal)).toBe(true);
    sim.run(['echo']);
    expect(sim.logic.era).toBe('present');
    // Back to the elder: the same nick in her wax, and the letter.
    sim.run(['goto 13,4', 'up', 'confirm', 'skip']);
    expect(flags.isSet(ASHES.letter)).toBe(true);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // Nothing is paid in Kirinoura: the quest is done in Agnipur.
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('ashes');
    // The trader sails with the letter in hand: still open; without it, closed.
    expect(sideQuestStatus(new FlagStore({ ...flags.snapshot(), 'act7.complete': true }), q)).toBe('active');
    expect(sideQuestStatus(new FlagStore({ ...flags.snapshot(), 'act7.complete': true, [ASHES.letter]: false }), q)).toBe('closed');
  });

  it('the memory opens for K-5 alone, for a player who never took K-2 (Nov 7: the zone asked for K-2)', () => {
    const sim = library();
    const flags = sim.logic.state.flags;
    flags.clear('side.spy_ledger.accepted');
    sim.run(['goto 13,4', 'up', 'confirm', 'skip']);
    expect(flags.isSet(ASHES.accepted)).toBe(true);
    sim.run(['goto 9,8', 'echo', 'skip']);
    expect(sim.logic.era).toBe('echo');
    expect(flags.isSet(ASHES.seal)).toBe(true);
  });

  it('the library\'s memory is K-2\'s again once the seal is seen, and never K-5\'s before it is asked for', () => {
    const sim = library();
    const flags = sim.logic.state.flags;
    sim.run(['goto 9,8', 'echo', 'skip']);
    expect(flags.isSet(ASHES.seal)).toBe(false);
  });

  it('Meera reads the letter at dawn; +40 XP, +1 Influence in Jwaladesh and in Kuroshi, paid once', () => {
    const sim = agnipurDawn();
    const flags = sim.logic.state.flags;
    // The letter as Chapter 7 leaves it (the test above).
    for (const fl of [ASHES.accepted, ASHES.seal, ASHES.letter]) flags.set(fl, true);
    const q = quest('ashes');
    expect(sideQuestStatus(flags, q)).toBe('active');
    sim.run(['goto 21,0']);
    expect(sim.logic.map.id).toBe('jwaladesh-court');
    const kuroshi = localPillar(flags, RPG, 'influence', 'kuroshi');
    const jwaladesh = localPillar(flags, RPG, 'influence', 'jwaladesh');
    sim.run(['goto 16,6', 'up', 'confirm', 'skip']);
    expect(flags.isSet(ASHES.done)).toBe(true);
    expect(flags.isSet(ASHES.letter)).toBe(false);
    expect(sideQuestStatus(flags, q)).toBe('done');
    expect(localPillar(flags, RPG, 'influence', 'kuroshi') - kuroshi).toBe(1);
    const xp = sharedXp(flags, RPG);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('ashes');
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.ashes);
    expect(localPillar(flags, RPG, 'influence', 'jwaladesh') - jwaladesh).toBe(1);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('ashes');
    // Meera after: her usual line.
    sim.run(['confirm', 'skip']);
    expect(flags.isSet(ASHES.done)).toBe(true);
  });

  it('closes when the trader sails from Agnipur undelivered; never offered after Kirinoura if never asked', () => {
    const q = quest('ashes');
    expect(sideQuestStatus(new FlagStore({ [ASHES.accepted]: true, [ASHES.letter]: true, 'act7.complete': true, 'act8.complete': true }), q)).toBe('closed');
    const never = new FlagStore({ 'story.quarter_dawn': true, 'party.haru': true, 'act7.complete': true });
    expect(sideQuestStatus(never, q)).toBe('unknown');
    expect(evaluate(q.available!, never)).toBe(false);
  });

  /** Walk up to the temple feud at the Muster and join it; every line up to the first round's choice. */
  function joinFeud(done: boolean): { sim: Sim; seen: string[] } {
    const sim = simAt('muster-blessing');
    if (done) sim.logic.state.flags.set(ASHES.done, true);
    sim.run(['goto 16,4', 'right', 'confirm']);
    choose(sim, 1);
    const seen: string[] = [];
    for (let i = 0; i < 20 && sim.logic.mode === 'dialogue'; i++) {
      const v = sim.logic.view();
      if (v.kind === 'end') break;
      seen.push(v.text);
      if (v.kind === 'choice') break;
      sim.run(['confirm']);
    }
    return { sim, seen };
  }

  it('at the Muster, done, the temple feud starts at round 2 with round 1 won: one strong answer wins it', () => {
    const { sim, seen } = joinFeud(true);
    expect(seen).toContain('Round 2 of 3.');
    expect(seen).not.toContain('Round 1 of 3.');
    expect(seen.join(' ')).toContain('elder\'s letter');
    const pick = (start: string) => {
      const v = sim.logic.view();
      if (v.kind !== 'choice') throw new Error('no choice');
      const k = v.choices.findIndex((ch) => ch.text.startsWith(start));
      expect(k, start).toBeGreaterThanOrEqual(0);
      sim.run([...(k > 0 ? [`down*${k}`] : []), 'confirm']);
      for (let i = 0; i < 20 && sim.logic.mode === 'dialogue' && sim.logic.view().kind !== 'choice'; i++) sim.run(['confirm']);
    };
    // Round 2: Compassion lands (2); round 3: Scripture only splits the crowd (1). One round won here, one by the letter.
    pick('Compassion');
    pick('Scripture');
    sim.run(['skip']);
    expect(sim.logic.state.flags.isSet('debate.zetwal_feud_temple.won')).toBe(true);
  });

  it('without it, the feud starts at round 1 as before', () => {
    const { seen } = joinFeud(false);
    expect(seen).toContain('Round 1 of 3.');
  });
});

describe('S-2 The Fleet for Sale (Ordvik at dawn: three chiefs, the race, the Throne\'s promise)', () => {
  /** Ordvik at dawn, the price made: the party in the Moot, by the chieftain's seat. */
  function moot(): Sim {
    const sim = simAt('ordvik-horn');
    settleRewards(sim.logic.state.flags, RPG, SIDE_QUESTS);
    expect(sim.logic.map.id).toBe('skarragol-moot');
    expect(sim.logic.state.flags.isSet('ally.skarragol')).toBe(true);
    return sim;
  }
  const accept = (sim: Sim) => {
    sim.run(['goto 14,4', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
  };
  const hrafn = (sim: Sim) => sim.run(['goto 20,5', 'right', 'confirm', 'skip']);

  it('the lawspeaker offers it only after the price; Hrafn takes the envoy\'s word on Ordvik\'s regard', () => {
    const sim = moot();
    const flags = sim.logic.state.flags;
    const q = quest('fleet');
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    expect(evaluate(q.available!, new FlagStore({ 'party.bayarmaa': true, 'story.standard_planted': true }))).toBe(false);
    // Hrafn before it is asked: his usual line.
    hrafn(sim);
    expect(flags.isSet(FLEET.hrafn)).toBe(false);
    accept(sim);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // The route's envoy has read Ordvik's sagas: Influence 16 in Skarragol, over the 12 he wants.
    hrafn(sim);
    expect(flags.get(standingFlag('influence', 'skarragol'))).toBeGreaterThanOrEqual(FLEET.influence);
    expect(flags.isSet(FLEET.hrafn)).toBe(true);
    expect(flags.isSet('standing.read')).toBe(false);
  });

  it('an envoy Ordvik does not know is refused until she is known, or feared', () => {
    const sim = moot();
    const flags = sim.logic.state.flags;
    accept(sim);
    // No sagas read: Influence 5 in Skarragol (the choices only), Fear 0.
    for (const k of Object.keys(flags.snapshot())) if (k.startsWith('lore.skarragol_')) flags.set(k, false);
    hrafn(sim);
    expect(flags.get(standingFlag('influence', 'skarragol'))).toBeLessThan(FLEET.influence);
    expect(flags.isSet(FLEET.hrafn)).toBe(false);
    // Every Fear choice Ordvik offers (the bout in white won, Grimvald broken): Fear 3.
    flags.set('side.grandson.bout_won', true);
    flags.set('choice.grimvald_broken', true);
    hrafn(sim);
    expect(flags.get(standingFlag('fear', 'skarragol'))).toBe(FLEET.fear);
    expect(flags.isSet(FLEET.hrafn)).toBe(true);
  });

  it('Ingrid on the quay, Samira\'s letter; Khulan after the race; the hides; +3 Wealth (Skarragol) once, no XP', () => {
    const sim = moot();
    const flags = sim.logic.state.flags;
    const q = quest('fleet');
    accept(sim);
    hrafn(sim);
    // Out to the quay: Jarl Ingrid by her hulls, and Samira's letter (the first answer with Samira in the party).
    sim.run(['goto 17,25', 'goto 10,0']);
    expect(sim.logic.map.id).toBe('skarragol-quay');
    const purse = gold(flags, RPG);
    sim.run(['goto 6,9', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet(FLEET.ingrid)).toBe(true);
    expect(gold(flags, RPG)).toBe(purse);
    // Back to the fair: Khulan wants the race won first.
    sim.run(['goto 10,13']);
    expect(sim.logic.map.id).toBe('skarragol-fair');
    sim.run(['goto 16,24', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FLEET.khulan)).toBe(false);
    // The race (built Oct 27), as it is: the judge by the corral, the stride tapped right.
    sim.run(['goto 12,24', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sim.rhythms.at(-1)).toBe('salkhi_race');
    expect(flags.isSet(RACE_FLAGS.won)).toBe(true);
    sim.run(['goto 16,24', 'up', 'confirm', 'skip']);
    expect(flags.isSet(FLEET.khulan)).toBe(true);
    // Back to the Moot: the lawspeaker cuts the three into the hides.
    sim.run(['goto 22,9']);
    expect(sim.logic.map.id).toBe('skarragol-moot');
    const wealth = localPillar(flags, RPG, 'wealth', 'skarragol');
    const xp = sharedXp(flags, RPG);
    sim.run(['goto 14,4', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('done');
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toEqual(expect.arrayContaining(['fleet', 'race']));
    expect(localPillar(flags, RPG, 'wealth', 'skarragol') - wealth).toBe(3 + 1); // S-2's three, the race's one
    expect(sharedXp(flags, RPG) - xp).toBe(LATE_XP.fleet);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('fleet');
  });

  it('without Samira, Ingrid takes 300 gold; it closes when the longship sails', () => {
    const sim = moot();
    const flags = sim.logic.state.flags;
    accept(sim);
    flags.set('party.samira', false);
    sim.run(['goto 17,25', 'goto 10,0']);
    const purse = gold(flags, RPG);
    sim.run(['goto 6,9', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(flags.isSet(FLEET.ingrid)).toBe(true);
    expect(purse - gold(flags, RPG)).toBe(FLEET.gold);
    const q = quest('fleet');
    expect(sideQuestStatus(new FlagStore({ ...flags.snapshot(), 'act6.complete': true }), q)).toBe('closed');
  });
});

describe('J-5 Jackals on the Salt Road (Agnipur at dawn: the salt caravan, the den, the toll)', () => {
  it('the board at dawn; the caravan walks ahead stop by stop; two real fights; the master pays at the gate, once', () => {
    const sim = agnipurDawn();
    const flags = sim.logic.state.flags;
    const q = quest('jackals');
    expect(sideQuestStatus(flags, q)).toBe('unknown');
    sim.run(['goto 19,14', 'up', 'confirm']);
    choose(sim, 0);
    sim.run(['skip']);
    expect(sideQuestStatus(flags, q)).toBe('active');
    // Out through the salt gate to the road's end: the master sets out, and walks on ahead.
    sim.run(['goto 43,14']);
    expect(sim.logic.map.id).toBe('jwaladesh-saltflats');
    const npcsAt = () => sim.logic.map.npcs.filter((n) => evaluate(n.if, flags) && n.npc.startsWith('salt_')).map((n) => `${n.npc}@${n.pos.x},${n.pos.y}`);
    expect(npcsAt()).toEqual(['salt_master@38,12', 'salt_mule_a@39,12', 'salt_mule_b@40,12']);
    sim.run(['goto 38,13', 'up', 'confirm', 'skip']);
    expect(flags.isSet(CARAVAN.setOut)).toBe(true);
    expect(npcsAt()).toEqual(['salt_master@31,12', 'salt_mule_a@32,12', 'salt_mule_b@33,12']);
    // Behind them, under the den: the jackals.
    const before = { gold: gold(flags, RPG), xp: sharedXp(flags, RPG), wealth: localPillar(flags, RPG, 'wealth', 'jwaladesh') };
    sim.run(['goto 34,13', 'skip']);
    expect(sim.battles.at(-1)).toBe('caravan_jackals');
    expect(flags.isSet(CARAVAN.jackals)).toBe(true);
    expect(npcsAt()).toEqual(['salt_master@15,12', 'salt_mule_a@16,12', 'salt_mule_b@17,12']);
    // Past the Crown's oil-cart: the Seth's unpaid enforcers.
    sim.run(['goto 18,13', 'skip']);
    expect(sim.battles.at(-1)).toBe('caravan_toll');
    expect(flags.isSet(CARAVAN.toll)).toBe(true);
    expect(npcsAt()).toEqual(['salt_master@4,12', 'salt_mule_a@5,12', 'salt_mule_b@6,12']);
    // At the salt gate the master pays, and the caravan walks into the city.
    sim.run(['goto 4,13', 'up', 'confirm', 'skip']);
    expect(sideQuestStatus(flags, q)).toBe('done');
    expect(npcsAt()).toEqual([]);
    const fights = BATTLES.caravan_jackals!.rewards;
    const toll = BATTLES.caravan_toll!.rewards;
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).toContain('jackals');
    expect(gold(flags, RPG) - before.gold).toBe(450 + fights.gold + toll.gold);
    expect(sharedXp(flags, RPG) - before.xp).toBe(LATE_XP.jackals + fights.xp + toll.xp);
    expect(localPillar(flags, RPG, 'wealth', 'jwaladesh') - before.wealth).toBe(1);
    expect(settleRewards(flags, RPG, SIDE_QUESTS).map((x) => x.id)).not.toContain('jackals');
    // The board after.
    sim.run(['goto 0,13']);
    expect(sim.logic.map.id).toBe('jwaladesh-bazaar');
  });

  it('a party that walks round the road still meets each ambush (the line runs the flats\' whole height)', () => {
    const maps2 = loadMaps();
    const flats = maps2['jwaladesh-saltflats']!;
    for (const id of ['caravan_jackals', 'caravan_toll']) {
      const t = flats.triggers.find((x) => x.dialogue === id)!;
      expect(t.area.height, id).toBe(flats.height);
      expect(t.area.y, id).toBe(0);
    }
  });

  it('is offered only at dawn, and closes when the trader sails', () => {
    const q = quest('jackals');
    expect(evaluate(q.available!, new FlagStore({ 'story.court_heard': true }))).toBe(false);
    expect(evaluate(q.available!, new FlagStore({ 'story.dhanraj_beaten': true }))).toBe(true);
    expect(sideQuestStatus(new FlagStore({ [CARAVAN.accepted]: true, [CARAVAN.setOut]: true, 'act8.complete': true }), q)).toBe('closed');
  });
});
