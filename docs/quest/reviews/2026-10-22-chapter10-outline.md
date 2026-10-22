# Chapter 10, The Muster (Pòdlimyè, Zetwal again): build outline (Oct 22)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: none required; two
near-misses named); everything else is Claude's call with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (Chapter 10
Nov 8 to 10, **10 minutes plus side content, levels 24 to 25**; the Opus plan review's minimum for Chapter 10: **the
armies arrive on the map, three mediations, the betrayal (and the exposed route), the fleet sails**; "Anicette's Ash
Wars talk, Muskets in the Cane" after the release; the plan's rule that every chapter keeps its Echo puzzle, the
debate as a required quest and two required side quests), `design/STORY.md` Chapter 10 (the armies on the plaza and
the Cane Road; old Patricio inspects them with his whistle; three mediations; Anicette's fourth account; the
betrayal by the least-paid price with the exposed route; the fleet sails; the Echo: the plaza on the morning of the
signing; no boss; the Cane Road's encounters at 22 to 25), 4 (the threads: the four Ash Wars accounts pay a Concord
bonus and a Hearing line; *Anissa finds her voice*: "she speaks at the Muster (Ch. 10, proposal)"), 5 (tone), 6.9 (the
betrayer's companion stays and defies their house a second time), 6.13's Oct 22 note (Patricio sealed six pages and
signed nothing: "The payoff is Chapter 10's, at Pòdlimyè"), `design/FAMILY.md` (settled: **Rahel**, formidable, warm
with grandchildren, arrives with Jordyn's company, a scene with Gianna and Anissa, a line for Azzy; **Patricia**,
sharp-eyed, unhurried, the family's memory, comes with Rahel and blesses the three great-grandchildren before the
war; **Joaquin** brings Free Brasador to the Muster; Jordyn leads a company in Chapter 11), `design/CAPITALS.md` 1
(Pòdlimyè's built maps; the baker's tier-24 gear and the contract board "for the Muster"; the Cane Road's return
table; the Echo "in Chapter 10 the plaza on the morning of the signing"), `design/SIDE-QUESTS.md` Z-3 ("fits the
return in Chapter 10") and Z-6 (Muskets in the Cane: the smugglers' crew, the ledger "for the Muster's friends", the
powder cellar's anchor), `design/PUZZLES.md` M-ZET-2 (the powder cellar, difficulty 2), `design/SECRET-ITEMS.md` 1 (the
Quill's Chapter 10 bonus: after the release), `design/COMBAT.md` 6 (**the levels pass as built**: the one ambush rule
`AMBUSH_XP`, `XP_PER_OBJECTIVE_BY_CHAPTER = [15, 25, 30, 35, 40]` with "a later chapter pays the last entry until its
own row is added", the played line and its assertions), 11 (armies and volleys: `ARMY_VOLLEY_PER = 10`), 13.2 (the
Cane Road's return: Road Bandit 22 to 24, Smuggler 22 to 25, Lookout 22 to 24, Zealot 22 to 25, Husher 23 to 25,
Mangrove Crab 22 to 24) and 13.3 #8 (the four betrayer variants: Admiral Rashid, Chief Hrafn, Councillor Mibu, Steward
Prakash; "skipped if turned at the Muster"), `QUEST-BUILD-GUIDE.md` 5.4 (the feuds: Dorini against Ironvow, Suzumori
against Agnivansh, "Stillwater dissidents are the Crown's own people"), 5.5 (Act IV), 5.6 (the betrayal: the least paid
of Al-Doria, Skarragol, Kuroshi and Jwaladesh, ties to Dorini; the exposed route with the Kuroshi evidence and 60
percent paid; a replay can force another house), 6.3 (prices; "any other currency counts at half value"; overpaying
adds reinforcements), 7.2 (Concord; debates rotate after the Muster); the **Chapter 9 outline and its review and
decisions** (section 14: who arrives from Kingsmere; the review's fixes taken: Anissa through the postern, Sebastian
Jean-Philippe, the dissidents' price can be short (floor 5), Jordyn's evidence returned by the book, "Not today"; the
owner's yes: the Almoner is Chapter 1's veiled woman, placed `!story.hushed_beaten`); the **Chapter 3, 6, 7 and 8
outlines** (every price scene, token and betrayer seed, gathered in section 7.0); the **Chapter 5 outline** (Se-5's
chamberlain holds the tokens; Elodie stays at the Parley "till the Crown lets her go"); the **Chapter 7 and 8
reviews** (the four price ranges to be set side by side; the token rule; the buyer's mark names no house); and the
built game at commit e25a6d6 (Chapters 1 to 5 built on this branch: `tools/maps/zetwal-*.ts` (ten maps), `data/dialogue/zetwal.ts`
(2,242 lines: the return scene `zetwal_return`, the whistle, the cane cutter's `danger` node, the road watcher, the
smugglers' crates, the mill's "fresh ashes", the lookout keeper's signal fire, the council's two elders, the Crown's
consul, Anicette's "Forty. And three hundred sent home"), `data/encounters.ts` (`cane_road` **at levels 6, 7 and 9**,
switched on by `story.zetwal_return`), `data/voyages.ts` (Pòdlimyè's sea point is **(119, 37)**), `data/rpg.ts`
(`marshal_whistle`: "it matters again in Chapter 10, when he musters Zetwal with it"; `army.<group>` flags read by
`armies()`; no ally prices), `engine/debate.ts` (`opensIf`, `mediate` at `DEBATE_MEDIATE_INFLUENCE` 5 in the city,
`settled`), `engine/rpg.ts` (`pillar.<p>.<city>`, `army.<group>`), `engine/stage.ts`, `config.ts` (`LEVELS` 50 / 1.6;
`AMBUSH_XP`; no `ALLY_PRICES`, no `ARMIES`)). Levels use the game's curve: 23 at 7,028, **24 at 7,546**, **25 at
8,078**, 26 at 8,623 (so this chapter's level is 532 XP wide).*

**Sim-check.** The fights below were simulated with a scratch script outside the repo against the Chapter 6
outline's snapshot of commit 889ed60 (the same engine Chapters 6 to 9 were checked on):
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch10sim/muster-sim.ts` (Bayarmaa, Haru,
Vikram and Edmund as the Chapter 6 to 9 outlines' entries, the Cane Road's enemies re-levelled from the built shapes,
Z-6's crew chief as data in memory; each fight 30 seeds with the Chapter 9 review's bot, on the built Story
difficulty; **falls counted party-wide**, the Chapter 8 review's fix, from the first run). Numbers in section 5. Its
finding shapes the chapter's one scripted fight: the crew's lookouts and smuggler are decoys without `protects`
(the Chapter 7 to 9 reviews' finding, again), so they get it.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17): the armies walk
in, the grandmothers walk up the pier, the betrayer walks down to the harbor, the fleet sails; Anissa is never hit,
never a target, never a combatant and never jokes; the comedy (Salkhi finding grass at last, Samira pricing a muster,
Vikram out of breath on the Chain Bridge, Edmund's one "terribly sorry") stays away from her; recommendations only
where they genuinely help; placeholders wherever art has not arrived; this chapter gets the main story (the armies,
the council, the family, the inspection, the betrayal and the exposed route, the fleet), the Echo scene and the Echo
puzzle (M-ZET-2), no boss, the three mediations as the required debate, **two** required side quests, mystery quests
and arrows, Game Over, and nothing else until after the release.

---

## 1. Where the chapter starts (measured against the Chapter 9 outline, section 14, and its review)

- **Chapter 9 ends** on the Mere Stair at dawn: Jordyn's company goes up the moor road ("A company walks... We'll be at
  your Muster... And I'll bring Mother. And her mother."); Sebastian stays for his Eightgate recital and will come to
  Pòdlimyè "to hear the drums"; Jordyn returns the three court papers by the book; the Regent's "Not today"; the sea
  voyage `aldermoor_zetwal` home. The card *Chapter 9 complete, The Regent's Keep. Next: Chapter 10, The Muster*
  (`act9.complete`). `?chapter=10` starts on **Pòdlimyè's long pier** (`zetwal-harbor`, the built spawn
  `harbor_return` at (30, 13), where Chapter 2's return landed and Chapter 3 sailed from).
- **The party on the route:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram, **Edmund**, Anissa (nine, eight
  fighters, four active by `party.active`: the Chapter 9 order Gianna, Yari, Azzy, Edmund unless the player changed
  it); Salkhi as a flag-placed horse on outdoor maps; **level 24 by the plan** (`CHAPTER_LEVELS` 9 `to: 24`; the
  Chapter 9 review re-planned it from 21 to land on 24 at the median, 24 to 25 for a wanderer). Section 5 plans from
  24 and shows 25. Echo party: Patricio, Caona, Benny. Gold about 2,500 to 3,500 less Kingsmere's outfitter.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's half-sheet, the Dorini pass, the Brasador
  coin, the **Marshal's whistle** (`item.marshal_whistle`, Chapter 1: "My whistle, from the year of the Accord. Every
  company in Zetwal knew its note... One day Zetwal may need to hear it again."), the Ironvow braid, the Suzumori
  crane, the Agnivansh lamp (Se-5's three tokens), the Fog Files, the Fox's receipts, Dhanraj's ledger, **the Crown's
  pact**, **the Ash Road Accounts**, **Thomas Stillwater's True Record**, the Crown Chronicle, the purge list, Kayla's
  crane, Aiyana's mirror, Edmund's hat, the recital bill, the Almoner's brooch, Yari's petition if any copy is left.
- **Flags that matter here:** `ally.free_brasador` (Chapter 3: "Fear 6, owed, paid at the Muster"; no count), the
  three road alliances with their city pillars (`ally.skarragol` and `pillar.wealth.skarragol`, `ally.kuroshi` and
  `pillar.influence.kuroshi`, `ally.jwaladesh` and `pillar.wealth.jwaladesh`), `ally.aldermoor_dissidents` and
  `pillar.fear.aldermoor`, `pillar.influence.al_doria` (Chapter 4 recorded no scene and no `ally.*` flag: section
  7.0), `clue.buyers_mark` (the Kuroshi evidence, on every save: Chapter 7's beat 8 is main story), `clue.ratification`,
  `clue.first_revisiting`, `clue.crown_pact`, `anchor.thomas_record`, `story.record_read`, `story.hushed_beaten`
  (the Cane Road's veiled woman is gone: her placement is `!story.hushed_beaten`), `choice.warned_watcher` and
  `story.watcher_met`, `side.seats.stage1` (the chamberlain holds three tokens), `lore.zetwal_ash_wars_temple`,
  `side.overdue.done` (Anicette's Volume Two, read or not: `lore.zetwal_ash_wars_gossip_2` or whatever the built Tales
  shelf flag is), K-2's spy ledger and Al-2's chronicle (both required in their chapters: `side.spy_ledger.done`,
  `side.crown_chronicle.done`), `story.zetwal_return` (set at Chapter 2's end: the built `cane_road` layer is already
  on), `story.ardencia_asked`, the four `choice.*_spared|broken` (Grimvald, the Fox, Dhanraj, the Hushed:
  `choice.hushed_tried|broken`), `choice.crown_purse_given`, `choice.jarl_paid`, `choice.advances_given`,
  `choice.samira_names`, the debates' outcomes, `party.*` for all eight.
- **What the realm said about this Muster before now:** Patricio (Chapter 1, the dock): "Keep it close. One day Zetwal
  may need to hear it again." Patricio (Chapter 2's end): "Because there was no seventh clause when we swore. I would
  remember. I signed under Caona's name." The Free Brasador sergeant (Chapter 4's dawn): "Come back with an army, or
  do not come back." Azzy: "With an army." Torvald (6), Kaede (7), Meera (8): the price, "a house whose price is
  least paid is the one the Crown can still buy", three times in the same words. Kayla (7): the buyer's list with one
  name cut out. Jordyn (9): "We'll be at your Muster." The Regent (9): "The fleet sails after it." The lookout keeper
  (Chapter 1, Solèy Heights, built): "I keep the old signal fire ready. Nobody has asked me to light it. Yet." The
  Harbor councillor (Chapter 1, the Hall, built): "I asked the council to raise the old harbor chain. They called me a
  warmonger." The Speaker: "Half want peace at any price, half want the old harbor chain raised."
- **What Gianna believes:** her father sold Xaraguá and them, for a chair, and spent the gold where nobody can read.
  The player holds Rael clues 1 to 4, the "arrows missed" whisper, Kayla's "still himself", Aiyana's rod, Jordyn's
  "Keep the law", Sebastian's weather, the "nobody dies" pattern (four withdrew; the Hushed was taken), the eighth
  thumbprint with "Warn them first" inside the cult's own cells. **This chapter gives no new Rael clue** (STORY 4
  assigns none to it) and must not: Rahel is his mother and Patricia his grandmother, and each has exactly one line
  that reads either way (section 9). It gives the fourth Ash Wars account's reading (Anicette), the Marshal's own
  answer about the seventh page, and the betrayer.
- **Chapter 10's target is 24 to 25** (`chapterLevels.ts`, already there: `{ chapter: 10, place: 'Zetwal again', from:
  24, to: 25 }`). No boss. The Cane Road's return tier is 24 to 25 (section 5); the smith stocks tier-24 pieces for a
  player who skipped Kingsmere's.
- **Stale lines in the design and the outlines, fixed here:**
  - `CAPITALS.md` 1 and the Chapter 9 outline say the built `cane_road` table is "22 to 25". **It is 6, 7 and 9**
    (`encounters.ts`: bandits 6, smugglers 7, zealots 9), levelled for the Chapter 2 end / Chapter 3 start return at
    level 8, and the Chapter 3 start save has `story.zetwal_return` on. Chapter 10 adds a second table,
    `cane_road_muster` (24 to 25), on a second encounters layer with `if: 'story.muster_begun'`, and the built
    layer's condition becomes `story.zetwal_return, !story.muster_begun` (one line in `zetwal-road.ts`; section 10).
  - The Chapter 9 outline's voyage "22, 62 to 91, 37" uses the board's capital dots; the built voyages use sea
    points (Pòdlimyè's is **(119, 37)**, east of the reef, in all three built Zetwal voyages). Chapter 9's build sets
    `aldermoor_zetwal` from Kingsmere's sea at about (12, 62) south along the open sea west of Jwaladesh, east along
    the realm's southern edge (y 127 is clear water) and north to (119, 37), with Chapter 9's captions; it needs the
    `shore: 'aldermoor'` the Chapter 8 review costed.
  - The Quiet Crown's two recruiters on the plaza are placed with no condition (`zetwal-town.ts`); in Chapter 10 they
    get a Chapter 10 branch, not a removal (section 2, beat 1: the cells are leaderless, not gone).
  - `CAPITALS.md` 1 gives the baker "tier-24 gear brought in for the Muster"; Z-5 and the bakery are not built, so the
    **Harbor forge** (the built smith) stocks it.
  - `SIDE-QUESTS.md` Z-6's 380 XP and 600 gold are the design's road-tier numbers; section 5 scales them to the
    built curve (a 10-minute chapter one level wide). Z-3's veiled woman at the mill fell in Kingsmere; section 7.2
    rewrites Z-3 around her absence, which is better.
  - `SECRET-ITEMS.md` 1's Chapter 10 bonus (Yari sees the Yaguana name on the seventh stone, +2 Influence in Xaraguá)
    is after the release with the Quill.
  - `STORY.md` Chapter 10 beat 1 says the whistle "calls the Free Brasador to order"; the built item text says Patricio
    "musters Zetwal with it", and Gianna holds it. Section 2, beat 7 does both: she gives it back on the pier, he
    musters Zetwal with it, and Free Brasador learn the note.
  - `STORY.md` has Elodie as "Zetwal's envoy" at Eightgate and the Chapter 5 outline keeps her there "till the Crown
    lets her go": **she is not in Pòdlimyè for the Muster**. The Chancellor governs (built, Chapter 1) and Patricio
    musters. The chapter says so once (beat 0) and the Journal's note keeps it.
  - `COMBAT.md` 6's targets table says "Ch. 10 at 25": kept. `XP_PER_OBJECTIVE_BY_CHAPTER` has no row for 10: section
    5 recommends a row of 40 (the last entry held), not the formula's 65.
  - The guide's "Fear and Influence are your running scores" (realm-wide) against the Chapter 6 to 9 outlines' "Yours
    here: N" (the city's pillar): section 7.0 settles which the Muster reads (Claude's call), because this is the
    chapter that reads them.

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 9 outlines. Flags are proposals in the built naming style. "Shown"
means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`). The
chapter is one day and one night in a city the player already knows, so every place is a reused map with a Chapter 10
variant (flag-placed camps, ships, banners, people) and the arrow walks the city the short way.

### Beat 0: The long pier (the voyage, then zetwal-harbor)

- The voyage `aldermoor_zetwal` (Chapter 9's; by day). On the deck, one line each as Zetwal's reef comes up: Edmund:
  "It's warm. I said it would be warm. I've packed tea for a colder country; I'm terribly sorry." (His one apology
  in the chapter.) Samira: "Nine of us and a horse. I have never arrived anywhere so expensively." Vikram: "A
  harbor... without a chain. I had forgotten they existed." Bayarmaa: "Grass." (She is looking at the cane.) Haru:
  "Those are not fishing boats." Anissa, at the rail, the last, in her own node: "Gigi. The harbor's full." Gianna:
  "It is. That's us. We did that." (Earnest; the chapter's question, said once: what the alliance is worth.)
- Lands at `zetwal-harbor`, spawn `harbor_return`. **`story.muster_begun`** is set on landing (the Cane Road's return
  table switches on, section 5). **The harbor, shown before anyone speaks:** the Old Harbor's piers full of foreign
  hulls (placed boat objects by flags: a grey Ironvow longship with a horse-tail standard at the fish-market pier, two
  Suzumori boats with lanterns, an Agnivansh ship with a brass lamp at its masthead, a Dorini merchantman with a
  green pennant at the ferry pier; each `if: 'story.muster_begun'`), the old sailor on his pier looking at them ("Fifty
  years ago this whole harbor was Crown ships... Now some are back" is his built line; his Chapter 10 branch: "Now
  it's everyone else's. I am not too old to watch *that*."), the net menders making cartridge bags, the customs clerk
  with a list.
- **The grandparents, shown (the Chapter 2 picture, deliberately the same):** Grandmother hurries down the pier,
  Grandfather follows on his cane (the built `npc:anicette_home` and `npc:patricio_home` walkers, as `zetwal_return`
  staged them). Anicette: "Nine! Nine of you and a horse, and not one of you has eaten." Anissa: "Grandmother! Gigi
  broke into a keep and a court let us go." Patricio: "Did it." (His Chapter 2 beat, kept.) Then the Marshal:
  "Gianna. They came. The Ironvow put in three days ago and have been drinking the Heights dry. The Suzumori came in
  the fog and nobody saw them tie up. The Agnivansh came with a lamp lit and the whole harbor crossed itself. The
  Dorini came with a bill." (Samira: "Of course they did.") "I have been waiting fifty years for a harbor like this,
  and I find I don't know what to do with it. Mustering is a young man's trade. I have the whistle for it and no
  breath." **Gianna gives the whistle back** (shown: a `walk` to him, the item object moves; `item.marshal_whistle`
  stays in the Journal as *given back*): "Then it's yours again. For today." Patricio closes his hand on it and says
  nothing for a beat; then: "The council sits at noon. The Chancellor will not send a Zetwal ship to a war with a
  camp that is three camps. Seat them, envoy. Then come to the Hall." `story.pier_met`.
- **One line for the Crown's absence:** Haru: "Your mother?" Patricio: "At Eightgate. The Regent's guest, as he calls
  it. She writes about the weather." (Sebastian's line, paid once more, by the father.) Gianna says nothing; Anissa
  takes her hand (a `face` cue). No joke follows.
- **The trader** ties up and stays ("I'm not sailing again until there's a fleet to sail with. Four countries and a
  horse. I want to see how it ends.").
- Journal: **The long pier** (done `story.pier_met`), then **The camp on the plaza** (beat 1).

### Beat 1: The camp on the plaza (zetwal-town; the hub)

- Up the harbor road onto the **Festival Plaza**, which is a **camp**: the present plaza takes the Echo's picture
  (tents and barricades where the stalls stand: a Chapter 10 flag variant on the present layer's objects, not the
  Echo layer: `if: 'story.muster_begun'`), with the allies quartered by house, each a crowd layer and a banner object
  (section 3): **Free Brasador** in black coats with the sashes torn off by the fountain, **Ironvow** horses and
  riders at the east gate (Salkhi placed among them, one line, nobody near Anissa: "Grass. I have been promised
  grass in five countries. This is the first that kept its word."), **Suzumori** in grey under the stage, **Agnivansh**
  in saffron at the Marshal's stone with a brass lamp burning, **Dorini** marines in green at the west lane with a
  table and a clerk. The city's own: the soup vendor with a pot the size of a cart ("Soup for the cousins. All of
  them."), the town guard counting, the festival kid on the stage with a drum, the Gaze keeper at the lamp post.
- **Joaquin, shown (FAMILY.md: he brings Free Brasador to the Muster):** at the fountain, a young man in a black coat
  with the sash torn off stands up from the Free Brasador fire as the party comes in (a `walk` across). **Azzy stops.**
  "Tío." Joaquin: "Azriel. The sergeant said you'd come back with an army." He looks past him at the harbor. "You
  brought seven. I brought the strand." (Thirty of the wall's garrison, who followed Joaquin after the shots went
  wide: "I gave the order. I could hardly stay." He does not say whose order it really was; section 9.) To Gianna:
  "Envoy. We hold the strand, and now we hold your plaza. Tell us where to stand." `story.joaquin_met`; `army.free_brasador`
  is pledged here (the number: section 7.0).
- **The four captains, placed (each a line now; one of them is the betrayer tonight, and nothing in daylight says
  which):** **Hrafn** at the Ironvow horses ("A fleet that cannot raid is firewood. A fleet that sails for Zetwal is
  at least a fleet."), **Councillor Mibu** under the stage with a fan ("Kirinoura is neutral. Kirinoura's boats are
  not. It is a distinction we are proud of."), **Steward Prakash** at the brass lamp ("The oil is the temple's again.
  We brought enough for one war."), and **Admiral Rashid** at the Dorini table, new, with Layla's seal on a letter
  ("The Merchant-Prince sends her compliments, forty marines and an invoice. The invoice is a formality. The marines
  are not."). Samira, to Gianna, low: "Rashid runs my mother's convoys. He is the only man she pays on time."
  (Section 9.4: the Dorini variant needs a face before the night; the design gave him none before now.)
- **The Quiet Crown's two recruiters** (built, placed without condition): their Chapter 10 branches. Recruiter A: "So
  much noise today. Drums, muskets, shouting. It will be quieter soon." Recruiter B (she is the one who said "You would
  be surprised who wears our hood, envoy's daughter" in Chapter 1): "Our lady fell in a Stillwater court, they tell
  me. The quiet goes on. It always does." (The cells are leaderless and alive; the betrayer is "a secret member":
  seeded, not named.)
- **The Echo zone on the plaza** (the built `plaza_stone` by the Marshal's stone): its Chapter 10 scene is **the
  morning of the signing** (section 8.2): a swap shows two armies drawn up where seven stand now. Information, no
  anchor; the Journal's "Fifty years ago two armies stood on this ground and signed six clauses. Today seven stand on
  it." Anissa holds the door as always ("I'm holding the door, Gigi." is her built Chapter 1 line at this zone).
- The press: Hrafn's riders and Rashid's marines are already shouting across the fountain about a Dorini convoy the
  Ironvow took in the spring (walkers: a rider and a marine square up; Joaquin's sergeant steps between: "Not in the
  envoy's camp."). Mibu's people and Prakash's will not stand within ten tiles of each other (placed so). The
  printer's people in violet turned inside out sit by themselves at the plaza's edge with nobody near them. The three
  feuds are on the map before anyone says the word.
- Journal: **The camp on the plaza** (done `story.plaza_camp_seen`), then **The council at noon** (beat 2).

### Beat 2: The council at noon (zetwal-square, zetwal-hall; the seat of government)

- Up the steps to **Accord Square**: the Signers' statue with the councillors' children on it (the nursemaid's built
  line), the honour guards, the gazette crier ("Gazette! Seven houses in the harbor! Council sits at noon! Festival
  committee asks whether this counts as a festival!"), the protester with a new board ("NO CHARTER FOR XARAGUÁ" and,
  under it, "WELCOME"). Into the **Hall of the Accord**: the Council Chamber in session (the Speaker at his desk, the
  Senior elder and the Harbor councillor on their benches, the **Chancellor** at the Speaker's side, the usher, the
  page running).
- **The council, shown:** the Speaker: "Order. Order. It is only the envoy, so, order anyway." The question on the
  floor is Zetwal's: whether the state sends its own ships and its levy to Xaraguá's harbor. The Senior elder: "Peace
  has kept Zetwal fed for fifty years. Now the envoy has brought the war home to our plaza." The Harbor councillor:
  "The war was always coming. It came to Yucayeque first. Raise the chain, arm the levy, sail." The Chancellor, who
  signed Gianna's papers in front of the Crown's consul in Chapter 1: "Zetwal's envoy went out to make an alliance.
  Envoy. Have you made one, or have you made three camps that will not share a fire?" **The condition, said plainly
  by the Chancellor** (the chapter's rule, once): "Seat the feuds. When the Ironvow and the Dorini will drink at one
  fire, when the Suzumori and the Agnivansh will stand on one island, when Kingsmere's people are trusted by the men
  the Crown's muskets fired on, this council will vote, and I will put the question to the chair's empty arm: and I
  know what she would say. Until then Zetwal's ships stay tied." (Elodie's shawl is still over the throne's arm, the
  built `hall_seat` line.) `story.council_condition`.
- **Gianna's ask** (as the envoy): "And the harbor chain?" The Chancellor: "Raised at dusk, whatever you do. The
  Harbor councillor has been right for a year and I am tired of saying so." (Shown later: beat 6.)
- Journal: **The council at noon** (done `story.council_condition`), then **Until the allies are seated** (the gate,
  section 6, `followSide`).

### Beat 3: The watch lands (zetwal-harbor; Jordyn's company, Rahel, Patricia)

- On the way back down to the plaza the harbor kid runs up (a `walker` up the harbor road, the built `harbor_kid`):
  "Envoy! A Crown ship! At the long pier! With Crown soldiers on it, with their coats on *wrong*!" The arrow turns to
  the harbor.
- **Shown, in order:** a plain coaster at the long pier (a boat object, `if: 'story.watch_landed'` after; before it,
  the scene places it). Down the gangway: **Jordyn** first, hands behind her back, in the Regent's violet turned inside
  out, then six of the watch, then the **printer** with an inked apron and his three apprentices, the sorry constable,
  the pie-shop boy, two of the warned families (walkers in a line to the pier's head). Then, last, two old women, one
  on the other's arm: **Rahel** (tall, straight, a black shawl, a Brasador brooch and a steppe braid in her hair: the
  mother of six by three men and three countries) and **Patricia** (small, white-haired, a cane she does not use, the
  eldest of the family, who looks at everything once).
- **Azzy, shown:** he goes down the pier at a run (`walk`, `run: true`) and stops a tile short, as Sebastian did.
  Rahel, before he speaks: "Azriel. Don't run on a pier. You'll go in, and your Titi Jordyn will have to arrest the
  sea." Then she takes his face in both hands (a `walk` to his tile and back: the engine's embrace). **Her line for
  Azzy (FAMILY.md):** "Your grandfather's name, your father's jaw, and from me you got nothing but the temper. Use it
  on the Crown. Not on him." (Reads either way: "him" is whoever the player thinks; section 9.1.) Azzy, for once, has
  no answer.
- Rahel, to Jordyn: "Which one is the envoy?" Jordyn: "The one in blue, Mother. The small one beside her is the
  other." Rahel looks at Gianna for a long beat (face), and at Anissa, and says, to Gianna only: "I will come to your
  grandmother's house, if she will have me. Not here. There are things one says in a kitchen." `story.watch_landed`.
  (Her scene is beat 4.) Patricia, to nobody, looking at the harbor: "Seven. In my day it was two and a Crown. Count
  them again at dusk; harbors lie."
- **Jordyn to Gianna**, blunt: "Seven of the watch, twelve of the barn's lot, and the printer, who is no use in a
  line and will say so. We walked to the coast and I found a ship. I did not say how." (`army.aldermoor` pledged:
  section 7.0.) To Edmund: "Mr. Stillwater." Edmund: "Captain." Jordyn: "Not any more." Edmund: "Nor I. It's rather
  freeing." (No joke near Anissa: she is with Rahel's hand on her head, four tiles up the pier.)
- **Jordyn's rule for the chapter**, said once: "I keep the law where I stand. Tonight I stand in your harbor. If
  anyone in it is bought, I will know, because bought men walk differently." (Beat 7's seed.)
- Journal: **The watch lands** (done `story.watch_landed`).

### Beat 4: Two grandmothers (zetwal-house: Rahel's scene with Gianna and Anissa)

- The Limyè house. Anicette has the kitchen table laid for ten and is pretending she did not know who was coming.
  **Rahel comes in** (shown: `enter` from the door, a `walk` to the table). The two women look at each other across
  it. Anicette: "Madame." Rahel: "Madame." Anicette: "You had the Marshal's whole camp crying over your husband's
  peppers in the year of the Accord." Rahel: "They were my peppers. Benny only carried them." They sit. Nothing
  else is said about the past, the marriage or the men; the player who wants the secret watches two grandmothers
  decide, in front of each other, to say nothing, which is the family's whole way (section 9.1 and 12: no line here
  settles STORY's open question 13, and the reviewer reads every one).
- **Rahel's scene with Gianna and Anissa (FAMILY.md, settled):** she asks Anissa to sit beside her, not Gianna. To
  Anissa: "They tell me you glow. I have six children and not one of them glows. I would have liked one that did."
  Anissa: "It's only sometimes." Rahel: "The best things are." (Earnest; nothing near it is a joke.) To Gianna, the
  envoy's daughter, as an equal: "You went into Kingsmere's keep and came out through its court. My Jordyn says you
  were arrested by the book. That is the only compliment she has ever paid anyone." Then **her one line about him**,
  the only time (section 9.1, the locked rule): "My son does not explain himself. He never did. I stopped asking him
  to when he was nine. You may stop when you like, or not; it is a thing you choose, not a thing you are told."
  Gianna: "He sold Xaraguá." Rahel: "So I have heard said. In three countries. By people who were not in the room."
  (Reads either way: a mother's refusal to hear it, or a mother who knows; tested like Kayla's and Jordyn's lines.)
  `story.rahel_met`.
- Anicette, after, to Gianna alone at the door: **the Ash Wars talk (STORY beat 3; the Concord bonus; built around the
  Chapter 1 scene):** "You've read the Crown's own chronicle now. Four hundred, it says. And the Suzumori ledger. And
  our healers' record. And mine." (The four accounts: `lore.zetwal_ash_wars_temple`, the spy ledger's flag, the
  chronicle's flag, Volume Two's flag.) "So. Which of the four is lying?" A choice: *The Crown's chronicle* (right:
  "Written to order, in Aldermoor, far from the ford: you found the clerk who wrote it. Forty, and three hundred sent
  home. Say it at the Hearing, when there is one." → `clue.four_accounts`, **+3 Concord**; the Journal note *The four
  accounts*) / *The healers'* / *The Suzumori's* / *Yours* (each a line and back: "Read it again. Slowly."). A player
  without all four flags gets the beat's short form ("When you have read all four, come and tell me which lies.")
  and the bonus whenever they have. (The Opus minimum lists this talk as "after the release"; it is one conversation
  on a built character, so it is in: Claude's call, section 12.)
- Journal: **Two grandmothers** (done `story.rahel_met`).

### Beat 5: Until the allies are seated (the required quests, any order; the arrow follows the ground)

- The **three mediations** (section 7.3: the Iron Market, the Temple island, Accord Square), **Z-6 Muskets in the
  Cane** (the Cane Road and the mill's cellar: section 7.1, the Echo puzzle), **Z-3 The Lonely Cutter** (the mill:
  section 7.2), the smith's tier-24 stock, the contract board's "count the soldiers" job, the Quill's stones (inert),
  Anicette's talk if not yet.
- **Patricia's blessing (FAMILY.md, settled: "before the war"; placed on the route so no player misses it):** on the
  Temple island, where the second mediation is, at the **Gaze lamp**, which is where Anissa woke in Chapter 1.
  Patricia is there before the party (placed at the lamp from `story.watch_landed`), with old Patricio beside her,
  the two oldest people in the realm looking at a lamp. Shown: the three great-grandchildren are called up one at a
  time (a `walk` for Azzy from the party's line; the follower for Anissa; the player for Gianna). To Azzy: "Azriel
  Rodriguez. You fired on nobody and you were fired on by family. That is the whole of this war in one boy. Go and
  finish it." To Gianna: "Gianna Elise. You carry half a thing on a chain and you have spent a year finding out what
  the other half is worth. Keep carrying it. Things in halves are the only ones worth keeping." (Reads either way;
  the Locket's rule.) **To Anissa, last:** "And who are you, child? Say it. I'm old; I like to hear names said."
  **Anissa, in her own voice, to a stranger, in front of the family and the lamp (STORY 4: she speaks at the Muster):
  "Anissa. I hold the door."** Patricia: "Then hold it." She puts her hand on each head in turn (shown: three `face`
  cues and a `wait`). `story.blessing`. Nothing is a joke within twenty lines of this. Patricio, after, to nobody: "I
  lit that lamp for fifty years and never once thought to ask it who it was."
- **The Marshal and the seventh page (STORY 6.13's Oct 22 note: "the payoff is Chapter 10's, at Pòdlimyè"):** at the
  **Marshal's stone** on the plaza (the built object: "There is room on the stone for a seventh. It is blank."),
  Patricio is placed from `story.blessing`. Gianna shows him Thomas's True Record and the roll ("Xaraguá: not
  present. Not sent for."). Patricio, after a long beat: "Six pages. I counted them. I sealed what I counted, and
  they read the seventh to their own clerk in the next room, with Benny shouting at the door." (`choice.patricio_protest`
  branches one line: "I said 'under protest of time.' I should have said 'under protest.'" / "I had them write that
  I did not read it. It was the only true thing on the page.") "I would remember. I did remember. I remembered the
  wrong thing." He puts his hand on the blank seventh line (shown: a `walk`, a `face` to the stone). "Leave it blank.
  Blank is honest. Someone will carve it when there is something true to carve." (Se-4's door at the Claim, after the
  release; the stone stays as built.) `story.patricio_told`. The Journal note *The Marshal's answer*.
- When the three feuds are settled and Z-6 and Z-3 are done (and `story.blessing`, `story.patricio_told`): the
  **council's word** (beat 6).

### Beat 6: The council's word (zetwal-hall, then the harbor: the chain)

- Back in the Council Chamber (the arrow): the Speaker calls the vote (walkers: the two elders stand; the Senior elder
  last, and sits again, and stands again: "I will not be the one who kept the fleet tied while Yucayeque burned
  twice."). The Chancellor: "Zetwal sails. Its levy, its ships, and the envoy's household. The chair's arm is empty,
  so I will say what she would have said and take the blame for it: *go*." `story.council_voted`; `army.zetwal`
  pledged (section 7.0).
- **The harbor chain, shown:** the Harbor councillor walks the party down to the Old Harbor himself (a stage walk
  across two maps is not data: he is placed at the harbor's capstan on `story.council_voted`); the capstan at the
  customs house (a new object on the built map), the old sailor and the net menders on the bars; the chain comes up
  across the harbor mouth (an `above` object with two looks, the Chapter 8 chain's twin, drawn across the sea's edge).
  The Harbor councillor: "A year I asked. They called me a warmonger. Then they built your grandfather a statue, and
  now they've raised his chain. Nobody will build me one." `story.chain_raised`. (The Crown's launch that comes
  tonight comes *under the point*, outside the chain: beat 7. The chain is why.)
- Journal: **The council's word** (done `story.council_voted`), **The chain** (done `story.chain_raised`), then **The
  Marshal's whistle** (beat 7).

### Beat 7: The Marshal's whistle (zetwal-town at dusk: the inspection)

- Dusk on the plaza (a condition: `story.chain_raised` and not `story.inspection_done`): the lanterns lit (the built
  `lantern_glow` objects), the seven camps drawn up in lines across the paving (the crowd layers re-placed in rows:
  Zetwal's levy at the stage, Free Brasador, Ironvow dismounted, Suzumori, Agnivansh, Dorini, the dissidents last and
  fewest). **Old Patricio walks the lines** (shown: a `walk` down the plaza's long axis, slowly, the cane; the
  camera on him; the party at the fountain). At the stage he turns.
- **The whistle:** he blows it (an audio slot: two notes, high and low; the Chapter 1 item's note, heard for the first
  time). **Zetwal's companies answer** (the levy's crowd: a `sync` to standing looks; a drum from the stage). Nobody
  else moves. Patricio: "Every company in Zetwal knew that note. Now the other six will." He blows it again, and
  this time **Joaquin** (walker, from the Free Brasador line) shouts the Brasador order ("¡Firmes!") and his thirty
  come to it; **Hrafn** lifts the horse-tail standard; **Prakash** lifts the lamp; **Mibu** closes his fan; **Rashid**
  closes his ledger; **Jordyn** says "Watch!" and seven come to it. (Each a `face` or a look change: the allied army
  answering one note, shown.) Azzy, to Gianna, the one line: "He said someone in Zetwal would always remember it. He
  didn't say it would be everyone." `story.inspection_done`.
- **Patricio gives the whistle back** (shown): "Blow it at Xaraguá. Somebody will answer. They always have."
  (`item.marshal_whistle` carried again; Chapter 11's volleys are called with it: section 14.) Then, to the lines, the
  Marshal's only speech, four sentences: "Fifty years ago two armies stood on this ground and the Crown signed six
  clauses and hid a seventh. Tomorrow seven sail to take back what the seventh took. I will not be on the ships. I
  was. Go and be." (The crowd layers `sync` to the night.)
- The eve's one quiet thing (no joke): Anissa, on the fountain's rim, counting the lines under her breath, as she
  counted the pages in Kingsmere. Haru, beside her, not a joke, a true thing: "Seven. I counted too." She: "Six and
  a half. The violet ones are only twelve." Haru: "Then six and a half." (He is the one who counts; it is her line
  that corrects his: earnest, and the dissidents' smallness is the third feud's point.)
- Journal: **The Marshal's whistle** (done `story.inspection_done`), then **Under the point** (beat 8).

### Beat 8: Under the point (night: the betrayal, and the exposed route)

- **Night** (a condition: `story.inspection_done` and not `story.fleet_sailed`): the plaza's fires banked, the
  lines gone back to camps, the Heights' lookout keeper's lantern on the cliff (placed). **The muster is resolved on
  the step into the night** (section 10: `resolveMuster` runs when `story.inspection_done` is set: it reads the
  four houses' shares, names the least paid as `muster.betrayer.<house>` (ties to Dorini), sets
  `muster.exposed_possible` if the house is at least 60 percent paid and the player holds the buyer's list
  (`clue.buyers_mark`, always) and the smugglers' ledger (`side.muskets.done`, required), and pledges the armies).
- **Shown, before it is said (Jordyn's rule: "bought men walk differently"):** on the plaza by night the betrayer's
  captain (Hrafn / Mibu / Prakash / Rashid: four placements, one per `muster.betrayer.*` flag) leaves his camp's fire
  and walks to the west lane (a walker, `if` by the flag), alone, with a satchel. The arrow follows him down to the
  **Old Harbor**. Under the point, outside the raised chain, a **Crown launch** with its lights out is tied at the
  customs house's steps (placed, `if: 'story.inspection_done, !story.fleet_sailed'`), and on the steps, in a good coat,
  **the Crown's consul** (Chapter 1's: "His Majesty's consul to Zetwal, at your service. Truly.", who left the Hall
  "for good"; back as the purchasing office's man) with a paper and a strongbox. The captain goes down to him (the
  walker's end). The party arrives at the quay's head (a step trigger on the harbor road's foot).
- **The purchase, heard (the owner's rule for off-screen events used for an on-screen one the party is ten tiles
  from):** lines from `''` at a distance: the consul: "The Throne's compliments. The balance on sailing, the rest on
  the harbor." The captain, by house (four variants, one line each, in the register each chapter gave him): Hrafn:
  "A fleet that sails for the highest bidder is at least a fleet." / Mibu: "Neutrality has a price. The Throne has
  met it." / Prakash: "The oil was always the Throne's. So is the flame, it seems." / Rashid: "The Merchant-Prince
  was not consulted. The guild was. I am the guild's." Then he sees the party (a `face`), and the register never
  changes: "Envoy. You paid us less than you paid the others. You know you did; your Journal says so. The Throne
  paid the difference."
- **The exposed route (`muster.exposed_possible`):** Gianna lays two things on the customs house's steps (shown:
  two item objects appear; a dialogue with two *Lay evidence* entries whose `if` holds, the Assize's shape): **the
  buyer's list** (Kayla's: the four lines with one name cut out, the closed hand beside it) and **the smugglers'
  ledger** (Z-6: "muskets for the Muster's friends", consigned by the same closed hand to a captain whose house's
  sigil is drawn beside it: the list's cut-out name, found). Gianna: "Kirinoura's files named the mark and cut out
  the name. The cane's smugglers wrote it back in. Your sigil, Captain, on the Crown's muskets, in a Zetwal field,
  before you ever landed." **Then the house's own people decide it, not the party** (the design's "turn them into a
  late ally" is the house turning, shown): the house's second comes down the harbor road behind the party (walkers:
  for Ironvow, the lawspeaker's rider; for Suzumori, the signal master; for Agnivansh, the junior priest; for Dorini,
  Layla's clerk with her seal) and the companion of that house says the one line that turns it (section 9.4: Bayarmaa
  / Haru / Vikram / Samira, each defying their house's man a second time, in their own register). The second: "The
  house sails with the envoy. The captain sails with nobody." **Jordyn arrests him by the book** (shown: she comes
  down the road with two of the watch, the same `walk` as the keep's: "Captain of nothing. Under arrest for the
  Crown's gold in a free harbor. There's a Hall up the hill with a cell in it, I'm told."). The consul goes back to
  his launch alone (exit), the launch pulls out under the point (the boat object's look goes). `muster.turned`:
  the house is a **late ally** (its army stays at three quarters: section 7.0; the Chapter 11 flank fight is skipped,
  COMBAT 13.3 #8).
- **The betrayal (not `muster.exposed_possible`):** the captain: "You have papers. I have forty men and a ship, and
  the Throne has a fleet. Keep the papers." He steps into the launch (shown); his house's company **goes down to its
  ship in the dark** (walkers from the plaza's camp, which the player sees on the way back up: the camp's crowd
  layer gone, the banner object gone, `sync`), and at dawn its hull is gone from the pier. The companion of that
  house stays (section 9.4: the second defiance, one scene each). `muster.betrayed`: `army.<house>` 0; the captain is
  Chapter 11's flank boss in his house's variant (the *Betrayer* row).
- **Either way, Anissa's one line in the scene**, after, on the quay, not loud, earnest, to Gianna: "He walked like
  the lady with the basket, Gigi. Like he already knew where he was going." (The Hushed's secret member, seen by
  the one person who watches how people walk: it is the chapter's only line joining the betrayer to the Quiet Crown,
  and it is a child's observation, not a proof.) Gianna: "Yes. I saw it too." `story.betrayal_seen`.
- **The lookout keeper's signal fire, shown:** on the walk back the Heights' cliff lights up (an object look change
  visible from the harbor map's edge, and the keeper placed at the fire on the Heights map after): somebody asked.
  Patricio did. "For Xaraguá. So they know we're coming." The Journal note *Under the point*.
- Journal: **Under the point** (done `story.betrayal_seen`), then **The tide** (beat 9).

### Beat 9: The tide (zetwal-harbor at dawn: the fleet sails; the card)

- Dawn on the Old Harbor: the chain **lowered** (its look), the foreign hulls warped out to the harbor mouth one by
  one (boat objects re-placed in a line on the sea's edge; the betrayer's gone, or in place with its captain in the
  Hall's cell), Zetwal's own ships at the long pier, the levy going aboard (walkers up the gangway in file), Joaquin
  and Free Brasador last, Jordyn's seven, the printer not coming ("I've a press to set. Every door in this city by
  noon."). **Rahel and Patricia on the pier** with Anicette between them (placed): Rahel, to Azzy: "Come back with the
  temper used up." To Gianna, nothing: a hand on her shoulder (a `face`). Patricia, to Anissa, the last thing anyone
  says to her in the chapter: "Hold it, child. All the way across." Patricio on the pier with his cane, not coming
  ("Marshals muster. Captains sail. I have done the half I'm fit for."). Anicette's kasav (`item.anicette_kasav`,
  the Chapter 1 shape, again: "For the water. Eat it before the hutia does.").
- The **Zetwal trader** takes the envoy's household at the head of the fleet: the sea voyage `zetwal_xaragua`, the
  built one (Pòdlimyè (119, 37) north round Ardencia and down the strait to Yucayeque (46, 32)), with Chapter 10
  captions ("Out past the reefs, with every shore that spoke for us..." / "North, round the cliffs where the shots went
  wide..." / "...and down the strait, to the harbor the seventh clause took."). Salkhi aboard the Ironvow longship
  ("A ship. Again. I had grass for one day.").
- Card: *Chapter 10 complete, The Muster. Next: Chapter 11, The War of the Harbor.* `act10.complete`. `?chapter=11`
  starts where Chapter 11's outline puts the landing (Yucayeque's harbor under the guns, or the hills above it).
- Journal: **The tide** (done `act10.complete`; pays no XP: a card).

---

## 3. The maps (ten reused, one new: `tools/maps/zetwal-mill.ts` through `painter.ts`)

Every Chapter 1 map is reused with Chapter 10 variants (objects, NPCs, crowds and triggers conditioned on
`story.muster_begun` and the chapter's later flags; the Chapter 1 and Chapter 2-end placements are untouched except
where section 10 says). The look is the built Pòdlimyè's (sun, gold, lanterns) with seven colours of banner on it.

| Map | Size | Section | Chapter 10 use | Echo |
|---|---|---|---|---|
| `zetwal-harbor` | 36 x 18 (built) | The Old Harbor | The landing (spawn `harbor_return`, the grandparents' walkers, the trader); the foreign hulls (five boat objects by house, each `if` by its `ally.*` and not `muster.betrayed.<house>` after the night); Jordyn's coaster; the **capstan** and the **chain** across the harbor mouth (new objects: two looks each); the Crown's launch under the point and the consul on the customs house steps (by night); the betrayer's walker's end; the dawn's line of ships; the voyage trigger (after `story.betrayal_seen`) | none (the built Echo layer stands) |
| `zetwal-town` | 40 x 28 (built) | The Festival Plaza (hub) | The camp (five house crowd layers and banner objects by `ally.*`; the dissidents' corner), Joaquin at the fountain, the four captains placed, Salkhi at the east gate, the recruiters' Chapter 10 branches, the Marshal's stone (Patricio placed from `story.blessing`), the dusk lines (crowd layers re-placed by `story.chain_raised`), the night (the betrayer's walker from his camp to the west lane), the debate corner idle (`zetwal_corner` settled in Chapter 1; its `after` lines) | **`plaza_stone`** (built zone): Chapter 10's `onEcho` scene, the morning of the signing (section 8.2); no anchor |
| `zetwal-square` | 36 x 22 (built) | Accord Square | The third mediation at the Signers' statue (the printer against the Free Brasador sergeant, section 7.3); the crier's and protester's Chapter 10 lines | none |
| `zetwal-hall` | 40 x 30 (built, interior) | The Hall of the Accord (the seat of government) | The council at noon and the council's word (the Speaker, the two elders, the Chancellor, the usher); the betrayer's cell (a line at the Treasury's door after `muster.turned`: "The Treasury has a lock. It is the Hall's only one.") | none |
| `zetwal-market` | 36 x 24 (built) | The Iron Market | The first mediation (Rashid's clerk against Hrafn, over a Dorini convoy's crates and an Ironvow horse, section 7.3); the smith's tier-24 stock; Samira's line | none |
| `zetwal-temple` | 30 x 20 (built) | The Temple island | The second mediation at the Gaze lamp (Mibu against Prakash: the burned temple, section 7.3); Patricia's blessing at the lamp (placed from `story.watch_landed`); the name stones (the Quill after the release); the cane cutter is not here (his `CUTTER_AT_STONES` condition excludes `story.zetwal_return`) | none |
| `zetwal-house` | 20 x 12 (built, interior) | The Limyè house | Rahel's scene at the kitchen table; Anicette's four-accounts talk | none (the study's zone stands) |
| `zetwal-heights` | 30 x 20 (built) | Solèy Heights | The Ironvow drinking the well dry (placed riders, Salkhi's second placement); the lookout keeper and the **signal fire** (a new object, two looks, lit from `story.betrayal_seen`); the lookout's Chapter 10 view line ("All of Pòdlimyè below, and seven camps in it.") | none |
| `zetwal-road` | 44 x 26 (built) | The Cane Road (wild) | The Ironvow horse lines by the east gate (placed), the built **crates** (Z-6's accept), the cart tracks to the **mangroves** (Z-6's crew fight at the smugglers' landing, the built `X` crates at (23, 18)), the **mill** (Z-3's Ti Jak; the cellar's door, a new door object into `zetwal-mill`), the cane cutter's `danger` node (built) with a Chapter 10 line; the return ambush layer `cane_road_muster` (section 5) | the built `cane_roses` zone stands |
| **`zetwal-mill`** | **14 x 10 (new, interior)** | The sugar mill's cellar (Z-6; CAPITALS' proposal) | The smugglers' second cache (crates, a lantern, a ledger on a barrel), the cellar's inner door with its **bar** (the anchor's present reading: barred, the cache shut in), the stair up | **the cellar floor** (one zone: the Revolution's powder store; the anchor: the oak bar, M-ZET-2) |
| `zetwal-archive` | 22 x 14 (built, interior) | The Temple Archive | Open as built; the Tales shelf has Volume Two; nothing new | none |

One new map, the smallest in the game. **Outdoor areas, buildings aside: seven** (the built city's). The seat is
central and staffed (the Hall, built), and full of people who disagree (the two elders, the Chancellor who waits for
the envoy's answer). The validator's rules hold: the cellar's zone tiles are walkable in both eras; the Echo-era
puzzle object (the bar) is on the zone's edge; the anchor sets `anchor.mill_bar`, read by the present inner door.

**Drawn placeholders** (code, through `assets.config.ts`): five banner objects (a horse-tail standard, a grey lantern
pole, a brass lamp on a post, a green pennant, a black coat on a pike) and a sixth (violet, inside out, a small one);
five boat recolours of the built boat tile with a flag; the capstan (1 x 1, two looks) and the harbor chain (an `above`
strip, two looks: the Chapter 8 chain's shape); the signal fire (1 x 1, two looks); the cellar's bar (1 x 2, two
looks); Rahel, Patricia, Joaquin and Rashid as new NPC looks (section 11); Hrafn, Mibu and Prakash as their
chapters' looks; the Crown's consul as built; crowd looks for six houses (recolours of the built festival crowd and
the Chapter 3 `free_brasador`).

---

## 4. The Echo and the fights: what the engine has and what this chapter uses

- **The Echo party** is Patricio, Caona and Benny, as data; the field draws Gianna's sprite in the Echo, so the morning
  of the signing is staged with the two armies as Echo-era crowd layers and NPCs (the built `echo_soldier`,
  `echo_cook`, `echo_drummer`, `echo_sentry` with Chapter 10 branches; young Benny and Caona placed as the built
  `benny` and `caona` NPC looks on the Echo layer with `if: 'story.muster_begun'`; the Crown's envoy as the Chapter 5
  `echo_crown_envoy`), the half-built stage and the stone pile as built. The built plaza Echo layer is the camp the
  night before the signing; the Chapter 10 scene is the morning after it, on the same ground, so the tents stay and
  the armies are drawn up among them: no second Echo layer. The cellar's Echo is M-ZET-2's.
- **No Echo battle** (the Chapter 5 to 9 outlines' call, again): the morning of the signing is a parade and a
  signature, and the Echo-battle foundation is kept for Chapter 11's harbor, which is next.
- **The present's fights** use what Chapters 2 to 9 built: enemies as data with `moves`, `every`, `tell`, `area`,
  `hire`, `once`, `protects`, `withdraws`, `bribable`; battles with `rewards`, `endsWithBoss`, `boss`. There is no new
  status, no new move kind and no boss: this is the first chapter since Chapter 1 whose fights need no engine piece.
- **Who fights.** Eight fighters, four active by `party.active` (built by Chapter 8's outline and used by Chapter 9's;
  section 10 has the fallback). The sim ran the Chapter 9 order (Gianna, Yari, Azzy, Edmund) and a glass-cannon line
  (Gianna, Yari, Vikram, Haru): both win every seed of every fight (section 5), so the chapter does not depend on the
  order, and the player's choice is the player's.

---

## 5. The chapter's fights and levels

**Enemies (the built shapes re-levelled; new data only where marked; `COMBAT.md` 13.2's Zetwal return rows):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Road Bandit** (built, `road_bandit`) | skirmisher, `bribable` | 24 | Knife 110; Dirty trick 150, every 3 | as built |
| **Smuggler** (built, `smuggler`) | brute, `bribable` | 24 to 25 | Cudgel 110; Crate throw 140, every 3 | as built |
| **Lookout** (built, `lookout`) | skirmisher, `bribable` | 24 | Sling 100; **Whistle** `hire: 'road_bandit'`, every 2, `once`, tell "The lookout puts two fingers to his mouth..." | COMBAT's Whistle, added (the Chapter 9 outline gave the constable the same shape); the built Lookout has only Sling |
| **Quiet Crown Zealot** (built, `qc_zealot`) | caster, resists light | 25 | as built | "The little one glows, they say. Even at home." |
| **Husher** (Chapter 7's `husher`) | caster, resists light | 25 | as Chapter 7 built it (Whisper, Hush, Seize) | the Cane Road's only Seize: Anissa is never hit; Gianna steps in |
| **Mangrove Crab** (built, `mangrove_crab`) | tank, weak to fire and light | 24 | as built | CAPITALS' proposal for the mangroves, taken |
| **Crew chief** (`crew_chief`, new) | brute, `boss`, not bribable | **25** | Cudgel 120; **The whole stack** 130 `area`, every 3, tell "The chief gets his shoulder under a stack of crates. Guard, everyone!" | Z-6's crew; `hpScale 3`, `atkScale 1.3`; `withdraws` ("Enough! Keep the cellar. Keep the cane. We were paid to carry, not to die."): nobody dies |

**Z-6's crew (`mangrove_crew`), sim-checked:** the chief at 25 (x3 / x1.3: about 995 HP and 108 ATK before Story's
0.8 and 0.7), a Smuggler and two Lookouts at 24 (each Lookout whistles once: up to two Road Bandits join at 24, the
built `hire` with a reserve), `endsWithBoss`; **the smuggler and the lookouts get `protects: 'crew_chief'`** (section
5's finding below). Rewards: **120 XP, 300 gold**, and the chapter's one Yield-shaped choice after it (section 7.1).
Game Over applies (not meant to lose); the way back in is the landing's crates (a step trigger that fires again).

| Scaling tried (30 seeds; Story difficulty; falls counted party-wide) | Party 23 | Party 24 | Party 25 |
|---|---|---|---|
| chief x2 / x1.2 at 24 [Gianna, Yari, Azzy, Edmund] | 30/30 won, 21 actions, 0.00 down, 66% HP left | 30/30, 19, 0.03, 68% | 30/30, 18, 0.00, 69% |
| **chief x3 / x1.3 at 25 (chosen)** | **30/30, 29, 0.50 (a fall in 13 of 30), 60%** | **30/30, 26, 0.17 (4 of 30), 65%** | **30/30, 25, 0.00, 65%** |
| chief x4 / x1.4 at 25 | 30/30, 34, 0.87 (22 of 30), 61% | 30/30, 32, 0.33 (9 of 30), 66% | 30/30, 30, 0.20 (6 of 30), 66% |
| chief x3 / x1.3, glass-cannon line [Gianna, Yari, Vikram, Haru] | 30/30, 20, 0.20, 66% | 30/30, 19, 0.23, 77% | 30/30, 18, 0.13, 76% |
| chief x3 / x1.3, **plain bot** (the chief first, the crew ignored) | 30/30, **13**, 0.23, 68% | 30/30, 12, 0.07, 75% | 30/30, 11, 0.03, 75% |

So **x3 / x1.3** is a side quest's fight of about 26 party actions at 24 (seven of Gianna's turns), a fall in one
fight in seven at the chapter's floor and none at its top, where Grimvald sat at 29 and Dhanraj at 39: right for the
chapter's one scripted fight, which is not a boss. **The plain bot wins in half the actions with fewer falls**, the
Chapter 7 to 9 reviews' decoy finding again (`endsWithBoss` ends it when the chief withdraws), so the crew gets
`protects: 'crew_chief'` (built; `INTERCEPT_CHANCE` 0.75): the crew must be cut down or the chief cannot be reached,
which is also the story (they stand in front of the cache). The build re-runs with `protects` on day 1 and keeps x3
unless the fair bot then exceeds about 32 actions at 24, in which case the second Lookout goes.

**The Cane Road's return tier (`cane_road_muster`, from `story.muster_begun`), sim-checked:**

| Group | Level | Party 23 | Party 24 | Party 25 |
|---|---|---|---|---|
| Road Bandit x3 | 24 | 7 actions, 0 down, 92% | 7, 0, 93% | 7, 0, 93% |
| Smuggler x2 + Lookout (whistles once) | 25 | 14, 0, 86% | 13, 0, 87% | 12, 0, 89% |
| Zealot x2 + Husher | 25 | 8, 0, 90% | 7, 0, 92% | 7, 0, 92% |
| Mangrove Crab x2 + Road Bandit | 24 | 11, 0, 88% | 11, 0, 89% | 10, 0, 91% |
| Road Bandit x2 (a pair, for comparison) | 22 | 4, 0, 98% | 4, 0, 98% | 4, 0, 98% |

Every group is won in every seed with nobody down: the return's road is a walk with knives in it, not a gauntlet,
which is right for a chapter whose work is seating people. **Pairs are trivial** (four actions), so the table is
trios at 24 to 25 (weights 3, 2, 1, 2 in the order above); a party at 25 sees the 24s as white, not grey
(`LEVELS.bands.trivial = 3`). No group carries a tell the party has not seen since Chapter 2 except the Lookout's
whistle (Anissa's tip on the first: "He's calling more, Gigi. Him first.").

**Levels through the chapter** (objectives at **40** each, the built last entry: section 5's recommendation; books 10;
the minor puzzle 25; a mediation 25, a feud argued 15; the fights as data; ambushes by the built rule: a trio at the
party's level pays 12% of the level, about 64 XP at 24, 80 for a trio one level over):

| Point | XP from | Total | Level |
|---|---|---|---|
| Start (the long pier) | | 7,546 | 24 |
| The long pier, the camp, the council at noon, the watch lands, two grandmothers, the blessing, the Marshal's answer, the council's word, the chain, the whistle, under the point (eleven objectives at 40; "Until the allies are seated" and the card are `noXp`) | 440 | 7,986 | 24 |
| Three mediations (25 each; 15 if argued) | 45 to 75 | 8,061 | 24 |
| Z-6 (200) and its crew (120), M-ZET-2 (25), Z-3 (80) | 425 | 8,486 | **25** |
| The four-accounts talk (Concord, no XP); the contract board's count (+1 Influence, no XP) | 0 | 8,486 | 25 |
| Two or three ambushes on Z-6's road (about 64 to 80 each) | 130 to 240 | 8,616 to 8,726 | 25 (26 at the top) |

**The level statement for the milestone note.** The chapter is **one level wide (532 XP)** and ten minutes long, so
its fixed XP (about 940 without ambushes) is sized to land on 25 from 24 with room for two ambushes and not three.
Two dials decide it, both Claude's calls (section 12):

- **`XP_PER_OBJECTIVE_BY_CHAPTER` gets a row for Chapter 10 of 40**, the held last entry, not the formula's 65 (15 +
  5 x 10): eleven objectives at 65 (715) with Z-6 would put a party that arrived on target at 26 before a single
  ambush, one over `slackOver`. Chapters 6 to 9 should get rows when they are built (their outlines planned on 25 and
  the levels pass raised the held entry to 40: the Chapter 9 review's plan already assumes 40); this outline only
  fixes 10's.
- **Z-6 pays 200 XP, not the design's 380**, and Z-3 80: the design's 9-to-10 scale (300 to 420) was written for a
  chapter two levels wide.
- From a Chapter 9 end of **25** (the review's wanderer), the same data lands on 26 before ambushes, which `slackOver
  = 1` allows and Chapter 11's band (25 to 28) absorbs; the played line is asserted by `levelCurve.test.ts` once the
  route reaches `@chapter10-end`.

**Gold:** about 2,500 to 3,500 in; Z-6 400 (scaled from 600), its crew 300, the ambushes about 100 to 150 each
(`ENCOUNTER_GOLD_PER_LEVEL` 4 x 24 to 25 x foes), Z-3 60. Out: the Harbor forge's tier-24 pieces (a plain steel
blade, an oilcloth coat, a longbow: Kingsmere's three, about 2,750 together, for a player who skipped them; the
built tier-8 pieces shown honestly), soup and kasav, the gift to a Wealth house at the Muster (section 7.0: 100 gold
= 1 point, the guide's rule, offered at the Ironvow and Agnivansh camps). Nothing in the chapter requires spending,
but a player who gives gold here changes who is bought tonight, and the Journal says so.

---

## 6. The required-before gate: "Until the allies are seated"

- **In the story:** the Chancellor has set the condition (beat 2) in the city's words, and the camp shows the three
  feuds before anyone names them (beat 1). The Cane Road's crates and the mill are the cane cutter's ("Bandits by day,
  smugglers by night", his built `danger` node, with a Chapter 10 line: "And now carts. Carts don't grow in cane,
  archivist.").
- **In the Journal:** the objective **Until the allies are seated**, `followSide`, `noXp`, done when the three
  mediations are settled (`debate.zetwal_feud_merchants.settled`, `debate.zetwal_feud_temple.settled`,
  `debate.zetwal_feud_crown.settled`: joined or mediated, the built `settled` flag) and Z-6 and Z-3 are done, **or**
  when `story.council_voted` is already set (a save mid-vote never sticks).
- **On the map:** the Speaker in the Hall is worded from the flags until then ("The Ironvow and the Dorini are still
  shouting across the fountain." / "The grey ones and the saffron ones will not stand on one island." / "Nobody will
  sit with Kingsmere's people." / "There are Crown muskets in the cane and you are the envoy." / "The cutter's boy is
  still at the mill."). Anissa: "Your Quests page, Gigi."
- **The dusk and the night are conditions** (`story.chain_raised` and not `story.inspection_done`; `story.inspection_done`
  and not `story.fleet_sailed`), not flags some dialogue must remember to set (the Chapter 6 review's 3.11).
- **Order the arrow follows** (the city the short way): the harbor (Jordyn's landing: it fires on the way back from
  the Hall, beat 3), the house (Rahel), the Iron Market (the first feud, on the way to the plaza), the Temple island
  (the blessing, the second feud), Accord Square (the third feud), the Cane Road (Z-6 and Z-3; the Marshal's stone on
  the way back), the Hall.
- **No soft-locks:** the mediations never Game Over (debates are not fights: the built test); Provoke does not settle
  a debate (the engine: only won or mediated set `settled`), so a provoked feud is retried, and the built
  `mediate` is reachable (Influence 5 at Zetwal: the Chapter 1 route leaves every player at 5 or more: the temple
  record and the four required side quests' +1s, plus any book); the crew fight is winnable and Game Over returns to
  the landing's crates; the Cane Road's ambushes return where they began; the cellar's bar can be dropped any number
  of times (a second `use` is a line); the betrayer's walker fires once per night and the quay's trigger fires again
  until `story.betrayal_seen`.

---

## 7. The two required side quests and the three mediations (the required debate)

### 7.0 The price, gathered from Chapters 3 to 9 (the realm economy the Muster reads)

The seven prices, as the chapters' outlines (with their reviews' fixes) left them, side by side for the first time
(the Chapter 7 and 8 reviews asked for this table):

| Ally | Price (guide 6.3) | Paid, as the chapter counts it | Range a player leaves with | Token (Se-5) | Companion | Betrayer seed |
|---|---|---|---|---|---|---|
| **Free Brasador** (Ch. 3) | Fear 6 | not counted: "Fear 6, owed, paid at the Muster" (the Journal note) | the realm's running Fear (every Break, every six wins): 4 to 12 by Chapter 10 | none (Ardencia's chair is the Rodriguez claim, Chapter 12's) | Azzy | not in the pool |
| **Al-Doria** (Ch. 4) | Influence 10 | no scene; `pillar.influence.al_doria` (13 books, the debate, A-1 and A-3's +1s) | 3 to 16; the review flagged books over the price | **not given**: the Muster gives it (Rashid, beat 9) | Samira | **Admiral Rashid** (no seed before now: beat 1 introduces him) |
| **Skarragol** (Ch. 6) | Wealth 10 | `pillar.wealth.skarragol`: the purse +3, Samira's letter +1, the jarl +3, S-3 +1 | **2 to 8** | horse-hair braid | Bayarmaa | Chief Hrafn |
| **Kuroshi** (Ch. 7) | Influence 10 | `pillar.influence.kuroshi`: the receipts +2, the letter +1, the petition +1, Samira's offer +1, books, K-2 +2, K-3 +1 | about **7 to 16** (the review: the floor is 7 to 8) | paper crane | Haru | Councillor Mibu |
| **Jwaladesh** (Ch. 8) | Wealth 8 | `pillar.wealth.jwaladesh`: the store +3 (or +1 if Dhanraj broken, the review's fix), the advances +4 if given, J-2 +1, J-3 +2 | **4 to 11** | brass lamp | Vikram | Steward Prakash |
| **Aldermoor dissidents** (Ch. 9) | Fear 8 | `pillar.fear.aldermoor`: Al-3 +3, the Hushed +1, Jordyn +1, a Break +1, the Heath's wins | **5 to 8** | none (not a house at the chair) | Edmund | not in the pool |
| **Xaraguá** | Influence 8 | the war is theirs; Anaco is a prisoner, the resistance in the caves; not at the Muster | Chapter 11's | Yari's | Yari | not in the pool |

**What the Muster reads (Claude's call, section 12; the ally ledger of section 10):**

- **A house's share is its city's pillar in its price currency, divided by its price**, as the four outlines' Journal
  notes ("Yours here: N") told the player it would be: the number they have been shown is the number that is used.
  The guide's "other currencies at half value" is kept (the Chapter 7 review asked for a decision): the city's other
  two pillars count at half, so a reader who read every Skarragol book is not at 2 of 10 but about 4. **Books count at
  most 3 toward a price** (one line in the ledger): otherwise Al-Doria's thirteen books put it at 1.3 and it can never
  be bought, and the guide's "ties go to Dorini" never fires.
- **Free Brasador and the dissidents read the realm's running Fear** (the guide's "your running scores"; they want
  proof the Crown's men can be beaten, which is a thing the whole road shows): Free Brasador 6, the dissidents 8, and
  Chapter 9's Fear at Aldermoor counts into it as it does for every city. Neither is in the betrayal pool; their
  shares set their soldiers only.
- **The betrayer** is the least share among Al-Doria, Skarragol, Kuroshi and Jwaladesh, ties to Dorini (guide 5.6).
  With the ranges above, a player who paid everyone's scene sees Skarragol bought (2 of 10 is the commonest floor); a
  player who gave the Crown's purse and paid the jarl (8 of 10) but skipped Jwaladesh's strongbox sees Jwaladesh (4
  of 8) or Al-Doria; a reader who did nothing for Skarragol sees Skarragol. The exposed route (60 percent) opens for
  Skarragol only with the purse and the jarl, for Jwaladesh with the store signed over, for Al-Doria with the books
  and both quests, for Kuroshi almost always: four different endings to the night from four chapters' choices, which
  is what the design wanted the prices for. On a replay the buyer can be forced to a different house by paying
  differently; nothing else is needed for the guide's "on a replay".
- **Soldiers (`army.<group>`, read by the built `armies()` and Chapter 11's volleys):** each ally's base number
  (`ARMIES` in config, proposals: Zetwal's levy 60, the Ironvow 50, the Dorini 40, Free Brasador 30, the Agnivansh 30,
  the Suzumori 20, the dissidents 12 ("seven and the barn's lot")) x min(1, share), plus 10% per point overpaid
  (guide 6.3), x the feud's outcome (mediated 1; argued and won: the house argued against 0.75; argued and lost: both
  0.75), rounded; the betrayer 0, or 0.75 if turned. A full Muster is about 240 soldiers, a thin one about 140:
  twenty-four or fourteen volleys at `ARMY_VOLLEY_PER` 10 across Chapter 11's three stages, which Chapter 11's outline
  tunes (section 14).
- **Gifts at the Muster** (the debt collected, shown): at the Ironvow and Agnivansh camps a *Give gold* choice (the
  Chapter 6 jarl's shape, 100 gold = 1 Wealth, up to the shortfall; Samira: "Buying an army is the one purchase my
  mother would approve of."); at the Dorini table and the Suzumori stage nothing is for sale ("Influence is not bought
  here. It is the one thing we sell that we will not buy."). The Journal's seven notes update their "Yours here: N" to
  a last line, *At the Muster: N of P. Soldiers: S.*
- **The tokens:** the three carried are the chamberlain's (Se-5, Chapter 12). The Dorini token is given here by Rashid
  when Al-Doria's share is at least 1 (the guide's "paid in full", the Chapter 6 review's rule applied the one place
  it can be applied cleanly), else withheld with a line ("The guild sits when the guild is paid."), and given at the
  Claim by Layla if Al-Doria is kept. Free Brasador and the dissidents give none, as Chapters 3 and 9 said.

### 7.1 Muskets in the Cane (Z-6; the Echo puzzle M-ZET-2; the exposed route's second piece)

- **Opens:** the built crates on the Cane Road (`smuggler_crates`: "Crates stamped with the Crown seal... Someone is
  waiting for a buyer."), from `story.muster_begun`. Shows as *??? The crates in the cane* until read; accepted when
  the cane cutter is spoken to after them (`side.muskets.accepted`): "Carts, archivist. Every night since the first
  ship came in. To the mangroves and back empty. Somebody in your harbor is buying what's in those crates, and it
  isn't the Marshal."
- **Steps:** 1) **The cart tracks** to the mangroves (the built track south at (24, 14) to the smugglers' landing; the
  ambush layer is on). 2) **The crew** at the landing (placed: the chief on a crate, the smuggler, two lookouts in the
  mangrove's edge; a step trigger that fires again until won): "You saw cane. Say it." The fight `mangrove_crew`
  (section 5). After it, on the map (the scripted Yield, the chapters' shape): the chief on the sand, the crew gone
  into the mangroves; **the choice, both remembered:** *"Take the ledger and go. Tell whoever paid you that Zetwal
  reads."* (`choice.crew_spared`; +1 Influence at Zetwal) / *"Walk him up the Cane Road past every field he carted
  through, and let the Ironvow look at him."* (Bayarmaa's line; `choice.crew_broken`; +2 Fear at Zetwal: the
  design's "+2 Fear or +2 Influence by Yield"). 3) **The ledger** (`item.smugglers_ledger`, key): consignments of
  muskets "for the Muster's friends", each under a closed hand, and beside the last a captain's sigil drawn in the
  margin: *the sigil is the betrayer's house's* (text by `muster.betrayer.*` once resolved; before the night it reads
  "a sigil you will know when you see it on a banner", because the house is not decided until the night: section 10).
  Haru: "The closed hand again. Kayla's list named the mark and cut the name out. This one drew it." 4) **The
  cellar:** the ledger names "the second cache under the mill"; the mill's cellar door (new, on the built mill at
  (35, 3)) opens into `zetwal-mill`: the cache behind an inner door that stands open, muskets stacked, a lantern, and
  the air shimmering on the cellar floor. **The Echo (M-ZET-2, PUZZLES.md kept exactly):** the mill fifty years ago
  was the Revolution's powder store; young Patricio and a **powder-master** (an Echo NPC, one line: "Bar it from the
  outside when you go, Marshal. Powder doesn't need company."); the inner door's **oak bar** is an Echo-era puzzle
  object whose `use` drops it across the door (**anchor**, `anchor.mill_bar`). Caona and Benny are one line each, not
  drawn ("Benny's people are sleeping on the powder. He says it's the warmest room in Zetwal."). 5) **Back in the
  present** the inner door is barred (the anchor; the present door object's second look: shut, the bar fifty years
  old): the cache is sealed in for the levy to take at dawn (shown at the tide: two of the levy carrying muskets up
  the long pier). Anissa, at the stair, holding the door: "They can't get at them now, Gigi. Only us." `side.muskets.done`.
- **Reward:** 200 XP, 400 gold, +1 Influence or +2 Fear at Zetwal (the Yield), the ledger (the exposed route's second
  piece: beat 8), the Journal note *Muskets in the cane*: "Crown muskets for 'the Muster's friends', under the closed
  hand. The second cache is barred under the mill. Somebody in the harbor has been promised them."
- **Why it fits:** the design's quest with its exposed-route role kept (the guide's "Kuroshi-grade evidence" is on
  every save since Chapter 7's main story, so the ledger is made the *second* piece rather than a substitute: Claude's
  call, section 12); the chapter's only fight with a name; the chapter's Echo puzzle (difficulty 2: the hints
  "They keep going back to the mill, Gigi. What's under it?" / "The mill was a powder store in the war. Stores have
  doors that lock." / "In the memory, drop the bar across the cellar door. Then come back." as PUZZLES.md); the wild
  section walked by a required quest (the Chapter 8 and 9 pattern); and the Crown's hand shown arming its purchase
  before the purchase is seen.

### 7.2 The Lonely Cutter (Z-3, rewritten around an absence)

- **Opens:** the cane cutter, after Z-6 is accepted (`side.muskets.accepted`): "And Ti Jak. The cutter's boy. He's at
  the mill every night, waiting for the veiled one, and she doesn't come. She hasn't come since the ships. He won't
  cut cane and he won't come home." Accepted when spoken to (`side.lonely_cutter.accepted`).
- **Steps:** 1) **Ti Jak at the mill** (placed by the cold hearth, the built `mill_ruin`'s "Fresh ashes in the hearth:
  someone sleeps here"): a boy of sixteen with a cutter's blade across his knees. "She said she'd come back. She
  always came back. She said the quiet would have me when I was ready." (The veiled woman is in Kingsmere's cells
  or shown to its city; if `story.watcher_met`, Gianna knows exactly who; else the boy's description is the first
  the player hears of her.) 2) **A conversation, not a fight** (the design's three appeals, in the built debate's
  shape as a three-choice dialogue with a right pair): **Compassion** (he lost his mother last year; say her name
  with him: it is on a name stone, and a reader of the stones knows it), **Reason** (needs the built *A Quiet Crown
  Tract* read: "Ask who holds the debt now": Gianna: "She held your debt. That's what the bread was. The bread's gone
  and the debt went with her.") or **Scripture** (the Gaze: "She remembers you. You are not alone, and you never
  were."). Either of the right two works; the wrong one (Reason without the book is not offered; the wrong one is
  Scripture said first, before he will hear it: he turns his face away, try again). 3) **Anissa's line to Ti Jak**,
  the design's "her first line to a stranger" kept as a step after the blessing (it opens after `story.blessing`, so
  it is her second, which is the arc: a name said to family, then a sentence to a stranger): she goes to the hearth
  (the follower's `walk`) and sits by him: "She looked at me too. On the road. I didn't like it. You don't have to
  like it either." He looks at her. "...No." 4) **Walk Ti Jak home** (a walker follows the party to the east gate;
  he goes in; the cane cutter at the gate: "He came home.").
- **Reward:** 80 XP, 60 gold, +1 Influence and **+3 Concord** (Zetwal), the Journal note *The lonely cutter*. No
  fight.
- **Why it fits:** the design's quest ("fits the return in Chapter 10"), with the veiled woman's absence made its
  point: the Hushed fell in Chapter 9, and the cells she left behind are a boy at a cold hearth; the guide's
  sensitivity rule (loneliness and debt, not caricature) kept exactly; and the step on *Anissa finds her voice* that
  the design asked for ("her first line to a stranger"), placed after the blessing so the chapter's two Anissa lines
  are a name and then a sentence.

### 7.3 The three mediations: the required debate (guide 5.4, 7.2; the built debate engine)

Each feud is a `DebateDef` (listen, join three rounds, mediate, provoke) in city `zetwal`, so `mediate` is the built
Influence 5 at Zetwal (section 6), and each is **required** (settled: joined or mediated). Mediating is the design's
"seat the feuds" and pays the soldiers in full (7.0); joining takes a side and costs the loser a quarter of their
soldiers (shown: at the inspection the house the player argued against stands a line short); provoking costs Concord
and settles nothing. The three are the same debate shape the player has used nine times, with the stakes the
Journal's notes have been counting since Chapter 6.

1. **Dorini against Ironvow, *Is a convoy taken on the steppe stolen or taxed?*** (the Iron Market, under the clock
   gate, between a Dorini convoy's crates and an Ironvow horse tied to the market's rail). The ally is **Rashid's
   clerk** (a merchant's register: "A convoy is a contract with the road. Your riders broke it, and the guild has the
   receipts for what they took."); the opponent **Hrafn** ("The steppe has no road. It has grass, and whoever rides
   it. You paid the Crown's toll for fifty years without a word; you can pay ours for one convoy."). **Reason needs**
   one of *Harbor Tolls and Roads* (built, the Hall), *The Crown's Offer* (Chapter 6's Moot book) or *On Contracts*
   (Chapter 4's). The rounds' claims: the convoy; the blockade's cost; who sails first. The strong answers: Scripture
   (the Gaze remembers both: the raid and the blockade that caused it), Reason (the Crown's toll is the thing they
   both paid, and it is the thing they are sailing against), Compassion (Samira's line, given to Gianna: "Three
   winters of fish and no salt. Three seasons of a convoy. Both of you are poorer because the Crown wanted you to
   be."). **Mediate:** Samira's trade letter from Chapter 6 (Dorini salt at the old price, which she wrote at the Moot)
   is read aloud as the thing already agreed; Rashid's clerk and Hrafn shake hands over the horse (shown). Samira:
   "That letter is the most expensive thing I have ever written, and I am going to invoice both of them for it."
   (Away from Anissa, who is at the market's door with the goat herder.)
2. **Suzumori against Agnivansh, *Can a burned temple be rebuilt by the hands that burned it?*** (the Temple island,
   at the Gaze lamp, between a crane and a lamp set on the lamp's step: the Chapter 8 crane that sat on Agnipur's
   altar for one night is Gianna's to set down). The ally is **Prakash** (saffron, exact: "They burned the temple on a
   paper that was false. They knew it was false. The elder who signed it is still alive and still sorry, and sorry
   does not rebuild a roof."); the opponent **Mibu** ("We burned it on the Crown's word. We have stopped taking the
   Crown's word. What else would you have us stop?"). **Reason needs** one of *The Burned Temple* (Chapter 7's library),
   *The Priests' Decision* (Chapter 8's Court) or *The Four Hands* (built, the Temple Archive). The strong answers:
   Scripture (the Gaze: a thing done is remembered, and so is the hand that stopped doing it), Reason (the paper was
   the Crown's; both houses were written down as *the ash* on the same page, which the player heard read in Chapter
   5), Compassion (Vikram's line, given to Gianna: "He stood in front of our flame, Meera said. That is not an apology.
   It is a beginning."). **Mediate:** Gianna sets the Suzumori crane on the Gaze lamp's step beside the Agnivansh lamp
   (shown: two objects); Haru and Vikram, who have walked three chapters together, say nothing and stand on the same
   step (a `walk` each), which is the thing the two captains cannot do until they see it done. Prakash: "One night on
   our altar. One night on theirs." Mibu closes his fan.
3. **The Stillwater dissidents against everyone, *Are the Crown's own people the Crown?*** (Accord Square, at the
   Signers' statue: "Fifty years ago we promised that no crown would ever again decide who we are."). The ally is
   **the printer** (inked, angry, honest: "I set type in Kingsmere for forty years under a Crown I never voted for. My
   people purged, my families quiet. I am not the Crown. I am what the Crown does to its own."); the opponent the
   **Free Brasador sergeant** (the Chapter 3 and 4 shape, placed: "Crown raiders burned the highland roads when I was
   nine. My father's road. They had Kingsmere accents. I do not care whose vote they had."). **Reason needs** one of
   the four Ash Wars accounts, and a player who has all four (`clue.four_accounts`, Anicette's talk) has the strongest
   answer the chapter offers: "The Crown's chronicle of those roads was written to order by a clerk whose true record
   I carry. The raiders were the Crown's. The clerk was Kingsmere's. They are not the same people; the Crown spent
   forty years making sure you'd think so." The strong answers otherwise: Scripture (the Gaze counts people, not
   crowns), Compassion (Edmund's line, given to Gianna: "He hit a sergeant for a pie-shop boy and said sorry after.
   That is the whole of Kingsmere's people in one act."). **Mediate:** Jordyn, who has not spoken, steps to the
   statue (shown) and says the law: "I arrested the Crown's almoner in the Crown's court. The men behind me left the
   Crown's watch in front of the Crown. If that is the Crown, the Crown has resigned." The sergeant looks at the
   seven violet coats turned inside out and says the thing the owner's Edmund earns: "...Terribly sorry, Captain."
   (Edmund: "That's my line." The one laugh in the square; Anissa is on the Hall's steps with the nursemaid's six.)
   The printer and the sergeant stand either side of the statue (walkers).

Each debate's `after` lines (the two moved on) are the inspection's picture: the houses stand in one line. The
built `zetwal_corner` (settled in Chapter 1) keeps its `after` ("The hooded ones have gone quiet on this corner. For
now.") and the Gaze keeper gets a Chapter 10 line: "Seven camps and nobody shouting about gods. I had not expected to
live to see it." **After the Muster** the corner's rotation (guide 7.2) is Chapter 11's build, not this chapter's.

### 7.4 Books, vendors and the board

- **No new library** (the Temple Archive and the Hall's four are built; the Tales shelf has Volume Two). Two Chapter
  10 lines on built books: the Hall's *The Sun Accord (copy)* (a second look after `story.patricio_told`: "Six
  clauses. The seventh page was read to a clerk in the next room."), the archive's *Ash Wars: A Temple Record* (a
  second look after `clue.four_accounts`: "Forty. The number the Crown's clerk could not write.").
- **Vendors (built; Kreyol greetings as built, checked Nov 18):** the Harbor forge adds Kingsmere's three tier-24
  pieces (section 5) and keeps its stock; the soup vendor's pot ("Soup for the cousins. All of them."), the grocer,
  the charm stand as built; the Iron Market's rows as built, the fishmonger with a Chapter 10 line ("Seven navies and
  not one of them can fry a snapper.").
- **The contract board (`CAPITALS.md` 1's Chapter 10 jobs):** "count the soldiers at the Muster (pays Influence)":
  built as a one-line job at the town guard, done when `story.inspection_done` (+1 Influence at Zetwal: the player
  has just watched them counted); "clear the Cane Road for the army's carts": paid by Z-6 (a line); "carry dispatches
  to the Temple island": after the release.
- **Anissa's nudges** (mystery quests, under 128 characters): "The crates in the cane are still there, Gigi. The
  cutter says carts come at night." / "The grey ones and the saffron ones won't stand on one island." / "Nobody sits
  with the violet coats." / "The cutter's boy is at the mill with nobody."

---

## 8. The Echo: the cellar's bar (M-ZET-2, difficulty 2) and the morning of the signing (information)

### 8.1 The powder cellar (the chapter's Echo puzzle, as PUZZLES.md M-ZET-2)

- **Present:** the mill's cellar, the second cache behind an open inner door, the shimmer on the floor.
- **Echo:** the Revolution's powder store; the powder-master's line gives the rule ("Bar it from the outside when
  you go"); the oak bar is an Echo-era puzzle object whose `use` sets `anchor.mill_bar`.
- **Logic:** bar the door in the memory and the present cache is shut in. Honest difficulty 2 (one object, one verb,
  one line that says so).
- **Anchor:** the bar (`anchor.mill_bar`), read by the present inner door (two looks) and by the dawn's levy.
- **Hints:** PUZZLES.md's three, kept word for word (section 7.1).
- Files: `puzzles/zetwal_mill/solution.json` (the bar) and `cheats.json` (the present door pulled: "The bar is on
  the other side. Fifty years ago somebody dropped it, or nobody did."); replayed by `tests/puzzles.test.ts`.

### 8.2 The morning of the signing (the plaza's Echo, Chapter 10's scene; no anchor; `onEcho`, restartable)

- On the built `plaza_stone` zone, from `story.muster_begun`: the camp's tents as built, and between them two armies
  drawn up on the paving (Echo-era crowd layers: Zetwal's companies in red revolutionary coats, Brasador's black
  coats, Caona's scouts in a loose line by the harbor road), the half-built stage (built: "Tomorrow two armies and the
  Crown's envoy will stand on it"), the stone pile (built). Young **Patricio** (the player) at the stage's foot with
  the whistle; **Benny** and **Caona** placed (the built looks); the Crown's envoy coming up the harbor road with two
  marines in the old uniform (walkers; his face in shadow under his hat, as the intro's storyboard asks).
- **The lines:** Benny: "Six pages, Patricio. I read six. I will not sign what I have not read, and I will say so on
  the stage if I must." Patricio (choice, both remembered, `choice.patricio_signing`): "There are six." / "Then say
  so. Loudly." Caona: "Then we sign six, and we remember that we signed six." The drummer (built): "When it's signed
  I'll drum till my hands give out." The whistle: Patricio blows it (the audio slot: the same two notes the present
  hears at dusk), and the two armies come to order (a `sync`): the thing the present's inspection repeats with seven.
  The Crown's envoy reaches the stage's foot and lifts his hat to Patricio, and the scene ends on it.
- **What it gives:** `clue.signing_morning` and the Journal note *The morning of the signing*: "Fifty years ago two
  armies stood on this ground and signed six clauses. Today seven stand on it, and the seventh page is in Gianna's
  bag." No Rael line, no anchor. The present's inspection (beat 7) is this picture with seven lines, which is what
  STORY's "the same place, armies then and now" asks for.

---

## 9. The family, the companions and Anissa: how the beats are played

### 9.1 Rahel and Patricia (FAMILY.md, settled)

- **Rahel on the map:** tall, straight, a black shawl, a Brasador brooch, a steppe braid: six children by three men,
  from three countries, and she wears all three. She arrives on Jordyn's arm, takes Azzy's face in her hands, chooses
  the kitchen over the pier, and sits Anissa beside her. **The rule for her lines (the locked rule):** she knows the
  girls are her son's (Kayla, Aiyana and Jordyn's precedent: the family knows), and says so by sitting them at her
  side and by nothing else; she says one line about him that reads either way ("My son does not explain himself...
  So I have heard said. In three countries. By people who were not in the room."); nothing about the marriage, the
  thumbprint, the gold or the arrows. A content test checks no Rahel or Patricia line contains "good", "innocent",
  "feeds", "the arrows", "thumbprint" or "oath", and the reviewer prompt asks for a human read of every one (the
  Chapter 7 to 9 rule).
- **Her line for Azzy** (FAMILY.md): "Your grandfather's name, your father's jaw, and from me you got nothing but the
  temper. Use it on the Crown. Not on him." ("Him" is the Crown's man in front of him, or his father, as the player
  reads it; tested with the rest.)
- **Rahel and Anicette:** two grandmothers at one table who say "Madame" and the peppers, and nothing else about the
  past. STORY's open question 13 (does Patricio know?) is not settled here and no line leans on it; Patricio and Rahel
  share one exchange, at the lamp, about the war ("Benny asked after you. Every year. He never wrote." / "Neither did
  I."). If the owner answers 13 before Nov 8, two lines move; the scene does not.
- **Patricia on the map:** small, white-haired, a cane she does not use; she looks at everything once and counts it
  ("harbors lie"). **The blessing** is at the Gaze lamp, one great-grandchild at a time, each told what they carry,
  and Anissa asked her name. Her one line about anyone reads either way ("Things in halves are the only ones worth
  keeping"). She says nothing about Rael at all: she is "the family's memory", and the family's memory is that it
  says nothing.
- **Placeholder looks:** `rahel` (as above), `patricia` (as above); art through `ART-PROMPTS.md` when the outline is
  approved; on the drop-2 list with the chapter's banners. **Later:** both on the pier at the tide; the Hearing if the
  owner wants every Titi there (the Chapter 7 and 8 outlines' line).

### 9.2 Joaquin and Jordyn

- **Joaquin** (FAMILY.md: "young, loyal, torn"; Chapter 3's "Present! ...Fire!"): he brought the strand because he
  gave the order and "could hardly stay". He says whose order it really was to nobody; Azzy's "He gave it anyway"
  (Chapter 3) is the only reading the chapter allows, and Joaquin's line is the one time ("I gave the order."),
  which is true. He commands Free Brasador at the inspection and sails with it. Placeholder look: the Chapter 3
  `joaquin` (on the wall), without the sash.
- **Jordyn** keeps her three acts' register (the law where she stands): she lands her company, names it exactly,
  mediates the third feud by saying what she did, and arrests the betrayer by the book if the route exposes him. One
  line to Anissa, no joke, on the pier at dawn: "You held a door for an hour in a keep. Hold the rail." Placeholder:
  Chapter 9's `jordyn`, the coat inside out.

### 9.3 Anissa in this chapter

- She is looked at by Rahel, Patricia and the recruiters; she is spoken to by Rahel ("They tell me you glow"),
  Patricia ("And who are you, child?"), Ti Jak, Haru ("Seven. I counted too."), Patricia again at the tide. She is
  never hit, never a target (the Cane Road's Husher is the only Seize, and Gianna steps in, as built), never in a
  fight (the crew's fight is Gianna's and the four's). **Her two lines on the thread** (STORY 4: "she speaks at the
  Muster"): her name said to Patricia ("Anissa. I hold the door."), and a sentence to a stranger (Ti Jak). Her
  observation at the harbor ("He walked like the lady with the basket") is the chapter's one line joining the
  betrayer to the Quiet Crown, and it is hers because she is the one who watches how people walk (Chapter 9's "She
  looked at him, Gigi. Just for a second."). Her Surge gesture is at stage 4 (`SURGE_ANIM_STAGE`): sure.
- **No comedy in a node with her:** Salkhi is on the Cane Road and the Heights and never on the island or in the
  house; Samira prices nothing in the kitchen or at the lamp; Edmund's one apology is on the deck; the sergeant's
  "Terribly sorry, Captain" is in the square with Anissa on the Hall's steps; Vikram's breath is on the Chain Bridge.

### 9.4 The betrayer's companion (STORY 6.9: stays, defies a second time, one scene)

Four variants, one line each at the customs house, in the register each chapter gave them; the companion stays either
way (the proposal's "stays"), and the second defiance's **scene and stat boost are Chapter 11's** (the proposal), so
this chapter writes only the line that starts it:

- **Bayarmaa** (Hrafn): "You sold my grandmother's ships twice, Hrafn. The Moot wrote the first down as shameful. I'll
  write the second." (If turned: she takes the standard from his rider: shown.)
- **Haru** (Mibu): "Councillor. You ordered us neutral and sold the files that made it a lie. I was definitely not a
  spy. You definitely were."
- **Vikram** (Prakash): "Steward. You kept the flame a secret from the city and sold it to the Crown for oil. I'm out of
  breath and I'm *still* going to argue with you." (Away from Anissa, who is at the quay's head with Rahel's hand on
  her shoulder.)
- **Samira** (Rashid): "You run my mother's convoys and you've just sold her guild. I'll price that for you. It's
  everything."

### 9.5 The four captains before the night

Hrafn, Mibu and Prakash arrive as their chapters' seeds (alive and unconvinced); **Rashid is new** and is given a face,
a line and Samira's one-sentence placement in beat 1 so that a Dorini betrayal is not a stranger's. Each captain's
day lines are the same whichever is bought (nothing in daylight names the house), and each has a night placement by
`muster.betrayer.<house>` and a dawn placement (gone, or in the Hall's cell, or standing with his company if not
bought). The envoys' chapters' rulers (Torvald, Kaede, Meera, Layla) do not come: a ruler who sends a captain can
disown him at the Claim, which is why the Crown buys captains.

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **The ally ledger** (`engine/ally.ts`: `allyShare(flags, rpg, house)` from `ALLY_PRICES` in config: price, pillar, city or realm, cross-currency at half, books capped at 3) | `localPillar`, `globalPillar`, `pillarRules`; no prices | one pure module (about 60 lines), `ALLY_PRICES` and `ARMIES` in config, a test with the four ranges of 7.0 | a hand-set `muster.betrayer.skarragol` for the release (the commonest outcome), which loses the design's choice | 0.3 |
| **`resolveMuster`** (runs when `story.inspection_done` is set: names the betrayer, sets `muster.exposed_possible`, pledges `army.*` by share, overpay and the feuds' outcomes) | flag-driven changes in `game.ts` (the Chapter 2 attack's pattern) | one function (about 80 lines) called from the flag-set path, a test for the four houses and ties | the fallback above | 0.3 |
| **The three mediations** (`DebateDef` x3 in `zetwal`, `opensIf` by `story.council_condition`, `after` lines) | the built debate engine (`settled`, `mediate` at Influence 5) | data (three debates, nine rounds) | none needed | 0 |
| **Z-6's crew** (`crew_chief` with `withdraws`, the Lookout's `hire` + `once`, `protects` on the crew; `mangrove_crew` with `endsWithBoss`, `boss` for the Grudge) | all built | data | none | 0 |
| **The return ambush table** (`cane_road_muster` at 24 to 25; the built layer's `if` narrowed) | `cane_road` at 6 to 9 | one table, one line in `zetwal-road.ts`, the Foes page | the built table (grey tags, no fights: wrong) | 0.05 |
| **The mill's cellar** (`zetwal-mill`, the zone, the bar's anchor, the two door looks) | the map tools, anchors | one small map (about 0.15), `puzzles/zetwal_mill/` | none | 0.15 |
| **The camp, the ships, the chain, the fire, the lines** (crowd layers and objects by flag; the dusk and night as conditions; the betrayer's four walkers by boolean flags) | crowds by `if`, objects by `if`, walkers | map data (the Chapter 1 maps touched: `zetwal-town`, `-harbor`, `-heights`, `-road`, `-temple`, `-square` get Chapter 10 objects with `if: 'story.muster_begun'`; nothing Chapter 1 reads changes) | lines | 0.1 |
| **The whistle's audio slot** (two notes, in the Echo and at dusk) | `audio.config.ts` slots | one slot | a text line | 0.02 |
| **The voyage** (`zetwal_xaragua` reused with Chapter 10 captions: a second `VoyageDef` `zetwal_xaragua_war` sharing the path) | `VoyageDef` | one entry | the Chapter 1 captions | 0.02 |
| **The Dorini token** (`item.token_dorini`) | key items | data | none | 0 |
| **The active-order flag** (`party.active`) | Chapter 8's (assumed built, used by Chapter 9) | data | the first-four rule: Gianna, Yari, Azzy and Samira active, which benches every road companion: playable and wrong; the Chapter 9 build's first check | 0 (assumed) |
| **Rahel, Patricia, Joaquin (sashless), Rashid, the printer and the sergeant on stage** (walkers, placements and stage actors per scene) | `enter`, `walk`, `place`; followers hard-coded | stage actors per scene (the Chapter 8 and 9 reviews' cost: about 0.25 for the chapter) | placed per scene | 0.25 |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 10), `MARKS` | `ACT10` in `quests.ts`; `'11'` in `MARKS`; the route to `@chapter10-end`; `?chapter=10`; `XP_PER_OBJECTIVE_BY_CHAPTER` row 10 | none | 0.25 |

About **one and a third builder-days** of engine and wiring, of which the ally ledger and `resolveMuster` are the
only parts that are not data, and both are small, pure and tested. Nothing here needs a new status, an Echo battle,
a Yield step, a timer, Calm, a party-order screen or a region level. The economy foundation the Opus plan review
asked for before Chapter 3 arrives here, where it is first read, in the smallest shape that reads what Chapters 3 to
9 already wrote into the city pillars.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts`; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **Rahel** | Rael's mother; the kitchen scene; the line for Azzy (9.1) | tall, a black shawl, a brooch, a braid; `rahel` | the pier at dawn; the Hearing if wanted |
| **Patricia** | the eldest; the blessing (9.1) | small, white hair, a cane; `patricia` | the pier at dawn; the Hearing if wanted |
| **Joaquin** | Free Brasador's captain (9.2) | Chapter 3's `joaquin`, no sash | Chapter 11's volleys |
| **Jordyn** | the watch; the third feud; the arrest (9.2) | Chapter 9's `jordyn`, the coat inside out | Chapter 11's company |
| **Edmund** | the party; one apology; "That's my line." | Chapter 9's member look | |
| **Admiral Rashid** | the Dorini captain; the Dorini variant (9.5) | green coat, a ledger, a seaman's queue; `rashid` | the Betrayer (Dorini) in Chapter 11, or the Claim |
| **Chief Hrafn**, **Councillor Mibu**, **Steward Prakash** | the captains (9.5) | their chapters' looks | the Betrayer variants |
| **The Crown's consul** | the purchase (beat 8) | the built `crown_consul` | the Hearing's Crown voice, if any |
| **Old Patricio**, **Anicette** | the pier, the stone, the whistle, the talk | built | the Hearing |
| **The Chancellor**, **the Speaker**, **the Senior elder**, **the Harbor councillor** | the council (beats 2, 6) | built | |
| **The printer**, **the Free Brasador sergeant** | the third feud | Chapter 9's `printer`; the Chapter 3 `free_brasador` | |
| **The lawspeaker's rider**, **the signal master**, **the junior priest**, **Layla's clerk** | the houses' seconds (the exposed route) | their chapters' looks (the rider new: a recolour) | |
| **Ti Jak** | Z-3 | a cutter's blade, sixteen; `ti_jak` | |
| **The powder-master** (Echo) | M-ZET-2 | the Chapter 1 `echo_builder` recolour | |
| **Young Benny**, **Caona**, **the Crown's envoy** (Echo) | the morning of the signing | the built looks | |
| **The cane cutter**, **the lookout keeper**, **the old sailor**, **the harbor kid**, **the recruiters**, **the soup vendor**, **the town guard**, **the Gaze keeper** | Chapter 10 branches on built people | built | |
| **Road Bandits**, **Smugglers**, **Lookouts**, **Zealots**, **Hushers**, **Mangrove Crabs**, **the crew chief** | the Cane Road; the mangroves | built looks; the chief a smuggler recolour with a red cap | |

Voices: Rahel in short declaratives with the whole family in them; Patricia in questions she already knows the
answers to; Joaquin like a soldier who was a boy last year; the Chancellor exact and tired; the captains in their
chapters' registers until the night, when the register is the same and only the sentence changes; the consul
courteous to the end. Nobody in Pòdlimyè sounds like Kingsmere: people here say everything plainly, which is why the
Crown's man speaks last and lowest.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**None required.** Two near-misses, both resolved as Claude's calls with the reason; if the second review disagrees,
either becomes a pop-up with the recommendation first and the build goes ahead on it:

- **Near-miss 1: Anissa says her own name to Patricia ("Anissa. I hold the door.").** STORY 4's thread has "she speaks
  at the Muster (proposal)". A sentence said to family, in front of the lamp where she woke, is the smallest true
  step on it and changes nothing in the flow; a speech to the armies would, and the owner's "a sentence, not a
  speech" (the Chapter 9 outline's reading) is kept. *Recommendation:* the sentence.
- **Near-miss 2: the Marshal learns about the seventh page here** (STORY 6.13's Oct 22 note names Chapter 10 as the
  payoff). He admits he sealed what he counted and remembered the wrong thing; the stone stays blank by his word.
  It changes no beat after it and settles nothing about the marriage (question 13 stays open). *Recommendation:*
  keep it; it is the note's own placement.

The Claude's calls, each with its reason:

- **The ally ledger reads each house's city pillar in its price currency, other currencies at half, books capped at
  3; Free Brasador and the dissidents read the realm's running Fear; the betrayer is the least share, ties to
  Dorini; the exposed route needs 60 percent, the buyer's list and Z-6's ledger.** *Reason:* the numbers the Journal
  has shown the player since Chapter 6 are the numbers used; the guide's half-value rule and tie rule kept; the
  book cap is the Chapter 4 review's flag answered; Z-6's ledger as the second piece because the Kuroshi evidence is
  on every save.
- **Armies are pledged by share, overpay and the feuds' outcomes, in `ARMIES` numbers that total about 240 full and
  140 thin.** *Reason:* `COMBAT.md` 11's volleys need a number; the guide's "overpaying adds soldiers"; mediation must
  cost or pay something the War can feel. Chapter 11's outline tunes the volley economy.
- **The three mediations are three `DebateDef`s in Zetwal and are the chapter's required debate.** *Reason:* the plan's
  "the debate as a required quest" and the design's "three mediations with Concord" are the same thing here; the
  built engine does it as data; Influence 5 at Zetwal is on every save.
- **The betrayal is shown at the Old Harbor at night (the captain walks to the Crown's launch under the point) and
  the exposed route is the house's own second and the companion turning it, with Jordyn's arrest.** *Reason:* the
  owner's rule: a purchase is a thing done, so it is walked; "turn them into a late ally" is the house turning, not
  the captain; the arrest by the book is Jordyn's register.
- **Rashid is introduced in daylight with Samira's one line.** *Reason:* COMBAT names him and no chapter placed him; a
  variant the player can get must have a face before the night.
- **Z-6 and Z-3 are the required two; Anicette's four-accounts talk is a main-story beat; the Quill's bonus and the
  board's dispatches are after the release.** *Reason:* Z-6 is the Echo puzzle, the fight, the wild section and the
  exposed route's piece; Z-3 is the cheapest quest in the game (no map, no fight) and the thread's step; the talk is
  one conversation on a built character and pays the Concord bonus the design promised; the Opus minimum's "after"
  for the talk and Z-6 is answered by their cost.
- **Z-3 is rewritten around the veiled woman's absence.** *Reason:* she is in Kingsmere's cells or broken before its
  city (the owner's Oct 22 yes), and a boy waiting for someone who will not come is the better scene.
- **The crew chief at x3 / x1.3 with `protects` on his crew; nobody dies; the Yield is a choice.** *Reason:* the sim;
  the reviews' decoy finding; the design's "+2 Fear or +2 Influence by Yield".
- **The Cane Road's return is a second table at 24 to 25, trios, with the built table narrowed to the Chapter 3
  start.** *Reason:* the built table is at 6 to 9; pairs are trivial at 24.
- **`XP_PER_OBJECTIVE_BY_CHAPTER` row 10 = 40; Z-6 200, Z-3 80.** *Reason:* section 5's sums; a one-level chapter.
- **Elodie is not at the Muster; the Chancellor governs and Patricio musters; Gianna gives the whistle back for the
  day and takes it to Xaraguá.** *Reason:* the Chapter 5 outline keeps her at the Parley; the built item text says he
  musters with it; Chapter 11's volleys want a thing in Gianna's hand.
- **Patricia's blessing is at the Gaze lamp; Rahel's scene is in the Limyè kitchen; Rahel and Anicette say
  "Madame".** *Reason:* FAMILY.md's places (Pòdlimyè) and the lamp's meaning; a kitchen is where the family says
  things, and what these two say is nothing, on purpose.
- **The harbor chain and the signal fire are raised and lit, by the Harbor councillor and by Patricio.** *Reason:*
  two Chapter 1 lines ("I asked the council to raise the old harbor chain"; "Nobody has asked me to light it. Yet.")
  paid as things done on the map.
- **No Echo battle; the plaza's Chapter 10 Echo is the morning of the signing with a remembered line.** *Reason:* the
  design's "the plaza on the morning of the signing"; a parade is not a fight; Chapter 11's harbor is next.
- **Names are proposals** (Rashid, Hrafn, Mibu, Prakash from COMBAT; Rahel, Patricia, Joaquin, Jordyn from the owner;
  Ti Jak from the design; the powder-master by role); the build names people by role until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapters 6 to 9's estimates:

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the long pier, the whistle given back | ~40 | 1 | ~25 | |
| The plaza camp: Joaquin, the captains, the recruiters, the Echo | ~70 | 1 | ~40 | |
| Accord Square, the Hall: the council at noon | ~60 | 3 | ~25 | |
| The watch lands: Jordyn, Rahel, Patricia | ~50 | 2 | ~30 | |
| The house: Rahel's scene; Anicette's talk | ~30 | 2 | ~30 | |
| Three mediations (the market, the island, the square) and the blessing | ~140 | 6 | ~90 | |
| Z-6: the crates, the mangroves, the crew, the mill and its Echo; Z-3 at the mill; the Marshal's stone | ~180 | 4 | ~55 | the crew, 1 to 3 ambushes |
| The council's word, the chain | ~60 | 3 | ~20 | |
| Dusk: the inspection, the whistle | ~30 | 0 | ~20 | |
| Night: the betrayer's walk, the harbor, the route taken, the fire | ~70 | 2 | ~40 (x4 variants: ~25 more written) | |
| Dawn: the pier, the tide, the card | ~40 | 1 | ~20 | |
| **Chapter 10** | **~770** | **25** | **~395 written, ~330 heard** | 2 to 4 |

About **28 to 32 minutes** as played, against the plan's "10 minutes plus side content": the ten are the main line
(the pier, the council, the inspection, the night, the tide: about 320 steps), and the side content the plan allows
for is the three mediations, the family's three scenes and the two quests, which the gate makes required. If the
second review wants it nearer twenty, the cuts are in section 16, and the three mediations are the last thing cut.

---

## 14. Continuity into Chapter 11 (Yucayeque, The War of the Harbor; 25 to 28, thirty minutes)

- **The lead:** the fleet sails for Xaraguá's harbor with the Crown's fleet already at sea ("after the Assize");
  the signal fire on Solèy Heights told Yucayeque's hills they are coming (the resistance in the caves, Chapter 2's,
  will have a fire of its own lit when the party lands: Chapter 11's first picture). The voyage `zetwal_xaragua_war`
  (the built path with new captions); `?chapter=11` starts where Chapter 11's outline puts the landing.
- **The armies at sea:** `army.zetwal`, `army.free_brasador`, `army.skarragol`, `army.kuroshi`, `army.jwaladesh`,
  `army.al_doria`, `army.aldermoor` as section 7.0 pledged them (one of the four middle ones 0 or at three
  quarters); `armies()` shows the total in the menu; Chapter 11's three stages call them in by the whistle
  (`item.marshal_whistle` in Gianna's hand: "Blow it at Xaraguá. Somebody will answer."), a volley per
  `ARMY_VOLLEY_PER` 10; the companies' captains (Joaquin, Jordyn, Hrafn or the rider, Mibu or the signal master,
  Prakash or the junior priest, Rashid or Layla's clerk) are the names in the volley data.
- **The betrayer:** `muster.betrayer.<house>`; `muster.betrayed` (the flank fight in that house's variant: Hrafn's
  *Warpath*, Mibu's *Marionette*, Prakash's *Endless War*, Rashid's *Paid Off*; COMBAT 13.3 #8, level 26) or
  `muster.turned` (the flank fight skipped; the house at three quarters; the captain in the Hall's cell, which the
  Hearing may want). The betrayer's companion stays and has their second-defiance scene and stat boost in Chapter 11
  (STORY 6.9): the line that starts it is written (9.4).
- **The party leaves with:** the nine, Salkhi (on the Ironvow ship), **level 25** (section 5; 26 for a wanderer from a
  Chapter 9 end of 25), the Echo party unchanged, gold about 2,500 to 3,500 less gifts and the forge; key items plus
  **the smugglers' ledger**, the Dorini token if given, Anicette's kasav, the whistle; flags `story.muster_begun`,
  `story.pier_met`, `story.joaquin_met`, `story.council_condition`, `story.watch_landed`, `story.rahel_met`,
  `story.blessing`, `story.patricio_told`, `clue.four_accounts` (the Concord +3 and the Hearing's line),
  `clue.signing_morning`, `choice.patricio_signing`, `side.muskets.done` (`choice.crew_spared|broken`),
  `anchor.mill_bar`, `side.lonely_cutter.done`, the three feuds' `debate.zetwal_feud_*.won|mediated`,
  `story.council_voted`, `story.chain_raised`, `story.inspection_done`, `muster.*`, `army.*`, `story.betrayal_seen`,
  `act10.complete`.
- **What Gianna believes:** her father sold Xaraguá and them: unchanged (`belief.rael_traitor`). No clue moved here;
  the family's two new lines (Rahel's "by people who were not in the room", Patricia's "things in halves") read either
  way; the Marshal's "I remembered the wrong thing" is about the Crown, not Rael; the betrayer "walked like the lady
  with the basket" joins a captain to the Quiet Crown, not to Rael, whose founding is the Hearing's. Chapter 11's
  Harbor Turn is where she learns.
- **What the realm knows:** the Crown bought a captain at a free harbor in the dark, with the muskets already in the
  cane; the Marshal sealed six pages; the four accounts have one liar and it is the Crown's; seven houses stood in
  one line to one whistle. The debate corners' post-Muster rotation (guide 7.2) is Chapter 11's.
- **Nothing built in Chapters 1 to 9 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`cane_road_muster`, and the built layer's `if` narrowed), the Chapter 1 maps' Chapter 10 objects (all conditioned
  on `story.muster_begun`, so Chapter 1's tests replay unchanged), `zetwal.ts`'s Chapter 10 branches on built people
  (the recruiters, the cane cutter, the old sailor, the lookout keeper, the elders, the Gaze keeper), the voyages,
  `config.ts` (`ALLY_PRICES`, `ARMIES`, the XP row) and `MEMBERS` (nothing: no one joins), each behind a test that
  Chapters 1 to 9's content replays unchanged.

---

## 15. Risks

- **The economy foundation arrives late and small.** The Opus plan review said to build it before Chapter 3; it is
  built here in the shape that reads what the price scenes wrote. The risk is a price scene in Chapters 6 to 9 that
  wrote a pillar in a city the ledger does not read, or none at all (Chapter 4 wrote none: the ledger reads Al-Doria's
  Influence from books and quests, with the cap). Day 1 runs the ledger against the four chapter-start saves and the
  Chapter 9 review's floors and ceilings (7.0's ranges) before any dialogue is wired.
- **Four betrayer variants and two routes is eight nights to test.** They are one scene with four captains' lines and
  two endings, and the night's trigger is data; the route test forces each `muster.betrayer.*` from a start save and
  plays the night both ways (eight short routes), and the smoke test plays two.
- **The chapter is longer than the plan's ten minutes** (section 13). The ten are there; the side content the plan
  allows is required by the gate because the Chancellor's condition is the story. The cut list (section 16) is
  ordered so the mediations are last.
- **Rahel's and Patricia's lines are the chapter's tightrope,** the fourth in four chapters. The content test and a
  human read guard them; the reviewer prompt asks for every Rahel, Patricia, Joaquin and Anicette line against the
  locked rule, and Rahel's "Not on him" and Patricia's "halves" in particular.
- **Anissa says her name.** It is the smallest step on her thread and the one the owner's rule most protects; the
  blessing has no joke within twenty lines, no Salkhi, Samira, Vikram or Edmund line on the island, and the Husher's
  Seize on the Cane Road is the built, Gianna-steps-in path.
- **Patricio's answer must not become a reveal.** He learns the seventh page was read to a clerk; he does not learn
  who hid it or why, and nothing he says touches Rael. The scene is three lines and a hand on a stone.
- **The Chapter 1 maps are touched.** Every Chapter 10 object is conditioned on `story.muster_begun`, and the Chapter 1
  route, Chapter 2's return and Chapter 3's start replay in `npm test` before anything else; the one unconditioned
  change (the built ambush layer's `if` gains `!story.muster_begun`) is the one to check first.
- **The crew's `protects` was not in the sim.** The fair bot's numbers are a floor on the fight's length; day 1 re-runs
  with `protects` and keeps x3 or drops a Lookout.
- **The plan's Nov 8 decision date.** This chapter is sized to three days (Nov 8 to 10) and is the first after the
  date; if Chapter 9 slips, section 16's "from a hand-written start save" applies and the ledger is built from the
  Chapter 9 outline's section 14 state.
- **Faith on the map.** The second feud is about a burned temple and the fiction's two faiths; the mediation is a crane
  and a lamp on one step, and no line calls either a cult; the Quiet Crown's recruiters are two sad people on a
  plaza; the fluent check (Nov 18) has no new language here (Kreyol as built).

---

## 16. Build plan (small steps, each checked before the next; sized to three builder-days, Nov 8 to 10)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 10 rewritten to this outline;
   `CAPITALS.md` 1 (the Cane Road's two tables, the forge's stock, the mill cellar, the chain, the fire);
   `SIDE-QUESTS.md` Z-6 and Z-3 marked for the release with the new numbers and Z-3's rewrite; `PUZZLES.md` M-ZET-2
   staged; `COMBAT.md` 6 (the XP row), 11 (`ARMIES`, the volley totals), 13.2 (the Cane Road's return at 24 to 25),
   13.3 #8 (Rashid placed at the Muster); `FAMILY.md` Rahel's, Patricia's and Joaquin's rows marked built with the
   Claude's calls; `QUEST-BUILD-GUIDE.md` 6.3 gets the ledger's rules (city pillars, half value, the book cap, the
   running Fear); Rahel's, Patricia's, Rashid's, Ti Jak's and the banners' prompts into `ART-PROMPTS.md`. **The ally
   ledger run against the chapter-start saves and 7.0's ranges.**
2. **Engine and data (Opus, half a day):** `ALLY_PRICES`, `ARMIES`, `engine/ally.ts`, `resolveMuster` on the flag path,
   their tests (the four ranges, ties to Dorini, the 60 percent gate, the feuds' multipliers); `cane_road_muster`; the
   crew chief, the Lookout's whistle, `mangrove_crew` with `protects`; the sim re-run with `protects` (the scratch bot
   moved into `tests/`); the XP row; the voyage entry; the whistle's audio slot.
3. **Maps (Sonnet):** `zetwal-mill` (the zone, the bar, the two door looks) replayed headless by a draft
   `puzzles/zetwal_mill/solution.json`; the Chapter 10 objects on the six built maps (the camp's crowd layers and
   banners, the ships, the capstan and chain, the fire, the Ironvow lines, the crates' trigger, the mill's door, the
   captains' four placements by night, the dusk's lines); validated; Chapter 1's tests green.
4. **Content (Haiku and Sonnet, in parallel):** the three `DebateDef`s' rounds and answers (the Reason books listed in
   7.3), the Chapter 10 branches on built people, the Journal notes (*The Marshal's answer*, *The four accounts*,
   *Muskets in the cane*, *The lonely cutter*, *The morning of the signing*, *Under the point*, the seven allies' last
   lines), the looks (section 11), the Foes page rows.

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/zetwalMuster.ts` staged from the beats, in this
   order so an interruption leaves a playable chapter: the pier and the whistle; the camp, Joaquin, the captains; the
   council at noon; the watch lands; the house; the blessing and the stone; the council's word and the chain; the
   inspection; the night in four variants and two routes; the tide and the card. `ACT10` in `quests.ts` with hints
   and goals.
6. **The quests (early afternoon):** Z-6 (the crates, the tracks, the crew and its Yield, the ledger, the cellar in
   both eras), Z-3 (Ti Jak, the three appeals, Anissa's line, the walk home), the gate's wording on the Speaker.
7. **The puzzle files and tests (late afternoon):** `puzzles/zetwal_mill/`; a `mangrove_crew` bot test at 23 to 25
   with the active-order variants; the ledger's test on the four start saves; quests, guide, debate, side-quest,
   maps, stage and content tests green; the content tests: no Salkhi, Samira, Vikram or Edmund line in a node with an
   Anissa line; no Rahel, Patricia, Joaquin or Anicette line with "good", "innocent", "feeds", "the arrows",
   "thumbprint" or "oath"; no line naming the betrayer before `story.inspection_done`; no line joining the betrayer to
   Rael.
8. **The route (evening):** Chapter 10's route from its chapter start to `@chapter10-end`, forcing each betrayer and
   both routes in eight short variants; `chapter-starts.ts` with chapter 11; `act.test.ts`; `tools/level-curve.ts`
   run and the dials set (section 5); the smoke test's Chapter 10 section with screenshots of the harbor full of
   hulls, the grandparents on the pier, the camp with seven banners, the council, Jordyn's coaster, Rahel at the
   kitchen table, the crane and the lamp on one step, the blessing at the Gaze lamp, the hand on the blank line, the
   chain raised, the inspection's lines, the whistle, the launch under the point, the arrest or the sailing, the
   signal fire, the fleet at dawn, at 844 x 390 and 390 x 844.

**Day 3 (morning):**
9. **Full browser test:** the chapter end to end on a phone; the crew fight lost (Game Over returns to the crates) and
   won, both Yields; one betrayal and one exposure played in the browser (the other six headless); a save at night
   and at dusk; `npm test`, typecheck, lint, build; the reviewer prompt in `reviews/reviewer-prompts/` (the Chapters
   10 to 12 batch, about Nov 17); the milestone note with the level statement and the ledger's rules; then Chapter
   11's outline, which overlaps with this build from day 2.

**If day 2 runs over, cut in this order:** the Echo's crowd layers (the two armies as four placed NPCs), the dusk's
re-placed lines (one `sync` of looks), the captains' day lines (one each), the contract board's job, the second look
on the two books, the fishmonger's and crier's lines, Z-3's walk home (he goes in at the mill), the chain's capstan
scene (the chain raised on the flag with the councillor's line at the Hall), the signal fire (a line). Never cut: the
whistle given back and blown with seven houses answering, the three mediations, Rahel's kitchen and Patricia's
blessing with Anissa's name, the Marshal's hand on the blank line, Z-6's crew and the cellar's bar, the betrayer's
walk and the launch under the point, the exposed route with Jordyn's arrest, the companion's line, the fleet at dawn.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Nov 8 decision date (this chapter is the first after it); the Dec 1 story questions, now needed by
early November (question 13, Patricio and the marriage, is the one this chapter brushes against and leaves open; the
betrayer's companion is answered here as the proposal says); the fluent-speaker check (Wed Nov 18: this chapter adds
no new language).

## Decisions after the second review (Oct 22)

- **Claude's call:** the build takes every fix in `2026-10-22-chapter10-outline-review.md`. Specifically:
  - Free Brasador follows Azzy, who commands it; Joaquin brings it.
  - The family lines are corrected, and none of them hints at Rael.
  - The XP is set from Chapter 9's measured end.
  - The ally ledger shows each house's share, and Al-Doria's price can be paid.
  - The night is re-sited on the harbor map, with dusk, night and dawn kept separate.
  - The other fixes in the review are taken as written.
- **Claude's call:** open question 13 (what Patricio knows) is not decided here. The blessing and the kitchen are staged
  so either answer fits, and the question stays on the Dec 1 list.
- **Owner decision (Oct 22): both.** Where Anissa speaks at the Muster: the
  owner chose both her name to Patricia at the lamp and one public sentence at the dusk inspection.
