import { describe, expect, it } from 'vitest';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../src/config.ts';
import { InputManager, dirButtons, stickDirection, type Button, type InputSource } from '../src/input/actions.ts';
import { padDirection } from '../src/input/touch.ts';
import { cameraBounds, cameraScroll, fitRect, fitZoom, integerZoom, screenLayout } from '../src/engine/scaling.ts';

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

  it('combines a held vertical and horizontal direction into a diagonal', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.down('right');
    im.update();
    expect(im.move()).toBe('right');
    k.down('up');
    im.update();
    expect(im.move()).toBe('up-right');
    expect(im.heldDir('up-right')).toBe(true);
    k.up('up');
    im.update();
    expect(im.move()).toBe('right');
    expect(im.heldDir('up-right')).toBe(false);
    k.down('down');
    k.down('left');
    im.update();
    expect(im.move()).toBe('down-left');
    k.up('left');
    k.up('down');
    k.up('right');
    im.update();
    expect(im.move()).toBeNull();
  });

  it('of two opposite directions, the newer one wins', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.down('left');
    im.update();
    k.down('right');
    im.update();
    expect(im.move()).toBe('right');
    k.down('up');
    im.update();
    expect(im.move()).toBe('up-right');
  });

  it('two keys tapped together in one frame make a diagonal step', () => {
    const k = new FakeSource();
    const im = new InputManager([k]);
    k.tap('up');
    k.tap('left');
    im.update();
    expect(im.move()).toBe('up-left');
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

describe('analog sticks (touch and gamepad)', () => {
  it('map to eight 45 degree sectors outside the dead zone', () => {
    expect(stickDirection(0.1, 0.1, 0.25)).toBeNull();
    expect(stickDirection(0, 0, 0)).toBeNull();
    expect(stickDirection(1, 0, 0.25)).toBe('right');
    expect(stickDirection(-1, 0, 0.25)).toBe('left');
    expect(stickDirection(0, -1, 0.25)).toBe('up');
    expect(stickDirection(0, 1, 0.25)).toBe('down');
    expect(stickDirection(0.7, -0.7, 0.25)).toBe('up-right');
    expect(stickDirection(-0.7, -0.7, 0.25)).toBe('up-left');
    expect(stickDirection(0.7, 0.7, 0.25)).toBe('down-right');
    expect(stickDirection(-0.7, 0.7, 0.25)).toBe('down-left');
    // Each straight direction owns 22.5 degrees either side of its axis.
    const at = (deg: number) => stickDirection(Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180), 0.25);
    expect(at(20)).toBe('right');
    expect(at(25)).toBe('down-right');
    expect(at(-20)).toBe('right');
    expect(at(-25)).toBe('up-right');
    expect(at(-110)).toBe('up');
    expect(at(-160)).toBe('left');
    expect(stickDirection(Number.NaN, 1, 0.25)).toBeNull();
  });

  it('hold the straight buttons of their direction', () => {
    expect(dirButtons('up-right').sort()).toEqual(['right', 'up']);
    expect(dirButtons('left')).toEqual(['left']);
    expect(dirButtons(null)).toEqual([]);
  });

  it('the D-pad: an arm for a straight step, between two arms for a diagonal, nothing in the middle', () => {
    expect(padDirection(60, 0, 66)).toBe('right');
    expect(padDirection(0, -60, 66)).toBe('up');
    expect(padDirection(45, -45, 66)).toBe('up-right');
    expect(padDirection(-45, 45, 66)).toBe('down-left');
    expect(padDirection(5, 5, 66)).toBeNull();
  });
});

describe('integer scaling', () => {
  it('uses the largest whole zoom that fits, at least 1', () => {
    expect(integerZoom(1280, 800, 240, 160, 8)).toBe(5);
    expect(integerZoom(844, 390, 240, 160, 8)).toBe(2);
    expect(integerZoom(1280, 800, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(4);
    expect(integerZoom(1920, 1080, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(6);
    expect(integerZoom(844, 390, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(2);
    expect(integerZoom(390, 844, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(1);
    expect(integerZoom(100, 100, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(1);
    expect(integerZoom(5000, 5000, VIEW_WIDTH, VIEW_HEIGHT, 8)).toBe(8);
  });

  it('the screen is 320 x 180 (16:9): 20 x 11.25 tiles', () => {
    expect([VIEW_WIDTH, VIEW_HEIGHT]).toEqual([320, 180]);
    expect(VIEW_WIDTH / VIEW_HEIGHT).toBeCloseTo(16 / 9);
  });
});

describe('the camera', () => {
  it('keeps a map larger than the screen as its bounds and stops at the edges', () => {
    const b = cameraBounds(640, 448, 320, 180);
    expect(b).toEqual({ x: 0, y: 0, width: 640, height: 448 });
    expect(cameraScroll({ x: 8, y: 8 }, b, 320, 180)).toEqual({ x: 0, y: 0 });
    expect(cameraScroll({ x: 636, y: 440 }, b, 320, 180)).toEqual({ x: 320, y: 268 });
    expect(cameraScroll({ x: 300, y: 200 }, b, 320, 180)).toEqual({ x: 140, y: 110 });
  });

  it('centres a map smaller than the screen', () => {
    // A 12 x 8 tile room (192 x 128) on the 320 x 180 screen: 64 px either side, 26 above and below.
    const b = cameraBounds(192, 128, 320, 180);
    expect(b).toEqual({ x: -64, y: -26, width: 320, height: 180 });
    for (const t of [{ x: 0, y: 0 }, { x: 191, y: 127 }, { x: 96, y: 64 }]) expect(cameraScroll(t, b, 320, 180)).toEqual({ x: -64, y: -26 });
    // Wider than the screen but shorter: follows across, centred up and down.
    const house = cameraBounds(400, 160, 320, 180);
    expect(house).toEqual({ x: 0, y: -10, width: 400, height: 180 });
    expect(cameraScroll({ x: 390, y: 0 }, house, 320, 180)).toEqual({ x: 80, y: -10 });
  });
});

describe('fitZoom and fitRect', () => {
  const PHONES: [number, number][] = [[844, 390], [932, 430], [667, 375], [740, 360], [568, 320], [390, 844], [320, 180], [1280, 800]];

  const W = VIEW_WIDTH;
  const H = VIEW_HEIGHT;

  it('uses whole numbers when at least 2 fits', () => {
    expect(fitZoom(1280, 800, W, H, 8, 2)).toBe(4);
    expect(fitZoom(844, 390, W, H, 8, 2)).toBe(2);
    expect(fitZoom(667, 375, W, H, 8, 2)).toBe(2);
    expect(fitZoom(932, 430, W, H, 8, 2)).toBe(2);
    expect(fitZoom(5000, 5000, W, H, 8, 2)).toBe(8);
  });

  it('falls back to the exact fit below 2, even below 1', () => {
    expect(fitZoom(390, 844, W, H, 8, 2)).toBe(1.218);
    expect(fitZoom(450, 300, W, H, 8, 2)).toBe(1.406);
    expect(fitZoom(160, 90, W, H, 8, 2)).toBe(0.5);
    expect(fitZoom(390, 844, 240, 160, 8, 2)).toBe(1.625);
  });

  it('survives an empty or broken viewport', () => {
    expect(fitZoom(0, 0, W, H, 8, 2)).toBe(1);
    expect(fitZoom(Number.NaN, 300, W, H, 8, 2)).toBe(1);
  });

  it('never lets the canvas leave the viewport, and centres it', () => {
    for (const [w, h] of PHONES) {
      const r = fitRect(w, h, W, H, 8, 2);
      expect(r.width).toBeLessThanOrEqual(w);
      expect(r.height).toBeLessThanOrEqual(h);
      expect(r.left + r.width).toBeLessThanOrEqual(w);
      expect(r.top + r.height).toBeLessThanOrEqual(h);
      expect(Math.abs(r.left - (w - r.width - r.left))).toBeLessThanOrEqual(1);
      expect(Math.abs(r.top - (h - r.height - r.top))).toBeLessThanOrEqual(1);
    }
    expect(fitRect(844, 390, W, H, 8, 2)).toEqual({ zoom: 2, width: 640, height: 360, left: 102, top: 15 });
    expect(fitRect(1280, 800, W, H, 8, 2)).toEqual({ zoom: 4, width: 1280, height: 720, left: 0, top: 40 });
  });
});

describe('screen layout: where the controls and the minimap go', () => {
  const bars = { side: 150, stack: 176, mapBar: 140 };
  it('a sideways phone gives the controls both side bars, shrinking the picture only as needed', () => {
    const l = screenLayout(844, 390, 320, 180, 8, 2, true, bars);
    expect(l.mode).toBe('side');
    expect(l.rect.left).toBeGreaterThanOrEqual(150);
    expect(l.rect.left + l.rect.width).toBeLessThanOrEqual(844 - 150);
    const wide = screenLayout(2400, 1000, 320, 180, 8, 2, true, bars);
    expect(wide.rect).toEqual(fitRect(2400, 1000, 320, 180, 8, 2));
  });

  it('an upright phone puts the controls in the bottom bar and the map in the top bar', () => {
    const l = screenLayout(390, 844, 320, 180, 8, 2, true, bars);
    expect(l.mode).toBe('stack');
    expect(l.rect.top).toBeGreaterThanOrEqual(176);
  });

  it('without touch the picture keeps its full size; the minimap uses a wide enough side bar', () => {
    expect(screenLayout(1920, 1080, 320, 180, 8, 2, false, bars).mode).toBe('overlay');
    const ultrawide = screenLayout(2560, 1080, 320, 180, 8, 2, false, bars);
    expect(ultrawide.mode).toBe('side');
    expect(ultrawide.rect).toEqual(fitRect(2560, 1080, 320, 180, 8, 2));
  });
});
