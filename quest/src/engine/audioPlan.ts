// What the quest should sound like right now: which song plays (by map, era, battle and conversation),
// each speaker's voice pitch, and when a typing line makes a blip. Pure TypeScript: src/audio/player.ts
// plays what this decides, and tests/audio.test.ts checks it. The content (songs, pitches) comes in
// from audio.config.ts; nothing here names a song.

import { evaluate, type Condition } from './conditions.ts';
import type { FlagReader } from './flags.ts';
import type { Era } from './types.ts';

export interface MusicRules<Id extends string> {
  byMap: Readonly<Record<string, Id>>;
  echo: Id;
  battle: Id;
  dialogue: readonly { dialogue: string; if?: Condition; music: Id }[];
}

export interface MusicSituation {
  mapId: string;
  era: Era;
  inBattle?: boolean;
  /** The conversation running now, if any. */
  dialogue?: string | null;
}

/** The song for the situation; null for silence (a map with no song). */
export function musicFor<Id extends string>(rules: MusicRules<Id>, s: MusicSituation, flags: FlagReader): Id | null {
  if (s.inBattle) return rules.battle;
  if (s.dialogue) {
    const rule = rules.dialogue.find((r) => r.dialogue === s.dialogue && (!r.if || evaluate(r.if, flags)));
    if (rule) return rule.music;
  }
  if (s.era === 'echo') return rules.echo;
  return rules.byMap[s.mapId] ?? null;
}

/** A speaker's voice pitch in Hz: theirs if listed, else one from their id (220 to 660 Hz, the same every time). */
export function voicePitch(pitches: Readonly<Record<string, number>>, speakerId: string): number {
  const listed = pitches[speakerId];
  if (listed !== undefined) return listed;
  let h = 0;
  for (const ch of speakerId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return 220 + (h % 441);
}

/**
 * Whether typing from `before` to `after` characters of `text` should blip: once every `every`
 * characters, and never on a space or punctuation (so speech has a rhythm, not a buzz).
 */
export function blipDue(text: string, before: number, after: number, every = 2): boolean {
  for (let i = before; i < after && i < text.length; i++) {
    if (i % every === 0 && /[\p{L}\p{N}]/u.test(text[i]!)) return true;
  }
  return false;
}

/** A volume step after `v` (wrapping round to the first). */
export function nextVolume(steps: readonly number[], v: number): number {
  const i = steps.findIndex((s) => s > v + 1e-6);
  return i === -1 ? steps[0]! : steps[i]!;
}

/** "Off", or a percentage. */
export function volumeLabel(v: number): string {
  return v <= 0 ? 'Off' : `${Math.round(v * 100)}%`;
}
