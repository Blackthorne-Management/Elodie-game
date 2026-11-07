// The counts a player is told to look at are on the screen (the objective review, Nov 7): the volleys left in the
// whistle's own choices and the fleet's Journal note (finding 7), and the Muster's companies in one Journal note.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';
import { JOURNAL_NOTES } from '../src/data/quests.ts';
import { COMPANIES } from '../src/data/war.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { GameLogic } from '../src/engine/game.ts';
import { journalNotes } from '../src/engine/quests.ts';
import { newGame } from '../src/engine/state.ts';
import { STARTS_FILE } from '../tools/chapter-starts.ts';
import { loadMaps } from '../tools/sim-setup.ts';

const starts = JSON.parse(readFileSync(STARTS_FILE, 'utf8')) as Record<string, { map: string; spawn: string; flags: Record<string, unknown> }>;
const format = (text: string, flags: FlagStore) => CONTENT.formatText!(text, flags);

describe('the volleys left', () => {
  it('each of the whistle\'s choices says how many are left, and nothing sends the player to the Journal for it', () => {
    const maps = loadMaps();
    const at = starts['11']!;
    const state = newGame(maps[at.map]!, at.spawn);
    state.flags.load(at.flags as never);
    state.flags.set('war.volleys_left', 16);
    const logic = new GameLogic(maps, CONTENT, state);
    logic.startDialogue('headland_battery');
    for (let i = 0; i < 20 && logic.view().kind === 'line'; i++) {
      expect(logic.view()).not.toMatchObject({ text: expect.stringContaining('Journal') });
      logic.advance();
    }
    const v = logic.view();
    expect(v.kind).toBe('choice');
    if (v.kind !== 'choice') return;
    expect(v.choices.map((c) => c.text)).toEqual(['Three volleys (16 left).', 'Two volleys (16 left).', 'One volley (16 left).', 'Hold your fire (16 left).']);
  });

  it('the fleet\'s note counts them', () => {
    const fleet = JOURNAL_NOTES.find((n) => n.id === 'war_fleet')!;
    expect(format(fleet.text, new FlagStore({ 'war.volleys_left': 7 }))).toContain(': 7 left.');
  });
});

describe('the companies', () => {
  it('one note, once the Muster counts the companies, says who sails and with how many', () => {
    const note = JOURNAL_NOTES.find((n) => n.id === 'muster_companies')!;
    expect(note.when).toBe('muster.resolved');
    const flags = new FlagStore({ 'muster.resolved': true, 'army.zetwal': 60, 'army.free_brasador': 30, 'army.skarragol': 50, 'army.al_doria': 0, 'army.jwaladesh': 35, 'army.kuroshi': 30, 'army.aldermoor': 15 });
    expect(journalNotes(JOURNAL_NOTES, flags).map((n) => n.id)).toContain('muster_companies');
    expect(format(note.text, flags)).toBe(
      'Six companies, 220 soldiers: Zetwal\'s levy 60, Free Brasador 30, the Ironvow 50, the Agnivansh 35, the Suzumori 30, Jordyn\'s watch 15. None for the Dorini marines.',
    );
    // Every company the war fights with is one the note can name.
    expect(new Set(COMPANIES.map((c) => c.army)).size).toBe(COMPANIES.length);
  });
});
