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
];
