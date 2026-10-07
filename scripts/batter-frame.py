# Age the painted frame and build the riveted iron variant.
# Usage: python3 -I scripts/batter-frame.py public/art/ui/ui-frame.png public/art/ui
#        python3 -I scripts/batter-frame.py <keyed.png> <out.png> --light   (a lighter pass for art that is already worn)
#   ui-frame-worn.png  the filigree frame, darker, duller and battered (banner, sheets, dialogs)
import sys, os
import numpy as np
import cv2

src, out_dir = sys.argv[1], sys.argv[2]
LIGHT = '--light' in sys.argv
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


if LIGHT:
    cv2.imwrite(out_dir, batter(frame, darken=0.8, desat=0.75, chip=False, seed_scratches=120).clip(0, 255).astype(np.uint8))
    print('wrote', out_dir)
    sys.exit()
os.makedirs(out_dir, exist_ok=True)
cv2.imwrite(os.path.join(out_dir, 'ui-frame-worn.png'), batter(frame).clip(0, 255).astype(np.uint8))
print('wrote ui-frame-worn.png')
