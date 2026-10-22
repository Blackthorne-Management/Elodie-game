// Full-screen cards shown once when their flag is set.

import type { Condition } from '../engine/conditions.ts';
import type { CardDef } from '../engine/content.ts';
import { TOKEN_CHAIRS, betrayed } from './claim.ts';

/** The Almoner by her Chapter 9 fate (the second review's 3.6), on the Just and Hollow cards. */
const ALMONER: readonly { if: Condition; text: string }[] = [
  { if: { flag: 'choice.hushed_tried' }, text: 'The Almoner was tried in Kingsmere, by its own law.' },
  { if: { flag: 'choice.hushed_broken' }, text: 'The Almoner lives in Kingsmere. The city knows her face.' },
];

/** Each token house's fate on the Just Throne: its chair sat, or bare. */
const FATES: Readonly<Record<string, string>> = {
  al_doria: 'Al-Doria\'s guild is paid, and says so in writing.',
  skarragol: 'Skarragol\'s standard flies over the herds.',
  kuroshi: 'In Kirinoura, Kaede burns the old files herself.',
  jwaladesh: 'In Agnipur, the flame is up.',
};
const houseFates: { if: Condition; text: string }[] = Object.entries(FATES).flatMap(([house, text]) => {
  const name = TOKEN_CHAIRS.find((c) => c.house === house)!.name;
  return [
    { if: { not: betrayed(house) }, text },
    { if: betrayed(house), text: `${name}'s chair waits. The Hall is patient.` },
  ];
});

export const CARDS: readonly CardDef[] = [
  // The end of Chapter 1: the voyage to Xaraguá begins (travel.next) when the card closes. The demo repository
  // (elodie-game-demo) keeps its own card here: "Thank you for playing the demo!", Chapter 2 on November 22.
  {
    id: 'act1_end',
    when: 'act1.complete',
    title: 'Chapter 1 complete',
    lines: ['The Festival of the Gaze', 'Next: Chapter 2, The Charter', 'Beyond the reef, a Zetwal ship waits to carry them to Xaraguá...'],
  },
  // Chapter 2's midpoint (owner decision, Oct 15): the Crown attacks and the city is occupied.
  {
    id: 'xaragua_falls',
    when: 'story.refuge',
    title: 'The night the Crown came',
    lines: ['Yucayeque is occupied. Cacique Anaco is a prisoner.', 'Yari and Anissa hide in the cave with the resistance.', 'Gianna walks on alone, on her envoy\'s papers.'],
  },
  // The end of Chapter 2: home to Zetwal, and Grandfather's request.
  {
    id: 'act2_end',
    when: 'act2.complete',
    title: 'Chapter 2 complete',
    lines: ['The Charter', 'Next: Chapter 3, The Trial of Blades', 'Ardencia, and an oath fifty years old...'],
  },
  // The end of Chapter 3: the strand camp; the trader sails for Al-Doria at first light.
  {
    id: 'act3_end',
    when: 'act3.complete',
    title: 'Chapter 3 complete',
    lines: ['The Trial of Blades', 'Next: Chapter 4, The Ledger', 'Al-Doria, and a page that should not exist...'],
  },
  // The end of Chapter 4: the caravan gate at first light; the Dorini caravan sets out for Eightgate.
  {
    id: 'act4_end',
    when: 'act4.complete',
    title: 'Chapter 4 complete',
    lines: ['The Ledger', 'Next: Chapter 5, The Parley', 'Eightgate, and a seal only the Throne may break...'],
  },
  // The end of Chapter 5: the Iron Gate opens on the winter road east (Skarragol first: owner decision, Oct 20).
  {
    id: 'act5_end',
    when: 'act5.complete',
    title: 'Chapter 5 complete',
    lines: ['The Parley', 'Next: Chapter 6, The Stolen Standard', 'Skarragol, and a herd that will not stay stolen...'],
  },
  // Chapter 6: round the fjord's head on Grimvald's horses, to the fair at dawn (the chapter's only card mid-way).
  {
    id: 'round_fjord',
    when: 'story.standard_home',
    title: "Round the fjord's head",
    lines: ["On the thief's own horses, by the shore path round the fjord's head.", 'The standard across Bayarmaa\'s saddle.', 'At first light, the fair\'s fires, and the horn.'],
  },
  // The end of Chapter 6: the longship south along the coast, to Kuroshi (the roads in their fixed order).
  {
    id: 'act6_end',
    when: 'act6.complete',
    title: 'Chapter 6 complete',
    lines: ['The Stolen Standard', 'Next: Chapter 7, The Fog Files', 'Kuroshi, and a city that knows what you said before you say it...'],
  },
  // The end of Chapter 7: a Zetwal trader across the bay to Jwaladesh (the roads in their fixed order).
  {
    id: 'act7_end',
    when: 'act7.complete',
    title: 'Chapter 7 complete',
    lines: ['The Fog Files', 'Next: Chapter 8, The Dying Flame', 'Jwaladesh, where the sky is on fire and the flame is going out...'],
  },
  // The end of Chapter 8: a Zetwal trader north along the white coast to Aldermoor (Chapter 9's landing).
  {
    id: 'act8_end',
    when: 'act8.complete',
    title: 'Chapter 8 complete',
    lines: ['The Dying Flame', "Next: Chapter 9, The Regent's Keep", 'Aldermoor, where the Crown keeps its books...'],
  },
  // The end of Chapter 9: home to Pòdlimyè before the Crown's fleet (Chapter 10's Muster).
  {
    id: 'act9_end',
    when: 'act9.complete',
    title: 'Chapter 9 complete',
    lines: ["The Regent's Keep", 'Next: Chapter 10, The Muster', 'Zetwal, where the realm must gather before the fleet...'],
  },
  // The end of Chapter 10: the fleet sails for Xaraguá (Chapter 11's landing).
  {
    id: 'act10_end',
    when: 'act10.complete',
    title: 'Chapter 10 complete',
    lines: ['The Muster', 'Next: Chapter 11, The War of the Harbor', 'Xaraguá, where the seventh clause took the harbor...'],
  },
  // The end of Chapter 11: the Regent has gone home to his Throne (Chapter 12's start, inside Eightgate's Ardencia Gate).
  {
    id: 'act11_end',
    when: 'act11.complete',
    title: 'Chapter 11 complete',
    lines: ['The War of the Harbor', 'Next: Chapter 12, The Claim', 'Eightgate, where someone must go and stand on the Throne...'],
  },
  // Chapter 12's end: the Claim stands and the Hearing is called (the second review's 3.9: nine days, the witnesses sent
  // for). Closing it, the Epilogue opens on the Concourse on the Hearing's morning (travel.next).
  {
    id: 'claim_stands',
    when: 'story.hearing_called',
    title: 'The Claim stands',
    lines: ['Chapter 12, The Claim', 'The Hearing sits in nine days.', 'The witnesses are sent for: the island, the Ash Road, Kingsmere, Pòdlimyè.'],
  },
  // The three endings (the outline 14.2 with its second review's 3.5, 3.6 and 3.13): each house's fate as the card's lines,
  // the Regent's by ending, the Almoner's by her Chapter 9 fate, and on the Hollow Throne what strained the realm on this
  // save (engine/stability.ts costliest: ending.cost.*). Then The End, the cast, and the credits.
  {
    id: 'end_just',
    when: 'end.just',
    title: 'The Just Throne',
    lines: [
      'The Council of Eight sits. She speaks for it while it lets her.',
      'Xaraguá\'s harbor stays with the people who fish it, by law: the Warden of Oaths\' first oath.',
      'Zetwal\'s seventh line is cut into the Marshal\'s stone at last, in Patricio\'s hand.',
      'The Lord Regent was heard in this Hall a month later. Every witness spoke. He answered none.',
    ],
    more: ALMONER,
  },
  {
    id: 'end_just_houses',
    when: 'end.just',
    title: 'The houses',
    lines: ['Ardencia\'s elders answer before the Hall. The treasurer\'s family is paid from their ledgers.'],
    more: [
      ...houseFates,
      { if: { flag: 'end.just' }, text: 'Aldermoor publishes the purge list. The Crown keeps no almoner.' },
      { if: { flag: 'end.just' }, text: 'Tati Coco dressed the council. Gold. She said gold.' },
    ],
  },
  {
    id: 'end_hollow',
    when: 'end.hollow',
    title: 'The Hollow Throne',
    lines: ['Gianna sits the Throne. The houses watch it, and wait.', 'Xaraguá\'s petition is heard. Its harbor is not yet returned.', 'The Lord Regent went home to Kingsmere. Nobody renewed him.'],
    more: [
      { if: { flag: 'hearing.exile' }, text: 'The Ash Ledger goes on in the dark, unaccountable.' },
      { if: { flag: 'hearing.pardon' }, text: 'The Warden of Oaths has an office, and nobody brings him an oath.' },
      { if: { flag: 'ending.cost.harbor_strike' }, text: 'The harbor was taken by a strike, and the realm remembers it.' },
      { if: { flag: 'ending.cost.fleet_escaped' }, text: 'The Crown\'s fleet sails still.' },
      { if: { flag: 'ending.cost.challenge' }, text: 'Azriel holds you to it. Every day.' },
      { if: { flag: 'ending.cost.concord' }, text: 'The corners still argue, and not about the same thing.' },
      { if: { flag: 'ending.cost.yield.thorne' }, text: 'Governor Thorne was broken, and the Crown says so.' },
      { if: { flag: 'ending.cost.yield.flank' }, text: 'The captain who sold his house was bound, and his house remembers.' },
      { if: { flag: 'ending.cost.yield.hushed' }, text: 'Kingsmere saw the Almoner\'s face, and is afraid.' },
      ...TOKEN_CHAIRS.map((c) => ({ if: { flag: `ending.cost.bare.${c.house}` }, text: `${c.name}'s chair stays bare.` })),
      { if: { flag: 'ending.cost.none' }, text: 'Debts unsettled. Nobody can say which.' },
      ...ALMONER,
    ],
  },
  {
    id: 'end_iron',
    when: 'end.iron',
    title: 'The Iron Throne',
    lines: [
      'Order is kept, by force.',
      'Yari has gone home to Xaraguá. Its petition is heard; its harbor is not returned.',
      'The Quiet Crown\'s cells are quiet, for a different reason.',
      'The Lord Regent was not heard. The Iron Throne does not hear anyone twice.',
      'A tragedy.',
    ],
  },
  // The End (the review's 3.13): the intro's first line, answered by the ending, then Chapter 1's farewell, finished.
  {
    id: 'the_end',
    when: 'end.done',
    title: 'The End',
    lines: ['The goddess Elodie wove the realm. She does not rule it. She remembers.'],
    more: [
      { if: { flag: 'end.just' }, text: 'Now, so does the Hall.' },
      { if: { flag: 'end.hollow' }, text: 'The Hall is still learning to.' },
      { if: { flag: 'end.iron' }, text: 'She remembers this too.' },
      { if: { flag: 'end.done' }, text: 'The Gaze sees you both. So does she.' },
    ],
  },
  // The cast, a house at a time (names only; no new art), then the credits panel and the title.
  {
    id: 'cast_1',
    when: 'end.done',
    title: 'The cast',
    lines: ['Zetwal: Gianna, Anissa, Elodie, Grandmother Anicette, Marshal Patricio, Sebastian, Tati Coco.', 'Xaraguá: Yari, Cacique Anaco, Caona, the camp leader, the lamp-oil seller.'],
  },
  {
    id: 'cast_2',
    when: 'end.done',
    title: 'The cast',
    lines: ['Ardencia: Azzy, Rael, Benny, Nancy, Zelia, Amanda, Joaquin, Rivera, Jaime.', 'Al-Doria: Samira, Layla Dorini, Qasim.'],
  },
  {
    id: 'cast_3',
    when: 'end.done',
    title: 'The cast',
    lines: ['Skarragol: Bayarmaa and Salkhi, Torvald, Grimvald.', 'Kuroshi: Haru, Kayla, Kaede, the Paper Fox.', 'Jwaladesh: Vikram, Aiyana, Meera, Seth Dhanraj.'],
  },
  {
    id: 'cast_4',
    when: 'end.done',
    title: 'The cast',
    lines: ['Aldermoor: Edmund, Lady Rosalind, Jordyn, the printer, the Almoner.', 'Eightgate: the Lord Regent, Keeper Hollis, the Master of the Chairs.', 'And Rahel, and Patricia, and the goddess, who remembers.'],
    credits: true,
  },
];
