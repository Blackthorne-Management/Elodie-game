# Capitals: build sheets

*Design pack, Oct 14. One sheet per capital (8 houses plus Eightgate). Kept from the guide and the owner: every
capital has **at least four sections**, each a separate map joined by doors: the hub, the **library** (8 to 10 lore
books), the **capital building** (3 to 5 books) and a **wild section** with random encounters (owner decision,
Oct 14; guide 6.6). No fights in Chapter 1. Gold is separate from the Wealth score. Anything not in the guide or
already built is a **proposal**, including every city name except Pòdlimyè.*

**Owner rules (Oct 15).** Every capital has **at least five outdoor areas, buildings aside**, so it feels grand. Its
**seat of government is central** (at the head of or beside the main square, never out of the way), **large and
robust** (a long hall to the ruler's seat, plus chambers: council, envoys, records and seal, messengers, treasury,
offices), **staffed**, and home to **interesting political people** (factions that disagree, a foreign or Crown agent,
the people who carry messages). It is where the story's diplomacy and communications happen, so every capital's seat
gets a "Seat of government" paragraph below. Every capital's **market is unique** to its culture (no copies of a
plaza). Pòdlimyè is built this way; the other seats are proposals until their chapter is built. People are named by
role until the owner approves names.

**Conventions used below.**
- **Size** is rough, in 16 px tiles (W x H). The screen shows 20 x 11.25 tiles. Built maps give their real size.
- **Books:** 100 to 150 words each (guide 6.6), split into pages by the built `bookPages`; reading one sets
  `lore.<book>` and earns +1 Influence in that city (built rule). Book ids follow the built pattern `<city>_<name>`.
- **Wild sections** use the map layer `encounters` (property `table`), tables in `quest/src/data/encounters.ts`, and the
  built chance and grace steps (about one ambush per 50 steps). Each table is switched on by a story flag (like the
  built `story.zetwal_return`); new flags go in `LATER_STORY_FLAGS` until their chapter is built. Enemy names and
  levels match `COMBAT.md` 13.
- **Vendors** greet in their own language with an English line under it (guide 8); every non-English line is flagged
  `verified: false` in the phrasebook until a native or fluent speaker checks it.
- **Side quests** are listed by id; full entries are in `SIDE-QUESTS.md`. **Puzzles** by id in `PUZZLES.md`. **Secret
  items** in `SECRET-ITEMS.md`.
- **Rebel safehouse** (guide 5.4): one per hub, always marked by the grey **ash thumbprint**.

## Names at a glance

| Land | House | Capital | Status | Meaning and note |
|---|---|---|---|---|
| Zetwal | Kay Soley | **Pòdlimyè** | owner, Oct 14 | Kreyol, "Port of Light". Fluent check needed: *pòt* usually means "door" and *pò* "port"; "Door of Light" may be how it reads (`STORY.md` 6.1). |
| Xaraguá | Yaguana | **Yucayeque** | proposal | Taíno word recorded by the chroniclers for a town or village. Flag for a source check. Alternative: **Yaguana**, the historical capital of Xaraguá, if the owner is happy for the city and the house to share a name. |
| Al-Doria | Dorini | **Bab al-Dhahab** | proposal | Arabic, "Gate of Gold" (matches the house's *Bazaar al-Dhahab*). |
| Ardencia | Brasador | **Cenizal** | proposal | Spanish, "ash field". Fits "Rael the Ruthless, Warden of the Ash Road". |
| (centre) | the Throne | **Eightgate** | guide | The city keeps the realm's name for it. |
| Skarragol | Ironvow | **Ordvik** | proposal | A fusion: Mongolian *ord* (a royal camp, as in "horde") and Old Norse *vík* (bay). |
| Kuroshi | Suzumori | **Kirinoura** | proposal | Japanese *kiri no ura*, "bay of mist". |
| Jwaladesh | Agnivansh | **Agnipur** | proposal | Hindi / Sanskrit, "city of fire" (*agni* + *pur*). |
| Aldermoor | Stillwater | **Kingsmere** | proposal | English, "the king's lake"; a Crown seat on the moor. |

## Wild sections and their flags (summary)

| Capital | Wild section | Table id | Turned on by (flag) | Levels | Later change |
|---|---|---|---|---|---|
| Pòdlimyè | The Cane Road (built) | `cane_road` (built) | `story.zetwal_return` (built) | 22 to 25 | none |
| Yucayeque | The Mountain Path | `mountain_path` | `story.xaragua_pier_won` | 3 to 7 | `story.muster_done`: war table, 25 to 28 |
| Bab al-Dhahab | The Desert Edge | `desert_edge` | `story.aldoria_arrived` | 8 to 11 | none |
| Cenizal | The Cinder Flats | `cinder_flats` | `story.ardencia_arrived` | 11 to 14 | after the escape: Brasador patrols hunt the party, 13 to 15 |
| Eightgate | The Crossroads Fields | `crossroads` | `story.seat_arrived` | 14 to 16 | `story.harbor_won`: 28 to 30 |
| Ordvik | The Winter Plateau | `winter_plateau` | `story.skarragol_arrived` | road tier | none |
| Kirinoura | The Fog Marsh | `fog_marsh` | `story.kuroshi_arrived` | road tier | none |
| Agnipur | The Salt Flats | `salt_flats` | `story.jwaladesh_arrived` | road tier | none |
| Kingsmere | The Heath | `heath` | `story.aldermoor_arrived` | 21 to 24 | none |

"Road tier": 15 to 17, 17 to 19 or 19 to 21 by the order the player visits Skarragol, Kuroshi and Jwaladesh.

---

## 1. Pòdlimyè (Zetwal, House Kay Soley)

**Chapters:** 1 (the whole chapter) and 10 (the Muster). **Ruler:** Elodie Limyè, head of the Zetwal state (leaves for
the Throne at the start). **Feel:** sun, lanterns, a thousand names said aloud; Kreyol/Haitian-inspired. Accent gold
`#d4ac0d`.

**Sections** (built unless marked). **Every capital has at least five outdoor areas, buildings aside** (owner, Oct 15:
"so it feels more grand"); Pòdlimyè has seven (plaza, Accord Square, Iron Market, Old Harbor, Solèy Heights, Temple Island, Cane Road).

| Section | Map | Size | Description |
|---|---|---|---|
| Festival Plaza and harbor (hub) | `zetwal-town` | 40 x 28 (built) | The stage, the fountain, vendor stands, the Marshal's stone, the bridgehead and the harbor. |
| Accord Square | `zetwal-square` | 36 x 22 (built Oct 15) | Up the steps at the head of the plaza: the **Hall of the Accord** facing down the avenue (8-bit exterior from the owner's render, `OBJECT_ART.hall_of_accord`), the bronze Signers, honour guards, the gazette crier, petitioners and a protester, the guardhouse and the courier post. |
| The Iron Market | `zetwal-market` | 36 x 24 (built Oct 15) | West of the plaza, after Port-au-Prince's Marché en Fer: the red iron hall with its clock gate (`OBJECT_ART.iron_market_hall`), rows of produce, spices, cloth, iron goods (the engraver: The Envoy's Papers), fish on ice, a goat and chicken pen, the lottery booth, carts unloading. Three shops (produce, spices, cloth). |
| The Old Harbor | `zetwal-harbor` | 36 x 18 (built Oct 15) | Along the shore west: the fish market, the customs house, piers and the ferry landing. Exploration for now; more on the return. |
| Solèy Heights | `zetwal-heights` | 30 x 20 (built Oct 15) | Up the lane west of Accord Square: old houses, terraced gardens, the well, the lookout over the city. Exploration for now; more on the return. |
| Limyè house | `zetwal-house` | 20 x 12 (built) | Home; Patricio's study with the map table Echo Zone and the window seat. |
| Hall of the Accord (capital building) | `zetwal-hall` | 40 x 30 (built Oct 15) | The seat of the state on Accord Square. See "Seat of government" below. |
| Temple Island | `zetwal-temple` | 30 x 20 (built) | The Temple of Elodie, the Gaze lamp, the Name Stones, the dock. |
| Temple Archive (library) | `zetwal-archive` | 22 x 14 (built) | On the island; three shelves of three books. |
| The Cane Road (wild) | `zetwal-road` | 44 x 26 (built) | Cane fields past the east gate, the burned sugar mill, the mangroves. |
| Harbor bakery (proposal) | `zetwal-bakery` | 12 x 8 | Interior for Z-5, the rebel safehouse. |
| Sugar mill cellar (proposal) | `zetwal-mill` | 14 x 10 | Interior for Z-6 (Chapter 10), with an Echo Zone. |

**Seat of government: the Hall of the Accord (built Oct 15).** At the head of the plaza, on Accord Square. Inside
(40 x 30): the entrance hall (honour guards, the clerk's desk, benches), the **grand gallery** of columns and portraits
(Marshal Patricio, Mother Solange, Elodie, the signing with the Crown envoy's face in shadow) running north to the
**Throne of the State** on its dais; west, the **Council Chamber** (the Speaker's desk and benches) and the **Envoys'
Reception Room**; east, the **Chancellor's office**, the **Seal and Records Room** (the Hall's four books) and the
**Courier Office** (pigeon loft, routes map); off the entrance, the **Scribes' Room** and the **Treasury**. People: the
Chancellor (governs while Elodie is away; signs The Envoy's Papers), the Speaker of the Council, the Senior elder
(peace at any price) and the Harbor councillor (raise the harbor chain), the Crown's consul (polite, watchful; knows
how few have read the whole Accord), the foreign envoy, the Keeper of the Seal, the Chief courier, the Treasurer,
scribes, the page, the steward, the usher of the throne room, the hall guards.

**Library: the Temple Archive (9 books, built):**

| Book | Category | One line |
|---|---|---|
| The Founding of Zetwal | history | Mother Solange kept the names the Crown erased, and rebuilt the archive across the chasm. |
| The Alliance War | war | Patricio, Benny, Caona and Lady Sayo; the token in two halves; the signing. |
| Ash Wars: A Temple Record | history | Cendre ford: forty dead, not four hundred. "Someone wants him feared." (Ash Wars account 1 of 4.) |
| The Gaze of Elodie | religion | The goddess sees and remembers; she does not rule. |
| Why We Say Their Names | religion | The festival custom as a small rebellion against erased ledgers. |
| The Four Hands | religion | Xaraguá's faith, kept with respect: who gave you the right to sell what the hands held? |
| The Bridge With Two Ends | folklore | The soldier who lowered the Chain Bridge, and the pin "too clean". |
| The Hutia and the Lamp | folklore | The little thief who tried to steal the lamp's light. |
| Archive Ledger: Overdue | gossip | Gianna's overdue list; Anicette has kept *Ash Wars Gossip* Volume Two for three years. |
| *Tides of the Southern Reach* (proposal, 10th) | trade | Returned by Z-2: harbor tides and sea lanes; unlocks Conch Call's sea routes on the map. |

**Capital building: the Hall of the Accord (4 books, built):** *The Sun Accord (copy)* (six clauses, seven ribbons),
*The Eight Houses* (any family that has headed a state may claim the Throne), *Harbor Tolls and Roads* (Papa Wout, the
Cane Road, the grey veils), *A Quiet Crown Tract* (seized; "Ask who holds the debt now").

**Wild section:** the Cane Road. Peaceful in Chapter 1 (built: the cane cutter, the road watcher, the crates, the mill).
On the return (`story.zetwal_return`, Chapter 10), the built `cane_road` table: Road Bandit x2 (22 to 24); Smuggler x2
and Lookout (22 to 25); Quiet Crown Zealot x2 (22 to 25). Proposal: add Mangrove Crab x2 (22 to 24) in the mangroves.

**Shops and vendors** (built, with proposals for later stock):

| Vendor | Greeting | Stock |
|---|---|---|
| Market stand (grocer) | "Bonjou! Mango, soup, akasan." | Clay-pot soup (heals 40 over time), akasan (12 SP), ripe mango (15 HP); proposal: *Soup of the Free* after Z-1 |
| Charm stand | "Bonjou, cherie! Kijan ou ye?" | Sun-stitched charm (heals a little each turn), sea-glass charm |
| Harbor forge (smith) | "Bonjou!" | Cane machete, sunwood staff, ironwood bow, padded vest |
| Baker (proposal, after Z-5) | "Pran, pran. Pa gen dèt." ("Take, take. No debt.") | Bread at cost; Chapter 10 also sells tier-24 gear brought in for the Muster |
| Papa Wout (Carriage Guild) | "Bonjou, pitit!" | Fares to unlocked capitals; sells a rumor with every ticket |

**Contract board (jobs, proposal; Chapter 10):** clear the Cane Road for the army's carts; carry dispatches to the
Temple Island; count the soldiers at the Muster (pays Influence).

**Signature puzzle:** SIG-ZET, the Chain Bridge (built). Tutorial: M-ZET-1, the night orders (built).

**Echo scenes:** the war room (built); the plaza camp with the cook, scout, drummer and soldier (built); the bridgehead
at night (built); the temple under scaffolding with the lampwright and builder (built); proposal: the first Reading of
the Names (S-ZET), the grain store (Z-5), the powder store (Z-6), and in Chapter 10 the plaza on the morning of the
signing.

**Companion:** Gianna and Anissa (home). **Yari** arrives by canoe at the island dock and joins (built).

**NPCs:** Elodie, Anicette, old Patricio, the Gaze keeper, the soup vendor, two Quiet Crown recruiters, the town guard,
the festival kid, the elder, the ferryman, the pilgrim, the acolyte, the temple porter, the mourner, the island fisher,
the archivist, the Hall clerk, the cane cutter, the road watcher (all built); proposals: Papa Wout, the baker, Ti Jak
(Z-3).

**Debate corner** (guide 7.2): Gaze keeper vs. Quiet Crown recruiter on the plaza: *Is a goddess who only remembers any
use?* (Both speakers are built NPCs; the debate itself arrives with the Phase 4 debate engine.)

**Rebel safehouse:** the harbor bakery (Z-5). **Secret item:** Solange's Quill (Z-4, S-ZET).

**Side quests:** Z-1 Soup of the Free, Z-2 Tides of the Southern Reach, Z-3 The Lonely Cutter, Z-4 The Seventh Stone,
Z-5 Bread With No Debt (all Chapter 1, no fighting); Z-6 Muskets in the Cane (Chapter 10).

**To finish Chapter 1 (owner: Zetwal complete first), still to build:** the animated intro, the Last Evening and the
dawn departure scenes (`STORY.md` 2 and Chapter 1 beats 10 and 11), the five Chapter 1 side quests, the debate corner,
the bakery interior, and the Journal's Quests tab.

---

## 2. Yucayeque (Xaraguá, House Yaguana)

**Chapters:** 2 and 11 (the War of the Harbor). **Ruler:** Cacique Anaco (Yari's father, ailing); Governor Thorne holds
real power. Wants **Influence** (price 8). **Feel:** green mountains to the sea, round houses, canoes, the areíto
plaza; Taíno-inspired. Accent teal `#17a5a5`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Harbor Village (hub) | 44 x 30 | Bohío houses (Taíno: *bohío*), the pier with Crown ships at anchor, the market, the Crown customs house. |
| The Areíto Plaza | 30 x 22 | The dance ground with the rhythm-lock stone ring; the record house; Echo Zone for the first oath. |
| The Song House (library) | 22 x 14 | Keepers of the areíto's songs, with a scribe's shelf of accounts set down from them. (The Yaguana keep history in song; the library honours that.) |
| The Caney of Anaco (capital building) | 20 x 14 | The cacique's great house (Taíno: *caney*, the chief's house; flag for a source check). |
| The Crown Customs House | 18 x 12 | Thorne's office; boss arena. |
| The Petroglyph Cave | 30 x 24 | Two levels; the flooded chamber; the sluices (SIG-XAR). |
| The Mountain Path (wild) | 46 x 28 | Up through cloud forest to the resistance's hill camp. |
| The Sea Cave (secret) | 24 x 20 | X-4; tide states; Echo Zones on the ledges. |

**Seat of government (proposal, owner rule Oct 15): the Caney of Anaco**, on the terrace above the Areíto Plaza, the
centre of the town. About 36 x 26: a long hall of carved posts to the cacique's **duho** (ceremonial seat); the elders'
council circle; the behique's room where Anaco lies ailing; the guest house for envoys; the tribute store; the runners'
and conch-callers' room (messages along the coast). People: Anaco, an elder for the Charter and an elder for the
resistance, the behique, Governor Thorne's liaison officer posted inside, the head runner, guards and weavers.

**Library: the Song House (9):**

| Book | Category | One line |
|---|---|---|
| The Song of Guanín | history | The founder, Cacique Guanín, and the first canoes to these shores (Gen I). |
| Caona's Road | war | Caona's scouts in the Revolution: every Crown road found, every river forded. |
| The First Oath | law | What was promised at the areíto: the harbor stays with the people who fish it. |
| The Roots and Tides | religion | The Four Hands sect of Xaraguá: offerings at springs and on the shore. |
| What the Opía Remember | folklore | How the Yaguana speak of their dead as near, told with care (guide 7.3; checked by a knowledgeable reviewer). |
| Cassava and Salt | trade | How Xaraguá fed itself and traded casabe and salt before the Crown's customs. |
| The Charter of Protection (seized) | law | The Crown's paper, word for word; it cites "the seventh clause" by number only. |
| Why the Hutia Steals | folklore | A comic tale of the hutia who thought shiny things were stars. |
| The Line of the Caciques | genealogy | Guanín, Caona, Anaco, Yari: the line in four generations (the board game's cards). |

**Capital building: the Caney of Anaco (4):** *The Council's Minutes* (the elders' debate on the Charter, two votes
from accepting), *Anaco's Letter to the Throne* (never answered), *A Healer's Notes* (the bark from the lost grove,
X-5), *Customs Receipts* (Crown fees on every catch, and one strange line: "oil, unknown sender, waived").

**Wild section:** the Mountain Path, switched on by `story.xaragua_pier_won` (after the tutorial battle). Table
`mountain_path`: Crown Marine x2 (3 to 6); Crown Musketeer and Crown Marine (5 to 7); Mangrove Crab x2 (3 to 5, lower
path); Road Bandit x2 (3 to 6); Quiet Crown Zealot x2 (5 to 7). In Chapter 11 (`story.muster_done`) the table becomes
the war table: Crown Marine, Musketeer and Officer groups (25 to 28).

**Shops and vendors** (Taíno words used only where attested; everything flagged for a source check):

| Vendor | Greeting | Stock |
|---|---|---|
| Market (food) | "Guatiao!" ("Friend!", ritual friendship) | Casabe (cassava bread, heals 30), guava (heals 15), fish stew (heals 20 over time) |
| Carver | "Guatiao." | Carved charm (resist spirit damage; the guide's "zemi charm": a sacred object to the Taíno, so the name and look need the cultural reviewer's yes), shell beads (SPD +2) |
| Bow-maker | "Guatiao!" | Ironwood bow (tier 4), cotton tunic (tier 4), hamaca (Taíno: *hamaca*; a hammock to rest anywhere on the map once) |
| Lamp-oil seller (X-2) | "Guatiao." | Lamp oil (a puzzle key item), torches |

**Contract board (jobs):** mend nets after the marines' visit; carry salt to the hill camp; count the Crown ships
(Influence).

**Signature puzzle:** SIG-XAR (flooded cave, Echo sluice, rhythm lock). **Minor:** M-XAR-1, M-XAR-2. **Secret:** S-XAR.

**Echo scenes:** the areíto first oath (Caona, Patricio and Benny); the cave sluices in the dry season; Caona's scouts'
camp (X-3, X-5); a storm night in the sea cave (X-4); in Chapter 11, Caona's stand at the harbor (proposal).

**Companion:** **Yari** formally (she defies the elders ready to accept the Charter). **Caona** joins the Echo party.

**NPCs:** Cacique Anaco, Governor Thorne, the elders' council (three elders, one for the Charter, one against, one
undecided), the net-mender, the lamp-oil seller, the healer, the hill camp leader, a Crown marine sergeant (the
tutorial fight), a Gaze pilgrim.

**Debate corner:** Four Hands (Roots and Tides) elder vs. Gaze pilgrim: *Is the land owned or remembered?*

**Rebel safehouse:** the hill camp (X-2). **Secret item:** Caona's Conch (X-4).

**Side quests:** X-1 Cut Nets, X-2 Oil From a Stranger, X-3 The Hutia's Hoard, X-4 Where the Canoes Sleep, X-5
Medicine for the Cacique.

---

## 3. Bab al-Dhahab (Al-Doria, House Dorini)

**Chapter:** 3. **Ruler:** the Merchant-Prince (proposal: the title rotates among guild families; held now by **Layla
Dorini**, Samira's mother). Wants **Influence** (price 10): the richest house wants a council seat, not gold.
**Feel:** half port, half caravanserai; domes, ledgers, spice. Mediterranean / Middle-Eastern-inspired. Accent green
`#1e8449`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Grand Bazaar (hub) | 44 x 30 | Covered market lanes, the moneychangers' row, the price board, the harbor quay. |
| The House of Ledgers (library) | 24 x 14 | A domed reading room; ledgers chained to lecterns. |
| The Merchant-Prince's Majlis (capital building) | 20 x 14 | The council chamber and audience hall. |
| The Guild Vault | 24 x 18 | Under the guild hall; SIG-ALD; boss arena (Qasim). |
| The Old Counting House | 16 x 12 | Yusuf's counting room in the Echo; box 7 (A-4). |
| The Desert Edge (wild) | 46 x 28 | The caravan road into the dunes; a ruined caravanserai. |

**Seat of government (proposal, owner rule Oct 15): the Merchant-Prince's Majlis**, at the head of the souk square.
About 36 x 26: a long hall of arches to the prince's divan; the guild council chamber; the counting house; the envoys'
courtyard with its fountain; the archive of contracts; the caravan couriers' post. People: the Merchant-Prince, a guild
master who trades with the Crown and one who will not, the treasurer, the Crown's trade factor, contract scribes, the
caravan master. Market: the covered souk of gold and spice under lanterns (unique to Al-Doria).

**Library: the House of Ledgers (9):**

| Book | Category | One line |
|---|---|---|
| Malik's First Ledger | history | Malik Dorini, the founder, who built a house on ink, not swords (Gen I). |
| The Dorini Promise | war | What the Dorini lent the Revolution, and on what terms. |
| On Contracts | law | The Witness faith's teaching: a promise written is a promise watched. |
| The Witness in the Market | religion | Contract-priests who bless bargains; why a bad bargain is still argued to be sacred. |
| Spice Roads and Sea Lanes | trade | The caravan routes and harbors; the Crown's preference in its ports. |
| The Letter-Numbers | trade | How merchants write numbers as letters (the abjad-style cipher used in SIG-ALD). |
| Gossip of the Moneychangers | gossip | Who owes whom; a rumor of an uncashed Marshal's note (A-4). |
| The Merchant and the Jinn's Scale | folklore | A tale of a scale that weighs honesty (careful, folkloric tone; checked by a reviewer). |
| The Dorini Line | genealogy | Malik, Yusuf, Layla, Samira. |

**Capital building: the Majlis (4):** *Minutes of the Guild Council* (the vote to keep trading with the Crown),
*Charter of the Merchant-Prince* (how the title rotates), *The Vault Register* (box 7: "sealed, Marshal of Zetwal,
never opened"), *A Brasador Coin Assay* (Samira's report: "this coin has been somewhere else", Rael clue 4).

**Wild section:** the Desert Edge, switched on by `story.aldoria_arrived`. Table `desert_edge`: Caravan Raider x2 (8 to
10); Caravan Raider and Road Bandit x2 (9 to 11); Smuggler x2 (9 to 11); Quiet Crown Zealot x2 (9 to 11).

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Tea seller | "Ahlan wa sahlan!" ("Welcome!") | Spiced tea (12 SP and Inspired 1 turn), dates (heals 20), flatbread (heals 30) |
| Amulet seller | "Tfaddal." ("Please, go ahead.") | Beaded amulet (DEF +3, tier 8), appraising scale (charm: items sell for 10% more) |
| Armourer | "Ahlan." | Tier 8 and 12 gear: a curved blade (Azzy-ready), a merchant's robe, a light bow |
| Old moneychanger (A-4) | "Shukran, shukran." ("Thank you.") | Changes coin; tells the sakk story |

**Contract board:** escort a caravan to the ruined caravanserai; recover the saffron (A-2); audit a ledger for a
widow (Influence).

**Signature puzzle:** SIG-ALD (weights and the ledger cipher; the sun-cut inner lock). **Minor:** M-ALD-1, M-ALD-2.
**Secret:** S-ALD.

**Echo scenes:** Yusuf's counting room the week before the signing (the Dorini ledger: what they were promised); the
vault being built (the locksmith); the war-time bazaar (S-ALD); the cistern (A-3).

**Companion:** **Samira Dorini** (Alchemist): appraises everything, including feelings, and invoices them. She joins
after the vault, expelled by the guild for helping (proposal). She defies her guild for profiteering on the war.

**NPCs:** Layla Dorini, Guildmaster Qasim (boss, proposal), the old moneychanger, the price-board crier, a Crown factor
at the docks (A-5), the water-carrier (A-3), a Witness contract-priest, a Gaze merchant.

**Debate corner:** Witness contract-priest vs. Gaze merchant: *Is a bad bargain still sacred?*

**Rebel safehouse:** the water-carrier's hidden well (A-3). **Secret item:** the Sakk of Yusuf (A-4).

**Side quests:** A-1 Appraise This, A-2 The Missing Saffron, A-3 Sweet Water, A-4 The Uncashed Note, A-5 Invoice for
the Crown.

---

## 4. Cenizal (Ardencia, House Brasador)

**Chapter:** 4 (and a sneak back for Ar-4). **Ruler:** Rael the Ruthless, Lord of Ardencia; his corrupt elders;
old Benny lives in the keep. Appears to be the enemy. **Free Brasador** wants **Fear** (price 6). **Feel:**
fire-cracked highlands, red stone and iron, a duel court. Spanish-inspired. Accent red `#b03a2e`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Upper Town and duel court (hub) | 42 x 30 | Red-stone streets climbing to the keep; the duel court with the envoy's gallery. |
| The Old Library (library) | 22 x 14 | La Biblioteca Vieja: vaulted, dusty, half the shelves on the Ash Wars. |
| The Alcázar (capital building) | 30 x 22 | Rael's keep: the hall of audience, the elders' hall, Benny's quiet rooms, the cloister and crypt (Ar-4). |
| The Lower Town | 34 x 24 | The poor quarter; the soup line (Ar-1). |
| The Forge Fortress and Benny's tunnel | 36 x 26 | SIG-ARD: the lava channels, the bellows lever, the tunnel to the sea road. |
| The Cinder Flats (wild) | 46 x 28 | Black lava fields and hot springs below the walls. |
| Free Brasador camp (proposal) | 24 x 16 | After the escape, on the sea road. |

**Seat of government (proposal, owner rule Oct 15): the Alcázar**, over the main plaza (central, not on the edge).
Grow it to about 40 x 30: the long hall of audience to Rael's seat, the elders' hall, Benny's quiet rooms, the cloister
and crypt (Ar-4), the war room, the messenger tower. People: Rael, the corrupt elders, old Benny (kept out of sight),
the captain of the guard, the Crown's envoy, the chamberlain, couriers.

**Library: the Old Library (9):**

| Book | Category | One line |
|---|---|---|
| Don Alonso's Conquest | history | The founder, Don Alonso Rodriguez, and the brand that outlived every war (Gen I); told without glory. |
| Benny's March | war | Lord Benny brings Brasador to fight beside Zetwal; nobody fully explained why. |
| The Duel Law | law | No outsider gets an audience unless she proves herself; the loser answers one question. |
| Oaths of the Ash Road | religion | The Witness faith among soldiers: military oaths and what a broken one costs. |
| The Iron Trade | trade | Ore, blades, and the gold Brasador was promised and never paid after the Accord. |
| The Ash Wars, by Order of the Elders | history | A reprint of the Crown chronicle under the elders' seal: Rael the butcher, four hundred dead. (Not a fifth account: the same false version, spread here to frighten.) |
| What the Kitchen Maids Say | gossip | The Lord never raises his voice; prisoners go in and come out; no one is ever buried. |
| The Burning Bride | folklore | A highland ghost story about a bride who married in secret. (A wink at Elodie.) |
| The Rodriguez Line | genealogy | Alonso, Benny, Rael, Azriel; "and no others recorded". |

**Capital building: the Alcázar (4):** *The Elders' Accounts* (taxes skimmed in plain sight), *Orders of the Day*
(the duel set for the Zetwal envoy's daughter), *The Treasurer's Last Report* (unsigned; the treasurer "retired"),
*Benny's Refusal* (a copy of his public refusal to sign the seventh page).

**Wild section:** the Cinder Flats, switched on by `story.ardencia_arrived`. Table `cinder_flats`: Cinder Salamander
x2 (11 to 13); Brasador Halberdier and Road Bandit (12 to 14); Cave Bat x3 (11 to 13, near the springs); Quiet Crown
Zealot x2 (12 to 14). After the escape (`story.ardencia_escaped`) the table adds Brasador Halberdier patrols (13 to 15)
who try to capture, not kill.

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Tavern cook | "¡Bienvenido! ¿Qué desea?" | Hearty stew (heals 45 over time), bread and olives (heals 20), hot chocolate (12 SP) |
| Smith | "Bienvenido." | Blackened armour (DEF, tier 12; boosts Fear gain), a long sword (Azzy), iron-shod staff |
| Ring-maker | "¿Qué desea?" | Signet ring (charm: +1 Fear on a Break), a red half-cape |
| Soup line cook (Ar-1) | "Coma, coma." ("Eat, eat.") | Free bread; after Ar-1, sells healing at cost |

**Contract board:** guard the elders' banquet (Ar-3); clear salamanders from the hot springs; carry a sealed letter to
the keep (it is for Benny; it is from Anicette, proposal).

**Signature puzzle:** SIG-ARD (lava channels, Benny's tunnel, the escape). **Minor:** M-ARD-1. **Secret:** S-ARD.

**Echo scenes:** Benny's smuggler tunnel; the Brasador march to the sea; the armory being built (the gates); the
callback with young Benny who recognizes the Locket; Benny's office (Ar-2); the cloister on the march night (Ar-4).

**Companion:** **Azzy** joins in the escape when he sees his father give the order and chooses Gianna. **Benny** joins
the Echo party. The soldiers who follow Azzy become **Free Brasador**.

**NPCs:** Rael, Envoy Cresswell (in the gallery), old Benny, Azzy, three elders, the treasurer's daughter (Ar-2), the
soup line cook, Free Brasador soldiers (Ar-5), a Witness oath-knight, a Gaze skeptic.

**Debate corner:** Witness oath-knight vs. Gaze skeptic: *What do you owe a lord who has broken his oath?* (Rewrites
itself after the duel.) A second corner in the Lower Town, the guide's clue 7: *Is a thief who feeds the hungry a
thief?*

**Rebel safehouse:** the soup line in the Lower Town (Ar-1). **Secret item:** La Promesa de Benny (Ar-4).

**Side quests:** Ar-1 Bread at Night, Ar-2 The Treasurer's Daughter, Ar-3 The Elders' Feast, Ar-4 The Old Lord's
Errand, Ar-5 The Arrows Missed.

---

## 5. Eightgate (the Throne, the centre of the realm)

**Chapters:** 5 (the Parley), 12 (the Claim) and the Hearing. **Ruler:** the Throne is held for now by the Lord Regent
Aldric Vane. Elodie is Zetwal's envoy. **Feel:** a neutral, ancient city of eight gates, one per house; grand, worn,
watched. English (formal). Palette: neutral stone with all eight accents on the gates.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Eight Gates Concourse (hub) | 44 x 32 | A ring road with a gate for each house; the debate corner at the centre fountain. |
| The Throne Archive (library) | 26 x 18 | The realm's memory; the Accord under glass; the seven-drawer cabinet (SIG-SEA). |
| The Throne Hall (capital building) | 28 x 20 | The Throne tile at its centre (the board game's Throne); eight empty council chairs (Se-5). |
| The Envoys' Quarter | 24 x 16 | Elodie's rooms (Se-1); the Crown's guarded wing. |
| The Crossroads Fields (wild) | 46 x 28 | Where the roads meet outside the walls: camps, deserters, pilgrims. |

**Seat of government (proposal, owner rule Oct 15): the Throne Hall**, the centre of the city and of the realm.
About 44 x 32: a long nave to the Throne tile, the eight council chairs, **eight embassy chambers** (one per house,
some empty), the Regent's offices, the heralds' tower (proclamations to the realm). People: the Regent, the heralds,
the houses' ambassadors, the Crown's legate, the archivist of the Throne.

**Library: the Throne Archive (10):**

| Book | Category | One line |
|---|---|---|
| The Weaving | religion | The Gaze's account of Elodie weaving the realm; the Seat as the place she "sat to look". |
| The Founding Compact | history | How eight houses agreed a Throne that any ruling family may claim. |
| The Rules of Claim | law | Claim and Challenge (the board game's Section 8, in the realm's own words). |
| The Sun Accord, Sealed | law | The sealed original's history; seven ribbons, one never knotted. |
| The Throne's Clerks | gossip | Petty quarrels of the archivists over fifty years; one clerk "who sealed the seventh page and never spoke again". |
| The Envoy's Handbook | trade | Protocol, gifts and how to insult a Regent without being arrested. |
| Ash Wars: The Envoys' Summary | war | A neutral summary that admits it cannot tell whose account to believe. |
| The Four Faiths at the Seat | religion | A fair primer on the Gaze, the Four Hands, the Witness, and the Quiet Crown's recent rise. |
| The Eight Gates | folklore | Each gate's legend; the ninth gate that is said to open only for a just ruler. |
| The Claimant Families | genealogy | Every family that has headed a state; Limyè is listed. Jean-Philippe is listed. Rodriguez is listed. |

**Capital building: the Throne Hall (4):** *The Regent's Commission* (how he came to hold the Throne "for now"), *The
Seventh Clause* (read aloud in Chapter 5; proposal wording: "The harbor of Xaraguá and its waters are given into the
keeping of the Crown of Aldermoor, at the Crown's pleasure, to be revisited."), *Petitions of Breach* (Xaraguá's,
unheard), *The Council of Eight* (the old plan for a council of the states, never used).

**Wild section:** the Crossroads Fields, switched on by `story.seat_arrived`. Table `crossroads`: Crown Marine x2
deserters (14 to 16); Road Bandit x3 (14 to 15); Quiet Crown Zealot and Husher (15 to 16). After the War of the Harbor
(`story.harbor_won`): Husher and Regent's Sealbearer groups, Crown Marine and Officer (28 to 30).

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Concourse market | "Good day to you, traveller." | Every land's basic food (one of each capital's healing items) |
| The Envoys' Outfitter | "Madam. Do come in." | Tier 16 gear (Ch. 5); tier 28 gear (Ch. 12) |
| Pilgrims' stall | "Peace on your road." | Faith tokens: a charm per faith (Gaze: revive once per area; Witness: 10% off an ally's price; Four Hands: elemental resistance), the shrine boons in item form |

**Contract board:** escort pilgrims (Se-3); copy a damaged ledger for the Archive (Influence); deliver a petition of
breach.

**Signature puzzle:** SIG-SEA (reading the Accord in both eras). **Secret:** S-SEA.

**Echo scenes:** the sealing of the Accord in the Throne Archive (owner decision, Oct 14: the signing was in Pòdlimyè's plaza; see
`STORY.md` 6.2); young Thomas Stillwater in the gallery; in Chapter 12, Patricio, Benny and Caona one last time.

**Companion:** none (guide).

**NPCs:** Elodie, the Lord Regent, Keeper Hollis (proposal), the Regent's archivist, pilgrims of all four faiths, envoys
of each house.

**Debate corner:** all four faiths, arguing over who may sit the Throne (Se-2).

**Rebel safehouse:** none in the city (the ninth thumbprint is on Elodie's letter, Se-1). **Secret item:** the Seventh
Ribbon (Se-4).

**Side quests:** Se-1 Volume One, Se-2 Four Voices, Se-3 Deserters' Road, Se-4 The Unknotted Ribbon, Se-5 A Seat for
Every House.

---

## 6. Ordvik (Skarragol, House Ironvow)

**Chapter:** 6 (one of the three roads). **Ruler:** the clan council (proposal: led by **Torvald**, Bayarmaa's father).
Wants **Wealth** (price 10): plunder rights and compensation for blockade losses. **Feel:** a fjord bay where longships
meet a steppe camp of great tents; horses everywhere. Fused Nordic / Mongolian-inspired. Accent slate `#5d6d7e`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Horse-Fair (hub) | 46 x 30 | Corrals, tents and the longship quay; races and trading. |
| The Saga Tent (library) | 22 x 16 | A great felt tent of sagas, tally sticks and painted hides. |
| The Moot Tent (capital building) | 22 x 16 | The council's tent; the empty pole where the sacred standard stood. |
| The Frozen Fjord | 40 x 26 | SIG-SKA: floes in the present, ice in the Echo; the thief's camp across it. |
| The Winter Plateau (wild) | 46 x 30 | High grass and stone; the nine cairns (S-4); the herders' folds (S-3). |

**Seat of government (proposal, owner rule Oct 15): the Great Moot Tent**, in the middle of the gathering field.
About 36 x 26 of joined tents: a long aisle of standard poles to the chieftain's seat and the empty pole; the
lawspeaker's tent; the skalds' and horn-riders' tent (messages); the guest-hostage tent for envoys; the plunder store.
People: the chieftain, the lawspeaker, a raiding jarl and a trading jarl, the Crown's hostage-envoy, the horn-master.

**Library: the Saga Tent (8):**

| Book | Category | One line |
|---|---|---|
| Ulfgar's Oath | history | The founder, Ulfgar Ironvow, and the blood-oath every raider swears (Gen I). |
| Sarnai's Ride | war | The raid that broke the Crown's supply line in the Revolution. |
| The Law of the Moot | law | How the council decides; why a sold fleet is legal and still shameful. |
| The Sky-Riders | religion | The Four Hands' wind sect: oaths sworn to the open sky. |
| Furs, Salt and Horses | trade | What the blockade cost; the Crown's offer. |
| The Mare in the Sky | folklore | Reading the stars; the Mare, the Ox and the Ship (needed for S-SKA). |
| Who Married Whom | gossip | A steppe princess married a Brasador lord in the Ash Wars and came home alone. (Azzy's mother, one line, guide 13.7.) |
| The Ironvow Line | genealogy | Ulfgar, Sarnai, Torvald, Bayarmaa. |

**Capital building: the Moot Tent (3):** *The Standard's Keeping* (who guarded it the night it vanished), *The
Crown's Offer* (gold for the fleet), *Compensation Claims* (every family's losses, totalled).

**Wild section:** the Winter Plateau, switched on by `story.skarragol_arrived`. Table `winter_plateau` (road tier):
Steppe Wolf x3; Steppe Reaver x2; Steppe Reaver and Lookout; Quiet Crown Zealot x2.

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Food tent | "Sain baina uu?" ("Hello, how are you?", Mongolian) | Salted jerky (heals 50), fermented mare's milk (16 SP), hot broth (resist cold) |
| Furrier | "Heill!" ("Hail!", Old Norse) | Braided fur cloak (resist cold, DEF, road tier), round shield |
| Horse-trader | "Bayarlalaa." / "Þökk." ("Thank you.") | Horse tack charms (SPD), Salkhi's treats (a joke item Salkhi demands) |

**Contract board:** race at the fair (timing); guard the folds (wolves); count the fleet (Influence).

**Signature puzzle:** SIG-SKA (the frozen fjord and the herd). **Minor:** M-SKA-1. **Secret:** S-SKA.

**Echo scenes:** Sarnai's raid riding out (the herd whistle, the stars); Sarnai's supply cache (S-3); the fjord frozen
in the war's winter.

**Companion:** **Bayarmaa** (Raider), blamed for the stolen standard; clearing her name wins her. Her horse **Salkhi**
(proposal name, Mongolian "wind") has more dialogue than she does. She defies a council ready to sell the fleet.

**NPCs:** Torvald, the council chiefs (three, S-2), the old herder (S-4), the envoy of Azzy's mother's people (S-5),
Noyan Grimvald (boss, proposal), a Sky-Rider, a Witness elder.

**Debate corner:** Four Hands (Sky-Rider) vs. Witness elder: *Oath of blood or oath of sky?*

**Rebel safehouse:** the winter stores (S-3). **Secret item:** Sarnai's Bridle Bell (S-4).

**Side quests:** S-1 Salkhi Has Opinions, S-2 The Fleet for Sale, S-3 The Winter Stores, S-4 The Cairn of Nine Riders,
S-5 Grandson of the Steppe.

---

## 7. Kirinoura (Kuroshi, House Suzumori)

**Chapter:** 7 (one of the three roads). **Ruler:** the spymaster council (proposal: led by **Kaede Suzumori**, Haru's
mother). Wants **Influence** (price 10): recognition and legal protection for their informants. **Feel:** a fogbound
harbor city of lacquer, paper screens and lanterns. Japanese-inspired. Accent violet `#7d3c98`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Lantern Quarter (hub) | 42 x 30 | Bridges over canals, tea houses, the fog maze at its north edge (SIG-KUR part 1). |
| The Lantern Library (library) | 22 x 14 | Scrolls in lacquer boxes, lit by paper lanterns. |
| The Hall of Screens (capital building) | 24 x 18 | The council's hall; the rotating screens and the file house (SIG-KUR parts 2 and 3). |
| Lady Sayo's House | 20 x 14 | The listening room with the nightingale floor (K-4). |
| The Fog Marsh (wild) | 46 x 28 | Reeds, causeways and fishers' huts; the rebel press (K-3). |

**Seat of government (proposal, owner rule Oct 15): the Hall of Screens**, behind the main bridge at the heart of
the town. About 36 x 26: a long corridor of rotating screens to the lord's dais; the retainers' council; the file house
(SIG-KUR); the tea room for envoys; the signal tower (lantern and kite signals). People: the lord or lady of Suzumori,
a retainer for neutrality and one for war, the spymaster, the Crown's observer, the keeper of files, the signal master.

**Library: the Lantern Library (9):**

| Book | Category | One line |
|---|---|---|
| Genzō's Ear | history | The founder, Lord Genzō Suzumori, who built power by listening (Gen I). |
| Sayo's Network | war | How Lady Sayo's whisperers fed Patricio every Crown troop movement. |
| The Informants' Petition | law | Why Kuroshi wants legal protection for those who tell the truth to power. |
| Balance and Silence | religion | The Witness faith in Kuroshi: honor and balance; how silence differs from concealment. |
| Silk, Tea and Secrets | trade | What Kuroshi sells openly, and what it sells quietly. |
| The Burned Temple | history | The Suzumori fire at an Agnivansh temple, told with shame (K-5). |
| The Nightingale Floor | folklore | Floors that sing so no one walks unheard (S-KUR). |
| Tea House Whispers | gossip | Gold has been flowing out of Ardencia to places no one should be funding. |
| The Suzumori Line | genealogy | Genzō, Sayo, Kaede, Haru. |

Plus, in the sealed stacks of the Hall of Screens: **the Suzumori spy ledger of the Ash Wars** (Ash Wars account 2 of
4; K-2).

**Capital building: the Hall of Screens (4):** *The Neutrality Order* (the council's order to stay out of the war),
*The Buyer's Mark* (the files: the Crown has bought, or will buy, one ally; the mark but not the name), *Ledger of
Outflows* (Ardencia's gold, coded destinations: Rael clue 3), *The Paper Fox's Receipts* (who sold Kuroshi's files to
the Crown).

**Wild section:** the Fog Marsh, switched on by `story.kuroshi_arrived`. Table `fog_marsh` (road tier): Lantern Moth
x4; Fog Cutpurse x2; Fog Cutpurse and Husher; Quiet Crown Zealot x2.

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Tea house | "Irasshaimase!" ("Welcome!") | Rice ball (heals 50), green tea (18 SP), miso broth (heals over time) |
| Paper-maker | "Irasshaimase." | Paper charm (reveals one enemy skill), silk mask (evasion) |
| Armourer | "Arigatou gozaimasu." ("Thank you very much.") | Road-tier gear: a short blade, lacquered armour |

**Contract board:** deliver sealed letters without reading them (the game checks); find a lost cat in the fog; copy a
file (Influence).

**Signature puzzle:** SIG-KUR (fog maze, rotating screens, Echo spy map). **Minor:** M-KUR-1, M-KUR-2. **Secret:**
S-KUR.

**Echo scenes:** Sayo's agents signalling through the fog; Sayo's wall map; the listening room the night of the
warning (S-KUR); the forged Crown report that burned the temple (K-5).

**Companion:** **Haru Suzumori** (Shadow agent), who introduces himself as "definitely not a spy". He defies the
council's order to stay neutral and joins after the Paper Fox falls.

**NPCs:** Kaede Suzumori, the Paper Fox (boss, proposal), the file house archivist, the old floor-maker (K-4), the
Suzumori elder (K-5), a Witness balance-keeper, a Quiet Crown whisperer.

**Debate corner:** Witness (balance) vs. Quiet Crown whisperer: *Is silence virtue or concealment?*

**Rebel safehouse:** the marsh press (K-3). **Secret item:** the Nightingale Key (K-4).

**Side quests:** K-1 Definitely Not a Spy, K-2 The Spy Ledger, K-3 Lanterns for the Lost, K-4 The Letter in the Floor,
K-5 Ashes of the Temple.

---

## 8. Agnipur (Jwaladesh, House Agnivansh)

**Chapter:** 8 (one of the three roads). **Ruler:** the fire-temple court (proposal: led by **Meera**, Vikram's
mother). Wants **Wealth** (price 8): zealous, but the treasury is empty and the sacred flame is running out of oil.
**Feel:** temples of flame, rooftop mirrors, a harbor with the great chain. Indian-subcontinent-inspired. Accent
saffron `#e67e22`. (The Flame Keepers are the fictional Four Hands faith; no real faith is portrayed, guide 7.3.)

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Lamp Bazaar (hub) | 44 x 30 | Lanes of lamp-sellers, dyers and spice stalls; the rooftop mirrors above (SIG-JWA). |
| The Palm-Leaf Library (library) | 22 x 14 | Bundled palm-leaf manuscripts on low shelves. |
| The Court of the Flame (capital building) | 26 x 20 | The temple court; the dying flame; the priests' council. |
| The Harbor Chain | 30 x 20 | The great chain and its lamp; the oil store (J-4); boss arena (Seth Dhanraj). |
| The Salt Flats (wild) | 46 x 28 | White flats and scrub on the caravan road. |

**Seat of government (proposal, owner rule Oct 15): the Court of the Flame**, the temple court at the city's
centre. About 36 x 28: a long colonnade to the flame altar and the ruler's seat; the priests' council; the (empty)
treasury; the envoys' pavilion; the runners' hall. People: the high priest, the ruler, priests split over hiding the
truth, the treasurer, a Crown agent, the chief runner.

**Library: the Palm-Leaf Library (9):**

| Book | Category | One line |
|---|---|---|
| Rani Tejaswini's Flame | history | The founder, Rani Tejaswini, and the doctrine that hesitation is the only true death (Gen I). |
| The Harbor Chain | war | Arjun's charge; seven rode out, five came home (needed for S-JWA). |
| The Law of the Flame | law | Who may tend it, and who pays for its oil. |
| The Flame Keepers | religion | The Four Hands' fire sect: the flame as a living hand. |
| Oil, Ghee and Grain | trade | Prices since the Crown-backed hoarders cornered the oil. |
| The Relay | folklore | Runners carrying a flame from the sea to the temple. |
| Duels Over Breakfast | gossip | Vikram has fought eleven duels this month, all over arguments. |
| The Burned Temple, Our Account | history | The Suzumori fire, told by those who lost the temple (pairs with K-5). |
| The Agnivansh Line | genealogy | Tejaswini, Arjun, Meera, Vikram. |

**Capital building: the Court of the Flame (3):** *The Treasury Book* (empty), *The Priests' Decision* (to hide the
flame's failing), *Oil Contracts* (all signed with Seth Dhanraj).

**Wild section:** the Salt Flats, switched on by `story.jwaladesh_arrived`. Table `salt_flats` (road tier): Ember Jackal
x3; Oil Enforcer x2; Oil Enforcer and Road Bandit; Quiet Crown Zealot x2.

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Milk and bread stall | "Namaste!" | Spiced milk (18 SP), flatbread (heals 50), lentil stew (heals over time) |
| Bead seller | "Namaste." | Flame-bead bracelet (fire skills +15%), brass lamp charm (resist fire) |
| Swordsmith | "Dhanyavaad." ("Thank you.") | Road-tier gear: a curved sword (Vikram), light armour |

**Contract board:** escort a salt caravan (J-5); run the lamp relay (J-2); clean the rooftop mirrors (Influence).

**Signature puzzle:** SIG-JWA (the relay of lamps and mirrors). **Minor:** M-JWA-1. **Secret:** S-JWA.

**Echo scenes:** Arjun's charge at the Crown's harbor chain; the oil store that night (S-JWA); Arjun's runners (J-2).

**Companion:** **Vikram** (Fire duelist): must win every argument by duel, always out of breath. He defies the priests
who want to hide the flame and joins after Seth Dhanraj falls.

**NPCs:** Meera, Seth Dhanraj (boss, proposal), the junior priest (J-3), the shrine child (J-4), the relay runners, a
Flame Keeper, a Gaze pilgrim.

**Debate corner:** Four Hands (Flame Keeper) vs. Gaze: *Is hesitation a sin, or is remembering mercy?*

**Rebel safehouse:** the temple's back gate (J-3). **Secret item:** the Unbroken Wick (J-4).

**Side quests:** J-1 Win Every Argument, J-2 The Lamp Relay, J-3 The Anonymous Oil, J-4 Oil for the Little Lamps, J-5
Jackals on the Salt Road.

---

## 9. Kingsmere (Aldermoor, House Stillwater)

**Chapter:** 9. **Ruler:** the Lord Regent Aldric Vane (enemy). A dissident faction wants **Fear** (price 8):
protection from the Quiet Crown's purge. Ordinary Stillwater people are not villains (guide 1.2). **Feel:** grey-blue
moorland city, polite, tired and watched; the Crown's records and courts. English-inspired. Accent blue `#2e86c1`.

**Sections:**

| Section | Size | Description |
|---|---|---|
| The Market Cross (hub) | 42 x 30 | Rain, tea shops, a press-gang, constables; the debate corner by the cross. |
| The Rolls House (library) | 22 x 14 | The Crown's public library of laws and chronicles. |
| The Regent's Keep (capital building) | 32 x 24 | The archive (SIG-ALM part 1), the courtroom (part 2), the clock tower (Al-4); the Hushed's chamber. |
| Rosalind's Townhouse | 18 x 12 | Tea with Lady Rosalind (Al-5). |
| The Heath (wild) | 46 x 28 | Fog, heather and bog beyond the walls; the dissidents' printing barn (Al-3). |

**Seat of government (proposal, owner rule Oct 15): the Regent's Keep**, on the market square. About 40 x 30: the
great hall to the Regent's chair; the archive (SIG-ALM 1); the courtroom (2); the clock tower (Al-4); the Hushed's
chamber; the post office. People: the Regent's steward, judges, the clerk of the court, the Crown magistrate, the
postmaster.

**Library: the Rolls House (9):**

| Book | Category | One line |
|---|---|---|
| Dame Agatha's Patience | history | The founder, Dame Agatha Stillwater, who outlasted every invader (Gen I). |
| The Zetwal Rebellion | war | The Crown's view of the Revolution: a rebellion lost to "foreign meddling". |
| The Charter of Protection, Explained | law | The Crown's legal case for Xaraguá. |
| The Witness and the Law | religion | Aldermoor's Witness: law as an oath the whole realm swears. |
| Wool, Tin and Tea | trade | Aldermoor's trade, and how much of it runs through Xaraguá's harbor. |
| The Long Game | folklore | Stillwater proverbs: "The loud burn out first." |
| Court Circular | gossip | The Regent's guests; a "lady in grey" who is never named (the Hushed, foreshadowed). |
| Thomas Stillwater's Record (public edition) | law | The official copy, with the margin note missing. |
| The Stillwater Line | genealogy | Agatha, Thomas, Rosalind, Edmund. |

Plus, in the keep's archive: **the Crown chronicle of the Ash Wars** (Ash Wars account 3 of 4; Al-2).

**Capital building: the Regent's Keep (5):** *The Crown's Pact With Ardencia* (what Rael took), *The Ash Road
Accounts* (where the gold went: coded, proposal; `STORY.md` 6.6), *Thomas Stillwater's True Record* (with the margin:
"Xaraguá was never asked"; hidden behind the panel, SIG-ALM), *The Purge List* (Al-3), *Court Minutes of the
Ratification* (the Seventh Clause ratified fifty years ago with no Yaguana present).

**Wild section:** the Heath, switched on by `story.aldermoor_arrived`. Table `heath`: Moor Constable and Bog Hound x2
(21 to 23); Husher x2 (22 to 24); Crown Musketeer and Crown Officer (22 to 24); Quiet Crown Zealot x2 (21 to 23).

**Shops and vendors:**

| Vendor | Greeting | Stock |
|---|---|---|
| Pie shop | "Afternoon. Mind the rain." | Meat pie (heals 80), tea (20 SP; Edmund's Tea Break heals more with it), scones (heals 40) |
| Jeweller | "Good day, madam." | Law-seal brooch (charm: reduces enemy Wealth drops; the guide's quirk), plain steel ring |
| Outfitter | "How may I help?" | Tier 20 and 24 gear: plain steel blade, oilcloth coat, longbow |

**Contract board:** carry dissident pamphlets past the constables; find a press-ganged son; copy the court circular
(Influence).

**Signature puzzle:** SIG-ALM (the archive, then the courtroom "who is lying" trial). **Secret:** S-ALM.

**Echo scenes:** Thomas Stillwater writing the Crown's record of the Seventh Clause; the Crown's war council hearing of
Benny's refusal; the courtroom's ratification; the clock tower the night Thomas wrote (S-ALM). (Patricio is in
Kingsmere under a flag of truce, proposal, `STORY.md` 6.4.)

**Companion:** **Edmund Stillwater** (Guardian): ridiculously polite, apologizes to enemies before hitting them; tea
breaks heal. He defies the Regent and joins after the courtroom.

**NPCs:** the Lord Regent, Lady Rosalind Stillwater (proposal), the Hushed (boss), the dissident printer (Al-3), the
clockmaker (Al-4), a constable who is sorry about all this, a Quiet Crown hierarch, a Gaze exile.

**Debate corner:** Quiet Crown hierarch vs. Gaze exile: *Should the Throne have one hand?*

**Rebel safehouse:** the printing barn on the Heath (Al-3). **Secret item:** the Patient Hour (Al-4).

**Side quests:** Al-1 Terribly Sorry, Al-2 The Crown Chronicle, Al-3 The Purge List, Al-4 The Clock That Waits, Al-5
Tea With Lady Rosalind.

---

## Cultural review list (from these sheets)

To check with native or fluent speakers and knowledgeable reviewers before release (guide 7.3, 8):

- Kreyol: *Pòdlimyè* vs. *Pò Limyè*; "Pran, pran. Pa gen dèt."; all built Zetwal lines.
- Taíno: *Yucayeque*, *caney*, *bohío*, *hamaca*, *guatiao*, *casabe*, *guamo* (the conch), the "zemi charm" (a sacred
  object: name and look need a reviewer's yes), *What the Opía Remember*.
- Arabic: *Bab al-Dhahab*, *Ahlan wa sahlan*, *Tfaddal*, *Shukran*, the jinn tale.
- Spanish: *Cenizal*, vendor lines, *La Biblioteca Vieja*.
- Mongolian and Old Norse: *Ordvik*, *Salkhi*, *Sain baina uu*, *Bayarlalaa*, *Heill*, *Þökk*.
- Japanese: *Kirinoura*, vendor lines.
- Hindi / Sanskrit: *Agnipur*, *Seth Dhanraj*, vendor lines.
