# Chapter 6, The Stolen Standard (Ordvik, Skarragol; the first road): build outline (Oct 21)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: none found); everything
else is Claude's call with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (Oct 27 to Nov 6 for the three roads, 30
minutes each, levels 15 to 21; the owner's decision that the roads play in a fixed order: **Skarragol 15 to 17**,
Kuroshi 17 to 19, Jwaladesh 19 to 21, so no region-level system is built), the Opus plan review section 6 (the
minimum for Chapters 6 to 8: the city's trouble, its signature puzzle, its Echo, its boss, the companion joins, the
ally's price, the debate as a required quest, two required side quests; the other side quests and the secret item
after the release; placeholders where art has not come), `design/STORY.md` Chapter 6 and section 5 (tone),
`design/CAPITALS.md` 6 (Ordvik), `design/SIDE-QUESTS.md` S-1 to S-5, `design/PUZZLES.md` SIG-SKA, M-SKA-1 and S-SKA,
`design/COMBAT.md` 6, 9.4 (Bayarmaa), 13.2 (Steppe Wolf, Steppe Reaver, Lookout, Zealot) and 13.3 (Noyan
Grimvald; Chief Hrafn as Ironvow's betrayer variant), `design/SECRET-ITEMS.md` 6, `design/FAMILY.md` (no family
member is placed in Skarragol; Azzy's mother's people are Skarragol's, guide 13.7, settled), `QUEST-BUILD-GUIDE.md`
5.4 (Skarragol's row), 6.3 (the price: Wealth 10; gold gifted counts 100 to 1), 7.2 (the debate: Sky-Rider vs
Witness elder, *Oath of blood or oath of sky?*), 8 (Old Norse and Mongolian greetings), 13.7 and 13.9; the Chapter 5
outline (`2026-10-21-chapter5-outline.md`, section 14: continuity into this chapter) **with its review's fixes
folded in** (`2026-10-21-chapter5-outline-review.md`: Skarragol lies **south-east** of Eightgate, not north; the
party arrives at 15 to 16, not 14; objectives pay 25, books 10; there is no `support` role and `withdraws` fires at
0 HP; Mediate needs Influence 5; the Ironvow envoy looks at Azzy once in the Hall); and the built game on branch
`chapter3` (worktree `wt-ch3/quest` at commit 889ed60: `data/quests.ts` ACT3, `data/dialogue/ardencia.ts`,
`data/battles.ts` (Qasim's phases, `withdraws`, `enter`, `ally` moves, `onSurge`), `data/encounters.ts`,
`data/rpg.ts` (fighters as data), `data/sideQuests.ts`, `data/debates.ts`, `engine/stage.ts`, `engine/tiledMap.ts`
(two collision layers, one per era), `engine/mapValidation.ts` (Echo zones walkable in both eras; anchors),
`tools/maps/ardencia.ts`, `tools/chapter-starts.ts`, `tools/level-curve.ts`, which I ran). Levels use the game's
curve (`xpBase 50, exponent 1.6`): 15 at 3,410, 16 at 3,808, 17 at 4,222, 18 at 4,653, 19 at 5,105.*

**Sim-check.** The worktree is mid-edit by the Chapter 4 helpers (its `rpg.ts` imports an `ACT4` that `quests.ts`
does not export yet), so the fights below were simulated against a snapshot of commit 889ed60 with a scratch script
outside the repo: `/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch6sim/grimvald-sim.ts`
(it adds Bayarmaa and the Skarragol enemies as data in memory and plays each fight 30 times with a fair bot, on the
built Story difficulty, the only one in `config.ts`). Numbers in section 5.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit, never a target and never jokes; the comedy (Salkhi, Azzy as a royal grandson, Samira pricing a fleet) stays away
from Anissa; recommendations only where they genuinely help; placeholders wherever art has not arrived; the release
is Nov 22, so this chapter gets the main story, the Echo puzzle, the boss, the companion, the ally's price, the
debate as a required quest, **two** required side quests, mystery quests and arrows, Game Over, and nothing else until
after the release.

---

## 1. Where the chapter starts (measured against the Chapter 5 outline and its review)

- **Chapter 5 ends** at Eightgate's Iron Gate: the one gate that opens, Coco waving with both arms, the card *Chapter
  5 complete, The Parley. Next: Chapter 6, The Stolen Standard* (`act5.complete`). The realm map (`realmMap.ts`) puts
  the Seat at (68, 64) and Skarragol's capital at **(91, 91)**: the road runs **east and then south** across the
  plateau, not north (the Chapter 5 review, 3.9: Skarragol's cold is altitude, not latitude; Elodie's line in the
  fitting room becomes "they would go east first, up onto the winter plateau"). The land journey `seat_skarragol`
  uses whatever Chapter 5 built for the caravan road (a land mode of `VoyageDef`, or the card): captions "East out of
  the Eight Gates, along the Ironvow road..." / "...up onto the Winter Plateau, where the grass goes grey." `?chapter=6`
  starts on the Winter Plateau road outside Ordvik (section 3).
- **The party on the route:** Gianna, Yari, Azzy (front row), Samira (back row), Anissa; **level 15 to 16**: the
  Chapter 5 review's recount puts the tool at about 3,750 to 4,075 and a real player at about 4,200 (16) after Chapter
  5's dials (`noXp` on the watched scenes, the Archive's books paying Influence only), with `CHAPTER_LEVELS` 5 at
  `to: 15`. This outline assumes **tool 3,750 (15), played 4,200 (16)**; the simulator corrects it on day 1 (section
  5). Echo party: Patricio, Caona, Benny (all joined). Gold about 900 to 1,100 less what the Outfitter took.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's note, the Dorini pass, the Brasador coin,
  Yari's petition copies (given out), any faith token. **Flags that matter here:** `clue.seventh_clause_read` (the
  clause was read before every envoy, Ironvow's included, so Torvald's council has heard "what the Crown wrote
  Xaraguá down as"), `belief.rael_traitor` (unchanged), `party.azzy`, `party.samira`, `story.benny_joined`,
  `ally.free_brasador` (the Chapter 3 pattern this chapter's price follows), `side.seats.stage1` (the chamberlain
  waits for the houses' tokens: Skarragol's is the first, given in the price scene, not a chest), the Seat's
  Influence, `choice.refusal`.
- **What the realm said about Skarragol in Chapter 5:** Ironvow's envoy in the Hall, "a big woman with no standard on
  her brooch": "I would swear to this on the standard. We have no standard this season. Ask me again when we do."
  She looked at Azzy once (the review's addition). Elodie, in the fitting room: "Their sacred standard is stolen and
  their council is selling the fleet to the Crown for blockade money. Kuroshi will not speak to anyone until
  Skarragol has." So the player arrives knowing the trouble, the stakes and why this road is first.
- **What Gianna believes:** her father sold Xaraguá and them. The player holds Rael clues 1 (the signet), 2 (Elodie's
  two lines) and 4 (the coin) and the "nobody dies" pattern. Nothing in Skarragol touches the Rael thread except one
  gossip book (*Who Married Whom*, section 7.4) and Azzy's mother's people (S-5), which is Azzy's thread, not Rael's.
- **Chapter 6's target is 15 to 17** (`chapterLevels.ts`, already there). Ordvik's furrier stocks tier-16 gear. The
  boss is at the tier's top, 17.
- **Stale lines in the design, fixed here:** `STORY.md`'s chapter table still says "any order" and "15 to 21" (the
  Oct 20 decision fixes Skarragol at 15 to 17); `CAPITALS.md` 6 gives the Moot Tent two sizes (22 x 16 in the table, 36
  x 26 in the seat paragraph): the larger is used, as Chapter 5 did for the Hall; `SIDE-QUESTS.md`'s road-tier rewards
  (200 to 320 XP a quest) are three times what the built curve can take at these levels (section 5) and are scaled
  down here; `COMBAT.md` 9.4 gives Bayarmaa skills but no stat line: section 9 proposes one, sim-checked.

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 5 outlines. Flags are proposals in the built naming style
(`story.*`, `side.*`, `clue.*`, `echo.*`, `anchor.*`, `choice.*`, `party.*`, `ally.*`). "Shown" means walked and acted
on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`).

### Beat 0: The winter road (the realm map, then skarragol-plateau)

- The land journey `seat_skarragol` (section 1). One line on the road, as the caravan halts where the grass turns
  grey: Samira, pulling her coat tight: "Cold is a cost nobody invoices. I intend to be the first." Anissa: "The
  horses are watching us, Gigi." Gianna: "Let them." (She is right: the herds are the chapter.)
- Lands at `skarragol-plateau`, spawn `seat_road` (the south-west corner, the road in from the Seat).
  `story.skarragol_arrived` is set on landing: the plateau's ambush layer switches on (`winter_plateau`,
  section 5). The road itself is safe tiles; the grass either side is wild, as Ardencia's flats are built.
- Journal: **The winter road** (done `story.skarragol_arrived`).

### Beat 1: The Horse-Fair in uproar (skarragol-fair, the hub)

- The plateau road comes down to the fair's east gate (a gap in a ring of corrals). Inside: corrals of horses, felt
  tents, trading mats, the longship quay's lane off the north side, the **Moot Tent** in the middle of the gathering
  field with the **empty standard pole** before it (the first thing the camera lands on: a tall pole with horse-tail
  streamers and no standard; the gate's own clue from Chapter 5 paid off), the Saga Tent, the food tent, the furrier,
  the horse-trader, the contract board, the debate corner by the trading mats (a Sky-Rider and a Witness elder
  already at it, one passing line each), a Crown **surveyor** with a measuring chain walking the quay lane (the sale,
  shown before anyone says it).
- Staged as the party walks in: two **horn-riders** lead **Bayarmaa** across the field toward the Moot Tent, her
  hands unbound but a rider at each shoulder, and a grey horse, **Salkhi**, following three steps behind and stopping
  when they stop (shown: `enter` the three, `walk` to the tent, the horse a beat late). A trader's crier on a
  barrel: "The council sits at the morning horn! The fleet, the Crown's gold, the thief's daughter!" Bayarmaa does not
  look round. Salkhi does (`face: player`), and this is the first thing the horse says, to nobody: "They are taking
  her the long way so everyone can look. I am walking slowly so everyone can look at me." (The horse talks. It is
  the fair's joke, not anyone's at Anissa; nobody remarks on it, which is the joke.)
- Then the S-5 hook, shown: a rider in a white felt coat with a silver mare on it (the **envoy of Azzy's mother's
  people**, section 7.2) sees Azzy across the field, stops dead, dismounts, and **bows to the ground**. Azzy keeps
  walking. The envoy stays bowed. Azzy walks faster. Yari: "Azzy. The man is in the mud." Azzy: "I did not put him
  there." (Comedy, two lines, away from Anissa.) The envoy's quest opens later (section 7.2: automatic when Azzy is in
  the party, which he is).
- Samira, at the quay lane: "Eleven hulls. The Crown's man has measured nine. Two more and they are sold." (Her
  pricing; it stops at the Moot Tent's door.)
- Journal: **The empty pole** (done `story.fair_seen`, the step trigger at the pole; `noXp`: a watched scene).

### Beat 2: The Moot (skarragol-moot, the seat of government)

- **The Great Moot Tent:** a long aisle of standard poles (every clan's but one) to the **chieftain's seat** and the
  **empty pole** beside it (a second, smaller one: the sacred standard's own place inside); off the aisle the
  **lawspeaker's tent** (the Law of the Moot on painted hides, the three Moot books), the **skalds' and horn-riders'
  tent** (messages; the horn-master), the **guest-hostage tent** (the Crown's envoy lives there as the steppe's
  hostage-guest, under a Crown pennant: the Crown's offer in a chest), the **plunder store** (the furrier's better
  stock, section 7.4). People: **Torvald** (the chieftain, Bayarmaa's father, big and tired), **the lawspeaker**
  (old, the only one sitting), **Hrafn** the raiding jarl (for the sale: "a fleet that cannot raid is firewood"),
  **the trading jarl** (against it, for the price), **the Crown's hostage-envoy** (Aldermoor violet, courteous, a
  ledger), the **horn-master**, two horn-riders with Bayarmaa, and Salkhi's head through the tent flap (an NPC at the
  door tile; she is not allowed in and does not care).
- Staged: Gianna gives the envoy's papers to the horn-master, who reads them aloud down the aisle (a walker): "Zetwal's
  envoy, from the Parley." Torvald, not rising: "The Parley. Where the Throne's keeper read us a page. We heard what
  the Crown wrote Xaraguá down as, envoy. Waters." (`clue.seventh_clause_read` is the condition for this line; if a
  save somehow lacks it, the line is "We heard the Parley ended badly.") "And now you want our ships. So does he." He
  nods at the hostage-envoy, who bows exactly.
- **The law, from the lawspeaker** (the chapter's rule, said once, plainly): "The Ironvow swear on the standard or not
  at all. No standard, no oath; and what no oath forbids, the council may sell. The standard was stolen nine nights
  ago. The council votes at the morning horn whether to take the Crown's compensation for the blockade and give it
  the fleet. By the law the vote is lawful. By the law it is also shameful. Both are written." (The Saga Tent's *The
  Law of the Moot* says the same, for the debate's Reason.)
- **Bayarmaa accused.** Hrafn: "She guarded it the night it went. She rode out alone after it, against my order, and
  came back with nothing. The Crown's man says a raider chief has it across the fjord, and the Crown's man has no
  reason to lie." The hostage-envoy: "None at all." Bayarmaa, her first words, flat: "The ice took the trail at the
  thin water. I came back for a horse that could cross it. He said no." Torvald, to his daughter, which is the scene:
  "I said no because the ice took your grandmother's whole raid the year the war ended, and I will not sell the
  fleet to buy you a funeral." (Sarnai's raid, foreshadowed; it is the Echo.)
- **Gianna's ask:** as Zetwal's envoy she asks for Bayarmaa "under the envoy's bond", with the party, to bring the
  standard to the pole before the horn ("If the standard stands at the horn, there is no vote. Your own lawspeaker
  just said so." Lawspeaker: "I did. Twice, by the sound of it."). Torvald: "Take her. If she runs, I sell the fleet
  myself and tell the skalds why." Bayarmaa walks to the party and stands with them (shown), says nothing. Salkhi,
  from the door: "She says thank you." **`party.bayarmaa`**: she joins as a fighter here, so the player plays the
  Raider through the chapter that is hers (section 12: Claude's call on the order; she clears her name in beat 7).
- **The Crown's offer, seen:** the hostage-envoy, courteous: "The Throne's compensation is generous and it is on the
  table until the horn. I would not want the envoy to say she was not shown it." He opens the chest in the
  guest-hostage tent (the Moot book *The Crown's Offer*). Samira looks and says nothing, which is new for her.
- Journal: **The Moot** (done `party.bayarmaa`), then **Until the horn** (the day gate, section 6, `followSide`).

### Beat 3: Until the horn (the required quests, any order; the arrow follows the ground)

- S-5 *Grandson of the Steppe* (the envoy in the white coat, at the fair: section 7.2), S-3 *The Winter Stores* (the
  herder at the folds, on the plateau: section 7.1), the debate *Oath of blood or oath of sky?* (the trading mats:
  section 7.3). The Saga Tent's eight books, the three vendors and the contract board are the day's other stops.
- Bayarmaa walks with the party through all of it, mostly silent; Salkhi waits outside every tent and comments on who
  comes out (section 9: she is an NPC placed by flag on each outdoor map, not a follower).
- When the third completes: dusk on the fair (a flag variant `story.fair_dusk`, as Chapter 4's dusk and Chapter 5's
  evening), fires lit in the corrals, and Bayarmaa, at the fair's north edge where the fjord path leaves: "The ice is
  hardest before dawn. We go now or we go never." Anissa: "Gigi. I'm coming onto the ice." (Earnest; she does.)

### Beat 4: The Frozen Fjord (skarragol-fjord; SIG-SKA part 1, the crossing, section 8)

- The fjord in summer: open black water, floes drifting, the far shore a grey line with smoke on it (Grimvald's camp).
  Bayarmaa: "Here. The trail went in here, and the ice is thinnest where it looks thickest. My grandmother crossed
  it in the war with forty riders and a herd. In winter." Gianna looks at the Locket. Anissa: "It's shimmering on
  the ice, Gigi. On some of it."
- **The puzzle:** the Echo Zones are the floes that were solid ice in Sarnai's winter too; the Echo's ice between them
  is walkable only in the Echo, with black thin patches that are not; the present's floes between other zones are
  walkable only now. Five swaps cross it (section 8). In the Echo only Gianna (as Patricio) is drawn, as the engine
  does; in the present the whole party follows across the floes. Anissa holds the door from the shore floe (the first
  zone) and her hints reach the Echo.
- Journal: **The thin water** (done `story.fjord_crossed`: the step trigger on the far shore's zone).

### Beat 5: Sarnai's raid (the Echo at the far shore; the chapter's Echo scene)

- At the far shore's zone, the Echo plays **Sarnai's raid** (the `onEcho` dialogue, restartable until its flag is
  set): the fjord frozen edge to edge, the Crown's supply camp on the shore where Grimvald's camp stands now (old
  uniforms: the built `crown_marine` look), and **Sarnai Ironvow** (Gen II, Bayarmaa's grandmother, a woman on a grey
  horse) with forty riders hidden in a **herd** of steppe horses on the ice. Patricio (the player) is with her;
  young Benny and Caona are in the Echo party as data but, as the engine draws it, not on the field; Sarnai speaks to
  Patricio alone: "Your Marshal's whistle calls men. Mine calls horses. Three notes: low, high, low. The herd walks
  where the whistle walks, and forty riders walk inside the herd, and the Crown's sentries see horses." She whistles
  (a three-note sound slot); the herd shifts across the ice toward the camp (shown: the horse objects re-placed by an
  `echo.*` flag, walkers walking them); the sentries' sprites turn to watch the horses, not the riders. Sarnai: "Ride
  when I ride. Burn the wagons, take the grain, touch nobody who drops his musket." Patricio (choice, both remembered,
  `choice.patricio_raid`): "And the ones who don't drop it?" / "Zetwal's people are hungry too, Sarnai." Sarnai: "Then
  they learn what a horse weighs." / "Then half the grain goes south on my ships. Decide later who was generous."
  The raid rides (shown: the herd and riders move off into the camp; cannon-less, a horn and hoofbeats; the screen
  shakes once as the wagons go). The scene ends with Sarnai's line to Patricio at the burning wagons: "Tell your
  daughter's daughters: speed is the only thing the Crown cannot buy." (`clue.herd_whistle`, set in the Echo; it is a
  `clue.*` flag, so it survives the return, as Chapter 1's `story.warroom_echo` does.)
- Back in the present, on the far shore: the Journal note *Sarnai's whistle* (low, high, low) and the Journal's
  *Memories* line if the Echo-battle foundation has it; no Echo battle here (section 4).
- Journal: **Sarnai's raid** (done `clue.herd_whistle`; the signature puzzle's XP pays here, section 5).

### Beat 6: The herd (the far shore in the present; SIG-SKA part 2, the stealth)

- Grimvald's camp: a ring of sledges and tents on the shore, two **lookouts** at the two gaps (NPCs, solid, facing
  out), a **herd** of thirty horses grazing on the meadow between the ice and the camp, Grimvald's great tent at the
  back with a horse-tail standard planted before it that is **not** the Ironvow one (his own), and the Ironvow
  standard, when the player gets close enough, tied across his saddle on a tethered black horse (the chapter's
  object, seen before it is fought for).
- **The whistle, as a thing the player does:** at the herd's edge an object ("the herd grazes between you and the
  sledges") offers *Whistle Sarnai's three notes* once `clue.herd_whistle` is set. The three notes sound; the herd
  walks (the horse objects re-placed, shown by walkers) and stands along the path to the west gap; the west lookout's
  placement changes to the meadow's edge, facing the horses ("Horses. Whose are those? Hoy!"), and the gap is open.
  Inside the ring a second object (the picket line) offers the whistle again: the herd shifts to the east gap and the
  east lookout walks to it, and the way to Grimvald's tent is open. Walking "inside the herd" is walking the lane the
  horses make; no timing, no sight cones (section 10: the engine has no stealth system, and the plan has two days).
- **If the player talks to a lookout** (or walks into one before whistling): a horn, and the fight `camp_lookouts`
  (two Steppe Reavers and a Lookout at 17; section 5), winnable, after which the gaps are empty (`story.lookouts_beaten`).
  So the stealth is rewarded (Influence +1 at Skarragol for an unseen approach, `story.herd_unseen`) and the fight is
  the fail-safe, never a soft-lock. Anissa's hints after three minutes stuck point at the whistle.
- Journal: **Inside the herd** (done `story.herd_unseen` or `story.lookouts_beaten`).

### Beat 7: Noyan Grimvald (the camp; the boss, section 5)

- The great tent: a step trigger before it plays the scene (restartable until `story.grimvald_beaten`). **Grimvald**
  comes out and mounts (shown: `enter` from the tent, `walk` to the black horse, the standard across its saddle): a
  big man in a wolf-fur coat with Crown coin sewn in the hem (the placeholder look: fur, a red sash, the coin a yellow
  pixel at the hem). "Ironvow's girl. You came for a stick with a horse's tail on it." Bayarmaa: "I came for the oath
  on it. You took that too. Give it back and ride." Grimvald, who was paid: "Paid men don't ride home, girl. Ask the
  Crown." He names it himself, once, which is the chapter's lesson shown by the man it bought: he does not care who
  hears. The fight `fjord_grimvald`: three phases (Mounted, Unhorsed, the standard broken from his hand by a Surge),
  nobody dies (`withdraws` at 0 HP, his and the reavers'), section 5.
- **After, on the map (the Parley; the economy foundation's Yield is not needed):** Grimvald on his knees, Bayarmaa with
  the standard in both hands (shown: she walks to the black horse, cuts the tie, walks back to the party: the
  chapter's picture). Three things happen in order:
  1. **The Crown's purse:** in his tent, a chest with the Throne's seal on its lid and a receipt in the hostage-envoy's
     hand: "for the recovery of a sacred object, to be held until the council's vote" (`clue.crown_pays_raiders`: the
     Crown pays a raider to steal the oath-object so the council can sell lawfully: "the Crown buys whole councils",
     shown as a receipt the player reads, not a line someone says).
  2. **Grimvald's end** (a choice, both remembered): **"Bind him and bring him to the Moot. Let the council hear him say
     'Ask the Crown.'"** (the design's spare; `choice.grimvald_spared`; +1 Influence at Skarragol; he is on the map at
     the Moot in beat 8 and says it) / **"Ride. Tell every raider on the plateau what happened here."** (Azzy's line;
     `choice.grimvald_broken`; +1 Fear; the plateau's reaver groups lose weight for the rest of the chapter). Nobody
     kills him in either.
  3. **The way back:** Bayarmaa: "His horses know the fjord's head. We ride round, not across." A card with the
     fjord's head and the fair's fires at dawn (the only card in the chapter: a second crossing would be the puzzle
     twice). Lands at the fair's north edge at first light (`story.fair_dawn` clears the dusk variant).
- Journal: **The stolen standard** (done `story.grimvald_beaten`), **Round the fjord's head** (done
  `story.standard_home`, on landing; `noXp`: a card).

### Beat 8: The horn (skarragol-moot: the price, the token, Bayarmaa cleared)

- The morning horn sounds as the party walks the aisle (the horn-master, shown, raising it as they enter: the
  timing is the scene's). The council is standing to vote. Bayarmaa walks past her father to the **empty pole inside
  the tent** and plants the standard in it (shown: a puzzle object whose look changes on `story.standard_planted`).
  The lawspeaker, without being asked: "The standard stands. There is no vote." Hrafn: "There is a vote on the
  compensation. The blockade cost us the same with a standard or without." The hostage-envoy: "The offer stands
  until the horn. The horn has blown." He closes his ledger (shown).
- **Bayarmaa defies the council** (the guide's "defies a council ready to sell the fleet", here where it costs her):
  she turns on the aisle and says, to Hrafn and her father both, the most she says in the chapter: "You would have
  sold my grandmother's ships to the people she took them from, for a page that calls our allies *waters*. The
  standard is back. The oath is back. I am not. I ride with the envoy until the Crown is off this plateau, and the
  Moot can write that down as shameful if it wants a word for it." Torvald, after a long beat, to the lawspeaker:
  "Write it." Then, to her, lower: "Your grandmother said it shorter." (Her name is cleared by the standard, not by a
  speech: Hrafn's accusation dies when the lawspeaker says "the thief is across the fjord and this council's guest paid
  him", if Grimvald was brought; or when the receipt is read into the Moot, if not. Either way `story.bayarmaa_cleared`.)
- **The price (Wealth 10; the realm economy as built: flags and Journal notes, Chapter 3's Free Brasador):** Torvald,
  as the chieftain: "Zetwal wants the fleet for its war. The Ironvow ride for whoever pays the blockade's cost. That is
  not greed, envoy; it is three winters of fish and no salt." The scene pays what the player brings, in order, each
  shown on the council table:
  - **the Crown's purse** (choice: "Put it on the table. The Throne's own compensation, from the Throne's own
    thief." → +3 Wealth at Skarragol, `choice.crown_purse_given`; or keep it: +300 gold, Samira: "Sensible.");
  - **Samira's trade letter** (`party.samira`, always true here): she writes it at the table: Dorini salt at the
    pre-blockade price for two years (+1 Wealth; her scene in the chapter: "I am not giving it away. I am
    underpricing it. There is a difference and it is my mother's.");
  - **the trading jarl's proof** (optional: 300 gold handed over in the conversation, the Chapter 4 shape, `if` gold
    is enough: +3 Wealth, `choice.jarl_paid`);
  - **S-3's +1** if done (section 7.1).
  So the player leaves with Skarragol's Wealth between 2 and 8 of 10. The flag **`ally.skarragol`** is set regardless
  (the alliance is made; the price is a debt the Muster collects, as Free Brasador's Fear 6 is), with the Journal
  note *The Ironvow fleet*: "Price: Wealth 10. Paid here: N. The rest is owed, paid at the Muster. A house whose price
  is least paid is the one the Crown can still buy." (The guide's betrayal rule, 5.6, stated once so the player knows
  what the count is for; Hrafn, unconvinced and alive, is the seed of COMBAT's Ironvow betrayer variant, Chapter 10's
  build.)
- **The token:** Torvald cuts a braid from the standard's horse-tail and gives it to Gianna: "For the chamberlain's
  chair, when there is a Claim. Ironvow sits." `item.token_ironvow` (Se-5's first token, in the price scene as the
  Chapter 5 outline asked).
- **Kuroshi's door:** Torvald, as the party leaves: "Kaede Suzumori's people will not speak to an envoy who has not
  been spoken for. Take this." The horn-master hands a sealed horn-case: `item.torvald_letter` (the Chapter 5 line
  "Kuroshi will not speak to anyone until Skarragol has", paid off as an object, section 14).
- Journal: **The horn** (done `story.standard_planted`), **The price of a fleet** (done `ally.skarragol`).

### Beat 9: The quay (skarragol-quay, then the card)

- The party walks to the longship quay (shown; Bayarmaa and Salkhi with them, the horse now in the party's line on
  outdoor maps). The Crown's surveyor is gone; the trading jarl is on the quay with the eleven hulls: "Nine
  measured. None sold." A longship takes them **south-west along the coast** to Kuroshi (Kirinoura at (66, 106): a
  sea voyage `skarragol_kuroshi`, the built voyage shape, captions "South along the fjord coast..." / "...into the
  mist, where the lanterns are"). Salkhi is loaded last, complaining (one line).
- Card: *Chapter 6 complete, The Stolen Standard. Next: Chapter 7, The Fog Files.* `act6.complete`. `?chapter=7`
  starts at Kirinoura's pier (Chapter 7's outline decides the spawn).
- Journal: **The longship** (done `act6.complete`; pays no XP: a card).

---

## 3. The maps (six, drawn in code like Cenizal: `tools/maps/skarragol.ts` through `painter.ts`, `npm run maps:build`)

Registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`, city id `skarragol`, name Ordvik, house Ironvow). The look:
grey-green grass, slate rock, felt tents (round, a smoke hole), timber and horn, black water and white ice: nothing
wooden-gold like Pòdlimyè, nothing red like Cenizal, nothing stone like Eightgate. Accent `#5d6d7e` (CAPITALS). Tiles
for the tool: `GRASS`, `SLATE`, `FELT` (tent wall), `TENT_ROOF`, `CORRAL` (rail), `ROAD`, `WATER`, `FLOE` (present
only), `ICE` (echo only), `THIN_ICE` (echo, not walkable), `SHINGLE`, `SNOW` (plateau tops).

| Map | Size (tiles) | Section | Echo | What is on it |
|---|---|---|---|---|
| `skarragol-plateau` | 46 x 30 | The Winter Plateau (wild, outdoor) | **S-3's gully** (one zone round the winter store's gully; anchor: the boulder) | The road in from the Seat (south-west) to the fair's east gate; the herders' folds and the winter store (S-3); the gully the wolves use; the nine cairns round a flat stone on the high ground (placed now, inert: S-4 after the release); the ambush layer (`winter_plateau`) on the grass, the road safe |
| `skarragol-fair` | 46 x 30 | The Horse-Fair (hub, outdoor) | none | Corrals, tents, the trading mats and the debate corner, the Moot Tent in the gathering field with the empty pole before it, the Saga Tent, the food tent, the furrier, the horse-trader, the contract board, the quay lane (north), the fjord path (north-east), the east gate; dusk and dawn variants (`story.fair_dusk`, cleared by `story.fair_dawn`); Salkhi's placements by flag |
| `skarragol-moot` | 36 x 26 | The Great Moot Tent (the seat of government, interior) | none | The aisle of poles to the chieftain's seat and the inner empty pole (an object: empty, then planted); the lawspeaker's tent (the three Moot books); the skalds' and horn-riders' tent; the guest-hostage tent (the Crown's chest); the plunder store (a vendor); Grimvald bound at the aisle's foot if spared |
| `skarragol-saga` | 22 x 16 | The Saga Tent (the library, interior) | none | The eight books on painted hides and tally sticks; the skald who keeps them (vendor-style greeting, Old Norse) |
| `skarragol-quay` | 28 x 14 | The Longship Quay (outdoor) | none | Eleven hulls drawn up, the Crown's surveyor with his chain (until `story.standard_planted`), the trading jarl, the voyage trigger at the end of the quay (after `ally.skarragol`) |
| `skarragol-fjord` | 40 x 26 | The Frozen Fjord and the thief's camp (outdoor) | **six zones**: the floes solid in both eras (the near shore, four mid-fjord, the far shore); the far shore's `onEcho` plays Sarnai's raid; no anchor (a pure two-era route) | The near shore (the fjord path from the fair); the present's floes and water on `collidePresent`, the Echo's ice and thin patches on `collideEcho`; the far shore meadow, the herd (objects re-placed by the whistle flags), the sledge ring, two lookouts, Grimvald's tent and the black horse; in the Echo the Crown's supply camp (wagons, sentries) on the same shore |

Six maps: CAPITALS' five with the **quay** split out of the hub (the fleet for sale must be a place the player walks,
with a Crown surveyor measuring hulls: the sale shown, not announced; and the chapter needs a shore to sail from).
**Outdoor areas, buildings aside: five** (the plateau, the fair, the quay, the fjord's near shore and ice, the far
shore and camp), the owner's rule. The seat is central (the Moot Tent in the middle of the gathering field), large
(36 x 26), staffed, and full of people who disagree (Torvald, the lawspeaker, Hrafn for the sale, the trading jarl
against, the Crown's hostage-envoy, the horn-master). The market is the horse-fair itself (corrals and mats, no
plaza). The validator's rules hold: every zone tile walkable in both eras (the zones are only the floes that are also
solid ice), no NPC or door inside a zone, the plateau's one anchor on an Echo-era object whose dialogue sets
`anchor.wolf_run`, read by a present-era object (the boulder wall).

**Two-era terrain** is already in the engine (`tiledMap.ts`: `collidePresent` and `collideEcho`, one visible layer set
per era), so the fjord needs no engine work: floes are painted on the present layers, ice and thin ice on the Echo
layers, and the zones sit where both are solid. Chapter 1's chain bridge did the same with a `walkable` Echo object;
the fjord does it with tiles.

**Drawn placeholders** (code, through `assets.config.ts`): a round felt tent as one 3 x 3 object recoloured per use;
the standard pole as a 1 x 3 object with two looks (empty, planted); a horse as a 1 x 1 sprite in three colours (the
herd, Salkhi grey, Grimvald's black); the longship hull as a 4 x 1 object; the floe and ice as tiles; the cairn as a
1 x 1 object.

---

## 4. The Echo and the fights: what the engine has and what this chapter uses

- **The Echo party** is Patricio, Caona and Benny, all joined by now (`story.caona_joined`, `story.benny_joined`), as
  data. The field draws only Gianna's sprite in the Echo (the Chapter 5 review, section 4), so Sarnai's raid is staged
  with Sarnai and the sentries as Echo-era NPCs and the herd as Echo-era objects; Benny and Caona are named in one
  line ("Benny is with the horses. Caona went ahead on foot; she always goes ahead on foot.") and not drawn. No new
  system.
- **No Echo battle.** The Opus review's Echo battles are Chapters 2, 5 and 11's (and Chapter 5 dropped its). Sarnai's
  raid is a stealth raid in the story ("touch nobody who drops his musket"), so a battle would contradict it; and the
  Echo-battle foundation (Memories, old-uniform looks) is still unbuilt. Claude's call, section 12.
- **The present's fights** use what Chapters 3 and 4 built: enemies as data with `moves`, `every`, `tell`, `area`,
  `ally` + `statuses`, `withdraws`; battles with `phases` (`below`, `onSurge`, `enter`, `enterText`, `moves`),
  `rewards` by data, `endsWithBoss`; random ambushes from an `encounters` map layer and a table. There is **no**
  `support` role (skirmisher, brute, tank, caster only), no `floor` without a finale, no status `chilled` (COMBAT's
  Chilled is the built `slowed`), no `fogged` (the built fallback is `weakened`). Everything below is written to
  those shapes.
- **Bayarmaa as a fighter** is a `MemberDef` in `rpg.ts` plus `SKILLS.bayarmaa` and `MOVES.bayarmaa` in `battles.ts`
  and a placeholder look (section 9); her `joins: { flag: 'party.bayarmaa' }`. One small engine piece makes two of her
  four skills real (section 10).
- **Who fights.** With Bayarmaa the party has five fighters and `BATTLE_ACTIVE` is 4. Whatever Chapter 4 built for the
  order (the plan's "a party bigger than three, and who fights"), the chapter must open with **Bayarmaa active**: a
  new companion the player cannot play in her own chapter is a bug, not a choice. If the active four are the first
  four `MEMBERS` with their join flags set, her entry goes before Samira's; if a flag orders them, the Moot scene sets
  it. The sim ran her active with Samira benched and, for comparison, the reverse (section 5): both win.

---

## 5. The chapter's fights and levels

**Enemies (new data, `COMBAT.md` 13.2 and 13.3, in the engine's shapes):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Steppe Wolf** (`steppe_wolf`) | skirmisher | 15 to 17 by group | Bite 100; Frost Breath 80, `slowed` 50%, every 3, tell "The wolf draws a long, cold breath..." | COMBAT's Pack Bite (+20% per other wolf) has no engine support: cut (a pack of four at 17 is the pressure instead). Animals never bribed; flee at the end as the engine's last-foe rule does |
| **Steppe Reaver** (`steppe_reaver`) | skirmisher, `bribable` | 16 to 17 | Sabre 110; Raider's Charge 150, every 3, tell "The reaver wheels her horse and lowers the sabre..." | The built `lookout` enemy joins her groups |
| **Lookout** (built, `lookout`) | as built | 17 in the camp | as built, plus a *Horn* `ally: 'steppe_reaver'`, `inspired`, every 2 | the camp fight only |
| **Quiet Crown Zealot** (built, `qc_zealot`) | caster | 16 | as built | "The little one glows, they say. Even up here." |
| **Noyan Grimvald** (`grimvald`) | brute, `boss` | **17** | section below | the Crown-paid raider chief |

**Noyan Grimvald, three phases, sim-checked:** level 17, `hpScale 7`, `atkScale 1.6` (the enemy line at 17 gives him
about 1,617 HP and 95 ATK before the Story difficulty's 0.8 and 0.7).

1. **Mounted:** *Lance* 120; *Trample* 100, `area`, every 2, tell "Grimvald turns his horse and spurs it straight at
   the line..." (Guard, everyone).
2. **Unhorsed** (`below: 0.5`): "Horse! To me!"; `enter: ['steppe_reaver', 'steppe_reaver']` at 17, `enterText` "His
   horse bolts across the ice. Two reavers ride in off the shore."; moves *Axe* 120 and ***Stolen Standard*** (`power
   0`, `ally: 'steppe_reaver'`, `statuses: ['inspired']`, every 2, tell "Grimvald plants the Ironvow standard in the
   ice. His riders roar.").
3. **The standard broken** (`onSurge: true`, as Rael's phase 2 triggers): speaker Bayarmaa, "That is not yours.";
   the Surge-lit blow knocks the pole from his hand (the phase text); moves *Axe* 110 only. COMBAT.md's "returning the
   standard to Bayarmaa (an Item use) breaks it" needs key items usable in battle, which the engine lacks; the Surge
   is the built equivalent and it makes Anissa's light the beat that ends the Crown's grip on the oath (Claude's
   call, section 12).
4. At 0 HP he `withdraws` ("Enough! The standard is yours. Keep the horse."), and so do the reavers: nobody dies.

| Scaling tried (party of four: Gianna, Yari, Azzy, Bayarmaa; 30 seeds each) | Party 15 | Party 16 | Party 17 |
|---|---|---|---|
| hp x4, atk x1.2 (Qasim's) | 30/30 won, 17 actions, 0 down, 87% HP left | 30/30, 16, 0, 86% | 30/30, 15, 0, 89% |
| hp x6, atk x1.5 | 30/30, 27, 0, 74% | 30/30, 25, 0.07, 75% | 30/30, 23, 0, 80% |
| **hp x7, atk x1.6 (chosen)** | **30/30, 31, 0.10 down, 64%** | **30/30, 29, 0, 65%** | **30/30, 27, 0.03, 74%** |
| hp x8, atk x1.8 | 30/30, 37, 0.30, 66% | 30/30, 34, 0.23, 67% | 30/30, 31, 0.07, 67% |

So Qasim's scaling is a pushover at this level (four fighters, not three, and Bayarmaa's two attacks a turn), and x7
/ x1.6 gives a boss of about thirty party actions (seven or eight of Gianna's turns, with one Trample to Guard every
other round and one fighter down in a tenth of runs), which is where Qasim sat at 14. With Samira active and Bayarmaa
benched at x4 it was 30/30 as well. Game Over applies (a fields fight, not meant to lose); the way back in is the
tent's trigger.

**The other fights:**

| Fight | Where | Foes | Level | Party then | Pays (data) |
|---|---|---|---|---|---|
| Ambushes (`winter_plateau`, from `story.skarragol_arrived`) | the plateau's grass | Steppe Wolf x3 (15); Steppe Wolf x4 (17); Steppe Reaver x2 + Lookout (16); Steppe Reaver x2 (16, weight 2; weight 1 after `choice.grimvald_broken`); Quiet Crown Zealot x2 (16) | 15 to 17 | 15 to 17 | the encounter rule, 10 XP and 4 gold per foe per level: 450, 680, 480, 320, 320 |
| **The wolves at the store** (`winter_wolves`, S-3) | the winter store | Steppe Wolf x3 at 16 | 16 | 16 | 80 XP, 120 gold (data, below the rule on purpose) |
| **The camp lookouts** (`camp_lookouts`, the stealth's fail-safe) | the far shore | Steppe Reaver x2 + Lookout at 17 | 17 | 16 | 60 XP, 150 gold (data) |
| **The ordu's champion** (`ordu_champion`, S-5's second answer only) | the fair | one Steppe Reaver recoloured white at 17, `withdraws` at 0 | 17 | 16 | 0 XP (a sparring duel; the quest pays) |
| **Noyan Grimvald** (`fjord_grimvald`) | the camp | Grimvald 17, then two reavers 17 | 17 | 16 to 17 | **150 XP, 300 gold**, items: the standard and the Crown's purse (key) |

Sim-check of the ambushes (same bot, Story difficulty): three wolves at 15, 30/30 in 6 actions with 93% HP left; two
reavers at 16, 4 actions; **four wolves at 17**, 10 actions, 87% HP left; **two reavers and a lookout at 17**, 6 actions.
At this level the party is strong, so the plateau's groups should sit at the tier's top (16 to 17), not its floor,
or they are grey (`LEVELS.bands.trivial = 3`: a level-15 pair is "trivial" to a party at 18 and backs off).

**Levels through the chapter** (tool line from 3,750; played line from 4,200; objectives 25, books 10, the signature
puzzle 60, the minor 25, the debate 15 joined or 25 mediated):

| Point | XP from | Tool total | Level |
|---|---|---|---|
| Start (the plateau road) | | 3,750 | 15 |
| The winter road, the Moot, the thin water, Sarnai's raid, inside the herd, the stolen standard, the horn, the price (eight objectives at 25; the empty pole and the ride round are `noXp`) | 200 | 3,950 | 16 |
| SIG-SKA (60), S-3's M-SKA-1 (25), the debate joined (15) | 100 | 4,050 | 16 |
| S-5 (80 XP), S-3 (100 XP) and its wolves (80) | 260 | 4,310 | **17** |
| Grimvald (150) | 150 | 4,460 | 17 |
| The Saga Tent's eight and the Moot's three, if read (110) | 110 | 4,570 | 17 |

The tool lands at **17 (4,460 to 4,570)**, on target; without the two side quests, 4,200 to 4,310: **16 to 17**
(`skipSideQuestsMaxUnder = 2` holds). **The played line is the problem:** a real player who walks the plateau twice
(to the folds and back for S-3, and in from the Seat) meets about two ambushes (the built chance, one per 50 steps),
and at this tier an ambush pays 320 to 680 XP by the rule (`ENCOUNTER_XP_PER_LEVEL = 10` per foe per level). 4,200 +
870 (the route) + 2 x 500 = **6,070, level 20**, three over the target and already past Kuroshi's band. Chapter 5's
review saw the same thing one level lower.

**Recommendation (Claude's call, realm-wide, so the central session owns it; the simulator decides on day 1):** the
ambush rule is right at 3 to 10 (a level-4 pair pays 80, a tenth of a level) and wrong from 12 on (a level-16 trio
pays 480, more than a whole level). Make it taper by the party's level, in config, so Chapters 1 to 5 do not move:
`ENCOUNTER_XP_TAPER = [{ from: 1, share: 1 }, { from: 12, share: 0.6 }, { from: 15, share: 0.35 }, { from: 21,
share: 0.25 }]` applied to the rule's XP (gold untouched). At 0.35 a level-16 trio pays 170, about four-tenths of a
level, so two ambushes cost the player one level, not three: played line 4,200 + 870 + 340 = **5,410, level 19**,
still two over; so **also** drop the chapter's data: Grimvald 100 (the boss is its own reward), S-3's wolves 50, S-5
60, S-3 80: tool 4,290 (17), played about 5,200 (**18**, one over, inside `slackOver`). The simulator with Chapter 6's
route decides the two dials; `CHAPTER_LEVELS` 6 keeps `to: 17`. If the taper is refused, the fallback is lower group
weights on the plateau (fewer ambushes) and a 24-step grace, which is a worse game than a fair reward.

**Gold:** about 900 to 1,100 in; the plateau's ambushes about 200 each; S-5 150, S-3 200; Grimvald 300; the Crown's
purse 300 if kept. Out: the furrier's tier-16 gear (a braided fur cloak for the front row about 700, a round shield
charm about 450, a horse-tack charm about 300), the food tent, the trading jarl's 300 if paid. Nothing in the chapter
requires spending; the jarl's 300 is the one place gold buys Wealth, and it is optional and says so.

---

## 6. The required-before gate: "Until the horn"

- **In the story:** the council votes at the morning horn; the lawspeaker says the standard at the pole before the
  horn ends the vote; Bayarmaa says the ice is hardest before dawn. So the day is the party's, and Torvald names what
  is in it, as Azzy did in Chapter 3 and Coco in Chapter 5: "The man in the white coat has been in my field three
  days waiting for your Brasador. The herders at the folds lost half their winter store to wolves and the other half
  to somebody kinder. And my traders are shouting about oaths again; they always are." He does not say "three quests".
- **In the Journal:** the objective **Until the horn**, `followSide` (as Chapter 3's *Until noon* and Chapter 5's
  *Until the bell*), done when S-5, S-3 and the debate (joined or mediated) are done, **or** when `story.fjord_crossed`
  is already set (a save on the ice never sticks).
- **On the map:** the fjord path's gate at the fair's north-east is a step trigger that waits for the three (`if:
  'side.grandson.done, side.winter_stores.done, debate.skarragol_oath.joined|debate.skarragol_oath.mediated'`); until
  then Bayarmaa, at the path, worded from the flags: "The white coat is still in the field." / "The herders are still
  counting sacks." / "The traders are still shouting." Anissa: "Your Quests page, Gigi."
- **The dusk variant** (`story.fair_dusk`) is set when the third completes; it clears on `story.fair_dawn` (beat 7's
  landing).
- **Order the arrow follows:** S-5 (the envoy at the fair, where the party stands after the Moot), the debate (the
  trading mats, on the way), S-3 (the folds on the plateau, out the east gate and back). Then the fjord path.
- **No soft-locks:** S-3 is the only required step outside the fair; the plateau's ambushes are at the party's level
  and Game Over returns the party to the fair's east gate; the wolves at the store cannot be lost in a way that
  blocks (Game Over and retry, the Grudge applies); S-5's sparring duel ends by `withdraws` and the other two answers
  have no fight; the debate's Provoke does not resolve it, so Join stays open; the fjord needs only the Locket; the
  stealth has the camp fight as its fail-safe.

---

## 7. The two required side quests and the debate

Why these, from S-1 to S-5 and the Opus minimum: **S-4 The Cairn of Nine Riders** is the secret item, after the
release (the cairns are placed now and inert, as Chapter 5 placed the clerk's register). **S-1 Salkhi Has Opinions**
is comedy with no fight and no thread beyond the horse; its best lines (the foal, the sighing at Azzy) are given to
Salkhi as ambient lines in the main story, and the quest follows after the release. **S-2 The Fleet for Sale** is the
ally's price itself (three chiefs, three proofs), so it is folded into beat 8 as the price scene rather than built
twice: the trading jarl's proof and Samira's letter are there; the horse-fair race (a timing minigame, a new system)
is after the release. That leaves **S-5 Grandson of the Steppe**, which is the one thread the realm has been pulling
since the Hall (the Ironvow envoy's look; "Azzy's mother's people are watching", `STORY.md`'s "learns" line), the
chapter's comic scene, and a choice that shapes Azzy's Claim in Chapter 12; and **S-3 The Winter Stores**, the rebel
safehouse (the ash thumbprint's thread, which no chapter may skip), the chapter's minor Echo anchor (so the plateau
has an Echo and the Locket's rule is used twice, once pure-route on the fjord, once with an anchor on the plateau),
and the chapter's one fight that is not the boss. No new quest is added.

### 7.1 The Winter Stores (S-3; the rebel safehouse)

- **Opens:** the herder at the folds (a woman, "Oyuun" as a proposal name, named by role until approved), on the
  plateau, from `party.bayarmaa` (she will talk to Bayarmaa's party; she would not have talked to strangers). Shows as
  *??? The herders' folds* until spoken to. The folds are the arrow's third stop.
- **Steps:** 1) "Someone leaves grain at the folds every winter. Sacks, before the first snow, no cart tracks, a grey
  thumbprint on every sack. This year the wolves have found the store." (`side.winter_stores.accepted`.) 2) The
  store: a dry cave under the plateau's edge with a gully running down to it; the wolves come up the gully at dusk.
  The fight `winter_wolves` (three at 16) at the store's mouth (shown: they come up the gully). Won: the herder, "They
  will come back tomorrow. They always use the same road." 3) **The Echo** (M-SKA-1): the store's zone shimmers; in the
  Echo it is **Sarnai's supply cache** the winter of the raid: sacks of the Crown's grain, two of Sarnai's riders, and
  a loose boulder on the slope above the gully. Patricio is strong enough to roll it (the anchor: the boulder object,
  a weight verb: "Patricio sets his shoulder to it. It goes."). `anchor.wolf_run`. 4) **The present:** a boulder wall
  across the gully's mouth, fifty years old, with grass on it; the wolves' road is shut. The herder: "That was not
  there this morning. I will not ask." The ash thumbprint on the sacks, close up: the Journal's thumbprint count
  grows by one (the design says 5 of 9; the Journal's number follows the built flags). `side.winter_stores.done`.
- **Reward:** 100 XP (80 if the simulator says so), 200 gold, +1 Wealth (Skarragol), the Journal note *The winter
  stores* ("Grain comes to the plateau before the snow, thumbprinted. Yucayeque's oil, Cenizal's bread, Bab
  al-Dhahab's water, Ordvik's grain: the same hand.").
- **Why it fits:** the safehouse thread is how the player finds Rael's real work, chapter by chapter; the minor puzzle
  is the design's; the wolves are the plateau's.

### 7.2 Grandson of the Steppe (S-5; Azzy's thread)

- **Opens:** automatically when Azzy is in the party (always), the moment the envoy bows in beat 1; the quest's first
  stop is the envoy, who has set up a white tent at the fair's edge with a silver mare on it (**the envoy of Azzy's
  mother's people**: a royal ordu of the eastern steppe, proposal name *the Ordu of the White Mare*; the envoy
  "Chuluun", a proposal; a champion rider with him). Azzy's mother herself **does not appear** (guide 13.7, settled;
  she is one line: "Your mother rides the eastern grass. She does not ask after you. She has not stopped asking after
  you since the day she left, which is different, and I was told to say neither.").
- **Steps:** 1) The envoy treats Azzy as a royal grandson: he will not stand up straight in Azzy's presence, which
  Azzy cannot bear (shown: every time Azzy moves, the envoy bows; Yari enjoys it; Salkhi: "Finally someone with
  manners"). The offer: two hundred riders of the ordu for Azzy's claim, "the day you put off Ardencia's name and
  take your grandfather's". 2) **Azzy must answer** (the player's choice, all three remembered, `choice.azzy_ordu`):
  - **Refuse politely** (Gianna advises it; `choice.azzy_ordu = 'influence'`): Azzy, in the formal register he uses
    for his father: "Tell my grandfather I am honoured, and that I am Rodriguez, and that a man who sheds one name
    for riders will shed the next for more." +2 Influence (Skarragol).
  - **Refuse with a show of strength** (`'fear'`): the envoy's champion offers a sparring bout "so the ordu may say
    the grandson can sit a horse": the fight `ordu_champion` (one rider at 17, ends by `withdraws`, no one hurt past
    the bout). Won: +2 Fear (Skarragol). Azzy: "Tell him I can sit a horse. Tell him whose."
  - **Ask Gianna** (`'share'`): a conversation at the corral rail (shown: the two of them walk away from the party to
    the rail; Anissa stays with Yari), where Gianna's words shape his Claim choice later: "You have a claim through
    two houses, Azzy. So do I. One of us is going to have to say what the Throne is for." Azzy: "Then it is not for
    one of us." The design's effect: this tips Chapter 12 toward "share" (`choice.azzy_ordu = 'share'` is read there).
    The envoy gets the polite refusal, said by Azzy in fewer words.
- **Reward:** 80 XP (60 if the simulator says so), 150 gold, the pillar by the answer (+2 Influence or +2 Fear; the
  "share" answer pays +1 Influence). The Journal note *Grandson of the steppe* records which.
- **Why it fits:** Azzy's mother's people are Skarragol's (settled), and this is the one chapter that can show the
  realm's eyes on him before the Claim; it is comic in the right register (nobody touches Anissa; the joke is on
  protocol); and it is the only side quest whose outcome Chapter 12 reads.

### 7.3 The debate, required: *Oath of blood or oath of sky?* (the trading mats)

- **Where:** the debate corner by the trading mats on the fair. **Opens:** from `party.bayarmaa`.
- **The two speakers** (guide 7.2): a **Sky-Rider** of the Four Hands' wind sect ("An oath sworn on a stick is a stick.
  We swear to the open sky, and the sky is still there when the stick is stolen. Sell the fleet or don't; the oath
  was never in the pole.") against a **Witness elder** ("A contract is a thing you can lose. That is what makes it a
  contract. Ulfgar swore blood on the standard so that losing it would cost something. It is costing something. Good.")
  The built debate shape (`engine/debate.ts`: listen, join, mediate, provoke; three rounds; scripture, reason,
  compassion): the ally is the **Witness elder** (the party is here to put the standard back, so the elder's side is
  the one the story stands with; the player may still argue the Sky-Rider's), the opponent the Sky-Rider.
- **Reason needs** one of the Saga Tent's *Ulfgar's Oath*, *The Law of the Moot* or *The Sky-Riders*, named in
  `reasonNeeds` (the library is open all day; three books, not one, so Reason is reachable). **Mediate** needs the
  built Influence 5 at Skarragol (listen +1, books +1 each, S-5's +2 on the polite answer: reachable by a reader).
  Rewards are the built `DEBATE_REWARDS` (won: 15 XP, +5 Concord, +1 Influence; mediated: 25 XP, +10 Concord). A
  mediation's line, from Bayarmaa, the only time she speaks at the corner: "Swear on both. My grandmother did."
- **The quest:** *Oath of blood or oath of sky?*, required, done on joined or mediated. After the Harbor Turn the
  corner rewrites itself (guide 7.2; Chapter 11's build). No faith is a cult; the Sky-Rider is cheerful and the
  elder is dry, and the thing Anissa says after is the only judgement: "They both want the standard back, Gigi. They
  just don't want to say it the same way."

### 7.4 Books, vendors and the board (the day's other stops)

- **The Saga Tent (8, `CAPITALS.md` 6):** *Ulfgar's Oath*, *Sarnai's Ride* (the raid, as the skalds tell it: the
  herd, the whistle "three notes nobody writes down", so a reader has the puzzle's hint before the Echo), *The Law of
  the Moot*, *The Sky-Riders*, *Furs, Salt and Horses*, *The Mare in the Sky* (S-4's star lore, placed now), *Who
  Married Whom* (gossip: "a steppe princess married a Brasador lord in the Ash Wars and came home alone; the boy
  stayed": one line, Azzy's mother, guide 13.7; Azzy reads it over Gianna's shoulder if he is the follower, one line,
  no more), *The Ironvow Line* (Ulfgar, Sarnai, Torvald, Bayarmaa). Reading one gives +1 Influence (Skarragol) and 10
  XP (or Influence only, if the simulator needs the 80 back).
- **The Moot Tent (3):** *The Standard's Keeping* (the guard roster the night it vanished: Bayarmaa's name, and a
  second name struck out: Hrafn's rider, a fair-play clue the lawspeaker confirms if asked), *The Crown's Offer*, *Compensation
  Claims*.
- **Vendors (guide 8; each line `verified: false` in two new glossaries, `mongolian.json` and `norse.json`, for the
  Nov 18 check):** the food tent ("Sain baina uu?": salted jerky heals 50, fermented mare's milk 16 SP, hot broth 40
  HP over 3 turns), the furrier ("Heill!": the braided fur cloak, leather armour level 16, def 10, hp 14, spd 2; the
  round shield, a charm, def 4, hp 8), the horse-trader ("Bayarlalaa." / "Þökk." on a sale: the horse-tack charm, spd
  4, atk 1; and *Salkhi's treats*, a 10-gold consumable that heals 1 HP and whose text is Salkhi's: "Finally."). The
  plunder store in the Moot sells the furrier's stock at the raiding jarl's prices (dearer) until `ally.skarragol`.
- **The contract board:** "guard the folds (wolves)" is S-3; "count the fleet (Influence)" is a post-release job;
  "race at the fair (timing)" is S-2's, after the release.
- **Anissa's nudges** (mystery quests, under 128 characters): "The man in the white coat is still bowing, Gigi. At
  Azzy." / "The herders on the plateau are counting their sacks twice." / "The traders by the mats are arguing about
  a stick." / "Something's wrong with the ice. Not wrong. Old."

---

## 8. The Echo puzzle: the frozen fjord and the herd (SIG-SKA, design difficulty 5; honest 4)

The design (`PUZZLES.md`): present, summer, open water with drifting floes; Echo, winter, the fjord frozen but with
thin black patches; Echo Zones only on present floes that are also solid Echo ice; walk the Echo ice from zone to
zone, swap to the present where the Echo ice ahead is thin, swap back where the present runs out of floes; five
swaps; no anchor. Then the herd: learn the whistle in the Echo, whistle in the present to move the herd and walk
inside it past the lookouts. Kept; the staging:

1. **Present, look.** The near shore: the fjord path ends at a shingle beach and a big floe grounded on it (zone 1,
   `onEcho`: Anissa holds the door here). Beyond it: three floes you can step between, then open water ("Black water.
   The next floe is too far."). The Locket shimmers on some floes and not others (the zones' shimmer). The Journal
   notes *The thin water*.
2. **Echo, walk.** Swap on zone 1: winter; the ice runs out ahead, white and solid, then a black patch the engine
   will not let you cross ("Thin. It groans."). The route: zone 1 → Echo ice → **zone 2** (a floe in both eras) →
   the Echo ice ahead is thin, but in the present zone 2's floe has two floes close to it → swap → present floes →
   **zone 3** → present water ahead; swap → Echo ice → **zone 4** → thin ahead; swap → floes → **zone 5** → water;
   swap → Echo ice → **zone 6**, the far shore's grounded floe. Five swaps, as the design says (1, 2, 3, 4, 5). Each
   zone is three or four tiles, with a shimmer; each stretch between zones is walkable in exactly one era (the two
   collision layers). A wrong turn costs steps, not a Game Over: there is no falling in (the water and the thin ice
   are simply solid walls with a line), which is right for a puzzle whose point is the route, not reflexes.
3. **Echo at the far shore: Sarnai's raid** (beat 5), which teaches the whistle: `clue.herd_whistle`. This is the
   chapter's required Echo scene, so the far-shore `onEcho` is the objective *Sarnai's raid* and the camp's trigger
   waits on `clue.herd_whistle` (a player who somehow crossed without the Echo would have to swap there once; the
   zone is the shore, so it always can).
4. **Present, the herd** (beat 6): *Whistle* at the herd's edge (an object with a choice, needs `clue.herd_whistle`);
   the herd walks to the west gap and the west lookout walks to the meadow's edge (`story.herd_called`); *Whistle*
   again at the picket line inside; the herd shifts to the east gap, the east lookout follows (`story.herd_called_2`);
   the tent's trigger is reachable. The engine's `walkers` move the lookouts between their placements (shown, no
   new system); the herd's horses are present-era objects with placements by flag. Talking to a lookout, or stepping
   on the gap tile he still stands on (he is solid, so the player cannot), starts the camp fight; after it the gaps
   are empty.
5. **Anissa's hints** (3 minutes stuck on Story and Normal, 5 on Hard; `PUZZLES.md`'s wording): "The ice was solid
   once. And the floes are solid now. Use both." / "Swap only on the shimmer. When the dark ice is ahead, come back to
   now." / "Cross on five swaps; then learn Sarnai's whistle in the memory and walk inside the herd."

Files: `puzzles/skarragol_fjord/solution.json` and `cheats.json` (a route that swaps on a non-zone tile, one that
walks the present floes to the end, one that whistles once), replayed by `tests/puzzles.test.ts`. Difficulty: the
crossing is a route with one idea used five times (3), the whistle a scene then two presses (1): about **4**. The
sightline-stealth of the design is not built (section 10); the herd as a moving screen is the same idea with the
engine's walkers, and the camp fight is its fail-safe.

**The minor (M-SKA-1, S-3):** the store's zone, the boulder (Echo object, anchor `anchor.wolf_run`), the boulder wall
(present object, `if: 'anchor.wolf_run'`). Hints as `PUZZLES.md`. Difficulty 3. Files `puzzles/skarragol_gully/`.

**The secret (S-SKA, after the release):** the nine cairns and the sighting stone are placed now (objects, inert, the
Echo's turning sky and the horns not built); Bayarmaa's Journal sketch and the capstone are Chapter 6's post-release
item. Nothing in this build should make it harder: the cairns are on the plateau's high ground away from the folds.

---
