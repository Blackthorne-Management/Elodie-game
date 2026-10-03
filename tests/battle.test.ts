import { describe, it, expect } from 'vitest';
import { runRound } from '../src/engine/battle';
import type { Battle, BattleEvent } from '../src/engine/battle';
import { aiChoose } from '../src/engine/ai';
import { addStatus, absorb } from '../src/engine/status';
import { makeRng } from '../src/engine/rng';
import { stormMultiplier } from '../src/engine/damage';
import { basic, makeUnit, mend, skill } from './fixtures';

function fourVsFour(): Battle {
  return {
    round: 0, grace: 0, log: [],
    units: [
      makeUnit('p1', 'player', 'gale', { speed: 18 }),
      makeUnit('p2', 'player', 'rain', { speed: 12 }),
      makeUnit('p3', 'player', 'sun', { speed: 20 }),
      makeUnit('p4', 'player', 'bloom', { speed: 10 }, [basic, mend]),
      makeUnit('e1', 'enemy', 'frost', { speed: 14 }),
      makeUnit('e2', 'enemy', 'sun', { speed: 16 }),
      makeUnit('e3', 'enemy', 'rain', { speed: 11 }),
      makeUnit('e4', 'enemy', 'gale', { speed: 19 }),
    ],
  };
}

function fight(seed: number) {
  const rng = makeRng(seed);
  let b = fourVsFour();
  const log: BattleEvent[] = [];
  while (!b.winner && b.round < 100) {
    b = runRound(b, {}, rng);   // no choices = auto-battle for both sides
    log.push(...b.log);
  }
  return { b, log };
}

describe('battle loop', () => {
  it('a 4v4 battle with a fixed seed runs to a winner', () => {
    const { b, log } = fight(2026);
    expect(b.winner).toBeDefined();
    expect(log.at(-1)).toEqual({ t: 'end', winner: b.winner });
    const losers = b.units.filter(u => u.side !== b.winner);
    expect(losers.every(u => u.hp === 0)).toBe(true);
    console.log(`winner: ${b.winner} after ${b.round} rounds, ${log.length} events`);
  });

  it('is fully replayable from the same seed', () => {
    expect(fight(99).log).toEqual(fight(99).log);
  });

  it('does not mutate the previous battle', () => {
    const start = fourVsFour();
    const snapshot = structuredClone(start);
    runRound(start, {}, makeRng(1));
    expect(start).toEqual(snapshot);
  });

  it('fastest unit acts first', () => {
    const b = runRound(fourVsFour(), {}, makeRng(3));
    expect(b.log[0]).toMatchObject({ t: 'move', who: 'p3' });
  });

  it('grace fills by 10 per player action and caps at 100', () => {
    const b = runRound(fourVsFour(), {}, makeRng(4));
    expect(b.grace).toBe(40);
    const full = runRound({ ...fourVsFour(), grace: 95 }, {}, makeRng(4));
    expect(full.grace).toBe(100);
  });

  it('a skill is ready again on the fourth round', () => {
    let b = fourVsFour();
    const rng = makeRng(8);
    b = runRound(b, { p1: { moveId: 'gust' } }, rng);
    expect(b.units[0].cooldowns.gust).toBe(2);
    b = runRound(b, { p1: { moveId: 'gust' } }, rng);   // on cooldown: falls back to basic
    expect(b.log.find(e => e.t === 'move' && e.who === 'p1')).toMatchObject({ move: 'peck' });
    b = runRound(b, {}, rng);
    expect(aiChoose(b.units[0], b).moveId).toBe('gust');
  });

  it('frozen units skip their turn and become briefly immune', () => {
    const b = fourVsFour();
    addStatus(b.units[2], 'freeze', 1);
    const next = runRound(b, {}, makeRng(5));
    expect(next.log).toContainEqual({ t: 'skip', who: 'p3' });
    expect(addStatus(next.units[2], 'freeze', 1)).toBe(false);
  });

  it('rooted units are forced to use their Basic move', () => {
    const b = fourVsFour();
    addStatus(b.units[2], 'root', 2);
    const next = runRound(b, { p3: { moveId: 'gust' } }, makeRng(6));
    expect(next.log.find(e => e.t === 'move' && e.who === 'p3')).toMatchObject({ move: 'peck' });
  });

  it('taunt forces single-target attacks onto the taunter', () => {
    const b = fourVsFour();
    addStatus(b.units[6], 'taunt', 2);
    const next = runRound(b, { p3: { moveId: 'peck', targetKey: 'e1' } }, makeRng(7));
    const i = next.log.findIndex(e => e.t === 'move' && e.who === 'p3');
    expect(next.log[i + 1]).toMatchObject({ target: 'e3' });
  });
});

describe('storm', () => {
  it('only starts at the storm round and then ramps up', () => {
    expect(stormMultiplier(11)).toBe(1);
    expect(stormMultiplier(12)).toBeCloseTo(1.2);
    expect(stormMultiplier(14)).toBeCloseTo(1.6);
  });

  it('ends a healer and shield stand-off', () => {
    const team = (side: 'player' | 'enemy', p: string) => [
      makeUnit(`${p}1`, side, 'rain', { attack: 8, defense: 40 }, [basic, mend]),
      makeUnit(`${p}2`, side, 'bloom', { attack: 8, defense: 40 }, [basic, mend]),
    ];
    const rng = makeRng(11);
    let b: Battle = { round: 0, grace: 0, log: [], units: [...team('player', 'p'), ...team('enemy', 'e')] };
    while (!b.winner && b.round < 60) b = runRound(b, {}, rng);
    expect(b.winner).toBeDefined();
  });
});

describe('status', () => {
  it('refreshes instead of stacking', () => {
    const u = makeUnit('u', 'player', 'calm');
    addStatus(u, 'burn', 2);
    addStatus(u, 'burn', 3);
    expect(u.statuses).toEqual([{ id: 'burn', turns: 3, value: undefined }]);
  });

  it('shields soak damage before HP', () => {
    const u = makeUnit('u', 'player', 'calm');
    addStatus(u, 'shield', 2, 30);
    expect(absorb(u, 20)).toBe(0);
    expect(absorb(u, 20)).toBe(10);
    expect(u.hp).toBe(90);
    expect(u.statuses.some(s => s.id === 'shield')).toBe(false);
  });
});

describe('ai', () => {
  it('healers heal when an ally is below half HP', () => {
    const b = fourVsFour();
    b.units[0].hp = 30;
    expect(aiChoose(b.units[3], b).moveId).toBe('mend');
  });

  it('prefers a target it has type advantage over', () => {
    const b = fourVsFour();
    expect(aiChoose(b.units[2], b).targetKey).toBe('e1'); // sun beats frost
  });

  it('uses its strongest ready move', () => {
    const b = fourVsFour();
    expect(aiChoose(b.units[0], b).moveId).toBe(skill.id);
  });
});
