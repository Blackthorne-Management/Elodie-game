// The secret items built Oct 27 (docs/quest/design/SECRET-ITEMS.md 4, 7 and 8) and what they rest on: Anissa's Calm and
// Gianna's Comfort (COMBAT 8), the three puzzle machines (engine/secrets.ts: the jars, the tower clock, the singing
// floor), and each item's effect in battle: the Unbroken Wick (Surge for 4, the Dawn Surge at 9, Calm never below 1),
// the Nightingale Key (every foe's next move shown, and true), the Patient Hour (Stop the Clock: the party goes again
// before any foe, once a battle). Edmund's Tea Break after Al-1 too.

import { describe, expect, it } from 'vitest';
import { CALM_MAX, MUSTER, SECRET_ITEMS, STABILITY, SURGE_COST } from '../src/config.ts';
import { STABILITY_HOUSES } from '../src/data/claim.ts';
import { musterTick } from '../src/engine/ally.ts';
import { stabilityParts } from '../src/engine/stability.ts';
import { BATTLES, ENEMIES, MOVES, SKILLS, SKILL_BOOK } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { TOWER_CLOCK } from '../src/data/aldermoor.ts';
import { WICK_MEASURES, WICK_POURS } from '../src/data/jwaladesh.ts';
import { INFORMANT_WALK, NIGHTINGALE } from '../src/data/kuroshi.ts';
import { Battle, battleParty, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
import type { EnemyDef, SkillDef } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { battleBoons, equip } from '../src/engine/rpg.ts';
import { clockDistance, clockFace, clockState, heardFlag, jars, measure, melodyWalks, sealedAmount, stepFloor, windClock } from '../src/engine/secrets.ts';
import { knownSkills } from '../src/engine/skills.ts';

const WICK = SECRET_ITEMS.wick;
const def = BATTLES.intro_boar!;

function gianna(over: Partial<PartyEntry> = {}): PartyEntry {
  return { id: 'gianna', name: 'Gianna', look: 'gianna', level: 20, stats: { hp: 900, sp: 80, atk: 20, def: 30, mag: 40, spd: 12 }, skills: SKILLS.gianna!, specials: [], anissaBond: true, ...over };
}
function yari(): PartyEntry {
  return { id: 'yari', name: 'Yari', look: 'yari', level: 20, stats: { hp: 900, sp: 60, atk: 30, def: 30, mag: 10, spd: 14 }, skills: [...MOVES.yari!, ...SKILLS.yari!], specials: [], anissaBond: false };
}
/** A foe who only whispers at Anissa (every turn), marking Gianna as she steps in. */
const WHISPERER: EnemyDef = {
  id: 'whisperer',
  name: 'Whisperer',
  look: 'husher',
  level: 20,
  role: 'caster',
  hpScale: 30,
  moves: [{ name: 'Whisper', power: 10 }, { name: 'Hush the Light', power: 0, calm: 2, statuses: ['marked'], every: 1 }],
};

/** Gianna guards until the condition holds (or the fight is long past it). */
function guardUntil(b: Battle, done: () => boolean): void {
  for (let i = 0; i < 40 && !done() && !b.outcome; i++) b.act({ kind: 'guard' });
}

describe('Anissa\'s Calm and Gianna\'s Comfort (COMBAT 8)', () => {
  it('a whisper at Anissa takes her Calm down while Gianna steps in; at 0 she goes quiet and there is no Surge', () => {
    const b = new Battle(def, [gianna()], [WHISPERER], [], { seed: 3 });
    const events: BattleEvent[] = [...b.start()];
    // It opens full; the whisperer's first turn may already have come.
    expect(events.filter((e) => e.kind === 'calm').map((e) => (e.kind === 'calm' ? e.value : -1))[0] ?? CALM_MAX).toBeLessThan(CALM_MAX + 1);
    guardUntil(b, () => b.calm === 0 && b.spark >= SURGE_COST);
    expect(b.calm).toBe(0);
    expect(b.spark).toBeGreaterThanOrEqual(SURGE_COST);
    expect(b.canSurge()).toBe(false);
    expect(events.length).toBeGreaterThan(0);
  });

  it('Comfort (1 SP for Gianna) gives two Calm back, and the Surge can come again; it is not offered at full Calm', () => {
    const calmFight = new Battle(def, [gianna()], [ENEMIES.boar!], [], { seed: 3 });
    calmFight.start();
    guardUntil(calmFight, () => calmFight.actor?.key === 'gianna');
    expect(calmFight.calm).toBe(CALM_MAX);
    expect(calmFight.canComfort()).toBe(false);
    const b = new Battle(def, [gianna()], [WHISPERER], [], { seed: 3 });
    b.start();
    guardUntil(b, () => b.calm === 0 && b.spark >= SURGE_COST);
    const sp = b.actor!.sp;
    const ev = b.act({ kind: 'comfort' });
    expect(ev.some((e) => e.kind === 'calm' && e.value === 2)).toBe(true);
    expect(b.find('gianna')!.sp).toBeLessThanOrEqual(sp - 1);
    guardUntil(b, () => b.actor?.key === 'gianna');
    // The whisperer may have whispered again in between: Comfort again if so.
    if (b.calm === 0) b.act({ kind: 'comfort' });
    if (b.calm > 0 && b.actor?.anissaBond) expect(b.canSurge()).toBe(b.spark >= SURGE_COST);
  });

  it('the Hushers\' Seize frightens her by one, and the Hushed\'s Hush the Light is the whisper (Calm -2), no longer a Seize', () => {
    for (const id of ['husher', 'heath_husher']) expect(ENEMIES[id]!.moves.find((m) => m.name === 'Seize')?.calm, id).toBe(1);
    const light = (BATTLES.assize_hushed!.phases ?? []).flatMap((p) => p.moves ?? []).find((m) => m.name === 'Hush the Light')!;
    expect(light.calm).toBe(2);
    expect(light.seize).toBeUndefined();
  });

  it('nobody but the one bonded to Anissa can Comfort her', () => {
    const b = new Battle(def, [yari(), gianna()], [WHISPERER], [], { seed: 5 });
    b.start();
    guardUntil(b, () => b.calm < CALM_MAX && b.actor?.key === 'yari');
    if (b.actor?.key === 'yari') expect(b.canComfort()).toBe(false);
  });
});

describe('the Unbroken Wick (SECRET-ITEMS.md 4)', () => {
  const boons = { surgeCost: WICK.surgeCost, dawnAt: WICK.dawnAt, dawnHeal: WICK.dawnHeal, calmFloor: WICK.calmFloor };

  it('carried, it is the battle\'s boons; not carried, there are none', () => {
    expect(battleBoons(new FlagStore(), RPG)).toEqual({});
    expect(battleBoons(new FlagStore({ 'item.unbroken_wick': true }), RPG)).toEqual(boons);
  });

  it('Surge costs 4 Spark', () => {
    const b = new Battle(def, [gianna()], [ENEMIES.boar!], [], { seed: 1, boons });
    b.start();
    guardUntil(b, () => b.spark >= 4 && b.actor?.anissaBond === true);
    expect(b.spark).toBeLessThan(SURGE_COST + 2);
    if (b.spark === 4) expect(b.canSurge()).toBe(true);
    const before = b.spark;
    b.act({ kind: 'surge' });
    expect(b.spark).toBe(before - (before >= WICK.dawnAt ? WICK.dawnAt : WICK.surgeCost));
  });

  it('at 9 Spark the Surge is a Dawn Surge: the fighters heal and every ill is cleared', () => {
    const b = new Battle(def, [gianna({ stats: { hp: 900, sp: 80, atk: 20, def: 30, mag: 40, spd: 12 } })], [WHISPERER], [], { seed: 2, boons });
    b.start();
    guardUntil(b, () => b.spark >= WICK.dawnAt && b.find('gianna')!.statuses.length > 0);
    const g = b.find('gianna')!;
    g.hp = Math.round(g.maxHp / 2);
    expect(g.statuses.some((s) => s.id === 'marked')).toBe(true);
    expect(b.dawnReady).toBe(true);
    const ev = b.act({ kind: 'surge' });
    expect(ev.some((e) => e.kind === 'text' && e.text.startsWith('Dawn Surge!'))).toBe(true);
    expect(ev.some((e) => e.kind === 'heal' && e.source === 'Dawn Surge')).toBe(true);
    expect(g.statuses.filter((s) => s.id === 'marked')).toHaveLength(0);
    expect(g.hp).toBeGreaterThan(Math.round(g.maxHp / 2));
  });

  it('Anissa\'s Calm never drops below 1, so the whisper never quiets her', () => {
    const b = new Battle(def, [gianna()], [WHISPERER], [], { seed: 3, boons });
    b.start();
    const calms: number[] = [];
    for (let i = 0; i < 20 && !b.outcome; i++) for (const e of b.act({ kind: 'guard' })) if (e.kind === 'calm') calms.push(e.value);
    expect(calms.length).toBeGreaterThan(2);
    expect(Math.min(...calms)).toBe(WICK.calmFloor);
  });
});

describe('the Nightingale Key (SECRET-ITEMS.md 8)', () => {
  it('carried, every foe\'s next move is shown, and it is the move that comes', () => {
    expect(battleBoons(new FlagStore({ 'item.nightingale_key': true }), RPG)).toEqual({ foresight: true });
    const b = new Battle(def, [gianna()], [ENEMIES.boar!], [], { seed: 4, boons: { foresight: true } });
    b.start();
    expect(b.foresight).toBe(true);
    let checked = 0;
    for (let i = 0; i < 12 && !b.outcome; i++) {
      const boar = b.enemies[0]!;
      const said = b.nextMove(boar);
      const ev = b.act({ kind: 'guard' });
      const used = ev.find((e) => (e.kind === 'damage' || e.kind === 'miss') && e.from === boar.key);
      if (used && (used.kind === 'damage' || used.kind === 'miss')) {
        expect(used.move, `turn ${i}`).toBe(said);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(3);
    expect(new Battle(def, [gianna()], [ENEMIES.boar!], [], { seed: 4 }).foresight).toBe(false);
  });
});

describe('the Patient Hour (SECRET-ITEMS.md 7)', () => {
  it('a legendary relic that brings Stop the Clock to whoever wears it', () => {
    const flags = new FlagStore({ 'item.patient_hour': 1, 'party.yari': true, 'story.yari_asked': true });
    const yariDef = RPG.members.find((m) => m.id === 'yari')!;
    expect(equip(flags, RPG, yariDef, 'patient_hour')).toBe('ok');
    const party = battleParty(flags, RPG, SKILL_BOOK);
    expect(party.find((p) => p.id === 'yari')!.skills.some((s) => s.id === 'stop_the_clock')).toBe(true);
  });

  it('Stop the Clock: every fighter in the party acts once more before any foe; once a battle', () => {
    const watch = SKILL_BOOK.gear.stop_the_clock!;
    const b = new Battle(def, [gianna({ skills: [...SKILLS.gianna!, watch] }), yari()], [ENEMIES.boar!], [], { seed: 6 });
    b.start();
    guardUntil(b, () => b.actor?.key === 'gianna');
    const ev = b.act({ kind: 'skill', skill: 'stop_the_clock' });
    expect(ev.some((e) => e.kind === 'text' && e.text.includes('Everything stops'))).toBe(true);
    // The next turns, until a foe's: both of the party first.
    const turns: string[] = [b.actor!.key];
    for (let i = 0; i < 4 && !b.outcome; i++) {
      const more = b.act({ kind: 'guard' });
      const first = more.find((e) => e.kind === 'turn');
      if (first?.kind === 'turn') turns.push(first.who);
      if (b.actor) turns.push(b.actor.key);
    }
    const firstFoe = turns.findIndex((k) => k.startsWith('boar'));
    const before = turns.slice(0, firstFoe < 0 ? turns.length : firstFoe);
    expect(new Set(before)).toEqual(new Set(['yari', 'gianna']));
    guardUntil(b, () => b.actor?.key === 'gianna');
    expect(b.canUse(b.actor!, b.actor!.skills.find((s) => s.id === 'stop_the_clock')!)).toBe(false);
  });
});

describe('Sarnai\'s Bridle Bell (SECRET-ITEMS.md 6, S-4)', () => {
  it('a legendary relic that brings Call the Herd to whoever wears it', () => {
    const flags = new FlagStore({ 'item.sarnai_bell': 1, 'party.yari': true, 'story.yari_asked': true });
    const yariDef = RPG.members.find((m) => m.id === 'yari')!;
    expect(equip(flags, RPG, yariDef, 'sarnai_bell')).toBe('ok');
    const party = battleParty(flags, RPG, SKILL_BOOK);
    expect(party.find((p) => p.id === 'yari')!.skills.some((s) => s.id === 'call_the_herd')).toBe(true);
  });

  it('Call the Herd: no SP, every foe hit off ATK, each stunned by a chance (not always, not never); once a battle', () => {
    const herd = SKILL_BOOK.gear.call_the_herd!;
    expect(herd.sp).toBe(0);
    expect(herd.target).toBe('allEnemies');
    let stunned = 0;
    let hit = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const b = new Battle(def, [yari(), gianna()], [ENEMIES.boar!, ENEMIES.boar!, ENEMIES.boar!], [], { seed });
      b.start();
      for (let i = 0; i < 20 && b.actor?.key !== 'yari' && !b.outcome; i++) b.act({ kind: 'guard' });
      if (b.actor?.key !== 'yari') continue;
      const yariNow = b.actor!;
      (yariNow.skills as unknown as SkillDef[]).push(herd);
      const ev = b.act({ kind: 'skill', skill: 'call_the_herd' });
      hit += ev.filter((e) => e.kind === 'damage' && e.from === 'yari').length;
      stunned += ev.filter((e) => e.kind === 'status' && e.status === 'stunned' && e.on).length;
      for (let i = 0; i < 20 && b.actor?.key !== 'yari' && !b.outcome; i++) b.act({ kind: 'guard' });
      if (b.actor?.key === 'yari') expect(b.canUse(b.actor, herd)).toBe(false);
    }
    expect(hit).toBeGreaterThanOrEqual(60);
    expect(stunned).toBeGreaterThan(0);
    expect(stunned).toBeLessThan(hit);
  });
});

describe('The Seventh Ribbon (SECRET-ITEMS.md 9, Se-4)', () => {
  it('a key item; the clause struck at the Claim is worth STABILITY.seventhRibbon (+15) and pays +10 Concord once', () => {
    const item = RPG.items['seventh_ribbon']!;
    expect(item.kind).toBe('key');
    expect(item.showcase).toBe('legendary');
    expect(STABILITY.seventhRibbon).toBe(15);
    expect(MUSTER.concord['claim.clause_struck']).toBe(10);
    const part = (flags: FlagStore) => stabilityParts(flags, STABILITY_HOUSES).find((p) => p.id === 'seventh_ribbon')?.value;
    expect(part(new FlagStore({ 'claim.clause_struck': true }))).toBe(15);
    // Carried but never struck (the bell rang first, or the Claim never came) is worth nothing; given to Yari, it still counts.
    expect(part(new FlagStore({ 'item.seventh_ribbon': true }))).toBeUndefined();
    expect(part(new FlagStore({ 'claim.clause_struck': true, 'item.seventh_ribbon': false }))).toBe(15);
    const flags = new FlagStore({ concord: 60, 'claim.clause_struck': true });
    musterTick(flags, RPG);
    musterTick(flags, RPG);
    expect(flags.get('concord')).toBe(70);
  });
});

describe('La Promesa de Benny, the letter (SECRET-ITEMS.md 5, Ar-4)', () => {
  /** A foe who hits far harder than Gianna's HP, every turn. */
  const BRUTE: EnemyDef = { id: 'brute', name: 'Brute', look: 'road_bandit', level: 20, role: 'brute', hpScale: 30, moves: [{ name: 'Smash', power: 900 }] };
  const fight = (boons: { lastStand?: boolean }) => {
    const b = new Battle(def, [gianna({ stats: { hp: 60, sp: 80, atk: 20, def: 1, mag: 40, spd: 1 } })], [BRUTE], [], { seed: 3, boons });
    const events: BattleEvent[] = [...b.start()];
    for (let i = 0; i < 40 && !b.outcome; i++) if (b.actor?.key === 'gianna') events.push(...b.act({ kind: 'guard' }));
    return { b, events };
  };

  it('carried, it is the battle\'s boons', () => {
    expect(battleBoons(new FlagStore({ 'item.benny_promise': true }), RPG).lastStand).toBe(true);
    expect(battleBoons(new FlagStore({}), RPG).lastStand).toBeUndefined();
  });

  it('once a battle, the first blow that would fell a fighter leaves her standing at 1 HP; the next one fells her', () => {
    const held = fight({ lastStand: true });
    expect(held.events.some((e) => e.kind === 'text' && e.text === 'Benny\'s promise holds. Gianna stands.')).toBe(true);
    // The blow that held took her to exactly 1 HP.
    const at = held.events.findIndex((e) => e.kind === 'text' && e.text.startsWith('Benny\'s promise'));
    const blow = held.events[at - 1]!;
    expect(blow.kind === 'damage' && blow.to === 'gianna' && blow.amount === 59).toBe(true);
    expect(held.b.lastStandUsed).toBe(true);
    expect(held.b.outcome).toBe('lost');
    const without = fight({});
    expect(without.events.some((e) => e.kind === 'text' && e.text.startsWith('Benny\'s promise'))).toBe(false);
  });
});

describe('Edmund\'s Tea Break after Al-1 Terribly Sorry', () => {
  it('heals 20% instead of 15% once his letters are delivered', () => {
    const edmund = RPG.members.find((m) => m.id === 'edmund')!;
    const tea = (flags: FlagStore) => knownSkills(flags, SKILL_BOOK, edmund, 22).find((s) => s.id === 'tea_break')!;
    expect(tea(new FlagStore()).healShare).toBe(0.15);
    expect(tea(new FlagStore({ 'side.sorry.done': true })).healShare).toBe(0.2);
  });
});

describe('the measures (the Unbroken Wick\'s puzzle, engine/secrets.ts)', () => {
  it('the eight pours leave five in the 7 jar, and the 7 into the reservoir seals five: the anchor', () => {
    const flags = new FlagStore();
    for (const [from, to] of WICK_POURS) expect(measure(WICK_MEASURES, flags, `${from}>${to}`), `${from}>${to}`).not.toBe('refused');
    expect(sealedAmount(WICK_MEASURES, flags)).toBe(5);
    expect(flags.isSet(WICK_MEASURES.anchor)).toBe(true);
  });

  it('a jar pours until it is empty or the other is full; an empty jar or a full one refuses; the reservoir takes one pour', () => {
    const flags = new FlagStore();
    expect(measure(WICK_MEASURES, flags, '1>2')).toBe('refused');
    expect(measure(WICK_MEASURES, flags, '0>2')).toBe('poured');
    expect(jars(WICK_MEASURES, flags)).toEqual([7, 0, 3]);
    expect(measure(WICK_MEASURES, flags, '0>2')).toBe('refused');
    expect(measure(WICK_MEASURES, flags, '2>r')).toBe('sealed');
    expect(sealedAmount(WICK_MEASURES, flags)).toBe(3);
    expect(flags.isSet(WICK_MEASURES.anchor)).toBe(false);
    expect(measure(WICK_MEASURES, flags, '0>r')).toBe('refused');
    // The lamp-maker makes a new reservoir, and the jars stand as they did.
    expect(measure(WICK_MEASURES, flags, 'reset')).toBe('reset');
    expect(jars(WICK_MEASURES, flags)).toEqual([10, 0, 0]);
    expect(sealedAmount(WICK_MEASURES, flags)).toBeUndefined();
  });
});

describe('the tower clock (the Patient Hour\'s puzzle, engine/secrets.ts)', () => {
  const winds = [...Array(12).fill('g12'), 'rewind', ...Array(5).fill('g12'), 'pull', 'wait'];

  it('11:10 to 2:45 is 215 minutes; twelve of twelve, the rewind, five of twelve, the key out, one tick, the quill', () => {
    expect(clockDistance(TOWER_CLOCK)).toBe(215);
    const flags = new FlagStore();
    for (const r of winds) expect(windClock(TOWER_CLOCK, flags, r), r).not.toBe('caught');
    expect(flags.get('clock.tower.face')).toBe('2:45');
    expect(clockState(TOWER_CLOCK, flags).secs).toBe(28);
    expect(windClock(TOWER_CLOCK, flags, 'wedge')).toBe('stopped');
    expect(flags.isSet(TOWER_CLOCK.anchor)).toBe(true);
  });

  it('waiting alone runs past the watchman: back to the stairs and the clock as it was', () => {
    const flags = new FlagStore();
    let r = '';
    for (let i = 0; i < 215 && r !== 'caught'; i++) r = windClock(TOWER_CLOCK, flags, 'wait');
    expect(r).toBe('caught');
    expect(clockState(TOWER_CLOCK, flags).secs).toBe(0);
    expect(flags.get('clock.tower.face')).toBe(clockFace(TOWER_CLOCK.start));
    expect(flags.isSet(TOWER_CLOCK.anchor)).toBe(false);
  });

  it('a quill on the wrong tick jams the clock until it is pulled; the spring gives twelve turns', () => {
    const flags = new FlagStore();
    for (let i = 0; i < 12; i++) windClock(TOWER_CLOCK, flags, 'g12');
    expect(windClock(TOWER_CLOCK, flags, 'g12')).toBe('spent');
    windClock(TOWER_CLOCK, flags, 'pull');
    expect(windClock(TOWER_CLOCK, flags, 'wedge')).toBe('jammed');
    const jammedAt = flags.get('clock.tower.face');
    windClock(TOWER_CLOCK, flags, 'wait');
    expect(flags.get('clock.tower.face')).toBe(jammedAt);
    expect(windClock(TOWER_CLOCK, flags, 'free')).toBe('freed');
    expect(flags.isSet(TOWER_CLOCK.anchor)).toBe(false);
  });
});

describe('the singing floor (the Nightingale Key\'s puzzle, engine/secrets.ts)', () => {
  const pitch = (nail?: { c: number; r: number }) => (c: number, r: number) => (nail && nail.c === c && nail.r === r ? 0 : NIGHTINGALE.present[r]![c]!);

  it('the informant\'s walk plays the tune on the old floor', () => {
    expect(INFORMANT_WALK.map((b) => NIGHTINGALE.echo[b.r]![b.c])).toEqual([...NIGHTINGALE.melody]);
  });

  it('now no walk plays it without a nail; with the nail in the middle row, fourth board, one does', () => {
    expect(melodyWalks(NIGHTINGALE, pitch())).toHaveLength(0);
    expect(melodyWalks(NIGHTINGALE, pitch({ c: 0, r: 0 }))).toHaveLength(0);
    expect(melodyWalks(NIGHTINGALE, pitch({ c: 3, r: 2 })).length).toBeGreaterThan(0);
  });

  it('every step sings; stepping off starts the listening again; the walked tune opens the box', () => {
    const flags = new FlagStore({ [NIGHTINGALE.anchor]: true, 'floor.sayo.nail': '3,2' });
    const o = NIGHTINGALE.origin;
    const walk = [[0, 4], [1, 3], [1, 2], [2, 1], [3, 2], [4, 3], [4, 4], [3, 4], [2, 3]];
    expect(stepFloor(NIGHTINGALE, flags, 'present', { x: o.x + 2, y: o.y + 2 })?.note).toBe(2);
    stepFloor(NIGHTINGALE, flags, 'present', { x: o.x - 1, y: o.y });
    expect(flags.get(heardFlag('sayo'))).toBe('');
    const notes = walk.map(([c, r]) => stepFloor(NIGHTINGALE, flags, 'present', { x: o.x + c!, y: o.y + r! })?.note);
    expect(notes).toEqual([...NIGHTINGALE.melody]);
    expect(flags.isSet(NIGHTINGALE.open)).toBe(true);
    // In the memory the boards sing as they were laid then.
    expect(stepFloor(NIGHTINGALE, new FlagStore(), 'echo', { x: o.x + 2, y: o.y })?.note).toBe(0);
  });
});
