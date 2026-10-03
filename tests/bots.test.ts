import { describe, it, expect } from 'vitest';
import { CONTENT } from '../src/data';
import { playBotGame } from '../src/ai/autoplay';
import { Runner } from '../src/engine/runner';
import { setup } from './helpers';

describe('bots', () => {
  it('finish full games at every table size', () => {
    for (let n = 2; n <= 8; n++) {
      for (let seed = 1; seed <= 6; seed++) {
        const r = playBotGame(setup(n, seed * 101 + n), CONTENT);
        expect(r.state.winner).not.toBeNull();
      }
    }
  }, 120_000);

  it('a game replays exactly from its setup and answers', () => {
    const s = setup(5, 4242);
    const a = playBotGame(s, CONTENT);
    const b = Runner.replay(s, CONTENT, a.answers);
    expect(b.state.winner).toBe(a.state.winner);
    expect(b.state.log.length).toBe(a.state.log.length);
    expect(b.state.players).toEqual(a.state.players);
  }, 60_000);
});
