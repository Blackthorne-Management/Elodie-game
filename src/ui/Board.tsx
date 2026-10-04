import { memo } from 'react';
import type { Game } from '../engine/game';
import type { Pos } from '../engine/types';
import { BOARD_SIZE } from '../config';
import { THRONE, key } from '../engine/board';
import { BOARD_ART, HOUSE_ART, TILE_ART } from '../assets.config';
import { Terrain } from './Terrain';

interface Props {
  game: Game;
  version: number;
  highlights: Map<string, number>;   // square key -> option index
  onPick: (i: number) => void;
  focus?: number | null;             // player to ring (whose turn)
  zoom: boolean;
}

const C = 10;   // viewBox units per square

// The whole board is one SVG: squares are drawn as a pattern, so there are only a few dozen nodes.
function BoardView({ game, highlights, onPick, focus, zoom }: Props) {
  const s = game.s;
  const size = BOARD_SIZE * C;
  const tiles = Object.values(game.content.houses);
  const art = BOARD_ART.image;
  const living = s.players.filter(p => p.pos);
  const byKey = new Map<string, number[]>();
  for (const p of living) {
    const k = key(p.pos!);
    byKey.set(k, [...(byKey.get(k) ?? []), p.id]);
  }

  return (
    <div className={`board-wrap ${zoom ? 'zoom' : ''}`}>
      <svg className="board" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Game board">
        <Terrain houses={tiles} />
        {art && (
          <>
            <defs><pattern id="artGrid" width={C} height={C} patternUnits="userSpaceOnUse"><path d={`M${C} 0V${C}H0`} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth={0.3} /></pattern></defs>
            <rect width={size} height={size} fill="url(#artGrid)" />
          </>
        )}

        <rect x={THRONE[0].x * C} y={THRONE[0].y * C} width={C * 2} height={C * 2} fill={art ? 'none' : BOARD_ART.throne} stroke={BOARD_ART.throneEdge} strokeWidth={0.8} />
        {!art && <text x={(THRONE[0].x + 1) * C} y={(THRONE[0].y + 1) * C + 2.5} textAnchor="middle" fontSize={7} fill={BOARD_ART.throneEdge}>♛</text>}

        {tiles.map(h => {
          const owner = s.players.find(p => p.house === h.id);
          return (
            <g key={h.id}>
              <rect x={h.home.x * C + 0.4} y={h.home.y * C + 0.4} width={C - 0.8} height={C - 0.8} rx={1}
                fill={TILE_ART[h.tileType].color} fillOpacity={art ? 0.45 : 1} stroke={owner ? HOUSE_ART[h.id].color : '#888'} strokeWidth={owner ? 1.2 : 0.4}
                strokeDasharray={owner ? undefined : '1.5 1'} />
              <text x={h.home.x * C + C / 2} y={h.home.y * C + C / 2 + 2} textAnchor="middle" fontSize={5} fontWeight={700} fill="#fff" opacity={0.85}>
                {TILE_ART[h.tileType].glyph}
              </text>
            </g>
          );
        })}

        {[...highlights.entries()].map(([k, i]) => {
          const [x, y] = k.split(',').map(Number);
          return (
            <rect key={k} x={x * C + 0.6} y={y * C + 0.6} width={C - 1.2} height={C - 1.2} rx={1.2}
              fill={BOARD_ART.highlight} fillOpacity={0.28} stroke={BOARD_ART.highlight} strokeWidth={0.6}
              className="pick" onClick={() => onPick(i)} />
          );
        })}

        {[...byKey.entries()].flatMap(([k, ids]) => {
          const [x, y] = k.split(',').map(Number);
          return ids.map((id, n) => {
            const p = s.players[id];
            const art = HOUSE_ART[p.house];
            const r = ids.length > 1 ? 2.6 : 3.6;
            const off = ids.length > 1 ? offsets(ids.length)[n] : { x: 0, y: 0 };
            const cx = x * C + C / 2 + off.x, cy = y * C + C / 2 + off.y;
            // Pawns slide to their new square so you can see the journey (CSS transition on the transform).
            return (
              <g key={id} className="pawn" pointerEvents="none" style={{ transform: `translate(${cx}px, ${cy}px)` }}>
                {focus === id && <circle r={r + 1.2} fill="none" stroke="#fff" strokeWidth={0.6} />}
                <circle r={r} fill={art.color} stroke="#111" strokeWidth={0.4} />
                <text y={r * 0.4} textAnchor="middle" fontSize={r * 1.15} fontWeight={800} fill="#fff">{art.initial}</text>
              </g>
            );
          });
        })}
      </svg>
    </div>
  );
}

function offsets(n: number): Pos[] {
  const d = 2.4;
  const ring = [{ x: -d, y: -d }, { x: d, y: -d }, { x: -d, y: d }, { x: d, y: d }, { x: 0, y: -d }, { x: 0, y: d }, { x: -d, y: 0 }, { x: d, y: 0 }];
  return ring.slice(0, n);
}

export const Board = memo(BoardView, (a, b) => a.version === b.version && a.zoom === b.zoom && a.highlights === b.highlights);
