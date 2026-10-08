// The printed game board: the painted map with the 18 × 18 grid, the Throne's four squares, each house's seat tile
// (its building printed flat when art/seats has it, else its crest or initial) and the homeland names.
// 24" × 24" at 300 dpi = 7200 px square (BoardGamesMaker asks for at least 7197). Run via `npm run print:board`.
//   map:   the largest of art/board/board-dark-8k.*, board-dark-4k.*, board-dark.*  (or --map <file>)
//   seats: art/seats/seat-<house>.png, magenta already keyed (scripts/chroma-key.py) — optional
// Out: print/board-24in.png and print/board-preview.jpg
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ROOT = path.join(__dirname, '..');
const S = Number(opt('--size', 7200));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'print/.data.json'), 'utf8'));

const EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const uri = f => `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`;
const find = (dir, base) => {
  for (const e of ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG']) { const f = path.join(ROOT, dir, base + e); if (fs.existsSync(f)) return f; }
  return null;
};
const font = (pkg, file) => uri(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const MAP = opt('--map', null) ?? find('art/board', 'board-dark-8k') ?? find('art/board', 'board-dark-4k') ?? find('art/board', 'board-dark');
if (!MAP) throw new Error('No map in art/board');

// The board fills the middle 18 of 26 squares; the painting's ocean is the 4-square margin all round.
const U = S / 26, O = 4 * U;
const TYPE = { court: { icon: 'cat-crown', label: 'Court' }, war: { icon: 'cat-swords', label: 'War' }, trade: { icon: 'cat-coins', label: 'Trade' } };
// Where each homeland's name sits, as a fraction of the image (placed on open ground of the current map).
const LABEL = {
  brasador: [0.555, 0.305], kaysoley: [0.80, 0.335], dorini: [0.70, 0.455], ironvow: [0.80, 0.80],
  suzumori: [0.545, 0.755], agnivansh: [0.235, 0.86], stillwater: [0.15, 0.37], vaitama: [0.27, 0.19],
};

const grid = [];
for (let i = 0; i <= 18; i++) {
  const p = (O + i * U).toFixed(1);
  grid.push(`M${p} ${O} V${O + 18 * U}`, `M${O} ${p} H${O + 18 * U}`);
}
const seats = data.houses.map(h => {
  const x = O + h.home.x * U, y = O + h.home.y * U, t = TYPE[h.tileType];
  const art = find('art/seats', `seat-${h.id === 'vaitama' ? 'yaguana' : h.id}`);
  const crest = find('art/crests', `crest-${h.id === 'vaitama' ? 'yaguana' : h.id}`);
  const mark = art ? `<img class="seat-art" src="${uri(art)}">`
    : crest ? `<img class="crest" src="${uri(crest)}">`
    : `<div class="initial" style="background:${h.color}">${h.initial}</div>`;
  return `<div class="seat" style="left:${x}px;top:${y}px;width:${U}px;height:${U}px;--c:${h.color}">
    <div class="tint"></div>${mark}
    <div class="type"><img src="${uri(path.join(ROOT, 'public/art/icons', t.icon + '.svg'))}"><span>${t.label}</span></div></div>`;
}).join('');
const labels = data.houses.map(h => {
  const [fx, fy] = LABEL[h.id];
  return `<div class="label" style="left:${fx * S}px;top:${fy * S}px"><b>${h.homeland}</b><small>${h.name}</small></div>`;
}).join('');

const html = `<style>
@font-face { font-family: Cinzel; font-weight: 700; src: url(${font('cinzel', 'cinzel-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-style: italic; src: url(${font('eb-garamond', 'eb-garamond-latin-400-italic.woff2')}); }
body { margin: 0; }
.board { position: relative; width: ${S}px; height: ${S}px; overflow: hidden; background: #0b1218; }
.map { position: absolute; inset: 0; width: 100%; height: 100%; }
svg { position: absolute; inset: 0; }
.seat { position: absolute; box-sizing: border-box; border: ${U * 0.045}px solid #e2b85c; outline: ${U * 0.02}px solid #1a1008;
  box-shadow: 0 0 ${U * 0.25}px ${U * 0.06}px rgba(243,210,122,.45), inset 0 0 ${U * 0.15}px rgba(0,0,0,.6); }
.tint { position: absolute; inset: 0; background: var(--c); opacity: .38; mix-blend-mode: multiply; }
.seat-art { position: absolute; left: 50%; bottom: 8%; width: 170%; transform: translateX(-50%); filter: drop-shadow(0 ${U * 0.05}px ${U * 0.06}px rgba(0,0,0,.7)); }
.crest, .initial { position: absolute; left: 50%; top: 42%; width: 58%; height: 58%; transform: translate(-50%, -50%); border-radius: 50%; }
.initial { display: grid; place-items: center; font: 700 ${U * 0.36}px Cinzel; color: #fff; border: ${U * 0.03}px solid #f3d27a;
  box-shadow: 0 ${U * 0.03}px ${U * 0.06}px rgba(0,0,0,.7); text-shadow: 0 2px 4px rgba(0,0,0,.6); }
.type { position: absolute; left: 0; right: 0; bottom: 3%; display: flex; align-items: center; justify-content: center; gap: ${U * 0.03}px;
  font: 700 ${U * 0.12}px Cinzel; color: #f6e2a4; letter-spacing: .06em; text-transform: uppercase; text-shadow: 0 0 ${U * 0.04}px #000, 0 0 ${U * 0.04}px #000; }
.type img { width: ${U * 0.16}px; height: ${U * 0.16}px; }
.label { position: absolute; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; white-space: nowrap; }
.label b { font: 700 ${U * 0.42}px Cinzel; letter-spacing: .12em; text-transform: uppercase;
  background: linear-gradient(180deg, #fbeec4, #e2b85c 55%, #9a6a24); -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 ${U * 0.03}px #000) drop-shadow(0 ${U * 0.03}px ${U * 0.05}px rgba(0,0,0,.85)); }
.label small { font: italic ${U * 0.2}px Garamond; color: #e8dcc0; margin-top: -${U * 0.02}px; text-shadow: 0 0 ${U * 0.04}px #000, 0 0 ${U * 0.04}px #000; }
</style>
<div class="board">
  <img class="map" src="${uri(MAP)}">
  <svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <path d="${grid.join(' ')}" stroke="rgba(10,6,2,.55)" stroke-width="${U * 0.03}" fill="none"/>
    <path d="${grid.join(' ')}" stroke="rgba(243,210,122,.16)" stroke-width="${U * 0.008}" fill="none"/>
    <rect x="${O}" y="${O}" width="${18 * U}" height="${18 * U}" fill="none" stroke="#c99a45" stroke-width="${U * 0.05}" opacity=".85"/>
    <rect x="${O + 8 * U}" y="${O + 8 * U}" width="${2 * U}" height="${2 * U}" fill="none" stroke="#f3d27a" stroke-width="${U * 0.05}"/>
  </svg>
  ${seats}${labels}
</div>`;

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: S, height: S }, deviceScaleFactor: 1 });
  await page.setContent(html, { timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  fs.mkdirSync(path.join(ROOT, 'print'), { recursive: true });
  const out = path.join(ROOT, 'print/board-24in.png');
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: S, height: S }, timeout: 300000 });
  await b.close();
  console.log(`map ${path.relative(ROOT, MAP)} -> ${path.relative(ROOT, out)} (${S} px)`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
