# BLOODLINES: ECHOES OF ZETWAL
### Single-player pixel RPG companion to "Bloodlines: The Race to Elodie's Grace" (working title)
*Build guide, story bible and asset plan, revision 6 (rebel networks, Elodie's name story). Written to be dropped into `docs/quest/QUEST-BUILD-GUIDE.md` in the `elodie-game` repo and handed to Claude Code. A paste-ready opening prompt is in Section 14.*

---

## 0. READ THIS FIRST

**What this is:** a roughly 6 hour, single-player, turn-based pixel RPG set in the same world as the board game. The player is **Gianna Elise**, a young mage-healer and temple archivist of House Kay Soley (Zetwal, the Kreyol/Haitian-inspired house). She finds an artifact that lets her step into the memory of her maternal grandfather, **Patricio**, in the same place, and she solves puzzles across two eras. With her Taino best friend **Yari** and her little sister **Anissa**, she travels to the capitals of the eight houses, uncovers a family secret in Ardencia, faces her ruthless father, **Rael** (who is not what he seems), survives a betrayal, fights a war to free Xaraguá from the Aldermoor Crown, and claims the Throne as a just ruler.

**What it is not:** a rewrite of the board game, or a reason to touch the board game's rules engine. The board game ships first (rules freeze Oct 31, 2026; birthday Nov 22, 2026). Nothing in this guide should be started until that is printed and out the door.

**Source of truth for lore and names:** the repo's `docs/bloodline-houses.md`, `docs/bloodline-rulebook-draft.md` and `docs/rules-decisions.md`. If this guide and those files disagree about a house name, homeland or ability, those files win. Family names and relationships that are **proposals** are marked and listed for confirmation in Section 13.

---

## 1. DECISIONS

### 1.1 Locked by Rael

| Topic | Decision |
|---|---|
| Protagonist | **Gianna Elise** (that is her whole first name). Nickname **Gigi** (used by Anissa and Azzy). Mage-healer. |
| Ancestors (Echo) | **Patricio** (Gianna's maternal grandfather, Elodie's father) and **Benny** (Gianna's and Azzy's paternal grandfather, Rael's father) |
| Spanish-inspired swordsman | **Azriel "Azzy" Rodriguez**. Older than Gianna; his mother is a different woman; same father, Rael. |
| Initial party | Gianna, **Yari** (Taino best friend, archer), **Anissa** (support, not a full party member) |
| Anissa | Gianna's younger sister by two years, also Rael's daughter. **Very shy; never fights; gives support.** Huge magical energy. Supplies Gianna with power to boost her attacks, like an enhancing pet, but is a person Gianna must protect. |
| Surname | **Limyè** (Kreyol for "light"), the public name of **Gianna, Anissa and Elodie**. Elodie tells everyone she took it to honor the goddess of light, Elodie; in truth she took it to hide that she is a **Rodriguez** (Rael's wife). Her birth name is **Jean-Philippe**; her father is **Patricio Jean-Philippe**. Azzy is openly a Rodriguez. |
| Mother | **Elodie**, named after the goddess. Head of the Zetwal state and its diplomat to the Throne. |
| The family secret | Elodie never told Gianna who her father is: the head of the Spanish-inspired state (Ardencia), whose own father Benny headed it before him. This gives Gianna a **dual claim** to the Throne (Zetwal through Elodie, Ardencia through Rael). Families that head a state are eligible for the Throne, so Azzy has a claim as well. **Patricio is Haitian-inspired (Kay Soley)**, Gianna's maternal grandfather. (Rael's earlier wording said "Elodie's father" headed the Spanish state; since Patricio is Elodie's father and Haitian, this guide reads that as Rael's line. Confirm in Section 13.) |
| The Ardencia scene | Gianna fights the current Lord of Ardencia, **Rael the Ruthless** (Azzy's father, the villain, based on Rael). After she defeats him he reveals he is also **her** father. Gianna and Azzy escape the city and believe he is siding with the British-inspired Crown. |
| The truth about Rael | **Elodie is Rael's secret wife.** They hid the marriage because Rael led a grand army and a war, and it was dangerous for his enemies to know who his other children were, much less that Gianna and Anissa carry the blood of two major families and a potential dual claim to the Throne. His alliance with the Crown is a **farce**: he intends to betray the Crown's head and help bring down the Throne. He **founded the cult** long ago for whispers and influence, and its members **do not know he is its head** (they would be less effective if they did), so it runs with autonomy by design. He is the head of a **shadow government fighting corruption**. He let Ardencia's elders line their pockets, then used those funds to secretly invest in underground rebellions. His creed: you must break a few eggs to make an omelette. He **prefers to capture rather than kill**. |
| What Gianna knows | **Gianna cannot learn her father is good until near the end.** After she defeats him she must escape the city with Azzy believing he is a traitor. **Elodie knows what he is doing but cannot tell anyone, and disapproves of testing the girls.** |
| Rael's fate | **Rael can be redeemed.** Gianna pardons him, but only if he serves in a way that honors his father **Benny** and works **in the light**, and his organization is used only to find and fight oppression in the kingdom. Confirmed: the pardon terms and the title **Warden of Oaths** (5.6). |
| Allies | The allies in the fight should be **unlikely**, each motivated by **one** of the three currencies (Wealth, Influence, Fear). Many people disagree with their own country's actions, so Gianna can find **a companion from each land** to join her party. |
| Ending | Gianna is a **just ruler** who keeps all parties in line. (Rael's message ended mid-sentence; see Section 13.) |
| Religions | At least four: Elodie's goddess faith, a cult, an elemental earth faith, and one more. Present in every city, with street debates the player can interact with. |
| Shops | Local vendors sell culturally relevant items or variants and speak in their own languages. |
| Scope | Build **a slice first**. |
| Eras | Two playable eras. |

### 1.2 Decisions made in this draft

| Question | Decision | Why |
|---|---|---|
| 2 or 3 generations? | **Two playable eras, four generations of story.** Playable: the **Echo** (Gen II, the Alliance War, about fifty years ago) and the **Present** (Gen IV). Gen I (founding and colonization) is told through library lore and three still-picture flashbacks. Gen III is told through Elodie, Rael's rise and Anicette (see 5.3). | Matches the board game's Gen I to IV structure at almost no extra cost, but only two sets of maps, sprites and puzzles to build. A third playable era adds roughly 40 percent more of everything. |
| Where the swap works | Only inside shimmering **Echo Zones** and at **Echo Sites**. | Every swap needs a validated walkable tile in the other era. Zones make that checkable by a script. It also stops puzzles being skipped. |
| What the swap does | You step into the **same place** in your grandfather's time. Changes carry back to the present only through **Anchors** (things the ancestor deliberately left: caches, levers, planted seeds, carved marks, signed papers). | A clean rule players learn in minutes, with no paradox arguments. |
| Why Anissa cannot swap | Her magic is too bright for the Echo. She stays at the Echo Site and **holds the door open**, which is the in-story reason the Echo lasts. | Keeps the Echo party small and makes her feel essential, not like a battery. |
| Who the antagonist is | **The Aldermoor Crown** (English-inspired, House Stillwater's homeland), led by the **Lord Regent**, working with **Rael the Ruthless**, Lord of Ardencia. Ordinary Stillwater people are not villains; one becomes a party member. | Stillwater is the board game's patient, defensive house. Making the whole house evil would contradict its lore. |
| Where she rules | Gianna claims the **Throne at Eightgate** (the realm's center, as in the board game). Xaraguá is freed and **governed by its own cacica (Yari)**. Gianna does not rule Xaraguá. | Keeps a just-ruler ending without making her the new colonizer of her best friend's land. |
| Engine | **Phaser 3 + TypeScript + Vite + Tiled**, lazy-loaded at a `/quest` route inside the existing repo. | Same language, tooling, PWA and deploy pipeline as the board game app. Claude Code can build and test it in a headless browser. |
| Platform | **Phone and tablet first (installed PWA), controller supported, optional cast to TV.** Not Switch 2. See Section 3. | No supported sideload route for a private gift. |
| Slice | **Zetwal + Xaraguá + the Ardencia reveal**, about 2 hours. A smaller **Slice A** (Zetwal + Xaraguá, about 75 minutes) is the fallback. | The Ardencia reveal is the best beat in the story and makes a complete mini-arc. |

---

## 2. TERMS CORRECTED (so the next AI builds the right thing)

- **"Sideload"** is a phone term. On a console the unofficial route is **homebrew** or **custom firmware**, and the official route is the **developer program**. See Section 3.
- **"8-bit"** strictly means NES-era graphics. Old Pokemon (Red/Blue) is a **Game Boy** game with four shades of one color. The target here is **Game Boy Advance-era pixel art**: 240 x 160 resolution, 16 x 16 tiles, a 32 color palette per map. It reads as "old school Pokemon" and is much easier to draw than true 8-bit constraints.
- **"Action RPG"** means real-time combat. What is described is **exploration in real time plus turn-based battles**, a classic **JRPG**. Build that.
- **"Role-based"** should be **class-based**.
- **"The Haitian continent"**: Haiti is a country on an island. In the game it is the nation of **Zetwal**, and its people are **House Kay Soley**.
- **"Native American island"**: the Taino are Indigenous peoples of the Caribbean. In the game they are **House Yaguana**, homeland **Xaraguá**. The chief is a **cacique** (female: **cacica**).
- **"Spain-esque territory"**: that is **House Brasador**, homeland **Ardencia**. The ruler's title in this guide is **Lord of Ardencia**.
- **"State" and "throne eligibility"**: the board game's word for the claim on the Throne is a **Claim**, and rival claimants make a **Challenge** (rulebook Section 8). Use those words so the RPG climax mirrors the board game.
- **"Time travel"**: not time travel. Use **Echo** or **dual-timeline** in all design language.
- **"Levels"**: use **zones** or **hubs**. Each capital is a hub made of several maps.
- **Fear/Influence/Wealth are "pillars"** in the board game, not "tokens". The **Grudge Token** idea is separate and is used for retry (6.4).
- **"Cult"**: a cult is a small, coercive, secretive group, not a religion in general. In this guide it is a **fictional** group (the Quiet Crown, Section 7). Real religions of any culture must never be portrayed as cults.

---

## 3. PLATFORM: NINTENDO SWITCH 2 VS PHONE

**Short answer: do not plan on Switch 2.**

- I found **no supported way to sideload a private game onto a Switch 2**. The only official route is Nintendo's **developer program**: free registration at developer.nintendo.com, an application describing a real game and team, an NDA, a **dev kit** (price not public; one secondary source says "a few hundred dollars per unit", unverified), and then Nintendo's strict certification, **Lotcheck**, reported at 6 to 10 weeks over 2 to 3 rounds. It is designed for commercial releases, not a one-off gift. Sources: [Switch 2 indie development, one year in](https://www.strayspark.studio/blog/nintendo-switch-2-unreal-engine-indie-development-2026), [How to port your indie game to consoles in 2026](https://gamedo.live/news/how-to-port-indie-game-consoles-2026/).
- **Homebrew / custom firmware**: I could not verify any working, safe path on Switch 2 today, and this guide does not build around one. Such routes risk bricking the device and online bans on a console she uses for her own games, and a firmware update can close them.
- **Does the Switch 2 have a usable web browser?** Unverified. Do not plan on it. A 2 minute check on her console would settle it.

**What to build instead:**
1. An installable **web app (PWA)** at a `/quest` route.
2. **Gamepad API support** so a Bluetooth controller works. As far as I know, Joy-Con and Pro Controllers pair directly with current iPhones, iPads and Android phones; confirm on her actual phone.
3. A **touch D-pad overlay** as the fallback, large tap targets, landscape layout.
4. **Cast to a TV** (AirPlay, Chromecast or USB-C to HDMI) for couch play.
5. If Nintendo is a hard requirement later, treat it as a **separate commercial project**: port after the game is finished, via the developer program. Keeping the game in plain TypeScript with a clean engine/render split keeps that door open.

**Save data caution:** browser storage on iOS can be cleared for sites that are not installed to the Home Screen. Install the PWA, keep an **Export save code** button, and write saves through one module so it can later be swapped for Supabase cloud saves (see the CLAUDE.md warning: never touch other apps' tables).

---

## 4. HOW THIS RELATES TO THE EXISTING REPO

Facts taken from the current repo (`CLAUDE.md`, `docs/app-build-guide.md`):

- Stack: React + TypeScript + Vite + Zustand, installable PWA, deploys to Netlify on push, CI in `.github/workflows/ci.yml`.
- `src/engine` is **pure TypeScript** with a **seeded Rng** (no `Math.random`) and unit tests for every rule. **Follow the same discipline for the quest's battle and puzzle engines.**
- Content lives in `src/data`; the engine never hard-codes content.
- Every visual goes through `src/assets.config.ts`. **Do the same for pixel art** with a separate `quest/assets.config.ts`.
- Tunable numbers live in `src/config.ts`. Quest balance numbers go in `quest/config.ts`.
- Do **not** modify the board game's `src/engine`, `src/net`, or the Supabase Edge Function.
- Existing board art is a painted style called "The Gilded Atlas" (`docs/art/ART-GUIDE.md`), made with ChatGPT and Midjourney. **The quest is pixel art, a different style.** Reuse the painted board and crests only on the title screen, loading screens and ending stills, and downscale each house crest to a 32 x 32 pixel emblem.
- `scripts/chroma-key.py` already exists for cutting solid backgrounds out of AI images; reuse it in the sprite pipeline.

**Proposed layout (inside the same repo):**

```
quest/
  src/
    engine/        battle, pillars, concord, puzzles, quests, save  (pure TS, seeded Rng, unit tested)
    scenes/        Phaser scenes: Boot, Title, Field, Battle, Dialogue, Debate, Menu, WorldMap
    data/          houses, party, enemies, skills, items, shops, dialogue, quests, lore, jobs, faiths, lang
    input/         keyboard, gamepad, touch
  maps/            Tiled .tmj files (one per map, both eras in the same file)
  tools/           map validator, solution replayer, sprite pipeline scripts
  assets/          generated pixel art and audio
  tests/
```

Route it at `/quest`, lazy-loaded, so the board game app does not download Phaser.

---

## 5. STORY BIBLE

### 5.1 Premise

About fifty years ago the island nation of **Zetwal** rose against the **Aldermoor Crown** in the **Revolution** (called the **Alliance War** in the histories). Patricio led it as a revolutionary, and Benny helped him. **Both men are still alive in the Present, old now**, so the Echo is a trip to their youth, not to the dead. **Marshal Patricio** of House Kay Soley commanded the joint armies. **Benny**, Lord of Ardencia, brought House Brasador to fight beside Zetwal, an alliance that surprised everyone and held. They sealed it with a token made in two halves: a sun **Locket** for Zetwal and a **signet** for Brasador. The Crown was driven out. Zetwal's court tells the story as a clean victory (*Patricio's and Benny's roles are a proposal, see Section 13*).

It was not clean. The peace, the **Sun Accord**, contains a **Seventh Clause** that was never read aloud. Under pressure from allies who wanted gold and trade rights, Patricio signed away Xaraguá's harbor to the Crown "to be revisited." It never was. Xaraguá's warriors had fought beside him. This is **the Unpaid Debt**. **Benny refused to sign** the clause and said so publicly, which is why Brasador's honor was never questioned. Brasador paid for that honor: it never received the gold it had been promised.

Benny's son **Rael** grew up watching the realm praise his father while Ardencia's coffers stayed empty. About twenty-five years ago, in the **Ash Wars**, he led Brasador's grand army against Crown raiders and rival lords and earned the name **Rael the Ruthless**. By then he and Patricio's daughter **Elodie**, who rose to head Zetwal's state, had **married in secret**. They never announced it. A man who leads a grand army makes enemies, and those enemies would hunt his children, especially two daughters who carry the blood of two major families and so a possible claim to the Throne. Elodie raised Gianna and Anissa in Zetwal and told them nothing about their father. Benny, now old, handed the seat of Ardencia to Rael and lives quietly in the keep; Rael keeps him close and out of sight.

What almost no one knows: Rael decided that honor alone had never changed anything. Long ago he founded the **Quiet Crown** as a network of whispers and influence, and he keeps his role hidden even from its own members: they would be less effective if they knew a warlord stood behind them, so its cells run with autonomy by design. He built a **shadow government** across the realm, funded by the very corruption he seems to allow: Ardencia's elders line their pockets, and he skims their gains to invest in rebellions underground, including resistance cells in Xaraguá and other occupied lands. He believes you cannot make an omelette without breaking eggs. He has broken real ones.

In the present day the Crown has never forgiven the loss of Zetwal. It uses the Seventh Clause to justify a **Charter of Protection** over Xaraguá, a colonization dressed as a rescue. Gianna's best friend **Yari**, heir of Xaraguá's cacique line, brings the warning. The Crown believes it has **bought Rael** with Xaraguá's gold and the promise of the Throne for his bloodline. In truth he has joined it to take it apart from inside. The same autonomy that makes the Quiet Crown effective also lets the Regent's agents bend some cells to their own ends, and they want **Anissa's power** for the Throne.

The war is about **power, money and fear**, not about who people are. Several houses disagree with what their own rulers are doing, which is why each land produces a companion willing to cross its leaders.

**Gianna's real task** is not only to win a war. It is to make good on the Unpaid Debt, to see through the mask her own father wears, and to rule afterward with the justice her family failed to show.

### 5.2 The generations (the decision, with the counter-case)

**Recommended: two playable eras.**

| Gen | Era | In the game | Cost |
|---|---|---|---|
| I | The Founding (colonization) | Lore books, 3 flashback stills, one library mural per capital | Text and 3 illustrations |
| II | **The Alliance War (the Echo)** | **Playable.** Patricio, Benny, Caona. All echo maps. | Full |
| III | The Ash Wars (Rael's grand army, the secret marriage, Elodie's rise) | NPC dialogue, ledger pages and memory cutscenes | Dialogue only |
| IV | **The Present** | **Playable.** Gianna's party. | Full |

**The case for three playable eras:** a middle era would let the player watch the betrayal of the Accord unfold, and each puzzle could chain three states. **Why it loses:** every map, sprite set and puzzle must exist in three states, testing multiplies, and in a 6 hour game each era gets too little time. The Uprising already contains the interesting part of the middle generation. If the game succeeds, the Founding can ship later as an expansion using the same tools.

### 5.3 Cast (new names are placeholders unless marked locked)

| Role | Name | Notes |
|---|---|---|
| Heroine | **Gianna Elise** (locked), nickname **Gigi** | Mage-healer, junior archivist at the Temple of Elodie in Zetwal. Carries the faint **sun-shaped birthmark** of Kay Soley heirs. Surname **Limyè**, shared with Anissa and Elodie. Class: **Archivist-Mage** (healer). Early twenties (exact age open). Her gift is the mirror of her sister's: **unimaginable skill at using mana efficiently**, so a little goes a very long way. Anissa has the power, Gianna has the craft, and together they are unstoppable. |
| Maternal grandfather | **Marshal Patricio Jean-Philippe** (locked) | Elodie's father. Haitian-inspired (Kay Soley) marshal who commanded the joint armies and signed the Sun Accord. Married to Anicette. **Alive and old in the Present** (*proposal*: lives in Zetwal near the Temple and is a witness at Rael's Hearing about the Seventh Clause). Playable in the Echo, where he is a young revolutionary, as a **Warden** (melee, guard). The Echo plays differently from the Present: Gianna thinks and heals, Patricio strikes and holds. |
| Paternal grandfather | **Benny** (locked) | Rael's father; grandfather of Gianna **and** Azzy. Lord of Ardencia in the Revolution, and head of the Spanish-inspired state before Rael. **Alive and old in the Present**, retired in the Ardencia keep (*proposal*: he is the one who knows about the tunnel and recognizes the Locket in person). Honorable; refused to sign the Seventh Clause. Swordsman. Joins the Echo party once Azzy has joined. |
| Little sister | **Anissa** (locked) | Two years younger than Gianna; Rael's daughter too. **Very shy, never fights.** She carries the **light of the goddess Elodie**: an unimaginable reservoir of mana, far more than she can control. Not a party member. Runs the **Surge** system (6.4). Gives puzzle hints. Cannot enter the Echo. The Quiet Crown wants her. |
| Best friend | **Yari** | Taino-inspired, House Yaguana, heir of the cacique line. Class **Archer**. Mascot: a **hutia** (a real Caribbean rodent) who steals shiny things. |
| Yari's ancestor | **Caona** (approved; Yaguana Gen II) | Scout-commander who fought beside Patricio and Benny. Her side of the Accord is the emotional center. |
| Mother | **Elodie Limyè** (locked) | Head of the Zetwal state and its diplomat to the Throne. Named after the goddess of light. Publicly **Limyè**, a name she says she took to honor the goddess; in truth she took it to hide that she is a Rodriguez. Patricio's daughter and **Rael's secret wife**. She hid the marriage to protect their children and their children's claim, and has never told her daughters that their father is the Lord of Ardencia. In the Parley she is under Crown eyes and can say only one true thing. Leaves for the Throne at the start; seen again at the midpoint parley and the end. |
| Grandmother | **Anicette** (locked name, alive) | Elodie's mother and Patricio's wife. Very much alive in the Present. Keeper of the Temple of Elodie in Zetwal (*proposal*) and the person who gives Gianna the **Sun Locket** (*proposal*). She is the living memory of the Alliance War and of Ash Wars gossip, and one of the few who suspects the official histories are wrong about Rael. |
| Half-brother | **Azriel "Azzy" Rodriguez** (locked) | Older than Gianna. Rael's son by a different mother, a royal of the Mongolian empire (*assumed Skarragol*) whom Rael married only to win support in the Ash Wars; she left and went home, and Azzy stayed. Class **Blade-Knight**. Believes in his father's honor until the escape. Joins after Ardencia. |
| The "villain" | **Rael the Ruthless** (Lord Rael Rodriguez) | Lord of Ardencia. Elodie's secret husband. Father of Azzy, Gianna and Anissa. Appears to side with the Crown; is running a double game and a shadow government. Prefers to capture rather than kill. Can be redeemed; pardoned at the end on conditions. Full profile in 5.8. |
| Antagonist | **Lord Regent Aldric Vane** of Aldermoor | Calm, patient, always three moves ahead. The Crown's long game personified. |
| Local villain | **Governor Thorne** | The Crown's governor in Xaraguá. Cruel, bureaucratic. Early boss. |
| Cult leader | **The Hushed** (title) | The Regent's agent (owner decision, Oct 14). The Hushed has taken over the Quiet Crown cells that hunt Anissa, and their members believe the Hushed is the head. Unmasked inside the Regent's court (Chapter 9). Rael is the true founder above every cell; no member knows it until he confesses at the Hearing. |
| Carriage Guild | **Papa Wout** (placeholder) | Runs carriages and ferries. Comic relief, knows every road, sells rumors. |

### 5.3a The bloodlines (approved; the same people as the board game's character cards)

The board game's four generations per house are this story's family lines. **Gen IV** is the present-day hero or
companion, **Gen III** is their parent (often the ruler or elder they defy), **Gen II** is the ancestor met in the
Echo (the Revolution, about fifty years ago), and **Gen I** is the founder, known from lore. Abilities stay exactly
as in the board game. Source of truth for the names: `heirs` in `src/data/houses.ts` (rules-decisions 86).

| House (land) | Gen I: founder | Gen II: Echo era | Gen III: parent | Gen IV: present day |
|---|---|---|---|---|
| Kay Soley (Zetwal) | Mother Solange Jean-Philippe | Marshal Patricio Jean-Philippe | Elodie Limyè (born Jean-Philippe) | Gianna Elise Limyè |
| Brasador (Ardencia) | Don Alonso Rodriguez | Benny Rodriguez | Rael the Ruthless | Azriel "Azzy" Rodriguez |
| Yaguana (Xaraguá) | Cacique Guanín | Caona | Cacique Anaco (Yari's ailing father) | Yari |
| Dorini (Al-Doria) | Malik Dorini | Yusuf Dorini (keeper of the ledger) | Layla Dorini (harbour banker) | Samira Dorini |
| Ironvow (Skarragol) | Ulfgar Ironvow | Sarnai (led the raid on the Crown's supply line) | Torvald | Bayarmaa |
| Suzumori (Kuroshi) | Lord Genzō Suzumori | Lady Sayo Suzumori (her network fed Patricio the Crown's troop movements) | Kaede Suzumori | Haru Suzumori |
| Agnivansh (Jwaladesh) | Rani Tejaswini | Arjun (the charge at the harbour chain) | Meera | Vikram |
| Stillwater (Aldermoor) | Dame Agatha Stillwater | Thomas Stillwater (wrote the Crown's record of the Seventh Clause) | Lady Rosalind Stillwater | Edmund Stillwater |

Notes: Anissa (Gianna's sister) and Anicette (Elodie's mother) are family but not on the cards. The Yaguana names
avoid real historical caciques; Guanín and Anaco are built from Taíno words and go on the review list with the
phrasebook. Still placeholders: Papa Wout, Lord Regent Aldric Vane, Governor Thorne, Envoy Cresswell, the Ash
Ledger, the Hushed, the hutia (unnamed), the working title.

### 5.4 Recruits and the places

Each place provides one **capital hub**, one **ruler**, one **signature puzzle**, one **library**, one **shop**, one or two **street debates** (Section 7), an **Echo**, and a **companion**: someone from that land who disagrees with what their own leaders are doing and chooses to travel with Gianna.

| Place / House | Ruler and what they want | Present problem | Echo | Companion and why they defy their land |
|---|---|---|---|---|
| **Zetwal** (Kay Soley) | Elodie (leaves at the start). Allied by blood. | Festival of Elodie's Gaze; tutorial; the Locket; Quiet Crown recruiters in the plaza. | Patricio's war room the night before the signing. | **Gianna** and **Anissa** (home). **Yari** arrives. |
| **Xaraguá** (Yaguana) | Cacique, ailing; the Governor holds real power. Wants **Influence**: to be heard as an equal at the Throne. | Crown ships in the harbor; the Charter. | Caona, Patricio and Benny swear the first oath at the areito. | **Yari**, who defies elders ready to accept the Charter. |
| **Al-Doria** (Dorini) | Merchant-prince. Wants **Influence** (unlikely: the richest house wants a council seat, not gold). | Guild vault hides the signed Accord copy. | The Dorini ledger shows what they were promised for signing. | **Samira Dorini** (approved): appraises everything, including feelings, and invoices them. Alchemist. Defies her guild for profiteering on the war. |
| **Ardencia** (Brasador) | **Rael the Ruthless.** Appears to be the enemy; the Crown believes it bought him. | The duel, the reveal, the escape. | Benny's smuggler tunnel and the Brasador march. | **Azzy**, who defies his own father. |
| **Eightgate** (the Throne city, center of the realm) | The Throne is held for now by the Regent. Elodie is Zetwal's envoy. | Parley under a flag of truce; the Throne Archive holds the Accord. | The sealing of the signed Accord in the Throne Archive (owner decision, Oct 14: the Accord was signed in Pòdlimyè's plaza). | none |
| **Skarragol** (Ironvow) | Clan council. Wants **Wealth**: plunder rights and compensation for blockade losses. | Great horse-fair; stolen sacred standard. | The Ironvow raid that broke the Crown's supply line. | **Bayarmaa** (approved): raider more devoted to her horse, who has more dialogue than she does. Cavalry. Defies a council ready to sell the fleet. |
| **Kuroshi** (Suzumori) | Spymaster council. Wants **Influence**: recognition and legal protection for their informants. | Fog city of informants; the files that expose the buyer. | The Suzumori network that fed Patricio the Crown's troop movements. | **Haru Suzumori** (approved): introduces himself as "definitely not a spy." Shadow agent. Defies the order to stay neutral. |
| **Jwaladesh** (Agnivansh) | Fire-temple court. Wants **Wealth** (unlikely: zealots whose treasury is empty and whose sacred flame is running out of oil). | The sacred flame is dying; a relay of lamps. | The Agnivansh charge at the Crown's harbor chain. | **Vikram** (approved): must win every argument by duel, always out of breath. Fire duelist. Defies priests who want to hide the flame. |
| **Aldermoor** (the Crown / Stillwater) | The Regent (enemy). A dissident faction wants **Fear**: protection from the Quiet Crown's purge. | Infiltrate the Regent's keep, find the Crown's pact with Rael, including a ledger of what he took and where it really went. | The Crown's own record of the Seventh Clause. | **Edmund Stillwater** (approved): ridiculously polite guardian who apologizes to enemies before hitting them; tea breaks heal. Tank. Defies the Regent. |
| **Free Brasador** (Azzy's defectors) | Soldiers who followed Azzy. Want **Fear**: proof that Rael can be beaten. | Gained in the escape. | none | **Azzy** leads them. |

**Unlikely alliances:** the allied groups hate each other. Dorini merchants are raided by Ironvow clans. Suzumori spies once burned an Agnivansh temple. Stillwater dissidents are the Crown's own people. Before the war the player must settle these **feuds** at the Muster (5.5) using Concord (Section 7).

**Rebel networks:** every land has underground rebel groups, quietly funded by the Ash Ledger, who feed the poor and press the royal class. Each hub has a hidden safehouse the player can find (a side quest, a shop with unusual stock, or a hint). They are why no land is truly neglected, and they are the thread that leads the player to Rael's ledger.

**Carriage and ferry:** Xaraguá is a green island and mountain land, so the Guild runs **carriages on the mainland and ferry coaches on causeways and sea lanes**. Same menu, one UI.

### 5.5 Act structure and timing

| Act | Content | Minutes |
|---|---|---|
| **I: The Mark** | **Zetwal (35):** festival of Elodie's Gaze, Elodie departs for the Throne, Gianna finds the Locket, first Echo as Patricio, Yari arrives with the warning, Anissa's power wakes, Quiet Crown recruiters. **Xaraguá (40):** Governor Thorne, first Caona Echo, the Charter, first boss. | 75 |
| **II: The Alliance Road** | **Al-Doria (30):** guild vault, the Dorini ledger, Samira. **Ardencia (45):** the duel with Rael the Ruthless, the reveal, the escape through Benny's tunnel, Azzy joins. | 75 |
| **Midpoint: The Parley** | **Eightgate (20):** Elodie in her role as envoy, the Regent under a flag of truce, the Throne Archive, the Seventh Clause read aloud. Gianna confronts Elodie about Rael; Elodie explains why she hid it. | 20 |
| **III: The Debt Revealed** | **Skarragol, Kuroshi, Jwaladesh** (30 each, any order), then **Aldermoor (35)**. Kuroshi's files reveal the Crown has bought one ally. | 125 |
| **IV: The Muster** | Return to Zetwal. Armies assemble. **Seat the feuds** (three mediations). **The Betrayal.** | 10 |
| **V: The War of the Harbor** | Xaraguá. Multi-stage battle with the allied armies, flank fight against the betrayer, the **Harbor Turn** (Rael's army wheels on the Regent, or does not, depending on the player's choice), the Regent's retreat. | 30 |
| **VI: The Claim** | Eightgate. The board game's **Claim and Challenge** as the climax. Gianna's Claim, the Regent's Challenge, Azzy's choice. | 20 |
| Epilogue | The Hearing for Rael and the ending (5.7). | 10 |
| **Total** | | **365 (about 6 hours)** |

**Slice (about 2 hours):** Zetwal (35) + Xaraguá (40) + Ardencia (45) = **120 minutes**. **Slice A (fallback):** Zetwal + Xaraguá = 75 minutes.

### 5.6 The big beats

**The Ardencia duel and reveal (slice finale):**
1. Ardencia's law: no outsider receives an audience with the Lord unless she **proves herself in a duel**. A **Crown envoy** (placeholder: Envoy Cresswell) watches from the gallery. The player may notice but will not yet understand why.
2. Azzy is assigned as Gianna's escort. They bond. He believes in his father's honor and in his grandfather Benny's legend. The player sees Ardencia's **elders fat and corrupt** and its poor seeming neglected. Both are part of the mask: rebel groups quietly feed the poor with Rael's money (5.8).
3. **Boss: Rael the Ruthless**, three phases (5.8). The fight is secretly a **test**. In phase 1 he holds back to see whether Gianna will protect Anissa. His attacks **bind** party members rather than knock them out: nobody dies in his fights.
4. He is defeated. Under Brasador law the loser answers one question, and Gianna asks why her mother never spoke of her father. With the envoy behind a screen, Rael tells her coldly: **Gianna and Anissa are his daughters**, Elodie is his wife, and it changes nothing. Her **Sun Locket** (made by Patricio) and his Brasador **signet** (made by Benny) are the two halves of the token that Elodie and Rael once exchanged (*proposal*). **His signet glows** as he speaks. The player sees it; Gianna does not understand it.
5. The envoy re-enters. Rael declares for the Crown and orders the party seized. The signet glows again.
6. **The Escape** (Echo puzzle sequence): Gianna and Azzy flee through **Benny's smuggler tunnel**, opened by an anchor Benny left. Rael's guards fire on them. The shots land **wide**. Azzy sees his father give the order and chooses Gianna. **Azzy joins.** The Brasador soldiers who follow him become **Free Brasador**.
7. Gianna now believes her father is a traitor who has sold Xaraguá. **She cannot learn otherwise until near the end.** The player, who has seen the signet and the missed shots, may suspect long before she does. That gap is deliberate.
8. The reveal also opens the **dual claim**: Gianna may claim through Zetwal (Elodie, head of its state) and through Ardencia (Rael, and Benny before him). Azzy holds a claim too.
9. **Echo callback:** after the reveal the player can revisit young Benny's Echo. Young Benny recognizes the Locket on Gianna's neck and says something he could not have said before. In the Present, **old Benny** can be spoken to in the keep (with Rael's guards looking away), and what he says matches what young Benny said.

**The betrayal:** the Crown can out-pay one more ally. Each allied house has a **motive currency** (5.4). The house whose price the player has paid **least fully** among **Al-Doria, Skarragol, Kuroshi and Jwaladesh** is the one the Crown buys at the Muster; ties go to **Dorini**. The betrayer is revealed as a secret member of the Quiet Crown and becomes a flank boss in the War of the Harbor.
- **Foreshadowing:** Kuroshi's files name the "buyer's mark" but not the buyer. They also show a second trail: gold flowing out of Ardencia to places no one should be funding.
- **Exposed route:** with the Kuroshi evidence and the betrayer's price at least 60 percent paid, Gianna can confront them at the Muster and turn them into a **late ally**.
- **On a replay** the buyer can be forced to a different house.

**The Parley (midpoint):** at Eightgate, Elodie is Zetwal's envoy under Crown eyes. She knows what Rael is doing and cannot say so. Gianna confronts her about him. Elodie can say only one true thing: *"Believe what your Locket tells you, not what his mouth does."* In a private moment she adds, *"He should never have tested you."* Gianna takes this to mean the duel law. It is the clue that opens the twist for observant players.

**The Harbor Turn (replaces a second duel; near the end):** in the War of the Harbor, Rael's army appears on the flank. The player expects a second father-daughter fight and is given a **trust choice**. Whichever she chooses, Gianna learns the truth here, near the end:
- **Trust:** the party holds. Rael's army turns on the Regent's flagship and Rael fights beside Gianna against the Regent's champion. Better rewards and a stronger epilogue.
- **Strike:** Gianna's party fights Rael's vanguard. It is a hard fight in which he only **binds** and never kills. When his army breaks, with his signet dark, he tells her the truth. The Regent's fleet escapes intact. Stability drops and Azzy is furious.
- **Clues available beforehand:** the signet tell, Elodie's two lines, Kuroshi's ledger trail, Samira appraising the Brasador gold ("this coin has been somewhere else"), Free Brasador soldiers who whisper that the arrows missed, and the fact that nobody ever dies in his fights.

**The Claim (climax):** after the War, the Regent retreats to Eightgate, where the Throne stands. Per rulebook Section 8: Gianna, standing on the Throne tile, declares her **Claim**. The Regent declares a **Challenge** and they fight. Azzy, who also has a claim, chooses on the spot: renounce it in her favor, share it, or (in the dark route) Challenge her too.

**The Hearing (epilogue):** Rael surrenders to Gianna's Throne. Witnesses speak: the Ardencian rebel leaders he fed and armed, the family of the treasurer he kept captive for years without trial, the underground cells he funded, Elodie, Azzy, Anissa. Gianna chooses a verdict:
- **Pardon with conditions** (best, and the confirmed terms; old Benny and old Patricio may speak at the Hearing): Rael serves in a capacity that honors his father Benny and works **in the light**, as **Warden of Oaths**, the Throne's officer who ensures treaties are kept, including the Sun Accord's Seventh Clause. His shadow organization, the **Ash Ledger** (placeholder), becomes the Throne's **Office of Oaths** and may be used only to find and fight oppression in the kingdom. He publicly confesses that he is the head of the Quiet Crown and dissolves its secret chain of command. He frees every captive, makes restitution to the treasurer's family, and brings the corrupt elders to account.
- **Exile** (middling): Rael leaves; the Ash Ledger goes dark and unaccountable. The realm remains uneasy.
- **Execution** (dark): the Iron Throne ending.

### 5.7 Endings

Endings are decided by an **Accord Stability** score (0 to 100) built from: allied houses kept, the Unpaid Debt paid (Xaraguá freed and treated as an equal), the Harbor Turn choice, the Hearing verdict, **Concord** (Section 7), and unresolved side quests.

| Ending | Needs | Result |
|---|---|---|
| **The Just Throne** (canon, best) | High Stability, strong Influence, the pardon with conditions | Gianna sits the Throne as arbiter, not conqueror. A standing council of the states, each with a seat. Xaraguá governed by Cacica Yari. Azzy is Marshal of the realm. Elodie is Chief Envoy. Rael is Warden of Oaths. Gianna ensures **all parties are held to their word**, including herself and her father. A final text scroll shows each house's fate. |
| **The Hollow Throne** | Middling Stability or Rael exiled | She wins but the realm is strained: houses withdraw, debts are unsettled, the Ash Ledger operates unaccountable. A bittersweet ending with a hint that she must keep working. |
| **The Iron Throne** (dark) | High Fear, low Concord, Rael executed | She keeps order by force. Yari leaves. Anissa watches her sister become the thing they fought. A tragedy. |

**Pushback on "she is a just ruler":** an ending where the protagonist is simply declared just removes the question the whole game asks, which is *what do you do with power once you hold it?* A ruler who "keeps all parties in line" can look exactly like the Crown's Charter of Protection. The design above resolves this: she **is** a just ruler in the canonical ending, but only if the player has earned the Stability, and she does not rule Xaraguá. If you want it unconditional, say so and the Hollow and Iron endings can be reduced to epilogue variants.

### 5.8 Rael the Ruthless

**Full title:** Rael the Ruthless, Lord of Ardencia, Hand of the Brasador, Warden of the Ash Road. Secret husband of Elodie. Father of Azzy, Gianna and Anissa. Based on Rael.

**One line:** a man who wears a monster's name because a monster's name is a weapon, and who will cage a person before he will kill one.

**The mask (what the realm sees)**
- A Spanish-inspired warlord of fire-cracked highlands, built on **Fear and aggression** (see `bloodline-houses.md`). He earned "the Ruthless" in the Ash Wars and has cultivated the name ever since. Fear is a currency he spends on purpose. The **recorded histories of the Ash Wars are written wrong** to make him look crueler than he was: the Crown and Ardencia's elders each had reasons to paint him a butcher, and he let the lie stand because it protects his family and his work. Library lore books about the Ash Wars (the false version was spread by Rael and the elders to scare the people) **contradict each other** (a Crown chronicle, a Kuroshi spy ledger, a Zetwal temple record, Anicette's own recollection). Players who read all four can tell which is false. This is the game's slow-burn clue that Rael is not what he seems.
- Ardencia under him looks corrupt: fat elders, a poor who seem neglected, soldiers who obey and do not love. He sides with the Crown, takes its gold and promises. In truth **rebel groups across the realm** feed the poor with his money, and he keeps the royal class in line from the inside.

**The man (what is true)**
- Elodie's secret husband for about twenty-five years. They hid the marriage so his enemies could not hunt their children or their children's claim to the Throne.
- Son of **Benny**, whose honor cost Brasador everything. Rael decided honor alone changes nothing. He builds the other way: patient, covert, willing.
- **He prefers to capture rather than kill.** Enemies are bound, held and bargained with. He believes a dead man cannot be useful or answer for himself.
- Founder of the **Quiet Crown** long ago, as a network of whispers and influence. Its members **do not know he is the head**, because they would be less effective if they did. Cells run with autonomy by design.
- Head of a **shadow government** (placeholder name: **the Ash Ledger**) across the realm. His method: let Ardencia's elders line their pockets, skim their gains, and invest the funds in **underground rebellions**, including cells in Xaraguá that have been getting arms and lamp oil from a stranger for years.
- His creed: "You cannot make an omelette without breaking eggs." He has broken real ones.

**Truth ledger: what is staged and what is real**
| Act | What the player sees | Truth |
|---|---|---|
| The duel | A brutal trial of blades | A **test**. He wants to know whether Gianna will protect Anissa. Real danger, held back. His blows bind rather than kill. |
| "Arrest them" | Rael orders the party seized | **Staged** for the Crown envoy. |
| Guards fire at the escape | Shots at his own son's route | **Staged.** The shots land wide. |
| The corrupt elders | Fat elders; the poor seem neglected | **A compromise, not a harm.** He lets the elders steal so he can skim the gold. Rebel groups feed the poor with it, so no one is truly neglected. The elders answer for it at the Hearing. |
| The captive treasurer | A treasurer who "disappeared" | **Real.** Rael held him captive for years without trial to keep the fund trail secret. He is alive. His family testifies. |
| The Quiet Crown's pursuit of Anissa | Hushers frighten and hunt her | **Real harm, not his order.** The same autonomy that makes the cult effective lets the Regent's agents bend cells. His design hurts his daughter. |
| The Crown alliance | Rael joins the Crown | **A farce.** He will turn on the Regent. |
| Lying to his children | Gianna learns late | **Real.** He lied to them for twenty years. |

The real harms are **few and non-lethal**, and he is **not redeemed in the moment**. The pardon is **earned at the Hearing**, not given by the plot.

**Voice and lines (examples)**
- Public: "Mercy is a debt. I do not borrow."
- Public: "Every oath has a price. I only ever argued over the number."
- Private, to Gianna (near the end): "My father kept his oath and it cost him everything. I wanted to know what would happen if someone kept the goal instead."
- Private, to Azzy: "You have your grandfather's hands and your mother's patience. Neither is a reason to disobey."
- At the Hearing: "I never asked the eggs how they felt. I am asking now."

**Brasador skills he uses (from the board game), as captures**
| Skill | In battle |
|---|---|
| **Sangre Ardiente** (Burning Blood) | Gains power each time a party member is **bound**. |
| **La Marca** (The Brand) | Marks a target; marked targets take extra damage and are bound first. |
| **Grito de Guerra** (War Cry) | Forces one party member to skip their next action. |
| **Reinado de Cenizas** (Reign of Ashes) | Once per battle, a huge hit scaled to how many party members are bound. |

**Captured vs. knocked out:** in Rael's fights a party member reduced to 0 HP is **Bound**, not downed. They are out of the fight but recoverable (**Break Free** action, or a Comfort turn from Gianna). If everyone is bound, **The Heir Rises** (retry with a Grudge). This is a fair-play clue: the warlord called Ruthless never kills anyone on screen.

**Boss design**
- **Fight 1: The Trial of Blades (Ardencia, slice finale).** Three phases. *Measured:* single-target pressure and Marks; he deliberately leaves **Anissa** an opening to see if Gianna shields her, so the player is taught Shield Anissa. *Unleashed:* War Cry and guards; the player must use Surge to break through. *Cornered:* Reign of Ashes; a clean Surge plus a Comfort turn wins. **He is defeated but survives.**
- **Fight 2: The Harbor Turn.** A **choice, not a fight**, unless the player strikes (5.6). If struck, a four-phase fight in which he refuses to kill Gianna; it ends when his army breaks.
- **Tell:** a half-sun signet on his left hand, the other half of Gianna's Locket. It **glows when he lies**. The player sees it in cutscenes; Gianna does not understand it.

**Foreshadowing the twist (so it is fair)**
1. The signet glows when he lies in public and not in private.
2. Elodie's two lines at the Parley.
3. Kuroshi's ledger trail of gold flowing out of Ardencia.
4. Samira appraising Brasador coin: "this has been somewhere else."
5. Free Brasador soldiers who say the arrows missed.
6. A lamp-oil seller in Xaraguá who has never met her supplier.
7. A Concord debate in Ardencia about whether a thief who feeds the hungry is a thief.
8. Nobody dies in his fights.

**Design risks (devil's advocate)**
- **A secret-hero twist can cheapen the cruelty.** The staged and real columns above keep the harm real, and the Hearing makes him answer for it.
- **Gianna cannot know until near the end, but many players will guess.** That is fine: the drama is that she does not, and the player watches her choose without the information they have.
- **The double-agent trope is familiar,** so the clues must be readable but not obvious.
- **Testing his own daughters is a real moral failing,** not a clever plan. Elodie should say so.
- **He built a cult whose autonomy now hurts Anissa.** That is the point: his methods created the thing that hurts her.

**Pixel design:** black-and-crimson plate over a scorched cloak, a long scar over the left eye, a signet ring, silver at the temples. Idle pose: hands behind his back. Battle sprite: slow, economical movements, no wasted motion.

**Pixel art prompt for Gemini**
> Pixel art battle sprite for a Game Boy Advance era JRPG boss. Tall Spanish-inspired warlord in black and crimson plate armor with a scorched cloak, long scar over the left eye, silver at the temples, gold signet ring on his left hand. Calm, cold posture, hands clasped behind his back in the idle pose. 48 x 48 pixel cell, 16 color palette, hard pixel edges, no anti-aliasing, no text. Solid magenta background #FF00FF.

**Theme:** a slow low-brass ostinato that starts warm and turns cold; the same melody reappears in a major key in Benny's Echo, and again, quietly, at the Hearing.

---

## 6. CORE SYSTEMS

### 6.1 The Echo swap

- **Button:** X on a controller. Works only inside an **Echo Zone** (shimmering tiles) or at an **Echo Site** (set pieces).
- **Effect:** the screen shifts to a warm, sepia, slightly dithered palette; the active map layer set flips; the party becomes the **Echo party** (Patricio, plus Caona if Yari is in the party, plus Benny once Azzy has joined). Position on the grid is preserved.
- **Anissa:** stays at the Echo Site, visible as a glowing figure holding the door. She cannot be hurt there. Her **hints** still work.
- **Validation:** the swap is refused (soft sound, "The memory will not hold here") if the target tile is not walkable in the other era. The map validator guarantees this never happens inside a zone.
- **Anchors:** only objects flagged `anchor` in Tiled carry changes back to the present.
- **Echo party:** an ancestor is a **palette and headgear swap** of the modern sprite, which saves most of the art cost.
- **Different feel:** the Present party leans on magic, healing and ranged; the Echo party leans on melee and guarding. This is deliberate variety.

### 6.2 Puzzles

**Rules every puzzle follows:**
1. Solvable from information visible in the room or already in the Journal.
2. Has a **solution script** (a list of inputs) checked in automated tests (Section 9).
3. Takes at most 5 minutes the first time.
4. Never blocks story progress forever: **Anissa gives hints** after 3 minutes of being stuck ("Gigi, what if the old bridge could just... go back?"), escalating from nudge to answer. She costs nothing; the player can turn her off.

**Puzzle verbs:**

| Verb | Modern problem | Echo solution |
|---|---|---|
| Bridge | Collapsed or rotted | Patricio crosses, lowers a winch (anchor) |
| Door | Sealed vault | Ancestor leaves a signed paper or key in the wall (anchor) |
| Water | Dry channel or flooded cave | Ancestor opens or closes a sluice |
| Growth | Bare ground | Ancestor plants a seed; in the present it is a climbable tree |
| Fire / light | Dark temple | Ancestor lights a lamp that stays lit (anchor) |
| Cipher | Illegible inscription | Ancestor writes it in plain text |
| Stealth | Empty ruin | Echo version has guard patrols |
| Weight | Heavy statue | Patricio (stronger) pushes it onto a plate |
| Terrain | Lava / ice hazard | Cooled or frozen in the other era |
| Social | Locked-out NPC | Echo NPC gives a password |
| Escape | Chase | Benny's tunnel opened in the Echo, used in the Present |

**Signature puzzle per place:**

| Place | Signature puzzle |
|---|---|
| Zetwal | Collapsed rope bridge to the Temple of Elodie island (tutorial: bridge) |
| Xaraguá | Flooded petroglyph cave; echo sluice; rhythm lock at the areito plaza |
| Al-Doria | Guild vault: weights and ledger cipher |
| Ardencia | The escape through Benny's smuggler tunnel; forge fortress lava channels |
| Eightgate | Throne Archive: reading the Accord in both eras |
| Skarragol | Frozen fjord crossing plus a horse-herd stealth sequence |
| Kuroshi | Fog maze with lantern signals; rotating screens; echo spy map |
| Jwaladesh | Relay of lamps and mirrors; a lamp lit in the Echo stays lit |
| Aldermoor | Archive puzzle, then a courtroom "who is lying" trial before the Regent |

### 6.3 The three pillars and ally prices

| Pillar | Earned by | Used for |
|---|---|---|
| **Wealth** | Jobs, trade deals, taking spoils | Score (not spent). Opens bribery and trade options. |
| **Fear** | Winning battles, showing force, breaking enemies | Score (not spent). Opens intimidation options. |
| **Influence** | Library lore, artifacts, puzzles, diplomacy, sparing enemies, **resolving street debates** | Score (not spent). Opens persuasion options and the best ending. |

**Gold is separate (owner decision, Oct 14):** **gold** is the money on hand, spent at shops, smiths and stands and on fares; buying never lowers the Wealth score. Each pillar is tracked **per city** (what you earned there) and **realm-wide** (all cities added up); the menu shows both, with **Armies** (soldiers pledged) as military might. Rules: `quest/src/engine/rpg.ts`; content: `quest/src/data/rpg.ts`. Reading a city's lore books earns +1 Influence there.

**Levels and the quest log (Oct 14):** each character has a level (cap 30) from XP: the party shares XP from main-quest steps (25 each) and lore books (10 each) and from side-quest rewards; each member adds what they earn alone (battles, later). Foes show their level coloured against the party's: grey easy, white even, orange hard, red deadly (the menu's Foes page). Gear has a level: worn below it, it gives half its bonus and shows "too heavy". The menu's **Quests** page lists the main quest and the side quests (accepted in conversation, followed step by step, rewarded once). Numbers: `quest/src/config.ts` (LEVELS); rules: `engine/rpg.ts`, `engine/sideQuests.ts`. Schedule: `docs/quest/SCHEDULE.md`.

**Controls (owner decision, Oct 14):** keyboard (arrows or WASD, eight directions), gamepad, and on touch screens a **D-pad** (press between two arms for a diagonal) with A, B, Echo and Menu. On phones the controls sit in the **black bars** beside the picture (sideways: D-pad left, buttons right; upright: all in the bottom bar), never over it; the picture shrinks a little when the bars are too narrow. **Tap or click** a spot to walk there (shortest path, eight directions, no corner cutting, never through a door or a trigger on the way), or a person or thing to walk up and talk to it or use it. The minimap lives in a bar too (or the picture's corner when there is none).

**The menu (Oct 14):** full page, with tabs Status (party, stats, gear), Items (the bag, 24 items; key items and worn gear are free), Equip, Map (the city's sections, visited or not, and the realm), Journal and System. A **minimap** shows the area around you with the city and section name. Vendors open a buy-and-sell shop after their greeting (sell price: half).

**Motive and price:** every allied group wants **exactly one** currency (5.4). To win them, reach their **price** in that currency: Wealth is your Wealth score (gold gifted to them also counts, 100 gold = 1 point); Fear and Influence are your running scores. Any other currency counts at **half value**, so there is always another route, just slower. Paying in full wins the alliance and its army; overpaying adds reinforcements for the War of the Harbor. Prices are tunable in `quest/config.ts`.

| Group | Motive | Price (starting values) |
|---|---|---|
| Xaraguá | Influence | 8 |
| Al-Doria | Influence | 10 |
| Kuroshi | Influence | 10 |
| Skarragol | Wealth | 10 |
| Jwaladesh | Wealth | 8 |
| Free Brasador | Fear | 6 |
| Aldermoor dissidents | Fear | 8 |

The Crown bribes with the same three currencies. **Rael** appears to have taken Wealth. The gold is real, and so is where it went (5.8). A group it can **out-pay** is a group that is not fully paid (5.6, the betrayal).

**Armies** are a number per allied group, called in during the War of the Harbor.

### 6.4 Battle system (turn-based)

- **Party:** 4 active, up to 8 on the roster. At the start: Gianna and Yari, with Anissa as the support system.
- **Order:** initiative bar at the top (speed-based, visible).
- **Commands:** Attack, Skill (SP), Item, Guard, Swap Member, **Parley** (only vs. humans; ends the fight with no Fear gain).
- **Yield step:** when a human enemy falls below 25 percent HP: **Spare** (+Influence), **Take spoils** (+Wealth), **Break them** (+Fear). (Rael's encounters follow special rules, 5.8.)
- **Echo Battles:** some battles are fought in the Echo with Patricio's party. Winning one yields a **Memory**: a permanent bonus or a hidden Present-era route.
- **No death spiral: The Heir Rises.** If the whole party falls, the fight restarts with a **Grudge** (+10 percent damage vs. that enemy group, stackable to +30 percent). It echoes the board game's Grudge and Reckoning.
- **Animations:** minimal. Flash, shake, simple lunge.
- **Difficulty:** Story / Normal / Hard. Default **Story** ("reasonable", as Rael asked).
- **Engine rule:** all battle math is pure TypeScript with the seeded Rng and unit tests.

**Anissa's Surge (the enhancing-pet system, with a person at the center):**
- Anissa has two small meters: **Spark** (0 to 10) and **Calm** (0 to 3). She is **not targetable** by normal attacks.
- **Pairing rule:** Anissa is the reservoir and Gianna is the instrument. Gianna's skills cost less SP than any other character's (about 25 percent less, rounded down, minimum 1), and every point of Spark Anissa feeds in is converted at full value because Gianna wastes none of it. Anyone else channeling Anissa's Spark would lose half. This is why the Quiet Crown cells and the Regent want Anissa and why they need Gianna out of the way: alone, either sister is a danger or a target; together they are the strongest thing in the game.
- **Spark** rises by 1 whenever Gianna acts and by 2 when Gianna uses **Guard** (Gianna shielding her). Spending 5 Spark triggers **Surge**: Gianna's next spell or attack deals +50 percent and splashes to all enemies. At 10 Spark a bigger **Dawn Surge** also heals the party.
- Some enemies (the cultist **Hushers**) use **Frighten**, which lowers **Calm**. At Calm 0, Anissa goes quiet and Surge is unavailable until Gianna uses **Comfort** (a cheap skill that restores Calm). No game over from this; the cost is lost power and a worried line from Gianna.
- Gianna's **Shield Anissa** command takes a hit meant for her. This is the "protecting her sister" verb and should be the first thing the tutorial teaches about Anissa.
- Design note: Anissa must read as a character, not a battery. She is **shy**: she speaks softly in short lines, hides behind Gianna when enemies appear, and her Surge animation is a tiny hesitant gesture that grows more confident as the game goes on. Her arc is finding her voice. Do not skip this.

**Built so far (Oct 15):** the battle engine (`quest/src/engine/battle.ts`, formulas from `docs/quest/design/COMBAT.md`, numbers in `quest/src/config.ts`) and the battle screen (`quest/src/scenes/BattleScene.ts`). Speed sets the turn order ("Next:" line); Attack, Skill, Guard, Item and Surge; Gianna's 25 percent SP discount; Spark (+1 act, +2 guard) and Surge (5 Spark, +50 percent, free action); **Anissa's Light** (every third turn Gianna gets back a fifth of her SP); heavy enemy moves telegraphed a turn early; healing over time; The Heir Rises (retry with Grudge, up to +30 percent); Story difficulty softens enemies. Not yet: splash, Dawn Surge, Calm and Frighten, Shield Anissa, Parley, the Yield step, Swap Member.
**The battle screen (owner decision, Oct 15): a pulled-back side view, seen a little from above** (like the owner's reference picture). A painted scene behind (one per area, drawn in code until painted art arrives: `BATTLE_BACKDROPS`), **four fighters** on the left facing right in two rows (blades in front, mages and archers behind), Anissa behind them all, up to four foes on the right, and a strip along the bottom with the party's HP and SP and the commands. Choose a command, then a **target** (a cursor over a foe or an ally, or every target at once for a whole-side skill; taps work too). Skills name their targets (one foe, every foe, random foes, one ally, the whole party, the user), can carry an **element** (light, fire, water, wind, earth; weakness x1.5, resistance x0.5) and a **status** (Inspired, Weakened, Marked, Warded, Regen). Food and drink bought in shops are under Item and can be given to any ally. **Party of up to 8, 4 fight at once:** **Swap** trades the fighter whose turn it is for someone waiting (it takes the turn), and a fighter who falls is replaced at once by the next one waiting; the fight is lost only when everyone is down. **The front row shields the back row:** a foe's one-target attack can reach a mage or an archer only when no one is standing in the front row (owner: "until the attackers with weapons are hit first", read as knocked out); area attacks (`area: true` on a foe's move) reach everyone. **Anissa can never be hit.** **Skills grow (owner, Oct 15):** mages learn spells by level and from books, ranks make them stronger, and only a few can be equipped (4, then 5 and 6); skills from rare or better gear are free; attackers' Attack opens weapon moves with cooldowns; a plain staff only bashes (`docs/quest/design/COMBAT.md` 9.10). **The fighters never walk or lunge:** they shiver when they strike or are struck, and only the effects move (slash, claw, impact, arrow, heal, buff, debuff, the five elements, Surge: `quest/src/scenes/battleFx.ts`). Battle-stance sprites per weapon tier are on the art list (`docs/quest/ART-PROMPTS.md` 9).
**The first battle (owner decision, Oct 15):** one introductory fight in Chapter 1, the exception to "no fights in Chapter 1" (6.6): on the Cane Road outside Zetwal, once Anissa is with her, Gianna is charged by a **cane-field boar** (level 3). Anissa's short tips teach Spark, Surge and Guarding the telegraphed Charge. It pays 40 XP, 12 gold and the **Boar-tusk charm** once (`encounter.wilds.boar.won`). Data: `quest/src/data/battles.ts`.

**Gear (owner decision, Oct 15):** four slots: **weapon, armour, charm** and **relic**. Five rarities, each with a box colour: common (grey), uncommon (green), rare (blue), **epic** (purple), legendary (gold). Ordinary gear has a fixed level and set stats; rarer pieces add a special (regeneration, SP regeneration, critical chance). The nine **secret items are legendary relics**: they sit in the relic slot, are never too heavy, take no bag space and **scale with the wearer's level**. Class rules: only mages use staffs, only archers use bows, warriors use blades; anyone wears any armour, but robes suit mages, leather suits archers and heavy armour suits fighters (the Equip screen marks what suits). The **Equip screen** shows the chosen person, their four slot boxes (rarity background, item art, level), their stats, and their **passives** (Anissa's Light, Spark and Surge, and so on). Rules: `quest/src/engine/rpg.ts`; catalogue: `quest/src/data/rpg.ts`; art: `quest/src/assets.config.ts`.

### 6.5 Classes by house (follows `bloodline-houses.md`)

| Character | House | Class | Role | Signature skills (from the board game) |
|---|---|---|---|---|
| **Gianna** | Kay Soley | **Archivist-Mage** | **Healer / mage** | **Limyè Elodie** (heal), **Sèman Lapè** (Peace Oath: enemies skip turns), **Rit Solèy** (limit break). Learns spells from lore books she reads. Low HP, high SP. |
| **Patricio** (Echo) | Kay Soley | **Warden** | Melee tank | Guard, Taunt, Oathbreaker (heavy hit) |
| **Yari** | Yaguana | **Archer** | Ranged / chaos | **Voice of the Opia**, **Guaiza** (copy last enemy skill), **Song of Coaybay** |
| **Azzy** | Brasador | **Blade-Knight** | Fear / bruiser swordsman | **La Marca** (mark target), **Grito de Guerra** (taunt / stun) |
| **Benny** (Echo) | Brasador | Swordsman | Duelist | Riposte, Mark |
| **Bayarmaa** | Ironvow | Raider | Fast mid-range | **Raider's Charge**, **Great Raid** (two turns in a row) |
| **Vikram** | Agnivansh | Fire duelist | Fast glass cannon | **Rakt Ki Pyaas** (bonus action after a kill), **Ananta Yuddha** |
| **Haru** | Suzumori | Shadow agent | Debuff / info | **Kagemimi** (reveal enemy next move), **Sasayaki Ha**, **Ayatsuri** |
| **Samira** | Dorini | Alchemist | Support / economy | **Daftar** (convert Wealth to heal, damage or buffs), bribe |
| **Edmund** | Stillwater | Guardian | Tank / counter | **Long Watch**, **Aldermoor's Vigil** |

**Class note:** Rael suggested "British = swift swordsman" and "Mongolian = heavy". The board game lore says otherwise: **Stillwater (English) is defensive and patient; Ironvow (Nordic/Mongolian) is mobility and aggression; Brasador (Spanish) is the fear/conquest house**. The swift swordsman is Agnivansh, the heavy blade is Brasador (Azzy), and the guardian is Stillwater (Edmund).

### 6.6 Travel, jobs, libraries, shops

- **Capital layout (owner decision, Oct 14):** every capital is at least **four sections** (separate maps joined by doors): the hub (the town or plaza), the **library**, the **capital building** (the seat of the state), and a **wild section**, either outside the city or in its rough district. Shrines, homes and puzzle sites come on top. The wild section has **random encounters**: bandits, crooks and Quiet Crown cultists, chosen per capital. They use the map layer `encounters` (property `table`), the tables in `quest/src/data/encounters.ts`, and the chance and grace steps in `quest/src/config.ts`. Until the battle system (Phase 3) exists, an encounter is a short stand-in scene: Fight always wins and Run always escapes, and both are remembered as flags. **No fights in Chapter 1 (owner decision, Oct 14), except the one introductory boar battle (Oct 15, 6.4):** there is no war and no banditry yet, so each wild section's ambushes are gated by a story flag that a later chapter sets when the party returns (Zetwal: `story.zetwal_return`, listed in `LATER_STORY_FLAGS`). Ambushes come about once every 50 steps.
- **Zetwal's capital is Pòdlimyè** (owner decision, Oct 14): Kreyol "Port of Light" (*pò* is "port"), one word the way Port-de-Paix is Pòdepè. It replaces the first name, Pòt Limyè (*pòt* is "door"). A fluent speaker checks the spelling (Nov 18). Zetwal is the island nation.
- **Eightgate and the contested Throne (owner decision, Oct 15):** the realm's central city is **Eightgate**: eight
  roads from the eight lands end at its eight gates, every house may enter as an equal, and by old courtesy no steel
  is drawn inside its walls (allegedly; the story tests it). The old seat of the realm, the Throne, stands at its
  heart; courtiers call it "the old seat" or "the Hall". The quest never names the city for Elodie: only the Gaze's
  faithful still call it "Elodie's Seat". **Canon:** the Gaze of Elodie is the **oldest faith in the realm** (stated
  plainly, never disputed). **Whether Elodie blessed the Throne is disputed**, and the sources must contradict each
  other on purpose:
  - **The Gaze temples (Zetwal, the Temple Archive):** Elodie blessed the Throne and set her sun on the brow of the
    first heirs; the sun-mark is her sign.
  - **The Crown chronicles (Aldermoor) and the Regent's court:** the Throne was raised by the first kings with the
    houses' consent; the blessing is a temple tale, and repeating it is close to sedition.
  - **Other faiths and houses:** each tells it its own way (a gift of the founders, a prize of war, a seat no god
    touched), at the Eightgate debate corner and in their libraries.
  - **Why it matters:** the people in power deny the blessing because it would make the sun-marked heirs' claim (and
    so Gianna's) stronger. The truth stays open until the Claim; the board game and its books can keep the blessing as
    lore.
  - **In Pòdlimyè now:** *The Blessed Seat* (Temple Archive, Faith shelf) and *The Throne: A Crown Chronicle* (Hall of
    the Accord, Law and Houses shelf) tell the two sides; each carries a reader's note pointing at the other.
- **Readable text (owner decision, Oct 15):** the game is drawn at a whole multiple of 320 x 180 matched to the
  screen (up to 4x, `RENDER_SCALE_MAX`), the camera zooms by it from its top-left corner, and every text is rendered at
  it, so letters are sharp while the pixel art is enlarged in whole steps as before. The font is **Atkinson
  Hyperlegible** (Braille Institute, OFL), loaded before the game starts (`quest/src/ui/text.ts`, the one place text
  styles come from). **System > Text size** switches Normal / Large (kept per device in localStorage; Large is a
  little bigger with tighter line spacing, and the dialogue box gains a line). Tile culling is off (the zoomed camera
  confuses it; the maps are small). The country names on the painted world map are half size.
- **Chapters, not acts (owner decision, Oct 14):** the story is told in chapters; **Chapter 1: The Festival of the
  Gaze** is Pòdlimyè, Chapter 2 is Xaraguá. On screen (the Journal, the end card) it says "Chapter"; the code keeps
  the `act1` id and flags so saves stay valid.
- **The menu's maps (owner decision, Oct 14):** the **city map** is drawn from the capital's real maps: each outdoor
  section at its place on one grid (`at` in `quest/src/data/rpg.ts` CITIES), paths and bridges joining doors that lead
  to each other, indoor places as numbered buildings at their doors, unvisited places greyed with "???", and a
  blinking "you are here" (`quest/src/engine/cityMap.ts`). The **realm map** is the board game's painted map (owner
  decision, Oct 15: the painting, not a pixel version), shown sharp over the map area by
  `quest/src/ui/RealmOverlay.ts` from a 1024 px copy in `quest/public/maps/realm.webp`. Each country is named on it,
  your country's capital blinks, and countries not reached yet lie under a soft mist. Names, capitals and the mist
  follow the borders traced from `docs/art/board-guide.png` by `quest/tools/realm-map.py` into
  `quest/src/data/realmMap.ts` (run it again when the board's borders change). A legend lists each place and its
  house. The city map stays pixel art, drawn from the game's own maps.
- **Item popup (owner decision, Oct 14):** the first time an important item is received, it is presented. Story items
  (the Sun Locket) and the secret items (gold "Legendary item" banner) get the full showcase: the screen dims, the item
  rises and grows with turning light rays, a glow and sparkles, then its name, description and abilities. Each ability
  shows only once the story has explained it ("???" until then). Side quest reward gear gets a small card. A, B or a
  tap closes it; the Items page replays story and legendary items with what is known so far. Data: `showcase` and
  `abilities` on items in `quest/src/data/rpg.ts`; rules: `quest/src/engine/showcase.ts`; drawing:
  `quest/src/ui/ItemShowcase.ts`; pictures: `ITEM_ART` placeholders, replaced by `quest/art/items/<id>.png`.
- **Secret items (owner decision, Oct 14):** all nine in `docs/quest/design/SECRET-ITEMS.md` are approved, one per capital and one at Eightgate, each behind a side quest and a hard puzzle with an Echo part. Pòdlimyè's is Solange's Quill (Milestone 1).
- **Pòdlimyè's sections:** the festival plaza (hub), the **Iron Market** west of it with the **Hall of the Accord** (the capital building, an 8-bit gingerbread state house with a gold dome; the Chapter 1 task The Envoy's Papers), the **Old Harbor** along the shore and **Solèy Heights** up the hill (exploration now, more on the return), the Temple island, the **Temple Archive** (library, on the temple island), the **Cane Road** beyond the east gate (wild: peaceful in Chapter 1; bandits, smugglers and Quiet Crown zealots on the return), and the Limyè house. **Every capital has at least five outdoor areas, buildings aside** (owner, Oct 15).
- **Travel:** the **Carriage Guild**. A map screen lists unlocked destinations with fares. Unlocked by story progress, letters of introduction, or learning locations in libraries. Travel is a short cutscene. No random encounters on the road between capitals in v1 (the wild sections have them).
- **Jobs:** 3 to 5 per capital from a **contract board**. They pay Wealth and sometimes Influence.
- **Libraries:** every capital has one, with 8 to 10 **lore books** (100 to 150 words each, about 60 total). The **capital building has books too** (laws, records, seized papers), usually 3 to 5. Reading grants Influence. Categories: history, law, **religion**, trade, war, gossip, folklore, genealogy. Books sit on **shelves**: facing a shelf lists its books (up to 8), unread ones plain and read ones marked "(read)"; reading shows the pages under the book's title and sets `lore.<book>`. Content: `quest/src/data/books.ts`. Zetwal has 13: nine in the Temple Archive and four in the Hall of the Accord. The Hall's public copy of the Sun Accord lists six clauses on a seven-ribbon binding (the first clue to the Seventh Clause). The Archive's *Ash Wars: A Temple Record* is the Zetwal temple record among the four contradictory Ash Wars accounts (5.8); its numbers (Cendre ford: forty dead, not four hundred) are a *proposal*.
- **Shops:** see 8 (culturally relevant items and languages).
- **Journal:** active quests, found lore, pillar totals, price paid per ally, army count, **Concord** per faith, and a **Phrasebook** of words learned from vendors.

### 6.7 Replayability

1. **Next Generation mode:** after the credits, play the same world as **Yari** with the Caona Echo. A Taino perspective, same maps, different dialogue and a few unique puzzles.
2. **Betrayer shuffle** and three endings.
3. **Trust or strike** at the Harbor Turn, the verdict at Rael's Hearing, and Azzy's three Claim choices.
4. **Faith paths:** the shrine boon you take and the debates you win change dialogue and a few puzzle solutions.
5. **Lore completion:** about 60 books, about 40 artifacts, a bestiary, a phrasebook.
6. **Hard mode** with fewer Grudge retries.
7. **Legacy trait carry-over:** pick one trait to carry into a new game (borrowed from the board game).

---

## 7. THE FOUR RELIGIONS

**Design rules:**
- These are **fictional faiths inspired by general themes**. None is a real religion, and none maps one-to-one onto a real people's faith.
- The **cult** is deliberately **not** tied to Zetwal, Xaraguá, or any real cultural group. It sits at the Crown's court and recruits across every house.
- Every capital has at least one **shrine or temple**, one or two **street debate corners**, and ambient NPC lines about faith.

### 7.1 The faiths

| Faith | Core belief | Practice | Where it is strongest | Shrine boon |
|---|---|---|---|---|
| **The Gaze of Elodie** (the goddess faith) | Elodie wove the realm and **remembers** everything, but does not rule. Rulers are accountable because she sees. | Remembering the dead aloud, sun-marked heirs, temple libraries, a festival of the Gaze | **Zetwal** (core). Minorities in Al-Doria (merchants), Ardencia (nominal), Eightgate. | Revive one fallen member once per area. |
| **The Four Hands** (the elemental earth faith) | Land, water, wind and fire are living hands; no one owns what they hold. | Offerings at springs, groves, passes and flames; the areito dance of memory; regional sects (Roots and Tides, Sky-Riders, Flame Keepers) | **Xaraguá** (earth and water), **Skarragol** (wind), **Jwaladesh** (fire) | Elemental resistance for the next battles. |
| **The Witness** (the faith of oaths) | A promise is sacred; the Witness sees every oath kept or broken. | Oath-swearing, contracts blessed by temple scribes, honor duels, the Unpaid Debt as a sin | **Al-Doria** (contracts), **Ardencia** (military oaths), **Kuroshi** (honor and balance), **Aldermoor** (law) | 10 percent off the next ally's price. |
| **The Quiet Crown** (the cult) | The realm is ruined by noise and division; one hand on the Throne will bring the Quiet. Silence and obedience are virtue. | Masked vows, hooded recruiters, "charity" that creates debt, stealing voices (suppressing dissent). Targets lonely people. | Secret cells in **every** hub. Hidden head in the Regent's court. | A **forbidden boon** with a cost (power, but lowers Concord and Anissa's Calm). Optional. |

**Origin of the Quiet Crown:** Rael founded it more than twenty years ago as a whisper-and-influence network, a way to move rumor and money without his name on it. Its members **do not know he is its head**; a faith that believed it answered to a warlord would be less effective. Cells run with autonomy by design. That autonomy also lets the Regent's agents bend some cells to their own ends, including the Hushers who hunt Anissa. Sincere followers joined for belonging, not politics. At the Hearing Rael must publicly confess that he is its head.

The **Unpaid Debt** is a Witness sin. The **Gaze** says rulers are watched. The **Four Hands** say Xaraguá was never Zetwal's to trade. The **Quiet Crown** says the Throne should end the argument. All four views collide in the plot, which is why the street debates matter.

### 7.2 Street debates (the interactive piece)

Every hub has at least one **Debate Corner**: two NPCs of different faiths arguing in public. Interacting offers:
- **Listen** (+Influence, short lore snippet).
- **Join** (a 3-round exchange; choose an *Appeal*: **Scripture**, **Reason** (uses a lore book you have read), or **Compassion**). Win to gain Influence and Concord.
- **Mediate** (requires enough Influence; raises **Concord**, the realm-wide harmony score).
- **Provoke** (+Fear, lowers Concord).
- Debates **rotate with the story**: they change after the reveal, after the Muster, and after the betrayal.

| Hub | Debate corner |
|---|---|
| Zetwal | Gaze keeper vs. Quiet Crown recruiter: *Is a goddess who only remembers any use?* |
| Xaraguá | Four Hands (Roots and Tides) elder vs. Gaze pilgrim: *Is the land owned or remembered?* |
| Al-Doria | Witness contract-priest vs. Gaze merchant: *Is a bad bargain still sacred?* |
| Ardencia | Witness oath-knight vs. Gaze skeptic: *What do you owe a lord who has broken his oath?* (rewrites itself after the duel) |
| Eightgate | All four, arguing over who may sit the Throne |
| Skarragol | Four Hands (Sky-Rider) vs. Witness elder: *Oath of blood or oath of sky?* |
| Kuroshi | Witness (balance) vs. Quiet Crown whisperer: *Is silence virtue or concealment?* |
| Jwaladesh | Four Hands (Flame Keeper) vs. Gaze: *Is hesitation a sin, or is remembering mercy?* |
| Aldermoor | Quiet Crown hierarch vs. Gaze exile: *Should the Throne have one hand?* |

After the Harbor Turn every hub gets a final debate corner: *a faith that began as a political tool: is it still a faith?* The Quiet Crown's own followers speak for themselves.

**Concord** (0 to 100) feeds Accord Stability (5.7), some price discounts, and lets the player unlock a hidden scene in each hub when it is high.

### 7.3 Sensitivity notes

- Haitian Vodou and Taino spiritual traditions are real, living or historically real faiths. They are not portrayed here, and **no real faith should be called a cult** in dialogue or lore.
- Reference check: ask a knowledgeable person from each culture to review the faiths that echo their region before release.
- Hate and extremism are the cult's tools, not its gimmick. Keep recruitment scenes grounded in loneliness and debt, not caricature.

---

## 8. SHOPS, ITEMS AND LANGUAGES

**Rule:** every vendor greets the player in their own language with an English line under it. Items are grouped in **families** (heal, buff, gear), and each hub sells its own **cultural variant** of the family with a slightly different stat flavor.

**Language list (examples; each must be checked with a native or fluent speaker before release):**

| Place | Language flavor | Example vendor lines |
|---|---|---|
| Zetwal | Kreyol (Rael's family speaks it; he can review) | "Bonjou!" / "Kijan ou ye?" / "Mèsi!" |
| Xaraguá | Taino (extinct; only partial vocabulary survives. Use attested words and flag invented ones) | Words such as *bohio* (house), *hamaca* (hammock), *guatiao* (friend, ritual friendship). **Verify spellings with a source.** |
| Al-Doria | Arabic-flavored | "Ahlan wa sahlan" / "Shukran" |
| Ardencia | Spanish | "Bienvenido" / "¿Qué desea?" / "Gracias" |
| Skarragol | Old Norse and Mongolian | Greeting and thanks in each |
| Kuroshi | Japanese | "Irasshaimase" / "Arigatou gozaimasu" |
| Jwaladesh | Hindi / Sanskrit-flavored | "Namaste" / "Dhanyavaad" |
| Aldermoor, Eightgate | English | Formal and courtly English |

**Sample cultural item families:**

| Place | Healing item | Gear / accessory | Quirk |
|---|---|---|---|
| Zetwal | Restorative soup in a clay pot | Sun-stitched cloth charm | Heals over time |
| Xaraguá | Cassava bread | Carved zemi charm | Resist spirit damage |
| Al-Doria | Spiced tea | Beaded amulet and appraising scale | Sells for more |
| Ardencia | Hearty stew | Signet ring, blackened armor | Boosts Fear gain |
| Skarragol | Salted jerky and fermented milk | Braided fur cloak, round shield | Resist cold |
| Kuroshi | Rice ball and green tea | Paper charm, silk mask | Reveals one enemy skill |
| Jwaladesh | Spiced milk and flatbread | Flame-bead bracelet | Boosts fire skills |
| Aldermoor | Meat pie and tea | Law-seal brooch, plain steel | Reduces enemy Wealth drops |

Implementation: a `lang/*.json` glossary with `{ word, language, translation, verified }`. The Journal **Phrasebook** unlocks words as the player hears them. Unverified entries are tagged so they can be audited before release.

---

## 9. TECHNICAL ARCHITECTURE

**Rendering:** Phaser 3, `pixelArt: true`, logical resolution **320 x 180** (changed from 240 x 160 so it fills a landscape phone), whole-number scaling when it fits. Tiles 16 x 16. Characters 24 x 32 (chibi proportions).

**Maps:** Tiled `.tmj`. One file per map containing:
- Tile layers: `ground_present`, `deco_present`, `ground_echo`, `deco_echo`, `above` (shared).
- Collision layers: `collide_present`, `collide_echo`.
- Object layers: `echo_zones`, `anchors`, `npcs`, `doors`, `triggers`, `puzzle_objects`, `spawns`, `debate_corners`, `shops`, `shrines`.
- Custom properties for puzzle ids, flags and conditions.

**Data driven:** dialogue, quests, items, skills, enemies, lore, jobs, puzzles, faiths and the phrasebook live in `quest/src/data` as JSON or TypeScript. The engine never hard-codes content.

**Dialogue:** a simple conditional format (flags, pillar thresholds, price paid, Concord). Support portraits, speaker names, choices and a translation line.

**Flags and save:** one global flag store. Saves in `localStorage` through a single `save.ts` module, with Export and Import save code. Autosave on map change and after battles.

**Input:** keyboard, Gamepad API (standard mapping), touch overlay. Single abstraction with actions: `move`, `confirm`, `cancel`, `echo`, `menu`, `run`.

**Pure engines (unit tested, seeded Rng, no Phaser imports):**
- `battle/`: turn order, damage, skills, statuses, Yield, Surge, Heir Rises.
- `pillars/`: Wealth, Fear, Influence, ally prices, armies.
- `concord/`: debates, Concord, Accord Stability.
- `puzzles/`: state machines, anchors, solution checking.
- `quests/`, `save/`.

**Automated checks (required, because the game is built largely by AI and nobody can eyeball 50 maps):**
1. **Map validator:** loads every `.tmj`; checks every Echo Zone tile is walkable in **both** eras, every door has a pair, spawn tiles are valid, every referenced id exists.
2. **Solution replayer:** every puzzle ships with `solution.json`; a test replays it and asserts completion; a second test asserts the puzzle is **not** solvable with a "cheat" list.
3. **Battle simulation:** simulates each boss 1,000 times with the seeded Rng at the default party (including both Rael fights, with and without Surge) and asserts win-rate bands.
4. **Headless smoke test (Playwright with Chromium):** boot, walk a scripted route, trigger a swap, win a battle, save, reload, assert state.
5. **Phrasebook audit:** a script lists every `verified: false` entry.
6. **Lint, typecheck, build** in the existing CI.

**Performance:** lazy-load by chunk. Load a hub's maps on entry.

**Accessibility:** text speed, hold-to-run, colorblind-safe pillar icons using different **shapes**, large touch targets, Story difficulty, optional hint-off.

---

## 10. ART AND AUDIO PLAN

### 10.1 Honest note on Gemini

Image generators, including Gemini, do **not** reliably produce true pixel-grid art. They approximate it, with uneven pixel sizes, stray anti-aliasing and inconsistent characters across frames. Plan a **generate, then clean** pipeline:

1. Generate concept images with Gemini (or the existing ChatGPT / Midjourney workflow) at large size on a **flat magenta background**.
2. Run a script to **remove the background** (`scripts/chroma-key.py`), **downscale with nearest-neighbor** to the target pixel size, and **quantize to the project palette**.
3. Fix frames by hand in a pixel editor (Aseprite, Piskel, or LibreSprite) where animation drifts.
4. For consistent character sheets, consider a dedicated pixel-art generator (as far as I know, PixelLab and Retro Diffusion are built for this); try one for a day before committing.
5. Free CC0 tilesets (Kenney, OpenGameArt) can be a base for terrain, recolored.

### 10.2 Asset checklist

| Asset | Size | Count | Notes |
|---|---|---|---|
| Overworld walkers | 24 x 32, 4 directions x 3 frames | 9 modern + 6 Echo twins | Gianna, Yari, Anissa, Azzy, Rael and the other companions; Patricio, Caona, Benny as Echo. |
| Anissa follower | 16 x 16 | 1 | She follows Gianna on the field; reacts to terrain. |
| Generic NPCs | 24 x 32 | 8 base bodies, recolored to about 40 | Per-house clothing palettes. Include street preachers, pilgrims, Quiet Crown recruiters. |
| Battle sprites (party) | 32 x 32, idle + attack + hurt + KO | 14 | Modern and Echo. |
| Enemies | 32 x 32 to 64 x 64 | 22 standard + 10 bosses | Crown soldiers, wildlife, spirits, mercenaries, Quiet Crown Hushers, Rael, the Regent, the betrayer. |
| Dialogue portraits | 48 x 48, 3 expressions | 16 characters | 48 images. Anissa gets 5 expressions. |
| Tilesets | 16 x 16, about 256 tiles | 9 places x 2 eras + interiors | Echo tilesets are recolor plus damage and age variants of the same layout. |
| Items and icons | 16 x 16 | About 100 | Gear, consumables, key items, lore, pillar icons, faith symbols. |
| UI | Dialogue box, menus, battle frame, debate frame, Surge meter, cursor, fonts | 1 set | Echo screen filter. |
| Title and ending stills | 320 x 180 pixel scenes | 1 title + 3 flashbacks (Gen I) + 3 endings + the Ardencia reveal | The only large "illustration" pieces. |
| World map | 320 x 180 | 1 | Carriage Guild travel screen. |

**Music (not Gemini):** about 12 chiptune tracks and about 40 sound effects. Options: royalty-free CC0 packs, BeepBox or Furnace for original tracks, or an AI music generator if its license allows your use. Decide licensing before using anything.

### 10.3 Prompt templates

**Character sheet:**
> Pixel art sprite sheet for a Game Boy Advance era JRPG. [Character: house, age, clothing, hair, props]. 4 directions (down, left, right, up), 3 walk frames each, 24 x 32 pixel character cells shown on a clean grid. Flat colors, 16 color palette, hard pixel edges, no anti-aliasing, no gradients, no text. Solid magenta background #FF00FF.

**Tile set:**
> Pixel art tileset, top-down JRPG, 16 x 16 pixel tiles on a grid, [setting]. Include ground variants, walls, doors, roofs, water edges, props. Limited 32 color palette, hard pixel edges, no anti-aliasing, no text. [Echo version: same layout, aged and sepia with cracks removed.]

**Portrait:**
> 48 x 48 pixel art dialogue portrait, bust, [character], expression: [neutral / determined / worried], 16 colors, hard pixel edges, plain magenta background, no text.

**House palettes:** reuse each house's existing crest colors from `docs/art/CREST-PROMPTS.md` as the accent ramp for its capital's tileset.

---

## 11. BUILD PHASES

| Phase | Deliverable | Done when |
|---|---|---|
| **0: Prep** (after the board game ships) | Approve names, palette, family tree, style anchor frame | Section 13 questions answered. |
| **1: Skeleton** | Phaser scene, movement, collision, Tiled loading, dialogue, flags, save, input | Walk around one test map on desktop and phone. |
| **2: Echo and puzzles** | Swap, Echo Zones, anchors, validator, solution replayer, Zetwal tutorial | Zetwal complete (about 35 min). |
| **3: Battle and pillars** | Battle engine, party, skills, Yield, Heir Rises, **Anissa's Surge**, ally prices | A boss simulation passes. |
| **4: Faith and shop** | Debate engine, Concord, shrines, one shop with a language glossary | A debate and a shop work in Zetwal. |
| **5: Slice** | Xaraguá, then Ardencia (duel, reveal, escape, Azzy joins) | **About 2 hours playable. Playtest with Elodie.** |
| **6: Remaining places** | Al-Doria, Eightgate, Skarragol, Kuroshi, Jwaladesh, Aldermoor | All recruits and rulers. |
| **7: Climax** | Muster, betrayal, War of the Harbor, Claim, endings, Next Generation mode (Yari) | Credits roll. |
| **8: Polish** | Audio, balance, accessibility, phrasebook audit, bug bash, cloud save (optional) | Final playtest. |

---

## 12. HONEST SCOPE

- **Pixel art makes the art cheaper, not the game.** The cost is content: maps, puzzles, dialogue, balance. Six hours is a lot of that.
- **Rough estimate (a guess, not a promise):** the 2 hour slice is a few weeks of focused work with Claude Code. The full game is months, mostly content and art, not code.
- **Recommended plan:** build the slice, play it with Elodie, then decide on the rest. A finished slice that tells the Ardencia reveal is a better gift than an unfinished 6 hour game.
- **Do not start before the board game is shipped.**

---

## 13. OPEN QUESTIONS FOR RAEL

**Settled (no action needed):** the Echo is time travel to the Revolution; Patricio and Benny are both alive and old in the Present; Elodie's father is Patricio (Haitian-inspired, Kay Soley); Elodie's secret husband is Rael; Rael is Benny's son; Gianna and Anissa are Rael's and Elodie's daughters; Azzy is Rael's older son by another woman; the Crown alliance is a farce; Rael founded the cult, which runs autonomously because its members do not know he leads it; he runs a shadow government against corruption and funds rebellions with the corrupt elders' gold; he prefers to capture rather than kill; he has few real harms on his record; he can be redeemed; the pardon terms and the title **Warden of Oaths** are confirmed; Elodie knows his plan, cannot tell anyone, and disapproves of testing the girls; Gianna cannot learn he is good until near the end; the surname is **Limyè** for Gianna, Anissa and Elodie; allies are unlikely and each wants one currency; every land provides a companion.

**1. Who cannot know?** (Settled: Gianna.) Your message said "Elodie can not know her dad is good until near the end." Since Elodie's father is Patricio, and you then said Elodie already knows what Rael is doing, I read it as **Gianna** who cannot know until near the end. Is that right?

**2. Real harms.** Settled as **few**: a treasurer held captive for years without trial, and the lies to his children (plus the test of the girls). The neglected poor are gone: rebel groups feed them.

**3. Elodie's name.** Settled: she tells everyone she took **Limyè** to honor the goddess of light, Elodie; in truth it hides that she is a Rodriguez. Her birth name is Jean-Philippe.

**4. The cult's hijacking.** Settled: yes. Because Anissa carries the goddess's light, the Regent's agents bend some cells to hunt her.

**5. Timeline.** Settled: the Revolution (Alliance War) is about fifty years ago; the Ash Wars about twenty-five years ago gave Rael the name "the Ruthless" and a reason to hide his family. The recorded history of the Ash Wars is **written wrong on purpose**, by **Rael and the corrupt elders together**, to frighten the people (Fear as a tool). See 5.8.

**6. Anicette, Patricio and Benny.** Settled: Anicette is alive; Patricio and Benny are alive and old. Still my proposals: Anicette keeps the Temple and gives the Locket; Patricio lives in Zetwal and testifies at the Hearing; Benny lives in the Ardencia keep. Change any of them freely.

**7. Azzy's mother.** Settled: a royal of the Mongolian empire, married to Rael only to win that empire's support in the Ash Wars; she later left and returned to her empire, and Azzy stayed in Ardencia. She is unimportant to the story and does not appear (at most a line of dialogue). Settled: her empire is **Skarragol**, which also explains why Bayarmaa's people have a stake in Azzy.

**8. Review.** Settled: I draft the languages and faiths as carefully as I can and you check them. Everything is flagged for review in the phrasebook audit.

**9. Music.** Settled: source from anywhere (CC0 packs, BeepBox or Furnace originals, or generated), unmonetized passion project, swappable later. Keep every track in one `audio.config.ts` manifest with a credits file so replacing a track never touches game code. **Tone settled:** a serious main story with comic companions (Yari's hutia, vendor banter, wacky side characters). Keep jokes out of the Rael, Anissa and Hearing scenes.

---

## 14. PASTE-READY OPENING PROMPT FOR CLAUDE CODE

> You are building a single-player pixel JRPG called "Bloodlines: Echoes of Zetwal" inside the existing `elodie-game` repo (React + TypeScript + Vite PWA, deploys to Netlify). Read `CLAUDE.md`, `docs/bloodline-houses.md`, `docs/bloodline-rulebook-draft.md`, `docs/rules-decisions.md`, `docs/art/ART-GUIDE.md` and `docs/quest/QUEST-BUILD-GUIDE.md` fully before writing code. The houses file is the source of truth for house names, homelands and abilities; the quest guide is the source of truth for the RPG design. If they conflict, stop and ask.
>
> **Rules:** do not modify the board game's `src/engine`, `src/net` or the Supabase Edge Function. Create everything under `quest/` and route it at `/quest`, lazy-loaded. Follow the repo's conventions: pure TypeScript engines with a seeded Rng and unit tests, content in data files, all art through `quest/assets.config.ts`, tunable numbers in `quest/config.ts`, `import type` for types, mobile-first.
>
> **Story context in one paragraph:** the heroine is Gianna Elise, a mage-healer and temple archivist of Kay Soley (Zetwal). With her Taino best friend Yari (archer) and little sister Anissa (a support system called Surge), she uses an artifact to swap into the memory of her maternal grandfather Patricio and back, solving puzzles. In Ardencia she duels Rael the Ruthless, learns he is also her father, escapes with her older half-brother Azzy (swordsman) believing he sides with the Crown, and then fights the Aldermoor Crown to free Xaraguá and claim the Throne as a just ruler. The Crown believes it bought Rael, but he is Elodie's secret husband, the founder of the Quiet Crown cult and the head of a shadow government fighting corruption, and he is running a double game. He prefers to capture rather than kill, the cult's members never learn he is its head, and Gianna does not learn the truth until near the end; she then pardons him on conditions. The family surname is Limyè. The allies are unlikely and each wants one currency (Wealth, Influence or Fear), and every land provides a companion who disagrees with its leaders. Four fictional faiths (the Gaze of Elodie, the Four Hands, the Witness, the Quiet Crown) appear in every city with street debates. Vendors speak in their own languages.
>
> **Build Phase 1 only:** Phaser 3 with `pixelArt: true`, 320 x 180 logical resolution (originally 240 x 160), 16 x 16 tiles, Tiled map loading, grid movement with collision, a dialogue box with portraits and conditional text, a global flag store, a save module (localStorage plus export and import code), and an input layer supporting keyboard, Gamepad API and a touch overlay. Use placeholder rectangles for all art. Include a map validator script and a Playwright smoke test. Stop and report when Phase 1 passes typecheck, lint, tests and build. Do not start the Echo swap, battles, debates or any story content until I confirm.
>
> **The core mechanic to design for, so Phase 1 does not paint us into a corner:** every map has two layer sets (Present and Echo) on the same grid. The player can swap eras only inside Echo Zones. Changes carry over only through flagged Anchors. Keep the map format, the flag store and the input abstraction ready for that.
>
> Ask me before choosing any name, adding any dependency beyond Phaser, or deviating from this plan.
