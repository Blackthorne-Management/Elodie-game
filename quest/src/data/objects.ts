// What the player can learn about things on the maps: the name label shown when facing a puzzle
// object or a door, and the one-line description A shows for an object with no dialogue of its own.
// Keyed by the object's (or door's) id in the maps; every puzzle object on every map has an entry
// (tests/content.test.ts).

import type { ObjectInfo } from '../engine/content.ts';
import { SHELF_OBJECTS } from './books.ts';

export const OBJECTS: Readonly<Record<string, ObjectInfo>> = {
  // Xaraguá, Yucayeque (Chapter 2).
  xaragua_customs_sign: { name: 'Customs notice' },
  pier_sign: { name: 'Ferry sign' },
  batey_stones: { name: 'Standing stones' },
  sea_cave_mouth: { name: 'Sea cave' },
  // The petroglyph cave and the record house (SIG-XAR).
  cave_flood: { name: 'Black water' },
  cave_rubble: { name: 'Landslide' },
  cave_drained: { name: 'Chamber floor', inspect: 'Dry rock, ridged where the water stood fifty years ago and drained away.' },
  lower_sluice_old: { name: 'Lower sluice (open)' },
  cave_carvings: { name: 'Carved wall' },
  cave_carvings_east: { name: 'Carved wall' },
  upper_sluice: { name: 'Upper sluice (to the sea)' },
  lower_sluice: { name: 'Lower sluice (to the gorge)' },
  cave_chalk: { name: 'Chalked wall' },
  oath_stone: { name: 'The oath stone' },
  checkpoint_north: { name: 'Checkpoint' },
  checkpoint_east: { name: 'Checkpoint' },
  shutters_weaver: { name: 'Shuttered house' },
  shutters_family: { name: 'Shuttered house' },
  fever_bark_tree: { name: 'Fever-bark tree' },
  escape_canoe: { name: 'The hidden canoe' },
  thorne_longboat: { name: "Thorne's longboat", inspect: 'A Crown longboat across the sea mouth, oars up, a lantern at the bow.' },
  // The occupied city (the Crown attack, Oct 17).
  crown_banner_village: { name: 'Crown banner', inspect: 'The Crown\'s red banner, nailed up over the village trail last night.' },
  crown_banner_pier: { name: 'Crown banner', inspect: 'The Crown\'s banner at the head of the pier. The fishers walk round it.' },
  crown_banner_batey_west: { name: 'Crown banner', inspect: 'A Crown banner at the edge of the dance ground.' },
  crown_banner_batey_east: { name: 'Crown banner', inspect: 'A Crown banner at the edge of the dance ground. Someone has thrown mud at it.' },
  ...Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [`burned_stall_${i + 1}`, { name: 'Burned stall', inspect: 'Charred posts and ash. The market burned the night the Crown came.' }]),
  ),
  record_baskets: { name: 'Record baskets' },
  mountain_sign: { name: 'Signpost' },
  ash_thumbprint: { name: 'Ash-marked post' },
  // Chapter 2's side quests (Oct 20).
  net_village: { name: 'Cut net' },
  net_beach: { name: 'Cut net' },
  net_salt: { name: 'Cut net' },
  glint_pond: { name: 'Something shiny', inspect: 'A shard of broken mirror, dropped in the mud by the pond. Small clawed prints lead west.' },
  glint_trail: { name: 'Something shiny', inspect: 'A bent tin ring on the trail. The clawed prints keep going west, to the big tree.' },
  old_ceiba: { name: 'The old ceiba' },
  old_ceiba_fork: { name: 'The old ceiba (forked)' },
  ceiba_sapling: { name: 'Ceiba sapling' },
  old_stumps: { name: 'Stumps' },
  cut_young_grove: { name: 'Stumps' },
  young_grove: { name: 'The grove behind the rocks' },
  grove_spot_flat: { name: 'Flat ground' },
  grove_spot_rocks: { name: 'Earth behind the rocks' },
  duho_seat: { name: "The cacique's duho" },
  crown_ship_west: { name: 'A Crown ship', inspect: 'A Crown warship at anchor, gun ports open. Its boats come and go all day.' },
  crown_ship_east: { name: 'A Crown ship', inspect: 'The flagship. A man in a white wig watches the village through a glass.' },
  crown_ship_far: { name: 'A Crown ship', inspect: 'A supply ship, riding low. Whatever it carries, it carries a lot.' },

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
  yari_canoe: { name: "Yari's canoe" },
  island_lantern_west: { name: 'Lantern' },
  island_lantern_east: { name: 'Lantern' },
  plaza_lantern_nw: { name: 'Lantern' },
  plaza_fountain: { name: 'Fountain' },
  plaza_lantern_ne: { name: 'Lantern' },
  plaza_lantern_sw: { name: 'Lantern' },
  plaza_lantern_se: { name: 'Lantern' },
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
  // Xaraguá, Yucayeque (Chapter 2).
  'xaragua-village/village_plaza': 'Up to the Areíto Plaza',
  'xaragua-village/village_beach': 'East: the Canoe Beach',
  'xaragua-village/village_conuco': 'West: the cassava gardens',
  'xaragua-village/village_customs': 'Crown Customs House',
  'xaragua-plaza/plaza_village': 'Down to the Harbor Village',
  'xaragua-plaza/plaza_caney': 'Caney of Anaco',
  'xaragua-plaza/plaza_song': 'Song House',
  'xaragua-beach/beach_village': 'Back to the Harbor Village',
  'xaragua-conuco/conuco_village': 'Down to the Harbor Village',
  'xaragua-conuco/conuco_mountain': 'Up the Mountain Path',
  'xaragua-mountain/mountain_conuco': 'Down to the cassava gardens',
  'xaragua-mountain/mountain_camp': 'The hill camp',
  'xaragua-camp/camp_mountain': 'Back to the Mountain Path',
  'xaragua-caney/caney_out': 'Out to the Areíto Plaza',
  'xaragua-song/song_out': 'Out to the Areíto Plaza',
  'xaragua-customs/customs_out': 'Out to the harbor',
  'xaragua-conuco/conuco_cave': 'Petroglyph cave',
  'xaragua-cave/cave_out': 'Out to the cassava gardens',
  'xaragua-plaza/plaza_record': 'Record house',
  'xaragua-record/record_out': 'Out to the Areíto Plaza',
  'xaragua-customs/customs_cellar': 'Cellar stairs',
  'xaragua-cellar/cellar_out': 'Up to the customs house',
  'xaragua-beach/beach_seacave': 'Sea cave',
  'xaragua-seacave/seacave_out': 'Out to the Canoe Beach',
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
