import { describe, expect, it } from 'vitest';
import type { GameRecord } from '../src/state/stats';
import { summarise } from '../src/state/stats';

const rec = (won: boolean, house: GameRecord['house'], extra: Partial<GameRecord> = {}): GameRecord => ({
  at: Math.random(), won, house, players: 4, rounds: 10, kills: 1, deaths: 1, specter: false, claims: won ? 1 : 0,
  suddenDeath: false, winnerHouse: won ? house : 'brasador', ...extra,
});

describe('player record', () => {
  it('is empty with no games', () => {
    const s = summarise([]);
    expect(s.played).toBe(0);
    expect(s.rate).toBe(0);
    expect(s.bestHouse).toBeNull();
    expect(s.fastestWin).toBeNull();
  });

  it('sums wins, streaks, houses, nemesis and feats (newest first)', () => {
    const s = summarise([
      rec(true, 'dorini', { rounds: 8 }),
      rec(true, 'dorini', { rounds: 12, suddenDeath: true }),
      rec(false, 'ironvow', { winnerHouse: 'suzumori', specter: true, deaths: 4 }),
      rec(true, 'ironvow'),
      rec(true, 'stillwater'),
      rec(true, 'stillwater'),
      rec(false, 'dorini', { winnerHouse: 'suzumori' }),
    ]);
    expect(s.played).toBe(7);
    expect(s.wins).toBe(5);
    expect(s.streak).toBe(2);
    expect(s.bestStreak).toBe(3);
    expect(s.favourite?.house).toBe('dorini');
    expect(s.bestHouse?.wins).toBe(2);
    expect(s.nemesis).toEqual({ house: 'suzumori', times: 2 });
    expect(s.fastestWin).toBe(8);
    expect(s.suddenDeathWins).toBe(1);
    expect(s.specters).toBe(1);
    expect(s.deaths).toBe(10);
    expect(s.recent).toHaveLength(5);
  });
});
