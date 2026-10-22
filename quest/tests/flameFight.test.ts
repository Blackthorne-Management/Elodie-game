// The battle pieces Chapter 8 adds (engine/battle.ts; COMBAT 9.7, 10 and 13.3 with the outline's second review 3.1
// and 3.9), on made-up fighters so they are tested apart from the chapter's data: Burning (a share of max HP each
// turn, capped on a boss, never the last HP), the Oil Wall (half damage, fire does nothing, a Surge shatters it), lit
// oil (a phase that ignites: fire on the boss sets him Burning), a duel (BattleDef.fighters), Agni ki Shakti (skills
// cost less) and Rakt Ki Pyaas (a felling blow, and his next turn at once).

import { describe, expect, it } from 'vitest';
import { BURNING_BOSS_SHARE, STATUS, SURGE_COST } from '../src/config.ts';
import { Battle, skillCost, type BattleDef, type EnemyDef, type PartyEntry, type SkillDef } from '../src/engine/battle.ts';

const STATS = { hp: 400, sp: 60, atk: 50, def: 20, mag: 60, spd: 30 };
const flare: SkillDef = { id: 'flare', name: 'Flare', sp: 4, kind: 'damage', power: 120, target: 'enemy', element: 'fire', text: '' };
const bolt: SkillDef = { id: 'bolt', name: 'Bolt', sp: 4, kind: 'damage', power: 120, target: 'enemy', text: '' };
const member = (id: string, skills: SkillDef[], extra: Partial<PartyEntry> = {}): PartyEntry => ({ id, name: id, look: id, level: 20, stats: STATS, skills, specials: [], anissaBond: false, ...extra });

const HOARDER: EnemyDef = { id: 'hoarder', name: 'Hoarder', look: 'h', level: 20, role: 'brute', boss: true, hpScale: 8, moves: [{ name: 'Staff', power: 10 }] };
const PUNCHBAG: EnemyDef = { id: 'bag', name: 'Bag', look: 'b', level: 20, role: 'brute', hpScale: 8, moves: [{ name: 'Sway', power: 1 }] };
const WEAKLING: EnemyDef = { id: 'weak', name: 'Weakling', look: 'w', level: 1, role: 'skirmisher', hpScale: 0.1, moves: [{ name: 'Poke', power: 1 }] };
const DEF: BattleDef = { id: 't', title: 't', backdrop: 'x', enemies: [], table: 't', group: 't', rewards: { xp: 0, gold: 0 } };

/** Run until it is this fighter's turn (everyone else guards). */
function until(b: Battle, key: string): void {
  for (let i = 0; i < 40 && b.actor?.key !== key && !b.outcome; i++) b.act({ kind: 'guard' });
}

/** Put a status on a combatant, as a move would (the test reaches in; the engine gives them in play). */
function give(b: Battle, key: string, id: keyof typeof STATUS): void {
  b.find(key)!.statuses.push({ id, turns: STATUS[id].turns, fresh: false });
}

describe('Burning', () => {
  it('a fighter loses 6% of max HP at the start of each turn; a boss loses only BURNING_BOSS_SHARE', () => {
    const b = new Battle(DEF, [member('a', [bolt])], [PUNCHBAG, HOARDER], [], { seed: 3 });
    b.start();
    const bag = b.enemies.find((e) => e.enemyId === 'bag')!;
    const boss = b.enemies.find((e) => e.enemyId === 'hoarder')!;
    give(b, bag.key, 'burning');
    give(b, boss.key, 'burning');
    const bagBefore = bag.hp;
    const bossBefore = boss.hp;
    for (let i = 0; i < 6; i++) b.act({ kind: 'guard' });
    expect(bag.hp).toBeLessThan(bagBefore);
    expect(boss.hp).toBeLessThan(bossBefore);
    // Per tick: the bag 6% of its max; the boss 2% (capped).
    expect((bagBefore - bag.hp) % Math.round(bag.maxHp * 0.06)).toBe(0);
    expect((bossBefore - boss.hp) % Math.round(boss.maxHp * BURNING_BOSS_SHARE)).toBe(0);
    expect(BURNING_BOSS_SHARE).toBeLessThan(-STATUS.burning.regen);
  });

  it('never takes the last HP', () => {
    const b = new Battle(DEF, [member('a', [bolt])], [PUNCHBAG], [], { seed: 4 });
    b.start();
    const bag = b.enemies[0]!;
    bag.hp = 2;
    give(b, bag.key, 'burning');
    for (let i = 0; i < 4; i++) b.act({ kind: 'guard' });
    expect(bag.hp).toBe(1);
    expect(bag.down).toBe(false);
  });
});

describe('the Oil Wall and lit oil', () => {
  it('behind the wall fire does nothing and other blows land at half; a Surge shatters it', () => {
    const b = new Battle(DEF, [member('g', [flare, bolt], { anissaBond: true })], [HOARDER], [], { seed: 5 });
    b.start();
    const boss = b.enemies[0]!;
    give(b, boss.key, 'oiled');
    until(b, 'g');
    let before = boss.hp;
    const fire = b.act({ kind: 'skill', skill: 'flare', target: boss.key });
    expect(boss.hp).toBe(before);
    expect(fire.some((e) => e.kind === 'text' && e.text.includes('Nothing burns there'))).toBe(true);
    until(b, 'g');
    b.spark = SURGE_COST;
    b.act({ kind: 'surge' });
    before = boss.hp;
    const surged = b.act({ kind: 'skill', skill: 'bolt', target: boss.key });
    expect(boss.statuses.some((s) => s.id === 'oiled')).toBe(false);
    expect(boss.hp).toBeLessThan(before);
    expect(surged.some((e) => e.kind === 'text' && e.text.includes('shatters'))).toBe(true);
  });

  it('once a phase that ignites has begun, a fire blow on the boss sets him Burning', () => {
    const def: BattleDef = { ...DEF, phases: [{ below: 0.99, ignite: true, text: 'Then the price goes up.' }] };
    const b = new Battle(def, [member('g', [flare, bolt])], [HOARDER], [], { seed: 6 });
    b.start();
    const boss = b.enemies[0]!;
    until(b, 'g');
    b.act({ kind: 'skill', skill: 'bolt', target: boss.key });
    expect(b.phase).toBe(1);
    expect(boss.statuses.some((s) => s.id === 'burning')).toBe(false);
    until(b, 'g');
    const lit = b.act({ kind: 'skill', skill: 'flare', target: boss.key });
    expect(boss.statuses.some((s) => s.id === 'burning')).toBe(true);
    expect(lit.some((e) => e.kind === 'text' && e.text.includes('catches'))).toBe(true);
  });

  it('without the phase, fire is only fire', () => {
    const b = new Battle(DEF, [member('g', [flare])], [HOARDER], [], { seed: 6 });
    b.start();
    until(b, 'g');
    b.act({ kind: 'skill', skill: 'flare', target: b.enemies[0]!.key });
    expect(b.enemies[0]!.statuses.some((s) => s.id === 'burning')).toBe(false);
  });
});

describe('a duel, and Vikram\'s passives', () => {
  it('BattleDef.fighters: only the members it names fight; the rest are not even on the bench', () => {
    const party = [member('gianna', [bolt]), member('yari', [bolt]), member('azzy', [bolt])];
    const b = new Battle({ ...DEF, fighters: ['gianna'] }, party, [PUNCHBAG], [], { seed: 1 });
    expect(b.party.map((p) => p.key)).toEqual(['gianna']);
    expect(new Battle(DEF, party, [PUNCHBAG], [], { seed: 1 }).party.length).toBe(3);
  });

  it('Agni ki Shakti: his skills cost so much less, never under 1 (and Gianna\'s discount is unchanged)', () => {
    const vikram = { anissaBond: false, passives: [{ kind: 'spLess' as const, sp: 1 }] };
    expect(skillCost(flare, vikram)).toBe(3);
    expect(skillCost({ ...flare, sp: 1 }, vikram)).toBe(1);
    expect(skillCost(flare, { anissaBond: false })).toBe(4);
    expect(skillCost(flare, { anissaBond: true })).toBe(3);
  });

  it('Rakt Ki Pyaas: a blow that fells a foe, and his next turn comes at once (while foes stand)', () => {
    const b = new Battle(DEF, [member('vikram', [bolt], { passives: [{ kind: 'turnOnFell' }] }), member('other', [bolt])], [WEAKLING, PUNCHBAG], [], { seed: 2 });
    b.start();
    until(b, 'vikram');
    const weak = b.enemies.find((e) => e.enemyId === 'weak')!;
    const events = b.act({ kind: 'skill', skill: 'bolt', target: weak.key });
    expect(weak.down).toBe(true);
    expect(events.some((e) => e.kind === 'text' && e.text.includes('goes again'))).toBe(true);
    expect(b.actor?.key).toBe('vikram');
  });
});
