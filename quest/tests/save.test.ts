import { describe, expect, it } from 'vitest';
import { SAVE_VERSION } from '../src/config.ts';
import { checksum, decodeSave, deleteSave, encodeSave, keepUnreadable, readSave, UNREADABLE_SUFFIX, writeSave, type SaveData, type StorageLike } from '../src/engine/save.ts';

const data: SaveData = {
  version: SAVE_VERSION,
  mapId: 'test-village',
  x: 11,
  y: 9,
  facing: 'down',
  era: 'present',
  flags: { 'villager.met': true, 'villager.answer': 'yes', count: 3, 'name.é': 'Limyè ☀' },
  settings: { textSpeed: 'fast', hints: false },
  savedAt: 1_760_000_000_000,
};

/** A save code with a good checksum around any payload. */
function coded(fields: unknown[], version = 2): string {
  const body = Buffer.from(JSON.stringify(fields)).toString('base64url');
  return `BQ${version}.${body}.${checksum(body)}`;
}

function memoryStorage(): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

describe('save codes', () => {
  it('round-trips every field, including non-ASCII text', () => {
    const code = encodeSave(data);
    expect(code).toMatch(/^BQ2\.[A-Za-z0-9_-]+\.[0-9a-f]{8}$/);
    expect(decodeSave(code)).toEqual({ ok: true, data });
  });

  it('is compact', () => {
    expect(encodeSave(data).length).toBeLessThan(220);
  });

  it('tolerates whitespace and line breaks from copy and paste', () => {
    const code = encodeSave(data);
    const messy = `  ${code.slice(0, 20)}\n${code.slice(20)}  `;
    expect(decodeSave(messy)).toEqual({ ok: true, data });
  });

  it('rejects a changed payload (checksum)', () => {
    const code = encodeSave(data);
    const [head, body, sum] = code.split('.');
    const flipped = body!.slice(0, 5) + (body![5] === 'A' ? 'B' : 'A') + body!.slice(6);
    const r = decodeSave(`${head}.${flipped}.${sum}`);
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.error).toMatch(/checksum/);
  });

  it('rejects junk, wrong prefixes and future versions', () => {
    expect(decodeSave('hello')).toMatchObject({ ok: false });
    expect(decodeSave('XX1.abc.00000000')).toMatchObject({ ok: false });
    const body = encodeSave(data).split('.')[1]!;
    const r = decodeSave(`BQ${SAVE_VERSION + 1}.${body}.${checksum(body)}`);
    expect(r).toMatchObject({ ok: false });
    if (!r.ok) expect(r.error).toMatch(/newer version/);
  });

  it('rejects a well-checksummed payload without a readable place or flags', () => {
    expect(decodeSave(coded([1, 'm', -1, 0, 0, 0, {}, 0, 0], 1))).toMatchObject({ ok: false });
    expect(decodeSave(coded([1, '', 1, 1, 0, 0, {}, 0, 0], 1))).toMatchObject({ ok: false });
    expect(decodeSave(coded([1, 'm', 1, 1, 0, 0, [], 0, 0], 1))).toMatchObject({ ok: false });
    expect(decodeSave(coded([1, 'm', 1, 1, 0, 0], 1))).toMatchObject({ ok: false });
    expect(decodeSave(coded({ map: 'm' } as unknown as unknown[], 1))).toMatchObject({ ok: false });
    expect(decodeSave(coded([2, 'm', 1, 1, 0, 0, {}, 0, 0, 1], 1))).toMatchObject({ ok: false });
  });

  it('loads the rest of an old or damaged code with defaults, and names what was defaulted (Oct 28)', () => {
    // A bad facing, a bad era, bad flag values, a text speed from a longer list, a fractional time, a bad hints bit.
    const r = decodeSave(coded([2, 'm', 1, 1, 9, 7, { a: [1], b: true, c: null, d: 'x' }, 12, 1.5, 7]));
    expect(r).toEqual({
      ok: true,
      data: {
        version: SAVE_VERSION,
        mapId: 'm',
        x: 1,
        y: 1,
        facing: 'down',
        era: 'present',
        flags: { b: true, d: 'x' },
        settings: { textSpeed: 'normal', hints: true },
        savedAt: 0,
      },
      defaulted: ['facing', 'era', 'flags', 'text speed', 'time', 'hints'],
    });
    // A version 2 code cut short after the flags.
    expect(decodeSave(coded([2, 'm', 1, 1, 0, 1, { a: true }]))).toMatchObject({
      ok: true,
      data: { facing: 'up', era: 'echo', flags: { a: true }, settings: { textSpeed: 'normal', hints: true } },
      defaulted: ['text speed', 'time', 'hints'],
    });
  });

  it('still reads version 1 codes (before the hints setting), with hints on', () => {
    const v1 = Buffer.from(JSON.stringify([1, 'test-village', 3, 4, 1, 0, { a: true }, 2, 5])).toString('base64url');
    expect(decodeSave(`BQ1.${v1}.${checksum(v1)}`)).toEqual({
      ok: true,
      data: {
        version: SAVE_VERSION,
        mapId: 'test-village',
        x: 3,
        y: 4,
        facing: 'down',
        era: 'present',
        flags: { a: true },
        settings: { textSpeed: 'fast', hints: true },
        savedAt: 5,
      },
    });
  });

  it('stores the hints setting and the Echo era', () => {
    const echo: SaveData = { ...data, era: 'echo', settings: { textSpeed: 'slow', hints: true } };
    expect(decodeSave(encodeSave(echo))).toEqual({ ok: true, data: echo });
    // A bad hints bit takes the default (on) rather than lose the game.
    expect(decodeSave(coded([2, 'm', 1, 1, 0, 0, {}, 0, 0, 7]))).toMatchObject({ ok: true, data: { settings: { hints: true } }, defaulted: ['hints'] });
  });

  it('checksum is stable FNV-1a', () => {
    expect(checksum('')).toBe('811c9dc5');
    expect(checksum('a')).toBe('e40c292c');
  });
});

describe('save storage', () => {
  it('writes, reads and deletes through the storage', () => {
    const s = memoryStorage();
    expect(readSave(s, 'k')).toBeNull();
    expect(writeSave(s, 'k', data)).toBe(true);
    expect(s.map.get('k')).toMatch(/^BQ2\./);
    expect(readSave(s, 'k')).toEqual({ ok: true, data });
    deleteSave(s, 'k');
    expect(readSave(s, 'k')).toBeNull();
  });

  it('survives missing or throwing storage', () => {
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('full');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(writeSave(undefined, 'k', data)).toBe(false);
    expect(writeSave(throwing, 'k', data)).toBe(false);
    expect(readSave(throwing, 'k')).toBeNull();
    expect(() => deleteSave(throwing, 'k')).not.toThrow();
  });

  it('reports a damaged stored save instead of throwing', () => {
    const s = memoryStorage();
    s.setItem('k', 'BQ1.garbage.00000000');
    expect(readSave(s, 'k')).toMatchObject({ ok: false });
  });

  it('reports bad JSON, bad base64 and empty text as damaged, never throwing', () => {
    const s = memoryStorage();
    const notJson = Buffer.from('not json').toString('base64url');
    for (const junk of ['', '{"a":1}', 'BQ2.!!!!.00000000', `BQ2.${notJson}.${checksum(notJson)}`, 'BQ2..', 'BQx.a.b']) {
      s.setItem('k', junk);
      expect(() => readSave(s, 'k')).not.toThrow();
      expect(readSave(s, 'k'), junk).toMatchObject({ ok: false });
    }
  });

  it('keeps an unreadable save under its own key, and survives storage that throws', () => {
    const s = memoryStorage();
    expect(keepUnreadable(s, 'k')).toBeNull();
    s.setItem('k', 'junk');
    expect(keepUnreadable(s, 'k')).toBe('junk');
    expect(s.map.get('k' + UNREADABLE_SUFFIX)).toBe('junk');
    expect(keepUnreadable(undefined, 'k')).toBeNull();
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };
    expect(keepUnreadable(throwing, 'k')).toBeNull();
  });
});
