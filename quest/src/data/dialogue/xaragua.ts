// Chapter 2, Xaraguá: Yucayeque before the story arrives (the maps build, Oct 16). Townsfolk lines for the
// living city, and the signs and places that later builds turn into story (the caves, the camp, the
// customs house). The story build adds Cacique Anaco, Governor Thorne, Caona's Echo and the occupation.
//
// Tone (owner brief): serious about the Crown, comic in the townsfolk. Taíno words are used only where the
// design names them and are checked in the phrasebook pass (Nov 18).

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';
import { AREITO_BARS, barText } from '../rhythms.ts';

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
const P = 'patricio';
const AF = 'anissa_far';
const C = 'caona';
const BAR1 = barText(AREITO_BARS[0]!);
const BAR2 = barText(AREITO_BARS[1]!);
const BAR3 = barText(AREITO_BARS[2]!);
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
  // The lamp-oil seller (STORY.md beat 3, Rael clue 6): once Thorne has warned Gianna off, she lends the lamp
  // for the petroglyph cave.
  script('lamp_oil_seller_talk', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'item.oil_lamp' }, to: 'after' },
        { if: { flag: 'story.thorne_met' }, to: 'lamp' },
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
    lamp: {
      set: { 'item.oil_lamp': true },
      lines: [
        say('lamp_oil_seller', 'You came out of the Governor\'s house with your chin up. That is rare. Most come out looking at their feet.'),
        say(A, 'We need a light for the petroglyph cave. A real one.'),
        say('lamp_oil_seller', 'The cave! Nobody has been in there since the water rose. My grandmother said the stones inside could sing.'),
        say('lamp_oil_seller', 'Take this lamp. The oil is the good kind, from the canoe that comes after dark.'),
        say(G, 'Who sends it?'),
        say('lamp_oil_seller', 'Twenty years I have asked that. Someone who wants the Yaguana to see in the dark. Go on.'),
        nar('(Gianna received the oil lamp.)'),
      ],
    },
    after: {
      lines: [
        say('lamp_oil_seller', 'The cave is in the cassava gardens, west of the village, under the rocks. Mind the water.'),
        say('lamp_oil_seller', 'And bring my lamp back. Or do not. Another one will come by canoe.'),
      ],
    },
  }),
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
  // The rhythm lock (SIG-XAR part 3): the whole drum song, tapped on the stones, opens the record house.
  script('batey_stones', {
    start: {
      lines: [],
      next: [
        { if: { flag: 'story.lock_opened' }, to: 'open' },
        { if: { flag: 'clue.drum_full' }, to: 'ready' },
        { if: { flag: 'clue.drum_pattern' }, to: 'partial' },
        { to: 'plain' },
      ],
    },
    plain: { lines: [nar('Standing stones ring the dance ground, carved with faces and spirals worn soft by rain.')] },
    partial: {
      lines: [
        nar('The standing stones. Each one is carved with a drum, and its top is worn smooth by hands.'),
        say(A, 'The cave showed the drum song, Gigi. But the last part was worn away.'),
        say(A, 'We need to hear it played. The whole song, the way they played it on the night of the oath.'),
      ],
    },
    ready: {
      lines: [
        nar('The standing stones. Each is carved with a drum, its top worn smooth by hands that tapped it.'),
        say(A, `The whole song, Gigi: ${BAR1}; ${BAR2}; ${BAR3}.`),
        nar('Tap A (or the screen) at the start of each mark. A long mark lasts two beats, a short one one.'),
      ],
      choices: [
        { text: 'Tap the drum song.', set: { 'rhythm.next': 'record_lock' } },
        { text: 'Tap it slowly.', set: { 'rhythm.next': 'record_lock:slow' } },
        { text: 'Not now.' },
      ],
    },
    open: { lines: [nar('The stones are quiet. The record house door stands open.')] },
  }),
  simple('record_lock_open', [
    nar('The last beat rings out over the dance ground. Something heavy slides and falls inside the record house.'),
    nar('Its door swings open.'),
    say(A, 'You played it, Gigi! The stones remembered!'),
    say(Y, 'Nobody has opened that door since my grandmother died. Go in. Carefully.'),
  ]),
  simple('record_lock_fail', [
    nar('The stones are silent. The door does not move.'),
    say(A, 'Close! Try again. Long marks are two beats, short ones one. Start on each mark, not between them.'),
  ]),
  simple('record_house_closed', [
    nar('The record house door is barred from inside. On the lintel, a carved drum faces the dance ground.'),
    say(A, 'It is locked from the inside, Gigi. How do you lock a door from the inside and then leave?'),
    say(Y, 'You do not. The stones open it. Only the song does.'),
  ]),
  // The record house: the first oath's stone.
  script('oath_stone', {
    start: { lines: [], next: [{ if: { flag: 'story.oath_found' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.oath_found': true, 'clue.first_oath': true },
      lines: [
        nar('A smooth stone on a woven runner. Three marks are cut into its face: a canoe, a sun, and a hand holding a spark.'),
        nar('Under them, in the old signs, the words of the first oath.'),
        say(Y, 'I know these signs. My grandmother taught me on her knee.'),
        say(Y, '"The harbor stays with the people who fish it. We fight for each other, and no paper of any crown will part us."'),
        say(Y, '"Sworn by Caona of the Yaguana, Patricio of Zetwal, Benny of Ardencia."'),
        say(G, 'Three names and one promise. Nothing about the harbor ever going to the Crown.'),
        say(A, 'So the Crown\'s seventh clause is not in the oath. Gigi, this is the proof the elders wanted!'),
        say(Y, 'It is a stone, Anissa. The Crown will say stones lie.'),
        say(G, 'Then we make the elders read it before the Crown can say anything.'),
      ],
    },
    again: { lines: [nar('The first oath: a canoe, a sun, a hand holding a spark. Three names, and no seventh clause.')] },
  }),
  simple('record_baskets', [
    nar('Baskets of knotted cords and carved tallies: harvests, births, canoes built, fifty years of them.'),
    nar('The newest basket is half empty. The last knot was tied the week the Crown\'s ships came.'),
  ]),

  // The areíto of the first oath (the Echo, STORY.md Chapter 2 beat 5): fifty years ago, the same dance
  // ground. The drummers play the whole song, last bar included (information, not an anchor).
  script('areito_echo_enter', {
    start: { lines: [], next: [{ if: { flag: 'story.oath_echo' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.oath_echo': true, 'clue.drum_full': true, 'story.caona_joined': true },
      lines: [
        nar('Night. Torches round the dance ground, and the whole of Yucayeque packed in to watch.'),
        nar('Two drummers face each other across the batey. A young woman with a bow on her back steps into the firelight.'),
        say(C, 'Patricio of Zetwal. Benny of Ardencia. You came across the sea to ask for my scouts.'),
        say('benny', 'And your bows, and your canoes, and your roads. I will not pretend we came for the dancing.'),
        say(C, 'Then you will swear on our stones before you get any of them.'),
        say(P, 'Name the oath.'),
        say(C, 'The harbor stays with the people who fish it. We fight for each other, and no paper of any crown will part us.'),
        say('benny', 'I have read it twice. I will sign it. I do not sign what I have not read.'),
        say(P, 'Sworn. On my name and on Zetwal\'s.'),
        nar(`The drummers begin. ${BAR1}.`),
        nar(`${BAR2}.`),
        nar(`And then the bar the cave wall lost: ${BAR3}.`),
        say(AF, 'Gigi, I can hear it from here! The last part: short, short, long, long!'),
        say(C, 'Every Yaguana child knows that song. Now so do you, Marshal. Do not forget it.'),
        say(C, 'And where you go next, my scouts go. So do I.'),
        nar('(Caona joined the Echo party.)'),
      ],
    },
    again: {
      lines: [
        nar(`The drums go round again: ${BAR1}; ${BAR2}; ${BAR3}.`),
      ],
    },
  }),
  script('areito_echo_return', {
    start: { lines: [], next: [{ if: { notFlag: 'story.areito_returned' }, to: 'first' }] },
    first: {
      set: { 'story.areito_returned': true },
      lines: [
        say(A, 'You were humming it on the way back, Gigi. All three parts.'),
        say(Y, 'Caona. You saw my grandmother. ...Was she as loud as me?'),
        say(G, 'Louder. And the stones by the record house are carved with drums.'),
      ],
    },
  }),
  script('caona_talk', {
    start: { lines: [], next: [{ if: { flag: 'story.caona_joined' }, to: 'joined' }, { to: 'before' }] },
    before: { lines: [say(C, 'Swear first, Marshal. Then we talk about roads.')] },
    joined: { lines: [say(C, 'My scouts are ready. Tell me which road and I will tell you who is waiting on it.')] },
  }),
  simple('benny_talk', [
    say('benny', 'Patricio. Every page of every treaty, I read twice. Remind me of that, if I ever forget.'),
  ]),
  simple('echo_areito_drummer_talk', [say('echo_areito_drummer', `${BAR1}. ${BAR2}. ${BAR3}. Again and again until sunrise.`)]),
  simple('echo_areito_singer_talk', [say('echo_areito_singer', 'We sing the oath tonight so our grandchildren can sing it back to the Crown.')]),

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
  // The cave mouth while there is no lamp (the door into xaragua-cave opens once Gianna has one).
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
        say(Y, 'The lamp-oil seller by the customs house. Everyone in the village buys from her.'),
      ],
    },
  }),

  // The petroglyph cave (SIG-XAR parts 1 and 2).
  simple('cave_enter', [
    nar('The lamp throws long shadows up the rock. Water drips somewhere ahead, slow as a heartbeat.'),
    say(Y, 'My grandmother brought me to the mouth once. She would never go further. She said the cave was "full".'),
    say(A, 'Full of what?'),
    say(Y, 'She never said.'),
  ]),
  script('cave_flood', {
    start: { lines: [], next: [{ if: { flag: 'story.cave_flood_seen' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'story.cave_flood_seen': true },
      lines: [
        nar('The passage ends in black water. The lamp shows a wide chamber beyond, flooded to the walls.'),
        nar('On the far wall, just above the water, carved shapes: drums, and rows of long and short marks.'),
        say(Y, 'Full. Full of water. She meant it.'),
        say(A, 'The water comes from somewhere, Gigi. And it has to go somewhere. Except it can\'t, can it?'),
        say(G, 'Not now. But the air by the rocks back there is shimmering.'),
      ],
    },
    again: { lines: [nar('Black water, wall to wall. The carvings on the far side are out of reach.')] },
  }),
  script('cave_rubble', {
    start: { lines: [], next: [{ if: { flag: 'anchor.cave_sluice' }, to: 'after' }, { to: 'before' }] },
    before: { lines: [nar('Fallen rock fills the channel where the upper gate stood. A landslide, years ago.')] },
    after: { lines: [nar('Fallen rock fills the channel where the upper gate stood. The spring found the other way out.')] },
  }),
  simple('lower_sluice_old', [
    nar('The lower gate stands hauled up and pinned, its wood black with age. The spring runs out under it, down to the gorge.'),
    nar('Someone opened it a long time ago, and nobody ever closed it.'),
  ]),
  script('cave_carvings', {
    start: { lines: [], next: [{ if: { flag: 'clue.drum_pattern' }, to: 'again' }, { to: 'first' }] },
    first: {
      set: { 'clue.drum_pattern': true },
      lines: [
        nar('The carved wall. A ring of standing stones, each with a drum on it, and a door in the middle of the ring.'),
        nar(`Under it, rows of long and short marks. The first bar: ${BAR1}.`),
        nar(`The second bar: ${BAR2}.`),
        nar('The third bar is worn away. Water has polished the rock smooth.'),
        say(Y, 'That is the areíto plaza. The stones round the dance ground, and the record house.'),
        say(A, 'So the song opens the door. But we only have two thirds of a song, Gigi.'),
        say(G, 'Then we need to hear someone play it. Someone from fifty years ago.'),
        nar('(The Journal notes the drum song.)'),
      ],
    },
    again: { lines: [nar(`The drum song on the wall: ${BAR1}; ${BAR2}; and a bar worn smooth.`)] },
  }),

  // The cave fifty years ago: dry, both gates working.
  script('cave_echo_enter', {
    start: { lines: [], next: [{ if: { notFlag: 'story.cave_echo_seen' }, to: 'first' }] },
    first: {
      set: { 'story.cave_echo_seen': true },
      lines: [
        nar('Torchlight. The chamber is dry, its floor swept. Water from the spring runs off along two channels in the rock.'),
        say(AF, 'Gigi? I\'m at the door. I can\'t see the water any more!'),
      ],
    },
  }),
  script('cave_echo_return', {
    start: {
      lines: [],
      next: [{ if: { all: [{ flag: 'anchor.cave_sluice' }, { notFlag: 'story.cave_drained_seen' }] }, to: 'carried' }],
    },
    carried: {
      set: { 'story.cave_drained_seen': true },
      lines: [
        nar('The present settles around you. The lamp shows the chamber...'),
        nar('...dry. A ridged rock floor where the black water stood, and a channel running away under the open lower gate.'),
        say(A, 'Gigi! The water\'s gone! It went down the other way!'),
        say(Y, 'Fifty years of it. My grandmother would have wanted to see this.'),
      ],
    },
  }),
  script('echo_spring_keeper_talk', {
    start: { lines: [], next: [{ if: { flag: 'anchor.cave_sluice' }, to: 'after' }, { to: 'before' }] },
    before: {
      speaker: 'echo_spring_keeper',
      lines: [
        { text: 'Marshal. The spring rises here and goes out two ways.' },
        { text: 'The upper gate, east, lets it out to the sea. We never shut that one.' },
        { text: 'The lower gate, west, sends it down to the gorge and the river. We shut it in the dry season, to keep the water for the gardens.' },
        { text: 'If the upper channel ever fell in, this whole chamber would fill to the roof. But rock does not fall. Not in my lifetime.' },
      ],
    },
    after: {
      speaker: 'echo_spring_keeper',
      lines: [
        { text: 'You opened the low gate? In the dry season? The gardens will be thirsty.' },
        { text: '...But if the Marshal says it stays open, I will pin it open. Both ways out, then.' },
      ],
    },
  }),
  simple('upper_sluice', [
    nar('The upper gate, hauled up and tied. The spring runs out under it along a channel to the sea.'),
    nar('The rock above the channel is cracked. It would not take much to bring it down.'),
  ]),
  script('lower_sluice', {
    start: { lines: [], next: [{ if: { flag: 'anchor.cave_sluice' }, to: 'open' }, { to: 'shut' }] },
    shut: {
      lines: [nar('The lower gate, shut for the dry season. Planks of mahogany across the channel to the gorge, held by a wooden bar.')],
      choices: [
        { text: 'Lift the bar and haul the gate open.', next: 'opened', set: { 'anchor.cave_sluice': true } },
        { text: 'Leave it shut.' },
      ],
    },
    opened: {
      lines: [
        nar('The bar comes free. The gate grinds up its grooves and you pin it high. Water runs down the second channel.'),
        say(P, 'Two ways out. If one falls in, the water still has somewhere to go.'),
        nar('(Anchor: this change will last into the present.)'),
      ],
    },
    open: { lines: [nar('The lower gate, pinned open. Water runs down both channels.')] },
  }),
  simple('cave_chalk', [
    nar('Smooth rock, chalked in outline: a ring of stones, a door, rows of long and short marks.'),
    nar('Nothing is cut yet. The carvers will cut it after the oath is sworn.'),
  ]),

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
