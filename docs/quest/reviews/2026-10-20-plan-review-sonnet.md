# Review of "The whole quest by Nov 22" (Oct 20), by the Sonnet reviewer

*Independent review of `docs/quest/PLAN-ALL-CHAPTERS.md`. Nothing in the game or any other file was changed. The
evidence: the quest code and tests as committed on Oct 20, the git log (Oct 13 to 20), the six design files, CLAUDE.md,
the old `SCHEDULE.md` and `docs/PRODUCTION.md`. Where I say "not built" I searched `quest/src` for it and found
nothing.*

---

## 1. Verdict

**As written, the plan will not hold. Nov 22 can hold for a different release: every chapter playable from start to
end, with a thinner middle.** The plan's own pipeline (outline, second review, about five owner decisions, build, full
browser test, 2 to 3 days a chapter) does not fit its own dates, and it leaves out three things that decide whether
the game works at all: the systems the fights need, the ending's branching, and how each chapter is tested.

In plain words:

- The build pace is real, but it was reached on chapters that reused existing machinery. The later chapters mostly
  need new machinery, and the plan schedules that machinery inside chapters that are already late.
- Chapter 3 is the first one that cannot make its dates, and every later date moves with it.
- The owner is the narrowest part of the pipe: about 50 decisions, four review batches, the board game's Oct 31 and
  Nov 3 deadlines, and a 6-hour playthrough, all in 30 days.
- I would keep the date, keep all twelve chapters and the epilogue, and cut depth (not chapters) in a list set out in
  section 6. Without cuts, expect Chapters 11 and 12 to be thin or to slip past Nov 22.

---

## 2. What holds

1. **The design pack is real and large.** STORY, CAPITALS, SIDE-QUESTS, PUZZLES, COMBAT and SECRET-ITEMS together are
   about 3,300 lines. Every chapter has beats, a boss, a signature puzzle and a level range. Nothing needs inventing
   from zero.
2. **The pace on Chapter 2's main story was fast.** The git log shows Chapter 2 opening on Oct 16 and, by the end of
   Oct 17, the ferry, pier fight, council, Thorne boss, petroglyph cave, rhythm lock, Echo of the first oath, Crown
   attack, occupied city, escape and voyage were all in (about 14 maps and 1,272 lines of dialogue, in two days of
   55 to 60 and 23 commits). So "about two days for a chapter's main story" is believable **when the engine already
   does what the chapter needs**.
3. **Maps are cheap.** The ten Pòdlimyè maps are about 900 lines of generator code and Xaraguá's fourteen are 721 lines
   (`quest/tools/maps/`). Eight more capitals are a lot of typing but not a hard problem.
4. **The tests run fast.** The whole unit suite (about 50 test files) runs in about 15 seconds. That will still be
   fine at 12 chapters.
5. **Cutting side quests and secret items after release is the right first cut.** The side-quest and secret-item
   designs are optional by their own rules (nothing there blocks the story), and the Oct 19 review already found
   the five Chapter 2 side quests are the largest unbuilt block in Chapter 2.
6. **Placeholder art is already how the game works.** Pixels are drawn at boot through `assets.config.ts`; the plan
   does not need art to run. That risk is genuinely small for the code. (It is larger for the owner's eye; see 3.9.)
7. **Overlapping chapters is the right idea.** Outline and review of chapter N+1 can happen while chapter N builds.

---

## 3. What does not hold (most serious first)

### 3.1 The dates assume a chapter takes 2 to 3 days, and the first chapters have to do far more

Evidence for the real pace:

- Chapter 1 took from about Oct 3 (first commits) to Oct 19 (Batch D and the continuity fixes). That includes the
  whole engine, battle system, levelling, quest log, arrows and the intro, so it is not a fair per-chapter number, but
  Chapter 1 is still being edited a week after its "done" date.
- Chapter 2's main story took two days (Oct 16 to 17). Since then (Oct 18 to 20) the work has been polish, Batch D,
  Game Over, three outlines and three reviews. **Chapter 2 is not finished and none of its five side quests are
  built.** The review of the side-quest outline says Chapter 2 would grow from about 1,020 to 1,650 steps and that its
  level arithmetic is wrong (the party would be level 9 to 10 at the end, not 8).
- Chapter 2's last review item set: five corrections to the outline, a gate placement choice, old-save protection
  for four quests. None are resolved in the plan.

The plan then asks, in the same week (Oct 20 to 24), for Chapter 2's finish **and** the whole of Chapter 3, which is
the plan's own longest chapter (45 minutes). Chapter 3 has not been outlined. The Oct 19 owner direction (Rael wins,
carries a legendary item, Azzy makes a distraction) rewrites beats 5 to 8 of the story, and STORY.md says the outline
"must ask the owner where they conflict". So before one line of Chapter 3 is built it needs: the Fable outline, the
Opus review, several owner decisions (answered one at a time), and the Bound rule built. That is Oct 20 to 24 at the
very best for the *outline stage*. **Chapter 3 builds Oct 25 to 29 at the earliest, five days later than planned.**

Because the plan's rows chain (Ch 4 starts Oct 23, Ch 5 Oct 26, the roads Oct 27), a five-day slip at Chapter 3
rolls into Chapter 4's engine work (Samira, Daftar) and everything behind it.

### 3.2 Systems are listed as "built when their chapter needs them", but each is bigger than one chapter's slack

None of these exist in `quest/src` today (searched: Yield, Bound, Daftar, region tiers, Echo battles, armies in battle,
Parley). Here is what each costs and where the plan hides it.

| System | Where it is needed | What is really involved | My honest estimate |
|---|---|---|---|
| **Bound and "meant to lose"** | Ch 3 (Rael), Ch 11 (Rael again) | `meantToLose` exists in `engine/battle.ts` (so the scripted-loss half is partly there, and Game Over skips it). **Bound as a status, a rule "party is Bound, never knocked out", Rael's three phases (Measured, Unleashed, Cornered) with scripted triggers that make Surge/Shield/Comfort the right answers**: not built. Ch 11 needs a four-phase version. | 2 to 3 days, tests and balance included. Must exist before the Ch 3 boss. |
| **Yield step** | Every human fight from Ch 3 on; scripted Yields for Qasim, Dhanraj, the Paper Fox, the Betrayer | Pause the battle once, three choices, three pillar effects per city, gold/XP changes, "enemy may come back as a friend", "cowed faction means fewer ambushes for 100 steps". The Oct 19 review already cut a Chapter 2 side quest because Yield does not exist. It also feeds Influence, Wealth and Fear scores, which feed allied-group prices and the ending. | 2 days for the engine; 1 more day to wire the pillars into prices and the Muster. |
| **Echo battles** | Ch 4 onward (Echo skirmish in the Archive, Ch 5; many Echo fights later) | Echo party instead of the main party, no Surge, Memory rewards (a permanent +2 stat for a named member, or a hidden route). Chapter 2 only has Echo *puzzles*, no Echo fights. | 1.5 to 2 days. |
| **Party larger than three** | Ch 3 on (Azzy, Samira, then Bayarmaa/Haru/Vikram/Edmund) | **Smaller than the plan fears.** COMBAT 9.9 says "up to 8 in the party, 4 fight, the rest wait to swap in; built (Oct 15)" and `engine/battle.ts` has a bench. The remaining work is the field: followers walking behind Gianna (only Yari and Anissa do now), dialogue scenes with five or six people on a map, and a screen to choose who fights. | 1 day, and then a cost on every later scene (more people to stage). |
| **Samira's Daftar** | Ch 4 | Needs the owner's answer first (gold, not Wealth; PRODUCTION lists it "by Mon Nov 3", but Ch 4 is built Oct 23 to 27, so it is due **Oct 22**). The skill itself is small once decided. | 0.5 day plus the owner's decision. |
| **Region level scaling (the three roads)** | Ch 6 to 8 | `ROAD_TIERS` is not built. Region levels are fixed the first time the party enters. This needs an enemy table in three tiers for each of three regions (nine tables), encounter levels set at entry and saved, boss levels per tier, story XP and rewards tuned so the party arrives right, and **six possible visit orders** for dialogue and for the chapter-start states. | 2 days of engine plus 1 day of balance. The plan gives it one parenthetical. |
| **Realm travel** | Ch 3 on | **Partly built**: the voyage and realm map exist (`VoyageScene`, `realmMap.ts`, the voyage to Xaraguá is tested). What is missing is free travel to any place the story has opened, a "where can I go" rule, return trips (Ch 10 returns to Pòdlimyè and Ch 11 to Xaraguá, which have already changed), and a way to leave a half-finished place. | 1.5 days. |
| **The war and claim scenes** | Ch 11, Ch 12 | A three-stage battle with allied volleys paid for by armies, a two-way trust/strike choice, a four-phase Rael fight, a Regent fight, Azzy's three choices, all with scripted dialogue between stages. Nothing like this is built. See 3.4. | 4 to 5 days across both chapters. |
| **The epilogue Hearing** | Epilogue | A courtroom scene with many witnesses, three verdicts and three endings (Just, Hollow, Iron Throne) driven by Accord Stability, which no file in the plan or the code defines as a running number yet. | 2 days. |

Added up, that is roughly **15 to 20 working days of engine** hidden inside chapters that the plan gives 2 to 3 days.
This is the single biggest cause of the schedule not holding.

### 3.3 The branching in the back third is not in the plan's count

The plan says Chapter 11 takes 30 minutes and Chapter 12 plus the epilogue take 30. The story file shows what those
30 minutes contain:

- Chapter 11: a three-stage battle, a flank fight against the betrayer (skipped if turned at the Muster), then two
  routes: **Trust** (fight beside Rael against the Regent's champion) or **Strike** (a four-phase fight against Rael,
  the fleet escapes, Stability drops, Azzy furious). Both reach the same truth scene.
- Chapter 10: three mediations, the betrayal (which of four houses, so four versions), an "exposed route" that
  depends on the Kuroshi evidence and a price at least 60 percent paid.
- Chapter 12: Claim, Challenge, the Regent fight, Azzy's three choices (renounce, share, or fight her).
- Epilogue: three verdicts, three endings.

That is at least 14 distinct branches that each need dialogue, staging and a test. The betrayer being one of four houses
also means a companion may be the betrayer's house (STORY open question 9) and gets a defy scene. The plan has no line for
Stability (the score behind the endings) or for who is the betrayer.

### 3.4 The owner's time and the other deadline

- **About 50 decisions in 30 days** is the plan's number. The history says decisions arrived about one to two per day
  on Oct 19, with each requiring a read of a long outline. The plan also says four review batches (Oct 27, Nov 1, Nov 9, Nov 17)
  and two models reviewing every outline; saved reviews are long (the Chapter 2 side-quest review alone is dense).
- **The board game is on the same owner.** PRODUCTION.md: order A Oct 20, rules and card freeze **Oct 31**, proofs and
  order B **Nov 3**, with 106 of 126 card images and all 32 portraits still missing. Oct 27 to Nov 3 is when Chapters 4
  to 8 need the most decisions.
- **Story questions are due earlier than PRODUCTION.md says.** The five open questions (Patricio in Aldermoor, the
  ledger, the betrayer's companion, Gen III rulers) are listed "by Mon Dec 1". The new plan builds Chapter 9 on
  Nov 5 to 8 and Chapter 10 on Nov 8 to 10. They are really due **about Nov 3**. The plan does not move them.
- **Four of the plan's own decisions are not yet made:** Chapter 3's Rael rewrite, the Daftar question, how Al-Doria is
  reached from Ardencia (STORY open question 12), and whether Patricio knew whom he was sending her to (question 13).

### 3.5 Testing will not scale the way the plan assumes

Evidence:

- The only scripted route is `quest/routes/zetwal-act1.json` (357 lines, about 800 steps). The browser smoke test
  (`tests/smoke.mjs`, 1,540 lines) plays Chapter 1 through the real game and compares it to the simulator after every key.
- **Chapter starts are generated from that route** (`tools/chapter-starts.ts` writes `src/data/starts/chapters.json`
  from where the route ends; a test fails if it is stale). Chapter 2 has no route yet, so chapters 3 and later have no
  honest starting state: someone has to either script a route for each chapter or hand-build a start.
- The plan's "full browser test before moving on" does not exist beyond Chapter 1. A browser walk of Chapter 2 alone
  would be about 1,000 to 1,650 steps. Twelve chapters is roughly 15,000 or more steps.
- Every dialogue edit in a chapter changes the route (the Oct 18 commits show smoke-test fixes for lines that "ran one
  ahead of the simulator").
- Balance: the Oct 19 review found Chapter 2 ends 2 to 3 levels higher than the design says, and that Thorne stops being
  "hard". One chapter was off by about two levels. Over 30 levels, errors add up. The plan checks only each chapter's
  own fights until the last week. **A late balance discovery in Chapter 9 or 11 cannot be fixed in the same week as the full
  playthrough.**

### 3.6 Any-order roads (Chapters 6 to 8) are a three-for-one multiplied by six

The three chapters share a design but each has its own boss, companion, price, Echo, signature puzzle and side
quests. Any order means:

- region level and enemy tier depend on the visit order (3 tiers);
- who greets whom ("Azzy is greeted as a royal grandson" in Skarragol) needs lines that make sense whether or not
  Haru or Bayarmaa is already in the party;
- the party has 4 to 6 members by the time the third is visited, so scenes that worked with 4 people need a version for 5 or 6;
- level ranges are fixed on entry, so the chapter-start states and every test needs the order as an input.

The plan gives 30 minutes each and 11 days (Oct 27 to Nov 6) for all three in parallel with Chapter 5. I consider this
the **second most underestimated block** after the systems.

### 3.7 Level targets are already wrong

Chapter 2 ends at 9 to 10, not 8 (Oct 19 review). Every later range in the table (3: 8 to 11, 4: 11 to 14 and so on) was
computed from the old number. Either Chapter 2 is rebalanced down (fewer XP) or every range shifts up; the plan does
neither. This is cheap to fix now and expensive to find in November.

### 3.8 Stale design files will bite the builders

`PUZZLES.md` still numbers Al-Doria as Chapter 3 and Ardencia as Chapter 4 (its index and per-capital headings), while
the Oct 15 order and this plan have Ardencia third. The Chapter 4 "way in" and "way out" in STORY (beat 9) is a proposal
nobody has approved. A helper working from PUZZLES.md will build the wrong chapter's puzzle.

### 3.9 Art is a bigger risk than "ships with placeholders" suggests

- Art drop 1 (Oct 24) is the six Chapter 1 character sets and battle stances; **no Chapter 3 to 12 characters have art
  prompts** (Rael, Azzy art exists only as `azzy.png` in `art/characters/`; Samira, Bayarmaa, Haru, Vikram, Edmund, the
  Regent, six or more bosses). The plan says prompts follow each outline's approval, so most of these prompts arrive
  after Nov 7, art drop 2.
- Art for these would have to be made, sent, and converted by someone, inside a calendar that also has 126 board-game
  cards and 32 portraits to paint by Oct 31.
- The risk is not "the game won't run" but "the owner plays a 6-hour game where half the cast is a coloured block".
  The owner's quality bar matters here; the plan should ask them directly (see 6).

### 3.10 Review capacity

Two models review each outline, the owner plus "an objective reviewer" check each batch, and the owner has rejected
or corrected things in nearly every review so far (the Oct 17 demo review had many findings). Batch 3 (Chapters 6 to
9, the largest and the hardest) lands Nov 9, leaving 13 days. Batch 4 (the endings) lands Nov 17, leaving 5. **Anything
found in batch 4 that touches an earlier chapter lands inside the final test week.**

---

## 4. Dependencies and order (what must come first)

Later chapters depend on these, so they should be built **before** or **with** the chapter that first needs them, not
inside a different chapter's slot:

1. **Finish Chapter 2 and fix the level arithmetic first** (by Oct 26). Every level range after it depends on it.
   Includes the old-save protection for quests (Oct 19 review).
2. **Approve the five Chapter 2 outline corrections and the gate placement** (owner), since Chapter 3 begins from
   that state.
3. **A chapter-start state for every chapter** (by scripting a route or hand-building starts). Without it no one can
   test Chapter 5 without replaying Chapters 1 to 4. Build `chapters.json` entries as each chapter lands.
4. **Bound + meant to lose + Rael's phases** before Chapter 3's boss (also needed in Chapter 11).
5. **The Yield step and the pillars** before Chapter 4's boss. It changes every human fight afterward and feeds
   allied prices, the Muster and the ending.
6. **Accord Stability, allied-group prices and the betrayal rule** defined in one place **before Chapter 5**. Chapters
   6 to 8 pay prices; Chapter 10 reads them (the 60 percent rule); Chapter 12 and the epilogue turn them into the
   ending. If these are defined late, Chapters 6 to 10 will each invent a version.
7. **Party-on-the-field for five or six** (followers, scene staging, a "who fights" screen) before Chapter 4 adds
   Samira; Chapters 6 to 8 then add three more.
8. **Region tiers for the three roads** before the first of them; also "visit order" in chapter starts and tests.
9. **Echo battles** before Chapter 5.
10. **Realm travel with return trips** before Chapter 10 (return to Pòdlimyè, with the Cane Road ambushes switching on) and
    Chapter 11.
11. **Decide the five story questions by Nov 3**, not Dec 1.
12. **Resolve `PUZZLES.md` chapter numbers** before anyone builds a puzzle.

The right *order* of chapters themselves (3, 4, 5, any order 6 to 8, 9, 10, 11, 12) is correct and cannot change; the
story depends on it. What changes is that the systems above are pulled out and scheduled as their own work, ahead of
their first chapter.

---

## 5. Testing strategy (what I would do instead)

1. **Test each chapter from its chapter start, headlessly first.** Use the simulator to replay a short scripted route
   per chapter (the tool `route:expand` exists) so the "start of chapter N+1" state comes from a real route. Run the
   full browser smoke only for the main-path moments of each chapter, not every step.
2. **One browser smoke per chapter, from its start, main story only** (about 10 to 15 minutes each, run once per
   chapter in the background while the next is built). Keep the full Chapter 1 smoke as is.
3. **One balance script, run after every chapter.** The method used for the Oct 19 review (80-seed battle simulations
   of each boss at the party's expected level, with and without side quests) already exists. Make it a standing check:
   party level at each chapter's end must be within 1 of the table in COMBAT 6, and the main-path-only player no more than 2
   under. Fail the build if not. This catches level drift in the chapter where it starts.
4. **Test the branches as data.** Every branch (Trust/Strike, betrayer, Azzy's three choices, three verdicts) gets a
   flag-level test that the right scene and ending play, since walking all of them by hand is not possible.
5. **Any-order roads:** test all six orders at flag level and two orders end to end.
6. **One full headless run of the whole game in the last week**, plus the owner's 6-hour play (split over three
   sittings). Give the owner a list of what to look for, not an open-ended playthrough.
7. **Keep the 15-second unit suite as the gate on every commit**; it is fast enough for 12 chapters.

---

## 6. Recommended changes

**A. Schedule changes (keep Nov 22 and all twelve chapters)**

1. Move Chapter 3's *build* to Oct 27 to Nov 1 and Chapter 4's to Nov 1 to 5. Use Oct 20 to 26 for: finishing Chapter 2
   (with the level fix), the Chapter 3 outline and decisions, and the systems in section 4 (items 4, 5, 6, 7).
2. Make the **systems their own line in the schedule**, with dates and tests, as above. Do not leave them in "built when
   a chapter needs them".
3. Run Chapters 6 to 8 as **one build with one shared template**, by tier, not three chapters; give it Nov 5 to 12
   and plan for a 25-minute version of each (see C).
4. Move the owner-review batches so the **last batch is not the endings**. Review Chapter 11 and 12 outlines (not builds)
   around Nov 6 so any change is made while those chapters are being built.
5. Move the Dec 1 story questions to **Nov 3** and the Daftar question to **Oct 22**. Ask the owner these first, before
   anything else; they block the most work.
6. **Hold the board game's Oct 31 and Nov 3 dates ahead of the quest.** CLAUDE.md says the board game comes first where they
   clash. Plan the owner's decision slots so Oct 29 to Nov 3 asks nothing of the owner except board-game approvals.

**B. What I would cut or defer if the plan runs late (in this order)**

1. All secret items (the plan already does).
2. Every side quest except the **one** per chapter that gives the chapter a rebel safehouse or a companion beat (the plan
   keeps two; one is enough for Chapters 5 to 12).
3. Chapter 10's mediations: **one** mediation (the one that sets up the betrayer) instead of three.
4. Chapter 11's **Strike** route as a full four-phase fight: keep the choice, but give the other route a shorter
   version (a two-phase fight and the same truth scene).
5. Echo *battles*: keep Echo *puzzles* and Echo scenes; use at most two Echo fights (Ch 5 skirmish, Ch 11).
6. A walking follower for every party member: keep the party in the menu and in battle; on the map follow with the
   party's first three, as now.
7. Hand-authored art-style polish on the chapters' end cards, the Game Over art for later chapters, extra music.

**C. The minimum each chapter must have (to count as "released")**

| Chapter | Minimum |
|---|---|
| 2 | The built main story, the level fix, the five side quests cut to the **three** already approved in the outline, one gate. |
| 3 | Duel and Rael's fight (Bound, he wins), his reveal, the escape puzzle, Azzy joins, the Ardencia debate, one side quest. |
| 4 | Samira joins, the vault puzzle, Echo of the ledger, Qasim with a Yield, the debate, one side quest. |
| 5 | The Throne Archive puzzle, the sealing Echo, the Seventh Clause read, Gianna and Elodie, the Regent's terms, no fight needed. |
| 6 to 8 (each) | Arrival and the city's problem, the signature puzzle, the Echo scene, the boss with a Yield, the companion joins, the price, the debate, the region levels by order. 25 minutes. |
| 9 | The archive and courtroom puzzle, Thomas's record (Echo), the Hushed boss, Edmund joins. |
| 10 | The plaza muster, one mediation, the betrayal (all four versions as short variants), the fleet sails. |
| 11 | The three-stage war (the volley rule), the Harbor Turn with both routes (the Strike route shorter), Gianna learns the truth. |
| 12 | The Claim and Challenge, the Regent, Azzy's three choices as short scenes. |
| Epilogue | The Hearing with its three verdicts and three endings as short scenes driven by Stability. |

**D. Questions only the owner can answer (one at a time, with the reason)**

1. *Release means every chapter playable end to end. Is it acceptable that chapters 5 to 12 are about 25 to 30 minutes
   with one side quest each and placeholder art?* Reason: this is the choice that decides whether Nov 22 holds.
2. *May Samira's Daftar spend gold?* Reason: Chapter 4 is built from Oct 27; the board game's lock is also near.
3. *Do you want the board game's Oct 31 and Nov 3 decisions kept clear of quest decisions?* Reason: the same person
   answers both.
4. *Who plays the whole game, and when?* A 6-hour playthrough cannot fit in Nov 16 to 21 together with fixes. Reason:
   to book the objective reviewer and the owner for specific chapters from Nov 1.

---

## 7. A last, honest line

The previous plan (`SCHEDULE.md`) said one capital takes about a week and offered a rougher all-nine-places pass if
the owner wanted it. That is the choice now being made. The pace of the last week supports a **thin, complete** game by
Nov 22 if the systems are built first and the cuts in section 6 are accepted in advance. It does not support a
full-depth game, and I would tell the owner so today rather than on Nov 17.
