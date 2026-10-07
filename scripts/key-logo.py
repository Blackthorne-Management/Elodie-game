# Cut the title logo out of its pale background (white with a soft green glow) and age it slightly.
# Usage: python3 -I scripts/key-logo.py art/ui/logo.jpg public/art/ui/logo.webp
# The lettering is warm (gold, red vines) or dark; the background and its glow are pale and neutral or green,
# so warmth and darkness decide what stays.
import sys
import numpy as np
import cv2

src, out = sys.argv[1], sys.argv[2]
im = cv2.imread(src).astype(np.float32)
b, g, r = im[..., 0], im[..., 1], im[..., 2]
warm = np.clip((r - b - 18) / 30, 0, 1)                  # gold and red: always kept
dark = np.clip((228 - np.minimum(r, b)) / 70, 0, 1)      # anything darker than the pale ground
alpha = np.maximum(warm, dark)
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
alpha[alpha < 0.06] = 0
# unmix the white ground from soft edges, then pull any green glow back to neutral
a = np.maximum(alpha, 1e-3)[..., None]
fg = (im - (1 - a) * 255) / a
fg = np.clip(fg, 0, 255)
fb, fgc, fr = fg[..., 0], fg[..., 1], fg[..., 2]
fg[..., 1] = np.minimum(fgc, np.maximum(fr, fb) + 4)
# the pale glow left around the letters becomes a soft dark shadow instead of a grey haze
halo = ((alpha < 0.75) & (warm < 0.3))[..., None]
fg = np.where(halo, fg * 0.25, fg)
# a little darker and duller to sit with the battered frames
hsv = cv2.cvtColor(fg.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
hsv[..., 1] *= 0.9
hsv[..., 2] *= 0.9
fg = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
rgba = np.dstack([fg, alpha * 255]).clip(0, 255).astype(np.uint8)
ys, xs = np.where(rgba[..., 3] > 10)
pad = 6
rgba = rgba[max(0, ys.min() - pad):ys.max() + pad, max(0, xs.min() - pad):xs.max() + pad]
w = 1000
if rgba.shape[1] > w:
    rgba = cv2.resize(rgba, (w, round(rgba.shape[0] * w / rgba.shape[1])), interpolation=cv2.INTER_AREA)
cv2.imwrite(out, rgba, [cv2.IMWRITE_WEBP_QUALITY, 92])
print('wrote', out, rgba.shape)
