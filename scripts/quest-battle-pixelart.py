"""Turn an upscaled pixel-art JPG on magenta into native-resolution transparent PNG.
usage: quest-battle-pixelart.py in.jpg out.png [target_height] [--period MIN,MAX]
The art's pixel size is searched between MIN and MAX screen pixels (default 12,24: the 2000 px pictures of Nov 10);
a smaller picture needs a smaller range (Samira's 1024 px battle sheet: 6,12)."""
import sys
import numpy as np
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith('--period')]
rng = next((a.split('=')[1] for a in sys.argv[1:] if a.startswith('--period=')), '12,24')
PMIN, PMAX = (float(v) for v in rng.split(','))
sys.argv = [sys.argv[0]] + args
src, dst = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
magenta = (r > 170) & (b > 170) & (g < 110) & (abs(r - b) < 90)
ys, xs = np.where(~magenta)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
crop = im[y0:y1, x0:x1]
mask = ~magenta[y0:y1, x0:x1]

def period(axis):
    gray = crop.sum(axis=2)
    d = np.abs(np.diff(gray, axis=axis)).sum(axis=1 - axis)
    d = d - d.mean()
    best, bp = -1e18, 0
    for p in np.arange(PMIN, PMAX, 0.05):
        idx = np.arange(len(d))
        score = np.abs((d * np.exp(2j * np.pi * idx / p)).sum())
        if score > best:
            best, bp = score, p
    ph = np.angle((d * np.exp(2j * np.pi * np.arange(len(d)) / bp)).sum())
    return bp, ph

px, phx = period(1)
py, phy = period(0)
p = (px + py) / 2
# Edges sit where the phase wraps; block centres half a period later.
offx = ((-phx / (2 * np.pi)) * p + 0.5 + p / 2) % p
offy = ((-phy / (2 * np.pi)) * p + 0.5 + p / 2) % p
cols = np.arange(offx, crop.shape[1], p)
rows = np.arange(offy, crop.shape[0], p)
out = np.zeros((len(rows), len(cols), 4), dtype=np.uint8)
for i, yy in enumerate(rows):
    for j, xx in enumerate(cols):
        y, x = int(yy), int(xx)
        y2, x2 = max(0, y - 1), max(0, x - 1)
        patch = crop[y2:y + 2, x2:x + 2].reshape(-1, 3)
        m = mask[y2:y + 2, x2:x + 2].reshape(-1)
        if m.mean() < 0.5:
            continue
        out[i, j, :3] = np.median(patch[m], axis=0)
        out[i, j, 3] = 255
# The JPEG's magenta bleeds into the outline: a bright-magenta pixel on the figure's edge is background.
for _ in range(2):
    a = out[..., 3] > 0
    edge = a & ~(np.roll(a, 1, 0) & np.roll(a, -1, 0) & np.roll(a, 1, 1) & np.roll(a, -1, 1))
    R, G, B = (out[..., k].astype(int) for k in range(3))
    pink = edge & (R > 170) & (B > 140) & (G < 120) & (R - G > 90) & (B - G > 60)
    out[pink] = 0
# Trim empty rows and columns.
a = out[..., 3] > 0
ys, xs = np.where(a)
out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
img = Image.fromarray(out, 'RGBA')
# Stand level with the party (their stances are about 40 game pixels): the figure scaled to the target height in game
# pixels (nearest, so no blur), then doubled, as the game shows enemy files at half size.
target = int(sys.argv[3]) if len(sys.argv) > 3 else 0
if target and img.height != target:
    img = img.resize((max(1, round(img.width * target / img.height)), target), Image.NEAREST)
img = img.resize((img.width * 2, img.height * 2), Image.NEAREST)
img.save(dst)
print(f'{src}: period {p:.2f}px -> native {out.shape[1]}x{out.shape[0]}, file {img.width}x{img.height}')
