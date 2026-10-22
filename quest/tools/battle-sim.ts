// Battle simulations for balance (review 1, Oct 21, finding 1): a scripted fight played many times with the party
// exactly as the scripted route (routes/zetwal-act1.json) leaves it at a marker, under fixed plans:
//   attack   Attack the first foe standing, nothing else (the habit the early fights reward)
//   surge    the same, plus Surge whenever Anissa is ready
//   spells   Surge when ready, Gianna's Sunthread while she has SP, Yari's Aimed Shot when it is ready; no items
// and at each step of the Grudge. `node --experimental-strip-types tools/battle-sim.ts <battle> <marker> [runs]`
// prints wins, average turns and the share of the party's HP lost. tests/crownAttack.test.ts uses the same plans.

import { ENEMIES, SKILL_BOOK, battleDef } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty } from '../src/engine/battle.ts';
import type { FlagReader } from '../src/engine/flags.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from './sim-setup.ts';

export type Plan = 'attack' | 'surge' | 'spells';

export interface FightResult {
  won: boolean;
  turns: number;
  /** Share of the party's total HP lost by the end (1: everyone down). */
  hurt: number;
}

/** The party's flags where the scripted route reaches `mark`. */
export function flagsAt(mark: string): FlagReader {
  const route = parseRoute(readJson<string[]>('routes/zetwal-act1.json'));
  const sim = newGameSim(loadMaps());
  for (const item of route) {
    if (item.kind === 'mark' && item.name === mark) return sim.logic.state.flags;
    sim.run([item]);
  }
  throw new Error(`No marker @${mark} in the route`);
}

/** One fight under a plan (the battle scene's set-up: the fight's level, the party from the flags, no items). */
export function fight(id: string, seed: number, flags: FlagReader, plan: Plan, grudge = 0): FightResult {
  const def = battleDef(id);
  if (!def) throw new Error(`No battle ${id}`);
  const enemies = def.enemies.map((e) => ENEMIES[e]!).map((e) => (def.level ? { ...e, level: def.level } : e));
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), enemies, [], { seed, grudge });
  b.start();
  const maxHp = b.party.reduce((n, c) => n + c.maxHp, 0);
  let turns = 0;
  for (; turns < 300 && !b.outcome; turns++) {
    const me = b.actor!;
    const foe = b.enemies.find((e) => !e.down)!;
    const skill = (sid: string) => me.skills.find((s) => s.id === sid);
    const sunthread = skill('sunthread');
    const aimed = skill('aimed_shot');
    if (plan !== 'attack' && b.canSurge()) b.act({ kind: 'surge' });
    else if (plan === 'spells' && sunthread && b.canUse(me, sunthread)) b.act({ kind: 'skill', skill: 'sunthread', target: foe.key });
    else if (plan === 'spells' && aimed && b.canUse(me, aimed)) b.act({ kind: 'skill', skill: 'aimed_shot', target: foe.key });
    else b.act({ kind: 'attack', target: foe.key });
  }
  return { won: b.outcome === 'won', turns, hurt: 1 - b.party.reduce((n, c) => n + c.hp, 0) / maxHp };
}

export interface SimRow {
  plan: Plan;
  grudge: number;
  wins: number;
  runs: number;
  turns: number;
  hurt: number;
}

export function simulate(id: string, flags: FlagReader, plan: Plan, grudge = 0, runs = 40, seed0 = 700): SimRow {
  const out = Array.from({ length: runs }, (_, i) => fight(id, seed0 + i, flags, plan, grudge));
  const avg = (f: (r: FightResult) => number) => out.reduce((n, r) => n + f(r), 0) / runs;
  return { plan, grudge, wins: out.filter((r) => r.won).length, runs, turns: avg((r) => r.turns), hurt: avg((r) => r.hurt) };
}

const isMain = process.argv[1] !== undefined && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [id, mark, n] = process.argv.slice(2);
  if (!id || !mark) throw new Error('usage: battle-sim.ts <battle> <marker> [runs]');
  const flags = flagsAt(mark);
  console.log(`${id} at @${mark}`);
  for (const plan of ['attack', 'surge', 'spells'] as const) {
    for (const grudge of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      const r = simulate(id, flags, plan, grudge, Number(n ?? 40));
      console.log(`${plan.padEnd(7)} grudge +${Math.round(grudge * 100)}%: ${r.wins}/${r.runs} won, ${r.turns.toFixed(1)} turns, ${Math.round(r.hurt * 100)}% hurt`);
    }
  }
}
