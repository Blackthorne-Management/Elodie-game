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
];

/** The debates by the dialogue id their NPCs use. */
export const DEBATE_DIALOGUES: Readonly<Record<string, DebateDef>> = Object.fromEntries(DEBATES.map((d) => [`debate:${d.id}`, d]));
