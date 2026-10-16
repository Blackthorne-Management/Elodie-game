// The game box: BoardGamesMaker's 12.5" × 12.5" × 2" telescoping box (lid and base on one sheet), art placed on their
// template (docs/art/templates/box-12.5x12.5x2.pdf) at 300 dpi. Run via `npm run print:box`.
//   lid top: the board map with the logo; lid sides: title, player count and time, the eight crests;
//   base: the dark sea (the lid hides its sides). Art runs to the template's bleed line; text keeps 1/8" inside folds.
//   logo: the largest art/ui/logo* file, cut out by scripts/key-logo.py
// Out: print/box-12.5x12.5x2.pdf (what BoardGamesMaker takes), print/box-12.5x12.5x2.png and print/box-preview.jpg
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DPI = 300;
const PAGE = { w: 22, h: 45.693 }; // inches, the template's page
const I = n => n * DPI;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'print/.data.json'), 'utf8'));

// The template's lines, in inches from the page's top left (read from the PDF). Each part: the face, the side depth
// (the same on every side) and the bleed box everything must reach (it covers the turn-in strips too).
const D = 2.051;
const LID = { face: { x: 4.777, y: 5.084, s: 12.445 }, bleed: { x0: 2.077, y0: 2.409, x1: 19.923, y1: 20.23 } };
const BASE = { face: { x: 4.905, y: 25.381, s: 12.189 }, bleed: { x0: 2.205, y0: 22.681, x1: 19.795, y1: 40.271 } };
const SAFE = 0.125;

const EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const uri = f => `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`;
const font = (pkg, file) => uri(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const largest = (dir, re) => fs.readdirSync(path.join(ROOT, dir)).filter(f => re.test(f))
  .map(f => path.join(ROOT, dir, f)).sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];

const MAP = largest('art/board', /^board-dark.*\.(png|jpe?g|webp)$/i);
const LOGO_SRC = largest('art/ui', /^logo.*\.(png|jpe?g|webp)$/i);
const LOGO = path.join(ROOT, 'print/.logo.png');
fs.mkdirSync(path.join(ROOT, 'print'), { recursive: true });
execFileSync('python3', ['-I', path.join(ROOT, 'scripts/key-logo.py'), LOGO_SRC, LOGO, '0'], { stdio: 'inherit' });
const crests = data.houses.map(h => {
  const f = ['png', 'jpg', 'webp'].map(e => path.join(ROOT, 'art/crests', `crest-${h.id}.${e}`)).find(fs.existsSync);
  return f ? uri(f) : null;
});

// A side panel: its box on the sheet, and the turn of its text so it reads upright once folded (its top is the fold).
const sides = (f, len) => [
  { x: f.x, y: f.y - D, w: len, h: D, rot: 180 },  // back (above the face on the sheet)
  { x: f.x, y: f.y + len, w: len, h: D, rot: 0 },  // front
  { x: f.x - D, y: f.y, w: D, h: len, rot: 90 },   // left
  { x: f.x + len, y: f.y, w: D, h: len, rot: -90 }, // right
];
const panel = (s, inner) => {
  const long = Math.max(s.w, s.h), across = Math.min(s.w, s.h);
  return `<div class="side" style="left:${I(s.x)}px;top:${I(s.y)}px;width:${I(s.w)}px;height:${I(s.h)}px">
    <div class="side-in" style="width:${I(long)}px;height:${I(across)}px;transform:translate(-50%,-50%) rotate(${s.rot}deg)">
      <div class="rule top"></div><div class="rule bottom"></div>${inner}</div></div>`;
};
const title = `<div class="title"><b>Bloodlines</b><i>The Race to Elodie's Grace</i></div>`;
const facts = `<div class="facts">2–8 players <span>◆</span> 60–150 minutes <span>◆</span> best with 3–6</div>`;
const crestRow = `<div class="crests">${data.houses.map((h, i) => `<figure>${crests[i]
  ? `<img src="${crests[i]}">` : `<div class="initial" style="background:${h.color}">${h.initial}</div>`}<figcaption>${h.name.replace('House ', '')}</figcaption></figure>`).join('')}</div>`;

const lidSides = sides(LID.face, LID.face.s);
const sea = b => `<div class="sea" style="left:${I(b.x0)}px;top:${I(b.y0)}px;width:${I(b.x1 - b.x0)}px;height:${I(b.y1 - b.y0)}px"></div>`;
const f = LID.face, over = 0.06; // the map runs a hair past each fold so no sea shows on the lid's top edge
const html = `<style>
@font-face { font-family: Cinzel; font-weight: 700; src: url(${font('cinzel', 'cinzel-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-style: italic; src: url(${font('eb-garamond', 'eb-garamond-latin-400-italic.woff2')}); }
body { margin: 0; }
.sheet { position: relative; width: ${I(PAGE.w)}px; height: ${I(PAGE.h)}px; background: #fff; overflow: hidden; }
.sea { position: absolute; background: radial-gradient(ellipse at 50% 45%, #183139 0%, #0f2129 55%, #0a161c 100%); }
.face { position: absolute; overflow: hidden; }
.face .map { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.face .shade { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%); }
.face .frame { position: absolute; inset: ${I(over + SAFE + 0.22)}px; border: ${I(0.03)}px solid #c99a45; outline: ${I(0.012)}px solid #f3d27a;
  outline-offset: -${I(0.07)}px; box-shadow: 0 0 ${I(0.08)}px rgba(0,0,0,.8); }
.face .logo { position: absolute; left: 50%; top: 47%; width: ${I(9.6)}px; transform: translate(-50%, -50%);
  filter: drop-shadow(0 ${I(0.04)}px ${I(0.12)}px rgba(0,0,0,.95)) drop-shadow(0 0 ${I(0.35)}px rgba(0,0,0,.7)); }
.side { position: absolute; }
.side-in { position: absolute; left: 50%; top: 50%; display: flex; align-items: center; justify-content: center; }
.rule { position: absolute; left: ${I(SAFE + 0.3)}px; right: ${I(SAFE + 0.3)}px; height: ${I(0.018)}px; background: linear-gradient(90deg, transparent, #c99a45 12%, #f3d27a 50%, #c99a45 88%, transparent); }
.rule.top { top: ${I(SAFE + 0.18)}px; } .rule.bottom { bottom: ${I(SAFE + 0.18)}px; }
.title { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.title b { font: 700 ${I(0.62)}px Cinzel; letter-spacing: .14em; text-transform: uppercase;
  background: linear-gradient(180deg, #fbeec4, #e2b85c 55%, #9a6a24); -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 ${I(0.02)}px ${I(0.03)}px #000); }
.title i { font: italic ${I(0.3)}px Garamond; color: #e8dcc0; margin-top: ${I(0.06)}px; }
.facts { font: 700 ${I(0.3)}px Cinzel; letter-spacing: .1em; color: #f3d27a; text-transform: uppercase; white-space: nowrap; }
.facts span { color: #9a6a24; margin: 0 ${I(0.15)}px; font-size: 70%; }
.crests { display: flex; gap: ${I(0.22)}px; align-items: center; }
.crests figure { margin: 0; display: flex; flex-direction: column; align-items: center; width: ${I(1.15)}px; }
.crests img, .crests .initial { width: ${I(0.95)}px; height: ${I(0.95)}px; object-fit: contain; border-radius: 50%;
  filter: drop-shadow(0 ${I(0.02)}px ${I(0.04)}px #000); }
.crests .initial { display: grid; place-items: center; font: 700 ${I(0.4)}px Cinzel; color: #fff; }
.crests figcaption { font: 700 ${I(0.13)}px Cinzel; color: #e8dcc0; letter-spacing: .08em; text-transform: uppercase; margin-top: ${I(0.04)}px; white-space: nowrap; }
</style>
<div class="sheet">
  ${sea(LID.bleed)}${sea(BASE.bleed)}
  <div class="face" style="left:${I(f.x - over)}px;top:${I(f.y - over)}px;width:${I(f.s + 2 * over)}px;height:${I(f.s + 2 * over)}px">
    <img class="map" src="${uri(MAP)}"><div class="shade"></div><div class="frame"></div><img class="logo" src="${uri(LOGO)}">
  </div>
  ${panel(lidSides[0], crestRow)}${panel(lidSides[1], title)}${panel(lidSides[2], title)}${panel(lidSides[3], facts)}
</div>`;

(async () => {
  const W = Math.round(I(PAGE.w)), H = Math.round(I(PAGE.h));
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(html, { timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const png = path.join(ROOT, 'print/box-12.5x12.5x2.png');
  await page.screenshot({ path: png, clip: { x: 0, y: 0, width: W, height: H }, timeout: 600000 });
  await b.close();
  // PDF at the template's exact page size (BoardGamesMaker takes PDF, AI or PSD), plus a small preview.
  execFileSync('python3', ['-I', '-c', `
from PIL import Image; Image.MAX_IMAGE_PIXELS = None
im = Image.open(${JSON.stringify(png)}).convert('RGB')
im.save(${JSON.stringify(path.join(ROOT, 'print/box-12.5x12.5x2.pdf'))}, resolution=${DPI}, quality=95, subsampling=0)
im.resize((im.width // 6, im.height // 6), Image.LANCZOS).save(${JSON.stringify(path.join(ROOT, 'print/box-preview.jpg'))}, quality=88)
`], { stdio: 'inherit' });
  console.log(`map ${path.relative(ROOT, MAP)}, logo ${path.relative(ROOT, LOGO_SRC)} -> print/box-12.5x12.5x2.pdf (${W} x ${H} px)`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
