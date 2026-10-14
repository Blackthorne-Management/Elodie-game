// The second design review (docs/REVIEW-2026-10-second.md, rules-decisions 87): Throne entry, the big-table Heart
// Token limit, Unbroken from 2 Heart Tokens, Battle by the die, Brasador's Legacy card, Stolen Goods, Turnabout,
// Grito de Guerra's two markers and the three-part rulebook.
import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import { byLabel, drive, newGame } from './helpers';
import type { Game } from '../src/engine/game';
import { THRONE, onThrone } from '../src/engine/board';
import { GRITO_MARKERS, OPENING, TUNING } from '../src/config';
import type { Decision, HouseId, Pos } from '../src/engine/types';
import { RULES, RULE_PARTS } from '../src/data/rules';
import { CARDS } from '../src/data/cards';
import { playScore } from '../src/ai/cardValues';
import { PERSONALITY, botChoose } from '../src/ai/bot';
import { makeRng } from '../src/engine/rng';
import { maskState } from '../src/net/serverCore';

const startTurn = (g: Game, id: number) => {
  (g as unknown as { startTurn: (p: unknown, x: boolean) => void }).startTurn(g.p(id), false);
};
const truce = OPENING.truceRounds;
beforeAll(() => { OPENING.truceRounds = 0; });
afterAll(() => { OPENING.truceRounds = truce; });

function table(houses: HouseId[] = ['brasador', 'kaysoley', 'ironvow']) {
  const g = newGame(houses.length, houses);
  for (const x of g.s.players) x.hand = [];
  const [a, b] = g.s.players;
  b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
  startTurn(g, 0);
  g.s.turn!.moved = true;
  return { g, a, b, c: g.s.players[2] };
}
// The first decision a flow asks, without answering it.
const firstAsk = (flow: Generator<Decision, unknown, number>) => {
  const r = flow.next();
  return r.done ? null : r.value;
};
const dests = (d: Decision | null) => (d?.options ?? []).map(o => o.value as Pos | null);
const eligibleRes = { influence: 3, fear: 3, wealth: 3 };

describe('Throne entry: only an eligible player may end their own move there', () => {
  it('a roll-and-move offers no Throne square unless eligible, but may pass over it', () => {
    const { g, a } = table();
    a.pos = { x: 8, y: 6 };
    const d = firstAsk(g.moveFree(a, 6));
    const to = dests(d);
    expect(to[0]).toBeNull();                                         // staying put is always allowed
    expect(to.some(q => q && onThrone(q))).toBe(false);
    expect(to.some(q => q && q.x === 8 && q.y === 10)).toBe(true);    // beyond the Throne, reached through it
    a.res = { ...eligibleRes };
    expect(dests(firstAsk(g.moveFree(a, 6))).filter(q => q && onThrone(q))).toHaveLength(4);
  });
  it('the switch turns it off', () => {
    const { g, a } = table();
    a.pos = { x: 8, y: 6 };
    TUNING.throneEntryEligibleOnly = false;
    try {
      expect(dests(firstAsk(g.moveFree(a, 3))).some(q => q && onThrone(q))).toBe(true);
    } finally { TUNING.throneEntryEligibleOnly = true; }
  });
  it('a one-square move whose only target is the Throne still lets you stay', () => {
    const { g, a } = table();
    a.pos = { x: 8, y: 7 };
    const d = firstAsk(g.stepToward(a, [THRONE[0]], 'step'));
    expect(d).toBeNull();                                             // only "Stay" was left, so nothing is asked
    expect(a.pos).toEqual({ x: 8, y: 7 });
  });
  it('your own straight-line move (Ayatsuri: you pick the distance) stops short of the Throne', () => {
    const { g, a } = table();
    a.pos = { x: 8, y: 6 };
    const d = firstAsk(g.moveStraight(a, 4, { dirs: ['south'] }));
    expect(d!.options.map(o => (o.value as { n: number }).n)).toEqual([0, 1, 4]);
  });
  it("a rival's card may still put you there (Forced Retreat, Forced March)", () => {
    const { g, a, b } = table();
    a.pos = { x: 8, y: 5 }; b.pos = { x: 8, y: 6 };
    g.p(0).hand = [44];
    drive(g.playHandCard(a, 44), byLabel('P1', 'South'));
    expect(b.pos).toEqual({ x: 8, y: 8 });
    expect(g.safeOnThrone(b)).toBe(false);                            // and gets no protection there
  });
  it('Bridge the Gap offers no Throne square unless eligible', () => {
    const { g, a } = table();
    a.pos = { x: 8, y: 6 };
    a.hand = [46];
    const flow = g.playHandCard(a, 46);
    let d = flow.next().value as Decision;
    while (d.kind !== 'square') d = flow.next(0).value as Decision;
    expect(dests(d).some(q => q && onThrone(q))).toBe(false);
  });
  it('bots never end a move on the Throne while not eligible', () => {
    for (let seed = 1; seed <= 6; seed++) {
      const g = newGame(4, undefined, seed);
      const rng = makeRng(seed);
      const flow = g.run();
      let r = flow.next();
      for (let i = 0; i < 4000 && !r.done; i++) {
        const d = r.value;
        r = flow.next(botChoose(g, d, rng));
        const t = g.s.turn;
        if (t && d.kind === 'move' && d.player === t.player) {
          const p = g.p(t.player);
          if (p.pos && onThrone(p.pos)) expect(g.eligible(p)).toBe(true);
        }
      }
    }
  });
});

describe('big tables: Heart Tokens count as at most 2 when dealing damage', () => {
  it('Agnivansh at 6 players: 2 + 1 = 3', () => {
    const g = newGame(6, ['agnivansh', 'dorini', 'brasador', 'kaysoley', 'ironvow', 'suzumori']);
    const [a, d] = g.s.players;
    d.pos = { x: a.pos!.x, y: a.pos!.y - 1 };
    d.maxHp = d.hp = 10; d.hand = []; a.hand = [];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    drive(g.basicAttack(a, d));
    expect(d.hp).toBe(7);
  });
  it('fixed-damage card attacks are unchanged; under 6 players there is no limit', () => {
    const g = newGame(6);
    const [a, b] = g.s.players;
    b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
    b.maxHp = b.hp = 10; b.hand = [];
    drive(g.attack(a, b, 'card', 1));
    expect(b.hp).toBe(9);
    expect(newGame(5).heartDamage(3)).toBe(3);
    expect(g.heartDamage(3)).toBe(2);
    expect(g.heartDamage(1)).toBe(1);
  });
  it('Challenge blows and the Sudden Death duel use the same limit', () => {
    const g = newGame(6);
    const [a, b] = g.s.players;
    for (const x of [a, b]) x.hand = [];
    b.maxHp = b.hp = 10;
    g.inChallenge = true;
    drive(g.attack(a, b, 'challenge'));
    expect(b.hp).toBe(8);
    g.inChallenge = false;
    const hp = { [a.id]: 3, [b.id]: 4 };
    // 3 vs 4 with no limit, the first striker wins (4→1, 3→2, 1→dead). With at most 2 a blow: 4→2, 3→1, 2→1, 1→0.
    expect(g.duel(a, b, hp).id).toBe(b.id);
    expect(newGame(4).duel(a, b, { [a.id]: 3, [b.id]: 4 }).id).toBe(a.id);
  });
});

describe('Unbroken from 2 or more Heart Tokens', () => {
  const setup = () => {
    const g = newGame(2, ['brasador', 'stillwater']);
    const [a, s] = g.s.players;
    s.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
    s.hand = []; a.hand = [];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    return { g, a, s };
  };
  it('saves a heir at 2 Heart Tokens', () => {
    const { g, a, s } = setup();
    s.hp = 2;
    drive(g.basicAttack(a, s));
    expect(s.hp).toBe(1);
    expect(s.gen).toBe(1);
  });
  it('does nothing at 1 Heart Token', () => {
    const { g, a, s } = setup();
    s.hp = 1;
    drive(g.basicAttack(a, s), byLabel('Wealth'));
    expect(s.gen).toBe(2);
  });
  it('a Blocked attack does not use it up', () => {
    const { g, a, s } = setup();
    s.hand = [58];
    drive(g.basicAttack(a, s), byLabel('Iron Guard'));
    expect(s.used.unbroken).toBeUndefined();
    g.s.turn!.attacks = 0; g.s.turn!.actions = 0;
    drive(g.basicAttack(a, s));
    expect(s.hp).toBe(1);
  });
});

describe("Brasador's Legacy card: +1 Fear on kill from the start", () => {
  it('a Yaguana holding it gains Fear on a Gen I kill; Brasador itself still waits for Gen III', () => {
    const g = newGame(3, ['vaitama', 'kaysoley', 'brasador']);
    const [y, k, b] = g.s.players;
    y.legacy = 'brasador';
    expect(g.hook(y, 'fearOnKill')).toBe(1);
    expect(g.hook(b, 'fearOnKill')).toBe(0);
    expect(g.legacyText('brasador')).toBe('+1 Fear on kill.');
    expect(g.legacyText('dorini')).toBe(g.house('dorini').passiveText[0]);
    drive(g.killPlayer(k, y), byLabel('Wealth'));
    expect(y.res.fear).toBe(1);
  });
  it("Song of Coaybay reads the Legacy card too; Guaíza copies the passive as it stands", () => {
    const g = newGame(2, ['vaitama', 'brasador']);
    const [y, b] = g.s.players;
    y.legacy = null;
    y.extraPassive = 'brasador';
    expect(g.hook(y, 'fearOnKill')).toBe(1);
    y.extraPassive = null;
    g.addEffect('mask', y.id, { at: 'turnStart', player: y.id }, { house: b.house, level: 1 });
    expect(g.hook(y, 'fearOnKill')).toBe(0);
  });
});

describe('cards and powers', () => {
  it('Stolen Goods is worth playing to a bot when a neighbour holds cards', () => {
    const { g, a, b } = table();
    b.hand = [1];
    expect(playScore(g, a, 50, PERSONALITY.brasador)).toBeGreaterThan(1);
  });
  it('after a Turnabout the new target may not Counterspell or Turnabout it', () => {
    const { g, a, b, c } = table();
    for (const x of g.s.players) x.res.influence = 3;
    a.hand = [34];                                         // Broken Trust
    b.hand = [126];
    c.hand = [63, 126];
    const asked: string[] = [];
    drive(g.playHandCard(a, 34), d => { asked.push(`${d.player}:${d.kind}`); return byLabel('P1', 'Play Turnabout', 'P2')(d); });
    expect(asked).not.toContain('2:confirm');
    expect(asked).not.toContain('2:reaction');
    expect(c.res.influence).toBe(2);
    expect(c.hand).toEqual([63, 126]);
  });
  it(`Grito de Guerra: at most ${GRITO_MARKERS} players marked at once`, () => {
    const g = newGame(4, ['brasador', 'kaysoley', 'ironvow', 'dorini']);
    const b = g.p(0);
    b.gen = 3;
    const grito = g.abilitiesOf(b).find(x => x.id === 'gritoDeGuerra')!;
    for (let i = 0; i < GRITO_MARKERS; i++) {
      startTurn(g, 0);
      expect(g.usableAbilities(b).some(x => x.id === grito.id)).toBe(true);
      drive(g.useAbility(b, grito));
    }
    startTurn(g, 0);
    expect(g.usableAbilities(b).some(x => x.id === grito.id)).toBe(false);
    const marked = g.s.players.find(p => g.findEffect('noFearGain', p.id))!;
    g.gain(marked, 'fear', 1);                            // the silenced gain brings the marker back
    expect(g.usableAbilities(b).some(x => x.id === grito.id)).toBe(true);
  });
  it('the Instant discard pile is public online; hands and the draw pile are not', () => {
    const g = newGame(3);
    g.s.instantDiscard = [112, 113];
    const v = maskState(g.s, 0);
    expect(v.instantDiscard).toEqual([112, 113]);
    expect(v.drawPile).toEqual([]);
    expect(v.players[1].hand).toEqual([]);
  });
});

describe('the rulebook in three parts (rules-decisions 87)', () => {
  const words = (part: string) => RULES.filter(s => s.part === part).flatMap(s => s.blocks.flatMap(b =>
    typeof b === 'string' ? [b] : 'quote' in b ? [b.quote] : 'list' in b ? b.list : b.steps)).join(' ').split(/\s+/).length;
  it('core first, then the appendix, then the reference card', () => {
    const order = RULES.map(s => RULE_PARTS.findIndex(p => p.id === s.part));
    expect([...order].sort((x, y) => x - y)).toEqual(order);
    expect(new Set(RULES.map(s => s.part))).toEqual(new Set(['core', 'appendix', 'reference']));
    expect(words('core')).toBeLessThan(1700);
  });
  it('the reference card lists every ◎ Target card', () => {
    const ref = RULES.find(s => s.part === 'reference')!.blocks.map(b => (typeof b === 'string' ? b : '')).join('\n');
    for (const c of CARDS.filter(x => x.targets)) expect(ref).toContain(c.name);
  });
});
