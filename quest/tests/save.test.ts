import { describe, expect, it } from 'vitest';
import { SAVE_VERSION } from '../src/config.ts';
import { checksum, decodeSave, deleteSave, encodeSave, readSave, writeSave, type SaveData, type StorageLike } from '../src/engine/save.ts';

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

  it('rejects a well-checksummed payload with the wrong shape', () => {
    const body = Buffer.from(JSON.stringify([1, 'm', -1, 0, 0, 0, {}, 0, 0])).toString('base64url');
    expect(decodeSave(`BQ1.${body}.${checksum(body)}`)).toMatchObject({ ok: false });
    const body2 = Buffer.from(JSON.stringify([1, 'm', 1, 1, 9, 0, {}, 0, 0])).toString('base64url');
    expect(decodeSave(`BQ1.${body2}.${checksum(body2)}`)).toMatchObject({ ok: false });
    const body3 = Buffer.from(JSON.stringify([1, 'm', 1, 1, 0, 0, { a: [1] }, 0, 0])).toString('base64url');
    expect(decodeSave(`BQ1.${body3}.${checksum(body3)}`)).toMatchObject({ ok: false });
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
    const bad = Buffer.from(JSON.stringify([2, 'm', 1, 1, 0, 0, {}, 0, 0, 7])).toString('base64url');
    expect(decodeSave(`BQ2.${bad}.${checksum(bad)}`)).toMatchObject({ ok: false });
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
});
