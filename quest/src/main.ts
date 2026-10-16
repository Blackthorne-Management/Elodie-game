// Entry point: parse and check the maps and content, build the input layer, the game logic and its
// state, load the save, then start Phaser at 320 x 180, fitted to the visible screen (src/ui/screen.ts).
//
// URL options (for development and the smoke test):
//   ?map=<id>        a new game (when there is no save) starts on that map's first spawn
//   ?hintms=<ms>     Anissa's first hint after this much stuck time instead of 3 minutes
//   ?touch=1         force the touch overlay
//   ?intro=0         skip the animated intro and title (the smoke test's main route)
//   ?install=0|1     never / always show the phone install screen (engine/install.ts)

import Phaser from 'phaser';
import { HINT_FIRST_MS, HINT_REPEAT_MS, MAX_ZOOM, MIN_INTEGER_ZOOM, RENDER_SCALE_MAX, START_MAP_ID, START_SPAWN, VIEW_HEIGHT, VIEW_WIDTH } from './config.ts';
import { CONTENT, validationContext } from './data/content.ts';
import { loadRawMaps } from './data/maps.ts';
import { checkDialogue } from './engine/dialogue.ts';
import { GameLogic } from './engine/game.ts';
import { HintTracker } from './engine/hints.ts';
import { installGate } from './engine/install.ts';
import { INTRO_SEEN_KEY, introOpening } from './engine/intro.ts';
import { validateMaps } from './engine/mapValidation.ts';
import { fitZoom } from './engine/scaling.ts';
import { loadFonts, renderScale, setRenderScale } from './ui/text.ts';
import { newGame } from './engine/state.ts';
import { parseMap, type GameMap } from './engine/tiledMap.ts';
import { InputManager, type InputSource } from './input/actions.ts';
import { GamepadSource } from './input/gamepad.ts';
import { KeyboardSource } from './input/keyboard.ts';
import { TouchSource, isTouchDevice } from './input/touch.ts';
import { browserStorage, loadStoredGame, setRuntime, type Runtime } from './runtime.ts';
import { BootScene } from './scenes/BootScene.ts';
import { BattleScene } from './scenes/BattleScene.ts';
import { FieldScene } from './scenes/FieldScene.ts';
import { IntroScene } from './scenes/IntroScene.ts';
import { isStandalone, mountFullscreenButton } from './ui/fullscreen.ts';
import { mountInstallScreen } from './ui/installScreen.ts';
import { fitToScreen, preventBrowserZoom, visibleViewport } from './ui/screen.ts';
import './style.css';

function fail(message: string): never {
  const box = document.createElement('pre');
  box.className = 'boot-error';
  box.textContent = message;
  document.body.appendChild(box);
  throw new Error(message);
}

// A phone or tablet in the browser installs the quest first (owner decision, Oct 16); the game never starts.
const gate = installGate({
  userAgent: navigator.userAgent,
  maxTouchPoints: navigator.maxTouchPoints ?? 0,
  standalone: isStandalone(),
  param: new URLSearchParams(location.search).get('install'),
  dev: import.meta.env.DEV,
});
if (gate !== 'play') {
  mountInstallScreen(gate);
  await new Promise<never>(() => undefined);
}

const rawMaps = loadRawMaps();
const problems = [...validateMaps(rawMaps, validationContext()), ...checkDialogue(CONTENT.dialogue, CONTENT.speakers)];
if (problems.length > 0) fail(`Content problems:\n${problems.join('\n')}`);

const maps: Record<string, GameMap> = Object.fromEntries(
  Object.entries(rawMaps).map(([id, raw]) => [id, parseMap(id, raw)]),
);

const params = new URLSearchParams(location.search);
const askedMap = params.get('map');
const start =
  askedMap && maps[askedMap]
    ? { map: askedMap, spawn: maps[askedMap]!.spawns[0]!.id }
    : { map: START_MAP_ID, spawn: START_SPAWN };
const startMap = maps[start.map] ?? fail(`Start map ${start.map} is missing`);
const hintFirst = Number(params.get('hintms'));

preventBrowserZoom();

const sources: InputSource[] = [new KeyboardSource(), new GamepadSource()];
if (isTouchDevice()) {
  document.body.classList.add('touch');
  sources.push(new TouchSource(document.body));
}

const runtime: Runtime = {
  maps,
  rawMaps,
  // The encounter dice: a new seed each session (the engine itself never calls Math.random).
  logic: new GameLogic(maps, CONTENT, newGame(startMap, start.spawn), Date.now() >>> 0),
  input: new InputManager(sources),
  storage: browserStorage(),
  hints: new HintTracker(
    hintFirst > 0 ? { firstMs: hintFirst, repeatMs: hintFirst } : { firstMs: HINT_FIRST_MS, repeatMs: HINT_REPEAT_MS },
  ),
  start: { map: START_MAP_ID, spawn: START_SPAWN },
  intro: null,
};
setRuntime(runtime);
const loaded = loadStoredGame(runtime);
if (loaded === 'invalid') console.warn('[quest] the stored save could not be loaded; starting a new game');
runtime.intro = params.get('intro') === '0' ? null : introOpening(loaded === 'loaded', !!runtime.storage?.getItem(INTRO_SEEN_KEY));

const vp = visibleViewport();
const startZoom = fitZoom(vp.width, vp.height, VIEW_WIDTH, VIEW_HEIGHT, MAX_ZOOM, MIN_INTEGER_ZOOM);
// Draw the game at the screen's sharpness (the zoom times the device's pixel ratio, in whole steps,
// up to RENDER_SCALE_MAX): the layout stays 320 x 180, the camera zooms by the same multiple, and text
// is rendered at it (ui/text.ts). The browser then only scales the canvas by the rest.
setRenderScale(Math.min(RENDER_SCALE_MAX, Math.max(1, Math.ceil(startZoom * (window.devicePixelRatio || 1) - 0.01))));
const S = renderScale();
await loadFonts();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_WIDTH * S,
  height: VIEW_HEIGHT * S,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#000000',
  banner: false,
  // Keys and gamepads go through src/input; Phaser only reads taps and clicks on the picture (tap to move).
  input: { keyboard: false, mouse: true, touch: true, gamepad: false },
  // The canvas is centred by CSS (#game is pinned to the visible viewport); src/ui/screen.ts sets the zoom.
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: startZoom / S,
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  scene: [BootScene, IntroScene, FieldScene, BattleScene],
});

game.events.once(Phaser.Core.Events.READY, () => fitToScreen((zoom) => game.scale.setZoom(zoom / S), isTouchDevice()));
mountFullscreenButton();
