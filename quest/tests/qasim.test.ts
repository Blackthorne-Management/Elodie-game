// Guildmaster Qasim in the guild vault (Chapter 4; the outline section 4 and its review 3.1 and 3.7): Hire Blades (a
// blade walks in every other turn, at most HIRE_CAP standing), Samira's Bribe (refunded on a hired blade, full price on
// the starting pair, refused by Qasim himself), the Golden Wall (damage halved, shattered by a Surge), Seize Assets
// (telegraphed), and his yield (his blades walk out with him; the fight is won). Then the balance targets the review
// asked for, played by a simple bot over many seeds: a real threat at level 10 without Guard, none at 12 with it (two under
// the outline's levels since the levels pass brought the route to his vault at 11: COMBAT 12.5).

import { describe, expect, it } from 'vitest';
import { BRIBE_GOLD_PER_LEVEL, HIRE_CAP, STATUS } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILLS, battleReserve } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, settleBattle, type BattleDef, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { playQasim } from './qasimBot.ts';

const def = BATTLES.qasim_vault!;

function fighter(id: string, over: Partial<PartyEntry> = {}): PartyEntry {
  return {
    id,
    name: id,
    look: id,
    level: 13,
    stats: { hp: 999, sp: 60, atk: 20, def: 60, mag: 24, spd: 10 },
    skills: [],
    specials: [],
    anissaBond: false,
    row: 'back',
    ...over,
  };
}
const samira = (over: Partial<PartyEntry> = {}) => fighter('samira', { skills: SKILLS.samira!, ...over });

/** Run until `who` has the turn (everyone else guards). */
function until(b: Battle, who: string, max = 80): BattleEvent[] {
  const out: BattleEvent[] = [];
  for (let i = 0; i < max && b.actor?.key !== who && !b.outcome; i++) out.push(...b.act({ kind: 'guard' }));
  return out;
}

describe("Qasim's fight is data", () => {
  it('a level-12 brute boss at 4x HP with two blades; the threat is in what he buys; 200 XP, Game Over applies', () => {
    const q = ENEMIES.qasim!;
    expect(q.level).toBe(12);
    expect(q.role).toBe('brute');
    expect(q.boss).toBe(true);
    expect(q.hpScale).toBeGreaterThanOrEqual(3);
    expect(q.hpScale).toBeLessThanOrEqual(4);
    expect(def.enemies).toEqual(['qasim', 'caravan_raider', 'caravan_raider']);
    expect(def.rewards.xp).toBe(200);
    expect(def.meantToLose).toBeUndefined();
    expect(def.endsWithBoss).toBe(true);
    expect(battleReserve(def)).toEqual({ caravan_raider: ENEMIES.caravan_raider });
    // No Fogged (not built): Sand Toss leaves the fighter Weakened.
    expect(ENEMIES.caravan_raider!.moves.flatMap((m) => m.statuses ?? [])).toEqual(['weakened']);
    // Anissa's tips are plain (review 3.11): no joke about money.
    expect(def.tips?.lowHp).toBe("Samira's Remedy costs gold, Gigi. It heals a lot.");
    // The damage Daftar no longer shares a name with Hire Blades (review 3.7).
    expect(SKILLS.samira!.map((s) => s.name)).not.toContain('Daftar: Hired Blade');
  });
});

describe('Hire Blades and Bribe', () => {
  it('a blade walks in, hired, every other turn of his; never more than HIRE_CAP hired ones standing', () => {
    const b = new Battle(def, [samira()], [ENEMIES.qasim!], [], { seed: 4, reserve: battleReserve(def) });
    const events = [...b.start()];
    for (let i = 0; i < 40 && !b.outcome; i++) {
      events.push(...b.act({ kind: 'guard' }));
      expect(b.enemies.filter((e) => e.hired && !e.down).length).toBeLessThanOrEqual(HIRE_CAP);
    }
    expect(events.filter((e) => e.kind === 'enter').length).toBe(HIRE_CAP);
    expect(b.enemies.filter((e) => e.hired)).toHaveLength(HIRE_CAP);
  });

  it("Bribe on a hired blade: he walks out and the purse comes back (the guild paid him first)", () => {
    const b = new Battle(def, [samira()], [ENEMIES.qasim!], [], { seed: 4, gold: 1000, reserve: battleReserve(def) });
    b.start();
    for (let i = 0; i < 40 && !b.enemies.some((e) => e.hired); i++) b.act({ kind: 'guard' });
    const hired = b.enemies.find((e) => e.hired)!;
    until(b, 'samira');
    const events = b.act({ kind: 'skill', skill: 'bribe', target: hired.key });
    expect(hired.down).toBe(true);
    expect(events.some((e) => e.kind === 'withdraw' && e.who === hired.key)).toBe(true);
    expect(b.goldSpent).toBe(0);
  });

  it('Bribe on a starting blade costs the full price (25 x her level); Qasim himself is not for sale', () => {
    const b = new Battle(def, [samira()], [ENEMIES.qasim!, ENEMIES.caravan_raider!], [], { seed: 5, gold: 1000, reserve: battleReserve(def) });
    b.start();
    until(b, 'samira');
    const blade = b.enemies.find((e) => e.enemyId === 'caravan_raider')!;
    b.act({ kind: 'skill', skill: 'bribe', target: blade.key });
    expect(blade.down).toBe(true);
    expect(blade.fells).toBe(0);
    expect(b.goldSpent).toBe(BRIBE_GOLD_PER_LEVEL * 13);
    until(b, 'samira');
    const qasim = b.enemies.find((e) => e.enemyId === 'qasim')!;
    const events = b.act({ kind: 'skill', skill: 'bribe', target: qasim.key });
    expect(qasim.down).toBe(false);
    expect(events.some((e) => e.kind === 'text' && e.text.includes('not for sale'))).toBe(true);
    expect(b.goldSpent).toBe(BRIBE_GOLD_PER_LEVEL * 13);
  });

  it('the purse that cannot pay greys Bribe out (it is never free)', () => {
    const b = new Battle(def, [samira()], [ENEMIES.qasim!, ENEMIES.caravan_raider!], [], { seed: 5, gold: 100, reserve: battleReserve(def) });
    b.start();
    until(b, 'samira');
    const bribe = b.actor!.skills.find((s) => s.id === 'bribe')!;
    expect(b.canUse(b.actor!, bribe)).toBe(false);
  });
});

describe('the Golden Wall, Seize Assets and the yield', () => {
  it('the wall halves the damage he takes for its turns; a Surge-powered blow shatters it', () => {
    expect(STATUS.gilded.taken).toBe(0.5);
    expect(STATUS.gilded.shatter).toBe(true);
    const runs = Array.from({ length: 30 }, (_, i) => playQasim(i + 1, 12, { guards: true, bribes: false }));
    const shattered = runs.filter((r) => r.shattered);
    expect(shattered.length).toBeGreaterThan(0);
    for (const r of shattered) {
      const at = r.events.findIndex((e) => e.kind === 'text' && e.text.includes('shatters'));
      // The wall comes off the moment it shatters.
      expect(r.events.slice(at - 3, at).some((e) => e.kind === 'status' && e.status === 'gilded' && !e.on)).toBe(true);
    }
  });

  it('Seize Assets is telegraphed a turn before it lands ("Guard, everyone!")', () => {
    const r = playQasim(3, 13, { guards: true, bribes: false });
    const tell = r.events.findIndex((e) => e.kind === 'text' && e.text.includes('Seize their assets'));
    const hit = r.events.findIndex((e) => (e.kind === 'damage' || e.kind === 'miss') && e.move === 'Seize Assets');
    expect(tell).toBeGreaterThan(-1);
    expect(hit).toBeGreaterThan(tell);
  });

  it('at 0 HP he yields: his line, his blades walk out with him, and the fight is won (the won flag, 200 XP)', () => {
    const r = playQasim(2, 14, { guards: true, bribes: false });
    expect(r.won).toBe(true);
    expect(r.events.some((e) => e.kind === 'text' && e.text === 'Enough. Enough! Name your fee.')).toBe(true);
    const flags = new FlagStore();
    const won = { def, items: battleItems(flags, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle;
    settleBattle(flags, RPG, won);
    expect(flags.isSet('encounter.aldoria_story.qasim.won')).toBe(true);
  });

  it('a boss yielding ends the fight even with hired blades still standing', () => {
    const solo: BattleDef = { ...def, phases: undefined };
    const b = new Battle(solo, [samira({ stats: { hp: 999, sp: 60, atk: 400, def: 60, mag: 24, spd: 40 }, skills: [] })], [{ ...ENEMIES.qasim!, hpScale: 0.2 }, ENEMIES.caravan_raider!], [], { seed: 1 });
    const events = [...b.start()];
    const qasim = b.enemies.find((e) => e.enemyId === 'qasim')!;
    for (let i = 0; i < 20 && !b.outcome; i++) events.push(...b.act({ kind: 'attack', target: qasim.down ? b.enemies.find((e) => !e.down)!.key : qasim.key }));
    expect(b.outcome).toBe('won');
    expect(events.filter((e) => e.kind === 'withdraw').length).toBe(2);
  });
});

describe('balance (review 3.1: a real threat, 20 to 30-odd actions, tuned with sims)', () => {
  const runs = (level: number, guards: boolean, gold = 0, n = 60) => Array.from({ length: n }, (_, i) => playQasim(i + 1, level, { guards, bribes: gold > 0 }, gold));
  const lost = (rs: ReturnType<typeof runs>) => rs.filter((r) => !r.won).length;
  const mean = (rs: ReturnType<typeof runs>) => rs.reduce((n, r) => n + r.actions, 0) / rs.length;

  it('at level 12, guarding on his tell, the party never loses', () => {
    expect(lost(runs(12, true))).toBe(0);
  });

  it('at level 10 without Guard he wins a measurable share (at least one fight in ten)', () => {
    expect(lost(runs(10, false))).toBeGreaterThanOrEqual(6);
  });

  it('at level 11 (where the route meets him) the fight lasts about 20 to 36 party actions', () => {
    const m = mean(runs(11, true));
    expect(m).toBeGreaterThanOrEqual(20);
    expect(m).toBeLessThanOrEqual(36);
  });

  it('with an empty purse (Tonic only) a careful party still wins at 11 (review 5.4)', () => {
    expect(lost(runs(11, true, 0))).toBeLessThanOrEqual(3);
  });

  it('with a full purse Samira bribes his hires and loses no gold to them', () => {
    const rs = runs(11, true, 1000, 20);
    expect(rs.some((r) => r.events.some((e) => e.kind === 'text' && e.text.includes('takes the purse')))).toBe(true);
    for (const r of rs) expect(r.goldSpent).toBe(0);
  });
});
