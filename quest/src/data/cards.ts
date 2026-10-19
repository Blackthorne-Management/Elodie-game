// Full-screen cards shown once when their flag is set.

import type { CardDef } from '../engine/content.ts';

export const CARDS: readonly CardDef[] = [
  // The end of Chapter 1: the voyage to Xaraguá begins (travel.next) when the card closes. The demo repository
  // (elodie-game-demo) keeps its own card here: "Thank you for playing the demo!", Chapter 2 on November 22.
  {
    id: 'act1_end',
    when: 'act1.complete',
    title: 'Chapter 1 complete',
    lines: ['The Festival of the Gaze', 'Next: Chapter 2, The Charter', 'Beyond the reef, a Zetwal ship waits to carry them to Xaraguá...'],
  },
  // Chapter 2's midpoint (owner decision, Oct 15): the Crown attacks and the city is occupied.
  {
    id: 'xaragua_falls',
    when: 'story.refuge',
    title: 'The night the Crown came',
    lines: ['Yucayeque is occupied. Cacique Anaco is a prisoner.', 'Yari and Anissa hide in the cave with the resistance.', 'Gianna walks on alone, on her envoy\'s papers.'],
  },
  // The end of Chapter 2: home to Zetwal, and Grandfather's request.
  {
    id: 'act2_end',
    when: 'act2.complete',
    title: 'Chapter 2 complete',
    lines: ['The Charter', 'Next: Chapter 3, The Trial of Blades', 'Ardencia, and an oath fifty years old...'],
  },
];
