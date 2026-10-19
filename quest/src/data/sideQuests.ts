// Side quests by city (engine/sideQuests.ts runs them; the menu's Quests page lists them).
// Pòdlimyè's three Chapter 1 side quests (owner approved, Oct 14): no fighting, each with its own NPC
// lines in data/dialogue/zetwal.ts. Every step is a flag set by a conversation.

import type { Condition } from '../engine/conditions.ts';
import type { SideQuestDef } from '../engine/sideQuests.ts';

const f = (flag: string): Condition => ({ flag });
const INFLUENCE_ZETWAL = { pillar: 'influence', city: 'zetwal', amount: 1 } as const;
/** The cane cutter waits at the name stones from the lamp until Chapter 1 ends (decision A, Oct 19). */
const CUTTER_AT_STONES: Condition = { all: [f('story.anissa_woke'), { notFlag: 'story.zetwal_return' }] };

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
    // The archive is in the temple's north-west corner, on the island past the Chain Bridge.
    available: f('story.bridge_crossed'),
    start: [{ map: 'zetwal-archive', at: { x: 14, y: 4 } }],
    nudge: "Gigi, shouldn't you check in at the temple archive before we leave? It's through the door at the back of the temple.",
    parallel: true,
    steps: [
      { text: 'Get "Tides of the Southern Reach" back from the ferryman (the docks).', done: f('side.overdue.ferry'), goals: [{ map: 'zetwal-town', at: { x: 9, y: 23 } }] },
      { text: 'Get "Ninety Ways With Pumpkin" back from the soup vendor (the plaza).', done: f('side.overdue.soup'), goals: [{ map: 'zetwal-town', at: { x: 11, y: 12 } }] },
      { text: 'Get "Ash Wars Gossip, Volume Two" back from Grandmother (the Limyè house).', done: f('side.overdue.vol2'), goals: [{ map: 'zetwal-house', at: { x: 12, y: 4 } }] },
      { text: 'Bring all three back to the senior archivist.', done: f('side.overdue.done'), goals: [{ map: 'zetwal-archive', at: { x: 14, y: 4 } }] },
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
    available: f('story.warroom_echo'),
    start: [{ map: 'zetwal-town', at: { x: 11, y: 12 } }],
    nudge: 'The soup vendor on the plaza looks worried, Gigi. Maybe she needs a hand with something?',
    parallel: true,
    steps: [
      { text: 'A bowl for the old neighbor (west of the plaza).', done: f('side.soup.elder'), goals: [{ map: 'zetwal-town', at: { x: 4, y: 11 } }] },
      { text: 'A bowl for the town guard (the plaza).', done: f('side.soup.guard'), goals: [{ map: 'zetwal-town', at: { x: 22, y: 10 } }] },
      { text: 'A bowl for the ferryman (the docks).', done: f('side.soup.ferry'), goals: [{ map: 'zetwal-town', at: { x: 9, y: 23 } }] },
      { text: 'Tell the soup vendor.', done: f('side.soup.done'), goals: [{ map: 'zetwal-town', at: { x: 11, y: 12 } }] },
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
      'The cane cutter\'s grandmother cut cane on the Cane Road when it was the Crown\'s. He only knew her as "Grann", and her name is on no stone.',
    accepted: f('side.cane_name.accepted'),
    available: f('story.warroom_echo'),
    // Where he stands (decision A, Oct 19): on the Cane Road, at the name stones on the Temple island from the
    // lamp until Chapter 1 ends, and on the road again when Gianna comes home (zetwal-road.ts, zetwal-temple.ts).
    start: [
      { if: CUTTER_AT_STONES, map: 'zetwal-temple', at: { x: 8, y: 4 } },
      { map: 'zetwal-road', at: { x: 6, y: 10 } },
    ],
    nudge: 'There was a cane cutter on the road past the east gate. He looked like he wanted to ask us something.',
    moved: [
      {
        if: CUTTER_AT_STONES,
        place: 'The Temple island',
        nudge: 'That cane cutter from the road is at the name stones, Gigi. He crossed over to hear the names. He looks lost.',
      },
    ],
    steps: [
      { text: 'Look for her on the name stones (the Temple island).', done: f('side.cane_name.stones'), goals: [{ map: 'zetwal-temple', at: { x: 6, y: 4 } }] },
      { text: 'Find where the road remembers her: the shimmer by the east gate, on the Cane Road.', done: f('clue.cane_name'), goals: [{ map: 'zetwal-road', at: { x: 3, y: 14 } }] },
      { text: "Write her name in Mother Solange's list (the Temple Archive).", done: f('side.cane_name.recorded'), goals: [{ map: 'zetwal-archive', at: { x: 9, y: 7 } }] },
      {
        text: 'Tell the cane cutter.',
        done: f('side.cane_name.done'),
        goals: [
          { if: CUTTER_AT_STONES, map: 'zetwal-temple', at: { x: 8, y: 4 } },
          { map: 'zetwal-road', at: { x: 6, y: 10 } },
        ],
      },
    ],
    done: f('side.cane_name.done'),
    reward: { xp: 50, items: [{ id: 'sun_charm', n: 1 }], pillar: INFLUENCE_ZETWAL },
  },
  // Taking part in the plaza's debate on faith (owner decision, Oct 18): a quest that must be done before Yari
  // sails. Listening, then arguing all three rounds (won or lost), or mediating, finishes it (data/debates.ts).
  {
    id: 'faith',
    title: 'A Question of Faith',
    giver: 'Gaze keeper',
    place: 'Festival Plaza',
    level: 1,
    summary:
      'On the lawn below the plaza, a Gaze keeper and a hooded recruiter argue: is a goddess who only remembers any use? Hear them out, then make your own case.',
    accepted: { any: [f('debate.zetwal_corner.listened'), f('debate.zetwal_corner.joined'), f('debate.zetwal_corner.mediated')] },
    available: f('story.warroom_echo'),
    start: [{ map: 'zetwal-town', at: { x: 22, y: 17 } }],
    nudge: 'The Gaze keeper is still arguing with that hooded man below the plaza, Gigi. Will you speak for her before we go?',
    steps: [
      { text: 'Listen to the debate on the lawn below the plaza.', done: f('debate.zetwal_corner.listened'), goals: [{ map: 'zetwal-town', at: { x: 22, y: 17 } }] },
      {
        text: 'Join the debate and argue all three rounds, or mediate.',
        done: { any: [f('debate.zetwal_corner.joined'), f('debate.zetwal_corner.mediated')] },
        goals: [{ map: 'zetwal-town', at: { x: 22, y: 17 } }],
      },
    ],
    done: { any: [f('debate.zetwal_corner.joined'), f('debate.zetwal_corner.mediated')] },
    reward: { xp: 30 },
  },
];
