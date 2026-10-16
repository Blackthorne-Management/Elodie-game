// The street debate (engine/debate.ts, data/debates.ts; owner approved Oct 16): every way through
// Pòdlimyè's corner, the rewards (paid once), Concord, the book that unlocks Reason, and the Influence
// that unlocks Mediate.

import { describe, expect, it } from 'vitest';
import { CONCORD_START, DEBATE_MEDIATE_INFLUENCE } from '../src/config.ts';
import { CONTENT } from '../src/data/content.ts';
import { loreFlag } from '../src/data/books.ts';
import { DEBATES } from '../src/data/debates.ts';
import { concord, debateFlag, debateScript, settleDebates, type DebateDef } from '../src/engine/debate.ts';
import { DialogueRunner, checkDialogue } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';

const corner = DEBATES.find((d) => d.id === 'zetwal_corner')!;

/** Walk up to the corner and pick choices starting with each of `picks`; returns every line and choice seen. */
function visit(flags: FlagStore, picks: string[], influence = 0, def: DebateDef = corner): string[] {
  const script = debateScript(def, flags, { influence, mediateNeeds: DEBATE_MEDIATE_INFLUENCE });
  const run = new DialogueRunner(script, CONTENT.speakers, flags);
  const seen: string[] = [];
  const queue = [...picks];
  for (let i = 0; i < 200 && !run.done; i++) {
    const v = run.view();
    if (v.kind === 'end') break;
    seen.push(v.text);
    if (v.kind === 'choice') {
      seen.push(...v.choices.map((c) => `> ${c.text}`));
      const want = queue.shift();
      const c = v.choices.find((ch) => want !== undefined && ch.text.startsWith(want));
      if (!c) throw new Error(`no choice "${want}" in ${v.choices.map((ch) => ch.text).join(' / ')}`);
      run.choose(c.index);
    } else run.advance();
  }
  expect(queue).toEqual([]);
  return seen;
}

function opened(): FlagStore {
  const f = new FlagStore();
  f.set('story.warroom_echo', true);
  return f;
}

function settle(flags: FlagStore) {
  const pillars: Record<string, number> = {};
  let xp = 0;
  const paid = settleDebates(flags, DEBATES, (p, city, n) => (pillars[`${p}.${city}`] = (pillars[`${p}.${city}`] ?? 0) + n), (n) => (xp += n));
  return { paid, pillars, xp };
}

describe('the debate corner', () => {
  it('is only heard in passing until the war room memory is done', () => {
    const seen = visit(new FlagStore(), []);
    expect(seen.join(' ')).toContain('deep in an argument');
    expect(seen.some((s) => s.startsWith('> '))).toBe(false);
  });

  it('Listen tells both sides and pays +1 Influence once', () => {
    const flags = opened();
    visit(flags, ['Listen']);
    expect(flags.isSet(debateFlag('zetwal_corner', 'listened'))).toBe(true);
    expect(settle(flags).pillars).toEqual({ 'influence.zetwal': 1 });
    visit(flags, ['Listen']);
    expect(settle(flags).paid).toEqual([]);
  });

  it('Join: two strong answers out of three win; Concord +5, +1 Influence, 15 XP; then they move on', () => {
    const flags = opened();
    visit(flags, ['Join', 'Scripture', 'Compassion', 'Compassion']);
    expect(flags.isSet(debateFlag('zetwal_corner', 'won'))).toBe(true);
    const r = settle(flags);
    expect(r.pillars).toEqual({ 'influence.zetwal': 1 });
    expect(r.xp).toBe(15);
    expect(concord(flags)).toBe(CONCORD_START + 5);
    const after = visit(flags, []);
    expect(after.join(' ')).toContain('gone quiet on this corner');
  });

  it('a lost debate pays nothing and can be tried again', () => {
    const flags = opened();
    visit(flags, ['Join', 'Compassion', 'Scripture', 'Scripture']);
    expect(flags.isSet(debateFlag('zetwal_corner', 'won'))).toBe(false);
    expect(settle(flags).paid).toEqual([]);
    expect(concord(flags)).toBe(CONCORD_START);
    expect(visit(flags, ['Walk on']).some((s) => s === '> Join the debate')).toBe(true);
  });

  it('Reason is offered only after reading a book that backs it', () => {
    const flags = opened();
    expect(visit(flags, ['Join', 'Scripture', 'Scripture', 'Scripture']).some((s) => s.startsWith('> Reason'))).toBe(false);
    flags.set(loreFlag('zetwal_say_their_names'), true);
    const seen = visit(flags, ['Join', 'Scripture', 'Reason', 'Scripture']);
    expect(seen.some((s) => s.startsWith('> Reason'))).toBe(true);
    expect(flags.isSet(debateFlag('zetwal_corner', 'won'))).toBe(true);
  });

  it(`Mediate needs Influence ${DEBATE_MEDIATE_INFLUENCE} in the city; it pays Concord +10, +1 Influence, 25 XP`, () => {
    const flags = opened();
    const seen = visit(flags, ['Mediate (needs', 'Walk on'], 2);
    expect(seen.join(' ')).toContain('Influence in this city: 2 of 5');
    expect(flags.isSet(debateFlag('zetwal_corner', 'mediated'))).toBe(false);
    visit(flags, ['Mediate'], DEBATE_MEDIATE_INFLUENCE);
    expect(flags.isSet(debateFlag('zetwal_corner', 'mediated'))).toBe(true);
    const r = settle(flags);
    expect(r.xp).toBe(25);
    expect(concord(flags)).toBe(CONCORD_START + 10);
  });

  it('Provoke: +1 Fear, Concord -5, once; the debate stays open', () => {
    const flags = opened();
    visit(flags, ['Provoke']);
    expect(settle(flags).pillars).toEqual({ 'fear.zetwal': 1 });
    expect(concord(flags)).toBe(CONCORD_START - 5);
    visit(flags, ['Provoke']);
    expect(settle(flags).paid).toEqual([]);
    expect(visit(flags, ['Walk on']).some((s) => s === '> Join the debate')).toBe(true);
  });

  it('every debate passes the dialogue checks in every state, and every round has one strong answer', () => {
    for (const def of DEBATES) {
      for (const flags of [new FlagStore(), opened()]) {
        flags.set(loreFlag('zetwal_say_their_names'), true);
        const script = debateScript(def, flags, { influence: 9, mediateNeeds: DEBATE_MEDIATE_INFLUENCE });
        expect(checkDialogue({ [script.id]: script }, CONTENT.speakers), def.id).toEqual([]);
        // The same box limits as every other conversation (tests/content.test.ts).
        for (const node of Object.values(script.nodes)) {
          for (const l of node.lines) expect(l.text.length, l.text).toBeLessThanOrEqual(128);
          for (const c of node.choices ?? []) expect(c.text.length, c.text).toBeLessThanOrEqual(36);
        }
      }
      for (const r of def.rounds) expect(Object.values(r.answers).filter((a) => a.strength === 2)).toHaveLength(1);
    }
  });
});
