// The gold-arrow walk (review 1, Oct 21, finding 2; tools/gold-walk.ts): a player who follows nothing but the gold
// arrow, talks to or acts on whatever it points at and takes the first sensible choice, must finish Chapters 1 and
// 2 without once being left with an arrow at their own feet or no arrow at all (the Echo puzzles were exactly that).
// Also the detours a first-time player takes: popping out of the war room's memory before the aide has spoken, and
// coming back from the bridgehead's memory before the pawl is pinned.

import { describe, expect, it } from 'vitest';
import { ACT1, ACT2, ACT3, ACT4, ACT5 } from '../src/data/quests.ts';
import { findPath } from '../src/engine/sim.ts';
import type { Sim } from '../src/engine/sim.ts';
import { goldWalk } from '../tools/gold-walk.ts';
import { loadMaps, newGameSim } from '../tools/sim-setup.ts';

const maps = loadMaps();

/** Walk to a tile on this map and press Echo there (a player trying the shimmer again). */
function echoAt(sim: Sim, x: number, y: number): void {
  const path = findPath(sim.logic, { x, y });
  if (!path) throw new Error(`no way to ${x},${y}`);
  for (const d of path) sim.press(d);
  sim.press('echo');
  for (let i = 0; i < 200 && sim.logic.mode === 'dialogue'; i++) sim.press('confirm');
}

describe('following only the gold arrow', () => {
  const walk = goldWalk({ maps });

  it('finishes Chapters 1 and 2 with no stall', () => {
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    expect(walk.sim.logic.state.flags.isSet('act1.complete')).toBe(true);
    expect(walk.sim.logic.state.flags.isSet('story.escaped')).toBe(true);
  });

  it('meets every objective of both chapters, in order', () => {
    // The pier fight starts as the ferry lands, before the walk ever decides anything in Chapter 2.
    const expected = [...ACT1.objectives.map((o) => `act1/${o.id}`), ...ACT2.objectives.filter((o) => o.id !== 'pier').map((o) => `act2/${o.id}`)];
    expect(walk.objectives).toEqual(expected);
  });

  it('takes the short way (review 1 measured 2,068 steps and 59 map changes before the occupied city was cut)', () => {
    expect(walk.steps).toBeLessThan(2300);
    expect(walk.mapChanges).toBeLessThan(60);
  });
});

describe('following only the gold arrow on, through Chapters 3, 4 and 5', () => {
  // On from the end of Chapter 2 (the merge of Chapters 3 to 5, Oct 22: their goals now name the person or thing,
  // the door, or the shimmer, and every Echo puzzle has its echoGoals).
  const start = goldWalk({ maps });
  const walk = goldWalk({ maps, sim: start.sim, through: 'act5' });

  it('finishes Chapter 5 with no stall', () => {
    expect(start.stalls).toEqual([]);
    expect(walk.stalls).toEqual([]);
    expect(walk.finished).toBe(true);
    for (const f of ['act3.complete', 'act4.complete', 'story.hollis_agreed', 'anchor.ribbon_thread']) expect(walk.sim.logic.state.flags.isSet(f), f).toBe(true);
  });

  it('meets every objective in order (the ones that begin and end inside one scene are never stopped on)', () => {
    const skip: Record<string, readonly string[]> = { act3: ['request', 'guests'], act4: ['lead', 'blades', 'word'], act5: ['road', 'terms'] };
    const expected = [ACT3, ACT4, ACT5].flatMap((q) => q.objectives.filter((o) => !skip[q.id]!.includes(o.id)).map((o) => `${q.id}/${o.id}`));
    expect(walk.objectives).toEqual(expected);
  });

  it('takes a reasonable way (measured Oct 22: 1,810 steps and 48 map changes)', () => {
    expect(walk.steps).toBeLessThan(2100);
    expect(walk.mapChanges).toBeLessThan(60);
  });
});

describe('the arrow in the Echo, after a detour', () => {
  it('out of the war room before the aide has spoken: Gianna knows she was interrupted, and the arrow still finishes Chapter 1', () => {
    const sim = newGameSim(maps);
    const first = goldWalk({ maps, sim, until: (s) => s.logic.era === 'echo' && s.logic.mode === 'field' });
    expect(first.stalls).toEqual([]);
    expect(sim.logic.state.player.mapId).toBe('zetwal-house');
    expect(sim.logic.state.flags.isSet('story.warroom_echo')).toBe(false);
    // Echo again at once, before talking to anyone.
    sim.press('echo');
    const lines: string[] = [];
    for (let i = 0; i < 50 && sim.logic.mode === 'dialogue'; i++) {
      const v = sim.logic.view();
      if (v.kind !== 'end') lines.push(v.text);
      sim.press('confirm');
    }
    expect(lines).toContain('I need to go back. Someone was bringing him something.');
    expect(lines.join(' ')).not.toContain('leave the orders there');
    expect(sim.logic.state.flags.isSet('story.warroom_returned')).toBe(true);
    const rest = goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('act1.complete') });
    expect(rest.stalls).toEqual([]);
    expect(rest.finished).toBe(true);
  });

  it('back from the bridgehead with the bridge lowered but not pinned: the arrow leads back in, to the pawl, and across', () => {
    const sim = newGameSim(maps);
    goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('echo.chain_bridge_down') && s.logic.mode === 'field' });
    expect(sim.logic.era).toBe('echo');
    echoAt(sim, 28, 10);
    expect(sim.logic.era).toBe('present');
    expect(sim.logic.state.flags.isSet('story.bridge_crept_seen')).toBe(true);
    const rest = goldWalk({ maps, sim, until: (s) => s.logic.state.flags.isSet('story.bridge_crossed') });
    expect(rest.stalls).toEqual([]);
    expect(rest.finished).toBe(true);
  });
});
