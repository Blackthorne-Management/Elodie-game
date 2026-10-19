// Remembered choices (Batch D, Oct 19; demo review finding 11): Chapter 1's answers are kept as `choice.*` flags
// and come back later in someone's lines. The scripted route always takes the first answer, so every other
// branch is played here. Plus the departure at dawn (decision C) and the "tonight" fix in Chapter 2's cave.

import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/data/content.ts';
import { RPG } from '../src/data/rpg.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { itemCount } from '../src/engine/rpg.ts';

/** Talk to `id`, picking the choices whose text starts with each of `picks` in turn; returns every line shown. */
function talk(flags: FlagStore, id: string, picks: string[] = []): string[] {
  const run = new DialogueRunner(CONTENT.dialogue[id]!, CONTENT.speakers, flags);
  const seen: string[] = [];
  const queue = [...picks];
  for (let i = 0; i < 300 && !run.done; i++) {
    const v = run.view();
    if (v.kind === 'end') break;
    seen.push(v.text);
    if (v.kind === 'choice') {
      const want = queue.shift();
      const c = want === undefined ? undefined : v.choices.find((ch) => ch.text.startsWith(want));
      if (!c) throw new Error(`${id}: no choice "${want}" in ${v.choices.map((ch) => ch.text).join(' / ')}`);
      run.choose(c.index);
    } else run.advance();
  }
  expect(queue, `${id}: unused picks`).toEqual([]);
  return seen;
}
const text = (lines: string[]) => lines.join(' | ');

describe("Mother's farewell at the gate, remembered", () => {
  const atGate = () => new FlagStore({ 'story.heard_speech': true });

  it('"Why do you have to go now?": Grandmother hears it, and Gianna says it again at the dock', () => {
    const flags = atGate();
    talk(flags, 'elodie_talk', ['Why do you have to go now?']);
    expect(flags.isSet('choice.farewell_why')).toBe(true);
    expect(flags.isSet('choice.farewell_fine')).toBe(false);
    flags.set('story.elodie_left', true);
    const gran = text(talk(flags, 'anicette_talk'));
    expect(gran).toContain('She said the Crown is talking about Xaraguá again.');
    expect(gran).toContain('Then she told you more than she told me.');
    expect(gran).not.toContain('Good. Then'); // review, Oct 19: no "Good." twice
    const dock = talk(new FlagStore({ 'party.anissa': true, 'choice.farewell_why': true }), 'yari_talk', ["Of course I'll come."]);
    const i = dock.findIndex((l) => l.includes("She didn't say it had already sailed"));
    expect(i).toBeGreaterThan(0);
    // Added before Gianna's own line, so Yari's "That's what they called it" still answers it.
    expect(dock[i + 1]).toBe('The Sun Accord. The seventh clause...');
    expect(dock[i + 2]).toContain("That's what they called it");
  });

  it('"We\'ll be fine.": Grandmother does not believe it either', () => {
    const flags = atGate();
    talk(flags, 'elodie_talk', ["We'll be fine."]);
    expect(flags.isSet('choice.farewell_fine')).toBe(true);
    flags.set('story.elodie_left', true);
    const gran = text(talk(flags, 'anicette_talk'));
    expect(gran).toContain("I told her we'd be fine.");
    expect(gran).toContain('And did she believe you?');
    expect(gran).toContain('Neither do I. That is why you get this.');
    expect(text(talk(new FlagStore({ 'party.anissa': true, 'choice.farewell_fine': true }), 'yari_talk', ['Tell me everything']))).not.toContain('already sailed');
  });

  it('a save from before the choice was remembered gets the old lines', () => {
    const gran = text(talk(new FlagStore({ 'story.elodie_left': true }), 'anicette_talk'));
    expect(gran).toContain("Good. Then she can't scold me for this.");
    expect(gran).not.toContain('And did she believe you?');
  });
});

describe("Yari's two answers at the dock, remembered", () => {
  const ready = (answer: string) => {
    const flags = new FlagStore({ 'party.anissa': true });
    const first = talk(flags, 'yari_talk', [answer]);
    for (const f of ['story.envoy_papers', 'encounter.wilds.boar.won', 'side.overdue.done', 'side.soup.done', 'side.cane_name.done', 'debate.zetwal_corner.joined']) flags.set(f, true);
    return { flags, first, depart: talk(flags, 'yari_talk', ["Let's go."]) };
  };

  it('"Of course I\'ll come.": she says she knew, and holds Gianna to it at the canoe', () => {
    const { flags, first, depart } = ready("Of course I'll come.");
    expect(flags.isSet('choice.yari_sure')).toBe(true);
    expect(text(first)).toContain("I told my father you'd say that");
    expect(text(depart)).toContain("'Of course,' you said.");
    expect(text(depart)).not.toContain('Everything, on the way');
  });

  it('"Tell me everything on the way.": she starts with the ships, and in Yucayeque asks Gianna to count them', () => {
    const { flags, first, depart } = ready('Tell me everything on the way.');
    expect(flags.isSet('choice.yari_everything')).toBe(true);
    expect(text(first)).toContain("I'll start with the ships");
    expect(text(first)).toContain('Soon, Yari.'); // both answers go on to the same request for time
    expect(text(depart)).toContain('Everything, on the way.');
    const arrival = text(talk(flags, 'xaragua_arrival'));
    expect(arrival).toContain('I told you about the two ships. Count them.');
    expect(arrival).not.toContain('There were two ships when I left');
    expect(text(talk(new FlagStore({ 'choice.yari_sure': true }), 'xaragua_arrival'))).toContain('There were two ships when I left');
  });
});

describe("The soup vendor's greeting, remembered (the first answer counts)", () => {
  const city = () => new FlagStore({ 'story.elodie_left': true, 'item.sun_locket': true, 'story.warroom_echo': true });
  const deliver = (flags: FlagStore) => {
    for (const f of ['side.soup.elder', 'side.soup.guard', 'side.soup.ferry']) flags.set(f, true);
    return text(talk(flags, 'soup_vendor_talk'));
  };

  it('"It smells wonderful." flows straight into the errand and pays off when the soup is delivered', () => {
    const flags = city();
    const lines = text(talk(flags, 'soup_vendor_talk', ['It smells wonderful', "I'll carry them"]));
    expect(lines).toContain('Wonderful is the least it is allowed to be');
    expect(lines).toContain('My nephew is asleep under a mango tree');
    expect(flags.isSet('side.soup.accepted')).toBe(true);
    expect(deliver(flags)).toContain('Now you can say it knowing');
  });

  it('the greeting is answered once: met again, she does not ask, and the first answer is the one she remembers', () => {
    const flags = city();
    flags.set('story.warroom_echo', false);
    talk(flags, 'soup_vendor_talk', ['Save me a bowl']);
    flags.set('story.warroom_echo', true);
    const again = talk(flags, 'soup_vendor_talk', ["I'll carry them"]);
    expect(again[0]).toBe('Back again, cousin? The pot is still hot.');
    expect(flags.isSet('choice.soup_bowl')).toBe(true);
    expect(flags.isSet('choice.soup_smell')).toBe(false);
    expect(deliver(flags)).toContain("cousin's bowl");
  });

  it('with the overdue book on her shelf: the greeting, the book, then the errand, in one talk', () => {
    const flags = city();
    flags.set('side.overdue.accepted', true);
    const lines = talk(flags, 'soup_vendor_talk', ['Save me a bowl', "I'll carry them"]);
    expect(flags.isSet('side.overdue.soup')).toBe(true);
    expect(flags.isSet('side.soup.accepted')).toBe(true);
    expect(lines.findIndex((l) => l.includes('Page forty'))).toBeLessThan(lines.findIndex((l) => l.includes('My nephew')));
  });
});

describe("The Crown's consul in the Chancellor's office (decision D, revised Oct 19)", () => {
  const sealed = () => new FlagStore({ 'party.anissa': true, 'story.anissa_woke': true, 'story.yari_asked': true, 'item.draft_papers': 1, 'story.papers_sealed': true });

  it('asks about the lamps, wants Zetwal to acknowledge His Majesty\'s protection of the southern waters, and is refused', () => {
    const lines = text(talk(sealed(), 'chancellor_talk', ['Say nothing']));
    expect(lines).toContain('Every lamp in Pòdlimyè lit itself at once tonight');
    expect(lines).toContain("acknowledge His Majesty's protection of the southern waters");
    expect(lines).toContain('Nobody signs in that chair while she is away');
    expect(lines).toContain('That is the paper. They nailed it to our customs house.');
    // Chapter 2's council keeps its reveal, and Thorne keeps his lines.
    for (const no of ['seventh', 'clause', 'Throne, under seal', 'just arrived', 'my regards', "he's looking at me"]) expect(lines).not.toContain(no);
  });

  it('"Zetwal\'s waters are its own." is remembered, and Gianna says so at the elders\' council', () => {
    const flags = sealed();
    const lines = text(talk(flags, 'chancellor_talk', ["Zetwal's waters are its own."]));
    expect(lines).toContain('Spoken like your mother, Miss Limyè. She says it more quietly.');
    expect(flags.isSet('choice.envoy_waters')).toBe(true);
    const council = talk(flags, 'xaragua_council');
    const said = council.indexOf("They asked Zetwal to thank them for protecting our waters too. We didn't.");
    expect(said).toBeGreaterThan(0);
    // Not just before Yari's "Then show us the seventh clause" (review, Oct 19: the two would say the same thing).
    expect(council[said + 1]).not.toBe('Then show us the seventh clause.');
  });

  it('"Say nothing." is not remembered, and the council plays as before', () => {
    const flags = sealed();
    expect(text(talk(flags, 'chancellor_talk', ['Say nothing.']))).toContain('Wise. Not everyone in this city is.');
    expect(flags.isSet('choice.envoy_waters')).toBe(false);
    expect(text(talk(flags, 'xaragua_council'))).not.toContain('protecting our waters too');
  });

  it("after the scene he is gone from the Hall: the other envoy and the consul's own lines know it", () => {
    const flags = sealed();
    talk(flags, 'chancellor_talk', ['Say nothing.']);
    expect(text(talk(flags, 'foreign_envoy_talk'))).toContain('left the Hall');
  });
});

describe('the veiled woman on the Cane Road, remembered', () => {
  it('"Stay away from her." comes back from the hooded stranger on the plaza after the lamp', () => {
    const flags = new FlagStore({ 'story.anissa_woke': true });
    expect(text(talk(flags, 'recruiter_b_talk'))).not.toContain('woman by the mill');
    talk(flags, 'road_watcher_talk', ['Stay away from her.']);
    expect(flags.isSet('choice.warned_watcher')).toBe(true);
    expect(text(talk(flags, 'recruiter_b_talk'))).toContain('The woman by the mill says you told her to stay away.');
    const other = new FlagStore({ 'story.anissa_woke': true });
    talk(other, 'road_watcher_talk', ['Who are you?']);
    expect(other.isSet('choice.warned_watcher')).toBe(false);
  });
});

describe('the departure at dawn (decision C with the whistle, Oct 19)', () => {
  const ready = () =>
    new FlagStore({
      'party.anissa': true,
      'story.yari_asked': true,
      'story.envoy_papers': true,
      'encounter.wilds.boar.won': true,
      'side.overdue.done': true,
      'side.soup.done': true,
      'side.cane_name.done': true,
      'debate.zetwal_corner.joined': true,
    });

  it("Grandmother brings food and says it: ask them, not the Crown; Grandfather gives his Marshal's whistle; then the voyage", () => {
    const flags = ready();
    const lines = text(talk(flags, 'yari_talk', ["Let's go."]));
    expect(lines).toContain('Ask them what we promised. Ask them, not the Crown.');
    expect(itemCount(flags, 'anicette_kasav')).toBe(3);
    expect(flags.isSet('item.marshal_whistle')).toBe(true);
    expect(flags.isSet('act1.complete')).toBe(true);
    expect(flags.get('voyage.next')).toBe('zetwal_xaragua');
  });

  it('the whistle is a key item with no stats, and the kasav only Grandmother gives', () => {
    const w = RPG.items.marshal_whistle!;
    expect(w.kind).toBe('key');
    expect(w.stats).toBeUndefined();
    const k = RPG.items.anicette_kasav!;
    expect(k.kind).toBe('consumable');
    for (const shop of Object.values(RPG.shops)) expect(shop.stock).not.toContain('anicette_kasav');
  });

  it("Grandfather's later farewell mentions the whistle only if Gianna has it", () => {
    expect(text(talk(new FlagStore({ 'act1.complete': true, 'item.marshal_whistle': true }), 'patricio_old_talk'))).toContain('keep the whistle close');
    expect(text(talk(new FlagStore({ 'act1.complete': true }), 'patricio_old_talk'))).toContain('Ask them, not the Crown');
  });
});

describe("Chapter 2's cave: tonight, not two nights (Batch D, section 5)", () => {
  it('the low tide is tonight every time it is mentioned', () => {
    const script = CONTENT.dialogue.yari_hidden_talk!;
    const all = Object.values(script.nodes).flatMap((n) => n.lines.map((l) => l.text));
    expect(all.some((t) => /two nights/i.test(t))).toBe(false);
    expect(all.some((t) => t.startsWith('Tonight.'))).toBe(true);
  });
});
