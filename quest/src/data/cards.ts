// Full-screen cards shown once when their flag is set.

import type { CardDef } from '../engine/content.ts';

export const CARDS: readonly CardDef[] = [
  {
    id: 'act1_end',
    when: 'act1.complete',
    title: 'To be continued: Xaraguá',
    lines: ['End of Chapter 1: The Festival of the Gaze', 'Thank you for playing.'],
  },
];
