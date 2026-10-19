# Second review: the Game Over outline (Oct 19)

Reviewed: `docs/quest/reviews/2026-10-19-game-over-outline.md`. Checked against the code in `quest/src` and
`quest/tests/smoke.mjs`, and against `docs/quest/ART-PROMPTS.md`, `design/STORY.md` and `design/COMBAT.md`.
Nothing was changed except this file. Paths below are inside `/home/user/Elodie-game/`.

---

## 1. Verdict

**Sound plan, approve with changes.** The core idea is true: a lost fight changes nothing in the saved game, so
"carry on from before the fight" is cheap. The two traps the outline found are real. But the outline is wrong or
silent in five places that would cause bugs or break the owner's own rules:

1. The "step back" it relies on has **nothing to build on**: the game never records where the player stood before
   a step, and the reload hole it describes **already exists today** and is not fixed by its plan.
2. The goddess is called **"Elodie"**, which is also the name of **Gianna's living mother**, who already speaks in the game.
3. The Rael "meant to be lost" fight has **no rule for the party winning**, and the round-cap idea fits his fight badly.
4. The smoke test's statement "the Act I route is unchanged" is **not safe**: the test can already lose a fight by accident.
5. The 4-second auto-advance and a few details are weak on accessibility and on "show, don't tell".

---

## 2. Where I agree

- **Resume from memory, not by reloading the save.** Right. Reload would also bring back the stale "after the fight"
  marker (trap 2 below).
- **A loss really costs nothing.** Verified. Items are only taken from the bag in `settleBattle`
  (`quest/src/engine/battle.ts:949-955`), and `settleBattle` is only called from `win()`
  (`quest/src/scenes/BattleScene.ts:450`), never from `lose()` (`:460`). Gold, XP, drops and the "won" flag come
  after the `outcome !== 'won'` check.
- **Nothing carries over inside a fight.** Every try builds a brand new `Battle` from the saved stats
  (`BattleScene.ts:214-232`), so HP, SP, Spark/Surge, cooldowns and status effects always start fresh. The battle
  scene writes to no flags during a fight (its only flag access is reading in `begin`, `:215-216`, and the settle
  on a win, `:450`).
- **The follower and staged actors are fine.** Staged walkers are only pictures and are cleared when the dialogue
  ends (`FieldScene.ts:1670`, `:1713`, before the battle starts at `:534-541`). Map foes come back from flags via
  the `sync` that `afterBattle` already does (`:552`).
- **Random fights:** `wildSteps` is plain memory and is set to 0 when an ambush rolls (`game.ts:247`), so the 18
  safe steps are true.
- **Keep the Grudge, per fight and saved.** Sound. The old Grudge only lived inside one run of the fight
  (`Battle.retry`, `battle.ts:591-594`); with the player now leaving the fight, it has to be saved or the safety net
  disappears. Flags can hold numbers, so no save-format change (`save.ts`: `SAVE_VERSION = 2`, flags are free-form).
- **Question 1 (may she speak?) is exactly the right one** and the outline is correct that it is a written rule.
- Placeholder art plus one entry in `assets.config.ts`, music in `audio.config.ts`, timings in `config.ts`, and a
  pure `engine/gameOver.ts` with tests all fit the owner rules.

---

## 3. Disagreements and risks, most serious first

### 3.1 The "step back" has nothing to stand on, and the boar can already be skipped on reload

- The outline says the party is "moved one step back the way they came". But the game **never stores the previous
  tile**. `finishStep` simply sets the position to the new tile and then fires the trigger
  (`quest/src/engine/game.ts:206-224`), and the save holds only the current tile (`quest/src/engine/state.ts:36-47`).
  So "the tile behind" has to be invented, and in a staged scene or a door arrival there is no "behind".
- The boar trigger is a line at x=9 from y=1 to y=24 that fires on landing (`quest/tools/maps/zetwal-road.ts:52-55`,
  `game.ts:222-225`). The autosave is taken at the fight start with the player **standing on that line**.
  So today, **close the game mid-boar-fight and reopen**: you stand on x=9 and can walk east to x=10 without ever
  triggering the boar. The outline's section 1 ("every story fight already has a way back in, written for reload")
  and section 5 ("Reopening puts the party at the autosave, as a mid-fight reload does today") both assume this
  works. For the boar it does not.
- The outline's own trap (standing on the line after Rise) is therefore real, **and the same hole exists for every
  quit-during-fight**, including "closing the app during the Game Over screen", which the outline says is safe.
- **Fix that covers both:** when a trigger starts a fight, remember the tile the player came from (as a saved flag
  string such as `fight.return = "8,12"`, so no save-format change), and let both Rise and a reload use it. Do the
  step back and clear the marker **before** the Game Over count is saved, or that save will keep the player on the
  line (the outline says the count is saved "the moment the screen opens").
- Other detail the step back needs: the open-tile check must use the right era's map and the puzzle objects that
  open or close tiles (`world.ts:39-40`), and the player sprite and both followers must be re-placed on screen
  (restarting the field scene, as a map change does, `FieldScene.ts:690-693`, is the simplest way).
- A fight that starts when you enter a map (an `onEnter` trigger, `game.ts:259-264`) has no tile "behind" at all, because
  the previous tile is on another map. The outline's "stay put" is fine only if that trigger can fire again or the foe stands
  on the map. The content test must check that case too.

### 3.2 The goddess's name is also Gianna's mother's name

- `quest/src/data/speakers.ts:20` defines the speaker `elodie`, and she is a **person who talks in the game**:
  `quest/src/data/dialogue/zetwal.ts:90-128` ("People of Zetwal... Tomorrow I leave for the Throne"). STORY.md calls
  Elodie "Zetwal's envoy" and "Rael's secret wife" (`design/STORY.md:293`, `:349`, `:357`). The goddess is also
  Elodie (`ART-PROMPTS.md:35`).
- A Game Over screen where "Elodie" talks, and a toast or label that says "Elodie", will read to a player as
  **Gianna's mother** talking. In Chapter 3 that is a plot spoiler and a confusion (the mother is "missing").
- The outline never mentions it. Question 1 should include it. My suggestion: the screen never writes her name; she
  is "the goddess" or "the Weaver" in the code, in the files, and in the Journal, and she signs herself only in the
  lines ("I am the one who remembers").

### 3.3 The Rael fight: no rule for winning, and a round cap is the wrong tool

- STORY.md says Rael **wins** the Trial of Blades as "a scripted loss" (`design/STORY.md:299-303`), and COMBAT.md
  gives him the **Bound** rule: members at 0 HP are Bound, he is "defeated, not killed" (`design/COMBAT.md:471`).
  That is a different loss condition from "everyone is down".
- The outline's answer is a **round cap** (`config.ts`). That has two holes: (a) a strong player can still reduce
  Rael to 0 HP before the cap; nothing says what happens (he must not "die" or "lose" and break the story);
  (b) a cap makes the player play 10 or more pointless rounds, which is the opposite of a fight "you are meant to
  lose" feeling fair.
- Better: the battle entry says "meant to be lost" and names **a story moment that ends it** (for example the first
  time two members are Bound, or Rael reaching his second phase), plus "Rael cannot drop below 1 HP". The party
  falling and that moment lead to the same scene. Keep the round cap only as a backup.
- The "meant to be lost" mark must also decide: **what does the party keep?** Win-style XP/gold? Nothing? And the
  outline's own mention of the Grudge is fine (none), but a test should also prove such a fight can never produce
  the `.won` flag, because other things read it (`battle.ts:962`).
- This is Chapter 3 work, so under the owner's gate (`CLAUDE.md`, "Chapter gate") only the mark and its tests may be
  built now. The outline already says so. Good.

### 3.4 The smoke test claim "the Act I route is unchanged (it wins every fight)" is false as written

- `quest/tests/smoke.mjs:690` says: "A lost fight starts again with a Grudge (never a game over), so a boss may take
  two tries." The bot can already lose, because each battle's random seed is the clock (`BattleScene.ts:150`,
  `this.seed = Date.now()`).
- Today a loss is silent and the loop in `fightBattle` / `fightBoar` carries on. With Game Over, an accidental
  loss would leave the bot stuck at the new screen until a 20-second timeout, a flaky failure.
- Needed: the smoke helpers must press Rise when they see the Game Over screen, walk back in and fight again, and
  say so in the log (or fail loudly if it happens more than once). Add this to the plan; it also needs the new
  screen to appear in `window.__quest.snapshot()`.

### 3.5 Details that would surprise the player or the builder

- **Tutorial pages replay.** The outline says the opening pages are skipped on a second try, but the battle scene
  is rebuilt each time (`BattleScene.ts:164-185`, `lessonsSeen = new Set()`), so the **in-fight lessons** (Spark,
  heavy-blow warning, weapon moves) would also show again, and the after-win pages. Store "lessons seen" as a flag
  or the Rise would re-teach the whole fight.
- **"Story flags as before the fight" hides a catch.** The dialogue that starts a fight sets flags *first* (for
  example `story.crown_attack`, `data/dialogue/xaragua.ts:295`). That flag turns the whole village into its
  occupied state (`audio.config.ts:73`, `tools/maps/xaragua.ts:29-30`, `:408`, `:494`) and closes a side quest
  (`sideQuests.ts:137`). So after a lost caney fight the player is "free to walk around and buy" in a town that has
  already switched to war. That is probably right for the story, but the owner should know "walk around" means
  the war version, and the shops there must still be reachable. The outline only notes the night escape. A content
  check of "can the player reach a shop from each fight's Rise point?" is worth adding, or the owner's sentence
  ("buy things for your build") will not be true for some fights.
- **Gianna's line is removed.** Today she says "Again. For them." and Anissa cries out
  (`BattleScene.ts:462`). The outline keeps Anissa's line but drops Gianna's. After the goddess, a short moment on
  the map (Anissa takes Gianna's hand; Gianna says one line) would show the recovery instead of a toast
  "Back before the fight. Grudge: +10%". Owner rule: shown, not told (`CLAUDE.md`).
- **The Grudge for random fights is nearly meaningless** because the next ambush is a random group again, and the
  outline keys losses by group. Fine, but say so, and it is another reason Question 3 matters.
- Lost debates (`engine/debate.ts:137-143`) and failed rhythm locks (`data/rhythms.ts:28`) are not battles and must
  not show Game Over. The outline never says so; add one line, and a test, so nobody wires them in by mistake.
- The outline lists three Chapter 2 story fights in section 1 and "four Chapter 2 fights" in section 5, but the
  code has five fights started from conversations (boar, pier, caney, patrol, Thorne). All five do have a way back
  in (`patrol_again` exists at `xaragua.ts:416`), so no bug, but the doc should be exact.

### 3.6 Her voice and accessibility

- **What ART-PROMPTS says, exactly** (`ART-PROMPTS.md:35-37`): "Elodie is never shown with a full face... She wove
  the realm and remembers everything; she does not rule. No sprite or dialogue portrait: **she never speaks**."
  The outline quotes this correctly in Question 1. Everything else about her in the files is narration (the intro
  line "She does not rule it. She remembers", `design/STORY.md:59`). So this screen would be the **first time she
  speaks**; that is a real change and the owner must say yes first. Her lines fit the established idea (she
  remembers, she does not rule) well, and "no name box, no portrait, no blips" matches the rule's spirit.
- **Tone:** "the first time I have **caught** you falling" sounds like a guard catching a thief, which is the
  opposite of "never scolding". Suggest "I have watched you fall {n} times" / "This is the first time I have
  watched you fall." Also, "give you back the moment before" is the actual gift, so it could come before the count
  line and not after.
- **Auto-advance after 4 seconds** is a problem for a slow reader or someone who needs more time (a child, a
  dyslexic player, someone playing one-handed). Make it tap-only by default, with auto-advance only if the owner
  wants it, and never faster than the player's text speed setting.
- **Skip is good** (B jumps to the last screen with the count). Check that on a phone the Skip button is separate
  from "tap anywhere advances", or a tap to read can skip by accident. The tap-during-fade being ignored is the
  right call, but note the intro does it differently (the intro ignores A during the film and only B skips,
  `engine/intro.ts:41-51`), so the outline's "like the intro" is only partly true.
- **Reduced motion:** the game has no code that reads `prefers-reduced-motion` yet (only one CSS rule,
  `style.css:410`), so "if the device asks for reduced motion" needs a new small helper in the scene, not only a flag.
- **Flashes:** the plain gold flash on Rise is brief and soft, so it is fine; keep it away from red/white strobing.
- **Only one button ("Rise")** means a player who wants to fight again at once has to walk or talk to the foe.
  That is the owner's own design, so fine, but it is a silent decision; mention it.

---

## 4. Claims checked

| Claim in the outline | Result |
|---|---|
| A lost fight changes no HP/items/gold/XP | **True** (`battle.ts:949-955`, `BattleScene.ts:450-470`). |
| Items eaten in a lost fight are not lost | **True**, they are only removed on a win. |
| Every conversation ends with an autosave taken as the fight begins | **True** for NPC talks and triggers (`game.ts:278-282`, `:533-537`); for random ambushes also (`:252`). `battle.next` is cleared before the save is handled (`:545-548`), so a reload after a **random** ambush simply loses that ambush (free escape, existing). |
| "Way back in" exists for all story fights | **True** for the five (boar trigger, pier sergeant, caney marine, patrol sergeant, Thorne). **But** the boar's way is skippable after a reload/stay-on-line (3.1). |
| Trap 1: boar line fires again / can be walked past | **Real**, and worse than described: it exists today on reload. |
| Trap 2: leftover `battle.after` plays at the next win | **Real.** `battle.after` is set by the starting dialogue and saved (`xaragua.ts:97`, `:295`); `battleOver` clears it only on a field-mode return (`game.ts:484-490`). A reload mid-fight then any win (even a random one) plays e.g. the pier scene. |
| "Clear it on load" fixes this | **True**, safe, because `battle.next` is already empty when saved. |
| Staged actors are cleared | **True** (`FieldScene.ts:1670`, `:1713`). |
| Hard-mode retry limit and Retreat were never built | **True** (no `HARD_MAX_RETRIES` anywhere; `COMBAT.md:411-412` only). |
| Grudge numbers in `config.ts` | **True** (`config.ts:213-214`). |
| Count in flags needs no save-format change | **True** (`save.ts` flag values may be numbers). |
| Echo: "back in the Echo at the same spot" | **Plausible, untested.** No Echo fights exist; ambushes are present-only (`game.ts:231-232`). The step-back check must use the Echo grid. |
| The Act I route is unchanged | **Not safe** (3.4). |
| Debate and rhythm lock | Not fights; excluded by nature, but unstated. |
| Question 1 quotes ART-PROMPTS | **Accurate.** |

---

## 5. Missing from the outline

1. The name clash with Gianna's mother (3.2) and what to call the goddess in files.
2. Winning the "meant to be lost" fight; the Bound loss rule from COMBAT.md (3.3).
3. A recorded "where to return to" that also repairs the existing reload hole (3.1), and the order of step back,
   marker clearing and save.
4. Lessons that replay after Rise (3.5).
5. Smoke-test handling of an accidental loss (3.4).
6. Re-placing the player and followers on screen after a step back.
7. A check that a shop is reachable from each Rise point (3.5), and which fights have none.
8. A note that debates and rhythm locks never show Game Over.
9. COMBAT.md section 12 and the "Heir Rises" lines are mentioned for rewrite, but `design/STORY.md:299-303` and
   `ART-PROMPTS.md:37` also need the new rules (the outline lists only ART-PROMPTS and STORY for Rael).
10. Whether the count is per save or per device (the outline chose per save and a save code carries it; that is
    reasonable but is the owner's to confirm).

## 6. What the outline decides silently (owner should know)

- She speaks and shows text on this screen (asked as Q1).
- Per-save count, saved immediately; a Journal "Times fallen" page is left out.
- Auto-advance after 4 seconds (I recommend removing it).
- One "Rise" button, no "fight again now" shortcut.
- The Grudge cap stays at +30% and wins clear it.
- A round cap ends meant-to-lose fights.
- Random-fight Game Overs count toward the number she says (asked as Q3).
- The tutorial pages are skipped on the second try.
- The party returns to the war-state town in Chapter 2.

**Are its three questions the right ones?** Yes, but incomplete. Q1 (may she speak) and Q3 (do random fights count)
are right. Q2 (keep the Grudge) is right because the owner replaced the instant restart. Add a fourth, short one:
**"What do we call her on this screen, since 'Elodie' is also Gianna's mother?"** Everything else can be decided
by the builder and reported.

**Is keeping the Grudge sound with the new flow?** Yes, and now more necessary, as long as it is saved per fight and
shown at the start of the fight ("Grudge +20%") so the help is visible. Note that it can only help the *same* fight
(not a random group), and it should be cleared on a win, as the outline says.

---

## 7. Recommended changes

1. Store a "fight return tile" flag when a trigger starts a fight; use it for Rise **and** for loading, so the boar
   cannot be skipped. Do the step back, clear `battle.after`, then save. (3.1)
2. Never print or file the goddess as "Elodie" on this screen; ask the owner (new Q4). (3.2)
3. For meant-to-lose fights: end them with a named story moment, make the boss unable to be dropped below 1 HP, keep
   the round cap only as a backup, and test that none can set a `.won` flag. (3.3)
4. Put smoke-test handling of an accidental Game Over in the plan. (3.4)
5. Keep in-fight lessons from replaying, using a saved flag. (3.5)
6. Soften the first line ("watched you fall" in place of "caught"); remove the 4-second auto-advance, or make it an
   option that follows the text-speed setting. (3.6)
7. Replace the "Back before the fight" toast with a short moment on the map (Anissa and Gianna react), so it is shown,
   not told. (3.5)
8. Add a content test that a shop is reachable from each fight's return point, and that debates and rhythm locks
   never reach the screen.
9. Fix the fight counts in the outline (five conversation-started fights) and the "like the intro" wording.
10. Treat the Hard-mode rewrite of COMBAT.md section 12 as part of step 1 of the build plan, and also update
    `design/STORY.md:299-303` and `ART-PROMPTS.md:37`.

Nothing here changes the owner's request; it makes the promise ("you continue from before the fight") actually true
for the boar, and keeps the goddess's first words from being mistaken for Gianna's mother's.
