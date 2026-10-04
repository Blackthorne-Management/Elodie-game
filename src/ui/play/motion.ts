// Smooth motion for the 2.5D view. One animation loop moves every pawn along its path at a steady
// speed and eases the camera after whoever is moving, writing transforms straight to the DOM each
// frame (no React re-render per frame, no restarting CSS transitions), so nothing stutters.
import { useEffect, useRef, useState } from 'react';
import type { GameState, Pos } from '../../engine/types';
import { samePos, walkPath } from '../../engine/board';

export const CELL = 64;
export const TILT = 46;
const CAMERA_MAX_SPEED = 11;        // squares per second

export class Motion {
  pos = new Map<number, Pos>();          // where each pawn is drawn right now (fractional squares)
  dest = new Map<number, Pos>();         // where each pawn will end up once its walk finishes
  private queue = new Map<number, Pos[]>();
  private order: number[] = [];          // pawns waiting to walk; only the first walks, so you can follow each
  private cam: Pos;
  private fixed: Pos;
  private followWalker = true;
  private tokens = new Map<number, HTMLElement>();
  private camEl: HTMLElement | null = null;
  private raf = 0;
  private last = 0;
  speed = 6.5;                           // squares per second
  onBusy: (busy: boolean) => void = () => {};

  constructor(start: Record<number, Pos | null>, focus: Pos) {
    for (const [id, p] of Object.entries(start)) if (p) { this.pos.set(+id, { ...p }); this.dest.set(+id, { ...p }); }
    this.cam = { ...focus };
    this.fixed = { ...focus };
  }

  get busy() { return this.order.length > 0; }

  configure(onBusy: (busy: boolean) => void, speed: number) {
    this.onBusy = onBusy;
    this.speed = speed;
  }

  jump(id: number, to: Pos | null) {
    this.queue.delete(id);
    this.order = this.order.filter(x => x !== id);
    if (to) { this.pos.set(id, { ...to }); this.dest.set(id, { ...to }); } else { this.pos.delete(id); this.dest.delete(id); }
    this.paintToken(id);
    if (!this.busy) this.onBusy(false);
    this.kick();
  }

  walkTo(id: number, to: Pos) {
    const from = this.dest.get(id);
    if (!from) return this.jump(id, to);
    if (samePos(from, to)) return;
    if (this.speed === Infinity) return this.jump(id, to);
    this.queue.set(id, [...(this.queue.get(id) ?? []), ...walkPath(from, to)]);
    this.dest.set(id, { ...to });
    if (!this.order.includes(id)) this.order.push(id);
    this.onBusy(true);
    this.kick();
  }

  // Camera target: the pawn currently walking, else a fixed square.
  setFocus(fixed: Pos, followWalker: boolean) {
    this.fixed = { ...fixed };
    this.followWalker = followWalker;
    this.kick();
  }

  registerToken(id: number, el: HTMLElement | null) {
    if (el) { this.tokens.set(id, el); this.paintToken(id); } else this.tokens.delete(id);
  }
  registerCamera(el: HTMLElement | null) {
    this.camEl = el;
    this.paintCamera();
  }

  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }

  private kick() {
    if (!this.raf) { this.last = performance.now(); this.raf = requestAnimationFrame(t => this.frame(t)); }
  }

  private frame(t: number) {
    const dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;

    // Move the front walker toward its next square.
    const id = this.order[0];
    if (id !== undefined) {
      const q = this.queue.get(id)!;
      const p = this.pos.get(id)!;
      let budget = this.speed * dt;
      while (budget > 0 && q.length) {
        const n = q[0];
        const dx = n.x - p.x, dy = n.y - p.y;
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist <= budget) { p.x = n.x; p.y = n.y; budget -= dist; q.shift(); }
        else { p.x += Math.sign(dx) * Math.min(Math.abs(dx), budget); p.y += Math.sign(dy) * Math.min(Math.abs(dy), budget); budget = 0; }
      }
      this.paintToken(id);
      if (!q.length) {
        this.queue.delete(id);
        this.order.shift();
        if (!this.busy) this.onBusy(false);
      }
    }

    // Ease the camera toward its target (frame-rate independent smoothing).
    const walker = this.order[0];
    const target = this.followWalker && walker !== undefined ? this.pos.get(walker)! : this.fixed;
    // Eased, with a speed limit so long pans across the board stay gentle.
    const k = 1 - Math.exp(-dt * 4);
    let sx = (target.x - this.cam.x) * k, sy = (target.y - this.cam.y) * k;
    const len = Math.hypot(sx, sy), max = CAMERA_MAX_SPEED * dt;
    if (len > max) { sx *= max / len; sy *= max / len; }
    this.cam.x += sx;
    this.cam.y += sy;
    this.paintCamera();

    const settled = Math.abs(target.x - this.cam.x) < 0.002 && Math.abs(target.y - this.cam.y) < 0.002;
    if (this.busy || !settled) this.raf = requestAnimationFrame(tt => this.frame(tt));
    else { this.raf = 0; this.cam = { ...target }; this.paintCamera(); }
  }

  private paintToken(id: number) {
    const el = this.tokens.get(id);
    const p = this.pos.get(id);
    if (el && p) el.style.transform = `translate3d(${p.x * CELL + CELL / 2}px, ${p.y * CELL + CELL / 2}px, 0)`;
  }
  private paintCamera() {
    if (this.camEl) {
      const x = this.cam.x * CELL + CELL / 2, y = this.cam.y * CELL + CELL / 2;
      this.camEl.style.transform = `rotateX(${TILT}deg) translate3d(${-x}px, ${-y}px, 0)`;
    }
  }
}

// Keeps a Motion in step with the game: whenever a pawn is somewhere new, it walks there (or jumps,
// for teleports and heirs rising at home).
export function useMotion(s: GameState, version: number, speed: number, initialFocus: Pos) {
  const [m] = useState(() => new Motion(Object.fromEntries(s.players.map(p => [p.id, p.pos])), initialFocus));
  const [busy, setBusy] = useState(false);
  const lastSeq = useRef(s.seq);

  useEffect(() => { m.configure(setBusy, speed); }, [m, speed]);
  useEffect(() => () => m.stop(), [m]);

  useEffect(() => {
    const jumped = new Set<number>();
    for (const e of s.log) {
      if (e.seq <= lastSeq.current) continue;
      if (e.player !== undefined && ['teleport', 'succession', 'specter'].includes(e.kind)) jumped.add(e.player);
      if (e.player !== undefined && /bridges the gap/.test(e.text)) jumped.add(e.player);
    }
    lastSeq.current = s.seq;
    for (const p of s.players) {
      if (!p.pos || p.specter) { if (m.dest.has(p.id)) m.jump(p.id, null); continue; }
      if (jumped.has(p.id) || !m.dest.has(p.id)) m.jump(p.id, p.pos);
      else m.walkTo(p.id, p.pos);
    }
  }, [version, s, m]);

  return { motion: m, busy };
}
