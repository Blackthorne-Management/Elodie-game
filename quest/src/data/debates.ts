// Street debates by city (guide 7.2; engine/debate.ts runs them). Pòdlimyè's corner, on the lawn below the
// Festival Plaza: a Gaze keeper against a Quiet Crown recruiter, "Is a goddess who only remembers any use?"
// It opens with the rest of the city, after the war room memory (owner decision, Oct 16). Each round has a
// strong answer (wins it), a fair one (splits the crowd) and a weak one; Reason needs a lore book read.

import type { DebateDef } from '../engine/debate.ts';
import type { DialogueLine } from '../engine/dialogue.ts';
import { loreFlag } from './books.ts';
import type { StageCue } from '../engine/stage.ts';
import { TEMPLE } from './muster.ts';

const K = 'gaze_keeper';
const Q = 'recruiter_a';
const G = 'gianna';
const BY = 'bayarmaa';
const A = 'anissa';
const R = 'roots_elder';
const P = 'gaze_pilgrim';
const S = 'samira';
const JO = 'jordyn';
const say = (speaker: string, text: string): DialogueLine => ({ speaker, text });
const nar = (text: string): DialogueLine => ({ speaker: '', text });
const act = (stage: StageCue[], speaker: string, text: string): DialogueLine => ({ speaker, text, stage });
const at = (x: number, y: number) => ({ x, y });

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
  // Ordvik's trading mats (Chapter 6; the outline 7.3): Oath of blood or oath of sky? Required. The Witness elder is
  // Gianna's side (the party is here to put the standard back); the Sky-Rider is the opponent. Both reasonable, both
  // dry or cheerful; no faith is a cult. Reason needs one of the Saga Tent's three oath books.
  {
    id: 'skarragol_oath',
    city: 'skarragol',
    question: 'Oath of blood or oath of sky?',
    ally: 'witness_elder',
    opponent: 'sky_rider',
    opensIf: { flag: 'party.bayarmaa' },
    passing: [
      say('sky_rider', '...a stick! You swore on a stick, and now you are surprised it can be stolen!'),
      say('witness_elder', 'And you swore on the weather, and are surprised nobody can hold you to it.'),
    ],
    listen: [
      say('sky_rider', 'An oath sworn on a stick is a stick. We swear to the open sky, and the sky is still there when the stick is stolen.'),
      say('sky_rider', 'Sell the fleet or don\'t. The oath was never in the pole.'),
      say('witness_elder', 'A contract is a thing you can lose. That is what makes it a contract.'),
      say('witness_elder', 'Ulfgar swore blood on the standard so that losing it would cost something. It is costing something. Good.'),
      say(A, 'They both want the standard back, Gigi. They just don\'t want to say it the same way.'),
    ],
    reasonNeeds: [loreFlag('skarragol_ulfgar_oath'), loreFlag('skarragol_law_moot'), loreFlag('skarragol_sky_riders')],
    rounds: [
      {
        claim: 'The sky cannot be stolen. A standard can. Why tie an oath to the thing a thief can carry off?',
        answers: {
          scripture: { short: 'Elodie wove both', text: 'The goddess wove the sky and the hands that cut the pole. An oath can live in either.', strength: 1 },
          reason: { short: 'So it can be counted', text: 'Ulfgar\'s Oath: sworn on a thing so the Moot can see who keeps it. You cannot count the sky.', strength: 2 },
          compassion: { short: 'Ask the guard', text: 'Ask the girl who guarded it whether the oath felt like weather the night it went.', strength: 1 },
        },
      },
      {
        claim: 'Then the Crown has bought your oath with one thief. Sky-sworn, the council could never sell.',
        answers: {
          scripture: { short: 'Nothing sells a vow', text: 'No god weighs a vow by where it hangs. A sold oath is a broken one, sky or pole.', strength: 1 },
          reason: { short: 'The law calls it shame', text: 'The Law of the Moot: the vote is lawful and shameful. Both are written. The pole makes the shame visible.', strength: 2 },
          compassion: { short: 'Three winters of fish', text: 'They are not selling an oath. They are selling three winters of fish and no salt.', strength: 1 },
        },
      },
      {
        claim: 'So you would swear on a stick, envoy? Your Zetwal swore on a page, and the Crown wrote a seventh one.',
        answers: {
          scripture: { short: 'The Gaze remembers', text: 'The Gaze remembers what was sworn, whatever it was sworn on. That page was read aloud.', strength: 1 },
          reason: { short: 'A page read is kept', text: 'A page nobody read was never agreed. A standard everyone sees can\'t hide a seventh clause.', strength: 1 },
          compassion: { short: 'Swear on both', text: 'Swear on both. On the pole for the Moot, and on the sky for yourselves. Nobody here wants it lost.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(The traders on the mats stop haggling. A horse-dealer says "Hah!" and pays someone.)',
      1: '(Half the mats nod at the elder, half at the rider. The salt trader nods at both.)',
      0: '(The traders go back to their salt.)',
    },
    won: [
      say('sky_rider', 'Counted, not kept. ...Fine. The sky can stand being looked at.'),
      say('witness_elder', 'You argue like a lawspeaker\'s granddaughter. That is a compliment, and you should take it before I think better of it.'),
    ],
    lost: [
      say('sky_rider', 'The sky is still there, envoy. Come back when the stick is.'),
      say('witness_elder', 'She will. Then we will see.'),
    ],
    mediate: [
      say(G, 'You both want the oath kept, and the fleet not sold.'),
      say(BY, 'Swear on both. My grandmother did.'),
      say('sky_rider', 'Sarnai swore on the sky. ...And on the pole. She did, didn\'t she.'),
      say('witness_elder', 'She did. It is on the hides. Read it.'),
    ],
    provoke: [
      say(G, 'Your oaths are what a council sells when the blockade bites. Sky or stick!'),
      nar('The mats go quiet. Two horn-riders look over.'),
      say('witness_elder', 'Not here, envoy. Not with Hrafn\'s riders listening.'),
    ],
    after: [
      say('witness_elder', 'The standard stands. The rider swore on the sky this morning, facing the pole. I saw her.'),
      say('sky_rider', 'The sky was behind the pole. It counts.'),
    ],
  },
  // Kirinoura's middle bridge (Chapter 7; the outline 7.3 with its review's 3.10): Is silence virtue or concealment?
  // Required. The Witness balance-keeper is Gianna's side; the veiled speaker is a public street speaker of the Quiet
  // Crown, reasonable and unhurried, not a Husher (the Chapter 1 recruiter's precedent): he never looks at Anissa, never
  // names her. The player may argue his side: Kirinoura's neutrality is the silence he means, and the chapter answers
  // him with the receipts. Reason needs one of the library's three silence books.
  {
    id: 'kuroshi_silence',
    city: 'kuroshi',
    question: 'Is silence virtue or concealment?',
    ally: 'balance_keeper',
    opponent: 'whisperer',
    opensIf: { flag: 'story.letter_given' },
    passing: [
      say('whisperer', '...silence is what you call it when you are the one not telling.'),
      say('balance_keeper', 'And a lie is what you call it when you are the one not listening.'),
    ],
    listen: [
      say('balance_keeper', 'An oath kept in silence is still kept. The Witness hears what is not said.'),
      say('balance_keeper', 'Silence is the room an honest word waits in.'),
      say('whisperer', 'Your council is silent. The Throne is silent. Every house keeps its files and calls it prudence.'),
      say('whisperer', 'One hand would need no silence. It would simply say.'),
      say(A, 'The quiet one wants everybody to talk, Gigi. The loud one wants everybody quiet.'),
    ],
    reasonNeeds: [loreFlag('kuroshi_balance_silence'), loreFlag('kuroshi_informants_petition'), loreFlag('kuroshi_genzo_ear')],
    rounds: [
      {
        claim: 'A city that writes everything down and reads none of it out is not keeping faith. It is keeping files.',
        answers: {
          scripture: { short: 'The Witness hears', text: 'The Witness hears what is kept, and what is told. Keeping is not lying.', strength: 1 },
          reason: { short: 'Files protect people', text: 'The Informants\' Petition: a name in a file is a name a broker cannot sell. Silence is the only law they have.', strength: 2 },
          compassion: { short: 'Ask the informant', text: 'Ask the fisher who told Sayo where the marines slept whether she wanted it read aloud.', strength: 1 },
        },
      },
      {
        claim: 'Then the Throne\'s silence protects people too. You cannot have one silence and not the other.',
        answers: {
          scripture: { short: 'Elodie remembers', text: 'Elodie remembers what kings forget. A silence that forgets is not the same as one that keeps.', strength: 1 },
          reason: { short: 'Who is silent, for whom', text: 'Balance and Silence: a silence kept for the weak is a shield; one kept for the strong is a wall.', strength: 2 },
          compassion: { short: 'Look who it hides', text: 'Look at who each silence hides. One hides fishers. The other hides a page.', strength: 1 },
        },
      },
      {
        claim: 'So you would have the people speak, envoy, and their councils keep quiet? Who decides which is which?',
        answers: {
          scripture: { short: 'The Gaze decides', text: 'The Gaze sees both. Neither is ours to choose alone.', strength: 1 },
          reason: { short: 'The law decides', text: 'A law that names the informants, and keeps them safe. Then their silence is no one\'s price.', strength: 1 },
          compassion: { short: 'Those it costs', text: 'The ones it costs most decide. Ask them. They are on the marsh, lighting posts.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(On the bridge, a clerk stops writing. A tea seller says "So!" and pours for everyone.)',
      1: '(Half the bridge nods at the keeper, half at the veil. A lantern-lighter nods at both.)',
      0: '(The bridge goes back to its own business, quietly.)',
    },
    won: [
      say('whisperer', 'A shield and a wall. ...Then build the shield where I can see it, envoy.'),
      say('balance_keeper', 'He will hold you to it. So will I.'),
    ],
    lost: [
      say('whisperer', 'Silence, envoy, all the way down. Come back when somebody says something.'),
      say('balance_keeper', 'She will. Then we will listen.'),
    ],
    mediate: [
      say(G, 'You both want the people safe, and the powerful seen.'),
      say('whisperer', 'Then name the people in the law, and the powerful in the street.'),
      say('balance_keeper', 'That is the Informants\' Petition. It has been on the shelf fifty years.'),
      say('whisperer', 'Then take it down.'),
    ],
    provoke: [
      say(G, 'Your city sells silence by the page. Ask the Crown\'s man what it costs!'),
      nar('The bridge goes very quiet. A clerk writes something down.'),
      say('balance_keeper', 'Not here, envoy. Everything on this bridge is written down.'),
    ],
    after: [
      say('balance_keeper', 'The order is lifted for the Throne and kept for the people. A shield, not a wall.'),
      say('whisperer', 'For now. Write it down.'),
    ],
  },
  // Agnipur's spice row (Chapter 8; the outline 7.3 with its review's 3.10): Is hesitation a sin, or is remembering
  // mercy? Required. The Gaze pilgrim is Gianna's side; the Flame Keeper is a believer of the Four Hands, not a zealot
  // (no Quiet Crown line joins him). The player may argue his side: the Court hesitated behind a curtain, and its son
  // settles arguments by not hesitating; the chapter answers both with a lamp lit quick and kept fifty years.
  {
    id: 'jwaladesh_hesitation',
    city: 'jwaladesh',
    question: 'Is hesitation a sin, or is remembering mercy?',
    ally: 'gaze_pilgrim',
    opponent: 'flame_keeper',
    opensIf: { flag: 'story.court_heard' },
    passing: [
      say('flame_keeper', '...a hand that waits is a hand that has let go.'),
      say('gaze_pilgrim', 'And a hand that never waits never holds anything long enough to remember it.'),
    ],
    listen: [
      say('flame_keeper', 'The flame is a hand. Rani Tejaswini said it: hesitation is the only true death.'),
      say('flame_keeper', 'The Crown did not hesitate at our chain. Arjun did not hesitate at theirs.'),
      say('gaze_pilgrim', 'A goddess who remembers is a goddess who waits. The one who waits is the one who can forgive.'),
      say('gaze_pilgrim', 'Your Arjun rode; five came home. Somebody remembered the two, or nobody would know their names.'),
      say(A, 'The fire one wants everyone to hurry, Gigi. The sun one wants everyone to wait.'),
    ],
    reasonNeeds: [loreFlag('jwaladesh_tejaswini'), loreFlag('jwaladesh_flame_keepers'), loreFlag('jwaladesh_harbor_chain')],
    rounds: [
      {
        claim: 'A Court that waits a month behind a curtain is not keeping a flame. It is watching one die and calling it prayer.',
        answers: {
          scripture: { short: 'Elodie remembers', text: 'Elodie remembers what is hidden. She does not punish it; she waits for it to be shown.', strength: 1 },
          reason: { short: 'The flame was kept', text: 'The Flame Keepers: the wick is tended in the open. A curtain is not the rite. Waiting is not the sin; hiding is.', strength: 2 },
          compassion: { short: 'Ask the runners', text: 'Ask the runners who practise every new moon with kitchen fire whether they have stopped hoping.', strength: 1 },
        },
      },
      {
        claim: 'Then hurry is the virtue. Arjun did not ask leave of the Court. Seven rode at a tower and the chain fell.',
        answers: {
          scripture: { short: 'The Gaze sees', text: 'The Gaze sees the riders and the ones who stayed to light the lamp. Both were the charge.', strength: 1 },
          reason: { short: 'Two never came home', text: 'The Harbor Chain: seven rode out, five came home. Somebody had to remember the two. That is not hesitation.', strength: 2 },
          compassion: { short: 'Their mothers', text: 'Ask the mothers of the two whether the hurry was a virtue. Then ask whether they would undo it.', strength: 1 },
        },
      },
      {
        claim: 'So you would have us wait, envoy, while the oil is in a warehouse and the Crown is in our pavilion?',
        answers: {
          scripture: { short: 'Elodie waits', text: 'Elodie waited fifty years for Xaraguá to be heard. She is still waiting. So am I.', strength: 1 },
          reason: { short: 'Waiting is a measure', text: 'Rani Tejaswini\'s Flame: the lamp was lit in one night and kept for fifty years. Quick once, then patient.', strength: 1 },
          compassion: { short: 'Not wait. Remember.', text: 'Not wait. Remember who is cold tonight, and go and get the oil. Remembering is what makes you go.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(On the spice row a vendor bangs a ladle on a pot. "So!" Somebody hands round cardamom.)',
      1: '(Half the row nods at the Keeper, half at the pilgrim. A lamp-seller nods at both.)',
      0: '(The spice row goes back to selling spice with no oil to cook it in.)',
    },
    won: [
      say('flame_keeper', 'Quick once, then patient. ...That is the lamp on the chain. I will say it in the temple.'),
      say('gaze_pilgrim', 'And I will remember that you said it.'),
    ],
    lost: [
      say('flame_keeper', 'Hesitation, envoy. Come back when you have stopped hesitating.'),
      say('gaze_pilgrim', 'She will. Then we will both still be here.'),
    ],
    mediate: [
      say(G, 'You both want the flame kept. One of you by hands, one by memory.'),
      say('flame_keeper', 'Then the hands go to the quay for the oil.'),
      say('gaze_pilgrim', 'And the memory goes with them, so the two who did not come home are named when it is lit.'),
      say('flame_keeper', 'That is the runners\' rite. We have been arguing about the runners.'),
    ],
    provoke: [
      say(G, 'Your Court hid its own flame behind a curtain. Is that the hand that does not wait?'),
      nar('The spice row goes very quiet. A vendor puts down his ladle.'),
      say('flame_keeper', 'Not here, envoy. The Court\'s son says that every morning, with a sword.'),
    ],
    after: [
      say('flame_keeper', 'The lamp on the chain did both. It was lit quick, and then it waited fifty years.'),
      say('gaze_pilgrim', 'Write that down, Keeper. I will.'),
    ],
  },
  // Kingsmere's Market Cross (Chapter 9; the outline 7.3): Should the Throne have one hand? Required. The Gaze exile is
  // Gianna's side; the Quiet Crown hierarch is a sincere believer in a plain grey stole, not a Husher and not veiled (no
  // line joins him to the cells). The player may argue his side: the chapter's court has one hand, patient and polite;
  // the chapter's answer is a clerk who wrote the truth in a margin and waited fifty years for a court to read it.
  {
    id: 'aldermoor_one_hand',
    city: 'aldermoor',
    question: 'Should the Throne have one hand?',
    ally: 'gaze_exile',
    opponent: 'qc_hierarch',
    opensIf: { flag: 'story.edmund_met' },
    passing: [
      say('qc_hierarch', '...eight voices shouting across a table while the harbor burns.'),
      say('gaze_exile', 'And one hand in the dark, which nobody can hold to anything.'),
    ],
    listen: [
      say('qc_hierarch', 'The realm is eight voices shouting across a table while the harbor burns.'),
      say('qc_hierarch', 'One hand on the Throne and the shouting stops. That is not tyranny. That is quiet.'),
      say('gaze_exile', 'A hand that cannot be seen cannot be held to anything. The goddess does not rule. She watches.'),
      say('gaze_exile', 'One hand in the dark is how my island was counted as property.'),
      say(A, 'The grey one wants everybody quiet, Gigi. The sun one wants everybody watched.'),
    ],
    reasonNeeds: [loreFlag('aldermoor_witness_law'), loreFlag('aldermoor_agatha')],
    rounds: [
      {
        claim: 'Eight houses could not agree on the time of day. One hand would at least keep time.',
        answers: {
          scripture: { short: 'Elodie watches', text: 'Elodie does not rule. She watches, and every ruler knows it. A watched hand keeps better time.', strength: 1 },
          reason: { short: 'The roll keeps time', text: 'The Witness and the Law: a court keeps time with its roll, not its hand. Who was there, who was sent for.', strength: 2 },
          compassion: { short: 'Ask who is quiet', text: 'Ask the families on the Cross who went quiet whether the quiet kept time for them.', strength: 1 },
        },
      },
      {
        claim: 'The Crown is patient. Patience is a virtue. Dame Agatha said the loud burn out first.',
        answers: {
          scripture: { short: 'The goddess waits', text: 'The goddess is patient too. She waits for what is hidden to be shown, not for it to be forgotten.', strength: 1 },
          reason: { short: 'Agatha wrote it down', text: 'Dame Agatha\'s Patience: she was patient and she wrote everything down, and read it back. Patience is a record.', strength: 2 },
          compassion: { short: 'Patience for whom', text: 'Patient with whom? Agatha was patient with the lords who lied. This patience is spent on the people it hushes.', strength: 1 },
        },
      },
      {
        claim: 'So you would have eight hands, envoy, and every one of them grabbing?',
        answers: {
          scripture: { short: 'Hands, watched', text: 'Eight hands, every one of them watched. That is what the Gaze is for.', strength: 1 },
          reason: { short: 'A hand in the light', text: 'One hand, if you like. But in the light, with its own name on what it signs. Not under a seal with no hand.', strength: 1 },
          compassion: { short: 'Hands that hold', text: 'Hands that hold each other up. A clerk wrote the truth in a margin and waited fifty years. Somebody read it.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(Round the cross, a tea-shop keeper opens her door a crack to listen. A constable takes his hat off.)',
      1: '(Half the square nods at the hierarch, half at the exile. The cross gets touched for luck, twice.)',
      0: '(The square goes back to being wet.)',
    },
    won: [
      say('qc_hierarch', 'In the light, with its own name on what it signs. ...I would like to know whose name.'),
      say('gaze_exile', 'So would I. So would the whole Cross.'),
    ],
    lost: [
      say('qc_hierarch', 'Quiet, envoy. Come back when you have something quieter to say.'),
      say('gaze_exile', 'She will. I have been coming back for thirty years.'),
    ],
    mediate: [
      say(G, 'You both want the shouting to stop. One of you by one hand, one of you by every eye.'),
      say('qc_hierarch', 'Then let the hand sign its own name.'),
      say('gaze_exile', 'And let it be read aloud in the square, where we can all see it.'),
      say('qc_hierarch', 'That is the Witness\'s way. We have been arguing about the Witness.'),
    ],
    provoke: [
      say(G, 'Your one hand keeps an almoner who takes families\' voices. Is that the quiet you mean?'),
      nar('The square goes very still. A tea-shop door shuts.'),
      say('qc_hierarch', 'Not here, envoy. Not in the rain, where she can hear.'),
    ],
    after: [
      say('qc_hierarch', 'A hand in the light. I will think about it, in the light.'),
      say('gaze_exile', 'Think out loud. That is all the goddess asks.'),
    ],
  },
  // ---- Chapter 10, the Muster in Pòdlimyè: the three feuds, the chapter's required mediations (the outline 7.3 with its
  // second review's 3.5: the Influence houses are each a feud's ally, and a mediation pays two toward that house's price).
  // City zetwal, so Mediate is the built Influence 5 there; they open once the Chancellor has set the condition.
  {
    id: 'zetwal_feud_merchants',
    city: 'zetwal',
    question: 'Is a convoy taken on the steppe stolen, or taxed?',
    ally: 'dorini_clerk',
    opponent: 'hrafn',
    opensIf: { flag: 'story.council_condition' },
    passing: [
      say('dorini_clerk', '...one convoy, eleven wagons, forty-two horses. The guild has the receipts.'),
      say('hrafn', 'The steppe has no receipts. It has grass.'),
    ],
    listen: [
      say('dorini_clerk', 'A convoy is a contract with the road. Your riders broke it, and the guild has the receipts for what they took.'),
      say('hrafn', 'The steppe has no road. It has grass, and whoever rides it.'),
      say('hrafn', 'You paid the Crown\'s toll for fifty years without a word. You can pay ours for one convoy.'),
      say('dorini_clerk', 'The Crown\'s toll had a receipt.'),
      say(A, 'They both sound tired, Gigi. Like they\'ve had this argument for years.'),
    ],
    reasonNeeds: [loreFlag('zetwal_harbor_tolls'), loreFlag('skarragol_crown_offer'), loreFlag('aldoria_on_contracts')],
    rounds: [
      {
        claim: 'Eleven wagons went onto the steppe and seven came off it. That is theft, in any language with a ledger.',
        speaker: 'dorini_clerk',
        answers: {
          scripture: { short: 'The Gaze sees both', text: 'The Gaze remembers the raid. It also remembers the blockade that emptied the steppe\'s salt first.', strength: 2 },
          reason: { short: 'Contracts bind both', text: 'On Contracts: a contract binds both hands. The road\'s toll was never agreed with the people who live on it.', strength: 1 },
          compassion: { short: 'Who went hungry', text: 'Ask the drivers who lost their wagons, and the riders who lost a winter. Neither of them set the price.', strength: 1 },
        },
      },
      {
        claim: 'The blockade cost the steppe three winters. A convoy is a cheap price for three winters.',
        answers: {
          scripture: { short: 'Two wrongs', text: 'A winter taken and a convoy taken are both remembered. The goddess does not subtract.', strength: 1 },
          reason: { short: 'The Crown\'s toll', text: 'The Crown\'s toll is the thing you both paid. It is the thing you are both sailing against tomorrow.', strength: 1 },
          compassion: { short: 'Both poorer', text: 'Three winters of fish and no salt. Three seasons of a convoy. Both of you are poorer because the Crown wanted you to be.', strength: 2 },
        },
      },
      {
        claim: 'Then who sails first, envoy? The thief, or the one he robbed?',
        answers: {
          scripture: { short: 'Nobody is first', text: 'In the Gaze\'s eyes nobody sails first. The names are read together.', strength: 1 },
          reason: { short: 'Who knows the water', text: 'The one who knows the strait sails first, and the one who knows the shore lands first. That is not a prize.', strength: 2 },
          compassion: { short: 'Side by side', text: 'Side by side. Then neither of you has to watch the other\'s back.', strength: 1 },
        },
      },
    ],
    crowd: {
      2: '(Round the clock gate, a Dorini clerk puts his pen down, and an Ironvow rider takes his hand off his horse\'s bridle.)',
      1: '(Half the market nods at the clerk, half at the jarl. The goat herder\'s goat bleats at both.)',
      0: '(The market goes back to shouting prices.)',
    },
    won: [
      say('hrafn', 'Side by side. My riders will hate it. They will do it.'),
      say('dorini_clerk', 'I will tell the admiral. He will want a receipt.'),
    ],
    lost: [
      say('hrafn', 'Words, envoy. The steppe has heard words.'),
      say('dorini_clerk', 'And the guild has filed them.'),
    ],
    mediate: [
      say(G, 'Dorini salt to the steppe, at the old price. Ironvow horses to the guild\'s caravans, at the old price. Both written down.'),
      say(S, 'I\'ll write it. In the guild\'s hand, so nobody can say they didn\'t read it.'),
      say('hrafn', '...At the old price.'),
      say('dorini_clerk', 'The admiral will sign it. He likes a price that does not move.'),
      nar('The clerk and the jarl shake hands over the Ironvow horse\'s neck. The horse puts up with it.'),
      say(S, 'That is the most expensive sentence I have ever written, and I am going to invoice both of them for it.'),
    ],
    provoke: [
      say(G, 'Your guild sold the Crown\'s salt for fifty years, and your riders sold their own fleet to it. Which of you is the thief?'),
      nar('The market goes very quiet. Somebody\'s horse stamps.'),
      say('hrafn', 'Careful, envoy.'),
    ],
    after: [
      say('hrafn', 'Side by side. I have told my riders. They are still complaining.'),
      say('dorini_clerk', 'At the old price. I have it in writing.'),
    ],
  },
  {
    id: 'zetwal_feud_temple',
    city: 'zetwal',
    question: 'Can a burned temple be rebuilt by the hands that burned it?',
    ally: 'muster_retainer',
    opponent: 'agnivansh_steward',
    opensIf: { flag: 'story.council_condition' },
    passing: [
      say('agnivansh_steward', '...on a paper you knew was false.'),
      say('muster_retainer', 'On the Crown\'s word. We have stopped taking it.'),
    ],
    listen: [
      say('muster_retainer', 'We burned it on the Crown\'s word. We have stopped taking the Crown\'s word. What else would you have us stop?'),
      say('agnivansh_steward', 'They burned the temple on a paper that was false. They knew it was false.'),
      say('agnivansh_steward', 'The elder who signed it is still alive, and still sorry, and sorry does not rebuild a roof.'),
      say('muster_retainer', 'Then let us rebuild the roof.'),
      say(A, 'The grey one wants to help, Gigi. The saffron one isn\'t ready.'),
    ],
    reasonNeeds: [loreFlag('kuroshi_burned_temple'), loreFlag('jwaladesh_priests_decision'), loreFlag('zetwal_four_hands'), loreFlag('jwaladesh_burned_temple')],
    rounds: [
      {
        claim: 'The hands that burned it would build it crooked. Let them pay, and let others build.',
        answers: {
          scripture: { short: 'Remembered hands', text: 'A thing done is remembered, and so is the hand that stopped doing it. The goddess remembers both.', strength: 2 },
          reason: { short: 'The Crown\'s paper', text: 'The paper was the Crown\'s. Both your houses were written down as "the ash" on the same page; I heard it read at Eightgate.', strength: 1 },
          compassion: { short: 'Let them carry', text: 'Let them carry the stones, at least. Some debts can only be paid by carrying.', strength: 1 },
        },
      },
      {
        claim: 'Sorry does not rebuild a roof.',
        answers: {
          scripture: { short: 'Sorry is a start', text: 'The Gaze does not ask for sorry. It asks for what you do after.', strength: 1 },
          reason: { short: 'The same page', text: 'You are both "the ash" on the Crown\'s page. The roof was burned by the hand that wrote that word.', strength: 1 },
          compassion: { short: 'A beginning', text: 'He stood in front of your flame, Meera said. That is not an apology. It is a beginning.', strength: 2 },
        },
      },
      {
        claim: 'And if they build it, envoy, whose temple is it?',
        answers: {
          scripture: { short: 'The goddess\'s', text: 'It was never yours or theirs. It was the people\'s who came to it.', strength: 1 },
          reason: { short: 'The ones who pray', text: 'It is the temple of whoever prays in it. That is how temples have always been owned.', strength: 1 },
          compassion: { short: 'One night each', text: 'One night on your altar, one night on theirs. That is how the crane and the lamp did it.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(By the lamp, a Suzumori guard and an Agnivansh keeper find they are standing on the same step.)',
      1: '(The island\'s pilgrims murmur. Half of them were never sure whose temple it was.)',
      0: '(The lamp burns on. Nobody moves.)',
    },
    won: [
      say('agnivansh_steward', 'One night each. ...I will say it to the Keepers. They will not like it either.'),
      say('muster_retainer', 'Nobody likes it. That is how you know it is fair.'),
    ],
    lost: [
      say('agnivansh_steward', 'Not today, envoy.'),
      say('muster_retainer', 'Today is the only day we have.'),
    ],
    mediate: [
      act([{ do: 'look', actor: 'player' }], '', 'Gianna sets Kaede\'s paper crane on the lamp\'s step, beside the Agnivansh brass lamp.'),
      act(
        [
          { do: 'sync' },
          { do: 'walk', actor: 'haru', to: at(TEMPLE.crane.x - 1, TEMPLE.crane.y + 1), facing: 'up', async: true },
          { do: 'walk', actor: 'vikram', to: at(TEMPLE.brassLamp.x + 1, TEMPLE.brassLamp.y + 1), facing: 'up' },
        ],
        '',
        'Haru and Vikram, who have walked three chapters together, say nothing, and stand on the same step.',
      ),
      say('agnivansh_steward', 'One night on our altar. One night on theirs.'),
      nar('The Suzumori retainer closes his fan.'),
    ],
    provoke: [
      say(G, 'Your elder signed a false paper, and your Keepers hid the flame from the city. Which of you burned the temple?'),
      nar('The island goes quiet. The lamp hisses.'),
      say('agnivansh_steward', 'Not in front of the lamp, envoy.'),
    ],
    after: [
      say('agnivansh_steward', 'One night on our altar.'),
      say('muster_retainer', 'One night on theirs.'),
    ],
  },
  {
    id: 'zetwal_feud_crown',
    city: 'zetwal',
    question: 'Are the Crown\'s own people the Crown?',
    ally: 'printer',
    opponent: 'fb_sergeant',
    opensIf: { flag: 'story.council_condition' },
    passing: [
      say('fb_sergeant', '...Kingsmere accents. I do not care whose vote they had.'),
      say('printer', 'I never had a vote.'),
    ],
    listen: [
      say('printer', 'I set type in Kingsmere for forty years under a Crown I never voted for. My people purged. My families quiet.'),
      say('printer', 'I am not the Crown. I am what the Crown does to its own.'),
      say('fb_sergeant', 'Crown raiders burned the highland roads when I was nine. My father\'s road. They had Kingsmere accents.'),
      say('fb_sergeant', 'I do not care whose vote they had.'),
      say(A, 'The man with the ink wants somebody to sit with him, Gigi.'),
    ],
    reasonNeeds: [loreFlag('zetwal_ash_wars_temple'), loreFlag('kuroshi_spy_ledger'), loreFlag('zetwal_ash_wars_anicette'), loreFlag('zetwal_crown_chronicle'), 'side.crown_chronicle.done', 'clue.four_accounts'],
    rounds: [
      {
        claim: 'They wore the Crown\'s coat. A coat is a choice.',
        answers: {
          scripture: { short: 'The Gaze counts people', text: 'The Gaze counts people, not crowns. It counted the raiders, and it counted the printer.', strength: 1 },
          reason: { short: 'Written to order', text: 'The Crown\'s chronicle of those roads was written to order. The raiders were the Crown\'s; the clerk who wrote it down was Kingsmere\'s.', strength: 2 },
          compassion: { short: 'Coats turned', text: 'These coats are turned inside out. They chose that too, in front of the Crown.', strength: 1 },
        },
      },
      {
        claim: 'Kingsmere sent the raiders. Kingsmere\'s people can carry the blame.',
        answers: {
          scripture: { short: 'Each their own', text: 'Each carries their own. That is the whole of what the goddess asks.', strength: 1 },
          reason: { short: 'Not the same people', text: 'The four accounts agree on one thing: the raiders and the people who paid for them were not the same. The Crown spent forty years making sure you\'d think so.', strength: 2 },
          compassion: { short: 'A pie-shop boy', text: 'He hit a sergeant for a pie-shop boy, and said sorry after. That is the whole of Kingsmere\'s people in one act.', strength: 1 },
        },
      },
      {
        claim: 'Then what are they, envoy, if not the Crown?',
        answers: {
          scripture: { short: 'Remembered', text: 'People who will be remembered for what they did next. Same as you.', strength: 1 },
          reason: { short: 'Witnesses', text: 'Witnesses. They saw the Crown from inside, and they walked out to say so.', strength: 1 },
          compassion: { short: 'Neighbours', text: 'Twelve people who walked to the coast to stand in your plaza. Neighbours, if you let them.', strength: 2 },
        },
      },
    ],
    crowd: {
      2: '(Round the statue, a Free Brasador soldier moves over on the step, to make room for a violet coat.)',
      1: '(The square is split. The nursemaid\'s six take sides loudly.)',
      0: '(The square goes back to staring at the violet coats.)',
    },
    won: [
      say('fb_sergeant', 'Neighbours. ...I will sit with them. I will not like it.'),
      say('printer', 'Nobody likes me. I am a printer.'),
    ],
    lost: [
      say('fb_sergeant', 'They had Kingsmere accents, envoy.'),
      say('printer', 'So do I.'),
    ],
    mediate: [
      act(
        [
          { do: 'enter', actor: 'jordyn_s', look: 'jordyn_free', from: at(17, 21), to: at(17, 14), facing: 'up' },
          { do: 'look', actor: 'jordyn_s' },
        ],
        JO,
        'I arrested the Crown\'s almoner in the Crown\'s court. The men behind me left the Crown\'s watch in front of the Crown.',
      ),
      say(JO, 'If that is the Crown, the Crown has resigned.'),
      act([{ do: 'wait', ms: 900 }], 'fb_sergeant', '...Terribly sorry, Captain.'),
      say('edmund', 'That\'s my line.'),
      act([{ do: 'exit', actor: 'jordyn_s', to: at(17, 21) }], '', 'The printer and the sergeant stand either side of the statue of the signers.'),
    ],
    provoke: [
      say(G, 'Your company fired on Brasador\'s own envoy from a wall. Whose people are you?'),
      nar('The square goes still. A Free Brasador soldier puts his hand on his sword.'),
      say('fb_sergeant', 'Careful, envoy. That was our captain\'s escape.'),
    ],
    after: [
      say('fb_sergeant', 'Neighbours. I am told.'),
      say('printer', 'I am printing it. Then it will be true.'),
    ],
  },
];

/** The debates by the dialogue id their NPCs use. */
export const DEBATE_DIALOGUES: Readonly<Record<string, DebateDef>> = Object.fromEntries(DEBATES.map((d) => [`debate:${d.id}`, d]));
