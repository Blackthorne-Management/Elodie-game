// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';
import { AREITO_BARS, barText } from './rhythms.ts';
import { CHAPTER2_QUESTS_DONE, CHAPTER5_QUESTS_DONE } from './sideQuests.ts';
import { FAIR, FJORD, HERD, HORN_DAY_DONE, MOOT, PLATEAU, QUAY } from './skarragol.ts';
import { FILEHOUSE, HALL, LANTERN_DAY_DONE, LIBRARY, MARSH, MARSH_CODE, MAZE, PIER, QUARTER, SCREENS_SOLUTION } from './kuroshi.ts';
import type { Goal } from '../engine/guide.ts';

export const ACT1: QuestDef = {
  id: 'act1',
  title: 'Chapter 1: The Festival of the Gaze',
  maps: ['zetwal-town', 'zetwal-house', 'zetwal-temple', 'zetwal-square', 'zetwal-hall', 'zetwal-market', 'zetwal-road'],
  objectives: [
    {
      id: 'festival',
      title: "Mother's address",
      detail: 'Mother speaks from the stage at the north of the plaza. Go and listen.',
      done: { flag: 'story.heard_speech' },
      goals: [{ map: 'zetwal-town', at: { x: 17, y: 4 } }],
      hints: [
        "Gigi... isn't Mother about to speak? Everyone's going north.",
        'The stage is at the top of the plaza, past the fountain.',
        "Mother's on the stage, north of the fountain. Let's stand in front of her and talk to her.",
      ],
    },
    {
      id: 'farewell',
      title: 'See Mother off',
      detail: 'Her carriage waits at the east gate, at the end of the road south-east of the plaza.',
      done: { flag: 'story.elodie_left' },
      goals: [{ map: 'zetwal-town', at: { x: 36, y: 20 } }],
      hints: [
        'Mother said the east gate. She will not wait forever.',
        'The road goes east from below the plaza, all the way to the gate.',
        "Follow the road south-east of the plaza to the carriage. Mother's standing beside it.",
      ],
    },
    {
      id: 'anicette',
      title: 'Grandmother is waiting',
      detail: "Mother says Grandmother Anicette has something for you, at home in Grandfather's study.",
      done: { flag: 'item.sun_locket' },
      goals: [{ map: 'zetwal-house', at: { x: 12, y: 4 } }],
      hints: [
        'Grandmother is at home. I want to see what she has for you.',
        'Home is the house on the north-west side of the plaza.',
        "Go in our front door, north-west of the plaza. Grandmother's in the study, on the right.",
      ],
    },
    {
      id: 'first_echo',
      title: 'What the Locket remembers',
      detail: 'Stand on the shimmering tiles by the map table and press Echo. Then talk to the people there.',
      done: { flag: 'story.warroom_echo' },
      goals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      // In the memory: the aide by the shelves has the night orders (review 1, finding 2).
      echoGoals: [{ map: 'zetwal-house', at: { x: 12, y: 4 } }],
      hints: [
        'The air by the map table is shimmering, Gigi. Do you see it?',
        'Stand on the shimmering tiles and press Echo. I will hold the door.',
        "In the memory you're Grandfather. Talk to the aide by the shelves; he has something for you.",
      ],
    },
    {
      id: 'hide_orders',
      title: 'Leave word for later',
      detail: 'Grandfather keeps copies of his papers under the loose board by the window seat. Leave the night orders there.',
      done: { flag: 'anchor.night_orders' },
      // The copy is only in the memory: in the present, back to the shimmer; in it, the aide for the copy (it
      // is gone after a return), then the board by the window.
      goals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      echoGoals: [
        { if: { notFlag: 'echo.orders_copy' }, map: 'zetwal-house', at: { x: 12, y: 4 } },
        { map: 'zetwal-house', at: { x: 17, y: 2 } },
      ],
      hints: [
        "Grandfather hid things for later, didn't he? Grandmother always says so.",
        'The aide said where the copy goes: the loose board by the window.',
        'As Grandfather, take the orders to the window seat in the corner and leave them under the board.',
      ],
    },
    {
      id: 'read_orders',
      title: 'Fifty years under the floor',
      detail: 'Return to the present on the shimmering tiles, then look under the window seat.',
      done: { flag: 'clue.night_orders' },
      // In the memory, the shimmer back out; in the present, the board (review 1, finding 2: an early return,
      // story.warroom_returned, is not the orders in hand).
      goals: [{ map: 'zetwal-house', at: { x: 17, y: 2 } }],
      echoGoals: [{ map: 'zetwal-house', at: { x: 14, y: 6 } }],
      hints: [
        'Come back, Gigi. I want to see if it is still there.',
        'Press Echo on the shimmering tiles to come back, then look under the window seat.',
        'Back on the shimmering tiles, press Echo. Then face the window seat and look.',
      ],
    },
    {
      id: 'bridge',
      title: 'Cross to the Temple island',
      detail: 'The rope bridge has fallen. The night orders: turn the winch to lower the Chain Bridge, then drive the iron pin through the pawl.',
      done: { flag: 'story.bridge_crossed' },
      // In the present: the bridgehead shimmer, then (pinned) across. In the memory: the winch, the pawl, then the
      // shimmer back out (review 1, finding 2).
      goals: [
        { if: { flag: 'anchor.chain_bridge' }, map: 'zetwal-town', at: { x: 31, y: 9 } },
        { map: 'zetwal-town', at: { x: 28, y: 10 } },
      ],
      echoGoals: [
        { if: { flag: 'anchor.chain_bridge' }, map: 'zetwal-town', at: { x: 28, y: 10 } },
        { if: { flag: 'echo.chain_bridge_down' }, map: 'zetwal-town', at: { x: 29, y: 8 } },
        { map: 'zetwal-town', at: { x: 28, y: 8 } },
      ],
      hints: [
        'Gigi, what if the old bridge could just... go back?',
        'The air shimmers at the bridgehead, by the old winch. Grandfather was there that night.',
        'Use the Locket at the bridgehead. As Grandfather, turn the winch, pin the pawl, then come back and cross.',
      ],
    },
    {
      id: 'grandfather',
      title: 'Find Grandfather',
      detail: 'Grandfather is at the Gaze lamp, inside the temple.',
      done: { flag: 'story.met_patricio' },
      goals: [{ map: 'zetwal-temple', at: { x: 13, y: 3 } }],
      hints: [
        'Grandfather will be at the lamp. He always is, on this night.',
        "The temple is north of the landing. He'll be inside, by the lamp.",
        'Walk east from the bridge, then north into the temple. Grandfather is beside the lamp.',
      ],
    },
    {
      id: 'lamp',
      title: 'The reading of the names',
      detail: 'The Gaze lamp will not take a flame. Grandfather asks you to try.',
      done: { flag: 'story.anissa_woke' },
      goals: [{ map: 'zetwal-temple', at: { x: 14, y: 3 } }],
      hints: [
        'Will you try the lamp, Gigi? Grandfather asked you.',
        'Stand in front of the lamp and try to light it.',
        'Face the lamp in the middle of the temple and press A.',
      ],
    },
    {
      id: 'dock',
      title: 'A canoe at the dock',
      detail: 'Someone has come across the water to the island dock, south of the temple.',
      done: { flag: 'story.yari_asked' },
      goals: [{ map: 'zetwal-temple', at: { x: 14, y: 12 } }],
      hints: [
        'Someone came across the water. I saw a canoe.',
        'The dock is at the south end of the island.',
        'Go south from the temple to the dock and talk to whoever came.',
      ],
    },
    // Batch D (Oct 19): after Yari, the Journal walks the city the short way, so the gold arrow does too: the
    // island's work first ("I have work at the archive"), then the Hall, the Cane Road, the city's errands on the
    // way back, and the island again to sail. `island` and `town` only order what the side quests already reward
    // (no story XP), and the boar is still met at level 3, as the battle tutorial expects (tests/battle.test.ts).
    {
      id: 'island',
      title: 'Work on the island',
      detail: 'Before crossing back: the cane cutter is waiting by the name stones, and the senior archivist is in the Temple Archive.',
      done: { all: [{ flag: 'side.cane_name.stones' }, { flag: 'side.overdue.accepted' }, { flag: 'lore.zetwal_ash_wars_temple' }] },
      noXp: true,
      goals: [
        { if: { notFlag: 'side.cane_name.stones' }, map: 'zetwal-temple', at: { x: 8, y: 4 } },
        { if: { notFlag: 'side.overdue.accepted' }, map: 'zetwal-archive', at: { x: 14, y: 4 } },
        { map: 'zetwal-archive', at: { x: 2, y: 2 } },
      ],
      hints: [
        'You told Yari you had work at the archive, Gigi. And that cane cutter by the name stones looks lost.',
        'The name stones are west of the temple. The archive is through the door at the back of the temple.',
        "Talk to the cane cutter at the name stones, then the senior archivist. Read the temple's Ash Wars record on the history shelf.",
      ],
    },
    // The Envoy's Papers (owner decision, Oct 15: one task at the Hall of the Accord in Chapter 1; in one visit
    // since Batch D, Oct 19: the engraver brings the seal to the clerk's desk).
    {
      id: 'papers',
      title: "The envoy's papers",
      detail: "The Crown boards every boat at Xaraguá. Ask the clerk at the Hall of the Accord, up the steps at the head of the plaza, for envoy papers.",
      done: { flag: 'story.envoy_papers' },
      goals: [
        { if: { flag: 'story.papers_sealed' }, map: 'zetwal-hall', at: { x: 32, y: 5 } },
        { map: 'zetwal-hall', at: { x: 21, y: 25 } },
      ],
      hints: [
        'Yari said we need papers, Gigi. The Hall writes them.',
        "The Hall of the Accord is up the steps at the head of the plaza. The clerk's desk is just inside the doors.",
        "The clerk at his desk inside the Hall's doors, then up the gallery to the Chancellor's office, the first door east.",
      ],
    },
    // The first battle is not optional (owner decision, Oct 16): Yari will not sail until the boar is beaten.
    // On the way in, the shimmer by the gate, if the cane cutter's quest is waiting on it.
    {
      id: 'boar',
      title: 'The boar on the Cane Road',
      detail: 'A boar is charging the cane cutters on the Cane Road, past the east gate. Yari will not sail until it is dealt with.',
      done: { flag: 'encounter.wilds.boar.won' },
      goals: [
        { if: { all: [{ flag: 'side.cane_name.stones' }, { notFlag: 'clue.cane_name' }] }, map: 'zetwal-road', at: { x: 3, y: 14 } },
        { map: 'zetwal-road', at: { x: 9, y: 12 } },
      ],
      // In the Cane Road's memory: the cane worker by the roses, then the shimmer back out.
      echoGoals: [
        { if: { notFlag: 'clue.cane_name' }, map: 'zetwal-road', at: { x: 2, y: 16 } },
        { map: 'zetwal-road', at: { x: 3, y: 14 } },
      ],
      hints: [
        "Yari won't leave the cane cutters with that boar, Gigi. Neither will I.",
        'The Cane Road is past the east gate, at the end of the road south-east of the plaza.',
        'Go out through the east gate onto the Cane Road and walk east into the cane. The boar will find us.',
      ],
    },
    {
      id: 'town',
      title: 'Errands on the way back',
      detail: "Back through the city to the island: the archive's overdue books, the soup vendor's bowls, and the debate on the lawn below the plaza.",
      done: {
        all: [
          { flag: 'side.overdue.soup' },
          { flag: 'side.overdue.ferry' },
          { flag: 'side.overdue.vol2' },
          { flag: 'side.soup.done' },
          { any: [{ flag: 'debate.zetwal_corner.joined' }, { flag: 'debate.zetwal_corner.mediated' }] },
        ],
      },
      noXp: true,
      // In the order they lie on the way back from the east gate: the lawn below the plaza, the vendor, the old
      // neighbor, home, the guard, the docks, and the vendor again.
      goals: [
        { if: { all: [{ notFlag: 'debate.zetwal_corner.joined' }, { notFlag: 'debate.zetwal_corner.mediated' }] }, map: 'zetwal-town', at: { x: 22, y: 17 } },
        {
          if: { any: [{ notFlag: 'side.overdue.soup' }, { all: [{ notFlag: 'side.soup.accepted' }, { notFlag: 'side.soup.done' }] }] },
          map: 'zetwal-town',
          at: { x: 11, y: 12 },
        },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.elder' }] }, map: 'zetwal-town', at: { x: 4, y: 11 } },
        { if: { notFlag: 'side.overdue.vol2' }, map: 'zetwal-house', at: { x: 12, y: 4 } },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.guard' }] }, map: 'zetwal-town', at: { x: 22, y: 10 } },
        {
          if: { any: [{ notFlag: 'side.overdue.ferry' }, { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.ferry' }] }] },
          map: 'zetwal-town',
          at: { x: 9, y: 23 },
        },
        { map: 'zetwal-town', at: { x: 11, y: 12 } },
      ],
      hints: [
        'The overdue books, the soup, and that debate below the plaza, Gigi. All of it is on our way back to the island.',
        'The debate is on the lawn below the plaza. The soup vendor is on the plaza, Grandmother is at home, the ferryman at the docks.',
        'The debate on the lawn, then the soup vendor, the old neighbor, Grandmother, the guard, the ferryman, and the vendor again.',
      ],
    },
    // Every side quest in Pòdlimyè must be done before Yari sails (owner decision, Oct 18). The gold arrow
    // follows what is left of them (engine/guide.ts `followSide`): by now, back on the island.
    {
      id: 'errands',
      title: 'Unfinished business',
      detail: 'Yari will not sail while Pòdlimyè still needs Gianna. Finish every quest on your Quests page first.',
      done: {
        all: [
          { flag: 'side.overdue.done' },
          { flag: 'side.soup.done' },
          { flag: 'side.cane_name.done' },
          { any: [{ flag: 'debate.zetwal_corner.joined' }, { flag: 'debate.zetwal_corner.mediated' }] },
        ],
      },
      followSide: true,
      hints: [
        'We cannot leave yet, Gigi. Your Quests page still has work on it.',
        'Follow the arrow, Gigi. It knows what is left better than I do.',
        "The books back to the archivist, Grann's name in Mother Solange's list, and the cane cutter at the name stones.",
      ],
    },
    {
      id: 'depart',
      title: 'Before the tide',
      detail: "Yari's canoe waits at the island dock. Go to the canoe and tell Yari you are ready to sail.",
      done: { flag: 'act1.complete' },
      goals: [{ map: 'zetwal-temple', at: { x: 16, y: 18 } }],
      hints: [
        "Yari's canoe is at the island dock. Are we going soon, Gigi?",
        'Everything is done in Pòdlimyè. Go to the canoe at the dock.',
        'Go to the dock south of the temple, to the canoe, and tell Yari you are ready.',
      ],
    },
  ],
};

/**
 * Chapter 2, The Charter (Xaraguá; docs/quest/design/STORY.md). The first half (story build, Oct 16): the
 * living city. The ferry lands, Crown marines are shaking down the fishers on the pier (the first fight
 * here), Yari takes Gianna to her ailing father, the elders' council leans toward the Charter until Yari
 * defies it, and Governor Thorne lets Gianna know he is watching. The last objective leads into the
 * petroglyph cave, which the next build opens.
 */
export const ACT2: QuestDef = {
  id: 'act2',
  title: 'Chapter 2: The Charter',
  maps: [
    'xaragua-village', 'xaragua-plaza', 'xaragua-beach', 'xaragua-conuco', 'xaragua-mountain', 'xaragua-camp', 'xaragua-caney', 'xaragua-song',
    'xaragua-customs', 'xaragua-cave', 'xaragua-record', 'xaragua-cellar', 'xaragua-seacave',
  ],
  objectives: [
    {
      id: 'pier',
      title: 'Trouble on the pier',
      detail: 'Crown marines are taking the fishers\' catch at the end of the pier. Stand with Yari.',
      done: { flag: 'encounter.xaragua_story.pier.won' },
      goals: [{ map: 'xaragua-village', at: { x: 21, y: 23 } }],
      hints: [
        'Gigi, those marines are taking the fish. Yari looks ready to fight them.',
        'The sergeant is on the pier, right in front of us. Talk to him.',
        'Talk to the sergeant on the pier. Then Sunthread, and Surge when I am ready.',
      ],
    },
    {
      id: 'anaco',
      title: "Yari's father",
      detail: 'Cacique Anaco is ill. His great house, the caney, stands at the head of the Areíto Plaza, up the road from the pier.',
      done: { flag: 'story.anaco_met' },
      goals: [{ map: 'xaragua-caney', at: { x: 33, y: 4 } }],
      hints: [
        'Yari keeps looking up the hill. Her father is sick, Gigi.',
        'The caney is the long house at the top of the dance ground, north of the village.',
        "Go up the road north to the plaza, into the caney. He's in the healer's room on the right.",
      ],
    },
    {
      id: 'council',
      title: "The elders' council",
      detail: 'The elders meet in the council circle, on the west side of the caney, to vote on the Crown\'s Charter.',
      done: { flag: 'story.council_defied' },
      goals: [{ map: 'xaragua-caney', at: { x: 7, y: 6 } }],
      hints: [
        'The elders are deciding about the Charter tonight. Yari will want to be there.',
        'The council circle is the room on the west side of the caney.',
        'In the caney, go through the opening on the left wall, into the council circle.',
      ],
    },
    {
      id: 'thorne',
      title: "The Governor's eye",
      detail: 'Governor Thorne has asked to see the envoy\'s daughter, in the Crown Customs House on the harbor.',
      done: { flag: 'story.thorne_met' },
      goals: [{ map: 'xaragua-customs', at: { x: 10, y: 3 } }],
      hints: [
        'A Governor wants to see you, Gigi. That sounds bad and important.',
        'The customs house is the stone one by the harbor, with the red roof.',
        'Down in the village, go into the Crown Customs House. Thorne is in his office.',
      ],
    },
    // The lamp-oil seller will not hand over a cave lamp under the Governor's spyglass (Chapter 2 side quests, Oct 20):
    // asking her is the refusal that starts the gate below. No story XP here: the lamp itself pays, at dusk.
    {
      id: 'lamp_ask',
      title: 'A light for the cave',
      detail: 'The first oath was carved in the petroglyph cave in the cassava gardens, and the cave is dark. Find a lamp.',
      done: { any: [{ flag: 'story.lamp_asked' }, { flag: 'item.oil_lamp' }] },
      noXp: true,
      goals: [{ map: 'xaragua-village', at: { x: 23, y: 10 } }],
      hints: [
        'The keepers said the oath was carved in a cave. It is dark in caves, Gigi.',
        'Everyone in the village buys lamp oil from the same seller. She stands by the customs house.',
        'Talk to the lamp-oil seller beside the Crown Customs House in the Harbor Village.',
      ],
    },
    // The side quests' gate (owner decision, Oct 19: after Thorne's watching scene, before the cave). The lamp-oil
    // seller lends the cave lamp at dusk, when the night canoe brings her oil and the Governor's glass is off them:
    // "Let him watch us do ordinary things all day." Done through the side quests (the arrow follows what is left);
    // it only orders what they already pay for (no story XP). A save that already has the lamp has passed it.
    {
      id: 'dusk',
      title: 'Until dusk',
      detail:
        "The lamp-oil seller lends her lamp at dusk, when the night canoe brings the oil and the Governor's glass is off you. Until then, let him watch you do ordinary things: finish every quest on your Quests page.",
      done: { any: [CHAPTER2_QUESTS_DONE, { flag: 'item.oil_lamp' }] },
      followSide: true,
      noXp: true,
      hints: [
        'The lamp waits for dusk, Gigi. Until then, half of Yucayeque asked us for help. Let the Governor watch us give it.',
        'Follow the arrow, Gigi. It knows what is left better than I do.',
        "The fisher's nets, the girl's hutia, the oil jars and the healer's bark up the mountain, and the argument by the fire.",
      ],
    },
    {
      id: 'lamp',
      title: 'The lamp at dusk',
      detail: "Dusk. The night canoe has brought the lamp-oil seller her oil, and the Governor's glass has gone in. She will lend you the lamp now.",
      done: { flag: 'item.oil_lamp' },
      goals: [{ map: 'xaragua-village', at: { x: 23, y: 10 } }],
      hints: [
        'It is dusk, Gigi. The lamp-oil seller said she would have the lamp for us now.',
        'She stands by the Crown Customs House, in the Harbor Village.',
        'Talk to the lamp-oil seller beside the Crown Customs House in the Harbor Village.',
      ],
    },
    {
      id: 'cave',
      title: 'What the stones remember',
      detail: 'The petroglyph cave is under the rocks in the cassava gardens, west of the village. Its carved chamber is flooded.',
      done: { flag: 'clue.drum_pattern' },
      // In the present: the shimmer in the antechamber, then (drained) the carved wall. In the memory: the lower
      // sluice, then the shimmer back out (review 1, finding 2).
      goals: [
        { if: { flag: 'anchor.cave_sluice' }, map: 'xaragua-cave', at: { x: 5, y: 2 } },
        { map: 'xaragua-cave', at: { x: 14, y: 14 } },
      ],
      echoGoals: [
        { if: { flag: 'anchor.cave_sluice' }, map: 'xaragua-cave', at: { x: 14, y: 14 } },
        { map: 'xaragua-cave', at: { x: 3, y: 7 } },
      ],
      hints: [
        'The water came from somewhere, and it has to go somewhere.',
        'In the memory the cave was dry. Look at both gates. The high one is buried now, isn\'t it?',
        'Step into the memory in the cave, open the lower sluice on the west side, then come back and read the carved wall.',
      ],
    },
    {
      id: 'areito',
      title: 'The last bar',
      detail: 'The cave wall shows the areíto\'s drum song, but its last bar is worn away. Hear it played on the dance ground, fifty years ago.',
      done: { flag: 'clue.drum_full' },
      goals: [{ map: 'xaragua-plaza', at: { x: 14, y: 13 } }],
      hints: [
        'Two thirds of a song is not a song, Gigi. Someone has to play it for us.',
        'The air shimmers in the middle of the dance ground on the Areíto Plaza.',
        'Stand in the middle of the batey on the Areíto Plaza and step into the memory: the drummers play the whole song.',
      ],
    },
    {
      id: 'lock',
      title: 'The record house',
      detail: 'The standing stones round the dance ground open the council\'s record house to the whole drum song.',
      done: { flag: 'story.oath_found' },
      goals: [
        { if: { flag: 'story.lock_opened' }, map: 'xaragua-record', at: { x: 7, y: 2 } },
        { map: 'xaragua-plaza', at: { x: 21, y: 12 } },
      ],
      // Still in the areíto's memory: the shimmer in the batey back out (the stones are tapped in the present).
      echoGoals: [{ map: 'xaragua-plaza', at: { x: 14, y: 13 } }],
      hints: [
        'The stones round the dance ground are carved with drums. Drums are for tapping.',
        'Tap the whole song on the standing stone by the record house: long marks are two beats, short marks one.',
        'At the stone east of the batey, tap the song (choose the slow tempo if you like), then read the stone inside the record house.',
      ],
    },
    {
      id: 'proof',
      title: 'Proof for the elders',
      detail: 'The oath stone names Caona, Patricio and Benny, and says nothing about giving the harbor away. The elders asked for proof.',
      done: { flag: 'story.proof_shown' },
      goals: [{ map: 'xaragua-caney', at: { x: 9, y: 6 } }],
      hints: [
        'The elders said: bring proof. We have it now, Gigi.',
        'The elders meet in the council circle in the caney.',
        'Take what the oath stone says to the elders in the caney.',
      ],
    },
    {
      id: 'escape',
      title: 'The night the Crown came',
      detail: 'The Crown has taken the caney and the cacique. Anaco said: take the girls to the cave. Get to the petroglyph cave in the cassava gardens.',
      done: { flag: 'story.refuge' },
      goals: [{ map: 'xaragua-cave', at: { x: 14, y: 19 } }],
      hints: [
        'Anaco said the cave, Gigi. The one we drained.',
        'Down through the plaza to the village, then west to the cassava gardens.',
        'Go down to the Harbor Village, take the trail west to the gardens, and into the petroglyph cave.',
      ],
    },
    // Review 1 (Oct 21), finding 3: the occupied city was a fetch loop. The seller and the marine at her shutters are
    // one stop, and the customs house's register is on the way to the Governor: no climb to the caney.
    {
      id: 'held',
      title: 'Where is Anaco held?',
      detail: 'The Crown holds Yucayeque. Only Gianna, Zetwal\'s envoy, can walk the streets. Find out where they keep the cacique (and cut the healer\'s fever bark by the spring pond on the way).',
      done: { flag: 'story.anaco_found' },
      // The healer's fever bark first: its tree is on the way from the cave into the city.
      goals: [
        { if: { all: [{ flag: 'story.bark_asked' }, { notFlag: 'item.fever_bark' }, { notFlag: 'story.anaco_visited' }] }, map: 'xaragua-conuco', at: { x: 29, y: 18 } },
        { if: { any: [{ notFlag: 'clue.held_seller' }, { notFlag: 'clue.held_guard' }] }, map: 'xaragua-village', at: { x: 23, y: 10 } },
        { map: 'xaragua-customs', at: { x: 5, y: 2 } },
      ],
      hints: [
        'Someone in the city has seen where they took him.',
        'The lamp-oil seller sees everything from her doorway. And the customs house writes everything down.',
        'Ask the lamp-oil seller at her shutters in the village, then read the clerk\'s register in the customs house.',
      ],
    },
    {
      id: 'visit',
      title: 'The envoy\'s visit',
      detail: 'Anaco is in the customs house cellar, with his fever. The healer in the cave wants him to have fever bark. An envoy may visit a prisoner: make Thorne say yes.',
      done: { flag: 'story.anaco_visited' },
      goals: [
        { if: { flag: 'story.visit_granted' }, map: 'xaragua-cellar', at: { x: 6, y: 2 } },
        { if: { flag: 'item.fever_bark' }, map: 'xaragua-customs', at: { x: 10, y: 3 } },
        { if: { flag: 'story.bark_asked' }, map: 'xaragua-conuco', at: { x: 29, y: 18 } },
        { map: 'xaragua-cave', at: { x: 17, y: 18 } },
      ],
      hints: [
        'The healer in the cave knows what his fever needs.',
        'Fever bark grows on the tree by the spring pond in the cassava gardens. Then ask Thorne, as the envoy.',
        'Get fever bark from the tree east of the gardens\' pond, ask Thorne for the visit, and take the cellar stairs to Anaco.',
      ],
    },
    {
      id: 'blockade',
      title: 'Through the blockade',
      detail: 'A runner has carried Anaco\'s word to the cave. Tonight, at the lowest tide, meet Yari and Anissa at the sea cave on the Canoe Beach, and get Yari out past the Crown\'s ships.',
      done: { flag: 'story.escaped' },
      // The trail east is barred until the envoy shows her papers (finding 7 of review 1: the arrow on the barricade
      // itself); then the sea cave mouth, where Yari and Anissa come up from the waterline; then the sea mouth.
      goals: [
        { if: { notFlag: 'story.papers_checked' }, map: 'xaragua-village', at: { x: 41, y: 15 } },
        { if: { notFlag: 'story.escape_night' }, map: 'xaragua-beach', at: { x: 31, y: 8 } },
        { map: 'xaragua-seacave', at: { x: 19, y: 5 } },
      ],
      hints: [
        'The tide, Gigi. Everything is the tide here.',
        'The trail east to the Canoe Beach is barred. Show them your papers. The sea cave is at the east end of the beach.',
        'Show your papers at the barricade on the east trail, then go to the sea cave on the Canoe Beach. Yari will meet you there.',
      ],
    },
  ],
};


/** The Lower Town debate, joined or mediated (Chapter 3's "Until noon"). */
const ARD_DEBATE_DONE = { any: [{ flag: 'debate.ardencia_bread.joined' }, { flag: 'debate.ardencia_bread.mediated' }] };

/**
 * Chapter 3, The Trial of Blades (Ardencia, Cenizal; docs/quest/reviews/2026-10-20-chapter3-outline.md with its
 * review and the owner's decisions). Grandfather's request (done at Chapter 2's end, so the Journal shows this
 * chapter on the pier), the voyage, the gate and Azzy, the audience, the day in the city (two side quests and the
 * debate, followed by the arrow), the trial (meant to be lost), the forge fortress and its Echo puzzle, Benny's
 * tunnel, the sea road and the camp.
 */
export const ACT3: QuestDef = {
  id: 'act3',
  title: 'Chapter 3: The Trial of Blades',
  maps: ['ardencia-flats', 'ardencia-town', 'ardencia-alcazar', 'ardencia-lower', 'ardencia-library', 'ardencia-forge', 'ardencia-tunnel', 'ardencia-camp'],
  objectives: [
    {
      id: 'request',
      title: "Grandfather's request",
      detail: 'Grandfather asks Gianna to go to Ardencia and ask Lord Rael, Benny\'s son, to stand with Xaraguá.',
      done: { flag: 'story.ardencia_asked' },
      // Chapter 2's last scene, shown here so the Journal opens Chapter 3 on the pier: it pays no second XP.
      noXp: true,
      goals: [{ map: 'zetwal-harbor', at: { x: 30, y: 12 } }],
      hints: [
        'Grandfather is waiting on the pier, Gigi.',
        'The long pier at the Old Harbor.',
        'Walk up the long pier to Grandfather and Grandmother.',
      ],
    },
    {
      id: 'sail',
      title: 'Sail for Ardencia',
      detail: 'The trader who brought you home sails for Ardencia from the long pier. Ardencia is across the strait.',
      done: { flag: 'story.ardencia_arrived' },
      goals: [{ map: 'zetwal-harbor', at: { x: 31, y: 14 } }],
      hints: [
        'Ardencia is across the water, Gigi. We need a boat.',
        'The trader captain is still on the long pier.',
        'Talk to the trader captain at the end of the long pier and tell him to sail.',
      ],
    },
    {
      id: 'gate',
      title: 'The gate of Cenizal',
      detail: 'The sea road climbs the Cinder Flats to the red-stone gate of Cenizal. Show your papers at the gate.',
      done: { flag: 'story.azzy_met' },
      goals: [{ map: 'ardencia-flats', at: { x: 24, y: 4 } }],
      hints: [
        'The road goes up to the city, Gigi. All of it uphill.',
        'Follow the road north from the black sand, then west to the gate.',
        'Walk up the road to the halberdiers at the gate and show them your papers.',
      ],
    },
    {
      id: 'audience',
      title: 'An audience with the Lord',
      detail: 'Azzy has gone ahead into the Alcázar, at the head of the plaza. Follow him in.',
      done: { flag: 'story.trial_set' },
      goals: [
        { if: { notFlag: 'story.town_seen' }, map: 'ardencia-town', at: { x: 19, y: 7 } },
        { map: 'ardencia-alcazar', at: { x: 16, y: 18 } },
      ],
      hints: [
        'Azzy went into the big red house, Gigi.',
        'The Alcázar is at the top of the plaza.',
        'Go up the plaza and in through the Alcázar\'s doors.',
      ],
    },
    {
      id: 'noon',
      title: 'Until noon',
      detail: 'The trial is at noon tomorrow. Azzy says: see the city. Finish the quests on your Quests page; Azzy waits at the court gate.',
      done: { any: [{ all: [{ flag: 'side.treasurer.done' }, { flag: 'side.bread.done' }, ARD_DEBATE_DONE] }, { flag: 'story.trial_fought' }] },
      followSide: true,
      hints: [
        'Noon is a long way off, Gigi. The city has people who need you first.',
        'Follow the arrow. Your Quests page knows what is left.',
        "The treasurer's daughter in the Alcázar, the bread debate in the Lower Town, and Azzy's bread at night.",
      ],
    },
    {
      id: 'trial',
      title: 'The Trial of Blades',
      detail: 'Noon. Azzy waits at the gate of the duel court, beside the Alcázar. Stand in the ring.',
      done: { flag: 'story.trial_fought' },
      goals: [
        { if: { notFlag: 'story.noon' }, map: 'ardencia-town', at: { x: 28, y: 8 } },
        { map: 'ardencia-town', at: { x: 32, y: 9 } },
      ],
      hints: [
        "It's noon, Gigi. I don't want it to be noon.",
        'Azzy is at the court gate, beside the Alcázar.',
        'Talk to Azzy at the court gate, then walk into the middle of the ring.',
      ],
    },
    {
      id: 'guests',
      title: "The Lord's guests",
      detail: 'Held in the forge fortress, "as guests". There must be a way out of this hall.',
      done: { flag: 'story.forge_open' },
      // A scene the party only watches (Azzy's key): no XP of its own (the level curve, Claude's call Oct 21).
      noXp: true,
      goals: [{ map: 'ardencia-forge', at: { x: 26, y: 9 } }],
      hints: [
        'Gigi... say something.',
        'Someone is coming. Wait.',
        'Wait in the cell. Someone is coming.',
      ],
    },
    {
      id: 'channels',
      title: 'The fire has to go somewhere',
      detail: 'Three channels of lava cross the hall between the cell and the far wall. In the memory, the ditches are dry and the gates turn.',
      done: { all: [{ flag: 'anchor.forge_gate_a' }, { flag: 'anchor.forge_gate_b' }, { flag: 'anchor.forge_gate_c' }] },
      // In the present: the shimmer in the armory. In the memory, where the ditches are dry: the gates one by one,
      // nearest first (the Echo rule, review 1, finding 2).
      goals: [{ map: 'ardencia-forge', at: { x: 21, y: 9 } }],
      echoGoals: [
        { if: { notFlag: 'anchor.forge_gate_a' }, map: 'ardencia-forge', at: { x: 19, y: 7 } },
        { if: { notFlag: 'anchor.forge_gate_b' }, map: 'ardencia-forge', at: { x: 14, y: 7 } },
        { map: 'ardencia-forge', at: { x: 9, y: 7 } },
      ],
      hints: [
        'The fire has to go somewhere. Can you choose where?',
        'In the memory the ditches are dry and the gates turn. Look at where the lava runs now, then change it there.',
        'Set the gates right, left, right in the memory; then pull Benny\'s lever behind the bellows.',
      ],
    },
    {
      id: 'lever',
      title: "Benny's way out",
      detail: 'The far wall is blank. In the memory, young Lord Benny is by the bellows, with something to show Patricio.',
      done: { flag: 'party.azzy' },
      // In the present: the shimmer (or, from a save made after the lever, the hall, where the bell starts). In the
      // memory: the lever behind the bellows, then the shimmer back out.
      goals: [
        { if: { notFlag: 'anchor.benny_lever' }, map: 'ardencia-forge', at: { x: 21, y: 9 } },
        { map: 'ardencia-forge', at: { x: 19, y: 9 } },
      ],
      echoGoals: [
        { if: { notFlag: 'anchor.benny_lever' }, map: 'ardencia-forge', at: { x: 2, y: 4 } },
        { map: 'ardencia-forge', at: { x: 21, y: 9 } },
      ],
      hints: [
        'A wall nobody can open is still a door, Gigi. Grandfather says so.',
        'Lord Benny is by the bellows in the memory, on the far side of the hall.',
        'In the memory, talk to Benny by the bellows, pull the lever behind them, then come back to the present.',
      ],
    },
    {
      id: 'tunnel',
      title: "Benny's tunnel",
      detail: 'The tunnel runs under the wall to the sea road. Something is moving in the dark ahead.',
      done: { flag: 'encounter.ardencia_story.bats.won' },
      goals: [{ map: 'ardencia-tunnel', at: { x: 17, y: 5 } }],
      hints: [
        'It is very dark, Gigi. Hold my hand.',
        'The tunnel goes west, to the sea.',
        'Walk west along the tunnel. Azzy will go first.',
      ],
    },
    {
      id: 'sea_road',
      title: 'The sea road',
      detail: 'Out under the walls, down the sea road to the strand, west.',
      done: { flag: 'story.ardencia_escaped' },
      // The barred mouth first (Amanda lifts the bar as the party comes up to it), then the road.
      goals: [
        { if: { notFlag: 'story.tunnel_unbarred' }, map: 'ardencia-tunnel', at: { x: 4, y: 5 } },
        { map: 'ardencia-flats', at: { x: 5, y: 15 } },
      ],
      hints: [
        'Run, Gigi!',
        'Down the road, away from the wall.',
        'Follow the sea road south from the tunnel mouth.',
      ],
    },
    {
      id: 'camp',
      title: 'Free Brasador',
      detail: 'A fishers\' camp on the strand, west along the shore. Patricio\'s trader is waiting there.',
      done: { flag: 'act3.complete' },
      goals: [{ map: 'ardencia-camp', at: { x: 21, y: 8 } }],
      hints: [
        'Azzy said the camp is west.',
        'The strand road goes west to the camp.',
        'Follow the road west off the sea road to the camp on the strand.',
      ],
    },
  ],
};

/** Samira's three things before dusk: A-1, the debate (joined or mediated) and A-3 (Chapter 4's "Until dusk"). */
const ALD_DAY_DONE = { all: [{ flag: 'side.appraise.done' }, { flag: 'side.sweet_water.done' }, { flag: 'debate.aldoria_bargain.settled' }] };

/**
 * Chapter 4, The Ledger (Al-Doria, Bab al-Dhahab; docs/quest/reviews/2026-10-20-chapter4-outline.md with its review of
 * Oct 21 and the owner's decisions in design/FAMILY.md). The lead (done at Chapter 3's end, so the Journal opens Chapter 4
 * on the strand: the camp is both chapters' map, review 3.5), the voyage, the quay, Samira, the Majlis, the day in the
 * city (two side quests and the debate, followed by the arrow), the guild hall by night, the vault's Echo and its
 * puzzle, the witness's chest, Qasim, the Merchant-Prince's word and the caravan gate.
 */
export const ACT4: QuestDef = {
  id: 'act4',
  title: 'Chapter 4: The Ledger',
  maps: ['ardencia-camp', 'aldoria-quay', 'aldoria-bazaar', 'aldoria-majlis', 'aldoria-ledgers', 'aldoria-vault', 'aldoria-desert'],
  objectives: [
    {
      id: 'lead',
      title: 'The Dorini vault',
      detail: "Benny's Refusal: \"The bankers of Al-Doria, who witnessed it, hold the signed copy.\" The Dorini, in Bab al-Dhahab.",
      done: { flag: 'act3.complete' },
      // Chapter 3's last scene, shown here so the Journal opens Chapter 4 on the strand: it pays no second XP.
      noXp: true,
      goals: [{ map: 'ardencia-camp', at: { x: 21, y: 8 } }],
      hints: ['The paper said the bankers of Al-Doria, Gigi.', "Azzy read it at the fire: the Dorini vault.", 'Sit by the fire with the others. Then the trader.'],
    },
    {
      id: 'sail',
      title: 'Sail for Al-Doria',
      detail: 'The trader who waited for Patricio\'s granddaughter sails at first light. He is down by his boat on the strand.',
      done: { flag: 'story.aldoria_arrived' },
      goals: [{ map: 'ardencia-camp', at: { x: 8, y: 10 } }],
      hints: ['The trader said first light, Gigi. It is first light.', 'He is down by the water, at his boat.', 'Talk to the trader captain by his boat on the strand and tell him to sail.'],
    },
    {
      id: 'quay',
      title: 'Up from the quay',
      detail: 'The quay of the Gate of Gold. The gate up into the bazaar is at the top of the quay; its clerk reads papers.',
      done: { flag: 'story.quay_passed' },
      goals: [{ map: 'aldoria-quay', at: { x: 15, y: 2 } }],
      hints: ['Everyone here is carrying something, Gigi.', 'The way up into the city is the gate at the top of the quay.', 'Walk up the quay to the gate and show the clerk your papers.'],
    },
    {
      id: 'samira',
      title: 'The Grand Bazaar',
      detail: 'Up from the quay, the Grand Bazaar: covered lanes, moneychangers, a price for everything.',
      done: { flag: 'story.samira_met' },
      goals: [{ map: 'aldoria-bazaar', at: { x: 21, y: 29 } }],
      hints: ['So many people, Gigi. Hold my hand.', 'Up the lane from the quay, into the bazaar.', 'Walk up from the quay into the bazaar. Someone is coming to meet you.'],
    },
    {
      id: 'majlis',
      title: 'The Merchant-Prince',
      detail: 'Samira: the signed copy is in the guild vault, and the Merchant-Prince refuses everyone. Ask her anyway, at the Majlis.',
      done: { flag: 'story.vault_refused' },
      goals: [
        { if: { notFlag: 'story.majlis_seen' }, map: 'aldoria-bazaar', at: { x: 22, y: 5 } },
        { map: 'aldoria-majlis', at: { x: 14, y: 7 } },
      ],
      hints: ['Her mother, Gigi. She said "my mother".', 'The Majlis is the big domed hall at the head of the square.', 'Go up the square into the Majlis and walk up the hall to the divan.'],
    },
    {
      id: 'dusk',
      title: 'Until dusk',
      detail: 'Samira will take you down at dusk if you do three things for her first. They are on your Quests page.',
      done: { any: [ALD_DAY_DONE, { flag: 'story.vault_entered' }] },
      followSide: true,
      // Samira on the Majlis steps first: she hands out the three things (the arrow found her stall empty before).
      goals: [{ if: { notFlag: 'story.samira_steps' }, map: 'aldoria-bazaar', at: { x: 22, y: 7 } }],
      hints: [
        'Dusk is a long way off, Gigi. Samira gave us a list.',
        'Follow the arrow. Your Quests page knows what is left.',
        "Samira's three fakes, the priest and the merchant by the fountain, and the children's water.",
      ],
    },
    {
      id: 'door',
      title: 'The guild hall by night',
      detail: "Dusk. Samira waits at the guild hall's green door, west of the square. The doorman has gone to the tea house.",
      done: { flag: 'story.vault_entered' },
      goals: [{ map: 'aldoria-bazaar', at: { x: 12, y: 10 } }],
      hints: ['The lanterns are lit, Gigi.', "The guild hall's green door is on the west side of the square.", 'Talk to Samira at the green door.'],
    },
    {
      id: 'price',
      title: 'The price of the harbour',
      detail: 'The balance door wants a weight, and the ledger page that names it is smudged past reading. The air shimmers.',
      done: { flag: 'story.vault_echo' },
      // The shimmering floor; in the memory, young Yusuf at his desk (the Echo rule, review 1, finding 2).
      goals: [{ map: 'aldoria-vault', at: { x: 10, y: 7 } }],
      echoGoals: [{ map: 'aldoria-vault', at: { x: 10, y: 6 } }],
      hints: ['The door wants a weight. The page says how much, if you can read it.', 'Yusuf wrote this page. In the memory, watch him write it.', 'Press Echo on the shimmering floor and talk to young Yusuf at his desk.'],
    },
    {
      id: 'balance',
      title: 'The balance door',
      detail: 'Yusuf wrote the price of the harbour: twenty-five. Hang the brass weights that make it on the pan.',
      done: { flag: 'story.vault_outer' },
      // Claude's call (Oct 22): the price is the puzzle (read in the memory); once Yusuf has said it, the arrow walks
      // the hooks still wrong for twenty-five (16, 8, 1 on; 4, 2 off), then the pan.
      goals: [
        { if: { notFlag: 'puzzle.vault.w16' }, map: 'aldoria-vault', at: { x: 10, y: 11 } },
        { if: { notFlag: 'puzzle.vault.w8' }, map: 'aldoria-vault', at: { x: 9, y: 11 } },
        { if: { notFlag: 'puzzle.vault.w1' }, map: 'aldoria-vault', at: { x: 6, y: 11 } },
        { if: { flag: 'puzzle.vault.w4' }, map: 'aldoria-vault', at: { x: 8, y: 11 } },
        { if: { flag: 'puzzle.vault.w2' }, map: 'aldoria-vault', at: { x: 7, y: 11 } },
        { map: 'aldoria-vault', at: { x: 12, y: 5 } },
      ],
      // Still in the memory: the shimmer back out (the pan is in the present).
      echoGoals: [{ map: 'aldoria-vault', at: { x: 10, y: 7 } }],
      hints: ['Twenty-five, Gigi. He said it out loud.', 'The weights are 1, 2, 4, 8 and 16. Which ones make twenty-five?', 'Back in the present, hang 16, 8 and 1 on the pan. Leave 4 and 2 on the rack.'],
    },
    {
      id: 'sun',
      title: 'Cut to the sun',
      detail: "The witness's niche at the far end of the strongroom has a lock no key fits. In the memory, the locksmith is still cutting it.",
      done: { flag: 'story.vault_inner' },
      // Cut in the memory (the locksmith's blank), opened in the present.
      goals: [
        { if: { flag: 'anchor.vault_sunlock' }, map: 'aldoria-vault', at: { x: 22, y: 7 } },
        { map: 'aldoria-vault', at: { x: 10, y: 7 } },
      ],
      echoGoals: [
        { if: { notFlag: 'anchor.vault_sunlock' }, map: 'aldoria-vault', at: { x: 22, y: 7 } },
        { map: 'aldoria-vault', at: { x: 10, y: 7 } },
      ],
      hints: ['A key no guildsman holds, Gigi. Who holds it, then?', 'In the memory, the locksmith asks what pattern to cut.', 'In the memory, show the locksmith the Locket\'s sun. Then open the lock in the present.'],
    },
    {
      id: 'ribbons',
      title: 'Seven ribbons',
      detail: "The witness's chest is behind the sun lock. In it, the Dorini copy of the Sun Accord.",
      done: { flag: 'clue.sealed_seventh' },
      goals: [{ map: 'aldoria-vault', at: { x: 24, y: 7 } }],
      hints: ['It\'s open, Gigi.', 'The chest is in the niche, behind the lock.', 'Walk into the niche and open the chest.'],
    },
    {
      id: 'blades',
      title: "The guild's blades",
      detail: 'Guildmaster Qasim came down the stair with the guild\'s blades. One waits at the foot of the stair.',
      done: { flag: 'encounter.aldoria_story.qasim.won' },
      goals: [{ map: 'aldoria-vault', at: { x: 5, y: 3 } }],
      hints: ['They are still on the stair, Gigi.', 'The blade at the foot of the stair is waiting for you.', 'Talk to the blade at the foot of the stair to face Qasim again.'],
    },
    {
      id: 'word',
      title: "The Merchant-Prince's word",
      detail: 'Someone else is coming down the stair.',
      done: { flag: 'story.layla_pass' },
      goals: [{ map: 'aldoria-vault', at: { x: 16, y: 7 } }],
      hints: ['Someone is coming, Gigi.', 'Stay in the strongroom.', 'Wait in the strongroom by the boxes.'],
    },
    {
      id: 'caravan',
      title: 'The caravan gate',
      detail: 'The caravan master leaves at first light from the caravan gate, east through the bazaar. Be on it.',
      done: { flag: 'act4.complete' },
      goals: [
        { if: { notFlag: 'story.vault_left' }, map: 'aldoria-vault', at: { x: 4, y: 1 } },
        { map: 'aldoria-desert', at: { x: 3, y: 12 } },
      ],
      hints: ['First light, Gigi. We cannot miss it.', 'Up the stair, then east through the bazaar to the caravan gate.', 'Walk east out of the bazaar to the caravan gate yard.'],
    },
  ],
};

export const ACT5: QuestDef = {
  id: 'act5',
  title: 'Chapter 5: The Parley',
  maps: ['seat-gateyard', 'seat-concourse', 'seat-hall', 'seat-quarter', 'seat-workshop', 'seat-archive', 'seat-fields'],
  objectives: [
    {
      id: 'road',
      title: 'The Gold Road',
      detail: 'Nine days with the Dorini caravan, west out of the dunes, to Eightgate: the Seat of the realm, where Mother is.',
      done: { flag: 'story.seat_arrived' },
      // Shown, not played: the caravan's arrival is a scene in the gate yard. No XP (review 3.5).
      noXp: true,
      goals: [{ map: 'seat-gateyard', at: { x: 28, y: 10 } }],
      hints: ['We\'re here, Gigi.', 'The caravan is in the Gold Gate\'s yard.', 'Walk into the gate yard.'],
    },
    {
      id: 'herald',
      title: 'The herald',
      detail: 'Grey and violet at the inner arch: the Regent\'s Sealbearers. Everyone who comes to Eightgate is announced.',
      done: { flag: 'story.herald_met' },
      goals: [{ map: 'seat-gateyard', at: { x: 3, y: 10 } }],
      hints: ['The men in grey and violet are watching us, Gigi.', 'The inner arch is on the west side of the yard.', 'Walk west across the yard to the Sealbearers at the inner arch.'],
    },
    {
      id: 'welcome',
      title: "The Regent's welcome",
      detail: 'The herald waits on the Throne Hall\'s steps, at the north of the Concourse. The Lord Regent receives Zetwal\'s envoy\'s household.',
      done: { flag: 'story.elodie_hall' },
      // A scene the player mostly watches (review 3.5): no XP.
      noXp: true,
      goals: [
        { if: { notFlag: 'visited.seat-hall' }, map: 'seat-concourse', at: { x: 23, y: 5 } },
        { map: 'seat-hall', at: { x: 21, y: 14 } },
      ],
      hints: ['Mama is in there, Gigi.', 'The herald is on the steps of the big hall, north of the fountain.', 'Go into the Throne Hall and walk up the nave toward the Throne.'],
    },
    {
      id: 'coco',
      title: 'Tati Coco',
      detail: 'Mother: "Your aunt is in the city. The Envoys\' Quarter, south of the fountain: the door with every colour on it."',
      done: { flag: 'story.coco_plan' },
      goals: [
        { if: { notFlag: 'story.coco_met' }, map: 'seat-quarter', at: { x: 13, y: 7 } },
        { map: 'seat-workshop', at: { x: 10, y: 10 } },
      ],
      hints: ['Tati Coco is here, Gigi!', 'The Envoys\' Quarter is south of the fountain, down the lane.', 'Go south from the fountain into the Quarter, to the painted door.'],
    },
    {
      id: 'bell',
      title: 'Until the bell',
      detail: 'Coco: "Until the bell, be seen. Stand in a lot of places." Three things, on your Quests page.',
      done: { any: [CHAPTER5_QUESTS_DONE, { flag: 'story.disguised' }] },
      followSide: true,
      noXp: true,
      hints: [
        'The bell is tomorrow, Gigi. Coco said be seen.',
        'Follow the arrow. Your Quests page knows what is left.',
        "Yari's petition in the Hall, the four voices at the fountain, and the pilgrims at the gate.",
      ],
    },
    {
      id: 'seamstresses',
      title: 'The seamstresses',
      detail: 'Evening. Coco: "Bed. The bell is early and I am not." At the bell, two seamstresses carry the Keeper\'s robes into the Archive.',
      done: { flag: 'story.archive_entered' },
      goals: [
        { if: { notFlag: 'story.disguised' }, map: 'seat-quarter', at: { x: 18, y: 6 } },
        { if: { notFlag: 'story.archive_open' }, map: 'seat-concourse', at: { x: 9, y: 7 } },
        { map: 'seat-archive', at: { x: 13, y: 17 } },
      ],
      hints: ['Coco said bed, Gigi. Her workshop.', 'In the morning, Coco waits at the Archive\'s chain with the robes.', "Sleep at Coco's workshop, then walk with her to the Archive's chain."],
    },
    {
      id: 'sealing',
      title: 'The sealing',
      detail: 'Six pages under glass, seven ribbons, and the seventh tied to nothing. The air shimmers in front of the table.',
      done: { flag: 'anchor.ribbon_thread' },
      // The thread is tied in the memory: in the present, the shimmer; in it, the red thread off the sealing table,
      // then drawer four (the Echo rule, review 1, finding 2).
      goals: [{ map: 'seat-archive', at: { x: 13, y: 10 } }],
      echoGoals: [
        { if: { notFlag: 'echo.thread' }, map: 'seat-archive', at: { x: 13, y: 7 } },
        { map: 'seat-archive', at: { x: 13, y: 1 } },
      ],
      hints: [
        "Seven ribbons and six pages. Where's the seventh page?",
        "In the memory, watch where the clerk puts it. The labels have changed since, but the cabinet hasn't.",
        'Drawer four. Tie the ribbon thread on it in the memory.',
      ],
    },
    {
      id: 'keeper',
      title: "The keeper's law",
      detail: 'The drawer with the faded thread is locked, and Keeper Hollis has the key. He wants a reason a keeper can keep.',
      done: { flag: 'story.hollis_agreed' },
      goals: [{ map: 'seat-archive', at: { x: 20, y: 10 } }],
      // Still in the memory: the shimmer back out (Hollis is in the present).
      echoGoals: [{ map: 'seat-archive', at: { x: 13, y: 10 } }],
      hints: ['He has the key on his belt, Gigi.', 'He is a keeper of law. Give him law. The Compact is on the shelves.', 'Read The Founding Compact on the shelves, then argue Reason to Hollis.'],
    },
    {
      id: 'reading',
      title: 'Read aloud',
      detail: 'Hollis has the sealed page. The Parley sits at the bell, in the Throne Hall. Mother will have to say it out loud.',
      done: { flag: 'clue.seventh_clause_read' },
      // The Parley is watched (review 3.5): no XP; the terms that follow pay.
      noXp: true,
      goals: [
        { if: { notFlag: 'story.party_rejoined' }, map: 'seat-concourse', at: { x: 23, y: 7 } },
        { map: 'seat-hall', at: { x: 21, y: 28 } },
      ],
      hints: ['The others will be at the steps, Gigi.', 'The Hall. Hollis went in with the page.', 'Go out to the Hall\'s steps, then into the Throne Hall.'],
    },
    {
      id: 'terms',
      title: "The Regent's terms",
      detail: 'The clause is read. The Lord Regent has something to say to Zetwal\'s envoy\'s household.',
      done: { flag: 'story.terms_refused' },
      goals: [{ map: 'seat-hall', at: { x: 21, y: 28 } }],
      hints: ['He is coming down, Gigi.', 'Stay in the Hall.', 'Hear the Regent out in the Throne Hall.'],
    },
    {
      id: 'fitting',
      title: 'The fitting',
      detail: 'Mother has a fitting at her sister\'s. Coco\'s workshop is the one room in Eightgate with no Crown pen in it.',
      done: { flag: 'story.fitting_done' },
      noXp: true,
      goals: [
        { if: { notFlag: 'story.fitting_arrived' }, map: 'seat-quarter', at: { x: 18, y: 6 } },
        { map: 'seat-workshop', at: { x: 10, y: 4 } },
      ],
      hints: ['Mama is going to Coco\'s, Gigi.', "Coco's workshop, in the Envoys' Quarter.", 'Go to the workshop and through the curtain to the fitting room.'],
    },
    {
      id: 'iron_gate',
      title: 'The Iron Gate',
      detail: 'Mother, as the envoy: "If someone were going, they would go east first, up onto the winter plateau." The Iron Gate.',
      done: { flag: 'act5.complete' },
      // A card: no XP.
      noXp: true,
      goals: [
        { if: { notFlag: 'visited.seat-concourse' }, map: 'seat-quarter', at: { x: 12, y: 0 } },
        { map: 'seat-concourse', at: { x: 44, y: 26 } },
      ],
      hints: ['East, Gigi. Mama said east.', "Skarragol's gate is the grey iron one, east on the Concourse.", 'Walk to the Iron Gate on the east side of the Concourse.'],
    },
  ],
};

const SKA_MAPS = ['skarragol-plateau', 'skarragol-fair', 'skarragol-moot', 'skarragol-saga', 'skarragol-quay', 'skarragol-fjord'];
const zoneAt = (i: number, era: 'present' | 'echo' = 'present') => {
  const z = FJORD.zones[i]!;
  // The shimmer's middle tile on its far side: where a player swapping on the way across stands.
  return { map: 'skarragol-fjord', at: { x: z.x + 1, y: era === 'present' ? z.y : z.y + z.h - 1 } };
};

/**
 * Chapter 6, The Stolen Standard (Ordvik, Skarragol; the first road: docs/quest/reviews/2026-10-21-chapter6-outline.md
 * with its second review). The winter road, the fair in uproar, the Moot (Bayarmaa joins under the envoy's bond), the
 * day until the horn (two side quests and the debate, followed by the arrow), the fjord's five swaps, Sarnai's raid,
 * the herd, Grimvald, the ride round at dawn, the horn and the price, the longship.
 */
export const ACT6: QuestDef = {
  id: 'act6',
  title: 'Chapter 6: The Stolen Standard',
  maps: SKA_MAPS,
  objectives: [
    {
      id: 'road',
      title: 'The winter road',
      detail: 'East out of the Iron Gate and up onto the Winter Plateau: Skarragol, the Ironvow, and a standard nobody has.',
      done: { flag: 'story.skarragol_arrived' },
      // The arrival is a scene on landing (no XP).
      noXp: true,
      goals: [{ map: 'skarragol-plateau', at: { x: PLATEAU.spawn.x, y: PLATEAU.spawn.y } }],
      hints: ['It is cold, Gigi.', 'The road goes on west, to the fair.', 'Follow the road down to the fair.'],
    },
    {
      id: 'fair',
      title: 'The Horse-Fair',
      detail: 'Down the road west to Ordvik\'s horse-fair. The Ironvow envoy at Eightgate said: ask Ordvik.',
      done: { flag: 'story.fair_seen' },
      noXp: true,
      goals: [{ map: 'skarragol-fair', at: { x: FAIR.crier.x, y: FAIR.crier.y } }],
      hints: ['There\'s a whole fair down there, Gigi.', 'The road west goes in at the fair\'s east gate.', 'Walk west on the road into the fair, toward the crier.'],
    },
    {
      id: 'moot',
      title: 'The Moot',
      detail: 'The Great Moot Tent in the middle of the field. The council sits at the horn; the chieftain hears envoys before it.',
      done: { flag: 'party.bayarmaa' },
      // In the Moot Tent, the chieftain (from the fair the arrow names the tent's door: engine/guide.ts waypoint).
      goals: [{ map: 'skarragol-moot', at: { x: MOOT.torvald.x, y: MOOT.torvald.y } }],
      hints: ['They took that girl into the big tent, Gigi.', 'The Moot Tent is in the middle of the field, by the empty pole.', 'Go into the Moot Tent and walk up the aisle to the chieftain.'],
    },
    {
      id: 'until_horn',
      title: 'Until the horn',
      detail: 'Torvald: the white coat, the herders at the folds, the traders on the mats. The horn is at first light. Your Quests page.',
      done: { any: [HORN_DAY_DONE, { flag: 'story.fjord_crossed' }] },
      followSide: true,
      noXp: true,
      hints: [
        'The horn is at first light, Gigi. There\'s a day first.',
        'Follow the arrow. Your Quests page knows what is left.',
        'Azzy\'s envoy in white, the herders on the plateau, and the two arguing on the mats.',
      ],
    },
    {
      id: 'set_out',
      title: 'The fjord path',
      detail: 'Dusk. Bayarmaa: the floes go out with the morning tide. The fjord path leaves the fair at its north-east corner.',
      done: { flag: 'story.fjord_set_out' },
      noXp: true,
      goals: [{ map: 'skarragol-fair', at: { x: FAIR.fjordPath.x, y: FAIR.fjordPath.y } }],
      hints: ['It\'s getting dark, Gigi.', 'Bayarmaa keeps looking at the fjord path.', 'Walk to the fjord path at the fair\'s north-east corner.'],
    },
    {
      id: 'crossing',
      title: 'The thin water',
      detail: 'Open water and drifting floes. Some floes shimmer: fifty years ago the fjord was ice there too. Cross on both.',
      done: { flag: 'story.fjord_crossed' },
      // The arrow walks the crossing zone by zone (the reach_zN triggers on the map): in the present, the next floe to
      // swap on or walk to; in the memory, the next ice to walk to or the floe to come back on.
      goals: [
        { if: { flag: 'story.fjord_z5' }, ...zoneAt(4, 'echo') },
        { if: { flag: 'story.fjord_z4' }, ...zoneAt(4) },
        { if: { flag: 'story.fjord_z3' }, ...zoneAt(2, 'echo') },
        { if: { flag: 'story.fjord_z2' }, ...zoneAt(2) },
        zoneAt(0, 'echo'),
      ],
      echoGoals: [
        { if: { flag: 'story.fjord_z5' }, map: 'skarragol-fjord', at: { x: FJORD.zones[5]!.x + 1, y: FJORD.crossedRow } },
        { if: { flag: 'story.fjord_z4' }, ...zoneAt(3) },
        { if: { flag: 'story.fjord_z3' }, ...zoneAt(3, 'echo') },
        { if: { flag: 'story.fjord_z2' }, ...zoneAt(1) },
        zoneAt(1, 'echo'),
      ],
      hints: [
        'The ice was solid once. And the floes are solid now. Use both.',
        'Swap only on the shimmer. When the dark ice is ahead, come back to now.',
        'Cross on five swaps: Echo on the first floe, back on the next, and so on, to the far shore.',
      ],
    },
    {
      id: 'raid',
      title: "Sarnai's raid",
      detail: 'The far shore, fifty years ago: the Crown\'s supply camp, and a herd on the ice where no horse should be.',
      done: { flag: 'clue.herd_whistle' },
      goals: [{ map: 'skarragol-fjord', at: { x: FJORD.zones[5]!.x + 1, y: FJORD.zones[5]!.y } }],
      echoGoals: [{ map: 'skarragol-fjord', at: { x: FJORD.zones[5]!.x + 1, y: FJORD.raidRow } }],
      hints: ['Someone is on the ice in the memory, Gigi.', 'Step onto the far shore\'s floe in the memory.', 'In the memory, walk onto the far shore\'s floe and meet the woman with the whistle.'],
    },
    {
      id: 'herd',
      title: 'Inside the herd',
      detail: 'Grimvald\'s camp: a ring of sledges, two gaps, a lookout at each. A loose herd grazes between the ice and the ring.',
      done: { any: [{ flag: 'story.herd_unseen' }, { flag: 'story.lookouts_beaten' }] },
      goals: [
        { if: { flag: 'story.herd_called' }, map: 'skarragol-fjord', at: { x: FJORD.picket.x, y: FJORD.picket.y } },
        { map: 'skarragol-fjord', at: { x: HERD[3]!.a.x, y: HERD[3]!.a.y } },
      ],
      // Still in the memory: the shimmer back out.
      echoGoals: [{ map: 'skarragol-fjord', at: { x: FJORD.zones[5]!.x + 1, y: FJORD.zones[5]!.y } }],
      hints: [
        'The lookouts are watching the gaps, Gigi. Not the horses.',
        'Sarnai\'s whistle. Low, high, low. The herd walks where the whistle walks.',
        'Whistle at the herd, then again at the picket line inside the ring. Walk in behind the horses.',
      ],
    },
    {
      id: 'standard',
      title: 'The stolen standard',
      detail: 'Grimvald\'s tent at the back of the camp, and his black horse tethered beside it.',
      done: { flag: 'story.grimvald_beaten' },
      goals: [{ map: 'skarragol-fjord', at: { x: FJORD.blackHorse.x, y: FJORD.blackHorse.y } }],
      hints: ['Bayarmaa has her hand on her sabre, Gigi.', 'His tent is behind the inner ring, by the black horse.', 'Go through the inner ring\'s gap to Grimvald\'s tent.'],
    },
    {
      id: 'round',
      title: "Round the fjord's head",
      detail: 'Grimvald\'s horses know the way round the fjord\'s head. The fair\'s fires at dawn.',
      done: { flag: 'story.standard_home' },
      noXp: true,
      goals: [{ map: 'skarragol-fjord', at: { x: FJORD.blackHorse.x, y: FJORD.blackHorse.y } }],
      hints: ['We have it, Gigi.', 'Bayarmaa knows the way round.', 'Talk to Bayarmaa by the tent.'],
    },
    {
      id: 'horn',
      title: 'The horn',
      detail: 'First light. The council stands to vote at the horn. The standard\'s place is the empty pole beside the chieftain\'s seat.',
      done: { flag: 'story.standard_planted' },
      goals: [{ map: 'skarragol-moot', at: { x: MOOT.innerPole.x, y: MOOT.innerPole.y } }],
      hints: ['The horn, Gigi! Hurry!', 'The Moot Tent. The pole by the chieftain\'s seat.', 'Go into the Moot Tent and up the aisle before the vote.'],
    },
    {
      id: 'price',
      title: 'The price of a fleet',
      detail: 'Torvald: the Ironvow ride for whoever pays the blockade\'s cost. Their price is Wealth 10.',
      done: { flag: 'ally.skarragol' },
      goals: [{ map: 'skarragol-moot', at: { x: MOOT.torvald.x, y: MOOT.torvald.y } }],
      hints: ['They want the blockade paid for, Gigi.', 'What we have, we lay on the table.', 'Hear Torvald out and lay down what you can.'],
    },
    {
      id: 'longship',
      title: 'The longship',
      detail: 'Torvald\'s letter for Kuroshi, and a longship at the quay. South along the coast, to Kirinoura.',
      done: { flag: 'act6.complete' },
      noXp: true,
      goals: [{ map: 'skarragol-quay', at: { x: QUAY.ship.x, y: QUAY.ship.y } }],
      hints: ['A boat, Gigi.', 'The quay is up the lane north of the fair.', 'Walk to the longship at the end of the quay\'s pier.'],
    },
  ],
};

const KUR_MAPS = ['kuroshi-pier', 'kuroshi-quarter', 'kuroshi-library', 'kuroshi-hall', 'kuroshi-filehouse', 'kuroshi-fogmaze', 'kuroshi-marsh'];
const fh = (i: number): Goal => ({ map: 'kuroshi-filehouse', at: { ...FILEHOUSE.screens[i]! } });
const fhZone = { map: 'kuroshi-filehouse', at: { x: FILEHOUSE.zone.x, y: FILEHOUSE.zone.y + 1 } };
const mazeZone = { map: 'kuroshi-fogmaze', at: { x: MAZE.zone.x + 1, y: MAZE.zone.y } };
/** Each plaza's south side, where its posts light (the arrow walks the maze plaza by plaza, as it walked the fjord). */
const plazaGate = (i: number): Goal => ({ map: 'kuroshi-fogmaze', at: { x: MAZE.plazas[i]!.x, y: MAZE.plazas[i]!.y + 2 } });
/** The marsh post that still shows the wrong light (the arrow points at it; the player decides the colour). */
const postGoals: Goal[] = MARSH_CODE.map((colour, i) => ({
  if: { notFlag: `marsh.p${i + 1}_${colour}` },
  map: 'kuroshi-marsh',
  at: { ...MARSH.posts[i]! },
}));

/**
 * Chapter 7, The Fog Files (Kirinoura, Kuroshi; the second road: docs/quest/reviews/2026-10-21-chapter7-outline.md with
 * its second review). Into the mist, the letter at the Hall's gate, the day until the lantern hour (K-2 and the debate,
 * followed by the arrow), the lantern hour (Haru joins), Sayo's lanterns and the fog maze, K-3 and the marsh posts on
 * the way, the back door, Sayo's war room and the screens, the spy map, the Paper Fox, the files read with Kayla, the
 * petition, the pier.
 */
export const ACT7: QuestDef = {
  id: 'act7',
  title: 'Chapter 7: The Fog Files',
  maps: KUR_MAPS,
  objectives: [
    {
      id: 'mist',
      title: 'Into the mist',
      detail: 'South from Ordvik on the longship, into the fog, to Kirinoura, where the lanterns are lit at noon.',
      done: { flag: 'story.kuroshi_arrived' },
      noXp: true,
      goals: [{ map: 'kuroshi-pier', at: { ...PIER.spawn } }],
      hints: ['It is so grey, Gigi.', 'There is a stair at the top of the pier.', 'Walk up the pier to the stair.'],
    },
    {
      id: 'announced',
      title: 'Announced',
      detail: 'Torvald\'s letter is for Lady Kaede Suzumori. Her Hall of Screens is across the main bridge.',
      done: { flag: 'story.letter_given' },
      goals: [{ map: 'kuroshi-quarter', at: { x: QUARTER.hallGate.x, y: QUARTER.gateRow } }],
      hints: ['The letter, Gigi. For the lady.', 'The Hall is across the main bridge, at the top of the quarter.', 'Walk to the main bridge in front of the Hall\'s gate.'],
    },
    {
      id: 'lantern',
      title: 'Until the lantern hour',
      detail: 'Kaede hears the letter at the lantern hour. Until then the library\'s clerk, and the keepers on the middle bridge.',
      done: { any: [LANTERN_DAY_DONE, { flag: 'story.haru_met' }] },
      followSide: true,
      noXp: true,
      hints: [
        'The lantern hour is at dusk, Gigi. There is a day first.',
        'Follow the arrow. Your Quests page knows what is left.',
        'The clerk in the Lantern Library, and the two arguing on the middle bridge.',
      ],
    },
    {
      id: 'lantern_hour',
      title: 'The lantern hour',
      detail: 'Dusk. The envoy is called to the Hall of Screens. Up the corridor to Lady Kaede\'s dais.',
      done: { flag: 'story.haru_met' },
      goals: [{ map: 'kuroshi-hall', at: { x: HALL.kaede.x, y: HALL.sceneRow } }],
      hints: ['The lanterns are lit, Gigi.', 'The Hall\'s gate is open now.', 'Go into the Hall of Screens and walk up the corridor to the dais.'],
    },
    {
      id: 'way_in',
      title: "Sayo's way in",
      detail: 'Haru: his grandmother\'s people talked through the fog with lanterns. The maze is past the torii, north-east.',
      done: { flag: 'clue.lantern_code' },
      goals: [mazeZone],
      hints: ['The posts in the maze are dark, Gigi.', 'It\'s shimmering by the maze gate. Someone lit them, once.', 'Stand on the shimmer by the maze gate and use the Locket.'],
    },
    {
      id: 'maze',
      title: 'The fog maze',
      detail: 'Six plazas in the fog, three posts at each. Two white and a red: left. Three white: on. One white, two red: right.',
      done: { flag: 'story.maze_walked' },
      goals: [
        { if: { flag: 'story.maze_j6' }, map: 'kuroshi-fogmaze', at: { x: MAZE.gap.x, y: MAZE.gap.y + 1 } },
        { if: { flag: 'story.maze_j5' }, ...plazaGate(5) },
        { if: { flag: 'story.maze_j4' }, ...plazaGate(4) },
        { if: { flag: 'story.maze_j3' }, ...plazaGate(3) },
        { if: { flag: 'story.maze_j2' }, ...plazaGate(2) },
        { if: { flag: 'story.maze_j1' }, ...plazaGate(1) },
        plazaGate(0),
      ],
      // Still in the memory after the agents: the shimmer back out.
      echoGoals: [mazeZone],
      hints: ['Read the lanterns, Gigi. Left to right.', 'Two white and a red means left. Three white, straight on. One white, two red, right.', 'At each plaza, read the three posts and take that way: left, on, right, right, left, on.'],
    },
    {
      id: 'lanterns',
      title: 'Lanterns for the lost',
      detail: 'The fishers\' boats steer home by the marsh posts: left, then right. The posts are by the huts.',
      done: { flag: 'side.lanterns.done' },
      noXp: true,
      goals: [{ if: { flag: 'story.boats_home' }, map: 'kuroshi-marsh', at: { ...MARSH.oldFisher } }, ...postGoals, { map: 'kuroshi-marsh', at: { ...MARSH.oldFisher } }],
      hints: ['The boats can\'t see the way home, Gigi.', 'Left, then right. You know what left looks like.', 'The fork\'s posts two white and a red; the bend\'s one white and two red.'],
    },
    {
      id: 'back_door',
      title: 'The back door',
      detail: 'The lit posts show a second causeway, east to the signal tower: Sayo\'s way into the file house.',
      done: { flag: 'story.filehouse_entered' },
      goals: [{ map: 'kuroshi-marsh', at: { ...MARSH.tower } }],
      hints: ['There\'s a causeway now, Gigi.', 'East along it, to the tower.', 'Walk the second causeway east to the signal tower\'s door.'],
    },
    {
      id: 'sayo',
      title: "Sayo's war room",
      detail: 'The file house was Lady Sayo\'s war room. Her map hung on the west wall, where it shimmers.',
      done: { flag: 'anchor.screen_peg' },
      goals: [fhZone],
      echoGoals: [{ map: 'kuroshi-filehouse', at: { ...FILEHOUSE.screens[4]! } }],
      hints: ['It\'s shimmering by the wall, Gigi.', 'Sayo said a screen was loose.', 'In the memory, fix the loose screen in the middle of the room.'],
    },
    {
      id: 'screens',
      title: 'The screens',
      detail: 'Pushing a screen turns it and its neighbours. The lanes open when every screen faces north.',
      done: { flag: 'rotor.screens.solved' },
      goals: [
        { if: { notFlag: 'rotor.screens.1.n' }, ...fh(SCREENS_SOLUTION[0]!) },
        { if: { notFlag: 'rotor.screens.5.n' }, ...fh(SCREENS_SOLUTION[1]!) },
        { if: { notFlag: 'rotor.screens.7.n' }, ...fh(SCREENS_SOLUTION[3]!) },
        ...[0, 2, 3, 6, 8].map((i) => ({ if: { notFlag: `rotor.screens.${i}.n` }, ...fh(i) })),
      ],
      echoGoals: [fhZone],
      hints: ['The middle one doesn\'t move now, Gigi.', 'Turn the screens until they all face north.', 'Push the north screen, the east one twice, then the south one.'],
    },
    {
      id: 'spy_map',
      title: "Sayo's map",
      detail: 'The faded square on the west wall, read with Sayo\'s map remembered and Kayla\'s glyphs.',
      done: { flag: 'story.spy_map_read' },
      goals: [{ map: 'kuroshi-filehouse', at: { x: FILEHOUSE.map.x, y: FILEHOUSE.map.y + 1 } }],
      hints: ['The pins, Gigi. Kayla\'s glyphs.', 'Read the wall where the map hung.', 'Read the faded square on the west wall.'],
    },
    {
      id: 'fox',
      title: 'The Paper Fox',
      detail: 'Sayo\'s map marks a floor stone under the north stack. The buyer\'s files are kept there.',
      done: { flag: 'story.fox_beaten' },
      goals: [{ map: 'kuroshi-filehouse', at: { ...FILEHOUSE.stone } }],
      hints: ['Someone is at the north stack, Gigi.', 'The lanes are open. The floor stone.', 'Walk through the lanes to the floor stone under the north stack.'],
    },
    {
      id: 'files',
      title: 'The Fog Files',
      detail: 'Two files in a lacquer box. Kayla reads what nobody else can, at her desk in the Lantern Library.',
      done: { flag: 'clue.buyers_mark' },
      goals: [{ map: 'kuroshi-library', at: { ...LIBRARY.kayla } }],
      hints: ['Titi Kayla will be at her desk, Gigi.', 'The Lantern Library, on the west canal.', 'Take the box to Kayla at her desk in the library.'],
    },
    {
      id: 'petition',
      title: 'The petition',
      detail: 'Dawn. The council hears the petition. Lady Kaede asked for proof the Crown had been inside her file house.',
      done: { flag: 'ally.kuroshi' },
      goals: [{ map: 'kuroshi-hall', at: { x: HALL.kaede.x, y: HALL.sceneRow } }],
      hints: ['The council is sitting, Gigi.', 'The Hall, up the corridor.', 'Go up the Hall\'s corridor to Lady Kaede with the receipts.'],
    },
    {
      id: 'west',
      title: 'West',
      detail: 'A Zetwal trader at the pier, across the bay to Jwaladesh. Haru is coming too.',
      done: { flag: 'act7.complete' },
      noXp: true,
      goals: [{ map: 'kuroshi-pier', at: { x: 13, y: 10 } }],
      hints: ['A boat, Gigi.', 'Down the stair to the pier.', 'Walk down to the end of the pier.'],
    },
  ],
};

/** The chapters in story order (the Journal and the hints use the one whose maps you are on). */
export const CHAPTERS: readonly QuestDef[] = [ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7];

export const JOURNAL_NOTES: readonly JournalNote[] = [
  {
    id: 'locket',
    when: 'item.sun_locket',
    title: 'The Sun Locket',
    text: 'Grandfather made it the year of the Accord. Where the air shimmers, press Echo to step into what the place remembers. Only anchors carry a change back.',
  },
  {
    id: 'night_orders',
    when: 'clue.night_orders',
    title: 'Night orders (Grandfather)',
    text: 'Raise the Chain Bridge to the Temple island at dusk. To lower: turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning.',
  },
  // Changes carried back from the Echo by anchors (the changed object also glows on the way back).
  {
    id: 'changed_night_orders',
    when: 'anchor.night_orders',
    title: 'Something changed',
    text: "Grandfather's night orders are under the loose floorboard by the study window now, where he left them fifty years ago.",
  },
  {
    id: 'changed_chain_bridge',
    when: 'anchor.chain_bridge',
    title: 'Something changed',
    text: 'The Chain Bridge is down in the present: young Patricio pinned the pawl, and it has held for fifty years.',
  },
  // Chapter 2.
  {
    id: 'seventh_clause',
    when: 'clue.seventh_clause',
    title: 'The seventh clause',
    text: "Thorne's Charter rests on \"the seventh clause of the Accord, as signed.\" Nobody in Xaraguá remembers agreeing to it. The first oath was carved in the petroglyph cave.",
  },
  {
    id: 'drum_pattern',
    when: 'clue.drum_pattern',
    title: 'The drum song (cave wall)',
    text: `The petroglyph cave shows the standing stones and the record house, and the areíto's drum song. Bar 1: ${barText(AREITO_BARS[0]!)}. Bar 2: ${barText(AREITO_BARS[1]!)}. Bar 3: worn away.`,
  },
  {
    id: 'drum_full',
    when: 'clue.drum_full',
    title: 'The drum song (the areíto)',
    text: `As the drummers played it on the night of the first oath: ${AREITO_BARS.map((b) => barText(b)).join('; ')}. A long mark is two beats, a short one one.`,
  },
  {
    id: 'changed_cave_sluice',
    when: 'anchor.cave_sluice',
    title: 'Something changed',
    text: 'The petroglyph cave is dry in the present: young Patricio opened the lower sluice, and the spring has drained to the gorge for fifty years.',
  },
  {
    id: 'anaco_taken',
    when: 'story.anaco_taken',
    title: 'The night the Crown came',
    text: 'The night the elders heard the oath, the Crown\'s guns fired on the harbor. Marines took the caney, and a Crown captain led Cacique Anaco away in chains. "Take the girls and go. The cave."',
  },
  {
    id: 'occupied',
    when: 'story.refuge',
    title: 'The occupied city',
    text: 'Curfew at dark. Any Yaguana on the streets goes to the ships. Yari and Anissa hide in the petroglyph cave with the resistance. Under the Accord, no Crown hand may touch Zetwal\'s envoy: Gianna can still walk the city.',
  },
  {
    id: 'anaco_held',
    when: 'story.anaco_found',
    title: 'Where Anaco is held',
    text: 'In the cellar of the Crown Customs House: carried in by the back after midnight (the lamp-oil seller), "snug in the Governor\'s cellar" (the marine at her shutters), and "one guest, native, elderly" in the register (the clerk).',
  },
  {
    id: 'sea_cave_route',
    when: 'clue.sea_cave_route',
    title: 'The gap in the blockade',
    text: 'Anaco: three ships across the harbor mouth and a chain between the two nearest. But at the lowest tide the sea cave on the Canoe Beach opens to the sea, where the canoes slept in his grandmother\'s time.',
  },
  // Chapter 2's side quests (Oct 20).
  {
    id: 'ash_thumbprint',
    when: 'side.oil.done',
    title: 'The ash thumbprint',
    text: 'The oil that comes by canoe after dark is left at the cave mouth on new-moon nights, each jar sealed with a grey thumbprint in ash. The same print is on the hill camp\'s post. "Someone who hates the Crown more than we do. Or loves us more."',
  },
  {
    id: 'changed_hutia_stake',
    when: 'anchor.hutia_stake',
    title: 'Something changed',
    text: 'The old ceiba in the cassava gardens has a low fork now: young Patricio staked it when it was a sapling, and it grew round the stake.',
  },
  {
    id: 'changed_healer_grove',
    when: 'anchor.healer_grove',
    title: 'Something changed',
    text: 'A grove stands behind the rocks at the hill camp: young Patricio planted it where no road would ever go, and no road crew ever cut it.',
  },
  {
    id: 'first_oath',
    when: 'clue.first_oath',
    title: 'The first oath',
    text: '"The harbor stays with the people who fish it. We fight for each other, and no paper of any crown will part us." Sworn by Caona, Patricio and Benny. No seventh clause.',
  },
  // Chapter 3.
  {
    id: 'trial_set',
    when: 'story.trial_set',
    title: 'The Law of the Blade',
    text: 'No outsider is heard by the Lord of Ardencia until she has stood in the ring. The trial is at noon tomorrow, in the duel court beside the Alcázar.',
  },
  {
    id: 'ardencia_record',
    when: 'clue.ardencia_record',
    title: 'The line of Ardencia',
    text: 'The records room keeps the line in a clerk\'s best hand: Alonso, Benny, Rael, Azriel. Under it, in other ink: "No others recorded."',
  },
  {
    id: 'niche',
    when: 'clue.niche',
    title: "Benny's clerk",
    text: 'Every treasurer since Don Alonso kept his working copies in a niche behind the tapestry on the records room\'s east wall.',
  },
  {
    id: 'treasurer_alive',
    when: 'clue.treasurer_alive',
    title: 'The treasurer is alive',
    text: '"I am alive. I am held where the ash falls. Tell her I am alive." In the treasurer\'s own hand, dated this year. Where the ash falls: unknown.',
  },
  {
    id: 'bread_night',
    when: 'clue.bread_night',
    title: 'The ash thumbprint, again',
    text: 'Bread comes to the Lower Town by night in covered carts, and the driver signs the barrels with an ash thumbprint. Yucayeque\'s oil came the same way.',
  },
  {
    id: 'father_rael',
    when: 'clue.father_rael',
    title: "The winner's question",
    text: 'Rael asked who gave her the Locket. His signet and her Locket glowed together. Elodie is his wife; Gianna and Anissa are his daughters; Azzy is their brother.',
  },
  {
    id: 'rael_traitor',
    when: 'belief.rael_traitor',
    title: 'Ardencia stands with the Crown',
    text: 'Rael told the Crown\'s envoy Ardencia stands with the Crown, and gave his daughters to its ship. Gianna: he sold Xaraguá, then he sold us.',
  },
  {
    id: 'free_brasador',
    when: 'ally.free_brasador',
    title: 'Free Brasador',
    text: 'Soldiers who followed Azzy off the wall. Their price, when the realm musters: Fear 6 (owed, paid at the Muster). Lead: Benny\'s Refusal names the Dorini of Al-Doria.',
  },
  // Chapter 4.
  {
    id: 'aldoria',
    when: 'story.quay_passed',
    title: 'The Gate of Gold',
    text: 'Bab al-Dhahab, Al-Doria\'s capital. On the quay, Crown crates under the Charter\'s seal go into the Dorini warehouse: Yucayeque\'s cassava and salt fish.',
  },
  {
    id: 'samira_eye',
    when: 'side.appraise.done',
    title: 'How Samira looks at things',
    text: 'Edges, knots, stamps. A real coin is milled, a real carpet tight, a real weight stamped. "Everything has a price. Most things also have a tell."',
  },
  {
    id: 'coralie',
    when: 'story.coralie_met',
    title: 'Tati Coco',
    text: 'Mother\'s sister Coralie, buying Zetwal indigo for a foreign court in the cloth row. She is sailing for Eightgate to dress the Regent\'s guests for the Parley.',
  },
  {
    id: 'thumb_three',
    when: 'side.sweet_water.done',
    title: 'The ash thumbprint, a third time',
    text: 'Yucayeque\'s oil, Cenizal\'s bread, Bab al-Dhahab\'s water: the same grey thumbprint on the door that gives it. Someone is feeding the realm.',
  },
  {
    id: 'changed_cistern',
    when: 'anchor.cistern_pin',
    title: 'Something changed',
    text: 'The old cistern gate stands pinned open: young Patricio stopped an engineer taking it for the iron. The city line runs, and the square\'s fountain with it.',
  },
  {
    id: 'harbor_price',
    when: 'clue.harbor_price',
    title: 'Twenty-five',
    text: 'Young Yusuf, keeper of the ledger: "The price of the harbour. Twenty-five." A debt unwritten is a debt unpaid; a debt written is at least a debt.',
  },
  {
    id: 'changed_sunlock',
    when: 'anchor.vault_sunlock',
    title: 'Something changed',
    text: 'The witness\'s niche in the Dorini vault: its lock was cut to the Locket\'s sun fifty years ago, at Patricio\'s word. No guildsman holds that key.',
  },
  {
    id: 'sealed_seventh',
    when: 'clue.sealed_seventh',
    title: 'The seventh page',
    text: 'The Dorini copy of the Sun Accord: six pages open, signed. The seventh is sealed with the Throne\'s wax. Only the Throne Archive at Eightgate may break it.',
  },
  {
    id: 'benny_note',
    when: 'item.benny_half_sheet',
    title: "Benny's half-sheet",
    text: '"I will not put my name to this page. B. Rodriguez." Young Benny\'s hand, kept with the witness\'s copy at Yusuf\'s word.',
  },
  {
    id: 'dorini_pass',
    when: 'story.layla_pass',
    title: 'A Dorini caravan',
    text: 'The Merchant-Prince: a witness holds, and the seal is the Throne\'s. A Dorini caravan is not stopped at the eight gates. It leaves at first light.',
  },
  {
    id: 'brasador_coin',
    when: 'clue.brasador_coin',
    title: "Yari's coin",
    text: 'Samira: Brasador mint, three years old, worn in oil and salt. "Someone in Ardencia pays someone in Xaraguá." Gianna: he pays the resistance to sell it.',
  },
  // Chapter 5 (Eightgate).
  {
    id: 'under_crown_eyes',
    when: 'clue.elodie_locket_line',
    title: 'Under Crown eyes',
    text: 'Mother, in the Throne Hall, with the Crown\'s clerk writing: "Believe what your Locket tells you, not what his mouth does."',
  },
  {
    id: 'seven_ribbons',
    when: 'clue.seven_ribbons',
    title: 'Seven drawers, seven ribbons',
    text: 'The Accord under glass: six pages, seven ribbons, the seventh tied to nothing. The Archive\'s cabinet has seven drawers. Only their carved numbers are old.',
  },
  {
    id: 'sealing',
    when: 'story.sealing_seen',
    title: 'The sealing',
    text: 'The Throne\'s clerk read the seventh page to himself and filed it in drawer 4. Benny refused aloud. Grandfather sealed the binding; he said he would remember.',
  },
  {
    id: 'changed_thread',
    when: 'anchor.ribbon_thread',
    title: 'Something changed',
    text: 'A red thread from the seventh ribbon, tied by young Patricio round the handle of drawer 4. The drawers have been moved since. The thread went with it.',
  },
  {
    id: 'seventh_clause_read',
    when: 'clue.seventh_clause_read',
    title: 'The seventh clause',
    text: '"The harbor of Xaraguá and its waters are given into the keeping of the Crown of Aldermoor, at the Crown\'s pleasure, to be revisited." No signature.',
  },
  // Chapter 6 (Ordvik).
  {
    id: 'ironvow_law',
    when: 'story.moot_seen',
    title: 'The Law of the Moot',
    text: 'The Ironvow swear on the standard or not at all. If it stands on its pole when the horn blows, the vote to sell the fleet falls.',
  },
  {
    id: 'sarnai_whistle',
    when: 'clue.herd_whistle',
    title: "Sarnai's whistle",
    text: 'Three notes: low, high, low. The herd walks where the whistle walks, and riders walk inside the herd. "Speed is the only thing the Crown cannot buy."',
  },
  {
    id: 'changed_wolf_run',
    when: 'anchor.wolf_run',
    title: 'Something changed',
    text: 'A boulder wall shuts the wolves\' gully under the plateau: young Patricio rolled it down fifty years ago. It has grass on it now.',
  },
  {
    id: 'thumb_four',
    when: 'side.winter_stores.done',
    title: 'The winter stores',
    text: 'Grain comes to the plateau before the snow, thumbprinted. Yucayeque\'s oil, Cenizal\'s bread, Bab al-Dhahab\'s water, Ordvik\'s grain: the same hand.',
  },
  {
    id: 'crown_pays_raiders',
    when: 'clue.crown_pays_raiders',
    title: 'The Crown pays raiders',
    text: 'In Grimvald\'s tent: Throne gold, and a voucher with no name. "For the recovery of a sacred object, payable on the council\'s vote."',
  },
  {
    id: 'grandson',
    when: 'side.grandson.done',
    title: 'Grandson of the steppe',
    text: 'Azzy\'s mother\'s people are the khatun\'s household of Ironvow\'s eastern clans. They offered riders for his mother\'s name. He answered.',
  },
  {
    id: 'ironvow_fleet',
    when: 'ally.skarragol',
    title: 'The Ironvow fleet',
    text: 'Price: Wealth 10, owed at the Muster. Paid at Ordvik: the purse +3, Samira\'s salt +1, the jarl\'s gold +3, the stores +1. Least paid, first bought.',
  },
  {
    id: 'ironvow_token',
    when: 'item.token_ironvow',
    title: 'Ironvow sits',
    text: 'Torvald cut a braid from the standard for the chamberlain\'s chair: Ironvow will sit with Zetwal at a Claim. A letter for Kuroshi, too.',
  },
  // Chapter 7 (Kirinoura).
  {
    id: 'neutrality_order',
    when: 'story.haru_met',
    title: 'The Neutrality Order',
    text: 'The file house is sealed. No file leaves it, no envoy enters it, no informant is named. It protects the people who tell Kirinoura things.',
  },
  {
    id: 'kayla',
    when: 'story.kayla_met',
    title: 'Kayla',
    text: 'Rael\'s half-sister, a cipher clerk in Kirinoura\'s Lantern Library. She knows what the files say and nothing else, she says.',
  },
  {
    id: 'shelf_rule',
    when: 'clue.shelf_mark',
    title: 'The stacks\' cipher',
    text: 'Sayo\'s clerk, fifty years ago: crane for the Crown, pine for the war, the row for the years. Oldest at the top.',
  },
  {
    id: 'spy_ledger',
    when: 'side.spy_ledger.done',
    title: 'The Ash Wars: account 2 of 4',
    text: 'The Suzumori spy ledger: forty-one Crown marines taken on the Ash Road, nine dead, all nine by the Crown\'s own volleys.',
  },
  {
    id: 'sayo_lanterns',
    when: 'clue.lantern_code',
    title: "Sayo's lanterns",
    text: 'Three posts, read left to right. White, white, red: left. White, white, white: on. White, red, red: right. Never written down.',
  },
  {
    id: 'thumb_five',
    when: 'side.lanterns.done',
    title: 'The marsh press',
    text: 'Oil, bread, water, grain, and now paper: the same grey thumbprint. Kirinoura\'s rebels print what the council says in private.',
  },
  {
    id: 'sayo_network',
    when: 'clue.sayo_network',
    title: "Sayo's network",
    text: 'Lady Sayo pinned every Crown movement of the war to her wall map. Her people died for the slips. "When you win, write them down."',
  },
  {
    id: 'changed_screen_peg',
    when: 'anchor.screen_peg',
    title: 'Something changed',
    text: 'The middle screen in the file house is pegged fast, facing north: young Patricio drove its peg home in Sayo\'s war room.',
  },
  {
    id: 'sayo_map',
    when: 'story.spy_map_read',
    title: "Sayo's map",
    text: 'Kayla\'s glyphs on the pin holes: the north stack, under the stone. The buyer\'s files are kept there.',
  },
  {
    id: 'fox_receipts',
    when: 'clue.fox_receipts',
    title: "The Fox's receipts",
    text: 'Eleven years of copies from the file house, sold to "the Throne\'s observer" in Throne sols, each countersigned in violet.',
  },
  {
    id: 'buyers_mark',
    when: 'clue.buyers_mark',
    title: "The buyer's mark",
    text: 'A Crown buying-list: four prices, every name cut away, a closed hand beside one. The Crown has bought, or will buy, a house.',
  },
  {
    id: 'ardencia_outflows',
    when: 'clue.ardencia_outflows',
    title: 'Gold out of Ardencia',
    text: 'Twenty years of gold out of Ardencia\'s treasury, every season, to places in a cipher no one in Kirinoura holds.',
  },
  {
    id: 'suzumori_network',
    when: 'ally.kuroshi',
    title: 'The Suzumori network',
    text: 'Price: Influence 10, owed at the Muster. Laid on the dais: the receipts, and what was chosen. Least paid, first bought.',
  },
  {
    id: 'suzumori_token',
    when: 'item.token_suzumori',
    title: 'Suzumori sits',
    text: 'Kaede folded a crane from the turned order for the chamberlain\'s chair. Agnipur will not take it. Take it anyway, she said.',
  },
  {
    id: 'in_private',
    when: 'clue.elodie_tested_line',
    title: 'In private',
    text: 'Mother, behind Coco\'s curtain, looking at the pins: "He should never have tested you."',
  },
];
