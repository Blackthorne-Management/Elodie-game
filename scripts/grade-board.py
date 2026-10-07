# Grade the painted board for the game: a little darker and grittier, a vignette toward the edges and a warm lift
# around the Throne, then write the webp the game loads (BOARD_ART.image).
# Usage: python3 -I scripts/grade-board.py art/board/board-dark.jpg public/art/board.webp
import sys
import numpy as np
import cv2

src, out = sys.argv[1], sys.argv[2]
im = cv2.imread(src).astype(np.float32) / 255
H, W = im.shape[:2]
# darker, a touch more contrast, slightly less saturated
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
hsv[..., 1] *= 0.88
im = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
im = np.clip((im - 0.5) * 1.08 + 0.5, 0, 1) * 0.86
# vignette: full strength at the centre, falling to 55% in the corners
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / np.sqrt(2)
im *= (1 - 0.45 * np.clip((r - 0.25) / 0.75, 0, 1) ** 1.4)[..., None]
# a soft warm glow around the Throne
glow = np.exp(-(((xx - W / 2) ** 2 + (yy - H / 2) ** 2) / (2 * (0.07 * W) ** 2)))
im += glow[..., None] * np.array([0.05, 0.12, 0.2], np.float32)
cv2.imwrite(out, (np.clip(im, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 88])
print('wrote', out, W, H)
