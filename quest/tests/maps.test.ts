import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MAP_SOURCES } from '../src/data/maps.ts';
import { validateMap, validateMaps, type ValidationContext } from '../src/engine/mapValidation.ts';
import type { TiledMap, TiledTileLayer } from '../src/engine/tiledMap.ts';
import { staleMaps } from '../tools/build-maps.ts';
import { MAPS_DIR, runValidation } from '../tools/validate-maps.ts';
import { makeMap, obj } from './helpers.ts';

const ctx: ValidationContext = { npcIds: ['villager'], dialogueIds: ['hello'] };

describe('the real maps (same check as npm run validate:maps)', () => {
  it('every map in quest/maps is valid', () => {
    const { maps, errors } = runValidation();
    expect(maps.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  it('the generated Zetwal maps match their sources (npm run maps:build)', () => {
    expect(staleMaps()).toEqual([]);
  });

  it('the game registry bundles exactly the maps on disk', () => {
    const onDisk = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.tmj')).map((f) => f.replace(/\.tmj$/, '')).sort();
    expect(Object.keys(MAP_SOURCES).sort()).toEqual(onDisk);
  });
});

describe('map validator', () => {
  it('accepts a minimal valid map', () => {
    expect(validateMap('m', makeMap(), ctx)).toEqual([]);
  });

  it('reports missing layers and wrong layer types', () => {
    const map = makeMap();
    map.layers = map.layers.filter((l) => l.name !== 'collide_echo' && l.name !== 'anchors');
    const errors = validateMap('m', map, ctx);
    expect(errors).toContain('m: missing tile layer "collide_echo"');
    expect(errors).toContain('m: missing object layer "anchors"');

    const swapped = makeMap();
    swapped.layers = swapped.layers.map((l) => (l.name === 'npcs' ? { ...(l as unknown as TiledTileLayer), type: 'tilelayer', width: 5, height: 5, data: [] } : l)) as TiledMap['layers'];
    expect(validateMap('m', swapped, ctx)).toContain('m: layer "npcs" must be an object layer');
  });

  it('reports layers whose size does not match the map', () => {
    const map = makeMap();
    const ground = map.layers[0] as TiledTileLayer;
    ground.data = ground.data.slice(1);
    expect(validateMap('m', map, ctx).some((e) => e.includes('"ground_present" has 24 tiles, expected 25'))).toBe(true);
    const map2 = makeMap();
    (map2.layers[1] as TiledTileLayer).width = 4;
    expect(validateMap('m', map2, ctx).some((e) => e.includes('"deco_present" is 4 x 5'))).toBe(true);
  });

  it('reports wrong tile size and unknown tiles', () => {
    const map = makeMap();
    map.tilewidth = 32;
    expect(validateMap('m', map, ctx).some((e) => e.includes('expected 16 x 16'))).toBe(true);
    const map2 = makeMap();
    (map2.layers[0] as TiledTileLayer).data[3] = 999;
    expect(validateMap('m', map2, ctx).some((e) => e.includes('unknown tile 999'))).toBe(true);
  });

  it('requires echo zone tiles to be walkable in BOTH eras', () => {
    const okMap = makeMap({ objects: { echo_zones: [obj('z', 1, 1, {}, 2, 2)] } });
    expect(validateMap('m', okMap, ctx)).toEqual([]);
    const blockedEcho = makeMap({
      present: ['.....', '.....', '.....', '.....', '.....'],
      echo: ['.....', '..#..', '.....', '.....', '.....'],
      objects: { echo_zones: [obj('z', 1, 1, {}, 2, 2)] },
    });
    expect(validateMap('m', blockedEcho, ctx)).toEqual(['m: echo zone "z" tile 2,1 is not walkable in the echo']);
    const blockedPresent = makeMap({
      present: ['.....', '.#...', '.....', '.....', '.....'],
      echo: ['.....', '.....', '.....', '.....', '.....'],
      objects: { echo_zones: [obj('z', 1, 1, {}, 2, 2)] },
    });
    expect(validateMap('m', blockedPresent, ctx)).toEqual(['m: echo zone "z" tile 1,1 is not walkable in the present']);
  });

  it('requires spawns, on walkable tiles', () => {
    expect(validateMap('m', makeMap({ objects: { spawns: [] } }), ctx)).toContain('m: has no spawns');
    const blocked = makeMap({ present: ['#....', '.....', '.....', '.....', '.....'] });
    expect(validateMap('m', blocked, ctx)).toContain('m: spawn "start" at 0,0 is not walkable in the present');
  });

  it('checks NPC and dialogue ids', () => {
    const map = makeMap({
      objects: {
        npcs: [obj('a', 2, 2, { npc: 'villager' }), obj('b', 3, 3, { npc: 'stranger' })],
        triggers: [obj('t1', 1, 1, { dialogue: 'hello' }), obj('t2', 1, 2, { dialogue: 'nope' }), obj('t3', 1, 3, { dialogue: 'hello', once: true })],
      },
    });
    const errors = validateMap('m', map, ctx);
    expect(errors).toContain('m: npc "stranger" is not defined in data/npcs.ts');
    expect(errors).toContain('m: trigger "t2" plays unknown dialogue "nope"');
    expect(errors).toContain('m: trigger "t3" is once-only but has no flag to remember it');
    expect(errors.some((e) => e.includes('"t1"'))).toBe(false);
  });

  it('reports duplicate ids and objects outside the map', () => {
    const map = makeMap({ objects: { anchors: [obj('x', 1, 1), obj('x', 2, 2), obj('far', 9, 9)] } });
    const errors = validateMap('m', map, ctx);
    expect(errors).toContain('m: anchors id "x" is used twice');
    expect(errors).toContain('m: anchors object "far" is outside the map');
  });

  it('checks door targets exist, pair up, and let the player out onto open ground', () => {
    const good = makeMap({
      objects: { doors: [obj('a', 0, 4, { target: 'b', exit: 'up' }), obj('b', 4, 0, { target: 'a', exit: 'down' })] },
    });
    expect(validateMaps({ m: good }, ctx)).toEqual([]);

    const broken = makeMap({
      present: ['.....', '.....', '.....', '#....', '.....'],
      objects: {
        doors: [
          obj('a', 0, 4, { target: 'b', exit: 'up' }),
          obj('b', 4, 0, { target: 'c', exit: 'down' }),
          obj('c', 4, 4, { target: 'zzz' }),
          obj('d', 2, 2, { target: 'a', map: 'elsewhere' }),
        ],
      },
    });
    const errors = validateMaps({ m: broken }, ctx);
    expect(errors).toContain('m: door "a" lets the player out (up) onto a blocked tile 0,3');
    expect(errors).toContain('m: door "a" is not paired: "b" does not lead back to it');
    expect(errors).toContain('m: door "c" leads to unknown door "zzz" on m');
    expect(errors).toContain('m: door "d" leads to unknown map "elsewhere"');
  });

  it('pairs doors across maps', () => {
    const one = makeMap({ objects: { doors: [obj('out', 2, 2, { target: 'in', map: 'two' })] } });
    const two = makeMap({ objects: { doors: [obj('in', 2, 2, { target: 'out', map: 'one' })] } });
    expect(validateMaps({ one, two }, ctx)).toEqual([]);
  });
});

describe('map validator: Echo and anchors (guide Section 9)', () => {
  const full: ValidationContext = {
    npcIds: ['villager'],
    dialogueIds: ['hello', 'pin', 'lever'],
    objectKinds: ['bridge'],
    dialogueSets: { hello: [], pin: ['anchor.bridge'], lever: ['echo.lever', 'anchor.bridge'] },
  };
  const anchored = (extra: NonNullable<Parameters<typeof makeMap>[0]>['objects'] = {}) =>
    makeMap({
      objects: {
        puzzle_objects: [
          obj('pin', 3, 0, { era: 'echo', dialogue: 'pin' }),
          obj('bridge', 4, 4, { era: 'present', kind: 'bridge', walkable: true, if: 'anchor.bridge' }),
        ],
        anchors: [obj('a', 3, 0, { object: 'pin', flag: 'anchor.bridge' })],
        ...extra,
      },
    });

  it('accepts an anchor on a real Echo object whose dialogue sets its flag, read in the present', () => {
    expect(validateMaps({ m: anchored() }, full)).toEqual([]);
  });

  it('rejects anchors that name no object, a present object, or the wrong flag', () => {
    const errors = validateMaps(
      {
        m: anchored({
          puzzle_objects: [obj('pin', 3, 0, { era: 'present', dialogue: 'hello' }), obj('b', 4, 4, { walkable: true, if: 'anchor.bridge' })],
          anchors: [obj('a', 3, 0, { object: 'pin', flag: 'anchor.bridge' }), obj('b2', 1, 1, { object: 'ghost', flag: 'bridge' })],
        }),
      },
      full,
    );
    expect(errors).toContain('m: anchor "a" object "pin" must be in the echo (it is present)');
    expect(errors).toContain('m: anchor "a": dialogue "hello" never sets "anchor.bridge"');
    expect(errors).toContain('m: anchor "b2" names unknown puzzle object "ghost"');
    expect(errors).toContain('m: anchor "b2" flag "bridge" must start with "anchor."');
  });

  it('rejects an anchor that changes nothing in the present, and non-anchors that set anchor flags', () => {
    const errors = validateMaps(
      {
        m: anchored({
          puzzle_objects: [obj('pin', 3, 0, { era: 'echo', dialogue: 'pin' }), obj('lever', 2, 0, { era: 'echo', dialogue: 'lever' })],
        }),
      },
      full,
    );
    expect(errors).toContain('m: anchor "a" flag "anchor.bridge" changes nothing in the present');
    expect(errors).toContain('m: puzzle object "lever" is not an anchor but its dialogue sets anchor.bridge');
  });

  it('keeps zones swappable: no NPC, door or solid object inside, and no present content reading echo flags', () => {
    const errors = validateMap(
      'm',
      makeMap({
        objects: {
          echo_zones: [obj('z', 0, 0, { onEcho: 'nope' }, 3, 3)],
          npcs: [obj('n', 1, 1, { npc: 'villager', if: 'echo.lever' })],
          doors: [obj('d', 2, 2, { target: 'd' })],
          spawns: [obj('start', 4, 4)],
          puzzle_objects: [obj('wall', 0, 2, { solid: true }), obj('x', 4, 0, { kind: 'lava', dialogue: 'zzz' }), obj('y', 4, 1, {})],
        },
      }),
      full,
    );
    expect(errors).toContain('m: npc "villager" stands inside echo zone "z"');
    expect(errors).toContain('m: door "d" is inside echo zone "z"');
    expect(errors).toContain('m: solid puzzle object "wall" overlaps echo zone "z"');
    expect(errors).toContain('m: echo zone "z" plays unknown dialogue "nope"');
    expect(errors).toContain('m: npc "villager" is in the present but reads an echo flag');
    expect(errors).toContain('m: puzzle object "x" draws unknown tile "lava"');
    expect(errors).toContain('m: puzzle object "x" plays unknown dialogue "zzz"');
    expect(errors).toContain('m: puzzle object "y" does nothing');
  });

  it('checks condition text, eras and on-enter triggers', () => {
    const errors = validateMap(
      'm',
      makeMap({
        objects: {
          npcs: [obj('n', 1, 1, { npc: 'villager', if: 'a,,b', era: 'yesterday' })],
          triggers: [obj('t', 2, 2, { dialogue: 'hello', onEnter: true })],
        },
      }),
      full,
    );
    expect(errors.some((e) => e.includes('bad flag name'))).toBe(true);
    expect(errors).toContain('m: npcs object "n" has an unknown era "yesterday"');
    expect(errors).toContain('m: trigger "t" runs on entering the map, so it must be once-only');
  });
});

describe('buildings drawn as one large picture (owner, Oct 15: no walking over the Hall)', async () => {
  const { OBJECT_ART } = await import('../src/assets.pixels.ts');
  const { loadMaps } = await import('../tools/sim-setup.ts');
  const { isOpen } = await import('../src/engine/world.ts');
  const { FlagStore } = await import('../src/engine/flags.ts');
  const maps = loadMaps();
  const flags = new FlagStore();

  it('no large drawing is walkable (that would open every tile under it)', () => {
    for (const map of Object.values(maps)) {
      for (const o of map.objects) if (o.kind && OBJECT_ART[o.kind]) expect(o.walkable, `${map.id}/${o.id}`).toBe(false);
    }
  });

  it('the Hall of the Accord and the Iron Market block every tile under them but the door (two tiles wide)', () => {
    for (const [mapId, id] of [['zetwal-square', 'hall_of_accord'], ['zetwal-market', 'iron_market_hall']] as const) {
      const map = maps[mapId]!;
      const o = map.objects.find((x) => x.id === id)!;
      for (let y = o.area.y; y < o.area.y + o.area.height; y++) {
        for (let x = o.area.x; x < o.area.x + o.area.width; x++) {
          const door = map.doors.some((d) => d.tiles.some((t) => t.x === x && t.y === y));
          expect(isOpen(map, 'present', { x, y }, flags), `${mapId} ${x},${y}`).toBe(door);
        }
      }
    }
  });
});
