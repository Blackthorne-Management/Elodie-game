# Rules decisions (approved)

These settle every gap found in `rules-questions.md`. Where this file and the three source documents
differ, **this file wins**. Numbers in brackets refer to the question list.

## Board and setup
- **Tile types [1]:** War = Brasador, Ironvow, Agnivansh. Trade = Dorini, Vai'tama. Court = Kay Soley,
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
  - Vai'tama (Trade): column 4, row 4
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
  - Dorini IV's Golden Bazaar gives one extra action (attack or card). Agnivansh IV's Endless War lets one
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
- **Reckoning order [24]:** the dying player halves a pool first, then the killer steals 1.
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
- **Vai'tama's Legacy [29]:**
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
- **Stillwater II [33]:** "no aggressive action" = you didn't attack, play an attack card, or play a
  card that takes something from another player.
- **Heart Tokens** (changed after simulation, replaces [34]): every house has **3** in every generation, except
  Agnivansh IV = 2 and Stillwater IV = 4. Attack damage equals your Heart Tokens, so the old tables (2 to 4)
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
- **Hidden Path [52]:** any square you have ended a move on during this life.
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
