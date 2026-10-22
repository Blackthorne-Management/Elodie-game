// Chapter 5, Eightgate: The Parley (docs/quest/reviews/2026-10-21-chapter5-outline.md, its second review of Oct 21 and
// the owner's decision of Oct 21: the Seventh Clause is first read aloud in the Parley, at Elodie's demand, before
// every house). The maps are in tools/maps/seat.ts; tile numbers in the stage directions are theirs.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched by a foe, never named
// by the Crown and never jokes; no jokes in the Hall, in the Archive's Echo or behind the curtain (Samira's pricing
// and Coco's comedy stop at the Hall's steps and the curtain); Elodie is a head of state under Crown eyes and says
// exactly two true things (word for word, guide 5.6), one in public and one in private; nobody says "Rael" and
// "father" in a room with the Crown's clerk or a Sealbearer in it (review 3.1).
//
// Flags: `story.*` progress, `side.seats.*` (Se-5's petition round), `side.deserters.*` (Se-3), `clue.*` the Journal,
// `echo.*` the sealing's own (wiped on the way back), `anchor.ribbon_thread` what the sealing carries back.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { DRAWER_NUMBERS, DRAWER_PLATES, DRAWER_X0 } from '../seatArchive.ts';

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
const E = 'elodie';
const CO = 'coralie';
const R = 'regent';
const H = 'hollis';

/** Elodie's two true lines (guide 5.6 and 5.8, Rael's clue 2), word for word: the public one, then the private one. */
export const ELODIE_LINES = {
  locket: 'Believe what your Locket tells you, not what his mouth does.',
  tested: 'He should never have tested you.',
} as const;

/**
 * Coralie, "Tati Coco": every line that depends on whether she knows the family secret, in one place. Built on
 * Chapter 4's version (she knows, and deflects: it is her sister's to tell). The owner is being asked now; if the
 * answer is that she does not know, only these lines change (and she leaves the fitting room before Elodie speaks).
 */
export const COCO = {
  /** Her welcome in the lane remembers the bazaar (review 3.12). */
  askedHer: 'You found her, then. Did she tell you?',
  notYet: 'Not yet.',
  notInThatHall: 'She will. Not in that Hall.',
  /** To Azzy, once, while Gianna is at the mirror (outline section 9, Claude's call). */
  weddingCoat: 'Rodriguez. You have his shoulders. I made his wedding coat.',
  /** In the fitting room, before Elodie speaks: she stays, pinning. */
  staysPinning: 'I know where every pin goes in this family. Hold still.',
} as const;

/** What Coco still wants done before the bell, worded from the flags (her doorway, and her front room). */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.seats.stage1' }, speaker: CO, text: "Yari's paper is still in her hand." },
  { if: { notFlag: 'debate.seat_voices.settled' }, speaker: CO, text: 'The fountain is still shouting.' },
  { if: { notFlag: 'side.deserters.done' }, speaker: CO, text: 'The pilgrims are still at the gate.' },
];

/** The Seat at evening: the three things done, the veils not on yet. */
const EVE = { all: [{ flag: 'side.seats.stage1' }, { flag: 'debate.seat_voices.settled' }, { flag: 'side.deserters.done' }, { notFlag: 'story.disguised' }] };

/** The petition round (Se-5): a house's door takes the paper once, after the chamberlain's hook. */
const PETITION = (house: string) => ({ all: [{ flag: 'side.seats.accepted' }, { notFlag: `side.seats.${house}` }] });

/** One drawer today: its plate and its carved number (review 3.4: the number is the only thing that is old). */
function presentDrawer(i: number): DialogueScript {
  const plate = DRAWER_PLATES[i]!;
  const n = DRAWER_NUMBERS[i]!;
  return simple(`drawer_slot${i + 1}`, [
    nar(`A brass plate: ${plate}. Under it, worn almost smooth, a number carved into the wood: ${n}.`),
    nar('Locked.'),
  ]);
}

/** The memory's line when the thread goes on a wrong drawer: the clerk looks up, and the filing plays again. */
function refile(x: number): DialogueLine[] {
  return [
    act([{ do: 'look', actor: 'npc:echo_throne_clerk' }, { do: 'face', actor: 'npc:echo_throne_clerk', facing: 'player' }], '', 'Nothing is in this one. The clerk looks up.'),
    nar('The memory shivers and starts again. The thread is back on the table; the page is back in the clerk\'s hand.', {
      fx: 'flash',
      set: { 'echo.thread': false, 'echo.filed': false },
    }),
    act(
      [
        { do: 'walk', actor: 'npc:echo_throne_clerk', to: at(x, 2), facing: 'up' },
        { do: 'wait', ms: 600 },
        { do: 'walk', actor: 'npc:echo_throne_clerk', to: at(13, 6), facing: 'down' },
        { do: 'look', actor: 'player' },
      ],
      '',
      'He seals the seventh page with the Throne\'s wax again, and files it again: the fourth drawer from the left. Carved 4.',
      { set: { 'echo.filed': true } },
    ),
  ];
}

/** One drawer fifty years ago: numbers only, 1 to 7 in their old order. Drawer 4 is the anchor (the thread). */
function echoDrawer(n: number): DialogueScript {
  const x4 = DRAWER_X0 + 3;
  if (n === 4) {
    return script('drawer_e4', {
      start: {
        lines: [],
        next: [
          { if: { flag: 'anchor.ribbon_thread' }, to: 'tied' },
          { if: { all: [{ flag: 'echo.thread' }, { flag: 'echo.filed' }] }, to: 'tie' },
          { to: 'locked' },
        ],
      },
      locked: { lines: [nar('Drawer 4, carved on its front. Locked. The clerk has the key.')] },
      tie: {
        lines: [
          nar('Patricio ties the red thread round the handle of drawer 4, tight, twice.', { set: { 'anchor.ribbon_thread': true, 'echo.thread': false } }),
          act([{ do: 'look', actor: 'npc:echo_thomas' }], '', 'The clerk does not see it. The boy in the gallery does.'),
          act([{ do: 'look', actor: 'player' }], P, '(Fifty years is a long time for a thread. Let it hold.)'),
        ],
      },
      tied: { lines: [nar('Drawer 4. A red thread is tied round its handle.')] },
    });
  }
  return script(`drawer_e${n}`, {
    start: { lines: [], next: [{ if: { flag: 'echo.thread' }, to: 'wrong' }, { to: 'look' }] },
    look: { lines: [nar(`Drawer ${n}, carved on its front. Empty.`)] },
    wrong: { lines: refile(x4) },
  });
}

export const SEAT_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0 and 1: the caravan at the Gold Gate, and the herald -------------------------------------------
  simple('seat_arrive', [
    nar('Nine days of dust. Then walls the colour of old bone, and a gate of gold that shuts behind the last camel.', { fx: 'fade' }),
    nar('Eightgate, the Seat of the realm. Every house may come here. None may draw steel inside its walls, they say.'),
    say(S, 'Eight gates and one toll-keeper. Whoever holds this city taxes the whole realm for walking.'),
    say(A, "Mama's here, Gigi."),
    say(G, 'Yes.'),
    act(
      [
        { do: 'look', actor: 'npc:caravan_master_seat' },
        { do: 'walk', actor: 'npc:caravan_master_seat', to: at(26, 10), facing: 'right' },
      ],
      'caravan_master',
      'The Dorini flag got you through the gate. It will not get you through a door.',
    ),
    say('caravan_master', "Everything inside the walls is the Throne's, and the Throne is the Regent's. For now."),
    act([{ do: 'walk', actor: 'npc:caravan_master_seat', to: at(22, 7), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'He goes back to his mules.'),
    say(Y, 'Grey and violet at the inner arch, Gigi. The Regent\'s colours.'),
  ]),
  // At the inner arch: the Sealbearer reads the papers and looks at Anissa; the herald comes for them (review 3.7).
  simple('herald_arch', [
    act([{ do: 'look', actor: 'npc:sealbearer' }, { do: 'face', actor: 'npc:sealbearer', facing: 'player' }], 'sealbearer', 'Papers.'),
    nar('He reads them, and does not give them back. He looks at Anissa a breath too long. Then at the papers again.'),
    act([{ do: 'walk', actor: 'follower', to: at(4, 10), facing: 'left' }], 'sealbearer', 'Your papers say envoy. A house has one voice at a Parley, and Zetwal\'s is already seated.'),
    say('sealbearer', "Zetwal's envoy's household. The Lord Regent is informed of every arrival. Wait here."),
    nar('He hands the papers back.'),
    act(
      [
        { do: 'look', actor: 'herald' },
        { do: 'enter', actor: 'herald', look: 'herald', from: at(0, 10), to: at(2, 10), facing: 'right' },
        { do: 'wait', ms: 500 },
      ],
      '',
      'A herald in Aldermoor violet comes through the arch, and bows exactly as low as the papers require.',
    ),
    say('herald', "Gianna Elise Limyè. The Lord Regent receives Zetwal's envoy's party at the Hall, under the truce of the Parley."),
    say('herald', 'Now, if it please you. It pleases him.'),
    act([{ do: 'exit', actor: 'herald', to: at(0, 10) }, { do: 'look', actor: 'player' }], '', 'He turns and walks back through the arch without looking to see if they follow.', {
      set: { 'story.herald_met': true },
    }),
    say(G, 'Stay close, Nissa.'),
  ]),
  simple('inner_arch', [say('sealbearer', 'Wait here. The Lord Regent is informed of every arrival.')]),
  simple('yard_road_closed', [say('sealbearer', "The Lord Regent receives Zetwal's envoy's household first. The road waits.")]),
  simple('caravan_master_seat_talk', [say('caravan_master', 'The camels go home to Al-Doria in three days. You will not, I think.')]),
  simple('seat_gate_clerk_talk', [say('seat_gate_clerk', 'Gate of Gold. Dorini caravans in. Nothing out until the Parley closes, by order.')]),
  simple('sealbearer_talk', [
    { if: { notFlag: 'story.archive_open' }, speaker: 'sealbearer', text: 'Move along. The Lord Regent is informed.' },
    { if: { flag: 'story.archive_open' }, speaker: 'sealbearer', text: 'Seamstresses. Keeper. Parley. Move along.' },
  ]),
  simple('seat_contract_board', [
    nar('The contract board: escorts wanted on the crossroads road, a damaged ledger to be copied for the Archive.'),
    nar('Pinned over the rest, in the Regent\'s violet: "There are no deserters on the roads of the Seat."'),
  ]),
  simple('gold_gate_shut', [nar('The Gold Gate, Al-Doria\'s, shut behind the caravan. Its gold leaf is worn through to the iron at hand height.')]),
  simple('dorini_crates', [nar('Dorini crates under the guild\'s seal, bound for the Regent\'s treasury.')]),

  // ---- Beat 2: the Concourse, behind the herald ------------------------------------------------------------
  simple('concourse_arrive', [
    nar('The Eight Gates Concourse: a ring road round a fountain, and in the ring wall the realm\'s gates, each in its house\'s colours.'),
    act(
      [
        { do: 'place', actor: 'yari', look: 'yari', at: at(22, 10), facing: 'up' },
        { do: 'look', actor: 'yari' },
        { do: 'walk', actor: 'yari', to: at(15, 1), facing: 'up' },
        { do: 'wait', ms: 900 },
      ],
      '',
      'Yari steps out of the line and stops in front of a gate bricked up in teal stone. She says nothing.',
    ),
    act([{ do: 'walk', actor: 'yari', to: at(22, 10), facing: 'up' }, { do: 'look', actor: 'npc:seat_halberdier' }], '', 'She comes back into the line without a word.'),
    act(
      [{ do: 'face', actor: 'npc:seat_halberdier', facing: 'player' }],
      '',
      'Under a Brasador banner at the north gate, two halberdiers see Azzy and salute. He does not salute back.',
    ),
    act([{ do: 'look', actor: 'npc:sealbearer' }], '', 'On the Hall\'s west flank, a door with a chain across it, and two Sealbearers at the chain.'),
    act([{ do: 'look', actor: 'player' }], S, 'Twelve thousand dinar in that roof. Not one lamp lit.', { set: { 'story.concourse_seen': true } }),
    say(G, 'The herald is waiting on the steps.'),
  ]),
  simple('herald_talk', [say('herald', 'The Lord Regent is within. After you, envoy\'s household.')]),
  simple('seat_halberdier_talk', [say('halberdier', 'Ardencia\'s gate, envoy. We salute the Lord\'s son. He does not have to salute back.')]),
  simple('gate_xaragua', [nar('Xaraguá\'s gate, bricked up in teal stone. The mortar is newer than the bricks.')]),
  simple('gate_ardencia', [nar('Ardencia\'s gate: red iron, a Brasador banner. The road north to the black cliffs.')]),
  simple('gate_zetwal', [nar('Zetwal\'s gold gate, shut for the Parley. A notice on it: "By order of the Lord Regent, until the Parley closes."')]),
  simple('gate_aldermoor', [nar('Aldermoor\'s gate, the Crown\'s: violet, and the only one with Sealbearers on both sides of it.')]),
  simple('gate_jwaladesh', [nar('Jwaladesh\'s gate: brass, gone green. Through the bars, the road south-west, empty.')]),
  simple('gate_kuroshi', [nar('Kuroshi\'s gate: black lacquer and a closed screen. Nobody has come through it all season.')]),
  script('gate_skarragol', {
    start: { lines: [], next: [{ if: { flag: 'act5.complete' }, to: 'open' }, { to: 'shut' }] },
    shut: { lines: [nar('The Iron Gate, Skarragol\'s: grey iron, and a horse-tail standard pole with no standard on it.')] },
    open: { lines: [nar('The Iron Gate stands open on the winter road east.')] },
  }),
  simple('seat_fountain', [nar('A fountain of eight spouts, one for each house. Seven run. Xaraguá\'s is dry.')]),
  simple('seat_market_talk', [say('seat_market', 'Good day to you, traveller. Something from every capital, at Seat prices.')]),
  simple('seat_outfitter_talk', [say('seat_outfitter', 'Madam. Do come in. The Parley dresses for the Hall, and the Hall is cold.')]),

  // ---- Beat 3: the Regent's welcome (the Hall), and Elodie under Crown eyes -------------------------------
  simple('hall_welcome', [
    act(
      [{ do: 'look', actor: 'npc:regent' }, { do: 'wait', ms: 600 }],
      '',
      'At the end of the nave, a dais, and on it a tile of carved stone: the sun and its eight rays, as on the board.',
    ),
    nar('A thin grey man stands at the Throne\'s foot with one hand on its arm. He does not sit. He does not come down.'),
    say(R, 'Gianna Elise Limyè, junior archivist of the Temple of Elodie.'),
    say(R, 'Yari of the cacique\'s house. Your father is well, I am told, under guard in the customs house.'),
    say(R, 'Azriel Rodriguez of Ardencia. Your father\'s compliments reached me before you did.'),
    say(R, 'And a Dorini, lately expelled, whose mother holds a contract with my treasury.'),
    act([{ do: 'walk', actor: 'follower', to: at(21, 15), facing: 'up' }], '', 'He looks at Anissa for the length of one breath, and says nothing to her.'),
    nar('Azzy\'s hand goes to his sword. Gianna\'s hand goes to Azzy\'s wrist.'),
    say(R, 'No steel inside the walls, by the old courtesy. Keep your sword, Brasador. You will find no one to use it on.'),
    say(R, 'Lord Rael promised you to me by ship. You came by caravan.'),
    say(R, 'You have come to read a page. Everyone who comes to Eightgate comes to read a page.'),
    say(R, 'The Archive is sealed for the Parley, by my order. The realm\'s memory rests while the realm talks.'),
    say(R, 'When the Parley closes, petition the keeper like anyone else.'),
    act([{ do: 'face', actor: 'npc:regent', facing: 'left' }], R, 'Envoy. Your household will want you. The Parley sits again at the bell.', { set: { 'story.regent_met': true } }),
    act([{ do: 'exit', actor: 'npc:regent', to: at(26, 2) }, { do: 'look', actor: 'npc:elodie_hall' }], '', 'He goes up the heralds\' stair. The Crown\'s clerk stays, writing.'),
    // Elodie, under Crown eyes: a courtier's distance, the clerk at her shoulder (review 3.1).
    act(
      [
        { do: 'walk', actor: 'npc:elodie_hall', to: at(18, 14), facing: 'right', async: true },
        { do: 'walk', actor: 'npc:parley_clerk', to: at(17, 15), facing: 'right' },
      ],
      '',
      'Elodie, in the envoy\'s gold, walks to them and stops at a courtier\'s distance. Not a mother\'s.',
    ),
    say(E, 'The Regent is generous. Zetwal thanks him.'),
    say(G, 'Mother. In Ardencia, Lord Rael—'),
    say(E, "The envoy's household will report to the envoy's rooms."),
    nar('The clerk\'s pen scratches. While it does, she looks at the Locket, not at her daughter, and speaks low.'),
    say(E, ELODIE_LINES.locket, { set: { 'clue.elodie_locket_line': true } }),
    say(E, 'Your aunt is in the city. She is dressing the court for the Parley, and has asked for you both since the caravan was sighted.'),
    say(E, 'The Envoys\' Quarter, south of the fountain. The door with every colour on it. Go.'),
    act(
      [
        { do: 'walk', actor: 'npc:elodie_hall', to: at(2, 11), facing: 'left', async: true },
        { do: 'walk', actor: 'npc:parley_clerk', to: at(2, 12), facing: 'left' },
        { do: 'look', actor: 'player' },
      ],
      '',
      'She goes back to Zetwal\'s chamber. The clerk follows her in.',
      { set: { 'story.elodie_hall': true } },
    ),
    say(A, "She didn't look at me, Gigi."),
    say(G, 'She looked at the man writing down what she said.'),
  ]),
  // On the way out: the Master of the Chairs and Se-5 (the outline 7.2).
  script('chamberlain_hook', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:chamberlain' }, { do: 'walk', actor: 'npc:chamberlain', to: at(24, 27), facing: 'left' }], 'chamberlain', "Envoy's household. A moment, for the Master of the Chairs."),
        act([{ do: 'look', actor: 'player' }], '', 'He points his staff past them at the eight chairs before the Throne. Every one is empty.'),
        say('chamberlain', 'Eight chairs. Seven envoys. And the eighth house sends its son, not an envoy.'),
        say(Z, 'My father sends nobody.'),
        say(Y, "And Xaraguá's chair?"),
        say('chamberlain', 'Is a chair. Xaraguá is not a signatory. Its door is bricked, and its Petition of Breach was never heard.'),
        nar('Yari takes a bundle of folded pages out of her quiver: the petition, in her father\'s hand, copied out.'),
        say(Y, 'My father wrote it. I carry the copies.'),
        say('chamberlain', 'I am the Master of the Chairs, not of doors. If someone carried that to every chamber, the record would show it.'),
      ],
      choices: [
        { text: 'We will carry it.', set: { 'side.seats.offered': true, 'side.seats.accepted': true, 'item.petition': true }, next: 'yes' },
        { text: 'Not now.', set: { 'side.seats.offered': true }, next: 'no' },
      ],
    },
    yes: {
      lines: [
        say('chamberlain', 'Seven doors and a wall. I keep no list of who answers. Keep your own.'),
        act([{ do: 'walk', actor: 'npc:chamberlain', to: at(33, 28), facing: 'left' }], Y, 'Every door, Gigi. Even the bricked one.'),
      ],
    },
    no: { lines: [act([{ do: 'walk', actor: 'npc:chamberlain', to: at(33, 28), facing: 'left' }], 'chamberlain', 'The chairs will wait. They are good at it.')] },
  }),
  script('chamberlain_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.seats.stage1' }, to: 'after' },
        {
          if: {
            all: ['al_doria', 'skarragol', 'kuroshi', 'jwaladesh', 'aldermoor', 'ardencia', 'zetwal', 'xaragua'].map((h) => ({ flag: `side.seats.${h}` })),
          },
          to: 'report',
        },
        { if: { flag: 'side.seats.accepted' }, to: 'round' },
        { to: 'offer' },
      ],
    },
    offer: {
      lines: [say('chamberlain', 'Eight chairs, envoy\'s household. Xaraguá\'s petition was never carried to a chamber. Will you carry it?')],
      choices: [
        { text: 'We will carry it.', set: { 'side.seats.offered': true, 'side.seats.accepted': true, 'item.petition': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: { lines: [say('chamberlain', 'Seven doors and a wall. I keep no list of who answers. Keep your own.')] },
    round: { lines: [say('chamberlain', 'Seven doors and a wall. The record does not show it carried until it is carried.')] },
    report: {
      lines: [
        say('chamberlain', 'Seven answers, one empty chair and one wall.'),
        say('chamberlain', 'The chairs fill at a Claim, not a Parley. Bring me a token of goodwill from every house that will sit with you.'),
        say('chamberlain', 'I will put each on its chair the day someone stands on that tile.', { set: { 'side.seats.stage1': true } }),
        say(Y, 'Then we will bring them. Every one.'),
      ],
    },
    after: { lines: [say('chamberlain', 'A token from every house that will sit with you. The chairs are patient. So am I.')] },
  }),
  // The petition round (Se-5 stage 1): seven doors and a wall. Yari speaks; Gianna stands beside her.
  script('envoy_dorini_talk', {
    start: { lines: [], next: [{ if: PETITION('al_doria'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say('envoy_dorini', 'The Dorini sit at every Parley. We find it profitable.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach. For Al-Doria's chamber."),
        nar('The guild\'s envoy takes it, reads the first line, and files it in a folder without reading the second.'),
        say('envoy_dorini', 'The bank witnessed. The bank does not sign.'),
        say(S, 'The bank was paid.'),
        nar('He does not look at her.', { set: { 'side.seats.al_doria': true } }),
      ],
    },
  }),
  script('envoy_ironvow_talk', {
    start: { lines: [], next: [{ if: PETITION('skarragol'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say('envoy_ironvow', 'Ironvow has no standard this season. Do not ask me why. Ask Ordvik.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach. For Skarragol's chamber."),
        nar('A big woman in grey felt, with no standard on her brooch. She reads it standing.'),
        say('envoy_ironvow', 'I would swear to this on the standard. We have no standard this season. Ask me again when we do.'),
        nar('She looks at Azzy a moment longer than at anyone else.'),
        say('envoy_ironvow', 'Your mother\'s people would know you, boy.', { set: { 'side.seats.skarragol': true } }),
        say(Z, '...'),
      ],
    },
  }),
  script('envoy_suzumori_talk', {
    start: { lines: [], next: [{ if: PETITION('kuroshi'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say('envoy_suzumori', 'Kirinoura listens at every Parley. It is what we are for.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach. For Kuroshi's chamber."),
        nar('Suzumori\'s envoy reads it twice, folds it along its old creases, and hands it back unsigned.'),
        say('envoy_suzumori', 'Kirinoura is neutral. It is written down. Everything about us is written down.', { set: { 'side.seats.kuroshi': true } }),
      ],
    },
  }),
  script('envoy_agnivansh_talk', {
    start: { lines: [], next: [{ if: PETITION('jwaladesh'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say('envoy_agnivansh', 'The Hall is cold, envoy. Agnipur\'s flame is far away.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach. For Jwaladesh's chamber."),
        nar('Agnivansh\'s envoy, in a coat too thin for the Hall, holds it a long time.'),
        say('envoy_agnivansh', 'The flame is low. We came to this Parley to sell a sacred thing to the Crown, and I am the one who has to say so.'),
        say('envoy_agnivansh', 'Give me the paper. I will hold it, at least.', { set: { 'side.seats.jwaladesh': true } }),
      ],
    },
  }),
  script('legate_talk', {
    start: { lines: [], next: [{ if: PETITION('aldermoor'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say('legate', 'The Crown is represented. That is all the Crown needs to be.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach. For Aldermoor's chamber."),
        say('legate', 'The Crown does not receive petitions against the Crown.'),
        act(
          [{ do: 'look', actor: 'npc:legate_aide' }, { do: 'walk', actor: 'npc:legate_aide', to: at(40, 12), facing: 'left' }],
          'legate_aide',
          'Terribly sorry. I will take that. The legate does not read everything put on his table.',
        ),
        say('legate_aide', 'Somebody should.', { set: { 'side.seats.aldermoor': true } }),
        act([{ do: 'look', actor: 'player' }], '', 'The legate looks at the ceiling until his aide is back at his shoulder.'),
      ],
    },
  }),
  simple('legate_aide_talk', [say('legate_aide', 'Terribly sorry, envoy. The legate is not receiving. I am, a little.')]),
  script('elodie_hall_talk', {
    start: { lines: [], next: [{ if: PETITION('zetwal'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [say(E, 'The envoy is occupied with the Parley.'), nar('The clerk writes that down too.')] },
    petition: {
      lines: [
        say(Y, "Xaraguá's Petition of Breach, envoy. For Zetwal's chamber."),
        nar('Elodie takes it as the envoy, with the clerk at her shoulder. She reads every line.'),
        say(E, 'I will read it into the Parley. The record will show that Zetwal did.', { set: { 'side.seats.zetwal': true } }),
      ],
    },
  }),
  simple('parley_clerk_talk', [nar('The Crown\'s clerk writes. He does not look up.')]),
  script('chamber_ardencia', {
    start: { lines: [], next: [{ if: PETITION('ardencia'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [nar('Ardencia\'s chamber. Empty: the banner hung, the dust on the chair undisturbed.')] },
    petition: {
      lines: [
        act(
          [
            { do: 'place', actor: 'azzy', look: 'azzy', at: at(3, 20), facing: 'left' },
            { do: 'look', actor: 'azzy' },
            { do: 'walk', actor: 'azzy', to: at(2, 19), facing: 'left' },
            { do: 'wait', ms: 1100 },
          ],
          '',
          'The chamber is empty. Azzy goes in alone, and leaves the petition on the chair, in the dust.',
        ),
        act([{ do: 'walk', actor: 'azzy', to: at(3, 20), facing: 'right' }, { do: 'look', actor: 'player' }], Z, 'He sends his son.', { set: { 'side.seats.ardencia': true } }),
      ],
    },
  }),
  script('chamber_xaragua', {
    start: { lines: [], next: [{ if: PETITION('xaragua'), to: 'petition' }, { to: 'idle' }] },
    idle: { lines: [nar('Xaraguá\'s chamber door, bricked up in teal stone.')] },
    petition: {
      lines: [
        act(
          [
            { do: 'place', actor: 'yari', look: 'yari', at: at(3, 16), facing: 'left' },
            { do: 'look', actor: 'yari' },
            { do: 'walk', actor: 'yari', to: at(2, 15), facing: 'left' },
            { do: 'wait', ms: 1200 },
          ],
          '',
          'Yari puts the last copy against the bricked door, and holds it there with her palm.',
        ),
        act([{ do: 'walk', actor: 'yari', to: at(3, 16), facing: 'right' }, { do: 'look', actor: 'player' }], '', 'She says nothing.', { set: { 'side.seats.xaragua': true } }),
      ],
    },
  }),
  simple('chamber_zetwal', [nar('Zetwal\'s chamber. The Crown\'s clerk sits outside it, writing.')]),
  simple('chamber_al_doria', [nar('Al-Doria\'s chamber: green and gold, and a moneychanger\'s scale over the door.')]),
  simple('chamber_aldermoor', [nar('Aldermoor\'s chamber: violet, the Crown\'s. The door is shut and the legate is outside it.')]),
  simple('chamber_skarragol', [nar('Skarragol\'s chamber: grey felt over the door, and a horse-tail pole with nothing on it.')]),
  simple('chamber_kuroshi', [nar('Kuroshi\'s chamber: a lacquered screen. Someone behind it is writing.')]),
  simple('chamber_jwaladesh', [nar('Jwaladesh\'s chamber: a brass lamp over the door, not lit.')]),
  ...(['zetwal', 'ardencia', 'al_doria', 'aldermoor', 'skarragol', 'kuroshi', 'jwaladesh'] as const).map((house) =>
    simple(`chair_${house}`, [nar('A council chair, empty. At a Parley the envoys stand; the chairs fill only at a Claim.')]),
  ),
  simple('chair_xaragua', [nar('Xaraguá\'s chair: the eighth, with no chamber behind it but a wall.')]),
  simple('throne_tile', [nar('The Throne: a tile of carved stone on the dais, the sun and its eight rays. Nobody has stood on it in fifty years.')]),
  simple('throne_rope', [nar('A violet rope on brass posts. The Throne is behind it.')]),
  simple('regent_offices', [nar('The Regent\'s offices, behind the Throne. Shut.')]),
  simple('heralds_stair', [nar('The heralds\' stair, up to the gallery and the Regent\'s rooms. A Sealbearer\'s shadow on every step.')]),
  script('regent_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.terms_refused' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [say(R, 'The Parley sits at the bell, envoy\'s household.')] },
    after: { lines: [say(R, 'The roads are open. They always were. I will be here.')] },
  }),
  simple('hall_herald_talk', [say('herald', 'The Hall of the Throne. Speak when the Lord Regent speaks to you.')]),

  // ---- Beat 4: Tati Coco (the Quarter, then her workshop) ------------------------------------------------
  simple('coco_welcome', [
    act(
      [
        { do: 'look', actor: 'coralie' },
        { do: 'enter', actor: 'coralie', look: 'coralie', from: at(18, 6), to: at(14, 8), run: true },
      ],
      '',
      'Before they reach the painted door it flies open, and a tall woman in eight colours comes out at speed, pins in her mouth.',
    ),
    nar('She walks straight through Yari and Azzy to the sisters, and takes both their faces in her hands.'),
    say(CO, "Gold. I said gold when you were four, and I was right. And indigo. Don't argue. I dress queens; I don't ask them."),
    nar('Anissa says nothing and leans into it. Coco holds on a moment longer for her than for Gianna.'),
    say(CO, 'There you are.'),
    say(CO, COCO.askedHer),
    say(G, COCO.notYet),
    say(CO, COCO.notInThatHall),
    say(CO, 'Inside. All of you. The lane has ears, and most of them are violet.'),
    act([{ do: 'exit', actor: 'coralie', to: at(18, 6) }, { do: 'look', actor: 'player' }], '', 'She goes back in, leaving the painted door open.', {
      set: { 'story.coco_met': true },
    }),
  ]),
  simple('coco_plan', [
    act([{ do: 'place', actor: 'coralie', look: 'coralie', at: at(12, 7), facing: 'down' }], '', 'Coco\'s front room: eight dummies in eight colours, and a curtain across the back.'),
    say(CO, 'Your mother sent you. Of course she did. She can\'t be seen to.'),
    say(CO, 'Now. Business. I dress the court for this Parley: the Regent\'s household, the seven envoys, and the keeper of the Archive.'),
    say(CO, 'Keeper Hollis. He has not left the Archive in eleven years, and he will not for a Regent. So his robes go to him.'),
    say(CO, 'My seamstresses carry them in past the Sealbearers each morning at the bell. Two seamstresses. Two veils, two aprons.'),
    say(CO, 'And neither of you is built like a Brasador.'),
    say(Z, 'Absolutely not.'),
    say(CO, "I wasn't offering. You'd tear the seams."),
    act([{ do: 'face', actor: 'coralie', facing: 'left' }], '', 'Gianna has gone to the mirror. Coco measures Azzy with her eyes.'),
    say(CO, COCO.weddingCoat),
    nar('She says nothing more, and Azzy does not ask.'),
    act([{ do: 'face', actor: 'coralie', facing: 'down' }], CO, 'Yari, Azzy, Samira: tomorrow you stay with me. Three more pairs of hands, and a Dorini to price the thread.'),
    say(S, 'Two hundred, that indigo. The thread alone.'),
    say(CO, 'Three. Quiet.'),
    say(CO, 'The bell is tomorrow\'s. Until the bell, be seen. The Regent counts who stands where. Stand in a lot of places.'),
    say(CO, 'Your friend with the bow has a paper she wants every house to read. The fountain has four people shouting about your chair.'),
    say(CO, 'And the pilgrims at the gate were robbed by the Crown\'s own, and nobody in this city will say so out loud.', { set: { 'story.coco_plan': true } }),
    say(A, 'Your Quests page, Gigi.'),
  ]),
  script('coralie_seat_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'story.disguised' }, { notFlag: 'story.archive_open' }] }, to: 'chain' },
        { if: { all: [{ flag: 'story.archive_open' }, { notFlag: 'story.hollis_agreed' }] }, to: 'sleeve' },
        { if: EVE, to: 'bed' },
        { to: 'day' },
      ],
    },
    day: { lines: [...LEFT, say(CO, 'Until the bell, be seen. Stand in a lot of places.')] },
    bed: { lines: [say(CO, 'Bed. The bell is early and I am not.'), say(A, 'Coco\'s beds, Gigi. In the workshop.')] },
    chain: { lines: [say(CO, 'Chain first, then gossip. Walk like a seamstress: tired, and late.')] },
    sleeve: { lines: [say(CO, 'I have about as long as a sleeve takes. Go and look at your page.')] },
  }),
  simple('crown_wing', [nar('The Crown\'s guarded wing. Zetwal\'s envoy\'s rooms are inside. The Crown\'s clerk sits outside them.')]),
  simple('coco_door_paint', [nar('A door painted in all eight colours, none of them quite the house\'s own. Coco\'s, then.')]),
  simple('drying_cloth', [nar('Bolts of cloth drying on lines across the lane: violet, gold, green, grey, indigo, saffron, red.')]),
  simple('embassy_porter_talk', [say('embassy_porter', 'Embassy of Al-Doria. The envoy is at the Hall. The envoy is always at the Hall.')]),
  simple('curtain', [nar('A heavy curtain across the back of the workshop. Behind it, the fitting room.')]),
  simple('coco_dummies', [nar('Robes on dummies for the Parley: one in every house\'s colour, and one in plain grey for the keeper.')]),
  simple('workshop_window', [nar('The window on the lane. Anyone in it can see in, if they look.')]),

  // ---- Beat 6: the seamstresses (the workshop at the bell, the chain, the Archive) --------------------------
  simple('seamstresses', [
    nar('Night in Coco\'s workshop. Everyone sleeps but Coco.', { fx: 'fade' }),
    nar('Then the bell, over the whole city.'),
    act([{ do: 'place', actor: 'coralie', look: 'coralie', at: at(12, 7), facing: 'down' }], CO, 'Up. Veils. Aprons. Pins in your mouths, and nothing else in them.'),
    act([{ do: 'sync' }], '', 'She pins a white veil over each sister\'s hair and ties an apron at each waist.', {
      set: { 'story.disguised': true },
    }),
    say(CO, 'Yari, Azzy, Samira: you are thread-pullers today. Stay here and look busy.'),
    say(Y, 'Read it for me, Gigi.'),
    act([{ do: 'sync' }], S, "If they take the robes, I've invoiced them.", { set: { 'story.party_split': true } }),
    say(CO, 'To the Archive. Carry the robes. Walk like a seamstress: tired, and late.'),
    act([{ do: 'exit', actor: 'coralie', to: at(10, 10) }, { do: 'look', actor: 'player' }], '', 'She sweeps out with the keeper\'s grey robe over her arm.'),
  ]),
  simple('archive_chain_closed', [say('sealbearer', 'The Archive is sealed for the Parley, by order of the Lord Regent.')]),
  simple('archive_chain', [
    act([{ do: 'look', actor: 'npc:coralie_seat' }, { do: 'walk', actor: 'npc:coralie_seat', to: at(9, 7), facing: 'up' }], 'sealbearer', 'Two yesterday. Two today. Names.'),
    say(CO, 'Count them, then. Two.'),
    say(CO, 'Shall I tell the Lord Regent his keeper sat the Parley in his nightshirt, because your door counts to two but not three?'),
    say(CO, 'Chain.'),
    act([{ do: 'look', actor: 'npc:sealbearer' }, { do: 'walk', actor: 'npc:sealbearer', to: at(8, 6), facing: 'right' }, { do: 'sync' }], '', 'He lifts the chain.', {
      set: { 'story.archive_open': true },
    }),
    act([{ do: 'exit', actor: 'npc:coralie_seat', to: at(9, 6) }], '', 'Coco goes under it first, talking. The sisters follow with the robes.'),
    act([{ do: 'look', actor: 'player' }], '', 'Anissa walks under it last. The Sealbearer watches her go, and that is all he does.'),
  ]),
  simple('archive_enter', [
    nar('The Throne Archive: shelves to the roof, the smell of old paper, and under glass on a table in the middle, the Accord.'),
    act([{ do: 'look', actor: 'npc:hollis' }], '', 'On a stool by his desk sits an old man in slippers, a key on his belt. He does not get up.'),
    say(CO, 'Keeper! Your robes. And you will stand still for once in your life.'),
    nar('She fits him on his stool, talking the whole time, pins in her mouth.'),
    say(H, 'Those are not a seamstress\'s hands. That is ink, under the nail, there. Temple Archive?'),
    say(G, 'Junior archivist.'),
    say(H, 'Then you came to read a page, like everyone. Read it, then. It is under glass.'),
    say(H, 'Six pages. Everyone reads six pages and goes away.'),
    act([{ do: 'look', actor: 'player' }], CO, 'I have about as long as a sleeve takes. Go and look at your page.'),
    say(A, 'The air shimmers in front of the table, Gigi. I can hold the door.'),
  ]),
  script('accord_glass', {
    start: { lines: [], next: [{ if: { flag: 'clue.seventh_clause_read' }, to: 'empty' }, { to: 'look' }] },
    look: {
      lines: [
        nar('The Sun Accord under glass: six pages, and seven ribbons. The seventh is tied to nothing.'),
        nar('Its end hangs over the edge of the glass, unknotted.', { set: { 'clue.seven_ribbons': true } }),
        say(A, 'Seven ribbons and six pages, Gigi. Where\'s the seventh page?'),
      ],
    },
    empty: { lines: [nar('Six pages and seven ribbons, under glass. The seventh page is in the Hall\'s record now, read aloud.')] },
  }),
  ...DRAWER_NUMBERS.map((_, i) => presentDrawer(i)),
  script('drawer_four', {
    start: { lines: [], next: [{ if: { flag: 'story.hollis_agreed' }, to: 'open' }, { to: 'locked' }] },
    locked: {
      lines: [
        nar('The drawer carved 4, under the Stillwater plate. A faded red thread is tied round its handle.'),
        nar('Locked. Keeper Hollis has the key on his belt.', { set: { 'clue.drawer_four': true } }),
      ],
    },
    open: { lines: [nar('The drawer carved 4 stands open, and empty. The faded thread is still on its handle.')] },
  }),

  // ---- Beat 7: the sealing (the Echo; SIG-SEA) ---------------------------------------------------------
  script('sealing_enter', {
    start: { lines: [], next: [{ if: { flag: 'story.sealing_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('Fifty years ago. The Archive is newer, the shelves fewer. A Crown courier\'s case lies open on the table.'),
        say(P, '(The sealing. The signed original came here from Pòdlimyè to be bound.)'),
        act([{ do: 'look', actor: 'npc:echo_throne_clerk' }], '', 'The Throne\'s clerk takes out seven pages. He reads six aloud, one after another, to the room.'),
        nar('The seventh he reads to himself. His lips move. Nobody else hears a word.'),
        act([{ do: 'look', actor: 'npc:benny_echo' }, { do: 'walk', actor: 'npc:benny_echo', to: at(11, 8), facing: 'right' }], B, 'Read it aloud.'),
        say('throne_clerk', 'It is read to the Throne\'s clerk. That is the form.'),
        say(B, 'Then the form is a lie, and I will not put my name to it.'),
        act([{ do: 'face', actor: 'npc:benny_echo', facing: 'right' }, { do: 'look', actor: 'npc:echo_thomas' }], B, 'Aloud, so the boy writes it: Ardencia refuses the seventh page.'),
        act([{ do: 'look', actor: 'npc:benny_echo' }, { do: 'exit', actor: 'npc:benny_echo', to: at(13, 18) }], '', 'He walks out down the room, and the door shuts behind him.', {
          set: { 'echo.benny_left': true },
        }),
        act([{ do: 'look', actor: 'player' }], P, '(Caona is not here. Where is Caona?)'),
        say('throne_clerk', "Xaraguá's scout was not sent for. Xaraguá is not a signatory."),
        act([{ do: 'look', actor: 'npc:echo_crown_envoy' }], 'crown_envoy_old', 'The ships sail at the tide, Marshal, with the peace or without it. Six pages are read. Seal the binding.'),
      ],
      choices: [
        { text: 'Under protest of time.', set: { 'choice.patricio_protest': 'time' }, next: 'seal' },
        { text: 'Write that I did not read it.', set: { 'choice.patricio_protest': 'unread' }, next: 'seal' },
      ],
    },
    seal: {
      lines: [
        { if: { flag: 'choice.patricio_protest', eq: 'time' }, speaker: P, text: 'Under protest of time.' },
        { if: { flag: 'choice.patricio_protest', eq: 'unread' }, speaker: P, text: 'Write that I did not read it.' },
        nar('Patricio presses the alliance\'s seal into the binding\'s wax. The binding holds six pages.'),
        act(
          [
            { do: 'look', actor: 'npc:echo_throne_clerk' },
            { do: 'walk', actor: 'npc:echo_throne_clerk', to: at(DRAWER_X0 + 3, 2), facing: 'up' },
            { do: 'wait', ms: 700 },
          ],
          '',
          'The clerk seals the seventh page with the Throne\'s wax and carries it to the cabinet. Not to the binding.',
        ),
        nar('He opens a drawer, the fourth from the left, carved 4 on its front, lays the page in, shuts it, and pockets the key.'),
        act([{ do: 'walk', actor: 'npc:echo_throne_clerk', to: at(13, 6), facing: 'down' }, { do: 'look', actor: 'player' }], '', 'A loose red thread from the seventh ribbon hangs off the table, forgotten.', {
          set: { 'echo.filed': true, 'story.sealing_seen': true },
        }),
      ],
    },
    again: {
      lines: [
        nar('The sealing, again. The clerk reads the seventh page to himself and seals it with the Throne\'s wax.'),
        act(
          [
            { do: 'look', actor: 'npc:echo_throne_clerk' },
            { do: 'walk', actor: 'npc:echo_throne_clerk', to: at(DRAWER_X0 + 3, 2), facing: 'up' },
            { do: 'wait', ms: 600 },
            { do: 'walk', actor: 'npc:echo_throne_clerk', to: at(13, 6), facing: 'down' },
            { do: 'look', actor: 'player' },
          ],
          '',
          'He files it in the fourth drawer from the left, carved 4. Not in the binding.',
          { set: { 'echo.filed': true, 'echo.benny_left': true } },
        ),
      ],
    },
  }),
  script('sealing_table', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.ribbon_thread' }, to: 'done' },
        { if: { flag: 'echo.thread' }, to: 'holding' },
        { if: { flag: 'echo.filed' }, to: 'take' },
        { to: 'busy' },
      ],
    },
    busy: { lines: [nar('The clerk has the pages. The seventh ribbon lies across the table.')] },
    take: {
      lines: [
        nar('A loose thread from the seventh ribbon, red, a hand long.'),
        nar('Patricio takes it.', { set: { 'echo.thread': true } }),
      ],
    },
    holding: { lines: [nar('Patricio has the thread. The clerk\'s drawers are against the north wall.')] },
    done: { lines: [nar('The bound Accord: six pages, seven ribbons. The seventh is short one thread.')] },
  }),
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => echoDrawer(n)),
  simple('echo_thomas_talk', [
    say(P, 'Was Xaraguá asked?'),
    say('thomas', 'I am writing that they were not. Someone will read it one day.'),
    nar('He does not look up.'),
  ]),
  simple('echo_throne_clerk_talk', [say('throne_clerk', 'Six pages are read, Marshal. The seventh is the Throne\'s.')]),
  simple('echo_crown_envoy_talk', [say('crown_envoy_old', 'The tide, Marshal. The tide does not sign anything either.')]),
  // S-SEA's hook (after the release): placed and inert.
  simple('clerk_register', [nar('The clerk\'s register, open at today. A question waits half-written: "Who stood for Xaraguá?" Nobody has asked it.')]),
  script('sealing_return', {
    start: { lines: [], next: [{ if: { flag: 'anchor.ribbon_thread' }, to: 'thread' }, { to: 'not_yet' }] },
    thread: {
      lines: [
        nar('The present. Keeper Hollis is on his stool with his arms out, being pinned.'),
        say(A, 'The thread is on a drawer, Gigi. Not the fourth one now. They moved them.'),
      ],
    },
    not_yet: {
      lines: [nar('The present. Keeper Hollis is on his stool with his arms out, being pinned.'), say(A, 'Did you see where he put it, Gigi?')],
    },
  }),

  // ---- The keeper's law (the Parley with Hollis) ----------------------------------------------------------
  script('hollis_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.terms_refused' }, to: 'after' },
        { if: { flag: 'anchor.ribbon_thread' }, to: 'law' },
        { to: 'six' },
      ],
    },
    six: { lines: [say(H, 'Six pages, child. Everyone reads six pages.'), say(CO, 'Arms up, Keeper.')] },
    law: {
      lines: [
        say(G, 'Keeper. The drawer carved four. There is a page in it.'),
        say(H, 'There is. I have kept a ribbon with no page for eleven years. I will not break the Throne\'s wax on a seamstress\'s word.'),
        say(H, 'Give me a reason a keeper can keep.'),
      ],
      choices: [
        { text: 'Reason: the Witness', if: { any: [{ flag: 'lore.seat_founding_compact' }, { flag: 'lore.seat_accord_sealed' }] }, next: 'reason' },
        { text: 'Scripture: the Gaze', next: 'scripture' },
        { text: 'Compassion: the ribbon', next: 'compassion' },
      ],
    },
    // Review 3.4: the Reason answer is the Witness faith's (a page never read was never agreed).
    reason: {
      lines: [
        say(G, 'Clause Six: every clause is read to every signatory. A page read to the clerk alone was never read.'),
        say(G, 'The Witness says the same. A contract nobody heard is no contract. The binding is in breach of itself.'),
        say(H, '...That is the keeper\'s own argument. I have made it to the wall for eleven years.'),
      ],
      next: 'open',
    },
    scripture: {
      lines: [
        say(G, 'She remembers, so no ruler can lie about what was done. A page nobody read is a lie she cannot remember.'),
        say(H, 'The Gaze is Zetwal\'s. The Throne\'s law is mine. But I take your point.'),
      ],
      next: 'open',
    },
    compassion: {
      lines: [
        say(G, 'You have kept a ribbon with no page for eleven years. Let it have one.'),
        say(H, 'Sentiment. Go and read the Compact; it is behind you. Then come back.'),
      ],
    },
    open: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:hollis' },
            { do: 'walk', actor: 'npc:hollis', to: at(DRAWER_X0 + 5, 2), facing: 'up' },
            { do: 'wait', ms: 700 },
          ],
          '',
          'He takes the key off his belt, walks to the cabinet in his slippers, and opens the drawer with the faded thread.',
        ),
        nar('Inside, one page. The Throne\'s wax on it is unbroken.'),
        say(H, 'I will not break the Throne\'s wax. That is not keeping.'),
        say(H, 'But the Founding Compact says a sealed page may be heard in the Hall, when a signatory\'s envoy demands it in Parley.'),
        say(G, "Zetwal's envoy is my mother."),
        say(H, 'Then your mother will have to say so out loud, in front of him.'),
        act([{ do: 'sync' }], H, 'Take off the veil, child. You are about to be an archivist in public.', {
          set: { 'story.hollis_agreed': true, 'story.disguised': false },
        }),
        say(CO, 'The Parley sits now. I will fetch the others to the Hall\'s steps. Keeper, your hem.'),
        act(
          [
            { do: 'exit', actor: 'npc:hollis', to: at(13, 18), async: true },
            { do: 'exit', actor: 'npc:coralie_seat', to: at(13, 18) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'Hollis takes the page in both hands and walks out. Coco goes after him with the robe over her arm.',
        ),
      ],
    },
    after: { lines: [say(H, 'The door is open to archivists, child. Only to archivists. Read what you like.')] },
  }),

  // ---- Beat 8 and 9: the Parley (read aloud; the Regent's terms) -------------------------------------------
  simple('parley_steps', [
    act(
      [
        { do: 'place', actor: 'hollis', look: 'hollis', at: at(23, 7), facing: 'up' },
        { do: 'look', actor: 'hollis' },
      ],
      '',
      'Keeper Hollis stands at the foot of the Hall\'s steps with the page in both hands. Nobody stops the keeper.',
    ),
    act(
      [
        { do: 'look', actor: 'yari' },
        { do: 'enter', actor: 'yari', look: 'yari', from: at(23, 32), to: at(24, 9), run: true, async: true },
        { do: 'enter', actor: 'azzy', look: 'azzy', from: at(24, 32), to: at(25, 9), run: true, async: true },
        { do: 'enter', actor: 'samira', look: 'samira', from: at(23, 32), to: at(26, 9), run: true },
      ],
      '',
      'Yari, Azzy and Samira come up from the Quarter at a run, Coco\'s pins still in their sleeves.',
    ),
    say(Y, 'Did you find it?'),
    say(G, 'It\'s in his hands.'),
    say(S, 'Coco says we stand at the back and say nothing. I have never said nothing.', {
      set: { 'story.party_rejoined': true, 'story.party_split': false },
    }),
    say(H, 'Walk behind me, archivist. Not beside.'),
    act([{ do: 'exit', actor: 'hollis', to: at(23, 5) }, { do: 'look', actor: 'player' }], '', 'He goes up the steps and into the Hall.'),
  ]),
  script('parley', {
    start: {
      lines: [
        act(
          [
            { do: 'look', actor: 'npc:regent' },
            { do: 'enter', actor: 'hollis', look: 'hollis', from: at(22, 30), to: at(22, 9), facing: 'up' },
          ],
          '',
          'The Parley in session. Keeper Hollis walks the nave with the page in both hands, and the Hall goes quiet.',
        ),
        say(R, 'Keeper. The Archive is sealed.'),
        say(H, 'The Archive is. I am not.'),
        say(H, 'A sealed page is in the Hall. By the Founding Compact, an envoy of a signatory house may demand its reading.'),
        say(H, 'I am asking whether one does.'),
        nar('Silence. The clerk\'s pen stops.'),
        act([{ do: 'look', actor: 'npc:elodie_hall' }, { do: 'walk', actor: 'npc:elodie_hall', to: at(4, 11), facing: 'right' }], '', 'Elodie steps forward from Zetwal\'s door. One step: the step she did not take yesterday.'),
        say(E, 'Zetwal demands the reading.'),
        act([{ do: 'look', actor: 'npc:regent' }], '', 'The Regent looks at her for a long moment.'),
        say(R, 'Read it. The Charter has stood on it for fifty years. It will stand on it tomorrow.'),
        act([{ do: 'look', actor: 'hollis' }], '', 'Hollis breaks the Throne\'s wax. A dry crack, loud as a branch in the quiet.', { fx: 'shake' }),
        say(H, '"The harbor of Xaraguá and its waters are given into the keeping of the Crown of Aldermoor,'),
        say(H, 'at the Crown\'s pleasure, to be revisited."', { set: { 'clue.seventh_clause_read': true } }),
        say(H, 'No signature. The clerk\'s seal alone. And the seventh ribbon carries no witness knot.'),
        // Yari's line after the clause (the Chapter 4 outline asked that it be hers).
        act(
          [
            { do: 'place', actor: 'yari', look: 'yari', at: at(20, 27), facing: 'up' },
            { do: 'look', actor: 'yari' },
            { do: 'walk', actor: 'yari', to: at(16, 9), facing: 'up' },
          ],
          Y,
          '"To be revisited."',
        ),
        nar('Yari walks up the nave to the empty eighth chair, Xaraguá\'s, and puts her hand on its back.'),
        say(Y, 'Fifty years. Nobody revisited it. We fought beside you, and you wrote us down as waters.'),
        say(R, 'We are revisiting it now, Yari of Xaraguá. That is what a Parley is for.'),
        // Beat 9: the terms.
        act([{ do: 'walk', actor: 'npc:regent', to: at(20, 4), facing: 'down' }], '', 'The Regent comes down from the Throne to the rope: the first time he has moved toward anyone.'),
        say(R, 'Terms. The Charter of Protection stands. You have heard its clause, read by the Throne\'s own keeper, at your mother\'s demand.'),
        say(R, 'In return: the harbor is revisited in ten years, by this Hall. Xaraguá\'s cacique goes home without a guard.'),
        say(R, 'Zetwal\'s envoy keeps her seat, and her household goes home to Zetwal, untroubled, and stays there.'),
        say(R, 'Say yes, and the war your grandfather fought stays won.'),
        nar('He does not look at Anissa this time.'),
      ],
      choices: [
        { text: 'Xaraguá was not asked.', set: { 'choice.refusal': 'asked' }, next: 'refused' },
        { text: 'I am the protest.', set: { 'choice.refusal': 'protest' }, next: 'refused' },
      ],
    },
    refused: {
      lines: [
        { if: { flag: 'choice.refusal', eq: 'asked' }, speaker: G, text: 'Xaraguá was not asked. I am asking them.' },
        { if: { flag: 'choice.refusal', eq: 'protest' }, speaker: G, text: 'My grandfather sealed under protest. I am the protest.' },
        say(R, 'Then win the houses, if you can. Eight gates. The roads are open. They always were.'),
        act([{ do: 'walk', actor: 'npc:regent', to: at(23, 3), facing: 'down' }], R, 'I will be here. I am always here.'),
        nar('He puts his hand back on the Throne\'s arm.'),
        act(
          [
            { do: 'face', actor: 'npc:envoy_ironvow', facing: 'player' },
            { do: 'face', actor: 'npc:envoy_suzumori', facing: 'player' },
            { do: 'face', actor: 'npc:envoy_agnivansh', facing: 'player' },
            { do: 'look', actor: 'npc:envoy_suzumori' },
          ],
          '',
          'The envoys withdraw. Three of them look at Gianna on the way out: Ironvow, Suzumori, Agnivansh.',
        ),
        act([{ do: 'look', actor: 'npc:elodie_hall' }], E, "Zetwal's envoy records that her household declined the Regent's terms.", { set: { 'story.terms_refused': true } }),
        say(E, "The envoy has a fitting at her sister's, and is expected at the Parley's close."),
        act(
          [
            { do: 'exit', actor: 'npc:elodie_hall', to: at(21, 30), async: true },
            { do: 'exit', actor: 'npc:parley_clerk', to: at(22, 30) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'She walks out of the Hall without looking at her daughters. The clerk goes after her.',
        ),
        say(A, 'The fitting, Gigi. Coco\'s.'),
      ],
    },
  }),

  // ---- Beat 10: the fitting (the private line) ---------------------------------------------------------
  simple('fitting_front', [
    act(
      [
        { do: 'place', actor: 'elodie', look: 'elodie', at: at(9, 7), facing: 'down' },
        { do: 'place', actor: 'coralie', look: 'coralie', at: at(12, 7), facing: 'down' },
        { do: 'place', actor: 'clerk', look: 'regent_clerk', at: at(4, 11), facing: 'up' },
        { do: 'look', actor: 'elodie' },
      ],
      '',
      'Coco\'s front room. Elodie is already here, in the envoy\'s gold. Through the window, the Crown\'s clerk waits in the lane.',
    ),
    // Elodie and Azzy (review 5.1): one look, one word.
    act([{ do: 'place', actor: 'azzy', look: 'azzy', at: at(8, 9), facing: 'up' }, { do: 'face', actor: 'elodie', facing: 'left' }], '', 'Elodie stops in front of Azzy, and looks at him for a long moment.'),
    say(E, 'Azriel.'),
    nar('That is all. He does not know what to do with it, and nobody tells him.'),
    // Elodie and Samira (review 5.2), before the curtain.
    act([{ do: 'place', actor: 'samira', look: 'samira', at: at(11, 9), facing: 'up' }, { do: 'face', actor: 'elodie', facing: 'right' }], E, 'Samira Dorini. Your mother paid what she owed, I hear. So do I. Thank you for walking with my daughters.'),
    say(S, "I'll send an invoice."),
    say(E, 'Do. Zetwal pays.'),
    act(
      [
        { do: 'walk', actor: 'elodie', to: at(10, 2), facing: 'down', async: true },
        { do: 'walk', actor: 'coralie', to: at(12, 3), facing: 'left' },
        { do: 'look', actor: 'player' },
      ],
      CO,
      'Behind the curtain, all of you who are her daughters. The rest of you, hold pins.',
    ),
  ]),
  simple('fitting', [
    act(
      [
        { do: 'place', actor: 'elodie', look: 'elodie', at: at(10, 2), facing: 'down' },
        { do: 'place', actor: 'coralie', look: 'coralie', at: at(12, 3), facing: 'left' },
        { do: 'look', actor: 'elodie' },
      ],
      '',
      'Coco pulls the curtain shut behind them. The one room in Eightgate with no Crown pen in it.',
    ),
    say(CO, COCO.staysPinning),
    say(E, 'Sit with me. Both of you.'),
    say(E, 'I married your father in secret. A Rodriguez child in Zetwal is a Brasador hostage. A Limyè child is nobody\'s.'),
    say(E, 'Two bloodlines of claimants in one cradle would have had the Regent\'s attention from the day you were born.'),
    say(E, 'He looked at your sister today the way he looks at a page.'),
    say(E, 'I took Limyè to honor the goddess, I said. I took it so no one would count you.'),
    say(G, 'He sold Xaraguá. He sold us.'),
    nar('Elodie does not answer that. She looks at Coco\'s pins, not at her daughter.'),
    say(E, ELODIE_LINES.tested, { set: { 'clue.elodie_tested_line': true } }),
    say(G, '(The Trial of Blades. A father who put his daughter on the sand.)'),
    say(A, "Mama. He didn't let them hit me."),
    // Review 3.8: no words; a hand on Anissa's head, taken away before the curtain opens.
    nar('Elodie puts her hand on Anissa\'s head, and says nothing.'),
    say(E, 'Ironvow\'s envoy came to my door last night. Their sacred standard is stolen.'),
    say(E, 'And their council is selling the fleet to the Crown for blockade money.'),
    say(E, 'Kuroshi will not speak to anyone until Skarragol has. Jwaladesh cannot afford to speak at all.'),
    say(E, 'If someone were going, they would go east first, up onto the winter plateau.'),
    nar('She takes her hand from Anissa\'s head. The curtain opens. The clerk is at the door.'),
    act([{ do: 'walk', actor: 'elodie', to: at(10, 6), facing: 'down' }], E, 'Coralie. Thank you. The hem is perfect.'),
    act([{ do: 'exit', actor: 'elodie', to: at(10, 10) }, { do: 'look', actor: 'coralie' }], '', 'She goes, the envoy again, the clerk a step behind her.'),
    say(CO, 'She\'ll be at that Parley till the Crown lets her go, and it won\'t. I\'m here till the robes are done, and they\'re never done.'),
    say(CO, 'Come back through this door whenever the road brings you past. And bring me every colour you find.'),
    act([{ do: 'look', actor: 'player' }], CO, 'Now. I will walk you to the Iron Gate. Somebody in this family should wave.', { set: { 'story.fitting_done': true } }),
  ]),

  // ---- Beat 11: the Iron Gate --------------------------------------------------------------------------
  simple('iron_gate', [
    act(
      [
        { do: 'place', actor: 'coralie', look: 'coralie', at: at(44, 25), facing: 'right' },
        { do: 'look', actor: 'coralie' },
      ],
      '',
      'The Iron Gate: grey iron, and a horse-tail standard pole with no standard on it. Coco has walked them all the way.',
    ),
    { if: { flag: 'side.deserters.spared' }, speaker: '', text: 'By the gate, the pilgrims from the yard wait to go home, with a deserter escort in old Crown coats.' },
    say(Y, 'Ironvow\'s gate. Their standard is gone, and they left the pole up.'),
    say(Z, 'My mother\'s people.'),
    act([{ do: 'face', actor: 'coralie', facing: 'left' }], CO, 'East! Up onto the plateau! Bring me a colour I haven\'t got!'),
    nar('She waves with both arms: the one flamboyant thing she does in the open.'),
    nar('The Iron Gate opens on the winter road east.', { fx: 'fade', set: { 'act5.complete': true, 'travel.next': 'skarragol-plateau/seat_road' } }),
  ]),

  // ---- Deserters' Road (Se-3) ----------------------------------------------------------------------------
  script('pilgrim_bandaged_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.deserters.fought' }, to: 'report' },
        { if: { flag: 'side.deserters.accepted' }, to: 'waiting' },
        { if: { flag: 'story.coco_plan' }, to: 'ask' },
        { to: 'hook' },
      ],
    },
    hook: { lines: [say('pilgrim_bandaged', 'The road in is not the road out. The deserters hold the crossroads.')] },
    ask: {
      lines: [
        say('pilgrim_bandaged', 'We were robbed at the crossroads, south of here, by men in Crown coats.'),
        say('pilgrim_bandaged', 'The Charter\'s garrison pay stopped reaching the road posts two months ago. The men left the posts hungry.'),
        say('pilgrim_bandaged', 'The Regent\'s clerks say there are no deserters. The Regent\'s clerks have not walked the road.'),
        say(A, 'Her head is bleeding, Gigi.'),
      ],
      choices: [
        { text: 'We will go to the crossroads.', set: { 'side.deserters.accepted': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: { lines: [say('pilgrim_bandaged', 'South, down the road from the yard. Please be careful. They are hungry, not cruel.')] },
    waiting: { lines: [say('pilgrim_bandaged', 'South, down the road from the yard, where the roads cross. Their wagon is on its side.')] },
    report: {
      lines: [
        { if: { flag: 'side.deserters.spared' }, speaker: 'pilgrim_bandaged', text: 'They will walk us home? For bread? ...Then we will feed them. Gladly.' },
        { if: { flag: 'side.deserters.paid' }, speaker: 'pilgrim_bandaged', text: 'You paid them? From your own purse? Then nobody else pays at the crossroads.' },
        { if: { flag: 'side.deserters.broken' }, speaker: 'pilgrim_bandaged', text: 'They ran from a Brasador. Good. I hope they keep running.' },
        say('pilgrim_gaze', 'She remembers this. So will we.', { set: { 'side.deserters.done': true } }),
      ],
    },
  }),
  simple('pilgrim_gaze_talk', [say('pilgrim_gaze', 'We walked from Zetwal to see the Throne. We have seen the inside of a ditch.')]),
  simple('pilgrim_nobody_talk', [say('pilgrim_nobody', 'Gaze, Witness, Four Hands. I am nobody\'s. The robbers did not ask which.')]),
  simple('pilgrim_thanks_talk', [say('pilgrim_bandaged', 'Peace on your road, envoy. On the whole of it.')]),
  simple('pilgrim_escort_talk', [say('pilgrim_bandaged', 'Home, with an escort the Crown pays for and does not know it.')]),
  simple('deserter_escort_talk', [say('deserter', 'A post is a post. This one feeds us.')]),
  simple('deserters_camp', [
    act(
      [{ do: 'look', actor: 'npc:deserter_sergeant' }, { do: 'walk', actor: 'npc:deserter_sergeant', to: at(31, 18), facing: 'up' }],
      '',
      'At the crossroads: a Crown wagon on its side, a cook fire, and three men in old coats. The Sergeant walks out to meet them.',
    ),
    say('deserter_sergeant', 'Toll. Everything in the bags.'),
    say(Z, 'Try.', { set: { 'battle.next': 'deserters_road', 'battle.after': 'deserters_parley' } }),
  ]),
  // After the fight (review 3.3: nobody falls; they withdraw), the Parley on the map: three ways, all remembered.
  script('deserters_parley', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:deserter_sergeant' }], '', 'The Sergeant lowers his bayonet. His two men step back with him.'),
        say('deserter_sergeant', "Enough. Enough. We're hungry, not dead."),
        say('deserter_sergeant', 'Pay stopped reaching the road posts two months ago. We stopped reaching the road posts a month after.'),
        say(G, 'You robbed pilgrims.'),
        say('deserter_sergeant', 'We robbed the only people on the road. Nobody else comes out here. Not even the Crown.'),
      ],
      choices: [
        { text: 'Escort the pilgrims, for food.', set: { 'side.deserters.spared': true }, next: 'spared' },
        {
          text: 'Samira. Pay them.',
          if: { all: [{ flag: 'party.samira' }, { flag: 'gold', gte: 120 }] },
          set: { 'side.deserters.paid': true, 'gold.pay': 120 },
          next: 'paid',
        },
        { text: 'Leave the road. Now.', set: { 'side.deserters.broken': true }, next: 'broken' },
      ],
    },
    spared: {
      lines: [
        say(G, 'The pilgrims at the gate need walking home. They pay in food.'),
        say('deserter_sergeant', 'Walk them home? For bread? ...Aye. That is a post, of sorts.'),
      ],
      next: 'end',
    },
    paid: {
      lines: [say(S, 'One hundred and twenty. Leave the road.'), say('deserter_sergeant', 'And a receipt?'), say(S, 'I have already written it.')],
      next: 'end',
    },
    broken: {
      lines: [
        say(Z, 'Leave the road, or the next ones through here are Brasador.'),
        say('deserter_sergeant', '...We are leaving.'),
      ],
      next: 'end',
    },
    end: {
      lines: [
        act(
          [
            { do: 'exit', actor: 'npc:deserter_sergeant', to: at(37, 22), async: true },
            { do: 'exit', actor: 'npc:deserter', to: at(37, 22) },
            { do: 'look', actor: 'player' },
          ],
          '',
          'They pick up what is theirs and go.',
          { set: { 'side.deserters.fought': true } },
        ),
        say(A, 'The pilgrims at the gate, Gigi. They\'ll want to know.'),
      ],
    },
  }),
  simple('deserter_sergeant_talk', [say('deserter_sergeant', 'Toll. Everything in the bags.')]),
  simple('deserter_talk', [say('deserter', 'Sergeant does the talking.')]),
  simple('crown_wagon', [nar('A Crown supply wagon on its side, its wheel off. The Charter\'s seal on the tail-board, scratched out.')]),
  simple('pilgrim_camp', [nar('The pilgrims\' camp: a cold fire and two tents with the flaps open. They left in a hurry.')]),
];
