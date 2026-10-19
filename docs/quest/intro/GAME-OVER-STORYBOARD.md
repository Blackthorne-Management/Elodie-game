# Game Over storyboard: the goddess's second chance

For the animator. This is the screen that plays when the party loses a fight. Elodie, the goddess of light, catches
Gianna, says how many times she has fallen, and gives her back the moment before the fight. The design is
`docs/quest/reviews/2026-10-19-game-over-outline.md` (with the owner's decisions at its end). **Written Oct 19, for
the owner's approval before it goes to the animator.**

The format follows the intro (`STORYBOARD.md`): the same frame, the same pixel style and the same palette.

---

## What the animator makes, and what the game adds

The game puts in everything that changes from one loss to the next:
- her words;
- the count ("Times fallen: 3");
- the Rise and Skip buttons.

So the animator delivers **three short videos, one still and one sound**, all with no words except GAME OVER:

| File | What it is | Length |
|---|---|---|
| `gameover-fall.mp4` | From the lost battle into her presence. Ends on the held pose | 6 s |
| `gameover-loop.mp4` | Her presence, breathing, a seamless loop the game repeats while the player reads | 4 s |
| `gameover-rise.mp4` | The threads draw back up and the light flashes; ends on solid gold-white | 1.5 s |
| `gameover-still.png` | One frame of the held pose, for players who turn motion off | |
| `gameover-bell.wav` | One soft bell (shot 3), with a long tail | about 3 s |

---

## The whole piece

| | |
|---|---|
| **Frame** | 320 x 180 pixels, 16:9, shown scaled up with no smoothing (nearest neighbour), as in the intro |
| **Frame rate** | 12 fps for drawn motion (threads, stars, cloth of light); fades move every frame at 24 fps |
| **Style** | 8-bit pixel art matching the game: a 1-pixel near-black outline (`#1a1420`) where there is an edge, three shades per colour, no gradients except light glows, no anti-aliasing |
| **Her look** | **Never a full face** (the board game's rule, ART-PROMPTS.md section 1): a tall shape woven of stars and gold threads, open hands, and where a face would be, soft light and **one calm gold eye, half closed**. Base her on the key illustration "1a" from art drop 1 |
| **The text zone** | Keep the **lower third** (y 120 to 180) calm and dark in the loop and the still: the game draws her words, the count and the buttons there, on its own dark band. Nothing important below y 120 |
| **The safe area** | Keep her eye and hands inside the middle 200 x 110 pixels. Phones show the whole 16:9 frame, but small |
| **Palette** | The intro's (STORYBOARD.md), mostly: night `#1a1420`, dark grey `#3a3440`, gold `#f2d04b`, pale gold `#fff2a0`, cream `#f4ecd8`, sky `#9ad8ff`, blue `#3b4fa8`. Deep night blue for the sky: `#2a3a78` (the game's navy) |

---

## The shots

**Video 1: `gameover-fall.mp4` (6 s)**

| # | Time | What you see | Sound (for reference; the game plays the music) |
|---|---|---|---|
| 1 | 0 to 1 s | Start on solid near-black `#1a1420`. The game fades out of the battle into this, so begin dark. | A low note (the game's) |
| 2 | 1 to 1.5 s | Deep night blue `#2a3a78` rises from the bottom like dusk. Empty. | Silence |
| 3 | 1.5 to 3 s | **GAME OVER**, in cream pixel letters about 16 px tall, centred at y 70. It fades in over 6 frames and holds. | The bell (`gameover-bell.wav`) |
| 4 | 3 to 4.5 s | The letters come apart into gold threads (each letter's strokes unravel upward) and rise out of the top of the frame. | |
| 5 | 4.5 to 6 s | From the top, the threads fall back down **like a loom being strung**: about 20 gold vertical threads, some longer, lit at their tips. Stars light one by one. Behind them her shape fades in: shoulders and open hands woven of the threads, palms up, at the height of the frame's centre. Where a face would be, soft pale-gold light; **the eye opens halfway** on the last frames. End on this pose: the loop starts from this exact frame. | The game's Temple music begins softly |

**Video 2: `gameover-loop.mp4` (4 s, seamless)**

The held pose, alive. Its first and last frames match, so the loop never jumps.
- The threads sway slightly, as if in a breeze from below. Two or three of them shimmer gold to pale gold and back.
- Four or five stars twinkle (two frames each, at different times).
- Her hands rise and fall by one pixel, as if breathing.
- The eye stays half open. **It never blinks shut**: she is watching.
- The lower third stays dark and still.

**Video 3: `gameover-rise.mp4` (1.5 s)**

| # | Time | What you see |
|---|---|---|
| 7 | 0 to 1 s | The threads draw back up like a loom unwinding, from the edges inward. Her shape thins into them as they go. Stars fade last. |
| 8 | 1 to 1.5 s | A soft gold flash from the centre, filling the frame with pale gold `#fff2a0`, then cream `#f4ecd8`. End on solid cream (the game fades from it into the map). |

**The still: `gameover-still.png`**

The last frame of video 1 (the held pose), with no threads in motion. It is shown instead of all three videos when the
player's phone asks for less motion.

---

## What she says (the game shows this; here so the animator knows the mood)

The words appear in gold in the lower third, one line per tap. They have no name box or portrait, and no talking
sounds.

**The first time Gianna falls, she introduces herself** (owner decision, Oct 19). **Approved by the owner (Oct 19):**

- Goddess: "Rise, child of the Limyè line. You do not know me, but I have known you since your first breath."
- Goddess: "I am Elodie. I wove this realm, and I remember all of it."
- Gianna: "Elodie? Like my mother?"
- Goddess: "Your grandmother gave her my name the night she was born, and asked me to watch over her. I have. I
  watch over you too."
- Goddess: "I do not rule this world. I only remember it. So I will give you back the moment before."
- Goddess: "Go. Walk, mend, make ready. The fight will wait for you."

**Every time after that**, her first line depends on the count:
- 2 to 9: "I have caught you {n} times now. I remember every one."
- 10 or more: "{n} times. I remember every fall, and every time you stood again."

Then she says "Go. Walk, mend, make ready. The fight will wait for you."

The count shows under her words: a large gold number with "Times fallen" in small letters. The **Rise** button
(A) is under that.

None of this should give away what Chapter 3 reveals about Gianna's parents. Gianna's line keeps "Like my mother?" as
the owner asked.

---

## Pictures to make first (Gemini; a new chat; attach the art-drop picture "1a" and the game screenshot `ref/game-plaza-present.png` for the pixel style)

**The goddess, pixel version (the held pose, 320 x 180)**
```
Pixel art for a fantasy adventure game, matching the attached screenshot's pixel style: the goddess Elodie, who wove the world and remembers everything in it, shown only as a vast, serene presence in a deep night-blue sky. A tall shape woven of stars and threads of gold light: shoulders and two open hands at the centre, palms up, gold threads falling from above like the strings of a loom. Her face is never shown: where a face would be there is only soft pale-gold light and a single calm gold eye, half closed. Small stars around her. The lower third of the image is plain dark night blue with nothing in it. Colours: deep night blue, gold, pale gold, cream, a little sky blue. 8-bit pixel art, 320 x 180 pixels, a 1-pixel dark outline where there is an edge, flat colours, at most 16 colours, hard pixel edges, no anti-aliasing, no gradients except soft light glows. No text, no letters, no frame, no border, no people.
```

If it adds a face, a body, text or a frame, ask it to remove them.

---

## Delivery

- **Videos:** the three MP4s (H.264), 320 x 180, or scaled up by a whole number (1920 x 1080 is 6x) with no
  smoothing. A PNG frame sequence at 320 x 180 is also fine.
- **Picture and sound:** the still as a PNG, and the bell as WAV.
- **No music in the videos:** the game plays the Temple music.
- **File names:** as in the table above, into `quest/art/gameover/` (or sent in chat). Each one goes in through one
  entry in `quest/src/assets.config.ts`.
- **Until they arrive:** the game draws a placeholder in code (gold threads, stars and a half-closed eye) with the same
  timing. When the files come, they replace it with no other change.

---

## In the game (built Oct 19)

The screen is built with a placeholder drawn in code on the same clock (`quest/src/scenes/gameOverArt.ts`: the
threads, the stars, her shape, the half-closed eye and the GAME OVER letters). Each delivered file replaces its part
with no other change, by dropping it into `quest/art/gameover/` under the name above (then rebuild):

| File | Entry |
|---|---|
| `gameover-fall.mp4`, `gameover-loop.mp4`, `gameover-rise.mp4`, `gameover-still.png` | `GAME_OVER_ART` in `quest/src/assets.config.ts` (`fall`, `loop`, `rise`, `still`) |
| `gameover-bell.wav` | `GAME_OVER_BELL_FILE` in `quest/src/audio.config.ts` |

The timings are `GAME_OVER` in `quest/src/config.ts`; her lines are in `quest/src/data/gameOver.ts`. Use H.264 MP4s
(every phone plays them); a film the browser cannot play falls back to the placeholder for that part.

