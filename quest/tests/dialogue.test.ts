import { describe, expect, it } from 'vitest';
import { DIALOGUE } from '../src/data/dialogue.ts';
import { SPEAKERS } from '../src/data/speakers.ts';
import { DialogueRunner, checkDialogue, typewriterChars, type DialogueScript, type DialogueView } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';

const speakers = { a: { id: 'a', name: 'Speaker A', portrait: 'villager' } };

const script: DialogueScript = {
  id: 'test',
  start: 'start',
  nodes: {
    start: { lines: [], next: [{ if: { flag: 'seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      speaker: 'a',
      set: { seen: true },
      lines: [
        { text: 'One.' },
        { text: 'Hidden.', if: { flag: 'nope' } },
        { text: 'Two.', set: { 'line.two': true } },
      ],
      choices: [
        { text: 'Yes', set: { answer: 'yes' }, next: 'yes' },
        { text: 'Secret', if: { flag: 'nope' } },
        { text: 'No', set: { answer: 'no' } },
      ],
    },
    yes: { speaker: 'a', lines: [{ text: 'Good.', translation: 'Bon.' }] },
    again: {
      speaker: 'a',
      lines: [
        { text: 'You said yes.', if: { flag: 'answer', eq: 'yes' } },
        { text: 'You said no.', if: { flag: 'answer', eq: 'no' } },
      ],
    },
  },
};

function texts(views: DialogueView[]): string[] {
  return views.map((v) => (v.kind === 'end' ? '<end>' : v.text));
}

function run(flags: FlagStore, choose: number[] = []): DialogueView[] {
  const r = new DialogueRunner(script, speakers, flags);
  const seen: DialogueView[] = [];
  for (let i = 0; i < 20; i++) {
    const v = r.view();
    seen.push(v);
    if (v.kind === 'end') break;
    if (v.kind === 'choice') r.choose(choose.shift() ?? 0);
    else r.advance();
  }
  return seen;
}

describe('DialogueRunner', () => {
  it('shows visible lines with the speaker, then the choices with the last line', () => {
    const flags = new FlagStore();
    const r = new DialogueRunner(script, speakers, flags);
    const first = r.view();
    expect(first).toMatchObject({ kind: 'line', text: 'One.', speaker: { name: 'Speaker A', portrait: 'villager' } });
    expect(flags.get('seen')).toBe(true); // node set on enter
    r.advance();
    const second = r.view();
    expect(second.kind).toBe('choice');
    if (second.kind !== 'choice') return;
    expect(second.text).toBe('Two.');
    expect(second.choices.map((c) => c.text)).toEqual(['Yes', 'No']);
    expect(flags.get('line.two')).toBe(true); // line set when shown
  });

  it('applies choice flags and follows the choice', () => {
    const flags = new FlagStore();
    const views = run(flags, [0]);
    expect(texts(views)).toEqual(['One.', 'Two.', 'Good.', '<end>']);
    expect(views[2]).toMatchObject({ translation: 'Bon.' });
    expect(flags.get('answer')).toBe('yes');
  });

  it('a choice without next ends the conversation', () => {
    const flags = new FlagStore();
    expect(texts(run(flags, [1]))).toEqual(['One.', 'Two.', '<end>']);
    expect(flags.get('answer')).toBe('no');
  });

  it('branches and conditional lines follow the flags', () => {
    expect(texts(run(new FlagStore({ seen: true, answer: 'yes' })))).toEqual(['You said yes.', '<end>']);
    expect(texts(run(new FlagStore({ seen: true, answer: 'no' })))).toEqual(['You said no.', '<end>']);
  });

  it('ignores advance during a choice and rejects bad choice indexes', () => {
    const r = new DialogueRunner(script, speakers, new FlagStore());
    r.advance();
    r.advance(); // waiting on a choice: no effect
    expect(r.view().kind).toBe('choice');
    expect(() => r.choose(7)).toThrow();
  });

  it('refuses a script that loops without lines', () => {
    const loop: DialogueScript = { id: 'loop', start: 'a', nodes: { a: { lines: [], next: 'b' }, b: { lines: [], next: 'a' } } };
    expect(() => new DialogueRunner(loop, {}, new FlagStore())).toThrow(/loops/);
  });

  it('narration has no speaker; unknown speaker ids show the id', () => {
    const s: DialogueScript = {
      id: 's',
      start: 'a',
      nodes: { a: { lines: [{ text: 'Narration.' }, { text: 'Who?', speaker: 'ghost' }] } },
    };
    const r = new DialogueRunner(s, {}, new FlagStore());
    expect(r.view()).toMatchObject({ speaker: null });
    r.advance();
    expect(r.view()).toMatchObject({ speaker: { name: 'ghost' } });
  });
});

describe('typewriter', () => {
  it('reveals characters at the given speed and caps at the line length', () => {
    expect(typewriterChars(0, 45, 30)).toBe(0);
    expect(typewriterChars(100, 40, 30)).toBe(4);
    expect(typewriterChars(1000, 40, 30)).toBe(30);
    expect(typewriterChars(1, Number.POSITIVE_INFINITY, 30)).toBe(30);
  });
});

describe('dialogue content', () => {
  it('every script in data/dialogue.ts is well formed', () => {
    expect(checkDialogue(DIALOGUE, SPEAKERS)).toEqual([]);
  });

  it('the checker reports missing nodes and speakers', () => {
    const bad: Record<string, DialogueScript> = {
      x: { id: 'x', start: 'nope', nodes: { a: { speaker: 'who', lines: [{ text: 'hi' }], next: 'gone' } } },
    };
    const errors = checkDialogue(bad, SPEAKERS);
    expect(errors.some((e) => e.includes('start node "nope"'))).toBe(true);
    expect(errors.some((e) => e.includes('unknown speaker "who"'))).toBe(true);
    expect(errors.some((e) => e.includes('missing node "gone"'))).toBe(true);
  });

  it('the villager remembers the answer on the second talk', () => {
    const flags = new FlagStore();
    const first = new DialogueRunner(DIALOGUE.villager_talk!, SPEAKERS, flags);
    while (first.view().kind === 'line') first.advance();
    first.choose(0);
    expect(flags.snapshot()).toMatchObject({ 'villager.met': true, 'villager.answer': 'yes' });
    const again = new DialogueRunner(DIALOGUE.villager_talk!, SPEAKERS, flags);
    expect(again.view()).toMatchObject({ text: 'Back again? Remember: hold B to run.' });
  });
});

describe('expressions', () => {
  it("a line's mood reaches the view (and a line without one has none)", () => {
    const s: DialogueScript = { id: 'm', start: 'a', nodes: { a: { speaker: 'a', lines: [{ text: 'Stern.', mood: 'stern' }, { text: 'Plain.' }] } } };
    const r = new DialogueRunner(s, speakers, new FlagStore());
    const first = r.view();
    expect(first.kind === 'line' && first.mood).toBe('stern');
    r.advance();
    const second = r.view();
    expect(second.kind === 'line' && 'mood' in second).toBe(false);
  });
});
