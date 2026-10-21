// Side quests by city (engine/sideQuests.ts runs them; the menu's Quests page lists them).
// Pòdlimyè's three Chapter 1 side quests (owner approved, Oct 14): no fighting, each with its own NPC
// lines in data/dialogue/zetwal.ts. Every step is a flag set by a conversation.

import type { Condition } from '../engine/conditions.ts';
import type { SideQuestDef } from '../engine/sideQuests.ts';

const f = (flag: string): Condition => ({ flag });
const INFLUENCE_ZETWAL = { pillar: 'influence', city: 'zetwal', amount: 1 } as const;
const INFLUENCE_XARAGUA = { pillar: 'influence', city: 'xaragua', amount: 1 } as const;
const PIER_WON = f('encounter.xaragua_story.pier.won');
/** Yucayeque's quests close when the Crown takes the city (review D4): the givers are gone from the maps. */
const CLOSES_AT_ATTACK: Condition = { not: f('story.crown_attack') };
/** Accepted, and the city still free. */
const acceptedFree = (flag: string): Condition => ({ all: [f(flag), CLOSES_AT_ATTACK] });
const SPRINGS_DONE: Condition = { any: [f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] };
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
  // ---- Chapter 2, Yucayeque (side quests build, Oct 20; docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md
  // and its owner decisions). Every one lives in the free city and must be done before the lamp-oil seller lends the
  // cave lamp at dusk (data/quests.ts `dusk`). Each closes when the Crown takes the city: no longer offered, and one
  // left unfinished in an old save drops off the Quests page instead of staying open forever (CLOSES_AT_ATTACK).
  // Listed in the order they lie on the ground; the arrow does the ones on the map the player is on first.
  {
    id: 'nets',
    title: 'Cut Nets',
    giver: 'Fisher',
    place: 'Harbor Village',
    level: 4,
    summary:
      'Last night someone cut three of the village\'s nets where they were drying, "for the harbor\'s safety", the marines said. The fisher from the pier needs them back to mend.',
    accepted: acceptedFree('side.nets.accepted'),
    available: { all: [PIER_WON, CLOSES_AT_ATTACK] },
    start: [{ map: 'xaragua-village', at: { x: 18, y: 20 } }],
    nudge: 'The fisher from the pier keeps looking at his empty drying posts, Gigi. Ask him.',
    parallel: true,
    steps: [
      { text: 'The net by the canoe jetty, on the village shore.', done: f('side.nets.village'), goals: [{ map: 'xaragua-village', at: { x: 12, y: 20 } }] },
      { text: 'The net by the drawn-up canoes on the Canoe Beach.', done: f('side.nets.beach'), goals: [{ map: 'xaragua-beach', at: { x: 6, y: 13 } }] },
      { text: 'The net at the salt pans, on the Canoe Beach.', done: f('side.nets.salt'), goals: [{ map: 'xaragua-beach', at: { x: 28, y: 12 } }] },
      { text: 'Bring all three to the fisher by the pier.', done: f('side.nets.done'), goals: [{ map: 'xaragua-village', at: { x: 18, y: 20 } }] },
    ],
    done: f('side.nets.done'),
    reward: { gold: 70, xp: 25, items: [{ id: 'net_float_charm', n: 1 }], pillar: INFLUENCE_XARAGUA },
  },
  // The hutia's hoard (PUZZLES.md M-XAR-1): the first growth puzzle. A stake driven beside the old ceiba when it was a
  // sapling grows it a low fork, so the hollow can be climbed to.
  {
    id: 'hutia',
    title: "The Hutia's Hoard",
    giver: 'Small girl',
    place: 'Cassava gardens',
    level: 4,
    summary:
      'A hutia took the small girl\'s bead in the cassava gardens. Hutias think shiny things are stars, and this one keeps its stars somewhere.',
    accepted: acceptedFree('side.hutia.accepted'),
    available: { all: [PIER_WON, CLOSES_AT_ATTACK] },
    start: [{ map: 'xaragua-conuco', at: { x: 16, y: 14 } }],
    nudge: 'That little girl in the gardens lost her bead to a hutia. Yari went very quiet when she said it.',
    steps: [
      {
        text: "Follow the hutia's trail of dropped shiny things west across the gardens.",
        done: f('side.hutia.tree'),
        goals: [{ map: 'xaragua-conuco', at: { x: 2, y: 9 } }],
      },
      {
        text: 'The hollow is out of reach. In the memory at the foot of the old ceiba, help the tree.',
        done: f('anchor.hutia_stake'),
        goals: [
          { if: f('echo.hutia_memory'), map: 'xaragua-conuco', at: { x: 2, y: 9 } },
          { map: 'xaragua-conuco', at: { x: 2, y: 10 } },
        ],
      },
      {
        text: 'Back in the present, climb to the hollow.',
        done: f('side.hutia.hoard'),
        goals: [
          { if: f('echo.hutia_memory'), map: 'xaragua-conuco', at: { x: 2, y: 10 } },
          { map: 'xaragua-conuco', at: { x: 2, y: 9 } },
        ],
      },
      { text: 'Give the small girl her bead.', done: f('side.hutia.done'), goals: [{ map: 'xaragua-conuco', at: { x: 16, y: 14 } }] },
    ],
    done: f('side.hutia.done'),
    reward: { gold: 80, xp: 25, items: [{ id: 'brass_button_charm', n: 1 }], pillar: INFLUENCE_XARAGUA },
  },
  // Offered with the lamp (owner decision, Oct 19: the lamp waits for dusk); it ends at the hill camp, so one climb
  // does it and the healer's bark together (review D2). Rael's sixth clue: the ash thumbprint on the camp's post.
  {
    id: 'oil',
    title: 'Oil From a Stranger',
    giver: 'Lamp-oil seller',
    place: 'Harbor Village',
    level: 5,
    summary:
      'Two jars of the oil that comes by canoe after dark are due at the hill camp up the Mountain Path. The marines follow the lamp-oil seller now. Nobody stops the envoy\'s daughter.',
    accepted: acceptedFree('side.oil.accepted'),
    available: { all: [f('story.thorne_met'), CLOSES_AT_ATTACK] },
    start: [{ map: 'xaragua-village', at: { x: 23, y: 10 } }],
    nudge: 'The lamp-oil seller has jars to send up the mountain, and the marines follow her now. She could use the envoy\'s daughter.',
    steps: [
      { text: 'Carry the two jars up the Mountain Path to the leader of the hill camp.', done: f('side.oil.delivered'), goals: [{ map: 'xaragua-camp', at: { x: 15, y: 11 } }] },
      { text: 'Look at the mark the leader showed you, on the post by the fire.', done: f('side.oil.done'), goals: [{ map: 'xaragua-camp', at: { x: 17, y: 10 } }] },
    ],
    done: f('side.oil.done'),
    reward: { gold: 80, xp: 25, pillar: INFLUENCE_XARAGUA },
  },
  // The healer's cure (PUZZLES.md M-XAR-2), at the hill camp where Caona's scouts camped (A Healer's Notes). Offered at
  // Anaco's bedside, in the conversation where the story meets him.
  {
    id: 'medicine',
    title: 'Medicine for the Cacique',
    giver: 'Healer',
    place: 'Caney of Anaco',
    level: 5,
    summary:
      'The pond tree\'s bark only holds the cacique\'s fever. The old cure was the bark of a grove above the cave, where Caona\'s scouts camped, and the Crown\'s road crews cut it down years ago.',
    accepted: acceptedFree('side.medicine.accepted'),
    available: { all: [f('story.anaco_met'), CLOSES_AT_ATTACK] },
    start: [{ map: 'xaragua-caney', at: { x: 30, y: 5 } }],
    nudge: 'The healer in the caney wants a bark nobody can find any more. Maybe we can, Gigi.',
    steps: [
      { text: 'Find where the old grove stood, at the hill camp up the Mountain Path.', done: f('side.medicine.stumps'), goals: [{ map: 'xaragua-camp', at: { x: 7, y: 7 } }] },
      {
        text: "In the memory at the camp fire, plant the grove where the road crews will never cut it.",
        done: f('anchor.healer_grove'),
        goals: [
          { if: f('echo.grove_seeds'), map: 'xaragua-camp', at: { x: 12, y: 4 } },
          { if: f('echo.camp_memory'), map: 'xaragua-camp', at: { x: 16, y: 7 } },
          { map: 'xaragua-camp', at: { x: 13, y: 10 } },
        ],
      },
      {
        text: 'Back in the present, cut bark from the grove.',
        done: f('side.medicine.bark'),
        goals: [
          { if: f('echo.camp_memory'), map: 'xaragua-camp', at: { x: 13, y: 10 } },
          { map: 'xaragua-camp', at: { x: 12, y: 4 } },
        ],
      },
      { text: 'Bring the grove bark to the healer in the caney.', done: f('side.medicine.done'), goals: [{ map: 'xaragua-caney', at: { x: 30, y: 5 } }] },
    ],
    done: f('side.medicine.done'),
    reward: { gold: 100, xp: 30, pillar: { pillar: 'influence', city: 'xaragua', amount: 2 } },
  },
  // Yucayeque's debate by the village fire, as a quest (owner request, Oct 19), like Pòdlimyè's "faith": hear the
  // elder and the Gaze pilgrim out, then argue all three rounds (won or lost) or mediate. Required before dusk with
  // the other four (Oct 20); 30 XP like Chapter 1's debate (review D8: the side quests pay 20 to 30 XP each).
  {
    id: 'springs',
    title: 'Owned or Remembered',
    giver: 'Elder of the springs',
    place: 'Harbor Village',
    level: 4,
    summary:
      'By the village fire, an elder of the Roots and Tides argues with a pilgrim of the Gaze from Zetwal: is the land owned, or remembered? Hear them out, then make your own case.',
    accepted: {
      all: [{ any: [f('debate.xaragua_springs.listened'), f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] }, CLOSES_AT_ATTACK],
    },
    available: { all: [PIER_WON, CLOSES_AT_ATTACK] },
    start: [{ map: 'xaragua-village', at: { x: 9, y: 7 } }],
    nudge: 'The elder by the village fire is still arguing with that pilgrim. The Song House would give you an answer.',
    steps: [
      { text: 'Listen to the debate by the village fire.', done: f('debate.xaragua_springs.listened'), goals: [{ map: 'xaragua-village', at: { x: 9, y: 7 } }] },
      {
        text: 'Join the debate and argue all three rounds, or mediate.',
        done: SPRINGS_DONE,
        goals: [{ map: 'xaragua-village', at: { x: 9, y: 7 } }],
      },
    ],
    done: SPRINGS_DONE,
    reward: { xp: 30 },
  },
];

/** Chapter 2's five side quests, all done: the lamp-oil seller lends the lamp at dusk (data/quests.ts `dusk`). */
export const CHAPTER2_QUESTS = ['nets', 'hutia', 'oil', 'medicine', 'springs'] as const;
export const CHAPTER2_QUESTS_DONE: Condition = {
  all: [f('side.nets.done'), f('side.hutia.done'), f('side.oil.done'), f('side.medicine.done'), SPRINGS_DONE],
};
