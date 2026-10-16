# Usage: python3 scripts/chroma-key.py art/ui/ui-frame.webp public/art/ui/ui-frame.png green [--trim]
# Remove a flat chroma background (green or magenta) and soften the edge; write PNG with alpha.
# --trim crops the result to the opaque pixels (plus a small margin).
import sys, numpy as np, cv2
args = [a for a in sys.argv[1:] if not a.startswith('--')]
src, out, key = args[0], args[1], (args[2] if len(args) > 2 else 'green')
img = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32)
b, g, r = img[..., 0], img[..., 1], img[..., 2]
# how strongly a pixel is the key colour
k = (g - np.maximum(r, b)) if key == 'green' else (np.minimum(r, b) - g)
alpha = 1 - np.clip((k - 40) / 90, 0, 1)
# despill: remove only the key colour's excess, fully at the soft edge and lightly inside, so the art keeps its own
# colours (coral, pink and violet survive a magenta key)
spill = np.clip(k, 0, None) * np.where(alpha < 0.99, 1.0, 0.35)
if key == 'green': img[..., 1] = g - spill
else: img[..., 0] = b - spill; img[..., 2] = r - spill
rgba = np.dstack([img.clip(0, 255), (alpha * 255)]).astype(np.uint8)
if '--trim' in sys.argv:
    ys, xs = np.nonzero(rgba[..., 3] > 8); m = 8
    rgba = rgba[max(ys.min() - m, 0):ys.max() + m + 1, max(xs.min() - m, 0):xs.max() + m + 1]
cv2.imwrite(out, rgba)
print(out, rgba.shape)
