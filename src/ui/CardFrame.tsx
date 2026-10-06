// The one card design, trading-card style: the art fills the card, the title sits over the top and the rules
// text in a box over the lower part. A per-type overlay PNG (border, title plate, text box) goes between the art
// and the words once painted; until then the game draws simple plates. Hand Cards, Instants and Elodie's cards
// each have their own look.
import type { ReactNode } from 'react';
import type { CardDef } from '../engine/content';
import { CARD_ART, CATEGORY_ART } from '../assets.config';
import { cardKindClass } from './cardKind';

export function CategorySymbol({ card }: { card: CardDef }) {
  const art = CATEGORY_ART[card.category];
  return <span className="cf-symbol" aria-hidden>{art?.icon ? <img src={art.icon} alt="" /> : art?.glyph ?? '•'}</span>;
}

const overlayFor = (card: CardDef) => (card.elodie ? CARD_ART.overlays.elodie : card.kind === 'hand' ? CARD_ART.overlays.hand : CARD_ART.overlays.instant);

export function CardFrame({ card, children }: { card: CardDef; children?: ReactNode }) {
  const pic = CARD_ART.pictures[card.id];
  const overlay = overlayFor(card);
  return (
    <div className="cf-wrap">
      <div className={`cf ${cardKindClass(card)} ${overlay ? 'has-overlay' : ''}`}>
        <div className="cf-art">
          {pic ? <img src={pic} alt="" /> : <span className="cf-art-empty" aria-hidden>{CATEGORY_ART[card.category]?.glyph}</span>}
        </div>
        {overlay && <img className="cf-overlay" src={overlay} alt="" />}
        <div className="cf-title"><CategorySymbol card={card} /><span className="cf-name">{card.name}</span></div>
        <div className="cf-box">
          <div className="cf-type">{card.elodie ? 'Elodie · ' : ''}{card.kind === 'hand' ? 'Hand Card' : 'Instant'} · {card.category}</div>
          <div className="cf-text">{card.text}</div>
          {card.flavor && <div className="cf-flavor">{card.flavor}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
