# Game Over with the goddess Elodie: outline (Oct 19)

The owner's request, word for word: "I also want there to be a game over screen if you lose any of the fights you are
supposed to win with the goddess of light in an animation telling you she will give you another chance so I need an
outline for that animation. She should let you continue to before you entered the fight so you can maybe walk around
and buy things for your build and she should mention how many game overs you have had."

This is a plan only. Nothing in the game has changed yet.

---

## 1. How losing works today (the honest starting point)

- When every fighter is down, Anissa cries "Gigi! Get up! Please!", Gianna says "Again. For them.", and the **same
  fight starts again at once** with a **Grudge**: +10% damage per loss, up to +30% (`GRUDGE_STEP`, `GRUDGE_MAX` in
  `quest/src/config.ts`; `Battle.retry` and `BattleScene.lose()`). You never leave the fight until you win.
- Nothing is lost when you lose: items used in a lost fight are only taken from the bag on a **win**
  (`settleBattle`), and gold and XP only change on a win.
- Every fight is started from a conversation, and **every conversation ends with an autosave**, taken the moment the
  fight begins. So "before you entered the fight" already exists: it is exactly the game as it stood when the battle
  opened (same map, same tile, same bag, same gold).
- Every story fight already has a way back in, written for "reload in the middle of a fight":
  - The boar: a line across the Cane Road fires every time until the boar is beaten.
  - The pier: the sergeant stays on the pier ("Back for another lesson, girl?").
  - The caney attack: a marine stays in the hall ("Still standing? Marines, again!").
  - Thorne: his longboat stays at the sea mouth ("Still here, Miss Limyè?").
- Random fights: after one, the next can't come for 18 steps (`ENCOUNTER_GRACE_STEPS`).
- COMBAT.md section 12 also promises a Hard mode retry limit and a Retreat button; **neither was ever built**.
- Every fight starts at full HP, so there is no HP to restore.

---

## 2. The rule in one paragraph

If the party falls in any fight that is meant to be won (story fights, bosses and random fights), the goddess Elodie
appears, says she remembers every fall and how many there have been, and gives the party back the moment before the
fight. The player is then **free on the map**: walk, shop, change gear, then go back and try again. Fights that are
**meant to be lost** (the future Chapter 3 fight with Rael) never show her and never count.

---

## 3. The storyboard (about 12 seconds, every part skippable)

She is never shown with a full face (the board game's rule): a tall shape woven of stars and gold threads, open hands,
and where a face would be, soft light and one calm, half-closed gold eye.

| # | Time | What you see | What you hear |
|---|---|---|---|
| 1 | 0 to 1.5 s | The battle. The last fighter kneels. Anissa: "Gigi! Get up! Please!" (kept from today). | Battle music cuts; one low note. |
| 2 | 1.5 to 2.5 s | The battle fades to deep night blue. | Silence. |
| 3 | 2.5 to 4 s | **GAME OVER** in cream letters, centre, fading in and holding. | One soft bell. |
| 4 | 4 to 6 s | The letters thin into gold threads that rise. From the top, threads fall like a loom; stars light. Her shape fades in behind them; the eye opens halfway. | The Temple music begins softly. |
| 5 | line by line | Her words, in gold, centred, with no name box, no portrait and no talking blips (she is not a person in a box). One line per tap, or each line moves on by itself after 4 s. | |
| 6 | stays | The count, large under her words: a gold number with "Times fallen: 3" in small letters. Below it, one button: **Rise** (A). | |
| 7 | 1.5 s | On Rise, the threads draw back up like a loom unwinding; a soft gold flash. | Bell; music fades. |
| 8 | 1 s | The map fades in. The party stands where they were before the fight (or one step back, see section 5). A toast: "Back before the fight. Grudge: +10% against the boar." | The map's music returns. |

### Her lines (her voice: a goddess who remembers; warm and calm; never jokey; never scolding)

The first line depends on the count; the rest are always the same.

| Count | Line 1 |
|---|---|
| 1 | "Child of the Limyè line. This is the first time I have caught you falling." |
| 2 to 9 | "I have caught you **{n}** times now. I remember every one." |
| 10 or more | "**{n}** times. I remember every fall, and every time you stood again." |

- Line 2: "I do not rule this world. I only remember it. So I will give you back the moment before."
- Line 3: "Go. Walk, mend, make ready. The fight will wait for you."

(Chapter 1 Gianna does not yet know she is a Rodriguez, so "the Limyè line" is right; later chapters can change line 1
when the story allows. Wording is the owner's to change; it lives in a data file, not in code.)

### Skipping and access

- **B (or a tap on "Skip")** jumps straight to the last screen: her last line, the count and the Rise button. The
  count is never skipped past, since showing it is the point.
- **A** moves to the next line. A tap anywhere does the same; a stray tap during the fades does nothing (like the intro).
- The text speed setting is respected. Text is at least the dialogue box's size, cream and gold on deep blue (strong
  contrast).
- If the device asks for reduced motion, no falling threads, no flash, no shake: plain fades only.
- Fits a 390 px phone held either way (portrait 390 x 844 and landscape 844 x 390); the Rise and Skip buttons are at
  least 44 px tall.
- Total unskipped: about 12 s plus reading. Skipped: under 2 s to the Rise button.

---

## 4. Which fights show it

| Fight | Game Over? | After Rise |
|---|---|---|
| Story fights (pier, caney, village patrol) | Yes | The foe waits on the map; talk to them to fight again. |
| Boss fights (Thorne, later bosses) | Yes | Same: the boss waits (Thorne's longboat). |
| The boar (the tutorial fight) | Yes | One step back from the boar line; walk forward to fight. The opening tutorial pages are not shown again. |
| Random fights in the wild | Yes | The foes are gone; 18 safe steps before the next one, as after any fight. |
| Echo fights (none built yet) | Yes | Back in the Echo, at the same spot. A goddess who remembers fits the memory world well. |
| **Fights meant to be lost (Rael, Chapter 3)** | **No** | The story goes on (see below). |

### The rule for fights meant to be lost

- Each such fight is marked in its battle entry (`quest/src/data/battles.ts`) as **meant to be lost**, with the scene
  that plays after it (for example `then: 'rael_after'`).
- When the party falls: no goddess, no count, no Grudge. The fight ends and that scene plays.
- So a strong player is never stuck trying to lose: the fight also **ends by itself after a set number of rounds**
  (a number in `config.ts`), and the same scene plays either way. The scene must make sense from both (Rael ends it).
- A test checks every "meant to be lost" fight has its scene, and that none of them are random fights.

---

## 5. What "continue from before the fight" gives back

**Recommendation: resume the game as it is in memory, not by reloading the save.** Since a lost fight changes nothing
(section 1), the game in memory already *is* the moment before the fight. Reloading from the device would break in a
private window (saves can fail there) and would bring back a leftover "scene after the fight" marker (below).

| Thing | After Rise |
|---|---|
| Map and position | Where the fight began. If that tile starts a fight when stepped on (the boar line), the party is moved **one step back the way they came**; if that tile is blocked, a door or another trigger, they stay put. |
| HP and SP | Full, as every fight starts today. |
| Items | As before the fight: anything eaten or drunk in the lost fight is back. |
| Gold and XP | As before the fight (a loss never paid or charged anything). |
| Story flags | As before the fight. |
| The Game Over count and the fight's Grudge | Kept and saved (these are the only things that change). |

### Exploits and soft-locks, one by one

- **A fight trigger firing again at once:** the step back means the boar only charges when you walk forward again.
  Without it, the player would stand on the boar line and could step east past the boar without fighting (a skip
  that this feature would create; today you never leave a lost fight).
- **A fight started from a conversation:** the foe stays on the map until beaten (all four Chapter 2 fights already
  do this). A new content test makes it a rule: every story fight must have a way back in while it is not won.
- **A fight inside a staged scene** (the caney attack, Thorne at the sea mouth): the walking actors are cleared when
  the scene ends, and the map's waiting foe stands in for them. The test above covers these too.
- **The "scene after the fight" marker** (`battle.after`, e.g. the fisher's thanks after the pier): it is cleared on a
  loss. A reload from the autosave would bring it back, and the next unrelated win would wrongly play the pier
  scene. Resuming from memory avoids this; the build also clears it on load, which fixes the same risk that a mid-fight
  reload has today.
- **Losing on purpose to farm:** nothing can be farmed. Losses pay no XP, gold or items. Items used in a lost fight
  come back, but that only returns things to how they were.
- **Grudge farming:** losing on purpose stacks at most +30% against that one fight. That is the safety net working as
  intended, not an exploit.
- **Closing the app during the Game Over screen:** the count is saved the moment the screen opens. Reopening puts the
  party at the autosave, as a mid-fight reload does today.
- **Places you cannot leave** (the night escape): the player cannot reach a shop there, but can still open the menu,
  change gear and use the bag. "Walk around and buy" works wherever the map allows it, and the story is never blocked.
- **The tutorial fight:** its opening pages are skipped on a second try (otherwise every loss replays the lesson).

---

## 6. Grudge: keep it (recommended)

The owner's rule replaces the instant restart, but **the Grudge itself should stay**, changed so it survives leaving
the fight:

- Losses are counted **per fight** and saved. When the party fights that fight again, it starts with +10% per loss, up
  to +30%. A win clears that fight's count.
- Why: the Grudge is the game's promise that no player is ever stuck (COMBAT.md section 12, "no death spiral").
  Shopping and levelling help the players who like to build; the Grudge helps the ones who just want the story. It
  costs nothing and is never forced on anyone.
- The battle shows it at the start ("Grudge +20%"), so the help is visible and honest.
- Hard mode's retry limit and the Retreat button (COMBAT.md section 12) were never built. With Game Over they are no
  longer needed, and that section gets rewritten.

---

## 7. Where the count lives

- In the save's flags, so it is **per save**: a new game starts at 0, and a save code carries it to another device.
  - `gameover.count`: the number of Game Overs on this save.
  - `gameover.<table>.<group>`: losses at one fight, for its Grudge (cleared on a win).
- No change to the save format is needed (flags can already hold numbers), so old saves keep working with a count of 0.
- Optional, if the owner wants it: the Journal's Foes page shows "Times fallen: 3". Not planned unless asked.

---

## 8. Art and sound (placeholder first)

- **Picture:** a new entry in `quest/src/assets.config.ts` (for example `GODDESS_ART.gameOver`). While it is empty, the
  game draws a placeholder in code: a gold glow, falling gold lines, stars, and a simple half-closed eye. When the
  owner's art drop brings "Elodie the goddess, 1a" (ART-PROMPTS.md), its file name goes in that one entry and the
  painting replaces the placeholder with no other change. The 1a painting is wide (16:9); for a portrait phone it is
  cropped around her eye and hands, with the text over the lower half on a veil (as the end cards do).
- **Music:** `GAME_OVER_MUSIC` in `quest/src/audio.config.ts`, set to the existing Temple track for now; a track of
  her own can drop in later. The bell is a new made sound (`goddess`) that a recorded file can replace through
  `SFX_FILES`.
- **Numbers:** every timing (fade lengths, seconds per line, the count where line 1 changes, the meant-to-lose round
  limit) goes in `quest/src/config.ts`.

---

## 9. Tests

**Unit tests (the rules, with no screen):** a new pure module `quest/src/engine/gameOver.ts`, tested in
`quest/tests/gameOver.test.ts`, like `intro.ts` and its test:

- A loss adds 1 to the count and to that fight's losses; the Grudge is +10% per loss, never above +30%; a win clears
  that fight's losses.
- A "meant to be lost" fight: no count, no Grudge, and its scene is named.
- Line 1 is right for counts 1, 2, 9, 10 and 50, and always contains the number.
- Presses: B jumps to the last screen; A moves on; a tap during a fade does nothing.
- The step back: moves when the tile behind is open; stays when it is a wall, a door or another trigger.
- A full run in the simulator: lose the boar, Rise, the boar does not charge at once, walk forward, it charges, and
  this time the fight starts with +10% and no tutorial pages.
- The "scene after the fight" marker is gone after a loss and after a load.
- Content test: every battle a conversation can start is either meant to be lost (with its scene) or has a way back in
  (a foe or a trigger that restarts it while it is not won).
- Save round trip keeps the count.

**Smoke test (the real game in a headless browser, `quest/tests/smoke.mjs`):** a new section using a test-only
switch that makes the party lose (like the existing test-only extra fighters):

- Start the boar fight, lose it: the Game Over screen opens, shows "1", screenshots at 844 x 390 and 390 x 844.
- Press B: the last screen with the count and Rise appears. Tap Rise (checking it is at least 44 px).
- Back on the map, one tile west of the boar line, in field mode, no page errors.
- Reload: the count is still 1. Walk east: the boar charges; the battle shows a +10% Grudge. Lose again: "2".
- The Act I route itself is unchanged (it wins every fight).

---

## 10. Questions for the owner (one at a time)

1. **May the goddess speak here?** ART-PROMPTS.md says "she never speaks", and the faith says she remembers but does
   not rule. This screen needs her words. My suggestion: she speaks only on this screen, as gold text with no name box,
   portrait or voice, and the rule becomes "she speaks only when she gives a fallen heir another chance". *Reason: it
   changes a written rule, and I must not change one without you.*
2. **Keep the Grudge (+10% per loss at that fight, up to +30%)?** I recommend yes (section 6). *Reason: your new rule
   replaces the instant restart, and the Grudge was part of it, so this is your call, not mine.*
3. **Do random fights in the wild show her and add to the count?** I recommend yes: one rule, and an honest count.
   *Reason: you said "fights you are supposed to win", and a random fight could be read either way.*

---

## 11. Build plan (small steps, each one checked before the next)

1. **Docs** (after the answers): rewrite COMBAT.md section 12; update the goddess rule in ART-PROMPTS.md; add the
   meant-to-be-lost rule to the Rael notes in STORY.md.
2. **Rules module:** `engine/gameOver.ts` (count, per-fight Grudge, her lines chosen by count, presses, step back),
   the timings in `config.ts`, her lines in a data file. Unit tests.
3. **Meant-to-lose fights:** the battle entry's new mark and scene, the round limit, the content test that every
   story fight has a way back in. Only the mark and its tests are built now, with a test-only fight; the Rael fight
   itself waits for the Chapter gate (no Chapter 3 building until Chapter 2 is accepted).
4. **Game logic:** remember the tile the party stepped from when a fight trigger fires; "Rise" (step back, clear the
   after-fight marker, save); clear that marker on load; skip the tutorial pages on a second try. Simulator test.
5. **Art and sound hooks:** the empty goddess entry in `assets.config.ts` with the drawn placeholder; Temple music and
   the bell in `audio.config.ts`.
6. **The screen:** a new Game Over scene; the battle's loss now opens it instead of restarting; the map resumes on
   Rise. Check by hand at 390 px both ways.
7. **Smoke test** section and screenshots; full test, typecheck, lint and build.
8. **When the art drop arrives:** put the 1a painting's file in the one entry and check the crop on a phone.

Steps 2 to 4 are rules work (Opus); tests and docs can go to Sonnet; the content check is a good Haiku job.

---

## Owner decisions (Oct 19)

1. **The goddess may speak to her descendants.** The rule in ART-PROMPTS.md ("she never speaks") becomes: Elodie the
   goddess speaks only to her descendants (Gianna and her line). This screen is one such moment.
2. **The Grudge stays** (+10% per loss at that fight, up to +30%), counted per fight.
3. **Random encounters do not count:** losing a random fight in the wild shows no goddess and adds nothing to the
   count. It keeps today's rule (the fight restarts with the Grudge) unless the owner says otherwise.
