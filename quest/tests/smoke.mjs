// Headless smoke test (guide Section 9, check 4): build, serve with `vite preview`, open Chromium.
//
// 1. Phase 1 checks on the test village (?map=test-village): walk with the keyboard, talk through a
//    dialogue with a choice, hit a trigger, swap into the Echo and back, save from the menu, reload
//    and check the position and flags came back, go through a door (autosave) and reload again,
//    export and import a save code, the touch overlay on a phone-sized landscape viewport: the
//    analog stick (drag right, then up-right for a diagonal step; it floats to where the thumb lands).
//    At several landscape phone sizes: the canvas, and every touch control, inside the visible
//    viewport, no page scroll, no zoom on double taps; the full-screen toggle (desktop, iPhone help,
//    hidden when opened from the home screen) and the manifest. Screenshots quest-fit-<w>x<h>.png.
// 2. Anissa's hints (?hintms= shortens the wait), turning them off, and the Journal.
// 3. The whole of Act I, Zetwal, from a new game, by the scripted route routes/zetwal-act1.json.
//    The headless simulator (src/engine/sim.ts) replays the same route alongside, so after every key
//    the browser must show exactly the map, tile, facing, era, mode and dialogue line it predicts.
//    The route includes a diagonal step (two keys at once). At the route's @markers it checks the
//    name label and markers, the lamp, the winch, the bridge before and after (and the glow the
//    Echo change leaves), and takes screenshots at desktop and landscape phone (844x390) sizes.
//
// Fails on any page error.
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

// The engine, content and maps, straight from the TypeScript sources (npm run smoke runs Node with
// --experimental-strip-types).
const { parseRoute } = await import('../src/engine/sim.ts');
const { newGameSim, readJson } = await import('../tools/sim-setup.ts');
const { ACT1 } = await import('../src/data/quests.ts');

const PORT = Number(process.env.SMOKE_PORT ?? 4183);
const URL_BASE = `http://127.0.0.1:${PORT}/`;
const VILLAGE = `${URL_BASE}?map=test-village`;
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

/** Open the menu and go to a tab (left / right). */
async function menuTab(page, tab) {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'menu', null, { timeout: 2000 });
  for (let i = 0; i < 8 && (await snap(page)).menu.tab !== tab; i++) {
    const before = (await snap(page)).menu.tab;
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction((b) => window.__quest.snapshot().menu?.tab !== b, before, { timeout: 2000 });
  }
  if ((await snap(page)).menu.tab !== tab) throw new Error(`No menu tab ${tab}`);
}

/** Open the menu and choose an item on the System tab. */
async function menuSelect(page, label) {
  await menuTab(page, 'System');
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

// ---- Fitting the screen on landscape phones, and full screen -----------------------------------

const PHONES = [
  [844, 390], // iPhone 12-15
  [932, 430], // iPhone Pro Max
  [667, 375], // iPhone SE
  [740, 360], // Android
];

async function phoneFit(browser, errors) {
  for (const [width, height] of PHONES) {
    console.log(`Phone fit (touch, landscape ${width}x${height}):`);
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    watchErrors(page, errors);
    await page.goto(VILLAGE);
    await waitReady(page);
    await page.waitForTimeout(150);
    const m = await page.evaluate(() => {
      const box = (e) => {
        const r = e.getBoundingClientRect();
        return { name: e.getAttribute('aria-label') ?? e.className, x: r.x, y: r.y, w: r.width, h: r.height };
      };
      const vv = window.visualViewport;
      const de = document.documentElement;
      return {
        vw: vv ? vv.width : innerWidth,
        vh: vv ? vv.height : innerHeight,
        canvas: box(document.querySelector('#game canvas')),
        scroll: [de.scrollWidth, de.scrollHeight, document.body.scrollWidth, document.body.scrollHeight, window.scrollX, window.scrollY],
        controls: [...document.querySelectorAll('.touch-stick, .touch-btn, .touch-small, .fs-button')].map(box),
        fs: document.querySelector('.fs-button') !== null,
      };
    });
    const inside = (b) => b.x >= 0 && b.y >= 0 && b.x + b.w <= m.vw + 0.5 && b.y + b.h <= m.vh + 0.5;
    const c = m.canvas;
    check(inside(c), `canvas ${Math.round(c.w)}x${Math.round(c.h)} at ${Math.round(c.x)},${Math.round(c.y)} lies inside the ${m.vw}x${m.vh} viewport`);
    check(c.w >= m.vw * 0.5 || c.h >= m.vh * 0.75, 'the picture fills the screen height (letterbox at the sides)');
    const [sw, sh, bw, bh, sx, sy] = m.scroll;
    check(sw <= m.vw && sh <= m.vh && bw <= m.vw && bh <= m.vh && sx === 0 && sy === 0, `the page does not scroll (${sw}x${sh})`);
    const out = m.controls.filter((b) => !inside(b));
    check(m.controls.length === 6 && out.length === 0, `all ${m.controls.length} touch controls are inside the viewport${out.length ? `: ${out.map((b) => b.name).join(', ')}` : ''}`);
    const small = m.controls.filter((b) => Math.min(b.w, b.h) < 44);
    check(small.length === 0, `every touch control is at least 44 px (${m.controls.map((b) => Math.round(Math.min(b.w, b.h))).join(', ')})`);
    check(m.fs, 'the full-screen button is there');
    const stick = m.controls[0];
    const pad = m.controls.find((b) => b.name === 'A');
    check(stick.x < m.vw / 3 && stick.y > m.vh / 2 && pad.x > m.vw / 2 && pad.y > m.vh / 2, 'stick bottom left (left third), A bottom right');
    // Quick double taps on the stick must not zoom the page.
    const zone = await page.locator('.touch-stick-zone').boundingBox();
    for (let i = 0; i < 4; i++) await page.locator('.touch-stick-zone').tap({ position: { x: zone.width / 2, y: zone.height * 0.9 } });
    const scale = await page.evaluate(() => window.visualViewport?.scale ?? 1);
    check(scale === 1, `double taps on the stick leave the page unzoomed (scale ${scale})`);
    if ((width === 844 && height === 390) || (width === 667 && height === 375)) {
      const name = `quest-fit-${width}x${height}.png`;
      await page.screenshot({ path: join(SHOT_DIR, name) });
      fitShots.push(name);
    }
    await ctx.close();
  }
}

async function fullscreenToggle(browser, errors) {
  console.log('Full screen (desktop):');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  // Headless Chromium may refuse real full screen, so count the calls and fake the state.
  await page.addInitScript(() => {
    window.__fsCalls = { enter: 0, exit: 0 };
    let on = null;
    Object.defineProperty(Document.prototype, 'fullscreenElement', { configurable: true, get: () => on });
    Element.prototype.requestFullscreen = function () {
      window.__fsCalls.enter++;
      on = this;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    };
    Document.prototype.exitFullscreen = function () {
      window.__fsCalls.exit++;
      on = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    };
  });
  await page.goto(VILLAGE);
  await waitReady(page);
  const button = page.locator('.fs-button');
  check(await button.isVisible(), 'the full-screen button shows on desktop');
  await button.click();
  let calls = await page.evaluate(() => window.__fsCalls);
  check(calls.enter === 1, 'the button calls requestFullscreen');
  check((await button.getAttribute('aria-label')) === 'Exit full screen', 'the button turns into Exit full screen');
  await button.click();
  calls = await page.evaluate(() => window.__fsCalls);
  check(calls.exit === 1, 'pressing it again leaves full screen');
  await menuSelect(page, 'Full screen');
  await page.waitForFunction(() => window.__fsCalls.enter === 2, null, { timeout: 2000 }).catch(() => {});
  calls = await page.evaluate(() => window.__fsCalls);
  check(calls.enter === 2 && (await snap(page)).mode === 'field', 'the Full screen menu item calls requestFullscreen and closes the menu');
  await ctx.close();

  console.log('Full screen (iPhone, no Fullscreen API):');
  const ios = await browser.newContext({
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  });
  const ip = await ios.newPage();
  watchErrors(ip, errors);
  await ip.addInitScript(() => {
    delete Element.prototype.requestFullscreen;
    delete Element.prototype.webkitRequestFullscreen;
  });
  await ip.goto(VILLAGE);
  await waitReady(ip);
  await ip.locator('.fs-button').tap();
  const help = await ip.textContent('.fs-help');
  check(help.includes('Add to Home Screen'), 'on iPhone the button explains Add to Home Screen');
  await ip.locator('.fs-help button').tap();
  check((await ip.locator('.fs-help').count()) === 0, 'the explanation closes');
  await ios.close();

  console.log('Home-screen app (standalone):');
  const app = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const ap = await app.newPage();
  watchErrors(ap, errors);
  await ap.addInitScript(() => Object.defineProperty(Navigator.prototype, 'standalone', { configurable: true, get: () => true }));
  await ap.goto(VILLAGE);
  await waitReady(ap);
  check((await ap.locator('.fs-button').count()) === 0, 'opened from the home screen, there is no full-screen button');
  const manifest = await (await fetch(new URL('manifest.webmanifest', URL_BASE))).json();
  check(manifest.display === 'fullscreen' && manifest.orientation === 'landscape' && manifest.start_url === './', 'the manifest opens full screen, landscape, at ./');
  for (const icon of [...manifest.icons.map((i) => i.src), 'icons/apple-touch-icon.png']) {
    const r = await fetch(new URL(icon, URL_BASE));
    check(r.ok && r.headers.get('content-type')?.includes('png'), `icon ${icon} is served`);
  }
  await app.close();
}

const fitShots = [];

// ---- Anissa's hints and the Journal --------------------------------------------------------------

async function finishDialogue(page) {
  for (let i = 0; i < 200; i++) {
    const s = await snap(page);
    if (s.mode !== 'dialogue') return;
    await page.keyboard.press('z');
    await page.waitForTimeout(30);
  }
  throw new Error('Dialogue did not end');
}

async function hintsAndJournal(browser, errors) {
  console.log("Anissa's hints and the Journal:");
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(`${URL_BASE}?hintms=1200`);
  await waitReady(page);
  let s = await snap(page);
  check(s.mapId === 'zetwal-town' && s.mode === 'dialogue', 'a new game opens in Zetwal with the festival scene');
  await finishDialogue(page);
  const first = ACT1.objectives[0];
  await page.waitForFunction((h) => window.__quest.snapshot().hint === h, first.hints[0], { timeout: 5000 });
  check(true, `after being stuck, Anissa offers a hint ("${first.hints[0]}")`);
  await page.waitForFunction((h) => window.__quest.snapshot().hint === h, first.hints[1], { timeout: 5000 });
  check(true, 'her hints escalate');
  await menuSelect(page, "Anissa's hints");
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items.some((t) => t === "Anissa's hints: Off"), null, { timeout: 2000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2600);
  s = await snap(page);
  check(s.hint === first.hints[1] && s.mode === 'field', 'turned off in the menu, she stays quiet');
  check(s.minimap === 'Zetwal: Festival Plaza', `the minimap names the place ("${s.minimap}")`);
  await menuTab(page, 'Status');
  s = await snap(page);
  check(s.menu.items.join(',') === 'Gianna,Anissa', `the menu's Status page shows the party (${s.menu.items.join(', ')})`);
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuTab(page, 'Journal');
  s = await snap(page);
  check(s.menu.journal.some((l) => l === `Now: ${first.title}`), `the Journal lists the current objective ("${first.title}")`);
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await ctx.close();
}

// ---- Act I, Zetwal ------------------------------------------------------------------------------

const KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', confirm: 'KeyZ', cancel: 'KeyX', echo: 'KeyE' };

/** A diagonal press: both arrow keys down in the same instant (one task, so no frame runs between), then up. */
async function pressDiagonal(page, cmd) {
  const codes = cmd.split('-').map((d) => KEYS[d]);
  await page.evaluate((cs) => {
    for (const code of cs) window.dispatchEvent(new KeyboardEvent('keydown', { code, key: code, bubbles: true }));
    for (const code of cs) window.dispatchEvent(new KeyboardEvent('keyup', { code, key: code, bubbles: true }));
  }, codes);
}

/** What the browser must show once the last key has played out, from the simulator. */
function expected(sim) {
  const p = sim.logic.state.player;
  const view = sim.logic.view();
  return {
    mapId: p.mapId,
    x: p.pos.x,
    y: p.pos.y,
    facing: p.facing,
    era: p.era,
    mode: sim.logic.mode,
    text: sim.logic.mode === 'dialogue' && view.kind !== 'end' ? view.text : null,
  };
}

async function waitMatch(page, exp, what) {
  try {
    await page.waitForFunction(
      (e) => {
        try {
          const s = window.__quest?.snapshot();
          if (!s || s.moving) return false;
          return (
            s.mapId === e.mapId && s.x === e.x && s.y === e.y && s.facing === e.facing && s.era === e.era && s.mode === e.mode &&
            (e.text === null || (s.dialogue && s.dialogue.text === e.text))
          );
        } catch {
          return false;
        }
      },
      exp,
      { timeout: 6000 },
    );
  } catch {
    const s = await snap(page).catch(() => null);
    throw new Error(`Browser and simulator disagree after ${what}.\nexpected ${JSON.stringify(exp)}\nbrowser  ${JSON.stringify(s && { ...s, flags: undefined })}`);
  }
}

/** Let the game run a couple of frames (a key pressed now has been read after this). */
const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

/** Press A until the typewriter has finished the current line. */
async function finishTyping(page) {
  for (let i = 0; i < 10; i++) {
    const s = await snap(page);
    if (!s.dialogue?.typing) return s;
    await page.keyboard.press('KeyZ');
    await page.waitForFunction(() => !window.__quest.snapshot().dialogue?.typing, null, { timeout: 3000 }).catch(() => {});
  }
  return snap(page);
}

async function shoot(page, name, shots) {
  await page.waitForTimeout(450); // let swaps, flashes and fades settle
  const desktop = `quest3-${name}-desktop.png`;
  const phone = `quest3-${name}-phone.png`;
  await page.screenshot({ path: join(SHOT_DIR, desktop) });
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(SHOT_DIR, phone) });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(150);
  shots.push(desktop, phone);
}

/** What must show at some of the route's markers (the label, markers, the bridge's states, the glow). */
async function markChecks(page, sim, name) {
  await page.waitForFunction(() => !window.__quest.snapshot().moving, null, { timeout: 3000 });
  await page.waitForTimeout(80);
  const s = await snap(page);
  const label = sim.logic.targetAhead()?.name ?? null;
  check(s.label === label, `@${name}: the name label shows ${label === null ? 'nothing' : `"${label}"`}`);
  const markers = sim.logic.markers().map((m) => m.id).sort();
  check(JSON.stringify(s.markers) === JSON.stringify(markers), `@${name}: markers over ${markers.join(', ') || 'nothing'}`);
  if (name === 'diagonal') check(s.x === 10 && s.y === 8 && s.facing === 'up-right', 'two keys at once take diagonal steps (to 10,8)');
  if (name === 'bridge-after') {
    check(s.glowing.includes('chain_bridge') && s.glowing.includes('pawl_pinned'), 'back from the Echo, the lowered bridge and the pinned pawl glow');
    check(s.toast.startsWith('Something changed'), `a toast says so ("${s.toast}")`);
    check(s.flags['anchor.chain_bridge'] === true, 'the bridge is down in the present');
  }
  if (name === 'bridge-before') check(s.flags['anchor.chain_bridge'] !== true, 'the bridge is still raised');
}

async function playAct(browser, errors) {
  console.log('Act I, Zetwal (scripted route, checked against the simulator after every key):');
  const route = parseRoute(readJson('routes/zetwal-act1.json'));
  const sim = newGameSim();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(URL_BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await waitReady(page);
  await waitMatch(page, expected(sim), 'the start');
  await page.keyboard.down('Shift'); // run

  const shots = [];
  let anissaShot = false;
  let keys = 0;
  const started = Date.now();
  for (const item of route) {
    if (item.kind === 'mark') {
      await markChecks(page, sim, item.name);
      await shoot(page, item.name, shots);
      continue;
    }
    for (const cmd of sim.expand(item)) {
      const mode = sim.logic.mode;
      if (cmd === 'skip') {
        sim.press('skip');
        for (let i = 0; i < 300; i++) {
          const s = await finishTyping(page);
          if (s.mode !== 'dialogue') break;
          if (!anissaShot && s.dialogue?.speaker === 'Anissa') {
            anissaShot = true;
            await page.keyboard.up('Shift');
            await shoot(page, 'anissa-dialogue', shots);
            await page.keyboard.down('Shift');
          }
          await page.keyboard.press('KeyZ');
          keys++;
          await frames(page);
        }
      } else {
        if (mode === 'dialogue' && (cmd === 'confirm' || cmd === 'cancel')) await finishTyping(page);
        sim.press(cmd);
        if (cmd.includes('-')) await pressDiagonal(page, cmd);
        else await page.keyboard.press(KEYS[cmd]);
        keys++;
        await frames(page);
      }
      await waitMatch(page, expected(sim), `${cmd} (route: ${JSON.stringify(item)})`);
    }
  }
  await page.keyboard.up('Shift');
  const s = await snap(page);
  check(s.flags['act1.complete'] === true && s.flags['card.act1_end'] === true, `played Act I to the end card in the browser (${keys} keys, ${Math.round((Date.now() - started) / 1000)} s)`);
  check(s.flags['anchor.chain_bridge'] === true && s.flags['story.bridge_crossed'] === true, 'the bridge puzzle was solved through the Echo and its anchor');
  check(Object.keys(s.flags).every((f) => !f.startsWith('echo.')), 'no memory-only flags leaked into the present');
  await menuTab(page, 'Journal');
  const journal = (await snap(page)).menu.journal;
  check(journal.some((l) => l.startsWith('Something changed: The Chain Bridge')), 'the Journal notes "Something changed: The Chain Bridge ..."');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuSelect(page, 'Credits');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'journal', null, { timeout: 2000 });
  check((await snap(page)).journal[0] === 'CREDITS', 'the menu has a Credits screen');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await page.reload();
  await waitReady(page);
  const back = await snap(page);
  check(back.mapId === 'zetwal-temple' && back.flags['act1.complete'] === true, 'the autosave keeps the finished act after a reload');
  await ctx.close();
  return shots;
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
    await page.goto(VILLAGE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitReady(page);

    let s = await snap(page);
    check(s.mapId === 'test-village' && s.x === 6 && s.y === 6 && s.era === 'present', 'new game starts at the start spawn in the present');
    const zoom = await page.evaluate(() => {
      const c = document.querySelector('#game canvas');
      return { w: c.getBoundingClientRect().width, h: c.getBoundingClientRect().height };
    });
    check(zoom.w === 1280 && zoom.h === 720, `canvas is integer-scaled 320x180 x4 (${zoom.w}x${zoom.h})`);

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
    check((await page.evaluate(() => localStorage.getItem('bloodlines-quest.save')))?.startsWith('BQ2.'), 'a save code is in localStorage');

    // Outside an Echo Zone the swap is refused; inside, it swaps to the Echo and back, keeping the tile.
    await page.keyboard.press('e');
    await page.waitForFunction(() => window.__quest.snapshot().toast === 'Nothing echoes here.', null, { timeout: 2000 });
    check((await snap(page)).era === 'present', 'echo is refused outside an Echo Zone');
    await walk(page, [['ArrowDown', 1]]);
    const inZone = await snap(page);
    await page.keyboard.press('e');
    await page.waitForFunction(() => window.__quest.snapshot().era === 'echo', null, { timeout: 2000 });
    s = await snap(page);
    check(s.x === inZone.x && s.y === inZone.y && s.echoFilter && s.toast === 'Echo: fifty years ago', 'echo swaps inside the zone, keeps the tile, turns on the filter');
    await page.keyboard.press('e');
    await page.waitForFunction(() => window.__quest.snapshot().era === 'present', null, { timeout: 2000 });
    check(!(await snap(page)).echoFilter, 'echo swaps back to the present');

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
    check(/^BQ2\.[A-Za-z0-9_-]+\.[0-9a-f]{8}$/.test(code), `export shows a save code (${code.length} chars)`);
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
    await ppage.goto(VILLAGE);
    await waitReady(ppage);
    check(await ppage.isVisible('.touch-overlay'), 'touch overlay shows on a touch device');
    const sizes = await ppage.evaluate(() =>
      [...document.querySelectorAll('.touch-btn, .touch-small, .touch-stick')].map((e) => {
        const r = e.getBoundingClientRect();
        return Math.min(r.width, r.height);
      }),
    );
    check(sizes.every((v) => v >= 44), `every touch target is at least 44 px (${sizes.join(', ')})`);
    s = await snap(ppage);
    check(s.x === 6 && s.y === 6, 'fresh phone context starts a new game');
    // The analog stick: put a thumb down in the left third, drag right (walk right), then up-right
    // (a diagonal step), then release.
    const rest = await ppage.locator('.touch-stick').boundingBox();
    const zone = await ppage.locator('.touch-stick-zone').boundingBox();
    const cdp = await phone.newCDPSession(ppage);
    const touch = (type, x, y) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
    const t0 = { x: zone.x + zone.width * 0.55, y: zone.y + zone.height * 0.45 };
    await touch('touchStart', t0.x, t0.y);
    const moved = await ppage.locator('.touch-stick').boundingBox();
    check(
      Math.abs(moved.x + moved.width / 2 - t0.x) < 2 && Math.abs(moved.y + moved.height / 2 - t0.y) < 2 && Math.abs(moved.x - rest.x) > 10,
      'the stick ring jumps to where the thumb lands (floating stick)',
    );
    s = await snap(ppage);
    check(s.x === 6 && s.y === 6 && !s.moving, 'a thumb resting inside the dead zone does not move');
    // Walk right past the house corner (the wall at 8,5 would refuse a diagonal there), then lean up-right.
    await touch('touchMove', t0.x + 30, t0.y);
    await ppage.waitForFunction(() => window.__quest.snapshot().x >= 9, null, { timeout: 4000 });
    await touch('touchMove', t0.x + 30, t0.y - 30);
    const before = await snap(ppage);
    await ppage.waitForFunction(
      ({ x, y }) => {
        const q = window.__quest.snapshot();
        return q.facing === 'up-right' && q.y < y && q.x > x;
      },
      { x: before.x, y: before.y },
      { timeout: 4000 },
    );
    check(true, 'leaning the stick up-right walks diagonally');
    const knob = await ppage.evaluate(() => getComputedStyle(document.querySelector('.touch-stick-knob')).transform);
    check(knob !== 'none', `the knob follows the thumb (${knob})`);
    await ppage.screenshot({ path: join(SHOT_DIR, 'quest3-stick-phone.png') });
    await touch('touchEnd');
    await ppage.waitForFunction(() => !window.__quest.snapshot().moving, null, { timeout: 3000 });
    s = await snap(ppage);
    const back = await ppage.locator('.touch-stick').boundingBox();
    check(Math.abs(back.x - rest.x) < 1 && Math.abs(back.y - rest.y) < 1, `released, the stick returns to rest (the player stopped at ${s.x},${s.y})`);
    // A quick flick down still turns (and steps) the player.
    await touch('touchStart', t0.x, t0.y);
    await touch('touchMove', t0.x, t0.y + 40);
    await ppage.waitForFunction(() => window.__quest.snapshot().facing === 'down', null, { timeout: 3000 });
    await touch('touchEnd');
    await ppage.waitForFunction(() => !window.__quest.snapshot().moving);
    await ppage.locator('.touch-small.touch-menu').tap();
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'menu', null, { timeout: 2000 });
    check(true, 'the touch Menu button opens the menu');
    await ppage.locator('.touch-b').tap();
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
    check(true, 'the touch B button closes the menu');
    await ppage.screenshot({ path: join(SHOT_DIR, 'quest-phone.png') });
    await phone.close();

    await phoneFit(browser, errors);
    await fullscreenToggle(browser, errors);

    // ---- Phone, portrait (still playable, with a rotate hint) -------------------------------
    const portrait = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const pp = await portrait.newPage();
    watchErrors(pp, errors);
    await pp.goto(VILLAGE);
    await waitReady(pp);
    check(await pp.isVisible('.rotate-hint'), 'portrait shows the rotate hint');
    await pp.screenshot({ path: join(SHOT_DIR, 'quest-phone-portrait.png') });
    await portrait.close();

    await hintsAndJournal(browser, errors);
    const actShots = await playAct(browser, errors);

    check(errors.length === 0, `no page errors${errors.length ? `:\n${errors.join('\n')}` : ''}`);
    console.log(`Screenshots: ${['quest-desktop.png', 'quest-phone.png', 'quest3-stick-phone.png', 'quest-phone-portrait.png', ...fitShots, ...actShots].map((f) => join(SHOT_DIR, f)).join(', ')}`);
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
