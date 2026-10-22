// Chapter 7, The Fog Files (Kirinoura, Kuroshi; the second road): docs/quest/reviews/2026-10-21-chapter7-outline.md
// with its second review's fixes. The maps are tools/maps/kuroshi.ts; every tile in a stage direction comes from
// data/kuroshi.ts or is written next to the map it belongs to.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched by a foe, never a target
// and never jokes; Salkhi never speaks in a scene with Anissa's lines in it and never about her (tests/kuroshi.test.ts
// checks it); no jokes in Sayo's room, at the files or at the petition; the Crown's hand stays the Regent's (no line
// joins the Crown to the girl who glows, and nobody names the closed hand as the Quiet Crown's: that join is Chapter 9's).
// Kayla is exact and says what the files say and nothing else: never that Rael is good (the locked rule); she knows the
// girls are his daughters and says so once, without his name. Haru says "definitely not a spy" once.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { Condition } from '../../engine/conditions.ts';
import { parseConditionText } from '../../engine/conditions.ts';
import type { StageCue } from '../../engine/stage.ts';
import { rotorLookCondition } from '../../engine/rotor.ts';
import { CODE, FILEHOUSE, HALL, LIBRARY, MARSH, MARSH_CODE, MAZE, PIER, QUARTER, SCREENS, STACK_SHELVES, type Turn } from '../kuroshi.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

function act(stage: StageCue[], speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, stage, ...extra };
}

function script(id: string, nodes: Record<string, DialogueNode>, start = 'start'): DialogueScript {
  return { id, start, nodes };
}

function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return script(id, { start: { lines, set } });
}

function at(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

function cond(text: string): Condition {
  const parsed = parseConditionText(text);
  if (!parsed.ok || !parsed.cond) throw new Error(`bad condition ${text}`);
  return parsed.cond;
}

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const Z = 'azzy';
const S = 'samira';
const P = 'patricio';
const BY = 'bayarmaa';
const H = 'haru';
const K = 'kayla';
const KD = 'kaede';
const SK = 'salkhi';
const SM = 'signal_master';
const RN = 'retainer_neutral';
const RW = 'retainer_war';
const CO = 'crown_observer';
const BR = 'broker';
const FX = 'paper_fox';
const SY = 'sayo';
const GG = 'gate_guard_kq';
const OF = 'kq_old_fisher';

const COLOUR: Readonly<Record<'white' | 'red', string>> = { white: 'white', red: 'red' };
const pattern = (t: Turn) => CODE[t].map((c) => COLOUR[c]).join(', ');
const WAY: Readonly<Record<Turn, string>> = { left: 'left', straight: 'straight on', right: 'right' };

/** What the gate guard still waits for before the lantern hour, worded from the flags. */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.spy_ledger.done' }, speaker: GG, text: 'The clerk in the library is still waiting.' },
  { if: { notFlag: 'debate.kuroshi_silence.settled' }, speaker: GG, text: 'The keepers are still at it on the middle bridge.' },
];

/** The press at the fishers' huts (K-3's last step), the fifth grey thumbprint. */
const PRESS: DialogueLine[] = [
  act(
    [{ do: 'look', actor: 'npc:kq_old_fisher' }, { do: 'walk', actor: 'npc:kq_old_fisher', to: at(MARSH.press.x - 1, MARSH.press.y + 1), facing: 'up' }],
    OF,
    'Come and see what we do with the nights.',
  ),
  nar('Under a tarpaulin: a lacquer box of type, and a wet proof sheet laid out to dry.'),
  nar('On the ink, in the corner, a grey thumbprint. Ash.'),
  say(OF, 'Somebody pays for the paper. We never asked. The sheets say what the Hall will not.'),
  act([{ do: 'walk', actor: 'haru', to: at(MARSH.press.x, MARSH.press.y + 1), facing: 'up' }], H, 'This is tonight\'s council. Word for word.'),
  say(H, 'Somebody in the Hall is feeding them too.'),
  say(Y, 'Yucayeque\'s oil. Cenizal\'s bread. Bab al-Dhahab\'s water. Ordvik\'s grain. Now Kirinoura\'s paper.', {
    set: { 'side.lanterns.done': true, 'side.lanterns.accepted': true },
  }),
  say(Y, 'The same hand.'),
];

/** The Paper Fox, after the fight (beat 7): the box, the receipts, his end (both remembered), the seal cut at dawn. */
function foxAfterNodes(): Record<string, DialogueNode> {
  return {
    yield: {
      lines: [
        act(
          [{ do: 'place', actor: 'fox', look: 'paper_fox', at: at(FILEHOUSE.stone.x, FILEHOUSE.stone.y + 1), facing: 'down' }, { do: 'look', actor: 'fox' }],
          '',
          'The mask is off. The Fox kneels among torn paper; the others were only paper, and lie on the floor.',
        ),
        act([{ do: 'walk', actor: 'haru', to: at(FILEHOUSE.stone.x + 1, FILEHOUSE.stone.y), facing: 'left' }], H, 'The box.'),
        nar('In the lacquer box: two files. The Buyer\'s Mark, and The Ledger of Outflows.', { set: { 'item.fog_files': true } }),
        nar('And under them, his receipts: copies sold to "the Throne\'s observer", each countersigned in violet.', { set: { 'clue.fox_receipts': true } }),
        say(G, 'Eleven years of them. The proof Lady Kaede asked for.'),
      ],
      choices: [
        { text: 'Bring him to the dais.', set: { 'choice.fox_spared': true }, next: 'spared' },
        { text: 'Give him to the retainers.', set: { 'choice.fox_broken': true }, next: 'broken' },
      ],
    },
    spared: {
      lines: [say(G, 'Bring him to the dais. Let the council hear him name his customer.'), say(FX, 'I never knew the name. I knew the mark.'), say(FX, 'I was paid to know less than I do.')],
      next: 'out',
    },
    broken: {
      lines: [
        say(BY, 'Give him to the retainers. Let the city see a broker walked through the fog with no mask.'),
        say(FX, 'I never knew the name. I knew the mark.'),
        say(FX, 'I was paid to know less than I do.'),
      ],
      next: 'out',
    },
    out: {
      lines: [
        act(
          [{ do: 'walk', actor: 'haru', to: at(FILEHOUSE.front.x, FILEHOUSE.front.y - 1), facing: 'down' }, { do: 'wait', ms: 600 }],
          '',
          'Haru cuts the paper seal on the front door from the inside. Beyond it, the keeper of files steps aside and says nothing.',
        ),
        say(H, 'Dawn soon. Kayla will be at her desk. She reads what nobody else can.', {
          fx: 'fade',
          set: { 'story.fox_beaten': true, 'story.quarter_dawn': true },
        }),
      ],
    },
  };
}

/** Sayo's war room (beat 6; the chapter's Echo scene), from the map wall's zone. Restartable until its clue is set. */
function sayoNodes(): Record<string, DialogueNode> {
  const agent = (id: string, slip: string, pin: string): DialogueLine[] => [
    act(
      [
        { do: 'enter', actor: id, look: 'echo_agent', from: at(FILEHOUSE.front.x, FILEHOUSE.front.y - 1), to: at(FILEHOUSE.sayo.x + 1, FILEHOUSE.sayo.y + 2), facing: 'left' },
        { do: 'look', actor: id },
      ],
      'sayo_agent',
      slip,
    ),
    act([{ do: 'exit', actor: id, to: at(FILEHOUSE.front.x, FILEHOUSE.front.y - 1) }, { do: 'look', actor: 'npc:sayo' }], '', pin),
  ];
  return {
    war: {
      lines: [
        nar('Fifty years ago, the file house is a war room. The wall map hangs whole, pinned with paper slips.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:sayo' }, { do: 'face', actor: 'npc:sayo', facing: 'player' }], SY, 'Zetwal\'s Marshal. Stand by the map, and do not touch the screens. They turn.'),
        ...agent('agent_a', 'Crown marines, two companies, to the harbour chain by the new moon.', 'Sayo pins the slip to the harbour on the map.'),
        ...agent('agent_b', 'The Crown\'s supply ships lie at Kingsmere until the wind.', 'A pin at Kingsmere.'),
        ...agent('agent_c', 'The Brasador march goes by the ash road, not the coast.', 'A pin on the ash road. Sayo looks at it a long time.'),
        nar('Caona took the ash road slip south herself. Benny is on that road.'),
      ],
      choices: [
        { text: 'How many die for these slips?', set: { 'choice.patricio_sayo': 'cost' }, next: 'cost' },
        { text: 'Can Zetwal pay for this?', set: { 'choice.patricio_sayo': 'pay' }, next: 'pay' },
      ],
    },
    cost: {
      lines: [say(SY, 'Four this year. They are not written down anywhere but here.'), say(SY, 'That is my price. When you win, write them down.')],
      next: 'peg',
    },
    pay: { lines: [say(SY, 'You cannot. Nobody can. That is why it works.')], next: 'peg' },
    peg: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:sayo', to: at(FILEHOUSE.screens[4]!.x - 1, FILEHOUSE.screens[4]!.y), facing: 'right' }, { do: 'look', actor: 'npc:sayo' }],
          SY,
          'That one. The peg is loose. Fix it, or the whole house turns on it.',
          { set: { 'clue.sayo_network': true } },
        ),
        say(P, '(The screen in the middle of the room. Its peg rattles in its socket.)'),
      ],
    },
  };
}

/** A pivoting screen in the file house: its facing, and a push (engine/rotor.ts turns it and its neighbours). */
function screenScript(i: number): DialogueScript {
  const dirs = ['north', 'east', 'south', 'west'];
  if (i === SCREENS.peg!.index) {
    return script(`screen_push_${i}`, {
      start: { lines: [], next: [{ if: { flag: SCREENS.solved }, to: 'open' }, { if: { flag: 'anchor.screen_peg' }, to: 'held' }, { to: 'loose' }] },
      open: { lines: [nar('The screens stand open, every one facing north.')] },
      held: { lines: [nar('The middle screen, pegged fast. It holds north and turns nothing now.')] },
      loose: {
        lines: [nar('The middle screen. Its peg rattles; it swings back east on its own after every push.')],
        choices: [{ text: 'Push the screen.', set: { 'rotor.push': `${SCREENS.id}:${i}` } }, { text: 'Leave it.' }],
      },
    });
  }
  return script(`screen_push_${i}`, {
    start: { lines: [], next: [{ if: { flag: SCREENS.solved }, to: 'open' }, { to: 'turn' }] },
    open: { lines: [nar('The screens stand open, every one facing north.')] },
    turn: {
      lines: dirs.map((d, k) => ({ if: cond(rotorLookCondition(SCREENS, i, k)), speaker: '', text: `A paper screen on a pivot, facing ${d}. Pushing it turns its neighbours too.` })),
      choices: [{ text: 'Push the screen.', set: { 'rotor.push': `${SCREENS.id}:${i}` } }, { text: 'Leave it.' }],
    },
  });
}

/** A marsh post (M-KUR-2): each turn of its lantern goes white, red, dark. The check, when all six are lit. */
function marshPostScript(n: number): DialogueScript {
  const white = `marsh.p${n}_white`;
  const red = `marsh.p${n}_red`;
  const all = MARSH_CODE.map((c, i) => ({ flag: `marsh.p${i + 1}_${c}` }));
  const lit = MARSH_CODE.map((_, i) => ({ any: [{ flag: `marsh.p${i + 1}_white` }, { flag: `marsh.p${i + 1}_red` }] }));
  const where = n <= 3 ? `The fork's ${['first', 'second', 'third'][n - 1]} post` : `The bend's ${['first', 'second', 'third'][n - 4]} post`;
  return script(`marsh_post_${n}`, {
    start: { lines: [], next: [{ if: { flag: 'story.boats_home' }, to: 'home' }, { to: 'post' }] },
    home: { lines: [nar('The marsh posts burn: left, then right. The boats are home.')] },
    post: {
      lines: [
        { if: { all: [{ notFlag: white }, { notFlag: red }] }, speaker: '', text: `${where}: its lantern is dark.` },
        { if: { flag: white }, speaker: '', text: `${where}: its lantern burns white.` },
        { if: { flag: red }, speaker: '', text: `${where}: its lantern burns red.` },
      ],
      choices: [
        { if: { all: [{ notFlag: white }, { notFlag: red }] }, text: 'Turn the lantern: white.', set: { [white]: true, [red]: false }, next: 'check' },
        { if: { flag: white }, text: 'Turn the lantern: red.', set: { [white]: false, [red]: true }, next: 'check' },
        { if: { flag: red }, text: 'Turn the lantern: dark.', set: { [white]: false, [red]: false }, next: 'check' },
        { text: 'Leave it.' },
      ],
    },
    check: {
      lines: [],
      next: [
        { if: { notFlag: 'encounter.kuroshi_story.moths.won' }, to: 'moths' },
        { if: { all }, to: 'boats' },
        { if: { all: lit }, to: 'wrong' },
        { to: 'lit' },
      ],
    },
    lit: { lines: [nar('The lantern burns on the post. Out in the fog, nothing answers yet.')] },
    wrong: {
      lines: [nar('Out in the fog a boat\'s light comes toward the fork, wavers, and turns away.'), say(OF, 'Left, then right. Left, then right.')],
    },
    moths: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'moth_a', look: 'lantern_moth', from: at(MARSH.posts[1]!.x, MARSH.posts[1]!.y - 2), to: at(MARSH.posts[1]!.x, MARSH.posts[1]!.y + 1), async: true },
            { do: 'enter', actor: 'moth_b', look: 'lantern_moth', from: at(MARSH.posts[0]!.x - 2, MARSH.posts[0]!.y), to: at(MARSH.posts[0]!.x, MARSH.posts[0]!.y + 1), async: true },
            { do: 'enter', actor: 'moth_c', look: 'lantern_moth', from: at(MARSH.posts[2]!.x + 3, MARSH.posts[2]!.y), to: at(MARSH.posts[2]!.x, MARSH.posts[2]!.y + 1) },
            { do: 'look', actor: 'moth_a' },
          ],
          '',
          'Pale wings come out of the fog at the light: lantern moths, a swarm of them, all at once.',
          { fx: 'shake' },
        ),
        say(H, 'They come to any light. Four of them. More if we wait.', { set: { 'battle.next': 'marsh_moths', 'battle.after': 'moths_after' } }),
      ],
    },
    boats: {
      lines: [
        nar('Out in the fog, a light answers. Then another.'),
        act([{ do: 'wait', ms: 700 }, { do: 'sync' }, { do: 'look', actor: 'player' }], '', 'Two fishing boats are poled in out of the fog, to the huts\' landing.', {
          set: { 'story.boats_home': true },
        }),
        act(
          [
            { do: 'enter', actor: 'boat_crew_a', look: 'kq_fisher_woman', from: at(MARSH.boats[0]!.x, MARSH.boats[0]!.y), to: at(MARSH.boats[0]!.x, MARSH.boats[0]!.y - 1), async: true },
            { do: 'enter', actor: 'boat_crew_b', look: 'kq_old_fisher', from: at(MARSH.boats[1]!.x, MARSH.boats[1]!.y), to: at(MARSH.boats[1]!.x, MARSH.boats[1]!.y - 1) },
          ],
          '',
          'The fishers step up onto the yard, stiff and soaked, and stand there a moment looking at the posts.',
        ),
        say(OF, 'Left, then right. They came home.'),
        act([{ do: 'look', actor: 'haru' }], H, 'And the lit posts show the second causeway, east, to the signal tower.', { set: { 'story.causeway_lit': true } }),
        say(H, 'Grandmother\'s back door. Under the tower.'),
        act([{ do: 'exit', actor: 'boat_crew_a', to: at(15, 12) }, { do: 'exit', actor: 'boat_crew_b', to: at(17, 12) }], '', 'The fishers go into the huts to get warm.'),
      ],
    },
  });
}

/** Kayla, bumped into (K-2's start; FAMILY.md): Azzy stops dead in the aisle. From the aisle, or by talking to her. */
const KAYLA_MEET: DialogueLine[] = [
  act(
    [{ do: 'look', actor: 'npc:kayla' }, { do: 'wait', ms: 400 }],
    '',
    'At the back desk, a woman in a clerk\'s grey, ink on one cuff, folds a paper crane while a reader talks at her.',
  ),
  nar('She does not look up.'),
  act([{ do: 'walk', actor: 'azzy', to: at(LIBRARY.desk.x, LIBRARY.zone.y + 1), facing: 'up' }, { do: 'wait', ms: 700 }], '', 'Azzy stops dead in the aisle.'),
  act([{ do: 'walk', actor: 'azzy', to: at(LIBRARY.desk.x, LIBRARY.desk.y + 1), facing: 'up' }], Z, 'Titi Kayla.'),
  nar('She finishes the fold, puts the crane down, and looks up.'),
  say(K, 'Azriel. You have grown into his shoulders. I am sorry about that.'),
  act(
    [{ do: 'walk', actor: 'npc:kayla', to: at(LIBRARY.desk.x - 1, LIBRARY.desk.y + 1), facing: 'right' }, { do: 'wait', ms: 600 }],
    '',
    'She comes round the desk and puts a hand on his cheek, once.',
  ),
  act([{ do: 'face', actor: 'npc:kayla', facing: 'player' }], K, 'You are Elodie\'s. Azriel wrote me from the road: three lines, which for him is a book.'),
  say(K, 'You have the Locket. Then you have been to Cenizal, and you know whose daughters you are.'),
  say(K, 'And I will not talk about him in a library. Everything here is written down.', { set: { 'story.kayla_met': true } }),
];

export const KUROSHI_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0: into the mist (the pier) ------------------------------------------------------------------------
  simple('pier_arrive', [
    nar('Out of the mist, a pier of black lacquer piles. Paper lanterns burn all along it at noon, because of the fog.', { fx: 'fade' }),
    say(A, 'Gigi, I can\'t see the water.'),
    say(G, 'Hold my sleeve.'),
    act([{ do: 'look', actor: 'follower' }, { do: 'walk', actor: 'follower', to: at(PIER.spawn.x - 1, PIER.spawn.y), facing: 'up' }], '', 'Anissa takes hold of Gianna\'s sleeve, and does not let go.'),
    act(
      [{ do: 'look', actor: 'player' }, { do: 'wait', ms: 400 }],
      '',
      'Tied up beside the longship: a launch with an Aldermoor violet pennant. The Crown is already here.',
    ),
    say(BY, 'Fog people. Say less.'),
    say(Y, 'A stair at the top of the pier. That will be the quarter.'),
  ]),
  simple('pier_sighting', [
    act([{ do: 'look', actor: 'player' }], '', 'A puddle between the planks. Two faces in it: Gianna\'s, and one over her shoulder.'),
    act(
      [
        { do: 'place', actor: 'grey_figure', look: 'haru', at: at(PIER.pile.x + 1, PIER.pile.y + 1), facing: 'left' },
        { do: 'face', actor: 'player', facing: 'right' },
        { do: 'look', actor: 'grey_figure' },
        { do: 'exit', actor: 'grey_figure', to: at(PIER.pile.x + 1, PIER.pile.y), run: true },
      ],
      '',
      'Gianna turns. A figure in grey steps behind the lantern pile, fast, and is not there.',
    ),
    say(Y, 'There. No. Gone.'),
    say(Z, 'Fog.'),
    say(Y, 'Fog does not wear shoes.', { set: { 'story.haru_seen_1': true } }),
  ]),
  simple('pier_puddle', [nar('A puddle between the planks. In it: the lanterns, the fog, and you.')]),
  simple('crown_launch', [
    { if: { notFlag: 'story.fox_beaten' }, speaker: '', text: 'A launch with an Aldermoor violet pennant. Its crew is ashore. A rack in the stern for lacquer file-boxes, empty.' },
    { if: { flag: 'story.fox_beaten' }, speaker: '', text: 'The launch is gone. A violet thread is caught on the mooring post.' },
  ]),
  simple('pier_longship', [nar('The Ironvow longship that brought you, oars shipped. The crew are playing dice and watching Bayarmaa.')]),
  simple('pier_tea', [nar('A tea stall under the stair. The kettle never stops, and neither does the old woman behind it.')]),
  script('harbour_master_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.fox_beaten' }, to: 'after' }, { to: 'before' }] },
    before: {
      lines: [
        say('harbour_master', 'Konnichiwa, envoy. The Crown\'s launch? It came yesterday.', { translation: 'Good day' }),
        say('harbour_master', 'Its man went up to the Hall. They always go up to the Hall. Then they come down with a box.'),
      ],
    },
    after: { lines: [say('harbour_master', 'The Crown\'s man sailed before the lamps went out, envoy. He left his tea.')] },
  }),
  // Salkhi (a grey mare placed on the outdoor maps; never in a scene with Anissa's lines in it).
  script('salkhi_pier_talk', {
    start: { lines: [], next: [{ if: { flag: 'ally.kuroshi' }, to: 'end' }, { to: 'soup' }] },
    soup: { lines: [say(SK, 'I was told there would be grass. This is soup.')] },
    end: { lines: [say(SK, 'Another boat. At least it is not soup.')] },
  }),
  script('salkhi_quarter_talk', {
    start: { lines: [], next: [{ if: { flag: 'side.spy_ledger.accepted' }, to: 'reads' }, { to: 'soup' }] },
    soup: { lines: [say(SK, 'Soup with bridges in it. Nobody here has a field. I have looked.')] },
    reads: { lines: [say(SK, 'The clerk in the library reads. I have seen her. Nobody asked me what I thought of it.')] },
  }),
  simple('salkhi_marsh_talk', [say(SK, 'I will not go into the reeds. The reeds go into me.')]),

  // ---- Beat 1: the Lantern Quarter (the observer, the second sighting, the letter) ----------------------------------
  simple('quarter_arrive', [
    nar('The Lantern Quarter: canals and humped bridges, tea houses with their screens half open, lanterns lit in the fog.', { fx: 'fade' }),
    act(
      [
        { do: 'look', actor: 'observer' },
        { do: 'enter', actor: 'observer', look: 'crown_observer', from: QUARTER.observerFrom, to: at(QUARTER.hallGate.x + 1, QUARTER.gateRow), facing: 'left', async: true },
        { do: 'enter', actor: 'clerk', look: 'observer_clerk', from: at(QUARTER.observerFrom.x + 1, QUARTER.observerFrom.y), to: at(QUARTER.hallGate.x + 2, QUARTER.gateRow), facing: 'left' },
      ],
      '',
      'Across the canals, a man in Aldermoor violet walks toward the main bridge. A clerk follows with a lacquer file-box.',
    ),
    act(
      [
        { do: 'walk', actor: 'observer', to: at(QUARTER.hallGate.x + 1, 2), facing: 'up', async: true },
        { do: 'walk', actor: 'clerk', to: at(QUARTER.hallGate.x + 1, 3), facing: 'up' },
        { do: 'face', actor: 'npc:gate_guard_kq', facing: 'left' },
      ],
      '',
      'At the Hall\'s gate the guard bows to him. Nobody asks his name.',
    ),
    act(
      [
        { do: 'exit', actor: 'observer', to: at(QUARTER.hallGate.x + 1, 0), async: true },
        { do: 'exit', actor: 'clerk', to: at(QUARTER.hallGate.x, 0) },
        { do: 'look', actor: 'player' },
      ],
      '',
      'They go in without a word.',
    ),
    say(S, 'Crown violet, a file-box, and no waiting. I intend to price everything this city does not say.'),
    say(G, 'Torvald\'s letter is for Lady Kaede. Her Hall is across the main bridge.'),
  ]),
  simple('screen_slides', [
    act(
      [
        { do: 'place', actor: 'grey_figure', look: 'haru', at: at(QUARTER.screen.x, QUARTER.screen.y), facing: 'down' },
        { do: 'look', actor: 'grey_figure' },
      ],
      '',
      'A paper screen on the tea house slides open a hand\'s width. An eye. A sleeve of grey.',
    ),
    act([{ do: 'walk', actor: 'yari', to: at(QUARTER.screen.x, QUARTER.screen.y + 1), facing: 'up' }], '', 'Yari throws a pebble at it.'),
    act([{ do: 'exit', actor: 'grey_figure', to: at(QUARTER.screen.x - 1, QUARTER.screen.y), run: true }, { do: 'look', actor: 'player' }], '', 'The screen slides shut.'),
    say(BY, 'Say less.'),
    say(Y, 'I said nothing. I threw something.', { set: { 'story.haru_seen_2': true } }),
  ]),
  simple('hall_gate', [
    act(
      [
        { do: 'look', actor: 'npc:gate_guard_kq' },
        { do: 'walk', actor: 'npc:gate_guard_kq', to: at(QUARTER.hallGate.x + 1, 3), facing: 'down' },
      ],
      GG,
      'Envoys wait to be announced.',
    ),
    say(S, 'The man in violet did not wait.'),
    say(GG, 'He is not an envoy. He is a customer.'),
    act(
      [
        { do: 'enter', actor: 'signal', look: 'signal_master', from: at(QUARTER.hallGate.x, 1), to: at(QUARTER.hallGate.x, 4), facing: 'down' },
        { do: 'look', actor: 'signal' },
      ],
      SM,
      'Zetwal\'s envoy. You carry a letter from Ordvik.',
    ),
    act([{ do: 'walk', actor: 'signal', to: at(QUARTER.hallGate.x, 5), facing: 'down' }], '', 'Gianna gives him Torvald\'s horn-case. He does not open it.', {
      set: { 'item.torvald_letter': false, 'story.letter_given': true },
    }),
    say(SM, 'Lady Kaede will hear it at the lantern hour. Until then the library is yours. The Hall is not.'),
    say(SM, 'The library\'s clerk has been expecting an envoy who reads. The stacks at the back are sealed; she will tell you why.'),
    say(SM, 'And the keepers are arguing on the middle bridge again, about silence. They always are.'),
    act([{ do: 'exit', actor: 'signal', to: at(QUARTER.hallGate.x, 1) }, { do: 'look', actor: 'player' }], '', 'He goes back in with the letter.'),
    say(A, 'Your Quests page, Gigi.'),
  ]),
  script('hall_gate_wait', {
    start: { lines: [], next: [{ if: { flag: 'story.letter_given' }, to: 'day' }, { to: 'announce' }] },
    announce: { lines: [say(GG, 'Envoys wait to be announced. The signal master will come down.')] },
    day: { lines: [say(GG, 'The lantern hour, envoy. Not before.'), ...LEFT, say(A, 'Your Quests page, Gigi.')] },
  }),
  simple('lantern_call', [
    nar('Dusk. The fog goes blue, and the canals go black.', { fx: 'fade' }),
    act(
      [
        { do: 'enter', actor: 'lighter_a', look: 'lantern_lighter', from: at(1, 6), to: at(12, 6), facing: 'right', async: true },
        { do: 'enter', actor: 'lighter_b', look: 'lantern_lighter', from: at(40, 6), to: at(30, 6), facing: 'left' },
        { do: 'look', actor: 'lighter_a' },
      ],
      '',
      'Lantern-lighters walk the bridges with long poles, lighting the posts one by one.',
    ),
    act([{ do: 'exit', actor: 'lighter_a', to: at(1, 13), async: true }, { do: 'exit', actor: 'lighter_b', to: at(40, 13) }, { do: 'look', actor: 'npc:gate_guard_kq' }], GG, 'The lantern hour. The envoy is called.', {
      set: { 'story.lantern_called': true },
    }),
  ]),
  simple('maze_gate_shut', [nar('Beyond the torii the lanes are the fog\'s. Nobody walks them without a reason, or a Suzumori.')]),
  simple('marsh_gate_shut', [nar('A rope across the marsh road, and a paper tag on it: closed while the fog holds, by order of the Hall.')]),
  simple('marsh_road_shut', [nar('The marsh road home is roped off from this side too. The Hall\'s fog order, on a paper tag.')]),
  script('gate_guard_kq_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.haru_met' }, to: 'night' }, { if: { flag: 'story.letter_given' }, to: 'day' }, { to: 'before' }] },
    before: { lines: [say(GG, 'Envoys wait to be announced.')] },
    day: { lines: [say(GG, 'The lantern hour, envoy.'), ...LEFT] },
    night: { lines: [say(GG, 'Lady Kaede\'s son went out by the torii. I did not see him. I never do.')] },
  }),
  simple('kq_board', [
    nar('The contract board: "Deliver sealed letters, unread." "Copy a file, bring your own brush." "Lost: a cat, in the fog."'),
    nar('Under the last, in fresh chalk: "The horse has seen it. The horse will not say."'),
  ]),
  script('teahouse_screen', {
    start: { lines: [], next: [{ if: { flag: 'party.haru' }, to: 'haru' }, { to: 'shut' }] },
    shut: { lines: [nar('A tea house screen of white paper, shut. Somebody behind it is very carefully not breathing.')] },
    haru: { lines: [nar('The tea house screen.'), say(H, 'My second-best place. The best one I will not tell you.')] },
  }),
  simple('sayo_house_door', [nar('Lady Sayo\'s House. Shut, its shutters pasted over with paper. A small brass nightingale hangs on the latch.')]),
  script('kq_fisher_woman_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.boats_home' }, to: 'home' },
        { if: { flag: 'side.lanterns.accepted' }, to: 'waiting' },
        { to: 'ask' },
      ],
    },
    ask: {
      lines: [
        say('kq_fisher_woman', 'Our boats went out before the fog came. They steer home by the marsh posts, and the posts are dark.'),
        say('kq_fisher_woman', 'Nobody will light them. The Hall says the code is a Suzumori secret.'),
      ],
      choices: [
        { text: 'We will light them.', set: { 'side.lanterns.accepted': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: { lines: [say('kq_fisher_woman', 'Then you need the code, and the way. The marsh road is shut. The old way is through the fog.')] },
    waiting: { lines: [say('kq_fisher_woman', 'The posts are by the huts, past the fog. My husband is out there.')] },
    home: { lines: [say('kq_fisher_woman', 'He\'s home. They are all home.')] },
  }),
  script('kq_fisher_boy_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.boats_home' }, to: 'home' }, { to: 'dark' }] },
    dark: { lines: [say('kq_fisher_boy', 'Left, then right! Grandad says it every night. My lantern has nothing to light it for.')] },
    home: { lines: [say('kq_fisher_boy', 'You lit them! Left, then right. I knew it.')] },
  }),
  simple('kq_tea_talk', [say('kq_tea', 'Irasshaimase! Rice balls, green tea, miso.', { translation: 'Welcome!' })]),
  simple('kq_paper_talk', [say('kq_paper', 'Irasshaimase. Paper, silk, and quiet.', { translation: 'Welcome.' })]),
  simple('kq_armourer_talk', [say('kq_armourer', 'Irasshaimase. Lacquer and steel, envoy.', { translation: 'Welcome.' })]),

  // ---- The Lantern Library: Kayla, K-2, the files read (beat 8) --------------------------------------------------
  simple('kayla_meet', KAYLA_MEET),
  script('kayla_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'clue.buyers_mark' }, to: 'after' },
        { if: { flag: 'story.fox_beaten' }, to: 'files' },
        { if: { flag: 'side.spy_ledger.done' }, to: 'done' },
        { if: { flag: 'item.spy_ledger' }, to: 'return' },
        { if: { flag: 'side.spy_ledger.accepted' }, to: 'rule' },
        { if: { flag: 'story.kayla_met' }, to: 'ask' },
        { if: { flag: 'story.letter_given' }, to: 'meet' },
        { to: 'folding' },
      ],
    },
    folding: { lines: [nar('The clerk is folding a paper crane. She does not look up.')] },
    meet: { lines: KAYLA_MEET, next: 'ask' },
    ask: {
      lines: [
        say(K, 'There are four accounts of the Ash Wars, and three of them lie. Ours is in the sealed stacks behind this wall.'),
        say(K, 'It is shelved by a cipher I keep, and the stacks are sealed by an order I did not write. I cannot open the door.'),
        say(K, 'The stacks are shelved by years, oldest at the top. And the Echo at my desk is older than the door.'),
      ],
      choices: [
        { text: 'We will find the ledger.', set: { 'side.spy_ledger.accepted': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: {
      lines: [
        say(K, 'There is a window over the reading tables. I did not say that.'),
        say(K, 'Somebody else is in the stacks this week, taking boxes out. I did not say that either.'),
      ],
    },
    rule: {
      lines: [
        { if: { notFlag: 'clue.shelf_mark' }, speaker: K, text: 'The rule is older than the door. Ask the desk, not me.' },
        { if: { flag: 'clue.shelf_mark' }, speaker: K, text: 'You have the rule, then. Rows by years. The Ash Wars came last.' },
      ],
    },
    return: {
      lines: [
        act([{ do: 'look', actor: 'npc:kayla' }], '', 'Gianna puts the grey ledger on Kayla\'s desk. Kayla stamps it, once.'),
        say(K, 'Now it has been read. That is what the stacks were for.', { set: { 'item.spy_ledger': false, 'side.spy_ledger.done': true } }),
        say(K, 'It goes back on the open shelf, where anyone can read it. The order says nothing about the open shelf.'),
        nar('She writes on a paper card in her small hand, and gives it to Gianna: Lady Sayo\'s house glyphs.', { set: { 'item.kayla_glyphs': true } }),
        say(K, 'You will need these where you are going. I did not say where.'),
      ],
    },
    done: {
      lines: [
        say(K, 'The lantern hour comes at dusk. Lady Kaede will see you then.'),
        say(K, 'My sister builds things that burn, in Agnipur. I file things that do not.'),
      ],
    },
    files: {
      lines: [
        nar('Dawn. Kayla is at her desk as if she never left it. Gianna puts the lacquer box down in front of her.'),
        act([{ do: 'walk', actor: 'follower', to: at(LIBRARY.desk.x + 2, LIBRARY.desk.y + 1), facing: 'up' }], K, 'Two files. I will read them as they are written, not as you would like them.'),
        nar('The first is a Crown buying-list, in Throne sols. Four lines, four prices.'),
        nar('Every name has been cut out of the paper with a knife. Beside one of the prices, a stamped mark: a closed hand.'),
        say(K, 'Four lines, four prices. The names were cut before it reached the Fox. Somebody knew the list would be sold.'),
        say(K, 'A closed hand. It is not a Crown seal, and it is not a house\'s.', { set: { 'clue.buyers_mark': true } }),
        say(G, 'So the Crown is buying one of the houses.'),
        say(K, 'Has bought, or will. The list does not say which. I do not guess.'),
        nar('The second file: gold out of Ardencia\'s treasury, large sums, every season for twenty years, to places in a cipher.'),
        say(K, 'Ardencia\'s counting-house hand. Kirinoura has copied enough of it to know it.'),
        say(K, 'The key is not one this city has ever held. I cannot tell you where the gold went.', { set: { 'clue.ardencia_outflows': true } }),
        say(G, 'That he sold us.'),
        say(K, 'I did not say that. I said I do not know.'),
        say(K, 'He writes to me twice a year. He never says anything. That is how I know he is still himself.'),
        act([{ do: 'look', actor: 'follower' }], '', 'Without looking, Kayla pushes a finished paper crane across the desk to Anissa.'),
        say(K, 'I fold when I listen. It keeps my hands from writing things down. You can have that one.', { set: { 'item.kayla_crane': true } }),
        say(A, 'Thank you.'),
        act([{ do: 'walk', actor: 'azzy', to: at(LIBRARY.desk.x - 1, LIBRARY.desk.y + 1), facing: 'up' }], Z, 'Titi. Come to the Muster.'),
        say(K, 'I am a clerk.'),
        say(Z, 'You are family.'),
        say(K, 'I am family who is a clerk. Both are written.'),
        say(K, 'The council sits at dawn. Take the box to the Hall.'),
      ],
    },
    after: { lines: [say(K, 'The council sits at dawn, envoy. I will hear about it by noon. Everyone does.')] },
  }),
  simple('kayla_desk', [nar('Kayla\'s desk: a brush, an ink stone, and a row of paper cranes, each folded from a different page.')]),
  simple('clerk_desk_echo', [nar('The clerk\'s desk, fifty years ago: a brush, an ink stone, and a list of shelf marks nobody is to say aloud.')]),
  simple('sayo_clerk_talk', [say('sayo_clerk', 'Crane, pine, first row. ...I said nothing. You heard nothing.')]),
  script('clerk_echo', {
    start: { lines: [], next: [{ if: { flag: 'clue.shelf_mark' }, to: 'again' }, { to: 'first' }] },
    again: { lines: [nar('Kayla\'s desk, fifty years ago. Sayo\'s clerk is filing, and saying nothing aloud.')] },
    first: {
      lines: [
        nar('The same desk, fifty years ago. A young clerk in grey files a thick folder, and says its mark aloud to nobody.', { fx: 'fade' }),
        act(
          [
            { do: 'look', actor: 'npc:sayo_clerk' },
            { do: 'walk', actor: 'npc:sayo_clerk', to: at(LIBRARY.seal.x - 1, LIBRARY.seal.y), facing: 'right' },
            { do: 'wait', ms: 500 },
          ],
          'sayo_clerk',
          'Crane for the Crown. Pine for the war. The row for the years.',
        ),
        act([{ do: 'walk', actor: 'npc:sayo_clerk', to: at(LIBRARY.kayla.x, LIBRARY.kayla.y), facing: 'down' }], 'sayo_clerk', 'First row, this war. Nobody is to say that aloud.', {
          set: { 'clue.shelf_mark': true },
        }),
        say(P, '(Crane for the Crown, pine for the war, the row for the years. The oldest at the top.)'),
      ],
    },
  }),
  simple('kq_librarian_talk', [say('kq_librarian', 'Yōkoso. Nine books on the shelves; the stacks are sealed. Read quietly.', { translation: 'Welcome' })]),
  simple('suzumori_elder_talk', [
    say('suzumori_elder', 'The Burned Temple is on that shelf. I signed the order that burned it, on a Crown paper that lied.'),
    say('suzumori_elder', 'Agnipur has not forgiven it. Nor have I. I write them a letter every year, and never send it.'),
  ]),
  script('stacks_seal', {
    start: { lines: [], next: [{ if: { flag: 'side.spy_ledger.accepted' }, to: 'window' }, { to: 'sealed' }] },
    sealed: { lines: [nar('The stacks\' door, sealed with paper and the Hall\'s chop. By the Neutrality Order, nobody opens it.')] },
    window: { lines: [nar('The stacks\' door, sealed with paper and the Hall\'s chop.'), nar('Above the reading tables, a high window in the partition is not sealed at all.')] },
  }),
  ...STACK_SHELVES.map((sh, i) => {
    const row = ['first', 'second', 'third'][sh.row - 1];
    const glyphs = `Glyphs on the shelf: ${sh.glyphs}, ${row} row.`;
    if (i === LIBRARY.ledgerShelf) {
      return script(`stack_${i + 1}`, {
        start: {
          lines: [],
          next: [
            { if: { any: [{ flag: 'item.spy_ledger' }, { flag: 'side.spy_ledger.done' }] }, to: 'gap' },
            { if: { flag: 'clue.shelf_mark' }, to: 'ledger' },
            { to: 'glyphs' },
          ],
        },
        glyphs: { lines: [nar(glyphs), nar('A thick ledger bound in grey. Without the shelf\'s rule, it is only a book among books.')] },
        ledger: {
          lines: [
            nar(glyphs),
            nar('Crane for the Crown, pine for the war, the third row for the latest years: the Ash Wars.'),
            say(G, 'The Suzumori spy ledger.', { set: { 'item.spy_ledger': true } }),
          ],
        },
        gap: { lines: [nar(`${glyphs} A gap where the grey ledger was.`)] },
      });
    }
    return script(`stack_${i + 1}`, {
      start: { lines: [], next: [{ if: { flag: 'clue.shelf_mark' }, to: 'read' }, { to: 'glyphs' }] },
      glyphs: { lines: [nar(glyphs)] },
      read: { lines: [nar(glyphs), nar(sh.holds)] },
    });
  }),
  simple('stacks_cutpurse_talk', [
    say('cutpurse', 'Envoys! In the stacks! The broker said no envoys!', { fx: 'shake' }),
    say(BY, 'Too late for that.', { set: { 'battle.next': 'stacks_cutpurses', 'battle.after': 'stacks_after' } }),
  ]),
  simple('stacks_seen', [
    act([{ do: 'face', actor: 'npc:stacks_cutpurse', facing: 'player' }], 'cutpurse', 'Envoys! In the stacks! The broker said no envoys!', { fx: 'shake' }),
    say(BY, 'Seen. Then fast.', { set: { 'battle.next': 'stacks_cutpurses', 'battle.after': 'stacks_after' } }),
  ]),
  simple('stacks_after', [
    nar('The cutpurses drop their boxes and go out by the window, one after another, into the fog.', { set: { 'story.stacks_cleared': true } }),
    say(Y, 'Boxes for "the broker". Whoever that is.'),
  ]),

  // ---- Beat 3: the lantern hour (the Hall of Screens) -------------------------------------------------------------
  simple('lantern_hour', [
    act(
      [
        { do: 'look', actor: 'npc:signal_master' },
        { do: 'walk', actor: 'npc:signal_master', to: at(HALL.kaede.x + 1, HALL.table.y + 2), facing: 'down' },
      ],
      '',
      'The Hall of Screens at the lantern hour. The signal master reads Torvald\'s letter aloud down the corridor.',
    ),
    say(SM, 'The Ironvow speak for Zetwal\'s envoy. The standard stands. Skarragol has heard the Throne\'s page and sells nothing.'),
    say(SM, 'Torvald.'),
    act([{ do: 'look', actor: 'npc:kaede' }], KD, 'We heard the page too.'),
    { if: { flag: 'clue.seventh_clause_read' }, speaker: KD, text: 'Waters, for Xaraguá. For us the Crown wrote: the fog.' },
    { if: { notFlag: 'clue.seventh_clause_read' }, speaker: KD, text: 'We heard the Parley ended badly.' },
    say(KD, 'I have had it copied. Everything about us is copied.'),
    say(KD, 'Kirinoura\'s council has ordered neutrality. The file house is sealed. No file leaves it, and no envoy enters it.'),
    say(KD, 'No informant of ours is named to anyone. That order protects the people who tell us things.'),
    say(KD, 'It is the only protection they have. The Throne has refused them the law\'s for fifty years.'),
    act([{ do: 'look', actor: 'npc:retainer_war' }, { do: 'walk', actor: 'npc:retainer_war', to: at(20, 4), facing: 'left' }], RW, 'Neutral means the Crown buys our silence instead of our ships.'),
    act([{ do: 'look', actor: 'npc:retainer_neutral' }, { do: 'walk', actor: 'npc:retainer_neutral', to: at(15, 4), facing: 'right' }], RN, 'Neutral means nobody burns our files.'),
    act([{ do: 'look', actor: 'npc:kaede' }], KD, 'Both are written. Sit down.'),
    act(
      [{ do: 'look', actor: 'npc:crown_observer' }, { do: 'walk', actor: 'npc:crown_observer', to: at(13, 9), facing: 'right' }],
      CO,
      'The Throne respects Kirinoura\'s neutrality entirely.',
    ),
    act(
      [{ do: 'walk', actor: 'npc:broker', to: at(13, 10), facing: 'right' }, { do: 'look', actor: 'npc:broker' }],
      '',
      'Beside him, a courteous man in plain grey, a paper fox mask at his belt, bows exactly and says nothing.',
    ),
    act([{ do: 'look', actor: 'player' }], G, 'Lady Kaede. Your mother gave my grandfather every Crown movement of the war.'),
    say(G, 'I am asking for one file: who the Crown is buying now.'),
    say(KD, 'Sayo\'s network is why there is a Kirinoura to be neutral. No.'),
    act(
      [
        { do: 'look', actor: 'haru' },
        { do: 'enter', actor: 'haru', look: 'haru', from: at(HALL.shoes.x, HALL.shoes.y), to: at(HALL.shoes.x - 1, HALL.shoes.y - 1), facing: 'up' },
      ],
      '',
      'A screen at the corridor\'s side falls over with a clatter. Behind it, a young man in grey, getting up.',
      { fx: 'shake' },
    ),
    say(H, 'Mother, the file house is being emptied through the back.'),
    act([{ do: 'look', actor: 'npc:kaede' }], KD, 'Haru. You were told to follow them, not to speak.'),
    act([{ do: 'face', actor: 'haru', facing: 'player' }], H, 'I am definitely not a spy.'),
    say(H, 'Somebody is selling the files. The seal is on the front door. Grandmother Sayo never used the front door.'),
    say(H, 'I know the old way in, through the fog. I am going tonight. Write that down.'),
    say(KD, 'It is already written.'),
    say(KD, 'Envoy. If my son walks the fog with you and comes back with proof the Crown has been inside my file house...'),
    say(KD, '...the council will hear a petition at dawn. Not before.'),
    act([{ do: 'walk', actor: 'haru', to: at(HALL.kaede.x + 1, HALL.sceneRow + 1), facing: 'up' }], '', 'Haru crosses the corridor and stands with them.', {
      set: { 'party.haru': true, 'story.haru_met': true, 'story.haru_seen_3': true },
    }),
    nar('(Haru joins the party.)'),
    say(H, 'The maze is past the torii, north-east of the quarter. The fog is worse at night. That is the point.'),
  ]),
  script('kaede_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'ally.kuroshi' }, to: 'after' },
        { if: { flag: 'story.fox_beaten' }, to: 'dawn' },
        { if: { flag: 'story.haru_met' }, to: 'night' },
        { to: 'day' },
      ],
    },
    day: { lines: [say(KD, 'The lantern hour, envoy. I hear letters at the lantern hour.')] },
    night: { lines: [say(KD, 'My son is with you. I have written that down too.')] },
    dawn: { lines: [say(KD, 'The council sits at dawn. Bring what you found up the corridor.')] },
    after: {
      lines: [
        say(KD, 'Agnipur will not take a Suzumori crane, envoy. Take it anyway.'),
        say(KD, 'A Zetwal trader waits at the pier. Across the bay, to the salt flats.'),
      ],
    },
  }),
  simple('retainer_neutral_talk', [
    { if: { notFlag: 'ally.kuroshi' }, speaker: RN, text: 'Neutral means nobody burns our files, envoy. Remember that when somebody does.' },
    { if: { flag: 'ally.kuroshi' }, speaker: RN, text: 'We were neutral. Now we are on a side. I hope you are worth the price, envoy.' },
  ]),
  simple('retainer_war_talk', [
    { if: { notFlag: 'ally.kuroshi' }, speaker: RW, text: 'Ships we have. Spies we have. What we lack is a council that will say which side it is on.' },
    { if: { flag: 'ally.kuroshi' }, speaker: RW, text: 'Now it has said. Good. I have informants on every ship in the harbour, envoy.' },
  ]),
  simple('signal_master_talk', [say(SM, 'Lantern codes on the wall, kite codes on the roof. Neither is the one you want, envoy.')]),
  simple('crown_observer_talk', [say(CO, 'Envoy. I am a customer of the city\'s tea, nothing more. The Throne respects its neutrality.')]),
  simple('broker_talk', [nar('The courteous man in grey bows exactly, and says nothing.')]),
  script('keeper_files_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.fox_beaten' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [say('keeper_files', 'The file house is sealed, envoy. I keep it sealed. That is all I do.')] },
    after: { lines: [nar('The keeper of files looks at his empty hands, and says nothing.')] },
  }),
  simple('fox_bound_talk', [say(FX, 'I never knew the name, envoy. I knew the mark. I was paid to know less than I do.')]),
  simple('kaede_table', [nar('Lady Kaede\'s writing table: a brush, an ink stone, and a sheet with one character written on it many times.')]),
  simple('haru_shoes', [nar('Two shoes under the hem of a screen. Grey cloth, good soles. They do not move.')]),
  simple('observer_bowl', [nar('The Crown observer\'s tea bowl, half full, still on the table. Nobody has cleared it.')]),
  simple('kite_codes', [nar('Lantern and kite codes painted on the wall: harbour, weather, ships. None of them is Sayo\'s.')]),
  script('filehouse_sealed', {
    start: { lines: [], next: [{ if: { flag: 'story.haru_met' }, to: 'haru' }, { to: 'sealed' }] },
    sealed: { lines: [say('keeper_files', 'The file house is sealed by the Neutrality Order, envoy. Nobody enters.')] },
    haru: { lines: [say('keeper_files', 'The file house is sealed by the Neutrality Order, envoy.'), say(H, 'Not this door. Grandmother never used the front door.')] },
  }),

  // ---- Beat 4: the fog maze (SIG-KUR part 1) -----------------------------------------------------------------------
  simple('maze_arrive', [
    nar('The fog maze: lanes of blank paper walls and unlit lantern posts. Fog to the edge of sight.', { fx: 'fade' }),
    act([{ do: 'look', actor: 'haru' }], H, 'Grandmother\'s people talked through this fog with lanterns. The posts are the same posts.'),
    say(H, 'The code was never written down anywhere. That was the point.'),
    act([{ do: 'walk', actor: 'follower', to: at(MAZE.zone.x, MAZE.zone.y + 1), facing: 'up' }], A, 'I\'ll count the lanterns from here, Gigi.'),
    act(
      [{ do: 'walk', actor: 'haru', to: at(MAZE.zone.x - 1, MAZE.zone.y + 1), facing: 'right' }, { do: 'wait', ms: 600 }],
      '',
      'Haru gives Anissa his own paper lantern, unlit.',
    ),
    say(H, 'Hold this. It makes you harder to lose.', { set: { 'item.haru_lantern': true } }),
    say(A, 'It\'s shimmering by the gate, Gigi.'),
  ]),
  script('lantern_echo', {
    start: { lines: [], next: [{ if: { flag: 'clue.lantern_code' }, to: 'again' }, { to: 'first' }] },
    again: {
      lines: [
        nar('The gate yard, fifty years ago. The posts burn as Sayo\'s agents left them: left, straight on, right.', {
          set: { 'echo.code_1': true, 'echo.code_2': true, 'echo.code_3': true },
          stage: [{ do: 'sync' }],
        }),
      ],
    },
    first: {
      lines: [
        nar('Fifty years ago. The posts round the gate yard are dark, and three figures in grey come out of the fog with tapers.', { fx: 'fade' }),
        act(
          [
            { do: 'enter', actor: 'agent_l', look: 'echo_agent', from: at(9, 28), to: at(9, 27), facing: 'left' },
            { do: 'look', actor: 'agent_l' },
          ],
          '',
          `One lights the west posts: ${pattern('left')}. She points down the left lane.`,
          { set: { 'echo.code_1': true } },
        ),
        act(
          [
            { do: 'enter', actor: 'agent_s', look: 'echo_agent', from: at(14, 28), to: at(12, 26), facing: 'up' },
            { do: 'look', actor: 'agent_s' },
          ],
          '',
          `One lights the posts over the lane: ${pattern('straight')}. Straight on.`,
          { set: { 'echo.code_2': true } },
        ),
        act(
          [
            { do: 'enter', actor: 'agent_r', look: 'echo_agent', from: at(18, 28), to: at(20, 27), facing: 'right' },
            { do: 'look', actor: 'agent_r' },
          ],
          '',
          `One lights the east posts: ${pattern('right')}. Right.`,
          { set: { 'echo.code_3': true } },
        ),
        act([{ do: 'look', actor: 'agent_s' }, { do: 'face', actor: 'agent_s', facing: 'player' }], 'sayo_agent', 'The rest you walk. The fog remembers nothing.'),
        act(
          [
            { do: 'exit', actor: 'agent_l', to: at(15, 25), async: true },
            { do: 'exit', actor: 'agent_s', to: at(15, 25), async: true },
            { do: 'exit', actor: 'agent_r', to: at(15, 25) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'They go into the fog, and the posts go on burning.',
          { set: { 'clue.lantern_code': true } },
        ),
        say(P, '(Two white and a red: left. Three white: on. One white and two red: right.)'),
      ],
    },
  }),
  simple('echo_post_left', [nar(`A post in the memory: ${pattern('left')}. The left lane.`)]),
  simple('echo_post_straight', [nar(`A post in the memory: ${pattern('straight')}. Straight on.`)]),
  simple('echo_post_right', [nar(`A post in the memory: ${pattern('right')}. The right lane.`)]),
  simple('post_dark', [nar('An unlit lantern post, wet with fog.')]),
  simple('post_white', [nar('A lantern post, burning white.')]),
  simple('post_red', [nar('A lantern post, burning red.')]),
  ...MAZE.route.map((turn, i) =>
    simple(`maze_lit_${i + 1}`, [
      nar(`Three posts flicker alight in the fog as you come in: ${pattern(turn)}.`),
      ...(i === 0 ? [say(H, 'Read them left to right.')] : []),
      ...(i === 0 ? [{ if: { notFlag: 'clue.lantern_code' }, speaker: H, text: 'If you know what they mean. Grandmother\'s people did.' }] : []),
      { if: { flag: 'clue.lantern_code' }, speaker: '', text: `(${WAY[turn][0]!.toUpperCase()}${WAY[turn].slice(1)}.)` },
    ]),
  ),
  ...MAZE.plazas.map((_, i) =>
    simple(`fog_return_${i + 1}`, [nar('The fog closes. When it thins, the plaza is behind you again.', { set: { 'travel.next': `kuroshi-fogmaze/mj${i + 1}` } })]),
  ),
  simple('maze_blind', [
    say(H, 'We walked it blind. Grandmother\'s people did not.'),
    say(H, 'Back to the gate, and look. The fog will be here.', { fx: 'fade', set: { 'travel.next': 'kuroshi-fogmaze/maze_gate' } }),
  ]),
  simple('maze_walked', [
    nar('A gap in the paper walls. Beyond it: reeds, black water, and a causeway into the fog.'),
    say(H, 'This is not spying. This is walking.'),
  ]),

  // ---- Beat 5: the marsh, the posts, the press (K-3) --------------------------------------------------------------
  simple('marsh_arrive', [
    nar('The Fog Marsh: a causeway through reeds, and the fishers\' huts at its end. Far off, the Hall\'s signal tower.', { fx: 'fade' }),
    act([{ do: 'look', actor: 'haru' }], H, 'Stay on the causeway. The reeds have people in them at night.'),
  ]),
  script('kq_old_fisher_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.lanterns.done' }, to: 'after' },
        { if: { flag: 'story.boats_home' }, to: 'press' },
        { to: 'posts' },
      ],
    },
    posts: {
      lines: [
        say(OF, 'The boats went out this morning and the fog came. They steer home by the marsh posts. The posts are dark.'),
        say(OF, 'Three at the fork, three at the bend. Left at the fork, then right at the bend.'),
        { if: { notFlag: 'clue.lantern_code' }, speaker: OF, text: 'And nobody here knows the code.' },
        { if: { flag: 'clue.lantern_code' }, speaker: H, text: 'We know it.', set: { 'side.lanterns.accepted': true } },
      ],
    },
    press: { lines: PRESS },
    after: { lines: [say(OF, 'Tell the Hall we read their council in our sheets. They know already.')] },
  }),
  script('marsh_press', {
    start: { lines: [], next: [{ if: { flag: 'side.lanterns.done' }, to: 'done' }, { to: 'cover' }] },
    cover: { lines: [nar('A box under a tarpaulin, and the old fisher\'s eye on you.')] },
    done: { lines: [nar('A lacquer box of type, and a wet proof with a grey thumbprint in ash on the ink.')] },
  }),
  simple('fog_bank', [nar('A bank of fog lies on the water east of the yard, thick as wool. Something like a causeway runs into it.')]),
  simple('boat_home', [nar('A fishing boat, home, its lantern still lit.')]),
  ...MARSH.posts.map((_, i) => marshPostScript(i + 1)),
  simple('moths_after', [
    nar('The moths scatter into the fog, away from the light.'),
    say(Y, 'Light the rest before they come back.'),
  ]),

  // ---- Beats 6 and 7: the file house, Sayo's war room, the screens, the spy map, the Fox -----------------------------
  simple('filehouse_enter', [
    nar('Through the signal tower\'s base, into the dark: the file house.', { fx: 'fade' }),
    nar('Lacquer file-boxes on every wall. A grid of paper screens on pivots in the middle of the room.'),
    act([{ do: 'look', actor: 'haru' }], H, 'Grandmother\'s war room. Her map hung there, on the west wall. Now it is a faded square.'),
    act([{ do: 'look', actor: 'follower' }], A, 'It\'s shimmering by the wall, Gigi.'),
  ]),
  simple('fh_front_shut', [nar('The front door. The paper seal is on the other side.')]),
  script('lanes_shut', {
    start: { lines: [nar('Paper screens stand edge to edge across the room: the lanes to the north stack are shut.'), nar('The grid of screens turns them.')] },
  }),
  script('north_stack', {
    start: { lines: [], next: [{ if: { flag: 'story.spy_map_read' }, to: 'marked' }, { to: 'boxes' }] },
    boxes: { lines: [nar('The north stack: lacquer file-boxes, floor to ceiling.')] },
    marked: { lines: [nar('The north stack. Sayo\'s map marked a floor stone under it.')] },
  }),
  script('floor_stone', {
    start: { lines: [], next: [{ if: { flag: 'story.fox_beaten' }, to: 'empty' }, { to: 'stone' }] },
    stone: { lines: [nar('A floor stone, lifted. Under it, a hollow.')] },
    empty: { lines: [nar('The hollow under the floor stone, empty.')] },
  }),
  ...FILEHOUSE.screens.map((_, i) => screenScript(i)),
  script('sayo_map', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.spy_map_read' }, to: 'read' },
        { if: { all: [{ flag: 'clue.sayo_network' }, { flag: 'item.kayla_glyphs' }] }, to: 'reading' },
        { if: { flag: 'clue.sayo_network' }, to: 'pins' },
        { to: 'faded' },
      ],
    },
    faded: { lines: [nar('A faded square on the west wall where a map once hung. Pin holes in it, hundreds of them.')] },
    pins: { lines: [nar('The pin holes, read with Sayo\'s map remembered. Marks beside some of them, in glyphs you cannot read.')] },
    reading: {
      lines: [
        nar('The pin holes, read with Sayo\'s map remembered, and Kayla\'s card of glyphs held up beside them.'),
        nar('One hole is marked twice, in Sayo\'s own glyph: the north stack, under the stone.'),
        say(G, 'Kayla\'s glyphs. The buyer\'s files are under the floor.', { set: { 'story.spy_map_read': true } }),
      ],
    },
    read: { lines: [nar('Sayo\'s map, remembered, and Kayla\'s glyphs: the north stack, under the stone.')] },
  }),
  simple('sayo_map_echo', [nar('Sayo\'s wall map: the realm drawn in ink on silk, pinned with paper slips.')]),
  simple('sayo_talk', [say(SY, 'The slips come in through the screens and go out the same way. Nobody writes their names.')]),
  script('sayo_echo', {
    start: { lines: [], next: [{ if: { flag: 'clue.sayo_network' }, to: 'again' }, { to: 'war' }] },
    again: { lines: [nar('Sayo\'s war room, fifty years ago. The middle screen\'s peg rattles.')] },
    ...sayoNodes(),
  }),
  script('sayo_echo_return', {
    start: { lines: [], next: [{ if: { flag: 'anchor.screen_peg' }, to: 'fixed' }, { to: 'loose' }] },
    fixed: { lines: [act([{ do: 'look', actor: 'player' }], H, 'The middle screen. It is not swinging. Fifty years, and it is pegged.')] },
    loose: { lines: [nar('The file house. The middle screen still swings loose on its pivot.')] },
  }),
  simple('loose_screen', [
    nar('The middle screen\'s peg is loose in its socket. The whole screen shifts when you touch it.'),
    act([{ do: 'look', actor: 'player' }], P, '(Drive the peg home.)'),
    nar('Patricio drives the peg home with the heel of his hand. The screen stops, facing north.', { fx: 'shake', set: { 'anchor.screen_peg': true } }),
    act([{ do: 'sync' }, { do: 'look', actor: 'npc:sayo' }], SY, 'Good. Now nothing in this house turns that should not.'),
  ]),
  script('fox_scene', {
    start: { lines: [], next: [{ if: { flag: 'encounter.kuroshi_story.fox.won' }, to: 'after' }, { to: 'meet' }] },
    meet: {
      lines: [
        act(
          [
            { do: 'place', actor: 'fox', look: 'paper_fox', at: at(FILEHOUSE.stone.x, FILEHOUSE.stone.y), facing: 'up' },
            { do: 'look', actor: 'fox' },
          ],
          '',
          'The floor stone is up. A courteous man in grey kneels at the hole with a lacquer box open beside him.',
        ),
        nar('Beside it, the Crown clerk\'s file-box: the one that crossed the main bridge.'),
        act([{ do: 'face', actor: 'fox', facing: 'player' }], BR, 'Lady Kaede\'s son. And the envoy. You came the old way; I came the new one.'),
        say(BR, 'The keeper has a price. Everyone in this city has a price. I keep the list.'),
        act([{ do: 'look', actor: 'haru' }], H, 'You sold Grandmother\'s files.'),
        say(BR, 'I sold copies. The originals are perfectly safe. That is what neutral means now.'),
        act(
          [
            { do: 'exit', actor: 'fox', to: at(FILEHOUSE.stone.x, 1) },
            { do: 'enter', actor: 'fox_a', look: 'paper_fox', from: at(6, 1), to: at(7, 3), facing: 'down', async: true },
            { do: 'enter', actor: 'fox_b', look: 'paper_fox', from: at(10, 1), to: at(10, 3), facing: 'down', async: true },
            { do: 'enter', actor: 'fox_c', look: 'paper_fox', from: at(14, 1), to: at(13, 3), facing: 'down', async: true },
            { do: 'enter', actor: 'fox_d', look: 'paper_fox', from: at(16, 1), to: at(16, 3), facing: 'down' },
          ],
          '',
          'He puts on the paper fox mask and steps behind a screen. Four of him step out.',
          { fx: 'shake' },
        ),
        say(FX, 'Which of us did you come for?', { set: { 'battle.next': 'file_house_fox', 'battle.after': 'fox_after' } }),
      ],
    },
    after: { lines: [], next: 'yield' },
    ...foxAfterNodes(),
  }),
  script('fox_after', { start: { lines: [], next: 'yield' }, ...foxAfterNodes() }),

  // ---- Beat 9: the petition (the price, the token, Haru leaves) ---------------------------------------------------
  script('petition', {
    start: {
      lines: [
        nar('Dawn at the Hall of Screens. The council is seated. The keeper of files stands with his hands empty.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'player' }], '', 'The Crown observer\'s place is empty. His tea bowl is still on the table in the tea room.'),
        { if: { flag: 'choice.fox_spared' }, speaker: '', text: 'The Fox kneels at the corridor\'s foot, mask in his lap.', stage: [{ do: 'look', actor: 'npc:fox_bound' }] },
        act(
          [{ do: 'look', actor: 'npc:signal_master' }, { do: 'walk', actor: 'npc:signal_master', to: at(HALL.kaede.x + 1, HALL.table.y + 2), facing: 'down' }],
          SM,
          'Copies of the file house, sold to the Throne\'s observer, in Throne sols. Countersigned. Eleven years of them.',
          { set: { 'story.price_receipts': true } },
        ),
        act([{ do: 'look', actor: 'npc:retainer_neutral' }], RN, 'We were neutral.'),
        act([{ do: 'look', actor: 'npc:kaede' }], KD, 'The Crown was not.'),
        nar('She brushes one line on the Neutrality Order, and turns the paper round so the council can read it.'),
        say(KD, 'The order stands for the people. It is lifted for the Throne.'),
        say(KD, 'The Suzumori want one thing: that the people who told Sayo what they knew are named in the law, not in a box.'),
        say(KD, 'Recognition. Protection. Zetwal\'s envoy has been reading our books all day. I had it counted.'),
        say(KD, 'You did our work in our own house. That is worth two lines.'),
      ],
      choices: [
        { text: 'Sign the Informants\' Petition.', set: { 'choice.petition_signed': true }, next: 'signed' },
        { text: 'Leave it to the council.', next: 'samira' },
      ],
    },
    signed: {
      lines: [
        { if: { flag: 'item.petition' }, speaker: Y, text: 'Xaraguá\'s Petition of Breach asks the same thing for us. Sign both, Lady Kaede.' },
        nar('Gianna signs the Informants\' Petition for Zetwal, under fifty names and fifty thumbprints. Kaede signs beneath.'),
      ],
      next: 'samira',
    },
    samira: {
      lines: [act([{ do: 'look', actor: 'samira' }], S, 'The Dorini bank could hold your informants\' names in a sealed account. For a fee.')],
      choices: [
        { text: 'Samira, waive the fee.', set: { 'choice.samira_names': true }, next: 'waived' },
        { text: 'Not this time.', next: 'token' },
      ],
    },
    waived: {
      lines: [say(S, 'Waived. My mother will hear about it. Write that down too, Lady Kaede.'), say(KD, 'It is already written.')],
      next: 'token',
    },
    token: {
      lines: [
        say(KD, 'The Suzumori network is Zetwal\'s when the realm musters. What you have not paid, the Muster will ask for.', { set: { 'ally.kuroshi': true } }),
        act([{ do: 'look', actor: 'npc:kaede' }, { do: 'wait', ms: 800 }], '', 'Kaede folds a paper crane from the margin of the turned order, and presses the Suzumori seal into its wing.'),
        say(KD, 'For the chamberlain\'s chair. Suzumori sits.', { set: { 'item.token_suzumori': true } }),
        act([{ do: 'walk', actor: 'haru', to: at(HALL.kaede.x, HALL.table.y + 2), facing: 'up' }], H, 'I am going with them, Mother.'),
        say(KD, 'You are not a spy.'),
        say(H, 'Definitely not.'),
        act([{ do: 'face', actor: 'npc:kaede', facing: 'player' }], KD, 'He listens better than he talks. It is the family trade.', { set: { 'story.haru_left_kirinoura': true } }),
        say(KD, 'Agnipur will not take a Suzumori crane. We burned their temple on a Crown paper that was false.'),
        say(KD, 'The elder who signed it is still alive, and still sorry. Take the crane anyway.'),
        say(KD, 'Their flame is dying, and the Crown is holding the oil.'),
        act([{ do: 'look', actor: 'npc:retainer_war' }], RW, 'And Agnipur\'s priests heard the page too. They were written down as: the ash.'),
        say(KD, 'A Zetwal trader waits at the pier. Across the bay, to the salt flats.'),
      ],
    },
  }),

  // ---- Beat 10: the pier (the card) --------------------------------------------------------------------------------
  simple('pier_end', [
    act([{ do: 'look', actor: 'npc:harbour_master' }], 'harbour_master', 'The Crown\'s man sailed before the lamps went out, envoy. He left his tea.'),
    nar('A Zetwal trader at the end of the pier, bound across the bay for Jwaladesh.'),
    act([{ do: 'look', actor: 'npc:salkhi_pier' }], '', 'Salkhi is loaded last, and makes a point of saying nothing about soup.'),
    act([{ do: 'look', actor: 'haru' }], H, 'Across the bay. The salt flats. Where the sky is on fire, they say.'),
    say(A, 'Haru\'s coming too, Gigi.'),
    say(G, 'He is.', { fx: 'fade', set: { 'act7.complete': true } }),
  ]),
];
