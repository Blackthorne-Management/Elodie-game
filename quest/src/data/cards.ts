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
  // The end of Chapter 3: the strand camp; the trader sails for Al-Doria at first light.
  {
    id: 'act3_end',
    when: 'act3.complete',
    title: 'Chapter 3 complete',
    lines: ['The Trial of Blades', 'Next: Chapter 4, The Ledger', 'Al-Doria, and a page that should not exist...'],
  },
  // The end of Chapter 4: the caravan gate at first light; the Dorini caravan sets out for Eightgate.
  {
    id: 'act4_end',
    when: 'act4.complete',
    title: 'Chapter 4 complete',
    lines: ['The Ledger', 'Next: Chapter 5, The Parley', 'Eightgate, and a seal only the Throne may break...'],
  },
  // The end of Chapter 5: the Iron Gate opens on the winter road east (Skarragol first: owner decision, Oct 20).
  {
    id: 'act5_end',
    when: 'act5.complete',
    title: 'Chapter 5 complete',
    lines: ['The Parley', 'Next: Chapter 6, The Stolen Standard', 'Skarragol, and a herd that will not stay stolen...'],
  },
  // Chapter 6: round the fjord's head on Grimvald's horses, to the fair at dawn (the chapter's only card mid-way).
  {
    id: 'round_fjord',
    when: 'story.standard_home',
    title: "Round the fjord's head",
    lines: ["On the thief's own horses, by the shore path round the fjord's head.", 'The standard across Bayarmaa\'s saddle.', 'At first light, the fair\'s fires, and the horn.'],
  },
  // The end of Chapter 6: the longship south along the coast, to Kuroshi (the roads in their fixed order).
  {
    id: 'act6_end',
    when: 'act6.complete',
    title: 'Chapter 6 complete',
    lines: ['The Stolen Standard', 'Next: Chapter 7, The Fog Files', 'Kuroshi, and a city that knows what you said before you say it...'],
  },
];
