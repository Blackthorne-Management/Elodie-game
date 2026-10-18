// The field: draws the current map for the current era and animates what the game logic
// (engine/game.ts) decides: steps (eight directions), doors, triggers, talking, puzzle objects, the
// Echo swap with its screen filter, dialogue and end cards. It shows what can be used (markers over
// people and things, a name label over what the player faces, a glow on what the Echo changed). It
// also runs Anissa (who follows Gianna, and holds the door while Gianna is in the Echo), her hints,
// the Journal, Credits and the pause menu. All rules come from the engine; all content from
// src/data; every visual from assets.config.ts.

import Phaser from 'phaser';
import {
  ANISSA_GLOW,
  CARD_ART,
  QUEST_ARROW,
  CHARACTER_LABEL_GAP,
  ECHO_DITHER_TEXTURE,
  ECHO_FILTER,
  MAP_MOODS,
  ECHO_PLAYER_LOOK,
  MARKER_TEXTURES,
  OBJECT_ART,
  PLAYER_LOOK,
  TILESET,
  UI,
  characterFrame,
  textureKeyForCharacter,
  textureKeyForObject,
} from '../assets.config.ts';
import { CHARACTER_HEIGHT, SAVE_STORAGE_KEY, TEXT_SPEED_ORDER, TILE_SIZE, VIEW_HEIGHT, VIEW_WIDTH, WALK_CYCLE_PX } from '../config.ts';
import { CREDITS, CREDITS_INTRO } from '../data/credits.ts';
import { CHAPTERS, JOURNAL_NOTES } from '../data/quests.ts';
import { evaluate } from '../engine/conditions.ts';
import type { Effect, GameLogic, Target } from '../engine/game.ts';
import { DIRS, type Dir8, type Era, type Pos } from '../engine/types.ts';
import { combine, facingToward, opposite, samePos, spriteFacing, stepFrom } from '../engine/grid.ts';
import { Mover, restDistance, speedPx, stepLength, tileFoot, walkFrame } from '../engine/motion.ts';
import { cameraBounds, cameraScroll } from '../engine/scaling.ts';
import { dirButtons } from '../input/actions.ts';
import { currentObjective, journalEntries, journalNotes, questForJournal, questForMap, type QuestDef } from '../engine/quests.ts';
import { decodeSave, deleteSave, encodeSave } from '../engine/save.ts';
import { applySave, newGame, saveFits, toSaveData } from '../engine/state.ts';
import { TILE_LAYERS, rectTiles, visibleLayersFor, type GameMap, type NpcPlacement, type TiledMap } from '../engine/tiledMap.ts';
import { getRuntime, saveGame, type Runtime } from '../runtime.ts';
import { DialogueBox } from '../ui/DialogueBox.ts';
import { HintBubble } from '../ui/HintBubble.ts';
import { isFullscreen, isStandalone, toggleFullscreen } from '../ui/fullscreen.ts';
import { GameMenu, type MenuRequest, type MenuTab } from '../ui/GameMenu.ts';
import type { MenuItem } from '../ui/MenuPanel.ts';
import { SideMap } from '../ui/SideMap.ts';
import { ShopPanel } from '../ui/ShopPanel.ts';
import { RhythmPanel } from '../ui/RhythmPanel.ts';
import { ItemShowcase } from '../ui/ItemShowcase.ts';
import { battleFx, battleSnapshot, type BattleSnapshot } from './BattleScene.ts';
import type { FxKind } from './battleFx.ts';
import type { BattleResult } from '../engine/battle.ts';
import { renderScale, setTextSize, textSize, textStyle } from '../ui/text.ts';
import { itemArtKey } from '../assets.config.ts';
import { markShown, pendingShowcases, showcaseView } from '../engine/showcase.ts';
import { RPG } from '../data/rpg.ts';
import { addSharedXp, cityOf, level, partyMembers, pillarFlag } from '../engine/rpg.ts';
import { settleDebates } from '../engine/debate.ts';
import { DEBATES } from '../data/debates.ts';
import { rewardText, settleRewards } from '../engine/sideQuests.ts';
import { SIDE_QUESTS } from '../data/sideQuests.ts';
import { sideGoals, storyGoal, waypoint, type Waypoint } from '../engine/guide.ts';
import { questArrows, setQuestArrows } from '../ui/questArrows.ts';
import { planTap } from '../engine/tap.ts';
import { audio } from '../audio/player.ts';
import { BATTLE_MUSIC, CARD_MUSIC, DIALOGUE_MUSIC, ECHO_MUSIC, MUSIC_BY_MAP, MUSIC_OVERRIDES, VOLUME_STEPS } from '../audio.config.ts';
import { blipDue, musicFor, nextVolume, volumeLabel } from '../engine/audioPlan.ts';
import { echoPrompt } from '../engine/world.ts';
import { isTouchDevice } from '../input/touch.ts';
import { npcMoves, walkRoute } from '../engine/walkers.ts';
import { crowdSpots, crowdStep } from '../engine/crowd.ts';
import { Rng } from '../engine/rng.ts';
import { STAGE_FOLLOWER, STAGE_NPC, STAGE_PLAYER, type StageCue } from '../engine/stage.ts';
import { TextPanel, type PanelLine } from '../ui/TextPanel.ts';
import { Toast } from '../ui/Toast.ts';
import { openExportDialog, openImportDialog } from '../ui/saveCodeDialog.ts';
import { tilemapKey } from './BootScene.ts';

type UiMode = 'field' | 'dialogue' | 'card' | 'menu' | 'journal' | 'modal' | 'shop' | 'showcase' | 'battle' | 'rhythm';

/** How long the glow on an object changed through the Echo lasts. */
const CHANGED_GLOW_MS = 3600;

interface Follower {
  sprite: Phaser.GameObjects.Image;
  pos: Pos;
  from: Pos;
  facing: Dir8;
  glow: Phaser.Tweens.Tween | null;
  /** Pixels walked (her own walk cycle) and how far through the player's current step she was. */
  distance: number;
  lastT: number;
}

/** The tiles from `a` to `b` in a straight line (not including `a`), for a boat gliding over water. */
function straightLine(a: Pos, b: Pos): Pos[] {
  const n = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  return Array.from({ length: n }, (_, i) => ({ x: Math.round(a.x + ((b.x - a.x) * (i + 1)) / n), y: Math.round(a.y + ((b.y - a.y) * (i + 1)) / n) }));
}

/** Someone on stage: a sprite walking a route like the walkers, gone when an exit reaches its door. */
interface StageActor {
  sprite: Phaser.GameObjects.Image;
  look: string;
  at: Pos;
  facing: Dir8;
  mover: Mover;
  tiles: Pos[];
  run: boolean;
  /** Turn this way on arrival. */
  endFacing?: Dir8;
  /** Leave the stage on arrival. */
  leaving: boolean;
  /** Borrowed from the map: an NPC's placement (by object id), Anissa following, or Yari. Never destroyed here. */
  borrowed?: number | 'follower' | 'yari';
}

export interface FieldSnapshot {
  mode: UiMode;
  mapId: string;
  x: number;
  y: number;
  facing: Dir8;
  era: string;
  moving: boolean;
  /** The name label over what the player faces (null when none shows). */
  label: string | null;
  /** Interaction markers shown (`npc:<object id>` or `obj:<object id>`). */
  markers: string[];
  /** Objects glowing because the Echo changed them. */
  glowing: string[];
  /** The objects that glowed after the last Echo change (the glow itself fades after a few seconds). */
  glowed: string[];
  flags: Record<string, unknown>;
  dialogue: ReturnType<DialogueBox['snapshot']>;
  menu: ReturnType<GameMenu['snapshot']>;
  shop: ReturnType<ShopPanel['snapshot']>;
  /** A scene being acted out (engine/stage.ts): busy until the line can show; who is on stage, and where. */
  stage: { busy: boolean; actors: { id: string; x: number; y: number; moving: boolean }[] };
  /** The rhythm lock on screen (null when none). */
  rhythm: ReturnType<RhythmPanel['snapshot']>;
  /** The item showcase on screen (null when none). */
  showcase: ReturnType<ItemShowcase['snapshot']>;
  /** The battle on screen (null when none). */
  battle: BattleSnapshot | null;
  minimap: string | null;
  journal: string[] | null;
  card: string[] | null;
  toast: string;
  hint: string;
  objective: string | null;
  echoFilter: boolean;
  follower: { x: number; y: number; glowing: boolean } | null;
  /** Yari walking behind Anissa, once she is in the party (demo review, Oct 17). */
  yari: { x: number; y: number; visible: boolean } | null;
  /** How many of the festival's passers-by are on the map. */
  crowd: number;
  /** The quest arrow: where the story points on this map, and whether the arrow or the goal's marker shows. */
  guide: { x: number; y: number; final: boolean; arrow: boolean; mark: boolean } | null;
}

const ERA_LAYERS = [TILE_LAYERS.groundPresent, TILE_LAYERS.decoPresent, TILE_LAYERS.groundEcho, TILE_LAYERS.decoEcho];

const tileToWorld = tileFoot;

/** Show a character look facing a direction (diagonals show their sprite facing), at a walk frame. */
function setLook(sprite: Phaser.GameObjects.Image, look: string, facing: Dir8, step: 0 | 1 | 2 = 0): void {
  sprite.setTexture(textureKeyForCharacter(look), characterFrame(spriteFacing(facing), step));
}

/** One minimap for the whole page (scenes restart on every map change). */
let sideMap: SideMap | null = null;
function sharedSideMap(): SideMap {
  sideMap ??= new SideMap(document.body);
  return sideMap;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class FieldScene extends Phaser.Scene {
  private rt!: Runtime;
  private map!: GameMap;
  private layers: Record<string, Phaser.Tilemaps.TilemapLayer> = {};
  private player!: Phaser.GameObjects.Image;
  private npcSprites = new Map<number, Phaser.GameObjects.Image>();
  /** Where each drawn NPC stood at the last sync (to see who moved). */
  private npcPlaced = new Map<number, NpcPlacement>();
  /** People walking to their new place (engine/walkers.ts), by the placement they walk to. */
  private walkers = new Map<number, { mover: Mover; at: Pos; tiles: Pos[]; look: string; facing: Dir8 }>();
  /** The people a scene's stage directions put on the map (engine/stage.ts), by actor name. */
  private stageActors = new Map<string, StageActor>();
  /** The cues still to start for the current line, and what to do once the blocking ones have finished. */
  private stageQueue: StageCue[] = [];
  private stageBlocking: StageActor | null = null;
  private stageWaitMs = 0;
  private stageThen: (() => void) | null = null;
  /** Whom the camera follows during a scene (an actor's name), or null for the player. */
  private stageCamera: string | null = null;
  private objectSprites = new Map<string, Phaser.GameObjects.GameObject[]>();
  private markerSprites = new Map<string, Phaser.GameObjects.Image>();
  private label!: Phaser.GameObjects.Container;
  private labelText!: Phaser.GameObjects.Text;
  /** "Press E to Echo" while standing where an Echo works. */
  private echoText!: Phaser.GameObjects.Text;
  private labelBg!: Phaser.GameObjects.Graphics;
  private labelKey = '';
  /** Objects the Echo changed, waiting to glow once the player is back in the field. */
  private pendingGlow: string[] = [];
  private glowing = new Set<string>();
  /** What glowed last after an Echo (the smoke test reads it: the glow itself lasts only a few seconds). */
  private lastGlowed: string[] = [];
  private follower: Follower | null = null;
  /** Yari, behind Anissa (or Gianna), while she is in the party. */
  private yari: Follower | null = null;
  /** Where the story wants the player next on this map (engine/guide.ts), and the arrow and marker for it. */
  private guideWay: Waypoint | null = null;
  private guideArrow: Phaser.GameObjects.Graphics | null = null;
  private guideMark: Phaser.GameObjects.Graphics | null = null;
  private guideT = 0;
  /** The picture behind an act's end card, while it shows (assets.config CARD_ART). */
  private cardArt: Phaser.GameObjects.Image | null = null;
  /** Where a scene last left Yari before she joined (she follows on from there, not from a jump). */
  private yariStaged: Pos | null = null;
  /** The festival's passers-by (engine/crowd.ts): pictures that stroll, by crowd zone. */
  private crowd: { zone: string; sprite: Phaser.GameObjects.Image; at: Pos; mover: Mover; look: string; facing: Dir8; waitMs: number }[] = [];
  /** Only for where the crowd strolls (looks, not the game: the simulator never sees them). */
  private crowdRng = new Rng(Date.now() >>> 0);
  private echoWash!: Phaser.GameObjects.Rectangle;
  /** The map's mood wash (assets.config.ts MAP_MOODS), when one applies. */
  private moodWash!: Phaser.GameObjects.Rectangle;
  private echoDither!: Phaser.GameObjects.TileSprite;
  private echoMatrix: Phaser.FX.ColorMatrix | null = null;
  private dialogue!: DialogueBox;
  private menu!: GameMenu;
  private shopPanel!: ShopPanel;
  private rhythmPanel!: RhythmPanel;
  private showcase!: ItemShowcase;
  /** The mode to go back to when the item showcase closes. */
  private showcaseReturn: UiMode = 'field';
  /** The rhythm lock being played. */
  private rhythmLock = '';
  private minimap: SideMap | null = null;
  private toast!: Toast;
  private hint!: HintBubble;
  private panel!: TextPanel;
  private mode: UiMode = 'field';
  /** Gianna's smooth motion between tiles (engine/motion.ts). */
  private mover = new Mover();
  /** A direction tapped just before a step ended, taken as the next step. */
  private buffered: Dir8 | null = null;
  /** Set when a door changes the map: no further step on this scene. */
  private leaving = false;
  private camBounds = { x: 0, y: 0, width: VIEW_WIDTH, height: VIEW_HEIGHT };
  private talkingTo: NpcPlacement | null = null;
  private confirmNewGame = false;
  /** Tap to move: the steps still to walk, then the way to face and interact (engine/tap.ts). */
  private autoPath: Dir8[] = [];
  private autoFace: Dir8 | null = null;
  /** Each fighter's level when last checked (a rise shows "reached level n"). */
  private lastLevels = new Map<string, number>();
  private lastFx: string | undefined;

  constructor() {
    super('field');
  }

  private get logic(): GameLogic {
    return this.rt.logic;
  }

  create(data: { toast?: string }): void {
    this.rt = getRuntime();
    this.mode = 'field';
    this.mover = new Mover();
    this.buffered = null;
    this.leaving = false;
    this.layers = {};
    this.npcSprites = new Map();
    this.npcPlaced = new Map();
    this.walkers = new Map();
    // A scene can end on another map (out of the caney into the plaza): the old map's actors went with it.
    this.stageActors = new Map();
    this.stageQueue = [];
    this.stageBlocking = null;
    this.stageWaitMs = 0;
    this.stageThen = null;
    this.stageCamera = null;
    this.objectSprites = new Map();
    this.markerSprites = new Map();
    this.labelKey = '';
    this.pendingGlow = [];
    this.glowing = new Set();
    this.lastGlowed = [];
    this.follower = null;
    this.yari = null;
    this.crowd = [];
    this.cardArt = null;
    this.guideWay = null;
    this.guideArrow = null;
    this.guideMark = null;
    this.echoMatrix = null;
    this.autoPath = [];
    this.autoFace = null;
    this.lastLevels = this.levelsNow();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onTap(p));
    this.map = this.logic.map;

    const tilemap = this.make.tilemap({ key: tilemapKey(this.map.id) });
    const tileset = tilemap.addTilesetImage(TILESET.name, TILESET.textureKey);
    if (!tileset) throw new Error(`Map ${this.map.id} has no "${TILESET.name}" tileset`);
    // No tile culling: the camera zooms from its top-left corner (the render scale), which Phaser's
    // culling misreads as looking elsewhere; the maps are small, so drawing every tile costs little.
    ERA_LAYERS.forEach((name, i) => {
      const layer = tilemap.createLayer(name, tileset, 0, 0);
      if (layer) this.layers[name] = layer.setSkipCull(true).setDepth(i % 2).setVisible(true);
    });
    tilemap.createLayer(TILE_LAYERS.above, tileset, 0, 0)?.setSkipCull(true).setDepth(3000);

    // Echo Zones shimmer.
    for (const zone of this.map.echoZones) {
      const a = zone.area;
      const x = a.x * TILE_SIZE;
      const y = a.y * TILE_SIZE;
      const w = a.width * TILE_SIZE;
      const h = a.height * TILE_SIZE;
      const glow = this.add
        .rectangle(x - 3, y - 3, w + 6, h + 6, UI.echoZone, UI.echoZoneGlowAlpha)
        .setOrigin(0, 0)
        .setDepth(2)
        .setBlendMode(Phaser.BlendModes.ADD);
      const r = this.add.rectangle(x, y, w, h, UI.echoZone, UI.echoZoneAlpha).setOrigin(0, 0).setDepth(2);
      r.setStrokeStyle(1, UI.echoZoneRim, UI.echoZoneRimAlpha);
      this.tweens.add({ targets: r, fillAlpha: UI.echoZonePulseAlpha, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: glow, alpha: 0.35, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    const state = this.logic.state;
    const p = tileToWorld(state.player.pos);
    this.player = this.add.image(p.x, p.y, textureKeyForCharacter(this.playerLook())).setOrigin(0.5, 1);
    setLook(this.player, this.playerLook(), state.player.facing);
    this.player.setDepth(10 + p.y);

    // The camera follows Gianna and stops at the map's edges; a map smaller than the screen is centred.
    // It is placed by hand every frame from her exact position, rounded to whole pixels together with
    // her sprite, so she never shimmers against the world (placeCamera).
    const cam = this.cameras.main;
    // Drawn at the render scale (ui/text.ts): the camera zooms by it from the top-left corner, so the
    // world and the interface keep their 320 x 180 layout and only get sharper.
    cam.setOrigin(0, 0).setZoom(renderScale());
    this.camBounds = cameraBounds(this.map.width * TILE_SIZE, this.map.height * TILE_SIZE, VIEW_WIDTH, VIEW_HEIGHT);
    cam.setRoundPixels(true);
    this.placeCamera(p);

    // The Echo filter: a warm wash and a dither pattern over the world (under the interface), plus a
    // sepia colour matrix on WebGL.
    this.echoWash = this.add
      .rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT, ECHO_FILTER.wash, ECHO_FILTER.washAlpha)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(4000);
    this.moodWash = this.add.rectangle(0, 0, VIEW_WIDTH, VIEW_HEIGHT, 0x000000, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(3990).setVisible(false);
    this.echoDither = this.add
      .tileSprite(0, 0, VIEW_WIDTH, VIEW_HEIGHT, ECHO_DITHER_TEXTURE)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setAlpha(ECHO_FILTER.ditherAlpha)
      .setDepth(4001);

    // The name label over what the player faces (world space, above the actors, under the interface).
    this.labelBg = this.add.graphics();
    this.labelText = this.add.text(0, 0, '', textStyle(UI.labelText)).setOrigin(0.5, 1);
    this.echoText = this.add
      .text(VIEW_WIDTH / 2, VIEW_HEIGHT - 4, '', textStyle(UI.text, { backgroundColor: '#14101af0', padding: { x: 4, y: 2 } }))
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(6900)
      .setVisible(false);
    this.label = this.add.container(0, 0, [this.labelBg, this.labelText]).setDepth(3500).setVisible(false);

    this.dialogue = new DialogueBox(this);
    // Wordless voices: a blip at the speaker's pitch every other letter (a soft tick for narration).
    this.dialogue.onType = (speaker, text, before, after) => {
      if (!blipDue(text, before, after)) return;
      if (speaker) audio.voice(speaker);
      else audio.sfx('tick');
    };
    this.menu = new GameMenu(this);
    this.shopPanel = new ShopPanel(this);
    this.rhythmPanel = new RhythmPanel(this);
    this.showcase = new ItemShowcase(this);
    this.toast = new Toast(this);
    this.hint = new HintBubble(this);
    this.panel = new TextPanel(this);
    if (data?.toast) this.toast.show(data.toast);

    this.applyEra();
    this.syncActors();
    this.placeFollower();

    this.rt.input.clearPresses();
    window.__quest = {
      ready: true,
      snapshot: () => this.snapshot(),
      tileToScreen: (x, y) => this.tileToScreen(x, y),
      gameToScreen: (x, y) => this.gameToScreen(x, y),
      showItem: (id) => this.openShowcase(id),
      startBattle: (id, extra) => this.startBattle(id, extra),
      battleFx: (kind, at) => battleFx(kind, at),
    };
    this.events.off('battle-done');
    this.events.on('battle-done', (r: BattleResult | null) => this.afterBattle(r));

    // Resume a dialogue or card the logic is in (after a door), then run on-enter scenes.
    if (this.logic.mode === 'dialogue') this.enterDialogueMode();
    else if (this.logic.mode === 'card') this.showCard();
    else this.handle(this.logic.enterMap());
  }

  update(_time: number, delta: number): void {
    const input = this.rt.input;
    input.update();
    this.tickWalkers(delta);
    this.tickCrowd(delta);
    this.tickGuide(delta);
    if (this.cardArt && this.mode !== 'card') {
      this.cardArt.destroy();
      this.cardArt = null;
    }
    this.tickStage(delta);
    this.updateEchoPrompt();
    this.syncMusic();
    this.uiSounds();
    // In a bar the minimap always shows; on the picture (no bars) only in the field, out of the way of
    // Anissa's hint, menus, shops and dialogue.
    const onPicture = document.body.dataset.layout === 'overlay';
    this.minimap?.setVisible(!onPicture || (this.mode === 'field' && !this.hint.visible));
    // A newly received important item interrupts the field or a conversation (engine/showcase.ts).
    if (this.mode === 'field' || this.mode === 'dialogue') this.showPendingItem();
    switch (this.mode) {
      case 'field':
        this.tickHints(delta);
        this.updateField(delta);
        this.minimap?.follow(this.logic.state.player.pos);
        this.updateLabel();
        this.startPendingGlow();
        break;
      case 'dialogue': {
        // A press made while the line was still typing only finishes it, even if the typing ends in
        // this same frame (otherwise it would also pick the first answer).
        const wasTyping = this.dialogue.typing;
        this.dialogue.update(delta);
        this.updateDialogue(wasTyping);
        break;
      }
      case 'card':
        if (input.pressed('confirm')) {
          this.panel.close();
          this.mode = 'field';
          this.handle(this.logic.closeCard());
          input.clearPresses();
        }
        break;
      case 'journal':
        if (input.pressed('up')) this.panel.scrollBy(-12);
        if (input.pressed('down')) this.panel.scrollBy(12);
        if (input.pressed('cancel') || input.pressed('menu') || input.pressed('confirm')) {
          this.panel.close();
          this.closeMenu();
        }
        break;
      case 'menu':
        this.updateMenu();
        break;
      case 'shop':
        if (this.shopPanel.update(input)) {
          this.shopPanel.close();
          this.mode = 'field';
          input.clearPresses();
        }
        break;
      case 'showcase':
        if (this.showcase.update(input)) this.closeShowcase();
        break;
      case 'rhythm': {
        const out = this.rhythmPanel.update(input, delta);
        if (out) this.finishRhythm('ok' in out ? out.ok : null);
        break;
      }
      case 'modal':
        break;
    }
  }

  // ---- Battles -------------------------------------------------------------------------------

  /** A battle (data/battles.ts) over the paused field; the battle scene reports back with 'battle-done'. */
  private startBattle(id: string, extra?: string[]): void {
    if (this.mode === 'dialogue') this.leaveDialogueMode();
    this.cancelWalk();
    this.mode = 'battle';
    this.minimap?.setVisible(false);
    this.label.setVisible(false);
    this.hint.hide();
    this.scene.launch('battle', { battle: id, extra });
    this.scene.pause();
  }

  private afterBattle(result: BattleResult | null): void {
    this.mode = 'field';
    this.rt.input.clearPresses();
    if (result) {
      const items = result.items.map((i) => RPG.items[i.id]?.name ?? i.id);
      this.toast.show(`Won! +${result.xp} XP, +${result.gold} gold${items.length ? `, ${items.join(', ')}` : ''}`);
    }
    this.checkProgress();
    this.handle([{ kind: 'sync' }]);
    saveGame(this.rt);
    // The scene a fight leads into (the pier: the marines flee, the fisher speaks), at once.
    this.handle(this.logic.battleOver(result !== null));
  }

  // ---- The rhythm lock -----------------------------------------------------------------------

  /** The song is over (ok: played right or not) or given up (null: nothing happens). */
  private finishRhythm(ok: boolean | null): void {
    this.rhythmPanel.close();
    this.mode = 'field';
    this.rt.input.clearPresses();
    if (ok === null) return;
    audio.sfx(ok ? 'quest' : 'bump');
    this.handle(this.logic.finishRhythm(this.rhythmLock, ok));
  }

  // ---- The item showcase ---------------------------------------------------------------------

  /** Show the first important item received and not yet presented, if any. */
  private showPendingItem(): void {
    const item = pendingShowcases(this.logic.state.flags, RPG)[0];
    if (!item) return;
    markShown(this.logic.state.flags, item.id);
    this.openShowcase(item.id);
  }

  /** Show an item's showcase over whatever is on screen (also the menu's replay). */
  private openShowcase(id: string): void {
    const item = RPG.items[id];
    if (!item) return;
    audio.sfx('item');
    this.cancelWalk();
    this.showcaseReturn = this.mode;
    this.mode = 'showcase';
    this.dialogue.conceal(true);
    this.hint.hide();
    this.showcase.open(showcaseView(this.logic.state.flags, item), itemArtKey(item.art ?? item.id, item.kind));
    this.rt.input.clearPresses();
  }

  private closeShowcase(): void {
    this.showcase.close();
    this.dialogue.conceal(false);
    this.mode = this.showcaseReturn;
    this.rt.input.clearPresses();
  }

  // ---- Effects -------------------------------------------------------------------------------

  /** Show what the logic did. */
  private handle(effects: Effect[]): void {
    let changeMap = false;
    let voyage = '';
    for (const e of effects) {
      switch (e.kind) {
        case 'map':
          changeMap = true;
          audio.sfx('door');
          break;
        case 'save':
          this.toast.show(saveGame(this.rt) ? 'Autosaved' : 'Could not save');
          break;
        case 'toast':
          this.toast.show(e.text);
          break;
        case 'refused':
          this.toast.show(e.text);
          this.cameras.main.shake(120, 0.004);
          audio.sfx('bump');
          break;
        case 'era':
          audio.sfx(e.era === 'echo' ? 'echo_in' : 'echo_out');
          this.swapVisuals(e.era);
          break;
        case 'sync':
          this.syncActors();
          this.applyMood();
          this.checkProgress();
          break;
        case 'talk': {
          this.talkingTo = e.npc;
          const def = this.logic.content.npcs[e.npc.npc];
          const sprite = this.npcSprites.get(e.npc.objectId);
          if (def && sprite) setLook(sprite, def.look, facingToward(e.npc.pos, this.logic.state.player.pos));
          break;
        }
        case 'changed':
          this.pendingGlow.push(...e.objects);
          break;
        case 'dialogue':
          this.enterDialogueMode();
          break;
        case 'card':
          this.showCard();
          break;
        case 'battle':
          this.startBattle(e.battle);
          break;
        case 'shop': {
          // A vendor's greeting ended: their shop opens over the field.
          const shop = RPG.shops[e.shop];
          if (!shop) break;
          if (this.mode === 'dialogue') this.leaveDialogueMode();
          this.shopPanel.open(shop, this.logic.state.flags);
          this.mode = 'shop';
          break;
        }
        case 'rhythm': {
          // A rhythm lock (the drum song on the stones): the panel plays it over the field.
          const def = this.logic.content.rhythms?.[e.lock];
          if (!def) break;
          if (this.mode === 'dialogue') this.leaveDialogueMode();
          this.cancelWalk();
          this.hint.hide();
          this.label.setVisible(false);
          this.rhythmLock = e.lock;
          this.rhythmPanel.open(def, e.slow);
          this.mode = 'rhythm';
          this.rt.input.clearPresses();
          break;
        }
        case 'encounter':
          // An ambush: a red flash before the foes speak, then the battle.
          this.cameras.main.flash(250, 180, 40, 40);
          break;
        case 'voyage':
          voyage = e.voyage;
          break;
      }
    }
    if (changeMap && voyage) {
      // The party has already landed in the logic; the voyage plays, then the field opens on the new map.
      this.leaving = true;
      this.scene.start('voyage', { voyage });
      return;
    }
    if (changeMap) {
      this.leaving = true;
      this.scene.restart({ toast: this.toast.lastMessage });
      return;
    }
    if (this.logic.mode === 'field' && this.mode === 'dialogue') this.leaveDialogueMode();
  }

  // ---- Field ---------------------------------------------------------------------------------

  private updateField(delta: number): void {
    const input = this.rt.input;
    if (this.mover.moving) {
      const speed = speedPx(input.held('run'));
      // A direction tapped just before the step ends is kept for the next one.
      if (this.mover.inBufferWindow(speed) && (['up', 'down', 'left', 'right'] as const).some((d) => input.pressed(d))) {
        this.buffered = input.move();
      }
      this.mover.update(delta, speed, (reached) => this.arrive(reached));
      this.drawPlayer();
      return;
    }

    if (input.pressed('menu') || input.pressed('confirm') || input.pressed('echo') || input.move()) this.cancelWalk();
    if (input.pressed('menu')) {
      this.openMenu();
      return;
    }
    if (input.pressed('confirm')) {
      this.handle(this.logic.interact());
      return;
    }
    if (input.pressed('echo')) {
      this.handle(this.logic.swap());
      return;
    }
    // Q, the Ask button or Y on a controller: the same as "Ask Anissa" in the menu.
    if (input.pressed('ask')) {
      this.cancelWalk();
      if (this.anissaWithUs()) {
        audio.sfx('confirm');
        this.askAnissa();
      } else this.toast.show("Anissa isn't with you right now.");
      return;
    }
    if (this.autoPath.length > 0 || this.autoFace) {
      this.walkOn();
      return;
    }
    const dir = input.move();
    if (!dir) return;
    const from = { ...this.logic.state.player.pos };
    const to = this.stepToward(dir);
    if (to) this.mover.start(from, to);
    this.drawPlayer();
  }

  /**
   * A step ended on `to`: let the logic land there (doors, triggers), then, while a direction is still
   * held (or was tapped just before), return the next tile so the walk goes on without a pause.
   */
  private arrive(to: Pos): Pos | null {
    this.handle(this.logic.finishStep(to));
    const buffered = this.buffered;
    this.buffered = null;
    if (this.leaving || this.mode !== 'field' || !this.scene.isActive()) {
      this.cancelWalk(); // a scene or a door stops a tapped walk
      return null;
    }
    const input = this.rt.input;
    const held = input.move();
    const dir = held && input.heldDir(held) ? held : buffered;
    if (dir) {
      this.cancelWalk();
      return this.stepToward(dir);
    }
    // A tapped walk goes straight on into its next step.
    const next = this.autoPath.shift();
    if (!next) return null;
    const onward = this.stepToward(next, false);
    if (!onward) this.cancelWalk();
    return onward;
  }

  // ---- Rewards and levels --------------------------------------------------------------------

  private levelsNow(): Map<string, number> {
    const flags = this.logic.state.flags;
    return new Map(partyMembers(flags, RPG, 'present').filter((m) => !m.support).map((m) => [m.id, level(flags, RPG, m.id)]));
  }

  /** Pay finished side quests (once) and announce level-ups. */
  private checkProgress(): void {
    const flags = this.logic.state.flags;
    const addPillar = (p: 'influence' | 'fear', city: string, n: number) => {
      const f = pillarFlag(p, city);
      const v = flags.get(f);
      flags.set(f, (typeof v === 'number' ? v : 0) + n);
    };
    for (const pay of settleDebates(flags, DEBATES, addPillar, (n) => addSharedXp(flags, n))) {
      const label = pay.outcome === 'listened' ? 'Heard the debate' : pay.outcome === 'won' ? 'Debate won' : pay.outcome === 'mediated' ? 'Debate mediated' : 'Crowd provoked';
      this.toast.show(`${label}: ${pay.text}`);
      audio.sfx(pay.outcome === 'provoked' ? 'bump' : pay.outcome === 'listened' ? 'confirm' : 'quest');
    }
    for (const q of settleRewards(flags, RPG, SIDE_QUESTS)) {
      this.toast.show(`Quest complete: ${q.title} (${rewardText(q, RPG)})`);
      audio.sfx('quest');
    }
    const now = this.levelsNow();
    for (const [id, lv] of now) {
      const before = this.lastLevels.get(id);
      if (before !== undefined && lv > before) {
        const name = RPG.members.find((m) => m.id === id)?.name ?? id;
        this.toast.show(`${name} reached level ${lv}!`);
        audio.sfx('level_up');
      }
    }
    this.lastLevels = now;
  }

  // ---- Tap to move ---------------------------------------------------------------------------

  /** The page position of a point on the screen in game pixels (tests tap menus and boxes there). */
  private gameToScreen(x: number, y: number): { x: number; y: number } {
    const r = this.game.canvas.getBoundingClientRect();
    const k = r.width / VIEW_WIDTH;
    return { x: r.left + x * k, y: r.top + y * k };
  }

  /** The page position of a tile's centre (tests tap there). */
  private tileToScreen(x: number, y: number): { x: number; y: number } {
    const r = this.game.canvas.getBoundingClientRect();
    const cam = this.cameras.main;
    const k = r.width / VIEW_WIDTH;
    return { x: r.left + ((x + 0.5) * TILE_SIZE - cam.scrollX) * k, y: r.top + ((y + 0.5) * TILE_SIZE - cam.scrollY) * k };
  }

  /** A tap or click on the picture: walk there, or up to the person or thing tapped and use it. */
  private onTap(pointer: Phaser.Input.Pointer): void {
    if (this.leaving) return;
    // Screens over the field take taps in game pixels (the 320 x 180 layout, not the camera's world);
    // the canvas is drawn at the render scale.
    const k = renderScale();
    const p = { x: pointer.x / k, y: pointer.y / k, worldX: pointer.worldX, worldY: pointer.worldY };
    switch (this.mode) {
      case 'dialogue': {
        const choice = this.dialogue.choiceAt(p.x, p.y);
        if (this.dialogue.typing || this.dialogue.choiceCount === 0) this.rt.input.inject('confirm');
        else if (choice !== null) {
          this.dialogue.setCursor(choice);
          this.rt.input.inject('confirm');
        }
        return;
      }
      case 'card':
        this.rt.input.inject('confirm');
        return;
      case 'showcase':
        if (this.showcase.tap()) this.closeShowcase();
        return;
      case 'rhythm':
        this.rhythmPanel.tap();
        return;
      case 'journal':
        this.rt.input.inject('cancel');
        return;
      case 'menu':
        this.runMenuRequests(this.menu.tap(p.x, p.y));
        return;
      case 'shop':
        if (this.shopPanel.tap(p.x, p.y)) {
          this.shopPanel.close();
          this.mode = 'field';
          this.rt.input.clearPresses();
        }
        return;
      case 'field':
        break;
      default:
        return;
    }
    const x = p.worldX;
    const y = p.worldY;
    // A person is tapped anywhere on their sprite (it stands above their tile).
    let tile: Pos | null = null;
    for (const n of this.logic.npcs()) {
      const s = this.npcSprites.get(n.objectId);
      if (s?.visible && s.getBounds().contains(x, y)) tile = { ...n.pos };
    }
    tile ??= { x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE) };
    const plan = planTap(this.logic, tile);
    this.showTapMark(tile, !!plan);
    if (!plan) return;
    this.autoPath = [...plan.path];
    this.autoFace = plan.face;
    if (!this.mover.moving) this.walkOn();
  }

  /** Take the next tapped step, or (at the end) face the target and use it. */
  private walkOn(): void {
    const next = this.autoPath.shift();
    if (next) {
      const from = { ...this.logic.state.player.pos };
      const to = this.stepToward(next, false);
      if (to) this.mover.start(from, to);
      else this.cancelWalk();
      this.drawPlayer();
      return;
    }
    const face = this.autoFace;
    this.autoFace = null;
    if (!face) return;
    this.logic.state.player.facing = face;
    this.drawPlayer();
    this.handle(this.logic.interact());
  }

  private cancelWalk(): void {
    this.autoPath = [];
    this.autoFace = null;
  }

  /** Where the tap landed: a gold ring, or a red cross where Gianna cannot go. */
  private showTapMark(tile: Pos, ok: boolean): void {
    const g = this.add.graphics().setDepth(2900);
    const cx = tile.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = tile.y * TILE_SIZE + TILE_SIZE / 2;
    if (ok) g.lineStyle(1, UI.markerTalk, 1).strokeCircle(cx, cy, 5);
    else g.lineStyle(2, 0xd04040, 1).lineBetween(cx - 4, cy - 4, cx + 4, cy + 4).lineBetween(cx - 4, cy + 4, cx + 4, cy - 4);
    this.tweens.add({ targets: g, alpha: 0, duration: 500, onComplete: () => g.destroy() });
  }

  /** Face `dir` and, if the logic allows the step, return the tile it leads to (Anissa follows). */
  private stepToward(dir: Dir8, slide = true): Pos | null {
    // Held input slides along walls when a diagonal is refused (engine/game.ts tryStep); a tapped walk
    // follows its planned steps exactly.
    const attempt = this.logic.tryStep(dir, slide);
    if (!attempt.ok) {
      // Only a fresh press (or a tapped walk) answers, so holding the key into a wall does not repeat it.
      const fresh = !slide || dirButtons(dir).some((d) => this.rt.input.pressed(d));
      if (attempt.reason === 'door_in_echo' && fresh) {
        this.toast.show(this.logic.content.messages.doorInEcho);
      }
      if (attempt.reason === 'door_closed' && fresh) {
        audio.sfx('bump');
        this.cancelWalk();
        this.handle(this.logic.closedDoor(attempt.door));
      }
      return null;
    }
    this.label.setVisible(false);
    this.startFollowerStep(this.logic.state.player.pos);
    return attempt.to;
  }

  /** Put Gianna (and Anissa, and the camera) where the motion says, on whole pixels, with her walk frame. */
  private drawPlayer(): void {
    const p = this.logic.state.player;
    const at = this.mover.point(p.pos);
    const x = Math.round(at.x);
    const y = Math.round(at.y);
    this.player.setPosition(x, y).setDepth(10 + y);
    setLook(this.player, this.playerLook(), p.facing, this.mover.frame());
    this.moveFollower(this.mover.t);
    this.placeCamera(at);
  }

  /** Centre the camera on a point (the middle of the player's tile), clamped to the map, whole pixels. */
  private placeCamera(at: { x: number; y: number }): void {
    const s = cameraScroll({ x: at.x, y: at.y - TILE_SIZE / 2 }, this.camBounds, VIEW_WIDTH, VIEW_HEIGHT);
    this.cameras.main.setScroll(Math.round(s.x), Math.round(s.y));
  }

  private playerLook(): string {
    return this.logic.era === 'echo' ? ECHO_PLAYER_LOOK : PLAYER_LOOK;
  }

  // ---- Labels, markers and the Echo glow -----------------------------------------------------

  /** The name label over the NPC, object or door the player faces (only while standing still). */
  /** The song for where the player is and what is happening (engine/audioPlan.ts); the player keeps it if unchanged. */
  private syncMusic(): void {
    if (this.mode === 'battle') return;
    const cardSong = this.mode === 'card' && this.logic.card ? CARD_MUSIC[this.logic.card.id] : undefined;
    if (cardSong) {
      audio.playMusic(cardSong);
      return;
    }
    const rules = { byMap: MUSIC_BY_MAP, echo: ECHO_MUSIC, battle: BATTLE_MUSIC, dialogue: DIALOGUE_MUSIC, overrides: MUSIC_OVERRIDES };
    audio.playMusic(musicFor(rules, { mapId: this.map.id, era: this.logic.era, dialogue: this.logic.dialogueId }, this.logic.state.flags));
  }

  /** Menu sounds: a tick for each move, a chime for A, a lower one for B (dialogue choices too). */
  private uiSounds(): void {
    const input = this.rt.input;
    const dirs = (['up', 'down', 'left', 'right'] as const).some((d) => input.pressed(d));
    switch (this.mode) {
      case 'field':
        if (input.pressed('menu')) audio.sfx('confirm');
        break;
      case 'menu':
      case 'shop':
      case 'journal':
        if (input.pressed('confirm')) audio.sfx('confirm');
        else if (input.pressed('cancel') || input.pressed('menu')) audio.sfx('cancel');
        else if (dirs) audio.sfx('cursor');
        break;
      case 'dialogue':
        if (this.dialogue.choiceCount > 0 && !this.dialogue.typing) {
          if (input.pressed('confirm')) audio.sfx('confirm');
          else if (dirs) audio.sfx('cursor');
        }
        break;
      default:
        break;
    }
  }

  /** Show which key makes the Echo while the player stands where one works (only in the field). */
  private updateEchoPrompt(): void {
    const text = this.mode === 'field' ? echoPrompt(this.logic.swapCheck(), isTouchDevice() ? 'touch' : 'keys') : null;
    if (!text) {
      if (this.echoText.visible) this.echoText.setVisible(false);
      return;
    }
    if (this.echoText.text !== text) this.echoText.setText(text);
    if (!this.echoText.visible) this.echoText.setVisible(true);
  }

  private updateLabel(): void {
    const target = this.mover.moving ? null : this.logic.targetAhead();
    const key = target ? `${target.kind}:${target.name}:${this.targetAnchor(target).x},${this.targetAnchor(target).y}` : '';
    if (key === this.labelKey) return;
    this.labelKey = key;
    if (!target) {
      this.label.setVisible(false);
      return;
    }
    const at = this.targetAnchor(target);
    this.labelText.setText(target.name);
    const w = Math.ceil(this.labelText.width) + 6;
    const h = Math.ceil(this.labelText.height) + 2;
    // Keep the label on screen.
    const cam = this.cameras.main;
    const x = Phaser.Math.Clamp(at.x, cam.scrollX + w / 2 + 1, cam.scrollX + VIEW_WIDTH - w / 2 - 1);
    const y = Math.max(at.y, cam.scrollY + h + 1);
    this.labelBg.clear().fillStyle(UI.labelFill, UI.labelAlpha).fillRect(-w / 2, -h, w, h);
    this.labelBg.lineStyle(1, UI.boxBorder, 0.8).strokeRect(-w / 2 + 0.5, -h + 0.5, w - 1, h - 1);
    this.labelText.setPosition(0, 0);
    this.label.setPosition(Math.round(x), Math.round(y)).setVisible(true);
  }

  /** How tall an NPC's frames are (a grown-up's art sheet, such as Azzy's, can be taller than the standard cell). */
  private npcHeight(objectId: number): number {
    return this.npcSprites.get(objectId)?.height ?? CHARACTER_HEIGHT;
  }

  /** The point (bottom centre of the label) above a target. */
  private targetAnchor(target: Target): { x: number; y: number } {
    if (target.kind === 'npc') {
      const w = tileToWorld(target.npc.pos);
      return { x: w.x, y: w.y - this.npcHeight(target.npc.objectId) - CHARACTER_LABEL_GAP };
    }
    if (target.kind === 'door') {
      const xs = target.door.tiles.map((t) => t.x);
      return { x: ((Math.min(...xs) + Math.max(...xs) + 1) / 2) * TILE_SIZE, y: target.door.pos.y * TILE_SIZE - 2 };
    }
    const o = target.object;
    return { x: (o.area.x + o.area.width / 2) * TILE_SIZE, y: this.objectTop(o) - 2 };
  }

  /** The top edge of an object as drawn (tall drawings rise above their tiles). */
  private objectTop(o: { area: { y: number; height: number }; kind?: string }): number {
    const art = o.kind ? OBJECT_ART[o.kind] : undefined;
    const bottom = (o.area.y + o.area.height) * TILE_SIZE;
    return art ? Math.min(o.area.y * TILE_SIZE, bottom - art.rows.length) : o.area.y * TILE_SIZE;
  }

  /** Markers over people with something new to say and things not used yet (engine/game.ts markers). */
  private syncMarkers(): void {
    const markers = this.logic.markers();
    const keep = new Set(markers.map((m) => m.id));
    for (const [id, sprite] of this.markerSprites) {
      if (!keep.has(id)) {
        this.tweens.killTweensOf(sprite);
        sprite.destroy();
        this.markerSprites.delete(id);
      }
    }
    const objects = this.logic.objects();
    for (const m of markers) {
      if (this.markerSprites.has(m.id)) continue;
      const x = (m.pos.x + 0.5) * TILE_SIZE;
      let y: number;
      if (m.kind === 'talk') y = (m.pos.y + 1) * TILE_SIZE - this.npcHeight(Number(m.id.slice('npc:'.length))) - 3;
      else {
        const o = objects.find((ob) => `obj:${ob.id}` === m.id);
        y = (o ? this.objectTop(o) : m.pos.y * TILE_SIZE) - 2;
      }
      const sprite = this.add
        .image(Math.round(x), Math.round(y), m.kind === 'talk' ? MARKER_TEXTURES.talk : MARKER_TEXTURES.use)
        .setOrigin(0.5, 1)
        .setDepth(3400);
      this.tweens.add({ targets: sprite, y: sprite.y - 3, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.markerSprites.set(m.id, sprite);
    }
  }

  /** Once back in the field after an Echo change, the changed objects glow for a few seconds. */
  private startPendingGlow(): void {
    if (this.pendingGlow.length === 0) return;
    const ids = this.pendingGlow;
    this.pendingGlow = [];
    this.lastGlowed = [];
    const objects = this.logic.objects();
    const names: string[] = [];
    for (const id of ids) {
      const o = objects.find((ob) => ob.id === id);
      if (!o) continue;
      const name = this.logic.content.objects?.[id]?.name;
      if (name && !names.includes(name)) names.push(name);
      const top = this.objectTop(o);
      const bottom = (o.area.y + o.area.height) * TILE_SIZE;
      const glow = this.add
        .rectangle(o.area.x * TILE_SIZE - 2, top - 2, o.area.width * TILE_SIZE + 4, bottom - top + 4, UI.changedGlow, 0)
        .setOrigin(0, 0)
        .setDepth(3300)
        .setBlendMode(Phaser.BlendModes.ADD);
      glow.setStrokeStyle(1, UI.changedGlow, 1);
      this.glowing.add(id);
      this.lastGlowed.push(id);
      this.tweens.add({
        targets: glow,
        fillAlpha: 0.55,
        duration: CHANGED_GLOW_MS / 8,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          glow.destroy();
          this.glowing.delete(id);
        },
      });
    }
    if (names.length > 0) this.toast.show(`Something changed: ${names.join(', ')}`);
  }

  // ---- Era and actors ------------------------------------------------------------------------

  private applyEra(): void {
    const era = this.logic.era;
    this.buildMinimap(era);
    const visible = visibleLayersFor(era);
    for (const [name, layer] of Object.entries(this.layers)) layer.setVisible(visible.includes(name));
    const echo = era === 'echo';
    this.echoWash.setVisible(echo);
    this.echoDither.setVisible(echo);
    this.applyMood();
    const cam = this.cameras.main;
    if (echo && ECHO_FILTER.sepia && this.game.renderer.type === Phaser.WEBGL && !this.echoMatrix) {
      this.echoMatrix = cam.postFX.addColorMatrix();
      this.echoMatrix.sepia();
      this.echoMatrix.alpha = ECHO_FILTER.sepiaStrength;
    } else if (!echo && this.echoMatrix) {
      cam.postFX.clear();
      this.echoMatrix = null;
    }
    setLook(this.player, this.playerLook(), this.logic.state.player.facing);
  }

  /** The map's mood (the occupied city's dusk), in the present only. */
  private applyMood(): void {
    const mood = this.logic.era === 'present' ? MAP_MOODS.find((m) => m.maps.includes(this.map.id) && evaluate(m.if, this.logic.state.flags)) : undefined;
    this.moodWash.setVisible(!!mood);
    if (mood) this.moodWash.setFillStyle(mood.color, mood.alpha);
  }

  /** The minimap (a page element in the black bars) for this map and era, named after the city section. */
  private buildMinimap(era: Era): void {
    this.minimap ??= sharedSideMap();
    // Tapping the minimap opens the full map (the menu's Map page: the city, then the realm).
    this.minimap.onTap = () => {
      if (this.mode === 'field' && !this.leaving) this.openMenu('Map');
    };
    const found = cityOf(RPG, this.map.id);
    const raw = this.rt.rawMaps[this.map.id];
    if (raw) this.minimap.setMap(this.map, raw, era, found ? `${found.city.name}: ${found.section.name}` : '');
    this.minimap.follow(this.logic.state.player.pos);
    this.refreshGuide();
  }

  private swapVisuals(_era: Era): void {
    const f = ECHO_FILTER.flash;
    this.cameras.main.flash(f.duration, f.r, f.g, f.b);
    this.applyEra();
    this.updateFollowerLook();
    this.syncCrowd(); // the crowd is not part of the memory
    this.refreshGuide(); // nor are the quest arrows
  }

  /** Walk each walking person a frame along their route; at the end they face the way their place says. */
  private tickWalkers(delta: number): void {
    for (const [id, w] of this.walkers) {
      const sprite = this.npcSprites.get(id);
      if (!sprite) {
        this.walkers.delete(id);
        continue;
      }
      if (!w.mover.moving) {
        const first = w.tiles.shift();
        if (first) w.mover.start(w.at, first);
      }
      w.mover.update(delta, speedPx(false), (reached) => {
        w.at = reached;
        return w.tiles.shift() ?? null;
      });
      const g = w.mover.glide;
      if (g) {
        const dir = combine(g.to.x > g.from.x ? 'right' : g.to.x < g.from.x ? 'left' : null, g.to.y > g.from.y ? 'down' : g.to.y < g.from.y ? 'up' : null);
        if (dir) w.facing = dir;
      }
      const p = w.mover.point(w.at);
      sprite.setPosition(p.x, p.y).setDepth(10 + p.y);
      if (w.mover.moving) {
        setLook(sprite, w.look, w.facing, w.mover.frame());
      } else {
        this.walkers.delete(id);
        setLook(sprite, w.look, this.npcPlaced.get(id)?.facing ?? w.facing);
      }
    }
  }

  /** Draw the NPCs and puzzle objects active in this era with the current flags. */
  private syncActors(): void {
    const npcs = this.logic.npcs();
    // Yari leaving her spot to join the party starts following from there (no jump).
    const yariStood = [...this.npcPlaced.values()].find((n) => n.npc === 'yari')?.pos;
    // Someone who left one place for another on this map walks there instead of appearing there.
    for (const move of npcMoves([...this.npcPlaced.values()], npcs)) {
      const sprite = this.npcSprites.get(move.fromId);
      const tiles = sprite ? walkRoute(this.logic, move.from, move.to) : null;
      if (!sprite || !tiles || tiles.length === 0) continue;
      this.npcSprites.delete(move.fromId);
      this.npcSprites.set(move.toId, sprite);
      const look = this.logic.content.npcs[move.npc]!.look;
      this.walkers.delete(move.fromId);
      this.walkers.set(move.toId, { mover: new Mover(), at: move.from, tiles, look, facing: 'down' });
    }
    this.npcPlaced = new Map(npcs.map((n) => [n.objectId, n]));
    const keep = new Set(npcs.map((n) => n.objectId));
    for (const id of this.walkers.keys()) if (!keep.has(id)) this.walkers.delete(id);
    for (const [id, sprite] of this.npcSprites) {
      if (!keep.has(id)) {
        sprite.destroy();
        this.npcSprites.delete(id);
      }
    }
    for (const n of npcs) {
      const def = this.logic.content.npcs[n.npc]!;
      let sprite = this.npcSprites.get(n.objectId);
      if (!sprite) {
        const w = tileToWorld(n.pos);
        sprite = this.add.image(w.x, w.y, textureKeyForCharacter(def.look)).setOrigin(0.5, 1).setDepth(10 + w.y);
        setLook(sprite, def.look, n.facing);
        this.npcSprites.set(n.objectId, sprite);
      } else if (this.talkingTo?.objectId !== n.objectId && !this.walkers.has(n.objectId)) {
        setLook(sprite, def.look, n.facing);
      }
    }

    const objects = this.logic.objects().filter((o) => o.kind);
    const keepObj = new Set(objects.map((o) => o.id));
    for (const [id, sprites] of this.objectSprites) {
      if (!keepObj.has(id)) {
        for (const s of sprites) s.destroy();
        this.objectSprites.delete(id);
      }
    }
    for (const o of objects) {
      if (this.objectSprites.has(o.id) || !o.kind) continue;
      const art = OBJECT_ART[o.kind];
      if (art) {
        // One large drawing, standing on the bottom edge of the object's area, sorted with the actors.
        const x = (o.area.x + o.area.width / 2) * TILE_SIZE;
        const bottom = (o.area.y + o.area.height) * TILE_SIZE;
        const image = this.add.image(x, bottom, textureKeyForObject(o.kind)).setOrigin(0.5, 1).setDepth(o.walkable ? 1.5 : 10 + bottom - 1);
        const parts: Phaser.GameObjects.GameObject[] = [image];
        if (art.glow) {
          const light = this.add
            .circle(x, bottom - art.rows.length + art.glow.radius / 2, art.glow.radius, art.glow.color, 0.25)
            .setDepth(image.depth + 0.1)
            .setBlendMode(Phaser.BlendModes.ADD);
          this.tweens.add({ targets: light, alpha: 0.45, scale: 1.12, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
          parts.push(light);
        }
        this.objectSprites.set(o.id, parts);
        continue;
      }
      const sprites = rectTiles(o.area).map((t) =>
        this.add.image(t.x * TILE_SIZE, t.y * TILE_SIZE, TILESET.textureKey, o.kind).setOrigin(0, 0).setDepth(o.walkable ? 1.5 : 5),
      );
      this.objectSprites.set(o.id, sprites);
    }
    this.syncMarkers();
    this.labelKey = '';
    this.placeFollower();
    // (A scene that brought her on may still be on stage: she follows on from where it left her.)
    const onStage = this.stageActors.get('yari');
    this.placeYari(yariStood ?? (onStage && onStage.borrowed === undefined ? onStage.at : undefined) ?? this.yariStaged ?? undefined);
    this.yariStaged = null;
    this.syncCrowd();
    this.refreshGuide();
  }

  // ---- Quest arrows (engine/guide.ts) -------------------------------------------------------

  /** Where to go from this map now: the story's next stop for the arrow, and every stop for the minimap. */
  private refreshGuide(): void {
    const flags = this.logic.state.flags;
    const maps = this.logic.maps;
    const goal = storyGoal(questForJournal(CHAPTERS, this.map.id, flags), flags);
    this.guideWay = goal ? waypoint(maps, this.map.id, goal, flags) : null;
    const on = questArrows() && this.logic.era === 'present';
    const sides = sideGoals(SIDE_QUESTS, flags)
      .map((s) => waypoint(maps, this.map.id, s.goal, flags))
      .filter((w): w is Waypoint => w !== null);
    this.minimap?.setTargets(on ? [...sides.map((w) => ({ pos: w.at, story: false })), ...(this.guideWay ? [{ pos: this.guideWay.at, story: true }] : [])] : []);
  }

  /** The arrow by Gianna points the story's way; close to the goal, a marker bobs over it instead. */
  private tickGuide(delta: number): void {
    const way = this.guideWay;
    const show = !!way && questArrows() && this.mode === 'field' && this.logic.era === 'present' && !this.staging && !this.leaving;
    if (!show || !way) {
      this.guideArrow?.setVisible(false);
      this.guideMark?.setVisible(false);
      return;
    }
    this.guideT += delta;
    const p = this.logic.state.player.pos;
    const goal = tileToWorld(way.at);
    const close = way.final && Math.max(Math.abs(p.x - way.at.x), Math.abs(p.y - way.at.y)) <= QUEST_ARROW.near;
    if (close) {
      this.guideArrow?.setVisible(false);
      const mark = (this.guideMark ??= this.add.graphics().setDepth(3200));
      if (mark.getData('drawn') !== true) {
        // A small gold chevron pointing down at the goal.
        mark.fillStyle(QUEST_ARROW.outline, 1).fillTriangle(-5, -5, 5, -5, 0, 2);
        mark.fillStyle(QUEST_ARROW.fill, 1).fillTriangle(-3.5, -4, 3.5, -4, 0, 0.5);
        mark.setData('drawn', true);
      }
      const bob = Math.round(Math.sin(this.guideT / 220) * 2);
      mark.setPosition(goal.x, goal.y - CHARACTER_HEIGHT - 6 + bob).setVisible(true);
      return;
    }
    this.guideMark?.setVisible(false);
    const arrow = (this.guideArrow ??= this.add.graphics().setDepth(3200));
    if (arrow.getData('drawn') !== true) {
      // A gold arrowhead pointing right (rotated towards the way).
      arrow.fillStyle(QUEST_ARROW.outline, 1).fillTriangle(7, 0, -4, -5, -4, 5);
      arrow.fillStyle(QUEST_ARROW.fill, 1).fillTriangle(5.5, 0, -2.8, -3.6, -2.8, 3.6);
      arrow.setData('drawn', true);
    }
    // Round Gianna on an oval: beside her going sideways, over her head going up, by her feet going down.
    const me = this.mover.point(p);
    const cx = me.x;
    const cy = me.y - CHARACTER_HEIGHT / 2;
    const angle = Math.atan2(goal.y - TILE_SIZE / 2 - cy, goal.x - cx);
    const pulse = Math.sin(this.guideT / 260) * 1.5;
    const rx = QUEST_ARROW.radius + pulse;
    const ry = CHARACTER_HEIGHT / 2 + 6 + pulse;
    arrow.setPosition(Math.round(cx + Math.cos(angle) * rx), Math.round(cy + Math.sin(angle) * ry)).setRotation(angle).setVisible(true);
  }

  // ---- The crowd -----------------------------------------------------------------------------

  /** Who stands on a tile now or is stepping onto it: Gianna, her party, the map's people, the crowd. */
  private crowdTaken(p: Pos): boolean {
    if (samePos(p, this.logic.state.player.pos)) return true;
    if (this.follower && samePos(p, this.follower.pos)) return true;
    if (this.yari && samePos(p, this.yari.pos)) return true;
    if (this.logic.npcs().some((n) => samePos(n.pos, p))) return true;
    return this.crowd.some((c) => samePos(c.at, p) || (c.mover.glide !== null && samePos(c.mover.glide.to, p)));
  }

  /** Bring on the crowds the story has now, and send off the ones it has not (the festival ends). */
  private syncCrowd(): void {
    const zones = this.logic.crowds();
    const active = new Set(zones.map((z) => z.id));
    this.crowd = this.crowd.filter((c) => {
      if (active.has(c.zone)) return true;
      c.sprite.destroy();
      return false;
    });
    for (const zone of zones) {
      if (this.crowd.some((c) => c.zone === zone.id) || zone.looks.length === 0) continue;
      const open = (p: Pos) => this.logic.isOpen(p, 'present') && !this.crowdTaken(p) && !this.map.doors.some((d) => d.tiles.some((t) => samePos(t, p)));
      for (const at of crowdSpots(zone, open, this.crowdRng)) {
        const look = this.crowdRng.pick(zone.looks);
        const facing = this.crowdRng.pick(['down', 'left', 'right', 'up'] as const);
        const w = tileToWorld(at);
        const sprite = this.add.image(w.x, w.y, textureKeyForCharacter(look)).setOrigin(0.5, 1).setDepth(10 + w.y);
        setLook(sprite, look, facing);
        this.crowd.push({ zone: zone.id, sprite, at, mover: new Mover(), look, facing, waitMs: this.crowdRng.int(0, 4000) });
      }
    }
  }

  /** Stroll: now and then someone takes a step to a free tile nearby, never into anyone's way. */
  private tickCrowd(delta: number): void {
    if (this.crowd.length === 0) return;
    const zones = new Map(this.logic.crowds().map((z) => [z.id, z]));
    for (const c of this.crowd) {
      if (c.mover.moving) {
        c.mover.update(delta, speedPx(false) * 0.5, (reached) => {
          c.at = reached;
          return null;
        });
      } else {
        c.waitMs -= delta;
        const zone = zones.get(c.zone);
        if (c.waitMs <= 0 && zone && this.mode === 'field') {
          c.waitMs = this.crowdRng.int(1500, 5000);
          const next = crowdStep(zone, c.at, (p) => this.logic.isOpen(p, 'present') && !this.map.doors.some((d) => d.tiles.some((t) => samePos(t, p))), (p) => this.crowdTaken(p), this.crowdRng);
          if (next) {
            c.facing = facingToward(c.at, next);
            c.mover.start(c.at, next);
          }
        }
      }
      const p = c.mover.point(c.at);
      c.sprite.setPosition(p.x, p.y).setDepth(10 + p.y);
      setLook(c.sprite, c.look, c.facing, c.mover.moving ? c.mover.frame() : 0);
    }
  }

  // ---- Anissa --------------------------------------------------------------------------------

  private anissaWithUs(): boolean {
    return this.logic.state.flags.isSet('party.anissa');
  }

  /** Put Anissa one step behind Gianna (or beside her) when she first appears on a map. */
  private placeFollower(): void {
    if (!this.anissaWithUs()) {
      this.follower?.sprite.destroy();
      this.follower = null;
      return;
    }
    if (this.follower) return;
    const p = this.logic.state.player;
    const tryDirs: Dir8[] = [opposite(spriteFacing(p.facing)), ...DIRS];
    const spot =
      tryDirs.map((d) => stepFrom(p.pos, d)).find((t) => this.logic.isOpen(t, 'present') && !this.logic.npcs('present').some((n) => samePos(n.pos, t))) ??
      p.pos;
    const w = tileToWorld(spot);
    const sprite = this.add.image(w.x, w.y, textureKeyForCharacter(ANISSA_GLOW.look)).setOrigin(0.5, 1).setDepth(10 + w.y - 1);
    setLook(sprite, ANISSA_GLOW.look, p.facing);
    // She starts on the other foot from Gianna.
    this.follower = { sprite, pos: spot, from: spot, facing: p.facing, glow: null, distance: WALK_CYCLE_PX / 2, lastT: 1 };
    this.updateFollowerLook();
  }

  private yariWithUs(): boolean {
    return partyMembers(this.logic.state.flags, RPG, 'present').some((m) => m.id === 'yari');
  }

  /**
   * Yari walks behind Anissa (or Gianna) while she is in the party (demo review, Oct 17: she fought the boar
   * but was never seen on the map). She starts where she stood when she joined, or one step behind.
   */
  private placeYari(stood?: Pos): void {
    if (!this.yariWithUs()) {
      // A scene that borrowed her lets go first (she leaves the party: hidden in the cave, say).
      for (const [id, a] of this.stageActors) {
        if (a.borrowed !== 'yari') continue;
        this.stageActors.delete(id);
        if (this.stageBlocking === a) this.stageBlocking = null;
      }
      this.yari?.sprite.destroy();
      this.yari = null;
      return;
    }
    if (this.yari) return;
    const p = this.logic.state.player;
    const lead = this.follower?.pos ?? p.pos;
    const taken = (t: Pos) => samePos(t, p.pos) || (this.follower !== null && samePos(t, this.follower.pos));
    const tryDirs: Dir8[] = [opposite(spriteFacing(p.facing)), ...DIRS];
    const spot =
      stood ??
      tryDirs.map((d) => stepFrom(lead, d)).find((t) => !taken(t) && this.logic.isOpen(t, 'present') && !this.logic.npcs('present').some((n) => samePos(n.pos, t))) ??
      lead;
    const w = tileToWorld(spot);
    const sprite = this.add.image(w.x, w.y, textureKeyForCharacter('yari')).setOrigin(0.5, 1).setDepth(10 + w.y - 1);
    setLook(sprite, 'yari', p.facing);
    this.yari = { sprite, pos: spot, from: spot, facing: p.facing, glow: null, distance: 0, lastT: 1 };
    this.updateFollowerLook();
  }

  /** In the present she walks behind Gianna; in the Echo she stays put, glowing, holding the door. */
  private updateFollowerLook(): void {
    // Yari is not part of the memory: she waits out of sight until it ends.
    this.yari?.sprite.setVisible(this.logic.era !== 'echo');
    const f = this.follower;
    if (!f) return;
    const echo = this.logic.era === 'echo';
    f.glow?.stop();
    f.glow = null;
    if (echo) {
      f.sprite.setTint(ANISSA_GLOW.tint).setAlpha(ANISSA_GLOW.alpha);
      setLook(f.sprite, ANISSA_GLOW.look, 'down');
      f.glow = this.tweens.add({ targets: f.sprite, alpha: ANISSA_GLOW.pulseAlpha, duration: 700, yoyo: true, repeat: -1 });
    } else {
      f.sprite.clearTint().setAlpha(1);
    }
  }

  private startFollowerStep(playerFrom: Pos): void {
    if (this.logic.era === 'echo') return;
    // Anissa steps where Gianna was; Yari steps where Anissa was (or where Gianna was, without her).
    const anissaWas = this.follower ? { ...this.follower.pos } : null;
    const anissaMoved = this.follower ? this.stepFollower(this.follower, playerFrom, ANISSA_GLOW.look) : false;
    if (this.yari) {
      if (!this.follower) this.stepFollower(this.yari, playerFrom, 'yari');
      else if (anissaMoved && anissaWas) this.stepFollower(this.yari, anissaWas, 'yari');
      else this.stepFollower(this.yari, this.yari.pos, 'yari');
    }
  }

  /** One follower's step towards `to` (where the one ahead was). Whether they moved. */
  private stepFollower(f: Follower, to: Pos, look: string): boolean {
    // Count the end of her last step (her walk cycle carries on across tiles).
    f.distance += Math.max(0, 1 - f.lastT) * stepLength(f.from, f.pos);
    f.lastT = 0;
    f.from = f.pos;
    if (samePos(f.pos, to)) return false;
    const dx = to.x - f.pos.x;
    const dy = to.y - f.pos.y;
    f.facing = facingToward({ x: 0, y: 0 }, { x: dx, y: dy });
    f.pos = { ...to };
    setLook(f.sprite, look, f.facing);
    return true;
  }

  /** Anissa walks her step in time with Gianna's (`t` is how far through it Gianna is). */
  private moveFollower(t: number): void {
    if (this.logic.era === 'echo') return;
    if (this.follower) this.moveOneFollower(this.follower, t, ANISSA_GLOW.look);
    if (this.yari) this.moveOneFollower(this.yari, t, 'yari');
  }

  private moveOneFollower(f: Follower, t: number, look: string): void {
    const a = tileToWorld(f.from);
    const b = tileToWorld(f.pos);
    const walking = t < 1 && !samePos(f.from, f.pos);
    if (walking) f.distance += Math.max(0, t - f.lastT) * stepLength(f.from, f.pos);
    else if (f.lastT < 1) f.distance = restDistance(f.distance + (1 - f.lastT) * stepLength(f.from, f.pos));
    f.lastT = t;
    f.sprite.setPosition(Math.round(a.x + (b.x - a.x) * t), Math.round(a.y + (b.y - a.y) * t));
    f.sprite.setDepth(10 + f.sprite.y - 1);
    setLook(f.sprite, look, f.facing, walking ? walkFrame(f.distance) : 0);
  }

  // ---- Hints and Journal ---------------------------------------------------------------------

  /** The chapter this map belongs to (Chapter 1 in Pòdlimyè, Chapter 2 in Yucayeque, ...). */
  private quest(): QuestDef | null {
    return questForMap(CHAPTERS, this.map.id);
  }

  private questHere(): boolean {
    return this.quest() !== null;
  }

  private tickHints(delta: number): void {
    const quest = this.quest();
    if (!quest || !this.anissaWithUs()) return;
    const objective = currentObjective(quest, this.logic.state.flags);
    const index = this.rt.hints.tick(delta, objective?.id ?? null, objective?.hints.length ?? 0);
    if (index !== null && objective && this.logic.state.settings.hints) this.hint.show('Anissa', objective.hints[index]!);
  }

  private askAnissa(): void {
    const quest = this.quest();
    const objective = quest ? currentObjective(quest, this.logic.state.flags) : null;
    const index = objective ? this.rt.hints.onRequest(objective.hints.length) : null;
    this.hint.show('Anissa', objective && index !== null ? objective.hints[index]! : 'I think we did everything, Gigi.');
  }

  /** The Journal's lines (shown on the menu's Journal tab). */
  private journalLines(): PanelLine[] {
    const flags = this.logic.state.flags;
    const quest = questForJournal(CHAPTERS, this.map.id, flags);
    const lines: PanelLine[] = [{ text: `JOURNAL${quest ? `: ${quest.title}` : ''}`, color: UI.accentText }];
    if (!quest) lines.push({ text: 'Nothing to note here.', gap: 4 });
    else {
      const entries = journalEntries(quest, flags);
      const current = entries.find((e) => e.state === 'current');
      lines.push({ text: current ? `Now: ${current.title}` : 'This chapter is complete.', color: UI.text, gap: 4 });
      if (current) lines.push({ text: current.detail, color: UI.dimText });
      const done = entries.filter((e) => e.state === 'done');
      if (done.length > 0) {
        lines.push({ text: 'Done:', color: UI.accentText, gap: 4 });
        for (const e of done) lines.push({ text: `  [x] ${e.title}`, color: UI.doneText });
      }
      const notes = journalNotes(JOURNAL_NOTES, flags);
      if (notes.length > 0) {
        lines.push({ text: 'Notes:', color: UI.accentText, gap: 4 });
        for (const n of notes) lines.push({ text: `${n.title}: ${n.text}`, color: UI.dimText });
      }
    }
    return lines;
  }

  /** The Credits screen: the art and sound the quest uses, with authors and licences (data/credits.ts). */
  private openCredits(): void {
    const lines: PanelLine[] = [{ text: 'CREDITS', color: UI.accentText }];
    CREDITS_INTRO.forEach((t, i) => lines.push({ text: t, color: i === 0 ? UI.text : UI.dimText, gap: i === 0 ? 4 : 0 }));
    for (const c of CREDITS) {
      lines.push({ text: `${c.title} by ${c.author} (${c.licence})`, color: UI.text, gap: 4 });
      lines.push({ text: `${c.use}. ${c.url}`, color: UI.dimText });
    }
    lines.push({ text: '(B to close)', color: UI.dimText, gap: 4 });
    this.menu.close();
    this.panel.open(lines, { fill: UI.boxFill, alpha: 0.97, border: true });
    this.mode = 'journal';
  }

  private showCard(): void {
    const card = this.logic.card;
    if (!card) return;
    // A card ends the scene: anyone still walking off is gone (Oct 18: the refuge card froze when Yari,
    // hidden by the scene, was still being drawn).
    this.clearStage();
    this.dialogue.hide();
    this.hint.hide();
    this.mode = 'card';
    const lines: PanelLine[] = [
      { text: card.title, color: UI.cardTitle, center: true },
      ...card.lines.map((t, i) => ({ text: t, center: true, gap: i === 0 ? 10 : 2 })),
      { text: '(A to continue)', color: UI.dimText, center: true, gap: 16 },
    ];
    const art = CARD_ART[card.id];
    // Over a picture, the text sits on a veil so it still reads; without one, on black as before.
    this.panel.open(lines, { fill: UI.cardFill, alpha: art ? 0.55 : 1, border: false, top: 48 });
    if (art) this.showCardArt(`card-${card.id}`, art);
    this.rt.input.clearPresses();
  }

  /** The end card's picture, filling the screen under the text (loaded the first time it is needed). */
  private showCardArt(key: string, file: string): void {
    const place = () => {
      if (this.mode !== 'card' || !this.textures.exists(key)) return;
      this.cardArt?.destroy();
      const img = this.add.image(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, key).setScrollFactor(0).setDepth(7099);
      img.setScale(Math.max(VIEW_WIDTH / img.width, VIEW_HEIGHT / img.height));
      this.cardArt = img;
    };
    if (this.textures.exists(key)) return place();
    this.load.image(key, file);
    this.load.once(Phaser.Loader.Events.COMPLETE, place);
    this.load.start();
  }

  // ---- Dialogue ------------------------------------------------------------------------------

  private enterDialogueMode(): void {
    this.mode = 'dialogue';
    this.label.setVisible(false);
    this.labelKey = '';
    this.lastFx = undefined;
    this.showDialogueView();
  }

  private leaveDialogueMode(): void {
    this.dialogue.hide();
    this.clearStage();
    this.mode = this.logic.mode === 'card' ? 'card' : 'field';
    this.rt.input.clearPresses();
    if (this.talkingTo) {
      const n = this.talkingTo;
      const def = this.logic.content.npcs[n.npc];
      const sprite = this.npcSprites.get(n.objectId);
      if (def && sprite) setLook(sprite, def.look, n.facing);
      this.talkingTo = null;
    }
  }

  private showDialogueView(): void {
    const view = this.logic.view();
    if (view.kind === 'end') return;
    const show = () => {
      if (view.fx && view.fx !== this.lastFx) this.playFx(view.fx);
      this.lastFx = view.fx;
      this.dialogue.show(view, this.logic.state.settings.textSpeed);
    };
    if (view.stage && view.stage.length > 0) {
      // Act the scene out first (the box steps aside), then the line.
      this.dialogue.hide();
      this.perform(view.stage, show);
    } else show();
  }

  // ---- Stage directions (engine/stage.ts) ----------------------------------------------------

  /** Whether a scene is being acted out and the line is waiting for it. */
  private get staging(): boolean {
    return this.stageThen !== null;
  }

  private perform(cues: readonly StageCue[], then: () => void): void {
    this.stageQueue = [...cues];
    this.stageThen = then;
    this.stageBlocking = null;
    this.stageWaitMs = 0;
    this.runStage();
  }

  /** Start cues until one has to finish first; when none are left, show the line. */
  private runStage(): void {
    while (!this.stageBlocking && this.stageWaitMs <= 0) {
      const c = this.stageQueue.shift();
      if (!c) {
        const then = this.stageThen;
        this.stageThen = null;
        this.rt.input.clearPresses();
        then?.();
        return;
      }
      this.startCue(c);
    }
  }

  private startCue(c: StageCue): void {
    switch (c.do) {
      case 'place': {
        const borrowed = this.borrowActor(c.actor);
        if (borrowed) {
          borrowed.at = { ...c.at };
          borrowed.tiles = [];
          if (c.facing) borrowed.facing = c.facing;
          const w = tileToWorld(c.at);
          borrowed.sprite.setVisible(true).setPosition(w.x, w.y).setDepth(10 + w.y);
          setLook(borrowed.sprite, borrowed.look, borrowed.facing);
        } else this.stageActor(c.actor, c.look ?? 'villager', c.at, c.facing ?? 'down');
        return;
      }
      case 'enter': {
        const a = this.stageActor(c.actor, c.look, c.from, c.facing ?? 'down');
        this.walkActor(a, c.to, c.run ?? false, c.facing, false);
        if (!c.async) this.stageBlocking = a;
        return;
      }
      case 'walk':
      case 'exit': {
        const a = this.borrowActor(c.actor);
        if (!a) return;
        this.walkActor(a, c.to, c.run ?? false, c.do === 'walk' ? c.facing : undefined, c.do === 'exit');
        if (!c.async) this.stageBlocking = a;
        return;
      }
      case 'face':
        if (c.actor === STAGE_PLAYER) {
          if (c.facing !== 'player') setLook(this.player, this.playerLook(), c.facing);
        } else {
          const a = this.borrowActor(c.actor);
          if (a) {
            a.facing = c.facing === 'player' ? facingToward(a.at, this.logic.state.player.pos) : c.facing;
            setLook(a.sprite, a.look, a.facing);
          }
        }
        return;
      case 'look':
        this.stageCamera = c.actor === STAGE_PLAYER ? null : c.actor;
        return;
      case 'wait':
        this.stageWaitMs = c.ms;
        return;
      case 'sync':
        this.syncActors();
        return;
    }
  }

  /** An actor by name: one already on stage, or someone borrowed from the map (an NPC, or Anissa following). */
  private borrowActor(id: string): StageActor | undefined {
    const on = this.stageActors.get(id);
    if (on) return on;
    if (id === 'yari' && this.yari) {
      // Yari walking with the party: a scene that names her moves her own sprite (never a second Yari).
      const f = this.yari;
      const a: StageActor = { sprite: f.sprite, look: 'yari', at: { ...f.pos }, facing: f.facing, mover: new Mover(), tiles: [], run: false, leaving: false, borrowed: 'yari' };
      this.stageActors.set(id, a);
      return a;
    }
    if (id === STAGE_FOLLOWER && this.follower) {
      const f = this.follower;
      const a: StageActor = { sprite: f.sprite, look: ANISSA_GLOW.look, at: { ...f.pos }, facing: f.facing, mover: new Mover(), tiles: [], run: false, leaving: false, borrowed: 'follower' };
      this.stageActors.set(id, a);
      return a;
    }
    if (id.startsWith(STAGE_NPC)) {
      const placed = [...this.npcPlaced.values()].find((n) => n.npc === id.slice(STAGE_NPC.length));
      const sprite = placed ? this.npcSprites.get(placed.objectId) : undefined;
      if (!placed || !sprite) return undefined;
      this.walkers.delete(placed.objectId);
      const look = this.logic.content.npcs[placed.npc]!.look;
      const a: StageActor = { sprite, look, at: { ...placed.pos }, facing: placed.facing, mover: new Mover(), tiles: [], run: false, leaving: false, borrowed: placed.objectId };
      this.stageActors.set(id, a);
      return a;
    }
    return undefined;
  }

  private stageActor(id: string, look: string, at: Pos, facing: Dir8): StageActor {
    let a = this.stageActors.get(id) ?? (id === 'yari' && this.yari ? this.borrowActor(id) : undefined);
    if (a?.borrowed !== undefined) a.sprite.setVisible(true);
    const w = tileToWorld(at);
    if (!a) {
      const sprite = this.add.image(w.x, w.y, textureKeyForCharacter(look)).setOrigin(0.5, 1);
      a = { sprite, look, at: { ...at }, facing, mover: new Mover(), tiles: [], run: false, leaving: false };
      this.stageActors.set(id, a);
    }
    a.look = look;
    a.at = { ...at };
    a.facing = facing;
    a.tiles = [];
    a.sprite.setPosition(w.x, w.y).setDepth(10 + w.y);
    setLook(a.sprite, look, facing);
    return a;
  }

  private walkActor(a: StageActor, to: Pos, run: boolean, endFacing: Dir8 | undefined, leaving: boolean): void {
    // Along a route like any walker; with no way on foot (a boat on the water), straight there.
    a.tiles = walkRoute(this.logic, a.at, to) ?? straightLine(a.at, to);
    a.run = run;
    a.endFacing = endFacing;
    a.leaving = leaving;
    if (a.tiles.length === 0) this.arriveActor(a);
  }

  private arriveActor(a: StageActor): void {
    if (a.endFacing) {
      a.facing = a.endFacing;
      setLook(a.sprite, a.look, a.facing);
    }
    if (a.leaving) {
      if (a.borrowed !== undefined) a.sprite.setVisible(false);
      else a.sprite.destroy();
      a.leaving = false;
      if (a.borrowed === undefined) for (const [id, x] of this.stageActors) if (x === a) this.stageActors.delete(id);
      if (this.stageCamera && !this.stageActors.has(this.stageCamera)) this.stageCamera = null;
    }
    if (this.stageBlocking === a) {
      this.stageBlocking = null;
      this.runStage();
    }
  }

  /** Walk everyone on stage a frame; count down a pause; keep the camera on whoever the scene follows. */
  private tickStage(delta: number): void {
    for (const [id, a] of this.stageActors) {
      // A picture gone from the scene (its owner left the map's people): drop it, never draw it.
      if (!a.sprite.scene) {
        this.stageActors.delete(id);
        if (this.stageBlocking === a) this.stageBlocking = null;
        continue;
      }
      if (!a.mover.moving) {
        const first = a.tiles.shift();
        if (!first) continue;
        a.mover.start(a.at, first);
      }
      a.mover.update(delta, speedPx(a.run), (reached) => {
        a.at = reached;
        return a.tiles.shift() ?? null;
      });
      const g = a.mover.glide;
      if (g) {
        const dir = combine(g.to.x > g.from.x ? 'right' : g.to.x < g.from.x ? 'left' : null, g.to.y > g.from.y ? 'down' : g.to.y < g.from.y ? 'up' : null);
        if (dir) a.facing = dir;
      }
      const p = a.mover.point(a.at);
      a.sprite.setPosition(p.x, p.y).setDepth(10 + p.y);
      setLook(a.sprite, a.look, a.facing, a.mover.moving ? a.mover.frame() : 0);
      if (!a.mover.moving) this.arriveActor(a);
    }
    if (this.stageWaitMs > 0) {
      this.stageWaitMs -= delta;
      if (this.stageWaitMs <= 0) this.runStage();
    }
    if (this.mode === 'dialogue') {
      const followed = this.stageCamera ? this.stageActors.get(this.stageCamera) : undefined;
      const target = followed ? followed.mover.point(followed.at) : this.mover.point(this.logic.state.player.pos);
      // Glide towards the target rather than jump (a cut feels like a teleport).
      const cam = this.cameras.main;
      const want = cameraScroll({ x: target.x, y: target.y - TILE_SIZE / 2 }, this.camBounds, VIEW_WIDTH, VIEW_HEIGHT);
      const k = Math.min(1, delta / 180);
      if (this.stageActors.size > 0 || Math.abs(cam.scrollX - want.x) > 0.5 || Math.abs(cam.scrollY - want.y) > 0.5) {
        cam.setScroll(Math.round(cam.scrollX + (want.x - cam.scrollX) * k), Math.round(cam.scrollY + (want.y - cam.scrollY) * k));
      }
    }
  }

  /** The scene is over: everyone on stage leaves the picture, and the camera goes back to Gianna. */
  private clearStage(): void {
    for (const [id, a] of this.stageActors) {
      if (id === 'yari' && a.borrowed === undefined && a.sprite.visible) this.yariStaged = { ...a.at };
      if (a.borrowed === undefined) a.sprite.destroy();
      else if (a.borrowed === 'follower' || a.borrowed === 'yari') {
        // Anissa (or Yari) follows on from wherever the scene left her.
        const f = a.borrowed === 'follower' ? this.follower : this.yari;
        if (f) {
          f.pos = { ...a.at };
          f.from = { ...a.at };
          f.facing = a.facing;
          a.sprite.setVisible(this.logic.era !== 'echo' || a.borrowed === 'follower');
        }
      } else {
        // Someone from the map walks back to their place (or is put back, if they had left the stage).
        const placed = this.npcPlaced.get(a.borrowed);
        if (!placed) continue;
        if (!a.sprite.visible) {
          const w = tileToWorld(placed.pos);
          a.sprite.setVisible(true).setPosition(w.x, w.y);
          setLook(a.sprite, a.look, placed.facing);
        } else if (!samePos(a.at, placed.pos)) {
          const tiles = walkRoute(this.logic, a.at, placed.pos);
          if (tiles && tiles.length > 0) this.walkers.set(a.borrowed, { mover: new Mover(), at: { ...a.at }, tiles, look: a.look, facing: a.facing });
          else {
            const w = tileToWorld(placed.pos);
            a.sprite.setPosition(w.x, w.y);
          }
        }
      }
    }
    this.stageActors.clear();
    this.stageQueue = [];
    this.stageBlocking = null;
    this.stageWaitMs = 0;
    this.stageThen = null;
    this.stageCamera = null;
    setLook(this.player, this.playerLook(), this.logic.state.player.facing);
    this.placeCamera(this.mover.point(this.logic.state.player.pos));
  }

  private playFx(fx: string): void {
    const cam = this.cameras.main;
    if (fx === 'flash') cam.flash(600, 255, 244, 214);
    else if (fx === 'shake') cam.shake(260, 0.008);
    else if (fx === 'fade') {
      cam.fadeOut(250, 0, 0, 0);
      cam.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => cam.fadeIn(450, 0, 0, 0));
    }
  }

  private updateDialogue(wasTyping = false): void {
    const input = this.rt.input;
    // While a scene is acted out, presses wait (the line is not on screen yet).
    if (this.staging) return;
    const advance = input.pressed('confirm') || input.pressed('cancel');
    if (this.dialogue.typing || wasTyping) {
      if (advance) this.dialogue.finishTyping();
      return;
    }
    if (this.dialogue.choiceCount > 0) {
      if (input.pressed('up')) this.dialogue.moveCursor(-1);
      if (input.pressed('down')) this.dialogue.moveCursor(1);
      if (input.pressed('confirm')) this.afterDialogueInput(this.logic.choose(this.dialogue.choiceCursor));
      return;
    }
    if (advance) this.afterDialogueInput(this.logic.advance());
  }

  private afterDialogueInput(effects: Effect[]): void {
    if (this.logic.mode === 'dialogue') this.showDialogueView();
    this.handle(effects);
  }

  // ---- Menu ----------------------------------------------------------------------------------

  /** The System tab: saving, settings, credits, a new game. */
  private menuItems(): MenuItem[] {
    const s = this.logic.state.settings;
    const items: MenuItem[] = [];
    if (s.hints && this.questHere() && this.anissaWithUs()) items.push({ id: 'ask', label: 'Ask Anissa' });
    items.push(
      { id: 'save', label: 'Save' },
      { id: 'speed', label: `Text speed: ${capitalise(s.textSpeed)}` },
      { id: 'textsize', label: `Text size: ${capitalise(textSize())}` },
      { id: 'music', label: `Music: ${volumeLabel(audio.volume.music)}` },
      { id: 'sound', label: `Sound: ${volumeLabel(audio.volume.sound)}` },
      { id: 'hints', label: `Anissa's hints: ${s.hints ? 'On' : 'Off'}` },
      { id: 'arrows', label: `Quest arrows: ${questArrows() ? 'On' : 'Off'}` },
      ...(isStandalone() ? [] : [{ id: 'fullscreen', label: isFullscreen() ? 'Exit full screen' : 'Full screen' }]),
      { id: 'export', label: 'Export save code' },
      { id: 'import', label: 'Import save code' },
      { id: 'intro', label: 'Watch the intro' },
      { id: 'credits', label: 'Credits' },
      { id: 'new', label: this.confirmNewGame ? 'New game? Press A again' : 'New game' },
      { id: 'close', label: 'Close' },
    );
    return items;
  }

  private openMenu(tab: MenuTab = 'Status'): void {
    this.cancelWalk();
    this.confirmNewGame = false;
    this.mode = 'menu';
    this.menu.open({
      flags: this.logic.state.flags,
      mapId: this.map.id,
      era: this.logic.era,
      journal: () => this.journalLines(),
      system: () => this.menuItems(),
      maps: this.logic.maps,
      rawMap: (id) => (this.cache.tilemap.get(tilemapKey(id)) as { data?: TiledMap } | undefined)?.data,
      pos: { ...this.logic.state.player.pos },
    }, tab);
  }

  private closeMenu(): void {
    this.menu.close();
    this.mode = 'field';
    this.rt.input.clearPresses();
  }

  private cycleTextSpeed(delta: number): void {
    const s = this.logic.state.settings;
    const i = TEXT_SPEED_ORDER.indexOf(s.textSpeed);
    s.textSpeed = TEXT_SPEED_ORDER[(i + delta + TEXT_SPEED_ORDER.length) % TEXT_SPEED_ORDER.length]!;
    this.menu.refresh();
  }

  private updateMenu(): void {
    const input = this.rt.input;
    const before = this.menu.snapshot();
    const requests = this.menu.update(input);
    this.runMenuRequests(requests, before);
  }

  /** Act on what the menu asked for (closing, a toast, a System choice). */
  private runMenuRequests(requests: MenuRequest[], before = this.menu.snapshot()): void {
    const now = this.menu.snapshot();
    // Moving off "New game" cancels its confirmation.
    if (this.confirmNewGame && (now?.tab !== 'System' || now.items[now.cursor] !== before?.items[before.cursor])) {
      this.confirmNewGame = false;
      this.menu.refresh();
    }
    for (const r of requests) {
      if (r.kind === 'close') {
        this.closeMenu();
        return;
      }
      if (r.kind === 'toast') this.toast.show(r.text);
      if (r.kind === 'system') this.runSystem(r.id);
      if (r.kind === 'showcase') this.openShowcase(r.id);
    }
  }

  private runSystem(id: string): void {
    switch (id) {
      case 'ask':
        this.closeMenu();
        this.askAnissa();
        break;
      case 'save':
        this.closeMenu();
        this.toast.show(saveGame(this.rt) ? 'Saved' : 'Could not save');
        audio.sfx('save');
        break;
      case 'music':
        audio.setVolumes({ music: nextVolume(VOLUME_STEPS, audio.volume.music) });
        this.menu.refresh();
        break;
      case 'sound':
        audio.setVolumes({ sound: nextVolume(VOLUME_STEPS, audio.volume.sound) });
        audio.sfx('confirm');
        this.menu.refresh();
        break;
      case 'speed':
        this.cycleTextSpeed(1);
        break;
      case 'textsize':
        // Every text is laid out again at the new size: rebuild the scene (the game state stays).
        setTextSize(textSize() === 'normal' ? 'large' : 'normal');
        this.scene.restart({ toast: `Text size: ${capitalise(textSize())}` });
        break;
      case 'arrows': {
        setQuestArrows(!questArrows());
        this.refreshGuide();
        this.menu.refresh();
        break;
      }
      case 'hints': {
        const s = this.logic.state.settings;
        s.hints = !s.hints;
        if (!s.hints) this.hint.hide();
        this.menu.refresh();
        break;
      }
      case 'fullscreen':
        if (toggleFullscreen(() => this.returnFromModal()) === 'help') this.mode = 'modal';
        else this.closeMenu();
        break;
      case 'export':
        this.mode = 'modal';
        openExportDialog(encodeSave(toSaveData(this.logic.state, Date.now())), () => this.returnFromModal());
        break;
      case 'import':
        this.mode = 'modal';
        this.openImport();
        break;
      case 'intro':
        // The field starts again when the intro ends (the game state stays, as for a text size change).
        this.closeMenu();
        this.scene.start('intro', { opening: 'full' });
        break;
      case 'credits':
        this.openCredits();
        break;
      case 'new':
        if (!this.confirmNewGame) {
          this.confirmNewGame = true;
          this.menu.refresh();
        } else {
          deleteSave(this.rt.storage, SAVE_STORAGE_KEY);
          this.logic.reset(newGame(this.rt.maps[this.rt.start.map]!, this.rt.start.spawn));
          this.scene.restart({ toast: 'New game' });
        }
        break;
      case 'close':
        this.closeMenu();
        break;
    }
  }

  private openImport(): void {
    let imported = false;
    openImportDialog(
      (code) => {
        const result = decodeSave(code);
        if (!result.ok) return result.error;
        if (!saveFits(result.data, this.rt.maps)) return 'That save code points at a place this version does not have.';
        applySave(this.logic.state, result.data);
        this.logic.reset();
        saveGame(this.rt);
        imported = true;
        return null;
      },
      () => {
        if (imported) this.scene.restart({ toast: 'Save code loaded' });
        else this.returnFromModal();
      },
    );
  }

  private returnFromModal(): void {
    this.mode = 'menu';
    this.rt.input.clearPresses();
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  // ---- Debug / tests -------------------------------------------------------------------------

  private snapshot(): FieldSnapshot {
    const p = this.logic.state.player;
    const quest = this.quest();
    const objective = quest ? currentObjective(quest, this.logic.state.flags) : null;
    const f = this.follower;
    return {
      mode: this.mode,
      mapId: p.mapId,
      x: p.pos.x,
      y: p.pos.y,
      facing: p.facing,
      era: p.era,
      moving: this.mover.moving,
      label: this.label.visible ? this.labelText.text : null,
      markers: [...this.markerSprites.keys()].sort(),
      glowing: [...this.glowing].sort(),
      glowed: [...this.lastGlowed].sort(),
      flags: this.logic.state.flags.snapshot(),
      dialogue: this.dialogue.snapshot(),
      menu: this.menu.snapshot(),
      shop: this.shopPanel.snapshot(),
      rhythm: this.rhythmPanel.snapshot(),
      showcase: this.showcase.snapshot(),
      battle: battleSnapshot(),
      minimap: this.minimap?.visible ? this.minimap.place : null,
      journal: this.mode === 'journal' ? this.panel.snapshot() : null,
      card: this.mode === 'card' ? this.panel.snapshot() : null,
      toast: this.toast.lastMessage,
      hint: this.hint.lastHint,
      objective: objective?.id ?? null,
      echoFilter: this.echoWash.visible,
      stage: {
        busy: this.staging,
        actors: [...this.stageActors].map(([id, a]) => ({ id, x: a.at.x, y: a.at.y, moving: a.mover.moving || a.tiles.length > 0 })),
      },
      follower: f ? { x: f.pos.x, y: f.pos.y, glowing: f.glow !== null } : null,
      yari: this.yari ? { x: this.yari.pos.x, y: this.yari.pos.y, visible: this.yari.sprite.visible } : null,
      guide: this.guideWay ? { ...this.guideWay.at, final: this.guideWay.final, arrow: !!this.guideArrow?.visible, mark: !!this.guideMark?.visible } : null,
      crowd: this.crowd.length,
    };
  }
}

declare global {
  interface Window {
    /** Test hook used by the Playwright smoke test (reads state; showItem only displays). */
    __quest?: {
      ready: boolean;
      snapshot: () => FieldSnapshot;
      tileToScreen: (x: number, y: number) => { x: number; y: number };
      gameToScreen: (x: number, y: number) => { x: number; y: number };
      /** Show an item's showcase (display only: it changes no flags), for screenshots of every tier. */
      showItem: (id: string) => void;
      /** Start a battle by id (the smoke test plays the first battle without walking to it). */
      /** `extra`: member ids added to the party for this fight only (screenshots of a full field). */
      startBattle: (id: string, extra?: string[]) => void;
      /** Play one battle effect (for the effects screenshots). */
      battleFx: (kind: FxKind, freezeAt?: number) => void;
    };
  }
}
