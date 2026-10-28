// The rhythm lock on screen (PUZZLES.md SIG-XAR part 3; engine/rhythm.ts decides). The drum song's marks
// scroll from the right toward a line on the left: a long mark is two beats wide, a short one one. Tap A
// (or anywhere on the screen) as each mark reaches the line. Four count-in ticks come first. Hits glow
// gold with a ring, missed ones go grey and hollow, stray taps flash the line red and wide (shape as well as
// colour; never more than three flashes a second). B gives up (nothing happens; the stones wait). At the end,
// the taps are judged and the scene reports the result to the logic (GameLogic.finishRhythm).

import Phaser from 'phaser';
import { audio } from '../audio/player.ts';
import { UI } from '../assets.config.ts';
import { VIEW_WIDTH } from '../config.ts';
import { FLASH_MIN_GAP_MS } from '../engine/accessibility.ts';
import { COUNT_IN_BEATS, judge, msPerBeat, onsets, songLengthMs, type RhythmDef } from '../engine/rhythm.ts';
import type { InputManager } from '../input/actions.ts';
import { textStyle } from './text.ts';

const DEPTH = 6150;
/** Where the marks are tapped, and how many pixels one beat takes on the lane. */
const HIT_X = 56;
const BEAT_PX = 30;
const LANE_Y = 84;
const LANE_H = 22;

export type RhythmOutcome = { done: true; ok: boolean } | { done: true; cancelled: true };

export interface RhythmSnapshot {
  lock: string;
  slow: boolean;
  elapsed: number;
  /** When each tap is due (ms from the start), and the taps made so far. */
  due: number[];
  taps: number[];
  hits: number;
}

export class RhythmPanel {
  private readonly root: Phaser.GameObjects.Container;
  private readonly lane: Phaser.GameObjects.Graphics;
  private readonly title: Phaser.GameObjects.Text;
  private readonly status: Phaser.GameObjects.Text;
  private def: RhythmDef | null = null;
  private slow = false;
  private elapsed = 0;
  private due: number[] = [];
  private taps: number[] = [];
  private hit = new Set<number>();
  private beatMs = 0;
  private lengthMs = 0;
  private ticksPlayed = 0;
  private flashRed = 0;
  /** When the last stray-tap flash started (song time), so flashes never come faster than three a second. */
  private lastFlash = -Infinity;
  private tapped = false;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.graphics();
    bg.fillStyle(UI.boxFill, UI.boxAlpha).fillRect(0, 40, VIEW_WIDTH, 100);
    bg.lineStyle(1, UI.boxBorder, 1).strokeRect(1.5, 40.5, VIEW_WIDTH - 3, 99);
    this.lane = scene.add.graphics();
    this.title = scene.add.text(VIEW_WIDTH / 2, 46, '', textStyle(UI.accentText, { fontStyle: 'bold' })).setOrigin(0.5, 0);
    this.status = scene.add.text(VIEW_WIDTH / 2, 116, '', textStyle(UI.text, { align: 'center' })).setOrigin(0.5, 0);
    this.root = scene.add.container(0, 0, [bg, this.lane, this.title, this.status]).setScrollFactor(0).setDepth(DEPTH).setVisible(false);
  }

  get visible(): boolean {
    return this.root.visible;
  }

  open(def: RhythmDef, slow: boolean): void {
    this.def = def;
    this.slow = slow;
    const bpm = slow ? def.slowBpm : def.bpm;
    this.beatMs = msPerBeat(bpm);
    this.due = onsets(def.song, bpm);
    this.lengthMs = songLengthMs(def.song, bpm);
    this.elapsed = 0;
    this.taps = [];
    this.hit = new Set();
    this.ticksPlayed = 0;
    this.flashRed = 0;
    this.lastFlash = -Infinity;
    this.tapped = false;
    const title = def.title ?? 'The drum song';
    this.title.setText(slow ? `${title} (slow)` : title);
    this.root.setVisible(true);
    this.draw();
  }

  close(): void {
    this.root.setVisible(false);
    this.def = null;
  }

  /** A tap on the screen counts as a beat (the next update records it). */
  tap(): void {
    this.tapped = true;
  }

  snapshot(): RhythmSnapshot | null {
    if (!this.visible || !this.def) return null;
    return { lock: this.def.id, slow: this.slow, elapsed: Math.round(this.elapsed), due: [...this.due], taps: [...this.taps], hits: this.hit.size };
  }

  /** Advance the song; returns the outcome once it is over (or given up). */
  update(input: InputManager, delta: number): RhythmOutcome | null {
    const def = this.def;
    if (!def) return { done: true, cancelled: true };
    if (input.pressed('cancel') || input.pressed('menu')) return { done: true, cancelled: true };
    this.elapsed += delta;
    // The count-in: a tick on each of the first beats.
    while (this.ticksPlayed < COUNT_IN_BEATS && this.elapsed >= this.ticksPlayed * this.beatMs) {
      audio.sfx('tick');
      this.ticksPlayed++;
    }
    if (input.pressed('confirm') || this.tapped) this.record(this.elapsed);
    this.tapped = false;
    this.flashRed = Math.max(0, this.flashRed - delta);
    this.draw();
    if (this.elapsed < this.lengthMs) return null;
    return { done: true, ok: judge(this.taps, this.due, def.toleranceMs).ok };
  }

  private record(t: number): void {
    const def = this.def!;
    this.taps.push(Math.round(t));
    audio.sfx(def.sound === 'hoof' ? 'hoof' : 'drum');
    // Light the mark this tap belongs to (the judge decides at the end; this is only the picture).
    let best = -1;
    for (let i = 0; i < this.due.length; i++) {
      if (this.hit.has(i) || Math.abs(t - this.due[i]!) > def.toleranceMs) continue;
      if (best < 0 || Math.abs(t - this.due[i]!) < Math.abs(t - this.due[best]!)) best = i;
    }
    if (best >= 0) this.hit.add(best);
    else if (t - this.lastFlash >= FLASH_MIN_GAP_MS) {
      this.flashRed = 250;
      this.lastFlash = t;
    }
  }

  private draw(): void {
    const def = this.def;
    if (!def) return;
    const g = this.lane;
    g.clear();
    // The lane and the line where the marks are tapped.
    g.fillStyle(0x2a2430, 1).fillRect(8, LANE_Y, VIEW_WIDTH - 16, LANE_H);
    // A stray tap: the line goes red and twice as wide for a moment.
    const stray = this.flashRed > 0;
    g.fillStyle(stray ? 0xb8403a : 0xf2d04b, 1).fillRect(HIT_X - (stray ? 2 : 1), LANE_Y - 6, stray ? 4 : 2, LANE_H + 12);
    const pxPerMs = BEAT_PX / this.beatMs;
    // Count-in dots.
    for (let b = 0; b < COUNT_IN_BEATS; b++) {
      const x = HIT_X + (b * this.beatMs - this.elapsed) * pxPerMs;
      if (x < 8 || x > VIEW_WIDTH - 8) continue;
      g.fillStyle(0xa8a6b4, 1).fillCircle(x, LANE_Y + LANE_H / 2, 2);
    }
    // The marks: a drum head at the start of each (where to tap), a bar for how long it lasts.
    def.song.forEach((mark, i) => {
      const start = HIT_X + (this.due[i]! - this.elapsed) * pxPerMs;
      const w = (mark === 'long' ? 2 : 1) * BEAT_PX - 4;
      if (start + w < 8 || start > VIEW_WIDTH - 8) return;
      const done = this.hit.has(i);
      const passed = !done && this.elapsed > this.due[i]! + def.toleranceMs;
      const color = done ? 0xf2d04b : passed ? 0x6e6a78 : mark === 'long' ? 0x17a5a5 : 0xe0782a;
      const x0 = Math.max(8, start);
      const x1 = Math.min(VIEW_WIDTH - 8, start + w);
      if (x1 > x0) g.fillStyle(color, 0.55).fillRect(x0, LANE_Y + 6, x1 - x0, LANE_H - 12);
      if (start < 8) return;
      const cy = LANE_Y + LANE_H / 2;
      if (passed) {
        // Missed: a hollow grey ring.
        g.lineStyle(2, color, 1).strokeCircle(start, cy, 5);
        return;
      }
      g.fillStyle(color, 1).fillCircle(start, cy, 6);
      // Hit: a white ring round the gold head.
      if (done) g.lineStyle(1, 0xffffff, 1).strokeCircle(start, cy, 8);
    });
    const left = Math.ceil(COUNT_IN_BEATS - this.elapsed / this.beatMs);
    this.status.setText(
      left > 0
        ? `Ready... ${left}\nTap A (or the screen) as each ${def.noun ?? 'drum'} reaches the line.`
        : `${this.hit.size} of ${this.due.length}\nLong marks are two beats, short ones one. B to stop.`,
    );
  }
}
