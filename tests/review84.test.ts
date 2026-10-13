// The design review changes (docs/REVIEW-2026-10.md, rules-decisions 84): card fixes, the two discard piles,
// lasting cards, turn-based truces, Ambush, and the Sudden Death duel chain.
import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import { byLabel, drive, newGame } from './helpers';
import { CARDS, TARGET_CARDS } from '../src/data/cards';
import type { Game } from '../src/engine/game';
import { manhattan } from '../src/engine/board';
import { OPENING } from '../src/config';
import type { Decision, Expiry, HouseId } from '../src/engine/types';
import { cardTiming } from '../src/ui/cardKind';

const startTurn = (g: Game, id: number) => {
  (g as unknown as { startTurn: (p: unknown, x: boolean) => void }).startTurn(g.p(id), false);
};
const endTurn = (g: Game, id: number) => {
  (g as unknown as { expire: (m: (x: Expiry) => boolean) => void }).expire(x => x.at === 'turnEnd' && x.player === id);
};

const truce = OPENING.truceRounds;
beforeAll(() => { OPENING.truceRounds = 0; });
afterAll(() => { OPENING.truceRounds = truce; });

// Two players side by side, P0 to act (moved already), empty hands.
function table(houses: HouseId[] = ['brasador', 'kaysoley', 'ironvow']) {
  const g = newGame(houses.length, houses);
  for (const x of g.s.players) x.hand = [];
  const [a, b] = g.s.players;
  b.pos = { x: a.pos!.x, y: a.pos!.y + 1 };
  startTurn(g, 0);
  g.s.turn!.moved = true;
  return { g, a, b, c: g.s.players[2] };
}
const play = (g: Game, id: number, pick?: (d: Decision) => number) => {
  g.p(0).hand.push(id);
  drive(g.playHandCard(g.p(0), id), pick);
};
const out = (g: Game, id: number) => g.s.effects.some(e => e.cardId === id);

describe('two discard piles', () => {
  it('Hand Cards go to the Hand Card pile, Instants to the Instant pile', () => {
    const { g, a } = table();
    play(g, 1);                                           // Royal Favor
    expect(g.s.handDiscard).toEqual([1]);
    g.s.drawPile.push(112);                               // Merchant's Windfall on top
    drive(g.drawOne(a));
    expect(g.s.instantDiscard).toEqual([112]);
    expect(g.s.handDiscard).toEqual([1]);
  });
  it('when the draw pile runs out, both piles are shuffled into a new one', () => {
    const { g, a } = table();
    g.s.drawPile = [];
    g.s.handDiscard = [1, 2];
    g.s.instantDiscard = [112, 113];
    drive(g.drawOne(a));
    expect(g.s.handDiscard.length + g.s.instantDiscard.length + g.s.drawPile.length + a.hand.length).toBe(4);
    expect(g.s.drawPile.length).toBe(3);
  });
  it('with both piles and the draw pile empty, nothing is drawn', () => {
    const { g, a } = table();
    g.s.drawPile = []; g.s.handDiscard = []; g.s.instantDiscard = [];
    expect(drive(g.drawOne(a))).toBe(false);
  });
});

describe('lasting cards stay face up until their effect ends', () => {
  it('Hex of Withering stays out until it strikes', () => {
    const { g, b } = table();
    play(g, 29, byLabel('P1'));
    expect(out(g, 29)).toBe(true);
    expect(g.s.handDiscard).not.toContain(29);
    drive(g.playTurn(b), () => 0);
    expect(out(g, 29)).toBe(false);
    expect(g.s.handDiscard).toContain(29);
  });
  it('Confusion, Forced March, Sabotage, Burn the Village, Golden Harvest, Dread Banner, Marked for Death', () => {
    for (const id of [37, 38, 40, 8, 24, 12, 31]) {
      const { g } = table();
      play(g, id, byLabel('P1'));
      expect(out(g, id)).toBe(true);
      expect(g.s.handDiscard).not.toContain(id);
    }
  });
  it('Shield Wall stays out until the end of the turn', () => {
    const { g, a, b } = table();
    b.hand = [61];
    drive(g.basicAttack(a, b), byLabel('Shield Wall'));
    expect(out(g, 61)).toBe(true);
    endTurn(g, a.id);
    expect(out(g, 61)).toBe(false);
    expect(g.s.handDiscard).toContain(61);
  });
  it('a death discards the lasting cards on that character, except truces, Ceasefire and Golden Harvest', () => {
    const { g, a, b } = table();
    g.addEffect('hex', b.id, { at: 'consumed' }, { cardId: 29 });
    g.addEffect('confusion', b.id, { at: 'consumed' }, { cardId: 37 });
    g.addEffect('dreadBanner', b.id, { at: 'consumed' }, { cardId: 12 });
    g.addEffect('ceasefire', b.id, { at: 'turnStart', player: b.id }, { cardId: 56 });
    g.addEffect('truce', b.id, { at: 'turnStart', player: b.id }, { other: a.id, cardId: 54 });
    g.addEffect('noAttack', b.id, { at: 'turnEnd', player: b.id, turns: 2 }, { cardId: 24 });
    g.damage(b, b.hp, a.id);
    drive(g.flushDeaths());
    for (const id of [29, 37, 12]) expect(g.s.handDiscard).toContain(id);
    for (const id of [56, 54, 24]) expect(out(g, id)).toBe(true);
  });
});

describe('truces last a number of turns', () => {
  it('Ceasefire: no one may attack you until your next turn starts', () => {
    const { g, a, b } = table();
    g.p(0).hand.push(56);
    drive(g.playHandCard(a, 56));
    expect(g.attackBlockedReason(b, a, 'basic')).toBe('ceasefire');
    startTurn(g, b.id);                                   // other turns pass; it still holds
    expect(g.attackBlockedReason(b, a, 'basic')).toBe('ceasefire');
    startTurn(g, a.id);
    expect(g.attackBlockedReason(b, a, 'basic')).toBeNull();
    expect(g.s.handDiscard).toContain(56);
  });
  it('Blood Pact lasts until your turn after next starts', () => {
    const { g, a, b } = table();
    play(g, 57, byLabel('P1'));
    expect(a.res.fear).toBe(1);
    expect(b.res.fear).toBe(1);
    startTurn(g, a.id);
    expect(g.attackBlockedReason(a, b, 'basic')).toBe('truce');
    startTurn(g, a.id);
    expect(g.attackBlockedReason(a, b, 'basic')).toBeNull();
    expect(g.s.handDiscard).toContain(57);
  });
  it("Kay Soley's Sèman Lapè lasts until your turn after next starts", () => {
    const { g, a, b } = table(['kaysoley', 'dorini']);
    a.gen = 2;
    const ab = g.abilitiesOf(a).find(x => x.id === 'semanLape')!;
    drive(g.useAbility(a, ab), byLabel('P1'));
    startTurn(g, a.id);
    expect(g.attackBlockedReason(b, a, 'basic')).toBe('truce');
    startTurn(g, a.id);
    expect(g.attackBlockedReason(b, a, 'basic')).toBeNull();
  });
});

describe('Reactions', () => {
  it('Ambush attacks for 1 damage, and it can be Blocked', () => {
    const { g, a, b } = table();
    b.hand = [125];
    drive(g.ambush(a), byLabel('Play Ambush', 'Take'));
    expect(a.hp).toBe(a.maxHp - 1);
    b.hand = [125];
    a.hand = [58];
    drive(g.ambush(a), byLabel('Play Ambush', 'Iron Guard'));
    expect(a.hp).toBe(a.maxHp - 1);
  });
  it('Counterspell and Turnabout answer only Target cards, and those are marked', () => {
    expect(CARDS.filter(c => c.targets).map(c => c.id)).toEqual(TARGET_CARDS);
    for (const c of CARDS.filter(x => x.targets)) expect(cardTiming(c)).toMatch(/◎/);
    const { g, b } = table();
    b.res.wealth = 2;
    b.hand = [63];
    play(g, 36, byLabel('P1', 'Counterspell'));          // Robbed Blind is a Target card
    expect(b.res.wealth).toBe(2);
  });
});

describe('Sudden Death', () => {
  it('3 tied players: the earliest seat fights the next, and the winner fights on with what they have left', () => {
    const g = newGame(3);
    for (const p of g.s.players) p.res = { influence: 2, fear: 2, wealth: 2 };
    g.p(0).hp = 2;                                         // beats P1 but is left at 1, then loses to P2
    g.suddenDeath();
    expect(g.s.winner).toBe(2);
  });
});

describe('card fixes', () => {
  it('Ancient Charter, Iron Reputation and Merchant\'s Gambit gain 3 on their tile', () => {
    const cases: [number, HouseId, 'influence' | 'fear' | 'wealth'][] = [[7, 'suzumori', 'influence'], [14, 'ironvow', 'fear'], [21, 'vaitama', 'wealth']];
    for (const [id, home, x] of cases) {
      const { g, a } = table();
      a.pos = { ...g.house(home).home };
      play(g, id);
      expect(a.res[x]).toBe(3);
    }
  });
  it('Hidden Vault gains 3 with no Wealth, 2 otherwise', () => {
    let t = table();
    play(t.g, 18);
    expect(t.a.res.wealth).toBe(3);
    t = table();
    t.a.res.wealth = 1;
    play(t.g, 18);
    expect(t.a.res.wealth).toBe(3);
  });
  it('Counterfeit Coin gains 1 Wealth and 1 resource of your choice', () => {
    const { g, a } = table();
    play(g, 22, byLabel('Fear'));
    expect(a.res).toEqual({ influence: 0, fear: 1, wealth: 1 });
  });
  it('Caravan Toll gains 1 Wealth, plus 1 per other player on your square', () => {
    const { g, a, b } = table();
    b.pos = { ...a.pos! };
    play(g, 17);
    expect(a.res.wealth).toBe(2);
  });
  it('Market Day: draw 2, keep 1, the other goes under the Hand Card pile', () => {
    const { g, a } = table();
    a.hand = [2, 3];
    g.s.handDiscard = [5];
    g.s.drawPile.push(15, 1);                              // Royal Favor on top, then Smuggler's Route
    play(g, 19, byLabel("Smuggler's Route"));
    expect(a.res.wealth).toBe(1);
    expect(a.hand).toEqual([2, 3, 15]);
    expect(g.s.handDiscard).toEqual([1, 5, 19]);
  });
  it('Market Day: an Instant among the two resolves and counts as one of them', () => {
    const { g, a } = table();
    g.s.drawPile.push(15, 112);                            // Merchant's Windfall on top
    play(g, 19);
    expect(a.res.wealth).toBe(2);
    expect(a.hand).toEqual([15]);
    expect(g.s.instantDiscard).toEqual([112]);
  });
  it('Bridge the Gap moves you anywhere within 5 squares', () => {
    const { g, a } = table();
    const from = { ...a.pos! };
    let seen: Decision | null = null;
    play(g, 46, d => { seen = d; return d.options.length - 1; });
    expect(seen!.options.every(o => manhattan(o.value as { x: number; y: number }, from) <= 5)).toBe(true);
    expect(manhattan(a.pos!, from)).toBeLessThanOrEqual(5);
  });
  it('Plunder and Vanishing Act gain 1 Wealth when played', () => {
    for (const id of [26, 45]) {
      const { g, a } = table();
      play(g, id);
      expect(a.res.wealth).toBe(1);
    }
  });
  it('Uneasy Trade never swaps a resource for the same kind', () => {
    const { g, a, b } = table();
    a.res.fear = 2;
    b.res.fear = 2; b.res.wealth = 1;
    play(g, 49);                                         // give Fear: the only thing to take is Wealth
    expect(a.res).toEqual({ influence: 0, fear: 1, wealth: 1 });
    expect(b.res).toEqual({ influence: 0, fear: 3, wealth: 0 });
  });
  it('Stolen Goods: the robbed player picks any card from the Hand Card discard pile', () => {
    const { g, a, b } = table();
    b.hand = [41];
    g.s.handDiscard = [1, 2, 3];
    g.s.instantDiscard = [112];
    play(g, 50, d => (d.player === b.id ? d.options.findIndex(o => o.value === 2) : 0));
    expect(a.hand).toEqual([41]);
    expect(b.hand).toEqual([2]);
    expect(g.s.handDiscard).toEqual([1, 3, 50]);
  });
  it('Black Market Contact swaps your hand for the top 3 of the Hand Card pile', () => {
    const { g, a } = table();
    a.hand = [1, 2];
    g.s.handDiscard = [5, 6, 7, 8];
    g.s.instantDiscard = [112];
    play(g, 52);
    expect(a.hand).toEqual([6, 7, 8]);
    expect(g.s.handDiscard).toEqual([5, 1, 2, 52]);
  });
  it("Broker's Fee shows you both hands", () => {
    const { g, b, c } = table();
    b.hand = [1]; c.hand = [2];
    play(g, 53);
    expect(g.s.log.filter(e => e.kind === 'reveal' && e.visibleTo?.includes(0)).length).toBe(2);
    expect(b.hand).toEqual([2]);
  });
  it('Dodge negates and gains a resource; Steadfast negates and heals at 1 Heart Token', () => {
    const { g, a, b } = table();
    b.hand = [62];
    drive(g.basicAttack(a, b), byLabel('Dodge', 'Wealth'));
    expect(b.hp).toBe(b.maxHp);
    expect(b.res.wealth).toBe(1);
    b.hand = [64]; b.hp = 1;
    drive(g.basicAttack(a, b), byLabel('Steadfast'));
    expect(b.hp).toBe(2);
    b.hand = [64]; b.hp = b.maxHp;
    drive(g.basicAttack(a, b), byLabel('Steadfast'));
    expect(b.hp).toBe(b.maxHp);
  });
  it("Gambler's Luck gains at most 2", () => {
    for (let seed = 1; seed < 30; seed++) {
      const g = newGame(2, ['brasador', 'ironvow'], seed);
      drive(g.resolveCard(g.card(70), g.p(0)));
      expect(g.p(0).res.wealth).toBeLessThanOrEqual(2);
    }
  });
  it('Whispers at Court: the player with the most Influence loses 1 (tie: no effect)', () => {
    const { g, a, b } = table();
    b.res.influence = 3;
    drive(g.resolveCard(g.card(101), a));
    expect(b.res.influence).toBe(2);
    a.res.influence = 2;
    drive(g.resolveCard(g.card(101), a));
    expect(b.res.influence).toBe(2);
  });
  it('Loose Lips: the player to your left reveals their hand to the table', () => {
    const { g, a } = table();
    g.p(1).hand = [1];
    drive(g.resolveCard(g.card(110), a));
    const e = g.s.log.at(-1)!;
    expect(e.player).toBe(1);
    expect(e.visibleTo).toBeUndefined();
  });
  it('Caravan Passing: even you gain 1 Wealth, odd the player to your left does', () => {
    let mine = 0, left = 0;
    for (let seed = 1; seed < 20; seed++) {
      const g = newGame(3, ['brasador', 'ironvow', 'kaysoley'], seed);
      drive(g.resolveCard(g.card(111), g.p(0)));
      mine += g.p(0).res.wealth; left += g.p(1).res.wealth;
      expect(g.p(0).res.wealth + g.p(1).res.wealth).toBe(1);
      expect(g.p(2).res.wealth).toBe(0);
    }
    expect(mine).toBeGreaterThan(0);
    expect(left).toBeGreaterThan(0);
  });
  it('Treasure Map reads the top of the Hand Card pile', () => {
    const { g, a } = table();
    g.s.handDiscard = [15];                               // Smuggler's Route mentions Wealth
    g.s.instantDiscard = [68];
    drive(g.resolveCard(g.card(120), a));
    expect(a.res.wealth).toBe(1);
  });
  it("Sasayaki Ha shows Suzumori the hand before choosing", () => {
    const { g, a, b } = table(['suzumori', 'dorini']);
    a.gen = 2;
    b.hand = [1, 2];
    drive(g.useAbility(a, g.abilitiesOf(a).find(x => x.id === 'sasayakiHa')!));
    expect(g.s.log.some(e => e.kind === 'reveal' && e.player === b.id && e.visibleTo?.includes(a.id))).toBe(true);
    expect(b.hand).toHaveLength(1);
  });
});
