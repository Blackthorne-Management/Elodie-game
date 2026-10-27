// Z-5 Bread With No Debt (Chapter 1; docs/quest/design/SIDE-QUESTS.md Z-5, the rebel safehouse; built Oct 27): the
// town guard and the captain's pencil note, the Quiet Crown's recruiters (a name and a small promise), the harbor
// bakery's back door (bread, and nothing asked), the grey thumbprint on the flour sacks, and the store room's memory:
// the Revolution's grain store, where the quartermaster gives a woman grain "for anyone who asks. The Marshal's order."
// The baker: "Then we are keeping an old order." Places and flags in data/bakery.ts. No fighting.
//
// The owner's rules: shown, not told (the woman walks in at the back door, is given grain and walks out); Anissa never
// jokes.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueBranch, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { BAKERY, NO_DEBT_OPEN, Z5 } from '../bakery.ts';

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
const P = 'patricio';
const TG = 'town_guard';
const RA = 'recruiter_a';
const BK = 'baker';
const QM = 'quartermaster';
const BAKER = 'npc:baker';

/** Everything the baker needs to hear it: both tables seen, the thumbprint, the order in the memory. */
const READY: Condition = all(f(Z5.table), f(Z5.bakery), f(Z5.thumbprint), f(Z5.order));

// ---- The town guard (data/dialogue/zetwal.ts town_guard_talk) ---------------------------------------------------------

export const NO_DEBT_GUARD_BRANCHES: readonly DialogueBranch[] = [
  { if: f(Z5.done), to: 'no_debt_done' },
  { if: f(Z5.accepted), to: 'no_debt_wait' },
  { if: NO_DEBT_OPEN, to: 'no_debt' },
];

export const NO_DEBT_GUARD_NODES: Readonly<Record<string, DialogueNode>> = {
  no_debt: {
    lines: [
      say(G, 'The tract in the Hall. Someone wrote under it in pencil: "Ask who holds the debt now."'),
      say(TG, 'The captain. He wrote that the day we seized them. Nobody gives bread for nothing.'),
      say(TG, 'Two places give it out today. The hooded ones, by the stage. And a back door by the harbor: the bakery behind the south row.'),
      say(TG, 'Find out which one wants something back. And who pays for the flour.'),
    ],
    choices: [
      { text: 'I will find out.', set: { [Z5.accepted]: true }, next: 'no_debt_taken' },
      { text: 'Not now.', next: 'no_debt_later' },
    ],
  },
  no_debt_taken: { lines: [say(TG, 'Quietly, envoy\'s daughter. The hooded ones notice who asks.')] },
  no_debt_later: { lines: [say(TG, 'The bread will still be free tomorrow. That is what worries me.')] },
  no_debt_wait: {
    lines: [
      say(TG, 'The hooded ones by the stage. The bakery\'s back door by the harbor. Who pays for the flour?'),
      { if: all(f(Z5.table), not(Z5.bakery)), speaker: A, text: 'The hooded ones wanted your name, Gigi. Let\'s see what the bakery wants.' },
    ],
  },
  no_debt_done: { lines: [say(TG, 'The Marshal\'s own order, kept in a bakery for fifty years. I will tell the captain. Quietly.')] },
};

// ---- The Quiet Crown's recruiters (data/dialogue/zetwal.ts recruiter_a_talk) -----------------------------------------

export const NO_DEBT_RECRUITER_BRANCHES: readonly DialogueBranch[] = [{ if: all(f(Z5.accepted), not(Z5.table)), to: 'no_debt_bread' }];

export const NO_DEBT_RECRUITER_NODES: Readonly<Record<string, DialogueNode>> = {
  no_debt_bread: {
    lines: [
      act([{ do: 'face', actor: `npc:${RA}`, facing: 'player' }], RA, 'Bread? Of course. We have bread for everyone today.'),
      say(RA, 'Only your name, for our book. And a small promise.'),
      say(G, 'What promise?'),
      say(RA, 'To listen, when we ask you to. Nothing more. Quiet is not much to promise.'),
      say(G, 'Then I will keep my name, and you can keep your bread.', { set: { [Z5.table]: true } }),
      say(RA, 'The door stays open. It always does.'),
      { if: f(Z5.bakery), speaker: A, text: 'The bakery didn\'t want your name, Gigi. It didn\'t want anything.' },
    ],
  },
};

// ---- The harbor bakery -----------------------------------------------------------------------------------------------

const BAKER_TALK: DialogueScript = script('baker_talk', {
  start: {
    lines: [],
    next: [
      { if: all(f(Z5.accepted), READY), to: 'order' },
      { if: all(f(Z5.accepted), f(Z5.bakery)), to: 'again' },
      { if: f(Z5.accepted), to: 'first' },
      { to: 'before' },
    ],
  },
  before: {
    lines: [
      act([{ do: 'face', actor: BAKER, facing: 'player' }], BK, 'Pran, pran. Pa gen dèt.', { translation: 'Take, take. No debt.' }),
      nar('She puts a warm round loaf in Gianna\'s hands, and goes back to her dough.'),
    ],
  },
  first: {
    lines: [
      act([{ do: 'face', actor: BAKER, facing: 'player' }], BK, 'Pran, pran. Pa gen dèt.', { translation: 'Take, take. No debt.' }),
      nar('She puts a warm round loaf in Gianna\'s hands. She does not ask her name.'),
      say(G, 'What do I owe you?'),
      say(BK, 'Nothing. That is the whole of it. There is no book in this house.'),
      say(G, 'Then who pays for the flour?'),
      act([{ do: 'face', actor: BAKER, facing: 'down' }], BK, 'Flour is flour, pitit. Eat your bread.', { set: { [Z5.bakery]: true } }),
      say(A, 'Everyone\'s flour comes from somewhere, Gigi. The sacks are in the back room.'),
    ],
  },
  again: {
    lines: [
      say(BK, 'Flour is flour, pitit.'),
      { if: not(Z5.table), speaker: A, text: 'The hooded ones by the stage give bread too, Gigi. Ask them what it costs.' },
      { if: not(Z5.thumbprint), speaker: A, text: 'The sacks in the back room, Gigi.' },
      { if: all(f(Z5.thumbprint), not(Z5.order)), speaker: A, text: 'The air shimmers over the back room\'s floor. This house remembers something.' },
    ],
  },
  order: {
    lines: [
      say(G, 'This house was the Revolution\'s grain store. The quartermaster gave grain to anyone who asked.'),
      say(G, '"Grain for anyone who asks. The Marshal\'s order." My grandfather\'s.'),
      act([{ do: 'face', actor: BAKER, facing: 'player' }, { do: 'wait', ms: 700 }], '', 'The baker stops kneading.'),
      say(BK, 'Then we are keeping an old order.'),
      say(BK, 'My mother kept it, and hers. Somebody keeps the flour coming. I do not ask who, and I do not write it down.'),
      say(BK, 'Come to the back door whenever you are hungry, pitit. What the flour cost, for you. Bread was never the debt.', {
        set: { [Z5.done]: true },
      }),
    ],
  },
});

const BAKER_SHOP: DialogueScript = simple('baker_shop_talk', [say(BK, 'What the flour cost, pitit. Same for everyone. Nobody writes it down.')]);

const OVEN: DialogueScript = simple('bakery_oven', [nar('The bread oven, still warm from the morning\'s loaves.')]);

const SACKS: DialogueScript = script('flour_sacks', {
  start: { lines: [], next: [{ if: f(Z5.thumbprint), to: 'seen' }, { if: f(Z5.accepted), to: 'look' }, { to: 'plain' }] },
  plain: { lines: [nar('Flour sacks, stacked to the beam.')] },
  look: {
    lines: [
      nar('Flour sacks, stacked to the beam. No miller\'s mark on any of them.'),
      nar('On every seam, a small grey thumbprint, in ash.', { set: { [Z5.thumbprint]: true } }),
      say(A, 'Somebody pressed a thumb on each one, Gigi. On purpose.'),
      say(A, 'And the air shimmers over the floor in here. This room remembers something.'),
    ],
  },
  seen: { lines: [nar('Flour sacks, and a grey thumbprint in ash on every seam.')] },
});

// ---- The store room's memory: the grain store, fifty years ago --------------------------------------------------------

const WOMAN = 'grain_w';
const ECHO_ENTER: DialogueScript = script('grain_store_enter', {
  start: { lines: [], next: [{ if: f(Z5.order), to: 'again' }, { to: 'first' }] },
  first: {
    lines: [
      nar('Fifty years ago. The house is a storehouse: grain sacks to the beam, the Revolution\'s cockade chalked on the door.'),
      act([{ do: 'look', actor: `npc:echo_quartermaster` }], '', 'The quartermaster counts sacks with a stub of chalk.'),
      act(
        [
          { do: 'enter', actor: WOMAN, look: 'villager', from: at(BAKERY.door.x, BAKERY.door.y), to: at(BAKERY.woman.x, BAKERY.woman.y), facing: 'right' },
          { do: 'look', actor: WOMAN },
        ],
        'grain_woman',
        'Is it true? Grain, for anyone?',
      ),
      act([{ do: 'face', actor: 'npc:echo_quartermaster', facing: 'left' }], QM, 'Grain for anyone who asks. The Marshal\'s order.'),
      say('grain_woman', 'What do I owe?'),
      say(QM, 'Nothing. Write nothing down, he says. A debt is how they held us.'),
      act([{ do: 'wait', ms: 600 }, { do: 'exit', actor: WOMAN, to: at(BAKERY.door.x, BAKERY.door.y) }, { do: 'look', actor: 'player' }], '', 'He fills her basket. She goes out the back door with it held in both arms.'),
      say(P, '(Grain for anyone who asks. I said it the first night. They kept it.)', { set: { [Z5.order]: true } }),
    ],
  },
  again: { lines: [nar('The grain store, fifty years ago. The quartermaster counts sacks with a stub of chalk.')] },
});

const ECHO_RETURN: DialogueScript = script('grain_store_return', {
  start: { lines: [nar('The present. The bakery smells of bread.')], next: [{ if: all(f(Z5.order), not(Z5.done)), to: 'tell' }] },
  tell: { lines: [say(A, 'Tell her, Gigi. She should know whose order she keeps.')] },
});

const QUARTERMASTER: DialogueScript = simple('echo_quartermaster_talk', [say(QM, 'Grain for anyone who asks, Marshal. Your order. Nobody signs for it.')]);
const GRAIN_STORE: DialogueScript = simple('grain_store', [nar('Grain sacks to the beam, the Revolution\'s cockade chalked on each.')]);

export const ZETWAL_QUEST_DIALOGUE: readonly DialogueScript[] = [BAKER_TALK, BAKER_SHOP, OVEN, SACKS, ECHO_ENTER, ECHO_RETURN, QUARTERMASTER, GRAIN_STORE];
