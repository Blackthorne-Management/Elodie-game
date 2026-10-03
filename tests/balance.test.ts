import { it } from 'vitest';
import { CONTENT } from '../src/data';
import { playBotGame } from '../src/ai/autoplay';
import { setup } from './helpers';

// Run with `npm run balance`; skipped in the normal test run because it plays 180 full games.
it.skipIf(!process.env.BALANCE)('balance report', () => {
  for (const n of [2, 4, 8]) {
    const wins: Record<string, number> = {}; let claims = 0, sudden = 0, rounds = 0, deaths = 0, specters = 0;
    const N = 60;
    for (let seed = 1; seed <= N; seed++) {
      const r = playBotGame({ ...setup(n, seed * 977 + n), firstPlayer: undefined }, CONTENT);
      const s = r.state;
      const w = s.players[s.winner!].house;
      wins[w] = (wins[w] ?? 0) + 1;
      if (/Sudden Death/.test(s.endReason!)) sudden++; else claims++;
      rounds += s.round;
      deaths += s.log.filter(e => e.kind === 'death').length;
      specters += s.players.filter(p => p.specter).length;
    }
    console.log(`${n}p: claims ${claims}, sudden ${sudden}, avg rounds ${(rounds / N).toFixed(1)}, deaths/game ${(deaths / N).toFixed(1)}, specters/game ${(specters / N).toFixed(2)}`, JSON.stringify(wins));
  }
}, 300_000);
