# Bloodlines: Echoes of Zetwal: the storyline

*Design pack, written Oct 14 (owner approved the work that day). Source of truth: `docs/quest/QUEST-BUILD-GUIDE.md`
(the guide). Everything the guide marks locked, settled or as an owner decision is kept exactly. Anything new in this
file is marked **(proposal)** and needs the owner's yes. Companion files: `CAPITALS.md`, `SIDE-QUESTS.md`,
`PUZZLES.md`, `COMBAT.md`, `SECRET-ITEMS.md`.*

---

## 1. How the story is cut

The guide splits the game into six Acts (5.5). The owner's new rule (Oct 14) is that **Chapter 1 is Pòdlimyè only**,
ending when Gigi leaves the city with Yari. So Acts stay as the big shape and Chapters are the playable units, one
per place (proposal for the numbering):

| Act (guide 5.5) | Chapter | Place (capital) | Minutes (guide) | Party level |
|---|---|---|---|---|
| I: The Mark | 1. The Festival of the Gaze | Zetwal (Pòdlimyè) | 35 | 1 to 3 |
| I: The Mark | 2. The Charter | Xaraguá (Yucayeque, proposal) | 40 | 3 to 8 |
| II: The Alliance Road | 3. The Ledger | Al-Doria (Bab al-Dhahab, proposal) | 30 | 8 to 11 |
| II: The Alliance Road | 4. The Trial of Blades | Ardencia (Cenizal, proposal) | 45 | 11 to 14 |
| Midpoint | 5. The Parley | Eightgate | 20 | 14 to 15 |
| III: The Debt Revealed | 6. The Stolen Standard (any order) | Skarragol (Ordvik, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 7. The Fog Files (any order) | Kuroshi (Kirinoura, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 8. The Dying Flame (any order) | Jwaladesh (Agnipur, proposal) | 30 | 15 to 21 |
| III: The Debt Revealed | 9. The Regent's Keep | Aldermoor (Kingsmere, proposal) | 35 | 21 to 24 |
| IV: The Muster | 10. The Muster | Zetwal again (Pòdlimyè) | 10 (+ side content) | 24 to 25 |
| V: The War of the Harbor | 11. The War of the Harbor | Xaraguá again | 30 | 25 to 28 |
| VI: The Claim | 12. The Claim | Eightgate again | 20 | 28 to 30 |
| Epilogue | The Hearing | Eightgate | 10 | 30 |

**The three roads (Chapters 6 to 8) in any order (proposal for levels):** the first of the three the player enters
is set to levels 15 to 17, the second 17 to 19, the third 19 to 21. The region's level is fixed the first time the
party steps into it, so a region never re-scales under the player's feet. See `COMBAT.md` 6.

**Chapter order (owner, Oct 15):** Ardencia is **Chapter 3** and Al-Doria **Chapter 4**: after Xaraguá falls, Gianna
goes home to Zetwal and then, at old Patricio's request, to Ardencia. So the guide's slice (Zetwal + Xaraguá +
Ardencia, about 2 hours) is simply the first three chapters. Samira joins in Chapter 4, after Ardencia, so the
Ardencia beats never need her.

**The two eras** (guide 1.2, 6.1): the **Present** (Gen IV, Gianna's party) and the **Echo** (Gen II, the Alliance
War, about fifty years ago). In the Echo Gianna *is* young Patricio; Caona joins the Echo party when Yari is in the
Present party, and Benny joins it once Azzy has joined. Anissa never enters the Echo: she holds the door.

---

## 2. The game intro (animated) (proposal)

**The full shot-by-shot storyboard for the animator is `docs/quest/intro/STORYBOARD.md`** (Oct 15), with layout
frames and style references in `docs/quest/intro/ref/`. The outline below is what it expands.

The owner wants Zetwal finished first and opened by an **animated game intro**. Proposal: a 75 to 90 second pixel
sequence, skippable after the first viewing, in the 320 x 180 frame, built from the three Gen I flashback stills the
guide already budgets (10.2) plus simple pans, fades and sprite moves. No dialogue boxes; a few lines of narration
over chiptune.

| Beat | Picture | Narration (draft) |
|---|---|---|
| 1 | Black. A single sun glyph glows and becomes the Gaze lamp. | "The goddess Elodie wove the realm. She does not rule it. She remembers." |
| 2 | Gen I still: cane fields, Crown ships, Mother Solange writing names by lamplight; the first archive burns. | "When the Crown called her people property, the temple wrote down their names." |
| 3 | Pan across Zetwal fifty years ago: barricades in the plaza, red revolutionary coats, Brasador banners arriving by sea, Yaguana canoes on the shore. | "Fifty years ago Zetwal rose. Marshal Patricio led it. Lord Benny of Ardencia came to fight beside him. Caona's scouts found every road." |
| 4 | Close shot: two hands press together a gold sun Locket and an iron signet; the halves glow. | "They sealed the alliance with a token made in two halves." |
| 5 | The Sun Accord on a table, bound with seven silk ribbons. A hand cuts the seventh ribbon's page away and slides it under the others. The camera does not show whose hand. | "The Crown sailed home. The Accord was signed. Six clauses were read aloud." |
| 6 | Dissolve to the present: the festival plaza at dawn, lanterns, a thousand people. A small girl with two hair puffs hides behind a young woman in a blue robe. | "Fifty years later, the city still remembers its dead aloud." |
| 7 | Title card: the painted Kay Soley crest downscaled to 32 x 32, then **BLOODLINES: ECHOES OF ZETWAL**. | (music swells; "Press A") |

Beat 5 is the only new illustration. Beat 6 reuses the plaza map. Music: the main theme, with Rael's low-brass
ostinato hidden under beat 4 (the guide's theme note, 5.8).

---

## 3. The chapters

Each chapter lists: where, the beats, who joins, the Echo scenes, the boss, the level range, and what the player
learns. **Built** means the beat already exists in `quest/src/data` (dialogue, quests, books). Details not in the
guide are marked **(proposal)**.

### Chapter 1: The Festival of the Gaze (Pòdlimyè, Zetwal)

- **Where:** Pòdlimyè, the capital of Zetwal (owner, Oct 14). Sections: the Festival Plaza, Accord Square with the
  Hall of the Accord, the Iron Market, the Old Harbor, Solèy Heights, the Limyè house, the Temple Island, the Temple Archive and the
  Cane Road. See `CAPITALS.md`.
- **Level range:** 1 to 3. **No fights in Chapter 1** (owner decision), **except one** (owner, Oct 15): the
  cane-field boar on the Cane Road, the battle tutorial. XP comes from story beats, lore books, side quests and that
  fight. Chapter 1 is the gentlest the game ever gets: every mechanic (the Echo, shops, gear, side quests, battles)
  is taught here, before the Crown moves.
- **Beats:**
  1. The animated intro (proposal, Section 2).
  2. The Festival of Elodie's Gaze. Anissa joins as the follower; Gianna sets out with soup and akasan. **Built.**
  3. Elodie's address from the stage; she will leave for the Throne as Zetwal's envoy. **Built.**
  4. Gigi and Anissa walk her to the east gate. "The Gaze sees you both. So do I." **Built.**
  5. Anicette, in Patricio's study, gives Gianna the **Sun Locket**: "Two halves of a promise. This half is ours." **Built.**
  6. **First Echo** (tutorial): Gianna becomes young Patricio in his war room the night before the signing. The Crown's
     clerks have sent six clauses; the seventh is "still being copied". Benny will not sign pages he has not read.
     Patricio hides his night orders under the window seat (anchor). **Built.**
  7. The rope bridge to the Temple Island has fallen. **Signature puzzle: the Chain Bridge** (the Echo winch and the
     iron pin). **Built.**
  8. Old Patricio at the Gaze lamp: it will not take a flame. Anissa's light wakes and lights every lantern in the
     city. "Are you scared of me?" "Never." **Built.**
  9. A canoe at the island dock: **Yari** brings the warning. Crown ships in Xaraguá's harbor, a Charter of
     Protection, a clause no one in Xaraguá was shown. Gianna agrees ("Of course I'll come." / "Tell me everything
     on the way.", remembered), but asks for time (owner, Oct 15): "Soon, Yari.
     I have work at the archive, and a few things around the city to finish before I can go." Yari joins the party
     and waits at the dock, warning them about the boar on the Cane Road, and that the Crown boards every boat:
     Gianna will need papers. **Built** (sets `story.yari_asked`).
  9a. **The Envoy's Papers** (owner, Oct 15: one task at the Hall of the Accord; in one visit since Batch D, Oct 19).
     The Hall clerk can write envoy papers, but they need the Head of State's seal, which Elodie sent to the
     engraver to be re-cut. The engraver walks it in himself (decision B, Oct 19): he finished it at sundown, and
     when every lamp in the city lit at once he thought "tonight, somebody is going to need a seal". He looks
     Gianna over ("Her eyes. Your grandfather's ink on your fingers"), hands the seal to the clerk, who writes and
     seals the papers on the spot and keeps it, and walks out. The Chancellor signs them in her office off the
     gallery, late that night, in front of the Crown's consul (decision D, revised Oct 19): he walks in from the
     gallery to ask why the lamps lit an hour ago, and lays his own paper on her desk: Zetwal should "acknowledge
     His Majesty's protection of the southern waters". No clause is named and the Throne is not mentioned (Chapter
     2's council keeps its reveal). The Chancellor refuses ("Nobody signs in that chair while she is away") and
     signs Gianna's papers in front of him. Yari: "That is the paper. They nailed it to our customs house." He
     glances at Anissa and moves on (no line about it), asks Gianna if Zetwal's envoy has anything to say
     ("Zetwal's waters are its own." / "Say nothing."), and leaves the Hall for good. Yari will not sail without
     the papers. **Built** (`story.envoy_papers`, key item `envoy_papers`; a Chapter 1 objective). Saves from
     before Oct 19, made mid-errand (sent to the Iron Market, or holding the seal), still finish.
  10. **Before the tide. Built:** the city's side quests and the boar fight, with Yari in the party, in the order
      the city lies (Batch D, Oct 19), which the Journal and the gold arrow follow: the island first (*Work on the
      island*: the cane cutter at the name stones, the archivist, the temple's Ash Wars record), then the papers at
      the Hall, the Cane Road (the shimmer by the gate, then the boar), the city's errands on the way back (*Errands
      on the way back*: the debate on the lawn, the soup vendor, the old neighbor, Grandmother, the guard, the
      ferryman), and the island again (*Unfinished business*: the books back, Rose-Aimée written into the list, the
      cutter told). Talking to Yari again asks whether you are ready (first the papers, then the boar; then every
      side quest, which must all be done before she sails: owner decision, Oct 18), and "Let's go" starts the
      departure. Chapter 1's choices are remembered (`choice.*`) and come back later: Mother's farewell (at
      Grandmother's and at the dock), Yari's answer (at the canoe, and "I told you about the two ships. Count
      them." in Yucayeque), the soup vendor's greeting (when the soup is delivered), the envoy's answer (at
      Xaraguá's council: "They asked Zetwal to thank them for protecting our waters too. We didn't."), and "Stay
      away from her" to the veiled woman (the hooded stranger on the plaza). **The Last Evening (proposal), on
      top:** the city reacts to the lights (built lines). A Quiet Crown watcher on the Cane Road notices Anissa
      (built). Elodie's absence is felt: the Hall clerk shows Gianna the blank seventh line on the Marshal's stone
      and the seven-ribbon note.
  11. **Departure at dawn. Built** (decision C with the whistle, Oct 19). At first light both grandparents walk
      down to Yari's dock on the Temple island, acted out: Anicette across from the bridge with food for the water
      (Grandmother's kasav) and "Ask them what we promised. Ask them, not the Crown"; old Patricio down from the
      temple with his old Marshal's whistle (key item `marshal_whistle`, no stats; it matters again in Chapter 10).
      Anissa: "Goodbye, Zetwal." Yari and Anissa board, the grandparents wave from the dock, and Yari's canoe and
      the voyage scene take them out (no ferry). Card: **Chapter 1 complete.** Chapter 1 ends here (owner rule).
- **Who joins:** Anissa (support, from the start), Yari (at the dock).
- **Echo scenes:** the war room (built), the Echo plaza camp (built: the cook, scout, drummer, soldier), the Chain
  Bridge bridgehead (built), the Temple under scaffolding (built: the lampwright, the builder). Proposal: one more,
  **the Name Stones** (side quest *The Seventh Stone*, `SIDE-QUESTS.md` Z-4), which leads to the Pòdlimyè secret item.
- **Boss:** none (no fights).
- **What the player learns:** the Echo and anchors; Anissa is far more than shy; the Accord has seven ribbons and six
  clauses, and the Marshal's stone has a blank seventh line; the Ash Wars records disagree (Cendre ford: forty dead,
  not four hundred); Elodie took the name Limyè "for the goddess"; the Quiet Crown wants quiet people, and noticed
  Anissa; the Crown is moving on Xaraguá.

### Chapter 2: The Charter (Xaraguá)

**Built Oct 16 (first half, the living city):** Chapter 1's end card closes onto the ferry (`travel.next`), which
lands at Yucayeque's pier. Crown marines are taking half the fishers' catch; the first fight here (`pier_marines`:
two Crown Marines and a sergeant, drawn from their townsfolk sprites until art drop 2). The fisher's thanks and the
news that Anaco is sick; the caney; Cacique Anaco (Patricio swore an oath on the stones; his unanswered letter);
the elders' council, where the Governor's liaison names "the seventh clause of the Accord, as signed" and Yari
defies the council, Gianna asks it to wait, and the vote is held until proof comes; Governor Thorne in the customs
house (a veiled warning about Yari and Anissa). The Journal's last objective, *What the stones remember*, points to
the petroglyph cave: the next build (lamp oil, the flooded cave, the Echo of the first oath). The Mountain Path's
ambushes switch on after the pier fight. **Not built:** the Yield step (beat 1's sergeant) waits for the Yield
mechanic.

**Built Oct 17 (the petroglyph cave, beats 3 to 5):** once Thorne has spoken to Gianna, the lamp-oil seller lends
an oil lamp (key item; she still has never met her supplier, Rael clue 6). The lamp opens the petroglyph cave in the
cassava gardens (`xaragua-cave`): the carved chamber is flooded. In the Echo it is dry, a spring keeper explains the
two sluice gates, and young Patricio opens the lower one (`anchor.cave_sluice`); back in the present the chamber has
drained for fifty years, and the wall shows the drum song with its last bar worn away (`clue.drum_pattern`). The
**Echo of the first oath** plays on the Areíto Plaza's dance ground: Caona, Patricio and Benny swear it, the drummers
play the whole song (`clue.drum_full`), and **Caona joins the Echo party** (`story.caona_joined`; an archer, moves in
`data/battles.ts`). The **rhythm lock**: tap the song on the standing stone by the record house (A or a tap on
each mark, normal or slow tempo; `engine/rhythm.ts`, `ui/RhythmPanel.ts`); the record house (`xaragua-record`)
opens, and the oath stone reads: "The harbor stays with the people who fish it. We fight for each other, and no paper
of any crown will part us." Three names, no seventh clause (`story.oath_found`). The Journal's next objective,
*Proof for the elders* (`story.proof_shown`), is the next build. **Proposals for the owner:** the oath's wording,
the drum song itself (three bars of long and short marks), Caona's Echo stats and moves, and young Benny's look.

**Built Oct 21 (the side quests and the dusk gate; owner decision Oct 19):** after Thorne's warning the lamp-oil
seller will not lend a cave lamp under the Governor's spyglass ("Then let him watch us do ordinary things all day");
she lends it at dusk, when the night canoe brings her oil. Until dusk the Journal (*Until dusk*) follows the five
quests on the Quests page: **Cut Nets**, **The Hutia's Hoard** (growth puzzle M-XAR-1), **Oil From a Stranger** (the
ash thumbprint at the hill camp, Rael clue 6), **Medicine for the Cacique** (growth puzzle M-XAR-2 at the scouts'
camp; Anaco sits up and speaks) and the debate **Owned or Remembered**. The free city then takes on the evening, and
the cave, the areíto, the lock, the proof and the attack play without a break. Every quest closes at the attack.
Details and Claude's calls: `SIDE-QUESTS.md`, Yucayeque. Measured on the scripted route (Oct 21, side-quest rewards
counted): the chapter is 1,640 steps and 49 map changes (was 1,023 and 37); the party is level 8 at the Crown attack
(was 7), level 9 at Thorne (even; was 8) and level 10 at the end (was 9). An arrow-follower climbs the mountain once.

**Review 1 fixes (Oct 22; `reviews/2026-10-21-review-1.md`; Claude's calls under the owner's Oct 20 rule):**
- **Anaco's surrender** (finding 4): the captain comes with six marines, not two; they form a firing line at the
  council circle's opening and level their muskets past the children at the elders behind them. Yari draws ("Not one
  step further, captain."); the captain: "Muskets! Over the children. On the old ones in the circle." and "Any arrow,
  and the elders die first. Lower it, girl." Only then does Anaco walk out and say "You are no use to me in chains".
- **The occupied city, shorter** (finding 3): the healer asks for the fever bark in the refuge scene itself; the
  arrow takes the bark tree on the way into the city; the lamp-oil seller and the marine posted at her shutters are
  one stop (the marine walks over to close the shutters and lets slip the Governor's cellar); the customs register
  completes the three clues, and the Governor and the cellar are in the same building. **Word to the cave is folded
  into the visit:** on leaving the customs house after seeing Anaco, the fisher's boy (who counts the Crown's boots)
  slips out from behind the weaver's house, takes the message and runs it west. The papers are shown at the east
  barricade on the way to the beach, and **Yari and Anissa meet Gianna at the sea cave mouth** at the lowest tide
  (they come up the sand from the waterline; Yari's "He knew I would" is said there). Measured on the scripted route:
  from the refuge to the sea cave, 191 steps and 9 map changes (review 1: 441 and 19 for held to blockade); the
  Journal loses the *Word to the cave* objective. The caney marine still gossips if the player goes there.
- **The fights** (finding 1): the patrol's musketeer wears a breastplate, Thorne's tip names the light, and a boss's
  Grudge climbs to +50% (`COMBAT.md` 12 and 12.5).

**Built Oct 17 (the Crown attack, the midpoint; owner decision Oct 17: Anaco is taken prisoner):** Gianna and Yari
bring the oath stone's words to the elders in the caney (`story.proof_shown`); as the vote turns, the harbor guns
fire (Thorne's watcher saw where they went). Marines storm the caney: a fight (`caney_breach`: marine, musketeer,
lieutenant, level 6) while the elders get out the back. A Crown captain then takes the caney and leads **Anaco away
a prisoner** (`story.anaco_taken`): "Take the Limyè girls and go. The cave." Out the back into the burning plaza,
down to the village, where the sergeant from the pier blocks the trail west (`village_patrol`, level 5); the old
fisher sends them to the resistance in the petroglyph cave, the chamber the party drained in the Echo. The refuge
(`story.refuge`): the camp leader says every marine knows Yari's face, but no Crown hand may touch Zetwal's envoy;
**Yari and Anissa stay hidden** (Yari leaves the active party; Anissa stops following, so her hints are quiet too),
and Gianna walks on alone. A card closes the first half. **The occupied city:** from the night of the attack the
same maps change (flags, not new maps): townsfolk and vendors keep indoors, the beach market is burned, marines stand
at checkpoints, Crown banners go up, the caney is the Governor's (a captain below the duho), Thorne gloats, the
outdoor maps take a dusk wash and play the Crown's march, and the Mountain Path's ambushes stop. The Journal's next
objective, *Where is Anaco held?* (`story.anaco_found`), is the next build (the occupied city's second half).

**Built Oct 17 (the occupied city, second half up to the blockade):** Gianna walks alone and has no fights (the
Accord protects the envoy). Marines' barricades close the trails north (to the plaza) and east (to the beach) until
she shows her envoy papers (`story.papers_checked`). Three people place Anaco: the lamp-oil seller in her doorway
(four marines and a hammock, round the back of the customs house, and down the stairs), the customs clerk's register
of detained persons, which the envoy has the right to read under the Accord's "article three" (proposal: a gold
bribe was planned, but dialogue cannot spend gold yet), and the marine at the caney doors, who gossips. With all
three, `story.anaco_found`. The healer in the cave asks for fever bark from the tree by the gardens' spring pond;
Gianna demands the visit from Thorne under the Accord (`story.visit_granted`) and takes the cellar stairs behind
the clerks (`xaragua-cellar`). Anaco, steadier for the bark, tells her the one gap in the blockade: at the lowest
tide the sea cave on the Canoe Beach opens to the sea, where his grandmother's people hid their canoes
(`clue.sea_cave_route`; it ties in with the secret S-XAR). Back in the cave, Yari hears it and plans the escape for
the next low tide (`story.escape_planned`). Also: the Charter posted over the customs notice, voices behind shutters.
The Journal's next objective, *Through the blockade* (`story.escaped`), is the next build: the Thorne boss at the
blockade, Yari's escape, and the voyage home to Zetwal.

**Built Oct 17 (the boss and the escape; Chapter 2 is complete):** in the cave Yari says "tonight" (the lowest tide
of the month); Yari rejoins, and Anissa comes too (owner approved: the sea cave is dark and she glows). The beach's
sea cave opens (`xaragua-seacave`): a tunnel past tide pools to the ledge where the Yaguana hid their canoes. As the
old canoe goes into the water, Thorne's longboat bars the sea mouth: **boss, Governor Thorne** with a marine and a
musketeer (`thorne_blockade`, level 9; sword cane, a pistol shot he takes his time aiming, and the Charter read
aloud to the whole party). He goes over the side; his marines fish him out ("The Charter stands!"). The canoe slips
the blockade to a Zetwal trader, and the voyage plays home (`xaragua_zetwal`, by night). On Pòdlimyè's long pier,
Grandmother and Grandfather wait with the pigeons' news; the city is uneasy (Crown sails off the south reef);
Patricio meets Caona's granddaughter and asks Gianna to go to Ardencia and ask Lord Rael, Benny's son, to stand
with Xaraguá ("Then ask him why his father said yes"). `act2.complete`; the card: *Chapter 2 complete, The
Charter. Next: Chapter 3, The Trial of Blades*. The Cane Road's ambushes switch on (`story.zetwal_return`).
`?chapter=3` starts here.

**Owner decision (Oct 15), the shape of the chapter:** Xaraguá is first shown at its most beautiful: the normal,
living city for the first half of the chapter. **Midway, the Crown attacks** and the city is **occupied**: the same
maps change to their occupied versions (Crown soldiers, checkpoints, curfew, burned stalls, Crown banners on the
customs house). Yari, Anissa and the Yaguana hide until the fighting is over. **Gianna can move freely as a diplomat**
(Zetwal's envoy, under the Accord's protection), so she scouts, carries messages and gets papers while the others
hide. She **helps Yari escape**, and they sail **back to Zetwal**; then **Patricio asks her to go to Ardencia**,
Zetwal's greatest ally and neighbour, to ask for help for the Taíno. **The attack unsettles every other city for the
rest of the game:** from Chapter 3 on, each capital shows unrest (patrols, refugees, prices, rumours of war).

The beats below are from before this decision. They are kept where they fit, and re-cut as follows (proposal, for the
owner to confirm):
- **First half (the living city):** beats 2 to 5 (Anaco and the elders, the lamp-oil seller, the petroglyph cave and
  the Echo of the first oath). Beat 1's harassment on the pier stays as a small fight; the battle tutorial itself
  moved to Chapter 1's boar.
- **The attack (the midpoint):** a night landing; the harbor guns; the council hall taken. The party hides in the
  petroglyph caves with the resistance.
- **Second half (the occupied city):** Gianna walks the occupied streets on her envoy's papers (talk past
  checkpoints, find who is held where, carry word to the caves), while Yari cannot be seen. Beat 6's debate and beat 8's
  suspended Charter no longer fit an occupation and are dropped (proposal); the elders' choice comes back in
  Chapter 11, the War of the Harbor.
- **The escape (the boss):** Gianna gets Yari out past **Governor Thorne**'s harbor blockade (beat 7's boss, now at the
  docks), and they sail for Pòdlimyè.
- **Back in Zetwal:** the news lands; the city is uneasy for the first time. Old Patricio asks Gianna to go to
  Ardencia and ask its lord for help. This replaces beat 9's lead to Al-Doria (see Section 6, question 12).

- **Where:** Yucayeque (proposal name), the capital of Xaraguá, House Yaguana. Green mountains, a harbor full of Crown
  ships, the areíto plaza, the petroglyph caves.
- **Level range:** 3 to 8. The first battles after the Chapter 1 boar.
- **Beats (before the Oct 15 decision; re-cut above):**
  1. Arrival by sea. Crown marines harass fishers on the pier: **the first battle** and the battle tutorial
     (proposal): Attack, Guard, then
     Surge, then the Yield step on the marine sergeant.
  2. Cacique Anaco, Yari's father, is ailing. The elders' council is ready to accept the Charter "to keep the peace".
     Yari defies them in front of everyone. **Governor Thorne** watches from the customs house.
  3. A lamp-oil seller has supplied the resistance for years and has never met her supplier (Rael clue 6).
  4. The Charter's legal claim rests on the Seventh Clause. The cave of petroglyphs holds the Yaguana's own record of
     the oath their warriors swore to the alliance. **Signature puzzle:** the flooded petroglyph cave, the Echo sluice,
     and the rhythm lock at the areíto plaza.
  5. **Echo: the first oath.** At the areíto fifty years ago, Caona, Patricio and Benny swear the first oath. Caona's
     words promise the harbor stays Yaguana. Caona joins the Echo party from here (Yari is in the party).
  6. With the cave record, Gianna speaks for Xaraguá at the elders' council (a debate using the Concord system).
  7. Thorne moves to seize the record. **Boss: Governor Thorne** in the customs house.
  8. Thorne falls but the Crown's ships stay: the Charter is suspended, not torn up (proposal). The elders will wait
     if Gianna brings proof that the Seventh Clause was never agreed by Xaraguá. Anaco blesses Yari's road.
  9. Clue to the next step: the elders say the Dorini bankers of Al-Doria witnessed and held a signed copy of the
     Accord.
- **Who joins:** Yari formally (she was in the party since the dock); Caona in the Echo party.
- **Echo scenes:** the areíto first oath; the sluice at the cave mouth during the Revolution; Caona's scouts' camp.
- **Boss:** Governor Thorne (level 8).
- **What the player learns:** Xaraguá was never shown the Seventh Clause; Caona fought for a promise; the Crown's
  "protection" is a land grab in a legal coat; someone unknown has armed the resistance for years.

### Chapter 3: The Trial of Blades (Ardencia)

All of this chapter's key beats are the guide's (5.6, 5.8) and are kept exactly.

- **Where:** Cenizal (proposal name), Ardencia's fortress city in the fire-cracked highlands.
- **Level range:** 8 to 11 (straight after Xaraguá, owner, Oct 15). Rael is level 11, three above the party at the
  chapter's start (orange: a hard fight by design, see `COMBAT.md`).
- **Beats:**
  1. Ardencia's law: no outsider gets an audience with the Lord unless she proves herself in a duel. **Envoy
     Cresswell** of the Crown watches from the gallery.
  2. **Azzy** is assigned as Gianna's escort. They bond. He believes in his father's honor and in Benny's legend.
  3. The elders are fat and corrupt; the poor seem neglected. Rebel groups quietly feed them (a safehouse side quest
     shows it to players who look).
  4. Concord debate in Ardencia: is a thief who feeds the hungry a thief? (Rael clue 7.)
  5. **Boss: Rael the Ruthless, the Trial of Blades**, three phases: Measured (he leaves Anissa an opening: Shield
     Anissa), Unleashed (War Cry and guards: Surge through), Cornered (Reign of Ashes: a clean Surge plus Comfort).
     Party members are **Bound**, never knocked out. He is defeated and survives.
  6. Under Brasador law the loser answers one question. Gianna asks why her mother never spoke of her father. Behind a
     screen from the envoy, Rael says coldly that **Gianna and Anissa are his daughters**, Elodie is his wife, and it
     changes nothing. The Locket and his signet are two halves of one token. **His signet glows.**
  7. The envoy re-enters. Rael declares for the Crown and orders the party seized. The signet glows again.
  8. **The Escape** (Echo puzzle sequence, signature): through **Benny's smuggler tunnel**, opened by an anchor Benny
     left; the forge-fortress lava channels on the way. Guards fire; the shots land **wide**. Azzy sees his father
     give the order and chooses Gianna. **Azzy joins.** The soldiers who follow him become **Free Brasador**.
  - **Owner direction (Oct 19), to settle in the Chapter 3 outline (no Chapter 3 building until Chapter 2 is
    accepted):** Rael **wins** the Trial of Blades (a scripted loss: no Game Over screen for it). He carries **one of
    the legendary items**. **Azzy makes a distraction** so the party can escape. This changes beats 5 to 8 above
    (Rael "is defeated and survives"; "the loser answers one question"; Azzy "chooses Gianna" during the escape), so
    the outline must rework them and ask the owner where they conflict.
  9. Gianna now believes her father is a traitor who sold Xaraguá. She cannot learn otherwise until near the end.
  10. **Echo callback** (after the escape, optional but strongly signposted): young Benny recognizes the Locket on
      Gianna's neck and says something he could not have said before; in the Present, old Benny in the keep (guards
      looking away) says the same.
  11. The dual claim opens: Gianna through Zetwal and Ardencia; Azzy through Ardencia.
- **Who joins:** Azzy (Blade-Knight); Benny in the Echo party; Free Brasador as an allied group (Fear, price 6).
- **Echo scenes:** Benny's smuggler tunnel; the Brasador march to the sea; young Benny's callback.
- **Boss:** Rael the Ruthless, Fight 1 (level 11).
- **What the player learns:** Rael is her father; the token is one token in two halves; the signet glows (the player
  sees it, Gianna does not understand); the shots missed; nobody died.
- **As built (Oct 21, branch `chapter3`):** beats 5 to 8 follow the owner's decisions of Oct 20 and the families of
  Oct 21, not the list above: Rael wins (a scripted loss, the party Bound; La Promesa de Benny holds him at 1 HP);
  the winner's question with the court cleared (Rivera silent at the door, Jaime gone with the elders); the signet
  glows at the lie and Anissa says so, unheard; the forge cell, Azzy's key, the Echo of Benny's armory (the channels
  and the lever), the bell, Azzy joining in the dark; Benny's tunnel (Amanda unbars it), the shots wide on Joaquin's
  order, the camp. Levels 8 to 11 (the party leaves at 11). The whole list of Claude's calls is in
  `docs/quest/reviews/2026-10-20-chapter3-outline.md`, "Built (Oct 21)".

### Chapter 4: The Ledger (Al-Doria)

*Built Oct 22 (branch `chapter3`): see `docs/quest/reviews/2026-10-20-chapter4-outline.md`, "Built (Oct 22)", for what is in
the game and its Claude's calls; the beats below are the earlier design.*

- **Where:** Bab al-Dhahab (proposal name), the port and caravan city of House Dorini.
- **Level range:** 11 to 14 (after Ardencia, owner, Oct 15).
- **Beats:**
  1. The bazaar. Samira Dorini appraises the Sun Locket on sight ("half of something; the other half is worth more")
     and invoices Gianna for the opinion.
  2. The guild vault hides the signed Accord copy. The Merchant-Prince (proposal: the title rotates among guild
     families and is now held by Layla Dorini, Samira's mother) refuses: the guild profits from Crown trade.
  3. **Echo: the Dorini ledger.** Young Yusuf Dorini, keeper of the ledger, records what the Dorini were promised for
     signing: trade preference in Crown ports, paid for with Xaraguá's harbor. The Unpaid Debt has a price tag.
  4. **Signature puzzle:** the guild vault (weights and the ledger cipher), solved in both eras.
  5. The vault copy has seven ribbons; the seventh page is sealed with the Throne's own wax (proposal): only the Throne
     Archive can open it lawfully. Also in the vault: a note in Benny's hand, "I will not put my name to this page."
  6. Samira appraises a Brasador coin found in the Xaraguá resistance's oil money: "This coin has been somewhere else"
     (Rael clue 4).
  7. **Boss: Guildmaster Qasim** (proposal name), the war-profiteer who runs the vault, hiring blades mid-fight.
  8. Samira is expelled from the guild for helping; she joins. Layla says nothing in public; in private she pays
     Samira's debts (proposal).
  9. (Before the Oct 15 order, this beat sent Gianna on to Ardencia. Now Ardencia comes first, so this chapter needs a
     new way in, from Ardencia, and a new way out, to the Parley at Eightgate. Proposal: Benny's refusal note, found in
     Ardencia, names the Dorini as witnesses, and the vault's sealed seventh page can only be opened at the Throne
     Archive, which leads to the Parley.)
- **Who joins:** Samira Dorini (Alchemist).
- **Echo scenes:** Yusuf's counting room the week before the signing; the vault being built.
- **Boss:** Guildmaster Qasim (level 14).
- **What the player learns:** the allies were paid; the Accord had a price; Benny refused in writing; Brasador money
  is turning up where it should not be.

### Chapter 5: The Parley (Eightgate, the midpoint)

- **Where:** Eightgate, the Throne city at the centre of the realm.
- **Level range:** 14 to 15. Under a flag of truce: no boss (proposal: one Echo skirmish in the Archive).
- **Beats:**
  1. Elodie is Zetwal's envoy under Crown eyes. The **Lord Regent Aldric Vane** receives them under a flag of truce,
     calm and three moves ahead.
  2. **Signature puzzle:** the Throne Archive, reading the Accord in both eras.
  3. **Echo: the sealing of the Accord (owner decision, Oct 14; see open question 2).** The signed original arrives at the Throne
     Archive; the seventh page is read to the Throne's clerk alone and sealed. Patricio signs under protest of time;
     Benny refuses aloud; Caona is not in the room.
  4. **The Seventh Clause is read aloud** for the first time in fifty years: Xaraguá's harbor to the Crown, "to be
     revisited" (proposal wording in `CAPITALS.md`).
  5. Gianna confronts Elodie about Rael. Elodie explains why she hid the marriage (the children's safety, the claim).
     She can say only one true thing under Crown eyes: *"Believe what your Locket tells you, not what his mouth does."*
     In private: *"He should never have tested you."* Gianna takes it to mean the duel law.
  6. The Regent offers terms. Gianna refuses. The realm opens: three roads to allies (Skarragol, Kuroshi, Jwaladesh)
     and, after them, Aldermoor.
- **Who joins:** none.
- **Echo scenes:** the sealing; a young Thomas Stillwater copying the Crown's record in the gallery (setup for Ch. 9).
- **Boss:** none.
- **What the player learns:** the Seventh Clause; Elodie's two lines; the Regent's patience; allies must be won.
- **Built (Oct 22; the outline `reviews/2026-10-21-chapter5-outline.md`, its "Built" section, and its second review):**
  the clause is read aloud in the Parley at Elodie's demand, before every house (owner decision, Oct 21). Claude's
  calls on the staging, recorded there: no Echo skirmish (no fight inside the walls); in the Hall Elodie cuts Gianna
  off before "Rael" so the Crown's clerk never hears it; Hollis reads the clause only (no signature, no witness knot)
  and the Regent states no new law; Patricio *sealed the binding* and signed nothing on the seventh page (so his "I
  would remember" in Chapter 2 is literally true and evasive; see open question 13); Elodie answers "He didn't let
  them hit me" with a hand on Anissa's head and no words; the roads open east, Skarragol first.

### Chapters 6 to 8: The three roads (any order)

The guide's Act III: Skarragol, Kuroshi and Jwaladesh, 30 minutes each, any order. Each wins an allied group by its
price (guide 6.3) and a companion. Levels by visit order (Section 1).

#### Chapter 6: The Stolen Standard (Skarragol)

- **Where:** Ordvik (proposal name), the fjord-and-steppe camp-city of House Ironvow.
- **Beats:** the great horse-fair; the clan's sacred standard is stolen and **Bayarmaa** is blamed; the council
  (proposal: led by **Torvald**, Bayarmaa's father) is ready to sell the fleet to the Crown for blockade compensation;
  **signature puzzle:** the frozen fjord crossing and the horse-herd stealth sequence; **Echo: Sarnai's raid** that
  broke the Crown's supply line; the thief is a Crown-paid raider chief; **boss: Noyan Grimvald** (proposal name);
  Bayarmaa clears her name and joins. Azzy is greeted as a royal grandson of the steppe (his mother's people) and
  hates it (comic, proposal).
- **Who joins:** Bayarmaa (Raider) and her horse (proposal name: **Salkhi**, "wind").
- **Price:** Wealth 10.
- **Learns:** Sarnai broke the Crown once by speed; the Crown buys whole councils; Azzy's mother's people are watching.

#### Chapter 7: The Fog Files (Kuroshi)

- **Where:** Kirinoura (proposal name), the misted harbor city of House Suzumori.
- **Beats:** a city of informants; **Haru Suzumori** introduces himself as "definitely not a spy" and tails them; the
  spymaster council (proposal: **Kaede Suzumori**, Haru's mother) orders neutrality; **signature puzzle:** the fog
  maze with lantern signals, rotating screens and the Echo spy map; **Echo: Lady Sayo's network** feeding Patricio the
  Crown's troop movements; the files name **the buyer's mark** but not the buyer (the betrayal foreshadow, guide 5.6)
  and show **a second trail: gold flowing out of Ardencia** to places no one should be funding (Rael clue 3); **boss:
  the Paper Fox** (proposal), a broker selling Kuroshi's files to the Crown; Haru refuses the neutrality order and joins.
- **Who joins:** Haru Suzumori (Shadow agent). **Price:** Influence 10.
- **Learns:** the Crown has bought (or will buy) one ally; Ardencia's gold goes somewhere secret.

#### Chapter 8: The Dying Flame (Jwaladesh)

- **Where:** Agnipur (proposal name), the fire-temple city of House Agnivansh.
- **Beats:** the sacred flame is running out of oil and the treasury is empty; the priests (proposal: led by **Meera**,
  Vikram's mother) want to hide the flame's failing; **Vikram** challenges Gianna to a duel over an argument (a
  sparring battle, he is out of breath at the end either way); **signature puzzle:** the relay of lamps and mirrors (a
  lamp lit in the Echo stays lit); **Echo: Arjun's charge at the Crown's harbor chain**; the oil was cornered by a
  Crown-backed hoarder; **boss: Seth Dhanraj** (proposal), the oil hoarder; Vikram defies the priests and joins.
- **Who joins:** Vikram (Fire duelist). **Price:** Wealth 8.
- **Learns:** a faith can be starved by a market; Arjun broke a chain; the Crown pays for shortages.

### Chapter 9: The Regent's Keep (Aldermoor)

- **Where:** Kingsmere (proposal name), the Crown's moorland capital, House Stillwater's homeland.
- **Level range:** 21 to 24.
- **Beats:**
  1. Ordinary Stillwater people are not villains (guide 1.2): the city is tired, polite and watched.
  2. **Edmund Stillwater**, ridiculously polite, apologizes before hitting a press-gang; a dissident faction wants
     protection from the Quiet Crown's purge (Fear, price 8). His mother, **Lady Rosalind Stillwater**, sits at court
     (proposal).
  3. **Signature puzzle, part one:** the archive in the Regent's keep (infiltration). The party finds the Crown's pact
     with Rael and a ledger of what he took. The ledger shows the gold leaving his hands into coded accounts on "the Ash
     Road" (proposal; see open question 6). Gianna reads it as greed.
  4. **Echo: the Crown's own record of the Seventh Clause**, written by young **Thomas Stillwater**, with a margin note
     that Xaraguá was never asked.
  5. The party is caught. **Signature puzzle, part two:** the courtroom "who is lying" trial before the Regent. Gianna
     wins by exposing a lying witness with Thomas's record.
  6. **Boss: the Hushed**, the hidden head of the Quiet Crown's hijacked cells, revealed inside the Regent's court
     (guide 5.3; see open question 3 for how this fits Rael's founding).
  7. Edmund defies the Regent and joins. The dissidents pledge.
- **Who joins:** Edmund Stillwater (Guardian).
- **Echo scenes:** Thomas copying the record; the Crown's war council hearing of Benny's refusal.
- **Boss:** the Hushed (level 24).
- **What the player learns:** the Crown always meant to keep the harbor; Rael took the Crown's gold; the Quiet Crown
  has been bent to hunt Anissa by the Regent's people.

### Chapter 10: The Muster (Pòdlimyè, return)

- **Where:** Pòdlimyè again. The Cane Road's ambushes switch on now: `story.zetwal_return` is set on arrival (built
  flag, listed in `LATER_STORY_FLAGS`).
- **Level range:** 24 to 25.
- **Beats:**
  1. The armies assemble on the plaza and the Cane Road. Old Patricio inspects them with his whistle (proposal: the
     whistle from Chapter 1 calls the Free Brasador to order).
  2. **Seat the feuds:** three mediations with Concord (guide 5.4): Dorini merchants against Ironvow raiders, Suzumori
     spies against Agnivansh priests (the burned temple), and the Stillwater dissidents against everyone.
  3. Anicette's *Ash Wars Gossip, Volume Two* (her own recollection: the fourth Ash Wars account) is now returned in
     Chapter 1 by the built side quest The Overdue Shelf (owner approved, Oct 14). This beat becomes Anicette
     talking it through with players who have read all four, who can tell which is false (proposal).
  4. **The Betrayal.** The Crown out-pays the least-paid of Al-Doria, Skarragol, Kuroshi and Jwaladesh (ties to
     Dorini). The betrayer is revealed as a secret member of the Quiet Crown. **Exposed route:** with the Kuroshi
     evidence and that house's price at least 60 percent paid, Gianna confronts them here and turns them into a late
     ally.
  5. The fleet sails for Xaraguá.
- **Who joins:** the allied armies.
- **Echo scenes:** the plaza camp on the morning of the signing (the same place, armies then and now).
- **Boss:** none (the Cane Road has random encounters at levels 22 to 25).
- **What the player learns:** who the Crown bought; that unity has to be built, not inherited.

### Chapter 11: The War of the Harbor (Xaraguá)

- **Where:** Xaraguá's harbor and the hills above it.
- **Level range:** 25 to 28.
- **Beats:**
  1. A multi-stage battle with the allied armies (army numbers decide reinforcements; `COMBAT.md` 11).
  2. **Flank fight against the betrayer** (unless turned at the Muster).
  3. **The Harbor Turn:** Rael's army appears on the flank. The player is given a **trust choice**:
     - **Trust:** the party holds; Rael's army turns on the Regent's flagship; Rael fights beside Gianna against the
       **Regent's champion**. Better rewards, stronger epilogue.
     - **Strike:** a hard four-phase fight against Rael's vanguard; he only binds, never kills; when his army breaks,
       his signet dark, he tells her the truth. The Regent's fleet escapes intact. Stability drops; Azzy is furious.
  4. Either way, **Gianna learns the truth here**: Rael is Elodie's secret husband, his Crown alliance was a farce, he
     runs a shadow government against corruption, and he founded the Quiet Crown, whose autonomy let it be bent
     against Anissa. Private line: "My father kept his oath and it cost him everything. I wanted to know what would
     happen if someone kept the goal instead."
  5. The Regent retreats to Eightgate.
- **Who joins:** Rael fights as a guest in the Trust route (proposal: guest only, not a roster member).
- **Echo scenes:** Caona's last stand at the harbor in the Revolution (proposal), the place where the debt began.
- **Bosses:** the betrayer (level 26), then the Regent's champion (Trust, level 28) or Rael (Strike, level 28).
- **What the player learns:** the whole truth about Rael, and that she now has to decide what to do with it.

### Chapter 12: The Claim (Eightgate)

- **Where:** the Throne Hall at Eightgate.
- **Level range:** 28 to 30.
- **Beats** (rulebook Section 8, as the guide asks): Gianna, standing on the Throne tile, declares her **Claim**. The
  Regent declares a **Challenge**. **Boss: Lord Regent Aldric Vane.** Azzy, who also has a claim, chooses on the spot:
  renounce in her favor, share it, or (dark route) Challenge her too.
- **Who joins:** everyone present.
- **Echo scenes:** none in battle; after it, the Throne Archive's Echo shows young Patricio, Benny and Caona one last
  time (proposal), and Caona's oath is spoken aloud in both eras.
- **Boss:** the Lord Regent (level 30).
- **What the player learns:** the board game's Claim and Challenge, in story form.

### Epilogue: The Hearing

Kept exactly from the guide (5.6, 5.7). Rael surrenders to Gianna's Throne. Witnesses: the Ardencian rebel leaders he
fed and armed, the family of the treasurer he held captive for years without trial, the underground cells he funded,
Elodie, Azzy, Anissa (and old Benny and old Patricio may speak). Verdicts:

- **Pardon with conditions** (best; confirmed terms): Rael serves as **Warden of Oaths**, in a way that honors Benny,
  working in the light. The Ash Ledger becomes the Throne's **Office of Oaths**, used only to find and fight oppression.
  He publicly confesses he heads the Quiet Crown and dissolves its secret chain of command, frees every captive, makes
  restitution to the treasurer's family, and brings the corrupt elders to account.
- **Exile** (middling) or **Execution** (dark).

Endings (Accord Stability, guide 5.7): **The Just Throne** (canon), **The Hollow Throne**, **The Iron Throne**.
Rael at the Hearing: "I never asked the eggs how they felt. I am asking now."

---

## 4. Threads that run through every chapter

| Thread | Where it shows | Pays off |
|---|---|---|
| The Seventh Clause | Ch. 1 (six clauses, seven ribbons, blank stone line), Ch. 2 (Xaraguá never shown it), Ch. 4 (the sealed page, Benny's note), Ch. 5 (read aloud), Ch. 9 (Thomas's record) | Ch. 12 and the Hearing (Rael as Warden of Oaths enforces it) |
| Rael's eight clues (guide 5.8) | signet glow (Ch. 3), Elodie's two lines (Ch. 5), Kuroshi ledger trail (Ch. 7), Samira's coin (Ch. 4), Free Brasador "the arrows missed" (Ch. 3 onward), the lamp-oil seller (Ch. 2), the Ardencia debate (Ch. 3), nobody dies in his fights (all) | The Harbor Turn (Ch. 11) |
| The four Ash Wars accounts | Zetwal temple record (Ch. 1, built), Kuroshi spy ledger (Ch. 7), Crown chronicle (Ch. 9), Anicette's recollection (Ch. 1, The Overdue Shelf, built) | A Concord bonus and a Hearing line when all four are read (proposal) |
| The Overdue Books (proposal) | *Ash Wars Gossip* Volume Two (Anicette) and the missing Volume One (built hints) | Volume One turns up in Elodie's rooms at the Seat (Ch. 5 side quest) |
| Anissa finds her voice | shy lines (Ch. 1), first Surge (Ch. 2), Calm attacks by Hushers (Ch. 2 on), she speaks at the Muster (Ch. 10, proposal), she speaks at the Hearing | Her Surge animation grows more confident each chapter |
| The rebel safehouses | one per capital (guide 5.4) | lead to the Ash Ledger and Rael's real work |
| Secret items | one per capital, each a side quest plus an Echo puzzle (`SECRET-ITEMS.md`) | small story and power rewards; the Seat item changes the Claim |

## 5. Tone

Serious main story with comic companions (guide 13.9): Yari's hutia, Samira's invoices, Bayarmaa's horse who talks
more than she does, Haru's "definitely not a spy", Vikram out of breath, Edmund's apologies and tea. **No jokes in the
Rael, Anissa or Hearing scenes.** No real faith is ever shown as a cult; the Quiet Crown is fictional and tied to no
real people (guide 7.3).

## 6. Conflicts and open questions found while writing (for the owner)

1. **The capital's name.** **Settled (owner, Oct 14): Pòdlimyè**, "Port of Light". In Kreyol *pò* is "port"
   (*pòt* is "door"), and French port names fuse into one word (Port-de-Paix is Pòdepè). Replaces the earlier
   "Pòt Limyè". A fluent speaker confirms the spelling (Nov 18).
2. **Where was the Accord signed?** **Settled (owner, Oct 14):** in Pòdlimyè's plaza, as the built lore says (the
   *Alliance War* book, the Marshal's Stone, the war room). Eightgate's Echo is **the sealing** of the signed
   original in the Throne Archive, where the seventh clause is hidden.
3. **Who is the Hushed?** **Settled (owner, Oct 14):** the Regent's agent, who has taken over the cells that hunt
   Anissa and whom the members *believe* to be the head of the Quiet Crown. Rael is the true founder above all
   cells, unknown to every member. Two reveals: the Hushed unmasked in the Regent's court (Chapter 9), Rael's
   confession at the Hearing (late). In Chapter 1 the recruiters and the veiled woman speak of "the Hushed" as their
   leader and never of Rael.
4. **Patricio in every land.** The Echo party is always Patricio's (guide 6.1), so he must have been in every capital
   during the war, including the Crown's own Aldermoor. Proposal: he went to Kingsmere under a flag of truce to
   negotiate the peace (that is when Thomas Stillwater met him). Owner to confirm.
5. **Samira's Daftar vs gold.** The guide's class table says Daftar "converts Wealth to heal, damage or buffs", but the
   owner decision of Oct 14 says Wealth is a score that is never spent. Proposal in `COMBAT.md`: Daftar spends
   **gold**, and scales with the realm Wealth score without lowering it.
6. **The Aldermoor ledger.** The guide says the party finds "a ledger of what he took and where it really went". If it
   shows where the gold really went, Gianna learns Rael is good in Chapter 9, which breaks the locked rule that she
   learns only near the end. Proposal: the ledger shows the gold vanishing into coded accounts; only after the Harbor
   Turn can Haru read the code.
7. **Chapter 1 vs Act I.** **Settled (owner, Oct 14):** the story is told in **chapters**, not acts; Chapter 1 is
   **The Festival of the Gaze** (Pòdlimyè). The other chapter titles stay proposals until each is built.
8. **The slice.** **Settled (owner, Oct 15):** Ardencia is Chapter 3 and Al-Doria Chapter 4, so the slice (Zetwal,
   Xaraguá, Ardencia) is the first three chapters.
9. **The betrayer's companion.** If the Crown buys a house whose companion is in the party (Samira, Bayarmaa, Haru or
   Vikram), the guide does not say what the companion does. Proposal: the companion stays, defies their house a second
   time, and gets one scene (and a stat boost) in Chapter 11.
10. **Gen III rulers.** Layla (Al-Doria), Torvald (Skarragol), Kaede (Kuroshi), Meera (Jwaladesh) and Rosalind
    (Aldermoor) are proposed as the ruler or elder each companion defies, matching guide 5.3a ("Gen III is their
    parent, often the ruler or elder they defy"). Owner to confirm each.
11. **Section 14 of the guide** said 240 x 160; fixed to 320 x 180 (Oct 14).
12. **Chapter order after Xaraguá.** **Settled (owner, Oct 15):** Ardencia is Chapter 3, Al-Doria Chapter 4. Still
    open: how Al-Doria is reached from Ardencia (proposal in Chapter 4, beat 9).
13. **Does old Patricio know who he is sending her to?** The Lord of Ardencia is Rael, Gianna's father (Elodie's
    secret husband). Does Patricio know about the marriage when he sends her to Ardencia?
    *(Oct 22, for the owner's confirmation list, no pop-up: Chapter 5's sealing has young Patricio seal the binding
    of six pages under protest while a seventh is read to the clerk alone. He signed nothing on it. The payoff is
    Chapter 10's, at Pòdlimyè.)*
14. **Who is caught in the occupation?** Proposal: Cacique Anaco is held under guard in his own house; the elders are
    split; the resistance hides in the petroglyph caves.

## Owner direction (Oct 21): the families are bigger

Rael is **Benny's son** (QUEST-BUILD-GUIDE.md, settled; an older line here said "grandson" and is corrected).

**Rael's mother is Rahel**, and Rahel's mother is **Patricia** (owner, Oct 21), great-grandmother to Gianna, Anissa
and Azzy, also in the game. Rael has six siblings, all in the game, each met along the way and helping in a quest or
side quest. Azzy calls each of them *Titi* (aunt) or *Tío* (uncle).

| Sibling | Parents | Azzy calls them |
|---|---|---|
| Amanda | Benny and Rahel (Rael's full sister) | Titi Amanda |
| Kayla | Rahel and a man from the Asian continent | Titi Kayla |
| Aiyana | Rahel and the same man (Kayla's full sister) | Titi Aiyana |
| Jordyn | Rahel and a Black military man | Titi Jordyn |
| Zelia | Benny and the current mother of Ardencia | Titi Zelia |
| Joaquin | Benny and the current mother of Ardencia | Tío Joaquin |

- **Benny has four children:** Rael, Amanda, Zelia and Joaquin.
- **The Ardencia record** ("Alonso, Benny, Rael, Azriel, and no others recorded"): Benny's other children were
  struck from it for their protection.
- **Old Benny and his wife Nancy,** and **Rahel,** are met at other points. Claude's call, to confirm: Nancy is the
  "current mother of Ardencia", Zelia's and Joaquin's mother.

**Elodie's siblings:**
- **Coralie, "Tati Coco"** to Gigi and Anissa. She lives in a foreign land, an artist and clothing designer for
  royals. Bumped into along the way, she helps them through a quest.
- **Sebastian**, a world-renowned organist who plays across the realm for fame. Bumped into along the way, he helps.

**Rael's royal guard (Chapter 3):**
- **Azriel Rivera** heads it. He fought beside Rael in the Ash Wars; Azzy (Azriel Rodriguez) is named after him.
- **Jaime** is a strong mage and Rael's advisor.

Both are very strong opponents and fight beside Rael in the Trial.

Each person's role and the place they are met are settled one by one with the owner (the owner's suggestions list:
`docs/quest/design/FAMILY.md`).
