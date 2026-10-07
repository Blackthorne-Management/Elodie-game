import { useState } from 'react';
import type { Game } from '../../engine/game';
import { CardFrame } from '../CardFrame';

// Your hand, fanned: each card is drawn exactly as printed, small. Tap a card to lift it; tap Play to play it.
export function Hand({ g, cards, playable, onPlay, onRead, dim }: {
  g: Game; cards: number[]; playable: Map<number, number>; onPlay: (option: number) => void; onRead: (id: number) => void; dim: boolean;
}) {
  const [lifted, setLifted] = useState<number | null>(null);
  const n = cards.length;
  return (
    <div className={`hand3 ${dim ? 'dim' : ''}`}>
      {cards.map((c, i) => {
        const def = g.card(c);
        const up = lifted === c;
        const canPlay = playable.has(c);
        return (
          <div key={c} className={`hcard ${canPlay ? 'glow' : ''} ${up ? 'up' : ''}`}
            style={{ ['--a' as string]: `${n > 1 ? (i - (n - 1) / 2) * 7 : 0}deg`, ['--i' as string]: i - (n - 1) / 2 }}
            onClick={() => setLifted(up ? null : c)} role="button" tabIndex={0} aria-label={`${def.name}${canPlay ? ', playable' : ''}`}
            onKeyDown={e => { if (e.key === 'Enter') setLifted(up ? null : c); }}>
            <div className="hcard-face"><CardFrame card={def} /></div>
            {up && (
              <span className="hcard-actions">
                {canPlay && <button type="button" className="act2 gold" onClick={e => { e.stopPropagation(); setLifted(null); onPlay(playable.get(c)!); }}>Play</button>}
                <button type="button" className="act2" onClick={e => { e.stopPropagation(); onRead(c); }}>Read</button>
              </span>
            )}
          </div>
        );
      })}
      {n === 0 && <div className="muted small">No cards in hand</div>}
    </div>
  );
}
