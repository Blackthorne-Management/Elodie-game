// The official rule guide shown in the app and printed: the rulebook written from what the game does (src/data/houses.ts,
// cards.ts, config.ts and the engine; where prose here restates them, they win). Numbers come from src/config.ts so the
// guide always matches the game. The houses and the full card list are drawn from src/data by the guide screen itself.
// Inline **bold** is the only markup.
//
// The booklet is in three parts (rules-decisions 87, no rule change): the CORE rules a first game needs, the APPENDIX
// (everything else: Reactions, lasting cards, the two discard piles, Specters and Sudden Death in detail, rulings,
// two-player modes) and the REFERENCE CARD (printed on the player reference cards: the turn, the ◎ Target cards and
// the lasting-card durations).
import { GRITO_MARKERS, HAND_SIZE, OPENING, ROUND_TRACK, SPECTER_CHOICES, SUDDEN_DEATH_EARLIEST, SUDDEN_DEATH_ROUND, THRESHOLDS, TUNING } from '../config';
import { CARDS } from './cards';
import { HOUSES } from './houses';

export type RuleBlock = string | { list: string[] } | { steps: string[] } | { quote: string };
export type RulePart = 'core' | 'appendix' | 'reference';
export interface RuleSection { id: string; title: string; part: RulePart; blocks: RuleBlock[] }
export const RULE_PARTS: { id: RulePart; title: string; intro: string }[] = [
  { id: 'core', title: 'Core rules', intro: 'Everything a first game needs.' },
  { id: 'appendix', title: 'Appendix', intro: 'The details: look them up when they come up in play.' },
  { id: 'reference', title: 'Reference card', intro: 'Printed on every player\'s reference card.' },
];

const S = THRESHOLDS.small, N = THRESHOLDS.normal;
// Kay Soley's own claim numbers (Rit Solèy), from the thresholds and its house data.
const ksCut = (g: 1 | 3) => HOUSES.kaysoley.claimReduction?.(g) ?? 0;
const KAY_SOLEY_NUMBERS = `**Kay Soley** is eligible at ${S.combined - ksCut(1)} total (${S.combined - ksCut(3)} from Gen III) with 2–3 players, and ${N.combined - ksCut(1)} (${N.combined - ksCut(3)} from Gen III) with 4 or more; the per-pillar minimum is unchanged.`;
const truce = OPENING.truceRounds;
const truceText = truce === 1 ? 'the first round' : `the first ${truce} rounds`;
const big = `${TUNING.bigTablePlayers}+ players`;
const heartCap = TUNING.bigTableHeartCap;
const names = (ids: number[]) => ids.map(id => CARDS[id - 1].name).join(', ');
const targetCards = CARDS.filter(c => c.targets).map(c => c.id);
const brasadorLegacy = HOUSES.brasador.legacyPassive?.text ?? HOUSES.brasador.passiveText[0];

// The two ways to play with two players (rules-decisions 82, 87), shared by the rule guide and the setup screens.
export const TWO_PLAYER_MODES = {
  race: {
    name: 'Race',
    short: 'Houses as usual, often far apart: a quick race to the Throne.',
    text: 'Houses are drawn (or picked) as usual, so the two of you often start on opposite sides of the realm. You rarely meet: in about 4 games in 10 no one dies, and whoever is first able to claim usually wins. Fast and light.',
  },
  battle: {
    name: 'Battle',
    short: 'Your houses are neighbours: you clash from the start. The die picks the second house.',
    text: 'Your two houses are **neighbours** on the board. The first player\'s house is drawn or picked; the second house **always comes from the die**, whether the table drew or picked: 1–3 the neighbour anticlockwise, 4–6 the one clockwise. The second player never chooses. You fight over the same ground from the first turns: about half as many deaths again as a Race, and only about 3 games in 10 without one. Longer and bloodier; the Throne race still matters.',
  },
} as const;

const CORE: Omit<RuleSection, 'part'>[] = [
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
        '**Eight houses**, each with four generation cards (Gen I to IV) and a player board.',
        '**The Shared Action Deck:** 126 cards, 71 Hand Cards and 55 Instants.',
        '**Heart Tokens** (your life, and also your attack strength), **resource tokens** for each pillar and **Grudge Tokens**, plus pawns, dice, markers and a score grid (see Components in Detail).',
        'For **2 to 8 players**, best with 3 to 6. **60 to 150 minutes:** about 20 minutes per player. For a first game, play with 3 to 5.',
      ],
    }],
  },
  {
    id: 'setup', title: 'Setup',
    blocks: [{
      steps: [
        '**Houses:** by lottery, unless every player agrees to pick (see Choosing Houses). Shuffle one Grudge Token of each house face down; each player draws one blind. That is your house for the game. **Two players** first choose Race or Battle (see Two Players).',
        'Take your house\'s generation cards with **Gen I** on top, and Heart Tokens equal to its Gen I Heart Tokens.',
        'Place all eight house tiles, whatever the player count. **A house not in the game leaves its tile unowned: anyone may farm it.**',
        'Put your pawn on your house\'s own tile. House Yaguana draws its Legacy card (see House Powers).',
        `Shuffle the deck and deal everyone **${HAND_SIZE} Hand Cards**. Any Instant drawn in this deal is shuffled back and replaced.`,
        '**First player:** if a player named Elodie (or Lolo or Lodie) is playing, she always goes first. Otherwise everyone rolls the die and the highest roll goes first (re-roll ties). Play then goes **clockwise** around the table, in seating order, for the whole game.',
        `**The round track:** round token on square 1, **Sudden Death token on square ${SUDDEN_DEATH_ROUND}** (for a shorter or longer game, the table may agree on any square from ${SUDDEN_DEATH_EARLIEST} to ${ROUND_TRACK}). The first player keeps the round all game: they move the round token each round and call Sudden Death when the marked round ends with no winner.`,
      ],
    }],
  },
  {
    id: 'turn', title: 'Your Turn',
    blocks: [
      'On your turn, in this order:',
      {
        steps: [
          '**Move.** Roll the die and move **up to** that many squares, stepping up, down, left or right (**no diagonal steps**). Turn as often as you like, stop early or stay put. Pawns never block each other. You may pass over the Throne, but **you may end your move on the Throne only while you are eligible to claim**.',
          '**Resource check.** If you stopped on a resource tile, you may gain from it.',
          '**One action.** Attack a rival beside you, **or** play one Hand Card, **or** offer a trade: 1 of your resources for 1 of a different kind of theirs, at any distance; they may refuse. Only one. You may also do nothing.',
          `**Draw back up to ${HAND_SIZE}.** Instants resolve the moment you draw them and are replaced.`,
        ],
      },
      '**Free extras:** your house abilities don\'t use your action (each can be used once per turn unless it says otherwise), and you may **claim the Throne** at any point in your turn while standing on it and eligible.',
      `**Opening truce:** no attacks of any kind during ${truceText}.`,
      'A **round** is every player taking one turn. **The first player keeps the round** (see Setup).',
    ],
  },
  {
    id: 'first-turns', title: 'Your First Three Turns',
    blocks: [{
      list: [
        '**Your own tile pays nothing.** Your first score comes from a rival\'s tile.',
        '**The nearest rival tile is about 8 or 9 squares away,** so most players first score on **turn 3**. Turns 1 and 2 are for moving, and for the cards that need no tile.',
        '**Movement cards are played after you move** (a Hand Card is your action, and it comes after the roll). They never trigger a resource check: they can\'t score a tile.',
        `**"Protected" stops attacks only.** The opening truce (${truceText}), a new heir's shield and the Throne stop attacks; they don't stop Hex of Withering, Poisoned Chalice or Instants and events.`,
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
          '**No hidden resources.** Everyone\'s Influence, Fear and Wealth are public, and any player may ask your exact totals at any time. Hands and the draw pile stay hidden.',
        ],
      },
    ],
  },
  {
    id: 'cards-basics', title: 'Cards',
    blocks: [{
      list: [
        `**Hand Cards** are held, up to **${HAND_SIZE}**, and you play one as your action. They give resources, attack from range, disrupt rivals, move you, swap cards, call truces or block attacks.`,
        '**Instants** resolve the moment they are drawn and are never held. Ten are Elodie herself, and carry her mark.',
        '**Block/Deflect cards** answer an attack, on anyone\'s turn. **Reactions** are played only on another player\'s turn, at the moment printed on them. Neither uses your action.',
      ],
    }],
  },
  {
    id: 'combat', title: 'Combat',
    blocks: [
      {
        list: [
          '**Attack** a rival on your square or on one of the four squares beside you (not diagonal). Attacking is your action and **ends your turn**; you still draw back up.',
          '**Damage equals your current Heart Tokens.** A wounded fighter hits weaker. Bonuses add to it: Agnivansh +1 on basic attacks, La Marca, Dread Banner, Marked for Death and Brasador\'s downside.',
          `**Big tables (${big}): your Heart Tokens count as at most ${heartCap} when you deal damage.** Bonuses still add.`,
          'One basic attack per turn. Attack cards (Cursed Dagger, Shadow Strike) are separate.',
          'At 0 Heart Tokens your character dies (see Death and Succession). If you die on your own turn, your turn ends.',
        ],
      },
      '**Protected from attacks:**',
      {
        list: [
          `**Everyone** during the opening truce (${truceText}).`,
          '**A new heir,** until the end of their first turn.',
          '**A player eligible to claim who stands on the Throne:** no one can attack them there, they can\'t attack from there and they can\'t die there (other Heart Token loss stops at 1). Eligible means that player\'s own number: Kay Soley needs less (see the reference card). **Anyone else on the Throne gets no protection.** You can only end your own move there while eligible, but a rival\'s card may still put you there.',
          'Challenge fights for the Throne ignore all of these.',
        ],
      },
    ],
  },
  {
    id: 'death', title: 'Death and Succession',
    blocks: [
      'When a character reaches 0 Heart Tokens:',
      {
        steps: [
          '**Reckoning first:** if the killer\'s family holds a Grudge against the dying player, the killer takes the Reckoning bonus now, **before anything is halved** (see Reckoning below).',
          'The dying player loses **half (rounded down) of one pool** of their choice holding 2 or more (if none holds 2, nothing is lost). (House Yaguana\'s **Areíto**: from Gen II, Yaguana loses nothing here.)',
          '**Grudge:** their family now holds a Grudge against the killer (unless this kill was a Reckoning).',
          'The next generation card is turned up: the heir keeps every earlier ability and gains a new one.',
          'Take Heart Tokens for the new generation. The heir rises on the house\'s own tile, protected from attacks until the end of their first turn.',
        ],
      },
      '**Grudge Tokens:** when someone kills your character, they hand you one of their Grudge Tokens (their crest). Keep it in front of you: your family now holds a Grudge against them.',
      '**Reckoning:** killing a player your family holds a Grudge against settles it. Give their Grudge Token back, and no new Grudge is created: the feud is over. **The Reckoning bonus: take 1 Influence, 1 Fear and 1 Wealth** from the player you killed (see Death in Detail).',
      'When a **Gen IV** character dies, the bloodline has ended: that player becomes a **Specter**, with no pawn, hand or way to win, but a little mischief each round (see The Specter in Detail).',
    ],
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
          '**Challenge:** going clockwise from the claimant\'s left, each other eligible player declares a challenge or passes (no travel needed); then the fights run in that order. Each is a fight: the claimant strikes first, then they trade blows until one dies. Block/Deflect cards work; truces don\'t stop it.',
          '**Beat every challenger, or face none, and you win.** If a challenger kills you, your claim fails and your character dies as normal. The challenger doesn\'t win by it: they must claim on a turn of their own.',
        ],
      },
      'Reaching the threshold never forces a claim; it simply unlocks the option.',
      `**Sudden Death:** if no one has won by the end of **round ${SUDDEN_DEATH_ROUND}** (or the agreed round: the round token has reached the Sudden Death token), the first player calls it: the highest combined total of Influence + Fear + Wealth wins (ties: see Sudden Death in Detail).`,
    ],
  },
];

const APPENDIX: Omit<RuleSection, 'part'>[] = [
  {
    id: 'components-detail', title: 'Components in Detail',
    blocks: [{
      list: [
        '**The deck:** 71 Hand Cards (including 8 Block/Deflect cards and 6 Reactions) and 55 Instant/Event cards. Hand Cards marked **◎** are **Target cards** (see The Deck in Detail).',
        '**Resource tokens** for Influence, Fear and Wealth. Each token shows **1** on one side and **5** on the other. Exchange five 1s for one 5 (or back) with the supply whenever you like, so you never need more than a handful of each. The supply is unlimited: if a kind of token runs out, use anything as a stand-in.',
        '**Grudge Tokens:** 40, five per house, with the house crest. They are also the lottery tiles for drawing houses.',
        `**Reminder markers:** 8 new-heir shields, 1 La Marca brand, ${GRITO_MARKERS} Grito de Guerra markers, 8 Specter markers and 8 Used tokens (once-per-game powers).`,
        `**8 Legacy cards,** one per house, each showing that house's Gen I passive (for House Yaguana's Ancestor's Voice and Song of Coaybay). Brasador's Legacy card reads "${brasadorLegacy.replace(/\.$/, '')}" from the start.`,
        `**Pawns, 2 dice, the round token and the Sudden Death token,** and the round track (1 to ${ROUND_TRACK}) printed on the board.`,
        '**The score grid** (on the back of the reference cards; one is enough per game): one column per player for **kills** and **Reckonings**. Sudden Death, Reinado de Cenizas and Elodie\'s Reckoning read it. Tick a kill or a Reckoning the moment it happens.',
        '**Reference cards:** one per player, with the turn, the ◎ Target cards and how long lasting cards stay out (see Reference Card).',
      ],
    }],
  },
  {
    id: 'choosing-houses', title: 'Choosing Houses',
    blocks: [
      '**First, vote: lottery or pick?** Ask the table. If **every** player agrees, players pick their houses; **one "no" and it is the lottery** (seven yeses and one no is still the lottery). To pick, everyone rolls the die: the highest roll picks first (ties re-roll), then picking goes **clockwise** from that player. Picking first is an advantage, which is why it must be unanimous and decided by the dice.',
      '**The lottery:** take one Grudge Token of each house, shuffle them face down, and each player draws one blind.',
    ],
  },
  {
    id: 'two-players', title: 'Two Players: Race or Battle',
    blocks: [
      'With two players, agree before drawing houses which game you want. Both use every other rule unchanged.',
      { list: [
        `**${TWO_PLAYER_MODES.race.name}:** ${TWO_PLAYER_MODES.race.text}`,
        `**${TWO_PLAYER_MODES.battle.name}:** ${TWO_PLAYER_MODES.battle.text}`,
      ] },
      'Can\'t agree? Play Race. With three or more players there is no choice: houses are drawn or picked as usual.',
    ],
  },
  {
    id: 'move', title: 'Moving in Detail',
    blocks: [{
      list: [
        'Hand Cards can\'t be played before you move. At the start of each round, the first player moves the round token one space along the round track on the board.',
        'A roll of 3 can be two up and one right. Distances are always counted in up/down/left/right steps.',
        'Every square can be walked on, sea included, and any number of pawns may share a square.',
        '**Play on the grid only.** The 18 × 18 grid is the whole play area: the ocean and islands outside it are scenery, and no move may leave the grid.',
        'Extra movement from a card moves you straight away, with no second resource check, so a card never scores a tile.',
        'Some cards name a straight line or a direction (Forced March, Forced Retreat, Suzumori\'s Ayatsuri); those keep to it.',
        '**The Throne:** you may not **end** your own move on the Throne unless you are eligible to claim: not your roll-and-move, extra moves, your own movement cards, the steps an Instant offers you, or your house abilities. Passing through is fine, and staying where you are is always allowed. Under Ayatsuri the puppeteer picks the direction but you still pick where you stop. **A rival\'s card or effect may still put you there** (Forced March, Forced Retreat); you get no protection unless eligible. For example, Forced March may march you onto the Throne: you stop there, and get no protection unless eligible.',
      ],
    }],
  },
  {
    id: 'trade', title: 'Trading and Resources',
    blocks: [{
      list: [
        'As your action, offer one other player **1 of your resources for 1 of a different kind** of theirs, at any distance.',
        'They accept or refuse. Nothing changes hands without their yes.',
        'The offer is your action either way, and you may make one offer per turn. Specters can\'t trade.',
        'Barter cards (which swap cards) and Uneasy Trade (a forced trade) are separate: they are played as cards.',
        'Keep your resource tokens in plain view. When asked your exact totals, you must answer truthfully.',
        'Totals never drop below 0. Stealing from an empty pool gives nothing.',
        'Wealth is the scarcest pillar (only two Trade tiles), so the deck holds more cards that give Wealth.',
      ],
    }],
  },
  {
    id: 'cards', title: 'The Deck in Detail',
    blocks: [
      {
        list: [
          '**Reaction cards** are Hand Cards played only on another player\'s turn, at the moment printed on them (see Reactions).',
          '**Instants** bring dice chaos, global effects and targeted strikes. **Elodie\'s cards:** ten Instants are the goddess acting herself. They play like any other Instant and carry her mark.',
          `**Hand limit:** you can never hold more than ${HAND_SIZE} Hand Cards, even for a moment. If anything would put you over, discard down at once; those discards go to the bottom of the Hand Card discard pile.`,
          '**Two discard piles:** Hand Cards go face down to the **Hand Card discard pile**; Instants go to the **Instant discard pile**, which may be kept face up. Each is one stack, in order: the top card is the one most recently discarded. Never shuffle them, except to make a new draw pile.',
          '**When the draw pile is empty,** shuffle **both** discard piles together into a new one and keep drawing. If both are empty too, stop drawing until cards are discarded.',
          '**Who reads which pile:** a Specter picks from the top 5 of the Instant pile. Black Market Contact and Treasure Map use the Hand Card pile.',
          `**Always back to ${HAND_SIZE}.** Whenever you play a card, on your own turn or someone else's (a Block, Reaction or Counterspell), draw back up to ${HAND_SIZE} as soon as that action is over. Instants drawn this way resolve as usual. Cards taken from you in other ways (stolen, discarded, swapped) are replaced at the end of your own turn.`,
          '**◎ Target cards:** the Hand Cards that name one player to suffer their effect carry the ◎ mark (listed on the reference card). Only these can be answered by **Counterspell** or **Turnabout**. Attack cards are answered by Block cards instead.',
          '**Barter cards** are the cards marked Barter (Black Market Deal, Traveling Merchant, Uneasy Trade, Stolen Goods, Fair Exchange, Black Market Contact, Broker\'s Fee). Embargo can cancel them.',
        ],
      },
      '**Lasting cards stay out until they end.** These cards are not discarded when played: leave the card face up in front of the player it affects (for a truce, between the two players) and discard it the moment its effect ends. How long each one lasts is on the reference card. **When a character dies,** discard the lasting cards on them, **except** truces, Ceasefire and Golden Harvest, which carry over to the heir.',
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
          '**Interference:** when a rival plays a Hand Card as their action, cancel it (never a Block, Counterspell or Reaction). It is discarded with no effect and their action is spent. **A card aimed at a player is played face up and its target is named first;** then anyone may say "Wait!" and Interfere, knowing who it was aimed at.',
          '**Ambush:** when a rival ends their roll-and-move on or next to your square, attack them at once for **1 damage**, before their resource check. Only where an attack is allowed; they may Block it.',
          '**Turnabout:** when a ◎ Target card targets you, it targets another player of your choice instead. Counterspell is offered first. **The new target may not Counterspell or Turnabout it.**',
        ],
      },
      '**Say "Wait!"** To play a Reaction (or a Block or Counterspell), call out "Wait!" or "Stop!" at its moment. Everyone pauses while you play it. Once the active player has moved on to the next step, the moment has passed: you can\'t go back.',
      '**Ill Omen** is played after the die is rolled and everyone has seen the number, before the pawn moves.',
      '**Timing:** if more than one player calls at the same moment, the first in seat order after the acting player plays; the first Reaction played closes that moment. A Reaction can\'t be cancelled by another Reaction or a Counterspell, but the attack an Ambush makes can be Blocked like any attack.',
    ],
  },
  {
    id: 'combat-detail', title: 'Combat in Detail',
    blocks: [
      {
        list: [
          '**Block/Deflect cards** are played whenever you are attacked, on anyone\'s turn (yours too: a claimant blocks a challenger\'s blow, and an Ambushed player blocks on their own turn). They don\'t use up your action. **Counterspell** answers a **◎ Target card** played on you, never an attack.',
          `**Big tables (${big}):** the Heart Token limit of ${heartCap} covers basic attacks, Challenge blows and the Sudden Death duel; the bonuses (Agnivansh +1, La Marca, Dread Banner, Marked for Death, Brasador's downside) still add on top. Attack cards deal what they print (Cursed Dagger and Shadow Strike: 1). Heart Token loss that isn't an attack is never limited.`,
          '**New heirs:** if they fell on their own turn, the protection lasts through their next turn. Challenges and non-attack effects still apply. A shield shows beside their name.',
          '**The Throne:** a player who drops below their number while standing there loses its protection at once.',
          `**Opening truce:** no attacks of any kind (basic, card or Reaction) during ${truceText}. Challenges are not affected.`,
        ],
      },
      '**What counts as an attack:** basic attacks, Cursed Dagger, Shadow Strike, Elodie\'s Trial and Challenge fights. Hex of Withering, Poisoned Chalice, Duel of Honor and Heart Token loss from global or fate effects are not attacks.',
      '**Kill credit:** you get the kill when your attack, card or ability caused the death (including Hex, Poisoned Chalice, winning a Duel of Honor, the attacker in Elodie\'s Trial, and Riposte). Deaths from global, fate or self effects have no killer.',
    ],
  },
  {
    id: 'death-detail', title: 'Death in Detail',
    blocks: [
      '**What the heir keeps:** your hand, your remaining resources, your Grudges, your kills (and Reckonings) and La Marca. Lasting cards on the fallen character are discarded, except truces, Ceasefire and Golden Harvest. Tick the kill on the score grid.',
      'You can hold several Grudges, even more than one against the same player; a Reckoning settles one.',
      {
        list: [
          '**The Reckoning bonus:** for any of Influence, Fear and Wealth the player you killed has none of, take 1 from a pool they still have instead (your choice), so you take 3 in all when they hold at least 3.',
          '**The bonus is taken BEFORE the death halving, never after.** First the avenger takes their 3, then the dying player halves one pool of their choice from what is left.',
          '**Example:** you avenge yourself on a player holding 2 Influence, 5 Fear and 0 Wealth. You take 1 Influence, 1 Fear and, since they have no Wealth, 1 more Fear (your choice). They are left with 1 Influence and 3 Fear, then halve one pool: halving Fear leaves them 1 Influence and 2 Fear.',
          'Stillwater\'s Patience (from Gen III) can cancel the whole bonus.',
        ],
      },
    ],
  },
  {
    id: 'specter', title: 'The Specter in Detail',
    blocks: [
      'When a Gen IV character dies, the bloodline has ended, but the player stays in the game as a **Specter**:',
      {
        list: [
          'No pawn, no Heart Tokens, no hand and no way to win. Grudges they held are void.',
          `**Mischief:** once per round, in their turn slot, a Specter may play one Instant from the top **${SPECTER_CHOICES}** cards of the **Instant discard pile**, aimed at any living player. Draw those cards, look, play one and put the rest back on top in the same order. For "you" cards, the target resolves it as if they had drawn it. Global cards work as written.`,
          `**Never damage:** a Specter can't pick an Instant that costs Heart Tokens: ${names(CARDS.filter(c => c.noSpecter).map(c => c.id))}.`,
          `The card leaves the game for good. With fewer than ${SPECTER_CHOICES} cards in the Instant discard pile, the Specter skips.`,
          'Put a Specter marker on the player board.',
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
        '**Once-per-game powers:** when you use one (or Stillwater\'s Patience, from Gen III), put a Used token on it on your player board. It stays used when your heir takes over.',
        'Every house has 3 Heart Tokens in each generation, except Agnivansh Gen IV (2).',
        '**House Yaguana\'s Legacy:** at setup, shuffle the Legacy cards of the houses not at the table (all the others when eight play) and draw one blind: its Ancestor\'s Voice. A Legacy card is read as printed; Brasador\'s works from the start.',
        `**Grito de Guerra** uses the ${GRITO_MARKERS} Grito markers: put one on the player you silence, and take it back when their next Fear gain is skipped (or their character dies). A marker stays on its target even if Brasador's own character has fallen in the meantime. A player carries at most one. With every marker out, Grito de Guerra waits until one comes back.`,
        '**Guaíza** (Yaguana) copies a passive at the strength the copied player has it (their Gen III upgrade included), with its own limits (once per turn, per round or per heir), counted for the Yaguana player.',
        '**Ayatsuri** (Suzumori) pulls two strings, each lasting until it is used: the direction of the player\'s next move, and the player named by their next attack **or** card, whichever comes first. That covers every card that names a player, friendly or hostile, not only ◎ Target cards: Suzumori chooses who shares a Fair Exchange, a truce or Shared Purpose. **Your house powers and trade offers are still yours.** The strings end when the puppet\'s character dies, and are cut if Suzumori\'s own bloodline has ended.',
        'The full list of every house and generation is below, under **The Eight Houses**.',
      ],
    }],
  },
  {
    id: 'challenges', title: 'Challenges in Detail',
    blocks: [{
      list: [
        '**Challenge blows count as basic attacks for bonuses:** damage = Heart Tokens, plus Agnivansh +1, La Marca, Dread Banner, Marked for Death and Brasador\'s downside (Agnivansh\'s step after landing doesn\'t apply).',
        'Several challengers fight one at a time, in the order they declared, and the claimant\'s wounds carry over.',
      ],
    }],
  },
  {
    id: 'sudden-death', title: 'Sudden Death in Detail',
    blocks: [
      `If no one has won by the end of **round ${SUDDEN_DEATH_ROUND}** (or the round the table agreed, ${SUDDEN_DEATH_EARLIEST} to ${ROUND_TRACK}), the game ends:`,
      {
        steps: [
          'The highest combined total of Influence + Fear + Wealth wins.',
          'Ties go to the highest single pillar, then the most kills, then the most Reckonings (from the score grid).',
          `Still tied: the tied players duel (damage = Heart Tokens with **no bonuses**, Heart Tokens counting as at most ${heartCap} at ${big}; the earlier player in turn order strikes first; no Block/Deflect cards). With three or more, the earliest seat fights the next; the winner fights on with the Heart Tokens they have left.`,
        ],
      },
    ],
  },
  {
    id: 'rulings', title: 'Card Rulings',
    blocks: [{
      list: [
        '**Barter cards:** you pick the card you give; the card you get is random unless the card lets you see their hand (Mind Games, Broker\'s Fee).',
        '**Stolen Goods:** a plain theft; the robbed player gets nothing back until they draw up at the end of their own turn.',
        '**Market Day:** an Instant among the two cards drawn resolves as usual and counts as one of them; keep the Hand Card.',
        '**Uneasy Trade:** you choose both resource types, and they must be different.',
        '**Forced Retreat:** they pick any direction that ends farther from you.',
        '**Hidden Path:** teleport to any of the eight house tiles (owned or not), never the Throne.',
        '**Bridge the Gap:** any square within 5, but not the Throne unless you are eligible to claim.',
        '**Night of Shadows:** everyone discards down to 2; the current player stops drawing this turn.',
        '**Scramble:** Hand Cards are dealt back round-robin, as evenly as possible (at most 3 each).',
        '**Elodie\'s Trial:** the drawer may pick any player (themselves included, but not the weakest) to make the blockable 1-damage attack. A tie for fewest Heart Tokens means no effect.',
        '**Duel of Honor:** you choose among adjacent players; tied rolls are re-rolled.',
        '**Elodie\'s Sorrow and Elodie\'s Exile** never take anyone below 1 Heart Token.',
        '**Treasure Map:** "Wealth-related" means the card\'s text mentions Wealth.',
        '**Plunder, Vanishing Act:** they wait for your next basic attack (until the end of your next turn). A negated attack uses them up for nothing.',
        '**Golden Harvest** can\'t be played after you have attacked this turn.',
        '**Poisoned Chalice** still costs you 1 Wealth if it\'s countered.',
        '**Shadow Strike** can\'t be blocked, and that also rules out Last Stand.',
        '**Last Stand:** you take the hit but stay at 1 Heart Token. **Shield Wall** also protects every other player on your square for the rest of that turn.',
        '**Steadfast** heals only up to your generation\'s Heart Tokens.',
        'An effect that leaves a tie it doesn\'t settle does nothing.',
      ],
    }],
  },
];

const REFERENCE: Omit<RuleSection, 'part'>[] = [
  {
    id: 'reference', title: 'Reference Card',
    blocks: [
      '**Your turn:**',
      {
        steps: [
          '**Move** up to your roll (not ending on the Throne unless eligible).',
          `**Resource check:** ${TUNING.tileAlone} alone, ${TUNING.tileShared} shared; never your own tile or the tile you scored last.`,
          '**One action:** attack, **or** a Hand Card, **or** a trade offer.',
          `**Draw back up to ${HAND_SIZE}.**`,
        ],
      },
      'Free at any time in your turn: house abilities, and a claim while on the Throne and eligible.',
      KAY_SOLEY_NUMBERS,
      `**◎ Target cards** (answered by Counterspell or Turnabout): ${names(targetCards)}.`,
      '**Lasting cards stay out:**',
      {
        list: [
          '**Until it is used:** Hex of Withering, Confusion, Forced March, Dread Banner, Marked for Death.',
          '**Through the affected player\'s next turn:** Sabotage, Burn the Village, Golden Harvest (also this turn).',
          '**Until your next basic attack** (at most until the end of your next turn): Plunder, Vanishing Act.',
          '**Truces, counted in your own turns:** Uneasy Truce, Ceasefire and Kay Soley\'s Sèman Lapè end when your next turn starts; Blood Pact when your turn after next starts.',
          '**Until the end of the turn:** Shield Wall.',
        ],
      },
    ],
  },
];

export const RULES: RuleSection[] = [
  ...CORE.map(s => ({ ...s, part: 'core' as const })),
  ...APPENDIX.map(s => ({ ...s, part: 'appendix' as const })),
  ...REFERENCE.map(s => ({ ...s, part: 'reference' as const })),
];
