// Random encounters in each capital's wild section (map layer `encounters`, property `table`). A group
// with `enemies` is a real battle (engine/game.ts rollEncounter); `foes` name them for the Foes page.

import type { EncounterTable } from '../engine/content.ts';

/**
 * Story flags that chapters not built yet will set (owner decision, Oct 14: Chapter 1's only fight is the
 * scripted boar; the wild sections turn violent when the story brings the party back). Maps may read them.
 */
export const LATER_STORY_FLAGS: readonly string[] = [
  // Chapter 12, the Claim: the Throne Hall's rope comes down (tools/maps/seat.ts, built now for reuse).
  'story.claim_begun',
];

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
        level: 5,
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
        level: 7,
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
  // Chapter 4's scripted fight (data/battles.ts), for the Foes page. No map rolls on this table.
  aldoria_story: {
    id: 'aldoria_story',
    groups: [
      {
        id: 'qasim',
        weight: 0,
        level: 14,
        foes: ['Guildmaster Qasim', 'Caravan Raider', 'Caravan Raider'],
        intro: 'Qasim comes down the stair with the guild\'s blades.',
        won: 'Qasim yields, and his blades walk out.',
        fled: 'There is no way past them but through.',
      },
    ],
  },
  // Chapter 5's scripted fight (data/battles.ts), for the Foes page.
  seat_story: {
    id: 'seat_story',
    groups: [
      {
        id: 'deserters',
        weight: 0,
        level: 14,
        foes: ['Deserter Sergeant', 'Deserter', 'Deserter'],
        intro: 'Three men in old Crown coats at the crossroads. "Toll. Everything in the bags."',
        won: 'The Sergeant lowers his bayonet, and his men step back with him.',
        fled: 'You back away up the road.',
      },
    ],
  },
  // Chapter 6's scripted fights (data/battles.ts), for the Foes page.
  skarragol_story: {
    id: 'skarragol_story',
    groups: [
      {
        id: 'wolves',
        weight: 0,
        level: 16,
        foes: ['Steppe Wolf', 'Steppe Wolf', 'Steppe Wolf'],
        intro: 'Three wolves come up the gully to the winter store.',
        won: 'The wolves break and run back down the gully.',
        fled: 'You back away from the store.',
      },
      {
        id: 'lookouts',
        weight: 0,
        level: 17,
        foes: ['Steppe Reaver', 'Steppe Reaver', 'Camp lookout'],
        intro: 'A horn, and two reavers ride out of the sledges.',
        won: 'The reavers ride for the far tents, and the lookout runs after them.',
        fled: 'You back away to the meadow.',
      },
      {
        id: 'champion',
        weight: 0,
        level: 17,
        foes: ['Champion of the eastern clans'],
        intro: 'The champion of the eastern clans offers Azzy a bout.',
        won: 'The champion lowers her practice sabre.',
        fled: 'Azzy steps back from the bout.',
      },
      {
        id: 'grimvald',
        weight: 0,
        level: 17,
        foes: ['Noyan Grimvald'],
        intro: 'Grimvald comes out of his tent and mounts.',
        won: 'Grimvald yields, and the standard is on the grass.',
        fled: 'There is no way off this shore but through him.',
      },
    ],
  },
  // The Winter Plateau (Chapter 6; the outline section 5 with its review 3.1): wolves, reavers who ride for whoever
  // pays, the camp's lookouts, and the Quiet Crown, who have heard about a girl who glows even up here. Levels 16 to 17,
  // the top of the road's tier; ambushes pay by the party's level (AMBUSH_XP).
  winter_plateau: {
    id: 'winter_plateau',
    groups: [
      {
        id: 'wolves',
        enemies: ['steppe_wolf', 'steppe_wolf', 'steppe_wolf'],
        weight: 3,
        level: 16,
        foes: ['Steppe Wolf', 'Steppe Wolf', 'Steppe Wolf'],
        intro: 'Grey shapes in the grey grass. Three wolves, and the wind behind them.',
        won: 'The wolves lope off toward the snow line.',
        fled: 'You run for the road. They do not follow onto it.',
      },
      {
        id: 'pack',
        enemies: ['steppe_wolf', 'steppe_wolf', 'steppe_wolf', 'steppe_wolf'],
        weight: 1,
        level: 17,
        foes: ['Steppe Wolf', 'Steppe Wolf', 'Steppe Wolf', 'Steppe Wolf'],
        intro: 'A whole pack rises out of the grass at once.',
        won: 'The pack scatters over the plateau.',
        fled: 'You back toward the road, slowly.',
      },
      {
        id: 'reavers',
        enemies: ['steppe_reaver', 'steppe_reaver', 'lookout'],
        weight: 2,
        level: 16,
        foes: ['Steppe Reaver', 'Steppe Reaver', 'Lookout'],
        intro: 'Two riders and a lookout on foot. "Envoys pay toll on the plateau. Grimvald says so."',
        won: 'The reavers wheel away over the rise.',
        fled: 'You run for the road. Riders do not leave the grass.',
      },
      {
        id: 'raiders',
        enemies: ['steppe_reaver', 'steppe_reaver'],
        weight: 2,
        level: 17,
        foes: ['Steppe Reaver', 'Steppe Reaver'],
        intro: 'Two reavers come over the rise at a gallop, sabres low.',
        won: 'They ride off the way they came.',
        fled: 'You dive for the road.',
      },
      {
        id: 'zealots',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 16,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures stand very still in the grass. "The little one glows, they say. Even up here."',
        won: 'The veiled pair walk away into the wind.',
        fled: 'You run. The grass closes where they stood.',
      },
    ],
  },
  // The Crossroads Fields outside Eightgate (Chapter 5; the outline section 5): the Crown's own deserters, road
  // bandits, and the Quiet Crown, who have heard about a little girl who glows. Levels 14 to 15.
  crossroads: {
    id: 'crossroads',
    groups: [
      {
        id: 'deserters',
        enemies: ['deserter', 'deserter'],
        weight: 3,
        level: 14,
        foes: ['Deserter', 'Deserter'],
        intro: 'Two men in faded Crown coats step out of the grass. "The Regent says we are not here. Pay us anyway."',
        won: 'They step back into the grass, bayonets down.',
        fled: 'You run for the road. They do not chase far.',
      },
      {
        id: 'bandits',
        enemies: ['road_bandit', 'road_bandit', 'road_bandit'],
        weight: 2,
        level: 14,
        foes: ['Road Bandit', 'Road Bandit', 'Road Bandit'],
        intro: 'Three bandits rise out of the ditch. "Envoys! Envoys always have something."',
        won: 'The bandits scatter toward the hills.',
        fled: 'You slip back to the road.',
      },
      {
        id: 'zealots',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 15,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures stand very still in the grass. "The little one glows, they say. Hush, and give her to us."',
        won: 'The veiled pair walk back into the long grass.',
        fled: 'You run. The grass closes where they stood.',
      },
    ],
  },
  // Chapter 7's scripted fights (data/battles.ts), for the Foes page.
  kuroshi_story: {
    id: 'kuroshi_story',
    groups: [
      {
        id: 'cutpurses',
        weight: 0,
        level: 19,
        foes: ['Fog Cutpurse', 'Fog Cutpurse', 'Fog Cutpurse'],
        intro: 'Three cutpurses in the sealed stacks turn round with their arms full of boxes.',
        won: 'The cutpurses drop the boxes and go out by the window.',
        fled: 'You back out by the window.',
      },
      {
        id: 'moths',
        weight: 0,
        level: 18,
        foes: ['Lantern Moth', 'Lantern Moth', 'Lantern Moth', 'Lantern Moth'],
        intro: 'Lantern moths come out of the fog at the lit post.',
        won: 'The moths scatter into the fog.',
        fled: 'You step back from the light.',
      },
      {
        id: 'fox',
        weight: 0,
        level: 19,
        foes: ['The Paper Fox', 'Paper decoy', 'Paper decoy', 'Paper decoy'],
        intro: 'The broker puts on his paper fox mask, and three of him step out from behind the screens.',
        won: 'The Paper Fox kneels among torn paper.',
        fled: 'There is no way out of the file house but past him.',
      },
    ],
  },
  // The Fog Marsh (Chapter 7; the outline section 5, re-levelled by the levels pass's ambush rule): moths at the lights,
  // cutpurses on the reed paths, and the first Hushers, who came for a girl who glows. Levels 17 to 19, the tier's top.
  // The causeways are safe; only the reed paths roll.
  fog_marsh: {
    id: 'fog_marsh',
    groups: [
      {
        id: 'moths',
        enemies: ['lantern_moth', 'lantern_moth', 'lantern_moth', 'lantern_moth'],
        weight: 2,
        level: 17,
        foes: ['Lantern Moth', 'Lantern Moth', 'Lantern Moth', 'Lantern Moth'],
        intro: 'Pale wings out of the fog, turning toward your light all at once.',
        won: 'The moths drift off into the fog.',
        fled: 'You shutter the light and back away.',
      },
      {
        id: 'cutpurses',
        enemies: ['fog_cutpurse', 'fog_cutpurse'],
        weight: 2,
        level: 18,
        foes: ['Fog Cutpurse', 'Fog Cutpurse'],
        intro: 'Two grey hoods in the reeds. "Purses, envoys. The fog takes a toll."',
        won: 'The cutpurses melt back into the reeds.',
        fled: 'You run for the causeway. They do not follow onto it.',
      },
      {
        id: 'cutpurse_husher',
        enemies: ['fog_cutpurse', 'husher'],
        weight: 1,
        level: 18,
        foes: ['Fog Cutpurse', 'Husher'],
        intro: 'A cutpurse, and behind her a veiled figure who makes no sound at all.',
        won: 'The veiled one steps back into the fog, and the cutpurse after it.',
        fled: 'You run for the causeway.',
      },
      {
        id: 'hushers',
        enemies: ['qc_zealot', 'qc_zealot', 'husher'],
        weight: 1,
        level: 19,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot', 'Husher'],
        intro: 'Three veils in the reeds. "The little one glows, they say. Even in the fog."',
        won: 'The veils go back into the fog without a word.',
        fled: 'You run. The reeds close where they stood.',
      },
    ],
  },
  // The Desert Edge past the caravan gate (Chapter 4; CAPITALS.md 3, re-levelled to 11 to 13 by the outline): raiders on
  // the caravan road, smugglers, and the Quiet Crown, who have heard about a little girl who glows.
  desert_edge: {
    id: 'desert_edge',
    groups: [
      {
        id: 'raiders',
        enemies: ['caravan_raider', 'caravan_raider'],
        weight: 3,
        level: 12,
        foes: ['Caravan Raider', 'Caravan Raider'],
        intro: 'Two raiders rise out of the dune, scarves over their faces. "The guild\'s water costs a copper. Your purse costs more."',
        won: 'The raiders drop back over the dune.',
        fled: 'You run for the road. Sand slows them more than you.',
      },
      {
        id: 'raider_bandits',
        enemies: ['caravan_raider', 'road_bandit', 'road_bandit'],
        weight: 2,
        level: 11,
        foes: ['Caravan Raider', 'Road Bandit', 'Road Bandit'],
        intro: 'A raider and two bandits from the ruined caravanserai. "Toll for the Desert Edge."',
        won: 'They scatter back toward the ruin.',
        fled: 'You slip back to the road before they close in.',
      },
      {
        id: 'smugglers',
        enemies: ['smuggler', 'smuggler'],
        weight: 2,
        level: 12,
        foes: ['Smuggler', 'Smuggler'],
        intro: 'Smugglers with a string of mules, Crown-stamped crates under the sacking. "You saw sand. Say it."',
        won: 'The smugglers abandon a crate and drive the mules off.',
        fled: 'You leave them to their mules.',
      },
      {
        id: 'hushers',
        enemies: ['qc_zealot', 'qc_zealot'],
        weight: 1,
        level: 13,
        foes: ['Quiet Crown Zealot', 'Quiet Crown Zealot'],
        intro: 'Two veiled figures stand still in the heat. "The little one glows, they say. Hush, and give her to us."',
        won: 'The veiled pair walk back into the haze.',
        fled: 'You run. The heat shimmers where they stood.',
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
