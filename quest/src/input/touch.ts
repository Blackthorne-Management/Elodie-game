// On-screen touch overlay: a D-pad on the left, A and B on the right, plus small Echo and Menu
// buttons. Shown on touch devices (or with ?touch=1). Buttons are DOM elements sized in CSS pixels,
// so they stay large tap targets whatever the canvas zoom is.

import { TOUCH_BUTTON_PX, TOUCH_DPAD_PX } from '../config.ts';
import type { Dir } from '../engine/types.ts';
import type { Button, InputSource } from './actions.ts';

export function isTouchDevice(): boolean {
  if (new URLSearchParams(location.search).get('touch') === '1') return true;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function el(tag: string, className: string, label?: string): HTMLElement {
  const e = document.createElement(tag);
  e.className = className;
  if (label) {
    e.textContent = label;
    e.setAttribute('aria-label', label);
  }
  return e;
}

export class TouchSource implements InputSource {
  private held = new Set<Button>();
  private presses: Button[] = [];
  private dpadDir: Dir | null = null;
  readonly root: HTMLElement;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'touch-overlay');
    this.root.style.setProperty('--btn', `${TOUCH_BUTTON_PX}px`);
    this.root.style.setProperty('--dpad', `${TOUCH_DPAD_PX}px`);

    const dpad = el('div', 'touch-dpad');
    dpad.setAttribute('aria-label', 'Direction pad');
    for (const d of ['up', 'down', 'left', 'right'] as const) dpad.appendChild(el('span', `touch-dpad-arm ${d}`));
    this.bindDpad(dpad);

    const right = el('div', 'touch-buttons');
    const a = el('div', 'touch-btn touch-a', 'A');
    const b = el('div', 'touch-btn touch-b', 'B');
    right.append(b, a);
    this.bindButton(a, ['confirm']);
    this.bindButton(b, ['cancel', 'run']);

    const top = el('div', 'touch-top');
    const echo = el('div', 'touch-small touch-echo', 'Echo');
    const menu = el('div', 'touch-small touch-menu', 'Menu');
    top.append(echo, menu);
    this.bindButton(echo, ['echo']);
    this.bindButton(menu, ['menu']);

    this.root.append(dpad, right, top);
    parent.appendChild(this.root);
  }

  private press(buttons: Button[]): void {
    for (const b of buttons) {
      if (!this.held.has(b)) this.presses.push(b);
      this.held.add(b);
    }
  }

  private release(buttons: Button[]): void {
    for (const b of buttons) this.held.delete(b);
  }

  private bindButton(node: HTMLElement, buttons: Button[]): void {
    node.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      node.setPointerCapture?.(e.pointerId);
      node.classList.add('down');
      this.press(buttons);
    });
    const up = (e: PointerEvent) => {
      e.preventDefault();
      node.classList.remove('down');
      this.release(buttons);
    };
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    node.addEventListener('lostpointercapture', up);
    node.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private bindDpad(node: HTMLElement): void {
    const setDir = (dir: Dir | null) => {
      if (dir === this.dpadDir) return;
      if (this.dpadDir) this.release([this.dpadDir]);
      node.dataset.dir = dir ?? '';
      this.dpadDir = dir;
      if (dir) this.press([dir]);
    };
    const fromEvent = (e: PointerEvent): Dir | null => {
      const r = node.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.08) return null;
      return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    };
    node.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      node.setPointerCapture?.(e.pointerId);
      setDir(fromEvent(e));
    });
    node.addEventListener('pointermove', (e) => {
      if (e.buttons === 0 && e.pointerType === 'mouse') return;
      if (!node.hasPointerCapture?.(e.pointerId)) return;
      setDir(fromEvent(e));
    });
    const end = () => setDir(null);
    node.addEventListener('pointerup', end);
    node.addEventListener('pointercancel', end);
    node.addEventListener('lostpointercapture', end);
    node.addEventListener('contextmenu', (e) => e.preventDefault());
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
