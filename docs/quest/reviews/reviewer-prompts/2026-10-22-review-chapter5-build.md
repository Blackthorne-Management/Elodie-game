# Reviewer prompt: Chapter 5 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 5, *The Parley* (Eightgate, the midpoint), of the Bloodlines quest, on branch
> `chapter3` (commits after `656cfa1`, the merge of Oct 22). Read `docs/quest/reviews/2026-10-21-chapter5-outline.md`
> (the outline, the owner's decision at its end, and its "Built (Oct 22)" section with Claude's calls),
> `docs/quest/reviews/2026-10-21-chapter5-outline-review.md` (the second review whose fixes were applied),
> `docs/quest/design/FAMILY.md` (Coralie, "Tati Coco", and how Chapter 4 built her), `docs/quest/design/PUZZLES.md`
> SIG-SEA, and the code: `quest/tools/maps/seat.ts`, `quest/src/data/dialogue/seat.ts` (with `ELODIE_LINES` and
> `COCO`), `quest/src/data/seatArchive.ts`, `ACT5` in `quest/src/data/quests.ts`, the deserters in
> `quest/src/data/battles.ts`, `seats`, `voices` and `deserters` in `quest/src/data/sideQuests.ts`, `seat_voices` in
> `quest/src/data/debates.ts`, the Eightgate books in `quest/src/data/books.ts`, `DebateRound.speaker` in
> `quest/src/engine/debate.ts`, `DISGUISE` in `quest/src/assets.config.ts` and its use in
> `quest/src/scenes/FieldScene.ts`, the party split on the `joins` in `quest/src/data/rpg.ts`, the end of
> `caravan_dawn` in `quest/src/data/dialogue/aldoria.ts`, and `quest/tests/seat.test.ts`.
>
> Check, skeptically and with line references: (1) every fix the second review asked for landed (its section 6), or
> say which did not; in particular that the Crown's clerk never hears "Rael" and "father", that Hollis's reading
> spends none of S-SEA's answers and states no new law, that the deserters' fight always ends, that the drawer puzzle
> really differs between the eras, that Skarragol is east, and that Elodie's "No. He wouldn't." is gone; (2) the owner
> rules: every story moment acted out on the map (the arrival, the arch, the welcome, Coco's door, the chain, the
> sealing, the Parley, the fitting, the Iron Gate), Anissa never touched by a foe, never named by the Crown, never
> joking, Game Over on the deserters' fight with a way back in; (3) continuity: from Chapter 4 as built (Coralie's
> deflection, the sealed seventh page, Benny's half-sheet, the coin) and into Chapter 6 (`?chapter=6`, the roads in
> the fixed order Skarragol, Kuroshi, Jwaladesh; `belief.rael_traitor` intact; Elodie's two lines word for word);
> (4) the level curve (`node --experimental-strip-types tools/level-curve.ts`): Chapter 5 at 15 on the route, and the
> note that Chapter 2's required side quests now lift Chapters 2 to 4 (is the arrival at 15 acceptable, and does
> Chapter 6's band still hold?); (5) soft-locks: saves in the veils, at the chain, after the keeper agrees, in the
> evening; the evening gate; the puzzle's cheats (`quest/puzzles/seat_accord/`); the party split ending only at the
> Hall's steps.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`). Change nothing; write
> your review to `docs/quest/reviews/2026-10-22-chapter5-build-review.md`: verdict, what you agree with, what you
> disagree with (most serious first), what is missing, recommended changes in build order.
