// Every puzzle (guide 6.2): where it starts, the story flags that are true when the player reaches
// it, and what counts as solved. Each has puzzles/<id>/solution.json (inputs that solve it from a
// fresh save) and puzzles/<id>/cheats.json (input lists that must NOT solve it); tests replay both.

import type { Condition } from '../engine/conditions.ts';
import type { FlagSnapshot } from '../engine/flags.ts';

export interface PuzzleDef {
  id: string;
  title: string;
  map: string;
  spawn: string;
  /** Flags already set when the player reaches the puzzle. */
  flags: FlagSnapshot;
  goal: Condition;
}

const BEFORE_LOCKET: FlagSnapshot = {
  'party.anissa': true,
  'story.festival_intro': true,
  'story.heard_speech': true,
  'story.elodie_left': true,
  'story.house_entered': true,
};

/** Yucayeque on the day after Thorne's warning: the pier won, the party in the free city, the Locket in hand. */
const XARAGUA_FREE: FlagSnapshot = {
  ...BEFORE_LOCKET,
  'item.sun_locket': true,
  'encounter.xaragua_story.pier.won': true,
  'story.thorne_met': true,
  'story.lamp_asked': true,
};

/** Ordvik at dusk (Chapter 6): Bayarmaa with the party, the day's three things done, set out for the fjord. */
/** Agnipur after the Court (Chapter 8): Vikram met, Aiyana met, the Court heard (the duel fought). */
const AGNIPUR_DAY: FlagSnapshot = {
  ...BEFORE_LOCKET,
  'item.sun_locket': true,
  'story.yari_asked': true,
  'party.azzy': true,
  'party.samira': true,
  'party.bayarmaa': true,
  'party.haru': true,
  'act7.complete': true,
  'card.act7_end': true,
  'story.jwaladesh_arrived': true,
  'story.harbor_seen': true,
  'story.vikram_seen': true,
  'story.bazaar_seen': true,
  'story.aiyana_met': true,
  'story.vikram_challenged': true,
  'story.court_heard': true,
};
/** Agnipur at the night lamp's hour (Chapter 8): the day's three things done (data/jwaladesh.ts DAY_DONE). */
const AGNIPUR_NIGHT: FlagSnapshot = {
  ...AGNIPUR_DAY,
  'side.lamp_relay.accepted': true,
  'side.lamp_relay.done': true,
  'clue.relay_route': true,
  'side.anonymous_oil.accepted': true,
  'side.anonymous_oil.done': true,
  'story.salt_road_cleared': true,
  'debate.jwaladesh_hesitation.listened': true,
  'debate.jwaladesh_hesitation.joined': true,
  'debate.jwaladesh_hesitation.settled': true,
};

/** Kingsmere by night (Chapter 9): Vikram and Edmund with the party, the day's four things done, the Toccata begun, in at
 * the postern, through the iron door into the Crown's archive (data/aldermoor.ts DAY_DONE and KEEP_NIGHT). */
const KINGSMERE_NIGHT: FlagSnapshot = {
  ...AGNIPUR_NIGHT,
  'party.vikram': true,
  'act8.complete': true,
  'card.act8_end': true,
  'ally.jwaladesh': true,
  'story.aldermoor_arrived': true,
  'story.moor_gate': true,
  'story.edmund_met': true,
  'party.edmund': true,
  'story.escort_met': true,
  'story.press_gang_seen': true,
  'story.court_walked': true,
  'story.regent_met': true,
  'story.regent_refused': true,
  'story.almoner_seen': true,
  'story.jordyn_seen': true,
  'story.jordyn_line': true,
  'story.jordyn_offer': true,
  'story.sebastian_met': true,
  'story.chapel_seen': true,
  'side.purge_list.accepted': true,
  'side.purge_list.done': true,
  'clue.list_leaked': true,
  'family.pie': true,
  'family.tea': true,
  'family.constable': true,
  'story.families_warned': true,
  'debate.aldermoor_one_hand.listened': true,
  'debate.aldermoor_one_hand.joined': true,
  'debate.aldermoor_one_hand.settled': true,
  'story.recital_begun': true,
  'story.recital_seen': true,
  'story.postern_open': true,
  'story.keep_archive_entered': true,
};
/** The Assize at dawn (Chapter 9): caught, a night in the cells, the archive's papers in the court's evidence, the court opened. */
const KINGSMERE_ASSIZE: FlagSnapshot = {
  ...KINGSMERE_NIGHT,
  'clue.first_revisiting': true,
  'clue.mirror_filing': true,
  'clue.crown_pact': true,
  'clue.ash_road_accounts': true,
  'anchor.thomas_record': true,
  'story.record_found': true,
  'side.crown_chronicle.accepted': true,
  'side.crown_chronicle.done': true,
  'story.caught': true,
  'evidence.crown_pact': true,
  'evidence.ash_road_accounts': true,
  'evidence.thomas_record': true,
  'evidence.crown_chronicle': true,
  'story.cells_night': true,
  'story.assize_dawn': true,
  'story.assize_opened': true,
};

/** Kirinoura on the day (Chapter 7): Bayarmaa with the party, the letter given, Kayla met, the Spy Ledger accepted. */
const KIRINOURA_DAY: FlagSnapshot = {
  ...BEFORE_LOCKET,
  'item.sun_locket': true,
  'story.yari_asked': true,
  'party.azzy': true,
  'party.samira': true,
  'party.bayarmaa': true,
  'story.benny_joined': true,
  'story.caona_joined': true,
  'act6.complete': true,
  'card.act6_end': true,
  'story.kuroshi_arrived': true,
  'story.observer_seen': true,
  'story.letter_given': true,
  'story.kayla_met': true,
  'side.spy_ledger.accepted': true,
};
/** Kirinoura at night (Chapter 7): the lantern hour over, Haru with the party, his lantern given at the maze gate. */
const KIRINOURA_NIGHT: FlagSnapshot = {
  ...KIRINOURA_DAY,
  'side.spy_ledger.done': true,
  'item.kayla_glyphs': true,
  'debate.kuroshi_silence.settled': true,
  'story.lantern_called': true,
  'party.haru': true,
  'story.haru_met': true,
  'story.maze_seen': true,
  'item.haru_lantern': true,
};

const SKARRAGOL_DUSK: FlagSnapshot = {
  ...BEFORE_LOCKET,
  'item.sun_locket': true,
  'story.yari_asked': true,
  'party.azzy': true,
  'party.samira': true,
  'party.bayarmaa': true,
  'story.benny_joined': true,
  'story.caona_joined': true,
  'act5.complete': true,
  'card.act5_end': true,
  'story.skarragol_arrived': true,
  'story.fair_seen': true,
  'story.moot_seen': true,
  'story.fjord_set_out': true,
  'story.fjord_seen': true,
};

export const PUZZLES: readonly PuzzleDef[] = [
  {
    id: 'warroom_orders',
    title: "The Marshal's night orders (tutorial: Echo and anchors)",
    map: 'zetwal-house',
    spawn: 'study',
    flags: { ...BEFORE_LOCKET, 'item.sun_locket': true },
    goal: { flag: 'clue.night_orders' },
  },
  {
    id: 'zetwal_bridge',
    title: 'The Chain Bridge to the Temple island (signature puzzle: bridge)',
    map: 'zetwal-town',
    spawn: 'bridgehead',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.warroom_intro': true,
      'story.warroom_echo': true,
      'story.warroom_returned': true,
      'anchor.night_orders': true,
      'clue.night_orders': true,
    },
    goal: { flag: 'story.bridge_crossed' },
  },
  {
    id: 'xaragua_cave',
    title: 'The flooded petroglyph cave (signature puzzle: water; PUZZLES.md SIG-XAR parts 1 and 2)',
    map: 'xaragua-cave',
    spawn: 'cave',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'party.anissa': true,
      'story.yari_asked': true,
      'story.council_defied': true,
      'story.thorne_met': true,
      'item.oil_lamp': true,
      'story.cave_entered': true,
    },
    goal: { flag: 'clue.drum_pattern' },
  },
  {
    id: 'ardencia_forge',
    title: "The forge fortress's channels and Benny's lever (signature puzzle: fire; PUZZLES.md SIG-ARD parts 1 and 2)",
    map: 'ardencia-forge',
    spawn: 'cell',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'party.anissa': true,
      'story.yari_asked': true,
      'story.trial_fought': true,
      'story.forge_held': true,
      'story.forge_arrived': true,
      'story.forge_open': true,
    },
    // Out through the far wall, with Azzy: the tunnel's wall shuts behind the party.
    goal: { flag: 'story.tunnel_entered' },
  },
  {
    id: 'aldoria_vault',
    title: 'The guild vault: the balance door and the sun lock (signature puzzle: the ledger; PUZZLES.md SIG-ALD)',
    map: 'aldoria-vault',
    spawn: 'stair',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'party.anissa': true,
      'story.yari_asked': true,
      'party.azzy': true,
      'story.benny_joined': true,
      'story.caona_joined': true,
      'story.samira_met': true,
      'story.vault_refused': true,
      'story.vault_entered': true,
      'story.vault_lamps': true,
    },
    // The witness's chest read: the seventh page, sealed with the Throne's wax.
    goal: { flag: 'clue.sealed_seventh' },
  },
  // Chapter 2's side quests (Oct 20): the two growth puzzles, in the free city before dusk.
  // Z-4 The Seventh Stone (secret, Chapter 1; PUZZLES.md S-ZET, difficulty 2): after the lamp, the mourner's quest taken.
  // Watch the first reading in the temple's memory, carve the seventh stone there with the stonecutter's chisel, then
  // touch the stones in the reading's order (3, 1, 5, 2, 6, 4, 7) and open the drawer under Solange's plinth.
  {
    id: 'zetwal_stones',
    title: 'The Seventh Stone: the first reading, the sun on the seventh, the stones in order (secret; PUZZLES.md S-ZET)',
    map: 'zetwal-temple',
    spawn: 'temple_start',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.warroom_intro': true,
      'story.warroom_echo': true,
      'story.warroom_returned': true,
      'anchor.night_orders': true,
      'clue.night_orders': true,
      'anchor.chain_bridge': true,
      'story.bridge_crossed': true,
      'story.temple_arrived': true,
      'story.lamp_lit': true,
      'story.anissa_woke': true,
      'story.yari_landed': true,
      'story.yari_asked': true,
      'side.seventh_stone.accepted': true,
    },
    goal: { flag: 'side.seventh_stone.done' },
  },
  {
    id: 'xaragua_hutia',
    title: "The Hutia's Hoard: stake the ceiba sapling so it grows a step (PUZZLES.md M-XAR-1)",
    map: 'xaragua-conuco',
    spawn: 'conuco',
    flags: { ...XARAGUA_FREE, 'side.hutia.accepted': true },
    goal: { flag: 'side.hutia.hoard' },
  },
  {
    id: 'xaragua_grove',
    title: 'Medicine for the Cacique: plant the grove where no road will go (PUZZLES.md M-XAR-2)',
    map: 'xaragua-camp',
    spawn: 'camp',
    flags: { ...XARAGUA_FREE, 'story.anaco_met': true, 'side.medicine.accepted': true },
    goal: { flag: 'side.medicine.bark' },
  },
  // Chapter 5 (Oct 22): Eightgate's signature puzzle, the sealing in the Throne Archive (PUZZLES.md SIG-SEA, as the
  // outline's second review 3.4 corrected it): the carved number, the thread in the memory, the keeper's law.
  {
    id: 'seat_accord',
    title: 'The Throne Archive: the drawer the clerk used, and the keeper\'s law (signature puzzle; PUZZLES.md SIG-SEA)',
    map: 'seat-archive',
    spawn: 'archive',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.yari_asked': true,
      'party.azzy': true,
      'party.samira': true,
      'story.benny_joined': true,
      'story.caona_joined': true,
      'story.coco_plan': true,
      'story.disguised': true,
      'story.party_split': true,
      'story.archive_open': true,
      'story.archive_entered': true,
    },
    // Hollis opens the drawer and agrees to take the page to the Parley.
    goal: { flag: 'story.hollis_agreed' },
  },
  // Chapter 6 (Oct 22): Ordvik's signature puzzle, the frozen fjord (PUZZLES.md SIG-SKA, as the outline's second review
  // 3.2 and 3.4 fixed it): five swaps across, the floes now and the ice then, and Sarnai's raid on the far shore's floe
  // in the memory (a step trigger: the crossing ends in the Echo). The herd is the scripted route's and its tests'.
  {
    id: 'skarragol_fjord',
    title: 'The frozen fjord: five swaps across, and Sarnai\'s whistle (signature puzzle; PUZZLES.md SIG-SKA)',
    map: 'skarragol-fjord',
    spawn: 'fjord_path',
    flags: { ...SKARRAGOL_DUSK },
    goal: { flag: 'clue.herd_whistle' },
  },
  // S-3's minor puzzle (M-SKA-1, the wolf run): the boulder on the slope in the memory, the wall across the gully now.
  {
    id: 'skarragol_gully',
    title: 'The wolf run: the boulder above the gully (minor puzzle; PUZZLES.md M-SKA-1)',
    map: 'skarragol-plateau',
    spawn: 'store',
    flags: { ...SKARRAGOL_DUSK, 'story.fjord_set_out': false, 'side.winter_stores.accepted': true, 'side.winter_stores.wolves': true, 'encounter.skarragol_story.wolves.won': true },
    goal: { flag: 'anchor.wolf_run' },
  },
  // Chapter 7 (Oct 22): Kirinoura's signature puzzle in two parts (PUZZLES.md SIG-KUR, with the second review's 3.1,
  // 3.7 and 3.8 fixes). The fog maze: Sayo's agents light the code in the memory at the gate; the six plazas are walked
  // in the present; a wrong way turns the party back to the plaza it left; walking it blind is turned back at the gap.
  {
    id: 'kuroshi_fogmaze',
    title: 'The fog maze: Sayo\'s lanterns in the memory, six plazas now (signature puzzle, part 1; PUZZLES.md SIG-KUR)',
    map: 'kuroshi-fogmaze',
    spawn: 'maze_gate',
    flags: { ...KIRINOURA_NIGHT },
    goal: { flag: 'story.maze_walked' },
  },
  // The file house's screens: Sayo's war room in the memory (the loose screen pegged: the anchor), then four pushes
  // now. Unpegged, the middle screen slips back east after every push and the lanes never open.
  {
    id: 'kuroshi_screens',
    title: 'The screens: the loose peg in Sayo\'s war room, four pushes now (signature puzzle, part 2; PUZZLES.md SIG-KUR)',
    map: 'kuroshi-filehouse',
    spawn: 'filehouse',
    flags: { ...KIRINOURA_NIGHT, 'clue.lantern_code': true, 'story.maze_walked': true, 'story.marsh_reached': true, 'story.boats_home': true, 'story.causeway_lit': true, 'side.lanterns.done': true, 'story.filehouse_entered': true },
    goal: { flag: 'rotor.screens.solved' },
  },
  // K-2's minor puzzle (M-KUR-1, the review's 3.3 fix): the shelving rule learned in the memory at Kayla's desk, the
  // Ash Wars row worked out from it in the sealed stacks, by the high window and the near lane, unseen.
  {
    id: 'kuroshi_stacks',
    title: 'The sealed stacks: the shelving rule at Kayla\'s desk, the Ash Wars row (minor puzzle; PUZZLES.md M-KUR-1)',
    map: 'kuroshi-library',
    spawn: 'library',
    flags: { ...KIRINOURA_DAY },
    goal: { flag: 'item.spy_ledger' },
  },
  // K-3's minor puzzle (M-KUR-2, the review's 3.7 fix: six posts): left at the fork, right at the bend.
  {
    id: 'kuroshi_posts',
    title: 'The marsh posts: left, then right, in Sayo\'s code (minor puzzle; PUZZLES.md M-KUR-2)',
    map: 'kuroshi-marsh',
    spawn: 'marsh',
    flags: { ...KIRINOURA_NIGHT, 'clue.lantern_code': true, 'story.maze_walked': true, 'story.marsh_reached': true, 'side.lanterns.accepted': true },
    goal: { flag: 'story.boats_home' },
  },
  // K-4's secret (S-KUR, built Oct 27): the informant's tune on Sayo's floor fifty years ago, one board nailed there where
  // the rest must fall now, and the tune walked on the relaid floor. Without the nail no board is silent; a wrong nail
  // leaves the rest where no walk can reach it.
  {
    id: 'kuroshi_floor',
    title: 'The singing floor: the tune in the memory, the nail, the walk now (secret item; PUZZLES.md S-KUR)',
    map: 'kuroshi-sayo-house',
    spawn: 'sayo_house',
    flags: {
      ...KIRINOURA_NIGHT,
      'clue.lantern_code': true,
      'story.fox_beaten': true,
      'story.quarter_dawn': true,
      'clue.buyers_mark': true,
      'ally.kuroshi': true,
      'side.letter_floor.accepted': true,
      'story.sayo_house_seen': true,
    },
    goal: { flag: 'story.sayo_box_open' },
  },
  // J-4's secret (S-JWA, built Oct 27): the roll call in the memory (five came home), then the pours: 10 into 7, 7 into 3,
  // 3 into 10, three times round, until the 7 holds five; the 7 into the reservoir, which seals (the anchor).
  {
    id: 'jwaladesh_wick',
    title: 'The little lamps\' measure: five, poured exactly between jars of 10, 7 and 3 (secret item; PUZZLES.md S-JWA)',
    map: 'jwaladesh-harbor',
    spawn: 'oil_store',
    flags: {
      ...AGNIPUR_NIGHT,
      'story.tower_open': true,
      'anchor.chain_lamp': true,
      'anchor.tower_mirror': true,
      'story.beam_at_temple': true,
      'story.flame_seen': true,
      'party.vikram': true,
      'story.dhanraj_beaten': true,
      'side.little_lamps.accepted': true,
    },
    goal: { flag: 'anchor.reservoir_sealed' },
  },
  // Al-4's secret (S-ALM, built Oct 27): the night Thomas wrote, the clock at 11:10 and the watchman climbing in ninety
  // seconds; 215 minutes by the key's gears (twelve of twelve, the rewind, five of twelve), the key out, one tick, and the
  // spare quill from the sill in the escapement (the anchor). Waiting alone is caught; a quill on the wrong tick jams.
  {
    id: 'aldermoor_clock',
    title: 'The tower clock: 11:10 to a quarter to three, by the gears, before the watchman (secret item; PUZZLES.md S-ALM)',
    map: 'aldermoor-clocktower',
    spawn: 'clocktower',
    flags: {
      ...KINGSMERE_ASSIZE,
      'story.record_read': true,
      'story.hushed_beaten': true,
      'encounter.aldermoor_story.hushed.won': true,
      'side.patient_hour.accepted': true,
    },
    goal: { flag: 'anchor.clock_stopped' },
  },
  {
    id: 'jwaladesh_chain',
    title: 'Arjun\'s night: the chain lamp lit and the tower mirror bolted, in the memory (SIG-JWA part 1)',
    map: 'jwaladesh-harbor',
    spawn: 'landing',
    flags: { ...AGNIPUR_NIGHT, 'story.tower_open': true },
    goal: { all: [{ flag: 'anchor.chain_lamp' }, { flag: 'anchor.tower_mirror' }] },
  },
  {
    id: 'jwaladesh_mirrors',
    title: 'The roof mirrors round the Exchange\'s tower: east, north, north, and Anissa\'s disc (SIG-JWA part 2)',
    map: 'jwaladesh-rooftops',
    spawn: 'roofs',
    flags: { ...AGNIPUR_NIGHT, 'story.tower_open': true, 'anchor.chain_lamp': true, 'anchor.tower_mirror': true, 'clue.arjun_charge': true },
    goal: { flag: 'story.beam_at_temple' },
  },
  {
    id: 'jwaladesh_relay',
    title: 'The lamp relay: the runners\' way up the hill, not the main street (minor puzzle; PUZZLES.md M-JWA-1)',
    map: 'jwaladesh-bazaar',
    spawn: 'stair_head',
    flags: { ...AGNIPUR_DAY, 'side.lamp_relay.accepted': true, 'clue.relay_route': true, 'item.relay_lamp': true },
    goal: { flag: 'side.lamp_relay.done' },
  },
  // SIG-ALM part 1 (the Chapter 9 outline, section 3 with its second review's 3.6): the filing floor's memory shows
  // Thomas filing the pact mirrored (the thirty-second year, not the twenty-third) under the house the lie is about; the
  // panel behind the Ash Wars shelf (Al-2) holds his true record, loosened in the memory first. Out only with all three.
  {
    id: 'aldermoor_archive',
    title: 'The Crown\'s archive: the year mirrored, the Brasador red, the panel behind the shelf (SIG-ALM part 1, Al-2)',
    map: 'aldermoor-keep',
    spawn: 'archive_in',
    flags: { ...KINGSMERE_NIGHT },
    goal: { all: [{ flag: 'clue.crown_pact' }, { flag: 'anchor.thomas_record' }, { flag: 'side.crown_chronicle.done' }] },
  },
  // SIG-ALM part 2: the courtroom (the clerk's tree). The roll of the court comes from the dock's memory; the record
  // alone is a word against a word; the Almoner must swear to the public edition first. The three, and it is read.
  {
    id: 'aldermoor_assize',
    title: 'The Assize: the roll from the dock\'s memory, the Almoner pressed, the record laid (SIG-ALM part 2)',
    map: 'aldermoor-keep',
    spawn: 'dock',
    flags: { ...KINGSMERE_ASSIZE },
    goal: { flag: 'story.record_read' },
  },
  // M-ZET-2, the powder cellar (the Chapter 10 outline 8.1 with its second review's 3.12; difficulty 2): under the mill,
  // the smugglers' second cache behind an inner door that hangs open. Fifty years ago the room was the Revolution's
  // powder store, and the powder-master said: bar it and pin it when you go. Drop the bar in the memory, and the cache is
  // shut in, the bar rusted fast into its brackets.
  {
    id: 'zetwal_mill',
    title: 'The powder cellar under the mill: bar it and pin it, fifty years ago (M-ZET-2, Z-6)',
    map: 'zetwal-mill',
    spawn: 'mill_stair',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'story.yari_asked': true,
      'party.azzy': true,
      'party.samira': true,
      'party.bayarmaa': true,
      'party.haru': true,
      'party.vikram': true,
      'party.edmund': true,
      'act9.complete': true,
      'card.act9_end': true,
      'story.muster_begun': true,
      'story.pier_met': true,
      'story.council_condition': true,
      'side.muskets.accepted': true,
      'encounter.muster_story.crew.won': true,
      'choice.crew_spared': true,
      'item.smugglers_ledger': true,
    },
    goal: { all: [{ flag: 'anchor.mill_bar' }, { flag: 'side.muskets.done' }] },
  },
  // The chain post's capstan (the Chapter 11 outline beat 6 with its second review's 3.6; difficulty 2): the Crown's chain
  // runs from the Patience to the old post at the pier's sea end. Fifty years ago, after Caona's stand, the post had a new
  // capstan with an iron pin through its pawl. Pull the pin in the memory, and in the present the capstan cannot hold the
  // chain: it runs out into the harbor.
  {
    id: 'xaragua_pier',
    title: 'Caona\'s stand and the chain post\'s pawl: pull the pin fifty years ago (the War of the Harbor)',
    map: 'xaragua-village',
    spawn: 'pier_head',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'party.yari': true,
      'party.azzy': true,
      'party.samira': true,
      'party.bayarmaa': true,
      'party.haru': true,
      'party.vikram': true,
      'party.edmund': true,
      'story.benny_joined': true,
      'story.xaragua_arrived': true,
      'story.escaped': true,
      'story.crown_attack': true,
      'encounter.xaragua_story.pier.won': true,
      'act10.complete': true,
      'card.act10_end': true,
      'story.war_begun': true,
      'story.landed': true,
      'story.headland_won': true,
      'war.flank_done': true,
      'story.camp_reached': true,
      'story.tide_called': true,
      'story.village_reached': true,
      'story.thorne_taken': true,
      'story.anaco_freed': true,
    },
    goal: { all: [{ flag: 'anchor.chain_post' }, { flag: 'story.chain_dropped' }] },
  },
  // The eighth chair (the Chapter 12 outline section 8 with its second review's 3.12; difficulty 2): forty-nine years ago the
  // chairs stood in a heap in the nave and the masons were bricking up a chamber door. The chamberlain's plan puts Xaraguá's
  // chair "by the wall it has no chamber in". Cut the oath into that one in the memory, and in the present Yari turns the
  // eighth chair round and reads it; a chair from the heap goes to Aldermoor's place with the line on it.
  {
    id: 'seat_chair',
    title: 'The eighth chair: cut the oath where they sit, forty-nine years ago (the Claim)',
    map: 'seat-hall',
    spawn: 'eighth_chair',
    flags: {
      ...BEFORE_LOCKET,
      'item.sun_locket': true,
      'party.yari': true,
      'party.azzy': true,
      'party.samira': true,
      'story.yari_asked': true,
      'act5.complete': true,
      'card.act5_end': true,
      'act11.complete': true,
      'card.act11_end': true,
      'story.claim_arrive_seen': true,
      'story.claim_arrived': true,
      'story.rooms_seen': true,
      'story.elodie_rooms': true,
      'side.seats.handed': true,
      'debate.seat_claim.settled': true,
      'side.volume_one.accepted': true,
      'story.bell_claim': true,
      'story.bell_hall_seen': true,
      'story.chairs_set': true,
      'side.seats.done': true,
    },
    goal: { all: [{ flag: 'anchor.caona_chair' }, { flag: 'story.chair_read' }] },
  },
];
