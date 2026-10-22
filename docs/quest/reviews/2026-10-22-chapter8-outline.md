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
  horse on outdoor maps; **level 19** by the tool (5,085 to 5,215 after Chapter 7's dials) and **about 21 as
  played** (the Chapter 7 outline's section 5: about 6,350 with the taper at 0.25, which this outline assumes landed;
  section 5 has what that means for this chapter and what it does not). Echo party: Patricio, Caona, Benny. Gold about 1,600 to 2,400 less Kirinoura's armourer.
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

## 3. The maps (six, drawn in code like Cenizal, Ordvik and Kirinoura: `tools/maps/jwaladesh.ts` through `painter.ts`)

Registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`, city id `jwaladesh`, name Agnipur, house Agnivansh). The
look: white stone and saffron, brass everywhere, salt-white ground beyond the walls, a sky painted orange at the
horizon on every outdoor map (the salt's glare), the one new brick tower in a city of old white domes. Accent
`#e67e22` (CAPITALS). Tiles for the tool: `WHITESTONE`, `SALT`, `SCRUB`, `QUAY`, `MOLE`, `CHAIN` (an `above`
object, two looks: taut, slack), `BRASS`, `SAFFRON` (the Court's floor), `COLONNADE`, `ROOF`, `PLANK` (the rooftop
bridges), `JAR` (object), `MIRROR` (object, five looks: face-down and four orientations), `BEAM` (an `above` object,
four orientations, placed by flags), `LAMP` (object, two looks), `CURTAIN` (object, two looks), `ALTAR` (object,
three looks: a thumb's height, a flame in the beam, a tall flame).

| Map | Size (tiles) | Section | Echo | What is on it |
|---|---|---|---|---|
| `jwaladesh-harbor` | 34 x 22 | The Harbor Chain (outdoor) | **the chain lamp's platform** (one zone: Arjun's charge; anchors: the chain lamp, the tower mirror) | The landing, the quay, the chain across the mouth, the chain tower and its lamp, the old watchtower with its bracket (a plank bridge between the two platforms), Dhanraj's oil store (the doors, the jars, the strongbox, the boss trigger; S-JWA's balance lock placed inert at the back), the factor's launch (until `story.dhanraj_beaten`), the harbour-master, the milk stall's awning, the sea-wall lane (open on `story.bazaar_night`), the night watch's pair on the open quay, the harbor stair (sighting 1), the voyage trigger (after `ally.jwaladesh`) |
| `jwaladesh-bazaar` | 44 x 30 | The Lamp Bazaar (hub, outdoor) | **the runners' hearth** at the temple steps (one zone: Arjun's runners, M-JWA-1; no anchor) | The lamp lanes, the dyers' vats and their rooftop stair, the spice row and the debate corner, the milk-and-bread stall, the bead seller, the swordsmith, the contract board, the shrine child's dark shrine (J-4, inert), the runners' hall at the temple steps (J-2), the Exchange's tower and price-board, the library door (west), the temple steps and the Court's doors (north centre; the duel yard is the Court map's outdoor pocket, seen through its rope gate from the steps), the salt gate (east, to the flats); the relay's gust lanes and sheltered lanes (M-JWA-1); day and night variants; Salkhi's placements |
| `jwaladesh-rooftops` | 30 x 18 | The Roofs (outdoor) | none | Four roofs joined by plank bridges, the four mirrors, the Exchange's tower in the old line, the wick-window at the far end, the beam segments (by flags), Aiyana's placements per mirror, Anissa's spot at the fourth |
| `jwaladesh-library` | 22 x 14 | The Palm-Leaf Library (interior) | none | The nine books on low shelves in bundles, the librarian (Hindi greeting), the Gaze pilgrim's reading corner |
| `jwaladesh-court` | 36 x 28 | The Court of the Flame (the seat of government, interior, with the duel yard as an outdoor pocket on its east side) | none | The colonnade to the altar (the curtain, the wick-window, three altar looks), the ruler's seat, the priests' council, the treasury, the envoys' pavilion (the factor and Dhanraj until the duel), the runners' hall door (the hall itself is on the bazaar map: the steps), the duel yard, the records room (three Court books, the ledger after), the back gate and its kitchen lane (J-3's delivery) |
| `jwaladesh-saltflats` | 46 x 28 | The Salt Flats (wild, outdoor) | none | The caravan road east from the salt gate to the salt-road shrine (J-3's carter waits there), the pans and scrub off the road (the ambush layer, `salt_flats`), a Crown oil-cart heading for the coast (placed, a line), the jackals' den |

Six maps: CAPITALS' five with the **rooftops** split out (the mirrors need their own plank-bridge lanes and a flat
plane for the beam; a roof layer on the bazaar's map would be the hub's whole `above` layer) and the Court's runners'
hall folded into the bazaar's temple steps (a runners' hall needs the lanes outside it, not a room). The Court is
36 x 28, the seat paragraph's size. **Outdoor areas, buildings aside: six** (the quay and mole, the bazaar's lanes,
the rooftops, the duel yard, the salt road, the pans), the owner's rule. The seat is central (at the head of the
bazaar, the temple steps rising from the market), large, staffed, and full of people who disagree (Meera, two
priests, the chamberlain, the treasurer with an empty book, the Crown's factor, the chief runner, Dhanraj as a
guest). The market is the lamp lanes (brass and no oil; nothing like a plaza, a souk or a fair). The validator's
rules hold: every zone tile walkable in both eras (the lamp's platform); no NPC or door inside a zone; the two
anchors are Echo-era puzzle objects (the taper at the lamp, the mirror at the bracket) whose dialogue sets
`anchor.chain_lamp` and `anchor.tower_mirror`, read by the present lamp, bracket and beam.

**Drawn placeholders** (code, through `assets.config.ts`): a mirror as a 1 x 2 object with five looks; a beam
segment as four `above` tiles; the chain as an `above` strip with two looks; a brass lamp 1 x 2 with two looks; the
curtain 2 x 2; the altar 2 x 2 with three looks; a jar 1 x 1; an oil ring on the floor as a flag look of the store's
tiles; a saffron recolour of the Chapter 5 envoy's shape for the Court's people.

---

## 4. The Echo and the fights: what the engine has and what this chapter uses

- **The Echo party** is Patricio, Caona and Benny, as data; the field draws only Gianna's sprite in the Echo, so
  Arjun's charge is staged with Arjun, the seven riders, the Crown's hulls and the chain as Echo-era NPCs, walkers and
  objects, and the taper and the mirror as Echo-era puzzle objects. Caona and Benny are one line each ("Benny is
  with the Zetwal ships."), not drawn. No new system.
- **No Echo battle.** The charge is seven riders against a tower, and Patricio is at the lamp: a battle would put him
  on the mole, where the story has him lighting the signal; and the Echo-battle foundation is kept for the chapters
  that need it (Chapter 11's harbor). The cannon, the two fallen riders and the chain dropping are walkers, a sound
  and a shake (the owner's rule for off-screen events, used for an on-screen one that is too big to fight). Claude's
  call, section 12.
- **The present's fights** use what Chapters 3, 4, 6 and 7 built: enemies as data with `moves`, `every`, `tell`,
  `area`, `magic`, `statuses`, `hire`, `protects`, `withdraws`; battles with `phases` (`below`, `onSurge`, `enter`),
  `rewards`, `endsWithBoss`, `meantToLose` and `finale`. There is no `burning` status, no fire immunity (only
  `resist` at x0.5), no delay on items, no sparring rule and no solo-fighter rule (section 10 has each, with its
  fallback). Everything below is written to those shapes.
- **Vikram as a fighter** is a `MemberDef` in `rpg.ts` plus `SKILLS.vikram` and `MOVES.vikram` in `battles.ts` and a
  placeholder look (section 9); `joins: { flag: 'party.vikram' }`. Two of his four skills need small engine pieces
  (section 10); the other two are data.
- **Who fights.** With Vikram the party has **seven** fighters and `BATTLE_ACTIVE` is 4. By the built rule the active
  four are the first four joined in `MEMBERS` order, so without the Chapter 6 review's active-order flag (3.9) Vikram
  is benched in his own chapter, which is a bug. **This outline requires the flag** (`party.active`, set at the join:
  Vikram replaces the fourth for this chapter; the order is the player's afterwards): if Chapter 6 or 7 built it, this
  is data; if not, it is this chapter's first engine piece (section 10). The sim ran him active with Azzy (Haru
  benched), active with Haru (Azzy benched), and benched: all three win every seed (section 5), so the fight does not
  depend on him, but the chapter does.

---

## 5. The chapter's fights and levels

**Enemies (new data, `COMBAT.md` 13.2 and 13.3, in the engine's shapes):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Oil Enforcer** (`oil_enforcer`) | brute, `bribable`, resists fire | 20 to 21 | Cudgel 110; **Oil Flask** 90, `burning` 60% (section 10; fallback `weakened`), every 3, tell "The enforcer uncorks a flask and swings it by the neck..." | COMBAT's Burning, built as a status if the piece lands |
| **Ember Jackal** (`ember_jackal`) | skirmisher, resists fire, weak to water | 20 to 21 | Bite 100; Ember Snap 120, every 3, tell "The jackal's coat sparks. It crouches..." | COMBAT's Scavenge (heals on a kill) has no engine support: cut. Animals never bribed; flee at the end as the engine's last-foe rule does |
| **Road Bandit** (built, `road_bandit`) | as built | 20 | as built | the design's "Oil Enforcer and Road Bandit" group |
| **Quiet Crown Zealot** (built, `qc_zealot`) | caster | 21 | as built | "The little one glows, they say. Even in the salt." |
| **Vikram, sparring** (`vikram_duel`) | skirmisher, `hpScale 2`, `atkScale 1.2`, `withdraws` | 20 | Quick Thrust 100; Ember Cut 130, every 2, tell "Vikram draws a breath he does not have and the blade glows..." | the duel only; no XP, no gold, no Game Over (section 10) |
| **Seth Dhanraj** (`seth_dhanraj`) | brute, `boss`, resists fire | **21** | section below | the Crown-backed oil hoarder |

**Seth Dhanraj, two phases, sim-checked:** level 21, `hpScale 6`, `atkScale 1.5` (the brute line at 21 with those
gives about 1,690 HP and 107 ATK before the Story difficulty's 0.8 and 0.7). COMBAT's 8 / 1.1 on the standard line
is 8 x 1.4 once the brute's HP is counted, and the sim shows it ends in 44 to 48 party actions with nobody hurt: too
long for a fight whose trick is a wall, not a knife.

1. **Hoard:** *Ledger Staff* 120; ***Oil Wall*** (`power 0`, `ally: 'seth_dhanraj'`, `statuses: ['oiled']`, every 3,
   tell "Dhanraj kicks a jar over. Oil spreads in a ring at his feet; nothing burns there."): the `oiled` status
   (section 10) makes him **immune to fire** and halves other damage for its turns, and **a Surge shatters it** (the
   built `shatter`, as the Golden Wall): Anissa's light is what breaks the wall of oil, which is the chapter's
   picture. Fallback: the built `gilded` (no fire immunity; the sim used it). Two Oil Enforcers at his side from the
   start (COMBAT's "Oil Enforcers").
2. **Price Spike** (`below: 0.5`): "Then the price goes up."; `enter: ['oil_enforcer', 'oil_enforcer']` at 21,
   `enterText` "Two more enforcers come in from the back with flasks."; moves *Ledger Staff* 130 and ***Price
   Spike*** (`power 0`, `itemDelay: 1`, every 2, tell "Dhanraj opens the ledger. 'Everything you carry just got
   dearer.'": for the rest of the fight the party's items cost a full extra turn of delay, COMBAT's rule, section 10;
   fallback: a 150 area blow every 2, which the sim used, with the tell ending "Guard, everyone!"). **Lighting his
   oil:** once the wall is shattered, **any fire skill** on him (Vikram's Ember Cut, Azzy's Reinado, Gianna's Ember
   Flare from the lantern staff) sets `burning` on him for the rest of the fight (COMBAT's "lighting his oil Burns
   him": in data, a `weak: ['fire']` and `burnsOnFire: true` on the phase, section 10; fallback: he is simply weak to
   fire in phase 2).
3. At 0 HP he `withdraws` ("Enough. The oil is yours. It was always going to be somebody's."), and the enforcers go
   out the back: nobody dies. `endsWithBoss`: a standing enforcer leaves as he falls.

| Scaling tried (Gianna, Yari, Azzy, Vikram; 30 seeds; Story difficulty; the wall as `gilded`, Price Spike as the area blow) | Party 19 | Party 20 | Party 21 |
|---|---|---|---|
| hp x5, atk x1.3 | 30/30 won, 37 actions, 0 down, 67% HP left | 30/30, 35, 0, 60% | 30/30, 32, 0, 67% |
| **hp x6, atk x1.5, phase 2 at 50% (chosen)** | **30/30, 41, 0, 64%** | **30/30, 39, 0, 65%** | **30/30, 37, 0, 71%** |
| hp x7, atk x1.5 | 30/30, 44, 0, 57% | 30/30, 42, 0, 63% | 30/30, 41, 0, 63% |
| hp x8, atk x1.6 (COMBAT's, with the role) | 30/30, 48, 0, 63% | 30/30, 44, 0, 59% | 30/30, 43, 0, 65% |
| hp x10, atk x1.8 | 26/30, 59, 0.73, 58% | 29/30, 55, 0.20, 67% | 30/30, 52, 0, 67% |
| hp x7, atk x1.6, phase 2 at 50%, with Haru active, Azzy benched | 30/30, 44, 0, 66% | 30/30, 43, 0, 69% | 30/30, 40, 0, 70% |
| hp x7, atk x1.6 with Vikram benched (the built order) | 30/30, 43, 0, 60% | 30/30, 40, 0, 63% | 30/30, 39, 0, 66% |

So x6 / x1.5 gives a boss of about 39 party actions at 20 (nine or ten of Gianna's turns, four enemies on the field
for most of it), where Grimvald sat at 29 and the Fox at 26: longer because the enforcers must be cut down twice,
and the stand-in wall halves *all* damage for three turns at a time. The real Oil Wall halves only fire to zero and
the rest to half, and the real Burning costs a glass cannon 6% a turn, so the honest fight is shorter and sharper
than the sim's: **x6 is the ceiling, and the simulator with the built statuses decides on day 1 whether it holds or
drops to x5.** Nobody down in any seed at x6; Game Over applies (not meant to lose); the way back in is the store's
doors.

**The duel, sim-checked (Gianna alone against Vikram at 20, `hpScale 2`, `atkScale 1.2`):** Gianna wins 17 of 30 at
19, 25 of 30 at 20, 27 of 30 at 21, in about 8 actions, with about half her HP left. That is the shape the design
asks for: a sparring match she can lose at the tier's floor and usually wins at its top, over in a minute, with no
Game Over either way (section 10). At x1.5 / x1.0 she never loses; at x3 / x1.3 she rarely wins. Both outcomes play
the same scene with one line changed.

**The other fights:**

| Fight | Where | Foes | Level | Party then | Pays (data) |
|---|---|---|---|---|---|
| Ambushes (`salt_flats`, from `story.jwaladesh_arrived`) | the pans off the salt road | Ember Jackal x3 (20); Oil Enforcer x2 (21, weight 2; weight 1 after `choice.dhanraj_broken`); Oil Enforcer + Road Bandit (20); Quiet Crown Zealot x2 + Oil Enforcer (21) | 20 to 21 | 19 to 21 | the encounter rule, tapered (below) |
| **The duel** (`duel_yard_vikram`) | the duel yard | Vikram at 20 (sparring) | 20 | 19 to 20 | 0 XP, 0 gold (a sparring match; the objective is `noXp`) |
| **The salt-road enforcers** (`salt_road_enforcers`, J-3's seizure) | the salt-road shrine | Oil Enforcer x3 at 21 | 21 | 19 to 20 | 60 XP, 150 gold (data) |
| **The night watch** (`quay_watch`, the sea-wall's fail-safe) | the open quay at night | Oil Enforcer x2 at 21 | 21 | 20 | 40 XP, 100 gold (data) |
| **Seth Dhanraj** (`oil_store_dhanraj`) | the oil store | Dhanraj 21 + two enforcers 21 (two more at 50%) | 21 | 20 to 21 | **100 XP, 300 gold**, items: the ledger (key), the strongbox (400 gold, giftable) |

Sim-check of the ambushes (same bot): three jackals at 20, 30/30 in 7 actions with 93% HP left; two enforcers at 21,
8 actions, 94%; an enforcer and a bandit at 20, 5 actions; **two zealots and an enforcer at 21**, 9 actions, 90%;
three enforcers at 21 (J-3), 14 actions, 88%; four jackals at 21 (J-5's caravan, after the release), 11 actions. The
party at 20 is strong (Azzy 203 HP, Vikram ATK 82 and SPD 55, Haru SPD 56), so the flats' groups sit at the tier's
top (20 to 21), not its floor, or they are grey (`LEVELS.bands.trivial = 3`).

**Levels through the chapter** (tool line from 5,150; played line from about 6,350; objectives 25, books 10, the
signature puzzle 60, the minor 25, the debate 15 joined or 25 mediated):

| Point | XP from | Tool total | Level |
|---|---|---|---|
| Start (the quay) | | 5,150 | 19 |
| Under the chain, the mirrors are down, the Court's one word, Arjun's lamp, Arjun's mirror, the roofs, the flame seen, the oil, the Flame Keepers (nine objectives at 25; the duel and the card are `noXp`) | 225 | 5,375 | 19 |
| SIG-JWA (60), M-JWA-1 (25), the debate joined (15) | 100 | 5,475 | 19 |
| J-2 (100 XP), J-3 (100) and its enforcers (60) | 260 | 5,735 | **20** |
| Dhanraj (100) | 100 | 5,835 | 20 |
| The library's nine and the Court's three, if read (120) | 120 | 5,955 | 20 |

The tool lands at **20 (5,835 to 5,955)**, 80 to 200 XP under 21 (`slackUnder = 1` holds); without the two side
quests, 5,575: **20** (`skipSideQuestsMaxUnder = 2` holds). The chapter's own content (685 without the books, 805
with them) is a little under its two-level band (19 to 21 is 936 XP), which is right: a party that arrives on target
leaves on target, and the books make up the rest.

**The played line is the problem, and it is not this chapter's to solve.** The Chapter 7 outline's played line, with
the taper at 0.25, ends at about **6,350 (level 21)** against its tool's 5,150 (19): a real player arrives here two
levels over, carrying Chapters 5 to 7's surplus. From 6,350 this chapter's 685 alone reaches 7,035, which is **level
23 by 5 XP** (23 is at 7,030), before a single ambush; two tapered ambushes (a level-20 trio pays 150, a level-21 pair
105) make it 7,290 and the books 7,410: **23** either way, two over the target and outside `slackOver = 1`. Without
the taper the two ambushes pay 1,020 and the line is 8,055: **24**. Nothing inside Chapter 8 can bring a party that
arrives at 21 back to 21: cutting every fixed reward to zero would still leave it at 22. So:

- **This chapter's data is set for a party that arrives on target** (Dhanraj 100, the quests 100, the boss and the
  flats' groups at 20 to 21), and it adds about one level to whatever it inherits, which is what a two-level band
  with books should do. A 24-step grace on the flats and the salt road kept safe hold its ambushes to about one.
- **The fix is upstream, and it is the central session's, on day 1:** measure Chapter 7's played end (the Chapter 6
  review's 3.1 (b): the real routes plus one or two seeded ambushes, not an assumption), and if it is over 6,034,
  either lower Chapters 6 and 7's fixed data and ambush weights until the party arrives here at 20 (their bosses
  and quests are already at 100, so the lever left is the ambush rule: a fixed small share of the party's next
  level per foe group, the review's (c)), or accept the drift and plan Chapter 9 from the **measured** start, not the
  table's (its band of 21 to 24 is three levels wide and absorbs a 22; a 23 means Chapter 9 ends at 25 and the
  drift compounds into the war). Either is a balance statement for the milestone note, not a pop-up (the Chapter 6
  review's reading of the owner's rule); this outline recommends the first.

`CHAPTER_LEVELS` 8 keeps `from: 19, to: 21`; the simulator with Chapter 8's route decides on day 1 whether its own
dials move at all.

**Gold:** about 1,600 to 2,400 in; the flats' ambushes about 160 each; J-2 250, J-3 300; Dhanraj 300 and the
strongbox's 400 if kept. Out: the swordsmith's tier-20 gear if not bought in Kirinoura and the tier-24 pieces (a
talwar for Vikram about 900, scale armour about 1,000, the flame-bead bracelet, which J-2 gives, is not sold), the
milk stall, the bead seller's brass lamp charm (resists fire, 300 gold, useful on the flats). Nothing in the chapter
requires spending; the strongbox is the one place gold buys Wealth, and it is optional and says so.

---

## 6. The required-before gate: "Until the night lamp"

- **In the story:** the Court has refused; Aiyana has a key to the chain tower and says the watch changes at the
  night lamp, "about now" after dark; Vikram has gone to find her. So the day is the party's, and the city names
  what is in it without saying "quests": Aiyana, on the roof: "The runners on the temple steps still practise the
  relay with nothing to carry. Go and see why. And the junior priest wants to tell you something his Court has told
  him not to; he's in the colonnade pretending to sweep." The debate is on the spice row, on the way to both.
- **In the Journal:** the objective **Until the night lamp**, `followSide`, done when J-2, J-3 and the debate (joined
  or mediated) are done, **or** when `story.tower_open` is already set (a save at the tower never sticks).
- **On the map:** Aiyana at the harbor stair is a step trigger that waits for the three (`if:
  'side.lamp_relay.done, side.anonymous_oil.done, debate.jwaladesh_hesitation.joined|debate.jwaladesh_hesitation.mediated'`);
  until then she is worded from the flags: "The runners are still on the steps." / "The priest is still sweeping." /
  "The two on the spice row are still at it." Anissa: "Your Quests page, Gigi."
- **The night variant** (`story.bazaar_night`) is set when the third completes; it clears on `story.flame_seen`
  (beat 6: the city comes to the Court at night; dawn is beat 8's variant, `story.court_dawn`).
- **A second, softer gate, by the ground:** the sea-wall lane on the harbor map opens on `clue.relay_route` (J-2's
  Echo), so a player who skipped J-2 would meet the night watch on the open quay (a winnable fight, not a block): J-2
  is required by the counter and *useful* by the ground, which is the Opus minimum's "two required side quests" with
  one of them never feeling like an errand. J-3's oil is what the runners carry up the hill after Dhanraj falls (beat
  7's walkers read `side.anonymous_oil.done`, which the gate guarantees).
- **Order the arrow follows:** J-2 (the temple steps, nearest the Court's doors), the debate (the spice row, on the
  way to the salt gate), J-3 (the salt gate, the flats, the back gate); then the harbor stair.
- **No soft-locks:** the duel ends either way and the scene after it is the same; J-2's gust lanes return the lamp
  to its start and the runners repeat the direction ("Not the main street. Never the main street."); J-3's enforcers
  are winnable and Game Over returns the party to the salt-road shrine; the flats' ambushes are at the party's level;
  the four mirrors can be turned any number of times (every state is reachable; a wrong beam is a line, not a
  state); Dhanraj's trigger restarts; the debate's Provoke does not resolve it.

---

## 7. The two required side quests and the debate

Why these, from J-1 to J-5 and the Opus minimum: **J-4 Oil for the Little Lamps** is the secret item (after the
release; the shrine child is placed with her line and the store's balance lock is inert). **J-1 Win Every Argument**
opens only after Vikram joins, which is beat 6: a quest that opens at the chapter's end is a quest the player does
in Chapter 9's time, and its three rematches are three more sparring fights; after the release, when the sparring
rule exists for the duel anyway, it is cheap, and it is the first thing to add. **J-5 Jackals on the Salt Road** is
an escort fight with no Echo and no story; after the release, with the caravan as a walker. That leaves **J-2 The
Lamp Relay**, the chapter's minor Echo (M-JWA-1: Arjun's runners' sheltered lanes, no anchor), the rite that the
dying flame has made pointless and the boss's fall makes real again (the runners carry the oil), the route to the
chain tower at night, and the flame-bead bracelet (the city's gear quirk, guide 8); and **J-3 The Anonymous Oil**,
the rebel safehouse (the seventh ash thumbprint, which no chapter may skip), the one quest that walks the wild
section, the chapter's one optional-feeling fight, and the oil the runners carry. No new quest is added.

### 7.1 The Lamp Relay (J-2; the runners; M-JWA-1)

- **Opens:** the runners' hall at the temple steps, from `story.court_heard`. Shows as *??? The temple steps* until
  spoken to. The chief runner (an old woman with a lamp on a pole, the runners' badge): "Every new moon for fifty
  years the runners carried the sea's fire from the chain lamp to the wick: harbor to temple before it gutters, and
  the wind off the sea tries to put it out the whole way. The chain lamp has been dark two years. We practise with
  kitchen fire so we don't forget the way. Nobody has told us to stop." Accepted when spoken to
  (`side.lamp_relay.accepted`).
- **Steps:** 1) **The Echo** (M-JWA-1): the zone is the runners' hall's hearth; swap: Arjun's runners (three figures in
  saffron with lamps, the Echo palette) set off from the hall at a run (walkers) and the first of them says, to
  Patricio, "Never the main street, Marshal: left at the dyers, through the arch, along the wall," and the three are
  seen taking exactly that way across the bazaar's Echo lanes (the arch and the wall are the same in both eras; the
  Exchange's tower is not there in the Echo, which the player sees). `clue.relay_route`. 2) **The present:** the
  chief runner lights a lamp from the hearth and gives it to Gianna (a key item while carried, `item.relay_lamp`,
  with a look on her sprite: a lamp in her hand): carry it from the harbor stair's foot to the temple steps. The
  bazaar's **main street** and the open lanes are **gust tiles** (trigger strips that put the lamp out: "The wind
  comes off the sea. The lamp gutters, and goes out." and return the player to the stair's foot with it relit); the
  **sheltered lanes** (left at the dyers, through the arch, along the wall) are safe. The engine has no timer and no
  step count; a gust lane that returns the player is the Chapter 7 fog-return trigger again, data only (section 10:
  the step counter is optional and not recommended). 3) At the steps the chief runner takes the lamp and sets it in
  the hall's bracket (shown): "That's the way. When there's something to carry, you'll know it." `side.lamp_relay.done`.
- **Reward:** 100 XP, 250 gold, +1 Wealth (Jwaladesh), the **flame-bead bracelet** (a charm, level 20: fire skills
  +15%, built as `special: { kind: 'elementBoost', element: 'fire', share: 0.15 }`, a new special kind of about ten
  lines, or as `mag: 4, atk: 2` if the piece is cut; Vikram's and Azzy's), the Journal note *The relay*: "Harbor to
  temple before it gutters: left at the dyers, through the arch, along the wall. The sea-wall lane is the same idea."
- **Why it fits:** the design's quest as written (the timing route and Arjun's runners); the chapter's minor Echo; the
  route the party needs at night (the sea-wall lane opens on `clue.relay_route`); and the rite the chapter restores
  in beat 7, so the quest is not an errand but the first half of a thing the story finishes.

### 7.2 The Anonymous Oil (J-3; the rebel safehouse)

- **Opens:** the junior priest in the Court's colonnade, from `story.court_heard`. Shows as *??? The sweeping priest*.
  Accepted when spoken to (`side.anonymous_oil.accepted`): "Oil comes to the back gate. Not from the Seth; from
  nobody. A carter from the salt road, every few nights, with jars he will not be paid for. The Court takes it and
  does not ask, because the Court has one word. Tonight he's late, and the Seth's men have started watching the salt
  road. If you were going that way." (The design's "watch the gate" opened out onto the flats, so the wild section is
  walked by a required quest: Claude's call, section 12.)
- **Steps:** 1) Out through the salt gate at dusk onto the **Salt Flats** (the ambush layer; the salt road itself is
  safe, as Ardencia's road and Kirinoura's causeway were). 2) At the **salt-road shrine** (a Four Hands flame shrine,
  dark), the **carter**: a cart of jars under sacking and a man who speaks Kreyol-accented English and does not give
  his name ("The jars are for the wick. Nobody sent them. Write that down if you must write something."). Three Oil
  Enforcers come up the road behind the party (shown: `enter` from the east, `walk` to the cart): "The Seth's
  contract says every jar on this road is his." The fight `salt_road_enforcers` (three at 21, winnable; after it the
  road is clear, `story.salt_road_cleared`). 3) **The jars, close up:** the grey **ash thumbprint** on every seal (the
  safehouse: `side.anonymous_oil.done`, the thumbprint count up one: seven). Haru: "Oil, bread, water, grain, paper.
  Now oil again. The same thumb, in six cities." The carter, going: "Seven, if you count right. Somebody is feeding the
  realm, and he isn't doing it for a goddess." (The Journal note the design gives at five thumbprints is already
  unlocked; this is its echo in a man's mouth, and reads either way.) 4) **The back gate:** the cart to the Court's
  kitchen lane (the carter walks it; the party walks beside); the junior priest takes the jars in at the back gate
  (shown) and says the quest's last line: "Nobody. Again. I have stopped asking and started counting."
- **Reward:** 100 XP, 300 gold, +2 Wealth (Jwaladesh), the Journal note *The salt-road carter*: "Oil for the wick from
  nobody, with the ash thumbprint on the seal. Seven of nine. In Agnipur the rebels' oil goes to a temple that will
  not say it needs it."
- **Why it fits:** the safehouse thread (the design's steps and reward, with the enforcers' seizure kept as the
  fight); the wild section on the route; and the oil the runners carry up the hill after Dhanraj falls, so the quest
  is seen paying off in the chapter's own ending.

### 7.3 The debate, required: *Is hesitation a sin, or is remembering mercy?* (the spice row)

- **Where:** the debate corner on the bazaar's spice row. **Opens:** from `story.court_heard`.
- **The two speakers** (guide 7.2): a **Flame Keeper** of the Four Hands ("The flame is a hand. A hand that waits is
  a hand that has let go. Rani Tejaswini said it: hesitation is the only true death. The Crown did not hesitate at
  our chain; Arjun did not hesitate at theirs.") against a **Gaze pilgrim** from Zetwal, elderly, in a sun-marked
  shawl, here for the flame ("A goddess who remembers is a goddess who waits. The one who waits is the one who can
  forgive. Your Arjun rode; five came home; somebody remembered the two, or nobody would know their names."). The
  built debate shape (listen, join, mediate, provoke; three rounds; scripture, reason, compassion): the ally is the
  **pilgrim** (Gianna's faith), the opponent the **Keeper**. The player may argue the Keeper's side, which is the
  point of the question: the chapter's Court hesitated for a month behind a curtain and called it keeping the flame,
  and its son settles arguments by not hesitating; the chapter answers both with a lamp that was lit once and kept
  burning fifty years by a patient measure (S-JWA's theme, stated by the debate before the item exists).
- **Reason needs** one of *Rani Tejaswini's Flame*, *The Flame Keepers* or *The Harbor Chain* (`reasonNeeds`; the
  library is open all day). **Mediate** needs the built Influence 5 at Jwaladesh (listen +1, books +1 each: reachable
  by a reader). Rewards: the built `DEBATE_REWARDS`. A mediation's line from Vikram, if he has joined (the corner
  stays open after the flame): "I have settled this argument eleven times. It keeps coming back. That is the first
  thing I have ever found that does." Anissa's line after, the only judgement: "The fire one wants everyone to hurry,
  Gigi. And the sun one wants everyone to wait. The lamp on the chain did both. It waited fifty years and then it
  was quick."
- **The quest:** *Is hesitation a sin, or is remembering mercy?*, required, done on joined or mediated. After the
  Harbor Turn the corner rewrites itself (Chapter 11's build). No faith is a cult; the Keeper is a believer, not a
  zealot, and the Quiet Crown's zealots are on the flats, where no line joins them to him.

### 7.4 Books, vendors and the board

- **The Palm-Leaf Library (9, `CAPITALS.md` 8):** *Rani Tejaswini's Flame* (the founder; the doctrine), *The Harbor
  Chain* (Arjun's charge: seven rode out, five came home; a reader has the Echo's roll call before the Echo),
  *The Law of the Flame* (who may tend it, who pays for its oil: the price in the city's own words), *The Flame
  Keepers* (the fire sect), *Oil, Ghee and Grain* (prices since the hoarders cornered the oil: "forty the measure,
  was four"), *The Relay* (the runners' rite; the sheltered lanes named, so a reader has M-JWA-1's idea), *Duels Over
  Breakfast* (gossip: Vikram's eleven duels this month, "all over arguments, all won, all on one breath"), *The
  Burned Temple, Our Account* (the Suzumori fire from the side that lost the temple; pairs with Kirinoura's *The
  Burned Temple*: a reader of both has the feud from both sides, K-5's seed), *The Agnivansh Line* (Tejaswini, Arjun,
  Meera, Vikram). Reading one gives +1 Influence (Jwaladesh) and 10 XP.
- **The Court (3):** *The Treasury Book* (blank after the spring), *The Priests' Decision* (readable at the council:
  the vote to hide the flame's failing, four to three), *Oil Contracts* (all signed with Seth Dhanraj; after beat 7,
  *Dhanraj's Ledger of Advances* beside it).
- **Vendors (guide 8; one new glossary `hindi.json`, every entry `verified: false` for the Nov 18 check):** the
  milk-and-bread stall ("Namaste!": spiced milk 18 SP, flatbread heals 50, lentil stew 40 HP over 3 turns), the bead
  seller ("Namaste.": the brass lamp charm, a charm, level 20, def 3, resists fire; the flame-bead bracelet is J-2's
  reward and is not sold), the swordsmith ("Dhanyavaad." on a sale: a talwar for Vikram, level 24, atk 24, `blade`;
  scale armour, heavy, level 24, def 18, hp 30, spd -1; Kirinoura's tier-20 short blade and lacquered armour for a
  player who skipped them).
- **The contract board:** "escort a salt caravan" (J-5, after the release, with a line: "The Seth's enforcers took
  the last one"), "run the lamp relay" (J-2's own notice), "clean the rooftop mirrors (Influence)": built as a
  one-line job that pays +1 Influence once the mirrors are turned (`story.beam_at_temple`), because the player has
  just done it.
- **Anissa's nudges** (mystery quests, under 128 characters): "The woman on the roof keeps looking at Azzy, Gigi." /
  "The runners have lamps and nothing to light them for." / "The priest with the broom isn't sweeping." / "The two
  by the spices are arguing about waiting."

---

## 8. The Echo puzzle: the relay of lamps and mirrors (SIG-JWA, design difficulty 4; honest 4)

The design (`PUZZLES.md`): the temple's wick needs light from the harbor's chain lamp, carried by bronze mirrors on
four rooftops; the chain lamp is dead and a newer tower blocks the old line; in the Echo, the night of Arjun's
charge, the lamp stands ready but unlit and the old watchtower has an empty bracket and a spare mirror; light the
lamp in the Echo (it stays lit) and bolt the mirror facing the temple quarter; in the present, turn the four roof
mirrors to carry the beam round the new tower: east, north, north, west. Kept exactly; the staging:

1. **The lamp, Echo (anchor 1):** the harbor map's zone is the chain lamp's platform (three tiles); the Echo scene
   (beat 4) ends with Arjun handing Patricio the taper; the lamp is an Echo-era puzzle object whose `use` sets
   `anchor.chain_lamp` ("The taper catches. The lamp takes the flame as if it had been waiting."); the present lamp
   reads it (lit look; the scene glows it on the swap back).
2. **The mirror, Echo (anchor 2):** the plank bridge to the watchtower's platform is walkable in both eras; the
   bracket is an Echo-era puzzle object whose `use` with the spare mirror (an Echo-era object at the tower's foot:
   pick it up, a key item for the Echo only) sets `anchor.tower_mirror`; the present bracket reads it (a mirror in
   it, faced at the temple quarter; the first beam segment drawn from the lamp to the bracket and from the bracket
   towards the bazaar, ending on the Exchange's tower on the bazaar map: a beam object with `if: anchor.tower_mirror`).
   The order of the two anchors is free; the Journal records both.
3. **The roofs, present (the turns):** four mirror objects, each with an orientation flag `mirror.<n>` of 0 to 3 (the
   built flags-with-values; `use` steps it and the look follows), each unlocked by Aiyana's walk-up (a look change on
   `story.rooftops_entered`, so the player never waits on her). Beam segments are `above` objects with `if`
   conditions on the flags: segment 1 shows when `mirror.1 = east`; segment 2 when 1 is east and 2 is north; and so
   on; the wrong orientations draw a short stub into brick with a line ("The light lands on brick."). The temple's
   window trigger fires `story.beam_at_temple` when all four are right (1 east, 2 north, 3 north, 4 held by Anissa
   at the window: the fourth is her disc, so the player turns three and the fourth is a cue). **Pure data:** the
   built puzzle objects, flags with values, `if` conditions and anchors do all of it; nothing like Chapter 7's rotor
   group is needed (each mirror is independent). Honest difficulty 4: the tower is the only trick, and the Echo's
   watchtower line (the tower is not there fifty years ago) is the clue.
4. **Aiyana's part** (the settled "opens the way"): the chain tower's key (the way in: `story.tower_open`), the
   bracket locks (the way through: her walk-ups), the disc for Anissa (the last mirror); she never turns a mirror
   herself and never says which way.
5. **Anissa's hints** (3 minutes stuck; `PUZZLES.md`'s wording): "Light needs a road too, Gigi." / "The lamp was lit
   in Arjun's time. It can be again, and stay lit. And the old tower is missing its mirror." / "Light the chain lamp
   and bolt the tower mirror in the memory; then turn the roof mirrors: east, north, north, west."

Files: `puzzles/jwaladesh_chain/solution.json` (the Echo: the taper, the bracket, both orders) and
`puzzles/jwaladesh_mirrors/solution.json` and `cheats.json` (the four orientations; a route that turns the mirrors
before the anchors are set, which draws nothing: the mirrors turn but no beam arrives, so it is a cheat that fails
honestly; a route that leaves mirror 2 facing west, the old line into the tower). Both replayed by
`tests/puzzles.test.ts`.

**The minor (M-JWA-1, J-2):** the hearth zone, the runners' walk and line, the gust strips and the sheltered lanes.
Hints as `PUZZLES.md`. Difficulty 3. Files `puzzles/jwaladesh_relay/`.

**The secret (S-JWA, after the release):** the store's balance lock and the three jars are placed inert; the shrine
child says her line; the Unbroken Wick is Chapter 8's post-release item. Nothing here makes it harder: the store is
reachable after the boss, and the Echo zone at its back is drawn now and switched off.

---

## 9. Vikram and Aiyana: how the companion joins and plays, and the family beat

### 9.1 Vikram

- **Who he is on the map:** Meera's son, Arjun's grandson; "must win every argument by duel, always out of breath"
  (approved). Twelve duels this month, all over arguments, all won on one breath. He talks in short runs broken by
  breathing; the breathing is the joke and the character, never a weakness in the fight. His warmth is for the
  flame, not the Court. One line to Anissa, no joke: at the relit flame, he crouches to her height: "You held the
  last mirror. In this house, that makes you a Keeper of the Flame." (She says nothing; she looks at the flame.)
  `story.anissa_keeper` (a Journal line, no item).
- **When he joins:** at the flame (beat 6), as a fighter, before the boss (`party.vikram`); he leaves Agnipur with
  the party at the price (beat 8, `story.vikram_left_agnipur`). `STORY.md` says "Vikram defies the priests and joins"
  after Dhanraj falls; this outline splits it (Claude's call, section 12), as Chapters 6 and 7 did: the defiance is
  tearing the curtain, and the player plays the Fire duelist in the Fire duelist's chapter, against the one boss
  whose wall is made for fire.
- **His data entry** (`rpg.ts` `MEMBERS`, with the active-order flag so he fights here), sim-checked at 20 (hp 124,
  atk 82, def 28, mag 27, spd 55: the hardest hitter in the party after Azzy, the second fastest, the lowest DEF of
  any fighter: a glass cannon, as the guide says): `{ id: 'vikram', name: 'Vikram', role: 'Fire duelist', house:
  'Agnivansh', portrait: 'vikram', era: 'present', class: 'warrior', joins: { flag: 'party.vikram' }, base: { hp: 40,
  sp: 20, atk: 15, def: 5, mag: 8, spd: 15 }, growth: { hp: 4, sp: 3, atk: 3, def: 1, mag: 1, spd: 2 }, start: {
  weapon: 'talwar_of_agnipur', armor: 'saffron_coat' } }` (two new items at tier 20; his own, not shop stock: a
  curved sword with a brass hilt and a saffron duelling coat).
- **His skills** (COMBAT 9.7, in the engine's shapes): **Agni ki Shakti** (passive: his skills cost 1 SP less, minimum
  1: a `PassiveEffect` kind `spLess`, section 10; Gianna's discount is the precedent); **Ember Cut** (SP 4, power 130,
  fire, `burning` 30% with `bossChance 0.3`; fallback `weakened`); **Rakt Ki Pyaas** (passive: after he fells an
  enemy, a free Attack at once: `PassiveEffect` kind `attackOnFell`, section 10; fallback: text only); **Ananta
  Yuddha** (SP 15, `once`: for one round every party skill costs 0 SP: a `freeRound` skill kind, section 10;
  fallback: `inspired` on all allies, which is what a free round is for). Moves: **Quick Thrust** (100), **Flame
  Lunge** (160, fire, cooldown 2), **Twin Flame** (two hits of 80 at random foes, fire, cooldown 3). Battle look: a
  placeholder recolour of the walk sheet until art.
- **After this chapter:** if Agnivansh is the house the Crown buys, he stays and defies his house a second time
  (STORY 6.9, Chapter 11's build); Steward Prakash (COMBAT 13.3) would be the senior Keeper, who is alive and
  unconvinced at the price: the betrayer's seed, as Hrafn is Skarragol's and Mibu is Kuroshi's. His running joke
  gets one line per later chapter and none at the Hearing.

### 9.2 Aiyana (FAMILY.md, settled)

- **Who she is on the map:** Rahel's daughter by a man of the Asian continent; Kayla's full sister; Rael's
  half-sister; Azzy's Titi Aiyana. Bright, restless, hands-on: she talks fast, finishes other people's sentences
  with a number, and is never without a tool in her hand. She is the Court's engineer of the great flame: the wick,
  the reservoir, the mirrors, the chain lamp's oil (which she has filled every new moon for two years without being
  told to stop). She is the only person in Agnipur who has measured the flame, and she measures it every morning.
  She is not an NPC with a quest flag: her roof is where the chapter's trouble is seen, her key is the Echo's door,
  her brackets are the puzzle's present half, her disc is Anissa's.
- **The rule for her lines (the locked rule: Gianna cannot learn Rael is good until near the end):** Aiyana knows
  Gianna and Anissa are Rael's daughters (Kayla wrote: "three lines, which for Kayla is a scream"); she says so once,
  on the roof, without his name ("I am not going to talk about Cenizal on a roof"). She says nothing about the
  marriage, nothing about his work, nothing about the thumbprint on the jars (she is at the Court when the cart
  comes in, and does not see it). Her one clue-level line, the only time she speaks of him, at the altar at dawn,
  measuring: "He used to hold the rod for me when we were small. Never said a word. Just held it level." It reads
  either way, which is the design's rule for every Rael clue. A content test checks no Aiyana line contains "good",
  "innocent", "feeds", "the arrows" or "thumbprint".
- **Her touch for Anissa (no joke):** the disc on the roof ("You hold the last one. Don't look into it."), and, at
  the tower's foot, "If you see a lantern, say so. Don't shout. Just say it." After the chapter Anissa keeps the disc
  (`item.aiyana_disc`, a key item: *Titi Aiyana's mirror*, one line of text), as she keeps Kayla's crane.
- **The family beat with Azzy:** shorter than Kayla's, as the Chapter 7 outline asked (two Titis in two chapters,
  so his line comes first): "Titi Aiyana." / "Azriel. You've got your grandfather's hands. Don't waste them holding
  things." At the quay: "Azriel: don't hold things." (The same line twice is the whole relationship.) Azzy, after,
  to Gianna, the one time he says it: "Three of them. Three of his sisters, in three cities, and not one of them
  will say his name to you." Gianna: "Then they know what he is." Azzy: "Or what you are." (Reads either way; tested
  the same.)
- **Placeholder look:** a leather apron over saffron, a wrench, hair tied up with a strip of cloth; `aiyana`. Art
  through `ART-PROMPTS.md` when the outline is approved. **Later:** FAMILY.md places her here only; she does not come
  to the Muster (Rahel, Patricia and Jordyn do). Her line about Jordyn (beat 8) is the family's hand-off to Chapter 9.

### 9.3 Salkhi in the salt, and the others

- Salkhi: a flag-placed horse on the quay, the bazaar and the salt gate (not the roofs, not the Court): "Salt." /
  outside the library: "She reads. In every country. I have stopped expecting to be consulted." / at the salt gate:
  "I will not go onto the salt. The salt gets into my feet and my opinions." / on the quay at the end: "No grass. I
  have stopped asking." Never in a node with an Anissa line.
- Haru has the feud: he sets the crane on the step and says nothing; at the price he says one thing: "Grandmother's
  files say the paper was false. I will bring you the paper." (K-5 after the release; the line is a promise, not a
  quest.) Bayarmaa has Dhanraj's walk up the hill. Samira has the ledger and the strongbox. Yari has the quay and the
  duel ("He can't breathe." / "He still won.").

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **Vikram as data** | fighters as data | his `MemberDef`, skills, moves, looks, two start items, the join flag | none needed | 0.2 |
| **The active-order flag** (`party.active`: the four who fight, set by the story at a join and changeable by the player later; the Chapter 6 review 3.9) | the first-four rule | if Chapter 6 or 7 built it: data (Vikram replaces the fourth at the flame); if not: one list flag read by `battleParty` (about 30 lines) and a test | the first-four rule with Vikram's entry placed fourth (`MEMBERS` order: Gianna, Yari, Azzy, Vikram, Haru, Bayarmaa, Samira), which benches Haru from now on | 0.15 |
| **Burning** (`STATUS.burning`: `regen: -0.06`, `bad: true`, 3 turns; a fighter at 1 HP is not killed by it) | the status table with `regen`; the per-turn regen tick | one status row and a clamp where the tick applies (about 10 lines), a test | `weakened` | 0.1 |
| **The Oil Wall** (`STATUS.oiled`: `taken: 0.5`, `shatter: true`, `immune: ['fire']`: a new per-status field read where element multipliers are applied) | `gilded` (halves, shatters on a Surge); `ELEMENT_RESIST` | one status row, one field, one line in the damage formula (about 10 lines), a test | `gilded` | 0.1 |
| **Price Spike** (`itemDelay` on an `EnemyMove`: while set, the party's item actions carry `ACTION_WEIGHT.item + n`) | `ACTION_WEIGHT`; the turn-delay formula | a per-battle modifier set by the move and read where an item's weight is taken (about 15 lines), a test | a 150 area blow every 2 | 0.1 |
| **Lit oil** (`burnsOnFire: true` on a phase: the first fire hit on the boss after the wall is gone sets `burning` on him for the rest of the fight) | phases; statuses on enemies | one check in the hit path (about 10 lines) | `weak: ['fire']` on the phase's enemy (a phase cannot change weakness today: a second small piece, or the boss is simply weak to fire from the start, which the Oil Wall hides until it falls) | 0.05 |
| **The sparring fight** (`sparring: true` on `BattleDef`: no Game Over; a party loss ends the fight as a `lost` outcome that plays the same after-scene with `choice.duel_lost`; no XP, no gold, no Grudge) | `meantToLose` (ends on a scripted finale); `withdraws` | one branch where a loss would go to Game Over (about 20 lines), a test | `meantToLose` with a `finale` that fires on the party's first fighter down, plus the normal win: two exits, one scene | 0.1 |
| **The solo fighter** (`fighters: ['gianna']` on `BattleDef`: the active party for this fight only) | `battleParty` builds the active four | one filter in `battleParty` when the def names fighters (about 10 lines), a test | the four fight him ("All of you. I don't mind.") and his scaling drops to x1.2 / x1.0 | 0.1 |
| **Vikram's passives and Ananta Yuddha** (`spLess` on `PassiveEffect`; `attackOnFell`; a `freeRound` skill: for one round the party's skills cost 0) | `PassiveEffect` kinds `battleGold`, `atkPerFell`; Gianna's discount; `once` skills | three small pieces (about 50 lines together), each with a test | `spLess`: none (data, trivially); `attackOnFell`: text only; `freeRound`: `inspired` on all allies | 0.3 |
| **The flame-bead bracelet's special** (`elementBoost`) | `ItemSpecial` kinds (`spRegen`) | one kind read where element multipliers apply (about 10 lines) | `mag: 4, atk: 2` | 0.05 |
| **The mirrors, the beam, the lamp, the chain, the curtain, the altar** (objects with looks by flag values and `if` conditions; the gust strips) | puzzle objects with `use`, flags with values, `if`, anchors; door-like triggers | map data only | none | 0 |
| **Two-era Echo scenes with walkers** (the riders on the mole; the runners; the city coming in; the relay up the hill) | walkers, Echo-era NPCs and objects, `echo.*` flags; the cannon as an audio slot and a shake | data; the shake exists if Chapter 2's cannon built it, else a 0.05 piece | lines | 0.05 |
| **The sea voyages** (`kuroshi_jwaladesh` is Chapter 7's; `jwaladesh_aldermoor`) | `VoyageDef` | one `VoyageDef` | a card | 0.05 |
| **The ambush taper at 0.25 from level 15** (section 5; realm-wide; Chapters 6 and 7's call) | Chapter 6's or 7's `ENCOUNTER_XP_TAPER` if it landed | one number; `levelCurve.test.ts` re-asserted for Chapters 1 to 7 | flats' weights and grace, Dhanraj at 50 | 0.05 |
| **One glossary** (Hindi) | `lang.ts`, `audit:lang` | one JSON file, every entry `verified: false` | none | 0.05 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 8), `MARKS` | `ACT8` in `quests.ts`; `'9'` in `MARKS` (Chapter 9's landing); the route to `@chapter8-end`; `?chapter=8` | none | 0.25 |

About **one and a half builder-days** of engine and wiring; the statuses, the sparring rule and Vikram's three
pieces are the only parts that are not data, and every one has a fallback that keeps the scene. Nothing here needs
a stealth system, an Echo battle, a Yield step, a timer, a step counter or region levels. The signature puzzle is
data, which is the first time since Chapter 2 and is why this chapter fits two and a half days with two engine
statuses in it.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **Vikram** | the companion (section 9.1) | a new member look: saffron coat, a curved sword, bent double between lines (an idle frame); a battle recolour | the betrayer-defies-his-house scene if Agnivansh is bought; one breathless line per chapter |
| **Aiyana** | the flame's engineer; Azzy's Titi; the key, the brackets, the disc (section 9.2) | leather apron over saffron, a wrench, hair tied up; `aiyana` | FAMILY.md: here only |
| **Meera** | the Court's ruler, Vikram's mother; the ruler he defies; the one word; the price | saffron and white, a measuring rod's twin (the ruler's rod), seated; `meera` | the Muster (an envoy or her son); the Dec 1 list's Gen III ruler for this chapter |
| **The senior Keeper** ("Steward Prakash", COMBAT's name) | the order's voice; the betrayer's seed | saffron, a veil of office | Steward Prakash, the Agnivansh betrayer variant (Ch. 10 to 11) if Jwaladesh's price is least paid |
| **The junior priest** | J-3's giver; the broom; reads the ledger at dawn | saffron, a broom | |
| **The chamberlain**, the **treasurer** (an empty book) | the seat's staff | | |
| **The Crown's oil-factor** ("Mr. Pelham", proposal) | the customer; the offer; gone by the boss | Aldermoor violet, the Chapter 5 clerk's shape, a ledger | a line in Chapter 9's keep (the purchasing office) |
| **Seth Dhanraj** ("the Seth" until approved; *Seth* is a merchant's honorific, for the fluent check) | the boss | white with a ledger under one arm, a gold chain; `seth_dhanraj` | kneeling at the colonnade's foot if spared |
| **Arjun** (Echo) | Gen II; the charge; the taper | a saffron coat, a lance, the Echo palette; his seven riders (one look, two with a fallen frame) | S-JWA's oil store after the release |
| **Arjun's runners** (Echo) | M-JWA-1 | three in saffron with lamps, the Echo palette | |
| **The chief runner**, three **runners** | J-2 | a lamp on a pole; lamps | the relay up the hill (beat 7) |
| **The salt-road carter** | J-3 | plain, a cart, no name | |
| **The shrine child** | J-4's seed, placed, one line | small, a dark lamp | J-4 after the release |
| **The Flame Keeper**, the **Gaze pilgrim** | the debate | saffron with a flame sigil; the Chapter 1 pilgrim look in a sun shawl | the post-Harbor corner |
| **The librarian**, three **vendors**, the **harbour-master**, the **dyer** (the quay's loser), a **lamp-seller** (the cart) | | | |
| **Oil Enforcers**, **Ember Jackals**, **Road Bandits**, **Zealots** | the flats, the salt road, the quay, the store | enforcer: a cudgel and a flask, white and grey; jackal: a 1 x 1 sprite with sparking fur; the built bandit and zealot recoloured | the Harbor's enforcer frame if Agnivansh is bought |
| **Young Patricio** (the player in the Echo; Caona and Benny as data, not drawn) | beat 4, J-2 | the Echo palette | |

Voices: Vikram in short runs with the breath between; Aiyana fast and exact, with numbers; Meera dry, final, warm
once; the senior Keeper repeating the one word; the junior priest quiet and counting; the factor in the Regent's
courteous register ("The Throne would of course keep the lamp lit"); Dhanraj courteous and lawful ("I do not hoard. I
hold."); Arjun plain and sure; the carter Kreyol-accented and unnamed. No one in Agnipur sounds like Kirinoura:
people here say the thing, and the Court is the only one that will not.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**None required.** I looked for one and found a near-miss, below first. If the second review disagrees with any of
these, it becomes a pop-up with the recommendation first and the build goes ahead on it.

- **Near-miss: Patricio lights Arjun's lamp.** The design says "a lamp lit in the Echo stays lit", and anchors are
  things Patricio does, so the hand on the taper is Zetwal's. That makes Agnipur's sacred flame, renewed in front of
  the city in this chapter, a fire lit fifty years ago by Zetwal's Marshal at Arjun's asking ("the signal is for
  Zetwal's ships, and a Zetwal hand should light it"). It is the alliance's point made in one object, and it reads
  as Arjun's choice, not Zetwal's claim. If the owner would rather the hand be Agnivansh's, Arjun lights the lamp
  and Patricio's anchor is the mirror alone: the puzzle loses one of its two anchors and nothing else moves.
  Recommendation: keep it; it is not a change to the story's flow, so it is a Claude's call here and not a pop-up.

The Claude's calls, each with its reason:

- **The sacred thing the envoy went to sell is the keeping of the Harbor Chain**, and the Crown's offer is oil for the
  chain. *Reason:* Chapter 5's line needs an object; the chain is Arjun's and the Echo's; the three roads' pattern
  (a thief so a council can sell, files so neutrality is a fiction, a hoarder so a temple must sell) needs the thing
  the temple would sell to be the thing the Crown wants, and the Crown wants harbors (Chapter 11).
- **Vikram duels Gianna alone, as a sparring fight with no Game Over, and the scene after is the same either way**
  (section 5, section 10). *Reason:* the design's beat as written ("a sparring battle, he is out of breath at the end
  either way"); a fight the player can lose without punishment is new to the game and small to build; four against
  one would not be a duel.
- **Vikram joins at the flame, before the boss, and leaves at the price** (section 9.1), splitting `STORY.md`'s
  "defies the priests and joins". *Reason:* Chapters 6 and 7's precedent; the player plays the Fire duelist against
  the oil boss; the chapter's end is the same.
- **The active-order flag is required**, not optional (section 4). *Reason:* seven fighters and the first-four rule
  bench the new companion in his own chapter.
- **J-3 walks the Salt Flats** (the carter at the salt-road shrine, then the back gate) rather than watching the gate
  (section 7.2). *Reason:* the wild section needs a reason on the route; the design's enforcer seizure is kept as the
  fight; the thumbprint and the delivery are unchanged.
- **J-2 and J-3 are the required two; J-1 is the first post-release quest; J-5 after; J-4's shrine and lock are
  placed inert** (section 7).
- **The relay is gust lanes, not a timer** (section 7.1). *Reason:* the engine has no timer or step counter; the fog
  maze's return trigger is the same idea in the engine's words; a countdown is a system for one quest.
- **The signature puzzle is data: independent mirrors with flag values, beam segments on `if` conditions, two
  anchors** (section 8). *Reason:* the built puzzle objects do it; the rotor group was Kuroshi's trick, not this
  city's.
- **Anissa holds the fourth mirror** (beat 5). *Reason:* `SECRET-ITEMS.md` 4 says the chapter is about the light she
  carries; it gives her a part in the present with no danger and no joke; the fourth bracket is seized so the puzzle
  needs her and the player turns three.
- **Dhanraj at hp x6, atk x1.5 on the brute line, with the Oil Wall as a shatterable status and Price Spike as an
  item delay** (section 5, section 10). *Reason:* the sim; COMBAT's phases in the engine's words, with the Surge as
  the thing that breaks oil, as it broke gold and the standard.
- **The Crown's factor is gone by the boss, not unmasked; Dhanraj's ledger is the proof, read aloud.** *Reason:*
  Chapters 5, 6 and 7's pattern; the Regent stays three moves ahead; the ledger names Kingsmere's purchasing office,
  which is Chapter 9's door and nothing more.
- **The price scene reads Jwaladesh's Wealth and pays the store, the strongbox (if given), the two tokens and the
  petition**; `ally.jwaladesh` is set regardless, with the Journal's count (beat 8). *Reason:* the Chapter 3, 6 and 7
  pattern; the guide's "gold gifted counts" used for the first time, where it means something (Throne money to a
  temple); the betrayal's rule stated the same way a third time.
- **The crane is refused at the step and accepted at the altar** (beats 2 and 8). *Reason:* the feud is shown, not
  told, and takes one step without K-5; Kaede's "take the crane anyway" pays.
- **Aiyana knows the girls are Rael's daughters, says so once without his name, and her one line about him is the
  rod** (section 9.2). *Reason:* Kayla's precedent (Chapter 7, section 9.2); the content test guards it.
- **Aiyana names Jordyn in the Regent's guard** (beat 8). *Reason:* FAMILY.md places Jordyn there; the family that
  has one sister in every city is how Chapter 9 gets a door; it is a seed, not a plan.
- **No Echo battle; the charge is staged** (section 4).
- **Side-quest and fight XP at the built curve's scale (100 / 100 / 100 for Dhanraj) and the taper at 0.25 from 15
  assumed** (section 5), realm-wide. *Reason:* the numbers; the simulator decides on day 1.
- **Six maps: the rooftops split out, the runners' hall folded into the temple steps, the store built as the arena
  with S-JWA inert** (section 3).
- **The Court of the Flame is 36 x 28** (the seat paragraph's size), as Chapters 5 to 7 chose.
- **Meera is clean; the senior Keeper (Prakash) is the betrayer's seed.** *Reason:* "defies the priests" is the
  guide's; a corrupt mother would be the same family tragedy twice; COMBAT already names Steward Prakash.
- **Names are proposals** (Meera, Vikram, Arjun, Tejaswini, Seth Dhanraj from the design; Pelham and Prakash's
  placement new), people named by role in the build until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapters 6 and 7's estimates (760 and
830 steps, about 30 minutes):

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the quay, the cart turned back, the duel on the stair, up into the bazaar | ~80 | 2 | ~20 | |
| The bazaar: the lanes, the Exchange, the shrine child, the roof and Aiyana | ~80 | 2 | ~25 | |
| The Court: the crane, the one word, the offer, Vikram, the duel yard | ~70 | 2 | ~45 | the duel |
| J-2: the runners, the Echo, the relay through the lanes | ~120 | 2 | ~20 | |
| The debate on the spice row, the books | ~50 | 2 | ~30 | |
| J-3: the salt gate, the flats, the carter, the enforcers, the back gate | ~140 | 3 | ~25 | the enforcers, 0 to 1 ambush |
| The harbor at night: the sea-wall, the tower, Arjun's charge (both eras) | ~90 | 2 | ~35 | 0 to 1 (the watch) |
| The roofs: four mirrors, the disc, the beam | ~60 | 2 | ~15 | |
| The flame, the store, Dhanraj, the Yield, the relay up the hill | ~80 | 3 | ~35 | the boss |
| The price, the token, Jordyn's name, the quay, the card | ~70 | 3 | ~40 | |
| **Chapter 8** | **~840** | **23** | **~290** | 3 to 5 |

About **30 to 33 minutes**, the plan's number, with the library's nine books and the swordsmith on top. The main
line alone (the gate holds, so a player cannot) is about 18 minutes.

---

## 14. Continuity into Chapter 9 (Aldermoor, The Regent's Keep; 21 to 24)

- **The lead:** Dhanraj's ledger (`item.dhanraj_ledger`, `clue.crown_holds_oil`): every advance drawn on "the
  Throne's purchasing office, Kingsmere" and countersigned by the factor, with *Hold until the Court signs for the
  chain*: the Crown's purse is in the Regent's keep, with "everything else the Throne has bought this year" (Meera).
  The voyage `jwaladesh_aldermoor` north along the west coast from (37, 91) to Kingsmere at (22, 62). `?chapter=9`
  starts where Chapter 9's outline puts the landing (Kingsmere's moor-side quay or the heath road; the Crown's
  capital will not let an envoy's ship in by the front, which is Chapter 9's first beat to decide).
- **Jordyn and Sebastian:** Aiyana's "Jordyn's in Kingsmere. In the Regent's guard" (beat 8) is the family's
  hand-off: Chapter 9 bumps into Jordyn (disciplined, blunt, fair; she opens the keep's postern when she decides) and
  into **Sebastian**, Elodie's brother, whose organ recital in Kingsmere's cathedral covers the archive break-in
  (FAMILY.md, settled). Nothing in this chapter mentions Sebastian: the Zetwal side of the family is Coralie's and
  Elodie's to name, and Chapter 5 left Coralie at the Seat with "bring me every colour you find". Chapter 9's
  outline should give Sebastian his bump-in cold (a poster for the recital on Kingsmere's quay is enough).
- **The party leaves with:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, **Vikram**, Anissa (eight, seven fighters,
  four active by `party.active`); Salkhi; **level 20** by the tool (5,835 to 5,955), **about 23 as played** if the
  party arrived at 21 as the Chapter 7 outline predicts, 21 if the upstream fix lands (section 5: Chapter 9's
  outline must plan from the measured start, not the table's 21; its band of 21 to 24 absorbs a 22 and not a 23);
  the Echo party unchanged; gold about 2,000 to 3,000 less the swordsmith and the strongbox if given;
  key items plus the Ironvow, Suzumori and **Agnivansh** tokens (three of Se-5's; Aldermoor's dissidents give no
  token: they are not a house at the chair, which Chapter 9 should say), the Fog Files, the receipts, **the ledger
  of advances**, Titi Kayla's crane, **Titi Aiyana's mirror**; flags `story.jwaladesh_arrived`, `party.vikram`,
  `party.active`, `story.vikram_left_agnipur`, `ally.jwaladesh` with Jwaladesh's Wealth 4 to 11,
  `clue.relay_route`, `clue.arjun_charge`, **`clue.crown_holds_oil`**, `anchor.chain_lamp`, `anchor.tower_mirror`,
  `story.crane_accepted`, `choice.duel_won|duel_lost`, `choice.patricio_arjun`, `choice.dhanraj_spared|broken`,
  `choice.advances_given`, `side.lamp_relay.done`, `side.anonymous_oil.done` (the thumbprint count: **seven**),
  `story.anissa_keeper`, the debate's outcome, `act8.complete`.
- **What Gianna believes:** unchanged. No Rael clue moved here; the "nobody dies" pattern grew by one (Dhanraj and
  his enforcers withdrew); the anonymous oil is the seventh thumbprint and the carter's "he isn't doing it for a
  goddess" is the thread's one line in a mouth. Azzy's "three of his sisters, in three cities, and not one of them
  will say his name to you" is the family's pattern named once; Chapter 9's Jordyn is the fourth, and the one who
  acts.
- **What the realm knows:** the Crown pays a thief so a council can sell (6), buys a city's files so its neutrality
  is a fiction (7), and funds a hoarder so a temple must sell its chain (8): the same hand three ways, and all three
  purses are drawn on Kingsmere. Three of four houses have been spoken for; one of the four has a closed hand beside
  its name; Hrafn, Mibu and Prakash are alive and unconvinced. The Muster's betrayal rule has been stated three times
  in the same words.
- **The feuds for the Muster:** Suzumori and Agnivansh have taken one step (the crane on the altar; Haru's promise
  of the paper); Dorini and Ironvow have not (Chapter 6's fair had Samira); Stillwater's dissidents are Chapter 9's.
- **Nothing built in Chapters 3 to 7 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`salt_flats`), `MEMBERS` (Vikram's entry) and `party.active` (if new), the voyages, the taper's number, and the
  statuses (`burning`, `oiled`) and the two battle fields (`sparring`, `fighters`), each behind a test that Chapters
  2 to 7's fights replay unchanged.

---

## 15. Risks

- **The level curve does not close in this chapter, and cannot.** This is the third road and the one that must leave
  the party at 21 for Chapter 9. The tool lands at 20; a real player who arrives at 21 (the Chapter 7 outline's
  prediction with the taper) leaves at **23** whatever this chapter pays, because the surplus is Chapters 5 to 7's
  (section 5). This chapter's dials (Dhanraj 100, the quests 100, grace 24 on the flats, the salt road safe) are
  set so it adds one level to what it inherits. The fix is the central session's on day 1: measure Chapter 7's
  played end, then either tighten the ambush rule and Chapters 6 and 7's weights until the arrival is 20, or plan
  Chapter 9 from the measured start and say so in the milestone note. If the owner would rather keep ambushes rich,
  the alternative is Chapters 8 to 12 re-based a level or two higher, which is a plan change, not a chapter one.
- **Seven fighters and the first-four rule.** If the active-order flag is not built, Vikram never fights in his
  chapter (or Haru never fights again). It is the first thing on day 1, and the sim shows the boss does not depend on
  it, so the fallback (Vikram fourth in `MEMBERS`, Haru benched) is playable and wrong.
- **Two new statuses in the damage path.** `burning` (a negative regen) and `oiled` (an immunity field) touch the
  one formula every fight uses. Each is ten lines behind a test, and `battle.test.ts` must replay Chapters 2 to 7's
  fights unchanged before either lands. The fallbacks (`weakened`, `gilded`) are the sim's and are known to play.
- **The sparring rule is new.** A fight with no Game Over has never been built; the `meantToLose` + `finale` fallback
  exists and plays the same scene with two exits. Build the rule, and if it costs more than an hour, take the
  fallback: the duel is a minute of the chapter, and the scene after it is what matters.
- **Arjun's charge is the chapter's heart and is easy to make a cutscene.** The riders are walkers on the mole; the
  cannon is a sound and a shake; the chain is an object that changes look; the taper and the mirror are things
  Patricio does. If the build runs short, the riders keep their walk and the two fallen are a line.
- **Aiyana's lines are the chapter's tightrope, as Kayla's were.** The content test (section 9.2) is the guard; the
  reviewer should read every Aiyana line, and Azzy's "or what you are", against the locked rule.
- **Anissa on the roof.** She holds the disc; she is never the beam's source or anything's target; the enforcer's
  "Who lit that?" is a voice from the store, not a man at the tower; the Zealots' line is on the flats; nothing in
  the Court looks at her. Her two touches are the disc and Vikram's "Keeper", neither a joke, and Vikram's breathing
  is never in a node with her lines.
- **Tone.** Vikram is out of breath in six places (the stair, the Court, the duel, the roof, the store, the quay)
  and the line is different each time; "argument settled" is said twice. Salkhi stays outdoors; Samira's pricing
  stops at the altar, where it becomes the strongbox's line. No jokes in Arjun's Echo, at the flame, at the ledger
  or at "the word was wrong".
- **The Crown's hand stays the Regent's, not the Hushed's.** The ledger is countersigned by the factor and drawn on
  Kingsmere's purchasing office; the buyer's mark is Chapter 7's; nobody joins them. That join is Chapter 9's.
- **Faith on the map.** The Four Hands' Flame Keepers are a fictional sect and the Court is a court, not a temple of
  any real faith; the duel-over-breakfast comedy is Vikram's, never the Keepers'; *Seth* as an honorific and the
  greetings go to the fluent reader. No real faith is shown as a cult (guide 7.3).
- **Languages.** Three vendor greetings and a few words (*Agnipur*, *Agni ki Shakti*, *Rakt Ki Pyaas*, *Ananta
  Yuddha*, *Seth*, *talwar*, the board game's own) in Hindi, every one `verified: false` for the Nov 18 check, and
  the Opus review's ask for a fluent reader as this outline is approved.
- **Names.** Every new name is a proposal; the build names people by role; the owner's yes on Meera, Vikram, Arjun
  and Dhanraj (all from the design) is the only one that matters for the dialogue's shape. Meera as the Gen III
  ruler Vikram defies is on the Dec 1 list (STORY 6.10), now needed by early November.
- **Chapter 7 may land late, and its review may change its end.** Everything here except the voyage's start and the
  crane can be built from the Chapter 7 outline's section 14 state before Chapter 7 is done; `?chapter=8` needs
  Chapter 7's route; until then the chapter is tested from a hand-written start save with section 1's state. If the
  Chapter 7 review moves Haru's join, the active order or the taper, sections 1, 4 and 5 move with it and nothing
  else.

---

## 16. Build plan (small steps, each checked before the next; sized to two and a half builder-days, about Nov 2 to 5)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 8 rewritten to this outline
   (the chain as the sacred thing, Vikram's split join, Aiyana, the duel as a solo sparring fight, J-3 on the flats),
   `CAPITALS.md` 8 re-sized (six maps, the rooftops, the Court at 36 x 28, the runners' hall on the steps),
   `SIDE-QUESTS.md` J-2 and J-3 marked for the release with the new numbers and J-1, J-4, J-5 after, `PUZZLES.md`
   SIG-JWA's staging (data only, Anissa's disc) and M-JWA-1's gust lanes, `COMBAT.md` 9.7 with Vikram's stat line and
   13.3 with Dhanraj's scaling and the wall, `FAMILY.md` Aiyana's row marked built, Vikram's, Aiyana's, Meera's,
   Arjun's and Dhanraj's prompts into `ART-PROMPTS.md`. **The taper's number confirmed** on Chapters 1 to 7's routes;
   **the active-order flag's state checked** (built in 6 or 7, or built now).
2. **Engine and data (Opus, half a day):** Vikram as data (entry, skills, moves, looks, two items), `party.active`
   if needed, `burning`, `oiled`, `itemDelay`, `burnsOnFire`, `sparring`, `fighters`, `spLess`, `attackOnFell`,
   `freeRound`, `elementBoost` (each a few lines, each with a unit test; `fighters.test.ts` grows by one;
   `battle.test.ts` re-asserts Chapters 2 to 7's fights), the glossary, the voyage.
3. **Maps (Sonnet, the rest of the day), the harbor and the roofs first:** `tools/maps/jwaladesh.ts` with the six
   maps of section 3; the harbor's zone, the two anchors and the lamp replayed headless by a draft
   `puzzles/jwaladesh_chain/solution.json`, then the rooftops' four mirrors and beam segments by
   `puzzles/jwaladesh_mirrors/`, before the bazaar is drawn; then the bazaar with its gust strips and sheltered lanes
   and `puzzles/jwaladesh_relay/`; the Court with the three altar looks and the duel yard; the library; the flats
   with the salt road, the shrine and the ambush layer; the night and dawn variants; validated; the city entry in
   `CITIES`.
4. **Content (Haiku and Sonnet, in parallel):** twelve books (*The Harbor Chain* written against the Echo's roll call
   and *The Burned Temple, Our Account* against Kirinoura's), the `salt_flats` table and `jwaladesh_story` groups, the
   four enemies, the sparring Vikram and Dhanraj with his phases, the vendors and the five items, the looks (section
   11), the speakers, the audio slots (a lamp lit, oil poured, cannon, a curtain torn, blades on sand; the bazaar
   plays the farewell track until Agnipur has its own).

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/jwaladesh.ts` staged from the beats, in this order
   so an interruption leaves a playable chapter: the quay, the cart, the stair; the bazaar and Aiyana's roof; the
   Court, the crane, the one word, the offer, Vikram, the duel; the tower, Arjun's charge, the anchors; the roofs
   and the disc; the flame, the curtain, Vikram joins; Dhanraj and the Yield, the relay up the hill; the price, the
   token, Jordyn's name; the quay and the card. `ACT8` in `quests.ts` with hints and goals; the Journal notes (*The
   relay*, *The salt-road carter*, *Arjun's charge*, *The Flame Keepers*, *Aiyana*).
6. **The quests (early afternoon):** J-2 (the runners, the Echo, the gust lanes, the bracelet), J-3 (the priest, the
   flats, the carter, the enforcers, the back gate), the debate *Is hesitation a sin, or is remembering mercy?* (two
   speakers, three rounds, the Reason books), the mirror job on the board.
7. **The puzzle files and tests (late afternoon):** `puzzles/jwaladesh_chain/`, `puzzles/jwaladesh_mirrors/`,
   `puzzles/jwaladesh_relay/`; an `oil_store_dhanraj` bot test on seeds at 19, 20 and 21 with the real statuses (the
   scratch sim's bot moved into `tests/`), and a `duel_yard_vikram` test that both outcomes end the fight and play the
   scene; quests, guide, debate, side-quest, maps, stage and content tests green; the content tests: no Salkhi line
   in a node with an Anissa line; no Aiyana line with "good", "innocent", "feeds", "the arrows" or "thumbprint"; no
   Vikram breathing line in a node with an Anissa line; no line joining "Crown" or "Regent" to "glows" or "little
   one".
8. **The route (evening):** Chapter 8's route from its chapter start to `@chapter8-end`; `chapter-starts.ts` with
   chapter 9; `act.test.ts`; `tools/level-curve.ts` run and the XP dials set (section 5); the smoke test's Chapter 8
   section with screenshots of the dead lamp over the chain, the cart turned back, Vikram bent double on the stair,
   Azzy on the roof with the wrench, the curtained altar, the duel yard, the runners' Echo, the carter's jars with the
   thumbprint, the charge on the mole in the Echo, the lit lamp in the present, the four mirrors and the beam, Anissa
   with the disc, the curtain torn and the wick in the beam, Dhanraj in his ring of oil, the relay up the hill, the
   crane on the altar, at 844 x 390 and 390 x 844.

**Day 3 (morning):**
9. **Full browser test:** the chapter end to end on a phone; the duel lost and won; Game Over on a flats ambush (back
   to the salt-road shrine) and on Dhanraj (back to the store's doors); a save in the tower and on the roofs; `npm
   test`, typecheck, lint, build; the reviewer prompt in `reviews/reviewer-prompts/` (the Chapters 6 to 9 batch, about
   Nov 9); then Chapter 9's outline, which overlaps with this build from day 2.

**If day 2 runs over, cut in this order:** the night and dawn variants (lines), the library's books from nine to five
(*Rani Tejaswini's Flame*, *The Harbor Chain*, *The Law of the Flame*, *Oil, Ghee and Grain*, *The Relay*), the
night watch's fight (the sea-wall open to everyone), Price Spike's item delay (the area blow), Ananta Yuddha's free
round and Rakt Ki Pyaas (their fallbacks), the strongbox as a gift (a line), the mirror job on the board. Never cut:
Vikram active in battle, the duel as a fight that ends either way, Arjun's charge staged with the two anchors, the
four mirrors turned by the player with Anissa's disc, the curtain torn and the wick caught in the beam, Dhanraj's
wall broken by a Surge, the ledger read with the crane on the altar, the price with the token, the two required
quests and the debate.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Dec 1 story questions, now needed by early November (the Gen III rulers each companion defies:
Meera is this chapter's); the fluent-speaker check (Wed Nov 18: this chapter adds Hindi, a few words).
