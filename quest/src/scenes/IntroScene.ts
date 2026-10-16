// The animated intro and title (owner decision, Oct 16: the video's own title is the title screen). The
// video plays in a page layer over the game; engine/intro.ts decides where it starts, what each press
// does and when the title loops. A new player sees the whole film, a saved game opens on the title, and
// "Watch the intro" in the menu plays it again. If the browser cannot play the video, the quest starts.

import Phaser from 'phaser';
import { INTRO_SEEN_KEY, introLoopSeek, introPhaseAt, introPress, introStartTime, type IntroOpening, type IntroPhase, type IntroPress } from '../engine/intro.ts';
import { audio } from '../audio/player.ts';
import { isTouchDevice } from '../input/touch.ts';
import { getRuntime } from '../runtime.ts';

/** The game's copies of the video (720p; the 1080p original is in docs/quest/intro/). Safari plays MP4, others either. */
const SOURCES = [
  { src: 'intro/zetwal-intro.mp4', type: 'video/mp4' },
  { src: 'intro/zetwal-intro.webm', type: 'video/webm' },
];

export interface IntroData {
  opening: IntroOpening;
}

export class IntroScene extends Phaser.Scene {
  private opening: IntroOpening = 'full';
  private phase: IntroPhase = 'start';
  private layer: HTMLDivElement | null = null;
  private video: HTMLVideoElement | null = null;
  private prompt: HTMLDivElement | null = null;
  private skip: HTMLButtonElement | null = null;
  private finished = false;

  constructor() {
    super('intro');
  }

  create(data: IntroData): void {
    this.opening = data?.opening ?? 'full';
    this.phase = 'start';
    this.finished = false;
    this.buildLayer();
    // The film has its own sound: the game's music waits.
    audio.playMusic(null);
    getRuntime().input.clearPresses();
    // Try to play at once; a browser that wants a tap first refuses, and the tap-to-start prompt shows.
    this.play(introStartTime(this.opening));
    window.__intro = { state: () => this.state() };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.removeLayer());
  }

  update(): void {
    if (this.finished) return;
    const input = getRuntime().input;
    input.update();
    if (input.pressed('confirm')) this.press('confirm');
    else if (input.pressed('cancel')) this.press('cancel');
    const v = this.video;
    if (!v || this.phase === 'start' || this.finished) return;
    this.setPhase(introPhaseAt(v.currentTime));
    const back = introLoopSeek(v.currentTime, v.ended);
    if (back !== null) {
      v.currentTime = back;
      if (v.paused) void v.play().catch(() => undefined);
    }
  }

  /** Snapshot for the smoke test. */
  state(): { phase: IntroPhase; time: number; finished: boolean } {
    return { phase: this.phase, time: this.video?.currentTime ?? 0, finished: this.finished };
  }

  private press(p: IntroPress): void {
    const action = introPress(this.phase, p, this.opening);
    switch (action.kind) {
      case 'play':
        this.play(action.from);
        break;
      case 'seek':
        if (this.video) this.video.currentTime = action.to;
        this.setPhase('title');
        break;
      case 'done':
        this.finish();
        break;
      case 'none':
        break;
    }
  }

  private play(from: number): void {
    const v = this.video;
    if (!v) return;
    v.currentTime = from;
    v.play().then(
      () => this.setPhase(introPhaseAt(from)),
      (err: unknown) => {
        // NotAllowedError: the browser wants a tap first. NotSupportedError: it cannot play the video at all.
        // (An AbortError only means a newer play or seek took over.)
        const name = err instanceof DOMException ? err.name : '';
        if (name === 'NotAllowedError') this.showPrompt();
        else if (name === 'NotSupportedError') this.finish();
      },
    );
  }

  private showPrompt(): void {
    this.phase = 'start';
    if (this.prompt) this.prompt.hidden = false;
    if (this.skip) this.skip.hidden = true;
    if (this.layer) this.layer.dataset.phase = 'start';
  }

  /** Next time the app opens on the title (owner request, Oct 16): once the title is reached, watched or skipped. */
  private markSeen(): void {
    try {
      getRuntime().storage?.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Not remembered: the film plays again next time.
    }
  }

  private setPhase(phase: IntroPhase): void {
    if (phase === 'title') this.markSeen();
    if (this.phase === phase) return;
    this.phase = phase;
    if (this.prompt) this.prompt.hidden = phase !== 'start';
    if (this.skip) this.skip.hidden = phase !== 'film';
    if (this.layer) this.layer.dataset.phase = phase;
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.video?.pause();
    this.removeLayer();
    this.markSeen();
    getRuntime().input.clearPresses();
    window.__intro = undefined;
    this.scene.start('field');
  }

  private buildLayer(): void {
    this.removeLayer();
    const layer = document.createElement('div');
    layer.className = 'intro';
    layer.dataset.phase = 'start';
    const video = document.createElement('video');
    video.className = 'intro-video';
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', '');
    for (const s of SOURCES) {
      const source = document.createElement('source');
      source.src = s.src;
      source.type = s.type;
      video.appendChild(source);
    }
    // When no source can play, the last source reports the error: go on into the quest.
    video.lastElementChild?.addEventListener('error', () => this.finish());
    video.addEventListener('error', () => this.finish());
    layer.appendChild(video);

    const prompt = document.createElement('div');
    prompt.className = 'intro-prompt';
    prompt.textContent = isTouchDevice() ? 'Tap to start' : 'Press A (Z or Enter) to start';
    prompt.hidden = true;
    layer.appendChild(prompt);

    const skip = document.createElement('button');
    skip.className = 'intro-skip';
    skip.type = 'button';
    skip.textContent = 'Skip';
    skip.hidden = true;
    skip.addEventListener('click', (e) => {
      e.stopPropagation();
      this.press('cancel');
    });
    layer.appendChild(skip);

    // A tap anywhere is A (play() must run inside the tap for a phone to allow sound).
    layer.addEventListener('click', () => this.press('confirm'));
    document.body.appendChild(layer);
    this.layer = layer;
    this.video = video;
    this.prompt = prompt;
    this.skip = skip;
  }

  private removeLayer(): void {
    this.layer?.remove();
    this.layer = null;
    this.video = null;
    this.prompt = null;
    this.skip = null;
  }
}

declare global {
  interface Window {
    /** Test hook for the smoke test: the intro's phase and video time. */
    __intro?: { state: () => { phase: IntroPhase; time: number; finished: boolean } };
  }
}
