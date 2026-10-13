// The one global flag store. Story progress, NPC memory and (later) pillars and puzzle state all live
// here as named values, so dialogue conditions and saves only ever need to read one place.

import type { FlagValue } from './types.ts';

export type FlagSnapshot = Record<string, FlagValue>;
export type FlagListener = (name: string, value: FlagValue | undefined) => void;

export class FlagStore {
  private values = new Map<string, FlagValue>();
  private listeners = new Set<FlagListener>();

  constructor(initial?: FlagSnapshot) {
    if (initial) this.load(initial);
  }

  get(name: string): FlagValue | undefined {
    return this.values.get(name);
  }

  has(name: string): boolean {
    return this.values.has(name);
  }

  /** Booleans are themselves; numbers are truthy when non-zero; strings when non-empty. */
  isSet(name: string): boolean {
    const v = this.values.get(name);
    return v !== undefined && v !== false && v !== 0 && v !== '';
  }

  getNumber(name: string): number {
    const v = this.values.get(name);
    return typeof v === 'number' ? v : 0;
  }

  set(name: string, value: FlagValue): void {
    if (!name) throw new Error('Flag name must not be empty');
    if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`Flag ${name} must be a finite number`);
    if (this.values.get(name) === value) return;
    this.values.set(name, value);
    this.emit(name, value);
  }

  /** Add to a numeric flag (missing counts as 0). Returns the new value. */
  add(name: string, amount: number): number {
    const next = this.getNumber(name) + amount;
    this.set(name, next);
    return next;
  }

  clear(name: string): void {
    if (!this.values.delete(name)) return;
    this.emit(name, undefined);
  }

  /** Apply several assignments at once (dialogue `set` blocks use this). */
  apply(changes: FlagSnapshot): void {
    for (const [name, value] of Object.entries(changes)) this.set(name, value);
  }

  snapshot(): FlagSnapshot {
    const out: FlagSnapshot = {};
    for (const name of [...this.values.keys()].sort()) out[name] = this.values.get(name)!;
    return out;
  }

  /** Replace every flag with the snapshot (used by load and new game). */
  load(snapshot: FlagSnapshot): void {
    const old = [...this.values.keys()];
    this.values.clear();
    for (const name of old) if (!(name in snapshot)) this.emit(name, undefined);
    for (const [name, value] of Object.entries(snapshot)) {
      this.values.set(name, value);
      this.emit(name, value);
    }
  }

  subscribe(listener: FlagListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(name: string, value: FlagValue | undefined): void {
    for (const l of this.listeners) l(name, value);
  }
}

/** Read-only view used by condition evaluation. */
export interface FlagReader {
  get(name: string): FlagValue | undefined;
}
