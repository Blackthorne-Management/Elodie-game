// The homeland terrain as one standalone SVG image (built once, then used as a picture): the
// overhead map draws it directly and the 2.5D view uses it as the ground texture.
import type { HouseDef } from '../engine/content';
import type { HouseId } from '../engine/types';
import { BOARD_SIZE } from '../config';
import { inBoard } from '../engine/board';
import { TERRAIN_ART } from '../assets.config';
import type { TerrainMark } from '../assets.config';

export const UNIT = 10;               // SVG units per square

// Deterministic value noise so borders wander the same way every game.
function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x: number, y: number, scale: number) {
  const xs = x / scale, ys = y / scale;
  const x0 = Math.floor(xs), y0 = Math.floor(ys);
  const fx = xs - x0, fy = ys - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
}

type Region = HouseId | 'heartland' | 'sea';

// Which territory each square belongs to: the homeland whose direction from the Throne is closest,
// with noise bending the borders. Each homeland's reach is then tuned until all eight are about the
// same size (a corner-facing wedge of a square board holds more land than an edge-facing one).
export function territories(houses: HouseDef[]): Region[][] {
  const mid = (BOARD_SIZE - 1) / 2;
  const angle = (x: number, y: number) => Math.atan2(y - mid, x - mid);
  const reach = new Map<HouseId, number>(houses.map(h => [h.id, 1]));
  const assign = () => {
    const grid: Region[][] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      grid.push([]);
      for (let x = 0; x < BOARD_SIZE; x++) {
        const wobble = (noise(x, y, 3.2) - 0.5) * 3.2;
        if (!inBoard({ x, y })) { grid[y].push('sea'); continue; }
        if (Math.hypot(x - mid, y - mid) + wobble * 0.6 < 3.4) { grid[y].push('heartland'); continue; }
        let best: Region = houses[0].id, bestD = Infinity;
        for (const h of houses) {
          const turn = Math.abs(((angle(x, y) - angle(h.home.x, h.home.y) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
          const d = turn / reach.get(h.id)! + (noise(x + h.home.x * 7, y + h.home.y * 7, 2.6) - 0.5) * 0.45;
          if (d < bestD) { bestD = d; best = h.id; }
        }
        grid[y].push(best);
      }
    }
    return grid;
  };
  let grid = assign();
  for (let i = 0; i < 40; i++) {
    const count = new Map<Region, number>();
    for (const row of grid) for (const r of row) count.set(r, (count.get(r) ?? 0) + 1);
    const target = (BOARD_SIZE * BOARD_SIZE - (count.get('heartland') ?? 0) - (count.get('sea') ?? 0)) / houses.length;
    for (const h of houses) reach.set(h.id, reach.get(h.id)! * Math.pow(target / Math.max(1, count.get(h.id) ?? 0), 0.25));
    grid = assign();
  }
  return grid;
}

function mark(kind: TerrainMark, ink: string): string {
  const s = `stroke="${ink}" stroke-width="0.7" fill="none" stroke-linecap="round"`;
  const dot = (cx: number, cy: number, r: number) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ink}"/>`;
  switch (kind) {
    case 'peaks': return `<path d="M2 14 L6 7 L10 14" ${s}/><path d="M12 6 L15 1.5 L18 6" ${s}/>`;
    case 'dunes': return `<path d="M1 8 q4 -4 8 0" ${s}/><path d="M10 16 q4 -4 8 0" ${s}/>`;
    case 'tufts': return `<path d="M4 9 v-3 M6 9 v-4 M8 9 v-3" ${s}/><path d="M13 17 v-3 M15 17 v-4" ${s}/>`;
    case 'waves': return `<path d="M1 6 q2 -2 4 0 t4 0" ${s}/><path d="M9 15 q2 -2 4 0 t4 0" ${s}/>`;
    case 'mist': return `<path d="M1 5 h7" ${s}/><path d="M4 8 h9" ${s}/><path d="M10 15 h8" ${s}/>`;
    case 'rays': return `${dot(6, 6, 1.4)}<path d="M6 2.5 v-1.5 M6 9.5 v1.5 M2.5 6 h-1.5 M9.5 6 h1.5" ${s}/>${dot(15, 15, 1)}`;
    case 'embers': return dot(4, 5, 0.9) + dot(13, 9, 0.7) + dot(8, 15, 1);
    case 'heather': return dot(3, 4, 0.8) + dot(5, 5.5, 0.8) + dot(14, 13, 0.8) + dot(16, 14.5, 0.8);
    case 'stone': return `<path d="M0 10 h20 M10 0 v10 M5 10 v10 M15 10 v10" stroke="${ink}" stroke-width="0.5"/>`;
  }
}

export function terrainSvg(houses: HouseDef[], withLabels = true): string {
  const C = UNIT;
  const size = BOARD_SIZE * C;
  const grid = territories(houses);
  const paths = new Map<Region, string>();
  grid.forEach((row, y) => row.forEach((r, x) => paths.set(r, (paths.get(r) ?? '') + `M${x * C} ${y * C}h${C}v${C}h${-C}z`)));
  const regions = [...paths.keys()];
  const mid = (BOARD_SIZE - 1) / 2;
  const labels = withLabels ? houses.map(h => {
    const lx = (h.home.x + (mid - h.home.x) * 0.28) * C + C / 2;
    const ly = (h.home.y + (mid - h.home.y) * 0.28) * C + C / 2;
    return `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="4.2" font-style="italic" font-family="system-ui,sans-serif" fill="#fff" opacity="0.4">${TERRAIN_ART[h.id].name.replace("'", '&#39;')}</text>`;
  }).join('') : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 6}" height="${size * 6}">
<defs>
<filter id="flex" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="13"/><feGaussianBlur stdDeviation="2.8"/></filter>
<filter id="flexMarks" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="13"/></filter>
${regions.map(r => `<pattern id="m-${r}" width="20" height="20" patternUnits="userSpaceOnUse">${mark(TERRAIN_ART[r].mark, TERRAIN_ART[r].ink)}</pattern>`).join('')}
<pattern id="grid" width="${C}" height="${C}" patternUnits="userSpaceOnUse"><path d="M${C} 0V${C}H0" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="0.35"/></pattern>
</defs>
<rect width="${size}" height="${size}" fill="${TERRAIN_ART.heartland.base}"/>
<g filter="url(#flex)">${regions.map(r => `<path d="${paths.get(r)}" fill="${TERRAIN_ART[r].base}"/>`).join('')}</g>
<g filter="url(#flexMarks)" opacity="0.9">${regions.map(r => `<path d="${paths.get(r)}" fill="url(#m-${r})"/>`).join('')}</g>
<rect width="${size}" height="${size}" fill="url(#grid)"/>
${labels}
</svg>`;
}

const cache = new Map<string, string>();
export function terrainUrl(houses: HouseDef[], withLabels = true): string {
  const k = String(withLabels);
  if (!cache.has(k)) cache.set(k, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(terrainSvg(houses, withLabels))}`);
  return cache.get(k)!;
}
