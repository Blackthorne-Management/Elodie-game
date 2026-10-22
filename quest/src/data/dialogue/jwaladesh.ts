// Chapter 8, The Dying Flame (Agnipur, Jwaladesh; the third road): docs/quest/reviews/2026-10-22-chapter8-outline.md
// with its second review's fixes. The maps are tools/maps/jwaladesh.ts; every tile in a stage direction comes from
// data/jwaladesh.ts or is written next to the map it belongs to.
//
// The owner's rules here: every story moment is acted out on the map; Anissa is never touched by a foe, never a target
// and never jokes; Salkhi never speaks in a scene with Anissa's lines in it and never about her; Vikram's breathing is
// never in a node with Anissa's lines (tests/jwaladesh.test.ts checks all three); no jokes in Arjun's night, at the
// flame, at the ledger or at "the word was wrong"; the Crown's hand stays the Regent's (the ledger is the proof, and
// nobody joins the Crown to the girl who glows). Aiyana says only what she measures: never Cenizal, never a word about
// her brother or the thumbprints (the locked rule; the second review's 3.5). The flame was never out, only low: the
// beam shows it to the city, and the oil raises it (the review's 3.10).

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { Condition } from '../../engine/conditions.ts';
import type { StageCue } from '../../engine/stage.ts';
import { ANCHORS, BAZAAR, COURT, HARBOR, MIRRORS_RIGHT, ROOFTOPS, mirrorFlag } from '../jwaladesh.ts';

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
const AI = 'aiyana';
const ME = 'meera';
const SK = 'salkhi';
const KP = 'senior_keeper';
const JP = 'junior_priest';
const CH = 'jw_chamberlain';
const OF = 'oil_factor';
const DH = 'dhanraj';
const AR = 'arjun';
const CR = 'chief_runner';
const CT = 'carter';
const EN = 'enforcer';

/** What the tower's guard says is still left before the night lamp (worded from the flags). */
const LEFT: DialogueLine[] = [
  { if: { notFlag: 'side.lamp_relay.done' }, speaker: A, text: 'The runners are still on the temple steps, Gigi.' },
  { if: { notFlag: 'side.anonymous_oil.done' }, speaker: A, text: 'The priest with the broom is still sweeping.' },
  { if: { notFlag: 'debate.jwaladesh_hesitation.settled' }, speaker: A, text: 'And the two on the spice row are still at it.' },
];

/** Seven riders below the lamp, on the quay (Arjun's charge; placed again whenever the scene needs them). */
const RIDERS = [at(13, 11), at(14, 11), at(15, 11), at(16, 11), at(17, 11), at(18, 11), at(19, 11)];
const placeRiders: StageCue[] = RIDERS.map((p, i) => ({ do: 'place', actor: `rider_${i + 1}`, look: 'echo_agnivansh_rider', at: p, facing: 'up' }));


/** The last bracket on the roofs: Aiyana's disc, Anissa holding it, the beam through the wick-window (beat 5). */
function discNodes(): Record<string, DialogueNode> {
  return {
    disc: {
      lines: [
        nar('The light comes round the tower, mirror to mirror, and stops at the fourth bracket. It has no mirror.'),
        act([{ do: 'walk', actor: 'npc:aiyana', to: at(ROOFTOPS.bracket4.x + 1, ROOFTOPS.bracket4.y + 1), facing: 'left' }], AI, 'Rusted. I would need an hour.'),
        nar('She takes a polished bronze disc from her apron, the size of a plate, and holds it out to Anissa.'),
        say(AI, 'You hold the last one. Stand there. When the light hits it, point it at the window. Don\'t look into it.', { set: { 'item.aiyana_disc': true } }),
        act(
          [{ do: 'walk', actor: 'follower', to: at(ROOFTOPS.anissaSpot.x, ROOFTOPS.anissaSpot.y), facing: 'down' }, { do: 'wait', ms: 500 }],
          '',
          'Anissa stands where she is told, the disc in both hands. The beam lands on it.',
        ),
        act([{ do: 'face', actor: 'follower', facing: 'left' }, { do: 'wait', ms: 400 }, { do: 'sync' }], '', 'She turns. The beam runs west along the roofs and goes through the temple\'s wick-window.', {
          set: { 'story.beam_at_temple': true },
        }),
        say(AI, 'That is the first light through that window in two years. Hold it there. Exactly there.'),
      ],
      next: 'vikram',
    },
    vikram: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'vikram_roof', look: 'vikram', from: at(ROOFTOPS.ladder.x, ROOFTOPS.ladder.y - 1), to: at(ROOFTOPS.anissaSpot.x - 2, ROOFTOPS.anissaSpot.y), facing: 'left' },
            { do: 'look', actor: 'vikram_roof' },
          ],
          V,
          'I ran. I should not have run.',
        ),
        act([{ do: 'face', actor: 'vikram_roof', facing: 'left' }, { do: 'wait', ms: 900 }], '', 'He looks along the beam to the window, and for once he says nothing.'),
        act([{ do: 'exit', actor: 'vikram_roof', to: at(ROOFTOPS.ladder.x, ROOFTOPS.ladder.y - 1), run: true }], V, 'The Court. Now. Before somebody... draws a curtain on it.'),
      ],
    },
  };
}

function mirrorScript(n: number): DialogueScript {
  const e = mirrorFlag(n, 'e');
  const no = mirrorFlag(n, 'n');
  const w = mirrorFlag(n, 'w');
  const south: Condition = { all: [{ notFlag: e }, { notFlag: no }, { notFlag: w }] };
  const name = ['The first', 'The second', 'The third'][n - 1]!;
  return script(`roof_mirror_${n}`, {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.beam_at_temple' }, to: 'done' },
        { if: { notFlag: 'story.rooftops_entered' }, to: 'bolted' },
        { to: 'mirror' },
      ],
    },
    done: { lines: [nar('The mirrors stand as they were set: east, north, north. The beam runs round the tower to the window.')] },
    bolted: { lines: [nar(`${name} mirror, turned face-down and bolted. A tag on the bolt: "For cleaning. By order of the Court."`)] },
    mirror: {
      lines: [
        { if: { flag: e }, speaker: '', text: `${name} mirror faces east.` },
        { if: { flag: no }, speaker: '', text: `${name} mirror faces north.` },
        { if: { flag: w }, speaker: '', text: `${name} mirror faces west.` },
        { if: south, speaker: '', text: `${name} mirror faces south.` },
      ],
      choices: [
        { if: south, text: 'Turn it east.', set: { [e]: true }, next: 'check' },
        { if: { flag: e }, text: 'Turn it north.', set: { [e]: false, [no]: true }, next: 'check' },
        { if: { flag: no }, text: 'Turn it west.', set: { [no]: false, [w]: true }, next: 'check' },
        { if: { flag: w }, text: 'Turn it south.', set: { [w]: false }, next: 'check' },
        { text: 'Leave it.' },
      ],
    },
    check: {
      lines: [],
      next: [
        { if: { all: [MIRRORS_RIGHT, { notFlag: 'anchor.tower_mirror' }] }, to: 'dark' },
        { if: { all: [MIRRORS_RIGHT, ANCHORS] }, to: 'disc' },
        { if: { all: [{ flag: mirrorFlag(1, 'n') }, { flag: 'anchor.tower_mirror' }] }, to: 'brick' },
        { to: 'turned' },
      ],
    },
    turned: { lines: [nar('The mirror turns on its bracket with a groan of bronze.')] },
    brick: { lines: [nar('The light goes the old way, straight at the new tower. The light lands on brick.')] },
    dark: { lines: [nar('The mirrors are set. No light comes from the harbor to set them for.')] },
    ...discNodes(),
  });
}

export const JWALADESH_DIALOGUE: readonly DialogueScript[] = [
  // ---- Beat 0: under the chain (the harbor) ---------------------------------------------------------------------
  script('harbor_arrive', {
    start: {
      lines: [
        nar('Agnipur\'s harbor: a quay of white stone, a glare of salt, and across the harbor mouth the great chain.', { fx: 'fade' }),
        act([{ do: 'look', actor: 'player' }], '', 'On the chain tower, the great lamp stands dark.'),
        say(H, 'Salt flats. Everything you say out here carries. Say it anyway.'),
        say(BY, 'Say less.'),
        say(S, 'I can smell a shortage from here. It smells of money.'),
      ],
      next: 'sky',
    },
    sky: {
      lines: [say(A, 'Gigi, the sky\'s orange. Is that the flame?'), say(G, 'That\'s the sun on the salt. The flame is smaller than that.')],
      next: 'cart',
    },
    cart: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'lamp_seller', look: 'lamp_seller', from: at(HARBOR.stair.x, HARBOR.stair.y + 1), to: at(HARBOR.storeDoors.x, HARBOR.storeDoors.y + 2), facing: 'up' },
            { do: 'look', actor: 'lamp_seller' },
          ],
          '',
          'A lamp-seller brings a cart of empty jars down the quay, to the oil store\'s chained doors.',
        ),
        act([{ do: 'walk', actor: 'npc:store_enforcer_a', to: at(HARBOR.storeDoors.x - 1, HARBOR.storeDoors.y + 2), facing: 'right' }], EN, 'No oil today. No oil tomorrow. The Seth will say when.'),
        act(
          [{ do: 'exit', actor: 'lamp_seller', to: at(HARBOR.stair.x, HARBOR.stair.y + 1) }, { do: 'look', actor: 'player' }],
          '',
          'The enforcer turns the cart round with one hand on the shaft. The seller goes back up the hill, the empty jars rattling.',
        ),
        act([{ do: 'look', actor: 'player' }], '', 'Tied up at the store\'s own steps: a launch with an Aldermoor violet pennant.'),
        say(S, 'No oil in a port full of oil. Somebody is being paid to say that.'),
        say(Y, 'Or to not say it.', { set: { 'story.harbor_seen': true } }),
      ],
    },
  }),
  simple('stair_sighting', [
    act(
      [
        { do: 'place', actor: 'crowd_a', look: 'lamp_seller', at: at(15, 2), facing: 'up' },
        { do: 'place', actor: 'crowd_b', look: 'jw_vendor', at: at(17, 2), facing: 'up' },
        { do: 'place', actor: 'crowd_c', look: 'runner', at: at(16, 3), facing: 'up' },
        { do: 'place', actor: 'crowd_d', look: 'jw_vendor', at: at(18, 3), facing: 'up' },
        { do: 'look', actor: 'crowd_a' },
      ],
      '',
      'At the top of the quay a crowd stands round something, and from inside it comes the sound of two blades.',
    ),
    say('voice_crowd', 'You said... the Crown... would never... hold... the chain. I say... it already... does.'),
    act(
      [
        { do: 'walk', actor: 'crowd_a', to: at(14, 2), async: true },
        { do: 'walk', actor: 'crowd_b', to: at(18, 1), async: true },
        { do: 'place', actor: 'vikram_stair', look: 'vikram', at: at(16, 2), facing: 'down' },
        { do: 'place', actor: 'dyer', look: 'dyer', at: at(17, 1), facing: 'left' },
        { do: 'look', actor: 'vikram_stair' },
      ],
      '',
      'The crowd parts. A young man in saffron, bent double, hands on his knees. A dyer sits in the dust, his sword six feet off.',
    ),
    act([{ do: 'face', actor: 'vikram_stair', facing: 'up' }], V, 'Argument... settled.'),
    act(
      [
        { do: 'exit', actor: 'vikram_stair', to: at(HARBOR.stair.x, HARBOR.stair.y) },
        { do: 'exit', actor: 'crowd_a', to: at(HARBOR.stair.x, HARBOR.stair.y), async: true },
        { do: 'exit', actor: 'crowd_b', to: at(HARBOR.stair.x + 1, HARBOR.stair.y), async: true },
        { do: 'exit', actor: 'crowd_c', to: at(HARBOR.stair.x, HARBOR.stair.y), async: true },
        { do: 'exit', actor: 'crowd_d', to: at(HARBOR.stair.x + 1, HARBOR.stair.y) },
      ],
      '',
      'He walks off up the stair into the bazaar, his curved sword under one arm. The crowd drifts after him.',
    ),
    say(Z, 'He won.'),
    say(Y, 'He can\'t breathe.'),
    say(Z, 'He still won.', { set: { 'story.vikram_seen': true } }),
    act([{ do: 'exit', actor: 'dyer', to: at(HARBOR.stair.x, HARBOR.stair.y) }], 'dyer', 'Twelfth this month. He argues on one breath and wins on the next.'),
  ]),
  simple('trader_ship', [nar('The Zetwal trader that brought you, gold sails furled. Her crew are buying salt by the sack.')]),
  simple('harbor_chain', [
    nar('The great chain: links as long as an arm, black with oil and salt, from the chain tower to the far mole.'),
    { if: { notFlag: 'story.court_heard' }, speaker: '', text: 'Somebody has painted a number on the first link in Crown violet.' },
  ]),
  script('tower_gate', {
    start: { lines: [], next: [{ if: { flag: 'side.lamp_relay.done' }, to: 'left' }, { to: 'shut' }] },
    shut: { lines: [nar('The chain tower\'s gate, chained. A new padlock, and an old keyhole under it nobody has used in years.')] },
    left: { lines: [nar('The chain tower\'s gate, chained. The night lamp\'s hour has not come.'), ...LEFT] },
  }),
  simple('tower_enforcer_talk', [
    say(EN, 'Store\'s closed. Chain\'s closed. Everything\'s closed. Go and pray about it.'),
    ...LEFT,
  ]),
  simple('store_enforcer_a_talk', [say(EN, 'The Seth\'s store. The Seth\'s jars. The Seth\'s quay, as far as you are concerned.')]),
  simple('store_enforcer_b_talk', [say(EN, 'No oil today. No oil tomorrow. Ask the Exchange; the Exchange will ask the Seth.')]),
  script('chain_lamp', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_lamp' }, to: 'lit' }, { to: 'dark' }] },
    dark: { lines: [nar('The chain lamp: a brass bowl the size of a cartwheel, a wick as thick as a wrist. Dark.')] },
    lit: { lines: [nar('The chain lamp burns over the harbor. It has burned for fifty years and two nights; nobody can say why it went dark.')] },
  }),
  simple('capstan', [nar('The chain\'s capstan, iron and oak. Turned by forty hands, the old song says. Rusted at the pawl.')]),
  script('tower_bracket', {
    start: { lines: [], next: [{ if: { flag: 'anchor.tower_mirror' }, to: 'mirror' }, { to: 'bare' }] },
    bare: { lines: [nar('On the old watchtower beside the lamp, a bare iron bracket, bolted to face the town.')] },
    mirror: { lines: [nar('A bronze mirror in the old watchtower\'s bracket, faced at the temple quarter. It has been there fifty years.')] },
  }),
  simple('store_doors', [nar('The oil store\'s doors, chained, a Crown-cut lock on the chain. Behind them, jars. The smell of oil comes through the cracks.')]),
  script('strongbox', {
    start: { lines: [], next: [{ if: { flag: 'story.dhanraj_beaten' }, to: 'open' }, { to: 'shut' }] },
    shut: { lines: [nar('An iron strongbox among the jars, locked.')] },
    open: { lines: [nar('The Seth\'s strongbox, open and empty.')] },
  }),
  simple('balance_lock', [nar('A brass balance lock on a door at the back of the store, three jar-weights beside it. It does not turn for you. Not yet.')]),
  simple('factor_launch', [nar('A launch with an Aldermoor violet pennant, tied at the store\'s steps. Its crew are ashore. A ledger-box in the stern, locked.')]),
  script('lane_jars', {
    start: { lines: [nar('Jars stacked against the sea wall, blocking the lane behind the carts. Nobody comes this way.')] },
  }),
  simple('jw_harbour_master_talk', [
    say('jw_harbour_master', 'Namaste, envoy. The chain? It closes the harbor at night, when there is a lamp to say so.', { translation: 'Hello' }),
    say('jw_harbour_master', 'Two years now with no lamp. Ships come in by the moon and pray.'),
  ]),
  script('salkhi_harbor_talk', {
    start: { lines: [], next: [{ if: { flag: 'ally.jwaladesh' }, to: 'end' }, { to: 'salt' }] },
    salt: { lines: [say(SK, 'Salt. I was promised grass in three countries, and I have been given soup and salt.')] },
    end: { lines: [say(SK, 'No grass. I have stopped asking.')] },
  }),
  script('salkhi_bazaar_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.flats_seen' }, to: 'gate' }, { to: 'reads' }] },
    reads: { lines: [say(SK, 'Lamps with nothing in them. A city of them. I understand the feeling.')] },
    gate: { lines: [say(SK, 'I will not go onto the salt. The salt gets into my feet and my opinions.')] },
  }),

  // ---- Beat 1: the Lamp Bazaar and Aiyana's roof ------------------------------------------------------------------
  simple('bazaar_arrive', [
    nar('The Lamp Bazaar: lanes of brass lamps, polished and priced, and not a drop of oil in any of them.', { fx: 'fade' }),
    act([{ do: 'look', actor: 'player' }], '', 'In the middle of the old white domes stands one new brick tower: the Oil Exchange. A brass board at its foot.'),
    say(S, 'Forty the measure. Was four. I would like to meet whoever wrote the four.'),
    nar('On rooftops round the bazaar, bronze mirrors lie turned face-down.'),
    say(Y, 'Somebody on that low roof by the dyers is arguing with a bolt.'),
  ]),
  simple('aiyana_meet', [
    act(
      [{ do: 'look', actor: 'npc:aiyana' }, { do: 'wait', ms: 500 }],
      '',
      'On the dyers\' roof a woman in a leather apron over saffron lies on her back under a mirror\'s bracket, a wrench in her hand.',
    ),
    say(AI, 'Whoever you are, hold this.'),
    act([{ do: 'walk', actor: 'azzy', to: at(BAZAAR.aiyana.x + 2, BAZAAR.aiyana.y + 1), facing: 'up' }, { do: 'wait', ms: 700 }], '', 'Azzy stops at the top of the stair.'),
    act([{ do: 'walk', actor: 'azzy', to: at(BAZAAR.aiyana.x + 1, BAZAAR.aiyana.y), facing: 'left' }], '', 'Then he crosses the roof and takes the wrench.'),
    say(Z, 'Titi Aiyana.'),
    act([{ do: 'face', actor: 'npc:aiyana', facing: 'right' }, { do: 'wait', ms: 600 }], '', 'She slides out, sits up, looks at him, looks at the wrench, and takes it back.'),
    say(AI, 'Azriel. You\'ve got your grandfather\'s hands. Don\'t waste them holding things.'),
    act([{ do: 'face', actor: 'npc:aiyana', facing: 'player' }], AI, 'You\'re the Zetwal envoy. Kayla wrote. Three lines, which for Kayla is a lot.'),
    say(AI, 'Here is what I will talk about. These mirrors were turned down eleven days ago, by an order that calls it cleaning.'),
    say(AI, 'The chain lamp has been dark two years. And the flame in that temple is the height of my thumb.'),
    say(AI, 'I measured it this morning. I\'m the only one allowed to.'),
    say(G, 'Who are you, here?'),
    say(AI, 'The Court\'s engineer of the great flame. The wick, the mirrors, the chain lamp\'s oil. Whatever burns, I keep.'),
    say(AI, 'The Court sits at noon, when the lamp-sellers close for the heat. Go and be refused by my employers.'),
    say(AI, 'Then come and find me. I have a key nobody has asked me for in two years.', { set: { 'story.aiyana_met': true } }),
  ]),
  script('aiyana_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.beam_at_temple' }, to: 'after' },
        { if: { flag: 'story.rooftops_entered' }, to: 'roofs' },
        { if: { flag: 'story.court_heard' }, to: 'day' },
        { if: { flag: 'story.aiyana_met' }, to: 'noon' },
        { to: 'meet' },
      ],
    },
    meet: { lines: [nar('A woman under a mirror\'s bracket, swearing at a bolt.')], next: 'noon' },
    noon: { lines: [say(AI, 'The Court sits at noon. Go and be refused. I\'ll be here measuring things.')] },
    day: {
      lines: [
        say(AI, 'The runners on the temple steps still practise the relay with nothing to carry. Go and see why.'),
        say(AI, 'And the junior priest wants to tell you something his Court told him not to. He\'s in the colonnade, pretending to sweep.'),
        say(AI, 'The night lamp\'s hour is after dark. The watch changes then. I\'ll be at the chain tower.'),
      ],
    },
    roofs: { lines: [say(AI, 'Three of them turn now. I don\'t turn mirrors; I make them turnable. That\'s the job.')] },
    after: { lines: [say(AI, 'A thumb and a half, and the beam on it. I\'ll write it down.')] },
  }),
  simple('dyer_mirror', [nar('A bronze mirror on the dyers\' roof, face-down in its bracket. The dust on it says it was not cleaning that turned it.')]),
  simple('down_mirror', [nar('A mirror on a far rooftop, turned face-down. "By order of the Court. For cleaning." The dust on it says otherwise.')]),
  script('roof_ladder_wait', {
    start: { lines: [], next: [{ if: { flag: 'story.tower_open' }, to: 'tower' }, { to: 'shut' }] },
    shut: { lines: [nar('A ladder up to the higher roofs, a padlock through its bottom rung. Aiyana\'s padlock, by the look of it.')] },
    tower: { lines: [nar('The ladder to the higher roofs. There is nothing up there to turn a mirror for while the chain lamp is dark.')] },
  }),
  simple('price_board', [nar('A brass price-board, freshly chalked: "Oil: 40 the measure." Under it, scratched into the brass by somebody: "Was 4."')]),
  simple('exchange_tower', [nar('The Oil Exchange: new brick, taller than anything round it. It stands right in the line from the harbor to the temple.')]),
  simple('jw_board', [
    nar('The contract board: "Escort a salt caravan. The Seth\'s enforcers took the last one." "Run the lamp relay: the runners\' hall."'),
    nar('And: "Clean the rooftop mirrors. Ask the engineer." Somebody has added: "She will not let you."'),
  ]),
  simple('dark_shrine', [nar('A street shrine the size of a cupboard, its little lamp dark and its bowl dry.')]),
  script('shrine_child_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.dhanraj_beaten' }, to: 'after' }, { to: 'dark' }] },
    dark: { lines: [say('shrine_child', 'It went out. It never went out before.')] },
    after: { lines: [say('shrine_child', 'The runners came past with oil. They said mine is next. I am waiting.')] },
  }),
  simple('jw_milk_talk', [say('jw_milk', 'Namaste! Spiced milk, flatbread, lentil stew. No oil in the stew. Nobody can tell.', { translation: 'Hello!' })]),
  simple('jw_beads_talk', [say('jw_beads', 'Namaste. Brass lamp charms. The lamp is empty, but the charm still works.', { translation: 'Hello.' })]),
  simple('jw_swordsmith_talk', [say('jw_swordsmith', 'Dhanyavaad for asking. Talwars, scale, and whatever Kirinoura sends us.', { translation: 'Thank you' })]),
  simple('jw_librarian_talk', [say('jw_librarian', 'Namaste. Nine bundles on three shelves. Palm leaves tear: turn them gently.', { translation: 'Hello.' })]),

  // ---- J-2 The Lamp Relay: the runners, their hearth's memory (M-JWA-1), the gusts -------------------------------
  script('chief_runner_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.dhanraj_beaten' }, to: 'after' },
        { if: { flag: 'side.lamp_relay.done' }, to: 'done' },
        { if: { flag: 'item.relay_lamp' }, to: 'arrived' },
        { if: { flag: 'clue.relay_route' }, to: 'lamp' },
        { if: { flag: 'side.lamp_relay.accepted' }, to: 'hearth' },
        { if: { flag: 'story.court_heard' }, to: 'ask' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [say(CR, 'The runners do not run today. There is nothing to carry.')] },
    ask: {
      lines: [
        say(CR, 'Every new moon for fifty years the runners carried the sea\'s fire from the chain lamp to the wick.'),
        say(CR, 'Harbor to temple before it gutters, and the wind off the sea tries to put it out the whole way.'),
        say(CR, 'The chain lamp has been dark two years. We practise with kitchen fire so we don\'t forget the way.'),
        say(CR, 'Nobody has told us to stop.', { set: { 'side.lamp_relay.accepted': true } }),
      ],
      next: 'hearth',
    },
    hearth: { lines: [say(CR, 'The way is older than me. The hearth remembers it better than I do.')] },
    lamp: {
      lines: [
        act([{ do: 'look', actor: 'npc:chief_runner' }, { do: 'wait', ms: 500 }], '', 'The chief runner lights a lamp at the hearth and puts it in Gianna\'s hands.', { set: { 'item.relay_lamp': true } }),
        say(CR, 'From the harbor stair\'s head to these steps, before it gutters. Not the main street. Never the main street.'),
        say(CR, 'We will walk you down. The run starts there.', { fx: 'fade', set: { 'travel.next': 'jwaladesh-bazaar/stair_head' } }),
      ],
    },
    arrived: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:chief_runner', to: at(BAZAAR.hallBracket.x + 1, BAZAAR.hallBracket.y + 1), facing: 'up' }, { do: 'wait', ms: 600 }, { do: 'sync' }],
          '',
          'The chief runner takes the lamp, still burning, and sets it in the hall\'s bracket.',
          { set: { 'item.relay_lamp': false, 'side.lamp_relay.done': true } },
        ),
        say(CR, 'That\'s the way. When there\'s something to carry, you\'ll know it.'),
        say(CR, 'Wear these. The runners\' beads. Fire likes them.'),
      ],
    },
    done: { lines: [say(CR, 'Left at the dyers, through the arch, along the wall. The sea-wall lane on the quay is the same idea.')] },
    after: { lines: [say(CR, 'We ran it for real. With oil. My knees will tell me about it for a month.')] },
  }),
  simple('runner_talk', [say('runner', 'We practise with kitchen fire. It is not the same. Kitchen fire does not want to get home.')]),
  simple('hall_bracket', [nar('The runners\' hall bracket, where the sea\'s fire came home every new moon.')]),
  simple('runners_hearth', [nar('The runners\' hearth, banked low. Kitchen fire.')]),
  simple('relay_gust', [
    nar('The wind comes off the sea up the main street. The lamp gutters, and goes out.', { fx: 'shake' }),
    say('runner', 'Not the main street. Never the main street. Again, from the stair.', { fx: 'fade', set: { 'travel.next': 'jwaladesh-bazaar/stair_head' } }),
  ]),
  simple('relay_not_that_way', [say('runner', 'Not that way, envoy. The lamp goes up the hill, to the temple steps.')]),
  script('runners_echo', {
    start: { lines: [], next: [{ if: { flag: 'clue.relay_route' }, to: 'again' }, { to: 'first' }] },
    again: { lines: [nar('The runners\' hall, fifty years ago. The hearth roars; the runners are out on the hill.')] },
    first: {
      lines: [
        nar('The same steps, fifty years ago. The hearth roars, and three runners in saffron take their lamps from it.', { fx: 'fade' }),
        act(
          [
            { do: 'enter', actor: 'echo_runner_a', look: 'echo_runner', from: at(BAZAAR.hearth.x + 1, BAZAAR.hearth.y + 1), to: at(BAZAAR.zone.x + 1, BAZAAR.zone.y + 2), facing: 'up' },
            { do: 'look', actor: 'echo_runner_a' },
          ],
          'echo_runner',
          'Never the main street, Marshal. Left at the dyers, through the arch, along the wall.',
        ),
        act(
          [
            { do: 'walk', actor: 'echo_runner_a', to: at(3, 5), run: true },
            { do: 'walk', actor: 'echo_runner_a', to: at(BAZAAR.arch.x + 1, BAZAAR.arch.y), run: true },
            { do: 'look', actor: 'echo_runner_a' },
          ],
          '',
          'She runs: along the top lane, down the wall, through the arch...',
        ),
        act(
          [{ do: 'exit', actor: 'echo_runner_a', to: at(BAZAAR.stairHead.x, BAZAAR.stairHead.y), run: true }, { do: 'look', actor: 'player' }],
          '',
          '...and along the dyers\' lane to the harbor stair. The other two follow her, the same way, every step.',
          { set: { 'clue.relay_route': true } },
        ),
        say(P, '(Left at the dyers, through the arch, along the wall. Coming up the hill, it runs the other way round.)'),
        nar('There is no brick tower in the bazaar. Old white domes stand where it will be.'),
      ],
    },
  }),
  simple('echo_runner_talk', [say('echo_runner', 'The sea\'s fire goes home tonight. Never the main street, Marshal.')]),

  // ---- J-3 The Anonymous Oil: the junior priest, the salt road, the carter, the back gate -------------------------
  script('junior_priest_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.anonymous_oil.done' }, to: 'done' },
        { if: { flag: 'story.salt_road_cleared' }, to: 'gate' },
        { if: { flag: 'side.anonymous_oil.accepted' }, to: 'waiting' },
        { if: { flag: 'story.court_heard' }, to: 'ask' },
        { to: 'sweep' },
      ],
    },
    sweep: { lines: [nar('A young priest sweeps the same tile of the colonnade, over and over.')] },
    ask: {
      lines: [
        say(JP, 'Oil comes to the back gate. Not from the Seth. From nobody.'),
        say(JP, 'A carter from the salt road, every few nights, with jars he will not be paid for. The Court takes it and does not ask.'),
        say(JP, 'Tonight he is late, and the Seth\'s men have started watching the salt road.'),
        say(JP, 'If you were going that way. The salt gate is east of the bazaar.', { set: { 'side.anonymous_oil.accepted': true } }),
      ],
    },
    waiting: { lines: [say(JP, 'The salt road, east of the bazaar. He waits at the shrine at the road\'s end.')] },
    gate: { lines: [say(JP, 'The carter is at the back gate? Then I had better stop sweeping.')] },
    done: { lines: [say(JP, 'Nobody, again. I write it down as "nobody". The ledger is getting long.')] },
  }),
  simple('flats_arrive', [
    nar('The Salt Flats: white pans to the edge of sight under an orange sky, and the caravan road across them.', { fx: 'fade' }),
    say(BY, 'Stay on the road. Jackals in the pans. And worse than jackals.'),
  ]),
  script('carter_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'encounter.jwaladesh_story.salt_road.won' }, to: 'after' },
        { if: { flag: 'side.anonymous_oil.accepted' }, to: 'meet' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say(CT, 'A cart of jars and a man who is resting. Walk on, envoy.')] },
    meet: {
      lines: [
        act([{ do: 'face', actor: 'npc:carter', facing: 'player' }], CT, 'The jars are for the wick. Nobody sent them. Write that down, if you must write something.'),
        act(
          [
            { do: 'enter', actor: 'road_enforcer_a', look: 'oil_enforcer', from: at(30, 13), to: at(38, 13), facing: 'right', async: true },
            { do: 'enter', actor: 'road_enforcer_b', look: 'oil_enforcer', from: at(30, 14), to: at(38, 14), facing: 'right', async: true },
            { do: 'enter', actor: 'road_enforcer_c', look: 'oil_enforcer', from: at(29, 13), to: at(37, 13), facing: 'right' },
            { do: 'look', actor: 'road_enforcer_a' },
          ],
          '',
          'Three Oil Enforcers come up the road behind the party, flasks at their belts.',
          { fx: 'shake' },
        ),
        say(EN, 'The Seth\'s contract says every jar on this road is his.'),
        say(BY, 'The road says otherwise.', { set: { 'battle.next': 'salt_road_enforcers', 'battle.after': 'salt_road_after' } }),
      ],
    },
    after: { lines: [], next: 'seals' },
    ...carterSealNodes(),
  }),
  script('salt_road_after', { start: { lines: [], next: 'seals' }, ...carterSealNodes() }),
  simple('carter_cart', [nar('A cart of jars under sacking. The sacking is tied with a runner\'s knot.')]),
  simple('salt_shrine', [nar('A Four Hands shrine at the salt road\'s end, its lamp dark. Somebody has left a jar of oil at its foot, sealed.')]),
  simple('crown_oil_cart', [nar('A Crown oil-cart, empty, heading for the coast. Its driver is asleep under it in the only shade for a mile.')]),
  simple('jackal_den', [nar('A den in the salt crust. Something inside it is chewing, and sparks.')]),
  script('carter_gate_talk', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:carter_gate' }], CT, 'The back gate, envoy. Same as ever.'),
        act(
          [{ do: 'walk', actor: 'npc:junior_priest', to: at(COURT.carter.x, COURT.carter.y - 1), facing: 'left' }, { do: 'wait', ms: 700 }],
          '',
          'The junior priest comes down from the colonnade and takes the jars in at the back gate, one by one.',
        ),
        say(JP, 'Nobody. Again. I have stopped asking and started counting.', { set: { 'side.anonymous_oil.done': true } }),
        act([{ do: 'exit', actor: 'npc:carter_gate', to: at(COURT.backGate.x + 1, COURT.backGate.y) }], '', 'The carter goes out by the kitchen lane without a word.'),
      ],
    },
  }),
  simple('back_gate', [nar('The Court\'s back gate, on the kitchen lane. A broom leans by it.')]),

  // ---- Beat 2: the Court of the Flame at noon, and the duel ------------------------------------------------------
  script('court_doors_wait', {
    start: { lines: [], next: [{ if: { flag: 'item.relay_lamp' }, to: 'lamp' }, { to: 'noon' }] },
    noon: { lines: [say(CH, 'The Court sits at noon, envoy. Not before.')] },
    lamp: { lines: [say('runner', 'Not that way, envoy. The lamp goes up the hill, to the temple steps.')] },
  }),
  script('court_hearing', {
    start: {
      lines: [
        nar('The Court of the Flame at noon: a long colonnade to an altar curtained in saffron silk.', { fx: 'fade' }),
        act(
          [{ do: 'look', actor: 'npc:jw_chamberlain' }, { do: 'walk', actor: 'npc:jw_chamberlain', to: at(COURT.chamberlain.x - 2, COURT.sceneRow - 2), facing: 'down' }],
          CH,
          'The envoy of Zetwal, spoken for by Ironvow and by Suzumori.',
        ),
        act([{ do: 'look', actor: 'npc:meera' }], ME, 'Spoken for by the people who burned our temple. Put their crane on the step. I will not have it on the altar.'),
        act(
          [{ do: 'walk', actor: 'haru', to: at(COURT.craneStep.x, COURT.craneStep.y + 1), facing: 'up' }, { do: 'wait', ms: 700 }, { do: 'sync' }],
          '',
          'Haru sets the Suzumori crane on the lowest step of the altar, and steps back. He says nothing.',
          { set: { 'story.crane_refused': true, 'item.token_suzumori': false } },
        ),
        { if: { flag: 'clue.seventh_clause_read' }, speaker: ME, text: 'We heard the Throne\'s page too. The ash, it called us. The Crown has always known what we would be left with.' },
        say(ME, 'The flame is well. That is the Court\'s word, and the Court has one word.'),
        say(ME, 'Nobody sees it; the Keepers tend it. If the city believed the flame was failing, the city would fail with it.'),
        say(ME, 'And the Crown is standing in my pavilion waiting for exactly that.'),
        act([{ do: 'walk', actor: 'npc:senior_keeper', to: at(COURT.keeper.x - 1, COURT.keeper.y + 2), facing: 'down' }], KP, 'The flame is well.'),
        act(
          [{ do: 'walk', actor: 'npc:junior_priest', to: at(COURT.junior.x + 1, COURT.junior.y - 1), facing: 'up' }],
          JP,
          'The flame is the height of a thumb, and the oil is in a warehouse on the quay.',
        ),
        say(JP, 'And the man who owns the warehouse is drinking our milk.'),
        say(ME, 'Sit down. Both.'),
      ],
      next: 'offer',
    },
    offer: {
      lines: [
        act(
          [{ do: 'look', actor: 'npc:oil_factor' }, { do: 'walk', actor: 'npc:oil_factor', to: at(13, 10), facing: 'right' }],
          OF,
          'The Throne\'s offer stands as written: oil for the temple for ten years, from the Throne\'s own stores.',
        ),
        say(OF, 'In exchange for the keeping of the Harbor Chain. The Throne would of course keep the lamp lit.'),
        act([{ do: 'look', actor: 'npc:dhanraj_guest' }], '', 'Beside the factor, a merchant in white with a ledger under his arm bows exactly, and says nothing.'),
        say(ME, 'For fifty years the runners carried the wick\'s fire from the chain lamp. That chain is where our fire came from.'),
        say(ME, 'It is also all we have left that anyone wants to buy.'),
        act([{ do: 'look', actor: 'player' }], G, 'Zetwal\'s envoy asks one thing of Jwaladesh: that it not sell the chain to the Crown before the Muster.'),
        say(G, 'Let the flame be seen. Elodie remembers what is hidden; she does not punish it.'),
        say(ME, 'Your goddess remembers. Ours burns or it does not. No.'),
      ],
      next: 'vikram',
    },
    vikram: {
      lines: [
        act(
          [{ do: 'look', actor: 'npc:vikram_npc' }, { do: 'walk', actor: 'npc:vikram_npc', to: at(COURT.vikram.x - 2, COURT.vikram.y + 1), facing: 'up' }],
          V,
          'Mother. The flame is dying, and everybody in this room knows it.',
        ),
        say(V, 'And the envoy is the first person to say so in my hearing... who is not me.'),
        say(ME, 'Vikram. You have fought eleven duels this month.'),
        say(V, 'Twelve.'),
        act([{ do: 'face', actor: 'npc:vikram_npc', facing: 'player' }], V, 'And you. Remembers what is hidden. Your goddess watches a flame die and writes it down.'),
        say(V, 'Hesitation is the only true death. Remembering is hesitation with a pen.'),
        say(G, 'Then stop hesitating and show it.'),
        say(V, 'That is an argument. I settle arguments.', { set: { 'story.vikram_challenged': true } }),
        act([{ do: 'look', actor: 'npc:jw_chamberlain' }], CH, 'The yard.'),
        act(
          [{ do: 'walk', actor: 'npc:vikram_npc', to: at(COURT.yardCentre.x, COURT.yardCentre.y), facing: 'left' }, { do: 'walk', actor: 'yari', to: at(COURT.yard.x - 1, COURT.yardCentre.y + 1), facing: 'right' }],
          '',
          'The duel yard: sand, and a rope round it. Gianna steps over the rope alone. Anissa holds it.',
        ),
        say(Y, 'He\'s already out of breath.'),
        say(G, 'Then it\'s a fair fight.', { set: { 'battle.next': 'duel_yard_vikram' } }),
      ],
    },
  }),
  simple('duel_again', [
    act(
      [{ do: 'place', actor: 'vikram_yard', look: 'vikram', at: at(COURT.yardCentre.x, COURT.yardCentre.y), facing: 'left' }, { do: 'look', actor: 'vikram_yard' }],
      V,
      'Again. The yard... is still here. So am I.',
    ),
    say(G, 'Then we finish it.', { set: { 'battle.next': 'duel_yard_vikram' } }),
  ]),
  script('vikram_after', {
    start: {
      lines: [act([{ do: 'place', actor: 'vikram_yard', look: 'vikram', at: at(COURT.yardCentre.x, COURT.yardCentre.y), facing: 'down' }, { do: 'look', actor: 'vikram_yard' }], '', 'Vikram, bent double in the sand, hands on his knees.')],
      next: [{ if: { flag: 'choice.duel_lost' }, to: 'lost' }, { to: 'won' }],
    },
    won: { lines: [say(V, 'You argue... well. Breathing... is harder.', { set: { 'choice.duel_won': true } })], next: 'settled' },
    lost: { lines: [say(V, 'I win. I think. Give me... a moment... to be sure.')], next: 'settled' },
    settled: {
      lines: [
        act([{ do: 'face', actor: 'vikram_yard', facing: 'player' }], V, 'The Keepers turned the mirrors down so nobody sees the chain lamp is dead.'),
        say(V, 'The lamp is dead because the store\'s chained. The store\'s chained because the Seth owns the oil.'),
        say(V, 'And the Crown owns the Seth. Argument settled.'),
        say(V, 'Now somebody has to do something, and in this house... that is apparently me.'),
        act([{ do: 'walk', actor: 'npc:meera', to: at(COURT.yard.x - 2, COURT.yardCentre.y - 2), facing: 'right' }], ME, 'You will do nothing. The Court has one word.'),
        say(V, 'Then I\'ll borrow the envoy\'s.'),
        act([{ do: 'exit', actor: 'vikram_yard', to: at(COURT.door.x, COURT.door.y - 1) }], '', 'He goes out through the colonnade, still breathing hard, to find the engineer.'),
      ],
      next: 'day',
    },
    day: {
      lines: [
        say(G, 'The runners on the temple steps. A priest with a broom. And the two arguing on the spice row.'),
        say(A, 'Your Quests page, Gigi.', { set: { 'story.court_heard': true } }),
      ],
    },
  }),
  script('meera_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'ally.jwaladesh' }, to: 'after' },
        { if: { flag: 'story.flame_seen' }, to: 'night' },
        { if: { flag: 'story.court_heard' }, to: 'day' },
        { to: 'noon' },
      ],
    },
    noon: { lines: [say(ME, 'The Court sits, envoy. Walk up the colonnade if you mean to be heard.')] },
    day: { lines: [say(ME, 'The Court has one word, envoy. I have said it.')] },
    night: { lines: [say(ME, 'The city has seen it. I cannot unsay what the city has seen.')] },
    after: { lines: [say(ME, 'He is right about one thing a day, envoy. Find the one.')] },
  }),
  script('senior_keeper_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.dhanraj_beaten' }, to: 'after' }, { to: 'well' }] },
    well: { lines: [say(KP, 'The flame is well.')] },
    after: { lines: [say(KP, 'The flame was to be kept. It is burning. I am not convinced those are the same thing.')] },
  }),
  script('jw_chamberlain_talk', {
    start: { lines: [], next: [{ if: { flag: 'ally.jwaladesh' }, to: 'after' }, { to: 'day' }] },
    day: { lines: [say(CH, 'The Court sits at noon and hears envoys at the colonnade\'s head. Duels are in the yard, by appointment. Mostly.')] },
    after: { lines: [say(CH, 'A token for the chamberlain\'s chair. I do not know which chair. I am a chamberlain; I approve of chairs.')] },
  }),
  simple('oil_factor_talk', [say(OF, 'Envoy. The Throne buys and sells oil like anyone. It is a perfectly lawful business.')]),
  simple('dhanraj_guest_talk', [nar('The merchant in white bows exactly. "Seth Dhanraj. I deal in oil. I do not deal in conversation."')]),
  simple('vikram_npc_talk', [say(V, 'I am... listening. Breathing and listening. Go on.')]),
  simple('dhanraj_kneeling_talk', [say(DH, 'I signed the store over at dawn, envoy. I was paid to hold. I was never told why.')]),
  script('court_altar', {
    start: { lines: [], next: [{ if: { flag: 'story.dhanraj_beaten' }, to: 'tall' }, { if: { flag: 'story.flame_seen' }, to: 'thumb' }, { to: 'curtain' }] },
    curtain: { lines: [nar('The altar, curtained in saffron silk. The curtain is new. The rings are polished. Someone put it up this month.')] },
    thumb: { lines: [nar('A dry bowl, and a flame the height of a thumb in the beam. Still burning. It never went out.')] },
    tall: { lines: [nar('The flame burns tall in a full bowl of oil. The sun comes through the wick-window onto it.')] },
  }),
  script('court_window', {
    start: { lines: [], next: [{ if: { flag: 'story.beam_at_temple' }, to: 'lit' }, { to: 'grey' }] },
    grey: { lines: [nar('A round window over the altar, its glass gone grey. The light from the sea used to fall through it onto the wick.')] },
    lit: { lines: [nar('The wick-window, full of light from the roofs.')] },
  }),
  simple('crane_step', [nar('The Suzumori crane on the altar\'s lowest step, where Haru set it.')]),
  simple('crane_altar', [nar('The Suzumori crane, on the altar beside the flame, for the night.')]),

  // ---- Beat 4: the chain tower at night, Arjun's charge (the Echo; SIG-JWA part 1) --------------------------------
  script('tower_open', {
    start: {
      lines: [
    act(
      [{ do: 'walk', actor: 'npc:aiyana', to: at(HARBOR.gate.x, HARBOR.gate.y + 1), facing: 'up' }, { do: 'look', actor: 'npc:aiyana' }],
      AI,
      'The watch changes at the night lamp. There isn\'t one. So they change when they feel like it, and they feel like it about now.',
    ),
    act([{ do: 'wait', ms: 700 }, { do: 'sync' }], '', 'She puts an old key in the old keyhole under the new padlock. Both come away.', { set: { 'story.tower_open': true } }),
    act([{ do: 'walk', actor: 'npc:aiyana', to: at(HARBOR.lamp.x + 1, HARBOR.lamp.y + 1), facing: 'up' }], AI, 'The reservoir. One measure, every new moon, from my own pay.'),
    say(AI, 'Enough for one night of the lamp. Not enough for a temple. Nobody has told me to stop.'),
    act([{ do: 'look', actor: 'npc:aiyana' }], AI, 'Arjun\'s lamp. Arjun\'s bracket on the old tower, with nothing in it. Arjun\'s platform, where the air does that.'),
      ],
      next: 'door',
    },
    door: {
      lines: [
        act([{ do: 'walk', actor: 'follower', to: at(HARBOR.gate.x, HARBOR.gate.y), facing: 'down' }], A, 'I\'ll watch the quay, Gigi.'),
        act([{ do: 'face', actor: 'npc:aiyana', facing: 'down' }], AI, 'If you see a lantern, say so. Don\'t shout. Just say it.'),
        act([{ do: 'look', actor: 'player' }], A, 'It\'s shimmering by the lamp, Gigi.'),
      ],
    },
  }),
  simple('quay_watch', [
    act(
      [
        { do: 'enter', actor: 'watch_a', look: 'oil_enforcer', from: at(HARBOR.watchX, HARBOR.watchRows[1]), to: at(HARBOR.watchX + 1, 8), facing: 'left', async: true },
        { do: 'enter', actor: 'watch_b', look: 'oil_enforcer', from: at(HARBOR.watchX + 1, HARBOR.watchRows[0]), to: at(HARBOR.watchX + 1, 6), facing: 'left' },
        { do: 'look', actor: 'watch_a' },
      ],
      EN,
      'Night watch. The quay is the Seth\'s after dark.',
      { fx: 'shake' },
    ),
    say(BY, 'Then we are trespassing. Good.', { set: { 'battle.next': 'quay_watch', 'battle.after': 'quay_watch_after' } }),
  ]),
  simple('quay_watch_after', [nar('The watch run for the store, lanterns swinging.'), say(H, 'The lane behind the carts was quieter. For next time.')]),
  script('arjun_echo', {
    start: {
      lines: [],
      next: [{ if: { flag: 'clue.arjun_charge' }, to: 'again' }, { if: { flag: 'clue.arjun_seen' }, to: 'seen' }, { to: 'first' }],
    },
    again: { lines: [nar('The chain tower, fifty years ago. The lamp burns; the chain lies slack in the water. Arjun watches his riders home.')] },
    seen: { lines: [nar('The chain tower, fifty years ago. The taper is in Patricio\'s hand. Arjun is watching the chain.', { stage: placeRiders })] },
    first: {
      lines: [
        nar('Fifty years ago. The Crown\'s fleet lies beyond the chain, and tonight the chain is the Crown\'s.', { fx: 'fade', stage: placeRiders }),
        act([{ do: 'look', actor: 'npc:arjun' }, { do: 'face', actor: 'npc:arjun', facing: 'player' }], AR, 'Marshal. Caona\'s canoe brought you in under their noses. She\'s gone back for the ships.'),
        nar('Benny is with the Zetwal ships. Seven riders wait on the quay below, lances up.'),
        say(AR, 'When the lamp is lit, your ships come in. When the chain falls, my riders come home.'),
      ],
      choices: [
        { text: 'Seven riders against a tower?', set: { 'choice.patricio_arjun': 'seven' }, next: 'seven' },
        { text: 'Let my marines take it.', set: { 'choice.patricio_arjun': 'marines' }, next: 'marines' },
      ],
    },
    seven: { lines: [say(AR, 'Hesitation is the only true death. I have seven who believe it.')], next: 'taper' },
    marines: { lines: [say(AR, 'Then it would be Zetwal\'s chain. It is going to be ours.')], next: 'taper' },
    taper: {
      lines: [
        act(
          [{ do: 'walk', actor: 'npc:arjun', to: at(HARBOR.zone.x + 1, HARBOR.zone.y + 1), facing: 'up' }, { do: 'wait', ms: 600 }],
          '',
          'Arjun puts a lit taper in Patricio\'s hand, and closes his own hand over it.',
        ),
        say(AR, 'Two hands. The signal is for your ships; the fire is ours.', { set: { 'clue.arjun_seen': true } }),
        say(P, '(The lamp, on the platform\'s end. The taper is in my hand.)'),
      ],
    },
  }),
  script('arjun_lamp', {
    start: { lines: [], next: [{ if: { flag: 'clue.arjun_seen' }, to: 'light' }, { to: 'ready' }] },
    ready: { lines: [nar('The chain lamp, fifty years ago: full of oil, the wick trimmed, unlit. Arjun is watching the chain.')] },
    light: {
      lines: [
        nar('The taper catches. The lamp takes the flame as if it had been waiting.', { fx: 'flash', set: { 'anchor.chain_lamp': true } }),
        act([{ do: 'sync' }, { do: 'look', actor: 'npc:arjun' }], AR, 'And the temple must see it from the hill, or the city thinks we lost.'),
        say(AR, 'The bracket on the old tower. There is a spare mirror at its foot. Bolt it, and face it at the temple.'),
      ],
      next: 'check',
    },
    check: { lines: [], next: [{ if: { flag: 'anchor.tower_mirror' }, to: 'charge' }, { to: 'wait' }] },
    wait: { lines: [nar('Arjun watches the old tower\'s empty bracket, and waits.')] },
    ...chargeNodes(),
  }),
  simple('arjun_lamp_lit', [nar('Arjun\'s lamp, burning over the Crown\'s chain.')]),
  script('spare_mirror', {
    start: { lines: [], next: [{ if: { flag: 'clue.arjun_seen' }, to: 'take' }, { to: 'look' }] },
    look: { lines: [nar('A spare bronze mirror at the watchtower\'s foot, the size of a shield.')] },
    take: { lines: [nar('Patricio lifts the spare mirror. It is heavier than it looks.', { set: { 'echo.spare_mirror': true }, stage: [{ do: 'sync' }] })] },
  }),
  script('arjun_bracket', {
    start: { lines: [], next: [{ if: { flag: 'echo.spare_mirror' }, to: 'bolt' }, { to: 'bare' }] },
    bare: { lines: [nar('The old watchtower\'s bracket, empty, bolted to face the town.')] },
    bolt: {
      lines: [
        nar('Patricio bolts the spare mirror into the bracket and faces it at the temple quarter.', { set: { 'anchor.tower_mirror': true } }),
        act([{ do: 'sync' }, { do: 'look', actor: 'npc:arjun' }], AR, 'Good. Now the hill will know.'),
      ],
      next: 'check',
    },
    check: { lines: [], next: [{ if: { flag: 'anchor.chain_lamp' }, to: 'charge' }, { to: 'wait' }] },
    wait: { lines: [say(AR, 'The lamp, Marshal. Your hand on the taper.')] },
    ...chargeNodes(),
  }),
  simple('arjun_bracket_mirror', [nar('The spare mirror, bolted in Arjun\'s bracket, faced at the temple quarter.')]),
  simple('echo_chain', [nar('The great chain, fifty years ago: the same links, across the same harbor mouth.')]),
  simple('crown_hull', [nar('A Crown hull beyond the chain, gun-ports open, lanterns lit along her rail.')]),
  simple('arjun_talk', [say(AR, 'Seven rode out. Every one of them believes it. That is what the flame is for.')]),
  script('arjun_echo_return', {
    start: { lines: [], next: [{ if: { all: [{ flag: 'anchor.chain_lamp' }, { flag: 'anchor.tower_mirror' }, { notFlag: 'story.lamp_seen_lit' }] }, to: 'lit' }, { to: 'plain' }] },
    plain: { lines: [nar('The present: the chain tower at night, the quay below it.')] },
    lit: {
      lines: [
        act([{ do: 'look', actor: 'player' }], '', 'The present. The chain lamp burns over Agnipur\'s harbor, and a mirror sits in the old tower\'s bracket.'),
        act(
          [{ do: 'enter', actor: 'aiyana_tower', look: 'aiyana', from: at(HARBOR.gate.x, HARBOR.gate.y), to: at(HARBOR.bracket.x - 1, HARBOR.bracket.y + 1), facing: 'right' }],
          AI,
          'That\'s Arjun\'s bracket. I\'ve never seen a mirror in it. Who...',
        ),
        nar('She looks at Gianna for a long moment, and does not ask.'),
        say(AI, 'Right. The roofs. Up the dyers\' stair, then my ladder. I\'ll unbolt the mirrors.'),
        act([{ do: 'exit', actor: 'aiyana_tower', to: at(HARBOR.gate.x, HARBOR.gate.y + 1), run: true }], EN, 'Who lit that? Who is up there?'),
      ],
      next: 'lantern',
    },
    lantern: { lines: [say(A, 'A lantern, Gigi. On the quay.', { set: { 'story.lamp_seen_lit': true } })] },
  }),

  // ---- Beat 5: the roofs (SIG-JWA part 2) ------------------------------------------------------------------------
  simple('roofs_arrive', [
    nar('The roofs of Agnipur: flat and white, plank bridges between them, the street a long way down.', { fx: 'fade' }),
    act(
      [
        { do: 'look', actor: 'npc:aiyana' },
        { do: 'walk', actor: 'npc:aiyana', to: at(ROOFTOPS.mirrors[2]!.x + 1, ROOFTOPS.mirrors[2]!.y), facing: 'left' },
        { do: 'wait', ms: 500 },
        { do: 'walk', actor: 'npc:aiyana', to: at(ROOFTOPS.mirrors[1]!.x + 1, ROOFTOPS.mirrors[1]!.y), facing: 'left' },
        { do: 'wait', ms: 500 },
        { do: 'walk', actor: 'npc:aiyana', to: at(ROOFTOPS.mirrors[0]!.x + 1, ROOFTOPS.mirrors[0]!.y), facing: 'left' },
        { do: 'wait', ms: 500 },
      ],
      '',
      'Aiyana goes ahead to each bracket and unbolts its "cleaning" lock with two turns of the wrench.',
    ),
    act([{ do: 'face', actor: 'npc:aiyana', facing: 'player' }], AI, 'Three of them turn now. The fourth bracket, up by the window, is rusted solid.'),
    say(AI, 'I don\'t turn mirrors. I make them turnable. That\'s the job.'),
    act([{ do: 'walk', actor: 'npc:aiyana', to: at(ROOFTOPS.aiyana.x, ROOFTOPS.aiyana.y), facing: 'left' }], H, 'The light comes in from the harbor, at the first. The tower is in the old line.'),
  ]),
  mirrorScript(1),
  mirrorScript(2),
  mirrorScript(3),
  script('disc_again', { start: { lines: [], next: 'disc' }, ...discNodes() }),
  simple('bracket_4', [nar('The fourth bracket, by the wick-window. Rusted solid, no mirror in it.')]),
  script('roof_window', {
    start: { lines: [], next: [{ if: { flag: 'story.beam_at_temple' }, to: 'lit' }, { to: 'grey' }] },
    grey: { lines: [nar('The back of the temple\'s wick-window, grey glass in a stone ring.')] },
    lit: { lines: [nar('The wick-window, full of light. Through it, far below, the curtain glows.')] },
  }),
  simple('roof_tower', [nar('The Exchange\'s new brick tower, right in the old line from the harbor to the window. Built last spring.')]),

  // ---- Beat 6: the flame (Vikram defies the priests and joins) ----------------------------------------------------
  script('flame_scene', {
    start: {
      lines: [
        nar('The Court at night. The beam falls through the wick-window onto the curtained altar. The curtain glows.', { fx: 'fade' }),
        act(
          [
            { do: 'enter', actor: 'city_a', look: 'lamp_seller', from: at(COURT.door.x, COURT.door.y - 1), to: at(15, COURT.sceneRow + 2), facing: 'up', async: true },
            { do: 'enter', actor: 'city_b', look: 'runner', from: at(COURT.door.x + 1, COURT.door.y - 1), to: at(16, COURT.sceneRow + 3), facing: 'up', async: true },
            { do: 'enter', actor: 'city_c', look: 'shrine_child', from: at(COURT.door.x, COURT.door.y - 1), to: at(19, COURT.sceneRow + 2), facing: 'up', async: true },
            { do: 'enter', actor: 'city_d', look: 'dyer', from: at(COURT.door.x + 1, COURT.door.y - 1), to: at(20, COURT.sceneRow + 3), facing: 'up' },
            { do: 'enter', actor: 'aiyana_court', look: 'aiyana', from: at(COURT.door.x, COURT.door.y - 1), to: at(18, COURT.sceneRow + 4), facing: 'up' },
            { do: 'look', actor: 'city_a' },
          ],
          '',
          'The city comes in through the doors behind them: lamp-sellers, runners, the shrine child, the dyer from the quay. Aiyana last.',
        ),
        act(
          [
            { do: 'enter', actor: 'vikram_flame', look: 'vikram', from: at(COURT.door.x, COURT.door.y - 1), to: at(COURT.altar.x, COURT.altar.y + 2), facing: 'up', run: true },
            { do: 'look', actor: 'vikram_flame' },
          ],
          '',
          'Vikram walks up the altar steps past the senior Keeper, takes the silk in both hands, and pulls.',
        ),
        act([{ do: 'wait', ms: 500 }, { do: 'sync' }], '', 'The curtain comes down. Behind it: a dry bowl, and a flame the height of a thumb, burning in the beam.', {
          fx: 'flash',
          set: { 'story.flame_seen': true },
        }),
        nar('Low. Never out. And everyone in the colonnade can see it.'),
        act([{ do: 'look', actor: 'npc:meera' }], ME, 'Vikram.'),
        act([{ do: 'face', actor: 'vikram_flame', facing: 'down' }], V, 'The Court has one word. The city has eyes.'),
        act([{ do: 'look', actor: 'npc:senior_keeper' }], KP, 'It will not last the night without oil.'),
        say(V, 'Then the night is how long we have. I am going to the quay to get the oil back. Whoever comes, comes.'),
        say(V, 'Mother, you can write it down as the thirteenth duel.'),
        act([{ do: 'look', actor: 'npc:meera' }, { do: 'wait', ms: 900 }], '', 'Meera does not answer. She sits. Then she takes the Suzumori crane from the step and sets it on the altar.'),
        say(ME, 'For the night of the flame, it sits with ours.'),
        act([{ do: 'walk', actor: 'vikram_flame', to: at(COURT.altar.x, COURT.sceneRow - 2), facing: 'down' }], V, 'Envoy. I fight with you tonight. Argue later.', { set: { 'party.vikram': true } }),
        nar('(Vikram joins the party.)'),
      ],
      next: 'keeper',
    },
    keeper: {
      lines: [
        act([{ do: 'walk', actor: 'vikram_flame', to: at(COURT.altar.x - 1, COURT.sceneRow - 1), facing: 'down' }, { do: 'wait', ms: 500 }], '', 'Vikram crouches to Anissa\'s height.'),
        say(V, 'You held the last mirror. In this house, that makes you a Keeper of the Flame.', { set: { 'story.anissa_keeper': true } }),
        act([{ do: 'look', actor: 'follower' }, { do: 'wait', ms: 700 }], '', 'Anissa says nothing. She looks at the flame.'),
      ],
      next: 'out',
    },
    out: {
      lines: [
        act([{ do: 'look', actor: 'aiyana_court' }], AI, 'A thumb and a half, in the beam. I\'ll write it down. Then I\'ll find you oil.'),
        act(
          [
            { do: 'exit', actor: 'vikram_flame', to: at(COURT.door.x, COURT.door.y - 1), async: true },
            { do: 'exit', actor: 'city_a', to: at(COURT.door.x, COURT.door.y - 1), async: true },
            { do: 'exit', actor: 'city_b', to: at(COURT.door.x + 1, COURT.door.y - 1), async: true },
            { do: 'exit', actor: 'city_c', to: at(COURT.door.x, COURT.door.y - 1), async: true },
            { do: 'exit', actor: 'city_d', to: at(COURT.door.x + 1, COURT.door.y - 1) },
            { do: 'exit', actor: 'aiyana_court', to: at(COURT.door.x, COURT.door.y - 1) },
          ],
          '',
          'The city goes down the hill to the quay, carrying its empty lamps.',
        ),
        say(G, 'The oil store. Down to the quay.'),
      ],
    },
  }),

  // ---- Beat 7: Seth Dhanraj in the oil store -----------------------------------------------------------------------
  script('store_boss', {
    start: { lines: [], next: [{ if: { flag: 'encounter.jwaladesh_story.dhanraj.won' }, to: 'after' }, { to: 'meet' }] },
    meet: {
      lines: [
        act(
          [
            { do: 'place', actor: 'dhanraj', look: 'seth_dhanraj', at: at(HARBOR.storeDoors.x, 6), facing: 'down' },
            { do: 'place', actor: 'guard_a', look: 'oil_enforcer', at: at(HARBOR.storeDoors.x - 2, 6), facing: 'down' },
            { do: 'place', actor: 'guard_b', look: 'oil_enforcer', at: at(HARBOR.storeDoors.x + 3, 6), facing: 'down' },
            { do: 'look', actor: 'dhanraj' },
          ],
          '',
          'The store\'s doors stand open. Among his jars, with his ledger and his enforcers: the merchant in white.',
        ),
        nar('The Crown\'s launch is gone from the steps.'),
        say(DH, 'The Court\'s son, and the envoy. You lit the chain lamp; that was very fine. It changes nothing.'),
        say(DH, 'Every jar in this harbor is mine by contract, signed at that altar. I do not hoard. I hold. Holding is lawful.'),
        act([{ do: 'walk', actor: 'vikram', to: at(HARBOR.storeDoors.x, HARBOR.storeDoors.y), facing: 'up' }], V, 'Then I am going to argue with you.'),
        say(DH, 'You are out of breath.'),
        say(V, 'Always.'),
        nar('Dhanraj kicks a jar over. Oil spreads in a ring at his feet; nothing burns there.', { fx: 'shake', set: { 'battle.next': 'oil_store_dhanraj', 'battle.after': 'dhanraj_after' } }),
      ],
    },
    after: { lines: [], next: 'yield' },
    ...dhanrajAfterNodes(),
  }),
  script('dhanraj_after', { start: { lines: [], next: 'yield' }, ...dhanrajAfterNodes() }),

  // ---- Beat 8: the price at dawn ------------------------------------------------------------------------------------
  script('price_scene', {
    start: {
      lines: [
        nar('Dawn at the Court. The flame burns tall on oil, in a full bowl. The sun comes through the wick-window instead of the beam.', { fx: 'fade' }),
        { if: { flag: 'choice.dhanraj_spared' }, speaker: '', text: 'Seth Dhanraj kneels at the colonnade\'s foot, his ledger closed in his lap.', stage: [{ do: 'look', actor: 'npc:dhanraj_kneeling' }] },
        act(
          [{ do: 'enter', actor: 'aiyana_dawn', look: 'aiyana', from: at(COURT.door.x, COURT.door.y - 1), to: at(COURT.altar.x + 2, COURT.altar.y + 2), facing: 'up' }],
          AI,
          'The height of my arm. I\'ll write it down.',
        ),
        act(
          [{ do: 'walk', actor: 'npc:junior_priest', to: at(COURT.altar.x - 1, COURT.sceneRow - 3), facing: 'up' }],
          JP,
          'Every jar in the harbor, bought with advances from the Throne\'s purchasing office, Kingsmere.',
        ),
        say(JP, 'Countersigned by the oil-factor. At the foot, in his hand: Hold until the Court signs for the chain.'),
        act([{ do: 'look', actor: 'npc:senior_keeper' }], KP, 'The flame was to be kept.'),
        act([{ do: 'look', actor: 'npc:meera' }], ME, 'It was kept by the city, in front of the city. The Court has one word. The word was wrong.'),
        act([{ do: 'walk', actor: 'npc:meera', to: at(COURT.altar.x + 1, COURT.altar.y + 3), facing: 'up' }, { do: 'wait', ms: 600 }, { do: 'sync' }], '', 'She takes the Suzumori crane from the altar and puts it in Gianna\'s hands.', {
          set: { 'item.token_suzumori': true, 'story.crane_accepted': true },
        }),
        say(ME, 'Take it to your chair. Tell Kaede it sat on our altar for one night. That is not an apology. It is a beginning.'),
        act([{ do: 'look', actor: 'haru' }], H, 'Grandmother\'s files say the paper was false. I will bring you the paper.'),
      ],
      next: 'price',
    },
    price: {
      lines: [
        say(ME, 'The Agnivansh want one thing: the oil to keep the flame, the harbor to bring it in, and nobody\'s leave for either.'),
        say(ME, 'The treasury is empty. Count what the envoy has put in it.'),
        { if: { flag: 'choice.dhanraj_spared' }, speaker: DH, text: 'The store is the temple\'s. Every jar, by my own ledger. I signed at dawn.' },
        { if: { flag: 'choice.dhanraj_broken' }, speaker: '', text: 'The city walked the jars up the hill. Some of them reached the temple.' },
        say(CR, 'The runners\' relay, run again. With oil in it.'),
        say(JP, 'And the oil from nobody. Counted.'),
        act([{ do: 'look', actor: 'samira' }], S, 'And the Seth\'s strongbox: Throne advances, about four hundred gold.'),
      ],
      choices: [
        { text: 'Give it to the temple.', set: { 'choice.advances_given': true }, next: 'given' },
        { text: 'Keep it.', set: { 'gold.gain': 400 }, next: 'kept' },
      ],
    },
    given: {
      lines: [say(S, 'That is Throne money. Giving it to a temple is the best thing anyone has done with it. I say that as a banker.')],
      next: 'petition',
    },
    kept: { lines: [say(S, 'Kept. It will buy something useful. I will tell my mother it bought something useful.')], next: 'petition' },
    petition: {
      lines: [],
      next: [{ if: { flag: 'item.petition' }, to: 'sign' }, { to: 'token' }],
    },
    sign: {
      lines: [
        say(Y, 'Xaraguá\'s Petition of Breach. The Hall never heard it. Will Agnipur sign it?'),
        nar('Meera reads it through, slowly, and signs it.', { set: { 'choice.petition_jwa_signed': true } }),
      ],
      next: 'token',
    },
    token: {
      lines: [
        say(ME, 'Agnivansh stands with Zetwal when the realm musters. What you have not paid, the Muster will ask for.', { set: { 'ally.jwaladesh': true } }),
        act([{ do: 'look', actor: 'npc:meera' }, { do: 'wait', ms: 800 }], '', 'She lifts a small brass lamp from the altar\'s rail, lights it from the flame, and gives it to Gianna.'),
        say(ME, 'For the chamberlain\'s chair. Agnivansh sits, and burns.', { set: { 'item.token_agnivansh': true } }),
        act([{ do: 'walk', actor: 'vikram', to: at(COURT.altar.x - 1, COURT.altar.y + 3), facing: 'up' }], V, 'I am going with them, Mother. Somebody has to argue with the Crown.'),
        say(V, 'And I am the only one in this house who has had the practice.'),
        say(ME, 'You will be out of breath for the whole war.'),
        say(V, 'I will be winning for the whole war.'),
        act([{ do: 'face', actor: 'npc:meera', facing: 'player' }], ME, 'He is right about one thing a day. Find the one.', { set: { 'story.vikram_left_agnipur': true } }),
      ],
      next: 'north',
    },
    north: {
      lines: [
        say(ME, 'The oil was bought with the Throne\'s purse. The purse is in Kingsmere, under the Regent\'s keep.'),
        say(ME, 'With everything else the Throne has bought this year. Nobody goes to Kingsmere.'),
        say(H, 'Everybody is written down somewhere. The Regent\'s keep is where.'),
        act([{ do: 'look', actor: 'aiyana_dawn' }], AI, 'Jordyn\'s in Kingsmere.'),
        say(Z, 'Titi Jordyn?'),
        say(AI, 'In the Regent\'s guard. Don\'t look like that; it\'s a job.'),
        say(AI, 'She\'ll be no use and no danger until she decides, and then she\'ll be both.'),
        act([{ do: 'exit', actor: 'aiyana_dawn', to: at(COURT.door.x, COURT.door.y - 1) }], Z, 'Three of them. Three of his sisters, in three cities, and not one of them will say his name to you.'),
        say(G, 'Then they know what he is.'),
        nar('Azzy looks at his hands, and says nothing.'),
        say(H, 'A Zetwal trader at the quay. North, along the white coast.'),
      ],
    },
  }),

  // ---- Beat 9: the quay (the card) ---------------------------------------------------------------------------------
  script('jw_quay_end', {
    start: {
      lines: [
        act([{ do: 'look', actor: 'npc:aiyana' }], AI, 'I\'ve got a flame to measure every morning for the rest of my life.'),
        act([{ do: 'face', actor: 'npc:aiyana', facing: 'player' }], AI, 'Azriel. Don\'t hold things.'),
        act([{ do: 'look', actor: 'player' }], '', 'Up the hill, the runners\' lamps are lit all the way to the temple. Over the harbor, the chain lamp burns.'),
        nar('A Zetwal trader at the quay, bound north along the white coast for Aldermoor.'),
        nar('Salkhi is loaded last. She has stopped asking about grass.'),
        act([{ do: 'look', actor: 'vikram' }], V, 'North. To the moor. I will... need a moment... on the boat.'),
      ],
      next: 'go',
    },
    go: {
      lines: [say(A, 'Vikram\'s coming too, Gigi.'), say(G, 'He is. Kingsmere.', { fx: 'fade', set: { 'act8.complete': true, 'travel.next': 'aldermoor-heath/mere_stair', 'voyage.next': 'jwaladesh_aldermoor' } })],
    },
  }),
];

/** J-3's jars, close up, after the enforcers (the seventh safehouse): the thumbprint, the carter's line, the back gate. */
function carterSealNodes(): Record<string, DialogueNode> {
  return {
    seals: {
      lines: [
        nar('The enforcers are gone back down the road. Gianna lifts the sacking off the carter\'s jars.'),
        nar('On every seal: a grey thumbprint, pressed in ash.'),
        say(Y, 'Yucayeque\'s oil. Cenizal\'s bread. Bab al-Dhahab\'s water. Ordvik\'s grain. Kirinoura\'s paper. Now this.'),
        say(Y, 'The same hand.'),
        say(CT, 'Seven, if you count right. Somebody is feeding the realm. Not for a goddess.'),
        act(
          [{ do: 'exit', actor: 'npc:carter', to: at(1, 13) }],
          CT,
          'The Court\'s back gate. I will walk beside the cart; you walk beside me.',
          { set: { 'story.salt_road_cleared': true } },
        ),
      ],
    },
  };
}

/** Arjun's charge (the end of the Echo scene, once the lamp is lit and the mirror bolted; beat 4). */
function chargeNodes(): Record<string, DialogueNode> {
  const mole = HARBOR.mole;
  return {
    charge: {
      lines: [],
      next: [{ if: { flag: 'clue.arjun_charge' }, to: 'charged' }, { to: 'ride' }],
    },
    charged: { lines: [nar('The lamp burns. The mirror faces the hill. The chain is down.')] },
    ride: {
      lines: [
        act(
          [
            ...placeRiders,
            ...RIDERS.map((_, i): StageCue => ({ do: 'walk', actor: `rider_${i + 1}`, to: at(mole.x + (i % 2), mole.y + 1 + Math.floor(i / 2)), run: true, async: i < RIDERS.length - 1 })),
            { do: 'look', actor: 'rider_1' },
          ],
          '',
          'Below the lamp, Arjun\'s seven ride out along the mole at the Crown\'s chain tower.',
        ),
        nar('Cannon from the hulls beyond the chain.', { fx: 'shake' }),
        act(
          [{ do: 'exit', actor: 'rider_6', to: at(mole.x, mole.y + mole.h - 1), async: true }, { do: 'exit', actor: 'rider_7', to: at(mole.x + 1, mole.y + mole.h - 1) }],
          '',
          'Two riders fall on the mole, and do not get up.',
          { fx: 'shake' },
        ),
        act([{ do: 'wait', ms: 600 }, { do: 'sync' }], '', 'At the mole\'s end the Crown\'s gate goes down. The great chain drops, slack, into the water.', { set: { 'echo.chain_dropped': true } }),
        act(
          [
            ...RIDERS.slice(0, 5).map((p, i): StageCue => ({ do: 'walk', actor: `rider_${i + 1}`, to: p, run: true, async: i < 4 })),
            { do: 'look', actor: 'npc:arjun' },
          ],
          '',
          'Five ride back along the mole.',
        ),
        act([{ do: 'face', actor: 'npc:arjun', facing: 'down' }], AR, 'Seven rode out.'),
        say(P, 'Five came home.', { set: { 'clue.arjun_charge': true } }),
        nar('The Zetwal ships come in under the lamp, past the slack chain.'),
      ],
    },
  };
}

/** Dhanraj after the fight (beat 7): the ledger, his end (both remembered), the runners carry the oil up the hill. */
function dhanrajAfterNodes(): Record<string, DialogueNode> {
  return {
    yield: {
      lines: [
        act(
          [{ do: 'place', actor: 'dhanraj', look: 'seth_dhanraj', at: at(HARBOR.storeDoors.x, 6), facing: 'down' }, { do: 'look', actor: 'dhanraj' }],
          '',
          'The Seth sits on a jar with his ledger shut. His enforcers have gone out the back. The ring of oil burns low round him.',
        ),
        act([{ do: 'walk', actor: 'samira', to: at(HARBOR.storeDoors.x + 1, 7), facing: 'left' }], '', 'Samira takes the ledger out of his lap and reads it there, standing.', {
          set: { 'item.dhanraj_ledger': true, 'clue.crown_holds_oil': true },
        }),
        say(S, 'Advances from the Throne\'s purchasing office, Kingsmere. Countersigned by the factor. Hold until the Court signs for the chain.'),
        say(S, 'Drawn on a Kingsmere house. Not my mother\'s. I checked before I said that.'),
      ],
      choices: [
        { text: 'Sign the store over.', set: { 'choice.dhanraj_spared': true }, next: 'spared' },
        { text: 'Walk him up the hill.', set: { 'choice.dhanraj_broken': true }, next: 'broken' },
      ],
    },
    spared: {
      lines: [say(G, 'Open the store to the temple. Every jar. Then the Court can decide what you are.'), say(DH, 'I was paid to hold. I was never told why.')],
      next: 'oil',
    },
    broken: {
      lines: [
        say(BY, 'Let the city walk him up the hill, past every lamp he emptied.'),
        say(DH, 'I was paid to hold. I was never told why. Men like me are never told why.'),
      ],
      next: 'oil',
    },
    oil: {
      lines: [
        act(
          [
            { do: 'enter', actor: 'run_a', look: 'chief_runner', from: at(HARBOR.stair.x, HARBOR.stair.y + 1), to: at(HARBOR.storeDoors.x - 1, HARBOR.storeDoors.y + 1), facing: 'up', async: true },
            { do: 'enter', actor: 'run_b', look: 'runner', from: at(HARBOR.stair.x + 1, HARBOR.stair.y + 1), to: at(HARBOR.storeDoors.x, HARBOR.storeDoors.y + 1), facing: 'up', async: true },
            { do: 'enter', actor: 'run_c', look: 'runner', from: at(HARBOR.stair.x, HARBOR.stair.y + 1), to: at(HARBOR.storeDoors.x + 2, HARBOR.storeDoors.y + 1), facing: 'up' },
            { do: 'look', actor: 'run_a' },
          ],
          '',
          'The runners come down the harbor stair with their lamps lit from the chain lamp.',
        ),
        say(CR, 'The carter\'s jars first. Then the Seth\'s.'),
        act(
          [
            { do: 'exit', actor: 'run_a', to: at(HARBOR.stair.x, HARBOR.stair.y), async: true },
            { do: 'exit', actor: 'run_b', to: at(HARBOR.stair.x + 1, HARBOR.stair.y), async: true },
            { do: 'exit', actor: 'run_c', to: at(HARBOR.stair.x, HARBOR.stair.y) },
          ],
          '',
          'They carry the first jars up the hill in a line, lamp to lamp. The relay, run for real.',
        ),
        act([{ do: 'look', actor: 'vikram' }], V, 'Argument... settled. Up the hill. The Court will want... to count.', { set: { 'story.dhanraj_beaten': true } }),
      ],
    },
  };
}
