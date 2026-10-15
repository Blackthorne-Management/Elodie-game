# Credits: third-party assets

Every third-party asset the quest uses is listed here with its title, author, source URL and licence,
and the same list shows in the game's menu under **Credits** (`src/data/credits.ts`). Only CC0,
CC-BY 3.0/4.0 or OGA-BY assets may be added (and fonts under the SIL Open Font License); CC-BY needs
the attribution kept here and in the game.

## In use

- **Atkinson Hyperlegible**, Braille Institute of America, https://www.brailleinstitute.org/freefont,
  SIL Open Font License 1.1 (npm `@fontsource/atkinson-hyperlegible`). All text in the game (Oct 15).

Every picture in the quest is still placeholder pixel art drawn by the game itself
(`src/assets.pixels.ts`, `src/scenes/pixels.ts`), and there is no sound yet.

## Tried

- Kenney, "Tiny Town" and "Roguelike/RPG pack" (CC0), https://kenney.nl/assets/tiny-town: not
  downloaded. The build machine's network policy refused kenney.nl (HTTP 403 at the proxy).
- OpenGameArt (https://opengameart.org), for 16 x 16 town, temple and coast tiles and story objects:
  not downloaded. The network policy refused opengameart.org as well (HTTP 403 at the proxy).

To try again, allow those hosts in the environment's network settings, pick one coherent CC0 terrain
pack, drop its tiles into `quest/art/tiles/<tile name>.png` (see `quest/art/README.md`), and list it
above and in `src/data/credits.ts`. The named cast never use downloaded sprites: the owner is making
their art.
