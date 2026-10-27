# Reviewer prompt: the side quests of Chapters 3, 4, 6, Eightgate's Se-4 and Chapter 1's Z-5, as built (Oct 27)

Paste this to the objective reviewer.

> You are reviewing eleven optional side quests of the Bloodlines quest, built Oct 27 for the Nov 22 release (the
> second batch; the owner, Oct 27), with four secret items: in Chapter 3 (Cenizal) **Ar-3 The Elders' Feast**, **Ar-4
> The Old Lord's Errand** (the cloister crossed in two eras, the crypt bolt, **La Promesa de Benny** as old Benny's
> letter) and **Ar-5 The Arrows Missed**; in Chapter 4 (Bab al-Dhahab) **A-2 The Missing Saffron**, **A-4 The Uncashed
> Note** (the war-time bazaar's trade chain, box seven, **the Sakk of Yusuf**) and **A-5 Invoice for the Crown**; in
> Chapter 6 (Ordvik) **S-1 Salkhi Has Opinions**, **S-2's first-snow race** and **S-4 The Cairn of Nine Riders** (the
> winter sky from the flat stone, **Sarnai's Bridle Bell**); in Eightgate, Chapters 5 to 12, **Se-4 The Unknotted
> Ribbon** (the clerk's five questions in the sealing's memory, Keeper Hollis's hearing, **the Seventh Ribbon** struck
> at the Claim and given to Yari on the Hearing's morning); and in Chapter 1 (Pòdlimyè) **Z-5 Bread With No Debt** (the
> harbor bakery safehouse, the grain store's memory), also ported to the demo. Read the design:
> `docs/quest/design/SIDE-QUESTS.md` (each quest and its "Built (Oct 27)" note with Claude's calls),
> `docs/quest/design/SECRET-ITEMS.md` 2, 5, 6 and 9 (with their "Built" notes), `docs/quest/design/PUZZLES.md` (S-ALD,
> S-ARD, S-SKA, S-SEA), `docs/quest/design/CAPITALS.md` (Pòdlimyè's bakery, the Alcázar's chapel, the Counting House,
> the Winter Plateau, the Throne Archive) and `docs/PRODUCTION.md` (the batch's paragraph). Then the code:
> `quest/src/data/sideQuestsLate.ts` (`CENIZAL`, `BAB_AL_DHAHAB`, `EIGHTGATE`, `ORDVIK`, `LATE_XP`) and
> `quest/src/data/sideQuests.ts` (Z-5); the places and flags in `quest/src/data/ardencia.ts`, `aldoria.ts`,
> `skarragol.ts`, `seatArchive.ts` (`RIBBON`) and `bakery.ts`; the lines in `quest/src/data/dialogue/ardenciaQuests.ts`,
> `aldoriaQuests.ts`, `skarragolQuests.ts`, `seatQuests.ts` and `zetwalQuests.ts`, with the splices into `ardencia.ts`,
> `skarragol.ts`, `seat.ts` (`hollis_talk`, `sealing_return`), `seatClaim.ts` (the `ribbon` node after `heard`, and
> `hearing_arrivals`), `zetwal.ts` (the guard, the recruiter) and `xaraguaWar.ts` (Rael's "Nine you opened"); the new
> maps `ardenciaChapel` (`quest/tools/maps/ardencia.ts`) and `zetwalBakery` (`quest/tools/maps/zetwal-bakery.ts`) and
> the edits to the existing ones (the Alcázar, the town and the camp; the bazaar, the desert and the quay; the fair and
> the plateau; the Archive; Pòdlimyè's plaza); the engine changes (`BattleBoons.lastStand` in `quest/src/engine/
> battle.ts` and `rpg.ts`; `ItemDef.trade`, `buyPrice`, `sellPrice` and `GameContent.beforeShop` with Samira's coupon
> in `quest/src/data/secrets.ts`; `RhythmDef` title, noun and sound; `SkillDef.statusChance`; Accord Stability reading
> `claim.clause_struck` in `quest/src/engine/stability.ts`; `MUSTER.concord` in `quest/src/config.ts`); the puzzles
> `quest/puzzles/ardencia_cloister`, `skarragol_cairn` and `seat_ribbon`; the tests `quest/tests/sideQuestsMid.test.ts`,
> `sideQuestsLate.test.ts` (the curve with everything done), `secretItems.test.ts` and `stability.test.ts`; and the
> smoke's new second window, `oldLordsErrand` in `quest/tests/smoke.mjs`.
>
> Check, skeptically and with line references:
> (1) The owner's rules: every story moment shown on the map, not told (the servants carry the feast in and Ferrán's
> blades run; young Benny lays the letter in the box; the raiders and the nephew with the camels; Yusuf writes and
> seals; the factor counts coins into Samira's hand; the foal walks back to its mother; the rider buries the bridle and
> Salkhi drags the capstone; the clerk walks to his register; Hollis walks to his desk and to the glass, and down the
> Hall's steps to Yari; the woman walks into the grain store and out with her basket); Anissa never jokes and is never
> touched; no jokes in the Hall, the Archive or its memory; no Rael clue before the Turn beyond the guide's own (the
> arrows missed; old Benny never says "your father").
> (2) Each Claude's call, and whether it is just and helps the story or the play: the XP (small or none, the levels
> pass's rule; Z-5 and S-1 pay none, Se-4 100 not 500); Z-5 opening only after Chapter 1's errands and closing when Yari
> sails, its Journal note unnumbered; Ar-4 offered before the trial, seen meaning back to the gate (no fight), the
> letter a key item for the whole party; A-4 without a replayed puzzle file, the small sakk and the amendment; the
> cairn's sky turned by steps; the Bell a relic anyone wears; Se-4's sun mark standing for one of the first three lines
> only, the hearing failing in Chapter 5 by design, Stability read from the strike rather than the item, the ribbon
> given away on the Hearing's morning; the bakery's tier-24 stock not built.
> (3) The puzzles: are they the difficulty the design gives (S-ALD 3, S-ARD 6, S-SKA 7, S-SEA 10), fair (every clue
> reachable in the game: the price board, the watches' strips, the Mare sketch and the horns, the five questions and
> the four proofs in the Journal), and safe (a wrong deposit, a seen crossing, a wrong cairn, a shut register and a
> failed hearing all recover)? Is Se-4's dialogue puzzle hard enough with three answers a question, or too easy to
> brute force?
> (4) The numbers: `LATE_XP`, the curve test's claim that a player who does everything ends each chapter at most one
> over its target, the Sakk's 15% and 60% and the 300-gold coupon (does it break the economy, `tests/goldWalk.test.ts`),
> Benny's Word, Call the Herd (power 220, a 30% stun), +15 Stability and +10 Concord from the strike.
> (5) That the main route is untouched: no new NPC, object or trigger stands on the route's path before its quest is
> accepted (Ardencia's soldiers, the saffron's tracks, the factor's gangway, the foal and the race judge, the bakery's
> door), the route never accepts one, each closes when its chapter's ship sails (Se-4 at the bell), and the smoke
> passes with the Ar-4 window.
> (6) The demo: is `elodie-game-demo`'s Z-5 identical to the full game's, with only the tile numbers (102 to 104) and the
> shop greeting (the demo's shops have none) adapted?
>
> Write the review to `docs/quest/reviews/2026-10-27-side-quests-3-6-12-1-review.md`, in full, with a numbered list of
> fixes (most important first), each with its file and line.
