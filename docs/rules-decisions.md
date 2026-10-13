# Rules decisions (approved)

These settle every gap found in `rules-questions.md`. Where this file and the three source documents
differ, **this file wins**. Numbers in brackets refer to the question list.

## Board and setup
- **Tile types [1]:** War = Brasador, Ironvow, Agnivansh. Trade = Dorini, Yaguana. Court = Kay Soley,
  Suzumori, Stillwater.
- **Layout [2]** (columns and rows 1–18, as on the board picture):
  - Throne: the centre 2×2, columns 9–10 × rows 9–10. It counts as one tile.
  - Brasador (War): column 9, row 1
  - Kay Soley (Court): column 15, row 4
  - Dorini (Trade): column 18, row 10
  - Ironvow (War): column 15, row 15
  - Suzumori (Court): column 10, row 18
  - Agnivansh (War): column 4, row 15
  - Stillwater (Court): column 1, row 9
  - Yaguana (Trade): column 4, row 4
- **Squares [3]:** every grid square is a space. The 8 house squares and the Throne are the "tiles".
  Players on the same square are adjacent.
- **First player [4]:** random in solo; the host picks in multiplayer.

## The board
- **Every square of the 18×18 grid can be walked on,** water included (changed after playtesting). Pawns can't
  leave the grid. The painted continent and its seas are scenery.
- An optional setting can make chosen squares impassable (`BOARD.land` in `src/config.ts`). It's switched off; while
  it was on, moves went around the sea and every seat kept its distances. Its tests run on a sample map.

## Turn and movement
- **Movement [5–7]** (changed after Phase 1): roll a d6 and move **up to** that many squares in total,
  stepping up/down/left/right and turning as often as you like (a 3 can be 2 up and 1 right). 0 is
  allowed. No diagonals; pawns never block; you can't leave the board. This replaces the rulebook's
  straight-line rule. Cards that name a straight line or a direction keep it: Forced March (full roll in
  the chosen direction), Forced Retreat (2 spaces in a straight line) and Suzumori's Marionette (chosen
  direction, straight line). Bridge the Gap is simply "move to any square within 8".
- **Your action [8]** (changed after Phase 1): after moving and the resource check, you take **one action:
  attack a rival beside you, or play one Hand Card** (or neither). Not both. Hand Cards can't be played before
  you move. House abilities are free extras and don't use your action; claiming the Throne is separate.
- **Extra movement [9]:** cards are played after moving, so extra movement moves you up to that many more
  squares straight away (any path). There is no second resource check.
- **Distances [10]:** counted in orthogonal steps (up/down/left/right).
- **Resource check [11]** (changed after Phase 1): happens once, right after your move. **Your next score must
  come from a different tile than your last one**, however many turns pass; you can't step off and back on.
  Your heir starts fresh (death clears it). The Throne gives nothing.

## Resources and information
- **Resource totals are public [12].** Everyone always sees everyone's Influence, Fear and Wealth.
  Hands and the draw pile stay hidden.
  - **Card change, Elodie's Gaze (90):** "Every player reveals their hand to the table." (Flavor line
    unchanged.)
  - **House change, Suzumori III:** the passive upgrades to "view two players' hands once per round".
- **Floors [13]:** totals never go below 0; stealing from 0 gives nothing.
- **Tile yield** (changed after simulation): a tile pays **3** when you're alone on it and **2** when you share it
  (rulebook: 2 / 1). Travel to other lands now pays enough to matter.

## Combat
- **One basic attack per turn [14].** Attack cards are separate.
- **Attacking ends your turn** (changed after Phase 1). The attack is your action; you still draw back to 3.
  - Dorini IV's Golden Bazaar gives one extra action (attack, card or trade offer); it costs 3 Wealth ([64]). Agnivansh IV's Endless War lets one
    attack action be up to 3 attacks. The turn ends after the last.
  - Ironvow's Raider's Charge (Gen II+): attack before moving (that's your action), then still move.
  - **Cards rewritten for "card or attack"** (they assumed you attack in the same turn as playing them):
    - *Plunder (26):* "Until the end of your next turn: when your next basic attack lands, gain 1 Wealth for
      each Heart Token of damage it dealt (max 2)." A negated attack uses it up for nothing.
    - *Vanishing Act (45):* "Until the end of your next turn: after your next basic attack resolves, move 1
      space as a free action."
    - *Golden Harvest (24):* "Gain 2 Wealth, but you may not attack this turn or on your next turn."
    - With an extra action (Dorini IV), attacking first and then playing Plunder or Vanishing Act still pays
      out at once, as before.
- **"Attacks" [15]** (for Block/Deflect, truces, Dread Banner and Marked for Death): basic attacks,
  Cursed Dagger, Shadow Strike, Elodie's Trial and Challenge fights. Hex of Withering, Poisoned
  Chalice, Duel of Honor and self/global HP loss are not attacks.
- **Kill credit [16]:** a player gets the kill if their card or ability caused it (Cursed Dagger, Hex,
  Poisoned Chalice, the winner of Duel of Honor, the attacker in Elodie's Trial, Riposte). Deaths from
  global, fate or self effects have no killer: no Grudge Token and no kill credit.
- **Dying on your own turn [17]:** your turn ends immediately.
- **Block/Deflect [18–19]:** played only in response to an attack (Counterspell: to a Hand Card
  targeting you). It doesn't use up your own turn's card play.
- **Last Stand [20]:** you take the hit but stay at 1 HP.
- **Shield Wall [21]:** every other player on your square is also protected for the rest of that turn.

## Death, Grudges and succession
- **Grudges [22–23]:** the dead player's family holds a Grudge against the killer. A Reckoning is
  killing a player your family holds a Grudge against. You can hold several Grudges, even more than
  one against the same player; a Reckoning settles one.
- **Reckoning order [24]** (replaced by [71]): the Reckoning bonus is taken **before** the dying player halves a pool.
- **Becoming a Specter [25]:** the hand is discarded.
- **New heirs are protected** (added after playtesting): a new heir can't be attacked until the end of their first
  turn. If the character fell on their own turn, the protection lasts through their next turn. "Attacks" are those
  in [15]: basic attacks, Cursed Dagger, Shadow Strike and Elodie's Trial. Two exceptions:
  - Challenge fights still happen.
  - Effects that aren't attacks still apply, such as Hex of Withering, Poisoned Chalice, Duel of Honor and global
    Heart Token loss.
  
  Shown with a shield beside the player's name. It's a setting (`NEWBORN_PROTECTION`).

## Houses
- **Ability frequency [26]:** an active ability with no stated limit can be used once per your own
  turn, as a free action that doesn't use your card play.
- **Activation costs [27], redesigned:**
  - Ironvow III: your basic attack also reaches a player 2 squares away in a straight line.
  - Agnivansh I: your basic attacks deal +1 damage.
  - Agnivansh IV, Endless War: once per game, make up to 3 basic attacks in one turn.
- **Ironvow I [28]:** +1 to your movement roll.
- **Yaguana's Legacy [29]:**
  - A Legacy is another house's Gen I passive.
  - Gen I: when your character dies, your heir picks a Legacy from any house that has lost at least
    one character this game (including your own). You hold one Legacy at a time; a new one replaces
    the old.
  - Gen III: draw 2 eligible Legacies at random and pick one.
  - Gen IV: permanently gain a second passive copied from a house that has become a Specter (taken as
    soon as one does, if none has yet).
- **"Trade actions" / "court actions" [30]:** gaining Wealth from a Trade tile / Influence from a
  Court tile.
- **Suzumori I [31]:** once per round.
- **Stillwater I/III [32]:** one use in Gen I–II; from Gen III, one more use (two total).
- **Stillwater II [33]** (tightened by [62]): the Long Watch needs a turn with **no action at all**: no attack,
  no Hand Card and no trade offer (and nothing aggressive, such as an ability that hurts a rival).
- **Heart Tokens** (changed after simulation, replaces [34]): every house has **3** in every generation, except
  Agnivansh IV = 2 (Stillwater IV went back from 4 to 3 in [62]). Attack damage equals your Heart Tokens, so the old tables (2 to 4)
  counted HP twice and decided most games; houses now differ through their abilities.
- **Brasador downside [35]:** +1 damage to attacks against Brasador when Brasador is Gen III+ and has
  strictly the most Fear.
- **Brasador [36]:** La Marca marks one player at a time (until they die or you mark another). Grito
  de Guerra cancels the target's next Fear gain. Reinado de Cenizas counts kills by all your
  generations.
- **Ironvow II [37]:** your basic attack may come before your move.
- **Dorini IV [38]:** one extra Hand Card play and one extra basic attack this turn.
- **Agnivansh II/III [39]:** half-move = roll a d6, move half (rounded up) in a straight line.
  "Win a combat" = your attack lands.
- **Suzumori IV [40]:** you choose the direction of the target's next move and the target of their next
  attack or targeted card.
- **Kay Soley II [41]:** the truce lasts 2 rounds.

## Winning
- **Challenge fights [42]:** the **claimant strikes first**, then they trade blows until one dies.
  Block/Deflect cards work. Several challengers are fought one at a time in seat order from the
  claimant's left, and the claimant's damage carries between fights. First striker is a setting.
- **The Throne is a sanctuary** (added after playtesting). On its four centre squares:
  - **No attacks onto or off them.** That covers every attack, ranged ones included: basic attacks, Ironvow's reach,
    Cursed Dagger, Shadow Strike and Elodie's Trial. A blocked attack is simply never offered: you lose no action
    and no card, and an attack card with no legal target can't be played.
  - **No one dies there.** Any other Heart Token loss (Hex, Poisoned Chalice, Duel of Honor, Elodie's cards…) stops
    at 1.
  - **Challenge fights for the Throne are the exception:** the claimant can still be fought, and can still fall.
  - The Sudden Death tie-break isn't fought on the board, so it's unaffected. This is a setting (`THRONE_SANCTUARY`).
- **Claims [43]:** at any point on your turn while on the Throne and eligible at that moment.
- **Kay Soley IV [44]:** the combined total drops by 2; the per-pillar minimum doesn't.
- **What you need to claim [45]** (changed after playtesting and simulation): a combined total **and** a minimum in
  every pillar. There is no one-pillar route any more.
  - 2–3 players: **8 total, with at least 1 in each** of Influence, Fear and Wealth.
  - 4–8 players: **9 total, with at least 2 in each.**
  - Why: with the rulebook's routes, winners typically claimed holding 6–7 in one pillar and 1 in their weakest
    (16–39% had 0 in a pillar). Raising the limits alone didn't change that. With the minimum, nobody can win
    from one pillar, and games run about as long as before (Sudden Death 10–21% of games, up from 8–12%).
  - Earlier versions: rulebook 5/6 in one pillar, then 7/8 in one pillar, combined 8/10.

## The Specter
- **Mischief [46]:** once per round, in their normal turn slot, a Specter may play one Instant from the
  top **5** of the discard pile (changed after simulation; was 3). It can't pick any Instant that costs anyone Heart Tokens (Duel of Honor,
  Cursed Dice, Wildfire, Risky Crossing, Elodie's Sorrow, Elodie's Exile, Elodie's Judgment, Elodie's
  Trial, Elodie's Reckoning, Gilded Cage). For "you" cards, the Specter picks a target player, who
  resolves it as if they drew it. Global cards work as written. The card leaves the game. With fewer
  than 5 cards in the discard pile, the Specter skips.
- **Discard pile [47]:** top = most recently discarded; hand-limit discards go to the bottom.

## Individual cards
- **Barter [48]:** you pick the card you give. The card you get is random, unless the card lets you see
  their hand (Mind Games, Broker's Fee).
- **Stolen Goods, Black Market Contact [49]:** only Hand Cards can be taken from the discard pile.
- **Uneasy Trade [50]:** you choose both resource types.
- **Forced Retreat [51]:** they pick any direction that ends farther from you.
- **Hidden Path [52]** (replaced by [72]): teleport to any house tile, never the Throne. (Was: any square you have ended a move on during this life, which nobody can track at a table.)
- **Night of Shadows [53]:** everyone discards to 2; the current player stops drawing this turn.
- **Scramble [54]:** Hand Cards are dealt back round-robin as evenly as possible (max 3 each).
- **Elodie's Trial [55]:** the drawer picks any other player to make the optional, blockable
  1-damage attack. A tie for fewest HP means no effect.
- **Duel of Honor [56]:** you choose among adjacent players; tied rolls are re-rolled.
- **Unstated ties [57]:** no effect.
- **Elodie's Sorrow (81), Elodie's Exile (89)** (changed after simulation): they can't take anyone below 1 Heart
  Token. Sorrow: "Every player with more than 1 Heart Token loses 1 Heart Token." Exile: "Every player not
  currently on their owned tile, and with more than 1 Heart Token, loses 1 Heart Token."

- **Treasure Map [58]:** "Wealth-related" = the card's text mentions Wealth.
- **Truces [59]:** don't stop a Challenge fight.

## Implementation calls (confirmed)
These came up in code and weren't covered above; all confirmed as they stand.
- **Golden Harvest** can't be played after you've attacked this turn (otherwise the drawback is free).
- **Counterspell vs. attack cards:** Cursed Dagger and Shadow Strike are attacks, so Block/Deflect cards answer
  them, not Counterspell. Counterspell answers every other Hand Card aimed at you.
- **Poisoned Chalice** still costs you 1 Wealth if it's countered.
- **Bridge the Gap** played before you roll *is* your move for the turn (with the resource check after it);
  played after rolling it just moves you.
- **The Great Raid:** if you die during the first of the two turns, your heir still takes the second.
- **La Marca** stays on its target until they die or you brand someone else.
- **Shadow Strike's** "cannot be blocked" also rules out Last Stand.
- **Duel of Honor, Sudden Death duel:** the earlier player in turn order strikes first in a tie-break duel;
  Block/Deflect cards aren't used in that duel.
- **Specter targets:** a Specter may aim a card at any living player, including one the card helps.

## Trading and Reaction cards (added after playtesting)
- **Trade offer [60]:** after moving, instead of attacking or playing a Hand Card, you may offer one other player
  1 of your resources for 1 of a *different* kind of theirs. They accept or refuse; nothing happens without their
  yes. The offer is your action whether or not they accept (`TRADE.refusedUsesAction` in `src/config.ts`), and you
  may make one offer per turn. Any distance; Specters can't trade. Uneasy Trade (card 49) stays as it is: a forced
  trade, played as a card.
- **Reaction cards [61]:** six new Hand Cards, numbered 121–126, in a new category, **Reaction**. The deck grows to 126
  (71 Hand Cards, 55 Instants). You hold them like any Hand Card (they count toward your 3) and play one only at its
  moment, on another player's turn; never as your own action. Each prints its moment under the divider.
  - **Ill Omen [121]:** when another player rolls to move, cancel the move. They stay where they are this turn; the
    resource check still happens on the square they're on.
  - **Embargo [122]:** when another player's trade offer is accepted, or another player plays a Barter card,
    cancel it. Nothing changes hands; the card is discarded and their action is spent. The trade partner can't
    Embargo their own trade.
  - **Intercept [123]:** when another player gains resources from a tile, they gain 1 less.
  - **Interference [124]:** when another player plays a Hand Card, cancel it: discarded, no effect, action spent.
  - **Ambush [125]:** when another player ends their roll-and-move next to you, attack them at once (damage = your
    Heart Tokens, as a basic attack). Only where an attack is allowed (not on the Throne, not a protected heir,
    not during a truce). They may Block it. It happens before their resource check.
  - **Turnabout [126]:** when a Hand Card targets you, it targets another player of your choice instead (any other
    valid target of that card). Counterspell is offered first.
  - **Timing:** players are asked in turn order after the acting player; the first Reaction played closes that
    moment. Reactions can't themselves be answered by another Reaction, Counterspell or Block.
- **Simulation (300 bot games per count):** trades are about 10% of turns at 4+ players; every Reaction gets used
  (Interference, Ill Omen and Intercept most). Games run about a round longer and Sudden Death decides 10–22% of
  games (was 11–17%). Stillwater wins 19–20% at 4–8 players (was 12–17%); Dorini is lowest at 5–9%.

- **House balance after trading and Reactions [62]** (simulation, 300 games per count): Stillwater had risen to
  about 1.5× its fair share of wins (the Long Watch's free resource of choice fills the every-pillar minimum, and the
  games now run longer); Dorini sat at about 0.6× (only one Trade tile it can farm, since the other is its own,
  and the trade offer beats its 2-for-1 Ledger). Changes:
  - **Sudden Death** moves from round 15 to **16** (`SUDDEN_DEATH_ROUND`).
  - **Stillwater:** the Long Watch needs a turn with no action at all; Gen IV has 3 Heart Tokens, like everyone.
  - **Dorini (Baraka Dorini):** also, once per turn, Wealth gained from anything but a tile (a card, an event, a
    trade, an ability) brings 1 more.
  - Bot only: Dorini's bot no longer hoards Wealth alone.
  - **Result:** every house wins 7–22% at every player count (Stillwater 9–14%, Dorini 10–17%); Sudden Death
    decides 7–18% of games.

- **Brasador and Kay Soley [63]** (statistical check, 5,000 games: 1,000 each at 2, 3, 4, 6 and 8 players, wins
  measured against a fair share for the seats each house actually held): Brasador won 1.26× its share and Kay Soley
  0.84× (difference p ≈ 10⁻¹⁸; head to head 447–263). Brasador's edge came from Sangre Ardiente (Fear on every kill,
  and big tables have ~24 deaths). Changes:
  - **Brasador, Sangre Ardiente:** no bonus in Gen I–II; from Gen III, +1 Fear on kill (was +1, then +2).
  - **Kay Soley, Rit Solèy:** 1 less combined total to Claim from Gen II, 2 less from Gen III (was 2 less at Gen IV).
  - **Result:** Brasador 1.12×, Kay Soley 0.95× (no longer different from fair, p = 0.15); the test that all houses
    are equal fell from χ² = 108 to 29. Still slightly weak: Suzumori 0.91×, Yaguana 0.94×.
  - **Picking houses vs. the blind draw:** in a simulated draft (first pick takes the strongest house) the first pick
    won up to 2.1× its share at 6 players and the last pick 0.54×; with the blind draw no seat beat ~1.1×. The blind
    Grudge Token lottery stays the rule.

- **Follow-up pass [64]** (5,000-game statistical check after [63]):
  - **Agnivansh, Agni ki Shakti III:** "+1 Fear whenever your attack lands" became "after your attack lands, you
    may move 1 space" (not in a Challenge). Agnivansh was 1.32× its share at 6–8 players; now 1.00× overall, 1.14× there.
  - **Dorini IV, Bazaar al-Dhahab:** costs 3 Wealth (was 5); it was used 25 times in 2,500 games.
  - **Bots** now play Uneasy Trade, Hidden Path and Black Market Contact (they never did). Whispers of Doubt,
    Traveling Merchant, Broker's Fee and Homeward Bound remain bot-blind (information and card swaps).
  - **Seat order at 8 players:** with the bot fixes, seats win 11.0–14.1% (p ≈ 0.4): no real first- or last-seat
    effect; no change made.
  - **Tested, not adopted: damage cap 2** (`TUNING.maxDamage`). It cuts Specters at 8 players from 3.9 to 2.7 a game,
    but lifts Ironvow to 1.24× at big tables and Dorini to 1.13× (χ² 40 vs 26). Try it after real playtests if big games
    feel too deadly.
  - **Result:** every house 0.90–1.09× its fair share (χ² 26). Suzumori 0.90× and Yaguana 0.93× stay a little low;
    their kits (seeing hands, inheriting Legacies) lean on information and choice the bots barely use, so playtest
    before patching them.

- **Opening truce [65]:** no attacks of any kind (basic, card or Reaction) during the first round; Challenges
  excepted. Why: at 8 players, win rates fell steadily with turn order (seat 1 10.9%, seat 7 14.2%, 3,000 games,
  p ≈ 0.009). Seat 1 moves out first and later seats can close in and strike before it acts again; seat 1 died 1.35
  times in rounds 1–4 against 0.97 for seat 8, and trailed in resources by round 3. With the truce, seats win
  11.7–13.0% (p ≈ 0.77) and house balance and game length are unchanged. A two-round truce was no better.
  `OPENING.truceRounds` in `src/config.ts`.

- **House Yaguana [66]:** the house formerly called Vai'tama is now Taíno-inspired: House Yaguana of Xaraguá, with
  Voice of the Opía (was Tahu'ora), Guaíza (was Ancestor's Mask) and Song of Coaybay (was Tide of Ancestors). Names,
  lore and art only; every rule is unchanged. The code keeps the internal id `vaitama`.
- **The game's name [67]:** Throne of Bloodlines is now *Bloodlines: The Race to Elodie's Grace* (short form
  Bloodlines). The prize is still Elodie's Throne; no rule changes.
- **Resource tokens and open totals [69]** (physical game): Influence, Fear and Wealth are double-sided tokens, worth 1
  on the front and ×5 on the back; players make change with the supply at any time. Restating [12] for the table:
  resources are never hidden. Tokens stay in plain view, and any player may ask another's exact totals at any time
  and must get a truthful answer.
- **Lasting cards stay out [70]** (physical game): a card with a lasting effect is left face up in front of the player
  it affects (a truce between its two players) and discarded when the effect ends, so the table can see every
  effect in play. Effects from houses and rules use reminder tokens: new-heir shields, the La Marca brand, War Cry
  and Specter markers.
- **Adopted: a bigger Reckoning, taken before the halving [71]** (5,000 bot games per variant; death still halves one
  pool of the victim's choice). "1 of each" = 1 of every pillar, taking from a pool they still have for any pillar they
  have none of. Timing: after the halving (the rule), before it, or out of the half being lost.

  | Variant | Rounds | Sudden Death | Taken per Reckoning | Win rate after 1 / 2 Reckonings | House χ² |
  |---|---|---|---|---|---|
  | Steal 1, after (current) | 11.0 | 12.1% | 0.9 | 1.12× / 0.96× | 32 |
  | Steal 1, from the lost half | 10.9 | 10.3% | 0.8 | 1.08× / 0.99× | 28 |
  | 1 of each, after | 10.7 | 10.3% | 2.3 | 1.28× / 1.21× | 46 |
  | **1 of each, before** | 10.6 | 9.6% | 2.5 | 1.29× / 1.27× | 39 |
  | 1 of each, from the lost half | 10.8 | 9.9% | 0.9 | 1.09× / 0.97× | 31 |

  Taking from the lost half barely changes anything (the half is usually only 1–2 tokens). **Adopted: 1 of each,
  before the halving**: revenge clearly pays, games end a little sooner, and balance moves less than taking it after
  (Brasador, the strongest house, falls from 1.11× to 1.03×). Switches: `TUNING.reckoningSteal`, `TUNING.reckoningTiming`.
- **Table rules for the physical game [72]:**
  - **Hidden Path (card 42)** now reads "Teleport to any house tile (not the Throne)." It replaces [52], which nobody
    could track at a table.
  - **First player:** if Elodie is playing, she always goes first; otherwise everyone rolls and the highest roll goes
    first (re-roll ties). Play goes clockwise in seating order. (The opening truce [65] already removes the first seat's
    disadvantage.) In the app, a player named Elodie, Lolo or Lodie goes first.
  - **Round track:** the first player moves the round marker at the start of each round.
  - **Calling "Wait!":** a player calls "Wait!" or "Stop!" to play a Reaction, Block or Counterspell at its moment and
    everyone pauses; once the active player has moved on, the moment has passed. Ill Omen comes after the roll is
    seen and before the pawn moves.
  - **The discard pile** is face down, in order, never shuffled. A Specter draws its top 5, looks, plays one and puts
    the rest back on top in the same order.
  - **Play on the grid only;** the ocean and islands around it are scenery. **The token supply is unlimited.**
  - **Used tokens** mark once-per-game powers and Stillwater's Patience.
  - Not adopted: a marker for the last tile you scored from (players are trusted to remember).
- **Always back to 3 [73]:** whoever plays a card (on their own turn, or a Block, Reaction or Counterspell on someone
  else's) draws back up to 3 as soon as that action is over; cards lost in other ways come back at the end of their
  own turn as before. `TUNING.refillOnPlay`. 5,000 bot games each way: games 0.2 rounds shorter (10.4), Sudden Death 9.7% → 8.5%,
  house balance better (χ² 36 → 21); Blocks and Reactions per game barely change (5.4 → 5.5).
- **Picking houses [74]** (amends the lottery rule kept in [63]): the blind lottery stays the default. Players may pick
  their houses instead only if **every** player agrees; a single "no" means the lottery. When picking, everyone rolls a
  die, the highest roll picks first (ties re-roll) and picking goes clockwise. (The draft simulation in [63] showed the
  first pick is worth up to 2.1× a fair share, hence unanimity and the dice.) In the app: solo against bots, you may pick
  your house and the bots draw the rest blind. Online play (Phase 2) will hold the vote and the roll-off
  (`src/engine/houseChoice.ts`: `houseChoiceAgreed`, `pickOrder`, `dealHouses`).
- **Adopted: Areíto, Yaguana loses nothing on death [75]** (5,000 bot games per variant; Yaguana at 0.87× its fair share,
  the lowest house). Results, as Yaguana's share and the all-houses χ² (lower is fairer; 21 now):
  - **Loses nothing on death** (no half-pool loss; a Reckoning against them still takes its bonus): 0.99×, χ² 11.5,
    the fairest result yet; game length unchanged. **Adopted** as Areíto, a Gen I house rule (not a passive, so Legacies
    and Guaíza can't copy it).
  - **Starts with a Legacy** (a Gen I passive of a house not at the table): 0.92×, χ² 14.
  - **Guaíza once per round instead of once per game:** no change (the bots never use it).
  - **+1 resource the first time each round another bloodline's character dies:** 1.41×, far too strong.
  Switch: `HouseDef.keepsOnDeath`.
- **Adopted: the Throne protects only a player eligible to claim [76]** (from the second review, docs/REVIEW-2026-10.md).
  The sanctuary used to cover anyone on the Throne. A probe seat that walked there at 5 resources and waited won 25% of
  6-player games (fair 17%) and 23% at 8 (fair 12.5%); waiting beside the Throne gave no edge. Now anyone may stand on
  the Throne, but only a player eligible to claim can't be attacked there, can't attack from there and can't die
  there. Chosen over "you may only move onto the Throne while eligible" because rivals don't have to police movement
  and it also covers a player who drops below the threshold while sitting there. Switch:
  `TUNING.sanctuaryEligibleOnly`.
- **Adopted: no attack deals more than 2 damage at 6+ players [77]** (1,000 bot games at each of 2, 3, 4, 6 and 8
  players, three options). At 8 players a Specter appeared in 86% of games (3.1 per game, the first around round 7).
  With the cap: 70% (2.3 per game, the first around round 9); at 6 players 75% → 52% (1.6 → 1.0). Game length doesn't
  change. Capping every player count was rejected: 2-player games already have too few deaths (1.5 → 1.1 per game).
  The cap covers basic attacks, attack cards, Challenge blows and the Sudden Death duel, bonuses included; Heart Token
  loss that isn't an attack is not capped. Switches: `TUNING.bigTablePlayers`, `TUNING.bigTableMaxDamage`.
- **Adopted: Ironvow's extra movement ends at Gen III [78]**, where the 2-square reach replaces it instead of adding to
  it. With the cap in [77], Ironvow became the strongest house at big tables (1.15× at 6 players, 1.26× at 8). Delaying
  the reach or Raider's Charge to Gen III did nothing; removing the +1 entirely sank it to 0.76× at 3–4 players. With
  this trim (2,000 games per player count, with [76] and [77]): Ironvow 0.95× at 6, 1.04× at 8, 0.89–1.05× at 2–4.
  Every house at 8 players now wins 0.90–1.12× its fair share (before [76]–[78]: 0.84–1.23×), the tightest yet.
- **Adopted: name the target, then Interfere [79]** (the owner's request). A card aimed at a player (Court Scandal,
  Tax Collector, Poisoned Chalice, Hex, the Disruption cards, the attack cards, the truces and the like) is played
  face up and its target named first; only then may others answer with Interference or Embargo, so they know who it
  hits. Cards with no target (or an optional one, like Black Market Deal's barter) open the window as soon as they're
  played, as before. Whispered Promise, Court Scandal and Tax Collector now name their player before their gain;
  the outcome is unchanged. Counterspell and Turnabout still come after Interference. Engine: `CardDef.namesTarget`.
- **Tested, not adopted: forcing 2-player games together [80]** (4,000 bot games per option). At 2 players 41% of
  games have no death and whoever first becomes eligible wins 80%. Neighbouring houses raised deaths from 1.5 to 2.3 a
  game (no-death games 41% → 29%) but left the race unchanged (first eligible still wins 80%, 62% of claims
  unchallenged), and Dorini beat Kay Soley 66–34 in that pairing. Starting the second pawn beside the first player
  did the same with fewer deaths, but the pawn no longer starts on its own house. The owner chose to keep 2 players
  as a fast race.

- **Tested, not adopted: harsher death [68]** (5,000 bot games each way, 1,000 at each of 2, 3, 4, 6 and 8 players).
  On death, lose half (rounded up) of **every** pool instead of half (rounded down) of one pool. Each death costs about
  3.1 resources instead of 1.0. Games run 1.4 rounds longer (2.6 at 8 players), Sudden Death decides 31% of games
  instead of 12% (42% at 6–8 players), Throne claims fall by a third and Challenges by 60% (all p < 10⁻⁹⁰). House
  balance gets worse (χ² 32 → 90: Brasador 1.11 → 1.19, Ironvow 0.99 → 0.88, Kay Soley 0.94 → 1.05). Winners who never
  died rise from 31% to 36%. Switch: `TUNING.deathLoss = 'allHalfUp'` in `src/config.ts`.

## Balance pass (simulation)
`npm run analyse` plays bot games at 2, 3, 4, 6 and 8 players. These changes came from it (400 games per count):
- **Before:** at 8 players, house wins ran from 1% to 46%, in order of Heart Tokens (Brasador on top, every
  2-HP house at 1–6%). Sudden Death decided 30% of 2-player games. Plunder and Vanishing Act were never played.
- **After (HP evened, tiles 3/2, Specters pick from 5, the card changes above):** at 8 players, every house wins
  6–21%; at 2–4 players, 7–18%. Sudden Death decides 7–13% of games. Games run about a round shorter.
  Plunder and Vanishing Act are now played about as often as other cards.
- **Still open:** big games stay deadly (about 26 deaths and 4.4 Specters in an 8-player game); damage caps,
  softer global Heart Token loss and kill-reward changes barely moved it. Tiles still give only about 13% of
  resources because players reach a rival tile only a few times a game. Bots aren't people: confirm with play.
