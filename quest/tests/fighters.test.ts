// Fighters as data (Oct 20; plan review 4.4): a companion is a MemberDef plus their skills in data/battles.ts.
// Azzy and Samira are the first two (COMBAT 9.3, 9.6): rows, the Anissa bond, passives the engine runs
// (Sangre Ardiente, Baraka Dorini), Grito de Guerra's stun, Reinado de Cenizas, and Samira's Daftar, which spends
// gold (owner approved, Oct 20) and grows with the realm's Wealth.

import { describe, expect, it } from 'vitest';
import { ACTION_WEIGHT, BATTLE_ACTIVE, DAFTAR_WEALTH_MAX } from '../src/config.ts';
import { BATTLES, ENEMIES, SKILL_BOOK } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty, battlePurse, goldCost, reachable, settleBattle, turnDelay, wealthBoost, type BattleEvent, type PartyEntry } from '../src/engine/battle.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { gold, partyMembers, pillarFlag, xpForLevel, type MemberDef, type RpgContent } from '../src/engine/rpg.ts';
import { usesSlots } from '../src/engine/skills.ts';
import type { SkillBook } from '../src/engine/skills.ts';

const def = BATTLES.intro_boar!;
const boar = ENEMIES.boar!;
const member = (id: string) => RPG.members.find((m) => m.id === id)!;

/** A save with the whole present party so far: Gianna, Anissa, Yari, Azzy and Samira, all at `lv`. */
function fullParty(lv = 8): FlagStore {
  const f = new FlagStore();
  f.set('party.anissa', true);
  f.set('story.yari_asked', true);
  f.set('party.azzy', true);
  f.set('party.samira', true);
  f.set('xp.shared', xpForLevel(RPG, lv));
  return f;
}

/** Run the battle until `who` has the turn (the others guard). */
function until(b: Battle, who: string): void {
  for (let i = 0; i < 40 && b.actor?.key !== who && !b.outcome; i++) b.act({ kind: 'guard' });
  expect(b.actor?.key).toBe(who);
}

/** Sturdy fighters, so the boar never ends a test early. */
function sturdy(entries: PartyEntry[]): PartyEntry[] {
  return entries.map((e) => ({ ...e, stats: { ...e.stats, hp: 999, def: 60 } }));
}

describe('companions are data', () => {
  it('Azzy and Samira join only by their flags (no story sets them yet)', () => {
    const f = new FlagStore();
    expect(partyMembers(f, RPG, 'present').map((m) => m.id)).toEqual(['gianna']);
    const ids = partyMembers(fullParty(), RPG, 'present').map((m) => m.id);
    expect(ids).toEqual(['gianna', 'anissa', 'yari', 'azzy', 'samira']);
  });

  it('their battle entries come from the MemberDef: row, bond, look, skills, passives', () => {
    const party = battleParty(fullParty(), RPG, SKILL_BOOK);
    const by = Object.fromEntries(party.map((p) => [p.id, p]));
    expect(party.map((p) => p.id)).toEqual(['gianna', 'yari', 'azzy', 'samira']);
    expect(by.azzy!.row).toBe('front');
    expect(by.samira!.row).toBe('back');
    expect(by.gianna!.anissaBond).toBe(true);
    expect(by.samira!.anissaBond).toBe(false);
    expect(by.azzy!.passives).toEqual([{ kind: 'atkPerFell', share: 0.05, max: 0.25 }]);
    expect(by.samira!.passives).toEqual([{ kind: 'battleGold', share: 0.1 }]);
    expect(by.azzy!.skills.map((s) => s.id)).toEqual(['slash', 'heavy_blow', 'sweep', 'la_marca', 'grito_de_guerra', 'reinado_de_cenizas']);
    expect(by.samira!.skills.map((s) => s.id)).toEqual(['tonic', 'daftar_mend', 'daftar_strike', 'bribe', 'daftar_favour']);
    expect(by.samira!.look).toBe('samira');
    // Samira is a mage by her gear, but her skills are not a spellbook (no slots to fill).
    expect(usesSlots(member('samira'))).toBe(false);
    expect(usesSlots(member('gianna'))).toBe(true);
  });

  it('without Anissa no one is bonded; the Echo party fights in its own era', () => {
    const f = fullParty();
    f.clear('party.anissa');
    expect(battleParty(f, RPG, SKILL_BOOK).every((p) => !p.anissaBond)).toBe(true);
    f.set('story.caona_joined', true);
    const echo = battleParty(f, RPG, SKILL_BOOK, 'echo');
    expect(echo.map((p) => p.id)).toEqual(['patricio', 'caona']);
    expect(echo.map((p) => p.row)).toEqual(['front', 'back']);
  });

  it('a new companion needs only data: an entry and a skill list, nothing in the engine', () => {
    const edmund: MemberDef = {
      id: 'edmund', name: 'Edmund', role: 'Guardian', house: 'Stillwater', portrait: 'edmund', era: 'present', class: 'warrior',
      joins: { flag: 'party.edmund' },
      base: { hp: 66, sp: 14, atk: 10, def: 14, mag: 5, spd: 6 }, growth: { hp: 8, sp: 2, atk: 2, def: 3, mag: 1, spd: 1 },
    };
    const rpg: RpgContent = { ...RPG, members: [...RPG.members, edmund] };
    const book: SkillBook = {
      ...SKILL_BOOK,
      skills: { ...SKILL_BOOK.skills, edmund: [{ id: 'shield_wall', name: 'Shield Wall', sp: 8, kind: 'status', power: 0, target: 'allAllies', statuses: ['warded'], text: 'x' }] },
    };
    const f = fullParty(10);
    f.set('party.edmund', true);
    const party = battleParty(f, rpg, book);
    const e = party.find((p) => p.id === 'edmund')!;
    expect(e.row).toBe('front');
    expect(e.level).toBe(10);
    expect(e.stats.def).toBe(14 + 3 * 9);
    expect(e.skills.map((s) => s.id)).toEqual(['shield_wall']);
    // Five fighters: the first four fight, the fifth waits to swap in.
    const b = new Battle(def, party, [boar], [], { seed: 3 });
    expect(b.fighters.map((c) => c.key)).toEqual(['gianna', 'yari', 'azzy', 'samira']);
    expect(b.fighters).toHaveLength(BATTLE_ACTIVE);
    expect(b.bench.map((c) => c.key)).toEqual(['edmund']);
  });

  it('with Azzy in the front row, the boar can only reach him', () => {
    const b = new Battle(def, battleParty(fullParty(), RPG, SKILL_BOOK), [boar], [], { seed: 1 });
    expect(reachable(b.fighters).map((c) => c.key)).toEqual(['azzy']);
  });
});

describe("Azzy's skills (COMBAT 9.3)", () => {
  const party = () => sturdy(battleParty(fullParty(), RPG, SKILL_BOOK));

  it('Grito de Guerra: the foe loses its next action', () => {
    const b = new Battle(def, party(), [boar], [], { seed: 5 });
    b.start();
    until(b, 'azzy');
    const ev = b.act({ kind: 'skill', skill: 'grito_de_guerra', target: 'boar#1' });
    expect(ev).toContainEqual({ kind: 'status', to: 'boar#1', status: 'stunned', on: true });
    let all: BattleEvent[] = [...ev];
    for (let i = 0; i < 10 && !all.some((e) => e.kind === 'text' && /stunned and loses the turn/.test(e.text)); i++) all = [...all, ...b.act({ kind: 'guard' })];
    const at = all.findIndex((e) => e.kind === 'text' && /stunned and loses the turn/.test(e.text));
    expect(at).toBeGreaterThan(-1);
    // The boar's skipped turn deals nothing: the next event after it is not the boar's blow.
    expect(all[at + 2]).not.toMatchObject({ kind: 'damage', from: 'boar#1' });
    expect(b.find('boar#1')!.statuses.some((s) => s.id === 'stunned')).toBe(false);
  });

  it('on a boss it lands only about half the time', () => {
    let landed = 0;
    const runs = 60;
    for (let seed = 1; seed <= runs; seed++) {
      const b = new Battle(def, party(), [{ ...boar, boss: true }], [], { seed });
      b.start();
      until(b, 'azzy');
      const ev = b.act({ kind: 'skill', skill: 'grito_de_guerra', target: 'boar#1' });
      if (ev.some((e) => e.kind === 'status' && e.status === 'stunned' && e.on)) landed++;
    }
    expect(landed).toBeGreaterThan(runs * 0.25);
    expect(landed).toBeLessThan(runs * 0.75);
  });

  it('Sangre Ardiente: each foe he has felled adds 5% ATK, up to 25%', () => {
    const blow = (fells: number) => {
      const b = new Battle(def, party(), [boar], [], { seed: 11 });
      b.start();
      until(b, 'azzy');
      b.find('azzy')!.fells = fells;
      const hit = b.act({ kind: 'skill', skill: 'slash', target: 'boar#1' }).find((e) => e.kind === 'damage' && e.from === 'azzy');
      return hit?.kind === 'damage' ? hit.amount : 0;
    };
    const none = blow(0);
    expect(none).toBeGreaterThan(0);
    expect(blow(2)).toBeGreaterThan(none);
    expect(blow(5)).toBeGreaterThan(blow(2));
    expect(blow(9)).toBe(blow(5));
  });

  it('Reinado de Cenizas grows with every foe felled, once per battle, and is heavy', () => {
    const strike = (felled: number) => {
      const b = new Battle(def, party(), [boar, boar, boar], [], { seed: 13 });
      b.start();
      until(b, 'azzy');
      for (const e of b.enemies.slice(1, 1 + felled)) {
        e.hp = 0;
        e.down = true;
      }
      const azzy = b.find('azzy')!;
      const before = azzy.next;
      const ev = b.act({ kind: 'skill', skill: 'reinado_de_cenizas', target: 'boar#1' });
      const dmg = ev.find((e) => e.kind === 'damage' && e.from === 'azzy');
      return { b, amount: dmg?.kind === 'damage' ? dmg.amount : 0, waited: azzy.next - before };
    };
    const zero = strike(0);
    const two = strike(2);
    expect(two.amount).toBeGreaterThan(zero.amount);
    const azzy = zero.b.find('azzy')!;
    const skill = azzy.skills.find((s) => s.id === 'reinado_de_cenizas')!;
    expect(zero.b.canUse(azzy, skill)).toBe(false);
    expect(zero.waited).toBe(turnDelay(azzy.spd, ACTION_WEIGHT.heavy));
  });
});

describe("Samira's Daftar spends gold (COMBAT 9.6, owner approved Oct 20)", () => {
  const skill = (id: string) => SKILL_BOOK.skills.samira!.find((s) => s.id === id)!;

  function samiraBattle(purse: number, wealth = 0, seed = 7): Battle {
    const b = new Battle(def, sturdy(battleParty(fullParty(), RPG, SKILL_BOOK)), [boar], [], { seed, gold: purse, wealth });
    b.start();
    until(b, 'samira');
    return b;
  }

  it('costs 20 gold plus 10 a level, and the realm’s Wealth adds 1% a point up to 30%', () => {
    expect(goldCost(skill('daftar_strike'), { level: 8 })).toBe(100);
    expect(goldCost(skill('daftar_favour'), { level: 8 })).toBe(60);
    expect(goldCost(skill('tonic'), { level: 8 })).toBe(0);
    expect(wealthBoost(12)).toBeCloseTo(0.12);
    expect(wealthBoost(100)).toBe(DAFTAR_WEALTH_MAX);
    expect(wealthBoost(-3)).toBe(0);
  });

  it('Hired Blade: exactly 10 damage per 20 gold, through any armour, grown by Wealth', () => {
    const plain = samiraBattle(500);
    const hit = plain.act({ kind: 'skill', skill: 'daftar_strike', target: 'boar#1' }).find((e) => e.kind === 'damage' && e.from === 'samira');
    expect(hit).toMatchObject({ amount: 50 });
    expect(plain.goldSpent).toBe(100);
    expect(plain.purse).toBe(400);
    const rich = samiraBattle(500, 12);
    const richHit = rich.act({ kind: 'skill', skill: 'daftar_strike', target: 'boar#1' }).find((e) => e.kind === 'damage' && e.from === 'samira');
    expect(richHit).toMatchObject({ amount: 56 });
  });

  it('Remedy heals 10 HP per 20 gold; Patronage buys Inspired for 60', () => {
    const b = samiraBattle(500);
    const yari = b.find('yari')!;
    yari.hp = 100;
    const heal = b.act({ kind: 'skill', skill: 'daftar_mend', target: 'yari' }).find((e) => e.kind === 'heal');
    expect(heal).toMatchObject({ to: 'yari', hp: 50 });
    until(b, 'samira');
    const ev = b.act({ kind: 'skill', skill: 'daftar_favour', target: 'azzy' });
    expect(ev).toContainEqual({ kind: 'status', to: 'azzy', status: 'inspired', on: true });
    expect(b.goldSpent).toBe(160);
  });

  it('cannot be used without the gold', () => {
    const b = samiraBattle(90);
    const samira = b.find('samira')!;
    expect(b.canUse(samira, samira.skills.find((s) => s.id === 'daftar_strike')!)).toBe(false);
    expect(b.canUse(samira, samira.skills.find((s) => s.id === 'daftar_favour')!)).toBe(true);
    expect(b.act({ kind: 'skill', skill: 'daftar_strike', target: 'boar#1' })).toEqual([]);
    expect(b.goldSpent).toBe(0);
  });

  it('a won fight takes the gold spent from the purse, and Baraka Dorini adds 10% to the winnings', () => {
    const f = fullParty();
    f.set('gold', 500);
    f.set(pillarFlag('wealth', 'al_doria'), 12);
    const purse = battlePurse(f, RPG, Object.keys(f.snapshot()));
    expect(purse).toEqual({ gold: 500, wealth: 12 });
    const b = new Battle(def, sturdy(battleParty(f, RPG, SKILL_BOOK)), [boar], [], { seed: 7, ...purse });
    b.start();
    until(b, 'samira');
    b.act({ kind: 'skill', skill: 'daftar_strike', target: 'boar#1' });
    b.outcome = 'won';
    const r = settleBattle(f, RPG, b);
    const won = Math.round(def.rewards.gold * 1.1);
    expect(r).toMatchObject({ gold: won, spent: 100 });
    expect(gold(f, RPG)).toBe(500 - 100 + won);
  });

  it('a lost fight spends nothing (the goddess gives back the moment before it)', () => {
    const f = fullParty();
    f.set('gold', 500);
    const b = new Battle(def, sturdy(battleParty(f, RPG, SKILL_BOOK)), [boar], [], { seed: 7, gold: 500 });
    b.start();
    until(b, 'samira');
    b.act({ kind: 'skill', skill: 'daftar_strike', target: 'boar#1' });
    b.outcome = 'lost';
    settleBattle(f, RPG, b);
    expect(gold(f, RPG)).toBe(500);
  });
});
