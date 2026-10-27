// Z-4 The Seventh Stone (SIDE-QUESTS.md Z-4, SECRET-ITEMS.md 1, PUZZLES.md S-ZET): Chapter 1's secret side quest on
// the Temple island. Seven name stones stand round Mother Solange's plinth in the lamp court, west of the temple; six
// chime when touched, the seventh is blank and dead. In the memory (the first Reading of the Names) six readers say a
// name over six stones, a young scout of Caona's company says her brother's over the seventh, and the stonecutter
// will not cut it; the young Patricio carves a sun into it with the chisel he left (the anchor). Back in the present,
// the stones touched in the reading's order, ending on the seventh, open the drawer under the plinth: Solange's Quill.
// Places and the order live here (the map, the conversations and the tests read them). No fighting.

import type { Pos } from '../engine/types.ts';

const at = (x: number, y: number): Pos => ({ x, y });

/**
 * The seven stones by number, counted sunwise from the plinth's right hand (the mourner says so): down the east side,
 * across the foot, up the west side and along the top, ending on the seventh beside the path to the temple. The
 * seventh is where the Chapter 10 Muster scene has Yari read it (data/muster.ts TEMPLE.seventhStone stands beside it).
 */
export const STONES: Readonly<Record<number, Pos>> = {
  1: at(7, 5),
  2: at(7, 6),
  3: at(5, 6),
  4: at(5, 5),
  5: at(5, 4),
  6: at(6, 4),
  7: at(7, 4),
};

/** Mother Solange's plinth in the middle of the ring; the drawer under it holds the Quill. */
export const PLINTH = at(6, 5);
/** The one open side of the ring, where the plinth is used from. */
export const PLINTH_STEP = at(6, 6);

/** The first reading's order (fixed, so the solution replays): the order the names were first said, the seventh last. */
export const READING_ORDER: readonly number[] = [3, 1, 5, 2, 6, 4, 7];

/** Where a reader stands to say a name over each stone, and the way they face it. */
export const READER_SPOTS: Readonly<Record<number, { at: Pos; facing: 'up' | 'down' | 'left' | 'right' }>> = {
  1: { at: at(8, 5), facing: 'left' },
  2: { at: at(7, 7), facing: 'up' },
  3: { at: at(5, 7), facing: 'up' },
  4: { at: at(4, 5), facing: 'right' },
  5: { at: at(4, 4), facing: 'right' },
  6: { at: at(6, 3), facing: 'down' },
  7: { at: at(8, 4), facing: 'left' },
};

/** In the memory: Mother Solange reads from her list west of the ring; the scout waits east of it. */
export const ECHO_SOLANGE = at(3, 5);
export const ECHO_SCOUT = at(9, 6);
/** The stonecutter stands at the top of the ring with his chisel until the seventh name; then he leaves it. */
export const ECHO_STONECUTTER = at(4, 3);
/** The two ways the readers come and go: the landing from the Chain Bridge, and the path below the temple door. */
export const WEST_WAY = at(2, 9);
export const EAST_WAY = at(14, 8);

/** Where the mourner comes out to listen when the seven ring together. */
export const MOURNER_LISTENS = at(8, 7);

export const ORDINALS: readonly string[] = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];

/** The quest's flags. */
export const Z4 = {
  accepted: 'side.seventh_stone.accepted',
  watched: 'side.seventh_stone.watched',
  /** How far into the order the stones have been touched (0 to 7); a wrong stone sets it back to 0. */
  seq: 'side.seventh_stone.seq',
  /** Wrong stones so far (up to 5): Anissa's second hint at 3, the answer at 5 (SECRET-ITEMS.md: the hints wait). */
  misses: 'side.seventh_stone.misses',
  answered: 'side.seventh_stone.answered',
  done: 'side.seventh_stone.done',
  anchor: 'anchor.seventh_stone',
  /** In the memory only: the chisel in Patricio's hand (wiped on return, as every `echo.` flag). */
  chisel: 'echo.chisel_taken',
} as const;
