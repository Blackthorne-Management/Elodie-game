// Cards shown face up as if you were holding them: a rival's revealed hand, the top of the deck, or the
// cards you're choosing between. Full text, so you know exactly what each one does.
import type { Game } from '../../engine/game';
import { CARD_ART } from '../../assets.config';

export function FullCard({ g, id, onChoose, chooseLabel = 'Choose' }: {
  g: Game; id: number; onChoose?: () => void; chooseLabel?: string;
}) {
  const def = g.card(id);
  return (
    <div className={`fullcard ${def.elodie ? 'elodie' : ''}`} style={{ background: def.kind === 'hand' ? CARD_ART.hand : CARD_ART.instant }}>
      <span className="c-cat">{def.category}{def.kind === 'instant' ? ' · Instant' : ''}</span>
      <span className="c-name">{def.name}</span>
      <span className="c-text">{def.text}</span>
      {def.flavor && <span className="c-flavor">{def.flavor}</span>}
      {onChoose && <button type="button" className="c-play" onClick={onChoose}>{chooseLabel}</button>}
    </div>
  );
}

export function CardRow({ g, cards, onChoose }: { g: Game; cards: number[]; onChoose?: (i: number) => void }) {
  if (!cards.length) return <div className="muted small">No cards.</div>;
  return (
    <div className="cardrow">
      {cards.map((c, i) => <FullCard key={`${c}-${i}`} g={g} id={c} onChoose={onChoose && (() => onChoose(i))} />)}
    </div>
  );
}

export interface PeekGroup { seq: number; title: string; cards: number[] }

export function PeekSheet({ g, groups, onClose }: { g: Game; groups: PeekGroup[]; onClose: () => void }) {
  return (
    <div className="peek2" role="dialog" aria-label="Revealed cards">
      {groups.map(grp => (
        <section key={grp.seq}>
          <h3>{grp.title}</h3>
          <CardRow g={g} cards={grp.cards} />
        </section>
      ))}
      <button type="button" className="act2 gold" onClick={onClose}>Got it</button>
    </div>
  );
}
