// Headless smoke test (guide Section 9, check 4): build, serve with `vite preview`, open Chromium.
//
// 1. Phase 1 checks on the test village (?map=test-village): walk with the keyboard, talk through a
//    dialogue with a choice, hit a trigger, swap into the Echo and back, save from the menu, reload
//    and check the position and flags came back, go through a door (autosave) and reload again,
//    export and import a save code, the touch overlay on a phone-sized landscape viewport: the
//    D-pad (right, then between up and right for a diagonal), tap to move and tap a person to talk.
//    At several landscape phone sizes: the canvas, and every touch control, inside the visible
//    viewport, no page scroll, no zoom on double taps; the full-screen toggle (desktop, iPhone help,
//    hidden when opened from the home screen) and the manifest. Screenshots quest-fit-<w>x<h>.png.
// 2. Anissa's hints (?hintms= shortens the wait), turning them off, and the Journal.
// 3. Chapters 1 to 12 and the Epilogue, from a new game, by the scripted route routes/zetwal-act1.json (each chapter's
//    end, from Chapter 3 on, checks its story flags against the simulator's, its fights, the party and its card in the
//    browser; at the end, the verdict saved, The End, the cast and the credits, then the title, and the save complete).
//    The headless simulator (src/engine/sim.ts) replays the same route alongside, so after every key
//    the browser must show exactly the map, tile, facing, era, mode and dialogue line it predicts.
//    At Chapter 7's petition (@kirinoura-petition) a second window plays a side quest built Oct 27 from the same save:
//    K-4 The Letter in the Floor (the floor-maker, Lady Sayo's House, the tune in the memory, the nail, the singing floor
//    walked, the lacquer box and the Nightingale Key's showcase), the simulator predicting every key. At Chapter 3's
//    @old-benny another plays the secret Ar-4 The Old Lord's Errand (the cloister crossed in two eras past the watches,
//    the bolt, the iron box and La Promesa de Benny's showcase).
//    At Chapter 9's Assize (@aldermoor-assize) a second window plays on from the same save and loses the Hushed on
//    purpose: the party stays by the dock (the court sits on), and the dock's edge starts the fight again.
//    The route includes a diagonal step (two keys at once). At the route's @markers it checks the
//    name label and markers, the lamp, the winch, the bridge before and after (and the glow the
//    Echo change leaves), and takes screenshots at desktop and landscape phone (844x390) sizes.
//    The route wins every fight; if the bot loses one by accident (each battle's dice come from the clock),
//    the goddess's Game Over screen opens: the bot skips to Rise, walks back on (or meets the foe again) and
//    fights it again, and says so in the log.
// 4. Game Over on purpose (scenes/GameOverScene.ts): on a phone, lose the boar (a test-only switch makes the
//    party fall), see the goddess's first meeting (the six lines, the count 1), screenshots both ways, Rise
//    (44 px), stand one tile west of the boar's line, reload (the count kept), walk on: no tutorial pages, the
//    Grudge +10%; lose again and Skip: the count 2; Rise, and win with +20%.
//
// Fails on any page error.
//
// Usage: npm run smoke            (builds first)
//        SKIP_BUILD=1 npm run smoke
//        SHOT_DIR=/some/dir npm run smoke   (where screenshots go; default: the OS temp dir)
//        SMOKE_UNTIL=kirinoura-petition         (stop the route at that marker; with SMOKE_FROM, a quick look at one
//                                                  stretch and the second windows it captured)
//        SMOKE_FROM=chapter2-end npm run smoke   (only the scripted route, from that marker: the simulator plays
//                                                  up to it, and the browser loads its save there)
//        SMOKE_TO=yucayeque npm run smoke        (everything as usual, but the scripted route stops at that marker:
//                                                  @yucayeque is Chapter 1's end, after the voyage; with SMOKE_FROM too,
//                                                  the route between the two markers)

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
const { decodeSave, encodeSave } = await import('../src/engine/save.ts');
const { newGameSim, readJson, savedSim } = await import('../tools/sim-setup.ts');
const { toSaveData } = await import('../src/engine/state.ts');
const { markShown, pendingShowcases } = await import('../src/engine/showcase.ts');
const { RPG } = await import('../src/data/rpg.ts');
const { partyMembers } = await import('../src/engine/rpg.ts');
const { FlagStore } = await import('../src/engine/flags.ts');
const { ACT1 } = await import('../src/data/quests.ts');
const { ENEMIES, battleDef } = await import('../src/data/battles.ts');
const { GODDESS_WORDS } = await import('../src/data/gameOver.ts');
const { SIDE_QUESTS } = await import('../src/data/sideQuests.ts');
const { settleRewards } = await import('../src/engine/sideQuests.ts');
const { settleDebates } = await import('../src/engine/debate.ts');
const { DEBATES } = await import('../src/data/debates.ts');
const { addSharedXp, pillarFlag } = await import('../src/engine/rpg.ts');
const { ending, stability } = await import('../src/engine/stability.ts');
const { STABILITY_HOUSES } = await import('../src/data/claim.ts');

/**
 * Pay what the field pays (FieldScene.checkProgress, at each sync once a scene is over): finished side quests and
 * settled debates. The headless simulator has no field, so on its own it plays the low line (no rewards); the smoke's
 * simulator pays them too whenever it stands in the field, so it predicts the game a player plays. Chapter 10's Muster
 * turns on it: its shares follow the purse, and with the rewards paid the buyer is exposed and turned, not sailed.
 */
function settleAsField(sim) {
  if (sim.logic.mode !== 'field') return;
  const flags = sim.logic.state.flags;
  const addPillar = (p, city, n) => {
    const f = pillarFlag(p, city);
    const v = flags.get(f);
    flags.set(f, (typeof v === 'number' ? v : 0) + n);
  };
  settleDebates(flags, DEBATES, addPillar, (n) => addSharedXp(flags, n));
  settleRewards(flags, RPG, SIDE_QUESTS);
}

const PORT = Number(process.env.SMOKE_PORT ?? 4183);
const URL_BASE = `http://127.0.0.1:${PORT}/`;
// Every check but the intro's own starts with ?intro=0 (straight into the quest), and with ?install=0 so
// the phone checks play in the browser (the install screen has its own check).
const GAME = `${URL_BASE}?intro=0&install=0`;
const VILLAGE = `${URL_BASE}?intro=0&install=0&map=test-village`;
const SHOT_DIR = process.env.SHOT_DIR ?? tmpdir();
// SMOKE_FROM=<marker> (e.g. chapter2-end): only the scripted route, from that marker of routes/zetwal-act1.json on.
const FROM = process.env.SMOKE_FROM ?? '';
// SMOKE_TO=<marker> (e.g. yucayeque, Chapter 1's end): the scripted route stops at that marker (the checks that need
// the whole quest played are left out).
const TO = process.env.SMOKE_TO ?? '';

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
        controls: [...document.querySelectorAll('.touch-dpad, .touch-btn, .touch-small, .fs-button')].map(box),
        map: document.querySelector('.side-map') ? box(document.querySelector('.side-map')) : null,
        fs: document.querySelector('.fs-button') !== null,
      };
    });
    const inside = (b) => b.x >= 0 && b.y >= 0 && b.x + b.w <= m.vw + 0.5 && b.y + b.h <= m.vh + 0.5;
    const c = m.canvas;
    check(inside(c), `canvas ${Math.round(c.w)}x${Math.round(c.h)} at ${Math.round(c.x)},${Math.round(c.y)} lies inside the ${m.vw}x${m.vh} viewport`);
    check(c.w >= m.vw * 0.5 || c.h >= m.vh * 0.5, 'the picture keeps a good size beside the control bars');
    const [sw, sh, bw, bh, sx, sy] = m.scroll;
    check(sw <= m.vw && sh <= m.vh && bw <= m.vw && bh <= m.vh && sx === 0 && sy === 0, `the page does not scroll (${sw}x${sh})`);
    const out = m.controls.filter((b) => !inside(b));
    check(m.controls.length === 7 && out.length === 0, `all ${m.controls.length} touch controls are inside the viewport${out.length ? `: ${out.map((b) => b.name).join(', ')}` : ''}`);
    const small = m.controls.filter((b) => Math.min(b.w, b.h) < 44);
    check(small.length === 0, `every touch control is at least 44 px (${m.controls.map((b) => Math.round(Math.min(b.w, b.h))).join(', ')})`);
    check(m.fs, 'the full-screen button is there');
    // Every control and the minimap sit in the black bars, never over the picture.
    const off = (b) => b.x + b.w <= c.x + 0.5 || b.x >= c.x + c.w - 0.5 || b.y + b.h <= c.y + 0.5 || b.y >= c.y + c.h - 0.5;
    const over = m.controls.filter((b) => !off(b));
    check(over.length === 0, `no control covers the picture${over.length ? `: ${over.map((b) => b.name).join(', ')}` : ''}`);
    const dpad = m.controls[0];
    const a = m.controls.find((b) => b.name === 'A');
    check(dpad.x + dpad.w <= c.x + 0.5 && a.x >= c.x + c.w - 0.5, 'the D-pad is in the left bar, A in the right bar');
    check(m.map && off(m.map) && m.map.x >= c.x + c.w - 0.5 && inside(m.map), 'the minimap is in the right bar');
    // Quick double taps on the D-pad must not zoom the page.
    for (let i = 0; i < 4; i++) await page.locator('.touch-dpad').tap({ position: { x: dpad.w / 2, y: 8 } });
    const scale = await page.evaluate(() => window.visualViewport?.scale ?? 1);
    check(scale === 1, `double taps on the D-pad leave the page unzoomed (scale ${scale})`);
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
  // Phones are shown how to install first (owner decision, Oct 16): in Safari, the install steps.
  const gate = await ios.newPage();
  watchErrors(gate, errors);
  await gate.goto(`${URL_BASE}?intro=0`);
  await gate.waitForSelector('.install-screen', { timeout: 15000 });
  const steps = await gate.textContent('.install-steps');
  check(steps.includes('Add to Home Screen') && (await gate.evaluate(() => !window.__quest)), 'an iPhone in Safari gets the install steps, and the game does not start');
  await gate.screenshot({ path: join(SHOT_DIR, 'quest-install-iphone.png') });
  await gate.setViewportSize({ width: 390, height: 844 });
  const fit = await gate.evaluate(() => {
    const de = document.documentElement;
    const s = document.querySelector('.install-screen');
    return { sw: de.scrollWidth, vw: window.innerWidth, overflowX: s.scrollWidth > s.clientWidth };
  });
  check(fit.sw <= fit.vw && !fit.overflowX, 'the install screen fits 390 px portrait without sideways scrolling');
  await gate.screenshot({ path: join(SHOT_DIR, 'quest-install-portrait.png') });
  const home = await ios.newPage();
  watchErrors(home, errors);
  await home.addInitScript(() => Object.defineProperty(Navigator.prototype, 'standalone', { configurable: true, get: () => true }));
  await home.goto(`${URL_BASE}?intro=0&map=test-village`);
  await waitReady(home);
  check((await home.locator('.install-screen').count()) === 0, 'the same iPhone, opened from the home screen, plays');
  // Done with these two: three games booting at once in one context starve each other's frames (the gate's boot below
  // timed out at 15 s on a 4-core machine, Oct 27).
  await home.close();
  await ip.close();
  // "Play here anyway" (owner decision, Oct 17): a browser that cannot install (a chat app's) still plays.
  await gate.locator('.install-anyway').tap();
  await waitReady(gate);
  check((await gate.locator('.install-screen').count()) === 0, '"Play here anyway" starts the game in Safari');
  await gate.goto(`${URL_BASE}?intro=0&map=test-village`);
  await waitReady(gate);
  check((await gate.locator('.install-screen').count()) === 0, 'and the iPhone remembers it: the link plays in the browser from then on');
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
  await page.goto(`${URL_BASE}?intro=0&install=0&hintms=1200`);
  await waitReady(page);
  let s = await snap(page);
  check(s.mapId === 'zetwal-town' && s.mode === 'dialogue', 'a new game opens in Zetwal with the festival scene');
  await finishDialogue(page);
  const first = ACT1.objectives[0];
  // The hint clock counts play time from Phaser's frame delta, which a throttled headless browser under-counts (review 1,
  // Oct 21, finding 9: a 1.2 s hint arrived after about 5 s): plenty of margin over the 1.2 s asked for.
  const HINT_WAIT_MS = 15000;
  await page.waitForFunction((h) => window.__quest.snapshot().hint === h, first.hints[0], { timeout: HINT_WAIT_MS });
  check(true, `after being stuck, Anissa offers a hint ("${first.hints[0]}")`);
  await page.waitForFunction((h) => window.__quest.snapshot().hint === h, first.hints[1], { timeout: HINT_WAIT_MS });
  check(true, 'her hints escalate');
  await menuSelect(page, "Anissa's hints");
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items.some((t) => t === "Anissa's hints: Off"), null, { timeout: 2000 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2600);
  s = await snap(page);
  check(s.hint === first.hints[1] && s.mode === 'field', 'turned off in the menu, she stays quiet');
  check(s.minimap === 'Pòdlimyè: Festival Plaza', `the minimap names the place ("${s.minimap}")`);
  await menuTab(page, 'Status');
  s = await snap(page);
  check(s.menu.items.join(',') === 'Gianna,Anissa', `the menu's Status page shows the party (${s.menu.items.join(', ')})`);
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuTab(page, 'Quests');
  s = await snap(page);
  check(s.menu.journal.some((l) => l === `Now: ${first.title}`), `the Journal lists the current objective ("${first.title}")`);
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await ctx.close();
}

// ---- Act I, Zetwal ------------------------------------------------------------------------------

const KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', confirm: 'KeyZ', cancel: 'KeyX', echo: 'KeyE' };

/**
 * A tap of the route's direction keys: down and up in the same instant (one task, so no frame runs between). A
 * diagonal is both arrows at once. A straight step is tapped the same way: with keydown and keyup sent apart, a slow
 * headless frame (50 to 100 ms in software rendering) could leave the key held past a running step's 125 ms, and the
 * game (rightly) walks on while a key is held: one step more than the route asked (seen twice on Chapter 9's heath).
 */
const STRAIGHT = new Set(['up', 'down', 'left', 'right']);
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

async function waitMatch(page, exp, what, timeout = 6000) {
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
      { timeout },
    );
  } catch {
    const s = await snap(page).catch(() => null);
    // A staged scene still acting it out (the junior priest walks the length of the Court to the back gate before
    // the line; Chapter 8): the line comes once he is there. Give it a while longer; a hung scene still fails.
    if (s?.stage?.busy && timeout === 6000) return waitMatch(page, exp, what, 20000);
    // A staged walk that ended just as the wait ran out (the man in the black coat leaves the cave; Chapter 11): the
    // browser already matches, or is about to. Check once more before calling it a disagreement.
    if (s && timeout === 6000 && !s.moving && s.mapId === exp.mapId && s.x === exp.x && s.y === exp.y && s.mode === exp.mode) {
      return waitMatch(page, exp, what, 6001);
    }
    throw new Error(`Browser and simulator disagree after ${what}.\nexpected ${JSON.stringify(exp)}\nbrowser  ${JSON.stringify(s && { ...s, flags: undefined })}`);
  }
}

/** Let the game run a couple of frames (a key pressed now has been read after this). */
const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));

/** Press A until the typewriter has finished the current line. */
async function finishTyping(page) {
  // A scene being acted out (stage directions): wait until the actors are in place and the line shows.
  await page.waitForFunction(() => !window.__quest.snapshot().stage?.busy, null, { timeout: 30000 });
  for (let i = 0; i < 10; i++) {
    const s = await snap(page);
    if (s.mode === 'showcase' || !s.dialogue?.typing) return s;
    // A line nearly typed out is left to finish by itself: A pressed just as it finishes would turn the
    // page instead, one line ahead of the simulator (a short line, "Bonjou! Kijan ou ye?", on a busy machine).
    if (s.dialogue.text.length - s.dialogue.shown.length > 25) await page.keyboard.press('KeyZ');
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
    // `glowed`, not `glowing`: the glow lasts 3.6 s, and reading the return lines can take longer on a busy machine.
    check(s.glowed.includes('chain_bridge') && s.glowed.includes('pawl_pinned'), 'back from the Echo, the lowered bridge and the pinned pawl glow');
    check(s.toast.startsWith('Something changed'), `a toast says so ("${s.toast}")`);
    check(s.flags['anchor.chain_bridge'] === true, 'the bridge is down in the present');
  }
  if (name === 'bridge-before') check(s.flags['anchor.chain_bridge'] !== true, 'the bridge is still raised');
  // Quest arrows (owner requests, Oct 17 and 18): an arrow at the screen's edge, or a marker over the stop on screen.
  if (name === 'cane-road') check(s.guide?.final === true && (s.guide.arrow || s.guide.mark), `on the Cane Road the quest arrow or marker shows the way to the boar (${JSON.stringify(s.guide)})`);
  if (name === 'square') check(!!s.guide && (s.guide.arrow || s.guide.mark), `in Accord Square the quest arrow shows the way (${JSON.stringify(s.guide)})`);
  if (name === 'square') check(!!s.sideGuide && (s.sideGuide.arrow || s.sideGuide.mark), `and a silver one shows a side quest's way (${JSON.stringify(s.sideGuide)})`);
}

/**
 * At each chapter's end (Chapters 3 to 12 and the Epilogue; Chapters 1 and 2 are checked after the route): the browser
 * has played the chapter the way the simulator did (its story flags agree with the simulator's, its fights were won, the
 * party and who walks with it), and its end card is up. (Chapter 12's card is the Claim's, `card.claim_stands`, and the
 * Epilogue's the ending's: `done` names the flag each sets, where it is not `act<n>.complete`.)
 */
async function chapterEndChecks(page, sim, name) {
  const ends = {
    'chapter3-end': {
      act: 3,
      map: 'ardencia-camp',
      party: ['gianna', 'anissa', 'yari', 'azzy'],
      flags: ['story.forge_open', 'story.trial_fought', 'story.signet_glowed', 'clue.father_rael', 'belief.rael_traitor', 'anchor.forge_gate_a', 'anchor.forge_gate_b', 'anchor.forge_gate_c', 'anchor.benny_lever', 'story.ardencia_escaped', 'ally.free_brasador', 'encounter.ardencia_story.bats.won'],
      not: ['encounter.ardencia_story.rael.won'],
      what: 'Chapter 3 in the browser: the trial lost as the story means it, the forge Echo\'s gates and lever, Azzy joined, the tunnel and the sea road to the camp',
    },
    'chapter4-end': {
      act: 4,
      map: 'aldoria-desert',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira'],
      flags: ['story.samira_joined', 'clue.sealed_seventh', 'clue.harbor_price', 'clue.brasador_coin', 'item.dorini_pass', 'anchor.vault_sunlock', 'anchor.cistern_pin', 'side.sweet_water.done', 'side.appraise.done', 'debate.aldoria_bargain.settled', 'story.coralie_met', 'story.coralie_left', 'encounter.aldoria_story.qasim.won'],
      not: [],
      what: 'Chapter 4 in the browser: Samira joined in the vault, the sun lock and the cistern pin, Qasim beaten, the seventh page sealed, the caravan',
    },
    'chapter5-end': {
      act: 5,
      map: 'seat-concourse',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira'],
      flags: ['clue.elodie_locket_line', 'clue.elodie_tested_line', 'clue.seventh_clause_read', 'anchor.ribbon_thread', 'story.hollis_agreed', 'story.terms_refused', 'side.seats.stage1', 'side.deserters.done', 'debate.seat_voices.settled', 'belief.rael_traitor', 'encounter.seat_story.deserters.won'],
      not: ['story.disguised', 'story.party_split'],
      what: 'Chapter 5 in the browser: the welcome, the bell, the sealing, the keeper, the Parley (the terms refused), the fitting and the Iron Gate',
    },
    'chapter6-end': {
      act: 6,
      map: 'skarragol-quay',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa'],
      flags: ['party.bayarmaa', 'story.bayarmaa_cleared', 'story.fjord_echoed', 'story.fjord_crossed', 'anchor.wolf_run', 'story.herd_called', 'story.grimvald_beaten', 'choice.grimvald_spared', 'story.standard_planted', 'story.standard_home', 'clue.crown_pays_raiders', 'side.grandson.done', 'side.winter_stores.done', 'debate.skarragol_oath.settled', 'choice.crown_purse_given', 'ally.skarragol', 'item.token_ironvow', 'item.torvald_letter', 'encounter.skarragol_story.wolves.won', 'encounter.skarragol_story.grimvald.won'],
      not: ['item.crown_purse'],
      what: 'Chapter 6 in the browser: Bayarmaa joined at the Moot, the fjord crossed through the Echo, the wolves and Grimvald beaten (and spared), the standard home, the horn and the Ironvow token',
    },
    'chapter7-end': {
      act: 7,
      map: 'kuroshi-pier',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru'],
      flags: ['story.kuroshi_arrived', 'story.letter_given', 'story.haru_met', 'party.haru', 'story.maze_walked', 'story.marsh_reached', 'story.causeway_lit', 'anchor.screen_peg', 'rotor.screens.solved', 'story.fox_beaten', 'choice.fox_spared', 'story.price_receipts', 'choice.petition_signed', 'choice.samira_names', 'side.spy_ledger.done', 'side.lanterns.done', 'debate.kuroshi_silence.settled', 'ally.kuroshi', 'item.token_suzumori', 'story.haru_left_kirinoura', 'encounter.kuroshi_story.moths.won', 'encounter.kuroshi_story.fox.won'],
      not: ['story.disguised'],
      what: 'Chapter 7 in the browser: the letter, Haru met and joined, the fog maze and the marsh causeway, the moths and the Fox beaten (and spared), the screens, the petition and the Suzumori token',
    },
    'chapter8-end': {
      act: 8,
      map: 'jwaladesh-harbor',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram'],
      flags: ['story.jwaladesh_arrived', 'story.court_heard', 'story.vikram_seen', 'story.vikram_challenged', 'choice.duel_lost', 'story.salt_road_cleared', 'clue.arjun_seen', 'clue.arjun_charge', 'clue.relay_route', 'anchor.chain_lamp', 'anchor.tower_mirror', 'story.tower_open', 'story.beam_at_temple', 'story.flame_seen', 'party.vikram', 'story.dhanraj_beaten', 'choice.dhanraj_spared', 'item.dhanraj_ledger', 'clue.crown_holds_oil', 'story.crane_accepted', 'choice.advances_given', 'choice.petition_jwa_signed', 'side.lamp_relay.done', 'side.anonymous_oil.done', 'debate.jwaladesh_hesitation.settled', 'ally.jwaladesh', 'item.token_agnivansh', 'story.vikram_left_agnipur', 'encounter.jwaladesh_story.salt_road.won', 'encounter.jwaladesh_story.dhanraj.won'],
      not: ['choice.duel_won', 'encounter.jwaladesh_story.duel.won', 'choice.dhanraj_broken'],
      what: 'Chapter 8 in the browser: the Court heard, the duel lost as meant, the salt road cleared, Arjun\'s night and the relay, the tower mirror and the roofs\' beam, Vikram joined at the flame, Dhanraj beaten (and spared), the price paid and the Agnivansh token',
    },
    'chapter9-end': {
      act: 9,
      map: 'aldermoor-heath',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram', 'edmund'],
      flags: ['story.aldermoor_arrived', 'story.escort_met', 'story.press_gang_seen', 'story.edmund_met', 'party.edmund', 'story.edmund_defied', 'story.sebastian_met', 'story.jordyn_seen', 'story.jordyn_offer', 'story.families_warned', 'story.chapel_seen', 'side.purge_list.done', 'side.crown_chronicle.done', 'debate.aldermoor_one_hand.settled', 'story.recital_seen', 'story.postern_open', 'story.keep_archive_entered', 'anchor.thomas_record', 'story.record_found', 'clue.crown_pact', 'item.crown_pact', 'item.thomas_record', 'item.crown_chronicle', 'story.caught', 'story.cells_night', 'story.assize_dawn', 'story.assize_opened', 'story.record_read', 'story.hushed_revealed', 'story.hushed_beaten', 'choice.hushed_tried', 'clue.hushed_regent', 'story.regent_refused', 'story.jordyn_defected', 'story.price_seen', 'ally.aldermoor_dissidents', 'encounter.aldermoor_story.press_gang.won', 'encounter.aldermoor_story.chapel.won', 'encounter.aldermoor_story.hushed.won'],
      not: ['choice.hushed_broken'],
      what: 'Chapter 9 in the browser: the Mere Stair and the escort, the press-gang and Edmund joined, Al-3\'s families warned and the bog chapel\'s cell, the purge list, the chronicle and the debate, Jordyn\'s offer, the recital and the postern, Thomas\'s record in the archive, caught, the cells, the Assize, the Hushed beaten (and tried by their law), the Regent\'s refusal, Jordyn\'s defection and the dissidents',
    },
    'chapter10-end': {
      act: 10,
      map: 'zetwal-harbor',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram', 'edmund'],
      flags: ['story.muster_begun', 'story.watch_landed', 'story.plaza_camp_seen', 'story.rahel_met', 'story.patricio_told', 'story.blessing', 'debate.zetwal_feud_temple.settled', 'debate.zetwal_feud_merchants.settled', 'debate.zetwal_feud_crown.settled', 'clue.signing_morning', 'clue.four_accounts', 'story.crew_seen', 'choice.crew_spared', 'side.muskets.done', 'side.lonely_cutter.done', 'story.ti_jak_home', 'story.council_condition', 'story.council_voted', 'story.inspection_done', 'story.chain_raised', 'story.betrayal_seen', 'story.betrayer_walked', 'muster.resolved', 'item.smugglers_ledger', 'story.fleet_sailed', 'encounter.muster_story.crew.won'],
      not: [],
      what: 'Chapter 10 in the browser: the watch landed and the Muster begun, the camp, Rahel and Patricio, the blessing, the three feuds settled, the signing, the mangrove crew beaten (and spared), the muskets and the lonely cutter, Ti Jak home, the council\'s vote, the dusk inspection, the chain raised in the night, the betrayer seen and gone, the smugglers\' ledger, and the fleet sailed',
    },
    'chapter11-end': {
      act: 11,
      map: 'xaragua-caney',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram', 'edmund'],
      flags: ['story.war_begun', 'story.landed', 'story.headland_won', 'war.flank_done', 'story.camp_reached', 'story.hill_road_taken', 'debate.xaragua_harbor.settled', 'side.ninth_thumbprint.done', 'side.harbors_lie.done', 'story.tide_called', 'story.village_reached', 'story.thorne_taken', 'story.anaco_freed', 'anchor.chain_post', 'story.chain_dropped', 'war.turn_made', 'story.harbor_taken', 'clue.ash_road_read', 'belief.rael_truth', 'story.wounded_sheltered', 'ally.xaragua', 'encounter.war_story.headland.won', 'encounter.war_story.picket.won', 'encounter.war_story.thorne.won', 'encounter.war_story.caona.won'],
      not: ['party.rael', 'belief.rael_traitor'],
      what: 'Chapter 11 in the browser: the landing, the gun on the headland, the flank, the hill camp and the elders\' debate, the Ninth Thumbprint and Harbors Lie, the tide, the village, Thorne taken, Anaco freed, the chain post\'s pin in the pier\'s memory and the chain down, the Turn, the harbor taken, the truth read by lamplight, the wounded sheltered and Xaraguá allied (Rael out of the roster, no longer believed a traitor)',
    },
    'chapter12-end': {
      act: 12,
      title: 'Chapter 12',
      done: 'story.hearing_called',
      card: 'claim_stands',
      map: 'seat-hall',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram', 'edmund'],
      flags: ['act11.complete', 'story.claim_arrived', 'story.claim_arrive_seen', 'story.elodie_rooms', 'story.rooms_seen', 'side.seats.handed', 'side.seats.done', 'story.chairs_set', 'side.volume_one.accepted', 'item.volume_one', 'debate.seat_claim.settled', 'story.bell_claim', 'story.bell_hall_seen', 'story.chair_echo_seen', 'anchor.caona_chair', 'story.chair_read', 'clue.petition_original', 'clue.petition_heard', 'story.claim_counted', 'story.claim_begun', 'story.claim_declared', 'story.regent_beaten', 'story.claim_won', 'story.regent_arrested', 'story.signet_laid', 'story.rael_surrendered', 'story.hearing_called', 'encounter.claim_story.regent.won'],
      not: ['party.rael', 'act12.complete', 'hearing.verdict', 'stability.score', 'story.hall_seated'],
      what: 'Chapter 12 in the browser: the Ash Road to the Ardencia Gate, Mother\'s rooms, the tokens handed over and the chairs set, Volume One, the corner\'s debate, the bell, the eighth chair\'s Echo and its anchor, the petition filed with the clause, the count, the Claim, the Regent beaten and arrested, Rael\'s signet laid down and the Hearing called (Rael not in the roster, no verdict and no score yet)',
    },
    'the-end': {
      act: 12,
      title: 'The Epilogue',
      done: 'act12.complete',
      card: null,
      map: 'seat-hall',
      party: ['gianna', 'anissa', 'yari', 'azzy', 'samira', 'bayarmaa', 'haru', 'vikram', 'edmund'],
      flags: ['story.hearing_called', 'story.arrivals_seen', 'story.hearing_arrived', 'story.hearing_seen', 'story.hearing_heard', 'side.volume_one.done', 'hearing.verdict', 'story.ending_played', 'story.ending_seen', 'end.done'],
      not: ['party.rael', 'story.hall_seated'],
      what: 'The Epilogue in the browser: nine days later, the witnesses\' arrivals, the Hearing heard, Volume One given, the verdict given and the ending played in the Hall that afternoon',
    },
  };
  const end = ends[name];
  if (!end) return;
  const title = end.title ?? `Chapter ${end.act}`;
  const s = await snap(page);
  const party = partyMembers(new FlagStore(s.flags), RPG, 'present').map((m) => m.id);
  const missing = end.flags.filter((f) => !s.flags[f]);
  const wrong = end.not.filter((f) => s.flags[f]);
  check(missing.length === 0 && wrong.length === 0, `${end.what}${missing.length ? ` (missing ${missing.join(', ')})` : ''}${wrong.length ? ` (should not be set: ${wrong.join(', ')})` : ''}`);
  check(JSON.stringify(party) === JSON.stringify(end.party), `the party at ${title}'s end is ${end.party.join(', ')} (${party.join(', ')})`);
  // Who walks with the party: everyone in it beyond Gianna has a sprite in the line behind her.
  const walkers = { anissa: s.follower, yari: s.yari, azzy: s.azzy, samira: s.samira, bayarmaa: s.bayarmaa, haru: s.haru, vikram: s.vikram, edmund: s.edmund };
  const notWalking = end.party.filter((id) => id !== 'gianna' && id in walkers && !walkers[id]);
  check(notWalking.length === 0, `the whole party walks behind Gianna at ${title}'s end (no sprite for ${notWalking.join(', ')})`);
  // The story agrees with the simulator's: every story, choice, clue, anchor, fight, party and alliance flag (and from
  // Chapter 12 the Claim's, the chairs', the Hearing's, the score and the ending; not a Challenge's `wounds.*`, the HP
  // the browser's fight left, which the simulator's fights, won outright, do not write).
  const told = /^(story|choice|clue|anchor|encounter|party|ally|belief|debate|side|army|muster|war|act\d+|card|claim|seat|hearing|stability|ending|end)\./;
  const simFlags = sim.logic.state.flags.snapshot();
  // (The field pays side quests and debates as it goes, `side.<id>.rewarded` and `debate.<id>.paid.<what>`; the
  // simulator has no field, so those are the field's own bookkeeping.)
  const paid = (k) => k.endsWith('.rewarded') || /^debate\.[^.]+\.paid\./.test(k);
  const keys = new Set([...Object.keys(simFlags), ...Object.keys(s.flags)].filter((k) => told.test(k) && !paid(k)));
  const differ = [...keys].filter((k) => JSON.stringify(simFlags[k] ?? null) !== JSON.stringify(s.flags[k] ?? null));
  check(differ.length === 0, `${title}'s story flags agree with the simulator's${differ.length ? ` (differ: ${differ.map((k) => `${k} browser=${JSON.stringify(s.flags[k])} sim=${JSON.stringify(simFlags[k])}`).join(', ')})` : ''}`);
  const done = end.done ?? `act${end.act}.complete`;
  const card = end.card === undefined ? `act${end.act}_end` : end.card;
  check(s.flags[done] === true && (card === null || s.flags[`card.${card}`] === true) && s.mapId === end.map && s.mode === 'card' && s.card !== null, `${title} ends in ${end.map} with its card (${s.card?.[0]})`);
  // Chapter 9: the watch the city sends with the Muster (seven), and the dissidents' price short as the build allows.
  if (end.act === 9) check(s.flags['army.aldermoor'] === 7, `Aldermoor sends seven of the watch to the Muster (${s.flags['army.aldermoor']})`);
  // Chapter 10: the armies pledged (the six allies and Zetwal's levy, as the simulator counts them), the one betrayer
  // named twice (muster.betrayer and muster.betrayer.<house>), and the night's outcome: turned or betrayed, never both.
  if (end.act === 10) {
    const armies = ['al_doria', 'aldermoor', 'free_brasador', 'jwaladesh', 'kuroshi', 'skarragol', 'zetwal'];
    const counts = armies.map((h) => `${h} ${s.flags[`army.${h}`]}`).join(', ');
    check(armies.every((h) => typeof s.flags[`army.${h}`] === 'number' && s.flags[`army.${h}`] === simFlags[`army.${h}`]), `the armies pledged at the Muster are the simulator's (${counts})`);
    const betrayer = s.flags['muster.betrayer'];
    check(typeof betrayer === 'string' && betrayer === simFlags['muster.betrayer'] && s.flags[`muster.betrayer.${betrayer}`] === true && Object.keys(s.flags).filter((k) => k.startsWith('muster.betrayer.')).length === 1, `one betrayer, named as the simulator names them (${betrayer})`);
    const turned = s.flags['muster.turned'] === true;
    const betrayed = s.flags['muster.betrayed'] === true;
    check(turned !== betrayed && turned === (simFlags['muster.turned'] === true) && betrayed === (simFlags['muster.betrayed'] === true) && (!betrayed || s.flags[`muster.gone.${betrayer}`] === true), `the night ends ${betrayed ? 'betrayed (the betrayer\'s ships gone)' : 'turned'}, as in the simulator`);
    if (betrayed) check(s.flags[`army.${betrayer}`] === 0, `the betrayer's house sends no army (${s.flags[`army.${betrayer}`]})`);
  }
  // Chapter 11: the harbor taken on either route, and the route the run took at the Turn (Trust: Hale fought, the
  // harbor won; Strike: the fleet escapes), as the simulator took it; the whistle's volleys spent only on fights won.
  if (end.act === 11) {
    const trust = s.flags['war.trust'] === true;
    const strike = s.flags['war.strike'] === true;
    check(trust !== strike && trust === (simFlags['war.trust'] === true) && strike === (simFlags['war.strike'] === true), `the Turn: ${trust ? 'Trust (hold the pier)' : 'Strike (strike first)'}, as in the simulator`);
    check(trust ? s.flags['story.harbor_won'] === true && s.flags['encounter.war_story.hale.won'] === true && !s.flags['story.fleet_escaped'] : s.flags['story.fleet_escaped'] === true && !s.flags['story.harbor_won'], trust ? 'on Trust the harbor is won and Hale\'s flagship beaten' : 'on Strike the Crown fleet escapes');
    check(s.flags['war.volley_pool'] === simFlags['war.volley_pool'] && s.flags['war.volleys_left'] === simFlags['war.volleys_left'], `the armies' volleys: ${s.flags['war.volleys_left']} of ${s.flags['war.volley_pool']} left, as in the simulator`);
  }
  // Chapter 12: the Regent's chain of office taken; Azzy's answer (shared or renounced, or on the dark Strike answer his
  // Challenge fought and won); the Accord Stability score so far, read from the browser's save, is the simulator's, and so
  // is the ending it gives on each verdict (no score is written before the verdict).
  if (name === 'chapter12-end') {
    check(s.flags['item.chain_of_office'] >= 1, 'the Regent\'s chain of office is the party\'s');
    const azzy = ['claim.azzy_share', 'claim.azzy_renounced', 'claim.azzy_challenged'].filter((f) => s.flags[f]);
    check(azzy.length === 1 && simFlags[azzy[0]] === true && (azzy[0] !== 'claim.azzy_challenged' || s.flags['encounter.claim_story.azzy.won'] === true), `Azzy's answer at the Claim is the simulator's (${azzy.join(', ')})`);
    const browser = new FlagStore(s.flags);
    const score = stability(browser, STABILITY_HOUSES);
    const simScore = stability(sim.logic.state.flags, STABILITY_HOUSES);
    const on = (flags, verdict) => {
      const f = new FlagStore(flags.snapshot());
      f.set(`hearing.${verdict}`, true);
      return ending(f, STABILITY_HOUSES);
    };
    const verdicts = ['pardon', 'exile', 'execution'];
    const endings = verdicts.map((v) => on(browser, v));
    check(score === simScore && verdicts.every((v, i) => endings[i] === on(sim.logic.state.flags, v)), `the Accord Stability score so far is ${score} (the simulator's ${simScore}); the endings it gives: ${verdicts.map((v, i) => `${v} ${endings[i]}`).join(', ')}`);
  }
  // The Epilogue: the verdict given (one, the simulator's), the score written as the simulator writes it and the ending
  // its card shows; the save in the browser (written before the ending, and again at its card) holds the verdict.
  if (name === 'the-end') {
    const verdicts = ['pardon', 'exile', 'execution'].filter((v) => s.flags[`hearing.${v}`]);
    check(verdicts.length === 1 && simFlags[`hearing.${verdicts[0]}`] === true, `one verdict, the simulator's (${verdicts.join(', ')})`);
    const score = s.flags['stability.score'];
    const end12 = ['just', 'hollow', 'iron'].filter((e) => s.flags[`ending.${e}`]);
    check(typeof score === 'number' && score === simFlags['stability.score'] && end12.length === 1 && end12[0] === ending(new FlagStore(s.flags), STABILITY_HOUSES) && s.flags[`end.${end12[0]}`] === true, `the Accord Stability score is written (${score}, the simulator's ${simFlags['stability.score']}) and the ending follows it: ${end12.join(', ')}`);
    const ends12 = { just: 'The Just Throne', hollow: 'The Hollow Throne', iron: 'The Iron Throne' };
    check(s.card?.[0] === ends12[end12[0]] && s.flags[`card.end_${end12[0]}`] === true, `the ending's card is up: "${s.card?.[0]}"`);
    const stored = decodeSave(await page.evaluate(() => localStorage.getItem('bloodlines-quest.save')));
    check(stored.ok && stored.data.flags[`hearing.${verdicts[0]}`] === true && stored.data.flags['hearing.verdict'] === true && stored.data.flags['stability.score'] === score, 'the verdict is saved (the browser\'s save holds it and the score)');
  }
}

/**
 * Chapter 11, the War of the Harbor, at its markers: the fleet landed on the Canoe Beach with the volley pool counted, and
 * the chain down in the present after the memory (the capstan glows: an anchor). The card is checked with the other
 * chapters' ends (chapterEndChecks).
 */
async function chapter11Checks(page, sim, name) {
  const marks = ['war-landing', 'war-chain-down'];
  if (!marks.includes(name)) return;
  const s = await snap(page);
  const f = s.flags;
  if (name === 'war-landing') {
    check(s.mapId === 'xaragua-beach' && f['story.landed'] === true, '@war-landing: the fleet is on the Canoe Beach and the landing has played');
    check(typeof f['war.volley_pool'] === 'number' && f['war.volley_pool'] === sim.logic.state.flags.get('war.volley_pool'), `@war-landing: the volley pool is counted (${f['war.volley_pool']})`);
  }
  if (name === 'war-chain-down') {
    check(f['anchor.chain_post'] === true && f['story.chain_dropped'] === true, '@war-chain-down: the pin pulled fifty years ago, the chain is down in the present');
    check(s.glowed.some((id) => id.startsWith('chain_capstan')), `@war-chain-down: back from the Echo, the capstan glows (${s.glowed.join(', ')})`);
  }
}

/**
 * Chapter 12, the Claim, and the Epilogue, the Hearing, at their markers: the arrival's scene on the Concourse, the rooms,
 * the tokens handed over before the night, the bell, the chairs set and the Echo of the eighth chair, the petition read,
 * the tile, the Hearing's arrivals nine days later and the verdict's step. The Claim's card (@chapter12-end) and the
 * ending's (@the-end) are checked with the other chapters' ends (chapterEndChecks).
 */
async function chapter12Checks(page, sim, name) {
  const marks = ['claim-arrival', 'claim-rooms', 'claim-night', 'claim-bell', 'claim-echo', 'claim-count', 'claim-tile', 'hearing-arrivals', 'hearing-verdict'];
  if (!marks.includes(name)) return;
  const s = await snap(page);
  const f = s.flags;
  const at = (map, mode) => check(s.mapId === map && (!mode || s.mode === mode), `@${name}: ${mode ?? 'on'} ${map} (${s.mode}, ${s.mapId})`);
  const has = (...flags) => {
    for (const flag of flags) check(f[flag] === true, `@${name}: ${flag}`);
  };
  if (name === 'claim-arrival') {
    at('seat-concourse', 'dialogue');
    has('act11.complete', 'story.claim_arrive_seen');
  }
  if (name === 'claim-rooms') {
    at('seat-rooms', 'dialogue');
    has('story.rooms_seen');
  }
  if (name === 'claim-night') {
    at('seat-concourse', 'field');
    has('side.volume_one.accepted', 'debate.seat_claim.settled');
    check(f['side.seats.handed'] !== true, '@claim-night: the tokens are not handed over yet');
  }
  if (name === 'claim-bell') {
    at('seat-concourse', 'field');
    has('side.seats.handed', 'story.bell_claim');
  }
  if (name === 'claim-echo') {
    at('seat-hall', 'field');
    has('story.chairs_set', 'side.seats.done');
  }
  if (name === 'claim-count') {
    at('seat-hall', 'field');
    has('story.chair_read', 'clue.petition_original');
  }
  if (name === 'claim-tile') {
    at('seat-hall', 'field');
    has('story.claim_begun');
    check(f['story.claim_won'] !== true, '@claim-tile: the Claim is not won yet');
  }
  if (name === 'hearing-arrivals') {
    at('seat-concourse', 'dialogue');
    check(f['story.hearing_arrived'] !== true, '@hearing-arrivals: the arrivals are playing');
  }
  if (name === 'hearing-verdict') {
    at('seat-hall', 'field');
    has('story.hearing_arrived', 'side.volume_one.done', 'story.hearing_heard');
  }
}

/**
 * The item showcase is browser-only (the simulator has no screen): when one is up, check it (the first
 * time each item shows), photograph the Locket's, skip its rise with A and close it with a tap.
 */
async function handleShowcase(page, seen, shots) {
  const s = await snap(page);
  if (s.mode !== 'showcase') return false;
  const v = s.showcase;
  if (!seen.has(v.id)) {
    seen.add(v.id);
    if (v.id === 'sun_locket') {
      check(v.banner === 'Key item' && v.name === 'Sun Locket', 'receiving the Sun Locket pops up its showcase');
      check(v.abilities[0]?.startsWith('Echo: '), `its known ability shows ("${v.abilities[0]}")`);
      check(v.abilities.includes('Two halves of a promise: ???'), 'abilities not learned yet show as ???');
      await page.waitForTimeout(700); // the rise, the rays and the words
      await page.keyboard.up('Shift');
      await shoot(page, 'locket-showcase', shots);
      await page.keyboard.down('Shift');
    }
  }
  await page.keyboard.press('KeyZ'); // finishes the rise (or closes it, if it had finished)
  await frames(page);
  if ((await snap(page)).mode === 'showcase') {
    const at = await page.evaluate(() => window.__quest.gameToScreen(160, 90));
    await page.mouse.click(at.x, at.y);
  }
  await page.waitForFunction(() => window.__quest.snapshot().mode !== 'showcase', null, { timeout: 3000 });
  return true;
}

/** The animated intro: it plays, Skip jumps to the title, the title loops, and A goes on into the quest. */
async function introFlow(browser, errors) {
  console.log('Intro:');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(URL_BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.intro', { timeout: 15000 });
  const state = () => page.evaluate(() => window.__intro?.state() ?? null);
  // A browser that wants a tap first shows the prompt; tap the picture.
  await page.waitForTimeout(500);
  if (await page.isVisible('.intro-prompt')) await page.click('.intro');
  await page.waitForFunction(() => window.__intro?.state().phase === 'film' && window.__intro.state().time > 1, null, { timeout: 15000 });
  check(true, 'a new game opens on the intro, and it plays');
  await page.screenshot({ path: join(SHOT_DIR, 'quest-intro.png') });
  await page.click('.intro-skip');
  await page.waitForFunction(() => window.__intro?.state().phase === 'title', null, { timeout: 5000 });
  let s = await state();
  check(s.time >= 87 && s.time < 91, `Skip jumps to the title (at ${s.time.toFixed(2)} s)`);
  await page.waitForTimeout(5000);
  s = await state();
  check(s.phase === 'title' && s.time >= 87 && s.time < 91 && !s.finished, `the title loops (at ${s.time.toFixed(2)} s after 5 s more)`);
  await page.screenshot({ path: join(SHOT_DIR, 'quest-title.png') });
  await page.keyboard.press('z');
  await waitReady(page);
  check(!(await page.isVisible('.intro')), 'A on the title goes on into the quest');
  await page.waitForFunction(() => window.__audio?.().playing === 'festival', null, { timeout: 15000 });
  check(true, 'the festival song plays in the plaza after the title');
  // Opened again on this device: straight to the title, not the whole film (owner request, Oct 16).
  await page.reload();
  await page.waitForSelector('.intro', { timeout: 15000 });
  await page.waitForTimeout(500);
  if (await page.isVisible('.intro-prompt')) await page.click('.intro');
  await page.waitForFunction(() => window.__intro?.state().phase === 'title', null, { timeout: 8000 });
  check(true, 'the next visit opens on the title, not the whole film');
  await page.keyboard.press('z');
  await waitReady(page);
  await ctx.close();
  return ['quest-intro.png', 'quest-title.png'];
}

/**
 * A damaged stored save (Claude's call, Oct 28): the game still starts, says so, keeps the old text, and an old
 * save whose later fields are missing loads with defaults.
 */
async function damagedSaveFlow(browser, errors) {
  console.log('Damaged and old saves:');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(VILLAGE);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('bloodlines-quest.save', 'BQ2.this-is-not-a-save.00000000');
  });
  await page.reload();
  await page.waitForSelector('.code-dialog.notice', { timeout: 15000 });
  const text = await page.textContent('.code-dialog.notice');
  check(/could not be read/.test(text ?? ''), 'a damaged save shows a clear message instead of crashing');
  check((await page.evaluate(() => localStorage.getItem('bloodlines-quest.save.unreadable'))) === 'BQ2.this-is-not-a-save.00000000', 'and the old save is kept on the device');
  await page.click('.code-dialog.notice button.primary');
  await waitReady(page);
  check(!(await page.isVisible('.code-dialog')), 'OK closes it and the new game runs');
  // An old code (version 1, before the hints setting) on the test village: it loads with hints on.
  await page.evaluate(() => {
    const body = btoa(JSON.stringify([1, 'test-village', 3, 4, 1, 0, { a: true }, 2, 5])).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    let h = 0x811c9dc5;
    for (let i = 0; i < body.length; i++) {
      h ^= body.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    localStorage.setItem('bloodlines-quest.save', `BQ1.${body}.${h.toString(16).padStart(8, '0')}`);
  });
  await page.reload();
  await waitReady(page);
  const s = await snap(page);
  check(s.mapId === 'test-village' && s.x === 3 && s.y === 4 && !(await page.isVisible('.code-dialog')), 'a version 1 save still loads where it was');
  await ctx.close();
}

/** The debate corner: walk up, Join, win two rounds of three, and the reward is paid. */
async function debateFlow(browser, errors) {
  console.log('Debate corner:');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(GAME);
  const flags = { 'story.festival_intro': true, 'story.heard_speech': true, 'story.elodie_left': true, 'item.sun_locket': 1, 'shown.item.sun_locket': true, 'story.warroom_echo': true, 'party.anissa': true };
  const code = encodeSave({ version: 2, era: 'present', settings: { textSpeed: 'instant', hints: false }, savedAt: 1, flags, mapId: 'zetwal-town', x: 21, y: 17, facing: 'right' });
  await page.evaluate((c) => localStorage.setItem('bloodlines-quest.save', c), code);
  await page.reload();
  await waitReady(page);
  for (let i = 0; i < 4 && (await snap(page)).mode !== 'field'; i++) await page.keyboard.press('z').then(() => page.waitForTimeout(400));
  const choices = async () => (await snap(page)).dialogue?.choices ?? [];
  /** Press A until a choice shows, then pick the one starting with `pick`. */
  const choose = async (pick) => {
    for (let i = 0; i < 12 && (await choices()).length === 0; i++) await page.keyboard.press('z').then(() => page.waitForTimeout(250));
    const list = await choices();
    const at = list.findIndex((c) => c.startsWith(pick));
    if (at < 0) throw new Error(`Smoke check failed: no choice "${pick}" in ${list.join(' / ')}`);
    const from = (await snap(page)).dialogue.cursor;
    for (let i = from; i < at; i++) await page.keyboard.press('ArrowDown').then(() => page.waitForTimeout(120));
    await page.keyboard.press('z');
    await page.waitForTimeout(300);
  };
  await page.keyboard.press('z');
  await page.waitForTimeout(400);
  check((await choices()).join('|') === 'Listen|Join the debate|Mediate (needs Influence 5 here)|Provoke the crowd|Walk on', 'the corner offers Listen, Join, Mediate (needs Influence 5) and Provoke');
  await choose('Join');
  await choose('Scripture');
  await choose('Scripture');
  await choose('Compassion');
  for (let i = 0; i < 12 && (await snap(page)).mode !== 'field'; i++) await page.keyboard.press('z').then(() => page.waitForTimeout(250));
  await page.waitForTimeout(300);
  const s = await snap(page);
  check(s.toast?.includes('Debate won') ?? false, `winning two rounds wins the debate (${s.toast})`);
  await page.screenshot({ path: join(SHOT_DIR, 'quest-debate-won.png') });
  await ctx.close();
  return ['quest-debate-won.png'];
}

/**
 * The first battle, the boar on the Cane Road (owner decision, Oct 16: the route must win it before Yari
 * sails). The route's dialogue starts it; this plays it: the tutorial pages, then Sunthread until it
 * falls, Surge when ready, then back to the field.
 */
async function fightBoar(page, shots) {
  // The tutorial comes first (owner, Oct 15): its pages, A to turn each.
  await page.waitForFunction(() => window.__quest.snapshot().battle?.tutorial, null, { timeout: 15000 });
  // The battle has its own music (owner report, Oct 16: none played on the Cane Road).
  const music = await page.waitForFunction(() => window.__audio?.().playing === 'battle', null, { timeout: 15000 }).then(() => true, () => false);
  check(music, `the battle music plays (${JSON.stringify(await page.evaluate(() => window.__audio?.()))})`);
  const tut = (await snap(page)).battle.tutorial;
  // Demo review, Oct 17: three pages first; Anissa's gifts and weapon moves when they come up; rows and gear after.
  check(tut.page === 1 && tut.pages === 3 && tut.title === 'How to fight', `the boar fight opens with three tutorial pages (${tut.pages})`);
  await shoot(page, 'battle-tutorial', shots);
  const titles = [];
  for (let i = 0; i < 20; i++) {
    const t = (await snap(page)).battle?.tutorial;
    if (!t) break;
    titles.push(t.title);
    await page.keyboard.press('KeyZ');
    await page.waitForFunction((n) => window.__quest.snapshot().battle?.tutorial?.page !== n, t.page, { timeout: 2000 });
  }
  check(['How to fight', 'Attack and Skill', 'Guard and Item'].every((t) => titles.includes(t)), 'they cover turns, targets, Skill, Guard and Item');
  await page.waitForFunction(() => { const b = window.__quest.snapshot().battle; return b && !b.busy; }, null, { timeout: 15000 });
  await shoot(page, 'battle-start', shots);
  // Whose turn it is shows on the field (owner report, Oct 29): a gold outline and a light at the fighter's feet.
  const first = (await snap(page)).battle;
  check(first.acting === first.actor && first.acting !== 'anissa' && first.mark?.visible === true, `the fighter whose turn it is is marked on the field (${JSON.stringify({ actor: first.actor, acting: first.acting, mark: first.mark })})`);
  await page.screenshot({ path: join(SHOT_DIR, 'quest-battle-acting.png') });
  let targeted = false;
  // B from the target cursor goes back to the menu it came from (owner report, Oct 29): X once, Escape once.
  const backKeys = ['KeyX', 'Escape'];
  const wentBack = [];
  let spoils = false;
  const later = [];
  const at = await snap(page);
  for (let turn = 0; turn < 160; turn++) {
    await page.waitForFunction(() => { const b = window.__quest.snapshot().battle; return !b || !b.busy; }, null, { timeout: 20000 });
    const st = await snap(page);
    if (st.gameOver || st.battle?.fallen) {
      await riseAndRetry(page, 'intro_boar', at);
      continue;
    }
    const bt = st.battle;
    if (!bt) break;
    if (bt.tutorial) {
      if (!later.includes(bt.tutorial.title)) {
        later.push(bt.tutorial.title);
        if (!bt.done) await shoot(page, `battle-lesson-${later.length}`, shots);
      }
      spoils ||= bt.done && bt.tutorial.title === 'Spoils';
      if (spoils) await shoot(page, 'battle-spoils', shots);
      await page.keyboard.press('KeyZ');
      await page.waitForTimeout(120);
      continue;
    }
    if (bt.done) {
      await shoot(page, 'battle-won', shots);
      await page.keyboard.press('KeyZ');
      break;
    }
    if (bt.menu === 'target') {
      if (!targeted) await shoot(page, 'battle-target', shots);
      targeted = true;
      const key = backKeys.shift();
      if (key) {
        await page.keyboard.press(key);
        await page.waitForTimeout(120);
        const back = (await snap(page)).battle;
        wentBack.push(`${key}: target -> ${back.menu}`);
        check(back.menu !== 'target' && back.depth === bt.depth - 1 && back.acting === bt.actor, `${key} on the target cursor goes back one step, to the ${back.menu} (${bt.depth} -> ${back.depth})`);
        continue;
      }
      await page.keyboard.press('KeyZ');
      await page.waitForTimeout(120);
      continue;
    }
    // Gianna: Surge when ready, else Sunthread; anyone else: Attack.
    const skill = bt.actor === 'gianna' ? 'Sunthread' : null;
    const want = bt.rows.includes('Surge') ? 'Surge' : bt.menu === 'skills' ? (bt.rows.find((r) => r.startsWith(skill ?? '-')) ?? 'Back') : skill ? 'Skill' : 'Attack';
    const idx = bt.rows.findIndex((r) => r === want || r.startsWith(want));
    for (let i = 0; i < idx; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('KeyZ');
    await page.waitForTimeout(120);
  }
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 5000 });
  const afterBattle = await snap(page);
  check(targeted, 'the battle asks for a target before an attack or spell');
  check(wentBack.length === 2, `B (X and Escape) went back from the target cursor (${wentBack.join(', ')})`);
  check(spoils, 'after the win, a tutorial page shows how to wear the spoils');
  check(["Anissa's Light", 'Weapon moves'].every((t) => later.includes(t)), `lessons come up during the fight when they matter (${later.join(', ')})`);
  check(['Rows and Swap', 'Gear and spells'].every((t) => later.includes(t)), 'rows and gear are taught after the win');
  check(afterBattle.flags['encounter.wilds.boar.won'] === true && (afterBattle.flags['item.boar_tusk'] ?? 0) >= 1, 'the boar battle is won and pays out the boar-tusk charm');
}

/**
 * Any other fight on the route (Chapter 2's pier): no tutorial; Sunthread for Gianna, Surge when ready,
 * Attack for everyone else, until it is won. Checks it is won and that the battle music plays.
 */
async function fightBattle(page, id, shots) {
  await page.waitForFunction(() => window.__quest.snapshot().battle, null, { timeout: 15000 });
  const music = await page.waitForFunction(() => window.__audio?.().playing === 'battle', null, { timeout: 15000 }).then(() => true, () => false);
  check(music, `${id}: the battle music plays`);
  let shot = false;
  // A fight meant to be lost (Chapter 3's Trial of Blades) ends in its scene, never on the goddess's screen.
  const scripted = !!battleDef(id)?.meantToLose;
  // A sparring match the party can also win (Chapter 8's duel: Vikram withdraws at 0 HP, and a win plays its other
  // line): the route plays it lost, as the simulator does, so the bot only guards until Gianna falls.
  const throwIt = scripted && battleDef(id).enemies.some((e) => ENEMIES[e]?.withdraws);
  // A lost fight opens the goddess's Game Over screen: Rise, then back into the fight (riseAndRetry).
  const at = await snap(page);
  // Each pass is one key the bot decides (a move, a target): a long boss fight (Chapter 11's Hale, some 40 rounds for the
  // smoke's plain plan, with a Rise or two) takes several hundred.
  for (let turn = 0; turn < 1500; turn++) {
    await page.waitForFunction(() => { const b = window.__quest.snapshot().battle; return !b || !b.busy; }, null, { timeout: 20000 });
    const st = await snap(page);
    if (scripted && st.battle?.fallen && !st.gameOver) {
      await shoot(page, `battle-${id}-bound`, shots);
      break;
    }
    if (st.gameOver || st.battle?.fallen) {
      await riseAndRetry(page, id, at);
      continue;
    }
    const bt = st.battle;
    if (!bt) break;
    if (!shot) {
      await shoot(page, `battle-${id}`, shots);
      shot = true;
    }
    if (bt.tutorial || bt.menu === 'target') {
      await page.keyboard.press('KeyZ');
      await page.waitForTimeout(120);
      continue;
    }
    if (bt.done) {
      await page.keyboard.press('KeyZ');
      break;
    }
    const skill = bt.actor === 'gianna' ? 'Sunthread' : null;
    const want = throwIt && bt.menu !== 'skills' ? 'Guard' : bt.rows.includes('Break Free') ? 'Break Free' : bt.rows.includes('Surge') ? 'Surge' : bt.menu === 'skills' ? (bt.rows.find((r) => r.startsWith(skill ?? '-')) ?? 'Back') : skill ? 'Skill' : 'Attack';
    const idx = bt.rows.findIndex((r) => r === want || r.startsWith(want));
    for (let i = 0; i < idx; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('KeyZ');
    await page.waitForTimeout(120);
  }
  await page.waitForFunction(() => window.__quest.snapshot().mode !== 'battle', null, { timeout: 8000 }).catch(async () => {
    const s = await snap(page);
    throw new Error(`${id}: the fight never ended in the browser (${JSON.stringify(s.battle)})`);
  });
  const after = await snap(page);
  const battle = battleDef(id);
  if (scripted) {
    const set = Object.keys(battle.meantToLose.set ?? {});
    check(!after.gameOver && set.every((f) => after.flags[f] === true) && after.flags[`encounter.${battle.table}.${battle.group}.won`] !== true, `${id}: lost as the story means it (no goddess, never won), and its scene plays`);
    return;
  }
  check(after.flags[`encounter.${battle.table}.${battle.group}.won`] === true, `${id}: the fight is won in the browser`);
}

/** Game Overs the scripted route met by accident (each is logged; more than three fails the run). */
let accidentalFalls = 0;

/**
 * The bot lost a fight on the scripted route (the dice come from the save, so a fall replays the same way until the
 * next try rolls new ones): the goddess's screen opens. Skip
 * (B) to the last screen, Rise (A), and fight again from the moment before: a fight started by stepping on a
 * trigger (the boar's line) is one step back, so step on again; any other waits where it began, so meet the
 * foe again from the same tile (the rematch hook: what talking to the waiting foe does, without walking away
 * from where the simulator expects Gianna). `at` is the field as the fight began.
 */
async function riseAndRetry(page, id, at) {
  accidentalFalls++;
  console.log(`  note - ${id}: the party fell by accident (${accidentalFalls}); the goddess's screen, Rise, and the fight again`);
  check(accidentalFalls <= 3, 'the scripted route loses at most three fights by accident');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver, null, { timeout: 15000 });
  await page.keyboard.press('KeyX');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver?.countShown, null, { timeout: 15000 });
  await page.keyboard.press('KeyZ');
  // Back on the map (an item received before the fight may show its showcase first: close it).
  await page.waitForFunction(() => { const s = window.__quest?.snapshot(); return s && !s.gameOver && !s.moving && (s.mode === 'field' || s.mode === 'showcase'); }, null, { timeout: 15000 });
  for (let i = 0; i < 5 && (await handleShowcase(page, new Set(), [])); i++) await frames(page);
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 5000 });
  await frames(page);
  const s = await snap(page);
  if (s.mapId === at.mapId && (s.x !== at.x || s.y !== at.y)) {
    // Back off a fight trigger: step on again, the way the party came.
    const dx = Math.sign(at.x - s.x);
    const dy = Math.sign(at.y - s.y);
    const dir = [dy < 0 ? 'up' : dy > 0 ? 'down' : '', dx < 0 ? 'left' : dx > 0 ? 'right' : ''].filter(Boolean).join('-');
    if (dir.includes('-')) await pressDiagonal(page, dir);
    else await page.keyboard.press(KEYS[dir]);
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'dialogue', null, { timeout: 5000 });
    for (let i = 0; i < 40; i++) {
      const t = await finishTyping(page);
      if (t.mode !== 'dialogue') break;
      await page.keyboard.press('KeyZ');
      await frames(page);
    }
  } else check(await page.evaluate(() => window.__quest.rematch()), `${id}: the fight starts again from where it began`);
  await page.waitForFunction(() => window.__quest.snapshot().battle, null, { timeout: 15000 });
  check((await snap(page)).battle.grudge > 0 || id.startsWith('encounter:'), `${id}: the second try starts with a Grudge`);
}

/**
 * Game Over on purpose (owner request, Oct 19; docs/quest/intro/GAME-OVER-STORYBOARD.md), on a phone held
 * sideways: lose the boar with the test-only switch, read the goddess's first meeting, Rise, and win it later.
 */
async function gameOverFlow(browser, errors) {
  console.log('Game Over (the goddess, on purpose):');
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  const shots = [];
  const both = async (name) => {
    await page.screenshot({ path: join(SHOT_DIR, `${name}-landscape.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: join(SHOT_DIR, `${name}-portrait.png`) });
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(150);
    shots.push(`${name}-landscape.png`, `${name}-portrait.png`);
  };
  await page.goto(GAME);
  await waitReady(page);
  // On the Cane Road one tile west of the boar's line (x 9), with Anissa, Yari asked.
  const code = encodeSave({
    version: 2, era: 'present', settings: { textSpeed: 'fast', hints: false }, savedAt: 1,
    flags: { 'story.festival_intro': true, 'story.heard_speech': true, 'party.anissa': true, 'story.yari_asked': true },
    mapId: 'zetwal-road', x: 8, y: 12, facing: 'right',
  });
  await page.evaluate((c) => localStorage.setItem('bloodlines-quest.save', c), code);
  await page.reload();
  await waitReady(page);
  const readOn = async () => {
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'dialogue', null, { timeout: 5000 });
    for (let i = 0; i < 40; i++) {
      const t = await finishTyping(page);
      if (t.mode !== 'dialogue') break;
      await page.keyboard.press('KeyZ');
      await frames(page);
    }
    await page.waitForFunction(() => window.__quest.snapshot().battle, null, { timeout: 15000 });
  };
  await page.keyboard.press('ArrowRight');
  await readOn();
  check((await snap(page)).battle.grudge === 0, 'the first try at the boar has no Grudge');
  check(await page.evaluate(() => window.__quest.loseBattle()), 'the test switch makes the party fall');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver, null, { timeout: 10000 });
  let g = (await snap(page)).gameOver;
  check(g.phase === 'fall' && g.count === 1, `the goddess's screen opens on the fall, the first time (${g.phase}, ${g.count})`);
  check((await snap(page)).flags['gameover.count'] === 1, 'the count is saved as the screen opens');
  const stored = decodeSave(await page.evaluate(() => localStorage.getItem('bloodlines-quest.save')));
  check(stored.ok && stored.data.flags['gameover.count'] === 1 && stored.data.x === 8, 'the save holds the count, and the moment before the fight');
  // A or a tap during the fall does nothing.
  await page.keyboard.press('KeyZ');
  await page.locator('.gameover').tap({ position: { x: 40, y: 200 } });
  await frames(page);
  check((await snap(page)).gameOver.phase === 'fall', 'A or a tap during the fall does nothing');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver?.phase === 'words', null, { timeout: 12000 });
  await page.waitForTimeout(300);
  await both('quest-gameover-first-line');
  // Her words, one per tap (none moves on by itself), the first meeting exactly.
  const seen = [];
  const layerTap = () => page.locator('.gameover').tap({ position: { x: 40, y: 200 } });
  // A tap while her first (long) line types shows the rest of it, and stays on it.
  g = (await snap(page)).gameOver;
  if (g.typing) {
    await layerTap();
    await frames(page);
    g = (await snap(page)).gameOver;
    check(g.line === 0 && !g.typing, 'a tap while a line types shows the whole line');
  }
  for (let i = 0; i < 12; i++) {
    await page.waitForFunction(() => !window.__quest.snapshot().gameOver?.typing, null, { timeout: 5000 });
    g = (await snap(page)).gameOver;
    seen[g.line] = g.text;
    if (g.speaker === 'gianna') await both('quest-gameover-gianna');
    if (g.countShown) break;
    // Nothing moves on by itself: the line waits for the next tap.
    await page.waitForTimeout(400);
    check((await snap(page)).gameOver.line === g.line, `line ${g.line + 1} waits for a tap`);
    await layerTap();
    await page.waitForFunction((n) => window.__quest.snapshot().gameOver?.line !== n, g.line, { timeout: 3000 });
  }
  check(JSON.stringify(seen) === JSON.stringify(GODDESS_WORDS.firstMeeting.map((l) => l.text)), `the first meeting: she names herself, Gianna asks "Like my mother?" (${seen.length} lines)`);
  g = (await snap(page)).gameOver;
  check(g.countShown && g.count === 1 && !g.skipVisible, 'the last screen shows the count, 1, and Rise');
  const tap = await page.evaluate(() => {
    const r = document.querySelector('.gameover-rise').getBoundingClientRect();
    const k = document.querySelector('.gameover-count-num').textContent;
    return { w: r.width, h: r.height, k, inside: r.bottom <= innerHeight && r.right <= innerWidth };
  });
  check(tap.w >= 44 && tap.h >= 44 && tap.inside && tap.k === '1', `Rise is a 44 px target on screen (${tap.w}x${tap.h}), under the count ${tap.k}`);
  // A stray tap on the last screen does not rise.
  await page.locator('.gameover').tap({ position: { x: 40, y: 40 } });
  await frames(page);
  check((await snap(page)).gameOver?.phase === 'words', 'a stray tap on the last screen does not rise');
  await both('quest-gameover-last');
  await page.locator('.gameover-rise').tap();
  await page.waitForFunction(() => { const s = window.__quest?.snapshot(); return s && s.mode === 'field' && !s.gameOver; }, null, { timeout: 10000 });
  await page.waitForTimeout(1200);
  let s = await snap(page);
  check(s.mapId === 'zetwal-road' && s.x === 8 && s.y === 12, `Rise: back before the fight, one tile west of the boar's line (${s.x},${s.y})`);
  check(s.flags['gameover.count'] === 1 && s.flags['gameover.wilds.boar'] === 1 && !('battle.after' in s.flags) && !('fight.return' in s.flags), 'the count and the boar\'s Grudge are kept; the fight\'s markers are gone');
  await both('quest-gameover-back');
  await page.reload();
  await waitReady(page);
  s = await snap(page);
  check(s.x === 8 && s.y === 12 && s.flags['gameover.count'] === 1, 'after a reload: still 1 fallen, still before the fight');
  // Walk on: the boar charges again, with the Grudge, and no tutorial pages this time.
  await page.keyboard.press('ArrowRight');
  await readOn();
  await page.waitForFunction(() => { const b = window.__quest.snapshot().battle; return b && !b.busy; }, null, { timeout: 15000 });
  let b = (await snap(page)).battle;
  check(Math.abs(b.grudge - 0.1) < 1e-9 && b.tutorial?.title !== 'How to fight', `the second try: Grudge +10%, the opening tutorial not shown again (${b.grudge}, ${b.tutorial?.title ?? 'none'})`);
  await shoot(page, 'gameover-grudge', shots);
  // Lose again and Skip (B): straight to the last screen, the count 2.
  check(await page.evaluate(() => window.__quest.loseBattle()), 'the party falls again');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver, null, { timeout: 10000 });
  await page.locator('.gameover-skip').tap();
  await page.waitForFunction(() => window.__quest.snapshot().gameOver?.countShown, null, { timeout: 3000 });
  g = (await snap(page)).gameOver;
  check(g.count === 2 && g.lines === 2 && g.text === GODDESS_WORDS.closing, `Skip goes straight to her last line and the count, 2 (${g.count})`);
  await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => { const q = window.__quest?.snapshot(); return q && q.mode === 'field' && !q.gameOver; }, null, { timeout: 10000 });
  await page.waitForTimeout(1200);
  await page.keyboard.press('ArrowRight');
  await readOn();
  await page.waitForFunction(() => { const q = window.__quest.snapshot().battle; return q && !q.busy; }, null, { timeout: 15000 });
  b = (await snap(page)).battle;
  check(Math.abs(b.grudge - 0.2) < 1e-9, `the third try: Grudge +20% (${b.grudge})`);
  await fightBattle(page, 'intro_boar', shots);
  s = await snap(page);
  check(!('gameover.wilds.boar' in s.flags) && s.flags['gameover.count'] === 2, 'the win clears the boar\'s Grudge; the count stays 2');
  await ctx.close();
  return shots;
}

/**
 * The rhythm lock (ui/RhythmPanel.ts): tap A as each drum mark reaches the line, the way a player follows
 * the markers, timed from the panel's own clock. Checks the song is judged right and the door opens.
 */
async function playRhythm(page, shots) {
  await page.waitForFunction(() => window.__quest.snapshot().rhythm, null, { timeout: 5000 });
  const { due } = (await snap(page)).rhythm;
  for (let i = 0; i < due.length; i++) {
    await page.waitForFunction((t) => (window.__quest.snapshot().rhythm?.elapsed ?? Infinity) >= t, due[i] - 25, { timeout: 15000, polling: 'raf' });
    await page.keyboard.press('KeyZ');
  }
  // The last press is read on the next frame: wait for it to land (the song runs a beat past its last mark).
  await page.waitForFunction((n) => (window.__quest.snapshot().rhythm?.taps.length ?? n) >= n, due.length, { timeout: 3000 }).catch(() => {});
  // The picture after the last tap, while the stones still show (taken during the count-in, a slow machine let
  // it run past the first mark and the bot tapped late).
  await shoot(page, 'rhythm-lock', shots);
  const r = (await snap(page)).rhythm;
  check(!r || r.hits === due.length, `the drum song: ${r?.hits ?? due.length} of ${due.length} marks tapped in time${r ? ` (due ${r.due.join(',')}; taps ${r.taps.join(',')})` : ''}`);
  await page.waitForFunction(() => window.__quest.snapshot().mode !== 'rhythm', null, { timeout: 15000 });
  for (let i = 0; i < 300; i++) {
    const t = await finishTyping(page);
    if (t.mode !== 'dialogue') break;
    await page.keyboard.press('KeyZ');
    await frames(page);
  }
  check((await snap(page)).flags['story.lock_opened'] === true, 'the stones open the record house to the whole drum song');
}

/** A sea voyage (scenes/VoyageScene.ts) between chapters: watch both parts, then skip with B. */
async function handleVoyage(page, shots, landing = 'xaragua-village') {
  await frames(page);
  if (!(await page.evaluate(() => !!window.__voyage))) return false;
  // Home to Zetwal twice (Chapter 2's escape, Chapter 9's trader across the bay): each its own pictures.
  const home = (await snap(page)).flags['act9.complete'] === true ? 'voyage-home-ch9' : 'voyage-home';
  const tag = landing === 'xaragua-village' ? 'voyage' : landing === 'zetwal-harbor' ? home : landing === 'xaragua-beach' ? 'voyage-war' : `voyage-${landing}`;
  await page.waitForTimeout(2500);
  await shoot(page, `${tag}-harbor`, shots);
  await page.waitForFunction(() => window.__voyage?.state().phase === 'map', null, { timeout: 10000 });
  await page.waitForTimeout(4000);
  await shoot(page, `${tag}-map`, shots);
  check(true, `the voyage to ${landing} plays: the boat to the ship, then the route on the realm map`);
  await page.keyboard.press('KeyX');
  await page.waitForFunction((m) => !window.__voyage && window.__quest?.snapshot().mapId === m, landing, { timeout: 10000 });
  return true;
}

/**
 * Chapter 9's courtroom restart rule (the outline's 3.12), in a second window from the same save at @aldermoor-assize:
 * the route plays on to the Hushed, the party falls on purpose (the test switch), and after Rise the court still sits:
 * the party stands where the fight began (by the dock, not walked out of the court), the fight unwon; a step onto the dock's edge replays the
 * Almoner's "Enough noise." and the fight, with a Grudge. The main window's route and dice are untouched.
 */
async function assizeRestart(browser, errors, at, shots) {
  console.log('The Assize again (the courtroom\'s restart rule, from @aldermoor-assize):');
  // The save the first window's player has: the side quests' rewards paid (the field pays them as each closes; the
  // simulator has no field) and every item's popup seen. The simulator plays on from the route's own state.
  const fork = savedSim(at.code, undefined, at.dice);
  settleRewards(fork.logic.state.flags, RPG, SIDE_QUESTS);
  for (const it of pendingShowcases(fork.logic.state.flags, RPG)) markShown(fork.logic.state.flags, it.id);
  const code = encodeSave(toSaveData(fork.logic.state, 1));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(`${GAME}&seed=${at.dice}`);
  await page.evaluate((c) => {
    localStorage.clear();
    localStorage.setItem('bloodlines-quest.save', c);
  }, code);
  await page.reload();
  await waitReady(page);
  const sim = savedSim(at.code, undefined, at.dice);
  await waitMatch(page, expected(sim), 'the Assize (second window): the start');
  await page.keyboard.down('Shift');
  let started = false;
  for (const item of at.rest) {
    if (started) break;
    if (item.kind === 'mark') continue;
    for (const cmd of sim.expand(item)) {
      await handleShowcase(page, new Set(), []);
      if (sim.logic.mode === 'dialogue' && (cmd === 'confirm' || cmd === 'cancel' || cmd === 'up' || cmd === 'down')) await finishTyping(page);
      sim.press(cmd);
      if (cmd.includes('-') || STRAIGHT.has(cmd)) await pressDiagonal(page, cmd);
      else await page.keyboard.press(KEYS[cmd]);
      await frames(page);
      if (sim.battles.includes('assize_hushed')) {
        started = true;
        break;
      }
      await waitMatch(page, expected(sim), `${cmd} (the Assize, second window: ${JSON.stringify(item)})`);
    }
  }
  await page.keyboard.up('Shift');
  check(started, 'the Assize (second window): the route reaches the Hushed');
  await page.waitForFunction(() => window.__quest.snapshot().battle, null, { timeout: 15000 });
  const before = await snap(page);
  check(await page.evaluate(() => window.__quest.loseBattle()), 'the Assize: the test switch makes the party fall to the Hushed');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver, null, { timeout: 15000 });
  await page.keyboard.press('KeyX');
  await page.waitForFunction(() => window.__quest.snapshot().gameOver?.countShown, null, { timeout: 15000 });
  await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => { const s = window.__quest?.snapshot(); return s && !s.gameOver && !s.moving && (s.mode === 'field' || s.mode === 'showcase'); }, null, { timeout: 15000 });
  for (let i = 0; i < 5 && (await handleShowcase(page, new Set(), [])); i++) await frames(page);
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 5000 });
  const risen = await snap(page);
  // Where the fight began: at the clerk's table, just above the dock's edge (the clerk's tree is read there).
  const inCourt = risen.mapId === 'aldermoor-keep' && risen.x >= 5 && risen.x <= 9 && risen.y >= 20 && risen.y <= 24;
  check(inCourt && risen.x === before.x && risen.y === before.y, `after Rise the court still sits: the party stands where the fight began, by the dock (${risen.mapId} ${risen.x},${risen.y})`);
  check(risen.flags['encounter.aldermoor_story.hushed.won'] !== true && risen.flags['story.hushed_beaten'] !== true && risen.flags['story.record_read'] === true, 'and the Hushed is not beaten: the trial waits on her');
  await shoot(page, 'assize-risen', shots);
  // The dock's edge (the row just above the dock, y 22) starts the fight again.
  for (let i = 0; i < 3 && (await snap(page)).mode === 'field'; i++) {
    await page.keyboard.press((await snap(page)).y < 22 ? 'ArrowDown' : 'ArrowUp');
    await page.waitForFunction(() => { const s = window.__quest.snapshot(); return !s.moving || s.mode !== 'field'; }, null, { timeout: 3000 });
    await frames(page);
  }
  const first = await finishTyping(page);
  check(first.mode === 'dialogue' && first.dialogue?.speaker === 'The Almoner' && first.dialogue.text === 'Enough noise.', `a step onto the dock's edge replays the Almoner's "Enough noise." (${first.dialogue?.speaker}: ${first.dialogue?.text})`);
  await shoot(page, 'assize-again', shots);
  for (let i = 0; i < 40; i++) {
    const t = await finishTyping(page);
    if (t.mode !== 'dialogue') break;
    await page.keyboard.press('KeyZ');
    await frames(page);
  }
  await page.waitForFunction(() => window.__quest.snapshot().battle, null, { timeout: 15000 });
  check((await snap(page)).battle.grudge > 0, 'and the Hushed is fought again, with a Grudge');
  await ctx.close();
}

/**
 * A side quest built Oct 27, in a window of its own from the same save at @kirinoura-petition: K-4 The Letter in the
 * Floor, from the Hall out to the floor-maker, through Lady Sayo's door, the puzzle's own solution (the memory, the nail,
 * the tune walked on the singing floor: the browser's step hook), and the lacquer box. The simulator predicts every key;
 * the Nightingale Key's legendary showcase pops up over the box's scene. The main window's route is untouched.
 */
async function letterInTheFloor(browser, errors, at, shots) {
  console.log('K-4 The Letter in the Floor (a side quest built Oct 27, from @kirinoura-petition):');
  const fork = savedSim(at.code, undefined, at.dice);
  settleRewards(fork.logic.state.flags, RPG, SIDE_QUESTS);
  for (const it of pendingShowcases(fork.logic.state.flags, RPG)) markShown(fork.logic.state.flags, it.id);
  const code = encodeSave(toSaveData(fork.logic.state, 1));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(`${GAME}&seed=${at.dice}`);
  await page.evaluate((c) => {
    localStorage.clear();
    localStorage.setItem('bloodlines-quest.save', c);
  }, code);
  await page.reload();
  await waitReady(page);
  const sim = savedSim(code, undefined, at.dice);
  await waitMatch(page, expected(sim), 'K-4 (second window): the start');
  const inputs = parseRoute([
    'goto 17,25', 'goto 12,2', 'left', 'confirm', 'skip', 'goto 10,3', 'left', 'skip',
    ...readJson('puzzles/kuroshi_floor/solution.json'),
    'up*4', 'confirm', 'skip',
  ]);
  const seen = new Set();
  let keyShown = false;
  await page.keyboard.down('Shift');
  for (const item of inputs) {
    for (const cmd of sim.expand(item)) {
      if (cmd === 'skip') {
        sim.press('skip');
        for (let i = 0; i < 200; i++) {
          const pop = await snap(page);
          if (pop.mode === 'showcase' && pop.showcase?.id === 'nightingale_key' && !keyShown) {
            keyShown = pop.showcase.banner === 'Legendary item';
            await page.keyboard.up('Shift');
            await page.waitForTimeout(700);
            await shoot(page, 'nightingale-key-showcase', shots);
            await page.keyboard.down('Shift');
          }
          if (await handleShowcase(page, seen, shots)) continue;
          const s = await finishTyping(page);
          if (s.mode !== 'dialogue') break;
          await page.keyboard.press('KeyZ');
          await frames(page);
        }
      } else {
        await handleShowcase(page, seen, shots);
        if (sim.logic.mode === 'dialogue' && (cmd === 'confirm' || cmd === 'cancel' || cmd === 'up' || cmd === 'down')) await finishTyping(page);
        sim.press(cmd);
        if (cmd.includes('-') || STRAIGHT.has(cmd)) await pressDiagonal(page, cmd);
        else await page.keyboard.press(KEYS[cmd]);
        await frames(page);
      }
      await waitMatch(page, expected(sim), `${cmd} (K-4, second window: ${JSON.stringify(item)})`);
    }
    if (item.kind === 'press' && item.cmd === 'up-left') await shoot(page, 'sayo-floor-walked', shots);
  }
  await page.keyboard.up('Shift');
  for (let i = 0; i < 5 && (await handleShowcase(page, seen, shots)); i++) await frames(page);
  const end = await snap(page);
  check(end.mapId === 'kuroshi-sayo-house', `K-4: the party is in Lady Sayo's House (${end.mapId})`);
  check(end.flags['story.sayo_box_open'] === true, 'K-4: the tune walked on the singing floor opens the lacquer box in the browser');
  check(end.flags['item.nightingale_key'] === true && end.flags['side.letter_floor.done'] === true, 'K-4: the box gives the Nightingale Key, and the quest is done');
  check(keyShown, 'K-4: the Nightingale Key pops up as a legendary item');
  await ctx.close();
}

/**
 * A secret side quest of the second batch built Oct 27, in a window of its own from the same save at @old-benny: Ar-4 The
 * Old Lord's Errand, old Benny's offer in his quiet rooms, the chapel stair, the cloister crossed in two eras past the
 * watches (the puzzle's own solution: young Benny, the loose bolt, the iron box), up Benny's own stair and the promise
 * read to him. The simulator predicts every key; La Promesa de Benny's legendary showcase pops up over the old lord's
 * scene. The main window's route is untouched.
 */
async function oldLordsErrand(browser, errors, at, shots) {
  console.log('Ar-4 The Old Lord\'s Errand (a secret side quest built Oct 27, from @old-benny):');
  const fork = savedSim(at.code, undefined, at.dice);
  settleRewards(fork.logic.state.flags, RPG, SIDE_QUESTS);
  for (const it of pendingShowcases(fork.logic.state.flags, RPG)) markShown(fork.logic.state.flags, it.id);
  const code = encodeSave(toSaveData(fork.logic.state, 1));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(`${GAME}&seed=${at.dice}`);
  await page.evaluate((c) => {
    localStorage.clear();
    localStorage.setItem('bloodlines-quest.save', c);
  }, code);
  await page.reload();
  await waitReady(page);
  const sim = savedSim(code, undefined, at.dice);
  await waitMatch(page, expected(sim), 'Ar-4 (second window): the start');
  const inputs = parseRoute([
    'confirm', 'skip', 'goto 31,16', 'right', 'skip',
    ...readJson('puzzles/ardencia_cloister/solution.json'),
    'left*6', 'goto 4,15', 'left', 'confirm', 'skip',
  ]);
  const seen = new Set();
  let promiseShown = false;
  await page.keyboard.down('Shift');
  for (const item of inputs) {
    for (const cmd of sim.expand(item)) {
      if (cmd === 'skip') {
        sim.press('skip');
        for (let i = 0; i < 200; i++) {
          const pop = await snap(page);
          if (pop.mode === 'showcase' && pop.showcase?.id === 'benny_promise' && !promiseShown) {
            promiseShown = pop.showcase.banner === 'Legendary item';
            await page.keyboard.up('Shift');
            await page.waitForTimeout(700);
            await shoot(page, 'benny-promise-showcase', shots);
            await page.keyboard.down('Shift');
          }
          if (await handleShowcase(page, seen, shots)) continue;
          const s = await finishTyping(page);
          if (s.mode !== 'dialogue') break;
          await page.keyboard.press('KeyZ');
          await frames(page);
        }
      } else {
        await handleShowcase(page, seen, shots);
        if (sim.logic.mode === 'dialogue' && (cmd === 'confirm' || cmd === 'cancel' || cmd === 'up' || cmd === 'down')) await finishTyping(page);
        sim.press(cmd);
        if (cmd.includes('-') || STRAIGHT.has(cmd)) await pressDiagonal(page, cmd);
        else await page.keyboard.press(KEYS[cmd]);
        await frames(page);
      }
      await waitMatch(page, expected(sim), `${cmd} (Ar-4, second window: ${JSON.stringify(item)})`);
    }
    if (item.kind === 'press' && item.cmd === 'echo') await shoot(page, 'cloister-era', shots);
  }
  await page.keyboard.up('Shift');
  for (let i = 0; i < 5 && (await handleShowcase(page, seen, shots)); i++) await frames(page);
  const end = await snap(page);
  check(end.mapId === 'ardencia-alcazar', `Ar-4: the party is back in the old lord's quiet rooms (${end.mapId})`);
  check(end.flags['anchor.crypt_bolt'] === true, 'Ar-4: the bolt drawn in the memory jams the crypt door open in the browser');
  check(end.flags['item.benny_promise'] === true && end.flags['side.old_errand.done'] === true, 'Ar-4: the iron box gives Benny\'s promise, and the quest is done');
  check(promiseShown, 'Ar-4: La Promesa de Benny pops up as a legendary item');
  await ctx.close();
}

async function playAct(browser, errors) {
  console.log('Chapters 1 to 12 and the Epilogue (scripted route, checked against the simulator after every key):');
  let route = parseRoute(readJson('routes/zetwal-act1.json'));
  let sim = newGameSim();
  // SMOKE_FROM=<marker>: the simulator plays the route up to that marker, and the browser loads its save there.
  let saveCode = null;
  // The browser's encounter dice: the simulator's default seed from a new game; from a marker, where the whole route's
  // dice stand there (a save does not carry them, so a loaded game would roll other ambushes than the route plays).
  let dice = 1;
  if (FROM) {
    const at = route.findIndex((item) => item.kind === 'mark' && item.name === FROM);
    if (at < 0) throw new Error(`SMOKE_FROM: no marker "@${FROM}" in the route`);
    // Played as the full run plays it: the field pays finished side quests and debates as it goes, so the save holds
    // their rewards (and the item showcases they bring are seen below), not a pile paid at the browser's first sync.
    const play = (items) => {
      for (const it of items) for (const cmd of sim.expand(it)) {
        sim.press(cmd);
        settleAsField(sim);
      }
    };
    play(route.slice(0, at));
    // A marker on a chapter's end card: on to the field after it.
    let from = at + 1;
    for (; sim.logic.mode !== 'field' && from < route.length; from++) play([route[from]]);
    if (sim.logic.mode !== 'field') throw new Error(`SMOKE_FROM: the route never reaches the field after @${FROM}`);
    // The browser shows each item's popup as it arrives; a player reaching this point has seen them all.
    for (const it of pendingShowcases(sim.logic.state.flags, RPG)) markShown(sim.logic.state.flags, it.id);
    saveCode = encodeSave(toSaveData(sim.logic.state, 1));
    dice = sim.logic.diceState;
    sim = savedSim(saveCode, undefined, dice);
    settleAsField(sim);
    route = route.slice(from);
    console.log(`  (starting at @${FROM}, ${route.length} route items left)`);
  }
  if (TO) {
    const end = route.findIndex((item) => item.kind === 'mark' && item.name === TO);
    if (end < 0) throw new Error(`SMOKE_TO: no marker "@${TO}" in the route (or it comes before @${FROM})`);
    route = route.slice(0, end + 1);
    console.log(`  (stopping at @${TO}, ${route.length} route items to play)`);
  }
  /** Whether this run plays Chapter 11's card in the browser (so the voyage to Eightgate after it is watched). */
  const before11 = sim.logic.state.flags.get('act11.complete') !== true;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(`${GAME}&seed=${dice}`); // the simulator's encounter dice, so ambushes match
  await page.evaluate((c) => {
    localStorage.clear();
    if (c) localStorage.setItem('bloodlines-quest.save', c);
  }, saveCode);
  await page.reload();
  await waitReady(page);
  await waitMatch(page, expected(sim), 'the start');
  await page.keyboard.down('Shift'); // run

  const shots = [];
  const showcases = new Set();
  let anissaShot = false;
  /** The staged scenes already photographed. */
  const stagedShots = new Set();
  let voyaged = false;
  /** Chapter 9's card closes on the trader home across the bay (Zetwal's harbour, where Chapter 10 begins). */
  let voyagedHome9 = false;
  /** Chapter 10's card closes on the fleet sailing to war (Xaraguá's Canoe Beach, where Chapter 11 begins). */
  let voyagedWar = false;
  /** Chapter 11's card closes on the fleet north up the strait (then the Ash Road to Eightgate's Ardencia Gate). */
  let voyagedEightgate = false;
  /** The cards shown in the browser, in order (the Epilogue's last ones: the ending's, The End, the cast). */
  const cardsSeen = [];
  /** Whether the end credits have rolled (the route's last card closed). */
  let credited = false;
  /** Whether this run plays Chapter 9's card (so the voyage home after it is watched). */
  let playedCard9 = false;
  /** Where the route stood at @aldermoor-assize, for the courtroom's restart rule. */
  let assize = null;
  /** Where the route stood at @kirinoura-petition, for K-4 (a side quest built Oct 27). */
  let petition = null;
  /** Where the route stood at @old-benny, for Ar-4 (a secret side quest of the second batch, Oct 27). */
  let errand = null;
  let keys = 0;
  const started = Date.now();
  for (const item of route) {
    if (item.kind === 'mark') {
      await markChecks(page, sim, item.name);
      await chapterEndChecks(page, sim, item.name);
      await chapter11Checks(page, sim, item.name);
      await chapter12Checks(page, sim, item.name);
      await shoot(page, item.name, shots);
      // The courtroom's restart rule, in a window of its own once this one is done (the route plays on here, its dice
      // untouched; two games at once on one machine starve each other's frames).
      if (item.name === 'aldermoor-assize') assize = { code: encodeSave(toSaveData(sim.logic.state, 1)), dice: sim.logic.diceState, rest: route.slice(route.indexOf(item) + 1) };
      if (item.name === 'kirinoura-petition') petition = { code: encodeSave(toSaveData(sim.logic.state, 1)), dice: sim.logic.diceState };
      if (item.name === 'old-benny') errand = { code: encodeSave(toSaveData(sim.logic.state, 1)), dice: sim.logic.diceState };
      // SMOKE_UNTIL=<marker>: stop the route there (the second windows still play), for a quick look at one stretch.
      if (process.env.SMOKE_UNTIL === item.name) break;
      if (item.name === 'chapter9-end') playedCard9 = true;
      // Chapter 9 ends on the sea: the trader home across the bay, onto Zetwal's harbour, where the Muster's landing
      // begins (checked here, before Chapter 10 plays on).
      if (item.name === 'muster-landing' && playedCard9) {
        const home = await snap(page);
        check(voyagedHome9 && home.mapId === 'zetwal-harbor' && !!home.edmund, 'after Chapter 9\'s card the trader sails home (the voyage plays) and the party, Edmund last, stands on Zetwal\'s harbour');
      }
      continue;
    }
    for (const cmd of sim.expand(item)) {
      const mode = sim.logic.mode;
      const mapBefore = sim.logic.state.player.mapId;
      if (cmd === 'skip') {
        const battles = sim.battles.length;
        const rhythms = sim.rhythms.length;
        sim.press('skip');
        for (let i = 0; i < 300; i++) {
          if (await handleShowcase(page, showcases, shots)) continue;
          const s = await finishTyping(page);
          if (s.mode !== 'dialogue') break;
          // Every staged scene (owner rule: shown, not told): one picture of the actors in place, per map.
          if (s.stage?.actors.length && !stagedShots.has(`map:${s.mapId}`)) {
            stagedShots.add(`map:${s.mapId}`);
            await shoot(page, `staged-${s.mapId}`, shots);
          }
          // The staged Crown attack: the marines stand at Gianna's face.
          const lt = s.stage?.actors.find((a) => a.id === 'lieutenant');
          if (lt && !stagedShots.has('marines') && s.dialogue?.speaker === 'Marine lieutenant') {
            stagedShots.add('marines');
            check(Math.abs(lt.x - s.x) + Math.abs(lt.y - s.y) <= 2, 'the Crown attack is acted out: the marines march up the hall to Gianna before the lieutenant speaks');
            await shoot(page, 'staged-marines', shots);
          }
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
        // The dialogue started a fight (the simulator counts it won): fight it in the browser.
        if (sim.battles.length > battles) {
          await page.keyboard.up('Shift');
          if (sim.battles.at(-1) === 'intro_boar') await fightBoar(page, shots);
          else await fightBattle(page, sim.battles.at(-1), shots);
          // A fight can lead straight into a scene (the pier: the marines flee, the fisher speaks), and a scene
          // into another map and its arrival scene (the caney: out the back into the burning plaza): read on
          // until the browser stands where the simulator does.
          await frames(page);
          const want = sim.logic.state.player.mapId;
          for (let i = 0; i < 400; i++) {
            const st = await snap(page);
            if (!stagedShots.has('anaco') && st.stage?.actors.some((a) => a.id === 'anaco') && st.stage.actors.some((a) => a.id === 'captain') && !st.stage.busy) {
              stagedShots.add('anaco');
              check(true, 'after the fight the marines run off, and the captain\'s men come up the hall for Anaco (acted out on the map)');
              await shoot(page, 'staged-anaco', shots);
            }
            // A scene can end in a sea voyage (the escape home): watch it as at the end of Chapter 1.
            if (await page.evaluate(() => !!window.__voyage)) {
              if (await handleVoyage(page, shots, want)) voyaged = true;
              continue;
            }
            // A fight can finish a side quest, and the field pays it at once: its reward's showcase over the scene.
            if (await handleShowcase(page, showcases, shots)) continue;
            const t = await finishTyping(page);
            if (t.mode === 'dialogue') {
              await page.keyboard.press('KeyZ');
              keys++;
            } else if ((t.mode === 'field' || t.mode === 'card') && t.mapId === want) break;
            await frames(page);
          }
          await page.keyboard.down('Shift');
        }
        // The dialogue opened a rhythm lock (the simulator plays it right): tap it in the browser.
        if (sim.rhythms.length > rhythms) await playRhythm(page, shots);
      } else {
        await handleShowcase(page, showcases, shots);
        // A choice only takes the cursor once its line has finished typing (the same as a player waiting).
        if (mode === 'dialogue' && (cmd === 'confirm' || cmd === 'cancel' || cmd === 'up' || cmd === 'down')) await finishTyping(page);
        // A card closes on A only once it shows (a press while the scene before it ends is not for the card).
        if (sim.logic.mode === 'card') await page.waitForFunction(() => window.__quest.snapshot().mode === 'card', null, { timeout: 15000 });
        const battles = sim.battles.length;
        sim.press(cmd);
        if (cmd.includes('-') || STRAIGHT.has(cmd)) await pressDiagonal(page, cmd);
        else await page.keyboard.press(KEYS[cmd]);
        keys++;
        await frames(page);
        // A line read on with A started a fight (Chapter 8's duel, at the end of Vikram's challenge): fight it in the
        // browser; the simulator has it settled and stands at the first line after it.
        if (sim.battles.length > battles) {
          await page.keyboard.up('Shift');
          await fightBattle(page, sim.battles.at(-1), shots);
          await page.keyboard.down('Shift');
        }
      }
      await handleShowcase(page, showcases, shots);
      // A voyage between chapters (Chapter 1's to Xaraguá; a chapter's card closing on the sea, Chapter 6's longship to
      // Kirinoura, Chapter 7's trader to Agnipur): watch it, then on.
      const landing = sim.logic.state.player.mapId;
      if ((landing !== mapBefore || landing === 'xaragua-village') && (await handleVoyage(page, shots, landing))) {
        if (landing === 'xaragua-village') voyaged = true;
        if (landing === 'zetwal-harbor' && sim.logic.state.flags.get('act9.complete') === true) voyagedHome9 = true;
        if (landing === 'xaragua-beach' && sim.logic.state.flags.get('act10.complete') === true) voyagedWar = true;
        if (landing === 'seat-concourse' && sim.logic.state.flags.get('act11.complete') === true) voyagedEightgate = true;
      }
      // The game's last cards (the Epilogue): the ending's, The End and the cast, then the end credits (a screen of the
      // browser's own; the simulator stands in the field). A on the credits goes to the title; the save is the Hall after
      // the end, with the quest complete, and the game opens there again.
      if (sim.logic.mode === 'card' || (await snap(page)).mode === 'card') {
        await page.waitForFunction(() => window.__quest.snapshot().mode === 'card', null, { timeout: 15000 });
        const c = (await snap(page)).card;
        if (c?.[0]) cardsSeen.push(c[0]);
      }
      if (sim.logic.mode === 'field' && sim.logic.state.flags.get('end.done') === true && !credited) {
        credited = true;
        await page.waitForFunction(() => window.__quest.snapshot().mode === 'credits', null, { timeout: 15000 });
        const order = ['The End', 'The cast'].map((t) => cardsSeen.indexOf(t));
        check(order[0] >= 0 && order[1] > order[0] && cardsSeen.filter((t) => t === 'The cast').length === 4, `after the ending's card, "The End" and the cast's four cards (${cardsSeen.join(' / ')})`);
        const credits = (await snap(page)).journal;
        check(credits?.[0] === 'CREDITS' && credits.at(-1) === '(A to the title)', `and the end credits roll (${credits?.length} lines, "${credits?.at(-1)}")`);
        await shoot(page, 'end-credits', shots);
        await page.keyboard.up('Shift');
        await page.keyboard.press('KeyZ');
        keys++;
        await page.waitForFunction(() => !!window.__intro, null, { timeout: 15000 });
        check(true, 'A on the credits goes to the title');
        await shoot(page, 'title-after-end', shots);
        const saved = decodeSave(await page.evaluate(() => localStorage.getItem('bloodlines-quest.save')));
        const fl = saved.ok ? saved.data.flags : {};
        check(saved.ok && saved.data.mapId === 'seat-hall' && fl['act12.complete'] === true && fl['end.done'] === true && ['the_end', 'cast_1', 'cast_2', 'cast_3', 'cast_4'].every((id) => fl[`card.${id}`] === true), `the save marks the quest complete (Chapter 12 and the Epilogue done, The End and the cast shown; in ${saved.ok ? saved.data.mapId : 'no save'})`);
        // The game opens on that save again: the Hall after the end, the realm open.
        await page.reload();
        await waitReady(page);
        await page.keyboard.down('Shift');
        await waitMatch(page, expected(sim), 'the reload after the credits');
        continue;
      }
      // A vendor's shop opens when their scene ends (a vendor whose talk comes before their wares): a screen of the
      // browser's own (the simulator stays in the field). Close it, as a player who buys nothing does.
      if (sim.logic.mode === 'field' && (await snap(page)).mode === 'shop') {
        await page.keyboard.press('KeyX');
        keys++;
        await page.waitForFunction(() => window.__quest.snapshot().mode !== 'shop', null, { timeout: 3000 });
      }
      settleAsField(sim);
      await waitMatch(page, expected(sim), `${cmd} (route: ${JSON.stringify(item)})`);
    }
  }
  await page.keyboard.up('Shift');
  // Chapter 10 ends on the sea: the fleet sails to war, onto Xaraguá's Canoe Beach (where Chapter 11 begins), the
  // whole party walking behind Gianna.
  const war = await snap(page);
  const line = [war.follower, war.yari, war.azzy, war.samira, war.bayarmaa, war.haru, war.vikram, war.edmund];
  // (SMOKE_TO=chapter10-end stops the route on the card, before the voyage: nothing to check there.)
  if (war.flags['act10.complete'] === true && war.flags['act11.complete'] !== true && !(TO && !voyagedWar)) {
    check(voyagedWar && war.mapId === 'xaragua-beach' && war.mode === 'field' && line.every((w) => !!w), 'after Chapter 10\'s card the fleet sails to war (the voyage plays) and the party, Edmund last, stands on Xaraguá\'s Canoe Beach');
  }
  // Chapter 11's card closes on the voyage north up the strait (Oct 27: a scene now), then Eightgate's Ardencia Gate (where
  // Chapter 12 begins), the nine walking behind Gianna and Rael not among them.
  if (war.flags['act11.complete'] === true && war.flags['story.claim_arrived'] !== true) {
    check(voyagedEightgate && war.mapId === 'seat-concourse' && war.mode === 'field' && line.every((w) => !!w) && war.flags['party.rael'] !== true, 'after Chapter 11\'s card the fleet sails north (the voyage plays) and the party, Edmund last, stands at Eightgate\'s Ardencia Gate');
  }
  if (before11 && war.flags['story.claim_arrived'] === true) check(voyagedEightgate, 'Chapter 11\'s card closed on the voyage to Ardencia\'s strand, not a jump to Eightgate');
  // The quest's end: after the credits and the title the save opens in the Throne Hall that afternoon, the whole party
  // walking behind Gianna again (no longer seated), Rael not among them.
  if (war.flags['end.done'] === true) {
    check(credited && war.mapId === 'seat-hall' && war.mode === 'field' && line.every((w) => !!w) && war.flags['party.rael'] !== true && war.flags['act12.complete'] === true, 'after the credits the game opens on the save in the Throne Hall, the quest complete, the party (Edmund last) behind Gianna');
  }
  if (FROM || TO) {
    if (TO) {
      const t = await snap(page);
      if (t.flags['act1.complete'] === true) check(voyaged || !!FROM, 'Chapter 1 ends with the voyage to Xaraguá, not a jump');
      check(true, `played the route to @${TO} in the browser, matching the simulator after every key (${keys} keys, ${Math.round((Date.now() - started) / 1000)} s)`);
    }
    await ctx.close();
    if (assize) await assizeRestart(browser, errors, assize, shots);
    if (petition) await letterInTheFloor(browser, errors, petition, shots);
    if (errand) await oldLordsErrand(browser, errors, errand, shots);
    return shots;
  }
  const s = await snap(page);
  check(voyaged, 'Chapter 1 ends with the voyage to Xaraguá, not a jump');
  check(s.flags['act1.complete'] === true && s.flags['card.act1_end'] === true, `played Act I to the end card in the browser (${keys} keys, ${Math.round((Date.now() - started) / 1000)} s)`);
  check(s.flags['anchor.chain_bridge'] === true && s.flags['story.bridge_crossed'] === true, 'the bridge puzzle was solved through the Echo and its anchor');
  check(Object.keys(s.flags).every((f) => !f.startsWith('echo.')), 'no memory-only flags leaked into the present');
  check(s.flags['anchor.cave_sluice'] === true && s.flags['clue.drum_pattern'] === true, 'the petroglyph cave was drained through the Echo (the lower sluice) and its wall read');
  check(s.flags['story.caona_joined'] === true && s.flags['clue.drum_full'] === true, 'the areíto Echo played the whole drum song, and Caona joined the Echo party');
  check(s.flags['story.oath_found'] === true, 'the record house opened and the oath stone was read');
  check(s.flags['story.anaco_taken'] === true && s.flags['story.patrol_beaten'] === true, 'the Crown attack: the caney fight and the patrol fight were won in the browser, and Anaco was taken');
  check(s.flags['story.refuge'] === true && s.flags['story.escape_night'] === true, 'the refuge: Yari and Anissa hid in the cave, then came out for the escape');
  check(s.flags['story.yari_hidden'] === false && s.flags['party.anissa'] === true && s.follower !== null, 'Yari is back in the party, and Anissa follows Gianna again');
  check(s.flags['story.papers_checked'] === true && s.flags['story.anaco_found'] === true, 'the occupied city: the three clues place Anaco in the customs cellar, and the papers open the trail to the beach');
  check(s.flags['story.anaco_visited'] === true && s.flags['story.escape_planned'] === true && s.flags['story.word_runner_seen'] === true, 'the envoy visited Anaco with the fever bark, and a runner carried the escape plan to the cave');
  check(s.flags['encounter.xaragua_story.thorne.won'] === true && s.flags['story.escaped'] === true, 'Governor Thorne was beaten at the sea mouth, and Yari escaped through the blockade');
  check(s.flags['act2.complete'] === true && s.flags['card.act2_end'] === true && s.flags['story.ardencia_asked'] === true, 'home to Zetwal: Grandfather asks for Ardencia, and Chapter 2 ends with its card');
  check([3, 4, 5, 6, 7, 8, 9, 10, 11].every((n) => s.flags[`act${n}.complete`] === true && s.flags[`card.act${n}_end`] === true), 'Chapters 3 to 11 played to their end cards in the browser');
  check(s.flags['act12.complete'] === true && s.flags['card.claim_stands'] === true && s.flags['end.done'] === true && s.flags['card.cast_4'] === true && credited && s.mapId === 'seat-hall', 'Chapter 12 and the Epilogue played to the end in the browser: the Claim\'s card, the Hearing, the ending, The End, the cast and the credits; the party stands in the Throne Hall');
  check(showcases.has('sun_locket') && s.flags['shown.item.sun_locket'] === true, 'the Locket showcase played once and was closed');
  // The Items page shows the Locket again, now with the Anchors ability learned at the bridge.
  await menuTab(page, 'Items');
  for (let i = 0; i < 30; i++) {
    const m = (await snap(page)).menu;
    if (m.items[m.cursor]?.startsWith('Sun Locket')) break;
    await page.keyboard.press('ArrowDown');
    await frames(page);
  }
  await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'showcase', null, { timeout: 2000 });
  const replay = (await snap(page)).showcase;
  check(replay.id === 'sun_locket' && replay.abilities.some((a) => a.startsWith('Anchors: What you change')), 'the Items page replays the Locket, with Anchors now known');
  await page.keyboard.press('KeyZ');
  await frames(page);
  if ((await snap(page)).mode === 'showcase') await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'menu', null, { timeout: 2000 });
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuTab(page, 'Quests');
  const journal = (await snap(page)).menu.journal;
  check(journal.some((l) => l.startsWith('Something changed: The Chain Bridge')), 'the Journal notes "Something changed: The Chain Bridge ..."');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  // The Map page: the city drawn from its real maps, then (A) the realm shaped like the board's map.
  await menuTab(page, 'Map');
  let mapSnap = (await snap(page)).menu;
  check(mapSnap.items.includes('The Throne Hall') && mapSnap.items.includes('The Eight Gates Concourse'), 'the city map shows the city the party is in (Eightgate, where the quest ends)');
  await shoot(page, 'city-map', shots);
  await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items.includes('Ardencia'), null, { timeout: 2000 });
  mapSnap = (await snap(page)).menu;
  check(mapSnap.items.length === 9 && mapSnap.items.includes('Xaraguá'), 'A turns it to the realm map, with all nine places');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.realm?.loaded, null, { timeout: 5000 });
  {
    const r = (await snap(page)).menu.realm;
    const canvas = await page.evaluate(() => {
      const b = document.querySelector('canvas').getBoundingClientRect();
      return { left: b.left, top: b.top, width: b.width };
    });
    const k = canvas.width / 320;
    const near = (a, b) => Math.abs(a - b) <= 2;
    check(near(r.left, canvas.left + 6 * k) && near(r.width, 128 * k) && near(r.height, 128 * k), 'the painted board map sits exactly over the map area, at full sharpness');
    check(['Zetwal', 'Ardencia', 'Xaraguá', 'Kuroshi'].every((n) => r.labels.includes(n)), 'the countries are named on it');
  }
  await shoot(page, 'realm-map', shots);
  await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.realm === null, null, { timeout: 2000 });
  check(await page.locator('.realm-map.hidden').count() === 1, 'back on the city map, the painting is gone');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  // The other two tiers, for the screenshots: a legendary (secret) item and a quest reward card.
  for (const [id, tier] of [['solange_quill', 'legendary'], ['sun_charm', 'reward']]) {
    await page.evaluate((i) => window.__quest.showItem(i), id);
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'showcase', null, { timeout: 2000 });
    check((await snap(page)).showcase.tier === tier, `the ${tier} showcase shows (${id})`);
    await page.waitForTimeout(700);
    await shoot(page, `${tier}-showcase`, shots);
    await page.keyboard.press('KeyZ');
    await frames(page);
    if ((await snap(page)).mode === 'showcase') await page.keyboard.press('KeyZ');
    await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  }
  // Large text (System > Text size): the scene is rebuilt at the new size, and it is remembered.
  await menuSelect(page, 'Text size');
  await page.waitForFunction(() => window.__quest?.snapshot().toast === 'Text size: Large', null, { timeout: 5000 });
  check((await page.evaluate(() => localStorage.getItem('bq.textSize'))) === 'large', 'System > Text size switches to Large and remembers it on this device');
  await menuTab(page, 'Status');
  await shoot(page, 'large-text-status', shots);
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await page.evaluate(() => window.__quest.showItem('sun_locket'));
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'showcase', null, { timeout: 2000 });
  await page.waitForTimeout(700);
  await shoot(page, 'large-text-showcase', shots);
  await page.keyboard.press('KeyZ');
  await frames(page);
  if ((await snap(page)).mode === 'showcase') await page.keyboard.press('KeyZ');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuSelect(page, 'Text size');
  await page.waitForFunction(() => window.__quest?.snapshot().toast === 'Text size: Normal', null, { timeout: 5000 });
  check(true, 'and back to Normal');
  // Quest arrows (owner request, Oct 17): System > Quest arrows turns them off and on, remembered on this device.
  await menuSelect(page, 'Quest arrows');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items?.includes('Quest arrows: Off'), null, { timeout: 2000 });
  check((await page.evaluate(() => localStorage.getItem('bq.questArrows'))) === 'off', 'System > Quest arrows turns them off, remembered on this device');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuSelect(page, 'Quest arrows');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items?.includes('Quest arrows: On'), null, { timeout: 2000 });
  check(true, 'and back on');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  // Reduce motion (Claude's call, Oct 28): System > Reduce motion turns it on and off, remembered on this device.
  await menuSelect(page, 'Reduce motion');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items?.includes('Reduce motion: On'), null, { timeout: 2000 });
  check(
    (await page.evaluate(() => localStorage.getItem('bq.reduceMotion'))) === 'on' && (await page.evaluate(() => document.body.classList.contains('reduce-motion'))),
    'System > Reduce motion turns it on, remembered on this device',
  );
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuSelect(page, 'Reduce motion');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items?.includes('Reduce motion: Off'), null, { timeout: 2000 });
  check(true, 'and off again');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  await menuSelect(page, 'Credits');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'journal', null, { timeout: 2000 });
  check((await snap(page)).journal[0] === 'CREDITS', 'the menu has a Credits screen');
  await page.keyboard.press('x');
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 2000 });
  // Equip > Gianna > Spells: the spell slots and what gear brings (owner, Oct 15).
  await menuTab(page, 'Equip');
  await page.keyboard.press('z');
  for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowDown');
  await page.keyboard.press('z');
  await page.waitForFunction(() => window.__quest.snapshot().menu?.items?.some((t) => t.startsWith('Sunthread')), null, { timeout: 3000 });
  await shoot(page, 'equip-spells', shots);
  check(true, 'Equip shows Gianna\'s spells and slots');
  for (let i = 0; i < 4 && (await snap(page)).mode === 'menu'; i++) {
    await page.keyboard.press('x');
    await frames(page);
  }
  await page.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 3000 });
  await page.reload();
  await waitReady(page);
  const back = await snap(page);
  check(back.mapId === 'seat-hall' && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].every((n) => back.flags[`act${n}.complete`] === true) && back.flags['end.done'] === true, 'the autosave keeps every chapter and the Epilogue finished after a reload');
  await ctx.close();
  if (assize) await assizeRestart(browser, errors, assize, shots);
  if (petition) await letterInTheFloor(browser, errors, petition, shots);
  if (errand) await oldLordsErrand(browser, errors, errand, shots);
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
    if (FROM) {
      console.log(`SMOKE_FROM=${FROM}: only the scripted route, from @${FROM}.`);
      const shots = await playAct(browser, errors);
      check(errors.length === 0, `no page errors${errors.length ? `:\n${errors.join('\n')}` : ''}`);
      console.log(`Screenshots: ${shots.map((f) => join(SHOT_DIR, f)).join(', ')}`);
      console.log('Smoke test passed (from a marker; run without SMOKE_FROM for the whole test).');
      return;
    }

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
      [...document.querySelectorAll('.touch-btn, .touch-small, .touch-dpad')].map((e) => {
        const r = e.getBoundingClientRect();
        return Math.min(r.width, r.height);
      }),
    );
    check(sizes.every((v) => v >= 44), `every touch target is at least 44 px (${sizes.join(', ')})`);
    s = await snap(ppage);
    check(s.x === 6 && s.y === 6, 'fresh phone context starts a new game');
    // The D-pad: hold the right arm (walk right), slide to between up and right (a diagonal), release.
    const pad = await ppage.locator('.touch-dpad').boundingBox();
    const cdp = await phone.newCDPSession(ppage);
    const touch = (type, x, y) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
    const mid = { x: pad.x + pad.width / 2, y: pad.y + pad.height / 2 };
    const r = pad.width / 2;
    await touch('touchStart', mid.x, mid.y);
    s = await snap(ppage);
    check(s.x === 6 && s.y === 6 && !s.moving, 'a thumb on the D-pad hub does not move');
    // Walk right past the house corner (the wall at 8,5 would refuse a diagonal there), then up-right.
    await touch('touchMove', mid.x + r * 0.8, mid.y);
    await ppage.waitForFunction(() => window.__quest.snapshot().x >= 9, null, { timeout: 4000 });
    await touch('touchMove', mid.x + r * 0.6, mid.y - r * 0.6);
    const before = await snap(ppage);
    await ppage.waitForFunction(
      ({ x, y }) => {
        const q = window.__quest.snapshot();
        return q.facing === 'up-right' && q.y < y && q.x > x;
      },
      { x: before.x, y: before.y },
      { timeout: 4000 },
    );
    check(true, 'pressing between the up and right arms walks diagonally');
    const lit = await ppage.evaluate(() => document.querySelector('.touch-dpad').dataset.dir);
    check(lit === 'up-right', `the pressed arms light up (${lit})`);
    await ppage.screenshot({ path: join(SHOT_DIR, 'quest3-stick-phone.png') });
    await touch('touchEnd');
    await ppage.waitForFunction(() => !window.__quest.snapshot().moving, null, { timeout: 3000 });
    // Tap to move: tap a tile and Gianna walks there; tap a person and she walks up and talks.
    const tapTile = async (x, y) => {
      const p = await ppage.evaluate(([tx, ty]) => window.__quest.tileToScreen(tx, ty), [x, y]);
      await touch('touchStart', p.x, p.y);
      await touch('touchEnd');
    };
    await tapTile(6, 6);
    await ppage.waitForFunction(() => {
      const q = window.__quest.snapshot();
      return q.x === 6 && q.y === 6 && !q.moving;
    }, null, { timeout: 8000 });
    check(true, 'tapping a tile walks Gianna there');
    await tapTile(11, 10);
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'dialogue', null, { timeout: 8000 });
    s = await snap(ppage);
    check(Math.abs(s.x - 11) + Math.abs(s.y - 10) === 1, `tapping the villager walks up to them and talks (stopped at ${s.x},${s.y})`);
    // Tap the dialogue box to read on (and to pick the first choice when one comes up).
    const tapGame = async (x, y) => {
      const p = await ppage.evaluate(([gx, gy]) => window.__quest.gameToScreen(gx, gy), [x, y]);
      await touch('touchStart', p.x, p.y);
      await touch('touchEnd');
      await ppage.waitForTimeout(120);
    };
    let choicesTapped = 0;
    for (let i = 0; i < 16 && (await snap(ppage)).mode === 'dialogue'; i++) {
      const d = (await snap(ppage)).dialogue;
      if (d?.choices && !d.typing) {
        // The choice box sits right-aligned just above the dialogue box (box top 120, rows 11 px).
        const top = 120 - (d.choices.length * 11 + 6) - 2;
        await tapGame(300, top + 3 + 5);
        choicesTapped++;
      } else await tapGame(160, 150);
      await ppage.waitForTimeout(200);
    }
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 4000 });
    check(choicesTapped > 0, `tapping the dialogue box reads on to the end, and a tap picks a choice (${choicesTapped})`);
    // The minimap opens the full map; tabs and the X are tappable.
    await ppage.locator('.side-map').tap();
    await ppage.waitForFunction(() => window.__quest.snapshot().menu?.tab === 'Map', null, { timeout: 3000 });
    check(true, 'tapping the minimap opens the map');
    await tapGame(14, 8); // the Status tab
    await ppage.waitForFunction(() => window.__quest.snapshot().menu?.tab === 'Status', null, { timeout: 3000 });
    check(true, 'tapping a tab opens it');
    await tapGame(314, 8); // the X
    await ppage.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 3000 });
    check(true, "tapping the menu's X closes it");
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

    // ---- Phone: a shop by taps, with the confirmation ------------------------------------------
    console.log('Phone shop (touch):');
    const shopCtx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const sp = await shopCtx.newPage();
    watchErrors(sp, errors);
    await sp.goto(GAME);
    await waitReady(sp);
    const shopCode = encodeSave({
      version: 2, era: 'present', settings: { textSpeed: 'instant', hints: false }, savedAt: 1,
      flags: { 'story.festival_intro': true, 'story.heard_speech': true, 'party.anissa': true }, mapId: 'zetwal-town', x: 12, y: 13, facing: 'left',
    });
    await sp.evaluate((c) => localStorage.setItem('bloodlines-quest.save', c), shopCode);
    await sp.reload();
    await waitReady(sp);
    const scdp = await shopCtx.newCDPSession(sp);
    const stap = async (fn, x, y) => {
      const p = await sp.evaluate(([f, a, b]) => window.__quest[f](a, b), [fn, x, y]);
      await scdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
      await scdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sp.waitForTimeout(150);
    };
    await stap('tileToScreen', 11, 13); // the market vendor, right beside Gianna
    for (let i = 0; i < 10 && (await snap(sp)).mode !== 'shop'; i++) await stap('gameToScreen', 160, 150);
    await sp.waitForFunction(() => window.__quest.snapshot().mode === 'shop', null, { timeout: 4000 });
    check(true, 'tapping the vendor, then her lines, opens her shop');
    const gold0 = (await snap(sp)).flags.gold ?? 150;
    await stap('gameToScreen', 60, 42 + 2 * 12 + 5); // choose the third item (the mango)
    await stap('gameToScreen', 60, 42 + 2 * 12 + 5); // tap it again: the confirmation
    let shop = (await snap(sp)).shop;
    check(shop.confirming && shop.message.startsWith('Buy Ripe mango for 10 gold?'), `tapping an item twice asks first ("${shop.message}")`);
    check(((await snap(sp)).flags.gold ?? 150) === gold0, 'nothing is bought before Yes');
    await stap('gameToScreen', 128, 124); // Yes
    shop = (await snap(sp)).shop;
    check(!shop.confirming && (await snap(sp)).flags.gold === gold0 - 10, `Yes buys it (gold ${gold0} to ${(await snap(sp)).flags.gold})`);
    await stap('gameToScreen', 296, 8); // Leave
    await sp.waitForFunction(() => window.__quest.snapshot().mode === 'field', null, { timeout: 3000 });
    check(true, 'tapping Leave closes the shop');
    await shopCtx.close();

    // ---- Phone, portrait (still playable, with a rotate hint) -------------------------------
    const portrait = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const pp = await portrait.newPage();
    watchErrors(pp, errors);
    await pp.goto(VILLAGE);
    await waitReady(pp);
    check(await pp.isVisible('.rotate-hint'), 'portrait shows the rotate hint');
    // Demo review, Oct 17: upright, nothing sits on anything else (Ask used to cover the minimap).
    const clash = await pp.evaluate(() => {
      const parts = ['.touch-dpad', '.touch-buttons', '.touch-ask', '.touch-top', '.side-map', '#game canvas', '.rotate-hint'];
      const r = parts.map((sel) => [sel, document.querySelector(sel)?.getBoundingClientRect()]).filter(([, b]) => b && b.width > 0);
      const out = [];
      for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
        const [a, A] = r[i];
        const [b, B] = r[j];
        if (A.left < B.right && B.left < A.right && A.top < B.bottom && B.top < A.bottom) out.push(`${a} / ${b}`);
      }
      return out;
    });
    check(clash.length === 0, `upright, the controls, the minimap and the picture do not overlap${clash.length ? ` (${clash.join(', ')})` : ''}`);
    await pp.screenshot({ path: join(SHOT_DIR, 'quest-phone-portrait.png') });
    await portrait.close();

    await hintsAndJournal(browser, errors);
    const introShots = await introFlow(browser, errors);
    await damagedSaveFlow(browser, errors);
    const debateShots = await debateFlow(browser, errors);
    const gameOverShots = await gameOverFlow(browser, errors);
    const actShots = await playAct(browser, errors);

    check(errors.length === 0, `no page errors${errors.length ? `:\n${errors.join('\n')}` : ''}`);
    if (TO) console.log(`(SMOKE_TO=${TO}: the scripted route stopped at @${TO}; run without it for the whole quest.)`);
    console.log(`Screenshots: ${['quest-desktop.png', 'quest-phone.png', 'quest3-stick-phone.png', 'quest-phone-portrait.png', ...fitShots, ...introShots, ...debateShots, ...gameOverShots, ...actShots].map((f) => join(SHOT_DIR, f)).join(', ')}`);
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
