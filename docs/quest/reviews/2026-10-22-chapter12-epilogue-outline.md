# Chapter 12, The Claim (Eightgate again), and the Epilogue, The Hearing: build outline (Oct 22)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: two, each with its
recommendation; the build goes ahead on the recommendation); everything else is Claude's call with its reason.
Sources: `PLAN-ALL-CHAPTERS.md` (Chapter 12 and the epilogue Nov 13 to 16, **30 minutes, levels 28 to 30**, then the
whole game played through Nov 16 to 21 and the release Nov 22; the plan's rule that every chapter keeps the main
story acted out, the boss, the Echo puzzle, the debate as a required quest, two required side quests, mystery quests
and arrows, Game Over), `design/STORY.md` Chapter 12 (the Claim on the Throne tile, the Regent's Challenge, the boss at
30, Azzy's choice on the spot: renounce, share, or Challenge; "everyone present"; after the fight the Echo "shows
young Patricio, Benny and Caona one last time (proposal), and Caona's oath is spoken aloud in both eras") and the
Epilogue (the Hearing's witnesses and verdicts, the Just, Hollow and Iron Thrones; "I never asked the eggs how they
felt. I am asking now."), 4 (the threads: the Seventh Clause pays off "Ch. 12 and the Hearing"; Anissa "speaks at the
Hearing"; the Seat item "changes the Claim"), 5 (no jokes in the Rael, Anissa or Hearing scenes), 6.3 (two reveals:
the Hushed in Chapter 9, Rael's public confession at the Hearing), 6.13 (**open: does Patricio know about the
marriage?** Not decided here; section 9.5 stages him so either answer fits), `QUEST-BUILD-GUIDE.md` 5.6 (the Claim
"per rulebook Section 8"; the Hearing's witnesses: the Ardencian rebel leaders he fed and armed, the family of the
treasurer he kept captive for years without trial, the underground cells he funded, Elodie, Azzy, Anissa; the
pardon's confirmed terms: Warden of Oaths, the Office of Oaths, the public confession, the captives freed,
restitution, the elders to account; exile; execution), 5.7 (Accord Stability 0 to 100 from allied houses kept, the
Unpaid Debt paid, the Harbor Turn, the Hearing verdict, Concord, unresolved side quests; the three endings' needs and
results, the "final text scroll"), 5.8 ("the pardon is earned at the Hearing, not given by the plot"; the theme
"again, quietly, at the Hearing"), 7.2 (after the Harbor Turn every hub's corner asks *a faith that began as a
political tool: is it still a faith?*), `docs/bloodline-rulebook-draft.md` Section 8 (eligibility at 10 across the
pillars or 6 in one; the Claim on the Throne tile; a Challenge "must be met: immediately"; several challengers "one
at a time, in turn order starting from the claimant's left"; a claimant who beats every challenger "wins the game
immediately"), `design/CAPITALS.md` 5 (Eightgate's sections; the Hall's four books and the Archive's; the Crossroads
Fields' table "after the War of the Harbor: Husher and Regent's Sealbearer groups, Crown Marine and Officer (28 to
30)"; the Envoys' Outfitter "tier 28 gear (Ch. 12)"; "in Chapter 12, Patricio, Benny and Caona one last time"),
`design/SECRET-ITEMS.md` 9 (the Seventh Ribbon, after the release: at the Claim, +15 Stability, +10 Concord, the
harbor returned by law before the Hearing), `design/SIDE-QUESTS.md` Se-1, Se-2, Se-5 (the tokens placed in the Throne
Hall before the Claim: 400 XP, +5 Stability, the standing-council scene; the Oct 22 call that a token is given when
the alliance is made), `design/PUZZLES.md` SIG-SEA as built (drawer 4; "Matters touching a clause are filed with the
clause"), `design/FAMILY.md` (Edmund "the Hearing beside his mother"; Rosalind, Benny, Nancy, Rael's guard "the
Hearing"; Patricio "testifies at the Hearing" is the guide's proposal), `design/COMBAT.md` 6 (the curve `LEVELS` 50 /
1.6: **28 at 9,753, 29 at 10,338, 30 at 10,936**, the cap 30; `XP_PER_OBJECTIVE_BY_CHAPTER` has nine rows, the last
70; "Ch. 12 at 30"), 12 (Game Over as built), 13.3 #10 (**the Lord Regent Aldric Vane, level 30, HP x10 / ATK x1.25,
three phases: The Patient Court, The Charter, One Hand; "On defeat: Azzy's choice"**), 14 (Story x0.7 damage, x0.8
HP), 15 (tiers 24 and 28); the **Chapter 9 outline, its review, decisions and Built section** (the Regent presides at
Kingsmere and goes home; "Nothing in this chapter is provable against him, which is why Chapter 12 is a Challenge and
not a trial"; the Almoner is Chapter 1's veiled woman, tried or shown; Rosalind withdrew; Jordyn's company; Sebastian
to Eightgate's recital and then Pòdlimyè); the **Chapter 10 outline, its review and decisions** (the ally ledger and
`army.*`; the tokens: three carried, the Dorini token from Rashid or "at the Claim by Layla if Al-Doria is kept";
Elodie at Eightgate "till the Crown lets her go"; Patricio did not sail; Rahel and Patricia on the pier; Azzy
commands Free Brasador; Anissa's "Anissa. I hold the door." and her public sentence; `clue.four_accounts` pays "a
Hearing line"); the **Chapter 11 outline, its review and decisions** (Hold / Strike restaged with the signet's lie;
the token glows at the Ash Road; on Strike "To a Throne. Not to a watch." and Rael not arrested; **owner decision Oct
22: on Strike Azzy stays, furious, and his anger colours the Claim**; the conch token from Anaco through Yari; the
`stability.*` inputs recorded as flags and "the score itself is Chapter 12's"; Thorne spared to the *Patience* or
chained; Benny on Rael's ships (Trust) or left on the island (Strike); "Rael is not on the roster"; section 14's list
of what Chapter 12 reads); and the **built game** on this branch (Chapters 1 to 9: the chapter10 branch is behind
HEAD and `chapters.json` has a Chapter 10 start, so **Chapters 10 and 11 are outlined, not built**): `quest/tools/maps/seat.ts`
(seven maps; the Hall 44 x 32 with **the Throne tile at (21, 2), 2 x 2, on the dais**, "Nobody has stood on it in
fifty years", **the violet rope at (16, 5), twelve tiles wide, `if: '!story.claim_begun'`**, two rope Sealbearers at
(15, 6) and (28, 6), **the eight chairs on row 8** west to east zetwal 14, xaragua 16, ardencia 18, al_doria 20,
aldermoor 23, skarragol 25, kuroshi 27, jwaladesh 29, the chambers' doors (west x 1: zetwal 11, xaragua 15 bricked,
ardencia 19, al_doria 23; east x 42: aldermoor 11, skarragol 15, kuroshi 19, jwaladesh 23), the envoys placed at them
with no condition, the chamberlain at (33, 28), the Regent at (23, 3) `if: '!story.elodie_hall|story.hollis_agreed'`,
the heralds' stair behind the Throne, the door at (21, 31); the Concourse's eight gates as door objects and the
`iron_gate` spawn (44, 26); the Fields 46 x 28 with the `crossroads` table `if: 'story.seat_arrived'`; the Archive
with SIG-SEA's drawers), `data/dialogue/seat.ts` (Elodie's two lines as `ELODIE_LINES`; the Regent's "I will be here. I
am always here."; his terms; Hollis's reading of the clause and "No signature. The clerk's seal alone. And the seventh
ribbon carries no witness knot."; Yari's hand on the eighth chair, "Fifty years. Nobody revisited it. We fought beside
you, and you wrote us down as waters."; the chamberlain's "The chairs fill at a Claim, not a Parley. Bring me a token
of goodwill from every house that will sit with you."; `chair_xaragua`: "Xaraguá's chair: the eighth, with no chamber
behind it but a wall."; Elodie's "I married your father in secret... I took it so no one would count you."; "Azriel."),
`data/sideQuests.ts` (`seats`, stage 1 built; "Stage 2 (the houses' tokens) runs through Chapters 6 to 12"),
`data/rpg.ts` (`token_ironvow`, `token_suzumori`, `token_agnivansh` built; the petition "received forty-nine years ago
and never heard"; the Crown's pact, the Ash Road Accounts, Thomas's record, the Crown Chronicle, the purge list),
`data/books.ts` (nine Seat books built: the Regent's Commission, Petitions of Breach, the Council of Eight, the
Seventh Clause, the Weaving, the Founding Compact, the Accord Sealed, the Throne's Clerks, the Claimant Families),
`data/dialogue/ardencia.ts` (the reveal: "Elodie Limyè is my wife. You and your sister are my daughters." / "It
changes nothing. You lost."; the token's glow `fx: 'token'` and the signet's lie `fx: 'signet'`; old Benny "I made the
other half"; the treasurer "I am alive. I am held where the ash falls."; Azzy "There are two of us with a claim to
that seat now. I did not want it when it was one."), `data/dialogue/skarragol.ts` (S-5: Azzy's three answers
`choice.azzy_ordu` influence | fear | share, "remembered for Chapter 12's Claim"; "Then it is not for one of us."),
`data/dialogue/zetwal.ts` (Chapter 1: "The Gaze sees you both. So do I."; "...Are you scared of me?" / "Never. Not for
one second."; "Two halves of a promise, he said. This half is ours."; the hooded figure at the lamp; "Stay away from
her" `choice.warned_watcher`), `data/dialogue/aldermoor.ts` (the Regent at the Assize: "After the Assize. With a
fleet. That is a revisiting."; "The Lord Regent Aldric Vane: grey, thin, a chain of office."; to Edmund: "Your mother
sits on my council."), `data/gameOver.ts` (the goddess: "I am Elodie. I wove this realm, and I remember all of it." /
"Elodie? Like my mother?" / "I do not rule this world. I only remember it."), `engine/battle.ts` (`BattleDef.fighters`
for a duel, `binds`, `phases` with `enter`, `withdraws`, `protects` at `INTERCEPT_CHANCE` 0.75, `seize` with Gianna
stepping in, `armored`, `boss`, `hpScale`, `atkScale`, `magScale`; the statuses `hushed`, `weakened`, `stunned`,
`inspired`, `marked`, `warded`, `regen`; no Dawn Surge: `SURGE_COST` 5 and `SURGE_MULT` 1.5), `engine/debate.ts`
(`concord` flag from `CONCORD_START` 50; Mediate at the city's Influence), `engine/rpg.ts` (`globalPillar`, `armies()`),
`config.ts` (`CHAPTER_LEVELS` 12: Eightgate again 28 to 30; `LATER_STORY_FLAGS` already lists `story.claim_begun`;
`GRUDGE_MAX_BOSS` 0.5; bands trivial 3, hard 2, deadly 5), `data/cards.ts` (one card per chapter; the demo
repository "keeps its own card"), `scenes/FieldScene.ts` (the Credits screen from the System tab), `tests/seat.test.ts`
("nobody says 'Rael' and 'father' in the same line anywhere in Eightgate").*

**Sim-check (honest).** This outline runs no simulation: Chapters 10 and 11 are not built, so there is no Chapter
12 start save, no Rael entry, no Hale, no Sealbearer at 28, and the party's gear at the chapter's start depends on
Chapter 10's forge (tier 24) and this chapter's outfitter (tier 28). Section 5's numbers are **targets from the
Chapter 11 review's sim** (the roster four at tier 24: Rael x6 with two guards 27 to 31 actions and nobody Bound;
Hale x6 18 to 21; the review's gates: a boss 28 to 34 actions with a fall in one in four at the band's floor,
every seed won at the boss Grudge with start gear), scaled to 30, and are marked for the build's day-1 sim.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17): the fleet lands,
the party walks in at a gate, the tokens are set on the chairs by hand, Hollis walks the nave with the petition, Gianna
steps onto the tile, the Regent comes down the dais, Azzy walks to the tile or to Ardencia's chair, Rael walks in
under guard and kneels, every witness walks to the chairs and speaks there, the verdict is carried out where the
player can see it; Anissa is never hit, never a target in the engine's sense (the Regent's Seize is the built
Gianna-steps-in path), never a combatant and never jokes; the comedy stays in the Concourse and the fields and out of
the Hall; **no joke in any Rael, Anissa or Hearing scene** (STORY 5); recommendations only where they genuinely help;
placeholders wherever art has not arrived; this chapter gets the main story (the arrival, Mother, the chairs, the
petition's Echo, the Claim, Azzy's choice, the Challenge, the Hearing, the ending), the Echo puzzle (one scene), the
boss (the Regent), one debate (required: the corner after the Harbor Turn), **two** required side quests (both
payoffs of threads, not errands: section 7), mystery quests and arrows, Game Over, the end card and the credits, and
nothing else until after the release.

---

## 1. Where the chapter starts (measured against the Chapter 11 outline, section 14, its review and decisions)

- **Chapter 11 ends** in Anaco's caney at night: the oath's first line said by the cacique, "Someone must go and
  stand on it.", the conch token from Anaco through Yari ("Mine to carry. Yours to set down."), Rael at the doors on
  Trust ("I will be at Eightgate. Not beside you. The Throne has a Hearing for men like me, or it will have one.") or
  Benny alone on Strike ("He went north. He left me. He said you would need a witness more than he needed a
  father."), Anissa's "I held it.", the card *Chapter 11 complete, The War of the Harbor. Next: Chapter 12, The
  Claim* (`act11.complete`). **`?chapter=12` starts at Eightgate's Ardencia Gate** (beat 0: the voyage and the road are
  the chapter's first picture, then the walk in).
- **How they get there (Claude's call, section 12):** Eightgate is inland (`realmMap.ts`: the Seat at (68, 64); the
  voyage engine's shores are the seven coastal capitals and no Seat), and Chapter 5 came by the Gold Road from Al-Doria
  as a card. The fleet sails north from Yucayeque up the strait to **Ardencia's strand** (the built shore `ardencia`
  and Chapter 3's camp, `ardencia-camp`, where Azzy joined and Free Brasador was born), a new voyage `xaragua_ardencia`
  (the plotter's path from (46, 32) to Ardencia's coast; by day; the captions name the ships: on Trust the black
  and crimson sails lead, on Strike the trader), and the **Ash Road** south to Eightgate's Ardencia Gate is a card
  (*The Ash Road*: "Three days south on the road Rael is Warden of, past the mills the Ash Ledger paid for. Eightgate
  at dusk."). On the Concourse the eight gates lie on the ring wall on the side their country lies (Chapter 5's Built
  section: Ardencia north). The party walks in at the north gate, not the Gold Gate: the road the Regent took home
  by sea is the one they take by land, and the Ash Road pays its name on the last day.
- **The party on the route:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram, Edmund, Anissa (nine, eight
  fighters, four active by the roster order unless Chapter 8 to 11 built the order screen), Salkhi (on the Fields
  only); **level 28** (29 for the Chapter 11 review's wanderer). Section 5 plans from **9,753** (the floor of 28) and
  shows **10,220** (the review's likely Chapter 11 end) and **10,338** (a 29 start). The Echo party: Patricio, Caona,
  Benny, at the party's level. Gold about 2,500 to 4,500 (Chapter 11's: nothing to buy on the island; Hale's axe on
  Trust). **Rael is not on the roster** (`party.rael` false: tested at Chapter 11's card).
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's half-sheet, the Dorini pass, the Brasador
  coin, the Marshal's whistle, **the four tokens** (`item.token_ironvow`, `item.token_suzumori`, `item.token_agnivansh`
  built; `item.token_dorini` from the Muster if Al-Doria's share was at least 1, else "at the Claim by Layla if
  Al-Doria is kept"; **the conch token** `item.token_xaragua` from Chapter 11), the petition's copies, the Fog Files,
  the Fox's receipts, Dhanraj's ledger, the Crown's pact, **the Ash Road Accounts, read** (`clue.ash_road_read`),
  Thomas Stillwater's record, the Crown Chronicle, the purge list, Kayla's crane, Aiyana's disc, Edmund's hat, the
  recital bill, the Almoner's brooch, the smugglers' ledger, the companion's charm (if a house was betrayed), Hale's
  boarding axe (Trust).
- **Flags that matter here:** `war.trust` | `war.strike`; `story.harbor_taken` (both routes, the review's fix),
  `story.harbor_won` | `story.fleet_escaped`; `stability.harbor_trust` | `stability.harbor_strike`,
  `stability.fleet_struck` | `stability.fleet_escaped`, `stability.xaragua_freed`, `stability.elders_agreed`;
  `choice.truth_answer` (tested | lied); `choice.thorne_spared` | `choice.thorne_broken`; `choice.flank_spared` |
  `choice.flank_bound`; `army.*` as the war left them; `muster.betrayer.<house>` with `muster.betrayed` | `muster.turned`;
  `ally.xaragua`; `story.wounded_sheltered`; `story.regent_retreated`; **from Chapter 10:** `story.patricio_told`,
  `clue.four_accounts` (the Concord +3 and "a Hearing line"), `clue.signing_morning`, `story.blessing`, the feuds'
  outcomes; **from Chapter 9:** `story.hushed_beaten`, `choice.hushed_tried` | `choice.hushed_broken`,
  `story.rosalind_withdrew`, `story.jordyn_defected`, `story.edmund_defied`, `side.purge_list.done`; **from Chapter 6:**
  `choice.azzy_ordu` (influence | fear | share); **from Chapter 5:** `choice.refusal` (asked | protest),
  `clue.seventh_clause_read`, `choice.patricio_protest`, `anchor.ribbon_thread`, `side.seats.stage1`,
  `debate.seat_voices.*`, `story.terms_refused`; **from Chapter 3:** `story.signet_glowed`, `side.treasurer.done`,
  `clue.treasurer_alive`, `side.bread.done`, `clue.bread_night`, `ally.free_brasador`; **from Chapter 1:**
  `choice.farewell_why` | `choice.farewell_fine`, `choice.warned_watcher`, `choice.yari_sure` | `choice.yari_everything`,
  `choice.envoy_waters`, `story.lamp_lit`, `story.anissa_woke`; `belief.rael_traitor` cleared and `belief.rael_truth`
  set by Chapter 11; `concord` (from 50); the `pillar.*` flags; `gameover.count`.
- **What the realm said about this day before now:** the Regent, Chapter 5: "I will be here. I am always here."
  and "Then win the houses, if you can. Eight gates. The roads are open. They always were."; the chamberlain: "The
  chairs fill at a Claim, not a Parley."; the throne tile: "Nobody has stood on it in fifty years."; Yari: "Fifty
  years. Nobody revisited it."; Azzy, Chapter 3: "There are two of us with a claim to that seat now. I did not want it
  when it was one."; Azzy, Chapter 6 (if `share`): "Then it is not for one of us."; Thorne, Chapter 11: "The Charter
  stands, Miss Limyè. It is written."; Gianna: "So is the oath. We'll see which one the Throne reads."; Anaco: "Someone
  must go and stand on it."; Rael, Trust: "The Throne has a Hearing for men like me, or it will have one."
- **What Gianna believes:** the truth (Chapter 11): her father is her mother's husband, the Crown alliance a farce, the
  Ash Ledger his, the Quiet Crown his design bent against Anissa by the Regent's almoner. She has not forgiven him and
  has not been asked to. Azzy's state by route: on Trust he fought beside his father and answered him once; on Strike
  he is furious at Gianna and silent to Rael, and **stays** (owner decision, Oct 22). Anissa heard everything.
- **Chapter 12's target is 28 to 30** (`CHAPTER_LEVELS` 12, already there), and 30 is the cap. The chapter is about
  1,183 XP wide from the floor and its fixed pay is about 1,065 (section 5), so a floor player reaches 30 with two
  fights in the Fields, and a player from the review's likely end reaches it before the Claim.
- **Stale lines in the design and the outlines, fixed here:**
  - `STORY.md` Chapter 12 says "the Throne Archive's Echo shows young Patricio, Benny and Caona one last time", but
    the Archive's built Echo is the sealing, where Caona "is not in the room" (Chapter 5, built), and Caona was never
    a signatory. Section 8 puts the three in the **Throne Hall** a year after the sealing, carrying Xaraguá's Petition
    of Breach, which the built petition item says was "received forty-nine years ago and never heard": the design's
    scene at the one moment the three could have stood in that Hall together.
  - `STORY.md` Chapter 12 has "Who joins: everyone present" and `COMBAT.md` 13.3 #10 says nothing about who fights.
    The engine fights four (`BATTLE_ACTIVE`); the Claim is the party's fight, the Challenge Gianna's alone
    (`fighters`, as Vikram's duel), and the armies are at the gates, not in the Hall (section 4).
  - `COMBAT.md` 13.3 #10's phase two "copies the pillar the party has most of as a shield (Wealth: gold drain; Fear:
    Stunned; Influence: Hushed)" has no gold-drain shape in the engine, and a battle's phases are static data. Section
    5 builds three battle variants, one per pillar, chosen by the dialogue from `globalPillar`, with Wealth as
    `weakened` (Qasim's *Seize Assets* shape).
  - `COMBAT.md` 13.3 #10's "Dawn Surge breaks his last shield": there is no Dawn Surge (no `DAWN_SURGE_COST` in config;
    `dawn_glaive` is a skill, "Dawnlight"). Section 5 uses the built Surge (`SURGE_MULT`) through a `protects` wall,
    as Rael's Unleashed was written, and the design note moves to after the release.
  - `COMBAT.md` 13.3 #10's HP x10 at 30 is a 3,384-HP tank on Story (section 5): about 50 actions by the Chapter 11
    review's scaling, over the "no boss over 40" gate. Section 5 plans x7 and lets the sim move it.
  - `SIDE-QUESTS.md` Se-5 says the tokens are "placed in the Throne Hall before the Claim" and pays 400 XP; section 7
    keeps the placing, pays 200 (the Chapter 6 to 11 scale), and takes "A Seat for Every House" as one of the two
    required quests because the Just Throne's council scene reads it.
  - `SIDE-QUESTS.md` Se-1 (Volume One) is "take the book back to the Temple Archive (Chapter 10)"; Chapter 10 did not
    build it. Section 7 closes the Overdue Books thread here: Anicette comes to the Hearing and the book goes into her
    hands on the Concourse.
  - `STORY.md`'s Epilogue has Rael "surrender to Gianna's Throne"; Chapter 11's review made the Strike route's "To a
    Throne. Not to a watch." the promise. Section 2 pays it on both routes at the Throne, not at a gate.
  - The guide's "A final text scroll shows each house's fate" and "Credits roll": the engine has cards (one title and
    a few lines) and a Credits screen on the System tab, no scroll. Section 14 builds the ending as a staged scene on
    the Hall, three cards, and the Credits screen opened by the story (one small engine piece).
  - `cards.ts` notes that the demo repository keeps "Thank you for playing the demo! Chapter 2 on November 22". The
    release on Nov 22 is the whole quest; the BETA label and the demo card are no longer relevant to this repository
    (section 14; the demo repository is not touched: no deploys).
  - `tests/seat.test.ts` forbids "Rael" and "father" in one line "anywhere in Eightgate". It guards Chapter 5's
    secret, which is now told. Chapter 12's dialogue lives in its own file (`dialogue/seatClaim.ts`) and the test is
    scoped to Chapter 5's scripts; Chapter 12's lines keep the rule anyway where it costs nothing (section 15).

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 11 outlines. Flags are proposals in the built naming style. "Shown"
means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`). The
chapter is **one evening and one morning**: the gate at dusk, the night in the Envoys' Quarter, the Hall at the bell.
The epilogue (section 14) is the same morning, after the Claim, and the ending is that afternoon.

### Beat 0: The Ash Road (the voyage, the card, then seat-concourse at the Ardencia Gate)

- The voyage `xaragua_ardencia` (by day; on Trust the captions: "Ardencia's sails lead the strait; the trader
  behind, and seven navies behind her."; on Strike: "The trader leads. Nobody's sails are black."). The card *The Ash
  Road*. The chapter's first picture: **the Ardencia Gate from inside**, dusk on the Concourse, the fountain, and
  **Elodie standing in the gate's arch with the Crown's clerk three steps behind her** (placed `if: 'act11.complete,
  !story.claim_arrived'`). She does not come forward: the clerk writes.
- **The walk in, shown:** the party spawns in the arch (`ardencia_gate`, new, at the north gate's inside tile). Elodie
  (a `walk` of two tiles, then a stop at a courtier's distance, as Chapter 5): "Envoy of Zetwal. The Lord Regent is
  informed of every arrival. He was informed of this one four days ago, from a ship." Gianna: "Mother." Elodie, low,
  the register of the fitting room and not the Hall: "Not here. He has heard. I have not. My rooms, when you have
  seen the city." Then, for the clerk, in the envoy's voice: "The envoy's household will report to the envoy's rooms."
  (Her built line, a second time; the clerk writes it down a second time.) She looks at Anissa (a `face`) and, this
  time, says her name: "Anissa." Anissa: "Mama." (The one word she has not said to her in two chapters; earnest.)
  `story.claim_arrived`; **the armies** are not walked into the city: Azzy, at the arch, to Joaquin (placed outside
  the gate with two Free Brasador): "Hold the gate. Nobody comes in behind us that the Compact doesn't name."
  Joaquin: "Nobody has, for fifty years." (A company at each gate is a placed pair by `army.*`, section 4.)
- **The Concourse at dusk, before anyone speaks:** the fountain's corner has new speakers (the debate, section 7.3);
  the market's vendor and the Outfitter are open (tier 28, section 5); the Sealbearers at the Hall's steps are
  **doubled** (four placed; the Hall's door is shut: `closed: 'hall_shut_night'`: "The Lord Regent receives the envoy
  at the bell. Not before."); **Jordyn's seven** at the Aldermoor Gate (placed, `army.aldermoor`), Jordyn herself at
  the fountain's rim ("I keep the law where I stand. Tonight I stand in the Crown's own city. It is very quiet.").
  Sebastian is not here (Chapter 9: he left for Eightgate's recital "and then Pòdlimyè"; his recital was weeks ago;
  Claude's call: he comes back for the Hearing with Anicette and Patricio, section 9.5).
- Journal: **The Ash Road** (`noXp`, done `story.claim_arrived`), then **Mother's rooms** (beat 1).

### Beat 1: Mother's rooms (seat-quarter, then the Envoys' Quarter's rooms: Elodie)

- The Envoys' Quarter, south of the fountain (Chapter 5's lane; Coco's painted door is shut: "Tati Coco is dressing a
  wedding in Al-Doria. She left a note." The note is a line, not a scene: "Gold. I said gold. Wear it on the tile."
  No Coralie in this chapter: she had two chapters). **Elodie's rooms** are a new small interior (14 x 10, section 3:
  Zetwal's rooms at the Seat: a desk, a lamp, a shelf with *Ash Wars Gossip, Volume One* on it (Se-1, section 7.2),
  the window on the Concourse).
- **Shown:** Elodie at the desk, the clerk **outside** the door for once (placed in the lane; a line: "The envoy's
  rooms are the envoy's. The Compact says so. I have checked."). Gianna, Anissa, and Azzy come in; the others wait in
  the lane (the stage party stays out: `story.party_split` is not used; they are placed at the lane's end). Elodie
  stands (a `walk` to them). The scene is four exchanges and one choice, no speech:
  1. Gianna: "He told me. On the pier." Elodie: "I know what he told you. He wrote to me the night before, in case
     you did not let him finish." (On Strike: "He wrote that you did not let him finish. He wrote that it was his
     doing, for teaching you not to." Nothing more about Strike.) Gianna, the remembered answer from Chapter 11
     (`choice.truth_answer`): if *tested*: "I told him he tested us." Elodie: "I told him first. Twenty years ago, and
     every year since." If *lied*: "I told him he lied to us for twenty years." Elodie: "So did I. Every day of it. Do
     not give him the whole bill; half of it is mine."
  2. **Anissa's line, hers, earnest:** "Mama. In Ardencia, he didn't let them hit me." (Her Chapter 5 line, said again
     to the same person, now with the Hall's lie known.) Elodie, as built in Chapter 5, a hand on her head and no
     words; then, this time, words: "No. He let them hit your sister instead. That is the part I will not forgive him
     for, and he knows it."
  3. Azzy, by the door (a `face` to Elodie): "You've known me since the wedding coat." Elodie: "I have known you since
     you were four and would not take your boots off in my kitchen. Azriel. Your mother and I wrote to each other.
     We stopped when it became dangerous to be two women who wrote to each other." (The khatun's household, Chapter
     6, without a name; one line; it reads either way for the owner's steppe questions.)
  4. **The Claim, in her mouth, plainly:** "Tomorrow at the bell he receives Zetwal's envoy. I am Zetwal's envoy. I
     will walk you to the rope and no further, because the Compact says a claimant stands alone, and because I have
     stood beside that chair for a year and it is time someone stood on it." Gianna's choice (both remembered,
     `choice.claim_why`): *"For Xaraguá."* (Elodie: "Then say Xaraguá first, on the tile. Nobody has, in that Hall.")
     / *"So nobody counts Anissa again."* (Elodie: "...Then you understood me, at the fitting. Say that last. Say it to
     him.") `story.elodie_rooms`.
- On the way out, **Volume One** on the shelf (Se-1, section 7.2: a one-line accept). The lamp in her window stays lit
  all night (an object look on `story.elodie_rooms`: the Chapter 1 lamp's light, in a Crown window).
- Journal: **Mother's rooms** (done `story.elodie_rooms`), then **Until the bell** (beat 2).

### Beat 2: Until the bell (the required things, any order; the arrow follows the ground)

- **The night is a condition** (`story.elodie_rooms` and not `story.bell_claim`): the Concourse under lamps, the Hall
  shut. Three things, on the Quests page, in the order the city lies: **the corner's debate** (the fountain, where the
  party stands: section 7.3), **A Seat for Every House** (the tokens must be in the Hall before the Claim, and the Hall
  is shut: so the chamberlain comes **out** to the Hall's steps at the party's knock, a `walk` down the steps with a
  lantern: "The Master of the Chairs does not sleep on the eve of a Claim. Nobody has, in fifty years, but the rule
  stands." He takes the party in by the records-room door on the Hall's west flank (a new door, section 3) to the
  chairs: section 7.1), **Volume One** (the Zetwal Gate, where Zetwal's ship is expected at dawn: section 7.2, a
  placed line until the dawn), and the **Outfitter** (not required; tier 28; Anissa's nudge: "The lady in the shop has
  new things, Gigi. She says they're for standing on stone.").
- When the corner is settled and the chairs are set (Se-1 can finish at dawn): **the bell** (a condition: the dawn,
  `story.bell_claim` set by the chamberlain on the steps at the party's word: "At the bell, then. Say it." / Gianna:
  "At the bell.").
- Journal: **Until the bell** (`followSide`, `noXp`), then **The eighth chair** (beat 3).

### Beat 3: The eighth chair (seat-hall at the bell: the Echo, Hollis's drawer, and the chamberlain's count)

- **Dawn, shown:** the Hall's doors open (the Sealbearers step aside: a `walk`); the party walks up the nave; **the
  chairs are set** (the tokens on them, objects by `side.seats.<house>_set`; the empty ones empty: section 7.1); the
  rope is still up, the Regent **not** on the dais (his placement `!story.claim_begun` is false on the Chapter 5
  condition; a new placement on `story.bell_claim` has him come in by the heralds' stair at beat 4); the eight
  envoys of Chapter 5 **gone** from their doors (their placements gain `!act11.complete`: section 3) and in their place
  **the houses' own:** Yari at Xaraguá's bricked door, Azzy at Ardencia's, Elodie at Zetwal's, Bayarmaa at
  Skarragol's, Haru at Kuroshi's, Vikram at Jwaladesh's, Edmund with **Lady Rosalind** at Aldermoor's (she withdrew
  from the Regent's council in Chapter 9: "the Hearing beside his mother"), Samira with **Layla Dorini** at
  Al-Doria's if Al-Doria is kept (Chapter 10's rule: Layla gives the token here if Rashid did not; on `muster.betrayed`
  for al_doria the door is shut and the chair empty; on `muster.turned`, Layla's clerk). The stage party members are
  placed by the doors from the chapter's start flag and walk to the chairs at the Claim (beat 4).
- **The shimmer at Xaraguá's chair** (a new Echo zone, 3 x 2 at (15 to 17, 8 to 9), `if: 'story.bell_claim'`; the Hall
  has an Echo grid, `g.clone()`): Anissa holds the door ("The floor's shimmering by Yari's chair, Gigi. I can hold
  it."). **The Echo** (section 8): the Hall forty-nine years ago, the three with the petition, Caona's oath said aloud
  in the Hall, the anchor on the back of the eighth chair. Back in the present, Yari turns the chair (the object's
  second look) and reads the line cut into its back: "The harbor stays with the people who fish it." Yari, to the
  Hall: "She wrote it on their furniture." (Not a joke: a fact, in Yari's register.) `anchor.caona_chair`,
  `story.chair_read`.
- **Hollis's drawer, shown:** Keeper Hollis comes down the nave from the Archive's side door as he did with the page
  (an `enter`, both hands full): "Filed with the clause. Your mother's petition, cacica, in a hand older than your
  father's. I kept a ribbon with no page for eleven years and never looked under the page." He sets **Xaraguá's
  original Petition of Breach** on the eighth chair (an item object; `clue.petition_original`). Yari: "Received. Never
  heard." Hollis: "It will be heard today. A Claim hears everything in the Hall. That is in the Compact too."
- **The chamberlain's count (the rulebook's threshold, in the realm's words):** the Master of the Chairs at his desk
  (a `walk` to the rope's end with the register): "By the Founding Compact a claimant stands on the tile with ten of
  the realm's regard across the three pillars, or six in one. The register reads for Gianna Elise Limyè of Zetwal:"
  (the three realm pillars from `globalPillar`, read into the line as numbers; by Chapter 12 every one is far past
  ten) "...and for Azriel Rodriguez of Ardencia the same, by his father's house." (The two claims, named in the Hall:
  rulebook Section 8's "any OTHER player who has also reached the threshold".) `story.claim_counted`.
- Journal: **The eighth chair** (done `story.chair_read`), **Filed with the clause** (done `clue.petition_original`),
  **The count** (done `story.claim_counted`), then **The Claim** (beat 4).

### Beat 4: The Claim (seat-hall: the tile, Azzy's choice, the Regent's Challenge)

- **Shown, in this order:** the heralds' stair: **the Regent** comes down it (an `enter` from (26, 2) to (23, 3), his
  hand on the Throne's arm, the Chapter 5 picture exactly; behind him **Captain-General Hale** if Trust (yielded on the
  pier: "The Regent will hear of this." / "He is watching it."), or two Sealbearers if Strike; and **Thorne** if spared
  to the *Patience* (`choice.thorne_spared`: placed on the dais's edge, the Charter under his arm; one line, his
  register to the word: "Miss Limyè. The Charter stands." and nothing after). The Regent, seated now for the first
  time in the game (the throne tile's object look: a man on it? **No:** he sits on the dais's step beside it, never on
  the tile: "Nobody has stood on it in fifty years" is his line too). The Regent: "Envoy. You held a pier. I hold a
  Hall. The Parley sits again, if you want it. The terms are what they were."
- **Elodie walks Gianna to the rope** (a `walk` for `npc:elodie_claim`, then she stops: the thing she said she would
  do), and **the rope comes down**: the two rope Sealbearers look at the Regent; the Regent: "Let her up. It is a tile."
  (`story.claim_begun`: the rope object's `if` goes false, the Chapter 5 placement's one hook, already in
  `LATER_STORY_FLAGS`.) Gianna walks up the dais alone (the follower stays with Elodie: a `place` for Anissa beside
  her), onto the tile (a step trigger on the tile's two tiles, `if: 'story.claim_begun, !story.claim_declared'`).
- **The Claim, declared, shown as the thing the rulebook asks:** on the tile, Gianna turns to the Hall (a `face` down).
  Her words are the remembered choice (`choice.claim_why`): "For Xaraguá. Its harbor stays with the people who fish
  it. Received forty-nine years ago. Heard today." (Yari's hand goes to the eighth chair: a `face`.) Or: "So that
  nobody in this Hall ever counts a child again." (Anissa, at the rope, looks up: a `face`; no line.) Then the formal
  sentence, the same on both: "I claim the Throne, by Zetwal and by Ardencia, under the Compact." `story.claim_declared`.
- **Azzy's choice, on the spot (the rulebook's order: challengers from the claimant's left, and Ardencia's chair is
  left of the Throne as the Hall faces it; the Regent answers second).** Azzy walks from Ardencia's door up the nave
  (a `walk` to the dais's foot). His choice is **his**, read from what the player did (Claude's call, section 12; the
  flags are the ones the chapters said were "remembered for Chapter 12's Claim"):
  - **Share** (`choice.azzy_ordu` = `share`, Chapter 6: "Then it is not for one of us."; any Turn route): he comes up
    the dais and stands on the tile's second tile, beside her (the 2 x 2 tile has room for two; shown). "Two houses,
    one Claim. I said it at the fair: it is not for one of us. Count us together, Master of the Chairs." The
    chamberlain: "...Counted." On Strike his line has the anger in it and he still stands: "I am still angry with you.
    I will be angry on the tile." (The owner's "his anger colours the Claim", shown as a man who stands beside his
    sister while furious.) `claim.azzy_share`.
  - **Challenge** (`war.strike` and `choice.strike_why` = `beaten`: section 9.3's question on the road, the player's
    own words; the dark route): he stops at the dais's foot. "Under the Compact, two claimants. I answer yours. Not
    for the chair. So that you have to say, in front of them, why you chose the fight when you had him and you had
    them." Elodie, from the rope, one word: "Azriel." He does not turn. **The duel** `claim_azzy` (section 5: Gianna
    alone against Azzy as a foe, `binds`, he `withdraws` at 0 HP; Game Over on a loss: the way back in is Azzy at the
    dais's foot). After it, on one knee: "...Then it's yours. I'll hold you to it. Every day." He goes to Ardencia's
    chair and sits (the first chair filled by a person). `claim.azzy_challenged`. Nobody is paid XP for it.
  - **Renounce** (every other save; the common route): he stops at the dais's foot and does not come up. "I did not
    want it when it was one. I want it less now that it is two. Stand on it. I'll stand here." (Chapter 3's line
    finished.) On Strike, the colour: "...I'm still angry. That is not the same as a Challenge. Stand on it." He goes
    to Ardencia's chair and stands behind it, not in it. `claim.azzy_renounced`.
- **The Regent's Challenge:** he stands (a `walk` to the dais's foot, the first time he has moved toward anyone since
  Chapter 5's rope). "A Challenge, under the Compact. The Throne is held for now. It is held by me." (His built
  register: three moves ahead, never raising his voice.) To the Hall: "Sealbearers." The two from the rope come to his
  sides (`walk`). To Gianna, the last public line before the fight, and it is the Charter's: "The Charter stands, envoy.
  It is written. Nothing you have done unwrites it." Gianna: "So is the oath. Read the chair." The fight
  **`claim_regent`** (section 5: the Regent at 30 with two Sealbearers at 29; three phases; the pillar variant chosen
  by `globalPillar`; the whistle does **not** come into the Hall: no volleys; Anissa's tip at the start: "He hates the
  light, Gigi. The grey ones stand in front of him. Go through them."). **Game Over** applies: the party all down shows
  the goddess; Rise puts them at the dais's foot; the way back in is the Regent on the dais's step ("The Challenge
  stands, envoy. Nobody leaves the Hall while it does.": the Assize's shape).
- **After the win, shown:** the Regent on one knee on the dais's step (`withdraws`: "...It is a tile."); the
  Sealbearers' seals on the floor (objects); Hale, if present, lays his axe down and stands away (a `walk`); the
  Crown's clerk **stops writing** (a line: "The clerk has stopped writing. He is looking at the tile."). **Gianna is on
  the tile.** The chamberlain, the rulebook's last sentence in the realm's words: "The claimant has met every
  Challenge. By the Compact the Claim stands. The chairs fill." **The chairs fill, shown** (section 7.1's payoff): each
  house's person walks from their door to their chair and sits, in the chairs' order west to east: Elodie (Zetwal),
  Yari with the conch and the petition (Xaraguá, the eighth chair with the oath on its back), Azzy (Ardencia: in it,
  or behind it), Layla or her clerk or nobody (Al-Doria), Rosalind with Edmund standing (Aldermoor), Bayarmaa (or the
  rider) with the braid (Skarragol), Haru (or the signal master) with the crane (Kuroshi), Vikram (or the junior
  priest) with the lamp (Jwaladesh). A betrayed house's chair stays **empty**, and the camera `look`s at it once. The
  Regent is walked up the heralds' stair by **Jordyn** and two of the watch ("Under the Compact, my lord. Not under
  me."): shown. `story.claim_won`; the Stability inputs (section 4.2): `stability.claim_share` | `claim_renounce` |
  `claim_challenge`.
- **The Seventh Ribbon's hook (after the release):** one conditional line on `item.seventh_ribbon`: Gianna strikes the
  clause before the chairs and Yari receives the ribbon; without the item nothing is said and nothing is missing
  (S-SEA's +15 and +10 are read by the Stability function only if the flag exists: section 4.2).
- Journal: **The Claim** (done `story.claim_won`), then **The Hearing** (section 14).

### Beat 5: Rael comes in (seat-hall; the Hearing's door)

- **Shown, the same hour, before anyone sits back:** the Hall's doors (the far end of the nave): **Rael walks in**,
  alone, hands behind his back (the idle pose, the guide's), with **Rivera** and **Jaime** behind him carrying nothing
  (`enter` from (21, 31), `walk` up the nave to the dais's foot, where the Regent stood; the camera `look`s at him the
  whole way; the chairs watch: a `face` from each). On Trust he was expected (the pier: "I will be at Eightgate. Not
  beside you."); on Strike he is not ("He went north"), and **Benny**, who came with the party, stands up from the
  Ardencia door where he waited (section 9.5) and says nothing. Rael stops. He does not kneel yet. To Gianna, on the
  tile: "To a Throne. Not to a watch. There is a Throne now." (The Chapter 11 promise, paid on both routes, at the
  Throne.) He takes the signet off (shown: the ring object in his hand; no `fx`) and sets it on the dais's lowest step.
  "The Hearing, envoy. You said this Hall would have one or you would make one. Make it." Then he kneels (the kneeling
  look). Jordyn comes back down the stair (a `walk`) and stands behind him, not touching him: "I have the one set of
  words. I'll wait to see which I need." (Not a joke: her register.) `story.rael_surrendered`.
- The card: *The Claim stands. The Hearing sits at noon.* (`story.hearing_called`; `act12.claim` for the route; no XP.)
  The Journal's **The Hearing** opens (section 14).

---

## 3. The maps (seven reused, one new small interior; `tools/maps/seat.ts` through `painter.ts`)

Every Chapter 5 map is reused with a Chapter 12 variant (objects, NPCs, stage placements and triggers conditioned on
`act11.complete` and the chapter's later flags; Chapter 5's placements gain `!act11.complete` only where a Chapter 5
person would be wrong in the Claim's Hall: the eight envoys, the legate and his aide (Edmund), the Parley clerk's
desk; everything else stands). The look is the Chapter 5 city at dusk and then by morning (the built washes).

| Map | Size | Section | Chapter 12 use | Echo |
|---|---|---|---|---|
| `seat-concourse` | 44 x 32 (built) | The Eight Gates Concourse (hub) | The arrival at the **Ardencia Gate** (a new spawn `ardencia_gate` inside the north gate; the gate object's `closed` line gains a war branch: it opens); Elodie and the clerk in the arch (placed, then walked); a company's placed pair at each gate by `army.*` (Free Brasador at Ardencia's with Joaquin; the Ironvow at the Iron Gate; Jordyn's seven at Aldermoor's; the Suzumori, Agnivansh and Dorini at theirs; Zetwal's levy at Zetwal's gate with **Zetwal's ship's people** at dawn: Anicette, Patricio, the Chancellor, Sebastian: section 9.5); the fountain's corner with its new speakers (7.3); the market and the Outfitter (tier 28); the Hall's steps with four Sealbearers and the chamberlain's lantern by night; the records-room door on the Hall's west flank (new, `if: 'story.elodie_rooms, !story.bell_claim'`, to the Hall's chairs by night) | none |
| `seat-hall` | 44 x 32 (built) | The Throne Hall (the arena, the chairs, the Hearing) | The rope gone on `story.claim_begun` (built hook); **the tokens on the chairs** (eight small objects by `side.seats.<house>_set`; a betrayed house's chair bare); **Xaraguá's chair with two looks** (turned: the oath cut into its back, `anchor.caona_chair`); the **Echo zone** at the eighth chair (3 x 2 at (15 to 17, 8 to 9), `if: 'story.bell_claim'`; the Hall's Echo grid is the present's clone: the chairs and the dais are walkable around in both eras; the Echo-era objects: the chamberlain's desk of forty-nine years ago, the Crown's clerk's table); the houses' people at their doors by the chapter's flags; the Regent's dawn placement on `story.bell_claim, !story.claim_won` at (23, 3) with Hale or the Sealbearers and Thorne; the step trigger on the tile; the dais's step as the Regent's way back in; **the Hearing's layer** (section 14: the witnesses' bench along the west wall, the clerk's table, Rael kneeling at (21, 10), the signet object on the step, the gallery's people); the ending's layer | **the eighth chair** (new zone): the petition carried in, Caona's oath, the anchor |
| `seat-quarter` | 24 x 16 (built) | The Envoys' Quarter | Coco's door shut with the note; the clerk in the lane outside Elodie's door; **the door to Elodie's rooms** (new, on the Quarter's Zetwal house: Chapter 5 had "Elodie's rooms (Se-1)" in CAPITALS and never built the interior) | none |
| **`seat-rooms`** | **14 x 10 (new, interior)** | Elodie's rooms | The desk, the lamp (lit all night on `story.elodie_rooms`), the shelf with *Volume One* (Se-1), the window; Elodie placed; Azzy and Anissa walked in with Gianna | none |
| `seat-gateyard` | built | The Gold Gate's yard | Open as built; the Zetwal ship's people do not come this way (Zetwal's gate is on the Concourse's north-east) | none |
| `seat-archive` | 26 x 18 (built) | The Throne Archive | Open as built; Hollis is in the Hall at dawn (`npc:hollis` placements gain `!story.bell_claim`); drawer 4's dialogue gains a line after `clue.petition_original` ("Empty now. The clause is in the Hall, and so is what was filed with it.") | the built sealing zone stands (no new scene) |
| `seat-workshop` | built | Coco's workshop | Shut (the door's `closed` line is the note) | none |
| `seat-fields` | 46 x 28 (built, wild) | The Crossroads Fields | The war table `crossroads_war` on a second layer `if: 'act11.complete'` (section 5); the built layer's `if: 'story.seat_arrived'` gains `!act11.complete`; the pilgrims' escort (Se-3's callback) at the gate as built | none |

**No new outdoor map.** The seat of government is the Hall as built, and this chapter is the one that uses every
part of it the Chapter 5 Built section set aside for it ("the rope goes, the Throne tile becomes a step, the chairs
fill, the nave is the Regent's arena; the Hearing seats its witnesses on the chairs").

**Drawn placeholders** (code, through `assets.config.ts`): the eight tokens as chair objects (the braid, the crane,
the lamp, the conch, the Dorini scale, a bare chair), the chair's turned look with the cut line, the signet on the
step, the Sealbearers' seals on the floor, the petition on the chair, the clerk's table and the witnesses' bench;
**Rael, Rivera, Jaime, old Benny, Nancy, Rahel, Patricia, Layla, Rosalind, Hale, Thorne, the chamberlain, Hollis,
the Regent, the Crown's clerk** as their chapters' looks; **Anicette and old Patricio** as Chapter 1's;
**Sebastian** as Chapter 9's; the Chancellor as Chapter 1's; **the treasurer's daughter** as Chapter 3's and **the
treasurer** new (a thin man in a good coat ten years old: the Hearing's one new face); **Amanda** as Chapter 3's; the
lamp-oil seller and the camp leader as Chapter 2's; the Lower Town's cook; the printer of Kingsmere as Chapter 9's.

---

## 4. The Claim on a phone-sized map, the Stability score, and who fights

### 4.1 Armies at the gates, people in the Hall (the Chapter 10 and 11 reviews' finding, applied)

No army enters the Hall. Each company is a **placed pair** at its house's gate on the Concourse (by `army.*`), one
captain's line each, and that is the whole army in this chapter: the Claim is a Hall full of people who each have a
chair or a door, and "everyone present" (STORY) means the eight houses' people and the family, which is about
twenty-two placed and walked actors across the Hall's 44 x 32 (Chapter 11's landing had twenty-one in one scene; the
chairs' filling is eight walks in sequence, one `look` each, and the Hearing's witnesses come one at a time).

### 4.2 Accord Stability: the score, as one pure function (Chapter 11, section 4.4: "the score itself is Chapter 12's")

`engine/stability.ts` (new, pure, tested): `stability(flags): number` over the recorded inputs, from a `STABILITY`
table in `config.ts` (every number a dial), starting at **50**:

| Input (guide 5.7) | Flags | Dial |
|---|---|---|
| Allied houses kept | each of `army.skarragol`, `army.kuroshi`, `army.jwaladesh`, `army.al_doria` above 0 | +4 each (a turned house at three quarters +2) |
| The Unpaid Debt paid | `stability.xaragua_freed` +5; `stability.elders_agreed` +5; `ally.xaragua` +2; `item.seventh_ribbon` +15 (after the release) | |
| The Harbor Turn | `stability.harbor_trust` +10 / `stability.harbor_strike` -10; `stability.fleet_struck` +5 / `stability.fleet_escaped` -5 | |
| The Hearing verdict | `hearing.pardon` +15 / `hearing.exile` 0 / `hearing.execution` -15 | |
| Concord | `(concord - 50) / 5`, clamped -10 to +10 | |
| The Claim | `claim.azzy_share` +5 / `claim.azzy_renounced` 0 / `claim.azzy_challenged` -10 | |
| The chairs | every house's token set (Se-5) +5; a betrayed house's empty chair -3 | |
| Yields | `choice.thorne_spared` +2 / `_broken` -2; `choice.flank_spared` +2 / `_bound` -2; `choice.hushed_tried` +2 / `_broken` -2; `choice.grimvald_spared`, `choice.fox_spared`, `choice.dhanraj_spared` +1 each | |
| Unresolved side quests | none (every chapter's two are required) | 0 |

Clamped 0 to 100. **The ending** (guide 5.7, in the engine's words): **Iron** if `hearing.execution`; else **Just** if
`hearing.pardon` and Stability at least **70** and the realm's Influence at least its Fear (`globalPillar`); else
**Hollow**. The Journal shows the score only after the verdict (a note *The Accord's Stability: N*), never as a meter
during play (the owner's rule that the realm is not a scoreboard; the pillars already are). The dials are set on day
1 so that a Trust player who kept every house and pardons lands about 85, a Strike player who kept every house and
pardons about 62 (Hollow, by the war's cost, unless Concord and the chairs lift it over 70: a real path), and an
Exile is Hollow on every save.

### 4.3 Who fights

Eight fighters, four active by the roster order (Gianna, Yari, Azzy, Samira) unless an order screen landed; `leads`
lifts nobody in this chapter (Rael is not in the Hall's fight on either route: he comes in after it). **The Challenge
is Gianna alone** (`fighters: ['gianna']`, as Vikram's duel) against Azzy as a foe. The Echo scene has no fight. The
Fields' ambushes are the four's.

---

## 5. The chapter's fights and levels

**Enemies (built shapes re-levelled; new data only where marked; `COMBAT.md` 13.2's Seat rows "28 to 30"):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Regent's Sealbearer** (Chapter 9's `al_sealbearer` re-levelled, or Chapter 11's) | caster, `armored` | 28 to 30 | Writ 100 `magic`, `weakened`; Seal 130 `magic`, `hushed`, every 3, tell | the rope's two; the Fields |
| **Husher** (built) | caster, resists light | 28 to 29 | as built (Whisper, Hush, Seize) | the Fields only: the Hall has no Seize but the Regent's |
| **Crown Marine**, **Crown Musketeer**, **Crown Officer** (built) | as built | 28 to 30 | as built | the Fields |
| **Captain-General Hale** (Chapter 11's `hale`) | tank | **not fought** | | placed on the dais on Trust; he lays his axe down |
| **Azzy, the Challenge** (`azzy_claim`, new: Azzy as a foe, the `vikram_duel` precedent) | brute | **29** | Blade 110; *La Marca* 100 `marked` every 3 (his father's move, his tell: "He holds the blade the way the Trial held it..."); *Grito* `stunned` 60% every 4 | `hpScale 3`, `atkScale 1.1`, `binds` on the battle, `withdraws` ("...Then it's yours."); `fighters: ['gianna']`; not `boss` (no Grudge climb past 0.3) |
| **The Lord Regent Aldric Vane** (`regent`, new) | tank, `boss`, resists light? **no**: the design's "He hates the light" is Anissa's tip about the Sealbearers' seals; he is plain | **30** | section below | `hpScale 7` (planned; COMBAT's 10 is the ceiling), `atkScale 1.25`; `withdraws` ("...It is a tile."); the Grudge to +50% |

**The Regent, three phases (COMBAT 13.3 #10, in the engine's shapes), three battle variants by the realm's highest
pillar (`claim_regent_influence` | `_fear` | `_wealth`, chosen by the dialogue's `battle.next` from `globalPillar`):**

- **The Patient Court** (from the start): two Sealbearers at 29 with `protects: 'regent'` ("he cannot be hurt while
  both stand" is the built intercept at 0.75 for one-target blows; area blows and the Surge go through: the tip says
  so). The Regent's own moves: *The Chain of Office* 100; *Patience* 0 `area` `weakened` every 3, tell "The Regent
  waits. The Hall waits with him..."
- **The Charter** (at 66%): "The Charter stands. It is written." The house variant: **Influence**: *The Charter, read*
  120 `magic` `area`, `hushed` 50%, every 3 (Thorne's move, the Regent's voice); **Fear**: *The Writ* 120 `area`,
  `stunned` 40%, every 3; **Wealth**: *Requisition* 120 `area`, `weakened`, every 3 (no gold drain in the engine).
  `enter` of one more Sealbearer.
- **One Hand** (at 33%): "One hand. One Hall. Hush, and give her to me." *Hush the Light*: `seize` (aimed at Anissa:
  Gianna steps in, as built since Chapter 2) every other turn; `enter` of **two more Sealbearers with `protects`**
  (the last shield: a Surge through them, `SURGE_MULT` 1.5, is what the tip asks for; no Dawn Surge exists). He
  `withdraws` at 0 HP. `endsWithBoss`: the Sealbearers still standing step back with him.

**Stat check against the engine** (`enemyStats`: hp = (12 + 9 x level) x role x hpScale; Story x0.8 HP, x0.7
damage): the Regent at 30 as a tank, **x7: 2,961 HP (2,369 on Story), ATK 92 (x1.25), DEF 69**; at COMBAT's x10,
4,230 (3,384 on Story), which by the Chapter 11 review's measured scaling (Rael x6 at 28 with two guards: 27 to 31
actions at tier 24) is about 50 actions and over the gate. A Sealbearer at 29 as a caster: 218 HP, MAG 108. Azzy as
a foe at 29 x3: brute, 1,146 HP (917 on Story), ATK 124 against Gianna alone (HP 182 at 29, DEF 34 + tier-28 armour):
the duel is about 12 to 16 of her actions with Sunthread and Limyè Elodie, and she is Bound in about one in five at
28 with tier-24 gear (a loss, since she is alone: a Game Over with the way back in). The party at 30: Gianna HP 187,
MAG 72; Azzy HP 263, ATK 72, DEF 68; Yari HP 224, ATK 70; Samira HP 189, MAG 70 (base plus growth x29), plus tier-28
gear from the Outfitter (section 5's shop: a weapon about +24, armour about +20 DEF).

| Fight | Where | Foes | Level | Party then | Pays (data) | Way back in |
|---|---|---|---|---|---|---|
| Ambushes (`crossroads_war`, from `act11.complete`) | the Crossroads Fields | Husher + Sealbearer (29); Marine x2 + Officer (28); Sealbearer x2 + Marine (30) | 28 to 30 | 28 to 30 | the encounter rule (about 70 at 28) | as built |
| **The Challenge** (`claim_azzy`, dark route only) | the dais's foot | Azzy 29 | 29 | 28 to 30, **Gianna alone** | **0 XP, 0 gold** | Azzy at the dais's foot |
| **The Claim** (`claim_regent_*`, three variants) | the nave | the Regent 30, Sealbearer x2 29; +1 at 66%; +2 at 33% | 30 | 28 to 30 | **360 XP, 800 gold**, the Regent's chain of office (a charm, tier 28: DEF +6, MAG +4, "It weighs what it weighed on him.") | the Regent on the dais's step |

**Planned numbers (to measure on day 1; the Chapter 11 review's method: tier-24 gear and the roster order as the
plan, start gear as the floor that must still win, both orders, 40 seeds, falls party-wide, Break Free in the bot):**
the Regent at x7 with the five Sealbearers over three phases about **30 to 38 actions, a fall in one in four at 28
with tier-24 gear, every seed won at the boss Grudge with start gear**; with tier-28 gear from the Outfitter 24 to
30 (the player who shops is rewarded, not required); the Challenge 12 to 16 of Gianna's actions, a loss in one in five
at 28 with tier-24 gear and none at 30 with tier-28; the Fields' trios 7 to 13 actions with nobody down. **The gates
for day 1:** no boss over 40 actions; the Regent never under 24 with tier-28 gear (if he is, x8); the Challenge is
winnable at 28 with start gear in every seed at Grudge +30%; the Seize is answered by Gianna stepping in and Anissa
is never a target of anything else (a test, as Chapter 9's).

**Levels through the chapter** (objectives at **60**, a row for Chapter 12: rows 10 and 11 must exist first, whatever
their builds set; the Regent 360; the Echo scene 80; the debate 25 mediated; the two quests 200 and 80; two Hall books'
new looks 10 each; ambushes by the built rule, about 70 at 28; the Challenge and every Hearing step 0):

| Point | XP from | Total from 9,753 | Level | From 10,220 | From 10,338 (a 29 start) |
|---|---|---|---|---|---|
| Start (the Ardencia Gate) | | 9,753 | 28 | 10,220 (28) | 10,338 (29) |
| Mother's rooms, the eighth chair, filed with the clause, the count, the Claim (five objectives at 60; the Ash Road, Until the bell, the Hearing's steps and the end `noXp`) | 300 | 10,053 | 28 | 10,520 | 10,638 |
| The Echo (80), the debate (25), *A Seat for Every House* (200), *Volume One* (80), two books (20) | 405 | 10,458 | 29 | 10,925 | 11,043 (**30**) |
| The Regent (360) | 360 | 10,818 | 29 | **11,285 (30)** | 11,403 (30) |
| Two ambushes in the Fields (about 70 each) | 140 | **10,958 (30)** | **30** | | |

**The level statement for the milestone note.** The chapter is **two levels wide (1,183 XP) to the cap** and its fixed
pay is about 1,065, which lands **30 from the review's likely end before the Hearing**, 30 from a 29 start before the
Claim, and 30 from the floor with two fights in the Fields (or 29 at the end for a floor player who walks past
them, which the cap makes harmless: the Regent is sized for 30 and orange at 28, `bands.hard` 2). The one dial is
`XP_PER_OBJECTIVE_BY_CHAPTER` row 12 = **60** (Claude's call, section 12); set it with `tools/level-curve.ts` from
**Chapter 11's measured end**, as the Chapter 11 review asked for Chapter 11.

**Gold:** about 2,500 to 4,500 in; the Regent pays 800; ambushes about 110 each at 28. Out: **the Envoys' Outfitter at
tier 28** (new data: a keeper's rod, an envoy's sabre, a Yaguana longbow, the Claimant's coat, the Hall's plate, a
tile-stone charm; about 1,200 to 1,600 each, so a full set is not affordable and the player chooses two or three, which
is the shop's job in a last chapter); the Concourse market as built. Nothing requires spending.

---

## 6. The required-before gate: "Until the bell"

- **In the story:** Elodie has said it in her rooms (beat 1): the Regent receives Zetwal's envoy at the bell, and the
  chairs must be set before a Claim (the chamberlain's rule, Chapter 5: "Bring me a token of goodwill from every
  house that will sit with you"), and the city's corner is asking the one question the Claim answers.
- **In the Journal:** the objective **Until the bell**, `followSide`, `noXp`, done when `debate.seat_claim.settled`
  (joined or mediated) and `side.seats.done` (the tokens set), **or** when `story.bell_claim` is already set. Then
  **The eighth chair**: the chamberlain on the steps at dawn ("At the bell, then. Say it." / "At the bell.").
- **On the map:** the chamberlain is worded from the flags until then ("The corner is still at it; a Claim hears the
  city first." / "The chairs are bare, envoy's household. A bare chair is a house that was not asked."); Anissa:
  "Your Quests page, Gigi."
- **Order the arrow follows:** the fountain (the debate: where the party stands after the rooms), the Hall's west
  flank (the records-room door: the chairs), the Zetwal Gate (Se-1's book is handed over at dawn: the step waits on
  the dawn and never blocks the bell: a save with Se-1 open finishes it at the gate on the way to the Hearing).
- **Dawn, the bell, the Claim, the Hearing and the end are conditions** (`story.bell_claim, !story.claim_won` for the
  Hall's dawn; `story.claim_won, !story.hearing_called` for the surrender; `story.hearing_called, !hearing.verdict`
  for the Hearing; `hearing.verdict` for the ending), not flags a dialogue must remember to set (the Chapter 6, 10 and
  11 reviews' rule).
- **No soft-locks:** the debate never Game Overs and settles on a loss; `mediate` is reachable (the Seat's Influence
  is 5 or more on every save: Chapter 5's books and quests, and the Chapter 5 outline's mediate at the built 5); the
  tokens are items the player holds (a missing one is a bare chair, never a block: `side.seats.done` is "every token
  held is set"); the Echo's anchor is one `use`; Hollis's drawer is a scene; the count is a dialogue; the tile's step
  trigger fires again until `story.claim_declared`; Azzy's choice is a dialogue that runs once (`claim.azzy_*`) and a
  lost Challenge returns to the dais's foot with the choice kept; the Regent's fight has the Assize's way back in; the
  Hearing's verdict is asked again until given; a loss in the Fields is the built rule.

---

## 7. The two required side quests and the debate

Eightgate's Chapter 5 quests are done or closed on every save (Se-5 stage 1, Se-2's first debate, Se-3). The two
here are the ends of two threads the whole game carried, and the last chapter is the only place they can end.

### 7.1 A Seat for Every House, stage 2 (Se-5; the tokens set on the chairs; no fight)

- **Opens:** the chamberlain on the Hall's steps by night (beat 2): "Every house that will sit with you. Show me."
  Accepted when the party follows him in by the records-room door (`side.seats.stage2`).
- **Steps (shown, one chair at a time, any order; the arrow walks the row):** at each chair a dialogue: *Set the
  token.* The token is **carried by the house's own person** where one is in the party (Bayarmaa sets the braid:
  "Grandmother's standard has a chair."; Haru the crane: "Mother folded this. She folds when she is deciding
  something."; Vikram the lamp: "...It's still lit. Aiyana filled it."; Samira the Dorini scale, if `item.token_dorini`:
  "Mama paid on time. Of course she did."; Yari the conch: "Mine to carry. Mine to set down, after all." (Anaco's
  line, finished by her); Edmund has none for Aldermoor and says so without apology: "Aldermoor's chair is my mother's
  to fill. She withdrew from one council. She can sit in another."; Azzy for Ardencia: nothing is set: "Ardencia's
  chair has a Rodriguez behind it. That will have to do until tomorrow."; Zetwal's: Elodie is its envoy; the chair
  is hers to sit in and needs no token: the chamberlain says so). A house that was **betrayed** has no token and no
  person: the chair stays bare and the chamberlain's one line names it: "Skarragol was asked and sold. Its chair
  stays. A bare chair is a thing the Hall remembers." A **turned** house's token is set by its second.
- **Reward:** 200 XP, 0 gold, +2 Influence (Seat), `side.seats.done`, and the Claim's picture earned: the chairs fill
  with the people whose tokens are on them (beat 4), and the Just Throne's "standing council of the states, each with
  a seat" is the row the player set by hand.
- **Why it fits:** SIDE-QUESTS' Se-5 is the design's own "before the Claim"; the tokens have been carried since
  Chapter 6 and this is the only chapter that can pay them; the quest is the cheapest shape there is (eight dialogues
  on eight built objects) and the richest picture the ending has.

### 7.2 Volume One (Se-1, closed here; the Overdue Books thread; no fight)

- **Opens:** on Elodie's shelf (beat 1): *Ash Wars Gossip, Volume One*. Gianna: "Grandmother's. The missing one."
  Elodie: "Your grandmother lent it to me twenty years ago. I kept it. I have written in it, which she will not
  forgive." Accepted when taken (`side.volume_one.accepted`, `item.volume_one`).
- **Steps:** 1) **Read it** (a book dialogue in the rooms: Elodie's margins, "Not true. I was there." twice; the
  fourth account read against the other three, `clue.four_accounts` from Chapter 10 unlocks the last margin's reading:
  "The Cendre ford: forty. He counted. I watched him count."). 2) **Anicette at the Zetwal Gate at dawn** (section
  9.5: Zetwal's ship's people walk in from the gate as the party comes to the Hall: a shown arrival): the book into
  her hands (an item object passes; `item.volume_one` false). Anicette: "Twenty years overdue. I will not charge her.
  I will tell her so, in front of people." `side.volume_one.done`.
- **Reward:** 80 XP, 0 gold, **+2 Concord** (SIDE-QUESTS' "completes the Overdue Books thread"), +1 Influence (Seat),
  and the Hearing's line (section 14: Anicette is the one witness who read all four accounts and says which was
  false, if `clue.four_accounts`).
- **Why it fits:** the built hints for the missing Volume One have been in Chapter 1's archive since the demo; the
  thread's design ("Volume One turns up in Elodie's rooms") is kept to the letter; it costs one book and two
  dialogues; and it puts Anicette on the Concourse at dawn for the Hearing without a scene that exists only for that.

### 7.3 The debate, required: *A faith that began as a tool: is it still a faith?* (guide 7.2's post-Turn corner)

A `DebateDef` in city `seat` (`seat_claim`), at the fountain's corner, `opensIf: 'story.elodie_rooms'`; `mediate` at the
Seat's Influence 5. The guide's rule: after the Harbor Turn every hub's corner asks this and **the Quiet Crown's own
followers speak for themselves**. The ally is **the Gaze keeper** (Chapter 5's speaker on Gianna's side); the opponent
is **a Quiet Crown follower**, unveiled, a woman of the Concourse ("We were lonely. Somebody gave us bread and a name
for the quiet. Now they say a lord made us as a tool. Was I a tool when I fed the pilgrims?"); the Witness priest
listens and turns the crowd at the end. **Reason needs** *The Four Faiths at the Seat*? Not built: one of *The
Founding Compact*, *The Weaving* or the purge list (the key item counts as a lore flag: a read of it is
`lore.purge_list`, set when its showcase closes). The rounds' claims: who made us; what we did; what we are now. The
strong answers: Scripture (the Gaze: "The Gaze remembers what was done, not who meant it"), Reason (the purge list:
the cells warned the families first, on their own thumb: "A tool does not warn anyone"), Compassion (Anissa's name:
"My sister held a door for a year against people in your veils. She does not hate you. She counted you."). **Mediate:**
**Gianna** (the stage: she steps to the fountain's rim) says the thing the Hearing will make law: "A thing is what it
does now. Tomorrow a man will say in that Hall that he made you. What you do after he says it is yours." The follower:
"...Then we will listen to him say it." `debate.seat_claim.settled`; mediated sets `stability.corner_mediated` and
+10 Concord (the built reward). Its `after` lines at the Hearing: the follower is in the gallery and, when Rael
confesses, says one thing (section 14).

**Why one debate and not a skip:** the design wrote this corner for after the Harbor Turn on purpose (guide 7.2), it is
the only place the Quiet Crown's sincere followers are heard before the man who made them confesses to them, and
Concord here is the ending's last input.

### 7.4 Books, vendors and the board

- **No new library.** The Hall's four and the Archive's five stand; two Chapter 12 looks on built books: *The Rules of
  Claim*? not built (the Hall's four are the Commission, the Petitions, the Council of Eight, the Seventh Clause):
  *Petitions of Breach* after `clue.petition_original` ("Xaraguá's is no longer in this book. It is on a chair.") and
  *The Council of Eight* after `story.claim_won` ("The old plan for a council of the states, never used. Used.").
- **Vendors:** the Concourse market as built; the Envoys' Outfitter at tier 28 (section 5).
- **The contract board:** "copy a damaged ledger for the Archive" and "deliver a petition of breach" are paid by the
  main story (Hollis's drawer); after the release the board gets the Seat's errands.
- **Anissa's nudges** (mystery quests, under 128 characters): "The corner by the fountain is asking about the veils,
  Gigi. They want you." / "The chairs are bare. The man with the lantern says so." / "Grandmother's book is on Mama's
  shelf. The missing one."

---

## 8. The Echo: the eighth chair (the chapter's Echo scene and its puzzle; difficulty 1)

- **Present:** the Throne Hall at the bell, the eighth chair with no chamber behind it, its back to the nave; the air
  shimmering at its foot.
- **Echo:** the same Hall **forty-nine years ago**, a year after the sealing: the chairs, the Regent of that day's
  chamberlain at his desk (an Echo-era placed NPC), the Crown's clerk at his table. **Caona**, **Patricio** (the
  player) and **Benny** walk up the nave together (the only time in the game the three stand in this Hall; the
  built looks). Caona carries the petition (an item object in her hands). Caona, to the chamberlain: "Xaraguá's
  Petition of Breach. The harbor was ours by oath and is the Crown's by a page nobody read to us. Carry it to a
  chamber." The chamberlain: "Received." (He sets it on his desk. Shown: the object moves.) The Crown's clerk comes
  and takes it off the desk (a `walk`, the object moves again): "Matters touching a clause are filed with the
  clause." (Chapter 9's filing rule, in the mouth that wrote it, forty-nine years earlier.) Benny: "Then it is filed
  with a page he will not sign." Caona, to the Hall, the oath aloud: "The harbor stays with the people who fish it. We
  fight for each other, and no paper of any crown will part us." (The built line, word for word, Chapter 2's.) Nobody
  in the Hall writes it down. **The puzzle (one object, one verb, a line that says so):** Caona, at the eighth chair,
  to Patricio: "They will not write it. Write it where they sit." The chair's back is an Echo-era puzzle object;
  `use` has Patricio cut the oath's first line into it with his knife (**anchor**, `anchor.caona_chair`). Patricio:
  "Fifty years from now somebody will turn this chair round." Caona: "Good." (Chapter 11's exchange at the capstan,
  returned.)
- **Logic:** a thing written on the Hall's own furniture is in the Hall when the Hall finally reads; the petition
  went where the clause went, which is why Hollis finds it under the page. Honest difficulty 1: the player has
  pulled a pin, tied a thread and lit a lamp; the last anchor is a sentence.
- **Back in the present:** Yari turns the chair (the object's second look) and reads the line; `story.chair_read`.
  Hollis's drawer follows (beat 3). No Memory (no battle); the Journal note *The eighth chair*: "Caona said the oath
  in this Hall forty-nine years ago and nobody wrote it down. Grandfather did. It is on the chair."
- **Hints:** "There's something at the foot of Yari's chair, Gigi. The floor's shimmering." / "In the memory,
  Grandfather is in this Hall with Caona. She wants something written." / "In the memory, use the knife on the back of
  the eighth chair. Then come back and turn it."
- Files: `puzzles/seat_chair/solution.json` (the chair) and `cheats.json` (the present chair turned before the
  anchor: "Plain oak. Nothing is cut into it."); `echoGoals`: Caona, then the chair, then the shimmer.
- **Why it fits:** STORY's "Patricio, Benny and Caona one last time, and Caona's oath spoken aloud in both eras", at
  the one moment the three could have stood in this Hall (the built petition's "received forty-nine years ago and
  never heard"); the Hall's Echo grid has waited since Chapter 5 for a zone; the anchor pays the Chapter 5 line
  "Xaraguá's chair: the eighth, with no chamber behind it but a wall" with a chair that has something behind it after
  all; and Yari says the oath in the present at the Claim (beat 4: "Read the chair"), which is "both eras".

---

## 9. Rael, Elodie, Azzy, Anissa, the family and the witnesses: how the beats are played

### 9.1 Rael (the guide's voice; nothing softer)

- **Before the Hearing** he is seen once: walking up the nave with his hands behind his back and kneeling at the
  dais's foot after taking off the signet (beat 5). Four sentences, no more, the last of them "Make it."
- **At the Hearing** (section 14): he answers each witness in one sentence, confesses the Quiet Crown **in public**
  (the Chapter 11 review's reading: private on the pier, public here), says "I never asked the eggs how they felt. I
  am asking now." and asks **Anissa**. He asks nothing for himself. The guide's rule, written on the scene: "not
  redeemed in the moment"; the pardon is the player's verdict and the terms are the chamberlain's to read.
- **His line to Azzy** at the Hearing, whichever route: nothing. Azzy's chair is behind him; he does not turn.
- **On Strike** he adds one thing, to Gianna, when she asks him why he came north: "I told your mother I would. I
  tell her everything. It is the only honest thing I do." (A line the Strike player earns; Trust players have the
  pier's version.)

### 9.2 Elodie (her chapter, at last; the locked rule released)

- In the gate's arch she is the envoy; in her rooms she is their mother; at the rope she is the thing she said she
  would be. Her lines are in section 2, beats 0, 1 and 4. She never jokes, she never explains Rael for him, and the
  one thing she says against him ("He let them hit your sister instead") is the mother's, not the wife's.
- **At the Hearing** she is a witness (guide 5.6) and says the shortest thing in it: "I married him. I knew what he
  was doing. I did not agree with the testing, and I said so, and I stayed. Write all three." Then she sits in
  Zetwal's chair.
- **In the ending** (section 14): Chief Envoy in the Just Throne; in the Hollow, she "keeps her seat"; in the Iron,
  she leaves the Hall before the end and the chair is empty.

### 9.3 Azzy (the choice on the spot, and the road's question on Strike)

- **On the road (Strike only; beat 0's card is followed by one placed exchange inside the Ardencia Gate, before
  Elodie):** Azzy, who has not spoken to her since the pier: "Before we go in. Why? You had him and you had them."
  Gianna's two answers, both remembered (`choice.strike_why`): *"Because I didn't believe him."* (Azzy: "...Then it was
  a mistake. I can carry a mistake.") / *"Because the realm had to see him beaten."* (Azzy: "...Then it was a lesson.
  I'll remember who it was for.") The second is the dark route's key (beat 4): the Challenge is the player's own
  words answered, not a hidden sum. **Why this reaches the owner (section 12, question 1):** whether Azzy can
  Challenge at all is in the guide; which saves get it is a flow decision.
- His three outcomes are in beat 4. On every route he ends at Ardencia's chair; in the Just Throne he is Marshal of
  the realm (the guide), and Rahel's "Use it on the Crown. Not on him." is paid by a man who used it on the Crown.
- **The Challenge is Gianna's alone** (`fighters`): the party does not fight a brother, and the rulebook's Challenge is
  "the claimant and challenger".

### 9.4 Anissa in this chapter

- She is looked at by the Regent ("He looked at your sister today the way he looks at a page": Chapter 5; here, once,
  at the rope, and the camera says so), spoken to by Elodie ("Anissa."), Patricia, Rael (the question), and the
  chamberlain (the Hearing: "Does the child speak?"). She is never hit, never a target (the Regent's Seize is the
  built Gianna-steps-in path and the chapter's only one), never in a fight, and the Echo is Patricio's. **Her lines on
  the thread** (STORY 4: "she speaks at the Hearing"): "Mama." (the arch), "Mama. In Ardencia, he didn't let them hit
  me." (the rooms), "The floor's shimmering by Yari's chair, Gigi. I can hold it." (the Echo), and at the Hearing, asked
  by Rael how she felt (section 14): **"Scared. Of me. Gigi said never. I'd like you to say it too."** Rael: "Never."
  (Chapter 1's "...Are you scared of me?" / "Never. Not for one second.", paid by the other parent, in front of the
  realm.) Her last line in the game is the ending's (section 14) and it is not a joke.
- **No comedy in a node with her:** Samira prices the Outfitter on the Concourse; Vikram's breath is in the Fields;
  Salkhi is outside the walls; Edmund's one apology is to Rosalind at the door ("Terribly sorry, Mother. I've sat.");
  nothing in the rooms, the Hall, the Claim or the Hearing is a joke.

### 9.5 The family at the Hearing (FAMILY.md; open question 13 kept open)

- **Zetwal's ship at dawn** (shown on the Concourse as the party goes to the Hall: an `enter` through the Zetwal
  Gate, in file): **Anicette** (Volume One, section 7.2), **old Patricio** on his cane, the **Chancellor**, and
  **Sebastian** ("I was somewhere being famous. It was here."). Patricio did not sail to the war ("Marshals muster.
  Captains sail."); he sails to a Hearing because the guide's proposal makes him "a witness at Rael's Hearing about
  the Seventh Clause" and nothing else: **his testimony is the sealing only** (he sealed the binding of six pages under
  protest, `choice.patricio_protest`, and "remembered the wrong thing", Chapter 10). He says nothing about the
  marriage, nothing about Rael being anyone's father, and Rael and he exchange **one look** (a `face` each, no line),
  so **question 13 is not settled here** (the Chapter 10 review's rule, kept). If the owner answers 13 before Nov 13,
  one line goes in at the look.
- **Rahel and Patricia** came on Jordyn's ship to the Muster and the pier; Claude's call: they come to the Hearing
  with Jordyn's company (walkers from the Aldermoor Gate with the watch). Rahel is a witness only in the sense that
  she sits where he can see her: one line, to the Hall, when he confesses: "Six children, three countries. He is the
  only one who never wrote." Patricia blesses nobody and counts the chairs: "Eight. One bare." (or "Eight.") and to
  Anissa: "Things in halves. I said." (Chapter 10's line, finished.)
- **Old Benny and Nancy**: Benny is the witness the guide names ("old Benny may speak"): one sentence, standing, on
  his cane: "I kept an oath and it cost Ardencia a harbor. He kept a goal and it cost him his name. Ask him which he
  would do again." Nancy says nothing in the Hall and takes Anissa's hand on the way out.
- **Amanda, Zelia, Joaquin, Kayla, Aiyana, Jordyn** (the Titis and the Tío): Jordyn is the watch; Joaquin holds the
  gate; Amanda is a witness (the Ardencian rebel leaders he fed and armed: the Lower Town's kitchen, Ar-1 built);
  Kayla and Aiyana are not here (Kirinoura and Agnipur are a sea away; a line each, read by Haru and Vikram from
  letters: "Three lines, which for Kayla is a lot." / "Aiyana measured the flame this morning. It is up."). Zelia is
  with Benny.

### 9.6 The witnesses (guide 5.6, each shown walking to the bench and speaking there)

1. **The Ardencian rebel leaders he fed and armed:** Amanda, bubbly even here and not joking ("I baked for twenty years
   on his money and never knew whose. I would have baked anyway. Write that he paid for the flour and I paid for the
   nights."), and the Free Brasador sergeant of Chapter 4 ("Come back with an army. She did.").
2. **The family of the treasurer he held captive without trial:** the treasurer's daughter (Chapter 3, "She has stood
   at that gate for eleven years") **and the treasurer himself**, freed on the Ash Road the night Rael surrendered
   (shown: he walks in on his daughter's arm, thin, "I am alive. I was held where the ash falls."; the pardon's terms
   "frees every captive" are a thing the player watches arrive). His testimony is the hardest in the Hearing: "He
   held me eleven years because I would have told the elders he was skimming them, and he was right that I would
   have. I was not tried. Try him."
3. **The underground cells he funded:** the lamp-oil seller of Yucayeque ("I never met him. I am meeting him now. I
   would like my oil's price in his own hand, so I can frame it.") and the printer of Kingsmere ("The purge list came
   to us with a thumb on it. Warn them first. We did.").
4. **The Quiet Crown's follower** from the corner (7.3): "You made us. Say what we are now." Rael: "What you do."
5. **Elodie** (9.2). **Azzy** (one line by route: Trust: "He fought beside me on a pier. I did not ask him to. Write
   that too." Strike or Challenge: "I disobeyed him. That was the point of raising me. I am still angry. Write
   that."). **Anissa** (9.4). **Old Benny** (9.5). **Old Patricio** (9.5, the sealing only). **Anicette** (if
   `clue.four_accounts`: "Four accounts of the Ash Wars. The Crown's was the lie. I read all four. So did she."
   (Gianna)).
6. **The corrupt elders of Ardencia** are not witnesses; they are the pardon's terms ("brings the corrupt elders to
   account"), read by the chamberlain and answered by Zelia: "The keep has their ledgers. I kept them."

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **Accord Stability** (`engine/stability.ts`, `STABILITY` in config; the ending's choice) | every input as a flag (Chapter 11's 4.4; the chapters' `choice.*`); `concord`; `globalPillar` | one pure function over flags (about 60 lines), a test per ending, the Journal note | three endings keyed on the verdict alone | 0.2 |
| **The Regent** (three battle variants, five Sealbearers over three phases, `protects`, `seize`, `withdraws`, `endsWithBoss`) | every shape built | data x3; the dialogue's `battle.next` by `globalPillar` (a `max` condition: the engine's `eq` exists; **one condition shape `gt` on two pillar reads**, or the dialogue sets `realm.top_pillar` at the count and branches on `eq`: zero engine) | one variant (Influence) | 0.1 |
| **The Challenge** (`azzy_claim` as a foe; `fighters: ['gianna']`; `binds`) | Vikram's duel | data | the Challenge as a scene without a fight (Azzy yields the claim in words) | 0.05 |
| **The chairs and the tokens** (eight objects with looks by `side.seats.<house>_set`; the turned chair) | objects by `if`, looks | map data; eight dialogues | the tokens as a line | 0.1 |
| **The Echo zone in the Hall** (the chair anchor, Echo-era NPCs and objects) | the Hall's Echo grid; zones; anchors | map data, the puzzle files | none needed | 0.1 |
| **The ending** (the Hearing's verdict, three staged endings on the Hall, three cards, **the Credits opened by the story**, the title) | cards; the Credits screen on the System tab; the intro's title opening | one engine piece: a dialogue `set` of `ui.credits` that FieldScene reads to open the built Credits screen and, on close, the title (about 30 lines); the ending's three scenes as data | the three cards and a "Thank you for playing" card without the credits | 0.3 |
| **The Hearing's witnesses as stage actors** (fourteen walks to a bench) | stage cues | data, written **once from a table** (`witness(id)`: the look, the bench seat, the one line, its condition) | fewer witnesses (the guide's six) | 0.15 |
| **Elodie's rooms** (`seat-rooms`, 14 x 10) | the painter | one interior | the scene in the Quarter's lane | 0.1 |
| **The voyage** `xaragua_ardencia` and the Ash Road card | the plotter, the shore `ardencia` | a path and captions; a card | the card alone | 0.05 |
| **Tier-28 gear** (the Outfitter's stock) | `RPG.items` to 24 | six items (data) | the tier-24 stock | 0.05 |
| **The war table** (`crossroads_war` at 28 to 30) | `crossroads` at 14 to 16 | one table, the layer's condition | the built table at 14 (grey, skipped) | 0.05 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 12), `LATER_STORY_FLAGS` (has `story.claim_begun`) | `ACT12` in `quests.ts`; `'12'` and `'end'` in the marks; the route to `@the-end`; `?chapter=12`; `XP_PER_OBJECTIVE_BY_CHAPTER` row 12 (rows 10 and 11 first); the seat test scoped to Chapter 5's scripts | none | 0.25 |
| **The day-1 sim** (the Regent x3, the Challenge, the Fields; tier 24 and 28; both orders; falls party-wide) | the Chapter 11 build's bot | the hand-built level-28 to 30 party | the built sim once the route reaches it | 0.2 |

About **one and a half builder-days** of engine, wiring and sim, of which Stability (0.2), the credits hook (0.3) and
the sim (0.2) are the only parts that are not data. Nothing here needs a guest system, a scroll engine, a Stability
meter, a new status or a timer.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts`; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **The Lord Regent Aldric Vane** | the Challenge; the boss | Chapter 5's `regent` (seated and standing; a kneeling look new) | |
| **Elodie Limyè** | the arch, the rooms, the rope, the Hearing | Chapter 1 and 5's `elodie` | the ending |
| **Rael** | the surrender, the Hearing | Chapter 3's `rael` (a kneeling look new, the signet off) | the ending (Warden of Oaths) |
| **Captain Rivera**, **Jaime** | behind him | Chapter 3's | |
| **Azzy** | the choice; a foe for one fight | the member look; `azzy_claim` a battle recolour | |
| **The chamberlain** (the Master of the Chairs), **Keeper Hollis** | the count, the drawer, the terms | Chapter 5's | |
| **Captain-General Hale**, **Governor Thorne** | the dais on Trust / if spared | Chapter 11's, Chapter 2's | |
| **Jordyn** | the watch | Chapter 9's | |
| **Lady Rosalind Stillwater**, **Layla Dorini** (or her clerk) | Aldermoor's and Al-Doria's chairs | Chapter 9's `rosalind`; Chapter 4's `layla` | |
| **Anicette**, **old Patricio**, **the Chancellor**, **Sebastian** | Zetwal's ship | Chapter 1's; Chapter 9's | |
| **Rahel**, **Patricia**, **old Benny**, **Nancy**, **Zelia**, **Amanda**, **Joaquin** | the family at the Hearing | Chapter 10's and 3's | |
| **The treasurer** (new), **the treasurer's daughter**, the **Free Brasador sergeant**, **the lamp-oil seller**, **the printer**, **the Quiet Crown follower** (new) | the witnesses | one new look, the rest built | |
| **The Crown's clerk** | writing, then not | Chapter 5's | |
| **Caona**, **young Benny**, **young Patricio**; the Echo chamberlain and clerk (new, old-uniform recolours) | the Echo | built; two recolours | |
| **Sealbearers, Hushers, Marines, Officers** | the fight, the Fields | built | |

Voices: the Regent never raises his; Rael in short sentences and the guide's lines; Elodie in two registers (the
envoy's for the clerk, hers for her children); the chamberlain in the Compact's words; Hollis as a keeper; the
witnesses in their chapters' registers; nobody in the Hall sounds like a speech except the chamberlain reading the
terms, which is the one speech the chapter has.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**Two.**

**Question 1: Who can get Azzy's Challenge (the dark route)?**
*Why it reaches the owner:* the guide puts Azzy's Challenge in the design, and the Oct 22 decision keeps him in the
party on Strike "furious, his anger colouring the Claim"; how many Strike players see their brother Challenge them
changes the flow of the climax for them and the Hearing's register.
1. **(Recommended) Only a Strike player who tells him "the realm had to see him beaten"** (the road's question,
   section 9.3): the Challenge is the player's own words answered on the tile; every other Strike save gets the
   furious renunciation ("I'm still angry. That is not the same as a Challenge."), and the `share` save gets him on
   the tile beside her, angry. *Reason:* Strike already cost the fleet and Stability; a Challenge on every Strike save
   would punish a legitimate route twice and make the brother's choice a sum the player cannot see; one spoken answer
   makes it theirs.
2. Every Strike save gets the Challenge (the guide's "dark route" read as the Strike route).
3. No Challenge in the release (renounce or share only; the duel after the release).

**Question 2: Does old Patricio testify at the Hearing, and about what?**
*Why it reaches the owner:* the guide proposes him as "a witness at Rael's Hearing about the Seventh Clause"; STORY's
open question 13 (does he know about the marriage?) is still open, and the Hearing is the last scene where a word from
him could settle it by accident.
1. **(Recommended) He comes on Zetwal's ship and testifies about the sealing only** (six pages sealed under protest;
   "I remembered the wrong thing"); he and Rael exchange one look and no line. *Reason:* it is the guide's own
   proposal, it is the Seventh Clause's last witness in the room where the clause is struck, and it settles nothing
   about the marriage, so the owner's answer to 13 can still go either way (one line at the look, when it comes).
2. He stays in Zetwal (Anicette and Sebastian come; his testimony is read by the Chancellor from a letter).
3. He testifies and the owner answers 13 now, so the look becomes a line.

**Near-misses, resolved as Claude's calls (if the second review disagrees, either becomes a pop-up with the
recommendation first and the build goes ahead on it):**

- **The final Echo is in the Throne Hall, forty-nine years ago, with the petition; not in the Archive.** STORY says
  "the Throne Archive's Echo"; the Archive's built Echo is the sealing, where Caona was not. *Recommendation:* keep;
  it is the design's scene at the one moment it could have happened, and the built petition item dates it.
- **Rael surrenders at the Throne on both routes, after the Claim, not at a gate.** *Recommendation:* keep; the
  Chapter 11 review's "To a Throne. Not to a watch." and the guide's "surrenders to Gianna's Throne".

The Claude's calls, each with its reason:

- **The arrival is by sea to Ardencia's strand and the Ash Road by card, at the Ardencia Gate.** *Reason:* Eightgate
  is inland and the voyage engine has no Seat shore; the strand is Chapter 3's camp; the Ash Road pays Rael's title.
- **The Claim follows the rulebook's order: the count, the tile, the challengers from the claimant's left (Azzy),
  then the Regent; a claimant who meets every Challenge wins at once; the chairs fill.** *Reason:* the guide's "per
  rulebook Section 8" and the board game's words, kept so the climax mirrors the table.
- **Azzy's choice is his, read from `choice.azzy_ordu` (share), `war.strike` with `choice.strike_why` (Challenge), else
  renounce.** *Reason:* the chapters said those flags were "remembered for Chapter 12's Claim"; the owner's "his anger
  colours the Claim" is shown on every Strike save.
- **The Regent at x7, three pillar variants chosen by the realm's highest pillar, the Seize answered as built, no
  Dawn Surge.** *Reason:* the engine's shapes; the Chapter 11 review's gates; COMBAT's design kept where the engine has
  the piece.
- **The Challenge is Gianna alone, `binds`, 0 XP.** *Reason:* the rulebook's "the claimant and challenger"; nobody is
  paid for fighting family; Vikram's duel is the precedent.
- **Stability is one pure function from a config table, shown once, after the verdict; the endings: Iron on
  execution, Just on pardon with 70 and Influence over Fear, else Hollow.** *Reason:* the Opus plan review's "a record
  of the Accord's Stability inputs" made a score; the guide's three "needs" in the engine's words; a realm is not a
  meter.
- **Two required quests, Se-5 stage 2 and Se-1; the debate is the post-Turn corner with a Quiet Crown follower.**
  *Reason:* both quests are threads' ends the design placed here; the guide's corner after the Harbor Turn.
- **Elodie's rooms are a new 14 x 10 interior.** *Reason:* CAPITALS lists them and Chapter 5 never built them; the
  mother's scene needs a door the clerk is outside of.
- **Rael's Quiet Crown confession is public here, private on the pier.** *Reason:* the Chapter 11 review's 3.16 and
  STORY 6.3's "confession at the Hearing".
- **The treasurer walks in alive at the Hearing.** *Reason:* Chapter 3's "I am alive. I am held where the ash falls."
  and the pardon's "frees every captive" shown as a man arriving, not a term read.
- **The ending is a staged scene on the Hall, three cards, the Credits screen and the title; no scroll.** *Reason:*
  the engine has cards and a Credits screen; a scroll is a new system for one screen; the guide's "each house's
  fate" fits three cards' lines.
- **`XP_PER_OBJECTIVE_BY_CHAPTER` row 12 = 60; the Regent 360; Se-5 200.** *Reason:* section 5's sums to the cap.
- **No Coralie in this chapter; Kayla and Aiyana are letters.** *Reason:* two chapters each already; a Hearing of
  thirty people is the risk in section 16.
- **Names are proposals** (Aldric Vane from the design, already in a built line; Hale from COMBAT; the chamberlain
  "the Master of the Chairs" as built; Layla from Chapter 4); the build names people by role until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapters 6 to 11's estimates:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the card, the Ardencia Gate, Elodie in the arch; the road's question (Strike) | ~40 | 1 | ~25 | |
| The Quarter, Mother's rooms (four exchanges, one choice), Volume One | ~80 | 2 | ~40 | |
| The corner's debate; the chairs by night (eight tokens); the Outfitter | ~160 | 3 | ~45 | 0 to 2 ambushes if the player walks the Fields |
| Dawn: Zetwal's ship, the book handed over; the Hall; the Echo (the petition, the chair); Hollis's drawer; the count | ~120 | 3 (the Echo) | ~45 | |
| The Claim: the rope, the tile, Azzy's choice (three variants), the Regent's Challenge | ~30 | 0 | ~40 (x3 variants: ~25 more written) | 1 to 2 |
| After: the chairs fill, the Regent walked out, Rael walks in, the card | ~20 | 0 | ~25 | |
| **Chapter 12** | **~450** | **9** | **~245 written, ~200 heard** | 1 named (2 on the dark route), 0 to 2 ambushes |
| **The Hearing:** fourteen witnesses, the confession, the question to Anissa, the verdict | ~20 | 0 | ~70 | |
| **The ending:** the staged scene (one of three), the card, the credits, the title | ~10 | 1 | ~30 (x3: ~20 more written) | |
| **The epilogue** | **~30** | **1** | **~120 written, ~85 heard** | |

About **30 to 35 minutes** as played, against the plan's 30 (the Claim 20 and the Hearing 10): the five minutes
over are the chairs by night and the Echo, and the Hearing's witnesses are the last thing cut (section 16).

---

## 14. The epilogue: the Hearing, the verdict, the three endings, the end card and the credits

### 14.1 The Hearing (seat-hall at noon; the chairs filled; a condition: `story.hearing_called, !hearing.verdict`)

- **Shown, before anyone speaks:** the Hall at noon; the chairs filled as the Claim left them; **Gianna on the
  dais's step, not the tile** ("I will sit on it when it is a council's chair and not a prize": her one line as the
  scene opens; the owner's pushback in the guide 5.7, answered by a woman who does not sit on it alone); the
  **witnesses' bench** along the west wall (new objects), the clerk's table with Hollis at it (the keeper keeps the
  record: the Compact's), **Rael kneeling at the dais's foot** with the signet on the step and Jordyn behind him; the
  gallery (the Concourse's people placed along the east wall: pilgrims, the market's vendor, the Quiet Crown follower,
  the companies' captains), **Anissa at Elodie's side by Zetwal's chair** (placed; the follower is off for the scene).
  The music: a new slot `hearing` (the theme "again, quietly": a placeholder reusing `farewell` until the owner's
  score).
- **The form (the Assize's, which the player learned in Chapter 9, turned the right way up):** the chamberlain opens
  it ("The Hall hears Lord Rael Rodriguez of Ardencia, who has surrendered himself to the Throne. A Hearing is not a
  trial. Witnesses speak. The accused answers each. The Throne decides."). **Each witness walks from the bench to the
  clerk's table, speaks once, and Rael answers once** (section 9.6: fourteen at most, each a walker from a table
  `witness(id)`; the conditional ones by their flags). The order: the treasurer and his daughter first (the hardest),
  Amanda and the sergeant, the lamp-oil seller and the printer, the follower, Benny, Patricio (the sealing only),
  Anicette (if the four accounts), Rahel's one line from her seat, Elodie, Azzy, and **Anissa last**.
- **The confession, public (the second reveal, STORY 6.3):** before Anissa, the chamberlain: "Is there anything the
  accused would say unasked?" Rael stands (the standing look) and says it to the gallery, where the follower is, not
  to the chairs: "I founded the Quiet Crown. Long ago, as a way for frightened people to be useful. None of you knew.
  That was the design, and the design let the Regent's almoner turn your cells against a child. I dissolve its chain
  of command here, in front of you, which is the only place it could be dissolved. What you are now is what you do."
  The follower, from the gallery (the debate's `after`): if mediated: "Then we will listen to ourselves."; else
  nothing. The Crown's clerk writes it down (a line).
- **The question (the guide's line):** "I never asked the eggs how they felt. I am asking now." He turns to Anissa
  (a `face`). The chamberlain: "Does the child speak?" Anissa, from Elodie's side, not walking to the table (she holds
  her place, which is the thread): "Scared. Of me. Gigi said never. I'd like you to say it too." Rael: "Never." He
  kneels again. (No line follows it; the camera holds a moment: a `wait`.)
- **The verdict (the chapter's second pop-up for the player, three entries, all remembered):** the chamberlain, to
  the dais: "The Throne decides." Gianna's choice:
  - ***Pardon, with conditions.*** (`hearing.pardon`.) The chamberlain reads the confirmed terms (the guide's, in the
    Compact's words, the one speech the chapter has): Warden of Oaths, "in the light"; the Ash Ledger the Throne's
    **Office of Oaths**, "to find and fight oppression and for nothing else"; the Quiet Crown's chain dissolved (done);
    every captive freed (the treasurer stands: done); restitution to the treasurer's family ("from the elders'
    ledgers, which the keep holds": Zelia); the corrupt elders of Ardencia to account before this Hall. Rael: "I
    accept every one. Write that I asked for none of them." He stands; Jordyn steps back; **he does not put the
    signet on**: Gianna picks it up off the step and holds it beside the Locket, and **both halves glow** (`fx:
    'token'`, the built rule: a true thing). Anissa: "It's the same light, Gigi." (Chapter 3's line, in the right room.)
    Gianna puts the signet in his hand, not on it: Chapter 3's gesture returned ("He puts the Locket back in her
    hand. Not around her neck. In her hand.").
  - ***Exile.*** (`hearing.exile`.) "Lord Rael leaves the realm by the Ardencia Gate before dusk and does not return.
    The Ash Ledger is not the Throne's, and the Throne does not know where it goes." Rael: "It goes dark. I built it
    to. That is the part you should have asked about." He walks out the way he came (an `exit` down the nave, Rivera
    and Jaime behind; Benny does not stand). Elodie keeps her chair. Azzy does not turn.
  - ***Execution.*** (`hearing.execution`; the dark route.) The chamberlain reads it in one sentence. Rael: "Then I was
    right about one thing. A dead man cannot answer for himself. You will have to." He is walked out by Jordyn's watch
    and two Sealbearers to the heralds' stair (shown: the walk; nothing on screen after the stair; **off-screen, a
    bell**, once: the owner's rule for off-screen events). Elodie stands and leaves the Hall by Zetwal's door before
    the bell (shown; the chair empty). **Anissa** (the guide's "watches her sister become the thing they fought"):
    she does not speak to Gianna; she walks to the empty Zetwal chair and sits in it (a `walk`), facing away from the
    dais. Benny: "Forty-one. I count." (Cendre's forty, and one.) Yari stands up from the eighth chair and leaves the
    Hall (the Iron Throne's "Yari leaves", shown now, not told in a card).
- `hearing.verdict`; the Stability note in the Journal (section 4.2); then **the ending** (a condition on the verdict
  and the score).

### 14.2 The three endings (staged on the Hall and the Concourse; then three cards; the Journal's last note)

Each is one short staged scene (about ten lines) on the Hall, then one card with the house-by-house fate (the
guide's "final text scroll" as a card's lines), then the credits.

- **The Just Throne** (`hearing.pardon`, Stability at least 70, Influence at least Fear): **the standing council,
  shown:** Gianna sits on the tile at last, and the eight chairs' people turn to face it (a `face` each); the
  chamberlain: "The Council of Eight. The old plan, never used." (the Hall's book, paid). Yari: "Cacica Yari of
  Xaraguá sits for a harbor that stays with the people who fish it." Azzy: "Marshal of the realm. Mother will say I
  got the temper." Elodie: "Chief Envoy. I will keep the Regent's guests waiting." Rael, standing behind no chair, by
  the clerk's table where the Office of Oaths will sit: "Warden of Oaths. The first oath on the ledger is the seventh
  clause." (Hollis sets the petition in front of him.) Rosalind for Aldermoor ("The Crown keeps no almoner. It keeps
  an oath now."), Bayarmaa, Haru, Vikram, Layla or her clerk for theirs; a betrayed house's chair bare and the
  chamberlain's line ("One chair waits. The Hall is patient."). **Anissa's last line**, to Gianna, at the tile: "You
  can get down now, Gigi. I'll hold it." Gianna gets down (a step off the tile: the thing the guide's pushback asked
  for). The card: *The Just Throne.* Lines: each house's fate in one line (Xaraguá's harbor by law; Ardencia's elders
  before the Hall; Al-Doria's guild paid; Skarragol's standard; Kuroshi's files burned by Kaede; Jwaladesh's flame
  up; Aldermoor's purge list published; Zetwal's seventh line cut into the Marshal's stone at last, in Patricio's
  hand).
- **The Hollow Throne** (pardon under 70, or exile): the same Hall with gaps: Gianna on the tile, the chairs half
  turned; one or two houses' people already walking out the doors as the scene opens (by `army.*` and the verdict:
  shown); Rael gone (exile) or at the clerk's table with no petition in front of him; Elodie: "Keep working." (the
  guide's "a hint that she must keep working", said by the one person who would). Anissa's last line: "I'll hold it a
  while longer, Gigi." The card: *The Hollow Throne.* Lines: the fates with the strain in them (the Ash Ledger "goes
  on, unaccountable"; a house "withdraws"; "debts unsettled").
- **The Iron Throne** (execution): the Hall nearly empty: Gianna on the tile alone; the Regent's two Sealbearers at
  the rope's posts again (placed: they serve whoever sits); Yari's chair empty, Elodie's empty, Anissa in it with her
  back to the dais; Azzy at Ardencia's chair, standing, the only one who stays ("I'll hold you to it. Every day. That
  was the promise."); Benny at the door, counting nobody. Anissa's last line, not turning: "Gigi. The lamp's gone out."
  The card: *The Iron Throne.* Lines: order kept by force; Yari gone home; the Quiet Crown's cells quiet "for a
  different reason"; "A tragedy."
- **The last card on every route** (after the ending's card): *Chapter 12 complete. The Claim.* with one line that is
  the game's: "The Gaze sees you both. So does she." (Chapter 1's farewell, finished by the goddess's own word for
  herself: "I remember.") Then **the Credits** (the built screen, opened by the story: the owner's art and score,
  the font, and a new first line: *Bloodlines: Echoes of Zetwal. Written and built for Elodie.* only if the owner wants
  the dedication: a question for the reviewer prompt, not a pop-up), then **the title** (the intro's title opening,
  "Press A"). `act12.complete`; the save keeps everything: the Hall is open after the end (the chairs, the witnesses
  gone, Rael at the clerk's table on a pardon), and the Fields' table runs, so a player can walk the realm after the
  credits; "Next Generation mode (Yari)" is after the release.
- **The BETA and the demo:** the release is the whole quest, so the title screen's BETA label (if any) and the demo's
  "Thank you for playing the demo! Chapter 2 on November 22" card are not this repository's; `cards.ts`'s note about
  the demo repository stays as a note and nothing is deployed (owner decision, Oct 20).

---

## 15. Continuity checks against the built chapters (every fact cited, grepped on this branch)

| This outline says | Built fact | Where |
|---|---|---|
| The Throne tile is on the dais at the far end, 2 x 2, "Nobody has stood on it in fifty years"; the rope's `if` is `!story.claim_begun` | `obj('throne_tile', 21, 2, ...)`, `obj('throne_rope', 16, 5, { ..., if: '!story.claim_begun' }, 12, 1)`; `throne_tile`'s line | `quest/tools/maps/seat.ts`:245-246; `quest/src/data/dialogue/seat.ts`:493 |
| The chairs' order and the chambers' doors | `CHAIRS` zetwal 14, xaragua 16, ardencia 18, al_doria 20, aldermoor 23, skarragol 25, kuroshi 27, jwaladesh 29; `CHAMBERS` | `quest/tools/maps/seat.ts`:186-208 |
| The Chapter 5 envoys stand at their doors with no condition (so they need `!act11.complete`) | `npc('envoy_dorini', 2, 23, 'right')` and the rest | `quest/tools/maps/seat.ts`:263-269 |
| The Regent's Chapter 5 placement is conditioned on the welcome and Hollis | `npc('regent', 23, 3, 'down', { if: '!story.elodie_hall|story.hollis_agreed' })` | `quest/tools/maps/seat.ts`:256 |
| `story.claim_begun` is already a later story flag | `LATER_STORY_FLAGS` | `quest/src/data/encounters.ts`:10-12 |
| "The chairs fill at a Claim, not a Parley. Bring me a token of goodwill..." | the chamberlain | `quest/src/data/dialogue/seat.ts`:357 |
| "Xaraguá's chair: the eighth, with no chamber behind it but a wall." | `chair_xaragua` | `quest/src/data/dialogue/seat.ts`:492 |
| The petition "received forty-nine years ago and never heard" | the key item `petition` | `quest/src/data/rpg.ts`:198-203 |
| The Regent: "I will be here. I am always here."; "Then win the houses, if you can. Eight gates."; his terms | the Parley's `refused` node | `quest/src/data/dialogue/seat.ts`:883-898 |
| Hollis: "No signature. The clerk's seal alone. And the seventh ribbon carries no witness knot." | | `quest/src/data/dialogue/seat.ts`:866 |
| Yari's hand on the eighth chair: "Fifty years. Nobody revisited it. We fought beside you, and you wrote us down as waters." | | `quest/src/data/dialogue/seat.ts`:876-879 |
| Elodie's two lines; "I married your father in secret..."; "I took it so no one would count you."; "Azriel." | `ELODIE_LINES`; the curtain scene | `quest/src/data/dialogue/seat.ts`:58-61, 940, 967-974 |
| "Gianna Elise Limyè" | the herald | `quest/src/data/dialogue/seat.ts`:191 |
| The seat test forbids "Rael" with "father" in one line anywhere in Eightgate | | `quest/tests/seat.test.ts`:143-146 |
| Se-5 stage 1 built, stage 2 "runs through Chapters 6 to 12"; the three tokens exist | `seats`; `token_ironvow`, `token_suzumori`, `token_agnivansh` | `quest/src/data/sideQuests.ts`:453-480; `quest/src/data/rpg.ts`:221, 272, 295 |
| The Seat's nine books (no *Rules of Claim*, no *Four Faiths*) | `seat_*` ids | `quest/src/data/books.ts`:571-677 |
| The Fields' table is on `story.seat_arrived` at 14 to 16 | `crossroads`; the four encounter layers | `quest/src/data/encounters.ts`:348-380; `quest/tools/maps/seat.ts`:454-457 |
| The reveal: "Elodie Limyè is my wife..."; "It changes nothing. You lost."; the token's glow is `fx: 'token'` on a true thing, the lie is `fx: 'signet'`; "He puts the Locket back in her hand. Not around her neck. In her hand." | | `quest/src/data/dialogue/ardencia.ts`:682-698, 711-713 |
| Azzy: "There are two of us with a claim to that seat now. I did not want it when it was one." | | `quest/src/data/dialogue/ardencia.ts`:1033 |
| Old Benny: "I made the other half." | | `quest/src/data/dialogue/ardencia.ts`:416 |
| The treasurer: "I am alive. I am held where the ash falls."; his daughter "has stood at that gate for eleven years" | `clue.treasurer_alive`; Ar-2 | `quest/src/data/dialogue/ardencia.ts`:271, 399 |
| Azzy's three steppe answers `choice.azzy_ordu` influence / fear / share; "Then it is not for one of us." | S-5 | `quest/src/data/dialogue/skarragol.ts`:737-739, 766 |
| Chapter 1: "The Gaze sees you both. So do I."; "...Are you scared of me?" / "Never. Not for one second."; Anicette's "Two halves of a promise..." | | `quest/src/data/dialogue/zetwal.ts`:134, 1077-1078, 716 |
| The goddess: "I am Elodie. I wove this realm, and I remember all of it." / "Elodie? Like my mother?" / "I do not rule this world. I only remember it." | | `quest/src/data/gameOver.ts`:11-16 |
| Chapter 9: the Regent "After the Assize. With a fleet. That is a revisiting."; "Aldric Vane: grey, thin, a chain of office"; "Your mother sits on my council." | | `quest/src/data/dialogue/aldermoor.ts`:473, 495, 1288 |
| Caona's oath, word for word | | `quest/src/data/dialogue/xaragua.ts`:277, 931 |
| The remembered Chapter 1 choices and where each was paid | `choice.farewell_*` (Grandmother, 700-705), `choice.soup_*` (283-288), `choice.yari_*` (1343-1344; `xaragua.ts`:73-74), `choice.envoy_waters` (`xaragua.ts`:192), `choice.warned_watcher` (358; `aldermoor.ts`:66) | `quest/src/data/dialogue/zetwal.ts` and as listed |
| A duel of one member: `fighters`; Vikram's duel as `meantToLose` with `fighters: ['gianna']` | | `quest/src/engine/battle.ts`:381, 671-672; `quest/src/data/battles.ts`:1081-1086 |
| `protects` intercepts at 0.75; `seize` finds Gianna by `anissaBond`; the statuses used exist | `INTERCEPT_CHANCE`; `seize` | `quest/src/config.ts`:254; `quest/src/engine/battle.ts`:1129-1162 |
| The stat line and roles; Story x0.8 HP, x0.7 damage; the bands | `ENEMY_STAT_LINE`, `ENEMY_ROLE`, `DIFFICULTY`, `LEVELS.bands` | `quest/src/config.ts`:60-65, 305-313 |
| The curve 50 / 1.6 and the cap 30; nine XP rows; `CHAPTER_LEVELS` 12: 28 to 30 | | `quest/src/config.ts`:60-79; `quest/src/data/chapterLevels.ts` |
| The Credits screen exists on the System tab; cards are one title and lines; the demo card note | `openCredits`; `CardDef`; `cards.ts`'s comment | `quest/src/scenes/FieldScene.ts`:2043-2047, 2495; `quest/src/engine/content.ts`:31-37; `quest/src/data/cards.ts`:6-7 |
| The voyage shores are the seven capitals (no Seat); Eightgate at (68, 64) inland | `shore` union; `capitals.seat` | `quest/src/engine/voyage.ts`:23; `quest/src/data/realmMap.ts`:25 |
| Chapter 3's strand camp map exists | `ardencia-camp` | `quest/tools/maps/ardencia.ts`:445 |
| Chapters 10 and 11 are not built on this branch | the `chapter10` branch is behind HEAD (4,335 deletions); `chapters.json` ends at "10" | `git diff --stat HEAD..chapter10`; `quest/src/data/starts/chapters.json` |

**Lines this chapter must not contradict:** Rael never says "my daughter" to Gianna in the Hall in a line that also
says "Rael" (the seat test's rule, kept by habit); Coco's wedding-coat line stands and she is absent; the Regent
"never speaks to Anissa" (Chapter 5 and 9) and keeps it to the end: his One Hand line is to the Hall, not to her;
Thorne's register is to the word; the goddess is "the goddess" in code and files and "Elodie" only in her own line.

---

## 16. Risks

- **No sim before the outline, and the Regent is the game's last boss.** Day 1 builds the level-28 to 30 party at
  tier 24 and 28 and runs the three variants, the Challenge and the Fields in both orders, falls party-wide, with the
  Chapter 11 review's gates; x7 moves to x6 or x8 by the measurement.
- **Thirty people in one Hall.** The Hearing is the biggest stage scene in the game. The witnesses come from a table
  and walk one at a time; the fallback is the guide's six (the treasurer's family, Amanda, the lamp-oil seller,
  Elodie, Azzy, Anissa) with Benny and Patricio, and the rest placed and silent. The stage runner's limit is still
  unknown (Chapter 11's twenty-one was never run); the Claim's chairs fill one walk at a time by design.
- **The dark route is two fights and a verdict the owner may not want shown.** The Challenge is `binds` and nobody
  dies; the execution is a walk up a stair and a bell off-screen; both are behind the player's own words. If the
  owner says no to either (section 12, question 1; the reviewer prompt's read of the Iron Throne), each is a
  condition switch, not a rewrite.
- **The ending touches the one screen that is not a map.** The credits hook is thirty lines in FieldScene and a
  test; the fallback is a card. Nothing else leaves the map.
- **The Stability dials are guesses until the whole-game pass.** Section 4.2's table lands the three endings where
  the guide wants them on paper; Nov 16 to 21's play-through is where they are set, and the reviewer prompt asks for
  a Strike-and-pardon run to see whether Hollow is fair.
- **Question 13 is still open.** Patricio's testimony is the sealing only and he and Rael exchange a look; if the
  owner answers before Nov 13, one line goes in; if after, it goes in at the polish pass. Nothing in the Hearing leans
  on it.
- **Chapters 10 and 11 are not built.** Everything here except the flags' names can be built from the Chapter 11
  outline's section 14 state on a hand-written start save (both Turn routes, one betrayed and one turned house, the
  three verdicts: six short routes, two in the browser). If the Chapter 10 or 11 builds move the tokens, the armies or
  Benny's road, sections 1, 7.1 and 9.5 move with them and nothing else.
- **Faith on the map.** The corner's follower is a lonely woman who fed pilgrims, not a caricature (guide 7.3); the
  Quiet Crown is dissolved by the man who made it in front of her; no real faith is shown as a cult; the fluent check
  (Nov 18) has no new language here.
- **The plan's dates.** Chapter 12 and the epilogue are Nov 13 to 16 (four days) with the whole-game pass from Nov 16;
  this outline is sized to 3.5 days (section 17) and names its cuts.

---

## 17. Build plan (small steps, each checked before the next; sized to 3.5 builder-days, Nov 13 to 16, then the polish pass Nov 16 to 21)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 12 and the Epilogue rewritten to
   this outline (the Hall's Echo, Azzy's three outcomes, the verdicts as staged, the endings' needs in the engine's
   words); `CAPITALS.md` 5 (the rooms, the war table, the chairs' tokens, the Echo zone); `SIDE-QUESTS.md` (Se-5 stage
   2 and Se-1 as built; Se-2's post-Turn corner); `PUZZLES.md` (the chair, M-SEA-1); `COMBAT.md` 13.3 #10 (as built: x7,
   the three variants, no Dawn Surge), 13.2 (the Seat rows), a new section for Stability; `FAMILY.md` (every row's
   Hearing column marked); `QUEST-BUILD-GUIDE.md` 5.6 and 5.7 marked built; the Regent's kneeling look, the treasurer,
   the follower, the chairs' tokens and the bench into `ART-PROMPTS.md`. **The hand-made start save** (the Chapter 11
   outline's section 14 state; if Chapter 11 has landed, `?chapter=12` from its route).
2. **Engine and data (Opus, half a day):** `engine/stability.ts` and `STABILITY` (first, with its three ending tests);
   the credits hook (second); the Regent x3, the Sealbearer at 29, `azzy_claim`, `crossroads_war`; the tier-28 stock;
   the XP row (rows 10 and 11 first); the `hearing` audio slot; **the sim** (the Chapter 11 bot, the eight-fighter
   party at 28 to 30, tier 24 and 28, both orders): the gates in section 5 pass or the scale moves.
3. **Maps (Sonnet):** the Concourse's Ardencia Gate spawn and the records-room door, the companies' pairs at the
   gates; the Hall's token objects, the turned chair, the Echo zone and its Echo-era NPCs, the dawn placements, the
   tile's trigger, the bench and the clerk's table, the gallery's placements, the ending's layers; `seat-rooms`;
   the Quarter's door; the Fields' layer; the Chapter 5 placements' `!act11.complete`; validated (the zone walkable in
   both eras); Chapter 5's tests green.
4. **Content (Haiku and Sonnet, in parallel):** the witness table (`witness(id)`), the `DebateDef` *Is it still a
   faith?*, the Journal notes (*The eighth chair*, *Filed with the clause*, *The count*, *The Accord's Stability*),
   the two books' second looks, the looks (section 11), the Foes page rows, the voyage's captions, the two cards.

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/seatClaim.ts` staged from the beats, in this order so
   an interruption leaves a playable chapter: the gate and Elodie in the arch (the road's question on Strike); the
   rooms (four exchanges, the choice); the chamberlain by night and the chairs (Se-5 stage 2 from a table); the dawn,
   Zetwal's ship, the book; the Hall's Echo (the petition, the chair); Hollis's drawer; the count; **the Claim** (the
   rope, the tile, the declaration); Azzy's three outcomes; the Regent's Challenge and the three variants; after (the
   chairs fill, the Regent out); Rael's surrender; the card. `ACT12` in `quests.ts` with hints and goals, `echoGoals`
   on the chair.
6. **The Hearing (early afternoon):** the opening, the witnesses from the table (each conditional), the confession,
   the question, the verdict's three entries, the pardon's terms read, the exile's walk, the execution's stair and
   bell, Elodie's and Yari's and Anissa's staged answers.
7. **The ending (late afternoon):** the three staged scenes, the three cards, the last card, the credits hook called,
   the title; `act12.complete`; the Hall open after.

**Day 3:**
8. **The puzzle files and tests:** `puzzles/seat_chair/`; the fights' bot tests at 28 to 30 in both orders; a lost
   Challenge and a lost Claim (the way back in, the flags clean); the Stability tests (one save per ending; a
   Strike-and-pardon save lands Hollow unless Concord and the chairs lift it); quests, guide, debate, side-quest, maps,
   stage (the Hearing's actors) and content tests green; the content tests: no Samira, Vikram, Edmund or Salkhi line in
   a node with an Anissa line; no joke marker in the rooms, the Claim, the surrender, the Hearing or the endings; no
   line of the Regent's addressed to Anissa; the seat test scoped to Chapter 5's scripts and its rule kept in Chapter
   12's lines; `party.rael` false everywhere.
9. **The route:** Chapter 12's route from its start to `@the-end`, six variants (Trust / Strike x betrayed / turned, and
   the three verdicts on one), two in the smoke test; `chapter-starts.ts` with chapter 12 and `end`; `act.test.ts`;
   `tools/level-curve.ts` run and the dial set; the smoke test's Chapter 12 section with screenshots of Elodie in the
   arch, the rooms' lamp, the chairs with the tokens, the chair turned, Hollis with the petition, the rope down,
   Gianna on the tile, Azzy at the dais's foot (each outcome), the Regent with his Sealbearers, the chairs filling,
   Rael kneeling with the signet on the step, the bench, Anissa at Elodie's side, the glow at the pardon, the Just
   Throne's council, the card and the credits, at 844 x 390 and 390 x 844.

**Day 4 (the morning; then the whole-game pass begins):**
10. **Full browser test:** the chapter and the epilogue end to end on a phone, both Turn routes, the three verdicts;
    the Challenge lost and won; the Claim lost (the goddess, the way back in); a save on the eve, at the rope and at
    the bench; `npm test`, typecheck, lint, build; the reviewer prompt in `reviews/reviewer-prompts/` (the Chapters 10
    to 12 batch, about Nov 17: a human read of every Rael, Elodie, Azzy and Anissa line in the Hall, the Iron Throne's
    staging, and a Strike-and-pardon run); the milestone note with the level statement and the Stability dials.
11. **The polish pass (Nov 16 to 21, the plan's):** the whole game played through at the cap; the Stability dials from
    real runs; the credits' dedication line if the owner wants it; the phrase check; saves and phones.

**If day 2 runs over, cut in this order:** the Fields' war table (the built table, grey, backs off), the Outfitter's
tier-28 stock (tier 24 stands), Zelia's and Rosalind's lines (placed and silent), Kayla's and Aiyana's letters, the
Hollow and Iron endings' staged scenes (their cards stand; the Just Throne's scene is never cut), the witnesses past
the guide's six plus Benny and Patricio, Thorne and Hale on the dais, the Echo's Crown clerk (the chamberlain files it
himself). **Never cut:** Elodie in the arch and in her rooms, the chairs set by hand, the petition's Echo and the
chair turned, the count in the Compact's words, the rope down and Gianna on the tile, Azzy's three outcomes, the
Regent's Challenge, the chairs filling, Rael kneeling with the signet on the step, the confession in public, the
question to Anissa and "Never.", the verdict's three entries, the Just Throne's council and Anissa's "You can get down
now, Gigi. I'll hold it.", the last card, the credits.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Nov 8 decision date (this chapter is the last build after it, and its cut list is written for the
"all twelve plainer" branch); the Dec 1 story questions, now needed by early November (this chapter answers Azzy's
choice, the Hearing's witnesses, Rael's surrender and the endings' needs as Claude's calls; **question 13, Patricio
and the marriage, stays open and is staged so either answer fits**; section 12's two questions are the last ones the
story has); the fluent-speaker check (Wed Nov 18: no new language here; *guamo* stays on the list with S-XAR).

## Decisions after the second review (Oct 22)

The second review is in `2026-10-22-chapter12-epilogue-outline-review.md`. The build takes every fix it lists. These are Claude's calls, following the sources:
- **The Seventh Clause:** the filled chairs answer the *Petitions of Breach* at the Claim, under Clause Six of the Founding Compact ("A clause not read is not agreed"). The remedy follows the verdict, so the release resolves the clause on screen.
- **Order of the climax:** the Regent first, then Azzy's choice (guide; COMBAT 13.3 #10).
  - The claimant strikes first, and damage carries between Challenges ([42]).
  - The claim threshold is 9 in total with at least 2 in each pillar ([45]).
  - "Her left" is the Regent's side.
- **Hooks the Hall already built:**
  - At the count, Elodie speaks Anissa's real names, so the realm hears she is Rael's daughter.
  - The Regent's Commission is his legal ground to Challenge.
  - Clause Twelve is addressed.
  - The Council of Eight did sit until the Ash Wars.
  - The chamberlain places each token on its chair.
- **The fights:**
  - The Regent at HP x6, ATK x1.6, MAG x2.0, with a group attack every 2 turns. There is one version of him, and the tier-28 shop is cut.
  - Azzy at HP x4, ATK x1.2.
  - Anissa's tip is replaced with one that is true of the fight.
- **Accord Stability:** the review's recalibrated table, tested on five saves. The Hollow card names what it cost.
- **The Regent's reckoning:** he is arrested on the Almoner's commission, under his own seal, with one fate line per ending.
- **The families:**
  - Benny lays *Benny's Refusal* before Rael at the pardon.
  - Azzy and Rael get a real last exchange, without reusing "That was the point of raising me".
  - Elodie and Rael get one moment.
  - Elodie's lines are corrected to built Chapter 5 and the settled answer on Azzy's mother.
  - Elodie never puts her sister's beating on Anissa.
  - Chapter 1's "Stay close to your sister" is paid off.
- **Line fixes:** every one listed in review finding 8:
  - the carved paddle;
  - Hale on Strike;
  - Rahel's five children;
  - Brasador;
  - Amanda;
  - Rael's Trust lines;
  - the treasurer timeline;
  - exile beyond the realm;
  - the map tiles;
  - the clerk;
  - reading the remembered choices.
- **Other fixes:**
  - The Hearing is nine days later, with the arrivals shown.
  - In the Just ending, Anissa opens the Hall's doors ("I'll hold the door, Gigi.").
  - The six joking lines are cut.
  - The bench and gallery sit near the nave.
  - The cut list is reversed.
  - The final Echo puzzle is harder and new.
  - The game ends on a "The End" card that answers the intro's first line, then the cast.
  - The verdict has a confirm, with a save before it.
- **Test:** headless routes to all three endings on both Turn routes run in `npm test` before the polish pass.
- **Schedule:** Chapter 12 is built as soon as Chapter 11 lands, at an estimated 4 days.

**Owner questions:** asked as pop-ups, one at a time. The build goes ahead with the recommendation.
1. **Owner decision (Oct 22): yes, as recommended.** Azzy's Challenge goes only to a Strike player who answers "the realm had to see him beaten". It comes after the Regent, with Gianna's wounds carried over.
2. **Owner decision (Oct 22): yes, as recommended.** Old Patricio speaks when the petition is heard at the Claim, about the sealing only, at the chair his young self cut. At Rael's Hearing he is present and silent. This leaves open question 13 open.

## Built (Oct 22): what changed from this outline, and Claude's calls

Built on branch `chapter12` (from `chapter11`), with every fix in the second review
(`2026-10-22-chapter12-epilogue-outline-review.md`), the decisions above and the owner's two decisions of Oct 22. Code:
`quest/src/engine/stability.ts` (Accord Stability: the parts, the score, the ending, the Hollow card's costs, written once
after the verdict), the Challenge's wounds and the claimant first in `engine/battle.ts` (`BattleDef.keepsWounds`,
`wounded`, `opensFirst`; `woundsFor`; `WOUND_FLOOR`), cards in a row with lines by flag and the end credits in
`engine/game.ts` and `engine/content.ts` (`CardDef.more`, `CardDef.credits`, `GameContent.formatText`), `STABILITY`,
`WOUND_FLOOR` and Chapter 12's XP row in `quest/src/config.ts`; `quest/src/data/claim.ts` (every place a stage direction
reads, the token chairs, the gate companies, the conditions), `quest/src/data/claimBattles.ts` (the Regent, his
Sealbearers, Azzy), `quest/src/data/dialogue/seatClaim.ts` (every scene of the chapter and the Epilogue, the people, the
overlays); the new map `seat-rooms` and the Claim's and the Hearing's layers on `seat-concourse`, `seat-hall` and
`seat-fields` in `quest/tools/maps/seat.ts`; `ACT12` and `EPILOGUE` in `quest/src/data/quests.ts`; the Chapter 12 entries
in `battles.ts`, `encounters.ts`, `sideQuests.ts` (`seats_claim`, `volume_one`, `claim_corner`), `debates.ts`
(`seat_claim`), `rpg.ts` (the chain of office, Volume One), `cards.ts` (the Claim's card, the three endings, The End and
the cast), `npcs.ts`, `speakers.ts`, `objects.ts`, `puzzles.ts`, `assets.config.ts`, `audio.config.ts` (the Hearing's slot,
the hall bell). Tests: `quest/tests/claim.test.ts`, `quest/tests/stability.test.ts`, and the Chapter 12 parts of
`act.test.ts`, `goldWalk.test.ts`, `levelCurve.test.ts`, `gameOver.test.ts`, `content.test.ts`; puzzle `seat_chair`;
`chapter12Checks` in `tests/smoke.mjs`. Commits: engine `f573f7e`, content and the route `28a0a8d`, tests `867963b`, then
these docs.

**The owner's decisions, as built:**
- **Azzy's Challenge** comes only on the dark route: Strike, and on the ash road "Because the realm had to see him
  beaten." (`choice.strike_why`). It follows the Regent's, Gianna alone (`fighters: ['gianna']`), opening with the HP
  share the Regent's fight left her (`wounds.gianna`, never under `WOUND_FLOOR` 0.25); it binds, pays nothing, and a won
  Challenge clears the wounds. A lost one is played again with the same wounds (they carry until it is won).
- **Old Patricio** arrives at dawn through Zetwal's gate, silent (a look and a nod; his two lines there were cut in the
  build so that he speaks only where the owner said), and speaks at the Claim when the petition is heard, of the sealing
  only, at the eighth chair his young self cut. At the Hearing he sits in the gallery and says nothing; he and Rael
  exchange one look. Question 13 stays open. A test holds every `patricio_old` line to the chair's node and his own talk.

**The second review's fixes, as built:** the Seventh Clause answered at the Claim under Clause Six (the filled chairs
answer the Petitions of Breach); the Regent first, then Azzy; the claimant strikes first in both Challenges; the count
reads the realm's pillars live (`{realm.influence}` and the others through `formatText`); Elodie speaks Anissa's names;
the Regent's Commission, Clause Twelve (he fights with his chain of office, not steel) and the Council of Eight; the
Master of the Chairs sets each token on its chair; the Regent at HP x6, ATK x1.6, MAG x2.0 with a group attack every
second turn, one version of him; Azzy at HP x4, ATK x1.2; Anissa's tips true of the fight (none in Azzy's); the
recalibrated Stability table (five saves tested); the Regent arrested on the Almoner's commission under his own seal;
the Hearing nine days later with the arrivals shown; "I'll hold the door, Gigi." as Anissa opens the Hall in the Just
ending; the joking lines cut (a test holds the solemn scenes); the bench and gallery by the nave; the final Echo puzzle
new (`seat_chair`); The End card answering the intro's first line, then the cast; the verdict confirmed (Exile and
Execution ask twice) with a save before it; headless routes to all three endings, on both Turn routes, in `npm test`.

**Claude's calls (beyond the review):**
- **The levels:** Chapter 12's steps pay **120** (`XP_PER_OBJECTIVE_BY_CHAPTER[11]`; the ash road, the wait until the
  bell, the bell and Rael's surrender pay nothing, nor does the Epilogue); the Regent 420; *A Seat for Every House* 40 and
  *Volume One* 20 (required quests: the Chapter 10 rule, what cannot be skipped rides on the steps). The route ends on
  30, the cap; the line without side quests at 28, the band's floor.
- **The Regent tuned down from the outline's adds** (the HP, ATK and MAG scales stand as decided): two Sealbearers in
  front of him and one more at a third (not one at two thirds and two at a third), *The Charter, read* at 110 and *One
  Hand* at 130 (from 140 and 160). With the outline's adds the roster four took 42 to 45 actions with a fall in nine
  fights of ten; now 40 at the route's level with a fall in one in four.
- **Azzy shares or renounces by what the player did at the fair** (`choice.azzy_ordu`, Chapter 6), not a new question:
  "the choice on the spot" is his, read from the player's earlier answer. On Strike he says he is still angry either way.
- **The companions sit** for the Hearing (`story.hall_seated` keeps them off the field and out of the roster's joins
  until the ending, when they are back).
- **The afternoon is a step, not a journey:** after the verdict the party is moved on the same map (`travel.next` to
  `seat-hall/afternoon`); the guide test allows a same-map journey.
- **Every scene that plays on arrival is `once` with its own flag** (the validator's rule): `story.claim_arrive_seen`,
  `story.rooms_seen`, `story.bell_hall_seen`, `story.arrivals_seen`, `story.hearing_seen`, `story.ending_played`.
- **The tokens are handed over on the steps** the night before (`side.seats.handed`), then set by the Master of the
  Chairs at the bell; a chair whose token the party never had stays bare (`seat.bare.<house>`), and a bare chair costs
  Stability. Al-Doria's chair follows the Muster: a sold Al-Doria leaves it bare, like any other house.
- **Volume One's Concord** (2) is paid through `MUSTER.concord`, like Chapter 10's one-off bonuses.
- **Layla's lines** come from the `LAYLA` constant (`claimSeal`, `claimAnswer`, `claimTalk`, `councilSits`, `hallTalk`).
- **Cut or not built:** Influence over Fear at the count (the threshold of 9 with 2 in each pillar is read, not a
  second gate); the tier-28 shop (decided); the books' second looks; the voyage to Eightgate as a scene (the card's close
  lands the party on the ash road at the Ardencia Gate); the board's dispatches.

**Measured (Oct 22):**

| Line | Level (XP) |
|---|---|
| Route end | 30 (11,455) |
| No side quests | 28 (9,795) |
| Played median (no wild steps on the route) | 30 (11,513) |
| Played p90 / wanderer p90 | 30 / 30 |

The Regent is met at 29 on the route.

The fights (`tests/claim.test.ts`; actions are party actions, "fall" the share of runs with a fighter Down or Bound
anywhere in the party; 20 to 30 seeds; tier-24 gear as Chapter 11's; the roster four is Gianna, Yari, Azzy, Samira, the
glass line Gianna, Yari, Vikram, Haru; "start" is the route's own gear):

| Fight | Gear, order | 28 | 30 |
|---|---|---|---|
| The Regent | tier 24, roster | 41.6, 53% | 39.7, 23% |
| | tier 24, glass | 23.9, 7% | 22.2, 0% |
| | start, roster, boss Grudge | 30.2, 13% | |
| | start, glass, boss Grudge | 17.8, 0% | |
| Azzy's Challenge (after the Regent, Gianna alone, wounded) | tier 24 | 18 of 20 won, 13.2 | 20 of 20, 13.0 |
| Crossroads Fields: veils / marines / seals | tier 24, roster | 5.1 / 8.1 / 6.9, 0% | |

The Regent is won in every run of every row. Samira deals almost nothing under the test's bot (her kit is support),
which is why the roster four is nearly twice the glass line's length; at 28 (the line without side quests) the roster
runs 41.6 actions, over the 40 gate by a little. A lost Azzy's Challenge at 28 is won on the next try in every seed.

The gold arrow, on from the end of Chapter 11: **229 steps and 6 map changes** through Chapter 12, **5** through the
Epilogue (it is played in the Hall), no stall, every objective in order, from either Muster night. Every variant (four
houses x betrayed or turned x Trust or Strike, sixteen) plays to the end by the arrow with a pardon, and Exile,
Execution and the dark route too (`tests/claim.test.ts`). Stability on the route (Trust, every chair, a pardon): 85, the
Just Throne. Strike with a pardon: 50 to 62, Hollow. Exile: 75, Hollow. Execution: Iron. The dark route: 40, Hollow.

**Not built:** the books' second looks; the voyage as a scene; the board's dispatches; the dedication in the credits
(the cast is in; the owner's dedication line is waiting). The smoke test has the Chapter 12 checks at every marker from
`@claim-arrival` to `@the-end`, but has not been run in a browser.

**Flagged for the owner (not changed):**
- Question 13 (does old Patricio know of the marriage?) stays open; the build fits either answer.
- The Stability dials (`config.ts STABILITY`) decide which saves reach the Just Throne: on the built route Trust with a
  pardon is Just (85) and Strike with a pardon is Hollow unless Azzy shares. If the owner wants Strike to reach Just more
  often, `harborStrike` (-15) is the dial.
- The roster four at 28 runs the Regent at 41.6 actions; the HP x6 the owner decided is what sets it.
