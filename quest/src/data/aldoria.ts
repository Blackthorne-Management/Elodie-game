// Bab al-Dhahab, Al-Doria (Chapter 4, The Ledger): the places and conditions of the three side quests built Oct 27 for
// the Nov 22 release (the owner, Oct 27; docs/quest/design/SIDE-QUESTS.md A-2, A-4 and A-5, SECRET-ITEMS.md 2): The
// Missing Saffron, The Uncashed Note (secret: the Sakk of Yusuf) and Invoice for the Crown. The maps (tools/maps/aldoria.ts)
// and the scenes (data/dialogue/aldoriaQuests.ts) read them from here.

import type { Condition } from '../engine/conditions.ts';

type P = { readonly x: number; readonly y: number };
const at = (x: number, y: number): P => ({ x, y });
const f = (flag: string): Condition => ({ flag });

/** Dusk in the bazaar (Samira's three things done) until the caravan's first light: the night of the vault. */
export const VAULT_NIGHT: Condition = {
  all: [f('side.appraise.done'), f('side.sweet_water.done'), f('debate.aldoria_bargain.settled'), { notFlag: 'story.caravan_dawn' }],
};

// ---- A-2 The Missing Saffron ---------------------------------------------------------------------------------------

/** The Desert Edge: the camel tracks off the caravan road, south-east into the dunes, and the raiders' camp. */
export const SAFFRON = {
  merchant: at(2, 8),
  tracks: [at(22, 15), at(28, 18), at(32, 20)],
  /** The raiders' camp in the far dunes: two raiders in front, the nephew and his three camels behind. */
  raiders: [at(37, 21), at(39, 20)],
  nephew: at(40, 22),
  camels: at(41, 21),
  /** Where Gianna stands to speak to them. */
  front: at(37, 22),
} as const;

export const SAFFRON_FLAGS = {
  accepted: 'side.saffron.accepted',
  asked: 'side.saffron.asked',
  tracks: 'side.saffron.tracks',
  freed: 'side.saffron.freed',
  /** Freed by the blade (the raiders fought) or by the purse (paid off). */
  fought: 'side.saffron.fought',
  done: 'side.saffron.done',
} as const;

// ---- A-4 The Uncashed Note (S-ALD: a trade chain across eras) ---------------------------------------------------------

/**
 * The moneychangers' row in the Grand Bazaar: the old moneychanger (the giver), the price board, and the Echo zone in
 * front of the row: the war-time bazaar, the week the Accord was sealed, with young Yusuf at his counting table and four
 * stalls, each short of one thing. Box 7 itself is in the guild vault's strongroom (tools/maps/aldoria.ts).
 */
export const SAKK = {
  moneychanger: at(4, 22),
  board: at(1, 23),
  zone: { x: 3, y: 23, w: 6, h: 2 },
  yusuf: at(4, 22),
  /** Yusuf's new box seven, behind his table (the anchor), used from the row in front of it. */
  box: at(5, 21),
  /** The four stalls fifty years ago, west to east: dates, salt, the Brasador camp's peppers, the Zetwal dyer's indigo. */
  dates: at(2, 22),
  salt: at(6, 22),
  peppers: at(8, 22),
  indigo: at(10, 22),
} as const;

/** The chain: coins for dates, dates for salt, salt for peppers, peppers for the indigo bolt. */
export const GOODS = ['coins', 'dates', 'salt', 'peppers', 'indigo'] as const;
export type Good = (typeof GOODS)[number];

export const SAKK_FLAGS = {
  accepted: 'side.uncashed.accepted',
  /** What Patricio carries in the memory (wiped on return, as every `echo.` flag): unset means his soldier's pay. */
  goods: 'echo.goods',
  /** What he left with Yusuf (kept): the anchor is the box sealed. */
  deposit: 'side.uncashed.deposit',
  anchor: 'anchor.sakk_sealed',
  /** The indigo is the deposit (the step done: it is never amended away). */
  indigo: 'side.uncashed.indigo',
  /** The small sakk paid out for a wrong deposit (once). */
  small: 'side.uncashed.small',
  done: 'side.uncashed.done',
} as const;

// ---- A-5 Invoice for the Crown -------------------------------------------------------------------------------------

/** The quay at night: the Crown's trade factor at the merchantman's gangway, his guards from the ship. */
export const INVOICE = {
  factor: at(23, 14),
  front: at(23, 13),
  gangway: at(22, 15),
} as const;

export const INVOICE_FLAGS = {
  accepted: 'side.invoice.accepted',
  fear: 'side.invoice.fear',
  influence: 'side.invoice.influence',
  done: 'side.invoice.done',
} as const;
