// Chapter 8's two side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md J-1 and J-4, SECRET-ITEMS.md 4): Win Every Argument (the three who out-argued Vikram while he was out of
// breath, each won back by a sparring bout or by Gianna's answer) and Oil for the Little Lamps (the shrine child, the oil
// store's balance lock, the lamp-maker fifty years ago and his jars, the sealed reservoir, the Unbroken Wick). Both open
// at dawn, after Seth Dhanraj falls, and close when the trader sails.
//
// The owner's rules: shown, not told (Vikram walks up to each of them; the lamp-maker walks the reservoir to the lock; the
// child walks to her shrine and lights it); Anissa never jokes and is never touched; no Rael. The jokes are Vikram's.
//
// Built Nov 4: K-5 Ashes of the Temple's last step (SIDE-QUESTS.md K-5): the Suzumori elder's letter, carried from
// Kirinoura, read by Meera in the Court at dawn (data/dialogue/jwaladesh.ts meera_talk plays ASHES_DELIVERY).
//
// Built Nov 4: J-5 Jackals on the Salt Road (SIDE-QUESTS.md J-5): the contract board at dawn, the salt caravan at the
// road's end, escorted to the salt gate. The master and her mules walk ahead from stop to stop (data/jwaladesh.ts
// CARAVAN); the jackals come out of their den at them, the Seth's unpaid enforcers out of the Crown oil-cart's shade, and
// both run off again after the fight; at the gate she pays, and the caravan walks into the city.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { MEASURES_DO, jarFlag, sealedFlag } from '../../engine/secrets.ts';
import { ARGUERS, BAZAAR, CARAVAN, COURT, FLATS, HARBOR, OIL_STORE, WICK_MEASURES } from '../jwaladesh.ts';
import { ASHES } from '../kuroshi.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
const say = (speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, ...extra });
const nar = (text: string, extra: Extra = {}): DialogueLine => ({ speaker: '', text, ...extra });
const act = (stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, stage, ...extra });
const script = (id: string, nodes: Record<string, DialogueNode>): DialogueScript => ({ id, start: 'start', nodes });
const simple = (id: string, lines: DialogueLine[]): DialogueScript => script(id, { start: { lines } });
const at = (x: number, y: number) => ({ x, y });
const f = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });

const G = 'gianna';
const A = 'anissa';
const S = 'samira';
const V = 'vikram';
const P = 'patricio';
const SC = 'shrine_child';
const LM = 'lamp_maker';
const LR = 'lamp_runner';

// ---- J-1 Win Every Argument ----------------------------------------------------------------------------------------

/** The three, each with the argument they won, Gianna's three answers (the right one first in the data) and a bout. */
interface Arguer {
  id: 'spice' | 'dyer' | 'wrestler';
  speaker: string;
  /** The NPC's map id (for the stage). */
  npc: string;
  at: { x: number; y: number };
  claim: string;
  right: string;
  wrong: readonly string[];
  /** Their answer to the right one, and to a wrong one. */
  yields: string;
  scoffs: string;
}

const ARGUER_LIST: readonly Arguer[] = [
  {
    id: 'spice',
    speaker: 'arguer_spice',
    npc: 'arguer_spice',
    at: ARGUERS.spice,
    claim: 'He says the flame must never wait. My grandmother waited forty years for a fair price for her pepper, and got it.',
    right: 'Waiting is not hesitating.',
    wrong: ['Fire does not care about pepper.', 'Vikram, say something.'],
    yields: 'She chose, did she. ...She did. Every morning. Fine. He may have that one back.',
    scoffs: 'Hm. Pepper keeps longer than that answer.',
  },
  {
    id: 'dyer',
    speaker: 'arguer_dyer',
    npc: 'arguer_dyer',
    at: ARGUERS.dyer,
    claim: 'Blue fades in the sun. Fire goes out. Fame goes first. Why fight for any of it?',
    right: 'You dye it again. Every year.',
    wrong: ['Some blues do not fade.', 'He is very famous already.'],
    yields: 'Every year. My hands are blue to the elbow from saying so. Take it back, then.',
    scoffs: 'Every blue fades. Even yours, envoy.',
  },
  {
    id: 'wrestler',
    speaker: 'arguer_wrestler',
    npc: 'arguer_wrestler',
    at: ARGUERS.wrestler,
    claim: 'A boy who fights with his mouth open loses his breath before he loses his footing.',
    right: 'Then teach him to breathe.',
    wrong: ['He fights well with his mouth open.', 'He has stopped talking. Mostly.'],
    yields: 'Ha! That I can do. In, on the cut. Out, on the word. Again.',
    scoffs: 'He has not. I can hear him from here.',
  },
];

/** At least two of the three won one way or the other (the reward's pillar follows the majority). */
const twoOf = (flags: readonly string[]): Condition => ({
  any: [
    { all: [f(flags[0]!), f(flags[1]!)] },
    { all: [f(flags[0]!), f(flags[2]!)] },
    { all: [f(flags[1]!), f(flags[2]!)] },
  ],
});
const SPARS = ARGUER_LIST.map((a) => `side.argue.${a.id}_spar`);
const ALL_WON: Condition = { all: ARGUER_LIST.map((a) => f(`side.argue.${a.id}`)) };
/** The quest opens at dawn with Vikram in the party. */
export const ARGUE_OPEN = 'party.vikram, story.dhanraj_beaten, !act8.complete';

/** After the third is won (whichever it is): Vikram breathes, and the pillar follows how they were won. */
const ARGUE_END: DialogueNode = {
  lines: [
    act([{ do: 'face', actor: 'vikram', facing: 'player' }], V, 'Three for three. I have won every argument in Agnipur.'),
    say(S, 'Twice. Once badly, and once with help.'),
    say(V, 'And I have learned to breathe between sentences. Watch. ... ... Envoy.'),
    say(G, 'Well done.'),
    { if: twoOf(SPARS), speaker: '', text: 'The bazaar talks about the bouts all morning. Nobody out-argues the Agnivansh with a blade.', set: { 'side.argue.fear': true, 'side.argue.done': true } },
    { if: { not: twoOf(SPARS) }, speaker: '', text: 'The bazaar talks about the answers all morning. The envoy argues for the Agnivansh now.', set: { 'side.argue.influence': true, 'side.argue.done': true } },
  ],
};

function arguerScripts(a: Arguer): DialogueScript[] {
  const won = `side.argue.${a.id}`;
  const answers: DialogueChoice[] = [
    { text: a.wrong[0]!, next: 'wrong' },
    { text: a.right, next: 'right' },
    { text: a.wrong[1]!, next: 'wrong' },
  ];
  return [
    script(`${a.npc}_talk`, {
      start: {
        lines: [],
        next: [
          { if: f(won), to: 'after' },
          { if: { all: [f('party.vikram'), f('story.dhanraj_beaten'), not('act8.complete'), not('side.argue.accepted')] }, to: 'open' },
          { if: f('side.argue.accepted'), to: 'rematch' },
          { to: 'plain' },
        ],
      },
      plain: { lines: [say(a.speaker, 'Namaste. Mind the pepper.', { translation: 'Hello.' })] },
      // Whoever is met first: Vikram walks up to them, and asks for all three back.
      open: {
        lines: [
          act([{ do: 'walk', actor: 'vikram', to: at(a.at.x, a.at.y + 1), facing: 'up' }], a.speaker, 'Ah. The duelist. Out of breath again?'),
          say(V, 'Envoy. Three people in this bazaar out-argued me yesterday, while I was out of breath. This is one.'),
          say(V, 'I want them back. All three. By the blade, or by your mouth, I do not mind which.'),
          say(G, 'Then we will win them back.', { set: { 'side.argue.accepted': true } }),
          nar('(Win Every Argument is in the Quests page of the menu.)'),
        ],
        next: 'rematch',
      },
      rematch: {
        lines: [say(a.speaker, a.claim)],
        choices: [
          { text: 'Vikram spars for it.', set: { 'battle.next': `argue_${a.id}`, 'battle.after': `${a.npc}_bout` } },
          { text: 'Gianna answers for him.', next: 'answer' },
          { text: 'Later.' },
        ],
      },
      answer: { lines: [say(G, '(For Vikram...)')], choices: answers },
      right: {
        lines: [say(G, a.right), say(a.speaker, a.yields, { set: { [won]: true } })],
        next: [{ if: ALL_WON, to: 'end' }],
      },
      wrong: { lines: [say(a.speaker, a.scoffs)] },
      after: { lines: [say(a.speaker, a.id === 'wrestler' ? 'In on the cut, out on the word. Tell him.' : 'He has it back. Do not let him lose it again.')] },
      end: ARGUE_END,
    }),
    // After a bout won (the battle's `after`): the arguer steps back, laughing, and concedes.
    script(`${a.npc}_bout`, {
      start: {
        lines: [
          act([{ do: 'look', actor: `npc:${a.npc}` }], a.speaker, 'Enough! Enough. He may have it back.', { set: { [won]: true, [`side.argue.${a.id}_spar`]: true } }),
          say(V, 'I breathed that time. Did you see?'),
        ],
        next: [{ if: ALL_WON, to: 'end' }],
      },
      end: ARGUE_END,
    }),
  ];
}

// ---- J-4 Oil for the Little Lamps (S-JWA, the Unbroken Wick) ---------------------------------------------------------

const J = WICK_MEASURES.id;
const SAID = `measures.${J}.said`;
const JAR_NAMES = ['the ten', 'the seven', 'the three'] as const;
/** The jars as they stand (the machine writes them on `look`). */
const JARS_LINE = nar(`The ten holds {v:${jarFlag(J, 0)}}. The seven holds {v:${jarFlag(J, 1)}}. The three holds {v:${jarFlag(J, 2)}}.`);

function pourNodes(): Record<string, DialogueNode> {
  const nodes: Record<string, DialogueNode> = {
    menu: {
      set: { [MEASURES_DO]: `${J}:look` },
      lines: [JARS_LINE],
      choices: [
        ...JAR_NAMES.map((name, i): DialogueChoice => ({ text: `Pour from ${name}.`, next: `from_${i}` })),
        { text: 'Step back.' },
      ],
    },
    poured: {
      lines: [
        { if: { flag: SAID, eq: 'refused' }, speaker: LM, text: 'Nothing to pour, Marshal, or no room for it.' },
        { if: { flag: SAID, eq: 'poured' }, speaker: '', text: 'The oil runs from jar to jar.', fx: 'pour' },
      ],
      next: 'menu',
    },
  };
  JAR_NAMES.forEach((from, i) => {
    nodes[`from_${i}`] = {
      lines: [say(P, `(From ${from}, into...)`)],
      choices: [
        ...JAR_NAMES.flatMap((to, j): DialogueChoice[] => (j === i ? [] : [{ text: `...${to}.`, set: { [MEASURES_DO]: `${J}:${i}>${j}` }, next: 'poured' }])),
        { text: '...the reservoir. It seals.', set: { [MEASURES_DO]: `${J}:${i}>r` }, next: 'sealed' },
        { text: 'Not yet.', next: 'menu' },
      ],
    };
  });
  return nodes;
}

const LITTLE_LAMPS: DialogueScript[] = [
  // The shrine child on the spice row: the dark lamp, the quest, and the reservoir brought back.
  script('shrine_child_talk', {
    start: {
      lines: [],
      next: [
        { if: f('side.little_lamps.done'), to: 'lit' },
        { if: f('item.sealed_reservoir'), to: 'bring' },
        { if: f('side.little_lamps.accepted'), to: 'waiting' },
        { if: { all: [f('story.dhanraj_beaten'), not('act8.complete')] }, to: 'ask' },
        { if: f('story.dhanraj_beaten'), to: 'after' },
        { to: 'dark' },
      ],
    },
    dark: { lines: [say(SC, 'It went out. It never went out before.')] },
    after: { lines: [say(SC, 'The runners came past with oil. They said mine is next. I am waiting.')] },
    ask: {
      lines: [
        say(SC, 'The runners came past with oil. They said mine is next. But mine never needed the runners.'),
        say(SC, 'It had its own oil, in a sealed jar from the lamp-maker, from the night Arjun\'s riders came home. My grandmother said so.'),
        say(SC, 'The Seth\'s men took it to the store. Now the store is open and the jar is not. It is behind a door with scales on it.'),
        say(A, 'Gigi. We can find it.'),
        say(G, 'We will bring it back.', { set: { 'side.little_lamps.accepted': true } }),
        nar('(Oil for the Little Lamps is in the Quests page of the menu.)'),
      ],
    },
    waiting: { lines: [say(SC, 'The door with the scales. In the store by the chain. Grandmother said the lamp-maker built it so nobody could cheat.')] },
    bring: {
      lines: [
        act([{ do: 'walk', actor: 'npc:shrine_child', to: at(BAZAAR.shrine.x - 1, BAZAAR.shrine.y), facing: 'right' }], SC, 'That is it. That is the one.'),
        nar('She sets the sealed reservoir in the shrine\'s little cradle, breaks the wax, and lights the lamp from a taper.', { fx: 'flash' }),
        nar('The flame stands up straight, and stays.'),
        act([{ do: 'walk', actor: 'npc:shrine_child', to: at(BAZAAR.shrineChild.x, BAZAAR.shrineChild.y), facing: 'down' }], SC, 'There was a wick in its neck. White. Nobody ever lit it, for fifty years.'),
        say(SC, 'Grandmother said it is for whoever carries a light. That is you.'),
        nar('She puts the white wick in Anissa\'s hands. Anissa holds it as if it were warm.', {
          set: { 'item.unbroken_wick': true, 'item.sealed_reservoir': false, 'side.little_lamps.done': true },
        }),
        say(A, 'I\'ll keep it, Gigi. It waited.'),
      ],
    },
    lit: { lines: [say(SC, 'It has not gone out. I check every hour. Twice in the night.')] },
  }),
  script('dark_shrine', {
    start: { lines: [], next: [{ if: f('side.little_lamps.accepted'), to: 'cradle' }, { to: 'plain' }] },
    plain: { lines: [nar('A street shrine the size of a cupboard, its little lamp dark and its bowl dry.')] },
    cradle: { lines: [nar('A street shrine, its lamp dark. Under it, an empty clay cradle the size of a reservoir.')] },
  }),
  simple('lit_shrine', [nar('The child\'s shrine. Its little lamp burns straight and steady, fed from below.')]),
  // The balance lock on the oil store's back door (now).
  script('balance_lock', {
    start: {
      lines: [],
      next: [
        { if: f('story.lock_balanced'), to: 'open' },
        { if: f(WICK_MEASURES.anchor), to: 'balance' },
        { if: f('side.little_lamps.accepted'), to: 'look' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('A brass balance lock on a door at the back of the store, three jar-weights beside it. It does not turn for you. Not yet.')] },
    look: {
      lines: [
        nar('A brass balance lock on the store\'s back door. One pan holds an empty clay cradle; the other, a bronze weight caked in soot.'),
        say(S, 'The weight has a number under the soot. Nobody has cleaned it in fifty years. The cradle remembers what it held.'),
        say(A, 'The store remembers too, Gigi. Where it shimmers.'),
      ],
    },
    balance: {
      lines: [
        nar('On the cradle sits a clay reservoir, sealed with old wax and dark with fifty years. The pans hang level.'),
        nar('The lock turns by itself. The back door swings in on a shelf of empty cradles.', { fx: 'shake' }),
        say(S, 'Five measures. Exactly. Somebody once refused to cheat this door, and it has been waiting to say so.'),
        nar('Gianna lifts the reservoir out of the cradle. A white wick is tucked into its neck.', { set: { 'item.sealed_reservoir': true, 'story.lock_balanced': true } }),
        say(A, 'Nobody ever lit it, Gigi. It\'s for her shrine.'),
      ],
    },
    open: { lines: [nar('The back door stands open on a shelf of empty cradles.')] },
  }),
  // Fifty years ago: the night Arjun's company came home. The roll call, and the lamp-maker at his jars.
  script('store_echo', {
    start: { lines: [], next: [{ if: f('clue.five_home'), to: 'again' }, { to: 'first' }] },
    again: { lines: [nar('The oil store, fifty years ago. The lamp-maker is at his jars, and the riders\' horses are in the yard.')] },
    first: {
      lines: [
        nar('The oil store, fifty years ago: the night Arjun\'s riders came home. Lamplight, and the smell of new oil.', { fx: 'fade' }),
        act(
          [{ do: 'enter', actor: 'roll_runner', look: 'echo_runner', from: at(OIL_STORE.door.x, OIL_STORE.door.y + 1), to: at(OIL_STORE.door.x, OIL_STORE.door.y - 1), facing: 'up' }],
          LR,
          'The roll, lamp-maker. Seven rode out with Arjun. Five came home.',
        ),
        act([{ do: 'look', actor: 'npc:echo_lamp_maker' }], LM, 'Five. Then the little lamps keep that measure. One reservoir for every street shrine that lit them home.'),
        act([{ do: 'exit', actor: 'roll_runner', to: at(OIL_STORE.door.x, OIL_STORE.door.y + 1) }], LM, 'Marshal, you have steady hands. The reservoir takes one pour, and seals. Pour it true.'),
        say(LM, 'The weight on my lock is the measure of those who came home. Not a drop more.'),
        say(P, '(Five, exactly. The ten is full; the seven and the three are empty. One pour into the reservoir.)', { set: { 'clue.five_home': true } }),
      ],
    },
  }),
  script('store_echo_return', {
    start: { lines: [], next: [{ if: f(WICK_MEASURES.anchor), to: 'sealed' }] },
    sealed: { lines: [act([{ do: 'look', actor: 'player' }], S, 'The cradle on the lock is not empty any more. It has not been empty for fifty years.')] },
  }),
  // The lamp-maker at his jars (the memory): the pours, the reservoir, a new one when it seals wrong.
  script('lamp_maker_talk', {
    start: {
      lines: [],
      next: [
        { if: f(WICK_MEASURES.anchor), to: 'done' },
        { if: f(sealedFlag(J)), to: 'wrong' },
        { if: f('clue.five_home'), to: 'menu' },
        { to: 'busy' },
      ],
    },
    busy: { lines: [say(LM, 'Riders coming in, Marshal. Every lamp in the city wants oil tonight.')] },
    sealed: {
      lines: [],
      next: [{ if: f(WICK_MEASURES.anchor), to: 'true' }, { to: 'false' }],
    },
    true: {
      lines: [
        say(LM, 'Five. The measure of those who came home.'),
        act([{ do: 'walk', actor: 'npc:echo_lamp_maker', to: at(HARBOR.balanceLock.x, HARBOR.balanceLock.y + 1), facing: 'up' }], '', 'He carries the sealed reservoir to the lock on the back door and sets it in the cradle on the pan.'),
        nar('The pans hang level. He tucks a white wick into the reservoir\'s neck.'),
        say(LM, 'For when it is opened. Not before. A lamp lit from this will not go out while there is a measure in it.'),
      ],
    },
    false: {
      lines: [say(LM, 'That is not five, Marshal. It has sealed wrong.')],
      choices: [{ text: 'Make another.', set: { [MEASURES_DO]: `${J}:reset` }, next: 'menu' }, { text: 'Not now.' }],
    },
    wrong: {
      lines: [say(LM, 'That one sealed wrong. Shall I make you another?')],
      choices: [{ text: 'Make another.', set: { [MEASURES_DO]: `${J}:reset` }, next: 'menu' }, { text: 'Not now.' }],
    },
    done: { lines: [say(LM, 'It is in the cradle, Marshal. It will wait as long as it has to.')] },
    ...pourNodes(),
  }),
  ...[0, 1, 2].map((i) =>
    simple(`echo_jar_${i}`, [nar(`A good clay jar of ${WICK_MEASURES.caps[i]} measures. It holds {v:${jarFlag(J, i)}}.`)]),
  ),
  simple('echo_reservoir', [nar('The lamp-maker\'s clay reservoir, wax ready at its neck. It takes one pour, and then it seals.')]),
];

// ---- K-5 Ashes of the Temple: the letter delivered (built Nov 4) ---------------------------------------------------

/** Meera reads the elder's letter at dawn, once the price is made (the Court's own scene first), until the trader sails. */
export const ASHES_DELIVERY_WANTED: Condition = { all: [f(ASHES.letter), f('ally.jwaladesh'), not('act8.complete')] };
const MEERA = 'npc:meera';

export const ASHES_DELIVERY: DialogueNode = {
  lines: [
    say(G, 'Meera. From the Suzumori elder who signed the order. Her letter, and the Crown paper she signed it on.'),
    act([{ do: 'look', actor: MEERA }, { do: 'wait', ms: 900 }], '', 'Meera reads the letter through, slowly. Then she holds the Crown paper up to the wick-window.'),
    say('meera', 'A nick in the crown\'s band. That is not the Throne\'s seal.'),
    say(G, 'One man\'s. Sayo\'s people caught his first lie fifty years ago. Kirinoura believed his second.'),
    act([{ do: 'walk', actor: 'vikram', to: at(COURT.meera.x + 1, COURT.meera.y + 1), facing: 'up' }], V, 'Mother. She has written to us every year?'),
    say('meera', 'Every year, she says. This is the one she posted.'),
    act(
      [
        { do: 'walk', actor: MEERA, to: at(COURT.craneStep.x, COURT.craneStep.y + 1), facing: 'up' },
        { do: 'wait', ms: 800 },
        { do: 'walk', actor: MEERA, to: COURT.meera },
        { do: 'face', actor: MEERA, facing: 'player' },
      ],
      '',
      'She lays the letter on the altar\'s lowest step, where the crane was refused, and the paper beside it, wax up.',
    ),
    say('meera', 'Tell her it was read in the Court, in front of the flame. That is not forgiveness.'),
    say('meera', 'When the Suzumori ask to carry stones for our temple, the Keepers will see this paper first.', {
      set: { [ASHES.done]: true, [ASHES.letter]: false },
    }),
    say(A, 'Not forgiveness yet, Gigi. But she left it on the step.'),
  ],
};

// ---- J-5 Jackals on the Salt Road (built Nov 4) ----------------------------------------------------------------------

const CM = 'salt_master';
const EN = 'enforcer';
const MASTER = 'npc:salt_master';
const MULE_A = 'npc:salt_mule_a';
const MULE_B = 'npc:salt_mule_b';
const AGNIPUR_DAWN: Condition = { all: [f('story.dhanraj_beaten'), not('act8.complete')] };
const BOARD = nar('The contract board: "Escort a salt caravan. The Seth\'s enforcers took the last one." "Run the lamp relay: the runners\' hall."');

/** The caravan walks on to stop `n` (data/jwaladesh.ts CARAVAN.stops), the master first; then the map takes it up there. */
function moveOn(n: number): StageCue[] {
  const [m, a, b] = CARAVAN.stops[n]!;
  return [
    { do: 'look', actor: MASTER },
    { do: 'exit', actor: MASTER, to: m, async: true },
    { do: 'exit', actor: MULE_A, to: a, async: true },
    { do: 'exit', actor: MULE_B, to: b },
    { do: 'wait', ms: 300 },
    { do: 'sync' },
  ];
}

const JACKALS_DIALOGUE: DialogueScript[] = [
  // The contract board in the bazaar: the caravan's notice, at dawn.
  script('jw_board', {
    start: {
      lines: [],
      next: [
        { if: f(CARAVAN.done), to: 'done' },
        { if: f(CARAVAN.accepted), to: 'taken' },
        { if: AGNIPUR_DAWN, to: 'offer' },
        { to: 'plain' },
      ],
    },
    plain: {
      lines: [BOARD, nar('And: "Clean the rooftop mirrors. Ask the engineer." Somebody has added: "She will not let you."')],
    },
    offer: {
      lines: [
        BOARD,
        nar('Pinned over it, new this morning: "SALT CARAVAN, the road\'s end to the salt gate. Jackals, and tolls. 450. Ask the master."'),
        say(V, 'Tolls. The Seth is sitting on a jar with his ledger shut. Who is taking tolls?'),
        say(G, 'His men. Nobody told them to stop.'),
      ],
      choices: [{ text: 'Take the job.', set: { [CARAVAN.accepted]: true }, next: 'yes' }, { text: 'Not now.' }],
    },
    yes: {
      lines: [
        say(G, 'The road\'s end, by the shrine. Out through the salt gate.'),
        nar('(Jackals on the Salt Road is in the Quests page of the menu.)'),
      ],
    },
    taken: { lines: [nar('The caravan notice, with a line through it: the job is taken. The salt gate is east.')] },
    done: { lines: [nar('A new notice: "Salt in, every sack. Tolls out. With thanks to the envoy." Somebody has drawn a jackal, tail down.')] },
  }),
  // The caravan master, at each stop on the road.
  script('salt_master_talk', {
    start: {
      lines: [],
      next: [
        { if: f(CARAVAN.toll), to: 'gate' },
        { if: f(CARAVAN.jackals), to: 'oil_cart' },
        { if: f(CARAVAN.setOut), to: 'den' },
        { to: 'set_out' },
      ],
    },
    set_out: {
      lines: [
        act([{ do: 'face', actor: MASTER, facing: 'player' }], CM, 'The board said a guard. It did not say the Zetwal envoy. I will take the envoy.'),
        say(CM, 'Two mules, salt for the whole spice row. The last caravan lost its mules to the jackals and its salt to the Seth\'s men.'),
        say(V, 'The Seth\'s men have no Seth this morning.'),
        say(CM, 'Then they have no wages either. They will want the toll for themselves.'),
        act(moveOn(1), CM, 'Walk behind us, envoy. The mules do not like being passed.', { set: { [CARAVAN.setOut]: true } }),
        say(A, 'They are going, Gigi. We walk behind.'),
      ],
    },
    den: { lines: [say(CM, 'Behind us, envoy. Their den is up there in the crust, and they can smell salt.')] },
    oil_cart: { lines: [say(CM, 'The oil-cart is the Crown\'s. The men who sleep in its shade are not.')] },
    gate: {
      lines: [
        act([{ do: 'face', actor: MASTER, facing: 'player' }], CM, 'Every sack and both mules, envoy. Four hundred and fifty, as the board said.'),
        say(CM, 'The salt guild will hear who walked the road with us. They always hear who did not.'),
        act(
          [
            { do: 'look', actor: MASTER },
            { do: 'exit', actor: MASTER, to: at(FLATS.gate.x, FLATS.gate.y), async: true },
            { do: 'exit', actor: MULE_A, to: at(FLATS.gate.x, FLATS.gate.y + 1), async: true },
            { do: 'exit', actor: MULE_B, to: at(FLATS.gate.x, FLATS.gate.y - 1) },
          ],
          '',
          'The caravan goes in through the salt gate, the master first, the mules complaining.',
          { set: { [CARAVAN.done]: true } },
        ),
        say(A, 'All the salt got home, Gigi.'),
      ],
    },
  }),
  simple('salt_mule_talk', [nar('A salt mule, two sacks a side. It looks at the envoy the way it looks at a jackal.')]),
  // Behind the caravan, under the den: the jackals come for the mules.
  script('caravan_jackals', {
    start: {
      lines: [
        act(
          [
            { do: 'look', actor: 'jackal_a' },
            { do: 'enter', actor: 'jackal_a', look: 'ember_jackal', from: at(FLATS.den.x, FLATS.den.y + 2), to: at(31, 11), facing: 'down', run: true, async: true },
            { do: 'enter', actor: 'jackal_b', look: 'ember_jackal', from: at(FLATS.den.x + 1, FLATS.den.y + 2), to: at(32, 11), facing: 'down', run: true, async: true },
            { do: 'enter', actor: 'jackal_c', look: 'ember_jackal', from: at(FLATS.den.x + 2, FLATS.den.y + 2), to: at(33, 11), facing: 'down', run: true },
          ],
          '',
          'Out of the den in the crust: three jackals, their coats throwing sparks. They run straight at the mules.',
          { fx: 'shake' },
        ),
        act([{ do: 'face', actor: MASTER, facing: 'up' }], CM, 'Not the mules! Not again!'),
        act([{ do: 'walk', actor: 'vikram', to: at(CARAVAN.jackalLine, 12), facing: 'left' }], V, 'Behind me, caravan.', {
          set: { 'battle.next': 'caravan_jackals', 'battle.after': 'caravan_jackals_after' },
        }),
      ],
    },
  }),
  script('caravan_jackals_after', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'jackal_a', look: 'ember_jackal', at: at(31, 10), facing: 'up' },
            { do: 'place', actor: 'jackal_b', look: 'ember_jackal', at: at(32, 10), facing: 'up' },
            { do: 'place', actor: 'jackal_c', look: 'ember_jackal', at: at(33, 10), facing: 'up' },
            { do: 'exit', actor: 'jackal_a', to: at(FLATS.den.x, FLATS.den.y + 2), run: true, async: true },
            { do: 'exit', actor: 'jackal_b', to: at(FLATS.den.x + 1, FLATS.den.y + 2), run: true, async: true },
            { do: 'exit', actor: 'jackal_c', to: at(FLATS.den.x + 2, FLATS.den.y + 2), run: true },
          ],
          '',
          'The jackals run for their den across the pans, the sparks going out behind them.',
        ),
        act([{ do: 'face', actor: MASTER, facing: 'player' }], CM, 'Both mules. Both mules, and every sack.'),
        act(moveOn(2), CM, 'On, past the Crown\'s oil-cart. Behind us, envoy.', { set: { [CARAVAN.jackals]: true } }),
      ],
    },
  }),
  // Behind the caravan, past the oil-cart: the Seth's enforcers, and the toll they keep now.
  script('caravan_toll', {
    start: {
      lines: [
        act(
          [
            { do: 'look', actor: 'toll_a' },
            { do: 'enter', actor: 'toll_a', look: 'oil_enforcer', from: at(FLATS.oilCart.x, FLATS.oilCart.y - 1), to: at(13, 12), facing: 'right', async: true },
            { do: 'enter', actor: 'toll_b', look: 'oil_enforcer_b', from: at(FLATS.oilCart.x + 1, FLATS.oilCart.y - 1), to: at(13, 13), facing: 'right', async: true },
            { do: 'enter', actor: 'toll_c', look: 'road_bandit', from: at(FLATS.oilCart.x - 1, FLATS.oilCart.y - 1), to: at(13, 14), facing: 'right' },
          ],
          '',
          'Out of the shade of the Crown\'s oil-cart: two Oil Enforcers, and a man in a bandit\'s scarf. They stand across the road.',
        ),
        say(EN, 'The Seth\'s road. The Seth\'s salt. The Seth\'s toll: one sack in three.'),
        say(V, 'The Seth is sitting on a jar in his own store, with his ledger shut.'),
        say(EN, 'Then the toll is ours.'),
        act([{ do: 'walk', actor: 'vikram', to: at(14, 13), facing: 'left' }], G, 'Not one sack.', {
          set: { 'battle.next': 'caravan_toll', 'battle.after': 'caravan_toll_after' },
        }),
      ],
    },
  }),
  script('caravan_toll_after', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'toll_a', look: 'oil_enforcer', at: at(13, 12), facing: 'right' },
            { do: 'place', actor: 'toll_b', look: 'oil_enforcer_b', at: at(13, 13), facing: 'right' },
            { do: 'place', actor: 'toll_c', look: 'road_bandit', at: at(13, 14), facing: 'right' },
            { do: 'exit', actor: 'toll_a', to: at(12, FLATS.h - 2), async: true },
            { do: 'exit', actor: 'toll_b', to: at(13, FLATS.h - 2), async: true },
            { do: 'exit', actor: 'toll_c', to: at(11, FLATS.h - 2), run: true },
          ],
          '',
          'They leave their cudgels on the road and walk off south across the pans, toward the coast. The bandit runs.',
        ),
        act([{ do: 'face', actor: MASTER, facing: 'player' }], CM, 'Tolls, from men with no master. The city will be glad of a Seth who sits on a jar.'),
        act(moveOn(3), CM, 'The gate. Come on, before the sun is up properly.', { set: { [CARAVAN.toll]: true } }),
      ],
    },
  }),
];

export const JWALADESH_QUEST_DIALOGUE: readonly DialogueScript[] = [...ARGUER_LIST.flatMap(arguerScripts), ...LITTLE_LAMPS, ...JACKALS_DIALOGUE];
export const ARGUER_IDS = ARGUER_LIST.map((a) => a.id);
