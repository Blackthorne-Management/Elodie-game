import { memo } from 'react';
import type { HouseDef } from '../engine/content';
import type { HouseId } from '../engine/types';
import { BOARD_SIZE } from '../config';
import { TERRAIN_ART } from '../assets.config';
import type { TerrainMark } from '../assets.config';

const C = 10;

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

type Region = HouseId | 'heartland';

// Which territory each square belongs to: nearest homeland, with noise bending the borders.
function territories(houses: HouseDef[]): Region[][] {
  const mid = (BOARD_SIZE - 1) / 2;
  const grid: Region[][] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    grid.push([]);
    for (let x = 0; x < BOARD_SIZE; x++) {
      const wobble = (noise(x, y, 3.2) - 0.5) * 3.2;
      if (Math.hypot(x - mid, y - mid) + wobble * 0.6 < 3.4) { grid[y].push('heartland'); continue; }
      let best: Region = houses[0].id, bestD = Infinity;
      for (const h of houses) {
        const d = Math.hypot(x - h.home.x, y - h.home.y) + (noise(x + h.home.x * 7, y + h.home.y * 7, 2.6) - 0.5) * 3;
        if (d < bestD) { bestD = d; best = h.id; }
      }
      grid[y].push(best);
    }
  }
  return grid;
}

// One path per territory (a union of its squares), so the terrain is ~9 SVG nodes, not 324.
function regionPaths(grid: Region[][]) {
  const paths = new Map<Region, string>();
  grid.forEach((row, y) => row.forEach((r, x) => {
    paths.set(r, (paths.get(r) ?? '') + `M${x * C} ${y * C}h${C}v${C}h${-C}z`);
  }));
  return paths;
}

function Mark({ kind, ink }: { kind: TerrainMark; ink: string }) {
  const s = { stroke: ink, strokeWidth: 0.7, fill: 'none', strokeLinecap: 'round' as const };
  switch (kind) {
    case 'peaks': return <><path d="M2 14 L6 7 L10 14" {...s} /><path d="M12 6 L15 1.5 L18 6" {...s} /></>;
    case 'dunes': return <><path d="M1 8 q4 -4 8 0" {...s} /><path d="M10 16 q4 -4 8 0" {...s} /></>;
    case 'tufts': return <><path d="M4 9 v-3 M6 9 v-4 M8 9 v-3" {...s} /><path d="M13 17 v-3 M15 17 v-4" {...s} /></>;
    case 'waves': return <><path d="M1 6 q2 -2 4 0 t4 0" {...s} /><path d="M9 15 q2 -2 4 0 t4 0" {...s} /></>;
    case 'mist': return <><path d="M1 5 h7" {...s} /><path d="M4 8 h9" {...s} /><path d="M10 15 h8" {...s} /></>;
    case 'rays': return <><circle cx="6" cy="6" r="1.4" fill={ink} /><path d="M6 2.5 v-1.5 M6 9.5 v1.5 M2.5 6 h-1.5 M9.5 6 h1.5" {...s} /><circle cx="15" cy="15" r="1" fill={ink} /></>;
    case 'embers': return <><circle cx="4" cy="5" r="0.9" fill={ink} /><circle cx="13" cy="9" r="0.7" fill={ink} /><circle cx="8" cy="15" r="1" fill={ink} /></>;
    case 'heather': return <><circle cx="3" cy="4" r="0.8" fill={ink} /><circle cx="5" cy="5.5" r="0.8" fill={ink} /><circle cx="14" cy="13" r="0.8" fill={ink} /><circle cx="16" cy="14.5" r="0.8" fill={ink} /></>;
    case 'stone': return <><path d="M0 10 h20 M10 0 v10 M0 20 M5 10 v10 M15 10 v10" stroke={ink} strokeWidth={0.5} /></>;
  }
}

function TerrainView({ houses }: { houses: HouseDef[] }) {
  const grid = territories(houses);
  const paths = regionPaths(grid);
  const size = BOARD_SIZE * C;
  return (
    <g className="terrain">
      <defs>
        {/* Wobble the territory edges and blend them softly: no hard borders. */}
        <filter id="flex" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="13" />
          <feGaussianBlur stdDeviation="2.8" />
        </filter>
        {/* Textures bend with the land but stay crisp. */}
        <filter id="flexMarks" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="13" />
        </filter>
        {[...paths.keys()].map(r => (
          <pattern key={r} id={`mark-${r}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <Mark kind={TERRAIN_ART[r].mark} ink={TERRAIN_ART[r].ink} />
          </pattern>
        ))}
        <pattern id="grid" width={C} height={C} patternUnits="userSpaceOnUse">
          <path d={`M${C} 0V${C}H0`} fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="0.35" />
        </pattern>
      </defs>
      <rect width={size} height={size} fill={TERRAIN_ART.heartland.base} />
      <g filter="url(#flex)">
        {[...paths.entries()].map(([r, d]) => <path key={r} d={d} fill={TERRAIN_ART[r].base} />)}
      </g>
      <g filter="url(#flexMarks)" opacity={0.9}>
        {[...paths.entries()].map(([r, d]) => <path key={r} d={d} fill={`url(#mark-${r})`} />)}
      </g>
      <rect width={size} height={size} fill="url(#grid)" />
      {houses.map(h => {
        const mid = (BOARD_SIZE - 1) / 2;
        // Name the land a little inside from its tile, toward the centre.
        const lx = (h.home.x + (mid - h.home.x) * 0.28) * C + C / 2;
        const ly = (h.home.y + (mid - h.home.y) * 0.28) * C + C / 2;
        return (
          <text key={h.id} x={lx} y={ly} textAnchor="middle" fontSize={4.2} fontStyle="italic" fill="#fff" opacity={0.38}>
            {TERRAIN_ART[h.id].name}
          </text>
        );
      })}
    </g>
  );
}

export const Terrain = memo(TerrainView);
