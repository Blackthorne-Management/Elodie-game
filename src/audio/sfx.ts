// The board game's sound effects, made in code with Web Audio (no files): each one is a few oscillators and filtered
// noise shaped by envelopes, played into the sound bus at a given time. Moody and short, to sit under the music.

export type SfxId =
  | 'tap' | 'chime' | 'dice' | 'step' | 'card' | 'instant' | 'hit' | 'block' | 'death' | 'rise'
  | 'influence' | 'fear' | 'wealth' | 'loss' | 'claim' | 'challenge' | 'toll' | 'win';

let noiseCache: AudioBuffer | null = null;
function noise(ctx: BaseAudioContext): AudioBuffer {
  if (noiseCache && noiseCache.sampleRate === ctx.sampleRate) return noiseCache;
  const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = b.getChannelData(0);
  let seed = 22222;                                   // a fixed pattern: the same hiss every time, no Math.random
  for (let i = 0; i < d.length; i++) { seed = (seed * 16807) % 2147483647; d[i] = (seed / 2147483647) * 2 - 1; }
  return (noiseCache = b);
}

// One enveloped voice: a fast attack, then an exponential fall to silence over `len` seconds.
function env(ctx: BaseAudioContext, out: AudioNode, at: number, peak: number, len: number, attack = 0.005): GainNode {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + len);
  g.connect(out);
  return g;
}
function tone(ctx: BaseAudioContext, out: AudioNode, at: number, type: OscillatorType, f0: number, f1: number, peak: number, len: number, attack?: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, at);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, at + len);
  o.connect(env(ctx, out, at, peak, len, attack));
  o.start(at);
  o.stop(at + len + 0.05);
}
function hiss(ctx: BaseAudioContext, out: AudioNode, at: number, filter: BiquadFilterType, f0: number, f1: number, peak: number, len: number, q = 1) {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, at);
  if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, at + len);
  src.connect(f);
  f.connect(env(ctx, out, at, peak, len));
  src.start(at, (at * 7919) % 0.5);
  src.stop(at + len + 0.05);
}
// A bell: a few inharmonic partials, each fading at its own rate.
function bell(ctx: BaseAudioContext, out: AudioNode, at: number, f: number, peak: number, len: number) {
  [[1, 1], [2.76, 0.5], [5.4, 0.25], [8.93, 0.12]].forEach(([m, a], i) => tone(ctx, out, at, 'sine', f * m, f * m, peak * a, len / (1 + i * 0.6)));
}

export function playSfx(ctx: BaseAudioContext, out: AudioNode, id: SfxId, at: number) {
  switch (id) {
    case 'tap': tone(ctx, out, at, 'sine', 1400, 900, 0.08, 0.04); break;
    case 'chime': bell(ctx, out, at, 660, 0.18, 1.2); bell(ctx, out, at + 0.14, 990, 0.12, 1.4); break;
    case 'dice':                                       // bone dice rattling in a cup, then settling
      [0, 0.05, 0.11, 0.16, 0.24, 0.33, 0.45].forEach((t, i) =>
        hiss(ctx, out, at + t, 'bandpass', 2200 + (i % 3) * 900, 1800, 0.35 - i * 0.03, 0.035, 6));
      tone(ctx, out, at + 0.45, 'triangle', 340, 300, 0.12, 0.06);
      break;
    case 'step': tone(ctx, out, at, 'sine', 150, 70, 0.22, 0.09); hiss(ctx, out, at, 'lowpass', 900, 400, 0.05, 0.06); break;
    case 'card': hiss(ctx, out, at, 'bandpass', 1800, 6000, 0.25, 0.14, 2); break;
    case 'instant':                                    // a swish, then an uneasy shimmer
      hiss(ctx, out, at, 'bandpass', 1500, 7000, 0.22, 0.16, 2);
      tone(ctx, out, at + 0.08, 'sine', 622, 659, 0.08, 0.7, 0.08);
      tone(ctx, out, at + 0.08, 'sine', 932, 880, 0.06, 0.7, 0.08);
      break;
    case 'hit': tone(ctx, out, at, 'sine', 120, 45, 0.5, 0.22); hiss(ctx, out, at, 'lowpass', 2500, 300, 0.35, 0.18); break;
    case 'block':                                      // steel on steel
      [523, 1312, 2106, 2950].forEach((f, i) => tone(ctx, out, at, 'square', f, f * 0.99, 0.05 / (i + 1), 0.45));
      hiss(ctx, out, at, 'highpass', 3000, 3000, 0.15, 0.08);
      break;
    case 'death':                                      // a low gong falling away
      tone(ctx, out, at, 'sine', 110, 55, 0.45, 1.8, 0.01);
      tone(ctx, out, at, 'sine', 164, 82, 0.2, 1.4, 0.01);
      hiss(ctx, out, at, 'lowpass', 400, 80, 0.15, 1.2);
      break;
    case 'rise':                                       // the heir rises: a soft climbing arpeggio
      [262, 330, 392, 523].forEach((f, i) => tone(ctx, out, at + i * 0.11, 'triangle', f, f, 0.12, 0.6));
      break;
    case 'influence': bell(ctx, out, at, 1046, 0.08, 0.6); break;
    case 'fear': tone(ctx, out, at, 'sawtooth', 73, 62, 0.12, 0.35, 0.03); hiss(ctx, out, at, 'lowpass', 300, 120, 0.12, 0.3); break;
    case 'wealth':                                     // two coins
      tone(ctx, out, at, 'sine', 2637, 2637, 0.07, 0.18); tone(ctx, out, at, 'sine', 3951, 3951, 0.04, 0.12);
      tone(ctx, out, at + 0.09, 'sine', 3136, 3136, 0.06, 0.2); tone(ctx, out, at + 0.09, 'sine', 4699, 4699, 0.03, 0.12);
      break;
    case 'loss': tone(ctx, out, at, 'triangle', 440, 220, 0.1, 0.3); break;
    case 'claim':                                      // a horn call: two rising notes
      [[220, 0, 0.45], [330, 0.4, 0.8]].forEach(([f, t, l]) => {
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.connect(out);
        tone(ctx, lp, at + t, 'sawtooth', f, f, 0.2, l, 0.06);
      });
      break;
    case 'challenge': [0, 0.28, 0.56].forEach(t => { tone(ctx, out, at + t, 'sine', 95, 50, 0.5, 0.3); hiss(ctx, out, at + t, 'lowpass', 600, 150, 0.12, 0.15); }); break;
    case 'toll': bell(ctx, out, at, 98, 0.4, 3.5); break;
    case 'win': [392, 494, 587, 784].forEach((f, i) => tone(ctx, out, at + i * 0.13, 'triangle', f, f, 0.14, 0.9)); break;
  }
}
