// Accord Stability (engine/stability.ts; the Chapter 12 outline 4.2 as its second review's 3.5 recalibrated it): one pure
// score from the whole game's recorded choices, shown once after the verdict, and the ending it gives. The five canonical
// saves of the review, each with the ending it should reach; the Hollow card names what strained the realm; the ending is
// written once, after the verdict, and never before.

import { describe, expect, it } from 'vitest';
import { STABILITY } from '../src/config.ts';
import { STABILITY_HOUSES } from '../src/data/claim.ts';
import { FlagStore, type FlagSnapshot } from '../src/engine/flags.ts';
import { costliest, ending, stability, stabilityFlagsWritten, stabilityParts, stabilityTick } from '../src/engine/stability.ts';

const H = STABILITY_HOUSES;

/** Every house's army kept, every Unpaid Debt input, every chair set, the kind Yields and spared bosses, Concord at 100. */
const KEPT_ALL: FlagSnapshot = {
  'army.skarragol': 47,
  'army.kuroshi': 14,
  'army.jwaladesh': 32,
  'army.al_doria': 21,
  'stability.xaragua_freed': true,
  'stability.elders_agreed': true,
  'ally.xaragua': true,
  'side.seats.done': true,
  'choice.thorne_spared': true,
  'choice.hushed_tried': true,
  'choice.grimvald_spared': true,
  'choice.fox_spared': true,
  'choice.dhanraj_spared': true,
  concord: 100,
};
const TRUST: FlagSnapshot = { 'stability.harbor_trust': true, 'stability.fleet_struck': true };
const STRIKE: FlagSnapshot = { 'stability.harbor_strike': true, 'stability.fleet_escaped': true };
const PARDON: FlagSnapshot = { 'hearing.pardon': true };
const at = (...parts: FlagSnapshot[]) => new FlagStore(Object.assign({}, ...parts));

describe('the five canonical saves (the second review\'s 3.5)', () => {
  it('Trust, every house kept and every chair set, Azzy renounces, a pardon: about 100, the Just Throne', () => {
    const f = at(KEPT_ALL, TRUST, PARDON, { 'claim.azzy_renounced': true });
    expect(stability(f, H)).toBeGreaterThanOrEqual(95);
    expect(ending(f, H)).toBe('just');
  });

  it('Strike, the same save: about 75, the Hollow Throne (the war\'s cost)', () => {
    const f = at(KEPT_ALL, STRIKE, PARDON, { 'claim.azzy_renounced': true });
    expect(stability(f, H)).toBeGreaterThanOrEqual(70);
    expect(stability(f, H)).toBeLessThan(STABILITY.just);
    expect(ending(f, H)).toBe('hollow');
  });

  it('Strike, but Azzy shares the Claim: 80, the Just Throne (a real path)', () => {
    const f = at(KEPT_ALL, STRIKE, PARDON, { 'claim.azzy_share': true });
    expect(stability(f, H)).toBe(STABILITY.just);
    expect(ending(f, H)).toBe('just');
  });

  it('the darkest Strike: a house sold, its captain bound, Azzy\'s Challenge, Thorne and the Almoner broken: about 33, Hollow', () => {
    const f = at(KEPT_ALL, STRIKE, PARDON, {
      'army.skarragol': 0,
      'muster.betrayed': true,
      'muster.betrayer.skarragol': true,
      'seat.bare.skarragol': true,
      'stability.elders_agreed': false,
      'choice.flank_bound': true,
      'claim.azzy_challenged': true,
      'choice.thorne_spared': false,
      'choice.thorne_broken': true,
      'choice.hushed_tried': false,
      'choice.hushed_broken': true,
      concord: 80,
    });
    expect(stability(f, H)).toBeLessThanOrEqual(40);
    expect(ending(f, H)).toBe('hollow');
  });

  it('an execution is the Iron Throne on any save; an exile is Hollow on any save', () => {
    expect(ending(at(KEPT_ALL, TRUST, { 'hearing.execution': true }), H)).toBe('iron');
    expect(ending(at(KEPT_ALL, TRUST, { 'hearing.exile': true }), H)).toBe('hollow');
    expect(ending(at(KEPT_ALL, TRUST), H)).toBeNull();
  });
});

describe('the score\'s parts', () => {
  it('reads every input from the table, a turned house at half, Concord clamped, the score clamped to 0 to 100', () => {
    const turned = at({ 'muster.turned': true, 'muster.betrayer.kuroshi': true, 'army.kuroshi': 0 });
    expect(stabilityParts(turned, H)).toContainEqual({ id: 'house.kuroshi', value: STABILITY.houseTurned });
    expect(stabilityParts(at({ concord: 0 }), H)).toContainEqual({ id: 'concord', value: -STABILITY.concordMax });
    expect(stabilityParts(at({ concord: 100 }), H)).toContainEqual({ id: 'concord', value: STABILITY.concordMax });
    expect(stability(at(KEPT_ALL, TRUST, PARDON, { 'item.seventh_ribbon': true, 'claim.azzy_share': true }), H)).toBe(100);
    expect(stability(at(STRIKE, { 'hearing.execution': true, 'claim.azzy_challenged': true, concord: 0, 'choice.thorne_broken': true }), H)).toBe(0);
    // A bare chair costs, and only a full row pays.
    const bare = at({ 'side.seats.done': true, 'seat.bare.al_doria': true });
    expect(stabilityParts(bare, H).map((p) => p.id)).toEqual(['concord', 'bare.al_doria']);
  });

  it('the Hollow card names the costliest strains, worst first, at most STABILITY.hollowLines of them', () => {
    const f = at(STRIKE, PARDON, { 'seat.bare.skarragol': true, 'claim.azzy_challenged': true, 'choice.thorne_broken': true, concord: 60 });
    expect(costliest(f, H)).toEqual(['harbor_strike', 'challenge', 'fleet_escaped']);
    expect(costliest(f, H, 10)).toEqual(['harbor_strike', 'challenge', 'fleet_escaped', 'bare.skarragol', 'concord', 'yield.thorne']);
  });
});

describe('the verdict writes the score and the ending once (engine/stability.ts stabilityTick)', () => {
  it('nothing before the verdict; then the score, the ending and, on the Hollow Throne, its costs', () => {
    const f = at(KEPT_ALL, STRIKE, { 'claim.azzy_renounced': true });
    stabilityTick(f, H);
    expect(f.get('stability.score')).toBeUndefined();
    f.set('hearing.pardon', true);
    stabilityTick(f, H);
    expect(f.get('stability.score')).toBe(stability(f, H));
    expect(f.isSet('ending.hollow')).toBe(true);
    expect(f.isSet('ending.cost.harbor_strike') && f.isSet('ending.cost.fleet_escaped')).toBe(true);
    // Written once: a later change does not move the ending.
    f.set('claim.azzy_share', true);
    stabilityTick(f, H);
    expect(f.isSet('ending.just')).toBe(false);
    for (const k of Object.keys(f.snapshot()).filter((k) => k.startsWith('ending.') || k === 'stability.score')) expect(stabilityFlagsWritten(H)).toContain(k);
  });

  it('a Hollow Throne with nothing that cost says so', () => {
    const f = at({ 'hearing.pardon': true, concord: 75 });
    stabilityTick(f, H);
    expect(f.isSet('ending.hollow') && f.isSet('ending.cost.none')).toBe(true);
  });
});
