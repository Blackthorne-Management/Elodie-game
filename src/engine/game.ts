// The rules engine. A game is one long generator: it yields a Decision whenever a player must
// choose, and resumes with the index of the chosen option. Everything here is deterministic
// given the setup (with its seed) and the list of answers.
import type {
  Decision, DecisionKind, Dir, Effect, EffectKind, Expiry, Flow, GameConfig, GameSetup, GameState,
  HouseId, LogEvent, Option, Pillar, PlayerState, Pos,
} from './types';
import { PILLARS, TILE_PILLAR } from './types';
import type { Ability, AttackInfo, CardDef, Content, HouseDef, PassiveHooks, ReactionKind } from './content';
import type { Rng } from './rng';
import { makeRng, rollD6, shuffle } from './rng';
import {
  DIR_NAMES, adjacent, inBoard, inLine, key, label, manhattan, onThrone, roomToEdge, samePos, squaresWithin, step, throneDistance,
} from './board';
import {
  ATTACK_ENDS_TURN, CHALLENGE_FIRST_STRIKER, OPENING, TRADE, NEWBORN_PROTECTION, THRONE_SANCTUARY, HAND_SIZE, MAX_FIGHT_BLOWS, SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING,
} from '../config';

export class GameOver extends Error {}
export const REDIRECT_MOVE = 1;
export const REDIRECT_TARGET = 2;
export class EndTurn extends Error {}

export type TurnAction =
  | { type: 'roll' }
  | { type: 'attack'; target: number }
  | { type: 'card'; card: number }
  | { type: 'ability'; id: string }
  | { type: 'claim' }
  | { type: 'trade' }
  | { type: 'end' };

export class Game {
  s: GameState;
  rng: Rng;
  content: Content;

  constructor(setup: GameSetup, content: Content) {
    if (setup.seats.length < 2 || setup.seats.length > 8) throw new Error('Throne of Bloodlines needs 2-8 players');
    this.content = content;
    this.rng = makeRng(setup.seed);
    const config: GameConfig = {
      suddenDeathRound: SUDDEN_DEATH_ROUND,
      challengeFirstStriker: CHALLENGE_FIRST_STRIKER,
      ...setup.config,
    };
    this.s = {
      setup, config, players: [], order: [], round: 0, turnNo: 0, turn: null,
      drawPile: [], discard: [], removed: [], inPlay: [], dying: [], effects: [], log: [], seq: 0,
      lastKill: null, housesLost: [], lastInfluenceGain: null, winner: null, endReason: null,
    };
    this.setup();
  }

  // ---------------------------------------------------------------- setup (Section 3)

  private setup() {
    const { seats } = this.s.setup;
    // House lottery: preset houses stay, the rest are drawn blind.
    const taken = new Set(seats.map(s => s.house).filter(Boolean));
    const pool = shuffle((Object.keys(this.content.houses) as HouseId[]).filter(h => !taken.has(h)), this.rng);
    this.s.players = seats.map((seat, id) => {
      const house = seat.house ?? pool.pop()!;
      const def = this.content.houses[house];
      return {
        id, name: seat.name, isBot: seat.isBot, house, gen: 1, hp: def.hp[0], maxHp: def.hp[0],
        pos: { ...def.home }, specter: false, res: { influence: 0, fear: 0, wealth: 0 },
        hand: [], grudges: [], kills: 0, reckonings: 0, handCardsPlayed: 0, visited: [key(def.home)],
        lastScoredTile: null, legacy: null, extraPassive: null, pendingExtraPassive: false,
        used: {}, mark: null, extraTurn: false,
      };
    });
    const first = this.s.setup.firstPlayer ?? Math.floor(this.rng() * seats.length);
    this.s.order = seats.map((_, i) => (first + i) % seats.length);

    this.s.drawPile = shuffle(this.content.cards.map(c => c.id), this.rng);
    // Starting hands are always 3 Hand Cards: an Instant drawn here goes back to a random point.
    for (const p of this.s.players) {
      while (p.hand.length < HAND_SIZE) {
        const c = this.s.drawPile.pop()!;
        if (this.card(c).kind === 'instant') {
          const at = Math.floor(this.rng() * (this.s.drawPile.length + 1));
          this.s.drawPile.splice(at, 0, c);
        } else {
          p.hand.push(c);
        }
      }
    }
    this.log(`The houses take their seats. ${this.p(first).name} goes first.`, 'setup');
  }

  // ---------------------------------------------------------------- lookups

  p(id: number) { return this.s.players[id]; }
  card(id: number): CardDef { return this.content.cards[id - 1]; }
  house(p: PlayerState | HouseId): HouseDef { return this.content.houses[typeof p === 'string' ? p : p.house]; }
  living() { return this.s.players.filter(p => !p.specter); }
  others(p: PlayerState) { return this.living().filter(o => o.id !== p.id); }
  active(): PlayerState | null { return this.s.turn ? this.p(this.s.turn.player) : null; }
  isActive(p: PlayerState) { return this.s.turn?.player === p.id; }
  total(p: PlayerState) { return p.res.influence + p.res.fear + p.res.wealth; }
  playersOn(pos: Pos) { return this.living().filter(o => o.pos && samePos(o.pos, pos)); }

  // Seats in turn order starting after `p` (the player "to the left" is the first one).
  seatsAfter(p: PlayerState, includeSpecters = false): PlayerState[] {
    const i = this.s.order.indexOf(p.id);
    const out: PlayerState[] = [];
    for (let k = 1; k < this.s.order.length; k++) {
      const o = this.p(this.s.order[(i + k) % this.s.order.length]);
      if (includeSpecters || !o.specter) out.push(o);
    }
    return out;
  }
  leftOf(p: PlayerState) { return this.seatsAfter(p)[0] ?? null; }
  rightOf(p: PlayerState) { return this.seatsAfter(p).at(-1) ?? null; }

  // Make sure the draw pile has cards (reshuffling the discard if needed) without drawing.
  ensureDrawPile() {
    if (!this.s.drawPile.length && this.s.discard.length) {
      this.s.drawPile = shuffle(this.s.discard, this.rng);
      this.s.discard = [];
      this.log('The deck runs dry; the discard pile is shuffled into a new deck.', 'deck');
    }
  }

  roll(p: PlayerState | null, why: string): number {
    const n = rollD6(this.rng);
    this.log(`${why}: ${p ? `${p.name} rolls` : 'rolled'} a ${n}.`, 'roll', { player: p?.id, amount: n });
    return n;
  }

  tilesOfType(type: HouseDef['tileType']): Pos[] {
    return Object.values(this.content.houses).filter(h => h.tileType === type).map(h => h.home);
  }
  onTileType(p: PlayerState, type: HouseDef['tileType']) {
    const t = p.pos && this.tileAt(p.pos);
    return !!t && t.house.tileType === type;
  }
  adjacentTo(p: PlayerState): PlayerState[] {
    return p.pos ? this.others(p).filter(o => o.pos && adjacent(p.pos!, o.pos)) : [];
  }
  // The single player with the highest (or lowest) score, or null on a tie.
  uniqueBest(score: (p: PlayerState) => number, highest = true, field = this.living()): PlayerState | null {
    if (!field.length) return null;
    const vals = field.map(score);
    const top = highest ? Math.max(...vals) : Math.min(...vals);
    const at = field.filter((_, i) => vals[i] === top);
    return at.length === 1 ? at[0] : null;
  }
  allBest(score: (p: PlayerState) => number, highest = true, field = this.living()): PlayerState[] {
    if (!field.length) return [];
    const vals = field.map(score);
    const top = highest ? Math.max(...vals) : Math.min(...vals);
    return field.filter((_, i) => vals[i] === top);
  }
  randomItem<T>(items: T[]): T { return items[Math.floor(this.rng() * items.length)]; }

  tileAt(pos: Pos): { house: HouseDef } | null {
    const h = Object.values(this.content.houses).find(d => samePos(d.home, pos));
    return h ? { house: h } : null;
  }

  // ---------------------------------------------------------------- log

  log(text: string, kind: string, extra: Partial<LogEvent> = {}) {
    this.s.log.push({ seq: ++this.s.seq, round: this.s.round, text, kind, ...extra });
  }
  reveal(p: PlayerState, to: number[] | 'all', why: string) {
    const names = p.hand.map(c => this.card(c).name).join(', ') || 'no cards';
    this.log(`${why}: ${p.name}'s hand is ${names}.`, 'reveal', {
      player: p.id, cards: [...p.hand], visibleTo: to === 'all' ? undefined : [...to, p.id], tag: 'hand',
    });
  }

  // ---------------------------------------------------------------- decisions

  *ask<V>(player: PlayerState, kind: DecisionKind, prompt: string, options: Option<V>[], context?: Record<string, unknown>): Flow<V> {
    if (options.length === 0) throw new Error(`No options for ${kind}: ${prompt}`);
    if (options.length === 1 && kind !== 'turn') return options[0].value;
    const d: Decision<V> = { player: player.id, kind, prompt, options, context };
    const i = yield d as Decision;
    if (!Number.isInteger(i) || i < 0 || i >= options.length) throw new Error(`Invalid answer ${i} for ${kind}`);
    return options[i].value;
  }

  *confirm(player: PlayerState, prompt: string, yes = 'Yes', no = 'No'): Flow<boolean> {
    return yield* this.ask(player, 'confirm', prompt, [{ label: yes, value: true }, { label: no, value: false }]);
  }

  *choosePlayer(chooser: PlayerState, candidates: PlayerState[], prompt: string, context?: Record<string, unknown>): Flow<PlayerState | null> {
    if (!candidates.length) return null;
    const id = yield* this.ask(chooser, 'player', prompt, candidates.map(c => ({ label: c.name, value: c.id })), context);
    return this.p(id);
  }

  *choosePillar(chooser: PlayerState, prompt: string, pillars: Pillar[] = PILLARS, context?: Record<string, unknown>): Flow<Pillar | null> {
    if (!pillars.length) return null;
    return yield* this.ask(chooser, 'pool', prompt, pillars.map(x => ({ label: cap(x), value: x })), context);
  }

  // A Hand Card (or ability) choosing a target. Handles Suzumori's Marionette and Counterspell.
  // Returns null if the effect on that target was negated.
  *targetPlayer(user: PlayerState, candidates: PlayerState[], prompt: string, card?: CardDef): Flow<PlayerState | null> {
    if (!candidates.length) return null;
    const chooser = this.redirectChooser(user, REDIRECT_TARGET) ?? user;
    const target = yield* this.choosePlayer(chooser, candidates, prompt, { card: card?.id, user: user.id });
    if (!target) return null;
    if (card?.kind === 'hand' && target.id !== user.id) {
      const cs = target.hand.find(c => this.card(c).counterspell);
      if (cs && (yield* this.confirm(target, `${user.name} plays ${card.name} on you. Use Counterspell to negate it?`, 'Counterspell', 'Let it happen'))) {
        this.discardFromHand(target, cs);
        this.log(`${target.name} counters ${card.name}!`, 'block', { player: target.id, target: user.id });
        return null;
      }
      // Turnabout: the card falls on another player of the target's choice instead.
      const alts = candidates.filter(o => o.id !== target.id);
      const tb = alts.length ? target.hand.find(c => this.card(c).reaction === 'turnabout') : undefined;
      if (tb !== undefined) {
        const play = yield* this.ask(target, 'reaction', `${user.name} plays ${card.name} on you. Respond?`,
          [{ label: 'Let it happen', value: false }, { label: `Play ${this.card(tb).name}`, value: true }],
          { card: tb, reaction: 'turnabout', actor: user.id, played: card.id });
        if (play) {
          this.discardFromHand(target, tb);
          this.log(`${target.name} answers with ${this.card(tb).name}!`, 'block', { player: target.id, target: user.id, cards: [tb] });
          const next = yield* this.choosePlayer(target, alts, `Turnabout: who does ${card.name} fall on instead?`, { card: card.id, user: user.id, turnabout: true });
          if (next) this.log(`${card.name} turns toward ${next.name}.`, 'info', { player: next.id });
          return next;
        }
      }
    }
    return target;
  }

  // A reaction window: other players holding a matching Reaction card may play it, asked in seat order after
  // `actor`. The first one played closes the window. Reactions themselves can't be answered.
  *reaction(kinds: ReactionKind[], actor: PlayerState, what: string, context: Record<string, unknown> = {},
    may: (o: PlayerState) => boolean = () => true): Flow<{ player: PlayerState; card: CardDef } | null> {
    for (const o of this.seatsAfter(actor)) {
      if (!may(o)) continue;
      const held = o.hand.filter(c => kinds.includes(this.card(c).reaction!));
      for (const c of held) {
        const def = this.card(c);
        const play = yield* this.ask(o, 'reaction', `${what} Respond?`,
          [{ label: 'Let it happen', value: false }, { label: `Play ${def.name}`, value: true }],
          { ...context, card: c, reaction: def.reaction, actor: actor.id });
        if (!play) continue;
        this.discardFromHand(o, c);
        this.log(`${o.name} answers with ${def.name}!`, 'block', { player: o.id, target: actor.id, cards: [c] });
        return { player: o, card: def };
      }
    }
    return null;
  }

  // ---------------------------------------------------------------- effects

  addEffect(kind: EffectKind, owner: number, expiry: Expiry, extra: Partial<Effect> = {}): Effect {
    const e: Effect = { id: ++this.s.seq, kind, owner, armed: true, expiry, ...extra };
    this.s.effects.push(e);
    return e;
  }
  // "Next turn" effects arm when the owner's next turn starts and expire when it ends.
  addNextTurnEffect(kind: EffectKind, owner: number, extra: Partial<Effect> = {}) {
    return this.addEffect(kind, owner, { at: 'turnEnd', player: owner }, { armed: false, ...extra });
  }
  findEffect(kind: EffectKind, owner: number, armedOnly = true) {
    return this.s.effects.find(e => e.kind === kind && e.owner === owner && (!armedOnly || e.armed));
  }
  removeEffect(e: Effect) {
    this.s.effects = this.s.effects.filter(x => x !== e);
    if (e.cardId) this.s.discard.push(e.cardId);
  }
  // Suzumori's Marionette: whoever pulls the strings chooses for this player, once for the move
  // and once for a target. Returns the puppeteer, or null.
  redirectChooser(p: PlayerState, part: number): PlayerState | null {
    const e = this.findEffect('redirect', p.id);
    if (!e || e.by === undefined || !((e.level ?? 0) & part) || this.p(e.by).specter) return null;
    e.level = (e.level ?? 0) & ~part;
    if (!e.level) this.removeEffect(e);
    const by = this.p(e.by);
    this.log(`${by.name} pulls the strings: they choose ${p.name}'s ${part === REDIRECT_MOVE ? 'direction' : 'target'}.`, 'ability', { player: by.id });
    return by;
  }

  private expire(match: (x: Expiry) => boolean) {
    for (const e of [...this.s.effects]) if (match(e.expiry)) {
      // Disarmed "next turn" effects only expire after their turn has run.
      if (e.expiry.at === 'turnEnd' && !e.armed) continue;
      if (e.expiry.at === 'turnEnd' && (e.expiry.turns ?? 1) > 1) { e.expiry.turns = (e.expiry.turns ?? 1) - 1; continue; }
      this.removeEffect(e);
    }
  }

  // ---------------------------------------------------------------- passives

  // Every passive a player holds, with its level (1 = Gen I text, 2 = Gen III upgrade).
  passives(p: PlayerState): { house: HouseId; level: number }[] {
    const out = [{ house: p.house, level: p.gen >= 3 ? 2 : 1 }];
    if (p.legacy && p.legacy !== p.house) out.push({ house: p.legacy, level: 1 });
    if (p.extraPassive) out.push({ house: p.extraPassive, level: 1 });
    const mask = this.findEffect('mask', p.id);
    if (mask?.house) out.push({ house: mask.house, level: mask.level ?? 1 });
    return out;
  }
  passiveLevel(p: PlayerState, house: HouseId) {
    return Math.max(0, ...this.passives(p).filter(x => x.house === house).map(x => x.level));
  }
  hook<K extends keyof PassiveHooks>(p: PlayerState, name: K, ...args: unknown[]): number {
    let sum = 0;
    for (const { house, level } of this.passives(p)) {
      const fn = this.house(house).passive[name] as ((...a: unknown[]) => number) | undefined;
      if (fn) sum += name === 'tileBonus' ? fn(args[0], level) : fn(level);
    }
    return sum;
  }

  // ---------------------------------------------------------------- resources

  gain(p: PlayerState, pillar: Pillar, n: number, why = ''): number {
    if (n <= 0 || p.specter) return 0;
    if (pillar === 'influence' && this.findEffect('noInfluenceGain', p.id)) {
      this.log(`${p.name} cannot gain Influence this turn.`, 'blocked', { player: p.id });
      return 0;
    }
    if (pillar === 'fear') {
      const grito = this.findEffect('noFearGain', p.id);
      if (grito) {
        this.removeEffect(grito);
        this.log(`War Cry: ${p.name}'s Fear gain is silenced.`, 'blocked', { player: p.id });
        return 0;
      }
    }
    // Baraka Dorini: once per turn, Wealth from anything but a tile brings 1 more (rules-decisions 62).
    if (pillar === 'wealth' && !why.endsWith(' tile')) {
      const bonus = this.hook(p, 'wealthBonus');
      const k = `wealthBonus@t${this.s.turnNo}`;
      if (bonus && !p.used[k]) { p.used[k] = 1; n += bonus; }
    }
    p.res[pillar] += n;
    if (pillar === 'influence') this.s.lastInfluenceGain = p.id;
    this.log(`${p.name} gains ${n} ${cap(pillar)}${why ? ` (${why})` : ''}.`, 'gain', { player: p.id, amount: n });
    return n;
  }

  lose(p: PlayerState, pillar: Pillar, n: number, why = ''): number {
    const lost = Math.min(n, p.res[pillar]);
    if (lost <= 0) return 0;
    p.res[pillar] -= lost;
    this.log(`${p.name} loses ${lost} ${cap(pillar)}${why ? ` (${why})` : ''}.`, 'loss', { player: p.id, amount: lost });
    return lost;
  }

  steal(thief: PlayerState, from: PlayerState, pillar: Pillar, n: number, why = '') {
    const got = this.lose(from, pillar, n, why);
    if (got) this.gain(thief, pillar, got, why);
    return got;
  }

  thresholds(p: PlayerState) {
    const t = this.s.players.length <= THRESHOLDS.small.maxPlayers ? THRESHOLDS.small : THRESHOLDS.normal;
    const reduce = this.house(p).claimReduction?.(p.gen) ?? 0;
    return { combined: t.combined - reduce, minEach: t.minEach, single: t.single ?? Infinity };
  }
  // Which route makes this player eligible to claim, if any.
  claimRoute(p: PlayerState): 'combined' | 'single' | null {
    if (p.specter) return null;
    const t = this.thresholds(p);
    if (this.total(p) >= t.combined && PILLARS.every(x => p.res[x] >= t.minEach)) return 'combined';
    if (PILLARS.some(x => p.res[x] >= t.single)) return 'single';
    return null;
  }
  eligible(p: PlayerState) {
    return this.claimRoute(p) !== null;
  }

  // ---------------------------------------------------------------- cards and hands

  // Draws one card; the draw pile reshuffles from the discard when empty (Section 7).
  takeTopCard(): number | null {
    if (!this.s.drawPile.length) {
      if (!this.s.discard.length) return null;
      this.s.drawPile = shuffle(this.s.discard, this.rng);
      this.s.discard = [];
      this.log('The deck runs dry; the discard pile is shuffled into a new deck.', 'deck');
    }
    return this.s.drawPile.pop() ?? null;
  }

  discardFromHand(p: PlayerState, c: number, bottom = false) {
    p.hand = p.hand.filter(x => x !== c);
    if (bottom) this.s.discard.unshift(c); else this.s.discard.push(c);
  }

  // Draw one card for p: Instants resolve immediately, Hand Cards join the hand.
  *drawOne(p: PlayerState): Flow<boolean> {
    const c = this.takeTopCard();
    if (c === null) return false;
    const def = this.card(c);
    if (def.kind === 'instant') {
      this.log(`${p.name} draws ${def.name}!`, 'instant', { player: p.id, cards: [c] });
      this.s.inPlay.push(c);
      yield* this.resolveCard(def, p);
      this.s.inPlay = this.s.inPlay.filter(x => x !== c);
      this.s.discard.push(c);
      yield* this.flushDeaths();
    } else {
      p.hand.push(c);
      this.log(`${p.name} draws a card.`, 'draw', { player: p.id });
      this.log(`You drew ${def.name}.`, 'drawPrivate', { player: p.id, cards: [c], visibleTo: [p.id] });
      yield* this.enforceHandCap(p);
    }
    return true;
  }

  *drawToHand(p: PlayerState): Flow {
    let guard = 0;
    while (!p.specter && p.hand.length < HAND_SIZE && !this.s.turn?.stopDrawing && guard++ < 200) {
      if (!(yield* this.drawOne(p))) break;
    }
  }

  // The hand can never hold more than 3 Hand Cards (Section 4).
  *enforceHandCap(p: PlayerState, cap = HAND_SIZE): Flow {
    while (p.hand.length > cap) {
      const c = yield* this.ask(p, 'discard', `Too many cards: discard one (keep ${cap}).`,
        p.hand.map(x => ({ label: this.card(x).name, value: x })));
      this.discardFromHand(p, c, true);
      this.log(`${p.name} discards down to ${cap}.`, 'discard', { player: p.id });
    }
  }

  *resolveCard(def: CardDef, self: PlayerState): Flow {
    yield* def.effect(this, self, def);
  }

  canPlay(p: PlayerState, c: number) {
    const def = this.card(c);
    if (def.kind !== 'hand' || def.responseOnly) return false;
    return def.playable ? def.playable(this, p) : true;
  }

  *playHandCard(p: PlayerState, c: number): Flow {
    const def = this.card(c);
    p.hand = p.hand.filter(x => x !== c);
    p.handCardsPlayed++;
    if (this.s.turn) {
      this.s.turn.actions++;
      if (def.aggressive) this.s.turn.aggressive = true;
    }
    this.log(`${p.name} plays ${def.name}.`, 'card', { player: p.id, cards: [c] });
    this.s.inPlay.push(c);
    // Interference cancels any Hand Card; Embargo cancels a Barter card.
    const stop = yield* this.reaction(def.category === 'Barter' ? ['interference', 'embargo'] : ['interference'],
      p, `${p.name} plays ${def.name}.`, { played: c });
    if (stop) {
      this.log(`${def.name} is cancelled and has no effect.`, 'blocked', { player: p.id, cards: [c] });
      this.s.inPlay = this.s.inPlay.filter(x => x !== c);
      this.s.discard.push(c);
      return;
    }
    yield* this.resolveCard(def, p);
    this.s.inPlay = this.s.inPlay.filter(x => x !== c);
    // Cards that "mark" themselves stay out until an effect returns them.
    if (!this.s.effects.some(e => e.cardId === c)) this.s.discard.push(c);
    yield* this.flushDeaths();
  }

  // ---------------------------------------------------------------- movement

  moveTo(p: PlayerState, pos: Pos, how: string, kind = 'move') {
    if (!p.pos) return;
    const from = p.pos;
    p.pos = { ...pos };
    if (!p.visited.includes(key(pos))) p.visited.push(key(pos));
    this.log(`${p.name} ${how} ${label(from)} → ${label(pos)}.`, kind, { player: p.id });
  }

  // Up to `max` squares in one straight line. `full` forces the whole distance (stopping at the edge).
  *moveStraight(p: PlayerState, max: number, opts: { full?: boolean; chooser?: PlayerState; dirs?: Dir[]; why?: string } = {}): Flow {
    if (!p.pos || max <= 0) return;
    const chooser = opts.chooser ?? p;
    const options: Option<{ d: Dir; n: number }>[] = [];
    if (!opts.full) options.push({ label: 'Stay here', value: { d: 'north', n: 0 } });
    for (const d of opts.dirs ?? DIR_NAMES) {
      const room = Math.min(max, roomToEdge(p.pos, d));
      if (opts.full) {
        if (room > 0) options.push({ label: `${cap(d)} ${room}`, value: { d, n: room } });
      } else {
        for (let n = 1; n <= room; n++) options.push({ label: `${cap(d)} ${n}`, value: { d, n } });
      }
    }
    if (!options.length) return;
    const prompt = opts.why ?? (opts.full ? `Move ${max} in a straight line` : `Move up to ${max} in a straight line`);
    const choice = yield* this.ask(chooser, 'move', prompt, options, { player: p.id, max, from: p.pos });
    if (choice.n > 0) this.moveTo(p, step(p.pos, choice.d, choice.n), 'moves');
  }

  // Up to `max` orthogonal steps in any combination (rules-decisions 5): any square within that many
  // steps, turning as often as you like. Pawns never block.
  *moveFree(p: PlayerState, max: number, why?: string): Flow {
    if (!p.pos || max <= 0) return;
    const from = p.pos;
    const options: Option<Pos | null>[] = [{ label: 'Stay here', value: null }];
    for (const q of squaresWithin(from, max)) options.push({ label: label(q), value: q });
    const to = yield* this.ask(p, 'move', why ?? `Move up to ${max} spaces`, options, { player: p.id, max, from, free: true });
    if (to) this.moveTo(p, to, 'moves');
  }

  // One step toward a goal (Grand Market, Elodie's Memory...). Optional.
  *stepToward(p: PlayerState, goals: Pos[], why: string): Flow {
    if (!p.pos || !goals.length) return;
    const from = p.pos;
    const goal = goals.reduce((a, b) => (manhattan(from, a) <= manhattan(from, b) ? a : b));
    const options: Option<Pos | null>[] = [{ label: 'Stay', value: null }];
    for (const d of DIR_NAMES) {
      const n = step(from, d);
      if (inBoard(n) && manhattan(n, goal) < manhattan(from, goal)) options.push({ label: `Step ${d}`, value: n });
    }
    const to = yield* this.ask(p, 'move', why, options, { player: p.id, from });
    if (to) this.moveTo(p, to, 'steps');
  }

  teleport(p: PlayerState, pos: Pos, why: string) {
    this.moveTo(p, pos, `${why}:`, 'teleport');
  }

  // Extra movement from cards: adds to the roll before moving, or moves right away after (rules-decisions 9).
  *extraMove(p: PlayerState, n: number): Flow {
    const t = this.s.turn;
    if (t && t.player === p.id && !t.moved) {
      t.rollBonus += n;
      this.log(`${p.name} will move ${n} further this turn.`, 'info', { player: p.id });
    } else {
      yield* this.moveFree(p, n, `Move up to ${n} extra`);
    }
  }

  // Step 1 of the turn: roll and move.
  *rollAndMove(p: PlayerState): Flow {
    const t = this.s.turn!;
    let roll = rollD6(this.rng);
    const rolled = roll;
    const confusion = this.findEffect('confusion', p.id, false);
    if (confusion) { roll = Math.max(1, roll - 2); this.removeEffect(confusion); }
    roll += t.rollBonus + this.hook(p, 'moveBonus');
    this.log(`${p.name} rolls a ${rolled}${roll !== rolled ? ` (moves up to ${roll})` : ''}.`, 'roll', { player: p.id, amount: rolled });
    t.moved = true;

    // Ill Omen: the move is cancelled; they stay where they are (the resource check still happens there).
    if (yield* this.reaction(['omen'], p, `${p.name} rolls to move up to ${roll}.`, { roll })) {
      this.log(`Ill Omen: ${p.name} does not move this turn.`, 'blocked', { player: p.id });
      yield* this.resourceCheck(p);
      return;
    }

    const march = this.findEffect('forcedMarch', p.id, false);
    const puppeteer = march ? null : this.redirectChooser(p, REDIRECT_MOVE);
    if (march && march.by !== undefined) {
      this.removeEffect(march);
      const by = this.p(march.by);
      this.log(`Forced March: ${by.name} chooses ${p.name}'s direction.`, 'info', { player: by.id });
      yield* this.moveStraight(p, roll, { full: true, chooser: by.specter ? p : by, why: `Forced March: move ${p.name} the full ${roll}` });
    } else if (puppeteer) {
      const dir = yield* this.ask(puppeteer, 'direction', `Choose the direction of ${p.name}'s move`,
        DIR_NAMES.filter(d => roomToEdge(p.pos!, d) > 0).map(d => ({ label: cap(d), value: d })));
      yield* this.moveStraight(p, roll, { dirs: [dir] });
    } else {
      yield* this.moveFree(p, roll);
    }
    yield* this.ambush(p);
    yield* this.resourceCheck(p);
  }

  // Ambush: a rival next to where the mover stopped may attack them at once (if an attack is allowed).
  *ambush(p: PlayerState): Flow {
    const ok = (o: PlayerState) => !!(o.pos && p.pos && adjacent(o.pos, p.pos) && !this.attackBlockedReason(o, p, 'basic'));
    const hit = yield* this.reaction(['ambush'], p, `${p.name} stops beside you.`, {}, ok);
    if (hit) yield* this.attack(hit.player, p, 'basic');
  }

  // Step 2: the resource check.
  *resourceCheck(p: PlayerState): Flow {
    const t = this.s.turn;
    if (!p.pos || !t) return;
    const tile = this.tileAt(p.pos);
    if (!tile) return;
    const k = key(p.pos);
    if (tile.house.id === p.house) {
      return this.log(`${p.name} cannot farm their own tile.`, 'info', { player: p.id });
    }
    if (p.lastScoredTile === k) return this.log(`${p.name} already took from this land; the next score must come from a different tile.`, 'info', { player: p.id });
    if (this.findEffect('sabotage', p.id)) return this.log(`Sabotage: ${p.name} gains nothing from tiles this turn.`, 'blocked', { player: p.id });
    const pillar = TILE_PILLAR[tile.house.tileType];
    const alone = this.playersOn(p.pos).length === 1;
    let n = (alone ? TUNING.tileAlone : TUNING.tileShared) + this.hook(p, 'tileBonus', pillar);
    // Intercept: they gain 1 less.
    if (yield* this.reaction(['intercept'], p, `${p.name} is about to gain ${n} ${cap(pillar)} from ${tile.house.name}'s tile.`, { pillar, amount: n })) {
      n -= 1;
      this.log(`Intercepted: ${p.name} gains 1 less.`, 'blocked', { player: p.id });
    }
    if (n > 0 && this.gain(p, pillar, n, `${tile.house.name} ${tile.house.tileType} tile`)) t.scoredTile = k;
  }

  // ---------------------------------------------------------------- combat (Section 6)

  attackBlockedReason(a: PlayerState, t: PlayerState, kind: AttackInfo['kind']): string | null {
    if (t.specter || a.id === t.id) return 'invalid';
    if (kind === 'challenge') return null;
    if (OPENING.truceRounds > 0 && this.s.round <= OPENING.truceRounds) return 'the opening truce holds';
    if (THRONE_SANCTUARY && (onThrone(t.pos) || onThrone(a.pos))) return 'no one fights on the Throne';
    if (this.findEffect('newborn', t.id)) return `${t.name}'s heir has only just risen`;
    if (this.findEffect('noAttack', a.id)) return `${a.name} may not attack this turn`;
    if (this.s.effects.some(e => e.kind === 'truce' && e.armed &&
      ((e.owner === a.id && e.other === t.id) || (e.owner === t.id && e.other === a.id)))) return 'truce';
    if (this.findEffect('ceasefire', t.id)) return 'ceasefire';
    if (t.pos && this.s.effects.some(e => e.kind === 'shieldWall' && e.square === key(t.pos!) && e.owner !== t.id)) return 'Shield Wall';
    return null;
  }

  basicTargets(a: PlayerState): PlayerState[] {
    if (!a.pos) return [];
    const reach = this.hook(a, 'reach');
    return this.others(a).filter(t => t.pos &&
      (adjacent(a.pos!, t.pos) || (reach > 1 && inLine(a.pos!, t.pos, reach))) &&
      !this.attackBlockedReason(a, t, 'basic'));
  }

  mostFeared(): PlayerState | null {
    const living = this.living();
    const top = Math.max(...living.map(p => p.res.fear));
    const at = living.filter(p => p.res.fear === top);
    return at.length === 1 ? at[0] : null;
  }

  // Resolve one attack. Returns whether it landed and how much it dealt.
  *attack(a: PlayerState, t: PlayerState, kind: AttackInfo['kind'], base?: number, unblockable = false): Flow<{ landed: boolean; damage: number }> {
    if (this.s.turn?.player === a.id) this.s.turn.aggressive = true;
    let damage = base ?? a.hp;
    if (kind === 'basic' || kind === 'challenge') damage += this.hook(a, 'basicAttackBonus');
    const dread = this.findEffect('dreadBanner', a.id);
    if (dread) { damage += 1; this.removeEffect(dread); }
    if (a.mark === t.id) damage += 1;   // La Marca
    if (this.house(t).mostFearedDownside?.(t.gen) && this.mostFeared()?.id === t.id) damage += 1;
    const marked = this.findEffect('markedForDeath', t.id);
    const info: AttackInfo = { attacker: a.id, target: t.id, kind, damage: Math.min(TUNING.maxDamage, damage + (marked ? 1 : 0)) };
    this.log(`${a.name} attacks ${t.name}!`, 'attack', { player: a.id, target: t.id, amount: info.damage, tag: kind });

    // Block / Deflect window.
    const blocks = unblockable ? [] : t.hand.filter(c => this.card(c).block?.canUse(this, t, info));
    let outcome: 'negate' | 'survive1' | null = null;
    if (blocks.length) {
      const opts: Option<number | null>[] = [{ label: `Take ${info.damage} damage`, value: null },
        ...blocks.map(c => ({ label: this.card(c).name, value: c }))];
      const c = yield* this.ask(t, 'block', `${a.name} attacks you for ${info.damage}. Respond?`, opts, { attack: info });
      if (c !== null) {
        this.discardFromHand(t, c);
        this.log(`${t.name} answers with ${this.card(c).name}!`, 'block', { player: t.id, target: a.id, cards: [c] });
        outcome = yield* this.card(c).block!.resolve(this, t, info);
      }
    }
    if (outcome === 'negate') {
      yield* this.flushDeaths();
      return { landed: false, damage: 0 };
    }

    if (marked) this.removeEffect(marked);
    let dealt = info.damage;
    if (outcome === 'survive1') dealt = Math.max(0, Math.min(dealt, t.hp - 1));
    this.damage(t, dealt, a.id, kind === 'challenge' ? 'in the challenge' : '');
    if (outcome === 'survive1') this.log(`${t.name} refuses to fall!`, 'block', { player: t.id });
    if (this.s.turn?.player === a.id) this.s.turn.damageDealt += dealt;
    const fear = this.hook(a, 'fearOnLanded');
    if (fear) this.gain(a, 'fear', fear, 'combat win');
    // Agni ki Shakti III: a free step after landing an attack (rules-decisions 64).
    const steps = this.hook(a, 'stepOnLanded');
    if (steps && !a.specter && a.pos && !this.inChallenge) yield* this.moveFree(a, steps, `Agni ki Shakti: move up to ${steps}`);
    yield* this.flushDeaths();
    return { landed: true, damage: dealt };
  }

  *basicAttack(a: PlayerState, t: PlayerState): Flow {
    const turn = this.s.turn!;
    // The first attack of an attack action uses your action; Endless War's follow-ups don't.
    if (turn.attacks === 0 || turn.attacks >= turn.attacksAllowed) {
      if (turn.attacks >= turn.attacksAllowed) turn.attacksAllowed++;
      turn.actions++;
    }
    turn.attacks++;
    const puppeteer = this.redirectChooser(a, REDIRECT_TARGET);
    if (puppeteer) t = (yield* this.choosePlayer(puppeteer, this.basicTargets(a), `Choose who ${a.name} attacks`)) ?? t;
    const hit = yield* this.attack(a, t, 'basic');
    // Cards waiting for this attack resolve now, each once.
    for (const e of this.s.effects.filter(x => x.kind === 'afterAttack' && x.owner === a.id && x.armed)) {
      this.removeEffect(e);
      if (!a.specter) yield* this.card(e.cardId!).afterAttack!(this, a, hit.landed ? hit.damage : 0);
    }
  }

  // HP loss of any kind. Deaths are queued and processed by flushDeaths.
  damage(t: PlayerState, n: number, killer: number | null, why = '') {
    if (t.specter || n <= 0 || t.hp <= 0) return;
    // Sanctuary: no one dies on the Throne (except in a challenge fight); the loss stops at 1 Heart Token.
    if (THRONE_SANCTUARY && !this.inChallenge && onThrone(t.pos) && t.hp - n < 1) {
      n = t.hp - 1;
      this.log(`The Throne's sanctuary holds: ${t.name} cannot fall here.`, 'block', { player: t.id });
      if (n <= 0) return;
    }
    t.hp = Math.max(0, t.hp - n);
    this.log(`${t.name} loses ${n} Heart Token${n === 1 ? '' : 's'}${why ? ` ${why}` : ''}.`, 'damage', { player: t.id, amount: n });
    if (t.hp === 0 && !this.s.dying.some(d => d.victim === t.id)) this.s.dying.push({ victim: t.id, killer });
  }

  // Process queued deaths in order. If the active player died, their turn ends.
  *flushDeaths(): Flow {
    let activeDied = false;
    while (this.s.dying.length) {
      const { victim, killer } = this.s.dying[0];
      if (this.s.turn?.player === victim) activeDied = true;
      yield* this.killPlayer(this.p(victim), killer === null ? null : this.p(killer));
      this.s.dying.shift();
    }
    if (activeDied && !this.inChallenge) throw new EndTurn();
  }
  inChallenge = false;

  // ---------------------------------------------------------------- death and succession (Section 9)

  *killPlayer(v: PlayerState, killer: PlayerState | null): Flow {
    const house = this.house(v);
    this.log(`${v.name}'s Gen ${roman(v.gen)} ${house.name} falls${killer ? ` to ${killer.name}` : ''}.`, 'death', { player: v.id, target: killer?.id });
    if (!this.s.housesLost.includes(v.house)) this.s.housesLost.push(v.house);

    // 1. Halve one pool (the dying player's choice).
    const bleedable = PILLARS.filter(x => Math.floor(v.res[x] / 2) > 0);
    const pool = yield* this.choosePillar(v, 'Your character died: choose a pool to lose half of.', bleedable);
    if (pool) this.lose(v, pool, Math.floor(v.res[pool] / 2), 'death');

    // 2. Grudge or Reckoning.
    if (killer && killer.id !== v.id) {
      killer.kills++;
      const gi = killer.grudges.indexOf(v.id);
      if (gi >= 0 && !killer.specter) {
        killer.grudges.splice(gi, 1);
        killer.reckonings++;
        this.log(`Reckoning! ${killer.name} avenges their bloodline.`, 'reckoning', { player: killer.id, target: v.id });
        const cancels = this.hook(v, 'reckoningCancels');
        const usedCancels = v.used['reckoningCancel'] ?? 0;
        if (cancels > usedCancels && (yield* this.confirm(v, `Stillwater's Patience: cancel ${killer.name}'s Reckoning bonus?`, 'Cancel it', 'Allow'))) {
          v.used['reckoningCancel'] = usedCancels + 1;
          this.log(`${v.name}'s patience denies the Reckoning bonus.`, 'block', { player: v.id });
        } else {
          const from = PILLARS.filter(x => v.res[x] > 0);
          const pick = yield* this.choosePillar(killer, `Reckoning: steal 1 from ${v.name}'s pool`, from);
          if (pick) this.steal(killer, v, pick, 1, 'Reckoning');
        }
      } else {
        v.grudges.push(killer.id);
        this.log(`${v.name}'s bloodline now holds a Grudge against ${killer.name}.`, 'grudge', { player: v.id, target: killer.id });
      }
      const fear = this.hook(killer, 'fearOnKill');
      if (fear && !killer.specter) this.gain(killer, 'fear', fear, 'kill');
      this.s.lastKill = { killer: killer.id, victim: v.id };
    }

    // Effects that end with the character.
    this.s.effects = this.s.effects.filter(e => {
      const gone = e.owner === v.id && ['afterAttack', 'hex', 'markedForDeath', 'dreadBanner', 'confusion', 'forcedMarch', 'noFearGain', 'sabotage', 'noInfluenceGain'].includes(e.kind);
      if (gone && e.cardId) this.s.discard.push(e.cardId);
      return !gone;
    });
    for (const o of this.s.players) if (o.mark === v.id) o.mark = null;

    // 3-5. Next generation, or the Specter.
    if (v.gen === 4) {
      v.specter = true;
      v.hp = 0;
      v.pos = null;
      for (const c of [...v.hand]) this.discardFromHand(v, c);
      v.grudges = [];
      this.log(`${v.name}'s bloodline has ended. They rise as a Specter.`, 'specter', { player: v.id });
      // Vai'tama IV: take a passive from a house that has become a Specter.
      for (const o of this.living()) if (o.pendingExtraPassive) {
        o.pendingExtraPassive = false;
        o.extraPassive = v.house;
        this.log(`${o.name} claims the ${this.house(v).passiveName} of the fallen ${this.house(v).name}.`, 'ability', { player: o.id });
      }
    } else {
      v.gen = (v.gen + 1) as PlayerState['gen'];
      v.maxHp = house.hp[v.gen - 1];
      v.hp = v.maxHp;
      v.pos = { ...house.home };
      v.visited = [key(house.home)];
      v.lastScoredTile = null;
      this.log(`${v.name}'s Gen ${roman(v.gen)} heir rises at home with ${v.hp} Heart Tokens.`, 'succession', { player: v.id });
      if (NEWBORN_PROTECTION) {
        // Safe from attacks until the end of their first turn; if they fell on their own turn, that's the next one.
        this.s.effects = this.s.effects.filter(e => !(e.kind === 'newborn' && e.owner === v.id));
        this.addEffect('newborn', v.id, { at: 'turnEnd', player: v.id, turns: this.s.turn?.player === v.id ? 2 : 1 });
        this.log(`${v.name}'s heir is protected from attacks until the end of their first turn.`, 'info', { player: v.id });
      }
      if (house.legacyOnDeath) yield* this.chooseLegacy(v);
      if (house.extraPassiveAt && v.gen >= house.extraPassiveAt && !v.extraPassive && !v.pendingExtraPassive) {
        const gone = this.s.players.filter(o => o.specter && o.id !== v.id).map(o => o.house);
        if (gone.length) {
          v.extraPassive = yield* this.ask(v, 'legacy', 'Tide of Ancestors: take the passive of a vanished bloodline',
            gone.map(h => ({ label: `${this.house(h).name}: ${this.house(h).passiveName}`, value: h })));
          this.log(`${v.name} gains ${this.house(v.extraPassive!).passiveName} forever.`, 'ability', { player: v.id });
        } else {
          v.pendingExtraPassive = true;
        }
      }
    }

    // Agnivansh II: a bonus half-move after landing a kill.
    if (killer && !killer.specter && killer.pos && this.house(killer).halfMoveOnKill?.(killer.gen)) {
      const n = Math.ceil(rollD6(this.rng) / 2);
      yield* this.moveFree(killer, n, `Thirst for Blood: move up to ${n}`);
    }
  }

  *chooseLegacy(v: PlayerState): Flow {
    let pool = [...this.s.housesLost];
    if (!pool.length) return;
    const drawTwo = this.house(v).legacyDrawTwoAt;
    if (drawTwo && v.gen >= drawTwo) pool = shuffle(pool, this.rng).slice(0, 2);
    const h = yield* this.ask(v, 'legacy', 'Tahu\'ora: choose a Legacy from a fallen bloodline',
      pool.map(x => ({ label: `${this.house(x).name}: ${this.house(x).passiveName}`, value: x })));
    v.legacy = h;
    this.log(`${v.name} inherits the ${this.house(h).passiveName} Legacy of ${this.house(h).name}.`, 'ability', { player: v.id });
  }

  // ---------------------------------------------------------------- abilities

  abilityKey(a: Ability) {
    return a.limit === 'game' ? a.id : a.limit === 'round' ? `${a.id}@r${this.s.round}` : `${a.id}@t${this.s.turnNo}`;
  }

  abilitiesOf(p: PlayerState): Ability[] {
    const own = this.house(p).abilities.filter(a => p.gen >= a.gen);
    const fromPassives = this.passives(p).map(x => this.house(x.house).passiveAbility).filter((a): a is Ability => !!a);
    return [...own, ...fromPassives.filter((a, i, all) => all.findIndex(b => b.id === a.id) === i)];
  }

  usableAbilities(p: PlayerState): Ability[] {
    return this.abilitiesOf(p).filter(a => {
      const uses = a.uses ? a.uses(this, p) : 1;
      if ((p.used[this.abilityKey(a)] ?? 0) >= uses) return false;
      return a.canUse ? a.canUse(this, p) : true;
    });
  }

  *useAbility(p: PlayerState, a: Ability): Flow {
    const k = this.abilityKey(a);
    p.used[k] = (p.used[k] ?? 0) + 1;
    this.log(`${p.name} uses ${a.name}.`, 'ability', { player: p.id });
    yield* a.run(this, p);
    yield* this.flushDeaths();
  }

  // ---------------------------------------------------------------- the turn (Section 4)

  turnActions(p: PlayerState): Option<TurnAction>[] {
    const t = this.s.turn!;
    const out: Option<TurnAction>[] = [];
    if (!t.moved) out.push({ label: 'Roll and move', value: { type: 'roll' } });
    const canAttackNow = t.moved || this.house(p).attackBeforeMove?.(p.gen);
    const actionLeft = t.actions < t.actionsAllowed;
    const midAttack = t.attacks > 0 && t.attacks < t.attacksAllowed;
    if (canAttackNow && (midAttack || actionLeft)) {
      const ends = ATTACK_ENDS_TURN && t.moved && (midAttack ? t.attacks + 1 >= t.attacksAllowed : t.attacksAllowed <= 1) &&
        t.actions + (midAttack ? 0 : 1) >= t.actionsAllowed;
      for (const target of this.basicTargets(p)) {
        out.push({ label: `Attack ${target.name}${ends ? ' (ends turn)' : ''}`, value: { type: 'attack', target: target.id } });
      }
    }
    // A Hand Card is your action for the turn, played after you move (instead of attacking).
    if (t.moved && actionLeft && !midAttack) {
      for (const c of p.hand) if (this.canPlay(p, c)) out.push({ label: `Play ${this.card(c).name}`, value: { type: 'card', card: c } });
    }
    if (TRADE.offer && t.moved && actionLeft && !midAttack && !t.offered && this.tradePartners(p).length) {
      out.push({ label: 'Offer a trade', value: { type: 'trade' } });
    }
    for (const a of this.usableAbilities(p)) out.push({ label: a.name, value: { type: 'ability', id: a.id } });
    if (onThrone(p.pos) && this.eligible(p)) out.push({ label: 'Claim the Throne', value: { type: 'claim' } });
    if (t.moved) out.push({ label: 'End turn', value: { type: 'end' } });
    return out;
  }

  private startTurn(p: PlayerState, extraTurn: boolean) {
    this.s.turnNo++;
    this.s.turn = {
      player: p.id, moved: false, attacks: 0, attacksAllowed: 1, actions: 0, actionsAllowed: 1,
      rollBonus: 0, aggressive: false, damageDealt: 0, scoredTile: null, stopDrawing: false, extraTurn, offered: false,
    };
    // Effects that last "until your next turn" end now; "next turn" effects arm.
    this.expire(x => x.at === 'turnStart' && x.player === p.id);
    for (const e of this.s.effects) if (e.owner === p.id && !e.armed) e.armed = true;
  }

  *playTurn(p: PlayerState, extraTurn = false): Flow {
    this.startTurn(p, extraTurn);
    this.log(`${p.name}'s turn${extraTurn ? ' (The Great Raid: second turn)' : ''}.`, 'turn', { player: p.id });
    if (extraTurn && this.findEffect('handPublic', p.id)) this.reveal(p, 'all', 'The Great Raid');
    try {
      // Hex of Withering strikes at the start of the turn.
      for (const hex of this.s.effects.filter(e => e.kind === 'hex' && e.owner === p.id && e.armed)) {
        this.removeEffect(hex);
        this.damage(p, 1, hex.by ?? null, '(Hex of Withering)');
      }
      yield* this.flushDeaths();

      for (let guard = 0; guard < 100; guard++) {
        const action = yield* this.ask(p, 'turn', 'Your turn: choose an action', this.turnActions(p));
        if (action.type === 'end') break;
        yield* this.doAction(p, action);
        if (this.s.winner !== null) throw new GameOver();
        // Attacking is your action: the turn ends after your last allowed attack, once you've moved.
        const t = this.s.turn!;
        if (ATTACK_ENDS_TURN && action.type === 'attack' && t.attacks >= t.attacksAllowed && t.moved && t.actions >= t.actionsAllowed) break;
      }

      // Stillwater II: The Long Watch (no action at all: no attack, Hand Card or trade; rules-decisions 62).
      if (this.house(p).longWatch?.(p.gen) && !this.s.turn!.aggressive && this.s.turn!.actions === 0) {
        const x = yield* this.choosePillar(p, 'The Long Watch: you stayed your hand. Gain 1 of which resource?');
        if (x) this.gain(p, x, 1, 'The Long Watch');
      }
      // Step 5: draw back up to 3.
      yield* this.drawToHand(p);
    } catch (e) {
      if (!(e instanceof EndTurn)) throw e;
      this.log(`${p.name}'s turn ends.`, 'info', { player: p.id });
    }
    if (this.s.turn!.scoredTile) p.lastScoredTile = this.s.turn!.scoredTile;
    this.expire(x => x.at === 'turnEnd' && x.player === p.id);
    if (extraTurn) for (const e of this.s.effects.filter(x => x.kind === 'handPublic' && x.owner === p.id)) this.removeEffect(e);
    this.s.turn = null;
  }

  *doAction(p: PlayerState, action: TurnAction): Flow {
    switch (action.type) {
      case 'roll': yield* this.rollAndMove(p); break;
      case 'attack': yield* this.basicAttack(p, this.p(action.target)); break;
      case 'card': yield* this.playHandCard(p, action.card); break;
      case 'ability': {
        const a = this.abilitiesOf(p).find(x => x.id === action.id)!;
        yield* this.useAbility(p, a);
        break;
      }
      case 'claim': yield* this.claim(p); break;
      case 'trade': yield* this.offerTrade(p); break;
      case 'end': break;
    }
  }

  // ---------------------------------------------------------------- the trade offer (rules-decisions 60)

  // What p could give a partner: a resource p holds, for a different one the partner holds.
  tradeGives(p: PlayerState, partner: PlayerState): Pillar[] {
    return PILLARS.filter(y => p.res[y] > 0 && PILLARS.some(x => x !== y && partner.res[x] > 0));
  }
  tradePartners(p: PlayerState): PlayerState[] {
    return this.others(p).filter(o => this.tradeGives(p, o).length > 0);
  }

  *offerTrade(p: PlayerState): Flow {
    const t = this.s.turn!;
    t.offered = true;
    t.actions++;
    const partner = yield* this.choosePlayer(p, this.tradePartners(p), 'Offer a trade to whom?', { trade: true });
    if (!partner) return;
    const give = (yield* this.choosePillar(p, `Trade: give ${partner.name} 1 of`, this.tradeGives(p, partner), { trade: true, partner: partner.id }))!;
    const take = (yield* this.choosePillar(p, `Trade: ask ${partner.name} for 1`, PILLARS.filter(x => x !== give && partner.res[x] > 0),
      { trade: true, partner: partner.id, give }))!;
    this.log(`${p.name} offers ${partner.name} 1 ${cap(give)} for 1 ${cap(take)}.`, 'trade', { player: p.id, target: partner.id });
    const yes = yield* this.ask(partner, 'trade', `${p.name} offers you 1 ${cap(give)} for 1 of your ${cap(take)}.`,
      [{ label: 'Accept', value: true }, { label: 'Refuse', value: false }], { from: p.id, give, take });
    if (!yes) {
      this.log(`${partner.name} refuses the trade.`, 'trade', { player: partner.id, target: p.id });
      if (!TRADE.refusedUsesAction) t.actions--;
      return;
    }
    // Embargo: anyone else may cancel the deal.
    if (yield* this.reaction(['embargo'], p, `${p.name} and ${partner.name} trade ${cap(give)} for ${cap(take)}.`,
      { trade: true, partner: partner.id, give, take }, o => o.id !== partner.id)) {
      this.log('Embargo: the trade is cancelled. Nothing changes hands.', 'blocked', { player: p.id });
      return;
    }
    this.lose(p, give, 1, 'trade'); this.gain(partner, give, 1, 'trade');
    this.lose(partner, take, 1, 'trade'); this.gain(p, take, 1, 'trade');
  }

  // ---------------------------------------------------------------- the Specter (Section 10)

  specterChoices(): number[] {
    if (this.s.discard.length < TUNING.specterChoices) return [];
    return this.s.discard.slice(-TUNING.specterChoices).filter(c => {
      const d = this.card(c);
      return d.kind === 'instant' && !d.noSpecter;
    });
  }

  *specterTurn(p: PlayerState): Flow {
    this.startTurn(p, false);
    try {
      const choices = this.specterChoices();
      if (!choices.length) {
        this.log(`${p.name}'s Specter finds nothing to stir.`, 'specter', { player: p.id });
      } else {
        const c = yield* this.ask(p, 'specter', 'Specter: choose mischief from the discard pile',
          [{ label: 'Pass', value: null as number | null }, ...choices.map(x => ({ label: this.card(x).name, value: x as number | null }))]);
        if (c !== null) {
          const target = yield* this.choosePlayer(p, this.living(), `${this.card(c).name}: which player does it fall on?`);
          this.s.discard = this.s.discard.filter(x => x !== c);
          this.s.removed.push(c);
          if (target) {
            this.log(`${p.name}'s Specter unleashes ${this.card(c).name} on ${target.name}.`, 'specter', { player: p.id, target: target.id, cards: [c] });
            yield* this.resolveCard(this.card(c), target);
            yield* this.flushDeaths();
          }
        }
      }
    } catch (e) {
      if (!(e instanceof EndTurn)) throw e;
    }
    this.expire(x => x.at === 'turnEnd' && x.player === p.id);
    this.s.turn = null;
  }

  // ---------------------------------------------------------------- winning (Section 8)

  *claim(p: PlayerState): Flow {
    this.log(`${p.name} claims Elodie's Throne!`, 'claim', { player: p.id, tag: this.claimRoute(p) ?? undefined });
    const challengers: PlayerState[] = [];
    for (const o of this.seatsAfter(p)) {
      if (!this.eligible(o)) continue;
      if (yield* this.ask(o, 'challenge', `${p.name} claims the Throne. Challenge them?`,
        [{ label: 'Challenge!', value: true }, { label: 'Let it stand', value: false }], { claimant: p.id })) {
        challengers.push(o);
        this.log(`${o.name} challenges!`, 'challenge', { player: o.id, target: p.id });
      }
    }
    for (const c of challengers) {
      if (c.specter) continue;
      const survived = yield* this.challengeFight(p, c);
      if (!survived) {
        this.log(`${p.name}'s claim fails.`, 'claim', { player: p.id });
        throw new EndTurn();
      }
    }
    this.s.winner = p.id;
    this.s.endReason = challengers.length ? `${p.name} defeated every challenger and took the Throne.` : `${p.name} claimed the Throne unchallenged.`;
    this.log(this.s.endReason, 'win', { player: p.id });
  }

  // Returns true if the claimant survives.
  *challengeFight(claimant: PlayerState, challenger: PlayerState): Flow<boolean> {
    const order = this.s.config.challengeFirstStriker === 'claimant' ? [claimant, challenger] : [challenger, claimant];
    const gen = { claimant: claimant.gen, challenger: challenger.gen };
    this.inChallenge = true;
    try {
      for (let blow = 0; blow < MAX_FIGHT_BLOWS; blow++) {
        const [a, d] = blow % 2 === 0 ? order : [order[1], order[0]];
        yield* this.attack(a, d, 'challenge');
        if (claimant.gen !== gen.claimant || claimant.specter) return false;
        if (challenger.gen !== gen.challenger || challenger.specter) return true;
      }
      return true;
    } finally {
      this.inChallenge = false;
    }
  }

  // Sudden Death: highest combined total, then the tie-break chain.
  suddenDeath() {
    let field = this.living();
    if (!field.length) field = [...this.s.players];
    const best = (score: (p: PlayerState) => number) => {
      const top = Math.max(...field.map(score));
      field = field.filter(p => score(p) === top);
    };
    best(p => this.total(p));
    if (field.length > 1) best(p => Math.max(...PILLARS.map(x => p.res[x])));
    if (field.length > 1) best(p => p.kills);
    if (field.length > 1) best(p => p.reckonings);
    let winner = field[0];
    let reason = 'highest combined resources';
    if (field.length > 1) {
      reason = 'a final duel';
      for (const next of field.slice(1)) winner = this.duel(winner, next);
    }
    this.s.winner = winner.id;
    this.s.endReason = `Sudden Death after round ${this.s.round}: ${winner.name} wins on ${reason}.`;
    this.log(this.s.endReason, 'win', { player: winner.id });
  }

  // Tie-break duel: trade blows (damage = current HP) until one falls. Earlier in turn order strikes first.
  duel(a: PlayerState, b: PlayerState): PlayerState {
    const [first, second] = this.s.order.indexOf(a.id) < this.s.order.indexOf(b.id) ? [a, b] : [b, a];
    const hp = { [first.id]: first.hp, [second.id]: second.hp };
    for (let blow = 0; blow < MAX_FIGHT_BLOWS; blow++) {
      const [x, y] = blow % 2 === 0 ? [first, second] : [second, first];
      hp[y.id] -= Math.max(1, hp[x.id]);
      this.log(`Duel: ${x.name} strikes ${y.name}.`, 'attack', { player: x.id, target: y.id });
      if (hp[y.id] <= 0) return x;
    }
    return first;
  }

  // ---------------------------------------------------------------- the game loop

  *run(): Flow {
    try {
      for (;;) {
        this.s.round++;
        this.log(`Round ${this.s.round} begins.`, 'round');
        for (const id of this.s.order) {
          const p = this.p(id);
          if (p.specter) yield* this.specterTurn(p);
          else {
            yield* this.playTurn(p);
            while (p.extraTurn && !p.specter) {
              p.extraTurn = false;
              yield* this.playTurn(p, true);
            }
          }
          if (this.s.winner !== null) throw new GameOver();
        }
        this.expire(x => x.at === 'roundEnd' && x.round <= this.s.round);
        if (this.s.round >= this.s.config.suddenDeathRound) {
          this.suddenDeath();
          throw new GameOver();
        }
      }
    } catch (e) {
      if (!(e instanceof GameOver)) throw e;
    }
  }
}

export const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
export const roman = (n: number) => ['I', 'II', 'III', 'IV'][n - 1] ?? String(n);
export { throneDistance };
