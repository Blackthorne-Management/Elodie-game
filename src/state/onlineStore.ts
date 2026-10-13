// Online games: hosting, joining, the lobby and staying in sync. The game itself is drawn by the normal play screen:
// each new view from the server becomes a RemoteRunner in the game store.
import { create } from 'zustand';
import { call, listen } from '../net/client';
import { RemoteRunner } from '../net/remote';
import type { GameView, LobbyView, Response } from '../net/protocol';
import type { HouseId } from '../engine/types';
import type { TwoPlayerMode } from '../engine/houseChoice';
import { useGame } from './gameStore';
import { addRecord, recordOf } from './stats';

const KEY = 'bl-online';
interface Saved { code: string; token: string; me: number }
const saved = (): Saved | null => { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const store = (s: Saved | null) => { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch { /* ignore */ } };

interface OnlineStore {
  code: string | null;
  token: string | null;
  me: number;
  lobby: LobbyView | null;
  error: string | null;
  busy: boolean;
  host: (name: string, total: number, humans: number, mode?: TwoPlayerMode) => Promise<void>;
  join: (code: string, name: string) => Promise<void>;
  resume: () => boolean;
  refresh: () => Promise<void>;
  vote: (pick: boolean) => Promise<void>;
  start: () => Promise<void>;
  pick: (house: HouseId) => Promise<void>;
  answer: (i: number) => Promise<void>;
  botStep: () => Promise<void>;
  leave: () => Promise<void>;
  exit: () => void;              // back to the menu; your seat stays yours and you can return
  clearError: () => void;
}

let stopListening: (() => void) | null = null;
let poll: ReturnType<typeof setInterval> | null = null;
let lastAnswers = -1;
let lastVersion = -1;

function watch(code: string) {
  stopListening?.();
  if (poll) clearInterval(poll);
  stopListening = listen(code, () => void useOnline.getState().refresh());
  poll = setInterval(() => void useOnline.getState().refresh(), 4000);
}
function unwatch() {
  stopListening?.(); stopListening = null;
  if (poll) clearInterval(poll); poll = null;
  lastAnswers = -1; lastVersion = -1;
}

// Show a game view on the play screen (only when something changed).
function showGame(view: GameView, code: string) {
  if (view.answers === lastAnswers && view.lobby.version === lastVersion) return;
  lastAnswers = view.answers;
  lastVersion = view.lobby.version;
  const runner = new RemoteRunner(view);
  const g = useGame.getState();
  useGame.setState({ runner, me: view.lobby.me, online: true, version: g.version + 1, startedAt: g.online ? g.startedAt : Date.now() });
  if (view.over) {
    const k = `bl-recorded-${code}`;
    try { if (!localStorage.getItem(k)) { localStorage.setItem(k, '1'); addRecord(recordOf(runner, view.lobby.me)); } } catch { /* ignore */ }
  }
}

export const useOnline = create<OnlineStore>((set, get) => {
  // Apply a server reply: lobby, game, or an error.
  const apply = (r: Response) => {
    if (!r.ok) { set({ error: r.error, busy: false }); return false; }
    const code = r.code ?? get().code;
    if (r.lobby) set({ lobby: r.lobby, me: r.lobby.me });
    if (r.game && code) showGame(r.game, code);
    set({ busy: false, error: null });
    return true;
  };

  return {
    code: null, token: null, me: 0, lobby: null, error: null, busy: false,

    host: async (name, total, humans, mode = 'race') => {
      set({ busy: true, error: null });
      const r = await call({ op: 'create', name, total, humans, mode });
      if (r.ok && r.code && r.token) {
        set({ code: r.code, token: r.token, me: 0 });
        store({ code: r.code, token: r.token, me: 0 });
        watch(r.code);
      }
      apply(r);
    },

    join: async (code, name) => {
      set({ busy: true, error: null });
      const r = await call({ op: 'join', code, name });
      if (r.ok && r.code && r.token) {
        set({ code: r.code, token: r.token, me: r.seat ?? 0 });
        store({ code: r.code, token: r.token, me: r.seat ?? 0 });
        watch(r.code);
      }
      apply(r);
    },

    resume: () => {
      const s = saved();
      if (!s) return false;
      set({ code: s.code, token: s.token, me: s.me });
      watch(s.code);
      void get().refresh();
      return true;
    },

    refresh: async () => {
      const { code, token } = get();
      if (!code || !token) return;
      const r = await call({ op: 'view', code, token });
      if (!r.ok && /not in this game|No game/.test(r.error)) { get().exit(); store(null); set({ error: r.error }); return; }
      if (r.ok && r.lobby?.status === 'ended' && !r.game) { get().exit(); store(null); set({ error: 'The host closed the game.' }); return; }
      apply(r);
    },

    vote: async pick => {
      const { code, token, lobby, me } = get();
      if (!code || !token) return;
      // Show the tick straight away; the server's reply confirms it.
      if (lobby) set({ lobby: { ...lobby, seats: lobby.seats.map(x => (x.seat === me ? { ...x, vote: pick } : x)) } });
      apply(await call({ op: 'vote', code, token, pick }));
    },
    start: async () => {
      const { code, token } = get();
      if (!code || !token) return;
      set({ busy: true });
      apply(await call({ op: 'start', code, token }));
    },
    pick: async house => {
      const { code, token } = get();
      if (!code || !token) return;
      set({ busy: true });
      apply(await call({ op: 'pick', code, token, house }));
    },
    answer: async i => {
      const { code, token } = get();
      const at = useGame.getState().runner?.answers.length ?? 0;
      if (!code || !token) return;
      const r = await call({ op: 'answer', code, token, index: i, at });
      if (!r.ok && /moved on/.test(r.error)) { await get().refresh(); return; }
      apply(r);
    },
    botStep: async () => {
      const { code, token } = get();
      const at = useGame.getState().runner?.answers.length ?? 0;
      if (!code || !token) return;
      const r = await call({ op: 'bot', code, token, at });
      if (!r.ok) { await get().refresh(); return; }          // someone else moved it first
      apply(r);
    },

    leave: async () => {
      const { code, token, lobby } = get();
      if (code && token && lobby && lobby.status === 'lobby') await call({ op: 'leave', code, token });
      store(null);
      get().exit();
    },

    exit: () => {
      unwatch();
      set({ code: null, token: null, lobby: null, busy: false });
      const g = useGame.getState();
      if (g.online) useGame.setState({ runner: null, online: false, me: 0, version: g.version + 1 });
    },

    clearError: () => set({ error: null }),
  };
});

// The saved online game, if any (to offer "Return to your game").
export const savedOnline = saved;

// Hand online moves to the server.
useGame.setState({
  remote: {
    answer: i => void useOnline.getState().answer(i),
    botStep: () => void useOnline.getState().botStep(),
    // Leaving a finished game forgets it; leaving one in progress keeps your seat to come back to.
    quit: () => { if (useGame.getState().runner?.over) void useOnline.getState().leave(); else useOnline.getState().exit(); },
    isHost: () => !!useOnline.getState().lobby?.host,
  },
});
