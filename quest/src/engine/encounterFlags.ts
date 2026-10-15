// The flags a fight leaves behind, shared by the encounter stand-ins (engine/game.ts), the battles
// (engine/battle.ts) and the menu's Foes page.

/** How often each group was beaten or escaped (`encounter.<table>.<group>.won|fled`). */
export function encounterFlag(table: string, group: string, outcome: 'won' | 'fled'): string {
  return `encounter.${table}.${group}.${outcome}`;
}
