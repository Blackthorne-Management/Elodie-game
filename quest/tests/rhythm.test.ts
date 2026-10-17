import { describe, expect, it } from 'vitest';
import { COUNT_IN_BEATS, judge, msPerBeat, onsets, songLengthMs } from '../src/engine/rhythm.ts';

describe('the rhythm lock (SIG-XAR part 3)', () => {
  const song = ['long', 'short', 'short', 'long'] as const;

  it('a short mark is one beat and a long one two, after a count-in', () => {
    const beat = msPerBeat(60);
    expect(beat).toBe(1000);
    expect(onsets(song, 60)).toEqual([4000, 6000, 7000, 8000].map((t) => t + (COUNT_IN_BEATS - 4) * 1000));
    expect(songLengthMs(song, 60)).toBe((COUNT_IN_BEATS + 6 + 1) * 1000);
  });

  it('every mark tapped in time, and nothing else, opens it', () => {
    const due = onsets(song, 60);
    expect(judge(due, due, 200).ok).toBe(true);
    expect(judge(due.map((t) => t + 150), due, 200).ok).toBe(true);
  });

  it('a late tap, a missed mark or a stray tap does not', () => {
    const due = onsets(song, 60);
    expect(judge(due.map((t, i) => (i === 2 ? t + 400 : t)), due, 200)).toMatchObject({ ok: false, missed: 1, extra: 1 });
    expect(judge(due.slice(0, 3), due, 200)).toMatchObject({ ok: false, missed: 1 });
    expect(judge([...due, 500], due, 200)).toMatchObject({ ok: false, extra: 1 });
  });

  it('tapping every beat blindly does not play a song of long and short marks', () => {
    const due = onsets(song, 60);
    const everyBeat = Array.from({ length: 12 }, (_, i) => i * 1000);
    expect(judge(everyBeat, due, 200).ok).toBe(false);
  });
});
