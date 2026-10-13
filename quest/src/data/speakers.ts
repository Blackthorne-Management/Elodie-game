// Speakers shown on the dialogue name tag. Placeholder names only: story names are chosen by the
// owner (guide Section 13) before any real content is written.

import type { Speaker } from '../engine/dialogue.ts';

export const SPEAKERS: Readonly<Record<string, Speaker>> = {
  villager: { id: 'villager', name: 'Villager', portrait: 'villager' },
  keeper: { id: 'keeper', name: 'Temple Keeper', portrait: 'keeper' },
  fisher: { id: 'fisher', name: 'Fisher', portrait: 'fisher' },
  sign: { id: 'sign', name: 'Sign', portrait: 'sign' },
};
