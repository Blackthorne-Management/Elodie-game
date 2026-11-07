// Chapter 6's side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md S-1, S-2 and S-4, SECRET-ITEMS.md 6): Salkhi Has Opinions (three wrongs put right before the grey mare
// will cross the fair: the foal at the folds, the saddle that pinches, the bay in the trader's corral), the first-snow
// race that S-2 promised (a timing race: Salkhi's stride tapped on the beat), and The Cairn of Nine Riders (secret: the
// old herder's riddle, the winter sky read from the flat stone fifty years ago, the bridle under the seventh cairn,
// Sarnai's Bridle Bell).
//
// Built Nov 4: the rest of S-2 The Fleet for Sale (SIDE-QUESTS.md S-2): the lawspeaker in the Moot at dawn, and three
// chiefs who say the Crown would have paid better: Jarl Ingrid on the quay (Samira's trade letter, or 300 gold), Khulan
// of the herds at the race rail (the first-snow race above, won), Hrafn in the Moot (the Throne's promise for the
// blockade, on a word Ordvik trusts). Samira and Hrafn walk where they act; the lawspeaker cuts the three into the hides.
//
// The owner's rules: shown, not told (the foal follows Bayarmaa round the rail, she refits the saddle, Salkhi stares the
// bay down, the riders race the course, the rider buries the bridle, Salkhi drags the capstone); Anissa never jokes, and
// Salkhi never speaks in a scene with Anissa's lines in it or about her (tests/skarragol.test.ts); no jokes at Sarnai's
// memory.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueBranch, DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { STANDING_READ, standingFlag } from '../../engine/rpg.ts';
import { CAIRNS, CAIRN_ANSWER, FAIR, FLEET, HORNS, MOOT, OPINIONS, ORDVIK_DAWN, RACE, SKY_STEPS, skyAt } from '../skarragol.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
const say = (speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, ...extra });
const nar = (text: string, extra: Extra = {}): DialogueLine => ({ speaker: '', text, ...extra });
const act = (stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, stage, ...extra });
const script = (id: string, nodes: Record<string, DialogueNode>): DialogueScript => ({ id, start: 'start', nodes });
const simple = (id: string, lines: DialogueLine[]): DialogueScript => script(id, { start: { lines } });
const at = (x: number, y: number) => ({ x, y });
const f = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const Z = 'azzy';
const BY = 'bayarmaa';
const SK = 'salkhi';
const SA = 'sarnai';
const OH = 'old_herder';

const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'] as const;

// ---- S-1 Salkhi Has Opinions -------------------------------------------------------------------------------------------

const S1 = {
  accepted: 'side.salkhi.accepted',
  foal: 'side.salkhi.foal',
  saddle: 'side.salkhi.saddle',
  rival: 'side.salkhi.rival',
  done: 'side.salkhi.done',
} as const;
const THREE_RIGHT: Condition = all(f(S1.foal), f(S1.saddle), f(S1.rival));

/** Salkhi's own conversation at the fair (data/dialogue/skarragol.ts salkhi_fair_talk): her opinions, at dawn. */
export const OPINION_BRANCHES: readonly DialogueBranch[] = [
  { if: f(S1.done), to: 'opinions_done' },
  { if: all(f(S1.accepted), THREE_RIGHT), to: 'opinions_end' },
  { if: f(S1.accepted), to: 'opinions_wait' },
  { if: all(ORDVIK_DAWN, f('party.bayarmaa')), to: 'opinions' },
];

export const OPINION_NODES: Readonly<Record<string, DialogueNode>> = {
  opinions: {
    lines: [
      act([{ do: 'face', actor: 'npc:salkhi_fair', facing: 'player' }], SK, 'Before anyone puts me on a boat: three things in Ordvik are wrong, and I am not crossing this fair until they are right.'),
      act([{ do: 'walk', actor: 'bayarmaa', to: at(FAIR.salkhi.x - 1, FAIR.salkhi.y + 1), facing: 'right' }], BY, 'She means it. She did this at my grandmother\'s funeral.'),
      say(SK, 'One. A foal on the wrong side of the rail from its mother, at the folds. Nobody on that plateau can count.'),
      say(SK, 'Two. My saddle pinches. It has pinched since the fjord. Nobody asked.'),
      say(SK, 'Three. The bay in the trader\'s corral said something about my mother. I want it unsaid.'),
      say(G, 'Three things.', { set: { [S1.accepted]: true } }),
      nar('(Salkhi Has Opinions is in the Quests page of the menu.)'),
    ],
  },
  opinions_wait: {
    lines: [
      say(SK, 'Still wrong:'),
      { if: not(S1.foal), speaker: SK, text: 'The foal. The folds. The rail. Count, envoy.' },
      { if: not(S1.saddle), speaker: SK, text: 'The saddle. The horse-trader has felt. I have opinions about felt.' },
      { if: not(S1.rival), speaker: SK, text: 'The bay. The corral. My mother.' },
    ],
  },
  opinions_end: {
    lines: [
      act([{ do: 'face', actor: 'npc:salkhi_fair', facing: 'player' }], SK, 'The foal is with its mother. The saddle fits. The bay has apologised, in horse.'),
      say(SK, 'I will cross the fair now. Slowly, so everyone can look.'),
      act([{ do: 'walk', actor: 'azzy', to: at(FAIR.salkhi.x + 1, FAIR.salkhi.y + 1), facing: 'left' }, { do: 'face', actor: 'npc:salkhi_fair', facing: 'right' }], SK, 'And Azzy.'),
      say(SK, '...Fine. No sigh.', { set: { [S1.done]: true } }),
      say(Z, '...Thank you?'),
      say(BY, 'That is the nicest thing she has ever said to a Brasador.'),
    ],
  },
  opinions_done: { lines: [say(SK, 'Everything in Ordvik is right. It will not last. Enjoy it.')] },
};

const OPINION_DIALOGUE: DialogueScript[] = [
  // The foal at the folds: Bayarmaa walks it round through the gate to its mother.
  script('folds_foal_talk', {
    start: { lines: [], next: [{ if: f(S1.foal), to: 'home' }, { to: 'out' }] },
    out: {
      lines: [
        nar('A dun foal outside the folds\' rail, its mother inside. It runs along the rail and back, and cannot find the gate.'),
        act(
          [
            { do: 'look', actor: 'bayarmaa' },
            { do: 'walk', actor: 'bayarmaa', to: at(OPINIONS.foalOut.x, OPINIONS.foalOut.y + 1), facing: 'up' },
            { do: 'wait', ms: 400 },
            { do: 'walk', actor: 'bayarmaa', to: at(OPINIONS.foalIn.x - 1, OPINIONS.foalIn.y), facing: 'right', async: true },
            { do: 'walk', actor: 'npc:folds_foal', to: OPINIONS.foalIn, facing: 'up' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'Bayarmaa clicks her tongue. The foal follows her round the rail, in at the gate, and straight to its mother.',
          { set: { [S1.foal]: true } },
        ),
        act([{ do: 'face', actor: 'npc:oyuun', facing: 'player' }], 'oyuun', 'He gets out every morning. Every morning somebody puts him back. Today it was the Ironvow girl.'),
        act([{ do: 'face', actor: 'npc:salkhi_plateau', facing: 'right' }], SK, 'Finally. Somebody on this plateau can count.'),
      ],
    },
    home: { lines: [nar('A dun foal, pressed against its mother\'s side. It is not going anywhere.')] },
  }),
  simple('foal_mother_talk', [nar('A dun mare. She does not take her eyes off her foal.')]),
  // The bay in the trader's corral: Salkhi stares it down; Yari translates.
  script('fair_horse_rival_talk', {
    start: { lines: [], next: [{ if: f(S1.rival), to: 'after' }, { if: f(S1.accepted), to: 'stare' }, { to: 'plain' }] },
    plain: { lines: [nar('A steppe horse for sale. It looks at the party, and at the price chalked on the rail, and seems to agree with neither.')] },
    stare: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:salkhi_fair' },
            { do: 'walk', actor: 'npc:salkhi_fair', to: OPINIONS.rivalRail, facing: 'left' },
            { do: 'face', actor: 'npc:fair_horse_rival', facing: 'right' },
            { do: 'wait', ms: 900 },
          ],
          '',
          'Salkhi walks over to the corral, and she and the bay look at each other over the rail for a long time.',
        ),
        say(Y, 'I speak a little horse. He says your mother was a goat.'),
        say(SK, 'He says my mother was a GREAT horse, and that he is sorry. Your horse is worse than your bow.'),
        say(Y, 'My bow is very good.'),
        say(SK, 'Yes.'),
        act(
          [
            { do: 'face', actor: 'npc:fair_horse_rival', facing: 'left' },
            { do: 'walk', actor: 'npc:salkhi_fair', to: FAIR.salkhi, facing: 'down' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'The bay turns away first. Salkhi walks back across the fair with her head very high.',
          { set: { [S1.rival]: true } },
        ),
      ],
    },
    after: { lines: [nar('The bay looks away from the grey mare, very carefully.')] },
  }),
];

/** The horse-trader's tack (data/dialogue/skarragol.ts ordvik_horses_talk): the felt for Salkhi's saddle, before the shop. */
export const SADDLE_BRANCHES: readonly DialogueBranch[] = [{ if: all(f(S1.accepted), not(S1.saddle)), to: 'saddle' }];
export const SADDLE_NODES: Readonly<Record<string, DialogueNode>> = {
  saddle: {
    lines: [say('ordvik_horses', 'The grey mare\'s saddle? I heard about it from here. Felt, envoy. Good felt, double-stitched.')],
    choices: [
      { text: 'A felt pad for Salkhi (40 gold).', if: { flag: 'gold', gte: 40 }, set: { 'gold.pay': 40 }, next: 'saddle_fit' },
      { text: 'Just the shop.' },
    ],
  },
  saddle_fit: {
    lines: [
      act(
        [
          { do: 'look', actor: 'bayarmaa' },
          { do: 'walk', actor: 'bayarmaa', to: at(FAIR.salkhi.x - 1, FAIR.salkhi.y), facing: 'right' },
          { do: 'wait', ms: 700 },
        ],
        '',
        'Bayarmaa carries the felt across the fair, unbuckles the girth, lays it under the saddle and buckles it a hole looser.',
      ),
      act([{ do: 'look', actor: 'npc:salkhi_fair' }], SK, 'Oh.'),
      say(SK, 'Oh, that is better. I take back four of the things I said about you.', { set: { [S1.saddle]: true } }),
      act([{ do: 'look', actor: 'player' }], BY, 'Four out of how many?'),
      say(SK, 'Do not ask.'),
    ],
  },
};

// ---- S-2's race: the first snow -----------------------------------------------------------------------------------------

const RACE_FLAGS = { accepted: 'side.race.accepted', won: 'side.race.won', done: 'side.race.done' } as const;
export { RACE_FLAGS };

const RACE_DIALOGUE: DialogueScript[] = [
  script('race_judge_talk', {
    start: { lines: [], next: [{ if: f(RACE_FLAGS.done), to: 'after' }, { if: f(RACE_FLAGS.accepted), to: 'again' }, { to: 'offer' }] },
    offer: {
      lines: [
        nar('The first snow of the year is falling on the fair. Riders are walking their horses up to a line drawn in it.'),
        act([{ do: 'face', actor: 'npc:race_judge', facing: 'player' }], 'race_judge', 'The first-snow race, envoy: once round the field. By custom the purse goes to the fleet\'s winter.'),
        say(BY, 'Salkhi will race. Salkhi will complain. Salkhi will win.'),
        act([{ do: 'look', actor: 'npc:salkhi_fair' }], SK, 'Salkhi will win.'),
        nar('(Press {A}, or tap the screen, on every hoofbeat as it reaches the line.)'),
      ],
      choices: [
        { text: 'Race.', set: { [RACE_FLAGS.accepted]: true, 'rhythm.next': 'salkhi_race' } },
        { text: 'Race, at a slower stride.', set: { [RACE_FLAGS.accepted]: true, 'rhythm.next': 'salkhi_race:slow' } },
        { text: 'Not now.' },
      ],
    },
    again: {
      lines: [say('race_judge', 'Again? The snow is still falling. The line is still there.')],
      choices: [
        { text: 'Race.', set: { 'rhythm.next': 'salkhi_race' } },
        { text: 'Race, at a slower stride.', set: { 'rhythm.next': 'salkhi_race:slow' } },
        { text: 'Not now.' },
      ],
    },
    after: { lines: [say('race_judge', 'The grey mare holds the first-snow record now. She has told everyone. Twice.')] },
  }),
  // The race run on the field after the stride is tapped right: three horses round the course, the grey mare first.
  script('race_won', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'rider_a', look: 'horse_bay', at: at(RACE.start.x + 1, RACE.start.y), facing: 'right' },
            { do: 'place', actor: 'rider_b', look: 'horse_chestnut', at: at(RACE.start.x + 1, RACE.start.y + 1), facing: 'right' },
            { do: 'walk', actor: 'npc:salkhi_fair', to: RACE.start, facing: 'right' },
            { do: 'look', actor: 'npc:salkhi_fair' },
            ...RACE.course.flatMap((p): StageCue[] => [
              { do: 'walk', actor: 'rider_a', to: at(p.x + 1, p.y), run: true, async: true },
              { do: 'walk', actor: 'rider_b', to: at(p.x + 1, p.y + 1), run: true, async: true },
              { do: 'walk', actor: 'npc:salkhi_fair', to: p, run: true },
            ]),
          ],
          '',
          'Three horses go off the line in a spray of snow. Round the field once; the grey mare takes the last corner on the inside.',
        ),
        act([{ do: 'look', actor: 'npc:race_judge' }], 'race_judge', 'The grey mare! By a nose!'),
        say(SK, 'By a head. Write it down properly.'),
        say('race_judge', 'The purse to the fleet\'s winter, as the custom is. Ironvow will hear who raced for it.', { set: { [RACE_FLAGS.won]: true, [RACE_FLAGS.done]: true } }),
        // S-2 (built Nov 4): Khulan of the herds watched it from inside the field.
        act([{ do: 'look', actor: 'npc:herd_chief' }, { do: 'face', actor: 'npc:herd_chief', facing: 'left' }], '', 'Inside the field, Khulan of the herds has watched every stride. She nods once.', {
          if: all(f(FLEET.accepted), not(FLEET.khulan)),
        }),
        act([{ do: 'exit', actor: 'rider_a', to: at(2, 28), async: true }, { do: 'exit', actor: 'rider_b', to: at(2, 28) }, { do: 'walk', actor: 'npc:salkhi_fair', to: FAIR.salkhi, facing: 'down' }], BY, 'She will be impossible now.'),
      ],
    },
  }),
  simple('race_lost', [
    nar('The grey mare comes in second, a length behind the bay.'),
    say(SK, 'Second. I would like that not discussed.'),
    say(BY, 'Again. Feel her stride, envoy: two quick, one long.'),
  ]),
];

// ---- S-4 The Cairn of Nine Riders (S-SKA) --------------------------------------------------------------------------------

const S4 = {
  accepted: 'side.cairn.accepted',
  sketch: 'clue.mare_sketch',
  sighted: 'clue.cairn_sighted',
  anchor: 'anchor.bridle_buried',
  done: 'side.cairn.done',
  /** The sky's step in the memory (wiped on return: the night begins again). */
  sky: 'echo.sky',
} as const;
export { S4 as CAIRN_FLAGS };

/** The sky at a step, in words: over (or just past) which cairn each shape stands. */
function skyText(step: number): string {
  const s = skyAt(step);
  const w = s.between ? 'Just past' : 'Over';
  return `${w} the ${ORD[s.mare]} cairn: nine stars round a bright tenth. The ${ORD[s.ox]}: seven in a yoke. The ${ORD[s.ship]}: five, a hull and a mast.`;
}

/** The turning sky from the flat stone (the memory): wait, or take a sighting on one of the three shapes. */
function skyStone(): DialogueScript {
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [...Array.from({ length: SKY_STEPS }, (_, n): DialogueBranch => ({ if: n === 0 ? { flag: S4.sky, lte: 0 } : { flag: S4.sky, eq: n }, to: `sky_${n}` })), { to: 'ride' }],
    },
    ride: {
      set: { [S4.sky]: 0 },
      lines: [
        nar('The horns have blown. Sarnai\'s riders mount and ride out onto the ice, and the sky turns on without them.'),
        say(SA, 'The night is gone, Marshal. The memory keeps it. Stand on the stone and begin again.'),
      ],
    },
  };
  const hornNo = (n: number) => HORNS.indexOf(n) + 1;
  for (let n = 0; n < SKY_STEPS; n++) {
    const choices: DialogueChoice[] = [
      { text: 'Wait, and watch.', set: { [S4.sky]: n + 1 }, next: n + 1 < SKY_STEPS ? `sky_${n + 1}` : 'ride' },
      { text: 'Sight the bright tenth.', next: `mare_${n}` },
      { text: 'Sight the yoke.', next: 'ox' },
      { text: 'Sight the mast.', next: 'ship' },
      { text: 'Step down.' },
    ];
    nodes[`sky_${n}`] = {
      lines: [
        ...(hornNo(n) > 0 ? [nar(`A horn, far off across the snow: the ${ORD[hornNo(n)]}.`, { fx: 'shake' })] : []),
        ...(n === 0 ? [nar('Patricio stands on the flat stone. The winter sky turns round the pole star, slow and enormous.')] : []),
        nar(skyText(n)),
      ],
      choices,
    };
    const s = skyAt(n);
    const third = n === HORNS[2];
    nodes[`mare_${n}`] = third
      ? {
          lines: [
            nar('Patricio lays a line from the Mare\'s eye down to the ground. It falls on the seventh cairn, clockwise from the north path.', { set: { [S4.sighted]: true } }),
            say(SA, 'The seventh. My rider has the spade, Marshal. Bury it there.'),
          ],
        }
      : {
          lines: [
            nar(`A line from her eye falls ${s.between ? 'between two cairns' : `on the ${ORD[s.mare]} cairn`}.`),
            say(SA, n < (HORNS[2] ?? 0) ? 'That is her. But it is the third horn that counts, Marshal. Not before.' : 'Too late. The third horn has blown, and she has walked on.'),
          ],
        };
  }
  nodes.ox = { lines: [say(SA, 'That is the Ox, Marshal: seven in a yoke. The Mare has nine round her eye.')] };
  nodes.ship = { lines: [say(SA, 'The Ship. Sailors steer by it. Riders do not.')] };
  return script('sky_stone', nodes);
}

/** A cairn fifty years ago: under the seventh the riders bury the bridle, once the sighting is taken. */
function cairnThen(n: number): DialogueScript {
  const right = n === CAIRN_ANSWER;
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [...(right ? [{ if: f(S4.anchor), to: 'buried' }] : []), { if: f(S4.sighted), to: right ? 'bury' : 'wrong' }, { to: 'plain' }],
    },
    plain: { lines: [nar(`The ${ORD[n]} cairn: grey stones, the frost still on them.`)] },
    wrong: { lines: [nar(`The ${ORD[n]} cairn. The line from the Mare's eye fell on the seventh, not this one.`)] },
  };
  if (right) {
    nodes.bury = {
      lines: [nar('The seventh cairn, where the line fell.')],
      choices: [{ text: 'Bury the bridle here.', next: 'burying' }, { text: 'Not yet.' }],
    };
    nodes.burying = {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:cairn_rider' },
            { do: 'walk', actor: 'npc:cairn_rider', to: at(CAIRNS[n - 1]!.x - 1, CAIRNS[n - 1]!.y - 1), facing: 'down' },
            { do: 'wait', ms: 600 },
            { do: 'look', actor: 'player' },
          ],
          '',
          'Sarnai\'s rider lifts the capstone. Patricio lays the bridle under it, bell and all, and the rider sets the stone back.',
          { set: { [S4.anchor]: true } },
        ),
        say(SA, 'Under the seventh. Only a rider who reads the sky will find it now.'),
      ],
    };
    nodes.buried = { lines: [nar('The seventh cairn. The bridle is under it.')] };
  }
  return script(`cairn_then_${n}`, nodes);
}

/** A cairn now: Salkhi drags its capstone off; under the seventh, if the memory put it there, the bell. */
function cairnNow(n: number): DialogueScript {
  const right = n === CAIRN_ANSWER;
  return script(`cairn_now_${n}`, {
    start: {
      lines: [],
      next: [
        ...(right ? [{ if: f(S4.done), to: 'taken' }, { if: all(f(S4.anchor), f(S4.accepted)), to: 'bell' }] : []),
        { if: f(S4.accepted), to: 'stones' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('A cairn of grey stones. Nine riders, nine cairns.')] },
    stones: {
      lines: [
        act([{ do: 'look', actor: 'npc:salkhi_plateau' }], '', 'Bayarmaa loops a rope round the capstone and Salkhi drags it off. Stones under it, and more stones.'),
        say(SK, 'I am not doing all nine.'),
      ],
    },
    ...(right
      ? {
          bell: {
            lines: [
              act([{ do: 'look', actor: 'npc:salkhi_plateau' }], '', 'Bayarmaa loops a rope round the seventh capstone. Salkhi leans into it, and the stone rolls off into the snow.'),
              nar('Under it, wrapped in oiled hide: a bridle, and on its brow-band a small bronze bell. It rings once in the cold.'),
              say(BY, 'Sarnai\'s bell. My grandmother said it went through the ice with her riders.', { set: { 'item.sarnai_bell': true, [S4.done]: true } }),
              say(BY, 'Ring it in a fight, envoy, and see who comes.'),
              say(SK, 'You are welcome.'),
            ],
          },
          taken: { lines: [nar('The seventh cairn, its capstone back on. The bridle is gone.')] },
        }
      : {}),
  });
}

const CAIRN_DIALOGUE: DialogueScript[] = [
  // The old herder by the cairns: the riddle, with Bayarmaa there; her grandmother's sketch of the Mare.
  script('old_herder_talk', {
    start: {
      lines: [],
      next: [
        { if: f(S4.done), to: 'after' },
        { if: f(S4.accepted), to: 'remind' },
        { if: all(f('party.bayarmaa'), not('act6.complete')), to: 'riddle' },
        { to: 'plain' },
      ],
    },
    plain: {
      lines: [
        say(OH, 'Nine riders went out on the ice with Sarnai and never came home. Nine cairns. The stone in the middle watches the sky.'),
        say(OH, 'When the sky is right, come back and I will tell you how it is read.'),
      ],
    },
    riddle: {
      lines: [
        act([{ do: 'face', actor: 'npc:old_herder', facing: 'player' }], OH, 'Sarnai\'s granddaughter, with the envoy. Then the sky is right enough.'),
        say(OH, 'Her riders hid her spare bridle "where the Mare\'s eye stood at the third horn". Nobody young has seen her over these stones.'),
        say(OH, 'She grazes low over the fjord this season. At first snow, fifty winters ago, she stood here.'),
        say(BY, 'My grandmother drew her for me. Nine stars round a bright tenth. The tenth is her eye.'),
        nar('Bayarmaa draws it in the snow with one finger. Gianna copies it into the Journal.', { set: { [S4.sketch]: true, [S4.accepted]: true } }),
        say(A, 'The snow round the stone shimmers, Gigi.'),
        nar('(The Cairn of Nine Riders is in the Quests page of the menu.)'),
      ],
    },
    remind: { lines: [say(OH, 'The eye at the third horn. From the stone; from anywhere else the line lies.')] },
    after: { lines: [say(OH, 'You read the sky as she did. I can stop watching it now.')] },
  }),
  script('cairn_echo', {
    start: { lines: [], next: [{ if: f(S4.sighted), to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The high stones, fifty winters ago: first snow, the night Sarnai\'s raid rode out. The sky is enormous, and turning.', { fx: 'fade' }),
        act([{ do: 'face', actor: 'npc:sarnai_cairn', facing: 'player' }], SA, 'Marshal. My spare bridle goes under a cairn tonight, where only a rider who reads the sky can find it.'),
        say(SA, 'Stand on the flat stone. Find the Mare. When the horn blows the third time, read where her eye stands.'),
      ],
    },
    again: { lines: [nar('The high stones, fifty winters ago. The sky turns over the cairns.')] },
  }),
  script('sarnai_cairn_talk', {
    start: { lines: [], next: [{ if: f(S4.anchor), to: 'buried' }, { if: f(S4.sighted), to: 'sighted' }, { to: 'stone' }] },
    stone: { lines: [say(SA, 'From the flat stone, Marshal. Anywhere else the line lies.')] },
    sighted: { lines: [say(SA, 'Where the line fell. My rider has the spade.')] },
    buried: { lines: [say(SA, 'Under the seventh. Ride well, Marshal. We ride at the next horn.')] },
  }),
  simple('cairn_rider_talk', [say('sarnai_rider', 'I carry the spade tonight, Marshal. I would rather carry a lance.')]),
  skyStone(),
  ...CAIRNS.map((_, i) => cairnThen(i + 1)),
  ...CAIRNS.map((_, i) => cairnNow(i + 1)),
];

// ---- S-2 The Fleet for Sale: the three chiefs (built Nov 4) ---------------------------------------------------------------

const LS = 'lawspeaker';
const HR = 'hrafn';
const S = 'samira';
const IN = 'whaling_jarl';
const KH = 'herd_chief';
const LAWSPEAKER = 'npc:lawspeaker';
const HRAFN = 'npc:hrafn';
const THREE_WORDS: Condition = all(f(FLEET.ingrid), f(FLEET.khulan), f(FLEET.hrafn));

/** The lawspeaker's conversation in the Moot (data/dialogue/skarragol.ts lawspeaker_talk): S-2's giver, at dawn. */
export const FLEET_LAWSPEAKER_BRANCHES: readonly DialogueBranch[] = [
  { if: f(FLEET.done), to: 'fleet_done' },
  { if: all(f(FLEET.accepted), THREE_WORDS), to: 'fleet_end' },
  { if: f(FLEET.accepted), to: 'fleet_wait' },
  { if: all(ORDVIK_DAWN, f('party.bayarmaa')), to: 'fleet_offer' },
];

export const FLEET_LAWSPEAKER_NODES: Readonly<Record<string, DialogueNode>> = {
  fleet_offer: {
    lines: [
      act([{ do: 'face', actor: LAWSPEAKER, facing: 'player' }], LS, 'The standard stands, envoy. The fleet is Zetwal\'s when the realm musters. It is on the hides.'),
      say(LS, 'On the water it is the chiefs\'. Three of them say the Crown would have paid better, and they mean to row slowly.'),
      act([{ do: 'face', actor: LAWSPEAKER, facing: 'right' }, { do: 'look', actor: HRAFN }], LS, 'Hrafn wants the blockade paid for. Not by the Crown, now. By the Throne.'),
      act([{ do: 'face', actor: HRAFN, facing: 'player' }], HR, 'Three winters of fish and no salt, lawspeaker. Somebody pays for them.'),
      act([{ do: 'face', actor: LAWSPEAKER, facing: 'player' }], LS, 'Jarl Ingrid of the outer fjord is on the quay. Four of the hulls are hers. She wants trade, not a horn.'),
      say(LS, 'And Khulan of the herds is at the race. Khulan believes nothing she has not seen win.'),
      say(BY, 'Khulan taught me to ride. She will want the grey mare over the line first.'),
    ],
    choices: [{ text: 'Ask the three chiefs.', set: { [FLEET.accepted]: true }, next: 'fleet_yes' }, { text: 'Not now.' }],
  },
  fleet_yes: {
    lines: [
      say(LS, 'Bring me their words and I will put them on the hides. Hides last longer than chiefs.'),
      nar('(The Fleet for Sale is in the Quests page of the menu.)'),
    ],
  },
  fleet_wait: {
    lines: [
      say(LS, 'Still to give their word:'),
      { if: not(FLEET.ingrid), speaker: LS, text: 'Jarl Ingrid, on the quay. Trade she can sell.' },
      { if: not(FLEET.khulan), speaker: LS, text: 'Khulan of the herds, at the race. A race won.' },
      { if: not(FLEET.hrafn), speaker: LS, text: 'Hrafn, beside me. The Throne\'s promise for the blockade, on a word he trusts.' },
    ],
  },
  fleet_end: {
    lines: [
      say(G, 'Jarl Ingrid, Khulan of the herds and Hrafn. Their hulls row for Zetwal at the Muster.'),
      act(
        [
          { do: 'walk', actor: LAWSPEAKER, to: at(MOOT.hides.x + 1, MOOT.hides.y + 1), facing: 'up' },
          { do: 'wait', ms: 1000 },
          { do: 'walk', actor: LAWSPEAKER, to: MOOT.lawspeaker },
          { do: 'face', actor: LAWSPEAKER, facing: 'player' },
        ],
        '',
        'The lawspeaker goes into her tent, to the Moot\'s newest hide, and cuts three lines into it with her knife.',
      ),
      say(LS, 'Three chiefs, nine hulls, one word. For Zetwal, at the Muster.', { set: { [FLEET.done]: true } }),
      say(BY, 'My father will say he arranged it.'),
    ],
  },
  fleet_done: { lines: [say(LS, 'Three chiefs on the hides. They will row fast now, and complain about it.')] },
};

/** Hrafn's conversation in the Moot (data/dialogue/skarragol.ts hrafn_talk): S-2's third chief. */
export const FLEET_HRAFN_BRANCHES: readonly DialogueBranch[] = [
  { if: f(FLEET.hrafn), to: 'fleet_after' },
  { if: all(f(FLEET.accepted), not('act6.complete')), to: 'fleet_weigh' },
];

/** Hrafn walks to the Crown's chest, corded for the road home, and lays his hand on it. */
/** Hrafn walks to the Crown's chest; the line about his hand on it is read while he stands there (Nov 7: it came after
 * he had walked back), and the next line brings him back. */
const HRAFN_AT_CHEST: StageCue[] = [
  { do: 'look', actor: HRAFN },
  { do: 'walk', actor: HRAFN, to: at(MOOT.chest.x, MOOT.chest.y + 1), facing: 'up' },
];
const HRAFN_BACK: StageCue[] = [
  { do: 'walk', actor: HRAFN, to: MOOT.hrafn },
  { do: 'face', actor: HRAFN, facing: 'player' },
  { do: 'look', actor: 'player' },
];

const PROMISE: DialogueLine[] = [
  act([{ do: 'face', actor: HRAFN, facing: 'player' }], HR, 'The Crown offered gold for the blockade. You sent it home in a corded chest. Who pays now, envoy?'),
  say(G, 'The Throne. When the realm musters, I will put the blockade\'s cost to the Claim myself, to the last plank.'),
];

export const FLEET_HRAFN_NODES: Readonly<Record<string, DialogueNode>> = {
  // Ordvik's regard, read as he weighs her word (engine/rpg.ts readStanding): Influence first, then Fear.
  fleet_weigh: {
    lines: [],
    set: { [STANDING_READ]: 'skarragol' },
    next: [
      { if: { flag: standingFlag('influence', 'skarragol'), gte: FLEET.influence }, to: 'fleet_word' },
      { if: { flag: standingFlag('fear', 'skarragol'), gte: FLEET.fear }, to: 'fleet_fear' },
      { to: 'fleet_unknown' },
    ],
  },
  fleet_word: {
    lines: [
      ...PROMISE,
      act(HRAFN_AT_CHEST, '', 'At the Crown\'s chest in the guest tent, corded for the road home, Hrafn lays his hand flat on its lid.'),
      act(HRAFN_BACK, HR, 'The skalds sing your name already, envoy. In Ordvik a sung name can promise.'),
      say(HR, 'My three hulls row for Zetwal. If the Throne does not pay, I will sing about you myself.', { set: { [FLEET.hrafn]: true } }),
    ],
  },
  fleet_fear: {
    lines: [
      ...PROMISE,
      act(HRAFN_AT_CHEST, '', 'At the Crown\'s chest in the guest tent, corded for the road home, Hrafn lays his hand flat on its lid.'),
      act(HRAFN_BACK, HR, 'Ordvik says the envoy does not lose fights. I would rather have your promise than your quarrel.'),
      say(HR, 'My three hulls row for Zetwal.', { set: { [FLEET.hrafn]: true } }),
    ],
  },
  fleet_unknown: {
    lines: [
      ...PROMISE,
      say(HR, 'Everyone in this tent has had a promise from an envoy. Nobody in Ordvik knows your name yet.'),
      say(BY, 'The skalds keep the names worth keeping. In the Saga Tent, on the hides.'),
    ],
  },
  fleet_after: { lines: [say(HR, 'Three hulls for Zetwal. And a song, if the Throne forgets.')] },
};

const INGRID = 'npc:whaling_jarl';
const KHULAN = 'npc:herd_chief';

const FLEET_DIALOGUE: DialogueScript[] = [
  // Jarl Ingrid of the outer fjord, on the quay at dawn: trade she can sell.
  script('whaling_jarl_talk', {
    start: {
      lines: [],
      next: [
        { if: f(FLEET.ingrid), to: 'after' },
        { if: all(f(FLEET.accepted), not('act6.complete')), to: 'ask' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say(IN, 'Four of those hulls are mine, envoy. The Crown measured them first. I noticed.')] },
    ask: {
      lines: [
        act([{ do: 'face', actor: INGRID, facing: 'player' }], IN, 'The lawspeaker sent you. Four hulls, envoy, and the Crown would have paid for every plank.'),
        say(IN, 'Zetwal pays in a war. Show me the alliance pays better than the Crown, in something I can sell.'),
      ],
      choices: [
        { text: 'Samira writes a trade letter.', if: f('party.samira'), next: 'letter' },
        { text: `Pay ${FLEET.gold} gold.`, if: { flag: 'gold', gte: FLEET.gold }, set: { 'gold.pay': FLEET.gold }, next: 'paid' },
        { text: 'Not now.' },
      ],
    },
    letter: {
      lines: [
        act([{ do: 'walk', actor: 'samira', to: at(FLEET.ingridAt.x + 1, FLEET.ingridAt.y), facing: 'left' }], S, 'Stockfish. The kitchens of Bab al-Dhahab buy it by the shipload, and pay Crown factors to fetch it.'),
        act([{ do: 'look', actor: 'samira' }, { do: 'wait', ms: 900 }], '', 'Samira takes out her slip-book and writes against the nearest hull.'),
        say(S, 'Ironvow stockfish to Bab al-Dhahab, on Ironvow keels, with no factor between. My mother\'s seal goes on it.'),
        say(IN, 'No factor between. The Crown never once offered that.'),
        say(S, 'The Crown is the factor.'),
        say(IN, 'Four hulls row for Zetwal.', { set: { [FLEET.ingrid]: true } }),
      ],
    },
    paid: {
      lines: [
        act([{ do: 'face', actor: INGRID, facing: 'player' }], IN, 'Three hundred toward the winter. The Crown would have paid more. It would also have kept the hulls.'),
        say(IN, 'Four hulls row for Zetwal.', { set: { [FLEET.ingrid]: true } }),
      ],
    },
    after: { lines: [say(IN, 'Four hulls, scraped and tarred. Tell your Muster to feed my rowers.')] },
  }),
  // Khulan of the herds, inside the race's field at dawn: the first-snow race won (S-2's race above).
  script('herd_chief_talk', {
    start: {
      lines: [],
      next: [
        { if: f(FLEET.khulan), to: 'after' },
        { if: all(f(FLEET.accepted), f(RACE_FLAGS.won), not('act6.complete')), to: 'pledge' },
        { if: all(f(FLEET.accepted), not('act6.complete')), to: 'race' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say(KH, 'I have never seen a fleet win anything in a blockade. I have seen horses win races.')] },
    race: {
      lines: [
        act([{ do: 'face', actor: KHULAN, facing: 'player' }], KH, 'The lawspeaker sent you. Then race, envoy. Once round the field, in the first snow.'),
        say(KH, 'If the grey mare wins, I will believe the alliance pays. I will believe anything.'),
        say(BY, 'The race judge is by the corral. Salkhi has been ready since the fjord.'),
      ],
    },
    pledge: {
      lines: [
        act([{ do: 'face', actor: KHULAN, facing: 'player' }], KH, 'I watched from here. The grey mare, round the last corner on the inside, by a head.'),
        act([{ do: 'face', actor: 'bayarmaa', facing: 'player' }], BY, 'She raced for the fleet\'s winter, Khulan. As the custom is.'),
        say(KH, 'An alliance that rides like that pays better than the Crown. Two hulls of the herds row for Zetwal.', { set: { [FLEET.khulan]: true } }),
      ],
    },
    after: { lines: [say(KH, 'Two hulls. And if the grey mare ever wants a ship, she has one.')] },
  }),
];

export const SKARRAGOL_QUEST_DIALOGUE: readonly DialogueScript[] = [...OPINION_DIALOGUE, ...RACE_DIALOGUE, ...CAIRN_DIALOGUE, ...FLEET_DIALOGUE];
