// Past games, kept on the phone for a while so problems can be investigated afterwards.
// Each entry has the readable chronicle plus the exact setup and answers, so a game can be replayed
// step by step on the build it was played on.
import type { Runner } from '../engine/runner';
import type { GameSetup } from '../engine/types';
import { roman } from '../engine/game';

const KEY = 'tob-history';
export const HISTORY_DAYS = 14;
export const HISTORY_MAX = 20;
export const BUILD = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';

export type GameOutcome = 'won' | 'abandoned' | 'interrupted' | 'in progress';

export interface PastGame {
  id: string;
  startedAt: number;
  endedAt: number;
  build: string;
  outcome: GameOutcome;
  note?: string;
  summary: string;              // "4 players · round 9 · Brasador won"
  setup: GameSetup;
  answers: number[];
  chronicle: string[];          // every log line, including hidden ones (this is your own device)
  final: string[];              // end-of-game standings
}

export function loadHistory(): PastGame[] {
  try {
    const raw = localStorage.getItem(KEY);
    const all: PastGame[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - HISTORY_DAYS * 86_400_000;
    return all.filter(g => g.endedAt >= cutoff);
  } catch {
    return [];
  }
}

function store(list: PastGame[]) {
  // Newest first; drop the oldest until it fits in storage.
  let items = list.slice(0, HISTORY_MAX);
  while (items.length) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); return; } catch { items = items.slice(0, -1); }
  }
}

export function chronicleOf(r: Runner): string[] {
  return r.state.log.map(e => `R${e.round} ${e.visibleTo ? '[private] ' : ''}${e.text}`);
}

export function standings(r: Runner): string[] {
  const g = r.game;
  return r.state.players.map(p =>
    `${p.name} — ${g.house(p).name}, Gen ${roman(p.gen)}${p.specter ? ' (Specter)' : ''}, ` +
    `HP ${p.hp}/${p.maxHp}, Influence ${p.res.influence}, Fear ${p.res.fear}, Wealth ${p.res.wealth}, ` +
    `kills ${p.kills}${r.state.winner === p.id ? ' — WINNER' : ''}`);
}

export function snapshot(r: Runner, outcome: GameOutcome, startedAt: number, build = BUILD, note?: string): PastGame {
  const s = r.state;
  const winner = s.winner !== null ? s.players[s.winner].name : null;
  return {
    id: `${s.setup.seed}-${startedAt}`,
    startedAt,
    endedAt: Date.now(),
    build,
    outcome,
    note,
    summary: `${s.players.length} players · round ${s.round} · ${winner ? `${winner} won` : outcome}`,
    setup: s.setup,
    answers: [...r.answers],
    chronicle: chronicleOf(r),
    final: standings(r),
  };
}

export function archive(game: PastGame) {
  store([game, ...loadHistory().filter(g => g.id !== game.id)]);
}

// A saved game whose build no longer matches can't be replayed; keep what we know about it.
export function archiveRaw(setup: GameSetup, answers: number[], startedAt: number, build: string, note: string) {
  archive({
    id: `${setup.seed}-${startedAt}`, startedAt, endedAt: Date.now(), build, outcome: 'interrupted', note,
    summary: `${setup.seats.length} players · interrupted`, setup, answers, chronicle: [], final: [],
  });
}

// Plain text for copying or downloading: readable chronicle first, replay data last.
export function exportText(g: PastGame): string {
  const when = new Date(g.startedAt).toLocaleString();
  return [
    'THRONE OF BLOODLINES — GAME LOG',
    `Started: ${when}`,
    `Build: ${g.build}`,
    `Outcome: ${g.outcome}${g.note ? ` (${g.note})` : ''}`,
    `Seats: ${g.setup.seats.map((x, i) => `${i}: ${x.name}${x.isBot ? ' (bot)' : ''} ${x.house ?? ''}`).join(' | ')}`,
    '',
    '— Final standings —',
    ...g.final,
    '',
    '— Chronicle —',
    ...g.chronicle,
    '',
    '— Replay data (for debugging) —',
    JSON.stringify({ build: g.build, setup: g.setup, answers: g.answers }),
  ].join('\n');
}

export function downloadText(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
