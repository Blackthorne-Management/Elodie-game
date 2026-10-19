# Chapter 1 review before the demo port (Oct 19, after Batch D)

*Independent review of Chapter 1 as it stands at commit `61b48db` and later on `claude/new-session-43aoxw`. I replayed
`quest/routes/zetwal-act1.json` through the simulator to the `@end-card` mark and read every line in order, as a
player would; walked the back third again as an arrow follower (the gold arrow only); played a second full run that
starts every side quest before the lamp, takes the second answer of every remembered choice, loses the debate, warns
the veiled woman and says "Not yet" at the canoe; replayed the saved mid-errand states; and diffed the demo repository
(`/home/user/elodie-game-demo`, branch `main`) file by file against the main game. `npm test` in the main game: 45 files,
454 tests, all green. No game file was changed.*

---

## Verdict

**Chapter 1 is ready to port, after one line is fixed.** Batch D does what it promised: the back third now reads as one
walk out and back (route 565 steps and 14 map changes from the lamp to the card, where it was 836 and 28), and a player
who only follows the gold arrow walks the same way (567 steps, 15 map changes; before Batch D the arrow walk was 1,243).
Every staged scene is acted out on the map by people who are standing next to whoever they speak to. Every remembered
choice pays off on both branches, in the right place. The side quests can be done in any order, before or after the
lamp, with no soft-lock and no line that contradicts what the player just did. Old saves made in the middle of the
papers errand still finish. Chapter 2 starts from exactly the state Chapter 1 leaves (the whistle, the kasav, the four
`choice.*` flags), and the envoy's scene no longer steals the council's reveal or Thorne's lines.

The one thing that must change before the port is a time-of-night slip in the envoy's first line. Everything else below
is polish, and none of it blocks the port.

---

## Must fix before the port

### 1. The consul says the lamps lit "an hour ago"; by then it is deep night

`quest/src/data/dialogue/zetwal.ts:1582`

The lamp scene says the names "are read until the moon is high. Nobody leaves early" (line 1066), and Gianna then
meets Yari, the cane cutter and the archivist, reads a book, and crosses the city before she reaches the Chancellor.
Several hours have passed. The consul walks in and says: *"Every lamp in Pòdlimyè lit itself at once, an hour ago."*
The engraver, two rooms earlier, has it right ("I finished it at sundown. Then every lamp in the city lit at once"),
and so does the consul's own gallery line ("Every lamp in the city lit at once tonight", line 1728).

Fix: change `an hour ago` to `tonight` in that one line:

```
'Chancellor. Forgive the hour. Every lamp in Pòdlimyè lit itself at once tonight. His Majesty would like to know why.'
```

(121 characters, within the box limit.) `tests/choices.test.ts:143` checks the scene by its content, not this
phrase, so no test changes.

---

## Should fix (none blocks the port; most serious first)

### 2. Grandfather still says "go and see who it is" after Yari has joined

`quest/src/data/dialogue/zetwal.ts:984-990` (the `start` branches) and `1014-1020` (the `after` node).

After the lamp, `patricio_old_talk` has one node for the rest of the chapter: *"In fifty years I never saw it burn like
that. The lookouts say a canoe has come in from Xaraguá. Go and see who it is."* The player passes the temple three
more times with Yari walking behind her (to the stones, the archive, the list, the cutter), and he says it every time.
Fix: add a branch `{ if: { flag: 'story.yari_asked' }, to: 'joined' }` before the `story.anissa_woke` one, with a node
such as: *"Xaraguá. So that is where the lights were seen from. Finish what you owe this city, Gianna. Then go."*

### 3. The archivist says "Festival day" at midnight

`quest/src/data/dialogue/zetwal.ts:1398`

On the route the archive is visited after the lamp, at night; the archivist's opening is *"Festival day, Gigi, and
you come to work? The archive is open to anyone today."* The line is also reachable before the lamp (the archive opens
when the bridge is crossed), so it needs two versions, not one: keep the current text under
`{ if: { notFlag: 'story.anissa_woke' } }` and add `{ if: { flag: 'story.anissa_woke' }, text: 'Festival night, Gigi,
and you come to work? The archive is open to anyone tonight. Read what you like.' }`. The soup vendor's "today" lines
are fine at night (a festival night is still the day of the festival); only this one names the time of day.

### 4. The cane cutter at the stones has no greeting for a player who met him on the road

`quest/src/data/dialogue/zetwal.ts:2060-2078` (`remind`, `remind_lines`) and `1994-2005` (`island`).

Two small gaps, found on the second run:

- A player who accepted the quest on the Cane Road before the lamp, and read the stones alone, finds him at the stones
  after the lamp and his first words are *"Not on the stones? Then she is only in the cane now..."*. Nothing says he
  crossed the bridge to hear the names, which is the whole reason he is standing there. Fix: in `remind_lines`, a first
  line under `{ if: CUTTER_AT_STONES }` such as *"Archivist. I crossed the bridge the moment it came down, to hear
  her read. She was not."* (It is harmless if it repeats; he is reminding.)
- A player who answers "Goodnight." or "I'm sorry." at the stones and talks to him again (the objective makes them)
  hears the whole three-line introduction a second time. Fix: a `story.cutter_stones_met` flag set by the `island`
  node, and a shorter `island_again` node: *"Still no name for her, archivist. Will you read them with me?"* leading to
  the same choices.

### 5. The end card says "The ferry sails for Xaraguá at dawn", but they have just left at dawn in a canoe

`quest/src/data/cards.ts:12` (main game only; the demo keeps its own card, see the checklist).

The dawn farewell now shows the canoe pulling away at first light, and the voyage opens with "Yari paddles out to a
Zetwal ship waiting beyond the reef." The card's third line, written for Batch B, still says *"The ferry sails for
Xaraguá at dawn..."*. Fix: `'Beyond the reef, a Zetwal ship waits to carry them to Xaraguá...'`.

### 6. Small voice and continuity notes (take or leave)

- Yari in the Chancellor's office: *"That is the paper. They nailed it to our customs house."* The consul's paper asks
  Zetwal to acknowledge protection of "the southern waters"; the Charter nailed up in Xaraguá is a different document
  of the same family. The owner approved the line, and a player will read it as "that is their paper". If it ever
  reads wrong in play, *"That is their paper. They nailed one like it to our customs house."* fixes it without losing
  the beat.
- The Hall steward (`zetwal.ts:1695`) still says "the consul is watched at all hours" after the consul has left the
  Hall for good. One `if` on `story.envoy_papers` with *"...and the consul, until tonight, was watched at all hours."*
- Anicette at the dock already knows where the girls are going ("And in Xaraguá, listen first"). Nobody tells her on
  screen, but the whole island saw the canoe from Xaraguá and a night passes before dawn. It reads naturally; no
  change needed.
- The Gaze keeper's line after a lost debate, "Come back when you are ready", invites a second try, and the engine
  allows one (only a won or mediated debate is settled). Meanwhile the Quests page shows A Question of Faith done, as
  the owner decided (a lost debate counts). Consistent; just be aware that "done" and "come back" sit side by side.

---

## Fine as is (checked, no change needed)

**Story continuity and time of day.** The day runs: Mother's address at noon, the farewell at the east gate, home, the
war room, the bridge, the island; the lamp lights at dusk, the names are read until the moon is high; Yari lands;
the cutter, the archive, the Hall (the engraver "finished it at sundown"; the Chancellor: "Forgive the hour"; the
foreign envoy: the consul went to wait "the moment the lamps lit"), the Cane Road at night (the road sign's "Travel by
day" is a nice irony), the errands by lantern light, the island, then "The island sleeps. At first light the tide
turns" and the dawn farewell. Apart from item 1, nothing names a wrong hour. Elodie is consistently absent: her carriage
leaves on screen, her shawl is on the empty throne, the clerk has her list, the Chancellor governs "in her name, not in
her chair", the consul says she "says it more quietly", Thorne in Chapter 2 says she is "very far away".

**The envoy's scene against Chapter 2.** The consul names no clause and no Throne, so the council's "the seventh
clause of the Accord, as signed" and Yari's "Then show us the seventh clause" keep their surprise. Gianna's remembered
line at the council ("They asked Zetwal to thank them for protecting our waters too. We didn't.") lands right after
the liaison's offer and before the clause is named, so it never collides with Yari's demand (checked in
`tests/choices.test.ts:153-170`). Thorne's "She signs what is put in front of her" now contradicts what the player saw
("Spoken like your mother... She says it more quietly"), which is the point: Thorne is lying, and the player knows it.

**Every scene is acted out, close up.** Mother walks out through the gate; Grandmother turns to the drawer; the
pilgrims come in for the names and the hooded figure watches, then slips down to the dock; Yari runs up from her canoe
and turns to Gianna; the engraver comes in through the front doors to the tile beside Gianna, looks at her, hands the
seal to the clerk, and walks out; the consul waits in the gallery nine tiles from the office (not thirty-five), walks
to the desk beside Gianna, glances at Anissa, and walks out, and the map's `if` keeps him gone (`zetwal-hall.ts:117-
118`); the cutter turns to the stones, and later walks up to the lamp with his hat in his hands; at dawn Grandfather
walks down from the lamp and Grandmother comes over the bridge to the dock, Yari and Anissa board, and both
grandparents turn to the water and wave. Yari is a real follower from the dock on (`rpg.ts:187`), so when she speaks
in the Hall she is standing behind Gianna, not across the room. Nobody speaks from off the map.

**The remembered choices, both branches, every payoff** (route run plus the second run plus `tests/choices.test.ts`):

| Choice | First answer, paid off at | Second answer, paid off at |
|---|---|---|
| Mother at the gate | Grandmother ("she told you more than she told me"), the dock ("She didn't say it had already sailed", before "The Sun Accord. The seventh clause...", so Yari's reply still answers it) | Grandmother ("And did she believe you?" "No." "Neither do I.") |
| Yari at the dock | the canoe ("'Of course,' you said...") | the canoe ("Everything, on the way..."), Yucayeque ("Count them.") |
| The soup vendor | the delivery ("You said it smelled wonderful before you'd tasted a spoon") | the delivery ("cousin's bowl, off the shelf, as promised"); the greeting is asked once, met again she says "Back again, cousin?" |
| The envoy | "Spoken like your mother, Miss Limyè"; the council line in Chapter 2 | "Wise. Not everyone in this city is."; nothing later |
| The veiled woman | (nothing) | the hooded stranger on the plaza after the lamp: "The woman by the mill says you told her to stay away." |

Old saves from before the choices existed get the old lines (Grandmother's "Good. Then she can't scold me for this").
The "Good." twice problem from the outline review is gone.

**Side quests in any order.** Second run: soup greeted, carried and finished before the lamp; the debate listened to and
lost before the lamp; the veiled woman warned; the cutter accepted on the road and the stones read alone before the
lamp; the archivist refused ("Not today") and then accepted before the lamp; Grandmother asked "Never mind", then
answered "Four hundred", then "Forty". After the lamp the vendor hands over the book only, the cutter at the stones
says "she is only in the cane now", the Echo, the list and the charm follow, Yari refuses to sail until the Quests page
is clear, says "Then we wait" on "Not yet", and the chapter ends with the same flags and items as the route. Each
objective of the new Journal order (`island`, `papers`, `boar`, `town`, `errands`, `depart`) was reached in both runs,
and the gold arrow never pointed at something already done. The two new ordering objectives carry no XP (`noXp`), so
the boar is still met at level 3.

**Old saves mid-errand.** `story.papers_asked` (sent to the Iron Market) brings the engraver into the Hall with "Then
you passed him on the way"; `item.elodie_seal` (holding the seal) is taken by the clerk as before; the Market engraver
says "Delivered it myself"; `tests/sideQuests.test.ts:345-416` loads each state from a save code and plays it through.
A save that finished Chapter 1 before the farewell existed gets Grandfather's "ask them, not the Crown" at the lamp.

**Chapter 2 continuity.** `src/data/starts/chapters.json` (regenerated) carries `item.marshal_whistle`,
`item.anicette_kasav: 3`, `item.envoy_papers`, `choice.farewell_why`, `choice.yari_sure`, `choice.soup_smell`,
`choice.envoy_waters`; the whistle is a key item with no stats (Chapter 10 reads it); the kasav is a consumable only
Grandmother gives. The cave's "two nights" is now "tonight" every time (`xaragua.ts:522-535`). The route test checks
that nothing in the bag, gear, gold, XP, spells or party is lost between the chapters.

**Measured.** Route, lamp to card: 565 steps, 14 map changes (outline's "about 500 / 14"). Arrow follower, lamp to card:
567 steps, 15 map changes, on the same path as the route (archive, temple, town, square, Hall, square, town, road, town,
house, town, temple, archive, temple). Whole chapter on the route: 798 steps, 17 map changes.

---

## The port checklist (hand-merge; the demo's root is the quest itself, not `quest/`)

The demo is the pre-Batch-D game with Chapter 2 cut out: no `xaragua.ts`, no `ACT2`, no voyage scene, no rhythm lock,
no `?chapter=` starts, and its own ending. **Do not copy any file whole.** Carry the Chapter 1 parts of each file below
and keep what is marked *keep*.

**Carry across (Chapter 1 content):**

1. `src/data/dialogue/zetwal.ts`: the `Condition` import, `CUTTER_AT_STONES`, `STONES_READ`, `Y`, `OLD_SAVE_FLAGS`;
   `elodie_talk` (the two `set`s and the `why`/`fine` nodes); `soup_vendor_talk` (`smell`, `bowl`, `again`,
   `after_greet`, the `finish` lines, the `overdue` node's `next`); `recruiter_b_talk.after` (the warned-watcher line);
   `anicette_talk.locket` (the remembered lines); `patricio_old_talk.farewell` (the whistle lines; this node is
   reachable in the demo); `name_stones.search` using `STONES_READ`; `yari_talk` (`arrive`'s remembered line and the
   two `set`s, `sure`, `everything`, and the new `depart` node **minus** the `travel.next` and `voyage.next` flags: the
   demo's last line sets only `act1.complete`, and a `travel.next` to a map the demo does not have would strand the
   player); `hall_clerk_talk` (`ask` leading to `engraver`, `sent`, `engraver`, `issue`); `chancellor_talk` (`sign`,
   `waters`, `quiet`, `signed`); `crown_consul_talk` (`day`/`late`); `foreign_envoy_talk` (`day`/`late`/`gone`);
   `engraver_talk` (`delivered`); `cane_cutter_talk` (all of it); `road_watcher_talk` (the `set`). **Not**
   `zetwal_return`, `patricio_home_talk`, `anicette_home_talk`, or `yari_talk`'s `after`/`sail`/`sail_go`/`tide`.
2. `src/data/quests.ts`: the `ACT1` objectives from `island` to `depart` (the new `island` and `town`, the rewritten
   `papers`, `boar` and `errands`). **Not** `ACT2`, the Chapter 2 Journal notes, or the `rhythms` import. Keep
   `CHAPTERS = [ACT1]`.
3. `src/data/sideQuests.ts`: `CUTTER_AT_STONES`, and `cane_name`'s `summary`, `start`, `moved` and last step. **Not**
   `springs`.
4. `src/data/rpg.ts`: the `marshal_whistle` item, the `anicette_kasav` consumable, the comment on `elodie_seal`, and the
   XP rule's `.filter((o) => !o.noXp)` (line 305 in the main game; without it the two ordering objectives pay story
   XP in the demo and the boar fight meets a level-4 party). **Not** the oil lamp, fever bark, Yucayeque food, charms,
   shops, Caona, or `yari`'s `yari_hidden` clause.
5. `src/engine/quests.ts` (`noXp`), `src/engine/sideQuests.ts` (`moved`, `questPlace`, `questNudge`),
   `src/engine/guide.ts` (`sideNudges` through `questNudge`), `src/ui/GameMenu.ts` (`questPlace` in the Quests
   page). These are small and self-contained; the diff is only these lines. `src/scenes/FieldScene.ts` needs nothing:
   the demo already borrows Yari and the follower for stage cues.
6. `src/assets.pixels.ts`: only the `marshal_whistle` picture (21 lines). The engraver, consul and Anicette looks
   already exist in the demo.
7. `tools/maps/zetwal-hall.ts` (the consul's two placements with `if`s), `tools/maps/zetwal-road.ts` (the cutter's
   `if`), `tools/maps/zetwal-temple.ts` (`cane_cutter_stones`), then `npm run maps:build` and `npm run validate:maps`.
   Do not copy the `.tmj` files; rebuild them.
8. `routes/zetwal-act1.json`: the main route from the first line through `"@end-card"`, `"confirm"`, and nothing
   after (the main route continues into Chapter 2 from `"@yucayeque"`). The demo's own route currently ends the same
   way, so the shape is unchanged.
9. Tests: `tests/act.test.ts` (the maps check without `zetwal-market`, the speakers check with `Engraver` and
   `The Crown's consul`; keep the demo's four-test shape, no Chapter 2 cases); `tests/sideQuests.test.ts` (the Batch D
   cases: the cutter's places, the papers in one visit, the old-save states; drop the two lines that expect
   `xaragua-village` and `story.xaragua_arrived` at 422-423); `tests/choices.test.ts` (new; drop or rewrite the parts
   that talk to `xaragua_arrival`, `xaragua_council` and `yari_hidden_talk`, and the `voyage.next` expectation at line
   212); `tests/stage.test.ts` (the four Batch D cases; not the Crown attack); `tests/content.test.ts` (the
   `OLD_SAVE_FLAGS` import and filter; not the rhythm checks). `tests/guide.test.ts` is already identical and simply
   replays the route. `tests/smoke.mjs` needs no change: its marker checks are generic and Batch D did not touch it;
   run it once after the port.

**Keep as the demo has them:**

- `index.html` (the "(Beta)" title, "Echoes Beta", the `BETA` badge) and `src/ui/installScreen.ts:43`.
- `src/data/cards.ts`: the demo's own end card ("Thank you for playing the beta demo!", Chapter 2 on November 22).
- `src/main.ts` (no `VoyageScene`, no `?chapter=` starts), `src/data/content.ts` and `src/data/dialogue.ts` (no
  Xaraguá dialogue, no rhythms), `src/scenes/FieldScene.ts`, and no `src/data/starts/`.
- `netlify.toml`, `README.md`.

**One demo-only line to write.** In the demo the card is the end, and the player stands on the dock afterwards with
Anissa and Yari back beside her (the follower sprites return when the scene ends). Talking to the canoe again plays
the demo's `yari_talk.after`: *"Morning tide. Don't be late, or I'll let the hutia pack for you."* After a scene in
which it is already dawn and the grandparents waved the canoe off, that line is wrong. Replace it in the demo with
something that holds still, for example: *"Everything is aboard, Gigi. The hutia is asleep on the kasav. Whenever you
are."* Also check once in the browser that, after the card, the staged Grandmother is gone and Grandfather is back
at the lamp with his "keep the whistle close" line; both are expected.

**After merging:** `npm run maps:build`, `npm run validate:maps`, `npm test`, `npm run smoke`, and one playthrough in
the browser from the lamp to the card. No deploy until the owner asks (Netlify credits).

---

## Production open items (reminder, most urgent first)

- **Mon Oct 20:** order the board (proof approved Oct 19).
- **Fri Oct 24:** quest art drop 1 waiting on the owner (`docs/quest/ART-PROMPTS.md`).
- **Fri Oct 31:** rules and card text freeze; card art 20 of 126; the balance watch decision.
- **Mon Nov 3:** approve proofs, order B.
