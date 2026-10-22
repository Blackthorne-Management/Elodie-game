# Chapter 8, The Dying Flame (Agnipur, Jwaladesh; the third road): build outline (Oct 22)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: none required; one
near-miss named); everything else is Claude's call with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (the three roads
Oct 27 to Nov 6, 30 minutes each; the owner's fixed order Skarragol 15 to 17, Kuroshi 17 to 19, **Jwaladesh 19 to
21**), the Opus plan review section 6 (the minimum for Chapters 6 to 8: the city's trouble, its signature puzzle, its
Echo, its boss, the companion joins, the ally's price, the debate as a required quest, two required side quests; the
other quests and the secret item after the release; placeholders where art has not come), `design/STORY.md` Chapter
8, 1 (the two eras: Patricio was in every capital), 4 (the threads: the safehouses, the Seventh Clause), 5 (tone:
Vikram out of breath; no jokes near Anissa) and 6.9 and 6.10 (the betrayer's companion; Meera as the Gen III ruler
Vikram defies), `design/CAPITALS.md` 8 (Agnipur), `design/SIDE-QUESTS.md` J-1 to J-5, `design/PUZZLES.md` SIG-JWA,
M-JWA-1 and S-JWA, `design/COMBAT.md` 9.7 (Vikram), 13.2 (Oil Enforcer, Ember Jackal, Road Bandit, Zealot) and 13.3
(Seth Dhanraj; Steward Prakash as Agnivansh's betrayer variant), `design/SECRET-ITEMS.md` 4 (the Unbroken Wick),
`design/FAMILY.md` (**Aiyana**, settled: Kayla's full sister, Rahel's daughter by the same man of the Asian continent,
Azzy's Titi Aiyana; bright, restless, hands-on; an engineer of the city's great flame who opens the way through the
Dying Flame puzzle; bumped into, helps, acted out), `QUEST-BUILD-GUIDE.md` 5.3 (the Agnivansh line: Tejaswini, Arjun,
Meera, Vikram), 5.4 (Jwaladesh's row; the Suzumori burned an Agnivansh temple), 5.6 (the betrayal), 6.3 (the price:
Wealth 8; gold gifted counts, 100 gold = 1), 6.5 (Vikram: fast glass cannon), 7.1 and 7.2 (the Four Hands' Flame
Keepers; the debate *Is hesitation a sin, or is remembering mercy?*), 8 (Hindi greetings; the flame-bead bracelet),
13.9; the Chapter 5 outline (the Agnivansh envoy "in a coat too thin for the Hall": "We have come to the Parley to
sell a sacred thing to the Crown, and I am the one who has to say so"; Elodie: "Jwaladesh cannot afford to speak at
all"; the priests heard the page); the **Chapter 7 outline** (`2026-10-21-chapter7-outline.md`, section 14:
continuity into this chapter; its review is in progress, so its fixes are not yet known); the **Chapter 6 outline
review** (3.1: the level plan and the taper; 3.9: who fights; 3.10: no joke beside Anissa); and the built game on
branch `chapter3` (worktree `wt-ch3/quest` at commit 656cfa1, Chapter 4 built: `data/quests.ts`, `data/battles.ts`
(phases, `enter`, `hire`, `protects`, `withdraws`, `seize`, `onSurge`, `endsWithBoss`, `meantToLose`, `finale`),
`data/encounters.ts`, `data/rpg.ts` (fighters as data, `PassiveEffect` kinds `battleGold` and `atkPerFell`; the
active four are the first four joined in `MEMBERS` order), `data/sideQuests.ts`, `data/debates.ts`, `data/puzzles.ts`,
`engine/stage.ts`, `engine/game.ts` (anchors: only `anchor.*` flags carry back from the Echo), `tools/level-curve.ts`,
`tools/chapter-starts.ts`, `config.ts` (`STATUS` with `regen`, `shatter`; `gilded`; `INTERCEPT_CHANCE`; `HIRE_CAP`;
`BATTLE_ACTIVE 4`; `ELEMENT_RESIST 0.5`, no immunity)). Levels use the game's curve (`xpBase 50, exponent 1.6`): 19
at 5,098, 20 at 5,559, **21 at 6,034**, 22 at 6,526, 23 at 7,030.*

**Sim-check.** The fights below were simulated with scratch scripts outside the repo against the Chapter 6 outline's
snapshot of commit 889ed60 (the same engine Chapters 6 and 7 were checked on):
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch8sim/dhanraj-sim.ts`, `dhanraj-sim2.ts`
and `duel-sim.ts` (Bayarmaa and Haru as the Chapter 6 and 7 outlines' entries, Vikram and the Jwaladesh enemies as
data in memory, each fight 30 seeds with the Chapter 6 bot, on the built Story difficulty). Numbers in section 5.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit, never a target and never jokes; the comedy (Vikram out of breath, Salkhi in the salt, Samira pricing oil) stays
away from her; recommendations only where they genuinely help; placeholders wherever art has not arrived; this
chapter gets the main story, the Echo puzzle, the boss, the companion, the ally's price, the debate as a required
quest, **two** required side quests, mystery quests and arrows, Game Over, and nothing else until after the release.
The ambush-XP taper (`ENCOUNTER_XP_TAPER`, 0.25 from party level 15; the Chapter 6 and 7 outlines' Claude's call) is
taken as adopted and this chapter's data is set on it (section 5).

---

## 1. Where the chapter starts (measured against the Chapter 7 outline, section 14)

- **Chapter 7 ends** on Kirinoura's pier: the sea voyage `kuroshi_jwaladesh` west along the south coast from (66, 106)
  to Agnipur at **(37, 91)**, captions "Out of the mist, west along the coast..." / "...to the salt flats, where the
  sky is on fire"; Salkhi loaded last. The card *Chapter 7 complete, The Fog Files. Next: Chapter 8, The Dying Flame*
  (`act7.complete`). `?chapter=8` starts on **Agnipur's harbor quay, under the great chain** (section 3,
  `jwaladesh-harbor`, spawn `landing`), as the Chapter 7 outline expected ("the salt-flat road or its river gate":
  the harbor is chosen because the chain and its dead lamp are the chapter's first picture and the Echo's place).
- **The party on the route:** Gianna, Yari, Azzy, Samira, Bayarmaa, **Haru**, Anissa (seven, six fighters, four
  active: by the built rule the first four joined in `MEMBERS` order, so Gianna, Yari, Azzy, Haru if the Chapter 7
  build placed Haru before Bayarmaa, unless the Chapter 6 review's active-order flag landed); Salkhi as a flag-placed
  horse on outdoor maps; **level 19** by the tool (5,085 to 5,215 after Chapter 7's dials) and **about 20 to 21 as
  played** (the Chapter 7 outline's section 5: 20 to 21 unless the taper is tightened to 0.25, which this outline
  assumes it was). Echo party: Patricio, Caona, Benny. Gold about 1,600 to 2,400 less Kirinoura's armourer.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's note, the Dorini pass, the Brasador coin,
  the Ironvow token, **the Suzumori crane (`item.token_suzumori`)**, **the Fog Files (`item.fog_files`)** and the
  Fox's receipts, Titi Kayla's crane, the Crown's purse if kept. **Flags that matter here:** `clue.seventh_clause_read`
  (the priests "were written down as *the ash*"), `belief.rael_traitor` (unchanged), `party.azzy` (Aiyana is his
  aunt), `party.samira`, `party.bayarmaa`, `party.haru`, `ally.skarragol`, `ally.kuroshi` (the price pattern),
  `clue.buyers_mark` (one of four houses has a closed hand beside its name: Agnivansh's line is one of the four),
  `clue.ardencia_outflows`, `clue.crown_pays_raiders`, `clue.fox_receipts`, `side.lanterns.done` (the thumbprint
  count: with Z-5, X-2, Ar-1, A-3, S-3 and K-3, this chapter's J-3 is the **seventh** safehouse, the design's "7 of
  9"), `choice.fox_spared|broken`, `side.seats.stage1` (the chamberlain waits for the houses' tokens: Agnivansh's is
  given in the price scene).
- **What the realm said about Jwaladesh before now:** the Agnivansh envoy at the Parley (Chapter 5): "The flame is low.
  We have come to the Parley to sell a sacred thing to the Crown, and I am the one who has to say so." Elodie:
  "Jwaladesh cannot afford to speak at all." Kaede (Chapter 7): "Agnipur will not take a Suzumori crane. We burned
  their temple on a Crown paper that was false... Take the crane anyway. Their flame is dying, and the Crown is holding
  the oil." The retainer for war: "Agnipur's priests heard the page too. They were written down as *the ash*."
- **What Gianna believes:** her father sold Xaraguá and them. The player holds Rael clues 1 (the signet), 2 (Elodie's
  two lines), 3 (the ledger of outflows), 4 (the coin), the "arrows missed" whisper, Kayla's "still himself", and the
  "nobody dies" pattern (Grimvald and the Fox withdrew). **This chapter gives no new Rael clue** (none is assigned to
  it in STORY.md 4) and must not invent one: Aiyana, Rael's half-sister, is hands-on and says only what she measures
  (section 9). It gives the **seventh thumbprint** (J-3: oil for the temple from nobody) and the third face of the
  Crown's hand: it pays a hoarder so a temple must sell its chain.
- **Chapter 8's target is 19 to 21** (`chapterLevels.ts`, already there). The boss is at the tier's top, 21; the
  swordsmith stocks tier-20 gear (Kirinoura's tier-20 pieces again for a player who skipped them) and tier-24 pieces
  shown honestly at half bonus.
- **Stale lines in the design, fixed here:** `STORY.md`'s table still says "any order, 15 to 21"; `CAPITALS.md` 8
  gives the Court of the Flame two sizes (26 x 20 in the table, 36 x 28 in the seat paragraph): the larger is used,
  as Chapters 5 to 7 did; `CAPITALS.md` puts "the oil store (J-4); boss arena" on the Harbor Chain map, and S-JWA's
  Echo in the same store: the store is built as the boss arena now and S-JWA's balance lock and jars are placed inert
  for after the release; `SIDE-QUESTS.md`'s road-tier rewards (200 to 320 XP) are scaled to the built curve, as
  Chapters 6 and 7 did; `COMBAT.md` 13.3 gives Dhanraj 8 / 1.1 on the standard line, which the sim shows is long and
  harmless against four fighters at 20 once the role's 1.4 HP is counted (section 5); COMBAT's *Oil Wall* (fire
  immunity), *Oil Flask* (Burning) and *Price Spike* (a delay on items) have no built status or rule (section 10);
  `FAMILY.md` says Aiyana "opens the way through the Dying Flame puzzle", and `PUZZLES.md` SIG-JWA has no person in
  it: this outline gives her the chain tower's key (the way in), the mirror brackets (the way through) and nothing
  the player should do (section 8).

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 7 outlines. Flags are proposals in the built naming style. "Shown"
means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`).

### Beat 0: Under the chain (the voyage, then jwaladesh-harbor)

- The voyage `kuroshi_jwaladesh` (the built sea shape; `night: false`; the captions above). On the deck, one line
  each as the coast goes white: Haru: "Salt flats. Everything you say out here carries. Say it anyway." Bayarmaa:
  "Say less." Samira: "I can smell a shortage from here. It smells of money." Anissa, looking at the glow over the
  hill: "Gigi, the sky's orange. Is that the flame?" Gianna: "That's the sun on the salt. The flame is smaller than
  that." (Earnest; it is the chapter's question, said once.)
- Lands at `jwaladesh-harbor`, spawn `landing`. **`story.jwaladesh_arrived`** is set on landing: the Salt Flats'
  ambush layer switches on (`salt_flats`, section 5). The harbor: a white stone quay, the **great chain** across the
  harbor mouth from the chain tower to the far mole (drawn as a line of iron links on the water, an `above` object),
  the **chain lamp** on the tower, **dark** (a 1 x 2 object with two looks; the chapter's first picture is a dead
  lamp on a sacred chain), the **old watchtower** beside it with a bare bracket at its top, Dhanraj's **oil store**
  (a long warehouse along the quay, its doors chained, two **Oil Enforcers** standing at them, placed), the **Crown's
  oil-factor's launch** tied up at the store's own steps (Aldermoor violet pennant: as in Kirinoura, the Crown is here
  before anyone says it), a harbour-master, a milk-and-bread stall under an awning, carts of empty jars.
- **The trouble, shown before it is said:** a lamp-seller's cart comes down the quay to the store's doors (a walker);
  an enforcer turns it round with one hand on the shaft ("No oil today. No oil tomorrow. The Seth will say when.");
  the seller goes back up the hill with the empty jars rattling. Samira: "No oil in a port full of oil. Somebody is
  being paid to say that." Yari: "Or to not say it." `story.harbor_seen`.
- **The watch:** the enforcers' line when the party nears the store ("Store's closed. Chain's closed. Everything's
  closed. Go and pray about it."): the store and the chain tower are theirs by day (a trigger strip in front of each
  door turns the party back, worded from the flags; at night, section 6, the strip is gone). Nothing fights here yet.
- **Vikram's first sighting, shown:** up the harbor stair, a crowd of six at the top (placed), and from inside it the
  sound of two blades (an audio slot) and a voice that keeps stopping for breath: "You said... the Crown... would
  *never*... hold... the chain. I say... it already... does." The crowd parts (walkers) as the party reaches the
  stair's top: a young man in saffron, bent double with his hands on his knees, a curved sword under one arm, and a
  dyer sitting in the dust with his own sword six feet away. Vikram, not looking up: "Argument... settled." He walks
  off up into the bazaar (`exit`). Azzy: "He won." Yari: "He can't breathe." Azzy: "He still won." `story.vikram_seen`.
- Salkhi, led off the trader: "Salt. I was promised grass in three countries, and I have been given soup and salt."
  (Nobody near Anissa.)
- Journal: **Under the chain** (done `story.jwaladesh_arrived`).

### Beat 1: The Lamp Bazaar (jwaladesh-bazaar, the hub)

- Up from the harbor onto the bazaar: lanes of lamp-sellers whose stalls are full of brass lamps and empty of oil
  (the lamps are priced by a chalk board the player can read: "Oil: ask the Exchange"), the dyers' vats, the spice
  row, the **milk-and-bread stall**, the **bead seller**, the **swordsmith**, the contract board, the **debate corner**
  by the spice row (a Flame Keeper and a Gaze pilgrim, one passing line each), the **shrine child** at a tiny dark
  street shrine (J-4's seed: placed with one line, "It went out. It never went out before."), the **runners' hall**
  at the temple steps (J-2's giver: the chief runner and three idle runners sitting on the steps with unlit lamps),
  the **Palm-Leaf Library's** door on the west lane, **Dhanraj's Oil Exchange**: a **new brick tower** at the
  bazaar's heart, taller than anything round it, with a brass price-board at its foot ("Oil: 40 the measure. Was 4.")
  and two enforcers at its door, and, at the bazaar's head, the **temple steps** and the saffron doors of the
  **Court of the Flame**, with the **duel yard** (a sanded square with a rope round it) beside them.
- **The rooftops, seen:** four bronze **mirrors** on four rooftops round the bazaar (objects, each with four
  orientations; all four turned face-down "for cleaning", a look the player reads: "Turned down. By order of the
  Court. For cleaning. The dust on it says otherwise."). The new tower stands in the line between the harbor's
  watchtower and the temple's wick-window: a player who looks (the mirror objects' lines say it) can see the problem
  before anyone states it.
- **Aiyana, the bump-in, shown (the owner's rule for every family member):** on the lowest rooftop, reached by an
  outside stair from the dyers' lane, a woman in a leather apron over saffron is lying on her back under a mirror's
  bracket with a wrench, her boots towards the stair. As the party comes up she says, without looking: "Whoever you
  are, hold this." A wrench object is held out (a `place` beside her). **Azzy stops** at the top of the stair, then
  crosses (shown) and takes it: "Titi Aiyana." She slides out, sits up, looks at him, looks at the wrench, and takes it
  back: "Azriel. You've got your grandfather's hands. Don't waste them holding things." She stands and claps dust off
  (a beat), then to Gianna, fast: "You're the Zetwal envoy. Kayla wrote: three lines, which for Kayla is a scream. You
  have the Locket; then you have been to Cenizal, and I am not going to talk about Cenizal on a roof. Here is what I
  will talk about: these mirrors have been turned down for eleven days by an order that calls it cleaning, the chain
  lamp has been dark for two years, and the flame in that temple" (she points with the wrench at the wick-window)
  "is the height of my thumb. I measured it this morning. I'm the only one allowed to." `story.aiyana_met`. (Section
  9 has her rule: she measures, she builds, she does not say what she thinks of her brother.)
- Her line about the way: "The Court sits at the night lamp, which doesn't get lit any more, so: at dusk. Go and be
  refused by my employers. Then come and find me; I have a key nobody has asked me for in two years." (The gate,
  section 6, named by the city's engineer, not by a companion.)
- Journal: **The mirrors are down** (done `story.aiyana_met`), then **The Court sits at dusk** (section 6).

### Beat 2: The Court of the Flame (jwaladesh-court, the seat of government)

- **The Court:** a long colonnade to the **flame altar**, which is **curtained** in saffron silk (the priests'
  decision: a readable object, "The curtain is new. The rings are polished. Someone put it up this month."); the
  **ruler's seat** below the altar where **Meera** sits; the **priests' council** off the colonnade (a priest for
  hiding, "the senior Keeper"; a priest for telling, **the junior priest**, J-3's giver); the **treasury** (an iron
  door open on an empty room and *The Treasury Book*, readable: blank pages after the spring); the **envoys'
  pavilion** (where the **Crown's oil-factor**, "Mr. Pelham", proposal, takes spiced milk with a courteous merchant in
  white with a ledger under his arm: **Seth Dhanraj**, seen first as a guest, as the Fox was); the **runners' hall**
  door; the **duel yard** door; the **back gate** (J-3) on the kitchen side; and the **wick-window** high on the
  altar's wall, where the harbor's light is meant to come in (a readable object: "A round window over the altar, glass
  gone grey. The light from the sea used to fall through it onto the wick. Nothing falls through it now.").
- Staged: the chamberlain announces "the envoy of Zetwal, who was spoken for by Ironvow and by Suzumori" (a walker
  down the colonnade). Meera, from the seat, dry and tired: "Spoken for by the people who burned our temple. Put
  their crane on the step. I will not have it on the altar." (Shown: Haru sets the crane on the lowest step of the
  altar and steps back. `story.crane_refused`. He says nothing; the feud is a thing done, not said. If
  `clue.seventh_clause_read`: "We heard the Throne's page too. *The ash*, it called us. The Crown has always known
  what we would be left with.")
- **The order, said plainly by Meera** (the chapter's rule, once): "The flame is well. That is the Court's word and
  the Court has one word. The envoy will not ask to see it; nobody sees it; the Keepers tend it. If the city believed
  the flame was failing, the city would fail with it, and the Crown is standing in my pavilion waiting for exactly
  that." (*The Priests' Decision*, in the Court's records, says the same in the council's words.)
- **The council disagrees, shown:** the senior Keeper, stepping out: "The flame is well." The junior priest, stepping
  out after him, not loud: "The flame is the height of a thumb, and the oil is in a warehouse on the quay, and the
  man who owns the warehouse is drinking our milk." Meera: "Sit down. Both." The Crown's factor, from the pavilion,
  courteous: "The Throne's offer stands as written: oil for the temple for ten years, from the Throne's own stores,
  in exchange for the keeping of the Harbor Chain. The Throne would of course keep the lamp lit." Dhanraj says
  nothing and bows exactly. (The sacred thing the envoy went to the Parley to sell was the chain Arjun broke; the
  Crown's price for a faith is its harbor. The design's "the Crown pays for shortages" shown as a contract, not a
  speech.)
- **Gianna's ask:** "Zetwal's envoy asks one thing of Jwaladesh: that it not sell the chain to the Crown before the
  Muster. Let the flame be seen. Elodie remembers what is hidden; she does not punish it." Meera: "Your goddess
  remembers. Ours burns or it does not. No."
- **Vikram, shown:** he has been standing against a column the whole scene with his sword under his arm, still
  breathing hard from the quay. He pushes off it: "Mother. The flame is dying and everybody in this room knows it,
  and the envoy is the first person to say so in my hearing who is not me." Meera: "Vikram. You have fought eleven
  duels this month." Vikram: "Twelve." Then, to Gianna, which is the beat the design asks for (**he challenges Gianna
  over an argument**): "And you. *Remembers what is hidden.* Your goddess watches a flame die and writes it down.
  Hesitation is the only true death. Remembering is hesitation with a pen." Gianna: "Then stop hesitating and show
  it." Vikram: "That is an argument. I settle arguments." (`story.vikram_challenged`.) The chamberlain: "The yard."
- **The duel (jwaladesh-court's duel yard, outdoor; the sparring fight `duel_yard_vikram`, section 5):** Gianna
  alone (Anissa at the rope: "Gigi, he's already out of breath." Gianna: "Then it's a fair fight."). A sparring
  battle: no Game Over, nobody dies, **it ends either way** with Vikram bent double with his hands on his knees. Won
  (`choice.duel_won`): Vikram: "You argue... well. Breathing... is harder." Lost (`choice.duel_lost`): Vikram: "I
  win. I think. Give me... a moment... to be sure." Either way he straightens up and says the thing that moves the
  chapter: "The Keepers turned the mirrors down so nobody sees the chain lamp is dead. The lamp is dead because the
  store's chained. The store's chained because the Seth owns the oil and the Crown owns the Seth. Argument settled.
  Now somebody has to *do* something, and in this house that is apparently me." Meera, from the door: "You will do
  nothing. The Court has one word." Vikram: "Then I'll borrow the envoy's." He does not join yet (section 9: he joins
  at the flame, where the defiance costs him); he goes to find Aiyana.
- Journal: **The Court's one word** (done `story.court_heard`), **The duel** (done `choice.duel_won|duel_lost`, the
  objective `noXp`: a sparring match pays nothing), then **Until the night lamp** (the day gate, section 6,
  `followSide`).

### Beat 3: Until the night lamp (the required quests, any order; the arrow follows the ground)

- **J-2 The Lamp Relay** (the runners' hall and the bazaar's lanes, with the minor Echo M-JWA-1: section 7.1), **J-3
  The Anonymous Oil** (the junior priest; the Salt Flats at dusk; the back gate: section 7.2), the **debate** *Is
  hesitation a sin, or is remembering mercy?* (the spice row: section 7.3), the Palm-Leaf Library's nine books, the
  three vendors and the contract board.
- When J-2, J-3 and the debate are done: **night on the bazaar** (a flag variant `story.bazaar_night`): the
  lamp-sellers pack up by the light of one lamp each (walkers), the Exchange's price-board is wiped, and Aiyana is
  waiting at the harbor stair with a key on a cord: "The watch changes at the night lamp. There isn't one. So they
  change when they feel like it, and they feel like it about now."

### Beat 4: The chain tower (jwaladesh-harbor at night; the Echo scene; SIG-JWA part 1, section 8)

- The harbor at night (`story.bazaar_night`): the enforcers gone from the store's doors (the launch still there, dark),
  the trigger strips gone, the sheltered way along the sea-wall open (J-2's route knowledge, `clue.relay_route`, is
  what the runners' Echo taught: the sea-wall lane behind the jar-carts that the enforcers' lanterns do not reach; a
  player who walks the open quay instead meets the night watch's one enforcer pair, a fight `quay_watch`, winnable,
  section 5). Aiyana unlocks the chain tower's door (shown: the key, a beat, the door's look changes; `story.tower_open`).
  Inside: the stair to the lamp, the **chain's capstan**, and the lamp's reservoir, **full** ("Oil. Two years' worth.
  Nobody drained it; nobody lit it. I fill it every new moon because that is my job and nobody has told me to stop.").
  Anissa holds the door at the tower's foot ("I'll watch the quay, Gigi." Aiyana, to her, no joke: "If you see a
  lantern, say so. Don't shout. Just say it.").
- **The Echo: Arjun's charge** (the chapter's required Echo scene; the zone is the lamp's platform; `onEcho`,
  restartable until its flag is set): the night the Crown's fleet held Agnipur behind its own chain. The lamp stands
  ready with oil, unlit; the watchtower beside it has an empty bracket and a spare mirror at its foot; the Crown's
  chain is across the mouth (the same links); the Crown's ships beyond it (two hulls, placed). **Arjun** (Gen II, a
  big man in a saffron coat, a lance) and **young Patricio** (the player) at the lamp; **seven riders** below on the
  quay (placed), **Caona** named ("Caona's canoe brought you in under their noses. She's gone back for the ships."),
  not drawn. Arjun: "When the lamp is lit, your ships come in. When the chain falls, my riders come home. Your hand on
  the taper, Marshal: the signal is for Zetwal's ships, and a Zetwal hand should light it." Patricio (choice, both
  remembered, `choice.patricio_arjun`): "Seven riders against a chain tower?" / "Let my marines take the tower." Arjun:
  "Hesitation is the only true death. I have seven who believe it." / "Then it would be Zetwal's chain. It is going
  to be ours." **Patricio lights the lamp** (the Echo-era puzzle object; **anchor 1**, `anchor.chain_lamp`: the lamp
  is lit in the present too). Arjun: "And the temple must see it from the hill, or the city thinks we lost. The
  bracket on the old tower: bolt the mirror, face it at the temple." (A second Echo-era puzzle object on the
  watchtower's platform across a plank bridge; **anchor 2**, `anchor.tower_mirror`.) Then **the charge, shown:** the
  seven ride along the mole at the Crown's chain tower (walkers), cannon fire from the hulls (an audio slot and a
  screen shake, the owner's rule for off-screen events), two riders fall on the mole (their walkers stop), the
  tower's gate goes down, **the chain drops** (the links object changes look: slack in the water), and the five ride
  back along the mole. Arjun, at the lamp, not turning: "Seven rode out." Patricio: "Five came home." (S-JWA's roll
  call, heard here regardless; the secret item's Echo in the store is after the release.) `clue.arjun_charge`.
- **Back in the present:** the chain lamp **burns** (the anchor; the scene makes it glow), the tower mirror sits in
  its bracket, faced at the temple quarter, and its light stops dead against the Exchange's new tower. Aiyana, at the
  bracket: "That's Arjun's bracket. I've never seen a mirror in it. Who—" She stops, looks at Gianna's Locket, and
  does not ask. "Right. The roofs." From the store's dark doors, an enforcer's voice (a line, no fight): "Who lit
  that?" Anissa, at the tower's foot, quietly: "A lantern, Gigi. On the quay. Just saying it."
- Journal: **Arjun's lamp** (done `anchor.chain_lamp`), **Arjun's mirror** (done `anchor.tower_mirror`), **The roofs**
  (done `story.beam_at_temple`, beat 5).

### Beat 5: The roofs (jwaladesh-rooftops; SIG-JWA part 2, section 8; Aiyana's part)

- Up the dyers' stair onto the **rooftops** map (section 3): four mirrors on four roofs joined by plank bridges, the
  Exchange's tower in the middle of the old line, the temple's wick-window at the far end, the chain lamp's light
  arriving from the harbor side as a beam object (drawn segment by segment as flags are set). Aiyana goes ahead to
  each bracket and unbolts the "cleaning" lock (shown: she walks to the mirror, a beat, its look changes from
  face-down to turnable); the **player turns each mirror** (an object whose `use` steps its orientation: east, north,
  west, south). The old line is blocked, so the beam must go **round** the tower: **east, north, north, west** (the
  design's hint), each right turn drawing the next beam segment, a wrong one drawing the beam into a wall ("The light
  lands on brick."). Honest difficulty 4: four choices, each visible, the tower the only trick.
- **Anissa's part (no joke):** the fourth mirror's bracket is seized ("Rusted. I'd need an hour."). Aiyana takes a
  polished bronze disc from her apron, the size of a plate, and gives it to **Anissa**: "You hold the last one. Stand
  there. When the light hits it, point it at the window. Don't look into it." Anissa holds it; the player turns the
  third mirror; the beam lands on the disc; Anissa turns (a `face` cue) and the beam goes through the wick-window
  (`story.beam_at_temple`). (She is in no danger, hit by nothing, the target of nothing; she carries the light, which
  is what `SECRET-ITEMS.md` 4 says the chapter is about.)
- The signature puzzle's XP pays here (60). Vikram arrives up the stair as the beam lands (shown; he is out of
  breath from the stair, one line: "I ran. I should not have run."), looks along the beam to the window, and says
  nothing for once.
- Journal: **The roofs** (done).

### Beat 6: The flame (jwaladesh-court; Vikram defies the priests and joins)

- The Court at night: the beam falls through the wick-window onto the curtained altar (the curtain lit from behind;
  a flag variant), the Keepers at the altar, Meera at the seat, the junior priest at the colonnade's foot, the city
  **coming in through the doors** behind the party (walkers: the lamp-sellers, the runners, the shrine child, the
  dyer from the quay, Aiyana last with her wrench).
- **Vikram tears the curtain** (shown: he walks up the altar steps past the senior Keeper, takes the silk in both
  hands and pulls; the curtain object goes; the altar's look is a wick the height of a thumb in a dry bowl, with the
  beam on it). Meera, standing: "Vikram." Vikram: "The Court has one word. The city has eyes." The beam on the wick:
  the wick **catches** (the altar's look changes: a flame, small, in the beam). The senior Keeper: "It will not last
  the night without oil." Vikram: "Then the night is how long we have." **He defies the priests here, where it costs
  him:** "I am going to the quay to get the oil back. Whoever comes, comes. Mother, you can write it down as the
  thirteenth duel." Meera does not answer; she sits (a beat). **`party.vikram`: he joins as a fighter here**, before
  the boss (section 9; Claude's call, section 12: `STORY.md` says he joins after Dhanraj falls; he *leaves Agnipur*
  with the party then).
- Journal: **The flame seen** (done `story.flame_seen`), **The oil** (done `story.dhanraj_beaten`, beat 7).

### Beat 7: Seth Dhanraj (jwaladesh-harbor, the oil store; the boss, section 5)

- Back down to the harbor (the lamp burning over it now; the quay lit). The store's doors are open and **Dhanraj**
  is inside among his jars with his ledger and four enforcers, the Crown's factor's launch gone from the steps (as
  the observer's was: the Regent stays three moves ahead). A step trigger at the doors plays the scene (restartable
  until `story.dhanraj_beaten`). Dhanraj, courteous: "The Court's son, and the envoy. You lit the chain lamp; that
  was very fine. It changes nothing. Every jar in this harbor is mine by contract, signed at that altar, and the
  contracts were paid for with Throne sols. I do not hoard. I hold. Holding is lawful." Vikram: "Then I am going to
  argue with you." Dhanraj: "You are out of breath." Vikram: "Always." He kicks a jar over (shown): oil spreads in a
  ring at his feet. The fight `oil_store_dhanraj`: Dhanraj and two Oil Enforcers (two more by the second phase);
  two phases; nobody dies (he `withdraws` at 0 HP), section 5.
- **After, on the map (the scripted Yield):** Dhanraj on a jar with his ledger shut, the enforcers gone out the
  back, the ring of oil burning low round him (a flag variant; Vikram lit it in the fight's second phase). Three
  things in order:
  1. **The ledger, taken:** *Dhanraj's Ledger of Advances* (`item.dhanraj_ledger`, key; a Court book after): every
     jar in the harbor bought with advances from "the Throne's purchasing office, Kingsmere", countersigned by the
     oil-factor, with a line at the foot in the factor's hand: *Hold until the Court signs for the chain.* The proof
     Meera did not ask for (`clue.crown_holds_oil`). Samira reads it: "Drawn on a Kingsmere house. Not my mother's.
     I checked before I said that."
  2. **Dhanraj's end** (a choice, both remembered): **"Open the store to the temple. Every jar. Then the Court can
     decide what you are."** (`choice.dhanraj_spared`; +1 Influence at Jwaladesh; he is at the Court at dawn and
     signs the store over) / **"Let the city walk him up the hill past every lamp he emptied."** (Bayarmaa's line;
     `choice.dhanraj_broken`; +1 Fear; the Salt Flats' enforcer groups lose weight for the rest of the chapter.) He
     names the Crown in neither more than the ledger does: "I was paid to hold. I was never told why. Men like me
     are never told why." Nobody kills him.
  3. **The oil:** the runners come down the harbor stair with their lamps (walkers) and carry the first jars up the
     hill in a line (shown: the relay, run for real: J-2's rite with something to carry). `story.dhanraj_beaten`.
- Journal: **The oil** (done).

### Beat 8: The price (jwaladesh-court at dawn: the price, the token, Vikram leaves)

- Dawn at the Court: the flame burning on oil (the altar's look: a full bowl, a tall flame; the beam gone, the sun
  through the wick-window instead), the city still in the colonnade, the Keepers at the altar with their hands
  empty, Dhanraj kneeling at the colonnade's foot if spared, Aiyana on the altar's step with her measuring rod ("The
  height of my arm. I'll write it down."). The junior priest reads the ledger aloud (a walker). The senior Keeper,
  low: "The flame was to be kept." Meera: "It was kept by the city, in front of the city. The Court has one word.
  The word was wrong." She takes the crane from the altar's lowest step and puts it on the altar (shown: the crane
  object moves; `story.crane_accepted`): "Tell Kaede Suzumori her son stood in front of our flame. That is not an
  apology. It is a beginning."
- **The price (Wealth 8; the realm economy as built: flags and Journal notes, as Chapter 3's Free Brasador, Chapter
  6's fleet and Chapter 7's petition):** Meera: "The Agnivansh want one thing and have always wanted it: the oil to
  keep the flame, and the harbor to bring it in, and nobody's leave to do either. The treasury is empty. Count what
  the envoy has put in it." The scene reads **Jwaladesh's Wealth** (J-2's +1, J-3's +2, the contract board's mirror
  job if done) and pays, in order, each laid at the altar's foot:
  - **the oil store** ("Every jar in the harbor, by the Seth's own ledger, is the temple's." → +3 Wealth at
    Jwaladesh, always: the chapter's Wealth is the oil);
  - **Dhanraj's Crown advances** (the strongbox in the store, about 400 gold: the player may **give** it, the
    guide's "gold gifted counts, 100 gold = 1 point" → +4 if given, `choice.advances_given`; or keep it; Samira:
    "That is Throne money. Giving it to a temple is the best thing anyone has ever done with it, and I say that as a
    banker");
  - **the Ironvow token and the Suzumori crane** (both carried: "Spoken for twice, by people who do not speak to each
    other. That is worth a measure." → +1, always);
  - **Yari's petition** (if `item.petition` is still carried: Meera signs it: Se-5's Jwaladesh line is answered; no
    Wealth, +1 Influence).
  So the player leaves with Jwaladesh's Wealth between about 4 and 11 of 8; a player who gives the advances pays it
  in full here and overpays. **`ally.jwaladesh`** is set regardless (the alliance is made; the shortfall is a debt the
  Muster collects), with the Journal note *The Flame Keepers*: "Price: Wealth 8. Yours here: N. A house whose price is
  least paid is the one the Crown can still buy." (The same sentence as the Ironvow and Suzumori notes: the
  betrayal's rule, stated the same way three times; `clue.buyers_mark`'s closed hand is beside one of these.)
- **The token:** Meera lifts a small brass lamp from the altar's rail, lights it from the flame, and gives it to
  Gianna: `item.token_agnivansh`, "For the chamberlain's chair. Agnivansh sits, and burns." (Se-5's third token, in
  the price scene.)
- **Vikram leaves with the party** (the guide's "joins"): "I am going with them, Mother. Somebody has to argue with
  the Crown and I am the only one in this house who has had the practice." Meera: "You will be out of breath for the
  whole war." Vikram: "I will be *winning* for the whole war." Meera, the only warmth she shows, to Gianna: "He is
  right about one thing a day. Find the one." `story.vikram_left_agnipur`.
- **Aldermoor's door:** Meera: "The oil was bought with the Throne's purse, and the purse is in Kingsmere, under
  the Regent's keep, with everything else the Throne has bought this year. Nobody goes to Kingsmere." Haru:
  "Everybody is written down somewhere. The Regent's keep is where." Aiyana, from the step: "Jordyn's in Kingsmere."
  Azzy: "Titi Jordyn?" Aiyana: "In the Regent's guard. Don't look like that; it's a job. She'll be no use and no
  danger until she decides, and then she'll be both." (Chapter 9's seed, from the family that has one in every
  city; FAMILY.md puts Jordyn in the Regent's guard.)
- Journal: **The Flame Keepers** (done `ally.jwaladesh`).

### Beat 9: The quay (jwaladesh-harbor, then the card)

- The party walks to the quay (shown; Vikram, Haru, Bayarmaa and Salkhi with them; the lamp burning on the chain
  tower; the runners' lamps lit all the way up the hill behind them, a look). Aiyana at the chain tower's door with
  her key, not coming: "I've got a flame to measure every morning for the rest of my life. Azriel: don't hold
  things." The Zetwal trader takes them **north along the west coast** to Aldermoor (Kingsmere at (22, 62): a sea
  voyage `jwaladesh_aldermoor`, captions "North, past the salt, along the white coast..." / "...to the moor, where the
  Crown keeps its books"). Salkhi is loaded last ("No grass. I have stopped asking.").
- Card: *Chapter 8 complete, The Dying Flame. Next: Chapter 9, The Regent's Keep.* `act8.complete`. `?chapter=9`
  starts where Chapter 9's outline puts the landing.
- Journal: **North** (done `act8.complete`; pays no XP: a card).

---
