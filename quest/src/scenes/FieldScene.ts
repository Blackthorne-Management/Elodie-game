// The field: draws the current map for the current era and animates what the game logic
// (engine/game.ts) decides: steps, doors, triggers, talking, puzzle objects, the Echo swap with its
// screen filter, dialogue and end cards. It also runs Anissa (who follows Gianna, and holds the door
// while Gianna is in the Echo), her hints, the Journal and the pause menu. All rules come from the
// engine; all content from src/data; every visual from assets.config.ts.

import Phaser from 'phaser';
import {
  ANISSA_GLOW,
  ECHO_DITHER_TEXTURE,
  ECHO_FILTER,
  TILESET,
  UI,
  textureKeyForNpc,
  textureKeyForPlayer,
} from '../assets.config.ts';
import { RUN_MS_PER_TILE, SAVE_STORAGE_KEY, TEXT_SPEED_ORDER, TILE_SIZE, VIEW_HEIGHT, VIEW_WIDTH, WALK_MS_PER_TILE } from '../config.ts';
import { ACT1, JOURNAL_NOTES } from '../data/quests.ts';
import type { Effect, GameLogic } from '../engine/game.ts';
import { DIRS, type Dir, type Era, type Pos } from '../engine/types.ts';
import { opposite, samePos, stepFrom } from '../engine/grid.ts';
import { currentObjective, journalEntries, journalNotes } from '../engine/quests.ts';
import { decodeSave, deleteSave, encodeSave } from '../engine/save.ts';
import { applySave, newGame, saveFits, toSaveData } from '../engine/state.ts';
import { TILE_LAYERS, rectTiles, visibleLayersFor, type GameMap, type NpcPlacement } from '../engine/tiledMap.ts';
import { getRuntime, saveGame, type Runtime } from '../runtime.ts';
import { DialogueBox } from '../ui/DialogueBox.ts';
import { HintBubble } from '../ui/HintBubble.ts';
import { isFullscreen, isStandalone, toggleFullscreen } from '../ui/fullscreen.ts';
import { MenuPanel, type MenuItem } from '../ui/MenuPanel.ts';
import { TextPanel, type PanelLine } from '../ui/TextPanel.ts';
import { Toast } from '../ui/Toast.ts';
import { openExportDialog, openImportDialog } from '../ui/saveCodeDialog.ts';
import { tilemapKey } from './BootScene.ts';

type UiMode = 'field' | 'dialogue' | 'card' | 'menu' | 'journal' | 'modal';

interface Step {
  from: Pos;
  to: Pos;
  elapsed: number;
  duration: number;
}

interface Follower {
  sprite: Phaser.GameObjects.Image;
  pos: Pos;
  from: Pos;
  facing: Dir;
  glow: Phaser.Tweens.Tween | null;
}

export interface FieldSnapshot {
  mode: UiMode;
  mapId: string;
  x: number;
  y: number;
  facing: Dir;
  era: string;
  moving: boolean;
  flags: Record<string, unknown>;
  dialogue: ReturnType<DialogueBox['snapshot']>;
  menu: ReturnType<MenuPanel['snapshot']>;
  journal: string[] | null;
  card: string[] | null;
  toast: string;
  hint: string;
  objective: string | null;
  echoFilter: boolean;
  follower: { x: number; y: number; glowing: boolean } | null;
}

const ERA_LAYERS = [TILE_LAYERS.groundPresent, TILE_LAYERS.decoPresent, TILE_LAYERS.groundEcho, TILE_LAYERS.decoEcho];

function tileToWorld(pos: Pos): { x: number; y: number } {
  return { x: pos.x * TILE_SIZE + TILE_SIZE / 2, y: pos.y * TILE_SIZE + TILE_SIZE };
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
  private objectSprites = new Map<string, Phaser.GameObjects.Image[]>();
  private follower: Follower | null = null;
  private echoWash!: Phaser.GameObjects.Rectangle;
  private echoDither!: Phaser.GameObjects.TileSprite;
  private echoMatrix: Phaser.FX.ColorMatrix | null = null;
  private dialogue!: DialogueBox;
  private menu!: MenuPanel;
  private toast!: Toast;
  private hint!: HintBubble;
  private panel!: TextPanel;
  private mode: UiMode = 'field';
  private step: Step | null = null;
  private talkingTo: NpcPlacement | null = null;
  private confirmNewGame = false;
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
    this.step = null;
    this.layers = {};
    this.npcSprites = new Map();
    this.objectSprites = new Map();
    this.follower = null;
    this.echoMatrix = null;
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
    this.player = this.add.image(p.x, p.y, textureKeyForPlayer(state.player.facing, state.player.era)).setOrigin(0.5, 1);
    this.player.setDepth(10 + p.y);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.map.width * TILE_SIZE, this.map.height * TILE_SIZE);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true, 1, 1, 0, TILE_SIZE / 2);

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

    this.dialogue = new DialogueBox(this);
    this.menu = new MenuPanel(this);
    this.toast = new Toast(this);
    this.hint = new HintBubble(this);
    this.panel = new TextPanel(this);
    if (data?.toast) this.toast.show(data.toast);

    this.applyEra();
    this.syncActors();
    this.placeFollower();

    this.rt.input.clearPresses();
    window.__quest = { ready: true, snapshot: () => this.snapshot() };

    // Resume a dialogue or card the logic is in (after a door), then run on-enter scenes.
    if (this.logic.mode === 'dialogue') this.enterDialogueMode();
    else if (this.logic.mode === 'card') this.showCard();
    else this.handle(this.logic.enterMap());
  }

  update(_time: number, delta: number): void {
    const input = this.rt.input;
    input.update();
    switch (this.mode) {
      case 'field':
        this.tickHints(delta);
        this.updateField(delta);
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
          break;
        case 'talk': {
          this.talkingTo = e.npc;
          const def = this.logic.content.npcs[e.npc.npc];
          const facing = opposite(this.logic.state.player.facing);
          if (def) this.npcSprites.get(e.npc.objectId)?.setTexture(textureKeyForNpc(def.look, facing));
          break;
        }
        case 'dialogue':
          this.enterDialogueMode();
          break;
        case 'card':
          this.showCard();
          break;
      }
    }
    if (changeMap) {
      this.scene.restart({ toast: this.toast.lastMessage });
      return;
    }
    if (this.logic.mode === 'field' && this.mode === 'dialogue') this.leaveDialogueMode();
  }

  // ---- Field ---------------------------------------------------------------------------------

  private updateField(delta: number): void {
    const input = this.rt.input;
    if (this.step) {
      this.step.elapsed += delta;
      const t = Math.min(1, this.step.elapsed / this.step.duration);
      const a = tileToWorld(this.step.from);
      const b = tileToWorld(this.step.to);
      this.player.setPosition(Math.round(a.x + (b.x - a.x) * t), Math.round(a.y + (b.y - a.y) * t));
      this.player.setDepth(10 + this.player.y);
      this.moveFollower(t);
      if (t < 1) return;
      const leftover = this.step.elapsed - this.step.duration;
      const to = this.step.to;
      this.step = null;
      this.handle(this.logic.finishStep(to));
      // Keep walking smoothly while a direction is held.
      if (this.mode === 'field' && !this.step && this.scene.isActive()) {
        const dir = input.move();
        if (dir && input.held(dir)) this.startStep(dir, leftover);
      }
      return;
    }

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
    const dir = input.move();
    if (dir) this.startStep(dir, 0);
  }

  private startStep(dir: Dir, carry: number): void {
    const attempt = this.logic.tryStep(dir);
    const p = this.logic.state.player;
    this.player.setTexture(textureKeyForPlayer(p.facing, p.era));
    if (!attempt.ok) {
      if (attempt.reason === 'door_in_echo' && this.rt.input.pressed(dir)) this.toast.show(this.logic.content.messages.doorInEcho);
      return;
    }
    const duration = this.rt.input.held('run') ? RUN_MS_PER_TILE : WALK_MS_PER_TILE;
    this.step = { from: { ...p.pos }, to: attempt.to, elapsed: Math.min(carry, duration - 1), duration };
    this.startFollowerStep(p.pos);
  }

  // ---- Era and actors ------------------------------------------------------------------------

  private applyEra(): void {
    const era = this.logic.era;
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
    const p = this.logic.state.player;
    this.player.setTexture(textureKeyForPlayer(p.facing, p.era));
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
        sprite = this.add.image(w.x, w.y, textureKeyForNpc(def.look, n.facing)).setOrigin(0.5, 1).setDepth(10 + w.y);
        this.npcSprites.set(n.objectId, sprite);
      } else if (this.talkingTo?.objectId !== n.objectId) {
        sprite.setTexture(textureKeyForNpc(def.look, n.facing));
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
      if (this.objectSprites.has(o.id)) continue;
      const sprites = rectTiles(o.area).map((t) =>
        this.add.image(t.x * TILE_SIZE, t.y * TILE_SIZE, TILESET.textureKey, o.kind).setOrigin(0, 0).setDepth(o.walkable ? 1.5 : 5),
      );
      this.objectSprites.set(o.id, sprites);
    }
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
    const tryDirs: Dir[] = [opposite(p.facing), ...DIRS];
    const spot =
      tryDirs.map((d) => stepFrom(p.pos, d)).find((t) => this.logic.isOpen(t, 'present') && !this.logic.npcs('present').some((n) => samePos(n.pos, t))) ??
      p.pos;
    const w = tileToWorld(spot);
    const sprite = this.add.image(w.x, w.y, textureKeyForNpc(ANISSA_GLOW.look, p.facing)).setOrigin(0.5, 1).setDepth(10 + w.y - 1);
    this.follower = { sprite, pos: spot, from: spot, facing: p.facing, glow: null };
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
      f.sprite.setTint(ANISSA_GLOW.tint).setAlpha(ANISSA_GLOW.alpha).setTexture(textureKeyForNpc(ANISSA_GLOW.look, 'down'));
      f.glow = this.tweens.add({ targets: f.sprite, alpha: ANISSA_GLOW.pulseAlpha, duration: 700, yoyo: true, repeat: -1 });
    } else {
      f.sprite.clearTint().setAlpha(1);
    }
  }

  private startFollowerStep(playerFrom: Pos): void {
    const f = this.follower;
    if (!f || this.logic.era === 'echo') return;
    f.from = f.pos;
    if (samePos(f.pos, playerFrom)) return;
    const dx = playerFrom.x - f.pos.x;
    const dy = playerFrom.y - f.pos.y;
    f.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
    f.pos = { ...playerFrom };
    f.sprite.setTexture(textureKeyForNpc(ANISSA_GLOW.look, f.facing));
  }

  private moveFollower(t: number): void {
    const f = this.follower;
    if (!f || this.logic.era === 'echo') return;
    const a = tileToWorld(f.from);
    const b = tileToWorld(f.pos);
    f.sprite.setPosition(Math.round(a.x + (b.x - a.x) * t), Math.round(a.y + (b.y - a.y) * t));
    f.sprite.setDepth(10 + f.sprite.y - 1);
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

  private openJournal(): void {
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
      if (def) this.npcSprites.get(n.objectId)?.setTexture(textureKeyForNpc(def.look, n.facing));
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

  private menuItems(): MenuItem[] {
    const s = this.logic.state.settings;
    const items: MenuItem[] = [{ id: 'journal', label: 'Journal' }];
    if (s.hints && this.questHere() && this.anissaWithUs()) items.push({ id: 'ask', label: 'Ask Anissa' });
    items.push(
      { id: 'save', label: 'Save' },
      { id: 'speed', label: `Text speed: ${capitalise(s.textSpeed)}` },
      { id: 'hints', label: `Anissa's hints: ${s.hints ? 'On' : 'Off'}` },
      ...(isStandalone() ? [] : [{ id: 'fullscreen', label: isFullscreen() ? 'Exit full screen' : 'Full screen' }]),
      { id: 'export', label: 'Export save code' },
      { id: 'import', label: 'Import save code' },
      { id: 'new', label: this.confirmNewGame ? 'New game? Press A again' : 'New game' },
      { id: 'close', label: 'Close' },
    );
    return items;
  }

  private openMenu(): void {
    this.confirmNewGame = false;
    this.mode = 'menu';
    this.menu.open(this.menuItems());
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
    this.menu.setItems(this.menuItems());
  }

  private updateMenu(): void {
    const input = this.rt.input;
    if (input.pressed('menu') || input.pressed('cancel')) {
      this.closeMenu();
      return;
    }
    if (input.pressed('up')) this.menu.moveCursor(-1);
    if (input.pressed('down')) this.menu.moveCursor(1);
    const item = this.menu.current;
    if (item?.id === 'speed' && (input.pressed('left') || input.pressed('right'))) {
      this.cycleTextSpeed(input.pressed('left') ? -1 : 1);
    }
    if (item?.id !== 'new' && this.confirmNewGame) {
      this.confirmNewGame = false;
      this.menu.setItems(this.menuItems());
    }
    if (!input.pressed('confirm') || !item) return;
    switch (item.id) {
      case 'journal':
        this.openJournal();
        break;
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
        this.menu.setItems(this.menuItems());
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
      case 'new':
        if (!this.confirmNewGame) {
          this.confirmNewGame = true;
          this.menu.setItems(this.menuItems());
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
      moving: this.step !== null,
      flags: this.logic.state.flags.snapshot(),
      dialogue: this.dialogue.snapshot(),
      menu: this.menu.snapshot(),
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
    __quest?: { ready: boolean; snapshot: () => FieldSnapshot };
  }
}
