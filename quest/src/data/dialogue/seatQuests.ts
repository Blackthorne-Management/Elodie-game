// Se-4 The Unknotted Ribbon (secret; docs/quest/design/SIDE-QUESTS.md Se-4, SECRET-ITEMS.md 9, PUZZLES.md S-SEA; built
// Oct 27): Keeper Hollis, after the Parley, tells the archivist the Throne's law of the unknotted ribbon; in the sealing's
// memory the Throne's clerk walks to his register and asks Patricio the five questions of the minute (three wrong and he
// shuts it; the way back wipes the memory); the minute sealed in the register is the anchor, and Hollis lifts it out of
// the register in the present; his hearing at the desk takes each line on evidence only (Caona's oath, Benny's refusal,
// Yusuf's ledger, Thomas's record; the sun on the seventh Name Stone may stand for one); won, he unties the seventh ribbon
// from the Accord and gives it to Gianna. The Claim and the Hearing's morning (data/dialogue/seatClaim.ts) carry it.
//
// The owner's rules: shown, not told (the clerk walks to the register, Hollis walks to his desk and to the glass); no
// jokes in the Archive or its memory; Anissa never jokes.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueBranch, DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { RIBBON } from '../seatArchive.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
const say = (speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, ...extra });
const nar = (text: string, extra: Extra = {}): DialogueLine => ({ speaker: '', text, ...extra });
const act = (stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, stage, ...extra });
const script = (id: string, nodes: Record<string, DialogueNode>): DialogueScript => ({ id, start: 'start', nodes });
const at = (x: number, y: number) => ({ x, y });
const f = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });
const any = (...c: Condition[]): Condition => ({ any: c });

const G = 'gianna';
const A = 'anissa';
const P = 'patricio';
const H = 'hollis';
const CL = 'throne_clerk';
const HOLLIS = 'npc:hollis';
const CLERK = 'npc:echo_throne_clerk';

/** Anissa's and Patricio's three hints (PUZZLES.md S-SEA): at the offer, when the register shuts, when it shuts again. */
export const RIBBON_HINTS: readonly string[] = [
  'Tell him only what was true then, Gigi. And only what we can prove now.',
  '(Caona was never in this room. Benny said no out loud. The Dorini were paid.)',
  '(No one. He refused aloud. The Crown and paid allies. To the clerk alone. Leave it unknotted.)',
];

/** What Gianna can show at the hearing: the four pieces of the Journal, and the sun mark (once a hearing, for any line). */
const OATH: Condition = f('clue.first_oath');
const REFUSAL: Condition = any(f('item.benny_half_sheet'), f('item.bennys_refusal'));
const LEDGER: Condition = f('clue.harbor_price');
const RECORD: Condition = f('anchor.thomas_record');
const SUN: Condition = all(f('anchor.seventh_stone'), not(RIBBON.sun));

// ---- Keeper Hollis (data/dialogue/seat.ts hollis_talk, after the Parley) ---------------------------------------------

/** Spliced into hollis_talk before its 'after' node (story.terms_refused: the Parley is over). */
export const RIBBON_BRANCHES: readonly DialogueBranch[] = [
  { if: all(f('story.terms_refused'), f(RIBBON.done)), to: 'ribbon_kept' },
  { if: all(f('story.terms_refused'), f(RIBBON.accepted), f(RIBBON.anchor)), to: 'ribbon_hearing' },
  { if: all(f('story.terms_refused'), f(RIBBON.accepted)), to: 'ribbon_wait' },
  { if: f('story.terms_refused'), to: 'ribbon_offer' },
];

/** One line of the minute and the evidence offered for it: the right piece goes on, anything else ends the hearing. */
function minuteLine(n: number, reads: string, right: 'oath' | 'refusal' | 'ledger' | 'record'): DialogueNode {
  const pick = (k: typeof right): string => (k === right ? `ribbon_kept_${n}` : 'ribbon_fail');
  const choices: DialogueChoice[] = [
    { text: 'Caona\'s oath stone', if: OATH, next: pick('oath') },
    { text: 'Benny\'s refusal', if: REFUSAL, next: pick('refusal') },
    { text: 'Yusuf\'s ledger', if: LEDGER, next: pick('ledger') },
    { text: 'Thomas Stillwater\'s record', if: RECORD, next: pick('record') },
    // The stone can witness what Zetwal knew (the first three lines); Thomas's record has no stand-in (Claude's call:
    // the design's "finishable only after Chapter 9" holds).
    ...(n < 4 ? [{ text: 'The sun on the seventh stone', if: SUN, set: { [RIBBON.sun]: true }, next: `ribbon_sun_${n}` }] : []),
    { text: 'I have nothing for it.', next: 'ribbon_fail' },
  ];
  return {
    lines: [act([{ do: 'look', actor: HOLLIS }], H, reads), say(H, 'Show me.')],
    choices,
  };
}

/** What each piece proves, in Gianna's words, and Hollis keeping it. */
const KEPT: Record<number, DialogueLine[]> = {
  1: [
    say(G, 'Xaraguá\'s first oath, cut in the record house at Yucayeque. Xaraguá swears its own oaths.'),
    say(G, 'Nobody swore this one for it. Nobody was asked to.'),
  ],
  2: [say(G, '"I will not put my name to this page. B. Rodriguez." In his own hand, under the Dorini copy\'s ribbons.')],
  3: [
    say(G, 'Yusuf Dorini wrote the price in the margin the day it was sealed. "The price of the harbour. Twenty-five."'),
    say(G, 'Preference in the Crown\'s ports, for a harbour that was not theirs to sell. He wrote it so it would be a debt.'),
  ],
  4: [say(G, 'The boy in the gallery was Thomas Stillwater. He wrote what happened, not what the Crown said. It is in his record.')],
};

const LINES = [
  { n: 1, reads: '"For Xaraguá: no one. Xaraguá was not asked."', right: 'oath' },
  { n: 2, reads: '"The Lord of Ardencia refused the seventh page, aloud."', right: 'refusal' },
  { n: 3, reads: '"The clause was asked for by the Crown, and by allies paid for it."', right: 'ledger' },
  { n: 4, reads: '"The seventh page was read to the Throne\'s clerk alone."', right: 'record' },
] as const;

export const RIBBON_NODES: Readonly<Record<string, DialogueNode>> = {
  ribbon_offer: {
    lines: [
      say(H, 'The door is open to archivists, child. Only to archivists. Read what you like.'),
      act([{ do: 'look', actor: HOLLIS }, { do: 'face', actor: HOLLIS, facing: 'player' }], H, 'And since you are one: the seventh ribbon. It carries no witness knot. You saw.'),
      say(H, 'Throne law. A clause whose ribbon was never knotted may be struck, if the minute of its sealing shows no witness agreed.'),
      say(G, 'Where is the minute?'),
      say(H, 'Nowhere. The clerk opened his register that day and never wrote it. Nobody asked him the questions.'),
      say(H, 'Bring me a minute, archivist, and proof for every line of it. Then a keeper can strike a clause.'),
    ],
    choices: [
      { text: 'I will bring you the minute.', set: { [RIBBON.accepted]: true }, next: 'ribbon_taken' },
      { text: 'Not today, Keeper.', next: 'ribbon_later' },
    ],
  },
  ribbon_taken: {
    lines: [
      say(H, 'The clerk\'s register was on the side table, by the binding. Fifty years ago it was.'),
      act([{ do: 'face', actor: HOLLIS, facing: 'left' }], H, 'I will be on my stool. I am always on my stool.'),
      say(A, RIBBON_HINTS[0]!),
    ],
  },
  ribbon_later: { lines: [say(H, 'The ribbon has waited fifty years. It can wait for an archivist.')] },
  ribbon_wait: {
    lines: [
      say(H, 'A minute, archivist, and proof for every line. The clerk\'s register was on the side table by the binding.'),
      { if: f(RIBBON.shut), speaker: H, text: 'He was a clerk in a hurry, I expect. They always are, at a sealing.' },
    ],
  },
  ribbon_hearing: {
    set: { [RIBBON.sun]: false },
    lines: [
      act(
        [
          { do: 'look', actor: HOLLIS },
          { do: 'walk', actor: HOLLIS, to: at(RIBBON.desk.x, RIBBON.desk.y), facing: 'up' },
          { do: 'wait', ms: 600 },
          { do: 'face', actor: HOLLIS, facing: 'player' },
        ],
        '',
        'Hollis gets off his stool, takes the old register from his desk, and opens it at the minute.',
      ),
      say(H, 'The minute of the sealing, in the Throne\'s clerk\'s hand. Five lines. I take none of them on his word.'),
      say(H, 'A hearing, archivist. For each line, show me what proves it. One line without proof and the hearing fails.'),
    ],
    next: 'ribbon_line_1',
  },
  ...Object.fromEntries(LINES.map((l) => [`ribbon_line_${l.n}`, minuteLine(l.n, l.reads, l.right)])),
  ...Object.fromEntries(
    LINES.map((l) => [
      `ribbon_kept_${l.n}`,
      { lines: [...KEPT[l.n]!, say(H, 'Kept.')], next: l.n < 4 ? `ribbon_line_${l.n + 1}` : 'ribbon_line_5' } satisfies DialogueNode,
    ]),
  ),
  ...Object.fromEntries(
    LINES.filter((l) => l.n < 4).map((l) => [
      `ribbon_sun_${l.n}`,
      {
        lines: [
          say(G, 'The seventh Name Stone in Pòdlimyè. A Xaraguá name on it, and the sun my grandfather cut when Zetwal would not.'),
          say(H, '...A stone is a record too. I will take it. Once.'),
        ],
        next: `ribbon_line_${l.n + 1}`,
      } satisfies DialogueNode,
    ]),
  ),
  ribbon_line_5: {
    lines: [
      say(H, '"The Marshal would not knot the seventh ribbon. It was left unknotted."'),
      say(H, 'That line the Archive proves itself. The ribbon is under the glass, and it has no knot.'),
    ],
    next: 'ribbon_won',
  },
  ribbon_won: {
    lines: [
      act(
        [
          { do: 'walk', actor: HOLLIS, to: at(RIBBON.glass.x, RIBBON.glass.y), facing: 'up' },
          { do: 'wait', ms: 900 },
        ],
        '',
        'Hollis walks to the Accord in his slippers, lifts the glass, and unties the seventh ribbon from the binding.',
      ),
      act([{ do: 'walk', actor: HOLLIS, to: at(RIBBON.desk.x - 2, RIBBON.desk.y), facing: 'right' }, { do: 'face', actor: HOLLIS, facing: 'player' }], '', 'He folds it into the minute, and puts both into Gianna\'s hands.'),
      say(H, 'The Seventh Ribbon, archivist. Carry it to the Claim.'),
      say(H, 'Before every house, I will strike the clause it never bound. That is keeping.', {
        set: { [RIBBON.item]: true, [RIBBON.done]: true },
      }),
      say(A, 'Yari should be the one to hold it after, Gigi.'),
      act([{ do: 'walk', actor: HOLLIS, to: at(RIBBON.hollis.x, RIBBON.hollis.y), facing: 'left' }], '', 'Hollis goes back to his stool.'),
    ],
  },
  ribbon_fail: {
    lines: [
      say(H, 'The minute says it. Nothing you carry does. A keeper does not keep a line on a clerk\'s word.'),
      { if: not('anchor.thomas_record'), speaker: H, text: 'The boy in the gallery was writing, that day. Find what he wrote.' },
      act([{ do: 'walk', actor: HOLLIS, to: at(RIBBON.hollis.x, RIBBON.hollis.y), facing: 'left' }], H, 'The hearing is closed. Bring me what proves it, and we will begin again.'),
      { if: f(RIBBON.failed), speaker: A, text: 'Caona\'s oath. Benny\'s note. Yusuf\'s ledger. Thomas\'s record. In the minute\'s order, Gigi.' },
      { if: not(RIBBON.failed), speaker: A, text: 'Proof for every line, Gigi. What we carry, not what we remember.', set: { [RIBBON.failed]: true } },
    ],
  },
  ribbon_kept: { lines: [say(H, 'Keep it flat, archivist. A ribbon creases.')] },
};

// ---- The clerk's register (the sealing's memory) ---------------------------------------------------------------------

/** The five questions (SECRET-ITEMS.md 9): the clerk's words, then three answers, the right one at `right`. */
const QUESTIONS: readonly { ask: string; answers: readonly [string, string, string]; right: number; writes: string }[] = [
  { ask: 'Who stood for Xaraguá at the sealing?', answers: ['Caona.', 'The Crown, for its waters.', 'No one. Xaraguá was not asked.'], right: 2, writes: '"For Xaraguá: no one. Not asked."' },
  { ask: 'Did the Lord of Ardencia sign the seventh page?', answers: ['Yes, all lords signed.', 'He refused, aloud.', 'He left before it was read.'], right: 1, writes: '"Ardencia: refused, aloud."' },
  { ask: 'Who asked for the clause?', answers: ['The Crown, and allies paid for it.', 'The Crown alone.', 'The Throne\'s clerk.'], right: 0, writes: '"Asked by the Crown, and by allies paid for it."' },
  { ask: 'Was the seventh page read aloud?', answers: ['Yes.', 'To you alone, clerk.', 'It was read to the Marshal.'], right: 1, writes: '"Read to the Throne\'s clerk alone."' },
  { ask: 'Will the Marshal knot the seventh ribbon?', answers: ['Yes, for peace.', 'Let the envoy knot it.', 'No. Leave it unknotted.'], right: 2, writes: '"The Marshal will not knot it."' },
];

function question(i: number): Record<string, DialogueNode> {
  const q = QUESTIONS[i]!;
  const n = i + 1;
  return {
    [`q${n}`]: {
      lines: [act([{ do: 'face', actor: CLERK, facing: 'player' }], CL, q.ask)],
      choices: q.answers.map((text, k): DialogueChoice => ({ text, next: k === q.right ? `q${n}_right` : `q${n}_wrong` })),
    },
    [`q${n}_right`]: {
      lines: [act([{ do: 'face', actor: CLERK, facing: 'down' }], '', `The clerk writes it: ${q.writes}`)],
      next: n < QUESTIONS.length ? `q${n + 1}` : 'seal',
    },
    [`q${n}_wrong`]: {
      lines: [say(CL, 'That is not what happened in this room, Marshal. I write what happened.'), nar('He scores the line through.')],
      next: [
        { if: f('echo.register_wrong2'), to: 'shut' },
        { if: f('echo.register_wrong1'), to: `q${n}_w2` },
        { to: `q${n}_w1` },
      ],
    },
    [`q${n}_w1`]: { set: { 'echo.register_wrong1': true }, lines: [], next: `q${n}` },
    [`q${n}_w2`]: { set: { 'echo.register_wrong2': true }, lines: [], next: `q${n}` },
  };
}

/** The register: inert until Hollis has asked (the hook), then the clerk's five questions; the anchor once sealed. */
const REGISTER: DialogueScript = script('clerk_register', {
  start: {
    lines: [],
    next: [
      { if: f(RIBBON.anchor), to: 'sealed' },
      { if: not(RIBBON.accepted), to: 'hook' },
      { if: f('echo.register_shut'), to: 'closed' },
      { to: 'ask' },
    ],
  },
  hook: { lines: [nar('The clerk\'s register, open at today. A question waits half-written: "Who stood for Xaraguá?" Nobody has asked it.')] },
  ask: {
    lines: [
      nar('The clerk\'s register, open at today. The minute of the sealing, its first question half-written.'),
      act(
        [
          { do: 'look', actor: CLERK },
          { do: 'walk', actor: CLERK, to: at(RIBBON.clerkAt.x, RIBBON.clerkAt.y), facing: 'down' },
          { do: 'face', actor: CLERK, facing: 'player' },
        ],
        CL,
        'The minute, Marshal. The Throne keeps one of every sealing. Five questions, and the tide is turning.',
      ),
    ],
    next: 'q1',
  },
  ...Object.assign({}, ...QUESTIONS.map((_, i) => question(i))),
  seal: {
    lines: [
      say(CL, 'Five answers. That is the minute of the sealing.'),
      say(P, 'Then seal it, clerk. In your own book, under your own wax.', { mood: 'troubled' }),
      act([{ do: 'face', actor: CLERK, facing: 'down' }, { do: 'wait', ms: 700 }], '', 'The clerk presses the Throne\'s wax onto the page, and shuts the register on it.', {
        set: { [RIBBON.anchor]: true },
      }),
      act([{ do: 'walk', actor: CLERK, to: at(RIBBON.clerkHome.x, RIBBON.clerkHome.y), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'He goes back to the binding. Nobody else in the room looks at the register again.'),
    ],
  },
  shut: {
    lines: [
      say(CL, 'Three lines scored through. The tide, Marshal. The minute can wait.'),
      act([{ do: 'face', actor: CLERK, facing: 'down' }], '', 'He shuts the register.', { set: { 'echo.register_shut': true } }),
      act([{ do: 'walk', actor: CLERK, to: at(RIBBON.clerkHome.x, RIBBON.clerkHome.y), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'He goes back to the binding.'),
      { if: not(RIBBON.shut), speaker: P, text: RIBBON_HINTS[1]!, mood: 'troubled' },
      { if: f(RIBBON.shut), speaker: P, text: RIBBON_HINTS[2]! },
      nar('(He will not open it again in this memory. Come back to now, and try again.)', { set: { [RIBBON.shut]: true } }),
    ],
  },
  closed: { lines: [nar('The register is shut. The clerk is at the binding and does not look up.')] },
  sealed: { lines: [nar('The clerk\'s register, shut on the Throne\'s wax. The minute is in it.')] },
});

/** The minute on Hollis's desk in the present (the anchor's change: the register is there, sealed, fifty years old). */
const MINUTE: DialogueScript = script('ribbon_minute', {
  start: { lines: [], next: [{ if: f(RIBBON.done), to: 'done' }, { to: 'open' }] },
  open: {
    lines: [
      nar('On Keeper Hollis\'s desk, the Throne\'s clerk\'s register, fifty years old. The minute of the sealing, under its wax.'),
      nar('Five lines, in a hurried hand.'),
    ],
  },
  done: { lines: [nar('The old register on the keeper\'s desk, open at the minute. The seventh ribbon is no longer folded in it.')] },
});

/** The way back from the memory once the minute is sealed: Hollis lifts it out of the register (once). */
export const MINUTE_RETURN: DialogueNode = {
  lines: [
    nar('The present. The Archive is quiet.'),
    act(
      [
        { do: 'look', actor: HOLLIS },
        { do: 'walk', actor: HOLLIS, to: at(RIBBON.desk.x, RIBBON.desk.y), facing: 'up' },
        { do: 'wait', ms: 800 },
        { do: 'face', actor: HOLLIS, facing: 'player' },
      ],
      H,
      'Archivist. The clerk\'s register, on my desk all these years. There is a minute in it now, under the Throne\'s wax.',
      { set: { [RIBBON.minuteSeen]: true } },
    ),
    act([{ do: 'walk', actor: HOLLIS, to: at(RIBBON.hollis.x, RIBBON.hollis.y), facing: 'left' }], H, 'Come to the desk when you can prove it, line by line.'),
  ],
};

export const SEAT_QUEST_DIALOGUE: readonly DialogueScript[] = [REGISTER, MINUTE];
