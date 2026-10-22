# Second review: Chapter 10 outline, The Muster (Oct 22)

*Reviewer: an independent helper, reading only. Subject: `docs/quest/reviews/2026-10-22-chapter10-outline.md`
("outline:N" below means that file's line N). I checked it against:*

- *the built game in this checkout (`quest/src` and `quest/tools/maps`, branch `claude/new-session-43aoxw` at
  b9f3ea8, which now has **Chapters 6 and 7 merged in**; the outline was written against e25a6d6, Chapters 1 to 5),
  and the `chapter7` and `chapter8` branches (Chapter 8's dialogue is not written yet);*
- *`CLAUDE.md`, `PLAN-ALL-CHAPTERS.md`, `QUEST-BUILD-GUIDE.md` 5.6 and 6.3, `design/STORY.md`, `FAMILY.md`, `COMBAT.md`
  6 and 11, `SIDE-QUESTS.md` Z-3 and Z-6, `PUZZLES.md` M-ZET-2;*
- *the Chapter 9 outline, its second review and the owner's decision (the Almoner is Chapter 1's veiled woman), and the
  Chapter 7 outline with its "Built" section.*

*What I ran (scratch only, outside the repo):*

- *the outline's own simulation, `scratchpad/ch10sim/muster-sim.ts`, ported to a snapshot of **the current built
  engine** (`scratchpad/ch10rev/snap`, with Chapter 6 and 7's built Bayarmaa and Haru in place of the outline's
  guesses, Vikram and Edmund still as the outline's guesses, the Chapter 8 start save), as
  `scratchpad/ch10rev/muster-sim2.ts`, with three switches: `protects: 'crew_chief'` on the crew (the outline's
  day-1 re-run), the built active order (no `party.active`), and the outline's "plain" bot. Story difficulty, 30
  seeds per row, falls counted party-wide;*
- *the level arithmetic on the built curve (`LEVELS` 50 / 1.6) from three starting points inside level 24.*

*I changed no file except this one, ran no build or smoke, and committed nothing.*

---

## 1. Verdict

**Build it after the fixes in section 3.** The chapter is the right shape: the realm's prices finally read, the
three feuds are on the map before anyone names them, the Marshal's whistle is paid twice (Echo and present) with the
seven houses answering one note, the Chancellor states the rule once, the chain and the signal fire pay two Chapter 1
lines as things done, and the betrayal is a walk to a boat rather than a cutscene. Most of the outline's citations of
the built game are exact (section 4).

**Seven problems would ship wrong, unfair or contradictory if built as written** (details in section 3):

1. **Free Brasador is Azzy's company, not Joaquin's** (3.1). The guide, the built Chapter 3 and the built Journal all
   say the soldiers followed *Azzy* off the wall; the outline has thirty of the garrison follow Joaquin and has Joaquin
   command them at the inspection.
2. **The family lines have four factual errors and lean toward Rael three times** (3.2). Rahel has five children, not
   six; Azzy is named for Azriel Rivera, not his grandfather; Benny's wife is Nancy, so "your husband's peppers" is
   wrong; a steppe braid gives Rahel Azzy's *mother's* homeland. And Patricia's "halves" line is about Rael's signet
   (the Locket's other half), so with Rahel's "people who were not in the room" and "Not on him" the chapter gives a
   Rael clue, which `STORY.md` 4 says it must not.
3. **The staging answers `STORY.md` open question 13 without the owner** (3.3): Patricio stands beside Patricia while
   she blesses Gianna and Anissa as her great-grandchildren; Anicette and Rahel meet as "two grandmothers".
4. **The chapter pays two levels, not one** (3.4). The fixed XP (about 940) plus the expected ambushes lands every
   start above the exact floor of 24 on **26**, and a player who ends Chapter 9 high in 24 (the built Chapters 6 and 7
   both end in the top seventh of their level) is one ambush short of 27. The outline's numbers also use a stale XP
   table: the built one is `[15, 25, 30, 35, 40, 65, 44]`.
5. **The ally ledger can choose a betrayer the player was never shown a price for** (3.5). Al-Doria has no price scene,
   no Journal note and no `ally.*` flag in the built Chapter 4; under the outline's own ranges it is the likeliest
   betrayer for a player who paid the jarl; and nothing at the Muster lets the player pay it. The share the ledger
   uses is also never shown, the tie order is incomplete, and joining a feud always penalises the same house.
6. **Several "nothing Chapter 1 reads changes" and "data only" claims are false** (3.6, 3.7): old Patricio stands in
   two built places for the whole game (one still saying "the trader sails again at noon"), crowds are present-only
   and wander (no Echo armies, no ranks at dusk), `party.active` exists nowhere, shop stock cannot be conditional (the
   tier-24 gear would be on sale in Chapter 1), and an item's text cannot change by flag.
7. **The night cannot be staged where the outline puts it, and the dusk/night/dawn conditions overlap** (3.8, 3.11).
   The customs house is inland (rows 1 to 2; the water starts at row 11), so a launch "at the customs house's steps,
   outside the raised chain" is impossible on the built map; the night condition runs until `story.fleet_sailed`,
   which no beat sets, so dawn never comes.

The rest are medium or small (sections 3.9 to 3.17). None of them needs a new engine system; together they add about
half a builder-day (section 7).

**Owner questions:** two, listed separately in section 8, each with a recommendation; the build goes ahead on the
recommendation either way.

---

## 2. What I agree with

- **The Chancellor's condition** (outline:253-258): one sentence that is the chapter's rule, in the city's words, with
  the shawl on the chair's arm. The gate (section 6) is then the city's, not the Journal's.
- **The whistle, paid twice** (beats 7 and 8.2): the Echo's two armies coming to order on one note, then the present's
  seven. It is the best "same place, armies then and now" the design could ask for, and it puts the Chapter 1 key item
  (`rpg.ts:58`: "it matters again in Chapter 10, when he musters Zetwal with it") to its stated use.
- **The betrayal as a walk** (beat 8): a captain leaving his fire with a satchel, the arrow following him, the house's
  own second turning the house and Jordyn arresting by the book. "Turn them into a late ally" read as the house
  turning, not the captain, is right and keeps the villain a villain.
- **Rashid gets a face in daylight** (outline:219-223): a Dorini betrayal by a stranger would have been unfair; the
  Samira line places him.
- **The Cane Road's stale table caught** (outline:123-127): `cane_road` really is at 6, 7 and 9 (`encounters.ts:512-545`),
  and `story.zetwal_return` has been on since Chapter 2, so a second table on `story.muster_begun` is the right fix.
- **The crew fight's `protects`** (outline:563-569). I re-ran it on the built engine: with `protects`, the plain bot
  that rushes the chief no longer wins faster than the fair one (24 actions and 0.57 falls at 24, against the outline's
  13 actions without it). x3 / x1.3 holds (section 5).
- **Z-3 rewritten around the absence** (7.2). The veiled woman is the built `road_watcher` by the mill
  (`zetwal-road.ts:46`), the Chapter 9 owner decision makes her the Almoner, and Chapter 9 has her fall in court and
  be taken. A boy at a cold hearth waiting for her is a better scene than the design's.
- **No new status, no boss, no Echo battle.** The chapter's cost is staging and data, and the outline says so.

---

## 3. Findings, most serious first

### 3.1 Free Brasador follows Azzy, not Joaquin (high: continuity)

**Evidence.**
- `QUEST-BUILD-GUIDE.md` 5.6 (line 246): "The Brasador soldiers who follow **him** [Azzy] become **Free Brasador**."
- Built Chapter 3: `ardencia.ts:1043` "We follow the captain. Where he goes, we go."; `ardencia.ts:1073` the sergeant
  to Azzy: "We hold the strand, **captain**. Come back with an army, or do not come back." Azzy: "With an army."
- Built Journal, `quests.ts:1528`: "Soldiers who followed **Azzy** off the wall."
- The outline: "Thirty of the wall's garrison, who followed **Joaquin** after the shots went wide" (outline:212-213);
  "He **commands** Free Brasador at the inspection and sails with it" (outline:926); at the whistle "Joaquin ...
  shouts the Brasador order and **his** thirty come to it" (outline:385-386); Chapter 14 names Joaquin as the volley
  captain.

**What the player sees.** Azzy's own company, the one that called him captain and sent him for an army, is handed to
his uncle on the day he brings the army back. The sergeant's Chapter 3 line ("Come back with an army") is the
chapter's set-up, and the payoff goes to someone else.

**Fix.** Keep `FAMILY.md`'s settled line (Joaquin *brings* Free Brasador to the Muster) and give the command back to
Azzy:
- Joaquin came over the wall alone after the escape ("I gave the order. I could hardly stay.", which is good and
  stays), went to the strand, and brought the company over by sea. "I brought the strand" stays.
- At the fountain: Joaquin to Azzy, "Your company, captain. I only carried it." The sergeant salutes Azzy, not Joaquin.
- At the inspection the second whistle is answered by **Azzy's** "¡Firmes!" (Joaquin beside him in the line, a `face`).
  Azzy's line to Gianna stays.
- Chapter 14's volley captains: "Azzy (Free Brasador), Joaquin at his side".

### 3.2 The family lines: four factual errors and a Rael clue (high: continuity and the locked rule)

**Evidence.**
1. **Rahel's children.** `STORY.md` (families, Oct 21): Rahel's children are Rael and Amanda (by Benny), Kayla and
   Aiyana (by a man of the Asian continent), and Jordyn (by a Black military man): **five by three men**. Zelia and
   Joaquin are Benny and Nancy's. The outline says "the mother of six by three men" (outline:274) and gives Rahel "I
   have six children and not one of them glows" (outline:305) and repeats it in 9.1 (outline:896).
2. **"Your grandfather's name"** (outline:279, 905). Azzy's grandfather is Benny. `STORY.md`: "Azzy (Azriel
   Rodriguez) is named after [Azriel Rivera]", Rael's guard captain.
3. **"Your husband's peppers"** (outline:299). `STORY.md`: "Old Benny and his wife **Nancy**". Rahel was never Benny's
   wife on any page, and Anicette saying so is also a statement about what Anicette knows (3.3).
4. **"A steppe braid"** (outline:274, 896). The built Chapter 6 says **Azzy's mother's** people are the Ironvow khatun's
   household (`quests.ts:1663`). A steppe braid on Rahel invents a steppe origin for his *father's* mother and blurs
   the one fact Ordvik's S-5 gave him. Her "three countries" are, by her children's fathers, Ardencia, the
   Asian-continent father's land and Jordyn's father's: not the steppe.
5. **The Rael lean.** The Locket's other half is Rael's signet (`rpg.ts:21, 31`; `ardencia.ts:416`: "I made the other
   half. A signet"; `ardencia.ts:682`). Patricia's line to Gianna, "you have spent a year finding out what the other
   half is worth. Keep carrying it. Things in halves are the only ones worth keeping" (outline:338-339), is therefore
   a great-grandmother telling her the father is worth keeping. With Rahel's "So I have heard said. In three
   countries. By people who were not in the room" (which says Rahel *was* in a room the accusers were not) and "Use it
   on the Crown. Not on him" (which, a chapter before the Harbor Turn's Trust/Strike choice, tells Azzy not to strike
   his father), the chapter carries three pro-Rael lines from the family. `STORY.md` 4 assigns Chapter 10 no Rael clue,
   and the outline itself says "This chapter gives no new Rael clue ... and must not" (outline:115-116). The Chapter 7
   to 9 rule is **one** line per relative that reads either way.

**What the player sees.** A careful player (and the owner) will catch the wrong count of the family's children and
the wrong namesake at once; these are the owner's own family facts. A careful player also hears three relatives in one
chapter tell Gianna her father is good, which spends the Harbor Turn early.

**Fix (lines, not scenes).**
- Rahel: "I have five children and not one of them glows."; on the map, "the mother of five, by three men".
- Rahel to Azzy: "Your father's jaw, a soldier's name, and from me you got nothing but the temper. Spend it on the
  Crown." (Drop "Not on him".)
- Anicette and Rahel: "You had the Marshal's whole camp crying over Benny's peppers in the year of the Accord." /
  "They were my peppers. Benny only carried them." (Benny is named; no husband.)
- Rahel's look: a black shawl and a Brasador brooch; drop the braid (or make the second piece a paper crane, Kayla's
  city, if a second country is wanted).
- Rahel's one line about him stays, shortened so it reads both ways: "My son does not explain himself. He never did.
  I stopped asking him to when he was nine." Gianna: "He sold Xaraguá." Rahel: "So they say." (A mother's refusal or a
  mother's knowledge, and nothing about rooms.)
- Patricia to Gianna, about Gianna, not the Locket: "Gianna Elise. You count everything twice. So do I. Count them at
  dusk; harbors lie." (Her harbor line moves here from the pier.) The Locket stays unmentioned in the family's lines
  until the Harbor Turn.
- The content test (outline:902-904) adds "other half", "worth keeping" and "in the room" to its forbidden list for
  Rahel and Patricia.

### 3.3 The staging settles open question 13 without the owner (high: owner-settled territory)

**Evidence.** `STORY.md` 6.13 is open: does old Patricio know who Rael is to the girls? Chapter 5 built his "I would
remember" as "literally true and evasive; see open question 13". The outline says "no line here settles STORY's open
question 13" (outline:302-303), but three pieces of staging do:
- **The blessing** (outline:333-343): Patricio is placed beside Patricia at the Gaze lamp while she calls up "the three
  great-grandchildren" (FAMILY.md's settled words) one at a time, including Gianna and Anissa, and puts her hand on
  their heads. A Patricio who watches that and says only "I lit that lamp for fifty years" knows.
- **The kitchen** (outline:297-303, 908): "two grandmothers decide, in front of each other, to say nothing". Anicette
  has laid the table for Rahel's coming and greets her as an equal in the family; that is Anicette knowing.
- **Patricio and Rahel at the lamp** (outline:910-911): "Benny asked after you. Every year. He never wrote." /
  "Neither did I." is Patricio knowing Benny and Rahel's history, i.e. whose son Rael is, in the scene where Rael's
  daughters are being blessed.

**What the player sees.** Nothing wrong today; but if the owner answers question 13 "no, Patricio does not know", the
chapter has already shown him knowing, and the Hearing (where "old Patricio may speak") loses its one surprise.

**Fix (no pop-up needed if taken).** Stage it neutrally so either answer fits:
- Patricio is **not** at the blessing. He is placed at the Marshal's stone from `story.watch_landed` (where his own
  scene is anyway), and Patricia's companion at the lamp is Rahel. His "I lit that lamp for fifty years..." line moves
  to after his stone scene ("...and never once asked it what it remembered").
- The kitchen: Anicette lays the table for "the envoy's guests" and Rahel comes as the mother of the watch captain who
  brought a company; the two women's "Madame" and the peppers stay (they knew each other in the Accord's camp), and
  nothing says "grandmothers". The family's silence is still the scene.
- Cut the Patricio-Rahel exchange about Benny's letters, or move it to the pier at dawn with Patricio's half removed
  (Rahel alone: "Benny asked after this harbor every year. He never came.").
- If the owner answers 13 before Nov 8, the three pieces can be put back in an hour. (Section 8, question 2.)

### 3.4 The chapter pays two levels, not one (high: levels)

**Evidence.**
- The built `XP_PER_OBJECTIVE_BY_CHAPTER` is `[15, 25, 30, 35, 40, 65, 44]` (`config.ts:77`): Chapter 6 pays 65 and
  Chapter 7 44, each set by `tools/level-curve.ts`. The outline's "[15, 25, 30, 35, 40] ... the last entry held at 40"
  and "not the formula's 65" (outline:24, 587, 604-607) are from before Chapters 6 and 7 landed. The table is
  positional, so a row for Chapter 10 needs rows for 8 and 9 first; `rpg.ts` `xpRules` lists `ACT1` to `ACT7` by
  index and needs `ACT8` to `ACT10`.
- The outline's fixed XP: eleven objectives at 40 (440), three mediations (45 to 75, the built `DEBATE_REWARDS`), Z-6
  200, the crew 120, M-ZET-2 25, Z-3 80: **about 940**. Level 24 is 532 wide (7,546 to 8,078); 25 is 545 wide.
- The outline plans from **exactly 7,546**, the floor of 24 (outline:593). Its own table then lands 8,616 with two
  ambushes, **7 XP under 26** (8,623), and 26 with three (outline:598).
- The built chapters do not end on a level's floor. Chapter 6's route ends at 4,579 (17 is 4,222 to 4,652: 74 under
  18); Chapter 7's at 5,493 (19 is 5,098 to 5,558: 66 under 20) (`COMBAT.md` 6 table). Both end in the top seventh of
  their target level, because the dials are set to "end on the target" from below.

On the built curve (fixed XP, expected ambushes about 2 to 3 at 64 each on Z-6's road, about 350 for a wanderer):

| Start inside 24 | Fixed 940 (outline), 2 ambushes | 3 ambushes | Wanderer | Fixed about 430 (fix), 2 ambushes | Wanderer |
|---|---|---|---|---|---|
| 7,546 (the floor) | 8,614: **25** | 8,678: **26** | 8,836: 26 | 8,104: **25** | 8,326: 25 |
| 7,810 (the middle) | 8,878: **26** | 8,942: 26 | 9,100: 26 | 8,368: **25** | 8,590: 25 |
| 8,000 (where 6 and 7 ended) | 9,068: **26** | 9,132: 26 | 9,290: **27** | 8,558: **25** | 8,780: 26 |

**What the player sees.** Chapter 11 (25 to 28) is met a level over, its first stage's foes white instead of even, and
the betrayer's flank fight (level 26) at the party's own level. A wanderer from a high Chapter 9 end is two over
(27), which fails `tests/levelCurve.test.ts`'s "p90 and wanderer at most one over".

**Fix.** Size the chapter to one level: **fixed XP about 430**, e.g. Chapter 10's objectives at **15** (165; a
one-level chapter is a Chapter 1-sized chapter in XP), the mediations as built (45 to 75), Z-6 **60** and its crew
**60**, M-ZET-2 25, Z-3 **30**. That lands 25 from any start in 24 and keeps a wanderer from the top of 24 at 26. Set
the exact dials with `tools/level-curve.ts` from **Chapter 9's measured end**, not the floor (the outline's own risk
note says the same, outline:1167). Add rows 8 and 9 (whatever their builds set) before row 10. Update `COMBAT.md` 6's
"three roads" note and the outline's section 5 table.

### 3.5 The ally ledger: fair in design, unfair as specified (high: player experience)

**Evidence.**
1. **Al-Doria's price was never shown.** The built Chapter 4 has no price scene, no Journal note and no `ally.al_doria`
   (outline:92-93 says so; `grep` of `aldoria.ts` and `quests.ts` finds no "Muster" and no price). Chapters 6 and 7
   each gave the player a note ending "Least paid, first bought" (`quests.ts:1669, 1754`); Chapter 3's says "Fear 6
   (owed, paid at the Muster)". Al-Doria's never did.
2. **Al-Doria is the likeliest betrayer for a player who paid.** On the outline's own rule (city pillar in the price
   currency, other two at half, books capped at 3) and the built pillar rules (`rpg.ts:648-668`): Skarragol runs
   about 0.55 of its price (only the floor: Samira's letter and the winter stores, with Ordvik's Influence at half)
   to about 1.2 (the purse and the jarl); Kuroshi about 1.0 to 1.4 (the receipts, K-2, K-3, the debate, the capped
   books); Jwaladesh about 0.75 to 1.7; Al-Doria about 0.6 to 1.0 (A-1, A-3, the debate, the capped books). So a
   player who paid the jarl and the purse, the "good" Ordvik player, meets a **Dorini** betrayal, for a price nobody
   named, which no choice in four chapters touched.
3. **Nothing at the Muster can pay it.** Gold gifts are offered at the Ironvow and Agnivansh camps only; "at the Dorini
   table and the Suzumori stage nothing is for sale" (outline:698-701).
4. **The number used is never the number shown.** The menu shows a city's local pillar only while the party is in that
   city (`GameMenu.ts:471`); the built notes list what was laid on the table, not a running "N of P". The ledger adds
   half of two other pillars and caps books. The outline's "the number they have been shown is the number that is
   used" (outline:674) is true of no built note.
5. **Ties.** "Ties go to Dorini" (guide 5.6) settles only ties that include Al-Doria. Skarragol and Jwaladesh at the same
   share have no rule.
6. **Joining a feud always costs the same house.** The built debate has one `ally` and one `opponent`
   (`engine/debate.ts:45-47`); Gianna always argues the ally's side. So "argued and won: the house argued against 0.75"
   (outline:694-695) means: the first feud always costs the **Ironvow**, the second the **Suzumori**, the third **Free
   Brasador** (Azzy's own company). The player never chose that side.

**What the player sees.** The night's betrayal is the chapter's consequence for four chapters of choices; it lands
fairly only if the player could have seen it coming and done something. As specified, the commonest "paid everyone"
outcome is a betrayal by the one house whose price the game never mentioned.

**Fix (keeps the outline's design, makes it legible).**
- **Name Al-Doria's price on arrival.** Rashid at the Dorini table: "The Merchant-Prince's price is Influence. Ten.
  Kirinoura's files say you paid it in books. We shall see." The Journal adds *The Dorini marines* with the same last
  line as the others.
- **Give each currency one act at the Muster, before dusk.** Gold for the two Wealth houses (as written). For the two
  Influence houses: the feud in which that house is the ally (Dorini in the first; for Kuroshi make Mibu the ally of
  the second, which also fixes 6 below) pays **+2 toward that house's share** when mediated. One sentence in the
  ledger; it turns the mediations into the Muster's payment, which is what "seat the feuds" is for.
- **Show the ledger's number, not the raw pillar.** The seven notes' last line, *At the Muster: N of P*, is the
  ledger's share (with the half-value and the book cap already in it), shown from `story.muster_begun`, not only after
  the night.
- **One plain warning before dusk, not naming a betrayer.** Samira at the inspection's start, the guide's rule in her
  register: "If I were the Crown I would buy the cheapest captain on this plaza. Look at your Journal and tell me who
  that is." (The player can still act on the Wealth houses until the whistle; gifts close at `story.inspection_done`.)
- **A full tie order**: Al-Doria, then Skarragol, Jwaladesh, Kuroshi (the guide's Dorini first; the rest by the
  roads' order).
- **Joining a feud costs both houses a little, not one house a lot**: joined (won or lost) 0.9 for both, mediated 1.
  The engine needs nothing new.
- Keep the half-value rule (the guide's), the book cap and the 60 percent gate.

### 3.6 Built placements and lines that would be wrong in Chapter 10 (medium-high: continuity)

The outline says "nothing Chapter 1 reads changes" and lists only `encounters.ts` and the road layer as touched built
lines (outline:1152-1157). These built placements and lines need a Chapter 10 condition or branch too:

| Built | Where | In Chapter 10, as built | Fix |
|---|---|---|---|
| `patricio_old` at (13, 3), **no condition** | `zetwal-temple.ts:29` | Patricio at the lamp all chapter, while also on the pier, the stone, the plaza, the Hall's harbor | `if: '!story.muster_begun'`; Chapter 10 placements by flag |
| `patricio_harbor`, `anicette_harbor` at (30, 10)/(31, 10), `if: 'story.escaped'` | `zetwal-harbor.ts:61-62` | standing on the pier for the rest of the game; `patricio_home_talk` says "Ardencia is across the strait. The trader that brought you home sails again at noon." | narrow to `story.escaped, !story.ardencia_arrived` (or `!story.muster_begun`) |
| `anicette` at (12, 4), no condition | `zetwal-house.ts:21` | fine at home, but Chapter 1's lines | Chapter 10 branch |
| crowd `plaza_evening` (6 festival-goers), `if: 'story.anissa_woke'` | `zetwal-town.ts:163` | festival-goers strolling through the camp | `!story.muster_begun` |
| `chancellor_talk` idle | `zetwal.ts:1584-1589` | "Your mother left me the Hall, the council and three Crown ships..." | Chapter 10 branch |
| `council_speaker` | `zetwal.ts:1722` | "The council sits tonight about the ships." | Chapter 10 branch (the gate's lines) |
| `road_watcher` at (36, 8), no condition | `zetwal-road.ts:46` | the Almoner on the Cane Road after she fell in Kingsmere, which breaks Z-3 | Chapter 9's build adds `!story.hushed_beaten` (its outline says so); Chapter 10's tests should assert it |
| `zetwal_forge` stock | `rpg.ts:451` | a `ShopDef` has no condition (`engine/rpg.ts:172-180`): adding tier-24 pieces puts them on sale in Chapter 1 | a second shop id on a second smith placement, `if: 'story.muster_begun'` |
| `trader_captain`, `if: 'story.zetwal_return, !story.ardencia_arrived'` | `zetwal-harbor.ts:64` | gone (correct); the Chapter 10 trader needs its own placement | new placement |

Add a test that walks every Zetwal map at a Chapter 10 start and asserts each placed NPC has a Chapter 10 line or a
condition that hides them (the Chapter 2 return had the same class of bug).

### 3.7 "Data only" claims that need small engine pieces (medium: build cost)

| Outline says | Built engine | Fix and cost |
|---|---|---|
| The Echo's two armies "as Echo-era crowd layers" (outline:517-521, 873-875); "no second Echo layer", "no engine piece" (outline:527) | crowds are **present only** (`engine/game.ts:162`: "The crowds walking this map now (the present only)") | place eight to ten Echo NPCs (the outline's own fallback, outline:1249); 0 engine, 0.05 data. Make it the plan, not the cut |
| The dusk "crowd layers re-placed in rows", "a `sync` to standing looks" (outline:377-384, 984) | crowds wander inside their rect (`engine/crowd.ts`); `sync` only re-reads flags (`engine/stage.ts:44-45`) | add a crowd prop `still: true` (stand on the rect's tiles in reading order, no stepping) and use one flag to swap a "standing" layer in: about 0.1 day with its test. The inspection is on the never-cut list, so cost it |
| "Four active by `party.active`" (outline:79, 528, 988) | **no `party.active` anywhere** (this branch, `chapter8`); `battleParty` takes the roster order, with `MemberDef.leads` to lift a member (`engine/battle.ts:1563-1570`) | plan from the roster order (Gianna, Yari, Azzy, Samira) unless Chapter 8 builds the screen; section 5 has the numbers |
| The ledger's text "by `muster.betrayer.*` once resolved" (outline:723-725) | item text is static (`rpg.ts` `text`) | four Journal notes (`when: muster.betrayer.<house>`) beside the item; 0 engine |
| "`item.marshal_whistle` stays in the Journal as *given back*" (outline:188) | key items are present or not | a Journal note *Given back for the day*; 0 engine |
| Stage actors for Vikram and Edmund | `STAGE_PARTY` is yari, azzy, samira, bayarmaa, haru (`engine/stage.ts:22`) | Chapters 8 and 9 add them; Chapter 10's stage test should fail loudly if they are missing |

### 3.8 The night at the harbor does not fit the built map (medium: staging)

**Evidence** (`zetwal-harbor.ts`): the map is 36 x 18; the customs house is at x 21 to 27, **rows 1 to 2**, at the north
edge, with its sign at (24, 3) and the harbor road at row 4; the quay is rows 9 to 10 and the sea is rows 11 to 17 and a
strip at x 0 to 1, rows 3 to 10. The outline puts the Crown's launch "tied at the customs house's steps" and "under the
point, outside the chain" (outline:412-416), and the consul on those steps. The customs house is eight tiles from any
water, and anything tied at the quay is *inside* a chain across the harbor mouth. The signal fire "visible from the
harbor map's edge" (outline:452-454) is on another map (`zetwal-heights`).

**Fix.**
- The chain: an `above` strip along row 16 from the long pier's end (31, 16) west to the map's edge: the harbor mouth.
- The point and the launch: the west strip (x 0 to 1) is open sea north of the chain line, so a launch at (1, 6) with
  the consul on the quay at (2, 6), beside the net shed (3 to 6, rows 1 to 2), is "under the point, outside the
  chain" on the real map. The quay's head trigger is at the harbor road's west end (2 to 4, row 4).
- The signal fire: one object on the tree row at the map's top edge (for example (31, 0)), lit on
  `story.betrayal_seen`, plus the keeper at the fire on the Heights map as written.
- The dawn's "hulls warped out to the harbor mouth": boat objects along row 15 inside the lowered chain's line.

### 3.9 Show, don't tell, at the two moments that matter most at night (medium: owner rule)

**Evidence.**
- "The purchase, **heard** (the owner's rule for off-screen events used for an on-screen one the party is ten tiles
  from)": lines "from `''` at a distance" (outline:417-419). The owner's rule allows sound for *off-screen* events;
  this is in front of the party.
- The betrayal route: the house's company "goes down to its ship in the dark", which "the player sees on the way back
  up: the camp's crowd layer gone, the banner object gone" (outline:443-446). A company leaving is shown as an empty
  space afterwards.

**Fix.**
- The purchase is acted: the captain walks to the consul; the consul opens the strongbox (object look); the captain
  takes a purse (the object moves to him) and the consul hands him a paper. The lines are spoken by `crown_consul` and
  the captain's speaker id, at the quay, as the party walks up the last tiles (stage `walk` for the player is
  allowed). No narrator-only lines.
- The company leaves **past the party**: walkers from the harbor door (35, 4) along the harbor road to the long pier
  and up the gangway (the same file the dawn uses for the levy), the boat object's look going on a `sync` after the last
  walker. The plaza's empty camp afterwards stays as the echo of it.

### 3.10 The betrayer is never "revealed as a secret member of the Quiet Crown" (medium: design)

**Evidence.** Guide 5.6 and `STORY.md` Chapter 10 beat 4: "The betrayer is revealed as a secret member of the Quiet
Crown." The outline gives one line, Anissa's "He walked like the lady with the basket", and calls it "a child's
observation, not a proof" (outline:448-451). The closed hand on Kayla's list is "not a Crown seal, and it is not a
house's" (`kuroshi.ts:586`), and the Chapter 7 outline records it as the Quiet Crown's mark (Ch7 outline:864-865), but
no built line tells the player so.

**Fix (two small shown things, no speech).**
- The captain's satchel, laid open on the quay, has the **closed hand** stamped on its flap (an object with a readable
  look: "A closed hand, in ash. The mark on Kayla's list."), and the consul's receipt is signed with it.
- His last line, either route, is recruiter A's Chapter 10 line in his mouth: "It will be quieter soon." Gianna (or
  Haru): "That's what they say on the plaza." Then Anissa's line, which now confirms what the player has just seen.
  That is "revealed", shown, and still names nobody above the cells.

### 3.11 The dusk, night and dawn conditions overlap; `story.fleet_sailed` is never set (medium: soft-lock risk)

**Evidence.** Dusk is `story.chain_raised, !story.inspection_done`; night is `story.inspection_done,
!story.fleet_sailed` (outline:377, 403, 638-639). Beat 9 is "Dawn on the Old Harbor" after `story.betrayal_seen`, but
no beat sets `story.fleet_sailed`, and the card sets `act10.complete`. As written, the dawn's placements (the lowered
chain, the hulls in line, the grandmothers on the pier) and the night's (the launch, the consul, the betrayer's
captain) are both true after `story.betrayal_seen`.

**Fix.** Three conditions that partition the day:
- dusk: `story.chain_raised, !story.inspection_done`;
- night: `story.inspection_done, !story.betrayal_seen`;
- dawn: `story.betrayal_seen` (and the card sets `story.fleet_sailed` with `act10.complete` for Chapter 11's maps).
Also:
- **A save at night after the walker:** the captain needs a **placed** NPC at the quay by `muster.betrayer.<house>`
  during the night (the walker is a picture; a reload drops it), and his camp placement is hidden from
  `story.inspection_done`.
- **`resolveMuster` closes the gifts**: the *Give gold* choices check `!story.inspection_done`.
- **`army.free_brasador` is pledged once**, by `resolveMuster`, not also at beat 1 (outline:214-215).
- **"Before you ever landed"** (outline:430-431): the betrayer is chosen at dusk by shares the player can still change
  that afternoon, so the ledger cannot have named him days before. Cut the clause; "Your sigil, Captain, on the
  Crown's muskets, in a Zetwal field" is enough.

Both night routes are otherwise free of soft-locks: the exposed route's two entries have true `if`s on every save
(`clue.buyers_mark` is main story in Chapter 7; `side.muskets.done` is in the gate), and the betrayal route has no
choice that can fail. The route test the outline proposes (each house forced, both routes, eight short variants) is
the right check; add a save-and-reload at night to two of them.

### 3.12 M-ZET-2: a bar on the outside of a door does not keep outsiders out (medium: puzzle logic)

**Evidence.** `PUZZLES.md` M-ZET-2: "the cellar door has a heavy oak bar on the outside... bar the cellar in the Echo
so that in the present the smugglers are shut out of their own cache". The smugglers are outside the door. A bar on the
outside keeps things in; anyone outside lifts it. The outline keeps it word for word (outline:729-736, 862-866).

**Fix (difficulty 2 kept, one verb kept).** The powder-master's rule: "Bar it and pin it when you go, Marshal. Powder
doesn't need visitors." The Echo object is the bar **with its iron pin** (the Chain Bridge's pawl, which the player
already knows): one `use` drops the bar and drives the pin. The present: "Fifty years of rust have welded the bar into
its brackets. Crowbar marks all over the oak: somebody tried last night." The levy brings the Harbor forge's saw at
dawn (one line on the pier). The cheat line stays.

### 3.13 The crew fight with the built active order is harder than claimed (medium: difficulty)

My re-run on the built engine (Chapter 8 start save, built Bayarmaa and Haru, `protects` on the crew; x3 / x1.3 at 25;
30 seeds; Story difficulty; falls party-wide):

| Active four | Bot | Party 23 | Party 24 | Party 25 |
|---|---|---|---|---|
| Gianna, Yari, Azzy, Edmund (the outline's) | fair (crew first) | 30/30, 29 actions, 0.50 down (13 seeds) | 30/30, 26, 0.17 (4) | 30/30, 25, 0.00 |
| same | plain (chief first) | 30/30, 26, 0.93 (23) | 30/30, 24, **0.57 (14)** | 30/30, 23, 0.40 (10) |
| **Gianna, Yari, Azzy, Samira (the built roster order)** | fair | 30/30, 36, 0.83 (20) | 30/30, **30, 0.60 (18)** | 30/30, 29, 0.47 (12) |
| same | plain | 30/30, 29, 1.30 (28) | 30/30, 27, 1.03 (22) | 30/30, 28, 0.53 (14) |
| Gianna, Yari, Vikram, Haru | fair | 30/30, 20, 0.17 (5) | 30/30, 18, 0.13 (4) | 30/30, 18, 0.10 (3) |

The fair bot with the outline's order reproduces its table exactly, so the engine port is faithful. `protects` works
as intended: the plain bot no longer wins in half the actions. But with **no `party.active`** (3.7) the default four
are Gianna, Yari, Azzy and Samira, and at 24 the fight runs 30 actions with a fall in **18 of 30** seeds, not "a fall
in one fight in seven". Everyone still wins every seed.

**Fix.** Keep x3 / x1.3 (it is a side quest's named fight, Game Over returns to the crates, and every seed wins);
state the default-order numbers in the milestone note; put a one-line hint at the landing (Bayarmaa: "Put your best
blades up front. Grandmother always did.") pointing at the built swap. If Chapter 8 builds a party-order screen, re-run.
The Cane Road's four trios reproduce exactly on the built engine (7, 13, 7 and 11 actions at 24, nobody down): fine
for "a walk with knives in it".

### 3.14 Anicette's four-accounts talk repeats Chapter 1's quiz (medium: pacing)

**Evidence.** Chapter 1's built Overdue Shelf already asks the question and gives the answer: "at the ford of Cendre,
how many dead did our healers count?" / wrong: "Four hundred is what the Crown wrote, in Aldermoor, far from the ford.
Read it again, Gianna. Slowly." (`zetwal.ts:778-788`); Chapter 9's chronicle fly-leaf says "Written to order"
(Ch9 outline:845-846). The outline's talk asks "Which of the four is lying?" with right line "Written to order, in
Aldermoor, far from the ford" and wrong lines "Read it again. Slowly." (outline:317-321).

**What the player sees.** The same quiz, with the same lines, a third time, with the answer printed in the chronicle
the player carries.

**Fix.** Make it a conversation with no wrong answer: Gianna lays the four on the kitchen table (four item objects);
Anicette touches the chronicle's fly-leaf: "So you found the clerk." Gianna: "He wrote it large because they asked
him to." Anicette: "Then you have all four, and you know which one to read aloud at the Hearing." `clue.four_accounts`,
+3 Concord. The four flags are the read flags `lore.zetwal_ash_wars_temple`, `lore.kuroshi_spy_ledger`,
`lore.zetwal_ash_wars_anicette` and Chapter 9's chronicle book's `lore.*` (not the `side.*.done` flags; outline:97
guesses at the name).

### 3.15 Numbers and two lines (low-medium)

- **Jordyn's company** is six, seven, twelve and nineteen in the same chapter: "six of the watch" down the gangway
  (outline:272), "Seven of the watch, twelve of the barn's lot" (outline:287), "seven come to it" (outline:388),
  `ARMIES` dissidents 12 "(seven and the barn's lot)" (outline:694), Anissa's "The violet ones are only twelve"
  (outline:397), "the seven violet coats" (outline:828). Chapter 9: "Seven of the watch and the barn's lot". Pick one:
  Jordyn plus seven of the watch plus five of the barn's lot = **twelve with Jordyn**, and say "seven" only of the watch.
- **Anissa's "Six and a half"** (outline:396-398) reads as a quip and calls the dissidents half an army in the chapter
  whose third feud is about trusting them. Replace with an earnest count: Haru: "Seven. I counted too." Anissa: "Eight.
  You didn't count us." Haru: "...Eight." (Earnest, hers, no joke.)
- **Mediation 3's "...Terribly sorry, Captain"** is a joke built on Edmund's tic and lands in a debate the follower is
  walked away from; that is allowed, but the outline says Edmund's one apology is on the deck (outline:167): two
  "terribly sorry"s are fine, call it his running joke, not "his one".
- **Patricio's "Did it."** (outline:182) is a variation on the built "Did she." (`zetwal.ts:969`), not the built beat
  "kept"; fine as written, just not a quote.

### 3.16 Z-3 details (low)

- **The name on a name stone.** Ti Jak's mother "lost last year" is "on a name stone, and a reader of the stones knows
  it" (outline:759-760). The Temple island's stones are the Revolution's (S-ZET; *A Name in the Cane* finds a
  plantation worker of fifty years ago on them). Put her name in **Mother Solange's list** in the Temple Archive (the
  built object Gianna wrote Rose-Aimée into), and make Compassion need `side.cane_name.done` or the list read.
- **"She hasn't come since the ships"** (outline:751): the woman was the Regent's almoner through Chapter 9, so she has
  not come since the festival, not since three days ago. "She hasn't come since the lamp."
- **The appeals rule** (outline:761-763) is unclear to a builder ("either of the right two works; the wrong one ...
  is Scripture said first"). Write it as: right, Compassion or Reason (Reason only with the tract read); Scripture,
  "He's heard that from her too. Not yet." and back. Keep the Gaze line from being "wrong" (faith on the map, outline
  section 15's own risk): it is "not yet".

### 3.17 Pacing and small continuity (low)

- **The harbor four times, the Hall twice.** The route goes pier, plaza, Hall, harbor (Jordyn), house, the hub, Hall,
  harbor (chain), plaza (dusk), harbor (night), harbor (dawn). Two merges save a round trip each with nothing lost:
  (1) **Jordyn's company walks up onto the plaza** from the harbor door (0, 23) while the party is in the camp after
  the council (the Chapter 9 outline asked for "their arrival on the plaza", Ch9 outline:1281-1282; Rahel's "Don't run
  on a pier" becomes "Don't run at your grandmother"); (2) **the chain goes up at dusk**, heard from the plaza (the
  capstan's ratchet and a shake: the off-screen rule), and is seen raised when the party walks down at night.
- **Kayla was invited.** The built Chapter 7 has Azzy: "Titi. Come to the Muster." / "I am a clerk." (`kuroshi.ts:598-600`).
  One paper crane on the Suzumori stage, "From Kirinoura's archive, unsigned" in Rahel's hand at the kitchen table,
  pays it in one line.
- **"The owner's 'a sentence, not a speech'"** (outline:1037-1038) is the Chapter 9 outline's phrase, not the owner's,
  and that outline also wrote "before the Muster's **speech**" (Ch9 outline:1078). See section 8, question 1.
- **The header's state** (outline:39-47): Chapters 6 and 7 are now built on this branch; refresh the citations
  (the XP table, `party.active`, the Chapter 6 and 7 price notes) before the build starts.

---

## 4. The outline's engine and continuity claims, checked

| Claim | Where checked | Result |
|---|---|---|
| `cane_road` is at 6, 7 and 9, on `story.zetwal_return` | `encounters.ts:512-545`, `zetwal-road.ts:61` | **true** |
| The whistle's text and "it matters again in Chapter 10" | `rpg.ts:58-64`; `zetwal.ts:1336-1339` | **true** |
| Pòdlimyè's sea point (119, 37); `zetwal_xaragua` north round Ardencia to (46, 32) | `voyages.ts:9-28` | **true** (needs a new `VoyageDef`: the built one says "Yari paddles out") |
| Spawn `harbor_return` at (30, 13); map 36 x 18 | `zetwal-harbor.ts:9-10, 59` | **true** |
| The old sailor, the lookout keeper, the Harbor councillor, the Speaker, the consul's lines | `zetwal.ts:1954, 1977, 1730, 1722, 1737` | **true** |
| The consul "left the Hall for good" | `zetwal.ts:1593` | **true** (the Hall only; his return at the harbor is consistent) |
| Recruiter B "You would be surprised who wears our hood"; female | `zetwal.ts:351`, `npcs.ts:24` | **true**; her built "after" line already names "the woman by the mill" (`zetwal.ts:357`), which her Chapter 10 line should echo |
| "I'm holding the door, Gigi." at `plaza_stone` | `zetwal.ts:640`, `zetwal-town.ts:164` | **true** |
| The Marshal's stone "room ... for a seventh. It is blank." | `zetwal.ts:477` | **true** |
| The shawl on the chair's arm | `zetwal.ts:1662` | **true** |
| `choice.patricio_protest` 'time' and 'unread' | `seat.ts:651-658` | **true** |
| The veiled woman is on the Cane Road by the mill, and Chapter 9 makes her fall | `zetwal-road.ts:46`, `npcs.ts:92`; Ch9 outline 476-494 with its review 3.2 | **true**; her placement still has no `!story.hushed_beaten` (Chapter 9's build adds it) |
| Free Brasador followed Joaquin | guide 5.6 line 246; `ardencia.ts:1043, 1073`; `quests.ts:1528` | **false** (3.1) |
| Rahel "mother of six"; "your grandfather's name"; "your husband's peppers" | `STORY.md` families | **false** (3.2) |
| Debates: `opensIf`, `mediate` at Influence 5 in the city, `settled` on won, lost or mediated | `engine/debate.ts:49, 105-123, 148-149`; `config.ts:306` | **true**; one fixed ally side per debate (3.5) |
| `protects` and `INTERCEPT_CHANCE` 0.75 built | `engine/battle.ts:269, 1433`; `config.ts:236` | **true** |
| `XP_PER_OBJECTIVE_BY_CHAPTER = [15, 25, 30, 35, 40]` | `config.ts:77` | **stale**: `[15, 25, 30, 35, 40, 65, 44]` (3.4) |
| `AMBUSH_XP`, `LEVELS` 50 / 1.6, 24 at 7,546, 25 at 8,078, 26 at 8,623 | `config.ts:60-66, 330` | **true** |
| `ARMY_VOLLEY_PER = 10` | `COMBAT.md` 11 | a **proposal**; not in `config.ts` (Chapter 11 adds it) |
| `armies()` reads `army.*` | `engine/rpg.ts:271-273` | **true** |
| `party.active` built by Chapter 8 | this branch and `chapter8` | **not built anywhere** (3.7, 3.13) |
| Crowds can be Echo-era and stand in rows | `engine/game.ts:162`, `engine/crowd.ts` | **false** (3.7) |
| The Harbor forge can stock tier 24 for Chapter 10 | `engine/rpg.ts:172-180` | **not without a second shop** (3.6) |
| The books cited for Reason exist | `books.ts`: *Harbor Tolls and Roads* 203, *The Four Hands* 105, *A Quiet Crown Tract* 214, *On Contracts* 501, *The Crown's Offer* 811, *The Burned Temple* 914 | **true**; *The Priests' Decision* is Chapter 8's, not built yet |
| Chapter 1's Anicette scene is the basis for the four-accounts talk | `zetwal.ts:765-794` | **true**, and it already is the quiz (3.14) |
| The Gaze lamp at (14, 3) on the Temple island; Patricio placed beside it | `zetwal-temple.ts:29, 52` | **true** (and unconditional: 3.6) |

---

## 5. Difficulty and levels, summarised

- **Fights.** The chapter's one named fight is fair at x3 / x1.3 with `protects` (confirmed on the built engine), but
  with the built roster order it costs a fall in more than half the seeds at 24 (3.13). The Cane Road's trios are
  trivial to win and that is the right tone. No group is grey at 24 to 25 (`LEVELS.bands.trivial` 3).
- **Levels.** As written, the chapter ends on **26** for nearly every player and **27** for a wanderer from a high
  Chapter 9 end (3.4). With fixed XP about 430 it ends on 25 from anywhere in 24. Plan from Chapter 9's measured end.
- **Gold.** 400 from Z-6 (scaled from 600) plus 300 for the crew is a lot in a chapter where gold buys the night's
  outcome at 100 a point: 700 gold is seven points of Skarragol's or Jwaladesh's price. That is a fine lever if the
  player can see the shares (3.5); keep Z-6 at 400 and drop the crew's purse to 150, so the Muster's gold choice still
  costs something.

---

## 6. Soft-locks: the two routes of the night

Walked on paper against the outline's conditions with the fixes in 3.11:

- **Exposed route** (`muster.exposed_possible`): the two *Lay evidence* entries' `if`s (`clue.buyers_mark`, Chapter 7
  main story; `side.muskets.done`, in the gate) hold on every save; the house's second, the companion, Jordyn and the
  consul are all placed by flag; the captain is placed (not only walked) at the quay; no choice can fail. **No lock.**
- **Betrayal route** (not `muster.exposed_possible`): one line, the captain steps into the launch, the company walks
  past (3.9); `story.betrayal_seen` set on Anissa's line. **No lock.**
- **Risks fixed by 3.11:** dawn never arriving (night runs to `story.fleet_sailed`, never set); a reload at night
  losing the captain (walker only); gifts after the betrayer is chosen.
- **The four houses x two routes:** the route test's eight forced variants plus a night save-and-reload in two of them.
- **Gate:** the three feuds settle on a loss too (`debate.ts:149`), so no player is stuck behind Influence 5; Provoke
  does not settle, as the outline says.

---

## 7. The 3-day build against Nov 8 to 10

The outline sizes the engine and wiring at about 1.33 builder-days and the chapter at three days (outline:992, 1196).
On the evidence:

- The chapter is the largest written yet: **~395 lines** (Chapter 9 ~370, Chapter 8 ~290, Chapter 7 ~285), **25
  transitions** (the most), eight night variants, five arrivals (the houses), three family scenes, three debates of
  three rounds each, two quests, an Echo puzzle and an Echo scene.
- Stage actors are costed at 0.25 for the chapter (outline:989); the Chapter 8 and 9 reviews costed that much per
  chapter with fewer walkers. The night alone (four captains, four seconds, four companion lines, Jordyn, the consul,
  the company's walk) is a day's staging unless it is written **once, from a table** (one script function that takes
  the house: captain id, look, line; second id, look; companion id, line; boat object id), which I recommend.
- The fixes above add about **half a day**: the crowd `still` prop (0.1), the Chapter 10 conditions on built
  placements and their test (0.15), the second shop (0.02), the ledger's display and the mediation payments (0.1), the
  Echo NPCs instead of crowds (0.05), the harbor re-siting (0.05).

**Judgement:** three days holds only with the night written from a table and the two merges in 3.17 taken; otherwise
it is **3.5 days**, and Chapter 11's outline (which the plan overlaps from day 2) slips into Nov 11. This is the first
chapter after the Nov 8 decision date: the milestone note should say that if Chapter 9 is not built by Nov 8, Chapter
10 is built from a hand-written start save (the outline's own fallback, outline:1187-1189) and its ledger tested on
that save's state. The cut list (outline:1249-1255) is good; move "the Echo's crowd layers" off it (it is the plan
now) and add "the chain's capstan scene" earlier (3.17 already merges it).

**Length.** ~28 to 32 minutes against the plan's "10 minutes plus side content" (outline:1111-1114). That is fine for
a 6-hour release, but say it in the milestone note so the owner's time budget for playtesting (Nov 16 to 21) knows.

---

## 8. Questions for the owner (only what could change the story's flow; one at a time, recommendation first)

**Question 1: Where does Anissa "speak at the Muster"?**
*Why it reaches the owner:* her voice is the owner's thread (`STORY.md` 4: "she speaks at the Muster"), the Chapter 9
outline promised "the Muster's speech" after her court line, and the outline's choice (her name, said privately to
Patricia at the lamp) is smaller than her Chapter 9 line, which was said in a court.
1. **(Recommended)** Both: her name to Patricia at the lamp, as written, **and** one sentence in public at the
   inspection, after the second whistle, to the seven lines (earnest, no joke, nobody near her armed; for example:
   "Anissa. I hold the door. Hold yours."). The public sentence is the step after the court; the blessing is the
   family's.
2. Only the blessing (the outline as written).
3. A longer speech at the inspection (more than one sentence).

**Question 2 (only if the build keeps Patricio at the blessing): does Patricio know whose daughters they are?**
*Why it reaches the owner:* it is `STORY.md` open question 13, already on the owner's Dec 1 list, and the outline's
staging answers "yes" without asking (3.3).
1. **(Recommended)** Don't decide it in Chapter 10: stage the blessing without Patricio and the kitchen without
   "grandmothers" (3.3), and keep question 13 for the Dec 1 list. No pop-up now.
2. Yes, he knows: keep the outline's staging as written.
3. No, he does not: keep him away from the blessing and give him one line of surprise that the Hearing pays.

Nothing else in the outline, with the fixes above, changes the story's flow: the Free Brasador fix (3.1) restores the
guide's own fact, and the ledger fixes (3.5) make the guide's rule legible without changing who can betray.

---

## 9. The fixes, in build order

1. **Day 1 morning, docs:** take 3.1, 3.2, 3.3 (or the owner's answer), 3.4's numbers and 3.5's rules into the
   outline and `STORY.md`; record each as Claude's call.
2. **Day 1, engine and data:** the ledger with the display line, the mediation payments, the full tie order and the
   0.9 / 1 feud multipliers; the XP rows 8 to 10 from `level-curve.ts` on Chapter 9's end; the crowd `still` prop;
   the Muster shop; the night written from a per-house table; the conditions of 3.11.
3. **Day 1, maps:** the Chapter 10 conditions on the built placements of 3.6 and their test; the harbor re-sited
   (3.8); Echo NPCs for the morning of the signing.
4. **Day 2, dialogue:** the family lines (3.2), Free Brasador (3.1), the purchase acted and the company walking past
   (3.9), the closed hand and "It will be quieter soon" (3.10), the four-accounts conversation (3.14), Jordyn's
   numbers and Anissa's count (3.15), Z-3's list and appeals (3.16), Kayla's crane (3.17), M-ZET-2's pin (3.12).
5. **Day 2 to 3, tests:** the content test's new forbidden phrases for Rahel and Patricia; the crew fight at 23 to 25
   in the roster order (3.13); the night's eight variants plus two reloads; the "every placed NPC has a Chapter 10
   line or a condition" test.

---

*Open items (`docs/PRODUCTION.md`), most urgent first, for the next milestone note:* art drop 1 (Fri Oct 24); the card
art, character portraits and card back before the rules and card text freeze (Fri Oct 31); order B with proofs (Mon
Nov 3); the Nov 8 decision date (this chapter is the first build after it); the Dec 1 story questions needed by early
November (question 13 is the one this chapter touches: section 8, question 2); the fluent-speaker check (Wed Nov 18:
no new language here, "¡Firmes!" is Spanish and already in the realm's tongues). `PRODUCTION.md` was last updated
Oct 19 and should be brought current.
