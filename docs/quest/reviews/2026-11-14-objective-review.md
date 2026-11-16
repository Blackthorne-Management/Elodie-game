# Objective review, Nov 8 to 14 (everything since `5ca5bc7`)

Reviewer: the objective reviewer (a separate Claude session that did not build any of this). Played on the branch
`claude/keen-tesla-hotff6` at `0c6b721` (the Nov 16 tip; the last quest change is `26ecfc4`, Nov 14) with a local Vite
server and Playwright, at 1280x800, sideways phone 844x390 (touch, 2x) and upright 390x844, through the `?at=` markers in
`docs/quest/JUMP-POINTS.md` and the `window.__quest` test hook. `npm test`: 87 files, 1,422 tests pass; `tsc` clean.
Screenshots are in `docs/quest/reviews/screens/2026-11-14/` (half size; `-d` is 1280x800, `-l` is 844x390).

What this pass covered: every Nov 7 "Fixed" line at its marker and in the places with the same pattern; all six Quiet
Crown cells with and without the Nightingale Key, with the right word and the wrong one, and the route around them; the
expressions and the new walking and battle art; the save path (mid-Echo, after a fight, a pasted code); the first-use
sprite loading and a fight opened right after boot; the Sebastien respelling. What it did not cover is at the end.

## Verdict

Playable end to end, and a real step up from Nov 7: the Muster lands on the sand, Yucayeque plays on the pier's root,
the reavers ride in and out, the Quests page reads, the phone controls stay out of the words, and the six cell
conversations are the best-written small thing in the quest. Nothing found this week blocks the owner's phone playthrough
(Nov 16 to 20) or the Nov 22 release.

Two things should be fixed before release, both small to fix and both the kind a first-time player notices:

1. The Nightingale Key's reward is words. The cells say "Concord +2", the Status page says "Concord 100 of 100" before
   and after. Debates alone push Concord to 95 by Chapter 7 and 100 at the Muster, so four of the six cells pay nothing,
   and the claims in `config.ts` and the tests were measured on a sim that never pays a debate.
2. The painted Crown soldiers made the fights look finished, which makes the un-painted men in the same fight look
   broken: the Chapter 1 caney lieutenant, Captain-General Hale, the Sealbearer, Thorne, and the companions without a
   stance (Azzy, Bayarmaa, Vikram) are walking sprites scaled up beside painted marines, and a fallen Azzy is a brown
   smudge.

Everything else is polish: one expression never shows (a third-argument slip), one grin on an urgent line, the cell sigil
too small to read, and two name labels on top of each other in the first Crown fight.

## Findings, ranked by how much they hurt a first-time player

### 1. The six cells pay "Concord +2" into a score that is already full (Ch7 to Ch12; Medium-High)

Where seen: every cell's last line reads "(The Hall copyist has left the Quiet Crown's cell. Concord +2.)"
(`quest/src/data/dialogue/quietCells.ts:104`; the Journal's "Out of the quiet" line says the same,
`quest/src/data/quietCells.ts:135`). The payment is `MUSTER.concord`'s one-off for `cell.<id>.left`
(`quest/src/config.ts:458`, `CELL_CONCORD` 2 at line 436), paid by `musterTick` and capped at 100
(`quest/src/engine/ally.ts:138`). Debates pay Concord too (`quest/src/engine/debate.ts:204`), and the Status page shows
it: "Concord 100 of 100" at `?at=war-song` (screenshot `menu-status-l.png`).

The route's Concord, read from the dev jump (which plays the route and settles its debates the way a player who wins
them would): 55 at `chapter2-end` (2 debates), 75 at `chapter4-end`, 90 at `chapter6-end`, 95 at `kirinoura-dusk`,
`jwaladesh-day` and `aldermoor-landing`, 100 at `muster-landing` and from there to `the-end` (14 debates). So the
Kirinoura cell pays 2, Agnipur 2, Kingsmere at most 1, and Pòdlimyè, Yucayeque and Eightgate pay 0 while the line says
+2. A player who found the Key, carried it, and worked out six passwords reads "+2" and sees the number not move.

The design note is measured on the wrong number. `config.ts:433` says "the route's 56 Concord reads -4" and
`tests/quietCells.test.ts:184` says "all six together move the ending's Concord part by at most three points of
Stability": both come from the headless sim (`tools/sim-setup`, `starts/chapters.json`), which never settles a debate,
so its Concord stays at the start value plus the Muster's one-offs (53 to 56). In play the Concord part of Stability
(`STABILITY.concordFrom` 75, `concordPer` 5, `concordMax` 5, `config.ts:501-503`) is at its cap of +5 from Chapter 7
on, with or without the Key.

Fix, concrete: (a) make `tools/sim-setup` settle debates like the dev jump does, so the sim's Concord is the route's
Concord and the tests and the `config.ts` note are measured on it; (b) decide what the Key pays. The cheapest honest
option: pay the cells into something the cap does not eat (a flag the ending reads, "six out of the quiet", with its own
Stability point or its own ending line), and never print "+2" when the score cannot take it (`musterTick` knows the
before and after; the line can read "(... Concord +{paid}.)" or drop the number). The bigger option is to reshape the
scale: debates pay +5/+10 each over 14 debates, which is 70 points of a 50-to-100 range before anything else moves it;
`concordFrom` 75 is passed by Chapter 4. Claude's call on which; the reviewer's view is (a) plus the first half of (b)
before release, the scale after.

The opposing case: a player who never finds the Key sees nothing wrong, and the Stability line on the ending card is
already high for this player. True, but the cells exist for the one who does find it, and that player is the one who
reads the numbers.

### 2. One fight, two kinds of art: the un-painted men beside the painted marines (Ch1, Ch10, Ch11; Medium)

Where seen: `speed-proof-zoom.png` (the caney, `?at=proof`, Chapter 1's first Crown fight: a painted marine and a painted
musketeer beside the Marine lieutenant, who is the map's walking sprite scaled up, a yellow sash on a slab);
`art-battle-hale-l.png` (`flagship_hale`: Marine A and B painted, Hale and the Sealbearer slabs between them);
`art-battle-swapped-l.png` (Bayarmaa swapped in beside Samira's stance); `art-battle-down-l.png` (the party down:
Gianna and Samira in drawn down poses, Azzy a translucent brown silhouette).

Why: only four foes have files in `quest/art/enemies/` (boar, crown_marine, crown_musketeer, crown_officer); the
lieutenant's look is `marine_lieutenant` (`quest/src/data/battles.ts:410`, used at `:1653`), Hale's `hale`
(`quest/src/data/warBattles.ts:250`), the Sealbearer's `sealbearer` (`:266`, `claimBattles.ts:18`), Thorne's `thorne`
(`:227`, `battles.ts:422`). `quest/src/scenes/textures.ts:107-109` says it plainly: "the Crown's soldiers fight as their
walking look until their file arrives". Battle stances exist for Anissa, Gianna, Haru, Patricio, Samira and Yari
(`quest/art/battle/`); Azzy, Bayarmaa, Vikram and Edmund fight as walking sprites, and a walking-sprite fighter's down
pose is the brown fallback.

Before the painted marines landed this was uniform and read as the quest's style. Now the painted men set the bar, and
the slab beside them reads as a missing asset, most of all in Chapter 1's first real fight, where the lieutenant is the
boss of the scene and the one the volley tell names.

Fix: the caney lieutenant can reuse the painted officer today (`look: 'crown_officer'`, a bicorne and sash; the marine
lieutenant's own file later). Hale and the Sealbearer: the same officer file with a different tint until theirs arrive.
For the companions, a down pose at least (a sitting silhouette drawn from the walking sheet's colours, not a brown blob),
and Azzy's stance next, since he is in the party from Chapter 2.

### 3. Bayarmaa's "soft" face never shows: the mood is passed as the node's `set` (Ch6; Low-Medium)

Where seen: `?at=ordvik-dusk`, talk to Bayarmaa at the fair: "..." with her plain portrait. `portraits.png` shows the
drawn `bayarmaa_soft.png` exists.

Why: `quest/src/data/dialogue/skarragol.ts:381` is `simple('bayarmaa_talk', [say(BY, '...'), nar('She is watching the
tent flap...')], { mood: 'soft' })`, and `simple(id, lines, set?)` (`:36`) takes a `set` as its third argument, so the
node sets a flag named `mood` to `'soft'` and the line has no mood. `checkDialogue` (`quest/src/engine/dialogue.ts:246`)
validates moods on lines, so it cannot see this one.

Fix: `say(BY, '...', { mood: 'soft' })`.
- Fixed (Nov 16): the mood is on the line (`skarragol.ts`); a test now rejects a node `set` holding a line option. Also worth a one-line test: no node `set` may contain a key named `mood`
(or `fx`, `stage`, any line option), which would catch the same slip anywhere.

### 4. Vikram grins on the line that tells the party to run (Ch8; Low-Medium)

Where seen: `quest/src/data/dialogue/jwaladesh.ts:111`: "The Court. Now. Before somebody... draws a curtain on it." with
`mood: 'out_of_breath'`. The drawn `vikram_out_of_breath.png` (`portraits.png`) is a wide grin, head back: right for
the man who just ran up the stair and made it, wrong for an urgent order. Of the seven `out_of_breath` lines, this is the
one where the face contradicts the words; the others are jokes or arrivals and the grin fits.

Fix: `mood: 'set'` on that line (his other drawn face), or no mood.
- Fixed (Nov 16): `mood: 'set'` (`jwaladesh.ts:111`); the note is in `ART-EXPRESSIONS.md`. More broadly: the drawn expression is "winded and
pleased", and the name invites it onto any line where he has been running; a note in `docs/quest/ART-EXPRESSIONS.md`
("out_of_breath is a grin; use set for urgency") would stop the next one.

### 5. The cell sigil is one or two pixels, so the hint the Key gives has no picture (Ch7 to Ch12; Low)

Where seen: `cell-kirinoura-01-key-d.png`, the Hall copyist with the Key in the bag: the small silver crown on the
`qc_cell_*` looks is a single light pixel on the chest at 1280x800, nothing at phone size. The conversation does the
work ("The copyist's collar is open; a small silver crown...") so the player is told, not shown, which cell this is.

Fix: a two-frame glint on the sigil while the Key is held (the same `glint` object art the maps use for pickups, drawn
over the NPC), or a brighter three-pixel crown on the `qc_cell_*` sheets. Either makes the six people findable by eye,
which is the point of the Key.

### 6. Two name labels land on each other in the caney (Ch1; Low)

Where seen: `speed-proof-zoom.png`: the "Lieutenant" label is drawn above the musketeer's head, and the musketeer's label
is under it (three foes, two labels visible). The lieutenant stands behind the musketeer in the second rank, so his label's
anchor is the musketeer's head.

Fix: in `BattleScene`, stagger a back-rank foe's label up by its height when it would overlap a front-rank label (the
same test the party names use in the strip), or draw the labels in rank order with the front rank last and offset.

### 7. Patricio and Anicette walk up into Gianna's column at the Muster (Ch10; Low)

Where seen: `muster-L21-l.png`: Grandfather steps up to Gianna for the whistle (`30,10`) and stands directly under her
(`30,9`) for a line, then Grandmother at `30,11` below him; the Nov 7 fix put the landing on the sand and the rest of
the scene is clean, but the whistle's step-up is the one moment the free-row rule is broken, on purpose, so he can take
her hand. It reads fine at 1280x800 and a little stacked at 844x390 because the three sprites share a column.

Fix: step him up to her side (`29,10` or `31,10`, diagonal) rather than straight below; the hand still reaches.
- Not changed (Nov 16, Claude's call): tried at `31,10` in the browser; the party stands shoulder to shoulder on row 9, so the diagonal puts him in front of Yari, over a third person. Straight below Gianna, the one he is taking the whistle from, reads better; the step back onto the pier follows on the next line.

### 8. Smaller things

- The test hook throws for a frame while a fight opens: `window.__quest.snapshot()` called between `current = scene`
  (`quest/src/scenes/BattleScene.ts:173`) and `create` reads `this.battle.party` with `this.battle` unset (`:1778`).
  Only the hook; a smoke run that polls while a fight starts will see it. Fix: `if (!this.battle) return null`.
- The Foes tab, Large text: the longest foe lists still run into the "easy, beaten" column (Nov 7's note; unchanged,
  `menu-foes-l.png`).
- The Journal's "Out of the quiet" entry says "Concord +2" as the scene does (finding 1); fix both together.

## The Nov 7 "Fixed" lines, re-checked

Each at its marker, at 1280x800 and 844x390 unless noted. "Same pattern elsewhere" is what else was tried.

1. Muster landing: fixed. `muster-end-l.png`: the party on the sand at the pier's root in a half circle, Grandmother and
   Grandfather on the pier's head a free row away, Anissa takes Gianna's hand at her side and under nothing. Nine lines
   of staging, no column except finding 7's step-up. Same pattern elsewhere: `hear-end-l.png` (the Hearing's arrivals,
   staggered; one adjacent pair, Azzy and a crowd stand-in, for one line), `claim-end-l.png` (the Claim's arrival,
   clean), `yuc-end-l.png`.
2. Foes seen to go: fixed. The east lookout: "To me!" brings two reavers at a run from the tents to `26,3` and `28,3`
   (`raid-L1-d.png`), the fight, then they ride back to the tents and the lookout runs after them to `30,0`
   (`raid-P1-d.png`, `raid-P1-later-d.png`). The stage test (`tests/stage.test.ts`, "the foes who leave after a fight are
   seen to go") covers the cutpurses, the quay watch, the moths and the wolves; those four were not replayed in the browser.
3. Quests page: fixed. `menu-quests-l.png`, `menu-quests-down-l.png`: titles end in an ellipsis at the column's width,
   the arrows sit between the columns, nothing runs into the right column.
4. "Main: Chapter 1": fixed ("Chapter 10: ..." at `war-song`).
5. Touch controls and compact controls: fixed. `battle-commands-l.png`, `battle-target-l.png`: the rails of four
   arrows and A over B hug the edges, the party rows start past them, nothing to read under a control. The dialogue box
   at 844x390 keeps clear (`speed-jwal-l.png`).
6. Upright layout: as described. `speed-muster-pair.png` (390x844): the picture first, full width; the rotate card
   recommends sideways. Note: the rotate card opens over a conversation that is already running (the first line
   behind it has started typing), so a player who taps "Keep playing upright" lands mid-line. Not harmful; worth
   pausing the scene while the card is up.
7. Volley counts: covered by `tests/readouts.test.ts`, not replayed in the browser.
8. Benny's walk to Gianna: not replayed (the pardon ending is behind the Claim; `tests/stage.test.ts` plays it).
9. Free rows: the stage test runs over every scene and passes; the Muster and the Hearing checked by eye (1 above).
10. Settling behind Gianna: fixed at `concourse` (`settleSpots` puts Anissa and Azzy on her front diagonals). The
    lanterns and flower beds are in the first view.
11. Yucayeque on the pier: fixed. `yuc-00-d.png`: Anissa `20,20`, Gianna `21,20`, Yari `22,20`, the sergeant at `22,18`
    and his marines behind him with a free row.
12. Card re-reads the device: fixed. `card-after-key-l.png`: "(Tap to continue)" becomes "(Enter to continue)" after an
    arrow key.
13. The ending card's Stability line: fixed ("The Accord's Stability: 85 of 100" at `?at=the-end`, `ending-card-l.png`).
    The voyages: the boat stops beside the ship's first column at `chapter6-end`; the vault's sparkles and the Hearing's
    crowd as described (`hear-00-l.png`: two ranks, nobody one above another).

## The six cell conversations

All six were played at 1280x800 from their markers with the Key granted (`set=item.nightingale_key`) and without it,
with the wrong word first and then the right one, then re-opened after. Screenshots `cell-<id>-00-nokey`, `-01-key`,
`-02-meet`, `-03-choices`, `-04-right-L1..8`, `-05-gone`.

- Without the Key every one of them is an ordinary villager with an ordinary line (`cell-*-00-nokey-d.png`); nothing
  hints a cell exists. Right.
- Wrong word: "Not today." and the conversation can be reopened and tried again; the right word is not burned. Right.
- Right word: the companion's line (Vikram at Agnipur when he is in the party), the person hears it, Anissa walks to the
  side tile and the person turns to her, the crown comes off in narration, their last line, and they walk off the map
  on the exit path (`cell-*-04-right-L5..7`), the flag `cell.<id>.left` is set, the Journal gets "Out of the quiet",
  re-talking does nothing (`cell-*-05-gone-d.png`, the tile empty). Shown, not told, in every one.
- Concord: paid once (the flag and `concord.paid.cell.<id>.left`), but see finding 1 for what "paid" means on the route.
- Route: none of the six stands on a route tile or a trigger; the Pòdlimyè cell is in the Muster overlay
  (`zetwalMuster.ts:1470`, `recruiter_b_talk`) and the Chapter 1 recruiter script (`zetwal.ts:631`) is untouched, so the
  cell exists only during the Muster. Kirinoura's `when` keeps it out before the quarter's dawn and after Act 7; Agnipur
  after Dhanraj, before Act 8's end; Kingsmere after the Hushed, before Act 9's end; Yucayeque between the war's start
  and the tide; Eightgate between Elodie's rooms and the bell. Kingsmere's right word needs `item.purge_list`, which the
  main route sets (`aldermoor.ts:1498`), so it cannot be locked out.
- Voice: each person speaks in their chapter's register (the copyist's files, the Agnipur clerk's ledgers, the Kingsmere
  pie-shop, the Pòdlimyè recruiter, the Yucayeque fisher, the Eightgate page), and none of them repeats another's lines.
  The best six small scenes in the quest.
- The one visual gap is finding 5: the sigil cannot be seen.

## Expressions and the new art

- Expressions render in play: Samira's `earnest` in the Hall at the Claim (`faces.png`); the drawn set
  (`portraits.png`: Bayarmaa, Haru, Patricio old, Rael, Samira, Vikram) is distinct and reads at phone size. Every mood on a line is one its
  portrait declares (`checkDialogue`, `dialogue.ts:246`); the moods without a file fall back to the plain face silently
  (`DialogueBox.ts:151-152`; the preload only asks for files in the manifest, no 404s in any run).
- Faces changing too often: not seen. The drawn set is two faces per person, and the lines that use them are the turns;
  a conversation goes plain, drawn, plain. The two misfires are findings 3 and 4.
- Walking sheets: Bayarmaa, Haru, Samira, Vikram all face the way they walk in all four directions (`zoomall.png`,
  `art-<name>-left/right/up/down-l.png`), at the party's scale, with the eyes readable at phone size; the mid-step frames
  are theirs. No off-scale sprite.
- The Crown's soldiers on the map (`crown_marine`, `crown_musketeer`, `crown_officer`) match their battle art.
- Battle: the painted marines' hands are on their weapons in every stance (`art-battle-caney-l.png`,
  `speed-proof-pair.png`); the two frames of the lieutenant's volley tell read. The gap is finding 2.

## Saves

- Mid-Echo: a menu Save in the study Echo and in the bridge Echo reloads in the Echo (era `echo`, the shimmer on) and
  Echo returns to the present. Right.
- After a fight: a save on the Zetwal road after the boar reloads at `zetwal-road 9,12` with the boar gone and the
  reward paid. Right.
- A pasted code: a code exported from `kirinoura-quarter`, wrapped at 40 characters with a line of words before and after
  it, pasted into Import, loads ("Save code loaded", `kuroshi-quarter 12,28`; `save-import.png`). Right.
- On a card, a renamed flag, a map or tile that is gone: `tests/saveCompat.test.ts` covers them (`:117`, `:147-174`,
  `:198-233`) and the notices read well ("This version changed the spot you saved on, so you are at the nearest way
  in."). Not reproduced in the browser: a `?at=` jump writes no autosave on a card, and the stored save is a `BQ2.` code,
  not JSON, so the old-flag case could not be hand-made without the engine's encoder.

## Speed

- First spoken line after a cold boot at 844x390: Haru at Agnipur's quay, Haru at the Mere Stair, Edmund at the Muster,
  Elodie at the Claim. The portrait is on the first frame of every one (`speed-jwal-l.png`: frame one is the fade-in,
  frame two 700 ms later; the face is in both), no blank box, no late portrait, no flicker across the two frames once
  the fade is done.
- A fight right after boot: the caney (`?at=proof`, the scene straight into the fight) has every stance on the first
  battle frame (`speed-proof-pair.png`); `headland_battery` and `camp_lookouts` opened from a fresh boot the same.
  The battle art loading behind the field (`textures.ts` `loadBattleArtBehind`) is not visible from the player's side.
- No console errors in any run except the test-hook throw in "Smaller things".

## Sebastien

No player-visible "Sebastian" anywhere in `quest/src`, `quest/art`, `quest/routes` or `quest/public`; the only
occurrences are the rename itself (`saveFallbacks.ts:18`) and this review's prompt. A save carrying
`story.sebastian_met` is renamed to `story.sebastien_met` on load, and that flag is what sends the loft script to
`waiting`, not `loft` (`aldermoor.ts:648`), so his meeting does not replay. His line at `:631` reads "I'm your uncle
Sebastien."

## Not covered

- `npm run smoke` end to end (not run this pass; the engine tests and the markers stood in).
- K-2's cutpurses, the quay watch, the moths and the wolves leaving after their fights (test-covered, not replayed).
- Benny's walk in the pardon ending; the volley choices in the browser.
- A real slow phone: the speed checks are a desktop browser with a phone viewport, so they can say the portraits are
  not late on first use, not how long the first map takes on a 2019 phone.

## Suggested order of work

1. Finding 1: settle debates in the sim; stop printing "+2" into a full score; decide what the Key pays.
2. Finding 2: the caney lieutenant to the painted officer; Hale and the Sealbearer tinted from it; a drawn down pose for
   the walking-sprite fighters.
3. Findings 3 and 4 (two one-line edits) and the `set`-key test.
4. Finding 5 (the sigil glint), 6, 7, and the smaller things.
