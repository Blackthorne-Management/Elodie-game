# Reviewer prompt: Chapter 4 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 4, *The Ledger* (Al-Doria), of the Bloodlines quest, on branch `chapter3`
> (commits after `1d6a7b2`). Read `docs/quest/reviews/2026-10-20-chapter4-outline.md` (the outline and its "Built (Oct
> 22)" section with Claude's calls), `docs/quest/reviews/2026-10-21-chapter4-outline-review.md` (the review whose fixes
> were applied), `docs/quest/design/FAMILY.md` (Coralie), and the code: `quest/tools/maps/aldoria.ts`,
> `quest/src/data/dialogue/aldoria.ts`, `camp_trader_talk` in `quest/src/data/dialogue/ardencia.ts`, `ACT4` in
> `quest/src/data/quests.ts`, Qasim in `quest/src/data/battles.ts`, the Bribe / hire / Golden Wall / yield code in
> `quest/src/engine/battle.ts`, and `quest/tests/aldoria.test.ts`, `quest/tests/qasim.test.ts`.
>
> Check, skeptically and with line references: (1) every fix the review asked for landed, or say which did not;
> (2) the owner rules: every story moment acted out on the map, Anissa never touched and never joking, Game Over on
> lost fights with a way back in; (3) continuity with Chapter 3 as built and into Chapter 5 (who knows what, the coin,
> the sealed seventh page, Coralie's "did you know" deflection); (4) Qasim's balance (run `npx vitest run
> tests/qasim.test.ts`; is the threat real at 12-13, fair at 14?) and the level curve (`node --experimental-strip-types
> tools/level-curve.ts`); (5) soft-locks: any save made mid-scene, the dusk gate, the vault puzzle's cheats.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/`. Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter4-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
