// The secret items' three puzzle machines (docs/quest/design/SECRET-ITEMS.md 4, 7 and 8; built Oct 27). Each is driven by
// flags only, so saves need nothing new, and each is data (src/data/secrets.ts):
//
//   Measures (the Unbroken Wick, Agnipur): jars of fixed sizes and a reservoir that takes one pour and seals. A dialogue
//   asks with `measures.do` = "<id>:<from>><to>" (a jar's index, or `r` for the reservoir), "<id>:reset" (the lamp-maker
//   makes a new reservoir and the jars go back as they stood) or "<id>:look". State: `measures.<id>.<i>` per jar,
//   `measures.<id>.sealed` (what the reservoir holds once sealed), and the anchor flag when it holds the target.
//
//   Clockwork (the Patient Hour, Kingsmere): a stopped clock that reads `start` when the memory opens, a winding key with
//   gears (one turn moves the hands by a gear, forward only, and takes one second), a spring of so many turns (rewinding
//   it takes `rewindSecs`, while the clock runs on a minute a second), and a watchman who climbs the stair after
//   `watchmanAt` seconds. Waiting runs the clock a minute a second. Pull the key and wedge the quill in the escapement
//   when the hands read the target: the anchor. The real-time puzzle of the design is turn-based here (Claude's call):
//   every action counts its seconds. A dialogue asks with `clock.do` = "<id>:g<gear>|rewind|wait|pull|key|wedge|free|reset|look".
//
//   The singing floor (the Nightingale Key, Kirinoura): a square of boards, each a pitch (1 to 5), laid differently in the
//   memory and now; a board nailed in the memory is silent now (`floor.<id>.nail` = "c,r", with the anchor flag). Every
//   step on the floor sounds (GameContent.onStep), the last steps are kept in `floor.<id>.heard`, and the floor opens when
//   they are the melody, rests (0) included. Stepping off the floor starts the listening again.
//
// Pure TypeScript; tests/secretItems.test.ts plays every rule.

import type { FlagReader, FlagStore } from './flags.ts';
import type { StepAnswer } from './content.ts';

// ---- Measures ------------------------------------------------------------------------------------------------------

export interface MeasuresDef {
  id: string;
  /** Each jar's size, and what it holds when the memory opens. */
  caps: readonly number[];
  start: readonly number[];
  /** The amount the reservoir must hold. */
  target: number;
  /** Set when the reservoir is sealed holding exactly the target (the anchor). */
  anchor: string;
}

export const MEASURES_DO = 'measures.do';

export const jarFlag = (id: string, i: number): string => `measures.${id}.${i}`;
export const sealedFlag = (id: string): string => `measures.${id}.sealed`;

/** What each jar holds now. */
export function jars(def: MeasuresDef, flags: FlagReader): number[] {
  return def.caps.map((_, i) => {
    const v = flags.get(jarFlag(def.id, i));
    return typeof v === 'number' ? v : def.start[i]!;
  });
}

/** What the reservoir holds once sealed (undefined while it is empty). */
export function sealedAmount(def: MeasuresDef, flags: FlagReader): number | undefined {
  const v = flags.get(sealedFlag(def.id));
  return typeof v === 'number' ? v : undefined;
}

/** A pour on its own: from one jar into another until the first is empty or the second is full. */
export function pour(caps: readonly number[], state: readonly number[], from: number, to: number): number[] {
  const next = [...state];
  const moved = Math.min(next[from]!, caps[to]! - next[to]!);
  next[from]! -= moved;
  next[to]! += moved;
  return next;
}

export type MeasuresResult = 'poured' | 'sealed' | 'reset' | 'refused' | 'look';

/** Answer one request (a pour, the reservoir, a fresh reservoir). */
export function measure(def: MeasuresDef, flags: FlagStore, request: string): MeasuresResult {
  const state = jars(def, flags);
  const write = (s: readonly number[]) => s.forEach((n, i) => flags.set(jarFlag(def.id, i), n));
  if (request === 'look') {
    write(state);
    return 'look';
  }
  if (request === 'reset') {
    write(def.start);
    flags.clear(sealedFlag(def.id));
    flags.set(def.anchor, false);
    return 'reset';
  }
  const m = /^(\d+)>(\d+|r)$/.exec(request);
  if (!m) return 'refused';
  const from = Number(m[1]);
  if (from >= def.caps.length || state[from] === 0) return 'refused';
  if (m[2] === 'r') {
    if (sealedAmount(def, flags) !== undefined) return 'refused';
    flags.set(sealedFlag(def.id), state[from]!);
    flags.set(def.anchor, state[from] === def.target);
    write(state.map((n, i) => (i === from ? 0 : n)));
    return 'sealed';
  }
  const to = Number(m[2]);
  if (to >= def.caps.length || to === from || state[to] === def.caps[to]) return 'refused';
  write(pour(def.caps, state, from, to));
  return 'poured';
}

// ---- Clockwork -----------------------------------------------------------------------------------------------------

export interface ClockDef {
  id: string;
  /** What the hands read when the memory opens, and the hour to stop them on, as minutes past twelve (12-hour dial). */
  start: number;
  target: number;
  /** The key's gears: minutes one turn moves the hands. */
  gears: readonly number[];
  /** Turns the spring allows before it must be rewound, and the seconds a rewind takes. */
  spring: number;
  rewindSecs: number;
  /** Seconds before the watchman climbs the stair (caught: back to the stairs, the clock as it was). */
  watchmanAt: number;
  /** Set when the quill is wedged on the target's tick (the anchor). */
  anchor: string;
}

export const CLOCK_DO = 'clock.do';

export interface ClockState {
  /** Minutes the hands have moved since the memory opened. */
  moved: number;
  /** Seconds gone. */
  secs: number;
  /** Turns left in the spring. */
  spring: number;
  /** The key is in the winding hole. */
  keyIn: boolean;
  /** The quill is in the escapement, on the wrong minute (the clock stands until it is pulled). */
  jammed: boolean;
}

const cf = (id: string, k: string): string => `clock.${id}.${k}`;

export function clockState(def: ClockDef, flags: FlagReader): ClockState {
  const num = (k: string, d: number) => {
    const v = flags.get(cf(def.id, k));
    return typeof v === 'number' ? v : d;
  };
  const out = flags.get(cf(def.id, 'key_out'));
  return { moved: num('moved', 0), secs: num('secs', 0), spring: num('spring', def.spring), keyIn: !out, jammed: !!flags.get(cf(def.id, 'jammed')) };
}

/** The hands as "h:mm" on a twelve-hour face. */
export function clockFace(minutes: number): string {
  const m = ((minutes % 720) + 720) % 720;
  const h = Math.floor(m / 60);
  return `${h === 0 ? 12 : h}:${String(m % 60).padStart(2, '0')}`;
}

/** The minutes the hands must still move to read the target (forward only, round the face). */
export function clockDistance(def: ClockDef): number {
  return (((def.target - def.start) % 720) + 720) % 720;
}

export type ClockResult = 'look' | 'turned' | 'spent' | 'rewound' | 'waited' | 'pulled' | 'keyed' | 'stopped' | 'jammed' | 'freed' | 'caught' | 'reset' | 'refused';

function writeClock(def: ClockDef, flags: FlagStore, s: ClockState): void {
  flags.set(cf(def.id, 'moved'), s.moved);
  flags.set(cf(def.id, 'secs'), s.secs);
  flags.set(cf(def.id, 'spring'), s.spring);
  flags.set(cf(def.id, 'key_out'), !s.keyIn);
  flags.set(cf(def.id, 'jammed'), s.jammed);
  // What the lines show: the face, the seconds before the watchman, the turns left.
  flags.set(cf(def.id, 'face'), clockFace(def.start + s.moved));
  flags.set(cf(def.id, 'left'), Math.max(0, def.watchmanAt - s.secs));
}

const fresh = (def: ClockDef): ClockState => ({ moved: 0, secs: 0, spring: def.spring, keyIn: true, jammed: false });

/** Answer one request at the clock (a turn, a rewind, a second's wait, the key, the quill). */
export function windClock(def: ClockDef, flags: FlagStore, request: string): ClockResult {
  const s = clockState(def, flags);
  // A look writes what the lines show (the face, the seconds left), and changes nothing.
  if (request === 'look') {
    writeClock(def, flags, s);
    return 'look';
  }
  if (flags.isSet(def.anchor)) return 'refused';
  flags.set(cf(def.id, 'caught'), false);
  let result: ClockResult;
  const gear = /^g(\d+)$/.exec(request);
  if (request === 'reset') {
    writeClock(def, flags, fresh(def));
    return 'reset';
  } else if (gear) {
    const n = Number(gear[1]);
    if (!def.gears.includes(n) || !s.keyIn || s.jammed) return 'refused';
    if (s.spring <= 0) return 'spent';
    s.moved += n;
    s.secs += 1;
    s.spring -= 1;
    result = 'turned';
  } else if (request === 'rewind') {
    if (!s.keyIn || s.jammed) return 'refused';
    s.spring = def.spring;
    s.secs += def.rewindSecs;
    s.moved += def.rewindSecs;
    result = 'rewound';
  } else if (request === 'wait') {
    s.secs += 1;
    if (!s.jammed) s.moved += 1;
    result = 'waited';
  } else if (request === 'pull') {
    if (!s.keyIn) return 'refused';
    s.keyIn = false;
    result = 'pulled';
  } else if (request === 'key') {
    if (s.keyIn || s.jammed) return 'refused';
    s.keyIn = true;
    s.secs += 1;
    s.moved += 1;
    result = 'keyed';
  } else if (request === 'wedge') {
    if (s.keyIn || s.jammed) return 'refused';
    if ((def.start + s.moved - def.target) % 720 === 0) {
      writeClock(def, flags, s);
      flags.set(def.anchor, true);
      return 'stopped';
    }
    s.jammed = true;
    result = 'jammed';
  } else if (request === 'free') {
    if (!s.jammed) return 'refused';
    s.jammed = false;
    s.secs += 1;
    result = 'freed';
  } else return 'refused';
  if (s.secs >= def.watchmanAt) {
    writeClock(def, flags, fresh(def));
    flags.set(cf(def.id, 'caught'), true);
    return 'caught';
  }
  writeClock(def, flags, s);
  return result;
}

// ---- The singing floor ---------------------------------------------------------------------------------------------

export interface FloorDef {
  id: string;
  map: string;
  /** The floor's top-left tile on the map. */
  origin: { x: number; y: number };
  /** Pitches by row (north first), 1 low to 5 high: as laid now, and fifty years ago (0: a board that does not sing). */
  present: readonly (readonly number[])[];
  echo: readonly (readonly number[])[];
  /** The message: pitches in order, 0 for the rest. */
  melody: readonly number[];
  /** Set when the melody has been walked now (the box opens). */
  open: string;
  /** The anchor flag set with the nail (`floor.<id>.nail` says where). */
  anchor: string;
}

export const nailFlag = (id: string): string => `floor.${id}.nail`;
export const heardFlag = (id: string): string => `floor.${id}.heard`;

/** The board under a tile, if the tile is on the floor. */
export function boardAt(def: FloorDef, pos: { x: number; y: number }): { c: number; r: number } | undefined {
  const c = pos.x - def.origin.x;
  const r = pos.y - def.origin.y;
  if (r < 0 || r >= def.present.length || c < 0 || c >= def.present[0]!.length) return undefined;
  return { c, r };
}

/** The nailed board ("c,r"), if any. */
export function nailed(def: FloorDef, flags: FlagReader): { c: number; r: number } | undefined {
  const v = flags.get(nailFlag(def.id));
  const m = typeof v === 'string' ? /^(\d+),(\d+)$/.exec(v) : null;
  return m && flags.get(def.anchor) === true ? { c: Number(m[1]), r: Number(m[2]) } : undefined;
}

/** What a board sings in an era (a nailed board is silent now). */
export function pitchAt(def: FloorDef, flags: FlagReader, era: 'present' | 'echo', b: { c: number; r: number }): number {
  if (era === 'echo') return def.echo[b.r]![b.c]!;
  const nail = nailed(def, flags);
  if (nail && nail.c === b.c && nail.r === b.r) return 0;
  return def.present[b.r]![b.c]!;
}

/** A step on the floor's map: the board's note, the listening kept, and the floor opened when the melody is walked. */
export function stepFloor(def: FloorDef, flags: FlagStore, era: 'present' | 'echo', pos: { x: number; y: number }): StepAnswer | undefined {
  const b = boardAt(def, pos);
  if (!b) {
    if (flags.get(heardFlag(def.id))) flags.set(heardFlag(def.id), '');
    return undefined;
  }
  const note = pitchAt(def, flags, era, b);
  if (era === 'echo' || flags.isSet(def.open)) return { note };
  const prev = flags.get(heardFlag(def.id));
  const heard = `${typeof prev === 'string' ? prev : ''}${note}`.slice(-def.melody.length);
  flags.set(heardFlag(def.id), heard);
  if (heard === def.melody.join('')) {
    flags.set(def.open, true);
    return { note, sync: true, toast: 'Under the floor, something answers: a catch, clicking open.' };
  }
  return { note };
}

/** The tiles of a walk that plays the melody now, nail included, found by search (tests and the hint use it). */
export function melodyWalks(def: FloorDef, pitch: (c: number, r: number) => number, limit = 50): { c: number; r: number }[][] {
  const rows = def.present.length;
  const cols = def.present[0]!.length;
  const out: { c: number; r: number }[][] = [];
  const walk = (path: { c: number; r: number }[]) => {
    if (out.length >= limit) return;
    if (path.length === def.melody.length) {
      out.push(path);
      return;
    }
    const last = path[path.length - 1]!;
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const c = last.c + dc;
        const r = last.r + dr;
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        if (pitch(c, r) === def.melody[path.length]) walk([...path, { c, r }]);
      }
  };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (pitch(c, r) === def.melody[0]) walk([{ c, r }]);
  return out;
}
