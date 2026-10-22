// A simple player for Guildmaster Qasim's fight (tests/qasim.test.ts and the balance check; the Chapter 4 outline
// review 3.1): it Surges when it can (on the Golden Wall first), heals the badly hurt, Guards when told to ("Guard,
// everyone!") if `guards`, bribes a hired blade if `bribes` and the purse allows, and otherwise hits hardest at the
// blades first, then Qasim. Not the game's code: a stand-in for a fair player.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BATTLES, ENEMIES, SKILL_BOOK, battleReserve } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, battleParty, isMove, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { xpForLevel } from '../src/engine/rpg.ts';
import { QUEST_ROOT } from '../tools/sim-setup.ts';

/** The party as Chapter 4 begins (the strand), with Samira joined, raised to `level`, with `gold` in the purse. */
export function qasimFlags(level: number, gold: number): FlagStore {
  const starts = JSON.parse(readFileSync(join(QUEST_ROOT, 'src/data/starts/chapters.json'), 'utf8')) as Record<string, { flags: FlagSnapshot }>;
  const flags = new FlagStore(starts['4']!.flags);
  flags.set('party.samira', true);
  const base = RPG.xpRules.reduce((n, r) => n + r.flags.filter((f) => flags.isSet(f)).length * r.each, 0);
  flags.set('xp.shared', xpForLevel(RPG, level) - base);
  flags.set('gold', gold);
  return flags;
}

export interface QasimPolicy {
  guards: boolean;
  bribes: boolean;
}

export function qasimBattle(flags: FlagStore, seed: number): Battle {
  const def = BATTLES.qasim_vault!;
  return new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), battleItems(flags, RPG), {
    seed,
    gold: typeof flags.get('gold') === 'number' ? (flags.get('gold') as number) : 0,
    reserve: battleReserve(def),
  });
}

export function qasimAction(b: Battle, policy: QasimPolicy, warned: boolean): Action {
  const me = b.actor!;
  const foes = b.enemies.filter((e) => !e.down);
  const qasim = foes.find((e) => e.enemyId === 'qasim');
  const walled = !!qasim?.statuses.some((s) => s.id === 'gilded');
  if (b.canSurge() && (walled || !qasim || qasim.hp < qasim.maxHp)) return { kind: 'surge' };
  if (policy.guards && warned) return { kind: 'guard' };
  const heal = me.skills.find((s) => s.kind === 'heal' && s.target === 'ally' && !s.gold && b.canUse(me, s));
  const hurt = b.fighters.filter((a) => !a.down).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
  if (heal && hurt && hurt.hp / hurt.maxHp < 0.45) return { kind: 'skill', skill: heal.id, target: hurt.key };
  const bribe = me.skills.find((s) => s.bribe && b.canUse(me, s));
  const hired = foes.find((e) => e.hired);
  if (policy.bribes && bribe && hired) return { kind: 'skill', skill: bribe.id, target: hired.key };
  const pick = foes.find((e) => e.enemyId !== 'qasim') ?? qasim ?? foes[0]!;
  const hits = me.skills
    .filter((s) => s.kind === 'damage' && s.target === 'enemy' && !s.gold && b.canUse(me, s))
    .sort((x, y) => y.power + (isMove(y) ? 0 : 5) - (x.power + (isMove(x) ? 0 : 5)));
  const best = hits[0];
  if (best) return { kind: 'skill', skill: best.id, target: pick.key };
  return { kind: 'attack', target: pick.key };
}

export interface QasimRun {
  won: boolean;
  actions: number;
  hired: number;
  walls: number;
  shattered: boolean;
  seized: boolean;
  goldSpent: number;
  events: BattleEvent[];
}

export function playQasim(seed: number, level: number, policy: QasimPolicy, gold = 0): QasimRun {
  const b = qasimBattle(qasimFlags(level, gold), seed);
  const events: BattleEvent[] = [...b.start()];
  let actions = 0;
  let warned = false;
  const read = (evs: BattleEvent[]) => {
    for (const e of evs) {
      if (e.kind === 'text' && e.text.includes('Seize their assets')) warned = true;
      if ((e.kind === 'damage' || e.kind === 'miss') && e.move === 'Seize Assets') warned = false;
    }
  };
  read(events);
  for (let i = 0; i < 400 && !b.outcome; i++) {
    const evs = b.act(qasimAction(b, policy, warned));
    read(evs);
    events.push(...evs);
    actions++;
  }
  return {
    won: b.outcome === 'won',
    actions,
    hired: events.filter((e) => e.kind === 'use' && e.name === 'Hire Blades').length,
    walls: events.filter((e) => e.kind === 'use' && e.name === 'Golden Wall').length,
    shattered: events.some((e) => e.kind === 'text' && e.text.includes('shatters')),
    seized: events.some((e) => (e.kind === 'damage' || e.kind === 'miss') && e.move === 'Seize Assets'),
    goldSpent: b.goldSpent,
    events,
  };
}
