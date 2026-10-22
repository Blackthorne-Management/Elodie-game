# Reviewer prompt: Chapter 10 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 10, *The Muster* (Pòdlimyè, Zetwal again), of the Bloodlines quest, on branch
> `chapter10` (the commits after `42cac43`: engine `1fb19e8`, content `0bad380`, route and tests `aafccfb`, then the
> docs). Read `docs/quest/reviews/2026-10-22-chapter10-outline.md` (the outline, its "Decisions after the second review"
> and its "Built (Oct 22)" section with Claude's calls and the measured numbers),
> `docs/quest/reviews/2026-10-22-chapter10-outline-review.md` (the second review, every fix taken),
> `docs/quest/design/COMBAT.md` 6 (the Muster's ledger and Chapter 10's levels), 11 (the armies) and 13.2,
> `docs/quest/design/PUZZLES.md` M-ZET-2, `docs/quest/design/SIDE-QUESTS.md` Z-3, Z-6 and the three feuds,
> `docs/quest/design/FAMILY.md` (Rahel, Patricia, Jordyn and Joaquin, built), `docs/quest/design/STORY.md` (Chapter 10
> and open question 13), the Chapter 11 outline's decisions (what Chapter 10 must hand over: the armies, the betrayer,
> exposed or sailed), and the code: `quest/src/engine/ally.ts` and `ALLY_PRICES`, `MUSTER`, `ARMY_VOLLEY_PER` and
> `XP_PER_OBJECTIVE_BY_CHAPTER[9]` in `quest/src/config.ts`; `GameContent.afterDialogue` (`quest/src/engine/content.ts`,
> `game.ts`) and the Journal's Muster lines in `quest/src/scenes/FieldScene.ts`; `quest/src/data/muster.ts`;
> `quest/src/data/dialogue/zetwalMuster.ts` (the scenes and the overlays for the built people, applied in
> `quest/src/data/dialogue.ts`); the Chapter 10 layers in `quest/tools/maps/zetwal-*.ts` and the new
> `quest/tools/maps/zetwal-mill.ts`; `ACT10` in `quest/src/data/quests.ts`; the crew and the Cane Road's return in
> `battles.ts` and `encounters.ts`; `muskets`, `lonely_cutter` and the three feuds in `sideQuests.ts` and `debates.ts`;
> the items, shop and pillar rules in `rpg.ts`; `zetwal_xaragua_war` in `voyages.ts`; the puzzle `quest/puzzles/zetwal_mill`;
> the route's Chapter 10 segment (`quest/routes/zetwal-act1.json`, `@muster-landing` to `@chapter10-end`); and
> `quest/tests/muster.test.ts`, `ally.test.ts`, and the Chapter 10 parts of `goldWalk.test.ts` and `levelCurve.test.ts`.
>
> Check, skeptically and with line references:
> (1) every fix the second review asked for landed (its section 9), or say which did not: Free Brasador as Azzy's
> company (3.1); the family's facts (five children, Benny's peppers, a soldier's name, no braid, no Rael clue: 3.2);
> open question 13 kept open in the blessing and the kitchen (3.3); the levels (does the route really end on 25 and the
> line without side quests on 23, with 40 XP a step?: 3.4); the ledger shown and fair, and Al-Doria payable (3.5); the
> built people placed or hidden (3.6); the night on the harbor map with the captain shown, never named a member, and
> the companion's second defiance (3.8 to 3.10); dusk, night and dawn never overlapping, and `story.fleet_sailed` set
> (3.11); the bar on the inside of the powder store (3.12); the crew with the built active order (3.13: the fair bot
> 30 of 30 at 23 to 25 with 0.60, 0.13 and 0.10 falls; rushing the chief 12, 24 and 30 of 30 with 4 to 7 falls: too
> hard at 23 for a player who ignores the crew?); Anicette's accounts without a quiz (3.14); Z-3 around an absence
> (3.16); Jordyn's watch walking onto the plaza (3.17);
> (2) **a human read of every Rahel, Patricia, Jordyn, Joaquin and Anissa line**, against the locked rule (nothing
> that says or implies Rael is good, innocent or an agent; nothing that reads only one way: Rahel's "My son does not
> explain himself..." and "So they say." in particular), against the family's settled facts (`FAMILY.md`), and for
> voice: is Rahel formidable and warm, is Patricia unhurried, is Jordyn blunt and fair ("Captain of nothing."), is
> Joaquin's handover right, is every Anissa line a child's and never a joke? Read Anissa's two owner-chosen lines in
> place ("Anissa. I hold the door." at the lamp; "Anissa. I hold the door. Hold yours." from the fountain at dusk) and
> say whether the staging around them (nobody laughs; the fists to the chest) earns them;
> (3) the owner rules: every story moment acted out on the map (the ships and the companies up the pier, the camps,
> the watch walking up, the grandmothers, the kitchen, the lamp, the stone, the crew and the chief walking up the road,
> the mill's memory, Ti Jak going home, the vote and the chain, the inspection and the whistle, the captain walking
> down the lane, the quay (both ways, all four houses), the company boarding its ship, the fire, the fleet at dawn),
> Anissa never a foe's target, no comic line (Salkhi, Samira's prices, Vikram's breath, Edmund's apologies) in a node
> with Anissa's, nobody dies (the crew withdraws), Game Over with a way back in for the crew and the Cane Road;
> (4) the ledger's fairness: read `ALLY_PRICES` and `MUSTER` against what Chapters 3 to 9 actually pay; can a careful
> player pay every house? Is the buyer predictable from the Journal, and is that good? Is it right that the headless
> route (no debate or side quest rewards) leaves the Dorini at 30% and sails them, while a played game turns them?
> Is the exposed gate (60%, Kayla's list, the smugglers' ledger) reachable on a normal play?;
> (5) continuity: from Chapter 9 (`?chapter=10` on the harbor with Edmund, the pact, the record, the chronicle, the
> dissidents and Jordyn promised) and into Chapter 11 (`?chapter=11` on the Canoe Beach: `army.*`, `muster.betrayer`,
> `muster.turned` or `muster.betrayed`, `story.fleet_sailed`, the whistle and the ledger); does Chapter 11's outline
> get everything it decided to read?; the pre-existing bug found here (`hall_records` used twice, so Zetwal's Quiet
> Crown tract can never be read; Ti Jak's Reason now uses the purge list): fix it now or after the release?;
> (6) the gold arrow (`tests/goldWalk.test.ts`: on through Chapter 10, 921 steps, 25 map changes, both night routes)
> and the cellar's cheats (do they cover the wrong answers a real player tries?);
> (7) soft-locks: a save at night (the captain on the quay), a save in the cellar's memory, the crew lost and the
> reload, the gifts after the whistle, the feuds and side quests closing when the fleet sails, the Speaker's gate with
> one feud left;
> (8) the length: nothing has been timed in a browser.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has not
> walked Chapter 10 in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter10-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
