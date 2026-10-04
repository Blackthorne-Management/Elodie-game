import { describe, it, expect } from 'vitest';
import { byLabel, drive, newGame } from './helpers';
import { CARDS } from '../src/data';
import type { Game } from '../src/engine/game';
import { THRONE, inBoard, key, manhattan, step, walkDistances } from '../src/engine/board';
import { BOARD } from '../src/config';
import type { Decision, Expiry } from '../src/engine/types';

const startTurn = (g: Game, id: number) => {
  (g as unknown as { startTurn: (p: unknown, x: boolean) => void }).startTurn(g.p(id), false);
};
// The end-of-turn expiry step on its own.
const endTurn = (g: Game, id: number) => {
  (g as unknown as { expire: (m: (x: Expiry) => boolean) => void }).expire(x => x.at === 'turnEnd' && x.player === id);
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

// Run a test on an all-land board (no sea), for the pure movement shapes.
const allLand = (fn: () => void) => () => {
  const land = BOARD.land;
  BOARD.land = null;
  try { fn(); } finally { BOARD.land = land; }
};

describe('movement (Section 4)', () => {
  it('offers every square within the roll, turning allowed, never off the board', allLand(() => {
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
  }));
  it('Forced March still moves the full roll in a straight line', allLand(() => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    startTurn(g, 0);
    let seen: Decision | null = null;
    drive(g.moveStraight(p, 3, { full: true }), d => { seen = d; return 0; });
    expect(seen!.options.map(o => o.label)).toEqual(['South 3', 'East 3', 'West 3']);
  }));
  it('never offers a sea square, and counts steps around the sea', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);                                   // Brasador's seat on the northern cape
    startTurn(g, 0);
    let seen: Decision | null = null;
    drive(g.moveFree(p, 4), d => { seen = d; return 0; });
    const squares = seen!.options.slice(1).map(o => o.value as { x: number; y: number });
    expect(squares.length).toBeGreaterThan(0);
    expect(squares.every(q => inBoard(q))).toBe(true);
    const walk = walkDistances(p.pos!);
    expect(squares.every(q => walk.get(key(q))! <= 4)).toBe(true);
    // Straight moves stop at the shore: every square along each offered line is land, and the next isn't.
    const from = { ...p.pos! };
    drive(g.moveStraight(p, 3, { full: true }), d => { seen = d; return 0; });
    expect(seen!.options.length).toBeGreaterThan(0);
    for (const o of seen!.options) {
      const { d, n } = o.value as { d: 'north' | 'south' | 'east' | 'west'; n: number };
      for (let i = 1; i <= n; i++) expect(inBoard(step(from, d, i))).toBe(true);
      if (n < 3) expect(inBoard(step(from, d, n + 1))).toBe(false);
    }
    expect(seen!.options.some(o => (o.value as { n: number }).n < 3)).toBe(true);   // the shore cuts one line short
  });
  it('the sea leaves every seat on land, as far from the Throne and from each other as before', () => {
    const homes = Object.values(newGame(8).content.houses).map(h => h.home);
    for (const h of homes) {
      expect(inBoard(h)).toBe(true);
      const walk = walkDistances(h);
      expect(Math.min(...THRONE.map(t => walk.get(key(t))!))).toBe(Math.min(...THRONE.map(t => manhattan(h, t))));
      for (const o of homes) expect(walk.get(key(o))).toBe(manhattan(h, o));
    }
    for (const t of THRONE) expect(inBoard(t)).toBe(true);
  });
  it('Ironvow adds 1 to the roll', () => {
    const g = newGame(2, ['ironvow', 'dorini']);
    expect(g.hook(g.p(0), 'moveBonus')).toBe(1);
    expect(g.hook(g.p(1), 'moveBonus')).toBe(0);
  });
});

describe('resources (Section 5)', () => {
  it('pays 3 when alone on a tile, 2 when contested, nothing on your own tile', () => {
    const g = newGame(3, ['dorini', 'brasador', 'kaysoley']);
    const [dorini, brasador, kay] = g.s.players;
    startTurn(g, 2);
    g.resourceCheck(kay);                                  // own tile
    expect(kay.res.influence).toBe(0);
    kay.pos = { x: 5, y: 5 };
    startTurn(g, 1);
    brasador.pos = { ...g.house('kaysoley').home };      // Kay Soley's Court tile, alone
    g.resourceCheck(brasador);
    expect(brasador.res.influence).toBe(3);
    startTurn(g, 0);
    dorini.pos = { ...g.house('kaysoley').home };         // now shares the tile with Brasador
    g.resourceCheck(dorini);
    expect(dorini.res.influence).toBe(2);
  });
  it('never pays from the same tile twice in a row, even after stepping away', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    const court = { ...g.house('kaysoley').home };
    p.pos = court;
    startTurn(g, 0); g.resourceCheck(p);
    p.lastScoredTile = g.s.turn!.scoredTile;
    startTurn(g, 0); p.pos = { x: 5, y: 5 };                // a turn spent elsewhere, scoring nothing
    startTurn(g, 0); p.pos = court; g.resourceCheck(p);     // back again
    expect(p.res.influence).toBe(3);
    p.pos = { ...g.house('suzumori').home };                  // a different Court tile pays
    startTurn(g, 0); g.resourceCheck(p);
    expect(p.res.influence).toBe(6);
  });
  it('adds Dorini\'s bonus on Trade tiles', () => {
    const g = newGame(2, ['dorini', 'brasador']);
    const p = g.p(0);
    p.pos = { ...g.house('vaitama').home };              // an ownerless Trade tile
    startTurn(g, 0); g.resourceCheck(p);
    expect(p.res.wealth).toBe(4);
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
  it('attacking ends the turn (after moving), and the turn still draws back to 3', () => {
    const g = newGame(2, ['brasador', 'kaysoley']);
    const [a, b] = g.s.players;
    b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
    b.maxHp = b.hp = 10; b.hand = [];
    const kinds: string[] = [];
    drive(g.playTurn(a), d => {
      kinds.push(d.kind === 'turn' ? (d.options.map(o => (o.value as { type: string }).type).join('/')) : d.kind);
      if (d.kind === 'turn') {
        const atk = d.options.findIndex(o => (o.value as { type: string }).type === 'attack');
        const roll = d.options.findIndex(o => (o.value as { type: string }).type === 'roll');
        return roll >= 0 ? roll : atk >= 0 ? atk : d.options.length - 1;
      }
      return 0;   // stay put
    });
    expect(b.hp).toBe(10 - a.hp);
    expect(kinds.filter(k => k.includes('end')).length).toBe(1);   // one menu after moving, then the attack ended it
    expect(a.hand.length).toBe(3);
  });
  it('one action per turn: no cards before moving, and a card or an attack, not both', () => {
    const { g, a } = duelists();
    a.hand = [1, 15, 22];
    g.s.turn!.moved = false;
    const types = () => g.turnActions(a).map(o => o.value.type);
    expect(types()).not.toContain('card');                 // not before moving
    g.s.turn!.moved = true;
    expect(types()).toContain('card');
    expect(types()).toContain('attack');
    drive(g.playHandCard(a, 1));
    expect(types()).not.toContain('card');
    expect(types()).not.toContain('attack');                // the card was the action
  });
  it('Plunder waits for your next basic attack, up to the end of your next turn', () => {
    const { g, a, b } = duelists();
    b.maxHp = b.hp = 10;
    a.hand = [26];
    drive(g.playHandCard(a, 26));
    expect(g.s.discard).not.toContain(26);                 // in play, waiting
    endTurn(g, a.id);
    startTurn(g, a.id);
    drive(g.basicAttack(a, b));
    expect(a.res.wealth).toBe(2);
    expect(g.s.discard).toContain(26);
    drive(g.basicAttack(a, b));                            // pays only once
    expect(a.res.wealth).toBe(2);
  });
  it('Plunder lapses after your next turn, and pays nothing for a blocked attack', () => {
    const { g, a, b } = duelists();
    b.maxHp = b.hp = 10;
    a.hand = [26];
    drive(g.playHandCard(a, 26));
    endTurn(g, a.id); endTurn(g, a.id);
    expect(g.s.discard).toContain(26);
    a.hand = [26]; g.s.discard = [];
    drive(g.playHandCard(a, 26));
    b.hand = [58];                                         // Iron Guard
    drive(g.basicAttack(a, b), byLabel('Iron Guard'));
    expect(a.res.wealth).toBe(0);
    expect(g.s.effects.some(e => e.cardId === 26)).toBe(false);   // used up anyway
  });
  it("Elodie's Sorrow and Elodie's Exile can't take a player below 1 Heart Token", () => {
    const g = newGame(3);
    startTurn(g, 0);
    const [a, b, c] = g.s.players;
    a.hp = 1; b.hp = 3; c.hp = 2;
    drive(g.card(81).effect(g, a, g.card(81)));
    expect([a.hp, b.hp, c.hp]).toEqual([1, 2, 1]);
    expect(g.s.players.every(p => p.gen === 1)).toBe(true);
    b.pos = { x: 10, y: 10 };
    drive(g.card(89).effect(g, a, g.card(89)));
    expect(b.hp).toBe(1);
    expect(g.s.players.every(p => p.gen === 1)).toBe(true);
  });
  it('Vanishing Act moves you 1 after your next basic attack', () => {
    const { g, a, b } = duelists();
    b.maxHp = b.hp = 10;
    a.hand = [45];
    drive(g.playHandCard(a, 45));
    endTurn(g, a.id);
    startTurn(g, a.id);
    const before = { ...a.pos! };
    drive(g.basicAttack(a, b), d => (d.prompt.startsWith('Vanishing Act') ? 1 : 0));   // 0 = stay
    expect(Math.abs(a.pos!.x - before.x) + Math.abs(a.pos!.y - before.y)).toBe(1);
  });
  it('Golden Harvest stops you attacking this turn and your next', () => {
    const { g, a, b } = duelists();
    a.hand = [24];
    drive(g.playHandCard(a, 24));
    expect(a.res.wealth).toBe(2);
    endTurn(g, a.id);
    startTurn(g, a.id);
    expect(g.attackBlockedReason(a, b, 'basic')).toMatch(/may not attack/);
    endTurn(g, a.id);
    startTurn(g, a.id);
    expect(g.attackBlockedReason(a, b, 'basic')).toBeNull();
  });
  it('the Throne is sanctuary: no attacks onto or off it, ranged ones included', () => {
    const { g, a, b } = duelists();
    a.pos = { x: 9, y: 7 }; b.pos = { x: 9, y: 8 };            // b on the Throne, a right beside it
    expect(g.basicTargets(a)).toHaveLength(0);
    expect(g.attackBlockedReason(a, b, 'card')).toMatch(/Throne/);
    expect(g.attackBlockedReason(b, a, 'basic')).toMatch(/Throne/);   // nor from it
    a.hand = [CARDS.find(c => c.name === 'Shadow Strike')!.id];  // a ranged card has no one to hit
    expect(g.turnActions(a).some(o => o.value.type === 'card')).toBe(false);
    expect(g.attackBlockedReason(a, b, 'challenge')).toBeNull();     // challenges still happen
    b.pos = { x: 9, y: 10 };                                         // off the Throne: fair game
    a.pos = { x: 9, y: 11 };
    expect(g.basicTargets(a)).toEqual([b]);
  });
  it('no one dies on the Throne; other Heart Token loss stops at 1', () => {
    const { g, a } = duelists();
    a.pos = { x: 8, y: 8 }; a.hp = 1;
    g.damage(a, 1, null, '(test)');
    expect(a.hp).toBe(1);
    a.hp = 3;
    g.damage(a, 5, null, '(test)');
    expect(a.hp).toBe(1);
    expect(g.s.dying).toHaveLength(0);
    a.pos = { x: 5, y: 5 };
    g.damage(a, 1, null, '(test)');
    expect(g.s.dying).toHaveLength(1);
  });
  it("a new heir can't be attacked until the end of their first turn", () => {
    const { g, a, b } = duelists();
    b.hp = 1;
    drive(g.basicAttack(a, b), byLabel('Wealth'));        // b dies on a's turn; the heir rises at home
    expect(b.gen).toBe(2);
    b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };              // stand next to a again
    expect(g.attackBlockedReason(a, b, 'basic')).toMatch(/only just risen/);
    expect(g.basicTargets(a)).toHaveLength(0);
    expect(g.attackBlockedReason(a, b, 'challenge')).toBeNull();   // challenge fights still happen
    endTurn(g, a.id);
    startTurn(g, b.id);                                      // the heir's first turn: still safe
    expect(g.attackBlockedReason(a, b, 'basic')).toMatch(/only just risen/);
    endTurn(g, b.id);
    expect(g.attackBlockedReason(a, b, 'basic')).toBeNull();
  });
  it('a heir who fell on their own turn stays safe through their next turn', () => {
    const { g, a, b } = duelists();
    a.hp = 1;
    g.addEffect('newborn', b.id, { at: 'turnEnd', player: b.id });   // irrelevant noise for b
    expect(() => drive(g.killPlayer(a, b))).not.toThrow();
    endTurn(g, a.id);                                        // the turn a died on ends
    expect(g.findEffect('newborn', a.id)).toBeTruthy();
    startTurn(g, a.id); endTurn(g, a.id);
    expect(g.findEffect('newborn', a.id)).toBeFalsy();
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
  it('Swift Steed after moving moves you up to 2 more squares', () => {
    const g = newGame(2, ['brasador', 'dorini']);
    const p = g.p(0);
    p.hand = [41];
    startTurn(g, 0);
    g.s.turn!.moved = true;
    drive(g.playHandCard(p, 41), d => d.options.findIndex(o => JSON.stringify(o.value) === JSON.stringify({ x: 8, y: 2 })));
    expect(p.pos).toEqual({ x: 8, y: 2 });
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
    a.res = { influence: 2, fear: 4, wealth: 2 };
    startTurn(g, 0);
    g.s.turn!.moved = true;
    return { g, a, b, c };
  };
  it('needs 8 total with 1+ in every pillar at 2-3 players, 9 with 2+ above; no one-pillar route', () => {
    expect(newGame(3).thresholds(newGame(3).p(0))).toEqual({ combined: 8, minEach: 1, single: Infinity });
    expect(newGame(4).thresholds(newGame(4).p(0))).toEqual({ combined: 9, minEach: 2, single: Infinity });
  });
  it('a big total is not enough without the minimum in every pillar', () => {
    const g = newGame(4);
    const p = g.p(0);
    p.res = { influence: 0, fear: 12, wealth: 0 };
    expect(g.eligible(p)).toBe(false);
    p.res = { influence: 1, fear: 6, wealth: 4 };
    expect(g.eligible(p)).toBe(false);
    p.res = { influence: 2, fear: 5, wealth: 2 };
    expect(g.claimRoute(p)).toBe('combined');
  });
  it('an unchallenged claim wins', () => {
    const { g, a } = atThrone();
    drive(g.claim(a));
    expect(g.s.winner).toBe(a.id);
  });
  it('a challenger who kills the claimant stops the claim but does not win', () => {
    const { g, a, b } = atThrone();
    b.res = { influence: 1, fear: 1, wealth: 6 };   // eligible
    a.hp = 1; b.hp = 2;
    b.hand = []; a.hand = [];
    expect(() => drive(g.claim(a), byLabel('Challenge!'))).toThrow();   // EndTurn: the claimant died
    expect(g.s.winner).toBeNull();
    expect(a.gen).toBe(2);
  });
  it('the claimant strikes first and can beat the challenger', () => {
    const { g, a, b } = atThrone();
    b.res = { influence: 1, fear: 1, wealth: 6 };
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
  it('only picks harmless Instants from the top 5 of the discard pile', () => {
    const g = newGame(3);
    g.s.discard = [83, 1, 2, 82, 81, 112];   // Blessing is 6th from the top; The Harvest, Elodie's Sorrow (barred), Merchant's Windfall
    expect(g.specterChoices().sort((x, y) => x - y)).toEqual([82, 112]);
    g.s.discard = [1, 2, 82, 112];
    expect(g.specterChoices()).toEqual([]);
  });
  it('a played Specter card leaves the game', () => {
    const g = newGame(3);
    const sp = g.p(2);
    sp.specter = true; sp.pos = null; sp.hand = [];
    g.s.discard = [1, 2, 3, 4, 112];
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
