/// <reference types="node" />
// Debugging tool: replay a game from an exported log. Run with
//   LOG=path/to/bloodlines-....txt npm run replay
// It replays the exact setup and answers and prints the chronicle (with hidden lines) and final state.
import { it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CONTENT } from '../src/data';
import { Runner } from '../src/engine/runner';

it.skipIf(!process.env.LOG)('replay an exported game log', () => {
  const text = readFileSync(process.env.LOG!, 'utf8');
  const data = JSON.parse(text.trim().split('\n').at(-1)!);
  const r = new Runner(data.setup, CONTENT);
  let i = 0;
  try {
    for (; i < data.answers.length; i++) r.answer(data.answers[i]);
  } catch (e) {
    console.log(`Replay diverged at answer #${i}: ${(e as Error).message} (was it played on build ${data.build}?)`);
  }
  console.log(r.state.log.map(e => `R${e.round} ${e.text}`).join('\n'));
  console.log('PENDING:', JSON.stringify(r.pending, null, 1)?.slice(0, 600));
  console.log('PLAYERS:', JSON.stringify(r.state.players.map(p => ({ name: p.name, house: p.house, gen: p.gen, hp: p.hp, pos: p.pos, res: p.res })), null, 1));
});
