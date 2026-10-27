// Every round chipboard token (PRODUCTION.md rows 7–10): Heart Tokens, Grudge Tokens, resource tokens and the
// reminder tokens. Each is a 1" (25.4 mm) circle (BoardGamesMaker's "Custom Circle Game Tiles 1\" Micro Size"),
// one image per face at 300 dpi: 1.25" = 375 px square, the 1/8" bleed all round, everything that matters inside
// the 0.75" safe circle. Run via `npm run print:tokens`.
//   resource: Influence (crown), Fear (crossed swords), Wealth (coins); "1" on the front, "×5" on the back
//   heart:    the heart on both faces
//   grudge:   the house crest on the front, one plain back shared by all 40 (they are the house lottery, drawn blind)
//   reminder: new-heir shield, La Marca brand, Grito de Guerra markers, Specter markers, Used tokens; same both faces
// Out: print/tokens/<name>-front.png and -back.png, print/tokens/tokens.json (file, faces and how many to order),
//      print/tokens/tokens-proof.pdf (every face, cut circle drawn) and print/preview-tokens.jpg
const fs = require('fs');
const path = require('path');
const { ROOT, data, I, icon, crestImg, esc, launch, render, toPdf, contactSheet, short } = require('./print-common.cjs');

const D = 1.0;                       // cut diameter, inches
const S = I(D + 0.25);               // image size with bleed (375 px)
const CUT = I(D), SAFE = I(D - 0.25); // 300 px cut circle, 225 px safe circle

// How many of each to order (PRODUCTION.md, What's in the box; Grito markers from GRITO_MARKERS in src/config.ts).
const ability = id => data.houses.flatMap(h => h.abilities).find(a => a.id === id);
const PER_HOUSE_GRUDGES = 5, HEARTS = 32, RESOURCE_EACH = 60, PLAYERS = data.houses.length;

const css = `
.tok { position: relative; width: ${S}px; height: ${S}px; overflow: hidden; display: grid; place-items: center; }
.ring { position: absolute; left: 50%; top: 50%; width: ${CUT - 16}px; height: ${CUT - 16}px; transform: translate(-50%, -50%);
  border-radius: 50%; border: 5px solid #e2b85c; box-shadow: 0 0 0 2px #3a2408, inset 0 0 0 2px #3a2408, inset 0 0 18px rgba(0,0,0,.6); }
.in { position: absolute; left: 50%; top: 50%; width: ${SAFE}px; height: ${SAFE}px; transform: translate(-50%, -50%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; }
.num { font: 700 120px Cinzel; line-height: .9; color: #fbeec4; text-shadow: 0 3px 4px rgba(0,0,0,.85), 0 0 2px #000; }
.num.five { font-size: 96px; }
.word { font: 700 28px Cinzel; letter-spacing: .06em; text-transform: uppercase; color: #fbeec4; white-space: nowrap;
  text-shadow: 0 2px 3px rgba(0,0,0,.9); margin-top: 4px; max-width: ${SAFE}px; }`;

// A face: background colour/gradient filling the whole bleed square, the gold ring on the cut, content in the safe circle.
const face = (bg, inner) => `<div class="tok" style="background:${bg}"><div class="ring"></div><div class="in">${inner}</div></div>`;
const img = (name, size, extra = '') => `<img src="${icon(name)}" style="width:${size}px;height:${size}px;${extra}">`;
const disc = (c1, c2) => `radial-gradient(circle at 50% 38%, ${c1} 0%, ${c2} 72%)`;

const PILLARS = [
  { id: 'influence', label: 'Influence', c: ['#3f6fb5', '#16264a'] },
  { id: 'fear', label: 'Fear', c: ['#a83232', '#3a0e10'] },
  { id: 'wealth', label: 'Wealth', c: ['#c9962b', '#4a3008'] },
];

const tokens = [];
for (const p of PILLARS) tokens.push({
  name: `resource-${p.id}`, what: `${p.label} token`, count: RESOURCE_EACH,
  front: face(disc(...p.c), `${img(p.id, 112, 'margin-bottom:-8px;filter:drop-shadow(0 3px 3px rgba(0,0,0,.7))')}<div class="num">1</div>`),
  back: face(disc(...p.c), `${img(p.id, 84, 'margin-bottom:2px;filter:drop-shadow(0 3px 3px rgba(0,0,0,.7))')}<div class="num five">×5</div>`),
});
const heart = face(disc('#8e1f2a', '#2a070b'), img('heart', 168, 'filter:drop-shadow(0 4px 5px rgba(0,0,0,.8))'));
tokens.push({ name: 'heart', what: 'Heart Token', count: HEARTS, front: heart, back: heart });
const grudgeBack = face(disc('#3a1d24', '#14080b'), '');
for (const h of data.houses) tokens.push({
  name: `grudge-${h.id}`, what: `Grudge Token, ${h.name}`, count: PER_HOUSE_GRUDGES,
  front: face(disc(h.color, '#14080b'), crestImg(h, SAFE + 40, 'border-radius:50%')), back: grudgeBack, sharedBack: 'grudge-back',
});
const marca = ability('laMarca'), grito = ability('gritoDeGuerra');
const brasador = data.houses.find(h => h.abilities.some(a => a.id === 'laMarca'));
const reminders = [
  { name: 'reminder-heir-shield', what: 'New-heir shield', count: PLAYERS, icon: 'shield', word: 'New heir', c: ['#2e5a8a', '#0c1a2c'] },
  { name: 'reminder-la-marca', what: `${marca.name} brand (${short(brasador)})`, count: 1, icon: 'brand', word: marca.name, c: ['#b03a2e', '#2a0a08'] },
  { name: 'reminder-grito', what: `${grito.name} marker (${short(brasador)})`, count: data.gritoMarkers, icon: 'grito', word: 'Grito', c: ['#7a2a1a', '#200a06'] },
  { name: 'reminder-specter', what: 'Specter marker', count: PLAYERS, icon: 'specter', word: 'Specter', c: ['#56607a', '#141820'] },
  { name: 'reminder-used', what: 'Used token (once-per-game powers)', count: PLAYERS, icon: 'used', word: 'Used', c: ['#4a4a4a', '#141414'] },
];
for (const r of reminders) {
  const f = face(disc(...r.c), `${img(r.icon, 140, 'filter:drop-shadow(0 3px 4px rgba(0,0,0,.8))')}<div class="word fit-w" data-min="20">${esc(r.word)}</div>`);
  tokens.push({ name: r.name, what: r.what, count: r.count, front: f, back: f });
}

(async () => {
  const b = await launch();
  const dir = path.join(ROOT, 'print/tokens');
  fs.rmSync(dir, { recursive: true, force: true });
  const manifest = [], files = [], tight = [];
  const done = new Set();
  for (const t of tokens) {
    const front = path.join(dir, `${t.name}-front.png`);
    const backName = t.sharedBack ?? `${t.name}-back`;
    const back = path.join(dir, `${backName}.png`);
    if (await render(b, css, t.front, S, S, front)) tight.push(`${t.name} front`);
    files.push(front);
    if (!done.has(back)) {
      if (await render(b, css, t.back, S, S, back)) tight.push(`${backName}`);
      files.push(back); done.add(back);
    }
    manifest.push({ token: t.what, count: t.count, front: path.relative(ROOT, front), back: path.relative(ROOT, back) });
  }
  const total = manifest.reduce((n, m) => n + m.count, 0);
  fs.writeFileSync(path.join(dir, 'tokens.json'), JSON.stringify({
    product: 'Round chipboard tokens, 1" (25.4 mm) cut, 300 dpi, 1.25" image with 1/8" bleed, double-sided',
    total, tokens: manifest,
  }, null, 1));
  await contactSheet(b, files, path.join(ROOT, 'print/preview-tokens.jpg'), { cols: 8, tw: 150, bleedPx: I(0.125), round: true });
  await b.close();
  toPdf(files, path.join(dir, 'tokens-proof.pdf'));
  console.log(`${files.length} token faces for ${total} tokens -> print/tokens/ (${S} x ${S} px each)`);
  for (const m of manifest) console.log(`  ${String(m.count).padStart(3)} × ${m.token}`);
  if (tight.length) console.log(`Text still overflows on: ${tight.join(', ')}`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
