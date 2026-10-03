import type { Combatant } from './damage';
import type { Rng } from './rng';
import type { StatusId, Target } from './types';
import { calcDamage, effectiveStat, stormMultiplier } from './damage';
import { addStatus, absorb, takeStatus } from './status';
import { aiChoose } from './ai';
import {
  BLIND_MISS_CHANCE, BURN_PERCENT, FREEZE_IMMUNE_TURNS, GRACE_MAX, GRACE_PER_ACTION, REGEN_PERCENT,
} from '../config';

export type BattleEvent =
  | { t: 'move'; who: string; move: string }
  | { t: 'damage'; target: string; amount: number; crit: boolean }
  | { t: 'heal'; target: string; amount: number }
  | { t: 'status'; target: string; status: StatusId }
  | { t: 'miss'; target: string }
  | { t: 'skip'; who: string }
  | { t: 'faint'; target: string }
  | { t: 'end'; winner: 'player' | 'enemy' };

export interface Battle {
  units: Combatant[];
  round: number;
  grace: number;               // Elodie's meter, 0-100
  log: BattleEvent[];
  winner?: 'player' | 'enemy';
}

export interface Choice { moveId: string; targetKey?: string }

// Runs one full round and returns the new battle; `prev` is never mutated.
// The returned `log` holds only this round's events, for the screen to play back.
export function runRound(prev: Battle, choices: Record<string, Choice>, rng: Rng): Battle {
  const b: Battle = structuredClone(prev);
  b.log = [];
  b.round += 1;

  // Units that act twice get a second slot at half their speed.
  const order = b.units
    .filter(u => u.hp > 0)
    .flatMap(u => {
      const speed = effectiveStat(u, 'speed');
      const slots = [{ u, speed, tie: rng() }];
      if (u.actsTwice) slots.push({ u, speed: speed / 2, tie: rng() });
      return slots;
    })
    .sort((x, y) => y.speed - x.speed || y.tie - x.tie)
    .map(x => x.u);

  const started = new Set<string>();
  for (const unit of order) {
    if (b.winner || unit.hp <= 0) continue;
    if (!started.has(unit.key)) {        // burn and regen tick once per round
      started.add(unit.key);
      startOfTurn(unit, b);
      if (unit.hp <= 0) { checkEnd(b); continue; }
    }
    if (takeStatus(unit, 'freeze')) {
      unit.freezeImmune = FREEZE_IMMUNE_TURNS;
      b.log.push({ t: 'skip', who: unit.key });
      continue;
    }
    const choice = unit.side === 'player' && choices[unit.key] ? choices[unit.key] : aiChoose(unit, b);
    performMove(unit, choice, b, rng);
    if (unit.side === 'player') b.grace = Math.min(GRACE_MAX, b.grace + GRACE_PER_ACTION);
    checkEnd(b);
  }

  endOfRound(b);
  return b;
}

function startOfTurn(u: Combatant, b: Battle) {
  if (u.statuses.some(s => s.id === 'burn')) {
    const n = absorb(u, Math.round(u.maxHp * BURN_PERCENT));
    b.log.push({ t: 'damage', target: u.key, amount: n, crit: false });
  }
  if (u.statuses.some(s => s.id === 'regen')) {
    const n = heal(u, REGEN_PERCENT);
    b.log.push({ t: 'heal', target: u.key, amount: n });
  }
  if (u.hp === 0) b.log.push({ t: 'faint', target: u.key });
}

function heal(u: Combatant, percent: number): number {
  const before = u.hp;
  u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * percent));
  return u.hp - before;
}

function targets(user: Combatant, t: Target, b: Battle, pick?: string): Combatant[] {
  const allies = b.units.filter(u => u.side === user.side && u.hp > 0);
  const foes = b.units.filter(u => u.side !== user.side && u.hp > 0);
  switch (t) {
    case 'self': return [user];
    case 'allEnemies': return foes;
    case 'allAllies': return allies;
    case 'ally': return [allies.find(a => a.key === pick) ?? user];
    case 'lowestAlly': return [allies.reduce((lo, a) => (a.hp / a.maxHp < lo.hp / lo.maxHp ? a : lo))];
    case 'enemy': {
      const taunter = foes.find(f => f.statuses.some(s => s.id === 'taunt'));
      const chosen = taunter ?? foes.find(f => f.key === pick) ?? foes[0];
      return chosen ? [chosen] : [];
    }
  }
}

function performMove(user: Combatant, choice: Choice, b: Battle, rng: Rng) {
  // Rooted units, and choices still on cooldown, fall back to the Basic move.
  const rooted = user.statuses.some(s => s.id === 'root');
  const move =
    user.moves.find(m => m.id === choice.moveId && !rooted && (user.cooldowns[m.id] ?? 0) === 0) ??
    user.moves.find(m => m.slot === 'basic')!;
  b.log.push({ t: 'move', who: user.key, move: move.id });
  user.cooldowns[move.id] = move.cooldown;

  for (const e of move.effects) {
    if (e.kind === 'revive') {
      const fallen = b.units.find(u => u.side === user.side && u.hp <= 0);
      if (fallen) {
        fallen.hp = Math.round(fallen.maxHp * e.percent);
        fallen.statuses = [];
        b.log.push({ t: 'heal', target: fallen.key, amount: fallen.hp });
      }
      continue;
    }
    for (const target of targets(user, e.target, b, choice.targetKey)) {
      if (e.kind === 'damage') {
        for (let i = 0; i < (e.hits ?? 1) && target.hp > 0; i++) {
          const blind = user.statuses.some(s => s.id === 'blind') && rng() < BLIND_MISS_CHANCE;
          if (blind || takeStatus(target, 'dodge')) { b.log.push({ t: 'miss', target: target.key }); continue; }
          const { amount, crit } = calcDamage(user, target, e.power, rng, stormMultiplier(b.round));
          b.log.push({ t: 'damage', target: target.key, amount: absorb(target, amount), crit });
          if (target.hp === 0) b.log.push({ t: 'faint', target: target.key });
        }
      } else if (e.kind === 'heal') {
        b.log.push({ t: 'heal', target: target.key, amount: heal(target, e.percent) });
      } else if (e.kind === 'status') {
        if (rng() < e.chance && addStatus(target, e.status, e.turns)) {
          b.log.push({ t: 'status', target: target.key, status: e.status });
        }
      } else if (e.kind === 'shield') {
        addStatus(target, 'shield', e.turns, Math.round(target.maxHp * e.percent));
        b.log.push({ t: 'status', target: target.key, status: 'shield' });
      } else if (e.kind === 'cleanse') {
        const bad: StatusId[] = ['burn', 'chill', 'freeze', 'root', 'atkDown', 'defDown', 'blind'];
        target.statuses = target.statuses.filter(s => !bad.includes(s.id));
      }
    }
  }
}

function checkEnd(b: Battle) {
  for (const side of ['player', 'enemy'] as const) {
    if (!b.units.some(u => u.side === side && u.hp > 0)) {
      b.winner = side === 'player' ? 'enemy' : 'player';
      b.log.push({ t: 'end', winner: b.winner });
      return;
    }
  }
}

// A move's cooldown is set when used and counts down here, so a 3-turn Skill
// is ready again on the fourth round. Dodge lasts until it is consumed.
function endOfRound(b: Battle) {
  for (const u of b.units) {
    u.statuses = u.statuses.filter(s => s.id === 'dodge' || --s.turns > 0);
    for (const id in u.cooldowns) u.cooldowns[id] = Math.max(0, u.cooldowns[id] - 1);
    u.freezeImmune = Math.max(0, u.freezeImmune - 1);
  }
}
