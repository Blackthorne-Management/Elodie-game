// Chapter 1, The Festival of the Gaze (Zetwal; the guide's Act I, 5.5; owner decision Oct 14: the story is
// told in chapters). The id and flags keep the old `act1` name so saves stay valid. the objectives the Journal lists, in order, with Anissa's hints for each
// (guide 6.2 rule 4: from a nudge to the answer), and the notes the Journal keeps.

import type { JournalNote, QuestDef } from '../engine/quests.ts';

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
      detail: 'Yari waits at the dock. Finish your work in Pòdlimyè (your Quests page lists it), then tell her you are ready to sail.',
      done: { flag: 'act1.complete' },
      hints: [
        'Yari is waiting at the dock. Are we going soon, Gigi?',
        'Finish your errands in the city first if you like. Then talk to Yari at the dock.',
        'Go to the dock south of the temple and tell Yari you are ready.',
      ],
    },
  ],
};

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
];
