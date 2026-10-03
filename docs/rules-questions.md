# Rules questions before building

> **Status:** answered. The final rulings are in `rules-decisions.md`.

Everything below is either undefined, ambiguous, or contradicts another section. Each item has a
**proposed default** I will build unless you say otherwise. Items marked **BLOCKER** have no safe
default: the rules don't say enough to guess.

Answer by number, e.g. "3: War. 7: go with default. Everything else default."

---

## A. Board and setup

1. **BLOCKER: which house's tile is which type?** The rules say 3 Court, 3 War, 2 Trade tiles, one per
   house, but never say which house gets which.
   *Proposal:* War = Brasador, Ironvow, Agnivansh. Trade = Dorini, Vai'tama. Court = Kay Soley,
   Suzumori, Stillwater.

2. **BLOCKER: where exactly are the tiles?** The rulebook says the layout isn't final. Also, 18×18 has
   no single center square.
   *Proposal:* the Throne is the center 2×2 block (counts as one tile). The 8 house tiles are single
   squares in a ring about 5 squares out from the Throne, alternating types so no two of the same type
   touch. I'll send a picture of the layout to approve.

3. **Is a "tile" one grid square?** The rules use "tile" both for any square ("players sharing a tile
   count as adjacent") and for the 8 resource tiles.
   *Default:* every grid square is a space; the 8 house squares and the Throne are the special "tiles".
   Sharing a square = adjacent.

4. **Who goes first?** "Oldest/wisest" doesn't work digitally. *Default:* random in solo; host picks
   in multiplayer (per the build guide).

## B. Turn and movement

5. **Must you move the full roll?** "Move that many spaces" sounds exact, but *Forced March* ("must
   move their full next roll") implies normally you don't have to.
   *Default:* move **up to** the roll (you may stop early or stay put), in one straight line.

6. **Can you move backward?** "Forward or to the side" doesn't fit a board with no facing.
   *Default:* any of the 4 directions.

7. **Board edge:** *Default:* you stop at the edge.

8. **BLOCKER: when can you play your 1 Hand Card?** The turn order puts card play *after* moving and
   combat, but many cards only make sense earlier: Swift Steed and Bridge the Gap ("move … this turn"),
   Golden Harvest ("you may not attack this turn"), Vanishing Act ("after resolving combat this turn").
   *Proposal:* your one Hand Card may be played **at any point during your own turn**.

9. **Extra-movement cards** (Diplomatic Envoy, Conqueror's March, Silk Road, Swift Steed, Risky
   Crossing): *Default:* if played before you move, they add to the roll. If played after, you move
   that many extra spaces straight away, in a straight line in any direction. A move made after the
   resource check doesn't give a second resource check.

10. **Distances** ("within 6 spaces", "within 8", "closest to the Throne"): *Default:* counted in
    orthogonal steps (up/down/left/right), matching the movement rules.

11. **Resource check: "the same tile you scored from last turn".** *Default:* blocked only if you
    actually scored from it last turn. Standing on the Throne gives nothing.

## C. Resources and information

12. **BLOCKER: are resource totals public or secret?** The build guide wants everyone's totals always
    visible. But *Elodie's Gaze* ("reveals their resource totals"), *Suzumori III* ("view … a resource
    pool total") and the claim/challenge timing only make sense if totals are secret.
    *Proposal:* totals are **secret**. You see your own; others see them only through those effects.
    The table always shows HP, generation and whether a player is Throne-eligible (otherwise nobody
    could know who can Challenge).

13. **Losing or stealing at 0:** *Default:* totals never go below 0; stealing from 0 gives nothing.

## D. Combat

14. **How many attacks per turn?** *Default:* one basic attack per turn (attack cards are separate).

15. **What counts as an "attack"** for Block/Deflect, truces, Dread Banner and Marked for Death?
    *Default:* basic attacks, Cursed Dagger, Shadow Strike, Elodie's Trial and Challenge fights. Not
    Hex of Withering, Poisoned Chalice, Duel of Honor or self/global HP loss (only *Counterspell* can
    stop a Hand Card aimed at you).

16. **Who gets the kill when HP loss isn't a basic attack?** This matters for Grudges, kill counts and
    Brasador.
    *Default:* if a player's card or ability caused it (Cursed Dagger, Hex, Poisoned Chalice, the
    winner of Duel of Honor, the attacker in Elodie's Trial, Riposte), they get the kill. Deaths from
    global, fate or self effects (Elodie's Sorrow, Wildfire, Blood Oath, Cursed Dice…) have no killer:
    no Grudge Token, no kill credit.

17. **If the active player dies during their own turn** (e.g. Blood Oath): *Default:* their turn ends
    immediately and the heir starts at home on their next turn.

18. **Block cards and your 1-card limit:** *Default:* playing a Block/Deflect off-turn doesn't use up
    your next turn's card play. Your hand stays smaller until your next draw step.

19. **Block cards played ahead of time:** *Iron Guard* says "the next attack", which could mean
    played in advance. *Default:* every Block/Deflect is played only in response to an attack, as
    Section 6 says.

20. **Last Stand contradicts itself:** "Negate an attack … you survive with 1 Heart Token instead". If
    the attack is negated, you'd keep your HP. *Default:* you take the hit but stay at 1 HP.

21. **Shield Wall's "ally":** there's no formal alliance. *Default:* every other player on your square
    is also protected for the rest of that turn.

## E. Death, Grudges and succession

22. **The Grudge wording is reversed.** Section 9 places the token *in front of the dead player*, so
    the dead player's family holds it against the killer. But the Reckoning sentence says "kills the
    player who is holding a Grudge Token against them", which is backwards. The bracket ("you're
    killing the person who killed your parent") matches the first reading.
    *Default:* the bracket is right. A Reckoning is killing the player whose Grudge Token your family
    holds.

23. **Several Grudges:** *Default:* you can hold Grudges against several players, even more than one
    against the same player. A Reckoning settles one of them.

24. **Order of operations in a Reckoning:** *Default:* the dying player halves a pool first, then the
    killer steals 1 point.

25. **A player who becomes a Specter:** *Default:* their hand is discarded.

## F. House abilities (many reference systems that don't exist in the rulebook)

26. **BLOCKER: when and how often can a generation ability be used?** Only some say "once per game"
    or "once per turn". *Proposal:* any ability without a stated limit can be used **once per your
    own turn**, as a free action that doesn't use up your card play.

27. **BLOCKER: "activation costs" don't exist.** Ironvow III ("-1 to attack activation cost"),
    Agnivansh I ("combat abilities cost 1 less") and Agnivansh IV ("ignore all activation costs")
    refer to a cost system the rulebook never defines. Attacks are free.
    *Needs your design.* One option: those become "+1 damage on your attacks" (Ironvow III, Agnivansh
    I) and "attack twice this turn" (Agnivansh IV).

28. **BLOCKER: Ironvow I, "movement costs -1 to adjacent territories".** Movement is a dice roll, with
    no costs or territories. *Option:* +1 to your movement roll.

29. **BLOCKER: Vai'tama's "Legacy trait".** Vai'tama I and III are built on inheriting a Legacy trait
    on death, which isn't defined anywhere. Vai'tama IV also needs a meaning for "a bloodline
    eliminated from the game entirely".
    *Option:* a Legacy trait is the Gen I passive of the house that killed you (Vai'tama I: any house
    with a character that has died this game; III: draw 2 random, pick 1). "Eliminated" means that
    house has become a Specter.

30. **"Trade actions" (Dorini) and "court/marriage actions" (Kay Soley):** these aren't defined.
    *Default:* gaining Wealth from a Trade tile / Influence from a Court tile. There is no marriage
    mechanic.

31. **Suzumori I, "once per day phase":** there's no day phase. *Default:* once per round.

32. **Stillwater I/III:** "Recharges once per game instead of single-use", and the rulebook's "recharges
    each game", don't make sense within one game. *Default:* Gen I–II can use it once; from Gen III,
    once more (twice in total).

33. **Stillwater II, "no aggressive action":** *Default:* you didn't attack, play an attack card, or
    play a card that takes something from another player.

34. **Gen IV HP contradictions:**
    - Agnivansh is said to have the **lowest** Gen IV HP of all 8, at 2, but Dorini, Suzumori,
      Vai'tama, Kay Soley and Stillwater's base are also 2. Should Agnivansh IV be 1?
    - Stillwater IV is listed as 4 HP "+2 on top of normal stats". Is that 4 total, or 6?
    *Default:* Agnivansh IV = 2 and Stillwater IV = 4, as the tables show. Flagged for your call.

35. **Brasador's soft downside, "a small bonus" for attackers:** *Proposal:* +1 damage to attacks
    against Brasador when Brasador is Gen III+ and has strictly the most Fear.

36. **Brasador II La Marca:** *Default:* mark one player at a time. The mark lasts until that player
    dies or you mark someone else. **III Grito de Guerra:** the target's next Fear gain is cancelled.
    **IV:** kills by all your generations count.

37. **Ironvow II, "move and attack in the same action":** you can already move then attack on a normal
    turn. *Option:* attack *before* moving as well as after (hit and run).

38. **Dorini IV, "a full extra action":** *Default:* one extra Hand Card play and one extra basic
    attack this turn.

39. **Agnivansh II's "half-move":** *Default:* roll a d6 and move half (rounded up) in a straight line.
    **III's "win any combat":** your attack lands (isn't negated).

40. **Suzumori IV, "redirect their next action":** *Default:* you choose the direction of their next
    move and the target of their next attack or targeted card.

41. **Kay Soley II, "2 turns":** *Default:* 2 rounds.

## G. Winning

42. **BLOCKER (a tuning item you flagged): how does a Challenge fight work?** "Fight it out immediately"
    doesn't say who strikes first or how long it lasts.
    *Proposal:* the challenger strikes first, then they trade blows until one dies. Block/Deflect cards
    may be used. Configurable.

43. **When can a Claim be made?** *Default:* at any point on your turn while you are on the Throne and
    eligible. Eligibility is checked at that moment, so you must still be over the threshold.

44. **Kay Soley IV, -2 threshold:** applies to the combined total only (10 → 8), not the single-pillar
    6. Confirm.

45. **Player-count thresholds:** *Default:* 2–3 players: 8 total / 5 in one pillar; 4–8 players:
    10 / 6. Specters still count toward player count.

## H. The Specter

46. **BLOCKER: Specters may never deal damage, but many Instant cards do** (Elodie's Sorrow, Wildfire,
    Duel of Honor…). Instants are also written as "you gain…", and a Specter has no resources.
    *Proposal:* a Specter can only choose Instants that cause no HP loss. The Specter picks a target
    player, who resolves the card as if they had drawn it. The Specter acts in their normal turn slot.

47. **Which end of the discard pile is "top"?** Section 4 sends hand-limit discards to the *bottom*,
    while Specters, *Black Market Contact* and *Treasure Map* use the *top*.
    *Default:* top = most recently discarded; hand-limit discards go to the bottom.

## I. Individual cards

48. **Barter choices** (Traveling Merchant, Black Market Deal, Thief in the Night, Mind Games, Broker's
    Fee): *Default:* you pick the card you give. The card you get is random unless the card lets you
    see their hand (Mind Games, Broker's Fee).
49. **Stolen Goods / Black Market Contact** take cards from the discard pile, which contains Instants.
    *Default:* only Hand Cards can be taken (skip Instants).
50. **Uneasy Trade:** *Default:* you choose both resource types.
51. **Forced Retreat:** "away from you" vs "their choice of direction". *Default:* they choose any
    direction that ends farther from you.
52. **Hidden Path, "any tile you have visited":** *Default:* any square you have ended a move on this
    life.
53. **Night of Shadows** drawn mid draw-step: *Default:* everyone discards to 2; the current player
    stops drawing this turn.
54. **Scramble:** *Default:* Hand Cards are dealt back round-robin as evenly as possible (max 3 each).
55. **Elodie's Trial:** *Default:* the player who drew it picks any other player to make the optional
    1-damage attack (blockable). Tie for fewest HP: no effect.
56. **Duel of Honor:** *Default:* if several players are adjacent, you choose; tied rolls re-roll.
57. **Ties not covered by a card** (Debt Collector, Inflation, Loose Lips): *Default:* no effect, per
    the card list's general tie principle.
58. **Treasure Map, "Wealth-related":** *Default:* any card whose text mentions Wealth.
59. **Truces vs. Challenges:** *Default:* Uneasy Truce, Blood Pact, Ceasefire and Sèman Lapè don't stop
    a Challenge fight at the Throne.
