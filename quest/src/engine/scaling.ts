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
