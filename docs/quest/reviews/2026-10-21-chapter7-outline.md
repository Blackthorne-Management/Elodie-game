# Chapter 7, The Fog Files (Kirinoura, Kuroshi; the second road): build outline (Oct 21)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: none found); everything
else is Claude's call with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (the three roads Oct 27 to Nov 6, 30 minutes
each; the owner's fixed order Skarragol 15 to 17, **Kuroshi 17 to 19**, Jwaladesh 19 to 21), the Opus plan review
section 6 (the minimum for Chapters 6 to 8: the city's trouble, its signature puzzle, its Echo, its boss, the
companion joins, the ally's price, **the Kuroshi files needed in Chapter 10**, the debate as a required quest, two
required side quests; the other quests and the secret item after the release; placeholders where art has not
come), `design/STORY.md` Chapter 7, 4 (the threads: Rael clue 3, the Ash Wars account 2 of 4, the safehouses), 5
(tone: Haru's "definitely not a spy"; no jokes near Anissa) and 6.6 and 6.9 (the Aldermoor ledger's code is read
by Haru only after the Harbor Turn; the betrayer's companion), `design/CAPITALS.md` 7 (Kirinoura), `design/SIDE-QUESTS.md`
K-1 to K-5, `design/PUZZLES.md` SIG-KUR, M-KUR-1, M-KUR-2 and S-KUR, `design/COMBAT.md` 9.5 (Haru), 13.2 (Fog
Cutpurse, Husher, Lantern Moth, Zealot) and 13.3 (the Paper Fox; Councillor Mibu as Suzumori's betrayer variant),
`design/SECRET-ITEMS.md` 8 (the Nightingale Key), `design/FAMILY.md` (**Kayla**, settled: a cipher clerk in
Kirinoura's archive who helps decode the screens and the spy map; bumped into, helps, acted out), `QUEST-BUILD-GUIDE.md`
5.4 (Kuroshi's row), 5.6 (the betrayal and its foreshadowing: the buyer's mark, gold out of Ardencia; the exposed
route needs "the Kuroshi evidence"), 6.3 (the price: Influence 10), 7.2 (the debate: Witness (balance) vs Quiet
Crown whisperer, *Is silence virtue or concealment?*), 8 (Japanese greetings), 13.9; the Chapter 5 outline and its
review (the Suzumori envoy's line "Kirinoura is neutral. It is written down. Everything about us is written down";
the Husher is Kuroshi's enemy first; the Seventh Clause was read before every envoy; tokens in the price scene);
the **Chapter 6 outline** (`2026-10-21-chapter6-outline.md`, section 14: continuity into this chapter, and section
5: the ambush-XP over-levelling risk and its taper; its review is still in progress, so its fixes are not yet
known); and the built game on branch `chapter3` (worktree `wt-ch3/quest` at commit 889ed60: `data/quests.ts`,
`data/battles.ts` (phases, `enter`, `hire`, `protects`, `withdraws`, `seize`, `onSurge`, `endsWithBoss`),
`data/encounters.ts`, `data/rpg.ts` (fighters as data; the active four are the first four joined in `MEMBERS`
order), `data/sideQuests.ts`, `data/debates.ts`, `data/puzzles.ts`, `engine/stage.ts`, `engine/tiledMap.ts`
(per-era collision), `engine/mapValidation.ts`, `engine/guide.ts` (`followSide`), `tools/level-curve.ts`,
`tools/chapter-starts.ts`). Levels use the game's curve (`xpBase 50, exponent 1.6`): 17 at 4,222, 18 at 4,653,
**19 at 5,098**, 20 at 5,559, 21 at 6,034.*

**Sim-check.** The fights below were simulated with a scratch script outside the repo against the Chapter 6
outline's snapshot of commit 889ed60:
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch7sim/paperfox-sim.ts` (Bayarmaa
as the Chapter 6 outline's entry, Haru and the Kuroshi enemies as data in memory, each fight 30 seeds with the
Chapter 6 bot, on the built Story difficulty). Numbers in section 5.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit, never a target and never jokes; the comedy (Haru's "definitely not a spy", Salkhi in the fog, Samira pricing
secrets) stays away from her; recommendations only where they genuinely help; placeholders wherever art has not
arrived; this chapter gets the main story, the Echo puzzle, the boss, the companion, the ally's price, the Fog
Files that Chapter 10 reads, the debate as a required quest, **two** required side quests, mystery quests and
arrows, Game Over, and nothing else until after the release.

---

## 1. Where the chapter starts (measured against the Chapter 6 outline, section 14)

- **Chapter 6 ends** on Ordvik's longship quay: the sea voyage `skarragol_kuroshi` from (91, 91) south-west along
  the coast to Kirinoura at **(66, 106)**, captions "South along the fjord coast..." / "...into the mist, where the
  lanterns are"; Salkhi loaded last. The card *Chapter 6 complete, The Stolen Standard. Next: Chapter 7, The Fog
  Files* (`act6.complete`). `?chapter=7` starts on **Kirinoura's pier** (section 3, `kuroshi-pier`, spawn `pier`),
  as the Chapter 6 outline expected.
- **The party on the route:** Gianna, Yari, Azzy, Samira, **Bayarmaa**, Anissa (six, five fighters, four active:
  whatever the player set; by the built rule the first four joined in `MEMBERS` order); Salkhi as a flag-placed
  horse on outdoor maps; **level 17** by the tool (about 4,300 to 4,460 after Chapter 6's dials) and **about 18
  (5,200) as played**, Chapter 6's ambush over-levelling included (section 5). Echo party: Patricio, Caona, Benny.
  Gold about 1,200 to 1,800 less the furrier.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's note, the Dorini pass, the Brasador coin,
  the Ironvow token (`item.token_ironvow`), **Torvald's sealed letter to Kaede (`item.torvald_letter`)**, the Crown's
  purse if kept. **Flags that matter here:** `clue.seventh_clause_read` (Kaede heard the page: "Kirinoura is written
  down as *the fog*"), `belief.rael_traitor` (unchanged), `party.azzy` (Kayla is his aunt), `party.samira`,
  `party.bayarmaa`, `ally.skarragol` with Skarragol's Wealth 2 to 8 (Torvald spoke for the party), `ally.free_brasador`
  (the price pattern), `clue.crown_pays_raiders` (the receipt: the Crown pays a thief so a council can sell lawfully),
  `side.winter_stores.done` (the thumbprint count), `choice.grimvald_spared|broken`, `side.seats.stage1` (the
  chamberlain waits for the houses' tokens: Suzumori's is given in the price scene).
- **What the realm said about Kuroshi before now:** the Suzumori envoy in the Hall (Chapter 5): "Kirinoura is
  neutral. It is written down. Everything about us is written down." Elodie: "Kuroshi will not speak to anyone until
  Skarragol has." Torvald (Chapter 6): "Kaede Suzumori's people will not speak to an envoy who has not been spoken
  for. Take this." Bayarmaa on the longship: "Fog people. They know what you said before you say it. Say less."
- **What Gianna believes:** her father sold Xaraguá and them. The player holds Rael clues 1 (the signet), 2 (Elodie's
  two lines), 4 (the coin), the "arrows missed" whisper (Chapter 3) and the "nobody dies" pattern (Grimvald withdrew).
  **This chapter gives clue 3** (the ledger of gold flowing out of Ardencia, in a cipher nobody here holds) and
  **the betrayal's foreshadow** (the buyer's mark, not the buyer). It must not give more: Kayla, Rael's half-sister,
  is a listener and says only what the files say (section 9).
- **Chapter 7's target is 17 to 19** (`chapterLevels.ts`, already there). The boss is at the tier's top, 19; the
  armourer stocks tier-16 and tier-20 gear (the tier-20 pieces shown honestly at half bonus).
- **Stale lines in the design, fixed here:** `STORY.md`'s table still says "any order, 15 to 21"; `CAPITALS.md` 7
  gives the Hall of Screens two sizes (24 x 18 in the table, 36 x 26 in the seat paragraph): the larger is used, as
  Chapters 5 and 6 did; `CAPITALS.md` puts the sealed stacks and the Suzumori spy ledger in the Hall of Screens, and
  `FAMILY.md` puts Kayla in "the archive": this outline puts **the sealed stacks and K-2 in the Lantern Library's back
  room, where Kayla works** (section 12: the file house is sealed by the neutrality order until the maze, so a quest
  inside it cannot be a day quest, and the archive is Kayla's); `SIDE-QUESTS.md`'s road-tier rewards (200 to 320 XP)
  are scaled to the built curve, as Chapter 6 did; `COMBAT.md` 13.3 gives the Paper Fox 7 / 1.0 on the standard line,
  which the sim shows is a pushover for a skirmisher boss against four fighters at 18 (section 5); the Husher's
  *Hush* (Hushed: no skills) has no built status (section 10).

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 6 outlines. Flags are proposals in the built naming style. "Shown"
means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`).

### Beat 0: Into the mist (the voyage, then kuroshi-pier)

- The voyage `skarragol_kuroshi` (the built sea shape; `night: false`, the mist drawn as the voyage's fog if the scene
  has one, else a caption). On the deck, one line each as the coast goes grey: Bayarmaa's "Say less." Samira: "I
  intend to price everything they don't say." Anissa: "Gigi, I can't see the water." Gianna: "Hold my sleeve."
  (Earnest; she does.)
- Lands at `kuroshi-pier`, spawn `pier`. **`story.kuroshi_arrived`** is set on landing: the marsh's ambush layer
  switches on (`fog_marsh`, section 5). The pier: lacquer piles, paper lanterns lit at noon because of the fog, a
  harbour-master's hut, the **Crown's observer's launch** tied up beside theirs (Aldermoor violet pennant: the Crown
  is already here, shown before anyone says it), a tea stall, puddles between the planks.
- **Haru's first sighting, shown:** as the party walks up the pier, a puddle object ahead ("A puddle. Two faces in it:
  yours, and one over your shoulder.") and, when Gianna turns (`face: player` on an unseen actor), a figure in grey
  steps behind a lantern pile (`enter` from behind the pile, `exit` the way he came, fast; Yari: "There. No. Gone."
  Azzy: "Fog." Yari: "Fog does not wear shoes."). `story.haru_seen_1`. (K-1's three sightings are the way Haru is met,
  on the main route; the quest itself follows after the release, section 7.)
- Salkhi, led off the longship: "I was told there would be grass. This is soup." (The fair's joke follows the horse;
  nobody near Anissa.)
- Journal: **Into the mist** (done `story.kuroshi_arrived`).

### Beat 1: The Lantern Quarter (kuroshi-quarter, the hub)

- Up from the pier onto the quarter: canals and humped bridges, tea houses with their screens half open, the
  paper-maker, the armourer, the contract board, the **debate corner** on the middle bridge (a Witness
  balance-keeper and a veiled whisperer, one passing line each), the **fishers' family** at the marsh gate on the
  north-east (a woman and a boy with an unlit lantern: K-3's hook, section 7.1), the **fog maze's gate** at the north
  edge (a torii-like frame with unlit posts beyond it, closed until beat 4: "The lanes beyond are the fog's. Nobody
  walks them without a reason."), the **Lantern Library** door on the west canal, and the **main bridge** at the
  heart of the quarter to the **Hall of Screens**.
- **The Crown's observer, shown:** a man in Aldermoor violet ("Mr. Ashdown", proposal) crosses the main bridge ahead
  of the party with a Kuroshi clerk carrying a lacquer file-box, and is bowed through the Hall's gate without a
  word; the gate guard then stops the party ("Envoys wait to be announced."). Samira: "He did not wait." The guard:
  "He is not an envoy. He is a customer." (The chapter's trouble, said once by a guard who does not know he said it.)
- **Haru's second sighting, shown:** a tea house's paper screen at the bridge's foot slides a hand's width as the
  party passes (an object with two looks on a step trigger; `story.haru_seen_2`); Yari throws a pebble at it; it
  slides shut. Bayarmaa: "Say less." Yari: "I said nothing. I threw something."
- The signal master comes down from the Hall (shown: `enter` from the gate, `walk` to Gianna): "Zetwal's envoy. You
  carry a letter from Ordvik. Lady Kaede will hear it at the lantern hour. Until then the library is yours; the Hall
  is not." He takes the letter (`item.torvald_letter` consumed, `story.letter_given`) and goes back in. So the day
  is the party's before the Hall is, and the gate (section 6) is named by the city itself, not by a companion.
- Journal: **Announced** (done `story.letter_given`), then **Until the lantern hour** (the day gate, section 6,
  `followSide`).

### Beat 2: Until the lantern hour (the required quests, any order; the arrow follows the ground)

- **K-2 The Spy Ledger** (the Lantern Library, with **Kayla**: section 7.1 and 9), the **debate** *Is silence virtue
  or concealment?* (the middle bridge: section 7.3), the Lantern Library's nine books, the three vendors and the
  contract board. K-3's hook can be accepted now (the fishers), but its steps need the lantern code (beat 5), so the
  Journal shows it as accepted with its first step waiting; the arrow does not lead to the marsh until the code is
  known.
- When K-2 and the debate are done: **dusk on the quarter** (a flag variant `story.quarter_dusk`): the lantern-lighters
  walk the bridges lighting the posts (walkers, shown), and the Hall's gate guard calls across the bridge: "The lantern
  hour. The envoy is called."

### Beat 3: The Hall of Screens (kuroshi-hall, the seat of government)

- **The Hall:** a long corridor of standing screens (fixed, painted with cranes and pines; the *rotating* screens are
  the file house's, beat 7) to the **dais** where **Kaede Suzumori** kneels behind a low writing table; off the
  corridor the **retainers' council** (a retainer for neutrality, a retainer for war), the **tea room for envoys**
  (where the Crown's observer takes tea with a courteous man in a plain grey kimono and a paper fox mask hung at
  his belt as a trade sign: **the broker**, the Paper Fox, seen first as a guest), the **signal tower** stair (the
  signal master; lantern and kite codes on the wall), the **records room** (the four Hall books), the **file house
  door** at the back, sealed with a paper seal and the Neutrality Order pasted beside it (a readable object), and
  the **keeper of files** standing at it.
- Staged: the signal master reads Torvald's letter aloud down the corridor (a walker): "The Ironvow speak for
  Zetwal's envoy. The standard stands. Skarragol has heard the Throne's page and sells nothing. Torvald." Kaede,
  not looking up from her brush: "We heard the page too. *Waters*, for Xaraguá. For us the Crown wrote *the fog*.
  (`clue.seventh_clause_read`; else: "We heard the Parley ended badly.") I have had it copied. Everything about us is
  copied."
- **The order, said plainly by Kaede** (the chapter's rule, once): "Kirinoura's council has ordered neutrality.
  The file house is sealed. No file leaves it, no envoy enters it, no informant of ours is named to anyone. That is
  the order. It protects the people who tell us things. It is the only protection they have, because the Throne
  has refused them the law's for fifty years." (*The Informants' Petition*, in the library, says the same: the price.)
- **The retainers disagree, shown:** the war retainer, stepping onto the corridor: "Neutral means the Crown buys
  our silence instead of our ships." The neutrality retainer: "Neutral means nobody burns our files." Kaede:
  "Both are written. Sit down." The Crown's observer, from the tea room door, courteous: "The Throne respects
  Kirinoura's neutrality entirely." The broker beside him says nothing and bows exactly.
- **Gianna's ask:** the Fog Files: "Your mother's mother gave my grandfather every Crown movement of the war. I am
  asking for one file: who the Crown is buying now." Kaede: "Sayo's network is why there is a Kirinoura to be neutral.
  No." Haru, from behind a screen, which is **his third sighting** (two shoes under the screen's hem, seen as the
  party came in; now the screen falls over, shown): "Mother, the file house is being emptied through the back." Kaede,
  without turning: "Haru. You were told to follow them, not to speak." Haru, to Gianna, upright: "I am definitely not
  a spy." (`story.haru_seen_3`, `story.haru_met`.)
- **Haru defies the order** (the guide's "defies the order to stay neutral", here where it costs him): "Somebody is
  selling the files. The seal is on the front door. Grandmother Sayo never used the front door. I know the old way
  in and I am going tonight. Write that down." Kaede: "It is already written." (She is the spymaster; she knew. What
  she will not do is order it.) Kaede, to Gianna, the one thing she gives: "If my son walks the fog with you, and
  comes back with proof the Crown has been inside my file house, the council will hear a petition at dawn. Not
  before." `party.haru`: **he joins as a fighter here**, before the maze (section 12: Claude's call; `STORY.md` says
  he joins after the Fox falls; he *leaves Kirinoura* with the party then).
- Journal: **The lantern hour** (done `story.haru_met`), **Sayo's way in** (the maze: beat 4).

### Beat 4: The fog maze (kuroshi-fogmaze; SIG-KUR part 1, section 8)

- Haru opens the maze's gate on the quarter's north edge (the gate object reads `party.haru`). The maze: identical
  lanes of blank paper walls and unlit lantern posts, fog to the edge of the screen (the map's `above` layer draws
  the fog, thinner on the lane the player is on). The gate tile is an Echo zone; Anissa holds the door here ("I'll
  count the lanterns from here, Gigi."). Haru: "Grandmother's people talked through this fog with lanterns. The
  posts are the same posts. The code is not written anywhere. That was the point."
- **The Echo:** swap at the gate: the posts are lit, and **Sayo's agents** (three figures in grey) walk the first
  lane ahead of Patricio lighting posts in pairs and threes, white and red (walkers with per-post lantern objects
  whose look is set by `echo.*` flags, shown lane by lane as Patricio follows); the Journal records each signal seen
  (*Two white, one red: left* and so on, the note *Sayo's lanterns*, `clue.lantern_code`). The agents stop at the
  first junction and go dark ("The rest you walk. The fog remembers nothing."): the Echo gives the **code**, the
  present gives the **route**.
- **The present:** six junctions, each with three unlit posts the player lights by walking past (the present posts
  show the same colours, one junction at a time, as the player reaches them: the fog hides the next). Read the
  colours, turn left, right or straight. A wrong turn walks into fog that sets the party back at the gate (a
  teleport trigger with the line "The fog closes, and the gate is behind you again."). No fight, no timer.
- The maze's far end is a gap in the quarter's north wall onto the **Fog Marsh's causeway** (beat 5). Journal:
  **Sayo's way in** (done `story.maze_walked`, the step trigger at the far gap; the signature puzzle's XP pays at
  the end of part 2, section 5).

### Beat 5: The marsh and the lost fishers (kuroshi-marsh; K-3 on the route, section 7.2)

- The causeway runs through reeds to the fishers' huts; the Hall's **signal tower** stands on the marsh's far
  side, its back door (the file house's "old way in") at the end of a second causeway that the fog hides.
  Lantern Moths and Fog Cutpurses ambush on the reed paths off the causeway (the causeway itself is safe, as
  Ardencia's road is); the first Hushers of the game walk the far paths (section 5).
- The fishers' boy from the quarter is at the huts with an old fisher: "The boats went out this morning and the fog
  came. They steer home by the marsh posts. The posts are dark." The **marsh posts** (five, along the second
  causeway) are the puzzle M-KUR-2: light them in the code for *left, then right* (two white and a red; one white and
  two red), the code the player just learned. Lit right, the boats come home (shown: two boats poled along the water
  beside the causeway, walkers, and the fishers step out to the huts); lit wrong, the boats go past in the fog (a
  line) and the posts reset.
- **The press:** the fishers' hut has a lacquer box of type and a wet proof sheet with the grey **ash thumbprint**
  on the ink (the safehouse: `side.lanterns.done`, the thumbprint count up one). The old fisher: "Somebody pays for
  the paper. We never asked. The sheets say what the Hall will not." Haru reads a proof: "This is tonight's council.
  Word for word. Somebody in the Hall is feeding them too." (The rebel network and Kuroshi's informants are the same
  people, which is the Petition's point.)
- The lit posts also show the second causeway: the way to the signal tower's back door (`story.causeway_lit`).
- Journal: **Lanterns for the lost** (done `side.lanterns.done`), **The back door** (done `story.filehouse_entered`).

### Beat 6: The file house and Sayo's map (kuroshi-hall, the file house room; SIG-KUR parts 2 and 3; the Echo scene)

- Through the signal tower's base into the **file house**: a grid of paper screens on pivots (3 x 3; section 8),
  lacquer file-boxes on every wall, the keeper's desk, and on the north wall a faded square where **Sayo's wall map**
  once hung. The grid turns: pushing one screen turns its neighbours, and the lanes close. The room's Echo zone is
  the map wall.
- **The Echo: Sayo's network** (the chapter's required Echo scene; `onEcho`, restartable until its flag is set): the
  wall map hangs whole, the file house is a war room, and **Lady Sayo Suzumori** (Gen II, Haru's grandmother; a woman
  in grey with a brush) stands at it with **young Patricio** (the player). Her agents come in through the screens
  one after another with paper slips (shown: `enter` through the screen lanes, `walk` to Sayo, `exit`); she pins
  each on the map (the map's pins appear by `echo.*` flags as each arrives): "Crown marines, two companies, to the
  harbour chain by the new moon." "The Regent's supply ships lie at Kingsmere until the wind." "The Brasador march
  goes by the ash road, not the coast." Patricio (choice, both remembered, `choice.patricio_sayo`): "How many of your
  people die for these slips?" / "Can Zetwal pay for this?" Sayo: "Four this year. They are not written down anywhere
  but here. That is my price: when you win, write them down." / "You cannot. Nobody can. That is why it works."
  Caona and Benny are named ("Caona took the ash road slip south herself. Benny is on it."), not drawn. The scene
  ends with Sayo tapping a screen in the grid: "That one. The peg is loose. Fix it or the whole house turns on it."
  Patricio sets the peg (**the anchor**, `anchor.screen_peg`: the one screen stops turning in the present too).
  `clue.sayo_network`.
- **The present:** with the pegged screen fixed, the grid solves in four pushes (north, east, east, south: section 8).
  The lanes open to the north stack. **The spy map** (the map's faded square in the present, read with the Echo's
  pins remembered: the Journal shows Sayo's map as a note) marks a floor stone under the north stack: the buyer's
  files are kept there (`story.spy_map_read`).
- Journal: **The screens** (done `anchor.screen_peg`), **Sayo's map** (done `story.spy_map_read`).

### Beat 7: The Paper Fox (the file house; the boss, section 5)

- A step trigger at the north stack plays the scene (restartable until `story.fox_beaten`). The floor stone is up and
  the **broker** is kneeling at the hole with a lacquer box open, the Crown's clerk's file-box beside it (the same
  box the observer's clerk carried over the bridge in beat 1: the player has seen it twice). He stands, courteous,
  and puts on the fox mask (shown): "Lady Kaede's son. And the envoy. You came the old way; I came the new one. The
  keeper has a price. Everyone in this city has a price; I keep the list." Haru: "You sold Grandmother's files."
  The Fox: "I sold copies. The originals are perfectly safe. That is what neutral means now." He steps behind a
  screen and **three** of him step out (shown: `enter` three identical figures from three lanes). The fight
  `file_house_fox`: the Fox and three paper decoys; two phases; nobody dies (he `withdraws` at 0 HP), section 5.
- **After, on the map (the scripted Yield):** the mask off, the Fox on his knees among torn paper (shown: the decoys
  are gone, the screens shredded, a flag variant). Three things in order:
  1. **The Fog Files, taken:** the lacquer box: *The Buyer's Mark* and *The Ledger of Outflows* (`item.fog_files`,
     key; read in beat 8 with Kayla). And **his receipts** (the Hall book *The Paper Fox's Receipts*): years of
     copies sold to "the Throne's observer" in Throne sols, each with the observer's countersign: the proof Kaede asked
     for (`clue.fox_receipts`).
  2. **The Fox's end** (a choice, both remembered): **"Bring him to the dais. Let the council hear him name his
     customer."** (`choice.fox_spared`; +1 Influence at Kuroshi; he is at the Hall in beat 8 and names the observer) /
     **"Give him to the retainers. Let the city see a broker walked through the fog with no mask."** (Bayarmaa's
     line; `choice.fox_broken`; +1 Fear; the marsh's cutpurse groups lose weight for the rest of the chapter). He
     names the buyer in neither: "I never knew the name. I knew the mark. I was paid to know less than I do." Nobody
     kills him.
  3. **The way back:** through the Hall's front, the paper seal cut from the inside (shown: Haru cuts it; the keeper
     of files steps aside and says nothing). `story.fox_beaten`.
- Journal: **The Paper Fox** (done `story.fox_beaten`).

### Beat 8: The files read (kuroshi-library: Kayla decodes; the clues)

- The arrow leads to the Lantern Library at dawn (`story.quarter_dawn` clears the dusk variant). Kayla at her desk
  (section 9). Gianna puts the box down. Kayla reads with a brush in her other hand, folding nothing now, and lays
  three things on the desk, shown as objects the player reads:
  - **The Buyer's Mark** (`clue.buyers_mark`): a Crown buying-list in Throne sols: four lines, *Dorini, Ironvow,
    Suzumori, Agnivansh*, each with a price the Throne would pay, and beside one line a stamped mark, a **closed
    hand**, where the name has been **cut out of the paper** with a knife. Kayla: "The mark is the Quiet Crown's.
    The name was cut after the ink dried. Somebody wanted the mark seen and the name not. I can tell you which line
    is shortest. I will not, because it would be a guess, and you would carry it." (The betrayer is decided at the
    Muster by the least-paid price, guide 5.6: the file foreshadows and cannot name. The Journal note *The buyer's
    mark*: "The Crown has bought, or will buy, one of the four. A closed hand. A house whose price we leave least
    paid is the one it can afford.")
  - **The Ledger of Outflows** (`clue.ardencia_outflows`, Rael clue 3): gold out of Ardencia's treasury, large sums,
    every season for twenty years, to destinations in a cipher. Kayla, exact: "This is Ardencia's hand. I know it. The
    destinations are in a key I do not hold; the Alcázar cut it after I left. I can tell you it is not the Crown's key.
    I cannot tell you where the gold went, and I would not if I could, because you would hear what you came in
    wanting to hear." Gianna: "That he sold us." Kayla: "I did not say that. I said I do not know." (STORY 6.6:
    the code is read after the Harbor Turn, by Haru; the Journal note *Gold out of Ardencia*: "Twenty years of gold,
    somewhere no one should be funding. Samira's coin 'had been somewhere else'.")
  - **The Spy Ledger** (K-2's reward, if done: the Ash Wars account 2 of 4) goes back on its shelf; Kayla stamps it
    returned.
- Azzy, after (the family beat, section 9): "Titi. Come to the Muster." Kayla: "I am a clerk." Azzy: "You are a
  Rodriguez." Kayla: "I am a Rodriguez who is a clerk. Both are written." (She does not come; FAMILY.md places her
  here only.)
- Journal: **The Fog Files** (done `clue.buyers_mark`; the chapter's second key clue pays no second XP).

### Beat 9: The petition (kuroshi-hall: the price, the token, Haru leaves)

- Dawn at the Hall: the council is seated (shown: both retainers, the keeper of files with his hands empty, the
  Crown's observer **absent**, his tea bowl still on the tea room table), the Fox kneeling at the corridor's foot if
  spared. The signal master reads the receipts aloud (a walker). The neutrality retainer, low: "We were neutral."
  Kaede: "The Crown was not." She brushes a line and turns the paper round (shown: the Neutrality Order object
  changes look): "The order stands for the people. It is lifted for the Throne."
- **The price (Influence 10; the realm economy as built: flags and Journal notes, as Chapter 3's Free Brasador and
  Chapter 6's fleet):** Kaede: "The Suzumori want one thing: that the people who told Sayo what they knew, and tell
  me, are named in the law and not in a broker's box. Recognition. Protection. Zetwal's envoy has been reading our
  books all day; I had it counted." The scene reads **Kuroshi's Influence** (books +1 each, the debate, K-2's +2,
  K-3's +1, the Fox spared +1) and pays, in order, each laid on the dais:
  - **the Fox's receipts** ("You did our work in our own house." → +2 Influence at Kuroshi, always);
  - **Torvald's letter** (`story.letter_given`, always: "Skarragol spoke for you. That is worth a line." → +1);
  - **Yari's petition** (if `item.petition` was built and she still carries a copy: Yari lays it on the dais; Kaede
    signs it: +1 Influence and Se-5's Kuroshi line is answered; else Kaede signs the Informants' Petition for Zetwal
    instead, the same +1);
  - **Samira's offer** (optional: "The Dorini bank will hold your informants' names in a sealed account. For a fee
    that I will waive, which my mother will hear about." → +1 if the player chooses it; `choice.samira_names`).
  So the player leaves with Kuroshi's Influence between about 6 and 16 of 10; a reader pays it in full here and
  overpays. **`ally.kuroshi`** is set regardless (the alliance is made; the shortfall is a debt the Muster collects),
  with the Journal note *The Suzumori network*: "Price: Influence 10. Yours here: N. A house whose price is least paid
  is the one the Crown can still buy." (The same sentence as the Ironvow note: the count is the betrayal's rule,
  stated the same way twice so the player keeps it.)
- **The token:** Kaede folds a paper crane from the lifted order's margin and presses the Suzumori seal into its
  wing: `item.token_suzumori`, "For the chamberlain's chair. Suzumori sits." (Se-5's second token, in the price
  scene.)
- **Haru leaves with the party** (the guide's "joins"): "I am going with them, Mother." Kaede: "You are not a spy."
  Haru: "Definitely not." Kaede, the only warmth she shows, to Gianna: "He listens better than he talks. It is the
  family trade." `story.haru_left_kirinoura`.
- **Jwaladesh's door:** Kaede: "Agnipur will not take a Suzumori crane. We burned their temple on a Crown paper
  that was false; the elder who signed it is still alive and still sorry (K-5's seed: the elder is placed in the
  library with one line). Take the crane anyway. Their flame is dying, and the Crown is holding the oil." The
  retainer for war: "And Agnipur's priests heard the page too. They were written down as *the ash*."
- Journal: **The petition** (done `ally.kuroshi`).

### Beat 10: The pier (kuroshi-pier, then the card)

- The party walks to the pier (shown; Haru, Bayarmaa and Salkhi with them; the observer's launch is gone). The
  harbour-master: "The Crown's man sailed before the lamps went out. He left his tea." A Zetwal trader takes them
  **west along the south coast** to Jwaladesh (Agnipur at (37, 91): a sea voyage `kuroshi_jwaladesh`, captions "Out of
  the mist, west along the coast..." / "...to the salt flats, where the sky is on fire"). Salkhi is loaded last ("At
  least it is not soup.").
- Card: *Chapter 7 complete, The Fog Files. Next: Chapter 8, The Dying Flame.* `act7.complete`. `?chapter=8` starts
  where Chapter 8's outline puts the landing.
- Journal: **West** (done `act7.complete`; pays no XP: a card).

---

## 3. The maps (six, drawn in code like Cenizal and Ordvik: `tools/maps/kuroshi.ts` through `painter.ts`)

Registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`, city id `kuroshi`, name Kirinoura, house Suzumori). The
look: black water, grey plank bridges, white paper screens in dark lacquer frames, violet-grey roofs, paper lanterns
(warm points in grey); fog on the `above` layer at two densities. Accent `#7d3c98` (CAPITALS). Tiles for the tool:
`PLANK`, `CANAL`, `BRIDGE`, `SCREEN` (a wall), `LACQUER` (floor), `TATAMI`, `REED`, `MARSHWATER`, `CAUSEWAY`, `FOG`
(an `above` tile, two looks), `POST` (object), `LANTERN` (object, three looks: dark, white, red).

| Map | Size (tiles) | Section | Echo | What is on it |
|---|---|---|---|---|
| `kuroshi-pier` | 28 x 14 | The Lantern Pier (outdoor) | none | The landing, the observer's launch (until `story.fox_beaten`), the harbour-master, the tea stall, the puddle (sighting 1), the voyage trigger (after `ally.kuroshi`), the stair up to the quarter |
| `kuroshi-quarter` | 42 x 30 | The Lantern Quarter (hub, outdoor) | none | Canals and five bridges, the tea house (vendor), the paper-maker, the armourer, the contract board, the debate corner on the middle bridge, the sliding screen (sighting 2), the fishers' family at the marsh gate (north-east), the library door (west), the main bridge and the Hall's gate (north centre), the fog maze's gate (north edge, opens on `party.haru`); dusk and dawn variants; Salkhi's placements; the Quiet Crown's hidden conversation slot (S-KUR, inert) |
| `kuroshi-library` | 22 x 14 | The Lantern Library (interior) | **the clerk's desk** (one zone: Sayo's clerk filing the ledger, M-KUR-1; no anchor) | The nine books in lacquer boxes, the librarian (Japanese greeting), **Kayla's desk** and the **sealed stacks** door at the back (K-2), the Suzumori elder (K-5's giver, placed, one line) |
| `kuroshi-hall` | 36 x 26 | The Hall of Screens (the seat of government, interior) | **the map wall** in the file house (one zone; anchor: the screen peg) | The corridor of fixed screens to the dais; the retainers' council; the tea room for envoys (the observer and the broker until the lantern hour); the signal tower stair; the records room (four Hall books); the sealed file house door; **the file house room** (the 3 x 3 rotating grid, the north stack, the floor stone, the map wall), reached by the tower's back door from the marsh and, after `story.fox_beaten`, by the front |
| `kuroshi-fogmaze` | 30 x 30 | The fog maze (outdoor) | **the gate** (one zone: Sayo's agents light the first lane; no anchor) | Six junctions of identical lanes, eighteen lantern posts, the fog-return triggers, the far gap onto the marsh |
| `kuroshi-marsh` | 46 x 28 | The Fog Marsh (wild, outdoor) | none | The causeway from the maze's gap to the fishers' huts, the reed paths (the ambush layer, `fog_marsh`), the five marsh posts and the second causeway (shown on `story.causeway_lit`), the fishers' huts and the press, the signal tower's back door |

Six maps: CAPITALS' five with the **pier** split out (the arrival needs a place with the Crown's launch in it) and
**Lady Sayo's House** not built (K-4 and the Nightingale Key are after the release; its door stands on the quarter's
west canal, closed, with a label). The fog maze is its own map rather than the hub's north edge: a maze needs its
own lanes and its own fog. **Outdoor areas, buildings aside: five** (the pier, the quarter, the maze, the marsh's
causeway and huts, the marsh's reed paths), the owner's rule. The seat is central (the Hall behind the main bridge at
the quarter's heart), large (36 x 26), staffed, and full of people who disagree (Kaede, two retainers, the signal
master, the keeper of files, the Crown's observer, the broker). The market is the quarter itself (tea houses and
bridges, no plaza). The validator's rules hold: every zone tile walkable in both eras; no NPC or door inside a zone;
the Hall's one anchor is an Echo-era puzzle object (the loose screen) whose dialogue sets `anchor.screen_peg`, read by
the present grid.

**Drawn placeholders** (code, through `assets.config.ts`): a paper screen as a 1 x 2 object with four orientations
(the grid) and a torn look; a lantern post as a 1 x 2 object with three looks; a lacquer file-box 1 x 1; a humped
bridge 3 x 1; a fishing boat 2 x 1; a paper fox mask on the broker's sprite (a recolour); the fog as two `above`
tiles.
