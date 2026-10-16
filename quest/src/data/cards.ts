// Full-screen cards shown once when their flag is set.

import type { CardDef } from '../engine/content.ts';

export const CARDS: readonly CardDef[] = [
  // Sailing for Xaraguá with Yari ends the demo (owner request, Oct 16): Chapter 2 arrives with the
  // release on November 22 (docs/quest/SCHEDULE.md).
  {
    id: 'act1_end',
    when: 'act1.complete',
    title: 'Thank you for playing the demo!',
    lines: [
      'End of Chapter 1: The Festival of the Gaze',
      'Chapter 2, Xaraguá, is coming November 22.',
      'Bloodlines: Echoes of Zetwal',
    ],
  },
];
