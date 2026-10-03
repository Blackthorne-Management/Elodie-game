import { describe, it, expect } from 'vitest';
import { SPECIES, speciesById } from '../src/data/pets';
import { MOVES } from '../src/data/moves';
import { BOSSES } from '../src/data/bosses';
import { bossCombatant, petCombatant } from '../src/engine/combatant';
import { runRound } from '../src/engine/battle';
import { makeRng } from '../src/engine/rng';
import { BOSS_MULT } from '../src/config';

const movesOf = (ids: string[]) => ids.map(id => MOVES[id]);

describe('content', () => {
  it('species ids are unique', () => {
    expect(new Set(SPECIES.map(s => s.id)).size).toBe(SPECIES.length);
  });

  it('every species move exists and sits in the right slot', () => {
    for (const sp of SPECIES) {
      for (const slot of ['basic', 'skill', 'ultimate'] as const) {
        const m = MOVES[sp.moves[slot]];
        expect(m, `${sp.id} ${slot}`).toBeDefined();
        expect(m.slot).toBe(slot);
      }
    }
  });

  it('has one Common per weather type', () => {
    const commons = SPECIES.filter(s => s.rarity === 'common').map(s => s.type).sort();
    expect(commons).toEqual(['bloom', 'frost', 'gale', 'rain', 'sun']);
  });

  it('cooldowns follow the slot: 0, 3, 5', () => {
    const want = { basic: 0, skill: 3, ultimate: 5 };
    for (const m of Object.values(MOVES)) expect(m.cooldown, m.id).toBe(want[m.slot]);
  });

  it('every boss move exists', () => {
    for (const boss of BOSSES) for (const id of boss.moves) expect(MOVES[id], id).toBeDefined();
  });
});

describe('Galebeak', () => {
  it('acts twice each round', () => {
    const galebeak = BOSSES.find(b => b.id === 'galebeak')!;
    const boss = bossCombatant(galebeak, 5, BOSS_MULT, { key: 'boss', side: 'enemy', moves: movesOf(galebeak.moves) });
    const sp = speciesById('brambit');
    const pet = petCombatant(sp, 5, 1, 1, {
      key: 'p1', side: 'player', moves: movesOf([sp.moves.basic, sp.moves.skill, sp.moves.ultimate]),
    });
    const b = runRound({ units: [pet, boss], round: 0, grace: 0, log: [] }, {}, makeRng(1));
    expect(b.log.filter(e => e.t === 'move' && e.who === 'boss')).toHaveLength(2);
    expect(boss.maxHp).toBeGreaterThan(pet.maxHp * 5);
  });
});
