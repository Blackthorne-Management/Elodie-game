// Chapter 2's side quests (Oct 20; docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md and its owner
// decisions): Cut Nets, The Hutia's Hoard, Oil From a Stranger and Medicine for the Cacique, with the lamp-oil seller's
// dusk (the gate: she lends the cave lamp at dusk, when the night canoe brings her oil and the Governor's glass is off
// them). The debate by the village fire, the fifth quest, is data/debates.ts. Medicine is offered at Anaco's bedside
// (dialogue/xaragua.ts anaco_talk).
//
// Staged as the owner's rule asks (Oct 17): whoever comes, goes or acts walks on the map. Anissa never jokes.

import type { Condition } from '../../engine/conditions.ts';
import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import type { StageCue } from '../../engine/stage.ts';
import { CHAPTER2_QUESTS_DONE } from '../sideQuests.ts';

function say(speaker: string, text: string, translation?: string): DialogueLine {
  return translation ? { speaker, text, translation } : { speaker, text };
}

function nar(text: string): DialogueLine {
  return { speaker: '', text };
}

function script(id: string, nodes: Record<string, DialogueNode>): DialogueScript {
  return { id, start: 'start', nodes };
}

/** A line with stage directions (engine/stage.ts): the cues are acted out on the map, then the line shows. */
function act(stage: StageCue[], speaker: string, text: string): DialogueLine {
  return { speaker, text, stage };
}

function at(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const P = 'patricio';
const AF = 'anissa_far';
const C = 'caona';
const f = (flag: string): Condition => ({ flag });
const not = (flag: string): Condition => ({ notFlag: flag });
const PIER_WON = 'encounter.xaragua_story.pier.won';
const ANCHOR_NOTE = nar('(Anchor: this change will last into the present.)');

// ---- Cut Nets ----------------------------------------------------------------------------------------------------

const NETS = ['village', 'beach', 'salt'] as const;
const NETS_IN: Condition = { all: [f('side.nets.accepted'), ...NETS.map((n) => f(`side.nets.${n}`))] };

/** A cut net on the sand: rolled up and taken once the fisher has asked for it. */
function cutNet(where: (typeof NETS)[number], take: DialogueLine[]): DialogueScript {
  return script(`cut_net_${where}`, {
    start: { lines: [], next: [{ if: f('side.nets.accepted'), to: 'take' }, { to: 'look' }] },
    look: { lines: [nar('A fishing net, cut through in three places and thrown down on the sand.')] },
    take: {
      set: { [`side.nets.${where}`]: true },
      lines: [
        ...take,
        nar('(Gianna rolled up the cut net.)'),
        {
          speaker: A,
          text: 'That is all three, Gigi. The fisher is by the pier.',
          if: { all: NETS.map((n) => f(`side.nets.${n}`)) },
        },
      ],
    },
  });
}

const NETS_DIALOGUE: DialogueScript[] = [
  script('canoe_fisher_talk', {
    start: {
      lines: [],
      next: [
        { if: f('side.nets.done'), to: 'after' },
        { if: NETS_IN, to: 'finish' },
        { if: f('side.nets.accepted'), to: 'remind' },
        { if: f(PIER_WON), to: 'offer' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('canoe_fisher', 'Three Crown ships in our harbor, and they still buy our fish. They pay in paper. Paper does not swim.')] },
    offer: {
      lines: [
        act([{ do: 'face', actor: 'npc:canoe_fisher', facing: 'left' }], 'canoe_fisher', 'Envoy\'s daughter. Yari. Look at my drying posts. Look at them.'),
        say('canoe_fisher', 'Three nets were drying on the sand last night. This morning: cut through, all three, and thrown down where they lay.'),
        say('canoe_fisher', '"For the harbor\'s safety," the marines said. Nets foul their longboats\' oars.'),
        say(Y, 'Nets have dried on that sand since before the Crown had a harbor to be safe in.'),
        act(
          [{ do: 'face', actor: 'npc:canoe_fisher', facing: 'player' }],
          'canoe_fisher',
          'One is by the canoe jetty. The others are down on the Canoe Beach, by the canoes and at the salt pans.',
        ),
        say('canoe_fisher', 'I am too old to carry three wet nets and my pride.'),
      ],
      choices: [
        { text: "I'll bring them.", next: 'accept' },
        { text: 'Not now.', next: 'later' },
      ],
    },
    later: { lines: [say('canoe_fisher', 'The nets are not going anywhere. That is the problem.')] },
    accept: {
      set: { 'side.nets.accepted': true },
      lines: [
        say('canoe_fisher', 'Guatiao. Mind the hooks in the mesh.', 'Friend.'),
        nar('(Cut Nets is in the Quests page of the menu.)'),
      ],
    },
    remind: {
      lines: [
        say('canoe_fisher', 'Still nets on the sand?'),
        { speaker: 'canoe_fisher', text: 'The one by the canoe jetty, just along the shore.', if: not('side.nets.village') },
        { speaker: 'canoe_fisher', text: 'One by the drawn-up canoes on the Canoe Beach.', if: not('side.nets.beach') },
        { speaker: 'canoe_fisher', text: 'One at the salt pans, at the far end of the beach.', if: not('side.nets.salt') },
      ],
    },
    // Staged: the nets are laid out on the sand; Yari walks over to them and the two of them mend.
    finish: {
      set: { 'side.nets.done': true },
      lines: [
        act(
          [
            { do: 'place', actor: 'yari', look: 'yari', at: at(19, 19), facing: 'left' },
            { do: 'face', actor: 'npc:canoe_fisher', facing: 'player' },
          ],
          'canoe_fisher',
          'All three! Lay them out on the sand, there, where the light is good.',
        ),
        act(
          [
            { do: 'walk', actor: 'yari', to: at(15, 19), facing: 'down', async: true },
            { do: 'walk', actor: 'npc:canoe_fisher', to: at(16, 20), facing: 'left' },
          ],
          Y,
          'I can do the knots. Give me the big one.',
        ),
        say('canoe_fisher', 'You remember the knot?'),
        say(Y, 'My father taught me on this beach. Over, under, round, and pull. He says a net is only holes, held together by people who agree.'),
        say('canoe_fisher', 'He says that at council too.'),
        act([{ do: 'wait', ms: 1200 }], A, 'She ties them faster than I can watch, Gigi.'),
        act(
          [{ do: 'walk', actor: 'npc:canoe_fisher', to: at(17, 19), facing: 'up' }],
          'canoe_fisher',
          'There. Better than new. Take this float, envoy: it rode on that net for twenty years. It always comes back up.',
        ),
        act([{ do: 'walk', actor: 'yari', to: at(16, 19), facing: 'right' }], Y, 'Let the Governor read that in his glass.'),
      ],
    },
    after: { lines: [say('canoe_fisher', 'The nets are back on the posts. The marines walk the long way round them now.')] },
  }),
  cutNet('village', [nar('A fishing net, cut through in three places. You roll it up, wet sand and all.')]),
  cutNet('beach', [nar('A fishing net, cut through in three places and left by the canoes. You roll it up.')]),
  // The shell diver saw who did it (staged: he comes over from the rocks).
  cutNet('salt', [
    nar('A fishing net, cut through in three places, trodden into the salt pans.'),
    act(
      [{ do: 'walk', actor: 'npc:shell_diver', to: at(29, 11), facing: 'left' }],
      'shell_diver',
      'The longboat crew did that, at dawn. "Nets foul the oars," they said.',
    ),
    say('shell_diver', 'Nets have dried on this sand since before there was a Crown. The oars can learn to go round.'),
    nar('You roll the net up, salt and all.'),
  ]),
];

// ---- The Hutia's Hoard (PUZZLES.md M-XAR-1) ----------------------------------------------------------------------

const HUTIA_DIALOGUE: DialogueScript[] = [
  script('conuco_kid_talk', {
    start: {
      lines: [],
      next: [
        { if: f('side.hutia.done'), to: 'after' },
        { if: { all: [f('side.hutia.accepted'), f('side.hutia.hoard')] }, to: 'finish' },
        { if: f('side.hutia.accepted'), to: 'remind' },
        { if: f(PIER_WON), to: 'offer' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('conuco_kid', 'I found a hutia in the cassava. It took my bead and ran. Hutias think shiny things are stars.')] },
    offer: {
      lines: [
        say('conuco_kid', 'I found a hutia in the cassava. It took my bead and ran. Hutias think shiny things are stars.'),
        say('conuco_kid', 'It was green. Sea glass. My grandmother found it on the beach when she was small like me.'),
        say(Y, '...A hutia. Brown, round, very pleased with itself?'),
        say('conuco_kid', 'Yes! Is it yours?'),
        say(Y, '...That might be mine. It came home with me in the canoe, and it has been out every night since.'),
        say(A, 'Where would a hutia hide its stars, Gigi?'),
      ],
      choices: [
        { text: "We'll find your bead.", next: 'accept' },
        { text: 'Not now.', next: 'later' },
      ],
    },
    later: { lines: [say('conuco_kid', 'The hutia will not give it back by itself. I asked it.')] },
    accept: {
      set: { 'side.hutia.accepted': true },
      lines: [
        say('conuco_kid', 'It ran west, past the pond. It drops things when it is scared. Follow the shiny!'),
        nar("(The Hutia's Hoard is in the Quests page of the menu.)"),
      ],
    },
    remind: { lines: [say('conuco_kid', 'Did you find where the hutia keeps its stars? It went west, past the pond, dropping things.')] },
    finish: {
      set: { 'side.hutia.done': true, 'item.hutia_bead': 0 },
      lines: [
        act([{ do: 'face', actor: 'npc:conuco_kid', facing: 'player' }], 'conuco_kid', 'My bead! You found it!'),
        say(G, 'In the hollow of the old ceiba, with a fish hook, a brass button and two spoons.'),
        say('conuco_kid', 'Was the hutia there?'),
        say(Y, 'Asleep on top of it all. Like a cacique on his duho.'),
        say('conuco_kid', 'Keep the button. Grandmother says Crown buttons are bad luck. For the Crown.'),
      ],
    },
    after: { lines: [say('conuco_kid', 'I tied my bead on twice. Hutias cannot untie knots. I checked.')] },
  }),
  // The old ceiba, in the present: the hollow out of reach until the staked sapling has grown its low fork.
  script('old_ceiba', {
    start: {
      lines: [],
      next: [
        { if: { all: [f('anchor.hutia_stake'), f('side.hutia.accepted'), not('side.hutia.hoard')] }, to: 'climb' },
        { if: f('anchor.hutia_stake'), to: 'fork' },
        { if: { all: [f('side.hutia.accepted'), not('side.hutia.tree')] }, to: 'found' },
        { if: f('side.hutia.tree'), to: 'high' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('An old ceiba at the edge of the gardens, wider than a house, its first branches far up.')] },
    found: {
      set: { 'side.hutia.tree': true },
      lines: [
        nar('The old ceiba at the edge of the gardens. Small clawed prints go round and round its roots.'),
        nar('High up the trunk, far out of reach, a hollow. Something in it catches the light.'),
        say(Y, 'Hutias climb. People do not. Not that tree: the first branch is three of me up.'),
        say(A, 'Gigi... the air by the roots is shimmering.'),
      ],
    },
    // Anissa's hints (PUZZLES.md M-XAR-1), for a second look before the stake.
    high: {
      lines: [
        nar('The hollow is far out of reach, three Yaris up a straight trunk. The air shimmers by the roots.'),
        say(A, 'Trees grow, Gigi. In the memory this one will be small. Small trees grow the way they are held.'),
      ],
    },
    climb: {
      set: { 'side.hutia.hoard': true, 'item.hutia_bead': true },
      lines: [
        nar('The old ceiba has a low fork now, where a stake once held it, and the trunk has grown round it. A step up, then another.'),
        nar('The hollow: a sea-glass bead on a thread, a fish hook, a Crown marine\'s brass button, two spoons...'),
        nar('...and a hutia, asleep on top of it all.'),
        say(Y, 'That is not my hutia. ...That is my hutia\'s grandmother. I would know that face anywhere.'),
        nar('(Gianna took the bead, and the button for the girl to see.)'),
      ],
    },
    fork: { lines: [nar('The old ceiba, with its low fork. The hollow is empty now, but for a hutia who does not think much of you.')] },
  }),
  // The memory: the ceiba as a sapling, with a stake leaning by it (the anchor).
  script('ceiba_sapling', {
    start: { lines: [], next: [{ if: f('anchor.hutia_stake'), to: 'staked' }, { to: 'young' }] },
    young: {
      lines: [nar('The ceiba, fifty years younger: a sapling no taller than you, leaning in the wind. A stake lies against a basket beside it.')],
      choices: [
        { text: 'Stake it and tie it low.', next: 'staked_now', set: { 'anchor.hutia_stake': true } },
        { text: 'Leave it.' },
      ],
    },
    staked_now: {
      lines: [
        nar('You drive the stake in beside the sapling and tie the stem to it, bent low. It will grow round it.'),
        say(P, 'Grow a step for me. For whoever comes looking.'),
        ANCHOR_NOTE,
      ],
    },
    staked: { lines: [nar('The sapling, tied low to its stake.')] },
  }),
  script('hutia_echo_enter', {
    start: { set: { 'echo.hutia_memory': true }, lines: [], next: [{ if: not('story.hutia_echo_seen'), to: 'first' }] },
    first: {
      set: { 'story.hutia_echo_seen': true },
      lines: [
        nar('Sunlight, fifty years ago, the summer after the first oath. The gardens are younger, the mounds fewer.'),
        nar('Where the old ceiba stood is a sapling no taller than you.'),
        say(AF, 'Gigi? The big tree is gone. There is only a little one!'),
      ],
    },
  }),
  script('hutia_echo_return', {
    start: { lines: [], next: [{ if: { all: [f('anchor.hutia_stake'), not('story.hutia_fork_seen')] }, to: 'grown' }] },
    grown: {
      set: { 'story.hutia_fork_seen': true },
      lines: [
        nar('The present settles. The old ceiba stands where it stood...'),
        nar('...with a low fork in its trunk, a man\'s height up, where something once held it bent.'),
        say(A, 'Gigi! It has a step now!'),
        say(Y, 'Fifty years of growing round a stake. My grandmother would say the tree remembered.'),
      ],
    },
  }),
  // Two of Caona's scouts, fifty years ago (the hints: a tree grows the way it is held when it is small).
  script('echo_hutia_scout_talk', {
    start: { lines: [say('echo_hutia_scout', 'Marshal. Do not mind the hutia. It hides our arrowheads in the roots of that sapling, then sits on them.')] },
  }),
  script('echo_hutia_scout_2_talk', {
    start: {
      lines: [
        { speaker: 'echo_hutia_scout', text: 'That ceiba will be the tallest tree in the gardens one day. Straight up, and not a branch a child could reach.' },
        { speaker: 'echo_hutia_scout', text: 'Unless someone bends it while it is small. Trees grow the way they are held.' },
      ],
    },
  }),
];

// ---- Oil From a Stranger, and the lamp at dusk (the gate) --------------------------------------------------------

/** What is still left before dusk, as the lamp-oil seller has heard it in the village. */
const STILL_LEFT: DialogueLine[] = [
  { speaker: 'lamp_oil_seller', text: 'The fisher by the pier is still cursing over his cut nets.', if: not('side.nets.done') },
  { speaker: 'lamp_oil_seller', text: 'The little one in the gardens is still crying over her bead.', if: not('side.hutia.done') },
  { speaker: 'lamp_oil_seller', text: 'And my jars are still not at the hill camp.', if: { all: [f('side.oil.accepted'), not('side.oil.done')] } },
  { speaker: 'lamp_oil_seller', text: 'The healer in the caney is still asking everyone about bark.', if: not('side.medicine.done') },
  {
    speaker: 'lamp_oil_seller',
    text: 'And the old elder by the fire is still arguing with that pilgrim. Somebody should help him.',
    if: { all: [not('debate.xaragua_springs.joined'), not('debate.xaragua_springs.mediated')] },
  },
];

const OIL_OFFER: Record<string, DialogueNode> = {
  offer_oil: {
    lines: [
      say('lamp_oil_seller', 'And if you want to look ordinary, carry something. Two jars are due up the Mountain Path, at the hill camp.'),
      say('lamp_oil_seller', 'The marines follow me everywhere now. You are the envoy\'s daughter. Nobody stops you.'),
    ],
    choices: [
      { text: "I'll carry them.", next: 'oil_accept' },
      { text: 'Not now.', next: 'oil_later' },
    ],
  },
  oil_accept: {
    set: { 'side.oil.accepted': true, 'item.oil_jars': true },
    lines: [
      say('lamp_oil_seller', 'Two jars, wax on the stoppers. To the camp leader and nobody else. Do not drop them. Do not open them. Do not ask.'),
      nar('(Gianna took the oil jars. Oil From a Stranger is in the Quests page of the menu.)'),
    ],
  },
  oil_later: { lines: [say('lamp_oil_seller', 'They will keep until you are ready. Oil is patient.')] },
};

const OIL_DIALOGUE: DialogueScript[] = [
  // The lamp-oil seller (STORY.md beat 3, Rael clue 6). Once Thorne has warned Gianna off, she will lend the lamp,
  // but not under the Governor's glass: at dusk (owner decision, Oct 19).
  script('lamp_oil_seller_talk', {
    start: {
      lines: [],
      next: [
        { if: f('item.oil_lamp'), to: 'after' },
        { if: CHAPTER2_QUESTS_DONE, to: 'dusk' },
        { if: f('story.lamp_asked'), to: 'wait' },
        { if: f('story.thorne_met'), to: 'lamp' },
        { to: 'oil' },
      ],
    },
    oil: {
      lines: [
        say('lamp_oil_seller', 'Guatiao!', 'Friend!'),
        say('lamp_oil_seller', 'Lamp oil for the long nights. It comes by canoe, after dark, from someone I have never met.'),
        say('lamp_oil_seller', 'Every jar paid for in advance. I stopped asking who. The jars stopped asking me.'),
      ],
    },
    // The refusal: the Governor's spyglass is on them, from the customs house window next door.
    lamp: {
      set: { 'story.lamp_asked': true },
      lines: [
        act(
          [{ do: 'face', actor: 'npc:lamp_oil_seller', facing: 'player' }],
          'lamp_oil_seller',
          'You came out of the Governor\'s house with your chin up. That is rare. Most come out looking at their feet.',
        ),
        say(A, 'We need a light for the petroglyph cave. A real one.'),
        say('lamp_oil_seller', 'The cave! Nobody has been in there since the water rose. My grandmother said the stones inside could sing.'),
        act([{ do: 'face', actor: 'npc:lamp_oil_seller', facing: 'right' }], 'lamp_oil_seller', 'Not now, though. Do not turn round. The window at the top of the customs house.'),
        {
          speaker: '',
          text: 'Up in the customs house window, a spyglass catches the sun. It is turned your way.',
          fx: 'flash',
          stage: [{ do: 'face', actor: 'player', facing: 'right' }],
        },
        say('lamp_oil_seller', 'His glass has followed you since you came out of his door.'),
        say('lamp_oil_seller', 'Hand the envoy\'s daughter a cave lamp under it, and he knows where you are going before you do.'),
        say(Y, 'Then let him watch us do ordinary things all day.'),
        say('lamp_oil_seller', 'At dusk the night canoe brings my oil, and the glass goes in with the light. Come back then, and the lamp is yours.'),
        say(A, 'Until dusk, then. Half of Yucayeque asked us for something on the way here, Gigi.'),
      ],
      next: [{ if: { all: [not('side.oil.accepted'), not('side.oil.done')] }, to: 'offer_oil' }],
    },
    wait: {
      lines: [say('lamp_oil_seller', 'Dusk, envoy. The glass is still on you.'), ...STILL_LEFT],
      next: [{ if: { all: [not('side.oil.accepted'), not('side.oil.done')] }, to: 'offer_oil' }],
    },
    ...OIL_OFFER,
    // Dusk: the glass has gone in, and the night canoe comes in to the jetty with the oil.
    dusk: {
      set: { 'item.oil_lamp': true },
      lines: [
        act([{ do: 'face', actor: 'npc:lamp_oil_seller', facing: 'player' }], 'lamp_oil_seller', 'Dusk, envoy. Look up: the glass has gone in.'),
        act(
          [
            { do: 'look', actor: 'paddler' },
            { do: 'enter', actor: 'paddler', look: 'canoe_maker', from: at(8, 21), to: at(22, 11), facing: 'up' },
            { do: 'face', actor: 'npc:lamp_oil_seller', facing: 'down' },
          ],
          'lamp_oil_seller',
          'And here is the night canoe, on time. Twenty years, and never once a word.',
        ),
        act(
          [
            { do: 'wait', ms: 700 },
            { do: 'exit', actor: 'paddler', to: at(8, 21) },
            { do: 'look', actor: 'player' },
            { do: 'face', actor: 'npc:lamp_oil_seller', facing: 'player' },
          ],
          'lamp_oil_seller',
          'Take this lamp. The oil is the good kind, from the canoe that comes after dark.',
        ),
        say(G, 'Who sends it?'),
        say('lamp_oil_seller', 'Twenty years I have asked that. Someone who wants the Yaguana to see in the dark. Go on.'),
        { speaker: 'lamp_oil_seller', text: 'And the camp sent word down with a runner: my jars came, and nobody followed you. Thank you, envoy.', if: f('side.oil.done') },
        nar('(Gianna received the oil lamp.)'),
      ],
    },
    after: {
      lines: [
        say('lamp_oil_seller', 'The cave is in the cassava gardens, west of the village, under the rocks. Mind the water.'),
        say('lamp_oil_seller', 'And bring my lamp back. Or do not. Another one will come by canoe.'),
      ],
      // A save from before the quests existed, with the lamp already lent: the jars are still offered.
      next: [{ if: { all: [f('story.thorne_met'), not('side.oil.accepted'), not('side.oil.done'), not('story.crown_attack')] }, to: 'offer_oil' }],
    },
  }),
  // The hill camp: the scout checks the path behind Gianna, the leader takes the jars and shows the post.
  script('camp_leader_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [f('side.oil.delivered'), not('side.oil.done')] }, to: 'post' },
        { if: { all: [f('side.oil.accepted'), not('side.oil.delivered')] }, to: 'jars' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('camp_leader', 'You are the envoy\'s daughter. Good. You never saw this camp. Neither did I.')] },
    jars: {
      set: { 'side.oil.delivered': true, 'item.oil_jars': 0 },
      lines: [
        act([{ do: 'look', actor: 'npc:camp_scout' }, { do: 'walk', actor: 'npc:camp_scout', to: at(13, 16), facing: 'down', run: true }], 'camp_scout', 'Wait.'),
        act([{ do: 'wait', ms: 900 }, { do: 'walk', actor: 'npc:camp_scout', to: at(19, 8), facing: 'left', run: true }, { do: 'look', actor: 'player' }], 'camp_scout', 'Nobody on the path behind her. Nobody.'),
        say('camp_leader', 'The envoy\'s daughter, carrying lamp oil up a mountain. Either you are very brave or the seller is very clever.'),
        say(G, 'She said: to you and nobody else.'),
        say('camp_leader', 'Good. You have carried it, so you may as well know where it comes from.'),
        act([{ do: 'walk', actor: 'npc:camp_leader', to: at(16, 10), facing: 'right' }], 'camp_leader', 'New-moon nights, jars at the cave mouth. Nobody sees who leaves them. Each one sealed with this.'),
        say('camp_leader', 'Look at the post, envoy. Look closely.'),
      ],
    },
    post: { lines: [say('camp_leader', 'The post by the fire, envoy. Look closely.')] },
  }),
  script('ash_thumbprint', {
    start: { lines: [], next: [{ if: { all: [f('side.oil.delivered'), not('side.oil.done')] }, to: 'oil' }, { to: 'plain' }] },
    plain: { lines: [nar('On the post by the fire, a grey thumbprint pressed in ash. Someone left it here on purpose.')] },
    oil: {
      set: { 'side.oil.done': true },
      lines: [
        nar('On the post by the fire, a grey thumbprint pressed in ash. Someone left it here on purpose.'),
        nar('The same grey print is on the wax of the jars you carried.'),
        say('camp_leader', 'Someone who hates the Crown more than we do. Or loves us more. We have never decided which.'),
        say(A, 'The jars at the cave mouth, the oil in the lamps. Gigi, it is all the same person.'),
        nar('(The Journal notes the ash thumbprint.)'),
      ],
    },
  }),
];

// ---- Medicine for the Cacique (PUZZLES.md M-XAR-2) ---------------------------------------------------------------

/** The healer's offer: at Anaco's bedside (dialogue/xaragua.ts anaco_talk), or later in the caney. */
export const MEDICINE_OFFER: Record<string, DialogueNode> = {
  med_offer: {
    lines: [
      say('behique', 'The bark of the pond tree holds his fever back. It does not cure it.'),
      say('behique', 'The old cure was the bark of a grove above the cave, where Caona\'s scouts used to camp.'),
      say('behique', 'The Crown\'s road crews cut it down before you were born.'),
      say('behique', 'If a single tree of it is left up at the hill camp, I could make him well. I cannot leave him to look.'),
    ],
    choices: [
      { text: "I'll look for it.", next: 'med_accept' },
      { text: 'Not now.', next: 'med_later' },
    ],
  },
  med_accept: {
    set: { 'side.medicine.accepted': true },
    lines: [
      say('behique', 'The hill camp is up the Mountain Path, from the gardens. Look where the scouts camped. Look for stumps.'),
      nar('(Medicine for the Cacique is in the Quests page of the menu.)'),
    ],
  },
  med_later: { lines: [say('behique', 'I will be here. So will his fever.')] },
};

const MEDICINE_DIALOGUE: DialogueScript[] = [
  script('behique_talk', {
    start: {
      lines: [],
      next: [
        { if: f('side.medicine.done'), to: 'mended' },
        { if: { all: [f('side.medicine.accepted'), f('side.medicine.bark')] }, to: 'cure' },
        { if: f('side.medicine.accepted'), to: 'remind' },
        { if: f('story.anaco_met'), to: 'again' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [say('behique', 'The cacique sleeps. His fever comes and goes like the tide. Speak softly near his room.')] },
    again: { lines: [say('behique', 'You came back, envoy. About the bark.')], next: 'med_offer' },
    ...MEDICINE_OFFER,
    remind: { lines: [say('behique', 'The hill camp, up the Mountain Path. Where the scouts camped. Where the road crews cut, look for stumps.')] },
    // Staged: he takes the bark to the cacique's bed and brews it; Anaco sits up on his own and speaks.
    cure: {
      set: { 'side.medicine.done': true, 'item.grove_bark': 0 },
      lines: [
        say('behique', 'That smell. That is the grove bark. Where did you... No. Do not tell me. Let me work.'),
        act(
          [
            { do: 'walk', actor: 'npc:behique', to: at(32, 4), facing: 'right' },
            { do: 'wait', ms: 1200 },
          ],
          '',
          'The healer boils the bark in a clay pot by the bed. The room fills with bitter green steam.',
        ),
        say('anaco', 'Ugh. The old grove. I have not tasted that since I was a boy, and I did not miss it.'),
        act([{ do: 'wait', ms: 1000 }, { do: 'face', actor: 'npc:anaco', facing: 'player' }], '', 'After a while his hands are still. He sits up on his own and looks at you.'),
        say('anaco', 'Patricio\'s blood. Tell the elders I will stand when they sit.'),
        say(Y, 'Father...'),
        say('anaco', 'Not in front of the envoy, Yari. Later.'),
        act([{ do: 'walk', actor: 'npc:behique', to: at(30, 5) }, { do: 'face', actor: 'npc:behique', facing: 'player' }], 'behique', 'Thank you, envoy. Thank you, Yari. Wherever you found it, it was there for him.'),
      ],
    },
    mended: { lines: [say('behique', 'He walks the hall twice a day now and complains about my cooking. He is mending.')] },
  }),
  // The hill camp now: stumps by the road the crews cut across the flat ground.
  script('old_stumps', {
    start: {
      lines: [],
      next: [
        { if: { all: [f('side.medicine.accepted'), not('side.medicine.stumps')] }, to: 'found' },
        { if: { all: [f('anchor.grove_flat'), not('anchor.healer_grove')] }, to: 'cut_again' },
        { if: { all: [f('side.medicine.accepted'), not('anchor.healer_grove')] }, to: 'hint' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('Stumps by the old road, cut flat and grey with age.')] },
    // Anissa's hint (PUZZLES.md M-XAR-2), for a second look before the grove is planted.
    hint: {
      lines: [
        nar('Stumps by the old road, cut flat and grey with age.'),
        say(A, 'Roads go where it is flat, Gigi. Where is not flat? The healer in the memory will know.'),
      ],
    },
    found: {
      set: { 'side.medicine.stumps': true },
      lines: [
        nar('Stumps, a row of them, cut flat and grey with age. The old road runs straight across the flat ground beside them.'),
        say(Y, 'The road crews. They cut everything that stood in the way of a cart.'),
        say(A, 'There is nothing left to take bark from, Gigi. ...The air by the fire is shimmering.'),
      ],
    },
    cut_again: {
      lines: [
        nar('A second row of stumps by the road, younger than the first: the trees you planted grew, and were cut for the road all the same.'),
        say(A, 'The road crews came this way, Gigi. Roads go where it is flat.'),
      ],
    },
  }),
  script('young_grove', {
    start: { lines: [], next: [{ if: { all: [f('side.medicine.accepted'), not('side.medicine.bark')] }, to: 'cut' }, { to: 'plain' }] },
    plain: { lines: [nar('A grove of grey-barked fever trees behind the rocks, fifty years old.')] },
    cut: {
      set: { 'side.medicine.bark': true, 'item.grove_bark': true },
      lines: [
        nar('A grove of grey-barked fever trees behind the rocks, fifty years old.'),
        nar('You cut strips from the sunny side, the way the healer cuts them.'),
        nar('(Gianna received the grove bark.)'),
      ],
    },
  }),
  // The memory: the scouts' camp fifty years ago, the old grove standing on the flat ground.
  script('grove_echo_enter', {
    start: { set: { 'echo.camp_memory': true }, lines: [], next: [{ if: not('story.grove_echo_seen'), to: 'first' }] },
    first: {
      set: { 'story.grove_echo_seen': true },
      lines: [
        nar('Morning, fifty years ago, a season after the first oath. No palisade, no road: lean-tos round the fire.'),
        nar('On the flat ground to the west stands a grove of grey-barked trees.'),
        say(AF, 'Gigi? There are trees where the stumps were!'),
      ],
    },
  }),
  script('echo_scout_healer_talk', {
    start: { lines: [], next: [{ if: f('echo.grove_seeds'), to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'echo.grove_seeds': true },
      lines: [
        { speaker: 'echo_scout_healer', text: 'Marshal. Caona is out on the roads with the others, so you get me.', if: not('story.caona_joined') },
        { speaker: 'echo_scout_healer', text: 'Marshal. Caona went up the ridge to look at the roads. She said you would come by the fire.', if: f('story.caona_joined') },
        say('echo_scout_healer', 'Fever-bark, all of it. One pot of this and a man shakes off a fever the pond tree only quiets.'),
        say('echo_scout_healer', 'Your Crown friends are already measuring for a road. Carts need flat ground, and flat ground is where my trees are.'),
        act(
          [{ do: 'face', actor: 'npc:echo_scout_healer', facing: 'up' }],
          'echo_scout_healer',
          'Here, seed. Plant a row where no road will ever go, Marshal. Up there, where no cart could ever climb.',
        ),
        { speaker: C, text: 'Listen to her, Marshal. I know every road on this island, and every place one could never go.', if: f('story.caona_joined') },
        nar('(Patricio took a handful of seed.)'),
      ],
    },
    again: { lines: [say('echo_scout_healer', 'Where no road will ever go, Marshal. Not on the flat.')] },
  }),
  plantSpot(
    'grove_spot_flat',
    'anchor.grove_flat',
    'Flat, open ground beside the grove. Good soil, and easy digging.',
    [nar('You plant a row of seed on the flat beside the old grove and tread it down.')],
    'A row of seed, trodden in on the flat.',
  ),
  plantSpot(
    'grove_spot_rocks',
    'anchor.healer_grove',
    'A strip of earth behind the rocks, out of the wind. Nothing could ever be dragged up here.',
    [nar('You scratch a row into the earth behind the rocks and press the seed in, one by one.'), say(P, 'No cart will ever come up here. Grow slowly.')],
    'A row of seed, pressed into the earth behind the rocks.',
  ),
  script('grove_echo_return', {
    start: {
      lines: [],
      next: [
        { if: { all: [f('anchor.healer_grove'), not('story.grove_seen')] }, to: 'grown' },
        { if: { all: [f('anchor.grove_flat'), not('anchor.healer_grove'), not('story.grove_flat_seen')] }, to: 'cut' },
      ],
    },
    grown: {
      set: { 'story.grove_seen': true },
      lines: [
        nar('The present settles. Behind the rocks at the north end of the camp, where there was bare earth...'),
        nar('...a row of grey-barked trees stands, fifty years tall.'),
        say(A, 'Gigi! Behind the rocks! They grew!'),
        say(Y, 'Fifty years, and no road crew ever came up there.'),
      ],
    },
    cut: {
      set: { 'story.grove_flat_seen': true },
      lines: [
        nar('The present settles. By the old road there is a second row of stumps now, younger than the first.'),
        say(A, 'They grew, Gigi, and the road crews cut them too. Roads go where it is flat.'),
      ],
    },
  }),
];

/** A planting place in the memory (an anchor): bare until the scouts' healer gives Patricio seed. */
function plantSpot(id: string, anchor: string, ground: string, planted: DialogueLine[], after: string): DialogueScript {
  return script(id, {
    start: { lines: [], next: [{ if: f(anchor), to: 'planted' }, { if: f('echo.grove_seeds'), to: 'plant' }, { to: 'bare' }] },
    bare: { lines: [nar(ground)] },
    plant: {
      lines: [nar(ground)],
      choices: [
        { text: 'Plant the seeds here.', next: 'planted_now', set: { [anchor]: true } },
        { text: 'Not here.' },
      ],
    },
    planted_now: { lines: [...planted, ANCHOR_NOTE] },
    planted: { lines: [nar(after)] },
  });
}

export const XARAGUA_QUEST_DIALOGUE: readonly DialogueScript[] = [...NETS_DIALOGUE, ...HUTIA_DIALOGUE, ...OIL_DIALOGUE, ...MEDICINE_DIALOGUE];
