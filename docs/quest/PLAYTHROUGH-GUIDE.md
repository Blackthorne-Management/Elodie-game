# Your playthrough on the phone (Nov 16 to 20): what to play, what to look for, how to send notes

The whole quest is about six hours. Four sittings of about ninety minutes each cover it, with a day left for my
fixes and a last look before Nov 22.

## Setting up

On the computer, in PowerShell:

```
cd "D:\Blackthorne Management\Projects\elodie-game\quest"
git pull
npm.cmd run dev -- --host
```

It prints a "Network" address such as `http://192.168.1.20:5180`. Open that on the phone (same Wi-Fi), turn the phone
sideways, and tap the full-screen button (top right). On an iPhone, use Share, then Add to Home Screen, and open the
icon instead: that is the full-screen game.

**Keep your progress:** the game autosaves in the phone's browser. Before you stop for the day, open the menu, System,
Export save code, and copy the code into a note; Import save code brings it back on any device.

**Starting at a chapter** (if a day's sitting ends mid-chapter or you want to skip ahead): add `?chapter=N` to the
address in a private window, e.g. `http://192.168.1.20:5180/?chapter=7`. Every jump point is in `JUMP-POINTS.md`.

## The four sittings

| Day | Chapters | About | The moments to watch |
|---|---|---|---|
| 1 | Intro, 1, 2 | 1 h 30 | the intro film and title; the festival; the Cane Road Echo and the boar; Anissa's light at the lamp; the voyage; Anaco taken; the burning plaza; Thorne's blockade |
| 2 | 3, 4, 5 | 1 h 30 | the Trial of Blades (meant to be lost) and the forge Echo; Azzy joining; Al-Doria's vault puzzle; the Eightgate Parley |
| 3 | 6, 7, 8, 9 | 2 h | Ordvik's horn and Grimvald; Kirinoura's fog maze and the file house; Agnipur's Court of Flame; the Assize in Kingsmere |
| 4 | 10, 11, 12, Epilogue | 1 h 30 | the Muster on the sand; the war of the harbor and the Turn; the Claim; the Hearing's verdict, the ending card, The End and the credits |

Side quests are optional: do the ones that interest you; the new ones are K-5 (Chapter 7, the old woman in the Lantern
Library at dawn), J-5 (Chapter 8, the bazaar's contract board) and S-2 (Chapter 6, the lawspeaker after the horn).

## What to look for

Write down anything that makes you stop, however small. The things I most need your eye for:

- **The story:** does each scene say what you meant? Is anyone out of character? Is a line wrong for the culture or the
  language (the Kreyol and Taino phrases go to the fluent reader on Nov 18 as well)?
- **Shown, not told:** anyone who arrives, leaves or acts only in the narration, not on the map.
- **Who is on screen:** someone hidden behind someone else, standing in a wall, speaking from off screen.
- **Reading:** any text too small, cut off, or under a button.
- **Being stuck:** not knowing where to go next (the Quests page and the arrow should always say), a fight you cannot
  win, a puzzle you cannot read.
- **The feel:** a fight that drags or is over too fast, a chapter that is too long, a level-up that comes too often or
  not enough.

## Sending notes

The fastest for me to act on, one line per note:

```
Ch 7 | Lantern Library | the old woman's box: I couldn't tell she took it down | (screenshot)
```

Chapter, place (the name at the top left), what you saw, and a screenshot when it helps (on the phone: the side button
and volume up). Send them here in the chat as they come, or at the end of each sitting; I fix them as they arrive and
keep the list, with what was done for each, in `docs/quest/reviews/owner-playthrough-nov16.md`.
