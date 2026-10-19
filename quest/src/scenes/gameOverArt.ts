// The Game Over placeholder, drawn in code on a 320 x 180 canvas until the animator's films arrive
// (docs/quest/intro/GAME-OVER-STORYBOARD.md; the files and colours are in assets.config.ts GAME_OVER_ART).
// Same clock as the films: the fall (dark, dusk rising, GAME OVER, the letters unravelling into gold threads,
// the loom falling and her presence fading in, the eye opening halfway), the breathing loop, and the rise (the
// threads drawn up from the edges inward, then the gold flash to cream). Her face is never shown: soft light
// and one calm gold eye, half closed. The lower third (y 120 to 180) stays dark for her words.
// Browser-only drawing; the timings come from engine/gameOver.ts and config.ts.

import { GAME_OVER_ART } from '../assets.config.ts';
import { GAME_OVER, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { fallShotAt } from '../engine/gameOver.ts';

const C = GAME_OVER_ART.colors;
const W = VIEW_WIDTH;
const H = VIEW_HEIGHT;
/** Nothing important below this line: the game's words go there. */
const TEXT_TOP = 120;
const CX = W / 2;
const EYE = { x: CX, y: 46 };

/** A 5 x 7 pixel font for the two words. */
const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

/** A fixed little generator, so the threads and stars are the same every time. */
function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Thread {
  x: number;
  /** Where its tip hangs when strung. */
  len: number;
  /** When it starts to fall in the loom shot (0 to 1 of the shot). */
  delay: number;
  phase: number;
}
interface Star {
  x: number;
  y: number;
  /** When it lights in the loom shot (0 to 1). */
  at: number;
  phase: number;
}

const rnd = seeded(19);
const THREADS: readonly Thread[] = Array.from({ length: GAME_OVER_ART.threads }, (_, i) => {
  const x = Math.round(48 + (i * (W - 96)) / (GAME_OVER_ART.threads - 1));
  const centre = 1 - Math.abs(x - CX) / (CX - 40);
  return { x, len: Math.round(40 + centre * 50 + rnd() * 22), delay: rnd() * 0.45, phase: rnd() * Math.PI * 2 };
});
const STARS: readonly Star[] = Array.from({ length: GAME_OVER_ART.stars }, (_, i) => ({
  x: Math.round(8 + rnd() * (W - 16)),
  y: Math.round(6 + rnd() * (TEXT_TOP - 30)),
  at: (i / GAME_OVER_ART.stars) * 0.85,
  phase: rnd() * GAME_OVER.loopS,
}));

type Ctx = CanvasRenderingContext2D;

function fill(ctx: Ctx, color: string, alpha = 1): void {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
}

function px(ctx: Ctx, x: number, y: number, color: string, w = 1, h = 1): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** GAME OVER in cream pixel letters about 14 px tall, centred at y 70. `lift` raises each column (the unravel). */
function drawLetters(ctx: Ctx, alpha: number, unravel = 0): void {
  const text = 'GAME OVER';
  const scale = 2;
  const width = text.length * 6 * scale - scale;
  const left = Math.round(CX - width / 2);
  const top = 70 - Math.round((7 * scale) / 2);
  const r = seeded(5);
  for (let i = 0; i < text.length; i++) {
    const g = GLYPHS[text[i]!]!;
    for (let col = 0; col < 5; col++) {
      // Each stroke column rises at its own speed and turns from cream to gold as it comes apart.
      const speed = 0.6 + r() * 0.8;
      const lift = unravel * unravel * 90 * speed;
      const a = alpha * clamp01(1 - unravel * unravel * 1.1);
      if (a <= 0) continue;
      ctx.globalAlpha = a;
      for (let row = 0; row < 7; row++) {
        if (g[row]![col] !== '#') continue;
        const x = left + (i * 6 + col) * scale;
        const y = top + row * scale - lift;
        px(ctx, x, y, unravel > 0.25 ? C.gold : C.cream, scale, scale);
      }
      // A thread pulled up out of the stroke.
      if (unravel > 0 && g.some((line) => line[col] === '#')) {
        ctx.globalAlpha = a * 0.8;
        const x = left + (i * 6 + col) * scale;
        const len = Math.round(unravel * 40 * speed);
        px(ctx, x, top - lift - len, C.paleGold, 1, len);
      }
    }
  }
  ctx.globalAlpha = 1;
}

/** The stars: lit (0 to 1 of the loom shot), twinkling in the loop (two frames each). */
function drawStars(ctx: Ctx, lit: number, t: number | null, alpha = 1): void {
  for (const s of STARS) {
    if (lit < s.at) continue;
    const blink = t !== null && Math.floor(((t + s.phase) * 12) % (GAME_OVER.loopS * 12)) < 2;
    ctx.globalAlpha = alpha * clamp01((lit - s.at) * 8);
    px(ctx, s.x, s.y, blink ? C.paleGold : C.cream);
    if (blink) {
      px(ctx, s.x - 1, s.y, C.gold);
      px(ctx, s.x + 1, s.y, C.gold);
      px(ctx, s.x, s.y - 1, C.gold);
      px(ctx, s.x, s.y + 1, C.gold);
    }
  }
  ctx.globalAlpha = 1;
}

/**
 * The threads. `strung` (0 to 1): how far down they have fallen; `sway` the loop's time (null: still);
 * `drawn` (0 to 1): the rise, drawing them back up from the edges inward.
 */
function drawThreads(ctx: Ctx, strung: number, sway: number | null, drawn = 0, alpha = 1): void {
  THREADS.forEach((th, i) => {
    const k = clamp01((strung - th.delay) / (1 - th.delay));
    const edge = Math.abs(th.x - CX) / CX; // 0 centre, 1 edge
    const up = clamp01(drawn * 1.6 - (1 - edge) * 0.6);
    const len = Math.round(th.len * k * (1 - up));
    if (len <= 0) return;
    const dx = sway === null ? 0 : Math.round(Math.sin((sway / GAME_OVER.loopS) * Math.PI * 2 + th.phase));
    const shimmer = sway !== null && i % 7 === 3 && Math.sin((sway / GAME_OVER.loopS) * Math.PI * 2 + i) > 0.6;
    ctx.globalAlpha = alpha;
    px(ctx, th.x + dx, 0, shimmer ? C.paleGold : C.gold, 1, Math.min(len, TEXT_TOP - 4));
    // Lit at the tip.
    if (len < TEXT_TOP - 4) px(ctx, th.x + dx, len - 1, C.paleGold, 1, 2);
  });
  ctx.globalAlpha = 1;
}

/** A line of pixels between two points (her shape is woven: every other pixel pale). */
function weave(ctx: Ctx, x0: number, y0: number, x1: number, y1: number): void {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const y = y0 + ((y1 - y0) * i) / n;
    px(ctx, x, y, i % 2 ? C.paleGold : C.gold);
  }
}

/**
 * Her presence: shoulders and two open hands woven of threads, palms up; where a face would be, soft pale-gold
 * light and one gold eye, open by `eye` (0 shut to 1 half open; it never opens further, and never blinks).
 * `breath`: the hands rise and fall by one pixel.
 */
function drawPresence(ctx: Ctx, alpha: number, eye: number, breath = 0): void {
  if (alpha <= 0) return;
  // The light where a face would be (a glow is the one soft gradient the style allows).
  const glow = ctx.createRadialGradient(EYE.x, EYE.y, 1, EYE.x, EYE.y, 22);
  glow.addColorStop(0, C.paleGold);
  glow.addColorStop(1, 'rgba(255,242,160,0)');
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillStyle = glow;
  ctx.fillRect(EYE.x - 24, EYE.y - 24, 48, 48);
  ctx.globalAlpha = alpha;
  // Shoulders, arms and open hands.
  const hy = 98 - breath;
  weave(ctx, CX, 64, CX - 34, 74);
  weave(ctx, CX, 64, CX + 34, 74);
  weave(ctx, CX - 34, 74, CX - 46, 96);
  weave(ctx, CX + 34, 74, CX + 46, 96);
  for (const side of [-1, 1]) {
    const x = CX + side * 52;
    // A cupped palm, fingers up at the outer edge.
    weave(ctx, x - 9, hy, x + 9, hy);
    weave(ctx, x - 9, hy, x - 11, hy - 4);
    weave(ctx, x + 9, hy, x + 11, hy - 4);
    px(ctx, x - 6, hy + 1, C.gold, 12, 1);
    px(ctx, x - 3, hy - 1, C.paleGold, 6, 1);
  }
  // The eye: an almond, half closed at most; its lid a dark line over the gold.
  const open = Math.round(clamp01(eye) * 2);
  px(ctx, EYE.x - 6, EYE.y, C.night, 13, 1);
  if (open > 0) {
    px(ctx, EYE.x - 5, EYE.y + 1, C.gold, 11, open);
    px(ctx, EYE.x - 1, EYE.y + 1, C.paleGold, 3, open);
    px(ctx, EYE.x - 4, EYE.y + 1 + open, C.night, 9, 1);
  }
  ctx.globalAlpha = 1;
}

/** The deep night-blue sky, and the calm dark band the words sit on. */
function sky(ctx: Ctx, alpha = 1): void {
  fill(ctx, C.navy, alpha);
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillStyle = C.night;
  ctx.fillRect(0, TEXT_TOP, W, H - TEXT_TOP);
  ctx.globalAlpha = 1;
}

/** The held pose (the still, and the loop at time `t`; null for no motion). */
function heldPose(ctx: Ctx, t: number | null): void {
  sky(ctx);
  drawStars(ctx, 1, t);
  drawThreads(ctx, 1, t);
  const breath = t === null ? 0 : Math.round((Math.sin((t / GAME_OVER.loopS) * Math.PI * 2) + 1) / 2);
  drawPresence(ctx, 1, 1, breath);
}

/** With reduced motion: how far the held pose has faded in during the fall (after GAME OVER). */
export function reducedPoseAlpha(t: number): number {
  const r = GAME_OVER.reduced;
  return clamp01((t - r.lettersS - r.stillS + 0.6) / 0.6);
}

let stillCache: HTMLCanvasElement | null = null;

/** The held pose drawn once (the reduced-motion fall fades it in). */
function stillPose(): HTMLCanvasElement | null {
  if (stillCache) return stillCache;
  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const o = off.getContext('2d');
  if (!o) return null;
  o.imageSmoothingEnabled = false;
  fill(o, C.night);
  heldPose(o, null);
  stillCache = off;
  return off;
}

export type ArtSegment = 'fall' | 'loop' | 'rise' | 'still';

/** Draw one frame. `t`: seconds into the segment. `reduced`: plain fades, no falling threads, no flash. */
export function drawGameOverArt(ctx: Ctx, segment: ArtSegment, t: number, reduced: boolean): void {
  ctx.imageSmoothingEnabled = false;
  fill(ctx, C.night);
  if (segment === 'still') return heldPose(ctx, null);
  if (segment === 'loop') return heldPose(ctx, reduced ? null : t % GAME_OVER.loopS);
  if (segment === 'rise') {
    if (reduced) {
      heldPose(ctx, null);
      fill(ctx, C.cream, clamp01(t / GAME_OVER.reduced.riseS));
      return;
    }
    const k = clamp01(t / GAME_OVER.riseFlashS);
    sky(ctx);
    drawStars(ctx, 1, null, clamp01(1.4 - k * 1.2));
    drawThreads(ctx, 1, null, k);
    drawPresence(ctx, clamp01(1 - k * 1.3), 1);
    const f = clamp01((t - GAME_OVER.riseFlashS) / (GAME_OVER.riseS - GAME_OVER.riseFlashS));
    if (f > 0) {
      fill(ctx, C.paleGold, clamp01(f * 2));
      fill(ctx, C.cream, clamp01(f * 2 - 1));
    }
    return;
  }
  // The fall.
  if (reduced) {
    const r = GAME_OVER.reduced;
    sky(ctx, clamp01(t / 0.4));
    const letters = t < r.lettersS + r.stillS ? clamp01(t / r.lettersS) * clamp01((r.lettersS + r.stillS - t) / 0.4) : 0;
    if (letters > 0) drawLetters(ctx, letters);
    const pose = reducedPoseAlpha(t);
    const still = pose > 0 ? stillPose() : null;
    if (still) {
      ctx.globalAlpha = pose;
      ctx.drawImage(still, 0, 0);
      ctx.globalAlpha = 1;
    }
    return;
  }
  const { shot, k } = fallShotAt(t);
  if (shot === 'dark') return;
  if (shot === 'dusk') {
    // Deep night blue rises from the bottom like dusk.
    const top = Math.round(H * (1 - k));
    ctx.fillStyle = C.navy;
    ctx.fillRect(0, top, W, H - top);
    return;
  }
  sky(ctx);
  if (shot === 'letters') {
    drawLetters(ctx, clamp01(((t - GAME_OVER.shots.letters) / GAME_OVER.lettersFadeS)));
    return;
  }
  if (shot === 'unravel') {
    drawLetters(ctx, 1, k);
    return;
  }
  // The loom: threads fall from the top, stars light one by one, her shape fades in, the eye opens halfway.
  drawStars(ctx, k, null);
  drawThreads(ctx, Math.min(1, k * 1.25), null);
  drawPresence(ctx, clamp01((k - 0.3) / 0.6), clamp01((k - 0.85) / 0.15));
}
