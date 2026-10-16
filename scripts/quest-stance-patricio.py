"""Young Patricio's weapon stances: a fixed window (feet at the cell's bottom centre), scaled a little more
than Gianna's (K 0.20 vs 0.18) so he stands taller and broader."""
import sys
from PIL import Image
K, HALF, H = 0.20, 300, 500
def magenta(r, g, b): return (r - g > 60 and b - g > 60) or (r > 150 and b > 150 and g < 130)
def cell(src, cx, foot, lo, hi):
    W = 2 * HALF; out = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sp = src.load(); op = out.load()
    top = foot - H
    for y in range(H):
        sy = top + y
        if sy < 0 or sy >= src.height: continue
        for x in range(W):
            sx = cx - HALF + x
            if sx < lo or sx >= hi: continue
            r, g, b = sp[sx, sy][:3]
            if magenta(r, g, b) or (r < 40 and g < 40 and b < 40 and abs(sx - 510) < 8): continue
            op[x, y] = (r, g, b, 255)
    w, h = round(W * K), round(H * K); s = out.resize((w, h), Image.BOX); p = s.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = p[x, y]
            p[x, y] = (min(255, r * 255 // a), min(255, g * 255 // a), min(255, b * 255 // a), 255) if a >= 120 else (0, 0, 0, 0)
    return s
for path, dest in zip(sys.argv[1::2], sys.argv[2::2]):
    src = Image.open(path).convert('RGB')
    st = cell(src, 195, 494, 0, 505); dn = cell(src, 785, 522, 518, src.width)
    sheet = Image.new('RGBA', (st.width * 2, st.height), (0, 0, 0, 0)); sheet.paste(st, (0, 0), st); sheet.paste(dn, (st.width, 0), dn)
    q = sheet.convert('RGB').quantize(colors=28, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGBA'); q.putalpha(sheet.split()[3]); q.save(dest)
    print(dest, q.size)
