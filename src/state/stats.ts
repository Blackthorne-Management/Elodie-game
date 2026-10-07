// Your record on this device: one small entry per finished game, summed up for the main screen.
import type { Runner } from '../engine/runner';
import type { HouseId } from '../engine/types';

const KEY = 'tob-stats';
const MAX_GAMES = 1000;

export interface GameRecord {
  at: number;
  won: boolean;
  house: HouseId;
  players: number;
  rounds: number;
  kills: number;
  deaths: number;
  specter: boolean;
  claims: number;               // times you claimed the Throne
  suddenDeath: boolean;
  winnerHouse: HouseId | null;
}

export function loadRecords(): GameRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordOf(r: Runner, me: number): GameRecord {
  const s = r.state;
  const p = s.players[me];
  const winner = s.winner !== null ? s.players[s.winner] : null;
  return {
    at: Date.now(),
    won: s.winner === me,
    house: p.house,
    players: s.players.length,
    rounds: s.round,
    kills: p.kills,
    deaths: p.gen - 1 + (p.specter ? 1 : 0),
    specter: p.specter,
    claims: s.log.filter(e => e.kind === 'claim' && e.player === me && e.text.includes("claims Elodie's Throne")).length,
    suddenDeath: (s.endReason ?? '').startsWith('Sudden Death'),
    winnerHouse: winner ? winner.house : null,
  };
}

export function addRecord(rec: GameRecord) {
  try { localStorage.setItem(KEY, JSON.stringify([rec, ...loadRecords()].slice(0, MAX_GAMES))); } catch { /* storage full or blocked */ }
}

export function resetRecords() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export interface HouseLine { house: HouseId; played: number; wins: number }

export interface Stats {
  played: number;
  wins: number;
  rate: number;                 // 0..1
  streak: number;               // current win streak
  bestStreak: number;
  houses: HouseLine[];          // most played first
  bestHouse: HouseLine | null;  // most wins
  favourite: HouseLine | null;  // most played
  nemesis: { house: HouseId; times: number } | null;  // the bot house that beat you most
  fastestWin: number | null;    // fewest rounds
  kills: number;
  deaths: number;
  specters: number;
  claims: number;
  suddenDeathWins: number;
  recent: GameRecord[];         // newest first
}

const most = <T,>(xs: T[], score: (x: T) => number) =>
  xs.reduce<T | null>((best, x) => (score(x) > 0 && (!best || score(x) > score(best)) ? x : best), null);

export function summarise(games: GameRecord[]): Stats {
  const byHouse = new Map<HouseId, HouseLine>();
  const beatMe = new Map<HouseId, number>();
  let streak = 0, run = 0, bestStreak = 0, streakOpen = true;
  for (const g of games) {           // newest first
    const line = byHouse.get(g.house) ?? { house: g.house, played: 0, wins: 0 };
    line.played++;
    if (g.won) line.wins++;
    byHouse.set(g.house, line);
    if (!g.won && g.winnerHouse) beatMe.set(g.winnerHouse, (beatMe.get(g.winnerHouse) ?? 0) + 1);
    if (g.won) { run++; if (streakOpen) streak++; } else { run = 0; streakOpen = false; }
    bestStreak = Math.max(bestStreak, run);
  }
  const houses = [...byHouse.values()].sort((a, b) => b.played - a.played || b.wins - a.wins);
  const wins = games.filter(g => g.won);
  const nem = most([...beatMe.entries()], ([, n]) => n);
  const sum = (f: (g: GameRecord) => number) => games.reduce((t, g) => t + f(g), 0);
  return {
    played: games.length,
    wins: wins.length,
    rate: games.length ? wins.length / games.length : 0,
    streak,
    bestStreak,
    houses,
    bestHouse: most(houses, h => h.wins),
    favourite: most(houses, h => h.played),
    nemesis: nem ? { house: nem[0], times: nem[1] } : null,
    fastestWin: wins.length ? Math.min(...wins.map(g => g.rounds)) : null,
    kills: sum(g => g.kills),
    deaths: sum(g => g.deaths),
    specters: sum(g => (g.specter ? 1 : 0)),
    claims: sum(g => g.claims),
    suddenDeathWins: wins.filter(g => g.suddenDeath).length,
    recent: games.slice(0, 5),
  };
}
