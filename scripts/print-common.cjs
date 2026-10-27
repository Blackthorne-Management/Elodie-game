// Shared helpers for the print scripts that came after the cards, board and boxes (player boards, standees,
// tokens, Legacy and reference cards, score pad, rulebook). Same approach as scripts/print-cards.cjs: game text from
// print/.data.json (written by tests/print.test.ts), art found through PRINT_ART in src/assets.config.ts, HTML laid
// out in Playwright's Chromium, screenshots at the print size, PDFs by Pillow.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DPI = 300;
const I = n => Math.round(n * DPI);             // inches → px at 300 dpi
const BLEED = 0.125, SAFE = 0.125;             // BoardGamesMaker: 1/8" bleed, then 1/8" safe margin inside the cut
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'print/.data.json'), 'utf8'));

const EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const uri = f => `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`;
// A PRINT_ART pattern ('art/crests/crest-{house}') → the first file that exists, or null.
const art = (pattern, house, gen) => {
  const base = path.join(ROOT, pattern.replace('{house}', house).replace('{gen}', String(gen ?? 1)));
  if (path.extname(base) && fs.existsSync(base)) return base;
  for (const e of ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP']) if (fs.existsSync(base + e)) return base + e;
  return null;
};
const icon = name => uri(path.join(ROOT, data.printArt.icons[name]));
const crestOf = h => art(data.printArt.crest, h.id);
// The crest as an <img>, or the house initial on its colour until the crest exists.
const crestImg = (h, size, extra = '') => {
  const f = crestOf(h);
  return f ? `<img src="${uri(f)}" style="width:${size}px;height:${size}px;object-fit:contain;${extra}">`
    : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${h.color};display:grid;place-items:center;font:700 ${size * 0.5}px Cinzel;color:#fff;${extra}">${h.initial}</div>`;
};

const font = (pkg, file) => uri(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const FONTS = `
@font-face { font-family: Cinzel; font-weight: 600; src: url(${font('cinzel', 'cinzel-latin-600-normal.woff2')}); }
@font-face { font-family: Cinzel; font-weight: 700; src: url(${font('cinzel', 'cinzel-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 400; src: url(${font('eb-garamond', 'eb-garamond-latin-400-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 700; src: url(${font('eb-garamond', 'eb-garamond-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 400; font-style: italic; src: url(${font('eb-garamond', 'eb-garamond-latin-400-italic.woff2')}); }
@font-face { font-family: Garamond; font-weight: 400; src: url(${font('eb-garamond', 'eb-garamond-latin-ext-400-normal.woff2')}); unicode-range: U+0100-024F; }
@font-face { font-family: Garamond; font-weight: 700; src: url(${font('eb-garamond', 'eb-garamond-latin-ext-700-normal.woff2')}); unicode-range: U+0100-024F; }`;

// The game's palette (docs/art/ART-GUIDE.md): cream titles, parchment text, gold keywords, the box's dark sea.
const SEA = 'radial-gradient(ellipse at 50% 45%, #183139 0%, #0f2129 55%, #0a161c 100%)';
const GOLD_TEXT = `background: linear-gradient(180deg, #fbeec4, #e2b85c 55%, #9a6a24); -webkit-background-clip: text; background-clip: text; color: transparent;`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The rule guide's only markup: **bold**.
const rich = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const roman = n => ['I', 'II', 'III', 'IV'][n - 1];
const short = h => h.name.replace('House ', '');

// Shrink text until it fits: .fit-w by width, .fit-h by height (never below data-min px). Returns true if any
// .fit-h box still overflows at its smallest size.
const FIT = `(() => {
  for (const el of document.querySelectorAll('.fit-w')) {
    let s = parseFloat(getComputedStyle(el).fontSize); const min = +(el.dataset.min || 12);
    while (el.scrollWidth > el.clientWidth + 1 && s > min) el.style.fontSize = (s -= 1) + 'px';
  }
  let over = false;
  for (const el of document.querySelectorAll('.fit-h')) {
    let s = parseFloat(getComputedStyle(el).fontSize); const min = +(el.dataset.min || 12);
    while (el.scrollHeight > el.clientHeight + 2 && s > min) el.style.fontSize = (s -= 0.5) + 'px';
    if (el.scrollHeight > el.clientHeight + 2) over = true;
  }
  for (const el of document.querySelectorAll('.fit-w')) if (el.scrollWidth > el.clientWidth + 1) over = true;
  return over;
})()`;

const launch = () => chromium.launch();

// Lay out one piece at w × h px and save it as PNG. Returns true when text still overflows.
async function render(browser, css, html, w, h, file) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(`<style>${FONTS}\n* { box-sizing: border-box; margin: 0; }\nbody { background: #fff; }\n${css}</style>${html}`, { timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(FIT);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h }, timeout: 300000 });
  await page.close();
  return over;
}

// PNG(s) → one PDF at `dpi` (each image one page at its exact print size), as print-box.cjs does it.
function toPdf(pngs, pdf, dpi = DPI, gray = false) {
  execFileSync('python3', ['-I', '-c', `
import json; from PIL import Image; Image.MAX_IMAGE_PIXELS = None
files = json.loads(${JSON.stringify(JSON.stringify(pngs))})
ims = [Image.open(f).convert(${JSON.stringify(gray ? 'L' : 'RGB')}) for f in files]
ims[0].save(${JSON.stringify(pdf)}, resolution=${dpi}, save_all=True, append_images=ims[1:], quality=95, subsampling=0)
`], { stdio: 'inherit' });
}

// A contact sheet of the finished files with the cut line drawn (dashed) `bleedPx` in from each edge, for proofing.
async function contactSheet(browser, files, out, { cols = 4, tw = 360, bleedPx = 0, round = false, bg = '#2a2a2a' } = {}) {
  if (!files.length) return;
  const dims = files.map(f => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; });
  const cells = files.map((f, i) => {
    const [w, h] = dims[i], s = tw / w, th = Math.round(h * s), b = bleedPx * s;
    return `<figure style="margin:0;position:relative;width:${tw}px;height:${th}px">
      <img src="${uri(f)}" style="width:${tw}px;height:${th}px;display:block">
      ${bleedPx ? `<div style="position:absolute;left:${b}px;top:${b}px;right:${b}px;bottom:${b}px;border:1px dashed rgba(255,0,255,.9);${round ? 'border-radius:50%;' : ''}"></div>` : ''}
      <figcaption style="font:11px sans-serif;color:#ccc;margin-top:2px">${esc(path.basename(f))}</figcaption></figure>`;
  }).join('');
  const width = cols * (tw + 14) + 14;
  const page = await browser.newPage({ viewport: { width, height: 600 } });
  await page.setContent(`<body style="margin:0;background:${bg};display:flex;flex-wrap:wrap;gap:22px 14px;padding:14px;width:${width}px">${cells}</body>`);
  await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 85 });
  await page.close();
}

module.exports = { ROOT, DPI, I, BLEED, SAFE, data, uri, art, icon, crestOf, crestImg, FONTS, SEA, GOLD_TEXT, esc, rich, roman, short, FIT, launch, render, toPdf, contactSheet };
