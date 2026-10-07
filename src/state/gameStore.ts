import { create } from 'zustand';
import { Runner } from '../engine/runner';
import type { GameSetup, HouseId } from '../engine/types';
import { CONTENT } from '../data';
import { makeRng, shuffle } from '../engine/rng';
import { BUILD, archive, archiveRaw, snapshot } from './history';
import { addRecord, recordOf } from './stats';

const KEY = 'tob-game';
export const HUMAN = 0;

export type Speed = 'normal' | 'fast' | 'instant';
export const SPEED_MS: Record<Speed, number> = { normal: 650, fast: 220, instant: 0 };

interface Saved { setup: GameSetup; answers: number[]; build?: string; startedAt?: number }

interface GameStore {
  runner: Runner | null;
  startedAt: number;
  notice: string | null;        // shown on the setup screen (e.g. a game interrupted by an update)
  version: number;              // bumps on every change so components re-render
  speed: Speed;
  start: (name: string, players: number) => void;
  resume: () => boolean;
  answer: (i: number) => void;
  quit: () => void;
  setSpeed: (s: Speed) => void;
  hasSave: () => boolean;
  dismissNotice: () => void;
}

function save(r: Runner, startedAt: number) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ setup: r.state.setup, answers: r.answers, build: BUILD, startedAt } satisfies Saved));
  } catch { /* storage unavailable */ }
}
function load(): Saved | null {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function clear() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }

export const useGame = create<GameStore>((set, get) => ({
  runner: null,
  startedAt: 0,
  notice: null,
  version: 0,
  speed: 'normal',

  start: (name, players) => {
    const seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    // The house lottery: shuffle the eight houses and deal one to each seat.
    const houses = shuffle(Object.keys(CONTENT.houses) as HouseId[], makeRng(seed ^ 0x9e3779b9)).slice(0, players);
    const setup: GameSetup = {
      seed,
      seats: houses.map((house, i) => ({
        name: i === HUMAN && name.trim() ? name.trim() : CONTENT.houses[house].name.replace('House ', ''),
        isBot: i !== HUMAN,
        house,
      })),
    };
    // Starting over with a game in progress files the old one under "abandoned".
    const prev = get().runner;
    if (prev && !prev.over) archive(snapshot(prev, 'abandoned', get().startedAt));
    else if (!prev) {
      const old = load();
      if (old) archiveRaw(old.setup, old.answers, old.startedAt ?? Date.now(), old.build ?? 'unknown', 'replaced by a new game');
    }
    const startedAt = Date.now();
    const runner = new Runner(setup, CONTENT);
    save(runner, startedAt);
    set({ runner, startedAt, version: get().version + 1 });
  },

  resume: () => {
    const s = load();
    if (!s) return false;
    // A game is only replayed on the build it was played on: rule changes would scramble it.
    if (s.build !== BUILD) {
      archiveRaw(s.setup, s.answers, s.startedAt ?? Date.now(), s.build ?? 'unknown', `the app updated (${s.build ?? '?'} → ${BUILD})`);
      clear();
      set({ notice: 'The app updated since your last game, so it could not be resumed. Start a new one!', version: get().version + 1 });
      return false;
    }
    try {
      const runner = Runner.replay(s.setup, CONTENT, s.answers);
      set({ runner, startedAt: s.startedAt ?? Date.now(), version: get().version + 1 });
      return true;
    } catch {
      archiveRaw(s.setup, s.answers, s.startedAt ?? Date.now(), s.build ?? 'unknown', 'could not be resumed');
      clear();
      set({ notice: 'Your last game could not be resumed. Start a new one!', version: get().version + 1 });
      return false;
    }
  },

  answer: i => {
    const r = get().runner;
    if (!r || r.over) return;
    r.answer(i);
    if (r.over) { clear(); archive(snapshot(r, 'won', get().startedAt)); addRecord(recordOf(r, HUMAN)); } else save(r, get().startedAt);
    set({ version: get().version + 1 });
  },

  quit: () => {
    const r = get().runner;
    if (r && !r.over) archive(snapshot(r, 'abandoned', get().startedAt));
    clear();
    set({ runner: null, version: get().version + 1 });
  },
  dismissNotice: () => set({ notice: null }),
  setSpeed: speed => set({ speed }),
  hasSave: () => load() !== null,
}));
