# Second review of the Batch D outline (Oct 19)

*Independent review of `2026-10-19-batch-d-outline.md`, written for the owner. I read the outline, the Oct 17 demo
review (findings 5 and 11), `STORY.md`, `SIDE-QUESTS.md`, and the code it proposes to change, and I replayed the
scripted route through the simulator myself. No game file was changed.*

---

## Verdict

The direction is right: doing the island's side-quest work on the way out, the engraver coming to the Hall, the boar
on the way back, and a staged farewell do answer finding 5, and remembered choices answer finding 11. But the
outline gets a few important things wrong. **The gold arrow will not follow the new path**, so most players would not
get the shorter walk. **The consul scene repeats Chapter 2's council scene almost line for line, and gets Elodie's
travel time wrong.** **Moving the cane cutter leaves gaps** for players who start his quest early and for Chapter 3's
return to the city. All three can be fixed before building, and the owner should see them before saying yes.

---

## Where I agree

- **The diagnosis is accurate.** The papers errand really is a nine-map loop (`quests.ts` 143-160; route lines
  86-113), and *A Name in the Cane* really does cross the city four times (`sideQuests.ts` 64-84).
- **Decision B (the engraver walks the seal to the Hall)** is the cheapest way to remove the Market loop, and it keeps
  his best line and the clerk, then Chancellor, order from STORY beat 9a.
- **The boar comes straight after the Cane Road Echo.** The Echo zone (`zetwal-road.ts` 54, tiles 2-4) sits before
  the boar's trigger line (x = 9, line 52), so this order works on the map as it is.
- **Showing the Charter instead of telling it** is the right instinct for finding 5, and the outline uses the people
  already on the Hall map.
- **The farewell.** Grandfather's farewell node exists (`zetwal.ts` 950-956), and in the main game no player can
  reach it, because the voyage starts at once. Staging it at the dock is a real gain at little cost.
- **The choice callbacks fit what the review asked for.** The review asked for one callback line (finding 11); the
  outline remembers three choices and pays each one off. Both "same next" claims hold (`zetwal.ts` 1143-1144 and
  185-186).
- **The "tonight" fix is correct and needed.** In `xaragua.ts` 518, 520 and 525, "two nights" is said, and in the
  same conversation the next node (530) says "tonight". STORY.md says "tonight".
- **The engine changes nothing.** `src/engine` stays untouched: walk, enter, exit, look, face, wait and sync are
  enough for the people in these scenes (with the exceptions below).

---

## Where I disagree or see risk (most serious first)

### 1. The gold arrow and Anissa's hints will lead players the old way, so the savings are mostly on paper

The outline says "the gold arrow, Anissa's hints and Yari's checks follow the same path" (Section 2) and also "the
Journal keeps its objective order (papers, boar, side quests, sail)". Both cannot be true. The arrow points at
**the current objective's goal** (`src/engine/guide.ts` 66-71). After the dock, that objective is *The envoy's
papers*, so the arrow sends the player across the bridge to the Hall, then to the boar, and only then to the side
quests, through `followSide`. The island's side-quest stops (the stones, the archive) come up only after the boar,
which brings back the crossings the outline is trying to remove. The ~500-step figure is what the scripted route
walks, not what an arrow-following player walks.

Fix (an owner decision): either put a short first objective on the island ("Before we cross back": the cutter at the
stones and the archivist), or merge papers, boar and side quests into one objective whose goals are ordered by
place. Then measure an "arrow follower" walk as well as the route.

### 2. The consul scene repeats Chapter 2's council, and two of its lines contradict the story

Compare the draft (Section 3) with `xaragua.ts` 172-191, the elders' council:

| Chapter 2 council (built) | Proposed consul scene |
|---|---|
| Crown man with the Charter: "It rests on the seventh clause of the Accord, as signed." | Crown man with the Charter: "under the seventh clause of the Accord" |
| Yari: "Then show us the seventh clause." | Chancellor: "Show me the clause." Then Gianna's choice: "Show us the clause." |
| Liaison: "...The Governor holds the original." | Consul: "It is at the Throne, under seal." |
| He walks out. | He walks out. |

- **It takes the surprise out of Chapter 2.** The seventh clause is named in front of the player, the "show us"
  demand is made and refused, and the Crown man leaves. When the liaison does exactly the same in Xaraguá, it is a
  rerun. The Journal note *The seventh clause* (`quests.ts` 446-450) is written as a Chapter 2 discovery.
- **The two scenes disagree about where the original is.** The consul says it is "at the Throne, under seal". The
  liaison says "the Governor holds the original". One of them must be lying, and the game never says so. Chapter 5
  (STORY 325-328) agrees with the consul, so the liaison's line would need a change or a reason.
- **"She has, I believe, just arrived" is wrong.** Elodie's carriage left that afternoon (`zetwal.ts` 84: "A few
  weeks. Maybe longer"). The couriers say the far coast is three days away (`zetwal.ts` 1471, 1537). And Thorne's later
  line is "She is very far away" (`xaragua.ts` 215).
- **Zetwal has its own copy of the Accord.** The Hall clerk says "The original? Sealed in the vault"
  (`zetwal.ts` 1360). Chapter 1 is meant to teach "seven ribbons and six clauses" (STORY 127). A Chancellor who is
  told about a seventh clause in her own Hall and does not mention her own vault copy will look odd to an
  archivist's player, and the outline does not say what she knows. It also overlaps the "Last Evening" proposal
  (STORY beat 10: the clerk shows the blank seventh line). The owner needs to decide how much the Chancellor knows.
- **The consul's lines copy Thorne's.** "Miss Limyè", "Do give your mother my regards", and "Your mother also knows
  when to say nothing" all echo Thorne's first scene (`xaragua.ts` 210-219), where he says his mother "signs what is
  put in front of her". Thorne's insinuation is weaker if the consul makes it first.
- **The time of day is off.** The scene happens after the names were read "until the moon is high"
  (`zetwal.ts` 992), yet the consul brings "the same paper as every morning". The lights going up across the city
  would be a better reason for a late visit, and would tie the scene to the lamp.

Fix: keep the consul walking in, but give him a **different demand** that does not use Chapter 2's lines. For
example: Zetwal should "acknowledge His Majesty's protection of the southern waters", with no clause named, and a
deliberate look at Anissa. Keep "Show us the seventh clause" for Yari in Xaraguá. Or keep the clause and change
Chapter 2's council so it builds on this scene instead of repeating it. Either way it is a story decision (see
Questions).

### 3. Moving the cane cutter (Decision A) leaves cases the outline does not cover

- **Players who start the quest early.** The quest becomes available after the war room (`sideQuests.ts` 67,
  `available: story.warroom_echo`), well before the bridge. Today a player can accept it on the Cane Road before the
  lamp. The outline only describes the cutter at the stones after the lamp. If he stays on the road before the lamp,
  then every goal pointing at him, the quest's `start`, the "tell him" step (line 81, road 6,10), the `place` field
  and the `nudge` ("on the road past the east gate", line 71) all need conditional versions. If he is not on the road
  before the lamp, the quest becomes later than SIDE-QUESTS.md says ("most can be done before or after the Locket",
  line 120). Either way it needs saying.
- **After Chapter 2.** The cutter's `danger` node (`zetwal.ts` 1747-1752, "You came back at a bad time... Keep to
  the road") is for the return to Zetwal (`story.zetwal_return`), which `?chapter=3` starts in. He has to be back on
  the Cane Road by then. That needs a second placement with an `if`, which the outline does not list.
- **His lines would be wrong at the stones.** The `calm` and `grann` lines (1737-1759) say "Festival day... the
  road is as peaceful", "the names are read tonight", and point to the veiled woman by the mill. At the stones after
  the reading these are all false, and the only pointer to the optional Quiet Crown watcher (STORY beat 10) is lost.
  His last line, "Tonight I will say it so loud..." (1796), also comes after the reading has ended. The table's
  "unchanged in substance; his first line moves" understates this: it is a rewrite.
- **Yari's boar warning** says the boar "charged three cane cutters this morning" (1198). It still works, but the
  road will now have no cutter on it.

### 4. The build order breaks the tests between steps

"Each step ends with `npm test`", but `act.test.ts`, `guide.test.ts` and the chapter-starts check all replay the
route. Step 1 (the engraver walks in, so there is no Market visit and no second clerk talk) breaks the current route
at once. Route edits have to happen inside steps 1 and 2, not wait for step 3. Step 5 also changes the soup
vendor's conversation (choices that flow into the errand), and the route relies on that conversation's choices. If
step 3 rewrites the route and step 5 then changes the soup flow, the route breaks again, and the chapter starts go
stale again (new `choice.*` flags). Better: make every change to a conversation's shape first (steps 1, 2, 4, 5),
then rewrite the route and regenerate the starts once, then measure.

### 5. Port to the demo "file by file" would break the demo

The outline says the demo's Chapter 1 files "differ only by Chapter 2 content" and are "copied across file by file".
The first part is true. The second does not follow from it. The demo's `zetwal.ts` has no Chapter 2 return scene,
no `Y` constant, and a different `depart` line: it sets only `act1.complete`, with no voyage. Its `quests.ts` has no
`ACT2`, and its route and tests differ. Copying the main game's files over would bring Chapter 2 into the demo, or
break it. The port has to be a hand merge of the Chapter 1 parts (the farewell especially, since it sits in
`depart`). It also has to keep the demo's own route. The farewell node is reachable in the demo today (no voyage
follows), so the demo needs a check that the scene does not play twice.

### 6. Old saves in the middle of the papers errand

`story.papers_asked`, `item.elodie_seal` and `story.papers_sealed` are stored in saves. A tester who saved between
the clerk and the engraver (the demo has been out since Oct 17) will load into the new flow holding the seal, or
with the clerk waiting for it. The outline proposes deleting these flags and the item. The code already cares about
old saves (`zetwal.ts` 1231-1233, "A save that finished Chapter 1 before the ferry existed..."). So: keep the
clerk's `issue` branch for a held seal, send `papers_asked` into the new scene, and keep the two item definitions in
`rpg.ts` (36-48) so the bag can show them.

### 7. Staging details that the engine cannot do as written

The cue list exists (`src/engine/stage.ts` 25-41), and the walk, enter and exit parts are feasible. Three promises
are not:
- **"He lays it on the desk, over Gianna's papers"** and **"picks up the papers from under the Charter"**: there is
  no cue for objects. Either narrate it in one line (acceptable, since the people still act it out) or add a desk
  object with an `if` and a `sync`. That is a small map edit, not engine work.
- **"Yari pushes off"**: the canoe is a map object (`yari_canoe`, `zetwal-temple.ts` 32), not an actor, so it cannot
  move. Yari can walk to it and disappear, and the voyage scene's opening ("Yari paddles out", `voyages.ts` 13)
  already shows the push-off. Say that, rather than promising it on the map.
- **The consul "is gone afterwards"**: a borrowed map person who exits is put back at home when the scene ends
  (`FieldScene.ts` 1956-1962). To keep him gone you need a new flag and an `if` on `crown_consul` in `zetwal-hall.ts`
  (line 115), which means a map edit and rebuild. The outline says "the map's tiles are not touched", which is true,
  but object placements are touched for the consul, possibly the engraver, and the cutter. `npm run maps:build`,
  `validate:maps` and `maps.test.ts` belong in the plan. The lines "The Crown's consul waits too, across the room"
  (`zetwal.ts` 1517) and "the consul is watched at all hours" (1489) go stale too.
- **Pacing**: the consul walks from (9,19) through the west door, up the gallery and into the east office: about 35
  tiles with the camera following. Start him nearer (at the office door, or by having him wait in the gallery) so the
  scene does not stall.

### 8. The engraver's line no longer makes sense where it is

"I don't hand it to just anyone. Let me see you..." checks Gianna before handing her the seal (`zetwal.ts` 1606). In
the Hall, the clerk, and the Keeper of the Seal down the gallery (`seal_keeper`, 1521-1534), are standing right
there and are who the seal is for. He would hand it to the clerk. The scene also needs a reason why he walks in at
that moment (the clerk sends the page running and he comes back with him, or he was bringing it back anyway now that
it is finished). The line can stay if he hands it to the clerk and only looks at Gianna ("Her eyes...").

### 9. Smaller voice and continuity points in the drafted lines

- **The dock payoff replaces the wrong line.** If Gianna's "The Sun Accord. The seventh clause..." (1141) is
  replaced, Yari's next line, "That's what they called it" (1142), answers nothing. Add the new line before it, don't
  replace it.
- **The Grandmother payoff runs into her next line.** After the "why" variant comes the existing "Good. Then she
  can't scold me for this." (637), so "Good." is said twice in a row. One of them needs adjusting.
- **The soup payoff's logic is tangled.** "I said I'd save it. Nobody ever made me keep that promise before": she
  made the promise and Gianna did the carrying. Also, the greeting can be met more than once, before and after the
  war room, so both soup flags could end up set. Say "the first answer counts".
- **"You look busy." becomes redundant** if both other answers now flow into the errand.
- **Yari's "paddle this far on a guess"** clashes lightly with "Sailed most of it. Paddled the embarrassing part"
  (1134).
- **Anissa never jokes.** Her two new lines ("Gigi... he's looking at me.", "Goodbye, Zetwal.") hold the rule. But
  "he's looking at me" makes the Crown's own envoy notice her in Chapter 1, which is a plot choice (see Questions).
- **The consul choice is cosmetic within Chapter 1.** Both answers get one quip, and its only payoff is an optional
  Chapter 2 line. If that line is added, it must not come right before Yari's "Then show us the seventh clause"
  (`xaragua.ts` 182), or the two lines say the same thing. Honestly, all of the new choices are **remembered, not
  consequential**: they change lines, not events. That is what finding 11 asked for, but the owner should know.

---

## Claims I checked

| Claim | Holds? |
|---|---|
| Step counts per objective (papers 211, boar 99, side quests 457, before the tide 61, whole chapter 1,069) | **Yes, exactly.** I replayed the route myself. |
| 28 of 32 transitions after the lamp | **Yes for the four objectives** (9, 3, 14, 2). I count 31 for the whole chapter, not 32 (probably the end-card travel). |
| Lines and choices per objective (e.g. side quests 96 lines, 14 choices) | **Not reproduced.** I get 70 and 5 counting dialogue boxes only. The outline's figures likely include debate rounds and book pages, as it says. Immaterial. |
| "After the lamp: 828 steps" | **Holds if the 8-step dock objective is left out** (836 with it). |
| After-numbers (~500 steps, 14 transitions) | **14 transitions checks out** for the scripted order. **~500 steps is unverified and holds only for the route**, not for arrow followers (risk 1). |
| The cutter's step 1 can be done on the spot at the stones | **Yes.** `name_stones` (`zetwal.ts` 1079-1097) sets `side.cane_name.stones`, and the road's Echo zone needs only that and the Locket. |
| Shimmer three tiles from the road's entrance | **Yes.** Spawn (2,12), zone (2-4, 14-15). |
| Consul built in the Envoys' Room with "goodwill and a few papers"; the petitioner's "Only papers" line | **Yes** (`zetwal-hall.ts` 115; `zetwal.ts` 1464, 1511). |
| The Chancellor "reads every line twice" | **Yes** (`zetwal.ts` 1425). |
| Grandfather's "Ask them, not the Crown" is built but never reached | **Yes in the main game; no in the demo**, where no voyage follows and the node can be reached. |
| Chapter 2 reads only two Chapter 1 flags | **Not quite.** It also reads `party.anissa`, `item.sun_locket` (Xaraguá's Echo zones), the anchors (skills in `rpg.ts`) and `side.overdue.done` (`books.ts` 153). None of these change, so the conclusion stands. But the Pòdlimyè maps after Chapter 2 do read Chapter 1 state (risk 3, the consul's `if`). |
| `item.elodie_seal` / `story.papers_asked` read nowhere in Chapter 2 | **Yes.** They appear only in `quests.ts`, `rpg.ts`, the starts file and `sideQuests.test.ts` 227-250. |
| Every staging cue needed exists | **Mostly** (risk 7: no object or canoe movement; the consul's disappearance needs a map `if`). |
| Drafted lines under 128 characters | **Yes.** Longest is 124. Choice texts are under 36. |
| The "tonight" contradiction | **Yes**, and it is worse than described: "Two nights" (525) leads straight into "It is tonight" (530) in one conversation. |
| Demo Chapter 1 files are identical apart from Chapter 2 | **True for the content, but not copyable** (risk 5). |

---

## Missing from the plan

1. **An arrow-follower check.** Measure the walk a player makes by following only the gold arrow, not just the
   route. Ideally add a test that walks to `storyGoal` repeatedly.
2. **The cutter's full schedule:** where he stands before the lamp, after the lamp, after his quest, and after
   `story.zetwal_return`, with the quest's `available`, `start`, `nudge`, `place`, summary and step goals to match.
3. **Map rebuild and checks** for the changed NPC placements (`maps:build`, `validate:maps`, `maps.test.ts`).
4. **Old-save handling** for the papers flags (risk 6), plus a save test that loads a mid-errand save.
5. **Unit tests for the branch the route never takes.** `skip` always picks the first answer, so "We'll be fine",
   "Tell me everything", "Save me a bowl" and "Say nothing" are never played by any test. Add dialogue tests for each
   payoff branch, and for "first answer counts" on the soup vendor.
6. **Stale lines to update:** the papers hints (`quests.ts` 155-159 mention the Iron Market), the engraver's Market
   nodes, `foreign_envoy` and `hall_steward` about the consul, the cutter's road lines, and the cane quest's nudge.
7. **A smoke run of the main game** (not only the demo) after the route moves: the markers `@market` and
   `@hall-papers` move, and the `@square` checks (`smoke.mjs` 490-491) still expect both arrows there.
8. **Chapter 2's council and Journal note**, if the consul scene keeps naming the seventh clause (risk 2).
9. **CLAUDE.md process points:** the owner's questions should be asked one at a time with the reason (the outline
   lists four together), and the `docs/PRODUCTION.md` open items should be raised at this milestone.

---

## Are the owner questions the right ones?

A to D are real decisions and well explained. Decision D is correctly called the one new story fact. But the outline
makes these decisions **silently**:

- **E. The Journal order versus the walking order** (risk 1): reorder objectives so the arrow leads the short way, or
  accept that only players who explore get the saving.
- **F. What the consul names, and what the Chancellor knows** (risk 2): does Chapter 1 name the seventh clause in
  front of the player, and does Zetwal's own vault copy come up? This decides whether Chapter 2's council needs
  rewriting.
- **G. The Crown's envoy noticing Anissa** ("he's looking at me"). It makes the Crown, not only the Quiet Crown,
  aware of her on the night she lit the lamp. This sets up the Regent and the Hushed (STORY 6.3) but commits the plot.
- **H. Is the cane quest still startable before the lamp?** SIDE-QUESTS.md says most quests open early.
- **I. The Marshal's whistle.** Decision C drops it, but STORY beat 11 says it "matters again in Chapter 10". In the
  small version, Grandfather could still hand it over at the dock: one key-item entry in `rpg.ts` and one `set`. The
  owner should choose knowingly rather than lose it by default.
- **J. Deleting the seal item and flags** versus keeping them for old saves (risk 6). This is mostly technical, but it
  affects testers who already have saves.

---

## Recommended changes to the plan

1. **Before approval:** resolve E and F with the owner, then revise the consul scene. Drop "just arrived", give the
   consul a different demand or move Chapter 2's council to build on it, give him his own voice, and give him a reason
   to come late at night (the lights).
2. **Write the cutter's schedule** (risk 3) and the engraver's motive and hand-off (risk 8) into the outline before
   building.
3. **Reorder the build:**
   - (a) the papers in one visit, with old-save branches;
   - (b) the consul scene, with the map `if` and a rebuild;
   - (c) the cutter's placements and lines;
   - (d) the farewell, plus the whistle if approved;
   - (e) the choice callbacks and the "tonight" fix;
   - (f) **then** rewrite the route once, regenerate the chapter starts, and run `act`, `guide`, `chapterStarts`,
     `content`, `stage`, `maps` and `sideQuests` tests, the main game's smoke run, and the arrow-follower
     measurement;
   - (g) docs;
   - (h) the Fable review;
   - (i) a **hand-merged** demo port with the demo's own route and smoke run.

   Between (a) and (e), keep the route passing with small edits, or accept that `npm test` is red until (f) and say
   so.
4. **Add the branch tests and the save test** (missing items 4 and 5).
5. **Report two numbers after the build:** route steps and arrow-follower steps for the back third. Finding 5 is fixed
   only if the second one drops too.
