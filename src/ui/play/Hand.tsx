import { useState } from 'react';
import type { Game } from '../../engine/game';
import { CategorySymbol } from '../CardFrame';
import { CARD_ART } from '../../assets.config';
import { cardKindClass } from '../cardKind';

// Your hand, fanned. Tap a card to lift it; tap Play on a lifted card to play it.
export function Hand({ g, cards, playable, onPlay, onRead, dim }: {
  g: Game; cards: number[]; playable: Map<number, number>; onPlay: (option: number) => void; onRead: (id: number) => void; dim: boolean;
}) {
  const [lifted, setLifted] = useState<number | null>(null);
  const n = cards.length;
  return (
    <div className={`hand2 ${dim ? 'dim' : ''}`}>
      {cards.map((c, i) => {
        const def = g.card(c);
        const angle = n > 1 ? (i - (n - 1) / 2) * 8 : 0;
        const up = lifted === c;
        const canPlay = playable.has(c);
        return (
          <div key={c} className={`card2 ${cardKindClass(def)} ${canPlay ? 'glow' : ''} ${up ? 'up' : ''} ${def.elodie ? 'elodie' : ''}`}
            style={{ ['--a' as string]: `${angle}deg`, ['--i' as string]: i - (n - 1) / 2,
              ...(CARD_ART.pictures[c] ? { backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.8)), url("${CARD_ART.pictures[c]}")`, backgroundSize: 'cover', backgroundPosition: 'center 30%' } : {}) }}
            onClick={() => setLifted(up ? null : c)} role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setLifted(up ? null : c); }}>
            <span className="c-cat">{def.category}</span>
            <span className="c-name"><CategorySymbol card={def} /> {def.name}</span>
            <span className="c-text">{def.text}</span>
            {up && (
              <span className="c-actions">
                {canPlay && <button type="button" className="c-play" onClick={e => { e.stopPropagation(); setLifted(null); onPlay(playable.get(c)!); }}>Play</button>}
                <button type="button" className="c-read" onClick={e => { e.stopPropagation(); onRead(c); }}>Read</button>
              </span>
            )}
          </div>
        );
      })}
      {n === 0 && <div className="muted small">No cards in hand</div>}
    </div>
  );
}
