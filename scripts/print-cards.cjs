// Print-ready card fronts: art + overlay + category symbol + title, type line, rules and flavour text, at
// MakePlayingCards size with bleed (game cards 1000 × 1360, characters 1050 × 1752). Run via `npm run print`.
//
// Art goes in (any of .png .jpg .jpeg .webp):
//   art/cards/card-<number>.png                 (docs/art/CARD-PROMPTS.md)
//   art/characters/portrait-<house>-<gen>.png   (docs/art/CHARACTER-PROMPTS.md)
//   art/crests/crest-<house>.png                (optional; the house initial is used until then)
// Out come print/cards/card-<n>.png, print/characters/character-<house>-<gen>.png and print/preview-*.jpg,
// plus web copies in public/art/{cards,portraits,crests} and src/art.generated.ts so the app shows the same art.
//
// Options: --art <dir> --out <dir> --only 1,2,81 --no-app --demo (fill missing art with a stand-in)
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ART = opt('--art', 'art'), OUT = opt('--out', 'print');
const ONLY = opt('--only', '') ? new Set(opt('--only').split(',')) : null;
const APP = !args.includes('--no-app'), DEMO = args.includes('--demo');
const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'print/.data.json'), 'utf8'));

const EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const uri = f => `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}`;
const find = (dir, base) => {
  for (const e of ['.png', '.jpg', '.jpeg', '.webp']) { const f = path.join(dir, base + e); if (fs.existsSync(f)) return f; }
  return null;
};
const font = (pkg, file) => uri(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const FONTS = `
@font-face { font-family: Cinzel; font-weight: 600; src: url(${font('cinzel', 'cinzel-latin-600-normal.woff2')}); }
@font-face { font-family: Cinzel; font-weight: 700; src: url(${font('cinzel', 'cinzel-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 400; src: url(${font('eb-garamond', 'eb-garamond-latin-400-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 700; src: url(${font('eb-garamond', 'eb-garamond-latin-700-normal.woff2')}); }
@font-face { font-family: Garamond; font-weight: 400; font-style: italic; src: url(${font('eb-garamond', 'eb-garamond-latin-400-italic.woff2')}); }`;

// Colours from docs/art/ART-GUIDE.md: cream titles, parchment rules, gold keywords, muted flavour, metal-matched type line.
const TYPE_COLOR = { hand: '#d6dce8', instant: '#f0c08a', elodie: '#fff1bf', character: '#f3d27a' };
const KEYWORDS = /\b(Influence|Fear|Wealth|Heart Tokens?|Grudge Tokens?|Specter|Throne)\b/g;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = s => esc(s).replace(KEYWORDS, '<b>$1</b>');
const roman = n => ['I', 'II', 'III', 'IV'][n - 1];
const overlay = name => uri(path.join(ROOT, 'docs/art/overlays', `overlay-${name}.png`));

const BASE = `${FONTS}
* { box-sizing: border-box; margin: 0; }
body { background: #000; }
.card { position: relative; overflow: hidden; background: #1a1418; }
.art, .ov { position: absolute; inset: 0; width: 100%; height: 100%; }
.art { object-fit: cover; }
.stand-in { position: absolute; inset: 0; background: radial-gradient(circle at 50% 35%, #6b5a46, #2b2220 70%); }
.title { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap;
  font: 600 50px Cinzel; color: #f6ecd2; text-shadow: 0 2px 4px rgba(0,0,0,.5); letter-spacing: .01em; }
.type { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap;
  font: 600 31px Cinzel; letter-spacing: .1em; text-transform: uppercase; }
.rules { position: absolute; display: flex; flex-direction: column; color: #f4ece0; font-family: Garamond; line-height: 1.18; }
.rules b { color: #f3d27a; font-weight: 700; }
.rules .when { font: 600 25px Cinzel; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 12px; opacity: .9; }
.rules .flavor { margin-top: auto; padding-top: .5em; font-style: italic; color: #cfc3ad; font-size: .86em; text-align: center; }
.medal { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }`;

// Game card, 1000 × 1360. Geometry matches scripts/make-overlays.cjs: safe zone 88, plate 96–186, box 830–1262.
function cardHtml(c, art) {
  const type = c.kind === 'hand' ? 'Hand Card' : c.kind === 'elodie' ? 'Instant · Elodie' : 'Instant';
  const icon = c.icon && path.join(ROOT, 'public', c.icon);
  return `<div class="card" style="width:1000px;height:1360px">
    ${art ? `<img class="art" src="${uri(art)}">` : '<div class="stand-in"></div>'}
    <img class="ov" src="${overlay(c.kind)}">
    ${icon ? `<img class="medal" src="${uri(icon)}" style="left:133px;top:141px;width:62px;height:62px;transform:translate(-50%,-50%)">` : ''}
    <div class="title fit-w" style="left:188px;right:188px;top:96px;height:90px">${esc(c.name)}</div>
    <div class="type fit-w" style="left:150px;right:150px;top:840px;height:40px;color:${TYPE_COLOR[c.kind]}">${type} · ${esc(c.category)}</div>
    <div class="rules fit-h" style="left:134px;right:134px;top:904px;bottom:126px;font-size:44px;text-align:center">
      ${c.kind === 'hand' ? '' : `<div class="when" style="color:${TYPE_COLOR[c.kind]}">Resolve when drawn · Never held</div>`}
      <div>${rich(c.text)}</div>${c.flavor ? `<div class="flavor">${esc(c.flavor)}</div>` : ''}
    </div></div>`;
}

// Character card, 1050 × 1752: plate 92–190 with medallions at x 133 and 917, box 1226–1666.
function characterHtml(h, gen, art, crest) {
  // From Gen III the passive upgrades; an upgrade that only adds ("Also: …", "One more use") keeps the Gen I text.
  const [p1, p2] = h.passiveText;
  const passive = gen < 3 ? p1 : /^(Also:|One more use)/.test(p2) ? `${p1} ${p2}` : p2;
  const abilities = h.abilities.filter(a => a.gen <= gen);
  // A drawback shows only once it applies: from the generation it names, and with the ability it names.
  const downGen = /Gen (IV|III|II|I)\b/.exec(h.downsideText);
  const named = h.abilities.find(a => h.downsideText.includes(a.name));
  const showDown = h.downsideText && (!downGen || gen >= ['I', 'II', 'III', 'IV'].indexOf(downGen[1]) + 1) && (!named || abilities.includes(named));
  const lines = [`<p><b>${esc(h.passiveName)}:</b> ${rich(passive)}</p>`,
    ...abilities.map(a => `<p><b>${esc(a.name)}:</b> ${rich(a.text)}</p>`),
    ...(showDown ? [`<p class="down">${rich(h.downsideText)}</p>`] : [])];
  const hp = h.hp[gen - 1];
  return `<div class="card" style="width:1050px;height:1752px">
    ${art ? `<img class="art" src="${uri(art)}">` : '<div class="stand-in"></div>'}
    <img class="ov" src="${overlay('character')}">
    <div class="medal" style="left:133px;top:141px;font:700 44px Cinzel;color:#f3d27a;text-shadow:0 2px 3px rgba(0,0,0,.6)">${roman(gen)}</div>
    <div class="medal" style="left:917px;top:141px">${crest
      ? `<img src="${uri(crest)}" style="width:74px;height:74px;border-radius:50%;object-fit:cover">`
      : `<div style="width:72px;height:72px;border-radius:50%;background:${h.color};border:3px solid #f3d27a;display:grid;place-items:center;font:700 38px Cinzel;color:#fff;text-shadow:0 2px 3px rgba(0,0,0,.5)">${h.initial}</div>`}</div>
    <div class="title fit-w" style="left:192px;right:192px;top:92px;height:98px;font-size:52px">${esc(h.name)}</div>
    <div class="type fit-w" style="left:146px;right:146px;top:1234px;height:42px;font-size:33px;color:${TYPE_COLOR.character}">${esc(h.homeland)} · Generation ${roman(gen)} · ${hp} Heart Token${hp === 1 ? '' : 's'}</div>
    <div class="rules fit-h" style="left:130px;right:130px;top:1302px;bottom:110px;font-size:42px;gap:.35em">${lines.join('')}</div>
    <style>.rules p.down { font-style: italic; color: #cfc3ad; }</style></div>`;
}

// Shrink text until it fits: titles and type lines by width, rules boxes by height.
const FIT = `for (const el of document.querySelectorAll('.fit-w')) {
    let s = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth && s > 24) el.style.fontSize = (s -= 1) + 'px';
  }
  for (const el of document.querySelectorAll('.fit-h')) {
    let s = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollHeight > el.clientHeight + 3 && s > 28) el.style.fontSize = (s -= 1) + 'px';
    if (el.scrollHeight > el.clientHeight + 3) window.__overflow = true;
  }`;

async function render(page, html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<style>${BASE}</style>${html}`);
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(`(() => { window.__overflow = false; ${FIT}; return window.__overflow; })()`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
  return overflow;
}

// Downscaled webp for the app (art only: the app draws its own overlay and text).
async function webCopy(page, src, out, width) {
  const url = await page.evaluate(async ([d, width]) => {
    const img = new Image(); img.src = d; await img.decode();
    const c = document.createElement('canvas'); c.width = width; c.height = Math.round(img.naturalHeight * width / img.naturalWidth);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', 0.86);
  }, [uri(src), width]);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
}

async function contactSheet(page, files, w, h, out) {
  if (!files.length) return;
  const cols = 6, tw = 240, th = Math.round(tw * h / w);
  const cells = files.map(f => `<img src="${uri(f)}" style="width:${tw}px;height:${th}px">`).join('');
  await page.setViewportSize({ width: cols * (tw + 8) + 8, height: 800 });
  await page.setContent(`<body style="margin:0;background:#222;display:flex;flex-wrap:wrap;gap:8px;padding:8px;width:${cols * (tw + 8) + 8}px">${cells}</body>`);
  await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 85 });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const want = k => !ONLY || ONLY.has(String(k));
  const made = { cards: [], characters: [] }, missing = [], tight = [];
  const manifest = { cards: {}, portraits: {}, crests: {} };

  fs.mkdirSync(path.join(OUT, 'cards'), { recursive: true });
  for (const c of data.cards) {
    const art = find(path.join(ART, 'cards'), `card-${c.id}`);
    if (APP && art) { await webCopy(page, art, path.join(ROOT, 'public/art/cards', `card-${c.id}.webp`), 500); manifest.cards[c.id] = `/art/cards/card-${c.id}.webp`; }
    if (!want(c.id)) continue;
    if (!art && !DEMO) { missing.push(`card-${c.id}`); continue; }
    const file = path.join(OUT, 'cards', `card-${c.id}.png`);
    if (await render(page, cardHtml(c, art), 1000, 1360, file)) tight.push(`card-${c.id}`);
    made.cards.push(file);
  }

  fs.mkdirSync(path.join(OUT, 'characters'), { recursive: true });
  for (const h of data.houses) {
    const crest = find(path.join(ART, 'crests'), `crest-${h.id}`);
    if (APP && crest) { await webCopy(page, crest, path.join(ROOT, 'public/art/crests', `crest-${h.id}.webp`), 128); manifest.crests[h.id] = `/art/crests/crest-${h.id}.webp`; }
    for (let gen = 1; gen <= 4; gen++) {
      const key = `${h.id}-${gen}`;
      const art = find(path.join(ART, 'characters'), `portrait-${key}`);
      if (APP && art) {
        await webCopy(page, art, path.join(ROOT, 'public/art/portraits', `portrait-${key}.webp`), 525);
        (manifest.portraits[h.id] ??= [])[gen - 1] = `/art/portraits/portrait-${key}.webp`;
      }
      if (!want(key)) continue;
      if (!art && !DEMO) { missing.push(`portrait-${key}`); continue; }
      const file = path.join(OUT, 'characters', `character-${key}.png`);
      if (await render(page, characterHtml(h, gen, art, crest), 1050, 1752, file)) tight.push(`character-${key}`);
      made.characters.push(file);
    }
  }

  await contactSheet(page, made.cards, 1000, 1360, path.join(OUT, 'preview-cards.jpg'));
  await contactSheet(page, made.characters, 1050, 1752, path.join(OUT, 'preview-characters.jpg'));
  await browser.close();

  if (APP) {
    const ts = `// Generated by scripts/print-cards.cjs from the files in art/. Do not edit by hand.
import type { HouseId } from './engine/types';

export const CARD_PICTURES: Record<number, string> = ${JSON.stringify(manifest.cards, null, 2)};
export const PORTRAIT_FILES: Partial<Record<HouseId, (string | undefined)[]>> = ${JSON.stringify(manifest.portraits, null, 2)};
export const CREST_FILES: Partial<Record<HouseId, string>> = ${JSON.stringify(manifest.crests, null, 2)};
`;
    fs.writeFileSync(path.join(ROOT, 'src/art.generated.ts'), ts.replace(/null/g, 'undefined'));
  }
  console.log(`Rendered ${made.cards.length} cards and ${made.characters.length} characters into ${OUT}/.`);
  if (missing.length) console.log(`No art yet for ${missing.length}: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? ', …' : ''}`);
  if (tight.length) console.log(`Text still overflows at the smallest size on: ${tight.join(', ')}`);
})();
