// Plays a whole game with bots in every seat (tests, balance checks, and the "watch bots" mode).
import { Runner } from '../engine/runner';
import type { Content } from '../engine/content';
import type { GameSetup } from '../engine/types';
import { makeRng } from '../engine/rng';
import { botChoose } from './bot';

export function playBotGame(setup: GameSetup, content: Content, maxSteps = 100_000): Runner {
  const r = new Runner(setup, content);
  const rng = makeRng(setup.seed ^ 0x5bd1e995);
  for (let i = 0; !r.over && i < maxSteps; i++) r.answer(botChoose(r.game, r.pending!, rng));
  if (!r.over) throw new Error(`Bot game ${setup.seed} did not finish`);
  return r;
}
