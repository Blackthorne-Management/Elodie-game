// Chapter 6, The Stolen Standard (Ordvik, Skarragol; the first road): docs/quest/reviews/2026-10-21-chapter6-outline.md
// with its second review's fixes. The maps are tools/maps/skarragol.ts; every tile in a stage direction comes from
// data/skarragol.ts or is written next to the map it belongs to.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched by a foe, never a target
// and never jokes; Salkhi (the fair's comic voice) never speaks in a scene with Anissa's lines in it and never about her
// (tests/skarragol.test.ts checks it); no jokes in Sarnai's raid or at the price; the Crown's hand stays the Regent's
// (no line joins the Crown to the girl who glows); Torvald is clean and Hrafn is the sale's voice.
//
// The present is the edge of the freeze (the review's 3.4): open water and the first floes. Fifty years ago the fjord
// was ice edge to edge; Sarnai's raid crossed it and won, and the spring ice took half her riders on the way home.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { FAIR, FJORD, HORN_DAY_DONE, MOOT, PLATEAU } from '../skarragol.ts';
import { OPINION_BRANCHES, OPINION_NODES, SADDLE_BRANCHES, SADDLE_NODES } from './skarragolQuests.ts';

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
const SK = 'salkhi';
const TV = 'torvald';
const LS = 'lawspeaker';
const HR = 'hrafn';
const JR = 'trading_jarl';
const HE = 'hostage_envoy';
const GV = 'grimvald';
const SA = 'sarnai';
const OE = 'ordu_envoy';

/** What Bayarmaa still waits for before the fjord, worded from the flags (the path, and her own talk). */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.grandson.done' }, speaker: BY, text: 'The white coat is still in the field.' },
  { if: { notFlag: 'side.winter_stores.done' }, speaker: BY, text: 'The herders are still counting sacks.' },
  { if: { notFlag: 'debate.skarragol_oath.settled' }, speaker: BY, text: 'The traders are still shouting.' },
];

/** Dusk at the fjord path (beat 3's end): Bayarmaa sets out, and Anissa with her. */
const SET_OUT: DialogueLine[] = [
  nar('Dusk. Fires in the corrals. The fjord path runs down toward black water.', { fx: 'fade' }),
  act(
    [
      { do: 'walk', actor: 'bayarmaa', to: at(FAIR.fjordPath.x + 1, 2), facing: 'up' },
      { do: 'face', actor: 'bayarmaa', facing: 'player' },
      { do: 'look', actor: 'bayarmaa' },
    ],
    BY,
    'The floes drift out with the morning tide. We go now or we go never.',
  ),
  say(BY, 'My grandmother crossed this fjord in the war, in winter, with forty riders and a herd. It was ice then. Floes now.'),
  say(A, 'Gigi. I\'m coming onto the ice.'),
  say(G, 'I know.', { set: { 'story.fjord_set_out': true } }),
];

/** Sarnai's raid (beat 5), shared by the far shore's step trigger and the zone's onEcho (the review's 3.2). */
function raidNodes(): Record<string, DialogueNode> {
  return {
    raid: {
      lines: [
        nar('The far shore, fifty years ago: the Crown\'s supply camp. Wagons of grain, sentries with muskets, smoke.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'npc:echo_horse_1' }], '', 'And at the camp\'s edge, on the ice, a herd of steppe horses grazing where no horse should be.'),
        act(
          [
            { do: 'look', actor: 'npc:sarnai' },
            { do: 'walk', actor: 'npc:sarnai', to: at(FJORD.sarnai.x + 1, FJORD.sarnai.y), facing: 'down' },
            { do: 'face', actor: 'npc:sarnai', facing: 'player' },
          ],
          '',
          'A woman beside a grey horse turns from the herd. A bone whistle hangs on a cord at her throat.',
        ),
        say(SA, 'Zetwal\'s Marshal. You came over the ice on foot. Good. Horses see better than sentries.'),
        nar('Benny is with the horses. Caona went ahead on foot; she always goes ahead on foot.'),
        say(SA, 'Your whistle calls men. Mine calls horses. Three notes: low, high, low.'),
        say(SA, 'The herd walks where the whistle walks. Forty riders walk inside the herd, and the Crown\'s sentries see horses.'),
        act([{ do: 'look', actor: 'npc:echo_horse_2' }], '', 'She whistles: low, high, low. The herd lifts its heads and walks toward the camp.', {
          set: { 'echo.herd_moved': true },
          stage: [{ do: 'look', actor: 'npc:echo_horse_2' }, { do: 'sync' }, { do: 'wait', ms: 1200 }],
        }),
        act([{ do: 'face', actor: 'npc:crown_sentry', facing: 'right' }, { do: 'look', actor: 'npc:crown_sentry' }], '', 'The sentries turn to watch the horses. Not the riders.'),
        act([{ do: 'look', actor: 'npc:sarnai' }], SA, 'Ride when I ride. Burn the wagons, take the grain, touch nobody who drops his musket.'),
      ],
      choices: [
        { text: "And the ones who don't drop it?", set: { 'choice.patricio_raid': 'hard' }, next: 'hard' },
        { text: 'Zetwal is hungry too, Sarnai.', set: { 'choice.patricio_raid': 'share' }, next: 'share' },
      ],
    },
    hard: { lines: [say(SA, 'Then they learn what a horse weighs.')], next: 'ride' },
    share: { lines: [say(SA, 'Then half the grain goes south on your ships. Decide later who was generous.')], next: 'ride' },
    ride: {
      lines: [
        say(SA, 'Tell your daughter\'s daughters: speed is the only thing the Crown cannot buy.', { set: { 'clue.herd_whistle': true } }),
        act(
          [
            { do: 'exit', actor: 'npc:sarnai_mare', to: at(18, 7), run: true, async: true },
            { do: 'exit', actor: 'npc:sarnai', to: at(16, 7), run: true },
          ],
          '',
          'She rides. The herd breaks into a run, and forty riders rise out of it.',
          { fx: 'shake' },
        ),
        nar('A horn. Hoofbeats. The wagons go up one after another, and nobody who drops his musket is touched.', {
          fx: 'shake',
          set: { 'echo.raid_ridden': true },
          stage: [{ do: 'sync' }, { do: 'look', actor: 'player' }],
        }),
        say(P, '(Low, high, low.)'),
      ],
    },
  };
}

export const SKARRAGOL_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0: the winter road -----------------------------------------------------------------------------
  simple('plateau_arrive', [
    nar('East out of the Eight Gates, along the Ironvow road. Then up, and up, onto the Winter Plateau, where the grass goes grey.', { fx: 'fade' }),
    nar('It is not winter yet. Up here it never quite stops being.'),
    say(S, 'Cold is a cost nobody invoices. I intend to be the first.'),
    say(A, 'The horses on the ridge are watching us, Gigi.'),
    say(G, 'Let them.'),
    say(Y, 'The road goes down west to the fair. That smoke is Ordvik.'),
  ]),
  simple('seat_road_back', [nar('The road back to Eightgate. Mother said east. They came east.')]),

  // ---- Beat 1: the Horse-Fair in uproar (no Anissa lines here: Salkhi speaks) ----------------------------------
  simple('fair_arrive', [
    act(
      [{ do: 'look', actor: 'npc:fair_crier' }, { do: 'wait', ms: 500 }],
      '',
      'Ordvik: a horse-fair the size of a city. In the middle of the field, a tall pole with horse-tails on it and nothing at the top.',
    ),
    act([{ do: 'face', actor: 'npc:fair_crier', facing: 'player' }], 'fair_crier', 'The council sits at the morning horn! The fleet, the Crown\'s gold, the thief\'s daughter!'),
    act(
      [
        { do: 'look', actor: 'led' },
        { do: 'enter', actor: 'rider_a', look: 'horn_rider', from: at(44, 15), to: at(22, 11), facing: 'up', async: true },
        { do: 'enter', actor: 'led', look: 'bayarmaa', from: at(44, 16), to: at(23, 11), facing: 'up', async: true },
        { do: 'enter', actor: 'rider_b', look: 'horn_rider', from: at(44, 15), to: at(24, 11), facing: 'up' },
      ],
      '',
      'Two horn-riders lead a young woman across the field toward the Moot Tent, one at each shoulder. Her hands are free.',
    ),
    act(
      [
        { do: 'enter', actor: 'mare', look: 'horse_grey', from: at(44, 16), to: at(FAIR.salkhi.x, FAIR.salkhi.y), facing: 'up' },
        { do: 'look', actor: 'mare' },
      ],
      '',
      'A grey mare follows three steps behind, and stops when they stop.',
    ),
    act(
      [
        { do: 'exit', actor: 'rider_a', to: at(22, 9), async: true },
        { do: 'exit', actor: 'led', to: at(23, 9), async: true },
        { do: 'exit', actor: 'rider_b', to: at(23, 9) },
      ],
      '',
      'The young woman does not look round.',
    ),
    act([{ do: 'face', actor: 'mare', facing: 'player' }], SK, 'They are taking her the long way so everyone can look. I am walking slowly so everyone can look at me.'),
    nar('Nobody remarks on the horse.'),
    act(
      [
        { do: 'look', actor: 'npc:ordu_envoy' },
        { do: 'walk', actor: 'npc:ordu_envoy', to: at(31, 13), facing: 'down' },
      ],
      '',
      'A rider in a white felt coat with a silver mare on it sees Azzy across the field, stops dead, and bows to the ground.',
    ),
    act([{ do: 'walk', actor: 'azzy', to: at(27, 16), facing: 'left' }], '', 'Azzy keeps walking. The envoy stays bowed. Azzy walks faster.'),
    say(Y, 'Azzy. The man is in the mud.'),
    say(Z, 'I did not put him there.', { set: { 'side.grandson.accepted': true } }),
    act([{ do: 'walk', actor: 'npc:ordu_envoy', to: at(FAIR.envoy.x, FAIR.envoy.y), facing: 'down' }, { do: 'look', actor: 'npc:crown_surveyor' }], '', 'Up the quay lane, a man in Aldermoor violet walks a measuring chain.'),
    say(S, 'Eleven hulls up that lane, and a Crown man measuring them. He has done nine. Two more and they are sold.'),
    act([{ do: 'look', actor: 'player' }], G, 'The Moot Tent. Whatever they decide at the horn, it starts in there.', { set: { 'story.fair_seen': true } }),
  ]),
  simple('fair_crier_talk', [say('fair_crier', 'The morning horn! The fleet! The thief\'s daughter! ...I only say what I am paid to, envoy.')]),
  script('pole_fair', {
    start: { lines: [], next: [{ if: { flag: 'story.standard_planted' }, to: 'after' }, { to: 'empty' }] },
    empty: { lines: [nar('The fair\'s standard pole: horse-tails streaming from a crossbar, and nothing at the top. Nine nights empty.')] },
    after: { lines: [nar('The fair\'s pole is still bare. The standard is inside, on its own pole, where the oath is sworn.')] },
  }),
  simple('fair_board', [
    nar('The contract board: "Guard the folds: wolves." "Count the fleet for the trading jarl." "Race at the fair, first snow."'),
    nar('Over the rest, in violet ink: "The Throne\'s compensation office will hear claims at the guest tent until the horn."'),
  ]),
  simple('white_tent', [nar('A white felt tent with a silver mare stitched on the door. Nobody goes in without bowing.')]),
  simple('fair_horse_talk', [nar('A steppe horse for sale. It looks at the party, and at the price chalked on the rail, and seems to agree with neither.')]),
  simple('fair_trader_talk', [say('fair_trader', 'Oaths, oaths. Sky or blood, I still need salt. Talk to the two on the mats.')]),
  simple('crown_surveyor_talk', [
    { if: { notFlag: 'story.standard_planted' }, speaker: 'crown_surveyor', text: 'Nine hulls measured, envoy. Two to go before the horn. The Throne pays by the plank.' },
    { if: { flag: 'story.standard_planted' }, speaker: 'crown_surveyor', text: 'The horn has blown. I am told to measure nothing. I am told to measure the road home.' },
  ]),
  simple('ordvik_food_talk', [say('ordvik_food', 'Sain baina uu? Broth for the cold, jerky for the road.', { translation: 'Hello (are you well?)' })]),
  simple('ordvik_furrier_talk', [say('ordvik_furrier', 'Heill! Fur, felt and a good sabre. The plateau takes the soft ones first.', { translation: 'Hail!' })]),
  // S-1 Salkhi Has Opinions (built Oct 27): the felt for her saddle, before the shop opens.
  script('ordvik_horses_talk', {
    start: { lines: [], next: [...SADDLE_BRANCHES, { to: 'plain' }] },
    plain: { lines: [say('ordvik_horses', 'Bayarlalaa for looking. Tack, rings, and treats the grey mare will tell you about.', { translation: 'Thank you' })] },
    ...SADDLE_NODES,
  }),
  simple('plunder_store_talk', [say('plunder_store', 'Heill. Everything here was raided fair and square, envoy. Ask the raiding jarl.', { translation: 'Hail.' })]),

  // ---- Salkhi: a grey mare placed on the outdoor maps (never in a scene with Anissa's lines) ------------------------
  script('salkhi_fair_talk', {
    start: {
      lines: [],
      next: [
        // S-1 Salkhi Has Opinions (built Oct 27): at dawn, after the price.
        ...OPINION_BRANCHES,
        { if: { flag: 'story.standard_planted' }, to: 'after' },
        { if: { flag: 'story.standard_home' }, to: 'dawn' },
        { if: { flag: 'party.bayarmaa' }, to: 'joined' },
        { to: 'waiting' },
      ],
    },
    ...OPINION_NODES,
    waiting: { lines: [say(SK, 'I am the only one at this fair who was not accused of anything. Note it down.')] },
    joined: {
      lines: [
        say(SK, 'She chose you. I would have asked more questions.'),
        { if: { all: [{ notFlag: 'choice.azzy_ordu' }, { notFlag: 'side.salkhi.done' }] }, speaker: SK, text: '(The mare looks at Azzy and sighs, at length.)' },
        { if: { flag: 'choice.azzy_ordu' }, speaker: SK, text: 'The grandson said no to two hundred horses. I respect that less than you would think.' },
      ],
    },
    dawn: { lines: [say(SK, 'You brought the stick back. The black horse that carried it had my saddle\'s cousin on. I noticed.')] },
    after: { lines: [say(SK, 'The standard stands. The council sits. Nobody has thanked the horse.')] },
  }),
  simple('salkhi_plateau_talk', [
    say(SK, 'That foal is on the wrong side of the rail from its mother, and nobody on this plateau can count.'),
    { if: { all: [{ notFlag: 'choice.azzy_ordu' }, { notFlag: 'side.salkhi.done' }] }, speaker: SK, text: '(She looks at Azzy and sighs.)' },
  ]),
  simple('salkhi_shore_talk', [say(SK, 'I do not do ice. I did it once. Ask her grandmother. I will be here, being right.')]),
  simple('salkhi_quay_talk', [say(SK, 'A boat. Of course a boat. Load me last, so I can complain the whole length of the quay.')]),

  // ---- Beat 2: the Moot -------------------------------------------------------------------------------------
  simple('moot', [
    act(
      [
        { do: 'look', actor: 'npc:horn_master' },
        { do: 'walk', actor: 'npc:horn_master', to: at(16, MOOT.sceneRow), facing: 'right' },
      ],
      '',
      'The Great Moot Tent: an aisle of clan poles to the chieftain\'s seat. Gianna gives the horn-master her papers.',
    ),
    act([{ do: 'walk', actor: 'npc:horn_master', to: at(17, 4), facing: 'up' }], 'horn_master', 'Zetwal\'s envoy, from the Parley at Eightgate!'),
    act([{ do: 'look', actor: 'npc:torvald' }], TV, 'The Parley. Where the Throne\'s keeper read us a page.'),
    { if: { flag: 'clue.seventh_clause_read' }, speaker: TV, text: 'We heard what the Crown wrote Xaraguá down as, envoy. Waters.' },
    { if: { notFlag: 'clue.seventh_clause_read' }, speaker: TV, text: 'We heard the Parley ended badly.' },
    say(TV, 'And now you want our ships. So does he.'),
    act(
      [{ do: 'look', actor: 'npc:hostage_envoy' }, { do: 'walk', actor: 'npc:hostage_envoy', to: at(22, 7), facing: 'left' }],
      '',
      'A man in Aldermoor violet comes out of the guest tent with a ledger under his arm, and bows exactly.',
    ),
    act([{ do: 'look', actor: 'npc:lawspeaker' }], LS, 'The Ironvow swear on the standard or not at all. No standard, no oath; and what no oath forbids, the council may sell.'),
    say(LS, 'The standard was stolen nine nights ago. At the morning horn the council votes to take the Crown\'s compensation...'),
    say(LS, '...for the blockade, and give the Crown the fleet. By the law the vote is lawful.'),
    say(LS, 'By the law it is also shameful. Both are written.'),
    act([{ do: 'look', actor: 'npc:hrafn' }], HR, 'A fleet that cannot raid is firewood.'),
    say(HR, 'She guarded it the night it went. She rode out alone after it, against my order, and came back with nothing.'),
    say(HR, 'The Crown\'s man says a raider chief has it across the fjord. And the Crown\'s man has no reason to lie.'),
    say(HE, 'None at all.'),
    act([{ do: 'look', actor: 'npc:bayarmaa' }, { do: 'face', actor: 'npc:bayarmaa', facing: 'up' }], BY, 'The floes took the trail at the thin water. I came back for a horse that could cross it. He said no.'),
    act([{ do: 'look', actor: 'npc:torvald' }], TV, 'I said no because the fjord took half your grandmother\'s riders, coming home in the spring.'),
    say(TV, 'I will not sell the fleet to buy you a funeral.'),
    act([{ do: 'look', actor: 'player' }], G, 'As Zetwal\'s envoy I ask for her, under the envoy\'s bond, to bring the standard to its pole before the horn.'),
    say(G, 'If the standard stands at the horn, there is no vote. Your own lawspeaker just said so.'),
    say(LS, 'I did. Twice, by the sound of it.'),
    act([{ do: 'look', actor: 'npc:torvald' }], TV, 'Take her. If she runs, I sell the fleet myself and tell the skalds why.'),
    act(
      [
        { do: 'look', actor: 'npc:bayarmaa' },
        { do: 'walk', actor: 'npc:bayarmaa', to: at(18, MOOT.sceneRow + 1), facing: 'up' },
      ],
      '',
      'Bayarmaa walks down the aisle between the poles and stands with them. She says nothing.',
      { set: { 'party.bayarmaa': true } },
    ),
    nar('(Bayarmaa joins the party.)'),
    act(
      [{ do: 'look', actor: 'npc:hostage_envoy' }, { do: 'walk', actor: 'npc:hostage_envoy', to: at(20, 12), facing: 'down' }],
      HE,
      'The Throne\'s compensation is generous, and on the table until the horn. I would not want the envoy to say she was not shown it.',
    ),
    act([{ do: 'walk', actor: 'npc:hostage_envoy', to: at(MOOT.envoy.x, MOOT.envoy.y), facing: 'down' }], '', 'He walks back to the guest tent and opens a chest there: Throne gold, in rows. Samira looks, and says nothing.'),
    act([{ do: 'look', actor: 'npc:torvald' }], TV, 'The horn blows at first light. The day is yours, envoy.'),
    say(TV, 'The man in the white coat has been in my field three days, waiting for your Brasador.'),
    say(TV, 'The herders at the folds lost half their winter store to wolves, and the other half to somebody kinder.'),
    say(TV, 'And my traders are shouting about oaths again. They always are.', { set: { 'story.moot_seen': true } }),
    act([{ do: 'look', actor: 'player' }], BY, 'Do his three things. Then the fjord, tonight.'),
  ]),
  script('torvald_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'ally.skarragol' }, to: 'after' },
        { if: { flag: 'party.bayarmaa' }, to: 'day' },
        { to: 'before' },
      ],
    },
    before: { lines: [say(TV, 'Speak to the horn-master, envoy. The Moot hears envoys in the aisle, not at my elbow.')] },
    day: { lines: [say(TV, 'Until the horn, envoy. The white coat, the folds, the traders. Then my daughter\'s ice.'), ...LEFT] },
    after: { lines: [say(TV, 'Ironvow sits, envoy. Tell Kaede Suzumori we spoke for you. She will want it in writing. She has it.')] },
  }),
  simple('lawspeaker_talk', [
    { if: { notFlag: 'story.standard_planted' }, speaker: LS, text: 'The law is on the hides in my tent, envoy. Read it. Everyone quotes it; nobody reads it.' },
    { if: { notFlag: 'story.standard_planted' }, speaker: LS, text: 'The guard roster for that night is there too. Bayarmaa\'s name, and one struck out. Ask whose.' },
    { if: { flag: 'story.standard_planted' }, speaker: LS, text: 'The standard stands. I have nothing to do until somebody breaks another law. It will not be long.' },
  ]),
  simple('hrafn_talk', [
    { if: { notFlag: 'story.standard_planted' }, speaker: HR, text: 'Envoy. Ships that cannot raid are firewood, and firewood the Crown pays for is still firewood.' },
    { if: { flag: 'story.standard_planted' }, speaker: HR, text: 'You won the vote. The blockade did not lose. Remember that when the Crown comes back with a better price.' },
  ]),
  simple('trading_jarl_talk', [say(JR, 'Eleven hulls, envoy. The Crown measured nine. I counted them all, and I want them all back on the water.')]),
  simple('trading_jarl_quay_talk', [say(JR, 'Nine measured. None sold. The longship at the end of the pier is yours, envoy.')]),
  simple('hostage_envoy_talk', [say(HE, 'I am the steppe\'s guest, envoy, and the Throne\'s clerk. I would not want you to say you were not shown the offer.')]),
  simple('bayarmaa_talk', [say(BY, '...'), nar('She is watching the tent flap, where the grey mare\'s head would be if they let it in.')]),
  simple('horn_rider_talk', [say('horn_rider', 'The Moot sits at the horn. Until then we hold the aisle, and the chieftain\'s daughter.')]),
  simple('horn_master_talk', [
    { if: { notFlag: 'story.standard_planted' }, speaker: 'horn_master', text: 'The morning horn is mine to blow, envoy. Not a breath before first light.' },
    { if: { flag: 'story.standard_planted' }, speaker: 'horn_master', text: 'I have blown that horn forty years. I never once blew it over a standard brought home.' },
  ]),
  simple('grimvald_bound_talk', [say(GV, 'Ask the Crown. I said it on the shore; I will say it here. Paid men don\'t ride home.')]),
  script('inner_pole', {
    start: { lines: [nar('The inner pole beside the chieftain\'s seat, where the Ironvow swear. Its socket is empty.')] },
  }),
  simple('inner_pole_planted', [nar('The Ironvow standard, home on its pole: nine horse-tails under a slate-grey disc.')]),
  simple('chieftain_seat', [nar('The chieftain\'s seat: a saddle on a block of black ash. Torvald never sits in it during a vote.')]),
  simple('crown_chest', [
    { if: { notFlag: 'ally.skarragol' }, speaker: '', text: 'The Crown\'s offer, in a chest under the Throne\'s seal: compensation for the blockade, in rows of gold.' },
    { if: { flag: 'ally.skarragol' }, speaker: '', text: 'The chest is shut and corded for the road home. The offer stood until the horn.' },
  ]),

  // ---- Beat 3: until the horn (the gate, at dusk) -------------------------------------------------------------
  script('fjord_gate_wait', {
    start: { lines: [], next: [{ if: HORN_DAY_DONE, to: 'dusk' }, { if: { flag: 'party.bayarmaa' }, to: 'joined' }, { to: 'barred' }] },
    dusk: { lines: SET_OUT },
    barred: { lines: [say('horn_rider', 'By the chieftain\'s word, nobody goes down to the water before the council has sat.')] },
    joined: { lines: [say(BY, 'Not yet.'), ...LEFT, say(A, 'Your Quests page, Gigi.')] },
  }),

  // ---- Beat 4: the frozen fjord ----------------------------------------------------------------------------
  simple('fjord_arrive', [
    nar('The near shore. Open black water, floes turning slowly on it, and the far shore a grey line with smoke on it.', { fx: 'fade' }),
    act(
      [{ do: 'walk', actor: 'bayarmaa', to: at(6, 29), facing: 'up' }, { do: 'look', actor: 'bayarmaa' }],
      BY,
      'Here. The trail went in here. The floes look like a road, and they are not one.',
    ),
    say(BY, 'My grandmother crossed it with forty riders and a herd, and broke the Crown\'s supply camp on the far side.'),
    say(BY, 'The spring ice took half of them coming home. She went anyway.'),
    act(
      [
        { do: 'walk', actor: 'follower', to: at(7, 31), facing: 'up' },
        { do: 'walk', actor: 'bayarmaa', to: at(8, 31), facing: 'left' },
        { do: 'wait', ms: 700 },
      ],
      '',
      'Bayarmaa takes off her outer fur and puts it round Anissa\'s shoulders without a word.',
    ),
    nar('Gianna looks at the Locket. It is warm.'),
    say(A, 'It\'s shimmering on the floes, Gigi. On some of them.'),
  ]),
  script('fjord_first_echo', {
    start: { lines: [], next: [{ if: { flag: 'story.fjord_echoed' }, to: 'done' }, { to: 'first' }] },
    first: {
      lines: [
        nar('Winter, fifty years ago. The fjord is frozen edge to edge: white ice ahead, and black patches where it is thin.'),
        say(P, '(Walk where it is white. Where the ice is black, find a floe that was ice then too, and come back to now.)', { set: { 'story.fjord_echoed': true } }),
        say('anissa_far', 'I\'m holding the door, Gigi. Every floe that shimmers is a door.'),
      ],
    },
    done: { lines: [nar('The fjord in winter, fifty years ago.')] },
  }),
  script('sarnai_raid', { start: { lines: [], next: 'raid' }, ...raidNodes() }),
  script('raid_onecho', {
    start: { lines: [], next: [{ if: { flag: 'clue.herd_whistle' }, to: 'over' }, { to: 'raid' }] },
    over: { lines: [nar('The Crown\'s camp, fifty years ago, the wagons burned out. The herd is long gone over the hill.')] },
    ...raidNodes(),
  }),
  simple('sarnai_talk', [say(SA, 'Low, high, low. The horses know it. Now you do.')]),
  simple('sarnai_mare_talk', [nar('Sarnai\'s grey mare. Fifty years from now, her granddaughter\'s mare will have her ears.')]),
  simple('echo_horse_talk', [nar('A steppe horse on the ice. Under its belly, a rider lies along its flank, very still.')]),
  simple('crown_sentry_talk', [say('crown_sentry', 'Horses. Whose are those? ...Never mind. Horses.')]),

  // ---- Beat 6: the herd (SIG-SKA part 2) ------------------------------------------------------------------
  script('herd_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.lookouts_beaten' }, to: 'calm' },
        { if: { flag: 'story.herd_called_2' }, to: 'inside' },
        { if: { flag: 'story.herd_called' }, to: 'west' },
        { if: { flag: 'clue.herd_whistle' }, to: 'whistle' },
        { to: 'look' },
      ],
    },
    look: { lines: [nar('A loose herd grazes between the ice and the sledges. Two lookouts watch the gaps in the ring.')] },
    whistle: {
      lines: [nar('A loose herd grazes between the ice and the sledges. Sarnai\'s whistle: low, high, low.')],
      choices: [
        { text: 'Whistle low, high, low.', next: 'called' },
        { text: 'Not yet.' },
      ],
    },
    called: {
      lines: [
        act([{ do: 'look', actor: 'npc:herd_3' }], '', 'Low, high, low. The herd lifts its heads, and walks west along the ring toward the far gap.', {
          set: { 'story.herd_called': true },
          stage: [{ do: 'look', actor: 'npc:herd_3' }, { do: 'sync' }, { do: 'wait', ms: 1500 }],
        }),
        act([{ do: 'look', actor: 'npc:lookout_west' }], 'lookout', 'Horses. Whose are those? Hoy! Hoy, you!'),
        act([{ do: 'look', actor: 'player' }], BY, 'Walk in the herd\'s lane. The gap is open.'),
      ],
    },
    west: { lines: [nar('The herd grazes by the west gap. Its lookout is busy shooing them.')] },
    inside: { lines: [nar('The herd crowds the east end of the ring, and the lookout with it.')] },
    calm: { lines: [nar('The herd grazes. Nobody is watching it now.')] },
  }),
  script('picket_line', {
    start: {
      lines: [],
      next: [
        { if: { any: [{ flag: 'story.lookouts_beaten' }, { flag: 'story.herd_called_2' }] }, to: 'look' },
        { if: { flag: 'story.herd_called' }, to: 'whistle' },
        { to: 'look' },
      ],
    },
    look: { lines: [nar('Grimvald\'s picket line: his own horses, tethered short. Beyond the inner ring, his tent.')] },
    whistle: {
      lines: [nar('Grimvald\'s picket line. Past it, the inner ring\'s gap, and its lookout.')],
      choices: [
        { text: 'Whistle low, high, low.', next: 'called' },
        { text: 'Not yet.' },
      ],
    },
    called: {
      lines: [
        act([{ do: 'look', actor: 'npc:herd_1' }], '', 'Low, high, low. The herd comes in through the gap behind them and drifts east along the ring.', {
          set: { 'story.herd_called_2': true, 'story.herd_unseen': true },
          stage: [{ do: 'look', actor: 'npc:herd_1' }, { do: 'sync' }, { do: 'wait', ms: 1800 }],
        }),
        act([{ do: 'look', actor: 'npc:lookout_east' }], 'lookout', 'Hoy! Whose horses are these, inside the ring? Get out of it!'),
        act([{ do: 'look', actor: 'player' }], BY, 'Sarnai\'s way. Nobody saw us. Grimvald\'s tent.'),
      ],
    },
  }),
  ...['lookout_west_talk', 'lookout_east_talk'].map((id) =>
    simple(id, [
      say('lookout', 'Hoy! Envoys on the shore! To me! To me!', { fx: 'shake' }),
      say(BY, 'Should have stayed in the herd.', { set: { 'battle.next': 'camp_lookouts', 'battle.after': 'lookouts_after' } }),
    ]),
  ),
  simple('lookouts_after', [
    nar('The reavers ride for the far tents, and the lookout runs after them. The gaps in the ring are open.', { set: { 'story.lookouts_beaten': true } }),
    say(BY, 'Sarnai would have whistled. Low, high, low.'),
  ]),
  simple('grimvald_horse_talk', [nar('A black horse, tethered, with a saddle too fine for a raider. The saddle-cloth is Crown violet.')]),

  // ---- Beat 7: Noyan Grimvald --------------------------------------------------------------------------
  script('grimvald_tent', {
    start: { lines: [], next: [{ if: { flag: 'encounter.skarragol_story.grimvald.won' }, to: 'after' }, { to: 'meet' }] },
    meet: {
      lines: [
        act(
          [
            { do: 'look', actor: 'grimvald' },
            { do: 'enter', actor: 'grimvald', look: 'grimvald', from: at(FJORD.tentDoor.x, FJORD.campRow), to: at(22, FJORD.campRow), facing: 'right' },
          ],
          '',
          'A big man in a wolf-fur coat comes out of the tent. The Ironvow standard is strapped across his back.',
        ),
        nar('Coin is sewn into the hem of his coat. Throne gold.'),
        say(GV, 'Ironvow\'s girl. You came for a stick with a horse\'s tail on it.'),
        act([{ do: 'walk', actor: 'bayarmaa', to: at(25, FJORD.campRow), facing: 'left' }], BY, 'I came for the oath on it. You took that too. Give it back and ride.'),
        say(GV, 'Paid men don\'t ride home, girl. Ask the Crown.'),
        act([{ do: 'walk', actor: 'grimvald', to: at(23, FJORD.campRow), facing: 'right' }], '', 'He swings up onto the black horse.'),
        say(GV, 'Ride them down!', { set: { 'battle.next': 'fjord_grimvald', 'battle.after': 'grimvald_after' } }),
      ],
    },
    after: { lines: [], next: 'yield' },
    ...afterNodes(),
  }),
  script('grimvald_after', { start: { lines: [], next: 'yield' }, ...afterNodes() }),

  // ---- Beat 8: the horn, the price, the token -------------------------------------------------------------
  script('horn', {
    start: {
      lines: [
        act(
          [{ do: 'look', actor: 'npc:horn_master' }, { do: 'face', actor: 'npc:horn_master', facing: 'up' }, { do: 'wait', ms: 600 }],
          '',
          'First light. The horn-master raises the morning horn as they come in, and blows. The council stands to vote.',
          { fx: 'shake' },
        ),
        act(
          [{ do: 'look', actor: 'bayarmaa' }, { do: 'walk', actor: 'bayarmaa', to: at(MOOT.innerPole.x, MOOT.innerPole.y + 1), facing: 'up' }],
          '',
          'Bayarmaa walks past her father to the empty pole, and plants the standard in it.',
          { set: { 'story.standard_planted': true, 'item.ironvow_standard': false } },
        ),
        act([{ do: 'sync' }, { do: 'look', actor: 'npc:lawspeaker' }], LS, 'The standard stands. There is no vote.'),
        act([{ do: 'look', actor: 'npc:hrafn' }], HR, 'There is a vote on the compensation. The blockade cost us the same with a standard or without.'),
        act([{ do: 'look', actor: 'npc:hostage_envoy' }], HE, 'The offer stood until the horn. The horn has blown.'),
        nar('He closes his ledger.'),
      ],
      next: [{ if: { flag: 'choice.grimvald_spared' }, to: 'thief' }, { to: 'voucher' }],
    },
    thief: {
      lines: [
        act([{ do: 'look', actor: 'npc:grimvald_bound' }, { do: 'walk', actor: 'npc:grimvald_bound', to: at(16, 12), facing: 'up' }], LS, 'Bring the thief up.'),
        say(GV, 'Ask the Crown. Its office paid me in Throne gold to take that stick, payable when your council voted.'),
        say(LS, 'Then the thief is across the fjord, and this council\'s guest paid him. The guard\'s name stands clean.', { set: { 'story.bayarmaa_cleared': true } }),
      ],
      next: 'defy',
    },
    voucher: {
      lines: [
        say(G, 'From the thief\'s tent: "For the recovery of a sacred object, payable on the council\'s vote." Under the Throne\'s seal.'),
        say(LS, 'Read into the Moot. The guard\'s name stands clean.', { set: { 'story.bayarmaa_cleared': true } }),
      ],
      next: 'defy',
    },
    defy: {
      lines: [
        say(HE, 'The compensation office pays many claims, envoy. I could not say which.'),
        act([{ do: 'face', actor: 'bayarmaa', facing: 'down' }, { do: 'look', actor: 'bayarmaa' }], BY, 'You would have sold my grandmother\'s ships to the people she took them from...'),
        say(BY, '...for a page that calls our allies waters. The standard is back. The oath is back. I am not.'),
        say(BY, 'I ride with the envoy until the Crown is off this plateau. The Moot can write that down as shameful, if it wants a word.'),
        act([{ do: 'look', actor: 'npc:torvald' }, { do: 'wait', ms: 900 }], TV, 'Write it.'),
        say(TV, 'Your grandmother said it shorter.'),
        say(TV, 'Zetwal wants the fleet for its war. The Ironvow ride for whoever pays the blockade\'s cost.'),
        say(TV, 'That is not greed, envoy. It is three winters of fish and no salt.'),
      ],
      next: [{ if: { flag: 'item.crown_purse' }, to: 'purse' }, { to: 'salt' }],
    },
    purse: {
      lines: [nar('The Crown\'s purse is in Gianna\'s bag: three hundred in Throne gold.')],
      choices: [
        { text: 'Put the Crown\'s purse on the table.', set: { 'choice.crown_purse_given': true, 'item.crown_purse': false }, next: 'given' },
        { text: 'Keep the purse.', set: { 'item.crown_purse': false, 'gold.gain': 300 }, next: 'kept' },
      ],
    },
    given: {
      lines: [say(G, 'The Throne\'s own compensation, from the Throne\'s own thief.'), say(TV, 'The Crown pays for its blockade after all.')],
      next: 'salt',
    },
    kept: { lines: [say(S, 'Sensible.')], next: 'salt' },
    salt: {
      lines: [
        act([{ do: 'look', actor: 'samira' }], '', 'Samira takes out her slip-book and writes at the council\'s table.'),
        say(S, 'Dorini salt at the pre-blockade price, for two years. I am not giving it away. I am underpricing it.', { set: { 'story.samira_letter': true } }),
        say(S, 'There is a difference, and it is my mother\'s.'),
        act([{ do: 'look', actor: 'npc:trading_jarl' }], JR, 'Three hundred toward the fleet\'s winter, envoy, and I will stand for it in the Moot. Less, if less is what you have.'),
      ],
      choices: [
        { text: 'Pay the jarl 300 gold.', set: { 'choice.jarl_paid': true, 'gold.pay': 300 }, next: 'jarl' },
        { text: 'Not this time.', next: 'token' },
      ],
    },
    jarl: { lines: [say(JR, 'The trading jarl stands for Zetwal. Write that too, lawspeaker.')], next: 'token' },
    token: {
      lines: [
        say(TV, 'The fleet is Zetwal\'s when the realm musters. What you have not paid, the Muster will ask for.', { set: { 'ally.skarragol': true } }),
        act([{ do: 'look', actor: 'npc:torvald' }], '', 'Torvald cuts a braid from the standard\'s horse-tail and gives it to Gianna.'),
        say(TV, 'For the chamberlain\'s chair, when there is a Claim. Ironvow sits.', { set: { 'item.token_ironvow': true } }),
        act([{ do: 'walk', actor: 'npc:horn_master', to: at(17, 13), facing: 'down' }], TV, 'Kaede Suzumori\'s people will not speak to an envoy nobody has spoken for. Take this.'),
        nar('The horn-master hands Gianna a sealed horn-case.', { set: { 'item.torvald_letter': true } }),
        say(BY, 'Fog people. They know what you said before you say it. Say less.'),
        say(TV, 'The longship at the quay is yours. South along the coast, to Kirinoura.'),
      ],
    },
  }),

  // ---- Beat 9: the quay ------------------------------------------------------------------------------
  simple('quay_end', [
    act([{ do: 'look', actor: 'npc:trading_jarl_quay' }], JR, 'Nine measured. None sold. The Crown\'s surveyor left before breakfast.'),
    nar('A longship at the end of the pier, oars up. Her crew is Ironvow, and they are watching Bayarmaa, not the envoy.'),
    act([{ do: 'look', actor: 'npc:salkhi_quay' }], '', 'Salkhi is loaded last, complaining the whole length of the quay.'),
    say(BY, 'South along the fjord coast. Into the mist, where the lanterns are.'),
    say(A, 'Bayarmaa\'s coming too, Gigi.'),
    say(G, 'She is.', { fx: 'fade', set: { 'act6.complete': true, 'travel.next': 'kuroshi-pier/pier', 'voyage.next': 'skarragol_kuroshi' } }),
  ]),
  simple('longship_ready', [nar('An Ironvow longship, oars up, a slate-grey disc on her prow. She sails when the envoy says.')]),
  simple('quay_hulls', [
    { if: { notFlag: 'story.standard_planted' }, speaker: '', text: 'Eleven longships drawn up. Chalk on nine of them: the Crown surveyor\'s numbers.' },
    { if: { flag: 'story.standard_planted' }, speaker: '', text: 'Eleven longships. Someone has scrubbed the chalk off every one.' },
  ]),

  // ---- The Saga Tent's keeper ------------------------------------------------------------------------
  simple('skald_talk', [
    say('skald', 'Heill, envoy. Eight sagas on the hides: oaths, the law, the sky, salt, and who married whom.', { translation: 'Hail' }),
    say('skald', 'Sarnai\'s Ride is the one everybody asks for. Nobody writes the whistle down, mind. Three notes.'),
  ]),

  // ---- S-3 The Winter Stores (the rebel safehouse; M-SKA-1, the wolf run) --------------------------------------
  script('oyuun_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.winter_stores.done' }, to: 'after' },
        { if: { flag: 'anchor.wolf_run' }, to: 'report' },
        { if: { flag: 'side.winter_stores.wolves' }, to: 'gully' },
        { if: { flag: 'side.winter_stores.accepted' }, to: 'waiting' },
        { if: { flag: 'party.bayarmaa' }, to: 'ask' },
        { to: 'stranger' },
      ],
    },
    stranger: { lines: [say('oyuun', 'Strangers on the plateau ask too many questions. Come back with someone I know.')] },
    ask: {
      lines: [
        say('oyuun', 'Torvald\'s girl. Then you will listen.'),
        say('oyuun', 'Someone leaves grain at the store under the edge every winter. Sacks, before the first snow. No cart tracks.'),
        say('oyuun', 'A grey thumbprint on every sack. This year the wolves have found the store. They come up the gully at dusk.'),
      ],
      choices: [
        { text: 'We will guard the store.', set: { 'side.winter_stores.accepted': true }, next: 'yes' },
        { text: 'Not now.' },
      ],
    },
    yes: { lines: [say('oyuun', 'South, under the plateau\'s edge. You will smell them before you see them.')] },
    waiting: { lines: [say('oyuun', 'The store is under the edge, south. The wolves come up the gully.')] },
    gully: {
      lines: [
        say('oyuun', 'They will come back tomorrow. They always use the same road, the gully. Nobody can shut a gully.'),
        say(BY, 'The Locket can. Maybe.'),
      ],
    },
    report: {
      lines: [
        say('oyuun', 'There is a wall of boulders across the gully\'s mouth, with grass on it. Fifty years of grass.'),
        say('oyuun', 'It was not there this morning. I will not ask.'),
        nar('Gianna turns a sack over. A grey thumbprint, in ash, on the seam.', { set: { 'side.winter_stores.done': true } }),
        say(Y, 'Yucayeque\'s oil. Cenizal\'s bread. Bab al-Dhahab\'s water. Now Ordvik\'s grain. The same hand.'),
      ],
    },
    after: { lines: [say('oyuun', 'The wolves go round now. The grain stays. Tell whoever leaves it: the herders say thank you.')] },
  }),
  // old_herder_talk: data/dialogue/skarragolQuests.ts (S-4 The Cairn of Nine Riders, built Oct 27).
  simple('sighting_stone', [nar('A flat stone in a ring of nine cairns, its face scored with lines like star paths. The snow has not settled on it.')]),
  script('store_wolves', {
    start: { lines: [], next: [{ if: { flag: 'encounter.skarragol_story.wolves.won' }, to: 'after' }, { to: 'come' }] },
    come: {
      lines: [
        nar('The winter store: a dry cave under the plateau\'s edge, sacks to the roof. Something has been at the sacks by the mouth.'),
        act(
          [
            { do: 'look', actor: 'wolf_a' },
            { do: 'enter', actor: 'wolf_a', look: 'steppe_wolf', from: at(44, 22), to: at(39, 22), facing: 'left', run: true, async: true },
            { do: 'enter', actor: 'wolf_b', look: 'steppe_wolf', from: at(44, 23), to: at(39, 23), facing: 'left', run: true, async: true },
            { do: 'enter', actor: 'wolf_c', look: 'steppe_wolf', from: at(44, 22), to: at(38, 24), facing: 'left', run: true },
          ],
          '',
          'Grey shapes come up the gully at a run: three wolves, heads low.',
          { fx: 'shake' },
        ),
        say(BY, 'Three. One at a time, if we stand at the mouth.', { set: { 'battle.next': 'winter_wolves', 'battle.after': 'wolves_after' } }),
      ],
    },
    after: { lines: [], next: 'gone' },
    gone: wolvesGone(),
  }),
  script('wolves_after', { start: wolvesGone() }),
  simple('winter_store', [
    { if: { notFlag: 'side.winter_stores.accepted' }, speaker: '', text: 'A cave under the plateau\'s edge, stacked with sacks. Torn ones by the mouth.' },
    { if: { flag: 'side.winter_stores.accepted' }, speaker: '', text: 'The winter store. Every sack has a grey thumbprint on its seam.' },
  ]),
  simple('winter_store_echo', [nar('Fifty years ago: the store full of the Crown\'s grain sacks, with Sarnai\'s mark chalked over the Crown\'s.')]),
  simple('slope_boulder', [
    nar('A loose boulder on the slope above the gully, fifty years ago. It rocks when you lean on it.'),
    say(P, '(If this went down, nothing would come up that gully again.)'),
    nar('Patricio sets his shoulder to it. It goes.', { fx: 'shake', set: { 'anchor.wolf_run': true } }),
    act([{ do: 'sync' }], 'sarnai_rider', 'Hah! That shuts the wolves\' road for a hundred years. Sarnai will want to know who.'),
  ]),
  simple('boulder_wall', [nar('A wall of boulders across the gully\'s mouth, with fifty years of grass on it. The wolves\' road is shut.')]),
  simple('gully_open', [nar('The gully the wolves come up. A boulder on the slope above it would shut it, if anyone could move one.')]),
  script('store_echo_enter', {
    start: {
      lines: [
        nar('The store, the winter of the raid: Sarnai\'s cache. Two of her riders guard the Crown\'s grain.'),
        { if: { notFlag: 'anchor.wolf_run' }, speaker: P, text: '(The gully. The wolves came up it then too. A boulder on the slope above it...)' },
      ],
    },
  }),
  script('store_echo_return', {
    start: { lines: [], next: [{ if: { flag: 'anchor.wolf_run' }, to: 'shut' }, { to: 'open' }] },
    shut: { lines: [say(Y, 'Gigi. The gully. There\'s a wall across it.')] },
    open: { lines: [nar('The gully is open. The wolves\' road.')] },
  }),
  simple('sarnai_rider_talk', [say('sarnai_rider', 'Sarnai says the grain goes out before the snow, and nobody asks whose grain it was.')]),

  // ---- S-5 Grandson of the Steppe (Azzy's mother's people: Ironvow's eastern clans; the review's 3.5) -----------
  script('ordu_envoy_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.grandson.done' }, to: 'after' },
        { if: { flag: 'side.grandson.bout' }, to: 'bout' },
        { to: 'offer' },
      ],
    },
    offer: {
      lines: [
        act([{ do: 'face', actor: 'npc:ordu_envoy', facing: 'player' }], '', 'The envoy in white bows the moment Azzy comes near, and stays bowed. Every time Azzy moves, he bows again.'),
        say(OE, 'Grandson of the khatun\'s household. Your mother rides the eastern grass, under the Ironvow standard, as we all do.'),
        say(OE, 'She does not ask after you. She has not stopped asking after you since the day she left. I was told to say neither.'),
        say(OE, 'Two hundred riders of the eastern clans, for your claim, the day you take your mother\'s name.'),
        say(Z, 'Will you stand up, please.'),
        say(OE, 'I will not, highness.'),
        say(Y, 'I like him.'),
      ],
      choices: [
        { text: 'Refuse politely.', set: { 'choice.azzy_ordu': 'influence', 'side.grandson.answered': true }, next: 'polite' },
        { text: 'Refuse with a show of strength.', set: { 'choice.azzy_ordu': 'fear', 'side.grandson.answered': true, 'side.grandson.bout': true }, next: 'strength' },
        { text: 'Azzy, ask Gianna first.', set: { 'choice.azzy_ordu': 'share', 'side.grandson.answered': true }, next: 'share' },
      ],
    },
    polite: {
      lines: [
        say(Z, 'Tell the khatun\'s household I am honoured. And that I am Rodriguez.'),
        say(Z, 'A man who sheds one name for riders will shed the next for more.'),
        act([{ do: 'look', actor: 'npc:ordu_envoy' }], OE, 'That is the answer she said you would give. I am to bow lower for it.', {
          set: { 'side.grandson.polite': true, 'side.grandson.done': true },
        }),
      ],
    },
    strength: {
      lines: [
        say(Z, 'Tell them no. And tell them I can sit a horse.'),
        act([{ do: 'look', actor: 'npc:ordu_champion' }, { do: 'face', actor: 'npc:ordu_champion', facing: 'player' }], 'ordu_champion', 'Then the clans may see it. A bout, grandson. Practice sabres. Nobody hurt past the bout.'),
        say(Z, 'Done.', { set: { 'battle.next': 'ordu_bout', 'battle.after': 'bout_after' } }),
      ],
    },
    share: {
      lines: [
        act(
          [
            { do: 'walk', actor: 'azzy', to: at(FAIR.rail.x, FAIR.rail.y), facing: 'right' },
          ],
          '',
          'Azzy and Gianna walk away from the others, to the corral rail. Yari keeps Anissa with her.',
        ),
        say(G, 'You have a claim through two houses, Azzy. So do I. One of us is going to have to say what the Throne is for.'),
        say(Z, 'Then it is not for one of us.'),
        act([{ do: 'walk', actor: 'azzy', to: at(FAIR.envoy.x, FAIR.envoy.y + 1), facing: 'up' }], Z, 'No. Thank them. No.'),
        say(OE, 'Fewer words than your father. More than your mother. I will tell her both.', {
          set: { 'side.grandson.shared': true, 'side.grandson.done': true },
        }),
      ],
    },
    bout: { lines: [say(OE, 'The champion waits for you, highness. The clans like to see a thing, not hear of it.')] },
    after: {
      lines: [
        say(OE, 'I have sent word east. Your mother will hear it before the snow.'),
        { if: { flag: 'party.bayarmaa' }, speaker: BY, text: 'Your mother\'s people ride under our standard too.' },
      ],
    },
  }),
  script('ordu_champion_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'encounter.skarragol_story.champion.won' }, to: 'after' },
        { if: { flag: 'side.grandson.bout' }, to: 'again' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [say('ordu_champion', 'I ride for the khatun\'s household. I bow when he bows. He bows a great deal.')] },
    again: {
      lines: [say('ordu_champion', 'Again, grandson? Practice sabres.')],
      choices: [{ text: 'Again.', set: { 'battle.next': 'ordu_bout', 'battle.after': 'bout_after' } }, { text: 'Not yet.' }],
    },
    after: { lines: [say('ordu_champion', 'He can sit a horse. I have said so to everyone. Some of them twice.')] },
  }),
  simple('bout_after', [
    act([{ do: 'look', actor: 'npc:ordu_champion' }], 'ordu_champion', 'He can sit a horse. I will say so.'),
    say(Z, 'Tell them whose.', { set: { 'side.grandson.bout_won': true, 'side.grandson.done': true } }),
  ]),
];

/** After Grimvald yields (beat 7): the standard, the voucher, his end (both remembered), the ride round at dawn. */
function afterNodes(): Record<string, DialogueNode> {
  return {
    yield: {
      lines: [
        act(
          [{ do: 'place', actor: 'grimvald', look: 'grimvald', at: at(22, FJORD.campRow), facing: 'right' }, { do: 'look', actor: 'grimvald' }],
          '',
          'Grimvald is on his knees in the grass. The Ironvow standard lies where it fell.',
        ),
        act(
          [
            { do: 'walk', actor: 'bayarmaa', to: at(21, FJORD.campRow), facing: 'left' },
            { do: 'wait', ms: 600 },
            { do: 'walk', actor: 'bayarmaa', to: at(26, FJORD.campRow), facing: 'left' },
          ],
          '',
          'Bayarmaa picks the standard up off the grass with both hands, and walks it back to them.',
          { set: { 'item.ironvow_standard': true } },
        ),
        act(
          [
            { do: 'walk', actor: 'samira', to: at(FJORD.tentDoor.x, FJORD.campRow), facing: 'up' },
            { do: 'wait', ms: 900 },
          ],
          '',
          'In the tent, a chest under the Throne\'s seal: three hundred in Throne gold, and a voucher with no name on it.',
        ),
        say(S, '"For the recovery of a sacred object, payable on the council\'s vote." The Throne\'s compensation office.', {
          set: { 'item.crown_purse': true, 'clue.crown_pays_raiders': true },
        }),
        say(G, 'The Crown paid him to steal it, so the council could sell the fleet lawfully.'),
        say(Y, 'And he told us so himself.'),
      ],
      choices: [
        { text: 'Bind him; the Moot will hear him.', set: { 'choice.grimvald_spared': true }, next: 'spared' },
        { text: 'Let him ride and tell the plateau.', set: { 'choice.grimvald_broken': true }, next: 'broken' },
      ],
    },
    spared: {
      lines: [
        say(GV, 'Ask the Crown. I\'ll say it to your lawspeaker\'s face.'),
        act([{ do: 'walk', actor: 'azzy', to: at(23, FJORD.campRow), facing: 'left' }], '', 'Azzy ties his hands with his own horse\'s lead.'),
      ],
      next: 'round',
    },
    broken: {
      lines: [
        say(Z, 'Ride. Tell every raider on the plateau what happened here.'),
        act([{ do: 'exit', actor: 'grimvald', to: at(6, FJORD.campRow), run: true }], '', 'He goes, without his horse, without looking back.'),
      ],
      next: 'round',
    },
    round: {
      lines: [
        act([{ do: 'look', actor: 'bayarmaa' }], BY, 'His horses know the fjord\'s head. We ride round, not across.', {
          fx: 'fade',
          set: { 'story.grimvald_beaten': true, 'story.standard_home': true, 'travel.next': 'skarragol-fair/fjord_dawn' },
        }),
      ],
    },
  };
}

/** The wolves break after the fight at the store (S-3), and the herder comes down from the folds. */
function wolvesGone(): DialogueNode {
  return {
    lines: [
      nar('The wolves break and run back down the gully.'),
      act(
        [{ do: 'look', actor: 'npc:oyuun' }, { do: 'walk', actor: 'npc:oyuun', to: at(PLATEAU.zone.x + 1, PLATEAU.zone.y - 1), facing: 'down' }],
        'oyuun',
        'They will come back tomorrow. They always use the same road.',
        { set: { 'side.winter_stores.wolves': true } },
      ),
      say(A, 'Gigi. The air by the store is shimmering.'),
    ],
  };
}

