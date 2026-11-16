# Music for the board game app

Seven tracks you generate (any AI music tool), upload to `public/audio/music/` on the board game branch with the file
names below, and the game plays them: `src/assets.config.ts` (`MUSIC`) lists them and `src/audio/plan.ts` picks one for
each moment. A missing track is simply silent, so they can arrive one at a time. Sound effects are made in code
(`src/audio/sfx.ts`); nothing to generate for those.

**For every track:** instrumental only, no vocals or words. MP3. Dark gothic fantasy, the board game's own mood (not
the quest's 16-bit sound): a cinematic orchestra with the eight houses' cultures woven in as colour (Spanish guitar,
oud, frame drums, taiko, Taíno log drum and conch, bansuri, Norse horn, Haitian rara horns). Looping tracks: a seamless
loop of 90 to 150 seconds whose end flows back into its start; no fade-out at the end.

| # | File | Where it plays | Loops | Prompt |
|---|---|---|---|---|
| 1 | `title.mp3` | The main menu, setup and the online lobby | yes | Main theme for a dark fantasy board game about eight rival noble houses racing for a goddess's throne: a solemn, memorable melody on low strings and a lone horn over slow frame drums, a choir pad without words, candlelit and ancient, building gently and settling again, 76 BPM |
| 2 | `realm.mp3` | Most of a game: the early and middle rounds | yes | Brooding background music for a strategy board game: a calm, low, patient pulse of cello and soft hand drums, an oud and a bansuri trading a quiet melody, a sense of watchful rivals and old grudges, never loud, leaves room for talk at the table, 84 BPM |
| 3 | `stakes.mp3` | From round 10, or once anyone could claim the Throne | yes | Rising tension for the late game of a strategy board game: the same dark mood with more urgency, ostinato strings, taiko and war drums building, brass swells, a ticking feel as time runs short, still restrained enough to play under conversation, 96 BPM |
| 4 | `throne.mp3` | A claim on the Throne and its challenges | yes | Climactic duel music: a contender claims a goddess's throne and rivals step forward to fight them one by one; driving war drums, fierce strings, horn calls answering each other, choir without words, heroic and dangerous, 120 BPM |
| 5 | `victory.mp3` | When you win | no, about 15 seconds | A triumphant, golden fanfare for winning the throne: brass and choir without words over timpani, sunlight after a long night, ends on a full held chord, about 15 seconds |
| 6 | `defeat.mp3` | When a rival wins | no, about 15 seconds | A dignified, sorrowful ending for losing the throne to a rival: solo cello and low strings, a distant bell, bittersweet rather than tragic, ends quietly, about 15 seconds |
| 7 | `sudden.mp3` | The last round before Sudden Death begins (plays over the music) | no, about 6 seconds | A short ominous sting: one deep bell toll, a low brass chord and a rising string tremolo that cuts off, the sense that time has run out, about 6 seconds |

**Volume:** each player sets music and effects separately in the game menu or on the setup screen (remembered on the
device); the effects sit under the music, so aim for tracks at a normal, unclipped loudness.
