import { create } from 'zustand';
import { Runner } from '../engine/runner';
import type { GameSetup, HouseId, Pos } from '../engine/types';
import { CONTENT } from '../data';
import { SUDDEN_DEATH_ROUND } from '../config';
import { makeRng } from '../engine/rng';
import { dealHouses, houseRing } from '../engine/houseChoice';
import type { TwoPlayerMode } from '../engine/houseChoice';
import { BUILD, archive, archiveRaw, snapshot } from './history';
import { addRecord, recordOf } from './stats';
import type { RemoteRunner } from '../net/remote';

const KEY = 'tob-game';
export const HUMAN = 0;

export type Speed = 'normal' | 'fast' | 'instant';
export const SPEED_MS: Record<Speed, number> = { normal: 650, fast: 220, instant: 0 };

interface Saved { setup: GameSetup; answers: number[]; build?: string; startedAt?: number }

// An online game hands its moves to the game server instead of the local engine (set by the online store).
export interface RemoteControls { answer: (i: number) => void; quit: () => void; botStep: () => void; isHost: () => boolean }

interface GameStore {
  runner: Runner | RemoteRunner | null;
  me: number;                   // your seat: 0 against bots, your seat online
  online: boolean;
  remote: RemoteControls | null;
  startedAt: number;
  notice: string | null;        // shown on the setup screen (e.g. a game interrupted by an update)
  version: number;              // bumps on every change so components re-render
  speed: Speed;
  start: (name: string, players: number, pick?: HouseId | null, twoMode?: TwoPlayerMode, suddenDeath?: number) => void;
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
  me: HUMAN,
  online: false,
  remote: null,
  startedAt: 0,
  notice: null,
  version: 0,
  speed: 'normal',

  start: (name, players, pick = null, twoMode = 'race', suddenDeath = SUDDEN_DEATH_ROUND) => {
    const seed = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    // The house lottery: every seat draws blind. Playing solo you may pick your own house (rules-decisions 74);
    // the bots then draw blind from the rest.
    const picks = Array.from({ length: players }, (_, i) => (i === HUMAN ? pick : null));
    // Two players in Battle: the houses are neighbours on the board (rules-decisions 82).
    const ring = players === 2 && twoMode === 'battle'
      ? houseRing(Object.fromEntries(Object.values(CONTENT.houses).map(h => [h.id, h.home])) as Record<HouseId, Pos>)
      : undefined;
    const houses = dealHouses(Object.keys(CONTENT.houses) as HouseId[], players, picks, makeRng(seed ^ 0x9e3779b9), ring);
    const setup: GameSetup = {
      seed,
      seats: houses.map((house, i) => ({
        name: i === HUMAN && name.trim() ? name.trim() : CONTENT.houses[house].name.replace('House ', ''),
        isBot: i !== HUMAN,
        house,
      })),
      // Elodie (Lolo, Lodie) always goes first when she plays (rules-decisions 72); otherwise the first player is random.
      ...(['elodie', 'lolo', 'lodie'].includes(name.trim().toLowerCase()) ? { firstPlayer: HUMAN } : {}),
      // The Sudden Death round the table agreed (rules-decisions 93); the standard round stays implicit.
      ...(suddenDeath !== SUDDEN_DEATH_ROUND ? { config: { suddenDeathRound: suddenDeath } } : {}),
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
    set({ runner, startedAt, me: HUMAN, online: false, version: get().version + 1 });
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
      set({ runner, startedAt: s.startedAt ?? Date.now(), me: HUMAN, online: false, version: get().version + 1 });
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
    if (get().online) { get().remote?.answer(i); return; }
    if (!('answer' in r)) return;
    r.answer(i);
    if (r.over) { clear(); archive(snapshot(r, 'won', get().startedAt)); addRecord(recordOf(r, HUMAN)); } else save(r, get().startedAt);
    set({ version: get().version + 1 });
  },

  quit: () => {
    if (get().online) { get().remote?.quit(); return; }
    const r = get().runner;
    if (r && !r.over) archive(snapshot(r, 'abandoned', get().startedAt));
    clear();
    set({ runner: null, version: get().version + 1 });
  },
  dismissNotice: () => set({ notice: null }),
  setSpeed: speed => set({ speed }),
  hasSave: () => load() !== null,
}));
