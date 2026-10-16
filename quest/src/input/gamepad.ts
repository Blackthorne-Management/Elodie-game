// Gamepad API source (standard mapping). A = confirm, B = cancel (hold to run), X = echo,
// Start = menu, R = run; D-pad or left stick move, in eight directions (the stick by 45 degree
// sectors, the D-pad by pressing two arms together).

import { GAMEPAD_DEADZONE } from '../config.ts';
import { dirButtons, stickDirection, type Button, type InputSource } from './actions.ts';

const BUTTON_MAP: [number, Button][] = [
  [0, 'confirm'],
  [1, 'cancel'],
  [1, 'run'],
  [2, 'echo'],
  [3, 'ask'],
  [5, 'run'],
  [9, 'menu'],
  [12, 'up'],
  [13, 'down'],
  [14, 'left'],
  [15, 'right'],
];

export class GamepadSource implements InputSource {
  private held = new Set<Button>();
  private presses: Button[] = [];

  poll(): void {
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    const now = new Set<Button>();
    for (const pad of pads) {
      if (!pad || !pad.connected) continue;
      for (const [index, button] of BUTTON_MAP) if (pad.buttons[index]?.pressed) now.add(button);
      const [ax = 0, ay = 0] = pad.axes;
      for (const b of dirButtons(stickDirection(ax, ay, GAMEPAD_DEADZONE))) now.add(b);
    }
    for (const b of now) if (!this.held.has(b)) this.presses.push(b);
    this.held = now;
  }

  isHeld(button: Button): boolean {
    return this.held.has(button);
  }

  drainPresses(): Button[] {
    const out = this.presses;
    this.presses = [];
    return out;
  }
}
