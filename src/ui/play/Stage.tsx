// The 2.5D view: the board tilted like a tabletop seen from your chair, the camera gliding to whoever
// is acting. Characters stand on the ground as tokens; reachable squares glow; arrows let you step.
import type { ReactNode } from 'react';
import type { Game } from '../../engine/game';
import type { Dir, Pos } from '../../engine/types';
import { THRONE, key } from '../../engine/board';
import { BOARD_SIZE } from '../../config';
import { BOARD_ART, HOUSE_ART, PORTRAITS, TILE_ART } from '../../assets.config';
import { terrainUrl } from '../terrainSvg';
import { HUMAN } from '../../state/gameStore';

export const CELL = 60;
const TILT = 54;

export interface StageProps {
  game: Game;
  shown: Record<number, Pos | null>;
  focus: Pos;
  lit: Map<string, () => void>;          // squares you can tap
  path: Pos[];                            // the steps you've taken so far this move
  arrows: { dir: Dir; to: Pos; onTap: () => void }[];
  ghost: Pos | null;                      // where your character stands during a move you haven't confirmed
  active: number | null;
  onToken: (id: number) => void;
  children?: ReactNode;                   // overlays (feed, banners, mini-map)
}

const ROT: Record<Dir, number> = { north: 0, east: 90, south: 180, west: 270 };

export function Stage({ game, shown, focus, lit, path, arrows, ghost, active, onToken, children }: StageProps) {
  const s = game.s;
  const houses = Object.values(game.content.houses);
  const size = BOARD_SIZE * CELL;
  const fx = focus.x * CELL + CELL / 2, fy = focus.y * CELL + CELL / 2;

  // Pawns sharing a square fan out a little.
  const at = new Map<string, number[]>();
  for (const p of s.players) {
    const pos = p.id === HUMAN && ghost ? ghost : shown[p.id];
    if (!pos || p.specter) continue;
    at.set(key(pos), [...(at.get(key(pos)) ?? []), p.id]);
  }

  return (
    <div className={`stage2 ${arrows.length ? 'stepping' : ''}`}>
      <div className="cam" style={{ transform: `rotateX(${TILT}deg) translate3d(${-fx}px, ${-fy}px, 0)` }}>
        <div className="plane2" style={{ width: size, height: size, backgroundImage: `url("${terrainUrl(houses)}")` }}>
          <div className="throne2" style={{ left: THRONE[0].x * CELL, top: THRONE[0].y * CELL, width: CELL * 2, height: CELL * 2, background: BOARD_ART.throne, borderColor: BOARD_ART.throneEdge }}>♛</div>
          {houses.map(h => (
            <div key={h.id} className="tile2" style={{ left: h.home.x * CELL, top: h.home.y * CELL, width: CELL, height: CELL, background: TILE_ART[h.tileType].color,
              borderColor: s.players.some(p => p.house === h.id) ? HOUSE_ART[h.id].color : '#777' }}>{TILE_ART[h.tileType].glyph}</div>
          ))}
          {path.map((q, i) => <div key={`p${i}`} className="sq path" style={{ left: q.x * CELL, top: q.y * CELL, width: CELL, height: CELL }} />)}
          {[...lit.entries()].map(([k, onTap]) => {
            const [x, y] = k.split(',').map(Number);
            return <button key={k} type="button" className="sq lit" aria-label={`Square ${x + 1}, ${y + 1}`} onClick={onTap}
              style={{ left: x * CELL, top: y * CELL, width: CELL, height: CELL }} />;
          })}
          {arrows.map(a => (
            <button key={a.dir} type="button" className="arrow2" aria-label={`Step ${a.dir}`} onClick={a.onTap}
              style={{ left: a.to.x * CELL + CELL / 2, top: a.to.y * CELL + CELL / 2 }}>
              <svg viewBox="0 0 44 44" style={{ transform: `rotate(${ROT[a.dir]}deg)` }}><circle cx="22" cy="22" r="20" fill="#d9a441" /><path d="M22 9 L33 25 H25.5 V34 H18.5 V25 H11 Z" fill="#2a1a10" /></svg>
            </button>
          ))}
          {[...at.entries()].flatMap(([k, ids]) => {
            const [x, y] = k.split(',').map(Number);
            return ids.map((id, n) => {
              const p = s.players[id];
              const spread = ids.length > 1 ? (n - (ids.length - 1) / 2) * 22 : 0;
              const url = PORTRAITS[p.house][p.gen - 1];
              return (
                <div key={id} className={`token2 ${id === HUMAN ? 'me' : ''} ${active === id ? 'active' : ''}`}
                  style={{ left: x * CELL + CELL / 2 + spread, top: y * CELL + CELL / 2, ['--c' as string]: HOUSE_ART[p.house].color }}>
                  <button type="button" className="stand" onClick={() => onToken(id)} style={{ transform: `translate(-50%, -100%) rotateX(${-TILT}deg)` }}>
                    <span className="tag">{id === HUMAN ? 'You' : p.name}</span>
                    <span className="disc">{url ? <img src={url} alt="" /> : <span className="silhouette" />}</span>
                    <span className="base" />
                  </button>
                </div>
              );
            });
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
