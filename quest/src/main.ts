// Entry point: parse and check the maps, build the input layer and game state, load the save,
// then start Phaser at 240 x 160 with whole-number scaling.

import Phaser from 'phaser';
import { MAX_ZOOM, START_MAP_ID, START_SPAWN, VIEW_HEIGHT, VIEW_WIDTH } from './config.ts';
import { DIALOGUE, DIALOGUE_IDS } from './data/dialogue.ts';
import { loadRawMaps } from './data/maps.ts';
import { NPC_IDS } from './data/npcs.ts';
import { SPEAKERS } from './data/speakers.ts';
import { checkDialogue } from './engine/dialogue.ts';
import { validateMaps } from './engine/mapValidation.ts';
import { integerZoom } from './engine/scaling.ts';
import { newGame } from './engine/state.ts';
import { parseMap, type GameMap } from './engine/tiledMap.ts';
import { InputManager, type InputSource } from './input/actions.ts';
import { GamepadSource } from './input/gamepad.ts';
import { KeyboardSource } from './input/keyboard.ts';
import { TouchSource, isTouchDevice } from './input/touch.ts';
import { browserStorage, loadStoredGame, setRuntime, type Runtime } from './runtime.ts';
import { BootScene } from './scenes/BootScene.ts';
import { FieldScene } from './scenes/FieldScene.ts';
import './style.css';

function fail(message: string): never {
  const box = document.createElement('pre');
  box.className = 'boot-error';
  box.textContent = message;
  document.body.appendChild(box);
  throw new Error(message);
}

const rawMaps = loadRawMaps();
const problems = [
  ...validateMaps(rawMaps, { npcIds: NPC_IDS, dialogueIds: DIALOGUE_IDS }),
  ...checkDialogue(DIALOGUE, SPEAKERS),
];
if (problems.length > 0) fail(`Content problems:\n${problems.join('\n')}`);

const maps: Record<string, GameMap> = Object.fromEntries(
  Object.entries(rawMaps).map(([id, raw]) => [id, parseMap(id, raw)]),
);
const startMap = maps[START_MAP_ID] ?? fail(`Start map ${START_MAP_ID} is missing`);

const sources: InputSource[] = [new KeyboardSource(), new GamepadSource()];
if (isTouchDevice()) {
  document.body.classList.add('touch');
  sources.push(new TouchSource(document.body));
}

const runtime: Runtime = {
  maps,
  rawMaps,
  state: newGame(startMap, START_SPAWN),
  input: new InputManager(sources),
  storage: browserStorage(),
};
setRuntime(runtime);
const loaded = loadStoredGame(runtime);
if (loaded === 'invalid') console.warn('[quest] the stored save could not be loaded; starting a new game');

const zoom = () => integerZoom(window.innerWidth, window.innerHeight, VIEW_WIDTH, VIEW_HEIGHT, MAX_ZOOM);

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
  scale: { mode: Phaser.Scale.NONE, zoom: zoom(), autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, FieldScene],
});

window.addEventListener('resize', () => game.scale.setZoom(zoom()));
