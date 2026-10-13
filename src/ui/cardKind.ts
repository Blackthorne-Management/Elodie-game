import type { CardDef } from '../engine/content';

// Which of the three card looks a card uses: Elodie's cards, Hand Cards or Instants.
export const cardKindClass = (card: CardDef) => (card.elodie ? 'kind-elodie' : card.kind === 'hand' ? 'kind-hand' : 'kind-instant');

// Timing reminder under the divider: Instants resolve on the draw; Block / Deflect and Reaction cards are played off-turn.
// Target cards carry the ◎ mark: only they can be answered by Counterspell or Turnabout (rules-decisions 84).
export const cardTiming = (card: CardDef) =>
  card.timing ? card.timing : card.kind === 'instant' ? 'Resolve when drawn · Never held'
    : card.counterspell ? 'Play when a ◎ card targets you' : card.responseOnly ? 'Play when attacked'
      : card.targets ? '◎ Target card' : '';
