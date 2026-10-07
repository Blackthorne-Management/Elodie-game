# Usage: python3 scripts/chroma-key.py art/ui/ui-frame.webp public/art/ui/ui-frame.png green
# Remove a flat chroma background (green or magenta) and soften the edge; write PNG with alpha.
import sys, numpy as np, cv2
src, out, key = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else 'green')
img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
b, g, r = img[..., 0], img[..., 1], img[..., 2]
# how strongly a pixel is the key colour
k = (g - np.maximum(r, b)) if key == 'green' else (np.minimum(r, b) - g)
alpha = 1 - np.clip((k - 40) / 90, 0, 1)
# despill: pull the key channel down where it dominates
if key == 'green': img[..., 1] = np.minimum(g, np.maximum(r, b) + 10)
else:
    m = g + 10; img[..., 0] = np.minimum(b, m); img[..., 2] = np.minimum(r, m)
rgba = np.dstack([img.clip(0, 255), (alpha * 255)]).astype(np.uint8)
cv2.imwrite(out, rgba)
print(out, rgba.shape)
