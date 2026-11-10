# Objective review (Nov 7): everything since the Nov 1 playtests

Reviewer: the objective reviewer (Claude, Fable), Nov 7, 2026. Reviewed `claude/keen-tesla-hotff6` at `942a9ce`
(`git log 884dd10~1..HEAD`, 23 commits, Nov 1 to Nov 7). Review only: the only repo change is this file and its
screenshots.

How it was checked: `npm ci`, `npm test` (84 files, 1,346 tests, all pass), `npm run typecheck` (clean),
`npm run level-curve` and `npm run economy`; the dev server on port 5311 driven by Playwright at desktop 1280x800,
phone portrait 390x844 and phone landscape 844x390 (touch, 2x); every `?at=` marker the Nov 1 playtests named
re-played line by line with the party's tiles read from the test hook after each line; the three new side quests
played through in the browser, with `&set=` and `&go=` for the paths the route does not take; the four scenes the
playtests never reached played through; four-foe fights with a full party in all three viewports; a scan of every
dialogue file for narration that moves people without a stage cue. Screenshots are in
`docs/quest/reviews/screens/2026-11-07/` (half size); names below are files in that folder.

## Verdict

The two systemic problems the Nov 1 playtests found are fixed where they were found, and the fixes are real
engineering, not patches: `partyPlacement.ts` settles the walking party beside Gianna on open ground in every map I
stopped in (no column, no overlap, nobody in a wall or off the screen, after walks, doors and jumps), companions walk
on to speak and walk off fading, battles are readable in every viewport (plates never overlap at four foes, the turn
order never cuts a name, HP and SP are labelled, costs say "3 SP"), and every prompt names the device's own buttons.
The three new side quests play through cleanly, including the paths the tests do not take (a lost caravan fight,
Ingrid without Samira, a refused Hrafn), and none can be blocked, repeated or paid twice. What is left is one scene
where the placement engine cannot help because the ground is wrong, a handful of "told, not shown" exits the Nov 7
scan missed, and a phone-sized layout problem in the Quests page. Nothing here should stop the Nov 22 build; the
first two findings should be fixed before anyone outside plays Chapter 10 or the Epilogue.

## Findings, ranked by how much they hurt a first-time player

### 1. The Muster landing stacks nine people in two columns on a one-tile pier, and Anissa takes Gianna's hand from under the dialogue box (Ch10; High)
- **Where:** `?at=muster-landing`, zetwal-harbor. Desktop and landscape.
- **What I saw:** the party lands at `30,13` on the long pier (`data/muster.ts:68`, `landing: at(30, 13)`), two
  tiles wide. The walkers settle Anissa at `30,15`, Yari `31,13`, Azzy `30,11`; the scene then brings Edmund on at
  `31,16`, Samira `31,11`, Vikram `29,9`, Bayarmaa `31,9`, Haru `28,9`, and Anicette and Patricio run in to `30,12` and
  `31,12` (`dialogue/zetwalMuster.ts:119-120`). The result is two single-file columns from `31,9` to `31,16`:
  Anicette stands directly above Gianna and is a hat over Gianna's hair, Patricio stands on Yari, Samira's hat is
  all that shows of her. `muster-07-d.png`, `muster-L11-l.png`. The camera cannot help: the column is eight rows
  tall, so `dialogueCameraY` has no room to move down, and Anissa (two tiles below Gianna) speaks "Gigi. The
  harbor's full" and later "takes her hand" from entirely under the dialogue box (`muster-L9-d.png`,
  `muster-L28-l.png`; the stage lists `follower@30,15`, she never walks up). On the phone the Echo and B buttons sit
  over the box's corners as well.
- **Why it hurts:** this is the chapter's opening and the one scene where the whole company is on screen together;
  it is the Nov 1 "column" finding, unfixed, in the place it matters most, and the hand-taking line is told, not
  shown.
- **Fix:** land the party on the sand, not the pier: make the landing the pier head (`pierHead: at(30, 11)` or the
  beach row above it), or walk Gianna up two tiles before the companions come on. The beach rows (y 9 to 10) are
  three deep and twenty wide; `settleSpots` will put nine people in a half circle there on its own. Give "Anissa
  takes her hand" a `walk` cue to Gianna's side. Then re-check `?at=muster-landing` at 844x390: everyone above the
  box, nobody hidden.
- Fixed (Nov 7): the party is found on the sand at the long pier's root, facing the harbor: `HARBOR.landing` is `30,9` and a new spawn `muster_landing` (`tools/maps/zetwal-harbor.ts`) is where Chapter 9's last line sends the trader (`dialogue/aldermoor.ts`) and where `?chapter=10` starts (`tools/chapter-starts.ts`, `starts/chapters.json` regenerated); Chapter 2's homecoming keeps `harbor_return` on the pier. With `settleSpots` the walkers stand at `29,9` (Anissa), `31,9`, `32,9` and the five brought on at `28,9`, `27,9`, `33,9`, `29,7`, `31,7`: a half circle on the beach rows, nobody in a column. Grandmother and Grandfather come along the beach row and stop on the pier's head (`30,11`, `31,11`), a free row from Gianna and Yari; Grandfather steps up to Gianna for the whistle (`30,10`) and back onto the pier as she speaks; "Anissa takes her hand" walks Anissa to Gianna's left (`29,9`) and turns her to her. `tests/stage.test.ts` checks the spawn, the free row and the walk. Not re-checked in the browser at 844x390 (no smoke run in this pass).

### 2. Four fights still end with the foes vanishing while the narration says they run (Ch6, Ch7, Ch8; High for "shown, not told")
- **Where:** the after-fight scenes the Nov 7 scan did not reach. Each is a `simple(...)` with a bare `nar(...)`
  and no stage cue, while the foes were either stage actors (destroyed when the fight starts) or NPCs hidden by
  the flag the line sets:
  - `dialogue/skarragol.ts:497` `lookouts_after`: "The reavers ride for the far tents, and the lookout runs after
    them." The reavers never appear on the map at all (the lookout shouts "To me! To me!" at nobody), and the
    lookout NPC disappears on `story.lookouts_beaten` (`tools/maps/skarragol.ts:376-379`).
  - `dialogue/kuroshi.ts:675` `stacks_after` (K-2): "The cutpurses drop their boxes and go out by the window, one
    after another, into the fog." The three NPCs vanish on `story.stacks_cleared` (`tools/maps/kuroshi.ts:191`).
  - `dialogue/jwaladesh.ts:733` `quay_watch_after`: "The watch run for the store, lanterns swinging." They entered
    on cue (`jwaladesh.ts:720-729`); after the fight nothing leaves.
  - `dialogue/kuroshi.ts:914` `moths_after`: "The moths scatter into the fog." (lowest; they are moths.)
- **Fix:** the pattern the Nov 7 commit used for the picket and the smuggler chief: `place` the foes where they
  stood, then `exit` them (run) the way the line says, as `caravan_jackals_after` and `caravan_toll_after` do
  (`dialogue/jwaladeshQuests.ts:522-575`). For the lookouts, also `enter` two reavers from the far tents on "To me!"
  before the fight, so there is someone to ride away. A content test would close this for good: every scene named
  by a `battle.after` whose narration contains run/ride/go out/scatter must carry an `exit` cue.
- Fixed (Nov 7): the lookouts: "To me! To me!" now brings two reavers (`steppe_reaver`) at a run from the far tents to the sledges behind him (west: through the east gap to `8,7` and `10,7`; east: from the tents to `26,3` and `28,3`), each lookout with his own after-scene (`lookouts_after_west`/`_east`), where the reavers are placed there and ride back for the tents and the lookout (`npc:lookout_<side>`) runs after them. K-2: the flag takes the map's three cutpurses away (`sync`) and stand-ins at their tiles go out by the high window (`15,3`) one after another. The quay watch are placed where they stopped and run for the oil store's doors (`27,9`). The moths are placed at the fork's posts where they came in and scatter east into the fog bank. The new test (`tests/stage.test.ts`, "the foes who leave after a fight are seen to go") reads every `battle.after` in the data and fails any scene whose narration says run/ride/go out/scatter/flee/bolt without an `exit` cue; it found one more, S-3's `wolves_after` ("The wolves break and run back down the gully"), now acted out the same way (`dialogue/skarragol.ts` `WOLVES`).

### 3. On a sideways phone the Quests page's two columns run into each other (phones; Medium-High)
- **Where:** menu, Quests tab, any chapter with long side-quest titles. `?at=war-song`, 844x390.
- **What I saw:** with the phone's larger text, "[x] Medicine for the Cacique", "[x] Owned or Remembered" and
  "[x] The Treasurer's Daughter" overrun the left column and print under the journal text in the right column
  ("the gun on the headland" over "Medicine for the Cacique"). The right column's last line is clipped by the
  panel's bottom border ("[x] The village by dusk"), and the scroll marker is drawn over the "JOURNAL:" heading
  ("JOURNAL▲Chapter 11"). On desktop the columns touch but do not cross. `menu-quests-l.png`, `menu-quests-d.png`.
- **Fix:** in `GameMenu.drawQuests`, measure the left column's widest label and start the right column after it
  (or truncate titles with an ellipsis to the column width, which `drawList` can do); keep the scroll marker in the
  margin, not on the heading; stop the right column one row above the border. The Status tab's panel only touches the
  d-pad; the battle panel does not (`bat-flagship_hale-03-target-l.png`: the d-pad covers "Gianna" and the ">Yari"
  cursor), see finding 5.
- Fixed (Nov 7): `GameMenu.drawQuests` keeps the list to its column: each title is measured and ends in an ellipsis at the column's width (the whole title is on the right when chosen), the scroll arrows sit in the margin between the columns, not on the heading, and both columns stop a row above the page's foot, where the hint adds "(more to read)" when the entry runs on. Checked at 844x390 (touch, Large text) and 1280x800 at `?at=war-song`.

### 4. "Main: Chapter 1" is the main quest's label in every chapter (all chapters; Medium)
- **Where:** `src/ui/GameMenu.ts:1083`: `e.kind === 'main' ? 'Main: Chapter 1' : ...`. Seen at Chapter 11
  (`menu-quests-d.png`, top left: "> Main: Chapter 1" above "JOURNAL: Chapter 11: The War of the Harbor").
- **Fix:** use the current chapter's number and title (the journal already has them).
- Fixed (Nov 7): the main quest is listed by the chapter the Journal is on ("Chapter 11: The War of the Harbor", `MenuContext.chapterTitle`); the dead "(B to close)" filter is gone (finding 13).

### 5. Touch controls cover the battle panel and the dialogue box's corners (phones; Medium)
- **Where:** 844x390 in every fight and every conversation. `bat-flagship_hale-03-target-l.png`,
  `muster-L11-l.png`, `muster-L28-l.png`.
- **What I saw:** the d-pad's right arm lies over the party panel's names ("Gianna", ">Yari"); the Echo button sits
  on Marine B, the rightmost foe (the one you are targeting), and on the dialogue box's top-right corner; B sits on
  the box's bottom-right corner; Ask sits on the Spark box. Nothing a player must read is fully hidden, but the
  acting fighter's own name is the one under the pad.
- **Fix:** in battle, hide Ask, Echo and Menu (they do nothing there) and inset the party panel by the pad's width
  on the left (the panel's right half is empty on landscape); in conversations, drop the Echo and Ask buttons while
  the box is up. CLAUDE.md asks for 44 px targets, which these keep; the fix is where they sit, not their size.
- Fixed (Nov 7): the field's mode is on `<body data-play>`; in a fight Ask, Echo and Menu are hidden, in a conversation and on a card Echo and Ask. The battle's party rows start after the D-pad where it reaches over the strip (measured from the page, up to 24 game px; the bars give up the room). B stays (it moves a conversation on). Checked at 844x390 in `flagship_hale` and the Kingsmere landing.
- Fixed (Nov 10): Echo and Ask show only on the map. The dialogue box, the menu, the shop, the Journal and cards, and the battle's command grid measure how far the visible controls reach over the picture and keep clear of them (`ui/clearOfControls.ts`, `engine/scaling.ts` controlReach and pageFit): the box narrows and grows taller, the menu and shop pages are drawn at 0.88 between the controls at 844x390 (taps mapped back), the command columns narrow by B's reach. Checked with Playwright (`hasTouch`, `isMobile`) at 844x390 and 932x430 in a conversation, every menu tab, the market stand and `mangrove_crew`: nothing to read under a control. At 667x375 (no side bars: the picture runs edge to edge) the dialogue box keeps clear, but a page cannot keep Large text readable and miss a 132 px D-pad: the pages stop at 0.84, Menu steps aside there, and the D-pad and A/B fade to 40% on pages and in fights until pressed (Claude's call, QUEST-BUILD-GUIDE 9.1); the party names in a fight and the page corners still lie under the faded controls there.

### 6. "Keep playing upright" keeps the Nov 1 portrait: a 390x219 strip under a bigger minimap (phones; Medium)
- **Where:** 390x844, any scene. `port-02-line6-p.png`.
- **What I saw:** the rotate card is good and the sideways picture is now 2x with large text. But a player who
  taps "Keep playing upright" gets exactly the Nov 1 layout: the picture is a 390x219 strip, the minimap above it is
  larger than the game, the dialogue text is about 11 px. The Nov 1 fix list ("put the picture at the top at full
  width, shrink or hide the minimap") was not applied to the upright layout.
- **Fix:** in the stacked layout put the picture first and the minimap under it at a quarter of its size (or
  behind a tap), and raise the zoom so the picture fills the width; it is one CSS layout, `body[data-layout=stack]`.
  If the owner's answer is "the game is sideways", say so on the card and drop the "Keep playing upright" button to
  a smaller "continue anyway" link, so a grandparent is not invited to the worse layout.
- Fixed (Nov 7): upright, the picture comes first at the top, full width (1.22x at 390 px, the most the width allows), with the minimap at about a quarter of its size under it on the left, Ask, Echo and Menu in a column on the right, and the D-pad and A/B centred below. The words cannot be larger upright without another picture size, so the rotate card keeps recommending sideways (Claude's call, QUEST-BUILD-GUIDE 9.1).

### 7. The whistle sends the player to a Journal note that does not count the volleys (Ch11; Medium)
- **Where:** every whistle before a fight, `dialogue/xaraguaWar.ts:109`: "(Volleys left: the fleet's Journal note
  counts them. Three at most before a fight.)". The note, `data/quests.ts:2738` "The fleet", says "One volley for
  every ten soldiers at sea" and never shows a number; nothing in `src/` reads `war.volleys_left` for display.
  `war-01-volley-choice-d.png`.
- **Why it hurts:** the player is told to look up a number that is not there, then asked "Three volleys / Two /
  One / Hold" with no idea whether three now means none later.
- **Fix:** put the count in the choice line itself ("Three volleys (16 left)") with `{war.volleys_left}` in the
  text, and add the same to the "The fleet" note. Drop the parenthetical.
- Fixed (Nov 7): each choice reads "Three volleys (16 left).", "Two volleys (16 left).", "One volley (16 left).", "Hold your fire (16 left)." through `{v:war.volleys_left}`; `GameLogic.view()` (`engine/game.ts`) now formats a choice's text with `formatText` as it does the line's. "The fleet" note says "One volley for every ten soldiers at sea: 16 left." The parenthetical is gone. `tests/readouts.test.ts`; the choice-length check measures the count as shown.

### 8. "Gianna gives old Benny the copy of his refusal" from across the Hall (Epilogue, pardon; Medium)
- **Where:** `dialogue/seatClaim.ts:1222`: a bare line with no cue. Gianna stands at the Master of the Chairs
  (`25,7`) with Anissa; Benny is by the clerk's table on the far side of the nave. `hv0-after-L10-d.png`.
- **Fix:** a `walk` cue for Gianna to Benny (and back on the next line), as the Nov 7 commit did for Hrafn at the
  chest; or let Benny walk to her, since his next line already walks him to the clerk's table.
- Fixed (Nov 7): Benny walks up the nave to Gianna (`24,8`, beside her at the Master of the Chairs), she turns to him, and his next line walks him on to the clerk's table with it (`dialogue/seatClaim.ts` refusal).

### 9. New staged files still stack men without a free row (Ch8 J-5; Medium-Low)
- **Where:** `dialogue/jwaladeshQuests.ts:549-551`: the toll's two enforcers and the bandit enter to `13,12`,
  `13,13`, `13,14`, a vertical file of three with no free row, so each stands on the one above. `j5-toll-L1-d.png`.
  The jackals, side by side at `31..33,11`, are fine.
- **Fix:** `13,11`, `13,13`, `13,15` (or across the road). `tests/stage.test.ts` checks named scenes for free rows;
  make it check every `enter`/`place` set in every scene instead of a list.
- Fixed (Nov 7): the toll men stand across the road at `13,11`, `13,13`, `13,15` (`TOLL_AT`), before the fight and after. `tests/stage.test.ts` now checks every line in every scene: whoever a line places or brings on (and walks, if it brought them on) keeps a free row from the others it brings on (`hidesEachOther`; side by side is fine). It found and fixed: the patrol at the bend (back pair out to the sides), the sergeant at the strand camp (beside Azzy, not above him), Qasim's blade (diagonal), the chief scribe (diagonal to Samira), the factor's marine, the second wolf, the race's chestnut (half a length back and outside), the third oil enforcer, Arjun's riders on the mole (staggered), the almswomen, the pie-shop mother (in her doorway beside her boy), the watch's two ranks at the Assize and at the price (staggered), the seven companies landing in file (rows 8, 10, 12), the Hearing's arrivals from Ardencia and Aldermoor (staggered), and Chapter 11's pier (Rivera behind Rael at his side, Jaime in the longboat, the halberdier not brought on: the two-tile pier has room for one person behind Rael out of his column; Benny beside his son and Nancy at the boat's side). The named test with the party's start positions stays.

### 10. When Gianna stops facing a wall, the party settles in a column behind her (Ch5, Ch11; Low)
- **Where:** `?at=concourse` (Gianna `46,16` facing left against the right wall: Anissa `46,14`, Azzy `45,15`,
  Samira `46,18`), `?at=war-village` (Gianna `1,15` at the left edge: Anissa `1,13`, Yari `2,14`, Azzy `1,17`).
  `conc-00-start-d.png`, `warv-00-start-d.png`.
- **What I saw:** nobody hides anybody (two rows apart), but it reads as a queue against the wall. `settleSpots`
  charges 3 for a tile in front of her and 1.5 for a diagonal front, so with a wall behind and at her sides the
  cheapest tiles are straight above and below.
- **Fix:** lower the diagonal-front cost to 1 when the tiles beside her are closed, or treat "in front of her" as
  only the tile she would step onto. Also the Concourse at the marker is still an empty floor around the party; the
  new landmarks (the tree row) are a screen away. Put one gate or stall in view of the spawn.
- Fixed (Nov 7) for the placement: with nothing open beside or behind her outside her column, the front diagonals cost no more than the side; only the tile she would step onto is in her way. At `?at=concourse` Anissa and Azzy stand on her front diagonals (45,15 and 45,17) and Samira below (46,18); at `?at=war-village` Anissa 2,14, Yari 2,16, Azzy 1,17. Tests in `tests/partyPlacement.test.ts`. The Concourse's landmarks were not moved (map work, not in this batch).

### 11. The pier at Yucayeque is still a file (Ch2; Low)
- **Where:** `?at=yucayeque`. `yuc-07-d.png`: on the one-tile pier the sergeant, the fisher, Yari, Gianna and
  Anissa stand in one column; the Nov 1 fix put Yari and Anissa "in the two lanes with a free row", but at the
  marker they are at `22,25` and `22,27` beside the file and the pier itself is a column of three strangers.
- **Fix:** as finding 1: a one-tile pier cannot hold a scene; move the sergeant's confrontation to the pier's root
  on the sand, where the fisher can stand beside him.
- Fixed (Nov 7): the ferry's boat puts the party on the pier and the scene plays at its root on the sand (`data/war.ts PIER_ROOT`; the spawn `pier` and the arrival's trigger at `21,20`, the sergeant at `22,18`, his marines at `23,16` and `21,16`, maps through `tools/maps/xaragua.ts`): Anissa `20,20`, Gianna `21,20`, Yari `22,20` in a row (where `settleSpots` puts them), the fisher beside the sergeant at his scale (`23,18`) and shoved a step away (`24,18`). The first line reads "Dawn: the ship's boat puts them on the pier." The route, the chapter starts and every replay pass unchanged.

### 12. A card does not re-read the device when the player switches mid-card (all; Low)
- **Where:** a touch device, chapter card up ("(Tap to continue)"); press a keyboard key; the card still says
  "(Tap to continue)" (`btn-card-after-keyboard-l.png`). The device switches on every press (`input/actions.ts:45`)
  but the card's text is set once when it opens.
- **Why it matters:** a touch-screen Windows laptop starts on `touch` (`main.ts`, `isTouchDevice()`), so a
  keyboard player there sees "Tap" on every card until the next one. Everything else I tried (the Echo prompt,
  battle prompts, the credits' last line) was right for the device in use.
- **Fix:** redraw the continue line from `continueHint()` on device change (one event from `setDevice`).
- Fixed (Nov 7): `setDevice` tells listeners on a change (`onDeviceChange`), and every text set once with button names (cards and text panels, the reward card, the item showcase, Anissa's hint; `ui/text.ts` liveButtons) rewrites itself. A card opened on touch reads "(Enter to continue)" after an arrow key.

### 13. Smaller things
- The boar is a four-legged placeholder (`scenes/pixels.ts:321` `drawBoar`); it reads as a boar, barely. Fine
  for now; the Crown troops are still chibi next to the party and Captain-General Hale is a marine with a hat
  (Nov 1 finding 14, not in this batch's list; `bat-flagship_hale-01-commands-d.png`).
- The vault has six sparkles at the door instead of ten (`vault-00-start-d.png`); better, still busy. The guide
  arrow is drawn on Gianna's head there.
- The Hearing hall: the "!" is reachable now (`hv0-00-hall-d.png`, two markers, a clear aisle to `25,7`); the
  crowd below the Throne is still three deep with people in each other's columns (`hv0-after-L4-d.png`, bottom
  left).
- Kirinoura's lantern voyage shows the party's boat ghosted (`voyage-skarragol_kuroshi-b-d.png` is right; the
  Kirinoura one fades the boat mid-crossing). The Kingsmere boat carries three heads for a party of nine; the brief
  said four.
- `GameMenu.ts:1088` filters a line starting with "(B to close)" that nothing emits any more (dead code since the
  button names changed).
- Fixed (Nov 7), the voyages and the dead filter: the boat now stops beside the ship's first visible column, not the picture's empty margin, so off Kirinoura it reaches the lantern trader before it fades. The Kingsmere voyages (`chapter8-end`, `chapter9-end`, `aldermoor-dawn`) carry the four who walk the map (the companion, Gianna, Anissa in her glow, Azzy); nothing to change there. The "(B to close)" filter is removed. Not touched: the boar, the troops' art, the vault's sparkles, the Hearing's crowd.

## The three new side quests

Played through in the browser (desktop), each with the off-route paths:

- **J-5 Jackals on the Salt Road** (`j5-04-after-rise-d.png`, `j5-07-done-d.png`): the board, the master and her
  mules walking ahead stop by stop, both ambushes as real fights with the foes running in and out, the gate, 450 gold
  and +1 Wealth once. **A lost caravan fight** goes to the goddess; Rise puts the party one tile east of the ambush
  line with "Back before the fight", the caravan still waits at its stop, stepping back onto the line replays the
  ambush, and the quest completes. The master's "taken" and "done" board texts stop a second acceptance. The one
  staging fault is finding 9. Writing: in the voice of Agnipur (the Seth, the oil-cart, the salt guild); Vikram's
  "The Seth's men have no Seth this morning" is the right joke.
- **K-5 Ashes of the Temple** (`k5-echo-L4-d.png`, `k5-14-letter-d.png`): the elder's file box, the Echo at Kayla's
  desk with Sayo's agent walking in out of the fog, the nick in the wax, the letter written on the box's lid, Haru
  walking up for his line; in Agnipur, Meera reads it, Vikram walks up, she lays it on the altar step, +40 XP and
  +1 Influence once, and her second talk pays nothing. **Left unfinished when the ship sails:** `closed` is
  `(act7.complete and accepted and no letter) or act8.complete`, so it closes with its own line; a letter written
  and not delivered carries into Chapter 8 and closes there. The Nov 7 fix (the library's Echo opens for K-5
  alone) holds: with `side.ashes.accepted` and no K-2 the zone fires. The date call (Ash Wars burning, Echo fifty
  years) is written into the lines themselves and lands. The feud's `headStart` is data-driven and tested.
- **S-2 The Fleet for Sale** (`s2-ingrid-letter-2-L1-d.png`, `s2-02-hrafn-end-d.png`): the lawspeaker after the horn
  (not at `ordvik-dawn`, where the Crown surveyor still stands on the quay; the quest is right, the jump point is
  before the price), Ingrid with Samira walking on to write the letter and walking off, Ingrid without Samira
  taking 300 gold (and only "Not now" with less than 300), Khulan after the race, Hrafn walking to the Crown's
  chest and back, the lawspeaker cutting the hides, +3 Wealth once and no XP. "Without Samira" is only reachable by
  dev flags (she is in the party from Chapter 4 on), so the gold line is dead on the main route; harmless.
  **Hrafn refusing** (Influence under 12 and Fear under 3) is covered by `sideQuestsLate.test.ts` ("an envoy Ordvik
  does not know is refused until she is known, or feared") and sends the player to the Saga Tent by Bayarmaa's line,
  which stays open at dawn. The promise paid off at the Muster and the Claim is tested in `fleetPromise.test.ts`.

**Is Fear 3 right?** I would make it 2. Ordvik's Fear comes from exactly two choices (`data/rpg.ts:887-888`: the
bout in white won, +2; Grimvald broken, +1), so Fear 3 means "took both", including breaking Grimvald, which is the
chapter's cruel choice. Hrafn's own line on that path is "Ordvik says the envoy does not lose fights", which is
about the bout, not about Grimvald. Fear 2 (the bout alone) matches the line and makes the fear road a show of
strength rather than a reward for cruelty; the influence road at 12 (the route has 16, a reader of few sagas 4 or 5)
is the right gate and stays as it is.
- Done (Nov 7): Fear 2 (`FLEET.fear`, `data/skarragol.ts`; `SIDE-QUESTS.md` S-2; `tests/sideQuestsLate.test.ts` checks Fear 1 from breaking Grimvald alone is refused and the bout alone is enough).

**Do they stand in the main route's way?** No: all three are offered after the chapter's turn (the horn, the Fox,
the Seth), close when the trader sails, and the route never takes them. None adds a windfall: the level curve ends
Chapter 12 at level 30 with every side quest (target 28 to 30), the completionist is at most one level over the
main route in every chapter, and J-5's 560 gold in Chapter 8 is in line with Al-1's 400 and the Seth's strongbox.

## The Nov 1 "Fixed" lines, re-checked at their markers

Chapters 1 to 4: 1 (placement) fixed in every marker I re-took, with the exceptions in findings 1, 10 and 11;
2 (the boar) fixed, `boar-L4-d.png`; 3 (the burning plaza) fixed, `plaza-night-d.png`; 4 and 5 (plates, turn
order) fixed at four foes in all viewports, `bat-flagship_hale-01-commands-d.png`; 6 (button names) fixed
(finding 12 is the one gap); 7 (phone zoom) fixed sideways, not upright (finding 6); 8 (people inside each other)
fixed at the pier, the caney, the forge stairs and the Trial, see finding 11 for the pier's own file; 9 (Anissa's
light) fixed, `lamp-L9-d.png` (the beam is faint; the halo and her moving to Gianna's side carry it); 10 (the
fisher) fixed; 11 (skill numbers) fixed, `caney-skills-d.png`; 12 (HP/SP labels, Spark tip) fixed; 13 (indoor
backdrops) fixed; 14 (art scale) open; 15 (bazaar twins) fixed; 16 (sparkles) mostly fixed; 17 (menu line, wear
offer) fixed, `wear-offer-d.png`; 18 (Echo faces) as noted; 19 (text slips) fixed ("harbour" survives only in
Kuroshi and Jwaladesh NPC ids, not in lines); 20 (voyages) fixed, `voyage-zetwal_xaragua_war-b-d.png`; 21 (jump
replays) fixed, only "Autosaved" appears after a jump.

Chapters 5 to 12: 1 (members speaking off the map) fixed, every speaker I saw was brought on and walked off;
2 (columns) fixed except findings 1 and 10; 3 (A to continue) fixed; 4 (portrait) see finding 6; 5 and 6
(battle labels, turn order) fixed; 7 (the box hides speakers) fixed where the camera has room, not at the Muster
(finding 1); 8 (walls, edges) fixed at `ordvik-grimvald`, `war-village`, `concourse`; 9 (robes) fixed; 10 (twins)
fixed; 11 (the harbor's ships) fixed, the camera crosses the five hulls as each is named; 12 (the Hearing) fixed
for the aisle and the markers, the chairs' lines not checked, the crowd as noted; 13 (fog) fixed,
`maze-00-start-d.png`; 14 (pop-ups after a jump) fixed; after the credits the game goes to the title; 15 (party
list) fixed, scroll marker and plain header; 16 (voyages) fixed; 17 (the court's who-is-who) fixed by the speaker
tag, `assize-00-start-d.png`; 18 (minimap name, Concourse) half: the name is readable, the Concourse see finding 10.

## The scenes the playtests never reached

- **The war's volley choice:** works. The whistle, the choice (three, two, one, hold), the companies' volley as the
  fight opens ("Free Brasador: a volley!", damage on the musketeers), `war.volleys.headland_battery` set. The count
  is the problem (finding 7).
- **The Muster's army screens:** there are none beyond the menu line. The armies are one number ("Armies 165") in
  the menu header and `army.<house>` flags that the Stability score reads per house. A player cannot see which
  houses' companies sailed, which is what the ending turns on. One Journal note listing the companies ("Seven
  companies: Zetwal 60, Ironvow 30, ...") written at `story.muster_begun` would do it.
- Fixed (Nov 7): a Journal note "The companies", shown once the Muster counts them (`muster.resolved`, when `army.<group>` is written), reads the flags as they stand through `{companies}` (`data/content.ts`): "Six companies, 220 soldiers: Zetwal's levy 60, Free Brasador 30, the Ironvow 50, ... None for the Dorini marines." (`tests/readouts.test.ts`).
- **The Hearing's verdict:** works both ways. Pardon gives The Just Throne at Stability 93; Execution, through its
  "The Throne decides once" confirm, gives The Iron Throne at 68; the afternoon is staged in the Hall; the cards,
  The End, the cast and the credits follow, and the credits' Enter goes to the title. `hv0-01-choice-d.png`,
  `hv0-03-card-d.png`.
- **The Accord Stability readout:** it is a Journal note, "The Accord's Stability: 93 of 100, as the realm stood
  when the Throne decided" (`data/quests.ts:2798`). It is correct and it is also invisible: nothing on screen says a
  note arrived, and by then the player is in the ending cards. Show it on the ending card itself (one line under the
  title), or as a toast after the cards.
  - Fixed (Nov 7): the three ending cards show "The Accord's Stability: 93 of 100" under the title (`CardDef.subtitle`, filled from the save); the Journal note stays. A low card whose lines run past the bottom rises to keep its continue line on the screen.

## Placement and staging, tried on purpose

Walked and stopped in the salt flats, the war village, the Concourse, the keep and the Kuroshi quarter, including
corridors and doorways: the party settled beside Gianna every time, never on a person, never in a wall, never off
screen (no case failed, so no screenshot was kept). Jumped to every in-scene marker: no one left on the map
after a scene; borrowed companions walk off fading. The speaker tag was on the right person in every scene I read
(Bayarmaa, Patricio, Anicette, Anissa, the elder, the caravan master, Rael, the Master of the Chairs, the marine
sergeant). Finding 1 is the one scene that defeats the engine, by its ground.

## Battles with four foes and a full party

No scripted fight has more than four foes (`flagship_hale`, `bog_chapel_cell`, the four `harbor_flank_*`,
`caona_stand`, `mangrove_crew`, `file_house_fox`, `marsh_moths`); `battleLayout.ts` is written for six and
`battleLayout.test.ts` covers it. At four, in all three viewports: plates never overlap, the turn strip shows whole
names, the acting fighter has the gold outline, the light and the ">" row, damage numbers float over the plates, and
the tip pages hide the numbers. The only overlaps are the touch controls (finding 5). Party sprites overlap each
other a little (the small Dorini figure in front of the swordsman), which is the art, not the layout.

## Button names, phones, readability

Keyboard: Enter, X, E, Esc, Q everywhere I looked (cards, the Echo prompt, battle target line, Back row, tutorial
pages, the showcase, the credits). Touch: Tap, A, B, Echo. The one miss is finding 12. Sideways phone at 844x390:
dialogue and battle text are large and readable for a child or a grandparent (`muster-L11-l.png`); upright is
finding 6. The touch controls' placement is finding 5; the Quests page is finding 3.

## Checked and fine

- The route's level curve is on target in all twelve chapters, with and without side quests, played with ambushes
  over 200 seeds.
- Every `?at=` marker in `docs/quest/JUMP-POINTS.md` that I used landed where it says, with only "Autosaved" as a
  toast; `&set=` and `&go=` work as documented.
- The reward card's "Wear it now?" offers the right wearer and names the device's buttons.
- Markers and sparkles are hidden while a conversation is open and come back when it ends.
- The Game Over after a side-quest fight returns the party beside the fight's line, and the fight can be retaken.
- No console errors in any run (only the headless browser's WebGL warnings).

## Suggested order of work

1 (the Muster landing's ground), 2 (the four told exits), 3 and 4 (the Quests page), 5 (touch controls in
battle), 7 (the volley count), 8 and 9 (Benny, the toll file), then 6, 10 to 13, and the two readouts (the
companies' note, the Stability line on the ending card).
