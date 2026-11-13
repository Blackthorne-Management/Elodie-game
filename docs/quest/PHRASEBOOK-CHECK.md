# Phrasebook check: every non-English word in the quest

**For:** a fluent reader, on Wed Nov 18 (see `docs/quest/SCHEDULE.md`). Prepared Nov 13 from a read-only scan of `quest/src` (no game code was changed).

## What this is

*Bloodlines: The Race to Elodie's Grace* is a story game in which a young envoy named Gianna travels between eight fictional lands, each drawn from a real culture, to win allies for her family. Each land's people say a few words in their own language inside English sentences, and some of those words are shown with an English gloss under the line.

## What to check (for each row)

1. **Spelling and accents** (for example, Kreyòl `è` and `ò`, Spanish `í` and `ñ`).
2. **Is it natural?** Would a speaker really say this, in this situation, to this person?
3. **Is the English gloss right?** The gloss is what the game shows under the line; "none" means the player sees no English.
4. **Is it respectful?** Especially for religious, ceremonial or historical words (the Taíno section in particular).

Write anything you find in the last column ("Reader's note"). The **Nov 18 check is the first two sections: Haitian Kreyòl (1) and Taíno (2)**. Sections 3 to 9 are a bonus list for later readers.

## How to read the tables

- **Source file:line** is relative to `quest/src/`. "also:" lists the other places the same word appears (up to five; the rest are counted). Each distinct word or phrase is listed once.
- **Who says it / where** gives the chapter, place and speaker of the first occurrence. Chapters: 1 Zetwal, 2 Xaraguá, 3 Ardencia, 4 Al-Doria, 5 Eightgate, 6 Skarragol, 7 Kuroshi, 8 Jwaladesh, 9 Aldermoor, 10 Zetwal again, 11 Xaraguá again, 12 Eightgate again. "Item/shop/party data", "Book page" and similar mean text read from a menu, shop, book or quest log rather than spoken.
- **As written** shows the line the first occurrence sits in, so you can judge it in context.
- Words used as names (people, places, houses) are in a shorter table per language, because you may still want to check their spelling.

## Existing glossary and notes (cited, not repeated here)

- `quest/src/data/lang/*.json` holds one glossary per language (kreyol, taino, spanish, arabic, french, mongolian, norse, japanese, hindi). **Every entry is `verified: false`**. `npm run audit:lang` lists them. It is incomplete: for example the Kreyòl glossary has only 6 entries and the game shows about 24 Kreyòl words and phrases (see Questions).
- `docs/quest/design/CAPITALS.md` ("Cultural review list", lines 870 to 885; city name rows, lines 36 to 37) and `docs/quest/design/STORY.md` (section 6, item 1, the capital's name) name what the owner already wants checked: *Pòdlimyè* vs *Pò Limyè*, "Pran, pran. Pa gen dèt.", *Yucayeque*, *caney*, *bohío*, *hamaca*, *guatiao*, *casabe*, *guamo*, the "zemi charm", *What the Opía Remember*.
- `docs/quest/design/SECRET-ITEMS.md` (lines 67, 159) says a real Taíno name for a sacred object needs a cultural reviewer, and that *guamo* (the conch) is flagged for verification; neither word is shown to the player yet.
- `docs/quest/ART-STYLE.md` (lines 85, 87, 97, 145, 149) records which realm is "inspired by" which culture; it holds no word list.
- `docs/quest/SCHEDULE.md` line 48 and `docs/quest/PLAYTHROUGH-GUIDE.md` line 43 set the Nov 18 phrasebook check.

## Counts

| Language | Phrases and words | Names |
|---|---|---|
| 1 Haitian Kreyòl | 24 | 15 |
| 2 Taíno | 17 | 7 |
| 3 Spanish | 16 | 13 |
| 4 Arabic | 14 | 7 |
| 5 French | 2 | 1 |
| 6 Mongolian | 5 | 7 |
| 7 Old Norse | 4 | 4 |
| 8 Japanese | 10 | 7 |
| 9 Hindi / Sanskrit | 10 | 8 |
| **Total** | **102** | **69** |

The intro, credits and game-over scenes contain no non-English words apart from the names *Pòdlimyè*, *Limyè* and *Yucayeque* (credits: `data/credits.ts:28`; game over: `data/gameOver.ts:11`); there are no sung lyrics in another language in the code. The only other foreign-language text is shop greetings, which show no English at all (they are listed with the other rows).

## 1. Haitian Kreyòl (Zetwal / Pòdlimyè) -- Nov 18 check

Spoken mostly by the vendors and the baker of Pòdlimyè (Chapter 1) and shown in shop text. Gloss column shows what the player sees under the line.

### 1a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Bonjou! Kijan ou ye? | Hello! How are you? | Ch 1, Zetwal (Pòdlimyè); Soup vendor | `data/dialogue/zetwal.ts:492` |  |
| 2 | Bonjou, cherie! Kijan ou ye? | Hello, dear! How are you? | Ch 1, Zetwal (Pòdlimyè); Charm seller | `data/dialogue/zetwal.ts:1709` |  |
| 3 | Bonjou! | Hello! (same gloss at each place) | Ch 1, Zetwal (Pòdlimyè); Smith (first of 3 places) | `data/dialogue/zetwal.ts:1705`<br>also: `d/zetwal.ts:1713`, `d/zetwal.ts:2251` | Opens an English sentence each time; gloss shown under the line. Also used by the market vendor, fish seller, smith. |
| 4 | Bonjou, cherie! | Hello, dear! | Ch 1, Zetwal (Pòdlimyè); Produce seller | `data/dialogue/zetwal.ts:2198` |  |
| 5 | Bonjou, ti cheri.<br>*as written:* “Bonjou, ti cheri. Peppers, callaloo, the best basil in Zetwal. Do not tell the market vendor.” | Hello, little dear. | Ch 1, Zetwal (Pòdlimyè); Gardener | `data/dialogue/zetwal.ts:2280` | Is "ti cheri" right for an older gardener speaking to a young person? |
| 6 | Bonjou, archivist.<br>*as written:* “Bonjou, archivist. Names on rings, suns on seals. If it holds still, I can cut it.” | Hello | Ch 1, Zetwal (Pòdlimyè); Engraver | `data/dialogue/zetwal.ts:2173` |  |
| 7 | Bonjou! What will it be? | none | Shop panel UI | `ui/ShopPanel.ts:57` | Default shop greeting in the UI; no English gloss shown. |
| 8 | Mèsi! (stall owner)<br>*as written:* “Mèsi! Come back when the stall is open and I will give you the good pot.” | Thank you! | Ch 1, Zetwal (Pòdlimyè); Soup vendor | `data/dialogue/zetwal.ts:528` |  |
| 9 | Mèsi, cherie!<br>*as written:* “Mèsi, cherie! Hot, so walk fast. Not too fast.” | Thank you, dear! | Ch 1, Zetwal (Pòdlimyè); Soup vendor | `data/dialogue/zetwal.ts:547` |  |
| 10 | Mèsi! One <item>.<br>*as written:* “Mèsi! One ${it.name}.” | none | Shop panel UI | `ui/ShopPanel.ts:144` | Shown after every purchase, in every shop in the game (not only Zetwal). |
| 11 | Pran, pran. Pa gen dèt. | Take, take. No debt. | Ch 1 side quest, Zetwal; Baker (first of 4 places) | `data/dialogue/zetwalQuests.ts:102`<br>also: `rpg.ts:152`, `rpg.ts:627`, `d/zetwalQuests.ts:108` | Gloss shown only in the two dialogue lines; the shop greeting and the item description show it with no English. |
| 12 | pitit<br>*as written:* “Bread for the companies, pitit. All seven of them. Nobody is writing it down.” | none | Ch 10, Zetwal again (the Muster); Baker (first of 5 places) | `data/dialogue/zetwalMuster.ts:1505`<br>also: `d/zetwalQuests.ts:113`, `d/zetwalQuests.ts:119`, `d/zetwalQuests.ts:132`, `d/zetwalQuests.ts:139` | Used as a term of address ("pitit" = child) in the baker lines. No gloss. |
| 13 | Grann<br>*as written:* “Gianna reads every stone. Soldiers, scouts, a drummer, a cook. No cutter called Grann.” | none | Ch 1, Zetwal (Pòdlimyè) (first of 7 places) | `data/dialogue/zetwal.ts:65`<br>also: `sideQuests.ts:79`, `quests.ts:281`, `d/zetwal.ts:2364`, `d/zetwal.ts:2375`, `d/zetwal.ts:2401` (+1 more) | Used as the cane cutter's grandmother's nickname: "Grann, we called her." No gloss given in text. |
| 14 | One sou<br>*as written:* “One sou, archivist. The truth costs more, but the gazette is cheaper.” | none | Ch 1, Zetwal (Pòdlimyè); Gazette crier | `data/dialogue/zetwal.ts:1999` | Coin name ("sou"), spoken by the gazette crier. |
| 15 | Borlette!<br>*as written:* “Borlette! Dream of a fish, play twelve. Dream of a boa…” | none | Ch 1, Zetwal (Pòdlimyè); Lottery seller | `data/dialogue/zetwal.ts:2218` | Haitian lottery; no gloss. Lottery seller's patter ("dream of a fish, play twelve"). |
| 16 | Pwofesè<br>*as written:* “This one is Pwofesè. He has eaten two hats and a council notice.…” | none | Ch 1, Zetwal (Pòdlimyè); Goat herder | `data/dialogue/zetwal.ts:2215` | Name of a goat ("This one is Pwofesè"). |
| 17 | Kasav (item)<br>*as written:* “Kasav from my own griddle, for the water. Eat it before the hutia does.” | Cassava bread, flat and crisp... (item text) | Ch 1, Zetwal (Pòdlimyè); Anicette (first of 5 places) | `data/dialogue/zetwal.ts:1649`<br>also: `rpg.ts:137`, `rpg.ts:138`, `d/zetwal.ts:2199`, `d/ardencia.ts:96` | Also "Grandmother's kasav". The Taíno section lists casabe: two words for the same food. |
| 18 | Pikliz<br>*as written:* “Pikliz to wake the dead, pepper to wake the pikliz. Taste, taste. You only cry a little.” | Pickled cabbage and peppers... (item text) | Ch 1, Zetwal (Pòdlimyè); Spice seller (first of 2 places) | `data/dialogue/zetwal.ts:2202`<br>also: `rpg.ts:140` |  |
| 19 | Akasan | Sweet cornmeal drink... (item text) | Item/shop/party data | `data/rpg.ts:134` |  |
| 20 | Pwason fri<br>*as written:* “Pwason fri: snapper fried whole, with pikliz on the side. Restores 50 HP.” | Fried snapper (item name) / "snapper fried whole" (text) | Item/shop/party data | `data/rpg.ts:142` |  |
| 21 | Marinad lanbi<br>*as written:* “Marinad lanbi: conch fritters, crisp and peppery. Restores 15 SP.” | Conch fritters (item name and text) | Item/shop/party data | `data/rpg.ts:143` | Kreyòl for conch is "lanbi"; is "marinad lanbi" the right dish name? |
| 22 | Limyè Elodie | Elodie's light heals one ally. (skill text) | Skill/battle text | `data/battles.ts:38` | Skill name for Gianna in battle (the first light skill). |
| 23 | Limyè pou Tout | Light for all: heals the whole party a little. (skill text) | Skill/battle text | `data/battles.ts:66` | Skill name for Gianna in battle. |
| 24 | Solèy Heights | none | Ch 10, Zetwal again (the Muster); Anissa (first of 4 places) | `data/dialogue/zetwalMuster.ts:870`<br>also: `rpg.ts:708`, `objects.ts:864`, `objects.ts:872` | Place name; a Kreyòl word in an English phrase. Also "Kay Soley" (no accent) below. |

### 1b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Zetwal | The realm/city; "star" in Kreyòl (not stated in game) | 275 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:122`<br>also: `ui/installScreen.ts:43`, `sideQuests.ts:358`, `sideQuests.ts:559`, `chapterLevels.ts:16`, `chapterLevels.ts:25` (+269 more) | Appears throughout (hundreds of places). |
| 2 | Kay Soley | The house ("house of the sun"); claimed Kreyol in docs | 17 places; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:323`<br>also: `rpg.ts:62`, `rpg.ts:460`, `rpg.ts:474`, `rpg.ts:492`, `rpg.ts:696` (+11 more) | Written without the grave accent everywhere; compare Solèy Heights. |
| 3 | Limyè | Gianna's surname; "light" (glossary: "Light, the family surname") | 51 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:797`<br>also: `sideQuests.ts:44`, `gameOver.ts:11`, `rpg.ts:62`, `rpg.ts:710`, `npcs.ts:17` (+45 more) | Always with è in visible text. |
| 4 | Pòdlimyè | The capital of Zetwal; "Port of Light" (docs) | 31 places; first: Ch 12 side quest, Eightgate | `data/dialogue/seatQuests.ts:159`<br>also: `chapterLevels.ts:16`, `voyages.ts:11`, `voyages.ts:56`, `voyages.ts:172`, `rpg.ts:695` (+25 more) | Always written Pòdlimyè in visible text (see CAPITALS.md row 36, STORY.md section 6.1). |
| 5 | Ti Jak | A cutter's boy ("little Jak") | 11 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:1063`<br>also: `sideQuests.ts:1048`, `sideQuests.ts:1054`, `sideQuests.ts:1060`, `sideQuests.ts:1065`, `npcs.ts:560` (+5 more) |  |
| 6 | Papa Wout | Head of the Carriage Guild (book "Harbor Tolls and Roads"; wout = road/route in Kreyòl) | 1 place; first: Book page | `data/books.ts:215` | Appears in a Zetwal archive book; the guild runs carriages to the other capitals. |
| 7 | Rose-Aimée | Cane cutter's grandmother; French-origin Haitian name | 13 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:1127`<br>also: `d/zetwal.ts:2432`, `d/zetwal.ts:2433`, `d/zetwal.ts:2434`, `d/zetwal.ts:2435`, `d/zetwal.ts:2454` (+7 more) |  |
| 8 | Dieudonné Lafortune | Name on a Zetwal name stone | 1 place; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:166` |  |
| 9 | Odilon Philogène | Name on a Zetwal name stone | 1 place; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:170` |  |
| 10 | Jean-Fils Beauvais | Name on a Zetwal name stone | 1 place; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:163` |  |
| 11 | Rosalie Jeune | Name on a Zetwal name stone | 1 place; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:164` |  |
| 12 | Fanfan Michel | Name on a Zetwal name stone | 1 place; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:171` |  |
| 13 | Odile | Ti Jak's mother, a cutter | 6 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:1089`<br>also: `quests.ts:2709`, `d/zetwalMuster.ts:1090`, `d/zetwalMuster.ts:1091`, `d/zetwalMuster.ts:1128`, `d/zetwalMuster.ts:1129` |  |
| 14 | Solange | "Mother Solange's list" (Zetwal's names of the dead) | 27 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:1084`<br>also: `sideQuests.ts:99`, `sideQuests.ts:151`, `sideQuests.ts:175`, `sideQuests.ts:1056`, `rpg.ts:116` (+21 more) |  |
| 15 | Jean-Philippe | A family/house name of Sebastian | 12 places; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:699`<br>also: `npcs.ts:501`, `npcs.ts:687`, `books.ts:48`, `books.ts:58`, `books.ts:694` (+6 more) |  |

## 2. Taíno (Xaraguá / Yucayeque) -- Nov 18 check

Most Taíno words are used inside English sentences with no gloss (the surrounding sentence explains them). Please judge whether each is used correctly and respectfully, and flag any that should be avoided or replaced. Spanish-style forms such as *cacica* are included here because they are built on a Taíno word.

### 2a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Guatiao<br>*as written:* “Guatiao. Mind the hooks in the mesh.” | Friend! / Friend. / Friend, Yari. (the 6 dialogue lines); none in the 6 shop greetings | Ch 2 side quest, Xaraguá; Fisher (first of 12 places) | `data/dialogue/xaraguaQuests.ts:106`<br>also: `rpg.ts:633`, `rpg.ts:634`, `rpg.ts:635`, `rpg.ts:640`, `rpg.ts:641` (+6 more) | Taíno for friend (ritual friendship). Spelled "guatiao" in CAPITALS.md; "Guatiao!" shop greetings show no gloss. |
| 2 | areíto (accent) | The glossary says: sung and danced remembrance of a people's history; in-game: "areíto's drum song", "the areíto is not a show. It is how we remember." | Ch 2, Xaraguá; Elder (first of 19 places) | `data/dialogue/xaragua.ts:301`<br>also: `rpg.ts:724`, `objects.ts:831`, `objects.ts:844`, `objects.ts:845`, `objects.ts:850` (+13 more) | Also in "Areíto Plaza" (place name, a lot of signs). |
| 3 | Areíto Plaza | none | Item/shop/party data (first of 10 places) | `data/rpg.ts:724`<br>also: `objects.ts:831`, `objects.ts:844`, `objects.ts:845`, `objects.ts:850`, `quests.ts:329` (+4 more) | Place name and map signs. |
| 4 | areito (no accent)<br>*as written:* “…oves, mountain passes and hearth flames. The areito, their dance of memory, carries history from…” | none | Book page | `data/books.ts:116` | Spelled without the accent here only: the book "Xaraguá in brief" page. Everywhere else it is areíto. |
| 5 | batey<br>*as written:* “On the batey. They are standing on the batey.” | "the stones round the dance ground" / "the ceremonial plaza" (given in nearby lines) | Ch 2, Xaraguá (first of 4 places) | `data/dialogue/xaragua.ts:451`<br>also: `quests.ts:437`, `quests.ts:454`, `d/xaragua.ts:978` |  |
| 6 | behique<br>*as written:* “…mp has no salt. The Crown took the pans. The behique cleans wounds with sea water carried up in g…” | "the healer"; "the behique cleans wounds…" (healer implied) | Ch 11, Xaraguá again (first of 5 places) | `data/dialogue/xaraguaWar.ts:538`<br>also: `books.ts:365`, `d/xaraguaWar.ts:548`, `d/xaraguaWar.ts:549`, `d/xaraguaWar.ts:552` |  |
| 7 | cacique / Cacique<br>*as written:* “Asleep on top of it all. Like a cacique on his duho.” | none, but "his great house" / "chief" implied (glossary: Chief) | Ch 2 side quest, Xaraguá; Small girl (first of 62 places) | `data/dialogue/xaraguaQuests.ts:211`<br>also: `sideQuests.ts:313`, `sideQuests.ts:318`, `rpg.ts:88`, `rpg.ts:103`, `rpg.ts:217` (+56 more) | Used as a title ("Cacique Anaco") and a common noun ("the cacique's fever"). |
| 8 | caciques<br>*as written:* “The Line of the Caciques” | none | Book page | `data/books.ts:326` |  |
| 9 | cacica / Cacica<br>*as written:* “Say the word, cacica.” | none | Ch 11, Xaraguá again (first of 5 places) | `data/dialogue/xaraguaWar.ts:564`<br>also: `secretItems.ts:112`, `d/seatClaim.ts:567`, `d/seatClaim.ts:974`, `d/seatClaim.ts:1335` | A feminine form used for Yari as ruler. Is "cacica" attested for Taíno, or only Spanish usage? Needs the Taíno reader. |
| 10 | caney<br>*as written:* “There. The caney's roof. They've put a flag on it.” | "His great house, the caney" (in the quest log) / glossary: the chief's great house | Ch 11, Xaraguá again; Yari (first of 33 places) | `data/dialogue/xaraguaWar.ts:171`<br>also: `sideQuests.ts:322`, `sideQuests.ts:341`, `sideQuests.ts:345`, `npcs.ts:155`, `npcs.ts:156` (+27 more) | Also the Caney of Anaco (a map). |
| 11 | casabe<br>*as written:* “Torches and casabe. The war won't feed you.” | Cassava bread (items: "Cassava-bread stall" etc.) | Ch 11, Xaraguá again; Lamp-oil seller (first of 13 places) | `data/dialogue/xaraguaWar.ts:638`<br>also: `rpg.ts:146`, `rpg.ts:154`, `npcs.ts:727`, `speakers.ts:447`, `books.ts:294` (+7 more) | Item name "Snapper on casabe". Kreyòl section has "kasav" for the same food. |
| 12 | duho<br>*as written:* “…nner is gone from the doors. Anaco is in his duho, the elders in their circle.” | none (glossary: a carved ceremonial seat) | Ch 11, Xaraguá again (first of 5 places) | `data/dialogue/xaraguaWar.ts:1303`<br>also: `objects.ts:481`, `quests.ts:1970`, `d/xaraguaQuests.ts:211`, `d/xaragua.ts:1351` | Also "The cacique's duho" (map object). |
| 13 | hamaca / hamacas<br>*as written:* “…elders at the fire, the healer with a row of hamacas slung for the wounded to come.” | none; implied hammock ("A hamaca") | Ch 11, Xaraguá again (first of 13 places) | `data/dialogue/xaraguaWar.ts:495`<br>also: `objects.ts:697`, `objects.ts:698`, `objects.ts:699`, `objects.ts:700`, `objects.ts:701` (+7 more) |  |
| 14 | hutia<br>*as written:* “For the water. Eat it before the hutia does.” | none; "a small brown hutia rodent" in docs and an item ("hutia bead") | Ch 10, Zetwal again (the Muster); Anicette (first of 39 places) | `data/dialogue/zetwalMuster.ts:916`<br>also: `sideQuests.ts:250`, `sideQuests.ts:255`, `sideQuests.ts:259`, `sideQuests.ts:262`, `rpg.ts:110` (+33 more) | Yari's pet; also a side quest. |
| 15 | opía<br>*as written:* “Voice of the Opía” | "the spirits of the dead" (the book page text explains it) | Item/shop/party data (first of 5 places) | `data/rpg.ts:480`<br>also: `books.ts:279`, `books.ts:282`, `books.ts:283`, `books.ts:285` | Also item skill "Voice of the Opía". |
| 16 | ceiba<br>*as written:* “In the hollow of the old ceiba, with a fish hook, a brass button and two spoons.” | none | Ch 2 side quest, Xaraguá; Small girl (first of 16 places) | `data/dialogue/xaraguaQuests.ts:209`<br>also: `sideQuests.ts:267`, `puzzles.ts:311`, `objects.ts:473`, `objects.ts:474`, `objects.ts:475` (+10 more) | A tree (Taíno-origin word via Spanish); map object names. |
| 17 | Taíno<br>*as written:* “Dark wood carved with Taíno spirals, gold discs at the tips.” | none | Weapon text | `data/weapons.ts:64` | Only visible once (a weapon description). |

### 2b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Xaraguá | The realm (Taíno place name in Hispaniola history) | 168 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:327`<br>also: `sideQuests.ts:179`, `sideQuests.ts:546`, `sideQuests.ts:560`, `chapterLevels.ts:17`, `chapterLevels.ts:26` (+162 more) | Visible text always uses the accent; filenames and ids do not. |
| 2 | Yucayeque | The capital; Taíno word for a town or village (CAPITALS.md: needs a source check) | 42 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:115`<br>also: `chapterLevels.ts:17`, `voyages.ts:33`, `voyages.ts:198`, `voyages.ts:215`, `rpg.ts:407` (+36 more) | Used as a proper name and as the name of the credits music. |
| 3 | Yaguana | The people/house of Xaraguá (also "Yaguana Bow", "Yaguana cotton") | 21 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:1430`<br>also: `rpg.ts:344`, `rpg.ts:390`, `rpg.ts:401`, `rpg.ts:478`, `rpg.ts:606` (+15 more) | Historical Yaguana was a place name; used here for the people. |
| 4 | Anaco | The cacique (chief), Yari's father | 35 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:218`<br>also: `sideQuests.ts:315`, `rpg.ts:217`, `rpg.ts:729`, `npcs.ts:137`, `npcs.ts:186` (+29 more) |  |
| 5 | Caona | The ancestor/leader who swore the first oath (also "Caona's Conch" planned) | 60 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:123`<br>also: `sideQuests.ts:318`, `rpg.ts:606`, `puzzles.ts:559`, `npcs.ts:108`, `npcs.ts:118` (+54 more) |  |
| 6 | Yari | Young archer, party member | 128 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:820`<br>also: `sideQuests.ts:212`, `sideQuests.ts:259`, `sideQuests.ts:546`, `sideQuests.ts:550`, `sideQuests.ts:1084` (+122 more) |  |
| 7 | Guanín | Leader in "The Song of Guanín" (the book) | 4 places; first: Book page | `data/books.ts:234`<br>also: `books.ts:237`, `books.ts:239`, `books.ts:329` | Guanín is also a Taíno word for a gold alloy; used here as a person. |

## 3. Spanish (Ardencia / Brasador line) -- bonus

Ardencia is Spanish-flavoured; the Brasador family and some skill names use Spanish. Aunts are called *Titi*, an uncle is *Tío*.

### 3a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | ¡Coma, coma!<br>*as written:* “¡Coma, coma! Bowls on the left, spoons on the right!” | Eat, eat! | Ch 3, Ardencia; Amanda | `data/dialogue/ardencia.ts:517` |  |
| 2 | mi amor<br>*as written:* “...Go home, mi amor. Some things in your father's city are better not understood before a trial.” | none | Ch 3, Ardencia; Amanda (first of 2 places) | `data/dialogue/ardencia.ts:598`<br>also: `d/ardencia.ts:945` | Said to Gianna by Titi Amanda (Ch 3); no gloss. |
| 3 | Pan de ceniza<br>*as written:* “Pan de ceniza, still warm. Olla, if you are hungry. Café, if you are tired. You look both.” | Dark bread baked in the ash of the forges (item text) | Ch 3, Ardencia; Tavern cook (first of 2 places) | `data/dialogue/ardencia.ts:502`<br>also: `rpg.ts:158` |  |
| 4 | Olla de Cenizal | Beans, pork and peppers from a clay pot (item text) | Item/shop/party data | `data/rpg.ts:159` |  |
| 5 | Olla, ... Café,<br>*as written:* “Pan de ceniza, still warm. Olla, if you are hungry. Café, if you are tired. You look both.” | none | Ch 3, Ardencia; Tavern cook | `data/dialogue/ardencia.ts:502` | Vendor line mixes Spanish words in English. |
| 6 | Café de olla | Coffee with cinnamon and cane sugar (item text) | Item/shop/party data | `data/rpg.ts:160` |  |
| 7 | ¡Firmes!<br>*as written:* “¡Firmes! ...Fire.” | none ("...Fire." follows) | Ch 11, Xaraguá again (first of 3 places) | `data/dialogue/xaraguaWar.ts:120`<br>also: `war.ts:58`, `d/zetwalMuster.ts:614` | A military command ("attention!"). Said by Azzy's Free Brasador, in war and in the Muster. |
| 8 | La Marca<br>*as written:* “He kept the oath, whatever it cost: his La Marca is a weapon move, ready every third turn.” | Skill name: "Let him mark one with La Marca" (in text) | Item/shop/party data (first of 10 places) | `data/rpg.ts:599`<br>also: `warBattles.ts:120`, `warBattles.ts:291`, `battles.ts:74`, `battles.ts:89`, `battles.ts:246` (+4 more) | Skill name for Azzy and Rael (the Brasador house ability). |
| 9 | Grito de Guerra | A war cry: one foe loses its next action (skill text) | War battle text (first of 4 places) | `data/warBattles.ts:119`<br>also: `battles.ts:78`, `battles.ts:93`, `battles.ts:1059` | Azzy / Rael skill. |
| 10 | Reinado de Cenizas | Once per battle: a burning blow, stronger for every foe already felled (skill text) | War battle text (first of 5 places) | `data/warBattles.ts:124`<br>also: `battles.ts:82`, `battles.ts:97`, `battles.ts:1065`, `battles.ts:1604` | Azzy / Rael skill. |
| 11 | Sangre Ardiente | Each foe he fells this battle: +5% ATK (passive text) | Item/shop/party data (first of 2 places) | `data/rpg.ts:504`<br>also: `rpg.ts:588` | Azzy and Rael passive. |
| 12 | La Promesa de Benny | none (secret item / skill text) | Secret item text (first of 2 places) | `data/secretItems.ts:60`<br>also: `battles.ts:492` | "Benny's Promise" appears in English in `engine/battle.ts:1484`. |
| 13 | La Biblioteca Vieja<br>*as written:* “La Biblioteca Vieja. The Ash Wars, the trade, the law. Read what you like; put it back where it was.” | none | Ch 3, Ardencia; Librarian (first of 4 places) | `data/dialogue/ardencia.ts:617`<br>also: `rpg.ts:748`, `objects.ts:818`, `battles.ts:57` | Also "Biblioteca Vieja's readers" with no article. |
| 14 | Tío<br>*as written:* “Tío.” | none | Ch 10, Zetwal again (the Muster) (first of 12 places) | `data/dialogue/zetwalMuster.ts:212`<br>also: `npcs.ts:516`, `npcs.ts:616`, `npcs.ts:624`, `speakers.ts:397`, `claim.ts:113` (+6 more) | Tío Joaquin (name tag); "Tío." in Ch 10/12 as address. |
| 15 | Titi<br>*as written:* “…p-oil seller who she has never met. Ask your Titi Amanda who pays for the flour. Nine doors, G…” | none | Ch 11, Xaraguá again; Anissa (first of 19 places) | `data/dialogue/xaraguaWar.ts:1144`<br>also: `rpg.ts:274`, `rpg.ts:326`, `quests.ts:1362`, `quests.ts:1749`, `quests.ts:2580` (+13 more) | Used for Gianna's aunts (Kayla, Jordyn, Aiyana, Amanda). Caribbean Spanish "titi". |
| 16 | Tati<br>*as written:* “Coco's painted door is shut. A note on it: Tati Coco is dressing a wedding in Al-Doria.” | none | Ch 12, Eightgate again; The Crown's clerk (first of 14 places) | `data/dialogue/seatClaim.ts:299`<br>also: `rpg.ts:388`, `npcs.ts:265`, `npcs.ts:325`, `cards.ts:159`, `cards.ts:214` (+8 more) | Coralie is "Tati Coco" (Arabic/French flavour; Tati vs Titi are different aunts) |

### 3b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Cenizal | The Ardencian capital town (Spanish "ashes" place name) | 28 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:61`<br>also: `rpg.ts:159`, `rpg.ts:740`, `npcs.ts:675`, `objects.ts:812`, `books.ts:395` (+22 more) |  |
| 2 | Alcázar | The Lord's fortress in Cenizal | 27 places; first: Ch 3, Ardencia | `data/dialogue/ardencia.ts:196`<br>also: `sideQuests.ts:383`, `sideQuests.ts:386`, `sideQuests.ts:392`, `sideQuestsLate.ts:81`, `sideQuestsLate.ts:99` (+21 more) |  |
| 3 | Cendre | The ford where the Ash Wars ended | 13 places; first: Ch 1, Zetwal (Pòdlimyè) | `data/dialogue/zetwal.ts:1072`<br>also: `books.ts:70`, `books.ts:162`, `books.ts:399`, `books.ts:402`, `debates.ts:200` (+7 more) | French word ("ash") in a Spanish area; "Ceniza" is Spanish. Two spellings: Cenizal vs Cendre. |
| 4 | Ardencia | The realm | 120 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:328`<br>also: `sideQuests.ts:558`, `chapterLevels.ts:18`, `sideQuestsLate.ts:129`, `voyages.ts:24`, `voyages.ts:47` (+114 more) |  |
| 5 | Brasador | The house (Portuguese/Spanish "brasa" ember-ish) | 103 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:327`<br>also: `config.ts:414`, `sideQuests.ts:995`, `sideQuestsLate.ts:126`, `sideQuestsLate.ts:144`, `voyages.ts:76` (+97 more) |  |
| 6 | Joaquin | Tío Joaquin (the guns) | 15 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:527`<br>also: `npcs.ts:516`, `npcs.ts:616`, `npcs.ts:624`, `cards.ts:220`, `speakers.ts:169` (+9 more) | No accent; Spanish is Joaquín. |
| 7 | Patricio | The Marshal, Gianna's grandfather | 103 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:326`<br>also: `sideQuestsLate.ts:193`, `sideQuestsLate.ts:458`, `rpg.ts:492`, `npcs.ts:19`, `npcs.ts:190` (+97 more) |  |
| 8 | Rodriguez | Surname of the Brasador line | 23 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:799`<br>also: `rpg.ts:203`, `books.ts:693`, `quests.ts:2089`, `quests.ts:2349`, `quests.ts:2797` (+17 more) | No accent; Spanish is Rodríguez. |
| 9 | Rivera | Captain Rivera | 27 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:1029`<br>also: `npcs.ts:209`, `npcs.ts:670`, `cards.ts:220`, `encounters.ts:138`, `encounters.ts:518` (+21 more) |  |
| 10 | Ferrán | Elder Ferrán | 13 places; first: Ch 3 side quest, Ardencia | `data/dialogue/ardenciaQuests.ts:79`<br>also: `sideQuestsLate.ts:83`, `sideQuestsLate.ts:87`, `sideQuestsLate.ts:91`, `objects.ts:394`, `secretItems.ts:116` (+7 more) |  |
| 11 | Alonso | Don Alonso, first Lord of Ardencia | 10 places; first: Ch 3, Ardencia | `data/dialogue/ardencia.ts:353`<br>also: `objects.ts:363`, `books.ts:477`, `books.ts:482`, `quests.ts:2238`, `quests.ts:2244` (+4 more) |  |
| 12 | Sebastian | Uncle Sebastian | 13 places; first: Ch 9, Aldermoor (Kingsmere) | `data/dialogue/aldermoor.ts:631`<br>also: `rpg.ts:334`, `npcs.ts:501`, `npcs.ts:687`, `cards.ts:214`, `speakers.ts:365` (+7 more) | No accent (Sebastián). |
| 13 | Jaime | NPC name | 20 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:1029`<br>also: `npcs.ts:671`, `cards.ts:220`, `encounters.ts:138`, `encounters.ts:518`, `speakers.ts:166` (+14 more) |  |

## 4. Arabic (Al-Doria / Bab al-Dhahab) -- bonus

All in Latin-letter transliteration; no Arabic script is shown.

### 4a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Ahlan wa sahlan<br>*as written:* “Ahlan wa sahlan. Mind the moneychangers; they mind you.” | Welcome. / Welcome! | Ch 4, Al-Doria; Gate clerk (first of 3 places) | `data/dialogue/aldoria.ts:212`<br>also: `rpg.ts:650`, `d/aldoria.ts:549` |  |
| 2 | Ahlan<br>*as written:* “Ahlan. Blue glass against the evil eye. The good eye costs extra.” | Hello. | Ch 4, Al-Doria; Amulet seller (first of 2 places) | `data/dialogue/aldoria.ts:551`<br>also: `rpg.ts:658` |  |
| 3 | Tfaddal<br>*as written:* “Tfaddal. Guild steel for the caravans, desert leather for the road.” | Please, go ahead. | Ch 4, Al-Doria; Armourer (first of 2 places) | `data/dialogue/aldoria.ts:550`<br>also: `rpg.ts:652` |  |
| 4 | Bab al-Dhahab | none | Ch 6, Skarragol; Herder (first of 19 places) | `data/dialogue/skarragol.ts:715`<br>also: `sideQuestsLate.ts:212`, `rpg.ts:755`, `books.ts:533`, `quests.ts:749`, `quests.ts:2301` (+13 more) | Capital of Al-Doria; glossary: Gate of Gold. |
| 5 | Majlis<br>*as written:* “The Majlis has heard the envoy.” | none (glossary: a council, and the hall) | Ch 4, Al-Doria; Layla (first of 17 places) | `data/dialogue/aldoria.ts:65`<br>also: `rpg.ts:761`, `npcs.ts:277`, `npcs.ts:282`, `npcs.ts:285`, `objects.ts:805` (+11 more) |  |
| 6 | Daftar al-Dorini | Skill/passage text: "She pays in gold..." | Item/shop/party data | `data/rpg.ts:515` |  |
| 7 | Baraka Dorini | Gold from battles won with her: +10%. | Item/shop/party data | `data/rpg.ts:514` |  |
| 8 | Baraka of the Scale | Learned in Bab al-Dhahab: the scale weighs true... | Skill/battle text | `data/battles.ts:61` |  |
| 9 | The Sakk of Yusuf | none (glossary: a written deed or cheque) | Secret item text | `data/secretItems.ts:73` |  |
| 10 | dinar<br>*as written:* “My mother's seal. My debts, to the dinar, and ten over.” | none (currency, glossary: a gold coin) | Ch 4, Al-Doria (first of 4 places) | `data/dialogue/aldoria.ts:75`<br>also: `d/aldoria.ts:421`, `d/aldoria.ts:428`, `d/seat.ts:247` |  |
| 11 | qanat<br>*as written:* “… head: the guild's new iron sluice turns the qanat into its tanks. The old gate to the city lin…” | "a tunnel that carries water underground" (explained in the book text) | Ch 4, Al-Doria; Water-carrier (first of 2 places) | `data/dialogue/aldoria.ts:632`<br>also: `books.ts:536` |  |
| 12 | Alif, ba, jim / Kaf, ha<br>*as written:* “…counted in figures, they counted in letters. Alif was one, ba two, jim three, and so on up the alphabe…” | The Dorini number letters: "Alif was one, ba two, jim three…" / "Kaf is twenty. Ha is five." | Book page | `data/books.ts:490` | Abjad numerals; transliterations only, no Arabic script. |
| 13 | souk<br>*as written:* “The souk square” | none | Side-quest text (first of 4 places) | `data/sideQuests.ts:485`<br>also: `sideQuests.ts:505`, `objects.ts:808`, `objects.ts:809` |  |
| 14 | tagine<br>*as written:* “Ahlan wa sahlan! Mint tea, dates, tagine. Sit, sit.” | none (item name) | Ch 4, Al-Doria; Tea seller (first of 2 places) | `data/dialogue/aldoria.ts:549`<br>also: `rpg.ts:190` |  |

### 4b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Dorini | The house; Al-Doria | 131 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:633`<br>also: `config.ts:415`, `sideQuests.ts:955`, `sideQuests.ts:959`, `sideQuests.ts:966`, `muster.ts:35` (+125 more) |  |
| 2 | Al-Doria | The realm | 45 places; first: Ch 3, Ardencia | `data/dialogue/ardencia.ts:133`<br>also: `sideQuests.ts:553`, `chapterLevels.ts:19`, `voyages.ts:77`, `rpg.ts:166`, `rpg.ts:858` (+39 more) |  |
| 3 | Qasim | Name | 21 places; first: Ch 4, Al-Doria | `data/dialogue/aldoria.ts:680`<br>also: `npcs.ts:279`, `cards.ts:220`, `encounters.ts:225`, `encounters.ts:226`, `encounters.ts:227` (+15 more) |  |
| 4 | Yusuf | Name | 29 places; first: Ch 12 side quest, Eightgate | `data/dialogue/seatQuests.ts:66`<br>also: `secrets.ts:65`, `sideQuestsLate.ts:186`, `sideQuestsLate.ts:193`, `npcs.ts:287`, `npcs.ts:301` (+23 more) |  |
| 5 | Samira | Alchemist, party member | 64 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:336`<br>also: `engine/battle.ts:1602`, `sideQuests.ts:460`, `sideQuests.ts:464`, `sideQuests.ts:469`, `sideQuests.ts:475` (+58 more) |  |
| 6 | Layla | Name | 6 places; first: Ch 12, Eightgate again | `data/dialogue/seatClaim.ts:732`<br>also: `npcs.ts:278`, `npcs.ts:654`, `npcs.ts:700`, `cards.ts:220`, `speakers.ts:204` |  |
| 7 | Azriel | Name | 22 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:213`<br>also: `cards.ts:173`, `books.ts:456`, `quests.ts:2238`, `d/zetwalMuster.ts:377`, `d/zetwalMuster.ts:518` (+16 more) |  |

## 5. French (Tati Coco) -- bonus

Spoken by Coralie ("Tati Coco") in Chapter 4. French-origin names in Zetwal are in the Kreyòl section.

### 5a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | chérie<br>*as written:* “Turn them over, chérie. Count the knots on the back. A good carpet has two hundred to the inch.” | none | Ch 4, Al-Doria (first of 2 places) | `data/dialogue/aldoria.ts:457`<br>also: `d/aldoria.ts:537` | Said by Tati Coco (Coralie) to the sisters. |
| 2 | Mes chéries!<br>*as written:* “Mes chéries! The tide will not wait, even for me.” | My darlings! | Ch 4, Al-Doria (first of 2 places) | `data/dialogue/aldoria.ts:353`<br>also: `d/aldoria.ts:528` | Said by Tati Coco (Coralie). |

### 5b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Tati Coco | Coralie, Elodie's sister (glossary: French) | 13 places; first: Ch 12, Eightgate again | `data/dialogue/seatClaim.ts:299`<br>also: `rpg.ts:388`, `npcs.ts:265`, `npcs.ts:325`, `cards.ts:159`, `cards.ts:214` (+7 more) | "Tati" = aunt; Coco is her nickname. |

## 6. Mongolian (Skarragol steppe clans) -- bonus

Latin-letter transliteration.

### 6a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Sain baina uu?<br>*as written:* “Sain baina uu? Broth for the cold, jerky for the road.” | Hello (are you well?) | Ch 6, Skarragol; Food tent (first of 2 places) | `data/dialogue/skarragol.ts:244`<br>also: `rpg.ts:665` | Glossary: literally "are you well?". Check spelling and whether the greeting is natural in this setting. |
| 2 | Bayarlalaa<br>*as written:* “Bayarlalaa for looking. Tack, rings, and treats the grey mare will tell you about.” | Thank you | Ch 6, Skarragol; Horse-trader (first of 2 places) | `data/dialogue/skarragol.ts:249`<br>also: `rpg.ts:667` | Check spelling. |
| 3 | Noyan<br>*as written:* “Noyan Grimvald” | none (a title; glossary: lord, chief) | Encounter text (first of 3 places) | `data/encounters.ts:282`<br>also: `battles.ts:672`, `battles.ts:1346` | Used as title for Grimvald. |
| 4 | Khatun<br>*as written:* “Grandson of the khatun's household. Your mother rides the eastern g…” | none (glossary: queen, lady) | Ch 6, Skarragol (first of 6 places) | `data/dialogue/skarragol.ts:784`<br>also: `sideQuests.ts:619`, `books.ts:790`, `quests.ts:2429`, `d/skarragol.ts:799`, `d/skarragol.ts:847` |  |
| 5 | airag<br>*as written:* “Airag” | none (item name, glossary: fermented mare's milk) | Item/shop/party data (first of 2 places) | `data/rpg.ts:174`<br>also: `rpg.ts:665` |  |

### 6b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Skarragol | The realm | 28 places; first: Ch 12, Eightgate again | `data/dialogue/seatClaim.ts:735`<br>also: `sideQuests.ts:554`, `chapterLevels.ts:21`, `rpg.ts:247`, `rpg.ts:859`, `npcs.ts:334` (+22 more) |  |
| 2 | Ordvik | The capital; docs call this made-up Norse "bay of the oath" not Mongolian | 23 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:171`<br>also: `sideQuestsLate.ts:275`, `sideQuestsLate.ts:360`, `voyages.ts:96`, `rpg.ts:788`, `books.ts:750` (+17 more) |  |
| 3 | Bayarmaa | Party member; "joy" + "mother" (glossary) | 38 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:327`<br>also: `sideQuestsLate.ts:275`, `sideQuestsLate.ts:279`, `sideQuestsLate.ts:303`, `rpg.ts:428`, `rpg.ts:526` (+32 more) |  |
| 4 | Salkhi | Bayarmaa's grey mare; "wind" (glossary) | 42 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:660`<br>also: `sideQuestsLate.ts:271`, `sideQuestsLate.ts:272`, `sideQuestsLate.ts:279`, `sideQuestsLate.ts:285`, `sideQuestsLate.ts:289` (+36 more) |  |
| 5 | Sarnai | Name; "rose" (glossary) | 39 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:135`<br>also: `sideQuestsLate.ts:318`, `sideQuestsLate.ts:325`, `puzzles.ts:354`, `npcs.ts:387`, `npcs.ts:388` (+33 more) |  |
| 6 | Khulan | Name of the herds-chief | 9 places; first: Ch 6 side quest, Skarragol | `data/dialogue/skarragolQuests.ts:246`<br>also: `sideQuestsLate.ts:358`, `npcs.ts:386`, `speakers.ts:303`, `d/skarragolQuests.ts:488`, `d/skarragolQuests.ts:489` (+3 more) |  |
| 7 | Grimvald | Noyan Grimvald | 24 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:493`<br>also: `rpg.ts:233`, `npcs.ts:362`, `objects.ts:64`, `cards.ts:226`, `encounters.ts:282` (+18 more) |  |

## 7. Old Norse (Skarragol fjord clans) -- bonus

Only a few words appear; most Norse-flavoured material is English with Norse-style names.

### 7a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Heill!<br>*as written:* “Heill! Fur, felt and a good sabre. The plateau takes the soft ones first.” | Hail! / Hail. | Ch 6, Skarragol; Furrier (first of 5 places) | `data/dialogue/skarragol.ts:245`<br>also: `rpg.ts:666`, `rpg.ts:668`, `d/skarragol.ts:252`, `d/skarragol.ts:673` | Old Norse; in English text. |
| 2 | Jarl<br>*as written:* “…s: wolves." "Count the fleet for the trading jarl." "Race at the fair, first snow."” | none (glossary: a chieftain) | Ch 6, Skarragol; Crier (first of 22 places) | `data/dialogue/skarragol.ts:234`<br>also: `sideQuestsLate.ts:357`, `npcs.ts:356`, `npcs.ts:357`, `npcs.ts:358`, `npcs.ts:385` (+16 more) |  |
| 3 | Skald<br>*as written:* “Take her. If she runs, I sell the fleet myself and tell the skalds why.” | none (glossary: poet who keeps the sagas) | Ch 6, Skarragol; Torvald (first of 12 places) | `data/dialogue/skarragol.ts:320`<br>also: `rpg.ts:377`, `npcs.ts:376`, `speakers.ts:298`, `books.ts:712`, `books.ts:724` (+6 more) |  |
| 4 | Moot<br>*as written:* “…ad a young woman across the field toward the Moot Tent, one at each shoulder. Her hands are fr…” | none (English word; here Norse "mot") | Ch 6, Skarragol (first of 31 places) | `data/dialogue/skarragol.ts:191`<br>also: `sideQuestsLate.ts:348`, `sideQuestsLate.ts:360`, `rpg.ts:795`, `objects.ts:729`, `books.ts:731` (+25 more) |  |

### 7b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Ulfgar | First chieftain; "Ulfgar's Oath" (book) | 7 places; first: Book page | `data/books.ts:703`<br>also: `books.ts:706`, `books.ts:708`, `books.ts:712`, `books.ts:800`, `debates.ts:439` (+1 more) |  |
| 2 | Hrafn | Name | 25 places; first: Ch 10, Zetwal again (the Muster) | `data/dialogue/zetwalMuster.ts:233`<br>also: `sideQuests.ts:955`, `sideQuestsLate.ts:354`, `sideQuestsLate.ts:360`, `rpg.ts:428`, `npcs.ts:356` (+19 more) |  |
| 3 | Torvald | Name | 21 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:392`<br>also: `rpg.ts:240`, `rpg.ts:244`, `npcs.ts:354`, `cards.ts:226`, `speakers.ts:280` (+15 more) |  |
| 4 | Ingrid | Jarl Ingrid | 6 places; first: Ch 6 side quest, Skarragol | `data/dialogue/skarragolQuests.ts:487`<br>also: `sideQuestsLate.ts:357`, `npcs.ts:385`, `speakers.ts:302`, `d/skarragolQuests.ts:502`, `d/skarragolQuests.ts:509` |  |

## 8. Japanese (Kuroshi / Kirinoura) -- bonus

Latin-letter transliteration. Skill names come with an English description, not a literal translation.

### 8a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Irasshaimase!<br>*as written:* “Irasshaimase! Rice balls, green tea, miso.” | Welcome! / Welcome. | Ch 7, Kuroshi (Kirinoura); Tea house (first of 6 places) | `data/dialogue/kuroshi.ts:518`<br>also: `rpg.ts:671`, `rpg.ts:672`, `rpg.ts:673`, `d/kuroshi.ts:519`, `d/kuroshi.ts:520` |  |
| 2 | Konnichiwa<br>*as written:* “Konnichiwa, envoy. The Crown's launch? It came yesterday.” | Good day | Ch 7, Kuroshi (Kirinoura); Harbor-master | `data/dialogue/kuroshi.ts:362` |  |
| 3 | Yōkoso<br>*as written:* “Yōkoso. Nine books on the shelves; the stacks are sealed. Read quietly.” | Welcome | Ch 7, Kuroshi (Kirinoura); Librarian | `data/dialogue/kuroshi.ts:633` |  |
| 4 | Kagemimi<br>*as written:* “He listens before he moves: Kagemimi tells a foe's next move, and finds out a disguise.” | He listens: one foe's next move is told, and a foe in disguise is found out... | Item/shop/party data (first of 4 places) | `data/rpg.ts:542`<br>also: `secretItems.ts:23`, `battles.ts:151`, `battles.ts:1453` |  |
| 5 | Sasayaki Ha | The whispering blade: a cut, and the foe hits a quarter softer... | Skill/battle text | `data/battles.ts:155` |  |
| 6 | Ayatsuri | Once per battle: the puppeteer's word... | Skill/battle text | `data/battles.ts:163` |  |
| 7 | Tanto<br>*as written:* “Kirinoura Tanto” | none (weapon) | Weapon text | `data/weapons.ts:86` |  |
| 8 | kimono<br>*as written:* “Grey travelling kimono” | none (armour piece "Grey kimono") | Item/shop/party data | `data/rpg.ts:380` |  |
| 9 | torii<br>*as written:* “Beyond the torii the lanes are the fog's. Nobody walks them without a reason, or a Suzumori.” | none | Ch 7, Kuroshi (Kirinoura); Gate guard (first of 4 places) | `data/dialogue/kuroshi.ts:476`<br>also: `quests.ts:1277`, `d/kuroshi.ts:483`, `d/kuroshi.ts:750` |  |
| 10 | miso<br>*as written:* “Irasshaimase! Rice balls, green tea, miso.” | none | Ch 7, Kuroshi (Kirinoura); Tea house (first of 2 places) | `data/dialogue/kuroshi.ts:518`<br>also: `rpg.ts:671` |  |

### 8b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Kuroshi | The realm | 25 places; first: Ch 12, Eightgate again | `data/dialogue/seatClaim.ts:736`<br>also: `sideQuests.ts:555`, `chapterLevels.ts:22`, `rpg.ts:247`, `rpg.ts:860`, `npcs.ts:335` (+19 more) |  |
| 2 | Kirinoura | The capital; mist + bay (glossary) | 51 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:651`<br>also: `sideQuests.ts:707`, `voyages.ts:116`, `rpg.ts:256`, `rpg.ts:338`, `rpg.ts:803` (+45 more) |  |
| 3 | Suzumori | The house; bell + grove (glossary) | 101 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:354`<br>also: `config.ts:418`, `sideQuests.ts:742`, `sideQuests.ts:975`, `sideQuestsLate.ts:442`, `sideQuestsLate.ts:451` (+95 more) |  |
| 4 | Haru | Shadow agent, party member | 35 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:330`<br>also: `sideQuestsLate.ts:387`, `sideQuestsLate.ts:391`, `sideQuestsLate.ts:414`, `rpg.ts:267`, `rpg.ts:270` (+29 more) |  |
| 5 | Kaede | Name | 31 places; first: Ch 6, Skarragol | `data/dialogue/skarragol.ts:354`<br>also: `rpg.ts:247`, `npcs.ts:426`, `objects.ts:97`, `cards.ts:23`, `cards.ts:226` (+25 more) |  |
| 6 | Sayo | Name (Lady Sayo) | 78 places; first: Ch 8 side quest, Jwaladesh | `data/dialogue/jwaladeshQuests.ts:377`<br>also: `sideQuestsLate.ts:408`, `sideQuestsLate.ts:410`, `sideQuestsLate.ts:416`, `sideQuestsLate.ts:453`, `rpg.ts:263` (+72 more) |  |
| 7 | Genzō | Clerk who listened (book "Genzō's Ear") | 4 places; first: Book page | `data/books.ts:849`<br>also: `books.ts:852`, `books.ts:860`, `books.ts:883` |  |

## 9. Hindi / Sanskrit (Jwaladesh / Agnipur) -- bonus

Latin-letter transliteration. Skill names come with an English description, not a literal translation.

### 9a. Phrases and words

| # | Phrase as shown | English shown with it | Who says it / where | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Namaste<br>*as written:* “Namaste, envoy. The chain? It closes the harbor at night, when there is a lamp to say so.” | Hello. / Hello! | Ch 8, Jwaladesh (Agnipur); Harbor-master (first of 8 places) | `data/dialogue/jwaladesh.ts:284`<br>also: `rpg.ts:676`, `rpg.ts:677`, `rpg.ts:678`, `d/jwaladesh.ts:360`, `d/jwaladesh.ts:361` (+2 more) |  |
| 2 | Dhanyavaad<br>*as written:* “Dhanyavaad for asking. Talwars, scale, and whatever Kirinoura sends us.” | Thank you | Ch 8, Jwaladesh (Agnipur); Swordsmith | `data/dialogue/jwaladesh.ts:362` |  |
| 3 | Agni ki Shakti | The power of fire: his skills cost 1 SP less (text) | Item/shop/party data | `data/rpg.ts:555` |  |
| 4 | Rakt Ki Pyaas | When his blow fells a foe, his next turn comes at once (text) | Item/shop/party data | `data/rpg.ts:556` |  |
| 5 | Ananta Yuddha | Once per battle: endless war... (text) | Skill/battle text | `data/battles.ts:186` |  |
| 6 | Agni! | none (war cry) | War company data | `data/war.ts:61` |  |
| 7 | Talwar<br>*as written:* “Dhanyavaad for asking. Talwars, scale, and whatever Kirinoura sends us.” | none (weapon) | Ch 8, Jwaladesh (Agnipur); Swordsmith (first of 4 places) | `data/dialogue/jwaladesh.ts:362`<br>also: `rpg.ts:678`, `weapons.ts:78`, `weapons.ts:79` |  |
| 8 | ghee<br>*as written:* “The lamp was a clay bowl of ghee she carried down from the hills when her village burned. ” | none | Book page | `data/books.ts:1068` |  |
| 9 | Rani<br>*as written:* “Rani Tejaswini's Flame” | Rani Tejaswini (founder) | Book page (first of 5 places) | `data/books.ts:1064`<br>also: `books.ts:1067`, `books.ts:1189`, `debates.ts:593`, `debates.ts:621` |  |
| 10 | Seth<br>*as written:* “No oil today. No oil tomorrow. The Seth will say when.” | Seth Dhanraj (honorific) | Ch 8, Jwaladesh (Agnipur); Oil Enforcer (first of 50 places) | `data/dialogue/jwaladesh.ts:192`<br>also: `sideQuestsLate.ts:511`, `sideQuestsLate.ts:544`, `npcs.ts:463`, `objects.ts:580`, `cards.ts:226` (+44 more) |  |

### 9b. Names (people, places, houses)

| # | Name as shown | What it is / meaning claimed | Where it appears | Source file:line | Reader's note |
|---|---|---|---|---|---|
| 1 | Jwaladesh | The realm | 26 places; first: Ch 12, Eightgate again | `data/dialogue/seatClaim.ts:737`<br>also: `sideQuests.ts:556`, `chapterLevels.ts:23`, `rpg.ts:861`, `npcs.ts:336`, `objects.ts:237` (+20 more) |  |
| 2 | Agnipur | The capital; city of fire (glossary) | 38 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:1181`<br>also: `sideQuestsLate.ts:445`, `sideQuestsLate.ts:459`, `sideQuestsLate.ts:463`, `voyages.ts:135`, `rpg.ts:299` (+32 more) |  |
| 3 | Agnivansh | The house; line of fire (glossary) | 57 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:163`<br>also: `sideQuests.ts:975`, `rpg.ts:319`, `rpg.ts:322`, `rpg.ts:553`, `rpg.ts:822` (+51 more) |  |
| 4 | Tejaswini | Founder of the Agnivansh | 7 places; first: Book page | `data/books.ts:1064`<br>also: `books.ts:1067`, `books.ts:1073`, `books.ts:1189`, `books.ts:1195`, `debates.ts:593` (+1 more) |  |
| 5 | Arjun | Name | 33 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:311`<br>also: `puzzles.ts:479`, `npcs.ts:445`, `npcs.ts:448`, `objects.ts:578`, `speakers.ts:346` (+27 more) |  |
| 6 | Meera | Name | 17 places; first: Ch 8, Jwaladesh (Agnipur) | `data/dialogue/jwaladesh.ts:906`<br>also: `sideQuestsLate.ts:459`, `rpg.ts:299`, `rpg.ts:322`, `npcs.ts:456`, `cards.ts:226` (+11 more) |  |
| 7 | Vikram | Party member | 37 places; first: Ch 11, Xaraguá again | `data/dialogue/xaraguaWar.ts:331`<br>also: `sideQuestsLate.ts:485`, `sideQuestsLate.ts:488`, `sideQuestsLate.ts:492`, `sideQuestsLate.ts:501`, `voyages.ts:137` (+31 more) |  |
| 8 | Dhanraj | Name | 20 places; first: Ch 8, Jwaladesh (Agnipur) | `data/dialogue/jwaladesh.ts:679`<br>also: `rpg.ts:312`, `npcs.ts:463`, `cards.ts:226`, `encounters.ts:708`, `encounters.ts:710` (+14 more) |  |

## 10. Questions Claude has

Nothing here was changed in the game; these are things that look inconsistent or uncertain, listed for the owner and the reader. Locations are `quest/src/` paths.

### Kreyòl and Taíno (Nov 18)

1. **Accent mismatch: *Kay Soley* vs *Solèy Heights*.** The house is written "Kay Soley" with no accent in all 17 visible places (for example `data/rpg.ts:62, 460, 474, 492, 696, 857`; `data/books.ts:84, 202, 694`; `data/dialogue/zetwal.ts:323`), while the Zetwal hill is "Solèy Heights" with the grave accent (`data/rpg.ts:708`, `data/objects.ts:864, 872`). Kreyòl *solèy* ("sun") has the accent, so "Kay Soley" may need *Kay Solèy*. Which is right, and should the house name change?
2. **Is *Pòdlimyè* right?** It is spelled the same way in every visible place (about 31, e.g. `data/rpg.ts:695`, `data/chapterLevels.ts:16`, `data/credits.ts:28`; plain `podlimye` appears only in internal ids). The open questions in `docs/quest/design/CAPITALS.md` line 36 and `STORY.md` section 6.1 stand: *Pòdlimyè* ("Port of Light") vs *Pò Limyè* vs *Pòt Limyè* ("Door of Light"); whether *pò* means "port" here; and whether *limyè* is the right word for "light".
3. **"Pran, pran. Pa gen dèt."** (`data/dialogue/zetwalQuests.ts:102, 108`; `data/rpg.ts:152, 626, 627`). Is it natural for a baker giving bread, and does "Take, take. No debt." match? The English gloss is shown only in the two dialogue lines; the shop greeting and item text show the Kreyòl with no English at all.
4. ***cherie* (no accent) in Kreyòl lines vs *chérie* (accent) in the French lines.** Kreyòl lines use "cherie" and "ti cheri" (`data/dialogue/zetwal.ts:547, 1709, 2198, 2280`); the French lines use "chérie" (`data/dialogue/aldoria.ts:353, 457, 528, 537`). Is "cherie / cheri" the right Kreyòl spelling, and is "Bonjou, ti cheri" ("little dear") natural from an older gardener to a young woman?
5. **"Mèsi! One <item>." is shown after every purchase in every shop in the game** (`ui/ShopPanel.ts:144`), so shopkeepers in Ardencia, Skarragol, Kuroshi and so on say a Kreyòl word with no English. The default shop greeting is also Kreyòl: "Bonjou! What will it be?" (`ui/ShopPanel.ts:57`). Is this acceptable, or should the Kreyòl be Zetwal-only? (Owner decision; flagged because it spreads one language over all eight lands.)
6. **Kreyòl food and market words with no English at all:** *pitit*, *Grann* (the cane cutter's grandmother), *sou* (coin), *Borlette* (the lottery), *Pwofesè* (a goat's name), *kasav*, *pikliz*, *akasan*, *Pwason fri* and *Marinad lanbi* (the last two have the dish named in English beside them). Are these right, and is the player left able to follow them? Is "Marinad lanbi" the right name for conch fritters?
7. **Skill names *Limyè Elodie* and *Limyè pou Tout* (`data/battles.ts:38, 66`).** The glosses shown are "Elodie's light heals one ally." and "Light for all: heals the whole party a little." Is *pou Tout* correct (and why capital T; should it be *pou tout moun*)?
8. **Three words for the same bread: *kasav* (Zetwal, and also said by Grandmother in Ardencia, `data/dialogue/ardencia.ts:96`), *casabe* (Xaraguá) and English "cassava".** Intended (two cultures, two words)? A fluent reader should confirm both spellings and that the item text "Kasav ... Cassava bread" is right.
9. **Unaccented *areito* in one place.** The book *The Four Hands* writes "The areito, their dance of memory" (`data/books.ts:116`); every other visible place writes *areíto*. The quest log and Xaraguá dialogue write *areíto* (nine other visible places), and `data/dialogue/xaragua.ts:1239` has a lowercase "areíto plaza" where the place name is otherwise "Areíto Plaza". Which spelling is right?
10. **Is *cacica* real?** Used for Yari as ruler (`data/dialogue/xaraguaWar.ts:564`, `data/dialogue/seatClaim.ts:567, 974, 1335`, `data/secretItems.ts:112`). *Cacique* is the recorded Taíno word; *cacica* is a Spanish-style feminine. Should it stay, and is the capital C in "Cacica Yari" a title?
11. **Taíno words used without any gloss shown:** *behique*, *batey*, *caney*, *duho*, *hamaca*, *hutia*, *ceiba*, *conuco* (only in internal ids), *opía*. In-text clues explain some (the book page explains *opía*; the quest log says "the caney" is a great house) but the player is never given a translation. Is that acceptable, and are they used correctly and respectfully (the *opía*, spirits of the dead, and the *areíto*, a ceremonial history, are the most sensitive)?
12. **The word *Guatiao* appears in six shop greetings with no gloss** (`data/rpg.ts:633, 634, 635, 640, 641, 642`) and with a gloss ("Friend!", "Friend.", "Friend, Yari.") in six dialogue lines (`data/dialogue/xaragua.ts:148, 1028, 1032, 1038`; `data/dialogue/xaraguaQuests.ts:106, 366`). Is "friend" the right gloss for the word as used by a shopkeeper greeting a customer? (It names a bond of ritual friendship in the glossary.)
13. **Yucayeque as both the capital's name and the Taíno word for a village; Yaguana as the people's name and a historical place.** Flagged for a source check in `docs/quest/design/CAPITALS.md` line 37. Also: is *Xaraguá* always accented in visible text? Yes (168 places); plain `xaragua` is internal ids and map files only.
14. **"Taíno" vs "Taino".** Visible text uses "Taíno" with the accent (`data/weapons.ts:64`); the glossary file is `taino.json` (no accent) with the title "Taíno (Xaraguá)". No visible mismatch.
15. **Kreyòl-looking name in a book about harbor trade:** "Papa Wout" runs the Carriage Guild (`data/books.ts:215`); *wout* is Kreyòl for "road". Intended, and is it spelled right?
16. **Names from the Kreyòl-flavoured name stones** (Dieudonné Lafortune, Odilon Philogène, Jean-Fils Beauvais, Rosalie Jeune, Fanfan Michel, Rose-Aimée, Odile; `data/dialogue/zetwal.ts:163-171, 2432-2582`): plausible Haitian names? (Spelling and accents only.)

### Other languages (bonus)

17. **Hindi capitalisation:** "Agni ki Shakti" (lowercase *ki*, `data/rpg.ts:555`) vs "Rakt Ki Pyaas" (capital *Ki*, `data/rpg.ts:556`); the glossary copies both. Pick one. Also is "Rakt Ki Pyaas" / "Ananta Yuddha" good Hindi (or *Anant Yuddh*)?
18. **Japanese romanisation:** *Yōkoso* and *Genzō* use macrons (`data/dialogue/kuroshi.ts:633`, `data/books.ts:849`) while the glossary has "Arigatou gozaimasu" (the *ou* style, not shown to the player) and *Irasshaimase*, *Konnichiwa* have no long marks. Pick one scheme. Also "Sasayaki Ha" (`data/battles.ts:155`) may want *Sasayaki no Ha* or *Sasayaki-ba*, and "Ayatsuri" and "Kagemimi" ("shadow-ear") should be confirmed as natural.
19. **Spanish accents on names:** *Tío* and *Alcázar* and *Ferrán* are accented, but *Joaquin* (`data/npcs.ts:516, 616, 624`; `data/cards.ts:220`), *Rodriguez* (`data/rpg.ts:203`; `data/books.ts:693`) and *Sebastian* (`data/rpg.ts:334`; `data/npcs.ts:501`) are not. Intentional (Anglicised family names) or missing accents (*Joaquín*, *Rodríguez*, *Sebastián*)?
20. **Aunt words:** four aunts are *Titi* (Caribbean Spanish: Kayla, Jordyn, Aiyana, Amanda) but Coralie is *Tati* ("Tati Coco", marked French in the glossary). Intended difference?
21. **Cendre vs Cenizal vs Ceniza.** The ford is spelled *Cendre* (French "ash", `data/books.ts:70, 399`, `data/dialogue/ardencia.ts:234, 300, 495, 498`) in a Spanish land whose town is *Cenizal* and whose bread is *Pan de ceniza*. Is *Cendre* meant to be French, or should it be a Spanish form?
22. **Spanish skill names** (*La Marca*, *Grito de Guerra*, *Reinado de Cenizas*, *Sangre Ardiente*, *La Promesa de Benny*) have the English shown only as a skill description, and "Benny's promise" appears in English in `engine/battle.ts:1484`. Are the Spanish names idiomatic (for example, is *La Marca* right for "the mark", and *Sangre Ardiente* for "burning blood")?
23. **Norse-looking names for Mongolian-flavoured clans:** *Ordvik* is described in `data/lang/norse.json` as "made up" (Old Norse *orð* + *vík*); *Ordu* is a Mongolian word in the glossary. A Norse reader should say whether *Ordvik* reads as real Norse; the glossary lists *Þökk* and *Lögsögumaðr* which are never shown to the player.
24. **Arabic:** *Tfaddal* is marked Levantine; is that right for Al-Doria? Is "Ahlan." glossed "Hello." appropriate for a stall greeting? Are *Majlis*, *Daftar al-Dorini*, *Baraka Dorini* and *The Sakk of Yusuf* used correctly (an Arabic noun with an Arabic-style family suffix)? Only transliteration is shown; no Arabic script.
25. **Mongolian:** *Khatun* and *Noyan* are used as titles; "Sain baina uu?" and "Bayarlalaa" need a fluency check (the second is rendered in one word with a double *a*).

### Gaps and housekeeping

26. **Glossary entries never shown to the player:** *Yalla*, *Habibti* (Arabic), *Arigatou gozaimasu* (Japanese), *Ordu* (Mongolian), *Þökk* and *Lögsögumaðr* (Norse), *Bohío* and *Conuco* (Taíno; *conuco* is only an internal id and a map file name, the player sees "Cassava gardens"). They can be left unchecked, or the glossary trimmed.
27. **Words shown but missing from every glossary** (so `npm run audit:lang` does not list them): Kreyòl *pitit*, *Grann*, *sou*, *Borlette*, *Pwofesè*, *kasav*, *pikliz*, *akasan*, *Pwason fri*, *Marinad lanbi*, *cherie*, *ti cheri*, *Limyè pou Tout*, *Limyè Elodie*, *Solèy*, *Zetwal*, *Kay Soley*, *Pòdlimyè*, *Papa Wout*; Taíno *cacica*, *ceiba*, *Yaguana*, *Guanín*, *Anaco*, *Caona*; Spanish *¡Firmes!*, *Grito de Guerra*, *Cendre*; Japanese *torii*; Arabic *tagine*, *souk*, *qanat*. This document is the full list.
28. **A placeholder line is still in the test village:** `data/dialogue.ts:83` shows "[Placeholder greeting in a local language]" with the gloss "Peace to you, traveller." Only the Phase 1 test village uses it; remove or replace before release.
29. **Places not scanned:** the Tiled map files (`quest/maps/*.tmj`) are not in `quest/src`; I did not search them for sign text. The in-game place names are in `quest/src/data/rpg.ts` and `quest/src/data/objects.ts` and are listed above. Docs outside `quest/src` (for example `docs/quest/intro/*.md`) repeat the same names and nothing new.


## Fixed before the check (Nov 13, Claude's call)

- The shops: "Bonjou!" and "Mèsi!" now appear only in Zetwal's shops; elsewhere a shop without its own greeting says "Welcome! What will it be?" and "Thank you! One ..." (`quest/src/ui/ShopPanel.ts`). Ardencia's four shops said "Bonjou!" before.
- "areito" in the book *The Four Hands* now has its accent, as everywhere else (`quest/src/data/books.ts`).
- The placeholder line (question 28) is in the test village's data only; no map of the quest places that keeper, so no player sees it. Left as is.

Everything else above waits for the readers: spellings and accents are theirs to settle, not Claude's.
