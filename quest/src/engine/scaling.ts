// Screen scaling. Pure functions: the DOM code in src/ui/screen.ts feeds them the visible viewport.

/** The largest whole-number zoom that fits the viewport, never below 1. */
export function integerZoom(viewportW: number, viewportH: number, gameW: number, gameH: number, maxZoom: number): number {
  const fit = Math.floor(Math.min(viewportW / gameW, viewportH / gameH));
  return Math.max(1, Math.min(maxZoom, Number.isFinite(fit) ? fit : 1));
}

/**
 * The zoom for the visible viewport. Whole numbers when at least `minInteger` fits (crisp pixels);
 * below that the exact fit, so small phones still get a picture that fills the screen. Never larger
 * than the viewport (so it can be below 1), never above `maxZoom`.
 */
export function fitZoom(
  viewportW: number,
  viewportH: number,
  gameW: number,
  gameH: number,
  maxZoom: number,
  minInteger: number,
): number {
  const exact = Math.min(viewportW / gameW, viewportH / gameH);
  if (!Number.isFinite(exact) || exact <= 0) return 1;
  const whole = Math.min(maxZoom, Math.floor(exact));
  if (whole >= minInteger) return whole;
  // Round down to 1/1000 so floating point never pushes the canvas past the viewport.
  return Math.min(maxZoom, Math.floor(exact * 1000) / 1000);
}

export interface ScreenRect {
  zoom: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

/** Where the canvas sits: `zoom` from fitZoom, centred in the viewport (the rest is letterbox). */
export function fitRect(
  viewportW: number,
  viewportH: number,
  gameW: number,
  gameH: number,
  maxZoom: number,
  minInteger: number,
): ScreenRect {
  const zoom = fitZoom(viewportW, viewportH, gameW, gameH, maxZoom, minInteger);
  const width = Math.floor(gameW * zoom);
  const height = Math.floor(gameH * zoom);
  return {
    zoom,
    width,
    height,
    left: Math.max(0, Math.floor((viewportW - width) / 2)),
    top: Math.max(0, Math.floor((viewportH - height) / 2)),
  };
}

export type ScreenMode = 'side' | 'stack' | 'overlay';

export interface ScreenLayout {
  rect: ScreenRect;
  /** side: controls and map in the left and right bars; stack: in the bottom and top bars; overlay: map on the picture. */
  mode: ScreenMode;
}

/**
 * Fit the picture and decide where the controls and the minimap go. With touch, the controls always
 * get their bars: sideways screens reserve `side` px left and right (shrinking the picture only when
 * the natural bars are narrower), upright screens reserve `stack` px top and bottom. Without touch the
 * minimap uses a side bar when the natural one is at least `mapBar` wide.
 */
export function screenLayout(
  viewportW: number,
  viewportH: number,
  gameW: number,
  gameH: number,
  maxZoom: number,
  minInteger: number,
  touch: boolean,
  bars: { side: number; stack: number; mapBar: number },
): ScreenLayout {
  const natural = fitRect(viewportW, viewportH, gameW, gameH, maxZoom, minInteger);
  const centred = (r: ScreenRect): ScreenRect => ({
    ...r,
    left: Math.max(0, Math.floor((viewportW - r.width) / 2)),
    top: Math.max(0, Math.floor((viewportH - r.height) / 2)),
  });
  if (!touch) return { rect: natural, mode: natural.left >= bars.mapBar ? 'side' : 'overlay' };
  if (viewportW >= viewportH) {
    if (natural.left >= bars.side) return { rect: natural, mode: 'side' };
    return { rect: centred(fitRect(Math.max(gameW, viewportW - 2 * bars.side), viewportH, gameW, gameH, maxZoom, minInteger)), mode: 'side' };
  }
  if (natural.top >= bars.stack) return { rect: natural, mode: 'stack' };
  return { rect: centred(fitRect(viewportW, Math.max(gameH, viewportH - 2 * bars.stack), gameW, gameH, maxZoom, minInteger)), mode: 'stack' };
}

/**
 * Camera bounds for a map in a view (both in pixels). A map larger than the view is the bounds
 * itself (the camera follows and stops at the edges). Along a side where the map is smaller than the
 * view, the bounds grow to the view's size, centred on the map, so the map sits in the middle of the
 * screen instead of against the top-left corner.
 */
export function cameraBounds(mapW: number, mapH: number, viewW: number, viewH: number): { x: number; y: number; width: number; height: number } {
  const width = Math.max(mapW, viewW);
  const height = Math.max(mapH, viewH);
  return { x: Math.floor((mapW - width) / 2), y: Math.floor((mapH - height) / 2), width, height };
}

/** Where the camera's top-left corner ends up for a target point, clamped to bounds (as Phaser does). */
export function cameraScroll(
  target: { x: number; y: number },
  bounds: { x: number; y: number; width: number; height: number },
  viewW: number,
  viewH: number,
): { x: number; y: number } {
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
  return {
    x: clamp(target.x - viewW / 2, bounds.x, bounds.x + bounds.width - viewW),
    y: clamp(target.y - viewH / 2, bounds.y, bounds.y + bounds.height - viewH),
  };
}
