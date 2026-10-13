// Headless smoke test (guide Section 9, check 4): build, serve with `vite preview`, open Chromium,
// walk a route with the keyboard, talk to an NPC through a dialogue with a choice, hit a trigger,
// save from the menu, reload and check the position and flags came back, go through a door
// (autosave) and reload again, export a save code, try the touch overlay on a phone-sized
// landscape viewport, and take screenshots. Fails on any page error.
//
// Usage: npm run smoke            (builds first)
//        SKIP_BUILD=1 npm run smoke
//        SHOT_DIR=/some/dir npm run smoke   (where screenshots go; default: the OS temp dir)

import { execSync, spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    return require(join(execSync('npm root -g').toString().trim(), 'playwright'));
  }
}
const { chromium } = loadPlaywright();

const PORT = Number(process.env.SMOKE_PORT ?? 4183);
const URL_BASE = `http://127.0.0.1:${PORT}/`;
const SHOT_DIR = process.env.SHOT_DIR ?? tmpdir();

function check(cond, message) {
  if (!cond) throw new Error(`Smoke check failed: ${message}`);
  console.log(`  ok - ${message}`);
}

async function waitForServer(url, ms = 20000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server did not start at ${url}`);
}

const snap = (page) => page.evaluate(() => window.__quest.snapshot());

async function waitReady(page) {
  await page.waitForFunction(() => window.__quest?.ready === true, null, { timeout: 15000 });
}

/** Tap a direction key once and wait for the one-tile step to finish. */
async function step(page, key) {
  const before = await snap(page);
  await page.keyboard.press(key);
  await page.waitForFunction(
    ({ x, y }) => {
      const s = window.__quest.snapshot();
      return !s.moving && (s.x !== x || s.y !== y);
    },
    { x: before.x, y: before.y },
    { timeout: 3000 },
  );
}

async function walk(page, route) {
  for (const [key, count] of route) for (let i = 0; i < count; i++) await step(page, key);
}

/** Click through a dialogue. `choices` are the choice indexes to pick, in order. Returns the lines seen. */
async function runDialogue(page, choices = [], onChoice) {
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'dialogue', null, { timeout: 3000 });
  const lines = [];
  for (let i = 0; i < 60; i++) {
    const s = await snap(page);
    if (s.mode !== 'dialogue') return lines;
    const d = s.dialogue;
    if (!d) {
      await page.waitForTimeout(50);
      continue;
    }
    if (d.typing) {
      await page.keyboard.press('z');
    } else {
      if (lines.at(-1) !== d.text) lines.push(d.text);
      if (d.choices) {
        if (onChoice) await onChoice(d);
        const pick = choices.shift() ?? 0;
        for (let c = 0; c < pick; c++) await page.keyboard.press('ArrowDown');
        await page.waitForFunction((p) => window.__quest.snapshot().dialogue?.cursor === p, pick, { timeout: 2000 });
        await page.keyboard.press('z');
      } else {
        await page.keyboard.press('z');
      }
    }
    await page.waitForTimeout(60);
  }
  throw new Error('Dialogue did not end');
}

async function menuSelect(page, label) {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'menu', null, { timeout: 2000 });
  const { menu } = await snap(page);
  const index = menu.items.findIndex((t) => t.startsWith(label));
  if (index < 0) throw new Error(`No menu item ${label}`);
  for (let i = 0; i < index; i++) await page.keyboard.press('ArrowDown');
  await page.waitForFunction((i) => window.__quest.snapshot().menu?.cursor === i, index, { timeout: 2000 });
  await page.keyboard.press('z');
}

function watchErrors(page, errors) {
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
}

async function main() {
  if (!process.env.SKIP_BUILD) {
    console.log('Building...');
    const b = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
    if (b.status !== 0) throw new Error('Build failed');
  }

  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore',
    detached: true,
  });
  const stopServer = () => {
    try {
      process.kill(-server.pid, 'SIGTERM');
    } catch {
      // already gone
    }
  };

  const browser = await chromium.launch();
  const errors = [];
  try {
    await waitForServer(URL_BASE);

    // ---- Desktop, keyboard ------------------------------------------------------------------
    console.log('Desktop (keyboard):');
    const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await desktop.newPage();
    watchErrors(page, errors);
    await page.goto(URL_BASE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitReady(page);

    let s = await snap(page);
    check(s.mapId === 'test-village' && s.x === 6 && s.y === 6 && s.era === 'present', 'new game starts at the start spawn in the present');
    const zoom = await page.evaluate(() => {
      const c = document.querySelector('#game canvas');
      return { w: c.getBoundingClientRect().width, h: c.getBoundingClientRect().height };
    });
    check(zoom.w === 1200 && zoom.h === 800, `canvas is integer-scaled 240x160 x5 (${zoom.w}x${zoom.h})`);

    // Walk to the villager by the well and face them.
    await walk(page, [['ArrowDown', 1], ['ArrowRight', 5], ['ArrowDown', 2]]);
    s = await snap(page);
    check(s.x === 11 && s.y === 9, 'walked the route to 11,9');
    await page.keyboard.press('ArrowDown'); // blocked by the villager: turn only
    await page.waitForTimeout(150);
    s = await snap(page);
    check(s.x === 11 && s.y === 9 && s.facing === 'down', 'the NPC blocks movement');

    await page.keyboard.press('z');
    let shotTaken = false;
    const first = await runDialogue(page, [0], async (d) => {
      check(d.choices.join('|') === 'Yes, please.|Not now.', 'dialogue offers two choices');
      if (!shotTaken) {
        await page.screenshot({ path: join(SHOT_DIR, 'quest-desktop.png') });
        shotTaken = true;
      }
    });
    check(first[0] === 'Oh, hello! You must be new to this test village.', 'villager greets on first talk');
    check(first.includes('Hold B (or Shift) while you walk to run. Saves a lot of time!'), 'the chosen branch plays');
    s = await snap(page);
    check(s.flags['villager.met'] === true && s.flags['villager.answer'] === 'yes', 'dialogue set the flags');

    await page.keyboard.press('z');
    const second = await runDialogue(page);
    check(second[0] === 'Back again? Remember: hold B to run.', 'conditional line on second talk');
    check(second.includes('The Temple Keeper up north likes visitors.'), 'notFlag line shows');

    // Walk to the plaza; the trigger plays the sign once.
    await walk(page, [['ArrowUp', 2], ['ArrowRight', 5], ['ArrowDown', 1]]);
    const sign = await runDialogue(page);
    check(sign[0].startsWith('TEST PLAZA'), 'stepping on the trigger plays its dialogue');
    s = await snap(page);
    check(s.flags['sign.plaza_read'] === true, 'trigger set its flag');
    check(s.toast === 'Autosaved', 'trigger autosaved');
    check((await page.evaluate(() => localStorage.getItem('bloodlines-quest.save')))?.startsWith('BQ1.'), 'a save code is in localStorage');

    // Into the Echo Zone: the echo action is not built yet.
    await walk(page, [['ArrowDown', 1]]);
    await page.keyboard.press('e');
    await page.waitForFunction(() => window.__quest.snapshot().toast === 'Echo: not yet', null, { timeout: 2000 });
    check((await snap(page)).era === 'present', 'echo action only reports "not yet"');

    // Collision layer: the well at 12,10 blocks a step down from 12,9.
    await walk(page, [['ArrowUp', 2], ['ArrowLeft', 4], ['ArrowDown', 2]]);
    s = await snap(page);
    check(s.x === 12 && s.y === 9, 'walked to 12,9');
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(400);
    s = await snap(page);
    check(s.x === 12 && s.y === 9 && s.facing === 'down', 'the well (collision layer) blocks movement');

    // Save from the menu, then reload.
    await menuSelect(page, 'Save');
    await page.waitForFunction(() => window.__quest.snapshot().toast === 'Saved', null, { timeout: 2000 });
    const saved = await snap(page);
    await page.reload();
    await waitReady(page);
    const restored = await snap(page);
    check(restored.x === saved.x && restored.y === saved.y && restored.facing === saved.facing, `position restored after reload (${restored.x},${restored.y})`);
    check(JSON.stringify(restored.flags) === JSON.stringify(saved.flags), 'flags restored after reload');

    // Through the house door: autosave on the door, then reload.
    await walk(page, [['ArrowUp', 2], ['ArrowLeft', 6], ['ArrowUp', 3]]);
    s = await snap(page);
    check(s.x === 22 && s.y === 17 && s.facing === 'up', 'the door took the player inside the house');
    await page.reload();
    await waitReady(page);
    s = await snap(page);
    check(s.x === 22 && s.y === 17, 'door autosave restored after reload');

    // Export save code.
    await menuSelect(page, 'Export save code');
    await page.waitForSelector('.code-dialog textarea');
    const code = await page.inputValue('.code-dialog textarea');
    check(/^BQ1\.[A-Za-z0-9_-]+\.[0-9a-f]{8}$/.test(code), `export shows a save code (${code.length} chars)`);
    await page.click('.code-dialog button:has-text("Close")');
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'menu');

    // Import a damaged code is refused; importing the real one works.
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
    await menuSelect(page, 'Import save code');
    await page.waitForSelector('.code-dialog textarea');
    await page.fill('.code-dialog textarea', code.slice(0, -1) + (code.endsWith('0') ? '1' : '0'));
    await page.click('.code-dialog button:has-text("Load")');
    check((await page.textContent('.code-error')).includes('checksum'), 'a damaged code is refused');
    await page.fill('.code-dialog textarea', code);
    await page.click('.code-dialog button:has-text("Load")');
    await page.waitForFunction(() => window.__quest?.snapshot().toast === 'Save code loaded', null, { timeout: 3000 });
    check((await snap(page)).x === 22, 'importing the code restores the game');
    await desktop.close();

    // ---- Phone, landscape, touch ------------------------------------------------------------
    console.log('Phone (touch, landscape 844x390):');
    const phone = await browser.newContext({
      viewport: { width: 844, height: 390 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const ppage = await phone.newPage();
    watchErrors(ppage, errors);
    await ppage.goto(URL_BASE);
    await waitReady(ppage);
    check(await ppage.isVisible('.touch-overlay'), 'touch overlay shows on a touch device');
    const sizes = await ppage.evaluate(() =>
      [...document.querySelectorAll('.touch-btn, .touch-small, .touch-dpad')].map((e) => {
        const r = e.getBoundingClientRect();
        return Math.min(r.width, r.height);
      }),
    );
    check(sizes.every((v) => v >= 44), `every touch target is at least 44 px (${sizes.join(', ')})`);
    s = await snap(ppage);
    check(s.x === 6 && s.y === 6, 'fresh phone context starts a new game');
    // Hold the right arm of the D-pad until one step lands.
    const pad = await ppage.locator('.touch-dpad').boundingBox();
    const cdp = await phone.newCDPSession(ppage);
    const touch = (type, x, y) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
    await touch('touchStart', pad.x + pad.width * 0.85, pad.y + pad.height / 2);
    await ppage.waitForFunction(() => window.__quest.snapshot().x > 6, null, { timeout: 3000 });
    await touch('touchEnd');
    await ppage.waitForFunction(() => !window.__quest.snapshot().moving, null, { timeout: 3000 });
    s = await snap(ppage);
    check(s.y === 6 && s.x > 6 && s.facing === 'right', `the touch D-pad moves the player (to ${s.x},${s.y})`);
    await ppage.locator('.touch-dpad').tap({ position: { x: pad.width / 2, y: pad.height * 0.9 } });
    await ppage.waitForFunction(() => window.__quest.snapshot().facing === 'down', null, { timeout: 3000 });
    await ppage.waitForFunction(() => !window.__quest.snapshot().moving);
    await ppage.locator('.touch-small.touch-menu').tap();
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'menu', null, { timeout: 2000 });
    check(true, 'the touch Menu button opens the menu');
    await ppage.locator('.touch-b').tap();
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
    check(true, 'the touch B button closes the menu');
    await ppage.screenshot({ path: join(SHOT_DIR, 'quest-phone.png') });
    await phone.close();

    // ---- Phone, portrait (still playable, with a rotate hint) -------------------------------
    const portrait = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const pp = await portrait.newPage();
    watchErrors(pp, errors);
    await pp.goto(URL_BASE);
    await waitReady(pp);
    check(await pp.isVisible('.rotate-hint'), 'portrait shows the rotate hint');
    await pp.screenshot({ path: join(SHOT_DIR, 'quest-phone-portrait.png') });
    await portrait.close();

    check(errors.length === 0, `no page errors${errors.length ? `:\n${errors.join('\n')}` : ''}`);
    console.log(`Screenshots: ${['quest-desktop.png', 'quest-phone.png', 'quest-phone-portrait.png'].map((f) => join(SHOT_DIR, f)).join(', ')}`);
    console.log('Smoke test passed.');
  } finally {
    await browser.close();
    stopServer();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
