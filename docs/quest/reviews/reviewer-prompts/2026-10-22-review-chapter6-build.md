# Reviewer prompt: Chapter 6 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 6, *The Stolen Standard* (Ordvik, Skarragol; the first of the three roads), of
> the Bloodlines quest, on branch `chapter6` (the commits after `aed16d7`). Read
> `docs/quest/reviews/2026-10-21-chapter6-outline.md` (the outline and its "Built (Oct 22)" section with Claude's
> calls and the measured numbers), `docs/quest/reviews/2026-10-21-chapter6-outline-review.md` (the second review whose
> fixes were applied), `docs/quest/design/COMBAT.md` 6 (the levels pass and Chapter 6's entry) and 9.4 (Bayarmaa),
> `docs/quest/design/PUZZLES.md` SIG-SKA and M-SKA-1, `docs/quest/design/SIDE-QUESTS.md` S-3, S-5 and Se-5's token
> rule, and the code: `quest/tools/maps/skarragol.ts`, `quest/src/data/skarragol.ts`,
> `quest/src/data/dialogue/skarragol.ts`, `ACT6` in `quest/src/data/quests.ts`, Grimvald, the reavers, the wolves and
> Bayarmaa's skills in `quest/src/data/battles.ts`, `winter_plateau` in `quest/src/data/encounters.ts`, `grandson`,
> `winter_stores` and `oath` in `quest/src/data/sideQuests.ts`, `skarragol_oath` in `quest/src/data/debates.ts`, the
> Ordvik books, Bayarmaa's `MemberDef` (with `leads`) and the price's `pillarRules` in `quest/src/data/rpg.ts`, the
> engine changes (`surgedInPhase`, `SkillDef.weight`, `opensFirst` and `battleParty` in `quest/src/engine/battle.ts`,
> `gold.gain` in `quest/src/engine/game.ts`, `STAGE_PARTY` in `quest/src/engine/stage.ts`, `drawBeast` in
> `quest/src/scenes/pixels.ts`, Bayarmaa's follower and `regroupAfterEcho` in `quest/src/scenes/FieldScene.ts`),
> the end of `iron_gate` in `quest/src/data/dialogue/seat.ts`, and `quest/tests/skarragol.test.ts`.
>
> Check, skeptically and with line references: (1) every fix the second review asked for landed (its section 6), or
> say which did not: the level plan (does Chapter 6 really end on 17 on the route and the played line, and is paying
> 65 XP a step the right lever?), the raid playing without a sixth swap, Grimvald's three phases in every won fight and
> whether hp x5 / atk x1.3 (not the outline's x7 / x1.6) is right, the season, Azzy's mother's people, the price and the
> token rule, the herd as walked NPCs, followers, who fights, Salkhi kept away from Anissa; (2) the owner rules: every
> story moment acted out on the map (the fair in uproar, the Moot, Bayarmaa joining, the dusk at the fjord path, the
> fur, Sarnai's raid, the whistles, Grimvald, the horn, the quay), Anissa never touched by a foe and never joking,
> nobody dies, Game Over with a way back in for the wolves, the lookouts, the bout and Grimvald; (3) continuity: from
> Chapter 5 as built (`?chapter=6`, the Iron Gate now leading up the winter road; `clue.seventh_clause_read` paid off
> in the Moot; the Ironvow envoy's look at Azzy) and into Chapter 7 (`?chapter=7` on the quay, Torvald's letter, the
> voyage not built yet; Bayarmaa benched by the roster order after the chapter: acceptable?); (4) the gold arrow
> (`tests/goldWalk.test.ts`: Chapter 6 with no stall, the crossing zone by zone); (5) soft-locks: a save on the ice in
> either era, a save after the raid but before the herd, the lookouts fought after one whistle, the purse kept, the
> jarl paid with less than 300 gold (Claude's call: he takes what there is), the side quests closing.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test now walks
> Chapter 6 too and has not been run in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter6-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
