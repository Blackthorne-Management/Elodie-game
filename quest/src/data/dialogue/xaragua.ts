// Chapter 2, Xaraguá: Yucayeque before the story arrives (the maps build, Oct 16). Townsfolk lines for the
// living city, and the signs and places that later builds turn into story (the caves, the camp, the
// customs house). The story build adds Cacique Anaco, Governor Thorne, Caona's Echo and the occupation.
//
// Tone (owner brief): serious about the Crown, comic in the townsfolk. Taíno words are used only where the
// design names them and are checked in the phrasebook pass (Nov 18).

import type { DialogueLine, DialogueNode, DialogueScript } from '../../engine/dialogue.ts';

function say(speaker: string, text: string): DialogueLine {
  return { speaker, text };
}

function nar(text: string): DialogueLine {
  return { speaker: '', text };
}

function simple(id: string, lines: DialogueLine[], set?: DialogueNode['set']): DialogueScript {
  return { id, start: 'start', nodes: { start: { lines, set } } };
}

export const XARAGUA_DIALOGUE: readonly DialogueScript[] = [
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
  simple('gaze_pilgrim_talk', [
    say('gaze_pilgrim', 'I walked from Zetwal to see where the first oath was sworn. The Gaze remembers it. So do the drums.'),
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
    say('casabe_baker', 'Cassava bread, crisp from the griddle. It keeps for a month at sea. The marines eat it and pretend not to.'),
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
  simple('petroglyph_cave_mouth', [
    nar('The petroglyph cave. Carved faces watch from the rock around the mouth.'),
    nar('Inside, black water stands to the knee. You would need a light, and a reason.'),
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
