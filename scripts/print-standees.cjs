// The 8 pawns: double-sided chipboard standees that clip into BoardGamesMaker's plastic stands (the 23 × 19 × 12 mm
// stand, which sits inside one board square: the 24" board has 26 squares across, about 23.4 mm each). Each standee
// is a 1" × 2" (25.4 × 50.8 mm) rectangle, 300 dpi with the 1/8" bleed: 1.25" × 2.25" = 375 × 675 px per face. The
// bottom 0.5" goes into the stand, so nothing that matters sits there.
//   face: the house crest, or the Gen I portrait (head and shoulders, cut as the app cuts pawns: PORTRAIT_CROP) once
//   PRINT_ART.standeeFace in src/assets.config.ts is 'portrait' and the portrait exists. The back repeats the front,
//   so the pawn reads from every seat at the table.
// Run via `npm run print:standees`.
// Out: print/standees/standee-<house>-front.png and -back.png, print/standees/standees.pdf, print/preview-standees.jpg
const path = require('path');
const { ROOT, data, I, uri, art, crestImg, esc, short, launch, render, toPdf, contactSheet } = require('./print-common.cjs');

const W = I(1.25), H = I(2.25), B = I(0.125), CLIP = I(0.5);
const crop = data.portraitCrop;

const css = `
.st { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
.arch { position: absolute; left: ${B + 18}px; right: ${B + 18}px; top: ${B + 18}px; bottom: ${B + CLIP - 6}px;
  border-radius: ${(W - 2 * B - 36) / 2}px ${(W - 2 * B - 36) / 2}px 10px 10px; border: 5px solid #e2b85c;
  box-shadow: 0 0 0 2px #3a2408, inset 0 0 0 2px #3a2408, inset 0 0 16px rgba(0,0,0,.6); }
.face { position: absolute; left: 50%; top: ${B + 34}px; transform: translateX(-50%); }
.portrait { border-radius: 50%; border: 4px solid #e2b85c; background-repeat: no-repeat; }
.name { position: absolute; left: ${B + 22}px; right: ${B + 22}px; top: ${B + 34 + I(0.7) + 16}px; text-align: center; white-space: nowrap;
  font: 700 30px Cinzel; letter-spacing: .04em; text-transform: uppercase; color: #fbeec4; text-shadow: 0 2px 3px rgba(0,0,0,.9); }
.home { top: ${B + 34 + I(0.7) + 56}px; font: italic 30px Garamond; text-transform: none; letter-spacing: 0; color: #e8dcc0; }
.base { position: absolute; left: 0; right: 0; bottom: 0; height: ${B + CLIP}px; background: linear-gradient(#1a0c0e, #0c0607); }`;

const standee = h => {
  const portrait = data.printArt.standeeFace === 'portrait' ? art(data.printArt.portrait, h.id, 1) : null;
  const size = I(0.7);
  const face = portrait
    ? `<div class="portrait" style="width:${size}px;height:${size}px;background-image:url(${uri(portrait)});background-size:${crop.pawnZoom * 100}% auto;background-position:50% ${crop.pawnY}"></div>`
    : crestImg(h, size, 'border-radius:50%;filter:drop-shadow(0 4px 5px rgba(0,0,0,.8))');
  return { portrait: !!portrait, html: `<div class="st" style="background:radial-gradient(ellipse at 50% 30%, ${h.color} 0%, #2b1418 70%, #14080b 100%)">
    <div class="base"></div><div class="arch"></div>
    <div class="face">${face}</div>
    <div class="name fit-w" data-min="18">${esc(short(h))}</div>
    <div class="name home fit-w" data-min="18">${esc(h.homeland)}</div></div>` };
};

(async () => {
  const b = await launch();
  const files = [], tight = [], faces = [];
  for (const h of data.houses) {
    const s = standee(h);
    faces.push(`${short(h)}: ${s.portrait ? 'Gen I portrait' : 'crest'}`);
    for (const side of ['front', 'back']) {
      const file = path.join(ROOT, 'print/standees', `standee-${h.id}-${side}.png`);
      if (await render(b, css, s.html, W, H, file)) tight.push(`${h.id} ${side}`);
      files.push(file);
    }
  }
  await contactSheet(b, files.filter((_, i) => i % 2 === 0), path.join(ROOT, 'print/preview-standees.jpg'), { cols: 8, tw: 150, bleedPx: B });
  await b.close();
  toPdf(files, path.join(ROOT, 'print/standees/standees.pdf'));
  console.log(`${files.length} standee faces -> print/standees/ (${W} x ${H} px). ${faces.join(', ')}`);
  if (tight.length) console.log(`Text still overflows on: ${tight.join(', ')}`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
