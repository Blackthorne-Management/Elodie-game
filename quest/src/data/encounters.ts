// Random encounters in each capital's wild section (map layer `encounters`, property `table`). Until
// Phase 3 battles exist, a fight is a short scene (engine/game.ts encounterScript): Fight always wins,
// Run always escapes. `foes` name who the battle will field.

import type { EncounterTable } from '../engine/content.ts';

/**
 * Story flags that chapters not built yet will set (owner decision, Oct 14: no fights in Chapter 1;
 * the wild sections turn violent when the story brings the party back). Maps may read them already.
 */
export const LATER_STORY_FLAGS: readonly string[] = [
  /** The party returns to Zetwal later in the story: the Cane Road's ambushes begin. */
  'story.zetwal_return',
];

export const ENCOUNTERS: Readonly<Record<string, EncounterTable>> = {
  // Zetwal: the Cane Road beyond the east gate.
  cane_road: {
    id: 'cane_road',
    groups: [
      {
        id: 'bandits',
        weight: 3,
        foes: ['Road Bandit', 'Road Bandit'],
        intro: 'Two bandits step out of the cane, knives low. "Festival toll, archivist. Everything you carry."',
        won: 'They drop their knives and vanish between the stalks.',
        fled: 'You sprint back down the road. Their laughter follows you.',
      },
      {
        id: 'smugglers',
        weight: 2,
        foes: ['Smuggler', 'Smuggler', 'Lookout'],
        intro: 'Smugglers, hauling Crown-stamped crates through the field. "You saw nothing. Say it."',
        won: 'The smugglers abandon a crate and scatter toward the mangroves.',
        fled: 'You slip away before the lookout can whistle for more.',
      },
      {
        id: 'hushers',
        weight: 1,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures rise from the ditch without a sound. "Hush, little archivist. Where is your sister?"',
        won: 'The veiled pair back away into the cane, still watching you.',
        fled: 'You run. When you look back, the road behind you is empty.',
      },
    ],
  },
};
