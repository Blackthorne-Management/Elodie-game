# Second review: Chapter 8 outline, The Dying Flame (Oct 22)

*Reviewer: an independent helper, reading only. Subject: `docs/quest/reviews/2026-10-22-chapter8-outline.md`
("outline:N" below means that file's line N). I checked it against:*

- *the built engine on branch `chapter3` (worktree `wt-ch3/quest`, at 656cfa1, Chapter 5 in progress), and the
  Chapter 6 snapshot the outline simulated against (`scratchpad/ch6sim/snap/quest`, commit 889ed60);*
- *the Chapter 7 outline (`2026-10-21-chapter7-outline.md`, "Ch7 outline") and its review
  (`2026-10-22-chapter7-outline-review.md`, "Ch7 review"), which the outline says was still in progress when it was
  written (outline:24-25);*
- *the Chapter 6 outline review ("Ch6 review");*
- *`CLAUDE.md`, `FAMILY.md`, `STORY.md`, `PLAN-ALL-CHAPTERS.md`, `QUEST-BUILD-GUIDE.md`, `PUZZLES.md`,
  `SIDE-QUESTS.md`, `CAPITALS.md`.*

*What I ran (all Story difficulty, the only one built, `config.ts:263`; 30 seeds per row):*

- *the outline's three scripts, unchanged (`scratchpad/ch8sim/dhanraj-sim.ts`, `dhanraj-sim2.ts`, `duel-sim.ts`);*
- *my variants in `scratchpad/ch8rev/`: `rev-sim.ts` to `rev-sim4.ts` (Dhanraj as specified, a party-wide down
  counter, a plain bot, enforcers that `protect`, Price Spike with no damage), `pf-fixed.ts` and `gv-fixed.ts` (the
  Chapter 7 and Chapter 6 boss sims with the counter fixed), `realm8.mts` (the realm map around Agnipur).*

*I changed no other file and committed nothing.*

---

## 1. Verdict

**Build it after the fixes in section 6.** The chapter is the strongest of the three road outlines on story:

- the trouble is shown before it is said (the cart turned back at the store, the price-board "40, was 4", the
  curtain with polished rings);
- the Crown's hand is a contract, not a speech (oil for the keeping of the Harbor Chain), and the ledger is proof
  rather than a confession;
- Vikram's breathlessness is a character, not a gag, and his defiance (tearing the curtain) costs him in front of
  his mother;
- Aiyana is placed exactly where `FAMILY.md` settles her (the flame's engineer who opens the way), with the key, the
  brackets and the disc, and she never solves the puzzle for the player;
- J-2's relay is run for real at the end, so a required side quest pays off in the main story.

**Seven problems would ship broken, contradictory, or with a wrong number if built as written:**

1. **The sim's "0 down" is a counting bug.** The down counter only sees fighters still active after the blow, and
   a fallen fighter is swapped out at once. Recounted, Dhanraj as simulated puts someone down in about half the
   seeds, and Dhanraj as *specified* (with the phase-2 entrants the sim left out) puts about two fighters down in
   every seed. The same bug is in the Chapter 6 and 7 sims (3.1).
2. **The buyer's mark still points at a house** ("Agnivansh's line is one of the four"; "the closed hand is beside
   one of these"), which the Ch7 review asked to remove because the betrayer is chosen at the Muster (3.2).
3. **The Suzumori crane is left on Agnipur's altar, and is still carried afterwards.** It is Se-5's token for the
   chamberlain's chair (3.3).
4. **Jwaladesh's price cannot be the least paid.** The floor is 7 of 8, not 4, so the Agnivansh betrayer variant
   (Prakash) and Vikram's second defiance almost never play, and the token is given whatever is paid (3.4).
5. **Aiyana's lines lean on the Rael secret twice, and the outline contradicts itself** ("no Rael clue in this
   chapter", then "her one clue-level line") (3.5).
6. **The level plan rests on a taper that is not built and that the Ch7 review asked to replace** (3.6). I give a
   concrete realm-wide rule and how to measure it.
7. **Several "data only" claims are not data in the built engine:** the mirrors' value conditions, conditional
   encounter weights, a per-zone grace, Gianna's lamp look, Vikram as a follower, the voyage shore. The engine
   budget is about 2.25 builder-days, not 1.5 (3.8).

**Owner questions:** none required. The named near-miss (Patricio lights Arjun's lamp) is not a change to the story's
flow, and a small staging change removes what is uncomfortable about it (3.7).

---

## 2. What I agree with

- **The start and the hand-on.** `?chapter=8` on Agnipur's harbor quay under the chain (outline:53-58) fits the Ch7
  outline's sea voyage (Ch7 outline:911) and puts the chapter's picture (a dead lamp on a sacred chain) first. The hand-on
  to Chapter 9 (outline:1031-1073) is right: the ledger's Kingsmere purchasing office is a door, not an answer; Jordyn
  is named by family, as `FAMILY.md` places her in the Regent's guard; Sebastian is left cold for Chapter 9, which is
  correct because nobody in Agnipur has reason to know him. It also fits `STORY.md`'s Chapter 9 lesson, "the Crown
  always meant to keep the harbor", without spending it.
- **The Harbor Chain as the sacred thing** (outline:200-203, 952-955). It gives the Chapter 5 envoy's line an object,
  and the object is the Echo's. The chain lamp is also the source of the runners' fire for the wick (outline:642-644),
  so the chain *is* sacred to the city and not just a war relic. And it seeds the War of the Harbor: if Agnivansh is
  the house the Crown buys, it is the house that was always being asked for a harbor. Keep it. One line in the Court
  should say why the chain is holy (the fire for the wick came from its lamp for fifty years); at present only a
  reader of *The Relay* learns it before beat 7.
- **The duel as a fight Gianna can lose without punishment, with the same scene after** (outline:214-223). It is the
  design's beat. (It is also already built; see 3.9.)
- **Vikram joins at the flame, before the boss** (outline:298-312, 960-962). This follows the Ch6 and Ch7 precedent the
  reviews accepted, and the defiance is the act of tearing the curtain. It is recorded as a Claude's call.
- **Meera is clean; the senior Keeper is the betrayer's seed** (outline:1000-1001), in parallel with Hrafn and Mibu, and
  conditional on the price (outline:914). That keeps the betrayer open until the Muster as long as 3.2 is fixed.
- **J-2 and J-3 as the required pair** (outline:627-637). J-3 carries the seventh thumbprint, and J-2 is useful by the
  ground (the sea-wall lane) as well as by the counter.
- **No Echo battle; the charge is staged** (outline:448-452). The `fx: 'shake'` the cannon needs exists on dialogue lines
  (`engine/dialogue.ts:27`, `scenes/FieldScene.ts:2155`), so that part is data. (Outline:893 hedges on whether it was built.)
- **The required gate** (outline:595-621) is worded by the city, not by a companion, and every block in it has a way
  out. The duel, the debate (a lost join counts: `debate.ts:149` sets `joined`), the relay's gust strips and
  Dhanraj's trigger all restart.
- **The crane refused at the step and accepted at the altar** is the feud shown in one object (but see 3.3).
- **The curve values and the tool line** (5,150 → 5,835 to 5,955, level 20) check out, apart from two small rounding
  slips (section 4).

---

## 3. Disagreements and risks, most serious first

### 3.1 Dhanraj's danger: the "0 down" is a counter bug, and the fight that was simulated is not the fight that is specified

**The counter.** Every scratch sim from Chapter 6 on counts a fall like this
(`ch8sim/dhanraj-sim.ts:182`; the same line is in `ch6sim/grimvald-sim.ts:126`, `ch7sim/paperfox-sim.ts:168`,
`ch7rev/amb-sim.ts:172` and `ch7rev/rev-sim.ts:172`):

```ts
downs += evs.filter((e) => e.kind === 'down' && b.fighters.some((f) => f.key === e.who)).length;
```

`b.fighters` is the *active* party (snapshot `engine/battle.ts:721-723`). When a fighter falls, the engine swaps the
next one from the bench in during the same blow (`battle.ts:1125-1131`, `swapIn` sets `out.active = false`). So once
the party has a bench, which it has had since Chapter 6, a fall is never counted. I changed only that line
(`b.party` instead of `b.fighters`):

| Dhanraj x6 / x1.5 (the outline's chosen row), fair bot | Party 19 | Party 20 | Party 21 |
|---|---|---|---|
| Outline's table (outline:510) | 41 actions, 0 down | 39, 0 | 37, 0 |
| **The same fight, counted party-wide** | **41, 0.70 down, someone down in 16 of 30** | **39, 0.70, 18 of 30** | **37, 0.60, 15 of 30** |

For the earlier chapters the fix changes little: the Paper Fox goes from 0 to 0.00-0.17 downs, and Grimvald from 0 to
0.00-0.10. Their "nobody ever goes down" findings stand. Dhanraj is the first boss where the bug hides real
danger.

**The fight that was simulated is not the one specified.** The outline specifies phase 2 with
`enter: ['oil_enforcer', 'oil_enforcer']` (outline:495-496), and explains the length by "the enforcers must be cut
down twice" (outline:517-518). The sim's phase has no `enter` (`dhanraj-sim.ts`, `dhanrajBattle`): only two
enforcers ever appear. With the entrants as written (`ch8rev/rev-sim.ts`):

| As specified (x6 / x1.5, two more enforcers at 50%), counted party-wide | Party 19 | Party 20 | Party 21 |
|---|---|---|---|
| Fair bot (the outline's: enforcers first, Guards on tells) | 30/30, 54 actions, **2.3 down**, lowest HP 8% | 30/30, 51, 2.1, 8% | 30/30, 47, 1.4, 13% |
| **Plain bot** (hits the boss, never Guards) | 30/30, **19 actions**, 2.1 down | 30/30, 19, 2.0 | 30/30, 18, 1.9 |

Three things follow.

1. **The enforcers are optional.** `endsWithBoss` ends the fight when Dhanraj withdraws, so a player who ignores
   the guards wins in under half the actions of one who clears them. This is the Ch7 review's decoy finding (Ch7
   review 3.6) again. The built fix is `protects: 'seth_dhanraj'` on the enforcers (snapshot `battle.ts:1297`,
   `INTERCEPT_CHANCE` 0.75). With it, the plain bot needs 37 to 42 actions and loses 1 or 2 seeds at 19 to 20
   (`rev-sim3.ts`), so cutting down the guards becomes the right play.
2. **The fight's danger lives in the stand-in, not in the design.** The sim's Price Spike is a 150-power area blow
   every 2 turns. The real Price Spike (outline:497-499) has `power 0` and only delays items, and the bot never uses
   items. With Price Spike doing no damage, the specified fight drops to 0.23 to 0.43 downs per fight (`rev-sim4.ts`).
   So "the honest fight is shorter and sharper than the sim's" (outline:519-521) has it backwards:
   - the real Oil Wall is *stronger* than the stand-in `gilded`: the same half damage on everything, plus nothing
     from fire;
   - the real phase 2 is *softer*: no area blow;
   - the real Burning on Dhanraj (next point) is far stronger than anything simulated.
3. **Burning on a boss "for the rest of the fight" is a 6% max-HP tick** (outline:500-503, 884: `regen: -0.06`).
   On Dhanraj's ~1,350 HP after Story's 0.8, that is about 80 HP per boss turn with no end. Over phase 2 alone that
   is roughly half the fight's damage. Burning on bosses needs a cap: a fixed 3-turn duration re-applied by each
   fire hit, or a boss tick of 2%.

**Caveat (it makes the real fights easier than all of these numbers).** Every sim loads the Chapter 4 start save
(`starts['4']`). That save has no `equip.*` flags, so each fighter wears their *starting* gear at level 19 to 21
(`engine/rpg.ts:347-351`; Vikram and Haru in a steel saber and cotton tunic). A real party at 20 wears tier-12 to
tier-20 gear (about +13 to +20 to the main stat).

**Fix.**

- Fix the counter in the sim the build moves into `tests/` (outline:1167-1168).
- Keep the phase-2 entrants and give the enforcers `protects`.
- Make Price Spike *both* a moderate area blow (about 120) *and* the item delay. That keeps the tell meaningful and
  the delay a garnish. If `itemDelay` is cut, the blow stays.
- Cap Burning on bosses.
- Re-run on day 1 at x5 / x1.5 with tier-appropriate gear in the start save, with both bots. **Aim for:** at the floor
  (19), about one fighter down per fight, at least 28 of 30 won with the fair bot, and the plain bot no faster than
  the fair one. My closest rows: x5 / x1.5 with protecting entrants gives 44 to 49 actions and about 2 down on starting
  gear; with Price Spike at no damage, 0.5 down. Somewhere between those is the right fight. At about 45 actions it is
  long next to Grimvald (29) and the Fox (26), so x5 is a ceiling, not a floor.

### 3.2 The buyer's mark still identifies a house

- outline:70-71: "`clue.buyers_mark` (one of four houses has a closed hand beside its name: Agnivansh's line is one
  of the four)".
- outline:372-373: "`clue.buyers_mark`'s closed hand is beside one of these".
- outline:1065-1066: "one of the four has a closed hand beside its name".

The Ch7 review (3.2) found that this lets the player name the buyer by elimination in Chapter 7. The betrayer is "the
house whose price the player has paid least fully" at the Muster (`QUEST-BUILD-GUIDE.md:251`), and "on a replay the
buyer can be forced to a different house" (`:254`). `CLAUDE.md`'s brief for this review says the same: no reveal
before the Muster.

**Fix:** follow whichever form the central session takes from the Ch7 review: either prices only with no names, or the
mark at the list's foot ("whichever comes cheapest"). Rewrite the three lines to match, for example the Journal note:
"A house whose price is least paid is the one the Crown can still buy", with no reference to *beside which name*.

### 3.3 The Suzumori crane is left on the altar and still carried

- Beat 8 (outline:350-353): Meera "takes the crane from the altar's lowest step and puts it on the altar".
- The price then counts "the Ironvow token and the Suzumori crane (both carried)" (outline:365-366).
- The party leaves "with... the Ironvow, Suzumori and Agnivansh tokens" (outline:1050).

The crane is `item.token_suzumori` (outline:66), Se-5's token for the chamberlain's chair (Ch7 outline:330). If it
stays on Agnipur's altar, Kuroshi has no token at the Claim. **Fix:** Meera sets it on the altar for the night of the
flame and gives it back at dawn with the line ("Take it to your chair. Tell Kaede it sat on our altar for one night.
That is not an apology. It is a beginning.").

### 3.4 Jwaladesh's price floor is 7 of 8, not 4

The scene pays (outline:358-368):

| Item | Wealth |
|---|---|
| the store, always | +3 |
| the two tokens, always | +1 |
| J-2, required | +1 |
| J-3, required | +2 |
| the strongbox, if given | +4 |

The mirror job pays Influence, not Wealth (outline:742). Petition: Influence. So **every player has 7 of 8** and a
giver has 11. The outline's "between about 4 and 11" (outline:369) is wrong.

**Consequences:**

- Jwaladesh is at least 87.5% paid on every save. Kuroshi is in the same place (Ch7 review 3.10: its floor is about
  7 to 8). "Least fully, ties to Dorini" (`QUEST-BUILD-GUIDE.md:251`) then lands on Al-Doria or Skarragol almost
  always. So Steward Prakash (outline:914) and Vikram's second defiance (`STORY.md` open question 9) will rarely play,
  and the exposed route's "at least 60 percent paid" is trivially met for Agnivansh.
- The Ch7 review asked the central session to set the four houses' price ranges side by side *before* Chapter 8 was
  outlined. This outline should not add a fourth range without that table.

**Fix.**

- Make the store's +3 a choice with a cost. For example, Dhanraj spared signs the store to the temple (+3), while
  Dhanraj broken leaves the jars to the city (+1, the rest "walked off up the hill").
- Or drop the tokens' always-+1.

Then the floor is about 4 to 5 and the strongbox matters. Record the four ranges in one table in `COMBAT.md` or the
guide.

**The token** is given regardless (outline:374-376). `SIDE-QUESTS.md:403` says "given when its price is paid in full".
This is the same conflict as Ch6 review 3.6 and Ch7 review 3.10. Follow the one decision the central session records.

### 3.5 Aiyana and the locked rule: two leaning lines and a self-contradiction

The outline sets its own rule well. "This chapter gives no new Rael clue... and must not invent one: Aiyana... says
only what she measures" (outline:82-84). Three places break it.

1. **"You have the Locket; then you have been to Cenizal, and I am not going to talk about Cenizal on a roof"**
   (outline:164-165). This is the shape the Ch7 review cut from Kayla ("I will not say his name in a library", Ch7
   review 3.4). Refusing to talk about Cenizal in the open implies there is a secret worth keeping. Tying the Locket
   to Cenizal also tells the player that the family knows what the Locket means.
   - **Fix:** "Kayla wrote. Three lines, which for Kayla is a lot. Here is what I will talk about: ..."
2. **"He used to hold the rod for me when we were small. Never said a word. Just held it level"** (outline:848-850),
   called "her one clue-level line".
   - It contradicts outline:82-84.
   - It invents a shared childhood for Rael (Benny's heir in Cenizal) and Rahel's daughter by another man, which no
     settled document gives. This is the Ch7 review's Alcázar-backstory problem.
   - "Held it level" reads as *steady, honest*, which leans one way.
   - **Fix:** cut it. Her one touch with the family is Azzy ("don't hold things"), which is enough.
3. **The carter: "Somebody is feeding the realm, and he isn't doing it for a goddess"** (outline:684-685). "He" and
   "feeding" point at a man behind the thumbprints. ("Feeds" is the word the outline's own Aiyana test bans as a Rael
   tell, outline:851.)
   - **Fix:** "Somebody is feeding the realm. Not for a goddess." Or give the line no subject.

Also check **Azzy's "Or what you are"** (outline:858-859). It reads as "they are protecting *you*", which is close to
the Elodie/Rael secret that Coralie keeps ("That is your mother's to tell", `FAMILY.md:33`). Keep it only if the
central session reads it as safely two-way. My vote is to end on Gianna's "Then they know what he is", with Azzy
silent (shown: he looks at the wrench).

The keyword test (outline:851) would catch none of these lines. Ask the reviewer prompt for a human read of every
Aiyana, carter and Azzy line, as the Ch7 review asked for Kayla.

### 3.6 Levels: the played line, and the realm-wide fix

**The outline is right that Chapter 8 cannot close the played line alone** (outline:564-582). But it builds on a taper
(`ENCOUNTER_XP_TAPER` 0.25 from 15, outline:46-47, 895) that is **not in the code**: no such name in
`wt-ch3/quest/src`. The Ch7 review (3.5 (c)) also asked for that taper to be *replaced* by one rule relative to the
party's level: "a third proposal in two days for the same dial... One decision, recorded once in `COMBAT.md` 6."

The root cause is the built ambush rule:

- `rewards.xp = ENCOUNTER_XP_PER_LEVEL x group level x foes` (`data/battles.ts:760`, `config.ts:295`: 10);
- a fight about every 51 wild steps (`config.ts:47-48`: 0.03 after 18 grace steps; `game.ts:263`).

At level 20 one trio pays **600 XP**, more than the whole 20-to-21 gap (475). And `tools/level-curve.ts:6-7` does not
count ambushes at all ("the route walks past them"), so no test sees the drift.

**The rule I recommend** (one place: `rewards` for encounter groups in `battleDef`, `data/battles.ts:742-766`):

```
gap(P)    = xpForLevel(P + 1) - xpForLevel(P)               // P = the party's level
size      = min(foes, 4) / 3
relative  = clamp(1 + 0.25 x (groupLevel - P), 0.25, 1.5)
ambushXp  = round(AMBUSH_XP_SHARE x gap(P) x size x relative) // AMBUSH_XP_SHARE = 0.12 in config.ts
```

Gold stays as built. The rule applies from party level 12, so Chapters 1 to 3 are untouched. Chapters 4 and 5 move,
which is intended: the Ch6 review traced the surplus to them.

| Case | Built rule | Taper 0.25 | Recommended |
|---|---|---|---|
| Party 15, trio at 15 | 450 | 450 (taper starts at 15) | 48 |
| Party 20, trio at 20 (the flats) | 600 | 150 | 57 |
| Party 21, trio at 20 | 600 | 150 | 44 |
| Party 23 (drifted), pair at 21 | 420 | 105 | 21 |

What it does:

- About three ambushes on a chapter's route then add about 0.3 of a level.
- A player who wanders twice as far gets about 0.6.
- A party already over its tier gets less from each fight. The `relative` term is the self-correction a band table
  lacks.
- Chapter 8's own fixed 685 to 805 XP then lands a party that arrives at 19 to 20 on 20 to 21.

**How to measure it** (one tool change and one test, on day 1, before any chapter's dials):

1. **Count the wild steps.** `tools/level-curve.ts` gets a `--played` mode. While replaying the route, it records
   the wild-zone steps walked in each chapter (the sim already counts `wildSteps` in `rollEncounter`,
   `game.ts:258-263`), with each zone's table.
2. **Replay the ambush process.** For seeds 1 to 200, it replays the encounter process over those steps (grace 18,
   chance 0.03, `pickGroup` by weight), pays each ambush by the rule at the running party level (won, no battle
   needed), and carries the surplus from chapter to chapter.
3. **Two players.** It reports the median and 90th-percentile level at each chapter's mark for two profiles:
   - the route as walked;
   - a "wanderer", the route plus 150 extra wild steps per chapter (exploring for books and chests).
4. **The assertion.** `tests/levelCurve.test.ts` asserts that, for every chapter with a route, the wanderer's 90th
   percentile is at most `to + slackOver` (`config.ts:75`) and the route's median is at most `to`.

Cross-check one seed in the browser with the smoke test's `?seed=` (commit 5373a63).

**Owner.** This is a balance change, so it is a statement in the next milestone note, not a pop-up (the reading the
Ch6 and Ch7 reviews used).

**Fix in this outline:**

- Replace "the taper at 0.25 is taken as adopted" (outline:46-47, 895, 995) with the rule above, or with whatever
  single rule the central session records.
- Plan the boss, the duel and the flats on a start of 19 to 20 (tool) and 20 to 21 (played, measured).
- Correct the small slips in section 4.

### 3.7 The owner near-miss: Patricio lights Arjun's lamp

**Not drastic.** It changes no beat, order or outcome, so by the owner's rule (Oct 20) it is a Claude's call, and
the outline is right not to raise a pop-up (outline:942-948).

**But the framing is sharper than the outline admits.** The runners carried the chain lamp's fire to the wick for
fifty years (outline:642-644). So a lamp lit by Zetwal's Marshal would be the source of Agnivansh's sacred fire, in a
culture drawn from a real one (Agni, the flame keepers). Two small changes make it plainly an alliance and not a
foreign hand on someone else's fire, and they cost nothing:

- **Staging:** Arjun puts the taper in Patricio's hand and closes his own hand over it. "Two hands. The signal is for
  your ships; the fire is ours." Patricio still does the `use`, so the anchor is unchanged.
- **The flame:** decide that the temple's flame was **never out**, only low (see 3.10, "the flame catches"). The
  beam then *shows* the city its flame, and the oil revives it. The relit chain lamp lights nothing sacred; it carries
  the light the city needs to see.

### 3.8 "Data only" claims that are not data, and the real engine budget

1. **The mirrors' conditions.** Map `if` text supports only set, not set and `|` (`engine/conditions.ts:59-82`). It
   cannot read `mirror.1 = east` (outline:768-772). Either:
   - use four boolean flags per mirror (`mirror.1.e` and so on; each `use` sets one and clears three, written as
     branches in the dialogue), which is data; or
   - add `flag=value` to `parseConditionText` (about 10 lines and a test).

   Each mirror's five looks are five objects with `if` conditions: `PuzzleObject` has one `kind` (`tiledMap.ts:218-229`).
2. **The encounter dials.**
   - "Weight 1 after `choice.dhanraj_broken`" (outline:535, 336-337) needs a conditional weight. `EncounterGroup.weight`
     is a number (`engine/content.ts:53-69`).
   - "A 24-step grace on the flats" (outline:573) needs a per-zone grace. The grace is the global
     `ENCOUNTER_GRACE_STEPS` (`game.ts:263`).
   - The route never returns to the flats after Dhanraj, so the broken effect is invisible. Drop both (the Ch7 review
     said the same of the fox-broken marsh).
3. **Gianna carrying the relay lamp** "with a look on her sprite" (outline:652-653). The player's look changes only
   with the disguise flag (`FieldScene.ts:1024-1031`). Cost it (about 0.05) or make it the key item plus a line.
4. **Vikram, Bayarmaa and Haru walking with the party** (outline:391, "Vikram, Haru, Bayarmaa and Salkhi with
   them"). Followers are hard-coded, and the stage's `borrowed` union is `'follower' | 'yari' | 'azzy' | 'samira'`
   (`FieldScene.ts:122`). This is the Ch6 review 3.8 / Ch7 review 3.9 cost again: about 0.25 days per companion, or
   placed NPCs per scene.
5. **Walkers.** A walker moves an NPC only when exactly one placement leaves and one appears (`engine/walkers.ts:21-37`).
   - The seven riders, the two who fall, the crowd parting, the city coming in and the runners with jars
     (outline:130-134, 264-267, 302-303, 340-341) need distinct NPC ids.
   - Better, they should be stage `enter`/`walk` actors (`engine/stage.ts:23-39`).
6. **The voyage.** `jwaladesh_aldermoor` needs a new `shore`. `VoyageDef.shore` is
   `'zetwal' | 'xaragua' | 'ardencia'` (`engine/voyage.ts:23`).
   - Agnipur's dot (37, 91) is about nine cells inland. Its sea is the bay at about (41, 100) (`ch8rev/realm8.mts`).
     So `kuroshi_jwaladesh` is a short hop across the bay, not "west along the south coast" (outline:53). The Ch7
     review asked for this caption to change too.
   - "North along the west coast" to Kingsmere (outline:394) is right: round the south-west tip and up to about
     (16, 62).
7. **The Echo zone and Arjun.** The validator forbids an NPC inside a zone (outline:431), and the zone is the lamp's
   three-tile platform, where Arjun stands "at the lamp" (outline:255-256). Put him on the stair head, outside the zone.
8. **Anissa holding the disc while the player turns three mirrors** (outline:287-291). The follower cannot stay put
   while the player walks. Re-stage: the player turns mirrors 1 to 3 with Anissa following, then a trigger at the
   fourth bracket plays the scene: Aiyana gives the disc; Anissa (`borrowed: 'follower'`) walks to the spot, the beam
   lands, and she turns (`face`).

**The budget.** Add followers (0.25 to 0.5), the lamp look (0.05), the condition parser or flag sets (0.05), the shore
and its art (0.1), and the boss changes in 3.1. Remove the sparring rule (3.9, already built). Engine and wiring then
come to about **2.25 builder-days, not 1.5** (outline:899). The 2.5-day plan (outline:1128) does not hold with six maps,
three puzzle files and about 290 lines.

Cut first, from the start:

- `freeRound` and `attackOnFell` (take the fallbacks);
- `elementBoost` (the stat fallback);
- `itemDelay` (fold into the area blow);
- the conditional weight and the grace.

### 3.9 The sparring rule is already built

"A fight with no Game Over has never been built" (outline:1093) is wrong. `BattleDef.meantToLose` does exactly this:

- no goddess, no count, no Grudge, and a scene that plays after a loss or a win alike (`battle.ts:304-309`,
  `gameOver.ts:57-62`);
- the Trial of Blades uses it (`data/battles.ts:536-548`, rewards 0).

Use `meantToLose: { scene: 'vikram_after', set: { 'choice.duel_lost': true } }`. The flags are set on a loss only, and
the after-scene sets `choice.duel_won` when `!choice.duel_lost`. Only the solo-fighter filter (`fighters: ['gianna']`)
is new.

The outline's described fallback ("a `finale` that fires on the party's first fighter down", outline:888) is not how
`finale` works (`battle.ts:266-281`: the boss ends the fight on his own floor or turn count). It is not needed.

The duel numbers reproduce exactly: 17, 25 and 27 of 30 at 19, 20 and 21, about 8 to 9 actions. They are on starting
gear (3.1, caveat); with tier-20 gear Gianna will win more often. Either outcome is fine, so this does not need tuning.

### 3.10 Story logic: four contradictions inside the chapter

1. **The flame: alive or out?**
   - Aiyana measured it "the height of my thumb" this morning (outline:166-167), and the altar's first look is "a
     thumb's height" (outline:412).
   - At beat 6 "the wick **catches**" in the beam (outline:305-307), from "a wick... in a dry bowl".

   Pick one. My vote: alive and low. The beam *shows* it (the curtain down, the city sees a thumb of flame), the oil
   at dawn raises it, and the senior Keeper's "It will not last the night without oil" still holds.
2. **The full reservoir in a city starved of oil.** Aiyana has filled the chain lamp's reservoir every new moon for two
   years: "Oil. Two years' worth" (outline:246-247). Why is the temple's bowl dry while she holds two years of oil
   beside it?
   - **Fix:** "One measure. Every new moon, from my own pay. Enough for one night of the lamp; not enough for a
     temple."
3. **The day and dusk.** Aiyana says the Court sits "at dusk" (outline:169-171). After the Court, "the day is the
   party's" (outline:598), and J-3 leaves "at dusk" (outline:676) before "night on the bazaar".
   - **Fix:** the Court sits at noon ("when the lamp-sellers close for the heat"), J-3 goes at dusk, and the night
     follows. Make the night variant a **condition** on the three flags, not a flag "set when the third completes"
     (outline:608): nothing sets it, as the Ch7 review found for its dusk.
4. **Anissa's debate line inverts the lamp's story.** "It waited fifty years and then it was quick" (outline:714-715).
   In fact the lamp was lit once, fifty years ago, burned for fifty years and went dark two years ago.
   - **Fix:** "The lamp on the chain did both, Gigi. It was lit quick, and then it waited fifty years."

### 3.11 The signature puzzle and the minor Echo: feasible, but easier than "honest 4"

**Feasible as data** once 3.8 (1) is settled. The anchors are real keys: without `anchor.chain_lamp` and
`anchor.tower_mirror` no beam arrives (outline:786-788), unlike Chapter 7's peg. That is good.

**But the present half has no deduction.** Each right turn draws the next segment, and each wrong one draws a stub
into brick (outline:283-286, 771-772). That is three independent four-way choices with instant feedback: at most nine
presses, honest difficulty about 2. Arjun also tells Patricio exactly what to do with both anchors (outline:259-263).

**Recommended (keeps `PUZZLES.md` SIG-JWA's logic and hint 3):** draw the beam only when the whole route is right
(the window lights). Before that the mirrors turn with no beam, just the stub from the tower bracket against the
Exchange. The clue to the route is M-JWA-1's runners' way: "left at the dyers, through the arch, along the wall".
That is the same shape as east, north, north, west round where the tower now stands, and *The Relay* in the library
says so. Then the minor Echo teaches the signature's present half (one rule learned and applied twice), and the
honest difficulty is about 3 to 4. Each mirror has four looks, so 64 states: a stuck player brute-forces it in minutes,
and Anissa's third hint gives it.

**M-JWA-1** (difficulty 3): the runner says the route aloud in the Echo (outline:649-651), so it is about 1 to 2. That
is fine for a minor; say so. Also say what happens if the player carries the relay lamp off the bazaar map (into the
Court, or down the harbor stair). Recommended: leaving the map ends the attempt, and the lamp goes back to the hall.
And say where "the harbor stair's foot" is: on the harbor map, the route crosses a map change.

**The rooftops' unlock.** Aiyana is met "on the lowest rooftop" in beat 1 (outline:157-158). If that roof is the
rooftops map, `story.rooftops_entered` (outline:770-771) is set in beat 1, and the brackets unlock before the tower.
Either meet her on a roof drawn on the bazaar map, or unlock the brackets on `story.rooftops_entered, anchor.tower_mirror`.

### 3.12 Anissa and tone

- **The duel rope.** "Gigi, he's already out of breath." / "Then it's a fair fight." (outline:215). This is Vikram's
  breathing in a node with an Anissa line, which the outline's own content test bans (outline:1171). Anissa sets up
  the quip.
  - **Fix:** Yari says the line; Anissa holds the rope, silent.
- **"A lantern, Gigi. On the quay. Just saying it."** (outline:273). It is a cute callback to Aiyana's "Just say it".
  - **Fix:** "A lantern, Gigi. On the quay."
- **"Kayla wrote: three lines, which for Kayla is a scream"** (outline:163). It is fine as Aiyana's dryness, as long as
  Anissa has no line in that node.
- **Haru's thumbprint list** "Oil, bread, water, grain, paper. Now oil again. The same thumb, in six cities"
  (outline:683-684). Haru joined in Chapter 7 and saw one safehouse. Give the count to Yari, who has walked them all.
  Also check the list against the built safehouses: five goods for six cities.
- **Dhanraj** says the contracts "were paid for with Throne sols" (outline:321-322), then "names the Crown in neither
  more than the ledger does" (outline:338). Drop "Throne sols" from his first speech, so the ledger is the proof.

### 3.13 Length

The 840 steps (outline:1024) are plausible. The time is not. Three to five fights, with Dhanraj at 40 to 50 actions
(about 5 to 6 minutes), plus about 290 lines and two Echo scenes, put the chapter nearer **35 to 40 minutes** than 30
to 33. The plan's 30 is a target, not a rule. Measure it in the day-3 browser test, and cut first from the list at
outline:1187-1190, plus the debate's third round, before cutting a beat.

---

## 4. Claims checked

**Confirmed:**

- **The curve** (`config.ts:62`, `engine/rpg.ts:295-298`): 19 at 5,098, 20 at 5,559, 21 at 6,034.
- **The tool line** 5,150 → 5,835 (with the books 5,955), level 20. The sums are right: nine objectives at 25, SIG-JWA
  60, the minor 25, the debate 15, J-2 100, J-3 100 plus 60, and Dhanraj 100.
- **`CHAPTER_LEVELS` 8** is 19 to 21 (`data/chapterLevels.ts`).
- **Party stats at 20** (`dhanraj-sim2.ts` output):
  - Vikram: hp 124, atk 82, def 28, mag 27, spd 55;
  - Azzy: hp 203;
  - Haru: spd 56.
- **Dhanraj at 21 x6 / x1.5:** about 1,690 HP and 107 ATK.
- **The outline's tables:**
  - every Dhanraj row reproduces exactly as computed, the x6 row from `dhanraj-sim2.ts`;
  - every ambush row reproduces exactly (3 jackals: 7 actions, 92 to 93% HP left; 2 zealots and an enforcer: 9
    actions, 89 to 90%; 3 enforcers: 14 actions);
  - the duel's three rows reproduce.

  The "0 down" and "nobody hurt" readings do not hold (3.1).
- **Built features:**
  - `protects` and `INTERCEPT_CHANCE`;
  - phases with `enter` (`battle.ts:254-264`);
  - `withdraws`, `endsWithBoss`, `meantToLose`;
  - `gilded` with `shatter` (`config.ts:194`);
  - only Gianna can Surge (`anissaBond`, `battle.ts:1044`, 1181), so "a Surge shatters the oil" is Gianna's blow;
  - `BATTLE_ACTIVE` 4 and the first-four rule (`battle.ts:617`, 1418-1421); no `party.active`, no `burning`, no
    `oiled`, no `itemDelay` and no `ENCOUNTER_XP_TAPER` exist yet;
  - stage cues `place`, `enter`, `walk`, `exit`, `face`, `look`, `wait`, `sync`, with `'follower'` as an actor;
  - `fx: 'shake'`.
- **The debate:** `debate.<id>.settled` exists (`debate.ts:72`, 128). Use it in the gate's condition instead of
  `joined|mediated` (outline:605), as Chapter 4's dusk does. Mediate needs Influence 5 (`config.ts:282`), reachable by
  listening and reading.
- **`FAMILY.md`:** Aiyana is Kayla's full sister and Rahel's daughter, an engineer of the great flame who opens the way
  through the puzzle. Jordyn is in the Regent's guard (Chapter 9), and Sebastian's recital is in Chapter 9. The outline
  matches all of these, apart from 3.5.
- **`STORY.md` Chapter 8's beats** are all present (Meera and the priests hide the failing; Vikram's duel over an
  argument; the Echo at the chain; the hoarder; the join). `PUZZLES.md` SIG-JWA's logic and hints are kept.

**Not confirmed, or wrong:**

- 22 at 6,526 and 23 at 7,030 (outline:33): they are **6,524** and **7,028**. So 7,035 is level 23 by 7, not 5
  (outline:567).
- "Nobody down in any seed at x6" (outline:521), and "the honest fight is shorter and sharper" (outline:519-521) (3.1).
- "The enforcers must be cut down twice" (outline:517-518): the sim never brings in the second pair (3.1).
- "The taper... taken as adopted" (outline:46-47): it is not built, and the Ch7 review asked for a different rule (3.6).
- "Jwaladesh's Wealth between about 4 and 11" (outline:369): it is 7 to 11 (3.4).
- "A fight with no Game Over has never been built" (outline:1093) (3.9).
- "Pure data" for the mirrors (outline:774), and the "0.05" voyage, the shake and the encounter dials (3.8).
- "No new Rael clue" (outline:82) against "her one clue-level line" (outline:848) (3.5).
- "Without the two side quests, 5,575" (outline:560) is moot: both are required.

---

## 5. What is missing

- **The Ch7 review's fixes carried into this chapter:**
  - the buyer's list (3.2);
  - one ambush rule (3.6);
  - the four price ranges side by side (3.4);
  - the token rule;
  - the voyage caption;
  - followers costed;
  - walkers as stage actors;
  - night as a condition.

  The outline was written before that review landed (outline:24); the second pass should fold them in.
- **The down counter fixed** in every sim before any boss's dial is set, and a bot test that asserts falls with a
  party-wide count (3.1).
- **What happens to the crane** (3.3) and **whether the flame was ever out** (3.10).
- **Game Over return points** for `quay_watch` (only the shrine and the store doors are named, outline:619, 1183).
- **A route test** that turns the mirrors before the anchors and finishes anyway (the cheat file at outline:786-788
  covers the mirrors, not the route), and one that walks the bazaar at night without J-2's lane (the quay watch path).
- **A recorded Claude's call** for each of: the enforcers' `protects`; Price Spike's area blow; Burning's cap on
  bosses; the beam drawn only when complete; the flame alive and low; and the crane returned at dawn.
- **The open-items reminder** (outline:1196-1199) is present. Keep it.

---

## 6. Recommended changes (build order)

1. **Sims and the boss (3.1):**
   - Fix the down counter (`b.party`, not `b.fighters`) in the scratch sims and in the `tests/` version.
   - Give the start save tier-appropriate gear.
   - Keep the phase-2 entrants and give the enforcers `protects: 'seth_dhanraj'`.
   - Make Price Spike about a 120 area blow plus the item delay.
   - Cap Burning on bosses.
   - Re-run x5 / x1.5 with the fair and the plain bot, aiming for about one down at the floor, at least 28 of 30 won,
     and the plain bot no faster than the fair one.
2. **Levels (3.6, central session, day 1):**
   - Adopt one ambush rule. The recommended one is `AMBUSH_XP_SHARE` 0.12 of the party's level gap, sized by foes,
     with the relative-level factor, from party level 12.
   - Add `level-curve.ts --played` with seeded ambushes on the routes' wild steps and a wanderer profile, and assert
     the 90th percentile at most `to + 1`.
   - Correct outline:33 and 567.
   - State the change in the milestone note.
3. **Continuity with Chapter 7 (3.2, 3.3):** the buyer's mark identifies no house; the crane is returned at dawn.
4. **Price (3.4):** a floor of about 4 to 5 (the store as a choice, or no free token point); the four ranges in one
   table; the token rule as recorded for Chapters 6 and 7.
5. **Aiyana and the carter (3.5):**
   - cut "Cenizal on a roof" and the Locket link;
   - cut the rod line;
   - the carter's line without "he";
   - a human read of every Aiyana, carter and Azzy line in the reviewer prompt.
6. **Patricio's lamp (3.7):** two hands on the taper; the flame alive and low (3.10). Record both as Claude's calls; no
   pop-up.
7. **Engine claims and budget (3.8, 3.9):**
   - flag sets or `=` conditions for the mirrors;
   - drop the conditional weight and the per-zone grace;
   - cost the followers, the lamp look and the shore;
   - stage the riders and the city as stage actors;
   - Arjun outside the zone;
   - Anissa's disc as one end scene;
   - the duel on `meantToLose` plus a solo filter;
   - re-plan at about 2.25 engine days, with the cuts listed in 3.8.
8. **Story logic (3.10):** the flame alive and low; one measure in the reservoir; the Court at noon; the night as a
   condition; Anissa's lamp line the right way round.
9. **Puzzle (3.11):** the beam lights only when the route is complete, with the runners' way as the clue; restate the
   honest difficulties; the relay lamp's map rule; the rooftops' unlock gated on the anchor.
10. **Tone (3.12):** Yari takes the duel-rope line; drop "Just saying it"; the thumbprint count to Yari; Dhanraj
    without "Throne sols".
11. **Length (3.13):** measure in the browser and plan for 35 to 40 minutes, or cut from outline:1187-1190.

**Owner questions:** none required. Nothing here changes the story's flow. The ambush rule is a balance statement for
the milestone note, and the near-miss is resolved by staging (3.7).
