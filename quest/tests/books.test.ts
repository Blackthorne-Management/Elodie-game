// Lore books and shelves (data/books.ts): length rules from guide 6.6, pages that fit the dialogue
// box, choice lists that fit above it, and reading that marks a book read and returns to the list.

import { describe, expect, it } from 'vitest';
import { BOOKS, MAX_PAGE_CHARS, SHELVES, bookPages, loreFlag, shelfDialogueId, wordCount } from '../src/data/books.ts';
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
