// Music and sound (owner music, Oct 16; sound effects made by the game): every map has a song, every song
// file exists, the right song plays where, every speaker has a voice, and every sound renders cleanly.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BATTLE_MUSIC, DIALOGUE_MUSIC, ECHO_MUSIC, MUSIC, MUSIC_BY_MAP, SFX_IDS, VOICE_PITCH, VOLUME_STEPS } from '../src/audio.config.ts';
import { renderSfx, renderVoice } from '../src/audio/sfx.ts';
import { CONTENT } from '../src/data/content.ts';
import { blipDue, musicFor, nextVolume, voicePitch, volumeLabel } from '../src/engine/audioPlan.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { QUEST_ROOT, loadMaps } from '../tools/sim-setup.ts';

const rules = { byMap: MUSIC_BY_MAP, echo: ECHO_MUSIC, battle: BATTLE_MUSIC, dialogue: DIALOGUE_MUSIC };

describe('music', () => {
  it('every song file is in public/ and every map has a song', () => {
    for (const [id, t] of Object.entries(MUSIC)) expect(existsSync(join(QUEST_ROOT, 'public', t.file)), id).toBe(true);
    for (const id of Object.keys(loadMaps())) {
      if (id.startsWith('test-')) continue;
      expect(MUSIC_BY_MAP[id], id).toBeDefined();
    }
    for (const r of DIALOGUE_MUSIC) expect(CONTENT.dialogue[r.dialogue], r.dialogue).toBeDefined();
  });

  it('plays the map song, the Echo theme in a memory, the battle theme in a fight', () => {
    const flags = new FlagStore();
    expect(musicFor(rules, { mapId: 'zetwal-town', era: 'present' }, flags)).toBe('festival');
    expect(musicFor(rules, { mapId: 'zetwal-market', era: 'present' }, flags)).toBe('city');
    expect(musicFor(rules, { mapId: 'zetwal-road', era: 'present' }, flags)).toBe('cane_road');
    expect(musicFor(rules, { mapId: 'zetwal-house', era: 'echo' }, flags)).toBe('echo');
    expect(musicFor(rules, { mapId: 'zetwal-road', era: 'present', inBattle: true }, flags)).toBe('battle');
    expect(musicFor(rules, { mapId: 'nowhere', era: 'present' }, flags)).toBeNull();
  });

  it("Mother's speech keeps the festival; seeing her off at the gate plays the farewell", () => {
    const flags = new FlagStore();
    expect(musicFor(rules, { mapId: 'zetwal-town', era: 'present', dialogue: 'elodie_talk' }, flags)).toBe('festival');
    flags.set('story.heard_speech', true);
    expect(musicFor(rules, { mapId: 'zetwal-town', era: 'present', dialogue: 'elodie_talk' }, flags)).toBe('farewell');
    expect(musicFor(rules, { mapId: 'zetwal-town', era: 'present', dialogue: 'soup_vendor_talk' }, flags)).toBe('festival');
  });
});

describe('sounds and voices', () => {
  it('every sound effect renders: short, never clipping, never silent', () => {
    for (const id of SFX_IDS) {
      const s = renderSfx(id, 22050);
      expect(s.length, id).toBeGreaterThan(100);
      expect(s.length / 22050, id).toBeLessThan(2);
      let peak = 0;
      for (const v of s) {
        expect(Number.isFinite(v)).toBe(true);
        peak = Math.max(peak, Math.abs(v));
      }
      expect(peak, id).toBeGreaterThan(0.05);
      expect(peak, id).toBeLessThanOrEqual(0.95 + 1e-6);
    }
    // The same every time.
    expect(Array.from(renderSfx('hit', 8000))).toEqual(Array.from(renderSfx('hit', 8000)));
    expect(renderVoice(440, 22050).length).toBeGreaterThan(100);
  });

  it('each speaker has a steady voice pitch, the family their own', () => {
    expect(voicePitch(VOICE_PITCH, 'anissa')).toBe(700);
    for (const id of Object.keys(CONTENT.speakers)) {
      const p = voicePitch(VOICE_PITCH, id);
      expect(p, id).toBeGreaterThanOrEqual(220);
      expect(p, id).toBeLessThanOrEqual(720);
      expect(voicePitch(VOICE_PITCH, id)).toBe(p);
    }
  });

  it('a line blips every other letter, never on spaces or punctuation', () => {
    expect(blipDue('Hello there', 0, 1)).toBe(true);
    expect(blipDue('Hello there', 1, 2)).toBe(false);
    expect(blipDue('Hi. Yes', 2, 3)).toBe(false); // '.'
    expect(blipDue('a b', 2, 3)).toBe(true);
    expect(blipDue('...', 0, 3)).toBe(false);
  });

  it('the volume steps cycle Off, 25%, 50%, 75%, 100%', () => {
    expect(nextVolume(VOLUME_STEPS, 0.6)).toBe(0.75);
    expect(nextVolume(VOLUME_STEPS, 1)).toBe(0);
    expect(volumeLabel(0)).toBe('Off');
    expect(volumeLabel(0.5)).toBe('50%');
  });
});
