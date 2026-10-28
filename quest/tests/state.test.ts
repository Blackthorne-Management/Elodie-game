import { describe, expect, it } from 'vitest';
import { checksum, decodeSave, encodeSave, UNREADABLE_SUFFIX, type StorageLike } from '../src/engine/save.ts';
import { applySave, loadStoredSave, newGame, placeSave, saveFits, toSaveData } from '../src/engine/state.ts';
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

function memoryStorage(entries: Record<string, string> = {}): StorageLike & { map: Map<string, string> } {
  const m = new Map(Object.entries(entries));
  return { map: m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) };
}

const code = (fields: unknown[], version = 2) => {
  const body = Buffer.from(JSON.stringify(fields)).toString('base64url');
  return `BQ${version}.${body}.${checksum(body)}`;
};

describe('old and damaged saves (Claude\'s call, Oct 28: they never crash the game)', () => {
  it('a save whose tile became a wall moves to the nearest open spawn, in its era', () => {
    const data = toSaveData(newGame(map, 'start'), 0);
    expect(placeSave(data, { m: map })).toEqual({ data, moved: false });
    // (1, 1) is a wall now: the nearest spawn is "other" at (0, 0), with that spawn's facing.
    expect(placeSave({ ...data, x: 1, y: 1 }, { m: map })).toEqual({ data: { ...data, x: 0, y: 0, facing: 'down' }, moved: true });
    // Off the map's edge (the map shrank): the nearest spawn to where it was, "start" at (2, 3).
    expect(placeSave({ ...data, x: 9, y: 9 }, { m: map })?.data).toMatchObject({ x: 2, y: 3 });
    expect(placeSave({ ...data, mapId: 'gone' }, { m: map })).toBeNull();
  });

  it('no stored save, or storage that throws (a private tab), is simply no save', () => {
    expect(loadStoredSave(undefined, 'k', { m: map })).toEqual({ status: 'none' });
    expect(loadStoredSave(memoryStorage(), 'k', { m: map })).toEqual({ status: 'none' });
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => undefined,
    };
    expect(loadStoredSave(throwing, 'k', { m: map })).toEqual({ status: 'none' });
  });

  it('a good save loads with nothing to say', () => {
    const s = memoryStorage({ k: encodeSave(toSaveData(newGame(map, 'start'), 5)) });
    expect(loadStoredSave(s, 'k', { m: map })).toMatchObject({ status: 'loaded', notice: null, data: { mapId: 'm', x: 2, y: 3 } });
  });

  it('bad JSON, a bad checksum or a newer version: a new game, the old text kept and the player told', () => {
    for (const bad of ['{"not":"a save"}', 'BQ2.garbage.00000000', code([3, 'm', 2, 3, 0, 0, {}, 1, 0, 1], 3), '']) {
      const s = memoryStorage({ k: bad });
      const r = loadStoredSave(s, 'k', { m: map });
      expect(r.status, bad).toBe('invalid');
      if (r.status !== 'invalid') continue;
      expect(r.notice).toMatch(/could not be read/);
      expect(r.kept).toBe(bad);
      expect(s.map.get('k' + UNREADABLE_SUFFIX)).toBe(bad);
    }
  });

  it('a save on a map this version does not have: a new game, kept and told', () => {
    const s = memoryStorage({ k: code([2, 'old-map', 1, 1, 0, 0, { a: true }, 1, 0, 1]) });
    const r = loadStoredSave(s, 'k', { m: map });
    expect(r).toMatchObject({ status: 'invalid', notice: expect.stringMatching(/place this version/) });
    expect(s.map.get('k' + UNREADABLE_SUFFIX)).toBe(s.map.get('k'));
  });

  it('an old save missing later fields loads with their defaults and says so', () => {
    // Seven fields (no settings, no time): facing up, the present, one flag.
    const r = loadStoredSave(memoryStorage({ k: code([2, 'm', 2, 3, 0, 0, { a: true }]) }), 'k', { m: map });
    expect(r).toMatchObject({ status: 'loaded', data: { x: 2, y: 3, facing: 'up', flags: { a: true }, settings: { textSpeed: 'normal', hints: true }, savedAt: 0 } });
    if (r.status === 'loaded') expect(r.notice).toMatch(/text speed, time.*reset/);
  });

  it('an old save on a spot that is now a wall loads at the nearest way in and says so', () => {
    const r = loadStoredSave(memoryStorage({ k: code([2, 'm', 1, 1, 0, 0, {}, 1, 0, 1]) }), 'k', { m: map });
    expect(r).toMatchObject({ status: 'loaded', data: { x: 0, y: 0 }, notice: expect.stringMatching(/nearest way in/) });
  });

  it('storage that cannot keep the unreadable save still starts a new game', () => {
    const s: StorageLike = {
      getItem: () => 'junk',
      setItem: () => {
        throw new Error('full');
      },
      removeItem: () => undefined,
    };
    expect(loadStoredSave(s, 'k', { m: map })).toMatchObject({ status: 'invalid', kept: null });
  });
});
