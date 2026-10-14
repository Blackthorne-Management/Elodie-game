"""Turn a Gemini-style pixel sprite sheet (magenta background, a grid of frames) into the quest's walk
sheet: 3 columns (standing, step A, step B) x 4 rows (down, left, right, up), transparent, small palette.

Usage:
  python3 scripts/quest-sprite.py <sheet> <out.png> --grid COLSxROWS --rows down,left,_,up [options]

What the sheets in quest/art/characters were made with:
  gianna: --grid 4x4 --rows down,_,_,up --sides 1,2 --cell 24x32 --colors 32
  anissa: --grid 5x4 --rows down,_,_,up --sides 1 --cell 24x32 --colors 32 --fill 0.84

Options:
  --grid COLSxROWS   the source sheet's grid of frames (cells are cut evenly).
  --rows a,b,c,d     what each source row holds: down, left, right, up, or _ to skip it.
  --sides 1,2        source rows holding side views in any order; their frames are sorted by the way
                     the face looks (warm skin in the top half), so a sheet that mixes left and right
                     frames still works. A missing left or right is mirrored from the other side.
  --cell WxH         output cell (24x32, the quest's character cell).
  --colors N         per-character palette size, including the outline colour (default 32).
  --fill F           sprite height as a share of the cell (smaller characters, e.g. Anissa 0.84).
  --mode stable|raw  stable (default): one clean standing frame per direction and the step frames
                     derived from it, so the upper body never jitters. raw: the old conversion (every
                     source frame scaled as it is), kept to compare.
  --pixel auto|N|0   the source's own pixel size in screen pixels. Gemini "pixel art" is drawn on a
                     coarse grid (Gianna's sheet: about 7.6 screen pixels per art pixel); auto finds it
                     from the colour edges and samples one value per art pixel (the median of its
                     centre), so nothing is doubled or dropped. 0 turns it off. The sprite is then
                     shrunk further only if it does not fit the cell (--fill).
  --resample nearest|smooth   how to shrink when needed (nearest keeps 1 px details such as eyes).
  --legs shift|blend how stable mode makes the step frames. shift (default): the feet band (the
                     bottom --leg-rows of the sprite) is split down the middle of the feet; front and back
                     views lift one half 1 px (step A the left foot, step B the right), side views
                     spread the feet 1 px each way (step B also lifts the back foot). blend: the feet
                     band comes from the source's own step frames, aligned on the torso.
  --leg-rows R       share of the sprite height that counts as the feet band (default 0.22).
  --bob N            on the step frames everything above the feet band sits N px lower (default 1;
                     0 turns it off). The feet stay on the bottom row.
  --outline HEX      the 1 px outline colour, drawn over every silhouette edge pixel except the soles
                     (default 1a1420, the palette's k; none keeps the source's own edge).
  --grid-lines auto|on|off   dark lines drawn between the source's cells (Yari's sheet has them):
                     auto looks for them along every inner cell boundary; when found, near-black pixels
                     joined to a cell's border are dropped (a figure never touches its cell's border,
                     so black hair and outlines stay).
  --preview DIR      also write DIR/<name>-before-after.png (the sheet already at <out>, if any, beside
                     the new one, 8x) and DIR/<name>-walk.gif (all four directions walking: step A,
                     stand, step B, stand, 8x).

Stable mode, step by step: sample the source at its own pixel grid; cut every frame, key out magenta,
crop; per direction pick the standing frame (column 0 where the direction has one, else the frame
whose feet are closest together; side frames come from --sides); scale all four by one factor (never
up) so the tallest fits; drop isolated stray pixels; put each in its cell with the feet on the bottom
row, centred on the torso; derive step A and step B from it (only the feet band moves, and the body
bobs); reduce the sheet to one palette; draw the outline."""
import argparse
import math
import os
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--grid', default='4x4'); ap.add_argument('--rows', default='down,left,right,up')
ap.add_argument('--cols', default='0,1,2', help='raw mode: source columns used as standing, step A, step B')
ap.add_argument('--cell', default='24x32')
ap.add_argument('--colors', type=int, default=32)
ap.add_argument('--resample', default='nearest', choices=['nearest', 'smooth'])
ap.add_argument('--fill', type=float, default=1.0)
ap.add_argument('--sides', default='')
ap.add_argument('--mode', default='stable', choices=['stable', 'raw'])
ap.add_argument('--pixel', default='auto')
ap.add_argument('--legs', default='shift', choices=['shift', 'blend'])
ap.add_argument('--leg-rows', type=float, default=0.22)
ap.add_argument('--side-rows', type=float, default=0.12)
ap.add_argument('--bob', type=int, default=1)
ap.add_argument('--outline', default='1a1420')
ap.add_argument('--preview', default='')
ap.add_argument('--grid-lines', default='auto', choices=['auto', 'on', 'off'])
a = ap.parse_args()
gc, gr = map(int, a.grid.split('x')); cw, ch = map(int, a.cell.split('x'))
names = a.rows.split(','); cols = [int(c) for c in a.cols.split(',')]
ORDER = ['down', 'left', 'right', 'up']
TRANSPARENT = (0, 0, 0, 0)


# ---- Reading the source ----------------------------------------------------------------------------

def edge_positions(im, axis):
    """How many strong colour changes sit between each pixel and the next, along x (axis 0) or y (1)."""
    W, H = im.size; px = im.load()
    hist = [0] * ((W if axis == 0 else H) - 1)
    dx, dy = (1, 0) if axis == 0 else (0, 1)
    for y in range(H - dy):
        for x in range(W - dx):
            p = px[x, y]; q = px[x + dx, y + dy]
            if abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2]) > 60:
                hist[x if axis == 0 else y] += 1
    return hist


def grid_fit(pos, tot, p):
    """How tightly the edges bunch on a grid of period p (1 = all on its lines), and the grid's phase."""
    sx = sy = 0.0
    for x, w in pos:
        t = 2 * math.pi * x / p
        sx += w * math.cos(t); sy += w * math.sin(t)
    return math.hypot(sx, sy) / tot, (math.atan2(sy, sx) / (2 * math.pi) * p) % p


def edge_list(hist):
    mean = sum(hist) / len(hist)
    pos = [(i + 1, h) for i, h in enumerate(hist) if h > mean]   # a boundary sits before pixel i + 1
    return pos, sum(w for _, w in pos) or 1


def find_grid(hist):
    """(period, phase, fit) of the art-pixel grid. Every period from 3 to 20 px is tried: the edges are
    wrapped around a circle of that period, and the fit is how tightly they bunch (1 = all on the grid
    lines). Half the true period fits as well as the period itself, so the largest period that fits
    nearly as well as the best one wins."""
    pos, tot = edge_list(hist)
    fits = []
    p = 3.0
    while p <= 20:
        r, phase = grid_fit(pos, tot, p)
        fits.append((r, p, phase))
        p += 0.002
    top = max(f[0] for f in fits)
    r, period, phase = max((f for f in fits if f[0] >= 0.85 * top), key=lambda f: f[1])
    return period, phase, r


def native(im, p, phx, phy):
    """One pixel per art pixel: the median colour of the centre of each grid square."""
    W, H = im.size; px = im.load()
    nx = int((W - phx) / p); ny = int((H - phy) / p)
    out = Image.new('RGB', (nx, ny)); op = out.load(); r = max(1, int(p * 0.25))
    for j in range(ny):
        for i in range(nx):
            cx = int(phx + (i + 0.5) * p); cy = int(phy + (j + 0.5) * p)
            win = [px[x, y] for y in range(max(0, cy - r), min(H, cy + r + 1)) for x in range(max(0, cx - r), min(W, cx + r + 1))]
            op[i, j] = tuple(sorted(c[k] for c in win)[len(win) // 2] for k in range(3))
    return out


def keyed(cell):
    """Magenta (and its anti-aliased fringe) becomes transparent."""
    out = Image.new('RGBA', cell.size)
    px = cell.load(); op = out.load()
    for y in range(cell.size[1]):
        for x in range(cell.size[0]):
            r, g, b = px[x, y][:3]
            bg = (r - g > 55 and b - g > 55) or (r > 150 and b > 150 and g < 110)
            op[x, y] = TRANSPARENT if bg else (r, g, b, 255)
    return out


im = Image.open(a.src).convert('RGB')
SRC_W, SRC_H = im.size


def has_grid_lines(img):
    """Whether dark lines run between the cells: each inner cell boundary has a near-black column (or
    row) within 4 px of it for most of its length."""
    px = img.load(); W, H = img.size
    def dark_share(coords):
        pts = list(coords)
        return sum(1 for x, y in pts if sum(px[x, y]) < 150) / len(pts)
    for ci in range(1, gc):
        x0 = round(ci * W / gc)
        if max(dark_share((x, y) for y in range(0, H, 2)) for x in range(max(0, x0 - 4), min(W, x0 + 5))) < 0.6: return False
    for ri in range(1, gr):
        y0 = round(ri * H / gr)
        if max(dark_share((x, y) for x in range(0, W, 2)) for y in range(max(0, y0 - 4), min(H, y0 + 5))) < 0.6: return False
    return gc > 1 or gr > 1


GRID_LINES = a.grid_lines == 'on' or (a.grid_lines == 'auto' and has_grid_lines(im))
if GRID_LINES: print('grid lines between the cells: removed')
# Source pixel -> working pixel: x_work = (x_src - org_x) / unit.
unit, org_x, org_y = 1.0, 0.0, 0.0
if a.mode == 'stable' and a.pixel != '0':
    if a.pixel == 'auto':
        px_, phx, rx = find_grid(edge_positions(im, 0)); py_, phy, ry = find_grid(edge_positions(im, 1))
        print(f'source pixel {px_:.3f} x {py_:.3f} (fit {rx:.2f}, {ry:.2f})')
        p = (px_ + py_) / 2 if min(rx, ry) >= 0.3 and abs(px_ - py_) < 0.2 else 0
        if not p and max(rx, ry) >= 0.4:
            # One axis is clear (the other muddied, e.g. by grid lines between the cells): art pixels
            # are square, so take its period for both and find the other axis's phase with it.
            p = px_ if rx >= ry else py_
            if rx >= ry: ry, phy = grid_fit(*edge_list(edge_positions(im, 1)), p)
            else: rx, phx = grid_fit(*edge_list(edge_positions(im, 0)), p)
            print(f'{p:.3f} for both axes: fit {rx:.2f}, {ry:.2f}')
            if min(rx, ry) < 0.3: p = 0
        if not p:
            print('no clear pixel grid: sampling skipped')
    else:
        p = float(a.pixel); phx = phy = 0.0
    if p:
        im = native(im, p, phx, phy); unit, org_x, org_y = p, phx, phy
W, H = im.size


def cut(ri, ci):
    """Source frame at grid row ri, column ci, keyed and cropped (in working pixels)."""
    box = [ci * SRC_W / gc, ri * SRC_H / gr, (ci + 1) * SRC_W / gc, (ri + 1) * SRC_H / gr]
    box = (max(0, round((box[0] - org_x) / unit)), max(0, round((box[1] - org_y) / unit)),
           min(W, round((box[2] - org_x) / unit)), min(H, round((box[3] - org_y) / unit)))
    f = keyed(im.crop(box))
    if GRID_LINES: f = drop_grid_lines(f)
    f = main_parts(f)
    bb = f.getbbox()
    return f.crop(bb) if bb else None


def drop_grid_lines(f):
    """Near-black pixels joined (through other near-black pixels) to the cell's border are the grid
    lines: they become transparent. Black hair and outlines survive, as a figure never touches its
    cell's border on sheets that have lines (only used there: see --grid-lines)."""
    w, h = f.size; px = f.load()
    dark = lambda x, y: px[x, y][3] and sum(px[x, y][:3]) < 150
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    stack = [(x, y) for x, y in stack if dark(x, y)]
    while stack:
        x, y = stack.pop()
        if not dark(x, y): continue
        px[x, y] = TRANSPARENT
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and dark(nx, ny):
                stack.append((nx, ny))
    return f


def main_parts(f):
    """Keep the figure: the connected parts (8-way) at least 3 % the size of the largest. Bits of the
    neighbouring frames that reach into the cell, and stray specks, are dropped."""
    w, h = f.size; px = f.load(); seen = set(); parts = []
    for y in range(h):
        for x in range(w):
            if (x, y) in seen or px[x, y][3] == 0: continue
            stack = [(x, y)]; seen.add((x, y)); part = []
            while stack:
                cx, cy = stack.pop(); part.append((cx, cy))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen and px[nx, ny][3]:
                            seen.add((nx, ny)); stack.append((nx, ny))
            parts.append(part)
    if not parts: return f
    biggest = max(len(p) for p in parts)
    for part in parts:
        if len(part) < 0.03 * biggest:
            for x, y in part: px[x, y] = TRANSPARENT
    return f


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


# Every frame by direction, as (source column, image), in source order.
by_dir = {d: [] for d in ORDER}
for ri, name in enumerate(names):
    if name in by_dir:
        for ci in range(gc):
            f = cut(ri, ci)
            if f: by_dir[name].append((ci, f))
if a.sides:
    by_dir['left'] = []; by_dir['right'] = []
    for ri in map(int, a.sides.split(',')):
        for ci in range(gc):
            f = cut(ri, ci)
            d = f and facing(f)
            if d: by_dir[d].append((ci, f))
    print('side frames: left', len(by_dir['left']), 'right', len(by_dir['right']))
for d, m in (('left', 'right'), ('right', 'left')):
    if not by_dir[d]:
        by_dir[d] = [(ci, f.transpose(Image.FLIP_LEFT_RIGHT)) for ci, f in by_dir[m]]


# ---- Small pixel helpers --------------------------------------------------------------------------

def opaque(img, x, y):
    return 0 <= x < img.size[0] and 0 <= y < img.size[1] and img.getpixel((x, y))[3] > 0


def feet_spread(f):
    """Width of the bottom eighth of a frame: standing frames keep the feet together."""
    w, h = f.size; band = max(2, h // 8)
    xs = [x for y in range(h - band, h) for x in range(w) if opaque(f, x, y)]
    return max(xs) - min(xs) if xs else w


def torso_centre(f):
    """Horizontal centre of the torso band (45-75 % of the height), the part that does not swing."""
    bb = f.getbbox()
    if not bb: return f.size[0] / 2
    t, b = bb[1], bb[3]; h = b - t
    xs = [x for y in range(t + int(h * 0.45), t + int(h * 0.75)) for x in range(f.size[0]) if opaque(f, x, y)]
    return (min(xs) + max(xs) + 1) / 2 if xs else f.size[0] / 2


def shrink(f, scale):
    """Scale down by `scale`. nearest samples one source pixel per target pixel; of the 16 ways to place
    that sampling grid (quarter-pixel steps), the one that keeps the most contrast wins, so small
    details such as the whites of the eyes survive."""
    if abs(scale - 1) < 1e-6:
        return f
    w, h = max(1, round(f.size[0] * scale)), max(1, round(f.size[1] * scale))
    if a.resample == 'smooth':
        s = f.resize((w, h), Image.LANCZOS)
        s.putalpha(s.getchannel('A').point(lambda v: 255 if v > 110 else 0))
        return s
    src = f.load(); sw, sh = f.size
    best = None
    for oy in (0.125, 0.375, 0.625, 0.875):
        for ox in (0.125, 0.375, 0.625, 0.875):
            s = Image.new('RGBA', (w, h)); sp = s.load()
            for j in range(h):
                for i in range(w):
                    sp[i, j] = src[min(sw - 1, int((i + ox) * sw / w)), min(sh - 1, int((j + oy) * sh / h))]
            energy = 0
            for j in range(h):
                for i in range(w - 1):
                    p, q = sp[i, j], sp[i + 1, j]
                    if p[3] and q[3]: energy += abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2])
            for j in range(h - 1):
                for i in range(w):
                    p, q = sp[i, j], sp[i, j + 1]
                    if p[3] and q[3]: energy += abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2])
            if best is None or energy > best[0]:
                best = (energy, s)
    return best[1]


def despeckle(f):
    """Drop opaque pixels with no opaque neighbour (8-way): strays left by the conversion."""
    out = f.copy()
    for y in range(f.size[1]):
        for x in range(f.size[0]):
            if opaque(f, x, y) and not any(opaque(f, x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy):
                out.putpixel((x, y), TRANSPARENT)
    return out


def place(f, cx):
    """A cell-sized image with f's feet on the bottom row and its torso centre at the cell's centre."""
    cell = Image.new('RGBA', (cw, ch), TRANSPARENT)
    cell.alpha_composite(f, (int(round(cw / 2 - cx)), ch - f.size[1]))
    return cell


def move_region(img, pred, dx, dy):
    """Move the opaque pixels where pred(x, y) holds by (dx, dy), over whatever is there."""
    w, h = img.size
    src = img.copy(); out = img.copy()
    pts = [(x, y) for y in range(h) for x in range(w) if pred(x, y) and src.getpixel((x, y))[3] > 0]
    for x, y in pts:
        out.putpixel((x, y), TRANSPARENT)
    for x, y in pts:
        if 0 <= x + dx < w and 0 <= y + dy < h:
            out.putpixel((x + dx, y + dy), src.getpixel((x, y)))
    return out


# ---- Building the sheet ---------------------------------------------------------------------------

def stable_sheet():
    bases = {}
    for d in ORDER:
        frames = by_dir[d]
        if not frames:
            raise SystemExit(f'no frames for {d}')
        firsts = [f for ci, f in frames if ci == 0]
        bases[d] = firsts[0] if firsts else min((f for _, f in frames), key=feet_spread)
    tallest = max(f.size[1] for f in bases.values()); widest = max(f.size[0] for f in bases.values())
    scale = min(ch * a.fill / tallest, cw / widest, 1.0)
    print('scale', round(scale / unit, 4), 'of the source; heights', {d: round(f.size[1] * scale) for d, f in bases.items()})
    sheet = Image.new('RGBA', (cw * 3, ch * 4), TRANSPARENT)
    for r, d in enumerate(ORDER):
        base = despeckle(shrink(bases[d], scale))
        cell = place(base, torso_centre(base))
        bb = cell.getbbox(); top, bottom = bb[1], bb[3]
        side = d in ('left', 'right'); fwd = 1 if d == 'right' else -1
        leg_top = bottom - max(2, round((bottom - top) * (a.side_rows if side else a.leg_rows)))
        feet = [x for y in range(leg_top, ch) for x in range(cw) if opaque(cell, x, y)]
        cx = (min(feet) + max(feet) + 1) / 2   # where the feet band splits into the two feet
        steps = []
        for k in (1, 2):
            others = [f for _, f in by_dir[d] if f is not bases[d]]
            if a.legs == 'blend' and others:
                o = despeckle(shrink(others[(k - 1) % len(others)], scale))
                oc = place(o, torso_centre(o))
                s = cell.copy()
                for y in range(leg_top, ch):
                    for x in range(cw):
                        s.putpixel((x, y), oc.getpixel((x, y)))
            elif side:
                s = move_region(cell, lambda x, y: y >= leg_top and (x - cx) * fwd >= 0, fwd, 0)
                s = move_region(s, lambda x, y: y >= leg_top and (x - cx) * fwd < 0, -fwd, 0 if k == 1 else -1)
            else:
                s = move_region(cell, lambda x, y, k=k: y >= leg_top and ((x < cx) if k == 1 else (x >= cx)), 0, -1)
            if a.bob:
                s = move_region(s, lambda x, y: y < leg_top, 0, a.bob)
            steps.append(s)
        for k, img in enumerate([cell] + steps):
            sheet.alpha_composite(img, (k * cw, r * ch))
    return sheet


def raw_sheet():
    frames = {}
    for d in ORDER:
        got = [f for _, f in by_dir[d]]
        for k, ci in enumerate(cols):
            if a.sides and d in ('left', 'right'):
                frames[(d, k)] = got[k % len(got)]
            else:
                frames[(d, k)] = next((f for c, f in by_dir[d] if c == ci), got[0])
    tallest = max(f.size[1] for f in frames.values()); widest = max(f.size[0] for f in frames.values())
    scale = min((ch - 1) * a.fill / tallest, cw / widest)
    sheet = Image.new('RGBA', (cw * 3, ch * 4))
    for r, d in enumerate(ORDER):
        for k in range(3):
            s = shrink(frames[(d, k)], scale)
            sheet.alpha_composite(s, (k * cw + (cw - s.size[0]) // 2, r * ch + ch - 1 - s.size[1]))
    return sheet


sheet = stable_sheet() if a.mode == 'stable' else raw_sheet()

# One palette per character keeps the pixels crisp; the outline colour comes on top of it.
outline = None if a.outline == 'none' or a.mode == 'raw' else tuple(int(a.outline[i:i + 2], 16) for i in (0, 2, 4))
alpha = sheet.getchannel('A')
q = sheet.convert('RGB').quantize(colors=a.colors - (1 if outline else 0), method=Image.MEDIANCUT, dither=Image.NONE).convert('RGBA')
q.putalpha(alpha)
if outline:
    # Every silhouette edge pixel (an opaque pixel with a transparent 4-neighbour inside its cell)
    # becomes the outline colour, so every frame has the same clean 1 px line. The soles (an edge only
    # because the cell ends below them) keep their colour.
    edge = []
    for y in range(q.size[1]):
        for x in range(q.size[0]):
            if alpha.getpixel((x, y)) == 0: continue
            x0, y0 = x // cw * cw, y // ch * ch
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if x0 <= nx < x0 + cw and y0 <= ny < y0 + ch and alpha.getpixel((nx, ny)) == 0:
                    edge.append((x, y)); break
                if not (x0 <= nx < x0 + cw) or ny < y0:
                    edge.append((x, y)); break
    for x, y in edge:
        q.putpixel((x, y), outline + (255,))

if a.preview:
    os.makedirs(a.preview, exist_ok=True)
    name = os.path.splitext(os.path.basename(a.out))[0]
    z = 8
    before = Image.open(a.out).convert('RGBA') if os.path.exists(a.out) else Image.new('RGBA', q.size)
    pv = Image.new('RGBA', ((before.width + q.width + 3) * z, max(before.height, q.height) * z), (88, 140, 80, 255))
    pv.alpha_composite(before.resize((before.width * z, before.height * z), Image.NEAREST), (0, 0))
    pv.alpha_composite(q.resize((q.width * z, q.height * z), Image.NEAREST), ((before.width + 3) * z, 0))
    pv.save(os.path.join(a.preview, f'{name}-before-after.png'))
    frames = []
    for k in (1, 0, 2, 0):
        fr = Image.new('RGBA', (cw * 4 * z, ch * z), (88, 140, 80, 255))
        for r in range(4):
            cell = q.crop((k * cw, r * ch, (k + 1) * cw, (r + 1) * ch)).resize((cw * z, ch * z), Image.NEAREST)
            fr.alpha_composite(cell, (r * cw * z, 0))
        frames.append(fr.convert('RGB'))
    frames[0].save(os.path.join(a.preview, f'{name}-walk.gif'), save_all=True, append_images=frames[1:], duration=140, loop=0)
q.save(a.out)
print('sheet', q.size, 'colours', len(q.getcolors(4096)))
