# Second review: Chapter 7 outline, The Fog Files (Oct 22)

*Reviewer: an independent helper, reading only. Subject: `docs/quest/reviews/2026-10-21-chapter7-outline.md`
("outline:N" below means that file's line N). I checked it against:*

- *the built engine on branch `chapter3` (worktree `wt-ch3/quest`, now at 656cfa1);*
- *the Chapter 6 snapshot the outline simulated against (`scratchpad/ch6sim/snap/quest`, commit 889ed60);*
- *the Chapter 6 outline and its review (`2026-10-21-chapter6-outline-review.md`, "Ch6 review" below);*
- *`FAMILY.md`, `STORY.md`, `QUEST-BUILD-GUIDE.md`, `PLAN-ALL-CHAPTERS.md`, `COMBAT.md`, `PUZZLES.md`, `SIDE-QUESTS.md`
  and `CAPITALS.md`.*

*What I ran:*

- *the outline's own script, unchanged (`scratchpad/ch7sim/paperfox-sim.ts`);*
- *my variants, in `scratchpad/ch7rev/`:*
  - *`rev-sim.ts`: a plain bot, and stronger versions of Sold Secrets;*
  - *`amb-sim.ts`: the ambushes and the stacks fight;*
  - *`grid.py` and `grid2.py`: the algebra of the 3 x 3 screen grid;*
  - *`realm.mts`: the realm map around Kuroshi.*

*All fights: Story difficulty, 30 seeds per row. I changed no other file and committed nothing.*

---

## 1. Verdict

**Build it after the fixes in section 6.** The chapter has the right shape:

- it covers the plan's minimum;
- the road order and the hand-on to Chapter 8 are right;
- the Fog Files reach Chapter 10 on the main route, so no player can miss them;
- it is well staged. The best parts are the observer crossing the bridge with the box (seen twice), the lantern code
  used twice, Sayo's war room built from walk-ins, the receipts as proof instead of a confession, and Kaede's dry "It
  is already written".

**Six problems would ship broken, contradictory or against a settled decision if built as written:**

1. **The anchor does nothing.** The four pushes the outline gives (north, east, east, south) also solve the grid
   *without* the peg, and the grid can be solved from any start without it. The cheats file it plans would fail, and
   the signature puzzle's Echo key is decorative (3.1).
2. **The buyer's list names the betrayer by elimination.** Four houses are listed and one name is cut out, so the
   player can read off the missing house in Chapter 7. But the real betrayer is chosen at the Muster (3.2).
3. **The Ash Wars ledger is filed fifty years ago, in the Echo.** The Ash Wars were about twenty-five years ago (3.3).
4. **Kayla contradicts settled `FAMILY.md` and leans on the Rael secret:**
   - she never touches the screens or the spy map, which `FAMILY.md` settles as her help;
   - she says she once held Ardencia's cipher;
   - she is called a Rodriguez (3.4).
5. **The level plan does not close, even before any ambush.** The played start the outline assumes, 5,200, is already
   **level 19**, not 18. With no ambushes the played end is **21**, and the outline's own sum is level 23, not 22
   (3.5).
6. **The Paper Fox has no danger, and Kagemimi does not matter.**
   - In every variant I ran, nobody went down.
   - A bot that ignores the decoys wins *faster* than one that clears them first.
   - The planned stand-in for Sold Secrets hits softer than the Fox's knife (3.6).

None of these needs the owner. Only (4) touches an owner-settled line. The fix restores what the owner settled, so no
question is needed.

---

## 2. What I agree with

- **Continuity in from Chapter 6** (outline:47-86). It uses:
  - Torvald's letter as the key to the door;
  - Bayarmaa's "Say less";
  - `clue.seventh_clause_read` with a fallback line;
  - the Chapter 5 envoy's "Everything about us is written down".

  It also writes the betrayal rule into the Journal note the same way as the Ironvow note (outline:326-328).
- **Haru joins at the lantern hour as a fighter** (outline:177-183, 713-717, 842-845). This is a sound Claude's call.
  It matches the Bayarmaa precedent the Ch6 review accepted: the player plays the companion in his own chapter. The
  refusal is acted out as walking Sayo's way in.
- **Kaede is clean; the neutrality retainer, Councillor Mibu, is the seed of the betrayal** (outline:876-877). This
  agrees with `COMBAT.md:536` and mirrors Hrafn.
- **The receipts are proof; the observer is gone by dawn** (outline:264-267, 307-311, 860-862). They show "a city's
  neutrality is a fiction" without spending anything Chapter 9 needs. His tea bowl left on the table is good showing.
- **K-2 and K-3 as the required pair; K-1's sightings as main beats; K-4 and K-5 placed but not built**
  (outline:535-546). K-3 as the way to the back door makes "required" feel earned rather than an errand.
- **No Echo battle** (outline:395-397). "That is why it works" would be contradicted by one.
- **The stage cues are the built kinds.** `place`, `enter`, `walk`, `exit`, `face` (including `'player'`), `look`,
  `wait` and `sync` are all in `engine/stage.ts:25-39`. Three Foxes entering from three lanes, and Sayo's agents
  coming in and out, are ordinary `enter`/`exit` cues with distinct actors.
- **The fog-return trigger is data.** A door's target map defaults to its own map (`engine/tiledMap.ts:128`).
- **Seize goes to Gianna, never to Anissa** (outline:423). This is the built path at `engine/battle.ts:964-993`.
- **Tone.** Comedy is kept to Salkhi, Samira and Haru, and away from Sayo's room and the petition. Haru's lantern and
  Kayla's crane for Anissa are earnest touches, not jokes. Two small slips are listed in 3.10.

---

## 3. Disagreements and risks, most serious first

### 3.1 The screen grid: the peg is not needed, and the planned cheat test would fail

The rule (outline:672-677): pushing a screen turns it and its orthogonal neighbours a quarter clockwise; with the
centre pegged, the solution is **north, east, east, south**; without the peg "the grid cycles", and the cheats file
"checks the four pushes fail without the anchor".

**What the algebra says** (`ch7rev/grid.py`, an exhaustive search over the states mod 4):

- **The four pushes also solve the grid unpegged.** Each of north, east, east and south is a neighbour of the centre,
  so the centre turns 1 + 2 + 1 = 4 quarters and comes back to north. From the outline's start state, the unpegged
  minimum is the same four pushes. The planned cheat (`puzzles/kuroshi_screens/cheats.json`, "the four pushes without
  the peg", outline:689) would *succeed*, and `tests/puzzles.test.ts` would fail on day 2.
- **The unpegged grid is solvable from every start.** The 9 x 9 push matrix has determinant -7, which is odd, so it
  is invertible mod 4: all 262,144 states are reachable. The pegged 8 x 8 matrix has determinant -3, so all 65,536
  states are reachable there too.

So no choice of start state makes the peg *necessary* under this rule. At best it is a shortcut. That contradicts
`PUZZLES.md:293` ("the present grid becomes solvable in four turns"), the anchor's whole purpose.

The outline's "no push can strand the player" (outline:677) is true, but for a simpler reason: each push undone is
three more of the same push. Full reachability is not what guarantees it.

**Fix (pick one, then re-run the search):**

- **(a) Recommended. The loose screen slips.** Unpegged, the centre screen swings back to its resting angle (say,
  east) after every push. The lanes therefore never open without the peg. Pegged, it holds north, and the four pushes
  work. This is one rule line in the `rotor` kind, and the anchor becomes the key.
- **(b) Keep the rule and choose a start whose pegged solution leaves the centre off by a non-multiple of four.** For
  example, south, south, south, then the south-east corner: four pushes pegged, and **21** pushes unpegged (`grid2.py`).
  The peg is then a large shortcut rather than a key. Say so in `PUZZLES.md`, and change the cheat to "the four pushes
  without the peg leave the lanes shut".

Also say whether the pegged screen itself can be pushed (and if so, whether it turns its neighbours). The outline does
not.

### 3.2 The buyer's list identifies a house by elimination, but the betrayer is chosen later

outline:283-290 describes "a Crown buying-list... four lines, *Dorini, Ironvow, Suzumori, Agnivansh*, each with a
price..., and beside one line a stamped mark, a closed hand, where the name has been cut out".

- **Four houses minus one remaining name equals one known house.** Any player can work out the cut name in Chapter 7.
- **But the betrayer is not fixed.** It is "the house whose price the player has paid least fully" at the Muster
  (`QUEST-BUILD-GUIDE.md:251`), and "on a replay the buyer can be forced to a different house" (`:254`). So the file
  would either name the wrong house or lock the outcome in Chapter 7.
- **Kayla's "I can tell you which line is shortest"** (outline:287) points at the same give-away.

**Fix:** make the list identify no house.

- The lines are **prices only**, in cipher, with the mark beside one of them, and every name column cut away. Kayla:
  "Four lines, four prices. The names were cut before it reached the Fox. Somebody knew the list would be sold."
- Or keep the names, put the closed hand at the **foot** of the list, and add a note: "whichever comes cheapest".
  This is the betrayal rule stated as an object, and it is better foreshadowing than a gap.

Either way, drop "which line is shortest".

### 3.3 The Ash Wars ledger is filed fifty years before the Ash Wars

K-2's minor Echo (outline:569-578) shows "Sayo's clerk (a young man at the same desk fifty years ago)" filing "*The
Suzumori Spy Ledger of the Ash Wars*". The Echo is the Revolution, about fifty years ago. The Ash Wars were about
twenty-five years ago:

- `QUEST-BUILD-GUIDE.md:765`: "the Revolution (Alliance War) is about fifty years ago; the Ash Wars about twenty-five
  years ago";
- `QUEST-BUILD-GUIDE.md:134`.

The ledger counts "Rael's 'butchery'" in a war that had not happened yet.

**Fix:** the Echo teaches the **shelving cipher**, not the ledger's place. Sayo's clerk files *a* Revolution file and
says the rule aloud, for example: "Crane for the Crown, pine for the war, the row for the year. Nobody is to say that
aloud." In the present, the player works out the Ash Wars row (crane, pine, a later row) from the rule.

This is a better minor puzzle anyway: one rule learned and applied, rather than a location remembered. Keep
`clue.shelf_mark` as the rule.

### 3.4 Kayla: her settled role is moved without a call, and three lines lean on the Rael secret

**Her role.** `FAMILY.md` (settled by the owner, Oct 21): "A cipher clerk in the fog city's archive. **She helps
decode the screens and the spy map (the Fog Files)**." In the outline:

- the screens and the spy map are solved by Sayo's Echo and Haru alone (outline:227-250, 669-680);
- Kayla appears only at K-2 and at the reading of the files afterwards;
- outline:828-829 says "Kayla is where FAMILY.md put her and does what it says".

That is a departure from an owner-settled line, and it is not listed among the Claude's calls (outline:834-880).
Moving the stacks to the library is recorded (outline:846-848). Moving her help off the screens and the map is not.

**Fix (cheap, and it restores the owner's line):** at K-2's end, Kayla hands Gianna **Sayo's house glyphs**, a paper
card (key item `item.kayla_glyphs`), with the line "You will need these where you are going. I did not say where."

- The grid's screens and the spy map's pins are marked in those glyphs.
- `story.spy_map_read` needs the card as well as `clue.sayo_network`.
- The Journal's map note reads "Kayla's glyphs: the north stack, under the stone".

She then helps decode the screens and the spy map without leaving the library, which `FAMILY.md` allows.

**Three lines that lean on the secret** (the locked rule, `QUEST-BUILD-GUIDE.md:33, 247`):

1. **"This is Ardencia's hand. I know it... the Alcázar cut it after I left"** (outline:292-293). This invents a
   backstory: Kayla served in Ardencia's treasury cipher. That makes Rael's half-sister his former cipher clerk, now
   in the realm's spy capital. A player will read her as Rael's agent, and her "I do not know" (outline:295) as a lie,
   which breaks "exact" and her own rule "she knows what the files say and nothing else" (outline:581).
   - **Fix:** "Ardencia's counting-house hand. Kirinoura has copied enough of it to know it. The key is not one this
     city has ever held."
   - Record it as a Claude's call.
2. **"I will not say his name in a library, where everything is overheard"** (outline:557-558). A Crown-allied lord
   needs no such secrecy. The line implies he has secrets worth protecting.
   - **Fix:** "...and I will not talk about him in a library. Everything here is written down." The same restraint,
     with no reason given.
3. **"You are a Rodriguez" / "I am a Rodriguez who is a clerk"** (outline:300-301). Kayla is Rahel's daughter by
   another man (`FAMILY.md`). *The Rodriguez Line* reads "Alonso, Benny, Rael, Azriel; and no others recorded"
   (`CAPITALS.md:383`). Giving her the surname is a silent family decision.
   - **Fix:** "You are family" / "I am family who is a clerk. Both are written."

"He writes to me twice a year. He never says anything. That is how I know he is still himself" (outline:750-751) reads
both ways and passes. Keep it.

The planned content test, which bans "good", "innocent", "feeds" and "the arrows" (outline:752-753), would not have
caught any of the three lines above. A human read of every Kayla line belongs in the reviewer prompt.

**Related: the buyer's mark named as the Quiet Crown's** (outline:285, 971-973). A Crown buying-list in Throne sols,
stamped with a Quiet Crown mark, *is* the join between the Crown and the Quiet Crown. That join is Chapter 9's
unmasking of the Hushed (`STORY.md` open question 3). Having Kayla say "The mark is the Quiet Crown's" makes it
explicit two chapters early.

- **Fix:** Kayla says only "A closed hand. It is not a Crown seal, and it is not a house's." The player who remembers
  the zealots' sigil can make the link. Chapter 9 or the Muster names it.

### 3.5 Levels: the played start is already 19, so the chapter ends at 21 with no ambushes at all

The curve, recomputed:

| Level | XP |
|---|---|
| 17 | 4,222 |
| 18 | 4,653 |
| 19 | 5,098 |
| 20 | 5,559 |
| 21 | 6,034 |
| 22 | 6,524 |
| 23 | 7,028 |

The outline's own table (outline:29-30) agrees.

**Arithmetic errors:**

- **outline:56 and 480.** "About 18 (5,200) as played." 5,200 is **level 19**. The Ch6 review's corrected played end
  for Chapter 6 (5,240) is also 19.
- **outline:489-490.** "a level-18 pair pays 360... a level-19 trio 570: 5,200 + 915 + 900 = 7,015, level 22". 360 +
  570 = 930, so the total is **7,045, level 23**.
- **With no ambush at all:** 5,200 + 915 = 6,115, **level 21**.
- **With the proposed 0.25 taper:** about 6,348, also **level 21**.

So the taper the outline asks the central session for (outline:492-494, 785) cannot close the gap. The root cause is
simple: the chapter's fixed XP (915) is larger than the whole 17-to-19 band (876), and the player arrives at the
band's top.

**Tool line.** The tool line checks out: 4,300 → 5,085 to 5,215, level 18 to 19.

"Without the two side quests, 4,900" (outline:487-488) is moot, because both side quests are required. The minimum
route is about 5,025, level 18.

**Fix (central session, together with the Ch6 review's 3.1; not a chapter dial):**

- **(a) Measure, don't assume.** Use Chapter 5's and Chapter 6's real routes, with seeded ambushes, to get Chapter 7's
  played start.
- **(b) Then choose one of:**
  - **cut the chapter's fixed XP to fit the band from the measured start.** From about 5,100, ending at 19 leaves
    about 450 XP for the chapter. That means books paying Influence only, the Fox about 60, the side quests about 50,
    and the stacks and the moths 30;
  - **or re-base the tiers to the played line,** for example Kuroshi 18 to 20 and Jwaladesh 20 to 22. That is a plan
    change, so it goes in the owner's milestone note, as a statement rather than a pop-up.
- **(c) Prefer the Ch6 review's ambush rule relative to the party's level** (a share of the XP to the next level per
  group) over a realm-wide band number. The outline's "0.25 from 15" is a third proposal in two days for the same
  dial. One decision, recorded once in `COMBAT.md` 6.
- **(d) Fix the hand-on numbers** for Chapter 8: tool 19, played about 21, until (b) lands (outline:914-916).

### 3.6 The Paper Fox: no danger in any variant; Kagemimi is not needed; the stand-in is softer than the knife

**I reproduced the outline's table** at x10, x12 and x14 with x2.0, plus the Bayarmaa row. The numbers match exactly:
at x12 / x1.8, 29, 26 and 25 actions at levels 17, 18 and 19, with 0 down.

The x7 / x1.6 row (outline:448) is **not** in the saved script; it tries x9 / x1.6 at 40% instead, which gives 21
actions. The ambush rows are not in it either. I re-ran those myself (section 4), and they match.

**My variants** (`ch7rev/rev-sim.ts`):

| x12 / x1.8, party 17 / 18 / 19 | Actions | Down | HP left |
|---|---|---|---|
| The outline's fair bot, the stand-in (200 magic) | 29 / 26 / 25 | 0 | 84% |
| The fair bot, Sold Secrets at 180 *physical* (the Fox's ATK) | 29 / 28 / 26 | 0 | 81-85% |
| The fair bot, 180 physical, and decoys that cast an 80 magic cut | 29 / 28 / 26 | 0 | 82-85% |
| **A plain bot: hits the Fox only, never Guards or Surges** | **23 / 22 / 21** | **0** | 79-80% |
| The plain bot, 180 physical, magic decoys, x10 | 20 / 19 / 18 | 0 | 76-81% |

(HP left is averaged over all six fighters, including the two benched at full health.)

**What this means:**

- **The decoys slow down only the player who engages with them.** Ignoring them is faster, because one-target blows
  that land on paper are wasted. Meanwhile the fair bot spends turns Guarding against Fold's tell, and Fold does no
  damage.
- **Kagemimi's reveal has nothing to unlock.**
  - A decoy has about 41 HP after Story's 0.8 (51 before), and dies to any hit.
  - The real Fox's HP bar barely moves when hit, while a decoy's empties (`BattleScene.ts:1099`). After one blow, the
    player knows which is real.
  - The real Fox is named "The Paper Fox" and the decoys "Paper Fox?" (the script, and outline:425).

  So "the Fox's decoys are a puzzle with no key" (outline:956) is backwards: there is no puzzle. Masking the real
  Fox's name **and** his HP bar until he is revealed is UI work that is not costed (outline:777 prices the reveal at
  0.2 days with no UI).
- **The stand-in is weaker than the Fox's knife.**
  - `enemyStats` scales ATK by `atkScale` but not MAG (`engine/battle.ts:520-529`), so the Fox's MAG stays 31.
  - The 200-power `magic` blow does about 39 to Yari after Story's 0.7 (`battle.ts:1030-1057`, `config.ts:263`).
    *Paper knife* (110 at ATK 98) does about 66.
  - So the sim's phase 2 is *softer* than its phase 1.
- **The real mirror is not much stronger.** Against Gianna (Falling Star at her MAG 52) it does about 69; against Yari
  (Aimed Shot, ATK 51) about 48. That is roughly the knife. The claim "the real *Sold Secrets*... hits harder than the
  sim's stand-in, which is the pressure the sim lacks" (outline:455-457) holds only against Gianna.

**Fix:**

1. **Sold Secrets.** Use the target's best skill's **power** with the **Fox's** stat (ATK for physical skills, ATK
   with `atkScale` for spells), so a copied Falling Star or Heavy Blow lands at about 110 to 130. Spell out in the
   `mirror` spec which stat is used and whether Story's 0.7 applies.
2. **The decoys.**
   - Give them a real move: a magic *Paper cut* of 70 to 80.
   - Mask the real Fox's name and HP bar as "Paper Fox?" until Kagemimi or the paper charm reveals him.
   - After the reveal, one-target blows reach him without interception, and **he takes +25% while revealed** (the
     built `marked`). Then Kagemimi saves turns, which is the point.
   - Cost the masking at about 0.1 days.
3. **Fold's tell.** Remove it, or word it as information ("The Fox folds a sheet...: another of him is coming") and
   teach "do not Guard". As it stands, the tell trains players to waste a turn.
4. **Phase 2.** `COMBAT.md:533` puts phase 2 at **40%**; the outline uses 50% without saying so. Pick one and record it.
5. **Measure** with a plain bot as well as the fair one. Accept "0 down" only as a decision made on purpose.

### 3.7 The maze and the posts: three contradictions in the counts and costs

- **The cost of a wrong turn.** outline:201-202 says a wrong turn "sets the party back at the gate". outline:667-668
  says it "costs about twenty steps". From junction 6, back at the gate is about 120 steps. Choose one:
  - (recommended) the fog returns the party **to the last junction**, a same-map door per wrong lane;
  - or say plainly that it is the gate, and add the cost to the length table.
- **The Echo shows six posts, but there are three patterns.** outline:660-663: "the agents light all three patterns
  across... six posts, two patterns each side". Six posts can show two patterns of three, not three. Use three
  junction-sized groups (nine posts) on the first lane, or teach two patterns and let "three white = straight" be read
  in *Sayo's Network* (the book already gives "the maze's idea", outline:629).
- **The marsh has five posts, but the code needs six.** outline:214-216 and 593-595: "light the five posts... in the
  code for *left, then right* (two white and a red; one white and two red)". That is two three-post signals, so six
  posts. Make it six posts, or change the signal.
  - Note also that with a three-way choice on each post there are 729 combinations for six posts (243 for five).
    Check "wrong: the posts go dark" against a player who has not learned the code (next item).

### 3.8 The route: the marsh gate on the quarter bypasses the maze, and a player can reach the marsh without the code

**The quarter has a marsh gate.** "The fishers' family at the marsh gate on the north-east" (outline:118-119, 588). The
marsh holds the fishers' huts *and* the signal tower's back door (outline:209-210). If that gate opens, the maze is
bypassable and Haru's "Sayo's way in" means nothing. If it does not open, the outline should say so. The outline never
does.

**Fix:** the gate is shut by the council's fog order. A guard's line: "The marsh road is closed while the fog holds.
The Hall's order." It opens from the marsh side after `story.causeway_lit`, as the way home. Add it to the soft-lock
list.

**The code can be skipped.** The maze can be walked without its Echo (the "second solution", outline:685-688). But K-3
needs `clue.lantern_code` (step 1, outline:591), and the back door needs K-3. A player who walked through without the
Echo reaches the marsh with no code, and the posts reset forever.

**Fix:** the far gap's step trigger, if `!clue.lantern_code`, plays Haru: "We walked it blind. Grandmother's people
did not. Back to the gate, and look." The Journal step and Anissa's hint then point back to the gate zone. Add a route
test that walks the maze without the Echo and still finishes.

### 3.9 Engine and staging work that is uncosted or impossible as written (the Ch6 review's 3.7 and 3.8, again)

- **Haru on the map is code, not data.** He opens the maze gate, cuts the seal, reads the proof, and walks to the
  pier (outline:188, 221, 274, 343).
  - The field's followers are hard-coded (`scenes/FieldScene.ts:239-248, 1544-1700`).
  - The stage's `borrowed` union is `'follower' | 'yari' | 'azzy' | 'samira'` (`FieldScene.ts:122`).
  - So Haru needs about 0.25 days of follower work (Bayarmaa's Chapter 6 follower is the same cost, and comes first).
    Or Haru is a placed NPC per scene.
- **Anissa holding Haru's lantern "for the rest of the chapter"** (outline:711-712). Anissa's look comes only from the
  disguise flag (`FieldScene.ts:1029-1031`), so there is no recolour by flag. Cost it, or make it the key item plus a
  line.
- **"The fog thinner on the lane the player is on"** (outline:189-190) is a look that follows the player, not static
  `above` data. It is not in the 0.05-day maze line (outline:782). Make it static, or cost it.
- **The voyage shore.** `VoyageDef.shore` is `'zetwal' | 'xaragua' | 'ardencia'` (`engine/voyage.ts:23`). Both
  `skarragol_kuroshi` and `kuroshi_jwaladesh` need a new shore (and art), and the voyage has no fog (outline:97).
  This is more than "one `VoyageDef`, 0.05".
- **The voyage waypoints.** outline:49-50 still sails "from (91, 91) south-west along the coast". The Ch6 review
  (3.11) found Ordvik's dot about 20 cells inland and fixed the start on Skarragol's south coast at about (100, 104).
  Kirinoura at (66, 106) and Agnipur at (37, 91) are also inland (`data/realmMap.ts:25`; `ch7rev/realm.mts`).
  - Kirinoura's nearest sea is the south coast at about (66, 114), or the west bay at about (54, 106).
  - Agnipur's is the bay at about (41, 100).
  - So `kuroshi_jwaladesh` is a short hop **across the bay**, not "west along the south coast". Change the caption.
- **Walkers move NPCs only, and only with exactly one placement leaving and one appearing**
  (`engine/walkers.ts:21-37`). Therefore:
  - the two lantern-lighters need distinct NPC ids;
  - Sayo's three agents in the maze (outline:194-195) need distinct ids;
  - the **boats** (outline:216-217, "walkers") must be stage `enter`/`walk` actors instead. A stage walk with no route
    falls back to a straight line (`FieldScene.ts:2037`), so they can cross the water.
- **The dusk variant as a flag "set when the second completes"** (outline:144, 519-520). Nothing sets it. Make it a
  condition on the variant layers, as the Ch6 review (3.11) asked for Ordvik.
- **The effort is underestimated.** Add up the follower, the lantern look, the fog look, two voyage shores and the
  decoy masking, and the real cost is about **2.25 builder-days of engine and wiring, not 1.5** (outline:789). The
  2.5-day plan (outline:986) does not hold with six maps, three puzzle files and about 285 lines.

### 3.10 Who fights, the token, the price, and small tone slips

- **Haru before Bayarmaa and Samira in `MEMBERS`** (outline:406-409, 718). The active four are the first four in list
  order (`engine/battle.ts:617`; `data/rpg.ts:239-310`), and there is no order screen. So from Chapter 7 on:
  - the default four are Gianna, Yari, Azzy and Haru;
  - **Bayarmaa is benched in the chapter right after her own,** and Samira stays benched (Ch6 review 3.9), even
    though the marsh's cutpurses are `bribable`;
  - Chapter 8's Vikram repeats the problem.

  **Fix once, realm-wide:** a `party.active` order with each joining chapter swapping the newcomer into slot four, or
  a small order screen. Do not add a third "placed before X" entry.
- **The token is given whatever is paid** (outline:329-331). This is the same conflict as the Ch6 review's 3.6.
  `SIDE-QUESTS.md` Se-5 says "given when its price is paid in full". Follow whichever rule the central session records
  for Chapter 6.
- **Kuroshi's price cannot realistically be the least paid** (outline:312-328):
  - K-2's +2, K-3's +1, the receipts' +2, the letter's +1 and the petition's +1 are all unmissable. That is 7 before
    the debate or any book, so the outline's "about 6" floor is really about 7 to 8;
  - Skarragol's Wealth is 2 to 8 (outline:63);
  - so Suzumori will almost never be the house the Crown buys, and Mibu's betrayer variant and Haru's "defies his house
    a second time" (`STORY.md` open question 9) will rarely play.

  **Fix:** the central session should set the four price ranges side by side, with currencies counted at half
  (`QUEST-BUILD-GUIDE.md:428`), before Chapter 8 is outlined. For example, make the petition and the letter pay only
  if a choice is made.
- **"Your mother's mother gave my grandfather..."** (outline:171), said to Kaede. The line is Genzō, Sayo, Kaede, Haru
  (`CAPITALS.md:607`; outline:633), so Sayo is Kaede's **mother**. It should be "Your mother gave my grandfather...".
- **"The Regent's supply ships"** in Sayo's slips (outline:238). Fifty years ago it was the Crown. Unless a Regent
  existed then, write "the Crown's supply ships".
- **`choice.fox_broken` lowers the marsh's cutpurse weight "for the rest of the chapter"** (outline:271). The route
  never returns to the marsh after the Fox, so the effect is invisible. Drop it, or apply it to the stacks.
- **Comedy beside Anissa:**
  - On the deck (outline:98-99), Samira's "price everything they don't say" sits in the same beat as Anissa's earnest
    "I can't see the water". Move Samira's line to the pier.
  - Anissa's debate line "I think they swapped" (outline:621-622) is wry. Reword it plainly, for example: "The quiet
    one wanted everybody to talk, Gigi. The loud one wanted everybody quiet." Drop "I think they swapped".

---

## 4. Claims checked

**Confirmed:**

- **The curve** (`config.ts:62`, `xpBase 50`, exponent 1.6). The tool line is 4,300 → 5,085 to 5,215 (level 18 to 19).
- **`CHAPTER_LEVELS` 7** is Kuroshi 17 to 19 (`data/chapterLevels.ts:22`).
- **Battle features:** `protects` with `INTERCEPT_CHANCE` 0.75 (`battle.ts:1295-1300`, `config.ts:222`); `hire` from
  the reserve with `HIRE_CAP` 2, counting hired foes standing at once, not in total (`battle.ts:967-981`,
  `config.ts:237`); `seize` to Gianna; `withdraws` at 0 HP; `endsWithBoss`; `BATTLE_ACTIVE` 4 (`config.ts:239`).
- **The Fox's stats.** x12 / x1.8 at 19 is about 1,757 HP and 98 ATK, as stated.
- **The Fox's table:**
  - x10 and x12 at x1.8, and x14 at x2.0, reproduced exactly, as is the Bayarmaa row;
  - the x7 / x1.6 row was not in the saved script.
- **The ambushes and the stacks** (re-run in `amb-sim.ts`, matching outline:469-471):
  - four moths at 17: 4 actions, 97% HP left;
  - two zealots and a Husher at 19: 7 actions, 90%;
  - three cutpurses at 19: 7 to 8 actions, 91%;
  - a plain bot gets the same results.
- **Ambush XP:** 10 x level x foes; 360 and 570 are right, and the 0.25 figures (90 and 143) are right.
- **Haru at 18:** hp 137, atk 55, def 28, mag 26, spd 52, the fastest fighter; Azzy has 189 HP.
- **Stage cues** (`stage.ts:25-39`). Same-map doors for the fog returns (`tiledMap.ts:128`).
- **Era rules.** `onEcho` fires only on a swap (`game.ts:409-437`). Each Echo scene here starts with a swap in its
  zone (the maze gate, Kayla's desk, the map wall), so the Ch6 review's 3.2 problem does not recur. `echo.*` flags are
  wiped on return; `anchor.*` and `clue.*` flags survive.
- **`followSide`** prefers a stop on the current map, and an accepted side quest's first unfinished step
  (`guide.ts:68-76`, 104-113). K-3 accepted early does not pull the arrow to the marsh, **provided its step 1 has no
  goal**. Write it that way.
- **The design sources.** `COMBAT.md:533` gives the Fox 7 / 1.0, with phase 2 at 40%. `PUZZLES.md` SIG-KUR's staging
  and hints match. `STORY.md` Chapter 7's beats are all present. The guide's foreshadow ("names the buyer's mark but
  not the buyer"; "gold flowing out of Ardencia") is covered, subject to 3.2.

**Not confirmed, or wrong:**

- the peg making the grid solvable, and the cheat test (3.1);
- "names the mark, not the buyer" (3.2);
- the Echo clerk filing the Ash Wars ledger (3.3);
- "Kayla... does what it says" (3.4);
- the played start of "18 (5,200)", "7,015, level 22", and the claim that the taper closes the gap (3.5);
- "the decoys are built so that Kagemimi matters", and "the real Sold Secrets hits harder" (3.6);
- the maze's wrong-turn cost, the six-post Echo, and the five marsh posts (3.7);
- the voyage's start and caption, and "one `VoyageDef`, 0.05" (3.9);
- "Haru as data, 0.2" (3.9);
- "about 6 to 16" Influence (3.10).

---

## 5. What is missing

- **The marsh gate's state** and a route that cannot bypass the maze (3.8).
- **A no-Echo maze route test** that still finishes the chapter (3.8).
- **A rotor test** that asserts the lanes stay shut without the peg under the chosen rule (3.1).
- **A battle test with a plain bot** for the Fox, not only the fair bot (3.6).
- **A recorded Claude's call for each of these:** Kayla's glyph card or her role; the buyer's list form; the Echo
  cipher rule replacing the ledger's filing; the phase-2 threshold; who fights after Chapter 7; the token rule.
- **The reviewer prompt** should ask for every Kayla line to be read against the locked rule. The keyword test does
  not catch implication (3.4).
- **The open items reminder** (outline:1047-1050) is present. Keep it.

---

## 6. Recommended changes (build order)

1. **Levels (central session, day 1, together with the Ch6 review's 3.1).**
   - Correct outline:56, 480 and 489-490.
   - Measure the played start.
   - Either cut the chapter's fixed XP to fit the band, or re-base the road tiers (a statement in the owner's milestone
     note).
   - Choose one ambush rule.
   - Update the hand-on to Chapter 8.
2. **The grid (3.1).** Make the loose screen slip back unpegged (recommended), or choose a start with a long unpegged
   solution. Re-run `grid.py`. Fix the cheats file and say whether the peg is pushable.
3. **The buyer's list (3.2).** No names on the marked line, or the mark at the list's foot. Drop "which line is
   shortest".
4. **The K-2 Echo (3.3).** Sayo's clerk teaches the shelving rule on a Revolution file. The Ash Wars row is worked out
   in the present.
5. **Kayla (3.4).**
   - The glyph card restores "helps decode the screens and the spy map".
   - Cut the Alcázar backstory, "say his name", and "Rodriguez".
   - She does not name the Quiet Crown.
   - Record these as Claude's calls in `FAMILY.md`.
6. **The Fox (3.6).**
   - Sold Secrets uses the copied power with the Fox's stat.
   - The decoys get a real move; the real Fox's name and HP bar are masked until revealed; revealed means `marked`.
   - Fold has no Guard-baiting tell.
   - Phase 2 is 40% or 50%, on record.
   - Bot tests with both bots.
7. **The maze and the posts (3.7, 3.8).**
   - A wrong turn returns the party to the last junction.
   - The Echo shows nine posts, or teaches two patterns plus the book.
   - Six marsh posts.
   - The marsh gate is shut until `story.causeway_lit`.
   - The "walked it blind" trigger at the far gap.
8. **Costs and staging (3.9).**
   - Budget Haru's follower, the lantern look (or cut it), static fog, two voyage shores and the decoy masking.
   - Fix the voyage waypoints and captions.
   - Give walkers distinct NPC ids; stage the boats.
   - Make the dusk a condition.
9. **Party and price (3.10).**
   - A realm-wide active-order rule.
   - The token rule from Chapter 6's decision.
   - Set the four houses' price ranges side by side.
10. **Small fixes (3.10).** "Your mother gave my grandfather"; the Crown's supply ships; drop the fox-broken marsh
    effect; move Samira's deck line; plain wording for Anissa's debate line.

**Owner questions:** none required. The only owner-settled line touched is Kayla's role, and fix 5 restores it rather
than changing it. Re-basing the road tiers in 1 is a statement in the milestone note, not a pop-up.
