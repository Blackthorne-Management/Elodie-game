// The realm map's picture: the board game's painted map (assets.config.ts REALM_ART), laid over the
// menu's map area as a page element so it shows at the screen's full sharpness instead of the game's
// 320 x 180 pixels. On it: each country's name, a soft mist over countries not reached yet (from the
// borders traced in data/realmMap.ts), and a blinking marker on the capital of the country you are in.
// It never takes taps: they go through to the game (A or a tap turns back to the city map).

import { REALM_ART, UI } from '../assets.config.ts';
import { VIEW_WIDTH } from '../config.ts';
import { REALM_MAP } from '../data/realmMap.ts';

/** A rectangle in game pixels (the 320 x 180 picture). */
export interface GameRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RealmView {
  /** The country you are in (its capital blinks), if any. */
  current?: string;
  /** Countries reached so far (the others are misted). */
  known: ReadonlySet<string>;
  /** Each place's name, by realm place id. */
  names: Readonly<Record<string, string>>;
}

export class RealmOverlay {
  private readonly root: HTMLElement;
  private readonly img: HTMLImageElement;
  private readonly fog: HTMLCanvasElement;
  private readonly labels: HTMLElement;
  private readonly marker: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private rect: GameRect | null = null;
  private readonly onResize = () => this.place();

  constructor(parent: HTMLElement, gameCanvas: HTMLCanvasElement) {
    this.canvas = gameCanvas;
    this.root = document.createElement('div');
    this.root.className = 'realm-map hidden';
    this.img = document.createElement('img');
    this.img.alt = 'Map of the realm';
    this.img.src = REALM_ART.image;
    this.img.draggable = false;
    this.fog = document.createElement('canvas');
    this.fog.className = 'realm-fog';
    this.fog.width = REALM_MAP.width;
    this.fog.height = REALM_MAP.height;
    this.labels = document.createElement('div');
    this.labels.className = 'realm-labels';
    this.marker = document.createElement('div');
    this.marker.className = 'realm-here';
    this.root.append(this.img, this.fog, this.labels, this.marker);
    parent.appendChild(this.root);
    window.addEventListener('resize', this.onResize);
  }

  get visible(): boolean {
    return !this.root.classList.contains('hidden');
  }

  /** Show the map over `rect` (game pixels). */
  show(rect: GameRect, view: RealmView): void {
    this.rect = rect;
    this.paintFog(view.known);
    this.labels.replaceChildren();
    for (const [id, at] of Object.entries(REALM_MAP.labels)) {
      if (id === 'seat' || !view.names[id]) continue;
      const span = document.createElement('span');
      span.textContent = view.names[id]!;
      span.className = view.known.has(id) ? 'known' : '';
      span.style.left = `${(at.x / REALM_MAP.width) * 100}%`;
      span.style.top = `${(at.y / REALM_MAP.height) * 100}%`;
      this.labels.appendChild(span);
    }
    const cap = view.current ? REALM_MAP.capitals[view.current] : undefined;
    this.marker.hidden = !cap;
    if (cap) {
      this.marker.style.left = `${((cap.x + 0.5) / REALM_MAP.width) * 100}%`;
      this.marker.style.top = `${((cap.y + 0.5) / REALM_MAP.height) * 100}%`;
    }
    this.root.classList.remove('hidden');
    this.place();
  }

  hide(): void {
    this.root.classList.add('hidden');
    this.rect = null;
  }

  destroy(): void {
    window.removeEventListener('resize', this.onResize);
    this.root.remove();
  }

  /** For tests: where the map is on the page, and whether its picture has loaded. */
  snapshot(): { left: number; top: number; width: number; height: number; loaded: boolean; labels: string[] } | null {
    if (!this.visible) return null;
    const r = this.root.getBoundingClientRect();
    return {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
      loaded: this.img.complete && this.img.naturalWidth > 0,
      labels: [...this.labels.children].map((c) => c.textContent ?? ''),
    };
  }

  /** Follow the game picture (it moves and scales with the window). */
  private place(): void {
    if (!this.rect) return;
    const r = this.canvas.getBoundingClientRect();
    const k = r.width / VIEW_WIDTH;
    const s = this.root.style;
    s.left = `${r.left + this.rect.x * k}px`;
    s.top = `${r.top + this.rect.y * k}px`;
    s.width = `${this.rect.w * k}px`;
    s.height = `${this.rect.h * k}px`;
    s.fontSize = `${UI.fontSizePx * k}px`;
  }

  /** The mist: a dark wash over every cell of a country not reached yet (softened by CSS blur). */
  private paintFog(known: ReadonlySet<string>): void {
    const ctx = this.fog.getContext('2d')!;
    const img = ctx.createImageData(REALM_MAP.width, REALM_MAP.height);
    for (let y = 0; y < REALM_MAP.height; y++) {
      const row = REALM_MAP.rows[y]!;
      for (let x = 0; x < REALM_MAP.width; x++) {
        const id = REALM_MAP.key[row[x]!]!;
        if (id === 'sea' || known.has(id)) continue;
        const i = (y * REALM_MAP.width + x) * 4;
        img.data[i] = 10;
        img.data[i + 1] = 8;
        img.data[i + 2] = 18;
        img.data[i + 3] = Math.round(255 * REALM_ART.mist);
      }
    }
    ctx.putImageData(img, 0, 0);
  }
}
