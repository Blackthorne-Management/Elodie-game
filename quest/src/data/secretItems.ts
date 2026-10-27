// Three of the secret items (docs/quest/design/SECRET-ITEMS.md 4, 7 and 8; owner approved Oct 14, built Oct 27 with the
// side quests that hold them) and the key items those quests carry. Claude's calls, as the design's engine notes say: the
// Unbroken Wick and the Nightingale Key are key items whose effects hold while they are carried (Anissa keeps the wick;
// the key listens for everyone); the Patient Hour is a legendary relic, like Solange's Quill, worn by one member, with its
// once-a-battle skill. Their numbers are in config.ts SECRET_ITEMS.

import { SECRET_ITEMS } from '../config.ts';
import type { ItemDef } from '../engine/rpg.ts';

const W = SECRET_ITEMS.wick;

export const SECRET_ITEM_LIST: readonly ItemDef[] = [
  {
    id: 'nightingale_key',
    name: 'The Nightingale Key',
    kind: 'key',
    price: 0,
    text: 'A small brass key with a nightingale for a bow, from Lady Sayo\'s lacquer box. It opens nothing. It listens.',
    showcase: 'legendary',
    boons: { foresight: true },
    abilities: [
      { name: 'Kagemimi, for everyone', text: 'In every fight, each foe\'s next move is shown above it before it comes.' },
      { name: 'The silver sigil', text: 'On the maps, the Quiet Crown\'s own people show a faint silver mark over their heads.' },
    ],
  },
  {
    id: 'unbroken_wick',
    name: 'The Unbroken Wick',
    kind: 'key',
    price: 0,
    text: 'The lamp-maker\'s spare wick, white, fifty years in the sealed reservoir\'s neck and never lit. Anissa keeps it.',
    showcase: 'legendary',
    boons: { surgeCost: W.surgeCost, dawnAt: W.dawnAt, dawnHeal: W.dawnHeal, calmFloor: W.calmFloor },
    abilities: [
      { name: 'A steadier light', text: `Surge costs ${W.surgeCost} Spark instead of 5.` },
      { name: 'Dawn Surge', text: `A Surge made at ${W.dawnAt} Spark or more is a Dawn Surge: the fighters heal ${Math.round(W.dawnHeal * 100)}% and every ill is cleared.` },
      { name: 'Unbroken', text: 'Anissa\'s Calm never drops below 1: whispers cannot quiet her.' },
    ],
  },
  {
    id: 'patient_hour',
    name: 'The Patient Hour',
    kind: 'gear',
    slot: 'relic',
    rarity: 'legendary',
    price: 0,
    stats: { spd: 3, def: 2 },
    growth: { spd: 0.3, def: 0.3 },
    skill: 'stop_the_clock',
    text: 'Edmund\'s pocket watch, fitted with Dame Agatha\'s movement from the vault behind the tower clock. It keeps the long game.',
    showcase: 'legendary',
    abilities: [{ name: 'Stop the Clock', text: 'Once per battle, the hands stop: every fighter in the party acts once more before any foe.' }],
  },
  // Ar-4 The Old Lord's Errand (Chapter 3, built Oct 27; owner decision 2: Rael wears the charm, so the quest gives old
  // Benny's written promise): a key item whose Last Stand holds while it is carried (Claude's call: the design's passive,
  // Benny's Word, for the whole party once a battle, since the letter is nobody's to wear).
  {
    id: 'benny_promise',
    name: 'La Promesa de Benny',
    kind: 'key',
    price: 0,
    text: 'Old Benny\'s written promise, from the iron box in his crypt: a Brasador oath kept where no one could see. He gave it back to Gianna to keep.',
    showcase: 'legendary',
    boons: { lastStand: true },
    abilities: [{ name: 'Benny\'s Word', text: 'Once a battle, the first fighter a blow would fell or Bind stands at 1 HP instead.' }],
  },
  // What the quests carry.
  { id: 'ferran_tally', name: 'Elder Ferrán\'s tally', kind: 'key', price: 0, text: 'Twelve in every hundred of the salt tax, for nine years, in Elder Ferrán\'s own hand. From his strongroom.' },
  { id: 'sorry_letters', name: "Edmund's letters", kind: 'key', price: 0, text: 'Five apologies in Edmund\'s good hand, each sealed in grey wax, each addressed to someone he has hit. One is to a goose.' },
  { id: 'sealed_reservoir', name: 'The sealed reservoir', kind: 'key', price: 0, text: 'A clay lamp reservoir, sealed fifty years ago with five measures of oil inside. A white wick is tucked in its neck.' },
  { id: 'sayo_letter', name: 'Lady Sayo\'s letter', kind: 'key', price: 0, text: 'Sayo Suzumori\'s last message to Marshal Patricio, from the lacquer box under her singing floor.' },
];
