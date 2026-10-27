// The 8 Legacy cards, one per house, showing its Gen I passive as a Legacy reads it (`legacyPassive` in
// src/data/houses.ts: Brasador's reads "+1 Fear on kill." from the start, rules-decisions 87). Tarot size, printed
// with the character cards (same deck, same back), so House Yaguana's blind draw can't be told apart by the back.
// 1050 × 1752 px like print/characters (2.75" × 4.75" tarot with bleed, about 350 dpi; docs/art/ART-GUIDE.md §13),
// laid out on the character overlay. Run via `npm run print:legacy`.
// Out: print/legacy/legacy-<house>.png, print/legacy/legacy-cards.pdf (all 8, one per page) and print/preview-legacy.jpg
const path = require('path');
const { ROOT, data, uri, crestImg, esc, short, launch, render, toPdf, contactSheet } = require('./print-common.cjs');

const W = 1050, H = 1752;
const OVERLAY = uri(path.join(ROOT, 'docs/art/overlays/overlay-character.png'));
const yaguana = data.houses.find(h => /\bLegacy\b/.test(h.passiveText[0]));
// The powers that hold a Legacy card: Ancestor's Voice (Yaguana's passive) and Song of Coaybay (its Gen IV note).
const holders = [yaguana.passiveText[0], ...Object.values(yaguana.notes)].map(t => t.split(':')[0])
  .filter(n => /Voice|Song/.test(n));

const css = `
.card { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
.back { position: absolute; inset: 0; }
.ov { position: absolute; inset: 0; width: 100%; height: 100%; }
.crest { position: absolute; left: 50%; top: 700px; transform: translate(-50%, -50%); filter: drop-shadow(0 12px 18px rgba(0,0,0,.75)); }
.word { position: absolute; left: 0; right: 0; top: 230px; text-align: center; font: 700 64px Cinzel; letter-spacing: .3em;
  color: #f3d27a; text-shadow: 0 3px 6px rgba(0,0,0,.8); }
.medal { position: absolute; display: grid; place-items: center; transform: translate(-50%, -50%); }
.title { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; font: 600 52px Cinzel;
  color: #f6ecd2; text-shadow: 0 2px 4px rgba(0,0,0,.5); }
.type { position: absolute; display: flex; align-items: center; justify-content: center; white-space: nowrap; font: 600 33px Cinzel;
  letter-spacing: .1em; text-transform: uppercase; color: #f3d27a; }
.rules { position: absolute; display: flex; flex-direction: column; justify-content: center; text-align: center; color: #f4ece0;
  font-family: Garamond; line-height: 1.2; gap: .5em; }
.rules .note { font-style: italic; color: #cfc3ad; font-size: .72em; }`;

const card = h => `<div class="card">
  <div class="back" style="background: radial-gradient(circle at 50% 40%, ${h.color} 0%, #2b1418 62%, #160a0c 100%)"></div>
  <div class="word">Legacy</div>
  <div class="crest">${crestImg(h, 600)}</div>
  <img class="ov" src="${OVERLAY}">
  <div class="medal" style="left:133px;top:141px;font:700 44px Cinzel;color:#f3d27a;text-shadow:0 2px 3px rgba(0,0,0,.6)">I</div>
  <div class="medal" style="left:917px;top:141px">${crestImg(h, 74, 'border-radius:50%')}</div>
  <div class="title fit-w" data-min="30" style="left:192px;right:192px;top:92px;height:98px">${esc(h.passiveName)}</div>
  <div class="type fit-w" data-min="22" style="left:146px;right:146px;top:1234px;height:42px">Legacy · ${esc(short(h))} · ${esc(h.homeland)}</div>
  <div class="rules fit-h" data-min="30" style="left:130px;right:130px;top:1302px;bottom:110px;font-size:50px">
    <div>${esc(h.legacyText)}</div>
    <div class="note">Held by House ${esc(short(yaguana))}: ${holders.map(esc).join(' or ')}.</div>
  </div></div>`;

(async () => {
  const b = await launch();
  const files = [], tight = [];
  for (const h of data.houses) {
    const file = path.join(ROOT, 'print/legacy', `legacy-${h.id}.png`);
    if (await render(b, css, card(h), W, H, file)) tight.push(h.id);
    files.push(file);
  }
  await contactSheet(b, files, path.join(ROOT, 'print/preview-legacy.jpg'), { cols: 4, tw: 300, bleedPx: 42 });
  await b.close();
  toPdf(files, path.join(ROOT, 'print/legacy/legacy-cards.pdf'), 350);
  console.log(`${files.length} Legacy cards -> print/legacy/ (${W} x ${H} px)`);
  if (tight.length) console.log(`Text still overflows on: ${tight.join(', ')}`);
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
