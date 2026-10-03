import { create } from 'zustand';
import type { Battle } from '../engine/battle';
import type { Rng } from '../engine/rng';
import type { SaveState } from '../engine/types';
import { makeRng } from '../engine/rng';
import { applyWin } from '../engine/rewards';
import { floorInfo } from '../engine/floors';
import { loadGame, saveGame } from './save';
import { newGame } from './newGame';
import { buildFloor } from './buildFloor';

export type Screen = 'home' | 'team' | 'settings' | 'battle';

interface Fight { id: number; floor: number; battle: Battle; rng: Rng }

interface GameStore {
  save: SaveState;
  screen: Screen;
  fight: Fight | null;
  toast: string | null;
  update: (fn: (s: SaveState) => SaveState) => void;
  go: (screen: Screen) => void;
  startFloor: (floor: number) => void;
  finishFight: (winner: 'player' | 'enemy') => void;
  dismissToast: () => void;
}

export const useGame = create<GameStore>((set, get) => ({
  save: loadGame() ?? newGame(),
  screen: 'home',
  fight: null,
  toast: null,

  update: fn => set(state => {
    const save = fn(state.save);
    saveGame(save);
    return { save };
  }),

  go: screen => set({ screen }),

  startFloor: floor => {
    const seed = (Date.now() ^ (floor * 2654435761)) >>> 0;
    const rng = makeRng(seed);
    set({ screen: 'battle', fight: { id: seed, floor, battle: buildFloor(get().save, floor, rng), rng } });
  },

  finishFight: winner => {
    const fight = get().fight;
    if (!fight) return;
    if (winner === 'enemy') {
      set({ screen: 'home', fight: null, toast: `Floor ${fight.floor} was too stormy. Level up and try again!` });
      return;
    }
    const { save, summary } = applyWin(get().save, fight.floor);
    saveGame(save);
    const parts = [`+${summary.sparks} Sparks`];
    if (summary.crystals) parts.push(`+${summary.crystals} Storm Crystal`);
    const what = floorInfo(fight.floor).kind === 'regionBoss' ? 'Region boss defeated!' : `Floor ${fight.floor} cleared!`;
    set({ save, screen: 'home', fight: null, toast: `${what} ${parts.join(', ')}` });
  },

  dismissToast: () => set({ toast: null }),
}));
