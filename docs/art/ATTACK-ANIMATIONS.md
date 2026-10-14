# 3D attack animations: the plan

**Status:** plan only, waiting for the owner's approval. Nothing is built yet.
**Goal:** ship with the release on **Sun Nov 22**. Anything not ready by then stays on the current duel screen
(`src/ui/play/Duel.tsx`), which is never removed.

## What the player sees

When someone attacks or challenges for the Throne, the screen fills with a 3D scene: the attacker and the defender
facing each other on a stage in the defender's homeland colours.

1. The attacker steps or lunges in and plays one of their class's attacks (about 1.2 s in all).
2. At the moment of impact: a hit flash, a slash or spell effect, the screen shakes, the phone buzzes and the damage
   number pops out.
3. The defender reacts to what the rules decided:

   | Rules outcome | Defender plays |
   |---|---|
   | Damage taken | hit reaction, stagger |
   | Blocked | block pose plus a shield spark (no damage number) |
   | Deflected | block, then the strike flies off toward the third player (their name shown) |
   | Riposte | both take a hit, one after the other |
   | Falls (0 Hearts) | death fall, then the figure fades into a ghostly Specter |
   | Both fall | both death falls; bookkeeping order as in the rulebook (attacker first) |
   | Ranged card (Cursed Dagger and the others) | the attacker's ranged or throw attack, whatever their class |
   | Throne challenge | the same, with the Throne room as the stage |

4. If the defender can play a Block card, the scene pauses on the wind-up and the current block buttons appear over it.
5. Tap anywhere to skip. The animation is display only and never changes the game.

## Attack cycling

Each class has **3 attacks**. A character plays them in turn (1, 2, 3, 1 ...), counting that character's own attacks,
so the same fight never repeats twice in a row. The pick comes from the game's attack count, not a random roll, so
every phone in an online game shows the same swing.

Shared by every class: idle, walk in, hit reaction, block, death, Specter fade and victory.

## Classes and who uses them

From the poses in `CHARACTER-PROMPTS.md`. **Bold** rows are characters painted without a weapon. Their class is
my suggestion and needs the owner's decision (Question 1 below).

| Class | Attacks (3 each, cycled) | Characters |
|---|---|---|
| Swordsman | overhead chop, diagonal slash, lunging thrust | Don Alonso, Benny, Rael, Rani Tejaswini (curved sword), Vikram |
| Greatsword | overhead cleave, spinning sweep, rising slash | Azzy, Edmund |
| Twin blades | cross slash, three-hit flurry, leaping X-strike | Arjun |
| Heavy weapon (axe or club) | overhead chop, wide side swing, shield or shoulder bash | Ulfgar, Torvald, Cacique Anaco |
| Spear | quick thrust, sweeping arc, leaping stab | Bayarmaa, Meera |
| Archer | quick shot, drawn power shot, three-arrow volley | Sarnai, Yari |
| Mystic (staff or open hand) | spirit bolt, ground burst, beam; colour and shapes per house (Taíno spirits, the sun, healing light) | Cacique Guanín, Mother Solange, Gianna, Dame Agatha |
| Shadow (blade or fan) | thrown knife, vanish and strike from behind, fan or sleeve slash | Haru, Lady Sayo, **Lord Genzō**, **Kaede** |
| **Coin and command** (house guards or thrown gold) | gold-coin burst, hired-guard strike, thrown purse | **Malik, Yusuf, Layla, Samira** |
| **Orator** (voice and command as force) | shockwave word, rallying blast, pointing command that summons a strike | **Marshal Patricio, Elodie Limyè** |
| **Stillwater mist** | mist grab, lantern swing, cold fog burst | **Thomas** (lantern), **Lady Rosalind** |
| **Paddle and spirit mask** | paddle strike, mask spirit howl, sweep | **Caona** |

That makes 12 classes, about 36 attack clips plus 7 shared clips. Every model uses one shared humanoid skeleton,
so each clip works for every character in its class. The per-character work is only the model.

## How it is built

**Code (Claude):**
- Three.js, loaded only when an attack scene is first needed (about 150 KB zipped), so the board loads as fast as
  it does today.
- Models are `.glb` files with compressed meshes and textures, up to about 1.5 MB each. A game downloads only the
  characters at the table, and the PWA keeps them for next time.
- An ink-outline, flat-shaded ("toon") look, so the models sit with the painted storybook art instead of looking
  like a different game.
- Effects (slashes, sparks, arrows, spells, Specter fade) are made in code or taken from free (CC0) or bought packs,
  with credits recorded.
- Every model, clip and effect goes through `src/assets.config.ts` (a new `ATTACK_ART` section), as the project
  rules require.
- The class for each character goes in `src/data/houses.ts` next to the heirs, so the engine never hard-codes a
  character.
- New settings in `src/config.ts`: animations on or off, length, and fast mode for bot-against-bot fights.
- Unit tests for the outcome mapping and the attack cycle. A Playwright check that the scene opens, skips and
  falls back.

**When the current duel screen is used instead** (so a missed deadline costs nothing):
- either fighter has no finished model yet (so it can ship house by house)
- the phone has no WebGL, or the scene drops frames on its first run
- the player turned animations off, or the phone asks for reduced motion

**Art pipeline (the owner, with Claude's step-by-step guide and scripts):**
1. Finished portrait (from `CHARACTER-PROMPTS.md`). None exist yet, so this is the critical path.
2. Image-to-3D model from the portrait in Meshy, Tripo or Rodin. These are paid tools, about $20–50 a month; check
   that the plan allows commercial use.
3. Clean-up: fix hands and weapon, separate the weapon, reduce the polygon count. A Blender script I write does
   most of it.
4. Automatic rigging to the shared skeleton (Mixamo, which is free, or the generator's own rigger).
5. Animations: Mixamo's free library (allowed in commercial games; the raw files may not be redistributed, which a
   game doesn't do), plus a bought sword, bow and magic pack if Mixamo falls short. I check each licence before
   it's used.
6. A script compresses the model and drops it into `public/art/models/` at its name, e.g. `brasador-1.glb`.

About 2–4 hours per character once the routine is set, so 64–128 hours for all 32.

## Schedule to Nov 22

| Dates | Work | Done when |
|---|---|---|
| Oct 15–21 | **Prototype:** one stand-in Mixamo character per side, the Swordsman set, hit, block, death, skip, fallback | You approve the feel on your phone |
| Oct 22–Nov 1 | All 12 classes on house-coloured stand-in figures; all outcomes; sound, buzz, settings | Every attack in a bot game animates |
| Oct 24 onward | Models, house by house, as the portraits land | Each finished house switches on by itself |
| Nov 2–15 | Toon look, effects polish, speed on a mid-range Android phone | Smooth on your phone and one older phone |
| Nov 16–21 | Freeze: anything unfinished stays on the current duel screen | Release build tagged |

**The risk is the art, not the code.** The 32 portraits are not painted yet and are already needed for the printed
game (board by Oct 20, everything else by Oct 31). The models can't start until the portraits exist, and the quest
art is due in the same weeks. If time runs short, the stand-in figures with real animations could ship instead,
or only the finished houses. Either way, nothing worse than today's screen is released.

## Questions for the owner (one at a time)

1. The characters painted without a weapon (in bold above): keep my suggested classes, or give them weapons?
2. Stand-in figures at release if a house's models aren't done: yes, or keep the current duel screen for that house?
3. Which image-to-3D tool and budget?
