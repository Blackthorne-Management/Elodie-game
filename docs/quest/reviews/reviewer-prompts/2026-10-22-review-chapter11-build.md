# Reviewer prompt: Chapter 11 as built (Oct 22)

Paste this to the objective reviewer.

> You are reviewing the built Chapter 11, *The War of the Harbor* (Yucayeque, Xaraguá again), of the Bloodlines quest,
> on branch `chapter11` (the commits after `476e7e0`: engine `2b20adf`, content and the route `ae6d2c6`, tests `d4d8a89`,
> then the docs). Read `docs/quest/reviews/2026-10-22-chapter11-outline.md` (the outline, its "Decisions after the second
> review" and its "Built (Oct 22)" section with Claude's calls and the measured numbers),
> `docs/quest/reviews/2026-10-22-chapter11-outline-review.md` (the second review, every fix taken),
> `docs/quest/design/COMBAT.md` 6 (Chapter 11's levels), 11 (the volleys as built) and 13.3 (#3b, #8, #8b, #9),
> `docs/quest/design/PUZZLES.md` M-XAR-3, `docs/quest/design/SIDE-QUESTS.md` X-6 to X-8, `docs/quest/design/FAMILY.md`
> (built in Chapter 11), `docs/quest/design/STORY.md` (Chapter 11, built), the guide's Rael (5.6, 5.8), and the code:
> `quest/src/engine/war.ts`, the volleys, `avoid`, a phase's `leave` and `onLoss` in `quest/src/engine/battle.ts` and
> `gameOver.ts`, `riseFromFight` in `game.ts`, `VOLLEY` and `XP_PER_OBJECTIVE_BY_CHAPTER[10]` in `quest/src/config.ts`;
> `quest/src/data/war.ts`, `quest/src/data/warBattles.ts`, `quest/src/data/dialogue/xaraguaWar.ts` (the scenes, the
> whistle, the people and the overlays), the war's layers in `quest/tools/maps/xaragua.ts`; `ACT11` in
> `quest/src/data/quests.ts`; `harbor_elders`, `ninth_thumbprint` and `harbors_lie` in `sideQuests.ts` and
> `xaragua_harbor` in `debates.ts`; Rael's `MemberDef`, the charms and the carved paddle in `rpg.ts`; the moods and music
> (`assets.config.ts` `MAP_MOODS`, `audio.config.ts` `MUSIC_OVERRIDES`); the puzzle `quest/puzzles/xaragua_pier`; the
> route's Chapter 11 segment (`quest/routes/zetwal-act1.json`, `@chapter10-end` to `@chapter11-end`); and
> `quest/tests/war.test.ts` and the Chapter 11 parts of `act.test.ts`, `goldWalk.test.ts` and `levelCurve.test.ts`.
>
> Check, skeptically and with line references:
> (1) every fix the second review asked for landed (its section 9), or say which did not: the Turn asks its question
> (the Crown's line lets Ardencia through, the public lie with `fx: 'signet'`, "Gigi. His ring.", *Hold the pier.* /
> *Strike first.*: 3.1); the token's rule in the truth (no `fx: 'signet'`, the halves glow on the Accounts: 3.2); the
> fights retuned from tier-24 gear with volleys on (3.3; the outline's Built table: are the betrayers and Hale at 28 to 34
> actions with a fall in about one in four at 25, and is a fall in one in two where Vikram leads too much?; is the Strike
> really the hard route, a Bound in 47% of fights at 27 and no loss in 30?); the volleys (power 50, cap 3, a boss half,
> never felling: 3.4); Strike closing the war through `story.harbor_taken` (3.5); the chain on the built map (the capstan
> at the sea end, the Echo zone at the landward boards, the allied hulls coming in: 3.6); the nine doors (3.7); Hale's
> `onLoss` (3.8); the levels from Chapter 10's measured end (3.9); every line fix (3.10); the seven columns (3.11); Anissa
> in the flank and Vikram's defiance (3.12); `leads` and `avoid` (3.13); Thorne (3.14); the pier assault folded into the
> stand (3.15); the small ones (3.16);
> (2) **a human read of every Rael, old Benny, Nancy, Anaco, Yari, Azzy and Anissa line**, against the locked rule
> (before `war.turn_made` nothing says Rael is good; the carrier is a walk and a coat; the lookout's sails are a count),
> against the family's settled facts (`FAMILY.md`: Rael and Elodie married, Benny Rael's father, Nancy not Rael's
> mother, Patricia a great-grandmother), and for voice: is Rael the guide's (no plea, no excuse, "I will answer for it
> where it can be written down"), is Benny wry, Nancy gracious, Anaco a cacique, Yari Caona's great-granddaughter, Azzy
> furious and loyal on Strike, every Anissa line a child's and never a joke?; and **check the settled contradiction:** STORY's
> private line "My father kept his oath and it cost him everything" stands, and young Benny's passive (Chapter 3) was
> changed from "He kept the goal, not the oath" to "He kept the oath, whatever it cost" (Claude's call): is that right?;
> (3) the owner rules: every story moment acted out on the map (the companies up the sand in columns, the crew down
> the rock, the hull grounding and the betrayer walking up the beach, the watch walking him to the boats, the
> resistance coming down the gardens' road, the carrier walking off, the picket, the conch and the companies filing
> down, Yari down the cellar stairs, the stand in the memory, the chain running out, the sails, Rael up the pier with his
> vanguard, Hale's boats, the *Patience* running, the second longboat with Benny and Nancy, the wounded carried in, Rael
> walking out of the caney), Anissa never a foe's target (the Husher's Seize is the one aim at her, and Gianna steps in),
> no comic line in a node with hers, nobody dies (every named foe withdraws), Game Over with a way back in for every fight
> (Caona's stand: the Rise in the present and Echo again);
> (4) the gardens' road: the beach and the gardens are joined by a step and a question on each side, not by a door,
> because the menu's city map joins only doors that stand side by side (Claude's call); is that clear to a player, and
> does the gold arrow find it every time?;
> (5) the war's economy: is the volley pool (16 on the route) the right size for four whistles; does "how many
> volleys?" ever have a right answer other than three; does a thin fleet (a sailed house, a poor Muster) feel it?;
> (6) continuity: from Chapter 10 (`?chapter=11` on the Canoe Beach with the armies, the betrayer and the night's
> outcome) and into Chapter 12 (`?chapter=12` at Eightgate's Ardencia Gate: `story.harbor_taken`, `war.trust` or
> `war.strike`, `clue.ash_road_read`, `choice.truth_answer`, the carved paddle, the stability inputs); does Chapter 12's
> plan get everything it needs?;
> (7) the gold arrow (`tests/goldWalk.test.ts`: on through Chapter 11, 599 steps, 21 map changes, from either night) and
> the sixteen variants by the arrow in `tests/war.test.ts`; the pier's cheats (do they cover the wrong answers a real
> player tries?);
> (8) soft-locks: a save in the pier's memory, a loss at Caona's stand, a loss to Hale and to Rael, the debate lost,
> a reload on the beach with the betrayer's captain on the sand, the side quests closing at the card;
> (9) the length: nothing has been timed in a browser (the outline's estimate is 40 to 45 minutes; the route meets four
> ambushes on 282 wild steps).
> Run `npx vitest run`, `npm run typecheck`, `npm run lint` in `quest/` (not `npm run smoke`; the smoke test has
> Chapter 11 checks but has not walked the chapter in a browser). Change nothing; write your review to
> `docs/quest/reviews/2026-10-22-chapter11-build-review.md`: verdict, what you agree with, what you disagree with (most
> serious first), what is missing, recommended changes in build order.
