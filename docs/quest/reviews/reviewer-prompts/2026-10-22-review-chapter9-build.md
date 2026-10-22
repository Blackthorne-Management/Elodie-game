# Reviewer prompt: Chapter 9 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 9, *The Regent's Keep* (Kingsmere, Aldermoor; House Stillwater), of the
> Bloodlines quest, on branch `chapter9` (the commits after `e371293`: engine `95ce942`, content `17a391d`, tests
> `0d04d6c`, then the docs). Read `docs/quest/reviews/2026-10-22-chapter9-outline.md` (the outline, its "Decisions after
> the second review" and its "Built (Oct 22)" section with Claude's calls and the measured numbers),
> `docs/quest/reviews/2026-10-22-chapter9-outline-review.md` (the second review whose section 6 was applied in full),
> `docs/quest/design/COMBAT.md` 6 (Chapter 9's entry and the price table), 9.8 (Edmund as built), 10 (Hushed now takes
> the weapon moves too) and 13.3 (the Hushed), `docs/quest/design/PUZZLES.md` SIG-ALM, `docs/quest/design/SIDE-QUESTS.md`
> Al-2 and Al-3, `docs/quest/design/FAMILY.md` (Jordyn and Sebastian, built), `docs/quest/design/STORY.md` (Chapter 9
> and open question 3), and the code: `quest/tools/maps/aldermoor.ts` (six maps: the heath, the Market Cross, the Rolls
> House, the keep, the close, St. Agatha's), `quest/src/data/aldermoor.ts`, `quest/src/data/dialogue/aldermoor.ts`,
> `ACT9` and the Journal notes in `quest/src/data/quests.ts`, the Hushed, the veils, the Hushers, the Sealbearers, the
> Moor Constables, the bog hounds, the Crown officers and Edmund's skills and moves in `quest/src/data/battles.ts`,
> `aldermoor_story` and `heath` in `quest/src/data/encounters.ts`, `purge_list`, `crown_chronicle` and `one_hand` in
> `quest/src/data/sideQuests.ts`, `aldermoor_one_hand` in `quest/src/data/debates.ts`, the Aldermoor books and shelves,
> Edmund's `MemberDef` (with `leads`) and the price's `pillarRules` in `quest/src/data/rpg.ts`, `jwaladesh_aldermoor`
> and `aldermoor_zetwal` in `quest/src/data/voyages.ts`, the engine changes (`EnemyDef.magScale`, Hushed blocking the
> weapon moves in `canUse`, `SkillDef.healShare` in `quest/src/engine/battle.ts`; Edmund in `STAGE_PARTY`
> (`quest/src/engine/stage.ts`) and as the eighth follower in `quest/src/scenes/FieldScene.ts`; the shore in
> `quest/src/engine/voyage.ts` and `quest/src/scenes/VoyageScene.ts`), the Chapter 1 road watcher's talk
> (`road_watcher_talk` in `quest/src/data/dialogue/zetwal.ts`, now setting `story.watcher_met`, and her placement in
> `quest/tools/maps/zetwal-road.ts`), the end of `jw_quay_end` in `quest/src/data/dialogue/jwaladesh.ts`,
> `XP_PER_OBJECTIVE_BY_CHAPTER[8]`, the puzzles `quest/puzzles/aldermoor_archive` and `aldermoor_assize`, and
> `quest/tests/aldermoor.test.ts` and `assizeFight.test.ts`.
>
> Check, skeptically and with line references:
> (1) every fix the second review asked for landed (its section 6), or say which did not: the boss (HP x7 with
> `magScale` 1.25; the veils that protect her and the two that enter at 25%; Hush as an area spell every third turn;
> Hush the Light as a `seize`; the kit wins 40 of 40 with 0.85 falls and Attack alone 31 of 40 with 5.9: too hard, too
> soft, and is it right that Attack alone mostly wins a fight whose tip is "plain blows"?; the runs with Edmund benched
> and with a party at 20), Chapter 1's veiled woman (`story.watcher_met`, the three-way branch, "No one. That is the
> point of us." quoted back, "the Hushed" seeded on the list and at the chapel, her look), Sebastian's bill and "that's
> Grandpapa's name", Anissa through the postern holding the Echo's door and arrested with her sister, the level plan
> (does the route really end on 24 and the line without side quests on 22, with 70 XP a step?), Al-2's panel behind the
> shelf and the archive's door, the price's floor of 5 of 8 (option a), the twelve story-logic fixes (3.8), the tone
> fixes (3.9), the door too late (3.10), the engine claims (3.11: the escort as stage actors, the rain as a wash, the
> cabinets as dialogue with `eq`, Edmund on stage), Game Over in the court (3.12: the watch on the door, the dock's
> edge, the cell's bench);
> (2) **a human read of every Jordyn, Sebastian and Almoner line** against the locked rule (nothing that says or
> implies Rael is good, innocent or an agent; Jordyn's "He wrote to me once in twenty years. One line: 'Keep the
> law.' I have." in particular), and of the archive scene (the coded accounts on "the Ash Road" beside the chronicle's
> Ash Road massacre: does a careful reader learn too early that Rael is paying restitution?); is the Almoner's "And
> there is the little one. Not in the rain, I hope." and her court lines about Anissa within the rule that nobody joins
> the Crown to the girl who glows (she is the Crown's almoner, disowned)?;
> (3) the owner rules: every story moment acted out on the map (the landing and the trader, the notice post, the
> escort, the press-gang and Edmund, the Regent's audience, the printer, the bog chapel, the three doors, the debate,
> the close at the bell, the organ, the court's walk and the Almoner turning back, the Toccata, the postern, the
> filing floor's memory, the drawer, the panel, caught and arrested, the cells and Sebastian's blanket, the Assize,
> the unmasking, the three defiances, the price at dawn, the trader at the stair), Anissa never a foe's target and
> never joking, Vikram's breathing never in a node with Anissa's lines, Salkhi kept out of every scene with Anissa's
> lines, nobody dies (the Hushed withdraws), Game Over with a way back in for every fight;
> (4) continuity: from Chapter 8 (the voyage from Agnipur's quay; `?chapter=9` at the foot of the Mere Stair with
> Vikram and three tokens) and into Chapter 10 (`?chapter=10` on Pòdlimyè's harbor with Edmund, the pact, the record and
> the chronicle; the dissidents and Jordyn's company promised to the Muster); `belief.rael_traitor` untouched; the
> Chapter 5 aide now Edmund's look ("Miss Yari. I read your petition, at Eightgate."); the Regent's "I am always here";
> (5) the gold arrow (`tests/goldWalk.test.ts`: Chapter 9 with no stall, 574 steps, 15 map changes) and the puzzles'
> cheats (do they cover the wrong answers a real player tries?);
> (6) soft-locks: a save in the archive before the memory, with the shelf moved but the panel shut, or with a dial
> turned; caught before the evidence; a save in the cell; a loss to the Hushed and a reload in the dock; the side
> quests and the debate closing when the story is past them; the cathedral before the close;
> (7) the length: nothing has been timed in a browser (the gold walk is shorter than Chapter 8's).
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has not
> walked Chapter 9 in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter9-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
