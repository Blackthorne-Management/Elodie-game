// Side quests by city (engine/sideQuests.ts runs them; the menu's Quests page lists them).
// Pòdlimyè's three Chapter 1 side quests (owner approved, Oct 14): no fighting, each with its own NPC
// lines in data/dialogue/zetwal.ts. Every step is a flag set by a conversation.

import type { Condition } from '../engine/conditions.ts';
import type { SideQuestDef } from '../engine/sideQuests.ts';

const f = (flag: string): Condition => ({ flag });
const INFLUENCE_ZETWAL = { pillar: 'influence', city: 'zetwal', amount: 1 } as const;
const INFLUENCE_XARAGUA = { pillar: 'influence', city: 'xaragua', amount: 1 } as const;
const PIER_WON = f('encounter.xaragua_story.pier.won');
/**
 * Yucayeque's quests close when the Crown takes the city (review D4; review 1, finding 5: closed, not hidden): the
 * givers are gone from the maps, and one left unfinished shows on the Quests page and in the Journal as closed.
 */
const CLOSED_AT_ATTACK: Condition = f('story.crown_attack');
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
    reward: { gold: 60, xp: 30, pillar: INFLUENCE_ZETWAL },
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
    reward: { gold: 30, xp: 25, items: [{ id: 'soup_pot', n: 3 }], pillar: INFLUENCE_ZETWAL },
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
      { text: 'Find where the road remembers her: the shimmer by the east gate, on the Cane Road.', done: f('clue.cane_name'), goals: [{ map: 'zetwal-road', at: { x: 3, y: 14 } }], echoGoals: [{ map: 'zetwal-road', at: { x: 2, y: 16 } }] },
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
    reward: { xp: 30, items: [{ id: 'sun_charm', n: 1 }], pillar: INFLUENCE_ZETWAL },
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
    reward: { xp: 20 },
  },
  // ---- Chapter 2, Yucayeque (side quests build, Oct 20; docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md
  // and its owner decisions). Every one lives in the free city and must be done before the lamp-oil seller lends the
  // cave lamp at dusk (data/quests.ts `dusk`). Each closes when the Crown takes the city: no longer offered, and one
  // left unfinished in an old save shows as closed, with what became of it, instead of staying open forever.
  // Listed in the order they lie on the ground; the arrow does the ones on the map the player is on first.
  {
    id: 'nets',
    title: 'Cut Nets',
    giver: 'Fisher',
    place: 'Harbor Village',
    level: 4,
    summary:
      'Last night someone cut three of the village\'s nets where they were drying, "for the harbor\'s safety", the marines said. The fisher from the pier needs them back to mend.',
    accepted: f('side.nets.accepted'),
    available: PIER_WON,
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
    closed: CLOSED_AT_ATTACK,
    closedText: 'Closed: the Crown took the beach the night the guns fired. Nobody mends nets under curfew.',
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
    accepted: f('side.hutia.accepted'),
    available: PIER_WON,
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
        // The shimmer at the ceiba's roots; in the memory, the sapling (review 1, finding 2: Echo goals).
        goals: [{ map: 'xaragua-conuco', at: { x: 2, y: 10 } }],
        echoGoals: [{ map: 'xaragua-conuco', at: { x: 2, y: 9 } }],
      },
      {
        text: 'Back in the present, climb to the hollow.',
        done: f('side.hutia.hoard'),
        goals: [{ map: 'xaragua-conuco', at: { x: 2, y: 9 } }],
        echoGoals: [{ map: 'xaragua-conuco', at: { x: 2, y: 10 } }],
      },
      { text: 'Give the small girl her bead.', done: f('side.hutia.done'), goals: [{ map: 'xaragua-conuco', at: { x: 16, y: 14 } }] },
    ],
    done: f('side.hutia.done'),
    closed: CLOSED_AT_ATTACK,
    closedText: 'Closed: the small girl\'s family fled the gardens on the night of the attack. Her bead is still in the hollow.',
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
    accepted: f('side.oil.accepted'),
    available: f('story.thorne_met'),
    start: [{ map: 'xaragua-village', at: { x: 23, y: 10 } }],
    nudge: 'The lamp-oil seller has jars to send up the mountain, and the marines follow her now. She could use the envoy\'s daughter.',
    steps: [
      { text: 'Carry the two jars up the Mountain Path to the leader of the hill camp.', done: f('side.oil.delivered'), goals: [{ map: 'xaragua-camp', at: { x: 15, y: 11 } }] },
      { text: 'Look at the mark the leader showed you, on the post by the fire.', done: f('side.oil.done'), goals: [{ map: 'xaragua-camp', at: { x: 17, y: 10 } }] },
    ],
    done: f('side.oil.done'),
    closed: CLOSED_AT_ATTACK,
    closedText: 'Closed: the jars never reached the hill camp. Its people shelter in the cave now.',
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
    accepted: f('side.medicine.accepted'),
    available: f('story.anaco_met'),
    start: [{ map: 'xaragua-caney', at: { x: 30, y: 5 } }],
    nudge: 'The healer in the caney wants a bark nobody can find any more. Maybe we can, Gigi.',
    steps: [
      { text: 'Find where the old grove stood, at the hill camp up the Mountain Path.', done: f('side.medicine.stumps'), goals: [{ map: 'xaragua-camp', at: { x: 7, y: 7 } }] },
      {
        text: "In the memory at the camp fire, plant the grove where the road crews will never cut it.",
        done: f('anchor.healer_grove'),
        // The shimmer at the fire; in the memory, the scout healer for the seeds, then the place behind the rocks.
        goals: [{ map: 'xaragua-camp', at: { x: 13, y: 10 } }],
        echoGoals: [
          { if: f('echo.grove_seeds'), map: 'xaragua-camp', at: { x: 12, y: 4 } },
          { map: 'xaragua-camp', at: { x: 16, y: 7 } },
        ],
      },
      {
        text: 'Back in the present, cut bark from the grove.',
        done: f('side.medicine.bark'),
        goals: [{ map: 'xaragua-camp', at: { x: 12, y: 4 } }],
        echoGoals: [{ map: 'xaragua-camp', at: { x: 13, y: 10 } }],
      },
      { text: 'Bring the grove bark to the healer in the caney.', done: f('side.medicine.done'), goals: [{ map: 'xaragua-caney', at: { x: 30, y: 5 } }] },
    ],
    done: f('side.medicine.done'),
    closed: CLOSED_AT_ATTACK,
    closedText: 'Closed: the caney is the Governor\'s house now. The healer brews what she can in the cave.',
    reward: { gold: 100, xp: 30, pillar: { pillar: 'influence', city: 'xaragua', amount: 2 } },
  },
  // Yucayeque's debate by the village fire, as a quest (owner request, Oct 19), like Pòdlimyè's "faith": hear the
  // elder and the Gaze pilgrim out, then argue all three rounds (won or lost) or mediate. Required before dusk with
  // the other four (Oct 20); 30 XP (Chapter 1's debate paid 30 too until the levels pass, Oct 22; review D8: the side quests pay 20 to 30 XP each).
  {
    id: 'springs',
    title: 'Owned or Remembered',
    giver: 'Elder of the springs',
    place: 'Harbor Village',
    level: 4,
    summary:
      'By the village fire, an elder of the Roots and Tides argues with a pilgrim of the Gaze from Zetwal: is the land owned, or remembered? Hear them out, then make your own case.',
    accepted: { any: [f('debate.xaragua_springs.listened'), f('debate.xaragua_springs.joined'), f('debate.xaragua_springs.mediated')] },
    available: PIER_WON,
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
    closed: CLOSED_AT_ATTACK,
    closedText: 'Closed: the fire is out. The pilgrim is gone.',
    reward: { xp: 30 },
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
    start: [{ map: 'ardencia-alcazar', at: { x: 11, y: 8 } }],
    nudge: 'The young woman at the hall gate has been standing there a long time, Gigi. Ask her.',
    steps: [
      { text: 'Ask the steward to open the records room (the Alcázar).', done: f('side.treasurer.zelia'), goals: [{ map: 'ardencia-alcazar', at: { x: 15, y: 5 } }] },
      { text: 'Look for the last ledger on the treasurers\' shelf.', done: f('side.treasurer.shelf'), goals: [{ map: 'ardencia-alcazar', at: { x: 27, y: 2 } }] },
      { text: 'The air shimmers in the records room. Ask the memory where treasurers hid their copies.', done: f('clue.niche'), goals: [{ map: 'ardencia-alcazar', at: { x: 26, y: 6 } }], echoGoals: [{ map: 'ardencia-alcazar', at: { x: 30, y: 6 } }] },
      { text: 'Back in the present, look behind the tapestry on the east wall.', done: f('clue.treasurer_alive'), goals: [{ map: 'ardencia-alcazar', at: { x: 32, y: 6 } }], echoGoals: [{ map: 'ardencia-alcazar', at: { x: 26, y: 6 } }] },
      { text: "Tell the treasurer's daughter.", done: f('side.treasurer.told'), goals: [{ map: 'ardencia-alcazar', at: { x: 11, y: 8 } }] },
      {
        text: 'The steward has a message for you.',
        done: f('side.treasurer.done'),
        goals: [
          { if: f('side.treasurer.benny_open'), map: 'ardencia-alcazar', at: { x: 3, y: 15 } },
          { map: 'ardencia-alcazar', at: { x: 21, y: 8 } },
        ],
      },
    ],
    done: f('side.treasurer.done'),
    reward: { gold: 100, xp: 70, items: [{ id: 'bennys_refusal', n: 1 }], pillar: { pillar: 'influence', city: 'ardencia', amount: 1 } },
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
    start: [{ map: 'ardencia-lower', at: { x: 18, y: 13 } }],
    nudge: "They're arguing by the soup line about whether stealing bread is stealing. The old library would give you an answer.",
    steps: [
      { text: 'Listen to the debate in the Lower Town.', done: f('debate.ardencia_bread.listened'), goals: [{ map: 'ardencia-lower', at: { x: 18, y: 13 } }] },
      {
        text: 'Join the debate and argue all three rounds, or mediate.',
        done: { any: [f('debate.ardencia_bread.joined'), f('debate.ardencia_bread.mediated')] },
        goals: [{ map: 'ardencia-lower', at: { x: 18, y: 13 } }],
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
    start: [{ map: 'ardencia-town', at: { x: 28, y: 8 } }],
    nudge: "Azzy said his father's poor are not starving and he doesn't know why. He wants to show you tonight.",
    steps: [
      { text: 'Ask the Lower Town\'s cook who pays for the soup.', done: f('side.bread.cook'), goals: [{ map: 'ardencia-lower', at: { x: 12, y: 6 } }] },
      { text: 'Look at the barrels by her kitchen door.', done: f('side.bread.thumb'), goals: [{ map: 'ardencia-lower', at: { x: 14, y: 5 } }] },
      { text: 'Find Azzy at the Lower Town gate, and wait for dark.', done: { any: [f('story.cart_night'), f('side.bread.done')] }, goals: [{ map: 'ardencia-lower', at: { x: 29, y: 11 } }] },
      { text: 'Watch the lane from the corner by the old well.', done: f('side.bread.done'), goals: [{ map: 'ardencia-lower', at: { x: 18, y: 5 } }] },
    ],
    done: f('side.bread.done'),
    reward: { gold: 150, xp: 80, pillar: { pillar: 'influence', city: 'ardencia', amount: 1 } },
  },
  // ---- Chapter 4, Bab al-Dhahab (outline section 7, with its review): the two required side quests and the debate --
  // Appraise This (A-1; puzzle M-ALD-1): Samira's bet, three stalls, three fakes. Coralie counts the carpet's knots.
  {
    id: 'appraise',
    title: 'Appraise This',
    giver: 'Samira',
    place: "The moneychangers' row",
    level: 12,
    summary:
      'Samira bets you cannot spot a fake. Three stalls on the row each sell one fake among real goods: coins, carpets, weights. Find all three.',
    accepted: f('side.appraise.accepted'),
    // Samira bets on the Majlis steps (her stall is empty before).
    available: f('story.samira_steps'),
    start: [{ map: 'aldoria-bazaar', at: { x: 11, y: 22 } }],
    nudge: 'Samira bet you can\'t spot a fake, Gigi. She was smiling when she said it. I think she wants you to win.',
    parallel: true,
    steps: [
      { text: 'Find the fake coin at the coin stall.', done: f('side.appraise.coin'), goals: [{ map: 'aldoria-bazaar', at: { x: 15, y: 21 } }] },
      { text: 'Find the fake carpet at the carpet stall.', done: f('side.appraise.carpet'), goals: [{ map: 'aldoria-bazaar', at: { x: 18, y: 21 } }] },
      { text: 'Find the fake weight at the weights stall.', done: f('side.appraise.weights'), goals: [{ map: 'aldoria-bazaar', at: { x: 21, y: 21 } }] },
      { text: 'Tell Samira all three.', done: f('side.appraise.done'), goals: [{ map: 'aldoria-bazaar', at: { x: 11, y: 22 } }] },
    ],
    done: f('side.appraise.done'),
    reward: { gold: 100, xp: 70, pillar: { pillar: 'influence', city: 'al_doria', amount: 1 } },
  },
  // The souk square's debate, as a required quest (outline 7.3): Is a bad bargain still sacred?
  {
    id: 'bargain',
    title: 'A Bad Bargain',
    giver: 'Contract-priest',
    place: 'The souk square',
    level: 12,
    summary:
      'By the dry fountain, a Witness contract-priest and a Gaze merchant argue: is a bad bargain still sacred? Hear them out, then make your case.',
    accepted: { any: [f('debate.aldoria_bargain.listened'), f('debate.aldoria_bargain.settled')] },
    available: f('story.vault_refused'),
    start: [{ map: 'aldoria-bazaar', at: { x: 18, y: 13 } }],
    nudge: 'A priest and a merchant are arguing by the fountain about bad bargains. The ledger house would know.',
    steps: [
      { text: 'Listen to the debate by the dry fountain.', done: f('debate.aldoria_bargain.listened'), goals: [{ map: 'aldoria-bazaar', at: { x: 18, y: 13 } }] },
      { text: 'Join the debate and argue all three rounds, or mediate.', done: f('debate.aldoria_bargain.settled'), goals: [{ map: 'aldoria-bazaar', at: { x: 18, y: 13 } }] },
    ],
    done: f('debate.aldoria_bargain.settled'),
    reward: { xp: 40 },
  },
  // Sweet Water (A-3; the rebel safehouse; puzzle M-ALD-2, the cistern pin): the third ash thumbprint.
  {
    id: 'sweet_water',
    title: 'Sweet Water',
    giver: 'The children at the fountain',
    place: 'The souk square',
    level: 12,
    summary:
      'The square\'s fountain stopped when the guild put in its pipes. Now water is a copper a cup, and the children on the rim have empty cups.',
    accepted: f('side.sweet_water.accepted'),
    available: f('story.vault_refused'),
    start: [{ map: 'aldoria-bazaar', at: { x: 21, y: 14 } }],
    nudge: 'The children on the fountain rim have cups and nothing in them, Gigi. Ask them.',
    steps: [
      { text: "Find the water-carrier: her door is east of the square, with a grey mark on it.", done: f('side.sweet_water.carrier'), goals: [{ map: 'aldoria-bazaar', at: { x: 36, y: 12 } }] },
      {
        text: 'The old cistern gate, out past the caravan gate. The air shimmers over it.',
        done: f('anchor.cistern_pin'),
        goals: [
          { if: f('story.cistern_seen'), map: 'aldoria-desert', at: { x: 29, y: 7 } },
          { map: 'aldoria-desert', at: { x: 30, y: 6 } },
        ],
        // In the memory: the gate, loose on its pin.
        echoGoals: [{ map: 'aldoria-desert', at: { x: 31, y: 5 } }],
      },
      {
        text: 'Back to the fountain in the square.',
        done: f('side.sweet_water.done'),
        goals: [{ map: 'aldoria-bazaar', at: { x: 22, y: 15 } }],
        // Still in the memory: the shimmer back out.
        echoGoals: [{ map: 'aldoria-desert', at: { x: 29, y: 7 } }],
      },
    ],
    done: f('side.sweet_water.done'),
    reward: { gold: 120, xp: 80, pillar: { pillar: 'influence', city: 'al_doria', amount: 2 } },
  },
  // ---- Chapter 5, Eightgate (the outline section 7, with its second review): two required side quests and the debate --
  // A Seat for Every House (Se-5, stage 1 of 2: the petition round). Yari carries Xaraguá's Petition of Breach to every
  // chamber in the Throne Hall: seven doors and a wall. Stage 2 (the houses' tokens) runs through Chapters 6 to 12.
  {
    id: 'seats',
    title: 'A Seat for Every House',
    giver: 'The Master of the Chairs',
    place: 'The Throne Hall',
    level: 14,
    summary:
      "Xaraguá's Petition of Breach was received forty-nine years ago and never carried to a chamber. Yari has the copies. Carry one to every door.",
    accepted: f('side.seats.accepted'),
    available: f('story.elodie_hall'),
    start: [{ map: 'seat-hall', at: { x: 33, y: 27 } }],
    nudge: "Yari's paper, Gigi. She wants every house to read it. The Master of the Chairs is by the Hall's door.",
    parallel: true,
    steps: [
      { text: "Al-Doria's envoy (the west wall).", done: f('side.seats.al_doria'), goals: [{ map: 'seat-hall', at: { x: 2, y: 23 } }] },
      { text: "Skarragol's envoy (the east wall).", done: f('side.seats.skarragol'), goals: [{ map: 'seat-hall', at: { x: 41, y: 15 } }] },
      { text: "Kuroshi's envoy (the east wall).", done: f('side.seats.kuroshi'), goals: [{ map: 'seat-hall', at: { x: 41, y: 19 } }] },
      { text: "Jwaladesh's envoy (the east wall).", done: f('side.seats.jwaladesh'), goals: [{ map: 'seat-hall', at: { x: 41, y: 23 } }] },
      { text: "Aldermoor's legate (the east wall).", done: f('side.seats.aldermoor'), goals: [{ map: 'seat-hall', at: { x: 41, y: 11 } }] },
      { text: "Ardencia's chamber (the west wall).", done: f('side.seats.ardencia'), goals: [{ map: 'seat-hall', at: { x: 1, y: 19 } }] },
      { text: "Zetwal's envoy: Mother (the west wall).", done: f('side.seats.zetwal'), goals: [{ map: 'seat-hall', at: { x: 2, y: 11 } }] },
      { text: "Xaraguá's door, bricked (the west wall).", done: f('side.seats.xaragua'), goals: [{ map: 'seat-hall', at: { x: 1, y: 15 } }] },
      { text: 'Back to the Master of the Chairs.', done: f('side.seats.stage1'), goals: [{ map: 'seat-hall', at: { x: 32, y: 28 } }] },
    ],
    done: f('side.seats.stage1'),
    reward: { gold: 100, xp: 30, pillar: { pillar: 'influence', city: 'seat', amount: 1 } },
  },
  // The fountain's debate, as a required quest (Se-2 Four Voices; the outline 7.3): Who may sit the Throne?
  {
    id: 'voices',
    title: 'Four Voices',
    giver: 'Gaze keeper',
    place: 'The Concourse fountain',
    level: 14,
    summary:
      "Four people of four faiths argue at the fountain about who may sit the Throne. Your family's chair. Hear them out, then make your case.",
    accepted: { any: [f('debate.seat_voices.listened'), f('debate.seat_voices.settled')] },
    available: f('story.coco_plan'),
    start: [{ map: 'seat-concourse', at: { x: 21, y: 16 } }],
    nudge: "The fountain's four people are all talking about our family's chair, Gigi. The Hall has books.",
    steps: [
      { text: 'Listen to the debate at the fountain.', done: f('debate.seat_voices.listened'), goals: [{ map: 'seat-concourse', at: { x: 21, y: 16 } }] },
      { text: 'Join the debate and argue all three rounds, or mediate.', done: f('debate.seat_voices.settled'), goals: [{ map: 'seat-concourse', at: { x: 21, y: 16 } }] },
    ],
    done: f('debate.seat_voices.settled'),
    reward: { xp: 20, pillar: { pillar: 'influence', city: 'seat', amount: 1 } },
  },
  // Deserters' Road (Se-3; the chapter's fights): the Crown's own deserters rob pilgrims at the crossroads. The fight
  // ends by their withdrawal, then a Parley on the map (three answers, all remembered for the War of the Harbor).
  {
    id: 'deserters',
    title: "Deserters' Road",
    giver: 'Bandaged pilgrim',
    place: "The Gold Gate's yard",
    level: 14,
    summary:
      'Pilgrims were robbed at the crossroads outside the walls by men in Crown coats. The Regent\'s clerks say there are no deserters.',
    accepted: f('side.deserters.accepted'),
    available: f('story.coco_plan'),
    start: [{ map: 'seat-gateyard', at: { x: 6, y: 15 } }],
    nudge: 'The pilgrims by the gate are hurt, Gigi. Nobody is helping them.',
    steps: [
      { text: 'The crossroads, south of the gate yard: the deserters\' camp.', done: f('side.deserters.fought'), goals: [{ map: 'seat-fields', at: { x: 30, y: 16 } }] },
      { text: 'Back to the pilgrims in the gate yard.', done: f('side.deserters.done'), goals: [{ map: 'seat-gateyard', at: { x: 6, y: 15 } }] },
    ],
    done: f('side.deserters.done'),
    reward: { gold: 60, xp: 30, pillar: { pillar: 'influence', city: 'seat', amount: 1 } },
  },
  // ---- Chapter 6, Ordvik (the outline section 7, with its second review): two required side quests and the debate ----
  // Grandson of the Steppe (S-5; Azzy's thread): his mother's people are the khatun's household of Ironvow's eastern
  // clans (the review's 3.5: no separate polity, his mother's name, no grandfather's). Opens as the envoy bows at the
  // fair. Three answers, all remembered for Chapter 12's Claim (choice.azzy_ordu); the pillar follows the answer
  // (data/rpg.ts pillarRules). Closed if the party is somehow across the fjord without it.
  {
    id: 'grandson',
    title: 'Grandson of the Steppe',
    giver: 'The envoy in white',
    place: 'The Horse-Fair',
    level: 16,
    summary:
      'An envoy of the khatun\'s household, Azzy\'s mother\'s people, bows to Azzy at the fair and will not stand up. He has an offer, and Azzy has to answer it.',
    accepted: f('side.grandson.accepted'),
    available: f('story.fair_seen'),
    start: [{ map: 'skarragol-fair', at: { x: 34, y: 8 } }],
    nudge: 'The man in the white coat is still bowing, Gigi. At Azzy.',
    steps: [
      { text: "Hear the envoy at the white tent.", done: f('side.grandson.answered'), goals: [{ map: 'skarragol-fair', at: { x: 34, y: 8 } }] },
      {
        text: "Azzy's answer.",
        done: f('side.grandson.done'),
        goals: [
          { if: f('side.grandson.bout'), map: 'skarragol-fair', at: { x: 36, y: 8 } },
          { map: 'skarragol-fair', at: { x: 34, y: 8 } },
        ],
      },
    ],
    done: f('side.grandson.done'),
    closed: f('story.fjord_crossed'),
    closedText: 'Closed: the envoy in white rode east before Azzy answered him. His mother will hear nothing yet.',
    reward: { gold: 150, xp: 50 },
  },
  // The Winter Stores (S-3; the rebel safehouse; puzzle M-SKA-1, the wolf run): the fourth ash thumbprint.
  {
    id: 'winter_stores',
    title: 'The Winter Stores',
    giver: 'Herder at the folds',
    place: 'The Winter Plateau',
    level: 16,
    summary:
      'Someone leaves grain for the herders under the plateau\'s edge every winter, a grey thumbprint on every sack. This year the wolves have found the store.',
    accepted: f('side.winter_stores.accepted'),
    available: f('party.bayarmaa'),
    start: [{ map: 'skarragol-plateau', at: { x: 34, y: 16 } }],
    nudge: 'The herders on the plateau are counting their sacks twice.',
    steps: [
      { text: 'The winter store under the plateau\'s edge, south of the folds.', done: f('side.winter_stores.wolves'), goals: [{ map: 'skarragol-plateau', at: { x: 36, y: 26 } }] },
      {
        text: 'The air shimmers in front of the store. The wolves\' gully, fifty years ago.',
        done: f('anchor.wolf_run'),
        goals: [{ map: 'skarragol-plateau', at: { x: 36, y: 23 } }],
        // In the memory: the loose boulder on the slope above the gully.
        echoGoals: [{ map: 'skarragol-plateau', at: { x: 41, y: 21 } }],
      },
      {
        text: 'Back to the herder at the folds.',
        done: f('side.winter_stores.done'),
        goals: [{ map: 'skarragol-plateau', at: { x: 34, y: 16 } }],
        echoGoals: [{ map: 'skarragol-plateau', at: { x: 36, y: 23 } }],
      },
    ],
    done: f('side.winter_stores.done'),
    closed: f('story.fjord_crossed'),
    closedText: 'Closed: the party went down to the fjord. The herders guard the store themselves.',
    reward: { gold: 200, xp: 60, pillar: { pillar: 'wealth', city: 'skarragol', amount: 1 } },
  },
  // The trading mats' debate, as a required quest (outline 7.3): Oath of blood or oath of sky?
  {
    id: 'oath',
    title: 'Oath of Blood or Sky',
    giver: 'Witness elder',
    place: 'The trading mats',
    level: 16,
    summary:
      'On the trading mats a Sky-Rider and a Witness elder argue whether an oath lives in a stolen standard or under the open sky. Hear them out, then make your case.',
    accepted: { any: [f('debate.skarragol_oath.listened'), f('debate.skarragol_oath.settled')] },
    available: f('party.bayarmaa'),
    start: [{ map: 'skarragol-fair', at: { x: 35, y: 21 } }],
    nudge: 'The traders by the mats are arguing about a stick, Gigi. The Saga Tent has their laws.',
    steps: [
      { text: 'Listen to the debate on the trading mats.', done: f('debate.skarragol_oath.listened'), goals: [{ map: 'skarragol-fair', at: { x: 35, y: 21 } }] },
      { text: 'Join the debate and argue all three rounds, or mediate.', done: f('debate.skarragol_oath.settled'), goals: [{ map: 'skarragol-fair', at: { x: 35, y: 21 } }] },
    ],
    done: f('debate.skarragol_oath.settled'),
    closed: f('story.fjord_crossed'),
    closedText: 'Closed: the traders are still shouting. They always are.',
    reward: { xp: 20, pillar: { pillar: 'influence', city: 'skarragol', amount: 1 } },
  },
  // ---- Chapter 7, Kirinoura (the outline section 7, with its second review): two required side quests and the debate ----
  // The Spy Ledger (K-2; Kayla; the Ash Wars account 2 of 4; M-KUR-1): the sealed stacks behind the Lantern Library. The
  // Echo at Kayla's desk teaches the shelving rule on a Revolution file (the review's 3.3); the Ash Wars row is worked out
  // in the present. Kayla's glyph card at the end is her help with the screens and the spy map (the review's 3.4).
  {
    id: 'spy_ledger',
    title: 'The Spy Ledger',
    giver: 'Kayla, cipher clerk',
    place: 'The Lantern Library',
    level: 18,
    summary:
      'Four accounts of the Ash Wars, and three of them lie. Kirinoura\'s is in the sealed stacks behind the library, shelved by a cipher Kayla keeps.',
    accepted: f('side.spy_ledger.accepted'),
    available: f('story.letter_given'),
    start: [{ map: 'kuroshi-library', at: { x: 9, y: 5 } }],
    nudge: 'The clerk at the library keeps looking at Azzy, Gigi.',
    steps: [
      { text: 'Meet the clerk at the back desk of the Lantern Library.', done: f('side.spy_ledger.accepted'), goals: [{ map: 'kuroshi-library', at: { x: 9, y: 5 } }] },
      {
        text: 'The Echo at Kayla\'s desk is older than the stacks\' door.',
        done: f('clue.shelf_mark'),
        goals: [{ map: 'kuroshi-library', at: { x: 9, y: 8 } }],
        echoGoals: [{ map: 'kuroshi-library', at: { x: 9, y: 8 } }],
      },
      {
        text: 'Into the stacks by the high window; find the Ash Wars ledger by the shelving rule.',
        done: { any: [f('item.spy_ledger'), f('side.spy_ledger.done')] },
        goals: [{ map: 'kuroshi-library', at: { x: 20, y: 10 } }],
        echoGoals: [{ map: 'kuroshi-library', at: { x: 9, y: 8 } }],
      },
      { text: 'Back to Kayla with the ledger.', done: f('side.spy_ledger.done'), goals: [{ map: 'kuroshi-library', at: { x: 9, y: 5 } }] },
    ],
    done: f('side.spy_ledger.done'),
    closed: f('story.haru_met'),
    closedText: 'Closed: the lantern hour came first. The ledger stays in the stacks.',
    reward: { gold: 200, xp: 50, pillar: { pillar: 'influence', city: 'kuroshi', amount: 2 } },
  },
  // Lanterns for the Lost (K-3; the rebel safehouse; M-KUR-2): the fishers' boats steer home by the marsh posts. On the
  // route: the lit posts show the causeway to the file house's back door, so the quest is never an errand.
  {
    id: 'lanterns',
    title: 'Lanterns for the Lost',
    giver: 'Fisher woman',
    place: 'The marsh road',
    level: 18,
    summary:
      'The fishers\' boats went out before the fog and steer home by the marsh posts. The posts are dark, and nobody will light them: the code is a Suzumori secret.',
    accepted: f('side.lanterns.accepted'),
    available: f('story.letter_given'),
    start: [{ map: 'kuroshi-quarter', at: { x: 37, y: 2 } }],
    nudge: 'The fishers\' boy has a lantern and nothing to light it for.',
    steps: [
      // No goal until Haru has joined: the arrow does not lead toward the fog before the maze can be walked (the
      // review's 4: followSide); after, it points at the maze gate, where the code is learned.
      { text: 'Someone must know the posts\' code.', done: f('clue.lantern_code'), goals: [{ if: f('party.haru'), map: 'kuroshi-fogmaze', at: { x: 14, y: 27 } }] },
      { text: 'Light the marsh posts by the huts: left, then right.', done: f('story.boats_home'), goals: [{ map: 'kuroshi-marsh', at: { x: 21, y: 12 } }] },
      { text: 'The old fisher at the huts.', done: f('side.lanterns.done'), goals: [{ map: 'kuroshi-marsh', at: { x: 16, y: 14 } }] },
    ],
    done: f('side.lanterns.done'),
    closed: f('ally.kuroshi'),
    closedText: 'Closed: the fishers lit their own posts in the end.',
    reward: { gold: 250, xp: 50, pillar: { pillar: 'influence', city: 'kuroshi', amount: 1 } },
  },
  // The middle bridge's debate, as a required quest (outline 7.3): Is silence virtue or concealment?
  {
    id: 'silence',
    title: 'Silence or Concealment',
    giver: 'Balance-keeper',
    place: 'The middle bridge',
    level: 18,
    summary:
      'On the middle bridge a Witness balance-keeper and a veiled speaker argue whether silence is a virtue or a hiding place. Hear them out, then make your case.',
    accepted: { any: [f('debate.kuroshi_silence.listened'), f('debate.kuroshi_silence.settled')] },
    available: f('story.letter_given'),
    start: [{ map: 'kuroshi-quarter', at: { x: 26, y: 11 } }],
    nudge: 'The two on the middle bridge are arguing about not talking.',
    steps: [
      { text: 'Listen to the debate on the middle bridge.', done: f('debate.kuroshi_silence.listened'), goals: [{ map: 'kuroshi-quarter', at: { x: 26, y: 11 } }] },
      { text: 'Join the debate and argue all three rounds, or mediate.', done: f('debate.kuroshi_silence.settled'), goals: [{ map: 'kuroshi-quarter', at: { x: 26, y: 11 } }] },
    ],
    done: f('debate.kuroshi_silence.settled'),
    closed: f('story.haru_met'),
    closedText: 'Closed: the keepers are still at it. They always are.',
    reward: { xp: 15, pillar: { pillar: 'influence', city: 'kuroshi', amount: 1 } },
  },
  // ---- Chapter 8, Agnipur (the outline section 7, with its second review): two required side quests and the debate ----
  // The Lamp Relay (J-2; the runners; M-JWA-1): the runners' hearth remembers the sheltered way (the Echo), and the wind
  // off the sea puts the lamp out on the main street. Run for real at the chapter's end, with oil.
  {
    id: 'lamp_relay',
    title: 'The Lamp Relay',
    giver: 'Chief runner',
    place: 'The temple steps',
    level: 20,
    summary:
      'Every new moon for fifty years the runners carried the sea\'s fire from the chain lamp to the wick. The lamp is dark; they practise with kitchen fire.',
    accepted: f('side.lamp_relay.accepted'),
    available: f('story.court_heard'),
    start: [{ map: 'jwaladesh-bazaar', at: { x: 13, y: 2 } }],
    nudge: 'The runners have lamps and nothing to light them for.',
    steps: [
      { text: 'Ask the chief runner on the temple steps.', done: f('side.lamp_relay.accepted'), goals: [{ map: 'jwaladesh-bazaar', at: { x: 13, y: 2 } }] },
      {
        text: 'The runners\' hearth remembers the way better than she does.',
        done: f('clue.relay_route'),
        goals: [{ map: 'jwaladesh-bazaar', at: { x: 14, y: 3 } }],
        echoGoals: [{ map: 'jwaladesh-bazaar', at: { x: 14, y: 3 } }],
      },
      {
        text: 'Take a lamp from the chief runner.',
        done: { any: [f('item.relay_lamp'), f('side.lamp_relay.done')] },
        goals: [{ map: 'jwaladesh-bazaar', at: { x: 13, y: 2 } }],
        // Still in the memory after the runners: the shimmer back out.
        echoGoals: [{ map: 'jwaladesh-bazaar', at: { x: 14, y: 3 } }],
      },
      { text: 'From the harbor stair\'s head to the temple steps. Not the main street.', done: f('side.lamp_relay.done'), goals: [{ map: 'jwaladesh-bazaar', at: { x: 13, y: 2 } }] },
    ],
    done: f('side.lamp_relay.done'),
    closed: f('story.tower_open'),
    closedText: 'Closed: the night came first. The runners practise with kitchen fire.',
    reward: { gold: 250, xp: 25, items: [{ id: 'flame_bead_bracelet', n: 1 }], pillar: { pillar: 'wealth', city: 'jwaladesh', amount: 1 } },
  },
  // The Anonymous Oil (J-3; the rebel safehouse, the seventh thumbprint): out to the salt road (the wild section on the
  // route, the outline's Claude's call), the Seth's enforcers, the carter's jars, the Court's back gate.
  {
    id: 'anonymous_oil',
    title: 'The Anonymous Oil',
    giver: 'Junior priest',
    place: 'The Court of the Flame',
    level: 20,
    summary:
      'Oil comes to the Court\'s back gate from nobody: a carter from the salt road, with jars he will not be paid for. Tonight he is late.',
    accepted: f('side.anonymous_oil.accepted'),
    available: f('story.court_heard'),
    start: [{ map: 'jwaladesh-court', at: { x: 15, y: 9 } }],
    nudge: 'The priest with the broom isn\'t sweeping.',
    steps: [
      { text: 'The junior priest in the colonnade.', done: f('side.anonymous_oil.accepted'), goals: [{ map: 'jwaladesh-court', at: { x: 15, y: 9 } }] },
      { text: 'The salt road, east of the bazaar: the carter at the shrine.', done: f('story.salt_road_cleared'), goals: [{ map: 'jwaladesh-saltflats', at: { x: 41, y: 12 } }] },
      { text: 'The carter at the Court\'s back gate.', done: f('side.anonymous_oil.done'), goals: [{ map: 'jwaladesh-court', at: { x: 3, y: 24 } }] },
    ],
    done: f('side.anonymous_oil.done'),
    closed: f('story.tower_open'),
    closedText: 'Closed: the carter came through the back gate on his own.',
    reward: { gold: 300, xp: 25, pillar: { pillar: 'wealth', city: 'jwaladesh', amount: 2 } },
  },
  // The spice row's debate, as a required quest (outline 7.3): Is hesitation a sin, or is remembering mercy?
  {
    id: 'hesitation',
    title: 'Hesitation or Mercy',
    giver: 'Gaze pilgrim',
    place: 'The spice row',
    level: 20,
    summary:
      'On the spice row a Flame Keeper and a Gaze pilgrim argue whether hesitation is a sin, or remembering a mercy. Hear them out, then make your case.',
    accepted: { any: [f('debate.jwaladesh_hesitation.listened'), f('debate.jwaladesh_hesitation.settled')] },
    available: f('story.court_heard'),
    start: [{ map: 'jwaladesh-bazaar', at: { x: 30, y: 17 } }],
    nudge: 'The two by the spices are arguing about waiting.',
    steps: [
      { text: 'Listen to the debate on the spice row.', done: f('debate.jwaladesh_hesitation.listened'), goals: [{ map: 'jwaladesh-bazaar', at: { x: 30, y: 17 } }] },
      { text: 'Join the debate and argue all three rounds, or mediate.', done: f('debate.jwaladesh_hesitation.settled'), goals: [{ map: 'jwaladesh-bazaar', at: { x: 30, y: 17 } }] },
    ],
    done: f('debate.jwaladesh_hesitation.settled'),
    closed: f('story.tower_open'),
    closedText: 'Closed: the two on the spice row are still at it. They always are.',
    reward: { xp: 15, pillar: { pillar: 'influence', city: 'jwaladesh', amount: 1 } },
  },
];

/** Chapter 5's three, all done: the Seat's evening, and Coco's "Bed." (data/quests.ts `bell`). */
export const CHAPTER5_QUESTS_DONE: Condition = { all: [f('side.seats.stage1'), f('debate.seat_voices.settled'), f('side.deserters.done')] };

/** Chapter 2's five side quests, all done: the lamp-oil seller lends the lamp at dusk (data/quests.ts `dusk`). */
export const CHAPTER2_QUESTS = ['nets', 'hutia', 'oil', 'medicine', 'springs'] as const;
export const CHAPTER2_QUESTS_DONE: Condition = {
  all: [f('side.nets.done'), f('side.hutia.done'), f('side.oil.done'), f('side.medicine.done'), SPRINGS_DONE],
};
