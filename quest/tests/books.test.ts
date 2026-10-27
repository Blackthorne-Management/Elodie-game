// Lore books and shelves (data/books.ts): length rules from guide 6.6, pages that fit the dialogue
// box, choice lists that fit above it, and reading that marks a book read and returns to the list.

import { describe, expect, it } from 'vitest';
import { BOOKS, MAX_PAGE_CHARS, SHELVES, bookPages, lookFlag, loreFlag, shelfDialogueId, wordCount } from '../src/data/books.ts';
import { CONTENT } from '../src/data/content.ts';
import { DialogueRunner } from '../src/engine/dialogue.ts';
import { FlagStore } from '../src/engine/flags.ts';
import { loadMaps } from '../tools/sim-setup.ts';

describe('lore books', () => {
  it('are 100 to 150 words, in pages of whole sentences that fit the box', () => {
    for (const b of BOOKS) {
      const words = wordCount(b.text);
      expect(words, b.id).toBeGreaterThanOrEqual(100);
      expect(words, b.id).toBeLessThanOrEqual(150);
      for (const page of bookPages(b.text)) expect(page.length, `${b.id}: ${page}`).toBeLessThanOrEqual(MAX_PAGE_CHARS);
      expect(bookPages(b.text).join(' ')).toBe(b.text.trim());
    }
  });

  it('sit on exactly one shelf each, and every title still fits marked "(read)"', () => {
    const shelved = SHELVES.flatMap((s) => s.books);
    expect(new Set(shelved).size).toBe(shelved.length);
    expect(new Set(shelved)).toEqual(new Set(BOOKS.map((b) => b.id)));
    for (const b of BOOKS) expect(`${b.title} (read)`.length, b.id).toBeLessThanOrEqual(36);
  });

  it('every bookshelf id is unique, so no shelf hides another (Zetwal\'s Hall and the Seat\'s both used hall_records)', () => {
    const ids = SHELVES.map((s) => s.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    // Every placed shelf object is unique too (the map object id is the shelf id).
    const placed = Object.values(loadMaps()).flatMap((m) => m.objects.filter((o) => o.dialogue?.startsWith('shelf.')).map((o) => o.id));
    expect(placed.filter((id, i) => placed.indexOf(id) !== i)).toEqual([]);
    // The two books on Zetwal's Harbor Records shelf can be read in Pòdlimyè's Hall.
    const zetwal = CONTENT.dialogue[shelfDialogueId('hall_harbor_records')]!;
    const view = new DialogueRunner(zetwal, CONTENT.speakers, new FlagStore()).view();
    expect(view.kind === 'choice' && view.choices.map((c) => c.text)).toEqual([...['zetwal_harbor_tolls', 'zetwal_quiet_tract'].map((id) => BOOKS.find((b) => b.id === id)!.title), 'Leave']);
    expect(loadMaps()['zetwal-hall']!.objects.find((o) => o.id === 'hall_harbor_records')?.dialogue).toBe(shelfDialogueId('hall_harbor_records'));
  });

  it('every shelf stands on a map and lists at most eight books plus Leave', () => {
    const maps = Object.values(loadMaps());
    for (const s of SHELVES) {
      expect(s.books.length, s.id).toBeLessThanOrEqual(8);
      const placed = maps.flatMap((m) => m.objects).find((o) => o.id === s.id);
      expect(placed?.dialogue, s.id).toBe(shelfDialogueId(s.id));
    }
  });

  it('reading a book shows its pages, marks it read, and goes back to the list', () => {
    const shelf = SHELVES[0]!;
    const flags = new FlagStore();
    const r = new DialogueRunner(CONTENT.dialogue[shelfDialogueId(shelf.id)]!, CONTENT.speakers, flags);
    let view = r.view();
    expect(view.kind).toBe('choice');
    if (view.kind !== 'choice') return;
    expect(view.choices.map((c) => c.text)).toEqual([...shelf.books.map((id) => BOOKS.find((b) => b.id === id)!.title), 'Leave']);
    r.choose(view.choices[0]!.index);
    const book = BOOKS.find((b) => b.id === shelf.books[0])!;
    const pages: string[] = [];
    for (view = r.view(); view.kind === 'line'; view = r.view()) {
      expect(view.speaker?.name).toBe(book.title);
      pages.push(view.text);
      r.advance();
    }
    expect(pages).toEqual(bookPages(book.text));
    expect(flags.isSet(loreFlag(book.id))).toBe(true);
    expect(view.kind === 'choice' && view.choices[0]!.text).toBe(`${book.title} (read)`);
  });
});

// The second looks (the Chapter 10 to 12 outlines' 7.4, built Oct 27): a line of Gianna's after a book's last page once
// the story has moved on, and "(again)" on a book already read, for the line alone.
describe('the books\' second looks', () => {
  const LOOKS: Record<string, string> = {
    zetwal_sun_accord: 'story.patricio_told',
    zetwal_ash_wars_temple: 'clue.four_accounts',
    xaragua_first_oath: 'story.harbor_taken',
    xaragua_charter: 'story.thorne_taken',
    seat_petitions_breach: 'clue.petition_original',
    seat_council_eight: 'story.claim_won',
  };
  const shelfOf = (id: string) => SHELVES.find((s) => s.books.includes(id))!;
  const runner = (id: string, flags: FlagStore) => new DialogueRunner(CONTENT.dialogue[shelfDialogueId(shelfOf(id).id)]!, CONTENT.speakers, flags);
  const titles = (r: DialogueRunner) => {
    const v = r.view();
    return v.kind === 'choice' ? v.choices.map((c) => c.text) : [];
  };
  const pick = (r: DialogueRunner, text: string) => {
    const v = r.view();
    if (v.kind !== 'choice') throw new Error('no list');
    r.choose(v.choices.find((c) => c.text === text)!.index);
  };
  const readOn = (r: DialogueRunner) => {
    const out: { speaker: string | undefined; text: string }[] = [];
    for (let v = r.view(); v.kind === 'line'; v = r.view()) {
      out.push({ speaker: v.speaker?.id, text: v.text });
      r.advance();
    }
    return out;
  };

  it('the six the outlines name, each on a flag the story sets, short enough for the box and the list', () => {
    const withLook = BOOKS.filter((b) => b.secondLook);
    expect(Object.fromEntries(withLook.map((b) => [b.id, JSON.stringify(b.secondLook!.if)]))).toEqual(
      Object.fromEntries(Object.entries(LOOKS).map(([id, f]) => [id, JSON.stringify({ flag: f })])),
    );
    for (const b of withLook) {
      expect(b.secondLook!.text.length, b.id).toBeLessThanOrEqual(MAX_PAGE_CHARS);
      expect(`${b.title} (again)`.length, b.id).toBeLessThanOrEqual(36);
    }
  });

  it('unread, after the flag: the pages, then Gianna\'s line; read again later: the pages alone, the line said once', () => {
    for (const [id, flag] of Object.entries(LOOKS)) {
      const book = BOOKS.find((b) => b.id === id)!;
      const flags = new FlagStore();
      flags.set(flag, true);
      const r = runner(id, flags);
      pick(r, book.title);
      const read = readOn(r);
      expect(read.slice(0, -1).map((l) => l.text)).toEqual(bookPages(book.text));
      expect(read.at(-1)).toEqual({ speaker: 'gianna', text: book.secondLook!.text });
      expect(flags.isSet(loreFlag(id)) && flags.isSet(lookFlag(id))).toBe(true);
      expect(titles(r)).toContain(`${book.title} (read)`);
      expect(titles(r)).not.toContain(`${book.title} (again)`);
    }
  });

  it('read before the flag: no line; after it, "(again)" gives the line alone and the list comes back with "(read)"', () => {
    for (const [id, flag] of Object.entries(LOOKS)) {
      const book = BOOKS.find((b) => b.id === id)!;
      const flags = new FlagStore();
      let r = runner(id, flags);
      pick(r, book.title);
      expect(readOn(r).map((l) => l.text)).toEqual(bookPages(book.text));
      expect(titles(r)).toContain(`${book.title} (read)`);
      const listed = titles(r).length;
      flags.set(flag, true);
      r = runner(id, flags);
      expect(titles(r)).toContain(`${book.title} (again)`);
      expect(titles(r)).not.toContain(`${book.title} (read)`);
      expect(titles(r).length).toBe(listed);
      pick(r, `${book.title} (again)`);
      expect(readOn(r)).toEqual([{ speaker: 'gianna', text: book.secondLook!.text }]);
      expect(titles(r)).toContain(`${book.title} (read)`);
      expect(flags.isSet(lookFlag(id))).toBe(true);
    }
  });
});
