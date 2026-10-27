// Zetwal: the plaza on the festival of Elodie's Gaze, the family house, the docks, the east gate, and
// the bridgehead over the chasm to the Temple of Elodie's island. The Echo is the same square fifty
// years ago, the night before the Sun Accord was signed: a revolutionary camp of tents and barricades.

import { Grid, type MapSource, type ObjSpec } from './painter.ts';
import { BAKERY_TOWN_DOOR } from '../../src/data/bakery.ts';
import { BEFORE_NIGHT_TEXT, DAY_TEXT, DUSK_TEXT, MUSTER_HOUSES, NIGHT_TEXT, PLAZA } from '../../src/data/muster.ts';

const OPENS_HOME = { if: 'story.elodie_left', closed: 'plaza_door_closed' };
const OPENS_CITY = { if: 'story.warroom_echo', closed: 'plaza_door_closed' };

export function zetwalTown(): MapSource {
  const W = 40;
  const H = 28;
  const g = new Grid(W, H, '.');

  // Borders: trees north and west, the harbor south, the chasm and the island north-east.
  g.rect(0, 0, 30, 1, 'T').rect(0, 0, 1, 24, 'T');
  g.rect(1, 1, 25, 1, 'T');
  g.rect(0, 24, W, 4, '~');
  g.rect(1, 23, 29, 1, 'n');
  g.rect(30, 0, 4, 15, '~'); // the chasm
  g.rect(34, 0, 6, 14, 'T'); // the island
  g.rect(34, 14, 6, 1, '~');
  g.rect(30, 15, 10, 1, 'C');
  g.rect(39, 16, 1, 8, '#'); // the east gate wall

  // Island landing: the old Chain Bridge's far end and the path to the Temple.
  g.rect(35, 8, 4, 3, ',');
  g.set(38, 9, 'D');
  g.set(34, 4, ',').rect(35, 4, 1, 4, ',');

  // Houses. The family house (door at 5,5) is north-west.
  g.rect(2, 2, 7, 2, '^').rect(2, 4, 7, 2, '#').set(5, 5, 'D');
  g.rect(10, 2, 4, 2, '^').rect(10, 4, 4, 1, '#');
  g.rect(22, 2, 4, 2, '^').rect(22, 4, 4, 1, '#');
  g.rect(2, 16, 6, 2, '^').rect(2, 18, 6, 2, '#');
  g.rect(12, 18, 5, 2, '^').rect(12, 20, 5, 2, '#');
  // The harbor bakery's back door (Z-5), facing the harbor lane.
  g.set(BAKERY_TOWN_DOOR.x, BAKERY_TOWN_DOOR.y, 'D');

  // The plaza: paving, the stage, lanterns, fountain, the Marshal's Stone, stalls.
  g.rect(10, 5, 16, 11, ':');
  g.rect(15, 3, 6, 2, '_');
  g.set(14, 4, 'L').set(21, 4, 'L').set(10, 15, 'L').set(25, 15, 'L');
  g.set(14, 3, 'N').set(21, 3, 'N');
  g.rect(17, 10, 2, 2, 'ŵ'); // the fountain (drawn as an object below)
  g.set(12, 8, 'M');
  g.set(10, 12, 'S').set(10, 13, 'S');
  g.set(24, 12, 'S').set(25, 12, 'S');

  // Paths: west lane, south to the harbor, the road to the east gate, the bridgehead.
  g.rect(1, 10, 9, 1, ',');
  g.rect(8, 11, 1, 12, ',');
  g.rect(20, 16, 2, 3, ',');
  g.rect(20, 19, 19, 2, ',');
  g.rect(37, 20, 2, 1, 'K');
  g.rect(26, 2, 4, 1, 'T');
  g.rect(26, 3, 4, 2, ',');
  g.rect(26, 5, 1, 4, ',');
  g.rect(26, 9, 4, 3, ',');
  g.set(30, 4, 'r').set(33, 4, 'r');
  g.set(34, 9, 'R');
  g.set(27, 8, 'P').set(28, 8, 'W').set(29, 8, 'p');
  g.rect(27, 5, 3, 3, 'B');

  // Harbor dock and boats.
  g.rect(6, 24, 2, 2, 'k').set(8, 25, 'c').set(20, 25, 'c');

  // Gardens and trees.
  g.rect(2, 7, 3, 1, 'f').rect(3, 12, 3, 1, 'f');
  // The debate corner: a paved patch on the lawn below the plaza, flowers either side.
  g.rect(21, 16, 6, 3, ':').set(20, 17, 'f').set(27, 17, 'f');
  for (const [x, y] of [[1, 14], [9, 17], [10, 21], [18, 22], [25, 22], [28, 18], [33, 22], [35, 17], [29, 13], [27, 14]] as const) {
    g.set(x, y, 'T');
  }
  g.rect(31, 17, 2, 1, 'B');

  // Doors to the other sections: the east gate to the Cane Road, the west lane to the Iron Market (and
  // the Hall of the Accord), the shore west to the Old Harbor, the steps north up to Accord Square and the Hall of the Accord.
  g.set(39, 19, 'D');
  g.set(0, 10, 'D');
  g.set(0, 23, 'D');
  g.rect(18, 1, 1, 2, ',').set(18, 0, 'D');

  // ---- The Echo: fifty years ago ----------------------------------------------------------------
  const e = g.map({
    '.': '"',
    ',': ';',
    ':': ';',
    f: '"',
    T: 'Y',
    B: 'Y',
    S: 't',
    L: 'x',
    N: 'x',
    'ŵ': 't',
    M: '&',
    W: 'w',
    p: 'y',
    P: 'Z',
    r: '~',
    K: 'x',
    D: 'D',
    '#': '%',
  });
  // Tents and barricades where the newer houses and stalls stand.
  e.rect(10, 2, 4, 3, '"').rect(10, 3, 2, 1, 't');
  e.rect(22, 2, 4, 3, '"').rect(23, 3, 2, 1, 't');
  e.rect(12, 18, 5, 4, '"').rect(13, 19, 3, 1, 't');
  e.set(15, 12, 't').set(21, 13, 't').set(22, 6, 't').set(4, 13, 't').set(5, 13, 't');
  e.rect(30, 19, 1, 2, 'x');

  const objects: ObjSpec[] = [
    // People of the present.
    npc('elodie', 17, 4, 'down', { if: '!story.heard_speech' }),
    npc('elodie_gate', 36, 20, 'left', { npc: 'elodie', if: 'story.heard_speech, !story.elodie_left' }),
    npc('gaze_keeper', 13, 6, 'down'),
    npc('soup_vendor', 11, 12, 'right'),
    npc('recruiter_a', 23, 7, 'down'),
    npc('recruiter_b', 24, 9, 'left'),
    // The debate corner on the lawn below the plaza (data/debates.ts).
    npc('debate_keeper', 22, 17, 'right'),
    npc('debate_recruiter', 25, 17, 'left'),
    npc('debate_onlooker', 23, 18, 'up'),
    npc('debate_onlooker_2', 24, 16, 'down', { npc: 'debate_onlooker' }),
    npc('town_guard', 22, 10, 'left'),
    npc('festival_kid', 19, 13, 'up'),
    npc('elder', 4, 11, 'right'),
    npc('ferryman', 9, 23, 'down'),
    // The pilgrim came for the festival; at the Muster the plaza is a camp (the Chapter 10 review's 3.6).
    npc('pilgrim', 15, 14, 'up', { if: '!story.muster_begun' }),
    // Vendors: the charm stand and the market stand on the plaza, the forge by the harbor road.
    npc('charm_seller', 23, 12, 'right'),
    npc('grocer', 11, 13, 'right'),
    npc('smith', 9, 19, 'left', { if: '!story.muster_begun' }),
    // At the Muster the forge has Kingsmere's tier-24 pieces in too (a shop has no condition: a second stock).
    npc('smith_muster', 9, 19, 'left', { if: 'story.muster_begun' }),
    // People of the memory.
    npc('echo_soldier', 14, 7, 'down', { era: 'echo' }),
    npc('echo_cook', 20, 13, 'left', { era: 'echo' }),
    npc('echo_scout', 9, 22, 'down', { era: 'echo' }),
    npc('echo_sentry', 26, 10, 'right', { era: 'echo' }),
    npc('echo_drummer', 18, 6, 'down', { era: 'echo' }),

    // The opening keeps you in the plaza (owner decision, Oct 16): home opens once Mother has left, the
    // rest once the first Echo (the war room) is done; until then Anissa says why (plaza_door_closed).
    { layer: 'doors', name: 'town_house', x: 5, y: 5, props: { target: 'house_front', map: 'zetwal-house', exit: 'down', ...OPENS_HOME } },
    { layer: 'doors', name: 'town_market', x: 0, y: 10, props: { target: 'market_plaza', map: 'zetwal-market', exit: 'right', ...OPENS_CITY } },
    { layer: 'doors', name: 'town_harbor', x: 0, y: 23, props: { target: 'harbor_plaza', map: 'zetwal-harbor', exit: 'right', ...OPENS_CITY } },
    { layer: 'doors', name: 'town_square', x: 18, y: 0, props: { target: 'square_plaza', map: 'zetwal-square', exit: 'down', ...OPENS_CITY } },
    { layer: 'doors', name: 'town_gate', x: 39, y: 19, props: { target: 'road_gate', map: 'zetwal-road', exit: 'left', ...OPENS_CITY } },
    { layer: 'doors', name: 'town_temple', x: 38, y: 9, props: { target: 'temple_bridge', map: 'zetwal-temple', exit: 'left', ...OPENS_CITY } },
    // Z-5 (Oct 27): the bakery's back door, on the harbor lane behind the plaza's south row.
    { layer: 'doors', name: 'town_bakery', x: BAKERY_TOWN_DOOR.x, y: BAKERY_TOWN_DOOR.y, props: { target: 'bakery_out', map: 'zetwal-bakery', exit: 'down', ...OPENS_CITY } },

    { layer: 'spawns', name: 'start', x: 8, y: 10, props: { facing: 'right', era: 'present' } },
    { layer: 'spawns', name: 'bridgehead', x: 25, y: 10, props: { facing: 'right', era: 'present' } },

    trigger('intro', 8, 10, { dialogue: 'intro_festival', flag: 'story.festival_intro', once: true, onEnter: true }),
    trigger('bridge_cross', 31, 9, { dialogue: 'bridge_cross', flag: 'story.bridge_crossed', once: true, if: 'anchor.chain_bridge' }),
    trigger('bridge_look', 26, 4, { dialogue: 'bridge_look', flag: 'story.bridge_seen', once: true, if: '!anchor.chain_bridge' }, 1, 1),

    // The festival crowd on the plaza (demo review, Oct 17: the intro ends on a packed plaza); after the lamp,
    // the evening's last few. Pictures only: they stroll, never block, and nobody talks to them.
    // "Then, across the water, every lantern in Zetwal" (gaze_lamp.wake): lit from then on.
    obj('plaza_lantern_nw', 14, 4, { kind: 'lantern_glow', era: 'present', if: 'story.anissa_woke' }),
    obj('plaza_lantern_ne', 21, 4, { kind: 'lantern_glow', era: 'present', if: 'story.anissa_woke' }),
    obj('plaza_lantern_sw', 10, 15, { kind: 'lantern_glow', era: 'present', if: 'story.anissa_woke' }),
    obj('plaza_lantern_se', 25, 15, { kind: 'lantern_glow', era: 'present', if: 'story.anissa_woke' }),
    { layer: 'crowds', name: 'plaza_festival', x: 11, y: 6, w: 14, h: 9, props: { count: '18', looks: 'festival_a,festival_b,festival_c,festival_d,festival_e,festival_f,festival_g,festival_h', if: '!story.anissa_woke' } },
    { layer: 'crowds', name: 'plaza_evening', x: 11, y: 6, w: 14, h: 9, props: { count: '6', looks: 'festival_a,festival_b,festival_c,festival_d,festival_e,festival_f,festival_g,festival_h', if: 'story.anissa_woke, !story.muster_begun' } },
    { layer: 'echo_zones', name: 'plaza_stone', x: 11, y: 9, w: 3, h: 2, props: { if: 'item.sun_locket', onEcho: 'plaza_echo_enter' } },
    {
      layer: 'echo_zones',
      name: 'bridgehead',
      x: 27,
      y: 9,
      w: 3,
      h: 3,
      props: { if: 'item.sun_locket, clue.night_orders', onEcho: 'bridge_echo_enter', onReturn: 'bridge_echo_return' },
    },

    // The bridge puzzle (guide 6.2, signature puzzle for Zetwal): the Chain Bridge is raised in the
    // memory; Patricio lowers it with the winch (memory only) and pins the pawl (the anchor).
    obj('rope_bridge', 30, 4, { dialogue: 'rope_bridge', era: 'present' }),
    obj('plaque', 27, 8, { dialogue: 'plaque', era: 'present' }),
    obj('winch_rusted', 28, 8, { dialogue: 'winch_present', era: 'present' }),
    obj('pawl_rusted', 29, 8, { dialogue: 'pawl_present', era: 'present' }),
    obj('pawl_pinned', 29, 8, { era: 'present', kind: 'pawl_pinned', if: 'anchor.chain_bridge' }),
    obj('winch', 28, 8, { dialogue: 'winch_echo', era: 'echo' }),
    obj('pawl', 29, 8, { dialogue: 'pawl_echo', era: 'echo' }),
    obj('chain_bridge_echo', 30, 9, { era: 'echo', kind: 'bridge', walkable: true, if: 'echo.chain_bridge_down|anchor.chain_bridge' }, 5, 1),
    obj('chain_bridge', 30, 9, { era: 'present', kind: 'bridge_old', walkable: true, if: 'anchor.chain_bridge' }, 5, 1),
    // The bridge's far end standing upright while it is raised (a picture only; the water blocks).
    obj('chain_bridge_raised', 34, 9, { era: 'present', kind: 'chain_bridge_up', if: '!anchor.chain_bridge' }),
    obj('chain_bridge_raised_echo', 34, 9, { era: 'echo', kind: 'chain_bridge_up', if: '!echo.chain_bridge_down, !anchor.chain_bridge' }),
    obj('plaza_fountain', 17, 10, { kind: 'fountain', era: 'present' }, 2, 2),
    obj('monument', 12, 8, { dialogue: 'marshal_stone', era: 'present' }),
    obj('stone_pile', 12, 8, { dialogue: 'marshal_stone_echo', era: 'echo' }),
    obj('signing_stage', 17, 3, { dialogue: 'signing_stage_echo', era: 'echo' }),

    { layer: 'anchors', name: 'chain_bridge_pin', x: 29, y: 8, props: { object: 'pawl', flag: 'anchor.chain_bridge' } },
    ...musterPlaza(),
  ];
  return { id: 'zetwal-town', present: g, echo: e, objects };
}

/**
 * The Muster (Chapter 10; data/muster.ts places it): the plaza as a camp by day (each house's people, banner and crowd;
 * Joaquin and the sergeant by the fountain; the Dorini table on the west lane; Jordyn's company with nobody near them),
 * the companies drawn up in lines at dusk with old Patricio at the stage's foot, the fires banked at night (the
 * captain's walk is a scene: data/dialogue/zetwalMuster.ts), and the Echo's morning of the signing.
 */
function musterPlaza(): ObjSpec[] {
  const p = PLAZA;
  const day = DAY_TEXT;
  const camp = BEFORE_NIGHT_TEXT;
  const out: ObjSpec[] = [
    // The camp's scene plays on the first step onto the paving after the pier; the watch walks up on the first step onto
    // it after the council (the second review's 3.17: onto the plaza, not the pier).
    trigger('muster_camp', p.paving.x, p.paving.y, { dialogue: 'muster_camp', flag: 'story.plaza_camp_seen', once: true, if: 'story.pier_met' }, p.paving.w, p.paving.h),
    trigger('muster_watch', p.paving.x, p.paving.y, { dialogue: 'muster_watch', flag: 'story.watch_landed', once: true, if: 'story.council_condition' }, p.paving.w, p.paving.h),
    // Night: the first step on the paving after the inspection (the fires banked), the buyer's captain leaves his line.
    trigger('muster_night', p.paving.x, p.paving.y, { dialogue: 'muster_night_walk', flag: 'story.betrayer_walked', once: true, if: NIGHT_TEXT }, p.paving.w, p.paving.h),
    // Free Brasador by the fountain (Azzy's company; Joaquin carried it).
    npc('joaquin_day', p.joaquin.x, p.joaquin.y, 'right', { npc: 'joaquin_muster', if: day }),
    npc('fb_sergeant_day', p.sergeant.x, p.sergeant.y, 'left', { npc: 'fb_sergeant', if: day }),
    // The Ironvow at the east gate: the quartermaster takes gifts of gold until the whistle; Salkhi has found grass.
    npc('ironvow_camp', p.ironvowCamp.x, p.ironvowCamp.y, 'up', { if: camp }),
    ...p.horses.map((h, i) => npc(`muster_horse_${i + 1}`, h.x, h.y, 'left', { npc: 'muster_horse', if: camp })),
    npc('salkhi_town', p.salkhi.x, p.salkhi.y, 'right', { if: 'story.muster_begun, !act10.complete' }),
    // The Suzumori under the stage's west end, the Agnivansh under its east end, fourteen tiles apart.
    npc('suzumori_camp', p.suzumoriCamp.x, p.suzumoriCamp.y, 'down', { if: camp }),
    obj('suzumori_pole', p.suzumoriPole.x, p.suzumoriPole.y, { kind: 'banner_lantern_pole', solid: true, era: 'present', if: camp }),
    npc('agnivansh_camp', p.agnivanshCamp.x, p.agnivanshCamp.y, 'down', { if: camp }),
    obj('agnivansh_lamp', p.agnivanshLamp.x, p.agnivanshLamp.y, { kind: 'brass_lamp_post', solid: true, era: 'present', if: camp }),
    // The Dorini on the west lane: the table, the admiral (the day), the marines.
    obj('dorini_table', p.doriniTable.x, p.doriniTable.y, { kind: 'dorini_table', solid: true, era: 'present', if: camp }),
    npc('admiral_day', p.admiral.x, p.admiral.y, 'down', { npc: 'dorini_admiral', if: day }),
    obj('fb_banner', 15, 11, { kind: 'banner_free_brasador', solid: true, era: 'present', if: camp }),
    obj('ironvow_banner', 33, 18, { kind: 'banner_horsetail', solid: true, era: 'present', if: camp }),
    // Jordyn's company at the plaza's south-east edge, by themselves.
    npc('jordyn_day', p.jordyn.x, p.jordyn.y, 'left', { npc: 'jordyn_muster', if: `story.watch_landed, ${day}` }),
    ...p.watch.map((w, i) => npc(`watch_day_${i + 1}`, w.x, w.y, 'left', { npc: 'watch_muster', if: `story.watch_landed, ${day}` })),
    npc('printer_day', p.printer.x, p.printer.y, 'left', { npc: 'printer_muster', if: `story.watch_landed, ${day}` }),
    obj('violet_banner', 26, 14, { kind: 'banner_violet', solid: true, era: 'present', if: `story.watch_landed, ${camp}` }),
    // Old Patricio at the Marshal's stone from the blessing until the vote (the outline's beat 5, the review's 3.3).
    npc('patricio_stone', p.patricioStone.x, p.patricioStone.y, 'right', { npc: 'patricio_muster', if: `story.blessing, ${day}` }),
    // The camps (pictures that stroll inside their camp), until the lines are drawn up.
    { layer: 'crowds', name: 'camp_free_brasador', x: 14, y: 12, w: 6, h: 2, props: { count: '4', looks: 'free_brasador', if: day } },
    { layer: 'crowds', name: 'camp_dorini', x: 2, y: 11, w: 5, h: 2, props: { count: '3', looks: 'dorini_marine', if: day } },
    { layer: 'crowds', name: 'camp_ironvow', x: 28, y: 21, w: 6, h: 2, props: { count: '3', looks: 'horn_rider', if: day } },
    { layer: 'crowds', name: 'camp_suzumori', x: 9, y: 5, w: 4, h: 1, props: { count: '2', looks: 'gate_guard_kq', if: day } },
    { layer: 'crowds', name: 'camp_agnivansh', x: 24, y: 5, w: 2, h: 1, props: { count: '1', looks: 'flame_keeper', if: day } },
    // Dusk: the companies in lines across the paving, old Patricio at the stage's foot with the whistle.
    npc('patricio_dusk', p.stageFoot.x, p.stageFoot.y, 'down', { npc: 'patricio_muster', if: DUSK_TEXT }),
    ...Object.entries(p.lines).flatMap(([house, tiles]) =>
      tiles.map((t, i) => npc(`line_${house}_${i + 1}`, t.x, t.y, 'up', { npc: `line_${house}`, if: DUSK_TEXT })),
    ),
    ...MUSTER_HOUSES.map((h) => npc(`captain_dusk_${h.house}`, p.captains[h.house]!.x, p.captains[h.house]!.y, 'up', { npc: `${h.captain}_line`, if: DUSK_TEXT })),
    npc('jordyn_dusk', p.jordynLine.x, p.jordynLine.y, 'up', { npc: 'jordyn_muster', if: DUSK_TEXT }),
    npc('joaquin_dusk', p.joaquinLine.x, p.joaquinLine.y, 'up', { npc: 'joaquin_muster', if: DUSK_TEXT }),
    npc('rahel_dusk', p.rahelDusk.x, p.rahelDusk.y, 'left', { npc: 'rahel', if: DUSK_TEXT }),
    npc('patricia_dusk', p.patriciaDusk.x, p.patriciaDusk.y, 'left', { npc: 'patricia', if: DUSK_TEXT }),
    // The Echo's morning of the signing (Chapter 10's scene on the built plaza_stone zone): two armies among the tents,
    // young Benny and Caona at the stage's foot, the Crown's envoy coming up the harbor road (the second review's 3.7:
    // Echo people are placed, crowds are the present's only).
    npc('benny_signing', 16, 5, 'down', { npc: 'benny_signing', era: 'echo', if: 'story.muster_begun' }),
    npc('caona_signing', 19, 5, 'down', { npc: 'caona_signing', era: 'echo', if: 'story.muster_begun' }),
    ...[[13, 11], [14, 11], [15, 12], [20, 12], [21, 11], [22, 11]].map(([x, y], i) =>
      npc(`echo_army_${i + 1}`, x!, y!, 'up', { npc: i < 3 ? 'echo_army_zetwal' : 'echo_army_brasador', era: 'echo', if: 'story.muster_begun' }),
    ),
  ];
  // The dawn: nobody on the plaza but the city's own (the companies are at the harbor).
  return out;
}

function npc(name: string, x: number, y: number, facing: string, props: Record<string, string> = {}): ObjSpec {
  return { layer: 'npcs', name, x, y, props: { npc: name, facing, ...props } };
}

function trigger(name: string, x: number, y: number, props: Record<string, string | boolean>, w = 1, h = 1): ObjSpec {
  return { layer: 'triggers', name, x, y, w, h, props };
}

function obj(name: string, x: number, y: number, props: Record<string, string | boolean>, w = 1, h = 1): ObjSpec {
  return { layer: 'puzzle_objects', name, x, y, w, h, props };
}

export { npc, obj, trigger };
