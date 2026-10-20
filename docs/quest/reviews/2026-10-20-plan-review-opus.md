# Review of "The whole quest by Nov 22" (Opus, Oct 20)

*An independent review of `docs/quest/PLAN-ALL-CHAPTERS.md`, written without seeing the other review. I read the plan,
the old schedule (`SCHEDULE.md`), the production list (`docs/PRODUCTION.md`), the design pack (`docs/quest/design/`),
the reviews of Oct 17 to 19, the quest's code, tests and route, and the git history since Oct 12. Nothing else was
changed.*

---

## 1. Verdict

**The whole story, playable from Chapter 1 to the Hearing, by Nov 22: possible, but only as a first pass, and only if
the plan changes now. At the quality of Chapters 1 and 2: no.**

The plan asks for ten new chapters and the epilogue in 27 days (Oct 20 to Nov 16), about 2.7 days each. The real pace
so far is about a week per chapter at the quality you have accepted. The plan also leaves out the biggest piece of
work the last chapters need (the realm's economy: ally prices, armies, the betrayal and the endings), and it puts the
hardest chapters (6 to 8, 11, 12) in the weeks when you are also finishing the board game (rules freeze Oct 31,
order B Nov 3).

With the changes in section 6 (above all: the three roads in a fixed order for the release, the economy built first,
a decision date on Nov 8, and a test set-up that does not need a 6-hour browser run) a complete story by Nov 22 is
a fair goal. I would not promise Chapter 1 and 2 polish for Chapters 6 to 12 by that date.

---

## 2. What holds

- **The engine is real and reusable.** Walking, staged scenes (people walk in, talk, walk off), dialogue with
  choices, the Echo swap, puzzles, debates, side quests with arrows, voyages, battles with rows and swapping (four
  fight, the rest wait), skills that grow, gear, shops, Game Over with the goddess, saves, chapter starts
  (`?chapter=2`). Once this existed, Chapter 2's main story went from "walkable" (Oct 16, 22:45) to "Thorne beaten,
  end of chapter" (Oct 17, 03:13) in about five hours of building. New chapters do not start from zero.
- **The design is far along.** Every chapter has its beats, boss, puzzle, side quests and secret item written
  (`STORY.md`, `CAPITALS.md`, `PUZZLES.md`, `SIDE-QUESTS.md`, `COMBAT.md`, `SECRET-ITEMS.md`). Outlines will be
  checking and adapting, not inventing.
- **Some "new systems" are already half there.** A party bigger than three exists (four fight, the rest swap in;
  `engine/battle.ts`). A fight "meant to lose" is already a field on a battle and Game Over already skips the goddess
  for it (`engine/gameOver.ts`). Per-city Influence and Fear, Concord and an armies count exist (`engine/rpg.ts`,
  `engine/debate.ts`).
- **The pipeline works.** Outline by Fable, a second review, your decisions one at a time, then the build: Batch D,
  Game Over and Chapter 2's side quests all went through it on Oct 19 and came out sound.
- **The cuts the plan makes are the right kind.** Keeping the main story acted out on the map, the boss, the Echo
  puzzle, the debate and Game Over, and moving extra side quests and secret items after the release, protects what
  the game is about.
- **Placeholders through `assets.config.ts`** mean art can never block a chapter.

---

## 3. What doesn't hold (most serious first)

### 3.1 The pace is about three times faster than anything done so far

Evidence from the git history:

| Chapter | First commit | Where it stands | Calendar days |
|---|---|---|---|
| 1 (35 min) | Oct 13 (the skeleton) | Batch D, the pre-port review and continuity fixes on Oct 19; Quill not built; not yet accepted by you and your reviewer | 7 and counting |
| 2 (40 min) | Oct 16 (the maps) | Main story Oct 17; staged scenes Oct 17; side quests outlined Oct 19, built Oct 20 to 24 per the plan; not yet accepted | 9 by the plan's own date |

The fast part is the first build (hours). The slow part is everything after: acting scenes out on the map (your
Oct 17 rule), the reviews (the Oct 19 reviews alone ran to about 2,000 lines), your decisions, fixes from your play,
and the browser test. None of those get faster with a better engine; they grow with each chapter. The plan gives each
chapter 2 to 3 days with two in flight. The evidence says 6 to 9 days each for one chapter at a time, perhaps 4 to 5
for the small ones once the systems exist.

The commit count shows the same thing: 60 commits on Oct 16, 28 on Oct 19, and those days produced roughly one
chapter's worth between them, with art and reviews mixed in.

### 3.2 The plan leaves out the realm's economy, and Chapters 10 to 12 stand on it

The plan's list of new systems does not mention the part of the design that decides the ending:

- **Ally prices** (build guide 6.3): seven groups, each wanting one currency (Free Brasador Fear 6 in Chapter 3,
  Al-Doria Influence 10, Skarragol Wealth 10, and so on), other currencies at half value, overpaying adds soldiers.
  Not built (`rpg.ts` has gold and pillars, no prices).
- **The betrayal** (guide, Chapter 10): the Crown buys whichever of four houses you paid least; ties go to Dorini;
  the "exposed" route needs the Kuroshi evidence and 60 percent paid. This needs the prices to have been tracked
  since Chapter 4.
- **Armies and the War of the Harbor** (`COMBAT.md` 11): soldiers pledged buy volleys between three linked battles.
- **Accord Stability** (guide 5.7): built from allies kept, the debt paid, the Harbor choice, the verdict, Concord and
  unfinished side quests; it picks one of three endings.
- **Yield** (spare, take, break) is one of the main ways to earn Influence, Wealth and Fear, so without it the prices
  cannot be balanced either.

If this is built late (in Chapter 10's two days), every chapter from 3 to 9 must be revisited to feed it. It has to be
built first, before Chapter 3, because Chapter 3 already has a price (Free Brasador).

### 3.3 The late chapters are sized by minutes, but their work is in systems and branches

| Chapter | Plan | What it actually needs that does not exist | Honest size |
|---|---|---|---|
| 3 Ardencia (45 min, the longest) | 5 days, alongside finishing Ch. 2 | Bound; the scripted loss reworked (your Oct 19 direction changes beats 5 to 8 and must be settled first); Azzy as a fighter (skills, stances); Benny in the Echo party; Rael's three phases with Seize redesigned (Anissa can no longer be hit, `COMBAT.md` 8, open); the escape puzzle in both eras; the debate; a safehouse; Free Brasador's price | 7 to 9 days |
| 4 Al-Doria | 5 days | Samira, Daftar (spends gold: your decision, dated Nov 3 in `PRODUCTION.md` but needed by about Oct 23), Bribe, a summoning boss; a two-era vault with a cipher; how the party gets there from Ardencia (open question 12) | 5 to 6 days |
| 5 Eightgate | 3 days | Eightgate is built once and reused in 12; the Archive reading puzzle; Elodie's confrontation | 3 to 4 days |
| 6 to 8 any order | 11 days for three | three capitals with new looks (tiles are drawn in code, so each new land is new pixel work), three companions, three bosses, three signature puzzles, region levels fixed on first entry, and six possible orders to test | 15 to 18 days in any order; about 12 in a fixed order |
| 9 Aldermoor | 3 days | a two-part puzzle including a courtroom "who is lying" trial (a new kind of puzzle); the Hushed with Hush the Light redesigned; Edmund | 4 to 5 days |
| 10 Muster | 2 days | the betrayal, the exposed route, three mediations, armies gathering on the plaza (many actors on the map) | 3 days if 3.2 is done first, otherwise 6 or more |
| 11 War of the Harbor | 3 days | three linked battles with volleys; four betrayer variants; the Trust and Strike branches with two different final fights (Rael as a guest; Rael in four phases); an Echo of Caona's last stand; a war shown on the map, not told | 6 to 8 days |
| 12 and the Hearing | 3 days | the Regent in three phases (aims at Anissa: same open redesign); Azzy's three-way choice (the dark one is another fight); the Hearing with witnesses and three verdicts; Stability; three endings with each house's fate | 5 to 6 days |

Add it up and the honest total for Chapters 3 to 12 is 55 to 70 working days for one builder. Even with two chapters
in flight and helpers doing dialogue and maps, that does not fit in 27.

### 3.4 Your time is the real bottleneck, and the board game needs it in the same weeks

- The plan counts about 50 decisions in 30 days. That is fair, but the order matters: at least nine are needed
  **this week**, before Chapters 3 and 4 can be outlined honestly: the Rael fight rework (Oct 19 direction vs beats 5
  to 8), Anissa can't be hit (what Seize and Hush the Light become, for Rael, the Hushed and the Regent), Daftar, the
  way from Ardencia to Al-Doria, and the four questions `PRODUCTION.md` dates **Dec 1** (Patricio in Aldermoor, the
  Aldermoor ledger, the betrayer's companion, the Gen III rulers), which are now needed by early November.
- The plan quietly reverses an Oct 19 recommendation: the Quill and the Conch were to be built before Chapter 2's
  acceptance playthrough; the plan moves them after the release. That may be right, but it is a change you should
  make knowingly.
- Between Oct 24 and Nov 3 you also owe art drop 1 (Oct 24), 106 card pictures, 32 portraits and a card back (or
  accept the no-picture design) before the Oct 31 freeze, and proof approvals for order B (Nov 3). Claude owes the
  print files still marked "to build" (player boards, standees, tokens, Legacy cards, score pad, rulebook PDF,
  reference cards). **None of that board game work is in the quest plan, and the old schedule says the board game
  wins where they clash.** Chapters 6 to 8 sit exactly on top of it.
- "Before each build, describe it and wait for approval" and "one question at a time" are good rules, and they mean
  a chapter waits whenever you are away for a day. The plan has no slack for that.

### 3.5 Testing does not scale as it stands

- The browser smoke test plays one route file (`quest/routes/zetwal-act1.json`, Chapters 1 and 2 together) and takes
  about 25 to 50 minutes. Six hours of game is roughly five times the content: **2.5 to 5 hours per full run**, for
  every change late in the game.
- The battle dice in the browser come from the clock (`BattleScene.ts`: `Date.now()`), and the smoke test allows at
  most three accidental losses. Across 12 chapters and harder fights it will fail on bad luck, not bugs.
- One route file for the whole game means every helper editing any chapter edits the same file (and `quests.ts`),
  which with two chapters in flight is a merge conflict every day.
- Branches multiply what must be played: six orders of the three roads, the exposed route or not, four betrayers,
  Trust or Strike, three Azzy choices, three verdicts, three endings.

### 3.6 Balance over 30 levels is checked only in the last week

- Each fight is tested on its own (the boar test plays every roll), which is good. But `COMBAT.md` 6 promises "the
  simulation checks that a player who skips all side quests is no more than 2 levels under the target", and that
  simulation is not built.
- Cutting side quests from five to two per chapter removes XP the curve was designed around, so every chapter will
  arrive under level unless rewards are retuned. Finding this on Nov 16 means retuning ten chapters in four days.
- 53 battles exist today, all at levels 2 to 14. The game needs the 22 standard enemies and 10 bosses up to level 30.

### 3.7 Reviews come too late at the end

The last review batch (Chapters 10 to 12) is about Nov 17. Whatever your reviewer finds there, the climax of the
game, lands with four days left, the same four days as the phone, save and accessibility checks. The reviewer also
has to play about two hours for the Nov 9 batch and two more for Nov 17.

### 3.8 Art and languages are bigger than the plan says

- Painted art so far: 12 people, 1 enemy, no tile sheets (land is drawn in code). The rest of the game needs at least
  six new companions with battle stances, Rael, Benny old and young, Caona, the Regent, Cresswell, Thomas Stillwater,
  five Gen III rulers, ten bosses and 22 enemies. Placeholders are fine, but the release will look much rougher after
  Chapter 2 unless you choose which few pictures matter most.
- The phrase check in the plan covers Kreyol and Taíno. `CAPITALS.md` lists Arabic, Spanish, Mongolian, Old Norse,
  Japanese and Hindi too. One fluent-speaker check on Nov 18 cannot cover six more languages.

---

## 4. Dependencies and order

What later chapters stand on, in the order it should be built:

1. **Test set-up for many chapters** (before Chapter 3): one route file per chapter, each starting from its chapter
   start save (the `?chapter=` starts and `chapters.json` already do this for Chapter 2); seeded dice in the browser
   test; the headless run of every chapter in `npm test`. This also ends the merge clashes.
2. **The realm's economy** (before Chapter 3): ally prices, motive currencies, overpaying into soldiers, Yield and its
   pillar rewards, and a record of every input to Accord Stability (just stored for now, scored in Chapter 12).
3. **A level-curve simulation** (before Chapter 3): adds up every XP source along the routes and says where the party
   ends each chapter, with and without side quests. Re-run with every chapter.
4. **Fighters as data** (before Chapter 3): adding Azzy, Samira, Bayarmaa, Haru, Vikram, Edmund and Benny should be a
   table entry plus placeholder stances, not new code each time.
5. **Bound and the scripted loss** (Chapter 3; reused in the Strike route of Chapter 11).
6. **What enemies do instead of hitting Anissa** (your decision; used by Rael, the Hushed, the Regent).
7. **Realm travel** between places (Chapter 4 onward; the voyage scene exists for the sea).
8. **Echo battles and Memories** (only those the story needs).
9. **Region levels** (Chapters 6 to 8; not needed if the order is fixed, see 6.1).
10. **The war** (Chapter 11), **then the Claim, the Hearing and the endings** (Chapter 12), which read everything above.

Two places should be built once and reused: **Eightgate** (5 and 12) and the return to **Pòdlimyè** and
**Xaraguá** (10 and 11), where the maps exist and only their state changes.

---

## 5. Testing strategy for 12 chapters

- **Every change:** `npm test` plays every chapter headless from its start save (the way `tests/act.test.ts` plays
  Chapters 1 and 2 now), in seconds, plus each boss's "winnable on every roll, not a pushover" test, like the boar's.
- **Every chapter finished:** the browser test for that chapter only, from its start save, with seeded dice; chapters
  can run side by side. Target: under 15 minutes each.
- **Branches:** headless, from start saves with the right choices already made: each road order (all six are cheap
  headless), exposed or not, each betrayer, Trust and Strike, each Azzy choice, each verdict and ending. The browser
  plays one main path.
- **Balance:** the level-curve simulation after every chapter, and a check that each chapter's last boss is beatable
  at the level the curve says the party will have, on Story and on Normal.
- **The full 6-hour browser run:** once at each review batch and once before the release, overnight, not on every
  change.
- **People:** the headless tests prove the route works; only you and your reviewer can say a scene is good. Keep the
  review batches, and move the last one earlier (6.6).

---

## 6. Recommended changes

1. **Fix the order of the three roads for the release** (for example Skarragol, Kuroshi, Jwaladesh, each with fixed
   levels 15 to 17, 17 to 19, 19 to 21). The story does not depend on the order, it removes the region-level system
   and five-sixths of the testing, and saves about a week. Any order can come in an update. This is your call; it is
   the single change that buys the most time.
2. **Spend Oct 21 to 24 on the foundations in section 4 (items 1 to 4)** while Chapter 2's side quests are finished and
   Fable outlines Chapter 3. Then no later chapter waits on a system.
3. **Ask the nine early decisions this week** (3.4), one at a time, most urgent first: the Rael fight, Anissa can't be
   hit, Daftar, the way to Al-Doria, then the four Dec 1 questions, then the Quill and Conch reversal.
4. **Put the board game in the plan.** Mark Oct 27 to Nov 3 as the board game's week (freeze, print files, order B),
   with lighter quest work (Chapter 5, dialogue for 6 by helpers), so neither slips silently.
5. **Set a decision date: Sun Nov 8.** If Chapter 9 is not built by then, choose between (a) releasing Chapters 1 to 9
   polished on Nov 22 with 10 to 12 and the Hearing in December, or (b) releasing all twelve with the late chapters
   plainer (placeholders, simpler war, fewer Echo battles). Deciding then is better than discovering it on Nov 20.
6. **Move the last review batch to about Nov 14** by finishing Chapter 12 by Nov 13, so fixes from it have a week.
7. **Retune XP for two side quests per chapter** as part of each chapter's build, using the simulation, not in the
   last week.
8. **Choose the art that matters most** for drop 2 (Nov 7): Rael, Azzy's stance, Samira, the Regent and the bosses
   of 3, 9, 11 and 12. Everything else stays a placeholder for the release.
9. **Keep the cultural check honest:** release with the words the design already uses, and ask for fluent readers for
   Arabic, Spanish, Mongolian and Norse, Japanese and Hindi as each chapter's outline is approved, not on Nov 18 alone.
10. **Simplify only where it does not change the story** (your rule): the war's three stages share one battle frame;
    the four betrayers share one frame with a few moves each (as `COMBAT.md` already says); Echo battles only where
    the story has them (Chapter 3's march, Chapter 5's Archive, Chapter 11's harbor). Ask before dropping Azzy's dark
    Challenge; it is part of the Claim, but it is also a whole extra fight.

### The minimum each chapter must have for the release

Everything here keeps your rule: what happens in front of the party is acted out on the map.

| Chapter | Must have | Can follow after Nov 22 |
|---|---|---|
| 1, 2 | as built, with the five Chapter 2 side quests and the gate | the Quill, the Conch, the Cane Road ambushes for the return (needed in 10, see below) |
| 3 Ardencia | the trial and Rael's fight (settled with you first), the reveal behind the screen, the envoy, the escape puzzle, Azzy joins, young Benny's callback, the debate, two side quests (one the safehouse), Free Brasador's price | Benny's Promise, the other three side quests |
| 4 Al-Doria | Samira's arrival and invoice, the vault in both eras, Yusuf's ledger, Qasim, Samira joins, the coin clue, the debate, two side quests | the Sakk of Yusuf, other quests |
| 5 Eightgate | the Regent's welcome, reading the Accord, the sealing Echo, the Seventh Clause read aloud, Elodie's two lines, the roads open | Volume One, the Ribbon |
| 6 to 8 | each: the city's trouble, its signature puzzle, its Echo, its boss, the companion joins, the ally's price, the Kuroshi files (needed in 10), the debate, two side quests | any order, the secret items, other quests |
| 9 Aldermoor | Edmund, the archive, Thomas's record, the courtroom, the Hushed unmasked, the dissidents' price | the Clock, other quests |
| 10 Muster | the armies arrive on the map, three mediations, the betrayal (and the exposed route), the fleet sails | Anicette's Ash Wars talk, Muskets in the Cane |
| 11 Harbor | three battles with volleys, the betrayer, the Harbor Turn with both choices, Gianna learns the truth | Caona's last stand Echo, if time runs out |
| 12 and the Hearing | the Claim and Challenge, the Regent, Azzy's choice, the Hearing with its three verdicts, the three endings | the final Archive Echo of Patricio, Benny and Caona, if time runs out |

---

*Open items reminder (`docs/PRODUCTION.md`), most urgent first: the board order (A) is due today, Mon Oct 20; art
drop 1 Fri Oct 24; card art, portraits and the card back before the rules and card text freeze Fri Oct 31; order B
with proofs Mon Nov 3; Daftar (now needed by about Oct 23, see 3.4); the Dec 1 story questions (now needed by early
November); the fluent-speaker check Wed Nov 18.*
