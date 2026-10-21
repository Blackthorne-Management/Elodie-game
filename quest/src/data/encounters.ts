// Random encounters in each capital's wild section (map layer `encounters`, property `table`). A group
// with `enemies` is a real battle (engine/game.ts rollEncounter); `foes` name them for the Foes page.

import type { EncounterTable } from '../engine/content.ts';

/**
 * Story flags that chapters not built yet will set (owner decision, Oct 14: Chapter 1's only fight is the
 * scripted boar; the wild sections turn violent when the story brings the party back). Maps may read them.
 */
export const LATER_STORY_FLAGS: readonly string[] = [];

export const ENCOUNTERS: Readonly<Record<string, EncounterTable>> = {
  // Scripted fights (data/battles.ts), listed here so the Foes page shows them. No map rolls on this table.
  wilds: {
    id: 'wilds',
    groups: [
      {
        id: 'boar',
        weight: 0,
        level: 3,
        foes: ['Cane-field boar'],
        intro: 'A boar bursts out of the cane.',
        won: 'The boar crashes away into the cane.',
        fled: 'You back away from the boar.',
      },
    ],
  },
  // Chapter 2's scripted fights (data/battles.ts), for the Foes page. No map rolls on this table.
  xaragua_story: {
    id: 'xaragua_story',
    groups: [
      {
        id: 'pier',
        weight: 0,
        level: 4,
        foes: ['Crown Marine', 'Crown Marine', 'Marine sergeant'],
        intro: 'Crown marines block the pier.',
        won: 'The marines retreat to their boat.',
        fled: 'You back away down the pier.',
      },
      {
        id: 'caney',
        weight: 0,
        level: 6,
        foes: ['Crown Marine', 'Crown Musketeer', 'Marine lieutenant'],
        intro: 'Marines storm the caney.',
        won: 'The marines fall back to the terrace.',
        fled: 'You fall back into the hall.',
      },
      {
        id: 'patrol',
        weight: 0,
        level: 5,
        foes: ['Crown Marine', 'Crown Musketeer', 'Marine sergeant'],
        intro: 'A patrol blocks the trail west.',
        won: 'The patrol scatters into the smoke.',
        fled: 'You duck back between the houses.',
      },
      {
        id: 'thorne',
        weight: 0,
        level: 9,
        foes: ['Governor Thorne', 'Crown Marine', 'Crown Musketeer'],
        intro: 'Governor Thorne blocks the sea mouth.',
        won: 'Thorne goes over the side.',
        fled: 'You fall back to the ledge.',
      },
    ],
  },
  // Xaraguá: the Mountain Path up to the hill camp (CAPITALS.md 2; enemies and levels from COMBAT.md 13).
  mountain_path: {
    id: 'mountain_path',
    groups: [
      {
        id: 'marines',
        enemies: ['crown_marine', 'crown_marine'],
        weight: 3,
        level: 4,
        foes: ['Crown Marine', 'Crown Marine'],
        intro: 'Two Crown marines come down the path, muskets slung. "Papers. Now."',
        won: 'The marines retreat down the mountain, muttering about the heat.',
        fled: 'You slip off the path into the ferns until their boots are gone.',
      },
      {
        id: 'musket',
        enemies: ['crown_musketeer', 'crown_marine'],
        weight: 2,
        level: 6,
        foes: ['Crown Musketeer', 'Crown Marine'],
        intro: 'A musket barks from the trees. "Halt in the name of the Governor!"',
        won: 'The musketeer drops his powder horn and runs.',
        fled: 'You duck under the ferns and the shot goes wide.',
      },
      {
        id: 'crabs',
        enemies: ['mangrove_crab', 'mangrove_crab'],
        weight: 2,
        level: 4,
        foes: ['Mangrove Crab', 'Mangrove Crab'],
        intro: 'Two crabs the size of shields scuttle out of a stream, claws up.',
        won: 'The crabs clatter back into the water.',
        fled: 'You back away. Crabs do not chase uphill. Mostly.',
      },
      {
        id: 'bandits',
        enemies: ['road_bandit', 'road_bandit'],
        weight: 2,
        level: 5,
        foes: ['Road Bandit', 'Road Bandit'],
        intro: 'Bandits step from behind a fig tree. "Mountain toll. Everything you carry."',
        won: 'The bandits melt into the cloud forest.',
        fled: 'You run. The mountain is on your side.',
      },
      {
        id: 'hushers',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 6,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures wait on the path, utterly still. "Hush. Where is the little one?"',
        won: 'The veiled pair step back into the mist and are gone.',
        fled: 'You turn and climb another way. They do not follow. Yet.',
      },
    ],
  },
  // Chapter 3's scripted fights (data/battles.ts), for the Foes page. No map rolls on this table.
  ardencia_story: {
    id: 'ardencia_story',
    groups: [
      {
        id: 'rael',
        weight: 0,
        level: 13,
        foes: ['Rael', 'Captain Rivera', 'Jaime'],
        intro: 'Rael walks onto the sand.',
        won: 'Rael ends it himself.',
        fled: 'There is no leaving the ring.',
      },
      {
        id: 'bats',
        weight: 0,
        level: 10,
        foes: ['Cave Bat', 'Cave Bat', 'Cave Bat'],
        intro: 'Bats pour out of the narrow.',
        won: 'The bats whirl away down the tube.',
        fled: 'You back into the dark.',
      },
    ],
  },
  // Ardencia (Chapter 3; outline section 5): the sea road up the Cinder Flats, levels 8 to 10 on the way up.
  cinder_flats: {
    id: 'cinder_flats',
    groups: [
      {
        id: 'salamanders',
        enemies: ['cinder_salamander', 'cinder_salamander'],
        weight: 3,
        level: 8,
        foes: ['Cinder Salamander', 'Cinder Salamander'],
        intro: 'Two salamanders slide out of a steaming crack, their backs glowing like coals.',
        won: 'The salamanders hiss and slip back into the rock.',
        fled: 'You back off the hot ground. They do not follow into the cool.',
      },
      {
        id: 'bats',
        enemies: ['cave_bat', 'cave_bat', 'cave_bat'],
        weight: 2,
        level: 8,
        foes: ['Cave Bat', 'Cave Bat', 'Cave Bat'],
        intro: 'A shriek from a lava tube, and the air is full of wings.',
        won: 'The bats scatter back into the dark.',
        fled: 'You cover your heads and run until the shrieking stops.',
      },
      {
        id: 'bandit_deserter',
        enemies: ['road_bandit', 'brasador_halberdier'],
        weight: 2,
        level: 9,
        foes: ['Road Bandit', 'Brasador Halberdier'],
        intro: 'A bandit and a deserter in a torn black coat block the road. "Toll for the sea road."',
        won: 'The deserter throws down his halberd and runs for the strand.',
        fled: 'You slip back down the road into the steam.',
      },
      {
        id: 'hushers',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 9,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures stand in the steam of a spring. "Hush. Where is the little one?"',
        won: 'The veiled pair step back into the steam and are gone.',
        fled: 'You run. The steam closes behind you.',
      },
    ],
  },
  // After the escape (story.ardencia_escaped): Brasador patrols hunt the party on the strand road. Their hooks
  // stun; they mean to take the party back, not to kill (no Bound: that is Rael's rule only).
  cinder_patrols: {
    id: 'cinder_patrols',
    groups: [
      {
        id: 'halberdiers',
        enemies: ['brasador_halberdier', 'brasador_halberdier'],
        weight: 1,
        level: 11,
        foes: ['Brasador Halberdier', 'Brasador Halberdier'],
        intro: 'A Brasador patrol, halberds low. "The Lord wants his guests back. Come quietly."',
        won: 'The halberdiers fall back up the road toward the walls.',
        fled: 'You run for the strand. The patrol is slower in its coats.',
      },
    ],
  },
  // Zetwal: the Cane Road beyond the east gate.
  cane_road: {
    id: 'cane_road',
    groups: [
      {
        id: 'bandits',
        enemies: ['road_bandit', 'road_bandit'],
        weight: 3,
        level: 6,
        foes: ['Road Bandit', 'Road Bandit'],
        intro: 'Two bandits step out of the cane, knives low. "Festival toll, archivist. Everything you carry."',
        won: 'They drop their knives and vanish between the stalks.',
        fled: 'You sprint back down the road. Their laughter follows you.',
      },
      {
        id: 'smugglers',
        enemies: ['smuggler', 'smuggler', 'lookout'],
        weight: 2,
        level: 7,
        foes: ['Smuggler', 'Smuggler', 'Lookout'],
        intro: 'Smugglers, hauling Crown-stamped crates through the field. "You saw nothing. Say it."',
        won: 'The smugglers abandon a crate and scatter toward the mangroves.',
        fled: 'You slip away before the lookout can whistle for more.',
      },
      {
        id: 'hushers',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 9,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures rise from the ditch without a sound. "Hush, little archivist. Where is your sister?"',
        won: 'The veiled pair back away into the cane, still watching you.',
        fled: 'You run. When you look back, the road behind you is empty.',
      },
    ],
  },
};
