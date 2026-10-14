// Entry point: parse and check the maps and content, build the input layer, the game logic and its
// state, load the save, then start Phaser at 240 x 160, fitted to the visible screen (src/ui/screen.ts).
//
// URL options (for development and the smoke test):
//   ?map=<id>        a new game (when there is no save) starts on that map's first spawn
//   ?hintms=<ms>     Anissa's first hint after this much stuck time instead of 3 minutes
//   ?touch=1         force the touch overlay

import Phaser from 'phaser';
import { HINT_FIRST_MS, HINT_REPEAT_MS, MAX_ZOOM, MIN_INTEGER_ZOOM, START_MAP_ID, START_SPAWN, VIEW_HEIGHT, VIEW_WIDTH } from './config.ts';
import { CONTENT, validationContext } from './data/content.ts';
import { loadRawMaps } from './data/maps.ts';
import { checkDialogue } from './engine/dialogue.ts';
import { GameLogic } from './engine/game.ts';
import { HintTracker } from './engine/hints.ts';
import { validateMaps } from './engine/mapValidation.ts';
import { fitZoom } from './engine/scaling.ts';
import { newGame } from './engine/state.ts';
import { parseMap, type GameMap } from './engine/tiledMap.ts';
import { InputManager, type InputSource } from './input/actions.ts';
import { GamepadSource } from './input/gamepad.ts';
import { KeyboardSource } from './input/keyboard.ts';
import { TouchSource, isTouchDevice } from './input/touch.ts';
import { browserStorage, loadStoredGame, setRuntime, type Runtime } from './runtime.ts';
import { BootScene } from './scenes/BootScene.ts';
import { FieldScene } from './scenes/FieldScene.ts';
import { mountFullscreenButton } from './ui/fullscreen.ts';
import { fitToScreen, preventBrowserZoom, visibleViewport } from './ui/screen.ts';
import './style.css';

function fail(message: string): never {
  const box = document.createElement('pre');
  box.className = 'boot-error';
  box.textContent = message;
  document.body.appendChild(box);
  throw new Error(message);
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
  logic: new GameLogic(maps, CONTENT, newGame(startMap, start.spawn)),
  input: new InputManager(sources),
  storage: browserStorage(),
  hints: new HintTracker(
    hintFirst > 0 ? { firstMs: hintFirst, repeatMs: hintFirst } : { firstMs: HINT_FIRST_MS, repeatMs: HINT_REPEAT_MS },
  ),
  start: { map: START_MAP_ID, spawn: START_SPAWN },
};
setRuntime(runtime);
const loaded = loadStoredGame(runtime);
if (loaded === 'invalid') console.warn('[quest] the stored save could not be loaded; starting a new game');

const vp = visibleViewport();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW_WIDTH,
  height: VIEW_HEIGHT,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#000000',
  banner: false,
  input: { keyboard: false, mouse: false, touch: false, gamepad: false },
  // The canvas is centred by CSS (#game is pinned to the visible viewport); src/ui/screen.ts sets the zoom.
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: fitZoom(vp.width, vp.height, VIEW_WIDTH, VIEW_HEIGHT, MAX_ZOOM, MIN_INTEGER_ZOOM),
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  scene: [BootScene, FieldScene],
});

game.events.once(Phaser.Core.Events.READY, () => fitToScreen((zoom) => game.scale.setZoom(zoom)));
mountFullscreenButton();
