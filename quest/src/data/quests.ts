// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';
import { AREITO_BARS, barText } from './rhythms.ts';

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
      hints: [
        'Someone came across the water. I saw a canoe.',
        'The dock is at the south end of the island.',
        'Go south from the temple to the dock and talk to whoever came.',
      ],
    },
    // The Envoy's Papers (owner decision, Oct 15: one task at the Hall of the Accord in Chapter 1).
    {
      id: 'papers',
      title: "The envoy's papers",
      detail: "The Crown boards every boat at Xaraguá. Ask the clerk at the Hall of the Accord, up the steps at the head of the plaza, for envoy papers.",
      done: { flag: 'story.envoy_papers' },
      hints: [
        'Yari said we need papers, Gigi. The Hall writes them.',
        "The Hall of the Accord is up the steps at the head of the plaza. The clerk needs Mother's seal; the engraver in the Iron Market has it.",
        'Clerk, then the engraver in the Iron Market (west of the plaza), then the clerk again, then the Chancellor\'s office off the gallery.',
      ],
    },
    // The first battle is not optional (owner decision, Oct 16): Yari will not sail until the boar is beaten.
    {
      id: 'boar',
      title: 'The boar on the Cane Road',
      detail: 'A boar is charging the cane cutters on the Cane Road, past the east gate. Yari will not sail until it is dealt with.',
      done: { flag: 'encounter.wilds.boar.won' },
      hints: [
        "Yari won't leave the cane cutters with that boar, Gigi. Neither will I.",
        'The Cane Road is past the east gate, at the end of the road south-east of the plaza.',
        'Go out through the east gate onto the Cane Road and walk east into the cane. The boar will find us.',
      ],
    },
    {
      id: 'depart',
      title: 'Before the tide',
      detail: "Yari's canoe waits at the island dock. Finish your work in Pòdlimyè (your Quests page lists it), then go to the canoe and sail.",
      done: { flag: 'act1.complete' },
      hints: [
        "Yari's canoe is at the island dock. Are we going soon, Gigi?",
        'Finish your errands in the city first if you like. Then go to the canoe at the dock.',
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
      hints: [
        'A Governor wants to see you, Gigi. That sounds bad and important.',
        'The customs house is the stone one by the harbor, with the red roof.',
        'Down in the village, go into the Crown Customs House. Thorne is in his office.',
      ],
    },
    {
      id: 'lamp',
      title: 'A light for the cave',
      detail: 'The first oath was carved in the petroglyph cave in the cassava gardens, and the cave is dark. Find a lamp.',
      done: { flag: 'item.oil_lamp' },
      hints: [
        'The keepers said the oath was carved in a cave. It is dark in caves, Gigi.',
        'Everyone in the village buys lamp oil from the same seller. She stands by the customs house.',
        'Talk to the lamp-oil seller beside the Crown Customs House in the Harbor Village.',
      ],
    },
    {
      id: 'cave',
      title: 'What the stones remember',
      detail: 'The petroglyph cave is under the rocks in the cassava gardens, west of the village. Its carved chamber is flooded.',
      done: { flag: 'clue.drum_pattern' },
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
      hints: [
        'Anaco said the cave, Gigi. The one we drained.',
        'Down through the plaza to the village, then west to the cassava gardens.',
        'Go down to the Harbor Village, take the trail west to the gardens, and into the petroglyph cave.',
      ],
    },
    {
      id: 'held',
      title: 'Where is Anaco held?',
      detail: 'The Crown holds Yucayeque. Only Gianna, Zetwal\'s envoy, can walk the streets. Find out where they keep the cacique.',
      done: { flag: 'story.anaco_found' },
      hints: [
        'Someone in the city has seen where they took him.',
        'The marines talk. So do the people they are guarding.',
        'Ask the lamp-oil seller in the village, read the clerk\'s register in the customs house, and listen to the marine at the caney doors (show your papers at the checkpoint).',
      ],
    },
    {
      id: 'visit',
      title: 'The envoy\'s visit',
      detail: 'Anaco is in the customs house cellar, with his fever. The healer in the cave wants him to have fever bark. An envoy may visit a prisoner: make Thorne say yes.',
      done: { flag: 'story.anaco_visited' },
      hints: [
        'The healer in the cave knows what his fever needs.',
        'Fever bark grows on the tree by the spring pond in the cassava gardens. Then ask Thorne, as the envoy.',
        'Get fever bark from the tree east of the gardens\' pond, ask Thorne for the visit, and take the cellar stairs to Anaco.',
      ],
    },
    {
      id: 'word',
      title: 'Word to the cave',
      detail: 'Anaco told Gianna the one gap in the Crown\'s blockade. Carry it to Yari and the resistance in the petroglyph cave.',
      done: { flag: 'story.escape_planned' },
      hints: [
        'Yari will want to hear every word her father said.',
        'The resistance is in the petroglyph cave, in the cassava gardens.',
        'Go back to the petroglyph cave and tell Yari what Anaco said.',
      ],
    },
    {
      id: 'blockade',
      title: 'Through the blockade',
      detail: 'At the lowest tide the sea cave on the Canoe Beach opens to the sea. Get Yari out past the Crown\'s ships.',
      done: { flag: 'story.escaped' },
      hints: [
        'The tide, Gigi. Everything is the tide here.',
        'The sea cave is at the east end of the Canoe Beach.',
        'Meet Yari at the sea cave on the Canoe Beach at low tide.',
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
    text: 'In the cellar of the Crown Customs House: carried in by the back after midnight (the lamp-oil seller), "one guest, native, elderly" in the register (the clerk), and the marines\' talk at the caney.',
  },
  {
    id: 'sea_cave_route',
    when: 'clue.sea_cave_route',
    title: 'The gap in the blockade',
    text: 'Anaco: three ships across the harbor mouth and a chain between the two nearest. But at the lowest tide the sea cave on the Canoe Beach opens to the sea, where the canoes slept in his grandmother\'s time.',
  },
  {
    id: 'first_oath',
    when: 'clue.first_oath',
    title: 'The first oath',
    text: '"The harbor stays with the people who fish it. We fight for each other, and no paper of any crown will part us." Sworn by Caona, Patricio and Benny. No seventh clause.',
  },
];
