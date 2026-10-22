// Street debates by city (guide 7.2; engine/debate.ts runs them). Pòdlimyè's corner, on the lawn below the
// Festival Plaza: a Gaze keeper against a Quiet Crown recruiter, "Is a goddess who only remembers any use?"
// It opens with the rest of the city, after the war room memory (owner decision, Oct 16). Each round has a
// strong answer (wins it), a fair one (splits the crowd) and a weak one; Reason needs a lore book read.

import type { DebateDef } from '../engine/debate.ts';
import type { DialogueLine } from '../engine/dialogue.ts';
import { loreFlag } from './books.ts';

const K = 'gaze_keeper';
const Q = 'recruiter_a';
const G = 'gianna';
const A = 'anissa';
const R = 'roots_elder';
const P = 'gaze_pilgrim';
const say = (speaker: string, text: string): DialogueLine => ({ speaker, text });
const nar = (text: string): DialogueLine => ({ speaker: '', text });

export const DEBATES: readonly DebateDef[] = [
  {
    id: 'zetwal_corner',
    city: 'zetwal',
    question: 'Is a goddess who only remembers any use?',
    ally: K,
    opponent: Q,
    opensIf: { flag: 'story.warroom_echo' },
    passing: [
      say(Q, '...a goddess who only remembers! Remembering never fed anyone.'),
      say(K, 'And forgetting never freed anyone.'),
      nar('(They are deep in an argument. A small crowd is listening.)'),
    ],
    listen: [
      say(Q, 'Friends! The Crown took this island once, and where was Elodie? Watching. Remembering.'),
      say(K, 'She does not rule us. She remembers, so that no ruler can lie about what was done.'),
      say(Q, 'Memories are heavy. The Quiet Crown asks only that you set them down. One voice. Peace.'),
      say(K, 'One voice is how they counted us as property. A thousand voices is how we became people.'),
      say(A, 'Gigi... he sounds so kind. Why does he make my stomach hurt?'),
    ],
    reasonNeeds: [loreFlag('zetwal_say_their_names'), loreFlag('zetwal_gaze_primer'), loreFlag('zetwal_quiet_tract')],
    rounds: [
      {
        claim: 'Your goddess watched the Crown ships come and did nothing. What use is a god who only watches?',
        answers: {
          scripture: { short: 'She sees; no one can lie', text: 'She is the Gaze, not the hand. She sees, so no ruler can pretend. The hands were ours.', strength: 2 },
          reason: { short: 'She gave us the keeping', text: 'The temple books say she wove the realm, then gave it to us to keep. Keeping it is our part.', strength: 1 },
          compassion: { short: 'Maybe she grieved too', text: 'Maybe she grieved too. Being sad with us is still something.', strength: 0 },
        },
      },
      {
        claim: 'Remembering keeps old wounds open. Forget them, be quiet, and the hurting stops.',
        answers: {
          scripture: { short: 'The dead are owed names', text: 'The keepers teach that the dead are owed their names. Every one of them.', strength: 1 },
          reason: { short: 'Names undo being counted', text: 'The Crown wrote us down as property. Saying the names is how we stopped being counted.', strength: 2 },
          compassion: { short: 'Quiet hides the hurting', text: "Quiet doesn't heal anyone. It just hides who is still hurting.", strength: 1 },
        },
      },
      {
        claim: 'You are lonely, envoy\'s daughter. Your mother is gone again. We would never leave you.',
        answers: {
          scripture: { short: 'The Gaze sees me', text: 'The Gaze sees me even when my mother cannot.', strength: 1 },
          reason: { short: 'Your bread makes debts', text: 'Your own tract says your bread makes the hungry owe you. That is not a family. It is a debt.', strength: 1 },
          compassion: { short: 'I am not alone. Nor you', text: 'I have a sister, a grandmother, and a city that says our names aloud. Anyone lonely can stand with us.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(The crowd murmurs and nods. They are with Gianna.)',
      1: '(The crowd is split. Some nod; some look at the hooded man.)',
      0: '(A few people drift toward the hooded man.)',
    },
    won: [
      say(Q, '...The crowd has chosen its noise. Today.'),
      nar('The recruiter pulls up his hood and slips away into the festival.'),
      say(K, 'Well spoken, child. Your grandfather argued like that.'),
    ],
    lost: [
      say(Q, 'You see? Even the envoy\'s daughter has no answer. Come and find the quiet, friends.'),
      say(K, 'Do not let him have the last word, child. Come back when you are ready.'),
    ],
    mediate: [
      say(G, 'You both want the same thing: nobody hungry, nobody alone. Why not do it together?'),
      say(G, "Keeper, the temple kitchen feeds people. Share it, and no one will need to owe him a thing."),
      say(K, '...The kitchen is open to anyone. Hood or no hood.'),
      say(Q, 'Bread with no price? That is... not how the Quiet works.'),
      nar('The crowd laughs, kindly. Even the recruiter almost smiles before he walks away.'),
      say(K, 'You did not win. You did better. The Gaze will remember this.'),
    ],
    provoke: [
      say(G, 'Thieves of voices! Hoods and debts and lies!'),
      nar('The crowd jeers. Someone throws a mango peel. The recruiter backs away.'),
      say(K, 'That is not how the Gaze wins, child. Now he has a story to tell about us.'),
    ],
    after: [
      say(K, 'The hooded ones have gone quiet on this corner. For now.'),
      say(K, 'Remembering is slow work, child. But it is ours.'),
    ],
  },
  // Yucayeque's corner, by the village fire (Chapter 2; CAPITALS.md 2, a proposal until the owner signs it
  // off): an elder of the Roots and Tides against a Gaze pilgrim who reads the Accord like a deed. Gianna
  // is Gaze herself, so here she argues with her own faith's pilgrim. Open from the start (the living city).
  {
    id: 'xaragua_springs',
    city: 'xaragua',
    question: 'Is the land owned or remembered?',
    ally: R,
    opponent: P,
    passing: [
      say(P, '...and the Accord is law, elder. Law says who owns what.'),
      say(R, 'Law says who signed what. The land was here before the ink.'),
    ],
    listen: [
      say(P, 'I walked from Zetwal to honor the Gaze, and the Gaze remembers every promise. Even the ones we dislike.'),
      say(R, 'Then let it remember the first one. "The harbor stays with the people who fish it." Sworn on those stones.'),
      say(P, 'Sworn, yes. But the Accord was signed. A signed paper outweighs a song.'),
      say(R, 'In Zetwal, perhaps. Here the song is older than the paper, and so is the harbor.'),
      say(A, 'Gigi, he believes in Elodie like we do. So why does he sound like the Governor?'),
    ],
    reasonNeeds: [loreFlag('xaragua_first_oath'), loreFlag('xaragua_charter'), loreFlag('xaragua_roots_tides')],
    rounds: [
      {
        claim: 'The Gaze remembers every promise. If the Accord was signed, the harbor was promised away. Memory cannot pick and choose.',
        answers: {
          scripture: { short: 'She remembers deeds', text: 'The Gaze remembers what was done, not what was written after. What was done was an oath on these stones.', strength: 1 },
          reason: { short: 'The oath came first', text: 'The first oath was sworn before the Accord was written, and the Charter leans on a clause no one here remembers.', strength: 2 },
          compassion: { short: "Can't you both be right?", text: 'Maybe you are both right, a little? Could the harbor be half promised?', strength: 0 },
        },
      },
      {
        claim: 'Land must belong to someone, or anyone may take it. The Crown\'s deed at least says who.',
        answers: {
          scripture: { short: 'It was lent, not given', text: 'The temple books say Elodie wove the realm and gave it to us to keep. Kept, pilgrim. Not owned.', strength: 2 },
          reason: { short: 'A deed needs a seller', text: 'A deed needs someone who sold. Nobody in Yucayeque sold the harbor. Ask the receipts.', strength: 1 },
          compassion: { short: 'Ask who fishes it', text: 'Ask the people who fish it every morning who it belongs to. They will not say the Crown.', strength: 1 },
        },
      },
      {
        claim: 'You are from Zetwal, envoy\'s daughter. What does Zetwal know about Xaraguá\'s harbor?',
        answers: {
          scripture: { short: 'The Gaze sees us all', text: 'The Gaze does not stop at the strait. If it sees Zetwal, it sees Xaraguá.', strength: 1 },
          reason: { short: 'Caona fought for us too', text: "Caona's scouts won our war for us. If Zetwal forgets that, the Gaze should close its eye.", strength: 1 },
          compassion: { short: 'Nothing. So I listen', text: 'Nothing yet. That is why I am listening to the people who fish it, and not to the paper.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(The fishers nod and murmur. The elder smiles into the fire.)',
      1: '(The crowd is split. Some look at the pilgrim\'s robe, some at the harbor.)',
      0: '(A few people shrug and go back to their nets.)',
    },
    won: [
      say(P, '...I came to honor a memory. Perhaps I was reading the wrong one.'),
      say(R, 'Sit by the fire, pilgrim. The drums will teach you the rest.'),
    ],
    lost: [
      say(P, 'You see? Even a daughter of Zetwal has no answer. The paper stands.'),
      say(R, 'Come back when the fire is lower, child. Arguments cool, and so do pilgrims.'),
    ],
    mediate: [
      say(G, 'You both want the promise kept. You just keep it in different places.'),
      say(G, 'Pilgrim, write the first oath down as the Gaze would. Elder, sing it for him so he gets every word.'),
      say(R, 'A pilgrim with a pen. Our songs have survived worse.'),
      say(P, 'I would be honored. And then I will read it to the Governor, slowly.'),
    ],
    provoke: [
      say(G, 'You sound like a Crown clerk in a pilgrim\'s robe!'),
      nar('The pilgrim flinches. A few fishers laugh, but the elder does not.'),
      say(R, 'We do not shame guests at this fire, child. Not even wrong ones.'),
    ],
    after: [
      say(P, 'The elder is teaching me the first oath. It has more verses than the Accord.'),
      say(R, 'And better ones.'),
    ],
  },
  // Cenizal's Lower Town (Chapter 3; outline 7.3), by the soup line: a baker's widow of the Gaze against a Witness
  // oath-knight (the soldiers' faith: an oath, and what breaking one costs). Required before noon. Reason needs one
  // of La Biblioteca Vieja's books on oaths, the iron trade or the kitchen gossip.
  {
    id: 'ardencia_bread',
    city: 'ardencia',
    question: 'Is a thief who feeds the hungry a thief?',
    ally: 'baker_widow',
    opponent: 'oath_knight',
    passing: [
      say('oath_knight', '...and a stolen loaf is a stolen loaf, widow. The oath has no clause for soup.'),
      say('baker_widow', 'Then the oath was written by men who never went hungry.'),
    ],
    listen: [
      say('oath_knight', 'Someone is stealing the Lord\'s iron, a cart a month, and feeding this street with it. Everyone knows.'),
      say('baker_widow', 'Everyone eats. That is what everyone knows.'),
      say('oath_knight', 'Every soldier here swore on the iron not to steal from the house. A thief who feeds you is still a thief.'),
      say('baker_widow', 'My husband swore that oath. He died at Cendre. Nobody fed me until the bread came.'),
      say(A, 'Gigi, they are both a little bit right. Is that allowed?'),
    ],
    reasonNeeds: [loreFlag('ardencia_oaths'), loreFlag('ardencia_iron_trade'), loreFlag('ardencia_kitchen_maids')],
    rounds: [
      {
        claim: 'A thief is a thief. The oath against stealing has no clause for soup.',
        answers: {
          scripture: { short: 'The Gaze remembers both', text: 'The Gaze remembers who was fed and who took, and judges both. Not one without the other.', strength: 1 },
          reason: { short: 'The oath binds the swearer', text: 'Your own Witnesses teach it: an oath binds the one who swore it. The hungry swore nothing.', strength: 2 },
          compassion: { short: 'Ask the child in line', text: 'Ask the child at the front of the line whether she is eating stolen soup.', strength: 0 },
        },
      },
      {
        claim: 'If the Lord\'s iron feeds them, then the Lord is the thief, or the fool who is robbed.',
        answers: {
          scripture: { short: 'Elodie lent the realm', text: 'The temple says the goddess lent the realm to all of us to keep. Iron included.', strength: 1 },
          reason: { short: 'The shortfall is steady', text: 'One cart a month, never more, for three years. A thief who is never caught is a thief who is allowed.', strength: 2 },
          compassion: { short: 'Nobody here is fooled', text: 'Nobody on this street thinks the Lord is a fool. They think someone cares.', strength: 1 },
        },
      },
      {
        claim: 'Then tell me, envoy: what do you owe a lord who feeds you with stolen bread?',
        answers: {
          scripture: { short: 'Thanks, and the truth', text: 'Thanks, and the truth. The Gaze asks no more than that of anyone.', strength: 1 },
          reason: { short: 'Nothing he did not pay', text: 'Nothing. If the bread is his, it is a gift. If it is stolen, it was never his to sell.', strength: 1 },
          compassion: { short: 'To feed the next one', text: 'You owe the next hungry child a bowl, when you can. That is how a street pays its debts.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(The soup line murmurs. Someone claps. The widow wipes her eyes.)',
      1: '(The street is split. Half look at the knight, half at the pot.)',
      0: '(A few people shrug and go back to their bowls.)',
    },
    won: [
      say('oath_knight', '...The oath binds the swearer. I taught that to recruits for twenty years. I had forgotten.'),
      say('baker_widow', 'Eat with us, knight. The pot does not ask who you are.'),
    ],
    lost: [
      say('oath_knight', 'A thief is a thief, envoy. Come back when you can tell me otherwise.'),
      say('baker_widow', 'Do not mind him, child. He argues with the soup, too.'),
    ],
    mediate: [
      say(G, 'You both want the same thing: nobody in this street hungry, and nobody shamed for it.'),
      say(G, 'Knight, stand the soup line with the cook, and count the bowls. Widow, tell him every name.'),
      say('oath_knight', 'A Witness counting bowls. My sergeant would laugh.'),
      say('baker_widow', 'Then let him laugh with a full mouth.'),
    ],
    provoke: [
      say(G, 'You swore oaths to a Lord who lets his people starve!'),
      nar('The street goes quiet. The knight\'s hand goes to his belt, and stays there.'),
      say('baker_widow', 'Not in front of the children, envoy. Not here.'),
    ],
    after: [
      say('oath_knight', 'I keep the count now. Three hundred and twelve bowls yesterday.'),
      say('baker_widow', 'And not one of them stolen. Ask him. He checks.'),
    ],
  },
  // Chapter 4, the souk square by the dry fountain (outline 7.3): a Witness contract-priest (the faith of oaths: a promise
  // written is a promise watched) against a Gaze merchant (the Gaze remembers who was cheated). Required before dusk.
  // Reason needs one of the House of Ledgers' books on contracts, the Witness or the Dorini Promise. The third round
  // turns the Majlis's refusal on the square.
  {
    id: 'aldoria_bargain',
    city: 'al_doria',
    question: 'Is a bad bargain still sacred?',
    ally: 'gaze_merchant',
    opponent: 'contract_priest',
    opensIf: { flag: 'story.vault_refused' },
    passing: [
      say('contract_priest', '...signed is signed, merchant. The Witness does not ask whether you liked the price.'),
      say('gaze_merchant', 'And the Gaze does not forget who paid it.'),
    ],
    listen: [
      say('contract_priest', 'A promise written is a promise watched. A bad bargain kept is still a kept promise. That is what makes this market work.'),
      say('gaze_merchant', 'The Crown bought Yucayeque\'s harbour from the guild. Nobody in Yucayeque sold it. Is that bargain sacred too?'),
      say('contract_priest', 'If it was signed, it is watched. "Sacred" and "just" are different words, my friend.'),
      say('gaze_merchant', 'Then your Witness watches a theft and calls it a contract.'),
      say(A, 'Gigi, Yari has gone very quiet.'),
    ],
    reasonNeeds: [loreFlag('aldoria_on_contracts'), loreFlag('aldoria_witness_market'), loreFlag('aldoria_dorini_promise')],
    rounds: [
      {
        claim: 'A promise written is a promise watched. A bad bargain kept is still a kept promise.',
        answers: {
          scripture: { short: 'The Gaze sees both', text: 'The Gaze remembers the bargain and who was cheated by it, and judges both. Not one without the other.', strength: 1 },
          reason: { short: 'It binds who consented', text: 'Your own teaching: a contract binds the ones who signed it. A bargain over someone else\'s goods binds them to nothing.', strength: 2 },
          compassion: { short: 'Ask the one who was sold', text: 'Ask the one who was sold whether they feel watched over.', strength: 1 },
        },
      },
      {
        claim: 'Then is the Crown\'s charter on Xaraguá sacred? It was signed. It is watched.',
        answers: {
          scripture: { short: 'Elodie lent the harbours', text: 'The temple says the goddess lent the realm to all of us. Nobody was given a harbour to sell.', strength: 1 },
          reason: { short: 'Then read it aloud', text: 'Then let the Witness watch it read aloud, every clause, in Yucayeque. See who signed for the harbour.', strength: 2 },
          compassion: { short: 'Yari is standing here', text: 'The girl beside me is from Yucayeque. Tell her the bargain is sacred.', strength: 0 },
        },
      },
      {
        claim: 'Then tell me, envoy: what do you owe a house that keeps a bad bargain?',
        answers: {
          scripture: { short: 'The truth, out loud', text: 'The truth, said out loud. The Gaze asks no more than that of anyone.', strength: 1 },
          reason: { short: 'Nothing past its word', text: 'Nothing. A witness holds what was signed. It does not have to like it, or profit from it.', strength: 1 },
          compassion: { short: 'To pay what it owes', text: 'It owes what every debtor owes: to pay it back to the ones it was taken from.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(The moneychangers stop counting. Someone at the back says "Hear, hear.")',
      1: '(The square is split. Half of them watch the priest, half the merchant.)',
      0: '(A few people shrug and go back to their stalls.)',
    },
    won: [
      say('contract_priest', '...A contract binds the ones who consented. I teach that to every apprentice. I had stopped hearing it.'),
      say('gaze_merchant', 'Tea, priest? You can watch me pay for it.'),
    ],
    lost: [
      say('contract_priest', 'Signed is signed, envoy. Come back when you can show me otherwise.'),
      say('gaze_merchant', 'He will be here. He always is. So will I.'),
    ],
    mediate: [
      say(G, 'You both want the same thing: bargains people can trust, and nobody sold who never agreed.'),
      say(G, 'Priest, watch the contracts. Merchant, read out who signed them. Together, at the fountain, on market day.'),
      say('contract_priest', 'A Witness and a Gaze merchant at one table. The guild will think it is a conspiracy.'),
      say('gaze_merchant', 'Let them. It will be the first honest one.'),
    ],
    provoke: [
      say(G, 'Your Witness watched the Crown buy a harbour from people who did not own it, and said nothing!'),
      nar('The square goes quiet. Two Majlis guards turn to look.'),
      say('contract_priest', 'Not here, envoy. Not in front of the guards.'),
    ],
    after: [
      say('contract_priest', 'We read the contracts aloud now, at noon. You would be surprised who stops to listen.'),
      say('gaze_merchant', 'And who stops coming to the market. Both are good signs.'),
    ],
  },
  // Eightgate's fountain (Chapter 5; the outline 7.3 with its second review 3.10): Se-2 Four Voices, required.
  // All four faiths, one claim a round (DebateRound.speaker): the Sky-Rider, the Quiet Crown speaker, the Witness
  // priest; the Gaze keeper is Gianna's side. The sources contradict each other on whether Elodie blessed the Throne
  // (guide 6.6). Reason needs one of the Hall's books (the Archive is sealed by day) or the Founding Compact.
  {
    id: 'seat_voices',
    city: 'seat',
    question: 'Who may sit the Throne?',
    ally: 'gaze_keeper',
    opponent: 'sky_rider',
    opensIf: { flag: 'story.coco_plan' },
    passing: [
      say('gaze_keeper', '...she blessed it! The sun-marked heirs are her sign.'),
      say('sky_rider', 'No god touched that chair. It was a prize of the founders\' war.'),
      say('witness_priest', 'It is a contract between eight houses. Blessed or not.'),
      say('quiet_speaker', 'And the shouting is the noise the chair makes. Be quiet, all of you.'),
    ],
    listen: [
      say('gaze_keeper', 'Elodie blessed the Throne. The heirs who stand on it carry her sun. That is her sign.'),
      say('sky_rider', 'The Four Hands remember the land, not the chair. The chair is just a chair. The founders fought over it.'),
      say('witness_priest', 'Whoever keeps the Founding Compact may sit it, blessed or not. A contract needs no blessing. It needs keeping.'),
      say('quiet_speaker', 'One hand on the Throne would bring the Quiet. This argument is the noise. It has gone on fifty years.'),
      say(A, 'Gigi, they are all talking about our family\'s chair.'),
    ],
    reasonNeeds: [loreFlag('seat_regent_commission'), loreFlag('seat_council_eight'), loreFlag('seat_petitions_breach'), loreFlag('seat_founding_compact')],
    rounds: [
      {
        speaker: 'sky_rider',
        claim: 'No god touched that chair. Whoever won the war sat in it. The chair is just a chair.',
        answers: {
          scripture: { short: 'She wove eight threads', text: 'Every faith agrees the realm was eight threads. A chair for one thread is not the realm\'s chair.', strength: 1 },
          reason: { short: 'The houses let her speak', text: 'The council\'s rule: whoever stands on the tile speaks for the houses only while they let her. Not a prize. A loan.', strength: 2 },
          compassion: { short: 'Ask who lost the war', text: 'Ask the ones who lost that war whether it was just a chair.', strength: 1 },
        },
      },
      {
        speaker: 'quiet_speaker',
        claim: 'One hand on the Throne, and the arguing stops. The Quiet is the only peace this realm has never tried.',
        answers: {
          scripture: { short: 'She remembers all voices', text: 'The goddess remembers every voice. A peace that silences them is the one thing she cannot remember.', strength: 2 },
          reason: { short: 'Silence signs nothing', text: 'A contract needs every party heard. A quiet realm cannot agree to anything. It can only be told.', strength: 1 },
          compassion: { short: 'You sound tired', text: 'You sound tired. Fifty years of shouting would tire anyone. That is not the same as being wrong.', strength: 1 },
        },
      },
      {
        speaker: 'witness_priest',
        claim: 'Then you agree with me, envoy. Whoever keeps the Compact may sit it. Even the one who keeps it now.',
        answers: {
          scripture: { short: 'Keeping is not holding', text: 'The Gaze keeps a memory. It does not own it. Keeping the Throne is not the same as holding it.', strength: 1 },
          reason: { short: 'Clause Six, unkept', text: 'The Compact says every clause is read to every signatory. Has every clause been? Then nobody has kept it.', strength: 2 },
          compassion: { short: 'Ask the bricked gate', text: 'Ask the house whose gate is bricked up whether the Compact was kept for them.', strength: 1 },
        },
      },
    ],
    crowd: {
      2: '(The pilgrims at the fountain go quiet. Someone at the back nods, slowly.)',
      1: '(The crowd splits four ways, as it always does here.)',
      0: '(A Sealbearer looks over. The crowd thins.)',
    },
    won: [
      say('witness_priest', '...A contract unkept by everyone binds no one. I teach that. I had not applied it to the Throne.'),
      say('sky_rider', 'A loan, not a prize. My grandmother would have liked you.'),
      say('quiet_speaker', 'I will think about it. Quietly.'),
    ],
    lost: [
      say('witness_priest', 'The Compact is kept, envoy, by whoever is keeping it. Come back with a clause.'),
      say('gaze_keeper', 'We will be here. We are always here. So is he.'),
    ],
    mediate: [
      say(G, 'You all want the same thing: a Throne nobody can take without the houses.'),
      say(G, 'Read the Compact aloud here, at the fountain, every Parley. Each of you a clause.'),
      say('quiet_speaker', 'Aloud. Every Parley. ...That is a great deal of noise.'),
      say('gaze_keeper', 'Good noise.'),
    ],
    provoke: [
      say(G, 'The Throne is held by a man who has renewed his own commission three times, and you argue about blessings!'),
      nar('The fountain goes quiet. Two Sealbearers turn and look.'),
      say('witness_priest', 'Not here, envoy. Not under the Hall\'s windows.'),
    ],
    after: [
      say('witness_priest', 'We read a clause of the Compact aloud here now. The Sealbearers listen. They pretend not to.'),
      say('quiet_speaker', 'I still think it is noise. I come to hear it anyway.'),
    ],
  },
];

/** The debates by the dialogue id their NPCs use. */
export const DEBATE_DIALOGUES: Readonly<Record<string, DebateDef>> = Object.fromEntries(DEBATES.map((d) => [`debate:${d.id}`, d]));
