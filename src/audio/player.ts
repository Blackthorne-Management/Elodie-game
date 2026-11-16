// Plays the board game's music and sound effects in the browser (Web Audio). src/audio/plan.ts decides what should
// play; this does it. Browsers allow sound only after the player's first tap or key, so everything waits for that;
// on iPhone the session is "ambient", so the silent switch silences the game. Volumes are remembered per device.
import { AUDIO_DEFAULTS, MUSIC } from '../assets.config';
import type { MusicId } from './plan';
import { playSfx, type SfxId } from './sfx';
import { renderPlaceholder } from './music';

export interface Volumes { music: number; sound: number; muted: boolean }
const KEY = 'tob-audio';

function loadVolumes(): Volumes {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<Volumes> | null;
    const ok = (x: unknown): x is number => typeof x === 'number' && x >= 0 && x <= 1;
    if (v) return { music: ok(v.music) ? v.music : AUDIO_DEFAULTS.music, sound: ok(v.sound) ? v.sound : AUDIO_DEFAULTS.sound, muted: !!v.muted };
  } catch { /* storage blocked: the defaults */ }
  return { music: AUDIO_DEFAULTS.music, sound: AUDIO_DEFAULTS.sound, muted: false };
}

class AudioPlayer {
  private ctx: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private soundBus: GainNode | null = null;
  private volumes = loadVolumes();
  private listeners = new Set<() => void>();
  private wanted: MusicId | null = null;
  private playing: { id: MusicId; src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private nextFree = 0;                       // when the sound bus is next free, to space out a burst of events

  constructor() {
    if (typeof window === 'undefined') return;
    const unlock = () => { this.start(); };
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    // A quiet tick on every button press.
    window.addEventListener('click', e => { if ((e.target as Element | null)?.closest?.('button')) this.sfx('tap'); }, { capture: true });
  }

  private start() {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try { (navigator as unknown as { audioSession?: { type: string } }).audioSession!.type = 'ambient'; } catch { /* not iOS */ }
    this.ctx = new AC();
    this.musicBus = this.ctx.createGain();
    this.soundBus = this.ctx.createGain();
    this.musicBus.connect(this.ctx.destination);
    this.soundBus.connect(this.ctx.destination);
    this.applyVolumes();
    if (this.wanted) void this.switchTo(this.wanted);
    // Get the game's tracks ready in the background, one after another, so the music changes without a wait.
    void (['title', 'realm', 'stakes', 'throne', 'victory', 'defeat', 'sudden'] as MusicId[])
      .reduce((p, id) => p.then(() => this.track(id)).then(() => undefined), Promise.resolve());
  }

  getVolumes(): Volumes { return { ...this.volumes }; }
  setVolumes(v: Partial<Volumes>) {
    this.volumes = { ...this.volumes, ...v };
    try { localStorage.setItem(KEY, JSON.stringify(this.volumes)); } catch { /* ignore */ }
    this.applyVolumes();
    this.listeners.forEach(f => f());
  }
  subscribe(f: () => void) { this.listeners.add(f); return () => { this.listeners.delete(f); }; }
  private applyVolumes() {
    if (!this.ctx || !this.musicBus || !this.soundBus) return;
    const m = this.volumes.muted ? 0 : this.volumes.music, s = this.volumes.muted ? 0 : this.volumes.sound;
    this.musicBus.gain.setTargetAtTime(m * m, this.ctx.currentTime, 0.05);   // squared: sliders feel even to the ear
    this.soundBus.gain.setTargetAtTime(s * s, this.ctx.currentTime, 0.05);
  }

  // Play a sound now, or, in a burst of events, a little after the one before so they don't pile up.
  sfx(id: SfxId, gap = 0) {
    if (!this.ctx || !this.soundBus || this.volumes.muted || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const at = gap ? Math.max(now, this.nextFree) : now;
    if (gap) this.nextFree = at + gap;
    playSfx(this.ctx, this.soundBus, id, at + 0.01);
  }

  // Ask for a track; it fades in once loaded (a missing file stays silent). The same track keeps playing.
  music(id: MusicId | null) {
    if (id === this.wanted) return;
    this.wanted = id;
    void this.switchTo(id);
  }

  // A short track over the music (the Sudden Death sting): the music dips while it plays, then comes back.
  async sting(id: MusicId) {
    if (!this.ctx || !this.musicBus) return;
    const buf = await this.track(id);
    if (!buf || !this.ctx || !this.musicBus) return;
    const t = this.ctx.currentTime;
    const under = this.playing?.gain.gain;
    if (under) { under.cancelScheduledValues(t); under.setValueAtTime(under.value, t); under.linearRampToValueAtTime(0.25, t + 0.3);
      under.setValueAtTime(0.25, t + buf.duration); under.linearRampToValueAtTime(1, t + buf.duration + 1.5); }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.musicBus);
    src.start(t);
  }

  // A track's audio: the owner's MP3 when it exists, else the placeholder made in code (src/audio/music.ts).
  private placeholders = new Map<MusicId, Promise<AudioBuffer | null>>();
  private async track(id: MusicId): Promise<AudioBuffer | null> {
    const real = await this.load(MUSIC[id].file);
    if (real || !this.ctx) return real;
    let p = this.placeholders.get(id);
    if (!p) { p = renderPlaceholder(this.ctx.sampleRate, id).catch(() => null); this.placeholders.set(id, p); }
    return p;
  }

  private load(file: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(file);
    if (!p) {
      p = fetch(file)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
        .then(b => this.ctx!.decodeAudioData(b))
        .catch(() => null);
      this.buffers.set(file, p);
    }
    return p;
  }

  private async switchTo(id: MusicId | null) {
    if (!this.ctx || !this.musicBus) return;
    const fade = AUDIO_DEFAULTS.fadeSeconds;
    const old = this.playing;
    if (old && old.id !== id) {
      const t = this.ctx.currentTime;
      old.gain.gain.cancelScheduledValues(t);
      old.gain.gain.setValueAtTime(old.gain.gain.value, t);
      old.gain.gain.linearRampToValueAtTime(0, t + fade);
      old.src.stop(t + fade + 0.05);
      this.playing = null;
    }
    if (!id || this.playing?.id === id) return;
    const track = MUSIC[id];
    const buf = await this.track(id);
    if (!buf || this.wanted !== id || !this.ctx || !this.musicBus) return;   // missing, or the moment has moved on
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = track.loop;
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + fade);
    src.connect(gain);
    gain.connect(this.musicBus);
    src.start(t);
    this.playing = { id, src, gain };
  }
}

export const audio = new AudioPlayer();
