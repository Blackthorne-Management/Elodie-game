// Chapter 9's three side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md Al-1, Al-4 and Al-5, SECRET-ITEMS.md 7): Terribly Sorry (Edmund's five letters, delivered in person),
// The Clock That Waits (the clockmaker, the tower clock that stopped the night Thomas wrote, Agatha's vault, the Patient
// Hour) and Tea With Lady Rosalind (her townhouse at the last dawn, three cups, Thomas's record). Al-1 opens by day, when
// the Regent has refused (Rosalind in the hall: "He has never once written to me"); Al-4 and Al-5 at the last dawn. All
// three close when the trader sails.
//
// The owner's rules: shown, not told (Edmund walks up to each of the five and hands the letter, and each walks off; the
// watchman climbs the stair; Rosalind pours); Anissa never jokes and is never touched; no Rael. The jokes are Edmund's,
// the goose's and the people he hit.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { CLOCK_DO } from '../../engine/secrets.ts';
import { CLOCK_TOWER, LETTERS, TOWER_CLOCK } from '../aldermoor.ts';

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
const P = 'patricio';
const ED = 'edmund';
const RO = 'rosalind';
const CM = 'clockmaker';
const WM = 'watchman';

// ---- Al-1 Terribly Sorry --------------------------------------------------------------------------------------------

export const SORRY = ['sergeant', 'constable', 'bandit', 'goose', 'footman'] as const;
type Hit = (typeof SORRY)[number];
const ALL_SORRY: Condition = { all: SORRY.map((w) => f(`side.sorry.${w}`)) };

/** After the fifth letter (whichever it is): everyone, except one. */
const SORRY_END: DialogueNode = {
  lines: [
    act([{ do: 'face', actor: 'edmund', facing: 'player' }], ED, 'That\'s everyone. Five letters, five people. Four people and a goose.'),
    say(G, 'Everyone?'),
    say(ED, '...Except Mother. I\'ll take her one at tea. I\'ve written it. I wrote it first, actually.', {
      set: { 'side.sorry.done': true, 'item.sorry_letters': false },
    }),
  ],
};

/** One delivery: Edmund walks up and hands the letter; their reply; they walk off. */
function letter(who: Hit, speaker: string, reply: DialogueLine[], exitTo: { x: number; y: number }): DialogueScript {
  const npc = `letter_${who}`;
  const p = LETTERS[who];
  return script(`${npc}_talk`, {
    start: { lines: [], next: [{ if: f('side.sorry.accepted'), to: 'give' }, { to: 'plain' }] },
    plain: { lines: [say(speaker, who === 'goose' ? 'Honk.' : 'Morning.')] },
    give: {
      lines: [
        act([{ do: 'walk', actor: 'edmund', to: at(p.x, p.y + 1), facing: 'up' }], ED, who === 'goose' ? 'Terribly sorry. This is for you.' : 'Terribly sorry to trouble you. This is for you.'),
        ...reply,
        act([{ do: 'exit', actor: `npc:${npc}`, to: exitTo }], '', who === 'goose' ? 'The goose waddles off with its dignity.' : 'They go off, reading it again.', {
          set: { [`side.sorry.${who}`]: true },
        }),
      ],
      next: [{ if: ALL_SORRY, to: 'end' }],
    },
    end: SORRY_END,
  });
}

const SORRY_DIALOGUE: DialogueScript[] = [
  letter(
    'sergeant',
    'letter_sergeant',
    [
      say('letter_sergeant', '"Dear Sergeant. I am terribly sorry I hit you, and your colleague, and your other colleague. Yours, E. Stillwater."'),
      say('letter_sergeant', 'He\'s numbered us. Nobody has ever written to the press-gang. I\'m keeping this.'),
    ],
    at(LETTERS.sergeant.x + 6, LETTERS.sergeant.y + 2),
  ),
  letter(
    'constable',
    'letter_constable',
    [
      say('letter_constable', '"Dear Constable. I am terribly sorry about your hat." ...It wasn\'t my hat, Mr. Stillwater. It was his hat.'),
      say(ED, 'Oh dear. Then I owe him a hat, and you a letter that is about you.'),
      say('letter_constable', 'This one will do. Nobody writes to constables either.'),
    ],
    at(LETTERS.constable.x, LETTERS.constable.y + 4),
  ),
  letter(
    'bandit',
    'highwayman',
    [
      say('highwayman', 'You hit me on this road two winters ago. I was robbing your coach.'),
      say(ED, 'Yes. I\'ve put that in.'),
      say('highwayman', '"...though in fairness you were robbing us." ...Fair. Fair. I\'ll take it.'),
    ],
    at(LETTERS.bandit.x + 8, LETTERS.bandit.y - 4),
  ),
  letter(
    'goose',
    'goose',
    [
      say('goose', 'HONK.'),
      say(ED, '"Dear Goose. I am sorry. You started it, but I finished it, and a gentleman never finishes it."'),
      nar('The goose eats the letter.'),
      say(S, 'Accepted, I think.'),
    ],
    at(LETTERS.goose.x - 6, LETTERS.goose.y + 2),
  ),
  letter(
    'footman',
    'footman',
    [
      nar('The footman reads it twice, holding it at arm\'s length.'),
      say('footman', 'I have been hit by four Stillwaters in my time, Mr. Stillwater. You are the first to write.'),
      say('footman', 'I shall frame it. Over the pantry door.'),
    ],
    at(LETTERS.footman.x + 3, LETTERS.footman.y),
  ),
  // Lady Rosalind in the hall by day (her line moved here from data/dialogue/aldermoor.ts): Al-1 is offered once the Regent
  // has refused.
  script('rosalind_talk', {
    start: {
      lines: [],
      next: [
        { if: f('story.caught'), to: 'court' },
        { if: { all: [f('story.regent_refused'), f('party.edmund'), not('side.sorry.accepted')] }, to: 'letters' },
        { to: 'hall' },
      ],
    },
    hall: { lines: [say(RO, 'My son writes to everyone he hits. He has never once written to me.')] },
    court: { lines: [say(RO, 'A Stillwater court reads what a Stillwater wrote. Lay it, envoy.')] },
    letters: {
      lines: [
        say(RO, 'My son writes to everyone he hits. He has never once written to me.'),
        act([{ do: 'walk', actor: 'edmund', to: at(26, 12), facing: 'right' }], ED, 'Five, Mother. Written last night. A sergeant, a constable, a highwayman, a goose, and the Regent\'s footman.'),
        say(RO, 'The goose.'),
        say(ED, 'It started it.'),
        say(RO, 'Then deliver them. Today, and by hand. A Stillwater apologises in person or not at all.'),
        say(G, 'We\'ll go with him.', { set: { 'side.sorry.accepted': true, 'item.sorry_letters': true } }),
        nar('(Terribly Sorry is in the Quests page of the menu.)'),
      ],
    },
  }),
];

// ---- Al-4 The Clock That Waits (S-ALM, the Patient Hour) ------------------------------------------------------------

const C = TOWER_CLOCK.id;
const SAID = `clock.${C}.said`;
const said = (r: string): Condition => ({ flag: SAID, eq: r });
const ask = (req: string) => ({ [CLOCK_DO]: `${C}:${req}` });
const KEY_OUT = f(`clock.${C}.key_out`);
const JAMMED = f(`clock.${C}.jammed`);

function windingNodes(): Record<string, DialogueNode> {
  const turn = (gear: number): DialogueChoice => ({ if: { all: [{ not: KEY_OUT }, { not: JAMMED }] }, text: `Turn the key: the ${gear} gear.`, set: ask(`g${gear}`), next: 'after' });
  return {
    winder: {
      set: ask('look'),
      lines: [nar(`The hands read {v:clock.${C}.face}. The spring: {v:clock.${C}.spring} turns. The watchman: {v:clock.${C}.left} seconds.`)],
      choices: [
        ...TOWER_CLOCK.gears.map(turn),
        { if: { all: [{ not: KEY_OUT }, { not: JAMMED }] }, text: 'Rewind the spring.', set: ask('rewind'), next: 'after' },
        { if: { all: [{ not: KEY_OUT }, { not: JAMMED }] }, text: 'Pull the key out.', set: ask('pull'), next: 'after' },
        { if: { not: JAMMED }, text: 'Wait a moment.', set: ask('wait'), next: 'after' },
        { if: { all: [KEY_OUT, { not: JAMMED }, f('clue.tower_quill')] }, text: 'Wedge the quill in.', set: ask('wedge'), next: 'after' },
        { if: { all: [KEY_OUT, { not: JAMMED }] }, text: 'Put the key back.', set: ask('key'), next: 'after' },
        { if: JAMMED, text: 'Pull the quill out.', set: ask('free'), next: 'after' },
        { text: 'Step back.' },
      ],
    },
    after: {
      lines: [
        { if: said('turned'), speaker: '', text: 'One turn of the key, one second. Click: the hands jump.' },
        { if: said('spent'), speaker: '', text: 'The key will not turn. The spring is spent.' },
        { if: said('rewound'), speaker: '', text: 'Patricio rewinds the spring. It takes ten seconds, and the clock runs on while he does.' },
        { if: said('waited'), speaker: '', text: 'Tick.' },
        { if: said('pulled'), speaker: '', text: 'Patricio draws the key out. The clock runs on by itself, a minute to a tick.' },
        { if: said('keyed'), speaker: '', text: 'The key goes back in its hole.' },
        { if: said('jammed'), speaker: '', text: 'The quill catches in the escapement. The clock stops on the wrong minute.', fx: 'shake' },
        { if: said('freed'), speaker: '', text: 'Patricio works the quill free. The clock runs again.' },
        { if: said('refused'), speaker: '', text: 'Not now.' },
      ],
      next: [{ if: said('stopped'), to: 'stopped' }, { if: said('caught'), to: 'caught' }, { to: 'winder' }],
    },
    stopped: {
      lines: [
        nar('The quill catches on the tick. The hands stand at a quarter to three, and stay.', { fx: 'shake' }),
        nar('Behind the face, something heavy settles into its place.'),
        say(P, '(A quarter to three. By the tower bell.)'),
      ],
    },
    caught: {
      lines: [
        act(
          [{ do: 'enter', actor: 'watch', look: 'echo_old_sealbearer', from: at(CLOCK_TOWER.door.x, CLOCK_TOWER.door.y - 1), to: at(CLOCK_TOWER.spawn.x, CLOCK_TOWER.spawn.y - 2), facing: 'up' }],
          WM,
          'Who\'s up there? ...Nobody. Eleven ten. It\'s always eleven ten when I come up.',
        ),
        act([{ do: 'exit', actor: 'watch', to: at(CLOCK_TOWER.door.x, CLOCK_TOWER.door.y) }], '', 'He sets the hands back where he found them, and goes down. The spring is wound again.'),
        say(P, '(Ninety seconds, near enough, from the moment I came up. The clock and the key as they were.)'),
      ],
    },
  };
}

const CLOCK_DIALOGUE: DialogueScript[] = [
  // The clockmaker on the square at the last dawn.
  script('clockmaker_dawn_talk', {
    start: { lines: [], next: [{ if: f('side.patient_hour.done'), to: 'after' }, { if: f('side.patient_hour.accepted'), to: 'remind' }, { to: 'offer' }] },
    offer: {
      lines: [
        say(CM, 'Envoy. That record said a quarter to three, by the tower bell. The tower clock stopped the night it was written.'),
        say(CM, 'And Dame Agatha built a vault behind its face, "for the long game". My master said it opens at one hour only.'),
        act([{ do: 'face', actor: 'edmund', facing: 'right' }], ED, 'Agatha\'s vault. Grandfather Thomas told it like a story at bedtime. I thought it was one.'),
        say(CM, 'The keep is open this morning. The tower door is in the hall\'s north wall.'),
        say(CM, 'The tower is older than the hall, envoy. It remembers.'),
        say(G, 'Then we\'ll ask it.', { set: { 'side.patient_hour.accepted': true } }),
        nar('(The Clock That Waits is in the Quests page of the menu.)'),
      ],
    },
    remind: { lines: [say(CM, 'The night watchman climbed that tower every hour and a half, they say. Never late. Never early.')] },
    after: { lines: [say(CM, 'A quarter to three. I\'ll set my shop by it. I\'ll set the city by it, if they let me.')] },
  }),
  // The tower now: the face, the vault behind it.
  script('tower_face', {
    start: { lines: [], next: [{ if: f('side.patient_hour.done'), to: 'empty' }, { if: f(TOWER_CLOCK.anchor), to: 'open' }, { to: 'stuck' }] },
    stuck: {
      lines: [
        nar('The tower clock\'s face, rusted solid at an hour nobody can read. Beside it, a small iron door with no keyhole.'),
        say(ED, 'Agatha\'s vault. Keyed to an hour, the clockmaker said. Only one.'),
        say(A, 'The tower remembers, Gigi. On the boards, where it shimmers.'),
      ],
    },
    open: {
      lines: [
        nar('The hands stand at a quarter to three, black with fifty years. The little iron door beside the face is open.'),
        act([{ do: 'walk', actor: 'edmund', to: at(CLOCK_TOWER.vault.x, CLOCK_TOWER.vault.y + 1), facing: 'up' }], '', 'Inside: a watch movement, small and perfect, wrapped in a note in a brisk hand: "For the long game. A."'),
        say(ED, 'Dame Agatha\'s. It will fit Grandfather Thomas\'s watch. He gave it me.'),
        nar('Edmund opens his pocket watch and sets the movement in. It ticks, very quietly, and very patiently.', {
          set: { 'item.patient_hour': 1, 'side.patient_hour.done': true },
        }),
        say(ED, 'The Patient Hour, she called it in her book. I thought that was a story too.'),
      ],
    },
    empty: { lines: [nar('The tower clock\'s face: a quarter to three. The vault beside it, open and empty.')] },
  }),
  // Fifty years ago: the night Thomas wrote his record.
  script('tower_echo', {
    start: { lines: [], next: [{ if: f(TOWER_CLOCK.anchor), to: 'stopped' }, { if: f('clue.tower_night'), to: 'again' }, { to: 'first' }] },
    first: {
      set: ask('reset'),
      lines: [
        nar('The clock tower, fifty years ago. Night. The great clock ticks; its hands read eleven ten.', { fx: 'fade' }),
        nar('Far below, a lamp crosses the yard: the night watchman, starting his round. He will climb soon.'),
        say(P, '(A quarter to three, Thomas wrote. Two hours and thirty-five minutes on. Two hundred and fifteen.)'),
        say(P, '(The key turns the hands by its gears. Not by waiting: he would be up long before.)', { set: { 'clue.tower_night': true } }),
      ],
    },
    again: { set: ask('reset'), lines: [nar('The clock tower, fifty years ago. Eleven ten. The watchman\'s lamp crosses the yard.')] },
    stopped: { lines: [nar('The clock tower, fifty years ago. The hands stand at a quarter to three.')] },
  }),
  script('tower_echo_return', {
    start: { lines: [], next: [{ if: f(TOWER_CLOCK.anchor), to: 'stopped' }] },
    stopped: { lines: [act([{ do: 'look', actor: 'player' }], ED, 'The hands. A quarter to three. They\'ve been a quarter to three all my life, and nobody could read it for rust.')] },
  }),
  // The key and the works (the memory).
  script('tower_winder', {
    start: { lines: [], next: [{ if: f(TOWER_CLOCK.anchor), to: 'done' }, { to: 'winder' }] },
    done: { lines: [nar('The works stand still on a quarter to three, a quill in the escapement.')] },
    ...windingNodes(),
  }),
  script('tower_sill', {
    start: { lines: [], next: [{ if: f('clue.tower_quill'), to: 'gone' }, { to: 'quill' }] },
    quill: {
      lines: [
        nar('A clerk\'s spare quill on the sill, "T.S." cut into the shaft. Thomas was up here tonight, to read the hour for his record.'),
        nar('Patricio takes it. A quill is just the width of an escapement\'s tooth.', { set: { 'clue.tower_quill': true } }),
      ],
    },
    gone: { lines: [nar('The sill. Dust, and the outline of a quill.')] },
  }),
  simple('tower_sill_now', [nar('The sill. Fifty years of pigeons.')]),
];

// ---- Al-5 Tea With Lady Rosalind --------------------------------------------------------------------------------------

interface Cup {
  claim: string;
  /** Three answers; the Reason one (Thomas's record) wins the cup, the others only warm it. */
  answers: readonly { appeal: string; text: string; says: string; wins: boolean }[];
}

const CUPS: readonly Cup[] = [
  {
    claim: 'The Crown kept this city quiet for fifty years. Quiet is not nothing, envoy.',
    answers: [
      { appeal: 'Scripture', text: 'Elodie watches it.', says: 'Elodie watches the quiet too, my lady. She is patient. She is not deaf.', wins: false },
      { appeal: 'Reason', text: 'Thomas wrote in the margin.', says: 'Your father wrote the truth in its margin, and hid it behind a panel. The quiet was a lie he would not keep.', wins: true },
      { appeal: 'Compassion', text: 'Ask the tea shop.', says: 'Ask the tea shop on the Cross what the quiet was. She could not say her own name.', wins: false },
    ],
  },
  {
    claim: 'Aldermoor has never sat at another house\'s table. We keep our own counsel.',
    answers: [
      { appeal: 'Compassion', text: 'Edmund is at ours.', says: 'Your son sits at ours already, my lady. He has written to everyone at it.', wins: false },
      { appeal: 'Reason', text: 'Aldermoor signed the roll.', says: 'Aldermoor signed the Accord\'s roll, and Thomas filed it. A Stillwater sat at that table once.', wins: true },
      { appeal: 'Scripture', text: 'The Witness keeps oaths.', says: 'The Witness keeps oaths, not counsel. Aldermoor gave one.', wins: false },
    ],
  },
  {
    claim: 'And when the Throne asks why a Stillwater changed her mind in front of the whole court?',
    answers: [
      { appeal: 'Scripture', text: 'Say the goddess saw.', says: 'Tell it the goddess saw the court, my lady. She saw everyone.', wins: false },
      { appeal: 'Compassion', text: 'Say your son asked.', says: 'Tell it your son asked you to. He did. In writing.', wins: false },
      { appeal: 'Reason', text: 'Say you read the record.', says: 'Tell it you read your father\'s record. Written at a quarter to three, by the tower bell.', wins: true },
    ],
  },
];

function teaNodes(): Record<string, DialogueNode> {
  const nodes: Record<string, DialogueNode> = {};
  CUPS.forEach((cup, i) => {
    nodes[`cup_${i}`] = {
      lines: [act([{ do: 'look', actor: 'npc:rosalind_home' }], '', `She pours the ${['first', 'second', 'third'][i]} cup.`), say(RO, cup.claim)],
      choices: cup.answers.map((a, k): DialogueChoice => ({ text: `(${a.appeal}) ${a.text}`, next: `cup_${i}_${k}` })),
    };
    cup.answers.forEach((a, k) => {
      nodes[`cup_${i}_${k}`] = {
        lines: [say(G, a.says), nar(a.wins ? 'Lady Rosalind sets her cup down, and does not pick it up again for a while.' : 'Lady Rosalind sips, and says nothing.', { set: { [`side.tea.cup_${i}`]: a.wins } })],
        next: i < CUPS.length - 1 ? `cup_${i + 1}` : 'verdict',
      };
    });
  });
  const cups = CUPS.map((_, i) => f(`side.tea.cup_${i}`));
  const twoCups: Condition = { any: [{ all: [cups[0]!, cups[1]!] }, { all: [cups[0]!, cups[2]!] }, { all: [cups[1]!, cups[2]!] }] };
  nodes.verdict = { lines: [], next: [{ if: twoCups, to: 'won' }, { to: 'lost' }] };
  nodes.won = {
    lines: [
      say(RO, 'My father wrote everything down, and read it back. I have been reading it back all morning.'),
      say(RO, 'Aldermoor will sit at the Hearing, envoy. I will sit for it. Persuaded, which is a word I have never once used.', { set: { 'side.tea.done': true } }),
      say(ED, 'Mother.'),
      say(RO, 'Drink your tea, Edmund.'),
      { if: f('side.sorry.done'), speaker: ED, text: 'I wrote you one too. The first one.' },
      { if: f('side.sorry.done'), speaker: '', text: 'Lady Rosalind reads it. She folds it once, and puts it inside her sleeve.' },
    ],
  };
  nodes.lost = {
    lines: [say(RO, 'A pleasant pot, envoy. Nothing in it I have not heard from the Regent. Come back when you have something of my father\'s.')],
  };
  return nodes;
}

const TEA_DIALOGUE: DialogueScript[] = [
  script('rosalind_home_talk', {
    start: { lines: [], next: [{ if: f('side.tea.done'), to: 'after' }, { if: f('side.tea.accepted'), to: 'again' }, { to: 'tea' }] },
    tea: {
      lines: [
        act([{ do: 'face', actor: 'npc:rosalind_home', facing: 'player' }], RO, 'Envoy. Edmund. Sit. I have put out three cups.'),
        say(RO, 'I withdrew from the Regent\'s council in front of the whole court. A Stillwater does nothing in front of people.'),
        say(RO, 'Persuade me I was right, and that Aldermoor should sit at Eightgate. One cup at a time.', { set: { 'side.tea.accepted': true } }),
        nar('(Tea With Lady Rosalind is in the Quests page of the menu.)'),
      ],
      next: 'cup_0',
    },
    again: {
      lines: [say(RO, 'Another pot, envoy?')],
      choices: [{ text: 'Another pot.', next: 'cup_0' }, { text: 'Not now.' }],
    },
    after: { lines: [say(RO, 'The tea is cold, envoy. I have been reading.')] },
    ...teaNodes(),
  }),
  simple('townhouse_shut', [nar('Lady Rosalind Stillwater\'s house, grey stone and a brass knocker. Her maid says she is at the keep.')]),
  simple('thomas_portrait', [nar('A portrait of a thin man at a gallery desk, a quill behind his ear: Thomas Stillwater, Crown clerk.'), say(ED, 'Grandfather. He hated sitting for it. You can tell.')]),
  simple('rosalind_tea_table', [nar('A low table, a silver pot, three cups. The good ones.')]),
];

export const ALDERMOOR_QUEST_DIALOGUE: readonly DialogueScript[] = [...SORRY_DIALOGUE, ...CLOCK_DIALOGUE, ...TEA_DIALOGUE];
