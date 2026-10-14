// Pure pixel drawing for the placeholders: a small pixel buffer, the pixel art in assets.pixels.ts,
// and the procedural characters (assets.config.ts NPC_SPRITES). No Phaser and no DOM except a
// canvas context handed in to draw on, so tests can check the drawings.

import { PALETTE, type PixelArt, type PlaceholderCharacter } from '../assets.config.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH } from '../config.ts';
import type { Dir } from '../engine/types.ts';

const OUTLINE = PALETTE.k!;
const SHADOW = PALETTE.k!;

/** A colour moved `k` (0..1) of the way toward another. */
export function mix(a: number, b: number, k: number): number {
  const ch = (shift: number) => Math.round(((a >> shift) & 255) * (1 - k) + ((b >> shift) & 255) * k);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

export function css(color: number, alpha = 1): string {
  return `rgba(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255},${alpha})`;
}

/** A small pixel buffer: colours by position (undefined is transparent). */
export class Pix {
  readonly w: number;
  readonly h: number;
  private px: (number | undefined)[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.px = Array.from({ length: w * h }, () => undefined);
  }

  set(x: number, y: number, color: number): this {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = color;
    return this;
  }

  get(x: number, y: number): number | undefined {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : undefined;
  }

  rect(x: number, y: number, w: number, h: number, color: number): this {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, color);
    return this;
  }

  /** A line of single pixels from (x0, y0) to (x1, y1). */
  line(x0: number, y0: number, x1: number, y1: number, color: number): this {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.set(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), color);
    return this;
  }

  /** A 1 px outline around everything drawn (the outline rule for characters). */
  outline(color: number): this {
    const add: [number, number][] = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.get(x, y) !== undefined) continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => this.get(x + dx!, y + dy!) !== undefined)) add.push([x, y]);
      }
    }
    for (const [x, y] of add) this.set(x, y, color);
    return this;
  }

  /** The same picture flipped left to right. */
  mirrored(): Pix {
    const out = new Pix(this.w, this.h);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const c = this.get(x, y);
      if (c !== undefined) out.set(this.w - 1 - x, y, c);
    }
    return out;
  }

  /**
   * Three-tone shading, light from the top left: in every region of one of `colors`, the pixels on
   * its right or bottom edge take the dark tone and those on its left or top edge the light tone.
   */
  bevel(colors: ReadonlySet<number>): this {
    const src = [...this.px];
    const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < this.w && y < this.h ? src[y * this.w + x] : undefined);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = at(x, y);
        if (c === undefined || !colors.has(c)) continue;
        if (at(x + 1, y) !== c || at(x, y + 1) !== c) this.set(x, y, mix(c, SHADOW, 0.35));
        else if (at(x - 1, y) !== c || at(x, y - 1) !== c) this.set(x, y, mix(c, 0xffffff, 0.2));
      }
    }
    return this;
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number, scale = 1): void {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = this.get(x, y);
        if (c === undefined) continue;
        ctx.fillStyle = css(c);
        ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
      }
    }
  }
}

export function artPix(art: PixelArt): Pix {
  const pix = new Pix(art.rows[0]!.length, art.rows.length);
  art.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const key = row[x]!;
      if (key !== '.') pix.set(x, y, PALETTE[key] ?? 0xff00ff);
    }
  });
  return pix;
}


// ---- Characters ------------------------------------------------------------------------------------

/**
 * Where a build's parts sit in the 24 x 32 cell (rows): head top, body top, leg top, the shoes' row,
 * and the arm length. The head is 12 rows (about 40 % of the figure, chibi like the real art); the
 * outline adds a row under the shoes, so the feet end on the bottom row of the cell.
 */
interface Build {
  head: number;
  body: number;
  legs: number;
  feet: number;
  arm: number;
}
const BUILDS: Record<'normal' | 'small' | 'tall', Build> = {
  normal: { head: 4, body: 16, legs: 25, feet: 30, arm: 5 },
  small: { head: 8, body: 20, legs: 26, feet: 30, arm: 2 },
  tall: { head: 3, body: 15, legs: 25, feet: 30, arm: 6 },
};

type View = 'down' | 'up' | 'right';

/** The head's width, row by row (0..11 from its top), seen from the front or back, and from the side. */
const HEAD_FRONT: readonly [number, number][] = [[7, 16], [6, 17], ...Array.from({ length: 8 }, () => [5, 18] as [number, number]), [6, 17], [7, 16]];
const HEAD_SIDE: readonly [number, number][] = [[8, 16], [7, 17], ...Array.from({ length: 8 }, () => [6, 18] as [number, number]), [7, 17], [8, 16]];

/**
 * One 24 x 32 character frame, chibi proportions like the real art: a big head (12 of 27 rows), a 1 px
 * dark outline, three-tone shading (light from the top left), and hair, headgear and what they carry
 * telling the looks apart. `step` 0 stands; 1 and 2 are the two step frames (the walk cycle is 1, 0, 2,
 * 0): one foot lifts and the body sits a pixel lower. Left is the right view mirrored. The shadow is
 * drawn separately (textures.ts).
 */
export function characterPix(look: PlaceholderCharacter, facing: Dir, step: 0 | 1 | 2 = 0): Pix {
  const p = drawCharacter(look, facing === 'left' ? 'right' : facing, step);
  return facing === 'left' ? p.mirrored() : p;
}

function drawCharacter(look: PlaceholderCharacter, view: View, step: 0 | 1 | 2): Pix {
  const p = new Pix(CHARACTER_WIDTH, CHARACTER_HEIGHT);
  const b = BUILDS[look.build ?? 'normal'];
  const bob = step === 0 ? 0 : 1;
  const H = b.head + bob; // head top
  const B = b.body + bob; // body top
  const { legs: L, feet: F } = b;
  const side = view === 'right';
  const legC = look.legs ?? PALETTE.K!;
  const shoe = PALETTE.b!;
  const far = (c: number) => mix(c, SHADOW, 0.3);
  const head = side ? HEAD_SIDE : HEAD_FRONT;
  const span = (r: number) => head[Math.max(0, Math.min(11, r))]!;
  /** Fill head-shaped rows r0..r1 (offsets from the head top). */
  const headRows = (r0: number, r1: number, c: number, x0 = -99, x1 = 99) => {
    for (let r = r0; r <= r1; r++) {
      const [a, z] = span(r);
      p.rect(Math.max(a, x0), H + r, Math.min(z, x1) - Math.max(a, x0) + 1, 1, c);
    }
  };
  /** A rectangle and its mirror image across the middle of the cell (front and back views). */
  const sym = (x: number, y: number, w: number, h: number, c: number) => p.rect(x, y, w, h, c).rect(CHARACTER_WIDTH - x - w, y, w, h, c);

  // Legs and shoes (they do not bob), or the shoes under a robe.
  if (!side) {
    const lift = (leftFoot: boolean) => (step === 1 && leftFoot) || (step === 2 && !leftFoot) ? 1 : 0;
    for (const [x, left] of [[8, true], [13, false]] as const) {
      const up = lift(left);
      if (!look.robe) p.rect(x, L, 3, F - L - up, legC);
      if (!look.robe || !up) p.rect(left ? x - 1 : x, F - up, 4, 1, shoe);
    }
  } else if (step === 0) {
    if (!look.robe) p.rect(10, L, 4, F - L, legC);
    p.rect(10, F, 5, 1, shoe);
  } else {
    // A stride: the front foot forward, the back foot behind; the far leg is the darker one.
    const frontFar = step === 2;
    if (!look.robe) {
      p.rect(8, L, 3, F - L, frontFar ? legC : far(legC));
      p.rect(13, L, 3, F - L, frontFar ? far(legC) : legC);
    }
    p.rect(7, F, 4, 1, frontFar ? shoe : far(shoe));
    p.rect(13, F, 4, 1, frontFar ? far(shoe) : shoe);
  }

  // Torso (a robe flares to the ankles), sleeves and hands.
  const outfit = look.outfit;
  const torsoBottom = look.robe ? F - 1 : L - 1 + bob;
  if (side) {
    p.rect(8, B, 8, torsoBottom - B + 1, outfit);
    if (look.robe) p.rect(7, L, 10, F - L - 2, outfit).rect(6, F - 2, 12, 2, outfit);
  } else {
    p.rect(7, B, 10, torsoBottom - B + 1, outfit);
    if (look.robe) p.rect(6, L, 12, F - L - 2, outfit).rect(5, F - 2, 14, 2, outfit);
  }
  if (side) {
    const swing = step === 1 ? 1 : step === 2 ? -1 : 0;
    p.rect(11 + swing, B + 1, 3, b.arm, outfit).rect(11 + swing, B + 1 + b.arm, 3, 2, look.skin);
  } else {
    sym(5, B + 1, 2, b.arm, outfit);
    sym(5, B + 1 + b.arm, 2, 2, look.skin);
  }

  // Head and hair.
  headRows(0, 11, look.skin);
  if (side) p.set(19, H + 7, look.skin);
  drawHair(p, look, view, H, headRows, sym);
  if (look.beard !== undefined && view !== 'up') {
    if (side) p.rect(13, H + 8, 6, 4, look.beard);
    else headRows(8, 11, look.beard, 7, 16);
  }
  drawHeadgear(p, look, view, H, headRows, sym);

  // Shading, then the details drawn flat on top.
  const shaded = new Set([look.skin, look.hair, outfit, legC, look.headgearColor ?? outfit, look.beard ?? look.hair]);
  p.bevel(shaded);
  const trim = look.trim;
  if (look.robe) p.rect(side ? 6 : 5, F - 1, side ? 12 : 14, 1, trim);
  else p.rect(side ? 8 : 7, L - 2 + bob, side ? 8 : 10, 1, trim);
  if (view === 'down') p.rect(9, B, 6, 1, trim).rect(11, B + 1, 2, 1, trim);
  else if (view === 'up') p.rect(8, B, 8, 1, trim);
  else p.rect(13, B, 3, 1, trim);
  if (look.headgear !== 'hood') drawFace(p, look, view, H);
  for (const a of look.accessories ?? []) drawAccessory(p, a, view, { H, B, L, F, robe: !!look.robe, trim });
  return p.outline(OUTLINE);
}

type RowFill = (r0: number, r1: number, c: number, x0?: number, x1?: number) => void;
type SymRect = (x: number, y: number, w: number, h: number, c: number) => void;

function drawFace(p: Pix, look: PlaceholderCharacter, view: View, H: number): void {
  const eye = PALETTE.k!;
  const shine = PALETTE.W!;
  const mouth = mix(look.skin, SHADOW, 0.45);
  if (view === 'down') {
    p.rect(8, H + 6, 2, 2, eye).rect(14, H + 6, 2, 2, eye).set(8, H + 6, shine).set(14, H + 6, shine);
    if (look.beard === undefined) p.rect(11, H + 9, 2, 1, mouth);
    p.set(7, H + 8, mix(look.skin, PALETTE.R!, 0.25)).set(16, H + 8, mix(look.skin, PALETTE.R!, 0.25));
  } else if (view === 'right') {
    p.rect(15, H + 6, 2, 2, eye).set(15, H + 6, shine);
    if (look.beard === undefined) p.set(17, H + 9, mouth);
  }
}

function drawHair(p: Pix, look: PlaceholderCharacter, view: View, H: number, headRows: RowFill, sym: SymRect): void {
  const c = look.hair;
  const style = look.hairStyle;
  const volume = style !== 'bald' && style !== 'cropped';
  if (view === 'up') {
    if (style === 'bald') {
      headRows(4, 8, c);
      return;
    }
    headRows(0, style === 'short' || style === 'cropped' ? 10 : 11, c);
    if (volume) p.rect(8, H - 1, 8, 1, c);
    if (style === 'long') p.rect(6, H + 12, 12, 5, c);
    if (style === 'curly') {
      p.rect(4, H + 2, 16, 15, c);
      for (let y = H + 3; y < H + 17; y += 3) p.set(3, y, c).set(20, y + 1, c);
    }
    if (style === 'braid') p.rect(11, H + 12, 2, 7, c).rect(11, H + 19, 2, 1, look.trim);
  } else if (view === 'down') {
    if (style === 'bald') {
      sym(5, H + 4, 2, 4, c);
      return;
    }
    headRows(0, style === 'cropped' ? 2 : style === 'curly' ? 4 : 3, c);
    if (volume) p.rect(8, H - 1, 8, 1, c);
    switch (style) {
      case 'cropped':
        sym(5, H + 3, 1, 3, c);
        break;
      case 'short':
      case 'bun':
      case 'braid':
        sym(5, H + 4, 2, 4, c);
        p.rect(7, H + 4, 3, 1, c);
        break;
      case 'long':
        sym(4, H + 2, 3, 14, c);
        break;
      case 'curly':
        p.rect(6, H - 1, 12, 1, c);
        for (const x of [7, 10, 13, 16]) p.rect(x, H - 2, 2, 1, c);
        sym(3, H + 1, 4, 15, c);
        for (let y = H + 2; y < H + 16; y += 3) sym(2, y, 1, 1, c);
        sym(4, H + 16, 2, 1, c);
        break;
      default:
        break;
    }
  } else {
    if (style === 'bald') {
      p.rect(7, H + 4, 5, 4, c);
      return;
    }
    headRows(0, style === 'cropped' ? 2 : 3, c);
    if (volume) p.rect(9, H - 1, 7, 1, c);
    switch (style) {
      case 'cropped':
        p.rect(6, H + 3, 4, 4, c);
        break;
      case 'short':
      case 'bun':
      case 'puffs':
      case 'braid':
        p.rect(6, H + 4, 5, 5, c).rect(15, H + 4, 3, 1, c);
        break;
      case 'long':
        p.rect(5, H, 7, 17, c).rect(15, H + 4, 3, 1, c);
        break;
      case 'curly':
        p.rect(3, H, 9, 17, c).rect(8, H - 2, 2, 1, c).rect(11, H - 2, 2, 1, c).rect(14, H - 1, 2, 1, c).rect(15, H + 4, 3, 1, c);
        for (let y = H + 1; y < H + 17; y += 3) p.set(2, y, c);
        break;
      default:
        break;
    }
  }
  // What rises above or stands out from the head.
  if (style === 'bun') p.rect(side(view) ? 7 : 9, H - 3, 6, 2, c).rect(side(view) ? 8 : 10, H - 4, 4, 1, c);
  if (style === 'puffs') {
    if (view === 'right') p.rect(2, H - 2, 6, 5, c).rect(3, H - 3, 4, 7, c).rect(12, H - 3, 4, 2, c);
    else {
      sym(1, H - 2, 6, 4, c);
      sym(2, H - 3, 4, 6, c);
    }
  }
  if (style === 'braid' && view !== 'up') {
    const x = view === 'right' ? 7 : 18;
    p.rect(x, H + 8, 2, 10, c).rect(x, H + 18, 2, 1, look.trim);
  }
}

function side(view: View): boolean {
  return view === 'right';
}

function drawHeadgear(p: Pix, look: PlaceholderCharacter, view: View, H: number, headRows: RowFill, sym: SymRect): void {
  const hg = look.headgearColor ?? look.outfit;
  const s = view === 'right';
  switch (look.headgear) {
    case 'cap':
      headRows(0, 2, hg);
      p.rect(s ? 9 : 7, H - 1, s ? 8 : 10, 1, hg);
      if (view === 'down') p.rect(6, H + 3, 12, 1, mix(hg, SHADOW, 0.4));
      if (s) p.rect(14, H + 3, 7, 1, mix(hg, SHADOW, 0.4));
      break;
    case 'bicorne':
      if (s) p.rect(7, H - 2, 11, 3, hg).rect(9, H - 3, 7, 1, hg).rect(18, H - 1, 1, 2, hg).rect(7, H + 1, 12, 1, look.trim);
      else p.rect(2, H, 20, 2, hg).rect(6, H - 2, 12, 2, hg).rect(8, H - 3, 8, 1, hg).rect(2, H + 1, 20, 1, look.trim);
      break;
    case 'circlet':
      headRows(3, 3, hg);
      if (view === 'down') p.rect(11, H + 2, 2, 2, PALETTE.R!);
      break;
    case 'headband':
      headRows(3, 3, hg);
      if (view === 'up') p.rect(11, H + 4, 2, 5, hg);
      if (s) p.rect(4, H + 3, 3, 1, hg).rect(4, H + 4, 2, 4, hg);
      break;
    case 'hood':
      if (s) p.rect(5, H - 2, 14, 15, hg).rect(13, H + 4, 6, 7, PALETTE.K!).set(16, H + 7, PALETTE.G!);
      else {
        p.rect(4, H - 2, 16, 15, hg).rect(11, H - 3, 2, 1, hg);
        if (view === 'down') p.rect(8, H + 4, 8, 8, PALETTE.K!).set(9, H + 7, PALETTE.G!).set(14, H + 7, PALETTE.G!);
      }
      break;
    case 'cowl':
      // A deep hood that still shows the face (the Quiet Crown): the face is cut back out of it.
      if (s) p.rect(5, H - 2, 14, 15, hg).rect(9, H - 3, 6, 1, hg);
      else p.rect(4, H - 2, 16, 15, hg).rect(11, H - 3, 2, 1, hg);
      if (s) headRows(4, 11, look.skin, 13);
      else if (view === 'down') headRows(4, 11, look.skin, 7, 16);
      break;
    case 'wrap':
      if (s) p.rect(6, H - 2, 13, 6, hg).rect(8, H - 3, 9, 1, hg).rect(8, H - 5, 4, 2, hg);
      else p.rect(5, H - 2, 14, 6, hg).rect(7, H - 3, 10, 1, hg).rect(10, H - 5, 4, 2, hg);
      break;
    case 'brimmed':
      if (s) p.rect(8, H - 3, 9, 4, hg).rect(4, H + 1, 18, 1, hg).rect(8, H, 9, 1, look.trim);
      else p.rect(7, H - 3, 10, 4, hg).rect(2, H + 1, 20, 1, hg).rect(7, H, 10, 1, look.trim);
      break;
    case 'helmet':
      headRows(0, 3, hg);
      p.rect(s ? 9 : 7, H - 1, s ? 8 : 10, 1, hg).rect(11, H - 3, 2, 2, PALETTE.R!);
      if (view === 'down') sym(5, H + 4, 2, 4, hg);
      if (s) p.rect(6, H + 4, 4, 4, hg);
      break;
    case undefined:
      break;
  }
}

interface Frame {
  H: number;
  B: number;
  L: number;
  F: number;
  robe: boolean;
  trim: number;
}

const VEIL = 0xd8d0c0;

function drawAccessory(p: Pix, a: NonNullable<PlaceholderCharacter['accessories']>[number], view: View, f: Frame): void {
  const { H, B, L, F } = f;
  const s = view === 'right';
  switch (a) {
    case 'satchel':
      if (view === 'down') p.line(16, B, 8, B + 6, PALETTE.B!).rect(4, B + 6, 5, 4, PALETTE.n!).rect(4, B + 6, 5, 1, PALETTE.B!);
      else if (view === 'up') p.line(7, B, 15, B + 6, PALETTE.B!).rect(15, B + 6, 5, 4, PALETTE.n!).rect(15, B + 6, 5, 1, PALETTE.B!);
      else p.line(13, B, 9, B + 5, PALETTE.B!).rect(5, B + 5, 4, 4, PALETTE.n!).rect(5, B + 5, 4, 1, PALETTE.B!);
      break;
    case 'locket':
      if (view === 'down') p.set(10, B + 1, PALETTE.y!).set(13, B + 1, PALETTE.y!).rect(11, B + 2, 2, 2, PALETTE.y!).set(11, B + 2, PALETTE.Y!);
      break;
    case 'bow':
      if (view === 'up') p.line(4, B - 4, 19, B + 8, PALETTE.n!).line(5, B - 4, 19, B + 7, PALETTE.N!);
      else if (s) p.rect(4, B - 4, 1, 13, PALETTE.n!).set(5, B - 5, PALETTE.n!).set(5, B + 9, PALETTE.n!);
      else p.rect(20, B - 5, 1, 12, PALETTE.n!).set(19, B - 6, PALETTE.n!);
      break;
    case 'hutia': {
      // Yari's hutia, at her feet: a small brown rodent with round ears.
      const x = view === 'down' ? 18 : 1;
      p.rect(x, F - 2, 5, 3, PALETTE.B!).rect(x + (view === 'down' ? 0 : 1), F - 3, 2, 1, PALETTE.B!).set(x + 3, F - 3, PALETTE.B!);
      p.set(view === 'down' ? x + 1 : x + 3, F - 1, PALETTE.k!).set(view === 'down' ? x : x + 4, F, PALETTE.N!);
      break;
    }
    case 'cane': {
      const x = s ? 18 : view === 'up' ? 3 : 20;
      p.rect(x, B + 5, 1, F - B - 4, PALETTE.b!).rect(x - 1, B + 5, 2, 1, PALETTE.b!);
      break;
    }
    case 'staff': {
      const x = s ? 19 : view === 'up' ? 3 : 20;
      p.rect(x, H + 2, 1, F - H - 1, PALETTE.n!).rect(x - 1, H, 3, 2, PALETTE.y!).set(x, H - 1, PALETTE.Y!);
      break;
    }
    case 'epaulettes':
      if (s) p.rect(10, B, 5, 1, PALETTE.y!);
      else p.rect(5, B, 4, 1, PALETTE.y!).rect(15, B, 4, 1, PALETTE.y!).rect(5, B + 1, 2, 1, PALETTE.y!).rect(17, B + 1, 2, 1, PALETTE.y!);
      break;
    case 'sash':
      if (view === 'down') p.line(7, B + 1, 16, B + 7, f.trim).line(7, B + 2, 15, B + 7, f.trim);
      else if (view === 'up') p.line(16, B + 1, 7, B + 7, f.trim).line(16, B + 2, 8, B + 7, f.trim);
      else p.rect(8, B + 4, 8, 2, f.trim);
      break;
    case 'veil':
      // The Quiet Crown's bone-white veil over the mouth and chin ("stealing voices").
      if (view === 'down') p.rect(7, H + 8, 10, 4, VEIL);
      else if (s) p.rect(14, H + 8, 6, 4, VEIL);
      break;
    case 'emblem':
      // The Quiet Crown's small silver crown, low on the chest.
      if (view === 'down') p.set(9, B + 4, PALETTE.I!).rect(11, B + 4, 2, 1, PALETTE.I!).set(14, B + 4, PALETTE.I!).rect(9, B + 5, 6, 2, PALETTE.I!).rect(11, B + 5, 2, 1, PALETTE.R!);
      else if (view === 'up') p.rect(10, B + 2, 4, 1, PALETTE.g!);
      break;
    case 'apron': {
      const bottom = f.robe ? F - 3 : L + 1;
      if (view === 'down') p.rect(8, B + 3, 8, bottom - B - 2, PALETTE.w!);
      else if (s) p.rect(13, B + 3, 4, bottom - B - 2, PALETTE.w!);
      else p.rect(7, B + 3, 10, 1, PALETTE.w!);
      break;
    }
    case 'drum': {
      const x = s ? 14 : view === 'up' ? 2 : 17;
      p.rect(x, B + 4, 5, 5, PALETTE.R!).rect(x, B + 4, 5, 1, PALETTE.w!).rect(x, B + 8, 5, 1, PALETTE.y!);
      break;
    }
  }
}
