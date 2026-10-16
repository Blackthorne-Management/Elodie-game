// What the player can learn about things on the maps: the name label shown when facing a puzzle
// object or a door, and the one-line description A shows for an object with no dialogue of its own.
// Keyed by the object's (or door's) id in the maps; every puzzle object on every map has an entry
// (tests/content.test.ts).

import type { ObjectInfo } from '../engine/content.ts';
import { SHELF_OBJECTS } from './books.ts';

export const OBJECTS: Readonly<Record<string, ObjectInfo>> = {
  // Zetwal, the plaza and the bridgehead.
  monument: { name: "The Marshal's Stone" },
  stone_pile: { name: 'Cut stones' },
  signing_stage: { name: 'Signing platform' },
  rope_bridge: { name: 'Rope Bridge (collapsed)' },
  plaque: { name: 'Bridge plaque' },
  winch_rusted: { name: 'Chain Winch (rusted)' },
  pawl_rusted: { name: 'Pawl (rusted)' },
  pawl_pinned: { name: 'Pawl (pinned)' },
  winch: { name: 'Chain Winch' },
  pawl: { name: 'Pawl and iron pin' },
  chain_bridge: {
    name: 'Chain Bridge (lowered)',
    inspect: 'The Chain Bridge lies across the chasm, held down by a pin driven in fifty years ago.',
  },
  chain_bridge_echo: {
    name: 'Chain Bridge (lowered)',
    inspect: 'The new bridge spans the chasm. Without the pin, the counterweight will pull it back up.',
  },
  chain_bridge_raised: { name: 'Chain Bridge (raised)' },
  chain_bridge_raised_echo: { name: 'Chain Bridge (raised)' },

  // The Limyè house.
  map_table: { name: "Grandfather's map table" },
  war_map: { name: 'The war map' },
  study_shelf: { name: 'Bookshelf' },
  window_seat: { name: 'Window seat' },
  loose_board: { name: 'Loose floorboard' },
  floor_cache: { name: 'Window seat (loose board)' },

  // The Temple of Elodie.
  gaze_lamp: { name: 'Gaze Lamp' },
  gaze_lamp_lit: { name: 'Gaze Lamp (lit)' },
  lamp_echo: { name: 'Gaze Lamp (being built)' },
  name_stones: { name: 'Name stones' },

  // Test village (Phase 1).
  marker_echo: { name: 'Old marker' },
  marker_present: { name: 'Wayside shrine' },

  // The Cane Road.
  road_sign: { name: 'Signpost' },
  mill_ruin: { name: 'Old sugar mill' },
  smuggler_crates: { name: 'Crown-stamped crates' },

  // The Iron Market, the Hall of the Accord, the Old Harbor and Solèy Heights.
  hall_of_accord: { name: 'The Hall of the Accord' },
  hall_sign: { name: 'Hall notice board' },
  head_seat: { name: 'The Throne of the State' },
  accord_statue: { name: 'The Signers of the Accord' },
  iron_market_hall: { name: 'The Iron Market' },
  council_desk: { name: "The Speaker's desk" },
  pigeon_loft: { name: 'The pigeon loft' },
  courier_map: { name: 'The courier routes' },
  treasury_chests: { name: 'The strongboxes' },
  portrait_patricio: { name: 'Portrait: Marshal Patricio' },
  portrait_solange: { name: 'Portrait: Mother Solange' },
  portrait_elodie: { name: 'Portrait: Elodie Limyè' },
  portrait_founders: { name: 'Portrait: the founders' },
  customs_sign: { name: 'Customs house sign' },
  lookout: { name: 'The lookout' },
  lookout_sign: { name: 'Lookout sign' },
  heights_well: { name: 'The old well' },

  // The Temple Archive.
  solange_list: { name: "Mother Solange's list" },

  // Every bookshelf with books (data/books.ts).
  ...SHELF_OBJECTS,
};

/** Door labels, by `<map id>/<door id>` (or a bare door id when it is unique). */
export const DOORS: Readonly<Record<string, string>> = {
  'zetwal-town/town_house': 'Limyè house',
  'zetwal-house/house_front': 'Out to the plaza',
  'zetwal-town/town_temple': 'Temple of Elodie',
  'zetwal-temple/temple_bridge': 'Back across the bridge',
  'zetwal-temple/temple_archive': 'Temple Archive',
  'zetwal-archive/archive_out': 'Back to the temple',
  'zetwal-town/town_market': 'West lane: the Iron Market',
  'zetwal-market/market_plaza': 'Back to the plaza',
  'zetwal-market/market_heights': 'Up to Solèy Heights',
  'zetwal-market/market_harbor': 'Down to the Old Harbor',
  'zetwal-heights/heights_market': 'Down to the Iron Market',
  'zetwal-harbor/harbor_market': 'Up to the Iron Market',
  'zetwal-hall/hall_out': 'Out to Accord Square',
  'zetwal-town/town_square': 'Up the steps: Accord Square',
  'zetwal-square/square_plaza': 'Down to the plaza',
  'zetwal-square/square_hall': 'The Hall of the Accord',
  'zetwal-square/square_heights': 'West lane: Solèy Heights',
  'zetwal-town/town_harbor': 'Along the shore: the Old Harbor',
  'zetwal-harbor/harbor_plaza': 'Back to the plaza',
  'zetwal-heights/heights_square': 'East lane: Accord Square',
  'zetwal-town/town_gate': 'East gate: the Cane Road',
  'zetwal-road/road_gate': 'Back through the east gate',
  'test-village/house_front': 'House',
  'test-village/house_inside': 'Outside',
};
