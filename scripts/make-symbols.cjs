// Card category symbols: gold vector icons for the medallion in each card's title plate (print and app).
// Run: node scripts/make-symbols.cjs public/art/icons
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || 'public/art/icons';

const INK = '#3a2408';
const star = (n, r1, r2, cx = 50, cy = 50, rot = -90) => {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180, r = i % 2 ? r2 : r1;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}"/>`;
};
const sword = rot => `<g transform="rotate(${rot} 50 50)">
  <path d="M44 15 L50 3 L56 15 L56 62 L44 62 Z"/><path d="M50 13 V58" stroke-width="1.5" opacity=".6"/>
  <rect x="31" y="61" width="38" height="9" rx="4"/><rect x="45" y="70" width="10" height="15" rx="3"/><circle cx="50" cy="89" r="7"/></g>`;
const coinLayer = y => `<path d="M14 ${y} v8 a24 9 0 0 0 48 0 v-8"/><ellipse cx="38" cy="${y}" rx="24" ry="9"/>`;

const SYMBOLS = {
  crown: `<path d="M18 70 L13 33 L33 50 L50 22 L67 50 L87 33 L82 70 Z"/><rect x="17" y="72" width="66" height="12" rx="3"/>
    <circle cx="13" cy="31" r="5.5"/><circle cx="50" cy="20" r="5.5"/><circle cx="87" cy="31" r="5.5"/>
    <circle cx="50" cy="78" r="3.5" fill="${INK}" stroke="none"/><circle cx="32" cy="78" r="2.5" fill="${INK}" stroke="none"/><circle cx="68" cy="78" r="2.5" fill="${INK}" stroke="none"/>`,
  swords: `${sword(-40)}${sword(40)}`,
  coins: `${coinLayer(70)}${coinLayer(59)}${coinLayer(48)}
    <circle cx="68" cy="40" r="20"/><circle cx="68" cy="40" r="14" fill="none" stroke="${INK}" stroke-width="2" opacity=".55"/>
    <path d="M68 30 L75 40 L68 50 L61 40 Z" fill="${INK}" stroke="none" opacity=".6"/>`,
  skull: `<path d="M50 12 C27 12 16 29 16 46 C16 58 24 65 29 67 L30 80 L70 80 L71 67 C76 65 84 58 84 46 C84 29 73 12 50 12 Z"/>
    <ellipse cx="37" cy="47" rx="9" ry="10" fill="${INK}" stroke="none"/><ellipse cx="63" cy="47" rx="9" ry="10" fill="${INK}" stroke="none"/>
    <path d="M50 57 L45 66 L55 66 Z" fill="${INK}" stroke="none"/>
    <path d="M40 72 V80 M50 72 V80 M60 72 V80" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
  burst: `${star(8, 44, 17)}<circle cx="50" cy="50" r="9" fill="${INK}" stroke="none" opacity=".5"/>`,
  arrow: `<g transform="rotate(-45 50 50) translate(-5 0) scale(1.1) translate(-4.5 -4.5)">
    <path d="M12 45 L2 31 L22 31 L30 45 Z M12 55 L2 69 L22 69 L30 55 Z"/><rect x="10" y="44" width="58" height="12" rx="3"/>
    <path d="M62 30 L94 50 L62 70 L68 50 Z"/></g>`,
  exchange: `<path d="M14 29 H64 V18 L87 35 L64 52 V41 H14 Z"/><path d="M86 65 H36 V54 L13 71 L36 88 V77 H86 Z"/>`,
  flag: `<rect x="22" y="10" width="7" height="82" rx="3"/><circle cx="25.5" cy="9" r="5"/>
    <path d="M29 16 C44 9 56 25 72 18 C77 16 82 15 87 14 L87 52 C75 58 60 43 46 51 C40 54 34 54 29 54 Z" fill="#f6ecd2"/>`,
  shield: `<path d="M50 9 L85 21 C85 52 73 76 50 91 C27 76 15 52 15 21 Z"/>
    <path d="M50 18 L76 27 C76 51 67 70 50 81 C33 70 24 51 24 27 Z" fill="none" stroke="${INK}" stroke-width="2" opacity=".5"/>
    <path d="M50 26 V74 M32 42 H68" fill="none" stroke="${INK}" stroke-width="5" opacity=".55"/>`,
  die: `<g transform="rotate(-10 50 50)"><rect x="17" y="17" width="66" height="66" rx="13"/>
    ${[[33, 33], [67, 33], [50, 50], [33, 67], [67, 67]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${INK}" stroke="none"/>`).join('')}</g>`,
  sun: `${star(12, 46, 26)}<circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="15" fill="none" stroke="${INK}" stroke-width="2" opacity=".45"/>`,
  target: `<circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="28" fill="${INK}" stroke="none" opacity=".75"/>
    <circle cx="50" cy="50" r="19"/><circle cx="50" cy="50" r="7" fill="${INK}" stroke="none" opacity=".75"/>
    <path d="M50 4 V22 M50 78 V96 M4 50 H22 M78 50 H96" fill="none" stroke="url(#g)" stroke-width="5"/>`,
  bolt: `<path d="M60 5 L20 55 L45 55 L36 95 L80 39 L55 39 L66 5 Z"/>
    <path d="M58 16 L34 49" fill="none" stroke="#fff4c9" stroke-width="2" opacity=".6"/>`,
  hourglass: `<path d="M24 8 H76 V16 H24 Z M24 84 H76 V92 H24 Z"/>
    <path d="M30 16 C30 40 46 44 46 50 C46 56 30 60 30 84 H70 C70 60 54 56 54 50 C54 44 70 40 70 16 Z"/>
    <path d="M37 26 H63 C61 38 52 42 50 47 C48 42 39 38 37 26 Z M36 80 C38 68 46 64 50 58 C54 64 62 68 64 80 Z" fill="${INK}" stroke="none" opacity=".55"/>`,
  cards: [-22, 0, 22].map(r => `<g transform="rotate(${r} 50 88)"><rect x="33" y="14" width="34" height="50" rx="5"/>
    <rect x="38" y="19" width="24" height="40" rx="3" fill="none" stroke="${INK}" stroke-width="1.8" opacity=".5"/></g>`).join(''),
};

const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>
<linearGradient id="g" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fff4c9"/><stop offset=".45" stop-color="#e6b752"/><stop offset="1" stop-color="#8a5a1c"/></linearGradient>
</defs><g fill="url(#g)" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">${body}</g></svg>
`;

fs.mkdirSync(OUT, { recursive: true });
for (const [name, body] of Object.entries(SYMBOLS)) fs.writeFileSync(path.join(OUT, `cat-${name}.svg`), svg(body));
console.log(`${Object.keys(SYMBOLS).length} symbols written to ${OUT}`);
