# Art drop folder

Put finished paintings here, named exactly like this (PNG, JPG or WebP):

| Folder | File name | Size |
|---|---|---|
| `cards/` | `card-<number>.png`, e.g. `card-1.png` (numbers from docs/art/CARD-PROMPTS.md) | 1000 × 1400 or larger, 5:7 |
| `characters/` | `portrait-<house>-<generation>.png`, e.g. `portrait-brasador-1.png` | 1050 × 1800 or larger, 7:12 |
| `crests/` | `crest-<house>.png` (optional; the house initial is used until then) | square, 512 × 512 or larger |

Paintings only: no border, title or text. `npm run print` adds the overlay, category symbol and all card text,
and writes print-ready fronts to `print/` (game cards 1000 × 1360, characters 1050 × 1752, MakePlayingCards size
with bleed). It also makes small web copies so the app shows the same art.
