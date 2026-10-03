import { describe, it, expect } from 'vitest';
import { byLabel, drive, newGame } from './helpers';
import { CARDS } from '../src/data';
import type { Game } from '../src/engine/game';
import { key } from '../src/engine/board';
import type { Decision } from '../src/engine/types';

const startTurn = (g: Game, id: number) => {
  (g as unknown as { startTurn: (p: unknown, x: boolean) => void }).startTurn(g.p(id), false);
};

describe('setup (Section 3)', () => {
  it('deals 3 Hand Cards (never Instants) and starts everyone at home with Gen I HP', () => {
    const g = newGame(8);
    for (const p of g.s.players) {
      expect(p.hand).toHaveLength(3);
      for (const c of p.hand) expect(g.card(c).kind).toBe('hand');
      expect(p.pos).toEqual(g.house(p).home);
      expect(p.hp).toBe(g.house(p).hp[0]);
    }
    expect(new Set(g.s.players.map(p => p.house)).size).toBe(8);
    expect(g.s.drawPile.length).toBe(120 - 24);
  });
  it('can seat 2 players, leaving 6 tiles ownerless', () => {
    const g = newGame(2, ['dorini', 'brasador']);
    expect(g.s.players.map(p => p.house)).toEqual(['dorini', 'brasador']);
  });
  it('rejects 1 or 9 players', () => {
    expect(() => newGame(1)).toThrow();
    expect(() => newGame(9)).toThrow();
  });
});

describe('movement (Section 4)', () => {
  it('offers every square within the roll, turning allowed, never off the board', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);                       // Brasador at column 9, row 1 (top edge)
    startTurn(g, 0);
    let seen: Decision | null = null;
    drive(g.moveFree(p, 3), d => { seen = d; return 0; });
    const squares = seen!.options.map(o => o.value as { x: number; y: number } | null);
    expect(squares[0]).toBeNull();                                         // stay
    expect(squares).toContainEqual({ x: 9, y: 2 });                        // 2 down, 1 right
    expect(squares).toContainEqual({ x: 8, y: 3 });                        // 3 straight down
    expect(squares).not.toContainEqual({ x: 9, y: 3 });                    // 4 steps away
    expect(squares.every(q => !q || q.y >= 0)).toBe(true);                 // nothing off the top edge
    expect(squares.length).toBe(1 + 6 + 5 + 3 + 1);                       // stay + rows 1-4 below the edge square
  });
  it('Forced March still moves the full roll in a straight line', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    startTurn(g, 0);
    let seen: Decision | null = null;
    drive(g.moveStraight(p, 3, { full: true }), d => { seen = d; return 0; });
    expect(seen!.options.map(o => o.label)).toEqual(['South 3', 'East 3', 'West 3']);
  });
  it('Ironvow adds 1 to the roll', () => {
    const g = newGame(2, ['ironvow', 'dorini']);
    expect(g.hook(g.p(0), 'moveBonus')).toBe(1);
    expect(g.hook(g.p(1), 'moveBonus')).toBe(0);
  });
});

describe('resources (Section 5)', () => {
  it('pays 2 when alone on a tile, 1 when contested, nothing on your own tile', () => {
    const g = newGame(3, ['dorini', 'brasador', 'kaysoley']);
    const [dorini, brasador, kay] = g.s.players;
    startTurn(g, 2);
    g.resourceCheck(kay);                                  // own tile
    expect(kay.res.influence).toBe(0);
    kay.pos = { x: 5, y: 5 };
    startTurn(g, 1);
    brasador.pos = { ...g.house('kaysoley').home };      // Kay Soley's Court tile, alone
    g.resourceCheck(brasador);
    expect(brasador.res.influence).toBe(2);
    startTurn(g, 0);
    dorini.pos = { ...g.house('kaysoley').home };         // now shares the tile with Brasador
    g.resourceCheck(dorini);
    expect(dorini.res.influence).toBe(1);
  });
  it('does not pay from the same tile two turns running', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    p.pos = { ...g.house('kaysoley').home };
    startTurn(g, 0); g.resourceCheck(p);
    p.prevScoredTile = g.s.turn!.scoredTile;
    startTurn(g, 0); g.resourceCheck(p);
    expect(p.res.influence).toBe(2);
  });
  it('adds Dorini\'s bonus on Trade tiles', () => {
    const g = newGame(2, ['dorini', 'brasador']);
    const p = g.p(0);
    p.pos = { ...g.house('vaitama').home };              // an ownerless Trade tile
    startTurn(g, 0); g.resourceCheck(p);
    expect(p.res.wealth).toBe(3);
  });
});

describe('combat and death (Sections 6 and 9)', () => {
  const duelists = () => {
    const g = newGame(2, ['brasador', 'kaysoley']);
    const [a, b] = g.s.players;
    b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
    a.hand = []; b.hand = [];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    return { g, a, b };
  };
  it('deals damage equal to the attacker\'s Heart Tokens', () => {
    const { g, a, b } = duelists();
    b.maxHp = b.hp = 10;
    drive(g.basicAttack(a, b));
    expect(b.hp).toBe(10 - a.hp);
  });
  it('a kill: the victim halves a pool, holds a Grudge, and their heir rises at home', () => {
    const { g, a, b } = duelists();
    b.res.wealth = 5;
    drive(g.basicAttack(a, b), byLabel('Wealth'));
    expect(b.res.wealth).toBe(3);
    expect(b.gen).toBe(2);
    expect(b.hp).toBe(g.house(b).hp[1]);
    expect(b.pos).toEqual(g.house(b).home);
    expect(b.grudges).toEqual([a.id]);
    expect(a.kills).toBe(1);
    expect(a.res.fear).toBe(1);                         // Sangre Ardiente
  });
  it('a Reckoning steals 1 and settles the Grudge without starting a new one', () => {
    const { g, a, b } = duelists();
    a.grudges = [b.id];
    b.res.influence = 2;
    drive(g.basicAttack(a, b), byLabel('Influence'));
    expect(a.reckonings).toBe(1);
    expect(a.grudges).toEqual([]);
    expect(b.grudges).toEqual([]);
    expect(a.res.influence).toBe(1);                    // 2 halved to 1, then 1 stolen
    expect(b.res.influence).toBe(0);
  });
  it('a Gen IV death makes a Specter', () => {
    const { g, a, b } = duelists();
    b.gen = 4; b.hp = 1;
    drive(g.basicAttack(a, b));
    expect(b.specter).toBe(true);
    expect(b.pos).toBeNull();
  });
  it('Iron Guard negates an attack', () => {
    const { g, a, b } = duelists();
    b.hand = [58];
    const hp = b.hp;
    drive(g.basicAttack(a, b), byLabel('Iron Guard'));
    expect(b.hp).toBe(hp);
    expect(g.s.discard).toContain(58);
  });
  it('Riposte negates and hits back for 1', () => {
    const { g, a, b } = duelists();
    b.hand = [59];
    drive(g.basicAttack(a, b), byLabel('Riposte'));
    expect(a.hp).toBe(g.house(a).hp[0] - 1);
  });
  it('truces stop basic attacks', () => {
    const { g, a, b } = duelists();
    g.addEffect('truce', a.id, { at: 'turnStart', player: a.id }, { other: b.id });
    expect(g.basicTargets(a)).toHaveLength(0);
  });
  it('Brasador from Gen III takes +1 damage while the most Feared', () => {
    const { g, a, b } = duelists();
    a.gen = 3; a.res.fear = 5; a.maxHp = a.hp = 4;
    b.maxHp = b.hp = 2;
    // b attacks a: damage = 2 + 1
    startTurn(g, 1);
    drive(g.attack(b, a, 'basic'));
    expect(a.hp).toBe(1);
  });
});

describe('cards', () => {
  const play = (id: number, houses = ['brasador', 'dorini'] as const, pick?: (d: Decision) => number) => {
    const g = newGame(2, [...houses]);
    const p = g.p(0);
    p.hand = [id];
    startTurn(g, 0);
    drive(g.playHandCard(p, id), pick);
    return { g, p, o: g.p(1) };
  };
  it('Royal Favor gains 2 Influence', () => {
    expect(play(1).p.res.influence).toBe(2);
  });
  it('Blood Oath gains 2 Fear and costs a Heart Token', () => {
    const { p, g } = play(11);
    expect(p.res.fear).toBe(2);
    expect(p.hp).toBe(g.house(p).hp[0] - 1);
  });
  it('Dread Banner stays marked until the next attack', () => {
    const { g } = play(12);
    expect(g.s.effects.some(e => e.cardId === 12)).toBe(true);
    expect(g.s.discard).not.toContain(12);
  });
  it('Swift Steed before moving adds 2 to the roll', () => {
    const { g } = play(41);
    expect(g.s.turn!.rollBonus).toBe(2);
  });
  it('Homeward Bound teleports home', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    p.pos = { x: 5, y: 5 };
    p.hand = [47];
    startTurn(g, 0);
    drive(g.playHandCard(p, 47));
    expect(p.pos).toEqual(g.house(p).home);
  });
  it('Counterspell negates a targeted Hand Card', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const [p, o] = g.s.players;
    o.res.influence = 3;
    o.hand = [63];
    p.hand = [34];                                        // Broken Trust
    startTurn(g, 0);
    drive(g.playHandCard(p, 34), byLabel('Counterspell'));
    expect(o.res.influence).toBe(3);
  });
  it('every Instant resolves without error from any seat', () => {
    for (const c of CARDS.filter(x => x.kind === 'instant')) {
      const g = newGame(4);
      startTurn(g, 0);
      expect(() => drive(g.resolveCard(c, g.p(0)))).not.toThrow();
    }
  });
});

describe('winning (Section 8)', () => {
  const atThrone = () => {
    const g = newGame(3, ['brasador', 'dorini', 'kaysoley']);
    const [a, b, c] = g.s.players;
    a.pos = { x: 8, y: 8 };
    a.res.fear = 6;
    startTurn(g, 0);
    g.s.turn!.moved = true;
    return { g, a, b, c };
  };
  it('uses 8/5 thresholds at 2-3 players and 10/6 above', () => {
    expect(newGame(3).thresholds(newGame(3).p(0))).toEqual({ combined: 8, single: 5 });
    expect(newGame(4).thresholds(newGame(4).p(0))).toEqual({ combined: 10, single: 6 });
  });
  it('an unchallenged claim wins', () => {
    const { g, a } = atThrone();
    drive(g.claim(a));
    expect(g.s.winner).toBe(a.id);
  });
  it('a challenger who kills the claimant stops the claim but does not win', () => {
    const { g, a, b } = atThrone();
    b.res.wealth = 6;                     // eligible
    a.hp = 1; b.hp = 2;
    b.hand = []; a.hand = [];
    expect(() => drive(g.claim(a), byLabel('Challenge!'))).toThrow();   // EndTurn: the claimant died
    expect(g.s.winner).toBeNull();
    expect(a.gen).toBe(2);
  });
  it('the claimant strikes first and can beat the challenger', () => {
    const { g, a, b } = atThrone();
    b.res.wealth = 6;
    a.hp = 3; b.hp = 2;
    b.hand = []; a.hand = [];
    drive(g.claim(a), byLabel('Challenge!'));
    expect(g.s.winner).toBe(a.id);
    expect(b.gen).toBe(2);
  });
  it('Kay Soley IV needs 2 less combined', () => {
    const g = newGame(4, ['kaysoley', 'brasador', 'dorini', 'ironvow']);
    const k = g.p(0);
    k.gen = 4;
    k.res = { influence: 4, fear: 2, wealth: 2 };
    expect(g.eligible(k)).toBe(true);
    k.gen = 3;
    expect(g.eligible(k)).toBe(false);
  });
  it('Sudden Death goes to the highest combined total', () => {
    const g = newGame(3);
    g.p(1).res.wealth = 4;
    g.suddenDeath();
    expect(g.s.winner).toBe(1);
  });
  it('Sudden Death tie-breaks on the best single pillar', () => {
    const g = newGame(3);
    g.p(0).res = { influence: 2, fear: 2, wealth: 0 };
    g.p(2).res = { influence: 3, fear: 1, wealth: 0 };
    g.suddenDeath();
    expect(g.s.winner).toBe(2);
  });
});

describe('the Specter (Section 10)', () => {
  it('only picks harmless Instants from the top 3 of the discard pile', () => {
    const g = newGame(3);
    g.s.discard = [82, 81, 112];      // The Harvest, Elodie's Sorrow (barred), Merchant's Windfall
    expect(g.specterChoices().sort((x, y) => x - y)).toEqual([82, 112]);
    g.s.discard = [82, 112];
    expect(g.specterChoices()).toEqual([]);
  });
  it('a played Specter card leaves the game', () => {
    const g = newGame(3);
    const sp = g.p(2);
    sp.specter = true; sp.pos = null; sp.hand = [];
    g.s.discard = [1, 2, 112];
    drive(g.specterTurn(sp), byLabel("Merchant's Windfall", 'P0'));
    expect(g.s.removed).toEqual([112]);
    expect(g.p(0).res.wealth).toBe(1);
  });
});

describe('houses', () => {
  it('Vai\'tama inherits a Legacy on death', () => {
    const g = newGame(2, ['vaitama', 'brasador']);
    const [v, b] = g.s.players;
    b.pos = { x: v.pos!.x, y: v.pos!.y + 1 };
    startTurn(g, 1);
    g.s.turn!.moved = true;
    v.hand = [];
    drive(g.basicAttack(b, v));
    expect(v.legacy).toBe('vaitama');           // only Vai'tama has lost a character so far
  });
  it('Agnivansh basic attacks deal +1', () => {
    const g = newGame(2, ['agnivansh', 'dorini']);
    const [a, d] = g.s.players;
    d.pos = { x: a.pos!.x, y: a.pos!.y - 1 };
    d.maxHp = d.hp = 10; d.hand = [];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    drive(g.basicAttack(a, d));
    expect(d.hp).toBe(10 - 4);
  });
  it('Stillwater can cancel a Reckoning bonus', () => {
    const g = newGame(2, ['brasador', 'stillwater']);
    const [a, s] = g.s.players;
    s.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
    a.grudges = [s.id];
    s.res.wealth = 2; s.hand = [];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    drive(g.basicAttack(a, s), byLabel('Wealth', 'Cancel it'));
    expect(a.res.wealth).toBe(0);
    expect(s.used.reckoningCancel).toBe(1);
  });
  it('Suzumori\'s Kagemimi reveals a hand once per round', () => {
    const g = newGame(2, ['suzumori', 'dorini']);
    const s = g.p(0);
    startTurn(g, 0);
    const a = g.usableAbilities(s).find(x => x.id === 'kagemimi')!;
    drive(g.useAbility(s, a));
    expect(g.s.log.at(-1)!.kind).toBe('reveal');
    expect(g.usableAbilities(s).some(x => x.id === 'kagemimi')).toBe(false);
  });
  it('visited squares are tracked for Hidden Path', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    g.moveTo(p, { x: 8, y: 3 }, 'moves');
    expect(p.visited).toContain(key({ x: 8, y: 3 }));
  });
});
