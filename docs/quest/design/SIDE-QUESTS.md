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
| Z-4 | The Seventh Stone (secret) | Pòdlimyè | Ch. 1 | 1 to 3 | no | yes |
| Z-5 | Bread With No Debt (safehouse) | Pòdlimyè | Ch. 1 | 1 to 3 | no | yes |
| Z-6 | Muskets in the Cane | Pòdlimyè | Ch. 10 | 22 to 25 | yes | yes |
| X-1 | Cut Nets | Yucayeque | Ch. 2 | 3 to 6 | yes | no |
| X-2 | Oil From a Stranger (safehouse) | Yucayeque | Ch. 2 | 4 to 7 | optional | no |
| X-3 | The Hutia's Hoard | Yucayeque | Ch. 2 | 3 to 8 | no | yes |
| X-4 | Where the Canoes Sleep (secret) | Yucayeque | Ch. 2 | 5 to 8 | yes (cave) | yes |
| X-5 | Medicine for the Cacique | Yucayeque | Ch. 2 | 5 to 8 | yes | yes |
| A-1 | Appraise This | Bab al-Dhahab | Ch. 3 | 8 to 11 | no | no |
| A-2 | The Missing Saffron | Bab al-Dhahab | Ch. 3 | 8 to 11 | yes | no |
| A-3 | Sweet Water (safehouse) | Bab al-Dhahab | Ch. 3 | 8 to 11 | no | yes |
| A-4 | The Uncashed Note (secret) | Bab al-Dhahab | Ch. 3 | 8 to 11 | no | yes |
| A-5 | Invoice for the Crown | Bab al-Dhahab | Ch. 3 | 9 to 11 | optional | no |
| Ar-1 | Bread at Night (safehouse) | Cenizal | Ch. 4 | 11 to 14 | optional | no |
| Ar-2 | The Treasurer's Daughter | Cenizal | Ch. 4 | 11 to 14 | no | yes |
| Ar-3 | The Elders' Feast | Cenizal | Ch. 4 | 12 to 14 | yes | no |
| Ar-4 | The Old Lord's Errand (secret) | Cenizal | after Ch. 4 | 14 to 16 | if seen | yes |
| Ar-5 | The Arrows Missed | Free Brasador camp | end of Ch. 4 | 14 to 16 | no | no |
| Se-1 | Volume One | Eightgate | Ch. 5 | 14 to 15 | no | no |
| Se-2 | Four Voices | Eightgate | Ch. 5 | 14 to 15 | no | no |
| Se-3 | Deserters' Road | Eightgate | Ch. 5 | 14 to 16 | yes | no |
| Se-4 | The Unknotted Ribbon (secret) | Eightgate | Ch. 5 (ends Ch. 12) | 14 to 30 | no | yes |
| Se-5 | A Seat for Every House | Eightgate | Ch. 5 (ends Ch. 12) | 14 to 30 | no | no |
| S-1 | Salkhi Has Opinions | Ordvik | Ch. 6 | road tier | no | no |
| S-2 | The Fleet for Sale | Ordvik | Ch. 6 | road tier | no | no |
| S-3 | The Winter Stores (safehouse) | Ordvik | Ch. 6 | road tier | yes | yes |
| S-4 | The Cairn of Nine Riders (secret) | Ordvik | Ch. 6 | road tier | yes (plateau) | yes |
| S-5 | Grandson of the Steppe | Ordvik | Ch. 6 | road tier | optional | no |
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

**Built (owner approved, Oct 14):** the three Chapter 1 side quests in `quest/src/data/sideQuests.ts`, with their
lines in `quest/src/data/dialogue/zetwal.ts`. None has a fight.
- **The Overdue Shelf** (senior archivist, Temple Archive): get back the ferryman's *Tides of the Southern Reach*,
  the soup vendor's *Ninety Ways With Pumpkin* and Anicette's *Ash Wars Gossip, Volume Two*, in any order. Anicette
  asks one question first: how many dead the temple healers counted at Cendre (you must have read the temple record).
  Volume Two then joins the Tales shelf, margins and all. 60 gold, 50 XP, +1 Influence. (The approved Echo step,
  Volume One on the shelf fifty years ago, was dropped: the Ash Wars were 25 years ago, so the book did not exist yet.)
- **Soup for the Cousins** (soup vendor, plaza): carry bowls to the old neighbor, the town guard and the ferryman.
  Teaches the minimap and tap to talk. 3 Clay-pot soups, 30 gold, 40 XP, +1 Influence.
- **A Name in the Cane** (cane cutter, Cane Road): his grandmother ("Grann") is on no name stone. Read the stones
  (a line for "the cutters whose names the Crown did not keep"), use the Echo by the east gate to meet her young
  (Rose-Aimée, called Forty-One by the overseer), write her into Mother Solange's list in the Archive, tell him.
  Sun-stitched charm, 50 XP, +1 Influence. (Grandmother, not great-grandmother: fifty years back she was young.)

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
- **Giver:** the cane cutter on the Cane Road (built NPC) mentions the veiled woman at the old mill (built). **Accept:**
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

### Z-4 The Seventh Stone (secret item)
- **Giver:** the mourner on the Temple Island (built NPC). **Accept:** talk to her after `story.anissa_woke`.
- **Steps, puzzle and reward:** see `SECRET-ITEMS.md` 1 and `PUZZLES.md` (S-ZET). Solange's Quill and the skill *Say
  Their Names*; 80 gold, 40 XP, +1 Influence (Zetwal). **No fighting.**

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

## Yucayeque (Xaraguá)

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

## Bab al-Dhahab (Al-Doria)

### A-1 Appraise This
- **Giver:** Samira (before she joins). **Accept:** she bets you cannot spot a fake.
- **Steps:** 1) Three stalls each sell one fake among real goods (a coin, a carpet, a scale weight). 2) Inspect each
  item: the fakes have a tell (the coin's edge, the carpet's knot count, the weight's stamp). No fight. 3) Report all
  three to Samira.
- **Reward:** 150 gold (she pays her bet, then invoices you for the lesson: net 100), 110 XP, +1 Influence (Al-Doria).

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
- **Reward:** 120 gold, 130 XP, +2 Influence (Al-Doria), *The Ash Thumbprint (3 of 9)*.

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
- **Giver:** Azzy: "My father's poor are not starving. I do not know why." **Accept:** after meeting Azzy.
- **Steps:** 1) At night, follow a covered cart through the lower town without being seen (a short stealth path;
  seen: a fight with hired guards, level 12). 2) The cart feeds a soup line; the cook will not say who pays. Grey
  thumbprint on the barrels. 3) Azzy: "This is not the elders' charity."
- **Reward:** 150 gold, 150 XP, +1 Influence (Ardencia), *The Ash Thumbprint (4 of 9)*.

### Ar-2 The Treasurer's Daughter
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
- **Giver:** old Benny in the keep (the guide's callback scene). **Accept:** after the Echo callback.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 5, `PUZZLES.md` (S-ARD). La Promesa de Benny; 250 gold, 180 XP, +2
  Influence (Ardencia).

### Ar-5 The Arrows Missed
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

### K-1 Definitely Not a Spy
- **Giver:** Haru (unseen). **Accept:** the hutia notices someone following.
- **Steps:** spot Haru three times as he tails the party (a reflection in a puddle, a moving screen, a pair of shoes
  under a stall). Each time he says "definitely not a spy".
- **Reward:** 200 gold, 220 XP, +1 Influence (Kuroshi); Haru joins a scene earlier with a better opinion of Gianna.

### K-2 The Spy Ledger
- **Giver:** the file house archivist. **Accept:** ask about the Ash Wars.
- **Steps:** 1) The Suzumori ledger of the Ash Wars (one of the four accounts) is in the sealed stacks. 2) Sneak in
  (stealth; seen: a fight with Fog Cutpurses). 3) In the Echo, Sayo's clerk files the ledger under a cipher shelf
  mark; learn it. 4) Find it in the present by the mark.
- **Reward:** 280 XP, +2 Influence (Kuroshi), the ledger book (Ash Wars account 2 of 4).

### K-3 Lanterns for the Lost (rebel safehouse)
- **Giver:** a fisher's family at the marsh edge. **Accept:** talk to them.
- **Steps:** 1) Fishers are lost in the fog marsh (wild section; Lantern Moth swarms). 2) Light the marsh lanterns in
  the right signal order (the signature puzzle's lantern code, simpler). 3) The fishers were hiding a rebel press (grey
  thumbprint on the ink).
- **Reward:** 300 gold, 260 XP, +1 Influence (Kuroshi), *The Ash Thumbprint (6 of 9)*.

### K-4 The Letter in the Floor (secret item)
- **Giver:** the old floor-maker. **Accept:** with Haru in the party.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 8, `PUZZLES.md` (S-KUR). The Nightingale Key; 300 gold, 320 XP, +2
  Influence (Kuroshi).

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

### J-2 The Lamp Relay
- **Giver:** the temple's runners. **Accept:** at the temple steps.
- **Steps:** carry a lit lamp from the harbor to the temple before it gutters (a timing route with wind gusts); in the
  Echo, Arjun's runners show the sheltered alleys (route knowledge; no anchor).
- **Reward:** 250 gold, 220 XP, *Flame-bead bracelet* (fire skills +15%, level 16), +1 Wealth (Jwaladesh).

### J-3 The Anonymous Oil (rebel safehouse)
- **Giver:** a junior priest. **Accept:** talk to him in the temple yard.
- **Steps:** 1) Oil arrives at the temple's back gate at night. 2) Watch the gate; an Oil Enforcer gang tries to seize
  it (optional fight). 3) The jars carry the grey thumbprint.
- **Reward:** 300 gold, 260 XP, +2 Wealth (Jwaladesh), *The Ash Thumbprint (7 of 9)*.

### J-4 Oil for the Little Lamps (secret item)
- **Giver:** a child keeping a street shrine. **Accept:** after Seth Dhanraj falls.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 4, `PUZZLES.md` (S-JWA). The Unbroken Wick; 280 XP, +2 Influence
  (Jwaladesh).

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

### Al-2 The Crown Chronicle
- **Giver:** the keep archive (during the infiltration). **Accept:** find the Ash Wars shelf.
- **Steps:** 1) Take the Crown's chronicle of the Ash Wars (account 3 of 4: "four hundred put to the sword"). 2) In
  the Echo, Thomas Stillwater's colleague is ordered to "write the Brasador wars large"; Patricio sees the order
  (information; no anchor). 3) Note it in the Journal.
- **Reward:** 320 XP, +2 Influence (Aldermoor), the chronicle (with the Echo note that it was written to order).

### Al-3 The Purge List (rebel safehouse)
- **Giver:** a dissident printer. **Accept:** after the courtroom.
- **Steps:** 1) Steal the Quiet Crown's purge list from a Husher cell (fight: Husher, Moor Constable, Bog Hound).
  2) Warn three families. 3) The printer's shop has the grey thumbprint, and so does the list's cover note: someone in
  the Quiet Crown leaked it on purpose.
- **Reward:** 500 gold, 380 XP, +3 Fear (Aldermoor dissidents: price Fear 8), *The Ash Thumbprint (8 of 9)*. The 9th
  is in Elodie's rooms at the Seat (seen in Se-1).

### Al-4 The Clock That Waits (secret item)
- **Giver:** a dissident clockmaker. **Accept:** after the courtroom.
- **Steps, puzzle and reward:** `SECRET-ITEMS.md` 7, `PUZZLES.md` (S-ALM). The Patient Hour; 400 gold, 400 XP, +2
  Influence (Aldermoor).

### Al-5 Tea With Lady Rosalind
- **Giver:** Lady Rosalind Stillwater (proposal: Edmund's mother, at court). **Accept:** Edmund in the party.
- **Steps:** a polite conversation over tea where every cup is a debate round; win with **Reason** (Thomas
  Stillwater's record) to make her quietly withdraw from the Regent's council.
- **Reward:** 340 XP, +2 Influence (Aldermoor), +1 Accord Stability; Rosalind attends the Hearing.
