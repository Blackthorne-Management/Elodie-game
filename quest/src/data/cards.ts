// Full-screen cards shown once when their flag is set.

import type { CardDef } from '../engine/content.ts';

export const CARDS: readonly CardDef[] = [
  // The end of Chapter 1: the ferry sails for Xaraguá (travel.next) when the card closes. The demo repository
  // (elodie-game-demo) keeps its own card here: "Thank you for playing the demo!", Chapter 2 on November 22.
  {
    id: 'act1_end',
    when: 'act1.complete',
    title: 'Chapter 1 complete',
    lines: ['The Festival of the Gaze', 'Next: Chapter 2, The Charter', 'The ferry sails for Xaraguá at dawn...'],
  },
];
