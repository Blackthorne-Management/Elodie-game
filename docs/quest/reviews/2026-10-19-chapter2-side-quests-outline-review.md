# Review: Chapter 2 side quests outline (Oct 19)

*Independent second review of `docs/quest/reviews/2026-10-19-chapter2-side-quests-outline.md`, for the owner. Nothing
in the game was changed. Code is quoted from the committed state (`HEAD` = `1ad9819`, which already has Batch D and the
merged debate quest *Owned or Remembered*). The numbers come from replaying `quest/routes/zetwal-act1.json` through
the simulator, plus 80-seed battle simulations of the caney fight and the Thorne fight at higher party levels (the
same method as the earlier balance checks). The scripts used are in the scratchpad, not the repo.*

---

## Verdict

**The outline is sound in its shape and safe to build after five corrections.** Its placements and its single gate
before the proof scene would not soft-lock a new game. The five quests fit the story that is built. The two Echo
puzzles need data and drawings but no new engine features. The cuts are reasonable.

There are three real problems:

1. **The level arithmetic is wrong, and Chapter 2 would end two to three levels high.** The outline says the party
   reaches the attack at level 8 and ends the chapter at level 9. Even by its own inputs, the party reaches the attack
   at level 9 and Thorne at 9 or 10. It also leaves out about 150 XP that the engine pays automatically. Thorne stops
   being the "hard" boss the chapter was built around, and the caney fight turns grey ("trivial"). Chapter 3's
   design, where Rael is three levels above the party, would break.
2. **The pacing comparison is out of date, and the chapter would be about twice as long as Chapter 1.** Batch D
   shortened Chapter 1 to 798 steps. The outline compares against 1,069. With roughly 600 to 750 steps added, Chapter
   2 grows from 1,023 to about 1,650 steps. The arrow also leads its followers up the mountain twice.
3. **Saves already past the attack would show four unfinishable mystery quests for the rest of the game.** Only the
   debate quest already has the guard against this.

The "dusk" gate also has a story cost the outline does not mention. It halts the chapter at its most urgent moment,
and the elders are sitting in plain view in daylight. A better place for the gate exists (see D3), and the owner
should choose between the two.

---

## Where I agree

- **Every side quest lives in the free city, before the attack.** This is the only workable shape. All the givers are
  hidden once the Crown takes the city (`quest/tools/maps/xaragua.ts:141,146,355,481`, `{ if: PEACE }`), the Mountain
  Path ambushes stop then (`xaragua.ts:408`), and the camp empties at the refuge (`xaragua.ts:438`).
- **One gate, done "through the side quests", like Chapter 1's *Unfinished business*.** It reuses `followSide`
  (`quest/src/engine/guide.ts:69`) with no new mechanism. The escape clause for old saves (`story.proof_shown` also
  counts as done) is correct.
- **Cut Nets without its fight.** The Yield step really is not built: the engine has no Yield at all, and it exists
  only as a design in `COMBAT.md` 7.1. My reason for agreeing differs from the outline's, though (see D6).
- **Medicine moved to the hill camp, and one line changed in the occupied city's bark errand.** The built book
  already sets the quest up ("the grove above the cave, where Caona's scouts used to camp", `books.ts`, *A Healer's
  Notes*). The occupied-city errand stays as the envoy's pretext for seeing Anaco, and Anaco is already shown "steadier
  for the bark". This is a small, honest fix.
- **Not building Caona's Conch now.** I agree it should not be built now. I do not agree with the home the outline
  proposes for it (see D5).
- **Oil From a Stranger and the hill camp.** They give the camp, the Mountain Path and the ash thumbprint
  (`xaragua.ts:444`, already on the map) a reason to exist. The staging (the scout runs to the palisade, the leader
  taps the print) follows the owner's show-don't-tell rule.
- **The debate quest is compatible.** The merged quest *Owned or Remembered* (`quest/src/data/sideQuests.ts:129-150`,
  tests in `quest/tests/springsQuest.test.ts`) uses the same debate flags the outline's gate checks
  (`debate.xaragua_springs.joined|mediated`), and its `available` already stops at the attack. Two small mismatches
  are listed under D8.

---

## Disagreements and risks (most serious first)

### D1. The levels: the outline under-counts by one to two levels, and Thorne stops being hard

**Measured today (the route, no side quests):** 880 XP at the attack (level 7, one XP over the line). Thorne is
fought at 1,070 XP (level 7 against his level 9: "hard"). The chapter ends at 1,315 XP (level 8). These match the
outline.

**The level thresholds** (`config.ts` LEVELS: 50 × (level − 1)^1.6): level 8 = 1,125, level 9 = 1,393,
level 10 = 1,682, level 11 = 1,991.

**The outline's own inputs** are 310 quest XP plus "two or three ambushes, 80 to 120 each", about 250 XP. They give
880 + 560 = **1,440 at the attack, which is level 9, not 8.** Thorne is then fought at about 1,630 (level 9: even), and
the chapter ends at about 1,875 (level 10, not 9).

**What the outline leaves out:**
- **Every flag in an objective's "done" condition pays 25 XP.** `quest/src/data/rpg.ts:304-305` counts each flag in
  an objective's `done` as story XP unless the objective is marked `noXp`. Batch D added `noXp` (`engine/quests.ts:25`)
  for this purpose. A gate objective listing the four quests and the debate pays about +125 XP. If it also lists
  `story.proof_shown`, which the proof objective already pays, that flag is paid a second time (+25).
- **The debate quest as built pays 60 XP, not 30** (`sideQuests.ts:149`).
- **Winning or mediating the debate pays a further 15 or 25 XP** (`config.ts:240-241`). Each Song House book read
  for Reason pays 10.

**The ambush count is lower than the outline thinks.** On the path finder the mountain is only 36 steps each way.
The first 18 steps on a map are safe (`config.ts:48`), and each step after that has a 3% chance (`config.ts:47`).
That is about one ambush per round trip, and about two if the player climbs twice (see D2). So ambush XP is 100 to
200, not 250.

| Case | Added XP before the attack | At the attack | At Thorne (level 9) | Chapter end |
|---|---|---|---|---|
| Today | 0 | 880, level 7 | 1,070, level 7 (**hard**) | 1,315, level 8 |
| Low (one climb, gate `noXp`, debate 30 XP) | about 435 | 1,315, level 8 | about 1,505, level 9 (even) | about 1,750, level 10 |
| High (two climbs, gate pays XP, debate 60 XP) | about 755 | 1,635, level 9 | about 1,850, level 10 (even) | about 2,095, level 11 |

**Battle simulations (80 seeds each, simple play):**
- **The caney fight (level 6):** party level 7 loses 29% of its HP. At level 9 it loses 20%, and the foes show grey
  ("trivial": three levels below).
- **Thorne (level 9):** at party level 7 (today), the party wins 74 of 80 and loses 47% of its HP. At level 9 it wins
  80 of 80 and loses 38%. At level 10 it wins 80 of 80 and loses 33%.

**This conflicts with a design the owner set.** `STORY.md:280` (Chapter 3, owner, Oct 15) says: "Rael is level 11,
three above the party at the chapter's start". That means the party should end Chapter 2 at level 8. The outline says
"Chapter 3 wants 8 to 11, ending at 9 is right where Chapter 3 wants the party". Level 10 or 11 makes Rael an even
fight. The outline's fallback ("10 XP less per quest") removes only 50 XP, which is far too small a correction.

**Recommendation:** pay these quests mostly in gold, items and Influence, which is what they are for, and keep the
XP small. Give 20 to 30 XP each (Chapter 1's band) and mark the gate objective `noXp: true`. That lands the party at
level 8 for the attack, about 9 for Thorne and about 9 at the end. Then the owner chooses one of two:
- (a) accept Thorne as an even fight and Rael as two levels above the party; or
- (b) raise the three night fights by one level each in `data/battles.ts` (caney 7, patrol 7, Thorne 10). This is a
  data change.

This is an owner decision, and the outline makes it silently.

### D2. The arrow takes an arrow-follower up the mountain twice

How the arrow works (`guide.ts:69` and `:97`): while the gate is the current objective, the arrow goes to the
**first accepted quest in the list**, at that quest's **first unfinished step**. Only when no quest is accepted does it
go to the first quest not yet started. Oil's last step is "tell the lamp-oil seller", down in the village. So the arrow
takes the player up to the camp for the oil, back down to the village, then to the healer in the caney, then up the
mountain a second time for the grove.

The outline's "one trip up the mountain does both" holds only for players who plan the trip themselves. I measured
one round trip (plaza, village, gardens, mountain, camp, and back to the caney) at about 300 steps. A second trip adds
about 300 steps and one more ambush.

There is a second effect. Before the gate, the arrow follows the main story and ignores the side quests. A player who
only follows the arrow therefore does all five quests in one block after the oath stone. The outline's "the gate turns
into a short 'what is left'" is true only for players who explore.

**Fix without engine work:**
- Oil ends at the camp: the leader pays, and the seller gets her news through a staged line later.
- Oil sits before Medicine in the list.
- Both are offered inside conversations the main story already walks through: Medicine at Anaco's bedside (the
  healer is in the room), Oil in the lamp conversation.

Then the arrow makes one climb. The alternative is a small, tested change to `guide.ts`: prefer a quest goal on the
map the player is on.

### D3. The "dusk" gate halts the chapter at its most urgent moment, and the dusk is told, not shown

- **The urgency.** The built story is at full speed here. Gianna's last line at the oath stone is "Then we make the
  elders read it before the Crown can say anything" (`dialogue/xaragua.ts:870`), and Anaco has already warned "If
  they vote yes, the harbor is the Crown's by morning". The gate then sends the player on 600 or more steps of errands
  before the climax. The outline counts only "one line at the oath stone" as changed. Line 870 and the proof
  objective's hint ("We have it now, Gigi") would have to change as well.
- **What the player sees.** The three elders sit in the council circle all day (`xaragua.ts:478-480`). An elder who
  walks over to say "come back at dusk" while the council visibly sits behind him is a contradiction on screen. The
  proof scene opens with them "talking low by a single lamp" (`xaragua.ts` dialogue `:263`). The engine can already
  show dusk with data only, through `MAP_MOODS` (`quest/src/assets.config.ts:507`, which the occupied city uses): when
  the last quest is done, wash the outdoor maps in dusk and light the elders' lamp. Without that, "dusk" is narration,
  which the owner's rule does not allow.
- **A better place for the gate, for the owner to weigh:** between *The Governor's eye* and *A light for the cave*.
  Thorne has just let Gianna know he is watching, and all five quests are already open at that point (the outline's
  own opening conditions). The lamp-oil seller lends the lamp at dusk, when the night canoe brings oil and the
  Governor's glass is off them. Anissa or Yari can say it out loud: "Let him watch us do ordinary things all day."
  Cave, areíto, lock, proof and attack then play without a break, so the climax keeps its speed, and the "Thorne's
  watcher" payoff gets stronger. The old-save escape becomes `item.oil_lamp`. The costs: the debate is reached with
  fewer Song House books read, and the hutia's growth puzzle comes before the cave's sluice puzzle (harmless, since
  Chapter 1 already taught the Echo). Both placements are free of soft-locks. The outline offers only "dusk or Yari
  refuses" and does not mention this one.

### D4. Saves already past the attack would show four dead mystery quests for the rest of the game

The outline's `available` conditions are "after the pier", "after Thorne" and "after Anaco", with no end. A mystery
quest shows on the Quests page as "??? <place>", with a minimap dot at its giver and Anissa's nudge, whenever
`available` holds (`guide.ts:74`). Any save made before this build that is already in the occupied city, or in later
chapters, would carry four "??? ..." entries forever, with dots on givers who are no longer on the map.

The debate quest already avoids this (`sideQuests.ts:137`: `{ not: f('story.crown_attack') }`), and so does its test
(`springsQuest.test.ts`, last case). **Add the same guard to all four quests, and the same test for each.**

### D5. Caona's Conch: "defer to Chapter 11" quietly redesigns an owner-approved item

The Conch is item 3 of 9 in the difficulty order (`SECRET-ITEMS.md:16`, "4 Moderate-hard"). Its reward is free sea
travel and hidden coves in Zetwal, Al-Doria and Kuroshi, which is worth something in the middle of the game.
Chapter 11 is levels 25 to 28 (the `STORY.md` table) and comes near the end. There the puzzle would be easy, the
cave's level 5 to 7 crabs would be pointless, and the reward would arrive with little left to use it on.

The outline also does not mention that **Chapter 1's secret item (Z-4, Solange's Quill) is not built either.** So the
real owner question is a policy that covers both items: are secret items a later, optional pass inside their own
chapters, or do they move? The outline is right that the Conch needs engine work that does not exist yet. The game
has no resting, no tide states and no pushable raft (none of these appear in `engine/game.ts`).

Deferral does not break the chapter gate rule. But a Chapter 11 home means the item cannot be built until Chapters 3
to 10 exist. The owner should hear that cost before deciding.

### D6. Cut Nets: the right cut, for the wrong reason

The outline argues that "a second brawl with marines in the free city muddies the story". But the Mountain Path's
ambushes, which the outline keeps, are Crown marines in the free city too ("Two Crown marines come down the path...
'Papers. Now.'", `data/encounters.ts:74-83`), and the pier fight is a brawl with marines. The honest reasons are:

- the Yield step is not built (verified); and
- the party is already over-levelled (D1).

The owner should hear those reasons. If the owner wants an authored fight in Chapter 2's side quests, the place for
it is once Yield exists, not now.

### D7. Length: the chapter would be about twice Chapter 1's

| | Steps | Map changes |
|---|---|---|
| Chapter 1 today (after Batch D) | 798 | 18 |
| Chapter 2 today | 1,023 | 37 |
| Chapter 2 with this outline | about 1,620 to 1,770 | about 55 |

The outline compares against Chapter 1's old 1,069 steps and calls the result "a little above". Even against 1,069 it
was 50% above. `STORY.md:19` budgets 40 minutes for Chapter 2 against 35 for Chapter 1.

The outline's 280 steps for the mountain pair is about right for one climb (I measured about 300 for the round trip
alone, before the Echo and the camp). For an arrow-follower it is about 550 to 600 (D2).

**Trims that cost no story:**
- the single-climb fix in D2;
- the hutia's trail of shiny things kept inside the gardens;
- at least one of the three nets placed on ground the main story already walks.

All five quests can stay. They just need to be shorter.

### D8. Smaller mismatches

- **The debate quest.** It is built with `place: 'Yucayeque'` (`sideQuests.ts:132`), so it shows as "??? Yucayeque".
  The outline and Chapter 1's style use the section name ("??? Harbor Village"). It pays 60 XP; the outline says 30.
  It is the last entry in the list, so if the four new quests are added after it, the arrow sends the player to the
  debate first. Insert them before it to get the outline's order.
- **Book name.** "The Charter of Protection" does not exist. The Reason book is *The Charter (seized copy)*
  (`data/debates.ts` `reasonNeeds`).
- **Influence for Mediate.** Mediate needs 5 Influence. Listening to the debate already gives 1
  (`DEBATE_LISTEN_INFLUENCE`), and the caney's record shelf counts as well as the Song House. So Mediate takes four
  books, not five.
- **The proof trigger's tile.** The trigger is at caney 9,6, which is just inside the circle. The doorway is 10,6,
  where the council-scene trigger sits.
- **The open-items reminder at the end is stale.** The board proof was approved on Oct 19 (`docs/PRODUCTION.md:18`).
  The outline says the owner "still has to approve" it.

---

## Echo puzzles: what the engine already does, and the hidden work

**Already supported, data only:**
- Echo zones gated by a condition.
- Anchors (an `anchor.*` flag set in the memory).
- Objects in the present that swap on that flag and glow on the way back (`engine/game.ts`, `swap` and
  `anchorChanges`).
- "Climbing the fork" is just a conversation on the swapped tree.

**Not mentioned in the outline (no engine changes, but real work):**
- **New drawings.** A sapling, a stake, a forked ceiba, stumps, a young grove, the camp's rocks, three nets, oil jars
  and the trinkets. Each needs a tileset entry in `assets.config.ts` and pixel art in `assets.pixels.ts`. "No art
  drop needed" is true, but this is still work.
- **Camp map edits.** The camp has no rocks, stumps or old road at its north end (`xaragua.ts:416-446`). For the grove
  puzzle to be fair (guide 6.2: solvable from what is visible), the present must show the old road cut through the
  flat ground, so "where isn't flat?" can be read off the map.
- **The wrong-planting outcome** needs a second anchor flag and its own object.
- **Echo characters must stay off the zone tiles.** The swap is refused if an Echo character stands on the tile the
  player would land on (`world.ts` `checkSwap`).
- **Two versions of each scene, and a date for each memory.** Both Echoes need a version for before Caona joins and
  one for after, which doubles their dialogue. Each memory also needs a fixed date after the oath, because at the
  areíto Caona meets Patricio for the first time ("You came across the sea to ask for my scouts").
- **New characters** (the scouts, Caona's healer) need entries in `npcs.ts` and `speakers.ts`.

---

## The outline's claims I checked

| Claim | Result |
|---|---|
| Chapter 2's route: 1,023 steps, 37 map changes, 261 lines, 4 choices | **True** (262 lines after Batch D) |
| Levels: 5 on landing, 6 at the oath stone, 7 at the attack, 8 after Thorne; Influence 0 | **True** |
| Chapter 1: 1,069 steps, 32 map changes | **Stale:** 798 and 18 since Batch D |
| Positions: fisher 18,20; seller 23,10; girl 16,14; carver 16,3; diver 30,10; healer 30,5; camp leader 15,11; scout 19,8; thumbprint post 17,10; debaters 9,7 and 13,7; salt pans include 26,13 | **True** |
| Every giver hidden at the attack | **True** (the camp's two empty at the refuge, later) |
| Mountain ambushes are levels 4 to 6 and stop at the attack | **True** |
| The map's condition text allows "or" with `\|` | **True** (`conditions.ts`) |
| Echo zones with anchors need no engine work | **True** (drawings and map edits still needed) |
| The Conch needs a tide system and a raft the engine lacks | **True** |
| Yield is not built | **True** |
| Crit can be an item special | **True** (`engine/rpg.ts`) |
| "Where the canoes slept" is already used by the escape | **True** (`dialogue/xaragua.ts:966`) |
| The attack is level 8 with quests; the chapter ends at level 9 | **False** (D1) |
| "A little above Chapter 1" | **False** (D7) |
| One trip up the mountain does both quests | **Only for players who plan it; the arrow climbs twice** (D2) |
| "No soft-locks" | **True for new games; old saves past the attack show dead entries** (D4) |

---

## What the outline decides without asking the owner

- How much XP these quests pay and what level the chapter ends at, against `STORY.md`'s Chapter 3 design (D1).
- That the elders' "dusk" is a gate, plus the line changes it forces on the urgent oath scene (D3).
- That Anaco is cured and then falls ill again. The outline's question 4 asks only about the tone of his line.
- The design's Medicine reward ("+1 round advantage in the council debate") is dropped. This is justified, since that
  debate was replaced by the attack, but the owner should know.
- X-3's giver moves from "three angry market sellers" to the small girl. This is fine, but it is a change from the
  design.
- The debate's XP (30 against the built 60) and its Journal place name.

---

## The owner questions

The outline's four questions are fair. The owner's rule is one question at a time, each with its reason, so the
coordinator should ask them in this order:

1. **Where the gate sits:** at dusk before the proof (the outline), or at the lamp, after Thorne's warning (D3)?
   This decides the pacing of the chapter's climax.
2. **XP against difficulty:** keep Thorne hard by paying these quests little XP, or raise the night fights by one
   level (D1)? This decides whether Chapter 2's boss and Chapter 3's Rael still work as designed.
3. **Secret items policy, for the Quill and the Conch together (D5):** a later optional pass inside their own
   chapters, or moved? This decides whether an approved item vanishes for ten chapters.
4. **Cut Nets with or without a fight** (the outline's question 2, with the honest reasons from D6).
5. **Anaco's line when the cure works** (the outline's question 4).

---

## Recommended changes to the outline before building

1. Rework section 7's numbers using D1's table. Add `noXp: true` to the gate objective. Set the quest XP to 20 to 30
   each, and decide between (a) and (b) with the owner.
2. Add `!story.crown_attack` to every new quest's `available`, with tests (D4).
3. Make Oil end at the camp, list Oil before Medicine, and offer both inside main-story conversations, so an
   arrow-follower climbs once (D2). Add new quests before *Owned or Remembered* in the list.
4. If the dusk gate stays: show the dusk (a `MAP_MOODS` wash and the lamp lit), and rewrite the oath-stone line
   (`dialogue/xaragua.ts:870`) and the proof hint so they no longer promise urgency. Otherwise move the gate to the
   lamp (D3).
5. Re-measure against Chapter 1 as it is now (798 steps) and trim to roughly 400 to 500 added steps (D7).
6. Add the hidden work to the build plan: drawings, camp map edits, the wrong-planting anchor, two-version Echo
   dialogue, and each memory's date relative to the oath.
7. Fix the small mismatches in D8, and change the Conch question to D5's form.
8. Update the open-items reminder: the board proof is approved and orders Mon Oct 20, art drop 1 is Fri Oct 24, and
   rules and card text freeze Fri Oct 31.
