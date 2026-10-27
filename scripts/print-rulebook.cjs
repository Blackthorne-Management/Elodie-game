// The rulebook (PRODUCTION.md row 12): a saddle-stitched booklet printed from the in-app rule guide
// (src/data/rules.ts), so the booklet always matches the game: the cover, the core rules (what a first game needs),
// then the appendix with The Eight Houses drawn from src/data/houses.ts, as the rule guide shows them. The Reference
// Card section is left out: it is printed on the reference cards (rules-decisions 87).
// US Letter, 8.5" × 11" portrait, with the 1/8" bleed on every page: 8.75" × 11.25". A vector PDF from Chromium
// (text stays sharp at any dpi; pictures embedded at full resolution). Saddle stitching needs a multiple of 4 pages,
// so Notes pages are added before the back cover to reach one. Run via `npm run print:rulebook`.
// Out: print/rulebook.pdf, print/rulebook-pages/page-NN.png (150 dpi proofs) and print/preview-rulebook.jpg
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// Gold type is a flat colour here: a gradient clipped to text draws stray box edges in a vector PDF.
const { ROOT, data, uri, art, crestOf, crestImg: fullCrest, icon, esc, rich, roman, short, FONTS, launch, contactSheet } = require('./print-common.cjs');

const PAGE = { w: 8.75, h: 11.25 }, BLEED = 0.125;
const largest = (dir, re) => fs.readdirSync(path.join(ROOT, dir)).filter(f => re.test(f))
  .map(f => path.join(ROOT, dir, f)).sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
const LOGO = path.join(ROOT, 'print/.logo.png');
execFileSync('python3', ['-I', path.join(ROOT, 'scripts/key-logo.py'), largest('art/ui', /^logo.*\.(png|jpe?g|webp)$/i), LOGO, '0'], { stdio: 'inherit' });
// The cover map at 3400 px (the 11.25" cover height at 300 dpi), so the PDF stays small.
const MAP_SRC = art(data.printArt.map);
const MAP = path.join(ROOT, 'print/.map-rulebook.jpg');
execFileSync('python3', ['-I', '-c', `
from PIL import Image; Image.MAX_IMAGE_PIXELS = None
im = Image.open(${JSON.stringify(MAP_SRC)}).convert('RGB'); im.thumbnail((3400, 3400), Image.LANCZOS)
im.save(${JSON.stringify(MAP)}, quality=90)`]);
// The approved board proof, shrunk to 2000 px (about 550 dpi at the 3.6" it prints); the bare map until it exists.
const BOARD_SRC = [data.printArt.boardProof].map(f => path.join(ROOT, f)).find(fs.existsSync) ?? MAP_SRC;
const BOARD = path.join(ROOT, 'print/.board-rulebook.jpg');
execFileSync('python3', ['-I', '-c', `
from PIL import Image; Image.MAX_IMAGE_PIXELS = None
im = Image.open(${JSON.stringify(BOARD_SRC)}).convert('RGB'); im.thumbnail((2000, 2000), Image.LANCZOS)
im.save(${JSON.stringify(BOARD)}, quality=90)`]);
// Crests at 360 px (the largest prints 1.1" wide on the back cover), so each copy in the PDF stays small.
const SMALL = path.join(ROOT, 'print/.crests-rulebook');
fs.mkdirSync(SMALL, { recursive: true });
const small = Object.fromEntries(data.houses.map(h => [h.id, crestOf(h)]).filter(([, f]) => f).map(([id, f]) => {
  const out = path.join(SMALL, `crest-${id}.png`);
  execFileSync('python3', ['-I', '-c', `from PIL import Image; im = Image.open(${JSON.stringify(f)}); im.thumbnail((360, 360), Image.LANCZOS); im.save(${JSON.stringify(out)})`]);
  return [id, out];
}));
const crestImg = (h, size, extra = '') => small[h.id]
  ? `<img src="${uri(small[h.id])}" style="width:${size}px;height:${size}px;object-fit:contain;${extra}">` : fullCrest(h, size, extra);
// Example cards for the Cards section: the first finished Hand Card and Instant in print/cards (`npm run print`).
const cardFile = kind => {
  const c = data.cards.find(c => c.kind === kind && fs.existsSync(path.join(ROOT, 'print/cards', `card-${c.id}.png`)));
  return c ? { c, f: path.join(ROOT, 'print/cards', `card-${c.id}.png`) } : null;
};
const examples = [cardFile('hand'), cardFile('instant') ?? cardFile('elodie')].filter(Boolean);

const block = b => typeof b === 'string' ? `<p>${rich(b)}</p>`
  : 'quote' in b ? `<blockquote>${rich(b.quote)}</blockquote>`
  : 'steps' in b ? `<ol>${b.steps.map(s => `<li>${rich(s)}</li>`).join('')}</ol>`
  : `<ul>${b.list.map(s => `<li>${rich(s)}</li>`).join('')}</ul>`;

// Pictures placed after a section's text: the board in What's in the Game, two finished cards in Cards.
const FIGURES = {
  components: `<figure><img src="${uri(BOARD)}" style="width:100%;border:1px solid #9a6a24"><figcaption>The board: the 18 × 18 grid, the Throne at the centre and the eight house tiles.</figcaption></figure>`,
  'cards-basics': examples.length ? `<figure class="cards">${examples.map(e => `<img src="${uri(e.f)}">`).join('')}<figcaption>${examples.map(e => `${esc(e.c.name)} (${e.c.kind === 'hand' ? 'a Hand Card' : 'an Instant'})`).join(' and ')}.</figcaption></figure>` : '',
};

const TILE = { court: 'Court', war: 'War', trade: 'Trade' };
const limitNote = a => /^once per/i.test(a.text) ? '' : a.limit === 'game' ? ' (once per game)' : a.limit === 'round' ? ' (once per round)' : '';
// The Eight Houses, row for row as src/ui/RulesGuide.tsx shows them.
const house = h => {
  const rows = [
    { gen: 1, html: `<b>${esc(h.passiveName)}</b> (passive): ${esc(h.passiveText[0])}` },
    ...(h.legacyText !== h.passiveText[0] ? [{ gen: 1, html: `<b>Legacy card</b> (held by House Yaguana): ${esc(h.legacyText)}` }] : []),
    { gen: 3, html: `<b>${esc(h.passiveName)}</b> upgrades: ${esc(h.passiveText[1])}` },
    ...(h.passiveAbility ? [{ gen: h.passiveAbility.gen, html: `<b>${esc(h.passiveAbility.name)}:</b> ${esc(h.passiveAbility.text)}` }] : []),
    ...Object.entries(h.notes).map(([g, t]) => ({ gen: Number(g), html: rich(`**${t.replace(': ', ':** ')}`) })),
    ...h.abilities.map(a => ({ gen: a.gen, html: `<b>${esc(a.name)}</b>${limitNote(a)}: ${esc(a.text)}` })),
  ].sort((a, b) => a.gen - b.gen);
  return `<article class="house">
    <header>${crestImg(h, 64, 'border-radius:50%;flex:none')}<div><h3>${esc(h.name)}</h3><small>${esc(h.homeland)} · ${TILE[h.tileType]} tile · ${esc(h.identity)}</small></div></header>
    <p class="lore">${esc(h.lore)}</p>
    <p class="small"><b>The bloodline:</b> ${h.heirs.map((n, i) => `${roman(i + 1)}. ${esc(n)}`).join(' · ')}</p>
    <ul class="gens">${rows.map(r => `<li><span class="gen">${roman(r.gen)}</span><span>${r.html}</span></li>`).join('')}</ul>
    <p class="small muted">Heart Tokens: ${h.hp.map((x, i) => `${roman(i + 1)} ${x}`).join(' · ')}</p>
    ${h.downsideText ? `<p class="small muted">${esc(h.downsideText)}</p>` : ''}</article>`;
};

// Every Card, as the rule guide lists it: name, number, kind and category, the timing line, the text.
const card = c => `<p class="card"><b>${esc(c.name)}</b> <small>#${c.id} · ${c.reaction ? 'Reaction' : `${c.kind === 'hand' ? 'Hand' : 'Instant'} · ${esc(c.category)}`}${c.kind === 'elodie' ? ' · Elodie' : ''}</small>${c.when ? ` <i>${esc(c.when)}.</i>` : ''} ${esc(c.text)}</p>`;

const parts = data.ruleParts.filter(p => p.id !== 'reference');
// Contents, with page numbers read back from the PDF itself (Chromium has no target-counter): PAGE_OF[id].
const PAGE_OF = {};
const tocItem = (id, title) => `<li><a href="#${id}">${esc(title)}</a><span class="pg">${PAGE_OF[id] ?? ''}</span></li>`;
const toc = () => parts.map(p => `<h4>${esc(p.title)}</h4><ol>${data.rules.filter(r => r.part === p.id).map(r => tocItem(r.id, r.title)).join('')}${p.id === 'appendix' ? tocItem('houses', 'The Eight Houses') + tocItem('card-list', 'Every Card') : ''}</ol>`).join('');
const TOC_TITLES = [...data.rules.filter(r => r.part !== 'reference').map(r => [r.id, r.title]), ['houses', 'The Eight Houses'], ['card-list', 'Every Card']];

const css = `${FONTS}
@page { size: ${PAGE.w}in ${PAGE.h}in; margin: 0.8in 0.75in 0.85in 0.75in; background: #f6efdf;
  @bottom-center { content: counter(page); font: 600 10pt Cinzel; color: #6b4a1c; padding-bottom: 0.3in; } }
@page full { margin: 0; @bottom-center { content: none; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
* { box-sizing: border-box; }
body { margin: 0; font: 10.6pt/1.32 Garamond; color: #22160e; }
.full { page: full; width: ${PAGE.w}in; height: ${PAGE.h}in; position: relative; overflow: hidden; break-after: page; }
.cover img.map { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cover .shade { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 42%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.72) 100%); }
.cover img.logo { position: absolute; left: 50%; top: 40%; width: 6.9in; transform: translate(-50%, -50%);
  filter: drop-shadow(0 .04in .1in rgba(0,0,0,.95)) drop-shadow(0 0 .3in rgba(0,0,0,.7)); }
.cover .sub { position: absolute; left: 0; right: 0; bottom: 1.25in; text-align: center; }
.cover .sub b { display: block; font: 700 30pt Cinzel; letter-spacing: .25em; text-transform: uppercase; color: #f3d27a;
  filter: drop-shadow(0 2px 3px #000); }
.cover .sub i { font: italic 15pt Garamond; color: #f0e4c8; text-shadow: 0 1px 4px #000; }
.back { break-before: page; break-after: auto; background: radial-gradient(ellipse at 50% 45%, #183139 0%, #0f2129 55%, #0a161c 100%); color: #e8dcc0; }
.back .in { position: absolute; left: 1in; right: 1in; top: 2.2in; text-align: center; }
.back .crests { display: grid; grid-template-columns: repeat(4, 1fr); gap: .3in .2in; margin: .5in 0; }
.back figure { margin: 0; } .back figure figcaption { color: #e8dcc0; font: 700 9pt Cinzel; letter-spacing: .08em; text-transform: uppercase; margin-top: .06in; }
.back h2 { border: 0; margin: 0; font: 700 26pt Cinzel; letter-spacing: .2em; text-transform: uppercase; color: #f3d27a; }
.back p { font: italic 13pt Garamond; } .back .facts { font: 700 11pt Cinzel; letter-spacing: .12em; color: #f3d27a; text-transform: uppercase; margin-top: .4in; }
h1.part { font: 700 24pt Cinzel; letter-spacing: .12em; text-transform: uppercase; text-align: center; color: #7a1f2a; margin: 0 0 .04in; break-before: page; }
.part-intro { text-align: center; font-style: italic; color: #5a4632; margin: 0 0 .25in; }
.rule-line { height: 2px; margin: .1in auto .2in; width: 60%; background: linear-gradient(90deg, transparent, #c99a45 15%, #9a6a24 50%, #c99a45 85%, transparent); }
.cols { column-count: 2; column-gap: .32in; column-rule: 1px solid rgba(154,106,36,.35); }
section { margin-bottom: .14in; }
h2 { font: 700 13pt Cinzel; letter-spacing: .06em; color: #7a1f2a; margin: .06in 0 .05in; break-after: avoid; border-bottom: 1px solid rgba(154,106,36,.5); padding-bottom: 2px; }
p { margin: 0 0 .06in; } b { color: #4a1218; }
ul, ol { margin: 0 0 .07in; padding-left: 1.15em; } li { margin-bottom: .035in; }
ol li::marker { font-weight: 700; color: #7a1f2a; } ul li::marker { color: #9a6a24; }
blockquote { margin: 0 0 .08in; padding: .06in .14in; font-style: italic; border-left: 3px solid #c99a45; background: rgba(201,154,69,.12); }
figure { margin: .08in 0 .12in; break-inside: avoid; } figcaption { font: italic 9pt Garamond; color: #5a4632; text-align: center; margin-top: .04in; }
figure.cards { display: flex; gap: .1in; flex-wrap: wrap; justify-content: center; } figure.cards img { width: 47%; border-radius: .06in; }
figure.cards figcaption { width: 100%; }
.toc { break-after: page; padding-top: .4in; }
.toc h1 { font: 700 24pt Cinzel; letter-spacing: .14em; text-transform: uppercase; text-align: center; color: #7a1f2a; }
.toc h4 { font: 700 12pt Cinzel; letter-spacing: .08em; color: #7a1f2a; text-transform: uppercase; margin: .2in 0 .05in; }
.toc ol { columns: 2; column-gap: .5in; margin: 0; } .toc a { color: inherit; text-decoration: none; }
.toc li { display: flex; } .toc li a { flex: 1; } .toc .pg { font: 600 10pt Cinzel; color: #7a5a2a; }
.toc .intro { max-width: 5.6in; margin: .3in auto 0; }
.house { break-inside: avoid-column; margin-bottom: .16in; }
.house header { display: flex; gap: .1in; align-items: center; margin-bottom: .04in; }
.house h3 { font: 700 12pt Cinzel; color: #7a1f2a; margin: 0; } .house small { font-style: italic; color: #5a4632; }
.lore { font-style: italic; color: #4a3a2a; } .small { font-size: 9.6pt; } .muted { color: #5a4632; }
.gens { list-style: none; padding: 0; } .gens li { display: flex; gap: .07in; }
.gen { flex: none; width: .3in; font: 700 9pt Cinzel; color: #9a6a24; padding-top: 1px; }
.notes h1 { font: 700 20pt Cinzel; letter-spacing: .14em; text-transform: uppercase; text-align: center; color: #7a1f2a; }
.notes .lines { height: 8.6in; background: repeating-linear-gradient(transparent 0 .34in, rgba(154,106,36,.45) .34in calc(.34in + 1px)); }
.notes { break-before: page; }
.cardlist .card { font-size: 9.3pt; line-height: 1.25; margin-bottom: .045in; break-inside: avoid; }
.cardlist small { font: 600 7.4pt Cinzel; color: #7a5a2a; letter-spacing: .03em; } .cardlist i { color: #5a4632; }`;

const body = () => {
  const sections = p => data.rules.filter(r => r.part === p.id).map(r =>
    `<section id="${r.id}"><h2>${esc(r.title)}</h2>${r.blocks.map(block).join('')}${FIGURES[r.id] ?? ''}</section>`).join('');
  return parts.map(p => `<h1 class="part">${esc(p.title)}</h1><p class="part-intro">${esc(p.intro)}</p><div class="rule-line"></div>
    <div class="cols">${sections(p)}${p.id === 'appendix' ? `<section id="houses"><h2>The Eight Houses</h2>
      <p>Roman numerals show the generation each power arrives at. Every heir keeps all earlier powers.</p>${data.houses.map(house).join('')}</section>
      <section id="card-list"><h2>Every Card</h2><p>All ${data.cards.length} cards in the Shared Action Deck, by number.</p>
      <div class="cardlist">${data.cards.map(card).join('')}</div></section>` : ''}</div>`).join('');
};

const cover = `<div class="full cover"><img class="map" src="${uri(MAP)}"><div class="shade"></div><img class="logo" src="${uri(LOGO)}">
  <div class="sub"><b>Rulebook</b><i>The official rules</i></div></div>`;
const back = `<div class="full back"><div class="in"><h2>Bloodlines</h2><p>The Race to Elodie's Grace</p>
  <div class="crests">${data.houses.map(h => `<figure>${crestImg(h, 110, 'border-radius:50%')}<figcaption>${esc(short(h))}</figcaption></figure>`).join('')}</div>
  ${data.rules.find(r => r.id === 'components').blocks.flatMap(b => b.list ?? []).filter(s => /^For \*\*2 to 8/.test(s)).map(s => `<p class="facts">${rich(s).replace(/<\/?b>/g, '')}</p>`).join('')}
  <img src="${icon('throne')}" style="width:.5in;margin-top:.4in;opacity:.8"></div></div>`;
const tocPage = () => `<div class="toc"><h1>Contents</h1><div class="rule-line"></div>${toc()}</div>`;
const notes = n => Array.from({ length: n }, () => `<div class="notes"><h1>Notes</h1><div class="rule-line"></div><div class="lines"></div></div>`).join('');
const html = n => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${cover}${tocPage()}${body()}${notes(n)}${back}</body></html>`;

(async () => {
  const b = await launch();
  const page = await b.newPage();
  const out = path.join(ROOT, 'print/rulebook.pdf');
  const make = async n => {
    await page.setContent(html(n), { timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: out, width: `${PAGE.w}in`, height: `${PAGE.h}in`, printBackground: true, preferCSSPageSize: true });
    return Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [out]).toString())[1]);
  };
  let pages = await make(0);
  // Each section's page: the first page from 3 on with its title alone in a column (a heading, not a mention).
  const text = execFileSync('pdftotext', ['-layout', out, '-']).toString().split('\f');
  for (const [id, title] of TOC_TITLES) {
    const re = new RegExp(`(^|\\s{3,})${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s{3,}|$)`, 'i');
    const i = text.findIndex((t, n) => n >= 2 && t.split('\n').some(l => re.test(l.trim())));
    if (i >= 0) PAGE_OF[id] = i + 1; else console.log(`Contents: no page found for ${title}`);
  }
  pages = await make(0);
  // The back cover must land on an even page and the whole a multiple of 4: pad with Notes pages.
  if (pages % 4) pages = await make(4 - (pages % 4));
  const dir = path.join(ROOT, 'print/rulebook-pages');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  execFileSync('pdftoppm', ['-png', '-r', '150', out, path.join(dir, 'page')]);
  const files = fs.readdirSync(dir).sort().map(f => path.join(dir, f));
  await contactSheet(b, files, path.join(ROOT, 'print/preview-rulebook.jpg'), { cols: 6, tw: 260, bleedPx: Math.round(BLEED * 150) });
  await b.close();
  console.log(`rulebook -> print/rulebook.pdf (${pages} pages, ${PAGE.w}" x ${PAGE.h}" with bleed; 8.5" x 11" trimmed)`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
