// Battles (engine/battle.ts): turn order, damage, Gianna's discount, Anissa's Spark, Surge and Light,
// the boar's warning, The Heir Rises, rewards, and that the first battle is winnable but not trivial.

import { describe, expect, it } from 'vitest';
import { ANISSA_SP_SHARE, SURGE_COST, SURGE_MULT } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILLS } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, battleParty, enemyStats, settleBattle, skillCost, turnDelay, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
import { encounterFlag } from '../src/engine/encounterFlags.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { gold, itemCount, xp } from '../src/engine/rpg.ts';

const def = BATTLES.intro_boar!;
const boar = ENEMIES.boar!;

function gianna(over: Partial<PartyEntry> = {}): PartyEntry {
  return {
    id: 'gianna',
    name: 'Gianna',
    look: 'gianna',
    level: 1,
    stats: { hp: 42, sp: 34, atk: 6, def: 7, mag: 18, spd: 9 },
    skills: SKILLS.gianna!,
    specials: [],
    anissaBond: true,
    ...over,
  };
}

const soup = { id: 'soup_pot', name: 'Clay-pot soup', count: 2, heals: 40, overTurns: 3 };

function newBattle(seed = 1, party = [gianna()]): Battle {
  const b = new Battle(def, party, [boar], [soup], { seed });
  b.start();
  return b;
}

const boarKey = 'boar#1';

describe('battle rules', () => {
  it('a faster fighter waits less between turns', () => {
    expect(turnDelay(13)).toBeLessThan(turnDelay(9));
    expect(turnDelay(9)).toBe(31);
  });

  it('enemy stats follow the level line and role, softened by Story difficulty', () => {
    expect(enemyStats(boar)).toEqual({ hp: 55, atk: 17, def: 9, mag: 7, spd: 8 });
    const b = newBattle();
    expect(b.find(boarKey)!.maxHp).toBe(44);
  });

  it("Gianna's skills cost a quarter less SP (rounded down, at least 1)", () => {
    const [sunthread, heal] = SKILLS.gianna!;
    expect(skillCost(sunthread!, { anissaBond: true })).toBe(3);
    expect(skillCost(heal!, { anissaBond: true })).toBe(4);
    expect(skillCost(sunthread!, { anissaBond: false })).toBe(5);
  });

  it('the same seed plays the same battle', () => {
    const run = (seed: number) => {
      const b = newBattle(seed);
      const out: number[] = [];
      for (let i = 0; i < 4 && !b.outcome; i++) out.push(...b.act({ kind: 'attack', target: boarKey }).filter((e) => e.kind === 'damage').map((e) => (e as { amount: number }).amount));
      return out;
    };
    expect(run(7)).toEqual(run(7));
  });

  it("Spark grows by 1 when Gianna acts and 2 when she guards; Surge costs 5, is free, and multiplies her next hit", () => {
    const b = newBattle(3);
    b.act({ kind: 'guard' });
    expect(b.spark).toBe(2);
    b.act({ kind: 'guard' });
    b.act({ kind: 'attack', target: boarKey });
    expect(b.spark).toBe(SURGE_COST);
    const actor = b.actor;
    expect(b.canSurge()).toBe(true);
    b.act({ kind: 'surge' });
    expect(b.actor).toBe(actor); // a free action
    expect(b.spark).toBe(0);
    const events = b.act({ kind: 'skill', skill: 'sunthread', target: boarKey });
    const hit = events.find((e) => e.kind === 'damage' && e.from === 'gianna') as Extract<BattleEvent, { kind: 'damage' }>;
    expect(hit.surge).toBe(true);
    // A Sunthread without Surge does about 19; with it, about half again.
    expect(hit.amount).toBeGreaterThanOrEqual(Math.floor(17 * SURGE_MULT));
    expect(b.surgeArmed).toBe(false);
  });

  it("Anissa's Light gives Gianna back a fifth of her SP on every third turn", () => {
    const b = newBattle(5);
    let lights = 0;
    for (let i = 0; i < 6 && !b.outcome; i++) {
      const ev = b.act({ kind: 'guard' });
      lights += ev.filter((e) => e.kind === 'heal' && e.source === "Anissa's Light").length;
    }
    // Guarding spends nothing, so the light only shows once SP is below full: spend some first.
    const c = newBattle(5);
    c.find('gianna')!.sp = 0;
    const found: BattleEvent[] = [];
    for (let i = 0; i < 4 && !c.outcome; i++) found.push(...c.act({ kind: 'guard' }));
    const light = found.find((e) => e.kind === 'heal' && e.source === "Anissa's Light") as Extract<BattleEvent, { kind: 'heal' }>;
    expect(light.sp).toBe(Math.round(34 * ANISSA_SP_SHARE));
    expect(lights).toBe(0);
  });

  it('the boar warns before it charges, and Guard halves the charge', () => {
    const b = newBattle(11);
    const all: BattleEvent[] = [];
    for (let i = 0; i < 8 && !b.outcome; i++) all.push(...b.act({ kind: 'guard' }));
    const tell = all.findIndex((e) => e.kind === 'text' && e.text.includes('paws at the dirt'));
    const charge = all.findIndex((e) => (e.kind === 'damage' || e.kind === 'miss') && e.move === 'Charge');
    expect(tell).toBeGreaterThanOrEqual(0);
    expect(charge).toBeGreaterThan(tell);
    expect(all.some((e) => e.kind === 'text' && e.speaker === 'Anissa' && e.text.includes('Guard'))).toBe(true);
  });

  it('healing over time: the clay-pot soup heals across three turns', () => {
    const b = newBattle(2);
    b.find('gianna')!.hp = 5;
    b.act({ kind: 'item', item: 'soup_pot', target: 'gianna' });
    const heals: number[] = [];
    for (let i = 0; i < 4 && !b.outcome; i++) {
      for (const e of b.act({ kind: 'guard' })) if (e.kind === 'heal' && e.to === 'gianna') heals.push(e.hp);
    }
    expect(heals.slice(0, 3).every((h) => h === 14)).toBe(true);
    expect(b.items[0]!.count).toBe(1);
  });

  it('losing restarts with a Grudge (The Heir Rises), up to +30%', () => {
    let b = newBattle(4, [gianna({ stats: { hp: 1, sp: 0, atk: 1, def: 0, mag: 1, spd: 1 } })]);
    for (let i = 0; i < 10 && !b.outcome; i++) b.act({ kind: 'guard' });
    expect(b.outcome).toBe('lost');
    for (let i = 0; i < 5; i++) b = Battle.retry(b, [gianna()], [boar], [soup], 9 + i);
    expect(b.grudge).toBeCloseTo(0.3);
  });
});

describe('the first battle (the boar on the Cane Road)', () => {
  /** A plain strategy: guard on the warning, heal when low, Surge when ready, else Sunthread (or Attack). */
  function play(seed: number): { won: boolean; turns: number; hurt: number } {
    const b = new Battle(def, [gianna()], [boar], [soup], { seed });
    let events = b.start();
    let warned = false;
    let turns = 0;
    let lowest = 42;
    for (; turns < 60 && !b.outcome; turns++) {
      const me = b.find('gianna')!;
      lowest = Math.min(lowest, me.hp);
      warned = events.some((e) => e.kind === 'text' && e.text.includes('paws'));
      if (b.canSurge()) events = b.act({ kind: 'surge' });
      else if (warned) events = b.act({ kind: 'guard' });
      else if (me.hp < 16 && me.sp >= 4) events = b.act({ kind: 'skill', skill: 'limye_elodie', target: 'gianna' });
      else if (me.sp >= 3) events = b.act({ kind: 'skill', skill: 'sunthread', target: boarKey });
      else events = b.act({ kind: 'attack', target: boarKey });
    }
    return { won: b.outcome === 'won', turns, hurt: 42 - lowest };
  }

  it('is winnable at level 1 with a sensible plan on nearly every roll of the dice', () => {
    const runs = Array.from({ length: 40 }, (_, i) => play(100 + i));
    expect(runs.filter((r) => r.won).length).toBeGreaterThanOrEqual(38);
  });

  it('is not a pushover: the boar gets to hurt her, and it takes several turns', () => {
    const runs = Array.from({ length: 40 }, (_, i) => play(500 + i));
    const avgTurns = runs.reduce((n, r) => n + r.turns, 0) / runs.length;
    const avgHurt = runs.reduce((n, r) => n + r.hurt, 0) / runs.length;
    expect(avgTurns).toBeGreaterThanOrEqual(4);
    expect(avgHurt).toBeGreaterThanOrEqual(10);
  });

  it('the party comes from the save: stats with gear, skills, and the bond with Anissa', () => {
    const flags = new FlagStore({ 'party.anissa': true });
    const party = battleParty(flags, RPG, SKILLS);
    expect(party.map((p) => p.id)).toEqual(['gianna']);
    expect(party[0]!.anissaBond).toBe(true);
    expect(party[0]!.stats.mag).toBe(14 + 3 + 1); // base + staff + robe
    flags.set('item.sun_charm', 1);
    flags.set('equip.gianna.charm', 'sun_charm');
    expect(battleParty(flags, RPG, SKILLS)[0]!.specials.map((s) => s.kind)).toEqual(['regen']);
  });

  it('winning pays XP, gold and the boar-tusk charm once, marks the Foes page, and takes the soups used', () => {
    const flags = new FlagStore({ 'party.anissa': true, 'item.soup_pot': 2 });
    const b = new Battle(def, battleParty(flags, RPG, SKILLS), [boar], battleItems(flags, RPG), { seed: 42 });
    b.start();
    b.act({ kind: 'item', item: 'soup_pot', target: 'gianna' });
    for (let i = 0; i < 60 && !b.outcome; i++) {
      const me = b.find('gianna')!;
      b.act(me.sp >= 3 ? { kind: 'skill', skill: 'sunthread', target: boarKey } : { kind: 'attack', target: boarKey });
    }
    expect(b.outcome).toBe('won');
    const before = gold(flags, RPG);
    const r = settleBattle(flags, RPG, b);
    expect(r).toEqual({ xp: 40, gold: 12, items: [{ id: 'boar_tusk', n: 1 }] });
    expect(gold(flags, RPG)).toBe(before + 12);
    expect(xp(flags, RPG, 'gianna')).toBeGreaterThanOrEqual(40);
    expect(itemCount(flags, 'boar_tusk')).toBe(1);
    expect(itemCount(flags, 'soup_pot')).toBe(1);
    expect(flags.isSet(encounterFlag('wilds', 'boar', 'won'))).toBe(true);
  });
});
