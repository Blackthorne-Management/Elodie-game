# Chapter 11, The War of the Harbor (Yucayeque, Xaraguá again): build outline (Oct 22)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: one, with its
recommendation; the build goes ahead on it); everything else is Claude's call with its reason. Sources:
`PLAN-ALL-CHAPTERS.md` (Chapter 11 Nov 10 to 13, **30 minutes, levels 25 to 28**, after Chapter 10 Nov 8 to 10 and
before Chapter 12 Nov 13 to 16; the plan's rule that every chapter keeps the main story acted out, the boss and the
chapter's fights, the Echo puzzle, the debate as a required quest, two required side quests, mystery quests and
arrows, Game Over), `design/STORY.md` Chapter 11 (the multi-stage battle with the allied armies; the flank fight
against the betrayer unless turned; the Harbor Turn with Trust and Strike; Gianna learns the whole truth here; the
Regent retreats to Eightgate; Rael a guest in the Trust route; the Echo: Caona's last stand at the harbor, "the place
where the debt began"; the bosses: the betrayer 26, then the champion 28 or Rael 28), 2 (Chapter 2 as built: the
chain across the harbor mouth, Anaco in the cellar, the resistance in the drained cave, the sea cave at the lowest
tide, "the elders' choice comes back in Chapter 11"), 4 (the threads: Rael's eight clues pay off at the Harbor Turn;
the Ash Road Accounts are read "only after the Harbor Turn"), 5 (tone: no jokes in the Rael or Anissa scenes), 6.9
(the betrayer's companion: stays, defies a second time, "gets one scene and a stat boost in Chapter 11"),
`design/FAMILY.md` (settled: **old Benny and Nancy shelter the wounded in Chapter 11**; **Jordyn leads a company in
the War of the Harbor**; Rael's guard Rivera and Jaime), `design/CAPITALS.md` 2 (Yucayeque's nine built maps; the
Mountain Path's war table at 25 to 28; "in Chapter 11, Caona's stand at the harbor (proposal)"; the contract board's
"count the Crown ships"), `design/COMBAT.md` 6 (the levels pass; the curve `LEVELS` 50 / 1.6: **25 at 8,078, 26 at
8,623, 27 at 9,182, 28 at 9,753**, 29 at 10,338; `XP_PER_OBJECTIVE_BY_CHAPTER = [15, 25, 30, 35, 40, 65, 44, 60]`;
"Ch. 11 at 28"), 11 (Echo Battles yield a Memory; the War's three linked battles; `ARMY_VOLLEY_PER = 10`, power 150
to all enemies, a proposal), 12 (Game Over as built), 13.2 (Crown Marine, Musketeer and Officer "Harbor 25 to 28";
Husher and Sealbearer at the Seat 28 to 30; Mangrove Crab), 13.3 #3b (Rael, the Harbor Strike: four phases, Broken
Army, "he only Binds and will not strike Gianna; the fight ends when his army breaks"), #8 (the Betrayer's four
variants: *Paid Off*, *Warpath*, *Marionette*, *Endless War*; skipped if turned), #9 (the Regent's Champion,
Captain-General Hale, *Boarding* and *Champion's Duel*), `QUEST-BUILD-GUIDE.md` 5.6 (the Harbor Turn's two routes
and the clues "available beforehand"; "Rael's army appears on the flank"), 5.7 (Accord Stability's inputs: allied
houses kept, the Unpaid Debt paid, the Harbor Turn, the Hearing, Concord, unresolved side quests), 5.8 (Rael's
lines, his truth ledger, "the pardon is earned at the Hearing, not given by the plot"), 6.3 (Xaraguá's price:
Influence 8; "Armies are a number per allied group, called in during the War of the Harbor"), 6.4 (4 active of 8;
Anissa never hit); the **Chapter 9 outline, its review and decisions** (the Almoner is Chapter 1's veiled woman; the
Ash Road Accounts coded, "Haru reads them after the Harbor Turn"; the Regent's "The Crown's fleet sails after the
Assize"; `crown_officer` and `sealbearer` as that chapter's new enemies; the eighth thumbprint); the **Chapter 10
outline, its review and decisions** (Free Brasador follows Azzy, Joaquin brings it; the ally ledger with shown
shares; the betrayer by least share with the exposed route (Jordyn's arrest, the house at three quarters, the captain
in the Hall's cell) and the sailed route (the house's company walks past the party to its ship); `ARMIES` about 240
full and 140 thin; the whistle given back: "Blow it at Xaraguá. Somebody will answer."; Anissa's "Anissa. I hold the
door. Hold yours." at the inspection (owner decision, Oct 22: both); the signal fire on Solèy Heights; the voyage
`zetwal_xaragua_war` on the built path to (46, 32); the party at **25** leaving; Elodie at Eightgate "till the Crown
lets her go"); and the **built game** on this branch (Chapters 1 to 7) and `chapter8` (Chapter 8): `tools/maps/xaragua.ts`
(thirteen maps: the village 44 x 30 with the pier at (21, 19 to 27), the customs house at (26 to 33, 8 to 11), the
Crown's three ships at anchor as objects, the east door to the beach at (43, 15); the Canoe Beach 36 x 22 with the
headland at (31.5, 4.5) and the sea cave's door at (31, 8) `if: 'story.escape_night'`; the Mountain Path 46 x 28
with the **lookout clearing over the sea** at (39, 13) and the ambush layer `if: 'encounter.xaragua_story.pier.won,
!story.crown_attack'`; the hill camp 28 x 20; the plaza with its Echo NPCs; the caney 36 x 26; the Song House 22 x
14; the customs house 18 x 12 with the cellar door `if: 'story.visit_granted'`; the cellar 14 x 9 with `anaco_cell`
`if: '!story.escaped'`; the sea cave 26 x 14; the occupied city on `story.crown_attack` (PEACE and WAR layers,
`CHECKPOINTS`, the burned stalls, the banners)), `data/dialogue/xaragua.ts` (Anaco: "Three across the harbor mouth. A
chain between the two nearest."; "You are no use to me in chains. Take the Limyè girls and go."; Yari: "Into the
canoe. Father. I'll come back. With every friend Caona ever had."; Thorne over the side: "This changes nothing, Miss
Limyè! The Charter stands!"; Gianna: "Then we will come back with the Accord, and read it beside your Charter."; the
fisher's boy who counts Crown boots; the elders `elder_charter`, `elder_resist`, `elder_undecided`; the camp leader;
the head runner's "Conch from the point, runner to the bay"; Caona's oath), `data/encounters.ts` (`xaragua_story`,
`mountain_path` at 4 to 6; `LATER_STORY_FLAGS` holds only `story.claim_begun`), `data/battles.ts` (`crown_marine`,
`crown_musketeer`, `breastplate_musketeer` (`armored`), `marine_lieutenant`, `marine_sergeant`, `thorne` (tank, weak
to light, three moves), `rael` (tank, `boss`, x3 / x1.2, phases), `rivera` (`protects: 'rael'`, `withdraws`), `jaime`
(caster, `withdraws`), `husher`, `steppe_reaver`, `fog_cutpurse`, `oil_enforcer`, `caravan_raider`, `qc_zealot`,
`mangrove_crab`; the shapes `every`, `tell`, `area`, `magic`, `statuses`, `ally`, `seize`, `powerPerBound`, `once`,
`hire`, `mirror`; `floor`, `withdraws`, `protects`, `bribable`, `disguise`; `BattlePhase` with `enter`;
`BattleFinale`; **`BattleDef.era: 'present' | 'echo'`**, `binds`, `fighters`, `endsWithBoss`, `boss`, `meantToLose`),
`engine/battle.ts` (`BATTLE_ACTIVE` 4 from the roster order; `MemberDef.leads` lifts a member; **`battleParty(...,
'echo')` is built and tested** (`tests/fighters.test.ts:73`); no guest fighters; no "Memory" reward), `engine/rpg.ts`
(`armies()` sums `army.*`; no Stability), `engine/stage.ts` (`STAGE_PARTY` yari, azzy, samira, bayarmaa, haru,
vikram: **no edmund yet**), `engine/game.ts` (crowds are present-only pictures that wander), `config.ts` (`LEVELS`,
`XP_PER_OBJECTIVE_BY_CHAPTER` with no row past 8, `AMBUSH_XP`, `GRUDGE_MAX_BOSS`, `BOUND_*`, `INTERCEPT_CHANCE`; no
`ARMY_VOLLEY_PER`), `data/voyages.ts` (Pòdlimyè (119, 37) to Yucayeque (46, 32) round Ardencia), `data/rpg.ts`
(`patricio`, `caona`, `benny` as `era: 'echo'` members; `marshal_whistle`, `sun_locket` key items).*

**Sim-check (honest).** This outline runs no simulation: Chapter 9 and 10 are not built on any branch yet
(`chapter9` is at Chapter 8's commit), so there is no Chapter 11 start save and no Edmund as data, and the war's new
pieces (volleys, the Echo battle) are not in the engine to port. The fight numbers in section 5 are **planned from
the Chapter 9 and 10 sims' scaling** (a standard trio at the party's level: 7 to 13 actions, nobody down; a boss at
HP x5 to x7: 26 to 39 actions, a fall in one fight in five at the band's floor and none at its top; falls counted
party-wide) and are marked as targets for the build's day-1 sim with the real party, not as measurements. Section 10
costs the sim.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17): the fleet lands,
the guns are taken, the betrayer walks up the sand, the elders argue in the camp, Yari walks down the cellar stairs,
Rael walks up the pier, old Benny walks among the wounded, the Regent's flagship cuts its cable and goes; Anissa is
never hit, never a target, never a combatant and never jokes; the comedy (Salkhi on a beach, Samira invoicing a navy,
Vikram out of breath on the mountain, Edmund sorry at a gun) stays away from her and out of every Rael scene; armies
are **stage actors and placed companies, never wandering crowds** (the Chapter 10 review's finding, section 4);
recommendations only where they genuinely help; placeholders wherever art has not arrived; this chapter gets the
main story (the landing, the three stages, the flank, Anaco, the Harbor Turn, the truth, the Regent's retreat), the
Echo battle and the Echo puzzle (one scene: Caona's stand and the chain post), the bosses (the betrayer; the champion
or Rael), one debate (required: the elders' choice), **two** required side quests, mystery quests and arrows, Game
Over, and nothing else until after the release.

---

## 1. Where the chapter starts (measured against the Chapter 10 outline, section 14, its review and decisions)

- **Chapter 10 ends** at dawn on Pòdlimyè's Old Harbor: the chain lowered, the fleet warped out, the levy aboard,
  Rahel and Patricia on the pier, Patricio not coming ("Marshals muster. Captains sail."), the trader at the head of
  the fleet; the voyage `zetwal_xaragua_war` (the built `zetwal_xaragua` path with war captions: "...and down the
  strait, to the harbor the seventh clause took."). The card *Chapter 10 complete, The Muster. Next: Chapter 11, The
  War of the Harbor* (`act10.complete`). **`?chapter=11` starts on the deck off Yucayeque at first light** (beat 0:
  the voyage's last caption is the chapter's first picture) and lands on the **Canoe Beach** (`xaragua-beach`, a new
  spawn `landing` at (14, 11), the trail's foot on the sand), not the pier: the harbor mouth is chained (section 2).
- **The party on the route:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram, Edmund, Anissa (nine, eight
  fighters, **four active by the roster order** unless Chapter 8 or 9 builds the order screen: Gianna, Yari, Azzy,
  Samira, with `leads` lifting a member for one fight; section 4), Salkhi placed on outdoor maps; **level 25** from
  the Chapter 10 review's fix (fixed XP about 430 lands 25 from anywhere in 24; a wanderer from a high Chapter 9 end,
  26). Section 5 plans from 8,078 (the floor of 25) and shows 8,400 (the middle) and 8,623 (a 26 start). Echo party:
  Patricio, Caona, Benny, at the party's level (story XP is shared with Echo members). Gold about 2,000 to 3,500 less
  the Muster's gifts and the forge.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's half-sheet, the Dorini pass, the Brasador
  coin, **the Marshal's whistle** (given back at the inspection: "Blow it at Xaraguá. Somebody will answer. They
  always have."), the three Seat tokens plus the Dorini token if Rashid gave it, the Fog Files, the Fox's receipts,
  Dhanraj's ledger, the Crown's pact, **the Ash Road Accounts (coded)**, Thomas Stillwater's True Record, the Crown
  Chronicle, the purge list, Kayla's crane, Aiyana's mirror, Edmund's hat, the recital bill, the Almoner's brooch,
  **the smugglers' ledger** (Z-6), Anicette's kasav.
- **Flags that matter here:** the seven armies as the Chapter 10 ledger pledged them (`army.zetwal`,
  `army.free_brasador`, `army.skarragol`, `army.kuroshi`, `army.jwaladesh`, `army.al_doria`, `army.aldermoor`; one of
  the four middle ones 0 or at three quarters), `muster.betrayer.<house>` (skarragol | kuroshi | jwaladesh |
  al_doria), **`muster.betrayed`** (the house sailed to the Crown in the night) **or `muster.turned`** (exposed:
  the captain in the Hall's cell, the house a late ally at three quarters), `story.betrayal_seen`, `story.chain_raised`,
  `story.inspection_done`, `story.blessing`, `story.patricio_told`, `clue.four_accounts`, `clue.signing_morning`,
  `side.muskets.done` with `choice.crew_spared|broken`, `side.lonely_cutter.done`, the three feuds' `settled`,
  `ally.free_brasador`, `ally.skarragol`, `ally.kuroshi`, `ally.jwaladesh`, `ally.aldermoor_dissidents`,
  `pillar.influence.al_doria` and the rest; from Chapter 2: `story.crown_attack`, `story.refuge`, `story.anaco_taken`,
  `story.escaped`, `clue.sea_cave_route`, `anchor.cave_sluice` (the cave is dry: the resistance's refuge),
  `anchor.healer_grove`, `anchor.hutia_stake`, `choice.envoy_waters`, `choice.yari_everything`,
  `encounter.xaragua_story.thorne.won`; from Chapter 3: `story.signet_glowed`, `story.ardencia_escaped`,
  `story.benny_joined`; from Chapter 9: `clue.ash_road_accounts`, `clue.crown_pact`, `story.hushed_beaten`,
  `side.purge_list.done` (the thumbprint count: **eight**), `story.jordyn_defected`; `belief.rael_traitor`.
- **What the realm said about this war before now:** Anaco (Chapter 2, the cellar): "Three across the harbor mouth.
  A chain between the two nearest. Nothing gets out that way." Yari (the sea cave): "I'll come back. With every
  friend Caona ever had." Gianna to Thorne: "Then we will come back with the Accord, and read it beside your
  Charter." The Free Brasador sergeant (Chapter 4): "Come back with an army, or do not come back." The Regent
  (Chapter 9): "The Crown's fleet sails after the Assize." Patricia (Chapter 10, moved by the review to Gianna's
  blessing): "Count them at dusk; harbors lie." Patricio: "Blow it at Xaraguá. Somebody will answer." The lookout
  keeper's signal fire on Solèy Heights, lit "so they know we're coming."
- **What Gianna believes:** her father sold Xaraguá and them, took the Crown's gold for a chair and spent it where
  nobody can read (`belief.rael_traitor`, with Chapter 9's receipt). The player holds every clue the guide lists (the
  signet's glow at the lie, seen by Anissa and unheard; Elodie's two lines; the Kuroshi trail; Samira's coin; "the
  arrows missed"; the lamp-oil seller; the Ardencia debate; nobody dies), Kayla's "still himself", Jordyn's "Keep the
  law", the eighth thumbprint with "Warn them first", the Marshal's "I remembered the wrong thing". **This is the
  chapter where she learns** (STORY 4: the Harbor Turn pays Rael's eight clues). Before the Turn, the chapter gives
  one more clue (the ninth thumbprint, section 7.1) and no line from anyone that says he is good; after it, everyone
  may speak plainly.
- **Chapter 11's target is 25 to 28** (`CHAPTER_LEVELS` 11, already there). Three bosses' worth of fights in thirty
  minutes: the chapter is three levels wide (1,675 XP) and its fights pay most of them (section 5).
- **Stale lines in the design and the outlines, fixed here:**
  - `CAPITALS.md` 2 and its wild-sections table switch the war table on `story.muster_done`; Chapter 10 sets
    `act10.complete` and never `story.muster_done`. The war table (`harbor_war`, section 5) switches on
    **`story.war_begun`**, set at the landing (beat 0), and the built `mountain_path` layer's condition
    (`encounter.xaragua_story.pier.won, !story.crown_attack`) already excludes it, so nothing built changes.
  - `CAPITALS.md` 2 says "the table becomes the war table" on the Mountain Path only; the war's ambushes are also on
    the Canoe Beach (the headland's pickets) and the village's trails by night (section 3): three layers, one table.
  - `COMBAT.md` 11's volleys ("each 10 soldiers pledged gives one round of an allied volley, power 150 to all
    enemies, in the next stage") have no engine piece and no cap; section 4.2 gives the rule a shape (a per-fight cap,
    the whistle as the choice, the companies shown answering) and section 10 costs it.
  - `COMBAT.md` 13.3 #3b gives Rael a fourth phase in which "his guards leave": a phase can bring foes in (`enter`)
    but cannot send them out; section 5 stages the guards' leaving with the built `withdraws` on Rivera and Jaime
    (they step back at 0 HP, as in Chapter 3) and the fourth phase as his own change.
  - `STORY.md` Chapter 11 has Rael "as a guest" in the Trust route; the engine has no guest fighters. Section 4.3:
    Rael as a `MemberDef` with `party.rael` set for one fight and cleared after, `leads` lifting him into the four,
    and never on the Status page between (the flag is set in the line before `battle.next` and cleared in
    `battle.after`). Zero engine; one check on day 1 (the roster has no cap but `BATTLE_ACTIVE`).
  - `FAMILY.md` settles that old Benny and Nancy shelter the wounded in Chapter 11 and says nothing about how two
    old people kept "close and out of sight" in Cenizal's keep reach Yucayeque. Section 9.2: they come on Rael's
    ships and are the first thing he puts ashore after the Turn, on either route (Claude's call, section 12).
  - The Chapter 9 outline's `crown_officer` and `sealbearer` are that chapter's new enemies and Chapter 9 is not
    built; if Chapter 9 lands first they are reused, else this chapter adds them in the Chapter 9 outline's shapes
    (section 5), and `STAGE_PARTY` gains `edmund` whichever lands first.
  - The Chapter 10 outline's dawn says the betrayer's house's hull "is gone from the pier" on the sailed route; where
    it went is this chapter's: it is behind the fleet, and it lands on the Canoe Beach after the headland falls
    (beat 2).
  - `SIDE-QUESTS.md`'s reward scale for Chapters 11 to 12 (400 to 500 XP, 600 to 900 gold) was written for a wider
    curve; section 5 scales the two quests to about 100 XP each, as Chapters 6 to 10 scaled theirs.
  - `STORY.md` Chapter 11's Echo is "Caona's last stand at the harbor in the Revolution (proposal)" with no puzzle;
    the plan requires an Echo puzzle per chapter. Section 8 makes the stand the chapter's Echo battle **and** gives
    it an anchor (the old chain post's pin at the pier head), so the one Echo scene is the puzzle and the battle.

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 10 outlines. Flags are proposals in the built naming style.
"Shown" means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`).
The chapter is **one day**: a landing at first light, a morning in the hills, the assault on the lowest tide at dusk,
the Turn at nightfall, and the truth by lamplight. Every map is a reused Chapter 2 map with a war variant (flag-placed
companies, guns, ships, banners and people), and the arrow walks the island the short way: the beach, the gardens,
the hill camp, the mountain, the village, the pier.

### Beat 0: The strait at first light (the voyage, then xaragua-beach)

- The voyage `zetwal_xaragua_war` (Chapter 10's; by day, the fleet's captions). The last caption is the chapter's
  first picture: *"...and down the strait, to the harbor the seventh clause took. Seven navies behind one trader,
  and a fire on the headland that was not there yesterday."* On the deck, one line each as the harbor opens: Yari,
  first, at the bow, not loud: "There. The caney's roof. They've put a flag on it." Haru: "Eleven. I count eleven
  hulls across the mouth, and a chain between the two nearest. He's learned nothing and forgotten nothing." Samira:
  "A chain costs more than a ship. Somebody is frightened." Edmund: "That's the *Patience*. The Regent's own. I've
  been aboard her. The tea is dreadful." Bayarmaa: "Then we don't go in the front." Vikram, who broke a chain once:
  "...No. We don't." Azzy, looking north up the strait, says nothing (a `face` cue, north: the cliffs of Ardencia are
  that way). Anissa, at the rail, last, in her own node: "Gigi. The fire on the hill. That's them, isn't it. That's
  the cave." Gianna: "That's them. They saw ours." (Earnest; the chapter's first promise kept: Solèy Heights' fire
  answered.)
- **The landing, shown:** the fleet cannot pass the chain, so it does what the escape did in reverse: round the
  headland to the **Canoe Beach**, where "the marines watch the harbor mouth, not the cliffs." Lands at
  `xaragua-beach`, spawn `landing` (14, 11). **`story.war_begun`** is set on landing (the war table, section 5; the
  Chapter 2 occupation's placements stay, the war's are added on this flag). **The beach before anyone speaks:** the
  burned stalls (built, on `story.crown_attack`), the Crown's banner at the trail's head, and **a gun on the
  headland** (a new object: a Crown field piece on the rock at (30, 6), two looks, its crew placed: an officer and
  two musketeers), which fires as the first boats touch (an audio slot: cannon; `fx: 'shake'`; the off-screen rule
  used for a thing in view's edge: the shot lands in the water). Behind the party, on the sea's edge, **the fleet as
  objects** (boat objects in a line along row 15 to 17: the trader, the Ironvow longship with the horse-tail, the
  Agnivansh ship with its lamp, the Suzumori boats, the Dorini merchantman, Zetwal's three; each `if` by its
  `army.*` flag and `story.war_begun`; the betrayed house's absent: a gap in the line).
- **The companies land, shown as stage actors, not crowds (section 4.1):** each company is **its captain and two
  soldiers**, walked up the sand from its boat in file (`enter` from the water's edge, `walk` to a rank on the sand
  at rows 12 to 13, `face` up): Zetwal's levy with the Harbor councillor's sergeant, **Free Brasador with Azzy at
  their head and Joaquin at his side** (the Chapter 10 review's fix: Azzy's company), the Ironvow with Hrafn or the
  lawspeaker's rider, the Suzumori with Mibu or the signal master, the Agnivansh with Prakash or the junior priest,
  the Dorini with Rashid or Layla's clerk, **Jordyn's watch** last and fewest. The file is the picture the Muster's
  inspection made, on sand. A company that is not here (the betrayed house) is a gap, and Haru says so once: "Nobody
  lands for the Ironvow." (one of four lines, by `muster.betrayer.*`; on `muster.turned` the house's second lands
  with the three-quarter company and says nothing).
- **The resistance comes down the sand (shown):** from the beach's west door, at a run, the **camp leader** (built
  `resistance_leader` look), **the fisher's boy**, the **healer**, the old **canoe fisher**: "Yari!" Yari goes to them
  (a `walk`, `run: true`). The camp leader, to Gianna: "Envoy. You said you'd find him. You brought a navy to do it."
  Then the facts, plainly, in three sentences (the chapter's map, said once): the Crown holds the village and the
  harbor; Anaco is still under the customs house ("They moved him twice. He is back in the cellar. The Governor
  likes to have him near."); the headland gun covers this beach and the gardens' road, "so nothing of yours goes up
  to us until it's quiet." `story.landed`.
- **The whistle, first time (beat 1's fight teaches the volley: section 4.2):** the camp leader: "Your grandfather's
  note. The runners say every company on this beach knows it." Gianna takes the whistle out (shown: the item object
  in her hand, a `face` to the ranks).
- Journal: **The strait at first light** (done `story.landed`), then **The gun on the headland** (beat 1).

### Beat 1: The gun on the headland (xaragua-beach: stage one)

- The trail east along the sand to the headland's foot (the sea cave's rock, where Chapter 2's escape went in). The
  gun's crew turn it (the object's second look) and the officer: "Marines! The beach is the Crown's by Charter.
  Present!" A step trigger at (28, 9) starts **the headland battery** (`headland_battery`, section 5: a Crown Officer
  at 26 and two Crown Musketeers at 25, one in a breastplate). **Before the first turn the whistle asks** (the volley
  dialogue, section 4.2): *How many volleys?* (0 to the cap, from what the fleet has): the chosen companies' captains
  shout their orders down the beach (Azzy: "¡Firmes! ...Fire."; Hrafn's horn; the Agnivansh "Agni!"; Jordyn's
  "Watch!"), and the battle opens with that many volleys falling on the gun's crew (battle events: *The Free Brasador
  volley! The musketeer staggers.*). Anissa's tip: "The one with the breastplate, Gigi. Your light goes through it."
- **After the win, shown:** the crew go down the far side of the rock (walkers out at (34, 3)); the gun is turned
  to the sea (its third look: the muzzle toward the harbor mouth: it is the party's now, and it matters at the Turn);
  **the companies come up the beach** behind the party (the stage actors walk from their ranks to the headland's
  foot and stand: the thing an army does when a gun falls). The Harbor councillor's sergeant: "Zetwal has a gun on a
  hill. The council will want a statue." (Away from Anissa, who is with Yari at the water's edge.) `story.headland_won`.
- Journal: **The gun on the headland** (done `story.headland_won`), then **Sails behind us** (beat 2).

### Beat 2: Sails behind us (xaragua-beach: the flank, or the house that stayed)

- **On the sailed route (`muster.betrayed`):** as the party turns back up the sand, Patricia's line comes due. Haru
  (he counts): "Sails. Behind the fleet. Not ours." Anissa: "Gigi. Count them." (Her Chapter 1 line to Yari, "I told
  you about the two ships. Count them.", turned round: earnest.) **Shown:** a hull comes round the point and grounds
  at the beach's west end (a boat object with the house's flag, `if: 'muster.betrayed, !war.flank_done'`, placed on
  `story.headland_won`); down its side and up the sand, **the betrayer's captain** (Hrafn / Mibu / Prakash / Rashid:
  the Chapter 10 look) with his house's shape behind him and **a grey veil among them** (a Husher: the secret member's
  cell, the Chapter 10 review's closed hand paid in a person), walking straight at the party (`enter` from (2, 14),
  `walk` to four tiles short of Gianna). His line, by house, in the register Chapter 10 gave him: Hrafn: "The Throne
  pays on the harbor. I have come for the harbor."; Mibu: "Neutral, envoy. Neutral means I fight whoever is losing.";
  Prakash: "The flame is the Throne's. So is the beach, it seems."; Rashid: "The guild sent me to collect." Then the
  **companion's second defiance (STORY 6.9), shown:** Bayarmaa / Haru / Vikram / Samira steps out of the party's
  line to stand in front of Gianna (a `walk` for the stage party member), says their line (section 9.4) and **fights
  this one at the front** (`leads` by `muster.betrayer.<house>` and `!war.flank_done`: the companion is lifted into
  the four whatever the roster order). The fight **`harbor_flank`** (the Betrayer at 26 in his house's variant with
  two of his house's foes and the Husher: section 5), with the whistle before it. **Game Over** applies; the way back
  in is the captain on the sand (his placement's talk restarts it).
- **After the win, shown:** he is on the sand (the chapters' shape: nobody dies); the Husher goes into the sea (an
  `exit` into the water's edge, gone); the house's soldiers who came with him stand still (walkers do not move). **The
  Yield, in dialogue (the chapters' shape), the companion's choice, not Gianna's:** Bayarmaa: *"Hold him for the
  Moot."* / *"Let the steppe see him walk home."*; Haru: *"The files will name you. That is enough."* / *"Bind him.
  Mother will want to read him."*; Vikram: *"Enough. I'm out of breath and you're out of oil."* / *"Walk him to the
  flame."*; Samira: *"Invoice the guild. It's cheaper."* / *"Bind him. My mother pays on time; so will he."*
  (`choice.flank_spared` +1 Influence at Xaraguá; `choice.flank_bound` +2 Fear at Xaraguá). Jordyn's two watch take
  him to the boats either way (a `walk`): "Under arrest for the Crown's gold on a free beach. Same words as last time;
  I only have the one set." (Not a joke near Anissa, who is at the headland's foot with the healer.) **The companion's
  stat boost (STORY 6.9):** a charm, level 26, given on the sand by the house's second or taken from the captain (the
  Ironvow *tassel of the standard* ATK +4; the Suzumori *paper seal* MAG +4; the Agnivansh *wick-ring* ATK +4; the
  Dorini *clerk's seal* MAG +4; data only). `war.flank_done`.
- **On the exposed route (`muster.turned`):** no sails. The same step on the sand plays the house that stayed:
  the house's second (the rider / the signal master / the junior priest / Layla's clerk) comes up with the three-
  quarter company and says the one line the chapter gives them: "We sailed with the envoy. The captain is in a Hall
  with a lock on it. Tell us where to stand." The companion answers (section 9.4, the short form). `war.flank_done`
  (the objective pays the same XP either way: the review's rule that a turned house is not a punishment).
- Journal: **Sails behind us** (done `war.flank_done`), then **The hill camp** (beat 3).

### Beat 3: The hill camp (xaragua-conuco, xaragua-mountain, xaragua-camp: the base)

- West through the village's east door? No: the village is the Crown's. The resistance's way is **the gardens' road**
  from the beach (a new door on the beach's north edge at (8, 0) to the conuco's east side; the gardens are the
  Crown's by day but the headland gun no longer covers the road: "Now it's quiet," the camp leader) and up the
  **Mountain Path** (the war table on, section 5: Crown pickets on the switchbacks) to the **hill camp**, which is
  the resistance's base again (the built `camp_leader` and `camp_scout` return on `story.war_begun`; the cave's
  refugees are here: the elders, the healer, the fisher, placed; the grove stands if `anchor.healer_grove`).
- **The camp, shown before anyone speaks:** the three elders at the fire (the council circle moved to a hill), the
  healer with a row of hamacas slung for the wounded to come, the head runner with a conch, the fisher's boy on the
  rock with a tally stick, two of every company's soldiers placed at the camp's edge (the allies came up behind:
  stage actors by `army.*`), and **Jordyn** at the camp's gate with her seven ("I keep the law where I stand. Today
  I stand on a hill."). Salkhi on the path below ("A mountain. After a ship. I was promised grass.").
- **The plan, said once by the camp leader at the fire** (the gate's reason, section 6): the village is held by
  forty marines and a Governor; the harbor by eleven ships and the *Patience*; the chain holds the mouth. "We go down
  at the lowest tide, at dusk. The canoes come under the pier from the sea cave while you come down the mountain.
  Until then: the wounded need the Song House cleared when we take it, the canoes need powder, and the elders need to
  agree what we are taking the harbor *for*." Yari: "Everything is the tide here." (Her Chapter 2 hint, paid.)
  `story.camp_reached`; the Journal's **Until the tide** (`followSide`).
- Journal: **The hill camp** (done `story.camp_reached`), then **Until the tide** (section 6).

### Beat 4: Until the tide (the required things, any order; the arrow follows the ground)

- **The debate, required** (section 7.3): the elders at the fire, *Won by seven navies: whose harbor?*: Yari mediates
  (she can only mediate once Gianna has heard both: the built shape).
- **Harbors Lie** (section 7.2): the fisher's boy's count from the lookout clearing on the Mountain Path (39, 13);
  the player sees **black and crimson sails off the north point** before the Turn (the guide's "the player expects a
  second father-daughter fight").
- **The Ninth Thumbprint** (section 7.1): the powder for the canoes, from the cave mouth where the stranger's jars
  have been left for years; the ninth mark; a Crown picket on the way.
- **Anissa at the camp (the thread):** the healer asks her, not Gianna, to hold the lamp at the hamacas when the
  wounded come ("You held it at the cave mouth. I remember."). Anissa: "I'll hold it." (Earnest; the Chapter 2 line
  "I'm keeping the lamp lit. Come back before it goes out" answered by her in the same place.)
- When the three are done: **the tide** (beat 5).

### Beat 5: The tide (xaragua-mountain down, xaragua-village by dusk: stage two)

- Dusk (a condition: `story.tide_called` and not `story.anaco_freed`): the head runner blows the conch on the camp's
  rock (an audio slot; the built line "Conch from the point, runner to the bay" paid); the canoes go down to the sea
  cave (walkers: the canoe fisher and two scouts with the powder jars, off the camp's south edge); the companies go
  down the mountain (the stage actors file off the camp; placed again at the village's north door when the party
  arrives). The Mountain Path by dusk (the war table at its heaviest: the pickets fall back), the gardens, the
  **village from the north door** (21, 0).
- **The village by dusk, shown:** the Crown's banners (built), marines at the checkpoints (the built `occ_marine_*`
  with war lines), the three ships at anchor (built objects) and, new, the *Patience* at the harbor mouth (a larger
  boat object at (10, 27), its lights) with the chain drawn from it to **the old chain post at the pier's head** (a
  new capstan object at (23, 19), an `above` chain strip along row 26 to the ship: section 8). The companies come in
  behind the party from the north door (stage actors in file to the yard at (11, 7), the houses' ring); Jordyn's
  seven take the east trail (walk to (37, 15)).
- **The customs house (stage two: Thorne):** the door at (29, 11); inside, **Governor Thorne** at his desk (the built
  `thorne` placement's war branch) with a marine and a musketeer in a breastplate, and the cellar door behind him.
  Thorne, the register exactly as Chapter 2 built it: "Miss Limyè. You said you'd come back with the Accord. I see a
  navy. Which clause is that?" Gianna: "The oath that came before it. Three names, Governor. You've met one of
  them." (Yari.) Thorne: "The Charter stands. Marines!" The fight **`customs_thorne`** (section 5: Thorne at 27, tank,
  HP x3, his three built moves, with a Crown Marine and the breastplate musketeer at 26; the whistle before it: the
  volleys come through the windows, shown as events). Game Over's way back in: Thorne at his desk.
- **After, the Yield in dialogue, Gianna's:** Thorne on the floor by his desk, the Charter under his hand. *"Send him
  home to Aldermoor. On the Patience, if she'll have him."* (`choice.thorne_spared`, +1 Influence at Xaraguá; the
  COMBAT 13.3 Yield for him, kept) / *"Chain him in his own cellar."* (`choice.thorne_broken`, +2 Fear). Either way
  Jordyn's watch take him (a `walk` out of the door). His last line, both: "The Charter stands, Miss Limyè. It is
  written." Gianna: "So is the oath. We'll see which one the Throne reads." (The Claim's seed.) `story.thorne_taken`.
- Journal: **The tide** (done `story.village_reached`), **The customs house** (done `story.thorne_taken`), then
  **Anaco** (beat 6).

### Beat 6: Anaco (xaragua-cellar: Yari's beat)

- The cellar door (`story.visit_granted` holds from Chapter 2; the door's `closed` line is war-branched); down the
  stairs. **Shown, and Yari's, not Gianna's:** Anaco on the bed (`anaco_cell`'s war placement, `if: 'story.war_begun,
  !story.anaco_freed'`), the cellar marine gone (his placement `!story.war_begun`), the irons on the bed's post.
  **Yari walks down the stairs ahead of the player** (the stage party member's `walk` to the bed; the camera on her),
  and the chapter's quietest exchange: Yari: "Father." Anaco: "You argued." Yari: "I came back. With every friend
  Caona ever had. And some she never met." Anaco, looking past her at the stair, where seven companies' sergeants
  stand in a line (placed at the stair's foot: the stage actors' last file): "...So I see." Then to Gianna, the one
  thing he says to her: "Envoy's daughter. You used it." (Chapter 2: "They cannot touch you, by their own Accord.
  Remember that, and use it.") He stands (the bed object's look; a `walk` to the stair, slow, on Yari's arm).
  `story.anaco_freed`; `ally.xaragua` (section 7.3 sets it earlier if the debate was mediated; here at the latest).
- Up the stairs and out: **the Song House** (beat 9's place; the healer's hamacas go in now: a line from the healer
  at its door: "Clear it. They'll be carried in before the night is out.").
- Journal: **Anaco** (done `story.anaco_freed`), then **The pier** (beat 7).

### Beat 7: The pier (xaragua-village: the Echo battle and the chain post; stage three)

- **The pier head** (21 to 22, 19): the old chain post (the capstan object) with the Crown's chain made fast to it
  and drawn taut to the *Patience*; marines at the pier's foot (placed: the stage-three fight's foes, section 5),
  and the air shimmering on the pier's first boards (**a new Echo zone**, 2 x 3 at (21 to 22, 19 to 21), `if:
  'story.war_begun'`; the village has a built Echo grid). The canoes are under the pier (the canoe fisher's two
  dugouts placed on the water at (19, 24) and (24, 24), `if: 'side.ninth_thumbprint.done'`... no: always, the powder
  only changes a line: section 7.1).
- **Caona's stand (section 8: the Echo battle and the puzzle).** Anissa holds the door ("I'm holding the door, Gigi.
  Hold the pier."). In the Echo: the same pier fifty years ago, the Crown's longboats coming in under the old sails,
  Caona and her scouts holding the pier head so the Marshal's and Benny's companies can form on the shore; the
  **Echo battle** `caona_stand` (the Echo party of three: Patricio, Caona, Benny against three Crown Marines and a
  Crown Musketeer at 27 in the old uniform); after the win, **the chain post**: Caona: "They'll chain the mouth next
  time they come, Marshal. Everyone does. Make it so it won't hold." Patricio pulls the capstan's pawl pin (**the
  anchor**, `anchor.chain_post`: the Chain Bridge's pin in reverse) and drops it in the water. Back in the present:
  the Crown's chain, made fast to a post whose pawl has had no pin for fifty years, **runs out the moment it is
  loaded** (the object's second look: the chain slack on the water, the strip's look gone; `fx: 'shake'`, a chain
  sound): the harbor mouth is open. Haru: "The whole mouth. Somebody on the *Patience* just felt that." The **Memory**
  (COMBAT 11): the Journal note *Caona's stand* and the hidden present route is the canoes' way under the pier
  (shown: the two dugouts come out from under the piles on the next `sync`); the stat Memory (+2 SPD to Yari) is after
  the release (section 10). `story.chain_dropped`.
- **Stage three: the pier.** The marines at the pier's foot come on (the fight `pier_assault`: a Crown Officer and a
  Regent's Sealbearer at 27, a Crown Marine at 27 and a Musketeer at 28; the whistle before it; the volleys come off
  the headland gun too: a line). After it the pier is the party's to the water's edge, and the *Patience* is
  cutting her boats loose. `story.pier_won`.
- Journal: **The pier** (done `story.pier_won`), then **The Harbor Turn** (beat 8).

### Beat 8: The Harbor Turn (xaragua-village's pier: the choice)

- **Shown, in this order, nothing said until the last cue:** the chain is down; through the open mouth, **round the
  north point, come the black and crimson sails** (boat objects placed on `story.pier_won` in a line along row 27
  from the map's west edge: Ardencia's ships, the ones the lookout counted in *Harbors Lie*; the camera `look`s at
  them), between the Crown's fleet and the pier. A longboat puts in at the pier's end (a boat object at (21, 27)).
  Up the pier, alone, hands behind his back, **Rael** (`enter` from (21, 27), `walk` to (21, 21), three tiles from
  Gianna; the Chapter 3 look: black and crimson plate, the scorched cloak, the signet). Behind him, at the longboat,
  **Captain Rivera** and **Jaime** (placed; they do not come up). Azzy steps out of the party's line (a `walk` for
  the stage party member to Gianna's side, `face` down the pier). Anissa, the follower, is behind Gianna (a `face`).
  Rael stops. The signet on his hand: **dark** (the `fx: 'signet'` is not played; the object look is the plain
  ring; the player who has watched it since Chapter 3 sees that it is not glowing).
- Rael, four sentences, public register, to the envoy (the guide's voice): "Envoy of Zetwal. You hold the pier. The
  Regent holds the mouth, and I hold the water between. I have come to be told which way to face." Nothing more. He
  does not say what he will do. (This is the choice as the guide wrote it: the player "expects a second
  father-daughter fight and is given a trust choice.")
- **The choice (the chapter's one pop-up for the player, two entries, both remembered):**
  - ***Hold.*** (Trust.) "Face the *Patience*." (`war.trust`.)
  - ***Strike.*** "Face me." (`war.strike`.)
  Anissa says nothing before it; Azzy says one line before it, the only one, which reads either way and is true in
  both: "Gianna. Whatever you say, I'm beside you." No one else speaks. No joke within the scene.

### Beat 8a: Trust (the flagship; the Regent's champion)

- Rael turns (a `face` to the water): "Rivera. Jaime. The *Patience*. Bind what you can. Sink nothing with people
  in it." (Shown: Rivera and Jaime back into the longboat, `exit`; the black sails' objects re-place toward the
  *Patience* on a `sync`; the headland gun's audio slot fires; the canoes come out from under the pier.) The
  Regent's flagship cannot run with Ardencia across her bow, so she fights: her boats come to the pier, and down the
  pier's end from the first boat comes **Captain-General Hale** (the proposal name; built by role: the Regent's
  Champion) with marines: "The Lord Regent's compliments. He will not come up the pier himself. He sends me." The
  fight **`flagship_hale`** (section 5: Hale at 28, tank, x6 / x1.25, with two Crown Marines and a Sealbearer at 28;
  phase two at 50%, *Champion's Duel*), **with Rael in the four** (section 4.3: `party.rael` set in the line before
  `battle.next`, `leads` lifting him to second; his skills: La Marca, Grito de Guerra, Sangre Ardiente as a passive;
  cleared in `battle.after`). The whistle before it (the last volleys). Anissa's tip: "He hates the light, Gigi.
  They all do." Game Over's way back in: Hale at the pier's end.
- **After, shown:** Hale on the boards (yields: "The Regent will hear of this." / Rael: "He is watching it."); the
  *Patience* **cuts her cable** (the chain strip gone already; the ship object's look goes, then it is re-placed at
  the map's edge and gone on the next `sync`: the Regent retreats to Eightgate with Thorne aboard if spared); the
  rest of the Crown's fleet strikes (the three built ship objects get a white-flag look). The harbor is Yucayeque's.
  `story.harbor_won`. **Stability inputs recorded** (section 4.4): `stability.harbor_trust`, `stability.fleet_struck`.
- Then **the truth** (beat 9).

### Beat 8b: Strike (Rael's vanguard; the Broken Army)

- Rael: "...So. Your mother said you would." (Elodie's "He should never have tested you", paid from his side.) He does
  not draw. Rivera and Jaime come up the pier (walkers to his sides). "Rivera. Bind. Nobody is to touch her." The
  fight **`pier_rael`** (section 5: Rael at 28, tank, `boss`, HP x6 / ATK x1.2, `binds`, Rivera (`protects`) and
  Jaime beside him, four phases; the whistle before it: and the volleys **do not come**: the companies will not fire
  on the pier with the envoy in the line: a line from the sergeant, which is the Strike route's first cost, shown).
  Phase four, *Broken Army* (at 25%): Rivera and Jaime have stepped back (`withdraws` at 0 HP, as Chapter 3) and his
  own moves change to the bind-only pair (section 5); he never strikes Gianna (section 10: a tiny `avoid` field, or
  the dialogue's word). He ends at 0 HP with `withdraws` ("Enough. Enough. Rivera, the boats."): his army breaks
  (shown: the black sails' objects turn away on the `sync`; the headland gun does not fire; the *Patience* and the
  whole Crown fleet **go out through the open mouth intact**: the ship objects re-place in a line and are gone).
  Game Over applies (a party all Bound is a loss: the goddess, Rise on the pier; the choice is not asked again:
  `war.strike` holds). `story.harbor_won` is **not** set; `story.fleet_escaped`. Stability inputs:
  `stability.harbor_strike`, `stability.fleet_escaped`. Azzy, before anyone else, to Gianna, furious and quiet, the
  one line: "You had him. You had him and you had *them*, and you chose him." (Section 12's question: he stays.)
- Then **the truth** (beat 9), with the Strike variants.

### Beat 9: The truth (the pier by lamplight; then the Song House)

- **Rael's truth, private register, the signet dark, shown as a thing done:** he takes the Locket from her neck as he
  did in Chapter 3 (the built picture) and holds it to the signet: **both halves stay dark** (no `fx: 'signet'`), and
  Anissa says the thing she said in Chapter 3 unheard, and this time Gianna hears it: "It's dark, Gigi. It glowed
  when he lied. In the hall. It's dark now." (Her line is the chapter's hinge; earnest; nobody near it jokes.)
- The truth in his words, the guide's list, four exchanges and no speech (section 9.1 has the full text and the
  Strike variants): Elodie's husband for twenty-five years and why it was hidden; the Crown alliance a farce ("I let
  the Throne buy me so I could count its money"); the shadow government ("Ask the lamp-oil seller who she has never
  met. Ask Amanda who pays for the flour."); the Quiet Crown ("I founded it. Its cells do not know me. That is how
  they were bent against your sister, and that is mine to answer for."); and the line: **"My father kept his oath and
  it cost him everything. I wanted to know what would happen if someone kept the goal instead."** Gianna's answer is
  a choice of two, both remembered (`choice.truth_answer`): *"You tested us."* (Rael: "Yes. Your mother told me I
  should never have. She was right. I needed to know you would stand in front of her. You did.") / *"You lied to us
  for twenty years."* (Rael: "Yes. That one is not staged. Nothing I say tonight makes it smaller.") He does not ask
  to be forgiven; the guide's rule: the pardon is the Hearing's.
- **The Ash Road Accounts, read (STORY 6.6; the Chapter 9 outline: "Haru reads them after the Harbor Turn"):** Haru
  lays the coded pages on the pier's rail (item objects); Rael: "The key is the thing you are wearing. Two halves."
  Gianna sets the Locket on the page and he sets the signet beside it (shown): the columns read (Haru, line by line,
  the nine doors): the caves of Yucayeque (the oil), the Lower Town's kitchen, the winter stores, the lanterns of the
  marsh, the anonymous oil, the bog chapel, the cane's mill, "and the two you have not opened." `clue.ash_road_read`;
  the Journal note *The Ash Road, read*. (The ninth thumbprint from section 7.1 is the last door; the two "not
  opened" are the Seat's and Al-Doria's safehouses, after the release.)
- **Old Benny and Nancy (FAMILY.md, settled; section 9.2), shown:** the second longboat from Ardencia's ships puts in
  at the pier's end, and up the pier, slowly, **old Benny** on a cane and **Nancy** on his arm with two Ardencian
  surgeons behind them with a stretcher (walkers). Rael, to Gianna, before they reach her: "I brought my father where
  I meant to stand. He asked to come. He always asks." Benny stops at Rael (a `face`), says nothing to him, and goes
  on to Gianna: "The Locket. I said I'd made the other half. I did not say for whom. Now you know." Nancy, to Anissa,
  gracious: "Child. There are hurt people on this island and a lamp to hold. Show me where." (Anissa: "The Song
  House. I'll hold it." Nancy takes her hand: the follower is walked with Nancy off the pier.) **On the Strike
  route** Benny's line to Gianna is different and the only reproach anyone gives her: "He told me you might. He said
  to come anyway. Somebody has to carry the ones he bound." The surgeons go up the pier past the Bound and the
  wounded of seven companies (placed hurt soldiers along the pier: stage actors with a lying look).
- **The Song House (xaragua-song: the shelter), shown:** the hamacas slung between the song-keepers' posts (new
  objects on `story.harbor_won | story.fleet_escaped`), the wounded of every company carried in (walkers with the
  stretcher, twice), **old Benny** at the door counting them in as he did at Cendre ("Forty. I count. It is what I do
  at the end of a thing."), **Nancy** among the hamacas with the healer, **Anissa** with the lamp at the end of the
  row (placed; the only light on the map is hers and the door's). Benny's one line about his son, either route, the
  locked rule released: "He is his mother's. He never explained himself to me either." The companies' captains come to
  the door one at a time to count their own (walkers: Azzy and Joaquin, Hrafn or the rider, Jordyn): the army
  shown as people. `story.wounded_sheltered`.
- Journal: **The truth** (done `clue.ash_road_read`), **The Song House** (done `story.wounded_sheltered`), then
  **The Regent's retreat** (beat 10).

### Beat 10: The Regent's retreat (the caney at night; the card)

- The caney (the Crown captain gone: his placement `!story.war_begun`; the Crown's banner object replaced by the
  caney's own: a `sync`): Anaco in the duho (placed), the elders in the circle, Yari standing, the companies'
  captains at the hall's sides (placed), Rael at the doors with Rivera, not inside (the Trust route) or absent (the
  Strike route: his ships are gone; Benny stays). Anaco, to the hall: "The harbor stays with the people who fish it."
  (The oath's first line, in the present, by the cacique.) Then the thing the war was for and the Claim needs: "The
  Regent has gone home to his Throne. Someone must go and stand on it." The elders' debate's outcome colours one
  line (section 7.3). Yari, to Gianna: "Eightgate. We read the oath beside the Charter, in front of the chair."
  Xaraguá's seat token: Anaco gives Yari the **conch-shell token** (a key item: Se-5's Yaguana seat, the Claim's) and
  Yari gives it to Gianna: "Mine to carry. Yours to set down." `story.regent_retreated`.
- **The Trust route's last picture:** Rael at the doors: "I will be at Eightgate. Not beside you. The Throne has a
  Hearing for men like me, or it will have one." (The Hearing's seed.) **The Strike route's:** Benny at the doors,
  alone: "He went north. He left me. He said you would need a witness more than he needed a father." Both end on
  Anissa, at the door with the lamp, to nobody: "I held it." Card: *Chapter 11 complete, The War of the Harbor.
  Next: Chapter 12, The Claim.* `act11.complete`. `?chapter=12` starts where Chapter 12's outline puts the Gold Road.
- Journal: **The Regent's retreat** (done `act11.complete`; pays no XP: a card).

---

## 3. The maps (nine reused, none new; `tools/maps/xaragua.ts` through `painter.ts`)

Every Chapter 2 map is reused with a Chapter 11 variant (objects, NPCs, stage placements and triggers conditioned on
`story.war_begun` and the chapter's later flags; the Chapter 2 placements are untouched: the occupation's layers stay
on `story.crown_attack`, which still holds). The look is the occupied city's (the dusk wash, the banners) until the
harbor is won, then the free city's evening (`MAP_MOODS`: the Chapter 2 dusk wash reused on `story.harbor_won`).

| Map | Size | Section | Chapter 11 use | Echo |
|---|---|---|---|---|
| `xaragua-beach` | 36 x 22 (built) | The Canoe Beach | The landing (spawn `landing` (14, 11)); the fleet as boat objects on rows 15 to 17 by `army.*`; the headland gun (30, 6) with three looks and its crew; the companies' stage files; the resistance's walk down; the flank's hull at the west end and the betrayer's placement (`muster.betrayed, !war.flank_done`) or the second's (`muster.turned`); the war table's beach layer (pickets, crabs); the new north door (8, 0) to the gardens; the sea cave door's war condition (`story.escape_night` holds from Chapter 2: the canoes' way) | none |
| `xaragua-conuco` | 32 x 22 (built) | The cassava gardens | The road from the beach (a new east door); the ceiba and the grove as the anchors left them; a war-table layer on the road only | the built hutia zone stands |
| `xaragua-mountain` | 46 x 28 (built) | The Mountain Path (wild) | The war table `harbor_war` on a second layer `if: 'story.war_begun'` (the built layer's `!story.crown_attack` excludes it); the **lookout clearing** (39, 13) with *Harbors Lie*'s tally object and the view trigger; the pickets' placed pairs; the dusk descent | none |
| `xaragua-camp` | 28 x 20 (built) | The hill camp (the base) | The elders at the fire (the debate), the healer's hamacas (objects), the head runner's conch rock, the fisher's boy, Jordyn at the gate, two soldiers per company at the edge (placed by `army.*`), Salkhi below; the camp's south edge for the canoes' walk | the built grove zone stands |
| `xaragua-cave` | 30 x 22 (built, interior) | The petroglyph cave | *The Ninth Thumbprint*'s cave mouth is the antechamber: the jars at the Echo spot's edge, the carrier's walker; the drained chamber (`anchor.cave_sluice`) as the refuge it was | the built zone stands (no new scene) |
| `xaragua-village` | 44 x 30 (built) | The Harbor Village (the war's hub) | The dusk arrival from the north door; the companies' file to the yard; Jordyn's seven to the east trail; the *Patience* (a larger ship object at (10, 27)) and the chain strip (row 26, `above`) to the **chain post** (23, 19); the war-table night layer on the trails; the pier head's **new Echo zone** (21 to 22, 19 to 21); the stage-three foes placed at the pier's foot; the black sails on row 27 from `story.pier_won`; Rael's walk; Hale's or Rael's fight at the pier's end; the longboats; the Song House's door (a new door on the west house ring? no: the Song House is reached from the plaza as built: the stretcher walkers go up the north trail) | **the pier head** (new zone): Caona's stand and the chain post's anchor |
| `xaragua-customs` | 18 x 12 (built, interior) | The Crown Customs House | Thorne's war branch at his desk with two foes placed; the Yield; the cellar door open on `story.visit_granted` as built | none |
| `xaragua-cellar` | 14 x 9 (built, interior) | The cellar | Anaco's war placement; the marine's gone; the irons object; the sergeants' file at the stair | none |
| `xaragua-song` | 22 x 14 (built, interior) | The Song House (library) | The hamacas (objects on `story.harbor_won | story.fleet_escaped`), old Benny at the door, Nancy among the hamacas, Anissa's lamp, the wounded (lying stage looks), the captains' count | none |
| `xaragua-caney` | 36 x 26 (built, interior) | The Caney of Anaco (the seat) | The Crown captain gone; Anaco in the duho; the elders; the captains at the sides; Rael or Benny at the doors; the token | none |
| `xaragua-plaza`, `xaragua-record`, `xaragua-seacave` | built | | open as built; the sea cave's Thorne placement is long gone (`encounter.xaragua_story.thorne.won`); the canoes' way is told, not walked | the built areíto zone stands |

No new map. The seat is the caney (central, staffed, the elders disagreeing: the owner's rule, kept from Chapter 2).
The validator's rules hold: the pier head's zone tiles are walkable in both eras (the pier is 'k' in both grids: the
Echo grid is `g.map(OLD)` of the same shape); the Echo-era puzzle object (the capstan's pawl) sits on the zone's edge
at (23, 19); the anchor sets `anchor.chain_post`, read by the present chain strip and the capstan's second look.

**Drawn placeholders** (code, through `assets.config.ts`): the field gun (1 x 2, three looks), the *Patience* (a
larger `crown_ship` recolour with a violet pennant, 6 x 3), the chain strip (the Chapter 8 and 10 chain's shape, two
looks), the capstan (1 x 1, two looks, the Chapter 10 one), seven boat recolours by house (Chapter 10's), Ardencia's
ships (the `crown_ship` shape in black and crimson, 5 x 3, three of them), a longboat, the hamaca (1 x 2), the
stretcher, a lying look for a hurt soldier (one recolour per house's soldier look), the tally stick, the powder jar
(Chapter 2's oil jar recolour), the conch token; **Rael, Rivera, Jaime** as Chapter 3's looks; **old Benny** and
**Nancy** as Chapter 3's; **Hale** new (a violet coat, a boarding axe); Thorne, Anaco, the elders, the camp leader,
the healer, the fisher's boy as built; the captains and seconds as Chapter 10's; the old-uniform marines for the Echo
(a recolour of `crown_marine` and `crown_musketeer`).

---

## 4. The war on a phone-sized map, the volleys, the guest, and who fights

### 4.1 Armies as stage actors, not crowds (the Chapter 10 review's finding, applied)

Crowds in the built engine are present-only pictures that wander inside a rect (`engine/game.ts:162`,
`engine/crowd.ts`) and cannot stand in ranks or walk anywhere. So **no army in this chapter is a crowd.** An army is:

- **its captain and two soldiers as stage actors** (`enter`, `walk`, `face`, `exit` in the scene that moves them:
  the landing, the headland, the camp, the village, the cellar stair, the Song House door), written **once from a
  table** (the Chapter 10 review's recommendation): one script function `company(house)` that returns the captain's
  id and look, the soldier look, the three positions for a rank, and the captain's one shout; each scene calls it for
  every `army.*` that holds; a missing house is a gap in the file and one line;
- **placed pairs** between scenes (two soldiers per company at a map's edge, `if` by `army.*` and the chapter's
  flag: the camp's edge, the village's yard), so a save at any point shows the army where it is;
- **ships as objects** (the fleet on the beach's water, the Crown's three built ships, the *Patience*, Ardencia's
  three, the longboats), re-placed by flag and `sync` as the war moves;
- **the volleys as battle events** (4.2), which is the only time the army "does" anything the engine counts.

On a 20 x 11 tile screen, seven companies of three in a file are twenty-one sprites: the landing scene's file runs
along the sand at rows 12 to 13 across the beach's width, and the camera pans it once (a `look` at the last
captain). The second review should check that the stage runner handles twenty-one actors in one scene (Chapter 10's
night had about twelve); the fallback is **one actor per company** (the captain) with a placed pair behind.

### 4.2 The volleys (COMBAT 11, given a shape; Claude's call)

- **The pool:** `V = floor(armies() / ARMY_VOLLEY_PER)` (10): about 14 (thin) to 24 (full) at the landing, shown in
  the Journal's note *The fleet* ("Volleys in hand: V") and on the menu beside Armies.
- **The whistle before a fight** (the five fights with a name: the headland, the flank, Thorne, the pier, the
  flagship): the dialogue asks *How many volleys?*, 0 to `VOLLEY_CAP` (4) and at most what is left, and sets
  `war.volleys.<battle>`; the companies that answer are shown by order (Zetwal's levy, Free Brasador under Azzy,
  Ironvow, Dorini, Agnivansh, Suzumori, the watch; a betrayed house's turn is a gap: "Nobody answers for the
  Ironvow."), one shout each; the pool falls by the number spent.
- **In the battle:** `BattleDef.volleys: true` makes the engine read `war.volleys.<id>` at creation and, before the
  first turn, apply that many area hits of `VOLLEY_POWER` (150, a plain blow at the party's average ATK, Story's
  share applied) as events (*The Free Brasador volley!*). A boss takes `VOLLEY_BOSS_SHARE` (0.5) of each.
- **What it buys:** a thin fleet (14) spends 4, 4, 3, 3, 0 and arrives at the flagship with none; a full one (24)
  spends 4 everywhere and keeps 4, which the Chapter 12 outline may count as the fleet that sails on to Eightgate
  (Stability's "allied houses kept"). **The Strike route gets no volleys at the pier** (the companies will not fire
  with the envoy in the line), which is that route's first visible cost.
- **The numbers to sim on day 1:** a volley of 150 at ATK about 90 against a trio at 26 is roughly a third of a
  musketeer's HP; four of them open the headland fight with the musketeers half gone, which is the point (the army
  wins the standard fights; the party wins the bosses).

### 4.3 Rael in the four (Trust): a member for one fight, no guest system

`MEMBERS` gains **`rael`** (`era: 'present'`, class warrior, row front, the Chapter 3 boss's stat line scaled as a
member at 28: HP about 260, ATK about 95, DEF about 70; skills: *La Marca* (SP 4, marks one foe), *Grito de Guerra*
(SP 6, stuns one foe one action), *Reinado de Cenizas* (SP 12, heavy, all foes); passive *Sangre Ardiente* as the
built `atkPerBound` is enemy-only, so his passive is ATK +10% while any party member is down, or nothing; no Anissa
bond; `leads: { all: [{ flag: 'party.rael' }] }`). `party.rael` is set in the line before `battle.next:
'flagship_hale'` and cleared in `escape_after`'s twin (`hale_after`). He never appears on the Status page between
fights, never equips, carries nothing, and is not a roster member after (STORY: "guest only, not a roster member";
Chapter 12's outline decides whether he stands beside her at the Claim, which the Hearing's shape says he does not).
Zero engine; `fighters.test.ts` grows by one and asserts the flag is clear at the card.

### 4.4 Stability inputs, recorded (the Opus plan review's "a record of the Accord's Stability inputs")

No Stability score exists in the engine. This chapter writes the inputs the ending reads as flags and nothing
else: `stability.harbor_trust` | `stability.harbor_strike`; `stability.fleet_struck` | `stability.fleet_escaped`;
`stability.xaragua_freed` (Anaco), `stability.elders_agreed` (the debate mediated), `army.*` as they stand after
the flank (the turned house kept at three quarters: "allied houses kept"), `choice.thorne_*`, `choice.flank_*`. The
score itself is Chapter 12's (one pure function over these flags and Concord).

### 4.5 Who fights

Eight fighters, four active by the roster order (Gianna, Yari, Azzy, Samira) unless Chapter 8 or 9 built the order
screen; `leads` lifts **the betrayer's companion** into the flank fight and **Rael** into the flagship fight. The
Echo battle is the three Echo members (no fourth: `BATTLE_ACTIVE` 4 with a roster of 3 is fine). The Chapter 10
review's rule applies: the build sims both the roster order and a glass-cannon line (Gianna, Yari, Vikram, Haru) and
the chapter must not depend on the order; Bayarmaa's Chapter 10 landing hint ("Put your best blades up front") is
paid again by the camp leader if the order screen does not exist.

---

## 5. The chapter's fights and levels

**Enemies (built shapes re-levelled; new data only where marked; `COMBAT.md` 13.2's Harbor rows):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Crown Marine** (built) | skirmisher, `bribable` | 25 to 28 | Bayonet 110 | as built; the war's palette |
| **Crown Musketeer** (built) | caster | 25 to 28 | Bayonet jab 90; Volley 180 every 2, tell | as built |
| **Musketeer in a Breastplate** (built, `armored`) | caster | 25 to 27 | as the Musketeer | one per stage fight: "your light goes through it" |
| **Crown Officer** (Chapter 9's `crown_officer`, or new here) | brute (COMBAT's support is not an engine role) | 26 to 28 | Sabre 100; **Rally** `ally`, `inspired`, every 3, tell "The officer raises his sabre: 'Steady!'" | the Chapter 9 outline's shape |
| **Regent's Sealbearer** (Chapter 9's `sealbearer`, or new here) | caster, `armored` | 27 to 28 | Writ 100 `magic`, `weakened` 60%; Seal 130 `magic`, `hushed`, every 3, tell | the *Patience*'s |
| **Husher** (built) | caster, resists light | 26 | as built (Whisper, Hush, Seize) | the betrayer's cell: the chapter's only Seize; Gianna steps in, as built |
| **Steppe Reaver** / **Fog Cutpurse** / **Oil Enforcer** / **Caravan Raider** (built) | as built | 25 to 26 | as built | the betrayer's house pair, by variant |
| **Mangrove Crab** (built) | tank | 25 | as built | the beach's table |
| **Old-uniform Crown Marine / Musketeer** (the built two, a look swap) | as built | 27 | as built | the Echo battle only |
| **Governor Thorne** (built) | tank, weak to light | **27** | as built: Sword cane 110; Pistol shot 190 every 3; The Charter, read aloud 80 `area` every 4 | `hpScale 3`, `atkScale 1.1` (he is a stage fight, not the chapter's boss: `boss: true` only for the Grudge's climb); `withdraws` ("Get me OUT!", again) |
| **The Betrayer** (`betrayer_<house>`, four entries) | brute, `boss`, not bribable | **26** | section below | `hpScale 5`, `atkScale 1.2`; `withdraws` by house (nobody dies) |
| **Captain-General Hale** (`hale`, new) | tank, `boss` | **28** | section below | `hpScale 6`, `atkScale 1.25`; `withdraws` ("The Regent will hear of this.") |
| **Rael, the Harbor Strike** (`rael_harbor`, new entry; the Chapter 3 data's twin) | tank, `boss` | **28** | section below | `hpScale 6`, `atkScale 1.2`, `atkPerBound` 0.1 as built, no `floor` (La Promesa is Azzy's now if Ar-4 ever lands; today he wears none: "He gave it to Rivera to hold"); `withdraws` |
| **Captain Rivera**, **Jaime** (built) | tank (`protects: 'rael_harbor'`), caster | 27 | as built | `withdraws` as built |

**The Betrayer's four variants (COMBAT 13.3 #8, in the engine's shapes; the house moves approximated where the engine
has no such thing):**

- Shared frame: Blade 110; **the house move** every 3 with a tell; at 50% a phase with **`enter`** of one more house
  foe and the move's harder form. Each comes with two house foes and the Husher (the Quiet Crown's hand, shown as a
  person; its Seize is the fight's one aim at Anissa, answered as built).
- **Hrafn, *Warpath*** (COMBAT: two turns in a row: no engine) → *Warpath* 200 `area` every 3, tell "Hrafn lowers the
  horse-tail and comes at the whole line..."; phase two adds a Steppe Reaver.
- **Mibu, *Marionette*** (redirects your action: no engine) → *Marionette* 100 `magic`, `hushed` (the fighter's skills
  go dark: "your strings are cut"), every 3, tell "Mibu's fan opens. One of you stops moving your own hands..."; phase
  two adds a Fog Cutpurse.
- **Prakash, *Endless War*** (no SP costs for a round: no engine) → *Endless War* `ally` on himself and his foes:
  `inspired`, every 3, tell "Prakash lifts the brass lamp: 'The flame does not tire.'"; phase two adds an Oil
  Enforcer.
- **Rashid, *Paid Off*** (bribes benched turns away: no engine) → *Paid Off* 90, `stunned` 100% on one fighter, every
  3, tell "Rashid opens his ledger: 'You. Stand there. You've been paid.'"; phase two adds a Caravan Raider.

**Captain-General Hale (COMBAT 13.3 #9):** level 28, tank, HP x6, ATK x1.25. **Boarding:** Axe 120; *Boarders* 100
`area` every 3, tell "Hale's whistle: boats hit the pier..."; two Crown Marines and a Sealbearer at 28 from the
start. **Champion's Duel** (at 50%): "One of you. The Regent asked me to make it quick."; *Challenge* 190 one target
every 2, tell "Hale points his axe at one of you..." (COMBAT's "others are Stunned when he does" has no
single-target-plus-others shape: the approximation is *Call to the rail* 60 `area`, `stunned` 40%, every 3 in the
same phase). `enter` of two more marines at the phase.

**Rael, the Harbor Strike (COMBAT 13.3 #3b, four phases):** level 28, tank, `boss`, HP x6, ATK x1.2, `binds: true`
on the battle, Rivera (`protects`) and Jaime beside him from the start (the Chapter 3 shape). **Measured:** Blade 120;
*La Marca* 100, `marked`, every 3, tell. **Unleashed** (at 66%): "Rivera. Jaime." the built `RAEL_UNLEASHED` (Grito
de Guerra `stunned`); the two guards are already in, so the phase brings in two Brasador Halberdiers (built,
re-levelled to 27) instead. **Cornered** (at 33%): the built `RAEL_CORNERED` (Reinado de Cenizas with `powerPerBound`,
`once`). **Broken Army** (at 15%): "Enough. Rivera, the boats." (Rivera and Jaime have withdrawn at 0 HP by now in
most seeds; if not, the phase's text sends them: the build checks whether a phase can clear standing allies; if not,
section 10's tiny piece); his moves become the bind-only pair: *Cord* 90 (a blow that Binds at 0 HP like any other,
power low) and *Stand down* 0 `area`, `weakened`, tell "He is not striking. He is waiting for you to stop." He never
strikes Gianna: section 10's `avoid` field, or the dialogue's word. He `withdraws` at 0 HP. **He only Binds** is the
battle's `binds`, as built: nobody falls.

| Fight | Where | Foes | Level | Party then | Pays (data) | Way back in |
|---|---|---|---|---|---|---|
| **The headland battery** (`headland_battery`) | the Canoe Beach | Crown Officer 26, Crown Musketeer 25, Breastplate Musketeer 25 | 25 to 26 | 25 | 80 XP, 200 gold | the gun's step trigger (fires again) |
| **The flank** (`harbor_flank`, four variants; skipped on `muster.turned`) | the Canoe Beach | the Betrayer 26, two house foes 25, Husher 26; one more at 50% | 26 | 25 to 26 | **160 XP, 400 gold**, the companion's charm | the captain on the sand |
| Ambushes (`harbor_war`, from `story.war_begun`) | the beach, the gardens' road, the Mountain Path, the village's trails by night | Marine x2 + Officer (26); Musketeer x2 (one armored) + Marine (27); Husher + Zealot x2 (26); Crab x2 + Marine (25, the beach only) | 25 to 27 | 25 to 28 | the encounter rule | as built |
| **The customs house** (`customs_thorne`) | the customs house | Thorne 27, Crown Marine 26, Breastplate Musketeer 26 | 27 | 26 to 27 | **140 XP, 350 gold** | Thorne at his desk |
| **Caona's stand** (`caona_stand`, `era: 'echo'`) | the pier head, fifty years ago | old-uniform Marine x3, Musketeer at 27 | 27 | the Echo three at 26 to 27 | 60 XP, 0 gold, the Memory | the shimmer (a loss in the Echo: the goddess, Rise at the zone's edge in the present) |
| **The pier** (`pier_assault`) | the pier's foot | Crown Officer 27, Sealbearer 27, Marine 27, Musketeer 28 | 27 to 28 | 27 | 100 XP, 300 gold | the pier-head trigger |
| **The flagship** (`flagship_hale`, Trust) | the pier's end | Hale 28, Marine x2 28, Sealbearer 28; two marines at 50% | 28 | 27 to 28, **with Rael** | **220 XP, 600 gold**, Hale's boarding axe (a weapon, tier 28, for Azzy) | Hale at the pier's end |
| **The vanguard** (`pier_rael`, Strike) | the pier's end | Rael 28, Rivera 27, Jaime 27; two Halberdiers at 66% | 28 | 27 to 28, **no volleys** | **220 XP, 0 gold** (nothing is taken from him), no item | Rael at the pier's end |

**Planned numbers (to measure on day 1; the Chapter 9 and 10 sims' scaling):** the standard trios at the party's
level should run 8 to 13 actions with nobody down (the Chapter 10 Cane Road's trios ran 7 to 14); the four-foe pier
fight 14 to 18; Thorne at x3 with two foes about 24 to 28 actions (Grimvald at x5 alone ran 29); the Betrayer at x5
with three about 28 to 34 and a fall in one fight in five at 25; Hale at x6 with three and Rael in the four about
30; Rael at x6 with two guards and `binds` about 32 to 38 with two Bound per fight at 27 and a loss in one in ten at
26 (the Trial of Blades at x3 / 13 bound two to three per fight on its own schedule). **The gates for day 1:** every
fight wins every seed at the band's floor with the fair bot and the real four; no boss over 40 actions; the Strike
fight's loss rate at 27 under one in eight (it is meant to be won, at a price); the Echo three at 27 win the stand
in every seed (if they do not, the stand gets two Marines, not three). The volleys are simmed on and off: a fight that
is trivial with four volleys and fair with none is tuned on none.

**Levels through the chapter** (objectives at **50**, a row for Chapter 11; the fights as data; the Echo battle 60;
the debate 25 mediated; the two quests 100 and 80; books 10 (the Song House's nine and the caney's four are Chapter
2's and read then on the route: 0 here); ambushes by the built rule: a trio at the party's level pays about 12% of
the level, 65 to 70 XP at 25 to 27):

| Point | XP from | Total from 8,078 | Level | From 8,400 | From 8,623 (a 26 start) |
|---|---|---|---|---|---|
| Start (the strait) | | 8,078 | 25 | 8,400 (25) | 8,623 (26) |
| The strait, the gun, sails behind us, the hill camp, the tide, the customs house, Anaco, the pier, the Turn, the flagship or the vanguard, the truth, the Song House (twelve objectives at 50; *Until the tide* and the card `noXp`) | 600 | 8,678 | 26 | 9,000 | 9,223 |
| The headland (80), the flank (160; 0 if turned, see below), Thorne (140), the stand (60), the pier (100), the boss (220) | 760 | 9,438 | 27 | 9,760 (**28**) | 9,983 |
| The debate (25), *The Ninth Thumbprint* (100) and its picket (by the rule, about 70), *Harbors Lie* (80) | 275 | 9,713 | 27 | 10,035 | 10,258 |
| Two ambushes on the mountain (about 65 each) | 130 | **9,843** | **28** | 10,165 (28) | 10,388 (**29**) |

**The level statement for the milestone note.** The chapter is **three levels wide (1,675 XP)** and its fights pay
760 of them, which is as it should be for a war; the fixed total of about 1,765 lands 28 from the floor of 25 with
two ambushes, 28 from the middle, and 29 only for a party that **arrived at 26** (the Chapter 10 review's wanderer),
which `slackOver = 1` allows and Chapter 12 (28 to 30, twenty minutes, the Regent at 30) absorbs. **The turned
route pays the flank's 160 as the objective's XP instead** (the objective *Sails behind us* pays 50 + 110 on
`muster.turned`), so an exposed Muster is not a level behind a betrayed one. Two dials, both Claude's calls (section
12): `XP_PER_OBJECTIVE_BY_CHAPTER` row 11 = **50** (rows 9 and 10 must exist first: whatever their builds set), and
the bosses at 220 / 160 / 140 (Grimvald, the Fox and Dhanraj paid 120 to 140 at two-level chapters; the Hushed 120).
Set the exact dials with `tools/level-curve.ts` from **Chapter 10's measured end**.

**Gold:** about 2,000 to 3,500 in; the chapter pays about 1,850 (the fights) plus ambushes (about 100 each at 26);
*The Ninth Thumbprint* 150. Out: the beach market is burned and the village's vendors are indoors until
`story.harbor_won` (the casabe baker, the carver and the bow-maker come back to the beach at the end: a line each);
the Song House sells nothing. There is **no tier-28 shop** in this chapter (Hale's axe is the one tier-28 piece;
Eightgate's outfitter in Chapter 12 stocks the rest). Nothing requires spending.

---

## 6. The required-before gate: "Until the tide"

- **In the story:** the camp leader has said it once at the fire (beat 3): the assault is at the lowest tide, at
  dusk, and the camp has three things to do before it: the elders must agree what the harbor is being taken for (the
  debate), the canoes need powder (*The Ninth Thumbprint*), and the Crown's ships must be counted from the lookout so
  the canoes know where the *Patience* lies (*Harbors Lie*). Yari: "Everything is the tide here."
- **In the Journal:** the objective **Until the tide**, `followSide`, `noXp`, done when the debate is settled
  (`debate.xaragua_harbor.settled`: joined or mediated), `side.ninth_thumbprint.done` and `side.harbors_lie.done`,
  **or** when `story.tide_called` is already set (a save mid-descent never sticks). Then **The tide**: the head runner
  on the rock (the arrow at him): "Say the word, cacica." Yari: "Blow it." (`story.tide_called`: dusk.)
- **On the map:** the head runner is worded from the flags until then ("The elders are still at it." / "The canoes
  have no powder." / "Nobody has counted the ships since dawn."); Anissa: "Your Quests page, Gigi."
- **Order the arrow follows** (the hill the short way): the fire (the debate: it is where the party stands), the
  lookout (down the mountain's branch trail: *Harbors Lie*), the cave mouth (down to the gardens: *The Ninth
  Thumbprint*; the picket on the road), back up to the rock.
- **Dusk and night are conditions** (`story.tide_called, !story.anaco_freed` for the descent and the village's
  checkpoints; `story.anaco_freed, !story.pier_won` for the pier; `story.pier_won, !war.turn_made` for the Turn;
  `war.turn_made, !story.harbor_won, !story.fleet_escaped` for the boss; after that, the night), not flags a dialogue
  must remember to set (the Chapter 6 and 10 reviews' rule). The Turn's two entries set `war.turn_made` with
  `war.trust` or `war.strike`.
- **No soft-locks:** the debate never Game Overs and settles on a loss (`debate.ts:149`; Provoke does not settle);
  `mediate` is reachable (Xaraguá's Influence is 5 or more on every save: Chapter 2's four required quests' +1s, the
  debate's +1 and the books); the picket is winnable and returns to the road; the cave mouth's walker fires once and
  the jars are an object; the lookout's tally is a dialogue; the conch asks again until blown; every named fight has
  a placed way back in (the table in section 5); the Turn is a dialogue on a trigger that fires again until
  `war.turn_made`; the Strike loss returns to the pier with the choice kept; the Trust fight's `party.rael` is set and
  cleared on the same two lines whether the fight is won or lost (a loss clears it in the Game Over path: the build
  tests a lost `flagship_hale` leaves `party.rael` false).

---

## 7. The two required side quests and the debate

Yucayeque's five Chapter 2 quests are done or closed on every save (the dusk gate needed all five); the war's two
are new, Xaraguá's, and belong to the day on the hill. Both are on the route the gate walks.

### 7.1 The Ninth Thumbprint (new; the safehouse thread's last door; a fight)

- **Opens:** the camp leader at the fire, in the plan (beat 3): "The canoes have no powder. The jars that come to the
  cave mouth on new-moon nights are oil, not powder. Tonight is a new moon, and the lowest tide." The lamp-oil seller
  (placed at the camp: she fled the village after Chapter 2) adds the Chapter 2 line's twin: "Still never met him.
  But the last jars came with a note. 'For the harbor. When they come.'" Accepted when spoken to
  (`side.ninth_thumbprint.accepted`).
- **Steps:** 1) **Down to the gardens** by the mountain (the war table on; the arrow). 2) **The cave mouth** (the
  petroglyph cave's antechamber, the built map): at the Echo spot's edge, **a row of jars** that were not there in
  Chapter 2 (objects on `side.ninth_thumbprint.accepted`): not oil: powder, each sealed with wax and **the grey
  thumbprint**, the ninth door. 3) **The carrier, seen (shown, once, and never spoken to):** as the party comes in, a
  man in a black coat with the sash torn off sets the last jar down and goes out through the gardens at a walk
  (an `exit` walker to the conuco door; the party is ten tiles away; he does not run). Anissa, who watches how
  people walk: "He walked like the ones on the strand, Gigi. The black coats." Azzy: "...A lot of people walk like
  that." (Earnest, and true: it is the last clue before the Turn, and it is a clue, not a proof. No line names a
  house or a man.) 4) **The picket** on the gardens' road as they come out with the jars (a Crown Marine x2 and an
  Officer at 26: the war table's group, placed; a step trigger that fires again): the fight. 5) **Back to the camp:**
  the jars to the canoe fisher at the camp's south edge (shown: the jar objects move; the fisher: "Powder. Then the
  canoes go under the pier tonight and not just alongside it."). `side.ninth_thumbprint.done`; the Journal note
  ***The Ash Thumbprint (9 of 9)***: "Nine doors. Nine thumbprints. The last one was powder for a harbor, left by a
  man in a black coat who did not want to be thanked." (SIDE-QUESTS' "Someone is feeding the realm" note is already
  on the save from the fifth; this is its close.)
- **Reward:** 100 XP (the picket by the rule, about 70), 150 gold, +2 Influence at Xaraguá; the canoes' powder (one
  line at the pier: the canoes come out from under the piles with it; without the quest nothing is withheld, since the
  quest is required).
- **Why it fits:** the design's thumbprint thread (nine safehouses, "the thread that leads the player to Rael's
  ledger") closes in the chapter where the ledger is read; the "stranger" of Chapter 2's lamp-oil seller is seen
  for the first time, from the back, the day before Gianna learns who sends him; the fight is the war table's; the
  wild section is walked by a required quest (the Chapter 8 to 10 pattern); and the owner's rule: the carrier walks,
  sets the jar down and walks off, and no one tells the player what that means.

### 7.2 Harbors Lie (new; CAPITALS' "count the Crown ships (Influence)"; no fight)

- **Opens:** the fisher's boy on the camp's rock, with his tally stick (the built child who counts Crown boots, now
  counting ships): "Forty-two marines. Eleven ships. But the camp leader says count them again from the top, because
  harbors lie." (Patricia's line, in a boy's mouth, which is how a line travels across a fleet.) Accepted when spoken
  to (`side.harbors_lie.accepted`).
- **Steps:** 1) **The lookout clearing** on the Mountain Path (the built trail branch to (39, 13) "over the sea"): a
  view trigger at the clearing's edge; shown as a dialogue of counting with the boy, who has run ahead (placed): the
  harbor from above (the player cannot see the sea from the map; the counting is spoken, with the built ship objects'
  count as its truth: "Three at anchor by the pier. Seven across the mouth. The big one in the middle with the
  violet rag is the *Patience*. That's eleven."). 2) **"And those."** (The boy, pointing north: the second half of the
  count, and the quest's point.) "Black sails. Off the point. Four. They're not Crown and they're not yours." Azzy
  (the stage party member, a `face` north; the only line): "...Ardencia." Nobody says more. (The guide's "the player
  expects a second father-daughter fight": the sails are seen, counted, and not explained, four hours before the
  Turn. Gianna's one line: "He came for the Regent's harbor. Of course he did." (`belief.rael_traitor` in her mouth,
  once.)) 3) **Back to the camp:** the count to the camp leader ("Eleven and four. The canoes go for the *Patience*,
  not the pier."). `side.harbors_lie.done`; the Journal note *Harbors lie*: "Eleven Crown hulls, the *Patience* in
  the middle. Four black sails off the north point, counted and not explained."
- **Reward:** 80 XP, 0 gold, +2 Influence at Xaraguá, and the Turn's picture earned: when the black sails come round
  the point in beat 8 the player has already counted them.
- **Why it fits:** CAPITALS' job made a scene; the fisher's boy of Chapter 2 grows up by one task; it is the cheapest
  quest in the chapter (no map, no fight, a placed child and one dialogue); and it does the one thing the Turn needs
  for fairness: the player knows Ardencia is in the water before Rael walks up the pier.

### 7.3 The debate, required: *Won by seven navies: whose harbor?* (the elders' choice, STORY 2's "comes back in Chapter 11")

A `DebateDef` in city `xaragua` (`xaragua_harbor`), at the hill camp's fire, between the three elders of Chapter 2;
`opensIf: 'story.camp_reached'`; `mediate` at the built Influence 5 in Xaraguá. The ally is **the elder against the
Charter** (`elder_resist`: "The harbor stays with the people who fish it. It was sworn. Seven navies or none."); the
opponent **the elder for the Charter** (`elder_charter`, Chapter 2's "We cannot fight three warships with canoes. I
say we sign, and live.", now: "We could not fight three. Now we have seven of someone else's, and when the Crown
goes, which of the seven goes home? The Charter said protection. So do they."); the undecided elder listens, and
turns the vote at the end. **Reason needs** one of *The First Oath* (the Song House, built), *The Charter of
Protection (seized)* (built), *The Council's Minutes* (the caney, built) or *The Sun Accord (copy)* (Pòdlimyè's Hall,
built). The rounds' claims: protection; who stays; whose chain. The strong answers: Scripture (the Four Hands: who
gave you the right to sell what the hands held: the built book's line, and the Gaze remembers who fished it),
Reason (the Charter cites a clause nobody here swore; the oath names three; the seventh page was read to a clerk in
another room: the Marshal's own answer from Chapter 10, `story.patricio_told`, is the strongest answer offered),
Compassion (Yari's line, given to Gianna: "My father said he was no use to you in chains. He is in them now. Which of
the seven put him there?"). **Mediate:** **Yari** (the stage party member walks to the fire) says the oath's first
line and the Muster's rule in the same breath: "The harbor stays with the people who fish it. The seven sail home when
the chain is down. I'll say it to each captain, and you'll hear me." The undecided elder: "Then that is what we are
taking it for." `debate.xaragua_harbor.settled`; mediated sets `ally.xaragua` and `stability.elders_agreed` (joined
and won sets `ally.xaragua` too; a loss settles without it, and Anaco's freeing sets it at the latest: section 2,
beat 6). The debate's `after` lines at the caney (beat 10): mediated, Anaco: "The elders agreed before I was out of
my irons. That has never happened."; otherwise, "The elders agreed after. That is more usual."

**Why one debate and not a skip:** a war chapter could argue the debate away, but the design put the elders' choice
here on purpose (STORY 2: beat 6's debate "comes back in Chapter 11"), and the question it asks is the chapter's and
the Claim's: whether seven protectors are a Charter. It is the Concord the Muster taught, used once, where it
decides a flag Chapter 12 reads.

### 7.4 Books, vendors and the board

- **No new library.** The Song House's nine and the caney's four stand; two Chapter 11 looks on built books: *The
  Charter of Protection (seized)* (after `story.thorne_taken`: "Thorne's own copy is under his desk. It is the same
  paper."), *The First Oath* (after `story.harbor_won`: "Read aloud in the caney tonight, by the cacique, in the
  present tense.").
- **Vendors:** none until `story.harbor_won`; then the beach market's three come back to the beach (a line each; the
  stalls' burned looks stay until Chapter 12's epilogue text). The lamp-oil seller at the camp sells torches and
  casabe (the built `xaragua_food` stock on a second placement).
- **The contract board:** "count the Crown ships" is *Harbors Lie*; "carry salt to the hill camp" and "mend nets" are
  after the release.
- **Anissa's nudges** (mystery quests, under 128 characters): "The elders are still arguing, Gigi. Yari could stop
  them." / "The boy wants to count ships from the top of the mountain." / "The jars at the cave mouth. Somebody
  brings them. Tonight's a new moon."

---

## 8. The Echo: Caona's stand and the chain post (the chapter's Echo battle and its puzzle; difficulty 2)

- **Present:** the pier head, the Crown's chain made fast to the old chain post's capstan and drawn taut across the
  harbor mouth to the *Patience*; the capstan's pawl with an empty pin hole (the Chain Bridge's shape, which the player
  has known since Chapter 1); the air shimmering on the pier's first boards.
- **Echo:** the same pier fifty years ago, by day, under the old sails: the Crown's longboats coming in; **Caona** and
  two scouts on the pier head; **Patricio** (the player) and **Benny** beside her. Caona: "Marshal. Hold the pier
  with me. Your companies form on the shore behind us, or they form in the water." The **Echo battle** `caona_stand`
  (`era: 'echo'`: three old-uniform Crown Marines and a Musketeer at 27; the Echo three at the party's level; no
  Surge: Anissa holds the door in the present; the fight leans on Patricio's Guard and Taunt, Benny's Riposte and
  Caona's Scout's Shot, as COMBAT 11 intends). After the win (the marines go back into the boats: `withdraws`;
  nobody dies in the memory either): Caona, at the capstan: "They'll chain the mouth next time they come, Marshal.
  Everyone does. Make it so it won't hold." **The puzzle (one object, one verb, a line that says so):** the capstan's
  pawl pin is an Echo-era puzzle object; `use` pulls it and drops it in the water (**anchor**, `anchor.chain_post`).
  Patricio: "Fifty years from now somebody will wonder why their chain won't hold." Caona: "Good."
- **Logic:** the Chain Bridge's pin, in reverse: a capstan without its pawl pin cannot hold a load; the Crown chained
  the mouth to the oldest post in the harbor, which has had no pin since the Revolution. Honest difficulty 2 (the
  player has turned this exact winch once).
- **Back in the present:** the chain runs out the moment the *Patience* loads it (the strip's look goes; the capstan's
  second look spins; `fx: 'shake'`; the chain's sound), the harbor mouth is open, and the black sails can come in
  (beat 8). The **Memory** (COMBAT 11): the Journal note *Caona's stand* ("Caona held this pier so two armies could
  land. Fifty years later it is the third's turn.") and the hidden present route: the canoes come out from under the
  pier's piles (where Caona's scouts' boats hid: shown on the `sync`); the stat Memory (+2 SPD to Yari, "her
  great-grandmother's pier") after the release (section 10).
- **Hints:** "The chain's tied to the old post, Gigi. It looks like the bridge's winch." / "Grandfather was on this
  pier with Caona. She said something about chains." / "In the memory, pull the pin out of the capstan's pawl. Then
  come back and watch the chain."
- Files: `puzzles/xaragua_pier/solution.json` (the fight is replayed by the battle test, not the puzzle test; the
  solution script is the pin) and `cheats.json` (the present capstan turned by hand: "Rusted solid. The pawl's pin
  hole is empty, and has been for a long time."); `echoGoals`: Caona, then the capstan, then the shimmer.
- **Why it fits:** STORY's "Caona's last stand at the harbor, the place where the debt began" is the Echo battle the
  engine has carried since Chapter 1 and never used; the anchor makes the Harbor Turn's geography the Echo's doing
  (Rael's ships can only come in because Patricio and Caona made the mouth unchainable), which is what "the same
  place, armies then and now" asked for at the Muster, done here with a fight; and the pin is the Chain Bridge's
  pin, so the puzzle is the game's first one, turned round, on the last island.

---

## 9. Rael, the family, the companions and Anissa: how the beats are played

### 9.1 Rael (the guide's voice; the truth in full; the Strike variants)

- **Before the Turn** he is seen once: walking up the pier alone with his hands behind his back (the guide's idle
  pose), and says four public sentences that choose nothing. The signet is dark and nobody says so until after.
- **The truth, by lamplight on the pier, both routes** (private register; no joke in the scene; Anissa present and
  silent after her line; Azzy present):
  1. *The marriage.* "Your mother and I married twenty-five years ago, in the year I was given the name you know me
     by. A man with that name has enemies who hunt children. Two daughters of two houses are a claim to a Throne. So
     you were Limyè, and I was the man who sold Xaraguá." Gianna: "Mother said one true thing at Eightgate." Rael:
     "She said it to me too. She was right."
  2. *The Crown.* "The Throne believes it bought me with the harbor's gold and a chair for my blood. I let it. A man
     the Crown has bought is shown its ledgers." (`clue.crown_pact`, read from his side.)
  3. *The shadow.* "Ask the lamp-oil seller who she has never met. Ask your Titi Amanda who pays for the flour. Ask
     the Fox who paid for the lanterns in the marsh. Nine doors, Gianna. You have opened them all now." (The ninth
     thumbprint, that morning.)
  4. *The Quiet Crown.* "I founded it, long ago, as a way for frightened people to be useful. Its cells do not know
     me; they could not be bent if they did... They were bent anyway. Against your sister. By the Regent's almoner.
     My design did that. That is mine to answer for, and I will answer for it where it can be written down."
  5. *The line.* "My father kept his oath and it cost him everything. I wanted to know what would happen if someone
     kept the goal instead." Then, to Azzy only, the guide's private line: "You have your grandfather's hands and your
     mother's patience. Neither is a reason to disobey." Azzy: "I disobeyed *you*." Rael: "Yes. That was the point of
     raising you."
  **On Strike**, the same five with one change at the top: "I would have told you on the pier if you had let me. You
  did not. That is my doing too; I taught you not to." and Azzy's line is already said (beat 8b) and he says nothing
  to his father at all (a `face` away: the thing the chapter shows instead of telling).
- **What he does not say:** nothing about the treasurer (the Hearing's), nothing about the elders' money beyond "the
  flour", nothing that asks to be forgiven. The guide's rule, written on the scene: "not redeemed in the moment."
- **The locked rule, released:** from `clue.ash_road_read` on, the content test's forbidden list for the family
  (Rahel's, Patricia's, Kayla's, Jordyn's) no longer applies to new lines, but **no line before `war.turn_made` may
  say he is good** (the test keeps "innocent", "good", "feeds", "the arrows", "thumbprint" out of every pre-Turn
  line in this chapter except *The Ninth Thumbprint*'s Journal note, which names a door and no man).

### 9.2 Old Benny and Nancy (FAMILY.md, settled: they shelter the wounded)

- **How they are here (Claude's call, section 12):** on Rael's ships. Benny asked to come ("He always asks."); Rael
  brought him where he meant to stand. They are the first thing Rael puts ashore after the Turn, on either route;
  on Strike, Rael's ships go and Benny stays ("He left me. He said you would need a witness more than he needed a
  father."), which is the Hearing's witness on the right island.
- **Benny on the map:** old, wry, on a cane; counts the wounded in at the Song House's door ("Forty. I count. It is
  what I do at the end of a thing.": the Cendre ford's forty, which the four accounts argued over, in his mouth as a
  habit). His line to Gianna about the Locket pays Chapter 3's "I made the other half": "I did not say for whom. Now
  you know." His one line about his son: "He is his mother's. He never explained himself to me either." (The Rahel
  line's twin, after the Turn, so it is allowed.) Nothing to Rael on the pier: a `face` and nothing, which is the
  family.
- **Nancy on the map:** gracious; she takes Anissa's hand and the lamp and runs the Song House with the healer; her
  one line to Gianna, at the end: "Zelia will want to hear that you ate something. I'll tell her you did." (The
  keep's steward, Chapter 3.)
- **Placeholder looks:** Chapter 3's `benny_old` and `nancy` (both built).

### 9.3 Anaco, Thorne, Yari, Azzy, Jordyn, Joaquin

- **Anaco** is freed by Yari (beat 6), sits the duho (beat 10), says the oath's first line in the present and gives
  the conch token. He is not at the pier. His only line to Gianna: "Envoy's daughter. You used it."
- **Thorne** is stage two's fight and the Yield's (spared to the *Patience*, or chained in his cellar); either way
  "The Charter stands. It is written." is his last line, and the Claim answers it. His Chapter 2 register (cruel,
  bureaucratic, "Miss Limyè") is kept to the word.
- **Yari** has the chapter's second-biggest arc: the bow of the boat, the camp ("Everything is the tide here"), the
  mediation, the cellar stair, the caney ("Mine to carry. Yours to set down."). She is called **cacica** once, by the
  head runner, and does not answer to it; Anaco calls her nothing but her name.
- **Azzy** commands Free Brasador (the Chapter 10 fix) with Joaquin at his side; his "¡Firmes!" is the volley's
  first shout; he stands at Gianna's side at the Turn and says the one line that is true on both routes; on Strike he
  is furious at her (one line) and silent to his father; on Trust he fights beside his father without a word and
  answers him once after. **He stays in the party on both routes** (section 12).
- **Jordyn** leads a company (FAMILY.md): the watch takes the east trail, arrests the betrayer and Thorne by the book
  ("I only have the one set."), and holds the gate of the camp. One line to Anissa, no joke, at the Song House's
  door: "You held a door in a keep and a rail on a ship. Hold the lamp." (Chapter 10's pier line's twin.)
- **Joaquin** is at Azzy's side and says one thing, at the Song House, counting Free Brasador's hurt: "Nobody from
  the wall. I gave an order once; I'd rather count them now."

### 9.4 The betrayer's companion: the second defiance (STORY 6.9), the line on the sand

Four variants, one line each as the captain comes up the beach, in the register each chapter gave them, before the
fight the companion leads:

- **Bayarmaa** (Hrafn): "The Moot wrote the first sale down as shameful. I said I'd write the second. I brought the
  pen." (She draws.) (If turned: to the rider: "Stand where the standard can see you.")
- **Haru** (Mibu): "Councillor. I was definitely not a spy. You definitely were. Mother will want the pages, and I
  am going to give them to her." (If turned: to the signal master: "Stand where the lantern can see you.")
- **Vikram** (Prakash): "Steward. You sold the flame for oil. I'm out of breath *already* and we haven't started."
  (Away from Anissa: she is at the headland's foot with the healer.) (If turned: to the junior priest: "Stand where
  the lamp can see you.")
- **Samira** (Rashid): "You sold my mother's guild and then you came to collect. I'll price that. It's everything,
  and it's due." (If turned: to Layla's clerk: "Stand where the seal can see you.")

### 9.5 Anissa in this chapter

- She is looked at by the Husher (the flank's one Seize: Gianna steps in, as built), spoken to by the healer, Nancy,
  Jordyn and Patricia's line in a boy's mouth; she is never hit, never a target, never in a fight (the Echo battle is
  the three ancestors'; she holds the door at the shimmer). **Her lines on the thread:** "Gigi. Count them." (the
  flank), "I'll hold it." (the camp), **"It's dark, Gigi. It glowed when he lied. In the hall. It's dark now."** (the
  truth: the chapter's hinge, her Chapter 3 observation heard at last), "The Song House. I'll hold it." (to Nancy),
  "I held it." (the last line of the chapter). Her Surge gesture is the guide's "grows more confident": by this
  chapter, sure (a design note for the battle sprite's art; no built constant: the Chapter 10 outline's
  `SURGE_ANIM_STAGE` is not in the code).
- **No comedy in a node with her:** Salkhi is on the mountain path; Samira prices nothing on the pier; Vikram's
  breath is on the beach; Edmund's apology is at the headland gun ("Terribly sorry about your gun."); the Harbor
  councillor's statue line is at the water's edge with her elsewhere; nothing in the Turn, the truth or the Song House
  is a joke.

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **Volleys** (`BattleDef.volleys`, `ARMY_VOLLEY_PER`, `VOLLEY_CAP`, `VOLLEY_POWER`, `VOLLEY_BOSS_SHARE` in config; `war.volleys.<battle>` read at creation; opening area events) | nothing | one engine piece (about 40 lines: read the flag, apply N area blows before turn 1, emit events), a test; the whistle dialogue is data | the whistle sets `inspired` on the party for 3 turns (a status the engine has) and the companies' shouts are lines: playable and flat | 0.25 |
| **The Echo battle** (`caona_stand`, `era: 'echo'`) | `BattleDef.era` and `battleParty(..., 'echo')` built and tested; no Echo battle ever started from a map | a battle entry; the Echo zone with `onEcho` starting it after Caona's line; a test that the Echo three at 26 to 28 win it; **the Memory**: a Journal note and a flag (0 engine); the +2 SPD after the release (a `Passive.effect` by flag: 0.1 if wanted now) | the stand as a staged scene without a fight (the anchor and the note kept) | 0.15 (plus the day-1 sim) |
| **The war table** (`harbor_war` at 25 to 27 on three layers: the beach, the gardens' road, the mountain; the village's trails by night) | `mountain_path` at 4 to 6 on `!story.crown_attack` | one table, three layers `if: 'story.war_begun'` (the village's with `story.tide_called, !story.harbor_won`), the Foes page | the mountain's layer only | 0.05 |
| **The bosses** (four Betrayer entries, Hale, `rael_harbor` with four phases and `binds`; Rivera and Jaime reused; Thorne's stage fight) | every shape built (`phases`, `enter`, `binds`, `withdraws`, `protects`, `ally`, `hushed`, `stunned`, `inspired`) | data; **`avoid?: string`** on EnemyDef (one-target blows never aimed at this member: about 15 lines) for "he will not strike Gianna" | the dialogue's word and Azzy's Taunt if he has one; else Rael strikes her like anyone | 0.1 (the field) |
| **A phase that clears standing allies** (Rael's Broken Army: "his guards leave") | `withdraws` at 0 HP only | none: Rivera and Jaime withdraw at 0 HP in most seeds by phase four; if the sim shows them standing, `BattlePhase.leave?: string[]` (about 15 lines) | the phase's text and nothing | 0 to 0.05 |
| **Rael in the four** (`party.rael` for one fight) | `MemberDef`, `leads`, `party.*` | data (his entry, three skills, a passive); a test that the flag is clear at the card and after a lost fight | the fight without him (Hale at x5) | 0.05 |
| **The Turn's two routes** (`war.trust` / `war.strike`, the two bosses, the two truths, two Song House variants, two caney variants) | dialogue | data, written **once from a table** for the shared beats (the truth's five exchanges with their Strike variants as one script with `if`) | none needed | 0 |
| **Stability inputs** (section 4.4) | flags | data | none | 0 |
| **The companies as stage actors from a table** (`company(house)`) | stage cues | one helper in the dialogue file (about 30 lines) and the looks | the captain alone per company | 0.1 |
| **The ships and the gun** (objects by flag, three looks, the chain strip, the longboats) | objects by `if`, `above`, looks | map data on the beach and the village | lines | 0.1 |
| **Crown Officer and Sealbearer** (if Chapter 9 has not landed) | the Chapter 9 outline's shapes | two enemy entries | the marine lieutenant and a musketeer in their place | 0 to 0.05 |
| **`STAGE_PARTY` gains `edmund`** (if Chapter 9 has not) | the set | one word | Edmund placed per scene | 0 |
| **Audio slots** (cannon, chain, conch, the volley) | `audio.config.ts` slots (`drum` exists) | four slots | text lines | 0.02 |
| **The voyage** (`zetwal_xaragua_war`: Chapter 10's) | Chapter 10 builds it | nothing (its last caption is this chapter's) | the built `zetwal_xaragua` | 0 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 11), `MARKS` | `ACT11` in `quests.ts`; `'12'` in `MARKS`; the route to `@chapter11-end`; `?chapter=11`; `XP_PER_OBJECTIVE_BY_CHAPTER` row 11 (rows 9 and 10 first) | none | 0.25 |
| **The day-1 sim** (the eight fights, both routes, both orders, volleys on and off) | `tools/battle-sim.ts` replays a fight at a route marker | the Chapter 10 scratch bot moved into `tests/` with a hand-built level-25 to 28 party (the route cannot reach Chapter 11 until Chapters 9 and 10 land) | the built sim once the route exists | 0.25 |

About **one and a half builder-days** of engine, wiring and sim, of which the volleys (0.25), `avoid` (0.1) and the
sim (0.25) are the only parts that are not data. Nothing here needs a new status, a party-order screen, a region
level, a Stability score, a guest system or a timer. The Echo battle is the engine's own foundation, used for the
first time where the design put it.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts`; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **Rael** | the Turn, the truth (9.1); a member for one fight | Chapter 3's `rael` (battle stance: the boss's, mirrored) | the Claim's doors, the Hearing |
| **Captain Rivera**, **Jaime** | at the longboat; the Strike fight | Chapter 3's | the Hearing |
| **Old Benny**, **Nancy** | the Song House (9.2) | Chapter 3's `benny_old`, `nancy` | the Hearing |
| **Captain-General Hale** | the Regent's champion (Trust) | a violet coat, a boarding axe; `hale` | Chapter 12's hall, if the Regent keeps him |
| **Governor Thorne** | the customs house | built | the *Patience*, or the cellar |
| **Cacique Anaco** | the cellar, the duho | built (`anaco`, a standing look new) | the Claim's seat (the token) |
| **The elders**, **the camp leader**, **the healer**, **the head runner**, **the fisher's boy**, **the canoe fisher**, **the lamp-oil seller** | the camp, the debate, the quests | built | |
| **Hrafn**, **Mibu**, **Prakash**, **Rashid**; the four seconds | the landing's file; the Betrayer variants (one of them) | Chapter 10's | the Claim |
| **Jordyn**, **Joaquin**, the Harbor councillor's sergeant, the Free Brasador sergeant | the companies' captains | Chapters 9, 3 and 10's | |
| **The companies' soldiers** (seven looks, one per house, plus a lying look each) | the files, the wounded | recolours of the built soldier looks | |
| **Old-uniform Crown Marine and Musketeer** (Echo) | Caona's stand | recolours | |
| **Caona**, **young Benny**, young **Patricio** (Echo) | the stand | built | |
| **Crown Marines, Musketeers, Officers, Sealbearers, Hushers, Zealots, Crabs**; the house foes | the war table, the fights | built looks (the Officer and Sealbearer from Chapter 9 or new) | |

Voices: Rael in short public sentences and, by lamplight, in the guide's lines and nothing softer; Benny counting;
Nancy in the register of a house run well; Anaco in one sentence at a time; Thorne exactly as Chapter 2; the camp
leader plain; the captains in their chapters' registers, with one shout each; Hale polite and brief (the Crown is a
court even on a pier). Nobody on the island sounds like Kingsmere except Hale, Thorne and Edmund, and Edmund is on
the right side.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**One.**

**Question 1: On the Strike route, does Azzy stay in the party, or leave until the Claim?**
*Why it reaches the owner:* STORY says only "Azzy is furious"; whether he walks off the pier with his father's
broken army changes Chapter 12's flow (his choice at the Claim is made "on the spot", renounce / share / Challenge,
and a brother who left in anger is a different brother at that moment) and the Hearing's witnesses.
1. **(Recommended) He stays, furious.** One line on the pier ("You had him... and you chose him."), silence to his
   father, and he is in the party to Eightgate; his anger colours the Claim's choice (Chapter 12's outline gives the
   Challenge route more weight on `war.strike`) without removing him from it. *Reason:* the owner's "nobody dies in
   his fights" and "Azzy chooses Gianna" are the pattern; a departure would make the Strike route punish the player
   with a lost companion in the war's last fight and leave Free Brasador leaderless at the Claim.
2. He leaves with Rael's ships and rejoins at Eightgate's gate (Chapter 12 opens with his return).
3. He leaves and is met only at the Claim, where he Challenges (the dark route made likelier by Strike).

**Near-misses, resolved as Claude's calls (if the second review disagrees, either becomes a pop-up with the
recommendation first and the build goes ahead on it):**

- **Old Benny and Nancy come on Rael's ships and land after the Turn.** FAMILY.md settles the role and not the road;
  no other road puts two old people from a guarded keep on this island without a scene Chapter 10 does not have.
  *Recommendation:* keep; on Strike, Benny stays as the Hearing's witness.
- **The chain's post is the Echo's anchor, so Rael's ships can only come in because of the Echo.** It makes the
  Harbor Turn's geography the memory's doing, which is the design's "the place where the debt began" made
  mechanical; it changes no beat. *Recommendation:* keep.

The Claude's calls, each with its reason:

- **The fleet lands on the Canoe Beach, not the pier.** *Reason:* Anaco's built line (the chain between the two
  nearest ships) and Chapter 2's escape ("the marines watch the harbor mouth, not the cliffs") make the beach the only
  honest landing; the pier is the war's last ground, not its first.
- **Three stages are the headland, the customs house and the pier; the betrayer's flank is on the beach after the
  headland; the Turn is at the pier's end.** *Reason:* COMBAT 11's "three linked battles" with the bosses between;
  the island's geography walked the short way; the flank where a ship can ground.
- **Thorne is stage two's named fight with a Yield, not a boss.** *Reason:* CAPITALS' "boss arena" and the Chapter 2
  seed ("The Charter stands"); the chapter's bosses are COMBAT's three; a Governor at 27 with his three built moves is
  the right size for a stage.
- **The volleys are a capped pool spent by the whistle before each named fight, shown as the companies answering
  by house, and refused on the Strike route's pier.** *Reason:* COMBAT 11's rule given a cap and a choice; the
  Muster's ledger made visible as something the player spends; the Strike route's first cost shown.
- **Armies are stage actors and placed pairs from one table, never crowds.** *Reason:* the Chapter 10 review's
  finding; the engine's crowds cannot stand or march.
- **Rael is a member for one fight on Trust, never on the roster.** *Reason:* STORY's "guest only"; the engine's
  `leads`; the Hearing needs him across the room from her.
- **The Echo scene is one: Caona's stand as the Echo battle, with the capstan's pin as the anchor; the Memory is a
  note and a route now, the +2 after the release.** *Reason:* the plan's "every chapter keeps its Echo puzzle" and
  COMBAT 11's battle, done as one scene; the Chain Bridge's pin turned round.
- **Two new required quests, *The Ninth Thumbprint* and *Harbors Lie*; the debate is the elders' choice, mediated
  by Yari.** *Reason:* the five built quests are done; the thread's ninth door belongs where the ledger is read; the
  count is CAPITALS' job made a scene and the Turn's fairness; STORY 2 put the elders' choice here.
- **The truth is five exchanges and one choice of answer; the Ash Road Accounts are read with the two halves as the
  key.** *Reason:* the guide's list and lines, kept; "shown": the Locket and the signet on the page.
- **`XP_PER_OBJECTIVE_BY_CHAPTER` row 11 = 50; the bosses 220 / 160 / 140; the turned route pays the flank's XP
  through its objective.** *Reason:* section 5's sums; a three-level chapter; no punishment for the exposed Muster.
- **Elodie is not in the chapter.** *Reason:* the Chapter 5 and 10 outlines keep her at Eightgate "till the Crown
  lets her go"; the Regent retreats to where she is, which is Chapter 12's first picture.
- **Names are proposals** (Hale from COMBAT; the captains from Chapter 10; the war table's groups by role); the build
  names people by role until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapters 6 to 10's estimates:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the landing, the companies, the resistance | ~50 | 1 | ~35 | |
| The headland gun; sails behind us (the flank, or the house that stayed) | ~80 | 0 | ~30 (x4 variants: ~20 more written) | 2 (1 if turned) |
| The gardens' road, the mountain, the hill camp, the plan | ~160 | 3 | ~25 | 0 to 1 ambush |
| The debate, *Harbors Lie* (the lookout), *The Ninth Thumbprint* (the cave mouth, the picket), the conch | ~260 | 6 | ~70 | 1 + 0 to 2 ambushes |
| The tide: down the mountain, the village by dusk, the customs house (Thorne), the cellar (Anaco) | ~180 | 5 | ~40 | 1 + 0 to 1 ambush |
| The pier: Caona's stand (the Echo), the chain, the pier assault | ~60 | 2 (the Echo) | ~30 | 2 |
| The Turn; the flagship or the vanguard | ~20 | 0 | ~25 (x2 routes) | 1 |
| The truth; the Song House; the caney; the card | ~90 | 3 | ~60 (x2 routes: ~30 more written) | |
| **Chapter 11** | **~900** | **20** | **~365 written, ~300 heard** | 7 to 8 named (6 to 7 if turned), 1 to 4 ambushes |

About **40 to 45 minutes** as played, against the plan's 30: the war is seven fights, and a fight is two to four
minutes. The ten minutes over are the two quests and the debate the plan requires; if the second review wants it
nearer thirty, the cuts are in section 16 (the pier assault folds into the flagship fight's first phase; *Harbors
Lie* becomes a line at the camp), and the Echo battle and the Turn are the last things cut.

---

## 14. Continuity into Chapter 12 (Eightgate, The Claim; 28 to 30, twenty minutes; then the Hearing)

- **The lead:** the Regent has retreated to Eightgate (on the *Patience*, with Thorne if spared; the fleet struck or
  escaped by route); Anaco: "Someone must go and stand on it." The voyage from Yucayeque to Eightgate (Chapter 5's
  Gold Road is by land from Al-Doria; Chapter 12's outline sets a sea route to the Seat's coast or the Gold Road from
  Zetwal). `?chapter=12` starts where Chapter 12's outline puts the arrival.
- **The party leaves with:** the nine (Rael is **not** on the roster: `party.rael` false), Salkhi, **level 28** (29
  for a wanderer from a 26 start), the Echo party unchanged, gold about 2,500 to 4,500, key items plus **the conch
  token** (Xaraguá's seat: Se-5's fourth), the Ash Road Accounts **read** (`clue.ash_road_read`), Hale's axe (Trust),
  the companion's charm (if betrayed); flags `story.war_begun`, `story.landed`, `story.headland_won`, `war.flank_done`
  (`choice.flank_spared|bound` if betrayed), `story.camp_reached`, `debate.xaragua_harbor.*`,
  `side.ninth_thumbprint.done` (the thumbprint count: **nine**), `side.harbors_lie.done`, `story.tide_called`,
  `story.village_reached`, `story.thorne_taken` (`choice.thorne_spared|broken`), `story.anaco_freed`, `ally.xaragua`,
  `anchor.chain_post`, `story.chain_dropped`, `story.pier_won`, `war.turn_made`, **`war.trust` or `war.strike`**,
  `story.harbor_won` or `story.fleet_escaped`, `choice.truth_answer`, `story.wounded_sheltered`,
  `story.regent_retreated`, the `stability.*` inputs (4.4), `army.*` as they stand, `act11.complete`.
- **What Gianna believes:** the truth (`belief.rael_traitor` cleared; `belief.rael_truth`). She has not forgiven him
  and has not been asked to. Azzy's state by route (section 12). Anissa heard it. Benny is on the island (Strike) or
  with Rael's ships (Trust).
- **What the realm knows:** the harbor is Yucayeque's (Trust) or held by Yucayeque with the Crown's fleet intact at
  sea (Strike); seven houses fought under one whistle; one captain was bought and arrested, or one house turned; the
  Regent did not come up the pier himself; the Charter "stands, it is written" by Thorne's last word, and the oath
  was said aloud by the cacique. The Hearing's witnesses are placed: the treasurer's family (Chapter 3's seed), the
  Ardencian rebels (Amanda), the cells (the ninth thumbprint), Elodie, Azzy, Anissa, old Benny, old Patricio.
- **What Chapter 12 reads:** `war.trust` / `war.strike` for the Claim's weight and the Regent's register ("You held
  a pier. I hold a Hall."); `stability.*` for the ending's score; `army.*` and the leftover volleys for "allied houses
  kept"; the four tokens (Se-5) for the seats at the Claim; `ally.xaragua` for Cacica Yari's seat in the Just Throne.
- **S-SEA (the Seventh Ribbon, after the release)** gains its last testimony: Rael's, read into the Ash Road.
- **Nothing built in Chapters 1 to 10 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`harbor_war`), the Chapter 2 maps' Chapter 11 objects (all on `story.war_begun` and later, so Chapter 2's tests
  replay unchanged), `xaragua.ts`'s war branches on built people (Thorne, Anaco, the camp leader, the elders, the
  healer, the head runner, the fisher's boy, the canoe fisher, the lamp-oil seller, the cellar door's closed line,
  the customs sign), `battles.ts` (the new entries; Thorne's reused with a second battle id), `MEMBERS` (Rael's
  entry; `party.rael` never true outside one fight), `config.ts` (the volley numbers, the XP row), `stage.ts`
  (`edmund` if not there), each behind a test that Chapters 1 to 10's content replays unchanged.

---

## 15. Risks

- **No sim before the outline, and three bosses.** The numbers in section 5 are targets from the Chapter 9 and 10
  sims' scaling, not measurements. Day 1 builds the hand-made level-25 to 28 party and runs all eight fights, both
  routes, both active orders, volleys on and off, before any dialogue is wired; the gates are written in section 5.
- **The Echo battle is the engine's first.** `battleParty(..., 'echo')` is tested but no Echo fight has started from
  a map, paid XP to the Echo three, or returned to the present on a loss. Day 1 wires the stand before anything else
  on the pier and tests a loss (the goddess, Rise at the zone's edge in the present, the anchor not set).
- **The volleys touch the one path every fight uses.** The engine piece is small and behind a test; `battle.test.ts`
  must replay Chapters 2 to 10's fights unchanged (no `volleys` on them) before it lands. The fallback (`inspired`) is
  playable.
- **Twenty-one stage actors in one scene.** The landing's file is the biggest stage scene written; the stage runner's
  limit is unknown. The fallback (one actor per company) is a table change, not a rewrite.
- **The Turn is the game's most important choice and the easiest to make a cutscene.** Rael walks up the pier and
  says four sentences; the choice is two entries; the routes are two fights and two truths; Anissa's hinge line is
  hers; Benny walks up among the wounded. If the build runs short, the Turn keeps its walk, its silence and its two
  entries, and the truth keeps its five exchanges; everything else on the pier can lose a line.
- **The locked rule, both sides of the Turn.** Before `war.turn_made` nothing in the chapter may say he is good (the
  ninth thumbprint's carrier is a walk and a coat; the lookout's sails are a count; the content test holds every
  pre-Turn line to the forbidden list). After it, the family may speak, and the reviewer prompt asks for a human read
  of Rael's, Benny's and Azzy's lines against the guide's "not redeemed in the moment".
- **Anissa on the pier.** She is behind Gianna at the Turn and says nothing until the signet; the flank's Husher is
  the chapter's only Seize and it is the built Gianna-steps-in path; the Echo battle is not hers; no Salkhi, Samira,
  Vikram or Edmund line shares a node with hers; the Song House has no joke in it.
- **Chapters 9 and 10 are not built.** Everything here except the voyage's captions and the ledger's flags can be
  built from the Chapter 10 outline's section 14 state on a hand-written start save; the betrayer and the armies are
  forced by flag in the route test (eight variants: four houses x two Muster routes, each played to the card on both
  Turn routes: sixteen short routes, two in the browser). If the Chapter 9 or 10 reviews move the active order, the
  armies' numbers or the whistle's holder, sections 1, 4 and 5 move with them and nothing else.
- **Thorne twice.** A boss who was beaten at 7 and comes back at 27 as a stage fight can read as padding; he is the
  Charter's voice and the cellar's keeper, his register is unchanged to the word, and the Yield is the player's
  (COMBAT's Spare for him, finally offered). If the reviewer finds him padding, he is the first cut (section 16) and
  the customs house is a placed fight without him.
- **The plan's dates.** Chapter 11 is Nov 10 to 13 (four days) with Chapter 12 and the Hearing from Nov 13 and the
  whole-game pass from Nov 16; this outline is sized to 3.5 to 4 days (section 16) and names its cuts, and the
  milestone note on Nov 13 should say which were used.
- **Faith on the map.** The Four Hands are a line in the debate and the Song House is a library; the Quiet Crown is a
  veil on a beach who walks into the sea; no real faith is shown as a cult; the fluent check (Nov 18) has "cacica" and
  "¡Firmes!" (both in the realm's tongues already) and no new Taíno word (the conch token is "the conch" in text; the
  word *guamo* stays on the reviewer's list with S-XAR).

---

## 16. Build plan (small steps, each checked before the next; sized to 3.5 to 4 builder-days, Nov 10 to 13)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 11 rewritten to this outline;
   `CAPITALS.md` 2 (the war table's flag and three layers, the beach's door, the pier's zone, the chain post, the
   Song House's hamacas); `SIDE-QUESTS.md` (the two new quests, the thumbprint thread's ninth); `PUZZLES.md` (the pier's
   pin, M-XAR-3); `COMBAT.md` 11 (the volleys' rule as built), 13.2 (the Harbor rows), 13.3 (#3b, #8, #9 as built;
   Thorne's second fight); `FAMILY.md` (Benny's, Nancy's, Jordyn's, Joaquin's rows marked built with the Claude's
   calls); `QUEST-BUILD-GUIDE.md` 5.6's Harbor Turn marked built; Hale's, the field gun's, the *Patience*'s, Ardencia's
   ships' and the lying soldier's prompts into `ART-PROMPTS.md`. **The hand-made start save** (the Chapter 10
   outline's section 14 state with the review's fixes; if Chapter 10 has landed, `?chapter=11` from its route).
2. **Engine and data (Opus, half a day):** `volleys` and its config (first), `avoid` (second), the four Betrayer
   entries, Hale, `rael_harbor` with four phases, Thorne's stage battle, the Crown Officer and Sealbearer if absent,
   `harbor_war`, `caona_stand` with `era: 'echo'`, Rael's `MemberDef`, the XP row (rows 9 and 10 first), the audio
   slots; **the sim** (the Chapter 10 scratch bot into `tests/`, the eight fights at 25 to 28, both routes, both
   orders, volleys 0 and 4): the gates in section 5 pass or the scales move (Rael x6 to x5; the Betrayer x5 to x4;
   the stand's third marine dropped).
3. **Maps (Sonnet):** the beach's war objects (the gun with three looks, the fleet's hulls by house, the flank's hull,
   the north door, the landing spawn, the files' positions), the conuco's east door and road layer, the mountain's war
   layer and the lookout's tally, the camp's hamacas and rock, the cave mouth's jars, the village's *Patience*, chain
   strip, capstan, Echo zone, black sails, longboats and night layer, the customs house's and cellar's war placements,
   the Song House's hamacas, the caney's variants; validated (the pier zone walkable in both eras); Chapter 2's tests
   green.
4. **Content (Haiku and Sonnet, in parallel):** the company table (`company(house)`: ids, looks, ranks, shouts), the
   `DebateDef` *Won by seven navies* (three rounds, the Reason books), the Journal notes (*The fleet*, *Harbors lie*,
   *The Ash Thumbprint (9 of 9)*, *Caona's stand*, *The Ash Road, read*, *The Song House*), the two books' second
   looks, the looks (section 11), the Foes page rows, the war branches on built people.

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/xaraguaWar.ts` staged from the beats, in this order
   so an interruption leaves a playable chapter: the deck and the landing (the files from the table); the headland;
   the flank in four variants and the turned house; the camp and the plan; the conch and the descent; Thorne and the
   Yield; the cellar; the pier's Echo (the stand, the pin, the chain); the pier assault; **the Turn**; Trust (Hale,
   `party.rael`); Strike (`pier_rael`); the truth (one script, the Strike `if`s); Benny and Nancy; the Song House; the
   caney and the card. `ACT11` in `quests.ts` with hints and goals, `echoGoals` on the pier.
6. **The quests (early afternoon):** *The Ninth Thumbprint* (the camp, the cave mouth's jars and walker, the picket,
   the fisher), *Harbors Lie* (the boy, the lookout's count, the sails), the gate's wording on the head runner.
7. **The puzzle files and tests (late afternoon):** `puzzles/xaragua_pier/`; the fights' bot tests at 25 to 28 in
   both orders with volleys 0 and 4; a lost `caona_stand` and a lost `flagship_hale` (the flags clean); quests, guide,
   debate, side-quest, maps, stage (twenty-one actors), and content tests green; the content tests: no Salkhi, Samira,
   Vikram or Edmund line in a node with an Anissa line; no pre-Turn line with "good", "innocent", "feeds", "the
   arrows" or "thumbprint" outside the quest's note; no line in the Turn or the truth with a joke marker; `party.rael`
   false at the card on every route.
8. **The route (evening):** Chapter 11's route from its start to `@chapter11-end`, sixteen short variants (four
   houses x betrayed / turned x Trust / Strike), two in the smoke test; `chapter-starts.ts` with chapter 12;
   `act.test.ts`; `tools/level-curve.ts` run and the dials set (section 5); the smoke test's Chapter 11 section with
   screenshots of the fleet on the beach's water, the companies' file on the sand, the gun turned, the hull behind
   the fleet and the captain on the sand (or the second with the three-quarter company), the camp with the elders at
   the fire, the lookout and the black sails named, the jars at the cave mouth and the coat walking off, the conch,
   the village by dusk with the *Patience* and the chain, Thorne at his desk, Yari on the cellar stair, Caona on the
   pier, the chain running out, Rael walking up the pier, the two entries, Hale at the pier's end or Rael with his
   guards, the Locket and the signet dark, old Benny on the pier, the Song House with the lamp at the row's end, the
   caney and the token, at 844 x 390 and 390 x 844.

**Day 3 (and the morning of day 4 if needed):**
9. **Full browser test:** the chapter end to end on a phone, both Turn routes; one betrayed and one turned Muster in
   the browser (the other fourteen headless); the stand lost and won; the flank lost (Game Over returns to the sand);
   Rael's fight lost (the goddess, the choice kept); a save on the hill, at dusk and on the pier; `npm test`,
   typecheck, lint, build; the reviewer prompt in `reviews/reviewer-prompts/` (the Chapters 10 to 12 batch, about Nov
   17); the milestone note with the level statement, the volley rule and the Stability inputs; then Chapter 12's
   outline, which overlaps with this build from day 2.

**If day 2 runs over, cut in this order:** the village's night ambush layer (the trails quiet), the Song House's
captains' count (Benny's and Nancy's lines kept), Thorne's fight (the customs house a placed stage fight; his Yield
kept as a dialogue on a beaten officer), the pier assault folded into the flagship fight's first phase (Strike keeps
its vanguard), the lying soldiers (the stretcher walkers only), the deck's seven lines (Anissa's and Yari's kept),
the headland gun's third look, *Harbors Lie*'s lookout (the count said at the camp by the boy; the sails still named),
the betrayer's charm (the lead kept). **Never cut:** the landing's file by house, the whistle and the volleys shown,
the flank with the companion leading, the elders' debate mediated by Yari, the ninth thumbprint's walk-off, Yari on
the cellar stair, Caona's stand with the pin, the chain running out, Rael's walk and the two entries, the signet
dark and Anissa's line, the truth's five exchanges, old Benny among the wounded, the card.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Nov 8 decision date (this chapter is the second build after it, and its cut list is written for the
"all twelve plainer" branch); the Dec 1 story questions, now needed by early November (this chapter answers the
Harbor Turn's shape, Benny and Nancy's road and the ninth thumbprint as Claude's calls; question 13, Patricio and the
marriage, is still open and Benny's "I did not say for whom" does not touch it; the Hearing's witness list is the
next one to settle); the fluent-speaker check (Wed Nov 18: no new language here; *guamo* stays on the list).

## Decisions after the second review (Oct 22)

- **Claude's call:** the build takes every fix in section 3 of `2026-10-22-chapter11-outline-review.md`:
  - **The Harbor Turn:** it asks its question fairly. The signet glows when Rael lies in public, the clue Chapter 3 set
    up.
  - **The token:** it keeps its Chapter 3 rule, glowing on a true sentence.
  - **Difficulty:** the fights are retuned against tier-24 gear, so that Strike is not the easier route.
  - **Volleys:** capped so they soften a fight without clearing it.
  - **Strike:** it closes the war too.
  - **The chain:** it fits the built harbor map and Anaco's line.
  - **The thumbprint ledger:** it lists the right nine doors.
  - **The other fixes:** taken as written.
- **Owner decision (Oct 22): stays.** On Strike, Azzy stays in the party, furious, and his anger
  colours the Claim.
