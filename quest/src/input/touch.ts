// On-screen touch controls: a D-pad, A and B, plus Echo and Menu. Shown on touch devices (or with
// ?touch=1). They live in the black bars around the picture (src/ui/screen.ts sets <body
// data-layout>): held sideways, the D-pad in the left bar and the buttons in the right bar; held
// upright, all of them in the bottom bar. Controls are DOM elements sized in CSS pixels, so they stay
// large tap targets whatever the canvas zoom is; touches on them never scroll, zoom or select
// (touch-action: none, and touchstart is cancelled, which iOS needs to skip double-tap zoom).
//
// The D-pad gives eight directions: press an arm for a straight step, press between two arms for a
// diagonal, and slide the thumb across it to turn without lifting. B (held) runs.
//
// On a short sideways screen the controls are compact (<body data-controls='compact'>, style.css): A and B at 44 px,
// everything hugging the screen's edge. On a page, in a fight and on a card the D-pad there is a rail: its four arrows
// one above another down the left edge (up, left, right, down), A over B down the right edge, so a page drawn between
// them keeps clear (Claude's call, Nov 10).

import { PAD_DEADZONE, TOUCH_BUTTON_PX, TOUCH_COMPACT_BUTTON_PX, TOUCH_PAD_PX, TOUCH_PAD_STACK_PX, TOUCH_BUTTON_STACK_PX } from '../config.ts';
import type { Rect } from '../engine/scaling.ts';
import type { Dir8 } from '../engine/types.ts';
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

/** The rail's arrows from the top (style.css, the compact controls on a page). */
export const RAIL_ORDER: readonly Dir8[] = ['up', 'left', 'right', 'down'];

/** On the rail (`height` px tall, its arrows evenly spaced), the arrow a thumb `y` px from its top presses. */
export function railDirection(y: number, height: number): Dir8 | null {
  if (height <= 0) return null;
  const i = Math.floor((y / height) * RAIL_ORDER.length);
  return RAIL_ORDER[Math.max(0, Math.min(RAIL_ORDER.length - 1, i))]!;
}

/** The direction for a thumb at (dx, dy) from the pad's centre, or null in the dead middle. */
export function padDirection(dx: number, dy: number, radius: number, deadzone = PAD_DEADZONE): Dir8 | null {
  if (radius <= 0) return null;
  return stickDirection(dx / radius, dy / radius, deadzone);
}

export class TouchSource implements InputSource {
  readonly device = 'touch' as const;
  /** Buttons held by A, B, Echo and Menu. */
  private buttonsHeld = new Set<Button>();
  /** Directions held by the D-pad. */
  private padHeld = new Set<Button>();
  private presses: Button[] = [];
  private padPointer: number | null = null;
  readonly root: HTMLElement;
  private readonly pad: HTMLElement;

  constructor(parent: HTMLElement) {
    this.root = el('div', 'touch-overlay');
    this.root.style.setProperty('--btn', `${TOUCH_BUTTON_PX}px`);
    this.root.style.setProperty('--pad', `${TOUCH_PAD_PX}px`);
    this.root.style.setProperty('--btn-stack', `${TOUCH_BUTTON_STACK_PX}px`);
    this.root.style.setProperty('--pad-stack', `${TOUCH_PAD_STACK_PX}px`);
    this.root.style.setProperty('--btn-compact', `${TOUCH_COMPACT_BUTTON_PX}px`);

    this.pad = el('div', 'touch-dpad');
    this.pad.setAttribute('aria-label', 'Direction pad');
    for (const arm of ['up', 'down', 'left', 'right']) this.pad.appendChild(el('div', `touch-arm touch-arm-${arm}`));
    this.pad.appendChild(el('div', 'touch-hub'));
    this.bindPad();

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

    // Ask Anissa: in the left bar above the D-pad (the right bar is full on small phones).
    const ask = el('div', 'touch-small touch-ask', 'Ask');
    this.bindButton(ask, ['ask']);

    this.root.append(this.pad, right, top, ask);
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

  /** Set the directions the pad holds (the straight parts of a diagonal). */
  private setPad(dir: Dir8 | null): void {
    const now = new Set<Button>(dirButtons(dir));
    for (const b of now) if (!this.padHeld.has(b) && !this.buttonsHeld.has(b)) this.presses.push(b);
    this.padHeld = now;
    this.pad.dataset.dir = dir ?? '';
  }

  private bindPad(): void {
    const pad = this.pad;
    this.guard(pad);
    const aim = (e: PointerEvent) => {
      const r = pad.getBoundingClientRect();
      // The rail (compact controls on a page) is a column of arrows; the cross is aimed from its centre.
      if (r.height > r.width * 1.5) this.setPad(railDirection(e.clientY - r.top, r.height));
      else this.setPad(padDirection(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2), r.width / 2));
    };
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.padPointer !== null) return;
      this.padPointer = e.pointerId;
      pad.setPointerCapture?.(e.pointerId);
      pad.classList.add('active');
      aim(e);
    });
    pad.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.padPointer) return;
      e.preventDefault();
      aim(e);
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== this.padPointer) return;
      this.padPointer = null;
      pad.classList.remove('active');
      this.setPad(null);
    };
    pad.addEventListener('pointerup', end);
    pad.addEventListener('pointercancel', end);
    pad.addEventListener('lostpointercapture', end);
    pad.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isHeld(button: Button): boolean {
    return this.buttonsHeld.has(button) || this.padHeld.has(button);
  }

  drainPresses(): Button[] {
    const out = this.presses;
    this.presses = [];
    return out;
  }
}

/** Every touch control on the screen now, and the full-screen button (hidden ones are left out). */
const CONTROLS = ['.touch-dpad', '.touch-ask', '.touch-btn', '.touch-small', '.fs-button'];

/**
 * The visible touch controls that lie over the game picture, as rectangles in the picture's own pixels (`viewW` x
 * `viewH`), clipped to it; empty without touch controls. The dialogue box, the pages and the battle's strip keep what
 * must be read out from under them (engine/scaling.ts controlReach; review Nov 7, finding 5, and Nov 10).
 */
export function controlsOverPicture(canvas: HTMLCanvasElement, viewW: number, viewH: number): Rect[] {
  if (typeof document === 'undefined' || !document.querySelector('.touch-overlay')) return [];
  const c = canvas.getBoundingClientRect();
  if (c.width === 0 || c.height === 0) return [];
  const sx = viewW / c.width;
  const sy = viewH / c.height;
  const out: Rect[] = [];
  for (const node of document.querySelectorAll(CONTROLS.join(', '))) {
    const r = node.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const left = Math.max(0, (r.left - c.left) * sx);
    const right = Math.min(viewW, (r.right - c.left) * sx);
    const top = Math.max(0, (r.top - c.top) * sy);
    const bottom = Math.min(viewH, (r.bottom - c.top) * sy);
    if (right > left && bottom > top) out.push({ x: left, y: top, w: right - left, h: bottom - top });
  }
  return out;
}
