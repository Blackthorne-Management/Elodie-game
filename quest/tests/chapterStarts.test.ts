// The dev shortcut ?chapter=N (src/main.ts) loads src/data/starts/chapters.json: it must match what the
// scripted route really leaves at the end of the chapter before (tools/chapter-starts.ts), and it must play.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GameLogic } from '../src/engine/game.ts';
import { newGame } from '../src/engine/state.ts';
import { CONTENT } from '../src/data/content.ts';
import type { FlagSnapshot } from '../src/engine/flags.ts';
import { STARTS_FILE, startsText } from '../tools/chapter-starts.ts';
import { loadMaps } from '../tools/sim-setup.ts';

describe('chapter starts (?chapter=N on the dev server)', () => {
  it('match the scripted route (npx tsx tools/chapter-starts.ts)', () => {
    expect(readFileSync(STARTS_FILE, 'utf8')).toBe(startsText());
  });

  it('?chapter=2 lands at the Yucayeque pier with the party and the boar tusk, and Chapter 2 opens', () => {
    const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: FlagSnapshot }>;
    const at = starts['2']!;
    const maps = loadMaps();
    const state = newGame(maps[at.map]!, at.spawn);
    state.flags.load(at.flags);
    const logic = new GameLogic(maps, CONTENT, state);
    expect(state.flags.isSet('party.anissa') && state.flags.isSet('story.yari_asked')).toBe(true);
    expect(state.flags.get('item.boar_tusk') ?? state.flags.get('equip.gianna.charm')).toBeTruthy();
    expect(state.flags.isSet('travel.next')).toBe(false);
    logic.enterMap();
    expect(logic.mode).toBe('dialogue');
    expect(logic.dialogueId).toBe('xaragua_arrival');
  });
});
