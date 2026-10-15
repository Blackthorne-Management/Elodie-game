// Lore books (guide 6.6: every capital has a library, and its capital building has books too). A shelf
// is a puzzle object whose dialogue lists its books; reading one sets `lore.<book id>` (read later by
// Influence, Gianna's spells and the debates' Reason appeal). Each book is 100 to 150 words, cut into
// dialogue pages of at most 128 characters at sentence ends (tests/books.test.ts checks both).
// Story facts follow docs/quest/QUEST-BUILD-GUIDE.md Section 5; the Seventh Clause and Rael's secret
// are only hinted at.

import type { Condition } from '../engine/conditions.ts';
import type { DialogueChoice, DialogueScript, Speaker } from '../engine/dialogue.ts';
import type { ObjectInfo } from '../engine/content.ts';

export type BookCategory = 'history' | 'law' | 'religion' | 'trade' | 'war' | 'gossip' | 'folklore' | 'genealogy';

export interface Book {
  id: string;
  title: string;
  category: BookCategory;
  /** The text; split into pages by `bookPages`. */
  text: string;
  /** On its shelf only once this holds (a book returned by a side quest). */
  available?: Condition;
}

export interface Shelf {
  /** The puzzle object id on the map. */
  id: string;
  /** The name label shown when facing it. */
  name: string;
  books: readonly string[];
}

export const MAX_PAGE_CHARS = 128;

export const BOOKS: readonly Book[] = [
  // ---- Zetwal: the Temple Archive ----------------------------------------------------------------
  {
    id: 'zetwal_founding',
    title: 'The Founding of Zetwal',
    category: 'history',
    text:
      'Before the Accord, before the Marshal, the island belonged to the Aldermoor Crown, and so did the people who cut its cane. ' +
      'Crown law called them property. The temple called them names, and wrote every one of them down. ' +
      'Mother Solange Jean-Philippe kept that list. She was a high priestess with a sun mark at her temple, and she taught that the goddess Elodie remembers what kings forget. ' +
      'When the Crown burned the first archive, Solange rebuilt it here, across the chasm. Soldiers would have to cross a bridge to reach it. ' +
      'She did not live to see the island free. Her line did. The list is still here, on the lowest shelf, in her hand.',
  },
  {
    id: 'zetwal_alliance_war',
    title: 'The Alliance War',
    category: 'war',
    text:
      'Fifty years ago Zetwal rose, and the Crown expected to crush it in a season. It did not count on allies. ' +
      'Marshal Patricio Jean-Philippe commanded the joint armies. Lord Benny of Ardencia brought House Brasador across the sea, and no one has ever fully explained why. ' +
      "Caona of Xaraguá led the scouts who found every Crown road. Lady Sayo Suzumori's whisperers sent word of each troop movement before the troops moved. " +
      'On the last night the Marshal and Lord Benny sealed their alliance with a token in two halves. A sun locket for Zetwal, a signet for Ardencia. ' +
      'The next morning the Sun Accord was signed in the plaza, and the Crown sailed home.',
  },
  {
    id: 'zetwal_ash_wars_temple',
    title: 'Ash Wars: A Temple Record',
    category: 'history',
    text:
      'Twenty-five years ago Crown raiders and rival lords burned the highland roads. Lord Rael of Ardencia marched his grand army against them. ' +
      'The songs call him Rael the Ruthless. This archive sent healers with every column, as the Gaze requires, and they wrote what they saw. ' +
      'At the ford of Cendre, the Crown chronicle counts four hundred prisoners put to the sword. Our healers counted forty dead, all fallen in the fighting, and three hundred prisoners sent home. ' +
      'The chronicle was written in Aldermoor. Our record was written at the ford. ' +
      'The keeper of that year added one line in the margin: "Someone wants him feared. I do not know if it is the Crown, or him."',
  },
  {
    id: 'zetwal_gaze_primer',
    title: 'The Gaze of Elodie',
    category: 'religion',
    text:
      'The goddess Elodie wove the realm, and she remembers every thread of it. She does not rule. She does not punish. She sees. ' +
      'That is the whole of the faith, and it is harder than it sounds. A ruler who knows she is seen must answer for what she does, even when no court will make her. ' +
      'So the faithful keep libraries, because memory is the goddess at work. They remember their dead aloud. ' +
      'Some children are born with a faint sun mark on the temple or the cheek. The old families say it shows the goddess looked twice. ' +
      'Kay Soley heirs carry it. The archivists are taught never to treat it as a crown.',
  },
  {
    id: 'zetwal_blessed_seat',
    title: 'The Blessed Seat',
    category: 'religion',
    text:
      'Before there were houses, there was the Gaze. Ours is the oldest faith in the realm, and no scholar of any house disputes it. ' +
      'When the first heirs came to the old seat where the eight roads meet, the temples teach that Elodie came with them. ' +
      'She did not sit. She does not rule. She blessed the seat, and set her sun on the brow of those who would keep it honest. ' +
      'That is why the faithful still call the city Elodie\'s Seat, whatever the maps say. The sun mark is her sign. ' +
      'The kings of Aldermoor have struck this page from their copies three times. Each time, this archive copied it again. ' +
      'A margin note in a careful hand: "Ask the Crown why it fears a story it calls false."',
  },
  {
    id: 'zetwal_say_their_names',
    title: 'Why We Say Their Names',
    category: 'religion',
    text:
      'At the Festival of the Gaze, the people of Zetwal stand in the plaza and say the names of their dead aloud. One family after another, until the sun sets. ' +
      'Visitors find it long. The faithful find it short. ' +
      'The custom began in the years of the Crown. The dead were buried without stones, and their names were struck from the ledgers. ' +
      'Saying a name aloud was a small rebellion. If the goddess remembers, and the people remember, no ledger can make a person vanish. ' +
      'The name stones on the temple island were cut after the war. Every one of them was carved from a name someone refused to forget.',
  },
  {
    id: 'zetwal_four_hands',
    title: 'The Four Hands',
    category: 'religion',
    text:
      'The people of Xaraguá keep a different faith, and this archive keeps their account of it with respect. ' +
      'They hold that land, water, wind and fire are four living hands, and that no one owns what a hand holds. ' +
      'Offerings are left at springs, groves, mountain passes and hearth flames. The areito, their dance of memory, carries history from the old to the young. ' +
      'In Xaraguá the Roots and Tides keep the earth and the sea. Far away, the Sky-Riders of Skarragol and the Flame Keepers of Jwaladesh honor the other hands. ' +
      'Their elders ask one question of every treaty: who gave you the right to sell what the hands were holding?',
  },
  {
    id: 'zetwal_bridge_tale',
    title: 'The Bridge With Two Ends',
    category: 'folklore',
    text:
      'Children on the plaza tell it this way. On the night before the Accord, the temple island was cut off: the Crown had raised the Chain Bridge and broken its winch. ' +
      'A young soldier lowered it by hand, alone, and drove an iron pin through the pawl so it could never rise again. Then he walked away and nobody saw his face. ' +
      'Some say it was the Marshal. Some say it was a ghost from a time that had not happened yet. ' +
      'The old ferryman says only that the pin was too clean, as if someone had polished it fifty years before it was needed. ' +
      'Archivists are asked to record the story and not to argue with it.',
  },
  {
    id: 'zetwal_hutia_lamp',
    title: 'The Hutia and the Lamp',
    category: 'folklore',
    text:
      'A fable told on both shores. A hutia, the round-eared little thief of the islands, wanted the brightest thing in the world. ' +
      'It stole a coin, a shell, a fish scale and a star reflected in a puddle. None of them was bright enough. ' +
      'At last it crept into the temple and tried to steal the light of the Gaze Lamp itself. ' +
      'The light would not be carried. It only grew brighter the closer the hutia came. At last the little thief sat down in the glow and forgot what it had come to take. ' +
      'The keepers say the lamp still lights itself for anyone who sits close enough and wants nothing from it.',
  },
  {
    id: 'zetwal_overdue',
    title: 'Archive Ledger: Overdue',
    category: 'gossip',
    text:
      'Junior archivist G. Limyè, notes for the keeper. Overdue books, in order of shame. ' +
      'The ferryman: "Tides of the Southern Reach." Six months. He says the sea has it now. ' +
      'The soup vendor: "Ninety Ways With Pumpkin." Returned with soup on page forty. Fined in soup. ' +
      'Grandmother Anicette: "Ash Wars Gossip, Volume Two." Overdue three years. ' +
      'Do not ask her for it. When I asked, she asked me why I wanted to know about the Lord of Ardencia, and then she changed the subject to my posture. ' +
      'Volume One is missing from the shelf as well. Nobody has signed it out.',
  },
  {
    // Returned by the side quest The Overdue Shelf: one of the four Ash Wars accounts (Anicette's).
    id: 'zetwal_ash_wars_anicette',
    title: 'Ash Wars Gossip, Volume Two',
    category: 'gossip',
    available: { flag: 'side.overdue.done' },
    text:
      'A gossip\'s history of the Ash Wars, printed in Aldermoor, full of Lord Rael\'s cruelties. Every margin is filled in Grandmother Anicette\'s hand. ' +
      'Beside the burning at Cendre: "Forty, not four hundred. The healers counted. Gossips do not." ' +
      'Beside the tale of Rael hanging his captains: "One captain. For selling the grain meant for the hungry. Nobody prints that part." ' +
      'Beside a woodcut of Rael with horns: "Better looking than this. Sadder, too." ' +
      'On the last page, a longer note. "Patricio met him once, after the war. He came home and said the man wears his name like armour. ' +
      'He did not know what Rael keeps under it. Neither do I. ' +
      'Elodie came home from the highlands that spring and would not speak of it at all."',
  },

  // ---- Zetwal: the Hall of the Accord (the seat of the Zetwal state) -----------------------------
  {
    id: 'zetwal_sun_accord',
    title: 'The Sun Accord (copy)',
    category: 'law',
    text:
      'A fair copy of the Sun Accord, kept for any citizen who asks. ' +
      'One: Zetwal is free, and no crown shall rule it. Two: Ardencia, Xaraguá and the allied houses are its friends in peace as in war. ' +
      'Three: the Crown withdraws every soldier within one season. Four: prisoners return home on both sides. ' +
      'Five: trade through Zetwal pays no tribute to Aldermoor. Six: the Throne at Elodie\'s Seat shall hear any house that claims a breach. ' +
      'The clerk who copied it left a note under the last line. The signed original is bound with seven silk ribbons, one for each clause. ' +
      'He could only find six clauses to copy.',
  },
  {
    id: 'zetwal_crown_chronicle',
    title: 'The Throne: A Crown Chronicle',
    category: 'law',
    text:
      'Copied from the Aldermoor chronicles for the Hall of the Accord, by order of the Regent\'s office. ' +
      'The Throne at Eightgate was raised by the first kings, in stone and timber, with the consent of the houses. ' +
      'Eight roads were cut to its eight gates, so that no house could say it was kept out. ' +
      'No goddess attended. The chronicles of that year record the weather, the wages and the price of stone, and nothing else. ' +
      'Certain temples teach that Elodie blessed the seat and marked its heirs with her sun. This is a pious tale. ' +
      'To repeat it as law sets one faith above the consent of all, and that is close to sedition. ' +
      'Below, someone has scratched: "Then why burn the archive that kept the older record?"',
  },
  {
    id: 'zetwal_eight_houses',
    title: 'The Eight Houses',
    category: 'genealogy',
    text:
      'Eight houses hold the lands of the realm. Kay Soley in Zetwal, keepers of the sun. Brasador in Ardencia, the highland lords. ' +
      'Yaguana in Xaraguá, the people of the coast and the cacique line. Dorini in Al-Doria, the merchant ledger-keepers. ' +
      'Ironvow in Skarragol, the riders of the steppe. Suzumori in Kuroshi, the fog city of whispers. Agnivansh in Jwaladesh, the flame-sworn. ' +
      'And Stillwater in Aldermoor, the house of the Crown. ' +
      'The Throne stands at Elodie\'s Seat. By old law, any family that has headed a state may claim it. That is why the old families marry carefully, and some of them in secret.',
  },
  {
    id: 'zetwal_harbor_tolls',
    title: 'Harbor Tolls and Roads',
    category: 'trade',
    text:
      'Notes of the harbor master, for merchants arriving in Zetwal. Cane, coffee and indigo leave by the south harbor; salt, iron and cloth come in. ' +
      'Since the Accord, no ship pays tribute to Aldermoor here, and the Crown has never forgiven it. ' +
      'The Carriage Guild under Papa Wout runs carriages and ferries to the other capitals. He knows every road and sells a rumor with every ticket. ' +
      'The Cane Road beyond the east gate has been peaceful since the war. The old cutters still tell stories of bandits in the fields. Lately a few people in grey veils walk it, asking the young if they are lonely. ' +
      'Travel in company. Travel by day.',
  },
  {
    id: 'zetwal_quiet_tract',
    title: 'A Quiet Crown Tract',
    category: 'religion',
    text:
      'Seized in the plaza by the town guard. Kept here as evidence. ' +
      'Are you tired? Tired of drums and shouting, of houses arguing, of a thousand voices and no answer? ' +
      'The realm is sick with noise. The Quiet Crown offers rest: bread for the hungry, help with your debts, a place where no one asks you to shout your grief. ' +
      'We ask only that you listen. One voice instead of a thousand. One hand on the Throne. ' +
      'When the Quiet comes, you will not have to choose anymore. ' +
      'Below, in pencil, the guard captain wrote: "Bread that asks nothing back. Debts paid by strangers. Ask who holds the debt now."',
  },
];

export const SHELVES: readonly Shelf[] = [
  { id: 'archive_history', name: 'Shelf: History and War', books: ['zetwal_founding', 'zetwal_alliance_war', 'zetwal_ash_wars_temple'] },
  { id: 'archive_faith', name: 'Shelf: Faith', books: ['zetwal_gaze_primer', 'zetwal_blessed_seat', 'zetwal_say_their_names', 'zetwal_four_hands'] },
  { id: 'archive_tales', name: 'Shelf: Tales and Notes', books: ['zetwal_bridge_tale', 'zetwal_hutia_lamp', 'zetwal_overdue', 'zetwal_ash_wars_anicette'] },
  { id: 'hall_law', name: 'Shelf: Law and Houses', books: ['zetwal_sun_accord', 'zetwal_crown_chronicle', 'zetwal_eight_houses'] },
  { id: 'hall_records', name: 'Shelf: Harbor Records', books: ['zetwal_harbor_tolls', 'zetwal_quiet_tract'] },
];

const BY_ID: ReadonlyMap<string, Book> = new Map(BOOKS.map((b) => [b.id, b]));

export function loreFlag(bookId: string): string {
  return `lore.${bookId}`;
}

export function shelfDialogueId(shelfId: string): string {
  return `shelf.${shelfId}`;
}

export function bookSpeakerId(bookId: string): string {
  return `book.${bookId}`;
}

/** Words in a text (for the 100 to 150 word rule). */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** The text cut into dialogue pages: whole sentences, packed up to MAX_PAGE_CHARS. */
export function bookPages(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+["']?\s*/g)?.map((s) => s.trim()) ?? [text];
  const pages: string[] = [];
  for (const s of sentences) {
    const last = pages[pages.length - 1];
    if (last !== undefined && last.length + 1 + s.length <= MAX_PAGE_CHARS) pages[pages.length - 1] = `${last} ${s}`;
    else pages.push(s);
  }
  return pages;
}

/**
 * A shelf as a dialogue: the list of its books (an unread title, or the same title marked read), and
 * Leave. Reading a book shows its pages under the book's title, marks it read and returns to the list.
 */
export function shelfScript(shelf: Shelf): DialogueScript {
  const choices: DialogueChoice[] = [];
  const nodes: DialogueScript['nodes'] = {};
  for (const id of shelf.books) {
    const book = BY_ID.get(id);
    if (!book) throw new Error(`Shelf ${shelf.id}: unknown book ${id}`);
    const flag = loreFlag(id);
    const here = (c: Condition): Condition => (book.available ? { all: [book.available, c] } : c);
    choices.push({ text: book.title, if: here({ notFlag: flag }), next: id });
    choices.push({ text: `${book.title} (read)`, if: here({ flag }), next: id });
    nodes[id] = {
      speaker: bookSpeakerId(id),
      set: { [flag]: true },
      lines: bookPages(book.text).map((text) => ({ text })),
      next: 'list',
    };
  }
  choices.push({ text: 'Leave' });
  nodes.list = { lines: [{ text: 'Which book?' }], choices };
  return { id: shelfDialogueId(shelf.id), start: 'list', nodes };
}

export const SHELF_DIALOGUE: Readonly<Record<string, DialogueScript>> = Object.fromEntries(
  SHELVES.map((s) => [shelfDialogueId(s.id), shelfScript(s)]),
);

/** Each book speaks under its own title, with the book portrait. */
export const BOOK_SPEAKERS: Readonly<Record<string, Speaker>> = Object.fromEntries(
  BOOKS.map((b) => [bookSpeakerId(b.id), { id: bookSpeakerId(b.id), name: b.title, portrait: 'book' }]),
);

export const SHELF_OBJECTS: Readonly<Record<string, ObjectInfo>> = Object.fromEntries(SHELVES.map((s) => [s.id, { name: s.name }]));
