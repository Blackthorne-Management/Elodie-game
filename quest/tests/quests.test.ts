import { describe, expect, it } from 'vitest';
import { parseConditionText } from '../src/engine/conditions.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { HintTracker, hintsDue } from '../src/engine/hints.ts';
import { currentObjective, journalEntries, journalNotes, type QuestDef } from '../src/engine/quests.ts';

const quest: QuestDef = {
  id: 'q',
  title: 'Q',
  maps: ['m'],
  objectives: [
    { id: 'a', title: 'A', detail: 'do a', done: { flag: 'a' }, hints: ['a1', 'a2', 'a3'] },
    { id: 'b', title: 'B', detail: 'do b', done: { flag: 'b' }, hints: ['b1'] },
  ],
};

describe('quests and the Journal', () => {
  it('the current objective is the first not done; later ones stay hidden', () => {
    const flags = new FlagStore();
    expect(currentObjective(quest, flags)?.id).toBe('a');
    expect(journalEntries(quest, flags)).toEqual([{ title: 'A', detail: 'do a', state: 'current' }]);
    flags.set('a', true);
    expect(currentObjective(quest, flags)?.id).toBe('b');
    expect(journalEntries(quest, flags).map((e) => e.state)).toEqual(['done', 'current']);
    flags.set('b', true);
    expect(currentObjective(quest, flags)).toBeNull();
  });

  it('notes appear once their flag is set', () => {
    const flags = new FlagStore({ 'clue.x': true });
    const notes = [
      { id: 'x', when: 'clue.x', title: 'X', text: '' },
      { id: 'y', when: 'clue.y', title: 'Y', text: '' },
    ];
    expect(journalNotes(notes, flags).map((n) => n.id)).toEqual(['x']);
  });
});

describe("Anissa's hints (guide 6.2 rule 4)", () => {
  const timing = { firstMs: 180_000, repeatMs: 90_000 };

  it('none before 3 minutes stuck, then one more every 90 s, up to the answer', () => {
    expect(hintsDue(179_999, 3, timing)).toBe(0);
    expect(hintsDue(180_000, 3, timing)).toBe(1);
    expect(hintsDue(269_999, 3, timing)).toBe(1);
    expect(hintsDue(270_000, 3, timing)).toBe(2);
    expect(hintsDue(10_000_000, 3, timing)).toBe(3);
    expect(hintsDue(10_000_000, 0, timing)).toBe(0);
  });

  it('the tracker shows each hint once and restarts the clock on a new objective', () => {
    const t = new HintTracker(timing);
    expect(t.tick(179_000, 'a', 3)).toBeNull();
    expect(t.tick(1_000, 'a', 3)).toBe(0);
    expect(t.tick(1_000, 'a', 3)).toBeNull();
    expect(t.tick(90_000, 'a', 3)).toBe(1);
    expect(t.onRequest(3)).toBe(1);
    expect(t.tick(1_000, 'b', 1)).toBeNull();
    expect(t.stuckFor).toBe(1_000);
    expect(t.onRequest(1)).toBe(0);
    expect(t.tick(500_000, null, 0)).toBeNull();
  });
});

describe('condition text (Tiled `if` properties)', () => {
  it('parses flags, negation, alternatives and lists', () => {
    expect(parseConditionText('')).toEqual({ ok: true, cond: undefined });
    expect(parseConditionText('a.b')).toEqual({ ok: true, cond: { flag: 'a.b' } });
    expect(parseConditionText('!a')).toEqual({ ok: true, cond: { notFlag: 'a' } });
    expect(parseConditionText('a, !b')).toEqual({ ok: true, cond: { all: [{ flag: 'a' }, { notFlag: 'b' }] } });
    expect(parseConditionText('a|b, c')).toEqual({
      ok: true,
      cond: { all: [{ any: [{ flag: 'a' }, { flag: 'b' }] }, { flag: 'c' }] },
    });
    expect(parseConditionText('a,,b').ok).toBe(false);
    expect(parseConditionText('a b').ok).toBe(false);
  });
});
