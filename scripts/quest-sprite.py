"""Turn a Gemini-style pixel sprite sheet (magenta background, a grid of frames) into the quest's walk
sheet: 3 columns (standing, step A, step B) x 4 rows (down, left, right, up), transparent, small palette.
Usage: python3 scripts/quest-sprite.py <sheet> <out.png> --grid COLSxROWS --rows down,left,_,up
       [--cols 0,1,2] [--cell 24x32] [--colors 24]
A row named "_" is skipped; a missing "right" row is made by mirroring "left" (and vice versa)."""
import argparse
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--grid', default='4x4'); ap.add_argument('--rows', default='down,left,right,up')
ap.add_argument('--cols', default='0,1,2'); ap.add_argument('--cell', default='24x32')
ap.add_argument('--colors', type=int, default=24)
ap.add_argument('--resample', default='nearest', choices=['nearest', 'smooth'],
                help='nearest keeps single pixels (eyes) from pixel-art sources; smooth blends')
ap.add_argument('--fill', type=float, default=1.0, help='sprite height as a share of the cell (smaller characters)')
ap.add_argument('--sides', default='', help='rows holding side views (e.g. 1,2): frames are sorted by the way they face')
a = ap.parse_args()
gc, gr = map(int, a.grid.split('x')); cw, ch = map(int, a.cell.split('x'))
names = a.rows.split(','); cols = [int(c) for c in a.cols.split(',')]
im = Image.open(a.src).convert('RGB'); W, H = im.size

def keyed(cell):
    """Magenta (and its anti-aliased fringe) becomes transparent."""
    out = Image.new('RGBA', cell.size)
    px = cell.load(); op = out.load()
    for y in range(cell.size[1]):
        for x in range(cell.size[0]):
            r, g, b = px[x, y]
            bg = (r - g > 55 and b - g > 55) or (r > 150 and b > 150 and g < 110)   # magenta and its fringe
            op[x, y] = (0, 0, 0, 0) if bg else (r, g, b, 255)
    return out

frames = {}
for ri, name in enumerate(names):
    if name == '_':
        continue
    for k, ci in enumerate(cols):
        box = (ci * W // gc, ri * H // gr, (ci + 1) * W // gc, (ri + 1) * H // gr)
        f = keyed(im.crop(box))
        frames[(name, k)] = f.crop(f.getbbox())
def facing(f):
    """'left' or 'right' from where the skin sits in the frame's top half (the face)."""
    px = f.load(); w, h = f.size; xs = []
    for y in range(h // 2):
        for x in range(w):
            r, g, b, al = px[x, y]
            if al and r > 90 and 50 < g < r - 15 and b < g:   # warm skin tones
                xs.append(x)
    if not xs:
        return None
    return 'right' if sum(xs) / len(xs) > w / 2 else 'left'

if a.sides:
    side = []
    for ri in map(int, a.sides.split(',')):
        for ci in range(gc):
            box = (ci * W // gc, ri * H // gr, (ci + 1) * W // gc, (ri + 1) * H // gr)
            f = keyed(im.crop(box)); f = f.crop(f.getbbox()); side.append((facing(f), f))
    for d in ('left', 'right'):
        for k in range(3):
            frames.pop((d, k), None)
    lefts = [f for d, f in side if d == 'left']; rights = [f for d, f in side if d == 'right']
    print('side frames: left', len(lefts), 'right', len(rights))
    for k in range(3):
        if lefts: frames[('left', k)] = lefts[k % len(lefts)]
        if rights: frames[('right', k)] = rights[k % len(rights)]
    # A missing direction is mirrored from the other one below.

tallest = max(f.size[1] for f in frames.values())
widest = max(f.size[0] for f in frames.values())
scale = min((ch - 1) * a.fill / tallest, cw / widest)

def shrink(f):
    w, h = max(1, round(f.size[0] * scale)), max(1, round(f.size[1] * scale))
    if a.resample == 'nearest':
        # Sample each target pixel at the centre of its source area, so 1-pixel details survive.
        s = f.resize((w, h), Image.NEAREST, reducing_gap=None)
    else:
        s = f.resize((w, h), Image.LANCZOS)
    a_ = s.getchannel('A').point(lambda v: 255 if v > 110 else 0)   # hard pixel edges
    s.putalpha(a_)
    return s

sheet = Image.new('RGBA', (cw * 3, ch * 4))
order = ['down', 'left', 'right', 'up']
for r, name in enumerate(order):
    for k in range(3):
        f = frames.get((name, k))
        if f is None:
            mirror = {'right': 'left', 'left': 'right'}.get(name)
            f = frames[(mirror, k)].transpose(Image.FLIP_LEFT_RIGHT)
        s = shrink(f)
        sheet.alpha_composite(s, (k * cw + (cw - s.size[0]) // 2, r * ch + ch - 1 - s.size[1]))
# One small shared palette keeps the pixels crisp.
alpha = sheet.getchannel('A')
q = sheet.convert('RGB').quantize(colors=a.colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGBA')
q.putalpha(alpha)
q.save(a.out)
print('scale', round(scale, 3), 'sheet', q.size)
