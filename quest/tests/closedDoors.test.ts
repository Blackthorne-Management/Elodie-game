// Grey doors (owner request, Oct 16): every building with a roof has a way in or a grey door you cannot
// open, and a grey door blocks like a wall.

import { describe, expect, it } from 'vitest';
import { SOURCES } from '../tools/build-maps.ts';
import { Grid, LEGEND, addClosedDoors } from '../tools/maps/painter.ts';

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
