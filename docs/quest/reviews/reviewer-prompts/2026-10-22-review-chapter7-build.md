# Reviewer prompt: Chapter 7 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 7, *The Fog Files* (Kirinoura, Kuroshi; the second of the three roads), of the
> Bloodlines quest, on branch `chapter7` (the commits after `b3e344e`). Read
> `docs/quest/reviews/2026-10-21-chapter7-outline.md` (the outline and its "Built (Oct 22)" section with Claude's calls
> and the measured numbers), `docs/quest/reviews/2026-10-22-chapter7-outline-review.md` (the second review whose fixes
> were applied), `docs/quest/design/COMBAT.md` 6 (Chapter 7's entry), 9.5 (Haru as built), 10 (Hushed) and 13.3 (the
> Paper Fox), `docs/quest/design/PUZZLES.md` SIG-KUR, M-KUR-1 and M-KUR-2, `docs/quest/design/SIDE-QUESTS.md` K-2 and
> K-3, `docs/quest/design/FAMILY.md` (Kayla, built), and the code: `quest/tools/maps/kuroshi.ts` (seven maps),
> `quest/src/data/kuroshi.ts`, `quest/src/data/dialogue/kuroshi.ts`, `ACT7` in `quest/src/data/quests.ts`, the Paper
> Fox, the decoys, the cutpurses, the Hushers, the moths and Haru's skills and moves in `quest/src/data/battles.ts`,
> `kuroshi_story` and `fog_marsh` in `quest/src/data/encounters.ts`, `spy_ledger`, `lanterns` and `silence` in
> `quest/src/data/sideQuests.ts`, `kuroshi_silence` in `quest/src/data/debates.ts`, the Kirinoura books and shelves,
> Haru's `MemberDef` (with `leads`) and the price's `pillarRules` in `quest/src/data/rpg.ts`, `skarragol_kuroshi` in
> `quest/src/data/voyages.ts`, the engine changes (`quest/src/engine/rotor.ts`; `EnemyDef.disguise`, `SkillDef.reveal`,
> `EnemyMove.mirror`, `dealDisguises`, `revealFrom` and the Hushed check in `canUse` in `quest/src/engine/battle.ts`;
> `rotor.push` in `quest/src/engine/game.ts`; `Rng.shuffle`; `STATUS.noSkills` in `quest/src/config.ts`; Haru's
> follower in `quest/src/scenes/FieldScene.ts`; the masked HP bar in `quest/src/scenes/BattleScene.ts`), the
> `skills` plan in `quest/tools/battle-sim.ts`, the end of `quay_end` in `quest/src/data/dialogue/skarragol.ts`, and
> `quest/tests/kuroshi.test.ts`, `rotor.test.ts` and `shadowFight.test.ts`.
>
> Check, skeptically and with line references: (1) every fix the second review asked for landed (its section 6), or
> say which did not: the level plan (does the route really end on 19 and the line without side quests on 17, and is
> paying 44 XP a step the right lever, given the review expected a played start of 19?), the grid's slip-back rule and
> its cheat file, the buyer's list with prices only, the shelving rule taught on a Revolution file, Kayla's glyph card
> and **a human read of every Kayla line** against the locked rule (nothing that says or implies Rael is good, an
> agent or innocent; she knows what the files say and nothing else), the Fox (Sold Secrets on the Fox's ATK, the
> masking, the reveal, phase 2 at 40%, and whether hp x12 / atk x1.8 is right: Attack alone wins 5 of 40, the skills
> plan 40 of 40 with 20% lost), the maze's wrong way back to the last plaza and the blind walk turned back, the marsh
> road shut until the causeway is lit, Haru leading in his chapter, the token and the price; (2) the owner rules:
> every story moment acted out on the map (the landing, Haru's sightings, the observer crossing the bridge, the gate
> guard calling the lantern hour, Haru joining, the agents in the maze's Echo, the boats coming home, the Fox's
> unmasking and yield, the files read at Kayla's desk, the petition, Haru leaving the pier with the party), Anissa
> never a foe's target and never joking, Salkhi kept out of every scene with Anissa's lines, "definitely not a spy"
> not overused, nobody dies, Game Over with a way back in for the Fox, the stacks and the moths; (3) continuity: from
> Chapter 6 as built (`?chapter=7` on Kirinoura's pier after the voyage, Torvald's letter, Bayarmaa and Salkhi) and
> into Chapter 8 (`?chapter=8` on the pier; `clue.buyers_mark` and `clue.ardencia_outflows` kept for Chapter 10;
> `belief.rael_traitor` untouched; the voyage to Jwaladesh not built yet: acceptable?); the closed hand never joined
> to the Quiet Crown before Chapter 9; (4) the gold arrow (`tests/goldWalk.test.ts`: Chapter 7 with no stall, 720
> steps); (5) soft-locks: a save in the maze in either era, a save on the marsh before the posts, the file house's
> front door before the Fox, the screens pushed without the peg, the ledger shelf found before the Echo, the side
> quests and the debate closing when the story is past them; (6) the Japanese words in
> `quest/src/data/lang/japanese.json` (all unverified) flagged for the Nov 18 check.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has not
> walked Chapter 7 in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter7-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
