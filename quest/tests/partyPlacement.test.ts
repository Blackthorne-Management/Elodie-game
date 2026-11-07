// Where the party stands when it stops, and who is brought on to speak (playtests, Nov 1): engine/partyPlacement.ts.

import { describe, expect, it } from 'vitest';
import { WALKING_COMPANIONS } from '../src/config.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { dialogueCameraY, hidesEachOther, mustBringOn, settleSpots } from '../src/engine/partyPlacement.ts';
import type { Dir, Pos } from '../src/engine/types.ts';
import { isOpen } from '../src/engine/world.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const maps = loadMaps();
const field = (w: number, h: number, blocked: (p: Pos) => boolean = () => false) => (p: Pos) => p.x >= 0 && p.y >= 0 && p.x < w && p.y < h && !blocked(p);

/** Nobody in the party hides anybody else, and every spot is distinct. */
function expectAllSeen(player: Pos, spots: readonly Pos[]): void {
  const all = [player, ...spots];
  for (const [i, a] of all.entries()) {
    for (const b of all.slice(i + 1)) {
      expect(a.x === b.x && a.y === b.y, `${JSON.stringify(a)} twice`).toBe(false);
      expect(hidesEachOther(a, b), `${JSON.stringify(a)} hides ${JSON.stringify(b)}`).toBe(false);
    }
  }
}

describe('the party settles beside Gianna when it stops', () => {
  it('never stands in her column, just in front of or behind her, whichever way she faces', () => {
    for (const facing of ['up', 'down', 'left', 'right'] as Dir[]) {
      const player = { x: 10, y: 10 };
      const followers = [{ x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }];
      const spots = settleSpots({ player, facing, followers, open: field(20, 20), width: 20, height: 20 });
      expect(spots).toHaveLength(3);
      expectAllSeen(player, spots);
      // Anissa stands right beside her.
      expect(Math.max(Math.abs(spots[0]!.x - 10), Math.abs(spots[0]!.y - 10))).toBe(1);
    }
  });

  it('keeps off walls, doors and people, and off tiles only reachable round a wall', () => {
    // A wall down column 11 (the tiles to the right are near but behind it); someone stands at 9,10.
    const open = field(20, 20, (p) => p.x === 11 || (p.x === 9 && p.y === 10));
    const spots = settleSpots({ player: { x: 10, y: 10 }, facing: 'up', followers: [{ x: 10, y: 11 }, { x: 10, y: 12 }], open, width: 20, height: 20 });
    for (const s of spots) {
      expect(open(s)).toBe(true);
      expect(s.x).toBeLessThan(11);
    }
    expectAllSeen({ x: 10, y: 10 }, spots);
  });

  it('keeps off the map edge and the screen edge (Ordvik: a head on the top row was cut off)', () => {
    const spots = settleSpots({
      player: { x: 5, y: 1 },
      facing: 'down',
      followers: [{ x: 5, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 0 }],
      open: field(12, 12),
      width: 12,
      height: 12,
      visible: (p) => p.y >= 1,
    });
    for (const s of spots) expect(s.y).toBeGreaterThanOrEqual(1);
    expectAllSeen({ x: 5, y: 1 }, spots);
  });

  it('stays put with nowhere open', () => {
    expect(settleSpots({ player: { x: 1, y: 1 }, facing: 'up', followers: [{ x: 1, y: 2 }], open: () => false, width: 3, height: 3 })).toEqual([{ x: 1, y: 2 }]);
  });

  it('settles the four walkers apart on the maps the playtests caught (the Assize, Ordvik, the Concourse)', () => {
    const cases: { map: string; at: Pos; facing: Dir }[] = [
      { map: 'aldermoor-keep', at: { x: 7, y: 24 }, facing: 'up' },
      { map: 'skarragol-fair', at: { x: 42, y: 3 }, facing: 'down' },
      { map: 'seat-concourse', at: { x: 46, y: 16 }, facing: 'left' },
      { map: 'zetwal-temple', at: { x: 14, y: 4 }, facing: 'up' },
    ];
    for (const c of cases) {
      const map = maps[c.map]!;
      const flags = new FlagStore();
      const doors = map.doors.flatMap((d) => d.tiles);
      const open = (p: Pos) => isOpen(map, 'present', p, flags) && !doors.some((t) => t.x === p.x && t.y === p.y);
      const followers = [1, 2, 3].map((k) => ({ x: c.at.x, y: c.at.y + (c.facing === 'down' ? -k : k) }));
      const spots = settleSpots({ player: c.at, facing: c.facing, followers, open, width: map.width, height: map.height });
      for (const s of spots) {
        expect(open(s), `${c.map} ${JSON.stringify(s)}`).toBe(true);
        expect(s.y, c.map).toBeGreaterThan(0);
      }
      expectAllSeen(c.at, spots);
    }
  });
});

describe('against a wall the party gathers in front of her, not in a queue (review Nov 7, finding 10)', () => {
  /** How many of the spots are in Gianna's own column (above or below her: a queue when she faces left or right). */
  const inColumn = (player: Pos, spots: readonly Pos[]) => spots.filter((s) => s.x === player.x).length;

  it('her back to a wall, facing away from it: both diagonals in front of her are taken, at most one stands in her column', () => {
    // A wall down column 11; Gianna at 10,10 faces left, away from it.
    const open = field(20, 20, (p) => p.x >= 11);
    const player = { x: 10, y: 10 };
    const spots = settleSpots({ player, facing: 'left', followers: [{ x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }], open, width: 20, height: 20 });
    for (const y of [9, 11]) expect(spots.some((s) => s.x === 9 && s.y === y), `9,${y}`).toBe(true);
    expect(inColumn(player, spots)).toBeLessThanOrEqual(1);
    for (const s of spots) expect(open(s)).toBe(true);
    expectAllSeen(player, spots);
  });

  it('at the map edge, facing into the map: the same', () => {
    const player = { x: 1, y: 10 };
    const spots = settleSpots({ player, facing: 'right', followers: [{ x: 1, y: 11 }, { x: 1, y: 12 }, { x: 1, y: 13 }], open: field(20, 20), width: 20, height: 20 });
    for (const y of [9, 11]) expect(spots.some((s) => s.x === 2 && s.y === y), `2,${y}`).toBe(true);
    expect(inColumn(player, spots)).toBeLessThanOrEqual(1);
    for (const s of spots) expect(s.x).toBeGreaterThan(0);
    expectAllSeen(player, spots);
  });

  it('never on the tile she would step onto, and on open ground nothing changes: beside or behind her first', () => {
    const player = { x: 1, y: 10 };
    const spots = settleSpots({ player, facing: 'right', followers: [{ x: 1, y: 11 }, { x: 1, y: 12 }, { x: 1, y: 13 }], open: field(20, 20), width: 20, height: 20 });
    expect(spots.some((s) => s.x === 2 && s.y === 10)).toBe(false);
    for (const facing of ['left', 'right'] as Dir[]) {
      const open = settleSpots({ player: { x: 10, y: 10 }, facing, followers: [{ x: 10, y: 11 }, { x: 10, y: 12 }], open: field(20, 20), width: 20, height: 20 });
      const ahead = facing === 'left' ? -1 : 1;
      for (const s of open) expect((s.x - 10) * ahead).toBeLessThanOrEqual(0);
    }
  });

  it('the Concourse and the war village, where the review saw the queue: no more than one in her column, nobody hidden', () => {
    const cases: { map: string; at: Pos; facing: Dir }[] = [
      { map: 'seat-concourse', at: { x: 46, y: 16 }, facing: 'left' },
      { map: 'xaragua-village', at: { x: 1, y: 15 }, facing: 'right' },
    ];
    for (const c of cases) {
      const map = maps[c.map]!;
      const flags = new FlagStore();
      const doors = map.doors.flatMap((d) => d.tiles);
      const open = (p: Pos) => isOpen(map, 'present', p, flags) && !doors.some((t) => t.x === p.x && t.y === p.y);
      const followers = [1, 2, 3].map((k) => ({ x: c.at.x, y: c.at.y + k }));
      const spots = settleSpots({ player: c.at, facing: c.facing, followers, open, width: map.width, height: map.height });
      for (const s of spots) expect(open(s), `${c.map} ${JSON.stringify(s)}`).toBe(true);
      expect(inColumn(c.at, spots), c.map).toBeLessThanOrEqual(1);
      expectAllSeen(c.at, spots);
    }
  });
});

describe('a companion who speaks is on the map', () => {
  const party = { companions: WALKING_COMPANIONS, members: ['gianna', 'anissa', 'azzy', 'yari', 'samira', 'edmund'], onMap: new Set(['yari']) };

  it('brings on a companion in the party who speaks but does not walk', () => {
    expect(mustBringOn({ speaker: 'samira', text: 'Nine of us.', staged: false }, party)).toEqual(['samira']);
  });

  it('leaves the walker, Anissa and Azzy, those not in the party, and anyone already on stage', () => {
    expect(mustBringOn({ speaker: 'yari', text: '', staged: false }, party)).toEqual([]);
    expect(mustBringOn({ speaker: 'anissa', text: '', staged: false }, party)).toEqual([]);
    expect(mustBringOn({ speaker: 'azzy', text: '', staged: false }, party)).toEqual([]);
    expect(mustBringOn({ speaker: 'haru', text: '', staged: false }, party)).toEqual([]);
    expect(mustBringOn({ speaker: 'samira', text: '', staged: false }, { ...party, onMap: new Set(['yari', 'samira']) })).toEqual([]);
  });

  it('brings on a companion the narration names, in a scene with no stage directions', () => {
    const names = { samira: 'Samira', edmund: 'Edmund', yari: 'Yari' };
    expect(mustBringOn({ speaker: null, text: 'Edmund unrolls the map.', staged: false }, { ...party, names })).toEqual(['edmund']);
    expect(mustBringOn({ speaker: null, text: 'Edmund unrolls the map.', staged: true }, { ...party, names })).toEqual([]);
    expect(mustBringOn({ speaker: null, text: 'Yari laughs.', staged: false }, { ...party, names })).toEqual([]);
  });
});

describe('the camera keeps the speakers above the dialogue box', () => {
  it('moves down until the lowest stands above the box', () => {
    // The box's top is at 107 on a 180-high screen; someone's feet at world 300 with the camera at 180 show at 120.
    expect(dialogueCameraY(180, [300, 290], 107, 32)).toBe(193);
  });
  it('leaves it alone when everyone is above the box', () => {
    expect(dialogueCameraY(180, [260], 107, 32)).toBe(180);
  });
  it('never pushes the highest head off the top', () => {
    expect(dialogueCameraY(180, [320, 200], 107, 32)).toBe(180);
    expect(dialogueCameraY(180, [320, 230], 107, 32)).toBe(198);
  });
});
