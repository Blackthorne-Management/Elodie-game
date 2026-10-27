// The 8 player boards, one per house (PRODUCTION.md row 5): spaces for the Influence, Fear and Wealth tokens, the
// Heart Tokens and the Grudge Tokens held, the turn summary, the house's once-per-game powers (each with a spot for
// its Used token) and the Specter marker. Text comes from src/data (houses, and the turn from the Reference Card
// section of src/data/rules.ts). 10" × 7" landscape (an assumed size: it fits flat in the 12.5" box; the material is
// open, see PRODUCTION.md), 300 dpi with the 1/8" bleed: 10.25" × 7.25" = 3075 × 2175 px; text keeps 1/8" inside the cut.
// Token spots are 1.08" circles, just over the 1" tokens. Run via `npm run print:mats`.
// Out: print/mats/mat-<house>.png, print/mats/mats.pdf (8 pages) and print/preview-mats.jpg
const path = require('path');
const { ROOT, data, I, icon, crestImg, esc, rich, roman, short, launch, render, toPdf, contactSheet, GOLD_TEXT } = require('./print-common.cjs');

const W = I(10.25), H = I(7.25);
const at = (x, y, w, h) => `left:${I(x)}px;top:${I(y)}px;width:${I(w)}px;height:${I(h)}px`;
const SPOT = 1.08;
const TILE = { court: 'Court tile', war: 'War tile', trade: 'Trade tile' };
const PILLARS = [
  { id: 'influence', label: 'Influence', tint: '#3f6fb5' },
  { id: 'fear', label: 'Fear', tint: '#a83232' },
  { id: 'wealth', label: 'Wealth', tint: '#c9962b' },
];
const ref = data.rules.find(r => r.part === 'reference').blocks;
const turnSteps = ref.find(b => typeof b === 'object' && 'steps' in b).steps;
const freeLine = ref.find(b => typeof b === 'string' && /^Free/.test(b));

// Once-per-game powers: abilities limited to one use a game, and a passive upgrade that grants one ("Also,
// Stillwater's Patience: once per game, …", from Gen III).
const oncePerGame = h => [
  ...h.abilities.filter(a => a.limit === 'game').map(a => ({ name: a.name, gen: a.gen })),
  ...[h.passiveText[1]].map(t => /^(?:Also,\s*)?([^:]+):\s*once per game/i.exec(t ?? '')).filter(Boolean).map(m => ({ name: m[1], gen: 3 })),
];

const css = `
.mat { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; color: #f4ece0; font-family: Garamond; }
.box { position: absolute; border-radius: 22px; background: rgba(12,6,8,.55);
  box-shadow: inset 0 0 0 3px #3a2408, inset 0 0 0 6px #c99a45, inset 0 0 0 8px #3a2408, inset 0 0 40px rgba(0,0,0,.6); }
.label { position: absolute; left: 0; right: 0; text-align: center; font: 700 44px Cinzel; letter-spacing: .1em; text-transform: uppercase; ${GOLD_TEXT} }
.spot { position: absolute; width: ${I(SPOT)}px; height: ${I(SPOT)}px; border-radius: 50%; border: 4px dashed rgba(243,210,122,.75);
  background: radial-gradient(circle, rgba(255,255,255,.06), rgba(0,0,0,.35)); display: grid; place-items: center; }
.spot img { width: 48%; opacity: .32; }
.head { position: absolute; display: flex; align-items: center; gap: ${I(0.18)}px; }
.head h1 { font: 700 96px Cinzel; letter-spacing: .1em; text-transform: uppercase; line-height: 1; white-space: nowrap; ${GOLD_TEXT}
  filter: drop-shadow(0 3px 3px rgba(0,0,0,.8)); }
.head p { font: italic 46px Garamond; color: #e8dcc0; margin-top: 6px; white-space: nowrap; }
.heirs { position: absolute; text-align: right; font: 38px Garamond; color: #e8dcc0; line-height: 1.25; }
.heirs b { font: 700 32px Cinzel; color: #f3d27a; margin-right: 10px; }
.well-icon { position: absolute; left: 50%; transform: translateX(-50%); opacity: .9; filter: drop-shadow(0 4px 6px rgba(0,0,0,.8)); }
.well-note { position: absolute; left: 0; right: 0; text-align: center; font: italic 36px Garamond; color: #cfc3ad; }
.turn { position: absolute; font-size: 42px; line-height: 1.2; }
.turn ol { margin: 0; padding-left: 1.3em; display: flex; flex-direction: column; gap: .2em; }
.turn ol li::marker { color: #f3d27a; font-weight: 700; }
.turn b { color: #f3d27a; }
.turn p { margin-top: .45em; font-style: italic; color: #e8dcc0; }
.power { position: absolute; display: flex; align-items: center; gap: ${I(0.15)}px; }
.power .spot { position: relative; flex: none; }
.power div.t { font: 700 40px Cinzel; color: #fbeec4; line-height: 1.15; }
.power small { display: block; font: italic 36px Garamond; color: #cfc3ad; }
.label.side { text-align: left; left: ${I(0.25)}px; right: auto; top: 50%; transform: translateY(-50%); width: ${I(1.6)}px; line-height: 1.05; }
.none { position: absolute; font: italic 38px Garamond; color: #cfc3ad; text-align: center; }`;

function mat(h) {
  const powers = oncePerGame(h);
  const hearts = Math.max(...h.hp);
  const wells = PILLARS.map((p, i) => {
    const x = 0.45 + i * 2.02;
    return `<div class="box" style="${at(x, 1.55, 1.9, 2.4)};background:radial-gradient(ellipse at 50% 30%, ${p.tint}55, rgba(12,6,8,.6) 75%)">
      <div class="label" style="top:${I(0.16)}px">${p.label}</div>
      <img class="well-icon" src="${icon(p.id)}" style="top:${I(0.75)}px;width:${I(1.2)}px;opacity:.28">
      <div class="well-note" style="bottom:${I(0.18)}px">1 and ×5 tokens</div></div>`;
  }).join('');
  const heartSpots = Array.from({ length: hearts }, (_, i) =>
    `<div class="spot" style="left:${I(2.0 + i * 1.3)}px;top:${I(0.135)}px"><img src="${icon('heart')}"></div>`).join('');
  const grudgeSpots = Array.from({ length: 3 }, (_, i) =>
    `<div class="spot" style="left:${I(2.0 + i * 1.3)}px;top:${I(0.135)}px"><img src="${icon('grudge')}"></div>`).join('');
  const powerRows = [...powers.map(p => ({ title: p.name, sub: `Once per game · from Gen ${roman(p.gen)}`, img: 'used' })),
    { title: 'Specter', sub: 'When your Gen IV falls', img: 'specter' }];
  return `<div class="mat" style="background:radial-gradient(ellipse at 30% 20%, ${h.color}66 0%, transparent 55%), radial-gradient(ellipse at 50% 45%, #2b1418 0%, #1b0c0f 60%, #0f0608 100%)">
    <div class="head" style="${at(0.42, 0.36, 6.3, 1.05)}">${crestImg(h, I(1.0), 'border-radius:50%;filter:drop-shadow(0 4px 6px rgba(0,0,0,.8))')}
      <div style="min-width:0;flex:1"><h1 class="fit-w" data-min="60">${esc(h.name)}</h1><p class="fit-w" data-min="30">${esc(h.homeland)} · ${TILE[h.tileType]} · ${esc(h.identity)}</p></div></div>
    <div class="heirs" style="${at(6.6, 0.36, 3.25, 1.1)}">${h.heirs.map((n, i) => `<div class="fit-w" data-min="26" style="white-space:nowrap"><b>${roman(i + 1)}</b>${esc(n)}</div>`).slice(0, 4).join('')}</div>
    ${wells}
    <div class="box" style="${at(0.45, 4.08, 5.94, 1.35)}"><div class="label side">Heart<br>Tokens</div>${heartSpots}</div>
    <div class="box" style="${at(0.45, 5.56, 5.94, 1.35)}"><div class="label side">Grudges<br>held</div>${grudgeSpots}</div>
    <div class="box" style="${at(6.55, 1.55, 3.3, 2.8)}"><div class="label" style="top:${I(0.16)}px">Your Turn</div>
      <div class="turn fit-h" data-min="30" style="left:${I(0.22)}px;right:${I(0.2)}px;top:${I(0.62)}px;bottom:${I(0.16)}px">
        <ol>${turnSteps.map(s => `<li>${rich(s)}</li>`).join('')}</ol><p>${rich(freeLine)}</p></div></div>
    <div class="box" style="${at(6.55, 4.48, 3.3, 2.43)}">
      ${powerRows.map((p, i) => `<div class="power" style="left:${I(0.15)}px;top:${I(0.09 + i * 1.17)}px;right:${I(0.15)}px">
        <div class="spot"><img src="${icon(p.img)}"></div>
        <div class="t fit-w" data-min="28" style="min-width:0;flex:1;white-space:nowrap">${esc(p.title)}<small>${esc(p.sub)}</small></div></div>`).join('')}
    </div>
  </div>`;
}

(async () => {
  const b = await launch();
  const files = [], tight = [];
  for (const h of data.houses) {
    const file = path.join(ROOT, 'print/mats', `mat-${h.id}.png`);
    if (await render(b, '', `<style>${css}</style>${mat(h)}`, W, H, file)) tight.push(h.id);
    files.push(file);
  }
  await contactSheet(b, files, path.join(ROOT, 'print/preview-mats.jpg'), { cols: 2, tw: 640, bleedPx: I(0.125) });
  await b.close();
  toPdf(files, path.join(ROOT, 'print/mats/mats.pdf'));
  console.log(`${files.length} player boards -> print/mats/ (${W} x ${H} px, 10" x 7" + bleed at 300 dpi)`);
  if (tight.length) console.log(`Text still overflows on: ${tight.join(', ')}`);
  for (const h of data.houses) console.log(`  ${short(h)}: once per game ${oncePerGame(h).map(p => p.name).join(', ') || '(none)'}`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
