// The single save module (guide Sections 3 and 9). Every save goes through here so it can later be
// swapped for cloud saves. A save is stored and exported as the same compact "save code":
//
//   BQ<version>.<base64url payload>.<checksum>
//
// The payload is a JSON array (short, order-fixed fields); the checksum is FNV-1a over the payload
// text, so a mistyped or truncated code is rejected instead of loading a broken game.

import { SAVE_CODE_PREFIX, SAVE_VERSION, TEXT_SPEED_ORDER, type TextSpeed } from '../config.ts';
import type { FlagSnapshot } from './flags.ts';
import { DIRS, ERAS, type Dir, type Era, type FlagValue } from './types.ts';

export interface SaveSettings {
  textSpeed: TextSpeed;
  /** Anissa's hints (guide 6.2): on unless the player turns them off. Added in save version 2. */
  hints: boolean;
}

export interface SaveData {
  version: number;
  mapId: string;
  x: number;
  y: number;
  facing: Dir;
  era: Era;
  flags: FlagSnapshot;
  settings: SaveSettings;
  /** Milliseconds since the epoch, supplied by the caller. */
  savedAt: number;
}

export type DecodeResult = { ok: true; data: SaveData } | { ok: false; error: string };

/** Minimal storage surface (window.localStorage fits it; tests pass a Map-backed fake). */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** 32-bit FNV-1a, as 8 hex digits. */
export function checksum(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function encodeSave(data: SaveData): string {
  const payload = JSON.stringify([
    SAVE_VERSION,
    data.mapId,
    data.x,
    data.y,
    DIRS.indexOf(data.facing),
    ERAS.indexOf(data.era),
    data.flags,
    TEXT_SPEED_ORDER.indexOf(data.settings.textSpeed),
    Math.round(data.savedAt),
    data.settings.hints ? 1 : 0,
  ]);
  const body = toBase64Url(payload);
  return `${SAVE_CODE_PREFIX}${SAVE_VERSION}.${body}.${checksum(body)}`;
}

const fail = (error: string): DecodeResult => ({ ok: false, error });

function isFlagValue(v: unknown): v is FlagValue {
  return typeof v === 'boolean' || typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v));
}

function isInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v);
}

export function decodeSave(code: string): DecodeResult {
  const trimmed = code.replace(/\s+/g, '');
  const parts = trimmed.split('.');
  if (parts.length !== 3) return fail('That is not a save code.');
  const [head, body, sum] = parts as [string, string, string];
  if (!head.startsWith(SAVE_CODE_PREFIX)) return fail('That is not a save code.');
  const version = Number(head.slice(SAVE_CODE_PREFIX.length));
  if (!Number.isInteger(version) || version < 1) return fail('That save code has no version.');
  if (version > SAVE_VERSION) return fail('That save code was made by a newer version of the game.');
  if (checksum(body) !== sum.toLowerCase()) return fail('That save code is damaged (checksum mismatch).');

  let arr: unknown;
  try {
    arr = JSON.parse(fromBase64Url(body));
  } catch {
    return fail('That save code is damaged (unreadable).');
  }
  // Version 1 had 9 fields; version 2 adds the hints setting.
  const fields = version === 1 ? 9 : 10;
  if (!Array.isArray(arr) || arr.length !== fields) return fail('That save code is damaged (wrong shape).');
  const [v, mapId, x, y, facingIdx, eraIdx, flags, speedIdx, savedAt, hintsBit = 1] = arr as unknown[];
  if (v !== version) return fail('That save code is damaged (version mismatch).');
  if (typeof mapId !== 'string' || mapId.length === 0) return fail('That save code is damaged (map).');
  if (!isInt(x) || !isInt(y) || x < 0 || y < 0) return fail('That save code is damaged (position).');
  if (!isInt(facingIdx) || !DIRS[facingIdx]) return fail('That save code is damaged (facing).');
  if (!isInt(eraIdx) || !ERAS[eraIdx]) return fail('That save code is damaged (era).');
  if (typeof flags !== 'object' || flags === null || Array.isArray(flags)) return fail('That save code is damaged (flags).');
  const flagEntries = Object.entries(flags as Record<string, unknown>);
  if (!flagEntries.every(([, fv]) => isFlagValue(fv))) return fail('That save code is damaged (flag values).');
  if (!isInt(speedIdx) || !TEXT_SPEED_ORDER[speedIdx]) return fail('That save code is damaged (settings).');
  if (!isInt(savedAt)) return fail('That save code is damaged (time).');
  if (hintsBit !== 0 && hintsBit !== 1) return fail('That save code is damaged (settings).');

  return {
    ok: true,
    data: {
      version: SAVE_VERSION,
      mapId,
      x,
      y,
      facing: DIRS[facingIdx]!,
      era: ERAS[eraIdx]!,
      flags: Object.fromEntries(flagEntries) as FlagSnapshot,
      settings: { textSpeed: TEXT_SPEED_ORDER[speedIdx]!, hints: hintsBit === 1 },
      savedAt,
    },
  };
}

/** Write a save. Returns false when storage is unavailable or full (private mode, blocked site data). */
export function writeSave(storage: StorageLike | undefined, key: string, data: SaveData): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, encodeSave(data));
    return true;
  } catch {
    return false;
  }
}

/** Read the stored save: null when there is none (or storage is unavailable), else the decode result. */
export function readSave(storage: StorageLike | undefined, key: string): DecodeResult | null {
  if (!storage) return null;
  let code: string | null;
  try {
    code = storage.getItem(key);
  } catch {
    return null;
  }
  return code === null ? null : decodeSave(code);
}

export function deleteSave(storage: StorageLike | undefined, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // Storage blocked: nothing to delete.
  }
}
