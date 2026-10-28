// Chapter 4's three side quests once kept for after the release, built Oct 27 (the owner, Oct 27; docs/quest/design/
// SIDE-QUESTS.md A-2, A-4 and A-5, SECRET-ITEMS.md 2): The Missing Saffron (the contract board at dusk, the spice
// merchant at the caravan gate, the tracks in the dunes, the raiders: the blade or the purse), The Uncashed Note (secret:
// the old moneychanger's story, the war-time bazaar's trade chain fifty years ago, Yusuf's box seven, the Sakk of Yusuf)
// and Invoice for the Crown (Samira's last invoice, delivered to the Crown's factor on the quay at night).
//
// The owner's rules: shown, not told (the raiders walk off with the purse or run, the nephew leads the camels home, Yusuf
// writes and seals, the factor counts coins into Samira's hand); Anissa never jokes and is never touched; no Rael.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { GOODS, INVOICE, INVOICE_FLAGS, SAFFRON, SAFFRON_FLAGS, SAKK_FLAGS, VAULT_NIGHT, type Good } from '../aldoria.ts';

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
const S = 'samira';
const P = 'patricio';

// ---- A-2 The Missing Saffron ---------------------------------------------------------------------------------------

const SF = SAFFRON_FLAGS;

const SAFFRON_DIALOGUE: DialogueScript[] = [
  // The contract board on the square (its lines as built, and the saffron notice from dusk until the caravan leaves).
  script('contract_board', {
    start: { lines: [], next: [{ if: all(VAULT_NIGHT, not(SF.accepted)), to: 'notice' }, { to: 'plain' }] },
    plain: {
      lines: [
        nar('The contract board: bales wanted, camels for hire, a reward for a lost ledger.'),
        nar('Pinned over the rest: "WATER: one copper a cup, at the guild\'s tanks. By order of the guildmaster."'),
      ],
    },
    notice: {
      lines: [
        nar('The contract board. Pinned over the rest, in fresh ink, by lamplight:'),
        nar('"SAFFRON CARAVAN OVERDUE. Three camels and my sister\'s boy, due at dusk by the old road. A reward. The caravan gate."'),
        say(Z, 'The caravan guard said raiders on the old road. This morning.'),
      ],
      choices: [{ text: 'We will look for them.', set: { [SF.accepted]: true }, next: 'yes' }, { text: 'Not now.' }],
    },
    yes: { lines: [nar('(The Missing Saffron is in the Quests page of the menu.)')] },
  }),
  // The spice merchant in the caravan gate's yard.
  script('spice_merchant_talk', {
    start: {
      lines: [],
      next: [
        { if: f(SF.done), to: 'after' },
        { if: f(SF.freed), to: 'home' },
        { if: f(SF.accepted), to: 'ask' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('spice_merchant', 'Saffron, from the ruined caravanserai road. When the road is open. It is not open.')] },
    ask: {
      lines: [
        say('spice_merchant', 'You read my notice? Bless you. Three camels, saffron worth more than the camels, and my sister\'s boy.'),
        say('spice_merchant', 'Due at dusk. The raiders took the old road last month. Look for tracks where the caravan road leaves the walls.', {
          set: { [SF.asked]: true },
        }),
      ],
    },
    home: {
      lines: [
        act([{ do: 'face', actor: 'npc:saffron_nephew', facing: 'up' }], 'spice_merchant', 'He is home. The camels are home. The saffron is mostly home. I have counted it twice.'),
        say('saffron_nephew', 'Uncle. They came into the raiders\' camp for me. At night.'),
        say('spice_merchant', 'Then they drink the first of it. Saffron tea, envoy, for the road. And the reward, which I am counting again.', {
          set: { [SF.done]: true },
        }),
        say(A, 'He is hugging the camels, Gigi.'),
      ],
    },
    after: { lines: [say('spice_merchant', 'The old road is open again. I tell everyone a girl from Zetwal opened it. They do not believe me.')] },
  }),
  script('saffron_tracks', {
    start: { lines: [], next: [{ if: f(SF.tracks), to: 'more' }, { to: 'first' }] },
    first: {
      lines: [
        nar('Camel tracks: three animals and one man walking, off the caravan road and south-east into the dunes.'),
        nar('Caught in one hoofprint, a thread of red-gold. Saffron.', { set: { [SF.tracks]: true } }),
        say(Y, 'They were driven. The man was walking in front, and the rest behind him.'),
      ],
    },
    more: { lines: [nar('The tracks go on, south and east, into the far dunes.')] },
  }),
  // The raiders in the far dunes: the blade, or the purse.
  script('saffron_raider_talk', {
    start: { lines: [], next: [{ if: f(SF.freed), to: 'gone' }, { to: 'meet' }] },
    gone: { lines: [nar('Nobody here now but the wind.')] },
    meet: {
      lines: [
        act([{ do: 'face', actor: 'npc:saffron_raider_1', facing: 'player' }], 'saffron_raider', 'Saffron, camels, and a boy who cries. All ours, little traveller. Unless you are buying.'),
      ],
      choices: [
        { text: 'Then we fight.', set: { 'battle.next': 'saffron_raiders', 'battle.after': 'saffron_after_fight' }, next: 'fight' },
        { text: 'Buy them back (100 gold).', if: { flag: 'gold', gte: 100 }, set: { 'gold.pay': 100 }, next: 'paid' },
        { text: 'Not now.' },
      ],
    },
    fight: { lines: [say(Z, 'Behind me.', { fx: 'shake' })] },
    paid: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:saffron_raider_1' },
            { do: 'exit', actor: 'npc:saffron_raider_2', to: at(43, 18), async: true },
            { do: 'exit', actor: 'npc:saffron_raider_1', to: at(43, 19) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'The raider weighs the purse in his hand, whistles, and walks off east into the dark with his friend.',
        ),
        { if: f('party.samira'), speaker: S, text: 'I would have got them for sixty.' },
        ...nephewWalksHome(),
      ],
    },
  }),
  // After the raiders are beaten: they run; the nephew leads the camels home by the road.
  script('saffron_after_fight', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'raider_a', look: 'caravan_raider', at: SAFFRON.raiders[0]!, facing: 'down' },
            { do: 'place', actor: 'raider_b', look: 'caravan_raider', at: SAFFRON.raiders[1]!, facing: 'left' },
            { do: 'exit', actor: 'raider_a', to: at(43, 19), run: true, async: true },
            { do: 'exit', actor: 'raider_b', to: at(43, 18), run: true },
          ],
          '',
          'The raiders run for the dark, east, and leave the camels where they stand.',
          { set: { [SF.fought]: true } },
        ),
        ...nephewWalksHome(),
      ],
    },
  }),
  script('saffron_nephew_talk', {
    start: { lines: [], next: [{ if: f(SF.done), to: 'after' }, { if: f(SF.freed), to: 'home' }, { to: 'held' }] },
    held: { lines: [say('saffron_nephew', 'Please. My uncle will pay. He pays slowly, but he pays.')] },
    home: { lines: [say('saffron_nephew', 'Uncle is counting the saffron. Twice. He always counts twice.')] },
    after: { lines: [say('saffron_nephew', 'Thank you, envoy. I will take the main road from now on.')] },
  }),
  simple('saffron_camels', [nar('Three camels with saffron bales on their backs. One of them is eating a raider\'s hat.')]),
];

/** The nephew comes forward, thanks them, and leads the camels home along the road (both endings). */
function nephewWalksHome(): DialogueLine[] {
  return [
    act(
      [{ do: 'walk', actor: 'npc:saffron_nephew', to: at(SAFFRON.front.x + 1, SAFFRON.front.y), facing: 'left' }],
      'saffron_nephew',
      'You came for me? My uncle sent a girl?',
    ),
    say(G, 'Your uncle sent a notice. We read it.'),
    act([{ do: 'exit', actor: 'npc:saffron_nephew', to: at(12, 13) }], 'saffron_nephew', 'I will take the camels home. By the road, this time.', {
      set: { [SF.freed]: true },
    }),
  ];
}

// ---- A-4 The Uncashed Note (S-ALD) -------------------------------------------------------------------------------------

const K = SAKK_FLAGS;
/** Patricio carries a good now (unset is his soldier's pay: the coins). */
const holds = (g: Good): Condition => (g === 'coins' ? { any: [not(K.goods), { flag: K.goods, eq: 'coins' }] } : { flag: K.goods, eq: g });
const NAMES: Readonly<Record<Good, string>> = { coins: 'the coins', dates: 'the dates', salt: 'the salt', peppers: 'the peppers', indigo: 'the indigo' };
const THINGS: Readonly<Record<Good, string>> = { coins: 'a few soldier\'s coins', dates: 'a basket of dates', salt: 'a sack of salt', peppers: 'a string of peppers', indigo: 'a bolt of indigo' };

/** A stall fifty years ago: it wants one good and gives another. */
function stall(id: string, speaker: string, wants: Good, gives: Good, ask: string, after: string): DialogueScript {
  return script(`${id}_talk`, {
    start: { lines: [], next: [{ if: holds(wants), to: 'offer' }, { if: holds(gives), to: 'after' }, { to: 'lacks' }] },
    lacks: { lines: [say(speaker, ask)] },
    offer: {
      lines: [say(speaker, ask)],
      choices: [{ text: `Trade ${NAMES[wants]}.`, set: { [K.goods]: gives }, next: 'traded' }, { text: 'No.' }],
    },
    traded: { lines: [nar(`Patricio hands over ${NAMES[wants]}, and gets ${THINGS[gives]}.`)] },
    after: { lines: [say(speaker, after)] },
  });
}

/** Yusuf's box seven (the anchor): deposit, and he writes the sakk; a wrong deposit can be amended. */
function yusufBox(): DialogueScript {
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [{ if: all(f(K.anchor), { flag: K.deposit, eq: 'indigo' }), to: 'sealed' }, { if: f(K.anchor), to: 'other' }, { to: 'empty' }],
    },
    empty: {
      lines: [nar('Yusuf\'s new box, numbered seven, behind his table. Empty, and waiting.')],
      choices: [
        ...GOODS.map((g): DialogueChoice => ({
          text: `Deposit ${NAMES[g]}.`,
          if: holds(g),
          set: { [K.deposit]: g, [K.anchor]: true, [K.goods]: 'none', ...(g === 'indigo' ? { [K.indigo]: true } : {}) },
          next: 'written',
        })),
        { text: 'Not yet.' },
      ],
    },
    written: {
      lines: [
        act([{ do: 'face', actor: 'npc:yusuf_bazaar', facing: 'player' }], 'yusuf', 'A sakk, then. Payable to whom, Marshal? Your name?'),
        say(P, 'Not my name. To the bearer of the sun. Whoever carries it after me.'),
        nar('Yusuf writes in a quick young hand, seals the paper in red wax, and locks it in box seven with the deposit.'),
        say('yusuf', 'At the price of the day the war ends, and every day after. When that is, I do not know. Nobody does.'),
      ],
    },
    sealed: { lines: [nar('Box seven, sealed: one bolt of indigo, and a sakk "for the bearer of the sun".')] },
  };
  const others = GOODS.filter((g) => g !== 'indigo');
  nodes.other = {
    lines: [],
    next: others.map((g) => ({ if: { flag: K.deposit, eq: g }, to: `other_${g}` })),
  };
  for (const g of others) {
    nodes[`other_${g}`] = {
      lines: [nar(`Box seven, sealed, with ${THINGS[g]} in it and a sakk for it.`)],
      choices: [{ text: 'Ask Yusuf to amend it.', set: { [K.anchor]: false, [K.deposit]: '', [K.goods]: g }, next: 'amended' }, { text: 'Leave it.' }],
    };
  }
  nodes.amended = {
    lines: [act([{ do: 'face', actor: 'npc:yusuf_bazaar', facing: 'player' }], 'yusuf', 'Amend a sakk? For the Marshal, once.'), nar('Yusuf breaks the wax with a sigh and hands back the deposit.')],
  };
  return script('yusuf_box', nodes);
}

/** Box seven in the guild vault now: what Yusuf sealed fifty years ago. */
function boxSeven(): DialogueScript {
  const nodes: Record<string, DialogueNode> = {
    start: {
      lines: [],
      next: [
        { if: f(K.done), to: 'empty' },
        { if: all(f(K.anchor), { flag: K.deposit, eq: 'indigo' }), to: 'open' },
        { if: all(f(K.anchor), f(K.small)), to: 'small_again' },
        { if: f(K.anchor), to: 'small' },
        { to: 'shut' },
      ],
    },
    shut: {
      lines: [
        nar('Box 7. Sealed with the Dorini seal and a strip of red wax: "for the bearer of the sun."'),
        { if: f(K.accepted), speaker: '', text: 'Gianna holds the Locket to the wax. It warms, and stays shut. Nothing was ever put in it.' },
        { if: not(K.accepted), speaker: '', text: 'It does not open. Not today.' },
      ],
    },
    open: {
      lines: [
        nar('Box 7. Gianna holds the Locket to the red wax: "for the bearer of the sun." The wax softens, and the lid lifts.'),
        nar('Inside: a bolt of indigo, faded to the colour of evening, and a sakk in a young man\'s quick hand.'),
        nar('"Pay the bearer of the sun one bolt of Zetwal indigo, at the price of the day the war ends, and every day after. Y."'),
        { if: f('party.samira'), speaker: S, text: 'That is not a cheque. That is a standing order. Every Dorini house in the realm has to honour it.' },
        { if: f('party.samira'), speaker: S, text: 'Forty silver the bolt, since the blockade. Every day. Yusuf, you patient old thief.' },
        say(G, 'Grandfather bought it with dates.', { set: { 'item.sakk_yusuf': true, [K.done]: true } }),
        say(A, 'He did not know it would be us, Gigi. He wrote "whoever".'),
      ],
    },
    small_again: { lines: [nar('Box 7, with Yusuf\'s small sakk in it, paid. A note in his hand: "Deposits amended on request."')] },
    empty: { lines: [nar('Box 7, open and empty. The Dorini honour their paper.')] },
  };
  const others = GOODS.filter((g) => g !== 'indigo');
  nodes.small = { lines: [], next: others.map((g) => ({ if: { flag: K.deposit, eq: g }, to: `small_${g}` })) };
  for (const g of others) {
    nodes[`small_${g}`] = {
      lines: [
        nar(`Box 7. The Locket softens the wax. Inside: ${THINGS[g]}, and a sakk for it at the price of the war's end.`),
        nar('At today\'s price, it comes to fifty gold. The guild\'s clerk will pay it, grudgingly.', { set: { [K.small]: true, 'gold.gain': 50 } }),
        say(A, 'Grandfather put in the wrong thing, Gigi. The price board says what is dear now.'),
      ],
    };
  }
  return script('box_seven', nodes);
}

const SAKK_DIALOGUE: DialogueScript[] = [
  script('old_moneychanger_talk', {
    start: {
      lines: [],
      next: [
        { if: f(K.done), to: 'after' },
        { if: f(K.accepted), to: 'remind' },
        { if: all(f('story.samira_met'), not('story.caravan_dawn')), to: 'sun' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('old_moneychanger', 'The sun. Hm.'), say('old_moneychanger', 'Come back when you have time for an old man\'s story. Not today. Today you are busy.')] },
    sun: {
      lines: [say('old_moneychanger', 'The sun. Hm. Show it to me properly, envoy, and I will tell you a story.')],
      choices: [{ text: 'Show him the Sun Locket.', next: 'story' }, { text: 'Not now.' }],
    },
    story: {
      lines: [
        act([{ do: 'face', actor: 'npc:old_moneychanger', facing: 'player' }], 'old_moneychanger', 'So it is the sun. My master\'s master, Yusuf, kept this row in the war.'),
        say('old_moneychanger', 'He wrote a sakk for the Marshal of Zetwal: a promise to pay. Nobody ever cashed it.'),
        say('old_moneychanger', 'Box seven, in the guild\'s strongroom, sealed: "for the bearer of the sun." I have dusted it for forty years.'),
        say('old_moneychanger', 'But a sakk pays what was deposited, envoy. If the Marshal put nothing in, the box opens on nothing.'),
        say(A, 'The row shimmers, Gigi. Right here, in front of the counters.'),
        say(G, 'Then we will see what the Marshal put in.', { set: { [K.accepted]: true } }),
        nar('(The Uncashed Note is in the Quests page of the menu.)'),
      ],
    },
    remind: { lines: [say('old_moneychanger', 'Box seven, envoy. It pays what was put in. The board says what things are worth now.')] },
    after: { lines: [say('old_moneychanger', 'Yusuf paid. Fifty years late, and to the day. That is the Dorini for you.')] },
  }),
  simple('bazaar_prices', [
    nar('The price board, chalked fresh: DATES, one copper the basket. SALT, two the sack. PEPPERS from Brasador, six the string.'),
    nar('And in red: INDIGO from Zetwal, forty silver the bolt, since the Crown\'s blockade. "Ask, but do not hope."'),
  ]),
  script('counting_echo', {
    start: { lines: [], next: [{ if: f(K.anchor), to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The moneychangers\' row, fifty years ago: the week the Accord was sealed. Half the stalls are bare. Soldiers everywhere.', { fx: 'fade' }),
        say(P, '(A soldier\'s pay: a few coins. Young Yusuf writes a promise for any deposit, they say.)'),
      ],
    },
    again: { lines: [nar('The moneychangers\' row, fifty years ago. Yusuf is at his table, writing.')] },
  }),
  script('yusuf_bazaar_talk', {
    start: { lines: [], next: [{ if: f(K.anchor), to: 'done' }, { to: 'offer' }] },
    offer: {
      lines: [
        say('yusuf', 'Marshal. Deposit anything with me, and I write you a sakk for what it will be worth when the war is over.'),
        say('yusuf', 'I do not know what that is. Nobody does. That is what makes it honest. Put it in the box, and I write.'),
      ],
    },
    done: { lines: [say('yusuf', 'Box seven is yours, Marshal. Or whoever\'s.')] },
  }),
  stall('war_dates', 'war_dates', 'coins', 'dates', 'Coins! Nobody has coins in a war. A basket of dates for your coins, soldier?', 'The last dates in Bab al-Dhahab. Eat them slowly.'),
  stall('war_salt', 'war_salt', 'dates', 'salt', 'My camels eat dates, and I have none. A sack of salt for a basket of dates, soldier.', 'The camels thank you. Loudly.'),
  stall('war_peppers', 'war_peppers', 'salt', 'peppers', 'Lord Benny\'s men will not eat my peppers without salt. Peppers for salt, Marshal?', 'Salt! Now they will eat. Now they will complain about something else.'),
  stall(
    'war_indigo',
    'war_indigo',
    'peppers',
    'indigo',
    'The last bolt of indigo out of Zetwal before the blockade. I would give it for something hot to eat. Peppers, if anyone had any.',
    'Hot. Very hot. Home is a long way off, Marshal. Keep the blue.',
  ),
  yusufBox(),
  boxSeven(),
];

// ---- A-5 Invoice for the Crown -------------------------------------------------------------------------------------

const I = INVOICE_FLAGS;
const SAMIRA_AT = at(INVOICE.front.x - 1, INVOICE.front.y);

const INVOICE_DIALOGUE: DialogueScript[] = [
  // Down on the quay after the Merchant-Prince's word: Samira's last invoice in Bab al-Dhahab.
  script('invoice_offer', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'samira', look: 'samira', at: at(16, 2), facing: 'down' },
            { do: 'look', actor: 'samira' },
            { do: 'face', actor: 'samira', facing: 'player' },
          ],
          S,
          'One stop before the caravan. I have one last invoice in Bab al-Dhahab, and its debtor is on that ship.',
        ),
        nar('She takes a folded paper from her sash: "To the Crown. War-profiteering consultation, never requested. Payable on receipt."'),
        say(S, 'Twenty years of watching the Crown buy this city by the crate. Nobody ever billed them for the watching.'),
        say(G, 'Then we deliver it.', { set: { [I.accepted]: true } }),
        nar('(Invoice for the Crown is in the Quests page of the menu.)'),
      ],
    },
  }),
  script('crown_factor_talk', {
    start: { lines: [], next: [{ if: f(I.done), to: 'after' }, { if: f(I.accepted), to: 'invoice' }, { to: 'plain' }] },
    plain: { lines: [say('crown_factor', 'His Majesty\'s trade factor. I buy what the guild sells. Today, a harbour\'s worth of cassava.')] },
    invoice: {
      lines: [
        act(
          [
            { do: 'place', actor: 'samira', look: 'samira', at: at(INVOICE.front.x - 2, INVOICE.front.y - 1), facing: 'down' },
            { do: 'walk', actor: 'samira', to: SAMIRA_AT, facing: 'right' },
          ],
          S,
          'For you. From House Dorini. Well: from me.',
        ),
        act([{ do: 'face', actor: 'npc:crown_factor', facing: 'left' }], 'crown_factor', '"War-profiteering consultation, never requested." ...This is absurd.'),
        say(S, 'It is itemised.'),
        say('crown_factor', 'I do not pay a Dorini girl struck from her own guild. Not tonight, not ever.'),
      ],
      choices: [
        { text: 'Read him his own crates.', next: 'crates' },
        { text: 'Then Samira collects.', set: { 'battle.next': 'factor_guards', 'battle.after': 'invoice_after_fight' }, next: 'guards' },
        { text: 'Not yet.' },
      ],
    },
    crates: {
      lines: [
        say(G, 'Cassava for a harbour you blockade, under the Charter\'s seal. The Majlis would like to read about that. So would Eightgate.'),
        say('crown_factor', '...How much?'),
        say(S, 'It is on the paper. It has always been on the paper.'),
        ...paidUp(I.influence),
      ],
    },
    guards: {
      lines: [
        act(
          [
            { do: 'look', actor: 'officer' },
            { do: 'enter', actor: 'officer', look: 'crown_officer', from: INVOICE.gangway, to: at(INVOICE.front.x + 1, INVOICE.front.y), facing: 'left', async: true },
            { do: 'enter', actor: 'marine_a', look: 'crown_marine', from: INVOICE.gangway, to: at(INVOICE.front.x + 1, INVOICE.front.y - 1), facing: 'left' },
          ],
          'crown_factor',
          'Officer! These people are robbing the Crown!',
          { fx: 'shake' },
        ),
      ],
    },
    after: { lines: [say('crown_factor', 'I am counting how much of it was ever mine. Go away.')] },
  }),
  // After the guards are beaten: the officer sits down; the factor pays.
  script('invoice_after_fight', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'officer', look: 'crown_officer', at: at(INVOICE.front.x + 1, INVOICE.front.y), facing: 'left' },
            { do: 'place', actor: 'samira', look: 'samira', at: SAMIRA_AT, facing: 'right' },
            { do: 'exit', actor: 'officer', to: INVOICE.gangway },
          ],
          '',
          'The officer looks at his marines, sheathes his sabre, and walks back up the gangway.',
        ),
        say('crown_factor', 'Take it! Take it, and get off my quay.'),
        ...paidUp(I.fear),
      ],
    },
  }),
];

/** The factor counts it into Samira's hand; her first heartfelt line. */
function paidUp(how: string): DialogueLine[] {
  return [
    act([{ do: 'face', actor: 'npc:crown_factor', facing: 'left' }], '', 'The factor counts the coins into Samira\'s palm, one at a time. She makes him start again when he loses count.'),
    nar('She writes "paid" across the invoice, and hands him the receipt.', { set: { [how]: true, [I.done]: true } }),
    say(S, '...No one has ever helped me collect.', { mood: 'earnest' }),
    nar('She folds her copy very small, and keeps it.'),
  ];
}

export const ALDORIA_QUEST_DIALOGUE: readonly DialogueScript[] = [...SAFFRON_DIALOGUE, ...SAKK_DIALOGUE, ...INVOICE_DIALOGUE];
