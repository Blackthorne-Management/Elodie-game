// Integer scaling: the largest whole-number zoom that fits the window, never below 1.

export function integerZoom(viewportW: number, viewportH: number, gameW: number, gameH: number, maxZoom: number): number {
  const fit = Math.floor(Math.min(viewportW / gameW, viewportH / gameH));
  return Math.max(1, Math.min(maxZoom, Number.isFinite(fit) ? fit : 1));
}
