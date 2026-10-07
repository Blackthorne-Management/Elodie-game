# Age the painted frame and build the riveted iron variant.
# Usage: python3 -I scripts/batter-frame.py public/art/ui/ui-frame.png public/art/ui
#   ui-frame-worn.png  the filigree frame, darker, duller and battered (banner, sheets, dialogs)
#   ui-frame-iron.png  a heavy riveted iron strap with corner brackets, built from the same band (top bar)
import sys, os
import numpy as np
import cv2

src, out_dir = sys.argv[1], sys.argv[2]
rng = np.random.default_rng(7)
frame = cv2.imread(src, cv2.IMREAD_UNCHANGED).astype(np.float32)
H, W = frame.shape[:2]
BAND = 58                      # the straight steel band is ~58 px thick on every side


def noise(shape, scale, octaves=4):
    """Smooth fractal noise in 0..1."""
    acc = np.zeros(shape, np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        small = rng.random((shape[0] // s + 2, shape[1] // s + 2)).astype(np.float32)
        acc += amp * cv2.resize(small, (shape[1], shape[0]), interpolation=cv2.INTER_CUBIC)
        total += amp
        amp *= 0.5
    acc /= total
    return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)


def batter(img, darken=0.6, desat=0.55, chip=True, seed_scratches=420):
    img = img.copy()
    bgr, alpha = img[..., :3], img[..., 3]
    # dull the gold and darken everything
    hsv = cv2.cvtColor(bgr.clip(0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] *= desat
    hsv[..., 2] *= darken
    bgr = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    # grime: blotchy dark patches, heavier in the corners and crevices
    grime = noise((H, W), 160)
    fine = noise((H, W), 18, 3)
    shade = 0.62 + 0.38 * grime * (0.75 + 0.25 * fine)
    bgr *= shade[..., None]
    # tarnish: a cold green-brown cast in the low spots
    tarnish = np.clip((0.45 - grime) * 2.2, 0, 1)[..., None]
    bgr = bgr * (1 - 0.25 * tarnish) + np.array([38, 46, 40], np.float32) * 0.25 * tarnish
    # scratches: short light and dark strokes across the metal
    scr = np.zeros((H, W), np.float32)
    for _ in range(seed_scratches):
        x, y = rng.integers(0, W), rng.integers(0, H)
        ang, ln = rng.uniform(0, np.pi), rng.integers(8, 70)
        x2, y2 = int(x + ln * np.cos(ang)), int(y + ln * np.sin(ang))
        cv2.line(scr, (int(x), int(y)), (x2, y2), float(rng.choice([1.0, -1.0])) * rng.uniform(.3, 1), 1, cv2.LINE_AA)
    bgr += (scr * 46)[..., None]
    # pits and rust specks
    pits = (rng.random((H, W)) > 0.9975).astype(np.float32)
    pits = cv2.GaussianBlur(cv2.dilate(pits, np.ones((2, 2))), (3, 3), 0)
    bgr = bgr * (1 - 0.6 * pits[..., None]) + np.array([20, 35, 70], np.float32) * 0.6 * pits[..., None]
    # chipped silhouette: bite small notches out of the outer edge and the filigree tips
    if chip:
        solid = (alpha > 128).astype(np.uint8)
        dist = cv2.distanceTransform(solid, cv2.DIST_L2, 3)
        bite = (noise((H, W), 10, 2) > 0.72) & (dist < 3.5)
        alpha = np.where(bite, alpha * 0.0, alpha)
    out = np.dstack([bgr.clip(0, 255), alpha])
    return out


def iron_frame():
    """A heavy iron strap frame: the battered steel band on all sides and riveted L-brackets in the corners."""
    worn = batter(frame, darken=0.55, desat=0.35, chip=False, seed_scratches=300)
    out = np.zeros((H, W, 4), np.float32)
    # straight band taken from the middle of the top edge, laid along all four sides
    strip = worn[0:BAND, 380:644].copy()
    top = cv2.resize(strip, (W, BAND), interpolation=cv2.INTER_LINEAR)
    out[0:BAND] = top
    out[H - BAND:H] = top[::-1]
    side = np.transpose(top, (1, 0, 2))
    out[:, 0:BAND] = np.where(out[:, 0:BAND, 3:4] > 0, out[:, 0:BAND], side)
    out[:, W - BAND:W] = np.where(out[:, W - BAND:W, 3:4] > 0, out[:, W - BAND:W], side[:, ::-1])
    # an L-shaped bracket plate with bevel lighting, then rivets
    S, T = 230, 92
    hmap = np.zeros((S, S), np.float32)
    cv2.rectangle(hmap, (0, 0), (S - 1, T), 1, -1)
    cv2.rectangle(hmap, (0, 0), (T, S - 1), 1, -1)
    mask = hmap.copy()
    hmap = cv2.GaussianBlur(hmap, (0, 0), 6) * mask
    gy, gx = np.gradient(hmap)
    light = np.clip(0.55 - 4.5 * (gx * 0.6 + gy * 0.8), 0, 1)
    tex = noise((S, S), 40) * 0.5 + noise((S, S), 6, 2) * 0.5
    base = (34 + 70 * light) * (0.7 + 0.45 * tex)
    # a dark worn rim around the plate
    rim = cv2.dilate(mask, np.ones((3, 3))) - cv2.erode(mask, np.ones((5, 5)))
    base = base * (1 - 0.55 * rim)
    plate = np.dstack([base * 1.05, base, base * .92, mask * 255])
    # rivets
    for (cx, cy) in [(30, 30), (30, 140), (30, 200), (140, 30), (200, 30), (62, 62)]:
        yy, xx = np.mgrid[0:S, 0:S]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        r = 11
        dome = np.clip(1 - (d / r) ** 2, 0, 1)
        hl = np.clip(1 - np.sqrt((xx - cx + 4) ** 2 + (yy - cy + 4) ** 2) / 6, 0, 1)
        rim = (np.abs(d - r) < 1.6).astype(np.float32)
        for ch, k in zip(range(3), (1.05, 1, .9)):
            plate[..., ch] = np.where(d < r, (40 + 90 * dome + 120 * hl) * k, plate[..., ch])
            plate[..., ch] *= 1 - 0.7 * rim
    plate = batter(np.pad(plate, ((0, H - S), (0, W - S), (0, 0))), darken=0.95, desat=1, chip=True, seed_scratches=80)[:S, :S]
    for flip in [(False, False), (True, False), (False, True), (True, True)]:
        p = plate
        if flip[0]: p = p[:, ::-1]
        if flip[1]: p = p[::-1, :]
        y0 = 0 if not flip[1] else H - S
        x0 = 0 if not flip[0] else W - S
        a = p[..., 3:4] / 255
        out[y0:y0 + S, x0:x0 + S, :3] = out[y0:y0 + S, x0:x0 + S, :3] * (1 - a) + p[..., :3] * a
        out[y0:y0 + S, x0:x0 + S, 3:4] = np.maximum(out[y0:y0 + S, x0:x0 + S, 3:4], p[..., 3:4])
    return out


os.makedirs(out_dir, exist_ok=True)
cv2.imwrite(os.path.join(out_dir, 'ui-frame-worn.png'), batter(frame).clip(0, 255).astype(np.uint8))
cv2.imwrite(os.path.join(out_dir, 'ui-frame-iron.png'), iron_frame().clip(0, 255).astype(np.uint8))
print('wrote ui-frame-worn.png and ui-frame-iron.png')
