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
