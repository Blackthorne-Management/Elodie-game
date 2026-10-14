# Second design review, October 13 2026

An independent pass over *Bloodlines: The Race to Elodie's Grace* from the player's side of the table, in two parts:
the first pass (written against commit `ed3e8e6`, before `docs/REVIEW-2026-10.md` was opened) and the second pass
(written against `2ccb422`, after decisions [76] to [85]). The review itself is unchanged below; what the owner
adopted is listed first and recorded in docs/rules-decisions.md [87].

## Second review decided (rules-decisions [87])
- **Adopted, N3 Throne entry:** [76] stays, and you may not end your own move on the Throne unless eligible to claim
  (passing through is fine; a rival's card may still put you there, with no protection). `TUNING.throneEntryEligibleOnly`.
- **Adopted, N1 big tables:** at 6+ players your Heart Tokens count as at most 2 when you deal damage; bonuses still
  add. Same for Challenge blows and the Sudden Death duel. Replaces [77]'s flat cap. `TUNING.bigTableHeartCap`.
- **Adopted, N2 Unbroken:** once per heir, from 2 or more Heart Tokens; a Blocked attack does not use it up.
- **Adopted, N5 Battle:** the second house always comes from the die, even when picking.
- **Adopted, N4 Brasador's Legacy card:** "+1 Fear on kill." from the start (also for Song of Coaybay; not Guaíza).
- **Adopted, N7 Stolen Goods:** "Take a random card from an adjacent player's hand."
- **Adopted, N8 wording:** Turnabout's new target can't answer it; "eligible" is each player's own number; the Instant
  discard pile may be face up; the score pad drops "fallen houses"; Grito de Guerra: at most 2 players marked at once.
- **Adopted, N6 rulebook split:** core rules (about 1,600 words), appendix, and a reference card with the ◎ list and
  the lasting-card durations. No rule change.
- **Not adopted by the owner:** the last-tile crest marker ("leave one of your crest tokens on the tile you last
  scored from", top-10 item 5 and the Appendix wording). The app keeps tracking the last tile scored.

Every number comes from the repo's own bots: `npm run analyse`, plus probe scripts that drove the same engine
(400 to 1,500 games per player count per variant, 5,000 games per rule variant where house shares are quoted).
Minute figures are estimates from turn counts at a typical table pace (60 to 100 seconds a turn), not measurements.

---

## Part 1. First pass (against `ed3e8e6`)

### Verdict
A good 3 to 5 player game with a strong hook (succession, Grudges, Reckonings) and three problems not to print with:
elimination at big tables, a Throne exploit, and houses that do nothing in Gen I.

Balance is within ±10% only when pooled across player counts. Per count (4,000 games each): Kay Soley 0.84× at
3 players and 1.22× at 8, Dorini 1.16× at 3, Suzumori 0.84× at 8.

### Top 10, ranked by damage to a first game

1. **Elimination at 6+ players.** At 8, 86% of games have a Specter (3.2 per game). The first appears around round
   7 and watches 4 more rounds (about 30 turns). About 45% of Specter turns have no legal card.
   - Fix: with 6+ players, no attack deals more than 2 damage. Specters 3.2 to 2.2 at 8 and 1.6 to 0.9 at 6; length
     unchanged; the 8-player spread no worse than before (Ironvow 1.18× replaces Kay Soley 1.22× as the outlier).
   - Fix: Instants get their own discard pile and the Specter picks from its top 5. Turns with a play rise from
     about 55% to 81 to 96%.
2. **"About an hour" is wrong at 6-8.** Rounds are flat at about 11, so turns scale with players: 40 at 4, 58 at 6,
   74 at 8. A first 8-player game is 2 to 2.5 hours with about 10 minutes between turns. At 8 the game runs a
   median 6 rounds after someone first becomes eligible, and that player wins only 23% of the time.
   - Fix: print "about 20 minutes per player" and "first game: 3 to 5 players".
3. **Four houses are blank in Gen I.** Players who never leave Gen I: 58% at 2 players, 33% at 3, 20% at 4.
   - Brasador has no Gen I power. Fix: La Marca from Gen I (no measurable change in share).
   - Kay Soley's Court tiles are 19 squares away; its passive fires about once in 7 games. Fix: Rit Solèy from
     Gen I (1 less, 2 less from Gen III): 0.84 to 0.89× becomes 0.91 to 0.98× at 3-4 players, 8 players unchanged.
   - Stillwater's Patience triggers 0.16 to 0.39 times per game at 2-4 players. Long Watch from Gen I is 1.18×.
   - Yaguana shows nothing until its first death; Gen III ("draw 2, pick 1") is worse than Gen I ("pick any").
   - The Gen IV cards of Kay Soley and Stillwater add nothing.
4. **Rule text with loopholes.** Halving a pool of 0 or 1 (the app forbids it); Ceasefire "this round" gives the last
   seat nothing; Sasayaki Ha does not say whether Suzumori looks at the hand; the Bridge the Gap "before you roll"
   ruling contradicts "no Hand Cards before you move".
5. **Things only the app tracks.** Last tile scored; kill counts; Legacy draws (no component); 2 Grito markers for an
   unlimited effect; Brasador's downside and Kay Soley's lower number policed by rivals.
6. **Throne parking.** A seat that walks to the Throne at 5 resources and sits wins 25% at 6 players (fair 17%) and
   23% at 8 (fair 12.5%). *(See Part 2: the cause given here, the sanctuary, was wrong.)*
7. **Teaching is 25 to 30 minutes, not 15.** About 3,000 words before houses and cards. First trips: your own tile
   pays nothing and the nearest rival tile is 8-9 squares away; movement cards are played after moving and never
   score; "protected" stops attacks only.
8. **Two players is a foot race.** 42% of games have no death, 74% of claims unchallenged, first eligible wins 79%.
   Neighbouring houses raise deaths from 0.8 to 2.2 a game.
9. **Kingmaking.** Specter nudges; feeding a Reckoning (3 resources, one of each); a challenger with a Block.
10. **The deck plays itself.** 55 of 126 cards are Instants (16 pure die rolls), 35% of all resources at 8 players;
    exactly one playable card on 19 to 35% of turns; tile-conditional cards live on about 5% of turns.

### The nine lenses, in short
- **Most exciting moment:** the claim, when Blocks come out of hidden hands. Dead stretches: turns 1-2, Specter
  time, waiting at 6-8.
- **Decisions:** where to stop (threat range against a d6) and when to claim are real; card play is mostly obvious
  and the target is always the public leader. Winners net only 0.5 more resources from Instants than losers.
- **Houses distinct from turn one:** Ironvow, Agnivansh, Suzumori, Dorini. Not: Brasador, Stillwater, Kay Soley,
  Yaguana. Easiest to miss at a table: Brasador's downside, Dorini's off-turn bonus, Guaíza.
- **Theme:** succession and Reckonings carry it; the three pillars are one token in three colours; at 2 players the
  bloodline story often never happens.

### Against the October review
Its card-text audit (section 2) was adopted nearly whole. Disagreements that stand: B4 Dodge as "move 1" duplicated
Vanish (fixed in [84]); round-track truces still gave the last seat nothing (fixed in [84]); B10 adds theft to an
endgame already full of it (dropped); Gambler's Luck "half, rounded up" averages 2.44, not 2 (fixed as max 2);
"Game length: good" was measured in rounds, not minutes.

---

## Part 2. Second pass (against `2ccb422`, decisions [76] to [85])

### Bottom line
7 of the 10 original items are fixed or mostly fixed. The Throne fix does not work (the first pass misdiagnosed the
cause), the damage cap quietly killed five damage bonuses and Stillwater's new Gen I power at 6-8 players, and the
rulebook grew by a third.

### 2.1 Status of the original top 10

| # | Item | Status | Why |
|---|---|---|---|
| 1 | Elimination at 6+ | Mostly fixed | 8p: Specter share of player-rounds 11% to 6%; games with a Specter 86% to 71%; first Specter round 7 to 9, waits 4 to 3 rounds; Specter turns with a legal play 55% to 89%. 6p: 7.5% to 3%, 77% of Specter turns play. Side effects: N1, N2. |
| 2 | Box time | Fixed | "60-150 min, best 3-6, 20 min per player" matches the estimate. Living turns at 8p rose 74 to 79 (fewer deaths); 150 is the experienced ceiling, not a first game. |
| 3 | Blank Gen I houses | Partly | Brasador and Kay Soley: fixed at 2-5 players; at 6-8 La Marca is wasted on 70% of the attacks it touches (N1). Unbroken saves an heir 0.4 to 0.7 times a game at 2-4 and 0.00 times at 6-8 (N2). Yaguana: fixed, but 1 draw in 7 is blank (N4). Kay Soley IV and Stillwater IV still add nothing. |
| 4 | Rule loopholes | Fixed | Halving, Ceasefire, Sasayaki Ha, Bridge the Gap print what the engine does. |
| 5 | App-only bookkeeping | Partly | Score pad, Legacy cards, Whispers, Loose Lips: done. Not done: the last-tile-scored memory, 2 Grito markers for an unlimited effect, Elodie's Reckoning still needs someone to remember the latest kill. |
| 6 | Throne parking | Not fixed | A seat that walks to the centre at 5 resources and waits still wins 27% at 6 players (fair 17%) and 23% at 8 (fair 12.5%), the same as before [76]. See N3. |
| 7 | Teaching | Worse | The first-turns box is good; the rulebook went from 2,980 to 3,997 words. See N6. |
| 8 | Two players | Partly | Race/Battle is a fair answer; Battle has two lopsided pairings and two pacifist ones (N5). |
| 9 | Kingmaking | Partly | Fewer Specters means fewer nudges; the rest is accepted. |
| 10 | Deck | Mostly fixed | Tile cards, duplicates, Gambler's Luck, Market Day, Dodge: done. 44% Instants stays by design. |

### 2.2 New problems

**N1. The cap kills the bonuses.** At 6-8 players a full-health attack is 3 before bonuses and the cap is 2, so
La Marca, Agnivansh's +1, Dread Banner, Marked for Death and Brasador's downside do nothing unless the attacker is at
1 Heart Token. Measured: 69 to 73% of bonus-carrying attacks at 6-8 gain nothing. The Gen I fix for Brasador is dead
at exactly the tables where the cap applies.
- Fix: cap the Heart Tokens, not the total. "At big tables your Heart Tokens count as at most 2 for damage; bonuses
  still add." Tested: wasted bonuses 0%; Specter share 3% / 7% at 6 / 8 (now 3% / 6%); deaths unchanged; houses at
  8 players 0.81 to 1.09×.

**N2. Unbroken never fires at 6-8.** It needs a killing blow from full health; under the cap no attack can kill a
3-Heart character in one blow. 0.00 saves per Stillwater game at 6 and 8 (0.38 to 0.74 at 2-4). Stillwater sits at
0.81 to 0.88× at 8 in both the owner's sample and mine. The N1 fix does not rescue it.
- Fix: "Unbroken: once per heir, an attack that would kill you while you hold 2 or more Heart Tokens leaves you at
  1 instead." Tested: Stillwater 1.05× at 4, 1.12× at 8; saves 1.2 and 0.9 per game. "Any killing blow" is too much
  (1.37× at 8). Also print that a Blocked attack does not use Unbroken up.

**N3. Parking is positional, not about safety.** Four tests, camper seat walking to the centre at 5 resources:

| Rule | 4 players (fair 25%) | 6 players (fair 17%) | 8 players (fair 12.5%) |
|---|---|---|---|
| Current rules ([76]) | 29% | 27% | 23% |
| Sanctuary removed entirely | 29% | 26% | 22% |
| Claim only at the start of your turn | 28% | 22% | 18% (games 2 rounds longer, Sudden Death 24%) |
| May enter the Throne only while eligible | 23% | 19% | 17% |
| Waiting beside the Throne instead | 22% | 17% | 17% |

The camper dies slightly less than everyone else in every version (1.60 vs 1.84 deaths at 6 players). What pays is
standing on the claim square: the moment a card makes you eligible you claim in the same action, with no roll for
Ill Omen and no walk. [76] removed protection during a phase when nobody was attacking the camper anyway. The first
pass was wrong about the cause; the entry rule it proposed works for a different reason.
- Fix: keep [76] and add "You may move onto the Throne only while eligible to claim (a rival's card may still push
  you there)." The policing objection no longer holds: [76] already requires the table to know whether the player on
  the Throne is eligible before anyone attacks them.

**N4. Ancestor's Voice draws blanks.** Brasador's Gen I passive is "from Gen III", so that Legacy is dead for two
generations; at 6-8 Stillwater's is dead too (N2). Blank draws: 11 to 15% at 2-4 players, 29 to 31% at 6-8. A Gen III
Yaguana holding Ironvow's Legacy loses the +1 movement for a reach it may never use; "works at Gen III strength" reads
as an upgrade.
- Fix: print Brasador's Legacy card as "+1 Fear on kill" from the start (one card, Yaguana only). N2 covers Stillwater.

**N5. Battle pairings** (1,000 games per pair, both seat orders):

| Pair | Left house wins | Deaths per game | Deathless games |
|---|---|---|---|
| Brasador vs Kay Soley | 56% | 1.67 | 34% |
| Kay Soley vs Dorini | 37% | 1.14 | 43% |
| Dorini vs Ironvow | 52% | 2.48 | 20% |
| Ironvow vs Suzumori | 52% | 3.81 | 16% |
| Suzumori vs Agnivansh | 59% | 1.89 | 35% |
| Agnivansh vs Stillwater | 48% | 1.00 | 46% |
| Stillwater vs Yaguana | 48% | 1.99 | 22% |
| Yaguana vs Brasador | 55% | 2.98 | 17% |

Two pairs are more peaceful than an average Race (1.4 deaths). When picking, the second player chooses the
favourable neighbour.
- Fix: in Battle, the second house always comes from the die, even when the table is picking.

**N6. The rulebook grew 34%.** New vocabulary a first game has to carry: two discard piles, ◎ Target, the Barter
list, five classes of lasting card, the big-table cap, eligible-only sanctuary, Race/Battle, Legacy cards, the score
pad. The Deck section alone is 510 words. Teaching from the booklet is now about 30 minutes cold, up from 25.
- Fix (no rule change): split the booklet into a 1,500-word core (turn, tiles, combat, death, winning) and an
  appendix (Reactions, lasting cards, piles, rulings). Put the ◎ list and the lasting-card durations on the reference
  card, not in the rules.

**N7. Stolen Goods got weaker.** The robbed player now picks any card from the whole Hand Card discard pile, which
usually holds a Block. The card gives more than it takes.
- Fix: delete the return clause: "Take a random card from an adjacent player's hand." (They draw back to 3 at the
  end of their turn anyway.)

**N8. Wording the table will argue about.**
- Turnabout: the engine gives the new target no Counterspell or Turnabout; the rules do not say so. Add one line.
- Sanctuary: a Kay Soley on the Throne is protected at 8 total; say "check their house's number".
- The Instant pile is face down for no reason; nothing but the Specter reads it. Face up removes a draw-and-replace
  ritual.
- Score pad: the "fallen houses" column no longer has a reader (Legacies are drawn at setup now). Drop it.
- Grito de Guerra has 2 markers and no limit on active targets.

**N9. Open items, refuted or reframed.**
- Kay Soley at 2-4 is within bot-personality noise: with a bolder Kay Soley bot it reads 0.87 / 1.08 / 0.97 at
  2 / 3 / 4, and "2 less from Gen II" does nothing at 2 players (0.78×) because 58% of players never leave Gen I there.
- The consistent small-table outlier is Dorini, 1.12 to 1.23× at 2-3 players in every run.
- Trade Winds and Grand Market: rename one or make Trade Winds 2 squares; harmless either way.

### 2.3 Probe numbers on the new rules

| | 2p | 3p | 4p | 6p | 8p |
|---|---|---|---|---|---|
| Rounds (p90) | 9.4 (16) | 9.2 (14) | 10.4 (15) | 10.9 (16) | 11.0 (16) |
| Living turns (p90) | 18 (32) | 26 (39) | 39 (55) | 61 (84) | 79 (105) |
| Instants per turn | 0.47 | 0.59 | 0.66 | 0.78 | 0.94 |
| Deaths per game | 1.4 | 3.7 | 6.6 | 12.6 | 20.7 |
| Full-health one-hit deaths | 20% | 25% | 21% | 1% | 1% |
| Players reaching Gen IV or Specter | 7% | 16% | 25% | 37% | 53% |
| Games with a Specter | 4% | 19% | 37% | 52% | 71% |
| Specter share of player-rounds | 1% | 2% | 3% | 3% | 6% |
| Specter turns with a play | 44% | 82% | 97% | 77% | 89% |
| Unchallenged claims | 68% | 44% | 50% | 26% | 22% |
| Winner was the first player eligible | 81% | 59% | 48% | 28% | 19% |
| Rounds from first eligibility to the end (median) | 3 | 3 | 4 | 5 | 6 |
| Bots parked on the Throne while not eligible | 3% | 1% | 2% | 1% | 1% |
| Bonus attacks wasted by the cap | 0% | 0% | 0% | 73% | 69% |
| Unbroken saves per Stillwater game | 0.38 | 0.65 | 0.74 | 0.00 | 0.00 |
| Yaguana blank Legacy draws | 11% | 15% | 11% | 31% | 29% |

Downtime at 8: 79 living turns plus 6 Specter slots at 0.94 Instants a turn; a first game still runs about 2.5 hours
with about 10 minutes between your turns.

### 2.4 New top 10, ranked by damage to a first game

1. **Rulebook length (N6).** Core booklet plus appendix; ◎ list and durations on the reference card.
2. **Throne parking still wins (N3).** "You may move onto the Throne only while eligible to claim."
3. **Bonuses dead at 6-8 (N1).** Cap the Heart Tokens; bonuses add.
4. **Unbroken dead at 6-8 (N2).** "From 2 or more Heart Tokens", once per heir.
5. **Last-tile memory (original item 5).** "Leave one of your crest tokens on the tile you last scored."
6. **Legacy blanks (N4).** Brasador's Legacy card reads "+1 Fear on kill".
7. **Battle pairings (N5).** The die picks the neighbour.
8. **Turnabout and sanctuary wording (N8).** Two sentences.
9. **Stolen Goods (N7).** Drop the return clause.
10. **Gen IV blanks for Kay Soley and Stillwater (original item 3).** No safe small fix found; at least stop the
    rulebook implying every generation card adds something.

Residual: 71% of 8-player games still end with someone sitting out for about 3 rounds. That is the shape of a
4-life elimination game; print it and keep "first game: 3 to 5".

---

## Appendix. Proposed print wording for the fixes above

- **Throne (Combat):** "You may move onto the Throne only while you are eligible to claim. A rival's card may still
  push you there; you get no protection unless eligible."
- **Big tables (Combat):** "With 6 or more players, your Heart Tokens count as at most 2 when you deal damage.
  Bonuses (Agnivansh +1, La Marca, Dread Banner, Marked for Death, Brasador's downside) still add."
- **Stillwater Gen I:** "Unbroken: once per heir, an attack that would kill you while you hold 2 or more Heart Tokens
  leaves you at 1 instead. A Blocked attack does not use it up."
- **Brasador Legacy card:** "+1 Fear on kill."
- **Battle (Setup):** "The second house is always chosen by the die, whether the table drew or picked."
- **Stolen Goods (50):** "Take a random card from an adjacent player's hand."
- **Turnabout (Reactions):** "The new target may not Counterspell or Turnabout it."
- **Sanctuary (Combat):** "Eligible means that player's own number: Kay Soley needs less."
- **Resources and Tiles:** "Leave one of your crest tokens on the tile you last scored from; move it when you score
  elsewhere. Your heir starts without one."
- **Score pad:** drop the "fallen houses" column.
- **The Deck:** the Instant discard pile may be face up.
