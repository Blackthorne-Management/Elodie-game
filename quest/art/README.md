# Drop real art here

Each PNG replaces one placeholder; anything missing keeps its placeholder. Rebuild (`npm run build`)
after adding files. Names, sizes and the palette: `../../docs/quest/ART-STYLE.md` and
`src/assets.config.ts` (`ART_FILES`).

- `characters/<look>.png`: walk sheet, 3 columns x 4 rows of equal cells (24 x 32, a 72 x 128 sheet).
  Gemini sheets are converted with `../../scripts/quest-sprite.py` (options in ART-STYLE.md).
  Rows: down, left, right, up. Columns: standing, step A, step B. Transparent background.
- `portraits/<portrait>.png`: 48 x 48 dialogue portrait (neutral face).
- `tiles/<tile>.png`: 16 x 16 tile, named after its `TILESET` entry.
- `objects/<kind>.png`: a large object drawing, named after its `OBJECT_ART` entry.

If you use art you did not make, add it to `../assets/CREDITS.md` and `../src/data/credits.ts`.
