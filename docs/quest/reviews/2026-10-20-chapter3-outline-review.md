# Chapter 3 (Ardencia, the Trial of Blades) outline: independent review (Oct 21)

*Second review of `docs/quest/reviews/2026-10-20-chapter3-outline.md` (636 lines), including its settled "Owner
decisions" (the winner's question; Rael carries La Promesa de Benny). I read the outline whole and checked its claims
against the built game at `HEAD` (`quest/src`, `quest/tests`) and the design docs (`STORY.md`, `COMBAT.md`,
`SECRET-ITEMS.md`, `SIDE-QUESTS.md`, `CAPITALS.md`, `QUEST-BUILD-GUIDE.md`, `PLAN-ALL-CHAPTERS.md`, the Opus plan
review, the Game Over review). Outline line numbers are given as `outline:N`. No other file was edited. Nothing
was run; the balance numbers below are hand calculations from the game's own formulas and are labelled as such.*

---

## 1. Verdict

**Build it, after six fixes.** The shape is right: the chapter plays as a story (gate, Azzy, a day in the city, the
trial, the reveal, the cell, Azzy's distraction, the tunnel, the camp). Most story moments are acted out with cue
types that already exist. The scripted-loss plan builds on the right parts of the engine. The Chapter 4 lead
(*Benny's Refusal* naming the Dorini) is a good fix for open question 12.

Six things must change before building. In order of seriousness:

1. **The family tree conflicts with built text, and the outline doesn't flag it.** The built Chapter 2 ending makes
   Rael Benny's **grandson**. The guide (locked) and this outline make him Benny's **son**. (Section 3.1.)
2. **The reveal's token history contradicts the built lore.** "He made two... one half for the man she married"
   turns the Accord token into a wedding token. The built book and the guide say otherwise. (Section 3.2.)
3. **The trial's numbers don't fit the engine.** Rael at x9 HP with a two-fighter party means the
   La Promesa floor, the reason for owner decision 2, will almost never be seen. Most players will grind up to 14
   of Rael's turns or be Bound. This is the "pointless rounds" problem the Game Over review warned about. (3.3.)
4. **Engine work is missing from the 10-day estimate.** The plan treats Stunned and enemy moves that put statuses
   on the party as already built. They are not, and neither is a boss ATK scale. The timed musket run and the
   cart-follow are new systems too. The honest total is about 12 to 13 builder-days, and nothing is built yet on
   Oct 21. (3.4.)
5. **Two owner-adopted plan items are dropped without saying so.** Free Brasador's price (part of the economy
   foundation the owner chose to build first) and Rael's redesigned *Seize* (in the plan's per-chapter minimum).
   (3.5.)
6. **Saving and soft-lock gaps.** Closing the app during the reveal sends the player back to refight Rael. Nothing
   says what brings Azzy to the cell, or whether the Echo lets the party walk out of the cell before he comes.
   (3.6, 3.7.)

None of these needs the owner except, arguably, 2 (it changes what the token *is*). I recommend a fix below that
keeps the built lore, so it can stay Claude's call.

---

## 2. What I agree with

- **The winner's question with the court cleared** (`outline:121-139`). It keeps Rael's reason for secrecy: the
  envoy never hears it. It also fits the guide's rule that the signet glows at public lies, not private truths
  (`QUEST-BUILD-GUIDE.md:337`). "Ardencia does not separate children" without a glow is a lovely touch.
- **The scripted loss builds on what exists.** `meantToLose` already routes a loss to the scene with no goddess,
  count or Grudge (`gameOver.ts:57-58`, `BattleScene.ts:494-505`). A win sets no won flag (`battle.ts:972`). The
  field plays the scene either way (`game.ts:499-509`). The outline's claim that `settleBattle` runs only on a win
  is correct: only `win()` calls it (`BattleScene.ts:477-480`).
- **There is no way back into the trial, and the test allows it.** The "way back in" content test skips fights
  meant to be lost (`gameOver.test.ts:427`). One existing test must change: `gameOver.test.ts:127` asserts that
  no fight is marked `meantToLose` (the outline notes this indirectly).
- **The level arithmetic checks out** (`config.ts:62-63`, `rpg.ts:259-262`). Level 9 needs 1,393 XP, level 10
  1,682, level 11 1,991. The route's running totals land where the outline says. Rael at 13 against a level-10
  party is "hard" (orange), not "deadly" (bands in `config.ts`).
- **Azzy joins in the dark, at the tunnel mouth** (`outline:172-175`). It satisfies the owner's "Azzy makes a
  distraction", and his father's order on the wall then costs him something he has already chosen. Good.
- **No damage from the musket shots** (`outline:185-187`). Right call: the run is a story moment.
- **Ar-1 without a stealth fail** (`outline:395-397`). This is honest: there is no sight system.
- **Ar-2 carries *Benny's Refusal*.** It gives the required side quest a reason to be required and makes Chapter 4
  need no new way in.
- **The voyage instead of overland travel, with Patricio's "east" line corrected** (`outline:32-37`). The voyages
  already sail "north, around the cliffs of Ardencia" (`voyages.ts:24`, `:47`).
- **Staging:** almost every moment uses the built cues (`place`, `enter`, `walk`, `exit`, `face`, `look`, `wait`,
  `sync`: `stage.ts:25-39`) plus line `fx` (`dialogue.ts:27-28`). The token glow as a new `fx` is the right size.

---

## 3. Disagreements and risks, most serious first

### 3.1 The family tree: Rael is Benny's son in the outline and grandson in the built game

- Built Chapter 2 ending (`quest/src/data/dialogue/zetwal.ts:970-974`): "Benny's **grandson** rules Ardencia now.
  Lord Rael." / "Ask him to stand with Xaraguá, as his **grandfather** did." / "Then ask him why his
  **grandfather** said yes." The same appears in `STORY.md:218`.
- The guide says Benny is "Rael's father; grandfather of Gianna **and** Azzy" (locked: `QUEST-BUILD-GUIDE.md:24`,
  `:163`, `:186`). `SECRET-ITEMS.md:149` ("before your father was born") and `:168` agree with the guide.
- The outline follows the guide: Azzy calls *Benny's Refusal* "his grandfather's" (`outline:212`), and La Promesa
  is "worn by the son" (`outline:288-289`). But it quotes the built "as his grandfather did" lines verbatim at
  `outline:24-26` without noticing the clash.
- **Why it matters:** the chapter's first line about Rael on screen, and Patricio's parting question, would
  contradict the reveal and every later Benny scene. Under CLAUDE.md ("if two sections conflict, stop and flag
  it"), this has to be flagged, not inherited.
- **Fix (a builder's fix, since the guide marks this locked):** change `zetwal.ts:970-974` to "Benny's son" / "as
  his father did" / "why his father said yes", and fix `STORY.md:218` to match. Port the change to the demo. Add
  this to the outline's "one line to fix" (`outline:32`), which becomes three lines.
- **Update (Oct 21):** the owner has now settled it: Rael is Benny's son (`STORY.md:581`), and STORY.md's old line
  is corrected. **The built dialogue still says "grandson" and "grandfather"** (`zetwal.ts:970-974`, checked
  Oct 21), so the code fix above is still needed.

### 3.2 The reveal's token history contradicts the built lore

- Built book (`books.ts:55`): "On the last night the Marshal and Lord Benny sealed their alliance with a token in
  two halves. A sun locket for Zetwal, a signet for Ardencia." The guide's background agrees
  (`QUEST-BUILD-GUIDE.md:130`), and so does the guide's reveal: "Her Sun Locket (made by **Patricio**) and his
  Brasador signet (made by **Benny**) are the two halves of the token that Elodie and Rael once exchanged"
  (`:244`).
- The outline has Gianna say "My grandfather made it, the year of the Accord" and Rael answer "**He made two.**
  One half for Patricio's daughter. One half for the man she married" (`outline:127-131`). That makes Patricio
  the maker of both halves and the token a wedding gift. Both contradict the book and the guide.
- **It also weakens the proof.** If the halves are the Accord token, any Lord of Ardencia wearing Benny's signet
  makes them glow, so the glow proves nothing about fatherhood. The truth has to come from Rael's words, with the
  glow showing the two families' bond.
- **Fix, keeping owner decision 1 as written:** Gianna: "My grandmother. Grandfather made it, for the Accord."
  Rael: "And mine made this one." (Both glow.) "Fifty years later, Patricio's daughter and Benny's son put them
  together again. Look at me, Gianna Elise." Then the four sentences as written. This keeps the built lore, the
  guide's "exchanged" proposal and the owner's decision.
- **Smaller points in the same scene:**
  - The guide's tell is a "half-sun signet... gold signet ring" (`QUEST-BUILD-GUIDE.md:334`, `:356`). The outline
    says "iron signet" (`outline:128`), and young Benny says "Your sun and my iron" (`outline:226`). Pick one
    before Rael's art prompt is written.
  - The flag `story.signet_glowed` already exists and turns on the Sun Locket's lore line ("Near its other half,
    the Brasador signet, both halves glow": `rpg.ts:30-31`). The reveal should set it. The outline doesn't name
    it.
  - **Anissa at the lie.** She "sees light" and says so when the halves glow (`outline:130`). Minutes later the
    signet glows at the lie and she is silent (`outline:137-138`). Either give a shown reason (her face is in
    Gianna's shoulder; staged), or let her say "His ring lit again, Gigi" and have Gianna not hear it. Otherwise
    players will read it as a writing slip. The design wants the player, not Gianna, to hold this clue
    (`QUEST-BUILD-GUIDE.md:247`).
  - Beat 5's title and the Journal note still say **"The loser's question"** (`outline:115`, `:145`). After owner
    decision 1 it is the winner's question.

### 3.3 The trial's numbers: the floor will almost never be reached, and the cap is a grind

- **The trial has two fighters.** Anissa is support, not a combatant (`battle.ts:16`, `:902-925`). The party at
  noon is Gianna and Yari, both back row. "Every fighter Bound" therefore means two people.
- **There is no `BOSS_SCALE` in the game.** It exists only in the design (`COMBAT.md:507`). The engine has a
  per-enemy `hpScale` (`battle.ts:166`, used by the boar) and no ATK scale (`EnemyDef`, `battle.ts:155-167`).
  Chapter 2's boss, Thorne, is built at x1 HP (`battles.ts:212-224`). Rael at x9 HP is a 9-fold jump over the
  last boss the player beat.
- **Rough numbers (hand-calculated, Story difficulty is the only one built: `config.ts:219`):**
  - Rael, level-13 tank x9 x0.8: about **1,390 HP**.
  - Gianna (level 10, MAG about 32-36): Sunthread does about 40 per cast.
  - Yari (ATK about 30-36): averages about 29 per action over her move cycle.
  - Speeds (`turnDelay`): per Rael turn, Gianna gets about 1.1 turns and Yari about 1.4.
  - Over the 14-turn cap, a party that **never heals, never guards and is never Bound** deals roughly 1,300 to
    1,450. In practice Rael's sword (about 26 per hit after Story's 0.7) plus two Halberdiers from phase 2 force
    heals.
- **So:** the floor, and with it *La Promesa de Benny glows. Rael stands.*, is the rare ending, not the common
  one. The outline's Claude's call "the floor is reachable" (`outline:530-532`) is unlikely to hold. The owner's
  decision 2 rests on the item being seen on screen. A party that heals and guards (the right play) instead gets
  up to 14 of Rael's turns, about 35 party actions, roughly 8 to 12 minutes on a phone, before *Cenizas*. The Game
  Over review warned that a cap "makes the player play 10 or more pointless rounds"
  (`2026-10-19-game-over-outline-review.md:94-100`).
- **Fix:**
  - Give Rael `hpScale` about **3 to 4** (about 470 to 620 Story HP). Most parties then reach phase 3, and a
    good one reaches the floor.
  - Make the main ending a **story moment, not the cap**: after *Reinado de Cenizas* resolves, Rael ends it at
    the first of (a) all Bound, (b) the floor, or (c) **three of his turns after Reinado**.
  - Keep `RAEL_TRIAL_MAX_ROUNDS` only as a backstop for a stall in phases 1 and 2.
  - Simulator target: the median party sees Reinado, and at least a third of seeded runs reach the floor.
  - If the ATK multiplier is wanted, it is a new field (`atkScale`), so cost it.
- **Edge cases the engine must handle** (none are in the outline):
  - **Multi-hit attacks after the floor holds.** Volley hits 3 times and Hurricane Volley 5 times in one action
    (`battles.ts:68`, `:95`). The floor must clamp every remaining hit of that action, plus any Surge splash, and
    the finale must start before any other actor moves.
  - **Area attacks must skip Bound fighters.** Reinado and any Charter-like `area` move (`battle.ts:151`)
    otherwise hit them.
  - **Healing a Bound fighter.** Heals skip downed targets today (`battle.ts:805`), so "any heal frees" is new
    code. Say what HP a freed fighter has: the healed amount, from 0.
  - **Bound is new to the Journal and Foes page.** Make sure the HP bar and the "falls!" event (`BattleScene.ts:445`)
    show BOUND, not "falls".
- **Spent items: I'd reverse this call.** Items drunk in the trial "are spent" (`outline:279`). The player does
  not know the fight is unwinnable. Losing potions to it feels like a penalty, and an ordinary Game Over spends
  nothing ("items, gold and XP only change on a win": `game.ts:513-516`). Keep the bag as it was (don't call
  `settleBattle` on the scripted end). One line, kinder, and consistent.

### 3.4 Engine work the estimate leaves out (honest effort)

The outline says "Stunned exists" (`outline:463`), but the built statuses are inspired, weakened, marked, warded,
regen, slowed and taunting (`config.ts:171-183`). There is **no Stunned, Burning or Fogged**. Enemy moves also
**cannot apply any status**: `EnemyMove` has name, power, every, tell and area only (`battle.ts:144-153`). The
outline counts on these:

| Missing piece | Needed by | Honest extra |
|---|---|---|
| Enemy moves that apply statuses to the party | Rael's *La Marca*, *Grito*, Halberdier *Hook*, *Ember Spit*, *Screech* | 0.5 |
| New statuses: Stunned (skip a turn), Burning (damage over time), Fogged | Grito, Hook, Salamander, Bat; Azzy's Grito | 0.5 |
| Move sets per phase; a move whose power grows with Bound count | Rael phases 2 and 3 | (in the 1.5, but say so) |
| `atkScale` on enemies | "x1.2 ATK" | 0.1 |
| The musket run: shakes and dust puffs on a timer while the player walks | `outline:192-193` | 0.25-0.5 |
| The cart: a moving NPC on a fixed path that waits for the player, reacts if bumped, and has Azzy's "Not closer" by distance. Built walkers only animate a move between two placements (`walkers.ts:1-5`) | Ar-1 | 0.5 |
| The party kneeling with cords after the fight (player and followers as placed actors, cords as flag objects with `sync`) | Beat 5 | 0.25 |
| `SURGE_ANIM_STAGE` (named as existing at `outline:573`; it is not in the code) | Anissa's gesture | 0.25 or drop |
| The Chapter 2 text fix in 3.1 | continuity | 0.1 |

So the honest total is about **12 to 13 builder-days**, not 10. The Opus plan review said 7 to 9 before any of
this was known (`2026-10-20-plan-review-opus.md:93`). The calendar slot is Oct 20 to 24 (`PLAN-ALL-CHAPTERS.md:43`).
It is Oct 21, the foundations are still being built, and Chapter 2's side quests are mid-edit in the working tree.
**Realistically Chapter 3 lands about Oct 29 to 31, overlapping Chapter 4's slot (Oct 23 to 27).** The outline's
"say so now" risk (`outline:579-581`) is right but too soft. Say the date, and use the fallback (trial without
guards and phase 2's reinforcement entrance) as a plan, not an emergency.

### 3.5 Two owner-adopted plan items dropped without saying so

- **Free Brasador's price.** The outline: "Not needed for the release: allied groups and their prices... the pledge
  is a flag" (`outline:475-477`). But after the plan reviews the owner chose **foundations first, including "the
  realm's economy (ally prices, Yield, a record of the Accord's Stability inputs)"**, built *before* Chapter 3
  (`PLAN-ALL-CHAPTERS.md:96-99`). The review's per-chapter minimum, adopted as the working plan
  (`PLAN-ALL-CHAPTERS.md:106-109`), lists "Free Brasador's price" for Chapter 3
  (`plan-review-opus.md:238`). The outline contradicts an owner decision without recording it.
  - **Also unsolved:** where Fear 6 comes from. Ar-5 (+2 Fear) is deferred. Rael is never beaten, so the "+1 Fear
    per boss beaten" rule gives nothing (`COMBAT.md` 7.3). Fear in Ardencia stays at about 0 to 1 in this chapter.
  - **Fix:** register Free Brasador through the economy foundation as the first ally (Fear, price 6, owed, unpaid).
    Show the price in the Journal at the camp, and state that it is paid at the Muster (Chapter 10). If the
    foundation slips, say so as a recorded Claude's call.
- **Rael's *Seize*.** `COMBAT.md:513` gives Rael's phase 1 a move aimed at Anissa, and on Oct 20 the rule for such
  moves was set: *Seize*, where Gianna steps in, loses 3 Spark and is Marked (`COMBAT.md:218-222`, CLAUDE.md's
  Oct 20 rule). The plan review's Chapter 3 row names "Rael's three phases with Seize redesigned" as the work
  (`plan-review-opus.md:93`). The outline drops Seize from Rael's move list (`outline:270`) without mention.
  - **Fix: add it.** It is the strongest picture in the fight: the father reaches for his youngest, and the
    eldest steps between them. It fits phase 1's "He is looking at Anissa, not at you" (`outline:273`) and costs
    about 0.25 days. It also builds the rule once for the Hushed and the Regent, who need it.
- **A smaller rule change:** Bound is freed by "Gianna's Comfort" in the design (`COMBAT.md:381`). The outline
  changes this to "any heal" (`outline:272`). That's fine (Comfort isn't built), but record it as a Claude's call
  in COMBAT.md, since Chapter 11's Strike route reuses Bound.

### 3.6 Saving during and after the trial

- No save happens between the start of the trial and the end of `rael_after`. The scene's save comes after the
  dialogue closes (`game.ts:506`), and `story.trial_fought` is "set by the scene after" (`outline:113`). Closing the
  app anywhere in the trial, the reveal (about 25 lines) or the walk to the forge reloads at the court gate, and
  the player **fights Rael again**.
- **Fix:**
  - Set `story.trial_fought` and save the moment the scripted end fires, before `rael_after`.
  - Give the court a re-entry scene: if `story.trial_fought` is set and `story.forge_held` is not, place the party
    kneeling and continue from the question.
  - Add a smoke step that reloads mid-reveal.

### 3.7 Soft-lock and ordering gaps in the forge

- **What brings Azzy?** Beat 6 puts the party in the cell and lists the puzzle objectives (`outline:155-156`).
  Beat 7 starts with Azzy walking in (`outline:162`), but nothing says what triggers him: arrival, a wait, a talk.
  If it is a talk, with whom? Name the trigger. My suggestion: the staged walk into the hall ends with the
  captain's exit, and Azzy enters in the same scene after a `wait`, so the player is never in a cell with nothing
  to press.
- **Can the Echo bypass Azzy?** "The whole hall is a zone" (`outline:153`, `:437`), and the cell is inside the
  hall. If the barred gate does not exist in the Echo, the player can swap inside the cell, walk out in the past,
  set the gates and pull the lever, and skip the distraction. If the gate does exist in both eras, the zone has to
  start outside the bars. The map validator's "walkable in both eras" rule (`outline:251`) forces one answer, but
  the outline should state it: **the zone starts at the gate line, and the Echo is offered only after
  `story.azzy_key`** (or similar).
- **Leaving the Lower Town mid-cart.** The night variant "clears when Ar-1 ends" (`outline:352`). Say what happens
  if the player walks out through the gate halfway: the cart resets to the top of the lane, and the night stays
  until the quest ends.
- **Missables after the escape.** Cenizal shuts (`outline:197-198`), so unread books, *Ember Ward*, the smith's
  long sword for Azzy and the blackened armour (`outline:333-335`) become unreachable until Ar-4 after the
  release. That's acceptable, but have Azzy or Anissa say it once before noon ("Whatever you need from the smith,
  buy it today"), and put the trader or a Free Brasador quartermaster at the camp with the sword.

### 3.8 Smaller inconsistencies

- **Where the callback lives.** Section 2 puts young Benny's line "in the tunnel Echo" (`outline:224`). But the
  tunnel has no Echo (`outline:247`), and the lever scene is in the forge Echo (`outline:443-444`). It is the
  forge.
- **Mediate arithmetic.** It is reached with "Ar-2 +1, Ar-1 +1, three books +3" (`outline:96-97`, `:417`). But
  Ar-1 opens only after the debate (`outline:388`), so its +1 can't count. Before the debate the sources are Ar-2
  (+1), listening (+1, `DEBATE_LISTEN_INFLUENCE`) and books, so it is three books, not two quests and three books.
  The numbers still work; the text is wrong.
- **The bats' rewards.** The table says encounter pay is "10 XP and 4 gold per foe per level" (`config.ts:251`),
  but the bats pay 120 XP and 40 gold (`outline:309`). Under that rule, three level-10 bats would pay 300 XP and
  120 gold. Fine as a scripted fight, but say it is lower on purpose. The levels table counts 120.
- **"Rael's War Cry fails" on Azzy wearing La Promesa** (`outline:286`). After owner decision 2 the party gets the
  charm only in Chapter 11. Check that a War Cry fight still exists after that (the Strike route) or drop the
  clause.
- **One line that gives a lot away.** "Because of men like the one I just sent out of this court" (`outline:133`)
  tells the player he hides his family from the Crown, a minute before he hands them to it. I think it is a good
  clue for the player, and Gianna can read it as hypocrisy. Keep it, but note it in STORY.md's clue list (Rael's
  eight clues, `STORY.md:513`) so later chapters don't over-hint.

---

## 4. Claims checked

| Claim (outline) | Result |
|---|---|
| Chapter 2 ends on `zetwal-harbor`, spawn `harbor_return`, `zetwal_return` sets `story.ardencia_asked` and `act2.complete` (`:23-26`) | **True** (`zetwal.ts:955-974`; `chapters.json` entry 3) |
| Patricio's "Ardencia is east, past the Cane Road" (`:32`) | **True** (`zetwal.ts:976`); missed the "grandson/grandfather" lines four lines above (3.1) |
| Party level 8 at 1,315 XP, 402 gold (`:27-28`) | Gold 402 **true**; XP is shared plus rules, consistent with level 8 (not recomputed line by line) |
| XP curve 50 / 1.6; level 10 at 1,682, 11 at 1,991 (`:30-31`) | **True** (`config.ts:62-63`) |
| `meantToLose` built, no goddess/count/Grudge, scene after a loss or a win, no won flag (`:259-262`) | **True** (`gameOver.ts:41-61`, `battle.ts:972`, `BattleScene.ts:494-505`) |
| `settleBattle` only runs on a win (`:279`) | **True** (`BattleScene.ts:479`) |
| No Bound in `battle.ts` (`:263`) | **True** |
| `BOSS_SCALE` x9 / x1.2 (`:270`) | **Design only** (`COMBAT.md:507`); not in code; no ATK scale field |
| "Stunned exists" (`:463`) | **False** (`config.ts:171-183`) |
| "Marked exists" (`:463`) | True, but only for the party's skills; enemies cannot apply it (`battle.ts:144-153`) |
| Once-per-battle rule "must be checked" (`:463`) | **Exists** (`battle.ts:380`, Say Their Names `once: true`) |
| Yari follower hard-coded (`:464`) | **True** (`FieldScene.ts:172-173`, `:235-236`) |
| Azzy's walk sprite and portrait exist (`:463`) | Walk sprite **true** (`quest/art/characters/azzy.png`); portrait not checked |
| `BATTLE_ACTIVE` is 4 (`:463`) | **True** (`config.ts:195`) |
| Way-back-in test skips meant-to-lose fights (`:280`) | **True** (`gameOver.test.ts:427`); `:127` must change |
| `crown_consul` look for Cresswell (`:488`) | **True** (`assets.config.ts:320`) |
| `benny_young` look built (`:495`) | **True** (`assets.config.ts:426`) |
| `SURGE_ANIM_STAGE` (`:573`) | **Not in code** |
| Debate Mediate needs Influence 5 (`:417`) | **True** (`config.ts` `DEBATE_MEDIATE_INFLUENCE`); arithmetic off (3.8) |
| Ar-2 and Ar-1 rewards follow SIDE-QUESTS | **Changed**: Ar-2 XP 140→90 plus *Benny's Refusal*, Ar-1 XP 150→100 (said to fit the flatter curve; fine) |
| Benny joins the Echo party once Azzy has joined | **True** (`STORY.md:43`, `COMBAT.md:21`) |

---

## 5. What is missing

- The Chapter 2 text fix (3.1), and a decision on gold or iron for the signet (3.2).
- Setting `story.signet_glowed` at the reveal (3.2).
- Free Brasador through the economy foundation, and where its Fear comes from (3.5).
- *Seize* on Rael (3.5).
- A trigger for Azzy's arrival in the forge, and the Echo zone's edge (3.7).
- A save and a re-entry scene after the trial (3.6).
- The floor's handling of multi-hit and splash, area moves skipping Bound fighters, and freed-fighter HP (3.3).
- A fight-length target (minutes on a phone) for the simulator, beside "reaches the floor / all Bound".
- Yield on the chapter's ambushes. The foundation adds Yield, so say whether the Cinder Flats foes offer it (the
  "capture, not kill" Halberdiers are an obvious Spare).
- A line before noon that the city closes after the trial (3.7).
- STORY.md beats 5 to 8 rewritten (in the build plan, `outline:604-606`). Also add that Gianna kneels Bound, since
  her belief scene in Chapter 5 (Elodie's "He should never have tested you": `QUEST-BUILD-GUIDE.md:256`) now reads
  against a loss, not a win. That line still works, arguably better.

---

## 6. Recommended changes (in order)

1. Fix the built Chapter 2 lines and `STORY.md:218` so Rael is Benny's son, per the locked guide. Treat it as a
   builder's fix and record it.
2. Rewrite Rael's token lines so each grandfather made his own half for the Accord and the halves came together
   again in the marriage. Set `story.signet_glowed`. Settle gold or iron. Give Anissa a shown reason for silence
   at the lie, or let Gianna miss her line. Rename "the loser's question".
3. Retune the trial:
   - Rael `hpScale` about 3 to 4 (not x9).
   - The ending is the first of all Bound, the floor, or three of Rael's turns after Reinado; the round cap only
     backstops phases 1 and 2.
   - Add Seize in phase 1.
   - Don't spend items on the scripted end.
   - Clamp the floor for multi-hit and splash, and skip Bound fighters in area moves.
   - Simulator targets: Reinado seen by the median run, the floor in at least a third of runs, the fight under
     about 6 minutes.
4. Re-cost section 9 with the missing pieces in 3.4 (about 12 to 13 days). Say the realistic date (about Oct 29 to
   31) and plan the phase-2 fallback now.
5. Use the economy foundation for Free Brasador (Fear, price 6, owed), or record dropping it as a Claude's call
   against the owner's Oct 20 plan decision.
6. Save at the scripted end and add a re-entry scene for the reveal.
7. Name Azzy's trigger in the forge. Start the Echo zone at the gate line, offered after the key.
8. Fix the small inconsistencies in 3.8 (where the callback lives, Mediate arithmetic, bats' pay, the War Cry
   clause).
9. Add a "buy it today" line before noon, and a camp vendor with Azzy's long sword.

With these, the scripted loss is robust in all three ways it can end, the reveal is consistent with what is already
built, and the estimate is honest.

---

## 7. Addendum: the owner's Oct 21 direction ("the families are bigger", `STORY.md:579-613`)

**The direction:**
- Rael's royal guard is headed by **Azriel Rivera**, Rael's comrade from the Ash Wars and Azzy's namesake. Beside
  him is **Jaime**, a strong mage and Rael's advisor. Both are "very strong opponents" and fight beside Rael in the
  Trial.
- Rael is Benny's son.
- Rael has six siblings. Amanda, Zelia and Joaquin (Benny's children) may belong in Ardencia; their places are
  still being settled.
- Old Benny and his wife Nancy are in Ardencia.
- `docs/quest/design/FAMILY.md`, which STORY.md cites (`:613`), does not exist yet (checked Oct 21).

### 7.1 What it does to the Trial

**Who fights.** Rivera and Jaime replace the outline's two Brasador Halberdiers (`outline:271`, `:274`). The party
is still two fighters (Gianna and Yari; Anissa is not a combatant), now facing three strong foes. That shifts
everything in 3.3 further toward one ending.

**Balance.** With three strong foes, all-Bound becomes nearly the only ending, and the floor (La Promesa, owner
decision 2) is close to unreachable unless the fight is shaped around it. Jaime makes this worse in a specific way:
spells cut through only a quarter of DEF, against half for weapons (`battle.ts:695`), and an area spell (`area`,
`battle.ts:151`) reaches the back row where both fighters stand. A strong Jaime with an area spell Binds the party
in a few turns. My recommendation (Claude's call), so they read as very strong without ending the fight before
the story's moments:

- **They enter at phase 2 (66%), not at the start.** They walk in from the ring's edge using the
  reinforcement event the outline already needs. Phase 1 stays a one-on-one test, where Seize (3.5) and the "He is
  looking at Anissa" tell can land.
- **Strength shows through what they do, not raw damage:**
  - **Rivera, a tank, level about 13: *Shield the Lord*.** Most single-target hits aimed at Rael while Rivera
    stands go to him instead (a forced intercept). Plus *Hook* (Stunned). He is the wall.
  - **Jaime, a caster, level about 13:** a ward on Rael (damage taken x0.75, like `warded`), and one telegraphed
    area spell every few turns (a `tell`, so Guard answers it). No other area damage.
- **Rael's HP goes down further,** to `hpScale` about 2.5 to 3, because part of the party's damage now goes into
  Rivera and Jaime. The simulator targets in 3.3 still hold: the median run sees *Reinado*, at least a third reach
  the floor, under about 6 minutes.
- **They cannot "die" either.** Rivera recurs in any later chapter that has Rael's guard (Chapter 11 at least), and
  Jaime is Rael's advisor. At 0 HP each **steps back from the sand**: a new "withdraws" exit (a bow, a walk to the
  ring's edge) instead of the enemy "falls" fade (`BattleScene.ts:445-457`). Felling both is a real achievement and
  should get a line from Rael ("Stand back, Captain."), not a victory screen.
- **The scripted end needs no change:** all Bound, the floor, or three Rael turns after *Reinado*. When it fires
  while either of them is standing, *Cenizas* is still Rael's alone.

**New engine work this adds:**

| Piece | Days |
|---|---|
| Intercept or protect (*Shield the Lord*) | 0.25 |
| Enemy support moves (a ward on an ally). Enemy moves today are damage only (`battle.ts:144-153`) | 0.25 |
| The "withdraws" exit | 0.25 |

That is **about +0.75 days**, on top of the 12 to 13 in 3.4, so **about 13 to 14 days**.

**Staging (show, don't tell).** Both must be on the map before the fight, or their entrance in phase 2 means nothing:

- **Beat 2, the hall:** Rivera stands at the Lord's door. Jaime walks out of it with Cresswell (shown) and
  speaks one line to the chamberlain. Azzy, on the steps: "Captain Rivera. I was named for him. He was beside my
  father at Cendre." One line from Azzy, no lecture.
- **Merge roles: Rivera is the outline's "captain of the guard"** (`outline:491`). He stands by the Alcázar door at
  the trial (`outline:104`). "Captain. The forge fortress." (`outline:140`) is said to him, and he walks the party
  out. That is one look fewer and a real face for the order.
- **Beat 4:** Rivera and Jaime stand at the ring's edge, placed. The battle's phase-2 entrance is them walking in.
- **Beat 8, the wall:** Rivera beside Rael at the parapet, placed. When Rael gives the order, Rivera relays it.
  This makes "every shot wide" his men's work, a clue that pays off later without telling.

### 7.2 What it does to the outline's beats

- **Beat 5, clearing the court: does Rivera stay?** This is the one real story question. If Rivera stays while Rael
  tells Gianna, Rivera is inside the secret, and that touches the double game in Chapters 10 to 12. My call:
  **Rivera stays at the door, silent** (shown; he is the man who shuts it), and **Jaime leaves with the elders.**
  That keeps Jaime's loyalty open for later. Record it as Claude's call, and confirm it with the owner when the
  family placements are settled, since it shapes who knows what.
- **Two Azriels.** The reveal line "Azriel is your brother" (`outline:132`) now has another Azriel standing in the
  court. Use "Azzy is your brother", or have Rael look at Azzy as he says it. Speaker boxes must read "Rivera" and
  "Azzy", never "Azriel".
- **Benny and Nancy.** The outline keeps old Benny behind a locked door with a guard (`outline:227-228`), and this
  direction does not overturn that for the release. Cheap, shown hooks that decide nothing about where the family
  is met:
  - Nancy seen once at the window of the quiet rooms, or crossing the cloister with a basket, as the party walks
    to the court. No dialogue until the owner places her.
  - Old Benny's door guard: "The old lord and the lady see no one."
- **Amanda, Zelia, Joaquin.** Their places are not settled, so the Chapter 3 build should not write scenes for
  them. One hook is free and is already the owner's own wording: an Alcázar book or the records room shows the
  Ardencia record, "Alonso, Benny, Rael, Azriel, and no others recorded" (`STORY.md:596`). Ar-2's records-room
  Echo is the natural place. The player reads it now and understands it later, when an aunt or uncle turns up.
  Leave a placeholder NPC slot in `ardencia-alcazar` so a sibling can be dropped in without redrawing the map.
- **People table** (`outline:483-504`): add Rivera (a black-and-crimson captain with a scarred helm; an enemy
  sprite), Jaime (a mage's robe in Brasador red; an enemy sprite) and Nancy (placeholder). Remove the generic
  captain. Add Rivera's and Jaime's prompts to `ART-PROMPTS.md` with Rael's, for art drop 2.
- **Owner decision 2 is unaffected:** Rael still wears La Promesa. Rivera and Jaime need no floor of their own,
  because the "withdraws" exit covers them.
- **Effort and date:** about 13 to 14 builder-days in all. The realistic landing in 3.4 slips by a day or so, to
  about Oct 30 to Nov 1.

### 7.3 Changes to add to section 6

10. Rivera and Jaime join the Trial at phase 2, replacing the Halberdiers. Rivera intercepts hits on Rael; Jaime
    wards Rael and casts one telegraphed area spell. Both withdraw at 0 HP. Rael at `hpScale` about 2.5 to 3.
    Same simulator targets.
11. Introduce both in the hall (Beat 2). Rivera becomes the captain of the guard: he stands at the court, walks the
    party to the forge and relays the order on the wall.
12. Rivera stays (silent) for the reveal and Jaime leaves, as Claude's call, flagged for the owner with the family
    placements. Avoid a bare "Azriel" in the reveal.
13. Add the Ardencia-record line in the records room, Nancy as a seen presence only, and a free sibling slot in the
    Alcázar map. No sibling scenes until the owner places them.
