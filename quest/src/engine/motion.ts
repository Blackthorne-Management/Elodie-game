// Smooth movement on the grid. The logic (game.ts) moves the player one whole tile at a time; this
// module turns those steps into continuous pixel motion at a constant speed and picks the walk frame
// from the distance walked. Pure TypeScript (no Phaser): FieldScene drives it with the frame's delta
// time, and tests/motion.test.ts runs it at fixed and variable frame rates.

import { RUN_TILES_PER_SECOND, STEP_BUFFER_MS, TILE_SIZE, WALK_CYCLE_PX, WALK_TILES_PER_SECOND } from '../config.ts';
import type { Pos } from './types.ts';

/** Walking or running speed, in pixels per second. */
export function speedPx(run: boolean): number {
  return (run ? RUN_TILES_PER_SECOND : WALK_TILES_PER_SECOND) * TILE_SIZE;
}

/** Length of a step in pixels: one tile straight, sqrt 2 tiles diagonally (0 for no step). */
export function stepLength(from: Pos, to: Pos): number {
  return Math.hypot(to.x - from.x, to.y - from.y) * TILE_SIZE;
}

/** How long a step takes at a speed (pixels per second), in ms. */
export function stepMs(from: Pos, to: Pos, speed: number): number {
  return (stepLength(from, to) / speed) * 1000;
}

/** Where a character stands on a tile: the bottom centre of the tile (sprites hang from their feet). */
export function tileFoot(pos: Pos): { x: number; y: number } {
  return { x: pos.x * TILE_SIZE + TILE_SIZE / 2, y: pos.y * TILE_SIZE + TILE_SIZE };
}

/** A walk frame: 0 standing, 1 step A, 2 step B. */
export type WalkFrame = 0 | 1 | 2;

const CYCLE: readonly WalkFrame[] = [1, 0, 2, 0];

/**
 * The walk frame after walking `distance` pixels: step A, stand, step B, stand, each a quarter of
 * `cycle` pixels. Distance 0 is step A, so the first frame of a walk already moves a foot.
 */
export function walkFrame(distance: number, cycle = WALK_CYCLE_PX): WalkFrame {
  const quarter = cycle / 4;
  const i = Math.floor(Math.max(0, distance) / quarter + 1e-9) % 4;
  return CYCLE[i]!;
}

/**
 * Where to leave a walker's distance when it stops: rounded up to the next half cycle, so the next
 * walk starts on a step frame, with the other foot from the one that last stepped.
 */
export function restDistance(distance: number, cycle = WALK_CYCLE_PX): number {
  const half = cycle / 2;
  // (A hair over a half cycle is float drift from summing frames, not a new quarter.)
  return Math.max(0, Math.ceil(distance / half - 1e-6)) * half;
}

/** One step being walked, in pixels along it. */
export interface Glide {
  from: Pos;
  to: Pos;
  length: number;
  travelled: number;
}

/**
 * Walks one character along its steps. `update` moves it by speed x delta; when a step ends it asks
 * `next` (given the tile just reached) for the next tile, and the distance left over from this frame
 * carries straight into that step, so held movement never pauses at a tile edge, at any frame rate.
 * `next` returns null to stop there.
 */
export class Mover {
  glide: Glide | null = null;
  /** Pixels walked since the walk cycle was last reset (drives walkFrame). */
  distance = 0;
  /** Most steps one update may finish (a long frame after a hitch); the rest of its time is dropped. */
  static readonly MAX_STEPS_PER_UPDATE = 4;

  get moving(): boolean {
    return this.glide !== null;
  }

  /** Start a step from `from` to `to`, `carry` pixels already walked along it. */
  start(from: Pos, to: Pos, carry = 0): void {
    const length = stepLength(from, to);
    this.glide = { from: { ...from }, to: { ...to }, length, travelled: Math.min(Math.max(0, carry), length) };
    this.distance += this.glide.travelled;
  }

  /** Progress through the current step, 0..1 (1 when not moving). */
  get t(): number {
    const g = this.glide;
    return g && g.length > 0 ? g.travelled / g.length : 1;
  }

  /** Pixels left in the current step. */
  get remaining(): number {
    return this.glide ? this.glide.length - this.glide.travelled : 0;
  }

  /** Whether a press now should be buffered: the step ends within STEP_BUFFER_MS at this speed. */
  inBufferWindow(speed: number, windowMs = STEP_BUFFER_MS): boolean {
    return this.glide !== null && (this.remaining / speed) * 1000 <= windowMs;
  }

  /** Move by `deltaMs` at `speed` px/s. Returns the tiles reached this frame, in order. */
  update(deltaMs: number, speed: number, next: (reached: Pos) => Pos | null): Pos[] {
    const reached: Pos[] = [];
    let budget = (Math.max(0, deltaMs) / 1000) * speed;
    while (this.glide && budget > 0) {
      const g = this.glide;
      const use = Math.min(budget, g.length - g.travelled);
      g.travelled += use;
      this.distance += use;
      budget -= use;
      if (g.travelled < g.length) break;
      // Arrived: the rest of this frame's distance goes into the next step, if there is one.
      this.glide = null;
      reached.push(g.to);
      const to = next(g.to);
      if (!to) {
        this.stop();
        break;
      }
      this.glide = { from: { ...g.to }, to: { ...to }, length: stepLength(g.to, to), travelled: 0 };
      // After a long hitch, drop the rest rather than skip across the map in one frame.
      if (reached.length >= Mover.MAX_STEPS_PER_UPDATE) break;
    }
    return reached;
  }

  /** Stop: the walk cycle waits on a step frame for the next walk. */
  stop(): void {
    this.glide = null;
    this.distance = restDistance(this.distance);
  }

  /** The exact position in pixels (feet), between the tiles of the current step, or at `at`. */
  point(at: Pos): { x: number; y: number } {
    const g = this.glide;
    if (!g) return tileFoot(at);
    const a = tileFoot(g.from);
    const b = tileFoot(g.to);
    const t = this.t;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  /** The walk frame to show now (standing when not moving). */
  frame(): WalkFrame {
    return this.glide ? walkFrame(this.distance) : 0;
  }
}
