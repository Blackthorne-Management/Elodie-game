// Act I, Zetwal: the festival of Elodie's Gaze, Elodie's departure, the Sun Locket, the first Echo in
// Patricio's war room, the Chain Bridge, Anissa's light, and Yari's warning. Flags drive the story:
// `story.*` progress, `item.*` things carried, `clue.*` facts in the Journal, `echo.*` memory-only
// state (wiped on return), `anchor.*` changes the memory carries into the present.
//
// Tone (owner brief): serious with light comic touches; no jokes in Anissa's scenes.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import {
  ECHO_STONECUTTER,
  EAST_WAY,
  MOURNER_LISTENS,
  ORDINALS,
  PLINTH_STEP,
  READER_SPOTS,
  READING_ORDER,
  WEST_WAY,
  Z4,
} from '../seventhStone.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

/** A spoken line. */
function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

/** Narration (no name tag, even inside a node that has a speaker). */
function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

function script(id: string, nodes: Record<string, DialogueNode>, start = 'start'): DialogueScript {
  return { id, start, nodes };
}

/** A script with a single node of lines. */
function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return script(id, { start: { lines, set } });
}

/** A scene that plays once: it shows nothing once `flag` is set (and sets it). */
function once(id: string, flag: string, lines: DialogueLine[]): DialogueScript {
  return script(id, {
    start: { lines: [], next: [{ if: { notFlag: flag }, to: 'scene' }] },
    scene: { set: { [flag]: true }, lines },
  });
}

const G = 'gianna';
const A = 'anissa';

/**
 * Where the cane cutter stands (decision A, Oct 19): on the Cane Road before the lamp, at the name stones on
 * the Temple island after it (he crossed to hear the names read), and back on the road once Gianna comes home
 * from Xaraguá (zetwal-road.ts and zetwal-temple.ts place him; data/sideQuests.ts points the arrows there).
 */
const CUTTER_AT_STONES: Condition = { all: [{ flag: 'story.anissa_woke' }, { notFlag: 'story.zetwal_return' }] };

/** A Name in the Cane, step 1: Gianna reads the name stones (alone, or beside the cutter). */
const STONES_READ: DialogueLine[] = [
  { speaker: '', text: 'Gianna reads every stone. Soldiers, scouts, a drummer, a cook. No cutter called Grann.' },
  { speaker: '', text: 'At the bottom, one line is carved for all of them: "And the cutters of the Cane Road, whose names the Crown did not keep."' },
  { speaker: 'gianna', text: 'The Locket shows what a place remembers. Maybe the road remembers her.' },
  { speaker: '', text: '(Look for shimmering air on the Cane Road, by the east gate.)' },
];
const AF = 'anissa_far';
const P = 'patricio';
const Y = 'yari';

/**
 * Flags only saves from before Batch D (Oct 19) carry: nothing sets them any more, but the conversations still
 * read them so a save made mid-errand finishes (tests/content.test.ts knows them).
 */
export const OLD_SAVE_FLAGS: readonly string[] = [
  // The Hall clerk sent Gianna to the engraver in the Iron Market for the seal (he brings it to the Hall now).
  'story.papers_asked',
];

// ---- Z-4 The Seventh Stone (secret side quest, Chapter 1; SIDE-QUESTS.md Z-4, SECRET-ITEMS.md 1, PUZZLES.md S-ZET) ----
// The mourner on the Temple island gives it after the lamp. The first Reading of the Names plays in the temple's memory;
// Patricio carves a sun into the blank seventh stone with the chisel the stonecutter left (the anchor); in the present
// the stones touched in the reading's order, ending on the seventh, open the drawer under Solange's plinth. No fighting.
// Anissa's hints (PUZZLES.md S-ZET) come at the plinth and after wrong stones (side quests have no hint timer: the
// answer waits for five wrong stones, as SECRET-ITEMS.md has the third hint wait).

const MOURNER = 'mourner';
/** The memory's people at the first reading (looks and speakers by the same ids). */
const SOLANGE = 'echo_solange';
const SCOUT = 'echo_caona_scout';
const CUTTER = 'echo_stonecutter';

/** The temple's memory plays the first reading while the quest is open and the seventh stone is still blank. */
const Z4_READING: Condition = { all: [{ flag: Z4.accepted }, { notFlag: Z4.anchor }, { notFlag: Z4.done }] };

const Z4_HINTS = [
  'The stones sound like voices, Gigi. Like someone saying names.',
  'Grandfather was here at the very first reading, Gigi. The grove remembers it. Watch who goes where, in order.',
  'Carve the last stone in the memory, then touch them in the order they spoke: 3, 1, 5, 2, 6, 4, then the seventh.',
];

/** Each stone's voice (its chime is `stone_<n>` in audio.config.ts). */
const STONE_NOTES: readonly string[] = ['', 'high and bright', 'clear and ringing', 'low and warm', 'soft, like a hum', 'bright and rising', 'deep and slow', 'clear and new'];

const MOURNER_Z4: Record<string, DialogueNode> = {
  z4_offer: {
    speaker: MOURNER,
    lines: [
      { text: 'I said his name, and everyone heard it. Thank you.' },
      { text: 'Touch a name stone and it sings, did you know? Six of them do. The seventh is blank, and it has never made a sound.' },
      { text: 'Mother Solange cut a riddle into the plinth for it. Fifty years, and nobody has ever answered it.' },
    ],
    choices: [
      { text: "I'll try to answer it.", next: 'z4_accept' },
      { text: 'Some other night.', next: 'z4_later' },
    ],
  },
  z4_later: { speaker: MOURNER, lines: [{ text: 'It has waited fifty years. It can wait for you.' }] },
  z4_accept: {
    speaker: MOURNER,
    set: { [Z4.accepted]: true },
    lines: [
      { text: 'Then listen to them first. They are counted sunwise from the plinth\'s right hand. My husband\'s is the third.' },
      nar('(The Seventh Stone is in the Quests page of the menu.)'),
    ],
  },
  z4_remind: {
    speaker: MOURNER,
    lines: [
      { if: { notFlag: Z4.anchor }, text: 'Six voices and a silence. The seventh is still blank.' },
      { if: { flag: Z4.anchor }, text: 'There is a sun on the seventh stone. I have sat by it every year, and I never saw a sun.' },
    ],
  },
  z4_sung: { speaker: MOURNER, lines: [{ text: 'Seven voices. I sat here an hour tonight and listened to all of them.' }] },
};

/** One reader comes in, walks up to a stone and says a name over it; the stone chimes. */
function reader(n: number, look: string, from: { x: number; y: number }, name: string, extra: StageCue[] = []): DialogueLine {
  const spot = READER_SPOTS[n]!;
  return {
    speaker: look,
    text: name,
    fx: `stone_${n}`,
    stage: [...extra, { do: 'enter', actor: `reader_${n}`, look, from, to: spot.at, facing: spot.facing }, { do: 'look', actor: `reader_${n}` }],
  };
}
const leaves = (n: number, to: { x: number; y: number }): StageCue => ({ do: 'exit', actor: `reader_${n}`, to, async: true });

const READING_Z4: Record<string, DialogueNode> = {
  z4_reading: {
    lines: [
      nar('Lanterns hang from the scaffolding. Mother Solange stands by the new plinth with a list, and seven new stones wait.', {
        stage: [
          { do: 'place', actor: 'stonecutter', look: CUTTER, at: ECHO_STONECUTTER, facing: 'down' },
          { do: 'look', actor: `npc:${SOLANGE}` },
        ],
      }),
      say(SOLANGE, 'The first reading of the names. Come up one at a time, and say the name you carried here.'),
      reader(3, 'echo_elder_f', WEST_WAY, 'Marie-Lourdes Cadet. She cooked for the whole camp, and never once sat down to eat.'),
      reader(1, 'echo_drummer', EAST_WAY, 'Jean-Fils Beauvais. He drummed us through the cane at night, so we could find each other.', [leaves(3, WEST_WAY)]),
      reader(5, 'echo_elder_m', WEST_WAY, 'Rosalie Jeune, my sister. A scout. She always went ahead.', [leaves(1, EAST_WAY)]),
      // Two readers come up together and cross on the way (the design's muddle): the one from the west speaks first.
      reader(2, 'echo_soldier', WEST_WAY, 'Dieudonné Lafortune. He carried the flag up the bridge road and did not come down.', [
        leaves(5, WEST_WAY),
        { do: 'enter', actor: 'reader_6', look: 'echo_cook', from: EAST_WAY, to: READER_SPOTS[6]!.at, facing: READER_SPOTS[6]!.facing, async: true },
      ]),
      { speaker: 'echo_cook', text: 'Odilon Philogène, the boatman. He kept the powder dry in the boats.', fx: 'stone_6', stage: [{ do: 'look', actor: 'reader_6' }] },
      reader(4, 'echo_aide', WEST_WAY, 'Fanfan Michel. She carried the Marshal\'s letters and never lost one.', [leaves(2, WEST_WAY), leaves(6, EAST_WAY)]),
      nar('A young scout of Caona\'s company lays her hand on the last stone, the blank one, and says her brother\'s name.', {
        stage: [
          leaves(4, WEST_WAY),
          { do: 'walk', actor: `npc:${SCOUT}`, to: READER_SPOTS[7]!.at, facing: READER_SPOTS[7]!.facing },
          { do: 'look', actor: `npc:${SCOUT}` },
        ],
      }),
      nar('The stone stays silent. There is nothing cut into it to answer her.'),
      say(CUTTER, 'That is not a Zetwal name, child. I cut Zetwal names.', { stage: [{ do: 'look', actor: 'stonecutter' }, { do: 'face', actor: 'stonecutter', facing: 'right' }] }),
      say(SCOUT, 'He fell on the bridge road, with yours.', { stage: [{ do: 'face', actor: `npc:${SCOUT}`, facing: 'up' }] }),
      nar('The stonecutter lays his chisel on the plinth, and walks off into the scaffolding.', {
        stage: [
          { do: 'walk', actor: 'stonecutter', to: PLINTH_STEP, facing: 'up' },
          { do: 'wait', ms: 500 },
          { do: 'exit', actor: 'stonecutter', to: WEST_WAY },
        ],
      }),
      say(SOLANGE, 'Then the seventh stays blank, until this temple has someone braver than its stonecutter.', { stage: [{ do: 'look', actor: `npc:${SOLANGE}` }] }),
      say(SOLANGE, 'Say them as they were first said, and the last shall answer. I will have that cut into the plinth.'),
      nar('Mother Solange writes the scout\'s brother at the foot of her list, in her own hand.', { set: { [Z4.watched]: true } }),
      nar('(The stonecutter\'s chisel lies on the plinth.)', { stage: [{ do: 'look', actor: 'player' }] }),
    ],
  },
};

function stoneScript(n: number): DialogueScript {
  const step = READING_ORDER.indexOf(n);
  const ord = ORDINALS[n]!;
  const caneDue: Condition = { all: [{ flag: 'side.cane_name.accepted' }, { notFlag: 'side.cane_name.stones' }] };
  const knock = nar(`The ${ord} stone gives a dull knock, and all seven fall silent.`, { fx: 'stone_hush' });
  /** A wrong stone: the order starts again; the third and the fifth bring Anissa's next hint. */
  const hush = (misses: number): DialogueNode => ({
    set: { [Z4.seq]: 0, [Z4.misses]: misses },
    lines: [knock, ...(misses === 3 ? [say(A, Z4_HINTS[1]!)] : []), ...(misses === 5 ? [say(A, Z4_HINTS[2]!)] : [])],
  });
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [
        // A Name in the Cane's first step still reads the stones (the cutter's grandmother is on none of them).
        { if: caneDue, to: 'cane' },
        ...(n === 7 ? [{ if: { notFlag: Z4.anchor } as Condition, to: 'dead' }] : []),
        // (Unset counts as 0: the first stone of the order needs no earlier touch.)
        { if: step === 0 ? { flag: Z4.seq, lte: 0 } : { flag: Z4.seq, eq: step }, to: 'chime' },
        { if: { flag: Z4.misses, gte: 5 }, to: 'knock' },
        { if: { flag: Z4.misses, eq: 4 }, to: 'hush_5' },
        { if: { flag: Z4.misses, eq: 3 }, to: 'hush_4' },
        { if: { flag: Z4.misses, eq: 2 }, to: 'hush_3' },
        { if: { flag: Z4.misses, eq: 1 }, to: 'hush_2' },
        { to: 'hush_1' },
      ],
    },
    cane: { set: { 'side.cane_name.stones': true }, lines: STONES_READ },
    dead: { lines: [nar('The seventh stone. Smooth and blank, and silent under Gianna\'s hand.')] },
    chime: {
      set: { [Z4.seq]: step + 1 },
      lines: [nar(n === 7 ? `The ${ord} stone, with its weathered sun. It sings: ${STONE_NOTES[n]}.` : `The ${ord} stone. It sings: ${STONE_NOTES[n]}.`, { fx: `stone_${n}` })],
      next: step === READING_ORDER.length - 1 ? 'answer' : undefined,
    },
    hush_1: hush(1),
    hush_2: hush(2),
    hush_3: hush(3),
    hush_4: hush(4),
    hush_5: hush(5),
    knock: { set: { [Z4.seq]: 0 }, lines: [knock] },
  };
  if (step === READING_ORDER.length - 1) {
    nodes.answer = {
      set: { [Z4.answered]: true },
      lines: [
        nar('Then all seven sing at once, one long chord over the lamp court.', { fx: 'stones_chord' }),
        say(MOURNER, 'Seven. I have come here every year since he died, and I never once heard seven.', {
          stage: [
            { do: 'look', actor: `npc:${MOURNER}` },
            { do: 'walk', actor: `npc:${MOURNER}`, to: MOURNER_LISTENS, facing: 'up' },
          ],
        }),
        nar('Under the plinth, stone grinds on stone. A drawer has slid open in its foot.', { fx: 'shake', stage: [{ do: 'look', actor: 'player' }] }),
        say(A, 'Gigi. The plinth opened.'),
      ],
    };
  }
  return script(`name_stone_${n}`, nodes);
}

const SEVENTH_STONE_DIALOGUE: readonly DialogueScript[] = [
  ...[1, 2, 3, 4, 5, 6, 7].map(stoneScript),
  // Solange's plinth in the present: her riddle; Anissa's first hint while the seventh is blank; the drawer and the Quill.
  script('solange_plinth', {
    start: {
      lines: [],
      next: [
        { if: { flag: Z4.done }, to: 'empty' },
        { if: { flag: Z4.answered }, to: 'drawer' },
        { if: { all: [{ flag: Z4.accepted }, { notFlag: Z4.anchor }] }, to: 'hint' },
        { to: 'riddle' },
      ],
    },
    riddle: { lines: [nar('A plinth in the ring of name stones. Cut into it: "Say them as they were first said, and the last shall answer." M.S.')] },
    hint: {
      lines: [
        nar('A plinth in the ring of name stones. Cut into it: "Say them as they were first said, and the last shall answer." M.S.'),
        say(A, Z4_HINTS[0]!),
      ],
    },
    drawer: {
      set: { [Z4.done]: true },
      lines: [
        nar('In the drawer under the plinth, wrapped in oilcloth: a quill with its nib worn to a slant, and a folded list.'),
        nar('Mother Solange\'s first list of names. The last line, in her own hand, is a Yaguana name: the scout\'s brother.'),
        say(G, 'She wrote him down anyway. Fifty years under a plinth, and nobody ever read it.'),
        nar('(Gianna received Solange\'s Quill. Her list goes with it.)', { set: { 'item.solange_quill': 1 } }),
        say(A, 'Grandfather was at the first reading, wasn\'t he? He carved the sun.'),
        say(G, 'He did. For whoever kept this temple after him.'),
      ],
    },
    empty: { lines: [nar('Solange\'s plinth, its drawer empty now. The riddle is answered: all seven stones sing.')] },
  }),
  // The memory: the plinth with the stonecutter's chisel on it.
  script('plinth_echo', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: Z4.accepted }, { notFlag: Z4.anchor }, { notFlag: Z4.chisel }] }, to: 'chisel' },
        { if: { flag: Z4.chisel }, to: 'held' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('A new plinth, the stone still pale. Nothing is cut into it yet.')] },
    chisel: {
      set: { [Z4.chisel]: true },
      lines: [nar('The stonecutter\'s chisel and mallet, left on the plinth. Patricio picks them up.')],
    },
    held: { lines: [nar('A new plinth, the stone still pale. The stonecutter\'s chisel is in Patricio\'s hand.')] },
  }),
  // The memory: the blank seventh stone. Carved (the anchor), it keeps a sun for fifty years.
  script('seventh_stone_echo', {
    start: {
      lines: [],
      next: [{ if: { flag: Z4.anchor }, to: 'carved' }, { if: { flag: Z4.chisel }, to: 'blank_chisel' }, { to: 'blank' }],
    },
    blank: { lines: [nar('The seventh stone, new and blank. Nothing to cut it with.')] },
    blank_chisel: {
      lines: [nar('The seventh stone, new and blank.')],
      choices: [
        { text: 'Carve a sun into it.', next: 'carve' },
        { text: 'Not yet.' },
      ],
    },
    carve: {
      lines: [
        nar('No name: Patricio does not know the brother\'s name, and it is not his to cut. He cuts a sun, the sun of Kay Soley.'),
        say(P, 'For whoever keeps this temple after me.', { set: { [Z4.anchor]: true } }),
        nar('The scout bows to the Marshal, and then to the stone.', { stage: [{ do: 'face', actor: `npc:${SCOUT}`, facing: 'player' }] }),
      ],
    },
    carved: { lines: [nar('The seventh stone, with a fresh sun cut into it. The chips are still on the grass.')] },
  }),
  script('temple_echo_return', {
    start: { lines: [], next: [{ if: { all: [{ flag: Z4.anchor }, { notFlag: 'story.seventh_sun_seen' }] }, to: 'sun' }] },
    sun: {
      set: { 'story.seventh_sun_seen': true },
      lines: [
        nar('Up in the ring of name stones, the seventh has a sun cut into it now, worn soft by fifty years of rain.'),
        say(A, 'Gigi, that sun was not there before. The seventh stone was blank.'),
      ],
    },
  }),
  // The memory's people at the first reading, between scenes.
  script('echo_solange_talk', {
    start: { lines: [], next: [{ if: { flag: Z4.anchor }, to: 'after' }, { to: 'before' }] },
    before: { speaker: SOLANGE, lines: [{ text: 'Six names said and one refused, Marshal. I will not read the list again until the seventh is cut.' }] },
    after: { speaker: SOLANGE, lines: [{ text: 'A sun. Then the seventh is kept, even if no one here can say the name. I can write it.' }] },
  }),
  script('echo_caona_scout_talk', {
    start: { lines: [], next: [{ if: { flag: Z4.anchor }, to: 'after' }, { to: 'before' }] },
    before: { speaker: SCOUT, lines: [{ text: 'Caona sent me to say his name here. I said it. The stone did not hear me.' }] },
    after: { speaker: SCOUT, lines: [{ text: 'The stone has a sun now. When it sings, it will be him.' }] },
  }),
];

export const ZETWAL_DIALOGUE: readonly DialogueScript[] = [
  // ---- The festival -----------------------------------------------------------------------------
  simple(
    'intro_festival',
    [
      nar("Pòdlimyè, capital of Zetwal. The Festival of Elodie's Gaze."),
      nar('Once a year the whole city remembers its dead aloud, and the goddess remembers with them.'),
      say(A, 'Gigi... there are so many people.'),
      say(G, 'Stay close. Mother speaks from the stage at noon, and tonight the names are read on the Temple island.'),
      say(A, 'Is Grandfather reading again this year?'),
      say(G, 'He always does. He went over to the island before dawn to get ready.'),
      say(A, "...Okay. I'll stay close."),
      nar('(Arrows, WASD or the D-pad to walk, diagonals too, or tap where to go. Tap people and things to talk. Hold Shift or B to run.)'),
      nar('(Z or A to talk. Esc or Menu opens the menu: your party, your bag, the maps and your Journal.)'),
      nar('(Stuck? Q or the Ask button asks Anissa what to do next.)'),
    ],
    // Anissa joins, and Gianna sets out with a little food in her satchel.
    { 'party.anissa': true, 'item.soup_pot': 2, 'item.akasan': 1 },
  ),

  script('elodie_talk', {
    start: { lines: [], next: [{ if: { notFlag: 'story.heard_speech' }, to: 'speech' }, { to: 'farewell' }] },
    speech: {
      speaker: 'elodie',
      lines: [
        { text: 'People of Zetwal.' },
        { text: "Fifty years ago this square was a camp of tents and barricades, and the Crown's ships sat in our harbor." },
        { text: 'My father stood on this ground and promised that no crown would ever again decide who we are.' },
        { text: 'Tonight the Gaze of Elodie remembers with us. Say your names. Say theirs.' },
        nar('The crowd answers with a thousand names at once.'),
        { text: 'Tomorrow I leave for the Throne, as your envoy. I will speak there for all of you.' },
        nar('As the crowd breaks up, Mother finds you with her eyes.'),
        { text: 'Gianna. Anissa. Walk me to the east gate? My carriage is waiting.', set: { 'story.heard_speech': true } },
      ],
    },
    farewell: {
      speaker: 'elodie',
      lines: [
        { text: 'There you are.' },
        { text: 'A few weeks. Maybe longer. The Regent likes to keep envoys waiting.' },
      ],
      // Remembered (Oct 19): Grandmother and the dock bring it up again.
      choices: [
        { text: 'Why do you have to go now?', next: 'why', set: { 'choice.farewell_why': true } },
        { text: "We'll be fine.", next: 'fine', set: { 'choice.farewell_fine': true } },
      ],
    },
    why: {
      speaker: 'elodie',
      lines: [{ text: 'Because the Crown is talking about Xaraguá again, and someone at the Throne has to answer them.' }],
      next: 'goodbye',
    },
    fine: {
      speaker: 'elodie',
      lines: [{ text: 'I know you will. That is not the same as me not worrying.' }],
      next: 'goodbye',
    },
    goodbye: {
      speaker: 'elodie',
      lines: [
        { text: 'Your grandmother has something for you. She has been waiting until you were ready. I think you are.' },
        { text: "Go and see her at home, in your grandfather's study." },
        { text: 'Anissa. Stay close to your sister.' },
        say(A, '...I will.'),
        { text: 'The Gaze sees you both. So do I.' },
        // Staged (owner rule, Oct 17): she walks out through the gate to her carriage.
        nar("Mother's carriage rolls out through the east gate, toward the Throne.", {
          fx: 'fade',
          set: { 'story.elodie_left': true },
          stage: [{ do: 'exit', actor: 'npc:elodie', to: { x: 39, y: 19 } }],
        }),
      ],
    },
  }),

  // The plaza's doors stay closed until the opening is done (owner decision, Oct 16): first see Mother
  // off, then see Grandmother, then the first Echo (the war room). Anissa says why, at any closed door.
  script('plaza_door_closed', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.elodie_left' }, to: 'mother' },
        { if: { notFlag: 'item.sun_locket' }, to: 'grandmother' },
        { to: 'locket' },
      ],
    },
    mother: { lines: [say(A, "Wait, Gigi! Let's see Mother before she leaves.")] },
    grandmother: { lines: [say(A, "Wait, Gigi. Grandmother's waiting for us at home. Let's see her first.")] },
    locket: { lines: [say(A, 'Wait! The Locket... Grandmother said the study remembers. Let\'s try it there first.')] },
  }),

  script('gaze_keeper_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.anissa_woke' }, to: 'lights' },
        { if: { flag: 'story.bridge_crossed' }, to: 'bridge' },
        { to: 'festival' },
      ],
    },
    festival: {
      speaker: 'gaze_keeper',
      lines: [
        { text: 'The Gaze of Elodie does not rule us, child. She remembers. That is why rulers are a little afraid of her.' },
        { text: 'Have you heard? The rope bridge to the Temple island came down at dawn. No one hurt, the Gaze be thanked.' },
        { text: 'But the names are read on the island tonight. We will need a boat, or a miracle.' },
      ],
    },
    bridge: {
      speaker: 'gaze_keeper',
      lines: [{ text: 'They say the old Chain Bridge is down. The one that has stood raised since before I was born. I may need to sit.' }],
    },
    lights: {
      speaker: 'gaze_keeper',
      lines: [
        { text: 'Did you see? Every lantern in the city lit at once.' },
        { text: 'Forty years I have kept the Gaze, and I have never seen her so... awake.' },
      ],
    },
  }),

  // The soup vendor (Oct 19): her greeting's two answers are remembered (the first one given counts) and pay off
  // when the soup is delivered; once the city has opened, the talk flows straight into the errand, and a
  // borrowed book is asked for in the same conversation.
  script('soup_vendor_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.soup' }, { any: [{ flag: 'side.soup.accepted' }, { flag: 'side.soup.done' }] }] }, to: 'overdue' },
        { if: { flag: 'side.soup.done' }, to: 'after' },
        { if: { all: [{ flag: 'side.soup.elder' }, { flag: 'side.soup.guard' }, { flag: 'side.soup.ferry' }] }, to: 'finish' },
        { if: { flag: 'side.soup.accepted' }, to: 'remind' },
        { if: { any: [{ flag: 'choice.soup_smell' }, { flag: 'choice.soup_bowl' }] }, to: 'again' },
        { to: 'greet' },
      ],
    },
    greet: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Bonjou! Kijan ou ye?', translation: 'Hello! How are you?' },
        { text: 'Soup in a clay pot, hot from the fire. No selling today, though. Today I feed my cousins.' },
        { text: 'All of my cousins. On festival day the whole city is my cousin.' },
      ],
      choices: [
        { text: 'It smells wonderful.', next: 'smell', set: { 'choice.soup_smell': true } },
        { text: 'Save me a bowl.', next: 'bowl', set: { 'choice.soup_bowl': true } },
      ],
    },
    smell: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Wonderful? It is my grandmother\'s. Wonderful is the least it is allowed to be.' }],
      next: 'after_greet',
    },
    bowl: {
      speaker: 'soup_vendor',
      lines: [{ text: "Saved. Cousin's bowl, on the shelf, with your name on it. Do not make me eat it myself." }],
      next: 'after_greet',
    },
    again: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Back again, cousin? The pot is still hot.' }],
      next: 'after_greet',
    },
    // After the greeting: a borrowed book first, then the errand (side quests wait for the first Echo: owner
    // decision, Oct 16), or a promise of the good pot.
    after_greet: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.soup' }] }, to: 'overdue' },
        { if: { flag: 'story.warroom_echo' }, to: 'offer' },
        { to: 'thanks' },
      ],
    },
    thanks: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Mèsi! Come back when the stall is open and I will give you the good pot.', translation: 'Thank you!' }],
    },
    // Side quest: Soup for the Cousins.
    offer: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Though today I have a problem. My nephew was meant to carry the bowls. My nephew is asleep under a mango tree.' },
        { text: 'Three bowls promised: the old neighbor west of the plaza, the guard by the Hall, and the ferryman at the docks.' },
      ],
      choices: [
        { text: "I'll carry them.", next: 'accept' },
        { text: 'Not right now.', next: 'not_now' },
      ],
    },
    not_now: { speaker: 'soup_vendor', lines: [{ text: 'The soup will wait. It is soup. Waiting is what it does best.' }] },
    accept: {
      speaker: 'soup_vendor',
      set: { 'side.soup.accepted': true },
      lines: [
        { text: 'Mèsi, cherie! Hot, so walk fast. Not too fast.', translation: 'Thank you, dear!' },
        nar('(Gianna takes three bowls of soup. Soup for the Cousins is in the Quests page of the menu.)'),
        nar('(Tap the minimap to see the whole city. Tap someone to walk over and talk.)'),
      ],
    },
    remind: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Still bowls in the basket? The soup is getting cold, and so am I.' },
        { if: { notFlag: 'side.soup.elder' }, text: 'The old neighbor, west of the plaza. He will pretend he is not hungry. He is.' },
        { if: { notFlag: 'side.soup.guard' }, text: 'The guard by the Hall. Do not let him tell you he is on duty.' },
        { if: { notFlag: 'side.soup.ferry' }, text: 'The ferryman, down at the docks. Follow the complaining.' },
      ],
    },
    finish: {
      speaker: 'soup_vendor',
      set: { 'side.soup.done': true },
      lines: [
        // Her greeting's answer, remembered (the first one given; the bowl wins if a save somehow has both).
        { if: { flag: 'choice.soup_bowl' }, text: "All three, and not one broken? Then here is yours: cousin's bowl, off the shelf, as promised." },
        {
          if: { all: [{ flag: 'choice.soup_smell' }, { notFlag: 'choice.soup_bowl' }] },
          text: "All three, and not one broken? You said it smelled wonderful before you'd tasted a spoon. Now you can say it knowing.",
        },
        { if: { all: [{ notFlag: 'choice.soup_smell' }, { notFlag: 'choice.soup_bowl' }] }, text: 'All three? And not one bowl broken?' },
        { text: 'Take these for the road. In this city, a cousin who carries soup is a cousin for life.' },
      ],
    },
    after: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Come back any time, cousin. The good pot is always on.' }],
    },
    // The Overdue Shelf (then, if the errand is still to come, straight on to it).
    overdue: {
      speaker: 'soup_vendor',
      set: { 'side.overdue.soup': true },
      lines: [
        say(G, 'The archive would like "Ninety Ways With Pumpkin" back.'),
        { text: 'Ay. Here. Page forty has soup on it. It was a very good page.' },
        nar('(Gianna got back "Ninety Ways With Pumpkin".)'),
      ],
      next: [{ if: { all: [{ flag: 'story.warroom_echo' }, { notFlag: 'side.soup.accepted' }, { notFlag: 'side.soup.done' }] }, to: 'offer' }],
    },
  }),

  // The debate corner's crowd (the debate itself: data/debates.ts).
  script('debate_onlooker_talk', {
    start: {
      lines: [],
      next: [{ if: { any: [{ flag: 'debate.zetwal_corner.won' }, { flag: 'debate.zetwal_corner.mediated' }] }, to: 'after' }, { to: 'during' }],
    },
    during: {
      speaker: 'villager',
      lines: [{ text: "Shh! I want to hear this. My cousin went to one of their quiet meetings and hasn't come back to Sunday dinner since." }],
    },
    after: { speaker: 'villager', lines: [{ text: 'Did you hear what the envoy\'s daughter said? I am telling my cousin tonight.' }] },
  }),

  script('recruiter_a_talk', {
    start: {
      speaker: 'recruiter_a',
      lines: [
        { text: "So much noise today. Drums, names, shouting. Doesn't it tire you?" },
        { text: 'We meet where it is quiet. No one there asks you to shout your grief.' },
        { text: 'If you ever need a meal, or help with a debt, the Quiet Crown helps. We only ask that you listen.' },
      ],
      choices: [
        { text: 'What do you want in return?', next: 'price' },
        { text: 'No, thank you.', next: 'no' },
      ],
    },
    price: {
      speaker: 'recruiter_a',
      lines: [{ text: 'Nothing. Only quiet. One voice instead of a thousand. Is that so much to want?' }],
    },
    no: {
      speaker: 'recruiter_a',
      lines: [{ text: 'The door stays open. It always does.' }],
    },
  }),

  script('recruiter_b_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'recruiter_b',
      lines: [
        { text: 'One hand on the Throne. One voice for the whole realm. Imagine how calm things would be.' },
        { text: 'You would be surprised who wears our hood, envoy\'s daughter.' },
      ],
    },
    after: {
      speaker: 'recruiter_b',
      lines: [
        { text: 'That light on the island. Such a quiet little girl, to be so bright.' },
        { if: { flag: 'choice.warned_watcher' }, text: 'The woman by the mill says you told her to stay away. We always do. We only ever listen.' },
      ],
    },
  }),

  script('town_guard_talk', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.guard' }] }, to: 'soup' }, { to: 'talk' }],
    },
    talk: {
      speaker: 'town_guard',
      lines: [
        { text: 'Those hooded folk hand out bread and ask for nothing back. That is exactly what worries me.' },
        { text: 'Nobody gives bread for nothing. Not even on festival day.' },
      ],
    },
    soup: {
      speaker: 'town_guard',
      set: { 'side.soup.guard': true },
      lines: [
        { text: 'Soup? I am on duty.' },
        { text: '...The law says nothing about soup. I checked. Twice. Thank her for me.' },
      ],
    },
  }),

  script('festival_kid_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'festival_kid',
      lines: [{ text: "I'm going to say my great-great-grandmother's name so loud the goddess has to cover her ears!" }],
    },
    after: {
      speaker: 'festival_kid',
      lines: [{ text: "Did you see? All the lanterns lit by themselves! And I hadn't even started shouting yet!" }],
    },
  }),

  script('elder_talk', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.elder' }] }, to: 'soup' }, { to: 'talk' }],
    },
    talk: {
      speaker: 'elder',
      lines: [
        { text: 'Your mother? At your age she argued with the whole council, and won.' },
        { text: "Then she took the name Limyè, for the goddess's light, she said. Her father's name was good enough for the rest of us." },
        { text: 'Well. Jean-Philippe is a mouthful to shout at a festival.' },
      ],
    },
    soup: {
      speaker: 'elder',
      set: { 'side.soup.elder': true },
      lines: [
        { text: "Soup from the plaza? I'm not hungry." },
        { text: '...I am a little hungry. She remembered me. She always remembers me. She is my cousin, you know.' },
        { text: 'Everyone is, today.' },
      ],
    },
  }),

  script('ferryman_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.ferry' }] }, to: 'book' },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.ferry' }] }, to: 'soup' },
        { if: { flag: 'story.bridge_crossed' }, to: 'after' },
        { to: 'before' },
      ],
    },
    before: {
      speaker: 'ferryman',
      lines: [
        { text: "Ferry to the island? Not today. The tide's wrong, and every boat is full of flowers for the names." },
        { text: "Your grandfather's over there? He'll be fine. He's survived worse than a broken bridge." },
        { text: 'So have I. Mostly.' },
      ],
    },
    after: {
      speaker: 'ferryman',
      lines: [{ text: 'The old Chain Bridge, down after fifty years? There goes my festival trade.' }],
    },
    // The Overdue Shelf.
    book: {
      speaker: 'ferryman',
      set: { 'side.overdue.ferry': true },
      lines: [
        say(G, 'The archive wants "Tides of the Southern Reach" back. Six months overdue.'),
        { text: 'That book? The sea has it now. Tragic. Very wet.' },
        say(G, "Ferryman. It's under the crate you're sitting on."),
        { text: '...The crate wobbles. It is a very useful book for crates. Fine. Take it.' },
        nar('(Gianna got back "Tides of the Southern Reach". It is only a little damp.)'),
      ],
    },
    // Soup for the Cousins.
    soup: {
      speaker: 'ferryman',
      set: { 'side.soup.ferry': true },
      lines: [{ text: 'Soup! The tide can wait. The tide always waits for soup.' }],
    },
  }),

  script('pilgrim_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'pilgrim',
      lines: [{ text: "I walked down from the hills to say my brother's name at the lamp. If the bridge is down, I'll say it to the water." }],
    },
    after: {
      speaker: 'pilgrim',
      lines: [{ text: "I said his name. The lamp was warm. I don't know how else to say it." }],
    },
  }),

  simple('marshal_stone', [
    nar('THE SUN ACCORD WAS SIGNED ON THIS GROUND.'),
    nar('Six clauses are carved beneath, one under another. There is room on the stone for a seventh. It is blank.'),
  ]),

  // ---- The bridgehead, present ------------------------------------------------------------------
  simple('bridge_look', [
    say(A, 'Gigi, look. The rope bridge...'),
    nar('Where the rope bridge hung this morning, two frayed ends sway over the chasm.'),
    say(G, "Grandfather's on the other side."),
    say(A, 'Is he stuck?'),
    say(G, "He'll be all right. But the names can't be read without him."),
  ]),

  simple('rope_bridge', [nar('Frayed rope, snapped clean through. No one is crossing here today.')], { 'story.bridge_seen': true }),

  script('plaque', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: {
      lines: [
        nar('A bronze plaque, green with age: THE CHAIN BRIDGE.'),
        nar('Raised by order of Marshal Patricio on the night before the Sun Accord. It has stood raised ever since.'),
      ],
    },
    after: {
      lines: [
        nar('A bronze plaque, green with age: THE CHAIN BRIDGE.'),
        nar('Raised by order of Marshal Patricio on the night before the Sun Accord, and lowered by his own hand before dawn.'),
      ],
    },
  }),

  script('winch_present', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [nar('The old winch. Fifty years of rust have welded it solid. It will not turn.')] },
    after: { lines: [nar('The old winch, rusted solid, its chain run out across the chasm. It has not moved in fifty years.')] },
  }),

  script('pawl_present', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [nar('An iron pawl beside the winch. Its pin hole is empty and full of rust.')] },
    after: { lines: [nar('An iron pin runs through the pawl, rusted in place. It has held for fifty years.')] },
  }),

  simple('bridge_cross', [
    say(A, 'It holds. Gigi, it holds.'),
    say(G, 'Fifty years of sun on these planks, and not one of them loose.'),
    say(A, '...Was this bridge always here?'),
    say(G, 'It is now.'),
  ]),

  // ---- The bridgehead, the Echo (the signature puzzle) ------------------------------------------
  once('bridge_echo_enter', 'story.bridge_echo_seen', [
    nar('Night. Torches along the chasm. The Chain Bridge stands raised against the island gate.'),
    say(AF, "I'm here, Gigi. I've got the door."),
  ]),

  script('bridge_echo_return', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'anchor.chain_bridge' }, { notFlag: 'story.bridge_return_seen' }] }, to: 'carried' },
        { if: { all: [{ notFlag: 'anchor.chain_bridge' }, { flag: 'story.winch_lowered' }, { notFlag: 'story.bridge_crept_seen' }] }, to: 'crept' },
      ],
    },
    carried: {
      set: { 'story.bridge_return_seen': true },
      lines: [
        nar('The present settles around you. Across the chasm, where the raised bridge stood a moment ago...'),
        nar('...the old Chain Bridge lies flat over the water, weathered by fifty years of sun.'),
        say(A, 'Gigi... look.'),
      ],
    },
    crept: {
      set: { 'story.bridge_crept_seen': true },
      lines: [
        nar('Across the chasm, the Chain Bridge still stands raised, as it has for fifty years.'),
        say(G, 'I lowered it. But by morning the chain dragged it back up.'),
        say(G, 'The night orders said it: pin the pawl, or she creeps back up.'),
      ],
    },
  }),

  script('winch_echo', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.chain_bridge' }, to: 'pinned' },
        { if: { flag: 'echo.chain_bridge_down' }, to: 'down' },
        // The puzzle is posed by the night orders under the window seat (demo review, Oct 17): without them,
        // the winch is just a winch.
        { if: { notFlag: 'clue.night_orders' }, to: 'orders' },
        { to: 'up' },
      ],
    },
    orders: {
      lines: [
        nar('The great winch. The Chain Bridge stands raised against the island gate, as you ordered at dusk.'),
        nar('It stays up until you write the order to lower it.'),
      ],
    },
    up: {
      lines: [nar('The great winch. Across the chasm, the Chain Bridge stands raised against the island gate, as you ordered at dusk.')],
      choices: [
        { text: 'Turn the winch and lower the bridge.', next: 'lower', set: { 'echo.chain_bridge_down': true, 'story.winch_lowered': true } },
        { text: 'Leave it raised.' },
      ],
    },
    lower: {
      lines: [
        nar('You lean into the crank. The chain pays out link by link, and the bridge comes down across the chasm with a boom.', { fx: 'shake' }),
        nar('The pawl swings loose beside the winch. Without its pin, the weight of the chain will drag the bridge back up by morning.'),
      ],
    },
    down: { lines: [nar('The bridge is down. The pawl hangs loose: without the pin, the chain will creep back up by morning.')] },
    pinned: { lines: [nar('Lowered and pinned. This bridge will stay down.')] },
  }),

  script('pawl_echo', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.chain_bridge' }, to: 'pinned' },
        { if: { flag: 'echo.chain_bridge_down' }, to: 'pin' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [nar('An iron pin hangs on a chain beside the pawl. It is no use while the bridge is raised.')] },
    pin: {
      lines: [nar('The iron pin. Drive it through the pawl, and the bridge stays down for good.')],
      choices: [
        { text: 'Drive the pin through the pawl.', next: 'pinned_now', set: { 'anchor.chain_bridge': true } },
        { text: 'Not yet.' },
      ],
    },
    pinned_now: {
      lines: [
        nar('Clang. The pin bites. The pawl locks.', { fx: 'shake' }),
        say(P, 'There. Stay down.'),
        nar('(Anchor: this change will last into the present.)'),
      ],
    },
    pinned: { lines: [nar('The pin is through the pawl. The bridge stays down.')] },
  }),

  script('echo_sentry_talk', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'echo_sentry',
      lines: [{ text: 'Bridge is up, Marshal, as ordered. Nobody crosses till the ink is dry.' }],
    },
    after: {
      speaker: 'echo_sentry',
      lines: [
        { text: 'Marshal? You said up for the night...' },
        say(P, 'I changed my mind. Let anyone cross who wants to remember.'),
        { text: "...Yes, sir. I'll tell the others the Marshal has gone poetic." },
      ],
    },
  }),

  // ---- The plaza, the Echo ----------------------------------------------------------------------
  once('plaza_echo_enter', 'story.plaza_echo_seen', [
    nar('The square is mud and canvas. Cookfires. Someone is singing, badly, and someone else is telling him so.'),
    nar('Fifty years ago: the night before the signing.'),
    say(AF, "I'm holding the door, Gigi."),
  ]),

  simple('marshal_stone_echo', [nar('A heap of cut stone, waiting. Masons will carve the Accord into it after the signing.')]),
  simple('signing_stage_echo', [nar("The signing platform, half built. Tomorrow two armies and the Crown's envoy will stand on it.")]),

  script('echo_soldier_talk', {
    start: {
      speaker: 'echo_soldier',
      lines: [
        { text: 'Marshal! Tomorrow we sign, and then we go home. Right, sir?' },
        say(P, 'Then we go home.'),
        { text: 'My mother will ask if I ate. Tell her I ate, sir, if she asks.' },
      ],
    },
  }),
  simple('echo_cook_talk', [
    say('echo_cook', "Eat something, Marshal. You can't sign a peace on an empty stomach."),
    say('echo_cook', "Lord Benny's people sent over peppers. Half the camp is crying. The other half wants more."),
  ]),
  simple('echo_scout_talk', [
    say('echo_scout', "The Crown's ships haven't moved, sir. Every lantern on them is lit."),
    say('echo_scout', 'They want us to see them watching.'),
  ]),
  simple('echo_drummer_talk', [say('echo_drummer', "When it's signed I'll drum till my hands give out, Marshal. Then I'll sleep for a week.")]),

  // ---- Home and the war room --------------------------------------------------------------------
  simple('house_enter', [say('anicette', "Gianna? Anissa? In here. In your grandfather's study.")]),

  script('anicette_talk', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.elodie_left' }, to: 'early' },
        { if: { notFlag: 'item.sun_locket' }, to: 'locket' },
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.vol2' }] }, to: 'overdue' },
        { to: 'story' },
      ],
    },
    story: {
      lines: [],
      next: [
        { if: { notFlag: 'story.warroom_echo' }, to: 'go' },
        { if: { notFlag: 'clue.night_orders' }, to: 'after_echo' },
        { if: { notFlag: 'story.bridge_crossed' }, to: 'bridge' },
        { to: 'later' },
      ],
    },
    early: {
      speaker: 'anicette',
      lines: [
        { text: 'Gianna! Shouldn\'t you be in the square? Your mother speaks at noon.' },
        { text: 'Go on. Come and find me after she has gone. I have something for you.' },
      ],
    },
    locket: {
      speaker: 'anicette',
      lines: [
        { text: 'There you are. Did your mother get away?' },
        // What Gianna said to Mother at the gate (elodie_talk), remembered.
        { if: { all: [{ notFlag: 'choice.farewell_why' }, { notFlag: 'choice.farewell_fine' }] }, speaker: G, text: 'Her carriage just left.' },
        { if: { all: [{ notFlag: 'choice.farewell_why' }, { notFlag: 'choice.farewell_fine' }] }, text: "Good. Then she can't scold me for this." },
        { if: { flag: 'choice.farewell_why' }, speaker: G, text: 'Her carriage just left. She said the Crown is talking about Xaraguá again.' },
        { if: { flag: 'choice.farewell_why' }, text: 'Is it. Then she told you more than she told me. You are old enough to be told things.' },
        { if: { flag: 'choice.farewell_why' }, text: 'So here is one more. And now she cannot scold me for it.' },
        { if: { flag: 'choice.farewell_fine' }, speaker: G, text: "Her carriage just left. I told her we'd be fine." },
        { if: { flag: 'choice.farewell_fine' }, text: 'And did she believe you?' },
        { if: { flag: 'choice.farewell_fine' }, speaker: G, text: 'No.' },
        { if: { flag: 'choice.farewell_fine' }, text: 'Neither do I. That is why you get this.' },
        nar('Grandmother opens a drawer in the map table and takes out a small gold locket shaped like the sun.', {
          stage: [
            { do: 'face', actor: 'npc:anicette', facing: 'right' },
            { do: 'wait', ms: 1100 },
            { do: 'face', actor: 'npc:anicette', facing: 'player' },
          ],
        }),
        { text: 'Your grandfather made this the year of the Accord. Two halves of a promise, he said. This half is ours.' },
        { text: 'It remembers, Gianna. Where the air shimmers, it will show you what that place remembers.' },
        say(G, 'Grandmother, that sounds like a story for children.'),
        { text: 'It is. It is also true. The Gaze remembers everything, and now and then she lends a little of it back.' },
        say(A, 'Can I hold it?'),
        { text: 'Not this one, little light. It is too small for what you carry.' },
        say(A, '...What do I carry?'),
        { text: 'One day you will tell me.' },
        nar('(Gianna received the Sun Locket.)', { set: { 'item.sun_locket': true } }),
        { text: 'There, by the map table, where your grandfather planned his war. The air has shimmered there for fifty years.' },
        nar('(Stand on the shimmering tiles and press Echo: E on a keyboard, X on a controller, Echo on a touch screen.)'),
      ],
    },
    go: {
      speaker: 'anicette',
      lines: [
        { text: 'Go on. The shimmering tiles, by the map table.' },
        { text: 'Anissa cannot go where you are going. But she will be close. She will hold the door.' },
      ],
    },
    after_echo: {
      speaker: 'anicette',
      lines: [
        { text: 'You went. I can see it in your face.' },
        { text: 'The night before the signing. I remember that night. He did not sleep at all.' },
        { if: { flag: 'anchor.night_orders' }, text: 'If he left anything for us, it will be where he always hid things: under the window seat.' },
        { if: { notFlag: 'anchor.night_orders' }, text: 'He kept copies of everything under the loose board by the window seat. Did you see?' },
      ],
    },
    bridge: {
      speaker: 'anicette',
      lines: [
        { text: 'The Chain Bridge. I have not thought of it in years. Your grandfather never could leave a thing half done.' },
        { text: 'Go. He is waiting on that island, and he will be worrying.' },
      ],
    },
    later: {
      speaker: 'anicette',
      lines: [{ text: 'The whole city saw the lights, Gianna. Whatever happened over there, I am proud of you both.' }],
    },
    // The Overdue Shelf: Volume Two, after one pointed question.
    overdue: {
      speaker: 'anicette',
      lines: [nar('Grandmother has the look she gets when she knows exactly what you are about to ask.')],
      choices: [
        { text: 'About your overdue book...', next: 'vol2' },
        { text: 'Never mind.', next: 'story' },
      ],
    },
    vol2: {
      speaker: 'anicette',
      lines: [],
      next: [{ if: { flag: 'lore.zetwal_ash_wars_temple' }, to: 'question' }, { to: 'not_read' }],
    },
    not_read: {
      speaker: 'anicette',
      lines: [
        { text: "My book? Hm. Have you read the temple's own record of the Ash Wars? The healers' one, on the history shelf?" },
        say(G, 'Not yet.'),
        { text: 'Then read theirs first. Gossip is only useful once you know the facts it is gossiping about.' },
      ],
    },
    question: {
      speaker: 'anicette',
      lines: [{ text: 'You read it. Good. Then tell me: at the ford of Cendre, how many dead did our healers count?' }],
      choices: [
        { text: 'Four hundred.', next: 'wrong' },
        { text: 'Forty.', next: 'right' },
      ],
    },
    wrong: {
      speaker: 'anicette',
      lines: [{ text: 'Four hundred is what the Crown wrote, in Aldermoor, far from the ford. Read it again, Gianna. Slowly.' }],
    },
    right: {
      speaker: 'anicette',
      set: { 'side.overdue.vol2': true },
      lines: [
        { text: 'Forty. And three hundred sent home. Remember that, the next time someone sings about Rael the Ruthless.' },
        { text: 'Here. Three years overdue. I wrote in the margins, so the archive gets back more than it lent.' },
        say(G, 'Grandmother! You wrote in a library book?'),
        { text: 'Somebody had to correct it, little archivist.' },
        nar('(Gianna got back "Ash Wars Gossip, Volume Two".)'),
      ],
    },
  }),

  once('warroom_enter', 'story.warroom_intro', [
    nar('The room tilts. Lamplight. Pipe smoke. Low voices.'),
    nar("The study is a war room, and you are standing in your grandfather's boots."),
    say(P, '...Strange. As if someone were reading over my shoulder.'),
    say(AF, "Gigi? I'm here, at the door. I'm holding it open. I can feel it."),
    say(AF, "Don't stay too long. Please."),
    nar('(In the memory you are Patricio. Talk to the people here. Press Echo on the shimmering tiles to return.)'),
  ]),

  script('warroom_return', {
    start: { lines: [], next: [{ if: { notFlag: 'story.warroom_returned' }, to: 'scene' }] },
    scene: {
      set: { 'story.warroom_returned': true },
      lines: [
        say(A, 'Gigi! You came back.'),
        say(A, "You were standing right there with your eyes open, but you weren't... here."),
        say(G, 'I was Grandfather. The night before the signing.'),
        say(A, '...Did he know you were there?'),
        say(G, "I don't think so. But he felt something."),
        { if: { flag: 'anchor.night_orders' }, speaker: G, text: 'He hid his night orders under the window seat. I made sure of it.' },
        // Review 1 (Oct 21), finding 6: only once the aide has handed over the orders does Gianna speak of them.
        {
          if: { all: [{ flag: 'story.warroom_echo' }, { notFlag: 'anchor.night_orders' }] },
          speaker: G,
          text: 'He keeps his papers under the window seat. I should go back and leave the orders there.',
        },
        { if: { notFlag: 'story.warroom_echo' }, speaker: G, text: 'I need to go back. Someone was bringing him something.' },
      ],
    },
  }),

  script('echo_aide_talk', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.warroom_echo' }, to: 'orders' },
        { if: { all: [{ notFlag: 'echo.orders_copy' }, { notFlag: 'anchor.night_orders' }] }, to: 'copy' },
        { to: 'done' },
      ],
    },
    orders: {
      speaker: 'echo_aide',
      set: { 'story.warroom_echo': true },
      lines: [
        { text: "Marshal. The Crown's clerks sent the Accord at last. Six clauses." },
        { text: "They say the seventh is 'still being copied.' They will bring it to the signing." },
        say(P, 'Still being copied. The night before we sign.'),
        { text: 'Lord Benny sent word from the Brasador camp. He will not put his name to pages he has not read.' },
        say(P, 'Then we will both read every page in the morning.'),
        { text: "And the Crown's ships are still anchored off the harbor, sir." },
        say(P, 'Then raise the Chain Bridge to the Temple island for the night. No one crosses until the ink is dry.'),
        { text: 'It takes a dozen men to raise it, sir.' },
        say(P, 'And two to lower it. Turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning.'),
        { text: 'Yes, Marshal. Night orders, then.' },
      ],
      next: 'copy',
    },
    copy: {
      speaker: 'echo_aide',
      lines: [
        { text: 'Your copy of the night orders, sir.' },
        nar('(Patricio took the night orders.)', { set: { 'echo.orders_copy': true } }),
        { text: 'Under the loose board by the window, as usual?' },
      ],
    },
    done: {
      speaker: 'echo_aide',
      lines: [
        { if: { flag: 'anchor.night_orders' }, text: 'Get some sleep, Marshal. Tomorrow is a long day.' },
        { if: { notFlag: 'anchor.night_orders' }, text: 'The board by the window, sir. Same as always.' },
      ],
    },
  }),

  script('echo_messenger_talk', {
    start: {
      speaker: 'echo_messenger',
      lines: [
        { text: "Marshal. The camp is saying the last page is about Xaraguá's harbor." },
        { text: "I only carry the letters, sir. I don't read them." },
        say(P, 'Then carry this one to the Xaraguá camp: nobody signs what they have not read.'),
      ],
    },
  }),

  simple('echo_guard_talk', [say('echo_guard', 'Quiet night, Marshal. Too quiet, my mother would say. She says that about every night.')]),

  simple('map_table_present', [
    nar("Grandfather's map table. The old campaign map is still pinned under glass: Zetwal, Xaraguá, the Crown's harbor chain."),
    nar('Over the Temple island, in faded ink: CHAIN BRIDGE.'),
  ]),
  simple('map_table_echo', [
    nar('Fresh ink. A pin for every company.'),
    nar('Over the Temple island, a note in your own hand: CHAIN BRIDGE. RAISE AT DUSK.'),
  ]),
  simple('study_shelf', [
    nar("Grandfather's shelf. The Alliance War, in three volumes. A thin book: The Gaze Remembers."),
    nar('A very thick one: Clauses and Their Consequences. The spine has never been cracked.'),
  ]),
  simple('window_seat', [nar("A window seat with Grandmother's cushions. One board underneath is loose, but there is nothing under it except dust.")]),

  script('loose_board', {
    start: { lines: [], next: [{ if: { flag: 'clue.night_orders' }, to: 'again' }, { to: 'read' }] },
    read: {
      lines: [
        nar('You lift the loose board under the window seat.'),
        nar("Underneath, folded tight and brown with age, is a paper in Grandfather's hand."),
        nar('NIGHT ORDERS. Raise the Chain Bridge to the Temple island at dusk.'),
        nar('To lower: turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning. P. J-P.'),
        say(G, 'Fifty years under the floor. And I put it there an hour ago.'),
        say(A, "...That's not possible."),
        say(G, 'Grandmother would say the Gaze lends things back.'),
        say(A, "The Chain Bridge... that's the old one by the rope bridge. The one that's always raised."),
        say(G, 'Not for long.'),
        nar('(The night orders are in your Journal.)', { set: { 'clue.night_orders': true } }),
      ],
    },
    again: { lines: [nar("Grandfather's night orders: turn the winch, then drive the pin through the pawl.")] },
  }),

  script('floor_cache', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.night_orders' }, to: 'hidden' },
        { if: { flag: 'echo.orders_copy' }, to: 'hide' },
        { to: 'empty' },
      ],
    },
    hide: {
      lines: [
        nar('You kneel by the window seat and lift the loose board. Old papers underneath: lists, letters, a drawing of a ship.'),
        nar('Something makes you fold this copy small and push it to the very back, where no one would look for a long, long time.'),
      ],
      choices: [
        { text: 'Leave the night orders here.', next: 'hidden_now', set: { 'anchor.night_orders': true } },
        { text: 'Not yet.' },
      ],
    },
    hidden_now: {
      lines: [say(P, 'For whoever keeps this house after me.'), nar('(Anchor: this change will last into the present.)')],
    },
    hidden: { lines: [nar('The night orders are folded tight at the back of the cache.')] },
    empty: { lines: [nar('A loose board under the window seat. Patricio keeps copies of his papers here.')] },
  }),

  // ---- The Temple island ------------------------------------------------------------------------
  simple('temple_arrive', [
    nar('The Temple island. Pilgrims stranded since dawn crowd the path, staring at the bridge behind you.'),
    say(A, 'Everyone is looking at us.'),
    say(G, "They're looking at the bridge. Come on. Grandfather will be at the lamp."),
  ]),

  // ---- Chapter 2's end: home from Xaraguá (Oct 17) ----------------------------------------------
  // Grandfather and Grandmother on the long pier; the news has come by pigeon. Patricio asks Gianna to go to
  // Ardencia (owner decision, Oct 15: Chapter 3, Patricio's request).
  simple('zetwal_return', [
    nar('Dawn over Pòdlimyè. The trader ties up at the long pier, and two figures are waiting at the end of it.', {
      stage: [{ do: 'place', actor: 'yari', look: 'yari', at: { x: 31, y: 13 }, facing: 'up' }],
    }),
    // Staged: Grandmother hurries down the pier, Grandfather follows on his cane.
    say('anicette', 'Gianna! Anissa! Oh, my girls. The pigeons came yesterday. The Crown has Yucayeque.', {
      stage: [
        { do: 'walk', actor: 'npc:anicette_home', to: { x: 31, y: 12 }, facing: 'down', run: true, async: true },
        { do: 'walk', actor: 'npc:patricio_home', to: { x: 30, y: 12 }, facing: 'down' },
      ],
    }),
    say(A, 'Grandmother! We sailed in a canoe! And Gigi knocked a governor into the sea!'),
    say('patricio_old', 'Did she.'),
    say('patricio_old', 'And this is Caona\'s granddaughter. You have her eyes, child. She would have hit him too.'),
    say(Y, 'They took my father, Marshal. They said the seventh clause gives them our harbor. Our oath stone says nothing of it.'),
    say('patricio_old', 'Because there was no seventh clause when we swore. I would remember. I signed under Caona\'s name.'),
    say('patricio_old', 'The whole city is uneasy. Crown ships sighted off the south reef. People ask me if we are next.'),
    say('patricio_old', 'Gianna. Benny\'s son rules Ardencia now. Lord Rael. They call him ruthless. Benny swore that oath with us.'),
    say('patricio_old', 'Go to Ardencia. Ask him to stand with Xaraguá, as his father did. Take Yari. Take your papers.'),
    say(G, 'And if he says no?'),
    { speaker: 'patricio_old', text: 'Then ask him why his father said yes.', set: { 'story.ardencia_asked': true, 'act2.complete': true } },
  ]),
  simple('patricio_home_talk', [
    say('patricio_old', 'Ardencia is across the strait. The trader that brought you home sails again at noon.'),
    say('patricio_old', 'Rael will test you before he listens. Benny always did.'),
  ]),
  simple('anicette_home_talk', [
    say('anicette', 'Eat something before you go anywhere. Governors and lords can wait for soup.'),
  ]),

  script('patricio_old_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'act1.complete' }, to: 'farewell' },
        { if: { flag: 'story.yari_asked' }, to: 'joined' },
        { if: { flag: 'story.anissa_woke' }, to: 'after' },
        { if: { flag: 'story.met_patricio' }, to: 'waiting' },
        { to: 'meet' },
      ],
    },
    meet: {
      speaker: 'patricio_old',
      set: { 'story.met_patricio': true },
      lines: [
        { text: 'Gianna? Anissa? But the bridge... they told me it fell at dawn.' },
        say(G, 'The rope bridge fell. We came over the Chain Bridge.'),
        { text: 'The Chain Bridge.' },
        { text: 'I raised that bridge the night before the signing. And I lowered it again before morning. I never knew why.' },
        { text: 'I stood at the winch, and it was as if someone at my shoulder said: leave it down.' },
        nar('His eyes go to the Locket at your throat.'),
        { text: 'So Anicette gave it to you. Then I suppose I do know why.' },
        say(G, 'Grandfather, I was... you. For a little while.'),
        { text: 'Hm. I hope I was polite to you.' },
        { text: 'Fifty years I have read the names at this lamp. Tonight it will not take a flame. Not from me, not from anyone.' },
        { text: 'Without the lamp the names are not read, and people go home with their grief still in their mouths.' },
        { text: 'Will you try, archivist? You were always better with fire than I was.' },
      ],
    },
    waiting: {
      speaker: 'patricio_old',
      lines: [{ text: 'Try the lamp, Gianna. Your mother could never light it either, at your age. It is a stubborn old thing.' }],
    },
    after: {
      speaker: 'patricio_old',
      lines: [
        { text: 'In fifty years I never saw it burn like that.' },
        { text: 'The lookouts say a canoe has come in from Xaraguá. Go and see who it is.' },
      ],
    },
    // Yari is walking behind Gianna now: he no longer sends her to see who it is.
    joined: {
      speaker: 'patricio_old',
      lines: [
        { text: 'Xaraguá. So that is where the lights were seen from.' },
        { text: 'Finish what you owe this city, Gianna. Then go.' },
      ],
    },
    // Grandmother says "Ask them, not the Crown" at the dock now (decision C, Oct 19).
    farewell: {
      speaker: 'patricio_old',
      lines: [
        { text: 'Go carefully, both of you.' },
        { if: { flag: 'item.marshal_whistle' }, text: 'And Gianna: keep the whistle close. Somebody in Zetwal will always remember its note.' },
        // A save that finished Chapter 1 before the dawn farewell existed.
        { if: { notFlag: 'item.marshal_whistle' }, text: 'And Gianna: in Xaraguá, ask them what we promised. Ask them, not the Crown.' },
      ],
    },
  }),

  script('gaze_lamp', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.anissa_woke' }, to: 'lit' },
        { if: { flag: 'story.met_patricio' }, to: 'wake' },
        { to: 'cold' },
      ],
    },
    cold: { lines: [nar('The great Gaze lamp. Cold, and full of oil.')] },
    wake: {
      lines: [
        say(G, 'Let me try.'),
        nar('You cup your hands and call a small flame, the way you were taught in the archive.'),
        nar('It is a good flame: small, steady, and it wastes nothing.'),
        nar("At the lamp's lip it gutters out, as if the lamp is waiting for something else."),
        say(A, 'Gigi...'),
        say(A, "It's calling me. Like someone saying my name from very far away."),
        say(G, 'Anissa? Stay back. Let me...'),
        say(A, "I can't stop it. I'm sorry, I can't..."),
        nar('Light pours out of Anissa. Not fire: light, the color of morning through water.', { fx: 'flash', set: { 'story.lamp_lit': true } }),
        // Staged (demo review, Oct 17): the lamp and the island's lanterns catch in front of everyone.
        nar('The lamp catches. Then every lantern on the island. Then, across the water, every lantern in Zetwal.', {
          fx: 'flash',
          stage: [{ do: 'sync' }],
        }),
        say(A, "I'm sorry. I didn't mean to. I didn't mean anything."),
        say(G, "Look at me. You didn't break anything. You lit it."),
        say(A, '...Are you scared of me?'),
        say(G, 'Never. Not for one second.'),
        say('patricio_old', 'Anicette always said you carried something, little one. I thought it was only a grandmother talking.'),
        say('patricio_old', 'Now. Read with me, all of you. Say their names.'),
        // The pilgrims come in from the path to read the names with him; the night passes.
        nar('The names are read until the moon is high. Nobody leaves early.', {
          fx: 'fade',
          stage: [
            { do: 'enter', actor: 'pilgrim_a', look: 'pilgrim', from: { x: 14, y: 7 }, to: { x: 11, y: 5 }, facing: 'up', async: true },
            { do: 'enter', actor: 'pilgrim_b', look: 'festival_c', from: { x: 15, y: 7 }, to: { x: 18, y: 6 }, facing: 'up', async: true },
            { do: 'wait', ms: 500 },
            { do: 'enter', actor: 'pilgrim_c', look: 'festival_e', from: { x: 14, y: 7 }, to: { x: 12, y: 6 }, facing: 'up', async: true },
            { do: 'enter', actor: 'pilgrim_d', look: 'festival_h', from: { x: 15, y: 7 }, to: { x: 16, y: 6 }, facing: 'up' },
            { do: 'wait', ms: 400 },
          ],
        }),
        // The hooded stranger from the plaza, at the back of the crowd, then away down the path to the dock.
        nar('At the back of the crowd, a hooded figure watches Anissa for a long moment...', {
          stage: [
            { do: 'enter', actor: 'hooded', look: 'quiet_crown_f_tan', from: { x: 15, y: 7 }, to: { x: 15, y: 6 }, facing: 'up-left' },
            { do: 'wait', ms: 1200 },
          ],
        }),
        nar('...then slips away toward the dock.', {
          stage: [
            { do: 'look', actor: 'hooded' },
            { do: 'exit', actor: 'hooded', to: { x: 15, y: 18 } },
            { do: 'look', actor: 'player' },
          ],
        }),
        nar("The pilgrims go home with the lamp's light on their faces.", {
          set: { 'story.anissa_woke': true },
          stage: [
            { do: 'exit', actor: 'pilgrim_a', to: { x: 14, y: 7 }, async: true },
            { do: 'exit', actor: 'pilgrim_c', to: { x: 14, y: 7 }, async: true },
            { do: 'exit', actor: 'pilgrim_b', to: { x: 15, y: 7 }, async: true },
            { do: 'exit', actor: 'pilgrim_d', to: { x: 15, y: 7 } },
          ],
        }),
      ],
    },
    lit: { lines: [nar('The lamp burns with a light that is not quite fire. It is warm, and it does not flicker.')] },
  }),

  script('acolyte_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'acolyte',
      lines: [{ text: 'The Gaze lamp has burned at every reading for fifty years. Tonight it will not take a flame. Elder Patricio is beside himself.' }],
    },
    after: {
      speaker: 'acolyte',
      lines: [{ text: 'Your sister... is she all right? She looked so frightened. And so bright.' }],
    },
  }),

  script('temple_porter_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'temple_porter',
      lines: [{ text: 'Gianna! How did you... the OLD bridge? Never mind. Your grandfather is at the lamp. It will not light.' }],
    },
    after: {
      speaker: 'temple_porter',
      lines: [{ text: "Twenty years I've swept this temple. I'll be sweeping up light for a week." }],
    },
  }),

  // After the lamp she gives Z-4 The Seventh Stone (secret: nothing points to her; the quest's lines are below).
  script('mourner_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'mourner',
      lines: [{ text: "My husband's name is on the third stone. I come every year. This year I wasn't sure anyone would hear it." }],
    },
    after: {
      lines: [],
      next: [
        { if: { flag: Z4.done }, to: 'z4_sung' },
        { if: { flag: Z4.accepted }, to: 'z4_remind' },
        { to: 'z4_offer' },
      ],
    },
    ...MOURNER_Z4,
  }),

  script('fisher_island_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'fisher_island',
      lines: [{ text: 'Stuck here since dawn with a boat full of flowers and no one to sell them to.' }],
    },
    after: {
      speaker: 'fisher_island',
      lines: [{ text: 'That canoe came all the way from Xaraguá. Brave, or in a great hurry.' }],
    },
  }),

  script('name_stones', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.cane_name.accepted' }, { notFlag: 'side.cane_name.stones' }] }, to: 'search' }, { to: 'look' }],
    },
    look: {
      lines: [nar('Name stones, worn smooth by hands: the dead of the Alliance War.'), nar('Zetwal names and Xaraguá names, side by side.')],
    },
    search: { set: { 'side.cane_name.stones': true }, lines: STONES_READ },
  }),

  // The temple fifty years ago, the night before the signing. With Z-4 open, the first Reading of the Names plays here
  // each visit until the seventh stone is carved (the order is shown once a visit: SECRET-ITEMS.md 1).
  script('temple_echo_enter', {
    start: { lines: [], next: [{ if: { notFlag: 'story.temple_echo_seen' }, to: 'scene' }, { if: Z4_READING, to: 'z4_reading' }] },
    scene: {
      set: { 'story.temple_echo_seen': true },
      lines: [nar('Scaffolding and sawdust. The temple is half built, and the lamp is brand new.'), say(AF, "I've got the door, Gigi.")],
      next: [{ if: Z4_READING, to: 'z4_reading' }],
    },
    ...READING_Z4,
  }),
  simple('lamp_echo', [nar('The Gaze lamp, new and bright with polish. Someone is still fussing with the wick.')]),
  simple('echo_lampwright_talk', [
    say('echo_lampwright', 'The Marshal wants it lit for the signing. As if the goddess keeps to a schedule.'),
    say('echo_lampwright', "She'll light when she's ready. Lamps are like that. So are people."),
  ]),
  simple('echo_builder_talk', [say('echo_builder', "Mind the scaffolding, Marshal. We meant to have her roofed for the first reading of the names. That's tonight.")]),

  // ---- Yari -------------------------------------------------------------------------------------
  script('yari_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'act1.complete' }, to: 'after' },
        { if: { flag: 'story.yari_asked' }, to: 'ready' },
        { to: 'arrive' },
      ],
    },
    arrive: {
      speaker: 'yari',
      lines: [
        // Staged (demo review, Oct 17): Yari ties up at the dock and comes up the path to meet them.
        {
          text: 'Gigi! I saw the lights from the water. Half the coast must have seen them.',
          stage: [
            { do: 'look', actor: 'yari' },
            { do: 'enter', actor: 'yari', look: 'yari', from: { x: 16, y: 18 }, to: { x: 15, y: 14 }, run: true },
            { do: 'face', actor: 'yari', facing: 'player' },
            { do: 'face', actor: 'player', facing: 'down' },
            { do: 'look', actor: 'player' },
          ],
        },
        say(G, 'Yari? You came all the way from Xaraguá?'),
        { text: 'Sailed most of it. Paddled the embarrassing part.' },
        nar("A hutia pokes its nose out of Yari's satchel and sniffs hopefully at your Locket."),
        { text: "No. That one isn't for you. Back in the bag." },
        nar('The hutia retreats, deeply offended.'),
        { text: "Gigi, I didn't come for the festival." },
        { text: 'Crown ships are anchored in our harbor. They brought a paper they call a Charter of Protection.' },
        { text: 'They say an old treaty gives them the right. A clause nobody in Xaraguá was ever shown.' },
        say(G, "Mother said the Crown was talking about Xaraguá again. She didn't say it had already sailed.", { if: { flag: 'choice.farewell_why' } }),
        say(G, 'The Sun Accord. The seventh clause...'),
        { text: "That's what they called it. My elders are ready to sign anything that keeps the peace. I'm not." },
        { text: "Your mother's gone to the Throne. You're the closest thing to a Kay Soley envoy I know." },
        { text: 'Come to Xaraguá. Please.' },
      ],
      // Remembered (Oct 19): at the canoe, and when the ferry lands in Yucayeque (Chapter 2).
      choices: [
        { text: "Of course I'll come.", next: 'sure', set: { 'choice.yari_sure': true } },
        { text: 'Tell me everything on the way.', next: 'everything', set: { 'choice.yari_everything': true } },
      ],
    },
    sure: {
      speaker: 'yari',
      lines: [{ text: "I told my father you'd say that. He said I was a fool to sail this far on a guess. I like being right." }],
      next: 'yes',
    },
    everything: {
      speaker: 'yari',
      lines: [{ text: "On the way? Gigi, it's two days of water. I'll start with the ships. Stop me when you've heard enough." }],
      next: 'yes',
    },
    // Owner decision (Oct 15): Gianna asks for a little time, so the player can finish the city's errands
    // and the boar fight (learning the game while it is still gentle) before the chapter ends.
    yes: {
      speaker: 'yari',
      lines: [
        say(A, "...I'm coming too."),
        { text: 'I hoped you would, Anissa.' },
        say(G, "Soon, Yari. I promise. I have work at the archive, and a few things around the city to finish before I can go."),
        { text: "Then I'll help. Faster that way." },
        { text: 'Mind the Cane Road. A boar was tearing up the cane when I came in. It did not like my face.' },
        { text: 'And Gigi, you will need papers. The Crown boards every boat in our harbor now.' },
        say(G, 'The Hall of the Accord can write them. Up the steps at the head of the plaza.'),
        // She walks with the party from here (demo review, Oct 17); the canoe is where they sail from.
        { text: "I'll walk with you. The hutia can mind the canoe. When you're ready, we sail from here.", set: { 'story.yari_asked': true } },
      ],
    },
    ready: {
      lines: [],
      next: [
        { if: { notFlag: 'story.envoy_papers' }, to: 'ready_papers' },
        // The boar first (owner decision, Oct 16: the first battle is not optional).
        { if: { notFlag: 'encounter.wilds.boar.won' }, to: 'ready_boar' },
        {
          if: {
            all: [
              { flag: 'side.overdue.done' },
              { flag: 'side.soup.done' },
              { flag: 'side.cane_name.done' },
              { any: [{ flag: 'debate.zetwal_corner.joined' }, { flag: 'debate.zetwal_corner.mediated' }] },
              { flag: 'encounter.wilds.boar.won' },
            ],
          },
          to: 'ready_all',
        },
        { to: 'ready_errands' },
      ],
    },
    ready_papers: {
      speaker: 'yari',
      lines: [
        { text: 'Did the Hall write your papers? No papers, no landing. The Crown turns back every boat without them.' },
        say(A, 'The Hall of the Accord, Gigi. Up the steps at the head of the plaza.'),
      ],
    },
    ready_boar: {
      speaker: 'yari',
      lines: [
        { text: 'Not with that boar still loose on the Cane Road. It charged three cane cutters this morning.' },
        { text: "We don't sail off and leave them to it. Out through the east gate, Gigi. I'll come with you." },
        say(A, 'The Cane Road, Gigi. Past the east gate, where the cane starts.'),
      ],
    },
    // Chapter 1 ends only once Pòdlimyè's quests are done (owner decision, Oct 18): no leaving them behind.
    ready_errands: {
      speaker: 'yari',
      lines: [
        { text: 'Not with work still waiting in Pòdlimyè, Gigi. Your Quests page says otherwise.' },
        { text: "Finish it. The tide comes back twice a day. I'll be here." },
      ],
    },
    ready_all: {
      speaker: 'yari',
      lines: [{ text: 'Books back, soup delivered, a name carved, a recruiter answered, and the boar sorry it met us. Ready?' }],
      choices: [
        { text: "Let's go.", next: 'depart' },
        { text: 'Not yet.', next: 'later' },
      ],
    },
    later: {
      speaker: 'yari',
      lines: [{ text: 'Then we wait. The hutia is guarding the canoe. Badly.' }],
    },
    // Departure at dawn (decision C with the whistle, Oct 19): both grandparents walk down to Yari's dock.
    // Grandmother brings food and Grandfather's words; Grandfather gives Gianna his Marshal's whistle. They wave
    // from the dock; the voyage scene (data/voyages.ts) shows the canoe putting out.
    depart: {
      speaker: 'yari',
      lines: [
        nar('The island sleeps. At first light the tide turns, and Yari loads the canoe.', { fx: 'fade' }),
        say('anicette', 'Gianna! Anissa! Not one step into that canoe until I have seen you both.', {
          stage: [
            { do: 'look', actor: 'anicette' },
            { do: 'walk', actor: 'npc:patricio_old', to: { x: 14, y: 16 }, facing: 'right', async: true },
            { do: 'enter', actor: 'anicette', look: 'anicette', from: { x: 2, y: 9 }, to: { x: 14, y: 17 }, facing: 'right' },
            { do: 'look', actor: 'player' },
            { do: 'face', actor: 'player', facing: 'left' },
          ],
        }),
        say('anicette', 'Kasav from my own griddle, for the water. Eat it before the hutia does.', { set: { 'item.anicette_kasav': 3 } }),
        nar("(Gianna received Grandmother's kasav.)"),
        say('anicette', 'And in Xaraguá, listen first. Ask them what we promised. Ask them, not the Crown.'),
        say('patricio_old', 'Your grandmother says it better than I ever did. So I will only give you this.'),
        nar("Grandfather presses a small brass whistle into Gianna's hand, worn smooth on its cord.", { set: { 'item.marshal_whistle': true } }),
        say('patricio_old', 'My whistle, from the year of the Accord. Every company in Zetwal knew its note.'),
        say('patricio_old', 'Keep it close. One day Zetwal may need to hear it again.'),
        nar("(Gianna received the Marshal's whistle.)"),
        say(A, 'Goodbye, Zetwal.'),
        // Yari's answer at the dock (yari_talk arrive), remembered.
        { if: { flag: 'choice.yari_sure' }, text: "'Of course,' you said. Hold on to that when you see the harbor." },
        { if: { flag: 'choice.yari_everything' }, text: 'Everything, on the way. I hope you like ships. Out there, there is nothing else to talk about.' },
        {
          text: 'Xaraguá, then. Before the tide changes its mind.',
          stage: [
            { do: 'exit', actor: 'yari', to: { x: 16, y: 18 }, async: true },
            { do: 'wait', ms: 300 },
            { do: 'exit', actor: 'follower', to: { x: 16, y: 18 } },
          ],
        },
        nar('On the dock, Grandmother and Grandfather lift their hands, and keep them raised as the canoe pulls away.', {
          set: { 'act1.complete': true, 'travel.next': 'xaragua-village/pier', 'voyage.next': 'zetwal_xaragua' },
          stage: [
            { do: 'face', actor: 'anicette', facing: 'down' },
            { do: 'face', actor: 'npc:patricio_old', facing: 'down' },
          ],
        }),
      ],
    },
    after: {
      lines: [],
      // A save that finished Chapter 1 before the ferry existed (the demo build) still needs a way to sail
      // (owner report, Oct 17: "it won't let me leave with Yari").
      next: [{ if: { notFlag: 'story.xaragua_arrived' }, to: 'sail' }, { to: 'tide' }],
    },
    sail: {
      speaker: 'yari',
      lines: [{ text: 'The tide is right, Gigi. The canoe is loaded and the hutia is aboard. Ready?' }],
      choices: [
        { text: "Let's go.", next: 'sail_go' },
        { text: 'Not yet.', next: 'later' },
      ],
    },
    sail_go: {
      speaker: 'yari',
      lines: [{ text: 'Xaraguá, then.', set: { 'travel.next': 'xaragua-village/pier', 'voyage.next': 'zetwal_xaragua' } }],
    },
    tide: {
      speaker: 'yari',
      lines: [{ text: "Morning tide. Don't be late, or I'll let the hutia pack for you." }],
    },
  }),

  // ---- The new sections: the Temple Archive, the Hall of the Accord, the Cane Road ----------------
  // ---- Vendors: a greeting, then their shop opens -----------------------------------------------
  simple('smith_talk', [
    say('smith', 'Bonjou!', { translation: 'Hello!' }),
    say('smith', 'Festival or not, the forge stays hot. Blades, bows, a good vest. Look all you like, archivist.'),
  ]),
  simple('charm_seller_talk', [
    say('charm_seller', 'Bonjou, cherie! Kijan ou ye?', { translation: 'Hello, dear! How are you?' }),
    say('charm_seller', 'Charms stitched by hand. Every sun on them took me an hour. Every hour, I prayed.'),
  ]),
  simple('grocer_talk', [
    say('grocer', 'Bonjou! Mango, soup, akasan. Festival prices, festival smiles.', { translation: 'Hello!' }),
  ]),

  script('archivist_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.overdue.done' }, to: 'after' },
        { if: { all: [{ flag: 'side.overdue.ferry' }, { flag: 'side.overdue.soup' }, { flag: 'side.overdue.vol2' }] }, to: 'returned' },
        { if: { flag: 'side.overdue.accepted' }, to: 'remind' },
        { if: { flag: 'lore.zetwal_ash_wars_temple' }, to: 'ash' },
        { to: 'first' },
      ],
    },
    first: {
      speaker: 'archivist',
      lines: [
        { if: { notFlag: 'story.anissa_woke' }, text: 'Festival day, Gigi, and you come to work? The archive is open to anyone today. Read what you like.' },
        { if: { flag: 'story.anissa_woke' }, text: 'Festival night, Gigi, and you come to work? The archive is open to anyone tonight. Read what you like.' },
        { text: 'The history shelf needs sorting. Three books on the Ash Wars, and no two agree on anything.' },
      ],
      next: 'offer',
    },
    ash: {
      speaker: 'archivist',
      lines: [
        { text: 'You read the temple record of Cendre ford. Forty dead, not four hundred.' },
        { text: 'Somebody wanted the Lord of Ardencia feared. Your grandmother has opinions about who. She will not share them with me.' },
      ],
      next: 'offer',
    },
    // Side quest: The Overdue Shelf.
    offer: {
      speaker: 'archivist',
      lines: [
        { text: 'And while you are here: your overdue list. The ferryman, the soup vendor, and your grandmother.' },
        { text: 'Today everyone is in a good mood. Today they might even give the books back.' },
      ],
      choices: [
        { text: "I'll get them back.", next: 'accept' },
        { text: 'Not today.' },
      ],
    },
    accept: {
      speaker: 'archivist',
      set: { 'side.overdue.accepted': true },
      lines: [
        { text: 'Bless you. Be firm with the ferryman. Be gentle with your grandmother. Be quick with the soup vendor, or she will feed you.' },
        nar('(The Overdue Shelf is in the Quests page of the menu.)'),
      ],
    },
    remind: {
      speaker: 'archivist',
      lines: [
        { text: 'Any luck with the overdue books?' },
        { if: { notFlag: 'side.overdue.ferry' }, text: 'The ferryman will tell you the sea has his. The sea has never borrowed a book from us.' },
        { if: { notFlag: 'side.overdue.soup' }, text: 'The soup vendor has the pumpkin book. Brace yourself for page forty.' },
        { if: { notFlag: 'side.overdue.vol2' }, text: 'Your grandmother has Volume Two. Three years. I have stopped asking. I have started praying.' },
      ],
    },
    returned: {
      speaker: 'archivist',
      set: { 'side.overdue.done': true },
      lines: [
        { text: 'All three. Damp, souped, and... Volume Two. In your grandmother\'s hand, in every margin.' },
        { text: 'She wrote in a library book. I should be furious. I think the margins are worth more than the book.' },
        { text: 'It goes on the Tales shelf. Volume One is still missing, mind. Nobody has signed it out.' },
        { text: 'Someday it will turn up somewhere strange. Books do.' },
      ],
    },
    after: {
      speaker: 'archivist',
      lines: [{ text: "Volume Two is on the Tales shelf. Read your grandmother's margins. Then tell me who she thinks wanted Rael feared." }],
    },
  }),

  // The Envoy's Papers (owner decision, Oct 15: the one task at the Hall of the Accord in Chapter 1; Batch D,
  // Oct 19: in one visit). Crown ships search every boat at Xaraguá, so Gianna needs envoy papers: written by
  // the Hall clerk, sealed with the Head of State's seal (re-cut by the engraver, who walks it in himself the
  // night the lamps light), then signed by the Chancellor. Yari will not sail without them.
  // Saves from before Batch D still finish: a seal fetched from the Iron Market (`item.elodie_seal`) is taken
  // as before (`issue`), and a player sent to the market (`story.papers_asked`) meets the engraver here too.
  script('hall_clerk_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.envoy_papers' }, to: 'after' },
        { if: { flag: 'story.papers_sealed' }, to: 'sign' },
        { if: { flag: 'item.elodie_seal' }, to: 'issue' },
        { if: { flag: 'story.papers_asked' }, to: 'sent' },
        { if: { flag: 'story.yari_asked' }, to: 'ask' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'hall_clerk',
      lines: [
        { text: 'Welcome to the Hall of the Accord. A copy of the Sun Accord for any citizen who asks: that is the law, and I am proud of it.' },
        { text: 'The original? Sealed in the vault. Only the Head of State and the Marshal have ever read all of it.' },
        { text: 'Your mother left me a list of things to do while she is at the Throne. It is longer than the Accord.' },
      ],
    },
    ask: {
      speaker: 'hall_clerk',
      lines: [
        say(G, 'I need travelling papers. Xaraguá has asked for an envoy of Kay Soley, and Mother is at the Throne.'),
        { text: 'An envoy. To Xaraguá. With Crown ships in the harbor.' },
        { text: 'Then you need papers more than courage. The Crown boards every boat now. Without papers they turn you back, or keep you.' },
        { text: "I write them; the Head of State's seal goes on them; the Chancellor signs. The seal is the trouble." },
        { text: 'Your mother sent it to be re-cut before she left. Fifty years of laws had worn the sun on it smooth.' },
      ],
      next: 'engraver',
    },
    // An old save: sent to the Iron Market for the seal before the engraver brought it himself.
    sent: {
      speaker: 'hall_clerk',
      lines: [{ text: 'Back from the Iron Market already? Then you passed him on the way. The engraver sent word: he is bringing it himself.' }],
      next: 'engraver',
    },
    // Staged (owner rule, Oct 17; decision B, Oct 19): the engraver walks the seal in through the front doors,
    // looks Gianna over, hands it to the clerk (it is his to keep), and walks out again.
    engraver: {
      speaker: 'hall_clerk',
      lines: [
        nar("Behind you, the Hall's front doors swing open.", {
          stage: [
            { do: 'look', actor: 'engraver' },
            { do: 'enter', actor: 'engraver', look: 'engraver', from: { x: 19, y: 28 }, to: { x: 22, y: 26 }, facing: 'up' },
            { do: 'look', actor: 'player' },
          ],
        }),
        say('engraver', "Clerk! The Head of State's seal, re-cut. I finished it at sundown."),
        say('engraver', 'Then every lamp in the city lit at once, and I thought: tonight, somebody is going to need a seal.'),
        nar("He unwraps a cloth. Mother's seal: a heavy brass sun, its rays cut fresh and sharp."),
        say(A, "Mother's seal... I've never even seen it up close."),
        say('engraver', "Who is it for? Let me see you... Her eyes. Your grandfather's ink on your fingers.", {
          stage: [{ do: 'face', actor: 'engraver', facing: 'left' }],
        }),
        say('engraver', 'Here, clerk. For her papers, and nobody else tonight.', { stage: [{ do: 'face', actor: 'engraver', facing: 'up' }] }),
        { text: 'Look at that sun. Sharp enough to cut the paper it signs.' },
        nar("The clerk writes in a careful hand, warms the wax, and presses Mother's seal into it."),
        { text: 'Gianna Limyè, envoy of Kay Soley to Xaraguá, under the seal of the Head of State. Now the Chancellor signs.' },
        say('engraver', "Goodnight, envoy. I'll sleep tonight. First time this week.", {
          stage: [{ do: 'face', actor: 'engraver', facing: 'left' }],
        }),
        {
          text: "Her office is off the gallery, the first door east. The seal stays here with me; I'll sleep better too.",
          set: { 'item.draft_papers': 1, 'story.papers_sealed': true },
          stage: [{ do: 'exit', actor: 'engraver', to: { x: 19, y: 28 }, async: true }],
        },
        nar('(Gianna received the unsigned envoy papers. The Chancellor must sign them.)'),
      ],
    },
    // An old save: Gianna carries the seal from the Iron Market.
    issue: {
      speaker: 'hall_clerk',
      lines: [
        say(G, 'The seal. Re-cut.'),
        { text: 'Look at that sun. Sharp enough to cut the paper it signs.' },
        nar("The clerk writes in a careful hand, warms the wax, and presses Mother's seal into it."),
        { text: 'Gianna Limyè, envoy of Kay Soley to Xaraguá, under the seal of the Head of State. Now the Chancellor signs.' },
        {
          text: "Her office is off the gallery, the first door east. The seal stays here with me; I'll sleep better.",
          set: { 'item.elodie_seal': 0, 'item.draft_papers': 1, 'story.papers_sealed': true },
        },
        nar('(Gianna received the unsigned envoy papers. The Chancellor must sign them.)'),
      ],
    },
    sign: {
      speaker: 'hall_clerk',
      lines: [{ text: "The Chancellor's office: up the gallery, the first door on the east side. She signs everything. Eventually." }],
    },
    after: {
      speaker: 'hall_clerk',
      lines: [{ text: 'Keep the papers on you, envoy. The Crown reads seals far more carefully than it reads treaties.' }],
    },
  }),
  script('chancellor_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.envoy_papers' }, to: 'after' },
        { if: { flag: 'story.papers_sealed' }, to: 'sign' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'chancellor',
      lines: [
        { text: 'Gianna. Your mother left me the Hall, the council and three Crown ships. I would trade any two of them for a quiet week.' },
        { text: 'While she is at the Throne, I govern in her name. Not in her chair. Nobody sits in that chair.' },
        { text: "The Crown's consul asks for an audience every morning. Every morning I am busy. It is becoming a long week." },
      ],
    },
    // The envoy's paper (decision D, revised Oct 19). Late at night the Crown's consul, waiting in the gallery,
    // walks in to ask why every lamp in the city lit tonight, and lays his own paper on the desk. No clause
    // and no Throne: Chapter 2's council keeps those. He leaves the Hall for good (zetwal-hall.ts `if`).
    sign: {
      speaker: 'chancellor',
      lines: [
        { text: 'Envoy papers. Xaraguá.' },
        nar('She reads every line. Twice. Then she looks past you, at the door.'),
        say('crown_consul', 'Chancellor. Forgive the hour. Every lamp in Pòdlimyè lit itself at once tonight. His Majesty would like to know why.', {
          stage: [
            { do: 'look', actor: 'npc:crown_consul' },
            { do: 'walk', actor: 'npc:crown_consul', to: { x: 33, y: 6 }, facing: 'up' },
            { do: 'look', actor: 'player' },
          ],
        }),
        { text: 'So would I, consul. Ask the goddess. She keeps later hours than I do.' },
        nar("He lays a paper of his own on the desk, over Gianna's."),
        say('crown_consul', "Then, since I am here. Zetwal need only acknowledge His Majesty's protection of the southern waters."),
        say('crown_consul', 'One signature. A courtesy between old friends.'),
        { text: 'Nobody signs in that chair while she is away, consul. Least of all that.' },
        say(Y, 'That is their paper. They nailed one like it to our customs house.'),
        // He glances at Anissa, and moves on (no line about it: only the Quiet Crown's watcher notices her aloud).
        say('crown_consul', 'And the envoy herself. Has Zetwal\'s new envoy anything to say to His Majesty?', {
          stage: [
            { do: 'face', actor: 'npc:crown_consul', facing: 'down-left' },
            { do: 'wait', ms: 1000 },
            { do: 'face', actor: 'npc:crown_consul', facing: 'player' },
          ],
        }),
      ],
      choices: [
        { text: "Zetwal's waters are its own.", next: 'waters', set: { 'choice.envoy_waters': true } },
        { text: 'Say nothing.', next: 'quiet' },
      ],
    },
    waters: {
      speaker: 'crown_consul',
      lines: [{ text: 'Spoken like your mother, Miss Limyè. She says it more quietly.' }],
      next: 'signed',
    },
    quiet: {
      speaker: 'crown_consul',
      lines: [{ text: 'Wise. Not everyone in this city is.' }],
      next: 'signed',
    },
    signed: {
      speaker: 'chancellor',
      lines: [
        nar("The Chancellor slides Gianna's papers out from under his, and signs them while he watches."),
        { text: 'Your mother went to the Throne to speak for us. You go to Xaraguá to listen for us. Listen well.' },
        { text: 'And write. The courier office will find you anywhere a pigeon can fly.', set: { 'item.draft_papers': 0, 'item.envoy_papers': 1, 'story.envoy_papers': true } },
        nar("(Gianna received the envoy papers, sealed and signed.)"),
        { text: 'Goodnight, consul. Take your paper with you.' },
        nar('He rolls it up, bows to the Chancellor, and walks out of the Hall.', {
          stage: [
            { do: 'face', actor: 'npc:crown_consul', facing: 'up' },
            { do: 'wait', ms: 400 },
            { do: 'exit', actor: 'npc:crown_consul', to: { x: 26, y: 6 } },
            { do: 'sync' },
          ],
        }),
      ],
    },
    after: {
      speaker: 'chancellor',
      lines: [{ text: 'Go carefully, envoy. Whatever you learn in Xaraguá, this Hall will want to hear it before the Crown does.' }],
    },
  }),
  simple('hall_seat', [
    nar('The Throne of the State: a plain chair of gold-leafed mahogany on its dais, a sun carved in the back.'),
    nar('Here the Head of State gives audience, hears the council, and makes the laws of Zetwal.'),
    say(A, "Mother's shawl is still over the arm. It's strange to see it empty."),
  ]),
  simple('hall_sign', [
    nar('THE HALL OF THE ACCORD. Seat of the State of Zetwal. Open to every citizen, every day the sun rises.'),
    nar('Below, in chalk: "Council sits tonight. Petitions to the clerk. Complaints about the soup vendor, also the clerk."'),
  ]),
  simple('accord_statue', [
    nar('Three bronze figures with their hands raised over a scroll: a soldier, a cane cutter and a scribe.'),
    nar('The plaque: "Fifty years ago we promised that no crown would ever again decide who we are."'),
    say(A, 'The soldier has Grandfather\'s nose.'),
  ]),

  // ---- Accord Square ----------------------------------------------------------------------------
  simple('honor_guard_talk', [
    say('honor_guard', 'The Hall is open to every citizen. We are here for the ones who are not citizens, archivist.'),
  ]),
  simple('honor_guard_2_talk', [
    say('honor_guard', 'Stand straight, they told me. Look proud. Nobody said for how long. It has been since sunrise, archivist.'),
  ]),
  simple('gazette_crier_talk', [
    say('gazette_crier', 'Gazette! Crown ships off the point! Council to sit tonight! Festival a great success, says festival committee!'),
    say('gazette_crier', 'One sou, archivist. The truth costs more, but the gazette is cheaper.'),
  ]),
  simple('petitioner_talk', [
    say('petitioner', 'Three days I have waited to see the Chancellor about my fence. My neighbor\'s goat has opinions about my fence.'),
    say('petitioner', 'The Crown man went in ahead of me. He had no fence at all. Only papers.'),
  ]),
  simple('protester_talk', [
    say('protester', 'No Charter for Zetwal! No Charter for Xaraguá! No Charter for anybody!'),
    say('protester', 'They say the Crown only wants a harbor. That is what they said fifty years ago. Ask your grandfather.'),
  ]),
  simple('courier_rider_talk', [
    say('courier_rider', 'Three days to the far coast and three back. My horse knows the road better than I do. She is better company too.'),
  ]),
  simple('nursemaid_talk', [
    say('nursemaid', 'The councillors\' children, all six. I bring them to see the statue. They want to climb it. It is a matter of national dignity.'),
  ]),

  // ---- The Hall of the Accord inside -------------------------------------------------------------
  simple('hall_guard_talk', [
    say('hall_guard', 'Wipe your feet, archivist. The steward counts the footprints. I have seen him do it.'),
  ]),
  simple('hall_guard_2_talk', [
    say('hall_guard', 'He checks your feet, I check your face. Yours will do, archivist. There is ink on your nose.'),
  ]),
  simple('hall_page_talk', [
    say('hall_page', 'Council west, the Chancellor and the couriers east, the throne at the end. I run between all of them. Forty times a day.'),
    say('hall_page', 'If you have a message, I am faster than a pigeon. Mostly. Not uphill.'),
  ]),
  simple('hall_steward_talk', [
    { speaker: 'hall_steward', if: { notFlag: 'story.envoy_papers' }, text: 'The portraits are dusted every morning, the floors every evening, and the consul is watched at all hours.' },
    { speaker: 'hall_steward', if: { flag: 'story.envoy_papers' }, text: 'The portraits are dusted every morning, the floors every evening, and the consul, until tonight, was watched at all hours.' },
    say('hall_steward', 'The last is not my job. I do it anyway.'),
  ]),
  simple('throne_usher_talk', [
    say('throne_usher', 'No one sits on the Throne of the State but the Head of State. Not the Chancellor, not the Speaker, not the cat.'),
    say('throne_usher', 'The cat has tried. The cat has been told.'),
  ]),
  simple('council_speaker_talk', [
    say('council_speaker', 'Order. Order. Oh, it is only you, Gianna. Forgive me; I say it out of habit, even at breakfast.'),
    say('council_speaker', 'The council sits tonight about the ships. Half want peace at any price, half want the old harbor chain raised.'),
    say('council_speaker', 'My task is to let them both be heard, then let your mother decide. Without her, we only argue louder.'),
  ]),
  simple('elder_dove_talk', [
    say('elder_dove', 'Peace has kept Zetwal fed for fifty years, child. If a paper keeps those ships quiet, I will sign it twice.'),
    say('elder_dove', 'Your grandfather fought so that you would never have to. Do not let anyone make a soldier of you. Not even him.'),
  ]),
  simple('elder_hawk_talk', [
    say('elder_hawk', 'Three Crown ships off the point. I asked the council to raise the old harbor chain. They called me a warmonger.'),
    say('elder_hawk', 'Fifty years ago they called your grandfather the same. Then they built him a statue.'),
  ]),
  script('crown_consul_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'late' }, { to: 'day' }] },
    day: {
      lines: [
        say('crown_consul', 'Ah, the Head of State\'s daughter. His Majesty\'s consul to Zetwal, at your service. Truly.'),
        say('crown_consul', 'I bring nothing but goodwill and a few papers to sign. The Chancellor will see me tonight, I am sure.'),
        say('crown_consul', 'We have so much to discuss. The old treaties are so long, and so very few people have read all of them.'),
        say(A, "Gigi... I don't like him."),
      ],
    },
    // After the lamp he waits outside the Chancellor's office (decision D, Oct 19), until her scene.
    late: {
      lines: [
        say('crown_consul', 'Every lamp in the city lit at once tonight, Miss Limyè. Someone must know why.'),
        say('crown_consul', 'The Chancellor keeps late hours. Tonight, so does His Majesty\'s consul.'),
      ],
    },
  }),
  script('foreign_envoy_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.envoy_papers' }, to: 'gone' },
        { if: { flag: 'story.anissa_woke' }, to: 'late' },
        { to: 'day' },
      ],
    },
    day: {
      lines: [
        say('foreign_envoy', 'I came across the sea to speak with your Head of State, and she has gone to the Throne the same week. Such is diplomacy.'),
        say('foreign_envoy', 'I will wait. The Crown\'s consul waits too, across the room. We smile at each other. Neither of us means it.'),
        say(G, 'Where are you from?'),
        say('foreign_envoy', 'Far enough that you will need a ship and a good reason. Perhaps one day you will have both.'),
      ],
    },
    late: {
      lines: [
        say('foreign_envoy', 'The Crown\'s consul went to wait at the Chancellor\'s door the moment the lamps lit. He did not invite me.'),
      ],
    },
    gone: {
      lines: [
        say('foreign_envoy', 'The Crown\'s consul came back from the Chancellor without his smile, and left the Hall. I kept mine.'),
      ],
    },
  }),
  script('seal_keeper_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.papers_sealed' }, to: 'back' }, { to: 'idle' }] },
    idle: {
      speaker: 'seal_keeper',
      lines: [
        { text: 'I am the Keeper of the Seal. I keep the seal. Usually.' },
        { text: 'Your mother sent it to the engraver to be re-cut, and I have not slept since.' },
        { text: 'A keeper with nothing to keep is only a man in a robe.' },
      ],
    },
    back: {
      speaker: 'seal_keeper',
      lines: [{ text: 'The seal is home! Re-cut, too. Look at those rays. I may weep. I may already be weeping.' }],
    },
  }),
  simple('chief_courier_talk', [
    say('chief_courier', 'Pigeons to every island in a day, riders to the far coast in three. When the Hall speaks to the realm, it speaks from this room.'),
    say('chief_courier', 'Lately more letters come in than go out. Most of them ask the same thing: what does the Crown want?'),
  ]),
  simple('treasurer_talk', [
    say('treasurer', 'Every coin the state of Zetwal owns passes through these boxes, and I count it twice. Three times on festival days.'),
    say('treasurer', 'The Crown ships pay their harbor dues in promises. Promises do not stack well.'),
  ]),
  simple('scribe_talk', [
    say('scribe', 'Every law is copied six times: one for the vault, one for the Hall, one for each district. My hand has not stopped since spring.'),
  ]),
  simple('scribe_2_talk', [
    say('scribe', 'He copies the laws. I copy the Crown\'s letters. Theirs are longer, and they say less.'),
    say('scribe', 'Lately every letter ends the same way: "with the deepest respect." I have started to count the respect. It is going down.'),
  ]),
  simple('council_desk', [
    nar("The Speaker's desk: a bell, an hourglass for long speeches, and a gavel worn pale where it has been banged."),
    nar('Tonight\'s order of business, in a neat hand: "1. The Crown ships. 2. The Crown ships. 3. The festival accounts."'),
  ]),
  simple('pigeon_loft', [
    nar('The pigeons of the Hall, each with a ring on its leg naming its island. They coo in a dozen accents.'),
  ]),
  simple('courier_map', [
    nar("The courier routes, pinned across the realm: red threads to every capital, and new black pins off Xaraguá's coast."),
  ]),
  simple('treasury_chests', [
    nar('Iron-bound strongboxes, each with three locks. The Treasurer has one key, the Chancellor another, the Head of State the third.'),
  ]),
  simple('portrait_patricio', [
    nar('MARSHAL PATRICIO, THE YEAR OF THE ACCORD. Young, in his red coat, one hand on a rolled map, looking past the painter.'),
    say(A, 'He looks so serious. He never looks that serious when he tells stories.'),
  ]),
  simple('portrait_solange', [
    nar('MOTHER SOLANGE, KEEPER OF THE NAMES. An old woman with ink on her fingers, a quill in her hand, a list in her lap.'),
  ]),
  simple('portrait_elodie', [
    nar('ELODIE LIMYÈ, HEAD OF STATE. Mother, painted the year she was chosen, gold at her shoulders, not quite smiling.'),
    say(G, 'She hated sitting for this. She read the whole time.'),
  ]),
  simple('portrait_founders', [
    nar('THE SIGNING OF THE SUN ACCORD. A crowded table on the plaza, the Marshal at its head, and at the far end a Crown envoy.'),
    nar('The painter left his face in shadow. Nobody remembers why.'),
  ]),

  // ---- The Iron Market --------------------------------------------------------------------------
  simple('iron_market_hall', [
    nar('THE IRON MARKET. Red iron and green roofs, the clock over the gate five minutes fast since anyone can remember.'),
    nar('Inside it is dark and loud and smells of everything: coffee, mangoes, fish, smoke, soap, rain.'),
  ]),
  // Before Batch D (Oct 19) Gianna fetched the seal here (`seal`, `hurry`); old saves mid-errand still can.
  script('engraver_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'story.papers_asked' }, { notFlag: 'item.elodie_seal' }, { notFlag: 'story.papers_sealed' }] }, to: 'seal' },
        { if: { flag: 'item.elodie_seal' }, to: 'hurry' },
        { if: { flag: 'story.papers_sealed' }, to: 'delivered' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'engraver',
      lines: [
        { text: 'Bonjou, archivist. Names on rings, suns on seals. If it holds still, I can cut it.', translation: 'Hello' },
        { text: 'The Hall keeps me busy. Every new law needs a stamp, and every stamp wears out.' },
      ],
    },
    seal: {
      speaker: 'engraver',
      lines: [
        { text: "The Head of State's seal? Finished it this morning." },
        nar("He unwraps a cloth. Mother's seal: a heavy brass sun, its rays cut fresh and sharp."),
        { text: "I don't hand it to just anyone. Let me see you... Her eyes. Your grandfather's ink on your fingers. Here." },
        { text: "Straight to the clerk, now. If a Crown man sees that in your hand, he'll want to know what you mean to sign.", set: { 'item.elodie_seal': 1 } },
        nar("(Gianna received Mother's seal.)"),
      ],
    },
    hurry: {
      speaker: 'engraver',
      lines: [{ text: 'Go on, to the Hall with it. A seal in a satchel is a worry in my chest.' }],
    },
    // He walked the seal to the Hall himself (Batch D, Oct 19).
    delivered: {
      speaker: 'engraver',
      lines: [{ text: 'Delivered it myself, archivist. Some things you do not trust to a satchel. Not on a night like this one.' }],
    },
  }),
  simple('produce_seller_talk', [
    say('produce_seller', 'Bonjou, cherie!', { translation: 'Hello, dear!' }),
    say('produce_seller', 'Mango! Kasav! Cane juice pressed while you wait! What do you need?'),
  ]),
  simple('spice_seller_talk', [
    say('spice_seller', 'Pikliz to wake the dead, pepper to wake the pikliz. Taste, taste. You only cry a little.'),
  ]),
  simple('cloth_merchant_talk', [
    say('cloth_merchant', 'Cotton from Xaraguá, silk from who-knows-where, robes fit for a temple. Feel this. No, wash your hands first.'),
  ]),
  simple('ironmonger_talk', [
    say('ironmonger', 'Hinges, nails, hooks, chain. The whole city hangs on my iron, archivist, and nobody thanks a nail.'),
    say('ironmonger', 'The Crown ships buy chain by the mile these days. I do not ask what it is for. Lately I wonder.'),
  ]),
  simple('fishmonger_talk', [
    say('fishmonger', 'Snapper, conch, a lobster with a bad attitude. All from this morning. The lobster from this minute.'),
  ]),
  simple('goat_herder_talk', [
    say('goat_herder', 'This one is Pwofesè. He has eaten two hats and a council notice. He knows more law than the Speaker.'),
  ]),
  simple('lottery_seller_talk', [
    say('lottery_seller', 'Borlette! Dream of a fish, play twelve. Dream of a boat, play thirty. Dream of the Crown, play nothing and hide.'),
  ]),
  simple('letter_writer_talk', [
    say('letter_writer', 'Letters written, read aloud, or answered. Love letters cost double. Apologies cost triple.'),
    say('letter_writer', 'Half my trade is people writing to cousins in Xaraguá. Lately the answers come slower. Some do not come at all.'),
  ]),
  simple('porter_talk', [
    say('porter', 'Sixty sacks of rice this morning, forty of charcoal this afternoon. Tonight, one bowl of soup, very slowly.'),
  ]),
  script('pickpocket_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.pickpocket_caught' }, to: 'again' }, { to: 'first' }] },
    first: {
      speaker: 'pickpocket',
      lines: [
        nar('A small hand slides toward your satchel.'),
        say(A, 'Gigi. His hand.'),
        { text: '...I was checking if your bag was closed. It is. Very good. Safe bag. Goodbye.', set: { 'story.pickpocket_caught': true } },
      ],
    },
    again: {
      speaker: 'pickpocket',
      lines: [{ text: 'I am not stealing, I am standing. Standing is free. Ask the Speaker.' }],
    },
  }),
  simple('market_kid_talk', [
    say('market_kid', "The engraver let me hold a seal once. I stamped my arm. Mama says I'm officially a law now."),
  ]),
  simple('market_shopper_talk', [
    say('market_shopper', 'The spice seller charged me double. I paid. You do not argue with a woman holding that many peppers.'),
  ]),

  // ---- The Old Harbor (more here when Gianna comes home) ----------------------------------------
  simple('fishwife_talk', [
    say('fishwife', 'Bonjou! Fish this morning, festival tonight, sore feet tomorrow.', { translation: 'Hello!' }),
    say('fishwife', 'The Crown ships scare off the big schools. My grandmother said the same fifty years ago. The sea remembers who comes calling.'),
  ]),
  simple('net_mender_talk', [
    say('net_mender', 'A net is mostly holes, archivist. The trick is knowing which ones to keep.'),
    say('net_mender', 'Your grandfather once mended a net with me on this very sand. Terrible at it. Never stopped talking about the Accord.'),
  ]),
  simple('customs_clerk_talk', [
    say('customs_clerk', 'Everything that comes into Pòdlimyè by sea passes my table. Rum, cloth, cousins, gossip.'),
    say('customs_clerk', 'This house was the Crown\'s once. They counted every sack of our sugar here. Now we count theirs. A small joy, but mine.'),
  ]),
  simple('customs_sign', [
    nar('CUSTOMS HOUSE OF THE FREE PORT OF PÒDLIMYÈ. Declare your goods. Declare your name.'),
    nar('Under it, an older sign shows through the paint: a crown, and a list of taxes nobody pays anymore.'),
  ]),
  simple('harbor_kid_talk', [
    say('harbor_kid', 'I counted the Crown ships from the pier. Three. My brother says four. My brother cannot count.'),
  ]),
  simple('old_sailor_talk', [
    say('old_sailor', 'Fifty years ago this whole harbor was Crown ships, mast to mast. You could walk across the water on their decks.'),
    say('old_sailor', 'The morning after the Accord they sailed. I watched every one go. Now some are back. I am too old to watch them go twice.'),
  ]),
  simple('ferry_hand_talk', [
    say('ferry_hand', 'The ferry runs when the ferryman is sober and the tide agrees. Today, neither.'),
    say('ferry_hand', 'Come back another day, archivist. The islands will still be there. Probably.'),
  ]),

  // ---- Solèy Heights (more here when Gianna comes home) -----------------------------------------
  simple('gardener_talk', [
    say('gardener', 'Bonjou, ti cheri. Peppers, callaloo, the best basil in Zetwal. Do not tell the market vendor.', { translation: 'Hello, little dear.' }),
    say('gardener', 'These terraces were an orchard once. The soldiers ate every mango the year of the Accord. Grandmothers still complain.'),
  ]),
  simple('poet_talk', [
    say('poet', 'I am writing a poem about the festival. So far I have "light". It is a strong start.'),
    say('poet', 'Come back when I have a second word. It may take years.'),
  ]),
  simple('porch_widow_talk', [
    say('porch_widow', 'My husband carried a lantern in the Revolution. His name is read every year. Every year I sit here and listen for it.'),
    say('porch_widow', 'You are Elodie\'s girl. Tell your mother the Heights still vote, and still remember who fixed the well.'),
  ]),
  simple('lookout_keeper_talk', [
    say('lookout_keeper', 'From here you can see the whole city. The plaza, the Hall, the harbor, the Temple island, and the cane all the way to the hills.'),
    say('lookout_keeper', 'And the Crown ships, just past the point. I keep the old signal fire ready. Nobody has asked me to light it. Yet.'),
  ]),
  simple('lookout_view', [
    nar('All of Pòdlimyè below: the plaza lanterns, the gold dome of the Hall, the boats in the harbor, the lamp on the Temple island.'),
    say(A, "It's so small from up here, Gigi. Everyone we know fits in it."),
  ]),
  simple('lookout_sign', [nar('THE LOOKOUT. Mind the edge. Mind the goats. Mind the poet.')]),
  simple('heights_well', [
    nar('An old stone well. A bucket on a rope, and a carved line on the rim: "Dug by the Heights, for the Heights. Year of the Accord."'),
  ]),

  script('cane_cutter_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.cane_name.recorded' }, { notFlag: 'side.cane_name.done' }] }, to: 'finish' },
        { if: { all: [{ flag: 'side.cane_name.accepted' }, { notFlag: 'side.cane_name.done' }] }, to: 'remind' },
        { if: { flag: 'story.zetwal_return' }, to: 'danger' },
        { if: { flag: 'side.cane_name.done' }, to: 'thanks' },
        { if: { all: [CUTTER_AT_STONES, { flag: 'story.cutter_stones_met' }] }, to: 'island_again' },
        { if: CUTTER_AT_STONES, to: 'island' },
        { to: 'calm' },
      ],
    },
    calm: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'Festival day, archivist! Even the cane gets a rest. The road is as peaceful as it has been in years.' },
        { text: 'Only thing out there today is a veiled woman by the old mill, asking the young ones if they feel alone. Odd sort.' },
      ],
      choices: [
        { text: 'You seem far away today.', next: 'grann' },
        { text: 'Enjoy the rest.' },
      ],
    },
    // After the lamp, at the name stones on the Temple island (decision A, Oct 19).
    island: {
      speaker: 'cane_cutter',
      set: { 'story.cutter_stones_met': true },
      lines: [
        { text: 'Archivist. I crossed the Chain Bridge the moment it came down. I wanted to hear the names read.' },
        { text: 'They read every stone tonight. I listened for one name, and it never came.' },
        { text: 'Before I came over, a veiled woman by the old mill was asking the young ones if they feel alone. Odd sort.' },
      ],
      choices: [
        { text: 'Who were you listening for?', next: 'grann_island' },
        { text: 'Goodnight.' },
      ],
    },
    // Talked to again at the stones after "Goodnight." or "I'm sorry.": no second introduction.
    island_again: {
      speaker: 'cane_cutter',
      lines: [{ text: 'Still no name for her, archivist. Will you read them with me?' }],
      choices: [
        { text: 'Who were you listening for?', next: 'grann_island' },
        { text: 'Goodnight.' },
      ],
    },
    danger: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'You came back at a bad time, archivist. Keep to the road and keep moving.' },
        { text: 'Bandits by day, smugglers by night, and those veiled folk everywhere now.' },
        { text: 'If the cane goes quiet around you, run. The cane is never quiet.' },
      ],
    },
    // Side quest: A Name in the Cane.
    grann: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'Far away? No. Only... the names are read tonight, and my grandmother is on no stone.' },
        { text: 'She cut cane on this road when it was the Crown\'s. Grann, we called her. I never learned her real name.' },
        { text: 'The Crown wrote cutters down as numbers. By the time anyone asked her name, she had stopped saying it.' },
      ],
      choices: [
        { text: "I'll look for her name.", next: 'accept' },
        { text: "I'm sorry.", next: 'sorry' },
      ],
    },
    grann_island: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'My grandmother. She cut cane on the Cane Road when it was the Crown\'s. Grann, we called her. I never learned her name.' },
        { text: 'The Crown wrote cutters down as numbers. By the time anyone asked her name, she had stopped saying it.' },
      ],
      choices: [
        { text: "I'll look for her name.", next: 'accept' },
        { text: "I'm sorry.", next: 'sorry' },
      ],
    },
    sorry: { speaker: 'cane_cutter', lines: [{ text: 'So am I, archivist. But sorry never carved a stone.' }] },
    accept: {
      speaker: 'cane_cutter',
      set: { 'side.cane_name.accepted': true },
      lines: [
        { if: { not: CUTTER_AT_STONES }, text: 'You would? Then start at the name stones on the Temple island. If she is anywhere, she is there.' },
        { if: CUTTER_AT_STONES, text: 'You would? Then read them with me. I have read them twice. I may have missed her.' },
        nar('(A Name in the Cane is in the Quests page of the menu.)'),
      ],
      next: [{ if: CUTTER_AT_STONES, to: 'together' }],
    },
    // At the stones, Gianna reads them beside him: step 1 done on the spot.
    together: {
      speaker: 'cane_cutter',
      set: { 'side.cane_name.stones': true },
      lines: [
        { ...STONES_READ[0]!, stage: [{ do: 'face', actor: 'npc:cane_cutter', facing: 'left' }] },
        ...STONES_READ.slice(1, 3),
        { text: 'My mother always said Grann loved the flowers by the east gate. The roses.', stage: [{ do: 'face', actor: 'npc:cane_cutter', facing: 'player' }] },
        STONES_READ[3]!,
      ],
    },
    remind: {
      lines: [],
      next: [{ if: { all: [CUTTER_AT_STONES, { notFlag: 'side.cane_name.stones' }] }, to: 'together' }, { to: 'remind_lines' }],
    },
    remind_lines: {
      speaker: 'cane_cutter',
      lines: [
        {
          if: { all: [CUTTER_AT_STONES, { flag: 'side.cane_name.stones' }, { notFlag: 'clue.cane_name' }] },
          text: 'Archivist. I crossed the bridge the moment it came down, to hear her name read. It was not.',
        },
        { if: { notFlag: 'side.cane_name.stones' }, text: 'Any luck at the name stones, archivist?' },
        {
          if: { all: [{ flag: 'side.cane_name.stones' }, { notFlag: 'clue.cane_name' }] },
          text: 'Not on the stones? Then she is only in the cane now. My mother said Grann loved the flowers by the gate.',
        },
        {
          if: { all: [{ flag: 'clue.cane_name' }, { notFlag: 'side.cane_name.recorded' }] },
          speaker: G,
          text: "I think I know her name. Let me write it down properly first, in Mother Solange's list.",
        },
      ],
    },
    finish: {
      speaker: 'cane_cutter',
      set: { 'side.cane_name.done': true },
      lines: [
        say(G, 'Her name was Rose-Aimée. Her mother named her for the roses by the gate.'),
        { text: 'Rose-Aimée.' },
        { if: { not: CUTTER_AT_STONES }, text: '...Rose-Aimée. Tonight I will say it so loud the goddess has to hear it twice.' },
        { if: CUTTER_AT_STONES, text: '...Rose-Aimée. The reading is over, but the lamp is still lit. I will say it to her myself.' },
        { text: 'Here. My wife stitched this for the festival. Wear it. It is a better place for it than my pocket.' },
        // Staged: he walks into the temple, hat in his hands, and says it to the lamp.
        {
          if: CUTTER_AT_STONES,
          speaker: '',
          text: 'He walks up to the Gaze lamp with his hat in his hands, and says her name to it.',
          stage: [
            { do: 'look', actor: 'npc:cane_cutter' },
            { do: 'walk', actor: 'npc:cane_cutter', to: { x: 15, y: 4 }, facing: 'up' },
            { do: 'wait', ms: 900 },
            { do: 'look', actor: 'player' },
          ],
        },
      ],
    },
    thanks: {
      speaker: 'cane_cutter',
      lines: [
        { if: { not: CUTTER_AT_STONES }, text: "Rose-Aimée. I've said it a hundred times today, archivist. It still sounds new." },
        { if: CUTTER_AT_STONES, text: "Rose-Aimée. I've said it a hundred times tonight, archivist. It still sounds new." },
      ],
    },
  }),

  script('road_watcher_talk', {
    start: {
      speaker: 'road_watcher',
      // Remembered (Chapter 9, the second review's 3.2): Anissa knows her in the Assize at Kingsmere.
      set: { 'story.watcher_met': true },
      lines: [
        { text: 'Hush. The road is loud enough without us.' },
        { text: 'Your little sister is very quiet, isn\'t she? Quiet people are precious to us.' },
      ],
      choices: [
        // Remembered (Oct 19): the hooded stranger on the plaza brings it up after the lamp.
        { text: 'Stay away from her.', next: 'warn', set: { 'choice.warned_watcher': true } },
        { text: 'Who are you?', next: 'who' },
      ],
    },
    warn: { speaker: 'road_watcher', lines: [{ text: 'We only ever listen. You should try it.' }] },
    who: { speaker: 'road_watcher', lines: [{ text: 'No one. That is the point of us.' }] },
  }),

  simple('road_sign', [
    { text: 'THE CANE ROAD. East: the old sugar mill and the mangroves. Travel in company. Travel by day.' },
  ]),

  simple('smuggler_crates', [
    { text: 'Crates stamped with the Crown seal, hidden under cane leaves. Muskets, by the weight. Someone is waiting for a buyer.' },
  ]),

  simple('mill_ruin', [
    { text: 'The old sugar mill, burned in the war and never rebuilt. Fresh ashes in the hearth: someone sleeps here.' },
  ]),

  // The first battle (owner decision, Oct 15): a boar out of the cane. The dialogue's last line names
  // the battle; the scene starts it when the dialogue ends (engine/game.ts finishDialogue).
  script('boar_ambush', {
    start: { lines: [], next: [{ if: { flag: 'story.boar_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The cane rustles. Something heavy is moving through it, fast.'),
        say(A, 'Gigi...'),
        nar('A boar bursts onto the road, bristles up, tusks low, and plants itself between you and the gate.'),
        say(G, 'Stay behind me, Nissa.'),
        say(A, '...I will.', { set: { 'story.boar_seen': true, 'battle.next': 'intro_boar' } }),
      ],
    },
    again: {
      lines: [nar('The boar is back, snorting, blocking the road.'), say(G, 'Again, then. Stay behind me.', { set: { 'battle.next': 'intro_boar' } })],
    },
  }),

  // A Name in the Cane: the Cane Road fifty years ago, and Mother Solange's list in the Archive.
  once('cane_echo_enter', 'story.cane_echo_seen', [
    nar("The road is narrower, and the cane is the Crown's. Overseers' lanterns bob far off between the rows."),
    say(AF, "I've got the door, Gigi."),
  ]),
  script('echo_cane_worker_talk', {
    start: { lines: [], next: [{ if: { flag: 'clue.cane_name' }, to: 'again' }, { to: 'meet' }] },
    meet: {
      speaker: 'echo_cane_worker',
      lines: [
        { text: "Marshal? On the Crown's road? They'll shoot you for it, sir. And me for talking to you." },
        say(P, 'Then talk quickly. What is your name?'),
        { text: 'Nobody asks that here. The overseer calls me Forty-One.' },
        say(P, 'I did not ask what he calls you.'),
        { text: '...Rose-Aimée. My mother named me for the roses by the gate. The only pretty thing on this road.' },
        say(P, 'Rose-Aimée. After tomorrow, nobody on this island will be a number.'),
        nar("(Clue: the cane cutter's grandmother was Rose-Aimée.)", { set: { 'clue.cane_name': true } }),
      ],
    },
    again: {
      speaker: 'echo_cane_worker',
      lines: [{ text: "Rose-Aimée, sir. Don't forget it. Everyone else does." }],
    },
  }),
  script('solange_list', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'clue.cane_name' }, { notFlag: 'side.cane_name.recorded' }] }, to: 'record' },
        { if: { flag: 'side.cane_name.recorded' }, to: 'recorded' },
        { to: 'look' },
      ],
    },
    look: {
      lines: [
        nar("Mother Solange's list of names, brought up from the lowest shelf for the festival."),
        nar('Fifty years of hands have added to it. The newest names are in the senior archivist\'s neat print.'),
      ],
    },
    record: {
      set: { 'side.cane_name.recorded': true },
      lines: [
        nar('The list ends with the line the stones carry: "the cutters of the Cane Road, whose names the Crown did not keep."'),
        say(G, 'Then we keep them.'),
        nar('Beneath it, in her best archive hand, Gianna writes: Rose-Aimée, cane cutter, the Cane Road.'),
      ],
    },
    recorded: {
      lines: [nar("Mother Solange's list. The newest line is in Gianna's hand: Rose-Aimée, cane cutter, the Cane Road.")],
    },
  }),
  // ---- Z-4 The Seventh Stone (secret; data/seventhStone.ts) -----------------------------------
  ...SEVENTH_STONE_DIALOGUE,
];

