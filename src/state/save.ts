import type { SaveState } from '../engine/types';

const KEY = 'eks-save';
export const CURRENT_VERSION = 1;

export function saveGame(s: SaveState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage full or blocked */ }
}

export function loadGame(): SaveState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function exportCode(s: SaveState): string {
  const bytes = new TextEncoder().encode(JSON.stringify(s));
  let bin = '';
  bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

export function importCode(code: string): SaveState {
  const bin = atob(code.trim());
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const s = migrate(JSON.parse(new TextDecoder().decode(bytes)));
  if (typeof s?.version !== 'number' || !Array.isArray(s.pets)) throw new Error('Not a save code');
  return s;
}

// When SaveState changes, bump CURRENT_VERSION and upgrade old saves here.
function migrate(s: SaveState): SaveState {
  return s;
}

// Ask the browser not to clear the save when space runs low.
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {});
}
