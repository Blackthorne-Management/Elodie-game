# Second review: Chapter 9 outline, The Regent's Keep (Oct 22)

*Reviewer: an independent helper, reading only. Subject: `docs/quest/reviews/2026-10-22-chapter9-outline.md`
("outline:N" below means that file's line N). I checked it against:*

- *the built game in this checkout (`quest/src`, branch `claude/new-session-43aoxw` at 01f36ee: Chapters 1 to 5 built),
  including the uncommitted work in the tree when I read it (`config.ts` `AMBUSH_XP`, `engine/battle.ts` `ambushXp`,
  `tools/level-curve.ts`'s played line), and the Chapter 6 engine snapshot the outline simulated against
  (`scratchpad/ch6sim/snap/quest`, commit 889ed60);*
- *the Chapter 1 and Chapter 5 dialogue as built (`data/dialogue/zetwal.ts`, `seat.ts`), the Cane Road map
  (`tools/maps/zetwal-road.ts`) and `tests/choices.test.ts`;*
- *the Chapter 8 outline and its second review (`2026-10-22-chapter8-outline-review.md`, "Ch8 review"), which this
  outline was written before (outline:39-40);*
- *`CLAUDE.md`, `PLAN-ALL-CHAPTERS.md`, `STORY.md`, `FAMILY.md`, `COMBAT.md`, `QUEST-BUILD-GUIDE.md` (the Echo rule).*

*What I ran (Story difficulty, 30 seeds per row, the outline's own bot and party):*

- *the outline's script, unchanged in logic, as `scratchpad/ch9rev/rev-sim.ts`, with three switches: the down counter
  as written or party-wide (`b.party` instead of `b.fighters`), the boss rows the scratch file no longer runs, and a
  "plain" bot that hits the boss first. With the counter as written it reproduces the outline's table exactly (x7 /
  MAG x1: 34, 33, 31, 29 actions, 0 down; x7 / MAG x2: 28/30, 0.70 down at 21, and so on), so the differences below are
  the counter and nothing else.*

*I changed no other file and committed nothing.*

---

## 1. Verdict

**Build it after the fixes in section 6.** On story it is the best-joined chapter so far:

- the Crown is a court, not a villain's lair: polite constables, a Regent who names people and never raises his
  voice, and a city that steps aside for a woman with a basket;
- Jordyn's three acts (the postern in secret, the arrest by the book, the resignation in open court) are exactly
  "disciplined, blunt, fair", and the arrest is what puts the party in the dock instead of on the heath;
- Sebastian is heard before he is seen, and his help (the loud piece at the hour) is the one `FAMILY.md` settled;
- the courtroom is a real puzzle whose rule belongs to the city (a forsworn witness's evidence falls with her), and
  the lie names the two things that break it;
- Thomas's Chapter 5 line ("Someone will read it one day") is paid in front of the city.

**Eight problems would ship broken, contradictory, or with a wrong number if built as written:**

1. **The boss numbers rest on the down-counter bug the Ch8 review found** (3.1). Counted party-wide, the chosen
   Hushed (x7 / MAG x2) puts **2.7 to 4 fighters down per fight at 21 to 22** and 1.3 at 24, not "one in five" and
   "none at the top". And the claim that without `magScale` she "cannot hurt a party at all" is overstated: she
   downs 0.1 to 0.6 a fight as built. The magScale is real and needed, but about **1.25**, not 2.
2. **The Almoner = Chapter 1's veiled woman is built on three wrong facts** (3.2). Chapter 1's woman is on the
   **Cane Road by the old mill**, not the plaza. Her flag is `choice.warned_watcher`, not `choice.stay_away`. And
   **Gianna** says "Stay away from her", not Anissa. Meeting her is optional, nobody in the built game ever says
   "the Hushed", and she is still standing on the Cane Road in Chapter 10.
3. **Sebastian cannot be a Limyè** (3.3). Chapter 1's elder says Elodie *took* the name Limyè, and "her father's name
   was good enough for the rest of us". The family name is Jean-Philippe (Marshal Patricio Jean-Philippe, in the
   books).
4. **Anissa is in the organ loft while Gianna is in the Echo** (3.4). The guide's rule is that Anissa stays at the
   Echo site and holds the door open; that is the in-story reason the Echo lasts. Then she is put into a cell in the
   keep overnight, which breaks the condition Jordyn herself set.
5. **The level plan answers a drift that the realm-wide ambush rule now in the tree removes** (3.5). Planned from
   the target start (21), the chapter's XP lands on 23, not 24. The Hushed's 120 XP is a quarter of a level, where
   Qasim's 200 was half of one.
6. **Al-2 is not required** (3.6). Walking past the shelf does not do the quest, so "no player can miss the Concord
   bonus" is false.
7. **The dissidents' price can never be short** (3.7). The guaranteed items alone make 8 of 8, and the same court
   win is counted twice.
8. **Several "data only" claims are not data** (3.11). Among them: walkers that follow the party, a rain layer
   switched by a flag, cabinet looks by flag value, conditional weights and Edmund on stage. Two and a half days
   does not hold with Calm in it.

**Owner questions:** none required by the owner's rule. One borderline item touches an owner-settled line (`STORY.md`
6.3) and is listed in section 5 with a recommendation; the build goes ahead on it either way.

---

## 2. What I agree with

- **The landing and the watching** (outline:142-165). The Mere Stair, the two constables who fall in behind, the
  Sealbearer who keeps the papers a breath too long. "Tired, polite and watched" is shown by people who follow, not
  by a speech, and it picks up the Chapter 8 outline's hand-off (Ch8 outline:1036-1038).
- **The press-gang and Edmund's hat** (outline:183-204). The apology is the joke, and the man is the one who hits
  anyway, so the comedy and the character are the same act. Joining him at the pie shop is the right split of
  `STORY.md`'s "defies the Regent and joins". The player plays the Guardian in the Guardian's chapter, and the
  defiance is said where it costs him his mother's seat (outline:509-512).
- **Jordyn** (outline:217-271, 406-418, 513-515, 545-552). Her line at the door is about the child; her rule is law,
  not family. Her one line about Rael ("Keep the law") reads either way. Azzy's "Titi—" is cut off, as the Ch8
  outline asked for the fourth Titi. Her company is Chapter 10's army with Rahel and Patricia. Keep all of it.
- **The court's rule** (outline:440-445). Law as an oath is guide 7.1, so the puzzle's logic is the city's. The
  Almoner's lie names the room and the record it is broken by (outline:450-454): "honest 3" is right.
- **The archive cabinets as data** (outline:932-937). Two numbers and a colour, each given by the room, every state
  reachable, a wrong pull a line. Make the cabinets a dialogue with choices (3.11), and they cost no engine.
- **No Echo battle** (outline:618-620). A flag of truce in an archive and a roll call in a court cannot be fights.
- **The Regent** (outline:1086-1091). He gives up a margin to keep a clause and sets his agent down in one sentence,
  "three moves ahead" shown rather than told. Nothing provable, so Chapter 12 stays a Challenge (but see 3.8 on the
  commission, which proves too much as written).
- **St. Agatha's** (outline:113-116, 591-592). `FAMILY.md` settles Sebastian's recital "on Kingsmere cathedral's
  great organ", and `CAPITALS.md` 9 has no cathedral, so adding one is the honest fix. Holding the Townhouse back for
  Al-5 after the release is right.
- **The design's timeline error fixed** (outline:117-120, 854-857). The Ash Wars were about twenty-five years ago, so
  "written to order" is Thomas's old-age margin and not an Echo step. Better than the design.
- **The engine fact behind `magScale`.** `enemyStats` (`engine/battle.ts:539-548`) multiplies ATK by `atkScale` and
  never touches MAG, and every built boss is a tank or a brute (Rael, Qasim, the Sergeant). The Hushed is the first
  caster boss, so she does need a MAG field. 3.1 is about how much.

---

## 3. Disagreements and risks, most serious first

### 3.1 The Hushed: the counter bug again, and MAG x2 is a wall

**The counter.** The scratch sim counts a fall like this (`scratchpad/ch9sim/hushed-sim.ts:224`):

```ts
downs += evs.filter((e) => e.kind === 'down' && b.fighters.some((f) => f.key === (e as { who?: string }).who)).length;
```

That is the line the Ch8 review found (its 3.1). `b.fighters` is the active four, and a fighter who falls is swapped
for a benched one in the same blow, so with eight fighters a fall is almost never counted. I changed only that line:

| The Hushed, the outline's bot, party A (Gianna, Yari, Azzy, Edmund) | 21 | 22 | 23 | 24 |
|---|---|---|---|---|
| x7 / MAG x1, as the outline counts | 30/30, 34 actions, 0 down | 30/30, 33, 0 | 30/30, 31, 0 | 30/30, 29, 0 |
| **x7 / MAG x1, counted party-wide** | **0.60 down** | **0.37** | **0.10** | **0.00** |
| x7 / MAG x2 (chosen), as the outline counts | 28/30, 32, 0.70 | 30/30, 31, 0.20 | 30/30, 30, 0.07 | 30/30, 28, 0 |
| **x7 / MAG x2, counted party-wide** | **4.00 down** | **2.67** | **2.07** | **1.33** |
| x7 / MAG x2, `hushed` as `weakened`, party-wide | 29/30, 3.27 | 30/30, 2.40 | 1.87 | 1.40 |
| x6 / MAG x2, party-wide | 30/30, 3.23 | 2.47 | 2.07 | 1.13 |
| **x7 / MAG x1.25, party-wide** | **30/30, 33, 1.33** | **31, 0.80** | **31, 0.63** | **29, 0.37** |
| x6 / MAG x1.25, party-wide | 30/30, 32, 1.13 | 31, 1.20 | 29, 0.53 | 28, 0.40 |
| x7 / MAG x1.5, party-wide | 30/30, 33, 1.77 | 33, 1.57 | 31, 0.90 | 30, 0.83 |

So:

- **"Without it the Hushed is harmless at any HP" (outline:57-59, 1108, 1328-1331) is overstated.** As built she puts
  someone down in about one fight in two at 21. She is soft, not harmless. The `magScale` field is still the right
  fix, because a caster boss should scale like a striking one.
- **MAG x2 is the wall the outline says x2.5 is.** At the band's floor it is four fighters down a fight. Even at 24 it
  is more than one.
- **MAG x1.25 at x7 is the fight the outline describes:** about 31 to 33 actions; about one down at the floor and
  under half one at the top. That is the target the Ch8 review set for Dhanraj (about one down at the floor, at least
  28 of 30 won).

**The Hushers are decoys.** A plain bot that hits only the boss wins in the same number of actions with fewer downs
(MAG x2: 32, 31, 30, 29 actions and 1.0 to 1.3 down, against the fair bot's 2.1 to 4.0). The reason is
`endsWithBoss`. This is the Ch7 and Ch8 reviews' decoy finding again. The fix is built: `protects: 'the_hushed'` on
the Hushers (`EnemyDef.protects`, `INTERCEPT_CHANCE`). It is also the story: the cells kneel to her and stand in front
of her.

**Edmund still does not matter.** Party C (Edmund benched) wins faster than A at every level in my runs too (24 to 29
actions against 28 to 32), with about the same downs. The outline's answer (outline:1333-1337) is that the real
`hushed` will reward guarding. That holds only if `hushed` blocks what Edmund does not need. Write in the spec
whether `hushed` blocks **moves** (Shield Bash and Measured Blow are SP-0 skills in the engine) or only SP skills:
- **If it blocks moves too,** every hushed fighter is down to plain Attack, and the tank's high DEF is what carries
  the fight. That is the outline's intent.
- **If it does not,** Edmund's kit (Shield Wall, Tea Break) is the only part that `hushed` takes away, and he gets
  worse, not better.

**Starting gear** (the Ch8 review's caveat). Every sim loads the Chapter 4 start save, so the party at 22 wears its
starting gear (Edmund in an officer's coat and a steel saber). Real parties will be stronger, so these numbers are a
ceiling on danger.

**Fix:**

- Set `magScale` to 1.25 (`hpScale` 7) on the Hushed, not 2.
- Give the Hushers `protects: 'the_hushed'`.
- State in the spec whether `hushed` blocks moves (recommendation: yes, Attack, Guard and Item only, as COMBAT 10's
  row says).
- Fix the counter in the sim that day 1 moves into `tests/`.
- Re-run with tier-appropriate gear and both bots. Aim for about one down at 21, at least 28 of 30 won, the plain bot
  no faster than the fair one, and Edmund active no slower than Edmund benched.
- Change the outline's tables and outline:685-691, 1328-1331.

### 3.2 The Almoner and Chapter 1's veiled woman: wrong place, wrong flag, wrong speaker

What Chapter 1 actually shows (`quest/src/data/dialogue/zetwal.ts`, `tools/maps/zetwal-road.ts`):

- **The woman is on the Cane Road, by the burned sugar mill.** `npc('road_watcher', 36, 8, 'down')` stands on the mill
  lane, off the main road, and is labelled "Veiled woman" (`npcs.ts:92`). Two townspeople mention "a veiled woman by
  the old mill" (zetwal.ts:2005, 2019). The *plaza* figure is a different NPC, `recruiter_b`, a "Hooded stranger",
  who repeats it after the lamp: "The woman by the mill says you told her to stay away. We always do. We only ever
  listen." (zetwal.ts:358).
- **Her lines** (zetwal.ts:2144-2159): "Hush. The road is loud enough without us." / "Your little sister is very
  quiet, isn't she? Quiet people are precious to us." Then Gianna's choice: **"Stay away from her."** (sets
  `choice.warned_watcher`), answered "We only ever listen. You should try it." Or **"Who are you?"**, answered "No one.
  That is the point of us." The second choice sets nothing.
- **Nobody in the built game says "the Hushed".** There is no match in `quest/src`. `STORY.md` 6.3's "the recruiters
  and the veiled woman speak of 'the Hushed' as their leader" was never built.
- **She is placed with no condition**, so she is on the Cane Road in every chapter, including Chapter 10's return.

Against that, the outline:

- outline:95-96 and 482-484 use `choice.stay_away`. **The flag is `choice.warned_watcher`.**
- outline:103-104 ("the veiled woman on the plaza speak of 'the Hushed'"), 481 ("That's the lady from the plaza") and
  1175-1176 put her **on the plaza**. **She is on the Cane Road.**
- outline:482: *"You told your sister to say 'stay away from her'. She said it."* **Anissa told nobody anything.
  Gianna chose the line herself.** As written, the boss misquotes the player's own choice back at her.
- outline:1095 calls her "the veiled woman of Chapter 1's plaza".
- **Meeting her is optional.** A player who never took the mill lane hears Anissa recognise a woman they never saw.
  The fallback line (outline:484) covers the Almoner but not Anissa's.
- **The reveal has no name to land on.** The boss's name on the battle screen ("The Hushed") is the first time the
  player hears it.
- **After Chapter 9 she is in two places:** taken in the keep's cells or broken before the city, and still standing
  by the mill in Chapter 10.

**What is good here, and should be used:** her Chapter 1 answer "No one. That is the point of us." is the unmasking
line already (outline:491: "It is nobody's. That is the point of a hand with no face"). Quote it back exactly.

**Fix:**

1. **Chapter 1 (one line of built data):** the road watcher's start node sets `story.watcher_met`. Her placement gets
   `if: '!story.hushed_beaten'` (Chapter 10's Cane Road).
2. **Anissa's line** becomes "Gigi. That's the lady by the mill. On the cane road." when `story.watcher_met`, else
   "Gigi. She's the one with the basket." Same earnest weight, no plaza.
3. **The Almoner's line**, three branches:
   - if `choice.warned_watcher`: "Your sister told me to stay away from you. I did. I have been very patient.";
   - else if `story.watcher_met`: "Your sister asked me who I was. I told her: no one. I have been very patient.";
   - else: "Your sister has kept you very close. I have been very patient."
4. **The unmasking line** quotes Chapter 1: "You wanted a face. Here. No one. I told you. That is the point of us."
5. **Seed the name before the court.** The bog chapel's cell kneels "to the Hushed" (Al-3's fight intro), and the purge
   list's head reads *By the Hushed's word*. The Heath's Husher intros use it once. The player then knows the name
   two scenes before the face.
6. **One look.** The Almoner's veiled look reuses the road watcher's sprite and palette (`quiet_crown_f_brown`), so the
   recognition is also a picture. Her unveiled look matches that palette, not a new one.
7. **Change outline:95-96, 103-104, 481-484, 1095, 1175-1184 and `STORY.md` 6.3's Chapter 1 sentence** ("In Chapter
   1 a veiled woman by the mill speaks for the cells and gives no name; the recruiters never name Rael").

Whether to keep the identity at all is section 5's borderline question. The fixes above are needed either way: as
written, even the fallback says "plaza" (outline:1182-1183).

### 3.3 Sebastian's surname contradicts Chapter 1

- Chapter 1's elder (zetwal.ts:404-407): *"Then she took the name Limyè, for the goddess's light, she said. Her
  father's name was good enough for the rest of us." / "Well. Jean-Philippe is a mouthful to shout at a festival."*
- The books name the father: "Marshal Patricio Jean-Philippe" (`books.ts:53`).
- The Chapter 5 outline gives Elodie's reason: she took Limyè "so no one..." (Ch5 outline:297): a name nobody could
  trace.

So Elodie is the only Limyè of her generation, and her siblings are Jean-Philippes. The outline's bill (*SEBASTIAN
LIMYÈ*), Anissa's "Limyè. Gigi, that's our name." (outline:152-156), and the section on his name (outline:1057-1059,
1242) contradict a built line. They would also undo Elodie's reason for the name, because a famous organist named
Limyè points every court at her.

**Fix (a better seed):**

- The bill reads *SEBASTIAN JEAN-PHILIPPE, organist to three courts*. Anissa reads it slowly: "Jean-Philippe. Gigi,
  that's Grandpapa's name." Gianna: "That's Mummy's brother. The one who writes to her about the weather."
- The Regent's "Your uncle plays very loud" (outline:237-238) still works, and is sharper: the Marshal's son plays in
  the Regent's cathedral.
- Check whether Coralie was ever printed as "Limyè" in built data. I found no match in `quest/src`, so only the
  outlines need correcting.

### 3.4 Anissa during the break-in, and in the cells

**The Echo rule.** `QUEST-BUILD-GUIDE.md`:49: *"Her magic is too bright for the Echo. She stays at the Echo Site and
**holds the door open**, which is the in-story reason the Echo lasts."* `STORY.md`:43 says the same: "Anissa never
enters the Echo: she holds the door." The built Chapter 5 says it in her voice at the Archive: "The air shimmers in
front of the table, Gigi. I can hold the door." (seat.ts:605).

The outline puts her in the cathedral's loft, across the close, while Gianna takes the chapter's required Echo in the
keep (outline:303-307, 330-335). It calls this "the owner's rule... kept in spirit" (outline:1203-1205). That is
picking an interpretation where two sources conflict, which `CLAUDE.md` asks to flag rather than settle silently. It
is also the less interesting choice.

**The cells.** Jordyn's condition is "the little one does not come into the keep" (outline:269-270). The outline then
has Sebastian bring Anissa *into* the keep at night, and the constable lock her in a cell, with the Almoner free and
her almswomen in the building (outline:419-424). Gianna, who has spent nine chapters standing between her sister and
veiled people, would not allow it, and nothing on the map says why she does.

**Fix (no change to the story's flow):**

- **Anissa comes through the postern with the party** and holds the door at the archive's filing floor, as she does
  in every Echo. Jordyn's condition becomes the opposite worry, said once in the close: "Then she stays behind you.
  Every step." The organ still covers the noise; that is Sebastian's settled help.
- **The caught scene gains** (outline:399-405): the Almoner says "Where is the little one?" *to her face*, Gianna
  steps in front (a `walk`), and Jordyn's arrest ("Under arrest, Almoner. Not under you.") is what saves the child as
  well as the envoy. Anissa is in the cell because she was arrested with her sister, which needs no explanation.
- **Sebastian** visits the cells with the Regent's leave (keep it) and brings a blanket instead of the child.
- **His touch for Anissa** moves from "You turned every page on the beat" to the stair at dawn: "I am told you held a
  door for an hour. I have never held anything that long but a note."

If the central session prefers the loft, it should not be built without the owner: it changes a rule the guide
gives as the in-story reason for the Echo (section 5).

### 3.5 Levels: plan from the target, because the drift is being fixed at its source

- **The outline plans from "about 22 as played"** (outline:723-731) because Chapters 5 to 8 drifted on the old ambush
  rule. The tree now has the Ch8 review's rule, uncommitted: `config.ts` `AMBUSH_XP = { share: 0.12, sizeOf: 3,
  maxFoes: 4, perLevel: 0.25, min: 0.25, max: 1.5 }`, `engine/battle.ts` `ambushXp`/`battleXp`, and
  `tools/level-curve.ts`'s played line (median, 90th percentile and a wanderer over 200 seeds). With it, the drift
  corrects itself: a party over its band gets less from each ambush. So this chapter should plan from **21** (the
  played start the rule aims for), not 22.
- **From 21 the chapter lands on 23, not 24:**
  - the start, 6,034 XP;
  - the outline's fixed XP, 885 without the books and 1,025 with them;
  - about three ambushes, each about 75 to 90 XP under the new rule (a trio one or two levels over a party of 21 to
    22: 0.12 x about 490 x 1 x 1.25 to 1.5);
  - total about 7,150 to 7,300: **level 23** (7,030), with the boss at 24 fought at about 22.
- **The chapter's band is three levels in 35 minutes, and its XP is sized for two.** The outline admits this
  (outline:742-744). Its answer, re-basing `CHAPTER_LEVELS` 9, only shifts the gap to Chapter 10.
- **The boss pays too little against its predecessors.**
  - Qasim (level 14) pays 200 XP (`battles.ts:523`), about half the 14-to-15 gap (380).
  - The Trial pays 220.
  - The Hushed's 120 (outline:700) is about a quarter of the 23-to-24 gap (517).

**Fix (Claude's call, a balance statement for the milestone note, no pop-up):**

- Plan from 21.
- Raise the fixed XP by about 300 to 400, where the story earns it:
  - the Hushed, 120 → **280** (half a level, Qasim's share);
  - Al-3, 100 → **180** (the safehouse, the chapter's one walk in the wild);
  - the two SIG-ALM halves, 60 → **90** each.
- That is about 1,300 to 1,450 fixed from 21, plus about 250 from ambushes: **24 at the median**, 24 to 25 for a
  wanderer.
- Assert it with the new played line, not the old tool line. Keep `CHAPTER_LEVELS` 9 at 21 to 24 (the plan's band).
- Remove "the encounter rule, tapered" (outline:697) and the taper language. The taper was never built, and the rule
  that replaces it is the one in the tree.

### 3.6 Al-2 is not a required quest as written

The outline says Al-2 is "required by the ground and not by the counter: a player cannot reach the anchor without
passing the chronicle" (outline:780-782), and "no player can miss the Concord bonus" (outline:857-858). But Al-2's
steps are to *take* the chronicle and *read its fly-leaf again after the panel* (outline:847-850). Walking past the
shelf does neither, and nothing gates on `side.crown_chronicle.done`. The plan requires two side quests per chapter.
As written this chapter has one (Al-3) plus the debate.

**Fix (it also makes physical sense):**

- **The panel is behind the shelf.** The present panel's `use` needs `side.crown_chronicle.accepted`: "The shelf is in
  the way. Gianna lifts the chronicle down." That takes the book, accepts the quest and clears the panel in one act.
- **Step 2** (the fly-leaf's second look) is offered right after the record comes out of the panel, with Haru's line.
- **The archive's exit trigger** ("Caught", outline:399) needs `clue.crown_pact`, `anchor.thomas_record` and
  `side.crown_chronicle.done`. Until then it is a line: "Not yet. Thomas's panel. The drawer. The book." This also
  stops a player walking out with half the evidence, which the courtroom tree would then have to cope with.

### 3.7 The dissidents' price is always paid, and the court is counted twice

The scene pays (outline:527-539):

- the Hushed beaten, +1 (the boss rule);
- **and** her fall in open court, +2 "always";
- Jordyn's company, +1 "always";
- the purge list, +1 "always" (the gate guarantees Al-3);
- and Al-3 itself, +3.

That is **8 for every player** before any choice, so "between about 6 and 10 of 8" and "the shortfall is a debt the
Muster collects" (outline:539-542) cannot happen. The Ch8 review's 3.4 found the same pattern in Jwaladesh (floor 7
of 8). Here it matters less, because Aldermoor is not in the betrayal pool, but the Journal's "Yours here: N" would
always read 8 or more, and the Muster's third feud would be over before it starts.

**Fix, one of:**

- **(a) Make it a price.** Keep Al-3's +3 and the boss +1. Drop "the fall in open court, +2" (it is the boss rule
  again) and the published list's "+1 always" (it is Al-3 again). Keep Jordyn's +1. The floor becomes 5. A Break at
  the court (+1), Heath wins and the Hushed broken lift it to 7 or 8. The Muster's mediation then has a real number
  to work with.
- **(b) Say it is paid.** The dissidents are the Crown's own people, and their price is the court: the note says
  "Paid in the Assize" and drops the count.

Recommendation: **(a)**, because the Muster's "Stillwater dissidents against everyone" is the hardest of the three
feuds (guide 5.4) and needs a lever.

### 3.8 Story logic: contradictions inside the chapter and with Chapter 5

1. **The Marshal "signed it".** The Ch9 Echo's council says "And the Marshal signed it under protest of time"
   (outline:361). In the built Chapter 5, Patricio *sealed the binding* of six pages and signed nothing on the
   seventh. His words are a choice, `choice.patricio_protest` = `time` ("Under protest of time.") or `unread` ("Write
   that I did not read it."), seat.ts:651-661. `STORY.md`'s Chapter 5 "Built" note says so, and that Chapter 2's "I
   would remember" depends on it.
   **Fix:** "And the Marshal sealed the binding. Under protest of time." / "...and had it written that he did not read
   it.", branched on `choice.patricio_protest`.
2. **The dock's Echo: who is there.** The roll says "Xaraguá: not present. Not sent for." (outline:460-461). But the
   outline also has "Caona and Benny are the two lines" and the Echo party "stands in the dock as the Marshal's envoy"
   (outline:461-462). If Caona speaks in that room, Xaraguá is present.
   **Fix:** the dock Echo is the court and the roll only. Patricio is not there (Chapter 5's Echo already has him at
   the sealing). The player sees an empty dock with the roll read over it, and "Xaraguá: not sent for" falls on an
   empty bench.
3. **"A quarter to three, by the tower bell."** Thomas says he wrote the true record "in the Throne's gallery"
   (outline:369), which is Eightgate's (Chapter 5). But its last line dates it by "the tower bell" (outline:379),
   which is Kingsmere's (Al-4's tower, "stopped the night it was written", outline:558-559).
   **Fix:** Thomas wrote the margin at Eightgate and copies the true record out fair *here*, tonight, while the
   council sits: "I wrote it once in their gallery. I'm writing it again in their archive. At a quarter to three, by
   that bell." The item's last line then means what Al-4 needs.
4. **"She was never at the recital."** Beat 4 shows the Almoner walking to St. Agatha's with the court, "the Almoner
   last with her basket" (outline:321-323). Beat 6 says "she was never at the recital" (outline:400-401).
   **Fix (and a better tell):** in the court's walk she stops at the west door with her almswomen, turns, and walks
   back towards the keep (an `exit`). The player who watches sees where she went.
5. **The commission proves the Regent.** Jordyn reads "In the Regent's hand" aloud in open court, before the council
   and the city (outline:497-500). A commission in his own handwriting, read into an Assize, is close to proof, and the
   outline's own risk says the chapter must not prove him (outline:1353-1355).
   **Fix:** "Under the Throne's seal. No hand." The seal is the Sealbearers' and anyone's; the Regent: "The Throne's
   seal is on half the paper in this building." It is seen, never proven, as intended. The Journal note says "under
   the Throne's seal, which the Crown disowns".
6. **Why does the court give back the Crown's pact?** The `evidence.*` mirror returns the items "on
   `story.record_read`" (outline:414-416, 1118). Nothing on the map says why the Regent's own court hands its secret
   pact and the coded accounts to a foreign envoy.
   **Fix (Jordyn's rule, shown at dawn):** she brings the bundle to the stair: "The charge was withdrawn. Evidence in
   a withdrawn charge goes back to whoever it was taken from. That is the book." The Regent cannot object without
   breaking his own law. This also moves the return off a flag and into a scene.
7. **"You will hang, Captain."** Then she walks out of Kingsmere with six of the watch (outline:513-515, 545-552).
   **Fix:** the Regent, after a breath: "Not today. The court has been interrupted enough." He lets the city watch him
   let her go, which is his method.
8. **The cathedral before the close.** Sebastian's help depends on Gianna telling him "the postern's hour"
   (outline:298-299), which Jordyn gives in the close. The two are in any order (outline:783-785 is only the arrow's
   order). A player who goes to St. Agatha's first meets an uncle who promises to play at an hour nobody has named.
   **Fix:** the west door's constable ("Rehearsal, madam. Nobody goes in") holds until `story.jordyn_offer`, or
   Sebastian's help line branches ("Tell me the hour when you have one. I'll be here; I'm always rehearsing.") and a
   second talk sets it.
9. **The Regent at home.** His last line in Chapter 5 was "I will be here. I am always here." (seat.ts:898), at
   Eightgate. One line in the hall pays it: Haru, "He said he was always at Eightgate." Edmund: "He says that
   everywhere."
10. **Recent papers under the Old King's years.** The pact is a recent contract with Rael, but the cabinets run "1 to
    60 of the Old King" (outline:345-347), and the mirror files it under 32, a fifty-year-old year. The puzzle works
    only if the room says why. Two lines do it: the door's rule adds "Matters touching a clause are filed with the
    clause", and the honest drawer's slip (23 red) reads "Matters touching the seventh clause: removed to the Lord
    Regent's keeping". The pact sells harbor dues the seventh clause created, so it is filed with the clause.
11. **The trader's count.** "Four nights. You said four. It's been two and a half" (outline:522-523). The chapter
    spans three nights (arrival, the eve, the cells). "Three" or "It's been three and the whole city's awake."
12. **The Chapter 5 aide** (an opportunity). Chapter 5's legate's aide says "Terribly sorry. I will take that" and
    takes Yari's petition (seat.ts:423-432). The Chapter 5 outline gave it as "Edmund's 'terribly sorry' first heard
    from the aide" (Ch5 outline:694). This outline never says who he was. **Make him Edmund:** at the pie shop he
    knows Yari ("Miss Yari. I read your petition. Somebody should."), which also explains why he walks up to the
    envoy's household and not anyone else. It costs one line and makes the aide's placeholder look Edmund's.

### 3.9 Tone: four light lines in nodes with Anissa, and one wrong battle tip

The outline's own rule (outline:1080-1082, 1427-1428) is that no comic line shares a node with an Anissa line. Four do:

- **Gianna's organ line** (outline:157): "I have an uncle who plays for anyone with a big enough organ." It follows
  Anissa reading the bill, in the same node. It is a double meaning in a family game, beside the child, from the
  sister who protects her. **Cut it:** "That's Mummy's brother. He writes to her about the weather."
- **The voyage** (outline:137-141): Samira's "I may enjoy this" and Anissa's line at the rail are one node. Split the
  deck into two looks, or drop Samira's.
- **Edmund** (outline:254-255): "I'm tremendously good at sitting", said about sitting with Anissa. With 3.4's fix the
  line goes anyway.
- **Sebastian in the cells** (outline:424-425): "That is the worst review of my life", with Anissa in the cell. With
  3.4's fix she is there because she was arrested. Keep the line only if it is said before she is brought down, or
  cut it.

**The battle tip is wrong.** Anissa's opening tip says "Plain blows and your light still work" (outline:658-659), but
the Hushed has `resist: ['light']` (outline:649). `ELEMENT_RESIST` is 0.5, and Gianna's damage spells are light
(*Sunthread*, *Dawnlight*, *Falling Star*: `battles.ts:28, 156, 158`); her light spells are skills, which `hushed`
blocks. **Fix:** "She takes your words, Gigi. Plain blows still land. My light still comes. Edmund, hold them."

**Smaller:**

- "She is spoken to by nobody in Kingsmere except the Hushed" (outline:1071-1072) contradicts Edmund's hat,
  Sebastian's "Who hums" and Jordyn at the stair. Say "spoken *about*" or drop it.
- The coded accounts are marked "the Ash Road" (outline:387), and the chronicle on the next shelf names "the Ash
  Road" as the massacre (outline:844). A careful reader may read restitution (Rael is good) two chapters early. It is
  `STORY.md` 6.6's proposal, so keep the name, but give the reviewer prompt a human read of the archive scene against
  the locked rule, as for Jordyn's lines.

### 3.10 Shown, not told: one thing the chapter only tells

The chapter's horror, families who "come back without their voices" (outline:261-262), is said by Jordyn and never
seen. It is the thing the purge list exists to stop, and the one fact about the Hushed the player should see before
the court.

**Fix:**

- One of Al-3's three doors is **too late**: a woman who opens it and cannot say her name. Haru reads it off the list;
  she nods. One beat, no line from her, no Anissa in the node.
- Use the tea shop with the shut door, which beat 1 already shows shutting as the Almoner passes.
- The other two are warned in time. This is the chapter's argument made visible.

Everything else in front of the party is staged with cues. The off-screen council behind an ajar door
(outline:359-362) is the owner's rule for off-screen events used correctly.

### 3.11 "Data only" claims that are not data, and the real budget

These carry over from the Ch8 review's 3.8, which this outline did not have:

1. **The escort that follows** (outline:149-150): walkers move an NPC only between placements
   (`engine/walkers.ts`), and the only follower is Anissa (`engine/stage.ts:13-14`, `STAGE_FOLLOWER`). Make it a
   stage scene: the two walk ahead to the Moor Gate as stage actors and are placed there.
2. **The rain layer off on a flag** (outline:131-133, 1122): `above` is a static tile layer (`engine/tiledMap.ts:69`)
   with no condition. "Kirinoura's fog layer by flag" is Chapter 7's, not built in this tree. Either cost it (about
   0.1: an `above` variant read by a flag) or keep it static and mark the last dawn with placed objects (puddles, the
   trader's dry sail) and the music.
3. **Cabinet dials and seals as looks by value** (outline:578-579, 604-605): map `if` text supports only set, not set
   and `|` (`engine/conditions.ts:66-82`). Dialogue conditions do support `eq`, so make each cabinet a dialogue whose
   choices set the year and the seal (`set`) and whose pull branches on `eq`. Drop the per-value looks, or use
   boolean flags per seal colour.
4. **Conditional encounter weight** ("weight 1 after `choice.hushed_broken`", outline:697, 504) and **a 24-step grace
   on the bog** (outline:748): `EncounterGroup.weight` is a number and the grace is global (Ch8 review 3.8.2). The
   party never walks the bog after the court anyway, so the effect is invisible. Drop both.
5. **Edmund on stage.** He breaks the archive's seal, stands in the hall, the cells, the dock and on the deck, but
   followers are hard-coded (the Ch6, Ch7 and Ch8 reviews' cost). Either borrow him as a stage actor per scene (about
   0.25) or place him per scene by flags. The outline does not cost it.
6. **The Aldermoor shore** for `jwaladesh_aldermoor`: `VoyageDef.shore` is `'zetwal' | 'xaragua' | 'ardencia'`
   (`engine/voyage.ts:23`). This is Chapter 8's cost, but this chapter's start depends on it.
7. **The recital's music across three maps** is data: `audioPlan.ts` has `overrides` by maps and an `if` condition.
   The outline's 0.05 is right.
8. **Calm and Comfort** (0.3) bring a new mechanic to the chapter's boss. `COMBAT.md` 8 says Calm is lowered by the
   Hushers' *Frighten*; if it is built, it must be taught in a Heath ambush or the bog chapel first (an Anissa tip),
   or the player meets it for the first time in the hardest fight of the chapter. With 3.1's re-tune, the `seize`
   fallback plays well.

**The budget.** The outline's 1.25 engine days does not include:

- Edmund on stage (0.25);
- the rain switch (0.1);
- the cabinets as dialogue (0.05);
- the shore (Chapter 8's);
- teaching Calm, if it is built.

The content is also heavy for two and a half days: five maps (one of them a 40 x 30 keep with two Echo zones, an
archive, a courtroom, cells and a close), about 370 lines, 14 books, two puzzle files and a 30-node court. Realistic:
**about 3 to 3.5 builder-days**. This is the chapter the Nov 8 decision date is about, so say so in the milestone
note.

**Cut from the start, not on day 2:**

- **Calm and Comfort.** Use `seize` with Hush the Light's tell; build Calm with Chapter 10's Muster or Chapter 12's
  One Hand, where the Regent "aims at Anissa each turn".
- **The Long Watch and Stillwater's Patience** (their fallbacks).
- **The law-seal brooch's special.**
- **The escort's walk** (placed at the gate).
- **The Rolls House** down to the five books outline:1448-1449 names.
- **The rain switch** (static).

### 3.12 Soft-locks and Game Over

- **Losing to the Hushed.** Built Game Over (`COMBAT.md` 12) returns the party *free on the map where the fight
  began*: here, the dock, mid-trial. The outline's "the way back in is the courtroom's doors... restarts at 'Enough
  noise'" (outline:669-671) needs three pieces of data:
  - a step trigger in the dock (or Jordyn's talk) that replays "Enough noise" and starts the fight;
  - the courtroom's doors held by the watch until `story.hushed_beaten` ("The court will wait. Mend, envoy.") so the
    party cannot walk to the Mere Stair mid-trial;
  - a way to mend without a shop. The bag and the Grudge (+10% a try, up to 30%) are enough at x7 / MAG 1.25. Check
    a party of 20 in the re-run so that no player is trapped in a court they cannot win and cannot leave.
- **Caught before the evidence.** 3.6's exit condition covers it.
- **The cells.** Say what moves the night on: a step on the cell's bench ("Sleep") sets the dawn variant. A save in
  the cell must reload into a cell that has that trigger.
- **The Heath and the chapel.** "Game Over returns to the road" (outline:787-788, 1442) is not the built rule; the
  built rule is "where the fight began, or one step back". Both are on or beside the road, so nothing breaks; just
  word it as built.
- **The debate.** Provoke does not resolve a debate (`engine/debate.ts:82-84`: only won or mediated), so the required
  debate cannot be closed off. The outline is right.

### 3.13 Pacing and length

About 810 steps, 24 transitions and 370 lines in 33 to 36 minutes is in line with Chapters 6 to 8. The one pacing
risk is the stretch from the hall to the eve: four maps (the cross, the keep, the close, the cathedral) and the Heath
twice for Al-3, in any order. The arrow handles it. The dusk in the close as a global condition
(`story.jordyn_line` and not `story.recital_begun`, outline:251-252) makes the close dusky through the whole of the
next day's quests. **Fix:** make the bell the scene's own cue (the bell rings as the party steps into the close; a
line, then Jordyn), and keep the only global light changes for the eve and the last dawn.

---

## 4. Claims checked

| Outline claim | Where | Finding |
|---|---|---|
| `atkScale` scales ATK only; no MAG scale | 48, 57-59 | **True** (`engine/battle.ts:539-548`). |
| Without `magScale` the Hushed "cannot hurt a party of 21 to 24 at all", "0 down" | 57-59, 675 | **Overstated**: 0.10 to 0.60 down at 21 to 23 with the counter fixed (3.1). |
| x7 / MAG x2: a fighter down in one fight in five at the floor, none at 24 | 677, 685-691 | **False**: 4.00 down at 21, 1.33 at 24, counted party-wide (3.1). |
| Edmund benched wins faster because the sim has no `hushed` | 630-632, 1333-1337 | Reproduced; whether the real status fixes it depends on whether `hushed` blocks moves (3.1). |
| `choice.stay_away`; the veiled woman on the plaza; the recruiters speak of "the Hushed" | 95-96, 103-104, 1175-1176 | **False on all three**: `choice.warned_watcher`, the Cane Road by the mill, "Hushed" never said (3.2). |
| Sebastian Limyè, as Coralie Limyè | 152-156, 1057-1059 | **Contradicts Chapter 1** (zetwal.ts:406-407); no "Coralie Limyè" in built data (3.3). |
| Anissa's hints reach Gianna in the Echo from the loft | 306-307 | The guide's rule needs her at the Echo site (3.4). |
| Played start "about 22" | 723-731 | Overtaken by `AMBUSH_XP` in the tree; plan from 21 (3.5). |
| Al-2 required by the ground; Concord bonus unmissable | 780-782, 857-858 | **False** as written; gate the panel (3.6). |
| Fear "between 6 and 10 of 8" | 539 | **Floor is 8** (3.7). |
| Debate's Provoke does not resolve it | 790 | **True** (`engine/debate.ts:82-84`). |
| Only `anchor.*` flags carry back from the Echo | 46 | Only `echo.*` flags are cleared (`engine/game.ts:419-423`); `clue.*` and `choice.*` set in an Echo scene survive, which the outline's `clue.ratification` and `choice.patricio_thomas` need. Fine, but the premise is misstated. |
| Recital music keyed by flag across maps | 1123 | **Data**: `audioPlan.ts` overrides by maps with `if`. |
| Rain `above` layer off by flag; escort walkers that follow; cabinet looks by value; conditional weight; per-zone grace | 131-133, 149-150, 578, 697, 748 | **Not data** (3.11). |
| `protects` and `endsWithBoss` exist | 621-623 | **True**; use `protects` on the Hushers (3.1). |
| The Hushed resists light; Anissa says "your light still works" | 649, 659 | **Contradiction** (3.9). |
| The Marshal "signed it under protest of time" | 361 | **Contradicts the built Chapter 5** (seat.ts:651-661) (3.8.1). |
| Chapter 5: the Regent looked at Anissa and said nothing | 98-99, 231 | Consistent (seat.ts:256 and "He does not look at Anissa this time", 861). |
| Thomas's "Someone will read it one day" | 35-36, 374-375 | **True** (seat.ts:716): a good payoff. |
| The Regent's "revisited in ten years" and the pact's "ten years" of dues | 235-239, 384-385 | Consistent with seat.ts:885: good. |

---

## 5. Owner questions (owner rule, Oct 20: only what drastically changes the story's flow)

**None required.** Nothing above changes a beat's order, an outcome, who joins or what Gianna believes. Two items are
on the edge and are listed so the central session can decide whether to ask. The build goes ahead on the
recommendation either way.

1. **Is the Regent's almoner (the Hushed) the veiled woman Gianna met on the Cane Road in Chapter 1?**
   - *Why it touches the owner:* `STORY.md` 6.3 is owner-settled, and it says the Chapter 1 veiled woman *speaks of*
     "the Hushed" as her leader, which reads as someone else. The built Chapter 1 never has her name anyone, so
     nothing the player saw contradicts the reveal; only the design sentence does.
   - **Recommended answer: yes**, with 3.2's fixes (the mill, the right flag, Gianna's own words, "No one" quoted
     back). It gives the faceless head a face the player has already met, which is what "unmasked" should mean in a
     game that shows. The alternative ("No: she is a recruiter; the Hushed is a stranger") changes only two lines,
     Anissa's and the Almoner's.
2. **Only if the central session keeps Anissa in the organ loft during the archive's Echo** (outline's version):
   - *Why it would touch the owner:* the guide gives Anissa holding the Echo's door as the in-story reason the Echo
     lasts.
   - **Recommended answer: no, she comes through the postern and holds the door** (3.4). That follows the existing
     rule, so it needs no question, and the caught scene is stronger for it.

The rest of the outline's Claude's calls stand. Two I would add, both recorded and not asked:

- Sebastian is a Jean-Philippe (3.3): a continuity fix, not a choice.
- The Chapter 5 aide was Edmund (3.8.12).

---

## 6. Recommended changes (build order)

1. **The boss (3.1, day 1, before the courtroom is wired):**
   - `magScale` 1.25 at `hpScale` 7, not 2;
   - `protects: 'the_hushed'` on her Hushers;
   - write in the spec whether `hushed` blocks moves (yes);
   - fix the down counter (`b.party`) in the sim that goes into `tests/`;
   - re-run with tier gear, the fair and the plain bot, Edmund active and benched, and a party at 20 with the Grudge;
   - correct outline:57-59, 673-691, 1328-1331.
2. **Chapter 1's veiled woman (3.2):**
   - `story.watcher_met` on her talk;
   - her placement `if: '!story.hushed_beaten'`;
   - Anissa's and the Almoner's lines branched three ways, "the lady by the mill";
   - "No one... That is the point of us" quoted at the unmasking;
   - "the Hushed" seeded at the bog chapel and on the purge list;
   - the Almoner's veiled look is the road watcher's;
   - correct the outline's six places and `STORY.md` 6.3's Chapter 1 sentence.
3. **Sebastian Jean-Philippe (3.3):** the bill and Anissa's line ("that's Grandpapa's name"); outline:152-156,
   1057-1059, 1242.
4. **Anissa (3.4):** through the postern with the party, at the archive's Echo; caught and arrested with her sister;
   Sebastian visits; his page-turning line moves to the stair.
5. **Levels (3.5):** plan from 21; the Hushed 280, Al-3 180, SIG-ALM 90 + 90; assert with the played line;
   `CHAPTER_LEVELS` 9 unchanged; the taper language out.
6. **Al-2 required (3.6):** the panel behind the shelf; the exit trigger needs the pact, the anchor and Al-2.
7. **The price (3.7):** option (a), a floor of 5.
8. **Story logic (3.8):**
   - "sealed the binding", branched on `choice.patricio_protest`;
   - the dock Echo without Caona;
   - the true record copied in Kingsmere at a quarter to three;
   - the Almoner turns back at the west door;
   - the commission under the seal, no hand;
   - Jordyn returns the evidence by the book;
   - the Regent's "Not today";
   - the cathedral after the close;
   - Haru's "always here";
   - the filing rule's two lines;
   - "three nights";
   - Edmund was the Chapter 5 aide.
9. **Tone (3.9):** cut the organ line; split the voyage node; Edmund's sitting line goes with 3.4; Sebastian's review
   line before Anissa arrives or cut; the battle tip; "spoken about"; a human read of the archive scene.
10. **Shown (3.10):** one door on the purge list is too late.
11. **Engine claims and budget (3.11):**
    - the escort as stage actors;
    - the rain static or costed;
    - the cabinets as dialogue with `eq`;
    - drop the conditional weight and grace;
    - cost Edmund on stage;
    - Calm, Comfort, the Long Watch, Patience, the brooch's special and four books cut from the start;
    - re-plan at about 3 to 3.5 days and say so in the Nov 8 milestone note.
12. **Game Over and saves (3.12):** the dock's restart trigger, the held doors, the cell's sleep trigger, the
    built-rule wording.
13. **Pacing (3.13):** the close's bell as a scene cue, not a global dusk.
