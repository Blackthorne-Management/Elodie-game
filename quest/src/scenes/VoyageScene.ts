// A sea voyage between capitals (owner request, Oct 17: "a little animation of going on the canoe east to a
// larger ship in the ocean and sailing around Ardencia over to Yucayeque", no more teleporting). Two parts:
// the harbor at dawn, where Yari's canoe paddles out to a Zetwal ship; then the realm map (the board's
// painting), where the ship sails the route engine/voyage.ts plots over the sea, with a wake and captions.
// A or B (or a tap) skips. The logic has already landed the party; this opens the field when it ends.
// Drawn by the game for now; the animator's version can replace it (docs/quest/intro/VOYAGE.md).

import Phaser from 'phaser';
import { audio } from '../audio/player.ts';
import type { MusicId } from '../audio.config.ts';
import { REALM_ART, textureKeyForObject } from '../assets.config.ts';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../config.ts';
import { REALM_MAP } from '../data/realmMap.ts';
import { VOYAGES } from '../data/voyages.ts';
import { along, seaRoute, thinRoute, type VoyageDef } from '../engine/voyage.ts';
import type { Pos } from '../engine/types.ts';
import { getRuntime } from '../runtime.ts';
import { renderScale, textStyle } from '../ui/text.ts';

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

export class VoyageScene extends Phaser.Scene {
  private voyageId = '';
  private phase: VoyagePhase = 'harbor';
  private elapsed = 0;
  private finished = false;
  private caption!: Phaser.GameObjects.Text;
  private layer!: Phaser.GameObjects.Container;
  private canoe!: Phaser.GameObjects.Container;
  private ship!: Phaser.GameObjects.Image;
  private route: Pos[] = [];
  private wake!: Phaser.GameObjects.Graphics;
  private marker!: Phaser.GameObjects.Image;
  private mapBox = { x: 0, y: 0, size: 0 };

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
    window.__voyage = { state: () => ({ phase: this.phase, elapsed: Math.round(this.elapsed) }) };
  }

  update(_time: number, delta: number): void {
    if (this.finished) return;
    const input = getRuntime().input;
    input.update();
    if (input.pressed('confirm') || input.pressed('cancel')) {
      this.finish();
      return;
    }
    this.elapsed += delta;
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
    for (const [x, y] of [[4, 44], [14, 70], [6, 104], [16, 134]] as const) {
      g.fillStyle(night ? 0x5a4a30 : roof, 1).fillRect(x, y, 10, 6);
      g.fillStyle(night ? 0x4a4038 : 0x9a8a78, 1).fillRect(x + 1, y + 6, 8, 5);
    }
    g.fillStyle(0x9c7446, 1).fillRect(46, 96, 30, 4);
    // Sparkles on the water.
    for (let i = 0; i < 40; i++) g.fillStyle(0xb2d2ee, 0.5).fillRect(50 + ((i * 53) % 260), 40 + ((i * 37) % 130), 3, 1);
    this.layer.add(g);
    this.add.text(4, 2, voyage.harbor, textStyle(night ? '#fff2a0' : '#14101a', { fontStyle: 'bold' })).setDepth(10);

    // The Zetwal ship waiting offshore.
    this.ship = this.add.image(262, 104, textureKeyForObject('zetwal_ship')).setOrigin(0.5, 1).setScale(0.9);
    // Yari's canoe: a dugout with Yari, Gianna and Anissa (her glow), the hutia at the bow.
    const hull = this.add.graphics();
    hull.fillStyle(0x1a1420, 1).fillRoundedRect(-17, -3, 34, 8, 4);
    hull.fillStyle(0x6b4426, 1).fillRoundedRect(-16, -2, 32, 6, 3);
    const people = this.add.graphics();
    for (const [x, c] of [[-9, 0x2a1a14], [-1, 0x2b2433], [7, 0x2a1a14]] as const) {
      people.fillStyle(c, 1).fillCircle(x, -5, 3);
      people.fillStyle(0x3b4fa8, 1).fillRect(x - 2, -3, 4, 3);
    }
    const glow = this.add.circle(7, -5, 6, 0xfff2a0, 0.35);
    this.canoe = this.add.container(70, 100, [glow, hull, people]);
    this.tweens.add({ targets: this.canoe, y: 101, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  private tickHarbor(): void {
    const t = this.elapsed / HARBOR_MS;
    // Out to the ship in the first 60%, aboard, then the ship sails off east.
    const reach = Math.min(1, t / 0.6);
    this.canoe.x = 70 + (226 - 70) * Phaser.Math.Easing.Sine.InOut(reach);
    const voyage = VOYAGES[this.voyageId]!;
    if (t < 0.6) this.caption.setText(voyage.paddle);
    else {
      this.canoe.setAlpha(Math.max(0, 1 - (t - 0.6) * 6));
      this.caption.setText(voyage.aboard);
      this.ship.x = 262 + (t - 0.7 > 0 ? (t - 0.7) * 260 : 0);
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
    this.marker = this.add.image(0, 0, textureKeyForObject('zetwal_ship')).setOrigin(0.5, 0.8).setScale(0.22);
    this.caption.setDepth(10);
    this.cameras.main.flash(300, 255, 242, 160);
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
    __voyage?: { state: () => { phase: VoyagePhase; elapsed: number } };
  }
}
