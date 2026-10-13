// The one input abstraction (guide Section 9). Keyboard, gamepad and touch are sources; the game only
// asks this manager about actions: move (a direction), confirm, cancel, echo, menu and run.
// Pure TypeScript (no DOM), so it is unit tested; the sources in this folder touch the browser.

import type { Dir } from '../engine/types.ts';

export type Button = Dir | 'confirm' | 'cancel' | 'echo' | 'menu' | 'run';
export const BUTTONS: readonly Button[] = ['up', 'down', 'left', 'right', 'confirm', 'cancel', 'echo', 'menu', 'run'];
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
  private tappedDir: Dir | null = null;
  /** Repeat presses of one button within a single frame, delivered on the following frames. */
  private carry: Button[] = [];

  constructor(sources: InputSource[]) {
    this.sources = sources;
  }

  /** Call once per frame before reading. */
  update(): void {
    this.pressedNow.clear();
    this.tappedDir = null;
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
        this.tappedDir = d;
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

  /** The direction to move: the most recently pressed held direction, or a quick tap this frame. */
  move(): Dir | null {
    return this.dirOrder[0] ?? this.tappedDir;
  }

  /** Forget presses (used when a dialogue or menu closes, so the same press does not act twice). */
  clearPresses(): void {
    this.pressedNow.clear();
    this.carry = [];
    this.tappedDir = null;
  }
}
