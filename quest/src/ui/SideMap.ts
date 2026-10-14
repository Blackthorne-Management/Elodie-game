// The minimap: the tiles around Gianna (one colour per tile, from the tileset), doors as gold dots and
// Gianna as a blinking dot, with the city and section name under it. It is a page element, not part
// of the picture, so it can sit in the black bars (CSS, by <body data-layout>): the right bar on a
// sideways phone, the top bar on an upright one, or the picture's top-left corner when there are no
// bars wide enough. Redrawn only when Gianna reaches a new tile.

import { TILESET } from '../assets.config.ts';
import { SIDE_MAP } from '../config.ts';
import type { GameMap, TiledMap } from '../engine/tiledMap.ts';
import { TILE_LAYERS, findTileLayer } from '../engine/tiledMap.ts';
import type { Era, Pos } from '../engine/types.ts';

function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

/** Each tile's colour: its decoration's (a tree, a wall) or else its ground's. */
function tileColours(map: GameMap, raw: TiledMap, era: Era): string[] {
  const gid = new Map(TILESET.tiles.map((t) => [t.gid, hex(t.base)]));
  const ground = findTileLayer(raw, era === 'present' ? TILE_LAYERS.groundPresent : TILE_LAYERS.groundEcho)?.data ?? [];
  const deco = findTileLayer(raw, era === 'present' ? TILE_LAYERS.decoPresent : TILE_LAYERS.decoEcho)?.data ?? [];
  const out: string[] = [];
  for (let i = 0; i < map.width * map.height; i++) out.push(gid.get(deco[i] ?? 0) ?? gid.get(ground[i] ?? 0) ?? '#000000');
  for (const d of map.doors) out[d.pos.y * map.width + d.pos.x] = '#f2d04b';
  return out;
}

export class SideMap {
  private readonly root: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly label: HTMLElement;
  private map: GameMap | null = null;
  private colours: string[] = [];
  private last = '';
  private blink = true;
  private readonly timer: number;
  private pos: Pos = { x: 0, y: 0 };

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'side-map';
    this.canvas = document.createElement('canvas');
    this.canvas.width = SIDE_MAP.tilesW;
    this.canvas.height = SIDE_MAP.tilesH;
    this.ctx = this.canvas.getContext('2d')!;
    this.label = document.createElement('div');
    this.label.className = 'side-map-label';
    this.root.append(this.canvas, this.label);
    parent.appendChild(this.root);
    this.timer = window.setInterval(() => {
      this.blink = !this.blink;
      this.draw(true);
    }, 450);
  }

  /** Show a map (and era); `place` is the name under it ("Pòt Limyè: Festival Plaza"), empty for none. */
  setMap(map: GameMap, raw: TiledMap, era: Era, place: string): void {
    this.map = map;
    this.colours = tileColours(map, raw, era);
    this.label.textContent = place;
    this.last = '';
  }

  follow(pos: Pos): void {
    this.pos = pos;
    this.draw(false);
  }

  setVisible(on: boolean): void {
    this.root.classList.toggle('hidden', !on);
  }

  get visible(): boolean {
    return !!this.map && !this.root.classList.contains('hidden');
  }

  get place(): string {
    return this.label.textContent ?? '';
  }

  destroy(): void {
    window.clearInterval(this.timer);
    this.root.remove();
  }

  /** The window around the player (clamped to the map; a small map sits in the middle). */
  private draw(blinkOnly: boolean): void {
    const map = this.map;
    if (!map) return;
    const { tilesW: tw, tilesH: th } = SIDE_MAP;
    const ox = map.width <= tw ? Math.floor((map.width - tw) / 2) : Math.max(0, Math.min(map.width - tw, this.pos.x - Math.floor(tw / 2)));
    const oy = map.height <= th ? Math.floor((map.height - th) / 2) : Math.max(0, Math.min(map.height - th, this.pos.y - Math.floor(th / 2)));
    const key = `${ox},${oy},${this.pos.x},${this.pos.y}`;
    const ctx = this.ctx;
    if (!blinkOnly || key !== this.last) {
      this.last = key;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, tw, th);
      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          const mx = ox + x;
          const my = oy + y;
          if (mx < 0 || my < 0 || mx >= map.width || my >= map.height) continue;
          ctx.fillStyle = this.colours[my * map.width + mx]!;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    const px = this.pos.x - ox;
    const py = this.pos.y - oy;
    ctx.fillStyle = this.blink ? '#ffffff' : (this.colours[this.pos.y * map.width + this.pos.x] ?? '#000000');
    ctx.fillRect(px, py, 1, 1);
  }
}
