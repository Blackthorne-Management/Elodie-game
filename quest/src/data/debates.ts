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
];

/** The debates by the dialogue id their NPCs use. */
export const DEBATE_DIALOGUES: Readonly<Record<string, DebateDef>> = Object.fromEntries(DEBATES.map((d) => [`debate:${d.id}`, d]));
