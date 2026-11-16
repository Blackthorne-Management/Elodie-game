// Which sound each game event makes and which music fits the moment (src/audio/plan.ts).
import { describe, expect, it } from 'vitest';
import { musicFor, sfxFor, STAKES_ROUND } from '../src/audio/plan';
import type { LogEvent } from '../src/engine/types';
import { randomGame } from './helpers';

const ev = (kind: string, text = '', extra: Partial<LogEvent> = {}): LogEvent => ({ seq: 1, round: 1, text, kind, ...extra });

describe('sound effects', () => {
  it('match the event', () => {
    expect(sfxFor(ev('roll', 'P0 rolls a 4.'), 0, 16)).toBe('dice');
    expect(sfxFor(ev('gain', 'P0 gains 2 Wealth (Trade tile).'), 0, 16)).toBe('wealth');
    expect(sfxFor(ev('gain', 'P0 gains 1 Fear (kill).'), 0, 16)).toBe('fear');
    expect(sfxFor(ev('gain', 'P0 gains 1 Influence.'), 0, 16)).toBe('influence');
    expect(sfxFor(ev('damage'), 0, 16)).toBe('hit');
    expect(sfxFor(ev('death'), 0, 16)).toBe('death');
    expect(sfxFor(ev('claim'), 0, 16)).toBe('claim');
  });
  it('chime only on your own turn', () => {
    expect(sfxFor(ev('turn', '', { player: 0 }), 0, 16)).toBe('chime');
    expect(sfxFor(ev('turn', '', { player: 1 }), 0, 16)).toBeNull();
  });
  it('toll the bell when the Sudden Death round begins, whatever round the table chose', () => {
    expect(sfxFor(ev('round', 'Round 16 begins.'), 0, 16)).toBe('toll');
    expect(sfxFor(ev('round', 'Round 12 begins.'), 0, 12)).toBe('toll');
    expect(sfxFor(ev('round', 'Round 12 begins.'), 0, 16)).toBeNull();
    expect(sfxFor(ev('win', 'Sudden Death after round 16: P1 wins on total.'), 0, 16)).toBe('toll');
    expect(sfxFor(ev('win', 'P1 claims the Throne.'), 0, 16)).toBe('win');
  });
  it('every event in real games maps to a known sound or none', () => {
    const known = new Set(['tap', 'chime', 'dice', 'step', 'card', 'instant', 'hit', 'block', 'death', 'rise',
      'influence', 'fear', 'wealth', 'loss', 'claim', 'challenge', 'toll', 'win', null]);
    for (const seed of [1, 2, 3]) {
      const r = randomGame(4, seed);
      for (const e of r.state.log) expect(known.has(sfxFor(e, 0, r.state.config.suddenDeathRound))).toBe(true);
    }
  });
});

describe('music', () => {
  const base = { over: false, iWon: false, round: 1, throne: false, anyoneEligible: false };
  it('calm early, rising stakes later or once anyone could claim, the Throne for a claim', () => {
    expect(musicFor(base)).toBe('realm');
    expect(musicFor({ ...base, round: STAKES_ROUND })).toBe('stakes');
    expect(musicFor({ ...base, anyoneEligible: true })).toBe('stakes');
    expect(musicFor({ ...base, round: 12, throne: true })).toBe('throne');
  });
  it('ends in victory or defeat', () => {
    expect(musicFor({ ...base, over: true, iWon: true })).toBe('victory');
    expect(musicFor({ ...base, over: true, throne: true })).toBe('defeat');
  });
});

describe('placeholder music (src/audio/music.ts)', () => {
  it('has a score for every track, in key, with whole bars', async () => {
    const { SCORES } = await import('../src/audio/music');
    const { MUSIC } = await import('../src/assets.config');
    expect(Object.keys(SCORES).sort()).toEqual(Object.keys(MUSIC).sort());
    for (const [id, sc] of Object.entries(SCORES)) {
      expect(sc.loop, id).toBe(MUSIC[id as keyof typeof MUSIC].loop);
      expect(sc.drums).toHaveLength(8);
      expect(sc.chords.length * sc.beatsPerChord * 60 / sc.bpm, `${id} length`).toBeGreaterThan(sc.loop ? 20 : 3);
    }
  });
});
