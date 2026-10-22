// A simple player for the Trial of Blades (tests/raelTrial.test.ts and the balance check): it Breaks Free when
// Bound, Surges when it can, frees a Bound ally with a heal, heals the badly hurt, and otherwise hits hardest at
// its chosen foe (Rael himself, or his guards first). Not the game's code: a stand-in for a fair player.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BATTLES, ENEMIES, SKILL_BOOK } from '../src/data/battles.ts';
import { RPG } from '../src/data/rpg.ts';
import { Battle, battleItems, battleParty, isMove, type Action, type BattleEvent } from '../src/engine/battle.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { xpForLevel } from '../src/engine/rpg.ts';
import { QUEST_ROOT } from '../tools/sim-setup.ts';

export type TrialPolicy = 'rael' | 'guards';

/** The party as Chapter 3 begins (the route's start), raised to `level` with its own gear. */
export function trialFlags(level = 10): FlagStore {
  const starts = JSON.parse(readFileSync(join(QUEST_ROOT, 'src/data/starts/chapters.json'), 'utf8')) as Record<string, { flags: FlagSnapshot }>;
  const flags = new FlagStore(starts['3']!.flags);
  // Shared XP on top of what the steps give, so every member stands at `level`.
  const base = RPG.xpRules.reduce((n, r) => n + r.flags.filter((f) => flags.isSet(f)).length * r.each, 0);
  flags.set('xp.shared', xpForLevel(RPG, level) - base);
  return flags;
}

export function trialBattle(flags: FlagStore, seed: number): Battle {
  const def = BATTLES.rael_trial!;
  const reserve = { rivera: ENEMIES.rivera!, jaime: ENEMIES.jaime! };
  return new Battle(def, battleParty(flags, RPG, SKILL_BOOK), def.enemies.map((id) => ENEMIES[id]!), battleItems(flags, RPG), { seed, reserve });
}

export function botAction(b: Battle, policy: TrialPolicy): Action {
  const me = b.actor!;
  if (me.bound) return { kind: 'breakFree' };
  if (b.canSurge()) return { kind: 'surge' };
  const heal = me.skills.find((s) => s.kind === 'heal' && s.target === 'ally' && b.canUse(me, s));
  const boundAlly = b.fighters.find((a) => a.bound);
  if (heal && boundAlly) return { kind: 'skill', skill: heal.id, target: boundAlly.key };
  const hurt = b.fighters.filter((a) => !a.down).sort((x, y) => x.hp / x.maxHp - y.hp / y.maxHp)[0];
  if (heal && hurt && hurt.hp / hurt.maxHp < 0.45) return { kind: 'skill', skill: heal.id, target: hurt.key };
  const food = b.items.find((i) => i.count > 0 && (i.heals ?? 0) > 0 && !i.overTurns);
  if (!heal && food && me.hp / me.maxHp < 0.35) return { kind: 'item', item: food.id, target: me.key };
  const foes = b.enemies.filter((e) => !e.down);
  const pick = policy === 'guards' ? (foes.find((e) => e.enemyId === 'jaime') ?? foes.find((e) => e.enemyId === 'rivera') ?? foes[0]) : (foes.find((e) => e.enemyId === 'rael') ?? foes[0]);
  const hits = me.skills
    .filter((s) => s.kind === 'damage' && s.target === 'enemy' && b.canUse(me, s))
    .sort((x, y) => (y.power + (isMove(y) ? 0 : 5)) - (x.power + (isMove(x) ? 0 : 5)));
  const best = hits[0];
  if (best) return { kind: 'skill', skill: best.id, target: pick!.key };
  return { kind: 'attack', target: pick!.key };
}

export interface TrialRun {
  /** How it ended: every fighter Bound in the fight, the floor, after Reinado, or the round cap. */
  end: 'bound' | 'floor' | 'finisher' | 'cap';
  reinado: boolean;
  guardsIn: boolean;
  /** Party actions taken (a phone takes about 8 to 10 seconds each, with the animations). */
  actions: number;
  events: BattleEvent[];
}

export function playTrial(seed: number, policy: TrialPolicy = 'rael', level = 10): TrialRun {
  const b = trialBattle(trialFlags(level), seed);
  const events: BattleEvent[] = [...b.start()];
  let actions = 0;
  for (let i = 0; i < 400 && !b.outcome; i++) {
    events.push(...b.act(botAction(b, policy)));
    actions++;
  }
  const said = (t: string) => events.some((e) => e.kind === 'text' && e.text === t);
  const finale = said('Enough.');
  const reinado = events.some((e) => e.kind === 'damage' && e.move === 'Reinado de Cenizas') || events.some((e) => e.kind === 'miss' && e.move === 'Reinado de Cenizas');
  const end = !finale ? 'bound' : b.floorHeld ? 'floor' : reinado ? 'finisher' : 'cap';
  return { end, reinado, guardsIn: events.some((e) => e.kind === 'enter'), actions, events };
}
