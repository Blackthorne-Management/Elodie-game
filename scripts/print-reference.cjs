// The 8 player reference cards: the Reference Card section of src/data/rules.ts (the turn, the ◎ Target cards and
// how long lasting cards stay out; rules-decisions 87), so the card always matches the rules. Tarot size, printed
// with the character cards (same deck and back): 1050 × 1752 px like print/characters (2.75" × 4.75" with bleed,
// about 350 dpi; bleed about 42 px, safe zone about 84 px; docs/art/ART-GUIDE.md §13). One card per house, the same
// text with that house's crest, so each player's card matches their player board. Run via `npm run print:reference`.
// Out: print/characters/reference-<house>.png, print/reference-cards.pdf and print/preview-reference.jpg
const path = require('path');
const { ROOT, data, crestImg, esc, rich, launch, render, toPdf, contactSheet, GOLD_TEXT } = require('./print-common.cjs');

const W = 1050, H = 1752;
const section = data.rules.find(r => r.part === 'reference');
const block = b => typeof b === 'string' ? `<p>${rich(b)}</p>`
  : 'quote' in b ? `<p class="q">${rich(b.quote)}</p>`
  : 'steps' in b ? `<ol>${b.steps.map(s => `<li>${rich(s)}</li>`).join('')}</ol>`
  : `<ul>${b.list.map(s => `<li>${rich(s)}</li>`).join('')}</ul>`;

const css = `
.card { position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
  background: linear-gradient(135deg, #f6dc94, #c99a45 30%, #f3d27a 55%, #9a6a24 80%, #e2b85c); }
.panel { position: absolute; left: 66px; top: 66px; right: 66px; bottom: 66px; border-radius: 22px;
  background: radial-gradient(ellipse at 50% 0%, #4a2128 0%, #2b1418 55%, #1b0c0f 100%);
  box-shadow: inset 0 0 0 4px #3a2408, inset 0 0 0 7px #f3d27a, inset 0 0 30px rgba(0,0,0,.7); }
.head { position: absolute; left: 104px; right: 104px; top: 100px; height: 120px; display: flex; align-items: center; gap: 22px; }
.head h1 { flex: 1; min-width: 0; overflow: hidden; text-align: center; font: 700 58px Cinzel; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; ${GOLD_TEXT} }
.rule { position: absolute; left: 120px; right: 120px; top: 228px; height: 3px; background: linear-gradient(90deg, transparent, #c99a45 12%, #f3d27a 50%, #c99a45 88%, transparent); }
.body { position: absolute; left: 112px; right: 112px; top: 250px; bottom: 112px; color: #f4ece0; font-family: Garamond;
  font-size: 40px; line-height: 1.17; display: flex; flex-direction: column; gap: .32em; }
.body b { color: #f3d27a; font-weight: 700; }
.body p { margin: 0; }
.body ol, .body ul { margin: 0; padding-left: 1.25em; display: flex; flex-direction: column; gap: .16em; }
.body ol li::marker { color: #f3d27a; font-weight: 700; }
.body ul li::marker { color: #c99a45; }`;

const body = section.blocks.map(block).join('');
const card = h => `<div class="card"><div class="panel"></div>
  <div class="head">${crestImg(h, 110, 'border-radius:50%')}<h1 class="fit-w" data-min="34">${esc(section.title)}</h1>${crestImg(h, 110, 'border-radius:50%')}</div>
  <div class="rule"></div>
  <div class="body fit-h" data-min="30">${body}</div></div>`;

(async () => {
  const b = await launch();
  const files = [], tight = [];
  for (const h of data.houses) {
    const file = path.join(ROOT, 'print/characters', `reference-${h.id}.png`);
    if (await render(b, css, card(h), W, H, file)) tight.push(h.id);
    files.push(file);
  }
  await contactSheet(b, files.slice(0, 4), path.join(ROOT, 'print/preview-reference.jpg'), { cols: 4, tw: 300, bleedPx: 42 });
  await b.close();
  toPdf(files, path.join(ROOT, 'print/reference-cards.pdf'), 350);
  console.log(`${files.length} reference cards -> print/characters/reference-*.png (${W} x ${H} px)`);
  if (tight.length) console.log(`Text still overflows on: ${tight.join(', ')}`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
