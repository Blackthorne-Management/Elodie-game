// The animated intro (engine/intro.ts): who sees what, what each press does, and the title loop.

import { describe, expect, it } from 'vitest';
import { INTRO_END_S, INTRO_TITLE_LOOP_START_S } from '../src/config.ts';
import { introLoopSeek, introOpening, introPhaseAt, introPress, introStartTime } from '../src/engine/intro.ts';

describe('the intro', () => {
  it('plays in full for a new player and opens on the title for a saved game', () => {
    expect(introOpening(false)).toBe('full');
    expect(introOpening(true)).toBe('title');
    // Seen (or skipped) once on this device: the title from then on.
    expect(introOpening(false, true)).toBe('title');
    expect(introStartTime('full')).toBe(0);
    expect(introStartTime('title')).toBe(INTRO_TITLE_LOOP_START_S);
  });

  it('loops the finished title (Press A) from 87.0 s to the end at 91.0 s', () => {
    expect(INTRO_TITLE_LOOP_START_S).toBe(87);
    expect(INTRO_END_S).toBe(91);
    expect(introPhaseAt(0)).toBe('film');
    expect(introPhaseAt(86.9)).toBe('film');
    expect(introPhaseAt(87)).toBe('title');
    expect(introLoopSeek(60)).toBeNull();
    expect(introLoopSeek(90.9)).toBeNull();
    expect(introLoopSeek(90.96)).toBe(87);
    expect(introLoopSeek(88, true)).toBe(87);
  });

  it('starts on the first press, skips the story with B, and goes on from the title with A', () => {
    expect(introPress('start', 'confirm', 'full')).toEqual({ kind: 'play', from: 0 });
    expect(introPress('start', 'cancel', 'title')).toEqual({ kind: 'play', from: 87 });
    expect(introPress('film', 'confirm', 'full')).toEqual({ kind: 'none' });
    expect(introPress('film', 'cancel', 'full')).toEqual({ kind: 'seek', to: 87 });
    expect(introPress('title', 'cancel', 'full')).toEqual({ kind: 'none' });
    expect(introPress('title', 'confirm', 'full')).toEqual({ kind: 'done' });
  });
});
