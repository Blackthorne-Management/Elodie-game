// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';
import { AREITO_BARS, barText } from './rhythms.ts';
import { CHAPTER2_QUESTS_DONE, CHAPTER5_QUESTS_DONE } from './sideQuests.ts';
import { FAIR, FJORD, HERD, HORN_DAY_DONE, MOOT, PLATEAU, QUAY } from './skarragol.ts';
import { FILEHOUSE, HALL, LANTERN_DAY_DONE, LIBRARY, MARSH, MARSH_CODE, MAZE, PIER, QUARTER, SCREENS_SOLUTION } from './kuroshi.ts';
import { BAZAAR, COURT, DAY_DONE, HARBOR, MIRROR_SOLUTION, ROOFTOPS, mirrorFlag } from './jwaladesh.ts';
import { CATHEDRAL, CLOSE, CROSS, DAY_DONE as KINGSMERE_DAY_DONE, HEATH, KEEP, cabinetOf, PACT_DRAWER } from './aldermoor.ts';
import { HARBOR as MUSTER_HARBOR, HALL as MUSTER_HALL, HOUSE, PLAZA, SEATED, TEMPLE } from './muster.ts';
import { BEACH, CAMP, CANEY, SONG, TIDE_READY, VILLAGE } from './war.ts';
import { BELL_READY, CONCOURSE, HALL as THRONE_HALL, ROOMS } from './claim.ts';
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

const JWA_MAPS = ['jwaladesh-harbor', 'jwaladesh-bazaar', 'jwaladesh-rooftops', 'jwaladesh-library', 'jwaladesh-court', 'jwaladesh-saltflats'];
/** The lamp's platform (the chain tower's Echo zone): stand there and press Echo. */
const lampZone: Goal = { map: 'jwaladesh-harbor', at: { x: HARBOR.zone.x + 1, y: HARBOR.zone.y } };
const courtRow: Goal = { map: 'jwaladesh-court', at: { x: COURT.altar.x, y: COURT.sceneRow } };
/** A roof mirror still facing the wrong way (the arrow points at it; the player turns it). */
const mirrorGoals: Goal[] = MIRROR_SOLUTION.map((f, i) => ({
  if: { notFlag: mirrorFlag(i + 1, f as 'e' | 'n' | 'w') },
  map: 'jwaladesh-rooftops',
  at: { ...ROOFTOPS.mirrors[i]! },
}));

/**
 * Chapter 8, The Dying Flame (Agnipur, Jwaladesh; the third road: docs/quest/reviews/2026-10-22-chapter8-outline.md
 * with its second review). Under the chain, the stair and Vikram, Aiyana's roof, the Court at noon and the duel, the
 * day until the night lamp (J-2, J-3 and the debate, followed by the arrow), the chain tower and Arjun's night (the lamp
 * and the mirror carried back), the roofs and Anissa's disc, the flame, Seth Dhanraj, the price at dawn, the quay.
 */
export const ACT8: QuestDef = {
  id: 'act8',
  title: 'Chapter 8: The Dying Flame',
  maps: JWA_MAPS,
  objectives: [
    {
      id: 'chain',
      title: 'Under the chain',
      detail: 'Across the bay from Kirinoura to Agnipur\'s harbor, where a great chain closes the harbor mouth and its lamp is dark.',
      done: { flag: 'story.jwaladesh_arrived' },
      noXp: true,
      goals: [{ map: 'jwaladesh-harbor', at: { ...HARBOR.landing } }],
      hints: ['The lamp on the tower is dark, Gigi.', 'The quay goes up to a stair.', 'Walk up the quay toward the stair.'],
    },
    {
      id: 'stair',
      title: 'Up the harbor stair',
      detail: 'A crowd at the top of the quay, and the sound of two blades. The stair goes up into the Lamp Bazaar.',
      done: { flag: 'story.vikram_seen' },
      goals: [{ map: 'jwaladesh-harbor', at: { x: HARBOR.stair.x, y: HARBOR.sightRow } }],
      hints: ['Somebody is fighting up there, Gigi.', 'The crowd at the top of the quay.', 'Walk up the quay to the crowd by the stair.'],
    },
    {
      id: 'mirrors',
      title: 'The mirrors are down',
      detail: 'The bazaar\'s rooftop mirrors are turned face-down. Somebody on the dyers\' roof is arguing with a bolt.',
      done: { flag: 'story.aiyana_met' },
      goals: [{ map: 'jwaladesh-bazaar', at: { ...BAZAAR.aiyana } }],
      hints: ['Somebody on that roof keeps looking at Azzy, Gigi.', 'The low roof by the dyers has a stair.', 'Go up the dyers\' stair to the woman under the mirror.'],
    },
    {
      id: 'court',
      title: "The Court's one word",
      detail: 'The Court of the Flame sits at noon, at the head of the bazaar. Up the colonnade to Meera\'s seat.',
      done: { flag: 'story.court_heard' },
      goals: [courtRow],
      hints: ['The Court sits at noon, Gigi.', 'The saffron doors at the top of the bazaar.', 'Go into the Court and walk up the colonnade.'],
    },
    {
      id: 'night_lamp',
      title: 'Until the night lamp',
      detail: 'Aiyana opens the chain tower when the watch changes, after dark. Until then: the runners, the sweeping priest, the spice row.',
      done: { any: [DAY_DONE, { flag: 'story.tower_open' }] },
      followSide: true,
      noXp: true,
      hints: [
        'The night lamp is after dark, Gigi. There is a day first.',
        'Follow the arrow. Your Quests page knows what is left.',
        'The runners on the temple steps, the priest with the broom, and the two on the spice row.',
      ],
    },
    {
      id: 'tower',
      title: 'The chain tower',
      detail: 'Night. Aiyana is waiting at the chain tower\'s gate on the quay, with a key nobody has asked her for in two years.',
      done: { flag: 'story.tower_open' },
      goals: [{ map: 'jwaladesh-harbor', at: { x: HARBOR.gate.x, y: HARBOR.gateRow } }],
      hints: ['It\'s dark now, Gigi.', 'Aiyana is at the chain tower, down on the quay.', 'Go down to the quay and walk to the chain tower\'s gate.'],
    },
    {
      id: 'lamp',
      title: "Arjun's lamp",
      detail: 'The lamp\'s platform shimmers. Fifty years ago, Arjun of the Agnivansh stood here the night his riders took the chain.',
      done: { flag: 'anchor.chain_lamp' },
      goals: [lampZone],
      echoGoals: [{ map: 'jwaladesh-harbor', at: { ...HARBOR.lamp } }],
      hints: ['It\'s shimmering by the lamp, Gigi.', 'A lamp lit in the memory stays lit.', 'On the platform, use the Locket; light the lamp with the taper.'],
    },
    {
      id: 'tower_mirror',
      title: "Arjun's mirror",
      detail: 'The temple must see the lamp from the hill. The old watchtower\'s bracket is empty; a spare mirror lies at its foot.',
      done: { flag: 'anchor.tower_mirror' },
      goals: [lampZone],
      echoGoals: [{ if: { notFlag: 'echo.spare_mirror' }, map: 'jwaladesh-harbor', at: { ...HARBOR.spareMirror } }, { map: 'jwaladesh-harbor', at: { ...HARBOR.bracket } }],
      hints: ['The old tower is missing its mirror, Gigi.', 'There is a spare mirror at the tower\'s foot.', 'In the memory, take the spare mirror and bolt it in the bracket.'],
    },
    {
      id: 'roofs',
      title: 'The roofs',
      detail: 'The lamp burns and the tower mirror faces the hill. Up the dyers\' stair and Aiyana\'s ladder to the roofs\' mirrors.',
      done: { flag: 'story.beam_at_temple' },
      goals: [...mirrorGoals, { map: 'jwaladesh-rooftops', at: { x: ROOFTOPS.anissaSpot.x - 2, y: ROOFTOPS.anissaSpot.y } }],
      echoGoals: [lampZone],
      hints: ['Light needs a road too, Gigi.', 'The new tower is in the old line. The runners went round: left, up, up, then in.', 'Turn the roof mirrors: east, north, north. The last one is mine.'],
    },
    {
      id: 'flame',
      title: 'The flame',
      detail: 'The beam goes through the wick-window onto the curtained altar. The Court of the Flame, at night.',
      done: { flag: 'story.flame_seen' },
      goals: [courtRow],
      hints: ['The curtain is glowing, Gigi.', 'The Court, at the head of the bazaar.', 'Go into the Court and walk up the colonnade to the altar.'],
    },
    {
      id: 'oil',
      title: 'The oil',
      detail: 'The flame will not last the night without oil, and the oil is in Seth Dhanraj\'s store on the quay.',
      done: { flag: 'story.dhanraj_beaten' },
      goals: [{ map: 'jwaladesh-harbor', at: { ...HARBOR.storeDoors } }],
      hints: ['Vikram is going to the quay, Gigi.', 'The oil store, on the east of the quay.', 'Go down to the quay and into the oil store\'s doorway.'],
    },
    {
      id: 'keepers',
      title: 'The Flame Keepers',
      detail: 'Dawn. The flame burns on oil, and the Court has a ledger to read. Up the colonnade.',
      done: { flag: 'ally.jwaladesh' },
      goals: [courtRow],
      hints: ['The Court is sitting, Gigi.', 'Up the hill to the Court of the Flame.', 'Go into the Court and walk up the colonnade with the ledger.'],
    },
    {
      id: 'north',
      title: 'North',
      detail: 'A Zetwal trader at the quay, north along the white coast to Aldermoor. Vikram is coming too.',
      done: { flag: 'act8.complete' },
      noXp: true,
      goals: [{ map: 'jwaladesh-harbor', at: { x: HARBOR.landing.x, y: HARBOR.endRow } }],
      hints: ['A boat, Gigi.', 'Down the stair to the quay.', 'Walk down the quay to the trader.'],
    },
  ],
};

const ALD_MAPS = ['aldermoor-heath', 'aldermoor-cross', 'aldermoor-rolls', 'aldermoor-keep', 'aldermoor-close', 'aldermoor-cathedral'];
const keepAt = (x: number, y: number): Goal => ({ map: 'aldermoor-keep', at: { x, y } });
/** The archive's filing floor (the Echo zone of the first revisiting): stand there and press Echo. */
const filingFloor = keepAt(KEEP.zone.x + 5, KEEP.zone.y);
const dockFloor = keepAt(KEEP.dockSpawn.x, KEEP.dockSpawn.y);
const pactCabinet = KEEP.cabinets[cabinetOf(PACT_DRAWER.year) - 1]!;
const cathedralRow: Goal = { map: 'aldermoor-cathedral', at: { x: CATHEDRAL.west.x, y: CATHEDRAL.sceneRow } };

/**
 * Chapter 9, The Regent's Keep (Kingsmere, Aldermoor: docs/quest/reviews/2026-10-22-chapter9-outline.md with its second
 * review). The Mere Stair and the road, the Market Cross and Edmund, the Regent's answer and Jordyn at the door, the
 * close after the bell, the organ and Sebastian, the day until the Toccata (Al-3 and the debate, followed by the arrow),
 * the Toccata, the postern and the archive (the first revisiting, Thomas's panel, the mirror file), caught, the Assize
 * (the dock's roll, the record read, the Hushed unmasked), the price at dawn, home.
 */
export const ACT9: QuestDef = {
  id: 'act9',
  title: "Chapter 9: The Regent's Keep",
  maps: ALD_MAPS,
  objectives: [
    {
      id: 'mere',
      title: 'The Mere Stair',
      detail: 'North along the white coast to Kingsmere, where the Crown keeps its books. The trader will not tie up under a Crown gun.',
      done: { flag: 'story.aldermoor_arrived' },
      noXp: true,
      goals: [{ map: 'aldermoor-heath', at: { ...HEATH.stair } }],
      hints: ['It\'s raining, Gigi.', 'The stair goes up from the water.', 'Walk up the Mere Stair.'],
    },
    {
      id: 'notice',
      title: 'The notice post',
      detail: 'A Crown notice post at the stair\'s head, two bills under a tin hood.',
      done: { flag: 'story.recital_seen' },
      goals: [{ map: 'aldermoor-heath', at: { ...HEATH.notice } }],
      hints: ['There are papers on that post, Gigi.', 'The post at the top of the stair.', 'Read the notice post by the road.'],
    },
    {
      id: 'road',
      title: 'The road, not the heath',
      detail: 'The constables walked ahead to the Moor Gate. The road is safe; the heath is not.',
      done: { flag: 'story.moor_gate' },
      goals: [{ map: 'aldermoor-heath', at: { x: HEATH.gateStrip, y: HEATH.roadRows[0] } }],
      hints: ['The constables are waiting, Gigi.', 'East along the road to the gate.', 'Walk the heath road east to the Moor Gate.'],
    },
    {
      id: 'cross',
      title: 'The Market Cross',
      detail: 'A wet grey square, and a press-gang at the pie shop\'s door.',
      done: { flag: 'story.edmund_met' },
      goals: [{ map: 'aldermoor-cross', at: { x: CROSS.cross.x, y: CROSS.pressRow } }],
      hints: ['Somebody is shouting at a boy, Gigi.', 'The pie shop, on the square.', 'Walk up into the square.'],
    },
    {
      id: 'keep',
      title: "The Regent's answer",
      detail: 'The Regent receives everybody. His keep is at the head of the square.',
      done: { flag: 'story.regent_refused' },
      goals: [keepAt(KEEP.passage.x, KEEP.audienceRow)],
      hints: ['He receives everybody, Edmund says.', 'The keep at the head of the square.', 'Go into the keep and up the great hall.'],
    },
    {
      id: 'close',
      title: 'The close, after the bell',
      detail: 'The captain of the watch said: the close, after the evening bell. Its gate is between the church and the keep.',
      done: { flag: 'story.jordyn_offer' },
      goals: [{ map: 'aldermoor-close', at: { x: CLOSE.offerStrip, y: CLOSE.gate.y } }],
      hints: ['Azzy\'s aunt said the close, Gigi.', 'The gate between the church and the keep.', 'Go through the close gate after the bell.'],
    },
    {
      id: 'organ',
      title: 'The organ',
      detail: 'Someone in St. Agatha\'s is playing very loud, and stopping, and starting again.',
      done: { flag: 'story.sebastian_met' },
      goals: [cathedralRow],
      hints: ['Somebody is playing very loud, Gigi.', 'The church beside the keep.', 'Go into St. Agatha\'s.'],
    },
    {
      id: 'toccata',
      title: 'Until the Toccata',
      detail: 'The loud piece is tomorrow night. Until then: the printer on the heath, the two by the cross.',
      done: { any: [KINGSMERE_DAY_DONE, { flag: 'story.recital_begun' }] },
      followSide: true,
      noXp: true,
      hints: ['The Toccata is tomorrow night, Gigi. There is a day first.', 'Follow the arrow. Your Quests page knows what is left.', 'Edmund\'s tutor on the heath, and the two by the cross.'],
    },
    {
      id: 'recital',
      title: 'The Toccata',
      detail: 'The eve of the Assize. The court walks to St. Agatha\'s, and Uncle Sebastian plays.',
      done: { flag: 'story.recital_begun' },
      goals: [cathedralRow],
      hints: ['The lamps are lit, Gigi.', 'Uncle Sebastian is playing tonight.', 'Go into St. Agatha\'s.'],
    },
    {
      id: 'postern',
      title: 'The postern',
      detail: 'Through the vestry, across the close, through the postern. The Sealbearers\' lamps; the dark side of the hall.',
      done: { flag: 'story.keep_archive_entered' },
      goals: [keepAt(KEEP.archiveDoor.x, KEEP.archiveDoor.y)],
      hints: ['Stay behind the pillars, Gigi.', 'The dark side of the hall, under the north wall.', 'Through the postern, along the north wall to the archive door.'],
    },
    {
      id: 'revisiting',
      title: 'The first revisiting',
      detail: 'The archive\'s floor shimmers. Fifty years ago a young clerk filed the Crown\'s records here.',
      done: { flag: 'anchor.thomas_record' },
      goals: [filingFloor],
      echoGoals: [{ if: { notFlag: 'echo.record_in_hand' }, ...keepAt(KEEP.thomas.x, KEEP.thomas.y) }, keepAt(KEEP.panel.x, KEEP.panel.y)],
      hints: ['The floor is shimmering, Gigi.', 'Somebody hid something here, once.', 'Use the Locket on the floor; give Thomas\'s record a place to hide.'],
    },
    {
      id: 'record',
      title: "Thomas's panel",
      detail: 'The loose panel, behind the Ash Wars shelf. Something was hidden there fifty years ago.',
      done: { flag: 'story.record_found' },
      goals: [{ if: { notFlag: 'side.crown_chronicle.accepted' }, ...keepAt(KEEP.ashShelf.x, KEEP.ashShelf.y) }, keepAt(KEEP.panel.x, KEEP.panel.y)],
      echoGoals: [filingFloor],
      hints: ['A panel nobody can reach, Gigi.', 'The shelf is in the way of it.', 'Lift the chronicle down from the shelf, then open the panel.'],
    },
    {
      id: 'mirror',
      title: 'The mirror file',
      detail: 'The pact is not under its year. Thomas said: they file lies in the mirror.',
      done: { flag: 'clue.crown_pact' },
      goals: [keepAt(pactCabinet.x, pactCabinet.y)],
      hints: ['Even archives lie, Gigi. But they lie neatly.', 'Thomas said lies are filed in the mirror. The minutes give the year.', 'The Accord\'s year reversed: 32, under the red seal.'],
    },
    {
      id: 'out',
      title: 'Out, quietly',
      detail: 'The pact, the record, the chronicle. Out through the hall before the organ stops.',
      done: { flag: 'story.caught' },
      goals: [
        { if: { notFlag: 'side.crown_chronicle.done' }, ...keepAt(KEEP.ashShelf.x + 1, KEEP.ashShelf.y) },
        keepAt(KEEP.archiveDoor.x, KEEP.archiveDoor.y + 1),
      ],
      hints: ['The organ is still playing, Gigi.', 'The chronicle\'s fly-leaf, once more.', 'Read the chronicle again, then out of the archive door.'],
    },
    {
      id: 'assize',
      title: 'The Assize',
      detail: 'A witness who swears falsely falls with her evidence. The clerk keeps the evidence; the dock shimmers.',
      done: { flag: 'story.record_read' },
      goals: [{ if: { notFlag: 'clue.ratification' }, ...dockFloor }, keepAt(KEEP.clerk.x, KEEP.clerk.y)],
      echoGoals: [dockFloor],
      hints: ['The second witness lies, Gigi.', 'The court remembers who was here. Look under the dock.', 'Press the Almoner. Lay the roll, then Thomas\'s record.'],
    },
    {
      id: 'hushed',
      title: 'The Hushed',
      detail: 'The Almoner, forsworn, will not go. "Enough noise."',
      done: { flag: 'story.hushed_beaten' },
      goals: [keepAt(KEEP.dock.x + 1, KEEP.dock.y - 1)],
      hints: ['Plain blows still land, Gigi.', 'Edmund holds them. Guard when the court goes quiet.', 'Step to the dock\'s gate and face her again.'],
    },
    {
      id: 'price',
      title: 'The price',
      detail: 'Dawn on the Mere Stair. The dissidents are coming down the road.',
      done: { flag: 'ally.aldermoor_dissidents' },
      goals: [{ map: 'aldermoor-heath', at: { x: HEATH.stair.x + 1, y: HEATH.stair.y } }],
      hints: ['People are coming down the road, Gigi.', 'At the stair.', 'Wait on the Mere Stair.'],
    },
    {
      id: 'home',
      title: 'Home',
      detail: 'The Zetwal trader at the stair, south and then east, home. The fleet sails after the Assize.',
      done: { flag: 'act9.complete' },
      noXp: true,
      goals: [{ map: 'aldermoor-heath', at: { x: HEATH.boardX, y: HEATH.stair.y } }],
      hints: ['The boat, Gigi.', 'Down the stair.', 'Step down to the trader\'s boat.'],
    },
  ],
};


const plazaAt = (x: number, y: number): Goal => ({ map: 'zetwal-town', at: { x, y } });
/** The paving's west edge, by the lane up from the harbor (the camp's scene starts on any step onto the paving). */
const pavingStep = plazaAt(10, 11);
/** The paving's north edge, below the steps down from Accord Square (the watch walks up from the harbor lane). */
const pavingFromSteps = plazaAt(18, 5);
const speaker: Goal = { map: 'zetwal-hall', at: { ...MUSTER_HALL.speaker } };

/**
 * Chapter 10, The Muster (Pòdlimyè, Zetwal again: docs/quest/reviews/2026-10-22-chapter10-outline.md with its second
 * review). The long pier and the whistle given back, the camp on the plaza (Joaquin brings Azzy's company), the council
 * at noon (the Chancellor's condition), the watch walks up (Jordyn, Rahel, Patricia), two grandmothers in the kitchen,
 * Patricia's blessing at the lamp, the Marshal's answer at the stone, until the allies are seated (the three feuds, Z-6
 * and Z-3, followed by the arrow), the council's word and the chain, the whistle at dusk, under the point by night, the
 * tide.
 */
export const ACT10: QuestDef = {
  id: 'act10',
  title: 'Chapter 10: The Muster',
  // Only the maps Chapter 1 also lists, and the mill (the Old Harbor, the Heights and the archive belong to no chapter:
  // the Journal follows the latest begun there, so Chapters 1 to 3 keep theirs).
  maps: ['zetwal-town', 'zetwal-house', 'zetwal-temple', 'zetwal-hall', 'zetwal-road', 'zetwal-market', 'zetwal-square', 'zetwal-mill'],
  objectives: [
    {
      id: 'pier',
      title: 'The long pier',
      detail: 'Home to Pòdlimyè, and the Old Harbor full of hulls that are not Zetwal\'s.',
      done: { flag: 'story.pier_met' },
      goals: [{ map: 'zetwal-harbor', at: { ...MUSTER_HARBOR.landing } }],
      hints: ['The harbor\'s full, Gigi.', 'Grandmother and Grandfather are on the pier.', 'Walk up the long pier.'],
    },
    {
      id: 'camp',
      title: 'The camp on the plaza',
      detail: 'The Festival Plaza is a camp. Seven kinds of soldier, and Tío Joaquin by the fountain.',
      done: { flag: 'story.plaza_camp_seen' },
      goals: [pavingStep],
      hints: ['There are drums on the plaza, Gigi.', 'Up from the harbor, along the shore.', 'Walk onto the plaza\'s paving.'],
    },
    {
      id: 'council',
      title: 'The council at noon',
      detail: 'The council sits at noon in the Hall of the Accord. The Chancellor waits for the envoy\'s answer.',
      done: { flag: 'story.council_condition' },
      goals: [speaker],
      hints: ['The council sits at noon, Gigi.', 'Up the steps, into the Hall, the Council Chamber on the left.', 'Talk to the Speaker in the Council Chamber.'],
    },
    {
      id: 'watch',
      title: 'The watch lands',
      detail: 'Titi Jordyn said she would be at the Muster, and bring her mother, and her mother\'s mother.',
      done: { flag: 'story.watch_landed' },
      goals: [pavingFromSteps],
      hints: ['Somebody\'s coming up from the harbor, Gigi.', 'Back down to the plaza.', 'Walk onto the plaza\'s paving.'],
    },
    {
      id: 'kitchen',
      title: 'Two grandmothers',
      detail: 'Rahel said she would come to Grandmother\'s house. There are things one says in a kitchen.',
      done: { flag: 'story.rahel_met' },
      goals: [{ map: 'zetwal-house', at: { ...HOUSE.door } }],
      hints: ['Grandmother will have laid the table, Gigi.', 'Home, on the north-west side of the plaza.', 'Go into our house.'],
    },
    {
      id: 'blessing',
      title: 'The lamp',
      detail: 'Patricia went over to the Temple island to look at the Gaze lamp. She asked for the three of you.',
      done: { flag: 'story.blessing' },
      goals: [{ map: 'zetwal-temple', at: { ...TEMPLE.patricia } }],
      hints: ['She asked for us, Gigi.', 'Over the Chain Bridge, into the temple.', 'Talk to Patricia, by the Gaze lamp.'],
    },
    {
      id: 'stone',
      title: 'The Marshal\'s answer',
      detail: 'Grandfather is at the Marshal\'s stone, on the plaza. You carry Thomas\'s true record, and the court\'s roll.',
      done: { flag: 'story.patricio_told' },
      goals: [plazaAt(PLAZA.patricioStone.x, PLAZA.patricioStone.y)],
      hints: ['Grandfather\'s by his stone, Gigi.', 'The Marshal\'s stone, on the plaza\'s west side.', 'Talk to Grandfather at the stone.'],
    },
    {
      id: 'seated',
      title: 'Until the allies are seated',
      detail: 'The Chancellor\'s condition: the three feuds seated, and the Cane Road the city\'s again. Then the council votes.',
      done: { any: [SEATED, { flag: 'story.council_voted' }] },
      followSide: true,
      noXp: true,
      hints: ['Three feuds and a road, Gigi.', 'Follow the arrow. Your Quests page knows what is left.', 'The Iron Market, the Gaze lamp, Accord Square, and the Cane Road.'],
    },
    {
      id: 'vote',
      title: 'The council\'s word',
      detail: 'The city is seated. The Speaker will call the vote.',
      done: { flag: 'story.council_voted' },
      goals: [speaker],
      hints: ['The council is waiting, Gigi.', 'Up to the Hall.', 'Talk to the Speaker in the Council Chamber.'],
    },
    {
      id: 'whistle',
      title: 'The Marshal\'s whistle',
      detail: 'Dusk. Seven companies in lines on the plaza, and Grandfather at the stage\'s foot with the whistle.',
      done: { flag: 'story.inspection_done' },
      goals: [plazaAt(PLAZA.stageFoot.x, PLAZA.stageFoot.y)],
      hints: ['Grandfather\'s at the stage, Gigi.', 'Your Journal shows who is least paid. You can still give the Ironvow and the Agnivansh gold.', 'Talk to Grandfather at the stage\'s foot.'],
    },
    {
      id: 'night',
      title: 'Under the point',
      detail: 'Night. A captain left his fire with a satchel, and went down to the Old Harbor.',
      done: { flag: 'story.betrayal_seen' },
      goals: [
        { if: { notFlag: 'story.betrayer_walked' }, ...pavingFromSteps },
        { map: 'zetwal-harbor', at: { x: MUSTER_HARBOR.quayStrip.x, y: MUSTER_HARBOR.roadRow } },
      ],
      hints: ['He walked like he knew where he was going, Gigi.', 'Down to the Old Harbor.', 'Follow him to the quay, west along the harbor road.'],
    },
    {
      id: 'tide',
      title: 'The tide',
      detail: 'Dawn. The fleet is warped out, waiting. The trader takes the envoy\'s household at its head.',
      done: { flag: 'act10.complete' },
      noXp: true,
      goals: [{ map: 'zetwal-harbor', at: { x: MUSTER_HARBOR.tide.x, y: MUSTER_HARBOR.tide.y } }],
      hints: ['The ships are waiting, Gigi.', 'The long pier.', 'Walk down the long pier.'],
    },
  ],
};

const XARAGUA_MAPS = ['xaragua-village', 'xaragua-plaza', 'xaragua-beach', 'xaragua-conuco', 'xaragua-mountain', 'xaragua-camp', 'xaragua-caney', 'xaragua-song', 'xaragua-customs', 'xaragua-cave', 'xaragua-cellar', 'xaragua-record', 'xaragua-seacave'];
const beach = (x: number, y: number): Goal => ({ map: 'xaragua-beach', at: { x, y } });
const village = (x: number, y: number): Goal => ({ map: 'xaragua-village', at: { x, y } });

/**
 * Chapter 11, The War of the Harbor (Yucayeque, Xaraguá again: docs/quest/reviews/2026-10-22-chapter11-outline.md with
 * every fix of its second review, and the owner's decision of Oct 22: on Strike, Azzy stays). The landing on the Canoe
 * Beach, the gun on the headland (stage one), the flank (the betrayer, or the house that stayed), the hill camp, until
 * the tide (the elders' debate, The Ninth Thumbprint, Harbors Lie, followed by the arrow), the conch, the village by
 * dusk, the customs house (stage two: Thorne), Anaco in the cellar, Caona's stand and the chain (stage three: the Echo
 * battle and the anchor), the Harbor Turn, the pier's end (Hale with Rael beside her, or Rael), the truth and the Ash
 * Road read, the Song House, the Regent's retreat. Every step pays XP_PER_OBJECTIVE_BY_CHAPTER[10] but the gate and the
 * card.
 */
export const ACT11: QuestDef = {
  id: 'act11',
  title: 'Chapter 11: The War of the Harbor',
  maps: XARAGUA_MAPS,
  objectives: [
    {
      id: 'landed',
      title: 'The strait at first light',
      detail: 'The fleet cannot pass the chain across the harbor mouth. It lands on the Canoe Beach, as the escape left it.',
      done: { flag: 'story.landed' },
      goals: [beach(BEACH.landing.x, BEACH.landing.y)],
      hints: ['The fire on the hill, Gigi. That\'s them.', 'We\'re on the Canoe Beach.', 'Walk up the sand.'],
    },
    {
      id: 'headland',
      title: 'The gun on the headland',
      detail: 'A Crown field gun on the headland rock covers the beach and the gardens\' road. Nothing goes up the hill until it is quiet.',
      done: { flag: 'story.headland_won' },
      goals: [beach(BEACH.headlandStep.x, 11)],
      hints: ['The gun, Gigi. It covers the whole beach.', 'East along the sand, to the headland\'s foot.', 'Walk east along the sand to the gun\'s crew.'],
    },
    {
      id: 'flank',
      title: 'Sails behind us',
      detail: 'Great-grandmother Patricia said to count them at dusk, because harbors lie. Haru is counting now.',
      done: { flag: 'war.flank_done' },
      goals: [{ if: { notFlag: 'story.flank_seen' }, ...beach(BEACH.flankStep.x, 11) }, beach(BEACH.captain.x, BEACH.captain.y)],
      hints: ['Haru is looking back at the fleet, Gigi.', 'Back west along the sand.', 'Walk back west along the beach.'],
    },
    {
      id: 'camp',
      title: 'The hill camp',
      detail: 'The resistance is back on the hill. The gardens\' road climbs off the beach\'s north edge, round behind the village, and the Mountain Path goes on above it.',
      done: { flag: 'story.camp_reached' },
      // The gardens' road is a long walk, not a door (data/dialogue/xaraguaWar.ts hill_road_north): the arrow points at it first.
      goals: [
        { if: { notFlag: 'story.hill_road_taken' }, ...beach(BEACH.northDoor.x, BEACH.northDoor.y + 1) },
        { map: 'xaragua-camp', at: { x: CAMP.gate.x, y: CAMP.gate.y } },
      ],
      hints: ['The camp leader went up the hill, Gigi.', 'North off the beach, through the gardens, up the mountain.', 'Up the gardens\' road and the Mountain Path to the hill camp.'],
    },
    {
      id: 'until_tide',
      title: 'Until the tide',
      detail: 'The assault goes at the lowest tide, at dusk. Before then: the elders must agree, the canoes need powder, and someone must count the ships.',
      done: { any: [TIDE_READY, { flag: 'story.tide_called' }] },
      followSide: true,
      noXp: true,
      hints: ['The elders are still arguing, Gigi. Yari could stop them.', 'Your Quests page, Gigi.', 'The fire, the lookout over the sea, and the cave mouth in the gardens.'],
    },
    {
      id: 'tide',
      title: 'The tide',
      detail: 'Everything is ready. The head runner has the conch on the camp\'s rock, and waits for the word.',
      done: { flag: 'story.tide_called' },
      goals: [{ map: 'xaragua-camp', at: { x: CAMP.headRunner.x, y: CAMP.headRunner.y } }],
      hints: ['It\'s nearly dusk, Gigi.', 'The rock at the camp\'s north end.', 'Talk to the head runner with the conch.'],
    },
    {
      id: 'village',
      title: 'The village by dusk',
      detail: 'Down the mountain and through the gardens, into the Harbor Village by its west trail, with the companies behind.',
      done: { flag: 'story.village_reached' },
      goals: [village(VILLAGE.westDoor.x, VILLAGE.westDoor.y)],
      hints: ['The conch has gone, Gigi.', 'Down the mountain, through the gardens.', 'Into the Harbor Village by the gardens\' trail.'],
    },
    {
      id: 'customs',
      title: 'The customs house',
      detail: 'Governor Thorne is at his desk in the customs house, and the cellar is behind him.',
      done: { flag: 'story.thorne_taken' },
      goals: [{ map: 'xaragua-customs', at: { x: 10, y: 3 } }],
      hints: ['The Governor is still at his desk, Gigi.', 'The stone house with the Crown\'s flag.', 'Talk to Governor Thorne in the customs house.'],
    },
    {
      id: 'anaco',
      title: 'Anaco',
      detail: 'The cacique is in the cellar under the customs house. Yari is already at the stairs.',
      done: { flag: 'story.anaco_freed' },
      goals: [{ map: 'xaragua-cellar', at: { x: 6, y: 6 } }],
      hints: ['Yari won\'t wait, Gigi.', 'The cellar stairs, behind the clerks\' desks.', 'Down the cellar stairs.'],
    },
    {
      id: 'pier',
      title: 'Caona\'s stand',
      detail: 'The Crown\'s chain is made fast to the old post at the pier\'s sea end, and the marines hold it. The pier head\'s boards shimmer.',
      done: { flag: 'story.chain_dropped' },
      goals: [village(VILLAGE.pierZone.x, VILLAGE.pierZone.y)],
      echoGoals: [
        { if: { notFlag: 'encounter.war_story.caona.won' }, ...village(VILLAGE.echoCaona.x, VILLAGE.echoCaona.y) },
        { if: { notFlag: 'anchor.chain_post' }, ...village(VILLAGE.capstan.x, VILLAGE.capstan.y) },
        village(VILLAGE.pierZone.x, VILLAGE.pierZone.y),
      ],
      hints: ['The chain\'s tied to the old post, Gigi. It looks like the bridge\'s winch.', 'Grandfather was on this pier with Caona. The boards shimmer.', 'In the memory, pull the pin out of the capstan\'s pawl. Then come back and watch the chain.'],
    },
    {
      id: 'turn',
      title: 'The Harbor Turn',
      detail: 'The chain is down and the mouth is open. Something is coming round the north point.',
      done: { flag: 'war.turn_made' },
      goals: [village(VILLAGE.turnStep.x, VILLAGE.turnStep.y)],
      hints: ['Gigi. The sails.', 'Down the pier.', 'Walk down the pier.'],
    },
    {
      id: 'pier_end',
      title: 'The pier\'s end',
      detail: 'Whatever was decided on the pier, it is not finished.',
      done: { flag: 'story.harbor_taken' },
      goals: [village(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y)],
      hints: ['Gigi...', 'The pier\'s end.', 'Talk to whoever waits at the pier\'s end.'],
    },
    {
      id: 'truth',
      title: 'The truth',
      detail: 'Rael is waiting on the pier, by lamplight. He has not asked to be forgiven.',
      done: { flag: 'clue.ash_road_read' },
      goals: [village(VILLAGE.pierEnd.x, VILLAGE.pierEnd.y)],
      hints: ['He\'s still on the pier, Gigi.', 'The pier\'s end.', 'Talk to Rael.'],
    },
    {
      id: 'song',
      title: 'The Song House',
      detail: 'The wounded of seven companies are being carried up to the Song House on the Areíto Plaza.',
      done: { flag: 'story.wounded_sheltered' },
      goals: [{ map: 'xaragua-song', at: { ...SONG.arrive } }],
      hints: ['They\'re carrying them up the hill, Gigi.', 'The Areíto Plaza, through the village\'s north trail.', 'Into the Song House, west of the plaza.'],
    },
    {
      id: 'caney',
      title: 'The Regent\'s retreat',
      detail: 'The cacique is back in his duho. The elders and the captains are in the caney.',
      done: { flag: 'act11.complete' },
      noXp: true,
      goals: [{ map: 'xaragua-caney', at: { ...CANEY.doors } }],
      hints: ['They\'re waiting for us, Gigi.', 'The caney, at the head of the plaza.', 'Into the Caney of Anaco.'],
    },
  ],
};

// ---- Chapter 12, the Claim, and the Epilogue, the Hearing (Eightgate again; data/claim.ts) ---------------------------------

const CLAIM_MAPS = ['seat-gateyard', 'seat-concourse', 'seat-hall', 'seat-quarter', 'seat-workshop', 'seat-archive', 'seat-fields', 'seat-rooms'];
const concourse = (p: { x: number; y: number }): Goal => ({ map: 'seat-concourse', at: { x: p.x, y: p.y } });
const hall = (p: { x: number; y: number }): Goal => ({ map: 'seat-hall', at: { x: p.x, y: p.y } });

export const ACT12: QuestDef = {
  id: 'act12',
  title: 'Chapter 12: The Claim',
  maps: CLAIM_MAPS,
  objectives: [
    {
      id: 'ash_road',
      title: 'The Ash Road',
      detail: 'North to Ardencia\'s strand, three days south on the Ash Road, and in at Eightgate\'s Ardencia Gate at dusk.',
      done: { flag: 'story.claim_arrived' },
      noXp: true,
      goals: [concourse(CONCOURSE.elodieStop)],
      hints: ['Mama\'s at the gate, Gigi.', 'In the gate\'s arch.', 'Walk into the Ardencia Gate\'s arch.'],
    },
    {
      id: 'rooms',
      title: 'Mother\'s rooms',
      detail: 'Mother said: not here. Her rooms, in the Crown\'s wing of the Envoys\' Quarter, when you have seen the city.',
      done: { flag: 'story.elodie_rooms' },
      goals: [{ map: 'seat-rooms', at: { x: ROOMS.elodieMeet.x, y: ROOMS.elodieMeet.y } }],
      hints: ['Mama said her rooms, Gigi.', 'South, through the Envoys\' Quarter.', 'The Crown\'s wing in the Quarter: the door with the clerk outside it.'],
    },
    {
      id: 'until_bell',
      title: 'Until the bell',
      detail: 'The Regent receives Zetwal\'s envoy at the bell. Before then: the houses\' tokens to the Master of the Chairs, the corner by the fountain, and Grandmother\'s book.',
      done: { any: [BELL_READY, { flag: 'story.bell_claim' }] },
      followSide: true,
      noXp: true,
      hints: ['The man with the lantern is waiting for the tokens, Gigi.', 'Your Quests page, Gigi.', 'The Hall\'s steps, the fountain, and Mama\'s shelf.'],
    },
    {
      id: 'bell',
      title: 'The bell',
      detail: 'The tokens are handed over, the corner has spoken, and the book is in the bag. The Master of the Chairs waits on the Hall\'s steps for the word.',
      done: { flag: 'story.bell_claim' },
      goals: [concourse(CONCOURSE.chamberlain)],
      hints: ['It\'s nearly dawn, Gigi.', 'The Hall\'s steps.', 'Tell the Master of the Chairs: at the bell.'],
    },
    {
      id: 'chair',
      title: 'The eighth chair',
      detail: 'The floor by Xaraguá\'s chair is shimmering. Anissa can hold the door.',
      done: { flag: 'story.chair_read' },
      goals: [hall({ x: THRONE_HALL.echoZone.x + 1, y: THRONE_HALL.echoZone.y + 1 })],
      echoGoals: [
        { if: { all: [{ flag: 'story.chair_echo_seen' }, { notFlag: 'anchor.caona_chair' }] }, ...hall(THRONE_HALL.echoXaraguaChair) },
        hall({ x: THRONE_HALL.echoZone.x + 1, y: THRONE_HALL.echoZone.y + 1 }),
      ],
      hints: ['There\'s something at the foot of Yari\'s chair, Gigi. The floor\'s shimmering.', 'In the memory, Grandfather is in this Hall with Caona. She wants something written. The plan on the table says where.', 'In the memory, cut the oath into the chair by the door the masons are bricking up. Then come back and turn it.'],
    },
    {
      id: 'filed',
      title: 'Filed with the clause',
      detail: 'Keeper Hollis has come up from the Archive with something filed with the seventh clause.',
      done: { flag: 'clue.petition_original' },
      goals: [hall({ x: THRONE_HALL.echoZone.x + 1, y: THRONE_HALL.echoZone.y + 1 })],
      hints: ['Keeper Hollis is coming, Gigi.', 'By Yari\'s chair.', 'Wait by the eighth chair.'],
    },
    {
      id: 'count',
      title: 'The count',
      detail: 'The Master of the Chairs is at the rope\'s end with the register. A claimant is counted before she stands.',
      done: { flag: 'story.claim_counted' },
      goals: [hall(THRONE_HALL.chamberlain)],
      hints: ['The man with the register is waiting, Gigi.', 'The rope\'s end, by the dais.', 'Talk to the Master of the Chairs.'],
    },
    {
      id: 'claim',
      title: 'The Claim',
      detail: 'The rope is down. The Throne tile is on the dais. A claimant goes up alone.',
      done: { flag: 'story.claim_won' },
      goals: [hall(THRONE_HALL.tile)],
      hints: ['It\'s yours to stand on, Gigi.', 'Up the dais.', 'Walk onto the Throne tile.'],
    },
    {
      id: 'rael',
      title: 'Rael',
      detail: 'Someone is coming up the nave.',
      done: { flag: 'story.hearing_called' },
      noXp: true,
      goals: [hall(THRONE_HALL.tile)],
      hints: ['Gigi...', 'The nave.', 'Watch the nave.'],
    },
  ],
};

export const EPILOGUE: QuestDef = {
  id: 'epilogue',
  title: 'Epilogue: The Hearing',
  maps: CLAIM_MAPS,
  objectives: [
    {
      id: 'arrivals',
      title: 'Nine days later',
      detail: 'The witnesses were sent for. They are coming in at their gates.',
      done: { flag: 'story.hearing_arrived' },
      noXp: true,
      goals: [concourse(CONCOURSE.hearingMorning)],
      hints: ['They\'re coming, Gigi.', 'The Concourse.', 'Wait in front of the Hall.'],
    },
    {
      id: 'hearing',
      title: 'The Hearing',
      detail: 'The Hall hears Lord Rael Rodriguez of Ardencia. A Hearing is not a trial: witnesses speak, the accused answers each, the Throne decides.',
      done: { flag: 'story.hearing_heard' },
      noXp: true,
      goals: [hall(THRONE_HALL.step)],
      hints: ['Gigi, the Hall.', 'The dais\'s step.', 'The Hall.'],
    },
    {
      id: 'verdict',
      title: 'The verdict',
      detail: 'The Throne decides. The Master of the Chairs is waiting for the word.',
      done: { flag: 'hearing.verdict' },
      noXp: true,
      goals: [hall(THRONE_HALL.chamberlain)],
      hints: ['He\'s waiting for you, Gigi.', 'The Master of the Chairs.', 'Talk to the Master of the Chairs: the Throne decides.'],
    },
    {
      id: 'throne',
      title: 'The Throne',
      detail: 'That afternoon, in the Hall.',
      done: { flag: 'story.ending_seen' },
      noXp: true,
      goals: [hall(THRONE_HALL.afternoon)],
      hints: ['Gigi.', 'The Hall.', 'The Hall.'],
    },
  ],
};

/** The chapters in story order (the Journal and the hints use the one whose maps you are on). */
export const CHAPTERS: readonly QuestDef[] = [ACT1, ACT2, ACT3, ACT4, ACT5, ACT6, ACT7, ACT8, ACT9, ACT10, ACT11, ACT12, EPILOGUE];

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
  // Chapter 9, Kingsmere.
  {
    id: 'first_revisiting',
    when: 'clue.first_revisiting',
    title: 'The first revisiting',
    text: 'The Crown meant to keep the harbor from the day it sealed. "To be revisited" means when they choose. Thomas wrote the true record anyway.',
  },
  {
    id: 'changed_thomas_record',
    when: 'anchor.thomas_record',
    title: 'Something changed',
    text: 'Thomas Stillwater\'s true record lies behind the archive\'s loose panel: young Patricio leaned on it, fifty years ago.',
  },
  {
    id: 'mirror_file',
    when: 'clue.crown_pact',
    title: 'The mirror file',
    text: 'The Accord\'s year reversed, under the house the lie is about: 32, red. The pact, and the Ash Road Accounts in a cipher Haru cannot read yet.',
  },
  {
    id: 'the_roll',
    when: 'clue.ratification',
    title: 'The roll',
    text: 'The roll of the court the day the seventh clause was ratified: Xaraguá not present. Not sent for. Xaraguá was not in that court.',
  },
  {
    id: 'thumb_eight',
    when: 'clue.list_leaked',
    title: 'The ash thumbprint (8 of 9)',
    text: 'The purge list, leaked from inside the Quiet Crown with the grey thumb on its cover: "Warn them first." Eight of nine.',
  },
  {
    id: 'four_accounts_three',
    when: 'side.crown_chronicle.done',
    title: 'The four accounts: three read',
    text: 'The temple record, the spy ledger and now the Crown Chronicle, written to order. The fourth is Grandmother\'s.',
  },
  {
    id: 'hushed_commission',
    when: 'clue.hushed_regent',
    title: "The Almoner's commission",
    text: '"To the Crown\'s almoner, the keeping of the quiet." Under the Throne\'s seal, with no hand. The Crown disowns any almoner.',
  },
  {
    id: 'stillwater_dissidents',
    when: 'ally.aldermoor_dissidents',
    title: 'The Stillwater dissidents',
    text: 'Price: Fear 8, owed at the Muster. They are the Crown\'s own people: no chair at Eightgate, no token for the chamberlain.',
  },
  {
    id: 'jordyn',
    when: 'story.jordyn_offer',
    title: 'Titi Jordyn',
    text: 'Rahel\'s daughter, Azzy\'s aunt: captain of the Regent\'s watch. She does not defect for family. She keeps the law.',
  },
  {
    id: 'sebastian',
    when: 'story.sebastian_met',
    title: 'Uncle Sebastian',
    text: 'Mummy\'s brother, organist to three courts. He plays the Agatha Toccata on the eve of the Assize, very loud, at the hour we need.',
  },
  // Chapter 8, Agnipur.
  {
    id: 'relay',
    when: 'side.lamp_relay.done',
    title: 'The relay',
    text: 'Harbor to temple before it gutters: left at the dyers, through the arch, along the wall. The sea-wall lane is the same idea.',
  },
  {
    id: 'thumb_seven',
    when: 'story.salt_road_cleared',
    title: 'The salt-road carter',
    text: 'Oil for the wick from nobody, with the ash thumbprint on the seal. Seven of nine. The temple will not say it needs it.',
  },
  {
    id: 'arjun_charge',
    when: 'clue.arjun_charge',
    title: "Arjun's charge",
    text: 'The night the Crown held Agnipur behind its own chain: two hands on the taper, a mirror bolted, seven rode out, five came home.',
  },
  {
    id: 'changed_chain_lamp',
    when: 'anchor.chain_lamp',
    title: 'Something changed',
    text: 'The chain lamp burns over Agnipur\'s harbor: young Patricio lit it with Arjun\'s hand closed over his, fifty years ago.',
  },
  {
    id: 'changed_tower_mirror',
    when: 'anchor.tower_mirror',
    title: 'Something changed',
    text: 'A bronze mirror sits in the old watchtower\'s bracket, faced at the temple quarter: young Patricio bolted it there.',
  },
  {
    id: 'crown_holds_oil',
    when: 'clue.crown_holds_oil',
    title: 'The ledger of advances',
    text: 'Every jar in the harbor bought with advances from the Throne\'s purchasing office, Kingsmere. "Hold until the Court signs for the chain."',
  },
  {
    id: 'flame_keepers',
    when: 'ally.jwaladesh',
    title: 'The Flame Keepers',
    text: 'Price: Wealth 8, owed at the Muster. Laid at the altar\'s foot: the oil, and what was chosen. Least paid, first bought.',
  },
  {
    id: 'agnivansh_token',
    when: 'item.token_agnivansh',
    title: 'Agnivansh sits',
    text: 'Meera lit a small brass lamp from the flame for the chamberlain\'s chair. The Suzumori crane sat on her altar for one night.',
  },
  {
    id: 'aiyana',
    when: 'story.aiyana_met',
    title: 'Titi Aiyana',
    text: 'Kayla\'s sister, Azzy\'s aunt: the Court\'s engineer of the great flame. She measures the flame every morning, and is the only one allowed to.',
  },
  {
    id: 'in_private',
    when: 'clue.elodie_tested_line',
    title: 'In private',
    text: 'Mother, behind Coco\'s curtain, looking at the pins: "He should never have tested you."',
  },
  // Chapter 10, the Muster.
  {
    id: 'whistle_lent',
    when: 'story.whistle_lent',
    title: "The Marshal's whistle",
    text: 'Given back to Grandfather for the day, on the long pier: "Then it\'s yours again. For today."',
  },
  {
    id: 'council_condition',
    when: 'story.council_condition',
    title: "The Chancellor's condition",
    text: 'Seat the feuds (the Ironvow and the Dorini, the Suzumori and the Agnivansh, Kingsmere\'s people), and clear the Cane Road. Then the council votes.',
  },
  {
    id: 'dorini_marines',
    when: 'story.plaza_camp_seen',
    title: 'The Dorini marines',
    text: 'Forty marines and an invoice. Price: Influence 10, owed at the Muster (the admiral: "Kirinoura\'s files say you paid it in books."). Least paid, first bought.',
  },
  {
    id: 'four_accounts',
    when: 'clue.four_accounts',
    title: 'The four accounts',
    text: 'The temple\'s record, the Suzumori ledger, Grandmother\'s Volume Two: forty dead at the ford. The Crown\'s chronicle: four hundred, written to order. Read the true one aloud at the Hearing.',
  },
  {
    id: 'patricio_answer',
    when: 'story.patricio_told',
    title: "The Marshal's answer",
    text: 'Six pages, counted and sealed. The seventh was read to the Crown\'s clerk in the next room. "Leave it blank. Blank is honest."',
  },
  {
    id: 'smugglers_ledger',
    when: 'item.smugglers_ledger',
    title: 'Muskets in the cane',
    text: 'Crown muskets for "the Muster\'s friends", under the closed hand, and a house\'s sigil drawn in the margin. The second cache is under the mill.',
  },
  ...(['skarragol', 'kuroshi', 'jwaladesh', 'al_doria'] as const).map((h) => ({
    id: `ledger_sigil_${h}`,
    when: `muster.betrayer.${h}`,
    title: "The ledger's sigil",
    text: `The sigil in the smugglers' margin is ${{ skarragol: 'a horse-tail standard: the Ironvow', kuroshi: 'a grey paper lantern: the Suzumori', jwaladesh: 'a brass lamp: the Agnivansh', al_doria: 'a green pennant: the Dorini' }[h]}.`,
  })),
  {
    id: 'changed_mill_bar',
    when: 'anchor.mill_bar',
    title: 'Something changed',
    text: 'The inner door under the mill is barred and pinned: young Patricio dropped the powder-master\'s bar fifty years ago. The cache is shut in.',
  },
  {
    id: 'signing_morning',
    when: 'clue.signing_morning',
    title: 'The morning of the signing',
    text: 'Fifty years ago two armies stood on the plaza and signed six clauses. Today seven stand on it, and the seventh page is in Gianna\'s bag.',
  },
  {
    id: 'lonely_cutter',
    when: 'side.lonely_cutter.done',
    title: 'The lonely cutter',
    text: 'Ti Jak waited at the mill for the veiled woman. His mother was Odile, a cutter; somebody keeps her name. He went home.',
  },
  {
    id: 'under_the_point',
    when: 'story.betrayal_seen',
    title: 'Under the point',
    text: 'The Crown bought a captain at a free harbor, in the dark, with the muskets already in the cane. A closed hand on his satchel. "It will be quieter soon."',
  },
  {
    id: 'muster_turned',
    when: 'muster.turned',
    title: 'Turned',
    text: 'The house sails with the envoy; its captain sits in the Hall\'s cell. Jordyn arrested him by the book.',
  },
  {
    id: 'muster_betrayed',
    when: 'muster.betrayed',
    title: 'Sailed to the Crown',
    text: 'The captain stepped into the Crown\'s launch, and his company went down to its ship in the dark. They will be on the Crown\'s side of the harbor.',
  },
  {
    id: 'dorini_token',
    when: 'item.token_dorini',
    title: 'The Dorini sit',
    text: 'The admiral gave a green seal for the chamberlain\'s chair: "The guild sits when the guild is paid."',
  },
  // Chapter 11, the War of the Harbor.
  {
    id: 'war_fleet',
    when: 'story.landed',
    title: 'The fleet',
    text: 'One volley for every ten soldiers at sea. Before each fight the whistle asks how many: three at most. A volley wounds; it never fells.',
  },
  {
    id: 'harbors_lie',
    when: 'side.harbors_lie.done',
    title: 'Harbors lie',
    text: 'Eleven Crown hulls, the Patience in the middle with the chain from her bow. Four black sails off the north point, counted and not explained.',
  },
  {
    id: 'thumb_nine',
    when: 'side.ninth_thumbprint.done',
    title: 'The ash thumbprint (9 of 9)',
    text: 'Nine doors. Nine thumbprints. The last one was powder for a harbor, left by a man in a black coat who did not want to be thanked.',
  },
  {
    id: 'caona_stand',
    when: 'anchor.chain_post',
    title: 'Caona\'s stand',
    text: 'Caona held this pier so two armies could land. Then the Marshal pulled the chain post\'s pin and dropped it in the harbor. Fifty years later it is the third\'s turn.',
  },
  {
    id: 'ash_road_read',
    when: 'clue.ash_road_read',
    title: 'The Ash Road, read',
    text: 'The Locket and the signet together lit the page. The columns are nine doors: the oil, the bread, the water, the grain, the paper, a bakery, the wick, a list, the powder.',
  },
  {
    id: 'song_house',
    when: 'story.wounded_sheltered',
    title: 'The Song House',
    text: 'The wounded of seven companies in hamacas between the song-keepers\' posts. Old Benny counted them in. Anissa held the lamp.',
  },
  // Chapter 12, the Claim, and the Hearing.
  {
    id: 'eighth_chair',
    when: 'story.chair_read',
    title: 'The eighth chair',
    text: 'Caona said the oath in this Hall forty-nine years ago and nobody wrote it down. Grandfather did. It is on the chair.',
  },
  {
    id: 'filed',
    when: 'clue.petition_original',
    title: 'Filed with the clause',
    text: 'Xaraguá\'s own Petition of Breach was filed with the seventh clause, under the page. Keeper Hollis found it. It is on the eighth chair.',
  },
  {
    id: 'count',
    when: 'story.claim_counted',
    title: 'The count',
    text: 'Nine of the realm\'s regard across the three pillars, and two in each. Counted as Jean-Philippe, by Mother, and Rodriguez, by Father.',
  },
  {
    id: 'heard',
    when: 'clue.petition_heard',
    title: 'Heard',
    text: 'Forty-nine years late, every chair answered Xaraguá\'s petition. The seventh clause was never agreed.',
  },
  {
    id: 'stability',
    when: 'stability.score',
    title: 'The Accord\'s Stability',
    text: '{stability.score} of 100, as the realm stood when the Throne decided.',
  },
];
