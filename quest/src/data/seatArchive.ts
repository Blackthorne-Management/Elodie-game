// The Throne Archive's cabinet (Chapter 5, SIG-SEA; docs/quest/design/PUZZLES.md): seven drawers against the north
// wall. Only the carved numbers are old; the brass plates were put on long after. The map (tools/maps/seat.ts) and
// the scenes (data/dialogue/seat.ts) both read these.

/** The carved numbers on the drawers today, left to right (review 3.4: drawer 4 is sixth, second from the right). */
export const DRAWER_NUMBERS = [6, 2, 7, 5, 1, 4, 3] as const;
/**
 * The brass plates over them, a keeper's tidy order from a century that had forgotten what the drawers were for.
 * Xaraguá was never a signatory, so it has no drawer. Drawer 4 sits under Stillwater's plate (the Crown's own house):
 * Claude's call, review 3.4 (not a house the party visits next).
 */
export const DRAWER_PLATES = ['Kay Soley', 'Brasador', 'Dorini', 'Ironvow', 'Suzumori', 'Stillwater', 'Agnivansh'] as const;
/** The first drawer's x on the Archive map (they run along the north wall at y 1); fifty years ago drawer n stood at x0 + n - 1. */
export const DRAWER_X0 = 10;

/**
 * Se-4 The Unknotted Ribbon (secret; SECRET-ITEMS.md 9, PUZZLES.md S-SEA; built Oct 27): Keeper Hollis offers it after
 * the Parley (the Seventh Clause read aloud, the terms refused); the clerk's five questions in the sealing's memory seal
 * the minute in his register (the anchor); Hollis's hearing at his desk takes the evidence line by line (Thomas's record
 * is Chapter 9's, so it can only be won in Chapter 12, before the bell); the Seventh Ribbon strikes the clause at the
 * Claim. The flags, and where everyone stands on the Archive map.
 */
export const RIBBON = {
  accepted: 'side.ribbon.accepted',
  /** The clerk's minute, sealed in his register fifty years ago (the anchor). */
  anchor: 'anchor.minute_sealed',
  /** Hollis has lifted the minute out of the register in the present (once). */
  minuteSeen: 'side.ribbon.minute_seen',
  /** The register shut on Patricio once (the second hint is Patricio's own; the third comes the next time). */
  shut: 'side.ribbon.shut',
  /** A hearing failed once (Anissa names the evidence the next time). */
  failed: 'side.ribbon.failed',
  /** The sun mark shown at this hearing (it stands for one line, once a hearing). */
  sun: 'side.ribbon.sun',
  done: 'side.ribbon.done',
  item: 'item.seventh_ribbon',
  /** Struck at the Claim, before every house. */
  struck: 'claim.clause_struck',
  /** Hollis on his stool; the tile in front of his desk; the tile below the Accord under glass. */
  hollis: { x: 20, y: 10 },
  desk: { x: 21, y: 10 },
  glass: { x: 14, y: 8 },
  /** Fifty years ago: the register on its side table; the clerk's place at it, and his place at the sealing table. */
  register: { x: 16, y: 7 },
  clerkAt: { x: 16, y: 6 },
  clerkHome: { x: 13, y: 6 },
} as const;
