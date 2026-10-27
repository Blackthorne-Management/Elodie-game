// The rhythm lock (PUZZLES.md SIG-XAR part 3): tap the areíto's drum song on the ring of carved stones.
// A song is long and short marks; a short mark lasts one beat, a long one two. The player taps A (or the
// screen) at the start of each mark, with markers on screen to follow, at the normal tempo or a slower one
// (accessibility). This decides when the taps are due and whether a run of taps played the song. Pure
// TypeScript, tested in tests/rhythm.test.ts; ui/RhythmPanel.ts draws it.

export type Mark = 'long' | 'short';

export interface RhythmDef {
  id: string;
  /** The whole song, as the drummers play it at the areíto. */
  song: readonly Mark[];
  /** Beats per minute, normal and slow. */
  bpm: number;
  slowBpm: number;
  /** How far a tap may be from its beat and still count (ms). */
  toleranceMs: number;
  /** What the panel calls it, and its marks (default: "The drum song", "drum"), and the tap's sound (default: the drum). */
  title?: string;
  noun?: string;
  sound?: string;
  /** Flags set when it is played right, and the scenes that follow either way. */
  success: Readonly<Record<string, boolean>>;
  successDialogue: string;
  failDialogue: string;
}

/** Beats of count-in before the first mark. */
export const COUNT_IN_BEATS = 4;

export function msPerBeat(bpm: number): number {
  return 60000 / bpm;
}

/** When each mark's tap is due, in ms from the start (after the count-in). */
export function onsets(song: readonly Mark[], bpm: number): number[] {
  const beat = msPerBeat(bpm);
  const out: number[] = [];
  let t = COUNT_IN_BEATS * beat;
  for (const m of song) {
    out.push(Math.round(t));
    t += m === 'long' ? 2 * beat : beat;
  }
  return out;
}

/** How long the whole run lasts: the count-in, the song, and one beat after it. */
export function songLengthMs(song: readonly Mark[], bpm: number): number {
  const beats = COUNT_IN_BEATS + song.reduce((n, m) => n + (m === 'long' ? 2 : 1), 0) + 1;
  return Math.round(beats * msPerBeat(bpm));
}

export interface RhythmResult {
  ok: boolean;
  /** Marks hit in time, marks missed, and taps that matched no mark. */
  hits: number;
  missed: number;
  extra: number;
}

/**
 * Whether the taps (ms from the start) played the song: every mark tapped once within the tolerance and no
 * stray taps. Each tap counts for the nearest unclaimed mark in reach.
 */
export function judge(taps: readonly number[], due: readonly number[], toleranceMs: number): RhythmResult {
  const claimed = new Set<number>();
  let extra = 0;
  for (const tap of taps) {
    let best = -1;
    for (let i = 0; i < due.length; i++) {
      if (claimed.has(i) || Math.abs(tap - due[i]!) > toleranceMs) continue;
      if (best < 0 || Math.abs(tap - due[i]!) < Math.abs(tap - due[best]!)) best = i;
    }
    if (best < 0) extra++;
    else claimed.add(best);
  }
  const hits = claimed.size;
  return { ok: hits === due.length && extra === 0, hits, missed: due.length - hits, extra };
}
