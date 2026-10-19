// Suzumori's Ayatsuri (rules-decisions 90): with the strings pulled, Suzumori chooses the player named by the puppet's
// next card, friendly or hostile; the puppet's house abilities and trade offers stay their own. This walks every card
// and every house ability, so the printed rule and the engine can't drift apart.
import { describe, expect, it } from 'vitest';
import { drive, newGame } from './helpers';
import { CARDS } from '../src/data';
import { REDIRECT_TARGET } from '../src/engine/game';
import type { Game } from '../src/engine/game';
import type { Decision, HouseId } from '../src/engine/types';

const startTurn = (g: Game, id: number) => {
  (g as unknown as { startTurn: (p: unknown, x: boolean) => void }).startTurn(g.p(id), false);
};
const HAND = CARDS.filter(c => c.kind === 'hand').map(c => c.id);

// Player 0 is puppeted by player 1 (Suzumori); everyone stands next to player 0, holds cards and resources.
function puppetGame(houses: HouseId[] = ['brasador', 'suzumori', 'dorini', 'kaysoley']) {
  const g = newGame(4, houses);
  const spots = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 5 }, { x: 4, y: 5 }];
  g.s.players.forEach((p, i) => {
    p.pos = spots[i];
    p.hand = HAND.slice(i * 2, i * 2 + 2);
    p.res = { influence: 3, fear: 3, wealth: 3 };
  });
  g.s.round = 10;                      // past the opening truce
  startTurn(g, 0);
  g.s.turn!.moved = true;
  g.addEffect('redirect', 0, { at: 'consumed' }, { by: 1, level: REDIRECT_TARGET });
  return g;
}

// Who is asked the first "which player?" question that the puppet would otherwise answer (null: nobody).
function firstPlayerChooser(flow: Generator<Decision, unknown, number>) {
  let asked: number | null = null;
  let r = flow.next();
  for (let guard = 0; !r.done && guard < 500; guard++) {
    const d = r.value;
    if (asked === null && d.kind === 'player' && (d.player === 0 || d.player === 1)) asked = d.player;
    r = flow.next(0);
  }
  return asked;
}

describe('Ayatsuri reaches every card that names a player, never a house ability', () => {
  for (const card of CARDS) {
    it(`${card.id} ${card.name}`, () => {
      const g = puppetGame();
      const asked = firstPlayerChooser(g.resolveCard(card, g.p(0)));
      if (asked !== null) expect(asked, `${card.name}: Suzumori should choose`).toBe(1);
    });
  }

  const ABILITY_HOUSES: HouseId[] = ['brasador', 'dorini', 'ironvow', 'kaysoley', 'agnivansh', 'stillwater', 'vaitama'];
  for (const house of ABILITY_HOUSES) {
    it(`${house}: house abilities stay the player's own`, () => {
      const g = puppetGame([house, 'suzumori', house === 'dorini' ? 'brasador' : 'dorini', house === 'kaysoley' ? 'brasador' : 'kaysoley']);
      const p = g.p(0);
      p.gen = 4;
      for (const a of g.house(p).abilities) {
        if (!a.canUse || !a.canUse(g, p)) continue;
        const asked = firstPlayerChooser(g.useAbility(p, a));
        if (asked !== null) expect(asked, `${a.name}: the player should choose`).toBe(0);
      }
    });
  }

  it('a trade offer stays the player\'s own', () => {
    const g = puppetGame();
    const flow = (g as unknown as { offerTrade: (p: unknown) => Generator<Decision, unknown, number> }).offerTrade?.(g.p(0));
    if (!flow) return;
    expect(firstPlayerChooser(flow)).toBe(0);
  });

  it('the strings end when the puppet\'s character dies', () => {
    const g = puppetGame();
    g.addEffect('redirect', 0, { at: 'consumed' }, { by: 1, level: 3 });
    g.s.turn = null;                     // dying on one's own turn ends it; not what this checks
    g.p(0).hp = 1;
    g.damage(g.p(0), 3, 2, '(test)');
    drive(g.flushDeaths());
    expect(g.findEffect('redirect', 0)).toBeFalsy();
  });
});
