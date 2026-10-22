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
  // Chapter 3 (outline beat 0): the trader that brought them home sails again, by day, north round Zetwal and west
  // along the coast to Ardencia's sea road, under the black cliffs.
  zetwal_ardencia: {
    id: 'zetwal_ardencia',
    harbor: 'Pòdlimyè, at noon',
    paddle: 'The trader casts off from the long pier and swings out past the reef.',
    aboard: 'The sails fill. Ardencia is across the strait.',
    shore: 'zetwal',
    start: { x: 119, y: 37 },
    via: [{ x: 121, y: 9 }],
    end: { x: 62, y: 14 },
    captions: [
      { at: 0, text: 'Out past the reefs of Zetwal...' },
      { at: 0.35, text: 'North, then west along the coast...' },
      { at: 0.75, text: '...to the black cliffs of Ardencia.' },
    ],
    music: 'farewell',
  },
  // Chapter 4 (outline beat 0, with its review 3.12): the trader sails at first light from the Free Brasador camp,
  // out from Ardencia's north coast, east along the open sea, south past the reefs of Zetwal and down the open sea
  // to Al-Doria's east coast, abreast of Bab al-Dhahab.
  ardencia_aldoria: {
    id: 'ardencia_aldoria',
    harbor: 'The strand of Ardencia, at first light',
    paddle: 'A Free Brasador fishing boat rows the party out to the Zetwal trader.',
    aboard: 'All aboard. The sails fill. Ahead: Al-Doria.',
    shore: 'ardencia',
    start: { x: 62, y: 14 },
    via: [
      { x: 121, y: 9 },
      { x: 124, y: 50 },
    ],
    end: { x: 117, y: 66 },
    captions: [
      { at: 0, text: 'Away from the black cliffs of Ardencia...' },
      { at: 0.45, text: 'South, past the reefs of Zetwal...' },
      { at: 0.8, text: '...to the Gate of Gold.' },
    ],
    music: 'farewell',
  },
  // Chapter 6's end into Chapter 7 (the outline beat 0, with its review's 3.9: Ordvik's dot is inland, so the longship
  // sets out from Skarragol's south coast): south-west along the coast, round the point, into the mist off Kirinoura.
  skarragol_kuroshi: {
    id: 'skarragol_kuroshi',
    harbor: 'The Longship Quay, Ordvik',
    paddle: 'The Ironvow longship pulls out from the quay, oars in time, Salkhi complaining in the stern.',
    aboard: 'The sail goes up. South along the fjord coast.',
    shore: 'skarragol',
    start: { x: 104, y: 104 },
    via: [{ x: 96, y: 116 }],
    end: { x: 66, y: 115 },
    captions: [
      { at: 0, text: 'South along the fjord coast...' },
      { at: 0.5, text: 'Round the point, where the water goes grey...' },
      { at: 0.8, text: '...into the mist, where the lanterns are.' },
    ],
    music: 'farewell',
  },
  // Chapter 7's end into Chapter 8 (the outline beat 0, with its review's 3.8: Agnipur's dot is inland, so the trader
  // lands at the head of its bay): west out of the mist off Kirinoura, across the bay, to Agnipur's harbor chain.
  kuroshi_jwaladesh: {
    id: 'kuroshi_jwaladesh',
    harbor: 'The Lantern Pier, Kirinoura',
    paddle: 'A pier-boat takes them out through the mist to the Zetwal trader, lanterns on its rail.',
    aboard: 'The gold sails go up. West across the bay, Salkhi in the hold, complaining.',
    shore: 'kuroshi',
    start: { x: 66, y: 115 },
    via: [{ x: 50, y: 108 }],
    end: { x: 42, y: 101 },
    captions: [
      { at: 0, text: 'Out of the mist, west across the bay...' },
      { at: 0.6, text: 'The water goes from grey to green...' },
      { at: 0.85, text: '...to the salt flats, where the sky is on fire.' },
    ],
    music: 'farewell',
  },
};
