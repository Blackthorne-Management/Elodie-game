// The Game Over screen (docs/quest/intro/GAME-OVER-STORYBOARD.md): the goddess catches the fallen party, says
// how many times they have fallen and gives back the moment before the fight. Like the intro (IntroScene.ts) it
// plays in a page layer over the game: the animator's films when their files are in quest/art/gameover/
// (assets.config.ts GAME_OVER_ART), else the placeholder drawn in code on the same clock (gameOverArt.ts). The
// game draws her words, the count and the Rise and Skip buttons in the lower third (under the picture when the
// phone is held upright). engine/gameOver.ts decides what each press does; the battle scene has already counted
// the fall, stepped the party back and saved before this opens. Rise restarts the field there.

import Phaser from 'phaser';
import { GAME_OVER_ART } from '../assets.config.ts';
import { GAME_OVER_BELL_FILE, GAME_OVER_MUSIC } from '../audio.config.ts';
import { audio } from '../audio/player.ts';
import { GAME_OVER, TEXT_SPEEDS, VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { GAME_OVER_TEXT, GODDESS_WORDS } from '../data/gameOver.ts';
import {
  FALL_CUES,
  applyGameOverAction,
  gameOverDurations,
  gameOverFallEnded,
  gameOverPress,
  goddessLines,
  onLastScreen,
  type GameOverPhase,
  type GameOverPress,
  type GameOverView,
  type GoddessLine,
} from '../engine/gameOver.ts';
import { getRuntime } from '../runtime.ts';
import { artFile } from './artFiles.ts';
import { drawGameOverArt, reducedPoseAlpha, type ArtSegment } from './gameOverArt.ts';

export interface GameOverData {
  /** Game Overs on this save, this one included (1: the first meeting). */
  count: number;
}

export interface GameOverSnapshot {
  phase: GameOverPhase;
  line: number;
  lines: number;
  speaker: GoddessLine['speaker'] | null;
  text: string;
  shown: string;
  typing: boolean;
  count: number;
  /** The count and the Rise button are on screen (the last screen). */
  countShown: boolean;
  skipVisible: boolean;
  reducedMotion: boolean;
  /** Which films are the animator's (true) and which the placeholder (false). */
  films: { fall: boolean; loop: boolean; rise: boolean; still: boolean };
}

let current: GameOverScene | null = null;

function setCurrent(scene: GameOverScene | null): void {
  current = scene;
}

/** The Game Over screen, for the field's test hook (null when it is not up). */
export function gameOverSnapshot(): GameOverSnapshot | null {
  return current?.snapshot() ?? null;
}

/** The device asks for less motion. */
function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch {
    return false;
  }
}

type Segment = 'fall' | 'loop' | 'rise';

export class GameOverScene extends Phaser.Scene {
  private count = 1;
  private lines: GoddessLine[] = [];
  private view: GameOverView = { phase: 'fall', line: 0, lines: 1, typing: false };
  private reduced = false;
  private segment: Segment = 'fall';
  /** Seconds into the segment. */
  private segT = 0;
  /** Characters of the line shown so far. */
  private shownChars = 0;
  private cps: number = TEXT_SPEEDS.normal;
  private bellRung = false;
  private musicOn = false;
  private finished = false;
  private rendered = '';
  private films = { fall: undefined as string | undefined, loop: undefined as string | undefined, rise: undefined as string | undefined, still: undefined as string | undefined };
  /** The segment's film is playing (else the placeholder is drawn). */
  private filmOn = false;

  private layer: HTMLDivElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private video: HTMLVideoElement | null = null;
  private still: HTMLImageElement | null = null;
  private veil: HTMLDivElement | null = null;
  private words: HTMLDivElement | null = null;
  private nameEl: HTMLDivElement | null = null;
  private lineEl: HTMLParagraphElement | null = null;
  private countRow: HTMLDivElement | null = null;
  private countNum: HTMLSpanElement | null = null;
  private rise: HTMLButtonElement | null = null;
  private skip: HTMLButtonElement | null = null;

  constructor() {
    super('gameover');
  }

  create(data: GameOverData): void {
    setCurrent(this);
    this.count = Math.max(1, data?.count ?? 1);
    this.lines = goddessLines(this.count, GODDESS_WORDS);
    this.view = { phase: 'fall', line: 0, lines: this.lines.length, typing: false };
    this.reduced = prefersReducedMotion();
    this.cps = TEXT_SPEEDS[getRuntime().logic.state.settings.textSpeed] ?? TEXT_SPEEDS.normal;
    this.shownChars = 0;
    this.bellRung = false;
    this.musicOn = false;
    this.finished = false;
    this.rendered = '';
    this.films = {
      fall: artFile(GAME_OVER_ART.fall),
      loop: artFile(GAME_OVER_ART.loop),
      rise: artFile(GAME_OVER_ART.rise),
      still: artFile(GAME_OVER_ART.still),
    };
    this.buildLayer();
    this.startSegment('fall');
    getRuntime().input.clearPresses();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (current === this) current = null;
      if (!this.finished) this.removeLayer();
    });
    this.render();
  }

  update(_time: number, delta: number): void {
    if (this.finished) return;
    const input = getRuntime().input;
    input.update();
    if (input.pressed('confirm')) this.press('confirm');
    else if (input.pressed('cancel')) this.press('cancel');
    const dt = Math.min(0.1, delta / 1000);
    this.segT += dt;
    const { fallS, riseS } = gameOverDurations(this.reduced);
    if (this.segment === 'fall') {
      // The bell with GAME OVER; her music with the loom (straight away when the fall is skipped).
      if (!this.bellRung && this.segT >= (this.reduced ? GAME_OVER.reduced.lettersS / 2 : FALL_CUES.bellS)) this.ringBell();
      if (!this.musicOn && this.segT >= (this.reduced ? fallS : FALL_CUES.musicS)) this.startMusic();
      if (this.segmentOver(fallS)) {
        this.view = gameOverFallEnded(this.view);
        this.shownChars = 0;
        this.startSegment('loop');
      }
    } else if (this.segment === 'rise' && this.segmentOver(riseS)) {
      this.finish();
      return;
    }
    if (this.view.phase === 'words' && this.view.typing) {
      const text = this.lines[this.view.line]?.text ?? '';
      this.shownChars = Number.isFinite(this.cps) ? this.shownChars + this.cps * dt : text.length;
      if (this.shownChars >= text.length) {
        this.shownChars = text.length;
        this.view = { ...this.view, typing: false };
      }
    }
    this.draw();
    this.render();
  }

  snapshot(): GameOverSnapshot {
    const line = this.view.phase === 'words' ? this.lines[this.view.line] : undefined;
    return {
      phase: this.view.phase,
      line: this.view.line,
      lines: this.view.lines,
      speaker: line?.speaker ?? null,
      text: line?.text ?? '',
      shown: this.shownText(),
      typing: this.view.typing,
      count: this.count,
      countShown: this.countShown(),
      skipVisible: this.skipShown(),
      reducedMotion: this.reduced,
      films: { fall: !!this.films.fall, loop: !!this.films.loop, rise: !!this.films.rise, still: !!this.films.still },
    };
  }

  // ---- Presses ------------------------------------------------------------------------------------

  private press(p: GameOverPress): void {
    if (this.finished) return;
    const action = gameOverPress(this.view, p);
    if (action.kind === 'none') return;
    const before = this.view;
    this.view = applyGameOverAction(this.view, action);
    switch (action.kind) {
      case 'finish':
        this.shownChars = this.lines[this.view.line]?.text.length ?? 0;
        break;
      case 'next':
        this.shownChars = 0;
        audio.sfx('cursor');
        break;
      case 'skip':
        this.shownChars = this.lines[this.view.line]?.text.length ?? 0;
        if (before.phase === 'fall') {
          this.ringBell();
          this.startMusic();
          this.startSegment('loop');
        }
        break;
      case 'rise':
        audio.sfxFile(artFile(GAME_OVER_BELL_FILE), 'bell');
        audio.playMusic(null);
        this.startSegment('rise');
        break;
    }
    this.render();
  }

  private countShown(): boolean {
    return onLastScreen(this.view) && !this.view.typing;
  }

  private skipShown(): boolean {
    return this.view.phase === 'fall' || (this.view.phase === 'words' && !this.countShown());
  }

  private shownText(): string {
    if (this.view.phase !== 'words') return '';
    const text = this.lines[this.view.line]?.text ?? '';
    return this.view.typing ? text.slice(0, Math.floor(this.shownChars)) : text;
  }

  // ---- Pictures and sound -------------------------------------------------------------------------

  private ringBell(): void {
    if (this.bellRung) return;
    this.bellRung = true;
    audio.sfxFile(artFile(GAME_OVER_BELL_FILE), 'bell');
  }

  private startMusic(): void {
    if (this.musicOn) return;
    this.musicOn = true;
    audio.playMusic(GAME_OVER_MUSIC);
  }

  /** The segment has played: its own length for the placeholder; a film runs to its end (a little grace if it stalls). */
  private segmentOver(length: number): boolean {
    const v = this.video;
    if (this.filmOn && v) return v.ended || this.segT >= length + 3;
    return this.segT >= length;
  }

  private startSegment(segment: Segment): void {
    this.segment = segment;
    this.segT = 0;
    // With reduced motion the films are not played: the still (or the drawn pose) and plain fades.
    const film = this.reduced ? undefined : this.films[segment];
    this.filmOn = false;
    const v = this.video;
    if (v) {
      v.pause();
      v.hidden = true;
      if (film) {
        v.src = film;
        v.loop = segment === 'loop';
        v.currentTime = 0;
        v.hidden = false;
        this.filmOn = true;
        v.play().catch(() => {
          // The browser cannot play it: the placeholder takes over on the same clock.
          this.filmOn = false;
          v.hidden = true;
        });
      }
    }
    this.draw();
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;
    const stillFile = this.reduced && this.still && this.films.still;
    if (this.still) {
      // The animator's still stands in for the held pose when motion is reduced.
      const a = !stillFile ? 0 : this.segment === 'fall' ? reducedPoseAlpha(this.segT) : 1;
      this.still.hidden = a <= 0;
      this.still.style.opacity = String(a);
    }
    if (this.veil) {
      const a = this.reduced && this.segment === 'rise' ? Math.min(1, this.segT / GAME_OVER.reduced.riseS) : 0;
      this.veil.style.opacity = String(a);
    }
    this.canvas.hidden = this.filmOn;
    if (this.filmOn) return;
    const art: ArtSegment = this.segment;
    drawGameOverArt(ctx, art, this.segT, this.reduced);
  }

  // ---- The page layer ----------------------------------------------------------------------------------

  /** Write the words, the count and the buttons (only when something changed). */
  private render(): void {
    const line = this.view.phase === 'words' ? this.lines[this.view.line] : undefined;
    const shown = this.shownText();
    const key = [this.view.phase, this.view.line, shown, this.countShown(), this.skipShown()].join('|');
    if (key === this.rendered || !this.words) return;
    this.rendered = key;
    this.words.hidden = !line;
    this.words.dataset.speaker = line?.speaker ?? '';
    if (this.nameEl) this.nameEl.hidden = line?.speaker !== 'gianna';
    if (this.lineEl) this.lineEl.textContent = shown;
    if (this.countRow) this.countRow.hidden = !this.countShown();
    if (this.countNum) this.countNum.textContent = String(this.count);
    if (this.rise) this.rise.hidden = !this.countShown();
    if (this.skip) this.skip.hidden = !this.skipShown();
    if (this.layer) this.layer.dataset.phase = this.view.phase;
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.view = { ...this.view, phase: 'done' };
    current = null;
    getRuntime().input.clearPresses();
    // The map fades in from cream (shot 8): the layer stays a moment over the restarted field.
    const layer = this.layer;
    if (layer) {
      layer.dataset.phase = 'done';
      layer.classList.add('gameover-leaving');
      layer.style.transitionDuration = `${GAME_OVER.mapFadeMs}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => (layer.style.opacity = '0')));
      window.setTimeout(() => layer.remove(), GAME_OVER.mapFadeMs + 100);
    }
    this.layer = null;
    this.scene.start('field', { toast: GAME_OVER_TEXT.back });
  }

  private buildLayer(): void {
    this.removeLayer();
    const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement): HTMLElementTagNameMap[K] => {
      const e = document.createElement(tag);
      e.className = cls;
      parent.appendChild(e);
      return e;
    };
    const layer = document.createElement('div');
    layer.className = 'gameover';
    layer.dataset.phase = 'fall';
    const frame = el('div', 'gameover-frame', layer);
    const stage = el('div', 'gameover-stage', frame);
    const canvas = el('canvas', 'gameover-art', stage);
    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;
    const still = el('img', 'gameover-still', stage);
    still.alt = '';
    still.hidden = true;
    if (this.films.still) still.src = this.films.still;
    const video = el('video', 'gameover-video', stage);
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.hidden = true;
    const veil = el('div', 'gameover-veil', stage);

    const words = el('div', 'gameover-words', frame);
    words.setAttribute('aria-live', 'polite');
    words.hidden = true;
    const nameEl = el('div', 'gameover-name', words);
    nameEl.textContent = GAME_OVER_TEXT.gianna;
    const lineEl = el('p', 'gameover-line', words);
    const row = el('div', 'gameover-row', words);
    const countRow = el('div', 'gameover-count', row);
    const countNum = el('span', 'gameover-count-num', countRow);
    countNum.textContent = String(this.count);
    const countLabel = el('span', 'gameover-count-label', countRow);
    countLabel.textContent = GAME_OVER_TEXT.countLabel;
    countRow.hidden = true;
    const rise = el('button', 'gameover-rise', row);
    rise.type = 'button';
    rise.textContent = GAME_OVER_TEXT.rise;
    rise.hidden = true;
    rise.addEventListener('click', (e) => {
      e.stopPropagation();
      this.press('confirm');
    });

    const skip = el('button', 'gameover-skip', layer);
    skip.type = 'button';
    skip.textContent = GAME_OVER_TEXT.skip;
    skip.addEventListener('click', (e) => {
      e.stopPropagation();
      this.press('cancel');
    });
    // A tap anywhere reads on (a tap during the fall does nothing).
    layer.addEventListener('click', () => this.press('tap'));
    document.body.appendChild(layer);

    this.layer = layer;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.video = video;
    this.still = still;
    this.veil = veil;
    this.words = words;
    this.nameEl = nameEl;
    this.lineEl = lineEl;
    this.countRow = countRow;
    this.countNum = countNum;
    this.rise = rise;
    this.skip = skip;
  }

  private removeLayer(): void {
    this.video?.pause();
    this.layer?.remove();
    this.layer = null;
    this.canvas = null;
    this.ctx = null;
    this.video = null;
    this.still = null;
    this.veil = null;
    this.words = null;
    this.nameEl = null;
    this.lineEl = null;
    this.countRow = null;
    this.countNum = null;
    this.rise = null;
    this.skip = null;
  }
}
