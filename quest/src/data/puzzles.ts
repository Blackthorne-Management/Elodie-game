// Every puzzle (guide 6.2): where it starts, the story flags that are true when the player reaches
// it, and what counts as solved. Each has puzzles/<id>/solution.json (inputs that solve it from a
// fresh save) and puzzles/<id>/cheats.json (input lists that must NOT solve it); tests replay both.

import type { Condition } from '../engine/conditions.ts';
import type { FlagSnapshot } from '../engine/flags.ts';

export interface PuzzleDef {
  id: string;
  title: string;
  map: string;
  spawn: string;
  /** Flags already set when the player reaches the puzzle. */
  flags: FlagSnapshot;
  goal: Condition;
}

const BEFORE_LOCKET: FlagSnapshot = {
  'party.anissa': true,
  'story.festival_intro': true,
  'story.heard_speech': true,
  'story.elodie_left': true,
  'story.house_entered': true,
};

export const PUZZLES: readonly PuzzleDef[] = [
  {
    id: 'warroom_orders',
    title: "The Marshal's night orders (tutorial: Echo and anchors)",
    map: 'zetwal-house',
    spawn: 'study',
    flags: { ...BEFORE_LOCKET, 'item.sun_locket': true },
    goal: { flag: 'clue.night_orders' },
  },
  {
    id: 'zetwal_bridge',
    title: 'The Chain Bridge to the Temple island (signature puzzle: bridge)',
    map: 'zetwal-town',
    spawn: 'bridgehead',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.warroom_intro': true,
      'story.warroom_echo': true,
      'story.warroom_returned': true,
      'anchor.night_orders': true,
      'clue.night_orders': true,
    },
    goal: { flag: 'story.bridge_crossed' },
  },
];
