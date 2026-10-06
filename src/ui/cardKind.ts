import type { CardDef } from '../engine/content';

// Which of the three card looks a card uses: Elodie's cards, Hand Cards or Instants.
export const cardKindClass = (card: CardDef) => (card.elodie ? 'kind-elodie' : card.kind === 'hand' ? 'kind-hand' : 'kind-instant');
