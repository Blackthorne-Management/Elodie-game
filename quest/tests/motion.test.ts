// Smooth movement (src/engine/motion.ts): constant pixel speed, steps that chain without a pause at
// any frame rate, and the walk cycle by distance.

import { describe, expect, it } from 'vitest';
import { RUN_TILES_PER_SECOND, STEP_BUFFER_MS, TILE_SIZE, WALK_CYCLE_PX, WALK_TILES_PER_SECOND } from '../src/config.ts';
import { Mover, restDistance, speedPx, stepLength, stepMs, tileFoot, walkFrame } from '../src/engine/motion.ts';
import type { Pos } from '../src/engine/types.ts';

const WALK = speedPx(false);
const RUN = speedPx(true);

/** Hold a direction: every arrival asks for the next tile `dx, dy` on, for `tiles` tiles in all. */
function holding(dx: number, dy: number, tiles: number): { next: (p: Pos) => Pos | null; arrived: Pos[] } {
  const arrived: Pos[] = [];
  return {
    arrived,
    next: (p) => {
      arrived.push(p);
      return arrived.length < tiles ? { x: p.x + dx, y: p.y + dy } : null;
    },
  };
}

/** A small deterministic random sequence (tests only). */
function lcg(seed: number): () => number {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe('speeds and step timing', () => {
  it('walks and runs at the configured tiles per second, in pixels', () => {
    expect(WALK).toBe(WALK_TILES_PER_SECOND * TILE_SIZE);
    expect(RUN).toBe(RUN_TILES_PER_SECOND * TILE_SIZE);
    expect(WALK_TILES_PER_SECOND).toBeGreaterThanOrEqual(4);
    expect(WALK_TILES_PER_SECOND).toBeLessThanOrEqual(5);
    expect(RUN_TILES_PER_SECOND).toBe(8);
  });

  it('a diagonal step is sqrt 2 tiles long and takes about 1.41 times as long', () => {
    const o = { x: 3, y: 3 };
    expect(stepLength(o, { x: 4, y: 3 })).toBe(TILE_SIZE);
    expect(stepLength(o, { x: 4, y: 2 })).toBeCloseTo(TILE_SIZE * Math.SQRT2, 9);
    expect(stepMs(o, { x: 4, y: 3 }, WALK)).toBeCloseTo((1000 * TILE_SIZE) / WALK, 9);
    expect(stepMs(o, { x: 2, y: 4 }, WALK) / stepMs(o, { x: 2, y: 3 }, WALK)).toBeCloseTo(Math.SQRT2, 9);
  });

  it('a character stands on the bottom centre of the tile', () => {
    expect(tileFoot({ x: 2, y: 5 })).toEqual({ x: 2 * TILE_SIZE + TILE_SIZE / 2, y: 6 * TILE_SIZE });
  });
});

describe('the walk cycle, by distance', () => {
  it('goes step A, stand, step B, stand, one full cycle per two tiles', () => {
    expect(WALK_CYCLE_PX).toBe(2 * TILE_SIZE);
    const q = WALK_CYCLE_PX / 4;
    const frames = Array.from({ length: 2 * WALK_CYCLE_PX }, (_, d) => walkFrame(d));
    for (let d = 0; d < frames.length; d++) expect(frames[d], `at ${d} px`).toBe([1, 0, 2, 0][Math.floor(d / q) % 4]);
  });

  it('does not depend on time: the same distance gives the same frame at walk or run', () => {
    for (const d of [0, 5, 9, 17, 25, 33, 70]) expect(walkFrame(d)).toBe(walkFrame(d, WALK_CYCLE_PX));
  });

  it('rests on a half cycle so the next walk starts on the other foot', () => {
    expect(restDistance(0)).toBe(0);
    expect(restDistance(16)).toBe(16);
    expect(restDistance(16.0000001)).toBe(16);
    expect(restDistance(17)).toBe(32);
    expect(restDistance(22.6)).toBe(32);
    expect(walkFrame(restDistance(16))).toBe(2);
    expect(walkFrame(restDistance(32))).toBe(1);
  });
});

describe('Mover', () => {
  it('a tap walks exactly one tile and stops on it, standing', () => {
    const m = new Mover();
    const h = holding(1, 0, 1);
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    expect(m.frame()).toBe(1);
    let t = 0;
    while (m.moving) {
      m.update(1000 / 60, WALK, h.next);
      t += 1000 / 60;
    }
    expect(h.arrived).toEqual([{ x: 1, y: 0 }]);
    expect(t).toBeGreaterThanOrEqual(stepMs({ x: 0, y: 0 }, { x: 1, y: 0 }, WALK) - 1e-6);
    expect(t).toBeLessThan(stepMs({ x: 0, y: 0 }, { x: 1, y: 0 }, WALK) + 1000 / 60);
    expect(m.point({ x: 1, y: 0 })).toEqual(tileFoot({ x: 1, y: 0 }));
    expect(m.frame()).toBe(0);
  });

  it('held at 60 Hz, moves the same distance every frame, straight through the tile edges', () => {
    const m = new Mover();
    const h = holding(1, 0, 8);
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    let last = m.point({ x: 0, y: 0 }).x;
    const per = WALK / 60;
    let frames = 0;
    while (m.moving) {
      m.update(1000 / 60, WALK, h.next);
      const x = m.point(h.arrived.at(-1) ?? { x: 0, y: 0 }).x;
      if (m.moving) expect(x - last, `frame ${frames}`).toBeCloseTo(per, 6);
      last = x;
      frames++;
    }
    expect(h.arrived.length).toBe(8);
    // Eight tiles take as long as 8 x 16 px at walking speed, to the frame.
    expect(frames).toBe(Math.ceil((8 * TILE_SIZE) / per - 1e-9));
  });

  it('at a variable frame rate, the distance walked is speed x time, whatever the deltas', () => {
    const rnd = lcg(7);
    const m = new Mover();
    const h = holding(0, 1, 1000);
    m.start({ x: 0, y: 0 }, { x: 0, y: 1 });
    let time = 0;
    let prevY = m.point({ x: 0, y: 0 }).y;
    for (let i = 0; i < 400; i++) {
      const dt = 4 + rnd() * 40; // 25 to 250 fps, jittering
      m.update(dt, WALK, h.next);
      time += dt;
      const y = m.point({ x: 0, y: 0 }).y;
      expect(y - prevY, `frame ${i}`).toBeCloseTo((WALK * dt) / 1000, 6);
      prevY = y;
    }
    expect(m.point({ x: 0, y: 0 }).y - tileFoot({ x: 0, y: 0 }).y).toBeCloseTo((WALK * time) / 1000, 4);
    expect(m.distance).toBeCloseTo((WALK * time) / 1000, 4);
  });

  it('the leftover of the arriving frame carries into the next step', () => {
    const m = new Mover();
    const h = holding(1, 0, 3);
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 }, 12);
    m.update((1000 * 10) / WALK, WALK, h.next); // 10 px: 4 to finish the step, 6 into the next
    expect(h.arrived).toEqual([{ x: 1, y: 0 }]);
    expect(m.glide).toMatchObject({ from: { x: 1, y: 0 }, to: { x: 2, y: 0 } });
    expect(m.glide!.travelled).toBeCloseTo(6, 9);
    expect(m.point({ x: 1, y: 0 }).x).toBeCloseTo(tileFoot({ x: 1, y: 0 }).x + 6, 9);
  });

  it('a diagonal step takes sqrt 2 times as long as a straight one at the same speed', () => {
    const time = (to: Pos) => {
      const m = new Mover();
      m.start({ x: 0, y: 0 }, to);
      let t = 0;
      while (m.moving) {
        m.update(1, WALK, () => null);
        t += 1;
      }
      return t;
    };
    expect(time({ x: 1, y: 1 }) / time({ x: 1, y: 0 })).toBeCloseTo(Math.SQRT2, 1);
  });

  it('switching to run mid-step keeps the position and speeds up from there', () => {
    const m = new Mover();
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    m.update(50, WALK, () => null);
    const at = m.glide!.travelled;
    m.update(25, RUN, () => null);
    expect(m.glide!.travelled - at).toBeCloseTo((RUN * 25) / 1000, 9);
  });

  it('the walk cycle carries on across tiles and settles on standing when it stops', () => {
    const m = new Mover();
    const h = holding(1, 0, 4);
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    const seen: number[] = [];
    while (m.moving) {
      seen.push(m.frame());
      m.update(1000 / 120, WALK, h.next);
    }
    // Collapse repeats: A, stand, B, stand, A, stand, B, stand over four tiles, no reset at the edges.
    const runs = seen.filter((f, i) => i === 0 || f !== seen[i - 1]);
    expect(runs).toEqual([1, 0, 2, 0, 1, 0, 2, 0]);
    expect(m.frame()).toBe(0);
    expect(m.distance).toBe(4 * TILE_SIZE);
  });

  it('buffers a press only in the last moments of a step', () => {
    const m = new Mover();
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    expect(m.inBufferWindow(WALK)).toBe(false);
    const ms = stepMs({ x: 0, y: 0 }, { x: 1, y: 0 }, WALK);
    m.update(ms - STEP_BUFFER_MS - 5, WALK, () => null);
    expect(m.inBufferWindow(WALK)).toBe(false);
    m.update(10, WALK, () => null);
    expect(m.inBufferWindow(WALK)).toBe(true);
    expect(new Mover().inBufferWindow(WALK)).toBe(false);
  });

  it('one very long frame lands on at most a few tiles, each one reported, and walks on from there', () => {
    const m = new Mover();
    const h = holding(1, 0, 100);
    m.start({ x: 0, y: 0 }, { x: 1, y: 0 });
    const reached = m.update(10_000, WALK, h.next);
    expect(reached.length).toBe(Mover.MAX_STEPS_PER_UPDATE);
    expect(h.arrived).toEqual(reached);
    expect(m.glide).toMatchObject({ from: reached.at(-1), travelled: 0 });
  });
});
