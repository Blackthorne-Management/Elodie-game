// Chapter 4, Al-Doria: The Ledger (docs/quest/reviews/2026-10-20-chapter4-outline.md, its second review of Oct 21, and
// the owner's decisions in docs/quest/design/FAMILY.md). The maps are in tools/maps/aldoria.ts; tile numbers in the
// stage directions are theirs. Beat 0 (the strand at first light) is the camp trader's ready check, in
// data/dialogue/ardencia.ts beside the camp it plays on.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched and never jokes (Samira's
// invoices are the chapter's comedy, and never reach her); Samira joins in the vault, before Qasim, in front of the man
// who strikes her off; Layla says nothing to her daughter in public, and pays her debts by the scribe's hand.
//
// Flags: `story.*` progress, `side.appraise.*` (A-1) and `side.sweet_water.*` (A-3), `puzzle.vault.*` the balance
// door's weights, `clue.*` the Journal, `anchor.*` what the vault's and the cistern's memories carry back.

import type { DialogueBranch, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

/** A line with stage directions (engine/stage.ts): the cues are acted out on the map, then the line shows. */
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
const B = 'benny';
const C = 'caona';

/**
 * Layla Dorini, the Merchant-Prince and Samira's mother: every line that depends on who she is, in one place (the
 * outline's owner question 1 is being asked now; the build goes ahead on the recommendation, (a)). If the owner
 * chooses (b), a Merchant-Prince from another guild family with Layla the harbour banker who pays Samira's debts,
 * these lines and the speaker below change, and nothing else does.
 */
export const LAYLA = {
  speaker: 'layla',
  /** Samira, before the Majlis. */
  samiraWarns: 'And the Merchant-Prince will refuse you. My mother refuses everyone.',
  refuse: 'The Dorini witnessed. The Dorini hold. A witness who hands over what she holds is no witness at all.',
  toAzzy: "Brasador's son, running from his father. Al-Doria does not take sides in family matters.",
  toYari: 'You are the Yaguana girl. We buy from whoever holds a harbour. That is what a harbour is for.',
  heard: 'The Majlis has heard the envoy.',
  /** In the vault, after Qasim (she speaks only to Qasim's crime and to Gianna; to her daughter, nothing). */
  judgesQasim: "The guildmaster hired blades inside the guild's own vault. The council will hear it at dawn.",
  holds: 'You have read what you came to read. The copy stays: a witness holds.',
  throne: "The seal is the Throne's, and the Throne is at Eightgate.",
  caravan: "A Dorini caravan is not stopped at the eight gates. The only thing the guild's Crown contracts were ever good for.",
  firstLight: 'The caravan master leaves at first light. Be on it.',
  /** Samira, when her mother has gone; and the purse at the gate. */
  notHerName: "She didn't say my name.",
  scribe: "She never does when there's a scribe in the room.",
  purse: "My mother's seal. My debts, to the dinar, and ten over.",
  pays: 'She pays what she owes. She has never once said so.',
  /** On the divan, before the audience. */
  divan: 'Speak from the hall, envoy, where the scribe can hear you.',
  /** On the divan, after. */
  divanAfter: 'First light, envoy. The caravan master does not wait for daughters. Anyone\'s.',
} as const;

/** The three brass weights that make twenty-five (PUZZLES.md SIG-ALD), and the two that stay on the rack. */
const WEIGHTS = [1, 2, 4, 8, 16] as const;
const PRICE = 25;

/** The bazaar is at dusk (Samira's three things done): the green door. */
const DUSK = {
  all: [{ flag: 'side.appraise.done' }, { flag: 'side.sweet_water.done' }, { flag: 'debate.aldoria_bargain.settled' }],
};

/** The balance pan: one branch for each way the five weights can hang (32), from the flags. */
function balancePan(): DialogueScript {
  const nodes: Record<string, DialogueNode> = {};
  const next: DialogueBranch[] = [{ if: { flag: 'story.vault_outer' }, to: 'open' }];
  for (let mask = 0; mask < 1 << WEIGHTS.length; mask++) {
    const on = WEIGHTS.filter((_, i) => mask & (1 << i));
    const total = on.reduce((n, w) => n + w, 0);
    const cond = { all: WEIGHTS.map((w, i) => (mask & (1 << i) ? { flag: `puzzle.vault.w${w}` } : { notFlag: `puzzle.vault.w${w}` })) };
    const to = total === 0 ? 'empty' : total > PRICE ? 'heavy' : total < PRICE ? 'light' : 'price';
    next.push({ if: cond, to });
  }
  nodes.start = { lines: [], next };
  nodes.open = { lines: [nar('The pan rests level under its weights. The balance door stands open.')] };
  nodes.empty = { lines: [nar('The pan hangs empty on its beam. The door does not move.')] };
  nodes.heavy = { lines: [nar('The pan sinks hard and the beam knocks. Too heavy. The door does not move.')] };
  nodes.light = { lines: [nar('The pan dips, and rises again. Too light. The door does not move.')] };
  nodes.price = {
    lines: [],
    next: [{ if: { flag: 'story.vault_echo' }, to: 'opens' }, { to: 'guess' }],
  };
  // Review 3.6: before the memory, the right weight is a guess, and the door knows it.
  nodes.guess = {
    lines: [
      nar('The pan sinks level... and does not hold. It drifts back up.'),
      say(A, 'The page says a price, Gigi. We are guessing. The memory would know.'),
    ],
  };
  nodes.opens = {
    lines: [
      nar('The pan sinks level, and holds. Somewhere in the wall a counterweight drops.', { fx: 'shake' }),
      nar('The balance door swings in on its beam. Beyond it, the strongroom.', { set: { 'story.vault_outer': true } }),
      say(S, 'Twenty-five. Fifty years, and nobody in my family could read that page.'),
    ],
  };
  return script('balance_pan', nodes);
}

/** One brass weight on the rack: hang it on the pan, or take it off. */
function weightScript(w: (typeof WEIGHTS)[number]): DialogueScript {
  const flag = `puzzle.vault.w${w}`;
  return script(`vault_weight_${w}`, {
    start: { lines: [], next: [{ if: { flag: 'story.vault_outer' }, to: 'done' }, { if: { flag }, to: 'hung' }, { to: 'rack' }] },
    rack: {
      lines: [nar(`A brass weight stamped ${w}, on its hook on the rack.`)],
      choices: [{ text: 'Hang it on the pan.', set: { [flag]: true }, next: 'swing' }, { text: 'Leave it.' }],
    },
    hung: {
      lines: [nar(`The ${w} hangs on the pan's chain.`)],
      choices: [{ text: 'Take it off.', set: { [flag]: false }, next: 'back' }, { text: 'Leave it.' }],
    },
    swing: { lines: [nar('It swings on the chain, and the pan settles a little lower.')] },
    back: { lines: [nar('Back on its hook. The pan rises a little.')] },
    done: { lines: [nar(`The ${w}, where you left it. The door is open.`)] },
  });
}

/** Samira's three things, worded from the flags (the stall and the green door say what is left). */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.appraise.done' }, speaker: S, text: 'Three stalls on my row still have a fake on them.' },
  { if: { notFlag: 'debate.aldoria_bargain.settled' }, speaker: S, text: 'The priest and the merchant are still at it by the fountain.' },
  { if: { notFlag: 'side.sweet_water.done' }, speaker: S, text: 'And the children at the fountain are still thirsty.' },
];

export const ALDORIA_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 1: the quay of the Gate of Gold ------------------------------------------------------------
  simple('quay_arrive', [
    nar('Domes, white and green, over a harbour wall. Gulls, bells, and a hundred people shouting prices.'),
    say(A, 'We passed our reef, Gigi. I saw it from the boat.'),
    say(G, 'Yes.'),
    say(Z, 'Bab al-Dhahab. The Gate of Gold. Keep a hand on your purse; everyone else will.'),
    say(Y, 'My father sold them cassava every year. They always paid. Late, but they paid.'),
  ]),
  // Unrest, shown: Yari walks to the crates under the Charter's seal.
  simple('quay_crates', [
    act(
      [
        { do: 'place', actor: 'yari', look: 'yari', at: at(10, 10), facing: 'up' },
        { do: 'look', actor: 'yari' },
        { do: 'walk', actor: 'yari', to: at(12, 8), facing: 'up' },
        { do: 'wait', ms: 600 },
      ],
      '',
      'Yari leaves the line and walks to the crates by the warehouse. She runs her thumb over a stamp.',
    ),
    say(Y, 'Cassava. Salt fish. Our marks, under their seal.'),
    say(Y, "That is my father's harbour, sold by the crate."),
    act(
      [
        { do: 'look', actor: 'npc:price_crier' },
        { do: 'walk', actor: 'npc:price_crier', to: at(10, 9), facing: 'right' },
      ],
      'price_crier',
      'Indigo up! Zetwal indigo, twelve to the bolt! Dates down! Cassava, Crown price!',
    ),
    say(G, 'Yari.'),
    act([{ do: 'look', actor: 'player' }, { do: 'walk', actor: 'yari', to: at(10, 11), facing: 'up' }], Y, 'I know. Not here.'),
  ]),
  simple('price_crier_talk', [say('price_crier', 'Prices on the board at noon, envoy. Indigo up, dates down. Everything else, ask the Crown.')]),
  simple('quay_porter_talk', [say('porter', 'Crown crates in, Dorini coin out. I carry, I do not read the seals.')]),
  simple('charter_crates', [nar("Crates stamped with the Charter's seal. Under it, older and smaller, the Yaguana harbour mark.")]),
  simple('crown_ship', [nar('A Crown merchantman, riding high now it is half unloaded. Its gangway runs down to the quay.')]),
  simple('quay_trader_boat', [nar('The Zetwal trader at the end of its pier. The captain is already arguing about a berth fee.')]),
  // The quay gate: the clerk reads the papers; the Crown's factor, at his gangway, has watched the whole time.
  script('quay_gate', {
    start: {
      lines: [],
      next: [{ if: { flag: 'story.quay_passed' }, to: 'open' }, { to: 'papers' }],
    },
    open: { lines: [nar('The quay gate stands open on the bazaar.')] },
    papers: {
      lines: [
        act([{ do: 'look', actor: 'npc:gate_clerk' }, { do: 'face', actor: 'npc:gate_clerk', facing: 'player' }], 'gate_clerk', 'Papers.'),
        say(G, 'Gianna Limyè, envoy of Zetwal.'),
        act([{ do: 'wait', ms: 700 }], 'gate_clerk', "Zetwal's seal, Zetwal's Chancellor. Good."),
        say('gate_clerk', 'Ahlan wa sahlan. Mind the moneychangers; they mind you.', { translation: 'Welcome.' }),
        act(
          [
            { do: 'look', actor: 'npc:crown_factor' },
            { do: 'face', actor: 'npc:crown_factor', facing: 'up' },
            { do: 'wait', ms: 500 },
            { do: 'face', actor: 'npc:crown_factor', facing: 'left' },
          ],
          'crown_factor',
          "Zetwal sends its Head of State's daughter, and calls her an envoy. Note it.",
        ),
        act([{ do: 'look', actor: 'player' }], '', 'The factor turns back to his manifests. The quay gate opens onto the bazaar.', {
          set: { 'story.quay_passed': true },
        }),
      ],
    },
  }),
  simple('gate_clerk_talk', [
    { if: { notFlag: 'story.quay_passed' }, speaker: 'gate_clerk', text: 'Papers at the gate, envoy. Walk up to it.' },
    { if: { flag: 'story.quay_passed' }, speaker: 'gate_clerk', text: 'The bazaar is up the lane. The Majlis is at the head of the square.' },
  ]),
  simple('crown_factor_talk', [say('crown_factor', 'His Majesty\'s trade factor. I buy what the guild sells. Today, a harbour\'s worth of cassava.')]),
  simple('dorini_customs_talk', [say('dorini_customs', 'Stamp, sign, stamp. The Crown pays the duty. The guild counts it twice.')]),

  // ---- Beat 2: the Grand Bazaar, and Samira -------------------------------------------------------------
  script('samira_walkup', {
    start: {
      lines: [
        act(
          [
            { do: 'look', actor: 'samira' },
            { do: 'enter', actor: 'samira', look: 'samira', from: at(11, 23), to: at(20, 27), facing: 'down' },
            { do: 'face', actor: 'samira', facing: 'player' },
          ],
          '',
          "A young woman comes out from the last moneychanger's counter, walks straight up to Gianna, and looks at the Locket.",
        ),
        nar('Not at her face. At the Locket.'),
        say(S, 'Half of something. Zetwal gold; the hinge is Brasador work. The other half is worth more.'),
        nar('She writes on a slip and holds it out.'),
        say(S, 'Opinion, one locket: two gold.'),
      ],
      choices: [
        { text: 'Pay her.', set: { 'choice.samira_invoice': 'paid', 'gold.pay': 2 }, next: 'paid' },
        { text: "I didn't ask.", set: { 'choice.samira_invoice': 'unpaid' }, next: 'unpaid' },
      ],
    },
    paid: { speaker: S, lines: [{ text: 'Prompt. I like prompt.' }], next: 'rest' },
    unpaid: {
      lines: [say(S, "Nobody asks. It's still owed."), nar('She adds a line to the slip: late fee, one gold.')],
      next: 'rest',
    },
    rest: {
      lines: [
        act([{ do: 'face', actor: 'samira', facing: 'right' }], S, "Brasador. You stand in my light; that's not free either."),
        act([{ do: 'place', actor: 'azzy', look: 'azzy', at: at(24, 28), facing: 'left' }], '', 'Azzy moves.'),
        act([{ do: 'face', actor: 'samira', facing: 'down' }, { do: 'wait', ms: 700 }], '', 'Her eye reaches Anissa, and stops.'),
        say(S, "I can't price that. I don't price what I can't price."),
        say(G, 'We are looking for the witnessed copy of the Sun Accord. The Dorini copy.'),
        say(S, 'The signed copy. Everyone knows where it is: under the guild hall, behind a door that weighs you.'),
        say(S, 'Nobody knows how to get in. The man who does hires blades.'),
        say(S, LAYLA.samiraWarns),
        say(S, "Ask her anyway. The Majlis, at the head of the square. I'll be at my stall, counting what you owe me."),
        act([{ do: 'walk', actor: 'samira', to: at(11, 22), facing: 'down' }], '', 'She walks back to the last counter on the moneychangers\' row.', {
          set: { 'story.samira_met': true },
        }),
        say(Y, 'She did not ask your name.'),
        say(G, 'She did not need it. She read the Locket.'),
      ],
    },
  }),
  // Outside the Majlis, after the refusal: Samira is waiting on the steps (review: the gate's three things).
  simple('samira_steps', [
    act(
      [
        { do: 'place', actor: 'samira', look: 'samira', at: at(20, 8), facing: 'up' },
        { do: 'look', actor: 'samira' },
        { do: 'face', actor: 'samira', facing: 'player' },
      ],
      S,
      "Refused. Good: now you're a customer.",
    ),
    say(S, "The guild hall's doorman drinks at the tea house from dusk. I have my family's key."),
    say(S, 'I will take you down at dusk, for a fee, if by then you have done three things for me.'),
    say(G, 'What things?'),
    say(S, 'Spot my fakes. Settle the priest and the merchant, so I can hear myself think. And get those children a drink.'),
    act([{ do: 'walk', actor: 'samira', to: at(11, 22), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'She walks back down to her stall.', {
      set: { 'story.samira_steps': true },
    }),
    say(A, 'Three things, Gigi. Her fakes, the fountain, the children.'),
  ]),
  script('samira_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'party.samira' }, to: 'joined' },
        { if: { flag: 'story.vault_entered' }, to: 'vault' },
        { if: DUSK, to: 'dusk' },
        { if: { all: [{ flag: 'side.appraise.coin' }, { flag: 'side.appraise.carpet' }, { flag: 'side.appraise.weights' }, { notFlag: 'side.appraise.done' }] }, to: 'report' },
        { if: { all: [{ flag: 'side.appraise.accepted' }, { notFlag: 'side.appraise.done' }] }, to: 'betting' },
        { if: { all: [{ flag: 'story.samira_steps' }, { notFlag: 'side.appraise.accepted' }] }, to: 'bet' },
        { if: { flag: 'side.appraise.done' }, to: 'waiting' },
        { to: 'majlis' },
      ],
    },
    joined: { speaker: S, lines: [{ text: 'Noted.' }] },
    majlis: { speaker: S, lines: [{ text: 'The Majlis is at the head of the square. Go and be refused. It builds character.' }] },
    // A-1 (review 3.13: no threat she never carries out).
    bet: {
      lines: [
        say(S, 'A bet. Three stalls on this row each sell one fake among real goods: coins, carpets, weights.'),
        say(S, 'Spot all three and I pay you a hundred and fifty.'),
        say(G, 'And if I miss one?'),
        say(S, "Then I'll know what you're worth. That is also useful."),
      ],
      choices: [{ text: 'Take the bet.', set: { 'side.appraise.accepted': true }, next: 'taken' }, { text: 'Not now.' }],
    },
    taken: { speaker: S, lines: [{ text: 'Coins, carpets, weights. The stalls past mine. Look at edges.' }] },
    betting: {
      lines: [
        { if: { notFlag: 'side.appraise.coin' }, speaker: S, text: 'The coin stall still has its fake.' },
        { if: { notFlag: 'side.appraise.carpet' }, speaker: S, text: 'The carpets are still lying to you.' },
        { if: { notFlag: 'side.appraise.weights' }, speaker: S, text: 'And one weight on that table is not what it says.' },
      ],
    },
    report: {
      lines: [
        say(G, 'The smooth-edged coin. The red carpet: loose knots. The lead weight: no stamp.'),
        say(S, 'All three. Hm.'),
        say(S, "A bet's a bet: a hundred and fifty."),
        nar('She counts it out. Then she writes on a slip and tears it off.'),
        say(S, 'Lesson in appraisal: fifty gold.'),
        say(G, 'You taught me nothing.'),
        say(S, 'I watched you learn. That is the expensive kind.', { set: { 'side.appraise.done': true } }),
        // Coralie sails on before the vault (FAMILY.md): she comes to say goodbye, and walks down to the quay.
        act(
          [
            { do: 'look', actor: 'npc:coralie' },
            { do: 'walk', actor: 'npc:coralie', to: at(13, 23), facing: 'left' },
          ],
          'coralie',
          'Mes chéries! The tide will not wait, even for me.',
          { if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] }, translation: 'My darlings!' },
        ),
        {
          if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] },
          speaker: 'coralie',
          text: 'Eightgate. Someone has to dress the Regent\'s guests for this Parley, and they cannot dress themselves.',
        },
        { if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] }, speaker: 'coralie', text: 'Gigi. Anissa. I will see you there. Eat something.' },
        act(
          [{ do: 'exit', actor: 'npc:coralie', to: at(21, 30) }, { do: 'look', actor: 'player' }],
          '',
          'Tati Coco walks off down the lane to the quay, a bolt of indigo on each shoulder.',
          { if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] }, set: { 'story.coralie_left': true } },
        ),
      ],
    },
    waiting: {
      lines: [say(S, 'Dusk is when you have finished. Not before.'), ...LEFT, say(A, 'Your Quests page, Gigi.')],
    },
    // At the green door, at dusk: the ready check (outline beat 5).
    dusk: {
      lines: [say(S, "Dusk. He's at the tea house.")],
      choices: [{ text: 'Take us down.', next: 'down' }, { text: 'Not yet.', next: 'later' }],
    },
    later: { speaker: S, lines: [{ text: 'The doorman drinks slowly. Not that slowly.' }] },
    down: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:samira' },
            { do: 'walk', actor: 'npc:samira', to: at(11, 11), facing: 'left' },
            { do: 'face', actor: 'npc:samira', facing: 'up' },
            { do: 'wait', ms: 500 },
            { do: 'face', actor: 'npc:samira', facing: 'down' },
            { do: 'wait', ms: 500 },
            { do: 'face', actor: 'npc:samira', facing: 'left' },
          ],
          '',
          'She walks to the green door and looks both ways down the square. The doorman\'s stool is empty.',
        ),
        act([{ do: 'exit', actor: 'npc:samira', to: at(10, 11) }, { do: 'look', actor: 'player' }], '', 'A key turns. She goes in, and leaves the door open behind her.', {
          set: { 'story.vault_entered': true },
        }),
      ],
    },
    vault: {
      lines: [
        { if: { notFlag: 'story.vault_echo' }, speaker: S, text: 'The page says a price. I have never been able to read it. Nobody alive has.' },
        { if: { all: [{ flag: 'story.vault_echo' }, { notFlag: 'story.vault_outer' }] }, speaker: S, text: 'You know the price? Then hang it on the pan. I will look away from the weights.' },
        { if: { all: [{ flag: 'story.vault_outer' }, { notFlag: 'story.vault_inner' }] }, speaker: S, text: "The niche at the far end. No Dorini has ever opened it. That was the point." },
        { if: { flag: 'story.vault_inner' }, speaker: S, text: 'Open it. I want to see what my family has been holding for fifty years.' },
      ],
    },
  }),
  simple('samira_scale', [nar("Samira's counter: a brass scale, a slip-book, and a sign: OPINIONS, TWO GOLD. FACTS, MORE.")]),
  // The guild hall's green door (closed until Samira opens it at dusk).
  simple('guild_door', [
    { if: { notFlag: 'story.samira_steps' }, speaker: '', text: "The guild hall's green door. Locked, and a doorman on a stool beside it." },
    { if: { all: [{ flag: 'story.samira_steps' }, { not: DUSK }] }, speaker: '', text: 'Locked. Samira has the key, and the hour: dusk.' },
    { if: DUSK, speaker: '', text: 'Locked. Samira is waiting beside it.' },
  ]),
  simple('guild_doorman_talk', [say('doorman', 'Guild members only. Come back with a guild ring, or a guildmaster, or both.')]),
  simple('old_moneychanger_talk', [
    say('old_moneychanger', 'The sun. Hm.'),
    say('old_moneychanger', 'Come back when you have time for an old man\'s story. Not today. Today you are busy.'),
  ]),
  simple('moneychanger_talk', [say('moneychanger', 'Crown sols, Zetwal suns, Brasador iron. I change anything except my mind.')]),
  // A-1's three stalls (puzzle M-ALD-1): a wrong pick costs a line, and the player can look again.
  script('coin_stall', {
    start: {
      lines: [nar('Five coins on a cloth: a Crown sol, two Dorini dinars, a Zetwal sun, and a gold coin with a bright face.')],
      next: [{ if: { flag: 'side.appraise.coin' }, to: 'found' }, { if: { flag: 'side.appraise.accepted' }, to: 'pick' }],
    },
    pick: {
      lines: [say(A, 'Samira looks at edges. Look at edges, Gigi.')],
      choices: [
        { text: 'The Crown sol.', next: 'wrong' },
        { text: 'The worn dinar.', next: 'wrong' },
        { text: 'The Zetwal sun.', next: 'wrong' },
        { text: 'The bright gold one.', next: 'right' },
        { text: 'Leave it.' },
      ],
    },
    wrong: { speaker: 'coin_seller', lines: [{ text: 'That one? Hm. Look again, if you like. Looking is free.' }] },
    right: {
      lines: [
        nar('Its edge is smooth. Every other coin on the cloth is milled.'),
        say('coin_seller', '...You have been talking to the Dorini girl.', { set: { 'side.appraise.coin': true } }),
      ],
    },
    found: { lines: [nar('The bright coin with the smooth edge, set aside from the others.')] },
  }),
  script('carpet_stall', {
    start: {
      lines: [nar('Three carpets over a rail: a red tree of life, a blue prayer rug, a green garden carpet.')],
      next: [{ if: { flag: 'side.appraise.carpet' }, to: 'found' }, { if: { flag: 'side.appraise.accepted' }, to: 'pick' }],
    },
    pick: {
      lines: [
        // Coralie, the designer, counts the knots (FAMILY.md: she helps with this side quest).
        act(
          [
            { do: 'look', actor: 'npc:coralie' },
            { do: 'walk', actor: 'npc:coralie', to: at(19, 23), facing: 'up' },
          ],
          'coralie',
          'Turn them over, chérie. Count the knots on the back. A good carpet has two hundred to the inch.',
          { if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] } },
        ),
        { if: { notFlag: 'story.coralie_met' }, speaker: A, text: 'The backs, Gigi. Turn them over.' },
      ],
      choices: [
        { text: 'The red tree of life.', next: 'right' },
        { text: 'The blue prayer rug.', next: 'wrong' },
        { text: 'The green garden.', next: 'wrong' },
        { text: 'Leave it.' },
      ],
    },
    wrong: { speaker: 'carpet_seller', lines: [{ text: 'That one? Hm. My grandmother tied that one. Look again.' }] },
    right: {
      lines: [
        nar('On the back of the red carpet the knots are loose and few, glued where they should be tied.'),
        { if: { all: [{ flag: 'story.coralie_met' }, { notFlag: 'story.coralie_left' }] }, speaker: 'coralie', text: 'Eighty to the inch. Glue! I would not put it under a dog.' },
        say('carpet_seller', '...Not so loud. Please.', { set: { 'side.appraise.carpet': true } }),
      ],
    },
    found: { lines: [nar('The red carpet, rolled up and put away behind the stall.')] },
  }),
  script('weights_stall', {
    start: {
      lines: [nar('Four weights on a board: brass, iron, bronze, and a dull grey one, all marked "one pound".')],
      next: [{ if: { flag: 'side.appraise.weights' }, to: 'found' }, { if: { flag: 'side.appraise.accepted' }, to: 'pick' }],
    },
    pick: {
      choices: [
        { text: 'The brass weight.', next: 'wrong' },
        { text: 'The iron weight.', next: 'wrong' },
        { text: 'The bronze weight.', next: 'wrong' },
        { text: 'The dull grey weight.', next: 'right' },
        { text: 'Leave it.' },
      ],
      lines: [say(A, "Real ones have the guild's stamp underneath, Gigi.")],
    },
    wrong: { speaker: 'weights_seller', lines: [{ text: 'That one? Hm. Stamped by the guild. Look underneath.' }] },
    right: {
      lines: [
        nar('Lead, painted grey. Underneath, where the guild\'s stamp should be, nothing.'),
        say('weights_seller', '...My cousin sold me that one. I will speak to my cousin.', { set: { 'side.appraise.weights': true } }),
      ],
    },
    found: { lines: [nar('The lead weight, face down, its missing stamp in plain sight.')] },
  }),
  simple('coin_seller_talk', [say('coin_seller', 'Coins from every port. Every one real. Almost.')]),
  simple('carpet_seller_talk', [say('carpet_seller', 'Carpets from the hill towns, tied by hand. Mostly by hand.')]),
  simple('weights_seller_talk', [say('weights_seller', 'Weights for the honest trader. And for the other kind, who buy more.')]),
  // Coralie, "Tati Coco" (FAMILY.md: bumped into in the cloth merchants' row, buying dyes). Elodie's sister.
  simple('coralie_meet', [
    act(
      [
        { do: 'look', actor: 'coralie' },
        { do: 'place', actor: 'coralie', look: 'coralie', at: at(28, 23), facing: 'up' },
        { do: 'wait', ms: 600 },
      ],
      '',
      'In the cloth row, a tall woman in pink silk holds a bolt of indigo up to the light and argues with it.',
    ),
    say('coralie', 'Twelve to the bolt! For Zetwal indigo! At home it grows in the ditches!'),
    act(
      [
        { do: 'face', actor: 'coralie', facing: 'player' },
        { do: 'wait', ms: 500 },
        { do: 'walk', actor: 'coralie', to: at(24, 23), facing: 'left' },
      ],
      '',
      'She turns. She sees the Locket before she sees the girls.',
    ),
    say('coralie', "...That is Papa's sun."),
    say('coralie', 'Mes chéries! Gigi! Anissa!', { translation: 'My darlings!' }),
    say(A, 'Tati Coco!'),
    nar('She hugs them both at once, indigo and all.'),
    say(G, 'Tati Coco. What are you doing in Al-Doria?'),
    say('coralie', 'Buying blue for a queen who wants to be blue. The blockade has made our indigo dearer than gold.'),
    act([{ do: 'face', actor: 'coralie', facing: 'down' }], 'coralie', "Mama's eyes. Both of you."),
    say(G, 'Tati. Did you know? About Mother. And Lord Rael.'),
    nar('Coralie stops smiling. Only for a moment.'),
    // Claude's call (review 5.1; FAMILY.md): she deflects with love. Chapter 5's confrontation is Elodie's.
    say('coralie', "That is your mother's to tell, chérie. Not mine."),
    say('coralie', "She'll be at Eightgate. Make her tell you."),
    say('coralie', 'Now. Show me what you are buying. Nobody in this family gets cheated while I am in the row.'),
    act([{ do: 'walk', actor: 'coralie', to: at(28, 22), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'She goes back to her indigo, still arguing with it.', {
      set: { 'story.coralie_met': true },
    }),
  ]),
  simple('coralie_talk', [
    { if: { notFlag: 'side.appraise.done' }, speaker: 'coralie', text: 'Twelve to the bolt. I will pay ten, and he will thank me. Watch.' },
    { if: { notFlag: 'side.appraise.done' }, speaker: 'coralie', text: 'Samira Dorini has a good eye. Do not tell her I said so; she will invoice me.' },
  ]),
  simple('cloth_seller_talk', [say('cloth_seller', 'That lady has bought half my indigo and argued about all of it. I have never been happier.')]),
  simple('tea_seller_talk', [say('tea_seller', 'Ahlan wa sahlan! Mint tea, dates, tagine. Sit, sit.', { translation: 'Welcome!' })]),
  simple('armourer_talk', [say('armourer', 'Tfaddal. Guild steel for the caravans, desert leather for the road.', { translation: 'Please, go ahead.' })]),
  simple('amulet_seller_talk', [say('amulet_seller', 'Ahlan. Blue glass against the evil eye. The good eye costs extra.', { translation: 'Hello.' })]),
  simple('bazaar_crier_talk', [
    { if: { notFlag: 'story.caravan_dawn' }, speaker: 'price_crier', text: 'Water, a copper a cup! Guild water! Indigo, twelve to the bolt!' },
    { if: { flag: 'anchor.cistern_pin' }, speaker: 'price_crier', text: 'Water... free at the fountain. Nobody told me what to cry about that.' },
  ]),
  simple('bazaar_guard_talk', [say('majlis_guard', 'The Majlis is open to envoys. Speak when spoken to, and not before.')]),
  simple('majlis_banner', [nar('The banner of House Dorini: a gold balance on green.')]),
  simple('contract_board', [
    nar('The contract board: bales wanted, camels for hire, a reward for a lost ledger.'),
    nar('Pinned over the rest: "WATER: one copper a cup, at the guild\'s tanks. By order of the guildmaster."'),
  ]),

  // ---- Sweet Water (A-3, the rebel safehouse; puzzle M-ALD-2) --------------------------------------------
  script('fountain_children_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.sweet_water.done' }, to: 'after' },
        { if: { flag: 'side.sweet_water.accepted' }, to: 'waiting' },
        { to: 'ask' },
      ],
    },
    ask: {
      lines: [
        say('small_girl', 'The fountain stopped when the guild put in its pipes.'),
        say('small_boy', 'Now water is a copper a cup. The water-lady gives it free, but she is always out.'),
        say(A, 'Their cups are empty, Gigi.'),
      ],
      choices: [{ text: 'We will find out why.', set: { 'side.sweet_water.accepted': true }, next: 'yes' }, { text: 'Not now.' }],
    },
    yes: { speaker: 'small_girl', lines: [{ text: 'The water-lady\'s door is over there. It has a grey thumb on it.' }] },
    waiting: { speaker: 'small_boy', lines: [{ text: 'Is it coming? We have been sitting here since the guild came.' }] },
    after: { speaker: 'small_girl', lines: [{ text: 'It tastes like the hills!' }] },
  }),
  script('water_carrier_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.sweet_water.done' }, to: 'after' },
        { if: { all: [{ flag: 'side.sweet_water.accepted' }, { notFlag: 'side.sweet_water.carrier' }] }, to: 'line' },
        { if: { flag: 'side.sweet_water.carrier' }, to: 'waiting' },
        { to: 'busy' },
      ],
    },
    busy: { speaker: 'water_carrier', lines: [{ text: 'Water is at the well behind my house, for the ones who cannot pay. Which is everyone.' }] },
    line: {
      lines: [
        nar('She stands in her doorway with two jars on a yoke.'),
        say('water_carrier', 'The guild bent the cistern line into its own tanks, at the cistern head past the caravan gate.'),
        say('water_carrier', 'The old gate to the city line is still there. Nobody has moved it in fifty years.'),
        say('water_carrier', 'I carry what I can from the well behind me. It is not enough.'),
        act([{ do: 'look', actor: 'player' }], '', 'On her door, at the height of a hand: a grey thumbprint, pressed in ash.'),
        say(G, "(The same mark. Yucayeque's oil. Cenizal's bread.)", { set: { 'side.sweet_water.carrier': true } }),
        say(Y, 'Who pays for her well?'),
        say(G, 'She did not say. Nobody asks.'),
      ],
    },
    waiting: { speaker: 'water_carrier', lines: [{ text: 'Out the caravan gate, and north at the foot of the hills. The old gate.' }] },
    after: { speaker: 'water_carrier', lines: [{ text: 'Not today, envoy. Today I am going to stand here and listen to it run.' }] },
  }),
  simple('carrier_door', [nar('A plain door, shut. At the height of a hand, a grey thumbprint pressed in ash.')]),
  simple('dry_fountain_al', [nar('A tiled fountain, dry. The basin is full of sand and copper coins.')]),
  simple('running_fountain', [nar('The fountain runs: cold, clear water from the hills, over fifty years of copper coins.')]),
  // The fountain runs (the anchor carried back): the children drink; the water-carrier watches from her door.
  simple('fountain_runs', [
    nar('A sound across the square that nobody has heard in months: water.', { fx: 'flash' }),
    act(
      [
        { do: 'look', actor: 'npc:fountain_child_a' },
        { do: 'walk', actor: 'npc:fountain_child_a', to: at(22, 14), facing: 'up', run: true, async: true },
        { do: 'face', actor: 'npc:fountain_child_b', facing: 'up' },
        { do: 'wait', ms: 700 },
      ],
      '',
      'The two children on the rim scramble to the spout and drink with both hands.',
    ),
    act([{ do: 'look', actor: 'npc:water_carrier' }, { do: 'face', actor: 'npc:water_carrier', facing: 'left' }], 'water_carrier', 'Fifty years. Who pinned it?'),
    say(G, 'My grandfather.'),
    nar('She looks at the Locket.'),
    say('water_carrier', "Then you'll want to know who pays for my well. Not today.", { set: { 'side.sweet_water.done': true } }),
    act([{ do: 'look', actor: 'player' }], 'small_girl', 'It tastes like the hills!'),
  ]),
  // The cistern head on the Desert Edge, and its Echo (the week the vault was built).
  simple('cistern_arrive', [
    nar("The cistern head: the guild's new iron sluice turns the qanat into its tanks. The old gate to the city line is rusted shut."),
    say(A, 'The air shimmers over the old gate, Gigi. Beside the road.'),
  ]),
  simple('old_gate_rusted', [nar("The old gate to the city line, rusted shut. Water roars on the guild's side; the city's channel is dry.")]),
  simple('old_gate_pinned', [nar('The old gate stands open, its pin rusted into the hinge. Water runs down the city line toward Bab al-Dhahab.')]),
  simple('guild_sluice', [nar('The guild\'s sluice: new iron, a padlock, and a brass plate. GUILD WATER. ONE COPPER A CUP.')]),
  simple('cistern_echo_enter', [
    nar('Fifty years ago. No sluice, no tanks. The old gate stands open and water runs down the city line.'),
    say(P, '(The week the vault was built. One of my engineers is at the gate with a pry bar.)'),
  ]),
  simple('echo_engineer_talk', [
    say('engineer', 'Marshal! Good iron, this gate. We are short of iron for the march home.'),
    say('engineer', 'The pin is loose anyway. I will have it off its hinge by dark, unless you say otherwise.'),
  ]),
  script('cistern_gate', {
    start: {
      lines: [nar('The old gate, open, its iron pin loose in the hinge. Water runs past it to the city.')],
      choices: [{ text: 'Pin it open.', set: { 'anchor.cistern_pin': true }, next: 'pinned' }, { text: 'Leave it.' }],
    },
    pinned: {
      lines: [
        say(P, 'Leave the city its water. Find your iron somewhere else.'),
        nar('He drives the pin home with the heel of his hand.'),
        nar('(Anchor: this change will last into the present.)'),
      ],
    },
  }),
  simple('cistern_echo_return', [
    { if: { flag: 'anchor.cistern_pin' }, speaker: A, text: 'Gigi, listen. Water. The old gate stayed open.' },
    { if: { notFlag: 'anchor.cistern_pin' }, speaker: A, text: "You're back. The gate is still rusted shut." },
  ]),

  // ---- Beat 3: the Majlis, Layla refuses -----------------------------------------------------------------
  simple('majlis_enter', [
    act(
      [
        { do: 'place', actor: 'factor', look: 'crown_consul', at: at(15, 4), facing: 'down' },
        { do: 'look', actor: 'factor' },
        { do: 'walk', actor: 'factor', to: at(16, 12), facing: 'down' },
        { do: 'face', actor: 'factor', facing: 'player' },
        { do: 'wait', ms: 500 },
      ],
      '',
      'A man in Crown navy comes down the hall from the divan, a sealed contract under his arm.',
    ),
    act([{ do: 'exit', actor: 'factor', to: at(27, 9) }], '', 'The Crown\'s trade factor. He takes his contract into the archive and does not look back.'),
    act([{ do: 'look', actor: 'npc:no_crown_master' }], 'guild_master', 'I will not sell to the Crown, treasurer. Not one bale. Write that down.'),
    say('majlis_treasurer', 'I write everything down, master. It is the only thing I do.'),
    say('guild_master', 'Then write this: Qasim does not speak for all of us.'),
    act([{ do: 'look', actor: 'player' }], 'majlis_treasurer', 'Not in the hall, master. Please.'),
  ]),
  simple('majlis_audience', [
    act(
      [
        { do: 'look', actor: 'npc:chief_scribe' },
        { do: 'walk', actor: 'npc:chief_scribe', to: at(13, 5), facing: 'down' },
      ],
      'chief_scribe',
      'Gianna Limyè, envoy of Zetwal, granddaughter of the Marshal. She asks to be heard.',
    ),
    act([{ do: 'look', actor: 'npc:layla' }], '', 'On the divan, the Merchant-Prince. At her right hand, a broad man with gold rings stands.'),
    say(G, 'Merchant-Prince. Fifty years ago the Dorini witnessed the Sun Accord. I ask to see the witnessed copy.'),
    say(LAYLA.speaker, LAYLA.refuse),
    act([{ do: 'look', actor: 'npc:qasim' }], 'qasim', 'And the guild has contracts in Crown ports worth more than a fifty-year-old page. The vault stays shut.'),
    act([{ do: 'look', actor: 'npc:layla' }], '', 'The Merchant-Prince says nothing to that. She looks at Azzy.'),
    say(LAYLA.speaker, LAYLA.toAzzy),
    say(LAYLA.speaker, LAYLA.toYari),
    nar('Yari says nothing. Her hand is shut on something in her pouch.'),
    say(LAYLA.speaker, LAYLA.heard, { set: { 'story.vault_refused': true } }),
    act(
      [
        { do: 'walk', actor: 'npc:chief_scribe', to: at(13, 8), facing: 'right' },
        { do: 'face', actor: 'npc:chief_scribe', facing: 'player' },
      ],
      'chief_scribe',
      'Envoy. A word, under the arches. The House of Ledgers is open to envoys. Nothing in it is sealed.',
    ),
    act([{ do: 'walk', actor: 'npc:chief_scribe', to: at(12, 4), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'He goes back to the divan without another word.'),
    say(A, 'Gigi. She did not look at us like the Lord did. She looked at us like a price.'),
  ]),
  script('layla_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.layla_pass' }, to: 'after' }, { if: { flag: 'story.vault_refused' }, to: 'heard' }, { to: 'divan' }] },
    divan: { speaker: LAYLA.speaker, lines: [{ text: LAYLA.divan }] },
    heard: { speaker: LAYLA.speaker, lines: [{ text: LAYLA.heard }] },
    after: { speaker: LAYLA.speaker, lines: [{ text: LAYLA.divanAfter }] },
  }),
  simple('qasim_talk', [say('qasim', 'The vault stays shut, envoy. Go and buy something; the bazaar is very good.')]),
  simple('chief_scribe_talk', [say('chief_scribe', 'The House of Ledgers, envoy. North-west of the square. I said nothing.')]),
  simple('council_elder_talk', [say('councillor', 'The council advises. The Merchant-Prince decides. The guildmaster pays. That is the order of things.')]),
  simple('majlis_treasurer_talk', [say('majlis_treasurer', 'The Crown pays on time now. It never used to. I do not know what it is buying.')]),
  simple('no_crown_master_talk', [say('guild_master', 'Some of us remember who the Crown owed money to in the Ash Wars. It was us.')]),
  simple('contract_scribe_talk', [say('contract_scribe', 'The archive of contracts. Read, do not copy. Copying costs extra.')]),
  simple('majlis_guard_talk', [say('majlis_guard', 'The divan is at the end of the hall. Walk; do not run.')]),
  simple('merchant_seat', [nar('The divan of the Merchant-Prince: green cushions, a gold balance worked into the back.')]),
  simple('ledger_keeper_talk', [
    say('ledger_keeper', 'The House of Ledgers. Read what you like. The chains are for the books, not for you.'),
    say('ledger_keeper', 'Read five and you will start to think like a Dorini. I am told it wears off.'),
  ]),

  // ---- Beat 5 to 7: the guild hall by night, the vault, its Echo, the balance and the sun ------------------
  simple('vault_arrive', [
    nar('A stair down into the dark. Samira lights a lamp, then another, and the vault comes up out of the black.'),
    say(S, 'The antechamber. The balance door. Past it, the strongroom.'),
    say(S, "The door weighs what you hang on it. The price is on that page. I have never been able to read it."),
    say(G, "Your family's vault, and you can't open it?"),
    say(S, "My family's key opens the green door. The balance door opens to the guild's price. Qasim knows it. I don't."),
    // Review 3.2: Anissa waits at the edge of the antechamber's Echo, where Gianna steps in, not alone on the stair.
    act([{ do: 'walk', actor: 'follower', to: at(4, 6), facing: 'down' }], A, "The air shimmers over the floor. I'll hold the door, Gigi. I always do."),
  ]),
  script('ledger_page', {
    start: {
      lines: [
        nar('A ledger page, chained to its lectern: "The price of the harbour," in the guild\'s letter-numbers.'),
        nar('The figure itself has run. Damp, a long time ago.'),
        { if: { flag: 'lore.aldoria_letter_numbers' }, speaker: G, text: 'Kaf, ha... the ink has run. Yusuf would have written it plain somewhere.' },
        { if: { flag: 'story.vault_echo' }, speaker: G, text: 'Twenty-five. He said it out loud.' },
      ],
    },
  }),
  balancePan(),
  ...WEIGHTS.map(weightScript),
  simple('balance_door', [
    nar('A door of brass and oak on a beam. The pan on this side lifts it, if the pan is weighed right.'),
  ]),
  simple('vault_echo_enter', [
    nar('Lamplight. The vault is half-built: fresh mortar, no boxes yet, a desk by the doorway with an open ledger.'),
    say(P, '(The guild vault, the week before the signing. We came to ask the Dorini to witness.)'),
  ]),
  script('echo_yusuf_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.vault_echo' }, to: 'again' }, { to: 'ledger' }] },
    ledger: {
      lines: [
        act([{ do: 'look', actor: 'npc:echo_yusuf' }], 'yusuf', 'Marshal. We will witness. We will hold a copy.'),
        say('yusuf', 'For our seal the Crown has promised us preference in its ports. I am writing down what it costs.'),
        nar('He does not rise. He writes as he speaks: three strokes of the pen.'),
        say('yusuf', 'The price of the harbour. Twenty-five.'),
        say(P, 'Whose harbour?'),
        say('yusuf', 'The one that is not ours to sell. That is why I am writing it down, Marshal.'),
        say('yusuf', 'A debt unwritten is a debt unpaid. A debt written is at least a debt.'),
        act([{ do: 'look', actor: 'npc:caona_echo' }, { do: 'face', actor: 'npc:caona_echo', facing: 'right' }], C, 'They are selling my harbour in a room with no windows.'),
        act([{ do: 'look', actor: 'npc:benny_echo' }], B, 'My name goes on no page I have not read.'),
        act([{ do: 'look', actor: 'player' }], 'yusuf', 'Then write that down too, my lord. I will keep it with the copy.', {
          set: { 'story.vault_echo': true, 'clue.harbor_price': true },
        }),
      ],
    },
    again: { speaker: 'yusuf', lines: [{ text: 'Twenty-five, Marshal. Plain, in the margin, for the day the ink runs.' }] },
  }),
  simple('echo_ledger_clerk_talk', [say('ledger_clerk', 'The locksmith wants a pattern for the niche. Nobody in the guild will give him one. That is the idea.')]),
  simple('caona_echo_talk', [say(C, 'A room with no windows, Patricio. Remember that I said so.')]),
  simple('benny_echo_talk', [say(B, 'Six pages, Patricio. I have read six. Ask me about the seventh when I have read it.')]),
  simple('echo_locksmith_talk', [
    say('locksmith', "Marshal. The witness's niche, at the far end. The guild wants a lock on it that no guildsman can open."),
    say('locksmith', 'A key no guildsman holds. What pattern do I cut?'),
    say(P, "(The lock plate is blank in its frame, beside him. I could show him the Locket's sun.)"),
  ]),
  script('sun_lock_blank', {
    start: {
      lines: [nar('A lock plate, blank, fitted in the niche\'s frame. The locksmith waits with his file.')],
      choices: [{ text: "Show him the Locket's sun.", set: { 'anchor.vault_sunlock': true }, next: 'cut' }, { text: 'Not yet.' }],
    },
    cut: {
      lines: [
        say(P, 'Cut it to this.'),
        say('locksmith', 'A sun. Fifty years from now, someone will wonder why.'),
        nar('(Anchor: this change will last into the present.)'),
      ],
    },
  }),
  simple('vault_echo_return', [
    { if: { all: [{ flag: 'story.vault_echo' }, { notFlag: 'story.vault_outer' }] }, speaker: A, text: 'Did he say it, Gigi? The price?' },
    { if: { all: [{ flag: 'story.vault_echo' }, { notFlag: 'story.vault_outer' }] }, speaker: G, text: 'Twenty-five.' },
    { if: { flag: 'anchor.vault_sunlock' }, speaker: A, text: 'The lock at the far end is shining, Gigi.' },
    { if: { notFlag: 'story.vault_echo' }, speaker: A, text: "You're back. The page is still smudged." },
  ]),
  script('sun_lock', {
    start: { lines: [], next: [{ if: { flag: 'anchor.vault_sunlock' }, to: 'open' }, { to: 'blank' }] },
    blank: { lines: [nar('The niche\'s lock: a keyhole like nothing on any guild ring. Nobody has ever opened it.')] },
    open: {
      lines: [
        nar('The plate is cut in the shape of a sun. The Locket\'s sun.', { fx: 'token' }),
        nar('Gianna holds the Locket to it. Something inside the wall turns over.', { set: { 'story.vault_inner': true } }),
        say(S, 'Fifty years. A Zetwal key in a Dorini lock.'),
      ],
    },
  }),
  simple('box_seven', [
    nar('Box 7. Sealed with the Dorini seal and a strip of red wax: "for the bearer of the sun."'),
    nar('It does not open. Not today.'),
  ]),
  simple('vault_boxes', [nar('Iron boxes, numbered to twelve: the guild\'s bonds, contracts and debts. A merchant city\'s memory.')]),

  // ---- Beat 7 and 8: the witness's chest, Qasim, Samira joins ---------------------------------------------
  script('witness_chest', {
    start: { lines: [], next: [{ if: { flag: 'clue.sealed_seventh' }, to: 'read' }, { to: 'open' }] },
    read: { lines: [nar('The Dorini copy of the Sun Accord, in its seven ribbons. The seventh page sealed with the Throne\'s wax.')] },
    open: {
      lines: [
        act([{ do: 'look', actor: 'npc:samira' }, { do: 'walk', actor: 'npc:samira', to: at(21, 8), facing: 'right' }, { do: 'look', actor: 'player' }], '', 'Samira comes up behind them, reading over Yari\'s shoulder.'),
        nar('In the chest, the Dorini copy of the Sun Accord, bound with seven silk ribbons.'),
        nar('Six pages open. The seventh is sealed with red wax, and the wax bears the Throne\'s own seal.'),
        nar('"No guild, no house and no envoy may break the Throne\'s seal. The Throne Archive at Eightgate opens it, or nobody does."'),
        // Review 3.3: Benny's name is on the six open pages; only the sealed seventh lacks it.
        say(Y, 'Patricio. Yusuf. Benny. Sarnai. Sayo. Arjun.'),
        say(Y, 'Not Caona. She was never asked.'),
        nar('Under the ribbons, a half-sheet in a young man\'s hand.', { set: { 'item.benny_half_sheet': true } }),
        nar('"I will not put my name to this page. B. Rodriguez."'),
        say(G, 'Six pages he signed. The seventh, he would not.', { set: { 'clue.sealed_seventh': true } }),
        say(A, 'That is Lord Benny\'s hand, Gigi. Like in the memory.'),
        // Qasim comes down the stair with the guild's blades; Anissa steps behind Gianna (review 3.2).
        act(
          [
            { do: 'look', actor: 'qasim' },
            { do: 'enter', actor: 'qasim', look: 'qasim', from: at(4, 1), to: at(14, 7), facing: 'right', async: true },
            { do: 'enter', actor: 'blade_a', look: 'caravan_raider', from: at(4, 1), to: at(14, 8), facing: 'right', async: true },
            { do: 'enter', actor: 'blade_b', look: 'caravan_raider', from: at(4, 1), to: at(15, 6), facing: 'right' },
            { do: 'place', actor: 'blade_c', look: 'caravan_raider', at: at(4, 2), facing: 'down' },
            { do: 'walk', actor: 'follower', to: at(23, 8), facing: 'left' },
          ],
          '',
          "Boots on the stair. Guildmaster Qasim comes down with the guild's blades in green, and stops at the balance door.",
          { set: { 'story.qasim_came': true } },
        ),
        say('qasim', "The guild's vault. The guild's page. And Zetwal's envoy with her hand in it."),
        act([{ do: 'face', actor: 'qasim', facing: 'right' }, { do: 'look', actor: 'npc:samira' }], 'qasim', 'Samira Dorini. You opened this door.'),
        say('qasim', 'You are struck from the guild, tonight, by its master.'),
        nar('Samira takes the slip-book out of her sash, writes, and tears out the page.'),
        act([{ do: 'walk', actor: 'npc:samira', to: at(20, 7), facing: 'left' }], S, "Then I'll bill the guild."),
        act([{ do: 'walk', actor: 'npc:samira', to: at(22, 8), facing: 'left' }, { do: 'look', actor: 'player' }], '', 'She steps into the line, beside Yari.', {
          set: { 'party.samira': true, 'story.samira_joined': true },
        }),
        nar('(Samira joins the party.)'),
        say(A, 'Gigi, Samira can Bribe a blade. The ones he hires were paid already.'),
        say('qasim', 'Blades.', { set: { 'battle.next': 'qasim_vault', 'battle.after': 'layla_descends' } }),
      ],
    },
  }),
  // After a Game Over: the blade at the stair's foot sends the party back to Qasim.
  simple('stair_blade_talk', [
    say('guild_blade', "The master's still in the strongroom. He's not finished with you."),
    act(
      [
        { do: 'look', actor: 'qasim' },
        { do: 'enter', actor: 'qasim', look: 'qasim', from: at(4, 1), to: at(6, 5), facing: 'down' },
      ],
      'qasim',
      'Again, envoy? The guild pays by the hour.',
      { set: { 'battle.next': 'qasim_vault', 'battle.after': 'layla_descends' } },
    ),
  ]),

  // ---- Beat 9: the Merchant-Prince's word (after the fight; again from a save until it is given) -----------
  simple('layla_descends', [
    act(
      [
        { do: 'place', actor: 'qasim', look: 'qasim', at: at(16, 7), facing: 'left' },
        { do: 'look', actor: 'qasim' },
      ],
      '',
      'Qasim is on one knee among the iron boxes, his purse empty. His blades have gone up the stair without him.',
    ),
    act(
      [
        { do: 'look', actor: 'layla' },
        { do: 'enter', actor: 'scribe', look: 'dorini_scribe', from: at(4, 1), to: at(12, 8), facing: 'right', async: true },
        { do: 'enter', actor: 'guard_a', look: 'majlis_guard', from: at(4, 1), to: at(12, 6), facing: 'right', async: true },
        { do: 'enter', actor: 'guard_b', look: 'majlis_guard', from: at(4, 1), to: at(11, 7), facing: 'right', async: true },
        { do: 'enter', actor: 'layla', look: 'layla', from: at(4, 1), to: at(14, 7), facing: 'right' },
      ],
      '',
      'Lamps on the stair again. The Merchant-Prince comes down with two Majlis guards and the chief scribe.',
    ),
    nar('She looks at Qasim, at the open chest, at her daughter. In that order.'),
    say(LAYLA.speaker, LAYLA.judgesQasim),
    act(
      [
        { do: 'walk', actor: 'guard_a', to: at(16, 6), facing: 'down', async: true },
        { do: 'walk', actor: 'guard_b', to: at(15, 8), facing: 'right' },
        { do: 'wait', ms: 400 },
        { do: 'exit', actor: 'guard_a', to: at(4, 1), async: true },
        { do: 'exit', actor: 'qasim', to: at(4, 1), async: true },
        { do: 'exit', actor: 'guard_b', to: at(4, 1) },
      ],
      '',
      'The guards lift Qasim by the elbows and take him up the stair.',
    ),
    say(LAYLA.speaker, LAYLA.holds),
    say(LAYLA.speaker, LAYLA.throne),
    say(LAYLA.speaker, LAYLA.caravan),
    say(LAYLA.speaker, LAYLA.firstLight),
    act([{ do: 'walk', actor: 'scribe', to: at(19, 7), facing: 'right' }], '', 'The chief scribe puts a caravan pass in Gianna\'s hand, under the Merchant-Prince\'s seal.', {
      set: { 'item.dorini_pass': true },
    }),
    nar('To Azzy, to Yari, to the room, she says nothing. To her daughter, nothing at all.'),
    act(
      [
        { do: 'exit', actor: 'layla', to: at(4, 1), async: true },
        { do: 'exit', actor: 'scribe', to: at(4, 1) },
        { do: 'look', actor: 'player' },
      ],
      '',
      'She goes back up the stair without turning.',
      { set: { 'story.layla_pass': true } },
    ),
    say(S, LAYLA.notHerName),
    say(G, 'No.'),
    say(S, LAYLA.scribe),
    say(S, 'First light, at the caravan gate. Up the stair and east through the bazaar. We can sleep in the gate yard.', { set: { 'story.vault_left': true } }),
  ]),

  // ---- Beat 10: the caravan gate at first light ------------------------------------------------------------
  simple('caravan_dawn', [
    nar('First light over the caravan gate. Camels groaning awake, bells, coffee, dust.', { fx: 'fade', set: { 'story.caravan_dawn': true } }),
    // The purse: Layla pays what she owes, in public, without a word (outline beat 10, its Claude's call).
    act(
      [
        { do: 'place', actor: 'samira', look: 'samira', at: at(5, 12), facing: 'left' },
        { do: 'look', actor: 'scribe' },
        { do: 'enter', actor: 'scribe', look: 'dorini_scribe', from: at(0, 13), to: at(5, 13), facing: 'up' },
        { do: 'wait', ms: 700 },
      ],
      '',
      'The chief scribe walks up from the bazaar, puts a purse in Samira\'s hands without a word, and walks away.',
    ),
    act([{ do: 'exit', actor: 'scribe', to: at(0, 13) }, { do: 'look', actor: 'samira' }], S, LAYLA.purse),
    nar('She turns the purse over once more.'),
    say(S, LAYLA.pays),
    // The coin (Rael clue 4): Samira reads it right; Gianna reads it wrong (belief.rael_traitor).
    act([{ do: 'place', actor: 'yari', look: 'yari', at: at(4, 13), facing: 'right' }], Y, 'Samira. Appraise this.'),
    nar('Yari holds out the coin from the strand. Samira weighs it on the little scale she wears on a cord.'),
    say(S, 'Brasador mint. Cenizal, three years old. Worn by a purse that was not Brasador.'),
    say(S, 'This has been in oil and salt. This coin has been somewhere else.'),
    say(S, 'Someone in Ardencia pays someone in Xaraguá, and not through any bank I know.'),
    say(G, 'My father pays the resistance so he can sell it.', { set: { 'clue.brasador_coin': true } }),
    say(A, 'He left it on purpose, Gigi. Like the key.'),
    nar('Gianna does not answer.'),
    // The siblings (review 5.2): one quiet exchange.
    act([{ do: 'place', actor: 'azzy', look: 'azzy', at: at(3, 11), facing: 'down' }], Z, 'You said "my father".'),
    say(G, 'He is.'),
    say(Z, 'Then he is mine too. And I do not know what he is doing either.'),
    act([{ do: 'face', actor: 'samira', facing: 'up' }], S, 'Brasador. You still owe me for the light.'),
    say(Z, 'Bill my father.'),
    say(S, 'I intend to.'),
    act(
      [
        { do: 'look', actor: 'npc:caravan_guard' },
        { do: 'exit', actor: 'npc:caravan_guard', to: at(20, 12), async: true },
      ],
      'caravan_master',
      'Dorini caravan! Out the gate! Eightgate in nine days, if the camels agree!',
    ),
    nar('The caravan moves out through the gate. Gianna takes one last look back at the Gate of Gold, and follows.', {
      fx: 'fade',
      set: { 'act4.complete': true },
    }),
  ]),
  simple('caravan_master_talk', [
    { if: { notFlag: 'story.layla_pass' }, speaker: 'caravan_master', text: 'The Dorini caravan leaves for Eightgate when the Merchant-Prince says. She has not said.' },
    { if: { flag: 'story.layla_pass' }, speaker: 'caravan_master', text: 'First light. Bring water, bring patience, bring nothing that bites.' },
  ]),
  simple('caravan_guard_talk', [say('caravan_guard', 'Raiders past the gate, envoy. Stay on the road.')]),
  simple('spice_merchant_talk', [say('spice_merchant', 'Saffron, from the ruined caravanserai road. When the road is open. It is not open.')]),
];
