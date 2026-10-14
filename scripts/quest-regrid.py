"""Re-lay a Gemini sprite sheet whose cells are uneven (grid lines drawn at odd spacings, or one line for
every two rows) onto an even grid, so scripts/quest-sprite.py can cut it.

Usage:
  python3 scripts/quest-regrid.py <sheet> <out.png> --cols 3 --rows 4

It keys out the magenta background, drops the grid lines (thin near-black lines across most of the sheet), finds
each figure as one connected blob (small specks are ignored), sorts the figures into rows by height on
the sheet and into columns left to right, and pastes each one into an even cell on flat magenta, centred
and standing on the same baseline. Feed the result to quest-sprite.py with --grid-lines off.
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--cols', type=int, default=3); ap.add_argument('--rows', type=int, default=4)
ap.add_argument('--same-height', action='store_true',
                help='scale every figure (nearest) to the tallest one: for sheets that draw the side views smaller')
a = ap.parse_args()

im = np.asarray(Image.open(a.src).convert('RGB')).astype(int)
h, w, _ = im.shape
r, g, b = im[..., 0], im[..., 1], im[..., 2]
magenta = (np.minimum(r, b) - g > 35)   # the background and its purple fringe (the robes are near-neutral grey)
fg = ~magenta
# What is left of the fringe sits on the dark outline: turn it into a neutral dark instead of purple.
tinted = fg & (np.minimum(r, b) - g > 15)
im[tinted] = np.stack([g[tinted] + 8, g[tinted] + 4, g[tinted] + 12], axis=-1)
# Grid lines: thin near-black lines running most of the sheet (a figure's dark outline never does).
dark = im.max(axis=2) < 90
for axis in (0, 1):
    line = dark.mean(axis=axis) > 0.9   # the lines are solid; dark robes reach about 0.7
    line = ndimage.binary_dilation(line, iterations=3)   # their anti-aliased edges
    if axis == 1:
        fg[line, :] = False
    else:
        fg[:, line] = False

# Join each figure's parts (outlines leave gaps), then keep the big blobs.
labels, n = ndimage.label(ndimage.binary_closing(fg, iterations=6))
sizes = ndimage.sum(np.ones_like(labels), labels, range(1, n + 1))
want = a.cols * a.rows
keep = [i + 1 for i in np.argsort(sizes)[::-1][:want]]
if len(keep) < want or sizes[keep[-1] - 1] < 0.2 * sizes[keep[0] - 1]:
    raise SystemExit(f'found {n} blobs; the {want} largest are not all figures')
boxes = []
for lab in keep:
    ys, xs = np.nonzero(labels == lab)
    boxes.append((ys.min(), ys.max() + 1, xs.min(), xs.max() + 1, lab))

# Rows by the bottom of each figure, columns left to right.
boxes.sort(key=lambda bx: bx[1])
rows = [sorted(boxes[i * a.cols:(i + 1) * a.cols], key=lambda bx: bx[2]) for i in range(a.rows)]
tallest = max(bx[1] - bx[0] for bx in boxes)
figs = {}
for (y0, y1, x0, x1, lab) in boxes:
    mask = (labels[y0:y1, x0:x1] == lab) & fg[y0:y1, x0:x1]
    rgba = np.dstack([im[y0:y1, x0:x1], mask * 255]).astype(np.uint8)
    fig = Image.fromarray(rgba, 'RGBA')
    if a.same_height and fig.height != tallest:
        k = tallest / fig.height
        fig = fig.resize((round(fig.width * k), tallest), Image.NEAREST)
    figs[lab] = fig
cw = max(f.width for f in figs.values()) + 24
ch = max(f.height for f in figs.values()) + 24
out = Image.new('RGBA', (cw * a.cols, ch * a.rows), (255, 0, 255, 255))
for ri, row in enumerate(rows):
    for ci, (_, _, _, _, lab) in enumerate(row):
        f = figs[lab]
        out.alpha_composite(f, (ci * cw + (cw - f.width) // 2, ri * ch + ch - 12 - f.height))
out.convert('RGB').save(a.out)
print(f'{len(boxes)} figures, cells {cw} x {ch}')
