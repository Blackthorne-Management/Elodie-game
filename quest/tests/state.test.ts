import { describe, expect, it } from 'vitest';
import { decodeSave, encodeSave } from '../src/engine/save.ts';
import { applySave, newGame, saveFits, toSaveData } from '../src/engine/state.ts';
import { parseMap } from '../src/engine/tiledMap.ts';
import { makeMap, obj } from './helpers.ts';

const map = parseMap(
  'm',
  makeMap({
    present: ['.....', '.#...', '.....', '.....', '.....'],
    objects: { spawns: [obj('start', 2, 3, { facing: 'left' }), obj('other', 0, 0)] },
  }),
);

describe('game state', () => {
  it('a new game starts at the named spawn, in the present, with no flags', () => {
    const s = newGame(map, 'start');
    expect(s.player).toEqual({ mapId: 'm', pos: { x: 2, y: 3 }, facing: 'left', era: 'present' });
    expect(s.flags.snapshot()).toEqual({});
    expect(s.settings.textSpeed).toBe('normal');
  });

  it('save data round-trips through a save code back into a state', () => {
    const s = newGame(map, 'start');
    s.player.pos = { x: 4, y: 4 };
    s.player.facing = 'up';
    s.flags.set('a', true);
    s.settings.textSpeed = 'slow';
    const decoded = decodeSave(encodeSave(toSaveData(s, 123)));
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const fresh = newGame(map, 'other');
    applySave(fresh, decoded.data);
    expect(fresh.player).toEqual(s.player);
    expect(fresh.flags.snapshot()).toEqual({ a: true });
    expect(fresh.settings.textSpeed).toBe('slow');
  });

  it('a save only fits a known map on a walkable tile', () => {
    const data = toSaveData(newGame(map, 'start'), 0);
    expect(saveFits(data, { m: map })).toBe(true);
    expect(saveFits({ ...data, mapId: 'gone' }, { m: map })).toBe(false);
    expect(saveFits({ ...data, x: 1, y: 1 }, { m: map })).toBe(false);
    expect(saveFits({ ...data, x: 40, y: 1 }, { m: map })).toBe(false);
  });
});
