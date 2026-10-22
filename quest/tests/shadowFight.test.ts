// The battle pieces Chapter 7 adds (engine/battle.ts; COMBAT 9.5, 10 and 13.3 with the outline's second review 3.6),
// on made-up fighters so they are tested apart from the chapter's data: Hushed (no SP skills; Attack and its moves
// still work), a disguise (the same name with letters dealt at random, the HP bar hidden), Kagemimi's reveal (the
// real one named and Marked, the paper ones no longer stepping in front), and Sold Secrets (a fighter's own best blow).

import { describe, expect, it } from 'vitest';
import { Battle, type BattleDef, type EnemyDef, type PartyEntry, type SkillDef } from '../src/engine/battle.ts';

const STATS = { hp: 400, sp: 60, atk: 50, def: 20, mag: 50, spd: 30 };
const listen: SkillDef = { id: 'listen', name: 'Listen', sp: 3, kind: 'status', power: 0, target: 'enemy', reveal: true, text: '' };
const bolt: SkillDef = { id: 'bolt', name: 'Bolt', sp: 4, kind: 'damage', power: 120, target: 'enemy', text: '' };
const chop: SkillDef = { id: 'chop', name: 'Chop', sp: 0, cooldown: 2, kind: 'damage', stat: 'atk', power: 180, target: 'enemy', text: '' };
const member = (id: string, skills: SkillDef[]): PartyEntry => ({ id, name: id, look: id, level: 18, stats: STATS, skills, specials: [], anissaBond: false });

const FOX: EnemyDef = {
  id: 'fox', name: 'Fox', look: 'fox', level: 18, role: 'skirmisher', boss: true, hpScale: 6,
  disguise: { as: 'Fox?', name: 'The Fox' },
  moves: [{ name: 'Knife', power: 100 }, { name: 'Secrets', power: 90, mirror: true, every: 2 }],
};
const PAPER: EnemyDef = { id: 'paper', name: 'Paper', look: 'fox', level: 18, role: 'caster', hpScale: 0.4, protects: 'fox', disguise: { as: 'Fox?' }, moves: [{ name: 'Rustle', power: 40 }] };
const HUSHER: EnemyDef = { id: 'husher', name: 'Husher', look: 'h', level: 18, role: 'caster', moves: [{ name: 'Hush', power: 10, magic: true, statuses: ['hushed'] }] };
const DEF: BattleDef = { id: 't', title: 't', backdrop: 'x', enemies: [], table: 't', group: 't', rewards: { xp: 0, gold: 0 } };

function foxFight(seed: number): Battle {
  const b = new Battle(DEF, [member('haru', [listen, chop]), member('gianna', [bolt])], [PAPER, FOX, PAPER, PAPER], [], { seed });
  b.start();
  return b;
}

describe('a disguise, and Kagemimi', () => {
  it('every disguised foe shows as the same name with a letter; letters and places are dealt at random', () => {
    const names = new Set<string>();
    const realSlots = new Set<number>();
    for (let seed = 1; seed <= 12; seed++) {
      const b = foxFight(seed);
      expect(b.enemies.map((e) => e.name).sort()).toEqual(['Fox? A', 'Fox? B', 'Fox? C', 'Fox? D']);
      expect(b.enemies.every((e) => e.masked)).toBe(true);
      const real = b.enemies.find((e) => e.enemyId === 'fox')!;
      names.add(real.name);
      realSlots.add(real.slot);
    }
    expect(names.size).toBeGreaterThan(1);
    expect(realSlots.size).toBeGreaterThan(1);
  });

  it('the reveal names the real one and Marks him; the paper ones lose their protection and their mask', () => {
    const b = foxFight(5);
    for (let i = 0; i < 30 && b.actor?.key !== 'haru'; i++) b.act({ kind: 'attack', target: b.enemies.find((e) => !e.down)!.key });
    const paper = b.enemies.find((e) => e.enemyId === 'paper' && !e.down)!;
    const events = b.act({ kind: 'skill', skill: 'listen', target: paper.key });
    const real = b.enemies.find((e) => e.enemyId === 'fox')!;
    expect(real.name).toBe('The Fox');
    expect(real.masked).toBe(false);
    expect(real.statuses.some((s) => s.id === 'marked')).toBe(true);
    for (const p of b.enemies.filter((e) => e.enemyId === 'paper')) {
      expect(p.protects).toBeUndefined();
      expect(p.masked).toBe(false);
      expect(p.name.startsWith('Paper ')).toBe(true);
    }
    expect(events.some((e) => e.kind === 'text' && e.text.includes('found out'))).toBe(true);
    expect(events.some((e) => e.kind === 'text' && e.text.includes('means to use'))).toBe(true);
  });
});

describe('Sold Secrets and Hushed', () => {
  it('Sold Secrets reads a fighter\'s file: their own strongest damage skill, at its power, turned on them', () => {
    const b = foxFight(9);
    const texts: string[] = [];
    for (let i = 0; i < 60 && !b.outcome; i++) {
      for (const e of b.act({ kind: 'guard' })) if (e.kind === 'text') texts.push(e.text);
      if (texts.some((t) => t.includes('reads from a file'))) break;
    }
    const read = texts.find((t) => t.includes('reads from a file'))!;
    expect(read).toBeDefined();
    expect(read).toMatch(/haru's name on it: Chop|gianna's name on it: Bolt/);
  });

  it('Hushed takes the skills away for its turns, the weapon moves too (Chapter 9: Attack, Guard and Item only)', () => {
    const b = new Battle(DEF, [member('haru', [listen, chop, bolt])], [HUSHER], [], { seed: 2 });
    b.start();
    for (let i = 0; i < 20 && !b.find('haru')!.statuses.some((s) => s.id === 'hushed'); i++) b.act({ kind: 'guard' });
    const me = b.find('haru')!;
    expect(me.statuses.some((s) => s.id === 'hushed')).toBe(true);
    expect(b.canUse(me, bolt)).toBe(false);
    expect(b.canUse(me, listen)).toBe(false);
    expect(b.canUse(me, chop)).toBe(false);
  });
});
