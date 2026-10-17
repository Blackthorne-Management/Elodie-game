// The voyages between capitals (engine/voyage.ts plots them over the board's sea; scenes/VoyageScene.ts
// draws them). A dialogue sets `voyage.next` with `travel.next`; the voyage plays, then the party lands.

import type { VoyageDef } from '../engine/voyage.ts';

export const VOYAGES: Readonly<Record<string, VoyageDef>> = {
  // Chapter 1 to 2 (owner request, Oct 17): Yari's canoe out of Pòdlimyè to a Zetwal ship waiting east of
  // the coast, north around Ardencia, then down the strait between Ardencia and Xaraguá to Yucayeque.
  zetwal_xaragua: {
    id: 'zetwal_xaragua',
    harbor: 'Pòdlimyè, at dawn',
    start: { x: 119, y: 37 },
    via: [
      { x: 121, y: 9 },
      { x: 62, y: 9 },
      { x: 47, y: 14 },
    ],
    end: { x: 46, y: 32 },
    captions: [
      { at: 0, text: 'Out past the reefs of Zetwal...' },
      { at: 0.25, text: 'North, around the cliffs of Ardencia...' },
      { at: 0.7, text: '...and down the strait to Xaraguá.' },
    ],
    music: 'farewell',
  },
};
