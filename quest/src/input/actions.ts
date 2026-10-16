// The one input abstraction (guide Section 9). Keyboard, gamepad and touch are sources; the game only
// asks this manager about actions: move (a direction), confirm, cancel, echo, menu and run.
// Pure TypeScript (no DOM), so it is unit tested; the sources in this folder touch the browser.

import { combine, components, isDiagonal } from '../engine/grid.ts';
import type { Dir, Dir8 } from '../engine/types.ts';

export type Button = Dir | 'confirm' | 'cancel' | 'echo' | 'menu' | 'run' | 'ask';
export const BUTTONS: readonly Button[] = ['up', 'down', 'left', 'right', 'confirm', 'cancel', 'echo', 'menu', 'run', 'ask'];
const DIR_BUTTONS: readonly Dir[] = ['up', 'down', 'left', 'right'];

export interface InputSource {
  /** Read device state (gamepads are polled; event-driven sources can skip this). */
  poll?(): void;
  isHeld(button: Button): boolean;
  /** Buttons pressed since the last call, including taps released before the frame ran. */
  drainPresses(): Button[];
}

export class InputManager {
  private readonly sources: InputSource[];
  private pressedNow = new Set<Button>();
  /** Held directions, most recent first. */
  private dirOrder: Dir[] = [];
  /** Directions pressed this frame, newest first (taps released before the frame ran count too). */
  private tappedDirs: Dir[] = [];
  /** Repeat presses of one button within a single frame, delivered on the following frames. */
  private carry: Button[] = [];

  constructor(sources: InputSource[]) {
    this.sources = sources;
  }

  /** Call once per frame before reading. */
  update(): void {
    this.pressedNow.clear();
    this.tappedDirs = [];
    for (const s of this.sources) s.poll?.();
    const incoming = [...this.carry];
    for (const s of this.sources) incoming.push(...s.drainPresses());
    this.carry = [];
    for (const b of incoming) {
      if (this.pressedNow.has(b)) this.carry.push(b);
      else this.pressedNow.add(b);
    }
    for (const d of DIR_BUTTONS) {
      if (this.pressedNow.has(d)) {
        this.dirOrder = [d, ...this.dirOrder.filter((x) => x !== d)];
        this.tappedDirs = [d, ...this.tappedDirs];
      }
    }
    this.dirOrder = this.dirOrder.filter((d) => this.held(d));
    for (const d of DIR_BUTTONS) if (this.held(d) && !this.dirOrder.includes(d)) this.dirOrder.push(d);
  }

  held(button: Button): boolean {
    return this.sources.some((s) => s.isHeld(button));
  }

  /** Pressed this frame (edge), from any source. */
  pressed(button: Button): boolean {
    return this.pressedNow.has(button);
  }

  /**
   * The direction to move, in eight directions: the most recently pressed held vertical and
   * horizontal directions together (up and right held is up-right; of left and right, the newer one
   * wins). With nothing held, quick taps this frame (two keys tapped together make a diagonal).
   */
  move(): Dir8 | null {
    const order = this.dirOrder.length > 0 ? this.dirOrder : [...this.tappedDirs];
    const vertical = order.find((d) => d === 'up' || d === 'down') as 'up' | 'down' | undefined;
    const horizontal = order.find((d) => d === 'left' || d === 'right') as 'left' | 'right' | undefined;
    return combine(horizontal ?? null, vertical ?? null);
  }

  /** Whether a direction is still held (a diagonal needs both of its parts). */
  heldDir(dir: Dir8): boolean {
    return isDiagonal(dir) ? components(dir).every((d) => this.held(d)) : this.held(dir);
  }

  /** Press a button from a tap on the picture (a dialogue line, a choice): it counts on the next update. */
  inject(button: Button): void {
    this.carry.push(button);
  }

  /** Forget presses (used when a dialogue or menu closes, so the same press does not act twice). */
  clearPresses(): void {
    this.pressedNow.clear();
    this.carry = [];
    this.tappedDirs = [];
  }
}

/**
 * An analog stick (touch or gamepad) as one of eight directions: null inside the dead zone, else the
 * nearest of eight 45 degree sectors (each straight direction owns 45 degrees around its axis). `dx`,
 * `dy` and `deadzone` share one unit (screen y grows downward).
 */
export function stickDirection(dx: number, dy: number, deadzone: number): Dir8 | null {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < deadzone || (dx === 0 && dy === 0)) return null;
  const sector = ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8;
  return (['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'] as const)[sector]!;
}

/** The straight buttons a direction holds down ('up-right' holds up and right). */
export function dirButtons(dir: Dir8 | null): Dir[] {
  if (!dir) return [];
  return isDiagonal(dir) ? components(dir) : [dir];
}
