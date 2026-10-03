import { create } from 'zustand';
import { Runner } from '../engine/runner';
import type { GameSetup, HouseId } from '../engine/types';
import { CONTENT } from '../data';
import { makeRng, shuffle } from '../engine/rng';

const KEY = 'tob-game';
export const HUMAN = 0;

export type Speed = 'normal' | 'fast' | 'instant';
export const SPEED_MS: Record<Speed, number> = { normal: 650, fast: 220, instant: 0 };

interface Saved { setup: GameSetup; answers: number[] }

interface GameStore {
  runner: Runner | null;
  version: number;              // bumps on every change so components re-render
  speed: Speed;
  start: (name: string, players: number) => void;
  resume: () => boolean;
  answer: (i: number) => void;
  quit: () => void;
  setSpeed: (s: Speed) => void;
  hasSave: () => boolean;
}

function save(r: Runner) {
  try { localStorage.setItem(KEY, JSON.stringify({ setup: r.state.setup, answers: r.answers } satisfies Saved)); } catch { /* storage unavailable */ }
}
function load(): Saved | null {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function clear() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }

export const useGame = create<GameStore>((set, get) => ({
  runner: null,
  version: 0,
  speed: 'normal',

  start: (name, players) => {
    const seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    // The house lottery: shuffle the eight houses and deal one to each seat.
    const houses = shuffle(Object.keys(CONTENT.houses) as HouseId[], makeRng(seed ^ 0x9e3779b9)).slice(0, players);
    const setup: GameSetup = {
      seed,
      seats: houses.map((house, i) => ({
        name: i === HUMAN ? (name.trim() || 'You') : CONTENT.houses[house].name.replace('House ', ''),
        isBot: i !== HUMAN,
        house,
      })),
    };
    const runner = new Runner(setup, CONTENT);
    save(runner);
    set({ runner, version: get().version + 1 });
  },

  resume: () => {
    const s = load();
    if (!s) return false;
    try {
      const runner = Runner.replay(s.setup, CONTENT, s.answers);
      set({ runner, version: get().version + 1 });
      return true;
    } catch {
      clear();
      return false;
    }
  },

  answer: i => {
    const r = get().runner;
    if (!r || r.over) return;
    r.answer(i);
    if (r.over) clear(); else save(r);
    set({ version: get().version + 1 });
  },

  quit: () => { clear(); set({ runner: null, version: get().version + 1 }); },
  setSpeed: speed => set({ speed }),
  hasSave: () => load() !== null,
}));
