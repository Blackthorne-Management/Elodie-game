// The Nightingale Key's hidden conversations (docs/quest/design/SECRET-ITEMS.md 8, built Nov 10; Claude's calls): with the
// Key, the silver sigil over a Quiet Crown cell member opens one conversation per capital. Each says why they joined
// (a file sold, a curtain over a flame, a daughter on a list, a father's thirty years of shouting, a brother at the oars,
// a son on the Iron Gate road); Gianna has three things to say and one of them reaches them. A wrong one changes nothing
// ("Not today"), and they can be asked again or never. The right one: Anissa walks up and speaks, the small silver crown
// comes off, and they walk off the map (data/quietCells.ts says where); the cell's flag pays its Concord once
// (config.ts CELL_CONCORD) and the Journal keeps the line.
//
// The owner's rules: shown, not told (they walk off; Anissa walks up to whoever she speaks to); no jokes in a scene with
// Anissa; no Rael (no member knows him); the cultures fictional and respectful, the Quiet Crown tied to no real faith.

import { CELL_CONCORD } from '../../config.ts';
import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import type { Dir8 } from '../../engine/types.ts';
import { KEY_HELD, QUIET_CELLS, cellLeft, type CellId } from '../quietCells.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
const say = (speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, ...extra });
const nar = (text: string, extra: Extra = {}): DialogueLine => ({ speaker: '', text, ...extra });
const act = (stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, stage, ...extra });
const f = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });

const G = 'gianna';
const A = 'anissa';

/** The conversation is open: the party holds the Key, and they are still in their cell. */
export const cellOpen = (id: CellId): Condition => all(f(KEY_HELD), not(cellLeft(id)));

interface Answer {
  /** The choice (at most 36 characters). */
  text: string;
  /** What Gianna says. */
  says: string;
  /** Their answer when it does not reach them (the right answer has none). */
  reply?: string;
  if?: Condition;
}

interface CellTalk {
  id: CellId;
  /** Their speaker id (data/speakers.ts). */
  speaker: string;
  /** Who they are, for the closing note ("The Hall copyist"). */
  role: string;
  /** Who they are and why they joined (the first line turns them to Gianna). */
  meet: readonly string[];
  /** The three things Gianna can say; the one without a reply is the one that reaches them. */
  answers: readonly Answer[];
  /** After the right word, before Anissa: their first answer. */
  heard: string;
  /** Anissa, at their side. */
  anissa: string;
  /** The crown coming off (narration), and their last line before they walk off. */
  crown: string;
  last: string;
  /** The narration as they walk off. */
  leaves: string;
  /** A companion's line, when the walking companion is with them. */
  companion?: DialogueLine;
}

const towards = (from: { x: number }, to: { x: number }): Dir8 => (to.x < from.x ? 'left' : 'right');

/**
 * A cell member's nodes, `q_` first (so they sit beside a built conversation's own): q_meet (who they are, then the
 * choice), q_try_<k> for each answer. A wrong answer sets nothing; the right one walks Anissa up, takes the crown off,
 * and walks them off the map, setting their flag on the last step.
 */
export function cellNodes(t: CellTalk): Record<string, DialogueNode> {
  const c = QUIET_CELLS[t.id];
  const me = `npc:${c.npc}`;
  const nodes: Record<string, DialogueNode> = {
    q_meet: {
      lines: [act([{ do: 'face', actor: me, facing: 'player' }], t.speaker, t.meet[0]!), ...t.meet.slice(1).map((m) => say(t.speaker, m))],
      choices: [
        ...t.answers.map((a, k): DialogueChoice => ({ text: a.text, next: `q_try_${k}`, ...(a.if ? { if: a.if } : {}) })),
        { text: 'Not now.' },
      ],
    },
  };
  t.answers.forEach((a, k) => {
    nodes[`q_try_${k}`] = {
      lines: a.reply
        ? [say(G, a.says), say(t.speaker, a.reply), nar('(Not today. Another word, another time, or none.)')]
        : [
            say(G, a.says),
            ...(t.companion ? [t.companion] : []),
            say(t.speaker, t.heard),
            act(
              [
                { do: 'walk', actor: 'follower', to: { ...c.anissa }, facing: towards(c.anissa, c.at) },
                { do: 'face', actor: me, facing: towards(c.at, c.anissa) },
              ],
              A,
              t.anissa,
            ),
            act([{ do: 'face', actor: me, facing: 'player' }], '', t.crown),
            say(t.speaker, t.last),
            act([{ do: 'exit', actor: me, to: { ...c.exit } }], '', t.leaves, { set: { [cellLeft(t.id)]: true } }),
            nar(`(${t.role} has left the Quiet Crown's cell. Concord +${CELL_CONCORD}.)`),
          ],
    };
  });
  return nodes;
}

// ---- The six ---------------------------------------------------------------------------------------------------------

export const CELL_TALKS: Readonly<Record<CellId, CellTalk>> = {
  // Kirinoura, at dawn after the Fox: the Hall's copyist whose fair copies the Paper Fox sold to the Crown.
  kirinoura: {
    id: 'kirinoura',
    speaker: 'cell_copyist',
    role: 'The Hall copyist',
    meet: [
      'You came through the Hall, envoy. I copied its files for twelve years. A fair hand, the keeper said.',
      'The Fox sold my copies to the Crown. Names, in my hand. Two were fishers off this bank. They never came home.',
      'So I sit with people who write nothing down. No files, no names. Nothing a fox can sell.',
    ],
    answers: [
      { text: 'The Fox is bound now.', says: 'The Paper Fox is bound in the Hall. Nobody is selling Kuroshi\'s files now.', reply: 'There is always another fox, envoy. Paper waits for one.' },
      { text: 'Writing it down is how we know.', says: 'Writing it down is how anyone knows what was done.', reply: 'Knowing is what the Fox sold. Not today, envoy.' },
      { text: 'What do they listen for?', says: 'Your cell writes nothing down. Then what does it ask you to listen for?' },
    ],
    heard: '...A girl. Small, with a light in her. Where she sleeps, who walks with her. A danger to the quiet, they said.',
    anissa: 'That\'s me. I sleep on the trader\'s boat, by the pier. Will you tell them?',
    crown: 'The copyist looks at Anissa for a long moment. Then she unpins a small silver crown from her collar and sets it on the stones.',
    last: 'No files, they told me. And they keep one name. Yours. The Library needs copyists. I\'ll write true ones, and sign them.',
    leaves: 'She walks off along the west bank, to the Lantern Library\'s door.',
  },
  // Agnipur, at dawn: the old temple sweeper who saw the priests draw the curtain over the low flame.
  agnipur: {
    id: 'agnipur',
    speaker: 'cell_sweeper',
    role: 'The temple sweeper',
    meet: [
      'Twenty years I swept the Court\'s colonnade, envoy. I saw the priests draw the curtain over the flame.',
      'Low, it was. And every evening at the lamp hour they told the city all was well.',
      'The quiet ones tell you nothing at all. Nothing cannot be a lie. So I listen to them now.',
    ],
    answers: [
      { text: 'The priests meant well.', says: 'The priests meant to spare the city a fright.', reply: 'Meaning well is what a curtain is for, envoy.' },
      { text: 'Saying nothing hides things too.', says: 'Saying nothing hides as much as any curtain does.', reply: 'Then it hides them kindly. Leave an old man his quiet.' },
      { text: 'Go and look at the flame.', says: 'The curtain is down. The Court told the city at dawn: the flame was low, never out. Go and look at it.' },
    ],
    companion: { if: f('party.vikram'), speaker: 'vikram', text: 'I tore that curtain down myself, uncle. Nobody draws it again while I live in Agnipur.' },
    heard: '...The Court said so? Out loud, to the city?',
    anissa: 'Out loud. I heard them. It\'s low, and it\'s burning, and everyone can see it.',
    crown: 'The sweeper unpins a small silver crown from his shawl, turns it over once, and puts it in Gianna\'s hand.',
    last: 'Melt it for a lamp. I\'ll sweep the colonnade again, where I can see the flame.',
    leaves: 'He walks up the bazaar to the Court of the Flame, leaning on his broom.',
  },
  // Kingsmere, at dawn after the Hushed: the ropemaker who sat in the bog chapel to keep his daughter off the purge list.
  kingsmere: {
    id: 'kingsmere',
    speaker: 'cell_ropemaker',
    role: 'The ropemaker',
    meet: [
      'I sit with the quiet ones, envoy. I\'ll not lie about it. Every week in the bog chapel, until she fell.',
      'My girl Hester sets type at the printing barn. In Kingsmere, printers end up on lists.',
      'They said a man who sits with them keeps his family\'s name off the list. So I sat. Two winters.',
    ],
    answers: [
      { text: 'The Hushed is beaten.', says: 'The one your cell called the Hushed is beaten, and taken in the Regent\'s own court.', reply: 'And whoever comes after her will remember who stopped sitting.' },
      { text: 'Read the purge list with me.', says: 'We took the purge list from the bog chapel\'s altar. Read it with me.', if: f('item.purge_list') },
      { text: 'Edmund will speak for you.', says: 'Edmund Stillwater will speak for you, and for Hester.', reply: 'Begging his pardon. A Stillwater\'s word is how lists get written.', if: f('party.edmund') },
    ],
    heard: 'Hester Combe. The printing barn. And "quiet" beside it, in the Hushed\'s word. Two winters. They never crossed it out.',
    anissa: 'The printer is warning every door on that list by noon. Hers too. Go and be there when he knocks.',
    crown: 'He takes a small silver crown from his coat and drops it in the gutter. The rain carries it off down the Cross.',
    last: 'She\'ll be at the barn already, with her hands black. I\'ll walk out to her.',
    leaves: 'He goes down the Cross to the heath road, not hurrying, and then hurrying.',
  },
  // Pòdlimyè, at the Muster: the hooded stranger of Chapter 1 ("You would be surprised who wears our hood").
  podlimye: {
    id: 'podlimye',
    speaker: 'recruiter_b',
    role: 'The hooded stranger',
    meet: [
      'The woman by the mill fell in a Stillwater court, they tell me. You wanted to know who wears our hood. I do.',
      'My father sat on the harbor council thirty years. Thirty years of shouting, and the Crown kept the harbor all the same.',
      'A thousand voices, envoy\'s daughter, and not one of them listened. One voice is kinder. The quiet goes on.',
    ],
    answers: [
      { text: 'She was the Regent\'s almoner.', says: 'The woman you followed was the Regent\'s almoner. The Crown disowns her now.', reply: 'I know. They told me. It does not make the shouting any kinder.' },
      { text: 'The Muster is listening.', says: 'Seven houses came to this plaza and sat down to listen to each other.', reply: 'They will be shouting by the third day. They always are.' },
      { text: 'Anissa, will you answer her?', says: 'Anissa. Will you answer her?' },
    ],
    heard: 'The little one? She never says a word.',
    anissa: 'You called me a quiet little girl, after the lamp. I wasn\'t quiet. Nobody was listening. Your quiet wanted me to stay that way.',
    crown: 'The stranger is still for a long time. Then she pushes back her hood, and the veil with it.',
    last: 'My father would have liked you. He never stopped talking either. I want to hear that council argue.',
    leaves: 'She walks up through the camps toward the Accord Square, her hood down.',
  },
  // Yucayeque, on the war's day: the casabe baker whose brother the Crown's marines took to row their launches.
  yucayeque: {
    id: 'yucayeque',
    speaker: 'cell_baker',
    role: 'The casabe baker',
    meet: [
      'When the Crown shut the harbor, the marines took my little brother to row their launches. He was fourteen.',
      'The quiet ones came up the hill at night with cassava. They said: be quiet, and the Crown keeps him fed.',
      'So I bake, envoy, and I am quiet.',
    ],
    answers: [
      { text: 'They are the Regent\'s people.', says: 'The ones who come at night are the Regent\'s people, not yours.', reply: 'Then the Regent feeds my brother. I will stay quiet for that.' },
      { text: 'Quiet never freed anyone.', says: 'Quiet never freed anyone.', reply: 'Noise got him taken, envoy. Not today.' },
      { text: 'Come down with the canoes.', says: 'At the tide we take the harbor, and every launch on it. Come down with the canoes, and find him yourself.' },
    ],
    heard: '...Every launch?',
    anissa: 'Every one. The companies are going down together. You\'d be with them.',
    crown: 'The baker takes a small silver crown out of her cassava sack and pushes it into the coals under her griddle.',
    last: 'The paddlers will want casabe. I\'ll carry it down, and look in every boat.',
    leaves: 'She shoulders the sack and goes down the path to the beach.',
  },
  // Eightgate, the night before the bell: the old chair porter who wants one hand on the Throne and no more shouting.
  eightgate: {
    id: 'eightgate',
    speaker: 'cell_porter',
    role: 'The old chair porter',
    meet: [
      'Forty years I\'ve carried chairs into that Hall, envoy. Every Parley, every house, every quarrel.',
      'They shout, they go home, and the next year somebody\'s son is dead on a road. Mine was, at the Iron Gate.',
      'The quiet ones say: one hand on the Throne, and no more shouting. I\'d carry one chair gladly.',
    ],
    answers: [
      { text: 'The Hushed was the Regent\'s.', says: 'The one your cells called the Hushed was the Regent\'s almoner. The Crown disowns her now.', reply: 'Then the next one will be somebody else\'s. One hand is one hand.' },
      { text: 'I\'ll be a fair hand.', says: 'If I sit the Throne, I\'ll be a fair hand.', reply: 'Then you\'ll be one hand, envoy. Why ask me to stop wanting one?' },
      { text: 'Come and hear every house.', says: 'Tomorrow every house sits by its own oath, and Xaraguá asks for its harbor out loud. Carry the chairs, and stay.' },
    ],
    heard: 'Stay? I\'ve never once stayed. You carry them in, you go out, you shut the door.',
    anissa: 'Stay this time. Sit at the back. It\'s going to be loud, and it\'s going to be fair.',
    crown: 'The porter unpins a small silver crown from his coat and holds it out until Gianna takes it.',
    last: 'The Master of the Chairs will want them in before the bell. I\'d best go up.',
    leaves: 'He goes up the Hall\'s steps, toward the Master of the Chairs and his lantern.',
  },
};

/** Without the Key: one ordinary line (the person is just someone on the map). */
const PLAIN: Readonly<Record<Exclude<CellId, 'podlimye'>, string>> = {
  kirinoura: 'Mind the boards, envoy. The fog leaves the bridges slick until noon.',
  agnipur: 'The Court\'s steps were swept before the sun, envoy. They always are.',
  kingsmere: 'Morning, envoy. The rain\'s easing. Mind the Cross, the flags are greasy.',
  yucayeque: 'Casabe for the companies. Take one, envoy. It keeps.',
  eightgate: 'Chairs at dawn, envoy. Forty years I\'ve carried them, and they get heavier.',
};

/** The five new people's conversations (Pòdlimyè's hooded stranger is an overlay on her own: data/dialogue/zetwalMuster.ts). */
export const QUIET_CELL_DIALOGUE: readonly DialogueScript[] = (Object.keys(PLAIN) as Exclude<CellId, 'podlimye'>[]).map((id) => ({
  id: `${QUIET_CELLS[id].npc}_talk`,
  start: 'start',
  nodes: {
    start: { lines: [], next: [{ if: cellOpen(id), to: 'q_meet' }, { to: 'plain' }] },
    plain: { lines: [act([{ do: 'face', actor: `npc:${QUIET_CELLS[id].npc}`, facing: 'player' }], CELL_TALKS[id].speaker, PLAIN[id])] },
    ...cellNodes(CELL_TALKS[id]),
  },
}));
