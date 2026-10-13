// The field: draws the current map for the current era, moves the player on the grid, talks to NPCs,
// fires doors and triggers, and runs the dialogue box and pause menu. All rules come from the engine;
// all content from src/data.

import Phaser from 'phaser';
import { TILESET, UI, textureKeyForNpc, textureKeyForPlayer } from '../assets.config.ts';
import {
  RUN_MS_PER_TILE,
  SAVE_STORAGE_KEY,
  START_MAP_ID,
  START_SPAWN,
  TEXT_SPEED_ORDER,
  TILE_SIZE,
  WALK_MS_PER_TILE,
} from '../config.ts';
import { DIALOGUE } from '../data/dialogue.ts';
import { NPCS, type NpcDef } from '../data/npcs.ts';
import { SPEAKERS } from '../data/speakers.ts';
import { DialogueRunner } from '../engine/dialogue.ts';
import { canSwapEra, doorArrival, doorAt, opposite, samePos, stepFrom, triggerAt, tryMove } from '../engine/grid.ts';
import { decodeSave, deleteSave, encodeSave } from '../engine/save.ts';
import { applySave, newGame, saveFits, toSaveData } from '../engine/state.ts';
import { TILE_LAYERS, visibleLayersFor, type Door, type GameMap, type NpcPlacement } from '../engine/tiledMap.ts';
import type { Dir, Pos } from '../engine/types.ts';
import { getRuntime, saveGame, type Runtime } from '../runtime.ts';
import { DialogueBox } from '../ui/DialogueBox.ts';
import { MenuPanel, type MenuItem } from '../ui/MenuPanel.ts';
import { Toast } from '../ui/Toast.ts';
import { openExportDialog, openImportDialog } from '../ui/saveCodeDialog.ts';
import { tilemapKey } from './BootScene.ts';

type Mode = 'field' | 'dialogue' | 'menu' | 'modal';

interface NpcActor {
  placement: NpcPlacement;
  def: NpcDef;
  sprite: Phaser.GameObjects.Image;
}

interface Step {
  from: Pos;
  to: Pos;
  elapsed: number;
  duration: number;
}

export interface FieldSnapshot {
  mode: Mode;
  mapId: string;
  x: number;
  y: number;
  facing: Dir;
  era: string;
  moving: boolean;
  flags: Record<string, unknown>;
  dialogue: ReturnType<DialogueBox['snapshot']>;
  menu: ReturnType<MenuPanel['snapshot']>;
  toast: string;
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
  private npcs: NpcActor[] = [];
  private dialogue!: DialogueBox;
  private menu!: MenuPanel;
  private toast!: Toast;
  private mode: Mode = 'field';
  private step: Step | null = null;
  private runner: DialogueRunner | null = null;
  private onDialogueEnd: (() => void) | null = null;
  private talkingTo: NpcActor | null = null;
  private confirmNewGame = false;

  constructor() {
    super('field');
  }

  create(data: { toast?: string }): void {
    this.rt = getRuntime();
    this.mode = 'field';
    this.step = null;
    this.runner = null;
    this.npcs = [];
    this.layers = {};
    const state = this.rt.state;
    this.map = this.rt.maps[state.player.mapId]!;

    const tilemap = this.make.tilemap({ key: tilemapKey(this.map.id) });
    const tileset = tilemap.addTilesetImage(TILESET.name, TILESET.textureKey);
    if (!tileset) throw new Error(`Map ${this.map.id} has no "${TILESET.name}" tileset`);
    ERA_LAYERS.forEach((name, i) => {
      const layer = tilemap.createLayer(name, tileset, 0, 0);
      if (layer) this.layers[name] = layer.setDepth(i % 2).setVisible(true);
    });
    const above = tilemap.createLayer(TILE_LAYERS.above, tileset, 0, 0);
    above?.setDepth(3000);
    this.applyEra();

    // Echo Zones shimmer (the swap itself arrives in Phase 2).
    for (const zone of this.map.echoZones) {
      const r = this.add
        .rectangle(zone.x * TILE_SIZE, zone.y * TILE_SIZE, zone.width * TILE_SIZE, zone.height * TILE_SIZE, UI.echoZone, UI.echoZoneAlpha)
        .setOrigin(0, 0)
        .setDepth(2);
      this.tweens.add({ targets: r, alpha: 0.35, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    for (const placement of this.map.npcs) {
      const def = NPCS[placement.npc];
      if (!def) continue;
      const p = tileToWorld(placement.pos);
      const sprite = this.add.image(p.x, p.y, textureKeyForNpc(def.look, placement.facing)).setOrigin(0.5, 1).setDepth(10 + p.y);
      this.npcs.push({ placement, def, sprite });
    }

    const p = tileToWorld(state.player.pos);
    this.player = this.add.image(p.x, p.y, textureKeyForPlayer(state.player.facing)).setOrigin(0.5, 1).setDepth(10 + p.y);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.map.width * TILE_SIZE, this.map.height * TILE_SIZE);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true, 1, 1, 0, TILE_SIZE / 2);

    this.dialogue = new DialogueBox(this);
    this.menu = new MenuPanel(this);
    this.toast = new Toast(this);
    if (data?.toast) this.toast.show(data.toast);

    this.rt.input.clearPresses();
    window.__quest = { ready: true, snapshot: () => this.snapshot() };
  }

  update(_time: number, delta: number): void {
    const input = this.rt.input;
    input.update();
    switch (this.mode) {
      case 'field':
        this.updateField(delta);
        break;
      case 'dialogue':
        this.dialogue.update(delta);
        this.updateDialogue();
        break;
      case 'menu':
        this.updateMenu();
        break;
      case 'modal':
        break;
    }
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
      if (t < 1) return;
      const leftover = this.step.elapsed - this.step.duration;
      this.rt.state.player.pos = { ...this.step.to };
      this.step = null;
      this.arrive();
      // Keep walking smoothly while a direction is held.
      if (this.mode === 'field' && !this.step) {
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
      this.interact();
      return;
    }
    if (input.pressed('echo')) {
      const here = this.rt.state.player;
      const possible = canSwapEra(this.map, here.era, here.pos);
      console.info(`[quest] Echo swap: not yet (Phase 2). In an Echo Zone here: ${possible}`);
      this.toast.show('Echo: not yet');
    }
    const dir = input.move();
    if (dir) this.startStep(dir, 0);
  }

  private startStep(dir: Dir, carry: number): void {
    const p = this.rt.state.player;
    p.facing = dir;
    this.player.setTexture(textureKeyForPlayer(dir));
    const occupied = (pos: Pos) => this.npcs.some((n) => samePos(n.placement.pos, pos));
    const result = tryMove(this.map, p.era, p.pos, dir, occupied);
    if (!result.moved) return;
    const duration = this.rt.input.held('run') ? RUN_MS_PER_TILE : WALK_MS_PER_TILE;
    this.step = { from: { ...p.pos }, to: result.to, elapsed: Math.min(carry, duration - 1), duration };
  }

  private arrive(): void {
    const state = this.rt.state;
    const door = doorAt(this.map, state.player.pos);
    if (door) {
      this.useDoor(door);
      return;
    }
    const trigger = triggerAt(this.map, state.player.pos);
    if (!trigger) return;
    if (trigger.once && trigger.flag && state.flags.isSet(trigger.flag)) return;
    if (trigger.flag) state.flags.set(trigger.flag, true);
    if (trigger.dialogue) this.startDialogue(trigger.dialogue, () => this.autosave());
    else this.autosave();
  }

  private useDoor(door: Door): void {
    const state = this.rt.state;
    const targetMap = this.rt.maps[door.targetMap];
    const target = targetMap?.doors.find((d) => d.id === door.target);
    if (!targetMap || !target) {
      console.error(`[quest] door ${door.id} leads nowhere`);
      return;
    }
    const arrival = doorArrival(target);
    state.player = { ...state.player, mapId: targetMap.id, pos: arrival.pos, facing: arrival.facing };
    if (targetMap.id !== this.map.id) {
      const ok = saveGame(this.rt);
      this.scene.restart({ toast: ok ? 'Autosaved' : 'Could not save' });
      return;
    }
    const w = tileToWorld(arrival.pos);
    this.player.setPosition(w.x, w.y).setDepth(10 + w.y).setTexture(textureKeyForPlayer(arrival.facing));
    this.cameras.main.centerOn(w.x, w.y - TILE_SIZE / 2);
    this.autosave();
  }

  private interact(): void {
    const p = this.rt.state.player;
    const front = stepFrom(p.pos, p.facing);
    const npc = this.npcs.find((n) => samePos(n.placement.pos, front));
    if (!npc) return;
    npc.sprite.setTexture(textureKeyForNpc(npc.def.look, opposite(p.facing)));
    this.talkingTo = npc;
    this.startDialogue(npc.def.dialogue);
  }

  private applyEra(): void {
    const visible = visibleLayersFor(this.rt.state.player.era);
    for (const [name, layer] of Object.entries(this.layers)) layer.setVisible(visible.includes(name));
  }

  private autosave(): void {
    this.toast.show(saveGame(this.rt) ? 'Autosaved' : 'Could not save');
  }

  // ---- Dialogue ------------------------------------------------------------------------------

  private startDialogue(id: string, onEnd?: () => void): void {
    const script = DIALOGUE[id];
    if (!script) {
      console.error(`[quest] unknown dialogue ${id}`);
      onEnd?.();
      return;
    }
    this.runner = new DialogueRunner(script, SPEAKERS, this.rt.state.flags);
    this.onDialogueEnd = onEnd ?? null;
    this.mode = 'dialogue';
    this.showDialogueView();
  }

  private showDialogueView(): void {
    const view = this.runner?.view() ?? { kind: 'end' as const };
    if (view.kind === 'end') {
      this.endDialogue();
      return;
    }
    this.dialogue.show(view, this.rt.state.settings.textSpeed);
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
      if (input.pressed('confirm')) {
        this.runner?.choose(this.dialogue.choiceCursor);
        this.showDialogueView();
      }
      return;
    }
    if (advance) {
      this.runner?.advance();
      this.showDialogueView();
    }
  }

  private endDialogue(): void {
    this.dialogue.hide();
    this.runner = null;
    this.mode = 'field';
    this.rt.input.clearPresses();
    if (this.talkingTo) {
      const n = this.talkingTo;
      n.sprite.setTexture(textureKeyForNpc(n.def.look, n.placement.facing));
      this.talkingTo = null;
    }
    const cb = this.onDialogueEnd;
    this.onDialogueEnd = null;
    cb?.();
  }

  // ---- Menu ----------------------------------------------------------------------------------

  private menuItems(): MenuItem[] {
    return [
      { id: 'save', label: 'Save' },
      { id: 'speed', label: `Text speed: ${capitalise(this.rt.state.settings.textSpeed)}` },
      { id: 'export', label: 'Export save code' },
      { id: 'import', label: 'Import save code' },
      { id: 'new', label: this.confirmNewGame ? 'New game? Press A again' : 'New game' },
      { id: 'close', label: 'Close' },
    ];
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
    const s = this.rt.state.settings;
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
      case 'save':
        this.closeMenu();
        this.toast.show(saveGame(this.rt) ? 'Saved' : 'Could not save');
        break;
      case 'speed':
        this.cycleTextSpeed(1);
        break;
      case 'export':
        this.mode = 'modal';
        openExportDialog(encodeSave(toSaveData(this.rt.state, Date.now())), () => this.returnFromModal());
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
          this.rt.state = newGame(this.rt.maps[START_MAP_ID]!, START_SPAWN);
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
        applySave(this.rt.state, result.data);
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
    const p = this.rt.state.player;
    return {
      mode: this.mode,
      mapId: p.mapId,
      x: p.pos.x,
      y: p.pos.y,
      facing: p.facing,
      era: p.era,
      moving: this.step !== null,
      flags: this.rt.state.flags.snapshot(),
      dialogue: this.dialogue.snapshot(),
      menu: this.menu.snapshot(),
      toast: this.toast.lastMessage,
    };
  }
}

declare global {
  interface Window {
    /** Read-only test hook used by the Playwright smoke test. */
    __quest?: { ready: boolean; snapshot: () => FieldSnapshot };
  }
}
