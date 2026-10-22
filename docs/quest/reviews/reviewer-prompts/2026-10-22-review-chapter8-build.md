# Reviewer prompt: Chapter 8 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 8, *The Dying Flame* (Agnipur, Jwaladesh; the third of the three roads), of the
> Bloodlines quest, on branch `chapter8` (the commits after `fe47909`). Read
> `docs/quest/reviews/2026-10-22-chapter8-outline.md` (the outline and its "Built (Oct 22)" section with Claude's calls
> and the measured numbers), `docs/quest/reviews/2026-10-22-chapter8-outline-review.md` (the second review whose fixes
> were applied), `docs/quest/design/COMBAT.md` 6 (Chapter 8's entry and the four houses' price ranges), 9.7 (Vikram as
> built), 10 (Burning and Oiled) and 13.3 (Seth Dhanraj), `docs/quest/design/PUZZLES.md` SIG-JWA and M-JWA-1,
> `docs/quest/design/SIDE-QUESTS.md` J-2 and J-3, `docs/quest/design/FAMILY.md` (Aiyana, built), and the code:
> `quest/tools/maps/jwaladesh.ts` (six maps), `quest/src/data/jwaladesh.ts`, `quest/src/data/dialogue/jwaladesh.ts`,
> `ACT8` in `quest/src/data/quests.ts`, Dhanraj, the store enforcers, the Oil Enforcers, the Ember Jackals, the duel and
> Vikram's skills and moves in `quest/src/data/battles.ts`, `jwaladesh_story` and `salt_flats` in
> `quest/src/data/encounters.ts`, `lamp_relay`, `anonymous_oil` and `hesitation` in `quest/src/data/sideQuests.ts`,
> `jwaladesh_hesitation` in `quest/src/data/debates.ts`, the Agnipur books and shelves, Vikram's `MemberDef` (with
> `leads`) and the price's `pillarRules` in `quest/src/data/rpg.ts`, `kuroshi_jwaladesh` in `quest/src/data/voyages.ts`,
> the engine changes (Burning's tick capped on bosses by `BURNING_BOSS_SHARE`, `STATUS.oiled` and `STATUS_IMMUNE` in
> `quest/src/config.ts`; the phase's `ignite`, `BattleDef.fighters`, `skillCost` with passives and `turnOnFell` in
> `quest/src/engine/battle.ts`; the `spLess` and `turnOnFell` passives in `quest/src/engine/rpg.ts`; Vikram's follower in
> `quest/src/scenes/FieldScene.ts`; the shore in `quest/src/scenes/VoyageScene.ts`; the BURN and OIL tags in
> `quest/src/scenes/BattleScene.ts`), the end of `pier_end` in `quest/src/data/dialogue/kuroshi.ts`,
> `XP_PER_OBJECTIVE_BY_CHAPTER[7]`, and `quest/tests/jwaladesh.test.ts` and `flameFight.test.ts`.
>
> Check, skeptically and with line references: (1) every fix the second review asked for landed (its section 6), or
> say which did not: the boss (the falls counted across the party; HP x5 / ATK x1.2; the enforcers that protect him
> and the two that enter at 50%; Price Spike as a 100-power area blow every other turn with the item delay cut; the
> Oil Wall and its Surge; Burning capped at 2% on a boss; the kit wins 40 of 40 with 0.9 falls and Attack alone 0 of
> 40: too hard, too soft?), the level plan (does the route really end on 21 and the line without side quests on 19,
> and is paying 60 XP a step the right lever?), the buyer's mark and the thumbprints naming no house, the crane
> returned at dawn, the price floor of 4 and the four houses' ranges (Skarragol's and Kuroshi's were read by hand,
> Al-Doria's not at all), **a human read of every Aiyana, carter and Azzy line** against the locked rule (nothing that
> says or implies Rael is good, innocent or an agent; Aiyana says only what she measures; is "Azriel. You've got your
> grandfather's hands." safe?), Patricio's hand on the taper with Arjun's over it (the owner's near-miss: does it read
> as Patricio lighting Arjun's lamp?), the mirrors as flags, the beam only when the route is right, the relay's gust
> strips and the runners' way, the night and dawn as conditions, the duel on `meantToLose` with Gianna alone;
> (2) the owner rules: every story moment acted out on the map (the landing, the stair sighting, Aiyana on the roof and
> Azzy taking the wrench, the Court's hearing, the duel, the junior priest, the carter's cart on the salt road, the
> night lamp's hour and Aiyana at the gate, Arjun's charge and the riders, the roofs and Anissa's disc, the curtain torn
> and Vikram joining, the store, the price at dawn, Vikram leaving with the party), Anissa never a foe's target and
> never joking, Vikram's breathing joke never in a scene with Anissa's lines, Salkhi kept out of every scene with
> Anissa's lines, nobody dies (Dhanraj withdraws), Game Over with a way back in for every fight but the duel;
> (3) continuity: from Chapter 7 as built (the voyage from Kirinoura's pier; `?chapter=8` on Agnipur's quay with
> Haru, the crane and Kayla's glyphs) and into Chapter 9 (`?chapter=9` on the same quay after the card, Vikram with
> them, three tokens; the voyage to Aldermoor not built yet: acceptable?); `belief.rael_traitor` untouched; the closed
> hand never joined to the Quiet Crown before Chapter 9; (4) the gold arrow (`tests/goldWalk.test.ts`: Chapter 8 with
> no stall, 767 steps, 19 map changes); (5) soft-locks: a save in the Echo before the taper or with the mirror unbolted,
> the rooftops with one anchor, a mirror left south, the relay lamp out halfway, the store's doors before the night,
> the side quests and the debate closing when the story is past them, the duel won rather than lost; (6) the Hindi
> words in `quest/src/data/lang/hindi.json` (all unverified) flagged for the Nov 18 check; (7) the length: the outline
> planned 35 to 40 minutes and nothing has been timed in a browser.
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has not
> walked Chapter 8 in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter8-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
