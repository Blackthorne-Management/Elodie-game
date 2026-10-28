# Reviewer prompt: the Oct 28 polish pass (expressions, XP and gold, accessibility, saves, boot time)

Paste this to the objective reviewer.

> You are reviewing the Oct 28 polish pass of the Bloodlines quest (Chapters 1 to 12 and the epilogue are built; the
> release is Nov 22). Nothing in it changes the story. It has five parts:
> 1. **Expression portraits.** A dialogue line may carry `mood`; the box shows `portraits/<portrait>_<mood>.png` when
>    the file exists, else the plain portrait. Code: `quest/src/engine/dialogue.ts` (`DialogueLine.mood`, the view,
>    `checkDialogue`'s third argument), `PORTRAIT_MOODS` and `textureKeyForPortraitMood` in `quest/src/assets.config.ts`,
>    `moodFiles`/`makePortraitMoods` in `quest/src/scenes/textures.ts`, `quest/src/ui/DialogueBox.ts`. 241 lines across
>    `quest/src/data/dialogue/*.ts` are tagged (count table at the end of `docs/quest/ART-PROMPTS-REAL-PEOPLE.md`).
>    Also `ENEMY_STANCES` (Rael's painted sword stance, mirrored, at the Trial) in `quest/src/scenes/BattleScene.ts`.
> 2. **XP and gold.** `quest/tools/economy.ts` (`npm run economy`), `quest/tests/economy.test.ts`, `ECONOMY` in
>    `quest/src/config.ts`, and `docs/quest/design/COMBAT.md` section 16 (the rule, the per-chapter table, Claude's
>    calls). One change: Z-6 *Muskets in the Cane* pays 600 gold (the design's figure) instead of 400.
> 3. **Colour-blind cues and Reduce motion.** `quest/src/engine/accessibility.ts`, `quest/src/ui/reduceMotion.ts`,
>    `quest/src/scenes/cameraFx.ts` (every shake and flash, and the three-a-second flash gate), the hunks in
>    `FieldScene.ts`, `BattleScene.ts`, `GameMenu.ts`, `RhythmPanel.ts`, `ui/tileColours.ts` and `style.css`.
> 4. **Saves.** `quest/src/engine/save.ts`, `state.ts` (`placeSave`), `flags.ts`, `quest/src/runtime.ts`,
>    `quest/src/ui/saveCodeDialog.ts`, tests in `quest/tests/save.test.ts` and `state.test.ts`, and the smoke's
>    `damagedSaveFlow`.
> 5. **Boot time.** The content check now runs only on the dev server or with `?validate=1`; maps are minified at
>    build time (`quest/vite.config.ts`); chapter-jump data is dev-only. Numbers in `docs/quest/QUEST-BUILD-GUIDE.md`
>    section 9.1.
>
> Check, skeptically and with file and line references:
> (1) **Expressions:** read twenty tagged lines across different chapters against each expression's description in
> `docs/quest/ART-PROMPTS.md` and `ART-PROMPTS-REAL-PEOPLE.md`. Is the face right for the moment? Are any obvious
> moments missing (Rael's lamplight scenes, old Benny counting, Jordyn resigning)? Does a missing file always fall
> back cleanly, including on a choice line and a line whose speaker overrides the node's?
> (2) **Economy:** is "main route" defined honestly (the scripted route does many side quests)? Is any chapter a grind
> or a windfall for a player who skips side quests? Is the Chapter 10 purse (94 gold to spare) too tight for a player
> who bought something else earlier? What should the gold that piles up after the Muster be for?
> (3) **Accessibility:** does any meaning still ride on colour alone (try a deuteranopia and a protanopia filter on the
> screenshots)? With Reduce motion on, are the Chapter 3 story clues (the locket and the signet) still unmissable?
> Is any effect left that can flash more than three times a second?
> (4) **Saves:** try to crash the game with a save: a save from an early build, a truncated code, a flag of the wrong
> type, a position inside a wall, storage that throws. Is the player ever silently put somewhere wrong, or does
> autosave ever overwrite an unreadable save?
> (5) **Boot:** with the content check off in production, can bad content still ship? (Do the tests cover exactly what
> the boot check covered?)
> (6) **Chapter 1 identical:** compare Chapter 1's behaviour in the main game and the demo (`elodie-game-demo`, branch
> `main`) for everything above.
>
> Give a verdict, then every finding ranked by how much it hurts a first-time player, each with a concrete fix. Save
> your full review to `docs/quest/reviews/2026-10-28-polish-review.md`.
