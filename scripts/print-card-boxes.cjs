// The two card boxes, on BoardGamesMaker's templates (docs/art/templates/), at 300 dpi. Run via `npm run print:card-boxes`.
//   Action box: Easy-Flip one-piece game box, large (140 × 96 × 24 mm), all 126 Action cards in two stacks.
//   Tarot box: Double-Flip game box, tarot (130 × 80 × 40 mm, magnetic), Character, Reference and Legacy cards; it
//   travels beside the game box (too tall for inside).
// Each sheet is filled edge to edge with the game box's dark sea (everything past the cut line is trimmed away);
// panel art keeps 1/8" inside the folds. Panel boxes are in inches from the template page's top left, measured from
// the template's fold lines.
// Out: print/card-box-action.pdf, print/card-box-tarot.pdf (+ .png and -preview.jpg)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DPI = 300;
const I = n => n * DPI;
const SAFE = 0.125;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'print/.data.json'), 'utf8'));
const EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const uri = f => `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`;
const font = (pkg, file) => uri(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const largest = (dir, re) => fs.readdirSync(path.join(ROOT, dir)).filter(f => re.test(f))
  .map(f => path.join(ROOT, dir, f)).sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];

const LOGO = path.join(ROOT, 'print/.logo.png');
fs.mkdirSync(path.join(ROOT, 'print'), { recursive: true });
execFileSync('python3', ['-I', path.join(ROOT, 'scripts/key-logo.py'), largest('art/ui', /^logo.*\.(png|jpe?g|webp)$/i), LOGO, '0'], { stdio: 'inherit' });
const crest = h => {
  const f = ['png', 'jpg', 'webp'].map(e => path.join(ROOT, 'art/crests', `crest-${h.id}.${e}`)).find(fs.existsSync);
  return f ? `<img class="crest" src="${uri(f)}">` : `<div class="crest initial" style="background:${h.color}">${h.initial}</div>`;
};

// A panel: content centred in the box and turned `rot` degrees so it reads upright on the folded box.
const panel = (p, inner, cls = '') => {
  const turned = p.rot === 90 || p.rot === -90;
  const w = turned ? p.h : p.w, h = turned ? p.w : p.h;
  return `<div class="panel" style="left:${I(p.x)}px;top:${I(p.y)}px;width:${I(p.w)}px;height:${I(p.h)}px">
    <div class="panel-in ${cls}" style="width:${I(w)}px;height:${I(h)}px;transform:translate(-50%,-50%) rotate(${p.rot}deg)">${inner}</div></div>`;
};
const frame = p => `<div class="frame" style="left:${I(p.x + SAFE + 0.06)}px;top:${I(p.y + SAFE + 0.06)}px;width:${I(p.w - 2 * SAFE - 0.12)}px;height:${I(p.h - 2 * SAFE - 0.12)}px"></div>`;
const title = (size = 0.34) => `<div class="title" style="--s:${I(size)}px"><b>Bloodlines</b><i>The Race to Elodie's Grace</i></div>`;
const label = (big, small, size = 0.26) => `<div class="title" style="--s:${I(size)}px"><b>${big}</b>${small ? `<i>${small}</i>` : ''}</div>`;

// Text from the rule guide: **bold** spans, and the Reference Card's blocks (paragraphs, numbered steps, lists).
const md = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const blocks = bs => bs.map(b => typeof b === 'string' ? `<p>${md(b)}</p>`
  : b.steps ? `<ol>${b.steps.map(x => `<li>${md(x)}</li>`).join('')}</ol>`
  : b.list ? `<ul>${b.list.map(x => `<li>${md(x)}</li>`).join('')}</ul>` : '').join('');
const TILE = { court: 'Court', war: 'War', trade: 'Trade' };
// One house inside a tarot flap: crest, name, homeland and home square, identity, Gen I passive.
const houseCard = h => `<div class="house">${crest(h)}<b>${h.name.replace('House ', '')}</b>
  <span>${h.homeland} · ${TILE[h.tileType]} seat</span><i>${h.identity}</i><em>${h.passiveName}</em></div>`;

// Turns, following the fold: lid sides hang down from the top (their top is the fold), tray sides stand up from the
// bottom (their bottom is the fold), and the sheet shows the outside.
const BOXES = {
  action: {
    template: 'easy-flip-box-large.pdf', page: { w: 20, h: 19.097 },
    frames: [{ x: 3.245, y: 3.40, w: 5.74, h: 3.97 }, { x: 13.578, y: 4.78, w: 5.782, h: 3.885 }],
    // inside the lid: the Reference Card, turned so it reads upright with the lid flipped open
    panels: [
      [{ x: 3.245, y: 3.40, w: 5.74, h: 3.97, rot: 0 },
        `<img class="logo" src="${uri(LOGO)}" style="width:${I(4.6)}px"><div class="tag">Action Cards <span>◆</span> 126</div>`, 'stack'],
      [{ x: 3.245, y: 7.37, w: 5.74, h: 0.97, rot: 0 }, label('Action Cards', null, 0.3)],        // lid front
      [{ x: 2.28, y: 3.40, w: 0.965, h: 3.97, rot: 90 }, label('Bloodlines', null, 0.22)],        // lid left
      [{ x: 8.985, y: 3.40, w: 0.965, h: 3.97, rot: -90 }, label('Bloodlines', null, 0.22)],      // lid right
      [{ x: 4.395, y: 11.328, w: 5.57, h: 3.834, rot: 0 }, title(0.3)],                           // underside
      [{ x: 13.578, y: 4.78, w: 5.782, h: 3.885, rot: 180 }, `<div class="ref"><h3>Reference</h3>${blocks(data.reference)}</div>`],
    ],
  },
  tarot: {
    template: 'double-flip-box-tarot.pdf', page: { w: 17.403, h: 24.181 },
    frames: [{ x: 3.565, y: 5.22, w: 1.571, h: 5.08 }, { x: 6.935, y: 5.22, w: 1.55, h: 5.08 },
      { x: 2.015, y: 5.22, w: 1.55, h: 5.08 }, { x: 8.485, y: 5.22, w: 1.55, h: 5.08 }],
    panels: [
      // the two half-lids: four crests each, so the top reads the same whichever half sits on which side
      [{ x: 3.565, y: 5.22, w: 1.571, h: 5.08, rot: 0 }, data.houses.slice(0, 4).map(crest).join(''), 'column'],
      [{ x: 6.935, y: 5.22, w: 1.55, h: 5.08, rot: 0 }, data.houses.slice(4).map(crest).join(''), 'column'],
      [{ x: 11.285, y: 20.568, w: 2.925, h: 1.527, rot: 180 }, label('The Houses', 'Characters · Reference · Legacy', 0.28)], // tray front
      [{ x: 11.285, y: 14.118, w: 2.925, h: 1.527, rot: 0 }, label('Bloodlines', null, 0.3)],    // tray back
      [{ x: 9.76, y: 15.645, w: 1.525, h: 4.923, rot: -90 }, title(0.34)],                       // tray side
      [{ x: 14.21, y: 15.645, w: 1.525, h: 4.923, rot: 90 }, title(0.34)],                       // tray side
      [{ x: 4.125, y: 14.205, w: 2.925, h: 4.827, rot: 0 }, label('The Houses', 'Bloodlines', 0.24)], // base card
      // inside the flaps: the same four houses as the face above, with homeland, seat, identity and Gen I passive
      [{ x: 2.015, y: 5.22, w: 1.55, h: 5.08, rot: 0 }, data.houses.slice(0, 4).map(houseCard).join(''), 'column'],
      [{ x: 8.485, y: 5.22, w: 1.55, h: 5.08, rot: 0 }, data.houses.slice(4).map(houseCard).join(''), 'column'],
    ],
  },
};

const css = `<style>
@font-face { font-family: Cinzel; font-weight: 700; src: url(${font('cinzel', 'cinzel-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-style: italic; src: url(${font('eb-garamond', 'eb-garamond-latin-400-italic.woff2')}); }
@font-face { font-family: Garamond; src: url(${font('eb-garamond', 'eb-garamond-latin-400-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 700; src: url(${font('eb-garamond', 'eb-garamond-latin-700-normal.woff2')}); }
body { margin: 0; }
.sheet { position: relative; overflow: hidden; background: radial-gradient(ellipse at 50% 45%, #183139 0%, #0f2129 55%, #0a161c 100%); }
.panel { position: absolute; }
.panel-in { position: absolute; left: 50%; top: 50%; display: flex; align-items: center; justify-content: center; }
.panel-in.stack { flex-direction: column; gap: ${I(0.12)}px; }
.panel-in.column { flex-direction: column; justify-content: space-evenly; padding: ${I(SAFE + 0.2)}px 0; box-sizing: border-box; }
.frame { position: absolute; border: ${I(0.02)}px solid #c99a45; outline: ${I(0.008)}px solid #f3d27a; outline-offset: -${I(0.05)}px; }
.logo { filter: drop-shadow(0 ${I(0.03)}px ${I(0.08)}px rgba(0,0,0,.95)); }
.tag { font: 700 ${I(0.2)}px Cinzel; letter-spacing: .14em; color: #f3d27a; text-transform: uppercase; }
.tag span { color: #9a6a24; margin: 0 ${I(0.1)}px; font-size: 70%; }
.title { display: flex; flex-direction: column; align-items: center; line-height: 1; white-space: nowrap; }
.title b { font: 700 var(--s) Cinzel; letter-spacing: .14em; text-transform: uppercase;
  background: linear-gradient(180deg, #fbeec4, #e2b85c 55%, #9a6a24); -webkit-background-clip: text; background-clip: text; color: transparent; }
.title i { font: italic calc(var(--s) * .5) Garamond; color: #e8dcc0; margin-top: calc(var(--s) * .2); }
.crest { width: ${I(1.0)}px; height: ${I(1.0)}px; object-fit: contain; border-radius: 50%; filter: drop-shadow(0 ${I(0.02)}px ${I(0.05)}px #000); }
.ref { width: 100%; height: 100%; box-sizing: border-box; padding: ${I(SAFE + 0.16)}px ${I(SAFE + 0.2)}px; columns: 2; column-gap: ${I(0.22)}px;
  font: ${I(0.104)}px/1.26 Garamond, serif; color: #e8dcc0; }
.ref h3 { column-span: all; margin: 0 0 ${I(0.06)}px; text-align: center; font: 700 ${I(0.15)}px Cinzel; letter-spacing: .16em; color: #f3d27a; text-transform: uppercase; }
.ref p { margin: 0 0 ${I(0.04)}px; } .ref b { color: #f3d27a; font-weight: 700; }
.ref ol, .ref ul { margin: 0 0 ${I(0.05)}px; padding-left: ${I(0.14)}px; } .ref li { margin-bottom: ${I(0.02)}px; }
.house { display: flex; flex-direction: column; align-items: center; text-align: center; line-height: 1.15; width: ${I(1.25)}px; }
.house .crest { width: ${I(0.5)}px; height: ${I(0.5)}px; margin-bottom: ${I(0.03)}px; }
.house b { font: 700 ${I(0.135)}px Cinzel; letter-spacing: .1em; color: #f3d27a; text-transform: uppercase; }
.house span { font: ${I(0.095)}px Garamond, serif; color: #e8dcc0; }
.house i, .house em { font: italic ${I(0.095)}px Garamond, serif; color: #c9b99a; }
.house em { color: #e2b85c; }
.crest.initial { display: grid; place-items: center; font: 700 ${I(0.42)}px Cinzel; color: #fff; }
</style>`;

(async () => {
  const b = await chromium.launch();
  for (const [name, box] of Object.entries(BOXES)) {
    const W = Math.round(I(box.page.w)), H = Math.round(I(box.page.h));
    const html = `${css}<div class="sheet" style="width:${W}px;height:${H}px">${box.frames.map(frame).join('')}${box.panels.map(([p, inner, cls]) => panel(p, inner, cls)).join('')}</div>`;
    const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.setContent(html, { timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const png = path.join(ROOT, `print/card-box-${name}.png`);
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: W, height: H }, timeout: 600000 });
    await page.close();
    execFileSync('python3', ['-I', '-c', `
from PIL import Image; Image.MAX_IMAGE_PIXELS = None
im = Image.open(${JSON.stringify(png)}).convert('RGB')
im.save(${JSON.stringify(png.replace(/\.png$/, '.pdf'))}, resolution=${DPI}, quality=95, subsampling=0)
im.resize((im.width // 5, im.height // 5), Image.LANCZOS).save(${JSON.stringify(png.replace(/\.png$/, '-preview.jpg'))}, quality=88)
`], { stdio: 'inherit' });
    console.log(`${box.template} -> print/card-box-${name}.pdf (${W} x ${H} px)`);
  }
  await b.close();
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
