// The game server's rules, kept pure so they can be tested here and bundled into the Supabase Edge Function
// (supabase/functions/bloodlines). One Session is one row in the database; every request loads it, applies one
// operation and saves it. The game itself is replayed from its setup and answers, so the server stores no engine state.
import { CONTENT } from '../data';
import { Runner } from '../engine/runner';
import { makeRng } from '../engine/rng';
import { botChoose } from '../ai/bot';
import { dealHouses, houseRing, pickOrder } from '../engine/houseChoice';
import type { TwoPlayerMode } from '../engine/houseChoice';
import type { Decision, GameSetup, GameState, HouseId, Pos } from '../engine/types';
import type { GameView, LobbyView, SessionStatus, SeatInfo } from './protocol';

export interface Seat { name: string; token: string | null; bot: boolean; vote: boolean; house: HouseId | null }

export interface Session {
  code: string;
  status: SessionStatus;
  total: number;
  humans: number;
  seats: Seat[];
  pickOrder: number[] | null;
  pickRolls: number[][] | null;
  pickIndex: number;       // position in pickOrder
  setup: GameSetup | null;
  answers: number[];
  version: number;
  created: number;
  twoMode?: TwoPlayerMode;  // 2 players: Race (houses as usual) or Battle (neighbouring houses), rules-decisions 82
}

export interface Env { rand: () => number; token: () => string; now: () => number }

export class GameError extends Error {}
const fail = (msg: string): never => { throw new GameError(msg); };

const CODE_LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const newCode = (env: Env) => Array.from({ length: 6 }, () => CODE_LETTERS[Math.floor(env.rand() * CODE_LETTERS.length)]).join('');
export const normCode = (c: string) => c.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
const cleanName = (n: string) => n.trim().replace(/\s+/g, ' ').slice(0, 16);
// Elodie always goes first when she plays (rules-decisions 72).
const ELODIE = ['elodie', 'lolo', 'lodie'];

const HOUSE_IDS = Object.keys(CONTENT.houses) as HouseId[];
const RING = houseRing(Object.fromEntries(HOUSE_IDS.map(h => [h, CONTENT.houses[h].home])) as Record<HouseId, Pos>);
const battle = (s: Session) => s.total === 2 && s.twoMode === 'battle';
// The houses the next picker may take: any free house.
export function pickable(s: Session): HouseId[] {
  return HOUSE_IDS.filter(h => !s.seats.some(x => x.house === h));
}
// How many seats pick: everyone, except in a 2-player Battle, where only the first picks and the second house comes
// from the die (rules-decisions 87).
const picksNeeded = (s: Session) => (battle(s) ? 1 : s.pickOrder?.length ?? 0);
const houseName = (h: HouseId) => CONTENT.houses[h].name.replace('House ', '');

export function createSession(env: Env, code: string, name: string, total: number, humans: number, twoMode: TwoPlayerMode = 'race'): { session: Session; token: string } {
  if (!Number.isInteger(total) || total < 2 || total > 8) fail('Choose 2 to 8 players.');
  if (twoMode !== 'race' && twoMode !== 'battle') fail('Choose Race or Battle.');
  if (!Number.isInteger(humans) || humans < 1 || humans > total) fail('Choose how many of them are people (at least you).');
  const token = env.token();
  const seats: Seat[] = Array.from({ length: total }, (_, i) => ({
    name: i === 0 ? cleanName(name) || 'Host' : '', token: i === 0 ? token : null, bot: i >= humans, vote: false, house: null,
  }));
  return {
    token,
    session: { code, status: 'lobby', total, humans, seats, pickOrder: null, pickRolls: null, pickIndex: 0, setup: null, answers: [], version: 1, created: env.now(),
      ...(total === 2 ? { twoMode } : {}) },
  };
}

export const seatOf = (s: Session, token: string) => {
  const i = s.seats.findIndex(x => x.token && x.token === token);
  return i < 0 ? fail('You are not in this game.') : i;
};

export function joinSession(env: Env, s: Session, name: string): { seat: number; token: string } {
  if (s.status !== 'lobby') fail('That game has already started.');
  const seat = s.seats.findIndex(x => !x.bot && !x.token);
  if (seat < 0) fail('That game is full.');
  const token = env.token();
  s.seats[seat] = { ...s.seats[seat], name: cleanName(name) || `Player ${seat + 1}`, token };
  s.version++;
  return { seat, token };
}

export function leaveSession(s: Session, seat: number) {
  if (s.status !== 'lobby') fail('The game has started; you can come back with the same link.');
  if (seat === 0) { s.status = 'ended'; s.version++; return; }
  s.seats[seat] = { name: '', token: null, bot: false, vote: false, house: null };
  s.version++;
}

const humansJoined = (s: Session) => s.seats.every(x => x.bot || x.token);
const pickAgreed = (s: Session) => s.seats.filter(x => !x.bot).every(x => x.vote);

export function vote(s: Session, seat: number, pick: boolean) {
  if (s.status !== 'lobby') fail('Houses are already being chosen.');
  s.seats[seat].vote = pick;
  s.version++;
}

// Host starts: picking if every human agreed (roll-off for the first pick, then clockwise), otherwise the lottery.
export function startSession(env: Env, s: Session, seat: number) {
  if (seat !== 0) fail('Only the host can start the game.');
  if (s.status !== 'lobby') fail('The game has already started.');
  if (!humansJoined(s)) fail('Wait until every player has joined.');
  if (pickAgreed(s)) {
    const rng = makeRng(Math.floor(env.rand() * 2 ** 31));
    const { order, rolls } = pickOrder(s.total, rng);
    s.pickOrder = order;
    s.pickRolls = rolls;
    s.pickIndex = 0;
    s.status = 'picking';
    autoPickBots(env, s);
  } else {
    beginGame(env, s);
  }
  s.version++;
}

function autoPickBots(env: Env, s: Session) {
  while (s.status === 'picking' && s.pickOrder && s.pickIndex < picksNeeded(s) && s.seats[s.pickOrder[s.pickIndex]].bot) {
    const free = pickable(s);
    s.seats[s.pickOrder[s.pickIndex]].house = free[Math.floor(env.rand() * free.length)];
    s.pickIndex++;
  }
  if (s.status === 'picking' && s.pickOrder && s.pickIndex >= picksNeeded(s)) beginGame(env, s);
}

export function pickHouse(env: Env, s: Session, seat: number, house: HouseId) {
  if (s.status !== 'picking' || !s.pickOrder) fail('It is not time to pick houses.');
  if (s.pickOrder![s.pickIndex] !== seat) fail('It is not your pick yet.');
  if (!HOUSE_IDS.includes(house) || s.seats.some(x => x.house === house)) fail('That house is taken.');
  s.seats[seat].house = house;
  s.pickIndex++;
  autoPickBots(env, s);
  s.version++;
}

function beginGame(env: Env, s: Session) {
  const seed = Math.floor(env.rand() * 2 ** 31) >>> 0;
  const houses = dealHouses(HOUSE_IDS, s.total, s.seats.map(x => x.house), makeRng(seed ^ 0x9e3779b9), battle(s) ? RING : undefined);
  const elodie = s.seats.findIndex(x => !x.bot && ELODIE.includes(x.name.trim().toLowerCase()));
  s.seats.forEach((x, i) => { x.house = houses[i]; if (x.bot) x.name = houseName(houses[i]); });
  s.setup = {
    seed,
    seats: s.seats.map(x => ({ name: x.name, isBot: x.bot, house: x.house! })),
    ...(elodie >= 0 ? { firstPlayer: elodie } : {}),
  };
  s.answers = [];
  s.status = 'active';
}

const finish = (s: Session, r: Runner) => {
  s.answers = [...r.answers];
  if (r.over) s.status = 'ended';
  s.version++;
};

export const replay = (s: Session) => Runner.replay(s.setup!, CONTENT, s.answers);

export function answer(s: Session, seat: number, index: number, at: number) {
  if (s.status !== 'active' || !s.setup) fail('The game is not running.');
  if (at !== s.answers.length) fail('The game moved on; try again.');
  const r = replay(s);
  if (!r.pending || r.pending.player !== seat) fail('It is not your decision.');
  if (!Number.isInteger(index) || index < 0 || index >= r.pending!.options.length) fail('That is not one of the choices.');
  r.answer(index);
  finish(s, r);
}

// A bot's decision, one at a time: the players' apps ask for it once the table has shown the last move, so bots play
// at a watchable pace. The server makes the choice; `at` stops two apps advancing the same decision.
export function botStep(s: Session, at: number) {
  if (s.status !== 'active' || !s.setup) fail('The game is not running.');
  if (at !== s.answers.length) fail('The game moved on; try again.');
  const r = replay(s);
  if (!r.pending || !s.seats[r.pending.player].bot) fail('It is not a bot\'s decision.');
  const rng = makeRng((s.setup!.seed ^ Math.imul(r.answers.length + 1, 2654435761)) >>> 0);
  r.answer(botChoose(r.game, r.pending!, rng));
  finish(s, r);
}

// ---------------------------------------------------------------- what each player may see

export function lobbyView(s: Session, seat: number): LobbyView {
  const seats: SeatInfo[] = s.seats.map((x, i) => ({
    seat: i, name: x.name, bot: x.bot, joined: x.bot || !!x.token, vote: x.vote, house: x.house,
  }));
  return {
    code: s.code, status: s.status, total: s.total, humans: s.humans, me: seat, host: seat === 0, seats,
    pickAgreed: pickAgreed(s), pickOrder: s.pickOrder, pickRolls: s.pickRolls,
    pickTurn: s.status === 'picking' && s.pickOrder && s.pickIndex < picksNeeded(s) ? s.pickOrder[s.pickIndex] ?? null : null, version: s.version,
    twoMode: s.total === 2 ? s.twoMode ?? 'race' : null, pickable: s.status === 'picking' ? pickable(s) : null,
  };
}

// Context keys that are safe to show everyone about someone else's decision (who is moving, an attack, a claim).
const PUBLIC_CONTEXT = ['player', 'from', 'free', 'attack', 'claimant', 'roll', 'max'];

export function maskState(st: GameState, seat: number): GameState {
  const s = structuredClone(st);
  s.setup = { ...s.setup, seed: 0 };
  s.drawPile = [];
  for (const p of s.players) if (p.id !== seat) p.hand = [];
  s.log = s.log.filter(e => !e.visibleTo || e.visibleTo.includes(seat));
  return s;
}

export function maskDecision(d: Decision | null, seat: number): Decision | null {
  if (!d || d.player === seat) return d;
  const context: Record<string, unknown> = {};
  for (const k of PUBLIC_CONTEXT) if (d.context && k in d.context) context[k] = d.context[k];
  return { player: d.player, kind: d.kind, prompt: '', options: [], context };
}

export function gameView(s: Session, seat: number): GameView {
  const r = replay(s);
  return {
    lobby: lobbyView(s, seat),
    state: maskState(r.state, seat),
    pending: maskDecision(r.pending, seat),
    answers: r.answers.length,
    over: r.over,
  };
}
