// Turns a route with `goto` steps into plain inputs, for writing a puzzle's solution.json or
// cheats.json (those hold inputs only). `npm run route:expand -- <puzzle id> '<json array>'`
// prints the expanded list, with repeats folded ("right*3").

import { fileURLToPath } from 'node:url';
import { parseRoute, type Command } from '../src/engine/sim.ts';
import { PUZZLES, puzzleSim } from './sim-setup.ts';

export function fold(cmds: readonly Command[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < cmds.length; ) {
    let j = i;
    while (j < cmds.length && cmds[j] === cmds[i]) j++;
    const n = j - i;
    out.push(n > 1 ? `${cmds[i]}*${n}` : cmds[i]!);
    i = j;
  }
  return out;
}

export function expandForPuzzle(id: string, route: string[]): string[] {
  const puzzle = PUZZLES.find((p) => p.id === id);
  if (!puzzle) throw new Error(`No puzzle ${id}`);
  const sim = puzzleSim(puzzle);
  for (const item of parseRoute(route)) for (const c of sim.expand(item)) sim.press(c);
  return fold(sim.pressed);
}

const isMain = process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [id, json] = process.argv.slice(2);
  if (!id || !json) {
    console.error("usage: npm run route:expand -- <puzzle id> '[\"goto 3,4\", \"confirm\"]'");
    process.exit(1);
  }
  console.log(JSON.stringify(expandForPuzzle(id, JSON.parse(json) as string[])));
}
