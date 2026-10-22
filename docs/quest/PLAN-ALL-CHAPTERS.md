# The whole quest by Nov 22: the plan (Oct 20)

**Owner decision (Oct 20):** the release on **Sun Nov 22** is the whole quest: Chapters 1 to 12 and the epilogue,
about 6 hours. This replaces the Oct 19 chapter gate. The story, places, puzzles and secret items are already designed
(`docs/quest/design/`). The chapter order is the Oct 15 one: Ardencia is Chapter 3 and Al-Doria Chapter 4.

**Being reviewed:** two models are reviewing this plan separately (`docs/quest/reviews/2026-10-20-plan-review-*.md`).
The plan changes where the reviews and the owner say so.

## How each chapter is made

The pipeline is the one used for Chapter 2's side quests and Batch D. Each chapter takes about 2 to 3 days, and two
chapters are in flight at once.

1. **Outline (Fable):** the story beats, maps, people, puzzles, fights and levels, checked against what is built.
2. **Second review (Opus):** saved in full.
3. **Owner decisions:** one at a time, about five per chapter.
4. **Build (Opus):** maps, dialogue staged on the map, fights, the route through the chapter, chapter starts and tests.
5. **Full browser test:** before moving on.

## What every new chapter gets (to fit the time)

**Kept:**
- the main story, acted out on the map (owner rule);
- the boss fight and the chapter's fights;
- the Echo puzzle;
- the city's debate as a required quest;
- **two** required side quests;
- mystery quests and arrows;
- Game Over.

**After the release:** the other side quests designed for the chapter, and the secret items (including Chapter 1's
Quill and Chapter 2's Conch).

**Placeholders where art has not arrived:** the game runs and reads with placeholders; art drops in through
`assets.config.ts` without other changes.

## The dates

| Dates | Chapter | Place | Minutes | Levels |
|---|---|---|---|---|
| Oct 20 to 24 | 2: finish (five side quests and the gate) | Xaraguá | 40 | 3 to 8 |
| Oct 20 to 24 | 3: The Trial of Blades (Rael wins; Azzy covers the escape) | Ardencia | 45 | 8 to 11 |
| Oct 23 to 27 | 4: The Ledger (Samira joins) | Al-Doria | 30 | 11 to 14 |
| Oct 26 to 28 | 5: The Parley (the midpoint) | Eightgate | 20 | 14 to 15 |
| Oct 27 to Nov 6 | 6, 7, 8 in any order (the level-scaling rule for regions) | Skarragol, Kuroshi, Jwaladesh | 30 each | 15 to 21 |
| Nov 5 to 8 | 9: The Regent's Keep | Aldermoor | 35 | 21 to 24 |
| Nov 8 to 10 | 10: The Muster | Zetwal again | 10 | 24 to 25 |
| Nov 10 to 13 | 11: The War of the Harbor | Xaraguá again | 30 | 25 to 28 |
| Nov 13 to 16 | 12: The Claim, and the epilogue (The Hearing) | Eightgate | 30 | 28 to 30 |
| Nov 16 to 21 | The whole game played through: balance over 30 levels, phones, saves, accessibility, the phrase check, fixes | | | |
| **Nov 22** | **Release** | | | |

**Where it stands (Oct 22):** Chapters 1 to 8 are built (Chapter 8 on its branch); **Chapter 9 is built on branch
`chapter9`** (the outline's "Built" section: `reviews/2026-10-22-chapter9-outline.md`), well before the Nov 8 decision
date. Its route ends at level 24, the band's top, so the Muster (24 to 25) starts where it should. **Chapter 10 is built on branch `chapter10`** (from `chapter9`;
the outline's "Built" section: `reviews/2026-10-22-chapter10-outline.md`), ahead of its Nov 8 to 10 slot. Its route
ends at level 25 (8,533), so Chapter 11 (25 to 28) starts at its floor.

**Reviews by the owner and the objective reviewer, in batches:**
- Chapters 1 and 2, about Oct 27;
- Chapters 3 to 5, about Nov 1;
- Chapters 6 to 9, about Nov 9;
- Chapters 10 to 12, about Nov 17.

**Art:** drop 1 on Oct 24, drop 2 on Nov 7. Prompts for later chapters are written as each outline is approved.

## New systems the later chapters need (built when their chapter needs them)

- **Fights:**
  - the Bound rule and the "meant to lose" ending (Rael, Chapter 3);
  - the Yield step (spare, take, break; in the combat design);
  - Echo battles.
- **The party:**
  - Azzy joins (Chapter 3) and Samira joins (Chapter 4);
  - Samira's *Daftar* skill spends gold (owner question, `docs/PRODUCTION.md`);
  - a party bigger than three, and who fights.
- **The world:**
  - region levels set the first time the party enters (Chapters 6 to 8 in any order; `COMBAT.md` 6);
  - travel between places on the realm map.
- **The ending:**
  - the war and the claim scenes;
  - the epilogue's Hearing.

## The risks

- **The owner's time:** about 50 decisions over 30 days, one or two a day. A chapter whose decisions wait, waits.
- **Art:** chapters without art ship with placeholders.
- **Depth:** two side quests per chapter instead of five. The cut ones and the secret items follow after the release.
- **Balance over 30 levels:** each chapter is tested for its own fights. The whole curve is checked only in the last
  week.

---

## Owner decisions after the two plan reviews (Oct 20)

The reviews are `docs/quest/reviews/2026-10-20-plan-review-opus.md` and `...-sonnet.md` (in full).

1. **The three roads play in a fixed order for the release:** Skarragol (levels 15 to 17), Kuroshi (17 to 19),
   Jwaladesh (19 to 21). Any order can come in an update. No region-level system is needed for the release.
2. **Both of the Opus review's main changes are taken:**
   - **Foundations first,** built while Chapter 2 is finished and Chapter 3 is outlined:
     - a test set-up for many chapters (one route per chapter from its chapter start, seeded battle dice in the
       browser test, every chapter replayed headless in `npm test`);
     - the realm's economy (ally prices, Yield, a record of the Accord's Stability inputs);
     - a level-curve simulation;
     - fighters as data.
   - **A decision date, Sun Nov 8:** if Chapter 9 is not built by then, the owner chooses between Chapters 1 to 9
     polished on Nov 22 (10 to 12 and the Hearing in December) and all twelve with the late chapters plainer. The
     last review batch moves to about Nov 14.
3. **The owner will work on the game more often** from now on, so decisions can come daily.

The rest of the Opus review's changes (its section 6: the minimum per chapter, XP retuned per chapter with the
simulation, the art that matters most for drop 2, fluent readers per chapter, simplify only where the story does not
change) are the working plan unless the owner says otherwise.
