# Reviewer prompt: Chapter 12 and the Epilogue as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 12, *The Claim* (Eightgate again), and the Epilogue, *The Hearing*, of the
> Bloodlines quest, on branch `chapter12` (the commits after `dac46e0`: engine `f573f7e`, content and the route
> `28a0a8d`, tests `867963b`, then the docs). This is the end of the game. Read
> `docs/quest/reviews/2026-10-22-chapter12-epilogue-outline.md` (the outline, its "Decisions after the second review"
> with the owner's two decisions of Oct 22, and its "Built (Oct 22)" section with Claude's calls and the measured
> numbers), `docs/quest/reviews/2026-10-22-chapter12-epilogue-outline-review.md` (the second review, every fix taken),
> `docs/quest/design/COMBAT.md` 6 (Chapter 12's levels) and 13.3 (#10, the Regent, and Azzy's Challenge as built),
> `docs/quest/design/FAMILY.md` (built in Chapter 12 and the Epilogue), `docs/quest/design/STORY.md` (Chapter 12 and the
> Epilogue, built), the guide's Rael, Elodie, Azzy and the endings (5.6, 5.7), `docs/rules-decisions.md` [42] and [45],
> and the code: `quest/src/engine/stability.ts`, the wounds and `opensFirst` in `quest/src/engine/battle.ts`, the cards
> in a row and the credits in `engine/game.ts` and `engine/content.ts`, `STABILITY`, `WOUND_FLOOR` and
> `XP_PER_OBJECTIVE_BY_CHAPTER[11]` in `quest/src/config.ts`; `quest/src/data/claim.ts`, `quest/src/data/claimBattles.ts`,
> `quest/src/data/dialogue/seatClaim.ts` (every scene, the people, the overlays), the Claim's and the Hearing's layers
> and the new `seat-rooms` in `quest/tools/maps/seat.ts`; `ACT12` and `EPILOGUE` in `quest/src/data/quests.ts`;
> `seats_claim`, `volume_one` and `claim_corner` in `sideQuests.ts` and `seat_claim` in `debates.ts`; the endings, The End
> and the cast in `quest/src/data/cards.ts`; the puzzle `quest/puzzles/seat_chair`; the route's last segment
> (`quest/routes/zetwal-act1.json`, `@chapter11-end` to `@the-end`); and `quest/tests/claim.test.ts`,
> `quest/tests/stability.test.ts` and the Chapter 12 parts of `act.test.ts`, `goldWalk.test.ts` and `levelCurve.test.ts`.
>
> Check, skeptically and with line references:
> (1) every fix the second review asked for landed, or say which did not: the Seventh Clause answered at the Claim under
> Clause Six; the Regent first, then Azzy; the claimant first and the wounds carried ([42]); the claim threshold read at
> the count ([45]); Elodie speaking Anissa's names; the Commission, Clause Twelve, the Council of Eight; the Master of
> the Chairs setting each token; the Regent's scales (HP x6, ATK x1.6, MAG x2.0, a group attack every second turn, one
> version, no tier-28 shop); Azzy at HP x4, ATK x1.2; the recalibrated Stability table and its five saves; the Regent
> arrested; Benny's Refusal; Azzy and Rael's last exchange; Elodie and Rael's one moment; every line fix of finding 8;
> the Hearing nine days later with the arrivals shown; "I'll hold the door, Gigi."; the six joking lines cut; the final
> Echo puzzle; The End card answering the intro's first line; the verdict's confirm and save; headless routes to all
> three endings;
> (2) **the owner's two decisions:** Azzy's Challenge only on Strike with "the realm had to see him beaten", after the
> Regent, Gianna alone with her wounds (is a lost Challenge, played again with the same wounds, fair at 28?); old
> Patricio speaking only at the chair he cut, of the sealing only, silent at dawn (Claude cut his two arrival lines to
> keep the decision) and at the Hearing, question 13 open: is anything he says or does an answer to it?;
> (3) **a human read of every Elodie, Rael, Azzy, old Benny, old Patricio, Layla, Rosalind and Anissa line**, against the
> family's settled facts (`FAMILY.md`) and for voice: is Elodie finally herself (an envoy, a wife who disagreed and
> stayed, a mother who will not forgive the testing), is Rael the guide's in public, is Azzy's share or renounce earned
> by the fair's answer (`choice.azzy_ordu`, Claude's call), is every Anissa line a child's and never a joke, does the
> Regent ever speak to her (he must not)?;
> (4) the owner rules: every story moment acted out on the map (the tokens handed over and set, Hollis and the petition,
> the rope unhooked, Gianna up onto the tile, the chairs filling, the Regent walked up the heralds' stair, Rael up the
> nave, every witness to the clerk's table, the verdict carried out, Anissa at the doors); Anissa never a target (the
> Regent's Hush the Light is the built Seize, Gianna steps in); nobody dies; Game Over with a way back in for the Regent
> and for Azzy;
> (5) **Accord Stability**: read `engine/stability.ts` and `config.ts STABILITY` against the outline's 4.2 and the review's
> 3.5. On the built saves Trust with a pardon is Just (85), Strike with a pardon Hollow (50 to 62) unless Azzy shares,
> Exile Hollow (75), Execution Iron, the dark route 40. Is that the story the owner wants: should Strike be able to
> reach the Just Throne without Azzy sharing? Is the Hollow card's "what it cost" honest, and is anything counted twice?;
> (6) the fights: the Regent was tuned down from the outline's adds (two Sealbearers and one more at a third; the
> Charter 110, One Hand 130) to keep the roster four near 40 actions; the roster (Gianna, Yari, Azzy, Samira) runs 39.7
> at 30 and 41.6 at 28, the glass line 22 to 24. Is a climactic boss at twice the glass line's length right, or is the
> bot underplaying Samira? Is Azzy's Challenge (18 of 20 at 28) right for a duel at the end of a game?;
> (7) the levels: Chapter 12's steps pay 120, the Regent 420, the two required quests 40 and 20; the route ends on 30,
> the line without side quests on 28;
> (8) continuity: from Chapter 11 (`?chapter=12` at Eightgate's Ardencia Gate, the war's choices and the stability
> inputs) to the end; every one of the sixteen Chapter 11 variants, Exile, Execution and the dark route by the arrow
> (`tests/claim.test.ts`); the gold arrow on through Chapter 12 (229 steps, 6 map changes) and the Epilogue (5);
> (9) soft-locks and the end of the game: a save during the Claim, a loss to the Regent or to Azzy, a reload during the
> Hearing, a save after the credits (no card shows again), the Hall open after the end, the companions back after
> `story.hall_seated`;
> (10) the length: nothing has been timed in a browser.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has
> Chapter 12 checks at every marker but has not walked the chapter in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter12-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
