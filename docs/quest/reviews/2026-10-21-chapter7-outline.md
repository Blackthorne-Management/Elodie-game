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

---

## 4. The Echo and the fights: what the engine has and what this chapter uses

- **The Echo party** is Patricio, Caona and Benny, as data; the field draws only Gianna's sprite in the Echo, so
  Sayo's war room is staged with Sayo and her agents as Echo-era NPCs and walkers, the map's pins as Echo-era
  objects placed by `echo.*` flags, and the loose screen as the Echo-era puzzle object. Caona and Benny are one
  line each, not drawn. No new system.
- **No Echo battle.** Sayo's network is a listening network ("That is why it works"); a battle in it would
  contradict the scene, and the Echo-battle foundation is still unbuilt. Claude's call, section 12.
- **The present's fights** use what Chapters 3, 4 and 6 built: enemies as data with `moves`, `every`, `tell`,
  `area`, `magic`, `statuses`, `seize`, `hire`, `protects`, `withdraws`; battles with `phases` (`below`, `onSurge`,
  `enter`), `rewards`, `endsWithBoss`; random ambushes from an `encounters` layer. There is no `support` or `swarm`
  role (the Moth is a skirmisher with `hpScale 0.6`), no `hushed` status (section 10), no `fogged` (the built
  fallback is `weakened`), no evasion status (the Cutpurse's *Smoke* becomes a smoke bomb that weakens), no item
  theft (Pickpocket is cut; Thorne's Requisition was cut the same way). Everything below is written to those shapes.
- **Haru as a fighter** is a `MemberDef` in `rpg.ts` plus `SKILLS.haru` and `MOVES.haru` in `battles.ts` and a
  placeholder look (section 9); `joins: { flag: 'party.haru' }`. Two of his four skills need small engine pieces
  (section 10); the other two are data.
- **Who fights.** With Haru the party has six fighters and `BATTLE_ACTIVE` is 4. By the built rule the active four
  are the first four joined in `MEMBERS` order, so **Haru must be placed before Bayarmaa and Samira in `MEMBERS`**
  (or whatever Chapter 4 or 6 built for the order must set him active when he joins): a new companion the player
  cannot play in his own chapter is a bug. The sim ran him active with Azzy (Bayarmaa benched) and with Bayarmaa
  (Azzy benched): both win every seed (section 5). The Fox's decoys are built so that Kagemimi matters (section 5),
  so he should be on the field for the boss by default.

---

## 5. The chapter's fights and levels

**Enemies (new data, `COMBAT.md` 13.2 and 13.3, in the engine's shapes):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Lantern Moth** (`lantern_moth`) | skirmisher, `hpScale 0.6`, weak to fire | 17 to 18 | Dust 80; Glare 50, `area`, `weakened` 50%, every 3, tell "The moths all turn their wings to the lantern light at once..." | The design's swarm; flees at the end as the engine's last-foe rule does |
| **Fog Cutpurse** (`fog_cutpurse`) | skirmisher, `bribable` | 18 to 19 | Knife 100; Smoke bomb 60, `area`, `weakened` 50%, every 3, tell "The cutpurse pulls a paper ball from her sleeve and bites the fuse..." | The design's Smoke (evasion) and Pickpocket have no engine support: cut |
| **Husher** (`husher`, new: the first of the game) | caster, resists light | 18 to 19 | Whisper 90 `magic`; **Hush** 120 `magic`, `hushed` (section 10; fallback `weakened`), every 3, tell "The Husher lifts a finger to the veil. The fog goes quiet..."; **Seize** `seize: 3`, `marked` on Gianna 2 turns, every 4, tell "The Husher is looking past you. At her." | COMBAT's Steal Voice (drain SP) is cut. Seize is the built Rael move: Gianna steps in front of Anissa, who is never hit |
| **Quiet Crown Zealot** (built, `qc_zealot`) | caster | 19 | as built | "The little one glows, they say. Even in the fog." |
| **Paper decoy** (`paper_decoy`) | caster, `hpScale 0.35`, `protects: 'paper_fox'`, weak to fire and light | 19 | Rustle 50 | Named *Paper Fox?* with the Fox's look: three of them intercept blows meant for him (`INTERCEPT_CHANCE` 0.75) until they are torn |
| **The Paper Fox** (`paper_fox`) | skirmisher, `boss` | **19** | section below | the broker who sells Kuroshi's files to the Crown |

**The Paper Fox, two phases, sim-checked:** level 19, `hpScale 12`, `atkScale 1.8` (the skirmisher line at 19 with
those gives about 1,760 HP and 98 ATK before the Story difficulty's 0.8 and 0.7). COMBAT's 7 / 1.0 is on the
standard line before the role's 0.8 HP and the sim shows it ends in 17 party actions with nobody hurt; the Fox is a
fight of tricks and time, not weight, so his danger is the reading, not the knife.

1. **Screens:** *Paper knife* 110; ***Fold*** (`power 0`, `hire: 'paper_decoy'`, every 3, tell "The Fox folds a sheet
   in half, and in half again..."): a torn decoy is replaced from the reserve, up to the built `HIRE_CAP` (2) beyond
   the starting three. **Haru's Kagemimi** on a decoy or the Fox shows which is real (section 10: the reveal marks
   the real Fox and names him on the field; until then all four are *Paper Fox?* and one-target blows meant for him
   land on paper 75% of the time). A Surge or any area move (Yari's Volley, Azzy's Sweep, Gianna's Dawnlight) tears
   paper in one blow.
2. **Sold Secrets** (`below: 0.5`): "You keep files too. Everyone does."; moves *Paper knife* 110 and ***Sold
   Secrets*** (`mirror: true`, section 10: he reads one fighter's file and uses that fighter's strongest damage
   skill on them with their own ATK or MAG; every 2; tell "The Fox opens a file with your name on it and reads..."):
   Guard, the named fighter. Fallback if `mirror` is not built: a 200-power `magic` blow every 2, which the sim used.
3. At 0 HP he `withdraws` ("Enough. Take the files. They were never mine to sell."): nobody dies. `endsWithBoss`: a
   standing decoy is torn as he falls.

| Scaling tried (Gianna, Yari, Azzy, Haru; 30 seeds; Story difficulty) | Party 17 | Party 18 | Party 19 |
|---|---|---|---|
| hp x7, atk x1.6 (COMBAT's, with the role) | 30/30 won, 17 actions, 0 down, 86% HP left | 30/30, 17, 0, 84% | 30/30, 16, 0, 86% |
| hp x10, atk x1.8, phase 2 at 50% | 30/30, 24, 0, 83% | 30/30, 22, 0, 85% | 30/30, 21, 0, 84% |
| **hp x12, atk x1.8, phase 2 at 50% (chosen)** | **30/30, 29, 0, 84%** | **30/30, 26, 0, 84%** | **30/30, 25, 0, 84%** |
| hp x14, atk x2.0 | 30/30, 34, 0, 84% | 30/30, 31, 0, 83% | 30/30, 29, 0, 83% |
| hp x12, atk x1.8 with Bayarmaa active, Azzy benched | 30/30, 27, 0, 86% | 30/30, 26, 0, 84% | 30/30, 25, 0, 87% |

So x12 / x1.8 gives a boss of about 26 party actions at 18 (six or seven of Gianna's turns), where Grimvald sat at
17, with nobody down in any seed: the bot tears decoys first and Guards the tell. The real *Sold Secrets* (a mirror
of Yari's Aimed Shot at her ATK, or Gianna's Falling Star at her MAG) hits harder than the sim's stand-in, which is
the pressure the sim lacks; the simulator with the built move decides on day 1 whether x12 holds or drops to x10.
Game Over applies (not meant to lose); the way back in is the north stack's trigger.

**The other fights:**

| Fight | Where | Foes | Level | Party then | Pays (data) |
|---|---|---|---|---|---|
| Ambushes (`fog_marsh`, from `story.kuroshi_arrived`) | the marsh's reed paths | Lantern Moth x4 (17); Fog Cutpurse x2 (18, weight 2; weight 1 after `choice.fox_broken`); Fog Cutpurse + Husher (18); Quiet Crown Zealot x2 + Husher (19) | 17 to 19 | 17 to 19 | the encounter rule: 10 XP and 4 gold per foe per level before the taper (section 5 below) |
| **The sealed stacks** (`stacks_cutpurses`, K-2's "seen") | the library's back room | Fog Cutpurse x3 at 19 | 19 | 17 to 18 | 60 XP, 150 gold (data) |
| **The marsh moths** (`marsh_moths`, K-3) | the fishers' causeway | Lantern Moth x4 at 18 | 18 | 18 | 50 XP, 100 gold (data) |
| **The Paper Fox** (`file_house_fox`) | the file house | the Fox 19 + three decoys 19 (two more by Fold) | 19 | 18 to 19 | **100 XP, 300 gold**, items: the Fog Files and the receipts (key) |

Sim-check of the ambushes (same bot): four moths at 17, 30/30 in 4 actions with 97% HP left; two cutpurses at 18,
4 actions; a cutpurse and a Husher at 18, 4 actions, 95%; **two zealots and a Husher at 19**, 7 actions, 90%; three
cutpurses at 19, 7 to 8 actions, 91%. The party at 18 is strong (Azzy 189 HP, Haru SPD 52, the fastest fighter yet),
so the marsh's groups should sit at the tier's top (18 to 19), not its floor, or they are grey and back off
(`LEVELS.bands.trivial = 3`).

**Levels through the chapter** (tool line from 4,300; played line from 5,200; objectives 25, books 10, the signature
puzzle 60, the minor 25, the debate 15 joined or 25 mediated):

| Point | XP from | Tool total | Level |
|---|---|---|---|
| Start (the pier) | | 4,300 | 17 |
| Into the mist, announced, the lantern hour, Sayo's way in, lanterns for the lost (the quest pays; the objective is `noXp`), the back door, the screens, Sayo's map, the Paper Fox, the Fog Files, the petition (ten objectives at 25) | 250 | 4,550 | 17 |
| SIG-KUR (60), M-KUR-1 (25), M-KUR-2 (25), the debate joined (15) | 125 | 4,675 | 18 |
| K-2 (100 XP) and its stacks fight if seen (60), K-3 (100) and its moths (50) | 310 | 4,985 | 18 |
| The Fox (100) | 100 | 5,085 | 18 |
| The library's nine and the Hall's four, if read (130) | 130 | 5,215 | **19** |

The tool lands at **18 to 19 (5,085 to 5,215)**, on target with the books; without the two side quests, 4,900:
**18** (`skipSideQuestsMaxUnder = 2` holds). **The played line** inherits Chapter 6's problem: from 5,200, with the
chapter's 915 and two marsh ambushes, a level-18 pair pays 360 by the rule and a level-19 trio 570: 5,200 + 915 +
900 = **7,015, level 22**, three over and past Jwaladesh's band; with the Chapter 6 outline's taper (0.35 from 15),
the two ambushes pay about 320 together: **6,435, level 21**, still two over. The outline's second dial (lower
chapter data) is already applied here (the Fox 100, the quests 100). **So this chapter's data is set assuming the
taper lands, and the central session should set `ENCOUNTER_XP_TAPER` at 15 to about 0.25 (a level-18 pair pays
90, a trio at 19 143) rather than 0.35, or Chapters 7 to 9 each drift one level higher than the one before.** If the
taper is refused, the fallback is the same as Chapter 6's: lower weights and a 24-step grace on the marsh, and the
marsh's causeway kept safe so a player who stays on the route meets at most one ambush. `CHAPTER_LEVELS` 7 keeps
`to: 19`; the simulator with Chapter 7's route decides on day 1.

**Gold:** about 1,200 to 1,800 in; the marsh's ambushes about 150 each; K-2 200, K-3 250; the Fox 300. Out: the
armourer's tier-16 gear if not bought in Ordvik and the tier-20 pieces (a short blade for Haru about 650, lacquered
armour about 800, the silk mask charm about 400), the tea house, the paper charm (reveals one enemy skill: Kagemimi
in a charm, 120 gold, consumable). Nothing in the chapter requires spending; Samira's offer at the petition costs
nothing but a line.

---

## 6. The required-before gate: "Until the lantern hour"

- **In the story:** the signal master says Kaede hears the letter at the lantern hour and that the library is the
  party's until then. So the day is the party's, and the city names what is in it without saying "quests": the
  signal master: "The library's clerk has been expecting an envoy who reads; the stacks at the back are sealed, and
  she will tell you why. And the keepers are arguing on the middle bridge again about silence; they always are." The
  fishers at the marsh gate are the third stop, but their steps wait for the code.
- **In the Journal:** the objective **Until the lantern hour**, `followSide`, done when K-2 and the debate (joined or
  mediated) are done, **or** when `story.haru_met` is already set (a save in the Hall never sticks).
- **On the map:** the Hall's gate guard is a step trigger that waits for the two (`if: 'side.spy_ledger.done,
  debate.kuroshi_silence.joined|debate.kuroshi_silence.mediated'`); until then he is worded from the flags: "The
  clerk is still waiting." / "The keepers are still at it." Anissa: "Your Quests page, Gigi."
- **The dusk variant** (`story.quarter_dusk`) is set when the second completes; it clears on `story.quarter_dawn`
  (beat 8).
- **A second, softer gate:** the fog maze's gate opens on `party.haru` (beat 3), and the file house's back door on
  `story.causeway_lit` (K-3 is on the route, beat 5): so K-3 is required by the ground, not by a counter, which is
  the Opus minimum's "two required side quests" with one of them never feeling like an errand.
- **Order the arrow follows:** K-2 (the library, west of the pier's stair), the debate (the middle bridge, on the way
  to the Hall), the Hall; then the maze, the marsh (K-3), the file house.
- **No soft-locks:** K-2's stacks fight is optional (seen) and winnable; the maze's wrong turns return to its gate;
  K-3's posts reset on a wrong code and the fishers repeat the direction ("Left, then right. Left, then right."); the
  marsh's ambushes are at the party's level and Game Over returns the party to the maze's far gap; the grid cannot be
  turned into an unsolvable state (section 8); the Fox's trigger restarts; the debate's Provoke does not resolve it.

---

## 7. The two required side quests and the debate

Why these, from K-1 to K-5 and the Opus minimum: **K-4 The Letter in the Floor** is the secret item (after the
release; Lady Sayo's House stays a closed door and the old floor-maker is not placed). **K-1 Definitely Not a Spy**
is the way Haru is met, so its three sightings are built as main-story beats (0, 1 and 3) and the quest itself (the
hutia noticing, the reward) follows after the release: it would otherwise be a quest the player completes by walking
the route. **K-5 Ashes of the Temple** is the Muster's Suzumori-Agnivansh mediation seed and needs Agnipur to end:
the elder is placed in the library with her one line and Kaede's "take the crane anyway" carries the feud to
Chapter 8; the quest follows after the release. That leaves **K-2 The Spy Ledger**, the Ash Wars account 2 of 4 (the
four-accounts thread, which Chapters 1 and 9 carry too), the chapter's minor Echo (the Locket used three times: pure
code in the maze, no anchor at the clerk's desk, one anchor at the map wall), **Kayla's scene** (FAMILY.md, settled:
she must be bumped into and help), and the chapter's one optional fight; and **K-3 Lanterns for the Lost**, the rebel
safehouse (the ash thumbprint, which no chapter may skip), the lantern code used a second time as the design asks,
and the way to the file house's back door. No new quest is added.

### 7.1 The Spy Ledger (K-2; Kayla; the Ash Wars account 2 of 4)

- **Opens:** in the Lantern Library, from `story.letter_given`. Shows as *??? The library's clerk* until spoken to.
- **The bump-in, shown (the owner's rule for every family member):** the party comes in; at the back desk a woman
  in a clerk's grey with ink on one cuff is folding a paper crane while a reader talks at her, and does not look up.
  **Azzy stops dead** in the aisle (a `walk` that halts), then crosses the room to her (shown) and says, in the
  formal register he uses for his father: "Titi Kayla." She finishes the fold, puts the crane down, looks up: "Azriel.
  You've grown into his shoulders. I am sorry about that." She stands, comes round the desk, and puts a hand on his
  cheek, once (`walk`, a beat). Then to Gianna, exact: "You are Elodie's. Azriel wrote me from the road: three lines,
  which for him is a book. You have the Locket. Then you have been to Cenizal and you know whose daughter you are,
  and I will not say his name in a library, where everything is overheard." (She knows; she says nothing about him.
  Section 9 has the rule.)
- **Steps:** 1) Ask about the Ash Wars (the quest's accept, `side.spy_ledger.accepted`): "There are four accounts
  of that war and three of them lie. Ours is in the sealed stacks. It is shelved by a cipher I keep, and the stacks
  are sealed by an order I did not write. I cannot open the door. I can tell you the Echo at my desk is older than
  the door." 2) **The stacks:** the back room's door is sealed (a paper seal object); a side window on the canal is
  not (a walkable object onto the room's far tiles: the "sneak"). Inside, three Fog Cutpurses are already there,
  taking boxes for the broker (shown: they are placed facing the shelves). Walking the room's near side past them
  (they face away: a lane of tiles where they do not turn) reaches the shelves unseen; stepping into their sightline
  tiles (a trigger strip in front of them) starts the fight `stacks_cutpurses` (three at 19, winnable; after it the
  room is clear, `story.stacks_cleared`). The engine has no stealth system: the "seen" is a trigger strip, the
  "unseen" a lane, and the fight the fail-safe, as Chapter 6's herd was. 3) **The Echo** (M-KUR-1): the zone at
  Kayla's desk: Sayo's clerk (a young man at the same desk fifty years ago) files a thick ledger and says its mark
  aloud, to nobody: "Crane, pine, third row. Nobody is to say that aloud." (Shown: he walks it to the stacks' door
  and back.) `clue.shelf_mark`. 4) **The present:** the stacks' shelves are marked by cipher glyphs (nine shelves,
  three glyphs each; the crane-and-pine shelf's third row is a readable object only with `clue.shelf_mark`); the
  ledger comes out: the book *The Suzumori Spy Ledger of the Ash Wars* (`lore.kuroshi_spy_ledger`, the account 2
  of 4: Sayo's agents' version of the Ash Road: Rael's "butchery" counted in the ledger as *forty-one Crown marines
  taken, nine dead, all nine the Crown's own by its own volleys*: a line that contradicts the Zetwal temple record
  and the Crown chronicle, as the guide asks; the player who reads all four can tell). Kayla, when it is on her desk:
  "Now it has been read. That is what the stacks were for." `side.spy_ledger.done`.
- **Reward:** 100 XP, 200 gold, +2 Influence (Kuroshi), the ledger (read in the Journal: the Ash Wars account 2 of
  4, with the Journal's four-accounts count), the Journal note *Kayla*: "Rael's half-sister, a cipher clerk in
  Kirinoura. She knows what the files say and nothing else, she says."
- **Why it fits:** the four-accounts thread; Kayla's settled role (the cipher is hers; she opens nothing and reads
  everything); the chapter's minor puzzle; Azzy's family beat, which the owner asked for in every chapter where a
  Titi is met.

### 7.2 Lanterns for the Lost (K-3; the rebel safehouse)

- **Opens:** the fishers' family at the marsh gate on the quarter, from `story.kuroshi_arrived`. Shows as *??? The
  marsh gate*. Accepted when spoken to (`side.lanterns.accepted`): "Our boats went out before the fog. They steer by
  the marsh posts. The posts are dark and nobody will light them: the Hall says the code is a Suzumori secret."
- **Steps:** 1) Learn the lantern code (done by the maze's Echo, `clue.lantern_code`; the Journal step reads "Someone
  must know the posts' code" until then). 2) At the fishers' huts (beat 5): light the five posts along the second
  causeway in the signal for *left, then right* (M-KUR-2: two white and a red at the fork, one white and two red at
  the bend; the other posts stay dark). Each post is an object with a three-way choice (dark, white, red); the set is
  checked when the fifth is lit; wrong: the boats pass in the fog and the posts go dark; right: the boats come home
  (shown). The moths swarm the lit posts first: the fight `marsh_moths` (four at 18) at the fork, before the boats.
  3) **The press:** the old fisher's hut, the type box and the wet proof with the grey thumbprint (close up, an
  object); Haru reads the proof (beat 5). `side.lanterns.done`.
- **Reward:** 100 XP, 250 gold, +1 Influence (Kuroshi), the Journal note *The marsh press*: "Oil, bread, water,
  grain, and now paper: the same thumbprint. In Kirinoura the rebels' sheets print what the council says in
  private. Somebody inside the Hall feeds them." (The count of thumbprints grows by one; the design says 6 of 9.)
- **Why it fits:** the safehouse thread; the lantern code twice; the marsh's one scripted fight; and the route's
  way into the file house, so the quest is never an errand.

### 7.3 The debate, required: *Is silence virtue or concealment?* (the middle bridge)

- **Where:** the debate corner on the quarter's middle bridge. **Opens:** from `story.letter_given`.
- **The two speakers** (guide 7.2): a **Witness balance-keeper** ("An oath kept in silence is still kept. The Witness
  hears what is not said. Silence is the room an honest word waits in.") against a **Quiet Crown whisperer**, veiled,
  public, unhurried ("Silence is what you call it when you are the one not telling. Your council is silent. The
  Throne is silent. One hand would need no silence; it would simply say."). The built debate shape (listen, join,
  mediate, provoke; three rounds; scripture, reason, compassion): the ally is the **balance-keeper**, the opponent
  the whisperer. The whisperer never looks at Anissa, never names her, and is a street speaker, not a Husher (the
  Chapter 1 recruiter's precedent); the Hushers are on the marsh, and no line joins the two. The player may still
  argue the whisperer's side, which is the point of the question: Kirinoura's neutrality is exactly the silence he
  means, and the chapter answers him with the receipts.
- **Reason needs** one of *Balance and Silence*, *The Informants' Petition* or *Genzō's Ear* (`reasonNeeds`; the
  library is open all day). **Mediate** needs the built Influence 5 at Kuroshi (listen +1, books +1 each, K-2's +2:
  reachable by a reader). Rewards: the built `DEBATE_REWARDS`. A mediation's line from Haru, if he has joined (the
  corner stays open after the lantern hour): "Everything about us is written down. Nobody reads it. That is the
  Suzumori silence." Anissa's line after, the only judgement: "The quiet one wanted everybody to talk, Gigi. And the
  loud one wanted everybody quiet. I think they swapped."
- **The quest:** *Is silence virtue or concealment?*, required, done on joined or mediated. After the Harbor Turn the
  corner rewrites itself (Chapter 11's build). No faith is a cult.

### 7.4 Books, vendors and the board

- **The Lantern Library (9, `CAPITALS.md` 7):** *Genzō's Ear*, *Sayo's Network* (the code "lit, never written"; a
  reader has the maze's idea before the Echo), *The Informants' Petition* (the price, in the city's own words), *Balance
  and Silence*, *Silk, Tea and Secrets*, *The Burned Temple* (K-5's seed; the elder stands beside its box), *The
  Nightingale Floor* (S-KUR's lore, placed now), *Tea House Whispers* (gossip: "Gold has been flowing out of Ardencia
  to places no one should be funding": the clue said once as rumour before the ledger shows it), *The Suzumori Line*
  (Genzō, Sayo, Kaede, Haru). Reading one gives +1 Influence (Kuroshi) and 10 XP.
- **The Hall (4):** *The Neutrality Order* (readable at the file house door), *The Buyer's Mark* and *Ledger of
  Outflows* (the Fog Files, readable after beat 8 in the Journal and in the records room), *The Paper Fox's Receipts*
  (after beat 7).
- **Vendors (guide 8; one new glossary `japanese.json`, every entry `verified: false` for the Nov 18 check):** the
  tea house ("Irasshaimase!": rice ball heals 50, green tea 18 SP, miso broth 40 HP over 3 turns), the paper-maker
  ("Irasshaimase.": the paper charm, a consumable that shows one foe's next move for the battle, 120 gold; the silk
  mask, a charm, spd 4, def 2, level 20), the armourer ("Arigatou gozaimasu." on a sale: a short blade for Haru,
  level 20, atk 20, `blade`; lacquered armour, leather, level 20, def 12, hp 18, spd 2; the tier-16 cloak and shield
  from Ordvik for a player who skipped the furrier).
- **The contract board:** "deliver sealed letters without reading them" and "copy a file (Influence)" are
  post-release jobs; "find a lost cat in the fog" is a one-line Salkhi joke on the board ("The horse has seen it. The
  horse will not say.").
- **Anissa's nudges** (mystery quests, under 128 characters): "The clerk at the library keeps looking at Azzy, Gigi."
  / "The two on the middle bridge are arguing about not talking." / "The fishers' boy has a lantern and nothing to
  light it for." / "Someone's following us. He's bad at it. I think he knows."

---

## 8. The Echo puzzle: the fog maze, the screens and the spy map (SIG-KUR, design difficulty 5; honest 5)

The design (`PUZZLES.md`): the maze's posts lit in the Echo in a code (two white, one red: left; one white, two red:
right; three white: straight), read in the Echo and walked in the present; the file house's rotating screens where
turning one turns its neighbours, with Sayo's map showing the safe layout and one screen's loose peg fixed in the
Echo so the present grid solves in four turns; the map marking where the buyer's files are. Kept; the staging:

1. **The maze, Echo (the code):** swap at the gate zone; Sayo's three agents walk the first lane lighting its three
   posts (two white, one red) and say nothing; the Journal's note *Sayo's lanterns* fills in as each pattern is seen,
   with the three patterns and their meanings (the agents light all three patterns across the first lane's three
   posts and the junction's three, so the whole code is seen before they go dark: six posts, two patterns each
   side). `clue.lantern_code`. The gate zone is three tiles; nothing else in the maze is a zone, so the route is
   present-only (the design's "read in the Echo; walk it in the present").
2. **The maze, present (the route):** six junctions; at each, three posts light as the player reaches them (a step
   trigger per junction sets the posts' looks); the pattern tells the turn; the two wrong lanes lead into fog-return
   triggers. The route is fixed in data (left, straight, right, right, left, straight); a wrong turn costs about
   twenty steps and no HP. Honest difficulty 3: one idea read six times.
3. **The screens, Echo (the anchor):** the map wall zone in the file house; Sayo's scene (beat 6) ends on the loose
   screen (an Echo-era puzzle object at grid position (1, 1), the centre); using it sets `anchor.screen_peg`. The
   present grid reads it: the centre screen no longer turns.
4. **The screens, present (the grid):** a 3 x 3 grid of pivoting screens, each facing N, E, S or W; pushing one turns
   it and its orthogonal neighbours a quarter clockwise. The lanes are open when every screen faces north. Start
   state in data; with the centre pegged (fixed north), the solution is **north, east, east, south** (push the north
   screen, then the east, the east again, then the south), four pushes, as the design's hint says; without the peg
   the centre turns with every neighbour and the grid cycles (the cheats file checks the four pushes fail without
   the anchor). Every state is reachable from every state (the group is closed), so no push can strand the player.
   Honest difficulty 5: the first grid puzzle in the game, with the anchor as its key.
5. **The spy map (the story clue):** reading the map wall in the present with `clue.sayo_network` shows the Journal
   sketch with the north stack's floor stone marked; the stone is a readable object only after it (`story.spy_map_read`).
6. **Anissa's hints** (3 minutes stuck; `PUZZLES.md`'s wording): "The fog is the same now as it was then. But someone
   was talking through it." / "Watch the lanterns in the memory. Two white and a red means left." / "Peg the screen
   by the map in the memory, then turn the screens north, east, east, south."

Files: `puzzles/kuroshi_fogmaze/solution.json` and `cheats.json` (a route that turns right at the first junction; a
route that walks it without the Echo first, which works, so it is in the solution file as the *second* solution, not
a cheat: the posts light in the present whether or not the code was learned, and the Journal note is what the
player lacks, which is the honest design: the Echo teaches, the fog does not forbid); `puzzles/kuroshi_screens/`
(solution: the Echo scene, the peg, the four pushes; cheats: the four pushes without the peg; a fifth push). Both
replayed by `tests/puzzles.test.ts`. The grid needs one small engine piece (section 10).

**The minor (M-KUR-1, K-2):** the clerk's desk zone, the clerk's walk and line, the nine shelves with the one
readable row. Hints as `PUZZLES.md`. Difficulty 3. Files `puzzles/kuroshi_stacks/`.

**The minor (M-KUR-2, K-3):** the five posts with a three-way choice each; checked on the fifth. Hints as
`PUZZLES.md`. Difficulty 3. Present only; needs `clue.lantern_code` for the Journal note, not for the posts.

**The secret (S-KUR, after the release):** Lady Sayo's House is a closed door on the quarter; the Nightingale Key,
the floor-maker and the 5 x 5 singing floor are Chapter 7's post-release item. Nothing here makes it harder.

---

## 9. Haru and Kayla: how the companion joins and plays, and the family beat

### 9.1 Haru Suzumori

- **Who he is on the map:** Kaede's son, Sayo's grandson; "definitely not a spy" (approved); a tail who is bad at
  it on purpose (the shoes, the screen, the puddle: he wants to be seen by the right people, which is the family
  trade). He talks more than Bayarmaa and less than Samira; his lines are short, dry, and always one beat too
  honest. His warmth is for his grandmother's work, not his mother's order. One line to Anissa, no joke: at the maze
  gate, when she says she will count the lanterns, he gives her his own paper lantern, unlit: "Hold this. It makes
  you harder to lose." (She holds it for the rest of the chapter: a recolour, `story.anissa_lantern`.)
- **When he joins:** at the Hall at the lantern hour (beat 3), as a fighter, before the maze (`party.haru`); he
  leaves Kirinoura with the party at the petition (beat 9, `story.haru_left_kirinoura`). `STORY.md` says "Haru refuses
  the neutrality order and joins" after the Fox; this outline splits it (Claude's call, section 12): he refuses the
  order *before* the maze (that is the refusal: walking Sayo's way in) and leaves after. The player plays the Shadow
  agent through the Shadow agent's chapter, and the Fox's decoys are built around his Kagemimi.
- **His data entry** (`rpg.ts` `MEMBERS`, placed before Bayarmaa's), sim-checked at 18 (hp 137, atk 55, def 28,
  mag 26, spd 52: the fastest fighter in the party, lighter than Bayarmaa, with more SP): `{ id: 'haru', name:
  'Haru', role: 'Shadow agent', house: 'Suzumori', portrait: 'haru', era: 'present', class: 'warrior', joins: { flag:
  'party.haru' }, base: { hp: 44, sp: 22, atk: 11, def: 7, mag: 9, spd: 16 }, growth: { hp: 5, sp: 3, atk: 2, def: 1,
  mag: 1, spd: 2 }, start: { weapon: 'paper_knife', armor: 'grey_kimono' } }` (two new items at tier 16; his own, not
  shop stock: a short straight blade and a grey travelling kimono).
- **His skills** (COMBAT 9.5, in the engine's shapes): **Kagemimi** (SP 3, `reveal: true`, section 10: shows the
  target's next move above it for 3 turns and, on a decoy or the Fox, names the real one; fallback: `marked`);
  **Sasayaki Ha** (SP 6, power 110, `strip: true`, section 10: removes one good status from the foe (the Fox's
  decoy-protection is not a status, so this is for Inspired, Warded and Gilded); fallback: `weakened`, `bossChance
  0.5`); **Paper Smoke** (SP 5, `warded` on all allies for 2 turns: the design's "+15% evasion" has no evasion
  status, and a quarter less damage taken is the same idea in the engine's words); **Ayatsuri** (SP 14, `once`,
  `redirect: true`, section 10: the target's next action hits another foe; fallback: `stunned` with `bossChance
  0.5`, which is what "his next action is wasted" means in practice). Moves: **Quick Cut** (100), **Twin Cut** (two
  hits of 75 at random foes, cooldown 2), **Throat Cut** (150, cooldown 3). Battle look: a placeholder recolour of the
  walk sheet until art.
- **After this chapter:** Haru reads the Aldermoor ledger's code after the Harbor Turn (STORY 6.6); if Suzumori is
  the house the Crown buys, he stays and defies his house a second time (STORY 6.9, Chapter 11's build); Councillor
  Mibu (COMBAT 13.3) would be the retainer for neutrality, who is alive and unconvinced at the petition: the
  betrayer's seed, as Hrafn is Skarragol's.

### 9.2 Kayla (FAMILY.md, settled)

- **Who she is on the map:** Rahel's daughter by a man of the Asian continent; Rael's half-sister; Azzy's Titi Kayla;
  Aiyana's full sister (Aiyana is Chapter 8's engineer, and Kayla has one line about her: "My sister builds things
  that burn. I file things that don't."). Quiet, exact, a listener: she speaks in short true sentences and corrects
  people's words ("I did not say that. I said I do not know."). She folds paper cranes while she listens. She is the
  library's cipher clerk, not an NPC with a quest flag: her desk is where K-2 starts, where the Echo sits, and where
  the Fog Files are read.
- **The rule for her lines (the locked rule: Gianna cannot learn Rael is good until near the end):** Kayla knows
  Gianna and Anissa are Rael's daughters (Azzy wrote her); she says so once, in the library, without his name. She
  says nothing about the marriage, nothing about his work, and nothing about the ledger's destinations except that
  she does not hold the key. Her one clue-level line, the only time she speaks of him: "He writes to me twice a
  year. He never says anything. That is how I know he is still himself." It reads either way, which is the design's
  rule for every Rael clue. A content test checks no Kayla line contains "good", "innocent", "feeds" or "the
  arrows".
- **Her touch for Anissa (no joke):** while the files are read, Anissa stands at the desk's end; Kayla, without
  looking, pushes the finished crane across to her: "I fold when I listen. It keeps my hands from writing things down.
  You can have that one." (`story.anissa_crane`: a key item, *Titi Kayla's crane*, with one line of text.)
- **Placeholder look:** a clerk's grey with one inked cuff, black hair pinned with a brush; `kayla`. Art through
  `ART-PROMPTS.md` when the outline is approved. **Later:** FAMILY.md places her here only; she does not come to the
  Muster (Rahel, Patricia and Jordyn do). One line at the Hearing is possible if the owner wants every Titi there,
  which is Chapter 12's question, not this chapter's.

### 9.3 Salkhi in the fog

A flag-placed horse on the pier, the quarter and the marsh (not the maze, not the Hall): "This is soup." / outside
the library: "She reads. I have seen her. Nobody asked me what I thought of it." / at the marsh gate: "I will not go
into the reeds. The reeds go into me." / on the pier at the end: "At least it is not soup." Never in a node with an
Anissa line.

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **Haru as data** | fighters as data; the active-four rule | his `MemberDef` before Bayarmaa's, skills, moves, looks, two start items, the join flag | none needed | 0.2 |
| **The rotating grid** (`rotor` puzzle objects: a group, an orientation per object as a flag, a push turns self and orthogonal neighbours a quarter; an object with `pegged` (read from an anchor flag) does not turn; the group's `solved` flag when all face the target) | puzzle objects with `use`, flags with values, `if` conditions, anchors | one small object kind in `engine/game.ts` and the map tool (about 60 lines), looks per orientation, a unit test on the 3 x 3 group's closure | a row of three screens as dialogue branches (12 nodes), or the peg alone opens the lanes with the pushes as text | 0.3 |
| **Kagemimi's reveal** (`reveal: true` on `SkillDef`: the target's next move is shown above it for 3 turns; on a foe with `protects`-decoys, the real one is named and the decoys lose `protects`) | `tell` warnings, `protects`, `marked` | a `revealed` status (no stat change; the scene reads it to show the move) and the decoy clause | `marked` | 0.2 |
| **Sold Secrets** (`mirror: true` on `EnemyMove`: use the target's strongest damage skill, with the target's own stat, against them) | enemy moves with `magic`, `power`; the party's skill lists | one branch in the enemy's turn (about 30 lines) and a test | a 200-power `magic` blow every 2 (the sim's stand-in) | 0.15 |
| **Hushed** (`STATUS.hushed`: `skills: false` for 2 turns; Attack, Guard, Item still work) | the status table with per-status fields | one field read where a skill is chosen, one status, the menu greys skills | `weakened` | 0.1 |
| **Sasayaki Ha's strip** (`strip: true`: removes one good status from the target) and **Ayatsuri's redirect** (`redirect: true`, `once`: the target's next one-target action hits another foe) | statuses as a list on each fighter; `ally` moves | strip: 10 lines; redirect: a flag on the enemy read when it picks a target (about 25 lines) | `weakened`; `stunned` with `bossChance` | 0.15 |
| **The decoys** (`protects: 'paper_fox'` on three foes; `hire: 'paper_decoy'` from the reserve) | both built (Rivera; Qasim) | data; `HIRE_CAP` read as is | none | 0 |
| **The fog maze** (fog-return teleport triggers; posts whose looks change on a step trigger; the `above` fog layer) | triggers that set flags and move the party (doors); objects with looks by flag; the `above` layer | map data only; a door-like trigger that lands on the same map | none | 0.05 |
| **Two-era Echo scenes with walkers** (Sayo's agents through the screens; the lantern-lighters; the boats) | walkers, Echo-era NPCs and objects, `echo.*` flags | data | lines | 0 |
| **The sea voyages** (`skarragol_kuroshi` is Chapter 6's; `kuroshi_jwaladesh`) | `VoyageDef` | one `VoyageDef` | a card | 0.05 |
| **The ambush taper at 0.25 from level 15** (section 5; realm-wide, Chapter 6's dial retuned) | Chapter 6's `ENCOUNTER_XP_TAPER` if it landed | one number; `levelCurve.test.ts` re-asserted for Chapters 1 to 6 | marsh weights and grace | 0.05 |
| **One glossary** (Japanese) | `lang.ts`, `audit:lang` | one JSON file, every entry `verified: false` | none | 0.05 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 7), `MARKS` | `ACT7` in `quests.ts`; `'8'` in `MARKS` (Chapter 8's landing); the route to `@chapter7-end`; `?chapter=7` | none | 0.25 |

About **one and a half builder-days** of engine and wiring; the grid and the three battle fields are the only pieces
that are not data. Nothing here needs a stealth system, an Echo battle, a Yield step or region levels. The grid is
built first and replayed headless, as the fjord was.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **Haru Suzumori** | the companion (section 9.1) | a new member look: grey, a short blade, a paper lantern at the belt; a battle recolour | reads the Aldermoor code after the Harbor Turn; the betrayer-defies-his-house scene if Suzumori is bought |
| **Kayla** | the cipher clerk; Azzy's Titi; K-2; the files read (section 9.2) | clerk's grey, one inked cuff, a brush in her hair; `kayla` | FAMILY.md: here only |
| **Lady Kaede Suzumori** | the spymaster, Haru's mother; the ruler he defies; the neutrality order; the petition | grey and violet, a writing table, a brush; `kaede` | the Muster (an envoy or her son) |
| **The retainer for neutrality** ("Councillor Mibu", COMBAT's name) | the order's voice; the betrayer's seed | grey, a fan | Councillor Mibu, the Suzumori betrayer variant (Ch. 10 to 11) if Kuroshi's price is least paid |
| **The retainer for war** | against the order | grey, a sword | the fleet of informants at the Harbor |
| **The signal master** | messages; reads the letters; the gate | a lantern on a pole, a kite glyph on his sleeve | |
| **The keeper of files** | the seal; the price he took (he is not the Fox; he is the man who let him in) | grey, a key ring, hands empty at dawn | |
| **The Crown's observer** ("Mr. Ashdown", proposal) | the customer; countersigned the receipts; gone by dawn | Aldermoor violet, the Chapter 5 clerk's shape, a lacquer file-box | sent home; a line in Chapter 9's keep |
| **The Paper Fox** ("Broker Ōmura", proposal; "the broker" until approved) | the boss | a plain grey kimono, a paper fox mask at the belt, then worn; `paper_fox`; the decoys are the same sprite | kneeling at the dais if spared |
| **Lady Sayo Suzumori** (Echo) | Gen II; the network; the peg | grey, a brush, the Echo palette; her three agents (one look) | S-KUR's listening room after the release |
| **Sayo's clerk** (Echo) | M-KUR-1 | a young man at Kayla's desk, the Echo palette | |
| **The fishers' family** (a woman, a boy, the old fisher) | K-3 | plain indigo, a lantern | |
| **The Suzumori elder** | K-5's giver, placed, one line | very old, by *The Burned Temple* | K-5 after the release |
| **The balance-keeper**, the **whisperer** | the debate | the Chapter 4 Witness look in grey; a veil, no sigil shown | the post-Harbor corner |
| **The librarian**, three **vendors**, the **harbour-master**, the **gate guard**, two **lantern-lighters** | | | |
| **Fog Cutpurses**, **Hushers**, **Lantern Moths**, **Zealots**, **paper decoys** | the marsh, the stacks, the file house | cutpurse: a grey hood; Husher: the built zealot recoloured with a longer veil; moth: a pale 1 x 1 sprite; decoy: the Fox's sprite | Aldermoor reuses the Husher |
| **Young Patricio** (the player in the Echo; Caona and Benny as data, not drawn) | beat 6, K-2 | the Echo palette | |

Voices: Haru short and one beat too honest; Kayla exact, correcting; Kaede dry, final, warm once; the retainers in
their two registers; the observer in the Regent's courteous register ("respects Kirinoura's neutrality entirely");
the Fox courteous and a little proud of his trade ("I was paid to know less than I do"); Sayo practical and tired;
the fishers plain. No one in Kirinoura sounds like Ordvik: nobody shouts, and the horse is the only one who
complains.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**None.** I looked for one and did not find a decision here that changes the story's flow: the Fox is the design's
broker, the council lifts neutrality for the Crown and keeps it for the people (the alliance is made, as the design
says), Haru defies the order and leaves with the party, Kayla is where FAMILY.md put her and does what it says, the
files name the mark and not the buyer, the price is Influence 10, the road order is the owner's. The one place a
reviewer might expect a question is below first; if the second review disagrees with any of these, it becomes a
pop-up with the recommendation first and the build goes ahead on it.

The Claude's calls, each with its reason:

- **Kayla knows Gianna and Anissa are Rael's daughters, says so once without his name, and says nothing about the
  marriage or his work** (section 9.2). *Reason:* she is his half-sister and a listener in a city of informants, and
  Azzy writes to her; a Titi who did not know would be a lie the story would have to keep; what she must not do is
  tell Gianna he is good, and her lines are tested for it. The near-miss for a question is here: her "He never says
  anything. That is how I know he is still himself" is a clue at the level of Elodie's two lines, not a reveal. If the
  owner wants Kayla to know nothing of the girls, the library scene loses one line and nothing else moves.
- **Haru joins as a fighter at the lantern hour, before the maze, and leaves Kirinoura after the petition** (section
  9.1), splitting `STORY.md`'s "refuses the order and joins". *Reason:* the player must play the Shadow agent in his
  chapter, the Fox's decoys are built around Kagemimi, and the refusal *is* walking Sayo's way in. The chapter's end is
  the same.
- **The sealed stacks, the spy ledger and K-2 are in the Lantern Library, where Kayla works, not in the Hall's file
  house** (section 1). *Reason:* the file house is sealed until the maze, so a day quest cannot be inside it; FAMILY.md
  says "the archive"; and the Echo at her desk with Sayo's clerk at the same desk is the scene.
- **K-1's three sightings are main-story beats; the quest follows after the release; K-5's elder and K-4's door are
  placed; K-2 and K-3 are the required two** (section 7).
- **K-3 is on the route** (the lit posts show the causeway to the back door). *Reason:* the lantern code is used
  twice as the design asks, and a required quest that is the way in is not an errand.
- **The Fox's decoys are `protects` foes torn by area moves or a Surge, and Fold re-folds them from the reserve;
  Kagemimi names the real one** (section 5). *Reason:* COMBAT's "hides among three paper decoys (Haru's Kagemimi or
  Lantern shows the real one)" in the engine's existing words; the paper charm is the Lantern.
- **Sold Secrets is a mirror of the target's own best skill** (section 10), with the sim's stand-in as fallback.
  *Reason:* COMBAT's phase 2, and the only pressure the fight has.
- **The Fox at hp x12, atk x1.8 on the skirmisher line** (section 5). *Reason:* the sim; COMBAT's 7 / 1.0 is a
  pushover against four fighters at 18.
- **The Crown's observer is gone by dawn, not unmasked; the keeper of files is the man who took the price, not the
  Fox.** *Reason:* the Regent stays three moves ahead, as in Chapters 5 and 6; the receipts are the proof, read
  aloud, not a confession; nothing Chapter 9 needs is spent.
- **The buyer's list names the four houses with the marked name cut out** (beat 8). *Reason:* the guide's "names the
  buyer's mark but not the buyer" shown as an object; the betrayer is still decided by the least-paid price at the
  Muster, and the mark (a closed hand) is the Quiet Crown's, which the guide says the betrayer belongs to.
- **The ledger's cipher is one Kayla does not hold** ("the Alcázar cut it after I left"). *Reason:* STORY 6.6 (the
  code is read by Haru after the Harbor Turn); a cipher clerk who could read it would end the game in Chapter 7.
- **No Echo battle; Sayo's network is a listening scene** (section 4).
- **The price scene reads Kuroshi's Influence and pays the receipts, the letter, the petition and Samira's offer**
  (beat 9); `ally.kuroshi` is set regardless, with the Journal's count. *Reason:* the Chapter 3 and 6 pattern; the
  betrayal's rule stated the same way twice.
- **Side-quest and fight XP at the built curve's scale (100 / 100 / 100 for the Fox), and the taper tightened to 0.25
  from 15** (section 5), realm-wide. *Reason:* the numbers; the simulator decides on day 1.
- **Six maps: the pier split out, the maze its own map, Sayo's House a closed door** (section 3).
- **The Hall of Screens is 36 x 26** (the seat paragraph's size), as Chapters 5 and 6 chose.
- **Kaede is clean; the retainer for neutrality (Mibu) is the betrayer's seed.** *Reason:* "defies the order" is the
  guide's; a corrupt mother would make it a family tragedy with no room, and COMBAT already names Councillor Mibu.
- **Names are proposals** (Kaede, Haru, Sayo, Genzō from the design; Ashdown, Ōmura, Mibu's placement new), people
  named by role in the build until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapter 6's estimate (760 steps,
about 30 minutes):

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the pier, the first sighting, up into the quarter | ~90 | 2 | ~20 | |
| The quarter: the observer, the second sighting, the signal master, the fishers | ~70 | 0 | ~25 | |
| K-2: the library, Kayla, the stacks (both eras), the ledger | ~140 | 3 | ~45 | 0 to 1 (the stacks) |
| The debate on the middle bridge, the books | ~50 | 2 | ~30 | |
| The Hall: the letter, the order, the retainers, Haru | ~60 | 2 | ~40 | |
| The maze (both eras) | ~130 | 2 | ~15 | |
| The marsh: the fishers, the posts, the press, the back door | ~120 | 1 | ~25 | the moths, 0 to 1 ambush |
| The file house: Sayo's room, the peg, the grid, the map, the Fox | ~60 | 1 | ~40 | the boss |
| The files read, the petition, the token, the pier, the card | ~110 | 4 | ~45 | |
| **Chapter 7** | **~830** | **17** | **~285** | 2 to 4 |

About **30 to 33 minutes**, the plan's number, with the library's nine books and the armourer on top. The main line
alone (the gate holds, so a player cannot) is about 17 minutes.

---

## 14. Continuity into Chapter 8 (Jwaladesh, The Dying Flame; the third road, 19 to 21)

- **The lead:** the Suzumori crane (`item.token_suzumori`) that Agnipur "will not take"; Kaede's lines that the
  Crown is holding Jwaladesh's oil and that the priests were written down as *the ash*; the burned temple (K-5's
  seed: the elder is alive and sorry; the apology letter is K-5's, after the release, so Chapter 8's feud scene must
  not depend on it). The voyage `kuroshi_jwaladesh` west along the south coast from (66, 106) to Agnipur at (37, 91).
  `?chapter=8` starts where Chapter 8's outline puts the landing (Agnipur's salt-flat road or its river gate).
- **The party leaves with:** Gianna, Yari, Azzy, Samira, Bayarmaa, **Haru**, Anissa (seven, six fighters, four
  active; Haru active by `MEMBERS` order unless the player changed it); Salkhi; **level 19** by the tool (5,085 to
  5,215), about 20 to 21 as played unless the taper is tightened (section 5: Chapter 8 must plan for 20 by the tool
  and 21 played at its start); the Echo party unchanged; gold about 1,600 to 2,400 less the armourer; key items plus
  the Ironvow and Suzumori tokens, **the Fog Files** (`item.fog_files`: Chapter 10's exposed route reads this and
  `clue.buyers_mark`), the receipts, Titi Kayla's crane; flags `story.kuroshi_arrived`, `party.haru`,
  `story.haru_left_kirinoura`, `ally.kuroshi` with Kuroshi's Influence 6 to 16, `clue.lantern_code`, `clue.shelf_mark`,
  `clue.sayo_network`, `clue.fox_receipts`, **`clue.buyers_mark`**, **`clue.ardencia_outflows`** (Rael clue 3),
  `lore.kuroshi_spy_ledger` (the Ash Wars account 2 of 4: the four-accounts count is now two if Chapter 1's temple
  record was read), `choice.patricio_sayo`, `choice.fox_spared|broken`, `choice.samira_names`, `side.spy_ledger.done`,
  `side.lanterns.done` (the thumbprint count up one), the debate's outcome, `act7.complete`.
- **What Gianna believes:** unchanged, and harder: the ledger of outflows is the first thing she has seen in her
  father's hand, and it is gold leaving Ardencia in cipher. The player holds clues 1, 2, 3 and 4, the arrows, and the
  "nobody dies" pattern grown by one (the Fox withdrew). Kayla's "still himself" is the chapter's one line the other
  way.
- **What the realm knows:** the Crown pays a thief so a council can sell (Chapter 6), buys a city's files so its
  neutrality is a fiction (Chapter 7), and, next, holds a faith's oil so its treasury empties (Chapter 8): the same
  hand three ways. One of four houses has a closed hand beside its name. Mibu and Hrafn are alive and unconvinced.
- **Aiyana** (FAMILY.md, settled) is Chapter 8's engineer; Kayla's one line about her ("builds things that burn") is
  the family's hand-off, and Azzy has met two Titis in two chapters, so Chapter 8's bump-in can be his line first,
  shorter.
- **The Husher** is built here and reused by Aldermoor's tier; the `hushed` status, if built, is the Hushed's (Chapter
  9's boss) too.
- **Nothing built in Chapters 3 to 6 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`fog_marsh`), `MEMBERS` (Haru's entry before Bayarmaa's), the voyages, the taper's number, and the three battle
  fields (`reveal`, `mirror`, `hushed`), each behind a test that Chapters 2 to 6's fights replay unchanged.

---

## 15. Risks

- **The level curve, again, and now compounding.** The Chapter 6 outline showed a real player over-levelling by two
  or three per road chapter; this chapter inherits a played start of about 18 against a tool start of 17 and leaves
  at 20 to 21 played against 19. Chapter 8 would then start a tier high and its boss would be grey. The taper's
  number is the central session's call on day 1, and it must be checked against Chapters 1 to 6 before this
  chapter's data is set, or it is tuned twice. If the owner would rather keep ambushes rich, the alternative is a
  bigger tier (Kuroshi 17 to 20) and Chapter 8 re-based, which is a plan change, not a chapter one.
- **The rotating grid is the chapter's one real engine piece and the first grid puzzle in the game.** Build it first,
  replay `puzzles/kuroshi_screens/solution.json` headless, and only then draw the file house around it. The fallback
  (the peg opens the lanes; the pushes are text) keeps the Echo and the anchor and loses the puzzle; it must not be
  the release if there is a day to spare.
- **Sold Secrets as a mirror is the fight's only pressure.** The sim's stand-in never downs anyone; if the mirror is
  not built, the Fox is a long fight with no danger, and x12 should drop to x10 so it is at least short.
- **Who fights.** If Haru is not active by default, the Fox's decoys are a puzzle with no key (the paper charm is the
  only other reveal). Day 1, section 4.
- **Sayo's war room is the chapter's heart and is easy to make a cutscene.** Every slip is an agent who walks in and
  out; every pin is an object placed by a flag; the peg is a thing Patricio does. If the build runs short, the agents
  keep their walks and the map's pins are cut to three.
- **Kayla's lines are the chapter's tightrope.** One wrong sentence tells Gianna her father is good three chapters
  early. The content test (section 9.2) is the guard; the reviewer should read every Kayla line against the locked
  rule.
- **Anissa in the fog.** She holds the door at the maze gate; she follows across the marsh with Haru's lantern; the
  Hushers' Seize goes at Gianna (the built move); the whisperer at the corner never looks at her; nothing in the Hall
  targets her. The two touches of her are Haru's lantern and Kayla's crane, neither a joke.
- **Tone.** Haru's "definitely not a spy" is said three times in the chapter (the Hall, the petition, and once in the
  maze: "This is not spying. This is walking.") and no more; Salkhi stays outdoors; Samira's pricing stops at the
  dais, where it becomes an offer. No jokes in Sayo's room, at the files, or at the petition's "the Crown was not".
  The Quiet Crown's whisperer is reasonable and public; the Hushers are not him.
- **The Crown's hand stays the Regent's, not the Hushed's.** The receipts are countersigned by the Throne's observer;
  the mark on the buyer's list is the Quiet Crown's; Kayla says the second thing and nobody joins them. That join is
  Chapter 9's.
- **Languages.** Three vendor greetings and a few words (*Kirinoura*, *Kagemimi*, *Sasayaki Ha*, *Ayatsuri*, the
  board game's own) in Japanese, every one `verified: false` for the Nov 18 check, and the Opus review's ask for a
  fluent reader as this outline is approved.
- **Names.** Every new name is a proposal; the build names people by role; the owner's yes on Kaede, Haru and Sayo
  (all from the design) is the only one that matters for the dialogue's shape.
- **Chapter 6 may land late, and its review may change its end.** Everything here except the voyage's start and
  Torvald's letter can be built from the Chapter 6 outline's section 14 state before Chapter 6 is done; `?chapter=7`
  needs Chapter 6's route; until then the chapter is tested from a hand-written start save with section 1's state.
  If the Chapter 6 review moves Bayarmaa's join or the taper, section 1 and section 5 move with it and nothing else.

---

## 16. Build plan (small steps, each checked before the next; sized to two and a half builder-days, about Oct 30 to Nov 2)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 7 rewritten to this outline
   (Haru's split join, Kayla, the stacks in the library, the files as objects), `CAPITALS.md` 7 re-sized (six maps,
   the pier, the maze, the Hall at 36 x 26, the stacks moved), `SIDE-QUESTS.md` K-2 and K-3 marked for the release
   with the new numbers and K-1, K-4, K-5 after, `PUZZLES.md` SIG-KUR's staging and the grid's rule, `COMBAT.md` 9.5
   with Haru's stat line and 13.3 with the Fox's scaling and decoys, `FAMILY.md` Kayla's row marked built, Haru's,
   Kayla's, Kaede's and the Fox's prompts into `ART-PROMPTS.md`. **The taper's number decided** by the simulator on
   Chapters 1 to 6's routes.
2. **Engine and data (Opus, half a day):** Haru as data (entry before Bayarmaa's, skills, moves, looks, two items),
   the `rotor` object kind, `reveal`, `mirror`, `hushed`, `strip` and `redirect` (each a few lines, each with a unit
   test; `fighters.test.ts` grows by one; `battle.test.ts` re-asserts Chapters 2 to 6's fights), the glossary, the
   voyage.
3. **Maps (Sonnet, the rest of the day), the file house first:** `tools/maps/kuroshi.ts` with the six maps of
   section 3; the file house's grid replayed headless by a draft `puzzles/kuroshi_screens/solution.json` before the
   rest of the Hall is drawn; then the maze with its six junctions and `puzzles/kuroshi_fogmaze/`; the library's
   zone and the stacks' lane and trigger strip; the marsh's posts, causeways and ambush layer; the quarter's dusk
   and dawn variants and the closed door of Sayo's House; validated; the city entry in `CITIES`.
4. **Content (Haiku and Sonnet, in parallel):** thirteen books (the spy ledger's text written against Chapter 1's
   temple record so the contradiction is real), the `fog_marsh` table and `kuroshi_story` groups, the six enemies
   and the Fox with his phases, the vendors and the five items, the looks (section 11), the speakers, the audio
   slots (a screen sliding, a lantern lit, paper tearing, the fog's silence; the quarter plays the farewell track
   until Kirinoura has its own).

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/kuroshi.ts` staged from the beats, in this order
   so an interruption leaves a playable chapter: the pier and the first sighting; the quarter, the observer, the
   signal master; the Hall, the order, Haru (joins); the maze's Echo and route; the marsh and the back door; Sayo's
   room, the peg, the grid, the map; the Fox and the Yield; the files with Kayla; the petition and the token; the
   pier and the card. `ACT7` in `quests.ts` with hints and goals; the Journal notes (*Sayo's lanterns*, *Sayo's map*,
   *The buyer's mark*, *Gold out of Ardencia*, *The Suzumori network*, *Kayla*, *The marsh press*).
6. **The quests (early afternoon):** K-2 (Kayla's bump-in with Azzy, the stacks, the Echo clerk, the shelf, the
   ledger), K-3 (the fishers, the posts, the moths, the press), the debate *Is silence virtue or concealment?* (two
   speakers, three rounds, the Reason books).
7. **The puzzle files and tests (late afternoon):** `puzzles/kuroshi_fogmaze/`, `puzzles/kuroshi_screens/`,
   `puzzles/kuroshi_stacks/`; a `file_house_fox` bot test on seeds at 17, 18 and 19 with the real Sold Secrets (the
   scratch sim's bot moved into `tests/`); quests, guide, debate, side-quest, maps, stage and content tests green; the
   content tests: no Salkhi line in a node with an Anissa line; no Kayla line with "good", "innocent", "feeds" or
   "the arrows"; no line joining "Crown" or "Regent" to "glows" or "little one"; "definitely not a spy" at most
   three times.
8. **The route (evening):** Chapter 7's route from its chapter start to `@chapter7-end`; `chapter-starts.ts` with
   chapter 8; `act.test.ts`; `tools/level-curve.ts` run and the XP dials set (section 5); the smoke test's Chapter 7
   section with screenshots of the puddle, the observer crossing the bridge, Azzy at Kayla's desk, the Echo clerk,
   the maze in both eras, the boats coming home, Sayo's room with the pins, the grid before and after, the three
   Foxes, the buyer's list with the cut name, the crane at the dais, at 844 x 390 and 390 x 844.

**Day 3 (morning):**
9. **Full browser test:** the chapter end to end on a phone; Game Over on a marsh ambush (back to the maze's gap) and
   on the Fox (back to the north stack's trigger); a save in the maze and in the file house; `npm test`, typecheck,
   lint, build; the reviewer prompt in `reviews/reviewer-prompts/` (the Chapters 6 to 9 batch, about Nov 9); then
   Chapter 8's outline, which overlaps with this build from day 2.

**If day 2 runs over, cut in this order:** the pier map (the landing on the quarter's south edge; the launch drawn
there), the dusk and dawn variants (lines), the library's books from nine to five (*Sayo's Network*, *The Informants'
Petition*, *Balance and Silence*, *Tea House Whispers*, *The Burned Temple*), the stacks' cutpurse fight (the lane
only), Ayatsuri and Sasayaki Ha's engine pieces (their fallbacks), Samira's offer at the dais. Never cut: Haru active
in battle, the maze in both eras, Sayo's room staged with the peg, the grid solved by the anchor, the Fox's decoys
with Kagemimi, the files read with Kayla and the cut name, the petition with the token, the two required quests and
the debate.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Dec 1 story questions, now needed by early November (the Gen III rulers each companion defies:
Kaede is this chapter's); the fluent-speaker check (Wed Nov 18: this chapter adds Japanese, a few words).
