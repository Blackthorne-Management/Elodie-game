# Side quests

*Design pack, Oct 14. **Every quest here is a proposal** unless it says "built". Rules kept from the guide and the
owner: **Chapter 1 side quests have no fighting** (owner decision, Oct 14); every hub has a hidden rebel safehouse
(guide 5.4); puzzles follow guide 6.2 (solvable from what is visible, under 5 minutes, Anissa's three hints); real
faiths are never shown as cults (guide 7.3); vendor languages are checked by native speakers (guide 8).*

## How side quests work

**The quest log (owner, Oct 14: Skyrim-style).** The Journal gets a **Quests** tab with two lists, **Main** (the
chapter objectives, as built in `quest/src/data/quests.ts`) and **Side**, each split into *Active* and *Completed*.
Selecting a quest shows: its title, the giver and where they stand, a short paragraph that grows as stages are done
(each stage adds a line; done stages stay, struck through), the current objective in bold, the reward if the giver
named one, and a **Track** toggle that puts the current objective on the minimap. A new quest pops a small banner
("New quest: The Seventh Stone"); a finished one a banner and the reward. Quests that can no longer be finished (for
example after the War of the Harbor) are marked *Closed* and count against Accord Stability only if they were
accepted (guide 5.7: "unresolved side quests").

**Data shape** (fits the built `QuestDef` with objectives, hints and `done` conditions): one `QuestDef` per side quest,
an `opens` condition (the chapter flag and any trigger), stages as objectives, and the reward paid once through the
built `side.<quest>.rewarded` flag.

**Reward scale** (shared XP, gold and pillar points per city):

| Chapter | XP | Gold | Pillars |
|---|---|---|---|
| 1 | 25 to 40 | 30 to 80 | +1 |
| 2 | 60 to 100 | 60 to 150 | +1 to +2 |
| 3 to 4 | 100 to 180 | 120 to 300 | +1 to +2 |
| 5 | 150 to 220 | 200 to 350 | +1 to +2 |
| 6 to 8 | 200 to 320 | 250 to 500 | +1 to +3 |
| 9 to 10 | 300 to 420 | 400 to 700 | +2 to +3 |
| 11 to 12 | 400 to 500 | 600 to 900 | +2 to +3 |

Secret-item quests (number 4 in each capital) also give the secret item (`SECRET-ITEMS.md`).

**Threads across capitals:**
- **The Overdue Books:** The Overdue Shelf (built, Chapter 1: the ferryman's book, the soup vendor's and Anicette's
  Volume Two), then Se-1 (*Ash Wars Gossip* Volume One).
- **The four Ash Wars accounts** (guide 5.8): the Zetwal temple record (built), the Kuroshi spy ledger (K-2), the Crown
  chronicle (Al-2), Anicette's recollection (Chapter 10). Reading all four gives +3 Concord and a line at the Hearing.
- **The ash thumbprint:** every rebel safehouse has the same small grey thumbprint on its door, the Ash Ledger's mark.
  Finding five unlocks a Journal note "Someone is feeding the realm" (proposal), a fair-play clue to Rael.

## Catalogue

| ID | Quest | Capital | Opens | Level band | Fights? | Echo? |
|---|---|---|---|---|---|---|
| Z-1 | Soup of the Free | Pòdlimyè | Ch. 1 | 1 to 3 | no | yes |
| Z-2 | Tides of the Southern Reach | Pòdlimyè | Ch. 1 | 1 to 3 | no | no |
| Z-3 | The Lonely Cutter | Pòdlimyè | Ch. 1 | 1 to 3 | no | no |
| Z-4 | The Seventh Stone (secret; built Oct 27, optional) | Pòdlimyè | Ch. 1 | 1 to 3 | no | yes |
| Z-5 | Bread With No Debt (safehouse) | Pòdlimyè | Ch. 1 | 1 to 3 | no | yes |
| Z-6 | Muskets in the Cane | Pòdlimyè | Ch. 10 | 22 to 25 | yes | yes |
| X-1 | Cut Nets | Yucayeque | Ch. 2 | 3 to 6 | yes | no |
| X-2 | Oil From a Stranger (safehouse) | Yucayeque | Ch. 2 | 4 to 7 | optional | no |
| X-3 | The Hutia's Hoard | Yucayeque | Ch. 2 | 3 to 8 | no | yes |
| X-4 | Where the Canoes Sleep (secret) | Yucayeque | Ch. 2 | 5 to 8 | yes (cave) | yes |
| X-5 | Medicine for the Cacique | Yucayeque | Ch. 2 | 5 to 8 | yes | yes |
| X-6 | The Ninth Thumbprint (safehouse; built Oct 22, required) | Yucayeque | Ch. 11 | 26 | yes | no |
| X-7 | Harbors Lie (built Oct 22, required) | Yucayeque | Ch. 11 | 26 | no | no |
| X-8 | Whose Harbor? (the elders' debate; built Oct 22, required) | Yucayeque | Ch. 11 | 26 | no | no |
| A-1 | Appraise This | Bab al-Dhahab | Ch. 4 | 11 to 14 | no | no |
| A-2 | The Missing Saffron | Bab al-Dhahab | Ch. 4 | 11 to 14 | yes | no |
| A-3 | Sweet Water (safehouse) | Bab al-Dhahab | Ch. 4 | 11 to 14 | no | yes |
| A-4 | The Uncashed Note (secret) | Bab al-Dhahab | Ch. 4 | 11 to 14 | no | yes |
| A-5 | Invoice for the Crown | Bab al-Dhahab | Ch. 4 | 12 to 14 | optional | no |
| Ar-1 | Bread at Night (safehouse) | Cenizal | Ch. 3 | 8 to 11 | optional | no |
| Ar-2 | The Treasurer's Daughter | Cenizal | Ch. 3 | 8 to 11 | no | yes |
| Ar-3 | The Elders' Feast | Cenizal | Ch. 3 | 9 to 11 | yes | no |
| Ar-4 | The Old Lord's Errand (secret) | Cenizal | after Ch. 3 | 11 to 13 | if seen | yes |
| Ar-5 | The Arrows Missed | Free Brasador camp | end of Ch. 3 | 11 to 13 | no | no |
| Se-1 | Volume One | Eightgate | Ch. 5 | 14 to 15 | no | no |
| Se-2 | Four Voices (built Oct 22: the required debate) | Eightgate | Ch. 5 | 14 to 15 | no | no |
| Se-3 | Deserters' Road (built Oct 22, required) | Eightgate | Ch. 5 | 14 to 16 | yes | no |
| Se-4 | The Unknotted Ribbon (secret) | Eightgate | Ch. 5 (ends Ch. 12) | 14 to 30 | no | yes |
| Se-5 | A Seat for Every House (stage 1 built Oct 22, required) | Eightgate | Ch. 5 (ends Ch. 12) | 14 to 30 | no | no |
| S-1 | Salkhi Has Opinions (after the release; its lines are Salkhi's in the story) | Ordvik | Ch. 6 | road tier | no | no |
| S-2 | The Fleet for Sale (folded into the price scene, Oct 22; the race after the release) | Ordvik | Ch. 6 | road tier | no | no |
| S-3 | The Winter Stores (safehouse; built Oct 22, required) | Ordvik | Ch. 6 | 16 | yes | yes |
| S-4 | The Cairn of Nine Riders (secret; after the release, the cairns placed) | Ordvik | Ch. 6 | road tier | yes (plateau) | yes |
| S-5 | Grandson of the Steppe (built Oct 22, required) | Ordvik | Ch. 6 | 16 | optional | no |
| K-1 | Definitely Not a Spy | Kirinoura | Ch. 7 | road tier | no | no |
| K-2 | The Spy Ledger | Kirinoura | Ch. 7 | road tier | if seen | yes |
| K-3 | Lanterns for the Lost (safehouse) | Kirinoura | Ch. 7 | road tier | yes | no |
| K-4 | The Letter in the Floor (secret) | Kirinoura | Ch. 7 | road tier | no | yes |
| K-5 | Ashes of the Temple | Kirinoura | Ch. 7 | road tier | no | yes |
| J-1 | Win Every Argument | Agnipur | Ch. 8 | road tier | sparring | no |
| J-2 | The Lamp Relay | Agnipur | Ch. 8 | road tier | no | yes |
| J-3 | The Anonymous Oil (safehouse) | Agnipur | Ch. 8 | road tier | optional | no |
| J-4 | Oil for the Little Lamps (secret) | Agnipur | Ch. 8 | road tier | no | yes |
| J-5 | Jackals on the Salt Road | Agnipur | Ch. 8 | road tier | yes | no |
| Al-1 | Terribly Sorry | Kingsmere | Ch. 9 | 21 to 24 | no | no |
| Al-2 | The Crown Chronicle | Kingsmere | Ch. 9 | 21 to 24 | if seen | yes |
| Al-3 | The Purge List (safehouse) | Kingsmere | Ch. 9 | 21 to 24 | yes | no |
| Al-4 | The Clock That Waits (secret) | Kingsmere | Ch. 9 | 22 to 24 | no | yes |
| Al-5 | Tea With Lady Rosalind | Kingsmere | Ch. 9 | 21 to 24 | no | no |

"Road tier" means the level of that region by visit order (15 to 17, 17 to 19 or 19 to 21; `COMBAT.md` 6).

---

## Pòdlimyè (Zetwal)

**Built (owner approved, Oct 14; the debate added Oct 18):** the Chapter 1 side quests in `quest/src/data/sideQuests.ts`, with their
lines in `quest/src/data/dialogue/zetwal.ts`. None has a fight.
- **The Overdue Shelf** (senior archivist, Temple Archive): get back the ferryman's *Tides of the Southern Reach*,
  the soup vendor's *Ninety Ways With Pumpkin* and Anicette's *Ash Wars Gossip, Volume Two*, in any order. Anicette
  asks one question first: how many dead the temple healers counted at Cendre (you must have read the temple record).
  Volume Two then joins the Tales shelf, margins and all. 60 gold, 30 XP (50 until the levels pass, Oct 22), +1 Influence. (The approved Echo step,
  Volume One on the shelf fifty years ago, was dropped: the Ash Wars were 25 years ago, so the book did not exist yet.)
- **Soup for the Cousins** (soup vendor, plaza): carry bowls to the old neighbor, the town guard and the ferryman.
  Teaches the minimap and tap to talk. 3 Clay-pot soups, 30 gold, 25 XP (40 until the levels pass), +1 Influence.
- **A Name in the Cane** (cane cutter, Cane Road): his grandmother ("Grann") is on no name stone. Read the stones
  (a line for "the cutters whose names the Crown did not keep"), use the Echo by the east gate to meet her young
  (Rose-Aimée, called Forty-One by the overseer), write her into Mother Solange's list in the Archive, tell him.
  Sun-stitched charm, 30 XP (50 until the levels pass), +1 Influence. (Grandmother, not great-grandmother: fifty years back she was young.)
  **Where he stands (decision A, Oct 19):** on the Cane Road until the lamp is lit (the quest can still be taken
  early, from the war room on); after the lamp, at the name stones on the Temple island (he crossed the Chain Bridge
  to hear the names, and listened for one that never came), where accepting the quest reads the stones with him on
  the spot; and back on the Cane Road, with his warning, when Gianna comes home at the end of Chapter 2. His lines
  at the stones are written for after the reading and keep his pointer to the veiled woman by the old mill; told
  her name there, he walks up to the lamp and says it. The quest's start, its last step, its place in the log and
  Anissa's nudge follow him (`moved` in `sideQuests.ts`).
- **A Question of Faith** (Gaze keeper, the lawn below the plaza; owner decision, Oct 18): hear the debate on faith,
  then argue all three rounds or mediate. 20 XP (30 until the levels pass). Required before Yari sails, like the other three.
- **The order (Batch D, Oct 19).** All four must be done before Yari sails (owner decision, Oct 18). The Journal
  leads through them the short way: the island first (the cutter at the stones, the archivist, the temple record),
  then, after the Hall and the Cane Road, the city's errands on the way back, then the island again.

Z-1 to Z-3 below were the design pack's first proposals for the same three slots; they stay as candidates for later
chapters (Z-3, The Lonely Cutter, fits the return in Chapter 10).


Z-1 to Z-5 open in Chapter 1 and have **no fighting**. Most can be done before or after the Locket; the ones that need
the Echo open after `item.sun_locket`. All can be finished in the Last Evening (with Yari) before leaving.

### Z-1 Soup of the Free
- **Giver:** the soup vendor on the plaza (built NPC). **Accept:** talk to her after `story.elodie_left`: "The festival
  pot tastes wrong this year. My grandmother's recipe had something I cannot name."
- **Steps:** 1) Ask the Echo cook in the plaza camp (built NPC) what went into the Marshal's soup; he names "Lord
  Benny's peppers, a squash from the cane edge, and lime". 2) Buy a lime at the grocer. 3) Pick a squash at the edge of
  the Cane Road (peaceful in Ch. 1). 4) In the Echo, ask the Brasador cook's helper for the pepper; he says the seeds
  were planted behind the Limyè house (an anchor is not needed: the plants are already there in the present, grown
  wild). 5) Bring all three to the vendor.
- **Echo use:** information from the camp cook (the recipe), then finding the pepper plant his words point to.
- **Reward:** 60 gold, 35 XP, 3 *Soup of the Free* (heals the whole party 25%), +1 Influence (Zetwal).
- **Why:** the pumpkin soup eaten in Haiti every New Year's Day to celebrate independence is the inspiration (to be
  described in a respectful line, checked by the owner's family).

### Z-2 Tides of the Southern Reach
- **Giver:** the junior archivist's own ledger: the built book *Archive Ledger: Overdue*. **Accept:** read that book
  in the Temple Archive.
- **Steps:** 1) Ask the ferryman (built NPC) for *Tides of the Southern Reach*; "The sea has it now." 2) Ask the island
  fisher; she saw the ferryman use it to prop up a crate. 3) Search the harbor crates (three to check; the right one is
  marked with tide tables chalked on its side). 4) Return it to the archivist.
- **Reward:** 40 gold, 25 XP, the book on the shelf (a 14th Zetwal book, +1 Influence when read), and the ferryman's
  discount (the Carriage Guild fare from Zetwal is halved for the rest of the game).

### Z-3 The Lonely Cutter
- **Giver:** the cane cutter (built NPC; on the Cane Road, and at the name stones after the lamp) mentions the veiled
  woman at the old mill (built). **Accept:**
  after the lamp lights (`story.anissa_woke`), a young cutter named **Ti Jak** (proposal) is missing from work.
- **Steps:** 1) Find Ti Jak at the mill with the veiled woman (the built road watcher). 2) A conversation, not a
  fight: she offers him bread and his debt paid. Gianna can use **Compassion** (he lost his mother last year; say her
  name with him), **Reason** (needs the built book *A Quiet Crown Tract* read: "Ask who holds the debt now") or
  **Scripture** (the Gaze: "she remembers you; you are not alone"). Any one of the right two works; the wrong one
  makes the watcher smile and Ti Jak hesitate (try again). 3) Walk Ti Jak home to the plaza.
- **Reward:** 50 gold, 30 XP, +1 Influence and +3 Concord (Zetwal). Anissa speaks to Ti Jak, her first line to a
  stranger (proposal: a small step in her arc).
- **Note:** the recruiter is a sincere, unsettling person, not a monster (guide 7.3: loneliness and debt, not
  caricature).

- **Built (Oct 22; Chapter 10, the outline 7.2 rewritten around an absence, the second review's 3.16; Claude's calls;
  required):** the veiled woman is gone (she was the Hushed, beaten in Chapter 9). The cane cutter says Ti Jak has not
  come to work; he sits alone at the mill's cold hearth ("She said she'd come back."). **Compassion** works if the
  party knows his mother's name (Odile, from Mother Solange's list, or the Chapter 1 cane name recorded); **Reason** if
  they hold Chapter 9's purge list (her debt went with her; the *Quiet Crown Tract* could not be read when this was built: the
  `hall_records` shelf id bug, fixed on Oct 22 with the Chapter 11 build, Zetwal's shelf now `hall_harbor_records`); **Scripture** is "Not yet." Anissa sits down beside him. Reward 60 gold, +1 Influence
  (Zetwal), +3 Concord; no XP (moved to the story's steps). Closes when the fleet sails.

### Z-4 The Seventh Stone (secret item)
- **Giver:** the mourner on the Temple Island (built NPC). **Accept:** talk to her after `story.anissa_woke`.
- **Steps, puzzle and reward:** see `SECRET-ITEMS.md` 1 and `PUZZLES.md` (S-ZET). Solange's Quill and the skill *Say
  Their Names*; 80 gold, 40 XP, +1 Influence (Zetwal). **No fighting.**
- **Built (Oct 27; secret and optional; details and Claude's calls in `SECRET-ITEMS.md` 1):** the mourner (after the
  lamp: "Six of them do. The seventh is blank"), the first reading in the temple's memory, the sun carved on the
  seventh stone, the stones in the reading's order, the drawer under Solange's plinth. Solange's Quill (its skill *Say
  Their Names* while worn), 80 gold, 30 XP (Claude's call: Chapter 1's curve), +1 Influence (Zetwal). Never a mystery
  quest and never on the arrow (a `secret` quest); closes when the fleet sails in Chapter 10. Ported to the demo.

### Z-5 Bread With No Debt (rebel safehouse)
- **Giver:** the town guard (built NPC: "Nobody gives bread for nothing") and the guard captain's pencil note in the
  built book *A Quiet Crown Tract*. **Accept:** read the tract, then talk to the guard.
- **Steps:** 1) Two places hand out free bread: the Quiet Crown table on the plaza, and a back door of the bakery by
  the harbor. 2) The Quiet Crown table asks for a name and a "small promise". The bakery asks for nothing. 3) The baker
  will not say who pays for the flour. In her store room: sacks marked with a small grey thumbprint (the ash
  thumbprint, first sighting). 4) In the Echo, the same store room was the Revolution's grain store; the Echo
  quartermaster says, "Grain for anyone who asks. The Marshal's order." The baker in the present: "Then we are keeping
  an old order."
- **Echo use:** the same room, same promise, fifty years apart (a social scene; no anchor).
- **Reward:** 30 gold, 30 XP, +1 Influence (Zetwal), Journal note *The Ash Thumbprint (1 of 9)*. The baker sells bread
  at cost for the rest of the game.

### Z-6 Muskets in the Cane (Chapter 10)
- **Giver:** the cane cutter, on the return ("Bandits by day, smugglers by night", built). **Accept:** inspect the
  built crates of Crown muskets on the Cane Road.
- **Steps:** 1) Follow cart tracks to the mangroves (ambushes on: smugglers, levels 22 to 25). 2) Beat the smugglers'
  boss crew (Smuggler x2, Lookout x2). 3) Their ledger says the muskets are for "the Muster's friends": whoever the Crown
  will buy. 4) In the Echo, the old sugar mill was a powder store; Patricio can drop the cellar bar (**anchor**) so the
  present-day cellar is sealed: the smugglers' second cache is shut in for the army to seize.
- **Reward:** 600 gold, 380 XP, +2 Fear or +2 Influence (Zetwal, by Yield), and the betrayer's house name is
  underlined in the Journal (this counts as Kuroshi-grade evidence for the Muster's **exposed route**, proposal).

- **Built (Oct 22; Chapter 10, the outline 7.1 with its second review's 3.12 and 3.13; Claude's calls; required):** the
  crates on the Cane Road, the crew at the smugglers' landing (the chief, level 25, HP x3, ATK x1.3, a smuggler and a
  lookout in front of him, a bandit whistled in once; 50 XP, 150 gold; he withdraws and walks up the road between the
  cutters). Spared (+1 Influence) or broken (+2 Fear). The carter's ledger (`item.smugglers_ledger`: muskets "for the
  Muster's friends" under a closed hand, a house sigil in the margin) is the exposed route's second piece with Kayla's
  list. Then the powder cellar (M-ZET-2). Reward 400 gold and 10 XP (the chapter's XP is in its steps). Closes when
  the fleet sails.
- **The three feuds (Chapter 10, required as the Speaker's gate):** merchants (the Dorini clerk against Hrafn), temple
  (the Suzumori retainer against the Agnivansh steward), crown (the printer against the Free Brasador sergeant); each a
  debate, mediated or joined. A mediation pays +2 to its Influence house's price; a house whose feud was argued and not
  mediated brings nine tenths of its army.

## Yucayeque (Xaraguá)

**Built (Oct 21; outline `reviews/2026-10-19-chapter2-side-quests-outline.md`, its review and the owner decisions at
its end):** four Chapter 2 side quests in `quest/src/data/sideQuests.ts`, with their lines in
`quest/src/data/dialogue/xaraguaQuests.ts`, plus the debate *Owned or Remembered*. All five are required before the
cave, and all live in the free city.
- **The gate (owner decision, Oct 19).** After Thorne's warning, the lamp-oil seller will not hand a cave lamp to the
  envoy's daughter under the Governor's spyglass (a flash in the customs house window). Yari: "Then let him watch us
  do ordinary things all day." She lends the lamp at dusk, when the night canoe brings her oil and the glass goes in.
  The Journal: *A light for the cave* (asking her; no story XP), *Until dusk* (done through the side quests,
  `followSide`, no story XP; done for a save that already has the lamp), *The lamp at dusk*. Until then she lists what
  is still left. Dusk is shown: once the five are done the free city's outdoor maps take an evening wash
  (`MAP_MOODS`), the night canoe comes in to the jetty and the paddler walks off again, and the cave, the areíto, the
  lock and the proof play in the evening, straight through to the attack.
- **Cut Nets** (the pier fisher; after the pier fight): three nets cut "for the harbor's safety", by the canoe jetty on
  the village shore (on the story's own path to the gardens), by the canoes on the Canoe Beach and at the salt pans
  (the shell diver walks over: the longboat crew did it). Yari and the fisher mend them on the sand (her father's
  knot). No fight (owner decision). 70 gold, 25 XP, *Net-float charm*, +1 Influence.
- **The Hutia's Hoard** (the small girl in the cassava gardens; after the pier fight; puzzle M-XAR-1): a trail of
  dropped shiny things across the gardens to the old ceiba, whose hollow is out of reach. In the memory it is a
  sapling, with two of Caona's scouts and a hutia; staked low (`anchor.hutia_stake`), it grows a fork you can climb.
  The bead goes home; the girl gives you the Crown button. The carver on the beach misses his fish hook. 80 gold,
  25 XP, *Brass button charm* (crit +3%), +1 Influence; Journal "Something changed".
- **Oil From a Stranger** (the lamp-oil seller, offered in the refusal at the lamp): two jars up the Mountain Path to
  the hill camp; the scout runs to check the path behind Gianna; the leader takes the jars and shows the grey ash
  thumbprint on the post, the same as on the jars' wax (Rael clue 6; Journal *The ash thumbprint*). It ends at the
  camp (review D2); the seller has the news by runner at dusk. 80 gold, 25 XP, +1 Influence.
- **Medicine for the Cacique** (the healer, offered at Anaco's bedside as the story meets him, or later in the caney;
  puzzle M-XAR-2): stumps by the road the Crown's crews cut across the camp's flat ground; in the memory at the camp
  fire, Caona's scouts' healer gives Patricio seed: "Plant a row where no road will ever go." Planted on the flat, the
  trees grew and were cut for the road too (a second row of stumps); planted behind the new limestone at the camp's
  north end (`anchor.healer_grove`), a grove stands there now. The bark cures Anaco on screen: he sits up and says
  "Tell the elders I will stand when they sit." 100 gold, 30 XP, +2 Influence. In the occupied city the cave healer
  adds: "The grove bark went with the caney."
- **Owned or Remembered** (the debate by the village fire): now required with the other four; 30 XP (was 60); listed
  as *Harbor Village*; the arrow points at the elder (the fire itself cannot be talked to).
- **Every quest closes at the Crown attack** (review D4): no longer offered once `story.crown_attack` is set; a quest
  finished before stays done. **Closed, not hidden** (review 1, Oct 21, finding 5, the general rule for every chapter
  from now on): a side quest can carry a `closed` condition and a `closedText` (`quest/src/engine/sideQuests.ts`).
  Once `closed` holds, an accepted but unfinished quest is *closed*: off the arrows and the mystery list, listed last
  on the Quests page as `[-] Title` with its closing line, and the line also shows in the Journal's notes. Never
  accepted, it is simply never offered again. Chapter 2's five close at the attack. Their closing lines (Claude's
  call): Cut Nets "the Crown took the beach the night the guns fired. Nobody mends nets under curfew."; The Hutia's
  Hoard "the small girl's family fled the gardens on the night of the attack. Her bead is still in the hollow."; Oil
  From a Stranger "the jars never reached the hill camp. Its people shelter in the cave now."; Medicine for the Cacique
  "the caney is the Governor's house now. The healer brews what she can in the cave."; Owned or Remembered "the fire
  is out. The pilgrim is gone." (the review's own words). Only an old save can see them: the dusk gate needs all five.
- **The arrow in the memories** (review 1, finding 2): the hutia's sapling and the camp's scout healer and planting
  spot are Echo goals (`echoGoals`), so the arrow shows inside those memories and then leads back to the shimmer.
- **The arrow** does what is on the map the player is on first (`engine/guide.ts` `storyGoal`), so it climbs the
  mountain once for both mountain quests. Its order from the seller: the nets, the debate, the hutia, the camp (oil,
  then the grove), the healer in the caney, the seller at dusk.

**Claude's calls (Oct 21, not drastic, recorded here):** the request at the lamp is its own Journal objective
(`lamp_ask`, no XP) so the arrow sends the player to the seller's refusal before the quests, and the lamp's 25 XP is
paid once, at dusk; the dusk wash covers the free city's outdoor maps and the camp from the moment the five are done
until the attack; the springs quest's marker moved from the fire to the elder; rewards XP 25/25/25/30/30 (the
review's 20 to 30 band), gold and items as the outline; the cut nets' places (village 12,20; beach 6,13 and 28,12);
the camp's limestone ledge and the road crews' road were added to the map so the grove puzzle reads off the screen;
a wrong planting is answered on screen (the second row of stumps), not refused; Anissa's hints for the two puzzles
are spoken on a second look at the tree and at the stumps; placeholder drawings for the net, glint, sapling, forked
ceiba, stumps, seed row and grove; both memories are dated after the first oath ("the summer after", "a season
after"), so the scouts may call Patricio Marshal before the player has seen the areíto. Caona's Conch (X-4) is not
built (owner decision).

### X-1 Cut Nets
- **Giver:** a net-mender on the pier. **Accept:** after the first battle (the tutorial on the pier).
- **Steps:** 1) Find the three cut nets on the shore. 2) Crown marines cut them "for the harbor's safety": fight them
  (Crown Marine x2, levels 4 to 5). 3) Yield: Spare (they help mend: +Influence), Take spoils, or Break them.
- **Reward:** 80 gold, 70 XP, a *Woven net charm* (SPD +2, level 4), +1 pillar by Yield (Xaraguá).

### X-2 Oil From a Stranger (rebel safehouse)
- **Giver:** the lamp-oil seller (guide 5.8 clue 6). **Accept:** buy anything from her; she asks for help carrying oil
  to the hill cell.
- **Steps:** 1) Carry two jars up the mountain path (wild section; an optional Crown patrol at level 6). 2) The cell's
  leader thanks you and shows how the oil arrives: jars left at a cave mouth on new-moon nights, each sealed with a grey
  thumbprint. 3) She has never met her supplier: "Someone who hates the Crown more than we do. Or loves us more."
- **Reward:** 100 gold, 80 XP, +1 Influence (Xaraguá), *The Ash Thumbprint (2 of 9)*.

### X-3 The Hutia's Hoard
- **Giver:** three angry market sellers; Yari: "...That might be mine." **Accept:** talk to any of them.
- **Steps:** 1) Follow the hutia's trail of dropped shiny things (a sea-glass bead, a fish hook, a brass button).
  2) The trail ends at a huge old tree whose hollow is too high. 3) In the Echo, the tree is a sapling, and Caona's
  scouts tease a hutia (the hutia's great-great-grandparent, Yari insists) that keeps hiding things at its roots.
  Patricio plants a stake to train the sapling to grow a low fork (**anchor**: growth verb). 4) In the present, the
  tree has a low fork; climb to the hollow. Return the stolen things; keep one that nobody claims.
- **Reward:** 90 gold, 70 XP, a *Brass button charm* (gold +5% from battles), +1 Influence (Xaraguá). Comic tone.

### X-4 Where the Canoes Sleep (secret item)
- **Giver:** the old net-mender (after X-1). **Accept:** she tells the story of Caona's hidden canoe.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 3, `PUZZLES.md` (S-XAR). Caona's Conch; 150 gold, 120 XP, +2
  Influence (Xaraguá). The sea cave has crabs and bats (levels 5 to 7).

### X-5 Medicine for the Cacique
- **Giver:** the cacique's healer, at Anaco's house. **Accept:** after meeting Anaco.
- **Steps:** 1) The healer needs bark from a grove on the mountain that the Crown's road crews cut down. 2) Climb the
  mountain path (wild section; Mangrove Crab and Crown Marine groups, levels 5 to 7). 3) The grove is stumps. 4) In
  the Echo, Caona's healer is gathering seed; Patricio plants a row where the road will not reach, behind the rocks she
  points to (**anchor**). 5) In the present a small grove stands behind the rocks; take the bark.
- **Reward:** 120 gold, 100 XP, +2 Influence (Xaraguá). Anaco is well enough to speak at the council (a stronger
  debate in Chapter 2's main beat: +1 round advantage).
- **Note:** the healer's practice is shown as medicine and care, not as a ritual of a real faith (guide 7.3).

### X-6 The Ninth Thumbprint (Chapter 11; the safehouse thread's last door)
- **Built (Oct 22; the Chapter 11 outline 7.1 with its second review's 3.7 and 3.16):** the lamp-oil seller at the hill
  camp: the canoes have no powder; jars come to the cave mouth on new-moon nights, and the last came with a note: "For
  the harbor. When they come." Steps: 1) the petroglyph cave under the gardens, where a man in a black coat, sash torn
  off, walks out and away east at a walk (seen once, from the back; Anissa: "He walked like the ones on the strand,
  Gigi. The black coats." Azzy: "...A lot of people walk like that."); the jars are powder, each with a grey thumbprint
  in the wax (Haru: "The ninth door."). 2) Back up the gardens' road with the jars: the Crown's picket (two marines and
  an officer, 26; `thumbprint_picket`, the quest's fight). 3) The canoe fisher at the camp's south edge. Reward: 150
  gold, 40 XP, +2 Influence (Xaraguá). Required by the tide's gate. In the truth Haru reads the nine doors in the order
  the notes found them (Z-5's bakery the one not yet opened).

### X-7 Harbors Lie (Chapter 11)
- **Built (Oct 22; the outline 7.2):** the fisher's boy at the camp counts forty-two marines and eleven ships, and runs
  off to the lookout clearing on the Mountain Path; from there he counts again: eleven, and four black sails off the
  point ("They're not Crown and they're not yours." Azzy: "...Ardencia."). The count to the camp leader ("Eleven and
  four. Then the canoes go for the *Patience*, not the pier."). Reward: 40 XP, +2 Influence (Xaraguá). Required.

### X-8 Whose Harbor? (Chapter 11; the elders' choice comes back)
- **Built (Oct 22; the outline 7.3):** the debate `xaragua_harbor` at the camp fire, *Won by seven navies: whose
  harbor?*, the elder for the oath against the elder who would have signed the Charter, the undecided elder listening
  "for fifty years". Won (Reason, Compassion, Reason) or lost, it settles the gate; mediating (Influence 5 in Xaraguá)
  has Yari walk to the fire and set the terms ("The harbor stays with the people who fish it. The seven sail home when
  the chain is down."). Anaco at the caney says which. Xaraguá's Se-5 token, **the carved paddle**, is Anaco's gift to
  Yari at the caney (`item.token_xaragua`).

## Bab al-Dhahab (Al-Doria)

### A-1 Appraise This
- **Giver:** Samira (before she joins). **Accept:** she bets you cannot spot a fake.
- **Steps:** 1) Three stalls each sell one fake among real goods (a coin, a carpet, a scale weight). 2) Inspect each
  item: the fakes have a tell (the coin's edge, the carpet's knot count, the weight's stamp). No fight. 3) Report all
  three to Samira.
- **Reward:** 150 gold (she pays her bet, then invoices you for the lesson: net 100), 70 XP as built (110 until the levels pass, Oct 22: `COMBAT.md` 6), +1 Influence (Al-Doria).

### A-2 The Missing Saffron
- **Giver:** a spice merchant on the caravan gate. **Accept:** read the contract board.
- **Steps:** 1) Track the lost caravan into the desert edge (wild section). 2) Caravan Raiders (levels 9 to 10) hold
  it. 3) Fight or Parley; Yield options.
- **Reward:** 250 gold, 140 XP, 3 *Spiced tea*, +1 Wealth (Al-Doria).

### A-3 Sweet Water (rebel safehouse)
- **Giver:** children at a dry public fountain. **Accept:** talk to them.
- **Steps:** 1) The guild sells water by the cup; the fountain went dry when the guild diverted the cistern. 2) A
  rebel water-carrier runs free water from a hidden well (grey thumbprint on the door). 3) She needs the old cistern
  line opened. 4) In the Echo, the cistern sluice is open and its gate pin loose; Patricio pins it open (**anchor**:
  water verb). 5) In the present the fountain runs.
- **Reward:** 120 gold, 80 XP as built (130 until the levels pass, Oct 22: `COMBAT.md` 6), +2 Influence (Al-Doria), *The Ash Thumbprint (3 of 9)*.

### A-4 The Uncashed Note (secret item)
- **Giver:** the old moneychanger in the bazaar. **Accept:** show him the Sun Locket.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 2, `PUZZLES.md` (S-ALD). The Sakk of Yusuf; 200 gold, 150 XP, +1
  Wealth and +1 Influence (Al-Doria).

### A-5 Invoice for the Crown
- **Giver:** Samira (after she joins). **Accept:** automatic; she has "one last invoice to deliver".
- **Steps:** 1) Deliver her invoice for "war-profiteering consultation, never requested" to the Crown factor at the
  docks. 2) Parley (he pays) or fight his guards (Crown Marine x2, Crown Officer, level 10).
- **Reward:** 300 gold, 120 XP, +1 Fear or +1 Influence (Al-Doria), Samira's first heartfelt line ("No one has ever
  helped me collect.").

## Cenizal (Ardencia)

### Ar-1 Bread at Night (rebel safehouse)
- **As built (Oct 21; required before noon):** the cook is **Amanda** (Benny's daughter, owner, Oct 21). Ask her by day
  (she tells nothing, loudly), see the ash thumbprint on the barrels, meet Azzy at the Lower Town gate at dusk, and
  watch the cart from the corner by the old well (no stealth fail: Claude's call). Reward 150 gold, 80 XP, +1
  Influence (Ardencia).
- **Giver:** Azzy: "My father's poor are not starving. I do not know why." **Accept:** after meeting Azzy.
- **Steps:** 1) At night, follow a covered cart through the lower town without being seen (a short stealth path;
  seen: a fight with hired guards, level 12). 2) The cart feeds a soup line; the cook will not say who pays. Grey
  thumbprint on the barrels. 3) Azzy: "This is not the elders' charity."
- **Reward:** 150 gold, 150 XP, +1 Influence (Ardencia), *The Ash Thumbprint (4 of 9)*.

### Ar-2 The Treasurer's Daughter
- **As built (Oct 21; required):** the steward **Zelia** opens the records room; the Echo of Benny's office; the
  niche; the note; the daughter gives *Benny's Refusal* (the lead to Al-Doria); then Zelia takes Gianna to **old
  Benny** and **Nancy** in the quiet rooms (owner, Oct 21: Benny meets the Locket again). Reward 100 gold, 70 XP, +1
  Influence (Ardencia), *Benny's Refusal (copy)*.
- **Giver:** a young woman at the elders' hall gate. **Accept:** talk to her.
- **Steps:** 1) Her father, the city treasurer, "disappeared" years ago. 2) Find his last ledger in the hall archive.
  3) In the Echo the archive was Benny's office; Benny's clerk shows where the treasurer's predecessors hid working
  copies (a wall niche; it exists in both eras, so no anchor). 4) The hidden copy has a fresh note in the treasurer's
  own hand, dated this year: he is alive. Gianna cannot find where he is held.
- **Reward:** 100 gold, 140 XP, +1 Influence (Ardencia). Sets `clue.treasurer_alive`: his family testifies at the
  Hearing (guide 5.8: a real harm, he is alive).

### Ar-3 The Elders' Feast
- **Giver:** the contract board ("Discreet guards wanted, elders' banquet"). **Accept:** take the job.
- **Steps:** 1) Guard the banquet; overhear the elders boast of skimmed taxes. 2) Expose one elder's hoard: Fear route
  (break in, fight his hired blades, levels 12 to 13) or Influence route (read the hall's tax book, then the Concord
  debate with the elder).
- **Reward:** 300 gold, 160 XP, +2 Fear or +2 Influence (Ardencia). The elder appears at the Hearing.

### Ar-4 The Old Lord's Errand (secret item)
- **Changed by owner decision 2 (Oct 20):** Rael wears La Promesa de Benny in the Trial and gives it up in Chapter
  11, so Ar-4 rewards old Benny's written promise (a letter), not the charm. After the release.
- **Giver:** old Benny in the keep (the guide's callback scene). **Accept:** after the Echo callback.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 5, `PUZZLES.md` (S-ARD). La Promesa de Benny; 250 gold, 180 XP, +2
  Influence (Ardencia).

### Ar-5 The Arrows Missed
- **As built (Oct 21):** its clue is one exchange at the camp ("Every shot wide, envoy." / "Then they missed."); the
  quest form follows the release.
- **Giver:** Azzy, at the Free Brasador camp after the escape. **Accept:** automatic.
- **Steps:** 1) Talk to five soldiers. 2) Three of them say the arrows landed wide, "every one, and those were the
  best archers in Ardencia" (guide clue 5). 3) Azzy refuses to hear it ("Then they missed").
- **Reward:** 150 XP, +2 Fear (Free Brasador: the guide's price is Fear 6). Journal clue.

## Eightgate

### Se-1 Volume One
- **Giver:** Elodie, after the confrontation (Chapter 5). **Accept:** ask about the missing book.
- **Steps:** 1) Elodie admits she has *Ash Wars Gossip, Volume One*: "Your grandmother lent it to me twenty years ago.
  I kept it." 2) Read it in her rooms: Elodie's handwriting in the margins: "Not true. I was there." "Not true." A
  letter on her desk, face down, is sealed with a grey thumbprint; she turns it over before Gianna can look (*The Ash
  Thumbprint (9 of 9)*). 3) Take the book back to the Temple Archive (Chapter 10).
- **Reward:** 200 gold, 160 XP, +1 Influence (Seat); returning it in Chapter 10 completes the Overdue Books thread:
  +2 Concord.

### Se-2 Four Voices
- **Giver:** the Seat's debate corner (all four faiths, guide 7.2). **Accept:** Listen once.
- **Steps:** 1) Join four short debates, one per faith's speaker. 2) Mediate the last (needs realm Influence 12).
- **Reward:** 180 XP, +2 Influence (Seat), +5 Concord. After the Harbor Turn the corner rewrites itself (guide 7.2).

### Se-3 Deserters' Road
- **Giver:** pilgrims at the Crossroads gate. **Accept:** talk to them.
- **Steps:** 1) Crown deserters rob pilgrims in the Crossroads Fields (wild section; Crown Marine and Road Bandit,
  levels 14 to 16). 2) Their leader is hungry, not cruel: Parley gets them to escort pilgrims instead.
- **Reward:** 300 gold, 200 XP, +1 pillar by choice (Seat). Spared deserters reappear as a Harbor reinforcement (+5
  soldiers).

### Se-4 The Unknotted Ribbon (secret item)
- **Giver:** Keeper Hollis in the Throne Archive. **Accept:** after the Seventh Clause is read aloud (Chapter 5).
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 9, `PUZZLES.md` (S-SEA). Finishable only after Chapter 9. The
  Seventh Ribbon; 500 XP, +3 Influence (Seat).

### Se-5 A Seat for Every House
- **Giver:** Keeper Hollis: the old Throne Hall has eight empty chairs. **Accept:** Chapter 5.
- **Steps:** collect a token of goodwill from each allied capital (given when its price is paid in full): Xaraguá's
  carved paddle, Al-Doria's sealed scale, Free Brasador's banner, Skarragol's horse-hair braid, Kuroshi's folded fan,
  Jwaladesh's lamp, the Aldermoor dissidents' law-seal, and Zetwal's sun cloth. Place them in the Throne Hall before the
  Claim.
- **Reward:** 400 XP, +5 Accord Stability, and the standing council scene in the Just Throne ending (guide 5.7).
- **Claude's call (Oct 22, the Chapter 6 outline review 3.6):** a token is given **when the alliance is made**, not when
  its price is paid in full (prices are owed, paid at the Muster; a token given only at 10 of 10 would leave the chairs
  empty). Skarragol's braid is the first, given in Ordvik's price scene. Toward a price, Influence and Fear count at
  half value when the Muster computes it (the guide's rule); Ordvik's Journal note says what each payment was worth.

## Ordvik (Skarragol)

### S-1 Salkhi Has Opinions
- **Giver:** Salkhi, Bayarmaa's horse (more dialogue than she has). **Accept:** after Bayarmaa joins.
- **Steps:** Salkhi refuses to cross the fair until three wrongs are put right: a foal separated from its mother, a
  saddle that pinches, and an insult from a rival horse (talk to the rival horse; Yari translates, badly). No fight.
- **Reward:** 250 gold, 200 XP, +1 Wealth (Skarragol), and Salkhi stops sighing at Azzy.

### S-2 The Fleet for Sale
- **Giver:** the council hall. **Accept:** after the council meeting.
- **Steps:** three chiefs each want proof the alliance pays better than the Crown: a trade letter from Samira (if in
  the party) or 300 gold, a horse-fair win (a timing race), and a promise of blockade compensation from the Throne
  (Influence 12 or Fear 10).
- **Reward:** 300 XP, +3 Wealth (Skarragol): a large step toward its price (Wealth 10).

### S-3 The Winter Stores (rebel safehouse)
- **Giver:** a herder at the folds. **Accept:** talk to her.
- **Steps:** 1) Someone leaves grain at the folds every winter. 2) Wolves raid the store (Steppe Wolf pack, road
  tier). 3) In the Echo, the store was Sarnai's supply cache; Patricio rolls a boulder over the wolf run (**anchor**:
  weight verb). 4) The present store has a boulder wall; grey thumbprint on the grain sacks.
- **Reward:** 300 gold, 260 XP, +1 Wealth (Skarragol), *The Ash Thumbprint (5 of 9)*.

### S-4 The Cairn of Nine Riders (secret item)
- **Giver:** an old herder at the plateau path. **Accept:** with Bayarmaa in the party.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 6, `PUZZLES.md` (S-SKA). Sarnai's Bridle Bell; 350 gold, 300 XP, +2
  Wealth (Skarragol).

### S-5 Grandson of the Steppe
- **Giver:** an envoy of Azzy's mother's people. **Accept:** automatic when Azzy is in the party.
- **Steps:** 1) The envoy treats Azzy as a royal grandson and offers him riders if he renounces Ardencia. 2) Azzy must
  answer: refuse politely (Influence), refuse with a show of strength (a sparring duel: Fear), or ask Gianna (a
  conversation where Gianna's words shape his Claim choice later). Azzy's mother does not appear (guide 13.7).
- **Reward:** 250 XP, +2 Influence or +2 Fear (Skarragol). Affects Azzy's Claim choice in Chapter 12 (toward
  "share").

## Kirinoura (Kuroshi)

- **Built (Oct 22; the Chapter 6 outline section 7 with its review's 3.5):** the envoy is of the khatun's household,
  Ironvow's eastern clans (no separate polity); his offer is two hundred riders "the day you take your mother's name".
  Three answers, all kept in `choice.azzy_ordu` for Chapter 12: refuse politely (+2 Influence at Ordvik), refuse with a
  show of strength (a sparring bout with the champion in white, who steps back at 0 HP: +2 Fear), or ask Gianna (the
  corral rail: +1 Influence, tips the Claim toward sharing). 50 XP, 150 gold. S-3 (built): the wolves at the store (a
  fight), the boulder rolled in the memory (`anchor.wolf_run`), the wall now, the fourth ash thumbprint; 60 XP, 200
  gold, +1 Wealth. Both close (`closed`) if the story is past them.

### K-1 Definitely Not a Spy
- **Giver:** Haru (unseen). **Accept:** the hutia notices someone following.
- **Steps:** spot Haru three times as he tails the party (a reflection in a puddle, a moving screen, a pair of shoes
  under a stall). Each time he says "definitely not a spy".
- **Reward:** 200 gold, 220 XP, +1 Influence (Kuroshi); Haru joins a scene earlier with a better opinion of Gianna.
- **Built (Oct 27; optional; Claude's calls):** the three sightings stay the story's (the Chapter 7 outline: they are how
  Haru is met), so the quest is the hutia's notice done by Yari, after: at dawn, after the Fox, she stops at the tea
  house screen ("Show me how. All three places. Then I will believe you are not a spy."). At the pier's puddle, the
  screen and the Hall's corridor Haru walks to his place and does it again; each time he says "definitely not a spy"
  (the design's three; Chapter 7's own scenes still say it once). After the last, he walks up to Gianna: he let her
  find him because she looked at the people, not the Crown's boat (the better opinion). 200 gold, 40 XP, +1 Influence
  (Kuroshi). Closes when the trader sails (`act7.complete`).

### K-2 The Spy Ledger
- **Giver:** the file house archivist. **Accept:** ask about the Ash Wars.
- **Steps:** 1) The Suzumori ledger of the Ash Wars (one of the four accounts) is in the sealed stacks. 2) Sneak in
  (stealth; seen: a fight with Fog Cutpurses). 3) In the Echo, Sayo's clerk files the ledger under a cipher shelf
  mark; learn it. 4) Find it in the present by the mark.
- **Reward:** 280 XP, +2 Influence (Kuroshi), the ledger book (Ash Wars account 2 of 4).
- **Built (Oct 22; the Chapter 7 outline 7.1 with its second review's 3.3 and 3.4; Claude's calls):** the giver is
  Kayla, the cipher clerk at the Lantern Library (not a file house archivist), who is met by walking up to her desk.
  The sealed stacks are behind the library's paper partition: three Fog Cutpurses work the shelves, and stepping into
  their sightline is the fight (`stacks_cutpurses`, 30 XP), after which the stacks are clear. The Echo teaches the
  shelving rule on a Revolution file (M-KUR-1); the ledger is found by the rule and taken back to Kayla's desk. She
  hands Gianna Sayo's house glyphs (`item.kayla_glyphs`): "You will need these where you are going. I did not say
  where." 50 XP, 200 gold, +2 Influence (Kuroshi), the book. Required before the lantern hour; closes if the story is
  past it (`story.haru_met`).

### K-3 Lanterns for the Lost (rebel safehouse)
- **Giver:** a fisher's family at the marsh edge. **Accept:** talk to them.
- **Steps:** 1) Fishers are lost in the fog marsh (wild section; Lantern Moth swarms). 2) Light the marsh lanterns in
  the right signal order (the signature puzzle's lantern code, simpler). 3) The fishers were hiding a rebel press (grey
  thumbprint on the ink).
- **Reward:** 300 gold, 260 XP, +1 Influence (Kuroshi), *The Ash Thumbprint (6 of 9)*.
- **Built (Oct 22; the outline 7.2 with its second review's 3.7 and 3.8; Claude's calls):** the fisher's wife and boy
  ask on the quarter by day; the marsh is reached only through the fog maze (the quarter's marsh road is shut by the
  fog order until the causeway is lit), so the quest's step past the asking waits for Haru. Six posts, the code left
  then right (M-KUR-2); the Lantern Moths rise first (`marsh_moths`, 30 XP), then the boats come home as objects, and
  the press in the huts carries the fifth grey thumbprint on the built route. 50 XP, 250 gold, +1 Influence (Kuroshi).
  Required (the way on to the file house's back door); closes on `ally.kuroshi`.

### K-4 The Letter in the Floor (secret item)
- **Giver:** the old floor-maker. **Accept:** with Haru in the party.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 8, `PUZZLES.md` (S-KUR). The Nightingale Key; 300 gold, 320 XP, +2
  Influence (Kuroshi).
- **Built (Oct 27; optional; Claude's calls):** the floor-maker is the old man the Kirinoura book *The Nightingale
  Floor* names (the apprentice who held the nails, a key-maker now), by Sayo's door at dawn; Haru must be with the party
  (always so at dawn). Lady Sayo's House (20 x 14). 300 gold, 60 XP, +2 Influence (Kuroshi); Sayo's letter to the
  Marshal (no Rael). Closes when the trader sails. Puzzle `quest/puzzles/kuroshi_floor`.

### K-5 Ashes of the Temple
- **Giver:** a Suzumori elder who still regrets the burned Agnivansh temple (guide 5.4). **Accept:** talk to her.
- **Steps:** 1) Her files show the Suzumori burned it on Crown intelligence that later proved false. 2) In the Echo,
  Sayo's network intercepts the Crown's forged report; Patricio sees the forger's seal. 3) Carry her letter of
  apology, with the seal, to Agnipur.
- **Reward:** 250 XP, +1 Influence in Kuroshi and in Jwaladesh; the Suzumori and Agnivansh feud mediation at the
  Muster starts one step easier.

## Agnipur (Jwaladesh)

### J-1 Win Every Argument
- **Giver:** Vikram. **Accept:** after he joins.
- **Steps:** three citizens out-argued Vikram while he was out of breath. He wants rematches: each is a short
  sparring battle (no deaths; road tier) or a debate (Gianna speaks for him).
- **Reward:** 300 gold, 240 XP, +1 Fear or +1 Influence (Jwaladesh); Vikram learns to breathe between sentences
  (a joke line only).
- **Built (Oct 27; optional; Claude's calls):** at dawn after Seth Dhanraj (Vikram joined the night before: "Argue
  later"): a spice-seller on the spice row, a dyer by the dyers' lane and an old wrestler on the temple steps. Each is
  won back by a sparring bout (Vikram alone, the foe steps back at 0 HP; 10 XP each) or by Gianna's answer (three
  choices, one lands; a wrong one can be tried again). The pillar follows the majority: two or more bouts +1 Fear, else
  +1 Influence (Jwaladesh). 300 gold, 30 XP. Closes when the trader sails.

### J-2 The Lamp Relay
- **Giver:** the temple's runners. **Accept:** at the temple steps.
- **Steps:** carry a lit lamp from the harbor to the temple before it gutters (a timing route with wind gusts); in the
  Echo, Arjun's runners show the sheltered alleys (route knowledge; no anchor).
- **Reward:** 250 gold, 220 XP, *Flame-bead bracelet* (fire skills +15%, level 16), +1 Wealth (Jwaladesh).
- **Built (Oct 22; the Chapter 8 outline 7.1 with its second review's 3.11; Claude's calls; required):** the chief
  runner on the temple steps gives it; the relay lamp is lit at the harbor stair's head and goes out in the main
  street's two gust strips (the run starts again at the stair); the runners' minor Echo at their hearth teaches the
  way (left at the dyers, through the arch, along the wall), which is also the roof mirrors' clue. Reward 250 gold,
  25 XP (the steps pay the chapter's levels), the Flame-bead bracelet as stats (no fire bonus), +1 Wealth.

### J-3 The Anonymous Oil (rebel safehouse)
- **Giver:** a junior priest. **Accept:** talk to him in the temple yard.
- **Steps:** 1) Oil arrives at the temple's back gate at night. 2) Watch the gate; an Oil Enforcer gang tries to seize
  it (optional fight). 3) The jars carry the grey thumbprint.
- **Reward:** 300 gold, 260 XP, +2 Wealth (Jwaladesh), *The Ash Thumbprint (7 of 9)*.
- **Built (Oct 22; the outline 7.2 with its second review's 3.2 and 3.5; Claude's calls; required):** the junior
  priest in the colonnade gives it; the oil comes by the salt road, not to the back gate at night: Oil Enforcers stop
  the carter's cart on the salt flats (a fight, 20 XP), and the jars at the Court's back gate carry the grey
  thumbprint. Yari counts the seven places; the carter says "Somebody is feeding the realm. Not for a goddess." (no
  "he"). Reward 300 gold, 25 XP, +2 Wealth. The hesitation debate (the senior Keeper against a pilgrim on the spice
  row) is the day's third required thing; all three close if the story is past them.

### J-4 Oil for the Little Lamps (secret item)
- **Giver:** a child keeping a street shrine. **Accept:** after Seth Dhanraj falls.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 4, `PUZZLES.md` (S-JWA). The Unbroken Wick; 280 XP, +2 Influence
  (Jwaladesh).
- **Built (Oct 27; optional; Claude's calls):** the shrine child on the spice row asks at dawn; the "shrine's door"
  is the balance lock already on the oil store's back door (the Chapter 8 map placed it there: the lamp-maker's back
  room, where every street shrine's reservoir waited). 60 XP, +2 Influence (Jwaladesh). Closes when the trader sails.
  Puzzle `quest/puzzles/jwaladesh_wick`.

### J-5 Jackals on the Salt Road
- **Giver:** the contract board. **Accept:** take the job.
- **Steps:** escort a salt caravan across the salt flats (wild section; Ember Jackal packs and Oil Enforcers).
- **Reward:** 450 gold, 280 XP, +1 Wealth (Jwaladesh).

## Kingsmere (Aldermoor)

### Al-1 Terribly Sorry
- **Giver:** Edmund. **Accept:** after he joins.
- **Steps:** deliver Edmund's handwritten apologies to five people he has hit (a press-gang sergeant, a constable, a
  bandit, a goose, the Regent's footman). Each reply is funnier than the last. No fight.
- **Reward:** 400 gold, 300 XP, +1 Influence (Aldermoor). Unlocks Edmund's *Tea Break* upgrade (+5%).
- **Built (Oct 27; optional; Claude's calls):** offered by Lady Rosalind in the hall by day once the Regent has refused
  ("My son writes to everyone he hits. He has never once written to me."; Edmund: "Five, Mother."). The press-gang's
  sergeant (the press-gang's officer) and a constable on the square, a highwayman and the goose on the heath, the
  Regent's footman in the hall: Edmund walks up to each and hands the letter, each answers and walks off. Done by day
  or at the last dawn (never the night or the court). Tea Break heals 20% after (`SkillDef.boosts`). 400 gold, 40 XP,
  +1 Influence (Aldermoor). The sixth letter, to his mother, is read at Al-5's tea. Closes when the trader sails.

### Al-2 The Crown Chronicle
- **Giver:** the keep archive (during the infiltration). **Accept:** find the Ash Wars shelf.
- **Steps:** 1) Take the Crown's chronicle of the Ash Wars (account 3 of 4: "four hundred put to the sword"). 2) In
  the Echo, Thomas Stillwater's colleague is ordered to "write the Brasador wars large"; Patricio sees the order
  (information; no anchor). 3) Note it in the Journal.
- **Reward:** 320 XP, +2 Influence (Aldermoor), the chronicle (with the Echo note that it was written to order).
- **Built (Oct 22; the Chapter 9 outline with its second review's 3.6; Claude's calls; required):** the Ash Wars
  shelf in the archive stands in front of Thomas's panel: lifting the chronicle down is the way to the anchor's present
  half (Edmund walks the shelf a foot aside). Its fly-leaf, in Thomas's old hand: "Written to order. The purchasing
  office asked for the Brasador wars large. And I wrote them large. The true count is in Kirinoura. T.S." Step 2 is
  reading it again beside the record from the panel ("The same hand. Fifty years apart."). The archive's door waits for
  it. Reward 40 XP (the steps pay the chapter's levels), +2 Influence (Aldermoor); it goes into the court's evidence and
  comes back at dawn. Closes if the party is caught before it is read.

### Al-3 The Purge List (rebel safehouse)
- **Giver:** a dissident printer. **Accept:** after the courtroom.
- **Steps:** 1) Steal the Quiet Crown's purge list from a Husher cell (fight: Husher, Moor Constable, Bog Hound).
  2) Warn three families. 3) The printer's shop has the grey thumbprint, and so does the list's cover note: someone in
  the Quiet Crown leaked it on purpose.
- **Reward:** 500 gold, 380 XP, +3 Fear (Aldermoor dissidents: price Fear 8), *The Ash Thumbprint (8 of 9)*. The 9th
  is in Elodie's rooms at the Seat (seen in Se-1).
- **Built (Oct 22; the outline 7.2 with its second review's 3.10; Claude's calls; required):** opens after the Regent's
  refusal, before the court (so the price is paid by the chapter): the printer (Edmund's old tutor) at the barn on the
  heath; the bog chapel at dusk, where the veils kneel to the Hushed's word (a fight: two veils and a bog hound, 40 XP);
  the list ("By the Hushed's word", "quiet" beside each name); three doors on the Cross in any order: the pie shop and
  the sorry constable's in time, **the tea shop too late** (a woman who cannot say her name; Haru reads it off the
  list and she nods; no line from her, no Anissa in the node); back to the printer. The eighth thumbprint is on the
  barn's door ("Eight cities, and the same thumb.") and on the list's cover. Reward 300 gold, 60 XP, +3 Fear. Closes
  if the recital begins first. The debate (One Hand, by the cross) is the day's other required quest.

### Al-4 The Clock That Waits (secret item)
- **Giver:** a dissident clockmaker. **Accept:** after the courtroom.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 7, `PUZZLES.md` (S-ALM). The Patient Hour; 400 gold, 400 XP, +2
  Influence (Aldermoor).
- **Built (Oct 27; optional; Claude's calls):** "after the courtroom" is the last dawn (the keep is open again; the
  clockmaker who says "I'd give a year to know the hour" on the Mere Stair waits by the keep's gate). The clock tower
  is its own small map behind the hall's clock door. 400 gold, 60 XP, +2 Influence (Aldermoor). Closes when the trader
  sails. Puzzle `quest/puzzles/aldermoor_clock`.

### Al-5 Tea With Lady Rosalind
- **Giver:** Lady Rosalind Stillwater (proposal: Edmund's mother, at court). **Accept:** Edmund in the party.
- **Steps:** a polite conversation over tea where every cup is a debate round; win with **Reason** (Thomas
  Stillwater's record) to make her quietly withdraw from the Regent's council.
- **Reward:** 340 XP, +2 Influence (Aldermoor), +1 Accord Stability; Rosalind attends the Hearing.
- **Built (Oct 27; optional; Claude's calls):** the story already has Rosalind withdraw from the Regent's council at
  the Assize ("Sat."), so the tea is at the last dawn in her townhouse (18 x 12), and she asks to be persuaded she was
  right, and that Aldermoor should sit at Eightgate. Three cups, three answers each (Scripture, Reason, Compassion);
  the Reason answer (her father Thomas's record) wins a cup, and two cups win her: she will sit for Aldermoor at the
  Hearing (she does in Chapter 12 either way) and the Accord gains +1 Stability (`STABILITY.rosalindTea`). A lost pot
  can be poured again. 40 XP, +2 Influence (Aldermoor). If Al-1 is done, Edmund gives her the sixth letter. Closes when
  the trader sails.

**The seven built Oct 27, together:** XP is small (Claude's call, the levels pass's rule: the line without side quests is unchanged, and a player who does all seven ends each chapter at most one level over its target; `tests/sideQuestsLate.test.ts`).
