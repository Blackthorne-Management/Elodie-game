// Renders scripts/icon.svg to the PNG icons in public/. Run: node scripts/make-icons.cjs
// Needs Playwright with Chromium (npm i -D playwright, or a global install).
const fs = require('fs');
const path = require('path');
let pw;
try { pw = require('playwright'); } catch {
  pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));
}

const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'), 'utf8');
const out = path.join(__dirname, '..', 'public');
const icons = [
  { file: 'icon-192.png', size: 192, pad: 0 },
  { file: 'icon-512.png', size: 512, pad: 0 },
  { file: 'apple-touch-icon.png', size: 180, pad: 0 },
  { file: 'icon-maskable-512.png', size: 512, pad: 0.1 },   // art inside the 80% safe zone
];

(async () => {
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  for (const { file, size, pad } of icons) {
    await page.setViewportSize({ width: size, height: size });
    const inner = Math.round(size * (1 - 2 * pad));
    await page.setContent(`<body style="margin:0;background:#5a1620;display:grid;place-items:center;height:${size}px">
      <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body>`);
    await page.screenshot({ path: path.join(out, file) });
    console.log('wrote', file);
  }
  await browser.close();
})();
