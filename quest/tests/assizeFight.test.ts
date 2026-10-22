// The battle pieces Chapter 9 adds (engine/battle.ts; COMBAT 9.8, 10 and 13.3 with the Chapter 9 outline's second
// review 3.1), on made-up fighters so they are tested apart from the chapter's data: a caster boss's spells scaled
// (EnemyDef.magScale, as atkScale scales blows), Hushed taking the weapon moves too (Attack, Guard and Item only), and
// a heal by share of each target's own max HP (Tea Break: a tank's heal, whatever his MAG).

import { describe, expect, it } from 'vitest';
import { STATUS } from '../src/config.ts';
import { ENEMIES } from '../src/data/battles.ts';
import { Battle, enemyStats, type BattleDef, type EnemyDef, type PartyEntry, type SkillDef } from '../src/engine/battle.ts';

const STATS = { hp: 400, sp: 60, atk: 50, def: 20, mag: 5, spd: 30 };
const bolt: SkillDef = { id: 'bolt', name: 'Bolt', sp: 4, kind: 'damage', power: 120, target: 'enemy', text: '' };
const chop: SkillDef = { id: 'chop', name: 'Chop', sp: 0, cooldown: 0, kind: 'damage', stat: 'atk', power: 100, target: 'enemy', text: '' };
const tea: SkillDef = { id: 'tea', name: 'Tea', sp: 10, kind: 'heal', power: 0, healShare: 0.15, target: 'allAllies', text: '' };
const member = (id: string, skills: SkillDef[], extra: Partial<PartyEntry> = {}): PartyEntry => ({ id, name: id, look: id, level: 22, stats: STATS, skills, specials: [], anissaBond: false, ...extra });
const DEF: BattleDef = { id: 't', title: 't', backdrop: 'x', enemies: [], table: 't', group: 't', rewards: { xp: 0, gold: 0 } };
const CASTER: EnemyDef = { id: 'veil', name: 'Veil', look: 'v', level: 24, role: 'caster', boss: true, hpScale: 7, moves: [{ name: 'Whisper', power: 100, magic: true }] };
const PUNCHBAG: EnemyDef = { id: 'bag', name: 'Bag', look: 'b', level: 20, role: 'brute', hpScale: 8, moves: [{ name: 'Sway', power: 1 }] };

/** Run until it is this fighter's turn (everyone else guards). */
function until(b: Battle, key: string): void {
  for (let i = 0; i < 40 && b.actor?.key !== key && !b.outcome; i++) b.act({ kind: 'guard' });
}

describe('magScale: a caster boss\'s spells scale as a striking boss\'s blows do', () => {
  it('MAG times magScale, and nothing else moves; omitted it is 1', () => {
    const plain = enemyStats(CASTER);
    const scaled = enemyStats({ ...CASTER, magScale: 1.25 });
    expect(Math.abs(scaled.mag - plain.mag * 1.25)).toBeLessThanOrEqual(1);
    expect([scaled.hp, scaled.atk, scaled.def, scaled.spd]).toEqual([plain.hp, plain.atk, plain.def, plain.spd]);
  });

  it('the Chapter 2 to 8 bosses set none (their fights replay unchanged)', () => {
    for (const id of ['thorne', 'rael', 'qasim', 'grimvald', 'paper_fox', 'seth_dhanraj']) {
      const e = ENEMIES[id];
      expect(e, id).toBeDefined();
      expect(e!.magScale, id).toBeUndefined();
    }
  });
});

describe('Hushed (Chapter 9): Attack, Guard and Item only', () => {
  it('no SP skills and no weapon moves for its turns; Attack and Guard still work', () => {
    const b = new Battle(DEF, [member('edmund', [bolt, chop])], [PUNCHBAG], [], { seed: 2 });
    b.start();
    until(b, 'edmund');
    const me = b.find('edmund')!;
    me.statuses.push({ id: 'hushed', turns: STATUS.hushed.turns, fresh: false });
    expect(b.canUse(me, bolt)).toBe(false);
    expect(b.canUse(me, chop)).toBe(false);
    expect(b.act({ kind: 'skill', skill: 'chop', target: b.enemies[0]!.key })).toEqual([]);
    expect(b.act({ kind: 'attack', target: b.enemies[0]!.key }).length).toBeGreaterThan(0);
  });
});

describe('a heal by share (Tea Break)', () => {
  it('each ally gets back its own share of max HP, whatever the healer\'s MAG', () => {
    const b = new Battle(DEF, [member('edmund', [tea]), member('yari', [], { stats: { ...STATS, hp: 200 } })], [PUNCHBAG], [], { seed: 5 });
    b.start();
    until(b, 'edmund');
    const ed = b.find('edmund')!;
    const yari = b.find('yari')!;
    ed.hp = 100;
    yari.hp = 50;
    const events = b.act({ kind: 'skill', skill: 'tea' });
    const heals = events.filter((e) => e.kind === 'heal');
    expect(heals.find((h) => h.kind === 'heal' && h.to === 'edmund')).toMatchObject({ hp: 60 });
    expect(heals.find((h) => h.kind === 'heal' && h.to === 'yari')).toMatchObject({ hp: 30 });
  });
});
