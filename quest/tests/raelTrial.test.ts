// The Trial of Blades (Chapter 3; docs/quest/reviews/2026-10-20-chapter3-outline.md section 4 and its review 3.3 and
// 7): Bound instead of Down, Break Free, a heal loosening the cords, Rael's Seize on Anissa's Spark, the phase that
// starts on the first Surge, Captain Rivera and Jaime walking in, Rivera shielding his lord and both stepping back at
// 0 HP, Jaime's ward, the floor La Promesa de Benny holds (once named, every blow clamped), and the three ways Rael
// ends it himself. Then the balance targets, played by a simple bot over many seeds.

import { describe, expect, it } from 'vitest';
import { RAEL_TRIAL_MAX_ROUNDS, TRIAL_TURNS_AFTER_FINISHER } from '../src/config.ts';
import { BATTLES, ENEMIES, MOVES, SKILLS } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, settleBattle, type BattleDef, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { recordLoss, gameOverCount, grudgeFor } from '../src/engine/gameOver.ts';
import { playTrial, trialBattle, trialFlags } from './trialBot.ts';

const trial = BATTLES.rael_trial!;
const reserve = { rivera: ENEMIES.rivera!, jaime: ENEMIES.jaime! };

function fighter(id: string, over: Partial<PartyEntry> = {}): PartyEntry {
  return {
    id,
    name: id,
    look: id,
    level: 10,
    stats: { hp: 100, sp: 60, atk: 20, def: 10, mag: 24, spd: 10 },
    skills: [],
    specials: [],
    anissaBond: false,
    row: 'back',
    ...over,
  };
}
const gianna = (over: Partial<PartyEntry> = {}) => fighter('gianna', { anissaBond: true, skills: SKILLS.gianna!, ...over });
const yari = (over: Partial<PartyEntry> = {}) => fighter('yari', { skills: MOVES.yari!, weapon: 'bow', ...over });

/** Run until `who` has the turn (everyone else guards; a Bound fighter strains at the cords). */
function until(b: Battle, who: string, max = 80): BattleEvent[] {
  const out: BattleEvent[] = [];
  for (let i = 0; i < max && b.actor?.key !== who && !b.outcome; i++) out.push(...b.act(b.actor!.bound ? { kind: 'breakFree' } : { kind: 'guard' }));
  return out;
}

/** A bind fight with a plain foe (the boar), no phases and no finale. */
const BIND_ONLY: BattleDef = { ...trial, id: 'test_bind', phases: undefined, finale: undefined, enemies: ['boar'] };

describe('Bound (Rael\'s fights): cords, not a fall', () => {
  it('at 0 HP a fighter is Bound and stays on the bar; no foe hits a Bound fighter; all Bound loses', () => {
    const b = new Battle(BIND_ONLY, [gianna({ stats: { hp: 1, sp: 60, atk: 20, def: 10, mag: 24, spd: 10 } }), yari()], [{ ...ENEMIES.boar!, level: 20 }], [], { seed: 3 });
    const events = [...b.start()];
    for (let i = 0; i < 60 && !b.party[0]!.bound; i++) events.push(...b.act(b.actor!.bound ? { kind: 'breakFree' } : { kind: 'guard' }));
    const g = b.party[0]!;
    expect(g.bound).toBe(true);
    expect(events.some((e) => e.kind === 'bound' && e.who === 'gianna')).toBe(true);
    expect(events.some((e) => e.kind === 'down' && e.who === 'gianna')).toBe(false);
    expect(b.fighters.map((f) => f.key)).toContain('gianna');
    // While she is Bound, every blow goes to Yari.
    const later: BattleEvent[] = [];
    for (let i = 0; i < 6 && g.bound && !b.outcome; i++) {
      if (b.actor?.key === 'gianna') break;
      later.push(...b.act({ kind: 'guard' }));
    }
    expect(later.filter((e) => e.kind === 'damage' && e.to === 'gianna')).toEqual([]);
    // Nothing but Break Free on a Bound fighter's turn.
    until(b, 'gianna');
    if (b.actor?.key === 'gianna' && g.bound) expect(b.act({ kind: 'guard' })).toEqual([]);
  });

  it('Break Free: half a chance the first time, sure the second; free with a quarter of their HP', () => {
    let firstWins = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const b = new Battle(BIND_ONLY, [gianna(), yari()], [ENEMIES.boar!], [], { seed });
      b.start();
      until(b, 'gianna');
      const g = b.party[0]!;
      g.hp = 0;
      g.down = true;
      g.bound = true;
      const first = b.act({ kind: 'breakFree' });
      const freed = first.find((e) => e.kind === 'freed');
      if (freed) {
        firstWins++;
        expect(freed).toEqual({ kind: 'freed', who: 'gianna', hp: 25 });
        continue;
      }
      expect(first.some((e) => e.kind === 'text' && e.text.includes('They hold'))).toBe(true);
      until(b, 'gianna');
      if (b.outcome) continue;
      expect(b.act({ kind: 'breakFree' }).some((e) => e.kind === 'freed' && e.who === 'gianna')).toBe(true);
      expect(g.bound).toBe(false);
    }
    expect(firstWins).toBeGreaterThan(8);
    expect(firstWins).toBeLessThan(32);
  });

  it('a heal (a spell or food) loosens the cords: they stand with what it healed', () => {
    const b = new Battle(BIND_ONLY, [gianna(), yari()], [ENEMIES.boar!], [{ id: 'kasav', name: 'Kasav', count: 2, heals: 25 }], { seed: 5 });
    b.start();
    until(b, 'gianna');
    const y = b.party[1]!;
    Object.assign(y, { hp: 0, down: true, bound: true });
    const freed = b.act({ kind: 'skill', skill: 'limye_elodie', target: 'yari' }).find((e) => e.kind === 'freed');
    expect(freed).toBeDefined();
    expect(y.bound).toBe(false);
    expect(y.hp).toBe((freed as { hp: number }).hp);
    until(b, 'gianna');
    Object.assign(y, { hp: 0, down: true, bound: true });
    expect(b.act({ kind: 'item', item: 'kasav', target: 'yari' }).find((e) => e.kind === 'freed')).toMatchObject({ who: 'yari', hp: 25 });
  });
});

describe('Rael, phase by phase', () => {
  it('Seize: he reaches for Anissa, Gianna steps in, 3 Spark is torn away and she is Marked for two turns', () => {
    const b = new Battle(trial, [gianna({ stats: { hp: 999, sp: 60, atk: 20, def: 60, mag: 24, spd: 10 } }), yari({ stats: { hp: 999, sp: 30, atk: 20, def: 60, mag: 5, spd: 12 } })], [ENEMIES.rael!], [], { seed: 2, reserve });
    const events = [...b.start()];
    b.spark = 4;
    for (let i = 0; i < 40 && !events.some((e) => e.kind === 'text' && e.text.includes('reaches for Anissa')); i++) {
      b.spark = Math.max(b.spark, 4);
      events.push(...b.act({ kind: 'guard' }));
    }
    const at = events.findIndex((e) => e.kind === 'text' && e.text.includes('reaches for Anissa'));
    expect(at).toBeGreaterThan(-1);
    const after = events.slice(at);
    expect(after.find((e) => e.kind === 'text' && e.text.includes('Spark is torn away'))).toBeDefined();
    expect(after.find((e) => e.kind === 'status' && e.to === 'gianna' && e.status === 'marked' && e.on)).toBeDefined();
    // He never deals damage to her: the Seize itself has no power.
    expect(events.filter((e) => e.kind === 'damage' && e.move === 'Seize')).toEqual([]);
  });

  it('the first Surge ends phase 1 ("Good."): Captain Rivera and Jaime walk in, once', () => {
    const b = trialBattle(trialFlags(10), 7);
    b.start();
    until(b, 'gianna');
    b.spark = 5;
    const ev = b.act({ kind: 'surge' });
    expect(ev.some((e) => e.kind === 'text' && e.text === 'Good.' && e.speaker === 'Rael')).toBe(true);
    expect(ev.filter((e) => e.kind === 'enter').map((e) => (e as { who: string }).who)).toEqual(['rivera#1', 'jaime#1']);
    expect(b.phase).toBe(1);
    // Later Surges bring no one else.
    until(b, 'gianna');
    b.spark = 5;
    expect(b.act({ kind: 'surge' }).some((e) => e.kind === 'enter')).toBe(false);
    expect(b.enemies.map((e) => e.enemyId)).toEqual(['rael', 'rivera', 'jaime']);
  });

  it('Rivera takes most blows meant for Rael; at 0 HP he steps back ("Stand back, Captain."), not falls', () => {
    const b = trialBattle(trialFlags(12), 11);
    b.start();
    const rael = b.enemies[0]!;
    rael.hp = Math.floor(rael.maxHp * 0.6);
    until(b, 'gianna');
    let shielded = 0;
    let shots = 0;
    const events: BattleEvent[] = [];
    for (let i = 0; i < 200 && !b.outcome; i++) {
      const me = b.actor!;
      if (me.bound) {
        events.push(...b.act({ kind: 'breakFree' }));
        continue;
      }
      // Keep the party standing: this test is about the guard.
      for (const p of b.party) if (!p.bound) p.hp = p.maxHp;
      const ev = b.act({ kind: 'attack', target: rael.key });
      shots++;
      if (ev.some((e) => e.kind === 'text' && e.text.startsWith('Captain Rivera steps in front'))) shielded++;
      events.push(...ev);
      if (b.enemies.find((e) => e.enemyId === 'rivera')?.down) break;
    }
    const rivera = b.enemies.find((e) => e.enemyId === 'rivera')!;
    expect(shielded / shots).toBeGreaterThan(0.5);
    expect(rivera.down).toBe(true);
    expect(events.some((e) => e.kind === 'withdraw' && e.who === rivera.key)).toBe(true);
    expect(events.some((e) => e.kind === 'down' && e.who === rivera.key)).toBe(false);
    expect(events.some((e) => e.kind === 'text' && e.text === 'Stand back, Captain.' && e.speaker === 'Rael')).toBe(true);
  });

  it('Jaime wards his lord', () => {
    const b = trialBattle(trialFlags(10), 4);
    b.start();
    until(b, 'gianna');
    b.spark = 5;
    b.act({ kind: 'surge' });
    const events = until(b, 'never', 40);
    expect(events.some((e) => e.kind === 'status' && e.to === 'rael#1' && e.status === 'warded' && e.on)).toBe(true);
  });
});

describe('the floor and the finale: Rael wins, whatever the party does', () => {
  it('La Promesa de Benny holds him at 1 HP, named once; every hit of a volley stops there; he ends it at once', () => {
    const b = new Battle(trial, [yari({ stats: { hp: 999, sp: 30, atk: 80, def: 60, mag: 5, spd: 30 } }), gianna()], [ENEMIES.rael!], [], { seed: 9, reserve });
    b.start();
    until(b, 'yari');
    const rael = b.enemies[0]!;
    rael.hp = 3;
    const ev = b.act({ kind: 'skill', skill: 'volley' });
    expect(rael.hp).toBe(1);
    expect(rael.down).toBe(false);
    expect(ev.filter((e) => e.kind === 'text' && e.text.startsWith('La Promesa de Benny glows'))).toHaveLength(1);
    // The finale comes before anyone else moves: "Enough.", Cenizas, every fighter Bound, no damage numbers.
    const enough = ev.findIndex((e) => e.kind === 'text' && e.text === 'Enough.');
    expect(enough).toBeGreaterThan(-1);
    expect(ev.slice(enough).filter((e) => e.kind === 'damage')).toEqual([]);
    expect(ev.slice(enough).filter((e) => e.kind === 'turn')).toEqual([]);
    expect(b.party.every((p) => p.bound)).toBe(true);
    expect(b.outcome).toBe('lost');
    expect(ev.at(-1)).toEqual({ kind: 'lost' });
  });

  it(`after Reinado de Cenizas (telegraphed a turn early) he ends it ${TRIAL_TURNS_AFTER_FINISHER} of his turns later; it skips the Bound`, () => {
    const sturdy = { hp: 99999, sp: 60, atk: 1, def: 60, mag: 1, spd: 10 };
    const b = new Battle(trial, [gianna({ stats: sturdy }), yari({ stats: { ...sturdy } })], [ENEMIES.rael!], [], { seed: 6, reserve });
    const events = [...b.start()];
    const rael = b.enemies[0]!;
    rael.hp = Math.floor(rael.maxHp * 0.3);
    // The first action moves the phases on (the HP is past both thresholds).
    events.push(...b.act({ kind: 'guard' }));
    // Yari is Bound before the finisher: it must not touch her.
    const y = b.party[1]!;
    Object.assign(y, { hp: 0, down: true, bound: true });
    for (let i = 0; i < 200 && !b.outcome; i++) events.push(...b.act(b.actor!.bound ? { kind: 'breakFree' } : { kind: 'guard' }));
    const tell = events.findIndex((e) => e.kind === 'text' && e.text.includes('Guard, everyone!'));
    const reinado = events.findIndex((e) => e.kind === 'use' && e.name === 'Reinado de Cenizas' || (e.kind === 'damage' && e.move === 'Reinado de Cenizas'));
    expect(tell).toBeGreaterThan(-1);
    expect(reinado).toBeGreaterThan(tell);
    // No blow lands on Yari while she is Bound (replaying the events in order).
    let yBound = true;
    for (const e of events) {
      if (e.kind === 'freed' && e.who === 'yari') yBound = false;
      if (e.kind === 'bound' && e.who === 'yari') yBound = true;
      if (e.kind === 'damage' && e.to === 'yari') expect(yBound, e.move).toBe(false);
    }
    // He uses it once.
    expect(events.filter((e) => e.kind === 'damage' && e.move === 'Reinado de Cenizas' && (e as { to: string }).to === 'gianna').length).toBe(1);
    expect(events.some((e) => e.kind === 'text' && e.text === 'Enough.')).toBe(true);
    expect(b.outcome).toBe('lost');
    expect(b.floorHeld).toBe(false);
    const raelTurns = events.filter((e) => e.kind === 'turn' && e.who === 'rael#1').length;
    expect(raelTurns).toBeLessThan(RAEL_TRIAL_MAX_ROUNDS);
  });

  it(`a party that only stalls meets the round cap: his ${RAEL_TRIAL_MAX_ROUNDS + 1}th turn ends it`, () => {
    const sturdy = { hp: 99999, sp: 60, atk: 1, def: 60, mag: 1, spd: 10 };
    const b = new Battle(trial, [gianna({ stats: sturdy }), yari({ stats: { ...sturdy } })], [ENEMIES.rael!], [], { seed: 8, reserve });
    const events = [...b.start()];
    for (let i = 0; i < 200 && !b.outcome; i++) events.push(...b.act({ kind: 'guard' }));
    expect(b.outcome).toBe('lost');
    expect(events.filter((e) => e.kind === 'turn' && e.who === 'rael#1').length).toBe(RAEL_TRIAL_MAX_ROUNDS + 1);
    expect(events.some((e) => e.kind === 'text' && e.text === 'Enough.')).toBe(true);
    expect(b.party.every((p) => p.bound)).toBe(true);
  });
});

describe('no goddess, no count, no Grudge, no spoils: the story goes on', () => {
  it('the scripted end sets story.trial_fought at once (a reload never sends the party back in) and names rael_after', () => {
    const flags = new FlagStore();
    expect(recordLoss(flags, trial)).toEqual({ kind: 'scripted', scene: 'rael_after' });
    expect(flags.isSet('story.trial_fought')).toBe(true);
    expect(gameOverCount(flags)).toBe(0);
    expect(grudgeFor(flags, trial)).toBe(0);
  });

  it('it can never be marked won, and pays nothing', () => {
    const flags = new FlagStore();
    const r = settleBattle(flags, RPG, { def: trial, items: battleItems(flags, RPG), outcome: 'won', goldSpent: 0, party: [] } as unknown as Battle);
    expect(flags.has('encounter.ardencia_story.rael.won')).toBe(false);
    expect(r.xp + r.gold).toBe(0);
  });
});

describe('the balance (review 3.3 and 7): a fair player at level 10, over many seeds', () => {
  const runs = Array.from({ length: 30 }, (_, i) => playTrial(i + 1, 'rael', 10));
  const guards = Array.from({ length: 30 }, (_, i) => playTrial(i + 101, 'guards', 10));
  const all = [...runs, ...guards];

  it('every run ends lost, every way it can: the guards always walk in, and Rael is never felled', () => {
    for (const r of all) {
      expect(r.events.some((e) => e.kind === 'won')).toBe(false);
      expect(r.events.at(-1)).toEqual({ kind: 'lost' });
      expect(r.guardsIn).toBe(true);
      expect(r.events.some((e) => e.kind === 'down' && e.who === 'rael#1')).toBe(false);
    }
  });

  it('the median run sees Reinado de Cenizas, and at least a third reach the floor (La Promesa is seen)', () => {
    expect(all.filter((r) => r.reinado).length).toBeGreaterThan(all.length / 2);
    expect(all.filter((r) => r.end === 'floor').length).toBeGreaterThanOrEqual(all.length / 3);
    // Some parties are Bound before he ends it: the natural loss happens too.
    expect(runs.some((r) => r.end === 'bound' || r.end === 'finisher')).toBe(true);
  });

  it('it lasts minutes, not an evening: the median run is under 40 party actions (about 6 minutes on a phone)', () => {
    const acts = all.map((r) => r.actions).sort((a, b) => a - b);
    expect(acts[Math.floor(acts.length / 2)]!).toBeLessThan(40);
    expect(acts.at(-1)!).toBeLessThanOrEqual(60);
  });
});
