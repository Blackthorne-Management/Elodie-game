import { describe, expect, it } from 'vitest';
import { InputManager, type Button, type InputSource } from '../src/input/actions.ts';
import { integerZoom } from '../src/engine/scaling.ts';

class FakeSource implements InputSource {
  held = new Set<Button>();
  presses: Button[] = [];
  down(b: Button) {
    this.held.add(b);
    this.presses.push(b);
  }
  up(b: Button) {
    this.held.delete(b);
  }
  tap(b: Button) {
    this.presses.push(b);
  }
  isHeld(b: Button) {
    return this.held.has(b);
  }
  drainPresses() {
    const out = this.presses;
    this.presses = [];
    return out;
  }
}

describe('InputManager', () => {
  it('reports presses once and holds while held', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.down('confirm');
    im.update();
    expect(im.pressed('confirm')).toBe(true);
    expect(im.held('confirm')).toBe(true);
    im.update();
    expect(im.pressed('confirm')).toBe(false);
    expect(im.held('confirm')).toBe(true);
    k.up('confirm');
    im.update();
    expect(im.held('confirm')).toBe(false);
  });

  it('combines sources (keyboard, gamepad, touch)', () => {
    const a = new FakeSource();
    const b = new FakeSource();
    const im = new InputManager([a, b]);
    b.down('run');
    a.down('menu');
    im.update();
    expect(im.held('run')).toBe(true);
    expect(im.pressed('menu')).toBe(true);
  });

  it('moves in the most recently pressed held direction', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.down('right');
    im.update();
    expect(im.move()).toBe('right');
    k.down('up');
    im.update();
    expect(im.move()).toBe('up');
    k.up('up');
    im.update();
    expect(im.move()).toBe('right');
    k.up('right');
    im.update();
    expect(im.move()).toBeNull();
  });

  it('a quick tap (released before the frame) still moves one step', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.tap('left');
    im.update();
    expect(im.move()).toBe('left');
    im.update();
    expect(im.move()).toBeNull();
  });

  it('two presses of one button in a single frame count as two (the second lands next frame)', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.tap('down');
    k.tap('down');
    im.update();
    expect(im.pressed('down')).toBe(true);
    im.update();
    expect(im.pressed('down')).toBe(true);
    im.update();
    expect(im.pressed('down')).toBe(false);
  });

  it('clearPresses forgets this frame', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.tap('confirm');
    im.update();
    im.clearPresses();
    expect(im.pressed('confirm')).toBe(false);
  });
});

describe('integer scaling', () => {
  it('uses the largest whole zoom that fits, at least 1', () => {
    expect(integerZoom(1280, 800, 240, 160, 8)).toBe(5);
    expect(integerZoom(844, 390, 240, 160, 8)).toBe(2);
    expect(integerZoom(390, 844, 240, 160, 8)).toBe(1);
    expect(integerZoom(100, 100, 240, 160, 8)).toBe(1);
    expect(integerZoom(5000, 5000, 240, 160, 8)).toBe(8);
  });
});
