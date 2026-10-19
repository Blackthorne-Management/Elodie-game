// Plays the quest's music and sounds in the browser (Web Audio). engine/audioPlan.ts decides what should
// play; this does it: songs load the first time they are needed, fade into each other, and loop by
// fading each pass into the next (the generated songs fade out at their end). Sounds are made once from
// src/audio/sfx.ts. Browsers allow sound only after the player's first tap or key, so everything waits
// for that. On iPhone the audio session is "ambient", so the silent switch silences the game.

import { DEFAULT_VOLUME, MUSIC, MUSIC_FADE_S, SFX_FILES, VOICE_PITCH, type MusicId, type SfxId } from '../audio.config.ts';
import { voicePitch } from '../engine/audioPlan.ts';
import { renderSfx, renderVoice } from './sfx.ts';

const VOLUME_KEY = 'bloodlines-quest.audio';
/** How far ahead the next pass of a song is scheduled (seconds). */
const LOOKAHEAD_S = 1.5;
/** After a song fails to load or decode, how long before it is tried again (ms). */
const RETRY_MS = 3000;
/** The music files, which are kept decoded only while they play (a decoded song is about 25 MB). */
const MUSIC_FILES: ReadonlySet<string> = new Set(Object.values(MUSIC).map((t) => t.file));

interface Playing {
  id: MusicId;
  gain: GainNode;
  sources: AudioBufferSourceNode[];
  /** When the next pass starts (AudioContext time); Infinity once it will not loop. */
  nextAt: number;
  buffer: AudioBuffer;
}

export interface Volumes {
  music: number;
  sound: number;
}

function loadVolumes(): Volumes {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<Volumes>;
      const ok = (x: unknown) => typeof x === 'number' && x >= 0 && x <= 1;
      return { music: ok(v.music) ? v.music! : DEFAULT_VOLUME.music, sound: ok(v.sound) ? v.sound! : DEFAULT_VOLUME.sound };
    }
  } catch {
    // Storage blocked: the defaults.
  }
  return { ...DEFAULT_VOLUME };
}

class AudioPlayer {
  private ctx: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private soundBus: GainNode | null = null;
  private volumes: Volumes = loadVolumes();
  private wanted: MusicId | null = null;
  private playing: Playing | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private sounds = new Map<string, AudioBuffer>();
  /** A song is loading for start(). */
  private starting = false;
  /** No new try to start the wanted song before this time (performance.now), after a failure. */
  private retryAt = 0;
  /** The last thing asked for, for the smoke test. */
  lastSfx: string | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    const unlock = () => this.unlock();
    for (const ev of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(ev, unlock, { capture: true, passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) void this.ctx.suspend();
      else void this.ctx.resume();
    });
  }

  get volume(): Volumes {
    return { ...this.volumes };
  }

  /** The song playing now (or waiting for the first tap). */
  get music(): MusicId | null {
    return this.wanted;
  }

  debugState(): { unlocked: boolean; wanted: string | null; playing: string | null; lastSfx: string | null; sources: number; gain: number } {
    return {
      unlocked: this.unlocked,
      wanted: this.wanted,
      playing: this.playing?.id ?? null,
      lastSfx: this.lastSfx,
      sources: this.playing?.sources.length ?? 0,
      gain: this.playing ? Math.round(this.playing.gain.gain.value * 100) / 100 : 0,
    };
  }

  get unlocked(): boolean {
    return this.ctx?.state === 'running';
  }

  setVolumes(v: Partial<Volumes>): void {
    this.volumes = { ...this.volumes, ...v };
    try {
      localStorage.setItem(VOLUME_KEY, JSON.stringify(this.volumes));
    } catch {
      // Not remembered; still applied.
    }
    if (this.musicBus) this.musicBus.gain.value = this.curve(this.volumes.music);
    if (this.soundBus) this.soundBus.gain.value = this.curve(this.volumes.sound);
    if (this.volumes.music > 0 && !this.playing && this.wanted) void this.start(this.wanted);
  }

  /** Start the audio (inside a tap or key press, the only time a browser allows it). */
  unlock(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      try {
        const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
        if (session) session.type = 'ambient';
      } catch {
        // Older browsers.
      }
      this.ctx = new AC();
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = this.curve(this.volumes.music);
      this.musicBus.connect(this.ctx.destination);
      this.soundBus = this.ctx.createGain();
      this.soundBus.gain.value = this.curve(this.volumes.sound);
      this.soundBus.connect(this.ctx.destination);
      window.setInterval(() => {
        this.schedule();
        this.heal();
      }, 250);
    }
    if (this.ctx.state !== 'running') {
      void this.ctx.resume().then(() => {
        if (this.wanted && !this.playing) void this.start(this.wanted);
      });
    } else if (this.wanted && !this.playing) void this.start(this.wanted);
  }

  /** Play a song (null: silence). The same song again keeps playing where it is. */
  playMusic(id: MusicId | null): void {
    if (id === this.wanted) return;
    this.wanted = id;
    this.stopMusic();
    if (id && this.ctx?.state === 'running') void this.start(id);
  }

  /** Play a sound file (a URL), or the made sound `fallback` when there is none (the Game Over bell). */
  sfxFile(url: string | undefined, fallback: SfxId): void {
    if (!url) return this.sfx(fallback);
    this.lastSfx = fallback;
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running' || this.volumes.sound <= 0) return;
    void this.load(url).then((b) => (b ? this.fire(b) : this.sfx(fallback)));
  }

  /** Play a sound effect. */
  sfx(id: SfxId): void {
    this.lastSfx = id;
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running' || this.volumes.sound <= 0) return;
    const file = SFX_FILES[id];
    if (file) {
      void this.load(file).then((b) => b && this.fire(b));
      return;
    }
    let buf = this.sounds.get(id);
    if (!buf) {
      buf = this.toBuffer(renderSfx(id, ctx.sampleRate));
      this.sounds.set(id, buf);
    }
    this.fire(buf);
  }

  /** One syllable of a speaker's wordless voice. */
  voice(speakerId: string): void {
    this.lastSfx = `voice:${speakerId}`;
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running' || this.volumes.sound <= 0) return;
    const pitch = Math.round(voicePitch(VOICE_PITCH, speakerId));
    const key = `voice:${pitch}`;
    let buf = this.sounds.get(key);
    if (!buf) {
      buf = this.toBuffer(renderVoice(pitch, ctx.sampleRate));
      this.sounds.set(key, buf);
    }
    this.fire(buf);
  }

  // ---- Internals ---------------------------------------------------------------------------------

  /** Volume slider to gain: squared, so the steps sound even. */
  private curve(v: number): number {
    return v * v;
  }

  private toBuffer(samples: Float32Array): AudioBuffer {
    const buf = this.ctx!.createBuffer(1, samples.length, this.ctx!.sampleRate);
    buf.getChannelData(0).set(samples);
    return buf;
  }

  private fire(buf: AudioBuffer): void {
    const src = this.ctx!.createBufferSource();
    src.buffer = buf;
    src.connect(this.soundBus!);
    src.start();
  }

  private load(file: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(file);
    if (!p) {
      p = fetch(file)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${file}: ${r.status}`))))
        .then((data) => this.ctx!.decodeAudioData(data))
        .catch((e: unknown) => {
          console.warn('[quest] could not load', file, e);
          this.buffers.delete(file);
          return null;
        });
      this.buffers.set(file, p);
    }
    return p;
  }

  private async start(id: MusicId): Promise<void> {
    if (this.volumes.music <= 0 || this.starting) return;
    const track = MUSIC[id];
    // Only the song starting stays decoded (the one fading out keeps its own copy until it stops).
    for (const file of this.buffers.keys()) if (MUSIC_FILES.has(file) && file !== track.file) this.buffers.delete(file);
    this.starting = true;
    const buffer = await this.load(track.file).finally(() => {
      this.starting = false;
    });
    // A failure is tried again by heal() in a moment.
    if (!buffer) this.retryAt = performance.now() + RETRY_MS;
    // Something else may have been asked for while it loaded.
    if (!buffer || this.wanted !== id || this.playing || !this.ctx) return;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.connect(this.musicBus!);
    const now = ctx.currentTime + 0.05;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + MUSIC_FADE_S);
    const playing: Playing = { id, gain, sources: [], nextAt: now, buffer };
    this.playing = playing;
    this.pass(playing, true);
  }

  /**
   * Called every 250 ms: the wanted song plays if it should and does not (owner report, Oct 16: on a
   * phone, no music after the first song). A load that failed is tried again, and an audio context the
   * phone paused (a call, the intro video, the lock screen) is asked to resume.
   */
  private heal(): void {
    const ctx = this.ctx;
    if (!ctx || !this.wanted || this.playing || this.starting || document.hidden || this.volumes.music <= 0) return;
    if (performance.now() < this.retryAt) return;
    if (ctx.state !== 'running') {
      this.retryAt = performance.now() + RETRY_MS;
      void ctx.resume().catch(() => undefined);
      return;
    }
    void this.start(this.wanted);
  }

  /** Start one pass of the song at `nextAt`, fading in from the last pass's tail (not the first). */
  private pass(p: Playing, first: boolean): void {
    const ctx = this.ctx!;
    const track = MUSIC[p.id];
    const src = ctx.createBufferSource();
    src.buffer = p.buffer;
    const g = ctx.createGain();
    src.connect(g).connect(p.gain);
    const at = p.nextAt;
    const dur = p.buffer.duration;
    const overlap = track.loop ? Math.min(track.overlapS, dur / 4) : 0;
    if (!first && overlap > 0) {
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(1, at + overlap);
    }
    if (track.loop && overlap > 0) {
      g.gain.setValueAtTime(1, at + dur - overlap);
      g.gain.linearRampToValueAtTime(0, at + dur);
    }
    src.start(at);
    src.onended = () => {
      p.sources = p.sources.filter((s) => s !== src);
    };
    p.sources.push(src);
    p.nextAt = track.loop ? at + dur - overlap : Infinity;
  }

  /** Keep the next pass of the song scheduled ahead of time. */
  private schedule(): void {
    const p = this.playing;
    if (!p || !this.ctx) return;
    if (p.nextAt - this.ctx.currentTime < LOOKAHEAD_S) this.pass(p, false);
  }

  private stopMusic(): void {
    const p = this.playing;
    this.playing = null;
    if (!p || !this.ctx) return;
    const now = this.ctx.currentTime;
    p.gain.gain.cancelScheduledValues(now);
    p.gain.gain.setValueAtTime(p.gain.gain.value, now);
    p.gain.gain.linearRampToValueAtTime(0, now + MUSIC_FADE_S);
    for (const s of p.sources) s.stop(now + MUSIC_FADE_S + 0.05);
  }
}

/** The one player for the page. */
export const audio = new AudioPlayer();

declare global {
  interface Window {
    /** Test hook for the smoke test: what is playing. */
    __audio?: () => { unlocked: boolean; wanted: string | null; playing: string | null; lastSfx: string | null; sources: number; gain: number };
  }
}
if (typeof window !== 'undefined') window.__audio = () => audio.debugState();
