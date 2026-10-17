// The rhythm locks (engine/rhythm.ts). Yucayeque's record house opens to the areíto's drum song tapped on the
// ring of carved stones (PUZZLES.md SIG-XAR part 3). The petroglyph cave shows the song but its last bar is worn
// away; the Echo of the first oath plays it whole.

import type { Mark, RhythmDef } from '../engine/rhythm.ts';

/** The song of the first oath, bar by bar. The cave wall keeps the first two bars; the third is worn away. */
export const AREITO_BARS: readonly (readonly Mark[])[] = [
  ['long', 'short', 'short', 'long'],
  ['long', 'short', 'long', 'short'],
  ['short', 'short', 'long', 'long'],
];

/** A bar as the Journal writes it: "long, short, short, long". */
export function barText(bar: readonly Mark[]): string {
  return bar.join(', ');
}

export const RHYTHMS: Readonly<Record<string, RhythmDef>> = {
  record_lock: {
    id: 'record_lock',
    song: AREITO_BARS.flat(),
    bpm: 96,
    slowBpm: 66,
    toleranceMs: 220,
    success: { 'story.lock_opened': true },
    successDialogue: 'record_lock_open',
    failDialogue: 'record_lock_fail',
  },
};
