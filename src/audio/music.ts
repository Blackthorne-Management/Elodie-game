// Placeholder music, made in code until the owner's generated tracks arrive (docs/audio/MUSIC-PROMPTS.md): a dark,
// minor-key loop for each moment, rendered once in the browser with an OfflineAudioContext and cached. The player uses
// it only when a track's MP3 is missing, so a real file replaces it the moment it lands. The scores are data
// (SCORES) so their shape is tested; the rendering needs a browser.
import type { MusicId } from './plan';

// D minor: semitones above D3 for each chord (i, VI, iv, V and the relative major's colours).
const D3 = 146.83;
const CHORDS: Record<string, number[]> = { i: [0, 3, 7], VI: [8, 12, 15], iv: [5, 8, 12], V: [7, 11, 14], III: [3, 7, 10], VII: [10, 14, 17], I: [0, 4, 7] };

export interface Score {
  bpm: number;
  beatsPerChord: number;
  chords: string[];
  loop: boolean;
  drums: string;            // one bar of 8 eighth-notes: 'B' big drum, 'b' soft drum, '.' rest
  ostinato: boolean;        // plucked eighth-notes on the chord
  melody: (number | null)[]; // one note per beat, semitones above D4, null = rest (repeats over the loop)
  bell?: boolean;
}

export const SCORES: Record<MusicId, Score> = {
  title: { bpm: 76, beatsPerChord: 4, chords: ['i', 'VI', 'III', 'V', 'i', 'iv', 'VI', 'V', 'iv', 'VI', 'III', 'VII', 'VI', 'iv', 'V', 'V'], loop: true, drums: 'b.......', ostinato: false,
    melody: [7, null, 5, 3, 2, null, null, null, 3, null, 5, 7, 10, null, 8, 7, 5, null, null, null, 3, 2, 0, null, 2, null, null, null, -2, null, 0, null] },
  realm: { bpm: 84, beatsPerChord: 4, chords: ['i', 'iv', 'i', 'VI', 'iv', 'i', 'VII', 'V', 'VI', 'VII', 'i', 'iv', 'VI', 'iv', 'V', 'V'], loop: true, drums: 'b...b.b.', ostinato: false,
    melody: [null, null, 12, null, 10, null, null, null, null, null, 8, null, 7, null, null, null, null, null, 10, null, 12, null, 15, null, 14, null, null, null, null, null, null, null] },
  stakes: { bpm: 96, beatsPerChord: 4, chords: ['i', 'i', 'VI', 'VI', 'iv', 'iv', 'V', 'V', 'VI', 'VI', 'VII', 'VII', 'iv', 'iv', 'V', 'V'], loop: true, drums: 'B.b.B.bb', ostinato: true,
    melody: [null, null, null, null, 7, null, 8, null, 7, null, null, null, 5, null, 3, null, null, null, null, null, 7, null, 10, null, 8, null, 7, null, 5, null, 7, null] },
  throne: { bpm: 120, beatsPerChord: 4, chords: ['i', 'VI', 'VII', 'i', 'i', 'VI', 'iv', 'V', 'VI', 'VII', 'i', 'i', 'iv', 'VI', 'V', 'V'], loop: true, drums: 'B.bBB.bB', ostinato: true,
    melody: [0, null, 7, null, 12, null, 10, 12, 15, null, 14, null, 12, null, null, null, 10, null, 8, null, 7, null, 5, 7, 8, null, 10, null, 7, null, null, null] },
  victory: { bpm: 90, beatsPerChord: 3, chords: ['I', 'I', 'I', 'I', 'I'], loop: false, drums: 'B.......', ostinato: false,
    melody: [0, 4, 7, 12, null, null, 11, 12, 16, 19, null, null, 19, null, null, null, null, null] },
  defeat: { bpm: 60, beatsPerChord: 4, chords: ['i', 'iv', 'i'], loop: false, drums: '........', ostinato: false,
    melody: [7, null, 5, null, 3, null, 2, null, 0, null, null, null] },
  sudden: { bpm: 60, beatsPerChord: 6, chords: ['i'], loop: false, drums: 'B.......', ostinato: false, melody: [], bell: true },
};

const hz = (semi: number, base = D3) => base * 2 ** (semi / 12);

// A seeded pattern for anything that should vary a little (no Math.random).
function seeded(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

function impulse(ctx: BaseAudioContext, seconds: number): AudioBuffer {
  const n = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(2, n, ctx.sampleRate), r = seeded(7);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (r() * 2 - 1) * (1 - i / n) ** 3; }
  return b;
}

function voice(ctx: BaseAudioContext, out: AudioNode, type: OscillatorType, f: number, at: number, len: number, peak: number,
  attack: number, cutoff: number, detune = 0) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = type; o.frequency.value = f; o.detune.value = detune;
  lp.type = 'lowpass'; lp.frequency.value = cutoff;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(peak, at + attack);
  g.gain.setValueAtTime(peak, at + Math.max(attack, len - attack));
  g.gain.exponentialRampToValueAtTime(0.0001, at + len + attack);
  o.connect(lp); lp.connect(g); g.connect(out);
  o.start(at); o.stop(at + len + attack + 0.1);
}
function drum(ctx: BaseAudioContext, out: AudioNode, at: number, big: boolean) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(big ? 90 : 130, at);
  o.frequency.exponentialRampToValueAtTime(big ? 40 : 70, at + 0.35);
  g.gain.setValueAtTime(big ? 0.55 : 0.25, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + (big ? 0.6 : 0.3));
  o.connect(g); g.connect(out); o.start(at); o.stop(at + 0.7);
}

export async function renderPlaceholder(sampleRate: number, id: MusicId): Promise<AudioBuffer | null> {
  const OAC = (globalThis as unknown as { OfflineAudioContext?: typeof OfflineAudioContext }).OfflineAudioContext;
  if (!OAC) return null;
  const sc = SCORES[id];
  const beat = 60 / sc.bpm, len = sc.chords.length * sc.beatsPerChord * beat;
  const tail = 3;
  const ctx = new OAC(2, Math.ceil((len + tail) * sampleRate), sampleRate);
  const master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
  const verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 2.6);
  const wet = ctx.createGain(); wet.gain.value = 0.45; verb.connect(wet); wet.connect(master);
  const bus = ctx.createGain(); bus.connect(master); bus.connect(verb);

  sc.chords.forEach((name, ci) => {
    const at = ci * sc.beatsPerChord * beat, dur = sc.beatsPerChord * beat;
    const notes = CHORDS[name];
    // Pad: detuned saws, slow swell, dark filter. Drone: the chord's root an octave down.
    notes.forEach(n => [-7, 7].forEach(dt => voice(ctx, bus, 'sawtooth', hz(n), at, dur, 0.035, dur * 0.35, 900, dt)));
    voice(ctx, bus, 'triangle', hz(notes[0] - 12), at, dur, 0.12, 0.4, 400);
    if (sc.ostinato) for (let e = 0; e < sc.beatsPerChord * 2; e++)
      voice(ctx, bus, 'sawtooth', hz(notes[e % 3] + (e % 4 === 3 ? 12 : 0)), at + e * beat / 2, beat * 0.3, 0.05, 0.005, 1800);
    for (let e = 0; e < sc.beatsPerChord * 2; e++) {
      const hit = sc.drums[e % 8];
      if (hit !== '.') drum(ctx, bus, at + e * beat / 2, hit === 'B');
    }
  });
  // Melody: a horn-like voice (title, throne, victory) or a soft flute (the others), one note per beat.
  const horn = id === 'title' || id === 'throne' || id === 'victory';
  const beats = sc.chords.length * sc.beatsPerChord;
  for (let b = 0; b < beats && sc.melody.length; b++) {
    const n = sc.melody[b % sc.melody.length];
    if (n === null) continue;
    let held = 1;
    while (b + held < beats && sc.melody[(b + held) % sc.melody.length] === null && held < 3) held++;
    voice(ctx, bus, horn ? 'sawtooth' : 'triangle', hz(n, D3 * 2), b * beat, held * beat * 0.9, horn ? 0.06 : 0.08, 0.06, horn ? 1600 : 2400);
  }
  if (sc.bell) [1, 2.76, 5.4].forEach((m, i) => voice(ctx, bus, 'sine', 73.4 * m, 0, 4 / (1 + i), 0.3 / (1 + i), 0.005, 8000));

  const rendered = await ctx.startRendering();
  if (!sc.loop) return normalise(rendered);
  // A seamless loop: fold the reverb tail back onto the start.
  const n = Math.floor(len * sampleRate), out = new AudioBuffer({ numberOfChannels: 2, length: n, sampleRate });
  for (let c = 0; c < 2; c++) {
    const src = rendered.getChannelData(c), dst = out.getChannelData(c);
    dst.set(src.subarray(0, n));
    for (let i = n; i < src.length; i++) dst[i - n] += src[i];
  }
  return normalise(out);
}

// Every placeholder at the same, healthy level (peak 0.9), so the music sits beside the sound effects.
function normalise(b: AudioBuffer): AudioBuffer {
  let peak = 0;
  for (let c = 0; c < b.numberOfChannels; c++) for (const v of b.getChannelData(c)) peak = Math.max(peak, Math.abs(v));
  if (peak > 0) for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= 0.9 / peak; }
  return b;
}
