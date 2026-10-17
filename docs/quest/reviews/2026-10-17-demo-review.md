# Independent review of the demo (Chapter 1), Oct 17

By the owner's separate reviewer session, from the repository
(Blackthorne-Management/elodie-game-demo, commit `6aa4aa4`). Saved in full, unedited, as the owner pasted it.
Claude's responses and what was done about each finding: `2026-10-17-demo-review-response.md`.

---

Verdict: The writing, the Echo/anchor idea and the engine discipline are well above demo grade, but the chapter peaks at the lamp around minute six and then spends 60% of its walking on a three-building fetch errand before ending on a text card. On a phone, most testers will never see any of it, because the link refuses to play in a browser.

Checked against commit `6aa4aa4`: `npm test` (356 tests, green), the full smoke run (passed, 70 screenshots, no page errors), the route replayed through the simulator for pacing numbers, and the boar fight run 300 times per strategy through the real battle engine.

## Findings, most serious first

1. Blocker: phones cannot play from the link. `src/engine/install.ts` `installGate`: any mobile user agent not opened from the home screen gets the "add to home screen" page instead of the game. Testers who open the link from a chat app's in-app browser (Discord, WhatsApp, Instagram) cannot add to home screen at all, so they bounce. iOS Safari users must do Share > Add to Home Screen before the title screen. Fix: play in the browser and show the install tip as a dismissible banner, or at least offer a "Play here anyway" button under the steps (`?install=0` already exists; expose it).
2. Major: the intro promises a crowd the game never shows. The 91-second film ends on a plaza packed with hundreds of people (public/intro, frame at 80 s), then cuts to `zetwal-town` with 16 NPCs across 40x28 tiles; the plaza screenshot shows six. The first spoken line is "Gigi... there are so many people." Same on the island: "Pilgrims stranded since dawn crowd the path" over four sprites. Fix within the engine you have: a `walkers` layer of 15-25 non-interactive festival-goers on the plaza and 6-8 on the temple path, cleared by `story.anissa_woke`.
3. Major: the only fight is over before anything it teaches can happen. Boar: 55 HP, Gianna L3 with Yari. Measured over 300 seeds: Sunthread as Anissa advises kills it in 1.2 Gianna turns; the Charge tell fires in 0 of 300 fights, the Surge tip in 0 of 300, Anissa's Light (every 3 turns) in 0. Yet `data/battles.ts` front-loads a 9-page tutorial (Guard on the tell, Spark, Surge, rows, Swap, Equip, spell slots) before the player has pressed a button. Attack-only with Gianna alone loses 100%; with Yari wins 100%. Fix: boar HP x2.5 (or a second boar), cut the opening tutorial to 3 pages (turns, Skill, Guard), and move Spark/Surge/rows pages to a second fight or to the first time they become relevant.
4. Major: Yari is in the fight but not on the map. `data/rpg.ts` `yari.joins: story.yari_asked`; the dock NPC stays at (14,17) with `if: story.anissa_woke`, and only Anissa follows (`FieldScene.ts` has one `follower`). So Yari says "I'll come with you" (`yari_talk.ready_boar`), stands on the island while you walk the city for 300 steps, then shoots the boar from your party line. Fix with existing tools: a `place`/`walk` stage cue when she joins and a second follower sprite, or keep her out of the party until `act1.complete` and tune the boar for Gianna alone.
5. Major: the back third is a fetch loop with the stakes gone. Route profile per objective (steps, dialogue lines): lamp 2/29, dock 13/21, papers 215/23, boar 99/5, depart 58/2. After the lamp, 372 of 618 steps are Hall > Market > Hall > Chancellor > gate > road > dock, through 10 map transitions, for 30 lines. The Charter of Protection threat Yari brings is never dramatised; the chapter closes on "Let's go" and a black card. Fix: let the engraver be in Accord Square (one map, no Market loop), have the Chancellor sign in the same visit as the clerk, and put the boar on the way back from the Hall instead of a separate trip.
6. Major: the signature puzzle can be solved before it is posed. `tools/maps/zetwal-town.ts`: the `plaza_stone` Echo zone needs only `item.sun_locket`. A player told to "try the Locket" can enter the plaza Echo, walk to the bridgehead (sentry at 26,10 leaves 26,9 open), and the `winch`/`pawl` echo objects have no `if`. The choices "Turn the winch" and "Drive the pin through the pawl" are offered cold; `anchor.chain_bridge` is set before the night orders exist, `bridge_echo_return.carried` never plays, and `loose_board`'s "Not for long" lands after the bridge is already down. Fix: gate the `winch`/`pawl` echo objects with `clue.night_orders` (or give the plaza zone `if: story.warroom_echo`).
7. Major: important moments are told, not staged. `grep stage:` over all dialogue: 3 cues in 1,789 lines (Elodie's exit, Anicette's two turns). Not staged: the hooded figure watching Anissa and slipping to the dock (`gaze_lamp.wake`), Yari's canoe arriving, the names being read "until the moon is high", the lamps lighting across the city (one small halo on the lamp sprite in `quest3-lamp-lit`), the rope bridge having fallen "at dawn". The engine in `engine/stage.ts` supports enter/walk/exit/look/sync; it is barely used. Fix: five cues would do it, starting with recruiter_b (`quiet_crown_f_tan`) entering, pausing at Anissa, exiting to the dock during `gaze_lamp.wake`.
8. Minor: the Echo zone and fountain read as placeholders. The "shimmering air" is a flat translucent cyan rectangle; the fountain is four pale squares (`quest3-plaza-present`). On a 320x180 canvas these are the two biggest shapes on screen. Fix: an animated 2-frame shimmer tile, and a fountain drawing like the other story objects have.
9. Minor: the boar ambush can be met early and alone. `town_gate` opens on `story.warroom_echo`; the `boar_ambush` trigger needs only `party.anissa`. A player exploring after the war room meets the boar at L2 with no Yari; attack-only loses every time (restart with a Grudge, no game over, but no explanation of why). Yari's later "Mind the Cane Road, a boar..." is stale if it is already dead. Fix: add `story.yari_asked` to the trigger's `if`.
10. Minor: portrait phone wastes the screen. `quest-phone-portrait.png`: the picture is 440 of 1690 px tall, with a 270 px D-pad below and a "turn your phone sideways" line. Fix: in portrait, scale the picture to the width and overlay the controls.
11. Minor: three choices in 12 minutes, and two are cosmetic. Of 6 choice prompts on the route, "Of course I'll come" / "Tell me everything" both go to `yes`; "It smells wonderful" / "Save me a bowl" both go to `thanks`. The only consequential choices are in the optional debate. Fix: give Elodie's farewell choice a callback line in Anicette's `locket` node (she already asks "Did your mother get away?").
12. Polish: end card. Three lines of text on black (`quest3-end-card`). Fix: reuse the intro's last frame or the lit-lamp screen under it, with the farewell music.
13. Polish: stale comments mislead the next builder. `data/encounters.ts` and `engine/game.ts` still say "Chapter 1 has no fights" and "until Phase 3 battles exist, Fight always wins"; `rpg.ts` xpRules says the same. The encounter stand-in script (`encounterScript`) is still the live path for the `cane_road` zone, so when `story.zetwal_return` is set the bandits will be a text choice that always wins, not a battle. Note it now or route the zone to `BATTLES`.

No soft-locks found: every door, zone and NPC gate is reversible, `echo.*` flags are wiped on return, losing a fight restarts it, every conversation autosaves, and a reload inside an Echo keeps its flags.

## The three changes that would most improve the demo

1. Let phones play from the browser (finding 1).
2. Put people on the plaza and the island, and stage the lamp scene (findings 2, 7).
3. Compress the papers errand into one Hall visit and make the boar a real three-turn fight (findings 3, 5).

## What works and should be kept

- The dialogue voice: the soup vendor, the ferryman and the crate, the Keeper of the Seal, the pickpocket. Anissa's lines in the lamp scene are the best writing in the demo and the no-jokes rule for her holds.
- The Echo loop (`echo.*` wiped, `anchor.*` carried, the changed object glows) is a clean mechanic and the war room teaches it in six steps.
- The intro film and the character portraits are strong.
- Engineering: pure-TS `GameLogic` shared by the field scene, the simulator and the smoke test; the route replayed key by key against the simulator; content tests that catch flag typos and overlong lines; autosave at every conversation. Adding chapters is mostly adding data. Risks for growth: `FieldScene.ts` (1,820 lines) and `GameMenu.ts` (1,068) are the two files everything lands in, and flags are untyped strings held together by the content test.

## Not checked

- Sound: the music files exist (10 tracks) and the audio plan is tested, but I could not hear the game or judge the SFX.
- Real touch input, gamepad, and performance on a low-end phone; the smoke run uses a desktop Chromium with phone-sized viewports.
- The live Netlify build beyond confirming the repo builds and the route passes locally.
