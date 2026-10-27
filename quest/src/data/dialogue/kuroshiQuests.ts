// Chapter 7's two side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md K-1 and K-4, SECRET-ITEMS.md 8): Definitely Not a Spy (Yari makes Haru show how he followed them, at the
// puddle, the tea house screen and his mother's corridor) and The Letter in the Floor (the old floor-maker, Lady Sayo's
// House, the singing floor walked fifty years ago and now, the Nightingale Key). Both open at dawn, after the Paper Fox,
// and close when the trader sails.
//
// The owner's rules: shown, not told (Haru walks to each place and does it again; the informant walks the floor; the
// floor-maker lifts the latch); Anissa never jokes and is never touched; no Rael. Haru says "definitely not a spy" in
// K-1 at each place (the design's three times); Chapter 7's own scenes (data/dialogue/kuroshi.ts) still say it once.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { nailFlag } from '../../engine/secrets.ts';
import { FLOOR_MAKER, HALL, INFORMANT_WALK, NIGHTINGALE, PIER, QUARTER, SAYO_DOOR, SAYO_HOUSE } from '../kuroshi.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
const say = (speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, ...extra });
const nar = (text: string, extra: Extra = {}): DialogueLine => ({ speaker: '', text, ...extra });
const act = (stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine => ({ speaker, text, stage, ...extra });
const script = (id: string, nodes: Record<string, DialogueNode>): DialogueScript => ({ id, start: 'start', nodes });
const at = (x: number, y: number) => ({ x, y });
const f = (flag: string): Condition => ({ flag });

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const Z = 'azzy';
const S = 'samira';
const BY = 'bayarmaa';
const H = 'haru';
const P = 'patricio';
const SY = 'sayo';
const FM = 'floor_maker';
const IN = 'informant';

// ---- K-1 Definitely Not a Spy -------------------------------------------------------------------------------------

/** The three places Haru was seen (the story's sightings), each done again for Yari. */
export const SPY_PLACES = ['pier', 'screen', 'shoes'] as const;
const SPY_ALL: Condition = { all: SPY_PLACES.map((p) => f(`side.not_a_spy.${p}`)) };
/** The quest is offered at dawn, after the Fox, with Haru in the party, until the trader sails. */
export const SPY_OPEN = 'story.quarter_dawn, party.haru, !act7.complete';

/**
 * After the last of the three places (whichever it is): Yari is satisfied, and Haru walks up to Gianna and says why he let
 * himself be seen (the design's "a better opinion of Gianna").
 */
function spyEnd(x: number, y: number): DialogueNode {
  return {
    lines: [
      act([{ do: 'face', actor: 'yari', facing: 'player' }], Y, 'Three for three. Fine. You are not a spy.'),
      say(H, 'Thank you.'),
      say(Y, 'You are a very bad one.'),
      act([{ do: 'walk', actor: 'haru', to: at(x, y) }, { do: 'face', actor: 'haru', facing: 'player' }], H, 'Envoy. I watched you three times before I spoke to you. You looked at the people on the pier, not at the Crown\'s boat.'),
      say(H, 'That is why I came out from behind the screen. Write that down.', { set: { 'side.not_a_spy.done': true } }),
      say(G, 'It is already written.'),
    ],
  };
}

const SPY_DIALOGUE: DialogueScript[] = [
  // The offer, at the tea house screen (the object): Yari has not forgotten the pebble.
  script('teahouse_screen', {
    start: {
      lines: [],
      next: [
        { if: { all: [f('story.quarter_dawn'), f('party.haru'), { notFlag: 'act7.complete' }, { notFlag: 'side.not_a_spy.accepted' }] }, to: 'offer' },
        { if: f('party.haru'), to: 'haru' },
        { to: 'shut' },
      ],
    },
    shut: { lines: [nar('A tea house screen of white paper, shut. Somebody behind it is very carefully not breathing.')] },
    haru: { lines: [nar('The tea house screen.'), say(H, 'My second-best place. The best one I will not tell you.')] },
    offer: {
      lines: [
        act([{ do: 'walk', actor: 'yari', to: at(QUARTER.screen.x, QUARTER.screen.y + 1), facing: 'up' }, { do: 'face', actor: 'yari', facing: 'player' }], Y, 'This screen. You were behind it yesterday.'),
        act([{ do: 'face', actor: 'haru', facing: 'player' }], H, 'I was not behind it. I was beside it, in the gap.'),
        say(Y, 'You followed us up from the pier. A face in a puddle. This screen. Two shoes in your mother\'s corridor. Three times.'),
        say(Y, 'Show me how. All three places. Then I will believe you are not a spy.'),
        say(H, '...That is not how believing works.'),
        say(G, 'It is today.', { set: { 'side.not_a_spy.accepted': true } }),
        nar('(Definitely Not a Spy is in the Quests page of the menu.)'),
      ],
    },
  }),
  // The pier: Haru crouches by the lantern pile again; Yari looks in the puddle.
  script('spy_pier', {
    start: {
      lines: [
        act([{ do: 'walk', actor: 'haru', to: at(PIER.pile.x + 1, PIER.pile.y + 1), facing: 'left' }], H, 'Here. Behind the lanterns. The pile was perfect.'),
        act([{ do: 'walk', actor: 'yari', to: at(PIER.puddle.x, PIER.puddle.y + 1), facing: 'up' }, { do: 'look', actor: 'yari' }], Y, 'And the puddle shows your face over my shoulder.'),
        say(H, 'The puddle was the mistake. Nobody can hide from a puddle. I am definitely not a spy.'),
        say(Z, 'Fog.'),
        say(Y, 'Fog does not crouch.', { set: { 'side.not_a_spy.pier': true } }),
      ],
      next: [{ if: SPY_ALL, to: 'end' }],
    },
    end: spyEnd(PIER.puddle.x + 1, PIER.puddle.y + 1),
  }),
  // The tea house: Haru stands in the gap by the screen and opens it a hand's width; Yari has a pebble ready.
  script('spy_screen', {
    start: {
      lines: [
        act([{ do: 'walk', actor: 'haru', to: at(QUARTER.screen.x + 1, QUARTER.screen.y + 1), facing: 'left' }], H, 'In the gap, so. The screen open a hand\'s width. One eye.'),
        act([{ do: 'walk', actor: 'yari', to: at(QUARTER.screen.x - 2, QUARTER.screen.y + 1), facing: 'right' }], '', 'Yari picks up a pebble. Haru watches her pick it up.'),
        say(H, 'You threw it at exactly this height.'),
        say(Y, 'You stood at exactly this height.'),
        say(H, 'I am definitely not a spy. A spy would have moved.', { set: { 'side.not_a_spy.screen': true } }),
        say(BY, 'Say less.'),
      ],
      next: [{ if: SPY_ALL, to: 'end' }],
    },
    end: spyEnd(QUARTER.screen.x, QUARTER.screen.y + 2),
  }),
  // The Hall: the screen with the shoes under its hem.
  script('spy_shoes', {
    start: {
      lines: [
        act([{ do: 'walk', actor: 'haru', to: at(HALL.shoes.x - 1, HALL.shoes.y), facing: 'right' }], H, 'Behind this one. Mother\'s corridor is the safest place in Kirinoura to stand still.'),
        act([{ do: 'look', actor: 'samira' }], S, 'Your shoes showed under the hem. Good soles. Expensive.'),
        say(H, 'Mother buys them. She says a Suzumori should be heard coming. When I mean to be quiet I take them off.'),
        say(Y, '...Then why were they on yesterday?'),
        act([{ do: 'face', actor: 'haru', facing: 'player' }], H, 'Because I wanted to be found. By you, not by the Crown\'s man. I am definitely not a spy.', {
          set: { 'side.not_a_spy.shoes': true },
        }),
      ],
      next: [{ if: SPY_ALL, to: 'end' }],
    },
    end: spyEnd(HALL.shoes.x - 1, HALL.shoes.y + 1),
  }),
];

// ---- K-4 The Letter in the Floor (S-KUR, the Nightingale Key) ------------------------------------------------------

const SHAPE = ['(a silent board)', 'circle', 'square', 'triangle', 'diamond', 'star'] as const;
/** The message as the ripples draw it: "a triangle, a circle, ...". */
const TUNE = NIGHTINGALE.melody.map((p) => SHAPE[p]).join(', ').replace(/^./, (c) => c.toUpperCase());
const board = (b: { c: number; r: number }) => at(NIGHTINGALE.origin.x + b.c, NIGHTINGALE.origin.y + b.r);

/** The informant's walk across the floor (the memory): he comes in at the entry, stops on the silent board, goes on. */
function informantWalk(): StageCue[] {
  const cues: StageCue[] = [{ do: 'enter', actor: 'courier', look: 'echo_agent', from: at(SAYO_HOUSE.spawn.x, SAYO_HOUSE.spawn.y - 1), to: board(INFORMANT_WALK[0]!), facing: 'up' }];
  INFORMANT_WALK.slice(1).forEach((b, i) => {
    cues.push({ do: 'walk', actor: 'courier', to: board(b), facing: 'up' });
    if (NIGHTINGALE.melody[i + 1] === 0) cues.push({ do: 'wait', ms: 900 });
  });
  cues.push({ do: 'exit', actor: 'courier', to: at(SAYO_HOUSE.desk.x + 2, SAYO_HOUSE.desk.y + 1) });
  return cues;
}

const ROWS = ['The row by the box', 'The second row', 'The middle row', 'The fourth row', 'The row by the door'];
const COLS = ['The first board from the left', 'The second from the left', 'The middle board', 'The fourth from the left', 'The last on the right'];

/** The nail: a row, then a board in it (it can be pulled and set again). */
function nailNodes(): Record<string, DialogueNode> {
  const nodes: Record<string, DialogueNode> = {
    rows: {
      lines: [say(P, '(One nail. Which row?)')],
      choices: [...ROWS.map((text, r): DialogueChoice => ({ text, next: `row_${r}` })), { text: 'Not yet.' }],
    },
    nailed: {
      lines: [
        nar('Patricio sets the nail and drives it home with three blows. The board under it knocks, dull. It will never sing again.', { fx: 'shake' }),
        act([{ do: 'look', actor: 'npc:sayo_house' }], SY, 'Good. Wherever they lay that board, it will hold its tongue.'),
      ],
    },
  };
  ROWS.forEach((_, r) => {
    nodes[`row_${r}`] = {
      lines: [say(P, `(${ROWS[r]}. Which board?)`)],
      choices: COLS.map((text, c): DialogueChoice => ({ text, set: { [nailFlag(NIGHTINGALE.id)]: `${c},${r}`, [NIGHTINGALE.anchor]: true }, next: 'nailed' })),
    };
  });
  return nodes;
}

const FLOOR_DIALOGUE: DialogueScript[] = [
  // The old floor-maker on the quarter at dawn, by Sayo's door: the quest, and the latch lifted.
  script('floor_maker_talk', {
    start: {
      lines: [],
      next: [
        { if: f('side.letter_floor.done'), to: 'after' },
        { if: f('side.letter_floor.accepted'), to: 'remind' },
        { if: f('party.haru'), to: 'offer' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say(FM, 'Lady Sayo\'s house. Shut since before your mother was born, envoy.')] },
    offer: {
      lines: [
        say(FM, 'Envoy. That house was Lady Sayo\'s. My master laid her floors. I held his nails. I make keys now.'),
        act([{ do: 'face', actor: 'haru', facing: 'right' }], H, 'Grandmother\'s listening room. Every board sings. I was not allowed in it with shoes on.'),
        say(FM, 'Every board sings, young lord, so nobody crosses it unheard.'),
        say(FM, 'Her last message to your grandfather, envoy, is in a lacquer box at the far wall.'),
        say(FM, 'The box opens for one tune, walked on the boards. Nobody alive knows the tune.'),
        say(FM, 'And after the war they took the floor up and laid it again, every board in a new place.'),
        say(G, 'Then nobody can walk it.'),
        say(FM, 'She said whoever came for it would know how to listen to the past. She looked at me as if I were very slow.'),
        say(A, 'Gigi. The Locket.'),
        act([{ do: 'walk', actor: 'npc:floor_maker', to: at(SAYO_DOOR.x + 1, SAYO_DOOR.y), facing: 'left' }, { do: 'wait', ms: 600 }], '', 'He lifts the brass nightingale on the latch. The shutter slides.', {
          set: { 'side.letter_floor.accepted': true },
        }),
        nar('(The Letter in the Floor is in the Quests page of the menu.)'),
      ],
    },
    remind: { lines: [say(FM, 'Walk the tune and the box opens. Walk it wrong and the floor tells the whole street.')] },
    after: { lines: [say(FM, 'She knew somebody would listen. She was always right. It was very tiring.')] },
  }),
  simple('sayo_house_shut', [nar('Lady Sayo\'s House. Shut, its shutters pasted over with paper. A small brass nightingale hangs on the latch.')]),
  // In the listening room for the first time: the floor sings under Haru.
  simple('sayo_house_arrive', [
    nar('The listening room. A floor of pale boards, five by five, and beyond it a lacquer box on a low table.'),
    act([{ do: 'walk', actor: 'haru', to: board({ c: 2, r: 4 }), facing: 'up' }], '', 'Haru steps onto the nearest board. It sings: one clear note, like a bird woken.'),
    say(H, 'Every board has its own note. When I was small there was a star by the door. It is not there now.'),
    say(A, 'The floor remembers, Gigi. By the door, where it shimmers.'),
  ]),
  // Fifty years ago: Sayo at her desk, the informant walks the floor, the nail.
  script('sayo_house_echo', {
    start: { lines: [], next: [{ if: f('clue.sayo_tune'), to: 'again' }, { to: 'first' }] },
    again: { lines: [nar('Lady Sayo\'s house, fifty years ago. Lamplight on paper. Her man in grey waits by the door.')] },
    first: {
      lines: [
        nar('Lady Sayo\'s house, fifty years ago. Lamplight on paper walls. Sayo writes at her desk without looking up.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:sayo_house' }], SY, 'Marshal. Sit. Listen. Cross.'),
        act(informantWalk(), '', 'A man in grey crosses the floor board by board. On one board he stands still for a breath.', { fx: 'nightingale' }),
        nar(`The boards sang under him: ${TUNE}.`),
        say(SY, 'That is how my people tell me where the Crown walks: by the way they walk. A warning, in a tune.'),
        say(SY, 'When this war is over they will take my floors up and lay them again, to forget what crossed them. I will not stop them.'),
        say(SY, 'Nail me one board, Marshal. Wherever they lay it, a nailed board never sings again.'),
        say(SY, 'Then the tune can still be walked, by whoever comes.'),
        say(P, '(One nail, for the floor. Where the tune must rest when the boards are moved. He will cross again if I ask.)', { set: { 'clue.sayo_tune': true } }),
      ],
    },
  }),
  script('sayo_house_echo_return', {
    start: { lines: [], next: [{ if: f(NIGHTINGALE.anchor), to: 'nailed' }] },
    nailed: { lines: [act([{ do: 'look', actor: 'player' }], H, 'One board in the floor is dull now. It knocks instead of singing. Fifty years.')] },
  }),
  // The informant (the memory): crosses again, and the nail.
  script('sayo_informant_talk', {
    start: {
      lines: [say(IN, 'Again, Marshal?')],
      choices: [{ text: 'Cross again.', next: 'cross' }, { text: 'Nothing.' }],
    },
    cross: {
      lines: [act(informantWalk(), '', 'He crosses again, board by board, and waits on the silent one.', { fx: 'nightingale' }), nar(`${TUNE}.`)],
    },
  }),
  // The floor fifty years ago (the anchor object): Sayo's hammer and one nail.
  script('sayo_nail', {
    start: { lines: [], next: [{ if: f(NIGHTINGALE.anchor), to: 'again' }, { if: f('clue.sayo_tune'), to: 'rows' }, { to: 'wait' }] },
    wait: { lines: [nar('Pale boards, five by five. Each one sings when it is stepped on.')] },
    again: {
      lines: [nar('One board is nailed. It knocks instead of singing.')],
      choices: [
        { text: 'Pull the nail, and choose again.', set: { [NIGHTINGALE.anchor]: false, [nailFlag(NIGHTINGALE.id)]: '' }, next: 'pulled' },
        { text: 'Leave it.' },
      ],
    },
    pulled: { lines: [nar('Patricio works the nail out with the hammer\'s claw. The board sings again.')], next: 'rows' },
    ...nailNodes(),
  }),
  simple('sayo_floor_nailed', [nar('One board in the floor is dull: a nail through it, black with fifty years. It knocks instead of singing.')]),
  simple('sayo_desk_echo', [nar('Sayo\'s desk: brushes, a stone for ink, and a list of names nobody else may read.')]),
  script('sayo_house_talk', {
    start: { lines: [], next: [{ if: f(NIGHTINGALE.anchor), to: 'nailed' }, { to: 'listen' }] },
    listen: { lines: [say(SY, 'Listen first, Marshal. Then the nail. A man who nails before he listens nails the wrong board.')] },
    nailed: { lines: [say(SY, 'One board quiet. Good. Go home, Marshal. Somebody of yours will come back for it.')] },
  }),
  // The lacquer box (now): shut until the tune is walked; then the letter and the key.
  script('sayo_box', {
    start: { lines: [], next: [{ if: f('side.letter_floor.done'), to: 'empty' }, { if: f(NIGHTINGALE.open), to: 'open' }, { to: 'shut' }] },
    shut: {
      lines: [
        nar('A lacquer box on a low table, a nightingale painted on its lid. It is shut, and there is no keyhole.'),
        { if: f('party.haru'), speaker: H, text: 'It opens for the tune. Only the tune. Grandmother did not believe in keyholes.' },
      ],
    },
    open: {
      lines: [
        nar('The lid has lifted by a finger\'s width. Inside: a folded letter, and a brass key with a nightingale for its bow.'),
        act([{ do: 'walk', actor: 'haru', to: at(SAYO_HOUSE.box.x + 1, SAYO_HOUSE.box.y + 1), facing: 'up' }], H, 'Grandmother\'s hand.'),
        nar('"Marshal. If the floor let you in, you listened. My people told you every step the Crown took,'),
        nar('because you wrote their names down and kept them. Keep them still. The Crown buys what it cannot hear.'),
        nar('It cannot hear us. S."'),
        say(G, 'She wrote it to my grandfather. Fifty years ago. And she knew he would not be the one to read it.'),
        say(H, 'She nailed one board so that somebody could. She was always early.'),
        say(A, 'The key is listening, Gigi. It\'s very quiet.', { set: { 'item.nightingale_key': true, 'item.sayo_letter': true, 'side.letter_floor.done': true } }),
        say(H, 'Keep it, envoy. It listens better than I do. Almost.'),
      ],
    },
    empty: { lines: [nar('The lacquer box, empty. A nightingale painted on the lid.')] },
  }),
];

function simple(id: string, lines: DialogueLine[]): DialogueScript {
  return script(id, { start: { lines } });
}

export const KUROSHI_QUEST_DIALOGUE: readonly DialogueScript[] = [...SPY_DIALOGUE, ...FLOOR_DIALOGUE];
/** For the maps: where the old floor-maker stands, and the house's door on the quarter. */
export const FLOOR_PLACES = { floorMaker: FLOOR_MAKER, door: SAYO_DOOR } as const;
