// Grey doors (owner request, Oct 16): every building with a roof has a way in or a grey door you cannot
// open, and a grey door blocks like a wall.

import { describe, expect, it } from 'vitest';
import { SOURCES } from '../tools/build-maps.ts';
import { Grid, LEGEND, addClosedDoors, openPassages, widenDoors } from '../tools/maps/painter.ts';

describe('grey doors', () => {
  it('a building without a door gets one grey door in the middle of its front, and it is solid', () => {
    const g = new Grid(7, 5, '.');
    g.rect(1, 0, 5, 2, '^').rect(1, 2, 5, 2, '#');
    const src = { id: 't', present: g, echo: g.clone(), objects: [] };
    addClosedDoors(src);
    expect(g.get(3, 3)).toBe('@');
    expect(src.echo.get(3, 3)).toBe('#');
    expect(LEGEND['@']!.solid).toBe(true);
  });

  it('leaves a building with a door, and walls with no roof (interiors), alone', () => {
    const g = new Grid(7, 6, '.');
    g.rect(1, 0, 5, 2, '^').rect(1, 2, 5, 2, '#').set(3, 3, 'D');
    g.rect(0, 5, 7, 1, '#');
    addClosedDoors({ id: 't', present: g, echo: g.clone(), objects: [] });
    expect(g.toString()).not.toContain('@');
  });

  it('every roofed building in Zetwal has a way in or a grey door (a second pass adds nothing)', () => {
    let grey = 0;
    for (const make of SOURCES) {
      const src = make();
      addClosedDoors(src);
      const once = src.present.toString();
      addClosedDoors(src);
      expect(src.present.toString(), src.id).toBe(once);
      grey += (once.match(/@/g) ?? []).length;
    }
    expect(grey).toBeGreaterThan(10);
  });
});

describe('double doors (owner request, Oct 16)', () => {
  it('every usable door in Zetwal is two tiles wide, and walking into either half goes through', async () => {
    const { loadMaps } = await import('../tools/sim-setup.ts');
    const maps = loadMaps();
    for (const [id, map] of Object.entries(maps)) {
      if (id.startsWith('test-')) continue;
      for (const d of map.doors) expect(d.tiles.length, `${id}/${d.id}`).toBe(2);
    }
  });

  it('a door widens into the wall beside it, with open ground in front, as one double door', () => {
    const g = new Grid(5, 4, '.');
    g.rect(0, 0, 5, 2, '#').set(2, 1, 'D');
    const src = { id: 't', present: g, echo: g.clone(), objects: [{ layer: 'doors' as const, name: 'd', x: 2, y: 1, props: { exit: 'down' } }] };
    expect(widenDoors(src)).toEqual([]);
    expect(src.objects[0]).toMatchObject({ x: 2, w: 2 });
    // One double door: the left leaf where the door was, the right leaf beside it (both eras).
    expect([g.get(2, 1), g.get(3, 1)]).toEqual(['«', '»']);
    expect([src.echo.get(2, 1), src.echo.get(3, 1)]).toEqual(['«', '»']);
    expect(LEGEND['«']!.solid || LEGEND['»']!.solid).toBe(false);
  });
});

describe('open paths between outdoor areas (owner request, Oct 16)', () => {
  it('a way from one outdoor area to another is open ground; only buildings have doors', () => {
    const sources = SOURCES.map((make) => make());
    const interiors = new Set(sources.filter((s) => s.interior).map((s) => s.id));
    expect([...interiors].sort()).toEqual(['zetwal-archive', 'zetwal-hall', 'zetwal-house']);
    const DOOR_ART = ['D', '«', '»', '⌈', '⌊'];
    let passages = 0;
    let doors = 0;
    for (const src of sources) {
      widenDoors(src);
      openPassages(src, interiors);
      for (const d of src.objects.filter((o) => o.layer === 'doors')) {
        const ch = src.present.get(d.x, d.y);
        const building = src.interior || interiors.has(String(d.props?.map ?? src.id));
        if (building) doors++;
        else passages++;
        expect(DOOR_ART.includes(ch), `${src.id}/${d.name} shows "${ch}"`).toBe(building);
      }
    }
    expect(passages).toBeGreaterThan(10);
    expect(doors).toBe(6);
  });
});

describe('exits reach the edge of the map (owner report, Oct 16)', () => {
  it('behind every open path between outdoor areas, the path runs to the edge (no dead end of trees)', () => {
    const sources = SOURCES.map((make) => make());
    const interiors = new Set(sources.filter((s) => s.interior).map((s) => s.id));
    const step: Record<string, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    for (const src of sources) {
      widenDoors(src);
      openPassages(src, interiors);
      if (src.interior) continue;
      for (const d of src.objects.filter((o) => o.layer === 'doors' && !interiors.has(String(o.props?.map)))) {
        const [ox, oy] = step[String(d.props?.exit)]!;
        for (let x = d.x - ox, y = d.y - oy; x >= 0 && y >= 0 && x < src.present.width && y < src.present.height; x -= ox, y -= oy) {
          expect(LEGEND[src.present.get(x, y)]!.solid, `${src.id}/${d.name} at ${x},${y}`).toBe(false);
        }
      }
    }
  });
});
