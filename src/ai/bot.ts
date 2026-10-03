// Rule-based bot (build guide Section 6). Given the paused game and a decision, return an option index.
// Each house has a light personality so a table of bots plays like eight different houses.
import type { Game, TurnAction } from '../engine/game';
import type { Decision, Dir, HouseId, Pillar, PlayerState, Pos } from '../engine/types';
import { PILLARS } from '../engine/types';
import type { Rng } from '../engine/rng';
import { THRONE, adjacent, key, manhattan, onThrone, roomToEdge, step, throneDistance } from '../engine/board';
import { BENEFICIAL_INSTANTS, cardValue, playScore } from './cardValues';

export interface Personality {
  aggression: number;   // 0-1: appetite for fights
  caution: number;      // 0-1: fear of stronger rivals
  focus: Pillar | null; // the pillar this house leans on
  noise: number;        // randomness in choices (Vai'tama is swingy)
}

export const PERSONALITY: Record<HouseId, Personality> = {
  brasador: { aggression: 0.9, caution: 0.2, focus: 'fear', noise: 0.1 },
  dorini: { aggression: 0.2, caution: 0.75, focus: 'wealth', noise: 0.1 },
  ironvow: { aggression: 0.8, caution: 0.3, focus: 'fear', noise: 0.1 },
  suzumori: { aggression: 0.4, caution: 0.5, focus: 'influence', noise: 0.1 },
  vaitama: { aggression: 0.55, caution: 0.4, focus: null, noise: 0.6 },
  kaysoley: { aggression: 0.25, caution: 0.65, focus: 'influence', noise: 0.1 },
  agnivansh: { aggression: 1, caution: 0.1, focus: 'fear', noise: 0.15 },
  stillwater: { aggression: 0.1, caution: 0.9, focus: 'influence', noise: 0.1 },
};

const LEGACY_ORDER: HouseId[] = ['agnivansh', 'ironvow', 'dorini', 'kaysoley', 'brasador', 'suzumori', 'stillwater', 'vaitama'];

export function botChoose(g: Game, d: Decision, rng: Rng): number {
  const me = g.p(d.player);
  const pers = PERSONALITY[me.house];
  const pick = (scores: number[]) => {
    let best = 0;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] + (rng() - 0.5) * pers.noise > scores[best]) best = i;
    }
    return best;
  };
  switch (d.kind) {
    case 'turn': return turnChoice(g, me, d as Decision<TurnAction>, pers, rng);
    case 'move': return pick(d.options.map(o => moveScore(g, me, d, o.value as { d: Dir; n: number } | Pos | null)));
    case 'square': return pick(d.options.map(o => destinationScore(g, me, o.value as Pos, pers)));
    case 'direction': {
      const victim = d.prompt.match(/of (.+)'s move/)?.[1];
      const v = g.s.players.find(p => p.name === victim) ?? me;
      return pick(d.options.map(o => {
        const to = step(v.pos!, o.value as Dir, Math.min(6, roomToEdge(v.pos!, o.value as Dir)));
        return throneDistance(to) + manhattan(to, g.house(v).home) * 0.1;
      }));
    }
    case 'player': return choosePlayer(g, me, d, pers);
    case 'card': return chooseCard(g, me, d);
    case 'discard': return lowestValue(d.options.map(o => o.value as number));
    case 'block': return chooseBlock(g, me, d, pers);
    case 'counterspell':
    case 'confirm': return confirm(g, me, d, rng) ? 0 : 1;
    case 'pool': return choosePool(g, me, d);
    case 'legacy': return pick(d.options.map(o => LEGACY_ORDER.length - LEGACY_ORDER.indexOf(o.value as HouseId)));
    case 'challenge': return 0;    // not challenging means the claimant wins, so always fight
    case 'specter': return chooseSpecter(g, d);
    default: return 0;
  }
}

// ---------------------------------------------------------------- shared judgements

export function danger(g: Game, p: PlayerState): number {
  const t = g.thresholds(p);
  // The combined route only counts as far as your weakest pillar allows.
  const spread = t.minEach ? Math.min(1, ...PILLARS.map(x => p.res[x] / t.minEach)) : 1;
  const progress = Math.max(Math.min(g.total(p) / t.combined, spread), ...PILLARS.map(x => p.res[x] / t.single));
  return progress * 10 + (g.eligible(p) ? 10 : 0) + (p.pos ? Math.max(0, 10 - throneDistance(p.pos)) * 0.3 : 0);
}

export const leader = (g: Game, among: PlayerState[]) =>
  among.reduce((a, b) => (danger(g, b) > danger(g, a) ? b : a));

function attackDamage(g: Game, a: PlayerState, t: PlayerState) {
  return a.hp + g.hook(a, 'basicAttackBonus') + (a.mark === t.id ? 1 : 0) +
    (g.findEffect('dreadBanner', a.id) ? 1 : 0) + (g.findEffect('markedForDeath', t.id) ? 1 : 0);
}

// Simulate a straight fight: does `a` (striking first) win?
export function winsFight(g: Game, a: PlayerState, b: PlayerState): boolean {
  let ha = a.hp, hb = b.hp;
  for (let i = 0; i < 20; i++) {
    hb -= Math.max(1, ha + g.hook(a, 'basicAttackBonus'));
    if (hb <= 0) return true;
    ha -= Math.max(1, hb + g.hook(b, 'basicAttackBonus'));
    if (ha <= 0) return false;
  }
  return true;
}

function pillarWeight(g: Game, p: PlayerState, x: Pillar, pers: Personality): number {
  const t = g.thresholds(p);
  let w = 1;
  if (pers.focus === x) w += 0.35;
  // Concentrating on a near-complete pillar is the fastest route to eligibility.
  if (p.res[x] >= t.single - 2) w += 0.5;
  // Below the per-pillar minimum, that pillar is what's holding a claim back.
  if (p.res[x] < t.minEach) w += 0.8;
  return w;
}

// ---------------------------------------------------------------- the turn

function turnChoice(g: Game, me: PlayerState, d: Decision<TurnAction>, pers: Personality, rng: Rng): number {
  const opts = d.options;
  const idx = (pred: (a: TurnAction) => boolean) => opts.findIndex(o => pred(o.value));

  // 1. Claim when the fight looks winnable (or nobody can challenge).
  const claim = idx(a => a.type === 'claim');
  if (claim >= 0) {
    const challengers = g.others(me).filter(o => g.eligible(o));
    const safe = challengers.every(o => winsFight(g, me, o));
    if (safe || rng() > pers.caution * 0.8) return claim;
  }

  const t = g.s.turn!;
  // 2. Before rolling: a card that gets an eligible bot to the Throne this turn.
  if (!t.moved) {
    if (g.eligible(me) && me.pos && !onThrone(me.pos)) {
      const bridge = idx(a => a.type === 'card' && g.card(a.card).name === 'Bridge the Gap');
      if (bridge >= 0 && throneDistance(me.pos) <= 8) return bridge;
    }
    const preAttack = bestAttack(g, me, opts, pers);
    if (preAttack !== null && preAttack.score > 2) return preAttack.index;  // Ironvow's Raider's Charge
    return idx(a => a.type === 'roll');
  }

  // Abilities are free, so they come first. Then one action: the better of an attack or a card.
  let bestAb = -1, bestAbScore = 0.5;
  opts.forEach((o, i) => {
    if (o.value.type !== 'ability') return;
    const s = abilityScore(g, me, o.value.id, pers);
    if (s > bestAbScore) { bestAb = i; bestAbScore = s; }
  });
  if (bestAb >= 0) return bestAb;

  const atk = bestAttack(g, me, opts, pers);
  let bestCard = -1, bestCardScore = 0.3;
  opts.forEach((o, i) => {
    if (o.value.type !== 'card') return;
    const s = playScore(g, me, o.value.card, pers);
    if (s > bestCardScore) { bestCard = i; bestCardScore = s; }
  });
  // An attack's score is roughly on the same scale as a card's (a kill is worth about 3-5).
  if (atk !== null && atk.score > 0.4 && (bestCard < 0 || atk.score * 1.2 >= bestCardScore)) return atk.index;
  if (bestCard >= 0) return bestCard;

  return Math.max(0, idx(a => a.type === 'end'));
}

function bestAttack(g: Game, me: PlayerState, opts: Decision<TurnAction>['options'], pers: Personality) {
  let best: { index: number; score: number } | null = null;
  opts.forEach((o, i) => {
    if (o.value.type !== 'attack') return;
    const t = g.p(o.value.target);
    const dmg = attackDamage(g, me, t);
    let s = 0;
    if (dmg >= t.hp) s += 3 + (me.grudges.includes(t.id) ? 2 : 0);   // a kill (and maybe a Reckoning)
    else s += pers.aggression * (dmg / t.hp) * 2;
    if (g.eligible(t)) s += 2;                                         // stop a claim
    if (t.hand.length >= 3) s -= 0.3 * pers.caution;                   // might be holding a Block
    if (g.house(me).longWatch?.(me.gen)) s -= 0.6;                     // Stillwater's patience bonus
    if (!best || s > best.score) best = { index: i, score: s };
  });
  return best as { index: number; score: number } | null;
}

function abilityScore(g: Game, me: PlayerState, id: string, pers: Personality): number {
  const others = g.others(me);
  switch (id) {
    case 'laMarca': return me.mark === null ? 1 : 0;
    case 'gritoDeGuerra': return others.some(o => o.res.fear >= 3) ? 0.8 : 0.2;
    case 'reinadoDeCenizas': return me.kills >= 2 || g.eligible({ ...me, res: { ...me.res, fear: me.res.fear + me.kills } }) ? 2 : 0;
    case 'daftar': return me.res.wealth >= 3 ? 0.9 : 0;
    case 'bazaar': return me.res.wealth >= 7 ? 1 : 0;
    case 'greatRaid': return g.eligible(me) || (pers.aggression > 0.5 && g.s.round > 4) ? 1.5 : 0;
    case 'kagemimi': return 0.6;
    case 'sasayakiHa': return 1;
    case 'ayatsuri': return others.some(o => g.eligible(o)) ? 2 : 0;
    case 'ancestorsMask': return 0.1;
    case 'semanLape': return g.adjacentTo(me).some(o => o.hp >= me.hp) ? 1.2 : 0;
    case 'anantaYuddha': return g.basicTargets(me).length > 0 ? 1.5 : 0;
    default: return 0.6;
  }
}

// ---------------------------------------------------------------- movement

export function destinationScore(g: Game, p: PlayerState, q: Pos, pers: Personality): number {
  let s = 0;
  const elig = g.eligible(p);
  const tile = g.tileAt(q);
  if (tile && tile.house.id !== p.house && key(q) !== p.lastScoredTile && !g.findEffect('sabotage', p.id)) {
    const pillar = ({ court: 'influence', war: 'fear', trade: 'wealth' } as const)[tile.house.tileType];
    const alone = !g.living().some(o => o.id !== p.id && o.pos && o.pos.x === q.x && o.pos.y === q.y);
    s += ((alone ? 2 : 1) + g.hook(p, 'tileBonus', pillar)) * pillarWeight(g, p, pillar, pers) * 1.5;
  }
  if (elig) {
    s += onThrone(q) ? 40 : 20 - throneDistance(q) * 2;
  } else {
    // Head for the most valuable reachable tile.
    let bestTile = Infinity;
    for (const h of Object.values(g.content.houses)) {
      if (h.id === p.house || key(h.home) === key(q)) continue;
      const pillar = ({ court: 'influence', war: 'fear', trade: 'wealth' } as const)[h.tileType];
      const v = manhattan(q, h.home) / pillarWeight(g, p, pillar, pers);
      bestTile = Math.min(bestTile, v);
    }
    s -= bestTile * 0.25;
    const t = g.thresholds(p);
    if (g.total(p) >= t.combined - 3) s -= throneDistance(q) * 0.15;
  }
  // Rivals around the destination.
  for (const o of g.others(p)) {
    if (!o.pos) continue;
    if (adjacent(q, o.pos)) {
      const mine = attackDamage(g, p, o);
      if (mine >= o.hp) s += 1 + 3 * pers.aggression + (p.grudges.includes(o.id) ? 1.5 : 0);
      else if (p.hp > o.hp) s += pers.aggression;
      if (o.hp + g.hook(o, 'basicAttackBonus') >= p.hp && mine < o.hp) s -= 4 * pers.caution;
      if (g.eligible(o)) s += 1.5;
    }
  }
  return s;
}

function moveScore(g: Game, me: PlayerState, d: Decision, v: { d: Dir; n: number } | Pos | null): number {
  const mover = g.p((d.context?.player as number | undefined) ?? me.id);
  if (!mover.pos) return 0;
  let to: Pos;
  if (v === null) to = mover.pos;
  else if ('d' in v) to = v.n === 0 ? mover.pos : step(mover.pos, v.d, v.n);
  else to = v;
  const s = destinationScore(g, mover, to, PERSONALITY[mover.house]);
  return mover.id === me.id ? s : -s;          // moving someone else: put them somewhere bad
}

// ---------------------------------------------------------------- targets and cards

const FRIENDLY = /Fair Exchange|Shared Purpose|Whispered Promise|give 1 Wealth|Uneasy Truce|Blood Pact|Peace Oath/;

function choosePlayer(g: Game, me: PlayerState, d: Decision, pers: Personality): number {
  const ids = d.options.map(o => o.value as number | null);
  const players = ids.map(id => (id === null ? null : g.p(id)));

  if (/may strike/.test(d.prompt)) {            // Elodie's Trial: who may strike?
    const target = d.prompt.match(/strike (.+) for/)?.[1];
    if (target === me.name) return 0;           // "No one"
    const self = ids.indexOf(me.id);
    return self >= 0 ? self : 0;
  }
  if (/does it fall on/.test(d.prompt)) {       // Specter target
    const cardName = d.prompt.split(':')[0];
    const good = BENEFICIAL_INSTANTS.has(cardName);
    const scored = players.map(p => (p ? danger(g, p) : -Infinity));
    const i = good ? scored.indexOf(Math.min(...scored.filter(x => x > -Infinity))) : scored.indexOf(Math.max(...scored));
    return Math.max(0, i);
  }
  if (/Truce|Peace Oath|Blood Pact/.test(d.prompt)) {
    // Make peace with whoever threatens you most.
    return argmax(players.map(p => (p ? p.hp - me.hp + (p.pos && me.pos ? -manhattan(p.pos, me.pos) * 0.2 : 0) : -99)));
  }
  if (FRIENDLY.test(d.prompt)) return argmax(players.map(p => (p ? -danger(g, p) : -99)));
  if (/attack whom|Choose who/.test(d.prompt)) {
    return argmax(players.map(p => (p ? (attackDamage(g, me, p) >= p.hp || p.hp <= 1 ? 20 : 0) + danger(g, p) : -99)));
  }
  // Default: hostile, aimed at the most dangerous rival (never yourself).
  return argmax(players.map(p => (p ? (p.id === me.id ? -50 : danger(g, p) + (me.grudges.includes(p.id) ? 2 * pers.aggression : 0)) : -99)));
}

function chooseCard(g: Game, me: PlayerState, d: Decision): number {
  const cards = d.options.map(o => o.value as number);
  const mine = cards.every(c => me.hand.includes(c));
  if (/give|pass a card|discard a card of your choice/.test(d.prompt) && mine) return lowestValue(cards);
  if (/goes on top|comes next/.test(d.prompt)) return argmax(cards.map(c => cardValue(g, c)));
  return argmax(cards.map(c => cardValue(g, c)));  // take, or make a rival discard, their best card
}

function lowestValue(cards: number[]): number {
  return cards.reduce((b, c, i) => (cardValue(null, c) < cardValue(null, cards[b]) ? i : b), 0);
}

function chooseBlock(g: Game, me: PlayerState, d: Decision, pers: Personality): number {
  const attack = d.context?.attack as { damage: number } | undefined;
  const dmg = attack?.damage ?? 1;
  const lethal = dmg >= me.hp;
  if (!lethal && dmg <= 1 && pers.caution < 0.5) return 0;      // shrug off a scratch
  const pref = ['Riposte', 'Last Stand', 'Iron Guard', 'Dodge', 'Vanish', 'Shield Wall', 'Steadfast'];
  let best = 0, rank = Infinity;
  d.options.forEach((o, i) => {
    if (o.value === null) return;
    const r = pref.indexOf(g.card(o.value as number).name);
    if (r >= 0 && r < rank) { rank = r; best = i; }
  });
  return best;
}

function confirm(g: Game, me: PlayerState, d: Decision, rng: Rng): boolean {
  if (/Counterspell/.test(d.prompt)) return !/Fair Exchange/.test(d.prompt);
  if (/cancel/i.test(d.prompt)) return true;
  if (/Take /.test(d.prompt)) {
    const name = d.prompt.match(/Take (.+)\?/)?.[1];
    const c = g.content.cards.find(x => x.name === name);
    return !!c && cardValue(g, c.id) > Math.min(...me.hand.map(h => cardValue(g, h)), 99);
  }
  if (/barter/i.test(d.prompt)) return rng() < 0.3;
  return true;
}

function choosePool(g: Game, me: PlayerState, d: Decision): number {
  const pillars = d.options.map(o => o.value as Pillar);
  if (/lose half/.test(d.prompt)) {
    // Bleed the pool where losing half costs least, protecting your strongest pillar.
    const top = Math.max(...PILLARS.map(x => me.res[x]));
    return argmax(pillars.map(x => -Math.floor(me.res[x] / 2) - (me.res[x] === top ? 1.5 : 0)));
  }
  if (/steal 1 from (.+)'s pool/.test(d.prompt) || /take 1 from/.test(d.prompt)) {
    const victimName = d.prompt.match(/from (.+?)('s| of)/)?.[1];
    const v = g.s.players.find(p => p.name === victimName);
    return v ? argmax(pillars.map(x => v.res[x])) : 0;
  }
  if (/give .+ 1 of/.test(d.prompt)) return argmax(pillars.map(x => -me.res[x]));
  // Gaining: build toward the nearest threshold.
  return argmax(pillars.map(x => me.res[x] + (PERSONALITY[me.house].focus === x ? 0.5 : 0)));
}

function chooseSpecter(g: Game, d: Decision): number {
  let best = 0, bestScore = 0;     // option 0 is "Pass"
  d.options.forEach((o, i) => {
    if (o.value === null) return;
    const name = g.card(o.value as number).name;
    const s = BENEFICIAL_INSTANTS.has(name) ? 0.5 : 2;
    if (s > bestScore) { best = i; bestScore = s; }
  });
  return best;
}

const argmax = (xs: number[]) => xs.reduce((b, x, i) => (x > xs[b] ? i : b), 0);

export { THRONE };
