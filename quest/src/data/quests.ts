// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';
import { AREITO_BARS, barText } from './rhythms.ts';
import { CHAPTER2_QUESTS_DONE } from './sideQuests.ts';

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

/** The chapters in story order (the Journal and the hints use the one whose maps you are on). */
export const CHAPTERS: readonly QuestDef[] = [ACT1, ACT2];

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
];
