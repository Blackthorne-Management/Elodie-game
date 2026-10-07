// Ornamental UI pieces drawn in code (so they stay sharp at any size): the panel frame, the button plaque and
// the large frame for the board. Used as CSS border-images. Run: node scripts/make-ui-art.cjs public/art/ui
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || 'public/art/ui';

const defs = `<defs>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f6"/><stop offset=".5" stop-color="#8d95a6"/><stop offset="1" stop-color="#4c5363"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1bf"/><stop offset=".45" stop-color="#d9a441"/><stop offset="1" stop-color="#7c4f17"/></linearGradient>
</defs>`;

// A corner flourish drawn for the top-left corner; the others are mirrored.
const flourish = (s) => `<g fill="url(#gold)" stroke="#2a1a06" stroke-width=".6">
  <path d="M${4 * s} ${4 * s} l${9 * s} ${3 * s} l${-6 * s} ${6 * s} z"/>
  <path d="M${12 * s} ${6 * s} c${8 * s} ${-2 * s} ${14 * s} ${2 * s} ${18 * s} ${6 * s} c${-6 * s} ${-2 * s} ${-11 * s} ${-2 * s} ${-16 * s} ${1 * s} z"/>
  <path d="M${6 * s} ${12 * s} c${-2 * s} ${8 * s} ${2 * s} ${14 * s} ${6 * s} ${18 * s} c${-2 * s} ${-6 * s} ${-2 * s} ${-11 * s} ${1 * s} ${-16 * s} z"/>
  <circle cx="${9 * s}" cy="${9 * s}" r="${2.2 * s}"/></g>`;
const corners = (W, H, s) => [
  flourish(s), `<g transform="translate(${W} 0) scale(-1 1)">${flourish(s)}</g>`,
  `<g transform="translate(0 ${H}) scale(1 -1)">${flourish(s)}</g>`, `<g transform="translate(${W} ${H}) scale(-1 -1)">${flourish(s)}</g>`,
].join('');

// Panel frame: silver outer line, thin gold inner line, gold corner flourishes. Slice 40 of 120.
function frame(W = 120, H = 120) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
  <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="3" fill="none" stroke="#05070c" stroke-width="3"/>
  <rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="3" fill="none" stroke="url(#silver)" stroke-width="2.4"/>
  <rect x="8.5" y="8.5" width="${W - 17}" height="${H - 17}" rx="2" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity=".85"/>
  ${corners(W, H, 1)}</svg>`;
}
// Button plaque: a bevelled gold edge with small corner studs. Slice 24 of 96.
function plaque(W = 96, H = 96) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="6" fill="none" stroke="#05070c" stroke-width="3"/>
  <rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="5" fill="none" stroke="url(#gold)" stroke-width="2.6"/>
  <rect x="7" y="7" width="${W - 14}" height="${H - 14}" rx="3" fill="none" stroke="#f3d27a" stroke-width=".8" opacity=".45"/>
  ${[[6, 6], [W - 6, 6], [6, H - 6], [W - 6, H - 6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="url(#gold)" stroke="#2a1a06" stroke-width=".6"/>`).join('')}</svg>`;
}
// Board frame: heavier, with larger flourishes. Slice 60 of 180.
function boardFrame(W = 180, H = 180) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
  <rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="4" fill="none" stroke="#05070c" stroke-width="5"/>
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" rx="4" fill="none" stroke="url(#silver)" stroke-width="3.5"/>
  <rect x="11" y="11" width="${W - 22}" height="${H - 22}" rx="3" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <rect x="14.5" y="14.5" width="${W - 29}" height="${H - 29}" rx="2" fill="none" stroke="#05070c" stroke-width="1.5" opacity=".6"/>
  ${corners(W, H, 1.5)}</svg>`;
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'frame.svg'), frame());
fs.writeFileSync(path.join(OUT, 'plaque.svg'), plaque());
fs.writeFileSync(path.join(OUT, 'board-frame.svg'), boardFrame());
console.log('UI frames written to', OUT);
