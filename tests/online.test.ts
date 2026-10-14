import { describe, expect, it } from 'vitest';
import { answer, botStep, createSession, gameView, joinSession, lobbyView, pickHouse, startSession, vote } from '../src/net/serverCore';
import type { Env, Session } from '../src/net/serverCore';
import { makeRng } from '../src/engine/rng';

const env = (seed = 1): Env => {
  const rng = makeRng(seed);
  let n = 0;
  return { rand: rng, token: () => `t${++n}-${Math.floor(rng() * 1e9)}`, now: () => 0 };
};

function play(s: Session, tokens: string[], limit = 5000) {
  let steps = 0;
  while (s.status === 'active' && steps++ < limit) {
    const views = tokens.map((_, i) => gameView(s, i));
    const who = views.findIndex(v => v.pending && v.pending.options.length > 0);
    if (who < 0) { botStep(s, views[0].answers); continue; }    // a bot's turn: any app asks the server to move it
    answer(s, who, 0, views[who].answers);
  }
}

describe('online game server', () => {
  it('host, join, lottery, play to the end; each player sees only their own hand', () => {
    const e = env(7);
    const { session: s, token: host } = createSession(e, 'ABC234', 'Elodie', 4, 2);
    expect(() => startSession(e, s, 0)).toThrow(/every player has joined/);
    const { token: guest, seat } = joinSession(e, s, 'Sam');
    expect(seat).toBe(1);
    expect(() => joinSession(e, s, 'Late')).toThrow(/full/);
    vote(s, 0, true);                                   // Sam didn't agree: lottery
    startSession(e, s, 0);
    expect(s.status).toBe('active');
    expect(s.setup!.firstPlayer).toBe(0);               // Elodie goes first
    const v = gameView(s, 1);
    expect(v.state.drawPile).toEqual([]);
    expect(v.state.setup.seed).toBe(0);
    expect(v.state.players[0].hand).toEqual([]);
    expect(v.state.players[1].hand.length).toBe(3);
    expect(v.state.log.every(l => !l.visibleTo || l.visibleTo.includes(1))).toBe(true);
    play(s, [host, guest]);
    expect(s.status).toBe('ended');
  });

  it('picking houses needs every person to agree, then the roll-off order picks', () => {
    const e = env(3);
    const { session: s } = createSession(e, 'ZZZ234', 'Ana', 5, 3);
    joinSession(e, s, 'Ben'); joinSession(e, s, 'Cy');
    vote(s, 0, true); vote(s, 1, true); vote(s, 2, true);
    expect(lobbyView(s, 0).pickAgreed).toBe(true);
    startSession(e, s, 0);
    expect(s.status).toBe('picking');
    expect(s.pickOrder).toHaveLength(5);
    let guard = 0;
    while (s.status === 'picking' && guard++ < 10) {
      const turn = lobbyView(s, 0).pickTurn!;
      expect(s.seats[turn].bot).toBe(false);            // bots pick by themselves
      const free = (['brasador', 'dorini', 'ironvow', 'suzumori', 'vaitama', 'kaysoley', 'agnivansh', 'stillwater'] as const)
        .find(h => !s.seats.some(x => x.house === h))!;
      expect(() => pickHouse(e, s, (turn + 1) % 5, free)).toThrow();
      pickHouse(e, s, turn, free);
    }
    expect(s.status).toBe('active');
    expect(new Set(s.setup!.seats.map(x => x.house)).size).toBe(5);
  });

  it('a 2-player Battle: only the first player picks; the die gives the second house (rules-decisions 87)', () => {
    const seconds = new Set<string>();
    for (let i = 1; i < 30; i++) {
      const e = env(10 + i);
      const { session: s } = createSession(e, 'BAT234', 'Ana', 2, 2, 'battle');
      joinSession(e, s, 'Ben');
      vote(s, 0, true); vote(s, 1, true);
      startSession(e, s, 0);
      expect(lobbyView(s, 0).twoMode).toBe('battle');
      const first = s.pickOrder![0];
      expect(lobbyView(s, 0).pickTurn).toBe(first);
      expect(() => pickHouse(e, s, 1 - first, 'suzumori')).toThrow(/not your pick/);
      pickHouse(e, s, first, 'brasador');
      expect(s.status).toBe('active');                     // no pick turn for the second seat
      const second = s.setup!.seats[1 - first].house!;
      expect(['kaysoley', 'vaitama']).toContain(second);
      seconds.add(second);
    }
    expect(seconds.size).toBe(2);
  });
  it('a 2-player Battle with a bot picking first: the human second seat never picks', () => {
    for (let i = 1; i < 20; i++) {
      const e = env(40 + i);
      const { session: s } = createSession(e, 'BOT234', 'Ana', 2, 1, 'battle');
      vote(s, 0, true);
      startSession(e, s, 0);
      if (s.status === 'picking') {
        expect(s.pickOrder![0]).toBe(0);                     // the human picks first; the bot gets the die
        pickHouse(e, s, 0, 'dorini');
        expect(['kaysoley', 'ironvow']).toContain(s.setup!.seats[1].house);
      }
      expect(s.status).toBe('active');
    }
  });
  it('a 2-player Battle by lottery deals neighbours; Race is the default', () => {
    for (let i = 1; i < 30; i++) {
      const e = env(i);
      const { session: s } = createSession(e, 'LOT234', 'Ana', 2, 1, 'battle');
      startSession(e, s, 0);
      const [a, b] = s.setup!.seats.map(x => x.house!);
      const near: Record<string, string[]> = { brasador: ['vaitama', 'kaysoley'], kaysoley: ['brasador', 'dorini'], dorini: ['kaysoley', 'ironvow'],
        ironvow: ['dorini', 'suzumori'], suzumori: ['ironvow', 'agnivansh'], agnivansh: ['suzumori', 'stillwater'],
        stillwater: ['agnivansh', 'vaitama'], vaitama: ['stillwater', 'brasador'] };
      expect(near[a]).toContain(b);
    }
    expect(lobbyView(createSession(env(1), 'RAC234', 'Ana', 2, 2).session, 0).twoMode).toBe('race');
    expect(lobbyView(createSession(env(1), 'BIG234', 'Ana', 4, 2).session, 0).twoMode).toBeNull();
  });
  it('rejects answers out of turn or out of date', () => {
    const e = env(9);
    const { session: s } = createSession(e, 'QQQ234', 'Ana', 2, 2);
    joinSession(e, s, 'Ben');
    startSession(e, s, 0);
    const v0 = gameView(s, 0), v1 = gameView(s, 1);
    expect(() => botStep(s, v0.answers)).toThrow(/not a bot/);
    const mine = v0.pending?.options.length ? 0 : 1;
    const other = 1 - mine;
    expect(() => answer(s, other, 0, (other ? v1 : v0).answers)).toThrow(/not your decision/);
    expect(() => answer(s, mine, 0, 999)).toThrow(/moved on/);
  });
});
