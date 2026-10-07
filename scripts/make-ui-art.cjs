// Gothic UI ornaments drawn in code, so they stay sharp at any size. CSS uses them as border-images (corners fixed,
// edges repeated) and background tiles. Run: node scripts/make-ui-art.cjs public/art/ui
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || 'public/art/ui';

const DEFS = `<defs>
  <linearGradient id="iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7686"/><stop offset=".35" stop-color="#2b303b"/><stop offset=".7" stop-color="#14171e"/><stop offset="1" stop-color="#3a404d"/></linearGradient>
  <linearGradient id="ironv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f7686"/><stop offset=".35" stop-color="#2b303b"/><stop offset=".7" stop-color="#14171e"/><stop offset="1" stop-color="#3a404d"/></linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6fa"/><stop offset=".45" stop-color="#a3abba"/><stop offset="1" stop-color="#454b58"/></linearGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a676"/><stop offset=".4" stop-color="#857043"/><stop offset=".75" stop-color="#55441f"/><stop offset="1" stop-color="#2e240e"/></linearGradient>
  <radialGradient id="gem" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#b8646a"/><stop offset=".35" stop-color="#6e1620"/><stop offset=".8" stop-color="#33060c"/><stop offset="1" stop-color="#180204"/></radialGradient>
  <radialGradient id="boss" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8c94a4"/><stop offset=".5" stop-color="#363c48"/><stop offset="1" stop-color="#101318"/></radialGradient>
</defs>`;
const INK = '#05070b';
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${DEFS}${body}</svg>\n`;

// A gold scroll: a stem that curls into a spiral at its end (drawn along +x from the origin).
const scroll = (len, curl, flip = 1) => {
  const c = curl * flip;
  return `<path d="M0 0 C${len * .35} ${-c * .2} ${len * .65} ${c * .25} ${len * .82} ${c * .05}
    C${len * .95} ${-c * .1} ${len * 1.02} ${c * .55} ${len * .9} ${c * .75} C${len * .8} ${c * .9} ${len * .7} ${c * .6} ${len * .78} ${c * .45}"
    fill="none" stroke="url(#gold)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M${len * .3} ${-c * .05} c${len * .05} ${c * .35} ${len * .12} ${c * .45} ${len * .2} ${c * .4}" fill="none" stroke="url(#gold)" stroke-width="1.1" stroke-linecap="round"/>`;
};
// A gothic fleur pointing along +x.
const fleur = (s) => `<g fill="url(#gold)" stroke="${INK}" stroke-width=".7">
  <path d="M0 0 C${4 * s} ${-3 * s} ${8 * s} ${-2 * s} ${12 * s} 0 C${8 * s} ${2 * s} ${4 * s} ${3 * s} 0 0 Z"/>
  <path d="M${3 * s} 0 C${5 * s} ${-5 * s} ${9 * s} ${-7 * s} ${11 * s} ${-5 * s} C${8 * s} ${-4 * s} ${6 * s} ${-2 * s} ${5 * s} 0 Z"/>
  <path d="M${3 * s} 0 C${5 * s} ${5 * s} ${9 * s} ${7 * s} ${11 * s} ${5 * s} C${8 * s} ${4 * s} ${6 * s} ${2 * s} ${5 * s} 0 Z"/></g>`;

// ---- the panel frame: iron band with gold lines, a repeating engraved motif along every edge, and jewelled
// corner bosses with scrollwork. 150 x 150, slice 50 (corners fixed, edges repeat).
function frame(S = 150, B = 50, band = 16) {
  const edge = (len) => {
    // one 50-unit tile of the edge motif, centred on the band
    const y = band / 2 + 2, k = band / 12;
    return `<path d="M${len / 2 - 7 * k} ${y} l${7 * k} ${-4.5 * k} l${7 * k} ${4.5 * k} l${-7 * k} ${4.5 * k} z" fill="url(#gold)" stroke="${INK}" stroke-width=".7"/>
      <path d="M${len / 2 - 3 * k} ${y} l${3 * k} ${-2 * k} l${3 * k} ${2 * k} l${-3 * k} ${2 * k} z" fill="url(#gem)"/>
      <circle cx="${len / 2 - 16 * k}" cy="${y}" r="${1.7 * k}" fill="url(#gold)" stroke="${INK}" stroke-width=".4"/>
      <circle cx="${len / 2 + 16 * k}" cy="${y}" r="${1.7 * k}" fill="url(#gold)" stroke="${INK}" stroke-width=".4"/>
      <path d="M${len / 2 - 25 * k} ${y} c${3 * k} ${-4 * k} ${6 * k} ${-4 * k} ${8 * k} 0 c${-2 * k} ${4 * k} ${-5 * k} ${4 * k} ${-8 * k} 0 z" fill="none" stroke="#7d6a3e" stroke-width="1" opacity=".85"/>
      <path d="M${len / 2 + 25 * k} ${y} c${-3 * k} ${-4 * k} ${-6 * k} ${-4 * k} ${-8 * k} 0 c${2 * k} ${4 * k} ${5 * k} ${4 * k} ${8 * k} 0 z" fill="none" stroke="#7d6a3e" stroke-width="1" opacity=".85"/>`;
  };
  // band along the top (y 2..band+2) as one strip, repeated for the 4 sides via transforms of the whole edge group
  const strip = (len) => `<rect x="0" y="2" width="${len}" height="${band}" fill="url(#iron)"/>
    <rect x="0" y="2" width="${len}" height="1.4" fill="#7f8794"/>
    <rect x="0" y="${band + 1}" width="${len}" height="2" fill="#7d6a3e"/>
    <rect x="0" y="${band + 1}" width="${len}" height=".7" fill="#a8976a" opacity=".6"/>
    <rect x="0" y="${band + 5}" width="${len}" height=".9" fill="#7d6a3e" opacity=".5"/>`;
  // The edge between the corners is one tile (S - 2B long) that the browser repeats along each side.
  const top = `${strip(S)}<g transform="translate(${B} 0)">${edge(S - 2 * B)}</g>`;
  const corner = `<g>
    <rect x="1" y="1" width="${band + 14}" height="${band + 14}" rx="3" fill="url(#boss)" stroke="${INK}" stroke-width="1.4"/>
    <rect x="3.5" y="3.5" width="${band + 9}" height="${band + 9}" rx="2" fill="none" stroke="url(#gold)" stroke-width="1.3"/>
    <circle cx="${band / 2 + 8}" cy="${band / 2 + 8}" r="6.2" fill="url(#gem)" stroke="url(#gold)" stroke-width="1.6"/>
    <circle cx="${band / 2 + 6}" cy="${band / 2 + 6}" r="1.6" fill="#fff" opacity=".7"/>
    <g transform="translate(${band + 14} ${band + 7})">${scroll(B - band - 16, 10)}</g>
    <g transform="translate(${band + 7} ${band + 14}) rotate(90)">${scroll(B - band - 16, 10, -1)}</g>
    <g transform="translate(${band + 13} ${band + 13}) rotate(45)">${fleur(1.35)}</g></g>`;
  const outer = `<rect x="1" y="1" width="${S - 2}" height="${S - 2}" rx="3" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return svg(S, S, `
    <g>${top}</g>
    <g transform="translate(${S} 0) rotate(90)">${top}</g>
    <g transform="translate(${S} ${S}) rotate(180)">${top}</g>
    <g transform="translate(0 ${S}) rotate(-90)">${top}</g>
    ${outer}
    ${corner}
    <g transform="translate(${S} 0) scale(-1 1)">${corner}</g>
    <g transform="translate(0 ${S}) scale(1 -1)">${corner}</g>
    <g transform="translate(${S} ${S}) scale(-1 -1)">${corner}</g>`);
}

// ---- the button plaque: pointed end caps with studs, a gold-edged iron body. 240 x 64: slice 0 34 (the caps),
// the body stretches.
function plaque(tone = ['#222a3c', '#10151f', '#0a0d14'], W = 240, H = 64, cap = 34) {
  const m = H / 2;
  const fill = `<defs><linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tone[0]}"/><stop offset=".55" stop-color="${tone[1]}"/><stop offset="1" stop-color="${tone[2]}"/></linearGradient></defs>
    <path d="M18 4.5 H${W - 18} L${W - 5} ${m} L${W - 18} ${H - 4.5} H18 L5 ${m} Z" fill="url(#body)"/>
    <path d="M18 4.5 H${W - 18} L${W - 12} ${m * .6} H12 Z" fill="#fff" opacity=".05"/>`;
  const body = `${fill}
    <rect x="${cap - 2}" y="3.9" width="${W - 2 * cap + 4}" height="2.2" fill="#7d6a3e"/><rect x="${cap - 2}" y="3.9" width="${W - 2 * cap + 4}" height=".8" fill="#a8976a" opacity=".6"/>
    <rect x="${cap - 2}" y="${H - 6.1}" width="${W - 2 * cap + 4}" height="2.2" fill="#5a4a26"/>
    <rect x="${cap}" y="8.6" width="${W - 2 * cap}" height=".7" fill="#8f7d4f" opacity=".4"/>
    <rect x="${cap}" y="${H - 9.3}" width="${W - 2 * cap}" height=".7" fill="#8f7d4f" opacity=".4"/>`;
  const capL = `<path d="M${cap} 3.5 H18 L4 ${m} L18 ${H - 3.5} H${cap}" fill="none" stroke="${INK}" stroke-width="4"/>
    <path d="M${cap} 5 H18.5 L5.5 ${m} L18.5 ${H - 5} H${cap}" fill="none" stroke="url(#gold)" stroke-width="2.2"/>
    <path d="M${cap} 9 H21 L10 ${m} L21 ${H - 9} H${cap}" fill="none" stroke="#8f7d4f" stroke-width=".7" opacity=".45"/>
    <path d="M12 ${m} l5 -5 l5 5 l-5 5 z" fill="url(#gem)" stroke="url(#gold)" stroke-width="1.2"/>
    <circle cx="${cap - 6}" cy="10.5" r="2.4" fill="url(#gold)" stroke="${INK}" stroke-width=".6"/>
    <circle cx="${cap - 6}" cy="${H - 10.5}" r="2.4" fill="url(#gold)" stroke="${INK}" stroke-width=".6"/>`;
  return svg(W, H, `${body}${capL}<g transform="translate(${W} 0) scale(-1 1)">${capL}</g>`);
}

// ---- a heavier frame for the board: wider iron band, double gold lines, bigger bosses. 210 x 210, slice 70.
function boardFrame() {
  return frame(210, 70, 22);
}

// ---- background tiles: a faint damask for panels, and grain for the page.
function damask(T = 72) {
  const motif = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})" fill="#c9a24e">
    <path d="M0 -15 C4 -10 5 -4 1.5 2 L-1.5 2 C-5 -4 -4 -10 0 -15 Z"/>
    <path d="M-1.5 1 C-4 -6 -10 -9 -13 -4 C-10 -6 -7 -3 -6 1 Z"/><path d="M1.5 1 C4 -6 10 -9 13 -4 C10 -6 7 -3 6 1 Z"/>
    <rect x="-7" y="2" width="14" height="2.4" rx="1"/>
    <path d="M-1.5 4.4 L-4 11 L0 8.5 L4 11 L1.5 4.4 Z"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${T}" height="${T}"><g opacity=".06">
    ${motif(T / 2, T / 2, 1)}${motif(0, 0, .7)}${motif(T, 0, .7)}${motif(0, T, .7)}${motif(T, T, .7)}</g></svg>\n`;
}
function grain(T = 160) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${T}" height="${T}">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 .6  0 0 0 0 .62  0 0 0 0 .7  0 0 0 .09 0"/></filter>
  <rect width="${T}" height="${T}" filter="url(#n)"/></svg>\n`;
}
// ---- an ornamental divider for headings: a gem between two scrolling gold lines.
function divider(W = 300, H = 20) {
  const half = `<rect x="16" y="${H / 2 - .8}" width="${W / 2 - 38}" height="1.6" fill="#7d6a3e"/>
    <g transform="translate(${W / 2 - 22} ${H / 2})">${fleur(.9)}</g>
    <circle cx="10" cy="${H / 2}" r="2" fill="url(#gold)"/>`;
  return svg(W, H, `${half}<g transform="translate(${W} 0) scale(-1 1)">${half}</g>
    <path d="M${W / 2} ${H / 2 - 7} l7 7 l-7 7 l-7 -7 z" fill="url(#gem)" stroke="url(#gold)" stroke-width="1.4"/>`);
}

// ---- a candle in an iron holder, for the corners of the board (the flame glow is CSS).
function candle(W = 40, H = 90) {
  return svg(W, H, `<defs><linearGradient id="wax" x1="0" x2="1"><stop offset="0" stop-color="#e9d6a8"/><stop offset=".5" stop-color="#fff2cf"/><stop offset="1" stop-color="#b89a62"/></linearGradient></defs>
    <rect x="12" y="26" width="16" height="50" rx="2" fill="url(#wax)"/>
    <path d="M12 30 q3 6 0 12 M28 34 q-3 5 0 9" fill="none" stroke="#fff6dc" stroke-width="2" opacity=".8"/>
    <path d="M20 14 C25 20 24 26 20 26 C16 26 15 20 20 14 Z" fill="#ffd36b"/><path d="M20 18 C22 22 22 25 20 25 C18 25 18 22 20 18 Z" fill="#fff8dc"/>
    <rect x="19.4" y="22" width="1.2" height="5" fill="#3a2a1a"/>
    <path d="M6 76 H34 L30 84 H10 Z" fill="url(#iron)" stroke="${INK}" stroke-width="1"/><rect x="4" y="74" width="32" height="3" rx="1.5" fill="url(#gold)"/>`);
}
fs.mkdirSync(OUT, { recursive: true });
const files = {
  'frame.svg': frame(),
  'plaque.svg': plaque(),
  'plaque-gold.svg': plaque(['#3a301c', '#1a140b', '#0e0a05']),
  'plaque-red.svg': plaque(['#55181f', '#28090d', '#170407']),
  'plaque-violet.svg': plaque(['#2e2a52', '#16142e', '#0d0c1f']), 'board-frame.svg': boardFrame(), 'damask.svg': damask(), 'grain.svg': grain(), 'divider.svg': divider(), 'candle.svg': candle() };
for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), s);
console.log('UI ornaments written to', OUT);
