// Act I, Zetwal: the festival of Elodie's Gaze, Elodie's departure, the Sun Locket, the first Echo in
// Patricio's war room, the Chain Bridge, Anissa's light, and Yari's warning. Flags drive the story:
// `story.*` progress, `item.*` things carried, `clue.*` facts in the Journal, `echo.*` memory-only
// state (wiped on return), `anchor.*` changes the memory carries into the present.
//
// Tone (owner brief): serious with light comic touches; no jokes in Anissa's scenes.

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';

type Extra = Omit<DialogueLine, 'text' | 'speaker'>;

/** A spoken line. */
function say(speaker: string, text: string, extra: Extra = {}): DialogueLine {
  return { speaker, text, ...extra };
}

/** Narration (no name tag, even inside a node that has a speaker). */
function nar(text: string, extra: Extra = {}): DialogueLine {
  return { speaker: '', text, ...extra };
}

function script(id: string, nodes: Record<string, DialogueNode>, start = 'start'): DialogueScript {
  return { id, start, nodes };
}

/** A script with a single node of lines. */
function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return script(id, { start: { lines, set } });
}

/** A scene that plays once: it shows nothing once `flag` is set (and sets it). */
function once(id: string, flag: string, lines: DialogueLine[]): DialogueScript {
  return script(id, {
    start: { lines: [], next: [{ if: { notFlag: flag }, to: 'scene' }] },
    scene: { set: { [flag]: true }, lines },
  });
}

const G = 'gianna';
const A = 'anissa';
const AF = 'anissa_far';
const P = 'patricio';

export const ZETWAL_DIALOGUE: readonly DialogueScript[] = [
  // ---- The festival -----------------------------------------------------------------------------
  simple(
    'intro_festival',
    [
      nar("Pòdlimyè, capital of Zetwal. The Festival of Elodie's Gaze."),
      nar('Once a year the whole city remembers its dead aloud, and the goddess remembers with them.'),
      say(A, 'Gigi... there are so many people.'),
      say(G, 'Stay close. Mother speaks from the stage at noon, and tonight the names are read on the Temple island.'),
      say(A, 'Is Grandfather reading again this year?'),
      say(G, 'He always does. He went over to the island before dawn to get ready.'),
      say(A, "...Okay. I'll stay close."),
      nar('(Arrows, WASD or the D-pad to walk, diagonals too, or tap where to go. Tap people and things to talk. Hold Shift or B to run.)'),
      nar('(Z or A to talk. Esc or Menu opens the menu: your party, your bag, the maps and your Journal.)'),
      nar('(Stuck? Q or the Ask button asks Anissa what to do next.)'),
    ],
    // Anissa joins, and Gianna sets out with a little food in her satchel.
    { 'party.anissa': true, 'item.soup_pot': 2, 'item.akasan': 1 },
  ),

  script('elodie_talk', {
    start: { lines: [], next: [{ if: { notFlag: 'story.heard_speech' }, to: 'speech' }, { to: 'farewell' }] },
    speech: {
      speaker: 'elodie',
      lines: [
        { text: 'People of Zetwal.' },
        { text: "Fifty years ago this square was a camp of tents and barricades, and the Crown's ships sat in our harbor." },
        { text: 'My father stood on this ground and promised that no crown would ever again decide who we are.' },
        { text: 'Tonight the Gaze of Elodie remembers with us. Say your names. Say theirs.' },
        nar('The crowd answers with a thousand names at once.'),
        { text: 'Tomorrow I leave for the Throne, as your envoy. I will speak there for all of you.' },
        nar('As the crowd breaks up, Mother finds you with her eyes.'),
        { text: 'Gianna. Anissa. Walk me to the east gate? My carriage is waiting.', set: { 'story.heard_speech': true } },
      ],
    },
    farewell: {
      speaker: 'elodie',
      lines: [
        { text: 'There you are.' },
        { text: 'A few weeks. Maybe longer. The Regent likes to keep envoys waiting.' },
      ],
      choices: [
        { text: 'Why do you have to go now?', next: 'why' },
        { text: "We'll be fine.", next: 'fine' },
      ],
    },
    why: {
      speaker: 'elodie',
      lines: [{ text: 'Because the Crown is talking about Xaraguá again, and someone at the Throne has to answer them.' }],
      next: 'goodbye',
    },
    fine: {
      speaker: 'elodie',
      lines: [{ text: 'I know you will. That is not the same as me not worrying.' }],
      next: 'goodbye',
    },
    goodbye: {
      speaker: 'elodie',
      lines: [
        { text: 'Your grandmother has something for you. She has been waiting until you were ready. I think you are.' },
        { text: "Go and see her at home, in your grandfather's study." },
        { text: 'Anissa. Stay close to your sister.' },
        say(A, '...I will.'),
        { text: 'The Gaze sees you both. So do I.' },
        nar("Mother's carriage rolls out through the east gate, toward the Throne.", { fx: 'fade', set: { 'story.elodie_left': true } }),
      ],
    },
  }),

  // The plaza's doors stay closed until the opening is done (owner decision, Oct 16): first see Mother
  // off, then see Grandmother, then the first Echo (the war room). Anissa says why, at any closed door.
  script('plaza_door_closed', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.elodie_left' }, to: 'mother' },
        { if: { notFlag: 'item.sun_locket' }, to: 'grandmother' },
        { to: 'locket' },
      ],
    },
    mother: { lines: [say(A, "Wait, Gigi! Let's see Mother before she leaves.")] },
    grandmother: { lines: [say(A, "Wait, Gigi. Grandmother's waiting for us at home. Let's see her first.")] },
    locket: { lines: [say(A, 'Wait! The Locket... Grandmother said the study remembers. Let\'s try it there first.')] },
  }),

  script('gaze_keeper_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.anissa_woke' }, to: 'lights' },
        { if: { flag: 'story.bridge_crossed' }, to: 'bridge' },
        { to: 'festival' },
      ],
    },
    festival: {
      speaker: 'gaze_keeper',
      lines: [
        { text: 'The Gaze of Elodie does not rule us, child. She remembers. That is why rulers are a little afraid of her.' },
        { text: 'Have you heard? The rope bridge to the Temple island came down at dawn. No one hurt, the Gaze be thanked.' },
        { text: 'But the names are read on the island tonight. We will need a boat, or a miracle.' },
      ],
    },
    bridge: {
      speaker: 'gaze_keeper',
      lines: [{ text: 'They say the old Chain Bridge is down. The one that has stood raised since before I was born. I may need to sit.' }],
    },
    lights: {
      speaker: 'gaze_keeper',
      lines: [
        { text: 'Did you see? Every lantern in the city lit at once.' },
        { text: 'Forty years I have kept the Gaze, and I have never seen her so... awake.' },
      ],
    },
  }),

  script('soup_vendor_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.soup' }] }, to: 'overdue' },
        { if: { flag: 'side.soup.done' }, to: 'after' },
        { if: { all: [{ flag: 'side.soup.elder' }, { flag: 'side.soup.guard' }, { flag: 'side.soup.ferry' }] }, to: 'finish' },
        { if: { flag: 'side.soup.accepted' }, to: 'remind' },
        { to: 'greet' },
      ],
    },
    greet: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Bonjou! Kijan ou ye?', translation: 'Hello! How are you?' },
        { text: 'Soup in a clay pot, hot from the fire. No selling today, though. Today I feed my cousins.' },
        { text: 'All of my cousins. On festival day the whole city is my cousin.' },
      ],
      choices: [
        { text: 'It smells wonderful.', next: 'thanks' },
        { text: 'Save me a bowl.', next: 'thanks' },
        // Side quests wait until the opening is done (owner decision, Oct 16).
        { text: 'You look busy.', next: 'offer', if: { flag: 'story.warroom_echo' } },
      ],
    },
    thanks: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Mèsi! Come back when the stall is open and I will give you the good pot.', translation: 'Thank you!' }],
    },
    // Side quest: Soup for the Cousins.
    offer: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Busy? My nephew was meant to carry the bowls today. My nephew is asleep under a mango tree.' },
        { text: 'Three bowls promised: the old neighbor west of the plaza, the guard by the Hall, and the ferryman at the docks.' },
      ],
      choices: [
        { text: "I'll carry them.", next: 'accept' },
        { text: 'Not right now.', next: 'not_now' },
      ],
    },
    not_now: { speaker: 'soup_vendor', lines: [{ text: 'The soup will wait. It is soup. Waiting is what it does best.' }] },
    accept: {
      speaker: 'soup_vendor',
      set: { 'side.soup.accepted': true },
      lines: [
        { text: 'Mèsi, cherie! Hot, so walk fast. Not too fast.', translation: 'Thank you, dear!' },
        nar('(Gianna takes three bowls of soup. Soup for the Cousins is in the Quests page of the menu.)'),
        nar('(Tap the minimap to see the whole city. Tap someone to walk over and talk.)'),
      ],
    },
    remind: {
      speaker: 'soup_vendor',
      lines: [
        { text: 'Still bowls in the basket? The soup is getting cold, and so am I.' },
        { if: { notFlag: 'side.soup.elder' }, text: 'The old neighbor, west of the plaza. He will pretend he is not hungry. He is.' },
        { if: { notFlag: 'side.soup.guard' }, text: 'The guard by the Hall. Do not let him tell you he is on duty.' },
        { if: { notFlag: 'side.soup.ferry' }, text: 'The ferryman, down at the docks. Follow the complaining.' },
      ],
    },
    finish: {
      speaker: 'soup_vendor',
      set: { 'side.soup.done': true },
      lines: [
        { text: 'All three? And not one bowl broken?' },
        { text: 'Take these for the road. In this city, a cousin who carries soup is a cousin for life.' },
      ],
    },
    after: {
      speaker: 'soup_vendor',
      lines: [{ text: 'Come back any time, cousin. The good pot is always on.' }],
    },
    // The Overdue Shelf.
    overdue: {
      speaker: 'soup_vendor',
      set: { 'side.overdue.soup': true },
      lines: [
        say(G, 'The archive would like "Ninety Ways With Pumpkin" back.'),
        { text: 'Ay. Here. Page forty has soup on it. It was a very good page.' },
        nar('(Gianna got back "Ninety Ways With Pumpkin".)'),
      ],
    },
  }),

  // The debate corner's crowd (the debate itself: data/debates.ts).
  script('debate_onlooker_talk', {
    start: {
      lines: [],
      next: [{ if: { any: [{ flag: 'debate.zetwal_corner.won' }, { flag: 'debate.zetwal_corner.mediated' }] }, to: 'after' }, { to: 'during' }],
    },
    during: {
      speaker: 'villager',
      lines: [{ text: "Shh! I want to hear this. My cousin went to one of their quiet meetings and hasn't come back to Sunday dinner since." }],
    },
    after: { speaker: 'villager', lines: [{ text: 'Did you hear what the envoy\'s daughter said? I am telling my cousin tonight.' }] },
  }),

  script('recruiter_a_talk', {
    start: {
      speaker: 'recruiter_a',
      lines: [
        { text: "So much noise today. Drums, names, shouting. Doesn't it tire you?" },
        { text: 'We meet where it is quiet. No one there asks you to shout your grief.' },
        { text: 'If you ever need a meal, or help with a debt, the Quiet Crown helps. We only ask that you listen.' },
      ],
      choices: [
        { text: 'What do you want in return?', next: 'price' },
        { text: 'No, thank you.', next: 'no' },
      ],
    },
    price: {
      speaker: 'recruiter_a',
      lines: [{ text: 'Nothing. Only quiet. One voice instead of a thousand. Is that so much to want?' }],
    },
    no: {
      speaker: 'recruiter_a',
      lines: [{ text: 'The door stays open. It always does.' }],
    },
  }),

  script('recruiter_b_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'recruiter_b',
      lines: [
        { text: 'One hand on the Throne. One voice for the whole realm. Imagine how calm things would be.' },
        { text: 'You would be surprised who wears our hood, envoy\'s daughter.' },
      ],
    },
    after: {
      speaker: 'recruiter_b',
      lines: [{ text: 'That light on the island. Such a quiet little girl, to be so bright.' }],
    },
  }),

  script('town_guard_talk', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.guard' }] }, to: 'soup' }, { to: 'talk' }],
    },
    talk: {
      speaker: 'town_guard',
      lines: [
        { text: 'Those hooded folk hand out bread and ask for nothing back. That is exactly what worries me.' },
        { text: 'Nobody gives bread for nothing. Not even on festival day.' },
      ],
    },
    soup: {
      speaker: 'town_guard',
      set: { 'side.soup.guard': true },
      lines: [
        { text: 'Soup? I am on duty.' },
        { text: '...The law says nothing about soup. I checked. Twice. Thank her for me.' },
      ],
    },
  }),

  script('festival_kid_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'festival_kid',
      lines: [{ text: "I'm going to say my great-great-grandmother's name so loud the goddess has to cover her ears!" }],
    },
    after: {
      speaker: 'festival_kid',
      lines: [{ text: "Did you see? All the lanterns lit by themselves! And I hadn't even started shouting yet!" }],
    },
  }),

  script('elder_talk', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.elder' }] }, to: 'soup' }, { to: 'talk' }],
    },
    talk: {
      speaker: 'elder',
      lines: [
        { text: 'Your mother? At your age she argued with the whole council, and won.' },
        { text: "Then she took the name Limyè, for the goddess's light, she said. Her father's name was good enough for the rest of us." },
        { text: 'Well. Jean-Philippe is a mouthful to shout at a festival.' },
      ],
    },
    soup: {
      speaker: 'elder',
      set: { 'side.soup.elder': true },
      lines: [
        { text: "Soup from the plaza? I'm not hungry." },
        { text: '...I am a little hungry. She remembered me. She always remembers me. She is my cousin, you know.' },
        { text: 'Everyone is, today.' },
      ],
    },
  }),

  script('ferryman_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.ferry' }] }, to: 'book' },
        { if: { all: [{ flag: 'side.soup.accepted' }, { notFlag: 'side.soup.ferry' }] }, to: 'soup' },
        { if: { flag: 'story.bridge_crossed' }, to: 'after' },
        { to: 'before' },
      ],
    },
    before: {
      speaker: 'ferryman',
      lines: [
        { text: "Ferry to the island? Not today. The tide's wrong, and every boat is full of flowers for the names." },
        { text: "Your grandfather's over there? He'll be fine. He's survived worse than a broken bridge." },
        { text: 'So have I. Mostly.' },
      ],
    },
    after: {
      speaker: 'ferryman',
      lines: [{ text: 'The old Chain Bridge, down after fifty years? There goes my festival trade.' }],
    },
    // The Overdue Shelf.
    book: {
      speaker: 'ferryman',
      set: { 'side.overdue.ferry': true },
      lines: [
        say(G, 'The archive wants "Tides of the Southern Reach" back. Six months overdue.'),
        { text: 'That book? The sea has it now. Tragic. Very wet.' },
        say(G, "Ferryman. It's under the crate you're sitting on."),
        { text: '...The crate wobbles. It is a very useful book for crates. Fine. Take it.' },
        nar('(Gianna got back "Tides of the Southern Reach". It is only a little damp.)'),
      ],
    },
    // Soup for the Cousins.
    soup: {
      speaker: 'ferryman',
      set: { 'side.soup.ferry': true },
      lines: [{ text: 'Soup! The tide can wait. The tide always waits for soup.' }],
    },
  }),

  script('pilgrim_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'pilgrim',
      lines: [{ text: "I walked down from the hills to say my brother's name at the lamp. If the bridge is down, I'll say it to the water." }],
    },
    after: {
      speaker: 'pilgrim',
      lines: [{ text: "I said his name. The lamp was warm. I don't know how else to say it." }],
    },
  }),

  simple('marshal_stone', [
    nar('THE SUN ACCORD WAS SIGNED ON THIS GROUND.'),
    nar('Six clauses are carved beneath, one under another. There is room on the stone for a seventh. It is blank.'),
  ]),

  // ---- The bridgehead, present ------------------------------------------------------------------
  simple('bridge_look', [
    say(A, 'Gigi, look. The rope bridge...'),
    nar('Where the rope bridge hung this morning, two frayed ends sway over the chasm.'),
    say(G, "Grandfather's on the other side."),
    say(A, 'Is he stuck?'),
    say(G, "He'll be all right. But the names can't be read without him."),
  ]),

  simple('rope_bridge', [nar('Frayed rope, snapped clean through. No one is crossing here today.')], { 'story.bridge_seen': true }),

  script('plaque', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: {
      lines: [
        nar('A bronze plaque, green with age: THE CHAIN BRIDGE.'),
        nar('Raised by order of Marshal Patricio on the night before the Sun Accord. It has stood raised ever since.'),
      ],
    },
    after: {
      lines: [
        nar('A bronze plaque, green with age: THE CHAIN BRIDGE.'),
        nar('Raised by order of Marshal Patricio on the night before the Sun Accord, and lowered by his own hand before dawn.'),
      ],
    },
  }),

  script('winch_present', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [nar('The old winch. Fifty years of rust have welded it solid. It will not turn.')] },
    after: { lines: [nar('The old winch, rusted solid, its chain run out across the chasm. It has not moved in fifty years.')] },
  }),

  script('pawl_present', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [nar('An iron pawl beside the winch. Its pin hole is empty and full of rust.')] },
    after: { lines: [nar('An iron pin runs through the pawl, rusted in place. It has held for fifty years.')] },
  }),

  simple('bridge_cross', [
    say(A, 'It holds. Gigi, it holds.'),
    say(G, 'Fifty years of sun on these planks, and not one of them loose.'),
    say(A, '...Was this bridge always here?'),
    say(G, 'It is now.'),
  ]),

  // ---- The bridgehead, the Echo (the signature puzzle) ------------------------------------------
  once('bridge_echo_enter', 'story.bridge_echo_seen', [
    nar('Night. Torches along the chasm. The Chain Bridge stands raised against the island gate.'),
    say(AF, "I'm here, Gigi. I've got the door."),
  ]),

  script('bridge_echo_return', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'anchor.chain_bridge' }, { notFlag: 'story.bridge_return_seen' }] }, to: 'carried' },
        { if: { all: [{ notFlag: 'anchor.chain_bridge' }, { flag: 'story.winch_lowered' }, { notFlag: 'story.bridge_crept_seen' }] }, to: 'crept' },
      ],
    },
    carried: {
      set: { 'story.bridge_return_seen': true },
      lines: [
        nar('The present settles around you. Across the chasm, where the raised bridge stood a moment ago...'),
        nar('...the old Chain Bridge lies flat over the water, weathered by fifty years of sun.'),
        say(A, 'Gigi... look.'),
      ],
    },
    crept: {
      set: { 'story.bridge_crept_seen': true },
      lines: [
        nar('Across the chasm, the Chain Bridge still stands raised, as it has for fifty years.'),
        say(G, 'I lowered it. But by morning the chain dragged it back up.'),
        say(G, 'The night orders said it: pin the pawl, or she creeps back up.'),
      ],
    },
  }),

  script('winch_echo', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.chain_bridge' }, to: 'pinned' },
        { if: { flag: 'echo.chain_bridge_down' }, to: 'down' },
        { to: 'up' },
      ],
    },
    up: {
      lines: [nar('The great winch. Across the chasm, the Chain Bridge stands raised against the island gate, as you ordered at dusk.')],
      choices: [
        { text: 'Turn the winch and lower the bridge.', next: 'lower', set: { 'echo.chain_bridge_down': true, 'story.winch_lowered': true } },
        { text: 'Leave it raised.' },
      ],
    },
    lower: {
      lines: [
        nar('You lean into the crank. The chain pays out link by link, and the bridge comes down across the chasm with a boom.', { fx: 'shake' }),
        nar('The pawl swings loose beside the winch. Without its pin, the weight of the chain will drag the bridge back up by morning.'),
      ],
    },
    down: { lines: [nar('The bridge is down. The pawl hangs loose: without the pin, the chain will creep back up by morning.')] },
    pinned: { lines: [nar('Lowered and pinned. This bridge will stay down.')] },
  }),

  script('pawl_echo', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.chain_bridge' }, to: 'pinned' },
        { if: { flag: 'echo.chain_bridge_down' }, to: 'pin' },
        { to: 'idle' },
      ],
    },
    idle: { lines: [nar('An iron pin hangs on a chain beside the pawl. It is no use while the bridge is raised.')] },
    pin: {
      lines: [nar('The iron pin. Drive it through the pawl, and the bridge stays down for good.')],
      choices: [
        { text: 'Drive the pin through the pawl.', next: 'pinned_now', set: { 'anchor.chain_bridge': true } },
        { text: 'Not yet.' },
      ],
    },
    pinned_now: {
      lines: [
        nar('Clang. The pin bites. The pawl locks.', { fx: 'shake' }),
        say(P, 'There. Stay down.'),
        nar('(Anchor: this change will last into the present.)'),
      ],
    },
    pinned: { lines: [nar('The pin is through the pawl. The bridge stays down.')] },
  }),

  script('echo_sentry_talk', {
    start: { lines: [], next: [{ if: { flag: 'anchor.chain_bridge' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'echo_sentry',
      lines: [{ text: 'Bridge is up, Marshal, as ordered. Nobody crosses till the ink is dry.' }],
    },
    after: {
      speaker: 'echo_sentry',
      lines: [
        { text: 'Marshal? You said up for the night...' },
        say(P, 'I changed my mind. Let anyone cross who wants to remember.'),
        { text: "...Yes, sir. I'll tell the others the Marshal has gone poetic." },
      ],
    },
  }),

  // ---- The plaza, the Echo ----------------------------------------------------------------------
  once('plaza_echo_enter', 'story.plaza_echo_seen', [
    nar('The square is mud and canvas. Cookfires. Someone is singing, badly, and someone else is telling him so.'),
    nar('Fifty years ago: the night before the signing.'),
    say(AF, "I'm holding the door, Gigi."),
  ]),

  simple('marshal_stone_echo', [nar('A heap of cut stone, waiting. Masons will carve the Accord into it after the signing.')]),
  simple('signing_stage_echo', [nar("The signing platform, half built. Tomorrow two armies and the Crown's envoy will stand on it.")]),

  script('echo_soldier_talk', {
    start: {
      speaker: 'echo_soldier',
      lines: [
        { text: 'Marshal! Tomorrow we sign, and then we go home. Right, sir?' },
        say(P, 'Then we go home.'),
        { text: 'My mother will ask if I ate. Tell her I ate, sir, if she asks.' },
      ],
    },
  }),
  simple('echo_cook_talk', [
    say('echo_cook', "Eat something, Marshal. You can't sign a peace on an empty stomach."),
    say('echo_cook', "Lord Benny's people sent over peppers. Half the camp is crying. The other half wants more."),
  ]),
  simple('echo_scout_talk', [
    say('echo_scout', "The Crown's ships haven't moved, sir. Every lantern on them is lit."),
    say('echo_scout', 'They want us to see them watching.'),
  ]),
  simple('echo_drummer_talk', [say('echo_drummer', "When it's signed I'll drum till my hands give out, Marshal. Then I'll sleep for a week.")]),

  // ---- Home and the war room --------------------------------------------------------------------
  simple('house_enter', [say('anicette', "Gianna? Anissa? In here. In your grandfather's study.")]),

  script('anicette_talk', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.elodie_left' }, to: 'early' },
        { if: { notFlag: 'item.sun_locket' }, to: 'locket' },
        { if: { all: [{ flag: 'side.overdue.accepted' }, { notFlag: 'side.overdue.vol2' }] }, to: 'overdue' },
        { to: 'story' },
      ],
    },
    story: {
      lines: [],
      next: [
        { if: { notFlag: 'story.warroom_echo' }, to: 'go' },
        { if: { notFlag: 'clue.night_orders' }, to: 'after_echo' },
        { if: { notFlag: 'story.bridge_crossed' }, to: 'bridge' },
        { to: 'later' },
      ],
    },
    early: {
      speaker: 'anicette',
      lines: [
        { text: 'Gianna! Shouldn\'t you be in the square? Your mother speaks at noon.' },
        { text: 'Go on. Come and find me after she has gone. I have something for you.' },
      ],
    },
    locket: {
      speaker: 'anicette',
      lines: [
        { text: 'There you are. Did your mother get away?' },
        say(G, 'Her carriage just left.'),
        { text: "Good. Then she can't scold me for this." },
        nar('Grandmother opens a drawer in the map table and takes out a small gold locket shaped like the sun.'),
        { text: 'Your grandfather made this the year of the Accord. Two halves of a promise, he said. This half is ours.' },
        { text: 'It remembers, Gianna. Where the air shimmers, it will show you what that place remembers.' },
        say(G, 'Grandmother, that sounds like a story for children.'),
        { text: 'It is. It is also true. The Gaze remembers everything, and now and then she lends a little of it back.' },
        say(A, 'Can I hold it?'),
        { text: 'Not this one, little light. It is too small for what you carry.' },
        say(A, '...What do I carry?'),
        { text: 'One day you will tell me.' },
        nar('(Gianna received the Sun Locket.)', { set: { 'item.sun_locket': true } }),
        { text: 'There, by the map table, where your grandfather planned his war. The air has shimmered there for fifty years.' },
        nar('(Stand on the shimmering tiles and press Echo: E on a keyboard, X on a controller, Echo on a touch screen.)'),
      ],
    },
    go: {
      speaker: 'anicette',
      lines: [
        { text: 'Go on. The shimmering tiles, by the map table.' },
        { text: 'Anissa cannot go where you are going. But she will be close. She will hold the door.' },
      ],
    },
    after_echo: {
      speaker: 'anicette',
      lines: [
        { text: 'You went. I can see it in your face.' },
        { text: 'The night before the signing. I remember that night. He did not sleep at all.' },
        { if: { flag: 'anchor.night_orders' }, text: 'If he left anything for us, it will be where he always hid things: under the window seat.' },
        { if: { notFlag: 'anchor.night_orders' }, text: 'He kept copies of everything under the loose board by the window seat. Did you see?' },
      ],
    },
    bridge: {
      speaker: 'anicette',
      lines: [
        { text: 'The Chain Bridge. I have not thought of it in years. Your grandfather never could leave a thing half done.' },
        { text: 'Go. He is waiting on that island, and he will be worrying.' },
      ],
    },
    later: {
      speaker: 'anicette',
      lines: [{ text: 'The whole city saw the lights, Gianna. Whatever happened over there, I am proud of you both.' }],
    },
    // The Overdue Shelf: Volume Two, after one pointed question.
    overdue: {
      speaker: 'anicette',
      lines: [nar('Grandmother has the look she gets when she knows exactly what you are about to ask.')],
      choices: [
        { text: 'About your overdue book...', next: 'vol2' },
        { text: 'Never mind.', next: 'story' },
      ],
    },
    vol2: {
      speaker: 'anicette',
      lines: [],
      next: [{ if: { flag: 'lore.zetwal_ash_wars_temple' }, to: 'question' }, { to: 'not_read' }],
    },
    not_read: {
      speaker: 'anicette',
      lines: [
        { text: "My book? Hm. Have you read the temple's own record of the Ash Wars? The healers' one, on the history shelf?" },
        say(G, 'Not yet.'),
        { text: 'Then read theirs first. Gossip is only useful once you know the facts it is gossiping about.' },
      ],
    },
    question: {
      speaker: 'anicette',
      lines: [{ text: 'You read it. Good. Then tell me: at the ford of Cendre, how many dead did our healers count?' }],
      choices: [
        { text: 'Four hundred.', next: 'wrong' },
        { text: 'Forty.', next: 'right' },
      ],
    },
    wrong: {
      speaker: 'anicette',
      lines: [{ text: 'Four hundred is what the Crown wrote, in Aldermoor, far from the ford. Read it again, Gianna. Slowly.' }],
    },
    right: {
      speaker: 'anicette',
      set: { 'side.overdue.vol2': true },
      lines: [
        { text: 'Forty. And three hundred sent home. Remember that, the next time someone sings about Rael the Ruthless.' },
        { text: 'Here. Three years overdue. I wrote in the margins, so the archive gets back more than it lent.' },
        say(G, 'Grandmother! You wrote in a library book?'),
        { text: 'Somebody had to correct it, little archivist.' },
        nar('(Gianna got back "Ash Wars Gossip, Volume Two".)'),
      ],
    },
  }),

  once('warroom_enter', 'story.warroom_intro', [
    nar('The room tilts. Lamplight. Pipe smoke. Low voices.'),
    nar("The study is a war room, and you are standing in your grandfather's boots."),
    say(P, '...Strange. As if someone were reading over my shoulder.'),
    say(AF, "Gigi? I'm here, at the door. I'm holding it open. I can feel it."),
    say(AF, "Don't stay too long. Please."),
    nar('(In the memory you are Patricio. Talk to the people here. Press Echo on the shimmering tiles to return.)'),
  ]),

  script('warroom_return', {
    start: { lines: [], next: [{ if: { notFlag: 'story.warroom_returned' }, to: 'scene' }] },
    scene: {
      set: { 'story.warroom_returned': true },
      lines: [
        say(A, 'Gigi! You came back.'),
        say(A, "You were standing right there with your eyes open, but you weren't... here."),
        say(G, 'I was Grandfather. The night before the signing.'),
        say(A, '...Did he know you were there?'),
        say(G, "I don't think so. But he felt something."),
        { if: { flag: 'anchor.night_orders' }, speaker: G, text: 'He hid his night orders under the window seat. I made sure of it.' },
        { if: { notFlag: 'anchor.night_orders' }, speaker: G, text: 'He keeps his papers under the window seat. I should go back and leave the orders there.' },
      ],
    },
  }),

  script('echo_aide_talk', {
    start: {
      lines: [],
      next: [
        { if: { notFlag: 'story.warroom_echo' }, to: 'orders' },
        { if: { all: [{ notFlag: 'echo.orders_copy' }, { notFlag: 'anchor.night_orders' }] }, to: 'copy' },
        { to: 'done' },
      ],
    },
    orders: {
      speaker: 'echo_aide',
      set: { 'story.warroom_echo': true },
      lines: [
        { text: "Marshal. The Crown's clerks sent the Accord at last. Six clauses." },
        { text: "They say the seventh is 'still being copied.' They will bring it to the signing." },
        say(P, 'Still being copied. The night before we sign.'),
        { text: 'Lord Benny sent word from the Brasador camp. He will not put his name to pages he has not read.' },
        say(P, 'Then we will both read every page in the morning.'),
        { text: "And the Crown's ships are still anchored off the harbor, sir." },
        say(P, 'Then raise the Chain Bridge to the Temple island for the night. No one crosses until the ink is dry.'),
        { text: 'It takes a dozen men to raise it, sir.' },
        say(P, 'And two to lower it. Turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning.'),
        { text: 'Yes, Marshal. Night orders, then.' },
      ],
      next: 'copy',
    },
    copy: {
      speaker: 'echo_aide',
      lines: [
        { text: 'Your copy of the night orders, sir.' },
        nar('(Patricio took the night orders.)', { set: { 'echo.orders_copy': true } }),
        { text: 'Under the loose board by the window, as usual?' },
      ],
    },
    done: {
      speaker: 'echo_aide',
      lines: [
        { if: { flag: 'anchor.night_orders' }, text: 'Get some sleep, Marshal. Tomorrow is a long day.' },
        { if: { notFlag: 'anchor.night_orders' }, text: 'The board by the window, sir. Same as always.' },
      ],
    },
  }),

  script('echo_messenger_talk', {
    start: {
      speaker: 'echo_messenger',
      lines: [
        { text: "Marshal. The camp is saying the last page is about Xaraguá's harbor." },
        { text: "I only carry the letters, sir. I don't read them." },
        say(P, 'Then carry this one to the Xaraguá camp: nobody signs what they have not read.'),
      ],
    },
  }),

  simple('echo_guard_talk', [say('echo_guard', 'Quiet night, Marshal. Too quiet, my mother would say. She says that about every night.')]),

  simple('map_table_present', [
    nar("Grandfather's map table. The old campaign map is still pinned under glass: Zetwal, Xaraguá, the Crown's harbor chain."),
    nar('Over the Temple island, in faded ink: CHAIN BRIDGE.'),
  ]),
  simple('map_table_echo', [
    nar('Fresh ink. A pin for every company.'),
    nar('Over the Temple island, a note in your own hand: CHAIN BRIDGE. RAISE AT DUSK.'),
  ]),
  simple('study_shelf', [
    nar("Grandfather's shelf. The Alliance War, in three volumes. A thin book: The Gaze Remembers."),
    nar('A very thick one: Clauses and Their Consequences. The spine has never been cracked.'),
  ]),
  simple('window_seat', [nar("A window seat with Grandmother's cushions. One board underneath is loose, but there is nothing under it except dust.")]),

  script('loose_board', {
    start: { lines: [], next: [{ if: { flag: 'clue.night_orders' }, to: 'again' }, { to: 'read' }] },
    read: {
      lines: [
        nar('You lift the loose board under the window seat.'),
        nar("Underneath, folded tight and brown with age, is a paper in Grandfather's hand."),
        nar('NIGHT ORDERS. Raise the Chain Bridge to the Temple island at dusk.'),
        nar('To lower: turn the winch, then drive the iron pin through the pawl, or she creeps back up by morning. P. J-P.'),
        say(G, 'Fifty years under the floor. And I put it there an hour ago.'),
        say(A, "...That's not possible."),
        say(G, 'Grandmother would say the Gaze lends things back.'),
        say(A, "The Chain Bridge... that's the old one by the rope bridge. The one that's always raised."),
        say(G, 'Not for long.'),
        nar('(The night orders are in your Journal.)', { set: { 'clue.night_orders': true } }),
      ],
    },
    again: { lines: [nar("Grandfather's night orders: turn the winch, then drive the pin through the pawl.")] },
  }),

  script('floor_cache', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'anchor.night_orders' }, to: 'hidden' },
        { if: { flag: 'echo.orders_copy' }, to: 'hide' },
        { to: 'empty' },
      ],
    },
    hide: {
      lines: [
        nar('You kneel by the window seat and lift the loose board. Old papers underneath: lists, letters, a drawing of a ship.'),
        nar('Something makes you fold this copy small and push it to the very back, where no one would look for a long, long time.'),
      ],
      choices: [
        { text: 'Leave the night orders here.', next: 'hidden_now', set: { 'anchor.night_orders': true } },
        { text: 'Not yet.' },
      ],
    },
    hidden_now: {
      lines: [say(P, 'For whoever keeps this house after me.'), nar('(Anchor: this change will last into the present.)')],
    },
    hidden: { lines: [nar('The night orders are folded tight at the back of the cache.')] },
    empty: { lines: [nar('A loose board under the window seat. Patricio keeps copies of his papers here.')] },
  }),

  // ---- The Temple island ------------------------------------------------------------------------
  simple('temple_arrive', [
    nar('The Temple island. Pilgrims stranded since dawn crowd the path, staring at the bridge behind you.'),
    say(A, 'Everyone is looking at us.'),
    say(G, "They're looking at the bridge. Come on. Grandfather will be at the lamp."),
  ]),

  script('patricio_old_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'act1.complete' }, to: 'farewell' },
        { if: { flag: 'story.anissa_woke' }, to: 'after' },
        { if: { flag: 'story.met_patricio' }, to: 'waiting' },
        { to: 'meet' },
      ],
    },
    meet: {
      speaker: 'patricio_old',
      set: { 'story.met_patricio': true },
      lines: [
        { text: 'Gianna? Anissa? But the bridge... they told me it fell at dawn.' },
        say(G, 'The rope bridge fell. We came over the Chain Bridge.'),
        { text: 'The Chain Bridge.' },
        { text: 'I raised that bridge the night before the signing. And I lowered it again before morning. I never knew why.' },
        { text: 'I stood at the winch, and it was as if someone at my shoulder said: leave it down.' },
        nar('His eyes go to the Locket at your throat.'),
        { text: 'So Anicette gave it to you. Then I suppose I do know why.' },
        say(G, 'Grandfather, I was... you. For a little while.'),
        { text: 'Hm. I hope I was polite to you.' },
        { text: 'Fifty years I have read the names at this lamp. Tonight it will not take a flame. Not from me, not from anyone.' },
        { text: 'Without the lamp the names are not read, and people go home with their grief still in their mouths.' },
        { text: 'Will you try, archivist? You were always better with fire than I was.' },
      ],
    },
    waiting: {
      speaker: 'patricio_old',
      lines: [{ text: 'Try the lamp, Gianna. Your mother could never light it either, at your age. It is a stubborn old thing.' }],
    },
    after: {
      speaker: 'patricio_old',
      lines: [
        { text: 'In fifty years I never saw it burn like that.' },
        { text: 'The lookouts say a canoe has come in from Xaraguá. Go and see who it is.' },
      ],
    },
    farewell: {
      speaker: 'patricio_old',
      lines: [
        { text: 'Go carefully, both of you.' },
        { text: 'And Gianna: in Xaraguá, ask them what we promised. Ask them, not the Crown.' },
      ],
    },
  }),

  script('gaze_lamp', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.anissa_woke' }, to: 'lit' },
        { if: { flag: 'story.met_patricio' }, to: 'wake' },
        { to: 'cold' },
      ],
    },
    cold: { lines: [nar('The great Gaze lamp. Cold, and full of oil.')] },
    wake: {
      lines: [
        say(G, 'Let me try.'),
        nar('You cup your hands and call a small flame, the way you were taught in the archive.'),
        nar('It is a good flame: small, steady, and it wastes nothing.'),
        nar("At the lamp's lip it gutters out, as if the lamp is waiting for something else."),
        say(A, 'Gigi...'),
        say(A, "It's calling me. Like someone saying my name from very far away."),
        say(G, 'Anissa? Stay back. Let me...'),
        say(A, "I can't stop it. I'm sorry, I can't..."),
        nar('Light pours out of Anissa. Not fire: light, the color of morning through water.', { fx: 'flash' }),
        nar('The lamp catches. Then every lantern on the island. Then, across the water, every lantern in Zetwal.', { fx: 'flash' }),
        say(A, "I'm sorry. I didn't mean to. I didn't mean anything."),
        say(G, "Look at me. You didn't break anything. You lit it."),
        say(A, '...Are you scared of me?'),
        say(G, 'Never. Not for one second.'),
        say('patricio_old', 'Anicette always said you carried something, little one. I thought it was only a grandmother talking.'),
        say('patricio_old', 'Now. Read with me, all of you. Say their names.'),
        nar('The names are read until the moon is high. Nobody leaves early.'),
        nar('At the back of the crowd, a hooded figure watches Anissa for a long moment, then slips away toward the dock.', {
          set: { 'story.anissa_woke': true },
        }),
      ],
    },
    lit: { lines: [nar('The lamp burns with a light that is not quite fire. It is warm, and it does not flicker.')] },
  }),

  script('acolyte_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'acolyte',
      lines: [{ text: 'The Gaze lamp has burned at every reading for fifty years. Tonight it will not take a flame. Elder Patricio is beside himself.' }],
    },
    after: {
      speaker: 'acolyte',
      lines: [{ text: 'Your sister... is she all right? She looked so frightened. And so bright.' }],
    },
  }),

  script('temple_porter_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'temple_porter',
      lines: [{ text: 'Gianna! How did you... the OLD bridge? Never mind. Your grandfather is at the lamp. It will not light.' }],
    },
    after: {
      speaker: 'temple_porter',
      lines: [{ text: "Twenty years I've swept this temple. I'll be sweeping up light for a week." }],
    },
  }),

  script('mourner_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'mourner',
      lines: [{ text: "My husband's name is on the third stone. I come every year. This year I wasn't sure anyone would hear it." }],
    },
    after: {
      speaker: 'mourner',
      lines: [{ text: 'I said his name, and everyone heard it. Thank you.' }],
    },
  }),

  script('fisher_island_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.anissa_woke' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'fisher_island',
      lines: [{ text: 'Stuck here since dawn with a boat full of flowers and no one to sell them to.' }],
    },
    after: {
      speaker: 'fisher_island',
      lines: [{ text: 'That canoe came all the way from Xaraguá. Brave, or in a great hurry.' }],
    },
  }),

  script('name_stones', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'side.cane_name.accepted' }, { notFlag: 'side.cane_name.stones' }] }, to: 'search' }, { to: 'look' }],
    },
    look: {
      lines: [nar('Name stones, worn smooth by hands: the dead of the Alliance War.'), nar('Zetwal names and Xaraguá names, side by side.')],
    },
    search: {
      set: { 'side.cane_name.stones': true },
      lines: [
        nar('Gianna reads every stone. Soldiers, scouts, a drummer, a cook. No cutter called Grann.'),
        nar('At the bottom, one line is carved for all of them: "And the cutters of the Cane Road, whose names the Crown did not keep."'),
        say(G, 'The Locket shows what a place remembers. Maybe the road remembers her.'),
        nar('(Look for shimmering air on the Cane Road, by the east gate.)'),
      ],
    },
  }),

  once('temple_echo_enter', 'story.temple_echo_seen', [
    nar('Scaffolding and sawdust. The temple is half built, and the lamp is brand new.'),
    say(AF, "I've got the door, Gigi."),
  ]),
  simple('lamp_echo', [nar('The Gaze lamp, new and bright with polish. Someone is still fussing with the wick.')]),
  simple('echo_lampwright_talk', [
    say('echo_lampwright', 'The Marshal wants it lit for the signing. As if the goddess keeps to a schedule.'),
    say('echo_lampwright', "She'll light when she's ready. Lamps are like that. So are people."),
  ]),
  simple('echo_builder_talk', [say('echo_builder', "Mind the scaffolding, Marshal. We'll have her roofed by the first reading of the names. Or the second.")]),

  // ---- Yari -------------------------------------------------------------------------------------
  script('yari_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'act1.complete' }, to: 'after' },
        { if: { flag: 'story.yari_asked' }, to: 'ready' },
        { to: 'arrive' },
      ],
    },
    arrive: {
      speaker: 'yari',
      lines: [
        { text: 'Gigi! I saw the lights from the water. Half the coast must have seen them.' },
        say(G, 'Yari? You came all the way from Xaraguá?'),
        { text: 'Sailed most of it. Paddled the embarrassing part.' },
        nar("A hutia pokes its nose out of Yari's satchel and sniffs hopefully at your Locket."),
        { text: "No. That one isn't for you. Back in the bag." },
        nar('The hutia retreats, deeply offended.'),
        { text: "Gigi, I didn't come for the festival." },
        { text: 'Crown ships are anchored in our harbor. They brought a paper they call a Charter of Protection.' },
        { text: 'They say an old treaty gives them the right. A clause nobody in Xaraguá was ever shown.' },
        say(G, 'The Sun Accord. The seventh clause...'),
        { text: "That's what they called it. My elders are ready to sign anything that keeps the peace. I'm not." },
        { text: "Your mother's gone to the Throne. You're the closest thing to a Kay Soley envoy I know." },
        { text: 'Come to Xaraguá. Please.' },
      ],
      choices: [
        { text: "Of course I'll come.", next: 'yes' },
        { text: 'Tell me everything on the way.', next: 'yes' },
      ],
    },
    // Owner decision (Oct 15): Gianna asks for a little time, so the player can finish the city's errands
    // and the boar fight (learning the game while it is still gentle) before the chapter ends.
    yes: {
      speaker: 'yari',
      lines: [
        say(A, "...I'm coming too."),
        { text: 'I hoped you would, Anissa.' },
        say(G, "Soon, Yari. I promise. I have work at the archive, and a few things around the city to finish before I can go."),
        { text: "Then I'll help. Faster that way." },
        { text: 'Mind the Cane Road. A boar was tearing up the cane when I came in. It did not like my face.' },
        { text: 'And Gigi, you will need papers. The Crown boards every boat in our harbor now.' },
        say(G, 'The Hall of the Accord can write them. Up the steps at the head of the plaza.'),
        { text: "Find me here at the dock when you're ready. Not too long, Gigi.", set: { 'story.yari_asked': true } },
      ],
    },
    ready: {
      lines: [],
      next: [
        { if: { notFlag: 'story.envoy_papers' }, to: 'ready_papers' },
        // The boar first (owner decision, Oct 16: the first battle is not optional).
        { if: { notFlag: 'encounter.wilds.boar.won' }, to: 'ready_boar' },
        {
          if: { all: [{ flag: 'side.overdue.done' }, { flag: 'side.soup.done' }, { flag: 'side.cane_name.done' }, { flag: 'encounter.wilds.boar.won' }] },
          to: 'ready_all',
        },
        { to: 'ready_errands' },
      ],
    },
    ready_papers: {
      speaker: 'yari',
      lines: [
        { text: 'Did the Hall write your papers? No papers, no landing. The Crown turns back every boat without them.' },
        say(A, 'The Hall of the Accord, Gigi. Up the steps at the head of the plaza.'),
      ],
    },
    ready_boar: {
      speaker: 'yari',
      lines: [
        { text: 'Not with that boar still loose on the Cane Road. It charged three cane cutters this morning.' },
        { text: "We don't sail off and leave them to it. Out through the east gate, Gigi. I'll come with you." },
        say(A, 'The Cane Road, Gigi. Past the east gate, where the cane starts.'),
      ],
    },
    ready_errands: {
      speaker: 'yari',
      lines: [{ text: 'The tide is turning. Did you finish what you had to do? Your Quests page says otherwise.' }],
      choices: [
        { text: 'Not yet. Soon.', next: 'later' },
        { text: "Let's go anyway.", next: 'depart' },
      ],
    },
    ready_all: {
      speaker: 'yari',
      lines: [{ text: 'Books back, soup delivered, a name carved, and the boar sorry it met us. Ready?' }],
      choices: [
        { text: "Let's go.", next: 'depart' },
        { text: 'Not yet.', next: 'later' },
      ],
    },
    later: {
      speaker: 'yari',
      lines: [{ text: "I'll be here. The hutia is guarding the canoe. Badly." }],
    },
    depart: {
      speaker: 'yari',
      lines: [
        say(A, 'Goodbye, Zetwal.'),
        { text: 'Xaraguá, then. We sail with the morning tide.', set: { 'act1.complete': true } },
      ],
    },
    after: {
      speaker: 'yari',
      lines: [{ text: "Morning tide. Don't be late, or I'll let the hutia pack for you." }],
    },
  }),

  // ---- The new sections: the Temple Archive, the Hall of the Accord, the Cane Road ----------------
  // ---- Vendors: a greeting, then their shop opens -----------------------------------------------
  simple('smith_talk', [
    say('smith', 'Bonjou!', { translation: 'Hello!' }),
    say('smith', 'Festival or not, the forge stays hot. Blades, bows, a good vest. Look all you like, archivist.'),
  ]),
  simple('charm_seller_talk', [
    say('charm_seller', 'Bonjou, cherie! Kijan ou ye?', { translation: 'Hello, dear! How are you?' }),
    say('charm_seller', 'Charms stitched by hand. Every sun on them took me an hour. Every hour, I prayed.'),
  ]),
  simple('grocer_talk', [
    say('grocer', 'Bonjou! Mango, soup, akasan. Festival prices, festival smiles.', { translation: 'Hello!' }),
  ]),

  script('archivist_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'side.overdue.done' }, to: 'after' },
        { if: { all: [{ flag: 'side.overdue.ferry' }, { flag: 'side.overdue.soup' }, { flag: 'side.overdue.vol2' }] }, to: 'returned' },
        { if: { flag: 'side.overdue.accepted' }, to: 'remind' },
        { if: { flag: 'lore.zetwal_ash_wars_temple' }, to: 'ash' },
        { to: 'first' },
      ],
    },
    first: {
      speaker: 'archivist',
      lines: [
        { text: 'Festival day, Gigi, and you come to work? The archive is open to anyone today. Read what you like.' },
        { text: 'The history shelf needs sorting. Three books on the Ash Wars, and no two agree on anything.' },
      ],
      next: 'offer',
    },
    ash: {
      speaker: 'archivist',
      lines: [
        { text: 'You read the temple record of Cendre ford. Forty dead, not four hundred.' },
        { text: 'Somebody wanted the Lord of Ardencia feared. Your grandmother has opinions about who. She will not share them with me.' },
      ],
      next: 'offer',
    },
    // Side quest: The Overdue Shelf.
    offer: {
      speaker: 'archivist',
      lines: [
        { text: 'And while you are here: your overdue list. The ferryman, the soup vendor, and your grandmother.' },
        { text: 'Today everyone is in a good mood. Today they might even give the books back.' },
      ],
      choices: [
        { text: "I'll get them back.", next: 'accept' },
        { text: 'Not today.' },
      ],
    },
    accept: {
      speaker: 'archivist',
      set: { 'side.overdue.accepted': true },
      lines: [
        { text: 'Bless you. Be firm with the ferryman. Be gentle with your grandmother. Be quick with the soup vendor, or she will feed you.' },
        nar('(The Overdue Shelf is in the Quests page of the menu.)'),
      ],
    },
    remind: {
      speaker: 'archivist',
      lines: [
        { text: 'Any luck with the overdue books?' },
        { if: { notFlag: 'side.overdue.ferry' }, text: 'The ferryman will tell you the sea has his. The sea has never borrowed a book from us.' },
        { if: { notFlag: 'side.overdue.soup' }, text: 'The soup vendor has the pumpkin book. Brace yourself for page forty.' },
        { if: { notFlag: 'side.overdue.vol2' }, text: 'Your grandmother has Volume Two. Three years. I have stopped asking. I have started praying.' },
      ],
    },
    returned: {
      speaker: 'archivist',
      set: { 'side.overdue.done': true },
      lines: [
        { text: 'All three. Damp, souped, and... Volume Two. In your grandmother\'s hand, in every margin.' },
        { text: 'She wrote in a library book. I should be furious. I think the margins are worth more than the book.' },
        { text: 'It goes on the Tales shelf. Volume One is still missing, mind. Nobody has signed it out.' },
        { text: 'Someday it will turn up somewhere strange. Books do.' },
      ],
    },
    after: {
      speaker: 'archivist',
      lines: [{ text: "Volume Two is on the Tales shelf. Read your grandmother's margins. Then tell me who she thinks wanted Rael feared." }],
    },
  }),

  // The Envoy's Papers (owner decision, Oct 15: the one task at the Hall of the Accord in Chapter 1).
  // Crown ships search every boat at Xaraguá, so Gianna needs envoy papers: written and sealed by the Hall
  // clerk with the Head of State's seal (at the engraver's in the Iron Market, being re-cut), then signed
  // by the Chancellor. Yari will not sail without them.
  script('hall_clerk_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.envoy_papers' }, to: 'after' },
        { if: { flag: 'story.papers_sealed' }, to: 'sign' },
        { if: { flag: 'item.elodie_seal' }, to: 'issue' },
        { if: { flag: 'story.papers_asked' }, to: 'waiting' },
        { if: { flag: 'story.yari_asked' }, to: 'ask' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'hall_clerk',
      lines: [
        { text: 'Welcome to the Hall of the Accord. A copy of the Sun Accord for any citizen who asks: that is the law, and I am proud of it.' },
        { text: 'The original? Sealed in the vault. Only the Head of State and the Marshal have ever read all of it.' },
        { text: 'Your mother left me a list of things to do while she is at the Throne. It is longer than the Accord.' },
      ],
    },
    ask: {
      speaker: 'hall_clerk',
      lines: [
        say(G, 'I need travelling papers. Xaraguá has asked for an envoy of Kay Soley, and Mother is at the Throne.'),
        { text: 'An envoy. To Xaraguá. With Crown ships in the harbor.' },
        { text: 'Then you need papers more than courage. The Crown boards every boat now. Without papers they turn you back, or keep you.' },
        { text: "I write them; the Head of State's seal goes on them; the Chancellor signs. The seal is the trouble." },
        { text: 'Your mother sent it to be re-cut before she left. Fifty years of laws had worn the sun on it smooth.' },
        { text: 'The engraver has it, in the Iron Market, west of the plaza. Bring it to me.', set: { 'story.papers_asked': true } },
        say(A, "Mother's seal... I've never even held it."),
        nar("(The Hall clerk needs Mother's seal from the engraver in the Iron Market.)"),
      ],
    },
    waiting: {
      speaker: 'hall_clerk',
      lines: [{ text: 'The engraver works in the Iron Market, on the iron row east of the clock gate. He hums while he works. Follow the humming.' }],
    },
    issue: {
      speaker: 'hall_clerk',
      lines: [
        say(G, 'The seal. Re-cut.'),
        { text: 'Look at that sun. Sharp enough to cut the paper it signs.' },
        nar("The clerk writes in a careful hand, warms the wax, and presses Mother's seal into it."),
        { text: 'Gianna Limyè, envoy of Kay Soley to Xaraguá, under the seal of the Head of State. Now the Chancellor signs.' },
        {
          text: "Her office is off the gallery, the first door east. The seal stays here with me; I'll sleep better.",
          set: { 'item.elodie_seal': 0, 'item.draft_papers': 1, 'story.papers_sealed': true },
        },
        nar('(Gianna received the unsigned envoy papers. The Chancellor must sign them.)'),
      ],
    },
    sign: {
      speaker: 'hall_clerk',
      lines: [{ text: "The Chancellor's office: up the gallery, the first door on the east side. She signs everything. Eventually." }],
    },
    after: {
      speaker: 'hall_clerk',
      lines: [{ text: 'Keep the papers on you, envoy. The Crown reads seals far more carefully than it reads treaties.' }],
    },
  }),
  script('chancellor_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.envoy_papers' }, to: 'after' },
        { if: { flag: 'story.papers_sealed' }, to: 'sign' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'chancellor',
      lines: [
        { text: 'Gianna. Your mother left me the Hall, the council and three Crown ships. I would trade any two of them for a quiet week.' },
        { text: 'While she is at the Throne, I govern in her name. Not in her chair. Nobody sits in that chair.' },
        { text: "The Crown's consul asks for an audience every morning. Every morning I am busy. It is becoming a long week." },
      ],
    },
    sign: {
      speaker: 'chancellor',
      lines: [
        { text: 'Envoy papers. Xaraguá.' },
        nar('She reads every line. Twice. Then she looks at you over the top of the page.'),
        { text: 'Your mother went to the Throne to speak for us. You go to Xaraguá to listen for us. Listen well.' },
        { text: 'And write. The courier office will find you anywhere a pigeon can fly.', set: { 'item.draft_papers': 0, 'item.envoy_papers': 1, 'story.envoy_papers': true } },
        nar("(Gianna received the envoy papers, sealed and signed.)"),
      ],
    },
    after: {
      speaker: 'chancellor',
      lines: [{ text: 'Go carefully, envoy. Whatever you learn in Xaraguá, this Hall will want to hear it before the Crown does.' }],
    },
  }),
  simple('hall_seat', [
    nar('The Throne of the State: a plain chair of gold-leafed mahogany on its dais, a sun carved in the back.'),
    nar('Here the Head of State gives audience, hears the council, and makes the laws of Zetwal.'),
    say(A, "Mother's shawl is still over the arm. It's strange to see it empty."),
  ]),
  simple('hall_sign', [
    nar('THE HALL OF THE ACCORD. Seat of the State of Zetwal. Open to every citizen, every day the sun rises.'),
    nar('Below, in chalk: "Council sits tonight. Petitions to the clerk. Complaints about the soup vendor, also the clerk."'),
  ]),
  simple('accord_statue', [
    nar('Three bronze figures with their hands raised over a scroll: a soldier, a cane cutter and a scribe.'),
    nar('The plaque: "Fifty years ago we promised that no crown would ever again decide who we are."'),
    say(A, 'The soldier has Grandfather\'s nose.'),
  ]),

  // ---- Accord Square ----------------------------------------------------------------------------
  simple('honor_guard_talk', [
    say('honor_guard', 'The Hall is open to every citizen. We are here for the ones who are not citizens, archivist.'),
  ]),
  simple('honor_guard_2_talk', [
    say('honor_guard', 'Stand straight, they told me. Look proud. Nobody said for how long. It has been since sunrise, archivist.'),
  ]),
  simple('gazette_crier_talk', [
    say('gazette_crier', 'Gazette! Crown ships off the point! Council to sit tonight! Festival a great success, says festival committee!'),
    say('gazette_crier', 'One sou, archivist. The truth costs more, but the gazette is cheaper.'),
  ]),
  simple('petitioner_talk', [
    say('petitioner', 'Three days I have waited to see the Chancellor about my fence. My neighbor\'s goat has opinions about my fence.'),
    say('petitioner', 'The Crown man went in ahead of me. He had no fence at all. Only papers.'),
  ]),
  simple('protester_talk', [
    say('protester', 'No Charter for Zetwal! No Charter for Xaraguá! No Charter for anybody!'),
    say('protester', 'They say the Crown only wants a harbor. That is what they said fifty years ago. Ask your grandfather.'),
  ]),
  simple('courier_rider_talk', [
    say('courier_rider', 'Three days to the far coast and three back. My horse knows the road better than I do. She is better company too.'),
  ]),
  simple('nursemaid_talk', [
    say('nursemaid', 'The councillors\' children, all six. I bring them to see the statue. They want to climb it. It is a matter of national dignity.'),
  ]),

  // ---- The Hall of the Accord inside -------------------------------------------------------------
  simple('hall_guard_talk', [
    say('hall_guard', 'Wipe your feet, archivist. The steward counts the footprints. I have seen him do it.'),
  ]),
  simple('hall_guard_2_talk', [
    say('hall_guard', 'He checks your feet, I check your face. Yours will do, archivist. There is ink on your nose.'),
  ]),
  simple('hall_page_talk', [
    say('hall_page', 'Council west, the Chancellor and the couriers east, the throne at the end. I run between all of them. Forty times a day.'),
    say('hall_page', 'If you have a message, I am faster than a pigeon. Mostly. Not uphill.'),
  ]),
  simple('hall_steward_talk', [
    say('hall_steward', 'The portraits are dusted every morning, the floors every evening, and the consul is watched at all hours.'),
    say('hall_steward', 'The last is not my job. I do it anyway.'),
  ]),
  simple('throne_usher_talk', [
    say('throne_usher', 'No one sits on the Throne of the State but the Head of State. Not the Chancellor, not the Speaker, not the cat.'),
    say('throne_usher', 'The cat has tried. The cat has been told.'),
  ]),
  simple('council_speaker_talk', [
    say('council_speaker', 'Order. Order. Oh, it is only you, Gianna. Forgive me; I say it out of habit, even at breakfast.'),
    say('council_speaker', 'The council sits tonight about the ships. Half want peace at any price, half want the old harbor chain raised.'),
    say('council_speaker', 'My task is to let them both be heard, then let your mother decide. Without her, we only argue louder.'),
  ]),
  simple('elder_dove_talk', [
    say('elder_dove', 'Peace has kept Zetwal fed for fifty years, child. If a paper keeps those ships quiet, I will sign it twice.'),
    say('elder_dove', 'Your grandfather fought so that you would never have to. Do not let anyone make a soldier of you. Not even him.'),
  ]),
  simple('elder_hawk_talk', [
    say('elder_hawk', 'Three Crown ships off the point. I asked the council to raise the old harbor chain. They called me a warmonger.'),
    say('elder_hawk', 'Fifty years ago they called your grandfather the same. Then they built him a statue.'),
  ]),
  simple('crown_consul_talk', [
    say('crown_consul', 'Ah, the Head of State\'s daughter. His Majesty\'s consul to Zetwal, at your service. Truly.'),
    say('crown_consul', 'I bring nothing but goodwill and a few papers to sign. Do give your mother my regards when she returns.'),
    say('crown_consul', 'We have so much to discuss. The old treaties are so long, and so very few people have read all of them.'),
    say(A, "Gigi... I don't like him."),
  ]),
  simple('foreign_envoy_talk', [
    say('foreign_envoy', 'I came across the sea to speak with your Head of State, and she has gone to the Throne the same week. Such is diplomacy.'),
    say('foreign_envoy', 'I will wait. The Crown\'s consul waits too, across the room. We smile at each other. Neither of us means it.'),
    say(G, 'Where are you from?'),
    say('foreign_envoy', 'Far enough that you will need a ship and a good reason. Perhaps one day you will have both.'),
  ]),
  script('seal_keeper_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.papers_sealed' }, to: 'back' }, { to: 'idle' }] },
    idle: {
      speaker: 'seal_keeper',
      lines: [
        { text: 'I am the Keeper of the Seal. I keep the seal. Usually.' },
        { text: 'Your mother sent it to the engraver to be re-cut, and I have not slept since.' },
        { text: 'A keeper with nothing to keep is only a man in a robe.' },
      ],
    },
    back: {
      speaker: 'seal_keeper',
      lines: [{ text: 'The seal is home! Re-cut, too. Look at those rays. I may weep. I may already be weeping.' }],
    },
  }),
  simple('chief_courier_talk', [
    say('chief_courier', 'Pigeons to every island in a day, riders to the far coast in three. When the Hall speaks to the realm, it speaks from this room.'),
    say('chief_courier', 'Lately more letters come in than go out. Most of them ask the same thing: what does the Crown want?'),
  ]),
  simple('treasurer_talk', [
    say('treasurer', 'Every coin the state of Zetwal owns passes through these boxes, and I count it twice. Three times on festival days.'),
    say('treasurer', 'The Crown ships pay their harbor dues in promises. Promises do not stack well.'),
  ]),
  simple('scribe_talk', [
    say('scribe', 'Every law is copied six times: one for the vault, one for the Hall, one for each district. My hand has not stopped since spring.'),
  ]),
  simple('scribe_2_talk', [
    say('scribe', 'He copies the laws. I copy the Crown\'s letters. Theirs are longer, and they say less.'),
    say('scribe', 'Lately every letter ends the same way: "with the deepest respect." I have started to count the respect. It is going down.'),
  ]),
  simple('council_desk', [
    nar("The Speaker's desk: a bell, an hourglass for long speeches, and a gavel worn pale where it has been banged."),
    nar('Tonight\'s order of business, in a neat hand: "1. The Crown ships. 2. The Crown ships. 3. The festival accounts."'),
  ]),
  simple('pigeon_loft', [
    nar('The pigeons of the Hall, each with a ring on its leg naming its island. They coo in a dozen accents.'),
  ]),
  simple('courier_map', [
    nar("The courier routes, pinned across the realm: red threads to every capital, and new black pins off Xaraguá's coast."),
  ]),
  simple('treasury_chests', [
    nar('Iron-bound strongboxes, each with three locks. The Treasurer has one key, the Chancellor another, the Head of State the third.'),
  ]),
  simple('portrait_patricio', [
    nar('MARSHAL PATRICIO, THE YEAR OF THE ACCORD. Young, in his red coat, one hand on a rolled map, looking past the painter.'),
    say(A, 'He looks so serious. He never looks that serious when he tells stories.'),
  ]),
  simple('portrait_solange', [
    nar('MOTHER SOLANGE, KEEPER OF THE NAMES. An old woman with ink on her fingers, a quill in her hand, a list in her lap.'),
  ]),
  simple('portrait_elodie', [
    nar('ELODIE LIMYÈ, HEAD OF STATE. Mother, painted the year she was chosen, gold at her shoulders, not quite smiling.'),
    say(G, 'She hated sitting for this. She read the whole time.'),
  ]),
  simple('portrait_founders', [
    nar('THE SIGNING OF THE SUN ACCORD. A crowded table on the plaza, the Marshal at its head, and at the far end a Crown envoy.'),
    nar('The painter left his face in shadow. Nobody remembers why.'),
  ]),

  // ---- The Iron Market --------------------------------------------------------------------------
  simple('iron_market_hall', [
    nar('THE IRON MARKET. Red iron and green roofs, the clock over the gate five minutes fast since anyone can remember.'),
    nar('Inside it is dark and loud and smells of everything: coffee, mangoes, fish, smoke, soap, rain.'),
  ]),
  script('engraver_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'story.papers_asked' }, { notFlag: 'item.elodie_seal' }, { notFlag: 'story.papers_sealed' }] }, to: 'seal' },
        { if: { flag: 'item.elodie_seal' }, to: 'hurry' },
        { to: 'idle' },
      ],
    },
    idle: {
      speaker: 'engraver',
      lines: [
        { text: 'Bonjou, archivist. Names on rings, suns on seals. If it holds still, I can cut it.', translation: 'Hello' },
        { text: 'The Hall keeps me busy. Every new law needs a stamp, and every stamp wears out.' },
      ],
    },
    seal: {
      speaker: 'engraver',
      lines: [
        { text: "The Head of State's seal? Finished it this morning." },
        nar("He unwraps a cloth. Mother's seal: a heavy brass sun, its rays cut fresh and sharp."),
        { text: "I don't hand it to just anyone. Let me see you... Her eyes. Your grandfather's ink on your fingers. Here." },
        { text: "Straight to the clerk, now. If a Crown man sees that in your hand, he'll want to know what you mean to sign.", set: { 'item.elodie_seal': 1 } },
        nar("(Gianna received Mother's seal.)"),
      ],
    },
    hurry: {
      speaker: 'engraver',
      lines: [{ text: 'Go on, to the Hall with it. A seal in a satchel is a worry in my chest.' }],
    },
  }),
  simple('produce_seller_talk', [
    say('produce_seller', 'Bonjou, cherie!', { translation: 'Hello, dear!' }),
    say('produce_seller', 'Mango! Kasav! Cane juice pressed while you wait! What do you need?'),
  ]),
  simple('spice_seller_talk', [
    say('spice_seller', 'Pikliz to wake the dead, pepper to wake the pikliz. Taste, taste. You only cry a little.'),
  ]),
  simple('cloth_merchant_talk', [
    say('cloth_merchant', 'Cotton from Xaraguá, silk from who-knows-where, robes fit for a temple. Feel this. No, wash your hands first.'),
  ]),
  simple('ironmonger_talk', [
    say('ironmonger', 'Hinges, nails, hooks, chain. The whole city hangs on my iron, archivist, and nobody thanks a nail.'),
    say('ironmonger', 'The Crown ships buy chain by the mile these days. I do not ask what it is for. Lately I wonder.'),
  ]),
  simple('fishmonger_talk', [
    say('fishmonger', 'Snapper, conch, a lobster with a bad attitude. All from this morning. The lobster from this minute.'),
  ]),
  simple('goat_herder_talk', [
    say('goat_herder', 'This one is Pwofesè. He has eaten two hats and a council notice. He knows more law than the Speaker.'),
  ]),
  simple('lottery_seller_talk', [
    say('lottery_seller', 'Borlette! Dream of a fish, play twelve. Dream of a boat, play thirty. Dream of the Crown, play nothing and hide.'),
  ]),
  simple('letter_writer_talk', [
    say('letter_writer', 'Letters written, read aloud, or answered. Love letters cost double. Apologies cost triple.'),
    say('letter_writer', 'Half my trade is people writing to cousins in Xaraguá. Lately the answers come slower. Some do not come at all.'),
  ]),
  simple('porter_talk', [
    say('porter', 'Sixty sacks of rice this morning, forty of charcoal this afternoon. Tonight, one bowl of soup, very slowly.'),
  ]),
  script('pickpocket_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.pickpocket_caught' }, to: 'again' }, { to: 'first' }] },
    first: {
      speaker: 'pickpocket',
      lines: [
        nar('A small hand slides toward your satchel.'),
        say(A, 'Gigi. His hand.'),
        { text: '...I was checking if your bag was closed. It is. Very good. Safe bag. Goodbye.', set: { 'story.pickpocket_caught': true } },
      ],
    },
    again: {
      speaker: 'pickpocket',
      lines: [{ text: 'I am not stealing, I am standing. Standing is free. Ask the Speaker.' }],
    },
  }),
  simple('market_kid_talk', [
    say('market_kid', "The engraver let me hold a seal once. I stamped my arm. Mama says I'm officially a law now."),
  ]),
  simple('market_shopper_talk', [
    say('market_shopper', 'The spice seller charged me double. I paid. You do not argue with a woman holding that many peppers.'),
  ]),

  // ---- The Old Harbor (more here when Gianna comes home) ----------------------------------------
  simple('fishwife_talk', [
    say('fishwife', 'Bonjou! Fish this morning, festival tonight, sore feet tomorrow.', { translation: 'Hello!' }),
    say('fishwife', 'The Crown ships scare off the big schools. My grandmother said the same fifty years ago. The sea remembers who comes calling.'),
  ]),
  simple('net_mender_talk', [
    say('net_mender', 'A net is mostly holes, archivist. The trick is knowing which ones to keep.'),
    say('net_mender', 'Your grandfather once mended a net with me on this very sand. Terrible at it. Never stopped talking about the Accord.'),
  ]),
  simple('customs_clerk_talk', [
    say('customs_clerk', 'Everything that comes into Pòdlimyè by sea passes my table. Rum, cloth, cousins, gossip.'),
    say('customs_clerk', 'This house was the Crown\'s once. They counted every sack of our sugar here. Now we count theirs. A small joy, but mine.'),
  ]),
  simple('customs_sign', [
    nar('CUSTOMS HOUSE OF THE FREE PORT OF PÒDLIMYÈ. Declare your goods. Declare your name.'),
    nar('Under it, an older sign shows through the paint: a crown, and a list of taxes nobody pays anymore.'),
  ]),
  simple('harbor_kid_talk', [
    say('harbor_kid', 'I counted the Crown ships from the pier. Three. My brother says four. My brother cannot count.'),
  ]),
  simple('old_sailor_talk', [
    say('old_sailor', 'Fifty years ago this whole harbor was Crown ships, mast to mast. You could walk across the water on their decks.'),
    say('old_sailor', 'The morning after the Accord they sailed. I watched every one go. Now some are back. I am too old to watch them go twice.'),
  ]),
  simple('ferry_hand_talk', [
    say('ferry_hand', 'The ferry runs when the ferryman is sober and the tide agrees. Today, neither.'),
    say('ferry_hand', 'Come back another day, archivist. The islands will still be there. Probably.'),
  ]),

  // ---- Solèy Heights (more here when Gianna comes home) -----------------------------------------
  simple('gardener_talk', [
    say('gardener', 'Bonjou, ti cheri. Peppers, callaloo, the best basil in Zetwal. Do not tell the market vendor.', { translation: 'Hello, little dear.' }),
    say('gardener', 'These terraces were an orchard once. The soldiers ate every mango the year of the Accord. Grandmothers still complain.'),
  ]),
  simple('poet_talk', [
    say('poet', 'I am writing a poem about the festival. So far I have "light". It is a strong start.'),
    say('poet', 'Come back when I have a second word. It may take years.'),
  ]),
  simple('porch_widow_talk', [
    say('porch_widow', 'My husband carried a lantern in the Revolution. His name is read every year. Every year I sit here and listen for it.'),
    say('porch_widow', 'You are Elodie\'s girl. Tell your mother the Heights still vote, and still remember who fixed the well.'),
  ]),
  simple('lookout_keeper_talk', [
    say('lookout_keeper', 'From here you can see the whole city. The plaza, the Hall, the harbor, the Temple island, and the cane all the way to the hills.'),
    say('lookout_keeper', 'And the Crown ships, just past the point. I keep the old signal fire ready. Nobody has asked me to light it. Yet.'),
  ]),
  simple('lookout_view', [
    nar('All of Pòdlimyè below: the plaza lanterns, the gold dome of the Hall, the boats in the harbor, the lamp on the Temple island.'),
    say(A, "It's so small from up here, Gigi. Everyone we know fits in it."),
  ]),
  simple('lookout_sign', [nar('THE LOOKOUT. Mind the edge. Mind the goats. Mind the poet.')]),
  simple('heights_well', [
    nar('An old stone well. A bucket on a rope, and a carved line on the rim: "Dug by the Heights, for the Heights. Year of the Accord."'),
  ]),

  script('cane_cutter_talk', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'side.cane_name.recorded' }, { notFlag: 'side.cane_name.done' }] }, to: 'finish' },
        { if: { all: [{ flag: 'side.cane_name.accepted' }, { notFlag: 'side.cane_name.done' }] }, to: 'remind' },
        { if: { flag: 'story.zetwal_return' }, to: 'danger' },
        { if: { flag: 'side.cane_name.done' }, to: 'thanks' },
        { to: 'calm' },
      ],
    },
    calm: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'Festival day, archivist! Even the cane gets a rest. The road is as peaceful as it has been in years.' },
        { text: 'Only thing out there today is a veiled woman by the old mill, asking the young ones if they feel alone. Odd sort.' },
      ],
      choices: [
        { text: 'You seem far away today.', next: 'grann' },
        { text: 'Enjoy the rest.' },
      ],
    },
    danger: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'You came back at a bad time, archivist. Keep to the road and keep moving.' },
        { text: 'Bandits by day, smugglers by night, and those veiled folk everywhere now.' },
        { text: 'If the cane goes quiet around you, run. The cane is never quiet.' },
      ],
    },
    // Side quest: A Name in the Cane.
    grann: {
      speaker: 'cane_cutter',
      lines: [
        { text: 'Far away? No. Only... the names are read tonight, and my grandmother is on no stone.' },
        { text: 'She cut cane on this road when it was the Crown\'s. Grann, we called her. I never learned her real name.' },
        { text: 'The Crown wrote cutters down as numbers. By the time anyone asked her name, she had stopped saying it.' },
      ],
      choices: [
        { text: "I'll look for her name.", next: 'accept' },
        { text: "I'm sorry.", next: 'sorry' },
      ],
    },
    sorry: { speaker: 'cane_cutter', lines: [{ text: 'So am I, archivist. But sorry never carved a stone.' }] },
    accept: {
      speaker: 'cane_cutter',
      set: { 'side.cane_name.accepted': true },
      lines: [
        { text: 'You would? Then start at the name stones on the Temple island. If she is anywhere, she is there.' },
        nar('(A Name in the Cane is in the Quests page of the menu.)'),
      ],
    },
    remind: {
      speaker: 'cane_cutter',
      lines: [
        { if: { notFlag: 'side.cane_name.stones' }, text: 'Any luck at the name stones, archivist?' },
        {
          if: { all: [{ flag: 'side.cane_name.stones' }, { notFlag: 'clue.cane_name' }] },
          text: 'Not on the stones? Then she is only in the cane now. My mother said Grann loved the flowers by the gate.',
        },
        {
          if: { all: [{ flag: 'clue.cane_name' }, { notFlag: 'side.cane_name.recorded' }] },
          speaker: G,
          text: "I think I know her name. Let me write it down properly first, in Mother Solange's list.",
        },
      ],
    },
    finish: {
      speaker: 'cane_cutter',
      set: { 'side.cane_name.done': true },
      lines: [
        say(G, 'Her name was Rose-Aimée. Her mother named her for the roses by the gate.'),
        { text: 'Rose-Aimée.' },
        { text: '...Rose-Aimée. Tonight I will say it so loud the goddess has to hear it twice.' },
        { text: 'Here. My wife stitched this for the festival. Wear it. It is a better place for it than my pocket.' },
      ],
    },
    thanks: {
      speaker: 'cane_cutter',
      lines: [{ text: "Rose-Aimée. I've said it a hundred times today, archivist. It still sounds new." }],
    },
  }),

  script('road_watcher_talk', {
    start: {
      speaker: 'road_watcher',
      lines: [
        { text: 'Hush. The road is loud enough without us.' },
        { text: 'Your little sister is very quiet, isn\'t she? Quiet people are precious to us.' },
      ],
      choices: [
        { text: 'Stay away from her.', next: 'warn' },
        { text: 'Who are you?', next: 'who' },
      ],
    },
    warn: { speaker: 'road_watcher', lines: [{ text: 'We only ever listen. You should try it.' }] },
    who: { speaker: 'road_watcher', lines: [{ text: 'No one. That is the point of us.' }] },
  }),

  simple('road_sign', [
    { text: 'THE CANE ROAD. East: the old sugar mill and the mangroves. Travel in company. Travel by day.' },
  ]),

  simple('smuggler_crates', [
    { text: 'Crates stamped with the Crown seal, hidden under cane leaves. Muskets, by the weight. Someone is waiting for a buyer.' },
  ]),

  simple('mill_ruin', [
    { text: 'The old sugar mill, burned in the war and never rebuilt. Fresh ashes in the hearth: someone sleeps here.' },
  ]),

  // The first battle (owner decision, Oct 15): a boar out of the cane. The dialogue's last line names
  // the battle; the scene starts it when the dialogue ends (engine/game.ts finishDialogue).
  script('boar_ambush', {
    start: { lines: [], next: [{ if: { flag: 'story.boar_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      lines: [
        nar('The cane rustles. Something heavy is moving through it, fast.'),
        say(A, 'Gigi...'),
        nar('A boar bursts onto the road, bristles up, tusks low, and plants itself between you and the gate.'),
        say(G, 'Stay behind me, Nissa.'),
        say(A, '...I will.', { set: { 'story.boar_seen': true, 'battle.next': 'intro_boar' } }),
      ],
    },
    again: {
      lines: [nar('The boar is back, snorting, blocking the road.'), say(G, 'Again, then. Stay behind me.', { set: { 'battle.next': 'intro_boar' } })],
    },
  }),

  // A Name in the Cane: the Cane Road fifty years ago, and Mother Solange's list in the Archive.
  once('cane_echo_enter', 'story.cane_echo_seen', [
    nar("The road is narrower, and the cane is the Crown's. Overseers' lanterns bob far off between the rows."),
    say(AF, "I've got the door, Gigi."),
  ]),
  script('echo_cane_worker_talk', {
    start: { lines: [], next: [{ if: { flag: 'clue.cane_name' }, to: 'again' }, { to: 'meet' }] },
    meet: {
      speaker: 'echo_cane_worker',
      lines: [
        { text: "Marshal? On the Crown's road? They'll shoot you for it, sir. And me for talking to you." },
        say(P, 'Then talk quickly. What is your name?'),
        { text: 'Nobody asks that here. The overseer calls me Forty-One.' },
        say(P, 'I did not ask what he calls you.'),
        { text: '...Rose-Aimée. My mother named me for the roses by the gate. The only pretty thing on this road.' },
        say(P, 'Rose-Aimée. After tomorrow, nobody on this island will be a number.'),
        nar("(Clue: the cane cutter's grandmother was Rose-Aimée.)", { set: { 'clue.cane_name': true } }),
      ],
    },
    again: {
      speaker: 'echo_cane_worker',
      lines: [{ text: "Rose-Aimée, sir. Don't forget it. Everyone else does." }],
    },
  }),
  script('solange_list', {
    start: {
      lines: [],
      next: [
        { if: { all: [{ flag: 'clue.cane_name' }, { notFlag: 'side.cane_name.recorded' }] }, to: 'record' },
        { if: { flag: 'side.cane_name.recorded' }, to: 'recorded' },
        { to: 'look' },
      ],
    },
    look: {
      lines: [
        nar("Mother Solange's list of names, brought up from the lowest shelf for the festival."),
        nar('Fifty years of hands have added to it. The newest names are in the senior archivist\'s neat print.'),
      ],
    },
    record: {
      set: { 'side.cane_name.recorded': true },
      lines: [
        nar('The list ends with the line the stones carry: "the cutters of the Cane Road, whose names the Crown did not keep."'),
        say(G, 'Then we keep them.'),
        nar('Beneath it, in her best archive hand, Gianna writes: Rose-Aimée, cane cutter, the Cane Road.'),
      ],
    },
    recorded: {
      lines: [nar("Mother Solange's list. The newest line is in Gianna's hand: Rose-Aimée, cane cutter, the Cane Road.")],
    },
  }),
];
