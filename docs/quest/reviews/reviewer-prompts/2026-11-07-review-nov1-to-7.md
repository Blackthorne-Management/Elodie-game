# Reviewer prompt: everything since the Nov 1 playtests (fixes, three new side quests, staging), Nov 7

Paste this to the objective reviewer. It replaces `2026-11-04-review-playtest-fixes.md` (which covers only part of this).

> You are the objective reviewer for the Bloodlines quest, a single-player story RPG in `quest/` (Phaser + TypeScript;
> Chapters 1 to 12 and the epilogue are built; the release is Nov 22). Read `CLAUDE.md` first: the owner's rules
> matter, above all "shown, not told" (when people arrive, fight, act or leave in front of the party, they walk in and
> act it out on the map; narration alone is not enough). Then read the two Nov 1 playtests,
> `docs/quest/reviews/2026-11-01-playtest-ch1-4.md` and `2026-11-01-playtest-ch5-12.md`; each finding there carries a
> "Fixed" line saying what was done. You are reviewing everything since: `git log 884dd10~1..HEAD` (Nov 1 to Nov 7).
>
> **What landed:**
> 1. **Who is on screen.** Only Gianna, Anissa, Azzy and one companion walk the map; followers settle beside Gianna,
>    never in a column or a wall (`quest/src/engine/partyPlacement.ts`); a companion who speaks walks on first; the
>    camera keeps speakers above the dialogue box; a name tag over whoever speaks (`FieldScene` speakerTag); no "!" or
>    sparkles while a conversation is open; markers refresh when a conversation ends.
> 2. **Shown, not told.** The boar, the burning plaza, Anissa's light, the Muster's ships, the fog maze, free rows in
>    staged files; and on Nov 7 a scan of all dialogue fixed lines narrated after the action had finished (Hrafn, the
>    lawspeaker, Meera, the night quay, Rahel) and two exits told only in narration (the Chapter 11 picket, the Chapter
>    10 smuggler chief).
> 3. **Battles.** Name plates that never overlap (`quest/src/engine/battleLayout.ts`), turn-order chips, labelled HP/SP,
>    indoor backdrops, first-time tips (`quest/src/data/battleTips.ts`), the acting fighter's mark, B steps back one
>    level, damage numbers hidden under a tip page.
> 4. **Buttons and phones.** Every prompt names the buttons of the device used last (`quest/src/input/buttonNames.ts`);
>    sideways phones at 2x; a "turn your phone sideways" card; Large text on phones.
> 5. **Polish.** Voyages with their own ships, fleets and the party in the boat (`quest/src/scenes/VoyageScene.ts`,
>    `quest/src/data/voyages.ts`); puzzle controls sparkle once per set (`GameContent.controlSet`); reward gear asks
>    "Wear it now?" (`quest/src/engine/showcase.ts` wearOffer); the Eightgate Concourse's landmarks; townsfolk skin tones
>    by land; no look-alike twins.
> 6. **Three optional side quests** (designs and "Built" notes in `docs/quest/design/SIDE-QUESTS.md`; code in
>    `quest/src/data/sideQuestsLate.ts` and `quest/src/data/dialogue/*Quests.ts`; tests in
>    `quest/tests/sideQuestsLate.test.ts`):
>    - **K-5 Ashes of the Temple** (Chapters 7 to 8): the Suzumori elder's Crown paper, an Echo at Kayla's desk fifty
>      years ago where Patricio sees the forger's seal, her letter carried to Meera in Agnipur; the Muster's temple-feud
>      debate then starts with round 1 won (`DebateDef.headStart`, `quest/src/engine/debate.ts`). Note the date call:
>      the burning is in the Ash Wars (25 years ago), the Echo shows the forger's first lie (50 years ago).
>    - **J-5 Jackals on the Salt Road** (Chapter 8): a salt caravan escorted across the salt flats, two real fights.
>    - **S-2 The Fleet for Sale** (Chapter 6): three chiefs' word; Hrafn's threshold is Influence 12 or Fear 3 (the
>      design's Fear 10 cannot be reached in Ordvik; Claude's call); his promise pays off at the Muster and after the
>      Claim (`quest/tests/fleetPromise.test.ts`).
> 7. **Dev shortcuts** for testing one scene: `?at=<marker>&set=flag,flag=2&go=map/x,y` (`docs/quest/JUMP-POINTS.md`).
>
> **Play it yourself.** In `quest/`: `npm ci`, then `npx vite --port 5311`; drive Chromium with Playwright at desktop
> 1280x800, phone portrait 390x844 and phone landscape 844x390. Jump with `?intro=0&at=<marker>` (list in
> `docs/quest/JUMP-POINTS.md`), and use `&set=` and `&go=` to open the new side quests' scenes directly. Keep the
> screenshots and name them in your findings. The automated checks are `npm test` and `npm run smoke` (the smoke takes
> over an hour; run it in parts with `SMOKE_FROM=<marker>`).
>
> **Check, skeptically, with file and line references:**
> 1. Every Nov 1 finding marked "Fixed": is it fixed where it was seen, and in the other chapters with the same pattern?
>    Re-take the playtests' screenshots at the same markers and compare.
> 2. Placement and staging: try to break them (corridors, doorways, map edges, crowds, the Hearing's Hall, cutscenes that
>    move the party). Anyone in a wall, on a person, off screen, or left on the map after a scene? A speaker's tag over
>    the wrong person?
> 3. "Shown, not told": find any remaining moment in Chapters 1 to 12 where something happens in front of the party and
>    only narration says so, or where a line describes an action that has already finished or not yet started.
> 4. The three new side quests: play each through in the browser, including the paths the tests don't take (S-2 without
>    Samira, with gold; Hrafn refusing; J-5 when the party loses a caravan fight; K-5 left unfinished when the ship
>    sails). Can any of them be blocked, repeated, or paid twice? Does anything they add stand in the main route's way?
>    Is the writing in the voice of the chapter? Is the S-2 Fear threshold of 3 right, or should it be something else?
> 5. Battles with five or six foes and a full party in all three viewports: do plates, numbers, chips or prompts ever
>    overlap or cut off? Is the acting fighter always clear?
> 6. Button names: switch device mid-scene (keyboard, touch, gamepad). Does any prompt name the wrong button?
> 7. Phones: is every line readable at 844x390 by a 12-year-old and a grandparent? Do the touch controls cover a
>    speaker, a plate or a choice?
> 8. The scenes the playtests never reached: the Muster's army screens, the war's volley choice, the Hearing's verdict
>    choice and the Accord Stability readout. Play each through.
> 9. Balance: does `npm run level-curve` still say every chapter is on target? Is any new side quest a windfall?
>
> Give a verdict first, then every finding ranked by how much it hurts a first-time player, each with where you saw it,
> a screenshot name, and a concrete fix. Save your full review to `docs/quest/reviews/2026-11-07-objective-review.md`.
