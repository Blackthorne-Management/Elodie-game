#!/usr/bin/env python3
"""
The world map for the quest's menu, traced from the board game's map so the two always match.

Reads docs/art/board-guide.png (the board's countries as flat colours, the capitals as white dots
and the Throne disc), classifies every pixel by the nearest country colour, shrinks the picture to
a SIZE x SIZE grid (each cell takes the most common class in its block), tidies stray cells, finds
each capital dot and each country's label point, and writes quest/src/data/realmMap.ts.

Run again whenever the board's borders change:  python3 quest/tools/realm-map.py
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'docs/art/board-guide.png'
OUT = ROOT / 'quest/src/data/realmMap.ts'
SIZE = 128

# Class id -> (key char, realm place id, board colour). Order matters: index 0 is the sea.
CLASSES = [
    ('.', 'sea', (43, 95, 124)),
    ('x', 'xaragua', (46, 163, 160)),
    ('a', 'ardencia', (138, 59, 42)),
    ('z', 'zetwal', (227, 207, 115)),
    ('d', 'al_doria', (207, 174, 110)),
    ('s', 'skarragol', (125, 143, 120)),
    ('k', 'kuroshi', (71, 86, 110)),
    ('j', 'jwaladesh', (196, 106, 42)),
    ('m', 'aldermoor', (122, 102, 144)),
    ('t', 'seat', (156, 143, 127)),
]
# Extra colours that belong to a class: the Throne disc and its gold ring are the Seat.
EXTRA = [(244, 236, 216, 9), (217, 164, 65, 9)]
# Label points are the middle of each mainland, nudged where two names would collide in the menu's
# small font (cells; the name is drawn just above its point, which stays inside the country).
NUDGE = {'ardencia': (-3, -10), 'zetwal': (6, -5), 'kuroshi': (0, 12)}
WHITE = -1  # a capital dot: filled from its neighbours
UNSURE = -2  # a blended pixel on a border: filled from its neighbours
SPECK = 12  # smaller inland pieces of a country are blends, not territory
PURE = 28  # how far (RGB distance) a pixel may be from its colour and still count


def classify(img: np.ndarray) -> np.ndarray:
    cols = [c[2] for c in CLASSES] + [e[:3] for e in EXTRA]
    ids = list(range(len(CLASSES))) + [e[3] for e in EXTRA]
    pal = np.array(cols, dtype=np.float32)
    flat = img.reshape(-1, 3).astype(np.float32)
    d = ((flat[:, None, :] - pal[None, :, :]) ** 2).sum(-1)
    out = np.array(ids)[d.argmin(1)].reshape(img.shape[:2])
    # Blurred borders blend two colours into something near a third (red + yellow reads as tan):
    # only clear pixels count; the rest are filled from their neighbours.
    out[d.min(1).reshape(img.shape[:2]) > PURE ** 2] = UNSURE
    white = (img >= 250).all(-1)
    out[white] = WHITE
    return out


def block_mode(cls: np.ndarray, n: int) -> np.ndarray:
    h, w = cls.shape
    grid = np.full((n, n), WHITE, dtype=np.int32)
    for gy in range(n):
        for gx in range(n):
            block = cls[gy * h // n:(gy + 1) * h // n, gx * w // n:(gx + 1) * w // n].ravel()
            block = block[block >= 0]
            if block.size:
                grid[gy, gx] = np.bincount(block, minlength=len(CLASSES)).argmax()
    return grid


def neighbour_mode(grid: np.ndarray, y: int, x: int, skip=(WHITE,)) -> int:
    vals = []
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            yy, xx = y + dy, x + dx
            if (dy or dx) and 0 <= yy < grid.shape[0] and 0 <= xx < grid.shape[1] and grid[yy, xx] not in skip:
                vals.append(grid[yy, xx])
    return int(np.bincount(vals).argmax()) if vals else 0


def tidy(grid: np.ndarray) -> np.ndarray:
    g = grid.copy()
    # Fill capital dots from their neighbours, then clear blends: specks, thin strips along borders
    # and lone cells (blurred borders mix two colours into something near a third).
    for _ in range(6):
        for y, x in zip(*np.where(g == WHITE)):
            g[y, x] = neighbour_mode(g, y, x)
    # Specks: a piece of a country smaller than SPECK cells with no sea around it is a border blend.
    for i in range(1, len(CLASSES)):
        for comp in components(g == i):
            if len(comp) >= SPECK:
                continue
            coast = any(
                0 <= y + dy < g.shape[0] and 0 <= x + dx < g.shape[1] and g[y + dy, x + dx] == 0
                for y, x in comp
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1))
            )
            if not coast:
                for y, x in comp:
                    g[y, x] = neighbour_mode(g, y, x, skip=(WHITE, i))
    # Thin strips: a land cell whose own country holds under a third of the 5 x 5 cells around it is
    # a blend along a border; it joins the biggest neighbouring country.
    for _ in range(2):
        h, w = g.shape
        nxt = g.copy()
        for y in range(h):
            for x in range(w):
                if g[y, x] <= 0:
                    continue
                win = g[max(0, y - 2):y + 3, max(0, x - 2):x + 3].ravel()
                counts = np.bincount(win[win >= 0], minlength=len(CLASSES))
                if counts[g[y, x]] * 3 < win.size:
                    land = counts.copy()
                    land[0] = 0
                    land[g[y, x]] = 0
                    if land.max() > counts[g[y, x]]:
                        nxt[y, x] = int(land.argmax())
        g = nxt
    out = g.copy()
    for y in range(g.shape[0]):
        for x in range(g.shape[1]):
            if g[y, x] == 0:
                continue
            same = sum(
                1
                for dy in (-1, 0, 1)
                for dx in (-1, 0, 1)
                if (dy or dx) and 0 <= y + dy < g.shape[0] and 0 <= x + dx < g.shape[1] and g[y + dy, x + dx] == g[y, x]
            )
            if same <= 1:
                out[y, x] = neighbour_mode(g, y, x)
    return out


def components(mask: np.ndarray) -> list[list[tuple[int, int]]]:
    seen = np.zeros_like(mask, dtype=bool)
    comps = []
    for y, x in zip(*np.where(mask)):
        if seen[y, x]:
            continue
        stack, comp = [(y, x)], []
        seen[y, x] = True
        while stack:
            cy, cx = stack.pop()
            comp.append((cy, cx))
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1] and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    stack.append((ny, nx))
        comps.append(comp)
    return comps


def main() -> None:
    img = np.array(Image.open(SRC).convert('RGB'))
    cls = classify(img)
    grid = tidy(block_mode(cls, SIZE))
    k = SIZE / img.shape[0]

    # Capitals: the white dots on the board, each in the country around it.
    capitals: dict[str, tuple[int, int]] = {}
    for comp in components(cls == WHITE):
        if len(comp) < 400:
            continue
        py = sum(p[0] for p in comp) / len(comp)
        px = sum(p[1] for p in comp) / len(comp)
        cy, cx = py * k, px * k
        # The country around the dot: the commonest class on a ring just outside it (the dot has a
        # grey rim that would read as another country).
        ring = [
            cls[int(py + 60 * np.sin(a)), int(px + 60 * np.cos(a))]
            for a in np.linspace(0, 2 * np.pi, 48, endpoint=False)
        ]
        ring = [r for r in ring if r > 0]
        place = CLASSES[int(np.bincount(ring).argmax())][1] if ring else 'sea'
        if place in ('sea', 'seat'):
            sys.exit(f'capital dot at {cx:.0f},{cy:.0f} is not inside a country')
        capitals[place] = (round(cx), round(cy))
        # The dot itself (and its rim) is that country's ground.
        ci = next(i for i, c in enumerate(CLASSES) if c[1] == place)
        for yy in range(int(cy) - 3, int(cy) + 4):
            for xx in range(int(cx) - 3, int(cx) + 4):
                if (yy - cy) ** 2 + (xx - cx) ** 2 <= 9:
                    grid[yy, xx] = ci
    # The Seat's "capital" is the Throne disc's centre.
    seat = np.argwhere(grid == 9)
    disc = np.argwhere(block_mode(cls, SIZE) == 9)
    capitals['seat'] = (round(float(disc[:, 1].mean())), round(float(disc[:, 0].mean()))) if disc.size else (SIZE // 2, SIZE // 2)
    assert seat.size

    # Label points: the middle of each country's mainland (its largest piece).
    labels: dict[str, tuple[int, int]] = {}
    for i, (_, place, _) in enumerate(CLASSES[1:], start=1):
        biggest = max(components(grid == i), key=len)
        lx = round(sum(p[1] for p in biggest) / len(biggest)) + NUDGE.get(place, (0, 0))[0]
        ly = round(sum(p[0] for p in biggest) / len(biggest)) + NUDGE.get(place, (0, 0))[1]
        if grid[ly, lx] != i:
            sys.exit(f'the label point for {place} ({lx},{ly}) is outside it: change NUDGE')
        labels[place] = (lx, ly)

    missing = [c[1] for c in CLASSES[1:] if c[1] not in capitals]
    if missing:
        sys.exit(f'no capital dot found for {missing}')

    rows = [''.join(CLASSES[v][0] for v in row) for row in grid]
    key = ', '.join(f"'{c[0]}': '{c[1]}'" for c in CLASSES)
    colours = ', '.join(f"{c[1]}: 0x{c[2][0]:02x}{c[2][1]:02x}{c[2][2]:02x}" for c in CLASSES)
    pts = lambda d: ', '.join(f'{p}: {{ x: {x}, y: {y} }}' for p, (x, y) in d.items())
    body = '\n'.join(f"    '{r}'," for r in rows)
    OUT.write_text(
        f"""// The realm map for the menu, traced from the board game's map (docs/art/board-guide.png) by
// tools/realm-map.py, so the quest's world has the board's coastlines, borders and capitals.
// Generated: do not edit by hand; run `python3 quest/tools/realm-map.py` after the board changes.

export interface RealmMapData {{
  width: number;
  height: number;
  /** One character per cell (see `key`); rows top to bottom. */
  rows: readonly string[];
  /** Cell character -> realm place id ('sea' for water). */
  key: Readonly<Record<string, string>>;
  /** Each place's colour on the board. */
  colours: Readonly<Record<string, number>>;
  /** Each place's capital (the board's white dot; the Throne for the Seat), in cells. */
  capitals: Readonly<Record<string, {{ x: number; y: number }}>>;
  /** Where each place's name goes (the middle of its mainland), in cells. */
  labels: Readonly<Record<string, {{ x: number; y: number }}>>;
}}

export const REALM_MAP: RealmMapData = {{
  width: {SIZE},
  height: {SIZE},
  key: {{ {key} }},
  colours: {{ {colours} }},
  capitals: {{ {pts(capitals)} }},
  labels: {{ {pts(labels)} }},
  rows: [
{body}
  ],
}};
"""
    )
    print(f'wrote {OUT.relative_to(ROOT)}: {SIZE}x{SIZE}, capitals {capitals}')


if __name__ == '__main__':
    main()
