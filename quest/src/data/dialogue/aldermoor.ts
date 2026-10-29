// Chapter 9, The Regent's Keep (Kingsmere, Aldermoor): docs/quest/reviews/2026-10-22-chapter9-outline.md with its second
// review's fixes (section 6). The maps are tools/maps/aldermoor.ts; every tile in a stage direction comes from
// data/aldermoor.ts or is written next to the map it belongs to.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched by a foe, never a target
// and never jokes, and no comic line shares a node with hers; Salkhi never speaks in a scene with Anissa's lines in it;
// Vikram's breath is never in a node with Anissa's lines (tests/aldermoor.test.ts checks all three). The locked rule:
// Jordyn and Sebastian say nothing of Rael that reads only one way (Jordyn's "Keep the law" and Sebastian's weather are
// the family's two lines); the Regent's hand is seen and never proven (the commission is under the Throne's seal, with
// no hand); the Almoner is Chapter 1's veiled woman by the mill (owner decision, Oct 22), and she names nobody.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { Condition } from '../../engine/conditions.ts';
import type { StageCue } from '../../engine/stage.ts';
import { CATHEDRAL, CLOSE, CROSS, HEATH, KEEP, SEALS, cabinetOf, dialFlag, sealFlag, PACT_DRAWER, HONEST_DRAWER } from '../aldermoor.ts';

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

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const Z = 'azzy';
const S = 'samira';
const P = 'patricio';
const BY = 'bayarmaa';
const H = 'haru';
const V = 'vikram';
const ED = 'edmund';
const JO = 'jordyn';
const SB = 'sebastian';
const RG = 'regent';
const AL = 'almoner';
const RO = 'rosalind';
const TH = 'echo_thomas';
const PR = 'printer';
const SK = 'salkhi';
const CL = 'assize_clerk';
const MG = 'magistrate';

/** Who has seen the veiled woman by the mill on the Cane Road (Chapter 1: the review's 3.2). */
const WATCHER: Condition = { flag: 'story.watcher_met' };
const WARNED: Condition = { flag: 'choice.warned_watcher' };
/** The three families on the Cross, warned (Al-3 step 3). */
const FAMILIES: Condition = { all: [{ flag: 'family.pie' }, { flag: 'family.tea' }, { flag: 'family.constable' }] };

/** What Sebastian says is still left before the eve (worded from the flags). */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.purge_list.done' }, speaker: SB, text: 'Your friend\'s tutor is still waiting on the heath, I am told. Printers are terrible at waiting.' },
  { if: { notFlag: 'debate.aldermoor_one_hand.settled' }, speaker: SB, text: 'And the two by the cross are still at it. I can hear them from the loft.' },
];

/** The papers Jordyn takes into the court's evidence, and gives back by the book (the review's 3.8.6). */
const PAPERS = ['crown_pact', 'ash_road_accounts', 'thomas_record', 'crown_chronicle'] as const;
const intoEvidence = Object.fromEntries(PAPERS.flatMap((p) => [[`item.${p}`, false], [`evidence.${p}`, true]]));
const backFromEvidence = Object.fromEntries(PAPERS.flatMap((p) => [[`item.${p}`, true], [`evidence.${p}`, false]]));

// ---- The archive's cabinets (SIG-ALM part 1; the review's 3.11: a dialogue whose choices set the dial and the seal) ----

/** A cabinet's dial reads year `v` of its decade (0 is the decade's first; unset counts as 0). */
const dialIs = (n: number, v: number): Condition => (v === 0 ? { notFlag: dialFlag(n) } : { flag: dialFlag(n), eq: v });
const sealIs = (n: number, v: number): Condition => (v === 0 ? { notFlag: sealFlag(n) } : { flag: sealFlag(n), eq: v });
/** The drawer at this year under this seal (in its own cabinet). */
const drawerIs = (year: number, seal: string): Condition => {
  const n = cabinetOf(year);
  return { all: [dialIs(n, year - (n - 1) * 10 - 1), sealIs(n, SEALS.indexOf(seal as (typeof SEALS)[number]))] };
};

function cabinetScript(n: number): DialogueScript {
  const first = (n - 1) * 10 + 1;
  const years: DialogueLine[] = Array.from({ length: 10 }, (_, v) => ({ if: dialIs(n, v), speaker: '', text: `The year dial reads ${first + v}.` }));
  const seals: DialogueLine[] = SEALS.map((s, v) => ({ if: sealIs(n, v), speaker: '', text: `The seal switch shows ${s}.` }));
  const turnDial = Array.from({ length: 10 }, (_, v) => ({ if: dialIs(n, v), text: 'Turn the year dial.', set: { [dialFlag(n)]: (v + 1) % 10 }, next: 'look' }));
  const turnSeal = SEALS.map((_, v) => ({ if: sealIs(n, v), text: 'Turn the seal switch.', set: { [sealFlag(n)]: (v + 1) % SEALS.length }, next: 'look' }));
  return script(`cabinet_${n}`, {
    start: {
      lines: [nar(`A cabinet of drawers: the years ${first} to ${first + 9} of the Old King. Each drawer front carries two seals.`)],
      next: 'look',
    },
    look: {
      lines: [...years, ...seals],
      choices: [{ text: 'Pull the drawer.', next: 'pull' }, ...turnDial, ...turnSeal, { text: 'Leave it.' }],
    },
    pull: {
      lines: [],
      next: [
        { if: { all: [drawerIs(PACT_DRAWER.year, PACT_DRAWER.seal), { flag: 'clue.crown_pact' }] }, to: 'taken' },
        { if: drawerIs(PACT_DRAWER.year, PACT_DRAWER.seal), to: 'pact' },
        { if: drawerIs(HONEST_DRAWER.year, HONEST_DRAWER.seal), to: 'slip' },
        { if: drawerIs(PACT_DRAWER.year, 'violet'), to: 'roll' },
        { to: 'empty' },
      ],
    },
    empty: { lines: [nar('The drawer slides out. Empty.')], next: 'look' },
    roll: { lines: [nar('The Crown\'s own copy of a tax roll, in violet. Nothing about a harbor.')], next: 'look' },
    slip: {
      lines: [
        nar('The honest year, under the Brasador red. A slip, and nothing else.'),
        nar('"Matters touching the seventh clause: removed to the Lord Regent\'s keeping."'),
        say(H, 'Removed, it says. Not destroyed. Things this careful are never destroyed.'),
      ],
      next: 'look',
    },
    pact: {
      lines: [
        nar('The drawer of the thirty-second year, under the Brasador red. Two papers, tied in violet.', { fx: 'flash', set: { 'clue.crown_pact': true, 'item.crown_pact': true, 'item.ash_road_accounts': true } }),
        act([{ do: 'walk', actor: 'haru', to: at(KEEP.desk.x, KEEP.desk.y + 1), facing: 'up' }], H, '"To the Lord of Ardencia, for his bloodline, the Throne at the Regent\'s pleasure."'),
        say(H, '"For his treasury, the harbor dues of Xaraguá for ten years; paid, the first year, in full." It\'s receipted.'),
        say(G, 'For a chair.'),
        nar('The second paper: columns of figures leaving Ardencia\'s treasury into accounts marked with a cipher, and a road.'),
        nar('Every column is headed the same way: the Ash Road.', { set: { 'clue.ash_road_accounts': true } }),
        say(H, 'A cipher. Not Kirinoura\'s, not the counting-house hand. I will need the key, and the key is not in this room.'),
        say(S, 'Somebody who hides where money goes is stealing it or giving it away. In my experience it is never the second.'),
        say(G, 'He took it and he spent it. That\'s all a ledger ever says.'),
      ],
    },
    taken: { lines: [nar('The drawer of the thirty-second year, under the red. Empty now: the pact is in Gianna\'s hands.')], next: 'look' },
  });
}

export const ALDERMOOR_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0: the Mere Stair and the heath road --------------------------------------------------------------------
  script('heath_arrive', {
    start: {
      lines: [
        nar('The Mere Stair at dawn: a stone stair up from a flat grey mere, a fishermen\'s shed, and rain.', { fx: 'fade' }),
        say(H, 'Everything about Kingsmere is written down. By Kingsmere.'),
        say(V, 'Then we argue... with the book.'),
        say(BY, 'Say less.'),
        say(S, 'A court that keeps its own ledger. I may enjoy this.'),
      ],
      next: 'rain',
    },
    rain: {
      lines: [say(A, 'Gigi. It\'s the colour of the Regent\'s coat.'), say(G, 'It\'s rain, Nissa. He doesn\'t own it.')],
      next: 'trader',
    },
    trader: {
      lines: [
        act(
          [{ do: 'place', actor: 'al_trader', look: 'ferryman', at: at(HEATH.boardX, HEATH.landing.y), facing: 'right' }, { do: 'look', actor: 'al_trader' }],
          'al_trader',
          'I\'m not tying up under a Crown gun with your flag on my mast. The stair\'s dry at this tide. Mostly.',
        ),
        say('al_trader', 'I\'ll be off the point four nights. After that I\'m a Zetwal trader who has never heard of you.'),
        act([{ do: 'exit', actor: 'al_trader', to: at(HEATH.boat.x + 1, HEATH.boat.y) }, { do: 'look', actor: 'player' }], '', 'He goes down the stair to his boat, and pushes off into the rain.'),
      ],
      next: 'escort',
    },
    escort: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'escort_1', look: 'moor_constable', from: at(14, HEATH.roadRows[0]), to: at(HEATH.notice.x + 1, HEATH.roadRows[0] - 1), facing: 'left', async: true },
            { do: 'enter', actor: 'escort_2', look: 'moor_constable_b', from: at(14, HEATH.roadRows[1]), to: at(HEATH.notice.x + 1, HEATH.roadRows[1] + 1), facing: 'left' },
            { do: 'look', actor: 'escort_1' },
          ],
          '',
          'Two constables in oilskins are waiting at the stair\'s head. They touch their hats.',
        ),
        say('moor_constable', 'The Lord Regent is informed of every arrival. He asks that the envoy\'s household use the road, and not the heath.'),
        say('moor_constable', 'The heath is unsafe for guests. We\'ll walk ahead, if it\'s all the same.'),
        act(
          [
            { do: 'exit', actor: 'escort_1', to: at(HEATH.escorts[0]!.x, HEATH.escorts[0]!.y), async: true },
            { do: 'exit', actor: 'escort_2', to: at(HEATH.escorts[1]!.x, HEATH.escorts[1]!.y) },
            { do: 'sync' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'They walk ahead up the heath road, and wait at the Moor Gate. Watching is a kind of escort.',
          { set: { 'story.escort_met': true } },
        ),
      ],
      next: 'chapel',
    },
    chapel: {
      lines: [
        act([{ do: 'look', actor: 'npc:chapel_veil_a' }, { do: 'wait', ms: 700 }], '', 'South of the road, in the bog: a roofless chapel. Two veiled figures stand at its door.'),
        act([{ do: 'face', actor: 'npc:chapel_veil_a', facing: 'up' }, { do: 'face', actor: 'npc:chapel_veil_b', facing: 'up' }, { do: 'look', actor: 'player' }], Y, 'They don\'t look at you. They look at her.'),
        nar('Gianna takes the side of the road nearer the bog, with Anissa on the other.'),
      ],
    },
  }),
  script('notice_post', {
    start: { lines: [], next: [{ if: { flag: 'story.recital_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The Crown\'s notice post: two bills under a tin hood, out of the rain.'),
        nar('THE ASSIZE OF KINGSMERE sits on the third day. The Lord Regent presides. The Crown\'s fleet sails after it.'),
        nar('By command of the Lord Regent: SEBASTIAN JEAN-PHILIPPE, organist to three courts, at the great organ of St. Agatha\'s.'),
        nar('On the eve of the Assize: the Agatha Toccata. Admission by the Regent\'s leave.'),
      ],
      next: 'name',
    },
    name: {
      lines: [
        act([{ do: 'walk', actor: 'follower', to: at(HEATH.notice.x - 1, HEATH.notice.y + 1), facing: 'up' }, { do: 'wait', ms: 600 }], '', 'Anissa reads the second bill aloud, slowly, to the name.'),
        say(A, 'Jean-Philippe. Gigi, that\'s Grandpapa\'s name.'),
        say(G, 'That\'s Mummy\'s brother. He writes to her about the weather.', { set: { 'story.recital_seen': true } }),
      ],
    },
    again: { lines: [nar('THE ASSIZE OF KINGSMERE sits on the third day. And: SEBASTIAN JEAN-PHILIPPE, at St. Agatha\'s, on the eve.')] },
  }),
  script('moor_gate', {
    start: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:moor_sealbearer', to: at(HEATH.gateStrip + 2, HEATH.roadRows[0]), facing: 'left' }, { do: 'look', actor: 'npc:moor_sealbearer' }],
          'sealbearer',
          'Papers.',
        ),
        act([{ do: 'wait', ms: 1000 }], '', 'Gianna hands over the envoy\'s papers. The Sealbearer reads them, and keeps them a breath too long.'),
        say('sealbearer', 'Zetwal. Spoken for by Ironvow, Suzumori and Agnivansh. The Lord Regent receives everybody.'),
        nar('He gives them back.', { set: { 'story.moor_gate': true } }),
        say(S, 'He read them twice. Nobody reads my papers twice.'),
      ],
    },
  }),
  simple('al_trader_ship', [nar('The Zetwal trader\'s boat, gold sail furled, rocking on the grey mere.')]),
  simple('heath_milestone', [nar('A milestone, worn soft by rain: KINGSMERE 2. Somebody has chalked a small closed hand on it, and rubbed it out.')]),
  script('barn_thumb', {
    start: { lines: [], next: [{ if: { flag: 'side.purge_list.accepted' }, to: 'known' }, { to: 'first' }] },
    first: { lines: [nar('The printing barn\'s door. On it, low down, a grey thumbprint pressed in ash.'), say(Y, 'Again. Eight cities, and the same thumb.')] },
    known: { lines: [nar('The grey thumbprint on the barn door, half washed out by the rain.')] },
  }),
  simple('hand_press', [nar('A hand press under an open shed, its bed inked black. The apprentices keep it covered from the rain.')]),
  simple('drying_sheets', [nar('Sheets drying on a line under the eaves. A ballad about a sergeant who sat down in a puddle.')]),
  simple('chapel_lantern', [nar('A lantern on the chapel\'s altar-stone, shuttered to a slit. Nobody here wants to be seen from the road.')]),
  simple('moor_sealbearer_talk', [say('sealbearer', 'The Moor Gate is open from first bell to last. The heath is not.')]),
  simple('escort_constable_talk', [say('moor_constable', 'We\'re only here to see you don\'t get lost, madam. Sorry. It\'s the orders.')]),
  simple('chapel_veil_talk', [nar('The veil does not answer. It is looking past Gianna, at Anissa.')]),
  simple('chapel_hound_talk', [nar('A black bog hound on a chain, lying very still. It is not asleep.')]),
  script('salkhi_heath_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.hushed_beaten' }, to: 'dry' }, { to: 'rain' }] },
    rain: { lines: [say(SK, 'Rain. I was promised grass in four countries. This is heather. It is not grass. It is wet.')] },
    dry: { lines: [say(SK, 'It stopped raining. I do not trust it.')] },
  }),

  // ---- Beat 1: the Market Cross; the lady in grey; the press-gang; Edmund ---------------------------------------------
  simple('cross_arrive', [
    nar('The Market Cross: a wet grey square round a stone cross. Tea shops with steamed windows. Constables at every corner.', { fx: 'fade' }),
    act(
      [
        { do: 'enter', actor: 'almoner_walk', look: 'almoner', from: at(CROSS.keep.x, CROSS.keep.y + 1), to: at(CROSS.closeGate.x + 1, CROSS.closeGate.y + 2), facing: 'left', async: true },
        { do: 'enter', actor: 'alms_walk_1', look: 'almswoman', from: at(CROSS.keep.x + 1, CROSS.keep.y + 1), to: at(CROSS.closeGate.x + 3, CROSS.closeGate.y + 2), facing: 'left', async: true },
        { do: 'enter', actor: 'alms_walk_2', look: 'almswoman_b', from: at(CROSS.keep.x, CROSS.keep.y + 2), to: at(CROSS.closeGate.x + 3, CROSS.closeGate.y + 3), facing: 'left' },
        { do: 'look', actor: 'almoner_walk' },
      ],
      '',
      'A woman in grey with a covered basket crosses from the keep\'s gate. Two veiled almswomen carry bread behind her.',
    ),
    nar('People step out of her way. A tea-shop door shuts as she passes. Nobody takes the bread.'),
    act(
      [
        { do: 'exit', actor: 'almoner_walk', to: at(CROSS.closeGate.x, CROSS.closeGate.y + 1), async: true },
        { do: 'exit', actor: 'alms_walk_1', to: at(CROSS.closeGate.x + 1, CROSS.closeGate.y + 1), async: true },
        { do: 'exit', actor: 'alms_walk_2', to: at(CROSS.closeGate.x, CROSS.closeGate.y + 1) },
        { do: 'look', actor: 'player' },
      ],
      H,
      'Everybody here steps aside for a woman with a basket.',
    ),
    say(S, 'Charity. In my experience the most expensive thing a city sells.'),
  ]),
  script('press_gang', {
    start: { lines: [], next: [{ if: { flag: 'story.press_gang_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        act(
          [
            { do: 'place', actor: 'pie_boy_pg', look: 'pie_boy', at: at(CROSS.pieDoor.x + 1, CROSS.pieDoor.y), facing: 'right' },
            { do: 'place', actor: 'pie_mother_pg', look: 'pie_mother', at: at(CROSS.pieDoor.x + 1, CROSS.pieDoor.y + 1), facing: 'right' },
            { do: 'place', actor: 'sergeant', look: 'crown_officer', at: at(CROSS.pieDoor.x + 2, CROSS.pieDoor.y), facing: 'left' },
            { do: 'place', actor: 'pg_constable_1', look: 'moor_constable', at: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y - 1), facing: 'left' },
            { do: 'place', actor: 'pg_constable_2', look: 'moor_constable_b', at: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y + 1), facing: 'left' },
            { do: 'look', actor: 'sergeant' },
          ],
          'sergeant',
          'The Crown\'s fleet sails after the Assize, boy, and it sails with you in it. Sign, or make your mark.',
        ),
        nar('The pie-shop boy\'s mother stands in the doorway with flour on her hands.'),
        act(
          [
            { do: 'enter', actor: 'edmund_pg', look: 'edmund', from: at(CROSS.keep.x, CROSS.keep.y + 1), to: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y), facing: 'left' },
            { do: 'look', actor: 'edmund_pg' },
          ],
          '',
          'A young man in a good coat crosses the square at a walk, taking off his hat as he comes.',
        ),
        say(ED, 'I\'m terribly sorry about this.'),
        act(
          [{ do: 'walk', actor: 'sergeant', to: at(CROSS.pieDoor.x + 2, CROSS.pieDoor.y - 1), facing: 'right' }],
          '',
          'He hits the sergeant. The sergeant sits down in the wet.',
          { fx: 'shake' },
        ),
        act([{ do: 'face', actor: 'edmund_pg', facing: 'player' }], ED, 'You\'re the envoy\'s household. You\'re the only people in the square not looking at your shoes.'),
        { if: { flag: 'side.seats.aldermoor' }, speaker: ED, text: 'Miss Yari. I read your petition, at Eightgate. Somebody should.' },
        say(ED, 'Edmund Stillwater. Would you mind awfully?', { set: { 'party.edmund': true, 'story.press_gang_seen': true } }),
        say(G, 'Not at all.', { set: { 'battle.next': 'press_gang_cross', 'battle.after': 'press_gang_after' } }),
      ],
    },
    again: {
      lines: [
        act(
          [
            { do: 'place', actor: 'sergeant', look: 'crown_officer', at: at(CROSS.pieDoor.x + 2, CROSS.pieDoor.y), facing: 'right' },
            { do: 'place', actor: 'pg_constable_1', look: 'moor_constable', at: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y - 1), facing: 'right' },
            { do: 'place', actor: 'pg_constable_2', look: 'moor_constable_b', at: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y + 1), facing: 'right' },
            { do: 'look', actor: 'sergeant' },
          ],
          'sergeant',
          'Mr. Stillwater. And his friends. Again.',
        ),
        say(ED, 'Terribly sorry. Again.', { set: { 'battle.next': 'press_gang_cross', 'battle.after': 'press_gang_after' } }),
      ],
    },
  }),
  script('press_gang_after', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'sergeant', look: 'crown_officer', at: at(CROSS.pieDoor.x + 2, CROSS.pieDoor.y - 1), facing: 'down' },
            { do: 'place', actor: 'pg_constable_1', look: 'moor_constable', at: at(CROSS.pieDoor.x + 5, CROSS.pieDoor.y - 2), facing: 'left' },
            { do: 'walk', actor: 'edmund', to: at(CROSS.pieDoor.x + 3, CROSS.pieDoor.y - 1), facing: 'left' },
            { do: 'look', actor: 'sergeant' },
          ],
          '',
          'Edmund helps the sergeant up out of the wet, and gives him back his hat.',
        ),
        say(ED, 'Terribly sorry. I\'ll write.'),
        say('moor_constable', 'Mr. Stillwater. Your mother...'),
        say(ED, 'Yes. I know. Send it to the house.'),
        act(
          [
            { do: 'exit', actor: 'sergeant', to: at(CROSS.keep.x, CROSS.keep.y + 1), async: true },
            { do: 'exit', actor: 'pg_constable_1', to: at(CROSS.keep.x + 1, CROSS.keep.y + 1) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'They go back to the keep. Nobody is arrested: he is Lady Rosalind\'s son, and everybody in the square knows it.',
        ),
        act([{ do: 'face', actor: 'edmund', facing: 'player' }], ED, 'My mother sits on the Regent\'s council. I don\'t. I\'m sorry about the city; it used to be nicer, or we thought so.'),
        say(ED, 'Would you like some tea? You would. Everyone does, after the first hour.'),
        say(ED, 'You\'ll be received. He receives everybody. Then you\'ll be watched. Then you\'ll be asked to leave.'),
        say(ED, 'In between there\'s a very good library, and my old tutor, out on the heath, who prints things he oughtn\'t.'),
        say(ED, 'He would like to meet anyone who hasn\'t been purged yet.'),
      ],
      next: 'hat',
    },
    hat: {
      lines: [
        act([{ do: 'walk', actor: 'edmund', to: at(CROSS.pieDoor.x + 4, CROSS.pieDoor.y + 1), facing: 'down' }, { do: 'wait', ms: 600 }], '', 'He crouches to Anissa\'s height and holds out his hat.'),
        say(ED, 'Would you hold this for me? Hats get hit here. People don\'t, as a rule. Not in daylight.'),
        nar('She holds it, with both hands.', { set: { 'item.edmund_hat': true } }),
      ],
      next: 'joined',
    },
    joined: { lines: [nar('(Edmund joins the party.)', { set: { 'story.edmund_met': true } })] },
  }),
  simple('market_cross', [nar('The stone cross the square is named for, worn smooth at the height of a hand. People touch it for luck, and look round first.')]),
  simple('al_board', [
    nar('The contract board: "Carry pamphlets past the constables. The printer wants them by noon." Unsigned.'),
    nar('And: "Find a press-ganged son. The pie shop." Somebody has crossed it out, and written: "Found. Mr. Stillwater."'),
  ]),
  simple('tea_shop', [nar('A tea shop with steamed windows. Inside, people talk in low voices, and stop when the door opens.')]),
  script('family_pie', {
    start: { lines: [], next: [{ if: { flag: 'family.pie' }, to: 'done' }, { if: { flag: 'item.purge_list' }, to: 'warn' }, { to: 'shut' }] },
    shut: { lines: [nar('The pie shop\'s side door. Flour on the step.')] },
    warn: {
      lines: [
        act([{ do: 'place', actor: 'pie_mother_w', look: 'pie_mother', at: at(CROSS.pieDoor.x + 1, CROSS.pieDoor.y - 1), facing: 'right' }, { do: 'look', actor: 'pie_mother_w' }], '', 'The pie-shop boy\'s mother opens the door, flour to the elbows.'),
        say(G, 'Your name is on a list. Go to the printer\'s barn tonight. All of you.'),
        say('pie_mother', 'Then we\'ll go. He\'s already been pressed once this week.', { set: { 'family.pie': true } }),
        act([{ do: 'exit', actor: 'pie_mother_w', to: at(CROSS.pieDoor.x, CROSS.pieDoor.y) }], '', 'She shuts the door, and the lamp inside goes out.'),
      ],
      next: 'count',
    },
    count: { lines: [], next: [{ if: FAMILIES, to: 'all' }] },
    all: { lines: [say(G, 'That\'s the three. Back to the barn with the list.', { set: { 'story.families_warned': true } })] },
    done: { lines: [nar('The pie shop\'s side door, shut. The family is on the road to the barn.')] },
  }),
  script('family_tea', {
    start: { lines: [], next: [{ if: { flag: 'family.tea' }, to: 'done' }, { if: { flag: 'item.purge_list' }, to: 'warn' }, { to: 'shut' }] },
    shut: { lines: [nar('A tea shop\'s door, shut in the middle of the afternoon. It shut when the woman in grey went by.')] },
    warn: {
      lines: [
        act([{ do: 'place', actor: 'tea_woman', look: 'tea_woman', at: at(CROSS.teaDoor.x, CROSS.teaDoor.y + 1), facing: 'down' }, { do: 'look', actor: 'tea_woman' }], '', 'A woman opens the door a hand\'s width. Haru reads her name off the list.'),
        act([{ do: 'wait', ms: 1200 }], '', 'She nods. She opens her mouth to say it, and nothing comes.'),
        act([{ do: 'exit', actor: 'tea_woman', to: at(CROSS.teaDoor.x, CROSS.teaDoor.y) }], '', 'She shuts the door very gently.'),
        say(G, 'We were too late for one.', { set: { 'family.tea': true } }),
      ],
      next: 'count',
    },
    count: { lines: [], next: [{ if: FAMILIES, to: 'all' }] },
    all: { lines: [say(G, 'That\'s the three. Back to the barn with the list.', { set: { 'story.families_warned': true } })] },
    done: { lines: [nar('The tea shop\'s door, shut. Nobody inside says anything at all.')] },
  }),
  script('family_constable', {
    start: { lines: [], next: [{ if: { flag: 'family.constable' }, to: 'done' }, { if: { flag: 'item.purge_list' }, to: 'warn' }, { to: 'shut' }] },
    shut: { lines: [nar('A constable\'s house: a coat on the peg inside the window, a pair of wet boots on the step.')] },
    warn: {
      lines: [
        act([{ do: 'place', actor: 'constable_w', look: 'moor_constable', at: at(CROSS.constableDoor.x - 1, CROSS.constableDoor.y), facing: 'left' }, { do: 'look', actor: 'constable_w' }], 'sorry_constable', 'Madam? Oh. Is it... I\'m on it? I\'m on my own list?'),
        say('sorry_constable', 'Right. The barn. I\'m sorry. I\'ll go.', { set: { 'family.constable': true } }),
        act([{ do: 'exit', actor: 'constable_w', to: at(CROSS.constableDoor.x, CROSS.constableDoor.y) }], '', 'He takes his coat off the peg, looks at it, and leaves it there.'),
      ],
      next: 'count',
    },
    count: { lines: [], next: [{ if: FAMILIES, to: 'all' }] },
    all: { lines: [say(G, 'That\'s the three. Back to the barn with the list.', { set: { 'story.families_warned': true } })] },
    done: { lines: [nar('The constable\'s house, dark. His coat is still on the peg.')] },
  }),
  simple('cathedral_rehearsal', [
    nar('From inside St. Agatha\'s: a run of organ pipes, very loud, stopped short, then started again.', { fx: 'shake' }),
    say('moor_constable', 'Rehearsal, madam. Nobody goes in during the Toccata. Nobody.'),
  ]),
  simple('close_gate_shut', [nar('The gate to the close, between the church and the keep. Locked. The watch opens it at the evening bell.')]),
  simple('pie_seller_talk', [say('pie_seller', 'Afternoon. Mind the rain. Meat pie, scones, tea. The tea\'s the only thing in Kingsmere that isn\'t cold.')]),
  simple('al_jeweller_talk', [say('al_jeweller', 'Good day, madam. Seals, rings and the law\'s brooch. Everything here is certified.')]),
  simple('al_outfitter_talk', [say('al_outfitter', 'How may I help? Oilcloth, steel, and a good coat. Kingsmere asks for all three.')]),
  simple('cross_constable_talk', [say('moor_constable', 'Mind the step, madam. It\'s slippery. Everything is, lately.')]),
  script('salkhi_cross_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.edmund_met' }, to: 'tea' }, { to: 'square' }] },
    square: { lines: [say(SK, 'A square with no grass in it, and a cross with no grass round it. I see.')] },
    tea: { lines: [say(SK, 'The polite one offered me tea. I am a horse. I accepted.')] },
  }),

  // ---- Beat 2: the Regent's Keep; Jordyn's first sighting; the Regent's answer ---------------------------------------
  script('regent_audience', {
    start: {
      lines: [
        nar('The great hall of the Regent\'s Keep: a long cold room, a violet carpet, and at its head a tall plain chair.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:jordyn' }, { do: 'walk', actor: 'azzy', to: at(KEEP.jordyn.x - 1, KEEP.audienceRow), facing: 'right' }, { do: 'wait', ms: 500 }], Z, 'Titi—'),
        say(JO, 'Captain of the Regent\'s watch, sir. The envoy\'s household addresses the chamberlain.'),
        act([{ do: 'walk', actor: 'yari', to: at(KEEP.jordyn.x - 2, KEEP.audienceRow - 1), facing: 'right' }, { do: 'walk', actor: 'azzy', to: at(KEEP.jordyn.x - 3, KEEP.audienceRow - 1), facing: 'up' }], '', 'Yari takes Azzy by the arm and walks him on.'),
        say(A, 'She looked at him, Gigi. Just for a second.', { set: { 'story.jordyn_seen': true } }),
      ],
      next: 'hall',
    },
    hall: {
      lines: [
        act(
          [{ do: 'look', actor: 'npc:al_chamberlain' }, { do: 'walk', actor: 'npc:al_chamberlain', to: at(KEEP.chamberlain.x + 1, KEEP.chamberlain.y - 2), facing: 'up' }],
          'al_chamberlain',
          'The envoy of Zetwal and her household, spoken for by Ironvow, Suzumori and Agnivansh.',
        ),
        act([{ do: 'look', actor: 'npc:al_regent' }], '', 'The Lord Regent Aldric Vane: grey, thin, a chain of office. He names them before anyone can.'),
        say(RG, 'Haru Suzumori, whose grandmother\'s files I have paid for twice.'),
        say(RG, 'Bayarmaa of the Ironvow, whose standard I am told was found. Vikram of the Flame, who is out of breath.'),
        say(V, 'Always.'),
        say(RG, 'And Mr. Stillwater, who has hit a sergeant.'),
        say(ED, 'I\'ve written.'),
        act([{ do: 'face', actor: 'npc:al_regent', facing: 'player' }, { do: 'wait', ms: 1200 }], '', 'He looks at Anissa for the length of one breath, and says nothing to her.'),
        act([{ do: 'look', actor: 'npc:almoner' }], '', 'Behind his chair, a lady in grey with a basket of bread on her arm. The Regent has not eaten any.'),
        say(H, 'He said he was always at Eightgate.'),
        say(ED, 'He says that everywhere.'),
      ],
      next: 'ask',
    },
    ask: {
      lines: [
        say(G, 'Zetwal asks to see the Crown\'s pact with Ardencia, which the Throne\'s purchasing office paid for in oil and files,'),
        say(S, 'And at a very poor rate,'),
        say(G, 'and the Crown\'s own record of the Seventh Clause.'),
        say(RG, 'Both exist. You may see neither. You may see the city, which is open, and the Rolls House, which is public.'),
        say(RG, 'And the Assize, where you will sit in the gallery and learn how the Crown is governed.'),
        say(RG, 'And the recital. Your uncle plays very loud.'),
        say(G, 'The Seventh Clause says "to be revisited". Zetwal asks when.'),
        say(RG, 'After the Assize. With a fleet. That is a revisiting.', { set: { 'story.regent_refused': true } }),
        act([{ do: 'look', actor: 'npc:rosalind' }], RO, 'Edmund. You\'ve hit someone.'),
        say(ED, 'Mother. A sergeant. I\'ve written.'),
      ],
      next: 'door',
    },
    door: {
      lines: [
        act([{ do: 'look', actor: 'npc:jordyn' }, { do: 'face', actor: 'player', facing: 'down' }], '', 'As the party passes the watch\'s station, the captain speaks without moving her eyes.'),
        say(JO, 'The close. After the evening bell. Don\'t bring the little one into the rain.', { set: { 'story.jordyn_line': true } }),
      ],
    },
  }),
  simple('keep_gate_held', [say('regent_watch', 'The keep\'s gate is shut while the court sits, envoy. You\'ll be walked out when it rises.')]),
  script('al_regent_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.caught' }, to: 'court' }, { if: { flag: 'story.regent_refused' }, to: 'refused' }, { to: 'hall' }] },
    hall: { lines: [say(RG, 'Walk up the hall, envoy. You are expected. Everybody is.')] },
    refused: { lines: [say(RG, 'You have my answer, envoy. The city is open. The Rolls House is public. The recital is loud.')] },
    court: { lines: [say(RG, 'The envoy will address the court through its clerk.')] },
  }),
  script('almoner_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.caught' }, to: 'court' }, { to: 'hall' }] },
    hall: { lines: [say(AL, 'Bread, envoy? No? The Crown\'s charities are for those who need them.')] },
    court: { lines: [say(AL, 'The court will hear me in its turn, child. So will you.')] },
  }),
  simple('magistrate_talk', [say(MG, 'The Crown\'s magistrate does not discuss matters before the Assize.')]),
  simple('keep_steward_talk', [say('keep_steward', 'The archive is sealed at the recital\'s bell, envoy, and opened at the Regent\'s word. I keep the keys. Not that one.')]),
  simple('witness_bishop_talk', [say('witness_bishop', 'In this keep the Witness is the law. A word given before it is kept, or it falls, and the one who gave it.')]),
  // Lady Rosalind's talk: data/dialogue/aldermoorQuests.ts (Al-1 is offered there, built Oct 27).
  simple('al_chamberlain_talk', [say('al_chamberlain', 'The Regent receives at his chair. Petitions to the clerk. Complaints to the Witness. Envoys to the gallery.')]),
  script('jordyn_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.caught' }, to: 'court' },
        { if: { flag: 'story.jordyn_offer' }, to: 'offer' },
        { if: { flag: 'story.jordyn_line' }, to: 'bell' },
        { to: 'duty' },
      ],
    },
    duty: { lines: [say(JO, 'Captain of the watch. The chamberlain is up the hall.')] },
    bell: { lines: [say(JO, 'After the evening bell. The close.')] },
    offer: { lines: [say(JO, 'The loud piece. Not a bar longer.')] },
    court: { lines: [say(JO, 'Officer of the court, envoy. Speak to the clerk. By the book.')] },
  }),
  simple('keep_sealbearer_talk', [say('sealbearer', 'The Throne\'s writs are served by the Sealbearers. The watch only arrests. You will want to remember the difference.')]),
  simple('night_sealbearer_talk', [say('sealbearer', '...')]),
  simple('clock_door', [nar('The clock tower\'s door. A rusted clock face over it; the hands have not moved in anyone\'s memory.'), nar('Nobody can say what hour they stopped at.')]),
  simple('almoner_office', [nar('A door with a basket hung on a hook beside it. Shut. No name on it, and no lock you can see.')]),
  simple('post_office', [nar('The keep\'s post office, letters sorted in Aldermoor violet. The postmaster sits on the council, so nobody is here.')]),
  simple('bell_post', [nar('The close\'s bell on its post. The evening bell. It rings for the watch, and the watch is one person tonight.')]),
  script('court_doors', {
    start: { lines: [nar('The courtroom\'s doors, shut and barred. A notice: THE ASSIZE SITS ON THE THIRD DAY.')] },
  }),

  // ---- Beat 2b: the close, after the bell; Jordyn's offer -------------------------------------------------------------
  script('close_offer', {
    start: {
      lines: [
        nar('The close: wet flagstones between the keep\'s wall and the church\'s. The evening bell rings on its post.', { fx: 'fade' }),
        act(
          [
            { do: 'enter', actor: 'jordyn_close', look: 'jordyn', from: at(CLOSE.postern.x, CLOSE.postern.y - 1), to: at(CLOSE.offerStrip - 3, CLOSE.gate.y), facing: 'right' },
            { do: 'look', actor: 'jordyn_close' },
          ],
          '',
          'The postern in the keep\'s wall opens from inside, and shuts again behind a tall woman in violet.',
        ),
        nar('She stands in the rain with her hands behind her back, as she stood in the hall.'),
        act([{ do: 'walk', actor: 'azzy', to: at(CLOSE.offerStrip - 2, CLOSE.gate.y), facing: 'left' }], JO, 'Azriel. You\'ve got Mother\'s jaw. Don\'t lead with it.', { mood: 'mothers_jaw' }),
        say(JO, 'I know who you are. All three of you. Mother writes: Kayla writes to Mother, and Mother writes to everyone.'),
        say(JO, 'I don\'t defect for family. I defect for law, and I have not decided.'),
        say(G, 'Then why are you in the rain?'),
        say(JO, 'Because the law is not being kept, and I\'m the one who keeps it.'),
        say(JO, 'The almswomen go out onto the heath at night. Families come back without their voices.'),
        say(JO, 'The watch arrests thieves and deserters. It does not arrest the Regent\'s almoner. The Assize will try nobody for it.'),
        say(JO, 'And the archive holds a record a Stillwater hid, which the Crown says does not exist. I would like it to exist.'),
        say(JO, 'I\'ve read the public edition. It reads like a clean floor.'),
      ],
      next: 'offer',
    },
    offer: {
      lines: [
        say(JO, 'Tomorrow night the court is at your uncle\'s recital. The keep\'s watch is mine.'),
        say(JO, 'This postern will be unbarred for the length of the loud piece, and not a bar longer.'),
        say(JO, 'If you are found, I did not unbar it, and I will arrest you myself, by the book.'),
        say(JO, 'The book is the only thing that keeps anyone alive in that building. Understood?'),
        say(G, 'Understood.'),
      ],
      next: 'anissa',
    },
    anissa: {
      lines: [
        act([{ do: 'face', actor: 'jordyn_close', facing: 'player' }, { do: 'wait', ms: 600 }], JO, 'And the little one?'),
        say(G, 'She comes. Where we go, she holds a door nobody else can hold.'),
        say(JO, 'Then she stays behind you. Every step.'),
        say(A, 'Every step.', { set: { 'story.jordyn_offer': true } }),
        act([{ do: 'exit', actor: 'jordyn_close', to: at(CLOSE.postern.x, CLOSE.postern.y - 1) }, { do: 'look', actor: 'player' }], '', 'She goes back through the postern. The bar drops behind her.'),
      ],
      next: 'after',
    },
    after: {
      lines: [
        say(Z, 'Four of them. Four of his sisters, and this one arrests people.'),
        say(G, 'She said she hasn\'t decided.'),
        say(Z, 'She\'s in the rain.'),
      ],
    },
  }),
  script('postern', {
    start: { lines: [], next: [{ if: { all: [{ flag: 'story.postern_open' }, { notFlag: 'story.caught' }] }, to: 'open' }, { to: 'barred' }] },
    barred: { lines: [nar('A small barred door in the keep\'s wall. Barred from inside.')] },
    open: { lines: [nar('The postern, unbarred. Jordyn\'s hour, for the length of the loud piece.')] },
  }),
  simple('vestry_locked', [nar('The vestry door, locked from the other side.')]),

  // ---- Beat 3: St. Agatha's; Sebastian -------------------------------------------------------------------------------
  script('sebastian_meet', {
    start: {
      lines: [
        nar('St. Agatha\'s: a long nave of pews to the oath-stone, and across the whole east end the pipes of the great organ.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:sebastian' }, { do: 'wait', ms: 500 }], '', 'In the loft a broad man in a velvet coat, sleeves pushed up, has stopped mid-phrase and turned round.'),
        act([{ do: 'walk', actor: 'npc:sebastian', to: at(CATHEDRAL.sebastian.x, CATHEDRAL.sceneRow - 1), facing: 'down', run: true }], '', 'He comes down the loft stair at a run, and stops a step short of Gianna.'),
        say(SB, 'Gianna Elise. You have your mother\'s forehead and your grandfather\'s frown.'),
        say(SB, 'And you have walked into my rehearsal, which nobody does, and I find I don\'t mind.'),
        nar('He embraces her, and holds on a moment longer than she expects.'),
      ],
      next: 'anissa',
    },
    anissa: {
      lines: [
        act([{ do: 'face', actor: 'npc:sebastian', facing: 'down' }, { do: 'wait', ms: 700 }], '', 'Then he sees Anissa, and goes down on one knee on the cold flags.'),
        say(SB, 'And this is Anissa. Who hums. Your mother wrote that you hum.', { mood: 'tender' }),
        say(SB, 'It is the only thing about either of you she has ever written to me that was not the weather.', { mood: 'tender' }),
        say(A, 'I don\'t hum.'),
        say(SB, 'Then I will listen for it anyway. I\'m your uncle Sebastian.', { mood: 'listening', set: { 'story.sebastian_met': true } }),
      ],
      next: 'help',
    },
    help: {
      lines: [
        say(SB, 'I am the Regent\'s guest for the season. He commands the Toccata on the eve of the Assize.'),
        say(SB, 'He likes loud things done in order, and the Agatha Toccata, which I wrote, is the loudest thing written for pipes.'),
        say(G, 'Tomorrow night. The loud piece. That\'s the hour we need.'),
        say(SB, 'Then I shall play the Toccata at that hour and not a bar sooner, and the slow movement after it.'),
        say(SB, 'If the Regent stands up before the end, I shall start it again from the top. He won\'t. He asked for it.'),
        say(SB, 'Nobody in this city will hear a door open while I am playing. Nobody will hear a cannon.', { mood: 'listening' }),
        say(SB, 'Your mother has written to me about the weather for twenty years. I have come to believe the weather in Zetwal is interesting.'),
      ],
    },
  }),
  script('sebastian_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.caught' }, to: 'court' }, { if: { flag: 'story.sebastian_met' }, to: 'waiting' }, { to: 'loft' }] },
    loft: { lines: [say(SB, 'Nobody comes up here during a rehearsal. Nobody. ...Well. Come on, then.')] },
    waiting: {
      lines: [...LEFT, { if: { all: [{ flag: 'side.purge_list.done' }, { flag: 'debate.aldermoor_one_hand.settled' }] }, speaker: SB, text: 'The court comes at the bell. I am ready. Are you?' }],
    },
    court: { lines: [say(SB, 'Front row. I always get the front row. I have never once wanted it less.')] },
  }),
  simple('great_organ', [nar('The great organ of St. Agatha\'s: pipes from the floor of the loft to the roof, the tallest as wide as a door.')]),
  simple('organ_console', [nar('The console: four keyboards, a hundred stops, and a pencilled note on the music desk: "Not a bar sooner."')]),
  simple('agatha_oath_stone', [nar('The oath-stone: a plain block where the Assize\'s witnesses swear. The top is worn into a hollow by hands.')]),
  simple('verger_talk', [say('verger', 'The Witness keeps the oaths of Kingsmere, and I keep the Witness\'s floor. Please don\'t drip on it.')]),

  // ---- Beat 4: the eve (the court's walk, the Almoner's turn) --------------------------------------------------------
  simple('court_walk', [
    nar('The eve of the Assize. The square\'s lamps are lit under the rain; the tea shops are shut.', { fx: 'fade' }),
    act(
      [
        { do: 'enter', actor: 'cw_regent', look: 'regent', from: at(CROSS.keep.x, CROSS.keep.y + 1), to: at(CROSS.cathedral.x + 1, CROSS.cathedral.y + 1), facing: 'up', async: true },
        { do: 'enter', actor: 'cw_rosalind', look: 'rosalind', from: at(CROSS.keep.x + 1, CROSS.keep.y + 1), to: at(CROSS.cathedral.x + 2, CROSS.cathedral.y + 2), facing: 'up', async: true },
        { do: 'enter', actor: 'cw_sealbearer', look: 'sealbearer', from: at(CROSS.keep.x, CROSS.keep.y + 2), to: at(CROSS.cathedral.x + 3, CROSS.cathedral.y + 2), facing: 'up' },
        { do: 'look', actor: 'cw_regent' },
      ],
      '',
      'The court walks across the square to St. Agatha\'s: the Regent, the council, the Sealbearers.',
    ),
    act(
      [
        { do: 'exit', actor: 'cw_regent', to: at(CROSS.cathedral.x, CROSS.cathedral.y + 1), async: true },
        { do: 'exit', actor: 'cw_rosalind', to: at(CROSS.cathedral.x + 1, CROSS.cathedral.y + 1), async: true },
        { do: 'exit', actor: 'cw_sealbearer', to: at(CROSS.cathedral.x, CROSS.cathedral.y + 1) },
        { do: 'enter', actor: 'cw_almoner', look: 'almoner', from: at(CROSS.keep.x, CROSS.keep.y + 1), to: at(CROSS.cathedral.x + 2, CROSS.cathedral.y + 1), facing: 'up' },
        { do: 'look', actor: 'cw_almoner' },
      ],
      '',
      'The Almoner comes last, with her basket. At the church door she stops.',
    ),
    act([{ do: 'face', actor: 'cw_almoner', facing: 'right' }, { do: 'wait', ms: 900 }, { do: 'exit', actor: 'cw_almoner', to: at(CROSS.keep.x, CROSS.keep.y + 1) }], '', 'She turns, and walks back to the keep.'),
    act([{ do: 'look', actor: 'player' }], H, 'She isn\'t going in.'),
    say(G, 'Then we know where she\'ll be.'),
  ]),

  // ---- Beat 5: the Toccata, the postern, the archive ------------------------------------------------------------------
  simple('recital', [
    nar('St. Agatha\'s, full: the court in the front pews, the city behind them, the constables off duty at the back.', { fx: 'fade' }),
    act(
      [
        { do: 'place', actor: 'r_regent', look: 'regent', at: at(5, 10), facing: 'up' },
        { do: 'place', actor: 'r_rosalind', look: 'rosalind', at: at(6, 10), facing: 'up' },
        { do: 'place', actor: 'r_magistrate', look: 'magistrate_al', at: at(7, 10), facing: 'up' },
        { do: 'place', actor: 'r_boy', look: 'pie_boy', at: at(16, 12), facing: 'up' },
        { do: 'place', actor: 'r_mother', look: 'pie_mother', at: at(17, 12), facing: 'up' },
        { do: 'place', actor: 'r_constable', look: 'moor_constable_c', at: at(18, 12), facing: 'up' },
        { do: 'place', actor: 'r_sebastian', look: 'sebastian', at: at(CATHEDRAL.sebastian.x, CATHEDRAL.sebastian.y), facing: 'up' },
        { do: 'look', actor: 'r_sebastian' },
      ],
      '',
      'Sebastian sits at the console with his back to the city. He lifts his hands.',
    ),
    act([{ do: 'wait', ms: 600 }, { do: 'sync' }], '', 'The first chord lands, and the whole church shakes with it.', { fx: 'shake', set: { 'story.recital_begun': true, 'story.postern_open': true } }),
    act([{ do: 'look', actor: 'r_regent' }], '', 'The Regent in the front pew, not moving. The almswomen are not here.'),
    act([{ do: 'look', actor: 'player' }], ED, 'It\'s my family\'s archive. I\'m terribly sorry; I\'m coming.'),
    say(G, 'The vestry. Quietly.'),
  ]),
  simple('sightline', [
    nar('A Sealbearer turns his lamp this way. Back to the postern, quietly.', { fx: 'fade', set: { 'travel.next': 'aldermoor-keep/postern' } }),
  ]),
  script('archive_door', {
    start: { lines: [], next: [{ if: { flag: 'story.postern_open' }, to: 'night' }, { to: 'day' }] },
    day: { lines: [nar('The archive\'s iron door, sealed in the Crown\'s violet wax with a Stillwater seal under it. A Sealbearer stands at it.')] },
    night: {
      lines: [
        act([{ do: 'walk', actor: 'edmund', to: at(KEEP.archiveDoor.x + 1, KEEP.archiveDoor.y + 1), facing: 'left' }], '', 'The iron door, sealed for the recital\'s bell. Under the Crown\'s violet wax, a Stillwater seal.'),
        say(ED, 'It\'s the family\'s seal. I\'m a Stillwater. I\'m terribly sorry.'),
        act([{ do: 'wait', ms: 700 }, { do: 'sync' }], '', 'He breaks the wax.', { set: { 'story.keep_archive_entered': true } }),
        act([{ do: 'look', actor: 'npc:night_sealbearer_a' }, { do: 'wait', ms: 600 }, { do: 'look', actor: 'player' }], '', 'Down the hall the Sealbearer at his post does not turn. The organ.'),
      ],
      next: 'inside',
    },
    inside: {
      lines: [
        nar('Over the door inside, a rule cut in the stone: FILED BY THE YEAR OF THE REIGN AND THE SEAL OF THE HOUSE THE MATTER CONCERNS.'),
        nar('Under it, smaller: Matters touching a clause are filed with the clause.'),
        say(A, 'The floor is shimmering, Gigi. I can hold the door.'),
      ],
    },
  }),
  simple('archive_not_yet', [
    say(G, 'Not yet. Thomas\'s panel. The drawer. The book.', { set: { 'travel.next': 'aldermoor-keep/archive_in' } }),
  ]),
  simple('gallery_desk', [
    nar('The gallery desk. Court Minutes of the Ratification, open where somebody left them.', { set: { 'clue.ratified_year': true } }),
    nar('"The seventh clause, ratified in the twenty-third year of the Old King, before his justiciar."'),
  ]),
  cabinetScript(1),
  cabinetScript(2),
  cabinetScript(3),
  cabinetScript(4),
  cabinetScript(5),
  cabinetScript(6),
  script('ash_shelf', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.crown_chronicle.done' }, to: 'done' },
        { if: { all: [{ flag: 'side.crown_chronicle.accepted' }, { flag: 'story.record_found' }] }, to: 'again' },
        { if: { flag: 'side.crown_chronicle.accepted' }, to: 'moved' },
        { to: 'first' },
      ],
    },
    first: {
      lines: [
        nar('The Ash Wars shelf, standing against a wainscot panel. On it: The Crown Chronicle of the Ash Wars.'),
        nar('Gianna lifts the chronicle down.', { set: { 'side.crown_chronicle.accepted': true, 'item.crown_chronicle': true } }),
        nar('"Four hundred put to the sword at the Ash Road by the Lord of Ardencia, in the Crown\'s cause."'),
        nar('On the fly-leaf, in an old man\'s hand: Written to order. The purchasing office asked for the Brasador wars large.'),
        nar('And I wrote them large. The true count is in Kirinoura. T.S.'),
        act([{ do: 'walk', actor: 'edmund', to: at(KEEP.ashShelf.x + 1, KEEP.ashShelf.y + 1), facing: 'up' }, { do: 'wait', ms: 500 }, { do: 'sync' }], '', 'Edmund puts his shoulder to the shelf and walks it a foot to the right.'),
        say(ED, 'Terribly sorry, Grandfather. Your shelf was in the way of your panel.'),
      ],
    },
    moved: { lines: [nar('The Ash Wars shelf, moved a foot to the right. The panel behind it is clear.')] },
    again: {
      lines: [
        nar('Gianna opens the chronicle at the fly-leaf again, beside the record from the panel.'),
        say(G, 'The same hand. Fifty years apart.'),
        say(H, 'The true count is in Kirinoura. We carried it out of the file house.', { set: { 'side.crown_chronicle.done': true } }),
      ],
    },
    done: { lines: [nar('The Ash Wars shelf. Its chronicle is in Gianna\'s bag, with its note: written to order.')] },
  }),
  script('archive_panel', {
    start: {
      lines: [],
      next: [{ if: { flag: 'story.record_found' }, to: 'empty' }, { if: { flag: 'anchor.thomas_record' }, to: 'open' }, { to: 'loose' }],
    },
    loose: { lines: [nar('A wainscot panel, loose at one corner. Nothing behind it that you can reach.')] },
    open: {
      lines: [
        nar('The panel gives at a touch, as if somebody had leaned on it fifty years ago.'),
        nar('Behind it, folded in four and dry: a clerk\'s copy of the Seventh Clause.', { fx: 'flash', set: { 'item.thomas_record': true, 'story.record_found': true } }),
        nar('In the margin, in a clerk\'s hand: Xaraguá was never asked. T.S.'),
        nar('At the foot: Written at a quarter to three, by the tower bell.'),
        say(ED, 'That\'s my grandfather\'s hand.'),
        say(G, 'Somebody read it.'),
      ],
    },
    empty: { lines: [nar('The space behind the panel, empty now. Thomas\'s record is in Gianna\'s hands.')] },
  }),

  // ---- The Echo: the first revisiting (the filing floor; SIG-ALM part 1's rule; the anchor) ---------------------------
  script('thomas_echo', {
    start: {
      lines: [],
      next: [{ if: { flag: 'anchor.thomas_record' }, to: 'done' }, { if: { flag: 'clue.mirror_filing' }, to: 'seen' }, { to: 'first' }],
    },
    done: { lines: [nar('The archive, fifty years ago. Thomas files by candlelight. The panel is shut on what is behind it.')] },
    seen: {
      lines: [act([{ do: 'look', actor: 'npc:echo_thomas_clerk' }], TH, 'Give it here, or don\'t. But decide, Marshal. They will open that door.')],
      next: [{ if: { flag: 'echo.record_in_hand' }, to: 'panel' }, { to: 'choose' }],
    },
    first: {
      lines: [
        nar('Fifty years ago. A season after the sealing at Eightgate.', { fx: 'fade' }),
        nar('Young Patricio waits in the Crown\'s archive under a flag of truce. The war council sits in the hall beyond the door.'),
        nar('Benny would not come under their roof. Caona is on the mere with the boat.'),
        act([{ do: 'look', actor: 'npc:echo_thomas_clerk' }], '', 'At the gallery desk a young clerk files by candlelight: the boy from the Eightgate gallery, a season older.'),
      ],
      next: 'council',
    },
    council: {
      lines: [
        say('council_voice', 'Ardencia refuses the seventh page. Aloud, in the Throne\'s own archive.'),
        { if: { flag: 'choice.patricio_protest', eq: 'time' }, speaker: 'council_voice', text: 'And the Marshal sealed the binding. Under protest of time.' },
        { if: { flag: 'choice.patricio_protest', eq: 'unread' }, speaker: 'council_voice', text: 'And the Marshal sealed the binding, and had it written that he did not read it.' },
        { if: { notFlag: 'choice.patricio_protest' }, speaker: 'council_voice', text: 'And the Marshal sealed the binding.' },
        say('council_voice', 'Then it is sealed. "To be revisited" means when we choose.'),
        say('council_voice', 'The harbor is the Crown\'s whenever the Crown cares to go and fetch it.'),
        say('council_voice', 'Clerk! The record of the seventh clause. Make it clean.'),
      ],
      next: 'rule',
    },
    rule: {
      lines: [
        say(TH, 'They file by the year of the reign and the seal of the house.'),
        say(TH, 'And when they want a thing not found, they file it in the mirror: the year backwards, under the house the lie is about.'),
        say(TH, 'We file lies in the mirror, Marshal. Everyone in this room knows it, and nobody in this room will say it.', { set: { 'clue.mirror_filing': true } }),
        act(
          [
            { do: 'enter', actor: 'echo_sb', look: 'echo_old_sealbearer', from: at(KEEP.archiveIn.x, KEEP.archiveIn.y), to: at(KEEP.thomas.x - 1, KEEP.thomas.y + 1), facing: 'up' },
            { do: 'wait', ms: 500 },
            { do: 'exit', actor: 'echo_sb', to: at(KEEP.archiveIn.x, KEEP.archiveIn.y) },
          ],
          '',
          'A Sealbearer in the old uniform comes in, lays a slip on the desk, and goes.',
        ),
        say(TH, 'Make it clean.'),
        nar('He sits very still. Then he takes a second sheet from under the first.'),
        say(TH, 'This is the true one. "Xaraguá was never asked."'),
        say(TH, 'I wrote it once in their gallery. I\'m writing it again in their archive. At a quarter to three, by that bell.'),
        say(TH, 'I can\'t be seen to touch that panel; I\'m the clerk. You\'re an envoy. Envoys lean on things.'),
      ],
      next: 'choose',
    },
    choose: {
      lines: [],
      choices: [
        { text: 'Give it here.', set: { 'choice.patricio_thomas': 'give', 'echo.record_in_hand': true }, next: 'give' },
        { text: 'You\'ll hang for this, boy.', set: { 'choice.patricio_thomas': 'hang', 'echo.record_in_hand': true }, next: 'hang' },
      ],
    },
    give: { lines: [say(TH, 'Then it\'s yours.')], next: 'panel' },
    hang: { lines: [say(TH, 'No. I\'ll be very patient. We are good at it.')], next: 'panel' },
    panel: { lines: [say(P, '(The loose panel, behind the gallery desk. Envoys lean on things.)')] },
  }),
  script('echo_panel', {
    start: { lines: [], next: [{ if: { flag: 'anchor.thomas_record' }, to: 'shut' }, { if: { flag: 'echo.record_in_hand' }, to: 'hide' }, { to: 'loose' }] },
    loose: { lines: [nar('A wainscot panel, loose at one corner.')] },
    hide: {
      lines: [
        act([{ do: 'wait', ms: 500 }, { do: 'sync' }], '', 'Patricio leans on the panel. It gives. He slides Thomas\'s sheet into the dark, and leans it shut.', {
          set: { 'anchor.thomas_record': true, 'clue.first_revisiting': true },
        }),
        act([{ do: 'look', actor: 'npc:echo_thomas_clerk' }], TH, 'The Crown\'s record will say what the Crown says. Mine will say what happened.'),
        say(TH, 'Someone will read it one day.'),
        nar('The hall door opens for the Marshal.'),
      ],
    },
    shut: { lines: [nar('The panel, shut. Thomas\'s record is behind it.')] },
  }),
  simple('echo_desk', [nar('Thomas\'s desk: the clean record, half written, and a slip that says only: Make it clean.')]),
  script('echo_thomas_clerk_talk', {
    start: { lines: [], next: [{ if: { flag: 'anchor.thomas_record' }, to: 'go' }, { if: { flag: 'echo.record_in_hand' }, to: 'panel' }, { to: 'wait' }] },
    go: { lines: [say(TH, 'Go, Marshal. They\'re opening the door.')] },
    panel: { lines: [say(TH, 'The panel. Lean on it.')] },
    wait: { lines: [say(TH, 'Not now, Marshal. They\'re listening at the door.')] },
  }),

  // ---- Beat 6: caught; the cells ---------------------------------------------------------------------------------------
  script('caught', {
    start: {
      lines: [
        nar('The hall\'s lamps come up all at once. The organ has stopped.', { fx: 'flash' }),
        act(
          [
            { do: 'place', actor: 'almoner_c', look: 'almoner', at: at(16, 12), facing: 'left' },
            { do: 'place', actor: 'alms_c1', look: 'almswoman', at: at(17, 11), facing: 'left' },
            { do: 'place', actor: 'alms_c2', look: 'almswoman_b', at: at(17, 13), facing: 'left' },
            { do: 'place', actor: 'alms_c3', look: 'almswoman', at: at(18, 12), facing: 'left' },
            { do: 'place', actor: 'alms_c4', look: 'almswoman_b', at: at(18, 10), facing: 'left' },
            { do: 'look', actor: 'almoner_c' },
          ],
          AL,
          'Put the papers down, child. Quietly.',
        ),
        say(AL, 'The Regent would so much rather you had not read them. But he did think you would.'),
        say(G, 'Who are you?'),
        say(AL, 'The Crown\'s charities.'),
        act(
          [
            { do: 'walk', actor: 'alms_c1', to: at(14, 9), async: true },
            { do: 'walk', actor: 'alms_c2', to: at(14, 11) },
          ],
          '',
          'The almswomen move. Not one of them is carrying bread.',
        ),
      ],
      next: 'little',
    },
    little: {
      lines: [
        act([{ do: 'walk', actor: 'almoner_c', to: at(14, 10), facing: 'left' }, { do: 'wait', ms: 500 }], AL, 'And there is the little one. Not in the rain, I hope.'),
        act([{ do: 'face', actor: 'player', facing: 'right' }], '', 'Gianna steps in front of her sister.'),
      ],
      next: 'jordyn',
    },
    jordyn: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'jordyn_c', look: 'jordyn', from: at(KEEP.passage.x, KEEP.passage.y - 1), to: at(12, 9), facing: 'right', run: true, async: true },
            { do: 'enter', actor: 'watch_c1', look: 'regent_watch', from: at(KEEP.passage.x + 1, KEEP.passage.y - 1), to: at(13, 12), facing: 'right', run: true, async: true },
            { do: 'enter', actor: 'watch_c2', look: 'regent_watch_b', from: at(KEEP.passage.x, KEEP.passage.y - 1), to: at(12, 11), facing: 'right', run: true },
            { do: 'look', actor: 'jordyn_c' },
          ],
          '',
          'The watch comes in from the yard at a run. Jordyn puts herself between the almswomen and the party.',
        ),
        say(JO, 'Captain of the watch. The envoy\'s household is under arrest for the Crown\'s archive.', { mood: 'mothers_jaw' }),
        act([{ do: 'wait', ms: 700 }], JO, 'Under arrest, Almoner. Not under you.', { mood: 'mothers_jaw' }),
        say(AL, 'The Regent\'s almoner does not answer to the watch.'),
        say(JO, 'No. But the Assize does, and they\'ll stand before it in the morning.'),
        say(JO, 'Envoys are tried. They are not disappeared on the heath. Not on my watch, which this is.', { mood: 'mothers_jaw' }),
        act([{ do: 'wait', ms: 1200 }], AL, 'The Assize, then. The Regent will enjoy that.', { set: { 'story.caught': true } }),
        act(
          [
            { do: 'exit', actor: 'almoner_c', to: at(KEEP.passage.x, KEEP.passage.y), async: true },
            { do: 'exit', actor: 'alms_c1', to: at(KEEP.passage.x, KEEP.passage.y), async: true },
            { do: 'exit', actor: 'alms_c2', to: at(KEEP.passage.x + 1, KEEP.passage.y), async: true },
            { do: 'exit', actor: 'alms_c3', to: at(KEEP.passage.x, KEEP.passage.y), async: true },
            { do: 'exit', actor: 'alms_c4', to: at(KEEP.passage.x + 1, KEEP.passage.y) },
          ],
          '',
          'She goes. The one who passes nearest turns her veiled head toward Anissa as she goes.',
        ),
      ],
      next: 'arrest',
    },
    arrest: {
      lines: [
        act([{ do: 'walk', actor: 'jordyn_c', to: at(11, 9), facing: 'left' }, { do: 'wait', ms: 600 }], '', 'Jordyn holds out her hand. The pact, the coded accounts, the true record and the chronicle go into it.', {
          set: intoEvidence,
        }),
        say(JO, 'Into the court\'s evidence.'),
        say(ED, 'I\'m terribly sorry, Captain.'),
        say(JO, 'Shut up, Mr. Stillwater.', { mood: 'mothers_jaw' }),
        act([{ do: 'look', actor: 'azzy' }], JO, 'Mother\'s jaw. I said.', { mood: 'mothers_jaw' }),
        nar('The watch walks them down the undercroft stair.', { fx: 'fade', set: { 'travel.next': 'aldermoor-keep/cells' } }),
      ],
    },
  }),
  script('cells_night', {
    start: {
      lines: [
        nar('The keep\'s undercroft. One cell, a lamp, a barred door. Anissa sits close against Gianna.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:sorry_constable' }], 'sorry_constable', 'I\'m sorry about all this. I\'m sorry about most things, lately.'),
        act(
          [{ do: 'enter', actor: 'sebastian_cell', look: 'sebastian', from: at(38, 26), to: at(KEEP.cellSpawn.x, KEEP.cell.y + KEEP.cell.h + 1), facing: 'up' }, { do: 'look', actor: 'sebastian_cell' }],
          '',
          'Sebastian comes down the stair with a blanket over his arm.',
        ),
        say(SB, 'The Regent gave me leave. He said, "I am not a monster, Mr. Jean-Philippe. I am a court."'),
        say(SB, 'I believe him about the second thing.'),
        say(SB, 'Whatever you took, it was worth the cathedral. I\'ll be in the gallery.', { mood: 'tender' }),
        act([{ do: 'exit', actor: 'sebastian_cell', to: at(38, 26) }], '', 'He passes the blanket through the bars, and goes back up the stair.'),
      ],
      next: 'blanket',
    },
    blanket: {
      lines: [
        nar('Gianna puts the blanket round Anissa.'),
        say(A, 'He played it twice, Gigi. The slow part.'),
        say(G, 'I know. I heard.'),
      ],
      next: 'night',
    },
    night: {
      lines: [
        nar('Night. Rain on a grate somewhere above.', { fx: 'fade' }),
        nar('At first light the watch comes for them.', { set: { 'story.assize_dawn': true, 'travel.next': 'aldermoor-keep/dock' } }),
      ],
    },
  }),
  script('cell_bench', {
    start: { lines: [], next: [{ if: { all: [{ flag: 'story.caught' }, { notFlag: 'story.assize_opened' }] }, to: 'sleep' }, { to: 'plank' }] },
    plank: { lines: [nar('A plank bench, worn by a great many people waiting.')] },
    sleep: {
      lines: [nar('A plank bench. Sleep, and wait for the court.')],
      choices: [
        { text: 'Sleep.', set: { 'story.assize_dawn': true, 'travel.next': 'aldermoor-keep/dock' }, next: 'dawn' },
        { text: 'Not yet.' },
      ],
    },
    dawn: { lines: [nar('At first light the watch comes for them.', { fx: 'fade' })] },
  }),
  simple('sorry_constable_talk', [say('sorry_constable', 'I\'m sorry. I can\'t open it. I\'m sorry about that too.')]),

  // ---- Beat 7: the Assize (SIG-ALM part 2; the Hushed unmasked; the boss) -----------------------------------------------
  script('assize_open', {
    start: {
      lines: [
        nar('The Assize of Kingsmere. The Regent on the bench, the city in the gallery, the envoy\'s household in the dock.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:al_regent' }], '', 'Anissa sits on the dock\'s bench behind Gianna, where everybody in the building can see her.'),
        act([{ do: 'look', actor: 'npc:magistrate' }], MG, 'That the envoy of Zetwal and her household, by night, broke the Crown\'s archive and took from it papers of the Crown.'),
        act([{ do: 'look', actor: 'npc:al_regent' }], RG, 'The envoy will answer under the Witness.'),
        say(RG, 'In this court a witness who swears falsely has broken an oath before the Witness. Her evidence falls with her, and she with it.'),
        say(RG, 'The envoy may press any witness and lay any evidence. The clerk keeps the evidence. Begin.'),
      ],
      next: 'witnesses',
    },
    witnesses: {
      lines: [
        say('keep_steward', 'The archive was sealed at the recital\'s bell. At the Toccata\'s end it was open, the envoy inside, the seal broken.'),
        act([{ do: 'look', actor: 'npc:almoner' }], AL, 'The paper the envoy calls a record is a forgery of her own hand.'),
        say(AL, 'The Crown\'s true record is the Rolls House\'s public edition, which every child in Kingsmere may read.'),
        say(AL, 'It shows that Xaraguá\'s cacique agreed the clause in this very court, before the Old King\'s justiciar.'),
        say(AL, 'The envoy\'s margin is a lie against the Crown, and a lie against a dead clerk.'),
        act([{ do: 'look', actor: 'npc:jordyn' }], JO, 'I found them at the panel behind the Ash Wars shelf, reading. The paper was in Thomas Stillwater\'s hand.'),
        say(JO, 'I have seen that hand. It is on my commission.'),
        act([{ do: 'look', actor: 'player' }], '', '(Press a witness or lay evidence: speak to the clerk.)'),
      ],
      next: 'hint',
    },
    hint: { lines: [say(A, 'The dock is shimmering, Gigi. Right under us.')] },
  }),
  script('ratification_echo', {
    start: { lines: [], next: [{ if: { flag: 'clue.ratification' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The same court, fifty years ago. The Old King\'s justiciar on the bench. The dock is empty.', { fx: 'fade' }),
        say('roll_clerk', 'Zetwal: present, by the Marshal\'s envoy.'),
        say('roll_clerk', 'Ardencia: present, and refusing.'),
        say('roll_clerk', 'Al-Doria: present.'),
        act([{ do: 'wait', ms: 1000 }], '', 'The clerk of that day looks at his roll, and at the empty dock.'),
        say('roll_clerk', 'Xaraguá: not present. Not sent for.'),
        say('justiciar', 'The seventh clause is ratified.', { set: { 'clue.ratification': true } }),
      ],
    },
    again: { lines: [nar('The court of fifty years ago, the roll read over an empty dock. Xaraguá: not present. Not sent for.')] },
  }),
  script('ratification_return', {
    start: { lines: [], next: [{ if: { flag: 'clue.ratification' }, to: 'patient' }, { to: 'back' }] },
    patient: { lines: [say(RG, 'The envoy was elsewhere for a moment. The court is patient.')] },
    back: { lines: [nar('The court, waiting.')] },
  }),
  script('assize_clerk_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.record_read' }, to: 'read' },
        { if: { flag: 'story.assize_opened' }, to: 'menu' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [say(CL, 'The court has not sat, envoy.')] },
    read: { lines: [say(CL, 'It is in the roll, envoy. Xaraguá was never asked.')] },
    menu: {
      lines: [
        say(CL, 'The court is listening, envoy.'),
        { if: { flag: 'assize.pressed_almoner' }, speaker: CL, text: 'The Almoner has been pressed, and has sworn to it again.' },
        { if: { flag: 'assize.roll_laid' }, speaker: CL, text: 'The roll of the court is laid.' },
        { if: { flag: 'assize.record_laid' }, speaker: CL, text: 'Thomas Stillwater\'s record is laid.' },
      ],
      choices: [
        { text: 'Press a witness.', next: 'press' },
        { text: 'Lay evidence.', next: 'lay' },
        { text: 'Not yet.' },
      ],
    },
    press: {
      lines: [say(CL, 'Which witness?')],
      choices: [
        { text: 'The steward.', next: 'steward' },
        { text: 'The Almoner.', next: 'almoner' },
        { text: 'The captain.', next: 'captain' },
        { text: 'Back.', next: 'menu' },
      ],
    },
    // Pressed once, the steward answers; again, the Regent cuts in (two nodes: a node's set lands before its lines).
    steward: { lines: [], next: [{ if: { flag: 'assize.steward_pressed' }, to: 'steward_again' }, { to: 'steward_first' }] },
    steward_first: {
      lines: [{ speaker: 'keep_steward', text: 'Sealed at the bell. Open at the end. The seal broken. I keep the keys, envoy. I know when they turn.' }],
      set: { 'assize.steward_pressed': true },
      next: 'menu',
    },
    steward_again: { lines: [say(RG, 'The envoy will come to the point. The steward is not lying; he is boring.')], next: 'menu' },
    almoner: {
      lines: [
        say(AL, 'Agreed in this very court, envoy, before the justiciar. It is in the public edition. Every child may read it.', { set: { 'assize.pressed_almoner': true } }),
        say(G, 'In this very court.'),
        say(AL, 'In this very court. I swear it again, before the Witness.'),
      ],
      next: 'check',
    },
    captain: {
      lines: [say(JO, 'Thomas Stillwater\'s hand. I have seen it on my commission. I said so under the Witness, and I keep what I say.')],
      next: 'menu',
    },
    lay: {
      lines: [say(CL, 'What does the envoy lay before the court?')],
      choices: [
        { if: { flag: 'clue.ratification' }, text: 'The roll of this court.', next: 'roll' },
        { if: { flag: 'evidence.thomas_record' }, text: 'Thomas\'s true record.', next: 'record' },
        { if: { flag: 'evidence.crown_pact' }, text: 'The Crown\'s pact.', next: 'pact' },
        { if: { flag: 'evidence.crown_chronicle' }, text: 'The Crown Chronicle.', next: 'point' },
        { text: 'Back.', next: 'menu' },
      ],
    },
    point: { lines: [say(RG, 'The envoy will come to the point.')], next: 'menu' },
    pact: {
      lines: [say(RG, 'That proves the Crown paid for a chair. Nobody in this court said it did not. The envoy will come to the point.')],
      next: 'menu',
    },
    roll: { lines: [], next: 'roll_laid' },
    record: { lines: [], next: 'record_laid' },
    roll_laid: {
      lines: [
        say(G, 'The roll of this court, the day the seventh clause was ratified. Xaraguá: not present. Not sent for.', { set: { 'assize.roll_laid': true } }),
        say(CL, 'The roll is the court\'s own. It is laid.'),
      ],
      next: 'check',
    },
    record_laid: {
      lines: [
        say(G, 'Thomas Stillwater\'s true record. It is in evidence.', { set: { 'assize.record_laid': true } }),
        say(CL, 'It is in evidence, envoy. It is laid.'),
      ],
      next: [{ if: { flag: 'assize.roll_laid' }, to: 'check' }, { to: 'word' }],
    },
    word: { lines: [say(RG, 'A margin against a public edition is a word against a word. The court needs the court.')], next: 'check' },
    check: {
      lines: [],
      next: [{ if: { all: [{ flag: 'assize.pressed_almoner' }, { flag: 'assize.roll_laid' }, { flag: 'assize.record_laid' }] }, to: 'exposure' }, { to: 'menu' }],
    },
    exposure: {
      lines: [
        say(G, 'The Crown\'s record was made clean on the night of the first revisiting, by order of this council.'),
        say(G, 'The clerk who was told to clean it hid the true one behind a panel at a quarter to three, by that tower\'s bell.'),
        say(G, 'The public edition is the clean one. Xaraguá was never asked. The roll of this court says it was never here.'),
        act([{ do: 'walk', actor: 'npc:assize_clerk', to: at(KEEP.table.x + 2, KEEP.table.y + 1), facing: 'up' }, { do: 'wait', ms: 1200 }], CL, 'It is Thomas Stillwater\'s. Both of them. The margin is older ink.'),
        act([{ do: 'look', actor: 'npc:rosalind' }, { do: 'walk', actor: 'npc:rosalind', to: at(KEEP.courtRosalind.x - 1, KEEP.courtRosalind.y), facing: 'left' }], '', 'Lady Rosalind stands.'),
        say(RO, 'A Stillwater wrote it. A Stillwater court will read it into the roll.'),
        act([{ do: 'look', actor: 'npc:al_regent' }, { do: 'wait', ms: 1400 }], RG, 'Read it.'),
        say(CL, '"Xaraguá was never asked. T.S." Read into the roll of the Assize.', { set: { 'story.record_read': true } }),
      ],
      next: 'dismiss',
    },
    dismiss: {
      lines: [
        say(RG, 'The witness is forsworn. The Assize thanks the Crown\'s almoner for her service to its charities, and dismisses her.'),
        act([{ do: 'look', actor: 'npc:almoner' }, { do: 'wait', ms: 1000 }], '', 'She does not go. She stands, and faces the dock.'),
        act(
          [
            { do: 'place', actor: 'almoner_rev', look: 'almoner', at: at(KEEP.witnessAlmoner.x, KEEP.witnessAlmoner.y), facing: 'right' },
            { do: 'sync' },
            { do: 'walk', actor: 'almoner_rev', to: at(KEEP.dock.x - 2, KEEP.dock.y - 1), facing: 'right' },
          ],
          AL,
          'Enough noise.',
          { fx: 'shake', set: { 'story.hushed_revealed': true } },
        ),
        act(
          [
            { do: 'enter', actor: 'alms_g1', look: 'almswoman', from: at(14, 27), to: at(11, 22), facing: 'left', async: true },
            { do: 'enter', actor: 'alms_g2', look: 'almswoman_b', from: at(14, 26), to: at(10, 21), facing: 'left' },
            { do: 'look', actor: 'almoner_rev' },
          ],
          '',
          'The almswomen come down the gallery stair with their veils up. The city in the gallery shrinks back.',
        ),
      ],
      next: 'anissa',
    },
    anissa: {
      lines: [
        { if: WATCHER, speaker: A, text: 'Gigi. That\'s the lady by the mill. On the cane road.' },
        { if: { not: WATCHER }, speaker: A, text: 'Gigi. She\'s the one with the basket.' },
        { if: WARNED, speaker: AL, text: 'Your sister told me to stay away from you. I did. I have been very patient.' },
        { if: { all: [WATCHER, { not: WARNED }] }, speaker: AL, text: 'Your sister asked me who I was. I told her: no one. I have been very patient.' },
        { if: { not: WATCHER }, speaker: AL, text: 'Your sister has kept you very close. I have been very patient.' },
        act([{ do: 'face', actor: 'player', facing: 'left' }], '', 'Gianna steps in front of the dock\'s bench.'),
      ],
      next: 'watch',
    },
    watch: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:jordyn', to: at(KEEP.dock.x + KEEP.dock.w + 1, KEEP.dock.y - 1), facing: 'left' }],
          JO,
          'The watch does not fight in a court. Nobody fights in a court.',
        ),
        act([{ do: 'look', actor: 'npc:al_regent' }, { do: 'wait', ms: 1000 }], '', 'The Regent\'s chin lifts a fraction. He says nothing. He does not stand.'),
        act([{ do: 'look', actor: 'almoner_rev' }], AL, 'Then I will.', { set: { 'battle.next': 'assize_hushed', 'battle.after': 'assize_after' } }),
      ],
    },
  }),
  simple('hushed_again', [
    act(
      [{ do: 'place', actor: 'almoner_rev', look: 'almoner', at: at(KEEP.dock.x - 2, KEEP.dock.y - 1), facing: 'right' }, { do: 'look', actor: 'almoner_rev' }],
      AL,
      'Enough noise.',
      { fx: 'shake' },
    ),
    nar('The veils come down the gallery stair again.', { set: { 'battle.next': 'assize_hushed', 'battle.after': 'assize_after' } }),
  ]),
  simple('evidence_table', [nar('The clerk\'s table. Laid on it in order: the pact, the coded accounts, the true record, the chronicle. The court\'s evidence.')]),
  simple('oath_block', [nar('A Witness\'s oath-block, twin to the stone in St. Agatha\'s. In this court, the law is an oath.')]),
  simple('court_watch_talk', [say('regent_watch', 'The court will wait, envoy. Mend. Nobody leaves while it sits.')]),
  simple('pie_boy_talk', [say('pie_boy', 'I\'m not pressed. Mr. Stillwater hit him. I\'m allowed to watch, the captain said.')]),
  simple('printer_gallery_talk', [say(PR, 'Every word, envoy. I\'m taking down every word. A thing that\'s printed can\'t be quiet.')]),
  simple('clockmaker_talk', [say('clockmaker', 'A quarter to three, the record said? By the tower bell? I want a look at that record, after.')]),
  simple('gaze_exile_gallery_talk', [say('gaze_exile', 'The goddess watches. Today, so does Kingsmere.')]),
  script('assize_after', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'almoner_bare', look: 'almoner_unveiled', at: at(KEEP.dock.x + 1, KEEP.dock.y - 1), facing: 'up' },
            { do: 'look', actor: 'almoner_bare' },
          ],
          '',
          'The veil is off. A plain woman of sixty, grey hair pinned up, the Crown\'s charities\' brooch at her throat.',
        ),
        { if: WATCHER, speaker: AL, text: 'You wanted a face. No one. I told you on the cane road. That is the point of us.' },
        { if: { not: WATCHER }, speaker: AL, text: 'You wanted a face. It is no one\'s. That is the point of us.' },
        act([{ do: 'walk', actor: 'npc:jordyn', to: at(KEEP.dock.x + 2, KEEP.dock.y - 2), facing: 'down' }], '', 'The watch takes her arms.'),
      ],
      next: 'commission',
    },
    commission: {
      lines: [
        nar('Jordyn takes a folded paper from the Almoner\'s sleeve and reads its head, once, flat.'),
        say(JO, '"To the Crown\'s almoner, the keeping of the quiet." Under the Throne\'s seal. No hand.'),
        act([{ do: 'look', actor: 'npc:al_regent' }], RG, 'The Throne\'s seal is on half the paper in this building. The Crown keeps no almoner.', { set: { 'clue.hushed_regent': true } }),
      ],
      choices: [
        { text: 'Try her here, by your law.', set: { 'choice.hushed_tried': true }, next: 'tried' },
        { text: 'Let the city see her face.', set: { 'choice.hushed_broken': true }, next: 'broken' },
      ],
    },
    tried: {
      lines: [
        say(G, 'She swore falsely before the Witness. Try her for it, here, by your own law.'),
        say(JO, 'By the book.'),
        nar('The Regent does not object. That is its own answer.'),
      ],
      next: 'names',
    },
    broken: {
      lines: [
        say(BY, 'Let the city look at her face. All of it. Then take her down.'),
        nar('The gallery looks. Nobody looks away.'),
      ],
      next: 'names',
    },
    names: {
      lines: [
        say(AL, 'I was given the cells. I was never told by whom they were made. Nobody is.'),
        act([{ do: 'exit', actor: 'almoner_bare', to: at(KEEP.courtDoor.x, KEEP.courtDoor.y + 1) }], '', 'The watch takes her down to the cells.'),
      ],
      next: 'ruling',
    },
    ruling: {
      lines: [
        act([{ do: 'look', actor: 'npc:al_regent' }], RG, 'The charge against the envoy is withdrawn. The Crown does not try its guests in a court that has been... interrupted.'),
        say(RG, 'The envoy\'s household will leave Kingsmere by the morning tide. The fleet sails after it.'),
        say(RG, 'Mr. Stillwater will remain in his mother\'s house.'),
        act([{ do: 'walk', actor: 'edmund', to: at(KEEP.dock.x + 1, KEEP.dock.y - 2), facing: 'up' }], ED, 'I\'m terribly sorry, my lord. I\'m going with them.', { set: { 'story.edmund_defied': true } }),
        say(RG, 'Your mother sits on my council.'),
        act([{ do: 'look', actor: 'npc:rosalind' }, { do: 'wait', ms: 900 }], RO, 'Sat.', { set: { 'story.rosalind_withdrew': true } }),
      ],
      next: 'jordyn',
    },
    jordyn: {
      lines: [
        act([{ do: 'walk', actor: 'npc:jordyn', to: at(KEEP.table.x + 1, KEEP.table.y + 1), facing: 'up' }, { do: 'wait', ms: 700 }], '', 'Jordyn unpins her captain\'s knot and lays it on the clerk\'s table.'),
        say(JO, 'Captain of the watch, resigning. The watch is dismissed.', { mood: 'resigning' }),
        act(
          [
            ...[at(10, 21), at(11, 21), at(12, 21), at(10, 22), at(11, 22), at(12, 22)].map(
              (p, i): StageCue => ({ do: 'enter', actor: `watch_r${i + 1}`, look: 'regent_watch', from: at(KEEP.courtDoor.x, KEEP.courtDoor.y + 1), to: p, facing: 'left', async: i < 5 }),
            ),
            { do: 'look', actor: 'watch_r1' },
          ],
          '',
          'Six of the watch step out of their line, and stand behind her.',
        ),
        act([{ do: 'look', actor: 'npc:al_regent' }], RG, 'You will hang, Captain.'),
        say(JO, 'Then try me. I\'ll stand in that dock. It is the only honest place in this building.', { mood: 'resigning' }),
        act([{ do: 'wait', ms: 1200 }], RG, 'Not today. The court has been interrupted enough.', { set: { 'story.jordyn_defected': true } }),
      ],
      next: 'tide',
    },
    tide: {
      lines: [nar('By the morning tide.', { fx: 'fade', set: { 'story.hushed_beaten': true, 'travel.next': 'aldermoor-heath/mere_stair' } })],
    },
  }),

  // ---- Beat 8: the price at dawn on the Mere Stair --------------------------------------------------------------------
  script('ald_price_scene', {
    start: {
      lines: [
        nar('Dawn on the Mere Stair. The rain has stopped. The mere is the colour of a knife.', { fx: 'fade' }),
        act(
          [
            ...[at(10, 13), at(11, 14), at(12, 13), at(13, 14), at(14, 13), at(15, 14)].map(
              (p, i): StageCue => ({
                do: 'enter',
                actor: `diss_${i + 1}`,
                look: ['printer', 'clockmaker', 'moor_constable', 'pie_boy', 'pie_mother', 'gaze_exile'][i]!,
                from: at(22 + i, HEATH.roadRows[i % 2]),
                to: p,
                facing: 'left',
                async: i < 5,
              }),
            ),
            { do: 'look', actor: 'diss_1' },
          ],
          '',
          'Down the heath road from the Moor Gate the dissidents come: the printer, the clockmaker, the constable without his coat.',
        ),
        nar('The families from the Cross behind them, and the Gaze exile in her faded sun shawl.'),
        act(
          [
            { do: 'enter', actor: 'jordyn_d', look: 'jordyn', from: at(30, HEATH.roadRows[0]), to: at(16, HEATH.roadRows[0]), facing: 'left', async: true },
            ...[at(17, 13), at(18, 13), at(19, 13), at(17, 14), at(18, 14), at(19, 14)].map(
              (p, i): StageCue => ({ do: 'enter', actor: `watch_d${i + 1}`, look: 'watch_inside_out', from: at(31 + i, HEATH.roadRows[i % 2]), to: p, facing: 'left', async: i < 5 }),
            ),
            { do: 'look', actor: 'jordyn_d' },
          ],
          '',
          'Then Jordyn, with six of the watch, their violet coats turned inside out.',
        ),
        act([{ do: 'enter', actor: 'sebastian_d', look: 'sebastian', from: at(26, HEATH.roadRows[1]), to: at(9, HEATH.roadRows[1]), facing: 'left' }], '', 'Sebastian last, in his velvet coat, not hurrying.'),
      ],
      next: 'price',
    },
    price: {
      lines: [
        act([{ do: 'look', actor: 'diss_1' }], PR, 'We don\'t want gold and we don\'t want a speech. We want the almswomen afraid to come to our doors.'),
        say(PR, 'Count what you\'ve done to make them so.'),
        say(PR, 'The cells will hear that the head they knelt to fell in a Stillwater court, in front of the city.'),
        say(PR, 'Seven of the Regent\'s own watch walked out in front of the Regent.'),
        say(PR, 'And the list is set in type. Every name on it, and the thumb on its cover. By noon it\'s on every door in the Cross.'),
        { if: { flag: 'choice.hushed_broken' }, speaker: PR, text: 'And the whole city has seen her face. They\'re afraid of us now. That\'s paid.' },
        { if: { notFlag: 'choice.hushed_broken' }, speaker: PR, text: 'Not afraid enough. Not yet. Your Muster can collect the rest.' },
        say(PR, 'And the council\'s own boy is leaving with the envoy. The Crown will read that, too.', { set: { 'ally.aldermoor_dissidents': true, 'army.aldermoor': 7 } }),
      ],
      next: 'evidence',
    },
    evidence: {
      lines: [
        act([{ do: 'walk', actor: 'jordyn_d', to: at(7, HEATH.roadRows[0]), facing: 'left' }], JO, 'The charge was withdrawn. Evidence in a withdrawn charge goes back to whoever it was taken from.'),
        say(JO, 'That is the book.'),
        nar('She hands Gianna the bundle: the pact, the coded accounts, the true record, the chronicle.', { set: backFromEvidence }),
      ],
      next: 'jordyn',
    },
    jordyn: {
      lines: [
        say(JO, 'I\'m not sailing with you. A company walks; it doesn\'t sit in a trader\'s hold.'),
        say(JO, 'Seven of the watch and the barn\'s lot, by the moor road to the coast and a ship I\'ll find. We\'ll be at your Muster.'),
        say(Z, 'Titi—'),
        say(JO, 'And I\'ll bring Mother. And her mother. Don\'t ask from where; you\'d only write it down.'),
        act([{ do: 'face', actor: 'jordyn_d', facing: 'player' }], JO, 'He wrote to me once in twenty years. One line: "Keep the law." I have.'),
      ],
      next: 'jordyn_anissa',
    },
    jordyn_anissa: {
      lines: [
        act([{ do: 'walk', actor: 'jordyn_d', to: at(6, HEATH.roadRows[1]), facing: 'left' }, { do: 'wait', ms: 600 }], '', 'She crouches to Anissa\'s height, as Edmund did.'),
        say(JO, 'You named her in a court full of people who wanted you quiet.'),
        say(JO, 'That\'s the bravest thing I\'ve seen in that building. Don\'t do it again without me there.'),
        act(
          [
            { do: 'exit', actor: 'jordyn_d', to: at(30, HEATH.roadRows[0]), async: true },
            ...Array.from({ length: 6 }, (_, i): StageCue => ({ do: 'exit', actor: `watch_d${i + 1}`, to: at(31 + i, HEATH.roadRows[i % 2]), async: true })),
            ...Array.from({ length: 6 }, (_, i): StageCue => ({ do: 'exit', actor: `diss_${i + 1}`, to: at(22 + i, HEATH.roadRows[i % 2]), async: i < 5 })),
            { do: 'look', actor: 'player' },
          ],
          '',
          'She goes up the road with her seven. The dissidents go with them.',
        ),
      ],
      next: 'sebastian',
    },
    sebastian: {
      lines: [
        act([{ do: 'walk', actor: 'sebastian_d', to: at(7, HEATH.roadRows[1]), facing: 'left' }], SB, 'I have a recital at Eightgate in a month, by the Regent\'s command, which he gave before he knew what I was.'),
        say(SB, 'I am going to play it, very loud. Then I am coming to Pòdlimyè to hear the drums. I was always somewhere being famous.'),
      ],
      next: 'sebastian_anissa',
    },
    sebastian_anissa: {
      lines: [
        say(SB, 'I am told you held a door for an hour. I have never held anything that long but a note.', { mood: 'tender' }),
        say(A, 'I counted.'),
        nar('He gives her the recital\'s bill from his coat. She keeps it.', { set: { 'item.recital_bill': true } }),
        act([{ do: 'exit', actor: 'sebastian_d', to: at(26, HEATH.roadRows[1]) }], '', 'He goes back up the road to the city, to practise for Eightgate.'),
      ],
      next: 'clock',
    },
    clock: {
      lines: [
        act([{ do: 'enter', actor: 'clockmaker_d', look: 'clockmaker', from: at(20, HEATH.roadRows[0]), to: at(8, HEATH.roadRows[0]), facing: 'left' }], 'clockmaker', 'That record says a quarter to three, by the tower bell.'),
        say('clockmaker', 'The tower clock stopped the night it was written. I\'d give a year to know the hour.'),
        act([{ do: 'exit', actor: 'clockmaker_d', to: at(20, HEATH.roadRows[0]) }], '', 'The trader\'s boat is at the stair.'),
      ],
    },
  }),
  script('ald_stair_end', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:salkhi_heath' }], SK, 'Rain, and then no rain. I was promised grass in four countries. I am going home to a horse-fair that is not mine.'),
        act([{ do: 'look', actor: 'edmund' }], ED, 'I\'ve never been south. Is it warm? It is, isn\'t it. I\'ve packed tea.'),
        nar('The Zetwal trader: out of the mere\'s mouth, south down the grey coast, then east, by every shore that spoke for them.'),
        say(G, 'Home.', { fx: 'fade', set: { 'act9.complete': true, 'travel.next': 'zetwal-harbor/harbor_return', 'voyage.next': 'aldermoor_zetwal' } }),
      ],
    },
  }),

  // ---- Al-3 The Purge List: the printer, the bog chapel, the list, three doors, the press ----------------------------------
  script('printer_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.purge_list.done' }, to: 'done' },
        { if: { flag: 'story.families_warned' }, to: 'press' },
        { if: { flag: 'item.purge_list' }, to: 'warn' },
        { if: { flag: 'side.purge_list.accepted' }, to: 'waiting' },
        { if: { flag: 'story.regent_refused' }, to: 'meet' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [say(PR, 'The press is busy, and I don\'t know you. Come back with somebody I do.')] },
    meet: {
      lines: [
        act([{ do: 'look', actor: 'npc:printer' }], PR, 'Edmund. You\'ve brought me an envoy. I\'ve been expecting one since the first family went quiet.'),
        say(ED, 'Sir. This is Gianna. Of Zetwal.'),
        say(PR, 'The almswomen have a list. Names, streets, the word "quiet" beside each.'),
        say(PR, 'They carry it to the bog chapel at dusk and read it to the veils, who kneel there to the Hushed.'),
        say(PR, 'The next night a door on that list has a family behind it that can\'t say its own name.'),
        say(PR, 'I want the list. I\'ll print it. A thing that\'s printed can\'t be quiet.', { set: { 'side.purge_list.accepted': true } }),
      ],
    },
    waiting: { lines: [say(PR, 'The bog chapel, south of the road, down the causeway. The veils kneel there at dusk.')] },
    warn: {
      lines: [
        say(PR, 'You have it. Warn the three on the Cross first, before you bring it to me.'),
        say(PR, 'The pie shop. The tea shop with the shut door. The constable\'s house on the east side.'),
      ],
    },
    press: {
      lines: [
        act([{ do: 'walk', actor: 'npc:printer', to: at(HEATH.press.x + 2, HEATH.press.y + 1), facing: 'up' }, { do: 'wait', ms: 600 }], '', 'The printer takes the list and sets the first line in type. The apprentices start the press.'),
        say(PR, 'By noon tomorrow. Every door.', { set: { 'side.purge_list.done': true } }),
      ],
    },
    done: { lines: [say(PR, 'Every name on it, and the thumb on its cover. A thing that\'s printed can\'t be quiet.')] },
  }),
  simple('apprentice_talk', [say('apprentice', 'We don\'t talk while the press is going. We don\'t talk much when it isn\'t, either.')]),
  script('bog_chapel', {
    start: { lines: [], next: [{ if: { flag: 'story.chapel_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The bog chapel at dusk: no roof, a lantern on the altar-stone, and the veils kneeling to the Hushed\'s word.'),
        act([{ do: 'look', actor: 'npc:chapel_veil_a' }, { do: 'face', actor: 'npc:chapel_veil_a', facing: 'up' }, { do: 'face', actor: 'npc:chapel_veil_b', facing: 'up' }], '', 'The veils turn, all together, the way birds do.'),
        act([{ do: 'place', actor: 'cell_zealot', look: 'quiet_crown_m_deep', at: at(HEATH.chapelGap.x, HEATH.chapelGap.y + 1), facing: 'up' }], 'zealot', 'The little one glows, they say. Even in the rain.', { set: { 'story.chapel_seen': true } }),
        say(BY, 'Then come and look.', { set: { 'battle.next': 'bog_chapel_cell', 'battle.after': 'chapel_after' } }),
      ],
    },
    again: {
      lines: [
        act([{ do: 'look', actor: 'npc:chapel_veil_a' }], '', 'The veils are kneeling again. They turn, all together.'),
        say(BY, 'Again, then.', { set: { 'battle.next': 'bog_chapel_cell', 'battle.after': 'chapel_after' } }),
      ],
    },
  }),
  simple('chapel_after', [
    nar('The veils are gone into the bog. On the chapel\'s altar-stone, under the lantern: a list.', { set: { 'item.purge_list': true } }),
    nar('Names and streets in a clerk\'s neat hand, "quiet" beside each. At its head: By the Hushed\'s word.'),
    nar('On its cover note: a grey thumbprint, pressed in ash, and three words in another hand. Warn them first.'),
    say(H, 'The list is the almoner\'s. The thumb is not. Somebody inside the cells sent this out ahead of them.'),
    say(S, 'Bread, oil, water, grain, paper, files, oil again, and now a list. Eight cities.', { set: { 'clue.list_leaked': true } }),
  ]),

  // ---- The Rolls House ----------------------------------------------------------------------------------------------------
  simple('rolls_keeper_talk', [say('rolls_keeper', 'The Crown\'s public rolls. Read anything you like; it has all been made suitable.')]),
  simple('rolls_closed_shelf', [nar('A shelf behind a brass grille: THE CROWN\'S RESTRICTED ROLLS. The grille is locked, and so is the keeper\'s face.')]),
];

export { LEFT };
