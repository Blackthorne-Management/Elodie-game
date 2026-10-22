# Second review: Chapter 6 outline, The Stolen Standard (Oct 21 to 22)

*Reviewer: an independent helper, reading only. Subject: `docs/quest/reviews/2026-10-21-chapter6-outline.md`
("outline:N" below means that file's line N). I checked it against the built engine at commit 889ed60 (the
outline's own snapshot, `scratchpad/ch6sim/snap/quest`, because the `chapter3` worktree is mid-edit for Chapter 4),
against the Chapter 5 outline and its review, and against the design docs. I re-ran the outline's simulation and ran
my own variant: `scratchpad/ch6rev/rev-sim.ts`, with the same engine, Story difficulty and 30 seeds per row. I changed
no other file and committed nothing.*

---

## 1. Verdict

**Build it after the fixes in section 6.** The chapter's shape is right. It follows the plan's minimum, the road
order and the tone rules, it hands on cleanly to Chapter 7, and the story is better than the design's. The best parts
are the receipt, Torvald's tired honesty, the empty pole as the first shot, and the fur.

Four problems would ship broken or contradictory if built as written:

1. **The level plan does not close, and its arithmetic is wrong.** Even with the proposed taper and the cuts, the
   played line ends at **19**, not 18. The taper also changes Chapters 4 and 5, which the outline says it leaves
   alone (3.1).
2. **Sarnai's raid never plays where the outline puts it.** The crossing ends in the Echo, and `onEcho` fires only on
   a swap (3.2).
3. **Grimvald's third phase, "the standard broken", is optional in practice.** In my runs it never fired in half the
   level-17 fights, and never for a player who does not Surge. The fight's staging also contradicts the scene after
   it (3.3).
4. **The present is both summer and winter.** The ice that "took the raid" contradicts the Echo, where the raid
   succeeds (3.4).

None of these needs the owner. One lore point, Azzy's maternal line (3.5), is borderline. I recommend handling it so
that no question is needed.

---

## 2. What I agree with

- **Continuity in from Chapter 5** (outline:43-79). It folds in the Chapter 5 review's fixes:
  - the compass, now south-east;
  - the 25 XP objectives and 10 XP books;
  - `withdraws` firing at 0 HP;
  - no `support` role;
  - Mediate needing Influence 5.

  `clue.seventh_clause_read`, with a fallback line at outline:138-139, pays off the Parley well.
- **Bayarmaa joins at the Moot under the envoy's bond** (outline:152-157, 760-762). This is a sound Claude's call.
  Playing the Raider in her own chapter matters more than the design's order, and the standard still clears her
  name.
- **The receipt instead of a confession** (outline:242-245). It shows "the Crown buys whole councils" and costs the
  Regent nothing that Chapter 9 needs.
- **Torvald is clean; Hrafn is the seed of the betrayal** (outline:767-769). This agrees with COMBAT 13.3 and
  STORY 10.4.
- **No Echo battle** (outline:358-360). "Touch nobody who drops his musket" would contradict one.
- **The herd as a moving screen, with the camp fight as the fail-safe** (outline:216-226). It is honest about the
  missing stealth system, and it cannot soft-lock.
- **S-5 and S-3 as the required pair; S-2 folded into the price scene** (outline:499-510). The safehouse thread and
  the only quest Chapter 12 reads are the right two to keep.
- **The two-era fjord as tile data.** `collidePresent` and `collideEcho` exist (`tiledMap.ts:70-71, 98, 326-327`), and
  the validator demands that zones be walkable in both eras (`mapValidation.ts:194-208`). No engine work is needed for
  the terrain.
- **Hand-off to Chapter 7** (outline:820-850):
  - Torvald's letter makes Chapter 5's "Kuroshi will not speak to anyone until Skarragol has" an object the party
    carries;
  - Kayla is left to Chapter 7;
  - the Rael thread is honestly unmoved.
- **The tone rules are kept** almost everywhere. The comedy is Salkhi, the bowing envoy and Samira. The Sky-Rider and
  the Witness elder are both reasonable.

---

## 3. Disagreements and risks, most serious first

### 3.1 The level plan does not close; the numbers are wrong; and the taper is not "Chapters 1 to 5 untouched"

The curve is `round(50 x (n-1)^1.6)`. I recomputed it with node:

| Level | XP to reach it |
|---|---|
| 15 | 3,410 |
| 16 | 3,808 |
| 17 | 4,222 |
| 18 | 4,653 |
| 19 | **5,098** (the outline says 5,105) |
| 20 | 5,559 |
| 21 | **6,034** |

**Wrong values in the outline:**

- **outline:450.** "4,200 + 870 + 2 x 500 = 6,070, level 20". 6,070 is **level 21**. The route's own XP is 820, not
  870: the table runs from 3,750 to 4,570 (outline:439-444). The corrected sum, 6,020, is level 20 by 14 XP.
- **outline:459-460.** The "drop the chapter's data" totals do not reproduce:
  - The cuts are Grimvald -50, the wolves -30, S-5 -20 and S-3 -20, which is -120 in all.
  - The tool line is then 4,340 without books or 4,450 with them. The outline says 4,290.
  - The played line is 4,200 + 700 + 340 = **5,240, which is level 19**. The outline says "about 5,200 (18), one over,
    inside `slackOver`". In fact it is two over and outside `LEVEL_CURVE.slackOver = 1` (`config.ts:75`).
- **outline:56.** The assumed played start, 4,200, is 22 XP short of 17. With **zero** ambushes, 4,200 + 820 = 5,020
  is already **level 18**.

**The root cause is upstream.** Chapter 5's played line, and Chapter 4's before it, already put a real player at the
top of Chapter 6's band on arrival. The ambush rule makes it worse:

- `ENCOUNTER_XP_PER_LEVEL x group level x foes` (`data/battles.ts:701`) pays 450 to 680 XP a fight here.
- That is more than a whole level, about 400 XP at 15 to 17.
- With `ENCOUNTER_CHANCE_PER_STEP 0.03` after 18 grace steps (`config.ts:47-48`), a fight comes about every 51 wild
  steps.

**The taper's scope is misstated.** outline:455 says "so Chapters 1 to 5 do not move". But the taper starts at party
level 12 with share 0.6. Chapter 4 runs from 11 to 14 and Chapter 5 from 14 to 15 (`chapterLevels.ts`), so both chapters'
ambushes would pay 40% less. Both are being built or tuned right now. outline:848-850 half-admits this: "re-assert
for Chapters 1 to 5".

**A smaller false claim, outline:432.** "A level-15 pair is 'trivial' to a party at 18 and backs off." The trivial band
is only a colour (`engine/rpg.ts:329-337`, used in `ui/GameMenu.ts:1002, 1089`). Nothing backs off.

**Is the taper drastic enough for the owner?** No. It changes no story flow, and the working plan already says "XP
retuned per chapter with the simulation" (`PLAN-ALL-CHAPTERS.md`, the last paragraph). But it re-balances two chapters
that are under construction, so:

- the central session should decide it once, on all chapters' routes;
- it should be recorded in `COMBAT.md` 6 as a Claude's call;
- it should be named in the next milestone note to the owner as a change to the realm's balance. That is a statement,
  not a pop-up.

**Fix:**

- **(a) Correct the table.**
- **(b) Measure the played line** instead of assuming it. Use Chapter 5's real route plus one or two seeded ambushes.
  Do this before Chapter 6's dials are set.
- **(c) Prefer a rule that is relative to the party's level** over a table of party-level bands. For example: an
  ambush pays a fixed share of the XP from the party's level to the next, say 25 to 35% per foe group. That is
  self-correcting at every tier, and Chapters 7 to 12 need it too. If a band table is kept, start it where it is meant
  to start (15), or say plainly that Chapters 4 and 5 move, and re-run their curves.
- **(d) Accept 18 as Chapter 6's played end,** with `CHAPTER_LEVELS` 6 `to: 17` and the tool at 17, **or** lower the
  chapter's fixed XP further:
  - Grimvald 100;
  - S-3 60 and its wolves 40;
  - S-5 50;
  - books paying Influence only (outline:591 already offers this).

  Do not plan on 18 while writing "one over" when the sum says 19.

### 3.2 Sarnai's raid will not play: the crossing ends in the Echo, and `onEcho` fires only on a swap

The route at outline:621-626 has five swaps:

| Swap | At | Into |
|---|---|---|
| 1 | zone 1 | Echo |
| 2 | zone 2 | present |
| 3 | zone 3 | Echo |
| 4 | zone 4 | present |
| 5 | zone 5 | Echo |

The player then **walks** the Echo ice into zone 6 already in the Echo. `onEcho` runs only inside `swap()`, when the
player changes era (`engine/game.ts:409-437`, `const scene = check.to === 'echo' ? check.zone.onEcho : ...`). So the
chapter's required Echo scene (outline:189, 629-632) never starts:

1. The player arrives on the far shore and nothing happens.
2. They must swap to the present (a 6th swap) and back (a 7th) to see it.
3. The camp then stays shut on `clue.herd_whistle`.

That is a confusing near-soft-lock, and it breaks "five swaps".

**Fix:** play the raid from an **Echo-era step trigger** on the far shore. Triggers are already scoped by era
(`engine/world.ts:28-29`). Keep `onEcho` on zone 6 as well, for a player who arrives in the present. Gate both on
`!clue.herd_whistle`. Add a route test that crosses in exactly five swaps and asserts `clue.herd_whistle` without a
sixth.

### 3.3 Grimvald's third phase is unreliable, and the fight contradicts the scene around it

**The engine runs phases strictly in order.** `phaseCheck` looks only at `phases[this.phase]`
(`engine/battle.ts:1304-1311`). An `onSurge`-only phase placed after a `below: 0.5` phase therefore fires only if
Gianna Surges *after* he is unhorsed, and before he withdraws. Surge needs 5 Spark at 1 per Gianna action
(`config.ts:246-249`).

My runs at hp x7 and atk x1.6, Story difficulty, 30 seeds each:

| Bot | Party 15 | Party 16 | Party 17 |
|---|---|---|---|
| The outline's fair bot (always Surges) | phase 3 never in 2/30 | never in 3/30 | **never in 15/30** |
| Never Surges | never in 30/30 | never in 30/30 | never in 30/30 |
| Plain: never guards, heals or Surges; hits the boss | never in 30/30 | never in 30/30 | never in 30/30 |

So "the beat that ends the Crown's grip" (outline:399-403, 770-771) is missing for many players.

**The staging contradicts itself:**

- Before the fight, Grimvald mounts the black horse with the standard **across its saddle** (outline:232-233).
- In phase 2 his "horse bolts across the ice" and he "plants the Ironvow standard in the ice" (outline:395-398).
- In phase 3 a blow "knocks the pole from his hand".
- After the fight, Bayarmaa "walks to the black horse, cuts the tie" to free the standard (outline:240-241). That is
  the horse that bolted, and a tie that was already gone.
- The fight is at the camp on the meadow, not on the ice.

**Fix:**

- Make phase 3 `{ below: 0.25, onSurge: true }` and move its text so it reads either way. For example: "The standard
  falls from his hand. Bayarmaa: 'That is not yours.'" The beat then always happens, and a Surge only brings it
  sooner.
- Make phase 2's line "His horse bolts to the picket line".
- Have him carry the standard on his back.
- After the fight, Bayarmaa picks it up from the ground and walks it back. Drop "cuts the tie", or make the
  tie-cutting the pre-fight picture.

### 3.4 The present is summer and winter at once; the ice "took" a raid that the Echo shows succeeding

**The design's present is summer.** PUZZLES SIG-SKA reads "Present: summer; open water with drifting floes"
(`PUZZLES.md:250`), and S-SKA has "a summer sky" (`PUZZLES.md:274`). The outline keeps this at outline:176 and 611.

**But the outline also says the opposite:**

- "the winter road", "Cold is a cost", the fur cloak (outline:89-92);
- Bayarmaa: "The ice took the trail at the thin water" (outline:148);
- Bayarmaa: "**The ice is hardest before dawn.** We go now or we go never" (outline:171-172). In open water with
  floes this means nothing, and it is the chapter's urgency line.

**The ice and the raid conflict.** Torvald says "the ice took your grandmother's whole raid the year the war ended"
and calls it "Sarnai's raid, foreshadowed; it is the Echo" (outline:149-151). The Echo then shows the raid crossing
and winning (outline:189-204), and *Sarnai's Ride* is "the raid that broke the Crown's supply line" (`CAPITALS.md`
6).

**Fix:**

- Set the present at the **edge of the freeze**: first floes, open leads, and the fjord not yet frozen this year.
  "Winter Plateau" stays a place name.
- Bayarmaa's line becomes about the floes and the tide, for example: "The floes drift out with the morning tide. We
  go now or we go never."
- Torvald's grief attaches to something consistent. Either the ice took *a later raid* of Sarnai's (she lived; some
  riders did not), or "the ice took half her riders coming home". Say which in one line. The Echo then shows the
  victory, and the cost is spoken.

### 3.5 Azzy's maternal line: the outline invents a separate polity, which the settled guide does not have

`QUEST-BUILD-GUIDE.md:768` (settled) says Azzy's mother is "a royal of the Mongolian empire... her empire is
**Skarragol**, which also explains why Bayarmaa's people have a stake in Azzy". She "is unimportant to the story and
does not appear (at most a line of dialogue)".

The outline creates "a royal ordu of the eastern steppe, *the Ordu of the White Mare*" with its own envoy, champion
and two hundred riders, and an offer for Azzy to "take your grandfather's [name]" (outline:536-545). This does three
things the guide does not:

- it makes Skarragol two polities;
- it gives Azzy a living maternal grandfather with a name to inherit;
- it leaves open whether Azzy is kin to Ironvow, Bayarmaa's house.

Chapter 12's Claim reads this choice (outline:555), and none of it is listed among the Claude's calls in section 12.

**Fix (no owner question needed):**

- Make the envoy come from **Skarragol's own royal line**, "the khatun's household, of the Ironvow's eastern clans".
  Do not name a separate ordu.
- Have him offer riders "if he takes his mother's name". Do not mention a grandfather's.
- Have Torvald or Bayarmaa acknowledge that Ironvow knows him, one line ("Your mother's people ride under our
  standard too").
- Record it as a Claude's call.

Only if the build wants Azzy and Bayarmaa to be cousins does it become an owner question, because that changes two
companions' story.

### 3.6 Se-5's token is given whatever is paid, but the rule says "paid in full"; currencies and thresholds are ignored

**The token.** `SIDE-QUESTS.md:392` says each token is "given when its price is paid in full". The Chapter 5 outline
repeats this at its section 14: "gives one when an ally's price is paid in full". The outline gives
`item.token_ironvow` in the price scene regardless (outline:291-293), at a Wealth of 2 to 8 out of 10, so never in
full in this chapter.

- **Either** change Se-5's rule to "given when the alliance is made", and record it as a Claude's call in
  `SIDE-QUESTS.md`;
- **or** give the token only at 10, possibly at the Muster.

The first is the better game, but it must be written down.

**Other currencies.** The guide says "Any other currency counts at **half value**" (`QUEST-BUILD-GUIDE.md:428`). The
Journal note "Paid here: N" (outline:285-288) counts Wealth only, and leaves out:

- S-5's +2 Influence (or +2 Fear);
- the spare's +1 Influence;
- the eleven books' +1 Influence each, which worth up to about 7 Wealth at half value.

Decide whether Influence counts at half, and say so. Nothing in the engine computes prices yet: there is no `price`
in `config.ts`.

**The Exposed route.** It needs the price "at least 60 percent paid" (`STORY.md:457-459`). By Wealth alone that is
only reachable with **both** the purse given (+3) **and** the jarl's 300 gold (+3): 3 + 3 + 1 + 1 = 8, while the
purse alone with Samira's letter and S-3 is 5. The "keep the purse" choice (outline:277-278) therefore silently closes
the Exposed route unless gold is paid later. Note this in the Journal text, or count Influence at half so that a
diligent reader reaches 6.

### 3.7 The herd cannot walk the way the outline says

Walkers move **NPCs**, and only when exactly one placement of an NPC id disappears and one appears
(`engine/walkers.ts:21-37`): "two of the same NPC appearing at once stays ambiguous, so they just appear". Objects
are never walked.

The outline says the herd is "horse objects re-placed..., walkers walking them" (outline:196-197) and "present-era
objects with placements by flag" (outline:636-637). Thirty identical horses would teleport.

**Fix:**

- Use 6 to 8 horses as **distinct NPC ids** (`herd_1` to `herd_8`), each with two or three placements.
- Or, in the two scenes, move them with stage `walk` cues on `npc:herd_n`. These exist (`engine/stage.ts:23-39`), but
  borrowed NPCs "walk home after the scene" unless a flag has moved their placement, so pair each cue with the flag.
- Solid horse NPCs in their new placements must never box the player in. Add the herd's flag states to the route
  test.

### 3.8 Party followers are code, not data; Salkhi is both a follower and not one

The field draws Anissa, Yari, Azzy and Samira as hard-coded followers (`scenes/FieldScene.ts:238-248, 1548-1611`).
Samira's took about 65 added lines in 889ed60. The outline adds three things that are all code:

- "Bayarmaa walks with the party" (outline:168, 826) needs a fifth follower, plus `'bayarmaa'` in the stage
  `borrowed` union (FieldScene.ts:121).
- Anissa's fur recolour by flag (outline:665) has no follower-look-by-flag mechanism.
- The planted-pole look needs the same.

outline:705 prices Bayarmaa at 0.2 days as data. Add about 0.25 days for the follower and the recolour, or cut the
recolour to a line.

Salkhi is "not a fighter and not a follower" (outline:688). Yet in beat 9 "the horse [is] now in the party's line
on outdoor maps" (outline:301-302). Pick one. Flag placements are cheaper and match section 9.

### 3.9 Who fights: putting Bayarmaa before Samira benches Samira for the rest of the game, and the bench run was not tested at the chosen scaling

The active four are the first four in `MEMBERS` order (`engine/battle.ts:617`). There is no party-order screen. If
Bayarmaa goes before Samira (outline:370-374):

- Samira, whose Bribe was Chapter 4's mechanic, is benched by default in every later chapter;
- the reavers here are `bribable` and go unbribed.

outline:416 says "With Samira active and Bayarmaa benched at x4 it was 30/30 as well". At the **chosen** x7 / x1.6 I
got:

| Party | Wins | Losses | Fighters down |
|---|---|---|---|
| 15 | 28/30 | 2 | 0.40 |
| 16 | 29/30 | 1 | 0.13 |
| 17 | 30/30 | 0 | 0 |

These are fine for a fight with Game Over and the Grudge, but not "both win".

**Fix:** set a small `party.active` order flag at the Moot. Bayarmaa replaces whoever is fourth for this chapter,
and the order is restored or made choosable afterwards. Or accept the bench and say so for Chapters 7 to 9.

### 3.10 A joke beside Anissa

The fur moment is right: Bayarmaa puts her outer fur on Anissa without a word (outline:663-666). But the outline then
says "the joke is that Salkhi says 'She never gives me her fur'". That is a comic line in the same beat as Anissa's
earnest "I'm coming onto the ice" (outline:172).

It breaks the outline's own rule, "Salkhi never speaks in a scene with Anissa's lines in it" (outline:695), and the
spirit of "no jokes in Anissa scenes" (`STORY.md` 5). Move Salkhi's line to the next map, or cut it.

### 3.11 Smaller points

- **outline:170 and 485, the dusk variant.** Nothing in the engine sets a flag when "the third completes". Make
  `story.fair_dusk` a **condition** (the three done flags and `!story.fair_dawn`) on the variant layers, rather than a
  flag that some dialogue must remember to set.
- **The gate's `if`, outline:482.** It uses `debate.skarragol_oath.joined|...mediated`, which matches the built flags
  (`engine/debate.ts:67`; `data/quests.ts:480`). Good. But a lost Join sets `joined`, so "required" means "tried".
  This is the same as Chapter 3, and acceptable; say so.
- **The receipt in the hostage-envoy's own hand** (outline:243). A Regent "three moves ahead" would not let his
  envoy sign a receipt to a thief. Make it a compensation-office voucher under the Throne's seal, payable "on the
  council's vote", with no name. The envoy can still deny it with a bow.
- **Bayarmaa's stat line** (outline:675) is Caona's (`data/rpg.ts:247-250`) with spd -1 and mag 0. That is acceptable
  as a start. "The fastest in the party" (46 against Yari's 44) is marginal; add +1 spd base if it matters.
- **Realm map.** Ordvik's dot (91, 91) is about 20 cells inland from the nearest sea. Kuroshi borders Skarragol by
  land along x 78 to 80. The longship must leave from Skarragol's south coast, around (100, 104), and sail west along
  Kuroshi's south coast. Voyages are sea-only and must start at sea (`engine/voyage.ts:11, 57`). Set the `VoyageDef`
  waypoints accordingly. "South-west along the coast" is fine as a caption.
- **The Echo herd** in Sarnai's raid needs the same NPC treatment as 3.7. "Thirty horses" in the Echo is a staging
  load. Six to eight read as a herd at 320 x 180.
- **The sim's bot is generous.** It Surges whenever it can and Guards on every tell. A plain player still wins every
  level in about 18 actions with 0.2 to 0.6 fighters down. Grimvald is safe; if anything he is short for a plain
  player. That is acceptable on Story.

---

## 4. Claims checked

**Confirmed:**

- **The curve.** `xpBase 50` and exponent 1.6 (`config.ts:62`); objectives 25 and books 10 (`config.ts`
  `XP_PER_OBJECTIVE`, `XP_PER_BOOK`).
- **Battle limits.** `BATTLE_ACTIVE 4` (`config.ts:239`). `trivial: 3` is a colour band only, see 3.1.
- **Ambushes.** The ambush rule (`data/battles.ts:701`) and the encounter odds (`config.ts:47-48`). The ambush XP
  figures 450, 680, 480, 320 and 320 are correct.
- **Battle features.** `withdraws`, `onSurge`, `below`, `enter`/`enterText`, `bossChance`, `once` and `heavy` all
  exist (`engine/battle.ts:139-159, 225-262`). Phases run in order (3.3).
- **Two-era terrain.** `collidePresent` and `collideEcho` (`tiledMap.ts`). Zones must be walkable in both eras, with
  no NPC, door or solid object inside (`mapValidation.ts:194-208`). Anchors are Echo objects that set `anchor.*`, read
  in the present (`mapValidation.ts:241-302`).
- **Echo flags.** `echo.*` flags are wiped on return; `clue.*` flags survive (`game.ts:419-424`).
- **Stage cues.** `place`, `enter`, `walk`, `exit`, `face`, `look`, `wait`, `sync`, and `fx: 'shake'` on lines
  (`stage.ts:23-39`; `dialogue.ts:28`).
- **Debates.** `DEBATE_MEDIATE_INFLUENCE 5`; `DEBATE_REWARDS` won 15 XP and mediated 25 XP; Provoke does not resolve
  a debate (`engine/debate.ts:77-79`).
- **Conditions.** Commas are AND and `|` is OR (`conditions.ts:57-63`).
- **Story difficulty** is the only difficulty (`config.ts:263`).
- **Chapter levels.** `CHAPTER_LEVELS` 6 is 15 to 17.
- **The realm map.** The Seat is at (68, 64), Skarragol at (91, 91) and Kuroshi at (66, 106): south-east, then
  south-west.
- **Grimvald's sim.** I re-ran the outline's script and reproduced every row of its table at x6, x7, x8/1.5 and
  x8/1.8, and every ambush row.

**Not confirmed or wrong:**

- the "Chapters 1 to 5 do not move" taper (3.1);
- the level arithmetic (3.1);
- "walkers walk objects" (3.7);
- "Bayarmaa as data, 0.2 days" (3.8);
- "both win" at the chosen scaling with Samira active (3.9);
- `onEcho` at zone 6 (3.2).

---

## 5. What is missing

- **A route test for the fjord in both eras.** It should prove five swaps, no dead end, the Echo scene playing and
  the herd states never trapping the player. The outline wants this (outline:863-865); make it part of day-1 step 3.
- **A recorded call on Se-5's token rule and on cross-currency counting** (3.6).
- **A recorded call on Azzy's maternal line** (3.5).
- **A battle test** that asserts Grimvald's "standard broken" text appears in every won fight (after fix 3.3).
- **A plan for who fights after this chapter** (3.9).
- **Hint text for the camp.** The outline gives hints for the crossing. Make sure a player who walks into a lookout
  first is told that the whistle was the other way, so the stealth reward (`story.herd_unseen`) is understood rather
  than missed.

---

## 6. Recommended changes (build order)

1. **Levels (central session, day 1).** Correct the table (3.1). Measure Chapter 5's played end. Choose an ambush rule
   relative to the party's level, or a band table that starts at 15. Record it in `COMBAT.md` as a Claude's call and
   name it in the owner's milestone note (no pop-up). Cut the chapter's fixed XP as listed. Re-run `level-curve.ts`
   for Chapters 3 to 6.
2. **The fjord** (3.2). Add an Echo-era step trigger for Sarnai's raid on the far shore, plus a five-swap route test.
3. **Grimvald** (3.3). Make phase 3 `{ below: 0.25, onSurge: true }`. Rewrite the horse and standard staging so the
   fight and the scene after it agree. Add a test that the beat always fires.
4. **The season** (3.4). Set the present at the edge of the freeze. Rewrite Bayarmaa's dawn line and Torvald's "the
   ice took" line so they agree with the Echo.
5. **Azzy's envoy** (3.5). Make him from Skarragol's own royal line with no separate ordu, with "his mother's name"
   and one Ironvow acknowledgement. Record it as a Claude's call.
6. **The price** (3.6). Settle Se-5's token rule, cross-currency counting at half, and the Journal text about the
   Exposed route's 60%.
7. **The herd** (3.7). Use 6 to 8 distinct NPC horses, in the present and the Echo.
8. **Followers** (3.8). Budget Bayarmaa's follower code. Choose whether Salkhi is a flag placement or a follower
   (I recommend flag placements). Cut or budget the fur recolour.
9. **Who fights** (3.9). Add an active-order flag, or document the bench.
10. **Anissa** (3.10). Move Salkhi's fur line off Anissa's beat.
11. **Smaller points** (3.11). Make the dusk a condition; make the receipt an unsigned voucher; set the voyage
    waypoints from the south coast.

**Owner questions:** none required. If the build chooses to make Azzy and Bayarmaa kin, ask that one question as a
pop-up, with the recommendation "no, his mother's people are Ironvow's eastern clans" first.
