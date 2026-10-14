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
  CHARACTER_LABEL_GAP,
  ECHO_DITHER_TEXTURE,
  ECHO_FILTER,
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
import { ACT1, JOURNAL_NOTES } from '../data/quests.ts';
import type { Effect, GameLogic, Target } from '../engine/game.ts';
import { DIRS, type Dir8, type Era, type Pos } from '../engine/types.ts';
import { facingToward, opposite, samePos, spriteFacing, stepFrom } from '../engine/grid.ts';
import { Mover, restDistance, speedPx, stepLength, tileFoot, walkFrame } from '../engine/motion.ts';
import { cameraBounds, cameraScroll } from '../engine/scaling.ts';
import { dirButtons } from '../input/actions.ts';
import { currentObjective, journalEntries, journalNotes } from '../engine/quests.ts';
import { decodeSave, deleteSave, encodeSave } from '../engine/save.ts';
import { applySave, newGame, saveFits, toSaveData } from '../engine/state.ts';
import { TILE_LAYERS, rectTiles, visibleLayersFor, type GameMap, type NpcPlacement } from '../engine/tiledMap.ts';
import { getRuntime, saveGame, type Runtime } from '../runtime.ts';
import { DialogueBox } from '../ui/DialogueBox.ts';
import { HintBubble } from '../ui/HintBubble.ts';
import { isFullscreen, isStandalone, toggleFullscreen } from '../ui/fullscreen.ts';
import { GameMenu } from '../ui/GameMenu.ts';
import type { MenuItem } from '../ui/MenuPanel.ts';
import { SideMap } from '../ui/SideMap.ts';
import { ShopPanel } from '../ui/ShopPanel.ts';
import { RPG } from '../data/rpg.ts';
import { cityOf, level, partyMembers } from '../engine/rpg.ts';
import { rewardText, settleRewards } from '../engine/sideQuests.ts';
import { SIDE_QUESTS } from '../data/sideQuests.ts';
import { planTap } from '../engine/tap.ts';
import { TextPanel, type PanelLine } from '../ui/TextPanel.ts';
import { Toast } from '../ui/Toast.ts';
import { openExportDialog, openImportDialog } from '../ui/saveCodeDialog.ts';
import { tilemapKey } from './BootScene.ts';

type UiMode = 'field' | 'dialogue' | 'card' | 'menu' | 'journal' | 'modal' | 'shop';

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
  flags: Record<string, unknown>;
  dialogue: ReturnType<DialogueBox['snapshot']>;
  menu: ReturnType<GameMenu['snapshot']>;
  shop: ReturnType<ShopPanel['snapshot']>;
  minimap: string | null;
  journal: string[] | null;
  card: string[] | null;
  toast: string;
  hint: string;
  objective: string | null;
  echoFilter: boolean;
  follower: { x: number; y: number; glowing: boolean } | null;
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
  private objectSprites = new Map<string, Phaser.GameObjects.GameObject[]>();
  private markerSprites = new Map<string, Phaser.GameObjects.Image>();
  private label!: Phaser.GameObjects.Container;
  private labelText!: Phaser.GameObjects.Text;
  private labelBg!: Phaser.GameObjects.Graphics;
  private labelKey = '';
  /** Objects the Echo changed, waiting to glow once the player is back in the field. */
  private pendingGlow: string[] = [];
  private glowing = new Set<string>();
  private follower: Follower | null = null;
  private echoWash!: Phaser.GameObjects.Rectangle;
  private echoDither!: Phaser.GameObjects.TileSprite;
  private echoMatrix: Phaser.FX.ColorMatrix | null = null;
  private dialogue!: DialogueBox;
  private menu!: GameMenu;
  private shopPanel!: ShopPanel;
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
    this.objectSprites = new Map();
    this.markerSprites = new Map();
    this.labelKey = '';
    this.pendingGlow = [];
    this.glowing = new Set();
    this.follower = null;
    this.echoMatrix = null;
    this.autoPath = [];
    this.autoFace = null;
    this.lastLevels = this.levelsNow();
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.onTap(p));
    this.map = this.logic.map;

    const tilemap = this.make.tilemap({ key: tilemapKey(this.map.id) });
    const tileset = tilemap.addTilesetImage(TILESET.name, TILESET.textureKey);
    if (!tileset) throw new Error(`Map ${this.map.id} has no "${TILESET.name}" tileset`);
    ERA_LAYERS.forEach((name, i) => {
      const layer = tilemap.createLayer(name, tileset, 0, 0);
      if (layer) this.layers[name] = layer.setDepth(i % 2).setVisible(true);
    });
    tilemap.createLayer(TILE_LAYERS.above, tileset, 0, 0)?.setDepth(3000);

    // Echo Zones shimmer.
    for (const zone of this.map.echoZones) {
      const a = zone.area;
      const r = this.add
        .rectangle(a.x * TILE_SIZE, a.y * TILE_SIZE, a.width * TILE_SIZE, a.height * TILE_SIZE, UI.echoZone, UI.echoZoneAlpha)
        .setOrigin(0, 0)
        .setDepth(2);
      this.tweens.add({ targets: r, alpha: 0.35, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
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
    this.echoDither = this.add
      .tileSprite(0, 0, VIEW_WIDTH, VIEW_HEIGHT, ECHO_DITHER_TEXTURE)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setAlpha(ECHO_FILTER.ditherAlpha)
      .setDepth(4001);

    // The name label over what the player faces (world space, above the actors, under the interface).
    this.labelBg = this.add.graphics();
    this.labelText = this.add.text(0, 0, '', { fontFamily: UI.font, fontSize: `${UI.fontSizePx}px`, color: UI.labelText }).setOrigin(0.5, 1);
    this.label = this.add.container(0, 0, [this.labelBg, this.labelText]).setDepth(3500).setVisible(false);

    this.dialogue = new DialogueBox(this);
    this.menu = new GameMenu(this);
    this.shopPanel = new ShopPanel(this);
    this.toast = new Toast(this);
    this.hint = new HintBubble(this);
    this.panel = new TextPanel(this);
    if (data?.toast) this.toast.show(data.toast);

    this.applyEra();
    this.syncActors();
    this.placeFollower();

    this.rt.input.clearPresses();
    window.__quest = { ready: true, snapshot: () => this.snapshot(), tileToScreen: (x, y) => this.tileToScreen(x, y) };

    // Resume a dialogue or card the logic is in (after a door), then run on-enter scenes.
    if (this.logic.mode === 'dialogue') this.enterDialogueMode();
    else if (this.logic.mode === 'card') this.showCard();
    else this.handle(this.logic.enterMap());
  }

  update(_time: number, delta: number): void {
    const input = this.rt.input;
    input.update();
    // In a bar the minimap always shows; on the picture (no bars) only in the field, out of the way of
    // Anissa's hint, menus, shops and dialogue.
    const onPicture = document.body.dataset.layout === 'overlay';
    this.minimap?.setVisible(!onPicture || (this.mode === 'field' && !this.hint.visible));
    switch (this.mode) {
      case 'field':
        this.tickHints(delta);
        this.updateField(delta);
        this.minimap?.follow(this.logic.state.player.pos);
        this.updateLabel();
        this.startPendingGlow();
        break;
      case 'dialogue':
        this.dialogue.update(delta);
        this.updateDialogue();
        break;
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
      case 'modal':
        break;
    }
  }

  // ---- Effects -------------------------------------------------------------------------------

  /** Show what the logic did. */
  private handle(effects: Effect[]): void {
    let changeMap = false;
    for (const e of effects) {
      switch (e.kind) {
        case 'map':
          changeMap = true;
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
          break;
        case 'era':
          this.swapVisuals(e.era);
          break;
        case 'sync':
          this.syncActors();
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
        case 'shop': {
          // A vendor's greeting ended: their shop opens over the field.
          const shop = RPG.shops[e.shop];
          if (!shop) break;
          if (this.mode === 'dialogue') this.leaveDialogueMode();
          this.shopPanel.open(shop, this.logic.state.flags);
          this.mode = 'shop';
          break;
        }
        case 'encounter':
          // An ambush: a red flash before the foes speak (the battle screen replaces this in Phase 3).
          this.cameras.main.flash(250, 180, 40, 40);
          break;
      }
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
    for (const q of settleRewards(flags, RPG, SIDE_QUESTS)) this.toast.show(`Quest complete: ${q.title} (${rewardText(q, RPG)})`);
    const now = this.levelsNow();
    for (const [id, lv] of now) {
      const before = this.lastLevels.get(id);
      if (before !== undefined && lv > before) {
        const name = RPG.members.find((m) => m.id === id)?.name ?? id;
        this.toast.show(`${name} reached level ${lv}!`);
      }
    }
    this.lastLevels = now;
  }

  // ---- Tap to move ---------------------------------------------------------------------------

  /** The page position of a tile's centre (tests tap there). */
  private tileToScreen(x: number, y: number): { x: number; y: number } {
    const r = this.game.canvas.getBoundingClientRect();
    const cam = this.cameras.main;
    const k = r.width / VIEW_WIDTH;
    return { x: r.left + ((x + 0.5) * TILE_SIZE - cam.scrollX) * k, y: r.top + ((y + 0.5) * TILE_SIZE - cam.scrollY) * k };
  }

  /** A tap or click on the picture: walk there, or up to the person or thing tapped and use it. */
  private onTap(p: Phaser.Input.Pointer): void {
    if (this.mode !== 'field' || this.leaving) return;
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
      if (attempt.reason === 'door_in_echo' && dirButtons(dir).some((d) => this.rt.input.pressed(d))) {
        this.toast.show(this.logic.content.messages.doorInEcho);
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
    if (target.kind === 'door') return { x: target.door.pos.x * TILE_SIZE + TILE_SIZE / 2, y: target.door.pos.y * TILE_SIZE - 2 };
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

  /** The minimap (a page element in the black bars) for this map and era, named after the city section. */
  private buildMinimap(era: Era): void {
    this.minimap ??= sharedSideMap();
    const found = cityOf(RPG, this.map.id);
    const raw = this.rt.rawMaps[this.map.id];
    if (raw) this.minimap.setMap(this.map, raw, era, found ? `${found.city.name}: ${found.section.name}` : '');
    this.minimap.follow(this.logic.state.player.pos);
  }

  private swapVisuals(_era: Era): void {
    const f = ECHO_FILTER.flash;
    this.cameras.main.flash(f.duration, f.r, f.g, f.b);
    this.applyEra();
    this.updateFollowerLook();
  }

  /** Draw the NPCs and puzzle objects active in this era with the current flags. */
  private syncActors(): void {
    const npcs = this.logic.npcs();
    const keep = new Set(npcs.map((n) => n.objectId));
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
      } else if (this.talkingTo?.objectId !== n.objectId) {
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

  /** In the present she walks behind Gianna; in the Echo she stays put, glowing, holding the door. */
  private updateFollowerLook(): void {
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
    const f = this.follower;
    if (!f || this.logic.era === 'echo') return;
    // Count the end of her last step (her walk cycle carries on across tiles).
    f.distance += Math.max(0, 1 - f.lastT) * stepLength(f.from, f.pos);
    f.lastT = 0;
    f.from = f.pos;
    if (samePos(f.pos, playerFrom)) return;
    const dx = playerFrom.x - f.pos.x;
    const dy = playerFrom.y - f.pos.y;
    f.facing = facingToward({ x: 0, y: 0 }, { x: dx, y: dy });
    f.pos = { ...playerFrom };
    setLook(f.sprite, ANISSA_GLOW.look, f.facing);
  }

  /** Anissa walks her step in time with Gianna's (`t` is how far through it Gianna is). */
  private moveFollower(t: number): void {
    const f = this.follower;
    if (!f || this.logic.era === 'echo') return;
    const a = tileToWorld(f.from);
    const b = tileToWorld(f.pos);
    const walking = t < 1 && !samePos(f.from, f.pos);
    if (walking) f.distance += Math.max(0, t - f.lastT) * stepLength(f.from, f.pos);
    else if (f.lastT < 1) f.distance = restDistance(f.distance + (1 - f.lastT) * stepLength(f.from, f.pos));
    f.lastT = t;
    f.sprite.setPosition(Math.round(a.x + (b.x - a.x) * t), Math.round(a.y + (b.y - a.y) * t));
    f.sprite.setDepth(10 + f.sprite.y - 1);
    setLook(f.sprite, ANISSA_GLOW.look, f.facing, walking ? walkFrame(f.distance) : 0);
  }

  // ---- Hints and Journal ---------------------------------------------------------------------

  private questHere(): boolean {
    return ACT1.maps.includes(this.map.id);
  }

  private tickHints(delta: number): void {
    if (!this.questHere() || !this.anissaWithUs()) return;
    const objective = currentObjective(ACT1, this.logic.state.flags);
    const index = this.rt.hints.tick(delta, objective?.id ?? null, objective?.hints.length ?? 0);
    if (index !== null && objective && this.logic.state.settings.hints) this.hint.show('Anissa', objective.hints[index]!);
  }

  private askAnissa(): void {
    const objective = currentObjective(ACT1, this.logic.state.flags);
    const index = objective ? this.rt.hints.onRequest(objective.hints.length) : null;
    this.hint.show('Anissa', objective && index !== null ? objective.hints[index]! : 'I think we did everything, Gigi.');
  }

  /** The Journal's lines (shown on the menu's Journal tab). */
  private journalLines(): PanelLine[] {
    const flags = this.logic.state.flags;
    const lines: PanelLine[] = [{ text: `JOURNAL: ${ACT1.title}`, color: UI.accentText }];
    if (!this.questHere()) lines.push({ text: 'Nothing to note here.', gap: 4 });
    else {
      const entries = journalEntries(ACT1, flags);
      const current = entries.find((e) => e.state === 'current');
      lines.push({ text: current ? `Now: ${current.title}` : 'Act I is complete.', color: UI.text, gap: 4 });
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
    this.dialogue.hide();
    this.hint.hide();
    this.mode = 'card';
    const lines: PanelLine[] = [
      { text: card.title, color: UI.cardTitle, center: true },
      ...card.lines.map((t, i) => ({ text: t, center: true, gap: i === 0 ? 10 : 2 })),
      { text: '(A to continue)', color: UI.dimText, center: true, gap: 16 },
    ];
    this.panel.open(lines, { fill: UI.cardFill, alpha: 1, border: false, top: 48 });
    this.rt.input.clearPresses();
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
    if (view.fx && view.fx !== this.lastFx) this.playFx(view.fx);
    this.lastFx = view.fx;
    this.dialogue.show(view, this.logic.state.settings.textSpeed);
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

  private updateDialogue(): void {
    const input = this.rt.input;
    const advance = input.pressed('confirm') || input.pressed('cancel');
    if (this.dialogue.typing) {
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
      { id: 'hints', label: `Anissa's hints: ${s.hints ? 'On' : 'Off'}` },
      ...(isStandalone() ? [] : [{ id: 'fullscreen', label: isFullscreen() ? 'Exit full screen' : 'Full screen' }]),
      { id: 'export', label: 'Export save code' },
      { id: 'import', label: 'Import save code' },
      { id: 'credits', label: 'Credits' },
      { id: 'new', label: this.confirmNewGame ? 'New game? Press A again' : 'New game' },
      { id: 'close', label: 'Close' },
    );
    return items;
  }

  private openMenu(): void {
    this.confirmNewGame = false;
    this.mode = 'menu';
    this.menu.open({
      flags: this.logic.state.flags,
      mapId: this.map.id,
      era: this.logic.era,
      journal: () => this.journalLines(),
      system: () => this.menuItems(),
    });
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
        break;
      case 'speed':
        this.cycleTextSpeed(1);
        break;
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
    const objective = this.questHere() ? currentObjective(ACT1, this.logic.state.flags) : null;
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
      flags: this.logic.state.flags.snapshot(),
      dialogue: this.dialogue.snapshot(),
      menu: this.menu.snapshot(),
      shop: this.shopPanel.snapshot(),
      minimap: this.minimap?.visible ? this.minimap.place : null,
      journal: this.mode === 'journal' ? this.panel.snapshot() : null,
      card: this.mode === 'card' ? this.panel.snapshot() : null,
      toast: this.toast.lastMessage,
      hint: this.hint.lastHint,
      objective: objective?.id ?? null,
      echoFilter: this.echoWash.visible,
      follower: f ? { x: f.pos.x, y: f.pos.y, glowing: f.glow !== null } : null,
    };
  }
}

declare global {
  interface Window {
    /** Read-only test hook used by the Playwright smoke test. */
    __quest?: { ready: boolean; snapshot: () => FieldSnapshot; tileToScreen: (x: number, y: number) => { x: number; y: number } };
  }
}
