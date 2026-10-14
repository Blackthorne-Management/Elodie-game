// Pure pixel drawing for the placeholders: a small pixel buffer, the pixel art in assets.pixels.ts,
// and the procedural characters (assets.config.ts NPC_SPRITES). No Phaser and no DOM except a
// canvas context handed in to draw on, so tests can check the drawings.

import { PALETTE, type PixelArt, type PlaceholderCharacter } from '../assets.config.ts';
import { CHARACTER_HEIGHT, CHARACTER_WIDTH } from '../config.ts';
import type { Dir } from '../engine/types.ts';

const OUTLINE = PALETTE.k!;

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

/**
 * One 16 x 24 character frame. `step` 0 stands; 1 and 2 put one foot forward (the walk cycle is
 * 1, 0, 2, 0). Everything gets a 1 px dark outline; the shadow is drawn separately.
 */
export function characterPix(look: PlaceholderCharacter, facing: Dir, step: 0 | 1 | 2 = 0): Pix {
  const p = new Pix(CHARACTER_WIDTH, CHARACTER_HEIGHT);
  const build = look.build ?? 'normal';
  const H = build === 'small' ? 8 : build === 'tall' ? 3 : 5; // head top
  const torsoTop = H + 7;
  const side = facing === 'left' || facing === 'right';
  const x0 = side ? 5 : 4;
  const x1 = side ? 10 : 11;
  const legs = look.legs ?? PALETTE.K!;
  const dark = PALETTE.k!;

  // Legs and feet (a step moves one foot down a pixel and the other up).
  const footL = step === 1 ? 1 : step === 2 ? -1 : 0;
  const footR = -footL;
  if (!look.robe) {
    if (side) {
      p.rect(6, 19, 2, 3 + footL, legs).rect(8, 19, 2, 3 + footR, legs);
    } else {
      p.rect(5, 19, 2, 3 + footL, legs).rect(9, 19, 2, 3 + footR, legs);
    }
  }
  // Torso (a robe flares to the ankles), arms, hands.
  const bottom = look.robe ? 21 : 18;
  p.rect(x0, torsoTop, x1 - x0 + 1, bottom - torsoTop + 1, look.outfit);
  if (look.robe) {
    p.rect(x0 - 1, bottom - 3, x1 - x0 + 3, 4, look.outfit);
    p.rect(x0 - 1, bottom, x1 - x0 + 3, 1, look.trim);
    if (step !== 0) p.rect(side ? 7 : step === 1 ? 5 : 9, 22, 2, 1, legs);
  }
  if (side) {
    const ax = facing === 'left' ? 6 : 8;
    p.rect(ax, torsoTop + 1, 2, 5, shade(look.outfit));
    p.rect(ax, torsoTop + 6, 2, 1, look.skin);
  } else {
    p.rect(x0 - 1, torsoTop + 1, 1, 5, look.outfit).rect(x1 + 1, torsoTop + 1, 1, 5, look.outfit);
    p.set(x0 - 1, torsoTop + 6, look.skin).set(x1 + 1, torsoTop + 6, look.skin);
  }
  // Collar and belt.
  if (facing !== 'up') p.rect(side ? 7 : 6, torsoTop, side ? 2 : 4, 1, look.trim);
  if (!look.robe) p.rect(x0, torsoTop + 5, x1 - x0 + 1, 1, look.trim);

  // Head, face.
  p.rect(x0, H, x1 - x0 + 1, 7, look.skin);
  if (facing === 'down') p.set(6, H + 3, dark).set(9, H + 3, dark);
  if (facing === 'left') p.set(5, H + 3, dark).set(4, H + 4, look.skin);
  if (facing === 'right') p.set(10, H + 3, dark).set(11, H + 4, look.skin);

  // Hair.
  const hair = look.hair;
  const back = facing === 'left' ? x1 : x0; // the back of the head, seen from the side
  const capRows = (from: number, to: number) => p.rect(x0, from, x1 - x0 + 1, to - from + 1, hair);
  switch (look.hairStyle) {
    case 'bald':
      if (facing === 'up') p.rect(x0, H + 3, x1 - x0 + 1, 2, hair);
      else if (side) p.rect(back - (facing === 'left' ? 1 : 0), H + 2, 2, 3, hair);
      else p.rect(x0, H + 2, 1, 3, hair).rect(x1, H + 2, 1, 3, hair);
      break;
    case 'cropped':
      capRows(H - 1, H);
      if (facing === 'up') capRows(H - 1, H + 4);
      break;
    case 'short':
      capRows(H - 1, H + 1);
      if (facing === 'up') capRows(H - 1, H + 5);
      else if (side) p.rect(facing === 'left' ? x1 - 2 : x0, H + 1, 3, 4, hair);
      else p.rect(x0, H + 2, 1, 2, hair).rect(x1, H + 2, 1, 2, hair);
      break;
    case 'long':
    case 'curly':
    case 'braid': {
      capRows(H - 1, H + 1);
      const len = look.hairStyle === 'braid' ? 3 : 9;
      if (facing === 'up') p.rect(x0, H - 1, x1 - x0 + 1, len + 3, hair);
      else if (side) p.rect(facing === 'left' ? x1 - 2 : x0 - 1, H, 4, len + 1, hair);
      else p.rect(x0 - 1, H, 2, len, hair).rect(x1, H, 2, len, hair);
      if (look.hairStyle === 'curly') {
        for (let x = x0 - 1; x <= x1 + 1; x += 2) p.set(x, H - 2, hair);
        if (!side && facing !== 'up') p.set(x0 - 2, H + 3, hair).set(x1 + 2, H + 5, hair).set(x0 - 2, H + 7, hair).set(x1 + 2, H + 8, hair);
      }
      if (look.hairStyle === 'braid') {
        const bx = side ? back + (facing === 'left' ? 1 : -1) : facing === 'up' ? 8 : x1 + 1;
        p.rect(bx, H + 3, 1, 8, hair);
        p.set(bx, H + 11, look.trim);
      }
      break;
    }
    case 'bun':
      capRows(H - 1, H + 1);
      if (facing === 'up') capRows(H - 1, H + 4);
      p.rect(side ? (facing === 'left' ? x1 - 3 : x0 + 1) : 6, H - 4, 4, 3, hair);
      break;
    case 'puffs':
      capRows(H - 1, H + 1);
      if (facing === 'up') capRows(H - 1, H + 4);
      if (side) p.rect(facing === 'left' ? x1 - 1 : x0 - 2, H - 2, 3, 4, hair);
      else p.rect(x0 - 3, H - 2, 3, 4, hair).rect(x1 + 1, H - 2, 3, 4, hair);
      break;
  }
  if (look.beard !== undefined && facing !== 'up') {
    if (side) p.rect(facing === 'left' ? x0 : x0 + 2, H + 5, 4, 3, look.beard);
    else p.rect(x0 + 1, H + 5, x1 - x0 - 1, 3, look.beard);
  }

  // Headgear.
  const hg = look.headgearColor ?? look.outfit;
  switch (look.headgear) {
    case 'cap':
      capRows(H - 1, H);
      if (facing === 'down') p.rect(x0, H + 1, x1 - x0 + 1, 1, shade(hg));
      else if (side) p.rect(facing === 'left' ? x0 - 2 : x1, H + 1, 3, 1, shade(hg));
      p.rect(x0, H - 1, x1 - x0 + 1, 2, hg);
      break;
    case 'bicorne':
      p.rect(x0 - 2, H - 2, x1 - x0 + 5, 2, hg).rect(x0, H - 3, x1 - x0 + 1, 1, hg);
      p.rect(x0 - 2, H, x1 - x0 + 5, 1, look.trim);
      break;
    case 'circlet':
      if (facing !== 'up') {
        p.rect(x0, H, x1 - x0 + 1, 1, hg);
        if (facing === 'down') p.rect(7, H - 1, 2, 2, PALETTE.R!);
      } else p.rect(x0, H + 1, x1 - x0 + 1, 1, hg);
      break;
    case 'headband':
      p.rect(x0, H + 1, x1 - x0 + 1, 1, hg);
      if (facing === 'up' || side) p.rect(side ? back : 8, H + 2, 1, 3, hg);
      break;
    case 'hood': {
      p.rect(x0 - 1, H - 2, x1 - x0 + 3, 10, hg);
      if (facing === 'down') p.rect(x0 + 1, H + 2, x1 - x0 - 1, 5, PALETTE.k!).set(6, H + 4, PALETTE.G!).set(9, H + 4, PALETTE.G!);
      else if (side) p.rect(facing === 'left' ? x0 - 1 : x1 - 2, H + 2, 4, 5, PALETTE.k!);
      p.set(8, H - 3, hg);
      break;
    }
    case 'wrap':
      p.rect(x0 - 1, H - 3, x1 - x0 + 3, 4, hg).rect(7, H - 5, 2, 2, hg).set(8, H - 5, shade(hg, 1.3));
      break;
    case 'brimmed':
      p.rect(x0 - 3, H, x1 - x0 + 7, 1, hg).rect(x0, H - 3, x1 - x0 + 1, 3, hg).rect(x0, H - 1, x1 - x0 + 1, 1, shade(hg));
      break;
    case 'helmet':
      p.rect(x0 - 1, H - 2, x1 - x0 + 3, 4, hg).rect(7, H - 4, 2, 2, PALETTE.R!);
      break;
    case undefined:
      break;
  }

  // What they carry.
  for (const a of look.accessories ?? []) {
    switch (a) {
      case 'satchel':
        if (facing === 'down') p.line(x1, torsoTop, x0 + 1, torsoTop + 5, PALETTE.B!).rect(x0 - 1, torsoTop + 5, 3, 3, PALETTE.n!);
        else if (facing === 'up') p.line(x0, torsoTop, x1 - 1, torsoTop + 5, PALETTE.B!).rect(x1, torsoTop + 5, 3, 3, PALETTE.n!);
        else p.rect(facing === 'left' ? x1 - 1 : x0 - 1, torsoTop + 4, 3, 3, PALETTE.n!);
        break;
      case 'locket':
        if (facing === 'down') p.set(7, torsoTop + 2, PALETTE.y!).set(8, torsoTop + 2, PALETTE.Y!);
        break;
      case 'bow':
        if (facing === 'up') p.line(x0 - 1, torsoTop - 2, x1 + 1, torsoTop + 7, PALETTE.n!);
        else if (side) p.line(back + (facing === 'left' ? 2 : -2), torsoTop - 3, back + (facing === 'left' ? 2 : -2), torsoTop + 7, PALETTE.n!);
        else p.line(x1 + 2, torsoTop - 2, x1 + 2, torsoTop + 6, PALETTE.n!);
        break;
      case 'hutia': {
        // Yari's hutia, at her feet (on the side away from where she faces).
        const hx = facing === 'right' ? 0 : 12;
        p.rect(hx, 20, 4, 2, PALETTE.B!).rect(hx + (facing === 'right' ? 0 : 2), 19, 2, 1, PALETTE.B!);
        p.set(hx + (facing === 'right' ? 0 : 3), 20, PALETTE.k!).set(hx + (facing === 'right' ? 3 : 0), 21, PALETTE.n!);
        break;
      }
      case 'cane': {
        const cx = facing === 'left' ? 2 : 13;
        p.rect(cx, torsoTop + 3, 1, 22 - torsoTop - 3, PALETTE.b!).set(cx + (facing === 'left' ? 1 : -1), torsoTop + 3, PALETTE.b!);
        break;
      }
      case 'staff': {
        const sx = facing === 'left' ? 2 : 13;
        p.rect(sx, H, 1, 22 - H, PALETTE.n!).rect(sx, H - 2, 1, 2, PALETTE.y!);
        break;
      }
      case 'epaulettes':
        if (!side) p.rect(x0 - 1, torsoTop, 2, 1, PALETTE.y!).rect(x1, torsoTop, 2, 1, PALETTE.y!);
        else p.rect(7, torsoTop, 2, 1, PALETTE.y!);
        break;
      case 'sash':
        if (facing === 'down') p.line(x0, torsoTop + 1, x1, torsoTop + 5, look.trim);
        else if (facing === 'up') p.line(x1, torsoTop + 1, x0, torsoTop + 5, look.trim);
        break;
      case 'emblem':
        // The Quiet Crown's silver crown, low on the chest (clear of the hooded face).
        if (facing === 'down') p.set(5, torsoTop + 4, PALETTE.I!).rect(7, torsoTop + 4, 2, 1, PALETTE.I!).set(10, torsoTop + 4, PALETTE.I!).rect(5, torsoTop + 5, 6, 2, PALETTE.I!).rect(7, torsoTop + 5, 2, 1, PALETTE.R!);
        else if (facing === 'up') p.rect(6, torsoTop + 2, 4, 1, PALETTE.g!);
        break;
      case 'apron':
        if (facing !== 'up') p.rect(side ? 6 : 5, torsoTop + 3, side ? 4 : 6, 5, PALETTE.w!);
        break;
      case 'drum':
        p.rect(facing === 'left' ? 2 : 11, torsoTop + 4, 4, 3, PALETTE.R!).rect(facing === 'left' ? 2 : 11, torsoTop + 4, 4, 1, PALETTE.w!);
        break;
    }
  }
  return p.outline(OUTLINE);
}

/** A darker (or, above 1, lighter) version of a colour. */
function shade(color: number, k = 0.75): number {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (c((color >> 16) & 255) << 16) | (c((color >> 8) & 255) << 8) | c(color & 255);
}

