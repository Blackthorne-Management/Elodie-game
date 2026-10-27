// The quest's sound effects, made in code (owner decision, Oct 16: the owner makes the music, the game
// makes its sounds): little 16-bit style blips, chimes, thumps and whooshes, built from square, triangle
// and sine waves and noise with short envelopes. Pure TypeScript (no browser): each sound is an array of
// samples that src/audio/player.ts turns into a sound once. Noise comes from a fixed-seed generator, so
// a sound is the same every time. Checked by tests/audio.test.ts.

import type { SfxId } from '../audio.config.ts';

type Wave = 'square' | 'triangle' | 'sine' | 'noise';

interface Note {
  /** Start, in seconds from the sound's start. */
  at: number;
  dur: number;
  wave: Wave;
  /** Start and end pitch in Hz (a slide when they differ). Ignored for noise. */
  from: number;
  to?: number;
  /** Peak level, 0 to 1. */
  gain: number;
  /** Attack and release, in seconds. */
  attack?: number;
  release?: number;
  /** Square duty (0.125 thin to 0.5 hollow). */
  duty?: number;
  /** Wobble: depth in Hz and rate in Hz. */
  vibrato?: [number, number];
}

function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function render(notes: readonly Note[], rate: number, seed = 7): Float32Array {
  const end = Math.max(...notes.map((n) => n.at + n.dur));
  const out = new Float32Array(Math.ceil(end * rate) + 1);
  const rnd = seeded(seed);
  for (const n of notes) {
    const start = Math.floor(n.at * rate);
    const len = Math.floor(n.dur * rate);
    const attack = Math.max(1, Math.floor((n.attack ?? 0.004) * rate));
    const release = Math.max(1, Math.floor((n.release ?? Math.min(0.06, n.dur / 2)) * rate));
    let phase = 0;
    let held = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const f = n.from + ((n.to ?? n.from) - n.from) * t + (n.vibrato ? n.vibrato[0] * Math.sin((2 * Math.PI * n.vibrato[1] * i) / rate) : 0);
      phase = (phase + f / rate) % 1;
      let v: number;
      switch (n.wave) {
        case 'square':
          v = phase < (n.duty ?? 0.5) ? 1 : -1;
          break;
        case 'triangle':
          v = 1 - 4 * Math.abs(phase - 0.5);
          break;
        case 'sine':
          v = Math.sin(2 * Math.PI * phase);
          break;
        case 'noise':
          // Held for a few samples: a softer, more "8-bit" noise.
          if (i % 3 === 0) held = rnd() * 2 - 1;
          v = held;
          break;
      }
      const env = Math.min(1, i / attack, (len - i) / release);
      const k = start + i;
      if (k < out.length) out[k]! += v * env * n.gain;
    }
  }
  // Never clip.
  let peak = 0;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  if (peak > 0.95) for (let i = 0; i < out.length; i++) out[i]! *= 0.95 / peak;
  return out;
}

/** Notes of a scale step above a root (equal temperament). */
const note = (root: number, semitones: number) => root * 2 ** (semitones / 12);
const C5 = 523.25;

/** A run of notes, `step` seconds apart. */
function arpeggio(root: number, steps: readonly number[], step: number, wave: Wave, gain: number, last = step * 2.5): Note[] {
  return steps.map((s, i) => ({
    at: i * step,
    dur: i === steps.length - 1 ? last : step * 1.3,
    wave,
    from: note(root, s),
    gain,
    duty: 0.25,
  }));
}

/** A name stone's chime (Z-4): a soft sine bell with a fifth above it and a long tail. */
function stoneChime(hz: number, at = 0, gain = 0.3): Note[] {
  return [
    { at, dur: 1.1, wave: 'sine', from: hz, gain, attack: 0.005, release: 0.95 },
    { at, dur: 0.8, wave: 'sine', from: hz * 1.5, gain: gain * 0.3, attack: 0.005, release: 0.7 },
    { at, dur: 0.6, wave: 'triangle', from: hz * 2, gain: gain * 0.12, attack: 0.005, release: 0.5, vibrato: [3, 5] },
  ];
}
/** The seven stones' notes, by stone number: in the first reading's order (3, 1, 5, 2, 6, 4, 7) they rise to a close. */
const STONE_HZ: readonly number[] = [0, 784, 659, 392, 587, 523, 440, 1047];

const RECIPES: Record<SfxId, () => Note[]> = {
  cursor: () => [{ at: 0, dur: 0.035, wave: 'square', from: 1320, gain: 0.25, duty: 0.25 }],
  confirm: () => [
    { at: 0, dur: 0.05, wave: 'square', from: 880, gain: 0.28, duty: 0.25 },
    { at: 0.05, dur: 0.08, wave: 'square', from: 1320, gain: 0.28, duty: 0.25 },
  ],
  cancel: () => [
    { at: 0, dur: 0.05, wave: 'square', from: 660, gain: 0.26, duty: 0.25 },
    { at: 0.05, dur: 0.08, wave: 'square', from: 440, gain: 0.26, duty: 0.25 },
  ],
  door: () => [
    { at: 0, dur: 0.12, wave: 'triangle', from: 320, to: 180, gain: 0.5 },
    { at: 0, dur: 0.07, wave: 'noise', from: 0, gain: 0.25 },
    { at: 0.13, dur: 0.1, wave: 'triangle', from: 140, to: 90, gain: 0.45 },
  ],
  bump: () => [
    { at: 0, dur: 0.11, wave: 'triangle', from: 130, to: 80, gain: 0.6 },
    { at: 0, dur: 0.04, wave: 'noise', from: 0, gain: 0.15 },
  ],
  echo_in: () => [
    { at: 0, dur: 0.7, wave: 'sine', from: 260, to: 1040, gain: 0.35, attack: 0.2, release: 0.3, vibrato: [18, 9] },
    { at: 0.08, dur: 0.62, wave: 'triangle', from: 390, to: 1560, gain: 0.18, attack: 0.2, release: 0.3, vibrato: [24, 7] },
  ],
  echo_out: () => [
    { at: 0, dur: 0.6, wave: 'sine', from: 1040, to: 260, gain: 0.35, attack: 0.05, release: 0.3, vibrato: [18, 9] },
    { at: 0.05, dur: 0.55, wave: 'triangle', from: 1560, to: 390, gain: 0.16, attack: 0.05, release: 0.3, vibrato: [24, 7] },
  ],
  // The "item received" fanfare.
  item: () => [...arpeggio(C5, [0, 4, 7, 12], 0.09, 'square', 0.22, 0.4), ...arpeggio(C5 / 2, [0, 7, 12, 16], 0.09, 'triangle', 0.3, 0.4)],
  coins: () => [
    { at: 0, dur: 0.06, wave: 'square', from: 1975, gain: 0.2, duty: 0.25 },
    { at: 0.06, dur: 0.2, wave: 'square', from: 2637, gain: 0.2, duty: 0.25 },
  ],
  quest: () => [...arpeggio(C5, [0, 4, 7, 9, 12, 16], 0.1, 'square', 0.2, 0.5), ...arpeggio(C5 / 2, [0, 0, 5, 5, 7, 12], 0.1, 'triangle', 0.3, 0.5)],
  level_up: () => arpeggio(C5, [0, 2, 4, 5, 7, 9, 11, 12], 0.06, 'square', 0.22, 0.35),
  save: () => [
    { at: 0, dur: 0.12, wave: 'sine', from: 988, gain: 0.3 },
    { at: 0.1, dur: 0.25, wave: 'sine', from: 1319, gain: 0.3 },
  ],
  hit: () => [
    { at: 0, dur: 0.09, wave: 'noise', from: 0, gain: 0.5 },
    { at: 0, dur: 0.12, wave: 'triangle', from: 180, to: 70, gain: 0.6 },
  ],
  crit: () => [
    { at: 0, dur: 0.12, wave: 'noise', from: 0, gain: 0.6 },
    { at: 0, dur: 0.16, wave: 'triangle', from: 220, to: 60, gain: 0.7 },
    { at: 0.03, dur: 0.12, wave: 'square', from: 1760, to: 2200, gain: 0.15, duty: 0.125 },
  ],
  heal: () => arpeggio(note(C5, 7), [0, 4, 7, 12, 16], 0.06, 'sine', 0.3, 0.3),
  miss: () => [{ at: 0, dur: 0.16, wave: 'noise', from: 0, gain: 0.2, attack: 0.06, release: 0.08 }],
  enemy_down: () => [
    { at: 0, dur: 0.35, wave: 'square', from: 440, to: 110, gain: 0.22, duty: 0.25 },
    { at: 0.05, dur: 0.3, wave: 'noise', from: 0, gain: 0.12, release: 0.2 },
  ],
  ally_down: () => [{ at: 0, dur: 0.45, wave: 'triangle', from: 330, to: 110, gain: 0.45 }],
  surge: () => [
    { at: 0, dur: 0.6, wave: 'square', from: 220, to: 880, gain: 0.18, duty: 0.25, attack: 0.1 },
    { at: 0.1, dur: 0.5, wave: 'sine', from: 440, to: 1760, gain: 0.25, attack: 0.1, vibrato: [30, 12] },
  ],
  run: () => [0, 0.09, 0.18, 0.27].map((at) => ({ at, dur: 0.05, wave: 'noise' as const, from: 0, gain: 0.3 })),
  // Narration typing out (no speaker): a soft tick.
  tick: () => [{ at: 0, dur: 0.02, wave: 'triangle', from: 1800, gain: 0.12 }],
  // A hoof on packed snow (the first-snow race's taps, Chapter 6).
  hoof: () => [
    { at: 0, dur: 0.12, wave: 'sine', from: 120, to: 60, gain: 0.6, release: 0.08 },
    { at: 0, dur: 0.05, wave: 'noise', from: 0, gain: 0.35 },
  ],
  // A hand on the skin of a drum (the rhythm lock's taps).
  drum: () => [
    { at: 0, dur: 0.18, wave: 'sine', from: 160, to: 70, gain: 0.7, release: 0.12 },
    { at: 0, dur: 0.03, wave: 'noise', from: 0, gain: 0.25 },
  ],
  // The Marshal's whistle (Chapter 10): two notes, high and low, a breath between.
  whistle: () => [
    { at: 0, dur: 0.42, wave: 'sine', from: 2093, gain: 0.3, attack: 0.02, release: 0.08, vibrato: [6, 7] },
    { at: 0.5, dur: 0.6, wave: 'sine', from: 1568, gain: 0.3, attack: 0.02, release: 0.2, vibrato: [6, 7] },
  ],
  // The harbor chain's capstan (Chapter 10), far off: a ratchet, click by click.
  ratchet: () => [0, 0.16, 0.32, 0.48, 0.64].flatMap((at) => [
    { at, dur: 0.05, wave: 'noise' as const, from: 0, gain: 0.25 },
    { at, dur: 0.06, wave: 'triangle' as const, from: 220, to: 160, gain: 0.3 },
  ]),
  // Chapter 11: a cannon far off (a thump and a long noise tail), a ragged volley of muskets, the chain running out of
  // the capstan (fast clicks falling away), and the conch (a low, rising horn).
  cannon: () => [
    { at: 0, dur: 0.5, wave: 'sine', from: 90, to: 40, gain: 0.7, release: 0.3 },
    { at: 0, dur: 0.9, wave: 'noise', from: 0, gain: 0.35, release: 0.7 },
  ],
  volley: () => [0, 0.05, 0.11, 0.18, 0.22, 0.3].map((at) => ({ at, dur: 0.12, wave: 'noise' as const, from: 0, gain: 0.3, release: 0.08 })),
  chain: () => Array.from({ length: 12 }, (_, i) => i * 0.07).flatMap((at, i) => [
    { at, dur: 0.04, wave: 'noise' as const, from: 0, gain: 0.25 - i * 0.015 },
    { at, dur: 0.05, wave: 'triangle' as const, from: 320 - i * 12, gain: 0.25 - i * 0.015 },
  ]),
  conch: () => [
    { at: 0, dur: 1.4, wave: 'triangle', from: 196, to: 233, gain: 0.45, attack: 0.15, release: 0.4, vibrato: [5, 4] },
    { at: 0, dur: 1.4, wave: 'sine', from: 392, to: 466, gain: 0.15, attack: 0.15, release: 0.4 },
  ],
  // The party falls (Game Over, shot 1): one low note as the battle music cuts.
  fall: () => [
    { at: 0, dur: 1.4, wave: 'triangle', from: 98, to: 92, gain: 0.5, attack: 0.02, release: 0.9 },
    { at: 0, dur: 1.2, wave: 'sine', from: 196, to: 185, gain: 0.18, attack: 0.02, release: 0.8 },
  ],
  // The Hall's bell (Chapter 12): low, heavy, once.
  hall_bell: () => [
    { at: 0, dur: 1.9, wave: 'sine', from: 147, gain: 0.5, attack: 0.005, release: 1.8 },
    { at: 0, dur: 1.7, wave: 'sine', from: 294, gain: 0.2, attack: 0.005, release: 1.6 },
    { at: 0, dur: 1.4, wave: 'triangle', from: 441, gain: 0.08, attack: 0.005, release: 1.3, vibrato: [2, 3] },
  ],
  // Z-4: the seven name stones, a wrong stone's knock, and all seven at once.
  stone_1: () => stoneChime(STONE_HZ[1]!),
  stone_2: () => stoneChime(STONE_HZ[2]!),
  stone_3: () => stoneChime(STONE_HZ[3]!),
  stone_4: () => stoneChime(STONE_HZ[4]!),
  stone_5: () => stoneChime(STONE_HZ[5]!),
  stone_6: () => stoneChime(STONE_HZ[6]!),
  stone_7: () => stoneChime(STONE_HZ[7]!),
  stone_hush: () => [
    { at: 0, dur: 0.14, wave: 'triangle', from: 110, to: 70, gain: 0.55 },
    { at: 0, dur: 0.05, wave: 'noise', from: 0, gain: 0.18 },
  ],
  stones_chord: () => [3, 1, 5, 2, 6, 4, 7].flatMap((n, i) => stoneChime(STONE_HZ[n]!, i * 0.06, 0.14)),
  // The goddess's soft bell, with a long tail (a recorded one replaces it: GAME_OVER_BELL_FILE).
  bell: () => [
    { at: 0, dur: 1.9, wave: 'sine', from: 784, gain: 0.32, attack: 0.005, release: 1.7 },
    { at: 0, dur: 1.6, wave: 'sine', from: 1568, gain: 0.12, attack: 0.005, release: 1.4 },
    { at: 0, dur: 1.2, wave: 'sine', from: 2352, gain: 0.06, attack: 0.005, release: 1.0, vibrato: [3, 5] },
  ],
  // The singing floor (Chapter 7): each board a chirp at its pitch, sliding up like a bird; a nailed board only knocks.
  board_0: () => [{ at: 0, dur: 0.08, wave: 'noise', from: 0, gain: 0.12, release: 0.05 }],
  board_1: () => chirp(BOARD_HZ[1]!, 0),
  board_2: () => chirp(BOARD_HZ[2]!, 0),
  board_3: () => chirp(BOARD_HZ[3]!, 0),
  board_4: () => chirp(BOARD_HZ[4]!, 0),
  board_5: () => chirp(BOARD_HZ[5]!, 0),
  // The informant's message: triangle, circle, diamond, square, (the silent board), star, triangle, circle, square.
  nightingale: () => [3, 1, 4, 2, 0, 5, 3, 1, 2].flatMap((p, i) => (p ? chirp(BOARD_HZ[p]!, i * 0.2) : [])),
  // Oil poured from one jar into another: a few soft glugs.
  pour: () => [0, 0.12, 0.22, 0.34].map((at, i) => ({ at, dur: 0.09, wave: 'sine' as const, from: 260 - i * 20, to: 180 - i * 20, gain: 0.25, release: 0.05 })),
};

/** The floor's five pitches (a pentatonic run), by board pitch 1 to 5. */
const BOARD_HZ = [0, 523, 587, 659, 784, 880] as const;

function chirp(hz: number, at: number): Note[] {
  return [
    { at, dur: 0.16, wave: 'triangle', from: hz, to: hz * 1.12, gain: 0.32, attack: 0.004, release: 0.08 },
    { at: at + 0.02, dur: 0.1, wave: 'sine', from: hz * 2, to: hz * 2.2, gain: 0.08, release: 0.06 },
  ];
}

/** The samples of a sound effect at a sample rate (mono, -1 to 1). */
export function renderSfx(id: SfxId, rate: number): Float32Array {
  return render(RECIPES[id](), rate);
}

/** One syllable of a wordless voice at a pitch (Hz): a short square blip with a little lift. */
export function renderVoice(pitch: number, rate: number): Float32Array {
  return render([{ at: 0, dur: 0.045, wave: 'square', from: pitch, to: pitch * 1.06, gain: 0.16, duty: 0.25, release: 0.025 }], rate);
}
