// Battles (engine/battle.ts): turn order, damage, Gianna's discount, Anissa's Spark, Surge and Light,
// the boar's warning, The Heir Rises, rewards, and that the first battle is winnable but not trivial.

import { describe, expect, it } from 'vitest';
import { ANISSA_SP_SHARE, ELEMENT_WEAK, STATUS, SURGE_COST, SURGE_MULT } from '../src/config.ts';
import { BATTLES, ENEMIES, MOVES, SKILLS, SKILL_BOOK } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, reachable, battleItems, battleParty, enemyStats, settleBattle, skillCost, turnDelay, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
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

function yari(over: Partial<PartyEntry> = {}): PartyEntry {
  return {
    id: 'yari',
    name: 'Yari',
    look: 'yari',
    level: 1,
    stats: { hp: 50, sp: 30, atk: 12, def: 7, mag: 6, spd: 13 },
    skills: [...MOVES.yari!, ...SKILLS.yari!],
    specials: [],
    anissaBond: false,
    ...over,
  };
}

/** Run the battle until `who` has the turn (others guard). */
function until(b: Battle, who: string): void {
  for (let i = 0; i < 20 && b.actor?.key !== who && !b.outcome; i++) b.act({ kind: 'guard' });
}

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
    const party = battleParty(flags, RPG, SKILL_BOOK);
    expect(party.map((p) => p.id)).toEqual(['gianna']);
    expect(party[0]!.anissaBond).toBe(true);
    expect(party[0]!.stats.mag).toBe(14 + 3 + 1); // base + staff + robe
    flags.set('item.sun_charm', 1);
    flags.set('equip.gianna.charm', 'sun_charm');
    expect(battleParty(flags, RPG, SKILL_BOOK)[0]!.specials.map((s) => s.kind)).toEqual(['regen']);
  });

  it('winning pays XP, gold and the boar-tusk charm once, marks the Foes page, and takes the soups used', () => {
    const flags = new FlagStore({ 'party.anissa': true, 'item.soup_pot': 2 });
    const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), [boar], battleItems(flags, RPG), { seed: 42 });
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

describe('targets, statuses and elements', () => {
  const twoBoars = () => {
    const b = new Battle(def, [gianna(), yari()], [boar, boar], [soup], { seed: 21 });
    b.start();
    return b;
  };

  it('two of the same foe are told apart, and Arrow Rain hits every living foe once', () => {
    const b = twoBoars();
    expect(b.enemies.map((e) => e.name)).toEqual(['Cane-field boar A', 'Cane-field boar B']);
    until(b, 'yari');
    const ev = b.act({ kind: 'skill', skill: 'arrow_rain' });
    const struck = ev.filter((e) => (e.kind === 'damage' || e.kind === 'miss') && e.from === 'yari').map((e) => (e as { to: string }).to);
    expect(struck.sort()).toEqual(['boar#1', 'boar#2']);
    expect(ev.find((e) => e.kind === 'use')).toMatchObject({ who: 'yari', name: 'Arrow Rain', targets: ['boar#1', 'boar#2'] });
  });

  it('Volley looses three arrows at random foes', () => {
    const b = twoBoars();
    until(b, 'yari');
    const ev = b.act({ kind: 'skill', skill: 'volley' });
    expect(ev.filter((e) => (e.kind === 'damage' || e.kind === 'miss') && e.from === 'yari').length).toBe(3);
  });

  it('Limyè pou Tout heals the whole party; a one-target heal can pick an ally', () => {
    const b = twoBoars();
    until(b, 'gianna');
    b.find('gianna')!.hp = 10;
    b.find('yari')!.hp = 10;
    const ev = b.act({ kind: 'skill', skill: 'limye_pou_tout' });
    const healed = ev.filter((e) => e.kind === 'heal' && e.source === 'Limyè pou Tout').map((e) => (e as { to: string }).to);
    expect(healed.sort()).toEqual(['gianna', 'yari']);
    until(b, 'gianna');
    b.find('yari')!.hp = 5;
    const one = b.act({ kind: 'skill', skill: 'limye_elodie', target: 'yari' });
    expect(one.some((e) => e.kind === 'heal' && e.to === 'yari' && e.hp > 0)).toBe(true);
  });

  it('a skill cannot aim at the wrong side', () => {
    const b = twoBoars();
    until(b, 'gianna');
    expect(b.act({ kind: 'skill', skill: 'sunthread', target: 'yari' })).toEqual([]);
    expect(b.act({ kind: 'skill', skill: 'limye_elodie', target: boarKey })).toEqual([]);
  });

  it('Inspired raises damage dealt by a quarter, lasts the target\'s next 3 turns, then wears off', () => {
    const b = twoBoars();
    until(b, 'gianna');
    const ev = b.act({ kind: 'skill', skill: 'benediksyon', target: 'yari' });
    expect(ev).toContainEqual({ kind: 'status', to: 'yari', status: 'inspired', on: true });
    expect(b.find('yari')!.statuses).toEqual([{ id: 'inspired', turns: STATUS.inspired.turns, fresh: false }]);
    let off = false;
    let yariTurns = 0;
    for (let i = 0; i < 20 && !off && !b.outcome; i++) {
      if (b.actor?.key === 'yari') yariTurns++;
      off = b.act({ kind: 'guard' }).some((e) => e.kind === 'status' && e.to === 'yari' && !e.on);
    }
    expect(off).toBe(true);
    expect(yariTurns).toBe(3);
  });

  it('Marked makes a foe take a quarter more; Inspired makes its target deal a quarter more', () => {
    const plain = twoBoars();
    const marked = twoBoars();
    const foe = marked.find(boarKey)!;
    foe.statuses.push({ id: 'marked', turns: 3, fresh: false });
    until(plain, 'gianna');
    until(marked, 'gianna');
    const d = (b: Battle) => (b.act({ kind: 'skill', skill: 'sunthread', target: boarKey }).find((e) => e.kind === 'damage') as { amount: number }).amount;
    const a = d(plain);
    const m = d(marked);
    expect(m / a).toBeGreaterThan(1.1);
    expect(m / a).toBeLessThan(1.4);
  });

  it('a foe weak to an element takes half again from it, and the hit says so', () => {
    const weakBoar = { ...boar, weak: ['light' as const] };
    const b = new Battle(def, [gianna()], [weakBoar], [soup], { seed: 21 });
    const c = new Battle(def, [gianna()], [boar], [soup], { seed: 21 });
    b.start();
    c.start();
    const hit = (x: Battle) => x.act({ kind: 'skill', skill: 'sunthread', target: boarKey }).find((e) => e.kind === 'damage') as Extract<BattleEvent, { kind: 'damage' }>;
    const w = hit(b);
    const n = hit(c);
    expect(w.affinity).toBe(1);
    expect(w.element).toBe('light');
    expect(w.amount / n.amount).toBeCloseTo(ELEMENT_WEAK, 0);
  });

  it('items can be given to any ally and say what was used', () => {
    const b = twoBoars();
    until(b, 'gianna');
    b.find('yari')!.hp = 5;
    const ev = b.act({ kind: 'item', item: 'soup_pot', target: 'yari' });
    expect(ev[0]).toMatchObject({ kind: 'use', who: 'gianna', item: 'soup_pot', targets: ['yari'] });
    expect(b.find('yari')!.regenHp).toBe(Math.ceil(40 / 3)); // (Yari's own turn may already have taken the first sip)
  });
});

describe('four at a time: swapping, the front row, area attacks', () => {
  const member = (id: string, row: 'front' | 'back', hp = 60): PartyEntry => ({
    id,
    name: id,
    look: id,
    level: 1,
    stats: { hp, sp: 10, atk: 10, def: 6, mag: 4, spd: 10 },
    skills: [],
    specials: [],
    anissaBond: false,
    row,
  });
  const five = () => [gianna({ row: 'back' }), yari({ row: 'back' }), member('azzy', 'front'), member('bayarmaa', 'front'), member('haru', 'back')];

  it('only the first four fight; the fifth waits and never takes a turn', () => {
    const b = new Battle(def, five(), [boar], [], { seed: 3 });
    b.start();
    expect(b.fighters.map((c) => c.key)).toEqual(['gianna', 'yari', 'azzy', 'bayarmaa']);
    expect(b.bench.map((c) => c.key)).toEqual(['haru']);
    for (let i = 0; i < 12 && !b.outcome; i++) {
      expect(b.actor?.key).not.toBe('haru');
      b.act({ kind: 'guard' });
    }
    expect(b.upcoming(8).some((c) => c.key === 'haru')).toBe(false);
  });

  it('Swap trades the fighter whose turn it is for one who is waiting, in the same place', () => {
    const b = new Battle(def, five(), [boar], [], { seed: 3 });
    b.start();
    until(b, 'yari');
    const ev = b.act({ kind: 'swap', with: 'haru' });
    expect(ev[0]).toEqual({ kind: 'swap', out: 'yari', in: 'haru', forced: false });
    expect(b.fighters.map((c) => c.key)).toEqual(['gianna', 'haru', 'azzy', 'bayarmaa']);
    expect(b.act({ kind: 'swap', with: 'nobody' })).toEqual([]);
  });

  it('a fallen fighter is replaced by the next one waiting; the fight is lost only when everyone is down', () => {
    const party = [member('a', 'front', 1), member('b', 'front', 1), member('c', 'front', 1), member('d', 'front', 1), member('e', 'front', 1)];
    const b = new Battle(def, party, [boar], [], { seed: 8 });
    const all = [...b.start()];
    for (let i = 0; i < 30 && !b.outcome; i++) all.push(...b.act({ kind: 'guard' }));
    expect(all.some((e) => e.kind === 'swap' && e.forced && e.in === 'e')).toBe(true);
    expect(b.outcome).toBe('lost');
    expect(b.party.every((c) => c.down)).toBe(true);
  });

  it("a foe's one-target attack reaches the back row only when no one stands in the front", () => {
    const b = new Battle(def, five(), [boar], [], { seed: 3 });
    const fighters = b.fighters;
    expect(reachable(fighters).map((c) => c.key)).toEqual(['azzy', 'bayarmaa']);
    fighters.find((c) => c.key === 'azzy')!.down = true;
    fighters.find((c) => c.key === 'bayarmaa')!.down = true;
    expect(reachable(fighters.filter((c) => !c.down)).map((c) => c.key)).toEqual(['gianna', 'yari']);
    // In play: the boar only ever hits the front row while it stands.
    const c = new Battle(def, five(), [boar], [], { seed: 5 });
    const ev = [...c.start()];
    for (let i = 0; i < 12 && !c.outcome; i++) ev.push(...c.act({ kind: 'guard' }));
    const struck = new Set(ev.filter((e) => (e.kind === 'damage' || e.kind === 'miss') && e.from === 'boar#1').map((e) => (e as { to: string }).to));
    expect([...struck].every((k) => k === 'azzy' || k === 'bayarmaa')).toBe(true);
    expect(struck.size).toBeGreaterThan(0);
  });

  it('an area attack hits every fighter, front and back', () => {
    const stomper = { ...boar, moves: [{ name: 'Stampede', power: 40, area: true }] };
    const b = new Battle(def, five(), [stomper], [], { seed: 3 });
    const ev = [...b.start()];
    for (let i = 0; i < 6 && !b.outcome; i++) ev.push(...b.act({ kind: 'guard' }));
    const struck = new Set(ev.filter((e) => (e.kind === 'damage' || e.kind === 'miss') && e.move === 'Stampede').map((e) => (e as { to: string }).to));
    expect(struck).toEqual(new Set(['gianna', 'yari', 'azzy', 'bayarmaa']));
  });
});

describe('the boar fight tutorial (owner, Oct 15)', () => {
  it('teaches fighting, skills, Anissa (passive and Surge), rows and gear, and the spoils after', async () => {
    const { BATTLES } = await import('../src/data/battles.ts');
    const t = BATTLES.intro_boar!.tutorial!;
    const all = t.start.map((p) => `${p.title}: ${p.text}`).join(' ');
    for (const word of ['target', 'Skill', 'SP', 'Guard', 'Item', 'Spark', 'Surge', "Anissa's Light", 'Swap', 'Equip', 'Spells']) expect(all).toContain(word);
    expect(t.after?.[0]?.text).toContain('Equip');
    for (const p of [...t.start, ...(t.after ?? [])]) expect(p.text.length, p.title).toBeLessThanOrEqual(230);
  });
});
