// The official rule guide shown in the app: the rulebook with every later decision folded in
// (docs/bloodline-rulebook-draft.md + docs/rules-decisions.md). Numbers come from src/config.ts so the guide always
// matches the game. The houses and the full card list are drawn from src/data by the guide screen itself.
// Inline **bold** is the only markup.
import { HAND_SIZE, OPENING, SPECTER_CHOICES, SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING } from '../config';

export type RuleBlock = string | { list: string[] } | { steps: string[] } | { quote: string };
export interface RuleSection { id: string; title: string; blocks: RuleBlock[] }

const S = THRESHOLDS.small, N = THRESHOLDS.normal;
const truce = OPENING.truceRounds;
const truceText = truce === 1 ? 'the first round' : `the first ${truce} rounds`;

export const RULES: RuleSection[] = [
  {
    id: 'story', title: 'The Story',
    blocks: [
      { quote: 'In the age before the first age, long ere the eight houses drew blood from one another, there was Elodie alone: the goddess who wove this realm from nothingness and has watched it turn ever since. She does not rule. She remembers. The seat at the heart of this contest has never truly stood empty; she has dwelt there always, waiting to behold who among the living is worthy of her gaze.' },
      'Each player leads a **Bloodline**, a family fighting for **Elodie\'s Throne** at the centre of the realm (called simply "the Throne" in these rules). You don\'t play one hero: you play a succession of them. When your character dies, their heir rises stronger. Death is not failure; it is how your family grows.',
      'Build power in three pillars, **Influence**, **Fear** and **Wealth**, then stand on the Throne and claim it. Alliances can form, but nothing enforces them.',
    ],
  },
  {
    id: 'components', title: 'What\'s in the Game',
    blocks: [{
      list: [
        '**The board:** an 18 × 18 grid. The Throne fills the four centre squares. Each of the eight houses owns one tile around it: three **Court** tiles (Influence), three **War** tiles (Fear) and two **Trade** tiles (Wealth).',
        '**Eight houses**, each with four generation cards (Gen I to IV).',
        '**The Shared Action Deck:** 126 cards. 71 Hand Cards (including 8 Block/Deflect cards and 6 Reactions) and 55 Instant/Event cards.',
        '**Heart Tokens:** your life, and also your attack strength.',
        '**Resource tokens** for Influence, Fear and Wealth. Each token is worth **1** on its front and **×5** on its back. Flip a token to count 5, and make change with the supply whenever you like (four 1s back for one ×5), so you never need more than a handful of each.',
        '**Grudge Tokens**, pawns, player boards, dice and the round track printed on the board.',
        'For **2 to 8 players**, best with 3 to 6. **60 to 150 minutes:** about 20 minutes per player. For a first game, play with 3 to 5.',
      ],
    }],
  },
  {
    id: 'setup', title: 'Setup',
    blocks: [{
      steps: [
        '**Draw houses by lottery.** Shuffle the Grudge Tokens face down; each player draws one blind. That is your house for the game.',
        '**Or pick, only if everyone agrees.** Before the draw, ask the table. If **every** player agrees, players pick their houses instead; **one "no" and it is the lottery** (seven yeses and one no is still the lottery). To pick, everyone rolls the die: the highest roll picks first (ties re-roll), then picking goes **clockwise** from that player. Picking first is an advantage, which is why it must be unanimous and decided by the dice.',
        'Take your house\'s generation cards with **Gen I** on top, and Heart Tokens equal to its Gen I Heart Tokens.',
        'Place all eight house tiles, whatever the player count. **A house not in the game leaves its tile unowned: anyone may farm it.**',
        'Put your pawn on your house\'s own tile.',
        `Shuffle the deck and deal everyone **${HAND_SIZE} Hand Cards**. Any Instant drawn in this deal is shuffled back and replaced.`,
        '**First player:** if Elodie (Lolo, Lodie) is playing, she always goes first. Otherwise everyone rolls the die and the highest roll goes first (re-roll ties). Play then goes **clockwise** around the table, in seating order, for the whole game.',
      ],
    }],
  },
  {
    id: 'turn', title: 'Your Turn',
    blocks: [
      'On your turn, in this order:',
      {
        steps: [
          '**Move.** Roll the die and move up to that many squares.',
          '**Resource check.** If you stopped on a resource tile, you may gain from it.',
          '**One action.** Attack a rival beside you, **or** play one Hand Card, **or** offer a trade. Only one. You may also do nothing.',
          `**Draw back up to ${HAND_SIZE}.** Instants resolve the moment you draw them and are replaced.`,
        ],
      },
      '**Free extras:** your house abilities don\'t use your action (each can be used once per turn unless it says otherwise), and you may **claim the Throne** at any point in your turn while standing on it and eligible.',
      `**Opening truce:** no attacks of any kind during ${truceText}.`,
      'A **round** is every player taking one turn. At the start of each round, the first player moves the round marker one space along the round track on the board.',
    ],
  },
  {
    id: 'move', title: 'Moving',
    blocks: [{
      list: [
        'Roll one die and move **up to** that many squares, stepping up, down, left or right. You may turn as often as you like (a 3 can be two up and one right) and you may stop early or stay put.',
        '**No diagonal steps.** Every square can be walked on, sea included. Pawns never block each other and any number may share a square.',
        '**Play on the grid only.** The 18 × 18 grid is the whole play area: the ocean and islands outside it are scenery, and no move may leave the grid.',
        'Distances are always counted in up/down/left/right steps.',
        'Hand Cards can\'t be played before you move. Extra movement from a card moves you straight away, with no second resource check.',
        'Some cards name a straight line or a direction (Forced March, Forced Retreat, Suzumori\'s Ayatsuri); those keep to it.',
      ],
    }],
  },
  {
    id: 'resources', title: 'Resources and Tiles',
    blocks: [
      'The three pillars are **Influence** (Court tiles), **Fear** (War tiles) and **Wealth** (Trade tiles).',
      {
        list: [
          `Stop on a resource tile and gain **${TUNING.tileAlone}** of its resource if you're alone there, or **${TUNING.tileShared}** if someone else is on it too.`,
          '**Never from your own house\'s tile.**',
          '**Your next score must come from a different tile than your last one**, however many turns pass. Stepping off and back on doesn\'t reset it. Your heir starts fresh.',
          'The Throne gives no resources.',
          '**No hidden resources.** Everyone\'s Influence, Fear and Wealth are public. Keep your resource tokens in plain view, and any player may ask your exact totals at any time: you must answer truthfully. Hands and the draw pile stay hidden.',
          'Totals never drop below 0. Stealing from an empty pool gives nothing.',
          'The token supply is unlimited. If a kind of token runs out, use anything as a stand-in.',
          'Wealth is the scarcest pillar (only two Trade tiles), so the deck holds more cards that give Wealth.',
        ],
      },
    ],
  },
  {
    id: 'combat', title: 'Combat',
    blocks: [
      {
        list: [
          '**Attack** a rival on your square or on one of the four squares beside you (not diagonal). Attacking is your action and **ends your turn**; you still draw back up.',
          '**Damage equals your current Heart Tokens.** A wounded fighter hits weaker.',
          `**Big tables (${TUNING.bigTablePlayers}+ players): no attack deals more than ${TUNING.bigTableMaxDamage} damage,** bonuses included. This covers basic attacks, attack cards, Challenge blows and the Sudden Death duel; Heart Token loss that isn't an attack is not capped.`,
          'One basic attack per turn. Attack cards (Cursed Dagger, Shadow Strike) are separate.',
          '**Block/Deflect cards** are played off-turn, in answer to an attack on you. They don\'t use up your own action. **Counterspell** answers any other Hand Card aimed at you.',
          'At 0 Heart Tokens your character dies (see Death and Succession). If you die on your own turn, your turn ends.',
        ],
      },
      '**What counts as an attack:** basic attacks, Cursed Dagger, Shadow Strike, Elodie\'s Trial and Challenge fights. Hex of Withering, Poisoned Chalice, Duel of Honor and Heart Token loss from global or fate effects are not attacks.',
      '**Kill credit:** you get the kill when your attack, card or ability caused the death (including Hex, Poisoned Chalice, winning a Duel of Honor, the attacker in Elodie\'s Trial, and Riposte). Deaths from global, fate or self effects have no killer.',
      {
        list: [
          `**Opening truce:** no attacks of any kind (basic, card or Reaction) during ${truceText}. Challenges are not affected.`,
          '**New heirs are protected:** a new heir can\'t be attacked until the end of their first turn (if they fell on their own turn, through their next one). Challenges and non-attack effects still apply. A shield shows beside their name.',
          '**The Throne is a sanctuary, but only for a player eligible to claim:** no one can attack them there, they can\'t attack from there, and they can\'t die there (any other Heart Token loss stops at 1). **Anyone else may stand on the Throne but gets no protection:** they can be attacked and killed there like anywhere else. Challenge fights for the Throne are the exception.',
        ],
      },
    ],
  },
  {
    id: 'trade', title: 'Trading',
    blocks: [{
      list: [
        'As your action, offer one other player **1 of your resources for 1 of a different kind** of theirs, at any distance.',
        'They accept or refuse. Nothing changes hands without their yes.',
        'The offer is your action either way, and you may make one offer per turn. Specters can\'t trade.',
        'Barter cards (which swap cards) and Uneasy Trade (a forced trade) are separate: they are played as cards.',
      ],
    }],
  },
  {
    id: 'cards', title: 'The Deck',
    blocks: [
      {
        list: [
          `**Hand Cards** are held, up to **${HAND_SIZE}**. You play one as your action. They give resources, attack from range, disrupt rivals, move you, swap cards (Barter), call truces or block attacks.`,
          '**Instant/Event cards** resolve the moment they are drawn and are never held. They bring dice chaos, global effects and targeted strikes.',
          '**Reaction cards** are Hand Cards played only on another player\'s turn, at the moment printed on them (see Reactions).',
          '**Elodie\'s cards:** ten Instants are the goddess acting herself. They play like any other Instant and carry her mark.',
        ],
      },
      {
        list: [
          `**Hand limit:** you can never hold more than ${HAND_SIZE} Hand Cards, even for a moment. If anything would put you over, discard down at once; those discards go to the bottom of the discard pile.`,
          'When the draw pile is empty, shuffle the discard pile into a new one and keep drawing.',
          '**The discard pile is face down,** in one stack, in order: the top card is the one most recently discarded, and hand-limit discards go underneath. Don\'t shuffle it. A Specter draws its top 5, looks at them, plays one and puts the rest back on top in the same order; a card that takes from the discard pile lets you look through it.',
          '**Always back to 3.** Whenever you play a card, on your own turn or someone else\'s (a Block, Reaction or Counterspell), draw back up to 3 as soon as that action is over. Instants drawn this way resolve as usual. Cards taken from you in other ways (stolen, discarded, swapped) are replaced at the end of your own turn.',
          '**Lasting cards stay out until they end.** A card whose effect lasts (Ceasefire, Blood Pact, Dread Banner, Marked for Death, Hex of Withering, Confusion, Forced March, Golden Harvest, Plunder, Vanishing Act and the like) is not discarded when played: leave it face up in front of the player it affects (for a truce between two players, between them) and discard it the moment its effect ends.',
        ],
      },
    ],
  },
  {
    id: 'reactions', title: 'Reactions',
    blocks: [
      'Six Hand Cards (Ill Omen, Embargo, Intercept, Interference, Ambush and Turnabout) are held like any other and count toward your hand, but they are **never your own action**. Each prints its moment under the divider:',
      {
        list: [
          '**Ill Omen:** when a rival rolls to move, cancel the move. They stay put this turn; their resource check still happens where they stand.',
          '**Embargo:** when a rival\'s trade is accepted or they play a Barter card, cancel it. Nothing changes hands and their action is spent. The trade partner can\'t Embargo their own trade.',
          '**Intercept:** when a rival gains resources from a tile, they gain 1 less.',
          '**Interference:** when a rival plays a Hand Card, cancel it. It is discarded with no effect and their action is spent. **A card aimed at a player is played face up and its target is named first;** then anyone may say "Wait!" and Interfere, knowing who it was aimed at.',
          '**Ambush:** when a rival ends their move beside you, attack them at once (damage = your Heart Tokens), before their resource check. Only where an attack is allowed; they may Block it.',
          '**Turnabout:** when a Hand Card targets you, it targets another player of your choice instead. Counterspell is offered first.',
        ],
      },
      '**Say "Wait!"** To play a Reaction (or a Block or Counterspell), call out "Wait!" or "Stop!" at its moment. Everyone pauses while you play it. Once the active player has moved on to the next step, the moment has passed: you can\'t go back.',
      '**Ill Omen** is played after the die is rolled and everyone has seen the number, before the pawn moves.',
      '**Timing:** if more than one player calls at the same moment, the first in seat order after the acting player plays; the first Reaction played closes that moment. A Reaction can\'t be answered by another Reaction, Counterspell or Block.',
    ],
  },
  {
    id: 'death', title: 'Death and Succession',
    blocks: [
      'When a character reaches 0 Heart Tokens:',
      {
        steps: [
          '**Reckoning first:** if the killer\'s family holds a Grudge against the dying player, the killer takes the Reckoning bonus now, **before anything is halved** (see Reckoning below).',
          'The dying player loses **half (rounded down) of one pool** of their choice. (House Yaguana\'s **Areíto**: Yaguana loses nothing here.)',
          '**Grudge:** their family now holds a Grudge against the killer (unless this kill was a Reckoning).',
          'The next generation card is turned up: the heir keeps every earlier ability and gains a new one.',
          'Take Heart Tokens for the new generation.',
          'The heir rises on the house\'s own tile, protected from attacks until the end of their first turn.',
        ],
      },
      '**Grudge Tokens:** when someone kills your character, they hand you one of their Grudge Tokens (their crest). Keep it in front of you: your family now holds a Grudge against them.',
      '**Reckoning:** killing a player your family holds a Grudge against settles it. Give their Grudge Token back, and no new Grudge is created: the feud is over. You can hold several Grudges, even more than one against the same player; a Reckoning settles one.',
      {
        list: [
          '**The Reckoning bonus: take 1 Influence, 1 Fear and 1 Wealth** from the player you killed. For any of those they have none of, take 1 from a pool they still have instead (your choice), so you take 3 in all when they hold at least 3.',
          '**The bonus is taken BEFORE the death halving, never after.** First the avenger takes their 3, then the dying player halves one pool of their choice from what is left.',
          '**Example:** you avenge yourself on a player holding 2 Influence, 5 Fear and 0 Wealth. You take 1 Influence, 1 Fear and, since they have no Wealth, 1 more Fear (your choice). They are left with 1 Influence and 3 Fear, then halve one pool: halving Fear leaves them 1 Influence and 2 Fear.',
          'Stillwater\'s Patience can cancel the whole bonus.',
        ],
      },
    ],
  },
  {
    id: 'specter', title: 'The Specter',
    blocks: [
      'When a Gen IV character dies, the bloodline has ended, but the player stays in the game as a **Specter**:',
      {
        list: [
          'No pawn, no Heart Tokens, no hand and no way to win. Grudges they held are void.',
          `**Mischief:** once per round, in their turn slot, a Specter may play one Instant from the top **${SPECTER_CHOICES}** cards of the discard pile, aimed at any living player. For "you" cards, the target resolves it as if they had drawn it. Global cards work as written.`,
          '**Never damage:** a Specter can\'t pick any Instant that costs Heart Tokens.',
          `The card leaves the game for good. With fewer than ${SPECTER_CHOICES} cards in the discard pile, the Specter skips.`,
        ],
      },
    ],
  },
  {
    id: 'houses-rules', title: 'House Powers',
    blocks: [{
      list: [
        'Every house has a **passive** from Gen I that upgrades at Gen III, and **abilities** or house rules that arrive from Gen I to Gen IV. Each heir keeps everything earlier generations had.',
        'An ability with no stated limit can be used **once per turn, as a free action** that doesn\'t use your action.',
        '**Once-per-game powers:** when you use one (or Stillwater\'s Patience), put a Used token on it on your player board. It stays used when your heir takes over.',
        'Every house has 3 Heart Tokens in each generation, except Agnivansh Gen IV (2).',
        'The full list of every house and generation is below, under **The Eight Houses**.',
      ],
    }],
  },
  {
    id: 'winning', title: 'Winning',
    blocks: [
      '**To be eligible to claim the Throne you need a combined total and a minimum in every pillar:**',
      {
        list: [
          `**2–3 players:** ${S.combined} in total, with at least ${S.minEach} each of Influence, Fear and Wealth.`,
          `**4–8 players:** ${N.combined} in total, with at least ${N.minEach} each.`,
        ],
      },
      {
        steps: [
          '**Claim:** stand on any of the Throne\'s four squares while eligible and declare your claim, at any point in your turn.',
          '**Challenge:** every other eligible player may challenge at once, no travel needed. Each challenge is a fight: the claimant strikes first, then they trade blows (damage = Heart Tokens) until one dies. Block/Deflect cards work; truces don\'t stop it.',
          'Several challengers fight one at a time, in seat order from the claimant\'s left, and the claimant\'s wounds carry over.',
          '**Beat every challenger, or face none, and you win.** If a challenger kills you, your claim fails and your character dies as normal. The challenger doesn\'t win by it: they must claim on a turn of their own.',
        ],
      },
      `Reaching the threshold never forces a claim; it simply unlocks the option.`,
    ],
  },
  {
    id: 'sudden-death', title: 'Sudden Death',
    blocks: [
      `If no one has won by the end of **round ${SUDDEN_DEATH_ROUND}**, the game ends:`,
      {
        steps: [
          'The highest combined total of Influence + Fear + Wealth wins.',
          'Ties go to the highest single pillar, then the most kills, then the most Reckonings.',
          `Still tied: the tied players duel (damage = Heart Tokens, at most ${TUNING.bigTableMaxDamage} at ${TUNING.bigTablePlayers}+ players; the earlier player in turn order strikes first; no Block/Deflect cards) until one is left.`,
        ],
      },
    ],
  },
  {
    id: 'rulings', title: 'Card Rulings',
    blocks: [{
      list: [
        '**Barter cards:** you pick the card you give; the card you get is random unless the card lets you see their hand (Mind Games, Broker\'s Fee).',
        '**Stolen Goods, Black Market Contact:** only Hand Cards can be taken from the discard pile.',
        '**Uneasy Trade:** you choose both resource types.',
        '**Forced Retreat:** they pick any direction that ends farther from you.',
        '**Hidden Path:** teleport to any of the eight house tiles (owned or not), never the Throne.',
        '**Night of Shadows:** everyone discards down to 2; the current player stops drawing this turn.',
        '**Scramble:** Hand Cards are dealt back round-robin, as evenly as possible (at most 3 each).',
        '**Elodie\'s Trial:** the drawer picks any other player to make the optional, blockable 1-damage attack. A tie for fewest Heart Tokens means no effect.',
        '**Duel of Honor:** choose among adjacent players; tied rolls are re-rolled.',
        '**Elodie\'s Sorrow and Elodie\'s Exile** never take anyone below 1 Heart Token.',
        '**Treasure Map:** "Wealth-related" means the card\'s text mentions Wealth.',
        '**Plunder, Vanishing Act:** they wait for your next basic attack (until the end of your next turn). A negated attack uses them up for nothing.',
        '**Golden Harvest** can\'t be played after you have attacked this turn.',
        '**Poisoned Chalice** still costs you 1 Wealth if it\'s countered.',
        '**Bridge the Gap** played before you roll is your move for the turn (with the resource check after it); played after rolling, it just moves you.',
        '**Shadow Strike** can\'t be blocked, and that also rules out Last Stand.',
        '**Last Stand:** you take the hit but stay at 1 Heart Token. **Shield Wall** also protects every other player on your square for the rest of that turn.',
        'An effect that leaves a tie it doesn\'t settle does nothing.',
      ],
    }],
  },
];
