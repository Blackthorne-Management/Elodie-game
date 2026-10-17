// Chapter 2, Xaraguá: Yucayeque before the story arrives (the maps build, Oct 16). Townsfolk lines for the
// living city, and the signs and places that later builds turn into story (the caves, the camp, the
// customs house). The story build adds Cacique Anaco, Governor Thorne, Caona's Echo and the occupation.
//
// Tone (owner brief): serious about the Crown, comic in the townsfolk. Taíno words are used only where the
// design names them and are checked in the phrasebook pass (Nov 18).

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';

function say(speaker: string, text: string, translation?: string): DialogueLine {
  return translation ? { speaker, text, translation } : { speaker, text };
}

function nar(text: string): DialogueLine {
  return { speaker: '', text };
}

function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return { id, start: 'start', nodes: { start: { lines, set } } };
}

function script(id: string, nodes: Record<string, DialogueNode>): DialogueScript {
  return { id, start: 'start', nodes };
}

const G = 'gianna';
const A = 'anissa';
const Y = 'yari';
const PIER_WON = 'encounter.xaragua_story.pier.won';

export const XARAGUA_DIALOGUE: readonly DialogueScript[] = [
  // ---- Chapter 2, The Charter: the story (first half, Oct 16) -------------------------------------
  // The ferry lands: marines are shaking down the fishers at the end of the pier. They start the fight
  // (owner report, Oct 17: the reason to fight must be clear), and the aftermath plays at once (battle.after).
  simple('xaragua_arrival', [
    nar('The ferry coach bumps against the pier at dawn. Green mountains, a bay the color of sea glass, and Crown warships at anchor.'),
    say(Y, 'Yucayeque. Home.'),
    say(Y, 'And them. There were two ships when I left. Now there are three.'),
    say(A, 'Gigi. Look, on the pier.'),
    nar("At the end of the pier, a Crown sergeant weighs a fisher's catch on a hand scale. His marines load the baskets into a boat."),
    say('marine_sergeant', 'Harbor fee. Half the catch, by order of the Governor.'),
    say('canoe_fisher', 'Half? Yesterday it was a fifth! I have six children!'),
    nar('The sergeant shoves the old man. He stumbles back to the very edge of the pier.'),
    say(Y, 'Put your hands on him again, sergeant. I dare you.'),
    say('marine_sergeant', 'The cacique\'s girl. Back from Zetwal with friends.'),
    say('marine_sergeant', 'Marines! Fix bayonets. Teach the natives what the Charter protects.'),
    say(A, 'Gigi, they are coming at Yari!'),
    { speaker: G, text: 'Anissa, behind me. Yari, with me!', set: { 'battle.next': 'pier_marines', 'battle.after': 'pier_after' } },
  ]),
  // Talking to the sergeant again (after a lost fight, or a reload in the middle of it).
  script('marine_sergeant_talk', {
    start: { lines: [], next: [{ if: { flag: PIER_WON }, to: 'gone' }, { to: 'again' }] },
    again: {
      lines: [
        say('marine_sergeant', 'Back for another lesson, girl? Marines!'),
        { speaker: Y, text: 'Not this time.', set: { 'battle.next': 'pier_marines', 'battle.after': 'pier_after' } },
      ],
    },
    gone: { lines: [say('marine_sergeant', 'The Governor will hear about this.')] },
  }),
  // Straight after the fight: the marines flee, and the fisher they were robbing speaks.
  simple('pier_after', [
    say('marine_sergeant', 'Fall back! Back to the boat!'),
    nar('The marines scramble down the ladder into their boat and row hard for the warship, leaving the baskets behind.'),
    say('marine_sergeant', 'You\'ve raised a hand to the Crown, girl! The Governor will hear of this, every word!'),
    say(Y, 'Tell him slowly. He reads every form twice.'),
    nar('Along the beach, people come out of their houses to watch the boat go. The old fisher gathers his baskets.'),
    say('canoe_fisher', 'Guatiao, Yari. And your friends. That is the first time anyone has made them put anything back.', 'Friend, Yari.'),
    say(Y, 'Where is my father? Why did nobody stop them?'),
    say('canoe_fisher', 'The cacique is sick, Yari. Very sick. The elders meet without him tonight, about the Crown\'s paper.'),
    say(Y, '...Gianna, I have to go to him. The caney is at the top of the plaza, up the road.'),
    { speaker: A, text: "We'll come with you.", set: { 'story.pier_thanks': true } },
  ]),
  // Into the caney.
  simple('caney_enter', [
    nar('The caney smells of cedar smoke. Elders talk in low voices; a Crown officer in red sits among them, writing.'),
    say(Y, 'That one is new. And he is in my father\'s house.'),
    say(A, 'The healer is waiting by the room on the right, Gigi.'),
  ]),
  // Cacique Anaco, ailing.
  script('anaco_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.council_defied' }, to: 'after' }, { if: { flag: 'story.anaco_met' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.anaco_met': true },
      lines: [
        nar('The cacique sits propped on cushions beside his bed. His hands shake, but his eyes are sharp.'),
        say('anaco', 'Yari. You went to Zetwal for help, and you came back with a girl with a staff, and a smaller girl who glows.'),
        say(Y, 'Gianna Limyè, Father. The envoy\'s daughter. And her sister, Anissa.'),
        say('anaco', 'Limyè. Patricio\'s blood. Your grandfather swore an oath on our stones, child. Did he tell you?'),
        say(G, 'He told me about Caona and her scouts. Not about an oath.'),
        say('anaco', 'He would not. He was always modest about the wrong things.'),
        say('anaco', 'Tonight Thorne\'s man reads the Charter to the elders. They will count his ships instead of our promises.'),
        say('anaco', 'I wrote to the Throne. No answer came. If they vote yes, the harbor is the Crown\'s by morning.'),
        say(Y, 'Then I will be there.'),
        say('anaco', 'Be there. Be quiet, if you can. You cannot. Go.'),
      ],
    },
    again: { lines: [say('anaco', 'The council circle is across the hall, on the west side. Go, before they vote without you.')] },
    after: { lines: [say('anaco', 'You shouted at the whole council. Your grandmother would have laughed. Then she would have hidden you.')] },
  }),
  // The elders' council: the Charter, the seventh clause, and Yari.
  simple('xaragua_council', [
    nar("The elders sit in a circle. The Governor's liaison stands in the middle, holding a paper with a red seal."),
    say('crown_liaison', 'Honored elders. The Charter offers the protection of His Majesty\'s fleet, forever. In return, a small matter: the harbor.'),
    say('elder_charter', 'We cannot fight three warships with canoes. I say we sign, and live.'),
    say('elder_resist', 'We swore on the stones: "The harbor stays with the people who fish it." I will not unswear it.'),
    say('elder_undecided', 'And the cacique cannot vote, so it falls to us. Two more voices and the Charter passes.'),
    { speaker: 'crown_liaison', text: 'The Charter is lawful, elders. It rests on the seventh clause of the Accord, as signed.', set: { 'clue.seventh_clause': true } },
    say(Y, 'Then show us the seventh clause.'),
    say('crown_liaison', '...The Governor holds the original.'),
    say(Y, 'My grandmother lay in the ferns for a year counting Crown boots, so this harbor would stay ours.'),
    say(Y, 'And you would sign it away for a clause nobody here has read?'),
    say('elder_charter', 'Yari! You do not sit on this council.'),
    say(Y, 'No. I stand on the pier, where his marines take half the catch. Ask the fishers how the protection feels.'),
    say(G, 'Elders, my grandfather swore that first oath with Caona. Zetwal remembers it. Please, wait before you vote.'),
    say('elder_undecided', "Patricio's granddaughter asks us to wait. The cacique's daughter shouts at us. That is two voices."),
    say('elder_undecided', 'The vote waits. Bring us proof that the Crown\'s clause is real, or proof that it is not.'),
    say('crown_liaison', 'The Governor will hear of this.'),
    nar('The liaison rolls up the Charter and leaves. Down at the harbor, a glint: someone in the customs house is watching.'),
    { speaker: A, text: 'Gigi, the songs said the first oath was carved in a cave. Where the water rises.', set: { 'story.council_defied': true } },
  ]),
  // Governor Thorne.
  script('thorne_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.thorne_met' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.thorne_met': true, 'clue.seventh_clause': true },
      lines: [
        nar('The Governor stands at the window with a spyglass. He takes his time turning around.'),
        say('thorne', 'Miss Limyè. The envoy\'s daughter, making a scene at a native council. Your mother would be so proud.'),
        say(G, 'You know my mother?'),
        say('thorne', 'Everyone at the Throne knows your mother. A charming woman. She signs what is put in front of her, for the sake of peace.'),
        say(G, 'That is not true.'),
        say('thorne', 'Then ask her about the seventh clause. Oh, but you cannot. She is very far away.'),
        say('thorne', 'Let me be plain. You walk here under the Accord\'s protection. An envoy\'s family may go where it likes.'),
        say('thorne', 'The cacique\'s daughter is not an envoy. Neither is the little one who glows. Do keep them out of trouble.'),
        say(A, '...'),
        say('thorne', 'Good day, Miss Limyè. Mind the step on your way out. The Crown built it, so it is level.'),
      ],
    },
    again: { lines: [say('thorne', 'Still here, Miss Limyè? The ferry leaves every morning. I can have a cabin made ready.')] },
  }),

  // The Harbor Village (the hub).
  simple('canoe_fisher_talk', [
    say('canoe_fisher', 'Three Crown ships in our harbor, and they still buy our fish. They pay in paper. Paper does not swim.'),
  ]),
  simple('weaver_talk', [
    say('weaver', 'This hammock took me a month. A marine offered me a Crown penny for it. I offered him the sea.'),
  ]),
  simple('fisher_boy_talk', [
    say('fisher_boy', 'You came on the ferry? From Zetwal? Is it true your houses have corners?'),
    say('fisher_boy', 'Corners are where the spirits get stuck. Everybody knows that.'),
  ]),
  simple('crown_marine_talk', [
    say('crown_marine', 'Move along, miss. The harbor is under the Crown\'s protection.'),
    say('crown_marine', 'Protection from what? Not my place to say. Move along.'),
  ]),
  simple('crown_marine_2_talk', [
    say('crown_marine', 'Six weeks on this island and I still can\'t find the end of the forest. Or the beginning.'),
  ]),
  simple('lamp_oil_seller_talk', [
    say('lamp_oil_seller', 'Guatiao!', 'Friend!'),
    say('lamp_oil_seller', 'Lamp oil for the long nights. It comes by canoe, after dark, from someone I have never met.'),
    say('lamp_oil_seller', 'Every jar paid for in advance. I stopped asking who. The jars stopped asking me.'),
  ]),
  simple('xaragua_customs_sign', [
    nar('CUSTOMS OF HIS MAJESTY\'S CROWN. ALL CATCH TO BE DECLARED. ALL DECLARATIONS TO BE TAXED.'),
    nar('Someone has carved a small fish underneath. It is laughing.'),
  ]),
  simple('pier_sign', [nar('Ferry coach to Pòdlimyè: when the sea allows. Canoes: when the canoe allows.')]),

  // The Areíto Plaza and the Caney terrace.
  simple('areito_drummer_talk', [
    say('areito_drummer', 'The drum keeps the count. The singers keep the words. Together we keep everything.'),
  ]),
  simple('dancer_talk', [
    say('dancer', 'The areíto is not a show. It is how we remember. Each step is a name.'),
  ]),
  simple('plaza_elder_talk', [
    say('plaza_elder', 'Fifty years ago, three young fools swore an oath on these stones. One of them was Yaguana.'),
    say('plaza_elder', 'The other two were yours, I think. Zetwal always sends fools in pairs.'),
  ]),
  simple('batey_stones', [
    nar('Standing stones ring the dance ground, carved with faces and spirals worn soft by rain.'),
  ]),

  // The Canoe Beach and its market.
  simple('salt_seller_talk', [
    say('salt_seller', 'Salt from the pans, dried in our sun. The Crown wants a tax on it. On the sun, I suppose.'),
  ]),
  simple('casabe_baker_talk', [
    say('casabe_baker', 'Guatiao!', 'Friend!'),
    say('casabe_baker', 'Cassava bread, crisp from the griddle. It keeps for a month at sea. The marines eat it and pretend not to.'),
  ]),
  simple('carver_talk', [
    say('carver', 'Guatiao.', 'Friend.'),
    say('carver', 'Shell beads for quick feet, carved charms for a careful back. I carve what the wood already wants to be.'),
  ]),
  simple('bow_maker_talk', [
    say('bow_maker', 'Guatiao!', 'Friend!'),
    say('bow_maker', 'Ironwood bows and cotton armor. Yari bought her first bow here. She broke it in a week. Proudest week of my life.'),
  ]),
  simple('canoe_maker_talk', [
    say('canoe_maker', 'One tree, one canoe, one year. The Crown builds a ship in a month. It sinks in a storm. Mine do not.'),
  ]),
  simple('shell_diver_talk', [
    say('shell_diver', 'The sea cave past the rocks? Only at low tide. At high tide the sea keeps what it finds.'),
  ]),
  simple('sea_cave_mouth', [
    nar('A dark mouth in the cliff, half full of sea. The water breathes in and out of it.'),
    nar('Not at this tide.'),
  ]),

  // The cassava gardens (conuco) on the hill.
  simple('cassava_farmer_talk', [
    say('cassava_farmer', 'Cassava mounds, row on row. Plant the stick, wait a year, feed a village. Simple, if nobody steals it.'),
  ]),
  simple('cassava_farmer_2_talk', [
    say('cassava_farmer', 'The path up the mountain goes to the hill camp. Nobody lives there. Nobody you have heard of.'),
  ]),
  simple('conuco_kid_talk', [
    say('conuco_kid', 'I found a hutia in the cassava. It took my bead and ran. Hutias think shiny things are stars.'),
  ]),
  script('petroglyph_cave_mouth', {
    start: { lines: [], next: [{ if: { flag: 'story.council_defied' }, to: 'oath' }, { to: 'closed' }] },
    closed: {
      lines: [
        nar('The petroglyph cave. Carved faces watch from the rock around the mouth.'),
        nar('Inside, black water stands to the knee. You would need a light, and a reason.'),
      ],
    },
    oath: {
      lines: [
        nar('The petroglyph cave. Somewhere inside, the first oath was carved where the water rises.'),
        say(A, 'It is so dark in there, Gigi. We need a lamp, a real one.'),
      ],
    },
  }),

  // The Mountain Path and the hill camp.
  simple('hill_runner_talk', [
    say('hill_runner', 'Messages go up the mountain on feet and come down on feet. The Crown has horses. Horses hate this path.'),
  ]),
  simple('mountain_sign', [nar('Up: the hill camp. Down: the cassava gardens. Sideways: a long fall.')]),
  simple('camp_leader_talk', [
    say('camp_leader', 'You are the envoy\'s daughter. Good. You never saw this camp. Neither did I.'),
  ]),
  simple('camp_scout_talk', [
    say('camp_scout', 'We count the Crown\'s ships from up here. Some days there are more. Never fewer.'),
  ]),
  simple('ash_thumbprint', [
    nar('On the post by the fire, a grey thumbprint pressed in ash. Someone left it here on purpose.'),
  ]),

  // The Caney of Anaco (the seat of government).
  simple('caney_guard_talk', [
    say('caney_guard', 'The cacique\'s house is open to his people. And to his guests, if they wipe the sand off.'),
  ]),
  simple('caney_guard_2_talk', [
    say('caney_guard', 'He is the one who talks. I am the one who watches the marines watching us.'),
  ]),
  simple('elder_charter_talk', [
    say('elder_charter', 'The Crown offers protection, trade, a seat at their table. Is peace so terrible a price?'),
  ]),
  simple('elder_resist_talk', [
    say('elder_resist', 'A seat at their table. Under it, more likely. We swore an oath once. I have not unsworn it.'),
  ]),
  simple('elder_undecided_talk', [
    say('elder_undecided', 'One says yes, one says no, and they both look at me. I have been looking at the ceiling.'),
  ]),
  simple('behique_talk', [
    say('behique', 'The cacique sleeps. His fever comes and goes like the tide. Speak softly near his room.'),
  ]),
  simple('crown_liaison_talk', [
    say('crown_liaison', 'Governor Thorne sends his regards to the cacique. Daily. In writing. With a copy for the file.'),
  ]),
  simple('head_runner_talk', [
    say('head_runner', 'Conch from the point, runner to the bay, canoe to the next village. Word travels faster than marines.'),
  ]),
  simple('duho_seat', [nar('The duho: the cacique\'s carved seat, low and dark, polished by three generations.')]),

  // The Song House (the library).
  simple('song_keeper_talk', [
    say('song_keeper', 'We keep our history in songs. The scribes keep it on paper. The songs are older and argue less.'),
  ]),
  simple('song_apprentice_talk', [
    say('song_apprentice', 'I know four hundred verses. The keeper says that is the first song. Of nine.'),
  ]),

  // The Crown Customs House.
  simple('crown_clerk_talk', [
    say('crown_clerk', 'Name, cargo, purpose of visit. The Governor reads every form. Personally. Twice.'),
  ]),
  simple('customs_marine_talk', [
    say('crown_marine', 'The Governor is out. If he were in, I would say he is out.'),
  ]),
];
