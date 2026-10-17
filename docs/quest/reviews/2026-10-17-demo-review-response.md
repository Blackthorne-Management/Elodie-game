# Response to the demo review of Oct 17

The review is in `2026-10-17-demo-review.md` (unedited). Every finding also applies to Chapter 1 in the main game
(the demo is a copy of it), so fixes land in `quest/` first and are then ported to the demo.

Checked in the code on Oct 17, before planning:
- Finding 6 is confirmed: `winch_echo` and `pawl_echo` (`src/data/dialogue/zetwal.ts`) and their map objects check
  only the bridge flags, never `clue.night_orders`.
- Finding 9 is confirmed: `boar_ambush` (`tools/maps/zetwal-road.ts`) needs only `party.anissa`.
- Finding 13 is confirmed: `engine/game.ts`, `data/encounters.ts` and `data/rpg.ts` still say Chapter 1 has no fights.
- Finding 1 goes against an owner decision (Oct 16: phones play only from the home screen). The owner decides it.

| # | Finding | Agree? | Plan | Batch |
|---|---|---|---|---|
| 1 | Phones can't play from the link | Yes, it's a real risk for testers | Owner decision first (it reverses Oct 16). Suggested: keep the install screen, add a "Play here anyway" button under the steps | E |
| 2 | No crowd on the plaza or the island | Yes | Non-interactive festival-goers walking the plaza (15-25) and the temple path (6-8), gone after the lamp | B |
| 3 | The boar dies before the fight teaches anything | Yes | More boar HP (tuned with the simulator so the Charge tell and Anissa's Light come up); 3 tutorial pages before the fight, the rest when each becomes relevant | C |
| 4 | Yari joins the fight but isn't on the map | Yes | Yari walks with the party once she joins (a second follower), staged when she joins | B |
| 5 | The papers errand is a long fetch loop | Mostly | Restructure the back third: fewer trips, and stage the Charter threat. A story change, so outline first (Fable), then owner approval | D |
| 6 | The bridge puzzle can be solved before it is posed | Yes (confirmed) | Gate the Echo winch and pawl on the night orders | A |
| 7 | Key moments told, not staged | Yes (it's the owner's own rule) | Stage the hooded figure, Yari's canoe arriving, the names read, the lamps lighting across the city, the fallen rope bridge | B |
| 8 | Echo shimmer and fountain look like placeholders | Yes | An animated shimmer tile and a drawn fountain | F |
| 9 | The boar can be met early and alone | Yes (confirmed) | Add `story.yari_asked` to the ambush trigger | A |
| 10 | Portrait phone wastes the screen | Partly | Fit the picture to the width with the controls overlaid. Lower priority than 1 | E |
| 11 | Few choices, two cosmetic | Yes | Give the cosmetic choices callbacks (Anicette remembers Gianna's farewell) | D |
| 12 | Black end card | Yes | The lit-lamp scene behind the end card, with the farewell music | B |
| 13 | Stale comments; `cane_road` bandits still a text stand-in | Yes (confirmed) | Fix the comments; route the zone to real battles | A |

Batches, in the order proposed:
- A. Quick fixes (6, 9, 13): small and safe.
- B. Show, don't tell (2, 4, 7, 12): crowds, Yari following, five staged moments, the end card.
- C. The boar fight (3): balance with the simulator, split the tutorial.
- D. Pacing and choices (5, 11): an outline for the owner first.
- E. Phones (1, 10): after the owner decides finding 1.
- F. Art (8).

After each batch: the unit tests, the full smoke test, a port to the demo, and one demo deploy at the end
(or sooner if the owner asks).
