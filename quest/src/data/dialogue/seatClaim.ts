// Chapter 12, The Claim (Eightgate again), and the Epilogue, The Hearing: docs/quest/reviews/2026-10-22-chapter12-epilogue-
// outline.md with every fix of its second review (2026-10-22-chapter12-epilogue-outline-review.md), the decisions after it,
// and the owner's two decisions of Oct 22 (Azzy's Challenge only for a Strike player who said "the realm had to see him
// beaten", after the Regent, with Gianna's wounds carried over; old Patricio speaks at the Claim about the sealing only, at
// the chair his young self cut, and is present and silent at the Hearing). The maps are tools/maps/seat.ts; every tile in a
// stage direction comes from data/claim.ts; the fights are data/claimBattles.ts.
//
// The owner's rules here: every story moment is acted out on the map (Elodie in the gate's arch, the tokens handed over on
// the steps and set on the chairs by the Master of the Chairs, Hollis walking the nave with the petition, the rope unhooked,
// Gianna walking up onto the tile, the four walking up when the Regent calls his seals, the chairs filling, the Regent walked
// up the heralds' stair, Rael walking up the nave and kneeling, every witness walking to the clerk's table, the verdict carried
// out where the player can see it, Anissa opening the Hall's doors). Anissa is never hit, never a target in the engine's
// sense (the Regent's Seize is the built Gianna-steps-in path), never a combatant and never jokes; no comic line shares a node
// with hers, and nothing in the rooms, the Hall, the Claim, the Hearing or the endings is a joke (STORY 5; tests/claim.test.ts).
// Patricio's question 13 (does he know of the marriage?) stays open: he speaks of the sealing only, and he and Rael exchange
// one look.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { BELL_PARTS, BELL_READY, BENCH_SPOTS, CONCOURSE, GATE_COMPANIES, HALL, ROOMS, TOKEN_CHAIRS, betrayed, chairSet, sits } from '../claim.ts';
import { LAYLA } from './aldoria.ts';
import { RIBBON } from '../seatArchive.ts';
import type { MusterOverlay } from './zetwalMuster.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;
type P = { x: number; y: number };

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

function at(x: number, y: number): P {
  return { x, y };
}

const has = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });
const any = (...c: Condition[]): Condition => ({ any: c });
const eq = (flag: string, value: string): Condition => ({ flag, eq: value });

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const Z = 'azzy';
const S = 'samira';
const BY = 'bayarmaa';
const H = 'haru';
const V = 'vikram';
const ED = 'edmund';
const E = 'elodie';
const R = 'rael';
const RG = 'regent';
const CH = 'chamberlain';
const HO = 'hollis';
const JO = 'jordyn';
const RO = 'rosalind';
const LA = 'layla';
const BO = 'benny_old';
const PO = 'patricio_old';
const AN = 'anicette';
const SB = 'sebastian';
const AM = 'amanda';
const ZE = 'zelia';
const RA = 'rahel';
const PA = 'patricia';
const TR = 'ard_treasurer';
const TD = 'treasurer_daughter';
const LO = 'lamp_oil_seller';
const PR = 'printer';
const QF = 'qc_follower';
const RV = 'rivera';
const CA = 'caona';
const BN = 'benny';
const PT = 'patricio';

const TRUST: Condition = has('war.trust');
const STRIKE: Condition = has('war.strike');
const DARK: Condition = all(STRIKE, eq('choice.strike_why', 'beaten'));
const SHARE: Condition = eq('choice.azzy_ordu', 'share');
const XARAGUA_FIRST: Condition = eq('choice.claim_why', 'xaragua');
const ANISSA_FIRST: Condition = eq('choice.claim_why', 'anissa');
const DORINI_KEPT: Condition = { not: betrayed('al_doria') };


// ---- Beat 0: the Ash Road, and the Ardencia Gate at dusk (seat-concourse) -------------------------------------------------

const ARRIVE: DialogueScript = script('claim_arrive', {
  start: {
    lines: [
      nar('North up the strait to Ardencia\'s strand, where Free Brasador was born. Then three days south on the Ash Road.', { fx: 'fade' }),
      { if: TRUST, speaker: '', text: 'Black and crimson sails led the strait, the trader behind, and seven navies behind her.' },
      { if: STRIKE, speaker: '', text: 'The trader led the strait. Nobody\'s sails were black.' },
      nar('Past the mills the Ash Ledger paid for. Eightgate at dusk.'),
    ],
    next: [{ if: all(STRIKE, not('choice.strike_why')), to: 'why' }, { to: 'arch' }],
  },
  // The road's question (Strike only; the outline 9.3): the player's own words, which the dark route reads at the Claim.
  why: {
    lines: [
      act([{ do: 'face', actor: 'azzy', facing: 'player' }, { do: 'face', actor: 'player', facing: 'right' }], Z, 'Before we go in. You haven\'t asked me what I think. I\'ll ask you instead.'),
      say(Z, 'Why? You had him and you had them.'),
    ],
    choices: [
      { text: 'Because I didn\'t believe him.', set: { 'choice.strike_why': 'mistake' }, next: 'mistake' },
      { text: 'The realm had to see him beaten.', set: { 'choice.strike_why': 'beaten' }, next: 'beaten' },
    ],
  },
  mistake: {
    lines: [say(G, 'Because I didn\'t believe him.'), say(Z, '...Then it was a mistake. I can carry a mistake.')],
    next: 'arch',
  },
  beaten: {
    lines: [say(G, 'Because the realm had to see him beaten.'), say(Z, '...Then it was a lesson. I\'ll remember who it was for.')],
    next: 'arch',
  },
  arch: {
    lines: [
      act(
        [
          { do: 'look', actor: 'npc:elodie_arch' },
          { do: 'walk', actor: 'npc:elodie_arch', to: at(CONCOURSE.elodieStop.x, CONCOURSE.elodieStop.y), facing: 'up' },
        ],
        '',
        'In the gate\'s arch, a woman in Zetwal\'s blue, the Crown\'s clerk three steps behind her with his pen.',
      ),
      say(E, 'Envoy of Zetwal. The Lord Regent is informed of every arrival.', { mood: 'guarded' }),
      say(E, 'He was informed of this one four days ago, from a ship.', { mood: 'guarded' }),
      say(G, 'Mother.'),
      act([{ do: 'wait', ms: 600 }], E, 'Not here. He has heard. I have not. My rooms, when you have seen the city.', { mood: 'guarded' }),
      act([{ do: 'face', actor: 'npc:elodie_arch', facing: 'right' }], E, 'The envoy\'s household will report to the envoy\'s rooms.', { mood: 'guarded' }),
      act([{ do: 'look', actor: 'npc:arch_clerk' }], '', 'The clerk writes it down. A second time.'),
    ],
    next: 'anissa',
  },
  anissa: {
    lines: [
      act([{ do: 'face', actor: 'npc:elodie_arch', facing: 'up' }, { do: 'look', actor: 'follower' }, { do: 'wait', ms: 700 }], E, 'Anissa.'),
      act([{ do: 'face', actor: 'follower', facing: 'down' }], A, 'Mama.', { set: { 'story.claim_arrived': true } }),
    ],
    next: [{ if: has('army.free_brasador'), to: 'gate' }, { to: 'away' }],
  },
  gate: {
    lines: [
      act([{ do: 'walk', actor: 'azzy', to: at(33, 2), facing: 'left' }, { do: 'look', actor: 'npc:gate_free_brasador_captain' }], Z, 'Tío. Hold the gate. Nobody comes in behind us that the Compact doesn\'t name.'),
      say('joaquin_muster', 'Nobody has, for fifty years.'),
    ],
    next: 'away',
  },
  away: {
    lines: [
      act(
        [
          { do: 'exit', actor: 'npc:elodie_arch', to: at(CONCOURSE.quarterLane.x, CONCOURSE.quarterLane.y), async: true },
          { do: 'exit', actor: 'npc:arch_clerk', to: at(CONCOURSE.quarterLane.x + 1, CONCOURSE.quarterLane.y) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'She goes down the Concourse to the Envoys\' Quarter. The clerk goes after her, writing as he walks.',
      ),
      { if: STRIKE, speaker: Z, text: 'I\'m still coming. I\'m still angry. Walk.' },
    ],
  },
});

const GATE_XARAGUA_OPEN: DialogueScript = simple('gate_xaragua_open', [nar('Xaraguá\'s gate, open. The bricks are stacked by the wall, and the teal stone is clean where they were.')]);
const ELODIE_ARCH: DialogueScript = simple('elodie_arch_talk', [say(E, 'My rooms, envoy. In the Quarter.', { mood: 'guarded' })]);
const ARCH_CLERK: DialogueScript = simple('arch_clerk_talk', [nar('The Crown\'s clerk writes. He does not look up.')]);

// ---- Beat 1: Mother's rooms (seat-rooms) ----------------------------------------------------------------------------------

const ROOMS_SCENE: DialogueScript = script('rooms_scene', {
  start: {
    lines: [
      nar('Zetwal\'s rooms at the Seat. A desk, a lamp, a shelf, a window on the Concourse. The clerk is outside the door, for once.'),
      act([{ do: 'look', actor: 'npc:elodie_rooms' }, { do: 'walk', actor: 'npc:elodie_rooms', to: at(ROOMS.elodieMeet.x, ROOMS.elodieMeet.y), facing: 'down' }], '', 'Mother stands up from the desk and comes to them.'),
      act([{ do: 'walk', actor: 'azzy', to: at(ROOMS.azzyDoor.x, ROOMS.azzyDoor.y), facing: 'up' }], G, 'He told me. On the pier.'),
      { if: TRUST, speaker: E, text: 'I know what he told you. He wrote to me the night before, in case you did not let him finish.' },
      { if: STRIKE, speaker: E, text: 'He wrote to me from the strait. That you did not let him finish, and that it was his doing, for teaching you not to.' },
      { if: eq('choice.truth_answer', 'tested'), speaker: G, text: 'I told him he tested us.' },
      { if: eq('choice.truth_answer', 'tested'), speaker: E, text: 'I told him first. Twenty years ago, and every year since.' },
      { if: eq('choice.truth_answer', 'lied'), speaker: G, text: 'I told him he lied to us for twenty years.' },
      { if: eq('choice.truth_answer', 'lied'), speaker: E, text: 'So did I. Every day of it. Do not give him the whole bill; half of it is mine.' },
    ],
    next: 'anissa',
  },
  anissa: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(ROOMS.elodieMeet.x, ROOMS.elodieMeet.y + 1), facing: 'up' }], A, 'Mama. In Ardencia, he didn\'t let them hit me.'),
      act([{ do: 'wait', ms: 800 }], '', 'Elodie puts her hand on Anissa\'s head.'),
      say(E, 'No. He tested which of you would stand in front of the other. I told him never to.'),
      say(E, 'That is the part I will not forgive, and he knows it.'),
      say(E, 'You stayed close.'),
      say(A, 'I did.'),
      { if: has('choice.farewell_why'), speaker: E, text: 'Gianna. You asked me why I had to go. This is why. It took a year.' },
      { if: has('choice.farewell_fine'), speaker: E, text: 'Gianna. You told me you would be fine. You were not. And you were.', mood: 'worried' },
    ],
    next: 'azzy',
  },
  azzy: {
    lines: [
      act([{ do: 'face', actor: 'azzy', facing: 'left' }], Z, 'At Coco\'s you said my name and nothing else.'),
      act([{ do: 'face', actor: 'npc:elodie_rooms', facing: 'right' }], E, 'I had not earned the rest. He wrote to me about you, every year. Your temper. Your hands.'),
      say(E, 'I know you the way one knows a letter. Azriel.'),
      { if: STRIKE, speaker: Z, text: '...He wrote about me. He never wrote to me.' },
    ],
    next: 'claim',
  },
  claim: {
    lines: [
      act([{ do: 'face', actor: 'npc:elodie_rooms', facing: 'down' }], E, 'Tomorrow at the bell he receives Zetwal\'s envoy. I am Zetwal\'s envoy.'),
      say(E, 'I will walk you to the rope and no further. The Compact says a claimant stands alone.'),
      say(E, 'And I have stood beside that chair for a year. It is time someone stood on it.'),
      say(E, 'Why will you?'),
    ],
    choices: [
      { text: 'For Xaraguá.', set: { 'choice.claim_why': 'xaragua' }, next: 'xaragua' },
      { text: 'So nobody counts Anissa again.', set: { 'choice.claim_why': 'anissa' }, next: 'counted' },
    ],
  },
  xaragua: {
    lines: [say(G, 'For Xaraguá.'), say(E, 'Then say Xaraguá first, on the tile. Nobody has, in that Hall.')],
    next: 'night',
  },
  counted: {
    lines: [say(G, 'So nobody counts Anissa again.'), say(E, '...Then you understood me, at the fitting. Say that last. Say it to him.')],
    next: 'night',
  },
  night: {
    lines: [
      say(E, 'The Master of the Chairs keeps the houses\' tokens. He will want them tonight; he does not sleep before a Claim.'),
      say(E, 'And the corner by the fountain is asking about the veils. It will be asking the Hall tomorrow.', { set: { 'story.elodie_rooms': true } }),
    ],
  },
});

const ELODIE_ROOMS: DialogueScript = script('elodie_rooms_talk', {
  start: {
    lines: [],
    next: [{ if: not('side.volume_one.accepted'), to: 'book' }, { to: 'later' }],
  },
  book: { lines: [say(E, 'Your grandmother\'s book is on the shelf. Take it. She will want to scold me for it, and I would like her to.')] },
  later: { lines: [say(E, 'The bell is at dawn. The lamp stays lit. It always did.')] },
});

/** Volume One (Se-1, closed here; the Overdue Books thread): Grandmother's missing book, with Mother's margins. */
const ROOMS_SHELF: DialogueScript = script('rooms_shelf', {
  start: {
    lines: [],
    next: [{ if: has('side.volume_one.accepted'), to: 'gone' }, { to: 'book' }],
  },
  book: {
    lines: [
      nar('A shelf of envoy\'s papers, and one book with a cracked spine: Ash Wars Gossip, Volume One.'),
      say(G, 'Grandmother\'s. The missing one.'),
      act([{ do: 'face', actor: 'npc:elodie_rooms', facing: 'right' }], E, 'She lent it to me twenty years ago. I kept it. I have written in it, which she will not forgive.'),
    ],
    choices: [{ text: 'Take it, and read the margins.', next: 'take' }, { text: 'Leave it for now.' }],
  },
  take: {
    lines: [
      nar('Mother\'s hand in the margins, twice: "Not true. I was there."', { set: { 'side.volume_one.accepted': true, 'item.volume_one': true } }),
      { if: has('clue.four_accounts'), speaker: '', text: 'Against the other three accounts, the last margin reads: "The Cendre ford: forty. He counted. I watched him count."' },
      { if: not('clue.four_accounts'), speaker: '', text: 'The last margin is a number by the Cendre ford: "forty". Nothing else.' },
      say(G, 'Grandmother gets it back. In front of people.'),
    ],
  },
  gone: { lines: [nar('The gap on the shelf where Volume One was.')] },
});

const ROOMS_LAMP: DialogueScript = script('rooms_lamp', {
  start: { lines: [], next: [{ if: has('story.elodie_rooms'), to: 'lit' }, { to: 'cold' }] },
  cold: { lines: [nar('A lamp on the desk, not lit yet.')] },
  lit: { lines: [nar('The lamp in Mother\'s window, lit for the night: the light of Pòdlimyè\'s gate, in a Crown window.')] },
});
const ROOMS_WINDOW: DialogueScript = simple('rooms_window', [nar('The window on the Concourse. The fountain, the lamps, the Hall\'s steps; a lantern on them.')]);

// ---- The Quarter by night ---------------------------------------------------------------------------------------------------

const ROOMS_CLERK: DialogueScript = simple('rooms_clerk_talk', [say('regent_clerk', 'The envoy\'s rooms are the envoy\'s. The Compact says so. I have checked.')]);
const COCO_NOTE: DialogueScript = simple('coco_note', [
  nar('Coco\'s painted door is shut. A note on it: Tati Coco is dressing a wedding in Al-Doria.'),
  nar('Under it, in her hand: "Gold. I said gold. Wear it on the tile."'),
]);
const CROWN_WING_CLOSED: DialogueScript = simple('crown_wing_closed', [nar('Zetwal\'s envoy\'s rooms, in the Crown\'s wing. The door is locked.')]);

// ---- Beat 2: until the bell (the Concourse by night) --------------------------------------------------------------------------

const HALL_SHUT: DialogueScript = simple('hall_shut_night', [
  say('sealbearer', 'The Lord Regent receives the envoy at the bell. Not before.'),
]);

/** The companions hand the Master of the Chairs their houses' tokens on the Hall's steps, one after another (Se-5, stage 2). */
function handOver(): DialogueLine[] {
  const out: DialogueLine[] = [];
  for (const c of TOKEN_CHAIRS) {
    const carrier = c.house === 'al_doria' ? 'samira' : c.carrier;
    const kept = sits(c.house);
    const when = all(has(`item.${c.item}`), ...(kept ? [kept] : []), ...(c.house === 'al_doria' ? [has('party.samira')] : []));
    out.push(
      act(
        [
          { do: 'walk', actor: carrier, to: at(CONCOURSE.handOver.x, CONCOURSE.handOver.y), facing: 'up' },
          { do: 'face', actor: 'npc:chamberlain_night', facing: 'down' },
        ],
        c.carrier === 'yari' ? Y : c.house === 'al_doria' ? S : c.carrier === 'bayarmaa' ? BY : c.carrier === 'haru' ? H : V,
        c.line,
        { if: when, ...(c.mood ? { mood: c.mood } : {}) },
      ),
      { if: when, speaker: '', text: `The Master of the Chairs takes ${c.name}'s token and puts it in his coat.`, stage: [{ do: 'walk', actor: carrier, to: at(CONCOURSE.handOver.x - 2, CONCOURSE.handOver.y + 1), facing: 'up' }] },
    );
    // A house that sailed to the Crown at the Muster: nothing is handed over, and he says so once.
    if (kept) out.push({ if: betrayed(c.house), speaker: CH, text: `${c.name} was asked and sold. Its chair stays. A bare chair is a thing the Hall remembers.` });
    if (c.house !== 'al_doria') out.push({ if: all(not(`item.${c.item}`), ...(kept ? [kept] : [])), speaker: CH, text: `${c.name} sent nothing. Its chair waits.` });
  }
  return out;
}

const CHAMBERLAIN_NIGHT: DialogueScript = script('chamberlain_night_talk', {
  start: {
    lines: [],
    next: [{ if: not('side.seats.handed'), to: 'ask' }, { if: { not: BELL_READY }, to: 'waiting' }, { to: 'bell' }],
  },
  ask: {
    lines: [
      act([{ do: 'look', actor: 'npc:chamberlain_night' }], CH, 'The Master of the Chairs does not sleep on the eve of a Claim. Nobody has, in fifty years, but the rule stands.'),
      say(CH, 'I said I would put each token on its chair the day someone stands on that tile. Every house that will sit with you. Show me.'),
    ],
    choices: [{ text: 'Hand him the tokens.', next: 'hand' }, { text: 'Not yet.' }],
  },
  hand: {
    lines: [
      ...handOver(),
      say(ED, 'Aldermoor\'s chair is my mother\'s to fill. She withdrew from one council. She can sit in another.'),
      say(Z, 'Ardencia\'s chair has a Rodriguez behind it. That will have to do until tomorrow.'),
      say(CH, 'Zetwal\'s chair has its envoy, and needs no token. I will set them at the bell.', { set: { 'side.seats.handed': true } }),
    ],
    next: [{ if: BELL_READY, to: 'bell' }, { to: 'waiting' }],
  },
  waiting: {
    lines: [...BELL_PARTS.map((p) => ({ if: not(p.flag), speaker: CH, text: p.left })), { if: not('debate.seat_claim.settled'), speaker: A, text: 'Your Quests page, Gigi.' }],
  },
  bell: {
    lines: [say(CH, 'At the bell, then. Say it.')],
    choices: [{ text: 'At the bell.', next: 'dawn' }, { text: 'Not yet.' }],
  },
  dawn: {
    lines: [
      say(G, 'At the bell.'),
      nar('The lamps go out one by one round the Concourse. In Mother\'s window, the last.', { fx: 'fade' }),
      nar('Dawn. Somewhere above the Hall, a bell.'),
      act(
        [
          { do: 'enter', actor: 'patricio_c', look: 'patricio_old', from: at(CONCOURSE.zetwalGate.x, CONCOURSE.zetwalGate.y), to: at(CONCOURSE.patricioStop.x, CONCOURSE.patricioStop.y), facing: 'up' },
          { do: 'look', actor: 'patricio_c' },
        ],
        '',
        'Through Zetwal\'s gate, on his cane, with the levy standing aside for him: Grandfather.',
      ),
      // He says nothing here (owner decision, Oct 22: he speaks at the Claim of the sealing only, at the chair he cut).
      act([{ do: 'face', actor: 'patricio_c', facing: 'player' }, { do: 'wait', ms: 700 }, { do: 'face', actor: 'patricio_c', facing: 'up' }], '', 'He looks at you once, the way he looked at the ledgers, and nods.'),
      act(
        [
          { do: 'exit', actor: 'patricio_c', to: at(23, 6), async: true },
          { do: 'walk', actor: 'npc:steps_sealbearer_a', to: at(21, 6), async: true },
          { do: 'walk', actor: 'npc:steps_sealbearer_d', to: at(26, 6) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'The Sealbearers step aside. The Hall\'s doors are open.',
        { set: { 'story.bell_claim': true } },
      ),
    ],
  },
});

const STEPS_SEALBEARER: DialogueScript = script('steps_sealbearer_talk', {
  start: { lines: [], next: [{ if: has('story.bell_claim'), to: 'open' }, { to: 'shut' }] },
  shut: { lines: [say('sealbearer', 'The Lord Regent receives the envoy at the bell. Not before.')] },
  open: { lines: [say('sealbearer', 'The Hall is open, envoy. It is a Claim. Even I know what that means.')] },
});
const CLAIM_JORDYN: DialogueScript = simple('claim_jordyn_talk', [say(JO, 'I keep the law where I stand. Tonight I stand in the Throne\'s own city. It is very quiet.')]);

/** The companies at their gates: one captain's line each (the outline 4.1). */
const GATE_TALKS: DialogueScript[] = GATE_COMPANIES.map((c) => simple(`gate_${c.army}_talk`, [say(c.captain.speaker, c.captain.line)]));


// ---- Beat 3: the eighth chair (seat-hall at the bell: the tokens set, the Echo, Hollis, the count) ---------------------------

/** The Master of the Chairs walks the row at the bell and sets each token on its chair, west to east (his Chapter 5 promise). */
function setChairs(): DialogueLine[] {
  const out: DialogueLine[] = [];
  const walk = (x: number): StageCue[] => [{ do: 'sync' }, { do: 'walk', actor: 'npc:chamberlain_claim', to: at(x, 9), facing: 'up' }];
  out.push(act(walk(HALL.behind.zetwal.x), CH, 'Zetwal. Its envoy sits; it needs no token.'));
  for (const c of TOKEN_CHAIRS) {
    const x = HALL.behind[c.house as keyof typeof HALL.behind].x;
    const ok = chairSet(c);
    // Al-Doria kept, and no seal from the Muster: Layla brings it from her door (Chapter 10's rule).
    if (c.house === 'al_doria') {
      out.push(act(walk(HALL.behind.ardencia.x), CH, 'Ardencia. A Rodriguez stands behind it. That will do.'));
      out.push(
        act(
          [{ do: 'walk', actor: 'npc:layla_claim', to: at(x, 10), facing: 'up' }],
          LA,
          LAYLA.claimSeal,
          { if: all(not(`item.${c.item}`), DORINI_KEPT), set: { [`item.${c.item}`]: true } },
        ),
      );
    }
    out.push(act(walk(x), CH, `${c.name}.`, { if: ok, set: { [`side.seats.${c.house}_set`]: true } }));
    out.push(act(walk(x), CH, `${c.name}. No token. A bare chair is a thing the Hall remembers.`, { if: { not: ok }, set: { [`seat.bare.${c.house}`]: true } }));
    if (c.house === 'al_doria') out.push(act(walk(HALL.behind.aldermoor.x), CH, 'Aldermoor. Its lady sits; she brought no token, and needs none.'));
  }
  return out;
}

const BELL_HALL: DialogueScript = script('bell_hall', {
  start: {
    lines: [
      nar('The Hall at the bell. The rope is still up. Nobody is on the dais.'),
      nar('The houses\' own stand at the chambers\' doors: Mother at Zetwal\'s, Lady Rosalind at Aldermoor\'s.'),
      act([{ do: 'look', actor: 'npc:chamberlain_claim' }], CH, 'The tokens, as I said. Each on its chair, the day someone stands on that tile.'),
      ...setChairs(),
      act([{ do: 'sync' }, { do: 'walk', actor: 'npc:chamberlain_claim', to: at(HALL.chamberlain.x, HALL.chamberlain.y), facing: 'left' }, { do: 'look', actor: 'player' }], '', 'The Master of the Chairs goes back to the rope\'s end with his register.', {
        set: { 'side.seats.done': true, 'story.chairs_set': true },
      }),
      act([{ do: 'face', actor: 'follower', facing: 'up' }], A, 'The floor\'s shimmering by Yari\'s chair, Gigi. I can hold it.'),
    ],
  },
});

// The Echo (the second review's 3.12, difficulty 2): the same Hall forty-nine years ago, the chairs not yet in their row.
const CHAIR_ECHO: DialogueScript = script('chair_echo', {
  start: {
    lines: [],
    next: [{ if: has('anchor.caona_chair'), to: 'done' }, { if: has('story.chair_echo_seen'), to: 'again' }, { to: 'petition' }],
  },
  petition: {
    lines: [
      nar('The same Hall forty-nine years ago, a year after the sealing. The chairs stand in a heap in the nave, not yet in their row.'),
      nar('In the west wall, masons are bricking up a chamber door.'),
      say('anissa_far', 'I\'m holding the door, Gigi. Grandfather\'s here.'),
      act(
        [
          { do: 'walk', actor: 'npc:caona_hall', to: at(HALL.echoPlanTable.x - 1, HALL.echoPlanTable.y + 1), facing: 'right', async: true },
          { do: 'walk', actor: 'npc:benny_hall', to: at(HALL.echoPlanTable.x - 2, HALL.echoPlanTable.y + 1), facing: 'right' },
          { do: 'look', actor: 'npc:caona_hall' },
        ],
        CA,
        'Xaraguá\'s Petition of Breach. The harbor was ours by oath, and is the Crown\'s by a page nobody read to us.',
      ),
      say(CA, 'Carry it to a chamber.'),
      act([{ do: 'look', actor: 'npc:echo_chamberlain_old' }], 'echo_chamberlain', 'Received.', { set: { 'echo.petition_received': true } }),
      act([{ do: 'sync' }], '', 'He sets it on his table.'),
      act(
        [{ do: 'walk', actor: 'npc:hall_echo_clerk', to: at(HALL.echoPlanTable.x, HALL.echoPlanTable.y + 1), facing: 'up' }, { do: 'wait', ms: 700 }],
        '',
        'The Throne\'s clerk takes it off the table without a word, writes one line on its back, and carries it away.',
        { set: { 'echo.petition_filed': true } },
      ),
      act([{ do: 'sync' }, { do: 'look', actor: 'npc:benny_hall' }], BN, '"Matters touching a clause are filed with the clause."'),
      say(BN, 'Then it is filed with a page he will not sign.'),
    ],
    next: 'oath',
  },
  oath: {
    lines: [
      act([{ do: 'face', actor: 'npc:caona_hall', facing: 'down' }], CA, 'The harbor stays with the people who fish it. We fight for each other, and no paper of any crown will part us.'),
      nar('Nobody in the Hall writes it down.'),
      act([{ do: 'face', actor: 'npc:caona_hall', facing: 'player' }], CA, 'They will not write it, Marshal. Write it where they sit.'),
      say(CA, 'His plan says which chair will be ours. Find it.', { set: { 'story.chair_echo_seen': true } }),
    ],
  },
  again: { lines: [say(CA, 'Write it where they sit, Marshal. His plan on the table says which chair will be ours.')] },
  done: { lines: [say(CA, 'Then cut it deep. It is cut.')] },
});

const ECHO_PLAN: DialogueScript = simple('echo_seating_plan', [
  nar('The seating plan for the first Parley after the sealing, in the chamberlain\'s hand. Seven houses in a row before the Throne.'),
  nar('Under them: "Xaraguá: the eighth, by the wall it has no chamber in."'),
]);

const ECHO_CHAIR_CLUSTER: DialogueScript = script('echo_chair_cluster', {
  start: {
    lines: [nar('A council chair in the heap in the nave, waiting for its place in the row.')],
    choices: [{ if: all(has('story.chair_echo_seen'), not('anchor.caona_chair')), text: 'Cut the oath into it.', next: 'cut' }, { text: 'Leave it.' }],
  },
  cut: {
    lines: [
      nar('Patricio cuts the oath\'s first line into its back.', { set: { 'echo.wrong_chair': true } }),
      act([{ do: 'walk', actor: 'npc:hall_echo_clerk', to: at(HALL.echoCluster[3]!.x + 1, HALL.echoCluster[3]!.y), facing: 'left' }], '', 'The Throne\'s clerk lifts that chair and carries it to Aldermoor\'s place in the row.'),
      nar('Nothing is cut into Xaraguá\'s.'),
    ],
  },
});

const ECHO_CHAIR_XARAGUA: DialogueScript = script('echo_chair_xaragua', {
  start: {
    lines: [],
    next: [{ if: has('anchor.caona_chair'), to: 'cut_already' }, { if: has('story.chair_echo_seen'), to: 'chair' }, { to: 'plain' }],
  },
  plain: { lines: [nar('A council chair by itself against the west wall, where the masons are working.')] },
  chair: {
    lines: [nar('A council chair by itself against the west wall, by the door the masons are bricking up.')],
    choices: [{ text: 'Cut the oath into it.', next: 'cut' }, { text: 'Leave it.' }],
  },
  cut: {
    lines: [
      nar('Patricio takes out his knife and cuts the oath\'s first line into the chair\'s back.', { set: { 'anchor.caona_chair': true } }),
      say(PT, 'Somebody will sit here who was asked.'),
      act([{ do: 'walk', actor: 'npc:caona_hall', to: at(HALL.echoXaraguaChair.x + 1, HALL.echoXaraguaChair.y), facing: 'left' }], CA, 'Then cut it deep.'),
    ],
  },
  cut_already: { lines: [nar('The chair\'s back: "The harbor stays with the people who fish it." Cut deep.')] },
});

const ECHO_PEOPLE: DialogueScript[] = [
  simple('caona_hall_talk', [say(CA, 'They will not write it. Write it where they sit.')]),
  simple('benny_hall_talk', [say(BN, 'I would sign this one. Nobody has asked me.')]),
  simple('echo_chamberlain_old_talk', [say('echo_chamberlain', 'The plan is on the table, Marshal. The masons have their orders.')]),
  simple('hall_echo_clerk_talk', [nar('The Throne\'s clerk writes. He does not speak.')]),
  simple('echo_mason_talk', [say('mason', 'Brick it up, the order says. No chamber for a house that signed nothing.')]),
];

const CHAIR_RETURN: DialogueScript = script('chair_echo_return', {
  start: {
    lines: [],
    next: [{ if: all(has('anchor.caona_chair'), not('story.chair_read')), to: 'turn' }, { if: has('story.chair_read'), to: 'quiet' }, { to: 'not_yet' }],
  },
  not_yet: { lines: [say(A, 'Nothing\'s changed, Gigi. Grandfather was looking for something to write on.')] },
  quiet: { lines: [nar('The eighth chair, turned round on its feet. The line on its back.')] },
  turn: {
    lines: [
      act([{ do: 'walk', actor: 'yari', to: at(HALL.behind.xaragua.x, HALL.behind.xaragua.y), facing: 'up' }, { do: 'wait', ms: 700 }], '', 'Yari turns the eighth chair round on its feet.'),
      say(Y, '"The harbor stays with the people who fish it."'),
      act([{ do: 'face', actor: 'yari', facing: 'down' }], Y, 'She wrote it on their furniture.', { set: { 'story.chair_read': true } }),
    ],
    next: 'hollis',
  },
  hollis: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'hollis_c', look: 'hollis', from: at(HALL.door.x, HALL.door.y), to: at(HALL.behind.xaragua.x + 1, HALL.behind.xaragua.y + 1), facing: 'up' },
          { do: 'look', actor: 'hollis_c' },
        ],
        '',
        'Keeper Hollis comes in by the Hall\'s doors and up the nave, both hands full.',
      ),
      say(HO, 'Filed with the clause. Your mother\'s petition, cacica, in a hand older than your father\'s.'),
      say(HO, 'I kept a ribbon with no page for eleven years, and never looked under the page.'),
      act([{ do: 'wait', ms: 600 }], '', 'He sets Xaraguá\'s original Petition of Breach on the eighth chair.', { set: { 'clue.petition_original': true } }),
      act([{ do: 'sync' }], Y, 'Received. Never heard.'),
      say(HO, 'It will be heard today. A Claim hears everything in the Hall. That is in the Compact too.'),
      act([{ do: 'walk', actor: 'hollis_c', to: at(HALL.hollis.x, HALL.hollis.y), facing: 'left' }, { do: 'look', actor: 'player' }], '', 'He goes to the clerk\'s table, and opens the register.'),
    ],
  },
});

/** The eighth chair in the present (the second review's 3.8: no seat; it is turned, not sat in). */
const CHAIR_XARAGUA_CUT: DialogueScript = script('chair_xaragua_cut', {
  start: { lines: [], next: [{ if: has('clue.petition_original'), to: 'petition' }, { to: 'cut' }] },
  cut: { lines: [nar('The eighth chair, turned round. On its back, cut deep: "The harbor stays with the people who fish it."')] },
  petition: { lines: [nar('The eighth chair, turned round, the oath cut into its back. On its seat, Xaraguá\'s Petition of Breach.')] },
});

/** The count (the second review's 3.2 and 3.3; the decisions after it: Elodie speaks Anissa's names). */
const CHAMBERLAIN_CLAIM: DialogueScript = script('chamberlain_claim_talk', {
  start: {
    lines: [],
    next: [
      { if: not('clue.petition_original'), to: 'wait' },
      { if: not('story.claim_counted'), to: 'count' },
      { if: not('story.claim_won'), to: 'tile' },
      { to: 'after' },
    ],
  },
  wait: { lines: [say(CH, 'The register is open, envoy. A Claim waits for the record, and the Keeper has not come up from the Archive.')] },
  count: {
    lines: [
      act([{ do: 'walk', actor: 'npc:chamberlain_claim', to: at(24, 6), facing: 'left' }], CH, 'By the Founding Compact a claimant stands on the tile with nine of the realm\'s regard across the three pillars, and two in each.'),
      say(CH, 'The register reads, for the realm: Influence {realm.influence}. Wealth {realm.wealth}. Fear {realm.fear}.'),
      say(CH, 'For Gianna Elise Limyè of Zetwal. Limyè is a temple name, not a house. Under what name does the claimant stand?'),
      act(
        [{ do: 'walk', actor: 'npc:elodie_claim', to: at(HALL.elodieRope.x, HALL.elodieRope.y), facing: 'up' }, { do: 'look', actor: 'npc:elodie_claim' }],
        E,
        'Jean-Philippe, by her mother. Rodriguez, by her father, Rael of Ardencia. Count her.',
      ),
      act([{ do: 'look', actor: 'npc:claim_clerk' }], '', 'The Crown\'s clerk writes it down. In the whole Hall, nobody hears anything but the pen.'),
      act([{ do: 'walk', actor: 'follower', to: at(HALL.anissaRope.x, HALL.anissaRope.y), facing: 'up' }, { do: 'look', actor: 'npc:elodie_claim' }], E, 'And Anissa Jean-Philippe Rodriguez. Of both. Write her down too.'),
      say(CH, '...Counted. And for Azriel Rodriguez of Ardencia the same, by his father\'s house.'),
      act([{ do: 'look', actor: 'npc:rosalind_claim' }], RO, 'Stillwater does not stand.', { set: { 'story.claim_counted': true } }),
    ],
    next: 'regent',
  },
  regent: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'regent_c', look: 'regent', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.regent.x, HALL.regent.y), facing: 'down' },
          { do: 'look', actor: 'regent_c' },
        ],
        '',
        'Down the heralds\' stair, a hand on the Throne\'s arm as on the first day: the Lord Regent. He sits on the step, not the tile.',
      ),
      act([{ do: 'enter', actor: 'hale_c', look: 'hale', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.hale.x, HALL.hale.y), facing: 'down' }], '', 'Behind him, Captain-General Hale, yielded on the pier and sent home on the Patience.', { if: STRIKE }),
      act([{ do: 'enter', actor: 'thorne_c', look: 'thorne', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.thorne.x, HALL.thorne.y), facing: 'down' }], 'thorne', 'Miss Limyè. The Charter stands.', { if: has('choice.thorne_spared') }),
      { if: TRUST, speaker: RG, text: 'Envoy. You held a pier. I hold a Hall.' },
      { if: STRIKE, speaker: RG, text: 'Envoy. You struck on a pier. I hold a Hall.' },
      say(RG, 'The Parley sits again, if you want it. The terms are what they were.'),
    ],
    next: 'rope',
  },
  rope: {
    lines: [
      act([{ do: 'look', actor: 'npc:elodie_claim' }], '', 'Mother stands at the rope\'s line, as she said she would, and goes no further.'),
      act([{ do: 'face', actor: 'npc:rope_sealbearer_a', facing: 'up' }, { do: 'face', actor: 'npc:rope_sealbearer_b', facing: 'up' }], '', 'The two Sealbearers at the rope look at the Regent.'),
      say(RG, 'Let her up. It is a tile.'),
      act(
        [
          { do: 'walk', actor: 'npc:rope_sealbearer_a', to: at(16, 6), facing: 'up', async: true },
          { do: 'walk', actor: 'npc:rope_sealbearer_b', to: at(27, 6), facing: 'up' },
          { do: 'wait', ms: 500 },
        ],
        '',
        'They unhook the violet rope from its posts, and carry it to the wall.',
        { set: { 'story.claim_begun': true } },
      ),
      act([{ do: 'sync' }, { do: 'look', actor: 'player' }], '', 'The way up the dais is open. A claimant goes up alone.'),
    ],
  },
  tile: { lines: [say(CH, 'The tile, envoy. The Hall is counted.')] },
  after: { lines: [say(CH, 'The chairs are filled. I have dusted them for fifty years. It was worth it.')] },
});

// ---- Beat 4: the Claim (the tile, the Regent's Challenge, then Azzy's choice; the rulebook's order: rules-decisions [42]) -------

const CLAIM_DECLARE: DialogueScript = script('claim_declare', {
  start: { lines: [], next: [{ if: has('story.claim_declared'), to: 'again' }, { to: 'declare' }] },
  declare: {
    lines: [
      act([{ do: 'face', actor: 'player', facing: 'down' }, { do: 'wait', ms: 600 }], '', 'Gianna stands on the Throne tile, and turns to the Hall.'),
      { if: XARAGUA_FIRST, speaker: G, text: 'For Xaraguá. Its harbor stays with the people who fish it. Received forty-nine years ago. Heard today.' },
      { if: ANISSA_FIRST, speaker: G, text: 'So that nobody in this Hall ever counts a child again.' },
      act([{ do: 'face', actor: 'follower', facing: 'up' }], G, 'I claim the Throne, by Zetwal and by Ardencia, under the Compact.', { set: { 'story.claim_declared': true } }),
    ],
    next: 'challenge',
  },
  challenge: {
    lines: [
      act([{ do: 'walk', actor: 'npc:regent_claim_npc', to: at(22, 5), facing: 'up' }, { do: 'look', actor: 'npc:regent_claim_npc' }], RG, 'A Challenge, under the Compact. The Throne is held for now. It is held by me.'),
      say(RG, 'The Commission runs until a claimant stands on the tile with the houses behind her. It does not say how many.'),
      say(RG, 'I say these are not enough.'),
      { if: any(...TOKEN_CHAIRS.map((c) => has(`seat.bare.${c.house}`))), speaker: '', text: 'His eyes go to the bare chair, and stay there a moment.' },
      { if: eq('choice.refusal', 'asked'), speaker: RG, text: 'You said Xaraguá was not asked. Ask it now.' },
      { if: eq('choice.refusal', 'protest'), speaker: RG, text: 'You said you were the protest. Protest, then.' },
      say(CH, 'Clause Twelve. No steel inside the eight gates. Save one: a Challenge, met on the floor of this Hall.'),
      act(
        [
          { do: 'walk', actor: 'npc:rope_sealbearer_a', to: at(21, 6), facing: 'up', async: true },
          { do: 'walk', actor: 'npc:rope_sealbearer_b', to: at(23, 6), facing: 'up' },
        ],
        RG,
        'Sealbearers.',
      ),
      say(CH, 'The Compact says the claimant and the challenger. He has brought his seals. Then she brings her houses.'),
      act(
        [
          { do: 'walk', actor: 'yari', to: at(HALL.fighters[0]!.x, HALL.fighters[0]!.y), facing: 'down', async: true },
          { do: 'walk', actor: 'azzy', to: at(HALL.fighters[1]!.x, HALL.fighters[1]!.y), facing: 'down', async: true },
          { do: 'walk', actor: 'samira', to: at(HALL.fighters[2]!.x, HALL.fighters[2]!.y), facing: 'down', async: true },
          { do: 'walk', actor: 'follower', to: at(HALL.anissaFoot.x, HALL.anissaFoot.y), facing: 'down' },
        ],
        '',
        'Her own walk up from the chambers\' doors and stand on the dais beside her. Anissa comes up behind them.',
      ),
      say(RG, 'The Charter stands, envoy. It is written. Nothing you have done unwrites it.'),
      say(G, 'So is the oath. Read the chair.', { set: { 'battle.next': 'claim_regent', 'battle.after': 'claim_after_regent' } }),
    ],
  },
  again: {
    lines: [say(RG, 'The Challenge stands, envoy. Nobody leaves the Hall while it does.', { set: { 'battle.next': 'claim_regent', 'battle.after': 'claim_after_regent' } })],
  },
});

/** The Regent on the dais's step, between tries (the way back in: the Assize's shape). */
const REGENT_CLAIM: DialogueScript = script('regent_claim_npc_talk', {
  start: { lines: [], next: [{ if: has('story.regent_beaten'), to: 'beaten' }, { if: has('story.claim_declared'), to: 'again' }, { to: 'wait' }] },
  wait: { lines: [say(RG, 'The tile is there, envoy. Stand on it, or do not.')] },
  again: { lines: [say(RG, 'The Challenge stands, envoy. Nobody leaves the Hall while it does.', { set: { 'battle.next': 'claim_regent', 'battle.after': 'claim_after_regent' } })] },
  beaten: { lines: [say(RG, '...It is a tile.')] },
});

/** The chairs fill, the petition is heard, the Regent is arrested, and Rael comes in (shared by both after-scenes). */
function claimStands(): Record<string, DialogueNode> {
  const fill = (actor: string, to: P, text: string, cond?: Condition): DialogueLine =>
    act([{ do: 'walk', actor, to: at(to.x, to.y), facing: 'up' }], '', text, cond ? { if: cond } : {});
  const kept = (house: string): Condition => ({ not: betrayed(house) });
  const B = HALL.behind;
  return {
    stands: {
      lines: [
        act([{ do: 'look', actor: 'npc:chamberlain_claim' }], CH, 'The claimant has met every Challenge. By the Compact the Claim stands.', { set: { 'story.claim_won': true } }),
        say(CH, 'The chairs fill.'),
        fill('npc:elodie_claim', B.zetwal, 'Mother walks from the rope to Zetwal\'s chair, and stands behind it.'),
        fill('yari', B.xaragua, 'Yari stands behind the eighth chair, the paddle in her hand and the petition on its seat.'),
        fill('azzy', B.ardencia, 'Azzy goes to Ardencia\'s chair.', { not: SHARE }),
        fill('npc:layla_claim', B.al_doria, 'Layla Dorini comes from Al-Doria\'s door to its chair.', DORINI_KEPT),
        { if: betrayed('al_doria'), speaker: '', text: 'Al-Doria\'s chair stays empty.' },
        act([{ do: 'walk', actor: 'npc:rosalind_claim', to: at(B.aldermoor.x, B.aldermoor.y), facing: 'up', async: true }, { do: 'walk', actor: 'edmund', to: at(HALL.edmund.x, HALL.edmund.y), facing: 'up' }], '', 'Lady Rosalind comes from Aldermoor\'s door to its chair. Edmund stands beside her.'),
        fill('bayarmaa', B.skarragol, 'Bayarmaa stands behind Skarragol\'s chair, the braid on its seat.', kept('skarragol')),
        fill('haru', B.kuroshi, 'Haru stands behind Kuroshi\'s chair, the crane on its seat.', kept('kuroshi')),
        fill('vikram', B.jwaladesh, 'Vikram stands behind Jwaladesh\'s chair, the lamp on its seat.', kept('jwaladesh')),
        ...TOKEN_CHAIRS.filter((c) => c.house !== 'al_doria' && sits(c.house)).map((c): DialogueLine => ({ if: betrayed(c.house), speaker: '', text: `${c.name}'s chair stays empty.` })),
        act([{ do: 'walk', actor: 'samira', to: at(HALL.samira.x, HALL.samira.y), facing: 'up' }], '', 'Samira stands in the nave with the party\'s own.'),
      ],
      next: 'heard',
    },
    // The Seventh Clause answered at the Claim, under Clause Six (the decisions after the second review; its 3.1).
    heard: {
      lines: [
        act([{ do: 'look', actor: 'npc:chamberlain_claim' }], CH, 'The register has one matter received and never heard. Xaraguá\'s Petition of Breach.'),
        say(CH, 'Received forty-nine years ago. Answers: none. The chairs will answer it now, for the record.'),
        act([{ do: 'look', actor: 'npc:elodie_claim' }], E, 'Zetwal: breach.'),
        ...TOKEN_CHAIRS.flatMap((c): DialogueLine[] => {
          const kept = sits(c.house);
          const lines: DialogueLine[] = kept ? [{ if: kept, speaker: c.speaker, text: c.answer }, { if: { not: kept }, speaker: CH, text: `${c.name}: no answer.` }] : [say(c.speaker, c.answer)];
          if (c.house === 'xaragua') lines.push(say(Z, 'Ardencia: breach.'));
          if (c.house === 'al_doria') lines.push(say(RO, 'Aldermoor: breach. The Crown\'s own record says so.'));
          return lines;
        }),
        act([{ do: 'look', actor: 'npc:hollis_claim' }], '', 'Keeper Hollis writes each answer into the blank in the register, under a small circle in ink that is not old.', {
          set: { 'clue.petition_heard': true },
        }),
        say(HO, 'Clause Six of the Founding Compact. A clause not read is not agreed.'),
        say(HO, 'The seventh was read to a clerk alone. It was never agreed.'),
      ],
      next: [{ if: has(RIBBON.item), to: 'ribbon' }, { to: 'patricio' }],
    },
    // Se-4 The Unknotted Ribbon (SECRET-ITEMS.md 9, built Oct 27): with the minute proved, the keeper strikes the clause.
    ribbon: {
      lines: [
        act([{ do: 'look', actor: 'npc:hollis_claim' }, { do: 'walk', actor: 'npc:hollis_claim', to: at(HALL.foot.x + 1, HALL.foot.y), facing: 'up' }], '', 'Keeper Hollis comes up the nave to the dais with an old register open in his hands.'),
        say(HO, 'The minute of the sealing, in the Throne\'s clerk\'s hand. Sealed fifty years ago. Proved in the Archive, line by line.'),
        nar('Gianna takes the Seventh Ribbon out of the minute and holds it up, untied, for every chair to see.'),
        say(HO, 'Throne law. A clause whose ribbon was never knotted, and whose minute shows no witness agreed, is struck.'),
        act([{ do: 'face', actor: 'npc:hollis_claim', facing: 'up' }, { do: 'wait', ms: 900 }], '', 'He draws one line through the seventh page, in front of every house.', {
          set: { [RIBBON.struck]: true },
        }),
        say(HO, 'The Seventh Clause is struck. The harbor of Xaraguá is in no one\'s keeping but Xaraguá\'s.'),
        act([{ do: 'look', actor: 'yari' }, { do: 'face', actor: 'yari', facing: 'up' }], Y, 'Then it was never theirs to keep.'),
        act([{ do: 'walk', actor: 'npc:hollis_claim', to: at(HALL.hollis.x, HALL.hollis.y), facing: 'left' }, { do: 'look', actor: 'player' }], '', 'Hollis goes back to the clerk\'s table, and writes it into the Hall\'s register.'),
      ],
      next: 'patricio',
    },
    // Old Patricio at the chair his young self cut: the sealing only (owner decision, Oct 22; question 13 stays open).
    patricio: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:patricio_claim', to: at(HALL.patricioChair.x, HALL.patricioChair.y), facing: 'up' }, { do: 'wait', ms: 900 }],
          '',
          'Grandfather walks to the eighth chair on his cane, and puts his hand on the line cut into its back.',
        ),
        say(PO, 'I sealed six pages under protest. Nobody read me the seventh.', { mood: 'sad' }),
        say(PO, 'I remembered the wrong thing.', { mood: 'sad' }),
      ],
      next: 'reckoning',
    },
    // The Regent's reckoning (the second review's 3.6): arrested on the almoner's commission, under his own seal.
    reckoning: {
      lines: [
        act([{ do: 'walk', actor: 'npc:hollis_claim', to: at(24, 6), facing: 'up' }], '', 'Hollis lays the Regent\'s Commission on the dais\'s step: renewed, renewed, renewed, the last in the Regent\'s own hand.'),
        act([{ do: 'walk', actor: 'npc:jordyn_claim', to: at(25, 6), facing: 'up' }, { do: 'look', actor: 'npc:jordyn_claim' }], JO, 'And this. "To the Crown\'s almoner, the keeping of the quiet." Under the Throne\'s seal. I kept the paper.'),
        say(HO, 'The same seal. This one has a hand.'),
        act([{ do: 'look', actor: 'npc:regent_claim_npc' }], RG, '...The Crown keeps no almoner.'),
        say(JO, 'Under the Compact, my lord. Not under me.'),
        act(
          [
            { do: 'exit', actor: 'npc:regent_claim_npc', to: at(HALL.stair.x, HALL.stair.y), async: true },
            { do: 'exit', actor: 'npc:jordyn_claim', to: at(HALL.stair.x, HALL.stair.y + 1) },
          ],
          '',
          'Jordyn walks the Lord Regent up the heralds\' stair, under arrest for the almoner\'s commission.',
          { set: { 'story.regent_arrested': true } },
        ),
        { if: STRIKE, speaker: '', text: 'Captain-General Hale lays his axe on the dais, and stands away from it.' },
      ],
      next: 'rael',
    },
    // Beat 5: Rael comes in, the same hour (the second review's 3.8: Trust and Strike say what each was told).
    rael: {
      lines: [
        act(
          [
            { do: 'sync' },
            { do: 'enter', actor: 'rael_c', look: 'rael', from: at(HALL.door.x, HALL.door.y), to: at(HALL.foot.x, HALL.foot.y + 1), facing: 'up', async: true },
            { do: 'enter', actor: 'rivera_c', look: 'rivera', from: at(HALL.door.x, HALL.door.y), to: at(HALL.foot.x - 1, HALL.foot.y + 3), facing: 'up', async: true },
            { do: 'enter', actor: 'jaime_c', look: 'jaime', from: at(HALL.door.x + 1, HALL.door.y), to: at(HALL.foot.x + 1, HALL.foot.y + 3), facing: 'up', async: true },
            { do: 'look', actor: 'rael_c' },
            { do: 'wait', ms: 2400 },
          ],
          '',
          'Up the nave, alone in front, his hands behind his back: Rael. Rivera and Jaime behind him, carrying nothing.',
        ),
        act([{ do: 'enter', actor: 'benny_c', look: 'benny_old', from: at(HALL.door.x, HALL.door.y), to: at(HALL.foot.x, HALL.foot.y + 5), facing: 'up' }], '', 'Old Benny comes behind them, on his cane.', { if: TRUST }),
        act([{ do: 'face', actor: 'npc:benny_claim', facing: 'right' }, { do: 'wait', ms: 700 }], '', 'By Ardencia\'s door, old Benny stands up, and says nothing.', { if: STRIKE }),
        { if: TRUST, speaker: R, text: 'I said the Throne would have a Hearing for men like me. It has a Throne. Make it.' },
        { if: STRIKE, speaker: R, text: 'To a Throne. Not to a watch. There is a Throne now.' },
        { if: STRIKE, speaker: R, text: 'You said: at Eightgate. Here I am. Make it.' },
        act([{ do: 'walk', actor: 'rael_c', to: at(HALL.foot.x, HALL.foot.y), facing: 'up' }, { do: 'wait', ms: 700 }], '', 'He takes the signet off his hand, and sets it on the dais\'s lowest step.', { set: { 'story.signet_laid': true } }),
        act([{ do: 'sync' }, { do: 'walk', actor: 'rael_c', to: at(HALL.foot.x, HALL.foot.y + 1), facing: 'up' }, { do: 'wait', ms: 900 }], '', 'Then he kneels.'),
        { if: STRIKE, speaker: G, text: 'Why did you come north?' },
        { if: STRIKE, speaker: R, text: 'I told your mother I would. I tell her everything. It is the only honest thing I do.' },
        act(
          [{ do: 'enter', actor: 'jordyn_c', look: 'jordyn_free', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.foot.x, HALL.foot.y + 2), facing: 'up' }, { do: 'look', actor: 'jordyn_c' }],
          JO,
          'I have the one set of words. I\'ll wait to see which I need.',
          { set: { 'story.rael_surrendered': true } },
        ),
        say(R, 'Rivera. The treasurer.'),
        act([{ do: 'exit', actor: 'rivera_c', to: at(HALL.door.x, HALL.door.y) }], '', 'Rivera goes back down the nave and out, toward the Ash Road.'),
        nar('The Claim stands. The Hearing sits in nine days. The witnesses are sent for.', {
          fx: 'fade',
          set: { 'story.hearing_called': true, 'travel.next': 'seat-concourse/hearing_morning' },
        }),
      ],
    },
  };
}

const CLAIM_AFTER_REGENT: DialogueScript = script('claim_after_regent', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:regent_claim_npc' }], '', 'The Lord Regent goes down on one knee on the dais\'s step.'),
      say(RG, '...It is a tile.', { set: { 'story.regent_beaten': true } }),
      nar('The Sealbearers\' seals lie on the floor of the Hall where they set them down.'),
      act([{ do: 'look', actor: 'npc:claim_clerk' }], '', 'The Crown\'s clerk has stopped writing. He is looking at the tile.'),
    ],
    next: [{ if: DARK, to: 'challenge' }, { if: SHARE, to: 'share' }, { to: 'renounce' }],
  },
  // Azzy's choice, on the spot (guide 5.6; COMBAT 13.3 #10: "On defeat: Azzy's choice"), read from what the player did.
  share: {
    lines: [
      act([{ do: 'walk', actor: 'azzy', to: at(HALL.tile.x + 1, HALL.tile.y), facing: 'down' }], Z, 'Two houses, one Claim. I said it at the fair: it is not for one of us.'),
      say(Z, 'Count us together, Master of the Chairs.'),
      { if: STRIKE, speaker: Z, text: 'I am still angry with you. I will be angry on the tile.' },
      say(CH, '...Counted.', { set: { 'claim.azzy_share': true } }),
    ],
    next: 'stands',
  },
  renounce: {
    lines: [
      act([{ do: 'walk', actor: 'azzy', to: at(HALL.foot.x, HALL.foot.y - 1), facing: 'up' }], Z, 'I did not want it when it was one. I want it less now that it is two.'),
      { if: STRIKE, speaker: Z, text: '...I\'m still angry. That is not the same as a Challenge.' },
      say(Z, 'Stand on it. I\'ll stand here.', { set: { 'claim.azzy_renounced': true } }),
    ],
    next: 'stands',
  },
  // The dark route (owner decision, Oct 22): Strike, and "the realm had to see him beaten". After the Regent, wounds and all.
  challenge: {
    lines: [
      act([{ do: 'walk', actor: 'azzy', to: at(HALL.foot.x, HALL.foot.y - 1), facing: 'up' }], Z, 'Under the Compact, two claimants. I answer yours too.'),
      say(Z, 'Not for the chair. So that you have to say, in front of them, why you chose the fight when you had him and you had them.'),
      act([{ do: 'look', actor: 'npc:elodie_claim' }], E, 'Azriel.'),
      act([{ do: 'look', actor: 'azzy' }, { do: 'wait', ms: 700 }], '', 'He does not turn.'),
      act([{ do: 'face', actor: 'follower', facing: 'up' }], A, 'Don\'t hurt him, Gigi.'),
      say(G, 'I won\'t.', { set: { 'claim.challenge': true, 'party.azzy': false, 'battle.next': 'claim_azzy', 'battle.after': 'claim_after_azzy' } }),
    ],
  },
  ...claimStands(),
});

const CLAIM_AFTER_AZZY: DialogueScript = script('claim_after_azzy', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:azzy_challenge' }], '', 'Azzy is on one knee at the dais\'s foot, the cords on his wrists.'),
      say(Z, '...Then it\'s yours. I\'ll hold you to it. Every day.', { set: { 'claim.azzy_challenged': true, 'party.azzy': true } }),
    ],
    next: 'stands',
  },
  ...claimStands(),
});

const AZZY_CHALLENGE: DialogueScript = script('azzy_challenge_talk', {
  start: { lines: [], next: [{ if: has('claim.azzy_challenged'), to: 'done' }, { to: 'again' }] },
  again: { lines: [say(Z, 'Under the Compact. Again.', { set: { 'battle.next': 'claim_azzy', 'battle.after': 'claim_after_azzy' } })] },
  done: { lines: [say(Z, 'I\'ll hold you to it.')] },
});

const HALL_CLAIM_CLOSED: DialogueScript = simple('hall_claim_closed', [say('herald', 'The Challenge stands, envoy. Nobody leaves the Hall while it does.', { mood: 'impassive' })]);

/** The people in the Hall at the bell and the Claim (one line each). */
const CLAIM_PEOPLE: DialogueScript[] = [
  script('elodie_claim_talk', {
    start: { lines: [], next: [{ if: has('story.claim_won'), to: 'after' }, { to: 'before' }] },
    before: { lines: [say(E, 'At the rope, and no further. I said so. I keep what I say.')] },
    after: { lines: [say(E, 'Zetwal\'s chair. I have stood beside it for a year. I will stand behind it now.')] },
  }),
  simple('claim_clerk_talk', [nar('The Crown\'s clerk writes. Every word in the Hall today goes into his book.')]),
  simple('rosalind_claim_talk', [say(RO, 'I withdrew from one council. I can sit in another.')]),
  simple('layla_claim_talk', [say(LA, LAYLA.claimTalk)]),
  simple('patricio_claim_talk', [say(PO, 'I came to hear a petition. I will hear it.')]),
  simple('jordyn_claim_talk', [say(JO, 'The watch is at the doors. Under the Compact, not under me.')]),
  simple('benny_claim_talk', [say(BO, 'He went north. I came anyway. A witness goes where the Hearing is.')]),
  simple('hale_claim_talk', [say('hale', 'The Regent asked me to make it quick on the pier. I did not. I will not here.')]),
  simple('thorne_claim_talk', [say('thorne', 'Miss Limyè. The Charter stands.')]),
  script('hollis_claim_talk', {
    start: { lines: [], next: [{ if: has('clue.petition_heard'), to: 'heard' }, { to: 'register' }] },
    register: { lines: [say(HO, 'The register is open at Xaraguá\'s line. It has been open there for forty-nine years.')] },
    heard: { lines: [say(HO, 'Eight answers in the blank. I have written in that book every day for eleven years. Never that.')] },
  }),
];

/** The register on the clerk's table (the petition's answers written in: the review's 3.1). */
const REGISTER: DialogueScript = script('claim_register', {
  start: { lines: [], next: [{ if: has('clue.petition_heard'), to: 'heard' }, { to: 'open' }] },
  open: { lines: [nar('The Hall\'s register, open at Xaraguá\'s petition: "received", and a blank with a circle round it.')] },
  heard: { lines: [nar('Xaraguá\'s petition in the register: "received", and under it, at last, the chairs\' answers. Breach.')] },
});

// ---- The Epilogue: nine days later (the second review's 3.9: the witnesses sent for, the arrivals shown) ---------------------

const ARRIVALS: DialogueScript = script('hearing_arrivals', {
  start: {
    lines: [
      nar('Nine days later. The Hearing\'s morning.', { fx: 'fade' }),
      act([{ do: 'sync' }], '', 'Xaraguá\'s gate stands open. The masons took the bricks out on the third day.'),
      act(
        [
          { do: 'enter', actor: 'lo_c', look: 'lamp_oil_seller', from: at(CONCOURSE.xaraguaGate.x, CONCOURSE.xaraguaGate.y), to: at(21, 8), facing: 'right', async: true },
          { do: 'enter', actor: 'cl_c', look: 'camp_leader', from: at(CONCOURSE.xaraguaGate.x + 1, CONCOURSE.xaraguaGate.y), to: at(20, 9), facing: 'right' },
          { do: 'look', actor: 'lo_c' },
        ],
        LO,
        'Yucayeque sent me. I sell lamp oil. I am told that makes me a witness.',
      ),
      say('camp_leader', 'And me, to see it done. The cacique said someone must stand on it. Someone did.'),
      // Se-4: the ribbon to Yari, and the harbor returned by law before the Hearing begins (SECRET-ITEMS.md 9).
      act(
        [
          { do: 'enter', actor: 'ho_c', look: 'hollis', from: at(23, 6), to: at(23, 8), facing: 'down', async: true },
          { do: 'walk', actor: 'yari', to: at(23, 9), facing: 'up' },
          { do: 'look', actor: 'ho_c' },
        ],
        '',
        'Keeper Hollis comes down the Hall\'s steps with the register under his arm. Yari walks over to meet him.',
        { if: has(RIBBON.struck) },
      ),
      { if: has(RIBBON.struck), speaker: '', text: 'Gianna puts the Seventh Ribbon into Yari\'s hands, untied.', set: { [RIBBON.item]: false } },
      { if: has(RIBBON.struck), speaker: HO, text: 'Cacica. The harbor of Xaraguá and its waters, returned by law, before the Hearing begins. It is in the register.' },
      { if: has(RIBBON.struck), speaker: Y, text: 'Not given back. Returned. I will tell them the difference at home.' },
      act([{ do: 'exit', actor: 'ho_c', to: at(24, 6) }], '', 'Hollis goes back up the steps.', { if: has(RIBBON.struck) }),
    ],
    next: 'zetwal',
  },
  zetwal: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'an_c', look: 'anicette', from: at(CONCOURSE.zetwalGate.x, CONCOURSE.zetwalGate.y), to: at(25, 8), facing: 'left', async: true },
          { do: 'enter', actor: 'sb_c', look: 'sebastian', from: at(CONCOURSE.zetwalGate.x + 1, CONCOURSE.zetwalGate.y), to: at(26, 9), facing: 'left' },
          { do: 'look', actor: 'an_c' },
        ],
        AN,
        'There you are. Your grandfather walked. I took the ship, like a sensible woman.',
      ),
      { if: has('item.volume_one'), speaker: '', text: 'Gianna puts Volume One into Grandmother\'s hands.' },
      { if: has('item.volume_one'), speaker: AN, text: 'Twenty years overdue. I will not charge her. I will tell her so, in front of people.', mood: 'sly' },
      { if: has('item.volume_one'), speaker: '', text: '(Volume One is back on Grandmother\'s shelf, or will be.)', set: { 'side.volume_one.done': true, 'item.volume_one': false } },
    ],
    next: 'sebastian',
  },
  sebastian: { lines: [say(SB, 'I was somewhere being famous. It was here.')], next: 'ardencia' },
  ardencia: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'rv_c', look: 'rivera', from: at(CONCOURSE.ardenciaGate.x, CONCOURSE.ardenciaGate.y), to: at(28, 10), facing: 'left', async: true },
          { do: 'enter', actor: 'tr_c', look: 'ard_treasurer', from: at(CONCOURSE.ardenciaGate.x, CONCOURSE.ardenciaGate.y + 1), to: at(27, 11), facing: 'left', async: true },
          { do: 'enter', actor: 'td_c', look: 'treasurer_daughter', from: at(CONCOURSE.ardenciaGate.x + 1, CONCOURSE.ardenciaGate.y + 1), to: at(28, 11), facing: 'left', async: true },
          { do: 'enter', actor: 'am_c', look: 'amanda', from: at(CONCOURSE.ardenciaGate.x + 1, CONCOURSE.ardenciaGate.y), to: at(26, 10), facing: 'left', async: true },
          { do: 'enter', actor: 'na_c', look: 'nancy', from: at(CONCOURSE.ardenciaGate.x, CONCOURSE.ardenciaGate.y), to: at(29, 11), facing: 'left', async: true },
          { do: 'enter', actor: 'ze_c', look: 'zelia', from: at(CONCOURSE.ardenciaGate.x + 1, CONCOURSE.ardenciaGate.y), to: at(29, 10), facing: 'left' },
          { do: 'look', actor: 'tr_c' },
        ],
        TD,
        'He walked from the Ash Road. He would not be carried.',
      ),
      say(TR, 'I am alive. I was held where the ash falls. Now I am here.'),
      say(AM, 'Gigi. I brought bread. Nobody in this city has eaten since the Claim, I can tell.'),
    ],
    next: 'aldermoor',
  },
  aldermoor: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'ra_c', look: 'rahel', from: at(CONCOURSE.aldermoorGate.x, CONCOURSE.aldermoorGate.y), to: at(19, 10), facing: 'right', async: true },
          { do: 'enter', actor: 'pa_c', look: 'patricia', from: at(CONCOURSE.aldermoorGate.x, CONCOURSE.aldermoorGate.y + 1), to: at(19, 11), facing: 'right', async: true },
          { do: 'enter', actor: 'pr_c', look: 'printer', from: at(CONCOURSE.aldermoorGate.x, CONCOURSE.aldermoorGate.y), to: at(20, 11), facing: 'right' },
          { do: 'look', actor: 'ra_c' },
        ],
        RA,
        'Five children, three countries. One of them is kneeling in that Hall. I came to see it.',
      ),
      act([{ do: 'face', actor: 'pa_c', facing: 'player' }], PA, 'Things in halves, little one. I said.'),
      say(PR, 'The purge list came to us with a thumb on it. I have a press waiting. I will print what is said.'),
    ],
    next: 'in',
  },
  in: {
    lines: [
      act(
        [
          ...['lo_c', 'cl_c', 'an_c', 'sb_c', 'rv_c', 'tr_c', 'td_c', 'am_c', 'na_c', 'ze_c', 'ra_c', 'pa_c', 'pr_c'].map((a, i): StageCue => ({ do: 'exit', actor: a, to: at(23 + (i % 2), 6), async: true })),
          { do: 'wait', ms: 1600 },
        ],
        '',
        'Up the Hall\'s steps, one after another, and in.',
      ),
      nar('At noon, the Hall.', { fx: 'fade', set: { 'story.hearing_arrived': true, 'story.hall_seated': true, 'travel.next': 'seat-hall/hearing_step' } }),
    ],
  },
});

/**
 * Witnesses walk from the bench to the clerk's table, speak once, and Rael answers once as they walk back (the review's 3.11:
 * the bench and the table on one screen, four to eight tiles apart). Two who come up together stand side by side.
 */
function witness(who: readonly { npc: string; home: P }[], said: DialogueLine[], answer: string, cond?: Condition): DialogueLine[] {
  const spot = HALL.witnessSpot;
  const extra = cond ? { if: cond } : {};
  const up: StageCue[] = who.map((w, i) => ({ do: 'walk', actor: `npc:${w.npc}`, to: at(spot.x - i, spot.y), facing: 'left', async: i < who.length - 1 }));
  const back: StageCue[] = who.map((w) => ({ do: 'walk', actor: `npc:${w.npc}`, to: at(w.home.x, w.home.y), facing: 'up', async: true }));
  return [
    act([...up, { do: 'look', actor: `npc:${who[0]!.npc}` }], said[0]!.speaker ?? '', said[0]!.text, said[0]!.mood ? { ...extra, mood: said[0]!.mood } : extra),
    ...said.slice(1).map((l) => ({ ...l, ...extra })),
    act([...back, { do: 'look', actor: 'npc:rael_hearing' }], R, answer, extra),
  ];
}

const [B_TREASURER, B_DAUGHTER, B_AMANDA, B_LAMP, B_PRINTER, B_BENNY, , B_ANICETTE] = BENCH_SPOTS as [P, P, P, P, P, P, P, P];

const HEARING: DialogueScript = script('hearing', {
  start: {
    lines: [
      act(
        [{ do: 'place', actor: 'follower', at: at(HALL.anissaChair.x, HALL.anissaChair.y), facing: 'right' }, { do: 'look', actor: 'npc:rael_hearing' }, { do: 'wait', ms: 900 }],
        '',
        'The Hall at noon. The chairs filled as the Claim left them. Rael kneels below the dais, the signet on the step.',
      ),
      act([{ do: 'look', actor: 'player' }], G, 'I will sit on it when it is a council\'s chair and not a prize.'),
      act([{ do: 'walk', actor: 'npc:chamberlain_hearing', to: at(24, 7), facing: 'left' }], CH, 'The Hall hears Lord Rael Rodriguez of Ardencia, who has surrendered himself to the Throne.'),
      say(CH, 'A Hearing is not a trial. Witnesses speak. The accused answers each. The Throne decides.'),
    ],
    next: 'treasurer',
  },
  // The family of the treasurer he held without trial: the hardest testimony first (the outline 9.6).
  treasurer: {
    lines: witness(
      [
        { npc: 'treasurer_hearing', home: B_TREASURER },
        { npc: 'daughter_hearing', home: B_DAUGHTER },
      ],
      [
        say(TD, 'I stood at his gate for eleven years. I would like it written that I asked, every month.'),
        say(TR, 'He held me eleven years because I would have told the elders he was skimming them. He was right that I would have.'),
        say(TR, 'I was not tried. Try him.'),
      ],
      'He is right. I held him for my reasons, and none of them were his.',
    ),
    next: 'amanda',
  },
  // The Ardencian rebels he fed and armed (Amanda knew whose money it was: the second review's 3.8).
  amanda: {
    lines: [
      ...witness(
        [{ npc: 'amanda_hearing', home: B_AMANDA }],
        [say(AM, 'I baked for twenty years on his money. I knew whose. I said "the pot".', { mood: 'fierce' }), say(AM, 'Write that he paid for the flour and I paid for the nights.', { mood: 'fierce' })],
        'Write it. She paid more.',
      ),
    ],
    next: 'cells',
  },
  // The underground cells he funded.
  cells: {
    lines: [
      ...witness(
        [{ npc: 'lamp_oil_hearing', home: B_LAMP }],
        [say(LO, 'I never met him. I am meeting him now.'), say(LO, 'I would like my oil\'s price in his own hand, so my children know whose it was.')],
        'You will have it in my hand, and the price with it.',
      ),
      ...witness([{ npc: 'printer_hearing', home: B_PRINTER }], [say(PR, 'The purge list came to us with a thumb on it. Warn them first, it said. We did.')], 'Then the cells did the one thing I meant them for.'),
    ],
    next: 'benny',
  },
  // Old Benny: the oath and the goal (the second review's 3.7 and 3.8).
  benny: {
    lines: [
      ...witness(
        [{ npc: 'benny_hearing', home: B_BENNY }],
        [say(BO, 'I kept an oath and it cost Brasador everything. He kept a goal and it cost him his name.'), say(BO, 'Ask him which he would do again.')],
        'Yours. I would keep yours, and do the work of mine.',
      ),
      ...witness([{ npc: 'anicette_hearing', home: B_ANICETTE }], [say(AN, 'Four accounts of the Ash Wars. The Crown\'s was the lie. I read all four. So did she.')], 'Then the Hall has the true one, and not from me.', has('clue.four_accounts')),
    ],
    next: 'elodie',
  },
  elodie: {
    lines: [
      ...witness(
        [{ npc: 'elodie_hearing', home: HALL.behind.zetwal }],
        [say(E, 'I married him. I knew what he was doing. I did not agree with the testing, and I said so, and I stayed.'), say(E, 'Write all three.')],
        'Write all three.',
      ),
      act([{ do: 'walk', actor: 'npc:azzy_hall', to: at(HALL.witnessSpot.x, HALL.witnessSpot.y), facing: 'left' }, { do: 'look', actor: 'npc:azzy_hall' }], Z, 'He fought beside me on a pier. I did not ask him to. Write that too.', { if: all(TRUST, not('claim.azzy_challenged')) }),
      act([{ do: 'walk', actor: 'npc:azzy_hall', to: at(HALL.witnessSpot.x, HALL.witnessSpot.y), facing: 'left' }, { do: 'look', actor: 'npc:azzy_hall' }], Z, 'I disobeyed him. I\'d do it again. I am still angry. Write that.', { if: any(STRIKE, has('claim.azzy_challenged')) }),
      act([{ do: 'look', actor: 'npc:rael_hearing' }, { do: 'wait', ms: 900 }], '', 'Rael does not turn round.'),
      act([{ do: 'walk', actor: 'npc:azzy_hall', to: at(HALL.behind.ardencia.x, HALL.behind.ardencia.y), facing: 'up' }], '', 'Azzy goes back to Ardencia\'s chair.'),
    ],
    next: 'confession',
  },
  // The second reveal (STORY 6.3): the Quiet Crown, in public, to the gallery where its follower sits.
  confession: {
    lines: [
      act([{ do: 'look', actor: 'npc:chamberlain_hearing' }], CH, 'Is there anything the accused would say unasked?'),
      act([{ do: 'face', actor: 'npc:rael_hearing', facing: 'right' }, { do: 'look', actor: 'npc:rael_hearing' }], R, 'I founded the Quiet Crown. Long ago, as a way for frightened people to be useful. None of you knew.', { mood: 'lamplight' }),
      say(R, 'That was the design, and the design let the Regent\'s almoner turn your cells against a child.', { mood: 'lamplight' }),
      say(R, 'I dissolve its chain of command here, in front of you, which is the only place it could be dissolved.', { mood: 'lamplight' }),
      say(R, 'What you are now is what you do.'),
      act([{ do: 'look', actor: 'npc:follower_gallery' }], QF, 'Then we will listen to ourselves.', { if: has('debate.seat_claim.mediated') }),
      act([{ do: 'look', actor: 'npc:follower_gallery' }], QF, 'You made us. Say what we are now.', { if: not('debate.seat_claim.mediated') }),
      { if: not('debate.seat_claim.mediated'), speaker: R, text: 'What you do.' },
      act([{ do: 'look', actor: 'npc:hearing_clerk' }], '', 'The Crown\'s clerk writes it down. All of it.'),
      act([{ do: 'look', actor: 'npc:rahel_gallery' }], RA, 'Five children, three countries. He is the only one who never wrote.'),
      act(
        [{ do: 'face', actor: 'npc:patricio_gallery', facing: 'left' }, { do: 'face', actor: 'npc:rael_hearing', facing: 'right' }, { do: 'look', actor: 'npc:patricio_gallery' }, { do: 'wait', ms: 1200 }],
        '',
        'Across the Hall, old Patricio and Rael look at each other. Neither says anything.',
      ),
    ],
    next: 'question',
  },
  // The question (the guide's line), and "Never." from the other parent (the second review's 3.10).
  question: {
    lines: [
      act([{ do: 'face', actor: 'npc:rael_hearing', facing: 'up' }, { do: 'look', actor: 'npc:rael_hearing' }], R, 'I never asked the eggs how they felt. I am asking now.'),
      act([{ do: 'face', actor: 'npc:rael_hearing', facing: 'left' }, { do: 'wait', ms: 700 }], CH, 'Does the child speak?'),
      act([{ do: 'look', actor: 'follower' }], A, 'Scared. They were scared of me, so I was scared of me.'),
      say(A, 'Gigi says never. I\'d like you to say it too.'),
      act([{ do: 'look', actor: 'npc:rael_hearing' }], R, 'Never.'),
      act([{ do: 'wait', ms: 1400 }, { do: 'face', actor: 'npc:rael_hearing', facing: 'up' }], '', 'He kneels again.', { set: { 'story.hearing_heard': true } }),
    ],
  },
});

/** The verdict (the chapter's second choice for the player; a confirm on Exile and Execution, a save before it: 3.14). */
const VERDICT: DialogueScript = script('chamberlain_hearing_talk', {
  start: {
    lines: [],
    next: [{ if: has('hearing.verdict'), to: 'done' }, { if: not('story.hearing_heard'), to: 'wait' }, { to: 'decide' }],
  },
  wait: { lines: [say(CH, 'The Hall has not finished hearing, envoy.')] },
  done: { lines: [say(CH, 'The Throne has decided. The register says so.')] },
  decide: {
    lines: [act([{ do: 'look', actor: 'npc:rael_hearing' }], CH, 'The Throne decides.')],
    choices: [
      { text: 'Pardon, with conditions.', set: { 'hearing.pardon': true }, next: 'pardon' },
      { text: 'Exile.', next: 'exile_sure' },
      { text: 'Execution.', next: 'execution_sure' },
    ],
  },
  exile_sure: {
    lines: [say(CH, 'The Throne decides once. Exile?')],
    choices: [{ text: 'Exile.', set: { 'hearing.exile': true }, next: 'exile' }, { text: 'Not yet.', next: 'decide' }],
  },
  execution_sure: {
    lines: [say(CH, 'The Throne decides once. Execution?')],
    choices: [{ text: 'Execution.', set: { 'hearing.execution': true }, next: 'execution' }, { text: 'Not yet.', next: 'decide' }],
  },
  pardon: {
    lines: [
      say(CH, 'Lord Rael Rodriguez serves the Throne as Warden of Oaths, in the light.'),
      say(CH, 'The Ash Ledger becomes the Throne\'s Office of Oaths, to find and fight oppression, and for nothing else.'),
      say(CH, 'The Quiet Crown\'s chain of command is dissolved. It was, in front of this Hall.'),
      act([{ do: 'face', actor: 'npc:treasurer_hearing', facing: 'up' }, { do: 'look', actor: 'npc:treasurer_hearing' }], CH, 'Every other captive is freed.'),
      say(CH, 'Restitution to the treasurer\'s family, from the elders\' ledgers.'),
      act([{ do: 'look', actor: 'npc:zelia_gallery' }], ZE, 'The keep has their ledgers. I kept them.'),
      say(CH, 'And the corrupt elders of Ardencia answer before this Hall.'),
      act([{ do: 'look', actor: 'npc:rael_hearing' }], R, 'I accept every one. Write that I asked for none of them.'),
      act([{ do: 'face', actor: 'npc:rael_hearing', facing: 'up' }, { do: 'walk', actor: 'npc:jordyn_hearing', to: at(HALL.jordynBehind.x, HALL.jordynBehind.y + 1), facing: 'up' }], '', 'He stands. Jordyn steps back. He does not put the signet on.'),
    ],
    next: 'refusal',
  },
  // Benny lays Benny's Refusal before his son (the decisions after the second review): the oath and the goal on one table.
  refusal: {
    lines: [
      { if: has('item.bennys_refusal'), speaker: '', text: 'Gianna gives old Benny the copy of his refusal she has carried since Ardencia.' },
      { if: not('item.bennys_refusal'), speaker: '', text: 'Old Benny takes a folded page out of his coat: the refusal he wrote fifty years ago.' },
      act(
        [{ do: 'walk', actor: 'npc:benny_hearing', to: at(HALL.clerkTable.x - 1, HALL.clerkTable.y + 1), facing: 'up' }, { do: 'wait', ms: 800 }],
        '',
        'He walks to the clerk\'s table and lays it in front of his son, and says nothing.',
        { set: { 'story.refusal_laid': true } },
      ),
      act([{ do: 'sync' }, { do: 'walk', actor: 'npc:benny_hearing', to: at(B_BENNY.x, B_BENNY.y), facing: 'up' }, { do: 'look', actor: 'npc:rael_hearing' }, { do: 'wait', ms: 1400 }], '', 'Rael looks at it for a long moment.'),
    ],
    next: 'signet',
  },
  signet: {
    lines: [
      act([{ do: 'look', actor: 'player' }], '', 'Gianna picks the signet up off the step, and holds it beside the Locket.'),
      nar('Both halves glow.', { fx: 'token' }),
      act([{ do: 'look', actor: 'follower' }], A, 'It\'s the same light, Gigi.'),
      act([{ do: 'look', actor: 'npc:rael_hearing' }], '', 'Gianna puts the signet in his hand. Not on it. In his hand.', { set: { 'story.signet_returned': true } }),
      act([{ do: 'sync' }], '', 'That afternoon.', { fx: 'fade', set: { 'hearing.verdict': true, 'travel.next': 'seat-hall/afternoon' } }),
    ],
  },
  exile: {
    lines: [
      say(CH, 'Lord Rael leaves the realm by sea, from Ardencia\'s strand, before the new moon, and does not return.'),
      say(CH, 'Ardencia\'s chair passes to its elders\' account. The Ash Ledger is not the Throne\'s.'),
      say(CH, 'The Throne does not know where it goes.'),
      act([{ do: 'look', actor: 'npc:rael_hearing' }], R, 'It goes dark. I built it to. That is the part you should have asked about.'),
      act(
        [
          { do: 'exit', actor: 'npc:rael_hearing', to: at(HALL.door.x, HALL.door.y), async: true },
          { do: 'exit', actor: 'npc:rivera_hearing', to: at(HALL.door.x, HALL.door.y), async: true },
          { do: 'exit', actor: 'npc:jaime_hearing', to: at(HALL.door.x, HALL.door.y), async: true },
          { do: 'face', actor: 'npc:elodie_hearing', facing: 'down' },
          { do: 'wait', ms: 2400 },
        ],
        '',
        'He walks out the way he came, Rivera and Jaime behind him. Benny does not stand.',
        { set: { 'story.rael_exiled': true } },
      ),
      nar('Mother watches him all the way to the doors. Azzy does not turn.'),
      act([{ do: 'sync' }], '', 'That afternoon.', { fx: 'fade', set: { 'hearing.verdict': true, 'travel.next': 'seat-hall/afternoon' } }),
    ],
  },
  // The Iron Throne's verdict, shown by who leaves (the outline 14.1; the review's 3.10: Benny sits on the step, no count).
  execution: {
    lines: [
      say(CH, 'Lord Rael Rodriguez is to die by the Throne\'s order, today, for what this Hall has heard.'),
      act([{ do: 'look', actor: 'npc:rael_hearing' }], R, 'Then I was right about one thing. A dead man cannot answer for himself. You will have to.'),
      act(
        [
          { do: 'enter', actor: 'seal_x1', look: 'sealbearer', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.rael.x - 1, HALL.rael.y), facing: 'right', async: true },
          { do: 'enter', actor: 'seal_x2', look: 'sealbearer_b', from: at(HALL.stair.x, HALL.stair.y), to: at(HALL.rael.x + 1, HALL.rael.y), facing: 'left' },
          { do: 'exit', actor: 'npc:rael_hearing', to: at(HALL.stair.x, HALL.stair.y), async: true },
          { do: 'exit', actor: 'seal_x1', to: at(HALL.stair.x, HALL.stair.y), async: true },
          { do: 'exit', actor: 'seal_x2', to: at(HALL.stair.x, HALL.stair.y), async: true },
          { do: 'exit', actor: 'npc:jordyn_hearing', to: at(HALL.stair.x, HALL.stair.y) },
        ],
        '',
        'Jordyn\'s watch and two Sealbearers walk him to the heralds\' stair, and up it. Nothing on the stair after that.',
        { set: { 'story.rael_taken': true } },
      ),
      act([{ do: 'exit', actor: 'npc:elodie_hearing', to: at(HALL.elodieDoor.x, HALL.elodieDoor.y) }], '', 'Mother stands, and leaves the Hall by Zetwal\'s door before the bell.'),
      nar('Somewhere above the Hall, a bell. Once.', { fx: 'hall_bell' }),
      act([{ do: 'walk', actor: 'follower', to: at(HALL.behind.zetwal.x, HALL.behind.zetwal.y), facing: 'down' }], '', 'Anissa does not look at her sister. She walks to the empty Zetwal chair, and stands at it with her back to the dais.'),
      act([{ do: 'walk', actor: 'npc:benny_hearing', to: at(HALL.foot.x, HALL.foot.y - 1), facing: 'down' }], '', 'Old Benny sits down on the step where the signet was, and says nothing.'),
      act([{ do: 'exit', actor: 'npc:yari_hall', to: at(HALL.door.x, HALL.door.y) }], '', 'Yari stands up from the eighth chair, and walks out of the Hall.'),
      act([{ do: 'sync' }], '', 'That afternoon.', { fx: 'fade', set: { 'hearing.verdict': true, 'travel.next': 'seat-hall/afternoon' } }),
    ],
  },
});

// ---- The three endings (staged on the Hall that afternoon; then the cards, The End, the cast, the credits) --------------------

const FINISH = (end: 'just' | 'hollow' | 'iron') => ({
  'act12.complete': true,
  [`end.${end}`]: true,
  'end.done': true,
  'story.ending_seen': true,
  'story.hall_seated': false,
});

const KEPT = (house: string): Condition => sits(house)!;

const ENDING: DialogueScript = script('ending', {
  start: {
    lines: [],
    next: [{ if: has('ending.iron'), to: 'iron' }, { if: has('ending.just'), to: 'just' }, { to: 'hollow' }],
  },
  just: {
    lines: [
      act(
        [
          ...['elodie_after', 'yari_hall', 'azzy_hall', 'rosalind_hall', 'edmund_hall', 'samira_hall'].map((n): StageCue => ({ do: 'face', actor: `npc:${n}`, facing: 'up' })),
          { do: 'look', actor: 'player' },
          { do: 'wait', ms: 900 },
        ],
        '',
        'The Hall in the afternoon. Gianna sits on the stone chair on the sun tile, and the chairs\' people turn to face it.',
      ),
      act([{ do: 'look', actor: 'npc:chamberlain_after' }], CH, 'The Council of Eight sits. She speaks for it while it lets her.'),
      act([{ do: 'look', actor: 'npc:yari_hall' }], Y, 'Cacica Yari of Xaraguá sits for a harbor that stays with the people who fish it.'),
      { if: has('choice.yari_sure'), speaker: Y, text: 'You said "of course", in Pòdlimyè. You meant it.' },
      { if: has('choice.yari_everything'), speaker: Y, text: 'You said "tell me everything". I have.' },
      act([{ do: 'look', actor: 'npc:azzy_hall' }], Z, 'Marshal of the realm. I\'ll hold you to it.'),
      act([{ do: 'look', actor: 'npc:elodie_after' }], E, 'Chief Envoy. Zetwal\'s envoy, still. I will keep both.'),
      act([{ do: 'look', actor: 'npc:rael_table' }], R, 'Warden of Oaths. The first oath on the ledger is the seventh clause.'),
      act([{ do: 'walk', actor: 'npc:hollis_after', to: at(HALL.clerkTable.x, HALL.clerkTable.y + 1), facing: 'up' }], '', 'Hollis sets Xaraguá\'s petition on the clerk\'s table in front of him.'),
      act([{ do: 'walk', actor: 'npc:elodie_after', to: at(HALL.rael.x, HALL.rael.y + 1), facing: 'up' }, { do: 'face', actor: 'npc:rael_table', facing: 'down' }, { do: 'wait', ms: 1000 }], '', 'Mother walks from Zetwal\'s chair to the clerk\'s table, and stands beside him.'),
      act([{ do: 'walk', actor: 'npc:azzy_hall', to: at(HALL.rael.x - 1, HALL.rael.y), facing: 'right' }], '', 'Azzy holds out the boarding axe from the pier, haft first. His father takes it.', { if: TRUST }),
      act([{ do: 'walk', actor: 'npc:azzy_hall', to: at(HALL.rael.x - 1, HALL.rael.y), facing: 'right' }], '', 'Azzy walks over to the clerk\'s table, and stands in front of his father.', { if: STRIKE }),
      say(R, 'Marshal.'),
      say(Z, 'Warden.'),
      act([{ do: 'look', actor: 'npc:rosalind_hall' }], RO, 'Aldermoor sits. The Crown keeps no almoner. It keeps an oath now.'),
      { if: KEPT('al_doria'), speaker: LA, text: LAYLA.councilSits },
      { if: KEPT('skarragol'), speaker: BY, text: 'Skarragol sits, for the Ironvow and the herds.' },
      { if: KEPT('kuroshi'), speaker: H, text: 'Kuroshi sits. Mother will burn the old files herself.' },
      { if: KEPT('jwaladesh'), speaker: V, text: 'Jwaladesh sits. The flame is up.' },
      { if: any(...TOKEN_CHAIRS.map((c) => has(`seat.bare.${c.house}`))), speaker: CH, text: 'One chair waits. The Hall is patient.' },
    ],
    next: 'doors',
  },
  doors: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(HALL.doorsInside.x, HALL.doorsInside.y), facing: 'down' }, { do: 'wait', ms: 600 }], '', 'Anissa walks down the nave to the Hall\'s doors, and opens them on the Concourse.'),
      act(
        [
          { do: 'enter', actor: 'g1', look: 'pilgrim', from: at(HALL.door.x, HALL.door.y), to: at(26, 14), facing: 'up', async: true },
          { do: 'enter', actor: 'g2', look: 'qc_follower', from: at(HALL.door.x, HALL.door.y), to: at(27, 14), facing: 'up', async: true },
          { do: 'enter', actor: 'g3', look: 'aldoria_trader', from: at(HALL.door.x, HALL.door.y), to: at(28, 14), facing: 'up', async: true },
          { do: 'enter', actor: 'g4', look: 'joaquin_free', from: at(HALL.door.x, HALL.door.y), to: at(29, 14), facing: 'up', async: true },
          { do: 'enter', actor: 'g5', look: 'horn_rider', from: at(HALL.door.x, HALL.door.y), to: at(30, 14), facing: 'up' },
        ],
        '',
        'The Concourse comes in to the gallery: pilgrims, the market, the companies\' captains, a woman who fed pilgrims.',
      ),
      act([{ do: 'look', actor: 'follower' }], A, 'I\'ll hold the door, Gigi.', { set: FINISH('just') }),
    ],
  },
  hollow: {
    lines: [
      act([{ do: 'look', actor: 'player' }, { do: 'wait', ms: 900 }], '', 'The Hall in the afternoon. Gianna sits on the stone chair on the sun tile. The chairs are half turned.'),
      act([{ do: 'exit', actor: 'npc:rosalind_hall', to: at(41, 11) }], '', 'Lady Rosalind gets up, and walks out by Aldermoor\'s door.'),
      act([{ do: 'exit', actor: 'npc:layla_hall', to: at(HALL.laylaDoor.x, HALL.laylaDoor.y) }], '', 'Al-Doria\'s envoy follows her out by Al-Doria\'s.', { if: KEPT('al_doria') }),
      { if: has('hearing.pardon'), speaker: '', text: 'Rael sits at the clerk\'s table, with nothing in front of him.' },
      { if: has('hearing.exile'), speaker: '', text: 'Where Rael knelt, the floor is bare.' },
      act([{ do: 'look', actor: 'npc:elodie_after' }], E, 'Keep working.'),
      act([{ do: 'walk', actor: 'follower', to: at(HALL.doorsInside.x, HALL.doorsInside.y), facing: 'up' }, { do: 'look', actor: 'follower' }], A, 'I\'ll hold the door a while longer, Gigi.', { set: FINISH('hollow') }),
    ],
  },
  iron: {
    lines: [
      act([{ do: 'look', actor: 'player' }, { do: 'wait', ms: 900 }], '', 'The Hall in the afternoon. Nearly empty.'),
      act([{ do: 'look', actor: 'npc:rope_sealbearer_a' }], '', 'The Regent\'s two Sealbearers stand at the rope\'s posts again. They serve whoever sits.'),
      nar('Yari\'s chair is empty. So is Mother\'s.'),
      act([{ do: 'place', actor: 'follower', at: at(HALL.behind.zetwal.x, HALL.behind.zetwal.y), facing: 'down' }, { do: 'look', actor: 'follower' }], '', 'Anissa stands at Zetwal\'s chair, her back to the dais.'),
      act([{ do: 'look', actor: 'npc:azzy_hall' }], Z, 'I\'ll hold you to it. Every day. That was the promise.'),
      act([{ do: 'look', actor: 'npc:benny_iron' }], '', 'Old Benny is at the doors, counting nobody.'),
      act([{ do: 'look', actor: 'player' }, { do: 'wait', ms: 1200 }], A, 'Gigi. The lamp\'s gone out.', { set: FINISH('iron') }),
    ],
  },
});

/** The people of the Hearing and the afternoon (one line each; nothing here is a joke). */
const HEARING_PEOPLE: DialogueScript[] = [
  simple('rael_hearing_talk', [say(R, 'Make it, envoy.')]),
  simple('jordyn_hearing_talk', [say(JO, 'The one set of words. I am still waiting to see which.')]),
  simple('rivera_hearing_talk', [say(RV, 'The Lord asked us to carry nothing. We carried nothing.')]),
  simple('jaime_hearing_talk', [nar('Jaime stands with his hands empty, and watches the Hall.')]),
  simple('hollis_hearing_talk', [say(HO, 'The Hall keeps the record. I am the Hall\'s, today.')]),
  simple('treasurer_hearing_talk', [say(TR, 'Eleven years. I will say it once, in there. Once is enough.')]),
  simple('daughter_hearing_talk', [say(TD, 'Alive. I keep saying it. It does not wear out.')]),
  simple('amanda_hearing_talk', [say(AM, 'I will say it to his face. That is the only way I know how to say anything.', { mood: 'fierce' })]),
  simple('lamp_oil_hearing_talk', [say(LO, 'The price in his own hand. That is all I came for.')]),
  simple('printer_hearing_talk', [say(PR, 'Every word, for the press.')]),
  simple('benny_hearing_talk', [say(BO, 'A witness goes where the Hearing is.')]),
  simple('nancy_hearing_talk', [nar('Nancy sits on the witnesses\' side with her hands in her lap, and says nothing.')]),
  simple('anicette_hearing_talk', [say(AN, 'Four accounts. One of them is mine. I will say which was the lie.')]),
  simple('elodie_hearing_talk', [say(E, 'I will be asked. I will answer.')]),
  simple('follower_gallery_talk', [say(QF, 'He is going to say it. I want to hear him say it.')]),
  simple('rahel_gallery_talk', [say(RA, 'I came to see it. I am seeing it.')]),
  simple('patricia_gallery_talk', [say(PA, 'Eight chairs. I counted.')]),
  simple('patricio_gallery_talk', [nar('Grandfather sits in the gallery on his cane, and watches Rael. He says nothing.')]),
  simple('sebastian_gallery_talk', [say(SB, 'I play in this Hall on feast days. Today I am listening.', { mood: 'listening' })]),
  simple('zelia_gallery_talk', [say(ZE, 'The keep has the elders\' ledgers. I brought them.')]),
  simple('gallery_pilgrim_talk', [say('pilgrim', 'We walked from Zetwal to see the Throne. Today it is being used.')]),
  simple('camp_leader_gallery_talk', [say('camp_leader', 'Someone stood on it. I came to see what she does next.')]),
  simple('hearing_clerk_talk', [nar('The Crown\'s clerk writes. Every word in the Hall today goes into his book.')]),
  simple('chamberlain_after_talk', [say(CH, 'The chairs are filled. I have dusted them for fifty years. It was worth it.')]),
  simple('hollis_after_talk', [say(HO, 'Xaraguá\'s line in the register has its answers. I read it every morning now.')]),
  script('elodie_after_talk', {
    start: { lines: [], next: [{ if: has('ending.just'), to: 'just' }, { to: 'hollow' }] },
    just: { lines: [say(E, 'Chief Envoy. Zetwal\'s envoy, still. The clerk is writing it down.')] },
    hollow: { lines: [say(E, 'Keep working.')] },
  }),
  script('rael_table_talk', {
    start: { lines: [], next: [{ if: has('ending.just'), to: 'just' }, { to: 'hollow' }] },
    just: { lines: [say(R, 'The Office of Oaths is open. The first page is the seventh clause.')] },
    hollow: { lines: [say(R, 'Warden of Oaths. Nobody has brought me an oath yet.')] },
  }),
  simple('benny_iron_talk', [nar('Old Benny is at the doors. He is not counting anything.')]),
  simple('yari_hall_talk', [say(Y, 'The eighth chair. I can sit in it. I am getting used to that.')]),
  simple('azzy_hall_talk', [say(Z, 'I\'ll hold you to it.')]),
  simple('samira_hall_talk', [say(S, 'I am standing with the party. The guild can sit without me.', { mood: 'earnest' })]),
  simple('bayarmaa_hall_talk', [say(BY, 'Skarragol\'s chair. The braid is on it.')]),
  simple('haru_hall_talk', [say(H, 'I am listening. Somebody in this Hall should be.')]),
  simple('vikram_hall_talk', [say(V, 'I am standing still. On purpose. In a Hall. Do not tell Aiyana.')]),
  simple('edmund_hall_talk', [say(ED, 'Mother is sitting. I am standing. It is the arrangement.')]),
  simple('rosalind_hall_talk', [say(RO, 'Aldermoor sits. I said I could.')]),
  simple('layla_hall_talk', [say(LA, LAYLA.hallTalk)]),
];

// ---- The Concourse's people in Chapter 12 (overlays on the built Chapter 5 conversations) ------------------------------------

const CH12: Condition = has('act11.complete');
const one = (id: string, speaker: string, text: string, mood?: string): MusterOverlay => ({ id, nodes: { m_start: { lines: [say(speaker, text, mood ? { mood } : {})] } }, when: CH12 });

// ---- The contract board's dispatch (the outline 7.4: "after the release the board gets the Seat's errands"; Claude's call,
// Oct 27): over the Regent's notice the Hall has pinned a job, the Compact's roll of the eight houses for the company that
// holds the north gate (Joaquin's "Nobody comes in behind you that the Compact doesn't name", now in writing). Optional, from
// the arrival until the Hearing is called; only while Free Brasador stands at its gate. +1 Influence in Eightgate.

const UNTIL_HEARING: Condition = all(CH12, not('story.hearing_called'));

const BOARD: MusterOverlay = {
  id: 'seat_contract_board',
  nodes: {
    m_start: {
      lines: [],
      next: [
        { if: has('claim.dispatch_done'), to: 'm_done' },
        { if: has('claim.dispatch_carried'), to: 'm_carrying' },
        { if: has('army.free_brasador'), to: 'm_offer' },
        { to: '__base' },
      ],
    },
    m_offer: {
      lines: [
        nar('The contract board. Over the Regent\'s violet notice, a new paper in the Hall\'s own hand:'),
        nar('"Wanted: a runner to carry the Compact\'s roll of the eight houses to the company at the north gate. By hand."'),
      ],
      choices: [
        { text: 'Take the roll.', set: { 'claim.dispatch_carried': true }, next: 'm_taken' },
        { text: 'Leave it.' },
      ],
    },
    m_taken: { lines: [nar('(The contract board\'s job: the roll to Tío Joaquin, at the Ardencia Gate.)')] },
    m_carrying: { lines: [nar('The roll is for the north gate. Tío Joaquin holds it with Free Brasador.')] },
    m_done: { lines: [nar('The contract board. The Hall\'s paper is gone. The Regent\'s notice is still pinned over the rest.')] },
  },
  when: UNTIL_HEARING,
};

const ROLL_AT_GATE: MusterOverlay = {
  id: 'gate_free_brasador_talk',
  nodes: {
    m_start: {
      lines: [
        act([{ do: 'face', actor: 'npc:gate_free_brasador_captain', facing: 'player' }], 'joaquin_muster', 'A paper from the Hall? For me?'),
        nar('Tío Joaquin unrolls it at the gate and reads it slowly, one house at a time, his finger on each name.'),
        say('joaquin_muster', 'Eight houses. Every one named. Nobody comes in behind you that this doesn\'t name. Now I have it in writing.', {
          set: { 'claim.dispatch_done': true },
        }),
        nar('(The contract board\'s job: done. +1 Influence in Eightgate.)'),
      ],
    },
  },
  when: all(has('claim.dispatch_carried'), not('claim.dispatch_done')),
};

/** Chapter 12's lines over the built people of Eightgate (each plays while Chapter 12 is on). */
export const CLAIM_OVERLAYS: readonly MusterOverlay[] = [
  BOARD,
  ROLL_AT_GATE,
  one('seat_market_talk', 'seat_market', 'Seven armies at the gates, and every one of them wants bread. Something from every capital, at Claim prices.'),
  one('seat_outfitter_talk', 'seat_outfitter', 'Madam. The Hall is cold at the bell, Claim or no Claim. I have nothing new; the old is warm.'),
  one('embassy_porter_talk', 'embassy_porter', 'Embassy of Al-Doria. The envoy is at the Hall. For once, so is everyone else.'),
  one('seat_gate_clerk_talk', 'seat_gate_clerk', 'Gate of Gold. Everyone in, nothing out, until the Claim is heard. By nobody\'s order. It is just how it is.'),
  one('hall_herald_talk', 'herald', 'The Hall of the Throne. Today it speaks when the claimant speaks.', 'impassive'),
  one('pilgrim_thanks_talk', 'pilgrim_bandaged', 'We came back for the Claim. The escort insisted.'),
  one('pilgrim_escort_talk', 'pilgrim_bandaged', 'We came back for the Claim. The escort insisted.'),
  one('deserter_escort_talk', 'deserter', 'A post is a post. This one is at a Claim.'),
  one('sealbearer_talk', 'sealbearer', 'The Seat is open to every house today, I am told. I am still standing here.'),
  {
    id: 'chair_xaragua',
    nodes: {
      m_start: { lines: [], next: [{ if: has('story.chairs_set'), to: 'm_turn' }, { to: '__base' }] },
      m_turn: { lines: [nar('Yari turns the eighth chair round. Plain oak. Nothing is cut into it.'), say(Y, 'Fifty years. Nobody so much as scratched it.')] },
    },
    when: CH12,
  },
  {
    id: 'drawer_four',
    nodes: { m_start: { lines: [nar('Drawer 4. Empty now. The clause is in the Hall, and so is what was filed with it.')] } },
    when: has('clue.petition_original'),
  },
];

/** Every Chapter 12 and Epilogue conversation of its own (the overlays are applied over the built ones in data/dialogue.ts). */
export const CLAIM_DIALOGUE: readonly DialogueScript[] = [
  ARRIVE,
  ELODIE_ARCH,
  GATE_XARAGUA_OPEN,
  ARCH_CLERK,
  ROOMS_SCENE,
  ELODIE_ROOMS,
  ROOMS_SHELF,
  ROOMS_LAMP,
  ROOMS_WINDOW,
  ROOMS_CLERK,
  COCO_NOTE,
  CROWN_WING_CLOSED,
  HALL_SHUT,
  CHAMBERLAIN_NIGHT,
  STEPS_SEALBEARER,
  CLAIM_JORDYN,
  ...GATE_TALKS,
  BELL_HALL,
  CHAIR_ECHO,
  ECHO_PLAN,
  ECHO_CHAIR_CLUSTER,
  ECHO_CHAIR_XARAGUA,
  ...ECHO_PEOPLE,
  CHAIR_RETURN,
  CHAIR_XARAGUA_CUT,
  CHAMBERLAIN_CLAIM,
  CLAIM_DECLARE,
  REGENT_CLAIM,
  CLAIM_AFTER_REGENT,
  CLAIM_AFTER_AZZY,
  AZZY_CHALLENGE,
  HALL_CLAIM_CLOSED,
  ...CLAIM_PEOPLE,
  REGISTER,
  ARRIVALS,
  HEARING,
  VERDICT,
  ENDING,
  ...HEARING_PEOPLE,
];

/** The scripts that are the Hall, the Claim, the Hearing and the endings (no joke in any of them: tests/claim.test.ts). */
export const SOLEMN_SCRIPTS: readonly string[] = [
  'rooms_scene',
  'bell_hall',
  'chair_echo',
  'chair_echo_return',
  'chamberlain_claim_talk',
  'claim_declare',
  'claim_after_regent',
  'claim_after_azzy',
  'hearing',
  'chamberlain_hearing_talk',
  'ending',
];
