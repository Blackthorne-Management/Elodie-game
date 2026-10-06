// The one card design, drawn by the game: title bar with the category symbol, the picture window, the type line
// and the rules text. Hand Cards, Instants and Elodie's cards each have their own look; only the picture is art.
import type { ReactNode } from 'react';
import type { CardDef } from '../engine/content';
import { CARD_ART, CATEGORY_ART } from '../assets.config';
import { cardKindClass } from './cardKind';

export function CategorySymbol({ card }: { card: CardDef }) {
  const art = CATEGORY_ART[card.category];
  return <span className="cf-symbol" aria-hidden>{art?.icon ? <img src={art.icon} alt="" /> : art?.glyph ?? '•'}</span>;
}

export function CardFrame({ card, compact, children }: { card: CardDef; compact?: boolean; children?: ReactNode }) {
  const pic = CARD_ART.pictures[card.id];
  return (
    <div className={`cf ${cardKindClass(card)} ${compact ? 'compact' : ''}`}>
      <div className="cf-title"><CategorySymbol card={card} /><span className="cf-name">{card.name}</span></div>
      {!compact && (
        <div className="cf-art">
          {pic ? <img src={pic} alt="" /> : <span className="cf-art-empty" aria-hidden>{CATEGORY_ART[card.category]?.glyph}</span>}
        </div>
      )}
      <div className="cf-type">{card.elodie ? 'Elodie · ' : ''}{card.kind === 'hand' ? 'Hand Card' : 'Instant'} · {card.category}</div>
      <div className="cf-text">
        <span>{card.text}</span>
        {!compact && card.flavor && <span className="cf-flavor">{card.flavor}</span>}
      </div>
      {children}
    </div>
  );
}
