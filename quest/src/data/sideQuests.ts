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
  // Yucayeque's debate by the village fire, as a quest (owner request, Oct 19), like Pòdlimyè's "faith": hear the
  // elder and the Gaze pilgrim out, then argue all three rounds (won or lost) or mediate. The debate is held only
  // while the city is free (tools/maps/xaragua.ts PEACE); when it must be done by is the Chapter 2 side quests'
  // outline to settle (docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md).
  {
    id: 'springs',
    title: 'Owned or Remembered',
    giver: 'Elder of the springs',
    place: 'Yucayeque',
    level: 4,
    summary:
      'By the village fire, an elder of the Roots and Tides argues with a pilgrim of the Gaze from Zetwal: is the land owned, or remembered? Hear them out, then make your own case.',
    accepted: { any: [f('debate.xaragua_springs.listened'), f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] },
    available: { all: [f('encounter.xaragua_story.pier.won'), { not: f('story.crown_attack') }] },
    start: [{ map: 'xaragua-village', at: { x: 11, y: 7 } }],
    nudge: 'That pilgrim by the fire came from home, Gigi, and says this land is only a deed. Will you answer for the elder?',
    steps: [
      { text: 'Listen to the debate by the village fire.', done: f('debate.xaragua_springs.listened'), goals: [{ map: 'xaragua-village', at: { x: 11, y: 7 } }] },
      {
        text: 'Join the debate and argue all three rounds, or mediate.',
        done: { any: [f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] },
        goals: [{ map: 'xaragua-village', at: { x: 11, y: 7 } }],
      },
    ],
    done: { any: [f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] },
    reward: { xp: 60 },
  },
  // ---- Chapter 3, Cenizal (outline section 7): the two required side quests and the debate --------------
  // The Treasurer's Daughter (Ar-2; puzzle M-ARD-1): the records room, Benny's office in the Echo, the niche behind
  // the tapestry; the steward Zelia opens the room, and at the end takes Gianna to the old lord (FAMILY.md).
  {
    id: 'treasurer',
    title: "The Treasurer's Daughter",
    giver: "The treasurer's daughter",
    place: 'The Alcázar',
    level: 9,
    summary:
      'Her father, the city treasurer, "retired" eleven years ago and never came home. His last ledger should be in the Alcázar\'s records room.',
    accepted: f('side.treasurer.accepted'),
    available: f('story.trial_set'),
    start: [{ map: 'ardencia-alcazar', at: { x: 12, y: 8 } }],
    nudge: 'The young woman at the hall gate has been standing there a long time, Gigi. Ask her.',
    steps: [
      { text: 'Ask the steward to open the records room (the Alcázar).', done: f('side.treasurer.zelia'), goals: [{ map: 'ardencia-alcazar', at: { x: 15, y: 6 } }] },
      { text: 'Look for the last ledger on the treasurers\' shelf.', done: f('side.treasurer.shelf'), goals: [{ map: 'ardencia-alcazar', at: { x: 27, y: 3 } }] },
      { text: 'The air shimmers in the records room. Ask the memory where treasurers hid their copies.', done: f('clue.niche'), goals: [{ map: 'ardencia-alcazar', at: { x: 26, y: 6 } }] },
      { text: 'Back in the present, look behind the tapestry on the east wall.', done: f('clue.treasurer_alive'), goals: [{ map: 'ardencia-alcazar', at: { x: 31, y: 6 } }] },
      { text: "Tell the treasurer's daughter.", done: f('side.treasurer.told'), goals: [{ map: 'ardencia-alcazar', at: { x: 12, y: 8 } }] },
      {
        text: 'The steward has a message for you.',
        done: f('side.treasurer.done'),
        goals: [
          { if: f('side.treasurer.benny_open'), map: 'ardencia-alcazar', at: { x: 4, y: 15 } },
          { map: 'ardencia-alcazar', at: { x: 20, y: 8 } },
        ],
      },
    ],
    done: f('side.treasurer.done'),
    reward: { gold: 100, xp: 90, items: [{ id: 'bennys_refusal', n: 1 }], pillar: { pillar: 'influence', city: 'ardencia', amount: 1 } },
  },
  // The Lower Town's debate, as a required quest (outline 7.3): Is a thief who feeds the hungry a thief?
  {
    id: 'thief',
    title: 'Bread and the Oath',
    giver: "Baker's widow",
    place: 'The Lower Town',
    level: 9,
    summary:
      'By the soup line, a baker\'s widow and a Witness oath-knight argue: is a thief who feeds the hungry a thief? Hear them out, then make your case.',
    accepted: { any: [f('debate.ardencia_bread.listened'), f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] },
    available: f('story.trial_set'),
    start: [{ map: 'ardencia-lower', at: { x: 19, y: 13 } }],
    nudge: "They're arguing by the soup line about whether stealing bread is stealing. The old library would give you an answer.",
    steps: [
      { text: 'Listen to the debate in the Lower Town.', done: f('debate.ardencia_bread.listened'), goals: [{ map: 'ardencia-lower', at: { x: 19, y: 13 } }] },
      {
        text: 'Join the debate and argue all three rounds, or mediate.',
        done: { any: [f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] },
        goals: [{ map: 'ardencia-lower', at: { x: 19, y: 13 } }],
      },
    ],
    done: { any: [f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] },
    reward: { xp: 40 },
  },
  // Bread at Night (Ar-1; the rebel safehouse): Azzy's own question. The cook is Amanda, Benny's daughter (FAMILY.md).
  {
    id: 'bread',
    title: 'Bread at Night',
    giver: 'Azzy',
    place: 'The court gate',
    level: 10,
    summary:
      "Azzy: his father's poor are not starving, and he does not know why. There is soup in the Lower Town every day, and no one says who pays.",
    accepted: f('side.bread.accepted'),
    available: { all: [f('side.treasurer.done'), { any: [f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] }] },
    start: [{ map: 'ardencia-town', at: { x: 28, y: 9 } }],
    nudge: "Azzy said his father's poor are not starving and he doesn't know why. He wants to show you tonight.",
    steps: [
      { text: 'Ask the Lower Town\'s cook who pays for the soup.', done: f('side.bread.cook'), goals: [{ map: 'ardencia-lower', at: { x: 12, y: 7 } }] },
      { text: 'Look at the barrels by her kitchen door.', done: f('side.bread.thumb'), goals: [{ map: 'ardencia-lower', at: { x: 14, y: 6 } }] },
      { text: 'Find Azzy at the Lower Town gate, and wait for dark.', done: { any: [f('story.cart_night'), f('side.bread.done')] }, goals: [{ map: 'ardencia-lower', at: { x: 28, y: 11 } }] },
      { text: 'Watch the lane from the corner by the old well.', done: f('side.bread.done'), goals: [{ map: 'ardencia-lower', at: { x: 18, y: 5 } }] },
    ],
    done: f('side.bread.done'),
    reward: { gold: 150, xp: 100, pillar: { pillar: 'influence', city: 'ardencia', amount: 1 } },
  },
];
