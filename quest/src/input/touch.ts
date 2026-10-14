// On-screen touch overlay: an analog thumb-stick on the left, A and B on the right, plus small Echo
// and Menu buttons. Shown on touch devices (or with ?touch=1). Controls are DOM elements sized in CSS
// pixels, so they stay large tap targets whatever the canvas zoom is. The overlay is pinned to the
// visible viewport (src/ui/screen.ts) and kept inside the safe areas; touches on it never scroll,
// zoom or select (touch-action: none, and touchstart is cancelled, which iOS needs to skip
// double-tap zoom).
//
// The stick floats: it rests at the bottom left, and when a thumb lands anywhere in the left third of
// the screen the ring jumps to that spot (kept on screen) and the knob follows the thumb within the
// ring. Leaning past the dead zone walks in one of eight directions (actions.ts stickDirection);
// leaning all the way out runs. B still runs too. Release, and the ring goes back to rest.

import { STICK_DEADZONE, STICK_RUN, TOUCH_BUTTON_PX, TOUCH_KNOB_PX, TOUCH_STICK_MIN_PX, TOUCH_STICK_PX, TOUCH_STICK_ZONE } from '../config.ts';
import { dirButtons, stickDirection, type Button, type InputSource } from './actions.ts';

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

/** Where the knob sits for a thumb at (dx, dy) from the ring's centre: clamped to `radius`. */
export function knobOffset(dx: number, dy: number, radius: number): { x: number; y: number; lean: number } {
  const d = Math.hypot(dx, dy);
  if (d === 0 || radius <= 0) return { x: 0, y: 0, lean: 0 };
  const k = Math.min(1, radius / d);
  return { x: dx * k, y: dy * k, lean: Math.min(1, d / radius) };
}

export class TouchSource implements InputSource {
  /** Buttons held by the A, B, Echo and Menu buttons. */
  private buttonsHeld = new Set<Button>();
  /** Directions (and run) held by the stick. */
  private stickHeld = new Set<Button>();
  private presses: Button[] = [];
  private stickPointer: number | null = null;
  private origin = { x: 0, y: 0 };
  readonly root: HTMLElement;
  private readonly zone: HTMLElement;
  private readonly base: HTMLElement;
  private readonly knob: HTMLElement;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'touch-overlay');
    this.root.style.setProperty('--btn', `${TOUCH_BUTTON_PX}px`);
    this.root.style.setProperty('--stick-max', `${TOUCH_STICK_PX}px`);
    this.root.style.setProperty('--stick-min', `${TOUCH_STICK_MIN_PX}px`);
    this.root.style.setProperty('--knob', `${TOUCH_KNOB_PX}px`);
    this.root.style.setProperty('--stick-zone', `${TOUCH_STICK_ZONE * 100}%`);

    this.zone = el('div', 'touch-stick-zone');
    this.base = el('div', 'touch-stick');
    this.base.setAttribute('aria-label', 'Move stick');
    this.knob = el('div', 'touch-stick-knob');
    this.base.appendChild(this.knob);
    this.zone.appendChild(this.base);
    this.bindStick();

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

    this.root.append(this.zone, right, top);
    parent.appendChild(this.root);
  }

  private press(buttons: Button[]): void {
    for (const b of buttons) {
      if (!this.isHeld(b)) this.presses.push(b);
      this.buttonsHeld.add(b);
    }
  }

  private release(buttons: Button[]): void {
    for (const b of buttons) this.buttonsHeld.delete(b);
  }

  /** Cancel the touch itself (pointer events still arrive): no double-tap zoom, callout or scroll. */
  private guard(node: HTMLElement): void {
    node.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    node.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
  }

  private bindButton(node: HTMLElement, buttons: Button[]): void {
    this.guard(node);
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

  /** Set what the stick holds: the straight parts of its direction, and run when leaning far. */
  private setStick(dir: ReturnType<typeof stickDirection>, run: boolean): void {
    const now = new Set<Button>(dirButtons(dir));
    if (dir && run) now.add('run');
    for (const b of now) if (!this.stickHeld.has(b) && !this.buttonsHeld.has(b)) this.presses.push(b);
    this.stickHeld = now;
    this.base.dataset.dir = dir ?? '';
    this.base.classList.toggle('run', dir !== null && run);
  }

  private bindStick(): void {
    const zone = this.zone;
    this.guard(zone);
    const radius = () => this.base.getBoundingClientRect().width / 2;
    const place = (cx: number, cy: number) => {
      const z = zone.getBoundingClientRect();
      const r = radius();
      // Keep the whole ring inside the zone (and so on screen).
      const x = Math.min(Math.max(cx - z.left, r), Math.max(r, z.width - r));
      const y = Math.min(Math.max(cy - z.top, r), Math.max(r, z.height - r));
      this.origin = { x: z.left + x, y: z.top + y };
      this.base.style.left = `${x - r}px`;
      this.base.style.top = `${y - r}px`;
    };
    const follow = (e: PointerEvent) => {
      const r = radius();
      const k = knobOffset(e.clientX - this.origin.x, e.clientY - this.origin.y, r);
      this.knob.style.transform = `translate(calc(-50% + ${k.x}px), calc(-50% + ${k.y}px))`;
      this.setStick(stickDirection(k.x / r, k.y / r, STICK_DEADZONE), k.lean >= STICK_RUN);
    };
    zone.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.stickPointer !== null) return;
      this.stickPointer = e.pointerId;
      zone.setPointerCapture?.(e.pointerId);
      this.base.classList.add('active');
      place(e.clientX, e.clientY);
      follow(e);
    });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.stickPointer) return;
      e.preventDefault();
      follow(e);
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== this.stickPointer) return;
      this.stickPointer = null;
      this.base.classList.remove('active', 'run');
      this.base.style.left = '';
      this.base.style.top = '';
      this.knob.style.transform = '';
      this.setStick(null, false);
    };
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
    zone.addEventListener('lostpointercapture', end);
    zone.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isHeld(button: Button): boolean {
    return this.buttonsHeld.has(button) || this.stickHeld.has(button);
  }

  drainPresses(): Button[] {
    const out = this.presses;
    this.presses = [];
    return out;
  }
}
