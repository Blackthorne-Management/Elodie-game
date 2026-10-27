// Chapter 10, The Muster (Pòdlimyè, Zetwal again): docs/quest/reviews/2026-10-22-chapter10-outline.md with its second
// review's fixes (2026-10-22-chapter10-outline-review.md, every one taken) and the owner's decision of Oct 22 (Anissa says
// her name to Patricia at the lamp AND one public sentence at the inspection). The maps are tools/maps/zetwal-*.ts and
// tools/maps/zetwal-mill.ts; every tile in a stage direction comes from data/muster.ts.
//
// The owner's rules here: every story moment is acted out on the map (the armies walk in, the grandmothers walk up, the
// bought captain walks down to the harbor, his company walks past the party to its ship, the fleet sails); Anissa is never
// touched by a foe, never a target and never jokes, and no comic line shares a node with hers (Salkhi, Samira's prices,
// Vikram's breath, Edmund's apologies stay in other nodes: tests/muster.test.ts checks it). The locked rule: Rahel and
// Patricia say nothing of Rael that reads only one way (Rahel's "So they say." is the family's one line, and it reads
// either way); nothing here gives a Rael clue (STORY 4 assigns this chapter none). Open question 13 (what old Patricio
// knows) is not decided: he is not at the blessing, and the kitchen is two women who knew each other in the Accord's camp,
// nothing more (the second review's 3.3).

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueChoice, DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { MUSTER } from '../../config.ts';
import { DUSK, HARBOR, HOUSE, MILL, MUSTER_HOUSES, PLAZA, ROAD, SEATED, SEATED_PARTS, TEMPLE, type MusterHouse } from '../muster.ts';

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
const Y = 'yari';
const A = 'anissa';
const AF = 'anissa_far';
const Z = 'azzy';
const S = 'samira';
const PO = 'patricio_old';
const AN = 'anicette';
const BY = 'bayarmaa';
const H = 'haru';
const V = 'vikram';
const ED = 'edmund';
const JO = 'jordyn';
const RA = 'rahel';
const PA = 'patricia';
const JQ = 'joaquin_muster';
const SG = 'fb_sergeant';
const SK = 'salkhi';
const CH = 'chancellor';
const SP = 'council_speaker';
const DOVE = 'elder_dove';
const HAWK = 'elder_hawk';
const PR = 'printer';
const ADM = 'dorini_admiral';
const CON = 'crown_consul';

/** The Muster has begun (the overlays on Pòdlimyè's people start here). */
const MUSTER_ON: Condition = { flag: 'story.muster_begun' };
const has = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const all = (...c: Condition[]): Condition => ({ all: c });

/** The three accounts of the Ash Wars the party carries (the fourth is Anicette's own: she tells it at her table). */
const THREE_ACCOUNTS: Condition = all(
  has('lore.zetwal_ash_wars_temple'),
  { any: [has('lore.kuroshi_spy_ledger'), has('side.spy_ledger.done')] },
  { any: [has('side.crown_chronicle.done'), has('lore.zetwal_crown_chronicle')] },
);

// ---- Beat 0: the long pier --------------------------------------------------------------------------------------------

const LANDING: DialogueScript = script('muster_landing', {
  start: {
    lines: [
      nar('Pòdlimyè\'s long pier, in the morning. The Old Harbor is full of hulls that are not Zetwal\'s.', { fx: 'fade', stage: [{ do: 'sync' }] }),
      nar('A grey longship with a horse-tail standard. Two boats with paper lanterns.'),
      nar('A ship with a brass lamp at its masthead. A Dorini merchantman with a green pennant.'),
      say(ED, 'It\'s warm. I said it would be warm. I\'ve packed tea for a colder country; I\'m terribly sorry.'),
      say(S, 'Nine of us and a horse. I have never arrived anywhere so expensively.'),
      say(V, 'A harbor... without a chain. I had forgotten they existed.'),
      act([{ do: 'look', actor: 'bayarmaa' }], BY, 'Grass.'),
      say(H, 'Those are not fishing boats.'),
    ],
    next: 'full',
  },
  full: {
    lines: [act([{ do: 'look', actor: 'player' }], A, 'Gigi. The harbor\'s full.'), say(G, 'It is. That\'s us. We did that.')],
    next: 'family',
  },
  family: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'anicette_l', look: 'anicette', from: at(24, 9), to: at(30, 12), facing: 'down', run: true, async: true },
          { do: 'enter', actor: 'patricio_l', look: 'patricio_old', from: at(23, 9), to: at(31, 12), facing: 'down' },
          { do: 'look', actor: 'anicette_l' },
        ],
        AN,
        'Nine! Nine of you and a horse, and not one of you has eaten.',
      ),
      act([{ do: 'look', actor: 'player' }], A, 'Grandmother! Gigi broke into a keep and a court let us go.'),
      say(PO, 'Did it.'),
    ],
    next: 'marshal',
  },
  marshal: {
    lines: [
      say(PO, 'Gianna. They came. The Ironvow put in three days ago and have been drinking the Heights dry.'),
      say(PO, 'The Suzumori came in the fog, and nobody saw them tie up.'),
      say(PO, 'The Agnivansh came with a lamp lit, and the whole harbor crossed itself.'),
      say(PO, 'The Dorini came with a bill.'),
      say(S, 'Of course they did.'),
      say(PO, 'I have waited fifty years for a harbor like this, and I find I don\'t know what to do with it.'),
      say(PO, 'Mustering is a young man\'s trade. I have the whistle for it and no breath.'),
    ],
    next: 'whistle',
  },
  whistle: {
    lines: [
      act([{ do: 'walk', actor: 'patricio_l', to: at(31, 13), facing: 'left' }, { do: 'face', actor: 'player', facing: 'right' }], '', 'Gianna takes the brass whistle from its cord round her neck, and puts it in his hand.', {
        set: { 'item.marshal_whistle': false, 'story.whistle_lent': true },
      }),
      say(G, 'Then it\'s yours again. For today.'),
      act([{ do: 'wait', ms: 900 }], '', 'He closes his hand on it, and says nothing for a moment.'),
      say(PO, 'The council sits at noon. The Chancellor will not send a Zetwal ship to a war with a camp that is three camps.'),
      say(PO, 'Seat them, envoy. Then come to the Hall.'),
    ],
    next: 'mother',
  },
  mother: {
    lines: [
      say(H, 'Your mother?'),
      say(PO, 'At Eightgate. The Regent\'s guest, as he calls it. She writes about the weather.'),
      act([{ do: 'face', actor: 'follower', facing: 'player' }, { do: 'wait', ms: 700 }], '', 'Gianna says nothing. Anissa takes her hand.'),
    ],
    next: 'trader',
  },
  trader: {
    lines: [
      act([{ do: 'look', actor: 'npc:trader_muster' }], 'trader_captain', 'I\'m not sailing again until there\'s a fleet to sail with. Four countries and a horse. I want to see how it ends.'),
      act(
        [
          { do: 'exit', actor: 'anicette_l', to: at(24, 9), async: true },
          { do: 'exit', actor: 'patricio_l', to: at(HARBOR.patricio.x, HARBOR.patricio.y) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'Grandmother goes home to cook for nine. Grandfather walks up to the quay with the whistle in his fist.',
        { set: { 'story.pier_met': true } },
      ),
    ],
  },
});

// ---- Beat 1: the camp on the plaza ------------------------------------------------------------------------------------

const CAMP: DialogueScript = script('muster_camp', {
  start: {
    lines: [
      nar('The Festival Plaza is a camp. Tents where the stalls stood, banners where the lanterns hang, and seven kinds of soldier.', { fx: 'fade' }),
      nar('By the fountain, black coats with the sashes torn off. At the east gate, horses. Green on the west lane, round a table.'),
      nar('Grey under the stage\'s west end; saffron under its east end, as far apart as the paving allows.'),
    ],
    next: 'joaquin',
  },
  joaquin: {
    lines: [
      act(
        [
          { do: 'look', actor: 'npc:joaquin_muster' },
          { do: 'walk', actor: 'azzy', to: at(17, 13), facing: 'up', async: true },
          { do: 'walk', actor: 'npc:joaquin_muster', to: at(17, 12), facing: 'down' },
        ],
        '',
        'A young man in a black coat stands up from the Free Brasador fire, and comes across the paving. Azzy stops.',
      ),
      say(Z, 'Tío.'),
      say(JQ, 'Azriel. The sergeant said you\'d come back with an army.'),
      act([{ do: 'face', actor: 'npc:joaquin_muster', facing: 'left' }, { do: 'wait', ms: 500 }, { do: 'face', actor: 'npc:joaquin_muster', facing: 'down' }], JQ, 'You brought seven. I brought the strand.'),
      say(Z, 'You came over the wall.'),
      say(JQ, 'After you went. I gave the order. I could hardly stay.'),
      say(JQ, 'Your company, captain. I only carried it.'),
      act([{ do: 'walk', actor: 'npc:fb_sergeant', to: at(18, 13), facing: 'left' }], SG, 'Captain. We held the strand. Now we hold this plaza. Tell us where to stand.'),
      say(Z, 'With the envoy. Where she stands.'),
    ],
    next: 'captains',
  },
  captains: {
    lines: [
      act([{ do: 'look', actor: 'npc:dorini_admiral' }], ADM, 'Envoy. The Merchant-Prince sends her compliments, forty marines and an invoice. The invoice is a formality. The marines are not.'),
      say(ADM, 'Her price is Influence. Ten. Kirinoura\'s files say you paid it in books. We shall see.'),
      say(S, 'He runs my mother\'s convoys. He is the only man she pays on time.'),
      act([{ do: 'place', actor: 'hrafn_c', look: 'hrafn', at: at(30, 20), facing: 'left' }, { do: 'look', actor: 'hrafn_c' }], 'hrafn', 'A fleet that cannot raid is firewood. A fleet that sails for Zetwal is at least a fleet.'),
      act([{ do: 'exit', actor: 'hrafn_c', to: at(PLAZA.westLane.x, PLAZA.westLane.y), async: true }], '', 'Hrafn walks off down the west lane, toward the Iron Market, already shouting about a convoy.'),
      act([{ do: 'place', actor: 'retainer_c', look: 'retainer_neutral', at: at(12, 7), facing: 'down' }, { do: 'look', actor: 'retainer_c' }], 'muster_retainer', 'Kirinoura is neutral. Kirinoura\'s boats are not. It is a distinction we are proud of.'),
      act([{ do: 'place', actor: 'steward_c', look: 'agnivansh_steward', at: at(24, 7), facing: 'down' }, { do: 'look', actor: 'steward_c' }], 'agnivansh_steward', 'The oil is the temple\'s again. We brought enough for one war.'),
      act(
        [
          { do: 'exit', actor: 'retainer_c', to: at(PLAZA.bridgehead.x, PLAZA.bridgehead.y), async: true },
          { do: 'exit', actor: 'steward_c', to: at(PLAZA.bridgehead.x, PLAZA.bridgehead.y + 1) },
        ],
        '',
        'Both go over the Chain Bridge to the Temple island, one after the other, not together.',
      ),
    ],
    next: 'press',
  },
  press: {
    lines: [
      act(
        [
          { do: 'place', actor: 'rider_p', look: 'horn_rider', at: at(16, 9), facing: 'right' },
          { do: 'place', actor: 'marine_p', look: 'dorini_marine', at: at(19, 9), facing: 'left' },
          { do: 'look', actor: 'rider_p' },
        ],
        'lawspeaker_rider',
        'Your convoy paid the steppe\'s toll in horses. We counted them.',
      ),
      say('dorini_marine', 'You counted them twice.'),
      act([{ do: 'walk', actor: 'npc:fb_sergeant', to: at(17, 9), facing: 'down' }], SG, 'Not in the envoy\'s camp.'),
      act(
        [
          { do: 'exit', actor: 'rider_p', to: at(30, 20), async: true },
          { do: 'exit', actor: 'marine_p', to: at(7, 11) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'The rider goes back to the horses, and the marine to the green table. Neither looks round.',
      ),
      say(G, 'The council sits at noon.'),
    ],
  },
});

// ---- Beat 2: the council at noon, and Beat 6: the council's word (the Speaker in the Council Chamber) --------------------

const GATE_LEFT: DialogueLine[] = SEATED_PARTS.map((p) => ({ if: not(p.flag), speaker: SP, text: p.left }));

const COUNCIL: Record<string, DialogueNode> = {
  m_start: {
    lines: [],
    next: [
      { if: not('story.council_condition'), to: 'm_noon' },
      { if: has('story.council_voted'), to: 'm_after' },
      { if: SEATED, to: 'm_vote' },
      { to: 'm_gate' },
    ],
  },
  m_noon: {
    lines: [
      act([{ do: 'look', actor: 'npc:council_speaker' }], SP, 'Order. Order. It is only the envoy, so: order anyway.'),
      say(SP, 'The question on the floor is Zetwal\'s own. Does the state send its ships and its levy to Xaraguá\'s harbor?'),
      act([{ do: 'look', actor: 'npc:elder_dove' }], DOVE, 'Peace has kept Zetwal fed for fifty years. Now the envoy has brought the war home to our plaza.'),
      act([{ do: 'look', actor: 'npc:elder_hawk' }], HAWK, 'The war was always coming. It came to Yucayeque first. Raise the chain, arm the levy, sail.'),
      act([{ do: 'look', actor: 'npc:chancellor' }, { do: 'face', actor: 'npc:chancellor', facing: 'player' }], CH, 'Zetwal\'s envoy went out to make an alliance. Envoy. Have you made one, or three camps that will not share a fire?'),
      say(G, 'I\'ve made seven. They don\'t share a fire yet.'),
    ],
    next: 'm_condition',
  },
  m_condition: {
    lines: [
      say(CH, 'Then seat them. When the Ironvow and the Dorini will drink at one fire.'),
      say(CH, 'When the Suzumori and the Agnivansh will stand on one island.'),
      say(CH, 'When Kingsmere\'s people are trusted by the men the Crown\'s muskets fired on.'),
      say(CH, 'And when the Cane Road is the city\'s again. The cutters say there are Crown crates in the cane,'),
      say(CH, 'and a boy at the mill who will not come home.'),
      say(CH, 'Then this council will vote, and I will put the question to the chair\'s empty arm. I know what she would say.'),
      say(CH, 'Until then Zetwal\'s ships stay tied.', { set: { 'story.council_condition': true } }),
      say(G, 'And the harbor chain?'),
      act([{ do: 'look', actor: 'npc:elder_hawk' }], CH, 'Raised at dusk, whatever you do. The Harbor councillor has been right for a year, and I am tired of saying so.'),
      act([{ do: 'look', actor: 'player' }], '', '(Seat the three feuds, and see to the Cane Road. Your Quests page keeps the count.)'),
    ],
  },
  m_gate: {
    lines: [say(SP, 'The council will vote when the city is seated, envoy. As it stands:'), ...GATE_LEFT, say(A, 'Your Quests page, Gigi.')],
  },
  m_vote: {
    lines: [
      act([{ do: 'look', actor: 'npc:council_speaker' }], SP, 'The envoy\'s camp is seated. The question: does Zetwal sail? Those for, stand.'),
      act([{ do: 'look', actor: 'npc:elder_hawk' }, { do: 'face', actor: 'npc:elder_hawk', facing: 'down' }], '', 'The Harbor councillor is on his feet before the Speaker has finished.'),
      act([{ do: 'look', actor: 'npc:elder_dove' }, { do: 'face', actor: 'npc:elder_dove', facing: 'down' }, { do: 'wait', ms: 600 }, { do: 'face', actor: 'npc:elder_dove', facing: 'up' }, { do: 'wait', ms: 600 }, { do: 'face', actor: 'npc:elder_dove', facing: 'down' }], '', 'The Senior elder stands last; sits again; and stands again.'),
      say(DOVE, 'I will not be the one who kept the fleet tied while Yucayeque burned twice.'),
      act([{ do: 'look', actor: 'npc:chancellor' }], CH, 'Zetwal sails. Its levy, its ships, and the envoy\'s household.'),
      say(CH, 'The chair\'s arm is empty, so I will say what she would have said, and take the blame for it: go.', { set: { 'story.council_voted': true } }),
      say(HAWK, 'A year I asked. They called me a warmonger. Then they built your grandfather a statue, and now they\'re raising his chain.'),
      say(HAWK, 'Nobody will build me one.'),
    ],
    next: 'm_chain',
  },
  m_chain: {
    lines: [
      nar('Far below the Hall, down at the Old Harbor, a capstan\'s ratchet: click, click, click.', { fx: 'ratchet' }),
      nar('The old harbor chain is coming up across the harbor mouth.', { set: { 'story.chain_raised': true } }),
      say(S, 'If I were the Crown, I would buy the cheapest captain on that plaza. Look at your Journal, and tell me who that is.'),
      say(G, 'Then we pay what we owe before dusk.'),
      say(CH, 'Dusk, envoy. Your grandfather has something to blow.'),
    ],
  },
  m_after: { lines: [say(SP, 'The council has voted. Zetwal sails. Order, if anyone is listening.')] },
};

// ---- Beat 3: the watch lands (Jordyn's company walks up onto the plaza: the second review's 3.17) -------------------

const WATCH: DialogueScript = script('muster_watch', {
  start: {
    lines: [
      act(
        [
          { do: 'enter', actor: 'jordyn_w', look: 'jordyn_free', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(14, 14), facing: 'up', async: true },
          { do: 'look', actor: 'jordyn_w' },
          { do: 'wait', ms: 500 },
          { do: 'enter', actor: 'watch_w1', look: 'watch_inside_out', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(13, 15), facing: 'up', async: true },
          { do: 'wait', ms: 300 },
          { do: 'enter', actor: 'watch_w2', look: 'watch_inside_out', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(12, 15), facing: 'up', async: true },
          { do: 'wait', ms: 300 },
          { do: 'enter', actor: 'printer_w', look: 'printer', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(11, 14), facing: 'up' },
        ],
        '',
        'Up the harbor lane, in step: Titi Jordyn, hands behind her back, in the Regent\'s violet turned inside out.',
      ),
      nar('Behind her the watch, coats turned the same way. Then the printer, with ink on his apron.'),
      act(
        [
          { do: 'enter', actor: 'rahel_w', look: 'rahel', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(15, 13), facing: 'up', async: true },
          { do: 'enter', actor: 'patricia_w', look: 'patricia', from: at(PLAZA.harborLane.x - 1, PLAZA.harborLane.y), to: at(16, 14), facing: 'up' },
          { do: 'look', actor: 'rahel_w' },
        ],
        '',
        'Last, two old women, one on the other\'s arm. One is tall and straight, in a black shawl with a Brasador brooch.',
      ),
      nar('The other is small and white-haired, and carries a cane she does not use.'),
    ],
    next: 'azzy',
  },
  azzy: {
    lines: [
      act([{ do: 'walk', actor: 'azzy', to: at(15, 11), facing: 'down', run: true }], '', 'Azzy goes across the paving at a run, and stops a step short.'),
      act([{ do: 'face', actor: 'rahel_w', facing: 'up' }], RA, 'Azriel. Don\'t run at your grandmother. You\'ll knock her flat, and your Titi Jordyn will have to arrest the paving.'),
      act([{ do: 'walk', actor: 'rahel_w', to: at(15, 12), facing: 'up' }, { do: 'wait', ms: 900 }, { do: 'walk', actor: 'rahel_w', to: at(15, 13), facing: 'up' }], '', 'She takes his face in both hands, and looks at it.'),
      say(RA, 'Your father\'s jaw, a soldier\'s name, and from me you got nothing but the temper. Spend it on the Crown.'),
      nar('Azzy, for once, has no answer.'),
    ],
    next: 'envoy',
  },
  envoy: {
    lines: [
      say(RA, 'Which one is the envoy?'),
      say(JO, 'The one in blue, Mother. The small one beside her is the other.'),
      act([{ do: 'face', actor: 'rahel_w', facing: 'player' }, { do: 'wait', ms: 1100 }, { do: 'face', actor: 'rahel_w', facing: 'up' }], '', 'Rahel looks at Gianna for a long moment, and then at Anissa.'),
      say(RA, 'I will come to your grandmother\'s house, if she will have me. Not here. There are things one says in a kitchen.'),
      act([{ do: 'look', actor: 'patricia_w' }], '', 'The small woman looks at the camp once, all of it, and says nothing at all.'),
      act(
        [
          { do: 'exit', actor: 'rahel_w', to: at(6, 7), async: true },
          { do: 'exit', actor: 'patricia_w', to: at(6, 8) },
        ],
        '',
        'The two of them go up the plaza toward the Limyè house, slowly, arm in arm.',
      ),
    ],
    next: 'company',
  },
  company: {
    lines: [
      act([{ do: 'look', actor: 'jordyn_w' }], JO, 'Envoy. Seven of the watch, the five of the barn\'s lot who could walk, and the printer, who is no use in a line and will say so.'),
      say(JO, 'Twelve, with me. We walked to the coast and I found a ship. I did not say how.'),
      say(PR, 'I am no use in a line.'),
    ],
    next: 'edmund',
  },
  edmund: {
    lines: [
      say(JO, 'Mr. Stillwater.'),
      say(ED, 'Captain.'),
      say(JO, 'Not any more.'),
      say(ED, 'Nor I. It\'s rather freeing.'),
    ],
    next: 'law',
  },
  law: {
    lines: [
      say(JO, 'I keep the law where I stand. Tonight I stand in your harbor.'),
      say(JO, 'If anyone in it is bought, I will know. Bought men walk differently.'),
      act(
        [
          { do: 'exit', actor: 'jordyn_w', to: at(PLAZA.jordyn.x, PLAZA.jordyn.y), async: true },
          { do: 'exit', actor: 'watch_w1', to: at(PLAZA.watch[0]!.x, PLAZA.watch[0]!.y), async: true },
          { do: 'exit', actor: 'watch_w2', to: at(PLAZA.watch[1]!.x, PLAZA.watch[1]!.y), async: true },
          { do: 'exit', actor: 'printer_w', to: at(PLAZA.printer.x, PLAZA.printer.y) },
          { do: 'sync' },
          { do: 'look', actor: 'player' },
        ],
        '',
        'They take the plaza\'s south-east corner, by themselves. Nobody sits near them.',
      ),
    ],
  },
});

// ---- Beat 4: the kitchen (the Limyè house) ----------------------------------------------------------------------------

const ACCOUNTS: DialogueLine[] = [
  act([{ do: 'walk', actor: 'npc:anicette', to: at(HOUSE.accounts.x + 1, HOUSE.accounts.y + 1), facing: 'up' }], '', 'Gianna lays three books on the kitchen table: the temple\'s record, the Suzumori ledger, the Crown\'s chronicle.'),
  nar('Grandmother puts her own Volume Two beside them.', { set: { 'clue.four_accounts': true } }),
  act([{ do: 'sync' }], AN, 'Four. Four hundred dead at the ford, says the Crown\'s. Forty, say the other three.'),
  act([{ do: 'wait', ms: 700 }], '', 'She opens the chronicle at its fly-leaf, and touches the clerk\'s note: Written to order.'),
  say(AN, 'So you found the clerk.'),
  say(G, 'He wrote it large because they asked him to.'),
  say(AN, 'Then you have all four, and you know which one to read aloud at the Hearing.'),
];

const KITCHEN: DialogueScript = script('muster_kitchen', {
  start: {
    lines: [
      act([{ do: 'walk', actor: 'npc:anicette', to: at(HOUSE.anicette.x, HOUSE.anicette.y), facing: 'left' }], '', 'Grandmother has the kitchen table laid for the envoy\'s guests, and is pretending she did not know who was coming.', { fx: 'fade' }),
      act(
        [
          { do: 'enter', actor: 'rahel_k', look: 'rahel', from: at(HOUSE.door.x + 1, HOUSE.door.y), to: at(HOUSE.rahelSeat.x, HOUSE.rahelSeat.y + 1), facing: 'up' },
          { do: 'face', actor: 'npc:anicette', facing: 'left' },
          { do: 'face', actor: 'rahel_k', facing: 'right' },
        ],
        '',
        'Rahel comes in, and the two women look at each other across the table.',
      ),
      say(AN, 'Madame.'),
      say(RA, 'Madame.'),
      say(AN, 'You had the Marshal\'s whole camp crying over Benny\'s peppers in the year of the Accord.'),
      say(RA, 'They were my peppers. Benny only carried them.'),
      act([{ do: 'walk', actor: 'rahel_k', to: at(HOUSE.rahelSeat.x, HOUSE.rahelSeat.y), facing: 'right' }], '', 'They sit. Nothing else is said about the year of the Accord.'),
    ],
    next: 'anissa',
  },
  anissa: {
    lines: [
      say(RA, 'Come and sit by me. Not you, envoy: her.'),
      act([{ do: 'walk', actor: 'follower', to: at(HOUSE.rahelSeat.x + 1, HOUSE.rahelSeat.y + 1), facing: 'left' }], RA, 'They tell me you glow. I have five children, and not one of them glows. I would have liked one that did.'),
      say(A, 'It\'s only sometimes.'),
      say(RA, 'The best things are.'),
    ],
    next: 'envoy',
  },
  envoy: {
    lines: [
      act([{ do: 'face', actor: 'rahel_k', facing: 'player' }], RA, 'You went into Kingsmere\'s keep and came out through its court. My Jordyn says you were arrested by the book.'),
      say(RA, 'That is the only compliment she has ever paid anyone.'),
      say(RA, 'My son does not explain himself. He never did. I stopped asking him to when he was nine.'),
      say(G, 'He sold Xaraguá.'),
      say(RA, 'So they say.'),
      act([{ do: 'wait', ms: 800 }], '', 'She puts a paper crane on the table between them.'),
      say(RA, 'From Kirinoura\'s archive, unsigned. My Kayla sends it. She says she is a clerk, and clerks do not come to musters.'),
      act([{ do: 'exit', actor: 'rahel_k', to: at(HOUSE.door.x, HOUSE.door.y + 1) }], '', 'Rahel goes out, to find her mother. They are going over to the Temple island, to look at the lamp.'),
    ],
    next: [{ if: THREE_ACCOUNTS, to: 'accounts' }, { to: 'not_yet' }],
  },
  accounts: { lines: ACCOUNTS },
  not_yet: {
    lines: [
      say(AN, 'When you have read all four, come and tell me which one lies.'),
      say(AN, 'The temple\'s, the Suzumori ledger, the Crown\'s own chronicle. And mine.'),
    ],
  },
});

// ---- Beat 5: Patricia's blessing at the Gaze lamp; the Marshal's answer at the stone -----------------------------------

const PATRICIA: DialogueScript = script('patricia_talk', {
  start: {
    lines: [],
    next: [
      { if: all(has('story.rahel_met'), not('story.blessing')), to: 'blessing' },
      { if: has('story.betrayal_seen'), to: 'dawn' },
      { if: DUSK, to: 'dusk' },
      { to: 'after' },
    ],
  },
  blessing: {
    lines: [
      act([{ do: 'look', actor: 'npc:patricia' }, { do: 'face', actor: 'npc:patricia', facing: 'down' }], PA, 'The three of you. One at a time. I am old, and I like to look at things one at a time.'),
      act([{ do: 'walk', actor: 'azzy', to: at(TEMPLE.patricia.x, TEMPLE.patricia.y + 1), facing: 'up' }], PA, 'Azriel Rodriguez. You fired on nobody, and you were fired on by family. That is the whole of this war in one boy.'),
      say(PA, 'Go and finish it.'),
      act([{ do: 'walk', actor: 'azzy', to: at(TEMPLE.patricia.x - 2, TEMPLE.patricia.y + 2), facing: 'up' }, { do: 'face', actor: 'npc:patricia', facing: 'player' }], PA, 'Gianna Elise. You count everything twice. So do I.'),
      say(PA, 'Count them at dusk. Harbors lie.'),
    ],
    next: 'name',
  },
  name: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(TEMPLE.patricia.x, TEMPLE.patricia.y + 1), facing: 'up' }, { do: 'face', actor: 'npc:patricia', facing: 'down' }], PA, 'And who are you, child? Say it. I\'m old; I like to hear names said.'),
      say(A, 'Anissa. I hold the door.'),
      say(PA, 'Then hold it.'),
      act(
        [
          { do: 'face', actor: 'npc:patricia', facing: 'down' },
          { do: 'wait', ms: 700 },
          { do: 'face', actor: 'npc:patricia', facing: 'player' },
          { do: 'wait', ms: 700 },
          { do: 'face', actor: 'npc:patricia', facing: 'left' },
          { do: 'wait', ms: 700 },
        ],
        '',
        'She puts her hand on each head in turn, by the lamp where Anissa woke.',
        { set: { 'story.blessing': true } },
      ),
    ],
  },
  dusk: { lines: [say(PA, 'Count them.')] },
  dawn: { lines: [say(PA, 'Hold it, child. All the way across.')] },
  after: { lines: [say(PA, 'Go on. The lamp and I have things to look at.')] },
});

const RAHEL: DialogueScript = script('rahel_talk', {
  start: {
    lines: [],
    next: [{ if: has('story.betrayal_seen'), to: 'dawn' }, { if: DUSK, to: 'dusk' }, { if: has('story.rahel_met'), to: 'lamp' }, { to: 'plaza' }],
  },
  plaza: { lines: [say(RA, 'In a kitchen, envoy. Not here.')] },
  lamp: { lines: [say(RA, 'My mother wanted to see the lamp. She has seen it. Now she is looking at it.')] },
  dusk: { lines: [say(RA, 'Seven lines. In my day it was two, and nobody could stand still in either.')] },
  dawn: { lines: [say(RA, 'Go on. Ships do not wait for grandmothers.')] },
});

/** Old Patricio at the Muster: the quay, the stone (the seventh page), the stage at dusk (the whistle), the pier at dawn. */
const PATRICIO: DialogueScript = script('patricio_muster_talk', {
  start: {
    lines: [],
    next: [
      { if: has('story.betrayal_seen'), to: 'dawn' },
      { if: DUSK, to: 'inspection' },
      { if: all(has('story.blessing'), not('story.patricio_told')), to: 'stone' },
      { if: has('story.patricio_told'), to: 'told' },
      { to: 'quay' },
    ],
  },
  quay: { lines: [say(PO, 'The council sits at noon. Seat them, envoy.')] },
  stone: {
    lines: [
      act([{ do: 'look', actor: 'npc:patricio_muster' }], '', 'Gianna shows him Thomas Stillwater\'s true record, and the court\'s roll: Xaraguá, not present. Not sent for.'),
      act([{ do: 'wait', ms: 1200 }], PO, 'Six pages. I counted them. I sealed what I counted.'),
      say(PO, 'And they read the seventh to their own clerk in the next room, with Benny shouting at the door.'),
      { if: { flag: 'choice.patricio_protest', eq: 'time' }, speaker: PO, text: 'I said "under protest of time." I should have said "under protest."' },
      { if: { flag: 'choice.patricio_protest', eq: 'unread' }, speaker: PO, text: 'I had them write that I did not read it. It was the only true thing on the page.' },
      say(PO, 'I would remember. I did remember. I remembered the wrong thing.'),
      act([{ do: 'walk', actor: 'npc:patricio_muster', to: at(PLAZA.stone.x, PLAZA.stone.y + 1), facing: 'up' }, { do: 'wait', ms: 900 }], '', 'He puts his hand on the stone, on the blank line under the sixth clause.'),
      say(PO, 'Leave it blank. Blank is honest. Someone will carve it when there is something true to carve.', { set: { 'story.patricio_told': true } }),
      act([{ do: 'walk', actor: 'npc:patricio_muster', to: at(PLAZA.patricioStone.x, PLAZA.patricioStone.y), facing: 'right' }], PO, 'I lit that lamp for fifty years, and never once asked it what it remembered.'),
    ],
  },
  told: { lines: [say(PO, 'Blank is honest. Go and seat them.')] },
  inspection: {
    lines: [
      nar('Dusk on the plaza. The lanterns are lit. Seven companies stand in lines across the paving, as Patricia said: count them.', { fx: 'fade' }),
      act(
        [
          { do: 'look', actor: 'npc:patricio_muster' },
          { do: 'walk', actor: 'npc:patricio_muster', to: at(PLAZA.stageFoot.x, PLAZA.fountainEdge.y - 1), facing: 'down' },
          { do: 'wait', ms: 700 },
          { do: 'face', actor: 'npc:patricio_muster', facing: 'left' },
          { do: 'wait', ms: 700 },
          { do: 'face', actor: 'npc:patricio_muster', facing: 'right' },
          { do: 'wait', ms: 700 },
          { do: 'walk', actor: 'npc:patricio_muster', to: at(PLAZA.stageFoot.x, PLAZA.stageFoot.y), facing: 'down' },
        ],
        '',
        'Old Patricio walks the lines with his cane, slowly, and looks at every face once. At the stage he turns.',
      ),
      act([{ do: 'face', actor: 'npc:patricio_muster', facing: 'down' }], '', 'He puts the brass whistle to his mouth. Two notes: high, and low.', { fx: 'whistle' }),
      act([{ do: 'face', actor: 'npc:line_zetwal', facing: 'up' }, { do: 'look', actor: 'npc:line_zetwal' }], '', 'Zetwal\'s levy answers it, every man and woman, and a drum on the stage with them. Nobody else moves.'),
      say(PO, 'Every company in Zetwal knew that note. Now the other six will.'),
    ],
    next: 'second',
  },
  second: {
    lines: [
      act([{ do: 'look', actor: 'npc:patricio_muster' }], '', 'He blows it again.', { fx: 'whistle' }),
      act([{ do: 'walk', actor: 'azzy', to: at(PLAZA.joaquinLine.x + 1, PLAZA.joaquinLine.y + 1), facing: 'up', run: true }, { do: 'look', actor: 'azzy' }], Z, '¡Firmes!'),
      act([{ do: 'face', actor: 'npc:joaquin_muster', facing: 'up' }, { do: 'face', actor: 'npc:line_free_brasador', facing: 'up' }], '', 'Free Brasador come to it as one, Joaquin beside his nephew in the line.'),
      act([{ do: 'look', actor: 'npc:hrafn_line' }, { do: 'face', actor: 'npc:hrafn_line', facing: 'up' }], '', 'Hrafn lifts the horse-tail standard.'),
      act([{ do: 'look', actor: 'npc:agnivansh_steward_line' }, { do: 'face', actor: 'npc:agnivansh_steward_line', facing: 'up' }], '', 'The Agnivansh steward lifts the brass lamp.'),
      act([{ do: 'look', actor: 'npc:muster_retainer_line' }, { do: 'face', actor: 'npc:muster_retainer_line', facing: 'up' }], '', 'The Suzumori retainer closes his fan.'),
      act([{ do: 'look', actor: 'npc:dorini_admiral_line' }, { do: 'face', actor: 'npc:dorini_admiral_line', facing: 'up' }], '', 'The Dorini admiral closes his ledger.'),
      act([{ do: 'look', actor: 'npc:jordyn_muster' }], JO, 'Watch!'),
      act([{ do: 'face', actor: 'npc:line_aldermoor', facing: 'up' }, { do: 'look', actor: 'player' }], '', 'And the violet coats come to it, the fewest of all.'),
      say(Z, 'He said someone in Zetwal would always remember it. He didn\'t say it would be everyone.'),
    ],
    next: 'anissa',
  },
  anissa: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(PLAZA.fountainEdge.x, PLAZA.fountainEdge.y), facing: 'up' }, { do: 'look', actor: 'player' }, { do: 'wait', ms: 800 }], '', 'Anissa walks out to the fountain\'s rim, where all seven lines can see her, and stands on it.'),
      say(A, 'Anissa. I hold the door. Hold yours.'),
      act([{ do: 'wait', ms: 1200 }], '', 'Nobody laughs. In the Ironvow line a rider puts his fist to his chest, and down the lines, one by one, the others do.'),
    ],
    next: 'speech',
  },
  speech: {
    lines: [
      act([{ do: 'walk', actor: 'npc:patricio_muster', to: at(PLAZA.stageFoot.x, PLAZA.stageFoot.y + 1), facing: 'down' }], '', 'Grandfather gives Gianna the whistle back, and closes her hand on it.', {
        set: { 'item.marshal_whistle': true, 'story.whistle_lent': false },
      }),
      say(PO, 'Blow it at Xaraguá. Somebody will answer. They always have.'),
      say(PO, 'Fifty years ago two armies stood on this ground, and the Crown signed six clauses and hid a seventh.'),
      say(PO, 'Tomorrow seven sail to take back what the seventh took. I will not be on the ships. I was. Go and be.'),
    ],
    next: 'count',
  },
  count: {
    lines: [
      act([{ do: 'walk', actor: 'haru', to: at(PLAZA.fountainEdge.x + 1, PLAZA.fountainEdge.y), facing: 'up' }, { do: 'wait', ms: 600 }], '', 'Anissa, on the fountain\'s rim, counts the lines under her breath. Haru stands beside her.'),
      say(H, 'Seven. I counted too.'),
      say(A, 'Eight. You didn\'t count us.'),
      say(H, '...Eight.', { set: { 'story.inspection_done': true, 'muster.resolve': true } }),
      act([{ do: 'look', actor: 'player' }], '', 'The lines break up and go back to their fires. The fires are banked for the night.', { fx: 'fade' }),
    ],
  },
  dawn: {
    lines: [
      say(PO, 'Marshals muster. Captains sail. I have done the half I\'m fit for.'),
      say(PO, 'I asked the keeper on the Heights to light the old fire. For Xaraguá. So they know we\'re coming.'),
    ],
  },
});


// ---- Beat 8: under the point (the night: written once, from the house table; the second review's section 7) -----------

/** The captain's line to the consul, in the register his chapter gave him (the outline beat 8). */
const PURCHASE: Readonly<Record<string, string>> = {
  skarragol: 'A fleet that sails for the highest bidder is at least a fleet.',
  kuroshi: 'Neutrality has a price. The Throne has met it.',
  jwaladesh: 'The oil was always the Throne\'s. So is the flame, it seems.',
  al_doria: 'The Merchant-Prince was not consulted. The guild was. I am the guild\'s.',
};
/** The companion of that house, defying it a second time (STORY 6.9; the outline 9.4). Never in a node with Anissa's line. */
const DEFIANCE: Readonly<Record<string, string>> = {
  skarragol: 'You sold my grandmother\'s ships twice, Hrafn. The Moot wrote the first down as shameful. I\'ll write the second.',
  kuroshi: 'Retainer. You ordered us neutral, and sold the files that made it a lie. I was definitely not a spy. You definitely were.',
  jwaladesh: 'Steward. You hid the flame from the city and sold it to the Crown for oil. I\'m out of breath, and still arguing.',
  al_doria: 'You run my mother\'s convoys, and you\'ve just sold her guild. I\'ll price that for you. It\'s everything.',
};
/** The house's people: what the captain is called, and his company's ship. */
const CAPTAIN_NAME: Readonly<Record<string, string>> = {
  skarragol: 'Hrafn',
  kuroshi: 'The Suzumori retainer',
  jwaladesh: 'The Agnivansh steward',
  al_doria: 'The Dorini admiral',
};

function nightWalk(h: MusterHouse): DialogueNode {
  const from = PLAZA.captains[h.house]!;
  return {
    lines: [
      act(
        [
          { do: 'place', actor: 'walker', look: h.captainLook, at: from, facing: 'down' },
          { do: 'look', actor: 'walker' },
          { do: 'wait', ms: 600 },
          { do: 'exit', actor: 'walker', to: at(PLAZA.harborLane.x, PLAZA.harborLane.y) },
          { do: 'look', actor: 'player' },
        ],
        '',
        `${CAPTAIN_NAME[h.house]} leaves his company's fire, alone, with a satchel on his shoulder, and goes down the lane to the harbor.`,
      ),
      say(G, 'Jordyn said bought men walk differently.'),
      say(Z, 'He\'s walking like a man who has somewhere to be.'),
      say(G, 'Then we\'ll be there too.'),
    ],
  };
}

const NIGHT_WALK: DialogueScript = script('muster_night_walk', {
  start: {
    lines: [nar('Night on the plaza. The fires are banked, and the lines have gone back to their camps.', { fx: 'fade' })],
    next: MUSTER_HOUSES.map((h) => ({ if: has(`muster.betrayer.${h.house}`), to: h.house })),
  },
  ...Object.fromEntries(MUSTER_HOUSES.map((h) => [h.house, nightWalk(h)])),
});

function nightNodes(h: MusterHouse): Record<string, DialogueNode> {
  const k = h.house;
  const cap = `npc:${h.captain}_quay`;
  const ship = HARBOR.ships[h.ship]!;
  const capAt = HARBOR.captain;
  const companionIs = (who: string) => h.companion === who;
  return {
    [k]: {
      lines: [
        act([{ do: 'look', actor: 'npc:consul_night' }], '', 'Under the point, outside the raised chain, a launch rides with its lights out.'),
        nar('On the quay above it: the Crown\'s consul, in a good coat, with a strongbox.'),
        act([{ do: 'look', actor: cap }], '', `${CAPTAIN_NAME[k]} sets his satchel down on the stones in front of him.`),
        say(CON, 'The Throne\'s compliments. The balance on sailing, the rest on the harbor.', { set: { 'muster.strongbox_open': true } }),
        act(
          [
            { do: 'sync' },
            { do: 'walk', actor: cap, to: at(capAt.x, capAt.y - 1), facing: 'left' },
            { do: 'wait', ms: 700 },
            { do: 'walk', actor: cap, to: at(capAt.x, capAt.y), facing: 'left' },
          ],
          '',
          'The consul opens the box. The captain takes a purse out of it, and a folded paper from the consul\'s hand.',
        ),
        say(h.captain, PURCHASE[k]!),
        act([{ do: 'face', actor: cap, facing: 'player' }], h.captain, 'Envoy. You paid us less than you paid the others. You know you did; your Journal says so. The Throne paid the difference.'),
        nar('His satchel lies open on the quay. On its flap, pressed in ash: a closed hand. The mark beside one name on Kayla\'s list.'),
        say(h.captain, 'It will be quieter soon.'),
        say(H, 'That\'s what they say on the plaza.'),
      ],
      next: [{ if: has('muster.exposed_possible'), to: `${k}_expose` }, { to: `${k}_sail` }],
    },
    [`${k}_expose`]: {
      lines: [say(G, 'Captain.')],
      choices: [
        { text: 'Lay the buyer\'s list on the quay.', next: `${k}_list` },
        { text: 'Let him go.', next: `${k}_sail` },
      ],
    },
    [`${k}_list`]: {
      lines: [nar('Gianna lays Kayla\'s list on the stones: four prices, every name cut away, and a closed hand beside one.')],
      choices: [{ text: 'Lay the smugglers\' ledger beside it.', next: `${k}_ledger` }],
    },
    [`${k}_ledger`]: {
      lines: [
        nar('And beside it, the ledger from the mangroves: muskets for the Muster\'s friends, under the same closed hand.'),
        nar('And in its margin, the house\'s sigil.', { set: { 'muster.evidence_laid': true } }),
        act([{ do: 'sync' }], G, 'Kirinoura\'s files named the mark and cut out the name. The cane\'s smugglers wrote it back in.'),
        say(G, 'Your sigil, Captain, on the Crown\'s muskets, in a Zetwal field.'),
      ],
      next: `${k}_turn`,
    },
    [`${k}_turn`]: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'second', look: h.secondLook, from: at(20, HARBOR.roadRow), to: at(capAt.x + 2, capAt.y - 1), facing: 'left' },
            { do: 'look', actor: 'second' },
          ],
          '',
          'Someone comes down the harbor road behind the party, quickly: the house\'s own second.',
        ),
        act([{ do: 'walk', actor: h.companion, to: at(capAt.x + 1, capAt.y), facing: 'left' }], h.companion, DEFIANCE[k]!),
        say(h.second, 'The house sails with the envoy. The captain sails with nobody.'),
        ...(companionIs('bayarmaa') ? [act([{ do: 'walk', actor: 'bayarmaa', to: at(capAt.x + 2, capAt.y), facing: 'up' }], '', 'Bayarmaa takes the horse-tail standard from the rider, and holds it.')] : []),
      ],
      next: `${k}_arrest`,
    },
    [`${k}_arrest`]: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'jordyn_n', look: 'jordyn_free', from: at(20, HARBOR.roadRow), to: at(capAt.x + 1, capAt.y - 1), facing: 'left', async: true },
            { do: 'enter', actor: 'watch_n1', look: 'watch_inside_out', from: at(21, HARBOR.roadRow), to: at(capAt.x + 2, capAt.y + 1), facing: 'left', async: true },
            { do: 'enter', actor: 'watch_n2', look: 'watch_inside_out', from: at(22, HARBOR.roadRow), to: at(capAt.x + 3, capAt.y + 1), facing: 'left' },
            { do: 'look', actor: 'jordyn_n' },
          ],
          JO,
          'Captain of nothing. Under arrest, for the Crown\'s gold in a free harbor.',
        ),
        say(JO, 'There\'s a Hall up the hill with a cell in it, I\'m told.', { set: { 'muster.turned': true, 'muster.captain_gone': true } }),
        act(
          [
            { do: 'sync' },
            { do: 'place', actor: 'captain_led', look: h.captainLook, at: capAt, facing: 'right' },
            { do: 'exit', actor: 'captain_led', to: at(20, HARBOR.roadRow), async: true },
            { do: 'exit', actor: 'jordyn_n', to: at(20, HARBOR.roadRow), async: true },
            { do: 'exit', actor: 'watch_n1', to: at(21, HARBOR.roadRow), async: true },
            { do: 'exit', actor: 'watch_n2', to: at(22, HARBOR.roadRow), async: true },
            { do: 'exit', actor: 'second', to: at(23, HARBOR.roadRow) },
          ],
          '',
          'The watch walks him up the road between them, by the book. The second goes back to tell the house.',
        ),
        act([{ do: 'walk', actor: 'npc:consul_night', to: at(HARBOR.launch.x + 1, HARBOR.launch.y), facing: 'left' }], CON, 'Truly a pity. Good evening, envoy.', { set: { 'muster.launch_gone': true } }),
        act([{ do: 'sync' }, { do: 'look', actor: 'player' }], '', 'The consul steps down into his launch alone, and it pulls out under the point, dark.'),
      ],
      next: 'seen',
    },
    [`${k}_sail`]: {
      lines: [
        say(h.captain, 'You have papers. I have a company and a ship, and the Throne has a fleet. Keep the papers.', { set: { 'muster.captain_gone': true } }),
        act(
          [
            { do: 'sync' },
            { do: 'place', actor: 'captain_b', look: h.captainLook, at: capAt, facing: 'left' },
            { do: 'exit', actor: 'captain_b', to: at(HARBOR.launch.x + 1, HARBOR.launch.y) },
            { do: 'walk', actor: 'npc:consul_night', to: at(HARBOR.launch.x + 1, HARBOR.launch.y), facing: 'left' },
          ],
          '',
          'He steps down into the launch, and the consul after him.',
          { set: { 'muster.launch_gone': true } },
        ),
        act([{ do: 'sync' }], '', 'The launch pulls out under the point with its lights out.'),
        act(
          [
            { do: 'enter', actor: 'company_1', look: h.look, from: at(HARBOR.plazaDoor.x, HARBOR.plazaDoor.y), to: at(ship.x + 1, HARBOR.roadRow), async: true },
            { do: 'wait', ms: 400 },
            { do: 'enter', actor: 'company_2', look: h.look, from: at(HARBOR.plazaDoor.x, HARBOR.plazaDoor.y), to: at(ship.x + 2, HARBOR.roadRow), async: true },
            { do: 'wait', ms: 400 },
            { do: 'enter', actor: 'company_3', look: h.look, from: at(HARBOR.plazaDoor.x, HARBOR.plazaDoor.y), to: at(ship.x, HARBOR.roadRow) },
            { do: 'look', actor: 'company_1' },
            { do: 'exit', actor: 'company_1', to: at(ship.x + 1, ship.y - 1), async: true },
            { do: 'exit', actor: 'company_2', to: at(ship.x + 2, ship.y - 1), async: true },
            { do: 'exit', actor: 'company_3', to: at(ship.x, ship.y - 1) },
          ],
          '',
          'His company comes down from the plaza in the dark, past the party without a word, along the harbor road and down to its ship.',
          { set: { [`muster.gone.${k}`]: true, 'muster.betrayed': true } },
        ),
        act([{ do: 'sync' }, { do: 'look', actor: 'player' }], '', 'Their hull slips its lines and follows the launch out under the point.'),
        act([{ do: 'look', actor: h.companion }], h.companion, DEFIANCE[k]!),
        say(h.companion, 'I\'m not going with them.'),
      ],
      next: 'seen',
    },
  };
}

const NIGHT_QUAY: DialogueScript = script('night_quay', {
  start: {
    lines: [],
    next: MUSTER_HOUSES.map((h) => ({ if: has(`muster.betrayer.${h.house}`), to: h.house })),
  },
  ...Object.fromEntries(MUSTER_HOUSES.flatMap((h) => Object.entries(nightNodes(h)))),
  seen: {
    lines: [
      act([{ do: 'face', actor: 'follower', facing: 'player' }, { do: 'look', actor: 'player' }, { do: 'wait', ms: 700 }], A, 'He walked like the lady with the basket, Gigi. Like he already knew where he was going.'),
      say(G, 'Yes. I saw it too.'),
    ],
    next: 'fire',
  },
  fire: {
    lines: [
      act([{ do: 'look', actor: 'npc:old_sailor' }], 'old_sailor', 'Look. The Heights.'),
      nar('High over the city, on Solèy Heights, the old signal fire catches, and burns up against the dark. Somebody asked.', { set: { 'story.betrayal_seen': true } }),
      act([{ do: 'sync' }, { do: 'look', actor: 'player' }], '', 'The night goes over. Dawn comes up across the reef.', { fx: 'fade' }),
    ],
  },
});

const CAPTAIN_QUAY: DialogueScript = simple('captain_quay_talk', [nar('He does not look at you. He is looking at the launch.')]);

// ---- Beat 9: the tide ---------------------------------------------------------------------------------------------------

const TIDE: DialogueScript = script('muster_tide', {
  start: {
    lines: [
      nar('Dawn on the Old Harbor. The chain is down. The hulls are warped out in a line inside the harbor mouth, waiting.'),
      act(
        [
          { do: 'enter', actor: 'levy_1', look: 'zetwal_levy', from: at(HARBOR.plazaDoor.x, HARBOR.plazaDoor.y), to: at(32, 10), async: true },
          { do: 'wait', ms: 400 },
          { do: 'enter', actor: 'levy_2', look: 'zetwal_levy', from: at(HARBOR.plazaDoor.x, HARBOR.plazaDoor.y), to: at(33, 10) },
          { do: 'exit', actor: 'levy_1', to: at(33, 12), async: true },
          { do: 'exit', actor: 'levy_2', to: at(34, 12) },
        ],
        '',
        'Zetwal\'s levy goes aboard in file, up the gangways at the long pier.',
      ),
      { if: has('anchor.mill_bar'), speaker: 'levy', text: 'The cellar\'s bar wouldn\'t lift, envoy. Fifty years of rust. The forge sent a saw. The muskets are aboard.' },
      act(
        [
          { do: 'enter', actor: 'printer_t', look: 'printer', from: at(20, HARBOR.roadRow), to: at(25, 9), facing: 'right' },
          { do: 'look', actor: 'printer_t' },
        ],
        PR,
        'I\'m not coming. I\'ve a press to set. Every door in this city, by noon.',
      ),
      act([{ do: 'exit', actor: 'printer_t', to: at(20, HARBOR.roadRow) }], JQ, 'After you, captain.'),
    ],
    next: 'family',
  },
  family: {
    lines: [
      act([{ do: 'look', actor: 'npc:rahel' }], RA, 'Azriel. Come back with the temper used up.'),
      act([{ do: 'walk', actor: 'npc:rahel', to: at(31, 11), facing: 'down' }, { do: 'wait', ms: 900 }], '', 'Rahel puts a hand on Gianna\'s shoulder, and says nothing.'),
      act([{ do: 'look', actor: 'npc:jordyn_muster' }], JO, 'You held a door for an hour in a keep. Hold the rail.'),
      act([{ do: 'look', actor: 'npc:patricia' }], PA, 'Hold it, child. All the way across.'),
      act([{ do: 'look', actor: 'npc:patricio_muster' }], PO, 'Marshals muster. Captains sail. I have done the half I\'m fit for.'),
      say(PO, 'I asked the keeper on the Heights to light the old fire. For Xaraguá. So they know we\'re coming.'),
      act([{ do: 'look', actor: 'npc:anicette_muster' }], AN, 'For the water. Eat it before the hutia does.', { set: { 'item.anicette_kasav': 3 } }),
    ],
    next: 'salkhi',
  },
  salkhi: {
    lines: [
      act([{ do: 'look', actor: 'npc:trader_muster' }], 'trader_captain', 'Head of the fleet, envoy. I said I wanted to see how it ends.'),
      say(SK, 'A ship. Again. I had grass for one day.'),
      act([{ do: 'look', actor: 'player' }], '', 'Out past the reefs with every shore that spoke for them, and down the strait to the harbor the seventh clause took.', {
        fx: 'fade',
        set: { 'act10.complete': true, 'story.fleet_sailed': true, 'travel.next': 'xaragua-beach/landing', 'voyage.next': 'zetwal_xaragua_war' },
      }),
    ],
  },
});

// ---- Z-6, Muskets in the Cane (the outline 7.1; the Echo puzzle M-ZET-2 with the second review's 3.12) ---------------------

const CREW: DialogueScript = script('mangrove_crew', {
  start: { lines: [], next: [{ if: has('story.crew_seen'), to: 'again' }, { to: 'first' }] },
  first: {
    lines: [
      act([{ do: 'look', actor: 'npc:crew_chief_npc' }], '', 'At the smugglers\' landing, a crew stands in front of a stack of Crown crates.'),
      nar('A chief in a red cap, a smuggler, and two lookouts in the mangroves\' edge.'),
      say('crew_chief', 'You saw cane. Say it.'),
      say(G, 'I saw Crown muskets, in a Zetwal field.'),
      say(BY, 'Put your best blades up front. Grandmother always did.', { set: { 'story.crew_seen': true, 'battle.next': 'mangrove_crew', 'battle.after': 'crew_after' } }),
    ],
  },
  again: {
    lines: [
      act([{ do: 'look', actor: 'npc:crew_chief_npc' }], 'crew_chief', 'Back again? You saw cane.'),
      say(BY, 'Best blades up front.', { set: { 'battle.next': 'mangrove_crew', 'battle.after': 'crew_after' } }),
    ],
  },
});

const CREW_AFTER: DialogueScript = script('crew_after', {
  start: {
    lines: [
      act([{ do: 'look', actor: 'npc:crew_chief_down' }], '', 'The crew is gone into the mangroves. The chief sits on the sand by his crates, his cap in his hands.'),
      say('crew_chief', 'We were paid to carry, not to die. Keep the cellar. Keep the cane.'),
    ],
    choices: [
      {
        text: '"Go. Tell them Zetwal reads."',
        set: { 'choice.crew_spared': true },
        next: 'ledger',
      },
      {
        text: 'Walk him up the Cane Road.',
        set: { 'choice.crew_broken': true },
        next: 'walked',
      },
    ],
  },
  walked: {
    lines: [
      say(BY, 'Up the road, past the cutters, and past the Ironvow horses. Let them look at him.'),
      nar('He goes up the Cane Road between two cutters with their blades on their shoulders. Nobody touches him. Everybody looks.'),
    ],
    next: 'ledger',
  },
  ledger: {
    lines: [
      act([{ do: 'exit', actor: 'npc:crew_chief_down', to: at(ROAD.gate.x + 2, ROAD.gate.y) }], '', 'In the top crate, under the muskets: a carter\'s ledger.', { set: { 'item.smugglers_ledger': true } }),
      nar('Consignments of muskets "for the Muster\'s friends", night after night, each under a closed hand.'),
      nar('Beside the last, a sigil is drawn in the margin: a sigil you will know when you see it on a banner.'),
      say(H, 'The closed hand again. Kayla\'s list named the mark and cut the name out. This one drew it.'),
      nar('The last line: "Second cache under the mill. Collect on sailing."'),
      say(G, 'Under the mill.'),
    ],
  },
});

const MILL_CLOSED: DialogueScript = simple('mill_cellar_closed', [nar('A cellar door in the burned mill\'s wall, chained from the inside. Nobody has had a reason to open it.')]);

const MILL_ECHO_ENTER: DialogueScript = script('mill_echo_enter', {
  start: { lines: [], next: [{ if: has('anchor.mill_bar'), to: 'again' }, { to: 'first' }] },
  first: {
    lines: [
      nar('The cellar fifty years ago: the Revolution\'s powder store, kegs to the ceiling, and a lantern behind glass.'),
      say(AF, 'I\'m holding the door, Gigi.'),
      act([{ do: 'look', actor: 'npc:powder_master' }], 'powder_master', 'Marshal. Bar it and pin it when you go. Powder doesn\'t need visitors.'),
      say('powder_master', 'Caona\'s scouts are asleep on the sacks upstairs.'),
      say('powder_master', 'Benny\'s people are sleeping on the powder. He says it\'s the warmest room in Zetwal.'),
    ],
  },
  again: { lines: [say(AF, 'I\'m holding the door, Gigi.')] },
});

const MILL_BAR_ECHO: DialogueScript = script('mill_bar_echo', {
  start: { lines: [], next: [{ if: has('anchor.mill_bar'), to: 'done' }, { to: 'bar' }] },
  bar: {
    lines: [nar('The inner door of the powder store, oak, with a heavy bar in brackets beside it, and an iron pin on a chain.')],
    choices: [{ text: 'Drop the bar, drive the pin.', next: 'drop' }, { text: 'Leave it.' }],
  },
  drop: {
    lines: [
      nar('The bar drops into its brackets with a sound like a shut book.'),
      nar('The pin goes through bar and bracket, and Patricio hammers it flat.', { set: { 'anchor.mill_bar': true } }),
      say('powder_master', 'There. Nobody\'s getting at that without a saw, Marshal. Not in fifty years.'),
    ],
  },
  done: { lines: [nar('Barred and pinned.')] },
});

const MILL_ECHO_RETURN: DialogueScript = script('mill_echo_return', {
  start: { lines: [], next: [{ if: all(has('anchor.mill_bar'), not('side.muskets.done')), to: 'barred' }, { to: 'quiet' }] },
  barred: {
    lines: [
      nar('Back in the cellar. The inner door is shut: the oak bar across it, fifty years black, the pin rusted into its bracket.'),
      act([{ do: 'walk', actor: 'follower', to: at(MILL.spawn.x, MILL.spawn.y - 1), facing: 'up' }], A, 'They can\'t get at them now, Gigi. Only us.', { set: { 'side.muskets.done': true } }),
      say(G, 'The levy can bring a saw at dawn.'),
    ],
  },
  quiet: { lines: [] , next: [{ if: not('anchor.mill_bar'), to: 'open' }] },
  open: { lines: [nar('Back in the cellar. The inner door still hangs open on the cache.')] },
});

const MILL_DOOR_OPEN: DialogueScript = script('mill_door_open', {
  start: {
    lines: [
      nar('The inner door hangs open on one hinge. Behind it: muskets in Crown crates, stacked to the roof.'),
      nar('There are brackets for a bar on this side of it, and no bar.'),
    ],
    choices: [{ text: 'Pull the door shut.', next: 'pull' }, { text: 'Leave it.' }],
  },
  pull: { lines: [nar('It swings open again. Nothing here would hold it now.'), say(A, 'The floor\'s shimmering, Gigi.')] },
});

const MILL_DOOR_BARRED: DialogueScript = simple('mill_door_barred', [
  nar('Fifty years of rust have welded the oak bar into its brackets. Crowbar marks all over it: somebody tried, last night.'),
]);

// ---- Z-3, The Lonely Cutter (the outline 7.2, rewritten around an absence; the second review's 3.16) -------------------

const KNOWS_HIS_MOTHER: Condition = { any: [has('clue.ti_jak_mother'), has('side.cane_name.recorded')] };

const TI_JAK: DialogueScript = script('ti_jak_talk', {
  start: { lines: [], next: [{ if: has('side.lonely_cutter.met'), to: 'menu' }, { to: 'meet' }] },
  meet: {
    lines: [
      act([{ do: 'look', actor: 'npc:ti_jak' }], '', 'A boy of sixteen sits by the cold hearth, a cutter\'s blade across his knees.', { set: { 'side.lonely_cutter.met': true } }),
      say('ti_jak', 'She said she\'d come back. She always came back. She said the quiet would have me when I was ready.'),
      { if: has('story.watcher_met'), speaker: G, text: 'The veiled woman by the mill. She\'s in Kingsmere, Ti Jak. She isn\'t coming.' },
      { if: not('story.watcher_met'), speaker: 'ti_jak', text: 'Grey veil. A basket of bread. She asked if I felt alone, and I said yes. She hasn\'t come since the lamp.' },
    ],
    next: 'menu',
  },
  menu: {
    lines: [say('ti_jak', 'Say something, then. Everybody does.')],
    choices: [
      { if: KNOWS_HIS_MOTHER, text: 'Compassion: say her name.', next: 'compassion' },
      { if: has('item.purge_list'), text: 'Reason: who holds the debt?', next: 'reason' },
      { text: 'Scripture: the Gaze remembers.', next: 'scripture' },
      { text: 'Leave him be for now.', next: 'later' },
    ],
  },
  scripture: {
    lines: [say(G, 'She remembers you, Ti Jak. You are not alone, and you never were.'), say('ti_jak', 'She said that too. Not yet.')],
    next: 'menu',
  },
  later: {
    lines: [
      say(A, 'He doesn\'t want a sermon, Gigi. He wants somebody to know her.'),
      nar('(His mother cut cane on this road. Mother Solange\'s list in the Temple Archive keeps the cutters\' names.)'),
    ],
  },
  compassion: {
    lines: [
      say(G, 'Odile. Cane cutter, the Cane Road. She\'s in Mother Solange\'s list, in the archivist\'s print, from last year.'),
      act([{ do: 'wait', ms: 1100 }], 'ti_jak', '...Odile.'),
      say(G, 'Odile. Somebody wrote her down, Ti Jak. Somebody keeps her.'),
    ],
    next: 'anissa',
  },
  reason: {
    lines: [
      say(G, 'She held your debt. That\'s what the bread was.'),
      say(G, 'The bread\'s gone, and the debt went with her. You don\'t owe the quiet anything now.'),
      act([{ do: 'wait', ms: 1100 }], 'ti_jak', '...Nothing.'),
    ],
    next: 'anissa',
  },
  anissa: {
    lines: [
      act([{ do: 'walk', actor: 'follower', to: at(ROAD.tiJak.x + 1, ROAD.tiJak.y + 1), facing: 'left' }, { do: 'wait', ms: 800 }], '', 'Anissa goes to the hearth and sits down beside him.'),
      say(A, 'She looked at me too. On the road. I didn\'t like it. You don\'t have to like it either.'),
      act([{ do: 'face', actor: 'npc:ti_jak', facing: 'right' }, { do: 'wait', ms: 900 }], 'ti_jak', '...No.'),
      nar('He stands up, puts the blade on his shoulder like a cutter, and goes.', { set: { 'story.ti_jak_home': true } }),
      act(
        [
          { do: 'sync' },
          { do: 'place', actor: 'ti_jak_w', look: 'ti_jak', at: ROAD.tiJak, facing: 'down' },
          { do: 'exit', actor: 'ti_jak_w', to: at(ROAD.gate.x + 1, ROAD.gate.y) },
          { do: 'look', actor: 'player' },
        ],
        '',
        'Down the lane and west along the Cane Road, toward the gate and home.',
      ),
    ],
  },
});

const SOLANGE_MUSTER: Record<string, DialogueNode> = {
  m_start: { lines: [], next: [{ if: all(has('side.lonely_cutter.met'), not('clue.ti_jak_mother')), to: 'm_odile' }, { to: '__base' }] },
  m_odile: {
    lines: [
      nar('Mother Solange\'s list. Below Rose-Aimée, the newest names are in the senior archivist\'s print, from last year.'),
      nar('"Odile, cane cutter, the Cane Road. Her son is Jak."', { set: { 'clue.ti_jak_mother': true } }),
      say(G, 'Odile.'),
    ],
  },
};

// ---- The Echo: the plaza on the morning of the signing (the outline 8.2; information, no anchor) --------------------------

const SIGNING: Record<string, DialogueNode> = {
  m_start: { lines: [], next: [{ if: not('clue.signing_morning'), to: 'm_morning' }, { to: 'm_again' }] },
  m_morning: {
    lines: [
      nar('The plaza fifty years ago, the morning of the signing. Among the tents, two armies are drawn up on the paving.', { fx: 'fade' }),
      say(AF, 'I\'m holding the door, Gigi.'),
      act([{ do: 'look', actor: 'npc:benny_signing' }], 'benny', 'Six pages, Patricio. I read six. I will not sign what I have not read, and I will say so on the stage if I must.'),
    ],
    choices: [
      { text: '"There are six."', set: { 'choice.patricio_signing': 'six' }, next: 'm_caona' },
      { text: '"Then say so. Loudly."', set: { 'choice.patricio_signing': 'loudly' }, next: 'm_caona' },
    ],
  },
  m_caona: {
    lines: [
      act([{ do: 'look', actor: 'npc:caona_signing' }], 'caona', 'Then we sign six, and we remember that we signed six.'),
      act([{ do: 'look', actor: 'npc:echo_drummer' }], 'echo_drummer', 'When it\'s signed I\'ll drum till my hands give out.'),
      act([{ do: 'look', actor: 'player' }], '', 'Young Patricio puts the brass whistle to his mouth. Two notes: high, and low.', { fx: 'whistle' }),
      act([{ do: 'face', actor: 'npc:echo_army_zetwal', facing: 'up' }, { do: 'face', actor: 'npc:echo_army_brasador', facing: 'up' }], '', 'Both armies come to order on it, all at once.'),
      act(
        [
          { do: 'enter', actor: 'envoy_s', look: 'echo_crown_envoy', from: at(PLAZA.harborLane.x, PLAZA.harborLane.y), to: at(17, 7), facing: 'up' },
          { do: 'look', actor: 'envoy_s' },
          { do: 'wait', ms: 800 },
        ],
        '',
        'Up the harbor road, between two marines in the old uniform, comes the Crown\'s envoy.',
      ),
      nar('At the stage\'s foot he lifts his hat to Patricio. His face is in its shadow.', { set: { 'clue.signing_morning': true } }),
    ],
  },
  m_again: { lines: [say(AF, 'I\'m holding the door, Gigi.'), nar('The two armies stand among the tents, waiting for the signing.')] },
};

// ---- The camps: gifts to the two Wealth houses (until the whistle), and the two Influence houses that sell nothing ----------

/** A gift at a Wealth house's camp: 100 gold a point toward its price, up to MUSTER.giftMax, until the whistle. */
function giftScript(id: string, house: string, speaker: string, greet: string): DialogueScript {
  const gift = `muster.gift.${house}`;
  const short = `muster.short.${house}`;
  const owed: DialogueLine[] = Array.from({ length: 11 }, (_, n) => ({
    if: { flag: short, eq: n } as Condition,
    speaker,
    text: n === 0 ? 'The price is paid, envoy. Anything more is a gift, and a gift buys soldiers.' : `By our count you are ${n} short of the price.`,
  }));
  const give: DialogueChoice[] = Array.from({ length: MUSTER.giftMax }, (_, g) => ({
    if: all(g === 0 ? not(gift) : { flag: gift, eq: g }, { flag: 'gold', gte: MUSTER.giftGold }),
    text: `Give ${MUSTER.giftGold} gold (one point).`,
    set: { 'gold.pay': MUSTER.giftGold, [gift]: g + 1 },
    next: g === 0 ? 'first' : 'thanks',
  }));
  return script(id, {
    start: { lines: [], next: [{ if: has('story.inspection_done'), to: 'closed' }, { to: 'open' }] },
    open: { lines: [say(speaker, greet), ...owed], choices: [...give, { text: 'Walk on.' }] },
    first: { lines: [say(speaker, 'Counted, and written down.'), say(S, 'Buying an army is the one purchase my mother would approve of.')] },
    thanks: { lines: [say(speaker, 'Counted, and written down.')] },
    closed: { lines: [say(speaker, 'The count is closed, envoy. The whistle closed it.')] },
  });
}

const IRONVOW_GIFT = giftScript('ironvow_camp_talk', 'skarragol', 'ironvow_qm', 'The Ironvow\'s price is Wealth, envoy: ten. Gold counts, at a hundred to the point.');
const AGNIVANSH_GIFT = giftScript('agnivansh_camp_talk', 'jwaladesh', 'agnivansh_keeper', 'The Flame Keepers\' price is Wealth, envoy: eight. Gold counts, at a hundred to the point.');

const SUZUMORI_CAMP: DialogueScript = simple('suzumori_camp_talk', [
  say('suzumori_guard', 'Influence is not bought here. It is the one thing we sell that we will not buy.'),
]);

const ADMIRAL: DialogueScript = script('dorini_admiral_talk', {
  start: {
    lines: [],
    next: [
      { if: all({ flag: 'muster.share.al_doria', gte: 100 }, not('item.token_dorini')), to: 'token' },
      { to: 'talk' },
    ],
  },
  talk: {
    lines: [
      say(ADM, 'The Merchant-Prince\'s price is Influence, envoy: ten.'),
      say(ADM, 'Influence is not bought here. It is the one thing we sell that we will not buy.'),
      say(ADM, 'The guild sits when the guild is paid.'),
    ],
  },
  token: {
    lines: [
      say(ADM, 'The guild sits when the guild is paid. By my count, it is.'),
      nar('He takes a green seal from his ledger and gives it to Gianna: the Dorini will sit at a Claim.', { set: { 'item.token_dorini': true } }),
    ],
  },
});

const ADMIRAL_LINE: DialogueScript = simple('dorini_admiral_line_talk', [say(ADM, 'Forty marines, in a line. The invoice is in my coat.')]);
const HRAFN_LINE: DialogueScript = simple('hrafn_line_talk', [say('hrafn', 'A whistle. The Moot uses a horn. A horn is louder.')]);
const RETAINER_LINE: DialogueScript = simple('muster_retainer_line_talk', [say('muster_retainer', 'We stand where we are put. It is restful.')]);
const STEWARD_LINE: DialogueScript = simple('agnivansh_steward_line_talk', [say('agnivansh_steward', 'The lamp is lit. It will stay lit to Xaraguá.')]);
const CONSUL_NIGHT: DialogueScript = simple('consul_night_talk', [say(CON, 'His Majesty\'s consul, at your service. Truly. Not tonight.')]);

// ---- People at the Muster: Joaquin, the sergeant, Jordyn's company, Salkhi, the lines -----------------------------------------

const PEOPLE: readonly DialogueScript[] = [
  script('joaquin_muster_talk', {
    start: { lines: [], next: [{ if: has('story.betrayal_seen'), to: 'dawn' }, { if: DUSK, to: 'dusk' }, { to: 'day' }] },
    day: { lines: [say(JQ, 'They followed him off the wall, envoy, not me. I only knew the way to the strand.')] },
    dusk: { lines: [say(JQ, 'In a line, behind my nephew. My father would laugh.')] },
    dawn: { lines: [say(JQ, 'After you, captain. After the envoy, I mean.')] },
  }),
  script('anicette_muster_talk', {
    start: { lines: [], next: [{ if: has('story.betrayal_seen'), to: 'dawn' }, { to: 'pier' }] },
    pier: { lines: [say(AN, 'Nine of you, and a horse. Go home and eat.')] },
    dawn: { lines: [say(AN, 'For the water. And come back.')] },
  }),
  simple('fb_sergeant_talk', [say(SG, 'Fear six, we said, and the envoy would pay it at the Muster. Look at this plaza. Paid.')]),
  script('jordyn_muster_talk', {
    start: { lines: [], next: [{ if: has('story.betrayal_seen'), to: 'dawn' }, { if: DUSK, to: 'dusk' }, { to: 'day' }] },
    day: { lines: [say(JO, 'Twelve, with me. Nobody sits near us. That is a reason to sit up straight.')] },
    dusk: { lines: [say(JO, 'I keep the law where I stand. I am standing.')] },
    dawn: { lines: [say(JO, 'We sail with the levy. The printer stays to print.')] },
  }),
  simple('watch_muster_talk', [say('watch_turned', 'Coat\'s on the wrong way out, madam. On purpose.')]),
  simple('printer_muster_talk', [say(PR, 'Forty years of type in Kingsmere, under a Crown I never voted for.'), say(PR, 'Here they tell me what they think, out loud. It is very noisy.')]),
  simple('salkhi_town_talk', [say(SK, 'Grass. I have been promised grass in five countries. This is the first that kept its word.')]),
  simple('muster_horse_talk', [nar('An Ironvow horse, eating Zetwal\'s grass with great seriousness.')]),
  simple('heights_rider_talk', [say('lawspeaker_rider', 'The well up here is the best water in the city. We have nearly finished it.')]),
  simple('trader_muster_talk', [say('trader_captain', 'Not until there\'s a fleet, envoy. I want to see how it ends.')]),
  simple('smith_muster_talk', [say('smith', 'Kingsmere steel came in for the Muster, and a long bow, and a robe fit for an archivist at war. Look before you sail.')]),
  simple('line_zetwal_talk', [say('levy', 'My father stood here for the Marshal. Now me.')]),
  simple('line_free_brasador_talk', [say('free_brasador', 'Captain Azzy\'s company. Sashes off, coats on.')]),
  simple('line_skarragol_talk', [say('lawspeaker_rider', 'Standing still is hard. We are better on horses.')]),
  simple('line_kuroshi_talk', [say('suzumori_guard', 'A line is a kind of silence. We are good at those.')]),
  simple('line_jwaladesh_talk', [say('agnivansh_keeper', 'The lamp\'s lit. It stays lit.')]),
  simple('line_al_doria_talk', [say('dorini_marine', 'Forty of us. The invoice says forty-one. Nobody knows who the forty-first is.')]),
  simple('line_aldermoor_talk', [say('watch_turned', 'Twelve of us, madam. We came the long way round, and we came.')]),
  simple('crew_chief_npc_talk', [say('crew_chief', 'You saw cane.')]),
  simple('powder_master_talk', [say('powder_master', 'Bar it and pin it when you go, Marshal.')]),
  simple('benny_signing_talk', [say('benny', 'Six pages. I counted them twice.')]),
  simple('caona_signing_talk', [say('caona', 'We sign six. We remember six.')]),
  simple('echo_army_zetwal_talk', [say('echo_soldier', 'Marshal. We\'re ready when the drum is.')]),
  simple('echo_army_brasador_talk', [say('sergeant', 'Brasador stands with the Marshal. Benny says so, and Benny reads.')]),
  simple('signal_fire', [nar('The old signal fire, built up and ready.'), { if: has('story.betrayal_seen'), speaker: '', text: 'It is lit. Across the strait, somebody is looking at it.' }]),
];

// ---- Pòdlimyè's own people at the Muster (the second review's 3.6: every placed person has a Chapter 10 line) -----------

/** A Chapter 10 overlay on a built conversation: while the Muster is on, its own nodes (m_start first); else the old one. */
export interface MusterOverlay {
  id: string;
  nodes: Record<string, DialogueNode>;
  when?: Condition;
}

const one = (id: string, speaker: string, text: string, extra: Extra = {}): MusterOverlay => ({ id, nodes: { m_start: { lines: [say(speaker, text, extra)] } } });
const lines = (id: string, ls: DialogueLine[]): MusterOverlay => ({ id, nodes: { m_start: { lines: ls } } });

/** Wraps a built script so the Muster's nodes play while `when` holds; `__base` in a node's next means the old start. */
export function overlay(base: DialogueScript, o: MusterOverlay): DialogueScript {
  const fix = (to: string) => (to === '__base' ? base.start : to);
  const nodes: Record<string, DialogueNode> = { ...base.nodes };
  for (const [k, n] of Object.entries(o.nodes)) {
    if (base.nodes[k]) throw new Error(`overlay ${o.id}: node ${k} already exists`);
    nodes[k] = {
      ...n,
      next: typeof n.next === 'string' ? fix(n.next) : n.next?.map((b) => ({ ...b, to: fix(b.to) })),
      choices: n.choices?.map((c) => (c.next ? { ...c, next: fix(c.next) } : c)),
    };
  }
  nodes.m_enter = { lines: [], next: [{ if: o.when ?? MUSTER_ON, to: 'm_start' }, { to: base.start }] };
  return { id: base.id, start: 'm_enter', nodes };
}

const CUTTER: MusterOverlay = {
  id: 'cane_cutter_talk',
  nodes: {
    m_start: {
      lines: [],
      next: [
        { if: all(has('story.ti_jak_home'), not('side.lonely_cutter.done')), to: 'm_home' },
        { if: not('side.muskets.accepted'), to: 'm_carts' },
        { if: all(has('story.blessing'), not('side.lonely_cutter.accepted')), to: 'm_tijak' },
        { to: 'm_idle' },
      ],
    },
    m_carts: {
      lines: [
        say('cane_cutter', 'Carts, archivist. Every night since the first ship came in. Down the track to the mangroves, and back empty.'),
        say('cane_cutter', 'Somebody in your harbor is buying what\'s in those crates, and it isn\'t the Marshal.', { set: { 'side.muskets.accepted': true } }),
        nar('(The cart track goes south off the road to the smugglers\' landing in the mangroves.)'),
      ],
      next: [{ if: all(has('story.blessing'), not('side.lonely_cutter.accepted')), to: 'm_tijak' }],
    },
    m_tijak: {
      lines: [
        say('cane_cutter', 'And Ti Jak. The cutter\'s boy. He\'s at the mill every night, waiting for the veiled one, and she doesn\'t come.'),
        say('cane_cutter', 'She hasn\'t come since the lamp. He won\'t cut cane and he won\'t come home.', { set: { 'side.lonely_cutter.accepted': true } }),
      ],
    },
    m_home: {
      lines: [say('cane_cutter', 'He came home. He ate. He\'s asleep in the cane shed like a cutter.', { set: { 'side.lonely_cutter.done': true } })],
    },
    m_idle: { lines: [say('cane_cutter', 'And now carts. Carts don\'t grow in cane, archivist.')] },
  },
};

const ANICETTE: MusterOverlay = {
  id: 'anicette_talk',
  nodes: {
    m_start: {
      lines: [],
      next: [
        { if: all(has('story.rahel_met'), not('clue.four_accounts'), THREE_ACCOUNTS), to: 'm_accounts' },
        { if: all(has('story.rahel_met'), not('clue.four_accounts')), to: 'm_not_yet' },
        { to: 'm_idle' },
      ],
    },
    m_accounts: { lines: ACCOUNTS },
    m_not_yet: { lines: [say(AN, 'All four, Gianna. The temple\'s, the Suzumori ledger, the Crown\'s own chronicle. And mine. Then tell me which one lies.')] },
    m_idle: { lines: [say(AN, 'Nine of you to feed, and a horse. Eat something before you seat anyone.')] },
  },
};

const CHANCELLOR: MusterOverlay = {
  id: 'chancellor_talk',
  nodes: {
    m_start: { lines: [], next: [{ if: has('story.council_voted'), to: 'm_voted' }, { if: has('story.council_condition'), to: 'm_waiting' }, { to: 'm_noon' }] },
    m_noon: { lines: [say(CH, 'The council sits at noon, envoy. Speak to the Speaker; he likes to be asked.')] },
    m_waiting: { lines: [say(CH, 'Seat them, and clear the road. Then the Speaker calls the vote, and I put the question to an empty chair.')] },
    m_voted: { lines: [say(CH, 'I said go. I will say it to your mother, when she lets me.')] },
  },
};

// ---- The contract board's dispatch, and the Quill at the name stones (docs/PRODUCTION.md's "not built yet", Oct 27) ------
//
// The outline 7.4: "carry dispatches to the Temple island" (CAPITALS.md 1's Chapter 10 job). The Hall's chief courier has
// birds for every capital but none for the island across the bridge; the party carries the Speaker's dispatch by hand to
// the acolyte at the lamp (+1 Influence in Zetwal, like the count). Optional, never on the gate, open until the fleet sails.

/** The Muster, until the fleet sails (the dispatch and the Quill's look are this chapter's only). */
const MUSTER_UNTIL_SAIL: Condition = all(MUSTER_ON, not('act10.complete'));

const COURIER: MusterOverlay = {
  id: 'chief_courier_talk',
  nodes: {
    m_start: { lines: [], next: [{ if: has('muster.dispatch_done'), to: 'm_done' }, { if: has('muster.dispatch_carried'), to: 'm_carrying' }, { to: 'm_offer' }] },
    m_offer: {
      lines: [
        say('chief_courier', 'Pigeons to every capital: the Muster sits. And not one bird for the Temple island. It is across a bridge. Birds are proud.'),
        say('chief_courier', 'The contract board has it pinned, envoy: the Speaker\'s dispatch to the lamp, by hand. Will you carry it?'),
      ],
      choices: [
        { text: 'I\'ll carry it.', set: { 'muster.dispatch_carried': true }, next: 'm_given' },
        { text: 'Not now.' },
      ],
    },
    m_given: {
      lines: [
        act([{ do: 'face', actor: 'npc:chief_courier', facing: 'player' }], 'chief_courier', 'The Speaker\'s seal. For the acolyte at the lamp, and nobody else.'),
        nar('(The contract board\'s job, "carry dispatches to the Temple island": the acolyte at the Gaze lamp, over the Chain Bridge.)'),
      ],
    },
    m_carrying: { lines: [say('chief_courier', 'The acolyte at the lamp, envoy. Over the bridge. The birds are watching.')] },
    m_done: { lines: [say('chief_courier', 'Half the birds came back with the same answer: "We know. We\'re in your harbor."')] },
  },
  when: MUSTER_UNTIL_SAIL,
};

const ACOLYTE: MusterOverlay = {
  id: 'acolyte_talk',
  nodes: {
    m_start: { lines: [], next: [{ if: all(has('muster.dispatch_carried'), not('muster.dispatch_done')), to: 'm_dispatch' }, { to: 'm_line' }] },
    m_dispatch: {
      lines: [
        act([{ do: 'face', actor: 'npc:acolyte', facing: 'player' }], 'acolyte', 'From the council? By hand, over the bridge?'),
        nar('The acolyte breaks the Speaker\'s seal and reads it at the lamp, moving her lips.'),
        say('acolyte', '"The lamp to burn every night the fleet is at sea." It burns every night. I will tell the keeper they asked.', {
          set: { 'muster.dispatch_done': true },
        }),
        nar('(The contract board\'s job, "carry dispatches to the Temple island": done. +1 Influence in Zetwal.)'),
      ],
    },
    m_line: { lines: [say('acolyte', 'The grey ones and the saffron ones came to the lamp by opposite doors. It is the first time our two doors mattered.')] },
  },
  when: MUSTER_UNTIL_SAIL,
};

// SECRET-ITEMS.md 1's Chapter 10 bonus (Claude's call on the staging, Oct 27): with Solange's Quill (Z-4, which brings
// her original list), Yari walks to the seventh name stone, the one the young Patricio carved a sun into when the
// stonecutter would not cut a Yaguana name; Gianna reads her the name from Solange's list. +2 Influence in Xaraguá.
const QUILL_STONE: MusterOverlay = {
  id: 'name_stones',
  nodes: {
    m_start: { lines: [], next: [{ if: all(has('item.solange_quill'), not('muster.quill_stone')), to: 'm_quill' }, { to: '__base' }] },
    m_quill: {
      lines: [
        nar('Seven name stones round the lamp court. On the seventh, under fifty years of weather, a carved sun.'),
        act([{ do: 'walk', actor: 'yari', to: at(TEMPLE.seventhStone.x, TEMPLE.seventhStone.y), facing: 'left' }, { do: 'look', actor: 'yari' }], Y, 'That one has no name on it. Only the sun.'),
        say(G, 'Solange wrote the name down. Her list, from under the plinth: the seventh name, in her hand. The scout\'s brother.'),
        act([{ do: 'face', actor: 'yari', facing: 'player' }], Y, 'A Yaguana name, on Zetwal\'s list, for fifty years. And nobody at home ever knew it was kept.'),
        say(Y, 'They will say it in Yucayeque. Out loud. I will tell them where it is.', { set: { 'muster.quill_stone': true } }),
        nar('(Yari saw the Yaguana name kept with Zetwal\'s dead. +2 Influence in Xaraguá.)'),
      ],
    },
  },
  when: MUSTER_UNTIL_SAIL,
};

const OVERLAYS: readonly MusterOverlay[] = [
  COURIER,
  ACOLYTE,
  QUILL_STONE,
  { id: 'council_speaker_talk', nodes: COUNCIL },
  CUTTER,
  ANICETTE,
  CHANCELLOR,
  { id: 'solange_list', nodes: SOLANGE_MUSTER },
  { id: 'plaza_echo_enter', nodes: SIGNING },
  {
    id: 'elder_dove_talk',
    nodes: {
      m_start: { lines: [], next: [{ if: has('story.council_voted'), to: 'm_voted' }, { to: 'm_peace' }] },
      m_peace: { lines: [say(DOVE, 'Peace has kept Zetwal fed for fifty years, envoy. I would like it to keep us a little longer.')] },
      m_voted: { lines: [say(DOVE, 'I stood. Twice. Don\'t make me regret either time.')] },
    },
  },
  {
    id: 'elder_hawk_talk',
    nodes: {
      m_start: { lines: [], next: [{ if: has('story.chain_raised'), to: 'm_chain' }, { to: 'm_wait' }] },
      m_wait: { lines: [say(HAWK, 'Raise the chain, arm the levy, sail. I have been saying it for a year. It is nice to be on time.')] },
      m_chain: { lines: [say(HAWK, 'Hear that ratchet? That is my chain. Nobody will build me a statue, but I have a chain.')] },
    },
  },
  {
    id: 'recruiter_a_talk',
    nodes: { m_start: { lines: [say('recruiter_a', 'So much noise today. Drums, muskets, shouting. It will be quieter soon.')] } },
  },
  {
    id: 'recruiter_b_talk',
    nodes: {
      m_start: {
        lines: [
          say('recruiter_b', 'The woman by the mill fell in a Stillwater court, they tell me. You wanted to know who wears our hood.'),
          say('recruiter_b', 'The quiet goes on, envoy\'s daughter. It always does.'),
        ],
      },
    },
  },
  {
    id: 'town_guard_talk',
    nodes: {
      m_start: { lines: [], next: [{ if: all(has('story.inspection_done'), not('muster.counted')), to: 'm_counted' }, { if: has('muster.counted'), to: 'm_done' }, { to: 'm_count' }] },
      m_count: { lines: [say('town_guard', 'The Chancellor wants every soldier on this plaza counted by dusk. I have counted the horses twice. They move.')] },
      m_counted: {
        lines: [
          say('town_guard', 'You watched them counted, envoy. Seven lines, one whistle. I\'ll put your name on the tally for the council.', { set: { 'muster.counted': true } }),
          nar('(The contract board\'s job, "count the soldiers at the Muster": done. +1 Influence in Zetwal.)'),
        ],
      },
      m_done: { lines: [say('town_guard', 'The tally\'s with the council. Even the horses.')] },
    },
  },
  one('gaze_keeper_talk', 'gaze_keeper', 'Seven camps, and nobody shouting about gods. I had not expected to live to see it.'),
  one('soup_vendor_talk', 'soup_vendor', 'Soup for the cousins. All of them. The pot\'s the size of a cart and it\'s still not big enough.'),
  one('festival_kid_talk', 'festival_kid', 'They let me drum on the stage! For the soldiers! Nobody said stop!'),
  one('elder_talk', 'elder', 'Fifty years ago this plaza looked like this. I was a boy. I carried water to the Brasador lines.'),
  one('ferryman_talk', 'ferryman', 'Every boat in the harbor is somebody\'s, today. Mine\'s the only one nobody wants.'),
  one('charm_seller_talk', 'charm_seller', 'Charms for sailors, charms for soldiers. The Ironvow buy the ugly ones. They say ugly charms work harder.'),
  one('grocer_talk', 'grocer', 'Seven armies, and every one of them hungry at the same hour.'),
  one('debate_onlooker_talk', 'villager', 'The corner\'s quiet today. Everyone\'s gone to argue at the Muster instead.'),
  one('patricio_home_talk', PO, 'The council sits at noon, envoy.'),
  one('anicette_home_talk', AN, 'Eat first. Then seat them.'),
  one('temple_porter_talk', 'temple_porter', 'An old lady asked me how many steps up to the lamp. I said fourteen. She said fifteen. She was right.'),
  one('mourner_talk', 'mourner', 'They read the names here a year ago. My brother\'s was the third. I came to tell him the fleet is sailing.'),
  one('fisher_island_talk', 'fisher_island', 'No fish today. Every fish in the strait has heard about the Muster.'),
  one('archivist_talk', 'archivist', 'Volume Two is back on the Tales shelf, Gianna. If you are reading all four accounts, it is the fourth.'),
  one('hall_guard_talk', 'hall_guard', 'The council sits today. Mind the page; he runs.'),
  one('hall_guard_2_talk', 'hall_guard', 'Seven houses in the harbor and they all want to see the Hall. We said one at a time.'),
  one('hall_clerk_talk', 'hall_clerk', 'Your papers are still good, envoy. I checked. Twice. The Dorini admiral asked to see them, and I said no.'),
  one('hall_page_talk', 'hall_page', 'Message for the Chancellor! Message for the Speaker! Message for... I\'ve forgotten who.'),
  one('hall_steward_talk', 'hall_steward', 'The council chamber has never been this full. We have brought in the benches from the Treasury.'),
  one('throne_usher_talk', 'throne_usher', 'The chair is kept, envoy. Her shawl is still over its arm. Nobody has moved it.'),
  one('foreign_envoy_talk', 'foreign_envoy', 'In my country we would call this many soldiers in one plaza a coup. Here it is a festival.'),
  one('seal_keeper_talk', 'seal_keeper', 'The council\'s seal is ready for a vote. It has been ready since dawn. So have I.'),
  one('treasurer_talk', 'treasurer', 'The Dorini sent an invoice. The Chancellor said to file it under "after the war".'),
  one('scribe_talk', 'scribe', 'Seven houses. Seven languages of minutes. My hand hurts.'),
  one('scribe_2_talk', 'scribe', 'I am copying the Chancellor\'s condition in a fair hand. She said it once. Once is enough.'),
  one('fishwife_talk', 'fishwife', 'Seven navies in my harbor and not one of them can fry a snapper.'),
  one('net_mender_talk', 'net_mender', 'We\'re mending nets into cartridge bags. Same knots. Different catch.'),
  one('customs_clerk_talk', 'customs_clerk', 'I have a list of every hull in the harbor. It is the longest list I have ever had. I am very happy.'),
  one('harbor_kid_talk', 'harbor_kid', 'I counted the ships! Then a Suzumori boat came in the fog and I had to count again!'),
  one('old_sailor_talk', 'old_sailor', 'Fifty years ago this whole harbor was Crown ships. Now it\'s everyone else\'s. I am not too old to watch that.'),
  one('ferry_hand_talk', 'ferry_hand', 'The trader says he\'ll lead the fleet out. He says it like he\'s been waiting his whole life.'),
  one('gardener_talk', 'gardener', 'The Ironvow tied their horses to my lemon tree. The lemon tree is coping.'),
  one('poet_talk', 'poet', 'I am writing an ode to the Muster. Seven stanzas. One of them keeps leaving.'),
  one('porch_widow_talk', 'porch_widow', 'The riders drank the well dry and then said thank you in three languages. I have decided to forgive them.'),
  {
    id: 'lookout_keeper_talk',
    nodes: {
      m_start: { lines: [], next: [{ if: has('story.betrayal_seen'), to: 'm_lit' }, { to: 'm_ready' }] },
      m_ready: { lines: [say('lookout_keeper', 'All of Pòdlimyè below, and seven camps in it. I keep the old signal fire ready. Nobody has asked me to light it. Yet.')] },
      m_lit: { lines: [say('lookout_keeper', 'The Marshal asked. For Xaraguá, he said. So they know you\'re coming.')] },
    },
  },
  one('produce_seller_talk', 'produce_seller', 'Mangoes for the Muster! The Agnivansh want them ripe, the Ironvow want them hard, and the Dorini want a receipt.'),
  one('spice_seller_talk', 'spice_seller', 'The Suzumori bought every peppercorn I had and paid in paper cranes. I am told they are worth something in Kirinoura.'),
  one('cloth_merchant_talk', 'cloth_merchant', 'Black cloth for the Free Brasador sashes. They tore the old ones off. They want new ones with nothing on them.'),
  one('engraver_talk', 'engraver', 'The Agnivansh want a lamp engraved on every musket. The Ironvow want a horse. I said one at a time.'),
  one('ironmonger_talk', 'ironmonger', 'Every pot I own is a cooking pot for an army now.'),
  one('fishmonger_talk', 'fishmonger', 'Seven navies and not one of them can fry a snapper.'),
  one('goat_herder_talk', 'goat_herder', 'An Ironvow rider tried to buy my goat for his horse to talk to. I said the goat would not like the horse.'),
  one('lottery_seller_talk', 'lottery_seller', 'Today\'s numbers: seven, six, and one blank. Nobody\'s buying the blank.'),
  one('letter_writer_talk', 'letter_writer', 'Letters home for the soldiers, a sol a page. A Dorini marine wants to write to his mother about the weather.'),
  one('porter_talk', 'porter', 'Carry this to the Ironvow, carry that to the Dorini. Never both together. They\'d drop it.'),
  one('pickpocket_talk', 'pickpocket', 'Seven armies of pockets, and every one of them armed. I\'m on holiday.'),
  one('market_kid_talk', 'market_kid', 'A Suzumori lady folded me a crane! It flaps if you pull its tail!'),
  one('market_shopper_talk', 'market_shopper', 'Prices are up. The Dorini are buying, and when the Dorini buy, everything costs more.'),
  one('honor_guard_talk', 'honor_guard', 'The council sits. Nobody goes in with a weapon. The Ironvow are arguing about whether a horse is a weapon.'),
  one('honor_guard_2_talk', 'honor_guard', 'I asked the Suzumori to leave their blades at the door. They left four and kept, I think, eleven.'),
  one('gazette_crier_talk', 'gazette_crier', 'Gazette! Seven houses in the harbor! Council sits at noon! Festival committee asks whether this counts as a festival!'),
  one('petitioner_talk', 'petitioner', 'I have petitioned the council for a new roof. They said, after the war. Everyone says after the war today.'),
  one('protester_talk', 'protester', 'My board says NO CHARTER FOR XARAGUÁ. I have added WELCOME underneath. It is a long board.'),
  one('courier_rider_talk', 'courier_rider', 'To the Heights and back, to the harbor and back. My horse has opinions about the Muster.'),
  one('nursemaid_talk', 'nursemaid', 'The councillors\' children want to be soldiers now. All of them. Even the baby.'),
  lines('smuggler_crates', [
    nar('Crates stamped with the Crown seal, hidden under cane leaves. Muskets, by the weight.'),
    nar('Fresh cart tracks run south from here, down the track to the mangroves.'),
  ]),
  lines('mill_ruin', [nar('The old sugar mill, burned in the war. Fresh ashes in the hearth: someone sleeps here. A cellar door in the north wall, chained.')]),
];

export const MUSTER_OVERLAYS: readonly MusterOverlay[] = OVERLAYS;

/** Every Chapter 10 conversation of its own (the overlays are applied over the built ones in data/dialogue.ts). */
export const MUSTER_DIALOGUE: readonly DialogueScript[] = [
  LANDING,
  CAMP,
  WATCH,
  KITCHEN,
  PATRICIA,
  RAHEL,
  PATRICIO,
  NIGHT_WALK,
  NIGHT_QUAY,
  CAPTAIN_QUAY,
  TIDE,
  CREW,
  CREW_AFTER,
  MILL_CLOSED,
  MILL_ECHO_ENTER,
  MILL_BAR_ECHO,
  MILL_ECHO_RETURN,
  MILL_DOOR_OPEN,
  MILL_DOOR_BARRED,
  TI_JAK,
  IRONVOW_GIFT,
  AGNIVANSH_GIFT,
  SUZUMORI_CAMP,
  ADMIRAL,
  ADMIRAL_LINE,
  HRAFN_LINE,
  RETAINER_LINE,
  STEWARD_LINE,
  CONSUL_NIGHT,
  ...PEOPLE,
];

export { DEFIANCE, PURCHASE, CAPTAIN_NAME };
