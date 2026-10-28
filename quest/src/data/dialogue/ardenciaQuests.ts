// Chapter 3's three side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md Ar-3, Ar-4 and Ar-5, SECRET-ITEMS.md 5): The Elders' Feast (the contract board, the elders' table, Elder
// Ferrán's salt tax: his blades and his strongroom, or the hall's own book and three questions), The Old Lord's Errand
// (secret: old Benny's promise in the crypt under the chapel, the cloister crossed in two eras, La Promesa de Benny, the
// letter) and The Arrows Missed (five of Azzy's company at the strand camp; three saw every shot land wide).
//
// The owner's rules: shown, not told (the servants carry the feast in, the blades step out of the door and run, Zelia
// unlocks the stair, young Benny lays the letter in the box, Azzy walks down to the water); Anissa never jokes and is
// never touched; no Rael clue before the Turn beyond the guide's own (the arrows missed, as the camp already says; old
// Benny says nothing of his son that reads one way only, and never "your father": Gianna does not know yet).

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueBranch, DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { ARROW_SOLDIERS, CAMP, ERRAND, ERRAND_HINTS, FEAST, FEAST_FLAGS, TRIAL_MORNING, WATCHES, watchGuard } from '../ardencia.ts';

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
const P = 'patricio';
const FE = 'ferran';
const FB = 'free_brasador';

// ---- Ar-3 The Elders' Feast ----------------------------------------------------------------------------------------

const F = FEAST_FLAGS;
/** The way in from the hall of audience: the servants and the steward come through the elders' hall door. */
const HALL_SIDE = at(13, 7);

/** Three questions over the table (the Influence route): the hall's own book wins the first two, the Lower Town the last. */
const FEAST_ROUNDS: readonly { claim: string; answers: readonly { appeal: string; text: string; says: string; wins: boolean }[] }[] = [
  {
    claim: 'The salt pays for the walls, envoy. A little sticks to the hands that carry it. That is not theft. That is weight.',
    answers: [
      { appeal: 'Scripture', text: 'The Witness weighs it.', says: 'Every elder swears on the Witness\'s scale. Your hand is on it now.', wins: false },
      { appeal: 'Reason', text: 'The gate counts; you don\'t.', says: 'The gate counts every cart in. The hall writes twelve in the hundred less. Your initial is in the margin.', wins: true },
      { appeal: 'Compassion', text: 'The poor eat soup.', says: 'The Lower Town eats soup from a cook who will not say who pays. It is not you.', wins: false },
    ],
  },
  {
    claim: 'Nine years, and the Lord never once asked. If he does not mind, child, why should you?',
    answers: [
      { appeal: 'Compassion', text: 'The carters mind.', says: 'The salt-carters mind. They are paid by the cart the hall says came in.', wins: false },
      { appeal: 'Reason', text: 'He signs what you total.', says: 'He signs the totals you send him. Your book has the gate\'s count beside yours. Anyone can add.', wins: true },
      { appeal: 'Scripture', text: 'She sees the scale.', says: 'The goddess watches the scale, elder, whether the Lord does or not.', wins: false },
    ],
  },
  {
    claim: 'And if I put it back? What does Cenizal say of an elder who puts back what he took?',
    answers: [
      { appeal: 'Reason', text: 'That the sums balance.', says: 'That the sums balance. Nobody remembers a sum that balances.', wins: false },
      { appeal: 'Scripture', text: 'That the oath held.', says: 'That the oath you swore on the iron held. Late.', wins: false },
      { appeal: 'Compassion', text: 'He paid before asked.', says: 'That you paid it back before anyone made you. Today, at this table, where they can see it.', wins: true },
    ],
  },
];

function feastRoundNodes(): Record<string, DialogueNode> {
  const nodes: Record<string, DialogueNode> = {};
  FEAST_ROUNDS.forEach((round, i) => {
    nodes[`q_${i}`] = {
      lines: [say(FE, round.claim)],
      choices: round.answers.map((a, k): DialogueChoice => ({ text: `(${a.appeal}) ${a.text}`, next: `q_${i}_${k}` })),
    };
    round.answers.forEach((a, k) => {
      nodes[`q_${i}_${k}`] = {
        lines: [say(G, a.says), nar(a.wins ? 'The other elders stop eating.' : 'Elder Ferrán smiles, and pours himself more wine.', { set: { [`side.feast.q_${i}`]: a.wins } })],
        next: i < FEAST_ROUNDS.length - 1 ? `q_${i + 1}` : 'verdict',
      };
    });
  });
  const q = FEAST_ROUNDS.map((_, i) => f(`side.feast.q_${i}`));
  const two: Condition = { any: [all(q[0]!, q[1]!), all(q[0]!, q[2]!), all(q[1]!, q[2]!)] };
  nodes.verdict = { lines: [], next: [{ if: two, to: 'won' }, { to: 'lost' }] };
  nodes.won = {
    lines: [
      say(FE, '...Ink. Somebody bring me ink. I will write it back in my own hand, since my hand is the one in the margin.'),
      act([{ do: 'walk', actor: 'npc:ard_elder_b', to: at(4, 6), facing: 'left' }], 'ard_elder', 'Nine years, Ferrán. And you laughed at the guard.'),
      say(FE, 'The guard can read. Nobody told me the guard could read.', { set: { [F.influence]: true, [F.done]: true } }),
    ],
  };
  nodes.lost = { lines: [say(FE, 'A clever child with a book. Come back when the book says something new, envoy.')] };
  return nodes;
}

const FEAST_DIALOGUE: DialogueScript[] = [
  // The contract board on the plaza: the feast's notice, the morning of the trial.
  script('feast_board', {
    start: {
      lines: [],
      next: [
        { if: f(F.done), to: 'done' },
        { if: f(F.accepted), to: 'taken' },
        { if: TRIAL_MORNING, to: 'offer' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('The contract board: iron wanted, a cart for hire, a reward for a lost goat.')] },
    offer: {
      lines: [
        nar('The contract board: iron wanted, a cart for hire, a reward for a lost goat.'),
        nar('Pinned over the rest: "DISCREET GUARDS WANTED. The elders\' feast, this morning. Good pay. Hear nothing." The steward\'s seal.'),
        say(Y, 'Good pay for hearing nothing. In Yucayeque we call that a spy.'),
        say(G, 'In Cenizal they call it a guard.'),
      ],
      choices: [{ text: 'Take the job.', set: { [F.accepted]: true }, next: 'yes' }, { text: 'Not now.' }],
    },
    yes: { lines: [nar('(The Elders\' Feast is in the Quests page of the menu.)')] },
    taken: { lines: [nar('The feast\'s notice, with a line through it: the job is taken.')] },
    done: { lines: [nar('A new notice: "Elder Ferrán regrets that he will not sit today. He is counting."')] },
  }),
  // At the elders' hall door: the steward posts the guard, the servants carry the feast in, Ferrán boasts.
  script('feast_guard', {
    start: {
      lines: [
        act(
          [
            { do: 'look', actor: 'feast_steward' },
            { do: 'enter', actor: 'feast_steward', look: 'hall_steward', from: HALL_SIDE, to: at(11, 6), facing: 'left' },
            { do: 'look', actor: 'player' },
          ],
          'feast_steward',
          'You are the guard? Stand inside the door. Hear nothing. That is the whole of the job.',
        ),
        act(
          [
            { do: 'enter', actor: 'servant_a', look: 'ard_villager_f', from: HALL_SIDE, to: FEAST.table[0]!, facing: 'up', async: true },
            { do: 'enter', actor: 'servant_b', look: 'ard_villager', from: at(13, 8), to: FEAST.table[2]!, facing: 'up' },
            { do: 'wait', ms: 500 },
          ],
          '',
          'Servants carry in the feast: black bread, roast kid, a dish of peppers, a jug of wine for every elder.',
        ),
        say(FE, 'To the Lord\'s law. And to the salt tax, which is so generous to the law\'s friends.'),
        act([{ do: 'face', actor: 'npc:ard_elder_b', facing: 'left' }], 'ard_elder', 'Ferrán. The guard.'),
        say(FE, 'The guard is a child in a hat. Twelve in every hundred, nine years, and the Lord never once looked at the salt.'),
        say(FE, 'He looks at the Crown. Let him. Mine is under my own stair, on the plaza, where it does nobody any harm.'),
        say(A, 'Gigi. He is stealing. He said it out loud.'),
        act(
          [
            { do: 'exit', actor: 'servant_a', to: HALL_SIDE, async: true },
            { do: 'exit', actor: 'servant_b', to: at(13, 8), async: true },
            { do: 'exit', actor: 'feast_steward', to: HALL_SIDE },
          ],
          '',
          'The servants clear the plates. The steward goes out after them without a look at the door.',
        ),
        say(G, '(Twelve in the hundred, nine years. Under his stair on the plaza. Or in the hall\'s salt-tax book, in the records room.)', { set: { [F.heard]: true } }),
        say(Y, 'We could knock.'),
        say(G, 'Or we could read.'),
      ],
    },
  }),
  // The records room: the hall's own salt-tax book.
  script('salt_tax_book', {
    start: { lines: [], next: [{ if: f(F.book), to: 'read' }, { if: f(F.heard), to: 'find' }, { to: 'dull' }] },
    dull: { lines: [nar('The salt-tax book of Cenizal: what the salt brought in, season by season. The hand is neat. The sums are dull.')] },
    find: {
      lines: [
        nar('The salt-tax book. Every season, two counts: the gate\'s carts, and the hall\'s total. They never agree.'),
        nar('Twelve in every hundred short, nine years running. In the margin, each time, the same small initial: F.', { set: { [F.book]: true } }),
        say(G, 'Enough to ask him at his own table.'),
      ],
    },
    read: { lines: [nar('The salt-tax book. Twelve in the hundred, nine years, initialled F.')] },
  }),
  // Ferrán's door on the plaza: his hired blades come out (the Fear route).
  script('ferran_door', {
    start: {
      lines: [],
      next: [
        { if: f(F.done), to: 'done' },
        { if: f(F.tally), to: 'open' },
        { if: all(f(F.heard), not('story.noon')), to: 'knock' },
        { to: 'shut' },
      ],
    },
    shut: { lines: [nar('A grey door, barred. The house of one of the elders.')] },
    knock: {
      lines: [
        act(
          [
            { do: 'look', actor: 'blade_a' },
            { do: 'enter', actor: 'blade_a', look: 'road_bandit', from: FEAST.ferranDoor, to: at(FEAST.ferranStep.x - 1, FEAST.ferranStep.y), facing: 'right', async: true },
            { do: 'enter', actor: 'blade_b', look: 'road_bandit', from: FEAST.ferranDoor, to: at(FEAST.ferranStep.x + 1, FEAST.ferranStep.y), facing: 'left' },
            { do: 'look', actor: 'player' },
          ],
          'hired_blade',
          'The elder is at his feast. The house is shut. Run along, little guard.',
        ),
      ],
      choices: [
        { text: 'Go in anyway.', set: { 'battle.next': 'feast_blades', 'battle.after': 'ferran_blades_after' }, next: 'fight' },
        { text: 'Leave it.', next: 'leave' },
      ],
    },
    fight: { lines: [say(Y, 'They are paid to stand here. We are not. Move.', { fx: 'shake' })] },
    leave: { lines: [act([{ do: 'exit', actor: 'blade_a', to: FEAST.ferranDoor, async: true }, { do: 'exit', actor: 'blade_b', to: FEAST.ferranDoor }], '', 'The blades step back inside. The bar drops.')] },
    open: { lines: [nar('The door hangs open on one hinge. Nobody is guarding it now.')] },
    done: { lines: [nar('The door is shut and barred again. Somebody inside is counting, very quietly.')] },
  }),
  // After the blades are beaten: they run; Yari goes in and comes out with the tally.
  script('ferran_blades_after', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'blade_a', look: 'road_bandit', at: at(FEAST.ferranStep.x - 1, FEAST.ferranStep.y), facing: 'right' },
            { do: 'place', actor: 'blade_b', look: 'road_bandit', at: at(FEAST.ferranStep.x + 1, FEAST.ferranStep.y), facing: 'left' },
            { do: 'exit', actor: 'blade_a', to: at(1, 13), run: true, async: true },
            { do: 'exit', actor: 'blade_b', to: at(1, 14), run: true },
          ],
          '',
          'The blades take their pay to the Lower Town at a run. Nobody pays them to come back.',
        ),
        act(
          [
            { do: 'place', actor: 'yari', look: 'yari', at: at(FEAST.ferranStep.x + 1, FEAST.ferranStep.y + 1), facing: 'up' },
            { do: 'look', actor: 'yari' },
            { do: 'exit', actor: 'yari', to: FEAST.ferranDoor },
            { do: 'wait', ms: 900 },
            { do: 'enter', actor: 'yari', look: 'yari', from: FEAST.ferranDoor, to: at(FEAST.ferranStep.x + 1, FEAST.ferranStep.y), facing: 'left' },
            { do: 'look', actor: 'player' },
          ],
          Y,
          'Under the stair. A chest of salt silver, and a little book in his own hand. He counts very neatly.',
          { set: { [F.tally]: true } },
        ),
        say(G, 'Twelve in every hundred, for nine years. He is still at the feast.'),
      ],
    },
  }),
  // Elder Ferrán at the elders' table (the first seat): the shared elders' line until the feast; then the reckoning.
  script('ferran_talk', {
    start: {
      lines: [],
      next: [
        { if: f(F.done), to: 'after' },
        { if: all(f(F.heard), f(F.tally), not('story.noon')), to: 'tally' },
        { if: all(f(F.heard), f(F.book), not('story.noon')), to: 'ask' },
        { if: all(f(F.heard), not('story.noon')), to: 'waiting' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('ard_elder', 'The elders sit, envoy. The Lord decides. We are the part of the law that nods.')] },
    waiting: { lines: [say(FE, 'The guard\'s place is at the door, child. Guarding it.')] },
    ask: {
      lines: [act([{ do: 'face', actor: 'npc:ard_elder_a', facing: 'player' }], FE, 'The guard again. Have you come to be paid, or to be clever?')],
      choices: [{ text: 'Ask him about the salt tax.', next: 'q_0' }, { text: 'Not now.' }],
    },
    tally: {
      lines: [
        act([{ do: 'face', actor: 'npc:ard_elder_a', facing: 'player' }], G, 'Your tally, elder. From under your stair. Your blades took their pay and ran.'),
        say(FE, '...That is my hand.'),
        act([{ do: 'walk', actor: 'npc:ard_elder_b', to: at(4, 6), facing: 'left' }], 'ard_elder', 'Nine years, Ferrán?'),
        say(FE, 'The Lord never looked.'),
        say(G, 'I looked.'),
        act(
          [{ do: 'walk', actor: 'npc:ard_elder_a', to: at(FEAST.guardPost.x - 1, FEAST.guardPost.y), facing: 'right' }],
          '',
          'Elder Ferrán gets up from the feast, takes a key from his belt and puts it in Gianna\'s hand.',
        ),
        say(FE, 'It goes back. All of it. Give that to the steward, and do not tell me where she puts it.', { set: { [F.fear]: true, [F.done]: true } }),
        say(A, 'His hands are shaking, Gigi.'),
      ],
    },
    after: { lines: [say(FE, 'I am counting what I owe, envoy. It is a long count. Go and lose your trial.')] },
    ...feastRoundNodes(),
  }),
];

// ---- Ar-4 The Old Lord's Errand (S-ARD) --------------------------------------------------------------------------------

const E = ERRAND;
const TO_GATE = { 'travel.next': `ardencia-chapel/cloister_gate` };

/** Old Benny's errand, as branches and nodes of his own conversation (data/dialogue/ardencia.ts benny_old_talk). */
export const ERRAND_BENNY_BRANCHES: readonly DialogueBranch[] = [
  { if: f(E.done), to: 'errand_after' },
  { if: all(f(E.promise), not(E.done)), to: 'errand_back' },
  { if: all(f(E.accepted), not('story.trial_fought')), to: 'errand_wait' },
  { if: all(f('side.treasurer.done'), not(E.accepted), not('story.trial_fought')), to: 'errand' },
];

export const ERRAND_BENNY_NODES: Readonly<Record<string, DialogueNode>> = {
  errand: {
    lines: [
      act([{ do: 'face', actor: 'npc:benny_old', facing: 'player' }], 'benny_old', 'Envoy. One errand, before you go and lose to my son. An old fool cannot run it himself.', { mood: 'wry' }),
      say('benny_old', 'Under the chapel there is a crypt. In the crypt, an iron box. In the box, a promise I wrote before my son was born.'),
      say('benny_old', 'Nobody has read it. I would like it read, by somebody young, while I can still hear it.'),
      act([{ do: 'walk', actor: 'npc:nancy', to: at(4, 16), facing: 'left' }], 'nancy', 'Benny. The crypt is the Lord\'s. His guards keep that cloister day and night.', { mood: 'firm' }),
      say('benny_old', 'Then she must be quieter than his guards. Fifty years ago my own honor guard kept it. Not in the same places.'),
      say('benny_old', 'The night I marched to the sea, I went down to the crypt last of all. Ask your sun about that night.'),
      act(
        [
          { do: 'look', actor: 'npc:zelia' },
          { do: 'walk', actor: 'npc:zelia', to: at(31, 16), facing: 'right' },
          { do: 'wait', ms: 700 },
          { do: 'walk', actor: 'npc:zelia', to: at(11, 17), facing: 'up' },
          { do: 'look', actor: 'player' },
        ],
        '',
        'Zelia crosses to the sitting room, unlocks the chapel stair in its far wall, and comes back without a word.',
        { set: { [E.accepted]: true } },
      ),
      say('nancy', 'My daughter did not see who borrowed the key. She is very good at not seeing.'),
      nar('(The Old Lord\'s Errand is in the Quests page of the menu.)'),
    ],
  },
  errand_wait: { lines: [say('benny_old', 'The stair in the sitting room. Be quieter than his guards, envoy. It is not difficult.')] },
  errand_back: {
    lines: [
      act([{ do: 'face', actor: 'npc:benny_old', facing: 'player' }], 'benny_old', '...You found it. Read it to me. My eyes are older than my hand.'),
      nar('"Patricio has gone to the sea, and I go after him at dawn. Tonight I refused the seventh page out loud, before them all."'),
      nar('"Here, where no herald hears it, I promise more. If the Accord is ever read against Xaraguá, Brasador stands with Xaraguá,"'),
      nar('"whoever sits in my chair. B., Lord of Ardencia."'),
      say(G, 'Your son sits in your chair now. He told the Crown\'s envoy that Ardencia stands with the Crown.'),
      say('benny_old', 'Then the promise is mine to be ashamed of. I wrote it, and I put it in a box, and I let the box keep it.'),
      act([{ do: 'walk', actor: 'npc:nancy', to: at(4, 16), facing: 'left' }], 'nancy', 'Benny.', { mood: 'firm' }),
      say('benny_old', 'Keep it, envoy. A promise keeps better with the young. I only kept it dry.', { mood: 'tender', set: { [E.done]: true } }),
      say(A, 'He is holding Nancy\'s hand, Gigi.'),
    ],
  },
  errand_after: { lines: [say('benny_old', 'Keep it dry, envoy. That is most of keeping a promise.', { mood: 'wry' })] },
};

/** Being seen: a guard of now sends the envoy up the stair; one of then sends the Marshal back to the gate (the memory lets go). */
function seenScript(watch: (typeof WATCHES)[number]): DialogueScript {
  const guard = watchGuard(watch);
  const line =
    watch.era === 'present'
      ? say('chapel_guard', 'Envoy. The Lord\'s chapel is not for guests. Back to the stair, please. Now.')
      : say('benny_honor_guard', 'Marshal? Nobody goes down tonight. The Lord\'s orders. The gate, sir. I will walk you.');
  const seen = (n: number): DialogueNode => ({
    set: { [E.seen]: n, ...TO_GATE },
    lines: [
      act([{ do: 'face', actor: `npc:${guard}`, facing: 'player' }], line.speaker!, line.text, { fx: 'shake' }),
      ...(n === 1 ? [say(A, ERRAND_HINTS[0]!)] : []),
      ...(n === 3 ? [say(A, ERRAND_HINTS[1]!)] : []),
      ...(n === 5 ? [say(A, ERRAND_HINTS[2]!)] : []),
    ],
  });
  return script(`seen_${watch.id}`, {
    start: {
      lines: [],
      next: [
        { if: { flag: E.seen, gte: 5 }, to: 'again' },
        { if: { flag: E.seen, eq: 4 }, to: 'seen_5' },
        { if: { flag: E.seen, eq: 3 }, to: 'seen_4' },
        { if: { flag: E.seen, eq: 2 }, to: 'seen_3' },
        { if: { flag: E.seen, eq: 1 }, to: 'seen_2' },
        { to: 'seen_1' },
      ],
    },
    seen_1: seen(1),
    seen_2: seen(2),
    seen_3: seen(3),
    seen_4: seen(4),
    seen_5: seen(5),
    again: { set: { ...TO_GATE }, lines: [act([{ do: 'face', actor: `npc:${guard}`, facing: 'player' }], line.speaker!, line.text, { fx: 'shake' }), say(A, ERRAND_HINTS[2]!)] },
  });
}

const ERRAND_DIALOGUE: DialogueScript[] = [
  simple('chapel_stair_shut', [nar('A door in the sitting room\'s east wall: the chapel stair. Locked.')]),
  simple('quiet_stair_shut', [nar('A low door in the wall behind the old lord\'s chair. Barred from the other side.')]),
  simple('crypt_stair_shut', [nar('A low door in the crypt\'s west wall, barred. Somebody\'s own stair.')]),
  simple('cloister_arrive', [
    nar('The chapel cloister: three walks round a dry garth. Lamplight in the arches, and Rael\'s guards in their alcoves.'),
    nar('At the far end of the north walk, Benny\'s crypt. Wherever a guard\'s lamp falls on the flags, he sees.'),
    say(A, ERRAND_HINTS[0]!),
  ]),
  script('cloister_echo', {
    start: { lines: [], next: [{ if: f(E.asked), to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The cloister, fifty years ago: the night of Benny\'s march to the sea. Torches, and his honor guard in other alcoves.', { fx: 'fade' }),
        say(P, '(Benny\'s men. They would turn me back tonight, Marshal or not. Where their torchlight falls, they see.)'),
      ],
    },
    again: { lines: [nar('The cloister, fifty years ago. Torchlight in other arches.')] },
  }),
  script('cloister_return', {
    start: { lines: [], next: [{ if: all(f(E.anchor), not(E.promise)), to: 'open' }] },
    open: { lines: [say(A, 'The crypt door, Gigi. It is standing a hand open.')] },
  }),
  ...WATCHES.map(seenScript),
  simple('chapel_guard_talk', [say('chapel_guard', 'The Lord\'s chapel, envoy. Nobody goes down. Not guests, not elders, not his own son.')]),
  simple('honor_guard_echo_talk', [say('benny_honor_guard', 'Marshal. We march at dawn. The Lord is below, and wants nobody. Not even you, sir.')]),
  simple('cloister_well', [nar('A dry well in a dry garth. Somebody has dropped a coin into it every year for fifty years.')]),
  script('crypt_door_bolted', {
    start: {
      lines: [
        nar('Benny\'s crypt. An iron-bound door, bolted from the inside. There is no keyhole on this side.'),
        { if: f(E.accepted), speaker: A, text: 'Bolted from inside, Gigi. Fifty years ago it was open.' },
      ],
    },
  }),
  simple('crypt_door_jammed', [nar('The crypt door stands a hand open. A black horseshoe nail is wedged in its bolt, fifty years deep.')]),
  // Fifty years ago: young Benny in his crypt with the letter; the loose bolt (the anchor).
  script('benny_crypt_talk', {
    start: { lines: [], next: [{ if: f(E.anchor), to: 'jammed' }, { if: f(E.asked), to: 'asked' }, { to: 'first' }] },
    first: {
      lines: [
        act([{ do: 'face', actor: 'npc:benny_crypt', facing: 'player' }], 'benny', 'Patricio. You came past my guard. Good: then you can be trusted with a door.'),
        act([{ do: 'face', actor: 'npc:benny_crypt', facing: 'right' }, { do: 'wait', ms: 600 }], '', 'Young Benny lays a folded letter in the iron box in the niche, and closes the lid on it.'),
        say('benny', 'The seventh page I refused out loud tonight. This one I promise quietly. Somebody should read it one day.'),
        say('benny', 'Every lord of Ardencia bolts things. My heirs will bolt this crypt. The bolt is loose: jam it, so it never shoots home.'),
        say(P, '(A horseshoe nail, from the farrier\'s box for the march. It will do.)', { set: { [E.asked]: true } }),
      ],
    },
    asked: { lines: [say('benny', 'The bolt, Patricio. Then go and sleep. We march at dawn.')] },
    jammed: { lines: [say('benny', 'Jammed. Good. Whoever comes for it now, comes in.')] },
  }),
  script('crypt_bolt', {
    start: { lines: [], next: [{ if: f(E.anchor), to: 'jammed' }, { if: f(E.asked), to: 'jam' }, { to: 'loose' }] },
    loose: { lines: [nar('The crypt\'s inner bolt. It slides loose in its housing.')] },
    jam: {
      lines: [nar('The crypt\'s inner bolt, loose in its housing. Patricio has a horseshoe nail in his hand.')],
      choices: [{ text: 'Jam the bolt with the nail.', set: { [E.anchor]: true }, next: 'jammed_now' }, { text: 'Leave it.' }],
    },
    jammed_now: { lines: [nar('Patricio drives the nail into the bolt\'s slot with the heel of his hand. The bolt will never shoot home.', { fx: 'shake' })] },
    jammed: { lines: [nar('The bolt, jammed with a horseshoe nail.')] },
  }),
  simple('promise_niche_echo', [nar('The iron box in the niche. Benny\'s letter is inside, and the lid is shut.')]),
  script('promise_niche', {
    start: { lines: [], next: [{ if: f(E.promise), to: 'empty' }, { to: 'box' }] },
    box: {
      lines: [
        nar('An iron box in a niche, red with fifty years of rust. Inside, a letter folded small and tied with a grey cord.'),
        say(G, 'Benny\'s promise.', { set: { [E.promise]: true } }),
        say(A, 'Gigi. There is a little door in the wall here. A stair, going up.'),
      ],
    },
    empty: { lines: [nar('The iron box, empty. A little door in the west wall goes up: Benny\'s own stair.')] },
  }),
];

// ---- Ar-5 The Arrows Missed ----------------------------------------------------------------------------------------

/** At the camp after the escape, until the trader sails. */
export const ARROWS_OPEN: Condition = all(f('act3.complete'), not('story.aldoria_arrived'));
const ASKED = (who: string) => `side.arrows.${who}`;
const ALL_ASKED: Condition = { all: ARROW_SOLDIERS.map((w) => f(ASKED(w))) };
/** Where each soldier stands (the map's), and where Azzy walks up to Gianna there. */
const SOLDIER_SPOT: Readonly<Record<string, { x: number; y: number }>> = {
  a: at(9, 5),
  b: at(11, 7),
  c: at(12, 5),
  d: CAMP.soldierD,
  e: CAMP.soldierE,
};

/** After the fifth: Azzy will not hear it. */
function arrowsEnd(who: string): DialogueNode {
  const s = SOLDIER_SPOT[who]!;
  return {
    lines: [
      act(
        [
          { do: 'place', actor: 'azzy', look: 'azzy', at: CAMP.azzy, facing: 'down' },
          { do: 'look', actor: 'azzy' },
          { do: 'walk', actor: 'azzy', to: at(s.x, s.y + 2), facing: 'up' },
          { do: 'look', actor: 'player' },
        ],
        G,
        'Azzy. Three of your company say every shot went wide. The best shots in Ardencia.',
      ),
      say(Z, 'Then they missed.'),
      say(G, 'They do not miss gulls.'),
      say(Z, '...Then they missed, Gianna. Leave it.'),
      act([{ do: 'exit', actor: 'azzy', to: at(8, 11) }], '', 'He walks down to the water\'s edge, and stands there a long time with his back to the wall.', {
        set: { 'side.arrows.done': true, 'clue.arrows_missed': true },
      }),
    ],
  };
}

/** A soldier's answer once Gianna is asking; the fifth brings Azzy. */
function soldierScript(who: (typeof ARROW_SOLDIERS)[number], answer: DialogueLine[], plain: DialogueLine[]): DialogueScript {
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [
        ...(who === 'a' ? [{ if: all(ARROWS_OPEN, not('side.arrows.accepted')), to: 'offer' }] : []),
        { if: all(ARROWS_OPEN, f('side.arrows.accepted'), not('side.arrows.done'), not(ASKED(who))), to: 'ask' },
        { to: 'plain' },
      ],
    },
    plain: { lines: plain },
    ask: { lines: answer.map((l, i) => (i === answer.length - 1 ? { ...l, set: { ...l.set, [ASKED(who)]: true } } : l)), next: [{ if: ALL_ASKED, to: 'end' }] },
    end: arrowsEnd(who),
  };
  if (who === 'a') {
    nodes.offer = {
      lines: [
        act([{ do: 'face', actor: 'npc:free_soldier_a', facing: 'player' }], FB, 'Every shot wide, envoy. Every bolt from the gatehouse, every ball from the wall.'),
        say(FB, 'The captain says they missed. Ask anyone here who has stood on that wall. Then tell me they missed.'),
        say(G, 'I will ask.', { set: { 'side.arrows.accepted': true, [ASKED('a')]: true } }),
        nar('(The Arrows Missed is in the Quests page of the menu.)'),
      ],
      next: [{ if: ALL_ASKED, to: 'end' }],
    };
  }
  return script(`free_soldier_${who}_talk`, nodes);
}

const ARROWS_DIALOGUE: DialogueScript[] = [
  soldierScript('a', [say(FB, 'Ask the others, envoy. I have said mine.')], [say(FB, 'We follow the captain. Where he goes, we go. Where are we going?')]),
  soldierScript('b', [say(FB, 'I did not see where they landed. I was running, and I am not ashamed of it.')], [say(FB, 'My mother is still in the Lower Town. She will understand. She always understands. That is the worst part.')]),
  soldierScript('c', [say(FB, 'Wide? We were lucky. Luck is a soldier\'s whole religion, envoy.')], [say(FB, 'Free Brasador. The sergeant made it up on the road. It sounds better than "deserters".')]),
  soldierScript(
    'd',
    [
      say(FB, 'I stood on the gatehouse last month, with Captain Joaquin\'s crossbows. They put a bolt through a gull for a bet.'),
      say(FB, 'Yesterday every bolt went into the road. Every one, envoy.'),
    ],
    [say(FB, 'I carried my crossbow out of the city and left the bolts. I did not want to be asked what they were for.')],
  ),
  soldierScript(
    'e',
    [
      say(FB, 'Those were the best muskets in Ardencia. I trained beside them. They do not miss a barrel at a hundred paces.'),
      say(FB, 'They missed four people at forty.'),
    ],
    [say(FB, 'Black coat, no sash. My mother will say I look like a crow.')],
  ),
];

export const ARDENCIA_QUEST_DIALOGUE: readonly DialogueScript[] = [...FEAST_DIALOGUE, ...ERRAND_DIALOGUE, ...ARROWS_DIALOGUE];
