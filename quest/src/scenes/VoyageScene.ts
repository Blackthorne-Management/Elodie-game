// A sea voyage between capitals (owner request, Oct 17: "a little animation of going on the canoe east to a
// larger ship in the ocean and sailing around Ardencia over to Yucayeque", no more teleporting). Two parts:
// the harbor at dawn, where Yari's canoe paddles out to a Zetwal ship; then the realm map (the board's
// painting), where the ship sails the route engine/voyage.ts plots over the sea, with a wake and captions.
// A or B (or a tap) skips. The logic has already landed the party; this opens the field when it ends.
// Drawn by the game for now; the animator's version can replace it (docs/quest/intro/VOYAGE.md).

import Phaser from 'phaser';
import { audio } from '../audio/player.ts';
import type { MusicId } from '../audio.config.ts';
import { characterFrame, REALM_ART, textureKeyForCharacter, textureKeyForObject } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH, WALKING_COMPANIONS } from '../config.ts';
import { RPG } from '../data/rpg.ts';
import { partyMembers, walkingCompanion } from '../engine/rpg.ts';
import { REALM_MAP } from '../data/realmMap.ts';
import { VOYAGES } from '../data/voyages.ts';
import { along, boatCrew, seaRoute, thinRoute, type VoyageDef } from '../engine/voyage.ts';
import type { Pos } from '../engine/types.ts';
import { getRuntime } from '../runtime.ts';
import { renderScale, textStyle } from '../ui/text.ts';
import { screenFlash } from './cameraFx.ts';

const HARBOR_MS = 5200;
const SAIL_MS = 9500;
const FADE_MS = 600;
const REALM_KEY = 'voyage-realm';

export type VoyagePhase = 'harbor' | 'map' | 'done';

/** Each harbor's shore on the opening picture: its strand, the land behind it, and its roofs. */
const SHORES: Readonly<Record<VoyageDef['shore'], { sand: number; land: number; roof: number }>> = {
  zetwal: { sand: 0xd8c08a, land: 0x4f9a4a, roof: 0xa04040 },
  xaragua: { sand: 0xd8c08a, land: 0x4f9a4a, roof: 0xc8a46b },
  ardencia: { sand: 0x3a3440, land: 0x241e26, roof: 0x2a2632 },
  skarragol: { sand: 0x8e8e86, land: 0x8a9a70, roof: 0xa89878 },
  kuroshi: { sand: 0x4a4650, land: 0x3a4a44, roof: 0x5a5468 },
  jwaladesh: { sand: 0xece4d0, land: 0xd8c8a0, roof: 0xe67e22 },
  aldermoor: { sand: 0x6a7480, land: 0x5a5a6a, roof: 0x4a5060 },
};

/** The first column of an image's frame with any visible pixel (0 when it cannot be read). */
function opaqueLeft(img: Phaser.GameObjects.Image): number {
  const f = img.frame;
  const source = f.source.image as CanvasImageSource | undefined;
  if (!source || f.cutWidth === 0 || f.cutHeight === 0) return 0;
  const canvas = document.createElement('canvas');
  canvas.width = f.cutWidth;
  canvas.height = f.cutHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return 0;
  ctx.drawImage(source, f.cutX, f.cutY, f.cutWidth, f.cutHeight, 0, 0, f.cutWidth, f.cutHeight);
  const { data } = ctx.getImageData(0, 0, f.cutWidth, f.cutHeight);
  for (let x = 0; x < f.cutWidth; x++) {
    for (let y = 0; y < f.cutHeight; y++) if (data[(y * f.cutWidth + x) * 4 + 3]! > 0) return x;
  }
  return 0;
}

export class VoyageScene extends Phaser.Scene {
  private voyageId = '';
  private phase: VoyagePhase = 'harbor';
  private elapsed = 0;
  private finished = false;
  private caption!: Phaser.GameObjects.Text;
  private layer!: Phaser.GameObjects.Container;
  private canoe!: Phaser.GameObjects.Container;
  private ship!: Phaser.GameObjects.Image;
  private fleet: Phaser.GameObjects.Image[] = [];
  private fleetMarkers: Phaser.GameObjects.Image[] = [];
  /** Where the ship waits offshore, and where the boat stops beside it (not over its hull; review Nov 1, finding 20). */
  private shipX = 262;
  private boatStop = 200;
  private route: Pos[] = [];
  private wake!: Phaser.GameObjects.Graphics;
  private marker!: Phaser.GameObjects.Image;
  private mapBox = { x: 0, y: 0, size: 0 };
  /** A test hook's frozen moment (screenshots of each part): the clock stands still at it. */
  private held: number | null = null;

  constructor() {
    super('voyage');
  }

  init(data: { voyage: string }): void {
    this.voyageId = data.voyage;
    this.phase = 'harbor';
    this.elapsed = 0;
    this.finished = false;
  }

  preload(): void {
    if (!this.textures.exists(REALM_KEY)) this.load.image(REALM_KEY, REALM_ART.image);
  }

  create(): void {
    const voyage = VOYAGES[this.voyageId];
    if (!voyage) {
      this.finish();
      return;
    }
    this.cameras.main.setOrigin(0, 0).setZoom(renderScale()).setBackgroundColor('#0b1a2a');
    audio.playMusic(voyage.music as MusicId);
    getRuntime().input.clearPresses();
    this.route = thinRoute(seaRoute(REALM_MAP, voyage));
    this.layer = this.add.container(0, 0);
    this.drawHarbor(voyage);
    this.caption = this.add
      .text(VIEW_WIDTH / 2, VIEW_HEIGHT - 10, '', textStyle('#fff2a0', { stroke: '#14101a', strokeThickness: 3, align: 'center' }))
      .setOrigin(0.5, 1)
      .setDepth(10);
    this.input.on('pointerdown', () => this.finish());
    this.cameras.main.fadeIn(400);
    window.__voyage = {
      state: () => ({ phase: this.phase, elapsed: Math.round(this.elapsed) }),
      hold: (ms) => (this.held = ms),
    };
  }

  update(_time: number, delta: number): void {
    if (this.finished) return;
    const input = getRuntime().input;
    input.update();
    if (input.pressed('confirm') || input.pressed('cancel')) {
      this.finish();
      return;
    }
    if (this.held !== null) this.elapsed = this.held;
    else this.elapsed += delta;
    if (this.phase === 'harbor') this.tickHarbor();
    else if (this.phase === 'map') this.tickMap();
  }

  // ---- The harbor at dawn: the canoe paddles out to the ship -------------------------------------

  private drawHarbor(voyage: VoyageDef): void {
    const g = this.add.graphics();
    const night = !!voyage.night;
    // Dawn (or a dark night) sky band, then the sea, lighter in the shallows by the shore.
    if (night) g.fillGradientStyle(0x0c1024, 0x0c1024, 0x22203e, 0x22203e, 1).fillRect(0, 0, VIEW_WIDTH, 34);
    else g.fillGradientStyle(0xf2b880, 0xf2b880, 0x8fbbe8, 0x8fbbe8, 1).fillRect(0, 0, VIEW_WIDTH, 34);
    g.fillStyle(night ? 0x14304a : 0x2b5f7c, 1).fillRect(0, 34, VIEW_WIDTH, VIEW_HEIGHT - 34);
    g.fillStyle(night ? 0x1c4058 : 0x3a7fa0, 1).fillRect(0, 34, 120, VIEW_HEIGHT - 34);
    // The shore on the west: sand, green, roofs (Pòdlimyè's red tile, or Yucayeque's thatch), the pier.
    // Ardencia's strand is black sand under basalt (Chapter 4's voyage leaves from the Free Brasador camp).
    // Ordvik's quay is grey shingle under felt and slate (Chapter 7's longship); Kirinoura's pier is black lacquer and
    // violet-grey roofs in the fog (Chapter 8's trader, when it is built).
    const shore = SHORES[voyage.shore];
    g.fillStyle(night ? 0x6a5e48 : shore.sand, 1).fillRect(0, 34, 46, VIEW_HEIGHT - 34);
    g.fillStyle(night ? 0x24402a : shore.land, 1).fillRect(0, 34, 30, VIEW_HEIGHT - 34);
    const roof = shore.roof;
    // Houses up the slope (review Nov 1, finding 20: the shore was a flat strip): a pitched roof, a wall, a door and a
    // lit or shuttered window; palms on the warm shores, dark firs on the cold ones.
    const wall = night ? 0x4a4038 : 0xe8dcc0;
    for (const [x, y] of [[3, 42], [15, 58], [4, 76], [16, 92], [5, 112], [15, 130], [4, 148]] as const) {
      g.fillStyle(night ? 0x5a4a30 : roof, 1).fillTriangle(x - 1, y + 5, x + 6, y, x + 13, y + 5);
      g.fillStyle(wall, 1).fillRect(x, y + 5, 12, 7);
      g.fillStyle(0x3e2614, 1).fillRect(x + 2, y + 8, 3, 4);
      g.fillStyle(night ? 0xf2d04b : 0x2a3a78, 1).fillRect(x + 8, y + 7, 2, 2);
    }
    const warm = voyage.shore === 'zetwal' || voyage.shore === 'xaragua' || voyage.shore === 'jwaladesh';
    for (const [x, y] of [[34, 50], [38, 80], [33, 122], [39, 150]] as const) {
      if (warm) {
        g.fillStyle(0x6b4426, 1).fillRect(x, y - 12, 2, 12);
        g.fillStyle(night ? 0x24402a : 0x2a5e2f, 1).fillTriangle(x + 1, y - 13, x - 6, y - 9, x - 4, y - 11);
        g.fillTriangle(x + 1, y - 13, x + 8, y - 9, x + 6, y - 11);
        g.fillTriangle(x + 1, y - 13, x - 3, y - 6, x - 1, y - 12);
        g.fillTriangle(x + 1, y - 13, x + 5, y - 6, x + 3, y - 12);
      } else {
        g.fillStyle(night ? 0x14241a : 0x1f3a2a, 1).fillTriangle(x - 4, y, x + 1, y - 12, x + 6, y);
      }
    }
    // The surf along the strand, and the pier on its posts.
    for (let y = 38; y < VIEW_HEIGHT; y += 6) g.fillStyle(0xf4ecd8, night ? 0.3 : 0.6).fillRect(46 + ((y * 7) % 3), y, 2, 3);
    g.fillStyle(0x9c7446, 1).fillRect(46, 96, 30, 4);
    for (let x = 48; x < 76; x += 7) g.fillStyle(0x3e2614, 1).fillRect(x, 100, 2, 5);
    // Sparkles on the water.
    for (let i = 0; i < 40; i++) g.fillStyle(0xb2d2ee, 0.5).fillRect(50 + ((i * 53) % 260), 40 + ((i * 37) % 130), 3, 1);
    this.layer.add(g);
    this.add.text(4, 2, voyage.harbor, textStyle(night ? '#fff2a0' : '#14101a', { fontStyle: 'bold' })).setDepth(10);

    // The fleet behind, smaller and further out (the war voyages), then the party's own ship.
    const pier = voyage.boarding === 'pier';
    this.fleet = (voyage.fleet ?? []).map((kind, i) =>
      this.add
        .image(this.fleetX(i, pier), 58 + (i % 2) * 10, textureKeyForObject(kind))
        .setOrigin(0.5, 1)
        .setScale(0.42 + (i % 2) * 0.08)
        .setAlpha(night ? 0.7 : 0.9),
    );
    this.shipX = pier ? 112 : 262;
    this.ship = this.add.image(this.shipX, 104, textureKeyForObject(voyage.ship ?? 'zetwal_ship')).setOrigin(0.5, 1).setScale(0.9);
    // The rowing boat with the people walking the map in it (review Nov 1: it held three faceless dots for a party of
    // four), Anissa's glow on her; it stops beside the ship, left of the hull.
    const crew = pier ? [] : boatCrew(this.walking());
    const width = Math.max(30, crew.length * 10 + 10);
    const hull = this.add.graphics();
    hull.fillStyle(0x1a1420, 1).fillRoundedRect(-width / 2 - 1, -3, width + 2, 8, 4);
    hull.fillStyle(0x6b4426, 1).fillRoundedRect(-width / 2, -2, width, 6, 3);
    const parts: Phaser.GameObjects.GameObject[] = [];
    crew.forEach((id, i) => {
      const x = -width / 2 + 9 + i * 10;
      if (id === 'anissa') parts.push(this.add.circle(x, -7, 7, 0xfff2a0, 0.35));
      const key = textureKeyForCharacter(id);
      const sprite = this.textures.exists(key)
        ? this.add.image(x, 1, key, characterFrame('right')).setOrigin(0.5, 1).setScale(0.5)
        : this.add.circle(x, -5, 3, 0x2a1a14);
      parts.push(sprite);
    });
    this.canoe = this.add.container(70, 100, [...parts, hull]);
    // The boat's people sit in it: the hull is drawn over their legs.
    this.canoe.bringToTop(hull);
    this.canoe.setVisible(!pier);
    // Beside the hull itself, not the picture's empty margin (review Nov 7, finding 13: off Kirinoura the boat stopped
    // short in open water and faded there, before it reached the lantern trader).
    const hullLeft = this.shipX + (opaqueLeft(this.ship) - this.ship.width / 2) * this.ship.scaleX;
    this.boatStop = Math.max(90, hullLeft - width / 2 - 2);
    this.tweens.add({ targets: this.canoe, y: 101, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  /**
   * Where each fleet ship waits on the harbor picture, in a line out to sea, alternately nearer and further: between
   * the pier and the waiting ship, or (when the party's ship casts off from the pier) out beyond it.
   */
  private fleetX(i: number, pier: boolean): number {
    return (pier ? 168 : 104) + i * 30;
  }

  /** Who walks the map now: Anissa and Azzy when they are with Gianna, and the one companion. */
  private walking(): { anissa: boolean; azzy: boolean; companion: string | null } {
    const flags = getRuntime().logic.state.flags;
    const here = new Set(partyMembers(flags, RPG, 'present').map((m) => m.id));
    return { anissa: here.has('anissa'), azzy: here.has('azzy'), companion: walkingCompanion(flags, RPG, WALKING_COMPANIONS) };
  }

  private tickHarbor(): void {
    const t = this.elapsed / HARBOR_MS;
    const voyage = VOYAGES[this.voyageId]!;
    // Out to the ship in the first 60%, aboard, then the ship sails off east (with the fleet). From a pier, the ship
    // itself pulls away from the pier and out.
    const reach = Math.min(1, t / 0.6);
    if (voyage.boarding === 'pier') this.ship.x = this.shipX + 130 * Phaser.Math.Easing.Sine.InOut(reach);
    else this.canoe.x = 70 + (this.boatStop - 70) * Phaser.Math.Easing.Sine.InOut(reach);
    if (t < 0.6) this.caption.setText(voyage.paddle);
    else {
      this.canoe.setAlpha(Math.max(0, 1 - (t - 0.6) * 6));
      this.caption.setText(voyage.aboard);
      const off = t - 0.7 > 0 ? (t - 0.7) * 260 : 0;
      this.ship.x = (voyage.boarding === 'pier' ? this.shipX + 130 : this.shipX) + off;
      this.fleet.forEach((f, i) => (f.x = this.fleetX(i, voyage.boarding === 'pier') + off * 0.8));
    }
    if (this.elapsed >= HARBOR_MS) this.startMap();
  }

  // ---- The realm map: the ship's route around Ardencia -------------------------------------------

  private startMap(): void {
    this.phase = 'map';
    this.elapsed = 0;
    this.layer.removeAll(true);
    this.children.list.filter((c) => c !== this.caption && c !== this.layer).forEach((c) => c.destroy());
    const size = VIEW_HEIGHT;
    this.mapBox = { x: (VIEW_WIDTH - size) / 2, y: 0, size };
    if (this.textures.exists(REALM_KEY)) this.add.image(this.mapBox.x, 0, REALM_KEY).setOrigin(0, 0).setDisplaySize(size, size);
    else this.drawTracedRealm();
    this.add.rectangle(VIEW_WIDTH / 2, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT, 0x0b1a2a, 0.25);
    this.wake = this.add.graphics();
    const voyage = VOYAGES[this.voyageId]!;
    // The fleet trails the party's ship along the route, smaller.
    this.fleetMarkers = (voyage.fleet ?? []).map((kind) => this.add.image(0, 0, textureKeyForObject(kind)).setOrigin(0.5, 0.8).setScale(0.15));
    this.marker = this.add.image(0, 0, textureKeyForObject(voyage.ship ?? 'zetwal_ship')).setOrigin(0.5, 0.8).setScale(0.22);
    this.caption.setDepth(10);
    screenFlash(this, 300, 255, 242, 160);
  }

  /** The board's traced shapes when the painting cannot load. */
  private drawTracedRealm(): void {
    const g = this.add.graphics();
    const cell = this.mapBox.size / REALM_MAP.width;
    REALM_MAP.rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const place = REALM_MAP.key[row[x]!]!;
        g.fillStyle(REALM_MAP.colours[place] ?? 0x2b5f7c, 1).fillRect(this.mapBox.x + x * cell, y * cell, cell + 0.5, cell + 0.5);
      }
    });
  }

  private toScreen(p: Pos): Pos {
    const cell = this.mapBox.size / REALM_MAP.width;
    return { x: this.mapBox.x + (p.x + 0.5) * cell, y: this.mapBox.y + (p.y + 0.5) * cell };
  }

  private tickMap(): void {
    const voyage = VOYAGES[this.voyageId]!;
    const t = Math.min(1, this.elapsed / SAIL_MS);
    const eased = Phaser.Math.Easing.Sine.InOut(t);
    // The wake: dots along the way already sailed.
    this.wake.clear();
    for (let s = 0; s <= eased; s += 0.012) {
      const p = this.toScreen(along(this.route, s));
      this.wake.fillStyle(0xfff2a0, 0.85).fillCircle(p.x, p.y, 0.9);
    }
    const here = this.toScreen(along(this.route, eased));
    const ahead = this.toScreen(along(this.route, Math.min(1, eased + 0.01)));
    this.marker.setPosition(here.x, here.y).setFlipX(ahead.x < here.x);
    this.fleetMarkers.forEach((m, i) => {
      const s = Math.max(0, eased - 0.025 * (i + 1));
      const p = this.toScreen(along(this.route, s));
      const q = this.toScreen(along(this.route, Math.min(1, s + 0.01)));
      // Abreast in pairs, a little to either side of the wake.
      const side = (i % 2 === 0 ? 1 : -1) * 3;
      m.setPosition(p.x + side, p.y + side).setFlipX(q.x < p.x);
    });
    const caption = [...voyage.captions].reverse().find((c) => eased >= c.at);
    this.caption.setText(caption?.text ?? '');
    if (this.elapsed >= SAIL_MS + 700) this.finish();
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.phase = 'done';
    getRuntime().input.clearPresses();
    window.__voyage = undefined;
    this.cameras.main.fadeOut(FADE_MS, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.start('field', {}));
  }
}

declare global {
  interface Window {
    /** Test hook for the smoke test: the voyage's phase. */
    __voyage?: { state: () => { phase: VoyagePhase; elapsed: number }; hold: (ms: number) => void };
  }
}
