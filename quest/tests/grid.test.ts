import { describe, expect, it } from 'vitest';
import {
  canSwapEra,
  combine,
  components,
  facingTiles,
  facingToward,
  spriteFacing,
  doorArrival,
  doorAt,
  findSpawn,
  inEchoZone,
  isWalkable,
  opposite,
  stepFrom,
  triggerAt,
  tryMove,
} from '../src/engine/grid.ts';
import { collisionLayerFor, parseMap, visibleLayersFor } from '../src/engine/tiledMap.ts';
import { makeMap, obj } from './helpers.ts';

const map = parseMap(
  't',
  makeMap({
    present: ['.....', '.#...', '.....', '..#..', '.....'],
    echo: ['.....', '.....', '.....', '#####', '.....'],
    objects: {
      npcs: [obj('n', 4, 4, { npc: 'villager', facing: 'left' })],
      doors: [obj('d1', 0, 4, { target: 'd2', exit: 'up' }), obj('d2', 4, 0, { target: 'd1', exit: 'down' })],
      triggers: [obj('t', 2, 2, { dialogue: 'x', flag: 'f', once: true }, 2, 1)],
      spawns: [obj('start', 2, 0, { facing: 'right' })],
      echo_zones: [obj('z', 0, 2, {}, 2, 2)],
    },
  }),
);

describe('grid movement', () => {
  it('steps one tile in each direction', () => {
    expect(stepFrom({ x: 2, y: 2 }, 'up')).toEqual({ x: 2, y: 1 });
    expect(stepFrom({ x: 2, y: 2 }, 'down')).toEqual({ x: 2, y: 3 });
    expect(stepFrom({ x: 2, y: 2 }, 'left')).toEqual({ x: 1, y: 2 });
    expect(stepFrom({ x: 2, y: 2 }, 'right')).toEqual({ x: 3, y: 2 });
    expect(opposite('left')).toBe('right');
    expect(opposite('up')).toBe('down');
  });

  it('moves onto open tiles', () => {
    expect(tryMove(map, 'present', { x: 0, y: 0 }, 'right')).toEqual({ moved: true, to: { x: 1, y: 0 } });
  });

  it('is blocked by the collision layer of the current era', () => {
    expect(tryMove(map, 'present', { x: 1, y: 0 }, 'down')).toEqual({ moved: false, reason: 'collision' });
    // The same tile is open in the echo.
    expect(tryMove(map, 'echo', { x: 1, y: 0 }, 'down')).toEqual({ moved: true, to: { x: 1, y: 1 } });
    expect(isWalkable(map, 'echo', { x: 0, y: 3 })).toBe(false);
    expect(isWalkable(map, 'present', { x: 0, y: 3 })).toBe(true);
  });

  it('is blocked by the map edge', () => {
    expect(tryMove(map, 'present', { x: 0, y: 0 }, 'up')).toEqual({ moved: false, reason: 'bounds' });
    expect(tryMove(map, 'present', { x: 4, y: 4 }, 'right')).toEqual({ moved: false, reason: 'bounds' });
  });

  it('is blocked by occupied tiles (NPCs)', () => {
    const occupied = (p: { x: number; y: number }) => p.x === 4 && p.y === 4;
    expect(tryMove(map, 'present', { x: 3, y: 4 }, 'right', occupied)).toEqual({ moved: false, reason: 'occupied' });
  });
});

describe('map objects', () => {
  it('parses NPCs, spawns and doors', () => {
    expect(map.npcs[0]).toMatchObject({ npc: 'villager', pos: { x: 4, y: 4 }, facing: 'left' });
    expect(findSpawn(map, 'start')).toMatchObject({ pos: { x: 2, y: 0 }, facing: 'right', era: 'present' });
    expect(doorAt(map, { x: 0, y: 4 })?.target).toBe('d2');
    expect(doorAt(map, { x: 1, y: 4 })).toBeUndefined();
  });

  it('places the player one step out of the arrival door', () => {
    const d2 = map.doors.find((d) => d.id === 'd2')!;
    expect(doorArrival(d2)).toEqual({ pos: { x: 4, y: 1 }, facing: 'down' });
  });

  it('finds triggers across their whole area', () => {
    expect(triggerAt(map, { x: 2, y: 2 })?.id).toBe('t');
    expect(triggerAt(map, { x: 3, y: 2 })?.id).toBe('t');
    expect(triggerAt(map, { x: 4, y: 2 })).toBeUndefined();
    expect(map.triggers[0]).toMatchObject({ dialogue: 'x', flag: 'f', once: true });
  });

  it('knows echo zones and the swap rule (open in the other era)', () => {
    expect(inEchoZone(map, { x: 1, y: 2 })).toBe(true);
    expect(inEchoZone(map, { x: 2, y: 2 })).toBe(false);
    expect(canSwapEra(map, 'present', { x: 1, y: 2 })).toBe(true);
    // (0,3) is inside the zone but blocked in the echo.
    expect(canSwapEra(map, 'present', { x: 0, y: 3 })).toBe(false);
    expect(canSwapEra(map, 'present', { x: 3, y: 0 })).toBe(false);
  });

  it('chooses the layer set for each era', () => {
    expect(visibleLayersFor('present')).toEqual(['ground_present', 'deco_present']);
    expect(visibleLayersFor('echo')).toEqual(['ground_echo', 'deco_echo']);
    expect(collisionLayerFor('echo')).toBe('collide_echo');
  });
});

describe('diagonal steps (8-way movement)', () => {
  // . . . . .
  // . # . . .
  // . . . . .
  // . . # . .
  // . . . . .
  it('steps diagonally onto an open tile when both straight neighbours are open', () => {
    expect(stepFrom({ x: 2, y: 2 }, 'up-right')).toEqual({ x: 3, y: 1 });
    expect(stepFrom({ x: 2, y: 2 }, 'down-left')).toEqual({ x: 1, y: 3 });
    expect(tryMove(map, 'present', { x: 2, y: 2 }, 'up-right')).toEqual({ moved: true, to: { x: 3, y: 1 } });
    expect(tryMove(map, 'present', { x: 3, y: 2 }, 'down-right')).toEqual({ moved: true, to: { x: 4, y: 3 } });
  });

  it('refuses to cut a wall corner (one straight neighbour blocked)', () => {
    // From 2,2 up-left to 1,1 is the wall itself; from 2,1 down-left to 1,2 passes the wall at 1,1.
    expect(tryMove(map, 'present', { x: 2, y: 2 }, 'up-left')).toEqual({ moved: false, reason: 'collision' });
    expect(tryMove(map, 'present', { x: 2, y: 1 }, 'down-left')).toEqual({ moved: false, reason: 'corner' });
    expect(tryMove(map, 'present', { x: 1, y: 2 }, 'up-right')).toEqual({ moved: false, reason: 'corner' });
    expect(tryMove(map, 'present', { x: 1, y: 3 }, 'up-right')).toEqual({ moved: false, reason: 'corner' });
    expect(tryMove(map, 'present', { x: 3, y: 4 }, 'up-left')).toEqual({ moved: false, reason: 'collision' });
  });

  it('refuses to squeeze between two blocked tiles', () => {
    const squeeze = parseMap('s', makeMap({ present: ['...', '.#.', '..#', '...'] }));
    // From 1,2 to 2,1: the straight neighbours 1,1 and 2,2 are both walls.
    expect(tryMove(squeeze, 'present', { x: 1, y: 2 }, 'up-right')).toEqual({ moved: false, reason: 'corner' });
    expect(tryMove(squeeze, 'present', { x: 2, y: 1 }, 'down-left')).toEqual({ moved: false, reason: 'corner' });
  });

  it('refuses to pass a character standing on a straight neighbour, and stops at the map edge', () => {
    const occupied = (p: { x: number; y: number }) => p.x === 3 && p.y === 2;
    expect(tryMove(map, 'present', { x: 3, y: 1 }, 'down-right', occupied)).toEqual({ moved: false, reason: 'corner' });
    expect(tryMove(map, 'present', { x: 0, y: 0 }, 'up-left')).toEqual({ moved: false, reason: 'bounds' });
    expect(tryMove(map, 'present', { x: 4, y: 2 }, 'down-right')).toEqual({ moved: false, reason: 'bounds' });
  });

  it('uses the era’s own collision for the corner rule', () => {
    // In the echo row 3 is a wall: 1,2 -> 2,3 is blocked; in the present 2,3 is the wall instead.
    expect(tryMove(map, 'echo', { x: 2, y: 2 }, 'down-right')).toEqual({ moved: false, reason: 'collision' });
    expect(tryMove(map, 'echo', { x: 1, y: 1 }, 'down-right')).toEqual({ moved: true, to: { x: 2, y: 2 } });
  });

  it('maps eight directions onto four sprite facings and two straight parts', () => {
    expect(spriteFacing('up-right')).toBe('right');
    expect(spriteFacing('down-left')).toBe('left');
    expect(spriteFacing('up')).toBe('up');
    expect(components('up-right')).toEqual(['right', 'up']);
    expect(components('down-left')).toEqual(['left', 'down']);
    expect(combine('left', 'up')).toBe('up-left');
    expect(combine(null, 'down')).toBe('down');
    expect(combine(null, null)).toBeNull();
    expect(opposite('up-left')).toBe('down-right');
  });

  it('faces the diagonal tile first, then the sprite’s side', () => {
    expect(facingTiles({ x: 2, y: 2 }, 'up')).toEqual([{ x: 2, y: 1 }]);
    expect(facingTiles({ x: 2, y: 2 }, 'up-right')).toEqual([{ x: 3, y: 1 }, { x: 3, y: 2 }]);
    expect(facingToward({ x: 0, y: 0 }, { x: 1, y: 1 })).toBe('right');
    expect(facingToward({ x: 0, y: 0 }, { x: 0, y: -2 })).toBe('up');
    expect(facingToward({ x: 5, y: 5 }, { x: 4, y: 5 })).toBe('left');
  });
});
