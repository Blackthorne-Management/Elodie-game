// The secret items' puzzle machines as the game runs them (engine/secrets.ts; docs/quest/design/SECRET-ITEMS.md 4, 7
// and 8): the jars in Agnipur's oil store, the Kingsmere tower clock and Lady Sayo's singing floor. A conversation asks
// with a request flag (`measures.do`, `clock.do`), answered the moment it is set (GameContent.react), and the result is
// left in `<machine>.<id>.said` for the next line to read; the floor answers every step on its map (GameContent.onStep).

import type { StepAnswer } from '../engine/content.ts';
import type { FlagStore } from '../engine/flags.ts';
import { CLOCK_DO, MEASURES_DO, heardFlag, jarFlag, measure, sealedFlag, stepFloor, windClock, type ClockDef, type FloorDef, type MeasuresDef } from '../engine/secrets.ts';
import { TOWER_CLOCK } from './aldermoor.ts';
import { WICK_MEASURES } from './jwaladesh.ts';
import { NIGHTINGALE } from './kuroshi.ts';

export const MEASURES: readonly MeasuresDef[] = [WICK_MEASURES];
export const CLOCKS: readonly ClockDef[] = [TOWER_CLOCK];
export const FLOORS: readonly FloorDef[] = [NIGHTINGALE];

/** What the last request at a machine came to (`measures.<id>.said`, `clock.<id>.said`), for the lines that follow. */
export const saidFlag = (machine: 'measures' | 'clock', id: string): string => `${machine}.${id}.said`;

/** Answer the requests a conversation has just set (and clear them). */
export function reactSecrets(flags: FlagStore): void {
  for (const [name, run] of [
    [MEASURES_DO, (id: string, req: string) => {
      const def = MEASURES.find((m) => m.id === id);
      if (def) flags.set(saidFlag('measures', id), measure(def, flags, req));
    }],
    [CLOCK_DO, (id: string, req: string) => {
      const def = CLOCKS.find((c) => c.id === id);
      if (def) flags.set(saidFlag('clock', id), windClock(def, flags, req));
    }],
  ] as const) {
    const v = flags.get(name);
    if (typeof v !== 'string' || !v) continue;
    flags.clear(name);
    const [id, req] = v.split(':');
    if (id && req) run(id, req);
  }
}

/** Every flag the machines write from code (the content checks count them as set). */
export function secretFlagsWritten(): string[] {
  const out: string[] = [];
  for (const m of MEASURES) out.push(...m.caps.map((_, i) => jarFlag(m.id, i)), sealedFlag(m.id), m.anchor, saidFlag('measures', m.id));
  for (const c of CLOCKS) out.push(...['moved', 'secs', 'spring', 'key_out', 'jammed', 'face', 'left', 'caught'].map((k) => `clock.${c.id}.${k}`), c.anchor, saidFlag('clock', c.id));
  for (const fl of FLOORS) out.push(fl.open, heardFlag(fl.id));
  return out;
}

/** A step on a map with a singing floor. */
export function stepSecrets(step: { mapId: string; era: 'present' | 'echo'; pos: { x: number; y: number } }, flags: FlagStore): StepAnswer | undefined {
  const floor = FLOORS.find((f) => f.map === step.mapId);
  return floor ? stepFloor(floor, flags, step.era, step.pos) : undefined;
}

/**
 * The Nightingale Key on the maps (SECRET-ITEMS.md 8): the Quiet Crown's own people show a faint silver sigil, by their
 * look (the hooded recruiters, the hierarchs, the Hushers and the veils, the Almoner). The design's hidden conversation
 * per capital is not built (Claude's call, Oct 27; docs/quest/design/SECRET-ITEMS.md 8).
 */
export const QUIET_CROWN_LOOKS: readonly string[] = ['quiet_crown_', 'qc_', 'husher', 'almswoman', 'almoner', 'quiet_speaker'];
export const quietCrownLook = (look: string): boolean => QUIET_CROWN_LOOKS.some((p) => look.startsWith(p));
/** The ripple each pitch draws on the floor, with its colour (the puzzle works with the sound off). */
export const PITCH_RIPPLES: readonly { shape: 'none' | 'circle' | 'square' | 'triangle' | 'diamond' | 'star'; colour: number }[] = [
  { shape: 'none', colour: 0x8a8690 },
  { shape: 'circle', colour: 0x6ab0f0 },
  { shape: 'square', colour: 0x7ad08a },
  { shape: 'triangle', colour: 0xf2d04b },
  { shape: 'diamond', colour: 0xf0a050 },
  { shape: 'star', colour: 0xffffff },
];
