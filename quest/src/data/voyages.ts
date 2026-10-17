// The voyages between capitals (engine/voyage.ts plots them over the board's sea; scenes/VoyageScene.ts
// draws them). A dialogue sets `voyage.next` with `travel.next`; the voyage plays, then the party lands.

import type { VoyageDef } from '../engine/voyage.ts';

export const VOYAGES: Readonly<Record<string, VoyageDef>> = {
  // Chapter 1 to 2 (owner request, Oct 17): Yari's canoe out of Pòdlimyè to a Zetwal ship waiting east of
  // the coast, north around Ardencia, then down the strait between Ardencia and Xaraguá to Yucayeque.
  zetwal_xaragua: {
    id: 'zetwal_xaragua',
    harbor: 'Pòdlimyè, at dawn',
    paddle: 'Yari paddles out to a Zetwal ship waiting beyond the reef.',
    aboard: 'All aboard. The golden sails fill.',
    shore: 'zetwal',
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
  // Chapter 2's end (Oct 17): out of the sea cave at the lowest tide, past the Crown's blockade, to a Zetwal
  // trader waiting off the cliffs, then the same way home.
  xaragua_zetwal: {
    id: 'xaragua_zetwal',
    harbor: 'Yucayeque, at the lowest tide',
    paddle: 'The old canoe slips out of the sea cave, under the cliffs, past the Crown\'s ships.',
    aboard: 'A Zetwal trader, lights out, waiting off the point. All aboard.',
    shore: 'xaragua',
    night: true,
    start: { x: 46, y: 32 },
    via: [
      { x: 47, y: 14 },
      { x: 62, y: 9 },
      { x: 121, y: 9 },
    ],
    end: { x: 119, y: 37 },
    captions: [
      { at: 0, text: 'Up the strait, away from Xaraguá...' },
      { at: 0.3, text: 'North, around the cliffs of Ardencia...' },
      { at: 0.75, text: '...and home to Zetwal.' },
    ],
    music: 'farewell',
  },
};
