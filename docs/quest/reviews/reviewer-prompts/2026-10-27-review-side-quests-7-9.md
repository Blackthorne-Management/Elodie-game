# Reviewer prompt: the side quests of Chapters 7 to 9 and three secret items, as built (Oct 27)

Paste this to the objective reviewer.

> You are reviewing seven optional side quests of the Bloodlines quest that were kept for after the release and are now
> built for the Nov 22 release (the owner, Oct 27), with three secret items and Anissa's Calm and Gianna's Comfort: in
> Chapter 7 (Kirinoura) **K-1 Definitely Not a Spy** and **K-4 The Letter in the Floor** (Lady Sayo's House, the
> singing floor, **the Nightingale Key**); in Chapter 8 (Agnipur) **J-1 Win Every Argument** and **J-4 Oil for the
> Little Lamps** (the lamp-maker's jars, **the Unbroken Wick**); in Chapter 9 (Kingsmere) **Al-1 Terribly Sorry**,
> **Al-4 The Clock That Waits** (the clock tower, **the Patient Hour**) and **Al-5 Tea With Lady Rosalind**
> (Rosalind's Townhouse). Read the design: `docs/quest/design/SIDE-QUESTS.md` (K-1, K-4, J-1, J-4, Al-1, Al-4, Al-5 and
> their "Built (Oct 27)" notes with Claude's calls), `docs/quest/design/SECRET-ITEMS.md` 4, 7 and 8 (with their "Built"
> notes), `docs/quest/design/COMBAT.md` 8 (Calm and Comfort, built) and the Hushed's row in 13.3,
> `docs/quest/design/CAPITALS.md` (the Kirinoura, Agnipur and Kingsmere "Built" notes). Then the code:
> `quest/src/data/sideQuestsLate.ts`, `quest/src/data/dialogue/kuroshiQuests.ts`, `jwaladeshQuests.ts` and
> `aldermoorQuests.ts`, `quest/src/data/secretItems.ts`, `quest/src/data/secrets.ts` and `quest/src/engine/secrets.ts`
> (the jars, the clock, the floor), the new maps (`kuroshiSayoHouse` in `quest/tools/maps/kuroshi.ts`,
> `aldermoorClocktower` and `aldermoorTownhouse` in `quest/tools/maps/aldermoor.ts`) and the edits to the existing ones
> (the quarter, the pier, the Hall; the harbor's oil store and the bazaar; the square, the heath, the keep), the battle
> engine changes in `quest/src/engine/battle.ts` (Calm, `EnemyMove.calm`, Comfort, the boons, the Dawn Surge,
> `nextMove`, Stop the Clock) and `quest/src/scenes/BattleScene.ts`, the step hook and the ripples in
> `quest/src/engine/game.ts` and `quest/src/scenes/FieldScene.ts`, the dialogue runner's `onApply`, the three sparring
> bouts and the Hushers' and the Hushed's whispers in `quest/src/data/battles.ts`, the puzzles
> `quest/puzzles/kuroshi_floor`, `jwaladesh_wick` and `aldermoor_clock`, and the tests `quest/tests/sideQuestsLate.test.ts`
> and `quest/tests/secretItems.test.ts`.
>
> Check, skeptically and with line references:
> (1) the owner's rules: every story moment shown on the map, not told (Haru walks to each place he hid; the informant
> walks the floor; the lamp-maker carries the reservoir to the lock; the child walks to her shrine; Edmund walks up to
> each of the five, and each walks off; the watchman climbs the stair); Anissa never jokes and is never touched or aimed
> at (Calm is a whisper Gianna steps in front of); no Rael clue before the Turn (Sayo's letter, the roll call, Thomas's
> quill, Rosalind's tea); the locked rules in `docs/quest/design/STORY.md`.
> (2) Each Claude's call, and whether it is just and helps the story or the play: K-1 as Yari's re-enactment after the
> story's sightings; the Sayo door moved to the house's east side; J-4's Echo on the night after the charge; the J-1
> pillar by the majority; Al-5 after Rosalind's "Sat." (so the tea persuades her to sit at Eightgate, not to withdraw);
> Al-4's turn-based clock; the clock tower as its own map off the city map; the Nightingale Key's hidden conversations
> not built; the Dawn Surge built only with the Wick; Comfort as a command, not a spell, and blocked by Hush.
> (3) The puzzles: are they the difficulty the design gives (5, 8 and 9 of 10), fair (every clue reachable in the game:
> the tune's shapes in the narration, the roll call, "a quarter to three", "eleven ten when I come up"), and safe (a
> wrong nail, a wrong seal, a jammed clock and a caught Patricio all recover)? Is a second valid nail on the floor a
> flaw?
> (4) The numbers: XP (40 to 60 a quest; `LATE_XP`), the curve test's claim that a player who does all seven ends each
> chapter at most one over its target, the bouts (Vikram alone, 19 of 20 or better), Calm's effect on the Hushed (the
> fair bot still wins 30 of 30), the Wick's cheaper Surge and Dawn Surge, Stop the Clock, and whether any of them breaks
> a later fight.
> (5) That the main route is untouched: no new NPC or trigger stands on the route's path before its quest is accepted,
> the route never accepts one, and the smoke from Chapter 6's end passes.
>
> Write the review to `docs/quest/reviews/2026-10-27-side-quests-7-9-review.md`, in full, with a numbered list of fixes
> (most important first), each with its file and line.
