// Saves across fixes (guide 9.1, Claude's call, Nov 13): what a save made on an earlier build needs to load on this
// one (engine/saveCompat.ts).
//
// - renames: when a fix renames a map, an item or a flag, add `old: 'new'` here (and leave it here), so a save made
//   before the fix keeps that place, that item (in the bag, worn or shown) or that story step.
// - safeSpawns: where each chapter can always be picked up, in story order: the latest one whose `after` flag is set
//   is where a save goes when its map is gone. They are the chapter starts (tools/chapter-starts.ts MARKS;
//   tests/saveCompat.test.ts checks they match src/data/starts/chapters.json).

import type { SaveFallbacks } from '../engine/saveCompat.ts';
import { RPG } from './rpg.ts';

export const SAVE_FALLBACKS: SaveFallbacks = {
  renames: {
    maps: {},
    items: {},
    flags: {},
  },
  safeSpawns: [
    { after: '', map: 'zetwal-town', spawn: 'start' },
    { after: 'act1.complete', map: 'xaragua-village', spawn: 'pier' },
    { after: 'act2.complete', map: 'zetwal-harbor', spawn: 'harbor_return' },
    { after: 'act3.complete', map: 'ardencia-camp', spawn: 'strand' },
    { after: 'act4.complete', map: 'seat-gateyard', spawn: 'gold_gate' },
    { after: 'act5.complete', map: 'skarragol-plateau', spawn: 'seat_road' },
    { after: 'act6.complete', map: 'kuroshi-pier', spawn: 'pier' },
    { after: 'act7.complete', map: 'jwaladesh-harbor', spawn: 'landing' },
    { after: 'act8.complete', map: 'aldermoor-heath', spawn: 'mere_stair' },
    { after: 'act9.complete', map: 'zetwal-harbor', spawn: 'muster_landing' },
    { after: 'act10.complete', map: 'xaragua-beach', spawn: 'landing' },
    { after: 'act11.complete', map: 'seat-concourse', spawn: 'ardencia_gate' },
    { after: 'story.hearing_called', map: 'seat-concourse', spawn: 'hearing_morning' },
  ],
  items: Object.keys(RPG.items),
};
