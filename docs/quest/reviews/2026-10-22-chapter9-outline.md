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
