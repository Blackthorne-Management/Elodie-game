// Battle simulations for balance (review 1, Oct 21, finding 1): a scripted fight played many times with the party
// exactly as the scripted route (routes/zetwal-act1.json) leaves it at a marker, under fixed plans:
//   attack   Attack the first foe standing, nothing else (the habit the early fights reward)
//   surge    the same, plus Surge whenever Anissa is ready
//   spells   Surge when ready, Gianna's Sunthread while she has SP, Yari's Aimed Shot when it is ready; no items
//   skills   (Chapter 7) every fighter's own kit: Surge when ready; Kagemimi on a foe in disguise; an area skill or
//            move when three or more foes stand; heal one below 40%; else the strongest damage skill or move ready,
//            at the foe found out (or the first); no items
// and at each step of the Grudge. `node --experimental-strip-types tools/battle-sim.ts <battle> <marker> [runs]`
// prints wins, average turns and the share of the party's HP lost. tests/crownAttack.test.ts uses the same plans.

import { ENEMIES, SKILL_BOOK, battleDef, battleReserve } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleParty, type Action } from '../src/engine/battle.ts';
import type { FlagReader } from '../src/engine/flags.ts';
import { parseRoute } from '../src/engine/sim.ts';
import { loadMaps, newGameSim, readJson } from './sim-setup.ts';

export type Plan = 'attack' | 'surge' | 'spells' | 'skills';

export interface FightResult {
  won: boolean;
  turns: number;
  /** Share of the party's total HP lost by the end (1: everyone down). */
  hurt: number;
  /**
   * Falls in the whole party over the fight (Chapter 7; the Chapter 9 review: a fighter who fell and was swapped out,
   * or fell from the bench after swapping in, counts too, not only the four standing at the end).
   */
  falls: number;
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
  const b = new Battle(def, battleParty(flags, RPG, SKILL_BOOK), enemies, [], { seed, grudge, reserve: battleReserve(def) });
  const party = new Set(b.party.map((c) => c.key));
  let falls = 0;
  const count = (events: readonly { kind: string; who?: string }[]) => {
    for (const e of events) if ((e.kind === 'down' || e.kind === 'bound') && e.who && party.has(e.who)) falls++;
  };
  count(b.start());
  const maxHp = b.party.reduce((n, c) => n + c.maxHp, 0);
  let turns = 0;
  for (; turns < 300 && !b.outcome; turns++) {
    const me = b.actor!;
    const foe = b.enemies.find((e) => !e.down)!;
    const skill = (sid: string) => me.skills.find((s) => s.id === sid);
    const sunthread = skill('sunthread');
    const aimed = skill('aimed_shot');
    if (plan !== 'attack' && b.canSurge()) count(b.act({ kind: 'surge' }));
    else if (plan === 'spells' && sunthread && b.canUse(me, sunthread)) count(b.act({ kind: 'skill', skill: 'sunthread', target: foe.key }));
    else if (plan === 'spells' && aimed && b.canUse(me, aimed)) count(b.act({ kind: 'skill', skill: 'aimed_shot', target: foe.key }));
    else if (plan === 'skills') count(b.act(skillsAction(b)));
    else count(b.act({ kind: 'attack', target: foe.key }));
  }
  return { won: b.outcome === 'won', turns, hurt: 1 - b.party.reduce((n, c) => n + c.hp, 0) / maxHp, falls };
}

/** The `skills` plan: what a player who uses the whole kit does with this fighter now. */
export function skillsAction(b: Battle): Action {
  const me = b.actor!;
  const foes = b.enemies.filter((e) => !e.down);
  if (b.canSurge()) return { kind: 'surge' };
  const ready = me.skills.filter((s) => !s.gold && !s.bribe && b.canUse(me, s));
  const reveal = ready.find((s) => s.reveal);
  const masked = foes.find((e) => e.masked);
  if (reveal && masked && !b.revealed) return { kind: 'skill', skill: reveal.id, target: masked.key };
  const heal = ready.find((s) => s.kind === 'heal' && s.target === 'ally');
  const hurt = b.fighters.filter((a) => !a.down).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
  if (heal && hurt && hurt.hp / hurt.maxHp < 0.4) return { kind: 'skill', skill: heal.id, target: hurt.key };
  const area = ready.filter((s) => s.kind === 'damage' && (s.target === 'allEnemies' || s.target === 'randomEnemies')).sort((x, y) => y.power - x.power)[0];
  if (area && foes.length >= 3) return { kind: 'skill', skill: area.id };
  const target = foes.find((e) => e.boss && !e.masked) ?? foes.find((e) => !e.masked) ?? foes[0]!;
  const best = ready.filter((s) => s.kind === 'damage' && s.target === 'enemy').sort((x, y) => y.power - x.power)[0];
  return best ? { kind: 'skill', skill: best.id, target: target.key } : { kind: 'attack', target: target.key };
}

export interface SimRow {
  plan: Plan;
  grudge: number;
  wins: number;
  runs: number;
  turns: number;
  hurt: number;
  /** Falls in the whole party, on average per fight, and the runs with at least one. */
  falls: number;
  runsWithFalls: number;
}

export function simulate(id: string, flags: FlagReader, plan: Plan, grudge = 0, runs = 40, seed0 = 700): SimRow {
  const out = Array.from({ length: runs }, (_, i) => fight(id, seed0 + i, flags, plan, grudge));
  const avg = (f: (r: FightResult) => number) => out.reduce((n, r) => n + f(r), 0) / runs;
  return { plan, grudge, wins: out.filter((r) => r.won).length, runs, turns: avg((r) => r.turns), hurt: avg((r) => r.hurt), falls: avg((r) => r.falls), runsWithFalls: out.filter((r) => r.falls > 0).length };
}

const isMain = process.argv[1] !== undefined && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [id, mark, n] = process.argv.slice(2);
  if (!id || !mark) throw new Error('usage: battle-sim.ts <battle> <marker> [runs]');
  const flags = flagsAt(mark);
  console.log(`${id} at @${mark}`);
  for (const plan of ['attack', 'surge', 'spells', 'skills'] as const) {
    for (const grudge of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      const r = simulate(id, flags, plan, grudge, Number(n ?? 40));
      console.log(`${plan.padEnd(7)} grudge +${Math.round(grudge * 100)}%: ${r.wins}/${r.runs} won, ${r.turns.toFixed(1)} turns, ${Math.round(r.hurt * 100)}% hurt, ${r.falls.toFixed(1)} falls (${r.runsWithFalls} runs with a fall)`);
    }
  }
}
