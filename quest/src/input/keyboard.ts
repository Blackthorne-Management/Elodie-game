// Keyboard source. Arrows or WASD move; Z / Enter / Space confirm; X / Backspace cancel;
// E echo; Q ask Anissa; Escape / M menu; Shift or X (held) run.

import type { Button, InputSource } from './actions.ts';

const KEYMAP: Record<string, Button[]> = {
  ArrowUp: ['up'],
  ArrowDown: ['down'],
  ArrowLeft: ['left'],
  ArrowRight: ['right'],
  KeyW: ['up'],
  KeyS: ['down'],
  KeyA: ['left'],
  KeyD: ['right'],
  KeyZ: ['confirm'],
  Enter: ['confirm'],
  Space: ['confirm'],
  KeyX: ['cancel', 'run'],
  Backspace: ['cancel'],
  KeyE: ['echo'],
  KeyQ: ['ask'],
  Escape: ['menu'],
  KeyM: ['menu'],
  ShiftLeft: ['run'],
  ShiftRight: ['run'],
};

export class KeyboardSource implements InputSource {
  private down = new Set<string>();
  private presses: Button[] = [];

  constructor(target: Window = window) {
    target.addEventListener('keydown', (e) => this.onDown(e));
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    target.addEventListener('blur', () => this.down.clear());
  }

  private onDown(e: KeyboardEvent): void {
    const el = e.target as HTMLElement | null;
    if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.tagName === 'BUTTON')) return;
    const buttons = KEYMAP[e.code];
    if (!buttons) return;
    e.preventDefault();
    if (e.repeat || this.down.has(e.code)) return;
    this.down.add(e.code);
    this.presses.push(...buttons);
  }

  isHeld(button: Button): boolean {
    for (const code of this.down) if (KEYMAP[code]?.includes(button)) return true;
    return false;
  }

  drainPresses(): Button[] {
    const out = this.presses;
    this.presses = [];
    return out;
  }
}
