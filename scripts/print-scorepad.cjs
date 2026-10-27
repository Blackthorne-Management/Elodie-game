// The score pad (PRODUCTION.md row 10c): one sheet per game, one column per player for kills and Reckonings (read by
// Sudden Death, Reinado de Cenizas and Elodie's Reckoning; the fallen-houses column was dropped in rules-decisions
// 87). BoardGamesMaker's "Custom Score Pad Large Size", 8" × 5", printed black only on 80 gsm paper, so the sheet is
// pure black on white: landscape, 300 dpi with the 1/8" bleed, 8.25" × 5.25" = 2475 × 1575 px. Columns for 8
// players (the most a game takes). The footnote is the score-pad rule from src/data/rules.ts.
// Run via `npm run print:scorepad`.
// Out: print/scorepad.pdf (grayscale), print/scorepad.png
const path = require('path');
const { ROOT, data, I, rich, launch, render, toPdf } = require('./print-common.cjs');

const W = I(8.25), H = I(5.25), PLAYERS = data.houses.length;
const rule = data.rules.flatMap(r => r.blocks).flatMap(b => (typeof b === 'object' && 'list' in b ? b.list : []))
  .find(s => /^\*\*The score pad:\*\*/.test(s));

const css = `
.pad { position: relative; width: ${W}px; height: ${H}px; background: #fff; color: #000; font-family: Garamond; }
.head { position: absolute; left: ${I(0.42)}px; right: ${I(0.42)}px; top: ${I(0.36)}px; display: flex; align-items: baseline; gap: ${I(0.2)}px; }
.head h1 { font: 700 64px Cinzel; letter-spacing: .14em; text-transform: uppercase; }
.head span { font: italic 44px Garamond; }
.head .fill { margin-left: auto; font: 40px Garamond; white-space: nowrap; }
table { position: absolute; left: ${I(0.42)}px; right: ${I(0.42)}px; top: ${I(0.9)}px; width: ${W - I(0.84)}px; border-collapse: collapse; table-layout: fixed; }
th, td { border: 3px solid #000; }
th { font: 700 34px Cinzel; letter-spacing: .06em; text-transform: uppercase; text-align: left; padding: 0 14px; width: ${I(1.25)}px; }
th small { display: block; font: italic 28px Garamond; text-transform: none; letter-spacing: 0; }
td { text-align: center; vertical-align: top; font: 700 30px Cinzel; padding-top: 6px; }
tr.num td { height: ${I(0.32)}px; vertical-align: middle; padding: 0; background: #000; color: #fff; }
tr.name td, tr.house td { height: ${I(0.45)}px; }
tr.tally td { height: ${I(1.0)}px; }
.foot { position: absolute; left: ${I(0.42)}px; right: ${I(0.42)}px; bottom: ${I(0.34)}px; font: 32px Garamond; line-height: 1.2; }`;

const cols = n => Array.from({ length: PLAYERS }, (_, i) => n(i)).join('');
const html = `<div class="pad">
  <div class="head"><h1>Bloodlines</h1><span>Score pad</span><div class="fill">Date ________________</div></div>
  <table>
    <tr class="num"><th style="background:#fff;color:#000"></th>${cols(i => `<td>${i + 1}</td>`)}</tr>
    <tr class="name"><th>Player</th>${cols(() => '<td></td>')}</tr>
    <tr class="house"><th>House</th>${cols(() => '<td></td>')}</tr>
    <tr class="tally"><th>Kills<small>a tick each</small></th>${cols(() => '<td></td>')}</tr>
    <tr class="tally"><th>Reckonings<small>a tick each</small></th>${cols(() => '<td></td>')}</tr>
  </table>
  <div class="foot fit-h" data-min="26" style="height:${I(0.42)}px">${rich(rule)}</div>
</div>`;

(async () => {
  const b = await launch();
  const png = path.join(ROOT, 'print/scorepad.png');
  const over = await render(b, css, html, W, H, png);
  await b.close();
  toPdf([png], path.join(ROOT, 'print/scorepad.pdf'), 300, true);
  console.log(`score pad -> print/scorepad.pdf (${W} x ${H} px, 8" x 5" + bleed, black only)`);
  if (over) console.log('Text still overflows on the score pad');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
