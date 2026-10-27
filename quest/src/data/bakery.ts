// Z-5 Bread With No Debt (SIDE-QUESTS.md Z-5; the rebel safehouse, the ash thumbprint's first door; built Oct 27):
// Chapter 1. The guard captain's pencil note in the seized Quiet Crown tract (the Hall's records room) sends Gianna to
// the town guard, who knows two places that give bread for nothing on festival day: the Quiet Crown's recruiters on the
// plaza, who want a name and a small promise, and the back door of the bakery by the harbor, which wants nothing. The
// baker will not say who pays for the flour; on her store room's sacks, a grey thumbprint in ash; in the store room's
// memory the Revolution's quartermaster hands out grain "for anyone who asks. The Marshal's order." No fighting, no
// anchor (a social scene). The map (tools/maps/zetwal-bakery.ts, the town's door in tools/maps/zetwal-town.ts) and the
// conversations (data/dialogue/zetwalQuests.ts) read the places and flags here.

import type { Condition } from '../engine/conditions.ts';
import type { Pos } from '../engine/types.ts';

const at = (x: number, y: number): Pos => ({ x, y });
const f = (flag: string): Condition => ({ flag });

/** The interior (12 x 8): the front room west, the store room east past the half wall, the back door south. */
export const BAKERY = {
  w: 12,
  h: 8,
  /** The back door in the south wall, and where the party stands inside it. */
  door: at(3, 7),
  spawn: at(3, 6),
  /** The baker behind her counter (the counter is x 1 to 2, y 3). */
  baker: at(3, 3),
  /** The bread oven in the north-west corner (2 x 1). */
  oven: at(1, 1),
  /** The half wall between the rooms (x 5, y 1 to 3; open below). */
  wallX: 5,
  /** The flour sacks along the store room's north wall (4 x 1). */
  sacks: at(6, 1),
  /** The store room's floor: the Echo zone (both eras open; nobody stands in it). */
  zone: { x: 6, y: 3, w: 3, h: 2 },
  /** Fifty years ago: the quartermaster by the sacks, and the woman who comes in at the back door for grain. */
  quartermaster: at(10, 2),
  woman: at(9, 2),
} as const;

/** The town's side: the bakery's back door in the house by the harbor (the south row of the plaza's houses). */
export const BAKERY_TOWN_DOOR = at(14, 21);

/** The quest's flags. */
export const Z5 = {
  accepted: 'side.no_debt.accepted',
  /** The Quiet Crown's recruiters asked for a name and a small promise, and were told no. */
  table: 'side.no_debt.table',
  /** The baker gave bread and asked nothing (and would not say who pays for the flour). */
  bakery: 'side.no_debt.bakery',
  /** The grey thumbprint on the sacks. */
  thumbprint: 'side.no_debt.thumbprint',
  /** The quartermaster's order heard in the store room's memory (kept: the conversation sets it, not the memory). */
  order: 'side.no_debt.order',
  done: 'side.no_debt.done',
  /** The guard captain's tract, read in the Hall's records room (books.ts zetwal_quiet_tract). */
  tract: 'lore.zetwal_quiet_tract',
} as const;

/**
 * Chapter 1's own errands done (data/quests.ts `errands`, the step the gold arrow follows through the side quests): Z-5
 * opens after it, so it is never on the arrow's way, and closes when Yari sails (Claude's call).
 */
export const ERRANDS_DONE: Condition = {
  all: [f('side.overdue.done'), f('side.soup.done'), f('side.cane_name.done'), { any: [f('debate.zetwal_corner.joined'), f('debate.zetwal_corner.mediated')] }],
};
export const NO_DEBT_OPEN: Condition = { all: [ERRANDS_DONE, f(Z5.tract), { notFlag: 'act1.complete' }] };
