// Battle effects (owner, Oct 15): the fighters never walk or lunge; only these play over them. Slash,
// claw, impact, arrow, heal, buff and debuff, the five elements and Anissa's Surge, all drawn in code
// from small squares so they sit with the pixel art (colours: assets.config.ts BATTLE_FX). Each one
// removes itself and returns how long it runs. Painted effect sheets can replace any of them later.

import Phaser from 'phaser';
import { BATTLE_FX } from '../assets.config.ts';

export type FxKind =
  | 'slash'
  | 'claw'
  | 'impact'
  | 'arrow'
  | 'heal'
  | 'buff'
  | 'debuff'
  | 'light'
  | 'fire'
  | 'water'
  | 'wind'
  | 'earth'
  | 'surge';

export const FX_KINDS: readonly FxKind[] = ['slash', 'claw', 'impact', 'arrow', 'heal', 'buff', 'debuff', 'light', 'fire', 'water', 'wind', 'earth', 'surge'];

const DEPTH = 250;
/** Effects are drawn this much larger than their sketch, around the target (chunkier squares too). */
const FX_SCALE = 1.25;

/** For screenshots: draw every effect frozen at this point of its run (0 to 1), or null to animate. */
let frozenAt: number | null = null;

export interface Point {
  x: number;
  y: number;
}

/** Play an effect centred on `at` (an arrow flies from `from`); returns its length in ms. */
export function playFx(scene: Phaser.Scene, kind: FxKind, at: Point, from?: Point, freezeAt?: number): number {
  frozenAt = freezeAt ?? null;
  pivot = at;
  try {
    return run(scene, kind, at, from);
  } finally {
    frozenAt = null;
  }
}

/** The point effects grow around (the target). */
let pivot: Point = { x: 0, y: 0 };

function run(scene: Phaser.Scene, kind: FxKind, at: Point, from?: Point): number {
  switch (kind) {
    case 'slash':
      return slash(scene, at, BATTLE_FX.slash, 1);
    case 'claw':
      return slash(scene, at, BATTLE_FX.claw, 3);
    case 'impact':
      return impact(scene, at, BATTLE_FX.impact, 1);
    case 'arrow':
      return arrow(scene, from ?? { x: at.x - 120, y: at.y }, at);
    case 'heal':
      return sparkles(scene, at, BATTLE_FX.heal, BATTLE_FX.healCore, true);
    case 'buff':
      return chevrons(scene, at, BATTLE_FX.buff, -1);
    case 'debuff':
      return chevrons(scene, at, BATTLE_FX.debuff, 1);
    case 'light':
      return light(scene, at);
    case 'fire':
      return fire(scene, at);
    case 'water':
      return water(scene, at);
    case 'wind':
      return wind(scene, at);
    case 'earth':
      return earth(scene, at);
    case 'surge':
      return surge(scene, at);
  }
}

/** Animate a drawing: `draw(g, t)` with t from 0 to 1 over `ms`, then remove it. */
function animate(scene: Phaser.Scene, ms: number, draw: (g: Phaser.GameObjects.Graphics, t: number) => void, delay = 0, scaled = true): void {
  const g = scene.add.graphics().setDepth(DEPTH);
  if (scaled) g.setPosition(pivot.x * (1 - FX_SCALE), pivot.y * (1 - FX_SCALE)).setScale(FX_SCALE);
  if (frozenAt !== null) {
    draw(g, frozenAt);
    scene.time.delayedCall(1500, () => g.destroy());
    return;
  }
  const state = { t: 0 };
  draw(g, 0);
  scene.tweens.add({
    targets: state,
    t: 1,
    duration: ms,
    delay,
    onUpdate: () => {
      g.clear();
      draw(g, state.t);
    },
    onComplete: () => g.destroy(),
  });
}

/** One square "pixel" of an effect. */
function dot(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, color: number, alpha = 1): void {
  if (alpha <= 0) return;
  g.fillStyle(color, Math.min(1, alpha));
  g.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
}

/** A repeatable scatter in -1..1 (no Math.random: the same every time). */
function wobble(i: number, k = 1): number {
  return (((i * 9301 * k + 49297) % 233280) / 233280) * 2 - 1;
}

function slash(scene: Phaser.Scene, at: Point, color: number, lines: number): number {
  const ms = 320;
  animate(scene, ms, (g, t) => {
    const grow = Math.min(1, t / 0.45);
    const fade = t < 0.45 ? 1 : 1 - (t - 0.45) / 0.55;
    for (let l = 0; l < lines; l++) {
      const ox = (l - (lines - 1) / 2) * 5;
      const x0 = at.x + 12 + ox;
      const y0 = at.y - 14;
      const x1 = at.x - 12 + ox;
      const y1 = at.y + 12;
      const steps = 18;
      for (let i = 0; i <= steps * grow; i++) {
        const p = i / steps;
        const thick = i > 3 && i < steps - 3 ? 2 : 1;
        dot(g, x0 + (x1 - x0) * p, y0 + (y1 - y0) * p, thick, color, fade * (0.5 + 0.5 * p));
      }
    }
  });
  impact(scene, at, BATTLE_FX.impact, 0.7, 120);
  return ms;
}

function impact(scene: Phaser.Scene, at: Point, color: number, size = 1, delay = 0): number {
  const ms = 260;
  animate(
    scene,
    ms,
    (g, t) => {
      const r = (3 + 11 * t) * size;
      if (t < 0.35) {
        g.fillStyle(0xffffff, 0.8 * (1 - t / 0.35));
        g.fillCircle(at.x, at.y, 5 * size);
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.3;
        const len = i % 2 ? r * 0.65 : r;
        dot(g, at.x + Math.cos(a) * len, at.y + Math.sin(a) * len, 2, color, 1 - t);
        dot(g, at.x + Math.cos(a) * len * 0.6, at.y + Math.sin(a) * len * 0.6, 1, 0xffffff, 1 - t);
      }
    },
    delay,
  );
  return ms + delay;
}

function arrow(scene: Phaser.Scene, from: Point, to: Point): number {
  const fly = 260;
  const frozen = frozenAt;
  animate(
    scene,
    fly,
    (g, t) => {
    const hx = from.x + (to.x - from.x) * t;
    const hy = from.y + (to.y - from.y) * t - Math.sin(t * Math.PI) * 10;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const d = Math.hypot(dx, dy) || 1;
    for (let i = 0; i < 14; i++) dot(g, hx - (dx / d) * i, hy - (dy / d) * i, i < 3 ? 2 : 1, i < 3 ? 0xffffff : BATTLE_FX.arrow, 1 - i * 0.05);
    },
    0,
    false,
  );
  if (frozen === null)
    scene.time.delayedCall(fly, () => {
      pivot = to;
      impact(scene, to, BATTLE_FX.impact, 0.8);
    });
  return fly + 200;
}

function sparkles(scene: Phaser.Scene, at: Point, color: number, core: number, crosses: boolean): number {
  const ms = 700;
  animate(scene, ms, (g, t) => {
    for (let i = 0; i < 18; i++) {
      const phase = (t + i / 18) % 1;
      const x = at.x + wobble(i) * 16;
      const y = at.y + 14 - phase * 30;
      const a = Math.sin(phase * Math.PI) * (1 - t * 0.4);
      if (crosses && i % 3 === 0) {
        dot(g, x, y, 1, core, a);
        dot(g, x - 2, y, 1, color, a);
        dot(g, x + 2, y, 1, color, a);
        dot(g, x, y - 2, 1, color, a);
        dot(g, x, y + 2, 1, color, a);
      } else dot(g, x, y, 2, i % 2 ? color : core, a);
    }
    if (t < 0.5) {
      g.fillStyle(color, 0.25 * (1 - t * 2));
      g.fillEllipse(at.x, at.y + 16, 30, 8);
    }
  });
  return ms;
}

function chevrons(scene: Phaser.Scene, at: Point, color: number, dir: 1 | -1): number {
  const ms = 650;
  animate(scene, ms, (g, t) => {
    for (let c = 0; c < 3; c++) {
      const x = at.x + (c - 1) * 10;
      const y = at.y + dir * (t * 22 - 8) - (c % 2) * 6 * -dir;
      const a = Math.sin(t * Math.PI);
      for (let i = -3; i <= 3; i++) dot(g, x + i, y + Math.abs(i) * -dir, 2, color, a);
    }
  });
  return ms;
}

function light(scene: Phaser.Scene, at: Point): number {
  const ms = 620;
  animate(scene, ms, (g, t) => {
    const w = Math.max(1, Math.round(10 * Math.sin(t * Math.PI)));
    const top = at.y - 80;
    g.fillStyle(BATTLE_FX.light, 0.35 * Math.sin(t * Math.PI));
    g.fillRect(at.x - w, top, w * 2, at.y - top + 12);
    g.fillStyle(0xffffff, 0.6 * Math.sin(t * Math.PI));
    g.fillRect(at.x - Math.ceil(w / 3), top, Math.ceil(w / 3) * 2, at.y - top + 12);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + t * 2;
      const r = 6 + t * 18;
      dot(g, at.x + Math.cos(a) * r, at.y + Math.sin(a) * r * 0.6, 2, BATTLE_FX.light, 1 - t);
    }
  });
  impact(scene, at, BATTLE_FX.light, 1.1, 260);
  return ms;
}

function fire(scene: Phaser.Scene, at: Point): number {
  const ms = 720;
  animate(scene, ms, (g, t) => {
    const fade = t < 0.8 ? 1 : (1 - t) * 5;
    g.fillStyle(BATTLE_FX.fire, 0.35 * Math.sin(t * Math.PI));
    g.fillEllipse(at.x, at.y + 4, 30, 22);
    for (let i = 0; i < 34; i++) {
      const phase = (t * 1.6 + (i * 7 % 34) / 34) % 1;
      const x = at.x + wobble(i) * 14 * (1 - phase * 0.6);
      const y = at.y + 14 - phase * 32 - Math.abs(wobble(i, 3)) * 4;
      const size = phase < 0.35 ? 3 : phase < 0.7 ? 2 : 1;
      const color = phase < 0.3 ? 0xffffff : phase < 0.55 ? BATTLE_FX.fireCore : BATTLE_FX.fire;
      dot(g, x, y, size, color, (1 - phase * 0.8) * fade);
    }
  });
  return ms;
}

function water(scene: Phaser.Scene, at: Point): number {
  const ms = 650;
  animate(scene, ms, (g, t) => {
    g.lineStyle(1, BATTLE_FX.waterCore, 1 - t);
    g.strokeEllipse(at.x, at.y + 8, 8 + t * 34, 3 + t * 12);
    for (let i = 0; i < 14; i++) {
      const a = Math.PI + (i / 13) * Math.PI;
      const v = 20 + (i % 3) * 6;
      const x = at.x + Math.cos(a) * v * t;
      const y = at.y + 4 + Math.sin(a) * v * t + 40 * t * t;
      dot(g, x, y, i % 2 ? 2 : 1, i % 3 ? BATTLE_FX.water : BATTLE_FX.waterCore, 1 - t);
    }
  });
  return ms;
}

function wind(scene: Phaser.Scene, at: Point): number {
  const ms = 650;
  animate(scene, ms, (g, t) => {
    for (let arm = 0; arm < 4; arm++) {
      for (let i = 0; i < 16; i++) {
        const a = t * 9 + arm * (Math.PI / 2) + i * 0.2;
        const r = 4 + i * 1.2;
        const fade = Math.sin(t * Math.PI) * (1 - i / 18);
        dot(g, at.x + Math.cos(a) * r, at.y + 8 - i * 1.4 + Math.sin(a) * r * 0.4, i < 6 ? 2 : 1, i % 3 ? BATTLE_FX.wind : 0xffffff, fade);
      }
    }
  });
  return ms;
}

function earth(scene: Phaser.Scene, at: Point): number {
  const ms = 650;
  const base = at.y + 16;
  animate(scene, ms, (g, t) => {
    for (let i = 0; i < 8; i++) {
      const x = at.x + (i - 3.5) * 5 + wobble(i) * 2;
      const up = 18 + (i % 3) * 8;
      const y = base - up * Math.sin(Math.min(1, t * 1.3) * Math.PI);
      const size = 3 + (i % 2);
      const a = t < 0.85 ? 1 : (1 - t) * 6;
      dot(g, x, y, size + 1, 0x3e2614, a);
      dot(g, x, y, size, BATTLE_FX.earth, a);
      dot(g, x - 1, y - 1, 2, BATTLE_FX.earthCore, a);
    }
    g.fillStyle(BATTLE_FX.earth, 0.5 * (1 - t));
    g.fillEllipse(at.x, base, 40, 6);
  });
  return ms;
}

function surge(scene: Phaser.Scene, at: Point): number {
  const ms = 600;
  animate(scene, ms, (g, t) => {
    g.lineStyle(2, BATTLE_FX.surge, 1 - t);
    g.strokeCircle(at.x, at.y, 4 + t * 30);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 6 + t * 26;
      dot(g, at.x + Math.cos(a) * r, at.y + Math.sin(a) * r, 2, 0xffffff, 1 - t);
    }
  });
  return ms;
}
