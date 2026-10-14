// Skin recolouring for art that is shared by many people (the Quiet Crown's members): one drawn sheet,
// any skin tone. Pure: works on raw RGBA bytes, so the browser (textures.ts) and the tests use the same
// code. The art is drawn so that skin is the only warm, mid-saturated colour on the figure (the cult's
// robes are charcoal, the veil bone-white, the emblem silver), which makes skin easy to find.

/** Whether an RGB colour reads as skin: warm (red over green over blue), neither grey nor neon. */
export function isSkin(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max < 50 || r < g || g < b || r - b < 30) return false;
  const sat = (max - min) / max;
  return sat >= 0.25 && sat <= 0.8;
}

/** The average skin colour of an RGBA image (opaque pixels only), or null when it has none. */
export function averageSkin(data: Uint8ClampedArray): [number, number, number] | null {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! < 128 || !isSkin(data[i]!, data[i + 1]!, data[i + 2]!)) continue;
    r += data[i]!;
    g += data[i + 1]!;
    b += data[i + 2]!;
    n++;
  }
  return n ? [r / n, g / n, b / n] : null;
}

/**
 * Recolour every skin pixel in place so the skin's average becomes `tone` (0xRRGGBB). Each channel is
 * scaled by tone / the image's own average, so highlights and shadows keep their steps.
 */
export function recolorSkin(data: Uint8ClampedArray, tone: number): void {
  const avg = averageSkin(data);
  if (!avg) return;
  const target = [(tone >> 16) & 255, (tone >> 8) & 255, tone & 255];
  const k = target.map((t, c) => t / Math.max(1, avg[c]!));
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! === 0 || !isSkin(data[i]!, data[i + 1]!, data[i + 2]!)) continue;
    for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.round(data[i + c]! * k[c]!));
  }
}
