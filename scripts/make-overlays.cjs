// Card overlays: border, title plate (with a medallion for the symbol) and text box, transparent in the middle.
// Geometry follows MPC's print template: bleed B trimmed off each side, safe zone S from the edge.
// Run: node scripts/make-overlays.cjs docs/art/overlays public/art/overlays
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const OUT = process.argv[2], PUB = process.argv[3];

const THEMES = {
  hand:      { light: '#e9edf6', mid: '#aab2c4', dark: '#4e566a', fill: '#151a26', stars: false },
  instant:   { light: '#ffd9a6', mid: '#c98a46', dark: '#5e3516', fill: '#22160d', stars: false },
  elodie:    { light: '#fff1bf', mid: '#e0b24f', dark: '#8a5a1c', fill: '#111733', stars: true },
  character: { light: '#fff1bf', mid: '#d9a441', dark: '#7c4f17', fill: '#2a0f16', stars: false },
};
const SHAPES = {
  card:      { W: 1000, H: 1360, B: 44, S: 88, plate: [96, 186], box: [830, 1262], medallion: 'left' },
  character: { W: 1050, H: 1752, B: 42, S: 84, plate: [92, 190], box: [1226, 1666], medallion: 'both' },
};

function svg(theme, shape) {
  const t = THEMES[theme], { W, H, B, S, plate, box, medallion } = SHAPES[shape];
  const I = B + 26;                 // inner edge of the border band (26px visible after trimming)
  const r = 26;
  const metal = `<linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.light}"/><stop offset=".35" stop-color="${t.mid}"/><stop offset=".55" stop-color="${t.dark}"/>
      <stop offset=".75" stop-color="${t.mid}"/><stop offset="1" stop-color="${t.light}"/></linearGradient>
    <linearGradient id="mv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.light}"/><stop offset=".5" stop-color="${t.mid}"/><stop offset="1" stop-color="${t.dark}"/></linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.fill}" stop-opacity=".78"/><stop offset="1" stop-color="${t.fill}" stop-opacity=".93"/></linearGradient>
    <filter id="sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity=".55"/></filter>`;
  // Border band: everything outside the rounded inner rectangle.
  const band = `<path fill-rule="evenodd" fill="url(#m)" d="M0 0H${W}V${H}H0Z M${I + r} ${I}H${W - I - r}A${r} ${r} 0 0 1 ${W - I} ${I + r}V${H - I - r}A${r} ${r} 0 0 1 ${W - I - r} ${H - I}H${I + r}A${r} ${r} 0 0 1 ${I} ${H - I - r}V${I + r}A${r} ${r} 0 0 1 ${I + r} ${I}Z"/>
    <rect x="${I - 6}" y="${I - 6}" width="${W - 2 * I + 12}" height="${H - 2 * I + 12}" rx="${r + 6}" fill="none" stroke="${t.dark}" stroke-width="3" opacity=".8"/>
    <rect x="${I}" y="${I}" width="${W - 2 * I}" height="${H - 2 * I}" rx="${r}" fill="none" stroke="${t.light}" stroke-width="2.5" opacity=".9"/>
    <rect x="${I + 5}" y="${I + 5}" width="${W - 2 * I - 10}" height="${H - 2 * I - 10}" rx="${r - 4}" fill="none" stroke="#000" stroke-width="3" opacity=".35"/>`;
  // Corner flourishes on the inner edge.
  const corner = (x, y, sx, sy) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" filter="url(#sh)">
      <path d="M0 0 C 34 2, 52 14, 58 40 C 46 26, 30 22, 14 24 C 22 36, 22 50, 12 60 C 10 40, 4 26, 0 0 Z" fill="url(#mv)" stroke="${t.dark}" stroke-width="2"/>
      <circle cx="20" cy="20" r="9" fill="${t.fill}" stroke="url(#mv)" stroke-width="4"/></g>`;
  const corners = corner(I - 4, I - 4, 1, 1) + corner(W - I + 4, I - 4, -1, 1) + corner(I - 4, H - I + 4, 1, -1) + corner(W - I + 4, H - I + 4, -1, -1);
  // Title plate with a medallion for the category symbol (and, on characters, one for the generation).
  const [py0, py1] = plate, ph = py1 - py0, pm = (py0 + py1) / 2;
  const med = (cx) => `<circle cx="${cx}" cy="${pm}" r="${ph / 2 - 2}" fill="${t.fill}" stroke="url(#m)" stroke-width="7" filter="url(#sh)"/>
      <circle cx="${cx}" cy="${pm}" r="${ph / 2 - 12}" fill="none" stroke="${t.light}" stroke-width="1.5" opacity=".6"/>`;
  const plateSvg = `<rect x="${S}" y="${py0}" width="${W - 2 * S}" height="${ph}" rx="${ph / 2}" fill="url(#panel)" stroke="url(#m)" stroke-width="6" filter="url(#sh)"/>
      <rect x="${S + 9}" y="${py0 + 9}" width="${W - 2 * S - 18}" height="${ph - 18}" rx="${ph / 2 - 9}" fill="none" stroke="${t.light}" stroke-width="1.5" opacity=".45"/>
      ${med(S + ph / 2)}${medallion === 'both' ? med(W - S - ph / 2) : ''}`;
  // Text box, with a thin rule under the type line.
  const [by0, by1] = box;
  const boxSvg = `<rect x="${S}" y="${by0}" width="${W - 2 * S}" height="${by1 - by0}" rx="22" fill="url(#panel)" stroke="url(#m)" stroke-width="6" filter="url(#sh)"/>
      <rect x="${S + 9}" y="${by0 + 9}" width="${W - 2 * S - 18}" height="${by1 - by0 - 18}" rx="15" fill="none" stroke="${t.light}" stroke-width="1.5" opacity=".4"/>
      <path d="M${S + 40} ${by0 + 58}H${W - S - 40}" stroke="url(#m)" stroke-width="2" opacity=".7"/>
      <path d="M${W / 2 - 14} ${by0 + 58} l14 -9 l14 9 l-14 9 z" fill="url(#mv)"/>`;
  // Elodie: tiny stars scattered along the border band.
  let stars = '';
  if (t.stars) {
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 70; i++) {
      const side = i % 4, u = rnd();
      const x = side === 0 ? B + u * (W - 2 * B) : side === 1 ? W - B - rnd() * 18 : side === 2 ? B + u * (W - 2 * B) : B + rnd() * 18;
      const y = side === 0 ? B + rnd() * 18 : side === 1 ? B + u * (H - 2 * B) : side === 2 ? H - B - rnd() * 18 : B + u * (H - 2 * B);
      stars += `<circle cx="${x}" cy="${y}" r="${1.2 + rnd() * 1.8}" fill="#fffbe6" opacity="${0.6 + rnd() * 0.4}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${metal}</defs>${band}${stars}${corners}${plateSvg}${boxSvg}</svg>`;
}

(async () => {
  const b = await chromium.launch();
  for (const [theme, shape] of [['hand', 'card'], ['instant', 'card'], ['elodie', 'card'], ['character', 'character']]) {
    const { W, H } = SHAPES[shape];
    const p = await b.newPage({ viewport: { width: W, height: H } });
    await p.setContent(`<body style="margin:0;background:transparent">${svg(theme, shape)}</body>`);
    await p.locator('svg').screenshot({ path: `${OUT}/overlay-${theme}.png`, omitBackground: true });
    // A lighter WebP copy for the game.
    const data = fs.readFileSync(`${OUT}/overlay-${theme}.png`).toString('base64');
    const url = await p.evaluate(async d => { const im = new Image(); im.src = d; await im.decode(); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return c.toDataURL('image/webp', 0.92); }, 'data:image/png;base64,' + data);
    fs.writeFileSync(`${PUB}/overlay-${theme}.webp`, Buffer.from(url.split(',')[1], 'base64'));
    await p.close();
  }
  await b.close();
})();
