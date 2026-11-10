// The Nightingale Key's hidden conversations (docs/quest/design/SECRET-ITEMS.md 8, built Nov 10; Claude's calls): one
// member of a Quiet Crown cell in each capital the party walks after the Key is found in Chapter 7, carrying the Key's
// silver sigil (the look starts with `qc_`, data/secrets.ts quietCrownLook). While the party holds the Key, Gianna can
// talk them out of the cell; on the right word they take off the cell's small silver crown and walk off the map, Concord
// rises once (config.ts CELL_CONCORD, paid by engine/ally.ts musterTick) and the Journal keeps a line. A wrong word
// changes nothing: they can be asked again, or never. Where each one stands and when, in one place for the maps
// (tools/maps/*.ts) and the scenes (data/dialogue/quietCells.ts). The scripted route never takes them.

import { CELL_CONCORD } from '../config.ts';
import type { JournalNote } from '../engine/quests.ts';
import type { Dir8 } from '../engine/types.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });

/** The six capitals from the Key on: Kirinoura (7), Agnipur (8), Kingsmere (9), Pòdlimyè (10), Yucayeque (11), Eightgate (12). */
export const CELL_IDS = ['kirinoura', 'agnipur', 'kingsmere', 'podlimye', 'yucayeque', 'eightgate'] as const;
export type CellId = (typeof CELL_IDS)[number];

/** The flag the Key itself sets (data/dialogue/kuroshiQuests.ts, K-4's box). */
export const KEY_HELD = 'item.nightingale_key';
/** Set once, when the person walks out of their cell (the Concord bonus and the Journal line read it). */
export const cellLeft = (id: CellId): string => `cell.${id}.left`;

export interface QuietCell {
  id: CellId;
  /** The capital, for the Journal. */
  city: string;
  map: string;
  /** The NPC (data/npcs.ts); Pòdlimyè's is the hooded stranger already on the plaza since Chapter 1. */
  npc: string;
  at: P;
  facing: Dir8;
  /** Where they stand on the map (a Tiled `if`, with `!cell.<id>.left` added): the chapter's calm hours. */
  when: string;
  /** Where Anissa walks to speak to them (two tiles beside them, so she never stands over anyone). */
  anissa: P;
  /** Where they walk off to, and are gone. */
  exit: P;
  /** The Journal's line once they have left. */
  note: string;
}

export const QUIET_CELLS: Readonly<Record<CellId, QuietCell>> = {
  // The Lantern Quarter at dawn (the Key is found then): the Hall's copyist on the west bank, off into the Library.
  kirinoura: {
    id: 'kirinoura',
    city: 'Kirinoura',
    map: 'kuroshi-quarter',
    npc: 'cell_copyist',
    at: at(8, 13),
    facing: 'down',
    when: 'story.quarter_dawn, !act7.complete',
    anissa: at(10, 13),
    exit: at(5, 10),
    note: 'The Hall\'s copyist set the silver crown down on the stones and went to copy for the Lantern Library, true copies, signed.',
  },
  // The bazaar's head at dawn (the curtain torn, the flame shown): the old temple sweeper, up to the Court.
  agnipur: {
    id: 'agnipur',
    city: 'Agnipur',
    map: 'jwaladesh-bazaar',
    npc: 'cell_sweeper',
    at: at(16, 4),
    facing: 'down',
    when: 'story.dhanraj_beaten, !act8.complete',
    anissa: at(18, 4),
    exit: at(21, 0),
    note: 'The temple sweeper gave Gianna his silver crown ("Melt it for a lamp") and went up to sweep the Court where he can see the flame.',
  },
  // The Market Cross at dawn (the Hushed beaten): the ropemaker, down the heath road to his daughter at the printing barn.
  kingsmere: {
    id: 'kingsmere',
    city: 'Kingsmere',
    map: 'aldermoor-cross',
    npc: 'cell_ropemaker',
    at: at(12, 21),
    facing: 'down',
    when: 'story.hushed_beaten, !act9.complete',
    anissa: at(14, 21),
    exit: at(20, 29),
    note: 'The ropemaker read his daughter\'s name on the purge list, let the rain take his silver crown, and walked out to her at the printing barn.',
  },
  // The plaza during the Muster: the hooded stranger of Chapter 1, up to the Accord Square where the council argues.
  podlimye: {
    id: 'podlimye',
    city: 'Pòdlimyè',
    map: 'zetwal-town',
    npc: 'recruiter_b',
    at: at(24, 9),
    facing: 'left',
    when: '',
    anissa: at(26, 9),
    exit: at(18, 0),
    note: 'The hooded stranger heard Anissa out, put back her hood and veil, and went up to the Accord Square to hear the council argue.',
  },
  // The hill camp on the war's day (before the tide): the casabe baker, down the path with the canoes.
  yucayeque: {
    id: 'yucayeque',
    city: 'Yucayeque',
    map: 'xaragua-camp',
    npc: 'cell_baker',
    at: at(9, 16),
    facing: 'right',
    when: 'story.war_begun, !story.tide_called',
    anissa: at(7, 16),
    exit: at(12, 19),
    note: 'The casabe baker burned her silver crown under her griddle and went down with the canoes, to look in every launch for her brother.',
  },
  // The Concourse the night before the bell: the old chair porter, up the Hall's steps to the Master of the Chairs.
  eightgate: {
    id: 'eightgate',
    city: 'Eightgate',
    map: 'seat-concourse',
    npc: 'cell_porter',
    at: at(16, 12),
    facing: 'down',
    when: 'story.elodie_rooms, !story.bell_claim',
    anissa: at(18, 12),
    exit: at(23, 5),
    note: 'The old chair porter gave up his silver crown and went up the Hall\'s steps to set the chairs, and to stay and listen this time.',
  },
};

/** The Tiled `if` a cell member stands under: the chapter's hours, until they have left. */
export function cellPlacedText(c: QuietCell): string {
  return [c.when, `!${cellLeft(c.id)}`].filter((s) => s !== '').join(', ');
}

/** The Journal's lines, one per person who left a cell. */
export const CELL_NOTES: readonly JournalNote[] = CELL_IDS.map((id) => ({
  id: `cell_${id}`,
  when: cellLeft(id),
  title: `Out of the quiet (${QUIET_CELLS[id].city})`,
  text: `${QUIET_CELLS[id].note} Concord +${CELL_CONCORD}.`,
}));
