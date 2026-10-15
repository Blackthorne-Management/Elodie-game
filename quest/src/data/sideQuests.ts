// Side quests by city (engine/sideQuests.ts runs them; the menu's Quests page lists them).
// Pòdlimyè's three Chapter 1 side quests (owner approved, Oct 14): no fighting, each with its own NPC
// lines in data/dialogue/zetwal.ts. Every step is a flag set by a conversation.

import type { Condition } from '../engine/conditions.ts';
import type { SideQuestDef } from '../engine/sideQuests.ts';

const f = (flag: string): Condition => ({ flag });
const INFLUENCE_ZETWAL = { pillar: 'influence', city: 'zetwal', amount: 1 } as const;

export const SIDE_QUESTS: readonly SideQuestDef[] = [
  {
    id: 'overdue',
    title: 'The Overdue Shelf',
    giver: 'Senior archivist',
    place: 'Temple Archive',
    level: 2,
    summary:
      'Three books are long overdue, and Gianna wrote the list herself. Get them back from the ferryman, the soup vendor and Grandmother Anicette.',
    accepted: f('side.overdue.accepted'),
    parallel: true,
    steps: [
      { text: 'Get "Tides of the Southern Reach" back from the ferryman (the docks).', done: f('side.overdue.ferry') },
      { text: 'Get "Ninety Ways With Pumpkin" back from the soup vendor (the plaza).', done: f('side.overdue.soup') },
      { text: 'Get "Ash Wars Gossip, Volume Two" back from Grandmother (the Limyè house).', done: f('side.overdue.vol2') },
      { text: 'Bring all three back to the senior archivist.', done: f('side.overdue.done') },
    ],
    done: f('side.overdue.done'),
    reward: { gold: 60, xp: 50, pillar: INFLUENCE_ZETWAL },
  },
  {
    id: 'soup',
    title: 'Soup for the Cousins',
    giver: 'Soup vendor',
    place: 'Festival Plaza',
    level: 1,
    summary:
      "The soup vendor's nephew is asleep under a mango tree. Carry her festival bowls to the old neighbor, the town guard and the ferryman.",
    accepted: f('side.soup.accepted'),
    parallel: true,
    steps: [
      { text: 'A bowl for the old neighbor (west of the plaza).', done: f('side.soup.elder') },
      { text: 'A bowl for the town guard (the plaza).', done: f('side.soup.guard') },
      { text: 'A bowl for the ferryman (the docks).', done: f('side.soup.ferry') },
      { text: 'Tell the soup vendor.', done: f('side.soup.done') },
    ],
    done: f('side.soup.done'),
    reward: { gold: 30, xp: 40, items: [{ id: 'soup_pot', n: 3 }], pillar: INFLUENCE_ZETWAL },
  },
  {
    id: 'cane_name',
    title: 'A Name in the Cane',
    giver: 'Cane cutter',
    place: 'The Cane Road',
    level: 3,
    summary:
      'The cane cutter\'s grandmother cut cane on this road when it was the Crown\'s. He only knew her as "Grann", and her name is on no stone.',
    accepted: f('side.cane_name.accepted'),
    steps: [
      { text: 'Look for her on the name stones (the Temple island).', done: f('side.cane_name.stones') },
      { text: 'Find where the road remembers her: the shimmer by the east gate, on the Cane Road.', done: f('clue.cane_name') },
      { text: "Write her name in Mother Solange's list (the Temple Archive).", done: f('side.cane_name.recorded') },
      { text: 'Tell the cane cutter.', done: f('side.cane_name.done') },
    ],
    done: f('side.cane_name.done'),
    reward: { xp: 50, items: [{ id: 'sun_charm', n: 1 }], pillar: INFLUENCE_ZETWAL },
  },
];
