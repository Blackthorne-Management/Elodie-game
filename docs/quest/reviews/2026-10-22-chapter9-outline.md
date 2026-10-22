# Chapter 9, The Regent's Keep (Kingsmere, Aldermoor): build outline (Oct 22)

*Design outline only, for the second review and the build. No code has changed. Written under the Oct 20 rules:
only a decision that drastically changes the story's flow goes to the owner (section 12: none required; one
near-miss named); everything else is Claude's call with its reason. Sources: `PLAN-ALL-CHAPTERS.md` (Chapter 9 Nov
5 to 8, 35 minutes, levels 21 to 24; the Nov 8 decision date), the Opus plan review section 6 (the minimum for
Chapter 9: **Edmund, the archive, Thomas's record, the courtroom, the Hushed unmasked, the dissidents' price**; the
Clock and the other quests after the release; the debate as a required quest; two required side quests; placeholders
where art has not come), `design/STORY.md` Chapter 9, 1 (the two eras; Patricio in every capital), 4 (the threads:
the Seventh Clause's Chapter 9 row is Thomas's record; the four Ash Wars accounts, the Crown chronicle is the third;
the safehouses), 5 (tone: Edmund's apologies and tea; no jokes near Anissa) and 6.3 (settled: the Hushed is the
Regent's agent who has taken over the cells that hunt Anissa, whose members believe she is the head; unmasked in
the Regent's court; Rael, the true founder, is confessed only at the Hearing), 6.4 and 6.6 (the two Dec 1
proposals, treated here as Claude's calls: Patricio in Kingsmere under a flag of truce, where Thomas met him; the
ledger shows the gold vanishing into coded accounts that Haru reads only after the Harbor Turn) and 6.10 (Rosalind
as the Gen III ruler Edmund defies), `design/CAPITALS.md` 9 (Kingsmere: the Market Cross, the Rolls House, the
Regent's Keep, the Heath; the nine books and the five keep books; the `heath` table; the debate; the Court
Circular's "lady in grey"), `design/SIDE-QUESTS.md` Al-1 to Al-5, `design/PUZZLES.md` SIG-ALM (the archive's mirror
filing, then the courtroom's lying witness) and S-ALM, `design/COMBAT.md` 8 (Anissa can never be hit: Seize takes
Spark and Gianna steps in; Hush the Light lowers Calm by 2), 9.8 (Edmund), 13.2 (Husher, Moor Constable, Regent's
Sealbearer, Crown Musketeer, Crown Officer, Bog Hound, Zealot) and 13.3 (the Hushed: three phases, level 24),
`design/SECRET-ITEMS.md` 7 (the Patient Hour: after the release; its seed is Thomas's last line),
`design/FAMILY.md` (settled: **Jordyn**, Rahel's daughter by a Black military man, Azzy's Titi Jordyn, disciplined,
blunt, fair, an officer inside the Regent's guard who defects and opens the keep's postern, then leads a company in
Chapter 11; **Sebastian**, Elodie's brother, a world-renowned organist, proud, gentle, a showman, whose recital on the
cathedral's great organ covers the noise while the party breaks into the archive; both bumped into, both help, both
acted out; Tati Coco knows the family secret and keeps it; the betrayer is not revealed before the Muster),
`QUEST-BUILD-GUIDE.md` 5.2 (the Regent: calm, patient, three moves ahead; the Hushed; ordinary Stillwater people are
not villains), 5.3a (the Stillwater line: Agatha, Thomas, Rosalind, Edmund), 5.4 (Aldermoor's row: the dissidents want
Fear, price 8; "infiltrate the Regent's keep, find the Crown's pact with Rael, including a ledger of what he took
and where it really went"; the Crown's own record of the Seventh Clause), 5.6 (the betrayal is among Al-Doria,
Skarragol, Kuroshi and Jwaladesh: Aldermoor is not in it), 6.3 (the price rules), 7.1 and 7.2 (the Witness: law as an
oath; the Quiet Crown's "charity that creates debt" and "stealing voices"; the debate *Should the Throne have one
hand?*), 8 (formal and courtly English; the law-seal brooch); the **Chapter 5 outline** (the Regent names each of
them and does not speak to Anissa; young Thomas in the gallery: "I am writing that they were not. Someone will read it
one day"; the legate's aide "terribly sorry"; S-SEA is finishable only after Chapter 9); the **Chapter 7 outline and
its review** (the Husher as built there, with `hushed` as its status; the buyer's mark is a closed hand that nobody
has named the Quiet Crown's; the Crown's hand stays the Regent's until Chapter 9 joins them; the Ash Wars were about
twenty-five years ago); the **Chapter 8 outline** (section 14: continuity into this chapter; its review is in
progress, so its fixes are not yet known); the **Chapter 6 outline review** (3.1 the level plan, 3.9 who fights,
3.10 no joke beside Anissa); and the built game on branch `chapter3` (worktree `wt-ch3/quest` at commit 656cfa1,
Chapter 4 built, Chapter 5 being built: `data/quests.ts`, `data/battles.ts` (phases, `enter`, `hire`, `protects`,
`withdraws`, `seize`, `onSurge`, `endsWithBoss`, `meantToLose`, `finale`, `armored`), `data/encounters.ts`,
`data/rpg.ts` (fighters as data; the active four are the first four joined in `MEMBERS` order), `data/sideQuests.ts`,
`data/debates.ts`, `data/puzzles.ts`, `data/voyages.ts`, `engine/stage.ts` (`place`, `enter`, `walk`, `exit`, `face`,
`look`, `wait`, `sync`), `engine/game.ts` (only `anchor.*` flags carry back from the Echo; `onEcho` plays on a swap),
`tools/level-curve.ts`, `tools/chapter-starts.ts`, `config.ts` (`STATUS` has no `hushed`, no Calm and no Comfort; a
boss's `atkScale` scales ATK only, never MAG; `ENEMY_ROLE` has no `support`; `LEVELS.bands.trivial = 3`;
`BATTLE_ACTIVE 4`)). Levels use the game's curve (`xpBase 50, exponent 1.6`): 20 at 5,559, **21 at 6,034**, 22 at
6,526, 23 at 7,030, **24 at 7,547**, 25 at 8,082.*

**Sim-check.** The fights below were simulated with a scratch script outside the repo against the Chapter 6
outline's snapshot of commit 889ed60 (the same engine Chapters 6, 7 and 8 were checked on):
`/tmp/claude-0/-home-user/65f3c4a5-da26-5616-992a-6f5d1fe748a4/scratchpad/ch9sim/hushed-sim.ts` (Bayarmaa, Haru and
Vikram as the Chapter 6 to 8 outlines' entries, Edmund and the Aldermoor enemies as data in memory, each fight 30
seeds with the Chapter 6 bot, on the built Story difficulty). Numbers in section 5. Its first finding shapes the
boss: **in the built engine a caster boss's spells never scale** (`atkScale` touches ATK only), so the Hushed as
COMBAT writes her (9 / 1.1 on the caster line) cannot hurt a party of 21 to 24 at all (30 of 30 won, nobody down, at
any HP up to x10). She needs a `magScale` (one line) and the `hushed` status to be a fight.

**The rules this outline keeps:** every story moment is acted out on the map (owner rule, Oct 17); Anissa is never
hit, never a target of a blow, and never jokes; the comedy (Edmund's apologies and tea, Salkhi in the rain, Samira
pricing a court) stays away from her; recommendations only where they genuinely help; placeholders wherever art has
not arrived; this chapter gets the main story, the Echo puzzle, the boss, the companion, the ally's price, the
debate as a required quest, **two** required side quests, mystery quests and arrows, Game Over, and nothing else
until after the release. The realm-wide active-order flag (`party.active`, the Chapter 6 review's 3.9, required by
the Chapter 7 review's 3.10 and the Chapter 8 outline) is taken as built by Chapter 8; section 10 has the fallback.

---

## 1. Where the chapter starts (measured against the Chapter 8 outline, section 14)

- **Chapter 8 ends** on Agnipur's quay: the sea voyage `jwaladesh_aldermoor` north along the white coast from (37, 91)
  to Kingsmere at **(22, 62)**, captions "North, past the salt, along the white coast..." / "...to the moor, where the
  Crown keeps its books"; Salkhi loaded last. The card *Chapter 8 complete, The Dying Flame. Next: Chapter 9, The
  Regent's Keep* (`act8.complete`). `?chapter=9` starts on **the Mere Stair**, a fishermen's landing on the mere's
  shore below the city, at dawn, in rain (section 3, `aldermoor-heath`, spawn `mere_stair`): the Chapter 8 outline
  expected that "the Crown's capital will not let an envoy's ship in by the front", and the Zetwal trader says so
  before he leaves ("I'm not tying up under a Crown gun with your flag on my mast. The stair's dry at this tide.
  Mostly.").
- **The party on the route:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, **Vikram**, Anissa (eight, seven fighters,
  four active by `party.active`: Gianna, Yari, Azzy, Vikram after Chapter 8's swap, the order the player's since);
  Salkhi as a flag-placed horse on outdoor maps; **level 20 by the tool** (5,835 to 5,955 after Chapter 8's dials)
  and **about 22 as played** (section 5 says what this outline assumes and why). Echo party: Patricio, Caona, Benny.
  Gold about 2,000 to 3,000 less Agnipur's swordsmith and the strongbox if given.
- **Key items:** the Locket, the envoy's papers, *Benny's Refusal*, Benny's note, the Dorini pass, the Brasador coin,
  the Ironvow token, the Suzumori crane, the Agnivansh lamp, the Fog Files, the Fox's receipts, **Dhanraj's Ledger of
  Advances (`item.dhanraj_ledger`)**, Titi Kayla's crane, Titi Aiyana's mirror, the Crown's purse if kept. **Flags
  that matter here:** `clue.seventh_clause_read`, `belief.rael_traitor` (unchanged), `party.azzy` (Jordyn is his
  aunt), `party.vikram`, `party.active`, `ally.skarragol`, `ally.kuroshi`, `ally.jwaladesh` (the price pattern),
  `clue.buyers_mark` (a closed hand that nobody has named), `clue.crown_holds_oil` (every advance drawn on "the
  Throne's purchasing office, Kingsmere"), `clue.ardencia_outflows`, `clue.crown_pays_raiders`, `clue.fox_receipts`,
  `side.anonymous_oil.done` (the thumbprint count: with Z-5, X-2, Ar-1, A-3, S-3, K-3 and J-3, this chapter's Al-3 is
  the **eighth** safehouse, the design's "8 of 9"; the ninth is in Elodie's rooms at the Seat, Se-1, after the
  release), `choice.stay_away` (Chapter 1: "Stay away from her" to the veiled woman on the plaza; section 2, beat 7),
  `choice.dhanraj_spared|broken`, `side.seats.stage1` (the chamberlain holds three tokens; the dissidents give none,
  section 2 beat 8).
- **What the realm said about Aldermoor before now:** the Regent at the Parley (Chapter 5): named each of them before
  anyone introduced them, looked at Anissa for one breath and said nothing. The legate's aide, "terribly sorry", took
  Yari's petition through a crack in the door. Kaede (7): "The Crown is holding the oil." Meera (8): "The purse is in
  Kingsmere, under the Regent's keep, with everything else the Throne has bought this year." Aiyana (8): "Jordyn's in
  Kingsmere. In the Regent's guard. She'll be no use and no danger until she decides, and then she'll be both." The
  *Court Circular* (CAPITALS 9): a "lady in grey" at the Regent's table who is never named. Chapter 1: the recruiters
  and the veiled woman on the plaza speak of "the Hushed" as their leader.
- **What Gianna believes:** her father sold Xaraguá and them. The player holds Rael clues 1 (the signet), 2 (Elodie's
  two lines), 3 (the outflows), 4 (the coin), the "arrows missed" whisper, Kayla's "still himself", Aiyana's rod, and
  the "nobody dies" pattern (Grimvald, the Fox and Dhanraj withdrew). **This chapter gives the pact and the coded
  ledger, which Gianna reads as greed** (`STORY.md` 6.6: the only reading the chapter allows), the **eighth
  thumbprint** (Al-3: the purge list leaked on purpose, with the grey thumb on its cover note), and the fourth sister,
  the one who acts. It gives no new reading of Rael and must not: Jordyn's rule is in section 9.
- **Chapter 9's target is 21 to 24** (`chapterLevels.ts`). The boss is at 24; the Heath's groups at 23 to 24; the
  outfitter stocks tier-24 gear and the tier-20 pieces for a player who skipped Agnipur's.
- **Stale lines in the design, fixed here:** `CAPITALS.md` 9 gives the keep two sizes (32 x 24 in the table, "about
  40 x 30" in the seat paragraph): the larger is used, as Chapters 5 to 8 did; it has no cathedral, and
  `FAMILY.md`'s settled line puts Sebastian's recital "on Kingsmere cathedral's great organ": **St. Agatha's** is
  added, across the close from the keep (section 3); `CAPITALS.md`'s Rosalind's Townhouse is Al-5's map, after the
  release (Rosalind is at the keep in the main story); `SIDE-QUESTS.md` Al-2 step 2 puts an order about the Ash Wars
  chronicle in a fifty-year-old Echo, but the Ash Wars were about twenty-five years ago (the Chapter 7 review's 3.3):
  the note that the chronicle was written to order is Thomas's own, in the present, section 7.2; Al-3's "accept
  after the courtroom" is moved before it, so the dissidents' price is paid by the chapter and not by its ending
  (section 7.1); `COMBAT.md` 13.3's Hushed scaling is harmless in the engine (the sim: section 5); `COMBAT.md`'s Crown
  Officer is a `support` role the engine does not have (section 10); `STORY.md` 6.4's "to negotiate the peace" is
  refined to **the first revisiting** so the war council can hear of Benny's refusal in the same Echo (section 8;
  recorded for the Dec 1 list, not a pop-up).

---

## 2. The chapter, beat by beat, as it plays

Steps are walking presses, as in the Chapter 2 to 8 outlines. Flags are proposals in the built naming style. "Shown"
means walked and acted on the map with stage cues (`enter`, `walk`, `face`, `look`, `exit`, `place`, `sync`). It rains
on every outdoor map until the dawn of beat 8 (an `above` layer of rain, as Kirinoura had fog): the city's weather is
its register.

### Beat 0: The Mere Stair and the heath road (the voyage, then aldermoor-heath)

- The voyage `jwaladesh_aldermoor` (Chapter 8's; `night: false`). On the deck, one line each as the coast goes grey:
  Haru: "Everything about Kingsmere is written down. By Kingsmere." Vikram: "Then we argue... with the book."
  Bayarmaa: "Say less." Samira: "A court that keeps its own ledger. I may enjoy this." Anissa, at the rail, looking
  at the rain coming: "Gigi. It's the colour of the Regent's coat." Gianna: "It's rain, Nissa. He doesn't own it."
  (Earnest; the chapter's question, said once: what the Crown owns.)
- Lands at `aldermoor-heath`, spawn `mere_stair`. **`story.aldermoor_arrived`** is set on landing: the Heath's ambush
  layer switches on (`heath`, section 5). The Mere Stair: a stone stair up from the mere's shore, a fishermen's shed,
  nets, a **Crown notice post** at the stair's head, and the **heath road** east to the Moor Gate across heather and
  bog. The trader leaves (shown: the boat's look goes; "The stair's dry at this tide. Mostly. I'll be off the point
  four nights. After that I'm a Zetwal trader who has never heard of you.").
- **The city watched, before it is seen:** two **Moor Constables** are waiting at the stair's head (placed, in oilskins).
  No fight. The senior: "The Lord Regent is informed of every arrival. He asks that the envoy's household use the
  road, and not the heath. The heath is unsafe for guests." They fall in behind the party (walkers that follow to the
  Moor Gate and stop there; the owner's "shown": the escort is the watching). `story.escort_met`.
- **The notice post** (a readable object; the bump-in seeded cold, as the Chapter 8 outline asked): two bills under a
  tin hood. *THE ASSIZE OF KINGSMERE sits on the third day. The Lord Regent presides. The Crown's fleet sails after
  it.* And: *By command of the Lord Regent: SEBASTIAN LIMYÈ, organist to three courts, at the great organ of St.
  Agatha's, on the eve of the Assize. The Agatha Toccata. Admission by the Regent's leave.* Anissa reads the second
  (she can read; she reads it aloud, slowly, to the name): "Limyè. Gigi, that's our name." Gianna: "That's Mummy's
  brother. The one who writes to her about the weather." Azzy: "You have an uncle who plays for the Regent?" Gianna:
  "I have an uncle who plays for anyone with a big enough organ." (The only lightness near Anissa in the chapter, and
  it is Gianna's, about family; Salkhi is still on the boat.) `story.recital_seen`.
- The heath road: safe, as Ardencia's road and the salt road were; the bog off it is the ambush layer. A **milestone**
  (KINGSMERE 2), the **printing barn** off the road to the north with a grey **thumbprint** on its door (Al-3's
  safehouse; seen now, entered later), the **bog chapel** south of the road (a roofless Witness chapel in the bog;
  Al-3's cell: two veiled figures at its door, placed, who turn their backs as the party passes: "They don't look at
  you. They look at her." (Yari.) Nothing fights here yet). The **Moor Gate**: a gatehouse, a Sealbearer who reads the
  papers and does not give them back for a breath too long (the Chapter 5 beat, again, on purpose), then does.
  `story.moor_gate`.
- Journal: **The Mere Stair** (done `story.aldermoor_arrived`), **The road, not the heath** (done `story.moor_gate`).

### Beat 1: The Market Cross (aldermoor-cross, the hub; Edmund)

- Through the Moor Gate onto the **Market Cross**: a wet grey square round a stone cross, tea shops with steamed
  windows, the **pie shop**, the **jeweller**, the **outfitter**, the **contract board**, the **Rolls House** (the
  Crown's public library) on the east side, constables at every corner (placed; each has one line and none of them
  is unkind: "Mind the step, madam."), the **debate corner** by the cross (a Quiet Crown hierarch in a plain grey
  stole and a Gaze exile in a faded sun shawl, one passing line each), and at the square's head the **Regent's Keep**
  (a gatehouse, a yard, the great hall's doors) with **St. Agatha's** beside it, its west front on the square and a
  walled **close** between the two (its gate on the square, shut).
- **The lady in grey, seen:** as the party comes into the square a woman in grey with a covered basket crosses it from
  the keep's gate to the close's gate, two **veiled almswomen** behind her carrying bread (walkers; the close's gate
  opens for her and shuts). People step out of her way; a tea-shop door shuts as she passes; nobody takes the bread.
  Haru: "Everybody here steps aside for a woman with a basket." Samira: "Charity. In my experience the most expensive
  thing a city sells." (The *Court Circular*'s lady in grey, the Quiet Crown's "charity that creates debt", the
  Hushed: seen on the first map, named in none of them. `story.almoner_seen`.)
- **The press-gang, shown:** at the pie shop's door a **Crown sergeant** (a Crown Officer) and two constables have the
  pie-shop boy by the collar; the sergeant: "The Crown's fleet sails after the Assize, boy, and it sails with you in
  it. Sign or make your mark." The boy's mother in the doorway with flour on her hands. A young man in a good coat is
  crossing the square towards it at a walk, taking off his hat as he comes (`enter`, from the keep's side). He stops
  in front of the sergeant, hat in hand: **"I'm terribly sorry about this."** And hits him (a stage cue: the sergeant's
  walker is knocked back a tile and sits down in the wet; an audio slot). The constables close. **Edmund** turns to the
  party, who are the only people in the square not looking at their shoes: "You're the envoy's household. I'm
  Stillwater. Would you mind awfully?" The fight `press_gang_cross` (the sergeant at 22, two Moor Constables at 22;
  section 5) with **Edmund in it**: `party.edmund` and `party.active` are set at the hat ("would you mind awfully" is
  the join; section 9.1 has why he joins here as a fighter and defies the Regent later, where it costs him).
- **After, shown:** Edmund helps the sergeant up (walk, face), gives him back his hat, and says the chapter's running
  line for the first time: "Terribly sorry. I'll write." The constables: "Mr. Stillwater. Your mother..." Edmund:
  "Yes. I know. Send it to the house." They go (exit); nobody is arrested, because he is Lady Rosalind's son and
  everybody in the square knows it, and the boy goes back inside with his mother (walkers). Edmund to Gianna: "Edmund
  Stillwater. My mother sits on the Regent's council. I don't. I'm terribly sorry about the city; it used to be
  nicer, or we used to think so. Would you like some tea? You would. Everyone does, after the first hour." Then,
  because he is the chapter's guide to how Kingsmere works: "You'll be received. He receives everybody. Then you'll
  be watched. Then you'll be asked to leave. In between there's a very good library, and my old tutor, who prints
  things he oughtn't, out on the heath, and would like to meet anyone who hasn't been purged yet." (Al-3's seed.)
  `story.edmund_met`.
- One line to Anissa, no joke: he crouches to her height and holds out the hat: "Would you hold this for me? Hats
  get hit here. People don't, as a rule. Not in daylight." She holds it. (She keeps it, section 9.1.)
- Journal: **The Market Cross** (done `story.edmund_met`), then **The Regent's Keep** (beat 2).

### Beat 2: The Regent's Keep (aldermoor-keep, the seat of government; Jordyn's first sighting)

- **The keep:** a gatehouse and a wet yard; the **great hall** to the Regent's chair (a tall plain chair with no
  canopy: he holds the Throne elsewhere); the **council bench** along the hall's side (five councillors: **Lady
  Rosalind Stillwater** at its end, the Crown magistrate, the Regent's steward, a bishop of the Witness, the
  postmaster); the **clerk of the court's** desk; the **archive's** iron door off the hall (shut, a Sealbearer at it);
  the **courtroom's** doors (shut: "The Assize sits on the third day"); the **cells'** stair; the **clock tower**
  door (Al-4, inert: a readable object, "A rusted clock face over the door. The hands have not moved in anyone's
  memory. Nobody can say what hour they stopped at."); the **Almoner's office** (a door with a basket on a hook; shut);
  the **post office** (letters in Aldermoor violet; the postmaster is on the council so the office is empty); the
  door to the **close**; and the **watch's** station at the hall's door, where a tall Black woman in the Regent's
  violet with a captain's knot stands with her hands behind her back and her eyes on the middle distance: **Captain
  Jordyn** of the Regent's watch.
- **The bump-in, shown (the owner's rule for every family member):** the party comes in past her. **Azzy stops** (a
  beat), then: "Titi—" She, without moving her eyes: "Captain of the Regent's watch, sir. The envoy's household
  addresses the chamberlain." Azzy, floored, is walked on by Yari's hand on his arm (a `walk` cue). Anissa, quietly, to
  Gianna: "She looked at him, Gigi. Just for a second." (Earnest; the sisters' habit of seeing what people do, not
  what they say.) `story.jordyn_seen`.
- Staged: the chamberlain announces "the envoy of Zetwal and her household, spoken for by Ironvow, Suzumori and
  Agnivansh" (a walker down the hall). **The Lord Regent Aldric Vane** sits (he stood at Eightgate; here he is at home),
  grey, thin, a chain of office, and names the new ones before anyone introduces them, in order, calmly: "Haru
  Suzumori, whose grandmother's files I have paid for twice. Bayarmaa of the Ironvow, whose standard I am told was
  found. Vikram of the Flame, who is out of breath." Vikram: "Always." The Regent: "And Mr. Stillwater, who has hit a
  sergeant." Edmund: "I've written." He looks at Anissa for the length of one breath and says nothing to her (the
  Chapter 5 beat, kept exactly; Anissa's sprite steps half a tile behind Gianna). Behind his chair, with her basket,
  stands the **Almoner** (a readable look: "A lady in grey behind the Regent's chair. She has a basket of bread on her
  arm and the Regent has not eaten any.").
- **Gianna's ask**, as the envoy: "Zetwal asks to see the Crown's pact with Ardencia, which the Throne's purchasing
  office paid for in oil and horses and files," (Samira: "And at a very poor rate,") "and the Crown's own record of
  the Seventh Clause." The Regent: "Both exist. You may see neither. You may see the city, which is open; the Rolls
  House, which is public; and the Assize, where you will sit in the gallery and learn how the Crown is governed. And
  the recital. Your uncle plays very loud." (Three moves ahead: he knows whose brother is in his cathedral, and says
  so first.) Gianna: "The Seventh Clause says 'to be revisited'. Zetwal asks when." The Regent: "After the Assize. With
  a fleet. That is a revisiting." `story.regent_refused`. (The council's faces: Rosalind looks at Edmund; Edmund bows
  exactly: "Mother." "Edmund. You've hit someone." "A sergeant. I've written." Nothing more; the family is shown.)
- **Leaving, the line at the door:** as the party passes the watch's station, Jordyn, eyes front, to Azzy, low: "The
  close. After the evening bell. Don't bring the little one into the rain." (Fair: her first word to him is about the
  child.) `story.jordyn_line`.
- Journal: **The Regent's answer** (done `story.regent_refused`), **The close, after the bell** (beat 2b), then
  **The organ** (beat 3) and **Until the Toccata** (the gate, section 6).

### Beat 2b: The close, after the bell (aldermoor-keep's close, outdoor; Jordyn's offer)

- The **close**: a walled yard between the keep's north wall and St. Agatha's south wall, flagstones, a bell on a post
  (the evening bell: a dusk variant `story.close_dusk` is a condition, not a flag: `story.jordyn_line` and not
  `story.recital_begun`), the keep's **postern** (a small barred door in the keep's wall, a readable object: "Barred
  from inside."), the cathedral's **vestry door** opposite, and nobody, because the close is the watch's to patrol and
  tonight the watch is one person. Anissa waits inside the vestry door with Edmund ("I'll sit with her. I'm
  tremendously good at sitting.") and no joke follows: the owner's rule, kept by a door.
- **Jordyn, shown:** she comes through the postern (its look: unbarred, then barred again behind her) and stands in
  the rain with her hands behind her back as she stood in the hall. To Azzy first: "Azriel. You've got Mother's
  jaw. Don't lead with it." Then, blunt: "I know who you are. All three of you. Mother writes: Kayla writes to Mother,
  and Mother writes to everyone. I don't defect for family. I defect for law, and I have not decided." Gianna: "Then
  why are you in the rain?" Jordyn: "Because the law is not being kept, and I'm the one who keeps it." What she has
  seen (said plainly, once; section 9.2 has her rule): the Almoner's almswomen go out onto the heath at night and
  families come back without their voices; the watch arrests thieves and press-gangs' deserters and does not arrest
  the Regent's almoner; the Assize will sit in two days and try nobody for it; and the archive holds "a record a
  Stillwater hid, which the Crown says does not exist. I would like it to exist. I've read the public edition. It
  reads like a clean floor."
- **The offer:** "Tomorrow night the court is at your uncle's recital. The keep's watch is mine. This postern will be
  unbarred for the length of the loud piece and not a bar longer. If you are found, I did not unbar it, and I will
  arrest you myself, by the book, because the book is the only thing that keeps anyone alive in this building.
  Understood?" Gianna: "Understood." Jordyn: "And the little one does not come into the keep. Put her where four
  hundred people can see her. Nobody hushes anyone in front of four hundred people." `story.jordyn_offer`. She goes
  back through the postern (shown; barred).
- Azzy, after: "Four of them. Four of his sisters, and this one arrests people." Gianna: "She said she hasn't decided."
  Azzy: "She's in the rain." (Reads either way; tested the same as Chapter 8's line.)
- Journal: **The close, after the bell** (done `story.jordyn_offer`).

### Beat 3: The organ (aldermoor-cathedral; Sebastian's bump-in)

- **Heard before it is seen:** as the party crosses the square towards St. Agatha's west door, the organ sounds inside
  (an audio slot: a run of pipes, loud, stopped short, started again), and the pigeons go up off the cross (a
  flock as a walker group, four birds, the owner's rule for off-screen events used for an on-screen one that is only
  sound). The constable at the door: "Rehearsal, madam. Nobody goes in during the Toccata. Nobody—" The door opens
  from inside (shown).
- **St. Agatha's:** the Witness's great church of Kingsmere: a long nave of pews to the **oath-stone** (a plain block
  where the Assize's witnesses swear: a readable object), the **organ loft** up a stair with the great organ's pipes
  across the whole east wall (a 6 x 4 object), the **vestry** door to the close, the verger. And in the loft, at the
  console, a broad man in a velvet coat with his sleeves pushed up, who has stopped mid-phrase and turned round on
  the bench: **Sebastian**.
- **The bump-in, shown:** he comes down the loft stair at a run (`walk`, `run: true`), stops a tile short of Gianna,
  and looks at her for a beat before anything (face). "Gianna Elise. You have your mother's forehead and your
  grandfather's frown, and you have walked into my rehearsal, which nobody does, and I find I don't mind." He embraces
  her (a `walk` to the same tile and back: the engine's hug). Then he sees Anissa, and goes down on one knee on the
  wet flags (face): "And this is Anissa. Who hums. Your mother wrote that you hum. It is the only thing about either
  of you she has ever written to me that was not the weather." Anissa: "I don't hum." Sebastian: "You will. It's in
  the family. I'm your uncle Sebastian, and I am very loud, and I am told you are not, and we will get on."
  `story.sebastian_met`. (Gentle, proud, a showman: he says who he is to the whole nave.)
- **What he is doing here:** the Regent's guest for the season; the recital is by the Regent's command, on the eve of
  the Assize, "because he likes loud things done in order, and the Agatha Toccata, which I wrote, is the loudest thing
  ever written for pipes, and the most orderly." He does not know why the party has come and does not ask twice:
  Gianna tells him the postern's hour and nothing else. **His help, said plainly:** "Then I shall play the Toccata at
  that hour and not a bar sooner, and the slow movement after it, and if the Regent stands up before the end I shall
  start the Toccata again from the top. He won't. He asked for it." And, the thing the owner's line asks for (the
  organ covers the noise): "Nobody in this city will hear a door open while I am playing. Nobody will hear a cannon."
- **Anissa's place (Jordyn's condition, and the owner's rule that she holds the door):** Sebastian: "You'll sit in the
  loft with me and turn the pages. The loft is the one place in Kingsmere where four hundred people can see you and
  not one of them can reach you." That is where she is during beat 5: on the loft's bench, seen by the court, in
  Sebastian's keeping, with the vestry door below her as the party's way in and out. Her hints still reach Gianna in
  the Echo (the guide's rule). (Claude's call, section 12: the loft instead of the postern's foot.)
- **The one thing he says about Rael**, which reads either way and is the only time (section 9.3): "Your mother has
  written to me about the weather for twenty years. I have come to believe the weather in Zetwal is extremely
  interesting."
- Journal: **The organ** (done `story.sebastian_met`), then **Until the Toccata** (the gate, section 6, `followSide`).

### Beat 4: Until the Toccata (the required quests, any order; the arrow follows the ground)

- **Al-3 The Purge List** (Edmund's tutor at the printing barn; the bog chapel's cell; three families on the Cross:
  section 7.1), the **debate** *Should the Throne have one hand?* (the corner by the cross: section 7.3), the Rolls
  House's nine books (the Reason books, and the public edition of Thomas's record, which a reader compares later), the
  three vendors and the contract board.
- When Al-3 and the debate are done (and `story.sebastian_met`, `story.jordyn_offer`): **the eve of the Assize** (a
  condition `story.eve`): the square's lamps lit under the rain, the tea shops shut, and the **court walking to St.
  Agatha's** (walkers across the square from the keep's gate to the west door: the Regent, Rosalind and the council,
  the magistrate, the clerk, two Sealbearers, the Almoner last with her basket and her almswomen, who stop at the
  door and do not go in: "The almswomen do not sit. They stand at the door." The player who notices has the first
  tell: the Hushed's people are outside the church.) Sebastian at the west door with Anissa's hand: "Now, I think."
  `story.recital_begun` when the player speaks to him. Edmund: "It's my family's archive. I'm terribly sorry; I'm
  coming."

### Beat 5: The Toccata (aldormoor-cathedral, the close, aldermoor-keep by night; the Echo; SIG-ALM part 1)

- **The recital, shown:** the nave full (placed court, placed city: the pie-shop boy and his mother, the warned
  families, the constables off duty), Sebastian at the console with Anissa on the bench beside him (placed; a `look`
  cue up to the loft as the first chord lands: an audio slot, the Toccata, which plays on under everything until the
  archive door), the Regent in the front pew, not moving. The party goes out through the vestry (shown). In the close
  the rain is loud and the organ is louder; the postern's look is **unbarred** (`story.recital_begun`;
  `story.postern_open`); through it into the keep's night.
- **The keep by night (light stealth, built as data):** the hall dark but for the Sealbearers' lamps: two **Regent's
  Sealbearers** at their posts (the archive's stair and the hall's door), each with a **sightline** (a trigger strip on
  the tiles they face: stepping on it is "A Sealbearer turns his lamp this way. Back to the postern, quietly." and the
  party is returned to the postern: the Chapter 7 fog-return trigger, data; nothing fights, because the organ is the
  reason nothing is heard and a fight would be heard). The way round is by the pillars (the hall's dark side) to the
  archive's iron door, whose Sealbearer is at the recital ("the archive is sealed at the recital's bell": a sealed
  door is a locked one; Jordyn's unbarring covered the postern, not the archive). **Edmund opens it:** "It's the
  family's seal. I'm a Stillwater. I'm terribly sorry," and breaks the wax (shown; `story.archive_entered`). A `look`
  down the hall to the Sealbearer at the stair, who does not turn: the organ.
- **The archive (present):** a long room of **drawers by regnal year** (two walls, the years carved: 1 to 60 of the
  Old King, a readable rule at the door: "Filed by the year of the reign and the seal of the house the matter
  concerns"), each year with **two seals** on its drawer front (the Crown's violet; one house's colour), the **Ash
  Wars shelf** (Al-2), the **gallery** (a reading desk and a clerk's stool, Thomas's in the Echo), and behind the
  Brasador shelf a **panel that does not sit right** (a readable object: "A wainscot panel, loose at one corner.
  Nothing behind it that you can reach."). The pact is not under its year: every Ardencia drawer of the Accord's
  decade is empty ("Removed to the Lord Regent's keeping": a slip). **The cipher (SIG-ALM 1, section 8):** the
  Accord's year reversed in the regnal numbering, under the seal of the house the lie is about. The Echo tells the
  player the rule; the present tells the year.
- **The Echo: the first revisiting (the chapter's required Echo scene; the zone is the filing floor; `onEcho`,
  restartable until its flag is set).** Fifty years ago, a season after the sealing at Eightgate. Young **Patricio**
  (the player) in the archive's gallery under a flag of truce, kept waiting while the Crown's **war council** sits in
  the hall; **Benny** and **Caona** named ("Benny would not come under their roof. Caona is on the mere with the boat."),
  not drawn; a young clerk at the desk, filing: **Thomas Stillwater**, the boy from the Eightgate gallery, a season
  older. Through the hall door (ajar; a `look`), the council heard, not seen (lines from `''`, the owner's rule for
  off-screen events): "Ardencia refuses the seventh page. Aloud, in the Throne's own archive." / "And the Marshal
  signed it under protest of time." / "Then it is signed. 'To be revisited' means when we choose. The harbor is the
  Crown's whenever the Crown cares to go and fetch it." / "Clerk! The record of the seventh clause. Make it clean."
  (The Crown always meant to keep the harbor: shown fifty years early, in its own voice.) Thomas, to Patricio, not
  looking up, the system first (the joke the puzzle needs): "They file by the year of the reign and the seal of the
  house. And when they want a thing not found, they file it in the mirror: the year backwards, under the seal of the
  house the lie is about. We file lies in the mirror, Marshal. Everyone in this room knows it and nobody in this
  room will say it." Then the order reaches him (a Sealbearer in the old uniform, enter, a slip on the desk, exit):
  Thomas reads it and sits very still. "Make it clean." He takes a second sheet from under the first: "This is the
  true one. 'Xaraguá was never asked.' I wrote it in the Throne's gallery and I am not going to unwrite it. I can't
  be seen to touch that panel; I'm the clerk. You're an envoy. Envoys lean on things." Patricio (choice, both
  remembered, `choice.patricio_thomas`): "Give it here." / "You'll hang for this, boy." Thomas: "Then it's yours." /
  "No. I'll be very patient. We are good at it." **Patricio hides the true record behind the loose panel** (the
  Echo-era puzzle object; **anchor**, `anchor.thomas_record`: it is there in the present). Thomas, as the hall door
  opens for the Marshal: "The Crown's record will say what the Crown says. Mine will say what happened. Someone will
  read it one day." (The Chapter 5 line, paid.) `clue.first_revisiting` (the Journal note: "The Crown meant to keep the
  harbor from the day it signed. 'To be revisited' means when they choose.").
- **Back in the present:** the panel opens (the anchor; shown): **Thomas Stillwater's True Record**
  (`item.thomas_record`, key, a keep book after: the Seventh Clause in the Crown's words with the margin, in a clerk's
  hand, *Xaraguá was never asked. T.S.*, and the last line, *Written at a quarter to three, by the tower bell.*, which
  is Al-4's seed and goes in the item's text). Then the drawers: the present's Court Minutes (the Rolls House's *Court
  Circular*, or the archive's own *Court Minutes of the Ratification*, readable here) give the year: "ratified in the
  twenty-third year of the Old King"; **drawer 32, under the Brasador red**: *The Crown's Pact With Ardencia*
  (`item.crown_pact`) and *The Ash Road Accounts* (`item.ash_road_accounts`). Haru reads the first aloud (a walker to
  the desk): "'To the Lord of Ardencia, for his bloodline, the Throne at the Regent's pleasure; for his treasury,
  the harbor dues of Xaraguá for ten years; paid, the first year, in full.' Paid. In full. It's receipted." Gianna:
  "For a chair." The second: columns of figures leaving Ardencia's treasury into accounts marked only with a cipher
  and a road: *the Ash Road*. Haru: "A cipher. Not Kirinoura's, not the counting-house hand. I will need the key, and
  the key is not in this room." Samira: "Somebody who hides where money goes is stealing it or giving it away, and in
  my experience it is never the second." Gianna: "He took it and he spent it. That's all a ledger ever says." (`STORY.md`
  6.6 kept exactly: the gold vanishes into code; Gianna reads greed; Haru reads the code after the Harbor Turn.)
  `clue.crown_pact`, `clue.ash_road_accounts`.
- **The Ash Wars shelf (Al-2, section 7.2):** on the way to the panel (the panel is behind it), *The Crown Chronicle of
  the Ash Wars* with an old clerk's margin in the hand the player has just learned.
- Journal: **The postern** (done `story.archive_entered`), **The mirror file** (done `clue.crown_pact`), **Thomas's
  panel** (done `anchor.thomas_record`), then **Out, quietly** (beat 6).

### Beat 6: Caught (aldermoor-keep; Jordyn's arrest; the cells)

- Out of the archive, the hall's lamps come up all at once (a flag variant on the step through the door): the organ
  has stopped (the audio slot ends on the same step: the silence is the cue). At the hall's door, the **Almoner** with
  her basket and **four veiled almswomen** who are not carrying bread (placed); she was never at the recital. "Put the
  papers down, child. Quietly. The Regent would so much rather you had not read them, but he did think you would."
  (Three moves ahead: the pact was bait, and the envoy took it.) Gianna: "Who are you?" The Almoner: "The Crown's
  charities." The almswomen move (walkers, two tiles). Anissa is in the loft with four hundred people and her uncle;
  the Almoner's eyes go to the close's door anyway: "Where is the little one? Not in the rain, I hope."
- **Jordyn, shown:** the watch comes through the yard door at a run (`enter`, `run: true`: Jordyn and four of the
  watch), and she puts herself between the almswomen and the party with her hands behind her back. "Captain of the
  watch. The envoy's household is under arrest for the Crown's archive." A beat. "Under arrest, Almoner. Not under
  you." The Almoner: "The Regent's almoner does not answer to the watch." Jordyn: "No. But the Assize does, and
  they'll stand before it in the morning. Envoys are tried. They are not disappeared on the heath. Not on my watch,
  which this is." The standoff, held (a `wait`); the Almoner, with the register that never changes: "The Assize, then.
  The Regent will enjoy that." She goes (exit, the almswomen after her; the one who passes nearest turns her veiled
  head towards the close's door as she goes). `story.caught`.
- **The arrest, by the book:** Jordyn takes the papers "into the court's evidence" (shown: she holds out her hand;
  the three items go; the Journal keeps their notes, and the Quests page says *held by the court*: `evidence.*` flags
  mirror `item.*` until beat 7 gives them back). Edmund: "I'm terribly sorry, Captain." Jordyn: "Shut up, Mr.
  Stillwater." To Azzy, low, as the watch walks them to the cells' stair: "Mother's jaw. I said." (Fair; the law kept
  in front of the Regent's people, the family kept in a whisper.)
- **The cells (the keep's undercroft, a short scene; a save):** the party in one cell with a barred door and a lamp;
  the watch's constable outside, who is the sorry one ("I'm sorry about all this. I'm sorry about most things, lately.").
  Then **Sebastian and Anissa** at the bars (enter from the stair; Sebastian's coat over her head against the rain):
  "The Regent gave me leave. He said, 'I am not a monster, Mr. Limyè. I am a court.' I believe him about the second
  thing." Anissa goes into the cell with Gianna (the constable unlocks and locks: shown; she is where she must be for
  the morning). Sebastian, at the bars, to Gianna: "I played the slow movement twice. Nobody noticed. That is the
  worst review of my life." Then, not a showman for one line: "Whatever you took, it was worth the cathedral. I'll be
  in the gallery." (Exit.) Night (a fade; the dawn variant `story.assize_dawn` on waking).
- Journal: **Out, quietly** (done `story.caught`), **The Assize** (beat 7).

### Beat 7: The Assize (aldermoor-keep's courtroom; SIG-ALM part 2; the Hushed unmasked; the boss)

- **The courtroom:** the Regent's **bench** at the head (he presides: the design's "before the Regent"), the **clerk of
  the court's** table below it with the evidence on it (the three items as objects), the **council bench** (Rosalind
  at its end), the **Crown magistrate** prosecuting, the **witness stand** by the oath-stone's twin (a Witness's
  oath-block, the law as an oath), the **dock** with its rail (an **Echo Zone**: the dock's floor, walkable in both
  eras), the **gallery** with its stair (the city, placed: Sebastian in the front row, the pie-shop boy, the warned
  families, the printer, the clockmaker, the Gaze exile), two **Sealbearers** at the bench, **Jordyn** as officer of
  the court at the dock's gate with four of the watch, the **Almoner** on the witnesses' bench, and the party in the
  dock with Edmund and Anissa (Anissa on the dock's bench behind Gianna, which is what "the dock" is for: she is in
  the one place in the building everybody is looking at).
- **The charge** (the magistrate, a walker to the stand): "That the envoy of Zetwal and her household, by night, broke
  the Crown's archive and took from it papers of the Crown." The Regent: "The envoy will answer under the Witness. In
  this court a witness who swears falsely has broken an oath before the Witness, and her evidence falls with her, and
  she with it. The envoy may press any witness and lay any evidence. Begin." (The puzzle's rule, said once by the
  court it belongs to; the player presses statements and presents evidence from the Journal, PUZZLES.md's shape, as a
  dialogue tree in the built kind: section 8.)
- **Three witnesses:**
  1. **The keep's steward:** "The archive was sealed at the recital's bell. At the Toccata's end it was open and the
     envoy inside it with the seal broken." True. A player who presses it gets the Regent: "The envoy will come to
     the point. The steward is not lying; he is boring." (A press costs nothing; the puzzle never blocks.)
  2. **The Almoner:** "The paper the envoy calls a record is a forgery of her own hand. The Crown's true record of the
     seventh clause is the Rolls House's public edition, which every child in Kingsmere may read, and it shows that
     Xaraguá's cacique agreed the clause **in this very court**, before the Old King's justiciar, fifty years ago. The
     envoy's margin is a lie against the Crown and a lie against a dead clerk." The lie, with the two things that
     break it named inside it.
  3. **Jordyn:** "I found them at the panel behind the Brasador shelf, reading. The paper was in Thomas Stillwater's
     hand. I have seen that hand; it is on my commission." True, and the opening: the court's own officer has put the
     hand in evidence.
- **The Echo in the dock (information; no anchor):** stepping into the dock's zone shows **the ratification**: the same
  court fifty years ago, the Old King's **justiciar** on the bench, the roll called by the clerk of that day (lines):
  "Zetwal: present, by the Marshal's envoy." "Ardencia: present, and refusing." "Al-Doria: present." "Xaraguá: **not
  present. Not sent for.**" "The seventh clause is ratified." Young Patricio is not here (the Echo party stands in the
  dock as the Marshal's envoy of that day, which the roll names; Caona and Benny are the two lines). `clue.ratification`
  (the Journal: "Xaraguá was not in this court. The roll says so."). The swap back puts the player in the dock with
  the court waiting (the Regent: "The envoy was elsewhere for a moment. The court is patient.").
- **The exposure (the puzzle's solution):** press the Almoner's "in this very court" and lay **the dock's roll** (the
  clue) and **Thomas's True Record** (the evidence on the clerk's table, which the clerk hands up when asked: "It is in
  evidence, envoy. Ask for it."). Gianna: "The Crown's record was made clean on the night of the first revisiting, by
  order of this council. The clerk who was ordered to clean it hid the true one behind a panel at a quarter to three
  by that tower's bell, and the public edition is the clean one. Xaraguá was never asked. The roll of this court says
  it was never here." The clerk of the court compares the two hands (shown: a walk to the table, a beat): "It is
  Thomas Stillwater's. Both of them. The margin is older ink." **Rosalind stands** (shown): "A Stillwater wrote it. A
  Stillwater court will read it into the roll." The Regent, after a breath in which nothing moves: "Read it." (He
  loses nothing he values: the margin is a margin; the clause stands "to be revisited", and he is revisiting it with
  a fleet. Three moves ahead gives up a pawn.) The clerk reads the margin into the roll (a line). `story.record_read`;
  the puzzle's XP pays here.
- **The witness forsworn:** the Regent: "The witness is forsworn. The Assize thanks the Crown's almoner for her service
  to its charities, and dismisses her." Dismissed: the Regent's agent, spent and set down in one sentence, in front
  of the city, which is the whole of his method in a line. **She does not go.** She stands (face, to the dock), and
  the register she has kept since the square drops: **"Enough noise."** The almswomen come down the gallery stair with
  their veils up (walkers; the city's placed people flinch back a tile: a `sync`). Her face is still veiled. Anissa, on
  the dock's bench, not loud, the one line in the chapter that is hers to say (section 9.4): "Gigi. That's the lady
  from the plaza." The Almoner, to Anissa, which is the only time anyone in Kingsmere speaks to her: "You told your
  sister to say 'stay away from her'. She said it. I have been very patient." (If `choice.stay_away`; else: "Your
  sister has kept you very close. I have been very patient.") Gianna steps in front of the bench (a `walk`: the
  owner's rule, acted before the fight starts). `story.hushed_revealed`.
- **Jordyn's defiance, in deed:** the Sealbearers move for the dock; Jordyn's hand goes up and the watch's line steps
  across the bench's front (walkers): "The watch does not fight in a court. Nobody fights in a court." The Regent's
  chin lifts a fraction; he says nothing; he lets the court see (shown: he does not stand). The fight
  `assize_hushed`: the Hushed and two Hushers (two more from the gallery at her last phase); three phases; section 5.
- **The unmasking (phase 3's picture):** at a quarter of her strength the veil comes off (her look changes): a plain
  woman of sixty with grey hair pinned up, the Crown's charities' brooch at her throat, nobody. "You wanted a face.
  Here. It is nobody's. That is the point of a hand with no face." (The design's "the voice behind the veil".) Beaten,
  she falls (0 HP; she does not withdraw, because she has nowhere to go: the watch takes her up, shown).
- **After, on the map (the scripted Yield, as Dhanraj's):** the Almoner in the dock where the party stood, Jordyn's
  watch either side, the almswomen gone out through the gallery (the ones who were standing), the city on its feet.
  Three things in order:
  1. **The commission:** Jordyn takes a folded paper from the Almoner's sleeve and reads its head, once, flat: "'To
     the Crown's almoner, with the Regent's leave, the keeping of the quiet.' In the Regent's hand." The Regent: "The
     Crown keeps no almoner." (It is never provable; it is seen. The design's "the Quiet Crown has been bent to hunt
     Anissa by the Regent's people": the player has watched where she stood and who dismissed her.) `clue.hushed_regent`.
  2. **The Hushed's end** (a choice, both remembered): **"She swore falsely before the Witness. Try her for it, here,
     by your own law."** (`choice.hushed_tried`; +1 Influence at Aldermoor; Jordyn: "By the book."; she is held in the
     keep's cells; the Regent does not object, which is its own answer) / **"Let the city look at her face. All of it.
     Then take her down."** (Bayarmaa's line; `choice.hushed_broken`; +1 Fear; the Heath's Husher groups lose weight for
     the rest of the chapter: the cells have seen their head fall.) Nobody kills her. She names Rael in neither (she
     does not know him: "I was given the cells. I was never told by whom they were made. Nobody is.").
  3. **The Regent's ruling:** "The charge against the envoy is withdrawn. The Crown does not try its guests in a court
     that has been... interrupted. The envoy's household will leave Kingsmere by the morning tide. The fleet sails
     after it." Then, to Edmund: "Mr. Stillwater will remain in his mother's house." **Edmund** (the defiance, where it
     costs him): "I'm terribly sorry, my lord. I'm going with them." The Regent: "Your mother sits on my council."
     **Rosalind**, still standing: "Sat." (`story.rosalind_withdrew`: Al-5's outcome, folded into the main story; she
     attends the Hearing.) `story.edmund_defied`. **Jordyn** unpins her captain's knot and lays it on the clerk's table
     (shown): "Captain of the watch, resigning. The watch is dismissed." Six of the watch step out of their line and
     stand behind her (walkers). The Regent: "You will hang, Captain." Jordyn: "Then try me. I'll stand in that dock.
     It is the only honest place in this building." `story.jordyn_defected`.
- Journal: **The Assize** (done `story.record_read`), **The Hushed** (done `story.hushed_beaten`), **The price**
  (beat 8).

### Beat 8: The price (aldermoor-heath at dawn: the dissidents, Jordyn's company, the quay)

- **Dawn on the Mere Stair** (the rain stopped: the `above` layer off on `story.hushed_beaten`; the first dry map of
  the chapter), the Zetwal trader back at the stair ("Four nights. You said four. It's been two and a half and the
  whole city's awake."). Down the heath road from the Moor Gate, **the dissidents come** (walkers in a line: the
  printer with an inked apron, the clockmaker, the sorry constable without his coat, the three warned families, the
  pie-shop boy and his mother, the Gaze exile; then Jordyn with six of the watch, their violet turned inside out).
  Sebastian last, in his velvet coat, not hurrying.
- **The price (Fear 8; the realm economy as built: flags and Journal notes, as Chapters 3, 6, 7 and 8):** the printer:
  "We don't want gold and we don't want a speech. We want the almswomen afraid to come to our doors. Count what you've
  done to make them so." The scene reads **Aldermoor's Fear** (the Hushed beaten: +1, the boss rule; Al-3's +3; the
  court's Break if chosen, +1; the Heath's wins by the six-win rule; a Break at any Yield) and pays, in order:
  - **the Hushed's fall in open court** ("Every cell in the realm will hear that the head they knelt to fell in a
    Stillwater court in front of the city." → +2 Fear at Aldermoor, always: the chapter's Fear is the court);
  - **Jordyn's company** ("Seven of the Regent's own watch, in front of the Regent." → +1 Fear, always;
    `army.aldermoor` 7 plus "whoever the barn can arm", the pledge the Muster collects);
  - **the purge list, published** (if Al-3 is done, which the gate guarantees: the printer has set it in type overnight:
    "Every name on it, and the thumb on its cover. By noon it's on every door in the Cross." → +1 Fear);
  - **Edmund** (Rosalind's son, leaving with the envoy: "The council's own boy." → +1 Influence, not Fear; the
    dissidents are the Crown's own people, and his going is a thing the Crown reads).
  So the player leaves with Aldermoor's Fear between about 6 and 10 of 8; a player who broke the Almoner and the
  Heath's cells pays it in full here. **`ally.aldermoor_dissidents`** is set regardless (the alliance is made; the
  shortfall is a debt the Muster collects), with the Journal note *The Stillwater dissidents*: "Price: Fear 8. Yours
  here: N. They are the Crown's own people: no chair at Eightgate, no token for the chamberlain, and the hardest feud
  to seat at the Muster." (No betrayal line: Aldermoor is not among the four the Crown can buy, guide 5.6, and the note
  says so in its own way; the Chapter 8 outline asked this chapter to say the dissidents give no token.)
- **Jordyn's going (Chapter 10's door):** "I'm not sailing with you. A company walks; it doesn't sit in a trader's
  hold. Seven of the watch and the barn's lot, by the moor road to the coast and a ship I'll find. We'll be at your
  Muster." Azzy: "Titi—" Jordyn: "And I'll bring Mother. And her mother. Don't ask from where; you'd only write it
  down." (FAMILY.md: Rahel and Patricia arrive at the Muster with Jordyn's company.) To Gianna, the one line about
  him, section 9.2: "He wrote to me once in twenty years. One line: 'Keep the law.' I have." (Reads either way;
  tested.) To Anissa, no joke, crouching as Edmund did: "You said 'that's the lady from the plaza' in a court full
  of people who wanted you quiet. That's the bravest thing I've seen in that building. Don't do it again without me
  there." She goes up the road with her seven (exit, the walkers after).
- **Sebastian's going:** he stays in Kingsmere ("I have a recital at Eightgate in a month, by the Regent's command,
  which he gave before he knew what I was. I am going to play it, very loud, and then I am coming to Pòdlimyè to hear
  the drums, which I have never done, because I was always somewhere being famous.") One line to Anissa, no joke:
  "You turned every page on the beat. Every one. I've had three courts' pages turned and none of them on the beat."
  She: "I counted." (She keeps the recital bill, section 9.3.)
- **The clockmaker's seed (Al-4, after the release):** one line as the party boards: "That record says a quarter to
  three, by the tower bell. The tower clock stopped the night it was written. I'd give a year to know the hour." (The
  tower door is inert; the Patient Hour is Chapter 9's post-release item.)
- **South:** the Zetwal trader takes them **home**: the sea voyage `aldermoor_zetwal` from the mere's mouth south
  along the west coast and east along the realm's south to Pòdlimyè (22, 62 to 91, 37; captions "Out of the mere,
  down the grey coast..." / "...and east, by every shore that spoke for us, home to Zetwal"). Salkhi is loaded last
  ("Rain. I was promised grass in four countries and I have been given rain. I am going home to a horse-fair that is
  not mine."). Edmund on the deck: "I've never been south. Is it warm? It is, isn't it. I've packed tea."
- Card: *Chapter 9 complete, The Regent's Keep. Next: Chapter 10, The Muster.* `act9.complete`. `?chapter=10` starts
  on Pòdlimyè's long pier (the Cane Road's ambushes switch on with the built `story.zetwal_return`).
- Journal: **The price** (done `ally.aldermoor_dissidents`), **Home** (done `act9.complete`; pays no XP: a card).

---

## 3. The maps (five, drawn in code like Cenizal, Ordvik, Kirinoura and Agnipur: `tools/maps/aldermoor.ts` through `painter.ts`)

Registered in `data/maps.ts` and `CITIES` (`data/rpg.ts`, city id `aldermoor`, name Kingsmere, house Stillwater). The
look: grey-blue stone, slate roofs, wet flags, violet only on the Crown's people and the keep's door, heather and
black bog beyond the wall, the mere a flat grey sheet to the west; rain on every outdoor map until the last dawn.
Accent `#2e86c1` (CAPITALS). Tiles for the tool: `WETFLAG`, `SLATE`, `HEATHER`, `BOG` (impassable off the road except
the ambush pans), `MERE`, `STAIR`, `CLOSEWALL`, `PEW`, `DRAWER` (object: six cabinets, each with a year dial and a seal
switch as flags with values), `PANEL` (object, two looks: loose, open), `POSTERN` (object, two looks: barred,
unbarred), `DOCK` (the rail; the dock's floor is the zone), `ORGAN` (a 6 x 4 object), `RAIN` (an `above` layer, as
Kirinoura's fog), `NOTICE` (object), `OATHSTONE` (object).

| Map | Size (tiles) | Section | Echo | What is on it |
|---|---|---|---|---|
| `aldermoor-heath` | 46 x 28 | The Heath (wild, outdoor; the Mere Stair at its west edge) | none | The Mere Stair and the fishermen's shed (the landing, the trader's boat by flag, the voyage trigger after `ally.aldermoor_dissidents`), the notice post (the two bills), the heath road east to the Moor Gate (safe), the milestone, the bog and heather off the road (the ambush layer, `heath`), the printing barn north of the road (Al-3's safehouse; the thumbprint on its door), the bog chapel south of it (Al-3's cell; the fight), the Moor Gate and its Sealbearer, the escort pair (walkers to the gate), the dawn variant (the dissidents' line, Jordyn's company, Sebastian) |
| `aldermoor-cross` | 42 x 30 | The Market Cross (hub, outdoor) | none | The cross and the debate corner, the pie shop, the jeweller, the outfitter, the contract board, the tea shops (doors with one line each), the Rolls House door (east), the keep's gatehouse (north centre), St. Agatha's west door (north west) and the close's gate between them, constables at the corners, the almswomen's walk (the lady in grey crosses on `story.almoner_seen` not set), the press-gang at the pie shop (the fight's trigger), the three warned families' doors (Al-3), the eve variant (lamps, the court's walk to the church), Salkhi's placements |
| `aldermoor-rolls` | 22 x 14 | The Rolls House (library, interior) | none | The nine books on the Crown's shelves, the keeper of the rolls (formal English), the public edition of Thomas's record on a lectern (readable twice: before and after the panel, with a different line the second time) |
| `aldermoor-keep` | 40 x 30 | The Regent's Keep (the seat of government, interior, with the close as an outdoor pocket on its north side) | **the archive's filing floor** (one zone: the first revisiting; anchor: the panel); **the dock's floor** (one zone: the ratification; no anchor) | The gatehouse and yard, the great hall (the Regent's chair, the council bench, the clerk's desk, the watch's station, the Sealbearers' posts and sightline strips by night), the archive (six cabinets, the Ash Wars shelf, the Brasador shelf and the panel, the gallery desk with the minutes), the courtroom (the bench, the clerk's table with the evidence, the witness stand and the oath-block, the dock, the gallery and its stair; the boss arena), the cells (the undercroft; a save), the clock tower door (inert), the Almoner's office (shut), the post office, the close (the bell post, the postern, the vestry door) |
| `aldermoor-cathedral` | 26 x 18 | St. Agatha's (interior) | none | The nave and pews (the recital's placed court and city), the oath-stone, the organ loft and its stair (Sebastian; Anissa's bench during the Toccata), the vestry door to the close, the verger, the west door's constable |

Five maps: CAPITALS' five with **Rosalind's Townhouse** (Al-5's, after the release) replaced by **St. Agatha's**
(the settled Sebastian line needs a cathedral with a great organ, and the postern needs a close to open onto). The
keep is 40 x 30, the seat paragraph's size. **Outdoor areas, buildings aside: six** (the Mere Stair, the heath road,
the bog, the Market Cross, the close, the keep's yard), the owner's rule. The seat is central (the keep at the head
of the square), large (a hall, an archive, a courtroom, cells, a tower, offices), staffed (the chamberlain, the
steward, the clerk of the court, the magistrate, the postmaster, the watch, the Sealbearers), and full of people who
disagree (a council with Rosalind on it, a watch captain who keeps a law the Regent bends, an almoner who answers to
nobody, a Crown that receives everybody and shows nothing). The market is a wet square of tea shops and a pie shop
(nothing like a plaza, a souk, a fair, a lantern bazaar or a brass lane). The validator's rules hold: every zone tile
walkable in both eras (the filing floor; the dock's floor); no NPC or door inside a zone (the archive's cabinets and
the dock's rail sit on the zones' edges); the one anchor is an Echo-era puzzle object (the panel) whose dialogue sets
`anchor.thomas_record`, read by the present panel.

**Drawn placeholders** (code, through `assets.config.ts`): a cabinet as a 2 x 2 object with a dial look per decade
and a seal look per colour; the panel 1 x 2 with two looks; the postern 1 x 2 with two looks; the organ 6 x 4; a
pew row; the dock's rail; the notice post with two bills; the oath-stone; rain as four `above` tiles cycling; a
violet recolour of the Chapter 5 clerk's shape for the keep's people, a grey one for the almswomen, a Crown
Marine recolour in oilskins for the constables.

---

## 4. The Echo and the fights: what the engine has and what this chapter uses

- **The Echo party** is Patricio, Caona and Benny, as data; the field draws only Gianna's sprite in the Echo, so the
  first revisiting is staged with Thomas, the old-uniform Sealbearer and the council's voices (lines from `''` through
  the ajar door) as Echo-era NPCs, walkers and text, and the panel as the Echo-era puzzle object. Caona and Benny are
  one line each, not drawn. The dock's Echo is lines only (the roll). No new system.
- **No Echo battle.** The first revisiting is a flag of truce in an archive, and the ratification is a roll call; a
  battle would contradict both. The Echo-battle foundation is kept for Chapter 11's harbor (the Chapter 5, 6, 7 and 8
  outlines' call, again).
- **The present's fights** use what Chapters 3 to 8 built: enemies as data with `moves`, `every`, `tell`, `area`,
  `magic`, `statuses`, `hire`, `protects`, `withdraws`, `armored`; battles with `phases` (`below`, `onSurge`, `enter`),
  `rewards`, `endsWithBoss`. There is no `hushed` status unless Chapter 7 built it, no Calm, no Comfort, no boss MAG
  scale and no `support` role (section 10 has each, with its fallback). Everything below is written to those shapes.
- **Edmund as a fighter** is a `MemberDef` in `rpg.ts` plus `SKILLS.edmund` and `MOVES.edmund` in `battles.ts` and a
  placeholder look (section 9.1); `joins: { flag: 'party.edmund' }`. Three of his five skills need small engine pieces
  (section 10); the other two are data.
- **Who fights.** With Edmund the party has **eight** fighters and `BATTLE_ACTIVE` is 4. By the realm-wide
  active-order flag (`party.active`, assumed built by Chapter 8), Edmund replaces the fourth at the hat (beat 1) and
  the order is the player's afterwards. The sim ran him active with Azzy, active with Vikram (Azzy benched), and
  benched: the fight is won in all three, and **it is won faster with him benched** (section 5), because the sim has
  no `hushed`, which is the status his kit answers; the real fight is his.

---

## 5. The chapter's fights and levels

**Enemies (new data, `COMBAT.md` 13.2 and 13.3, in the engine's shapes):**

| Enemy | Role | Level | Moves | Note |
|---|---|---|---|---|
| **Husher** (Chapter 7's `husher`, reused) | caster, resists light | 23 | Whisper 90 `magic`; **Hush** 120 `magic`, `hushed` (fallback `weakened`), every 3, tell "The Husher lifts a finger to the veil..."; **Seize** `seize: 3`, `marked` on Gianna 2 turns, every 4, tell "The Husher is looking past you. At her." | as Chapter 7 built it; the Aldermoor tier's palette |
| **Moor Constable** (`moor_constable`) | tank, `bribable` | 22 to 24 | Truncheon 100; **Arrest** 80, `stunned` 50%, every 3, tell "The constable unhooks the irons from his belt..."; **Whistle** `hire: 'moor_constable'`, once (the Lookout's built shape) | polite in the field: his tells say "sorry" |
| **Bog Hound** (`bog_hound`) | brute, weak to fire | 22 to 24 | Bite 110; Drag 140, every 3, tell "The hound lowers its head and digs its paws into the peat..." | COMBAT's Track (always acts after the party's fastest) has no engine support: cut; a high SPD on the brute line stands in |
| **Crown Musketeer** (built, `crown_musketeer`, recoloured) | caster (ranged) | 23 to 24 | as built: Volley every 2 | the Chapter 2 breastplate variant where a group needs a wall |
| **Crown Officer** (`crown_officer`; the press-gang's sergeant) | the role Chapter 2 gave its marine lieutenant (`support` is not in `ENEMY_ROLE`) | 22 to 24 | Sabre 100; **Rally** `ally`, `inspired`, every 3, tell "The officer raises his sabre: 'Steady!'" | COMBAT's Order (an ally acts now) has no engine support: cut |
| **Regent's Sealbearer** (`sealbearer`) | caster, `armored` | 23 to 24 | **Writ** 100 `magic`, `weakened` 60%; **Seal** 130 `magic`, `hushed` (fallback `weakened`), every 3, tell "The Sealbearer lifts the Throne's seal..." | the Heath only, in this chapter; in the keep and the court they are staged, never fought (the Regent's guard does not fight in a court) |
| **Quiet Crown Zealot** (built, `qc_zealot`) | caster | 22 to 23 | as built | "The little one glows, they say. Even in the rain." |
| **The Hushed** (`the_hushed`) | caster, `boss`, resists light | **24** | section below | the Regent's almoner; the head the cells kneel to |

**The Hushed, three phases, sim-checked:** level 24, `hpScale 7`, **`magScale 2`** (section 10: one line in
`enemyStats`; her blows are spells, and without it a caster boss at any HP cannot hurt a party of 21 to 24: the
first table below), `atkScale 1` (irrelevant: she never strikes). COMBAT's 9 / 1.1 is 9 x 0.8 on the caster line's HP
and ATK x1.1 on a stat she does not use.

1. **Silence:** *Whisper* 100 `magic`; ***Hush*** 120 `magic`, `area`, `hushed` at 50% (the party's skills go dark two
   turns at a time: no heals, no Shield Wall, no Surge spell; Attack, Guard and Item work), every 3, tell "The grey
   veil tilts. The court goes quiet, all at once..." Two **Hushers** at her side from the start (COMBAT's "Hushers").
   Anissa's opening tip: "She takes your words, Gigi. Plain blows and your light still work. Edmund, hold them."
2. **Hush the Light** (`below: 0.6`): "Enough noise."; moves *Veil* 130 `magic` and ***Hush the Light*** (`power 0`,
   `calm: -2`, every 2, tell "She is not looking at the dock. She is looking at the little one."): the owner's
   redesign (COMBAT 8): a whisper at Anissa, Calm -2; at 0 she goes quiet and Surge waits for Comfort (section 10:
   Calm and Comfort are not built; the fallback is the built `seize` with this tell, which the sim used: 3 Spark torn,
   Gianna Marked). Shown: the Hushed turns toward the bench and Gianna moves in front. **Anissa is never hit.**
3. **Unmasked** (`below: 0.25`): "You wanted a face. Here."; the veil comes off (a second look on the enemy);
   `enter: ['husher', 'husher']` at 23, `enterText` "Two more veils come down the gallery stair."; moves *Bare Voice*
   140 `magic` and ***Quiet Crown*** 150 `magic`, `area`, `weakened` and `calm: -1`, every 2, tell "Her bare voice
   fills the court: 'One hand. One voice. Quiet.' Guard, everyone!" (COMBAT's Quiet Crown: Weakened all, Calm -1.)
4. At 0 HP she falls (no `withdraws`: the watch takes her up); `endsWithBoss`: a standing Husher goes out through
   the gallery as she falls. Game Over applies (not meant to lose); the way back in is the courtroom's doors, with
   the exposure already read into the roll (`story.record_read` holds; the scene restarts at "Enough noise").

| Scaling tried (Gianna, Yari, Azzy, Edmund; 30 seeds; Story difficulty; `hushed` as `stunned` at 50%, the harsher stand-in; Hush the Light as `seize`) | Party 21 | Party 22 | Party 23 | Party 24 |
|---|---|---|---|---|
| hp x7, MAG x1 (the engine as built: no MAG scale) | 30/30 won, 34 actions, 0 down, 55% HP left | 30/30, 33, 0, 54% | 30/30, 31, 0, 59% | 30/30, 29, 0, 62% |
| hp x7, MAG x1.5 | 30/30, 33, 0.03, 58% | 30/30, 33, 0, 59% | 30/30, 31, 0, 55% | 30/30, 30, 0, 59% |
| **hp x7, MAG x2 (chosen)** | **28/30, 32, 0.70, 56%** | **30/30, 31, 0.20, 53%** | **30/30, 30, 0.07, 57%** | **30/30, 28, 0, 62%** |
| hp x8, MAG x2 | 25/30, 35, 1.00, 58% | 30/30, 33, 0.17, 62% | 29/30, 32, 0.27, 60% | 30/30, 31, 0.03, 60% |
| hp x7, MAG x2.5 | 19/30, 31, 1.77, 50% | 19/30, 29, 1.87, 46% | 26/30, 28, 0.87, 65% | 29/30, 27, 0.30, 72% |
| hp x8, MAG x2.5 | 16/30, 33, 2.23, 37% | 18/30, 31, 2.17, 36% | 24/30, 30, 1.20, 54% | 26/30, 29, 0.93, 57% |
| hp x7, MAG x2, `hushed` as `weakened` (the softer stand-in) | 29/30, 34, 0.40, 61% | 30/30, 33, 0.10, 58% | 30/30, 31, 0.03, 60% | 30/30, 29, 0.03, 62% |
| hp x7, MAG x2, Vikram and Edmund active, Azzy benched | 28/30, 30, 0.40, 56% | 30/30, 30, 0.17, 59% | 30/30, 28, 0.10, 57% | 30/30, 27, 0, 56% |
| hp x7, MAG x2, Edmund benched | 28/30, 29, 0.33, 60% | 30/30, 27, 0.07, 57% | 30/30, 25, 0.07, 52% | 30/30, 24, 0, 65% |

So **x7 / MAG x2** gives a boss of about 30 party actions at 22 to 23 (eight of Gianna's turns, four veils on the
field for most of it), a fighter down in one fight in five at the band's floor and none at its top, where Grimvald
sat at 29, the Fox at 26 and Dhanraj at 39: the right length for a fight whose trick is silence, not a wall. MAG
x2.5 is a wall at 21 to 22 (19 of 30) and is not it. **The real `hushed` (two turns without skills, on two members
at a time) is between the two stand-ins and is what the fight is about: the simulator with the built status decides
on day 1 whether x7 holds or drops to x6**, and whether Edmund active beats Edmund benched, which it must (the sim's
Edmund has no Long Watch and a Shield Wall that is `warded`; section 10). Nobody down at 24 in any seed at x7.

**The other fights:**

| Fight | Where | Foes | Level | Party then | Pays (data) |
|---|---|---|---|---|---|
| Ambushes (`heath`, from `story.aldermoor_arrived`) | the bog off the heath road | Moor Constable + Bog Hound x2 (23); Husher x2 + Zealot (23; weight 1 after `choice.hushed_broken`); Crown Musketeer x2 + Crown Officer (24); Sealbearer + Musketeer + Constable (24) | 23 to 24 | 21 to 24 | the encounter rule, tapered (below) |
| **The press-gang** (`press_gang_cross`) | the pie shop's door | Crown Officer 22 + Moor Constable x2 at 22, with Edmund | 22 | 21 to 22 | 40 XP, 100 gold (data); the sergeant is `bribable` for a Samira who would rather pay than hit (Edmund: "I'd really rather hit him. I've already written.") |
| **The bog chapel** (`bog_chapel_cell`, Al-3) | the bog chapel | Husher x2 + Zealot + Bog Hound at 23 | 23 | 21 to 23 | 60 XP, 150 gold (data) |
| **The Hushed** (`assize_hushed`) | the courtroom | the Hushed 24 + Husher x2 at 23 (two more at 25%) | 24 | 22 to 24 | **120 XP, 400 gold**, items: the Almoner's commission (a Journal note, not a key item), her brooch (a charm, level 24: *the Crown's charity*, Calm cannot fall below 1 while worn; or def 4, mag 4 if Calm is not built) |

Sim-check of the ambushes (same bot): **two-foe groups are trivial at this party** (two Hushers at 23: 6 actions,
94% HP left; a Sealbearer and a Musketeer at 23: 6 actions, 98%; two Zealots at 22: 5 actions, 97%), so the Heath's
groups are **trios at 23 to 24**: two Hushers and a Zealot at 23, 8 actions, 91%; two Musketeers and an Officer at
24, 9 actions, 98%; a Constable and two Hounds at 23, 12 to 13 actions, 89 to 91%; a Sealbearer, a Musketeer and a
Constable at 24, 10 actions, 95%; the bog chapel's four at 23 (Al-3), 12 to 14 actions, 81 to 86%, nobody down; the
press-gang's three at 22, 11 actions, 95%. The party at 22 is strong (Azzy 217 HP, Edmund 221 HP and 59 DEF, Vikram
ATK 88, Yari SPD 56), so the Heath sits at the band's top (23 to 24), not its floor, or it is grey
(`LEVELS.bands.trivial = 3`: at party 24 a level-21 group is a grey tag).

**Levels through the chapter** (objectives 25, books 10, the signature puzzle 60 twice, the debate 15 joined or 25
mediated):

| Point | XP from | Tool total | Level |
|---|---|---|---|
| Start (the Mere Stair) | | 5,900 | 20 |
| The Mere Stair, the road, the Market Cross, the Regent's answer, the close, the organ, the Toccata (the gate), the postern, the mirror file, Thomas's panel, out quietly, the Assize, the Hushed, the price (fourteen objectives at 25; the card is `noXp`) | 350 | 6,250 | 21 |
| SIG-ALM 1 (60, at the anchor), SIG-ALM 2 (60, at `story.record_read`), the debate joined (15) | 135 | 6,385 | 21 |
| The press-gang (40), Al-3 (100) and its cell (60), Al-2 (80) | 280 | 6,665 | **22** |
| The Hushed (120) | 120 | 6,785 | 22 |
| The Rolls House's nine and the keep's five, if read (140) | 140 | 6,925 | 22 |

**What start this outline assumes, and why.** The Chapter 6, 7 and 8 outlines and their reviews agree on one thing:
a real player arrives at every chapter since 5 one or two levels over the tool's line, because the chapters' fixed
XP fills their bands and the ambushes add on top; the Chapter 8 outline predicts **23 as played** at this chapter's
door against **20 on the tool**, and asks the central session to measure Chapter 7's played end and either tighten
Chapters 6 and 7's dials or plan this chapter from the measured start. Nothing in this outline can know which
happened. So it is written to **a measured start of about 22 as played** (the Chapter 8 prediction less the one level
the upstream fix would take back; 21 if the fix lands in full, 23 if nothing lands) and its data is set so that **the
chapter adds about two levels to whatever it inherits** (885 XP without the books, 1,025 with them, 1,150 to 1,275
with one or two tapered ambushes: at 22 to 23 a level is about 500 XP). The lines:

- **from 22 as played** (about 6,800): 7,685 to 8,075: **level 24**, the table's target, with the books and two
  ambushes landing 7 XP short of 25;
- **from 21** (6,034, the fix in full): 6,919 to 7,309: **22 to 23**, one under the target, inside `slackOver`'s twin
  `slackUnder = 1`;
- **from 23** (about 7,300, no fix): 8,185 to 8,575: **25**, one over, which Chapter 10 (24 to 25, ten minutes) absorbs
  and Chapter 11 (25 to 28) does not notice;
- **the tool** (5,900): 6,785 to 6,925: **22**, two under the target: `levelCurve.test.ts` fails `slackUnder = 1`
  unless `CHAPTER_LEVELS` 9 is re-based.

The honest statement for the milestone note: STORY's band for this chapter (21 to 24, three levels in 35 minutes) is
a level wider than the three roads' (two levels in 30 minutes each), and a chapter that paid three levels of XP in
35 minutes would be the one that breaks the war's curve. **This outline recommends:** measure the played start on
day 1 (the Chapter 6 review's 3.1 (b)); set `CHAPTER_LEVELS` 9 to the measured start plus two (`from: 22, to: 24` if
the drift stands, `from: 21, to: 23` if the fix landed, with Chapter 10's `from` to match); say so in the milestone
note as a balance statement, not a pop-up (the Chapter 6 review's reading of the owner's rule). The chapter's own
dials (the Hushed 120, Al-3 100, Al-2 80, the Heath at 23 to 24, a 24-step grace on the bog, the heath road kept
safe) do not move with that choice.

**Gold:** about 2,000 to 3,000 in; the Heath's trios about 280 each; the press-gang 100, the chapel 150, Al-3 500,
the Hushed 400. Out: the outfitter's tier-24 gear (a longbow for Yari about 900, an oilcloth coat, leather, about
1,000, a plain steel blade about 850; Agnipur's tier-20 pieces for a player who skipped them), the jeweller's
**law-seal brooch** (a charm, level 22, 350 gold: the guide's quirk, "reduces enemy Wealth drops", built as `special:
{ kind: 'yieldWealthLess' }` if the Yield step exists by now, else def 3, hp 8 and the text), pies and tea (tea
restores 20 SP and, if Calm is built, Tea Break heals 5% more with a tea in the bag: a `PassiveEffect` read of an
item, section 10; else the line alone). Nothing in the chapter requires spending.

---

## 6. The required-before gate: "Until the Toccata"

- **In the story:** the Regent has refused; Jordyn has named the hour (the loud piece, tomorrow night); Sebastian has
  agreed to play it; so the day is the party's, and the city names what is in it without saying "quests": Edmund, in
  the square: "My old tutor prints things on the heath, and he's been expecting someone who hasn't been purged. And
  the two by the cross have been arguing about whether the Throne should have one hand since before I could read,
  and I'd very much like someone to settle it so I can have my tea in peace."
- **In the Journal:** the objective **Until the Toccata**, `followSide`, done when Al-3 and the debate (joined or
  mediated) are done and `story.sebastian_met` and `story.jordyn_offer` are set, **or** when `story.recital_begun` is
  already set (a save at the west door never sticks).
- **On the map:** Sebastian at the west door on the eve is a step trigger that waits for the four (`if:
  'side.purge_list.done, debate.aldermoor_one_hand.joined|debate.aldermoor_one_hand.mediated, story.sebastian_met,
  story.jordyn_offer'`); until then he is worded from the flags: "Your friend's tutor is still waiting on the heath."
  / "The two by the cross are still at it." / "You haven't been to the close." Anissa: "Your Quests page, Gigi."
- **The eve variant** (`story.eve`) is a **condition** (the four done and not `story.recital_begun`), not a flag some
  dialogue must remember to set (the Chapter 6 review's 3.11); `story.assize_dawn` likewise (`story.caught` and not
  `story.hushed_beaten`); the last dawn (`story.hushed_beaten`).
- **A second, softer gate, by the ground:** Al-3's bog chapel is on the Heath, so the wild section is walked by a
  required quest (the Chapter 8 pattern); and the purge list the party takes there is what the printer sets in type
  overnight and the price scene counts (beat 8's walkers read `side.purge_list.done`, which the gate guarantees). Al-2
  is inside the archive on the main route, behind the shelf the panel is behind, so it is required by the ground and
  not by the counter: a player cannot reach the anchor without passing the chronicle, and Anissa's nudge names it.
- **Order the arrow follows:** Al-3 (the heath, nearest the gate the party came in by), the debate (the cross, on the
  way back), the Rolls House (its books are the debate's Reason), the close after the bell, St. Agatha's; then the
  west door on the eve.
- **No soft-locks:** the press-gang is winnable and Game Over returns the party to the Moor Gate; the bog chapel is
  winnable and returns to the heath road; the Heath's ambushes are at the party's level; the sightline strips return
  the party to the postern, never to a fight; every cabinet can be set and pulled any number of times (a wrong drawer
  is a line, not a state); the courtroom's wrong presses and wrong evidence are lines and the tree returns to its
  root; the Hushed's fight restarts at "Enough noise"; the debate's Provoke does not resolve it.

---

## 7. The two required side quests and the debate

Why these, from Al-1 to Al-5 and the Opus minimum: **Al-4 The Clock That Waits** is the secret item (after the
release; the tower door is inert, Thomas's last line is in the record's text, and the clockmaker says his line at
the stair). **Al-1 Terribly Sorry** opens only after Edmund joins and is five deliveries across the city with no fight
and no Echo: the first thing to add after the release, and the funniest, but a quest done in the chapter's own time
would double its length. **Al-5 Tea With Lady Rosalind** is a debate-shaped conversation whose outcome (she withdraws
from the council and attends the Hearing) the main story now pays in the court, where it is shown, not told; the
tea itself comes after the release as a scene with its own map. That leaves **Al-3 The Purge List**, the rebel
safehouse (the eighth ash thumbprint, which no chapter may skip), the one quest that walks the wild section, the
chapter's one optional-feeling fight, the Fear the dissidents' price is paid in, and the list the printer publishes at
the price; and **Al-2 The Crown Chronicle**, the third of the four Ash Wars accounts (needed for the Muster's Concord
bonus and the Hearing's line), on the main route's own map, with the hand the player has just learned. No new quest
is added.

### 7.1 The Purge List (Al-3; the rebel safehouse)

- **Opens:** Edmund's tutor, **the printer**, at the printing barn on the Heath, from `story.regent_refused` (moved
  from "after the courtroom": Claude's call, section 12). Shows as *??? The barn on the heath* until spoken to. The
  barn's door has the grey **ash thumbprint** (seen on the way in; the eighth safehouse). Inside: a hand press, drying
  sheets, three apprentices who stop talking, and an old man in an inked apron who taught Edmund his letters:
  "Edmund. You've brought me an envoy. I've been expecting one since the first family went quiet." Accepted when
  spoken to (`side.purge_list.accepted`): "The almswomen have a list. Names, streets, the word 'quiet' beside each.
  They carry it to the bog chapel at dusk and read it to the veils, and the next night a door on that list has a
  family behind it that can't say its own name. I want the list. I'll print it. A thing that's printed can't be
  quiet."
- **Steps:** 1) **The bog chapel** at dusk (the `heath` layer; the road safe): the roofless chapel in the bog, the
  almswomen's lantern inside, two **Hushers**, a **Zealot** and a **Bog Hound** on its chain (placed; the party is
  seen: "The veils turn, all together, the way birds do." The fight `bog_chapel_cell`, four at 23, winnable, section
  5). 2) **The list** (`item.purge_list`, key): names and streets in a clerk's neat hand, *quiet* beside each, and on
  its **cover note** (a readable second page) the grey **thumbprint** and three words in another hand: *Warn them
  first.* Haru: "The list is the almoner's. The thumb is not. Somebody inside the cells sent this out ahead of them."
  Samira: "Bread, oil, water, grain, paper, files, oil again, and now a list. Eight cities." (The design's step 3 kept
  exactly: someone in the Quiet Crown leaked it on purpose; the thread's "someone is feeding the realm" in the
  realm's own cult.) `clue.list_leaked`. 3) **Warn three families** on the Market Cross (the pie shop, the tea shop
  with the shut door, the sorry constable's house: three doors, each a short scene; the constable: "I'm on it? I'm on
  my own list?"). 4) Back to the barn (shown: the printer sets the first line in type; the apprentices start the
  press): "By noon tomorrow. Every door." `side.purge_list.done`.
- **Reward:** 100 XP, 500 gold, **+3 Fear (Aldermoor)**, the Journal note *The ash thumbprint (8 of 9)*: "The purge
  list, leaked from inside the Quiet Crown with the grey thumb on its cover: 'Warn them first.' Eight of nine. In
  Kingsmere the rebels' hand reached into the cult's own cells." (The Chapter 7 review's rule: nobody names the
  thumbprint the Quiet Crown's or Rael's; the note says what is seen.)
- **Why it fits:** the safehouse thread; the wild section on the route; the Fear the price is paid in; the list the
  price scene publishes; and the first time the thumb is found *inside* the thing that hunts Anissa, which is the
  chapter's quiet answer to its own question (who bent the cells, and who is still inside them).

### 7.2 The Crown Chronicle (Al-2; the Ash Wars shelf)

- **Opens:** the Ash Wars shelf in the archive, from `story.archive_entered`. Shows as *??? The shelf by the panel*.
  Accepted when the shelf is read (`side.crown_chronicle.accepted`): *The Crown Chronicle of the Ash Wars* (account 3
  of 4: "four hundred put to the sword at the Ash Road by the Lord of Ardencia, in the Crown's cause"), and on its
  fly-leaf, in an old man's version of the hand the player learns five tiles later, a margin: *Written to order. The
  purchasing office asked for the Brasador wars large and I wrote them large. The true count is in Kirinoura. T.S.*
- **Steps:** 1) Take the chronicle (`item.crown_chronicle`, key; a keep book after). 2) After the panel, read the
  fly-leaf again (a second look on the object once `anchor.thomas_record` is set): Gianna: "The same hand. Fifty years
  apart." Haru: "The true count is in Kirinoura. We have it. Forty-one marines, and the rest bound." (`clue.fox_receipts`
  and the Fog Files' ledger, Chapter 7.) 3) Note it in the Journal. `side.crown_chronicle.done`.
- **Reward:** 80 XP, +2 Influence (Aldermoor), the chronicle (with the note that it was written to order), the Journal
  note *The four accounts: three read* (the temple record, the spy ledger, the Crown chronicle; Anicette's is the
  Muster's).
- **Why it fits:** the design's quest with its timeline error fixed (the Chapter 7 review's 3.3: the Ash Wars are
  twenty-five years old, so the order to write them large is in Thomas's old age, not Patricio's Echo; he is the
  same honest clerk twice, which is better than an Echo step with no anchor); the shelf is on the route to the
  anchor; and the third account reaches Chapter 10 on the main route, so no player can miss the Concord bonus by
  skipping a side quest.

### 7.3 The debate, required: *Should the Throne have one hand?* (the corner by the cross)

- **Where:** the debate corner by the Market Cross. **Opens:** from `story.edmund_met`.
- **The two speakers** (guide 7.2): a **Quiet Crown hierarch**, a sincere believer in a plain grey stole, not a Husher
  and not veiled ("The realm is eight voices shouting across a table while the harbor burns. One hand on the Throne
  and the shouting stops. That is not tyranny; that is quiet.") against a **Gaze exile** from Zetwal, old, in a faded
  sun shawl, who left Pòdlimyè in the Crown's time and never went home ("A hand that cannot be seen cannot be held to
  anything. The goddess does not rule and she does not need to: she watches, and everyone who rules knows it. One
  hand in the dark is how my island was counted as property."). The built debate shape (listen, join, mediate,
  provoke; three rounds; scripture, reason, compassion): the ally is the **exile** (Gianna's faith), the opponent the
  **hierarch**. The player may argue the hierarch's side, which is the point of the question: the chapter's court has
  one hand and it is patient and polite and it dismissed its own almoner in a sentence, and the chapter's answer is
  a clerk who wrote the truth in a margin and waited fifty years for a court to read it.
- **Reason needs** one of *The Witness and the Law*, *Dame Agatha's Patience* or *The Long Game* (`reasonNeeds`; the
  Rolls House is open all day). **Mediate** needs the built Influence 5 at Aldermoor (listen +1, books +1 each:
  reachable by a reader). Rewards: the built `DEBATE_REWARDS`. After the Assize the hierarch has a new line, said to
  nobody, if the player passes (`story.hushed_beaten`): "I knelt to her. I never saw her face. I don't know what I
  knelt to." (The guide's "sincere followers joined for belonging"; the post-Harbor corner, *a faith that began as a
  political tool*, is Chapter 11's build.) Anissa's line after, the only judgement, plain: "The grey one wants
  everybody quiet, Gigi. The sun one wants everybody watched. Uncle Sebastian is loud and everybody watches him and
  nobody minds."
- **The quest:** *Should the Throne have one hand?*, required, done on joined or mediated. No faith is a cult on this
  corner: the hierarch is a believer, and the Hushers are on the heath and in the court, where no line joins them to
  him until he joins them himself.

### 7.4 Books, vendors and the board

- **The Rolls House (9, `CAPITALS.md` 9):** *Dame Agatha's Patience* (the founder; "the loud burn out first"), *The
  Zetwal Rebellion* (the Crown's view: a rebellion lost to foreign meddling; a reader of the Zetwal temple record has
  both sides), *The Charter of Protection, Explained* (the Crown's legal case for Xaraguá; it gives the ratification's
  year, "the twenty-third of the Old King", so a reader has the archive's number before the archive), *The Witness and
  the Law* (law as an oath; the forsworn witness's evidence falls with her: the courtroom's rule, in the city's own
  book), *Wool, Tin and Tea* (how much of Aldermoor's trade runs through Xaraguá's harbor: why the Crown wants it),
  *The Long Game* (proverbs), *Court Circular* (the Regent's guests; "a lady in grey" never named; "the organist's
  recital on the eve of the Assize"), *Thomas Stillwater's Record (public edition)* (the clean one; a reader compares
  it with the true one after the panel: a second look), *The Stillwater Line* (Agatha, Thomas, Rosalind, Edmund).
  Reading one gives +1 Influence (Aldermoor) and 10 XP.
- **The keep (5):** *The Crown's Pact With Ardencia* (after the archive), *The Ash Road Accounts* (coded; after the
  archive), *Thomas Stillwater's True Record* (after the panel), *The Purge List* (after Al-3: the keep's own copy in
  the Almoner's office, readable after the Assize: "the same list, in the same hand, with no thumb on it"), *Court
  Minutes of the Ratification* (on the archive's gallery desk: the Seventh Clause ratified in the twenty-third year
  with no Yaguana present; the archive's own copy of the year).
- **Vendors (guide 8; formal and courtly English; no glossary: the first chapter since Zetwal with no `verified:
  false` line):** the pie shop ("Afternoon. Mind the rain.": meat pie heals 80, tea 20 SP, scones heal 40), the
  jeweller ("Good day, madam.": the law-seal brooch, a plain steel ring, level 22, atk 3, def 3), the outfitter ("How
  may I help?": the plain steel blade, level 24, atk 24, `blade`; the oilcloth coat, leather, level 24, def 17, hp 28,
  spd 1; the longbow, level 24, for Yari; Agnipur's tier-20 pieces).
- **The contract board:** "carry pamphlets past the constables" (Al-1's cousin, after the release, with a line:
  "the printer wants them by noon"), "find a press-ganged son" (the pie-shop boy: paid by the main story, +1
  Influence once `story.edmund_met`), "copy the court circular (Influence)": built as a one-line job that pays +1
  Influence once *Court Circular* is read, because the player has just done it.
- **Anissa's nudges** (mystery quests, under 128 characters): "Edmund's teacher is out on the heath, Gigi. He said
  'purged'." / "The two by the cross are arguing about hands." / "The shelf by the panel has a book about the Ash
  Road." / "The woman with the basket was behind the Regent's chair."

---

## 8. The Echo puzzle: the archive and the courtroom (SIG-ALM, design difficulty 6; honest 5)

The design (`PUZZLES.md`): the archive files by regnal year and seal colour, and the pact is filed under a false year;
in the Echo Thomas explains the system to Patricio and hides a copy of his true record behind a loose panel; the
false year is the Accord's year reversed in regnal numbering ("We file lies in the mirror"); the anchor is Thomas's
hidden copy; then the courtroom: three witnesses, the second claims "Xaraguá's cacique agreed in this very court",
the dock's Echo shows the ratification with no Yaguana present, and the player presents the Echo minute and Thomas's
copy. Kept exactly; the staging:

1. **The rule, Echo (beat 5):** Thomas's line gives the system and the mirror; the order to "make it clean" gives the
   reason; the panel is an Echo-era puzzle object whose `use` (Patricio hides the record: "Envoys lean on things.")
   sets `anchor.thomas_record`; the present panel reads it (a second look; a `use` opens it and gives the record).
2. **The year, present:** the archive's gallery desk holds *Court Minutes of the Ratification* ("in the twenty-third
   year of the Old King"); a reader of *The Charter of Protection, Explained* already has it. The Accord's year is 23;
   the mirror is **32**; the house the lie is about is **Brasador (red)**.
3. **The cabinets, present (the mechanism, pure data):** six cabinets by decade (years 1 to 10, 11 to 20, ... 51 to
   60), each a puzzle object with two flags-with-values (`archive.year`, stepped by a dial `use`: the ones and the tens;
   `archive.seal`, a switch `use`: violet, red, gold, teal, green, grey) and a pull (`use` on the drawer front) whose
   dialogue branches on the two values: "Empty." (most), "A slip: 'Removed to the Lord Regent's keeping.'" (23 red,
   the honest year), "The Crown's own copy of a tax roll." (32 violet), and **the pact and the accounts** (32 red:
   sets `clue.crown_pact` and gives both items). Every state is reachable and reversible; a wrong pull is a line.
   Honest difficulty 4 for the archive alone: two numbers and a colour, each given by the room.
4. **The courtroom (the tree, pure data; beat 7):** the dock's Echo zone (a swap shows the roll; `clue.ratification`
   on the swap's scene, no anchor); the clerk's table (speaking to the clerk opens the tree: *Press a witness* (the
   steward / the Almoner / the Captain; each a line and back), *Lay evidence* (the entries whose `if` holds: the
   dock's roll, Thomas's record, the pact, the chronicle, the purge list; the wrong ones are a line from the Regent
   and back: "The envoy will come to the point."), *Rest*: not offered until `story.record_read`). The solution:
   press the Almoner, lay the roll, lay the record (in either order after the press); laying the record without the
   roll is the cheat that fails honestly ("A margin against a public edition is a word against a word. The court
   needs the court."); pressing the steward three times is the other (the Regent's line, no cost). Honest difficulty
   3 for the court alone: the lie names the two things that break it.
5. **Anissa's hints** (3 minutes stuck; `PUZZLES.md`'s wording): "Even archives lie, but they lie neatly." / "Thomas
   says lies are filed in the mirror. And the court remembers who was here." / "The pact is under the Accord's year
   reversed, 32, under the red seal. In court, the second witness lies: show the roll, then Thomas's copy."

Files: `puzzles/aldermoor_archive/solution.json` (the Echo's panel; 32 red) and `cheats.json` (23 red; 32 violet; the
panel pulled before the Echo, which gives nothing: "Nothing behind it that you can reach.");
`puzzles/aldermoor_assize/solution.json` and `cheats.json` (the record without the roll; the steward pressed thrice;
the pact laid against the Almoner's statement, which proves greed and not a lie). Both replayed by
`tests/puzzles.test.ts`.

**The secret (S-ALM, after the release):** the clock tower door is placed and inert; the record's last line and the
clockmaker's line at the stair are the seed; nothing here makes the Patient Hour harder (the tower is reachable from
the hall whenever the keep is open, and the Echo zone at its top is drawn now and switched off).

---

## 9. Edmund, Jordyn, Sebastian and Anissa: how the companion joins and plays, and the family beats

### 9.1 Edmund

- **Who he is on the map:** Rosalind's son, Thomas's grandson; "ridiculously polite, apologizes to enemies before
  hitting them; tea breaks heal" (approved). He takes his hat off before a fight and puts it back on after; he says
  "terribly sorry" to the man he has just knocked down and means it; he has written to every one of them. His
  warmth is for people, not the Crown, and his politeness is not weakness: he is the one who breaks the family's
  seal on the archive and the one who says "I'm going with them" to the Regent's face. The joke is the apology and
  the tea; the character is that he is sorry and does it anyway. One line to Anissa, no joke: the hat ("Hats get hit
  here. People don't, as a rule."); she keeps it (`item.edmund_hat`, a key item: *Edmund's hat*, one line of text),
  as she keeps Kayla's crane and Aiyana's mirror.
- **When he joins:** at the pie shop (beat 1), as a fighter, before the keep (`party.edmund`, `party.active`); he
  defies the Regent in the court (beat 7, `story.edmund_defied`) and leaves Kingsmere with the party at the stair.
  `STORY.md` says "Edmund defies the Regent and joins" after the Hushed; this outline splits it (Claude's call, section
  12), as Chapters 6, 7 and 8 did: the player plays the Guardian in the Guardian's chapter, against the one boss whose
  weapon is silence, and the defiance is said where it costs him his mother's seat.
- **His data entry** (`rpg.ts` `MEMBERS`, with the active-order flag so he fights here), sim-checked at 22 (hp 221,
  atk 63, def 59, mag 5, spd 29: the most HP and DEF of any fighter, the slowest; a tank, as the guide says): `{ id:
  'edmund', name: 'Edmund', role: 'Guardian', house: 'Stillwater', portrait: 'edmund', era: 'present', class:
  'warrior', joins: { flag: 'party.edmund' }, base: { hp: 58, sp: 18, atk: 11, def: 12, mag: 5, spd: 8 }, growth: {
  hp: 7, sp: 2, atk: 2, def: 2, mag: 0, spd: 1 }, start: { weapon: 'pattern_sword', armor: 'stillwater_greatcoat' } }`
  (two new items at tier 20; his own, not shop stock: a plain straight sword of the Crown's pattern, and a grey
  greatcoat with a mail lining; the sim folded Aldermoor's Vigil into the base, +10% HP).
- **His skills** (COMBAT 9.8, in the engine's shapes): **Aldermoor's Vigil** (passive: +10% max HP: a `PassiveEffect`
  kind `hpShare`, section 10; or folded into the base, which the sim did); **The Long Watch** (passive: on any turn he
  takes no aggressive action, DEF +5%, stacking to +25%: `PassiveEffect` kind `defPerGuard`, section 10; fallback:
  text only); **Shield Wall** (SP 8: every ally's next hit taken x0.5: a `shielded` status that spends itself on one
  hit, section 10; fallback `warded` for 3 turns, which the sim used); **Tea Break** (SP 10: the party heals 15% of
  max HP and Anissa +1 Calm, "Terribly sorry, one moment": a heal by share, section 10; fallback a heal by power
  tuned to it; the Calm part if Calm is built); **Stillwater's Patience** (passive, once per battle: cancel an enemy's
  buff: Chapter 7's `strip` as a `once` skill at SP 0, if `strip` landed; fallback: cut, with the board's text in his
  Status page). Moves: **Shield Bash** (100), **Measured Blow** (150, cooldown 2), **Hold the Line** (`taunting` on
  himself, cooldown 3: the Warden's Taunt shape, built for Patricio). Battle look: a placeholder recolour of the walk
  sheet until art (hat off).
- **After this chapter:** the Stillwater dissidents against everyone at the Muster (the hardest of the three feuds:
  guide 5.4) is his scene; "terribly sorry" gets one line per later chapter and none at the Hearing, where he stands
  with his mother.

### 9.2 Jordyn (FAMILY.md, settled)

- **Who she is on the map:** Rahel's daughter by a Black military man; Rael's half-sister; Azzy's Titi Jordyn.
  Disciplined, blunt, fair: she stands with her hands behind her back, says the thing once, and keeps the law in front
  of the Regent's people and the family in a whisper. Captain of the Regent's watch (the keep's guard, not his
  Sealbearers: the watch arrests, the Sealbearers serve the Throne's writs, and the difference is the chapter's
  hinge). She is not an NPC with a quest flag: her line at the door is the chapter's second beat, her postern is the
  Echo's door, her arrest is what puts the party in the dock instead of the bog, her resignation is the dissidents'
  army, and her company is Chapter 10's and Chapter 11's.
- **The rule for her lines (the locked rule: Gianna cannot learn Rael is good until near the end):** Jordyn knows
  Gianna and Anissa are Rael's daughters (Kayla and Aiyana's precedent: the family knows; "Mother writes: Kayla
  writes to Mother, and Mother writes to everyone"); she says so once, in the close, without his name. She says
  nothing about the marriage, nothing about his work, nothing about the thumbprint (she is in the keep when the list
  is taken, and the watch does not go to the bog chapel: "I'd have to arrest the Regent's charities."). Her one
  clue-level line, the only time she speaks of him, at the stair: "He wrote to me once in twenty years. One line:
  'Keep the law.' I have." It reads either way, which is the design's rule for every Rael clue. A content test checks
  no Jordyn line contains "good", "innocent", "feeds", "the arrows" or "thumbprint", and the reviewer prompt asks for
  a human read of every Jordyn line (the Chapter 7 review's point that the test would not have caught Kayla's three).
- **Why she defects for law and not for family, and why it is settled:** FAMILY.md says she "defects and opens the
  keep's postern"; this outline keeps both and gives them an order: the postern in secret (beat 5), the arrest by the
  book (beat 6, which keeps her cover and the party alive), the resignation in open court (beat 7). The settled line
  is kept; the arrest is the Claude's call (section 12), and its reason is that a watch captain who defects by
  opening a door is a traitor, while one who arrests the envoy, puts her before the Assize and then resigns in it is
  the fair woman the owner described.
- **Her touches for Anissa (no joke):** "Don't bring the little one into the rain." / "Put her where four hundred
  people can see her." / at the stair, crouching: "That's the bravest thing I've seen in that building. Don't do it
  again without me there."
- **The family beat with Azzy:** shorter than Aiyana's, as the Chapter 8 outline asked (the fourth Titi in four
  chapters, so his line comes first and is cut off): "Titi—" / "Captain of the Regent's watch, sir." Then, in the
  close: "Azriel. You've got Mother's jaw. Don't lead with it." At the cells: "Mother's jaw. I said." At the stair: "I'll
  bring Mother. And her mother." (Rahel's line for Azzy is Chapter 10's.) Azzy, after, to Gianna, the one time:
  "Four of them. Four of his sisters, and this one arrests people." / "She said she hasn't decided." / "She's in the
  rain." (Reads either way; tested the same.)
- **Placeholder look:** the Regent's violet with a captain's knot, a tall Black woman, hair cropped, hands behind her
  back (an idle frame); `jordyn`. Art through `ART-PROMPTS.md` when the outline is approved. **Later:** Chapter 10:
  she arrives at the Muster with her company, Rahel and Patricia (FAMILY.md; the Muster's outline places her); Chapter
  11: she leads a company in the War of the Harbor (an army's name in the volley data). `army.aldermoor` is her seven
  and the barn's lot.

### 9.3 Sebastian (FAMILY.md, settled)

- **Who he is on the map:** Elodie's brother, Coralie's; a world-renowned organist who plays across the realm for
  fame; proud, gentle, a showman: he says who he is to the whole nave, goes down on one knee on wet flags for a child
  who hums, and reviews his own slow movement. The Regent's guest for the season (the Regent commands his recital on
  the eve of the Assize because "he likes loud things done in order"). He does not know why the party has come and
  does not ask twice; he knows what hour to be loud at. His help is acted out: the organ heard across the square
  before he is seen, the Toccata that plays under the whole break-in as an audio slot, the court kept in its pews
  ("if the Regent stands up before the end I shall start the Toccata again"), the cells with the Regent's leave, the
  gallery at the Assize, the stair at dawn.
- **The secret:** he does not know it (Claude's call, section 12): FAMILY.md gives the secret to Jaime, Rivera and
  Tati Coco and to nobody else; a showman who cannot keep a note quiet is the last person Elodie would tell, and the
  chapter is better for an uncle who loves his nieces without knowing their father. His one line about Rael is not
  about Rael: "Your mother has written to me about the weather for twenty years. I have come to believe the weather in
  Zetwal is extremely interesting." (Reads either way; tested with Jordyn's.)
- **His name:** Sebastian **Limyè**, as the Chapter 5 outline named Coralie Limyè (Elodie's public name, carried by
  her siblings in public; the guide's "shared with Anissa and Elodie" is the household's, and the bill on the notice
  post is how a stranger would print it). Anissa reading the name on the bill is the bump-in's seed.
- **His touches for Anissa (no joke):** "Who hums." / the loft ("the one place in Kingsmere where four hundred people
  can see you and not one of them can reach you") / "You turned every page on the beat." She keeps the recital bill
  (`item.recital_bill`, a key item: *Uncle Sebastian's recital*, one line of text).
- **Placeholder look:** a broad man in a velvet coat, sleeves pushed up, grey at the temples; `sebastian`. **Later:**
  FAMILY.md places him here only; he says he will come to Pòdlimyè "to hear the drums" after his Eightgate recital,
  which is a door Chapter 10's outline may open (the Muster) or Chapter 12's (an organ in Eightgate during the Claim
  is a thing a showman would do), and need not.

### 9.4 Anissa in this chapter

- She is looked at by the Regent (one breath, no line), by the Sealbearer at the gate (a breath too long), by the
  almswomen (their veiled heads turn) and by the whole court from the loft; she is spoken to by nobody in Kingsmere
  except the Hushed, once, in the dock, and that line is the Hushed's undoing. She is never hit, never a target of
  a blow (Hush the Light is a whisper at her and Gianna steps in front, shown; Seize is the built path, Gianna's),
  and she carries three things out of the city: a hat, a bill, and the one line she said in court. Her Surge gesture
  is at stage 3 (`SURGE_ANIM_STAGE`), one short of sure.
- **Her line in the court** ("Gigi. That's the lady from the plaza.") is the chapter's one step on the thread *Anissa
  finds her voice* (STORY 4: shy lines, the first Surge, Calm attacks, she speaks at the Muster, she speaks at the
  Hearing): a sentence, not a speech, said to her sister and heard by a court, before the Muster's speech. It is not a
  joke and nothing near it is: the Hushed answers it, Gianna steps in front, and the fight begins.
- **No comedy in a node with her:** Edmund's hat line is earnest; Sebastian's "who hums" is earnest; Salkhi is on the
  boat, the heath and the square and never in the church, the keep or the court; Samira prices nothing after the
  archive; Vikram is out of breath once (the hall) and not in the dock.

### 9.5 The Regent, the Almoner and Rosalind

- **The Lord Regent Aldric Vane** (the guide's name; the Chapter 5 look): at home, seated, never raising his voice,
  three moves ahead in every scene: he names the new companions, he names the uncle, he lets the envoy into the
  archive to be caught, he gives up a margin to keep a clause, he dismisses his agent in a sentence, he withdraws the
  charge, he sets the tide. He never speaks to Anissa and never admits the Almoner was his (the commission is in his
  hand and the Crown "keeps no almoner"). Nothing in this chapter is provable against him, which is why Chapter 12 is
  a Challenge and not a trial.
- **The Almoner** (the Hushed; role-named in the build; proposal name **Mrs. Sallow**, for the fluent check of its
  register): the lady in grey of the *Court Circular*; the Crown's charities (the Quiet Crown's "charity that
  creates debt" in a basket); the veiled woman of Chapter 1's plaza (the near-miss in section 12); the head the cells
  kneel to, who was given the cells and never told by whom they were made. Unveiled, she is a plain woman of sixty
  with a brooch, which is the design's point ("a hand with no face"). She never names Rael because she cannot.
- **Lady Rosalind Stillwater** (the Dec 1 list's Gen III ruler Edmund defies): on the council bench in the hall and the
  court; two lines to her son ("You've hit someone." / "Sat."); the one who stands for the record to be read, because
  a Stillwater wrote it. Al-5's tea is after the release; her withdrawal and her place at the Hearing are paid here.

---

## 10. New systems the chapter needs (honest effort, in Opus builder-days)

| Need | What exists | What to build | Fallback | Effort |
|---|---|---|---|---|
| **Edmund as data** | fighters as data | his `MemberDef`, skills, moves, looks, two start items, the join flag | none needed | 0.2 |
| **`magScale` on `EnemyDef`** (a boss's spells scaled as `atkScale` scales blows) | `atkScale` in `enemyStats` | one field, one line in `enemyStats`, a test; the Chapter 5 to 8 bosses are unchanged (none sets it) | none: without it the Hushed is harmless at any HP (section 5); if it cannot land, her moves become physical (`magic` off) with `atkScale 2.2`, which the sim did not run and the build must | 0.05 |
| **`hushed`** (`STATUS.hushed`: `skills: false` for 2 turns; Attack, Guard, Item work; the menu greys skills) | Chapter 7's piece if it landed | if not: one field read where a skill is chosen, one status row, the greying (about 20 lines), a test | `weakened` (the sim's softer stand-in) | 0.1 |
| **Calm and Comfort** (COMBAT 8: Anissa's Calm 0 to 3 under her Spark; an `EnemyMove.calm` field lowers it, shown as the enemy turning to her and Gianna stepping in; at 0 Surge is unavailable; Gianna's **Comfort** (SP 2, hers 1: Calm +2); Tea Break +1; Calm 3 at every battle's start) | Spark, Surge, `seize` (Gianna steps in), the Surge gesture | a Calm counter on the battle, one move field, one skill kind `calm`, the scene's bar (about 60 lines), a test; `COMFORT_CALM` in config | `seize: 3` with Hush the Light's tell (the sim's); Quiet Crown as `weakened` alone; Comfort cut | 0.3 |
| **Shield Wall** (`STATUS.shielded`: `taken: 0.5`, spent on one hit: a per-status `hits: 1` field) | the status table; `gilded` | one status row, one field, one line where a hit is taken (about 12 lines), a test | `warded` for 3 turns (the sim's) | 0.1 |
| **Tea Break's heal by share** (`SkillDef.healShare`: a share of each target's max HP) | heals by power against MAG | one branch in the heal path (about 8 lines), a test | a heal by power tuned to about 15% at 22 | 0.05 |
| **The Long Watch** (`PassiveEffect` kind `defPerGuard`: +5% DEF per own turn with no aggressive action, to +25%, reset on an attack) | `PassiveEffect` kinds `battleGold`, `atkPerFell`, Chapter 8's `spLess`, `attackOnFell` | one kind (about 20 lines), a test | text only | 0.1 |
| **Aldermoor's Vigil** (`PassiveEffect` kind `hpShare`) | the kinds above | one kind (about 6 lines) | folded into his base HP (the sim's) | 0.02 |
| **Stillwater's Patience** (`strip` on a `once` skill) | Chapter 7's `strip` if it landed | data | cut, with the board's text | 0 |
| **The Crown Officer's role** | `ENEMY_ROLE` has four roles | data: the role Chapter 2 gave its lieutenant; COMBAT 13.1's `support` row is not built and this chapter does not build it | none needed | 0 |
| **The sightline strips** (trigger strips that return the party to the postern with a line) | the Chapter 7 fog-return trigger (a door-like trigger that lands on the same map) | map data only | none | 0 |
| **The evidence mirror** (`evidence.*` flags set when Jordyn takes the items; the Quests page's *held by the court*; the items back on `story.record_read`) | key items as flags; `if` conditions | data (a dialogue `set`); one line of Quests-page text per item if the page can show a note, else the Journal's | the Journal note alone | 0.05 |
| **The cabinets and the panel** (puzzle objects with two flags-with-values and a pull; the panel's anchor) | puzzle objects with `use`, flags with values, `if`, anchors | map data only | none | 0 |
| **The courtroom tree** (press, lay, rest; `if` on clues and evidence) | dialogue trees with `if` and `set` | data (about 30 nodes) | none | 0 |
| **The dock's Echo zone** (an `onEcho` scene that is lines only, no anchor; the swap back puts the player in the dock) | zones with `onEcho` / `onReturn` | map data only | none | 0 |
| **The rain** (an `above` layer on outdoor maps, off on `story.hushed_beaten`) | Kirinoura's fog layer by flag | map data only (four tiles cycling if the tool animates `above`; else static, as the Chapter 7 review allowed for fog) | static rain | 0.02 |
| **The recital's audio slot** (a track that plays on `story.recital_begun` across three maps and stops on `story.caught`) | `audio.config.ts` slots by map; the farewell track | one slot keyed by flag rather than map (about 10 lines in `audioPlan.ts`), or the same track set as the three maps' music under the flag | the cathedral's music alone, and silence in the keep | 0.05 |
| **The pigeons, the escort, the court's walk, the dissidents' line, Jordyn's seven** | walkers, `enter`, `exit`, `sync` | data | lines | 0 |
| **The law-seal brooch's special** (`yieldWealthLess`) | `ItemSpecial` kinds; the Yield step if built | one kind if the Yield step exists | def 3, hp 8 and the text | 0.03 |
| **The sea voyage** (`aldermoor_zetwal`) | `VoyageDef` | one `VoyageDef` | a card | 0.05 |
| **The active-order flag** (`party.active`) | Chapter 8's | data (Edmund replaces the fourth at the hat) | the first-four rule with Edmund fourth in `MEMBERS`, which benches Vikram from now on: playable and wrong | 0 (assumed) |
| **Chapter wiring** | `CHAPTERS`, `chapters.json`, the route, `CHAPTER_LEVELS` (has 9), `MARKS` | `ACT9` in `quests.ts`; `'10'` in `MARKS` (Pòdlimyè's long pier); the route to `@chapter9-end`; `?chapter=9`; `story.zetwal_return` set by Chapter 10's landing, not here | none | 0.25 |

About **one and a quarter builder-days** of engine and wiring; `magScale`, `hushed` (if Chapter 7 did not land it),
Calm and Edmund's three pieces are the only parts that are not data, and every one has a fallback that keeps the
scene. Nothing here needs a stealth system, an Echo battle, a Yield step, a timer, a party-order screen or region
levels. Both halves of the signature puzzle are data (the cabinets are flags with values; the court is a dialogue
tree), which is the second chapter in a row where the Echo puzzle costs no engine, and why this chapter fits two and
a half days with a new boss field and Calm in it.

---

## 11. People, with placeholder looks (drawn in code, `assets.config.ts` NPC looks; art drops in through the config)

| Person | Role | Look (placeholder) | Later |
|---|---|---|---|
| **Edmund Stillwater** | the companion (section 9.1) | a new member look: a good grey coat, a hat (off before a fight), a straight sword; a battle recolour | the Muster's hardest feud; the Hearing beside his mother |
| **Jordyn** | captain of the watch; Azzy's Titi; the postern, the arrest, the resignation (section 9.2) | the Regent's violet with a captain's knot, hands behind her back; `jordyn` | Chapter 10 (her company, Rahel, Patricia), Chapter 11 (a company in the war); on the drop-2 list with the chapter's boss |
| **Sebastian Limyè** | the organist; Gianna's uncle; the Toccata (section 9.3) | a velvet coat, sleeves up, grey temples; `sebastian` | a door for Chapter 10 or 12, not a plan |
| **Lord Regent Aldric Vane** | the antagonist; presides; three moves ahead (section 9.5) | the Chapter 5 `regent` look, seated | the boss of Chapter 12 |
| **The Almoner** (the Hushed; "Mrs. Sallow", proposal) | the boss; the lady in grey; the plaza's veiled woman | grey, a basket, a veil; a second look unveiled (grey hair pinned, a brooch); `the_hushed` | held in the keep's cells or shown to the city; on the drop-2 list (the boss of 9) |
| **Lady Rosalind Stillwater** | the council; Edmund's mother; "Sat." | grey-violet, a council chain, seated; `rosalind` | Al-5 after the release; the Hearing |
| **The Crown magistrate**, the **clerk of the court**, the **keep's steward**, the **chamberlain**, the **postmaster**, the **bishop of the Witness** | the seat's staff; the court | violet recolours of the Chapter 5 clerk's shape | the magistrate at the Hearing, if the epilogue wants a Crown voice |
| **Thomas Stillwater** (Echo) | Gen II; the clerk; the record | the Chapter 5 boy clerk, a season older, the Echo palette | S-ALM's tower after the release |
| **The old-uniform Sealbearer** (Echo), the **council's voices** (lines only) | the first revisiting | the Chapter 2 Echo marine recolour | |
| **The justiciar** and **the roll clerk** (Echo, the dock) | the ratification | the Echo palette, a bench | S-SEA's hearing after the release reuses the clerk's register |
| **The printer**, three **apprentices** | Al-3; the price | an inked apron; `printer` | the Muster (the dissidents' voice) |
| **The clockmaker** | Al-4's seed, one line | a loupe; `clockmaker` | Al-4 after the release |
| **The sorry constable** | the cells; Al-3's third family; the price | oilskins, no coat at dawn | |
| **The pie-shop boy** and his **mother** | the press-gang; the recital; the price | flour; an apron | |
| **The Quiet Crown hierarch**, the **Gaze exile** | the debate | a plain grey stole; the Chapter 1 pilgrim look in a faded sun shawl | the post-Assize line; the post-Harbor corner |
| **The keeper of the rolls**, three **vendors**, the **verger**, the **escort pair**, the **Moor Gate's Sealbearer** | | | |
| **Moor Constables**, **Bog Hounds**, **Hushers**, **Sealbearers**, **Crown Musketeers**, **Crown Officers**, **Zealots**, **almswomen** (Hushers in grey) | the Heath, the chapel, the square, the court | constable: oilskins and a truncheon (the marine recolour); hound: a 1 x 1 sprite, black, low; Sealbearer: the Chapter 5 look; the built musketeer and zealot recoloured; the Husher as Chapter 7 drew it with a grey veil | the Seat's Sealbearers at 28 to 30 (Chapter 12) |
| **Young Patricio** (the player in the Echo; Caona and Benny as data, not drawn) | beat 5, the dock | the Echo palette | |

Voices: Edmund apologising in full sentences; Jordyn in short flat ones with the law in them; Sebastian in long ones
with himself in them; the Regent in the courteous register of Chapters 5 to 8's Crown men, now from a chair; the
Almoner in the same register until "Enough noise", then bare; Rosalind in two words; the magistrate formal; the
printer plain and angry; the constables sorry. Nobody in Kingsmere sounds like Agnipur: people here say nothing
plainly, and the clerk who did wrote it in a margin.

---

## 12. Owner questions (owner rule, Oct 20: only decisions that drastically change the story's flow; one at a time)

**None required.** I looked for one and found a near-miss, below first. If the second review disagrees with any of
these, it becomes a pop-up with the recommendation first and the build goes ahead on it.

- **Near-miss: the Hushed is the veiled woman from Chapter 1's plaza.** The built Chapter 1 has a veiled, hooded
  stranger who looks at Anissa and to whom Gianna can say "Stay away from her" (`choice.stay_away`, remembered); the
  design says the Chapter 1 recruiters and the veiled woman speak of "the Hushed" as their leader. This outline makes
  the Regent's almoner that woman, unmasked in the court with the Chapter 1 line quoted back, and Anissa's one line
  in the chapter is recognising her. It changes no flow (the Hushed is still the Regent's agent, unmasked in his
  court, and Rael is still confessed at the Hearing) and it gives a faceless figure a face the player has already
  seen, which is what "unmasked" should mean in a game that shows. If the owner would rather the plaza's woman stay a
  recruiter and the Hushed a stranger, the Almoner's line to Anissa becomes "Your sister has kept you very close"
  for everyone, Anissa's line becomes "Gigi. She's the one with the basket," and nothing else moves. Recommendation:
  keep it; it is not a change to the story's flow, so it is a Claude's call here and not a pop-up.

The Claude's calls, each with its reason:

- **The Regent presides at Kingsmere's Assize, and the Crown's fleet sails after it.** *Reason:* the design's "the
  courtroom trial before the Regent" and "revealed inside the Regent's court" need him in Kingsmere; Chapter 5 had
  him at Eightgate and Chapter 12 has him there again; an assize is why a Regent goes home, and a fleet after it is
  Chapter 11's war given a date.
- **The landing is the Mere Stair, the escort walks the party in, and the city is watched by constables who are
  sorry** (beats 0 and 1). *Reason:* the Chapter 8 outline's hand-off; "tired, polite and watched" shown by people
  who follow, not by a speech; ordinary Stillwater people are not villains.
- **Edmund joins at the pie shop as a fighter and defies the Regent in the court** (section 9.1), splitting
  `STORY.md`'s "defies the Regent and joins". *Reason:* Chapters 6 to 8's precedent; the Guardian against the boss
  whose weapon is silence; the defiance where it costs him.
- **Jordyn opens the postern in secret, arrests the party by the book when they are caught, and resigns in open
  court with six of the watch** (section 9.2). *Reason:* FAMILY.md's "defects and opens the keep's postern" kept and
  given an order; the arrest is what puts the party before the Assize instead of on the heath, keeps her cover until
  the court, and is the fair woman the owner described; her seven are the dissidents' army and Chapter 11's company.
- **Anissa sits in the organ loft with Sebastian during the break-in, seen by the court, and is in the dock with
  Gianna for the trial** (beats 3, 5, 7). *Reason:* Jordyn's condition ("put her where four hundred people can see
  her"); the owner's rule that she holds the door is kept in spirit (she is the thing everyone is watching while the
  door is open) and her hints still reach Gianna in the Echo; the boss needs her in the room, and the dock is where
  the accused stand.
- **The Echo is the first revisiting, a season after the sealing, and Patricio hides Thomas's record** (beat 5;
  section 8). *Reason:* `STORY.md` 6.4's proposal ("under a flag of truce to negotiate the peace") is kept in
  substance (a flag of truce; Thomas meets him there) and moved a season later so the war council can hear of Benny's
  refusal and order the record cleaned in the same scene, which is what the chapter's Echo is for; anchors are things
  Patricio does. Recorded for the Dec 1 list as a refinement of the proposal, not a new question.
- **The pact is bait; the Almoner springs it; the Regent dismisses her in a sentence and the commission is in his
  hand and never provable** (beats 6 and 7). *Reason:* three moves ahead, as in Chapters 5 to 8; the design's "the
  Quiet Crown has been bent to hunt Anissa by the Regent's people" shown by where she stood and who set her down;
  Chapter 12 stays a Challenge.
- **The courtroom's rule is the Witness's: a forsworn witness's evidence falls with her** (beat 7). *Reason:* guide
  7.1 (Aldermoor's faith is law as an oath); it makes the puzzle's logic the city's, not a courtroom drama's.
- **Thomas's record is read into the roll, Rosalind stands for it, and Al-5's outcome is paid in the main story**
  (beat 7; section 7). *Reason:* the plan's minimum ("Thomas's record") shown as a thing done in front of the city;
  the Gen III ruler Edmund defies does her turning in the court, which is cheaper and better than a tea after the
  release.
- **The Hushed at hp x7 with `magScale 2`, `hushed` as her status, Hush the Light as Calm -2 with `seize` as the
  fallback, Quiet Crown as Weakened and Calm -1, two Hushers at the start and two at the end; she falls and is taken,
  not withdrawn** (section 5, section 10). *Reason:* the sim; COMBAT's three phases in the engine's words; the owner's
  redesign of her Anissa move; a boss whose cells kneel to her has nowhere to withdraw to.
- **The Hushed's end is a choice (tried under the Witness's law, or shown to the city), and she names nobody.**
  *Reason:* the Chapter 8 pattern (Dhanraj); the design's "no member knows" kept in her mouth.
- **The dissidents' price is paid in Fear by the court, Jordyn's company, the published list and Edmund's going; no
  token, no betrayal line; `ally.aldermoor_dissidents` set regardless with the Journal's count** (beat 8). *Reason:*
  the Chapter 3, 6, 7 and 8 pattern; the dissidents are not a house at the chair (the Chapter 8 outline's ask) and
  not among the four the Crown can buy (guide 5.6).
- **Al-3 and Al-2 are the required two; Al-3 opens before the court; Al-2's Echo step is replaced by Thomas's own
  margin in the present; Al-1 is the first post-release quest; Al-5's tea after; Al-4's tower inert** (section 7).
- **St. Agatha's is added and Rosalind's Townhouse waits** (section 3). *Reason:* the settled Sebastian line.
- **Five maps; the keep is 40 x 30; the Heath carries the landing** (section 3).
- **The Heath's groups are trios at 23 to 24** (section 5). *Reason:* the sim: pairs are trivial to this party.
- **The chapter's data adds two levels to a measured start, and `CHAPTER_LEVELS` 9 is set on day 1 from the
  measurement** (section 5). *Reason:* the numbers; the Chapter 6 to 8 reviews' rule.
- **Sebastian does not know the family secret; Jordyn knows the daughters and nothing else; each has one line about
  Rael that reads either way** (sections 9.2, 9.3). *Reason:* FAMILY.md's list of who knows; Kayla's and Aiyana's
  precedent; the content test and a human read guard it.
- **Sebastian is a Limyè in public** (section 9.3). *Reason:* the Chapter 5 outline's Coralie.
- **No Echo battle; the council is heard through a door** (section 4).
- **Names are proposals** (Edmund, Rosalind, Thomas, Agatha, Aldric Vane from the design; Mrs. Sallow new; St.
  Agatha's new), people named by role in the build until the owner approves.

---

## 13. Length

Estimated from Chapter 2's measured route (1,020 steps, about 40 minutes) and Chapters 6 to 8's estimates (760, 830
and 840 steps, about 30 minutes each):

| Part | Steps | Transitions | Lines | Fights |
|---|---|---|---|---|
| The voyage, the Mere Stair, the notice post, the heath road, the Moor Gate | ~90 | 2 | ~20 | 0 to 1 ambush |
| The Market Cross: the lady in grey, the press-gang, Edmund | ~70 | 1 | ~35 | the press-gang |
| The keep: the hall, Jordyn at the door, the Regent's answer | ~70 | 2 | ~40 | |
| The close after the bell | ~30 | 2 | ~20 | |
| St. Agatha's: the organ, Sebastian | ~50 | 2 | ~30 | |
| Al-3: the barn, the bog chapel, three doors, the barn again | ~160 | 4 | ~35 | the chapel, 0 to 1 ambush |
| The debate on the cross, the Rolls House | ~50 | 2 | ~30 | |
| The eve: the court's walk, the recital, the close, the keep by night, the archive (both eras), the cabinets | ~120 | 4 | ~45 | |
| Caught, the cells | ~40 | 2 | ~25 | |
| The Assize: the witnesses, the dock's Echo, the exposure, the Hushed, the Yield, the three defiances | ~60 | 1 | ~55 | the boss |
| The price, Jordyn's going, Sebastian's, the stair, the card | ~70 | 2 | ~35 | |
| **Chapter 9** | **~810** | **24** | **~370** | 3 to 5 |

About **33 to 36 minutes**, the plan's number: fewer steps than Chapter 8 and more lines, because a court is a room
where people talk. The main line alone (the gate holds, so a player cannot) is about 20 minutes.

---

## 14. Continuity into Chapter 10 (Pòdlimyè, The Muster; 24 to 25, ten minutes plus side content)

- **The lead:** the Crown's fleet sails after the Assize (the Regent, twice); the allies must assemble before it
  reaches Xaraguá. The voyage `aldermoor_zetwal` from the mere's mouth to Pòdlimyè (22, 62 to 91, 37); `?chapter=10`
  starts on Pòdlimyè's long pier; Chapter 10's landing sets the built `story.zetwal_return` (the Cane Road's ambushes
  at 22 to 25, `cane_road`, built).
- **Who arrives at the Muster from here:** Jordyn's company by land and a ship she finds (seven of the watch, the
  barn's lot: `army.aldermoor`), with **Rahel** and **Patricia** (FAMILY.md: "She arrives with Jordyn's company";
  Patricia "comes with Rahel"); Chapter 10's outline stages their arrival on the plaza and gives Rahel her scene with
  Gianna and Anissa and her line for Azzy, and Patricia her blessing. **Joaquin** brings Free Brasador (Chapter 3's
  seed). Sebastian is a door, not a plan.
- **The feuds for the Muster:** Suzumori and Agnivansh have taken one step (Chapter 8); Dorini and Ironvow have not;
  **the Stillwater dissidents against everyone** is this chapter's: the printer's people are the Crown's own, Edmund
  is a councillor's son, and Jordyn's company wears the Regent's violet inside out. The Muster's third mediation has
  its faces.
- **The betrayal:** unchanged. Aldermoor is not among the four; nothing here names the closed hand; the Almoner says
  "I was given the cells" and no more; Prakash, Mibu and Hrafn are where Chapters 6 to 8 left them. The exposed route's
  Kuroshi evidence is still the Fog Files.
- **The party leaves with:** Gianna, Yari, Azzy, Samira, Bayarmaa, Haru, Vikram, **Edmund**, Anissa (nine, eight
  fighters, four active by `party.active`); Salkhi; **level 22 by the tool** (6,785 to 6,925), **24 as played** from
  the assumed start of 22 (23 from 21, 25 from 23: section 5; Chapter 10's outline plans from the measured end, and
  its band of 24 to 25 absorbs either neighbour); the Echo party unchanged; gold about 2,500 to 3,500 less the
  outfitter; key items plus **the Crown's pact**, **the Ash Road Accounts** (coded; Haru reads them after the Harbor
  Turn), **Thomas Stillwater's True Record**, **the Crown Chronicle** (the third account), **the purge list**, Edmund's
  hat, the recital bill, the Almoner's brooch; flags `story.aldermoor_arrived`, `party.edmund`, `party.active`,
  `story.edmund_defied`, `story.jordyn_defected`, `story.rosalind_withdrew`, `ally.aldermoor_dissidents` with
  Aldermoor's Fear 6 to 10, `army.aldermoor`, `clue.first_revisiting`, `clue.crown_pact`, `clue.ash_road_accounts`,
  `clue.ratification`, `clue.hushed_regent`, `clue.list_leaked`, `anchor.thomas_record`, `story.record_read`,
  `story.hushed_beaten`, `choice.patricio_thomas`, `choice.hushed_tried|broken`, `side.purge_list.done` (the
  thumbprint count: **eight**), `side.crown_chronicle.done`, the debate's outcome, `act9.complete`.
- **What Gianna believes:** her father took the Crown's gold for a chair and spent it where nobody can read
  (`belief.rael_traitor` unchanged, now with a receipt). No clue moved here; the "nobody dies" pattern grew by one
  (the Hushed fell and was taken, not killed); the eighth thumbprint was found inside the cult's own cells with "Warn
  them first" on it; Jordyn's "Keep the law" and Sebastian's weather are the family's two lines, both reading either
  way. Azzy's "four of his sisters, and this one arrests people" is the pattern named once more; Chapter 10's Rahel is
  the mother, and the one who speaks.
- **What the realm knows:** the Crown pays a thief (6), buys files (7), funds a hoarder (8), and at home keeps an
  almoner whose cells hunt a child and a court that dismisses her in a sentence (9): the same hand four ways, and the
  fourth is the Regent's own house. The Crown always meant to keep the harbor (the council, fifty years ago, in its
  own voice). Thomas's record is in the Assize's roll. The fleet sails.
- **S-SEA (the Seventh Ribbon, after the release)** is now finishable: Thomas's record exists in the present.
- **Nothing built in Chapters 3 to 8 is touched** except `CHAPTERS`, `chapters.json`, the route, `encounters.ts`
  (`heath`), `MEMBERS` (Edmund's entry), the voyages, `enemyStats` (`magScale`, one line), the statuses (`hushed` if
  new, `shielded`) and Calm, each behind a test that Chapters 2 to 8's fights replay unchanged.

---

## 15. Risks

- **The level curve, again, and the band's width.** The tool lands at 22 against a target of 24, and the honest
  reason is STORY's band (three levels in 35 minutes). This chapter's data adds two levels to whatever it inherits;
  the fix is the measurement on day 1 and `CHAPTER_LEVELS` 9 set from it, said in the milestone note (section 5). If
  the central session would rather the chapter pay three levels, the only honest lever is the Heath (ambushes at full
  weight, no taper), which is the lever every review has asked to be turned down.
- **The Hushed is harmless without `magScale`.** This is the chapter's one hard engine fact: a caster boss's spells do
  not scale in the built engine, and the sim shows her at any HP cannot put a fighter down. One line fixes it; the
  fallback (physical moves with `atkScale`) is unsimulated. Build the line on day 1 and re-run the sim with the real
  `hushed` before the courtroom is wired.
- **`hushed` and Calm touch the one path every fight uses.** Each is behind a test; `battle.test.ts` must replay
  Chapters 2 to 8's fights unchanged before either lands. The fallbacks (`weakened`, `seize`) are the sim's and play.
- **Edmund must matter in his own fight.** The sim wins faster with him benched because it has no `hushed`; with the
  real status, Guard-heavy play and Shield Wall are the answer to a court that takes your words. Day 1's sim with the
  built status must show Edmund active beating Edmund benched; if it does not, the Hushers' Hush goes to every 2 and
  his Long Watch is built, not text.
- **Eight fighters and the active-order flag.** If `party.active` did not land in Chapter 8, Edmund fourth in
  `MEMBERS` benches Vikram a chapter after his own. It is the first thing checked on day 1.
- **The courtroom is the chapter's heart and is easy to make a cutscene.** The witnesses are a tree the player
  presses; the roll is an Echo the player steps into; the record is a thing the player asks the clerk for; the
  exposure is Gianna's line only after the two are laid; the three defiances are walkers (Rosalind stands, Edmund
  steps, Jordyn's seven step out). If the build runs short, the tree keeps its three presses and the Echo, and the
  defiances keep their walks and lose a line each.
- **Jordyn's and Sebastian's lines are the chapter's tightrope, as Kayla's and Aiyana's were.** The content test
  (section 9.2) is the guard; the reviewer should read every Jordyn and Sebastian line, and Azzy's "she's in the
  rain", against the locked rule.
- **Anissa in the dock.** She is behind Gianna on the dock's bench; the Hushed turns to her and Gianna steps in front
  before the fight starts; Hush the Light is a whisper and Calm, never a blow; the almswomen's heads turn and nobody's
  hand does; the Regent's breath is the Chapter 5 beat. Her one line is earnest and answered. Edmund's hat and
  Sebastian's pages are her two touches and neither is a joke, and no Salkhi, Samira or Vikram line shares a node with
  hers.
- **The Regent's hand is seen and never proven.** That is by design (Chapter 12 is a Challenge), but the reviewer
  should check that the chapter does not accidentally prove it: the commission is read by Jordyn and denied by him;
  the Journal's note says "in the Regent's hand, which the Crown denies."
- **Tone.** Edmund is sorry in seven places (the sergeant, the city, the hat, the archive's seal, the Captain, the
  Regent, the deck) and the line is different each time; "terribly sorry" is said four times. The Regent is cold and
  never cruel; the constables are sorry; the Crown is a court. No jokes in the close, the archive, the cells, the
  dock or at "Sat."
- **The Echo's date.** The first revisiting is a refinement of the Dec 1 proposal; if the owner's answer on Dec 1 is
  "before the peace", the council's lines change to the Crown's intention before the signing ("'To be revisited'
  will mean when we choose") and Benny's refusal becomes "Ardencia will refuse"; the scene, the order and the anchor
  do not move.
- **Faith on the map.** The Witness is a fictional faith of oaths, and the court uses it as law; the Quiet Crown's
  hierarch is a believer and its Hushers are a bent cell; no real faith is shown as a cult (guide 7.3); the
  cathedral is "St. Agatha's" for a fictional founder, and the fluent check (Nov 18) has no new language here, only
  the register.
- **Names.** Every new name is a proposal; the build names people by role; Rosalind as the Gen III ruler Edmund
  defies is on the Dec 1 list (STORY 6.10), now needed by early November, and this chapter's court answers it in
  practice.
- **Chapter 8 may land late, and its review may change its end.** Everything here except the voyage's start can be
  built from the Chapter 8 outline's section 14 state before Chapter 8 is done; `?chapter=9` needs Chapter 8's route;
  until then the chapter is tested from a hand-written start save with section 1's state. If the Chapter 8 review
  moves Vikram's join, the active order or the taper, sections 1, 4 and 5 move with it and nothing else.
- **The Nov 8 decision date.** The plan says that if Chapter 9 is not built by Nov 8 the owner chooses between
  Chapters 1 to 9 polished and all twelve plainer. This outline is sized to Nov 5 to 8 with the cuts in section 16;
  the milestone note on Nov 8 should say which half of the cut list was used.

---

## 16. Build plan (small steps, each checked before the next; sized to two and a half builder-days, about Nov 5 to 8)

**Day 1 (Opus with Sonnet on maps and content):**
1. **Docs and the numbers (morning, 1 hour):** the second review; `STORY.md` Chapter 9 rewritten to this outline
   (the Mere Stair, Edmund's split join, Jordyn's three acts, Sebastian's loft, the first revisiting, the Witness's
   rule, the Almoner, the price in Fear), `CAPITALS.md` 9 re-sized (five maps, St. Agatha's, the keep at 40 x 30, the
   Townhouse after the release), `SIDE-QUESTS.md` Al-2 and Al-3 marked for the release with the new numbers and
   Al-2's Echo step replaced, Al-1, Al-4, Al-5 after, `PUZZLES.md` SIG-ALM's staging (the cabinets, the tree),
   `COMBAT.md` 9.8 with Edmund's stat line, 13.3 with the Hushed's scaling and `magScale`, 8 with Calm as built,
   `FAMILY.md` Jordyn's and Sebastian's rows marked built with the Claude's calls (the arrest; Sebastian does not
   know), `STORY.md` 6.4's refinement noted for the Dec 1 list, Edmund's, Jordyn's, Sebastian's, the Regent's seated
   look, the Almoner's two looks and Rosalind's prompts into `ART-PROMPTS.md`. **The played start measured** (the
   Chapter 6 review's 3.1 (b)) and **`CHAPTER_LEVELS` 9 set from it**; **the active-order flag's state checked**;
   **`hushed` and `strip` checked** (Chapter 7's).
2. **Engine and data (Opus, half a day):** `magScale` (first), `hushed` if new, Calm and Comfort with `EnemyMove.calm`,
   `shielded`, `healShare`, `defPerGuard`, `hpShare`, Edmund as data (entry, skills, moves, looks, two items), the
   Heath's six enemies and the Hushed with her phases and two looks, the audio slot keyed by flag (each a few lines,
   each with a unit test; `fighters.test.ts` grows by one; `battle.test.ts` re-asserts Chapters 2 to 8's fights), the
   voyage. **The sim re-run with the built `hushed` and `magScale`** (the scratch bot moved into `tests/`): x7 holds
   or drops to x6; Edmund active beats Edmund benched.
3. **Maps (Sonnet, the rest of the day), the keep first:** `tools/maps/aldermoor.ts` with the five maps of section 3;
   the archive's zone, the panel's anchor and the six cabinets replayed headless by a draft
   `puzzles/aldermoor_archive/solution.json`, then the courtroom with the dock's zone and the clerk's table, before
   the square is drawn; then the Heath with the stair, the road, the barn, the chapel and the ambush layer; the
   square with its variants; the Rolls House; the cathedral with the loft; the rain layer; validated; the city entry
   in `CITIES`.
4. **Content (Haiku and Sonnet, in parallel):** fourteen books (*The Charter of Protection, Explained* written to give
   the year; the public and true editions of Thomas's record written against each other; *The Witness and the Law*
   written to give the court's rule), the `heath` table and `aldermoor_story` groups, the vendors and the five items,
   the looks (section 11), the speakers, the audio slots (rain, a hat hitting a sergeant, an organ, a seal breaking, a
   cabinet drawer, a court's murmur, a veil; the square plays the farewell track until Kingsmere has its own).

**Day 2 (Opus with Sonnet on dialogue):**
5. **Dialogue and the story wiring (the morning):** `data/dialogue/aldermoor.ts` staged from the beats, in this order
   so an interruption leaves a playable chapter: the stair, the post, the road, the gate; the square, the lady in
   grey, the press-gang, Edmund; the hall, Jordyn at the door, the Regent; the close; the organ, Sebastian; the eve,
   the recital, the postern, the keep by night, the archive in both eras, the cabinets; caught, the cells; the Assize
   (the tree, the dock's Echo, the exposure, the Hushed, the Yield, the three defiances); the price, the goings, the
   stair, the card. `ACT9` in `quests.ts` with hints and goals; the Journal notes (*The first revisiting*, *The mirror
   file*, *The roll*, *The ash thumbprint (8 of 9)*, *The four accounts: three read*, *The Stillwater dissidents*,
   *Jordyn*, *Sebastian*).
6. **The quests (early afternoon):** Al-3 (the printer, the chapel, the list and its cover, three doors, the press),
   Al-2 (the shelf, the fly-leaf's two looks), the debate *Should the Throne have one hand?* (two speakers, three
   rounds, the Reason books, the hierarch's line after), the board's two jobs.
7. **The puzzle files and tests (late afternoon):** `puzzles/aldermoor_archive/`, `puzzles/aldermoor_assize/`; an
   `assize_hushed` bot test on seeds at 21 to 24 with the real statuses, with Edmund active and benched; a
   `press_gang_cross` and `bog_chapel_cell` test; quests, guide, debate, side-quest, maps, stage and content tests
   green; the content tests: no Salkhi, Samira or Vikram line in a node with an Anissa line; no Jordyn or Sebastian
   line with "good", "innocent", "feeds", "the arrows" or "thumbprint"; no line joining "Regent" to "almoner" in the
   Journal without "denies"; no line naming the closed hand or the thumbprint "the Quiet Crown's" or "Rael's".
8. **The route (evening):** Chapter 9's route from its chapter start to `@chapter9-end`; `chapter-starts.ts` with
   chapter 10; `act.test.ts`; `tools/level-curve.ts` run and the XP dials set (section 5); the smoke test's Chapter 9
   section with screenshots of the notice post in the rain, the escort on the road, the lady in grey crossing the
   square, Edmund with his hat off, the Regent seated with the Almoner behind him, Jordyn at the door, Jordyn in the
   close, Sebastian coming down the loft stair, the court walking to the church, Anissa in the loft, the postern
   unbarred, the archive's cabinets, the Echo's gallery with Thomas, the panel open, the standoff in the hall, the
   cells, the dock with the roll in the Echo, the clerk comparing hands, Rosalind standing, "Enough noise", the
   unveiling, Jordyn's seven stepping out, the dissidents' line at dawn, at 844 x 390 and 390 x 844.

**Day 3 (morning):**
9. **Full browser test:** the chapter end to end on a phone; the court lost (Game Over returns to the courtroom's
   doors with the record read) and won; both of the Hushed's ends; Game Over on a Heath ambush (back to the road) and
   at the chapel (back to the road); a save in the cells and on the eve; `npm test`, typecheck, lint, build; the
   reviewer prompt in `reviews/reviewer-prompts/` (the Chapters 6 to 9 batch, about Nov 9); the Nov 8 milestone note
   with the level statement; then Chapter 10's outline, which overlaps with this build from day 2.

**If day 2 runs over, cut in this order:** the eve and dawn variants (lines), the Rolls House's books from nine to five
(*The Charter of Protection, Explained*, *The Witness and the Law*, *Dame Agatha's Patience*, *Court Circular*,
*Thomas Stillwater's Record (public edition)*), the sightline strips (the hall dark and empty: "the Sealbearers are at
the recital"), the Long Watch and Stillwater's Patience (their fallbacks), Calm and Comfort (`seize` with the tell),
the law-seal brooch's special, the board's two jobs, the escort pair on the road (a line at the gate). Never cut:
Edmund active in battle, Jordyn's three acts (the postern, the arrest, the resignation), Sebastian's organ heard
before he is seen and playing under the break-in, the Echo with the council through the door and the panel as the
anchor, the cabinets with the year and the seal, the dock's Echo, the Almoner's lie broken by the roll and the
record, the Hushed with `magScale` and `hushed`, the three defiances walked, the price with the count, the two
required quests and the debate.

Every step ends with the owner reminded of `docs/PRODUCTION.md`'s open items, most urgent first: art drop 1 (Fri Oct
24); card art, portraits and the card back before the rules and card text freeze (Fri Oct 31); order B with proofs
(Mon Nov 3); the Nov 8 decision date (this chapter is the one it is about); the Dec 1 story questions, now needed by
early November (the Aldermoor ledger and Patricio in Aldermoor are both paid in this chapter as Claude's calls, the
second refined; Rosalind is this chapter's Gen III ruler); the fluent-speaker check (Wed Nov 18: this chapter adds no
new language).

## Decisions after the second review (Oct 22)

- **Claude's call:** the build takes every fix in section 6 of `2026-10-22-chapter9-outline-review.md`. Specifically:
  - Anissa comes through the postern with the party and holds the Echo's door, not the organ loft.
  - Sebastian's bill reads "that's Grandpapa's name".
  - Al-2's panel is behind the shelf.
  - The dissidents' price can be short.
  - The Hushed has `magScale` 1.25 at HP x7 and Hushers with `protects`.
  - The XP plan is re-run against the levels pass.
  - The build is planned at 3 to 3.5 days.
- **Owner decision (Oct 22): yes.** The Almoner is the veiled woman from Chapter 1's Cane Road. The
  facts are corrected per review finding 2: the Cane Road by the mill, `choice.warned_watcher`, Gianna's own words,
  and her line "No one. That is the point of us." quoted back at the unmasking.

## Built (Oct 22): what changed from this outline, and Claude's calls

Built on branch `chapter9` (from `chapter8` at `e371293`), with every fix in section 6 of the second review
(`2026-10-22-chapter9-outline-review.md`) and the decisions above applied. Code: `quest/tools/maps/aldermoor.ts` (six
maps: the heath, the Market Cross, the Rolls House, the keep, the close, St. Agatha's), `quest/src/data/aldermoor.ts`
(places and conditions both the maps and the scenes read: `DAY_DONE`, `EVE`, `KEEP_NIGHT`, `LAST_DAWN`, `RAIN`, the
cabinets), `quest/src/data/dialogue/aldermoor.ts`, `ACT9` in `quest/src/data/quests.ts`, the Aldermoor entries in
`battles.ts`, `encounters.ts`, `sideQuests.ts`, `debates.ts`, `books.ts`, `rpg.ts`, `npcs.ts`, `speakers.ts`,
`objects.ts`, `cards.ts`, `voyages.ts`, `weapons.ts`; the engine's `magScale`, Hushed taking the weapon moves and the
heal by share (`healShare`) in `engine/battle.ts`; Edmund as the eighth follower in `scenes/FieldScene.ts` and a stage
actor (`STAGE_PARTY`); the shore `aldermoor` in `engine/voyage.ts` and `scenes/VoyageScene.ts`. Tests:
`quest/tests/aldermoor.test.ts`, `assizeFight.test.ts`, the Chapter 9 parts of `act.test.ts`, `goldWalk.test.ts` and
`levelCurve.test.ts`; puzzles `aldermoor_archive` and `aldermoor_assize`. Commits: engine `95ce942`, content
`17a391d`, tests `0d04d6c`, then these docs.

**The review's fixes, as built:**
- **The boss (3.1).** The Hushed is level 24, **HP x7, MAG x1.25** (`magScale`, new: a caster boss's spells now scale
  as a striking boss's blows do); two veils (`court_husher`) stand in front of her (`protects: 'the_hushed'`). Hush is
  an area spell every third turn (half the party, two turns); **Hushed blocks the weapon moves too** (Attack, Guard
  and Item only; written into `COMBAT.md`). At 60% *Hush the Light* (aimed at Anissa: Gianna steps in, `seize`); at 25%
  the veil comes off and two more veils come down the gallery stair. She withdraws at 0 HP ("goes down on one knee").
  The sims count falls across the whole party. The start tip is the review's: "She takes your words, Gigi. Plain
  blows still land. My light still comes. Edmund, hold them." (Anissa's Light is no skill, so Hush never takes it;
  Gianna's light spells are resisted and are skills.) Measured with Edmund benched and with a party at 20 (below).
- **Chapter 1's veiled woman (3.2; owner decision Oct 22: yes).** Her talk on the Cane Road sets `story.watcher_met`;
  she is placed only while `!story.hushed_beaten`; Anissa's and the Almoner's lines in the court branch three ways
  ("That's the lady by the mill. On the cane road." / "Your sister told me to stay away from you. I did." / "Your
  sister has kept you very close."); at the unmasking she says "You wanted a face. It is no one's. That is the point of
  us."; "the Hushed" is seeded on the purge list and at the bog chapel; the Almoner's veiled look is the road
  watcher's (`quiet_crown_f_brown`).
- **Sebastian Jean-Philippe (3.3).** The bill on the heath's notice post; Anissa reads it: "Jean-Philippe. Gigi,
  that's Grandpapa's name." Gianna: "That's Mummy's brother. He writes to her about the weather." (the organ line is
  cut).
- **Anissa (3.4).** She comes through the postern with the party and holds the Echo's door at the archive ("The floor
  is shimmering, Gigi. I can hold the door."); she is caught and arrested with her sister; Sebastian visits the cell
  and passes a blanket through the bars.
- **Levels (3.5).** Planned from 21. Chapter 9's steps pay **70** (`XP_PER_OBJECTIVE_BY_CHAPTER[8]`; three pay nothing:
  the Mere Stair, the Toccata's follow-the-quest step, home). The Hushed 260, the press-gang 50, the bog chapel's cell
  40, Al-3 60, Al-2 40, the debate 15, seven books. `CHAPTER_LEVELS` 9 unchanged (21 to 24). Measured below.
- **Al-2 required (3.6).** Thomas's panel is behind the Ash Wars shelf: lifting the chronicle down is the way to it
  (Edmund walks the shelf a foot to the right). The archive's door sends the party back in ("Not yet. Thomas's panel.
  The drawer. The book.") until the pact, the anchor and Al-2 are all done.
- **The price (3.7), option (a).** Fear at Aldermoor: Al-3 +3, the Hushed beaten +1, Jordyn's defection +1, the
  Hushed broken before the city +1 (or tried by their law: Influence +1). **Floor 5, ceiling 6** of a price of 8: the
  dissidents' printer says "Not afraid enough. Not yet. Your Muster can collect the rest." when it is short, and
  nothing is counted twice (the court is Influence, not Fear).
- **Story logic (3.8).** The council in the Echo: "And the Marshal sealed the binding." with the protest branched on
  `choice.patricio_protest`; the dock's Echo is the court and the roll over an empty dock (no Caona, no Patricio);
  Thomas writes the true record again here, at a quarter to three by the tower bell; on the eve the Almoner stops at
  St. Agatha's west door, turns and walks back to the keep; the commission is "Under the Throne's seal. No hand."
  (the Journal: "The Crown disowns any almoner."); Jordyn returns the evidence at dawn by the book; the Regent's "Not
  today."; St. Agatha's west door is held ("Rehearsal") until Jordyn has named the hour; Haru's "He said he was always
  at Eightgate." / Edmund: "He says that everywhere."; the door's filing rule has its second line ("Matters touching a
  clause are filed with the clause.") and the honest drawer's slip reads "removed to the Lord Regent's keeping"; the
  trader never counts nights at the end; Edmund was the Chapter 5 legate's aide ("Miss Yari. I read your petition, at
  Eightgate. Somebody should.", when the player met the aide in Chapter 5, `side.seats.aldermoor`), and that aide's look
  is now Edmund's.
- **Tone (3.9).** The organ line is cut; Samira's "I may enjoy this" and Anissa's rain line are in separate nodes at the landing; Edmund's sitting line is gone with 3.4;
  Sebastian's review line is cut; the tip is fixed; "spoken about" in the docs; a human read of the archive scene and
  every Jordyn, Sebastian and Almoner line is in the reviewer prompt.
- **Shown (3.10).** One of Al-3's three doors is too late: the tea shop with the shut door. A woman opens it and cannot
  say her name; Haru reads it off the list and she nods. No line from her, no Anissa in the node. Gianna: "We were too
  late for one."
- **Engine claims and budget (3.11).** The escort are stage actors placed at the gate; the rain is a map-mood wash on
  a condition (`RAIN`, not a tile layer); the cabinets are dialogues whose choices set the year dial and the seal switch
  (flags with values) and whose pull branches on `eq`; no conditional encounter weight, no grace; Edmund walks as the
  eighth follower and is borrowed as a stage actor; the shore `aldermoor` is built. Cut from the start: Calm and
  Comfort (`seize` with the tell), the Long Watch, Stillwater's Patience, the law-seal brooch's special (stats only).
  The build took about the review's 3 to 3.5 days of work in one session.
- **Game Over and saves (3.12).** A loss to the Hushed leaves the party in the court where the fight began (at the clerk's table, just above the dock; checked in the browser by the smoke test, Oct 22): the watch holds the courtroom's
  door ("The court will wait, envoy. Mend. Nobody leaves while it sits."), and a step on the dock's edge replays
  "Enough noise." and the fight (`hushed_again`; tested). The cell's bench has "Sleep." (the dawn), and a save in the
  cell reloads to the same night. The heath's and the chapel's fights use the built rule (one step back).
- **Pacing (3.13).** The close's bell is a scene cue; the eve is a condition (`EVE`: the day's four done, the recital
  not begun), not a global dusk.

**Other Claude's calls in the build:**
- **Six maps, not five:** the close is its own small outdoor map (`aldermoor-close`, 18 x 7), because the hall and the
  close share no path and the arrow and the doors must see them apart. The others: `aldermoor-heath` 46 x 28,
  `-cross` 42 x 30, `-rolls` 22 x 14 (an interior), `-keep` 40 x 30 (the archive, the hall, the courtroom, the yard,
  the cells), `-cathedral` 26 x 18.
- **The voyage** `jwaladesh_aldermoor` from Agnipur's quay (Chapter 8's last scene now sets it); `?chapter=9` starts at
  the foot of the Mere Stair after it; the voyage home `aldermoor_zetwal` lands on Zetwal's harbour, where
  `?chapter=10` starts.
- **Edmund joins at the pie shop on the Cross** (the press-gang) and leads (fights second) until `act9.complete`, then last. Built: base HP 58
  (Aldermoor's Vigil folded in), SP 18, ATK 11, DEF 12, MAG 5, SPD 8; growth HP 7, SP 2, ATK 2, DEF 2, MAG 0, SPD 1;
  the pattern sword of guarding and the Stillwater greatcoat. **Shield Wall** (8 SP) wards the party, a quarter less for 3 turns (the built
  `warded`, Claude's call for "x0.5 from the next hit"); **Tea Break** (10 SP) heals each ally 15% of their own max HP
  (`healShare`, new; no Calm). Weapon moves: Shield Bash, Measured Blow, Hold the Line.
- **The Rolls House** has five books and the keep two (seven in all), as the cut list allowed; the printer works in
  the barn's yard (no barn interior).
- **The Almoner's unveiling** in battle is a line, not a change of look (the field shows the unveiled look after).
- **XP per objective 70**, the Hushed 260, Al-3 60 (the review's 180 and 280 were planned before the levels pass made
  steps pay by chapter; the measured curve is on target).
- **Al-3's family step** is one flag (`story.families_warned`), set when the third door is done in any order.
- **Names by role:** the printer, the clockmaker, the keep's steward, the assize clerk, the Crown magistrate, the
  witness bishop, the sorry constable; Jordyn, Sebastian, Lady Rosalind, the Almoner and the Lord Regent as the outline
  has them.

**Levels (`tools/level-curve.ts`, seeds 1 to 200):**

| Ch | Target | Route end (XP) | No side quests | Played median | Played p90 | Wanderer p90 |
|---|---|---|---|---|---|---|
| 7 | 17-19 | 19 (5,493) | 17 (4,243) | 19 (5,525) | 19 | 20 |
| 8 | 19-21 | 21 (6,448) | 19 (5,113) | 21 (6,480) | 21 | 22 |
| 9 | 21-24 | **24 (8,028)** | **22 (6,538)** | **24 (8,060)** | 25 | 25 |

Chapters 1 to 8 are unchanged (4, 8, 11, 14, 15, 17, 19, 21). Four wild steps on the route in Chapter 9 (no ambush on
it). The Muster (24 to 25) is met at 24 (25 needs 8,082). Skipping the side quests' rewards leaves the party two under,
within the rule.

**Fights (`tools/battle-sim.ts`, 40 runs each, at the route's markers; falls counted across the whole party):**

| Fight | Plan | +0% | +30% | +50% |
|---|---|---|---|---|
| The Hushed (`aldermoor-assize`, party 21 with Edmund) | Attack | 31/40, 45.7 actions, 89% hurt, 5.9 falls | 40/40, 37.7, 77%, 4.6 | 40/40, 31.9, 68%, 3.5 |
| The Hushed | Spells | 40/40, 31.0, 62%, 2.9 falls | 40/40, 24.2, 48%, 1.9 | 40/40, 20.7, 39%, 1.1 |
| The Hushed | Skills | **40/40, 25.9, 34%, 0.85 falls** (17 runs with a fall) | 40/40, 19.2, 23%, 0.2 | 40/40, 16.1, 19%, 0.1 |
| The Hushed, Edmund benched (party 21) | Attack | 5/40, 6.6 falls | 28/40, 5.7 | 40/40, 4.7 |
| The Hushed, Edmund benched | Skills | 40/40, 30.1, 46%, 1.9 falls | 40/40, 0.9 | 40/40, 0.3 |
| The Hushed, party at 20 with Edmund | Skills | 40/40, 26.9, 38%, 1.4 falls | 40/40, 0.6 | 40/40, 0.2 |
| The Hushed, party at 20, Edmund benched | Attack | 1/40, 6.9 falls | 17/40, 6.2 | 30/40, 5.9 |
| The Hushed, party at 20, Edmund benched | Skills | 40/40, 31.7, 55%, 2.5 falls | 40/40, 1.4 | 40/40, 0.7 |
| Press-gang (`aldermoor-cross`, before Edmund) | Attack | 40/40, 84.4, 47%, 2.5 falls | 40/40, 52.1, 30%, 1.1 | same (capped) |
| Press-gang | Skills | 40/40, 17.4, 8%, 0 falls | 40/40, 12.6, 8%, 0 | same |
| Bog chapel's cell (`aldermoor-chapel`) | Attack | 40/40, 20.9, 24%, 0.2 falls | 40/40, 17.7, 22%, 0.1 | same |
| Bog chapel's cell | Skills | 40/40, 10.6, 11%, 0 falls | 40/40, 8.3, 9%, 0 | same |

The heath's ambushes (at `aldermoor-chapel`): a constable and hounds (Attack 28.4 actions, 28%, 0.9 falls; skills
11.8, 10%, 0), Hushers (Attack 12.5, 12%, 0; skills 7.0, 7%), musketeers (Attack 17.1, 11%, 0; skills 8.2, 4%), a
Sealbearer (Attack 81.9, 44%, 2.5 falls, armored; skills 9.5, 5%, 0). The ordinary fights' Grudge is capped at +30%,
so +50% equals +30% there. No player is trapped in the court: the worst case (a party at 20 without Edmund, Attack
only) wins 30 of 40 at the Grudge's cap, and any use of the kit wins every time. Every fight has a Game Over with a
way back in (`tests/gameOver.test.ts`, `tests/aldermoor.test.ts`).

**Gold-arrow walk:** Chapter 9 end to end with no stall, **574 steps and 15 map changes** (Chapter 8: 767 and 19)
(`tests/goldWalk.test.ts`).

**Puzzles:** `aldermoor_archive` (cheats: the honest year 23 under red, 32 under violet, the panel tried without the
memory) and `aldermoor_assize` (cheats: the steward pressed three times, the record without the roll, the pact laid,
the roll and the record with the Almoner never pressed). Honest difficulty: the archive about 3 (the rule over the
door, the memory's mirrored year and the seal), the court about 3.

**Not built (after the release, as planned):** Al-1 Terribly Sorry, Al-4 The Clock That Waits (the clockmaker's line
at dawn points at it; the tower is inert), Al-5 Tea With Lady Rosalind, Calm and Comfort, the Long Watch, Stillwater's
Patience, the brooch's special, the contract board's jobs, painted art (placeholders), the organ's own music (St. Agatha's
plays an existing track, `audio.config.ts`).
