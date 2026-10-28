# Bloodlines: Echoes of Zetwal: the schedule to November 22

Owner request (Oct 14): a dated to-do list from story to final touches, like the board game's. **Pòdlimyè
(Zetwal's capital) and Chapter 1 (up to Gigi leaving with Yari) must be completely done, with an animated
intro, before we move on.** Dates are deadlines; most items land earlier.

Claude reminds you of these at every milestone, together with the board game's open items (`docs/PRODUCTION.md`).
The board game comes first where they clash: its dates are fixed by the printer.

## The board game's dates (fixed)

| Date | What |
|---|---|
| **Mon Oct 20** | Board order (needs the 4096 map, the 8 seat buildings, your proof approval) |
| **Fri Oct 31** | Rules and card text freeze |
| **Mon Nov 3** | Order B (everything else), expedited |
| **Sun Nov 22** | Everything arrives |

## Milestone 1: Pòdlimyè and Chapter 1, finished (Sun Nov 1)

| Deadline | You | Claude | Done when |
|---|---|---|---|
| Tue Oct 14 | Approve the plans | Levelling, the quest log, gear levels (built); this schedule | Live on the site |
| Thu Oct 16 | | Design pack: story, all capitals, side quests, puzzles, combat, secret items (`docs/quest/design/`) | Files in the repo |
| Fri Oct 17 | Approve the intro storyboard (secret items and side quests approved Oct 14) | Intro storyboard (shots, text, music cue) for approval | Your yes |
| Fri Oct 17 | | Art prompts: Elodie the goddess, Elodie Limyè, Anicette young and old, Patricio young and old, the Sun Locket, Solange's Quill: **done Oct 15** (`docs/quest/ART-PROMPTS.md`) | Prompts sent |
| Mon Oct 20 | (Board order day: no quest asks) | Chapter 1 side quests built (no fighting), each with its own NPC lines: **done Oct 14** | Playable, tested |
| Wed Oct 22 | | The street debate corner (Gaze keeper vs. Quiet Crown recruiter), the last NPC lines, every Pòdlimyè section finished | Smoke test plays them |
| Fri Oct 24 | **Art drop 1:** the six character sets above (reference, portrait, sprites), plus 3 intro illustrations, plus 2 item pictures for the item popup (the Sun Locket, Solange's Quill; square, 32 to 64 px, into `quest/art/items/`) | Convert every set the day it arrives | In the game |
| Sun Oct 26 | | The animated intro (in-engine: pans, fades, parallax, text, music cue), skippable | Plays on phone and desktop |
| Tue Oct 28 | Choose the audio source (see Open decisions) | Audio for Pòdlimyè: festival and city music, temple and Echo themes, sound effects (with an "item received" fanfare for the item popup), wordless voice sounds | You hear it |
| Thu Oct 30 | Play Chapter 1 start to finish on your phone; send notes | Fix list from your notes; balance XP and gold | Notes closed |
| **Sun Nov 1** | **Sign off Milestone 1** | Final checks; the build guide updated | Your sign-off |

## Milestone 2: battles and Chapter 2, Xaraguá (Sun Nov 15)

| Deadline | You | Claude | Done when |
|---|---|---|---|
| Fri Nov 7 | **Art drop 2:** Caona, Governor Thorne, Xaraguá townsfolk; enemy sprites (Crown soldiers, bandits, Quiet Crown zealots) | The battle system: turns, skills, items, Anissa's Surge, the Yield step, the Heir Rises, levels and XP from fights | Unit tested; a first fight plays |
| Mon Nov 10 | | Xaraguá: at least four sections, library and capital building books, the wild section, shops | Walkable |
| Thu Nov 13 | Play Xaraguá; send notes | The Charter story, Caona's Echo, the first boss, Xaraguá's side quests and its secret item | Chapter 2 plays end to end |
| **Sun Nov 15** | **Sign off Milestone 2** | Pòdlimyè's Cane Road ambushes switch on for the return | Your sign-off |

## Milestone 3: release build, Chapters 1 and 2 (Sun Nov 22)

| Deadline | You | Claude | Done when |
|---|---|---|---|
| Wed Nov 18 | Phrasebook check (Kreyol, Taino words) with a fluent speaker | Accessibility pass (text size, colour-blind safe level colours), saves, performance on older phones (done early, Oct 28: guide Section 9.1) | Checks pass |
| Fri Nov 20 | Final playthrough | Fix list closed | No open bugs |
| **Sun Nov 22** | **Release: Chapters 1 and 2** | Tag the release; the board game and the quest ship together | Live |

## After November 22 (honest scope)

The whole game is nine places (eight capitals and Eightgate) and about six hours. At the quality we are
building Pòdlimyè to, one capital takes about a week of building plus your art. So November 22 delivers
**Chapters 1 and 2 complete and polished** (Pòdlimyè and Xaraguá, with battles). The rest follows on the same
pattern, roughly one capital a week: Al-Doria and Ardencia (the reveal, Azzy) in late November and early
December, then Kuroshi, Skarragol, Jwaladesh, Aldermoor and Eightgate, finishing in January. If you would
rather have all nine places by November 22 in a rougher first pass, say so and the plan changes.

## Open decisions for you

- **Audio source** (by Oct 28): free libraries with licences listed in Credits (needs those sites allowed in the
  environment's network settings), or audio you generate with a tool and upload, or a mix. Music in the style of
  each culture: for Pòdlimyè, twoubadou and kompa guitar for the city, rara horns for the festival.
- **Intro content** (by Oct 17): the storyboard comes to you first.
- **Story questions** (by Nov 3, Nov 15 and Dec 1): listed with their dates in `docs/PRODUCTION.md` under "Quest
  story questions for the owner".
