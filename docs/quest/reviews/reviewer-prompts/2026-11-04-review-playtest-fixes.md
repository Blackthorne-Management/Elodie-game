# Reviewer prompt: the Oct 29 and Nov 1 fixes (who is on screen, staging, battle readability, button names, phones)

Paste this to the objective reviewer.

> You are reviewing the fixes made after the owner's Oct 29 notes and the two Nov 1 playtests of the Bloodlines quest
> (Chapters 1 to 12 and the epilogue are built; the release is Nov 22). The two playtests are
> `docs/quest/reviews/2026-11-01-playtest-ch1-4.md` and `2026-11-01-playtest-ch5-12.md`; read them first, since each
> finding there is what a fix answers. Nothing here changes the story. The work, in seven parts:
> 1. **Who walks the map (owner, Oct 29).** Only Gianna, Anissa, Azzy and one companion (the newest member, then Yari
>    again from Chapter 10) walk; the rest of the party is implied. `quest/src/engine/rpg.ts`, `quest/src/config.ts`,
>    `quest/tests/walkers.party.test.ts`.
> 2. **Where the party stands.** When the party stops, at a scene start, on a new map and back from an Echo, followers
>    settle beside or diagonally behind Gianna, never in a column, never on walls, doors, people, props or the map edge
>    (`quest/src/engine/partyPlacement.ts` `settleSpots`, `quest/tests/partyPlacement.test.ts`). A companion who speaks
>    and is not walking walks in before the line and off after the scene (`mustBringOn`, `bringOnCues` in
>    `quest/src/scenes/FieldScene.ts`). The camera moves so speakers stand above the dialogue box (`dialogueCameraY`).
> 3. **Shown, not told.** The boar (`cane_boar`, `drawBoar` in `quest/src/scenes/pixels.ts`), the burning plaza at night
>    (`MAP_MOODS`), Anissa's light at the lamp, the Muster harbor's ships (`mark` cue in `quest/src/engine/stage.ts`),
>    the fog maze (`MAP_FOG` in `quest/src/assets.config.ts`), free rows between people in a file
>    (`quest/tests/stage.test.ts`). Dialogue in `quest/src/data/dialogue/{zetwal,xaragua,ardencia,zetwalMuster}.ts`.
> 4. **Looks.** Townsfolk skin tones by land (`LAND_SKIN`, `docs/quest/ART-STYLE.md` 5, `quest/src/engine/crowd.ts`
>    `crowdLooks`, `quest/tests/heritage.test.ts`); the fisher, the seamstress disguises, the forge-master, the trader
>    captain, the bazaar's moneychangers.
> 5. **Battles.** The acting fighter's mark and B stepping back one level (`quest/src/engine/battleMenu.ts`,
>    `quest/tests/battleMenu.test.ts`, `docs/quest/design/COMBAT.md` 1.1); name plates that never overlap
>    (`quest/src/engine/battleLayout.ts` `placePlates`, `quest/tests/battleLayout.test.ts`), turn-order chips, labelled
>    HP/SP, indoor backdrops, first-time tips (`quest/src/data/battleTips.ts`); `COMBAT.md` 1.2;
>    `quest/src/scenes/BattleScene.ts`.
> 6. **Button names per device.** `quest/src/input/buttonNames.ts` and `quest/tests/buttonNames.test.ts`: every prompt
>    names the buttons of the device used last (keyboard, gamepad, touch).
> 7. **Phones and menus.** Sideways phones keep 2x; an upright phone gets a one-time "Turn your phone sideways" card
>    and starts on Large text (`quest/src/ui/rotateCard.ts`, `quest/src/ui/screen.ts`, `quest/src/style.css`); a plain
>    menu header and scroll arrows (`quest/src/ui/GameMenu.ts`); level-ups and rewards wait for a scene to end
>    (`quest/src/engine/showcase.ts`, `quest/src/ui/Toast.ts`); `?at=` jumps settle rewards silently
>    (`quest/src/devJump.ts`); the Hearing's Hall marks only what can be acted on. `docs/quest/QUEST-BUILD-GUIDE.md` 9.1.
>
> Play it yourself (dev server in `quest/`, Playwright, desktop 1280x800, phone portrait 390x844 and landscape
> 844x390, `?at=<marker>` jumps listed in `docs/quest/JUMP-POINTS.md`) and check, skeptically, with file and line
> references and screenshots:
> (1) **Every finding of the two playtests:** is it really fixed where it was seen, and in the other chapters that
> share the pattern? Re-take the playtests' screenshots at the same markers and compare.
> (2) **Placement:** try to break `settleSpots`: narrow corridors, doorways, a map edge, a crowd, the Hearing's Hall,
> a cutscene that moves the party. Does anyone ever stand in a wall, on a person, off screen, or vanish? Does a
> brought-on companion ever stay on the map after the scene, or walk on in a scene where they are not in the party?
> (3) **Shown, not told:** find any remaining moment in Chapters 1 to 12 where something happens in front of the party
> and only narration tells it (owner rule, Oct 17).
> (4) **Battles:** with five or six foes and a full party, in all three viewports: do plates, damage numbers, the turn
> chips and the target prompt ever overlap or cut off? Is the acting fighter always clear? Is B back one level from
> every menu?
> (5) **Button names:** switch device mid-scene (keyboard, then touch, then a gamepad). Does any prompt still name the
> wrong button, including cards, books, the shop, the rhythm panel, the Echo, the credits?
> (6) **Phones:** is every line of dialogue and battle text readable at 844x390 by a 12-year-old and a grandparent? Do
> the touch controls ever cover a speaker, a plate or a choice?
> (7) **Rewards:** does any level-up or reward still interrupt a staged scene, or repeat after a save and reload?
> (8) **Not reached by the playtests:** the Muster's army screens, the war's volley choice, the Hearing's verdict
> choice, and the Accord Stability readout. Play each through.
>
> Give a verdict, then every finding ranked by how much it hurts a first-time player, each with a concrete fix. Save
> your full review to `docs/quest/reviews/2026-11-04-playtest-fixes-review.md`.
