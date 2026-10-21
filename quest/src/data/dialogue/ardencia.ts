// Chapter 3, Ardencia: The Trial of Blades (docs/quest/reviews/2026-10-20-chapter3-outline.md, its review, the
// owner's decisions of Oct 20 and the families of Oct 21: docs/quest/design/FAMILY.md). The maps are in
// tools/maps/ardencia.ts; tile numbers in the stage directions are theirs.
//
// The owner's rules here: every story moment is acted out on the map (people walk in, act, walk off); no jokes in
// Rael's or Anissa's scenes; Anissa is never touched (Rael's Seize goes for her Spark); Rael wins the trial, carries
// La Promesa de Benny, and tells Gianna the truth with the court cleared, by the winner's question. Gianna believes
// her father sold Xaraguá and them from the hall scene on; the player sees two things she does not (the signet's
// glow at his lie, and the shots that all land wide).
//
// Flags: `story.*` progress, `side.treasurer.*` and `side.bread.*` the two side quests, `clue.*` the Journal,
// `echo.*` memory-only state, `anchor.*` what the forge's memory carries back.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
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
const R = 'rael';
const P = 'patricio';
const B = 'benny';

/** The two required side quests and the debate are done: noon may come (the "Until noon" objective). */
const DAY_DONE = {
  all: [
    { flag: 'side.treasurer.done' },
    { flag: 'side.bread.done' },
    { any: [{ flag: 'debate.ardencia_bread.joined' }, { flag: 'debate.ardencia_bread.mediated' }] },
  ],
};

/** The court as the trial begins, and again after it (the reveal replays from a save: review 3.6). */
const COURT: StageCue[] = [
  { do: 'place', actor: 'elder_a', look: 'ard_elder', at: at(31, 6), facing: 'down' },
  { do: 'place', actor: 'elder_b', look: 'ard_elder_f', at: at(33, 6), facing: 'down' },
  { do: 'place', actor: 'elder_c', look: 'ard_elder', at: at(35, 6), facing: 'down' },
  { do: 'place', actor: 'cresswell', look: 'cresswell', at: at(34, 5), facing: 'down' },
  { do: 'place', actor: 'rivera', look: 'rivera', at: at(36, 12), facing: 'left' },
  { do: 'place', actor: 'jaime', look: 'jaime', at: at(36, 7), facing: 'left' },
];

export const ARDENCIA_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0: the pier at Pòdlimyè ----------------------------------------------------------------
  script('trader_captain_talk', {
    start: {
      speaker: 'trader_captain',
      lines: [
        { text: 'The tide turns at noon, envoy. Ardencia is across the strait, under the black cliffs.' },
        { text: 'I put in on their sand road every month. Brasador pays in iron and asks no questions.' },
      ],
      choices: [
        { text: 'Sail for Ardencia.', next: 'board' },
        { text: 'Not yet.', next: 'later' },
      ],
    },
    later: { speaker: 'trader_captain', lines: [{ text: 'We sail when you say. The strait waits for no one, but I do.' }] },
    board: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:anicette_home' },
            { do: 'walk', actor: 'npc:anicette_home', to: at(30, 12), facing: 'down' },
            { do: 'walk', actor: 'follower', to: at(30, 13), facing: 'up' },
          ],
          'anicette',
          'Kasav, for the water. Both of you eat it. Anissa, make your sister eat.',
        ),
        say(A, 'I will, Grandmother.'),
        act([{ do: 'walk', actor: 'npc:patricio_home', to: at(31, 12), facing: 'down' }], 'patricio_old', 'Gianna. Ask him why his father said yes.'),
        say(G, 'I will, Grandfather.'),
        act(
          [
            { do: 'look', actor: 'player' },
            { do: 'place', actor: 'yari', look: 'yari', at: at(30, 15), facing: 'down' },
            { do: 'walk', actor: 'yari', to: at(31, 16), facing: 'down', async: true },
            { do: 'walk', actor: 'follower', to: at(30, 16), facing: 'down' },
          ],
          '',
          'Yari and Anissa go up the gangway. The crew casts off, and the trader swings out past the reef.',
          { set: { 'travel.next': 'ardencia-flats/landing', 'voyage.next': 'zetwal_ardencia' } },
        ),
      ],
    },
  }),

  // ---- Beat 1: the Cinder Flats --------------------------------------------------------------------
  simple('ardencia_landing', [
    nar('Black sand, hot underfoot. Steam rises from the cracks in the flats, and the road climbs to a red-stone gate.'),
    say(Y, 'No trees. No birds. What do they eat here?'),
    say(G, 'Iron, Grandfather says. They trade it for everything else.'),
    say(A, 'The air tastes like a blown-out candle, Gigi.'),
  ]),
  simple('flats_family', [
    act(
      [
        { do: 'enter', actor: 'mother', look: 'ard_villager_f', from: at(31, 5), to: at(31, 12), facing: 'down' },
        { do: 'enter', actor: 'boy', look: 'festival_kid', from: at(32, 5), to: at(32, 12), facing: 'down' },
        { do: 'face', actor: 'player', facing: 'up' },
      ],
      'road_mother',
      'Going up? Then you have not heard. The Crown took Yucayeque, and the Lord said nothing.',
    ),
    say('road_mother', 'We are going to my sister in Al-Doria, before the ships come here too.'),
    say(Y, 'Yucayeque is my home.'),
    say('road_mother', '...Then I am sorry, girl. Truly.'),
    act(
      [
        { do: 'exit', actor: 'mother', to: at(31, 23), async: true },
        { do: 'exit', actor: 'boy', to: at(32, 23), async: true },
        { do: 'enter', actor: 'courier', look: 'courier_rider', from: at(31, 4), to: at(32, 23), run: true },
      ],
      '',
      'A courier runs past them down to the strand, a sealed tube on his back.',
    ),
  ]),
  simple('flats_sign', [nar('CENIZAL. The sea road. Outsiders to the gate. Weapons sheathed. By order of the Lord.')]),
  // The gate of Cenizal: the papers are read; one halberdier walks up through the gate and comes back with Azzy.
  script('gate_arrive', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:gate_halberdier' }], 'halberdier', 'Halt. Name and house.'),
        say(G, 'Gianna Limyè, envoy of Zetwal. These are my papers.'),
        act([{ do: 'walk', actor: 'npc:gate_halberdier', to: at(24, 3), facing: 'down' }], 'halberdier', '...Zetwal\'s seal. Zetwal\'s Chancellor.'),
        say('halberdier', 'No outsider speaks to the Lord. The Law of the Blade.'),
        say('halberdier', 'But the papers are good. Wait.'),
        act(
          [
            { do: 'walk', actor: 'npc:gate_halberdier', to: at(24, 1), facing: 'up' },
            { do: 'wait', ms: 700 },
            { do: 'look', actor: 'azzy' },
            { do: 'enter', actor: 'azzy', look: 'azzy', from: at(25, 0), to: at(25, 3), facing: 'down' },
            { do: 'walk', actor: 'npc:gate_halberdier', to: at(23, 3), facing: 'down' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'The halberdier comes back with a young man in a black coat. He reads the papers, then looks at Anissa, then at Gianna.',
        ),
        say(Z, 'Zetwal\'s envoy. My father expected you a week ago.'),
        say(Z, 'I am Azriel Rodriguez. Azzy, if you prefer. I am to walk you up.'),
        say(G, 'Your father is the Lord?'),
        say(Z, 'He is. The papers say "envoy". They do not say you would be so young.'),
        say(A, 'She is my sister. She does not give up.'),
        say(Z, 'Then I will trust her. Come. The gate is open to you.', { set: { 'story.azzy_met': true } }),
        act([{ do: 'exit', actor: 'azzy', to: at(25, 0) }], '', 'Azzy walks back up through the gate, and the halberdiers stand aside.'),
      ],
    },
  }),
  simple('gate_closed', [
    { if: { notFlag: 'story.ardencia_escaped' }, speaker: 'halberdier', text: 'The gate is shut to outsiders. Speak to us first.' },
    { if: { flag: 'story.ardencia_escaped' }, speaker: '', text: 'Halberds behind the gate, and orders to take the Lord\'s guests back. Not that way.' },
  ]),
  simple('gate_halberdier_talk', [
    { if: { notFlag: 'story.azzy_met' }, speaker: 'halberdier', text: 'Papers, then the gate.' },
    { if: { flag: 'story.azzy_met' }, speaker: 'halberdier', text: 'The Lord\'s son walks you. That is enough for us.' },
  ]),
  simple('gate_halberdier_2_talk', [say('halberdier', 'Hot today. Hot every day. The steam does not care what month it is.')]),

  // ---- Beat 2: the Upper Town and the Alcázar -----------------------------------------------------
  simple('town_arrive', [
    act(
      [
        { do: 'place', actor: 'azzy', look: 'azzy', at: at(24, 23), facing: 'down' },
        { do: 'face', actor: 'player', facing: 'up' },
      ],
      Z,
      'Cenizal. The Upper Town. The Alcázar is at the head of the plaza; the duel court beside it.',
    ),
    say(Z, 'This way.'),
    act([{ do: 'exit', actor: 'azzy', to: at(19, 6) }], '', 'Azzy walks ahead up the red-stone street and into the Alcázar.'),
  ]),
  // The audience: the steward Zelia (Benny's daughter, Rael's sister: the party does not know it) receives them;
  // Jaime and Envoy Cresswell come out of the Lord's door; Captain Rivera holds it.
  script('audience', {
    start: {
      lines: [
        act(
          [
            { do: 'place', actor: 'azzy', look: 'azzy', at: at(17, 17), facing: 'up' },
            { do: 'look', actor: 'npc:zelia' },
            { do: 'walk', actor: 'npc:zelia', to: at(16, 15), facing: 'down' },
          ],
          'zelia',
          'The envoy of Zetwal. I am Zelia, steward of this house. Welcome to the Alcázar.',
        ),
        say('zelia', 'The Lord will hear the envoy when she has proven herself. Tomorrow at noon, in the court.'),
        say(G, 'Proven myself how?'),
        say('zelia', 'The Law of the Blade. No outsider is heard here who has not stood in the ring.'),
        act(
          [
            { do: 'look', actor: 'cresswell' },
            { do: 'enter', actor: 'cresswell', look: 'cresswell', from: at(19, 1), to: at(18, 4), facing: 'down', async: true },
            { do: 'enter', actor: 'jaime', look: 'jaime', from: at(19, 1), to: at(19, 4), facing: 'down' },
            { do: 'walk', actor: 'cresswell', to: at(15, 16), facing: 'down' },
            { do: 'wait', ms: 600 },
            { do: 'face', actor: 'cresswell', facing: 'player' },
            { do: 'wait', ms: 500 },
          ],
          '',
          'A man in Crown navy walks the length of the hall. He slows as he passes Anissa, and looks at her a moment too long.',
        ),
        act([{ do: 'exit', actor: 'cresswell', to: at(10, 6) }, { do: 'look', actor: 'jaime' }], 'jaime', 'Steward. The Lord will see no one else today.'),
        say('zelia', 'Then no one else will see him, Jaime.'),
        act([{ do: 'exit', actor: 'jaime', to: at(19, 1) }, { do: 'look', actor: 'player' }], Z, 'The Crown\'s envoy, Cresswell. He has been here a month. And Jaime, my father\'s counsel.'),
        say(Z, 'The captain at the Lord\'s door is Rivera. I was named for him. He was beside my father at Cendre.'),
        say(A, 'Gigi, the man in blue looked at me like I was a lamp he wanted to blow out.'),
        say(G, 'Stay close to me here.'),
        say(Z, 'Until noon you are my guest. See the city. I would not have you fight my father without eating in his town.'),
        say(Z, 'And whatever you need from the smith, buy it today. Tomorrow you may not have the chance.'),
        act(
          [
            { do: 'walk', actor: 'npc:zelia', to: at(15, 5), facing: 'down', async: true },
            { do: 'exit', actor: 'azzy', to: at(16, 21) },
          ],
          '',
          'Azzy goes out to the court gate. The steward goes back up the hall.',
          { set: { 'story.trial_set': true } },
        ),
      ],
    },
  }),
  script('zelia_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.treasurer.benny_open' }, to: 'benny' },
        { if: { all: [{ flag: 'side.treasurer.told' }, { notFlag: 'side.treasurer.benny_open' }] }, to: 'summons' },
        { if: { flag: 'side.treasurer.zelia' }, to: 'records' },
        { if: { flag: 'side.treasurer.accepted' }, to: 'open' },
        { to: 'steward' },
      ],
    },
    steward: {
      speaker: 'zelia',
      lines: [
        { text: 'Noon tomorrow, envoy. Until then this house is open to you, except where it is not.' },
        { text: 'The records room is mine to open, and I do not open it for visitors.' },
      ],
    },
    open: {
      speaker: 'zelia',
      lines: [
        { text: 'The treasurer\'s girl sent you. She has stood at that gate for eleven years.' },
        { text: 'The records room. Touch the ledgers, not the maps.' },
        act([{ do: 'walk', actor: 'npc:zelia', to: at(21, 8), facing: 'right' }], '', 'The steward unhooks the rope across the records room door.', { set: { 'side.treasurer.zelia': true } }),
      ],
    },
    records: {
      speaker: 'zelia',
      lines: [
        { text: 'The old lord kept his office in that room, before he gave the seat to his son.' },
        { text: 'I keep it as he left it. Touch nothing he would notice. He notices everything.' },
      ],
    },
    summons: {
      speaker: 'zelia',
      lines: [
        { text: 'Envoy. The old lord heard there is a Zetwal girl in his house with a sun at her throat.' },
        { text: 'He sees no one. He asks to see you. His rooms are behind the guard, across the hall.' },
        act([{ do: 'walk', actor: 'npc:zelia', to: at(11, 17), facing: 'up' }], '', 'The steward walks across the hall and speaks to the guard at the old lord\'s door.', { set: { 'side.treasurer.benny_open': true } }),
      ],
    },
    benny: { speaker: 'zelia', lines: [{ text: 'Go in. He tires quickly, and he hides it badly. Do not let him tell you otherwise.' }] },
  }),
  simple('rivera_talk', [nar('Captain Rivera stands at the Lord\'s door, hands on his halberd. He watches Gianna and says nothing.')]),
  simple('rael_seat', [nar('The Lord\'s seat: black iron under red cloth, worn bright where a hand rests on the arm. It is empty.')]),
  simple('lord_door', [nar('The Lord\'s door. Shut, and a captain in front of it.')]),
  simple('hall_witness_talk', [
    say('oath_knight', 'An oath is what you are when no one is watching. A Witness keeps it, or carries what breaking it costs.'),
  ]),
  simple('hall_skeptic_talk', [say('gaze_skeptic', 'And who decides the cost? The Lord who broke his own, at Cendre?')]),
  simple('alcazar_courier_talk', [say('courier', 'Letters to the elders, letters from the Crown. Nobody writes to me. I carry.')]),
  simple('ard_elder_talk', [say('ard_elder', 'The elders sit, envoy. The Lord decides. We are the part of the law that nods.')]),
  simple('benny_guard_talk', [
    { if: { notFlag: 'side.treasurer.benny_open' }, speaker: 'halberdier', text: 'The old lord and the lady see no one.' },
    { if: { flag: 'side.treasurer.benny_open' }, speaker: 'halberdier', text: 'The steward says you may go in. Go quietly.' },
  ]),

  // ---- The Treasurer's Daughter (Ar-2, required; puzzle M-ARD-1) -------------------------------------
  script('treasurer_daughter_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.treasurer.told' }, to: 'after' },
        { if: { flag: 'clue.treasurer_alive' }, to: 'tell' },
        { if: { flag: 'side.treasurer.accepted' }, to: 'waiting' },
        { to: 'ask' },
      ],
    },
    ask: {
      speaker: 'treasurer_daughter',
      lines: [
        { text: 'You are the Zetwal envoy. Everyone in the hall is saying so.' },
        { text: 'My father was the city treasurer. Eleven years ago he "retired", and he never came home.' },
        { text: 'His last ledger should be in the records room. The steward will not open it for me. For an envoy, she might.' },
      ],
      choices: [
        { text: 'I will look for it.', set: { 'side.treasurer.accepted': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: { speaker: 'treasurer_daughter', lines: [{ text: 'Thank you. Ask the steward. She stands by the records room door, mostly.' }] },
    waiting: { speaker: 'treasurer_daughter', lines: [{ text: 'The records room is on the east side of the hall. The steward has the rope.' }] },
    tell: {
      lines: [
        say(G, 'There was a copy behind the tapestry. And a note in his hand, from this year.'),
        say(G, '"I am alive. I am held where the ash falls. Tell her I am alive."'),
        act(
          [{ do: 'walk', actor: 'npc:treasurer_daughter', to: at(12, 8), facing: 'left' }],
          '',
          'The treasurer\'s daughter sits down on the hall step, very slowly, the note in both hands.',
        ),
        say('treasurer_daughter', '...Alive.'),
        say('treasurer_daughter', 'Take this. He kept it with the ledger. He said it was the only honest page in the building.'),
        nar('A copy of Benny\'s Refusal, fifty years old. Gianna puts it with her papers.', { set: { 'side.treasurer.told': true } }),
        say(A, 'Gigi... where is "where the ash falls"?'),
        say(G, 'I don\'t know. Not yet.'),
      ],
    },
    after: { speaker: 'treasurer_daughter', lines: [{ text: 'Alive. I keep saying it. It does not wear out.' }] },
  }),
  simple('records_rope', [nar('A red rope across the records room door. The steward\'s.')]),
  simple('records_shelf', [
    nar('The treasurers\' shelf. Every ledger since Don Alonso, then a gap where the last eleven years should be.'),
    nar('Beside the gap, one thin report: "The Treasurer\'s Last Report". Unsigned.'),
    say(A, 'The air is shimmering here, Gigi. By the desk.', { set: { 'side.treasurer.shelf': true } }),
  ]),
  simple('line_record', [
    nar('THE LINE OF ARDENCIA, in a clerk\'s best hand: Alonso. Benny. Rael. Azriel.'),
    nar('Under it, in another ink: "No others recorded."'),
    say(G, 'A whole family on one line.', { set: { 'clue.ardencia_record': true } }),
  ]),
  simple('records_echo_enter', [
    nar('Lamplight. The records room is an office again: maps on the desk, a chest of papers being packed for a march.'),
    say(P, '(Benny\'s office. The night before he took his ships to Zetwal.)'),
  ]),
  simple('records_echo_return', [
    { if: { all: [{ flag: 'clue.niche' }, { notFlag: 'clue.treasurer_alive' }] }, speaker: G, text: 'The niche behind the tapestry, on the east wall. Every treasurer since Don Alonso.' },
    { if: { notFlag: 'clue.niche' }, speaker: A, text: 'You\'re back. Did the memory tell you anything, Gigi?' },
  ]),
  script('echo_clerk_talk', {
    start: {
      speaker: 'echo_clerk',
      lines: [
        { text: 'Marshal. The lord is packing the whole office into one chest. He trusts no one with his papers but me.' },
        { text: 'Ha. Neither did any treasurer since Don Alonso. Each one kept his working copies behind the tapestry.' },
        { text: 'The niche in the east wall. It was there before the Alcázar was, they say. It will be there after.' },
        say(P, '(Behind the tapestry, on the east wall. It is in both times.)', { set: { 'clue.niche': true } }),
      ],
    },
  }),
  simple('benny_office_talk', [
    say(B, 'Patricio. The chest goes to the ships at dawn. My clerk swears he knows where everything is.'),
    say(B, 'He does not. But he knows where everything is hidden, which is better.'),
  ]),
  simple('benny_desk', [nar('Benny\'s maps: the strait, the reefs of Zetwal, the Crown\'s harbors marked in red.')]),
  script('tapestry', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'clue.treasurer_alive' }, to: 'done' },
        { if: { flag: 'clue.niche' }, to: 'niche' },
        { to: 'cloth' },
      ],
    },
    cloth: { lines: [nar('A tapestry of the first Lord of Ardencia, Don Alonso, at the forge. Heavy, and dusty at the edges.')] },
    niche: {
      lines: [
        nar('Behind the tapestry, the stone is loose. Behind the stone, a niche, and in it a ledger tied with cord.'),
        nar('The treasurer\'s working copy. Every page balances. The last page is a note, folded small, the ink fresh.'),
        nar('"I am alive. I am held where the ash falls. Tell her I am alive." His hand, dated this year.', { set: { 'clue.treasurer_alive': true } }),
        say(G, 'Held where? By whom?'),
        say(A, 'Tell his daughter, Gigi. Tell her first.'),
      ],
    },
    done: { lines: [nar('The niche behind the tapestry, empty now.')] },
  }),
  // Old Benny and Nancy (owner, Oct 21: Benny meets the Locket again; Nancy is seen). Benny is wry; he knows more
  // than he says, and says the half that is safe.
  script('benny_old_talk', {
    start: { lines: [], next: [{ if: { flag: 'side.treasurer.done' }, to: 'again' }, { if: { flag: 'side.treasurer.benny_open' }, to: 'meet' }, { to: 'closed' }] },
    closed: { lines: [nar('The old lord is asleep in his chair.')] },
    meet: {
      lines: [
        act([{ do: 'face', actor: 'npc:benny_old', facing: 'player' }], 'benny_old', 'Come into the light, envoy. My eyes are older than the rest of me.'),
        say('benny_old', '...There it is. Patricio\'s sun.'),
        say(G, 'You know the Locket?'),
        say('benny_old', 'I made the other half. A signet, for a lord who did not deserve one yet. Your grandfather made that.'),
        say('benny_old', 'He wore it under his coat at the signing, as if it were a secret. Everybody knew. Nobody said.'),
        act([{ do: 'face', actor: 'npc:nancy', facing: 'player' }], 'nancy', 'Benny. You are staring at the child.'),
        say('benny_old', 'I am old, Nancy. Old men stare. It is the last pleasure we are allowed.'),
        say('nancy', 'Sit with him a moment, envoy. He has been waiting all morning, and pretending he was not.'),
        say(G, 'My grandfather asked me to ask the Lord why you said yes. Fifty years ago.'),
        say('benny_old', 'Ask him, then. My son will tell you something true. He tells the truth very carefully.'),
        say('benny_old', 'Tell Patricio the iron still remembers the sun. He will know what an old fool means.', { set: { 'side.treasurer.done': true } }),
        say(A, 'He has kind eyes, Gigi. Like Grandfather.'),
      ],
    },
    again: { speaker: 'benny_old', lines: [{ text: 'Noon tomorrow. Stand in the ring as if it were yours, envoy. It annoys my son.' }] },
  }),
  simple('nancy_talk', [
    { if: { notFlag: 'side.treasurer.benny_open' }, speaker: '', text: 'A lady in wine-red sits by the old lord, mending.' },
    { if: { flag: 'side.treasurer.benny_open' }, speaker: 'nancy', text: 'He will not say he is glad you came. So I will.' },
  ]),

  // ---- The Upper Town: people and places -----------------------------------------------------------
  script('azzy_court_talk', {
    start: {
      lines: [],
      next: [
        { if: DAY_DONE, to: 'noon' },
        { if: { all: [{ notFlag: 'side.bread.accepted' }, { any: [{ all: [{ flag: 'side.treasurer.done' }, { any: [{ flag: 'debate.ardencia_bread.joined' }, { flag: 'debate.ardencia_bread.mediated' }] }] }] }] }, to: 'bread' },
        { to: 'wait' },
      ],
    },
    wait: {
      speaker: Z,
      lines: [
        { text: 'Noon is hours off.' },
        { if: { notFlag: 'side.treasurer.done' }, text: 'The treasurer\'s daughter is still at the hall gate. She has been there eleven years.' },
        { if: { all: [{ notFlag: 'debate.ardencia_bread.joined' }, { notFlag: 'debate.ardencia_bread.mediated' }] }, text: 'The Lower Town is still arguing about bread. Go and settle it.' },
        { if: { all: [{ flag: 'side.bread.accepted' }, { notFlag: 'side.bread.done' }] }, text: 'And you have not seen my father\'s poor by night. I will be at the Lower Town gate.' },
        say(A, 'Your Quests page, Gigi.'),
      ],
      choices: [
        { if: { notFlag: 'side.bread.accepted' }, text: 'Tell me about the Lower Town.', next: 'bread' },
        { text: 'Later.' },
      ],
    },
    bread: {
      speaker: Z,
      lines: [
        { text: 'My father\'s poor are not starving. There is soup in the Lower Town every day, and no one says who pays.' },
        { text: 'The elders say charity. The elders have never paid for anything in their lives.' },
        { text: 'I do not know why. Come tonight and see. Ask the cook first, by day. Then find me at the Lower Town gate.', set: { 'side.bread.accepted': true } },
      ],
    },
    noon: {
      lines: [
        say(Z, 'Noon.'),
        say(Z, 'Do not hold back in there. He will know if you do, and he will not forgive it.'),
        act(
          [
            { do: 'look', actor: 'npc:azzy_court' },
            { do: 'walk', actor: 'npc:azzy_court', to: at(30, 12), facing: 'right' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'The court gate swings open. Azzy walks onto the sand and takes his place at the ring\'s edge.',
          { set: { 'story.noon': true } },
        ),
      ],
    },
  }),
  simple('azzy_ring_talk', [say(Z, 'The middle of the ring. He will come when you are standing in it.')]),
  simple('court_gate', [nar('The court gate: iron bars, the sand ring beyond. Azzy keeps the key until noon.')]),
  simple('duel_gallery', [nar('The gallery over the sand. The elders sit there to watch the law work.')]),
  simple('dry_fountain', [nar('A fountain with no water in it. Someone has planted iron flowers in the basin.')]),
  simple('forge_arch', [nar('The lower arch, down to the forge fortress. Barred, and guarded on the far side.')]),
  simple('alcazar_banner', [nar('The banner of House Brasador: a black field, a crimson flame, a sword through it.')]),
  simple('alcazar_guard_talk', [say('halberdier', 'The Alcázar is open to the envoy. Weapons sheathed inside.')]),
  simple('town_courier_talk', [say('courier', 'Crown ships off the north cape this morning. Three of them. The Lord has said nothing about it.')]),
  simple('town_gossip_talk', [
    say('town_gossip', 'They say the Lord fought forty men at Cendre and killed every one. They say he never sleeps.'),
    say('town_gossip', 'They say a lot. I say he buys his bread from the same baker as me, and pays.'),
  ]),
  simple('town_veteran_talk', [say('veteran', 'I was at the ford of Cendre. Whatever the songs say, I came home. So did most of the prisoners.')]),
  simple('town_child_talk', [say('town_child', 'Are you going to fight in the ring? Everybody loses to the Lord. My uncle says he lets them.')]),
  simple('ard_smith_talk', [say('ard_smith', 'Brasador steel. Blackened plate for the front, rings for the back. Buy, or stop breathing on my anvil.')]),
  simple('ring_maker_talk', [say('ring_maker', 'Rings, charms, a little iron for luck. Cenizal\'s luck is mostly iron.')]),
  simple('tavern_cook_talk', [say('tavern_cook', 'Pan de ceniza, still warm. Olla, if you are hungry. Café, if you are tired. You look both.')]),

  // ---- The Lower Town: the debate and Bread at Night (Ar-1) ---------------------------------------
  script('amanda_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.bread.done' }, to: 'after' },
        { if: { flag: 'side.bread.accepted' }, to: 'ask' },
        { to: 'soup' },
      ],
    },
    soup: {
      speaker: 'amanda',
      lines: [
        { text: '¡Coma, coma! Bowls on the left, spoons on the right!', translation: 'Eat, eat!' },
        { text: 'Visitors! From over the sea, by the look of you. Nobody that clean was born in Cenizal.' },
        { text: 'I am Amanda. This is my pot. Complaints go in the pot. Everything goes in the pot.' },
      ],
    },
    ask: {
      lines: [
        say(G, 'Who pays for the soup?'),
        say('amanda', 'Who pays? The pot pays. The pot is very generous. I tell it so every morning.'),
        say(G, 'The elders?'),
        say('amanda', 'The elders! Ha! The elders pay for nothing. Not even their own hats. Have you seen their hats?'),
        say('amanda', 'Coma, envoy. And stop asking a cook where the bread comes from. It comes from the oven.', { set: { 'side.bread.cook': true } }),
        say(A, 'She is so loud, Gigi. But none of the children are afraid of her.'),
      ],
    },
    after: {
      speaker: 'amanda',
      lines: [
        { text: 'Still here? Good. Eat. You look like a girl who is about to fight somebody very large.' },
      ],
    },
  }),
  simple('soup_line_a_talk', [say('lower_man', 'Every day. Bread and soup, every day, for three years. Nobody asks for a coin.')]),
  simple('soup_line_b_talk', [say('lower_woman', 'The cook shouts at everyone. She has never once let a child go hungry.')]),
  simple('soup_line_c_talk', [say('lower_man', 'The Lord\'s poor, they call us up the hill. The Lord\'s poor eat better than the Crown\'s.')]),
  script('thumb_barrel', {
    start: {
      lines: [
        nar('Flour barrels by the kitchen door. On each lid, pressed into the wax, the same grey thumbprint.'),
        say(G, 'A thumb dipped in ash. Someone signs these.'),
        { if: { flag: 'side.bread.accepted' }, speaker: '', text: '(Bread at Night: the barrels are marked.)', set: { 'side.bread.thumb': true } },
      ],
    },
  }),
  simple('lower_well', [nar('An old well with a stone lip. From here you can see the whole lane down to the kitchen.')]),
  simple('lower_porter_talk', [say('lower_man', 'Carts come down that lane at night. Covered ones. You did not hear it from me.')]),
  simple('lower_mother_talk', [say('lower_woman', 'If the Crown comes here like it came to Yucayeque, who feeds us then?')]),
  script('azzy_lower_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.cart_night' }, to: 'night' }, { if: { flag: 'side.bread.cook' }, to: 'dusk' }, { to: 'early' }] },
    early: { speaker: Z, lines: [{ text: 'Ask the cook first. She will not tell you anything. Watch how she does not.' }] },
    dusk: {
      speaker: Z,
      lines: [
        { text: 'She told you nothing. Good. Then she is hiding something, and we wait for dark.' },
        { text: 'Night, then.', fx: 'fade', set: { 'story.cart_night': true } },
        nar('The sun goes down behind the walls. Shutters close all down the street, and the lamps go out one by one.'),
        { text: 'The corner by the old well. They will not see us there. Not closer than that.' },
      ],
    },
    night: { speaker: Z, lines: [{ text: 'By the well. Quietly.' }] },
  }),
  // The cart (staged; the party watches from the corner by the well): the driver presses his thumb to the barrel,
  // and the cook comes out to meet it. She is Amanda, Benny's daughter, Rael's sister (Azzy's Titi).
  simple('bread_cart', [
    act(
      [
        { do: 'place', actor: 'azzy', look: 'azzy', at: at(19, 4), facing: 'down' },
        { do: 'look', actor: 'driver' },
        { do: 'enter', actor: 'driver', look: 'porter', from: at(20, 1), to: at(20, 7), facing: 'down', async: true },
        { do: 'enter', actor: 'guard_a', look: 'town_guard', from: at(21, 1), to: at(21, 7), facing: 'down' },
        { do: 'walk', actor: 'driver', to: at(15, 6), facing: 'up' },
      ],
      '',
      'A covered cart creaks down the lane. A driver, two hired guards. No lamps.',
    ),
    say(Z, 'Not closer.'),
    act(
      [
        { do: 'walk', actor: 'npc:amanda', to: at(13, 6), facing: 'right' },
        { do: 'wait', ms: 500 },
      ],
      '',
      'The cook comes out of her kitchen. The sacks come off the cart: flour, beans, salt. The driver presses his thumb to the barrel.',
    ),
    say(G, '(Ash on his thumb. The same mark.)'),
    act([{ do: 'face', actor: 'npc:amanda', facing: 'up' }], 'amanda', 'Who is breathing behind my well? I can hear you breathing! Out!'),
    act([{ do: 'walk', actor: 'azzy', to: at(17, 6), facing: 'left' }], Z, '...Titi Amanda.'),
    say('amanda', 'Azriel Rodriguez! Spying on your own aunt? At night? With guests?'),
    say(Z, 'You said the elders paid for this.'),
    say('amanda', 'Did I? I say a hundred things a day. Some of them are even true. Ask anyone.'),
    say(Z, 'Titi. The thumbprint.'),
    say('amanda', '...Go home, mi amor. Some things in your father\'s city are better not understood before a trial.'),
    act(
      [
        { do: 'exit', actor: 'driver', to: at(20, 1), async: true },
        { do: 'exit', actor: 'guard_a', to: at(21, 1), async: true },
        { do: 'walk', actor: 'npc:amanda', to: at(12, 6), facing: 'down' },
      ],
      'amanda',
      'And eat something, all of you. You are too thin for a war.',
    ),
    say(Z, 'This is not the elders\' charity. The elders do not know this lane exists.'),
    say(G, 'Then whose is it?'),
    say(Z, 'I do not know. And she would not lie to me for nothing.'),
    say(Y, 'In Yucayeque, oil came at night with that same mark. The Crown never found who sent it.'),
    nar('Dawn comes up grey over the walls.', { fx: 'fade', set: { 'side.bread.done': true, 'story.cart_night': false, 'clue.bread_night': true } }),
  ]),

  // ---- The Old Library ------------------------------------------------------------------------------
  simple('ard_librarian_talk', [
    say('librarian', 'La Biblioteca Vieja. The Ash Wars, the trade, the law. Read what you like; put it back where it was.'),
    say('librarian', 'The young lord read every book on that wall before he was twelve. Then he read them again, angrier.'),
  ]),

  // ---- Beat 4: the Trial of Blades ------------------------------------------------------------------
  script('trial_start', {
    start: {
      lines: [
        act(
          [
            ...COURT,
            { do: 'place', actor: 'azzy', look: 'azzy', at: at(30, 12), facing: 'right' },
            { do: 'look', actor: 'rael' },
            { do: 'enter', actor: 'rael', look: 'rael', from: at(31, 4), to: at(35, 9), facing: 'left' },
            { do: 'walk', actor: 'follower', to: at(31, 9), facing: 'right' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'The Alcázar\'s side door opens. Rael walks onto the sand, slowly, hands behind his back, and stops two paces from Gianna.',
        ),
        say(R, 'Zetwal\'s envoy. Patricio\'s granddaughter.'),
        say(R, 'The law is older than I am. No outsider is heard here until she has stood in this ring. Stand, then.'),
        say(G, 'I came to ask you to stand with Xaraguá.'),
        say(R, 'Ask me after.'),
        act([{ do: 'look', actor: 'cresswell' }], 'cresswell', 'The younger one. She lit a city, I am told.'),
        act([{ do: 'look', actor: 'player' }], R, 'Children light candles, envoy.'),
        say(A, 'Gigi...'),
        say(G, 'Behind me, Anissa.', { set: { 'battle.next': 'rael_trial' } }),
      ],
    },
  }),

  // ---- Beat 5: the winner's question (owner decision 1; review 3.2, 7.2) -----------------------------
  // The party kneels, Bound. The court is cleared; Jaime leaves with the elders; Rivera stays at the door, silent.
  // His question, her answer; the two halves glow (story.signet_glowed); four cold sentences. Cresswell comes back
  // for the lie, and the signet glows again. Anissa says so; Gianna, looking at the floor, does not hear it.
  simple('rael_after', [
    act(
      [
        ...COURT,
        { do: 'place', actor: 'azzy', look: 'azzy', at: at(30, 12), facing: 'right' },
        { do: 'place', actor: 'rael', look: 'rael', at: at(35, 9), facing: 'left' },
        { do: 'walk', actor: 'follower', to: at(32, 10), facing: 'up' },
      ],
      '',
      'Sand in her mouth. Cords at her wrists, and at Yari\'s. Anissa, untouched, crouches at her sister\'s side.',
    ),
    say(R, 'The question is asked between the blades. Clear the court.'),
    act(
      [
        { do: 'exit', actor: 'elder_a', to: at(31, 4), async: true },
        { do: 'exit', actor: 'elder_b', to: at(31, 4), async: true },
        { do: 'exit', actor: 'elder_c', to: at(31, 4), async: true },
        { do: 'exit', actor: 'jaime', to: at(31, 4) },
        { do: 'look', actor: 'cresswell' },
        { do: 'wait', ms: 600 },
        { do: 'exit', actor: 'cresswell', to: at(31, 4) },
        { do: 'walk', actor: 'rivera', to: at(31, 5), facing: 'down' },
        { do: 'look', actor: 'player' },
      ],
      '',
      'The elders go. Jaime goes with them. The Crown\'s envoy goes last and slowest. Captain Rivera shuts the door and stays at it.',
    ),
    say(R, 'The law gives the winner one question, and the loser answers it.'),
    say(R, 'Mine: who gave you that locket?'),
    say(G, 'My grandmother. Grandfather made it, for the Accord.'),
    act([{ do: 'walk', actor: 'rael', to: at(33, 9), facing: 'left' }], R, 'And mine made this one.'),
    nar('He takes the Sun Locket from her neck and holds it against the half-sun signet on his hand. Both halves glow.', {
      fx: 'token',
      set: { 'story.signet_glowed': true },
    }),
    say(A, 'It\'s the same light, Gigi. His ring and your locket. They\'re one thing.'),
    say(R, 'Fifty years later, Patricio\'s daughter and Benny\'s son put them together again.'),
    say(R, 'Look at me, Gianna Elise.'),
    say(G, '...No.'),
    say(R, 'Elodie Limyè is my wife. You and your sister are my daughters.'),
    act([{ do: 'face', actor: 'rael', facing: 'down' }], R, 'Azzy is your brother.'),
    act([{ do: 'look', actor: 'azzy' }], Z, 'Father.'),
    act([{ do: 'look', actor: 'player' }], G, 'Why did she never say?'),
    say(R, 'Because of men like the one I just sent out of this court.'),
    say(G, 'Grandfather sent me to you. Did he know?'),
    say(R, 'Patricio knows what Patricio chooses to know.'),
    nar('He puts the Locket back in her hand. Not around her neck. In her hand.'),
    say(R, 'It changes nothing. You lost.'),
    act(
      [
        { do: 'face', actor: 'rael', facing: 'up' },
        { do: 'look', actor: 'cresswell' },
        { do: 'enter', actor: 'cresswell', look: 'cresswell', from: at(31, 4), to: at(33, 6), facing: 'down' },
        { do: 'look', actor: 'player' },
      ],
      '',
      'The door opens. The Crown\'s envoy walks back in and stops at the gallery stair, smiling a little.',
    ),
    say(R, 'Ardencia stands with the Crown.'),
    say(R, 'The envoy of Zetwal broke no law. She will be our guest, under guard, until His Majesty\'s ship takes her to Eightgate.', {
      fx: 'signet',
    }),
    say(A, 'Gigi. His ring lit again.'),
    nar('Gianna does not hear her. She is looking at the sand.'),
    say('cresswell', 'And the younger one?'),
    say(R, 'Goes with her sister. Ardencia does not separate children.'),
    act([{ do: 'face', actor: 'rael', facing: 'right' }], R, 'Captain. The forge fortress. Bind nothing more; they are guests.'),
    act(
      [
        { do: 'walk', actor: 'rivera', to: at(31, 9), facing: 'right' },
        { do: 'wait', ms: 400 },
        { do: 'look', actor: 'azzy' },
        { do: 'face', actor: 'azzy', facing: 'left' },
      ],
      '',
      'Rivera walks them off the sand toward the lower arch. Azzy watches his father give the order, then follows them out.',
      { fx: 'fade', set: { 'story.forge_held': true, 'clue.father_rael': true, 'belief.rael_traitor': true, 'travel.next': 'ardencia-forge/cell' } },
    ),
  ]),

  // ---- Beat 6 and 7: the Lord's guests, and Azzy's distraction --------------------------------------
  // Azzy comes in the same scene, after the captain has gone (review 3.7: the player is never in a cell with
  // nothing to press). The wine, the key left on the bar.
  simple('forge_arrive', [
    act(
      [
        { do: 'place', actor: 'guard_a', look: 'brasador_halberdier', at: at(23, 8), facing: 'right' },
        { do: 'place', actor: 'guard_b', look: 'brasador_halberdier', at: at(23, 10), facing: 'right' },
        { do: 'place', actor: 'rivera', look: 'rivera', at: at(22, 9), facing: 'right' },
      ],
      '',
      'The armory hall of the forge fortress. Three channels of lava cross the floor between the bars and the far wall.',
    ),
    say('rivera', 'Food at dusk. Water now. The Lord\'s guests want for nothing.'),
    act([{ do: 'exit', actor: 'rivera', to: at(21, 1) }], '', 'The captain goes. The cords come off. They did not take her staff, or Yari\'s bow.'),
    say(Y, 'They left us our weapons.'),
    say(G, 'A mage and an archer behind bars and lava. Why would they bother?'),
    say(A, 'Gigi, the air is shimmering. Over the whole hall.'),
    say(G, 'My father sold Xaraguá to the Crown. And now he has sold us.'),
    act(
      [
        { do: 'wait', ms: 900 },
        { do: 'look', actor: 'azzy' },
        { do: 'enter', actor: 'azzy', look: 'azzy', from: at(21, 1), to: at(23, 9), facing: 'right' },
      ],
      Z,
      'My father\'s men drink what my father\'s son pours. The gatehouse, both of you. It is warmer there.',
    ),
    say('halberdier', 'Your father said to stay at the bars, Azriel.'),
    say(Z, 'My father said they are guests. Guests do not run. Come.'),
    act(
      [
        { do: 'exit', actor: 'guard_a', to: at(21, 1), async: true },
        { do: 'exit', actor: 'guard_b', to: at(21, 1), async: true },
        { do: 'face', actor: 'azzy', facing: 'right' },
        { do: 'wait', ms: 500 },
      ],
      '',
      'As he passes the bars he sets the jug down, and the gate key stays on the bar.',
    ),
    say(Z, 'I am a clumsy host.'),
    act([{ do: 'exit', actor: 'azzy', to: at(21, 1) }], '', 'He goes out after them without looking back. Gianna takes the key. The gate opens.', {
      set: { 'story.forge_open': true },
    }),
    say(A, 'He left it on purpose, Gigi.'),
    say(G, '...'),
    say(Y, 'The fire is between us and that far wall. And the wall is blank.'),
    say(A, 'The shimmer starts just outside the bars. Grandfather\'s memory is here.'),
  ]),
  simple('cell_bars', [nar('Iron bars, fused into the floor. The gate in them is locked.')]),
  simple('weapon_racks', [nar('Racks of Brasador halberds, oiled and waiting. Every one chained.')]),
  simple('blank_wall', [
    { if: { notFlag: 'anchor.benny_lever' }, speaker: '', text: 'A blank wall of red stone, between two tapestries. It is warm to the touch.' },
    { if: { all: [{ flag: 'anchor.benny_lever' }, { notFlag: 'party.azzy' }] }, speaker: '', text: 'The wall stands open on a black tunnel. Behind you, somewhere, a bell.' },
  ]),
  simple('lever_rusted', [nar('A lever behind the bellows, rusted solid into the wall. Fifty years since anyone pulled it.')]),
  simple('fused_gate_a', [
    { if: { notFlag: 'anchor.forge_gate_a' }, speaker: '', text: 'The first channel\'s iron gate, fused. The fire runs straight across the walkway.' },
    { if: { flag: 'anchor.forge_gate_a' }, speaker: '', text: 'The first channel\'s gate, fused turned to the right. The fire runs along the wall.' },
  ]),
  simple('fused_gate_b', [
    { if: { notFlag: 'anchor.forge_gate_b' }, speaker: '', text: 'The second channel\'s iron gate, fused. The fire runs straight across the walkway.' },
    { if: { flag: 'anchor.forge_gate_b' }, speaker: '', text: 'The second channel\'s gate, fused turned to the left. The fire runs along the wall.' },
  ]),
  simple('fused_gate_c', [
    { if: { notFlag: 'anchor.forge_gate_c' }, speaker: '', text: 'The third channel\'s iron gate, fused. The fire runs straight across the walkway.' },
    { if: { flag: 'anchor.forge_gate_c' }, speaker: '', text: 'The third channel\'s gate, fused turned to the right. The fire runs along the wall.' },
  ]),

  // ---- The Echo: Benny's armory, the night before the march (SIG-ARD) ----------------------------------
  simple('forge_echo_enter', [
    nar('The hall is cold. The ditches are dry. Men load carts by lamplight, and a forge-master walks the channels.'),
    say(P, '(The armory, the night before Benny sailed for Zetwal. The ditches are empty. The gates turn.)'),
  ]),
  script('forge_echo_return', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'anchor.benny_lever' }, { flag: 'anchor.forge_gate_a' }, { flag: 'anchor.forge_gate_b' }, { flag: 'anchor.forge_gate_c' }, { notFlag: 'party.azzy' }] }, to: 'bell' },
        { if: { flag: 'anchor.benny_lever' }, to: 'wall' },
        { to: 'back' },
      ],
    },
    back: {
      lines: [
        { if: { any: [{ flag: 'anchor.forge_gate_a' }, { flag: 'anchor.forge_gate_b' }, { flag: 'anchor.forge_gate_c' }] }, speaker: A, text: 'Some of the fire moved, Gigi. Not all of it.' },
        { if: { all: [{ notFlag: 'anchor.forge_gate_a' }, { notFlag: 'anchor.forge_gate_b' }, { notFlag: 'anchor.forge_gate_c' }] }, speaker: A, text: 'You\'re back. The fire is still in the way.' },
      ],
    },
    wall: {
      lines: [
        say(A, 'Gigi, the wall! It moved. But the fire is still across the floor.'),
      ],
    },
    bell: {
      lines: [
        nar('The far wall grinds open on a black tunnel, and an alarm bell starts across the fortress.', { fx: 'shake' }),
        act(
          [
            { do: 'look', actor: 'azzy' },
            { do: 'enter', actor: 'azzy', look: 'azzy', from: at(21, 1), to: at(20, 7), facing: 'down', run: true },
          ],
          Z,
          'They are ringing it for me now. The tunnel comes out on the sea road. Go.',
        ),
        say(G, 'Come with us.'),
        act([{ do: 'face', actor: 'azzy', facing: 'up' }, { do: 'wait', ms: 700 }, { do: 'face', actor: 'azzy', facing: 'player' }], '', 'Azzy looks at the yard door. Then at her.'),
        say(Z, 'Behind you.', { set: { 'party.azzy': true } }),
        nar('(Azzy joins the party.)'),
      ],
    },
  }),
  // The same bell, from a save made before it rang (bell_resume).
  simple('forge_bell', [
    nar('An alarm bell starts across the fortress. Shouting from the yard.', { fx: 'shake' }),
    act(
      [
        { do: 'look', actor: 'azzy' },
        { do: 'enter', actor: 'azzy', look: 'azzy', from: at(21, 1), to: at(20, 7), facing: 'down', run: true },
      ],
      Z,
      'They are ringing it for me now. The tunnel comes out on the sea road. Go.',
    ),
    say(G, 'Come with us.'),
    say(Z, 'Behind you.', { set: { 'party.azzy': true } }),
    nar('(Azzy joins the party.)'),
  ]),
  simple('echo_forgemaster_talk', [
    say('echo_forgemaster', 'Marshal. Every channel has a gate. Turn it, and the fire turns with it, left or right.'),
    say('echo_forgemaster', 'The lord likes the walkway clear when we load. Right at the first, left at the middle, right at the last.'),
    say('echo_forgemaster', 'Then the fire runs along the walls, and nobody loses their boots.'),
  ]),
  ...(['a', 'b', 'c'] as const).map((k) => {
    const right = k !== 'b';
    const name = { a: 'first', b: 'middle', c: 'last' }[k];
    return script(`forge_gate_${k}`, {
      start: {
        lines: [nar(`The ${name} channel's gate: an iron leaf on a pin, swung across the dry ditch.`)],
        choices: [
          { text: 'Turn it to the right.', set: { [`anchor.forge_gate_${k}`]: right }, next: right ? 'good' : 'wrong' },
          { text: 'Turn it to the left.', set: { [`anchor.forge_gate_${k}`]: !right }, next: right ? 'wrong' : 'good' },
          { text: 'Leave it.' },
        ],
      },
      good: { lines: [nar('The gate swings over and locks. When the fire comes, it will run along the wall.')] },
      wrong: { lines: [nar('The gate swings over and locks. When the fire comes, it will run across the walkway.')] },
    });
  }),
  script('benny_forge_talk', {
    start: {
      lines: [],
      next: [{ if: { flag: 'anchor.benny_lever' }, to: 'after' }, { to: 'lever' }],
    },
    lever: {
      lines: [
        act([{ do: 'face', actor: 'npc:benny_forge', facing: 'player' }], B, 'Patricio. Come and see something no one else in this house knows about.'),
        say(B, 'Behind the bellows. A lever. If ever my grandchildren need a way out, here it is. The tunnel runs to the sea road.'),
        say(B, 'Your sun and my iron. If a child of mine ever shows you the iron, Patricio, trust the child and not the hand.'),
        say(P, '(...He means me to remember that.)'),
      ],
    },
    after: { lines: [say(B, 'Tell no one. Not even your Anicette. Especially not your Anicette; she would approve.')] },
  }),
  script('benny_lever', {
    start: {
      lines: [nar('A new lever, oiled, set into the wall behind the bellows.')],
      choices: [
        { text: 'Pull the lever.', set: { 'anchor.benny_lever': true }, next: 'pulled' },
        { text: 'Leave it.' },
      ],
    },
    pulled: { lines: [nar('Somewhere deep in the wall, something heavy turns over. Then it is quiet.'), nar('(Anchor: this change will last into the present.)')] },
  }),

  // ---- Beat 8: Benny's tunnel and the sea road -------------------------------------------------------
  simple('tunnel_enter', [
    nar('The wall grinds shut behind them. The tunnel is black, and smells of old lamp oil.', { fx: 'shake' }),
    say(Z, 'Benny\'s tunnel. My grandfather\'s. The lamp hooks are his.'),
    say(A, 'You\'re coming with us, Azzy?'),
    say(Z, 'I am already with you.'),
  ]),
  simple('tunnel_sealed', [nar('Benny\'s wall has closed behind you. There is only one way now.')]),
  simple('lamp_hooks', [nar('Iron lamp hooks in the rock, every ten paces. Each one stamped with a small flame.')]),
  // The bats at the narrow (Azzy's first fight, in the front row); the same narrow again after a Game Over.
  script('tunnel_bats', {
    start: { lines: [], next: [{ if: { flag: 'story.bats_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.bats_seen': true },
      lines: [
        nar('A shriek ahead, in the narrow, and the dark comes apart into wings.', { fx: 'shake' }),
        say(Z, 'Behind me. All of you.', { set: { 'battle.next': 'tunnel_bats' } }),
      ],
    },
    again: { lines: [nar('The bats are still in the narrow, screeching.', { fx: 'shake' }), say(Z, 'Again. Behind me.', { set: { 'battle.next': 'tunnel_bats' } })] },
  }),
  simple('tunnel_bar', [nar('The tunnel\'s mouth, barred from the outside. Daylight round the edges of the planks.')]),
  // The far end: Amanda unbars it from outside (FAMILY.md: she knows Benny's tunnel).
  simple('tunnel_end', [
    nar('Something scrapes on the far side of the planks. A bar lifts.', { set: { 'story.tunnel_unbarred': true } }),
    act(
      [
        { do: 'sync' },
        { do: 'look', actor: 'amanda' },
        { do: 'enter', actor: 'amanda', look: 'amanda', from: at(0, 5), to: at(2, 5), facing: 'right' },
      ],
      'amanda',
      'There you are! I said I would feed you. I did not say breakfast would be in a tunnel!',
    ),
    say(Z, 'Titi. How did you know?'),
    say('amanda', 'I know every hole in this city, mi amor. Your grandfather showed me this one when I was six.'),
    say('amanda', 'Bread in the sack, water in the skin. The sea road is clear for about ten minutes. Run for eleven.'),
    say(G, 'Who sent you?'),
    say('amanda', 'Sent me? Nobody sends me anywhere. Ask your brother. Go!'),
    act([{ do: 'exit', actor: 'amanda', to: at(0, 5) }], '', 'She is gone as fast as she came.'),
  ]),
  // The mouth, dawn, the sea road under the wall: Rael on the parapet with Captain Rivera; the garrison captain
  // Joaquin gives the order, and every shot lands wide (FAMILY.md: on his order). Gianna takes none of it in.
  simple('sea_road_mouth', [
    act(
      [
        { do: 'place', actor: 'rael', look: 'rael', at: at(8, 1), facing: 'down' },
        { do: 'place', actor: 'rivera', look: 'rivera', at: at(9, 1), facing: 'down' },
        { do: 'place', actor: 'joaquin', look: 'joaquin', at: at(10, 1), facing: 'down' },
        { do: 'place', actor: 'musket_a', look: 'brasador_halberdier', at: at(11, 1), facing: 'down' },
        { do: 'place', actor: 'musket_b', look: 'brasador_halberdier', at: at(12, 1), facing: 'down' },
      ],
      '',
      'Dawn, and the sea road under the walls. Up on the parapet, black coats and musket barrels.',
    ),
    act([{ do: 'look', actor: 'rael' }], Z, 'He is on the wall.'),
    nar('Rael looks down at them. At his son. He lifts one hand.'),
    say('rivera', 'Garrison!'),
    say('joaquin', 'Present! ...Fire!', { fx: 'shake' }),
    act([{ do: 'look', actor: 'player' }], '', 'Three cracks. Three puffs of dust in the road, beside Yari\'s boots, behind Azzy\'s heel.'),
    say(Z, 'He saw me.'),
    say(Z, '...He gave it anyway.'),
    say(Y, 'Those were the walls\' best shots. All wide.'),
    say(Z, 'Tío Joaquin has the guns. He taught me to shoot.'),
    say(G, 'Run.'),
  ]),
  simple('sea_road_shots', [
    nar('Another volley from the wall. Dust jumps in the road ahead of them, and behind.', { fx: 'shake' }),
    say(A, 'Gigi, they keep missing. Why do they keep missing?'),
    say(G, 'Don\'t stop and ask them.'),
  ]),
  // Azzy's company: a patrol of four at the bend lowers its halberds and falls in behind him.
  simple('patrol_bend', [
    act(
      [
        { do: 'place', actor: 'sergeant', look: 'brasador_halberdier', at: at(5, 17), facing: 'up' },
        { do: 'place', actor: 'soldier_a', look: 'brasador_halberdier', at: at(6, 17), facing: 'up' },
        { do: 'place', actor: 'soldier_b', look: 'brasador_halberdier', at: at(5, 18), facing: 'up' },
        { do: 'place', actor: 'soldier_c', look: 'brasador_halberdier', at: at(6, 18), facing: 'up' },
      ],
      '',
      'At the bend, four halberdiers bar the road, blades down toward them.',
    ),
    say(Z, 'Let me.'),
    act([{ do: 'look', actor: 'sergeant' }], 'sergeant', '...Captain Azriel.'),
    say(Z, 'I am nobody\'s captain this morning, sergeant.'),
    say('sergeant', 'Not against you, captain. Not today. Not any day.'),
    act(
      [
        { do: 'face', actor: 'sergeant', facing: 'down' },
        { do: 'face', actor: 'soldier_a', facing: 'down' },
        { do: 'face', actor: 'soldier_b', facing: 'down' },
        { do: 'face', actor: 'soldier_c', facing: 'down' },
      ],
      '',
      'The sergeant lowers his halberd. The others follow. They turn, and fall in to walk the road with Azzy.',
    ),
    act(
      [
        { do: 'exit', actor: 'soldier_b', to: at(0, 19), async: true },
        { do: 'exit', actor: 'soldier_c', to: at(0, 20), async: true },
        { do: 'exit', actor: 'soldier_a', to: at(0, 19), async: true },
        { do: 'exit', actor: 'sergeant', to: at(0, 20) },
      ],
      Z,
      'The fishers\' camp is on the strand, west. Your trader will be there, if Patricio told him to wait.',
      { set: { 'story.ardencia_escaped': true } },
    ),
  ]),
  simple('tunnel_mouth_shut', [nar('Benny\'s tunnel. Its wall is shut at the far end now. There is no going back that way.')]),

  // ---- Beat 9: Free Brasador ----------------------------------------------------------------------
  simple('camp_arrive', [
    act(
      [
        { do: 'place', actor: 'sergeant', look: 'free_brasador', at: at(12, 7), facing: 'left' },
        { do: 'look', actor: 'npc:free_soldier_a' },
        { do: 'walk', actor: 'npc:free_soldier_a', to: at(15, 7), facing: 'right' },
      ],
      'free_brasador',
      'Every shot wide, envoy. Those were the best shots in Ardencia.',
    ),
    say(Z, 'Then they missed.'),
    nar('A fire on the strand. The trader\'s boat at anchor. Soldiers in black coats with the sashes torn off: Free Brasador.'),
    say(G, 'My father sold Xaraguá to the Crown, Yari. Then he sold us.'),
    nar('Yari says nothing. She sits down beside her.'),
    say(A, 'He gave the locket back, Gigi.'),
    say(G, 'He gave it back because it is worth nothing to him.'),
    say(Z, 'You are a Rodriguez. There are two of us with a claim to that seat now. I did not want it when it was one.'),
    say(Z, 'This is the copy you were given in the hall. Benny\'s Refusal. Look at the end.'),
    nar('"...the seventh page I will not sign. The bankers of Al-Doria, who witnessed it, hold the signed copy." Benny.'),
    say(Z, 'Bab al-Dhahab. If there is a copy with seven pages, it is in the Dorini vault.'),
    say(Y, 'Then that is where my father\'s harbor is written down.'),
    say('camp_trader', 'The Marshal said wait a week. It has been four days. We sail at first light, envoy.'),
    nar('That night, in the memory the Locket keeps, a young lord of Ardencia sits down at Patricio\'s fire. (Benny joins the Echo party.)', {
      set: { 'story.benny_joined': true, 'ally.free_brasador': true, 'act3.complete': true },
    }),
  ]),
  simple('free_soldier_a_talk', [say('free_brasador', 'We follow the captain. Where he goes, we go. Where are we going?')]),
  simple('free_soldier_b_talk', [say('free_brasador', 'My mother is still in the Lower Town. She will understand. She always understands. That is the worst part.')]),
  simple('free_soldier_c_talk', [say('free_brasador', 'Free Brasador. The sergeant made it up on the road. It sounds better than "deserters".')]),
  simple('camp_quartermaster_talk', [say('free_brasador', 'We took what we could carry from the armory. The captain says the envoy pays fair. Have a look.')]),
  simple('camp_trader_talk', [
    { if: { notFlag: 'act3.complete' }, speaker: 'camp_trader', text: 'The Marshal told me to wait. I wait.' },
    { if: { flag: 'act3.complete' }, speaker: 'camp_trader', text: 'Al-Doria at first light. I hope you like the smell of money.' },
  ]),
  simple('camp_fire', [nar('Driftwood and black stones. Someone is boiling coffee in a helmet.')]),
  simple('trader_boat', [nar('The Zetwal trader, riding at anchor off the black sand. Patricio\'s man kept his word.')]),
];
